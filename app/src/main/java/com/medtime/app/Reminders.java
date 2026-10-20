package com.medtime.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * M-005: daily medicine reminders scheduled in Android's AlarmManager,
 * so they fire even when the app is closed. The list comes from the web page
 * (index.html) and is kept here too, so it can be rescheduled after a reboot.
 */
public class Reminders {

    static final String PREFS = "medtime_reminders";
    static final String KEY_LIST = "list";

    static final String EXTRA_ID = "id";
    static final String EXTRA_ITEMS = "items"; // JSON array [{name,dose,type}]
    static final String EXTRA_TIME = "time";
    static final String EXTRA_DAILY = "daily";
    static final String EXTRA_DAYS = "days"; // M-038: "" = every day, else week days "0,3" (0 = Sunday)

    static final String EXTRA_SNOOZE_MIN = "snooze_min";
    static final int SNOOZE_MINUTES = 10; // default
    /** M-007: snooze choices on the reminder screen */
    static final int[] SNOOZE_CHOICES = {10, 30, 60, 120};

    // M-007: voice options (set from the app page)
    static final String KEY_VOICE_ON = "voice_on";
    static final String KEY_SAY_NAMES = "say_names";
    static final String KEY_SAY_DOSE = "say_dose";

    /** Save the new list from the page, cancel the old alarms and schedule the new ones. */
    static void sync(Context ctx, String json) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        JSONArray old = parse(prefs.getString(KEY_LIST, "[]"));
        for (int i = 0; i < old.length(); i++) {
            JSONObject r = old.optJSONObject(i);
            if (r != null) cancel(ctx, r.optInt("id"), true);
        }
        prefs.edit().putString(KEY_LIST, json == null ? "[]" : json).apply();
        scheduleAll(ctx);
        Widget.refresh(ctx); // M-134
    }

    /** Schedule the next alarm of every saved reminder (used after sync and after reboot). */
    static void scheduleAll(Context ctx) {
        JSONArray list = parse(ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_LIST, "[]"));
        for (int i = 0; i < list.length(); i++) {
            JSONObject r = list.optJSONObject(i);
            if (r == null) continue;
            String time = r.optString("time", "");
            String days = daysOf(r);
            long at = nextOccurrence(time, days);
            if (at <= 0) continue;
            schedule(ctx, r.optInt("id"), itemsOf(r).toString(), time, at, true, days);
        }
    }

    /** M-038: week days of a reminder as "0,3" ("" = every day). */
    static String daysOf(JSONObject r) {
        JSONArray d = r.optJSONArray("days");
        if (d == null || d.length() == 0 || d.length() >= 7) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < d.length(); i++) { if (sb.length() > 0) sb.append(','); sb.append(d.optInt(i)); }
        return sb.toString();
    }

    /** M-038: next HH:mm on one of the chosen week days ("" = any day). */
    static long nextOccurrence(String hhmm, String days) {
        long t = nextOccurrence(hhmm);
        if (t <= 0 || days == null || days.isEmpty()) return t;
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(t);
        for (int k = 0; k < 8; k++) {
            int wd = c.get(Calendar.DAY_OF_WEEK) - 1; // 0 = Sunday
            for (String d : days.split(",")) {
                if (d.trim().equals(String.valueOf(wd))) return c.getTimeInMillis();
            }
            c.add(Calendar.DAY_OF_YEAR, 1);
        }
        return t;
    }

    /** Next time of HH:mm (today if still ahead, otherwise tomorrow). */
    static long nextOccurrence(String hhmm) {
        try {
            String[] p = hhmm.split(":");
            Calendar c = Calendar.getInstance();
            c.set(Calendar.HOUR_OF_DAY, Integer.parseInt(p[0].trim()));
            c.set(Calendar.MINUTE, Integer.parseInt(p[1].trim()));
            c.set(Calendar.SECOND, 0);
            c.set(Calendar.MILLISECOND, 0);
            if (c.getTimeInMillis() <= System.currentTimeMillis() + 1000) c.add(Calendar.DAY_OF_YEAR, 1);
            return c.getTimeInMillis();
        } catch (Exception e) {
            return -1;
        }
    }

    /** Daily alarms use request code id*2, one-time alarms (snooze / test) use id*2+1. */
    static void schedule(Context ctx, int id, String items, String time, long at, boolean daily) {
        schedule(ctx, id, items, time, at, daily, "");
    }

    static void schedule(Context ctx, int id, String items, String time, long at, boolean daily, String days) {
        PendingIntent pi = alarmIntent(ctx, id, items, time, daily);
        if (days != null && !days.isEmpty()) {
            // same request code, so this replaces the plain one; the extra tells the receiver the days
            Intent i = new Intent(ctx, AlarmReceiver.class);
            i.setAction("com.medtime.app.REMINDER_" + id + (daily ? "_D" : "_S"));
            i.putExtra(EXTRA_ID, id);
            i.putExtra(EXTRA_ITEMS, items);
            i.putExtra(EXTRA_TIME, time);
            i.putExtra(EXTRA_DAILY, daily);
            i.putExtra(EXTRA_DAYS, days);
            pi = PendingIntent.getBroadcast(ctx, id * 2 + (daily ? 0 : 1), i,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        }
        setAlarm(ctx, at, pi);
    }

    /** M-036: shared by medicine and appointment alarms. */
    static void setAlarm(Context ctx, long at, PendingIntent pi) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        boolean exactAllowed = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms();
        if (exactAllowed) {
            // Alarm-clock alarms are exact, wake the phone from deep sleep and are not delayed by battery saving
            PendingIntent show = PendingIntent.getActivity(ctx, 0, new Intent(ctx, MainActivity.class),
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            am.setAlarmClock(new AlarmManager.AlarmClockInfo(at, show), pi);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        } else {
            am.set(AlarmManager.RTC_WAKEUP, at, pi);
        }
    }

    static void snooze(Context ctx, int id, String items, String time, int minutes) {
        if (minutes <= 0) minutes = SNOOZE_MINUTES;
        long at = System.currentTimeMillis() + minutes * 60_000L;
        schedule(ctx, id, items, time, at, false);
    }

    // M-080: a reminder nobody answers (taken / snooze / skip) comes back every 5 minutes, up to 12 times (1 hour)
    static final String EXTRA_NAG = "nag";
    static final int NAG_MINUTES = 5;
    static final int NAG_MAX = 12;

    static void nag(Context ctx, Intent src, int count) {
        int id = src.getIntExtra(EXTRA_ID, 0);
        Intent i = new Intent(ctx, AlarmReceiver.class);
        i.setAction("com.medtime.app.REMINDER_" + id + "_S"); // the one-time slot: snooze / skip / taken replace or cancel it
        i.putExtra(EXTRA_ID, id);
        i.putExtra(EXTRA_ITEMS, src.getStringExtra(EXTRA_ITEMS));
        i.putExtra(EXTRA_TIME, src.getStringExtra(EXTRA_TIME));
        i.putExtra(EXTRA_DAILY, false);
        i.putExtra(EXTRA_NAG, count);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, id * 2 + 1, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        setAlarm(ctx, System.currentTimeMillis() + NAG_MINUTES * 60_000L, pi);
    }

    static void cancel(Context ctx, int id, boolean daily) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        am.cancel(alarmIntent(ctx, id, "[]", "", daily));
    }

    private static PendingIntent alarmIntent(Context ctx, int id, String items, String time, boolean daily) {
        Intent i = new Intent(ctx, AlarmReceiver.class);
        i.setAction("com.medtime.app.REMINDER_" + id + (daily ? "_D" : "_S"));
        i.putExtra(EXTRA_ID, id);
        i.putExtra(EXTRA_ITEMS, items);
        i.putExtra(EXTRA_TIME, time);
        i.putExtra(EXTRA_DAILY, daily);
        int code = id * 2 + (daily ? 0 : 1);
        return PendingIntent.getBroadcast(ctx, code, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // ---------- M-147: "taken early" - today's alarm of this reminder stays quiet ----------
    static final String KEY_EARLY = "early_";

    static String today() {
        return new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(new java.util.Date());
    }

    static boolean isToday(long at) {
        return new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.US).format(new java.util.Date(at)).equals(today());
    }

    /** Marks today's next alarm of the reminder (or its weekend twin) as already taken. Returns its time, or "" if none is left today. */
    static String takenEarly(Context ctx, int baseId) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        JSONArray list = parse(prefs.getString(KEY_LIST, "[]"));
        for (int i = 0; i < list.length(); i++) {
            JSONObject r = list.optJSONObject(i);
            if (r == null) continue;
            int id = r.optInt("id");
            if (id != baseId && id != baseId + 100000000) continue;
            String time = r.optString("time", "");
            long at = nextOccurrence(time, daysOf(r));
            if (at <= 0 || !isToday(at) || today().equals(prefs.getString(KEY_EARLY + id, ""))) continue;
            prefs.edit().putString(KEY_EARLY + id, today()).apply();
            String items = itemsOf(r).toString();
            Intent src = new Intent();
            src.putExtra(EXTRA_ID, id);
            src.putExtra(EXTRA_ITEMS, items);
            src.putExtra(EXTRA_TIME, time);
            MedLog.record(ctx, src, "taken");
            Stock.taken(ctx, items);
            Widget.refresh(ctx);
            return time;
        }
        return "";
    }

    static boolean earlyToday(Context ctx, int baseId) {
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        String t = today();
        return t.equals(p.getString(KEY_EARLY + baseId, "")) || t.equals(p.getString(KEY_EARLY + (baseId + 100000000), ""));
    }

    /** Called when the alarm fires: true (and cleared) if it was already taken early today. */
    static boolean consumeEarly(Context ctx, int id) {
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (!today().equals(p.getString(KEY_EARLY + id, ""))) return false;
        p.edit().remove(KEY_EARLY + id).apply();
        return true;
    }

    // ---------- M-006: several medicines / injections in one reminder ----------

    /** Items of a saved reminder; older entries had a single name + dose. */
    static JSONArray itemsOf(JSONObject r) {
        JSONArray items = r.optJSONArray("items");
        if (items != null && items.length() > 0) return items;
        JSONArray one = new JSONArray();
        try {
            one.put(new JSONObject().put("name", r.optString("name", ""))
                    .put("dose", r.optString("dose", "")).put("type", "pill"));
        } catch (Exception ignored) { }
        return one;
    }

    static String typeLabel(Context ctx, String type) {
        if (type == null || type.isEmpty()) return "";
        String v = I18n.t(ctx, "type_" + type);
        return v == null ? "" : v;
    }

    /** One line per item, e.g. "זריקה אינסולין · מינון: 10 יחידות". */
    static String[] lines(Context ctx, String itemsJson) {
        return lines(ctx, itemsJson, true);
    }

    static String[] lines(Context ctx, String itemsJson, boolean withDose) {
        JSONArray a = parse(itemsJson);
        String[] out = new String[a.length()];
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o == null) { out[i] = ""; continue; }
            String label = typeLabel(ctx, o.optString("type"));
            String s = (label.isEmpty() ? "" : label + " ") + o.optString("name", "").trim();
            String dose = o.optString("dose", "").trim();
            if (withDose && !dose.isEmpty()) s += " · " + I18n.t(ctx, "dose") + ": " + dose;
            out[i] = s;
        }
        return out;
    }

    /** Spoken text, based on the wording of the old Cyber Pharma 3D app. */
    static String speechText(Context ctx, String itemsJson) {
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        boolean names = p.getBoolean(KEY_SAY_NAMES, true);
        boolean dose = p.getBoolean(KEY_SAY_DOSE, true);
        String[] l = lines(ctx, itemsJson, dose);
        // M-007: without names just say that it is time (privacy)
        if (!names) {
            return I18n.t(ctx, l.length > 1 ? "speech_generic_many" : "speech_generic_one");
        }
        StringBuilder sb = new StringBuilder(I18n.t(ctx, l.length > 1 ? "speech_many" : "speech_one")).append(" ");
        for (String s : l) sb.append(s.replace(" · ", ", ")).append(". ");
        return sb.toString().trim();
    }

    static boolean voiceOn(Context ctx) {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getBoolean(KEY_VOICE_ON, true);
    }

    static void setVoiceOptions(Context ctx, boolean on, boolean names, boolean dose) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putBoolean(KEY_VOICE_ON, on).putBoolean(KEY_SAY_NAMES, names).putBoolean(KEY_SAY_DOSE, dose).apply();
    }

    private static JSONArray parse(String s) {
        try {
            return new JSONArray(s);
        } catch (Exception e) {
            return new JSONArray();
        }
    }
}
