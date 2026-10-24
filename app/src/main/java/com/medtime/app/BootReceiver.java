package com.medtime.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** M-005: phone restarted, time changed or app updated -> book all reminders again. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context ctx, Intent intent) {
        Reminders.scheduleAll(ctx);
        Appointments.scheduleAll(ctx); // M-036
        MedicalId.show(ctx); // M-200: medical info back on the lock screen
        if (Intent.ACTION_MY_PACKAGE_REPLACED.equals(intent.getAction())) {
            // M-363: the downloaded update file (~190 MB) is not needed once installed; it stayed in the app's storage
            new java.io.File(new java.io.File(ctx.getCacheDir(), "updates"), "MedTime-update.apk").delete();
            InstallReceiver.relaunch(ctx); // M-212: open again after an in-app update
        }
    }
}
