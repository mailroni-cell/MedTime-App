package com.medtime.app;

import android.content.Context;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashSet;
import java.util.Set;

/**
 * M-367: calm-mode videos that are not inside the APK. The page plays them straight from the release "media"
 * the first time, while this class saves a copy on the phone; from then on they play from the phone, offline.
 */
class Media {
    static final String URL = "https://github.com/mailroni-cell/MedTime-App/releases/download/media/";
    private static final Set<String> busy = new HashSet<>();

    static File dir(Context c) { return new File(c.getFilesDir(), "media"); }

    /** M-368: recorded calm voices of one language: file:// folder when on the phone, or "" (then the zip downloads once). */
    static String calm(Context ctx, String lang) {
        if (lang == null || !lang.matches("[a-z]{2}")) return "";
        final Context c = ctx.getApplicationContext();
        final File d = new File(new File(c.getFilesDir(), "calm"), lang);
        if (new File(d, ".ok").exists()) return "file://" + d.getAbsolutePath() + "/";
        final String key = "calm_" + lang;
        synchronized (busy) { if (!busy.add(key)) return ""; }
        new Thread(() -> {
            File tmp = new File(d.getParentFile(), lang + ".tmp");
            java.net.HttpURLConnection con = null;
            try {
                del(tmp); tmp.mkdirs();
                con = Updater.open(URL + key + ".zip");
                String root = tmp.getCanonicalPath() + File.separator;
                try (java.util.zip.ZipInputStream z = new java.util.zip.ZipInputStream(new java.io.BufferedInputStream(con.getInputStream()))) {
                    java.util.zip.ZipEntry e; byte[] b = new byte[65536];
                    while ((e = z.getNextEntry()) != null) {
                        File f = new File(tmp, e.getName());
                        if (!f.getCanonicalPath().startsWith(root)) continue; // no ../ in the zip
                        if (e.isDirectory()) { f.mkdirs(); continue; }
                        f.getParentFile().mkdirs();
                        try (OutputStream out = new FileOutputStream(f)) { int n; while ((n = z.read(b)) > 0) out.write(b, 0, n); }
                    }
                }
                del(d);
                if (tmp.renameTo(d)) new File(d, ".ok").createNewFile();
            } catch (Exception ignored) {
            } finally {
                if (con != null) try { con.disconnect(); } catch (Exception ignored) { }
                if (tmp.exists()) del(tmp);
                synchronized (busy) { busy.remove(key); }
            }
        }, "calm-get").start();
        return "";
    }

    private static void del(File f) {
        if (f == null || !f.exists()) return;
        File[] k = f.listFiles();
        if (k != null) for (File x : k) del(x);
        f.delete();
    }

    /** file:// address of the saved copy, or "" (then a background download starts). */
    static String file(Context ctx, String name) {
        if (name == null || !name.matches("[a-z0-9_]{1,40}\\.(mp4|ogg)")) return "";
        final Context c = ctx.getApplicationContext();
        File f = new File(dir(c), name);
        if (f.exists() && f.length() > 0) return "file://" + f.getAbsolutePath();
        synchronized (busy) { if (!busy.add(name)) return ""; }
        new Thread(() -> {
            File tmp = new File(dir(c), name + ".tmp");
            java.net.HttpURLConnection con = null;
            try {
                dir(c).mkdirs();
                con = Updater.open(URL + name);
                long len = con.getContentLengthLong();
                try (InputStream in = con.getInputStream(); OutputStream out = new FileOutputStream(tmp)) {
                    byte[] b = new byte[65536]; int n; while ((n = in.read(b)) > 0) out.write(b, 0, n);
                }
                if (len <= 0 || tmp.length() == len) tmp.renameTo(f);
            } catch (Exception ignored) {
            } finally {
                if (con != null) try { con.disconnect(); } catch (Exception ignored) { }
                if (tmp.exists()) tmp.delete();
                synchronized (busy) { busy.remove(name); }
            }
        }, "media-get").start();
        return "";
    }
}
