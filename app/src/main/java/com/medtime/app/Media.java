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

    /** file:// address of the saved copy, or "" (then a background download starts). */
    static String file(Context ctx, String name) {
        if (name == null || !name.matches("[a-z0-9_]{1,40}\\.mp4")) return "";
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
