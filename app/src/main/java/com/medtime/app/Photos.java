package com.medtime.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.net.Uri;
import android.util.Base64;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

/**
 * M-148: optional photo of each medicine (owner: helps older users recognise the right pill).
 * One small JPEG per medicine name inside the app; shown in the reminders list and on the reminder screen.
 */
class Photos {
    static final int MAX = 720;

    static File dir(Context ctx) {
        File d = new File(ctx.getFilesDir(), "photos");
        if (!d.exists()) d.mkdirs();
        return d;
    }

    static File file(Context ctx, String name) {
        String k = Stock.key(name);
        return new File(dir(ctx), "p" + Integer.toHexString(k.hashCode()) + ".jpg");
    }

    /** Reads the picked / taken image, turns it upright, makes it small and saves it for this medicine. */
    static boolean save(Context ctx, String name, Uri uri) {
        if (name == null || name.trim().isEmpty() || uri == null) return false;
        try {
            BitmapFactory.Options o = new BitmapFactory.Options();
            o.inJustDecodeBounds = true;
            try (InputStream in = ctx.getContentResolver().openInputStream(uri)) { BitmapFactory.decodeStream(in, null, o); }
            int side = Math.max(o.outWidth, o.outHeight), sample = 1;
            while (side / (sample * 2) >= MAX) sample *= 2;
            BitmapFactory.Options o2 = new BitmapFactory.Options();
            o2.inSampleSize = sample;
            Bitmap b;
            try (InputStream in = ctx.getContentResolver().openInputStream(uri)) { b = BitmapFactory.decodeStream(in, null, o2); }
            if (b == null) return false;
            int rot = 0;
            try (InputStream in = ctx.getContentResolver().openInputStream(uri)) {
                int or = new android.media.ExifInterface(in).getAttributeInt(android.media.ExifInterface.TAG_ORIENTATION, 1);
                rot = or == 6 ? 90 : or == 3 ? 180 : or == 8 ? 270 : 0;
            } catch (Exception ignored) { }
            float scale = Math.min(1f, (float) MAX / Math.max(b.getWidth(), b.getHeight()));
            Matrix m = new Matrix();
            m.postScale(scale, scale);
            if (rot != 0) m.postRotate(rot);
            Bitmap out = Bitmap.createBitmap(b, 0, 0, b.getWidth(), b.getHeight(), m, true);
            try (FileOutputStream f = new FileOutputStream(file(ctx, name))) { out.compress(Bitmap.CompressFormat.JPEG, 82, f); }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /** "data:image/jpeg;base64,..." for the page, or "" when there is no photo. */
    static String dataUrl(Context ctx, String name) {
        File f = file(ctx, name);
        if (!f.isFile()) return "";
        try (InputStream in = new java.io.FileInputStream(f)) {
            ByteArrayOutputStream o = new ByteArrayOutputStream();
            byte[] buf = new byte[16384]; int n;
            while ((n = in.read(buf)) > 0) o.write(buf, 0, n);
            return "data:image/jpeg;base64," + Base64.encodeToString(o.toByteArray(), Base64.NO_WRAP);
        } catch (Exception e) {
            return "";
        }
    }

    static void delete(Context ctx, String name) {
        File f = file(ctx, name);
        if (f.exists()) f.delete();
    }

    /** Photo of the first medicine of a reminder that has one (for the reminder screen), or null. */
    static Bitmap firstOf(Context ctx, String itemsJson) {
        try {
            JSONArray a = new JSONArray(itemsJson == null ? "[]" : itemsJson);
            for (int i = 0; i < a.length(); i++) {
                JSONObject it = a.optJSONObject(i);
                if (it == null) continue;
                File f = file(ctx, it.optString("name"));
                if (f.isFile()) return BitmapFactory.decodeFile(f.getAbsolutePath());
            }
        } catch (Exception ignored) { }
        return null;
    }
}
