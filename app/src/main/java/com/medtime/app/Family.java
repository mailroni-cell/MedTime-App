package com.medtime.app;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.telephony.SmsManager;

import org.json.JSONObject;

import java.util.ArrayList;

/**
 * M-100: family alert. When a medicine reminder is still unanswered one hour later (M-080 repeats every 5 min,
 * 12 times), one SMS goes from this phone to the family member chosen in settings. Free (a normal SMS).
 */
class Family {
    private static final String NAME = "fam_name", PHONE = "fam_phone", ON = "fam_on";

    private static SharedPreferences p(Context c) { return c.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE); }

    static JSONObject get(Context c) {
        JSONObject o = new JSONObject();
        try {
            o.put("name", p(c).getString(NAME, "")).put("phone", p(c).getString(PHONE, ""))
                    .put("on", p(c).getBoolean(ON, false)).put("perm", canSend(c));
        } catch (Exception ignored) { }
        return o;
    }

    static void set(Context c, String name, String phone, boolean on) {
        p(c).edit().putString(NAME, name == null ? "" : name.trim()).putString(PHONE, phone == null ? "" : phone.trim())
                .putBoolean(ON, on).apply();
    }

    static boolean canSend(Context c) {
        if (BuildConfig.GPLAY) return true; // Play edition: the phone's SMS app sends it, no permission needed
        return Build.VERSION.SDK_INT < 23 || c.checkSelfPermission(Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED;
    }

    /** Called once per reminder, when it is marked "no answer" after an hour. */
    static void alertMissed(Context c, Intent src) {
        if (!p(c).getBoolean(ON, false)) return;
        String who = p(c).getString("user_name", "");
        String items = android.text.TextUtils.join(", ", Reminders.lines(c, src.getStringExtra(Reminders.EXTRA_ITEMS), true));
        String time = src.getStringExtra(Reminders.EXTRA_TIME);
        String msg = I18n.t(c, "fam_sms").replace("{who}", who.isEmpty() ? I18n.t(c, "fam_someone") : who)
                .replace("{items}", items).replace("{time}", time == null ? "" : time);
        if (BuildConfig.GPLAY) { notifyToSend(c, msg); return; }
        if (!send(c, msg)) notifyToSend(c, msg); // M-185: SMS could not go out (no permission / no SIM chosen): a notification opens it ready to send
    }

    /** Play edition: a ready SMS to the family member; the user only taps "send" in the SMS app. */
    private static Intent smsIntent(Context c, String text) {
        return new Intent(Intent.ACTION_SENDTO, android.net.Uri.parse("smsto:" + p(c).getString(PHONE, "")))
                .putExtra("sms_body", text).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }

    /** Play edition, reminder still unanswered: a notification that opens the ready SMS. */
    private static void notifyToSend(Context c, String text) {
        if (p(c).getString(PHONE, "").isEmpty()) return;
        try {
            android.app.NotificationManager nm = (android.app.NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            android.app.PendingIntent pi = android.app.PendingIntent.getActivity(c, 4100, smsIntent(c, text),
                    android.app.PendingIntent.FLAG_UPDATE_CURRENT | android.app.PendingIntent.FLAG_IMMUTABLE);
            String name = p(c).getString(NAME, "");
            android.app.Notification.Builder b = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                    ? new android.app.Notification.Builder(c, ReminderService.CHANNEL_ID) : new android.app.Notification.Builder(c);
            b.setSmallIcon(android.R.drawable.ic_dialog_email)
                    .setContentTitle(I18n.t(c, "fam_tap").replace("{name}", name.isEmpty() ? p(c).getString(PHONE, "") : name))
                    .setContentText(text)
                    .setStyle(new android.app.Notification.BigTextStyle().bigText(text))
                    .setContentIntent(pi)
                    .setAutoCancel(true);
            nm.notify(4100, b.build());
        } catch (Exception ignored) { }
    }

    static boolean send(Context c, String text) {
        String phone = p(c).getString(PHONE, "");
        if (phone.isEmpty() || !canSend(c)) return false;
        if (BuildConfig.GPLAY) { // Play edition: open the SMS app with the message ready
            try { c.startActivity(smsIntent(c, text)); return true; } catch (Exception e) { return false; }
        }
        try {
            SmsManager sm = Build.VERSION.SDK_INT >= 31 ? c.getSystemService(SmsManager.class) : SmsManager.getDefault();
            ArrayList<String> parts = sm.divideMessage(text);
            sm.sendMultipartTextMessage(phone, null, parts, null, null);
            return true;
        } catch (Exception e) { return false; }
    }
}
