package com.medtime.app;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * M-334 (owner): quick web updates over the internet, no PC or cable needed.
 * A page-only push publishes web.zip + web-info.txt ("web <sha> base <versionCode>") on the "test" release.
 * When the app opens or comes back, it reads web-info.txt; if it was made for this exact installed version
 * and is new, it downloads web.zip into files/web (the same folder the M-140 PC watcher uses) with base.txt.
 * MainActivity then reloads the page from it (data stays: same base address).
 */
class WebUpdate {
    static final String BASE = "https://github.com/mailroni-cell/MedTime-App/releases/download/test/";
    private static volatile boolean busy = false;
    private static long lastCheck = 0;

    interface Done { void ready(); }

    static void check(MainActivity a, Done done) {
        if (BuildConfig.STORE || busy) return;
        long now = System.currentTimeMillis();
        if (now - lastCheck < 60_000) return;
        lastCheck = now;
        busy = true;
        new Thread(() -> {
            try {
                long vc = Updater.currentRun(a) + 100;
                HttpURLConnection c = Updater.open(BASE + "web-info.txt?t=" + now);
                String info;
                try (BufferedReader r = new BufferedReader(new InputStreamReader(c.getInputStream()))) { info = String.valueOf(r.readLine()); }
                c.disconnect();
                Matcher m = Pattern.compile("web\\s+(\\w+)\\s+base\\s+(\\d+)").matcher(info);
                if (!m.find() || !m.group(2).equals(String.valueOf(vc))) return;
                String sha = m.group(1);
                File dir = a.getExternalFilesDir("web");
                if (dir == null) return;
                if (sha.equals(read(new File(dir, "sha.txt"))) && String.valueOf(vc).equals(read(new File(dir, "base.txt")))) return;

                // unzip into a fresh folder first, then swap, so a broken download never leaves half a page
                File tmp = new File(dir.getParentFile(), "web_new");
                wipe(tmp);
                tmp.mkdirs();
                HttpURLConnection z = Updater.open(BASE + "web.zip?t=" + now);
                int files = 0;
                try (ZipInputStream zin = new ZipInputStream(z.getInputStream())) {
                    ZipEntry e; byte[] b = new byte[65536];
                    while ((e = zin.getNextEntry()) != null) {
                        String name = e.getName();
                        if (e.isDirectory() || name.contains("..")) continue;
                        File f = new File(tmp, name);
                        File p = f.getParentFile(); if (p != null) p.mkdirs();
                        try (FileOutputStream o = new FileOutputStream(f)) { int n; while ((n = zin.read(b)) > 0) o.write(b, 0, n); }
                        files++;
                    }
                }
                z.disconnect();
                if (files == 0 || !new File(tmp, "index.html").isFile()) { wipe(tmp); return; }
                write(new File(tmp, "base.txt"), String.valueOf(vc));
                write(new File(tmp, "sha.txt"), sha);
                wipe(dir);
                if (!tmp.renameTo(dir)) return;
                android.util.Log.i("MedTimeWeb", "web update " + sha + " for " + vc + " downloaded (" + files + " files)");
                a.runOnUiThread(done::ready);
            } catch (Exception e) {
                android.util.Log.w("MedTimeWeb", "web update check failed: " + e);
            } finally { busy = false; }
        }).start();
    }

    private static String read(File f) {
        try (BufferedReader r = new BufferedReader(new FileReader(f))) { return String.valueOf(r.readLine()).trim(); }
        catch (Exception e) { return ""; }
    }

    private static void write(File f, String s) throws java.io.IOException {
        try (FileWriter w = new FileWriter(f)) { w.write(s + "\n"); }
    }

    private static void wipe(File f) {
        if (f == null || !f.exists()) return;
        File[] k = f.listFiles();
        if (k != null) for (File x : k) wipe(x);
        f.delete();
    }
}
