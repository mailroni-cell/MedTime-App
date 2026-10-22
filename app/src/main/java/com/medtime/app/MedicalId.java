package com.medtime.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

/** M-200 (owner): medical info for the emergency team as a quiet, fixed notification that shows on the lock screen. */
public class MedicalId {
    static final String CHANNEL_ID = "medtime_medid";
    static final int NOTIF_ID = 4242;
    private static final String PREFS = "medtime_medid";

    /** on = false removes it. The text is kept so it comes back after a restart. */
    static void set(Context ctx, boolean on, String title, String body) {
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        p.edit().putBoolean("on", on).putString("title", title == null ? "" : title).putString("body", body == null ? "" : body).apply();
        show(ctx);
    }

    static boolean isOn(Context ctx) { return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getBoolean("on", false); }

    static void show(Context ctx) {
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        SharedPreferences p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        if (!p.getBoolean("on", false)) { nm.cancel(NOTIF_ID); return; }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && nm.getNotificationChannel(CHANNEL_ID) == null) {
            NotificationChannel ch = new NotificationChannel(CHANNEL_ID, I18n.t(ctx, "medid_channel"), NotificationManager.IMPORTANCE_LOW);
            ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            ch.setSound(null, null);
            ch.enableVibration(false);
            ch.setShowBadge(false);
            nm.createNotificationChannel(ch);
        }
        Intent open = new Intent(ctx, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, NOTIF_ID, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        String body = p.getString("body", "");
        Notification.Builder b = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(ctx, CHANNEL_ID) : new Notification.Builder(ctx);
        b.setSmallIcon(android.R.drawable.ic_menu_info_details)
                .setContentTitle(p.getString("title", ""))
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setOngoing(true)
                .setShowWhen(false)
                .setOnlyAlertOnce(true)
                .setContentIntent(pi);
        try { nm.notify(NOTIF_ID, b.build()); } catch (Exception e) { /* no notification permission */ }
    }
}
