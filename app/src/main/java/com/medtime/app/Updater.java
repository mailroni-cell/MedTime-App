package com.medtime.app;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.webkit.WebView;

import androidx.core.content.FileProvider;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * M-058: in-app updates. Every GitHub build publishes the rolling release "latest"
 * (MedTime-latest.apk + build-info.txt "run N / sha"). versionCode = 100 + N, so a higher N = newer.
 * The APK is signed with the same fixed key, so Android installs it over the current app (data kept).
 * Results go back to the page as window.mtUpd(json).
 */
class Updater {
    static final String BASE = "https://github.com/mailroni-cell/MedTime-App/releases/download/latest/";
    private static volatile boolean busy = false;

    static int currentRun(Activity a) {
        try {
            PackageInfo pi = a.getPackageManager().getPackageInfo(a.getPackageName(), 0);
            long vc = Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
            return (int) vc - 100;
        } catch (Exception e) { return 0; }
    }

    private static void send(Activity a, WebView wv, String json) {
        a.runOnUiThread(() -> wv.evaluateJavascript("window.mtUpd && mtUpd(" + json + ")", null));
    }

    static HttpURLConnection open(String url) throws Exception {
        HttpURLConnection c = null;
        // follow redirects by hand (github -> objects.githubusercontent.com)
        for (int i = 0; i < 6; i++) {
            c = (HttpURLConnection) new URL(url).openConnection();
            c.setConnectTimeout(15000);
            c.setReadTimeout(30000);
            c.setInstanceFollowRedirects(false);
            c.setRequestProperty("User-Agent", "MedTime");
            int code = c.getResponseCode();
            if (code >= 300 && code < 400) {
                String loc = c.getHeaderField("Location");
                c.disconnect();
                if (loc == null) throw new Exception("redirect");
                url = new URL(new URL(url), loc).toString();
                continue;
            }
            if (code != 200) { c.disconnect(); throw new Exception("http " + code); }
            return c;
        }
        throw new Exception("redirects");
    }

    /** Reads build-info.txt and reports {type:'check', ok, cur, latest}. */
    static void check(Activity a, WebView wv) {
        final int cur = currentRun(a);
        // Google Play edition: updates come only from the store, so the app is always "up to date" here
        if (BuildConfig.STORE) { send(a, wv, "{\"type\":\"check\",\"ok\":true,\"cur\":" + cur + ",\"latest\":" + cur + "}"); return; }
        new Thread(() -> {
            try {
                HttpURLConnection c = open(BASE + "build-info.txt?t=" + System.currentTimeMillis());
                StringBuilder sb = new StringBuilder();
                try (BufferedReader r = new BufferedReader(new InputStreamReader(c.getInputStream()))) {
                    String line; while ((line = r.readLine()) != null) sb.append(line).append('\n');
                }
                c.disconnect();
                Matcher m = Pattern.compile("run\\s+(\\d+)").matcher(sb);
                int latest = m.find() ? Integer.parseInt(m.group(1)) : -1;
                send(a, wv, "{\"type\":\"check\",\"ok\":" + (latest > 0) + ",\"cur\":" + cur + ",\"latest\":" + latest + "}");
            } catch (Exception e) {
                send(a, wv, "{\"type\":\"check\",\"ok\":false,\"cur\":" + cur + ",\"latest\":-1}");
            }
        }).start();
    }

    /** Downloads the APK (progress {type:'progress', pct}) and opens the Android installer. */
    static void download(Activity a, WebView wv) {
        if (busy || BuildConfig.STORE) return;
        if (Build.VERSION.SDK_INT >= 26 && !a.getPackageManager().canRequestPackageInstalls()) {
            // Android asks once: "allow MedTime to install apps".
            // M-076: the page first explains it kindly, then opens the screen (openInstallPermission).
            send(a, wv, "{\"type\":\"permission\"}");
            return;
        }
        busy = true;
        new Thread(() -> {
            File dir = new File(a.getCacheDir(), "updates");
            File f = new File(dir, "MedTime-update.apk");
            try {
                dir.mkdirs();
                HttpURLConnection c = open(BASE + "MedTime-latest.apk?t=" + System.currentTimeMillis());
                long total = c.getContentLengthLong(), got = 0;
                int lastPct = -1;
                try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(f)) {
                    byte[] buf = new byte[64 * 1024];
                    int n;
                    while ((n = in.read(buf)) > 0) {
                        out.write(buf, 0, n);
                        got += n;
                        int pct = total > 0 ? (int) (got * 100 / total) : -1;
                        if (pct != lastPct) { lastPct = pct; send(a, wv, "{\"type\":\"progress\",\"pct\":" + pct + "}"); }
                    }
                }
                c.disconnect();
                if (total > 0 && got != total) throw new Exception("short");
                send(a, wv, "{\"type\":\"ready\"}");
                // M-212 (owner): install by itself and open the app again afterwards
                a.getSharedPreferences("medtime_upd", 0).edit().putBoolean("relaunch", true).apply();
                if (InstallReceiver.installSession(a, f)) return;
                Uri uri = FileProvider.getUriForFile(a, a.getPackageName() + ".updates", f);
                Intent i = new Intent(Intent.ACTION_VIEW);
                i.setDataAndType(uri, "application/vnd.android.package-archive");
                i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                a.runOnUiThread(() -> {
                    try { a.startActivity(i); } catch (Exception e) { send(a, wv, "{\"type\":\"error\"}"); }
                });
            } catch (Exception e) {
                f.delete();
                send(a, wv, "{\"type\":\"error\"}");
            } finally {
                busy = false;
            }
        }).start();
    }
}
