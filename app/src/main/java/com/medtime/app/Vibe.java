package com.medtime.app;

import android.content.Context;
import android.media.AudioAttributes;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;

/**
 * M-079: vibration chosen in settings. The notification channel itself no longer vibrates
 * (channel v3); the reminder service plays the chosen pattern here.
 */
class Vibe {
    static final String KEY = "vibe"; // off / soft / normal / strong / heart / long
    static final String DEF = "normal";

    // timings (ms, starting with a pause) and strength 0-255, each about 4 s long
    private static long[] timings(String k) {
        switch (k) {
            case "soft":   return new long[]{0, 250, 600, 250, 600, 250, 600, 250};
            case "strong": return new long[]{0, 900, 250, 900, 250, 900, 250, 900};
            case "heart":  return new long[]{0, 120, 120, 220, 650, 120, 120, 220, 650, 120, 120, 220, 650, 120, 120, 220};
            case "long":   return new long[]{0, 3800};
            default:       return new long[]{0, 600, 300, 600, 300, 900, 400, 600};
        }
    }
    private static int[] amps(String k, int n) {
        int a = "soft".equals(k) ? 90 : "strong".equals(k) ? 255 : "heart".equals(k) ? 230 : "long".equals(k) ? 200 : 190;
        int[] r = new int[n];
        for (int i = 0; i < n; i++) r[i] = (i % 2 == 0) ? 0 : a;
        return r;
    }

    static String chosen(Context ctx) {
        return ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getString(KEY, DEF);
    }

    // M-098: strong vibration every 30 s while the reminder window waits for an answer (on by default)
    static final String KEY_NAG = "vibe_nag";
    static boolean nagOn(Context ctx) {
        return ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getBoolean(KEY_NAG, true);
    }
    static void setNag(Context ctx, boolean on) {
        ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).edit().putBoolean(KEY_NAG, on).apply();
    }

    static void choose(Context ctx, String k) {
        ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).edit().putString(KEY, k == null ? DEF : k).apply();
    }

    /** Plays a pattern once (k == null: the chosen one). */
    @SuppressWarnings("deprecation")
    static void play(Context ctx, String k) {
        if (k == null) k = chosen(ctx);
        if ("off".equals(k)) return;
        try {
            Vibrator v = (Vibrator) ctx.getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            v.cancel();
            long[] t = timings(k);
            if (Build.VERSION.SDK_INT >= 26) {
                VibrationEffect e = v.hasAmplitudeControl()
                        ? VibrationEffect.createWaveform(t, amps(k, t.length), -1)
                        : VibrationEffect.createWaveform(t, -1);
                v.vibrate(e, new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).build());
            } else {
                v.vibrate(t, -1);
            }
        } catch (Exception ignored) { }
    }

    static void stop(Context ctx) {
        try {
            Vibrator v = (Vibrator) ctx.getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null) v.cancel();
        } catch (Exception ignored) { }
    }
}
