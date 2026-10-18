package com.medtime.app;

import android.content.Context;
import android.database.Cursor;
import android.media.AudioAttributes;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

/** M-011: reminder sound chosen in settings, from the phone's own alarm and notification sounds. */
public class Sounds {

    static final String KEY_SOUND = "sound_uri"; // "" = phone's default alarm, "none" = silent
    static final String KEY_LOW_VISION = "low_vision";

    private static Ringtone preview;
    private static final Handler handler = new Handler(Looper.getMainLooper());

    /** [{title, uri}] alarm sounds first, then notification sounds. */
    static String list(Context ctx) {
        JSONArray out = new JSONArray();
        addAll(ctx, RingtoneManager.TYPE_ALARM, out);
        addAll(ctx, RingtoneManager.TYPE_NOTIFICATION, out);
        return out.toString();
    }

    private static void addAll(Context ctx, int type, JSONArray out) {
        try {
            RingtoneManager rm = new RingtoneManager(ctx);
            rm.setType(type);
            Cursor c = rm.getCursor();
            int n = 0;
            while (c.moveToNext() && n < 40) {
                String title = c.getString(RingtoneManager.TITLE_COLUMN_INDEX);
                Uri uri = rm.getRingtoneUri(c.getPosition());
                out.put(new JSONObject().put("title", title).put("uri", uri.toString())
                        .put("kind", type == RingtoneManager.TYPE_ALARM ? "alarm" : "notification"));
                n++;
            }
        } catch (Exception ignored) { }
    }

    static String chosen(Context ctx) {
        return ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getString(KEY_SOUND, "");
    }

    static void choose(Context ctx, String uri) {
        ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).edit().putString(KEY_SOUND, uri == null ? "" : uri).apply();
    }

    static boolean lowVision(Context ctx) {
        return ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getBoolean(KEY_LOW_VISION, false);
    }

    static void setLowVision(Context ctx, boolean on) {
        ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).edit().putBoolean(KEY_LOW_VISION, on).apply();
    }

    /** Ringtone for a uri ("" = default alarm), on the alarm volume. Null for "none". */
    static Ringtone ringtone(Context ctx, String uriStr) {
        if ("none".equals(uriStr)) return null;
        Uri uri = (uriStr == null || uriStr.isEmpty()) ? RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM) : Uri.parse(uriStr);
        if (uri == null) uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        Ringtone r = RingtoneManager.getRingtone(ctx, uri);
        if (r != null) {
            r.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build());
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) r.setLooping(false);
        }
        return r;
    }

    /** Play a sound for up to 4 seconds (settings "test" button). */
    static void preview(Context ctx, String uri) {
        stopPreview();
        preview = ringtone(ctx.getApplicationContext(), uri);
        if (preview == null) return;
        preview.play();
        handler.postDelayed(Sounds::stopPreview, 4000);
    }

    static void stopPreview() {
        handler.removeCallbacksAndMessages(null);
        if (preview != null) {
            try { preview.stop(); } catch (Exception ignored) { }
            preview = null;
        }
    }
}
