package com.medtime.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

/**
 * M-036 (stage 2): doctor appointments. One-time alarms: an early reminder ("before" minutes)
 * and, when a travel time is set, a "time to leave" reminder. Both fire with the app closed and
 * show Waze / call buttons. The list comes from the web page.
 */
public class Appointments {

    static final String KEY_LIST = "appts";
    static final String EXTRA_APPT = "appt";   // the appointment as JSON
    static final String EXTRA_SLOT = "appt_slot"; // 0 = early reminder, 1 = time to leave, 2 = snoozed
    private static final int CODE_BASE = 1_000_000_000; // medicine request codes stay below this

    static int code(int id, int slot) { return CODE_BASE + (id % 100_000) * 8 + slot; }

    static int notificationId(int id) { return 300_000 + (id % 100_000); }

    static boolean isAppt(Intent i) { return i != null && i.hasExtra(EXTRA_APPT); }

    static void sync(Context ctx, String json) {
        SharedPreferences p = ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE);
        JSONArray old = parse(p.getString(KEY_LIST, "[]"));
        for (int i = 0; i < old.length(); i++) {
            JSONObject a = old.optJSONObject(i);
            if (a != null) for (int s = 0; s < 3; s++) cancel(ctx, a.optInt("id"), s);
        }
        p.edit().putString(KEY_LIST, json == null ? "[]" : json).apply();
        scheduleAll(ctx);
    }

    static void scheduleAll(Context ctx) {
        JSONArray list = parse(ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getString(KEY_LIST, "[]"));
        long now = System.currentTimeMillis();
        for (int i = 0; i < list.length(); i++) {
            JSONObject a = list.optJSONObject(i);
            if (a == null) continue;
            long at = when(a);
            if (at <= 0) continue;
            int before = a.optInt("before", 60);
            int travel = a.optInt("travel", 0);
            long t0 = at - before * 60_000L;
            if (t0 > now) schedule(ctx, a, 0, t0);
            if (travel > 0) {
                long t1 = at - travel * 60_000L;
                if (t1 > now && Math.abs(t1 - t0) > 60_000L) schedule(ctx, a, 1, t1);
            }
        }
    }

    /** Appointment time in millis from "date" (yyyy-MM-dd) and "time" (HH:mm). */
    static long when(JSONObject a) {
        try {
            String[] d = a.optString("date").split("-");
            String[] t = a.optString("time", "09:00").split(":");
            Calendar c = Calendar.getInstance();
            c.set(Integer.parseInt(d[0]), Integer.parseInt(d[1]) - 1, Integer.parseInt(d[2]),
                    Integer.parseInt(t[0]), Integer.parseInt(t[1]), 0);
            c.set(Calendar.MILLISECOND, 0);
            return c.getTimeInMillis();
        } catch (Exception e) {
            return -1;
        }
    }

    static void schedule(Context ctx, JSONObject a, int slot, long at) {
        Reminders.setAlarm(ctx, at, alarmIntent(ctx, a.optInt("id"), slot, a.toString()));
    }

    static void snooze(Context ctx, Intent src, int minutes) {
        try {
            JSONObject a = new JSONObject(src.getStringExtra(EXTRA_APPT));
            schedule(ctx, a, 2, System.currentTimeMillis() + Math.max(1, minutes) * 60_000L);
        } catch (Exception ignored) { }
    }

    static void cancel(Context ctx, int id, int slot) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(alarmIntent(ctx, id, slot, "{}"));
    }

    private static PendingIntent alarmIntent(Context ctx, int id, int slot, String json) {
        Intent i = new Intent(ctx, AlarmReceiver.class);
        i.setAction("com.medtime.app.APPT_" + id + "_" + slot);
        i.putExtra(Reminders.EXTRA_ID, id);
        i.putExtra(EXTRA_APPT, json);
        i.putExtra(EXTRA_SLOT, slot);
        return PendingIntent.getBroadcast(ctx, code(id, slot), i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // ---------- texts ----------

    static JSONObject of(Intent i) {
        try { return new JSONObject(i.getStringExtra(EXTRA_APPT)); } catch (Exception e) { return new JSONObject(); }
    }

    /** "Family doctor · Dr. Cohen" */
    static String what(JSONObject a) {
        String type = a.optString("typeText", "").trim(), doc = a.optString("doctor", "").trim();
        if (type.isEmpty()) return doc;
        if (doc.isEmpty()) return type;
        return type + " · " + doc;
    }

    static String address(JSONObject a) {
        String street = a.optString("street", "").trim(), house = a.optString("house", "").trim(), city = a.optString("city", "").trim();
        String s = (street + " " + house).trim();
        if (!city.isEmpty()) s = s.isEmpty() ? city : s + ", " + city;
        String place = a.optString("place", "").trim();
        if (!place.isEmpty()) s = s.isEmpty() ? place : place + ", " + s;
        return s;
    }

    /** What Waze / maps search for: the address, or the place name. */
    static String navQuery(JSONObject a) {
        String street = a.optString("street", "").trim(), house = a.optString("house", "").trim(), city = a.optString("city", "").trim();
        String s = (street + " " + house).trim();
        if (!city.isEmpty()) s = s.isEmpty() ? city : s + ", " + city;
        if (street.isEmpty()) {
            String place = a.optString("place", "").trim();
            if (!place.isEmpty()) s = s.isEmpty() ? place : place + ", " + s;
        }
        return s;
    }

    /** "today at 10:30" / "tomorrow at 10:30" / "on 21/10 at 10:30" */
    static String dayText(Context ctx, JSONObject a) {
        long at = when(a);
        Calendar c = Calendar.getInstance(), n = Calendar.getInstance();
        c.setTimeInMillis(at);
        String time = a.optString("time");
        int diff = dayIndex(c) - dayIndex(n);
        if (diff == 0) return I18n.t(ctx, "appt_today").replace("%t", time);
        if (diff == 1) return I18n.t(ctx, "appt_tomorrow").replace("%t", time);
        String d = new SimpleDateFormat("dd/MM", Locale.US).format(new Date(at));
        return I18n.t(ctx, "appt_on").replace("%d", d).replace("%t", time);
    }

    private static int dayIndex(Calendar c) { return c.get(Calendar.YEAR) * 400 + c.get(Calendar.DAY_OF_YEAR); }

    static String header(Context ctx, Intent i) {
        return I18n.t(ctx, i.getIntExtra(EXTRA_SLOT, 0) == 1 ? "appt_leave" : "appt_header");
    }

    static String[] lines(Context ctx, Intent i) {
        JSONObject a = of(i);
        java.util.ArrayList<String> l = new java.util.ArrayList<>();
        String w = what(a);
        if (!w.isEmpty()) l.add(w);
        l.add("📅 " + dayText(ctx, a));
        String ad = address(a);
        if (!ad.isEmpty()) l.add("📍 " + ad);
        String ph = a.optString("phone", "").trim();
        if (!ph.isEmpty()) l.add("📞 " + ph);
        String notes = a.optString("notes", "").trim();
        if (!notes.isEmpty()) l.add("📝 " + notes);
        return l.toArray(new String[0]);
    }

    static String speechText(Context ctx, Intent i) {
        JSONObject a = of(i);
        boolean names = ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getBoolean(Reminders.KEY_SAY_NAMES, true);
        String key = i.getIntExtra(EXTRA_SLOT, 0) == 1 ? "appt_speech_leave" : "appt_speech";
        String w = names ? what(a).replace(" · ", ", ") : "";
        String s = I18n.t(ctx, key).replace("%w", w.isEmpty() ? "" : w + ",").replace("%d", dayText(ctx, a));
        if (names && !address(a).isEmpty()) s += " " + I18n.t(ctx, "appt_speech_at").replace("%a", address(a)) ;
        return s.replace("  ", " ").trim();
    }

    // ---------- Waze / maps / call ----------

    static Intent wazeIntent(JSONObject a) {
        Uri u = Uri.parse("https://waze.com/ul?navigate=yes&q=" + Uri.encode(navQuery(a)));
        return new Intent(Intent.ACTION_VIEW, u).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }

    static Intent mapsIntent(String query) {
        return new Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q=" + Uri.encode(query))).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }

    static Intent dialIntent(String phone) {
        return new Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + Uri.encode(phone.trim()))).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }

    static void open(Context ctx, Intent i) {
        try { ctx.startActivity(i); } catch (Exception e) {
            // no app for geo: / waze link -> try a web page
            try {
                Intent web = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/search/?api=1&query="
                        + Uri.encode(i.getData() == null ? "" : i.getData().toString()))).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(web);
            } catch (Exception ignored) { }
        }
    }

    /** Notification for an appointment: Waze + call + OK buttons (no "taken"). */
    static Notification buildNotification(Context ctx, Intent src) {
        ReminderService.ensureChannel(ctx);
        int id = src.getIntExtra(Reminders.EXTRA_ID, 0);
        JSONObject a = of(src);
        Bundle extras = src.getExtras() != null ? src.getExtras() : new Bundle();
        int base = 1_500_000_000 + (id % 100_000) * 8;

        Intent full = new Intent(ctx, AlarmActivity.class).putExtras(extras)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent fullPi = PendingIntent.getActivity(ctx, base, full, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        String body = String.join("\n", lines(ctx, src));
        Notification.Builder b = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(ctx, ReminderService.CHANNEL_ID) : new Notification.Builder(ctx);
        b.setSmallIcon(android.R.drawable.ic_menu_my_calendar)
                .setContentTitle(header(ctx, src))
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setCategory(Notification.CATEGORY_REMINDER)
                .setPriority(Notification.PRIORITY_MAX)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setContentIntent(fullPi)
                .setFullScreenIntent(fullPi, true)
                .setAutoCancel(true);
        if (!navQuery(a).isEmpty()) {
            PendingIntent waze = PendingIntent.getActivity(ctx, base + 1, wazeIntent(a), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            b.addAction(new Notification.Action.Builder(null, I18n.t(ctx, "appt_waze"), waze).build());
        }
        String ph = a.optString("phone", "").trim();
        if (!ph.isEmpty()) {
            PendingIntent call = PendingIntent.getActivity(ctx, base + 2, dialIntent(ph), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            b.addAction(new Notification.Action.Builder(null, I18n.t(ctx, "appt_call"), call).build());
        }
        Intent ok = new Intent(ctx, ActionReceiver.class).setAction(ActionReceiver.ACTION_TAKEN).putExtras(extras);
        PendingIntent okPi = PendingIntent.getBroadcast(ctx, base + 3, ok, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        b.addAction(new Notification.Action.Builder(null, I18n.t(ctx, "appt_ok"), okPi).build());
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) b.setDefaults(Notification.DEFAULT_ALL);
        return b.build();
    }

    private static JSONArray parse(String s) {
        try { return new JSONArray(s); } catch (Exception e) { return new JSONArray(); }
    }
}
