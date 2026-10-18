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
    static final String EXTRA_NAME = "name";
    static final String EXTRA_DOSE = "dose";
    static final String EXTRA_TIME = "time";
    static final String EXTRA_DAILY = "daily";

    static final int SNOOZE_MINUTES = 10;

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
    }

    /** Schedule the next alarm of every saved reminder (used after sync and after reboot). */
    static void scheduleAll(Context ctx) {
        JSONArray list = parse(ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY_LIST, "[]"));
        for (int i = 0; i < list.length(); i++) {
            JSONObject r = list.optJSONObject(i);
            if (r == null) continue;
            String time = r.optString("time", "");
            long at = nextOccurrence(time);
            if (at <= 0) continue;
            schedule(ctx, r.optInt("id"), r.optString("name", ""), r.optString("dose", ""), time, at, true);
        }
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
    static void schedule(Context ctx, int id, String name, String dose, String time, long at, boolean daily) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        PendingIntent pi = alarmIntent(ctx, id, name, dose, time, daily);

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

    static void snooze(Context ctx, int id, String name, String dose, String time) {
        long at = System.currentTimeMillis() + SNOOZE_MINUTES * 60_000L;
        schedule(ctx, id, name, dose, time, at, false);
    }

    static void cancel(Context ctx, int id, boolean daily) {
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        am.cancel(alarmIntent(ctx, id, "", "", "", daily));
    }

    private static PendingIntent alarmIntent(Context ctx, int id, String name, String dose, String time, boolean daily) {
        Intent i = new Intent(ctx, AlarmReceiver.class);
        i.setAction("com.medtime.app.REMINDER_" + id + (daily ? "_D" : "_S"));
        i.putExtra(EXTRA_ID, id);
        i.putExtra(EXTRA_NAME, name);
        i.putExtra(EXTRA_DOSE, dose);
        i.putExtra(EXTRA_TIME, time);
        i.putExtra(EXTRA_DAILY, daily);
        int code = id * 2 + (daily ? 0 : 1);
        return PendingIntent.getBroadcast(ctx, code, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Spoken text, same wording as the old Cyber Pharma 3D app. */
    static String speechText(String name, String dose) {
        String s = "תזכורת. הגיע הזמן לקחת את התרופה: " + name;
        if (dose != null && !dose.trim().isEmpty()) s += ". מינון: " + dose.trim();
        return s;
    }

    private static JSONArray parse(String s) {
        try {
            return new JSONArray(s);
        } catch (Exception e) {
            return new JSONArray();
        }
    }
}
