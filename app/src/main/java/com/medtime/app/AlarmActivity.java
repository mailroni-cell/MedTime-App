package com.medtime.app;

import android.app.Activity;
import android.app.KeyguardManager;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.lang.ref.WeakReference;

/** M-005: full-screen reminder that opens over the lock screen, like an alarm clock. */
public class AlarmActivity extends Activity {

    private static WeakReference<AlarmActivity> current = new WeakReference<>(null);

    static void closeIfShowing() {
        AlarmActivity a = current.get();
        if (a != null && !a.isFinishing()) a.runOnUiThread(a::finish);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        current = new WeakReference<>(this);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                    | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        buildScreen(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        buildScreen(intent);
    }

    private void buildScreen(final Intent src) {
        String[] lines = Reminders.lines(src.getStringExtra(Reminders.EXTRA_ITEMS));

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setBackgroundColor(Color.parseColor("#0f172a"));
        root.setLayoutDirection(LinearLayout.LAYOUT_DIRECTION_RTL);
        int pad = dp(28);
        root.setPadding(pad, pad, pad, pad);

        root.addView(text("💊", 72, "#38bdf8"));
        root.addView(text(lines.length > 1 ? "הגיע הזמן לקחת תרופות" : "הגיע הזמן לקחת תרופה", 22, "#94a3b8"));
        int size = lines.length > 3 ? 22 : (lines.length > 1 ? 28 : 34);
        for (String l : lines) root.addView(text(l, size, "#f8fafc"));

        Button taken = button("✅ לקחתי", "#10b981");
        taken.setOnClickListener(v -> answer(src, ActionReceiver.ACTION_TAKEN));
        root.addView(taken);

        // M-007: snooze choices in a 2x2 grid
        root.addView(text("⏰ להזכיר שוב בעוד:", 18, "#94a3b8"));
        LinearLayout row = null;
        for (int k = 0; k < Reminders.SNOOZE_CHOICES.length; k++) {
            final int min = Reminders.SNOOZE_CHOICES[k];
            if (k % 2 == 0) {
                row = new LinearLayout(this);
                row.setOrientation(LinearLayout.HORIZONTAL);
                root.addView(row, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT));
            }
            Button b = button(snoozeLabel(min), "#2563eb");
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, dp(60), 1f);
            lp.topMargin = dp(10);
            lp.leftMargin = dp(5);
            lp.rightMargin = dp(5);
            b.setLayoutParams(lp);
            b.setOnClickListener(v -> {
                Intent i = new Intent(src);
                i.putExtra(Reminders.EXTRA_SNOOZE_MIN, min);
                answer(i, ActionReceiver.ACTION_SNOOZE);
            });
            row.addView(b);
        }

        // Scrolls when there are many items
        android.widget.ScrollView scroll = new android.widget.ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(Color.parseColor("#0f172a"));
        scroll.addView(root, new android.widget.ScrollView.LayoutParams(
                android.widget.ScrollView.LayoutParams.MATCH_PARENT,
                android.widget.ScrollView.LayoutParams.MATCH_PARENT));
        setContentView(scroll);
    }

    private void answer(Intent src, String action) {
        Intent i = new Intent(src);
        i.setAction(action);
        ActionReceiver.handle(this, i);
        finish();
    }

    static String snoozeLabel(int min) {
        switch (min) {
            case 30: return "חצי שעה";
            case 60: return "שעה";
            case 120: return "שעתיים";
            default: return min + " דקות";
        }
    }

    private TextView text(String s, int sp, String color) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        t.setTextColor(Color.parseColor(color));
        t.setGravity(Gravity.CENTER);
        t.setPadding(0, dp(6), 0, dp(6));
        return t;
    }

    private Button button(String s, String color) {
        Button b = new Button(this);
        b.setText(s);
        b.setAllCaps(false);
        b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 22);
        b.setTextColor(Color.WHITE);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.parseColor(color));
        bg.setCornerRadius(dp(16));
        b.setBackground(bg);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, dp(68));
        lp.topMargin = dp(18);
        b.setLayoutParams(lp);
        return b;
    }

    private int dp(int v) {
        return (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v, getResources().getDisplayMetrics());
    }

    @Override
    protected void onDestroy() {
        if (current.get() == this) current.clear();
        super.onDestroy();
    }
}
