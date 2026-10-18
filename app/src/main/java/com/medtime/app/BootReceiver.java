package com.medtime.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** M-005: phone restarted, time changed or app updated -> book all reminders again. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context ctx, Intent intent) {
        Reminders.scheduleAll(ctx);
    }
}
