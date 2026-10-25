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
        // M-373: alarm diary
        Reminders.log(ctx, "FIRE " + (Appointments.isAppt(intent) ? "appt" : Reminders.isWater(intent) ? "water" : daily ? "daily" : intent.hasExtra(Reminders.EXTRA_NAG) ? "repeat#" + intent.getIntExtra(Reminders.EXTRA_NAG, 0) : "snooze/test")
                + " id=" + id + " time=" + time + " " + Reminders.firstName(items));

        // Daily reminder: book tomorrow's alarm right away (M-036: appointments are one-time)
        if (daily && time != null && !Appointments.isAppt(intent)) {
            String days = intent.getStringExtra(Reminders.EXTRA_DAYS); // M-038
            long next = Reminders.nextOccurrence(time, days == null ? "" : days);
            if (next > 0) Reminders.schedule(ctx, id, items, time, next, true, days == null ? "" : days);
        }
        // M-147: already taken early today -> no reminder this time (tomorrow's is booked above)
        if (daily && !Appointments.isAppt(intent) && Reminders.consumeEarly(ctx, id)) { Widget.refresh(ctx); return; }

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
