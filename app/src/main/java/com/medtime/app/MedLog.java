package com.medtime.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * M-080: "did I take it?" log. One entry per reminder answer: taken / skipped / missed.
 * Kept on the phone (last 600 entries) and included in the backup file.
 */
class MedLog {
    static final String PREFS = "medtime_log";
    static final String KEY = "log";
    static final int MAX = 600;

    static synchronized void record(Context ctx, Intent src, String status) {
        try {
            int id = src.getIntExtra(Reminders.EXTRA_ID, 0);
            if (id == 0) return; // test reminder
            if (Reminders.isWater(src)) return; // M-317: water reminders are not medicines
            long now = System.currentTimeMillis();
            String day = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date(now));
            String time = src.getStringExtra(Reminders.EXTRA_TIME);
            if (time == null || time.isEmpty()) time = new SimpleDateFormat("HH:mm", Locale.US).format(new Date(now));
            JSONArray items = new JSONArray();
            for (String l : Reminders.lines(ctx, src.getStringExtra(Reminders.EXTRA_ITEMS), true)) items.put(l);

            SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            JSONArray log = new JSONArray(p.getString(KEY, "[]"));
            // a late answer replaces the "missed" mark of the same reminder on the same day
            for (int i = log.length() - 1; i >= 0 && i >= log.length() - 20; i--) {
                JSONObject o = log.getJSONObject(i);
                if (o.optInt("id") == id && day.equals(o.optString("d")) && time.equals(o.optString("t"))) {
                    if ("missed".equals(o.optString("s")) || !"missed".equals(status)) { log.remove(i); }
                    else return; // already answered, keep the answer
                    break;
                }
            }
            JSONObject e = new JSONObject();
            e.put("id", id).put("d", day).put("t", time).put("items", items).put("s", status).put("at", now);
            log.put(e);
            while (log.length() > MAX) log.remove(0);
            p.edit().putString(KEY, log.toString()).apply();
        } catch (Exception ignored) { }
    }

    static String get(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "[]");
    }

    static void set(Context ctx, String json) {
        try {
            new JSONArray(json);
            ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, json).apply();
        } catch (Exception ignored) { }
    }
}
