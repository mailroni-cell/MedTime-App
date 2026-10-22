package com.medtime.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * M-212 (owner): after "Update now" everything happens by itself.
 * The APK is installed with a PackageInstaller session. On Android 12+ an app that installed itself before may update
 * itself without asking (USER_ACTION_NOT_REQUIRED), so only the very first update can show Android's "Update" screen.
 * When the new version is in place, BootReceiver (MY_PACKAGE_REPLACED) opens MedTime again (see relaunch()).
 */
public class InstallReceiver extends BroadcastReceiver {
    static final String ACTION = "com.medtime.app.INSTALL_STATUS";
    private static final String CH = "medtime_update";

    /** Starts the install. Returns false if the session could not be used (the caller then opens Android's installer). */
    static boolean installSession(Context ctx, File apk) {
        try {
            PackageInstaller pi = ctx.getPackageManager().getPackageInstaller();
            PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
            params.setAppPackageName(ctx.getPackageName());
            if (Build.VERSION.SDK_INT >= 31) params.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED);
            int id = pi.createSession(params);
            try (PackageInstaller.Session session = pi.openSession(id)) {
                try (InputStream in = new FileInputStream(apk); OutputStream out = session.openWrite("medtime.apk", 0, apk.length())) {
                    byte[] buf = new byte[256 * 1024];
                    int n;
                    while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                    session.fsync(out);
                }
                Intent i = new Intent(ctx, InstallReceiver.class).setAction(ACTION);
                int fl = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
                PendingIntent st = PendingIntent.getBroadcast(ctx, 7712, i, fl);
                session.commit(st.getIntentSender());
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void onReceive(Context ctx, Intent intent) {
        int status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
        if (status == PackageInstaller.STATUS_PENDING_USER_ACTION) {
            // first time only: Android asks the user once
            Intent confirm = intent.getParcelableExtra(Intent.EXTRA_INTENT);
            if (confirm != null) {
                confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                try { ctx.startActivity(confirm); } catch (Exception ignored) { }
            }
        } else if (status != PackageInstaller.STATUS_SUCCESS) {
            ctx.getSharedPreferences("medtime_upd", 0).edit().putBoolean("relaunch", false).apply();
        }
    }

    /** Called from BootReceiver when the app was replaced: open MedTime again if the update was started from inside it. */
    static void relaunch(Context ctx) {
        if (!ctx.getSharedPreferences("medtime_upd", 0).getBoolean("relaunch", false)) return;
        ctx.getSharedPreferences("medtime_upd", 0).edit().putBoolean("relaunch", false).apply();
        Intent open = new Intent(ctx, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        try { ctx.startActivity(open); } catch (Exception ignored) { }
        // if Android did not let the app open itself (no "display over other apps" permission), a tap on this opens it
        try {
            NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(CH) == null)
                nm.createNotificationChannel(new NotificationChannel(CH, "MedTime", NotificationManager.IMPORTANCE_HIGH));
            PendingIntent pi = PendingIntent.getActivity(ctx, 7713, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CH)
                    .setSmallIcon(android.R.drawable.stat_sys_download_done)
                    .setContentTitle("✅ MedTime")
                    .setContentText(I18n.t(ctx, "upd_done"))
                    .setContentIntent(pi).setAutoCancel(true).setTimeoutAfter(10 * 60 * 1000)
                    .setPriority(NotificationCompat.PRIORITY_HIGH);
            nm.notify(7714, b.build());
        } catch (Exception ignored) { }
    }
}
