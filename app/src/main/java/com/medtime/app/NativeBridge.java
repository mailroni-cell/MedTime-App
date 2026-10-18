package com.medtime.app;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;
import android.webkit.JavascriptInterface;

import org.json.JSONObject;

/** M-005: functions the web page (index.html) can call as window.MedTimeNative.* */
public class NativeBridge {

    private final Activity activity;

    NativeBridge(Activity activity) {
        this.activity = activity;
    }

    /** Save the full reminder list ([{id,time,items:[{name,dose,type}]}]) and book all alarms. */
    @JavascriptInterface
    public void syncReminders(String json) {
        Reminders.sync(activity.getApplicationContext(), json);
    }

    /** Test reminder in N seconds (works with the app closed). */
    @JavascriptInterface
    public void testReminder(String itemsJson, int seconds) {
        long at = System.currentTimeMillis() + Math.max(5, seconds) * 1000L;
        Reminders.schedule(activity.getApplicationContext(), 0, itemsJson, "", at, false);
    }

    /** What may block reminders on this phone, for the status line in the app. */
    @JavascriptInterface
    public String getStatus() {
        Context ctx = activity.getApplicationContext();
        JSONObject o = new JSONObject();
        try {
            NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
            AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
            PowerManager pm = (PowerManager) ctx.getSystemService(Context.POWER_SERVICE);
            o.put("notifications", nm == null || nm.areNotificationsEnabled());
            o.put("exact", Build.VERSION.SDK_INT < Build.VERSION_CODES.S || (am != null && am.canScheduleExactAlarms()));
            o.put("fullScreen", Build.VERSION.SDK_INT < 34 || (nm != null && nm.canUseFullScreenIntent()));
            o.put("battery", pm == null || pm.isIgnoringBatteryOptimizations(ctx.getPackageName()));
            o.put("tts", ctx.getSharedPreferences(ReminderService.PREFS_STATUS, Context.MODE_PRIVATE)
                    .getString(ReminderService.KEY_TTS_STATE, "unknown"));
        } catch (Exception ignored) { }
        return o.toString();
    }

    /** Open the right Android settings screen: notifications / exact / fullScreen / battery / tts. */
    @JavascriptInterface
    public void openSettings(String what) {
        String pkg = activity.getPackageName();
        Intent i;
        switch (what == null ? "" : what) {
            case "exact":
                i = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                        ? new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse("package:" + pkg))
                        : appDetails(pkg);
                break;
            case "fullScreen":
                i = Build.VERSION.SDK_INT >= 34
                        ? new Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT, Uri.parse("package:" + pkg))
                        : appDetails(pkg);
                break;
            case "battery":
                i = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + pkg));
                break;
            case "tts":
                i = new Intent("com.android.settings.TTS_SETTINGS");
                break;
            case "notifications":
                i = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE, pkg);
                break;
            default:
                i = appDetails(pkg);
        }
        try {
            activity.startActivity(i);
        } catch (Exception e) {
            try { activity.startActivity(appDetails(pkg)); } catch (Exception ignored) { }
        }
    }

    private static Intent appDetails(String pkg) {
        return new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + pkg));
    }
}
