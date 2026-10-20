package com.medtime.app;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.Locale;

/**
 * M-132: pill stock. Every "taken" lowers the count of each medicine in the reminder;
 * at the warning level a notification says it is time to buy more (once a day).
 * Stored as {"key": {"n": name, "left": 28, "low": 5, "w": "yyyy-MM-dd"}}.
 */
class Stock {
    static final String PREFS = "medtime_stock";
    static final String KEY = "stock";

    static String key(String name) { return name == null ? "" : name.trim().toLowerCase(Locale.ROOT); }

    static String get(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, "{}");
    }

    static void set(Context ctx, String json) {
        try {
            new JSONObject(json);
            ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, json).apply();
            Widget.refresh(ctx);
        } catch (Exception ignored) { }
    }

    private static final String[] COUNTABLE = {"כדור", "כמוסה", "tablet", "capsule", "comprim", "gélule", "capsul", "حبة", "كبسولة"};
    private static final String[] HALF = {"חצי", "half", "demi", "jumătate", "نصف"};

    /** How much of the stock one dose uses: tablets / capsules by number, anything else (mg, ml, drops...) = 1. */
    static double perTake(String dose) {
        String d = dose == null ? "" : dose.trim().toLowerCase(Locale.ROOT);
        if (d.isEmpty()) return 1;
        double num = 1;
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("^([\\d]+(?:[.,]\\d+)?)").matcher(d);
        if (m.find()) { try { num = Double.parseDouble(m.group(1).replace(',', '.')); } catch (Exception ignored) { } }
        else if (d.startsWith("½")) num = 0.5;
        else if (d.startsWith("¼")) num = 0.25;
        boolean half = false;
        for (String h : HALF) if (d.contains(h)) { half = true; break; }
        boolean count = half;
        for (String c : COUNTABLE) if (d.contains(c)) { count = true; break; }
        if (!count) return 1;
        return half ? num * 0.5 : num;
    }

    static synchronized void taken(Context ctx, String itemsJson) {
        try {
            SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
            JSONObject all = new JSONObject(p.getString(KEY, "{}"));
            JSONArray items = new JSONArray(itemsJson == null ? "[]" : itemsJson);
            String today = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
            boolean changed = false;
            for (int i = 0; i < items.length(); i++) {
                JSONObject it = items.optJSONObject(i);
                if (it == null) continue;
                JSONObject s = all.optJSONObject(key(it.optString("name")));
                if (s == null || !s.has("left")) continue;
                double left = Math.max(0, s.optDouble("left", 0) - perTake(it.optString("dose")));
                s.put("left", left);
                changed = true;
                if (left <= s.optDouble("low", 5) && !today.equals(s.optString("w"))) {
                    s.put("w", today);
                    warn(ctx, s.optString("n", it.optString("name")), left);
                }
            }
            if (changed) { p.edit().putString(KEY, all.toString()).apply(); Widget.refresh(ctx); }
        } catch (Exception ignored) { }
    }

    /** Names of medicines at or under their warning level (for the widget). */
    static String lowNames(Context ctx) {
        StringBuilder sb = new StringBuilder();
        try {
            JSONObject all = new JSONObject(get(ctx));
            for (Iterator<String> k = all.keys(); k.hasNext(); ) {
                JSONObject s = all.optJSONObject(k.next());
                if (s == null || !s.has("left")) continue;
                if (s.optDouble("left", 0) <= s.optDouble("low", 5)) { if (sb.length() > 0) sb.append(", "); sb.append(s.optString("n")); }
            }
        } catch (Exception ignored) { }
        return sb.toString();
    }

    static String fmt(double v) {
        return v == Math.floor(v) ? String.valueOf((long) v) : String.valueOf(Math.round(v * 10) / 10.0);
    }

    private static void warn(Context ctx, String name, double left) {
        try {
            ReminderService.ensureChannel(ctx);
            NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;
            PendingIntent open = PendingIntent.getActivity(ctx, 1_700_000_001, new Intent(ctx, MainActivity.class)
                            .putExtra("open", "stock").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP),
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            String body = (left <= 0 ? I18n.t(ctx, "stock_out") : I18n.t(ctx, "stock_low"))
                    .replace("{n}", fmt(left)).replace("{m}", name);
            Notification.Builder b = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                    ? new Notification.Builder(ctx, ReminderService.CHANNEL_ID) : new Notification.Builder(ctx);
            b.setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(I18n.t(ctx, "stock_title"))
                    .setContentText(body)
                    .setStyle(new Notification.BigTextStyle().bigText(body))
                    .setContentIntent(open)
                    .setAutoCancel(true);
            nm.notify(1_700_000_000 + (key(name).hashCode() & 0xffff), b.build());
        } catch (Exception ignored) { }
    }
}
