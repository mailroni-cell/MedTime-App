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
        if (a != null && !a.isFinishing()) { a.leaving = true; a.runOnUiThread(a::finish); }
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
        if (!Appointments.isAppt(getIntent())) UI.postDelayed(buzz, 30_000L); // M-098

        // M-008: a swipe-only lock is removed right away; a PIN / fingerprint lock stays (security)
        KeyguardManager km = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        if (km != null && km.isKeyguardLocked() && !km.isKeyguardSecure()
                && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            km.requestDismissKeyguard(this, null);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        buildScreen(intent);
    }

    private void buildScreen(final Intent src) {
        if (Appointments.isAppt(src)) { buildApptScreen(src); return; } // M-036
        String[] lines = Reminders.lines(this, src.getStringExtra(Reminders.EXTRA_ITEMS));

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setBackgroundColor(Color.parseColor("#0f172a"));
        root.setLayoutDirection(I18n.rtl(this) ? LinearLayout.LAYOUT_DIRECTION_RTL : LinearLayout.LAYOUT_DIRECTION_LTR);
        int pad = dp(28);
        root.setPadding(pad, pad, pad, pad);

        // M-011: low-vision mode = bigger text, yellow on black
        lowVision = Sounds.lowVision(this);
        if (lowVision) root.setBackgroundColor(Color.BLACK);
        // M-148: the medicine's photo (if one was added) instead of the pill symbol
        android.graphics.Bitmap photo = Photos.firstOf(this, src.getStringExtra(Reminders.EXTRA_ITEMS));
        if (photo != null) {
            android.widget.ImageView iv = new android.widget.ImageView(this);
            iv.setImageBitmap(photo);
            iv.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
            iv.setClipToOutline(true);
            GradientDrawable bg = new GradientDrawable();
            bg.setCornerRadius(dp(28));
            bg.setStroke(dp(3), Color.parseColor("#38bdf8"));
            iv.setBackground(bg);
            iv.setPadding(dp(3), dp(3), dp(3), dp(3));
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(200), dp(200));
            lp.bottomMargin = dp(12);
            root.addView(iv, lp);
        } else root.addView(text(BuildConfig.STORE ? "⏰" : "💊", 72, "#38bdf8"));
        root.addView(text(I18n.t(this, lines.length > 1 ? "screen_many" : "screen_one"), 22, "#94a3b8"));
        int size = lines.length > 3 ? 22 : (lines.length > 1 ? 28 : 34);
        for (String l : lines) root.addView(text(l, size, lowVision ? "#FFE500" : "#f8fafc"));

        Button taken = button(I18n.t(this, "taken"), "#10b981");
        taken.setOnClickListener(v -> answer(src, ActionReceiver.ACTION_TAKEN));
        root.addView(taken);

        // M-080: "not taking it this time" stops the repeating too
        Button skip = button(I18n.t(this, "skip"), "#7f1d1d");
        skip.setOnClickListener(v -> answer(src, ActionReceiver.ACTION_SKIP));
        root.addView(skip);

        // M-008: open the app; if the phone is locked, Android shows its unlock screen first
        Button open = button(I18n.t(this, "open_app"), "#334155");
        open.setOnClickListener(v -> unlockAndOpen(src));
        root.addView(open);

        // M-007: snooze choices in a 2x2 grid
        root.addView(text(I18n.t(this, "snooze_header"), 18, "#94a3b8"));
        LinearLayout row = null;
        for (int k = 0; k < Reminders.SNOOZE_CHOICES.length; k++) {
            final int min = Reminders.SNOOZE_CHOICES[k];
            if (k % 2 == 0) {
                row = new LinearLayout(this);
                row.setOrientation(LinearLayout.HORIZONTAL);
                root.addView(row, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT));
            }
            Button b = button(I18n.t(this, "snooze_" + min), "#2563eb");
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
        blockBack();
        FullScreen.apply(this); // M-012
    }

    /** M-036: appointment reminder: details, Waze / maps / call, OK, snooze. */
    private void buildApptScreen(final Intent src) {
        final org.json.JSONObject a = Appointments.of(src);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setLayoutDirection(I18n.rtl(this) ? LinearLayout.LAYOUT_DIRECTION_RTL : LinearLayout.LAYOUT_DIRECTION_LTR);
        int pad = dp(24);
        root.setPadding(pad, pad, pad, pad);
        lowVision = Sounds.lowVision(this);
        boolean leave = src.getIntExtra(Appointments.EXTRA_SLOT, 0) == 1;
        root.addView(text(leave ? "🚗" : "🩺", 68, "#38bdf8"));
        root.addView(text(Appointments.header(this, src), 26, lowVision ? "#FFE500" : "#f8fafc"));
        for (String l : Appointments.lines(this, src)) root.addView(text(l, 24, lowVision ? "#FFE500" : "#e2e8f0"));

        final String q = Appointments.navQuery(a);
        if (!q.isEmpty()) {
            Button waze = button(I18n.t(this, "appt_waze"), "#0891b2");
            waze.setOnClickListener(v -> unlockThen(() -> { Appointments.open(this, Appointments.wazeIntent(a)); answer(src, ActionReceiver.ACTION_TAKEN); }));
            root.addView(waze);
            Button maps = button(I18n.t(this, "appt_maps"), "#334155");
            maps.setOnClickListener(v -> unlockThen(() -> { Appointments.open(this, Appointments.mapsIntent(q)); answer(src, ActionReceiver.ACTION_TAKEN); }));
            root.addView(maps);
        }
        final String ph = a.optString("phone", "").trim();
        if (!ph.isEmpty()) {
            Button call = button(I18n.t(this, "appt_call") + "  " + ph, "#7c3aed");
            call.setOnClickListener(v -> unlockThen(() -> { Appointments.open(this, Appointments.dialIntent(ph)); answer(src, ActionReceiver.ACTION_TAKEN); }));
            root.addView(call);
        }
        Button ok = button(I18n.t(this, "appt_ok"), "#10b981");
        ok.setOnClickListener(v -> answer(src, ActionReceiver.ACTION_TAKEN));
        root.addView(ok);

        root.addView(text(I18n.t(this, "snooze_header"), 18, "#94a3b8"));
        LinearLayout row = new LinearLayout(this);
        row.setOrientation(LinearLayout.HORIZONTAL);
        root.addView(row, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        for (final int min : new int[]{10, 30, 60}) {
            Button b = button(I18n.t(this, "snooze_" + min), "#2563eb");
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(0, dp(60), 1f);
            lp.topMargin = dp(10); lp.leftMargin = dp(4); lp.rightMargin = dp(4);
            b.setLayoutParams(lp);
            b.setOnClickListener(v -> {
                Intent i = new Intent(src);
                i.putExtra(Reminders.EXTRA_SNOOZE_MIN, min);
                answer(i, ActionReceiver.ACTION_SNOOZE);
            });
            row.addView(b);
        }

        android.widget.ScrollView scroll = new android.widget.ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(lowVision ? Color.BLACK : Color.parseColor("#0f172a"));
        scroll.addView(root, new android.widget.ScrollView.LayoutParams(
                android.widget.ScrollView.LayoutParams.MATCH_PARENT, android.widget.ScrollView.LayoutParams.MATCH_PARENT));
        setContentView(scroll);
        blockBack();
        FullScreen.apply(this);
    }

    /** Waze / call need the phone unlocked: Android shows its unlock screen first (not bypassed). */
    private void unlockThen(final Runnable r) {
        KeyguardManager km = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        if (km != null && km.isKeyguardLocked() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            leaving = true; // the unlock screen goes on top: do not pull the reminder back over it
            km.requestDismissKeyguard(this, new KeyguardManager.KeyguardDismissCallback() {
                @Override
                public void onDismissSucceeded() { leaving = true; r.run(); }
            });
        } else {
            leaving = true;
            r.run();
        }
    }

    private void unlockAndOpen(final Intent src) {
        KeyguardManager km = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        if (km != null && km.isKeyguardLocked() && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            leaving = true; // the unlock screen goes on top: do not pull the reminder back over it
            km.requestDismissKeyguard(this, new KeyguardManager.KeyguardDismissCallback() {
                @Override
                public void onDismissSucceeded() {
                    openApp(src);
                }
            });
        } else {
            openApp(src);
        }
    }

    private void openApp(Intent src) {
        // The reminder stays on its notification (with Taken / snooze) until answered
        Intent main = new Intent(this, MainActivity.class);
        main.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        leaving = true;
        startActivity(main);
        finish();
    }

    private void answer(Intent src, String action) {
        Intent i = new Intent(src);
        i.setAction(action);
        leaving = true;
        ActionReceiver.handle(this, i);
        finish();
    }

    private boolean lowVision;

    private TextView text(String s, int sp, String color) {
        if (lowVision) sp = Math.round(sp * 1.3f);
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

    // M-098: until it is answered, a strong vibration every 30 s (can be turned off in settings)
    private final android.os.Handler UI = new android.os.Handler(android.os.Looper.getMainLooper());
    private final Runnable buzz = new Runnable() {
        @Override public void run() {
            if (leaving || isFinishing()) return;
            if (Vibe.nagOn(AlarmActivity.this) && !"off".equals(Vibe.chosen(AlarmActivity.this))) Vibe.play(AlarmActivity.this, "strong");
            UI.postDelayed(this, 30_000L);
        }
    };

    @Override
    protected void onDestroy() {
        UI.removeCallbacks(buzz);
        if (current.get() == this) current.clear();
        super.onDestroy();
    }

    // M-094: the reminder stays until it is answered: the Back button does not close it
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() { }

    // Target API 36: back is delivered through OnBackInvokedCallback; swallow it so the alarm cannot be closed by mistake
    private Object backCb;
    private void blockBack() {
        if (Build.VERSION.SDK_INT >= 33 && backCb == null) {
            android.window.OnBackInvokedCallback cb = () -> { };
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT, cb);
            backCb = cb;
        }
    }

    // M-097: Home / recent apps / another app on top do not hide it either: unanswered, it comes back on top right away
    // (needs "display over other apps"). When the screen is just turned off it stays where it is (shows on wake).
    private boolean leaving = false;

    @Override
    protected void onStop() {
        super.onStop();
        if (leaving || isFinishing() || isChangingConfigurations()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !android.provider.Settings.canDrawOverlays(this)) return;
        android.os.PowerManager pm = (android.os.PowerManager) getSystemService(POWER_SERVICE);
        if (pm != null && !pm.isInteractive()) return;
        final Intent again = new Intent(getIntent()).setClass(getApplicationContext(), AlarmActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        final android.content.Context app = getApplicationContext();
        new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
            if (leaving || current.get() != this || isFinishing()) return;
            try { app.startActivity(again); } catch (Exception ignored) { }
        }, 400);
    }
}
