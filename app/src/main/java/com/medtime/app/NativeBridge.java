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
    private android.webkit.WebView web; // M-058: for update progress callbacks

    NativeBridge(Activity activity) {
        this.activity = activity;
    }

    NativeBridge(Activity activity, android.webkit.WebView web) {
        this.activity = activity;
        this.web = web;
    }

    /** M-058: this build's run number (versionCode - 100). */
    @JavascriptInterface
    public int getVersion() { return Updater.currentRun(activity); }

    /** M-058: ask GitHub for the newest build; answer comes back as window.mtUpd({type:'check',...}). */
    @JavascriptInterface
    public void checkUpdate() { if (web != null) Updater.check(activity, web); }

    /** M-058: download the newest APK and open the Android installer. */
    @JavascriptInterface
    public void installUpdate() { if (web != null) Updater.download(activity, web); }

    /** M-076: the Android "allow notifications" question (Android 13+), else the app's notification settings. */
    @JavascriptInterface
    public void requestNotifications() {
        activity.runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= 33
                    && activity.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS) != android.content.pm.PackageManager.PERMISSION_GRANTED
                    && !askedNotif) {
                askedNotif = true;
                activity.requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 101);
            } else {
                openSettings("notifications");
            }
        });
    }
    private static boolean askedNotif = false;

    /** M-076: Android's one-time "allow installs from this source" screen for in-app updates. */
    @JavascriptInterface
    public void openInstallPermission() {
        try {
            activity.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + activity.getPackageName())));
        } catch (Exception e) { openSettings(""); }
    }

    /** M-082: reading voice choice: list comes back as window.mtVoices({...}). */
    @JavascriptInterface
    public void listVoices() { if (web != null) Voices.list(activity, web); }

    @JavascriptInterface
    public void setVoice(String name) { Voices.choose(activity.getApplicationContext(), name); }

    @JavascriptInterface
    public void previewVoice(String name, String text) { Voices.preview(activity, name, text); }

    @JavascriptInterface
    public void installVoices() { Voices.install(activity); }

    /** M-080: "did I take it?" log (JSON array) and restoring it from a backup. */
    @JavascriptInterface
    public String getLog() { return MedLog.get(activity.getApplicationContext()); }

    @JavascriptInterface
    public void setLog(String json) { MedLog.set(activity.getApplicationContext(), json); }

    /** M-080: Android share sheet with a text (WhatsApp, mail, SMS...). */
    @JavascriptInterface
    public void shareText(String text) {
        activity.runOnUiThread(() -> {
            try {
                Intent i = new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text);
                activity.startActivity(Intent.createChooser(i, null));
            } catch (Exception ignored) { }
        });
    }

    /** M-080: writes the backup file and opens the share sheet (Drive, WhatsApp, mail...). */
    @JavascriptInterface
    public boolean exportBackup(String fileName, String json) {
        try {
            java.io.File dir = new java.io.File(activity.getCacheDir(), "backup");
            dir.mkdirs();
            java.io.File f = new java.io.File(dir, fileName.replaceAll("[^A-Za-z0-9._-]", "_"));
            try (java.io.OutputStream o = new java.io.FileOutputStream(f)) { o.write(json.getBytes("UTF-8")); }
            Uri uri = androidx.core.content.FileProvider.getUriForFile(activity, activity.getPackageName() + ".updates", f);
            Intent i = new Intent(Intent.ACTION_SEND).setType("application/json").putExtra(Intent.EXTRA_STREAM, uri)
                    .putExtra(Intent.EXTRA_SUBJECT, fileName).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            activity.runOnUiThread(() -> {
                try { activity.startActivity(Intent.createChooser(i, null)); } catch (Exception ignored) { }
            });
            return true;
        } catch (Exception e) { return false; }
    }

    /** M-080: Android file picker; the chosen file comes back as window.mtRestore(text). */
    @JavascriptInterface
    public void pickBackup() {
        activity.runOnUiThread(() -> {
            try {
                Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
                activity.startActivityForResult(i, MainActivity.REQ_RESTORE);
            } catch (Exception ignored) { }
        });
    }

    /** M-079: vibration choice for reminders: off / soft / normal / strong / heart / long. */
    @JavascriptInterface
    public String getVibration() { return Vibe.chosen(activity.getApplicationContext()); }

    @JavascriptInterface
    public void setVibration(String k) { Vibe.choose(activity.getApplicationContext(), k); }

    @JavascriptInterface
    public void previewVibration(String k) { Vibe.play(activity.getApplicationContext(), k); }

    /** M-031: close the app (alarms are booked in Android, so reminders still come). */
    @JavascriptInterface
    public void exitApp() {
        activity.runOnUiThread(activity::finishAndRemoveTask);
    }

    /** Save the full reminder list ([{id,time,items:[{name,dose,type}]}]) and book all alarms. */
    @JavascriptInterface
    public void syncReminders(String json) {
        Reminders.sync(activity.getApplicationContext(), json);
    }

    // ---------- M-036: doctor appointments ----------

    /** Save the appointment list ([{id,date,time,typeText,doctor,place,city,street,house,phone,notes,before,travel}]) and book alarms. */
    @JavascriptInterface
    public void syncAppointments(String json) {
        Appointments.sync(activity.getApplicationContext(), json);
    }

    @JavascriptInterface
    public void openWaze(String query) {
        if (query == null || query.trim().isEmpty()) return;
        Appointments.open(activity, new Intent(Intent.ACTION_VIEW,
                Uri.parse("https://waze.com/ul?navigate=yes&q=" + Uri.encode(query.trim()))));
    }

    @JavascriptInterface
    public void openMaps(String query) {
        if (query == null || query.trim().isEmpty()) return;
        Appointments.open(activity, Appointments.mapsIntent(query.trim()));
    }

    @JavascriptInterface
    public void dial(String phone) {
        if (phone == null || phone.trim().isEmpty()) return;
        Appointments.open(activity, Appointments.dialIntent(phone));
    }

    /** Test: an appointment reminder in N seconds. */
    @JavascriptInterface
    public void testAppointment(String json, int seconds) {
        try {
            org.json.JSONObject a = new org.json.JSONObject(json);
            Appointments.schedule(activity.getApplicationContext(), a, 2, System.currentTimeMillis() + Math.max(5, seconds) * 1000L);
        } catch (Exception ignored) { }
    }

    /** M-007: voice on/off, say medicine names, say dose. */
    @JavascriptInterface
    public void setVoiceOptions(boolean on, boolean names, boolean dose) {
        Reminders.setVoiceOptions(activity.getApplicationContext(), on, names, dose);
    }

    /** M-009: language of the reminder screen, notification and voice (he / ar / ro / fr / en). */
    @JavascriptInterface
    public void setLanguage(String lang) {
        I18n.setLang(activity.getApplicationContext(), lang);
    }

    // ---------- M-011: settings screen ----------

    @JavascriptInterface
    public String getSounds() { return Sounds.list(activity.getApplicationContext()); }

    @JavascriptInterface
    public String getChosenSound() { return Sounds.chosen(activity.getApplicationContext()); }

    @JavascriptInterface
    public void setSound(String uri) { Sounds.choose(activity.getApplicationContext(), uri); }

    @JavascriptInterface
    public void previewSound(String uri) { Sounds.preview(activity.getApplicationContext(), uri); }

    @JavascriptInterface
    public void stopPreview() { Sounds.stopPreview(); }

    /** M-032: alert sound and voice volume, 0-100. */
    @JavascriptInterface
    public void setVolumes(int alert, int voice) { Sounds.setVolumes(activity.getApplicationContext(), alert, voice); }

    @JavascriptInterface
    public String getVolumes() {
        Context ctx = activity.getApplicationContext();
        return "{\"alert\":" + Math.round(Sounds.alertVolume(ctx) * 100) + ",\"voice\":" + Math.round(Sounds.voiceVolume(ctx) * 100) + "}";
    }

    @JavascriptInterface
    public void setLowVision(boolean on) { Sounds.setLowVision(activity.getApplicationContext(), on); }

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
            o.put("install", Build.VERSION.SDK_INT < 26 || ctx.getPackageManager().canRequestPackageInstalls()); // M-076
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
