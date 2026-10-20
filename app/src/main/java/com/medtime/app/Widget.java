package com.medtime.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/** M-134: home-screen widget with the next medicine (time + names) and medicines running low. */
public class Widget extends AppWidgetProvider {

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        draw(ctx, mgr, ids);
    }

    @Override
    public void onReceive(Context ctx, Intent intent) {
        super.onReceive(ctx, intent);
        if ("com.medtime.app.WIDGET_TICK".equals(intent.getAction())) refresh(ctx);
    }

    static void refresh(Context ctx) {
        try {
            AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
            int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, Widget.class));
            if (ids != null && ids.length > 0) draw(ctx, mgr, ids);
        } catch (Exception ignored) { }
    }

    private static void draw(Context ctx, AppWidgetManager mgr, int[] ids) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_next);
        long at = -1;
        List<String> names = new ArrayList<>();
        try {
            JSONArray list = new JSONArray(ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getString(Reminders.KEY_LIST, "[]"));
            for (int i = 0; i < list.length(); i++) {
                JSONObject r = list.optJSONObject(i);
                if (r == null) continue;
                long t = Reminders.nextOccurrence(r.optString("time", ""), Reminders.daysOf(r));
                if (t <= 0) continue;
                if (at < 0 || t < at - 30_000) { at = t; names.clear(); }
                if (Math.abs(t - at) <= 30_000) {
                    JSONArray it = Reminders.itemsOf(r);
                    for (int k = 0; k < it.length(); k++) {
                        String n = it.optJSONObject(k) == null ? "" : it.optJSONObject(k).optString("name", "").trim();
                        if (!n.isEmpty() && !names.contains(n)) names.add(n);
                    }
                }
            }
        } catch (Exception ignored) { }

        v.setTextViewText(R.id.w_head, "💊 " + I18n.t(ctx, "w_next"));
        if (at > 0) {
            Calendar c = Calendar.getInstance(); c.setTimeInMillis(at);
            Calendar now = Calendar.getInstance();
            String hm = String.format(java.util.Locale.US, "%02d:%02d", c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE));
            int dd = c.get(Calendar.DAY_OF_YEAR) - now.get(Calendar.DAY_OF_YEAR);
            if (dd < 0) dd += now.getActualMaximum(Calendar.DAY_OF_YEAR);
            String day = dd == 0 ? I18n.t(ctx, "w_today") : dd == 1 ? I18n.t(ctx, "w_tomorrow")
                    : c.getDisplayName(Calendar.DAY_OF_WEEK, Calendar.LONG, new java.util.Locale(I18n.lang(ctx)));
            v.setTextViewText(R.id.w_time, hm);
            v.setViewVisibility(R.id.w_time, View.VISIBLE);
            v.setTextViewText(R.id.w_names, day + " · " + String.join(", ", names));
        } else {
            v.setViewVisibility(R.id.w_time, View.GONE);
            v.setTextViewText(R.id.w_names, I18n.t(ctx, "w_none"));
        }
        String low = Stock.lowNames(ctx);
        if (low.isEmpty()) v.setViewVisibility(R.id.w_low, View.GONE);
        else { v.setViewVisibility(R.id.w_low, View.VISIBLE); v.setTextViewText(R.id.w_low, I18n.t(ctx, "w_low").replace("{m}", low)); }

        PendingIntent open = PendingIntent.getActivity(ctx, 1_700_100_000,
                new Intent(ctx, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        v.setOnClickPendingIntent(R.id.w_root, open);
        for (int id : ids) mgr.updateAppWidget(id, v);

        // redraw a minute after the shown reminder time, so it moves on to the next one
        try {
            AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
            PendingIntent tick = PendingIntent.getBroadcast(ctx, 1_700_100_001,
                    new Intent(ctx, Widget.class).setAction("com.medtime.app.WIDGET_TICK"),
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            if (am != null) {
                am.cancel(tick);
                if (at > 0) am.set(AlarmManager.RTC, at + 60_000, tick);
            }
        } catch (Exception ignored) { }
    }
}
