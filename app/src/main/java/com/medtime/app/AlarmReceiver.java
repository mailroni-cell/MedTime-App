package com.medtime.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

/** M-005: fires at reminder time (app open or closed) and starts the reminder service. */
public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context ctx, Intent intent) {
        int id = intent.getIntExtra(Reminders.EXTRA_ID, 0);
        String items = intent.getStringExtra(Reminders.EXTRA_ITEMS);
        String time = intent.getStringExtra(Reminders.EXTRA_TIME);
        boolean daily = intent.getBooleanExtra(Reminders.EXTRA_DAILY, false);

        // Daily reminder: book tomorrow's alarm right away
        if (daily && time != null) {
            long next = Reminders.nextOccurrence(time);
            if (next > 0) Reminders.schedule(ctx, id, items, time, next, true);
        }

        Intent svc = new Intent(ctx, ReminderService.class);
        svc.putExtras(intent);
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ctx.startForegroundService(svc);
            else ctx.startService(svc);
        } catch (Exception e) {
            // Android refused to start the voice service: still show the reminder
            ReminderService.showWithoutVoice(ctx, intent);
        }
    }
}
