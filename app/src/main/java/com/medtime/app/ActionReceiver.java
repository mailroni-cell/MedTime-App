package com.medtime.app;

import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** M-005 / M-007: "לקחתי" / snooze (10 min, 30 min, 1 h, 2 h) buttons on the notification and on the reminder screen. */
public class ActionReceiver extends BroadcastReceiver {
    static final String ACTION_TAKEN = "com.medtime.app.TAKEN";
    static final String ACTION_SNOOZE = "com.medtime.app.SNOOZE";

    @Override
    public void onReceive(Context ctx, Intent intent) {
        handle(ctx, intent);
    }

    static void handle(Context ctx, Intent intent) {
        int id = intent.getIntExtra(Reminders.EXTRA_ID, 0);
        if (Appointments.isAppt(intent)) { // M-036
            if (ACTION_SNOOZE.equals(intent.getAction())) {
                Appointments.snooze(ctx, intent, intent.getIntExtra(Reminders.EXTRA_SNOOZE_MIN, Reminders.SNOOZE_MINUTES));
            }
            ctx.stopService(new Intent(ctx, ReminderService.class));
            NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.cancel(Appointments.notificationId(id));
            AlarmActivity.closeIfShowing();
            return;
        }
        if (ACTION_SNOOZE.equals(intent.getAction())) {
            Reminders.snooze(ctx,
                    id,
                    intent.getStringExtra(Reminders.EXTRA_ITEMS),
                    intent.getStringExtra(Reminders.EXTRA_TIME),
                    intent.getIntExtra(Reminders.EXTRA_SNOOZE_MIN, Reminders.SNOOZE_MINUTES));
        }
        ctx.stopService(new Intent(ctx, ReminderService.class));
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(ReminderService.notificationId(id));
        AlarmActivity.closeIfShowing();
    }
}
