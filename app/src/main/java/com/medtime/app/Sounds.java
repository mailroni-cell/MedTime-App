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
    static final String KEY_ALERT_VOL = "alert_volume"; // M-032: 0-100, share of the phone's alarm volume
    static final String KEY_VOICE_VOL = "voice_volume";

    private static Ringtone preview;
    private static final Handler handler = new Handler(Looper.getMainLooper());

    /** M-027: MedTime's own sounds in res/raw (mt_*.ogg), made for the app. Title is translated on the page. */
    static final String[] APP_SOUNDS = {"alien", "arcade", "bird_chirp", "black_hole", "bubbles", "celesta", "chime_up", "church_bells", "comet", "crickets", "crystal_bells", "cuckoo", "digital", "dolphin", "doorbell", "fairy", "fanfare", "flute", "frog", "glass", "gong", "handpan", "harp", "heartbeat", "kalimba", "laser", "magic_wand", "marimba", "meditation", "morning_birds", "music_box", "nebula", "nightingale", "ocean", "orbit", "orchestra", "owl", "piano_rise", "pizzicato", "pulsar", "rain", "retro_phone", "robot", "rooster", "scanner", "seagulls", "sonar", "space_ping", "starfall", "steel_drum", "sunrise", "synth_pluck", "tabla", "tibetan_bowl", "ukulele", "warp", "water_drops", "whale", "wind_chimes", "wood_block", "xylophone", "zen"};

    /** [{title, uri, kind}] MedTime sounds, then the phone's alarm sounds, then notification sounds. */
    static String list(Context ctx) {
        JSONArray out = new JSONArray();
        for (String n : APP_SOUNDS) {
            try {
                out.put(new JSONObject().put("title", n)
                        .put("uri", "android.resource://" + ctx.getPackageName() + "/raw/mt_" + n).put("kind", "medtime"));
            } catch (Exception ignored) { }
        }
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

    /** M-032: alert sound / voice volume chosen in settings, 0..1 (default full). */
    static float alertVolume(Context ctx) {
        return ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getInt(KEY_ALERT_VOL, 100) / 100f;
    }

    static float voiceVolume(Context ctx) {
        return ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getInt(KEY_VOICE_VOL, 100) / 100f;
    }

    static void setVolumes(Context ctx, int alert, int voice) {
        ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).edit()
                .putInt(KEY_ALERT_VOL, Math.max(0, Math.min(100, alert)))
                .putInt(KEY_VOICE_VOL, Math.max(0, Math.min(100, voice))).apply();
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
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                r.setLooping(false);
                r.setVolume(alertVolume(ctx));
            }
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
