package com.medtime.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import java.util.Locale;

/**
 * M-005: shows the reminder (full-screen over the lock screen, sound, vibration)
 * and reads the medicine name and dose out loud in Hebrew.
 * Runs as a short foreground service so the voice works while the app is closed.
 */
public class ReminderService extends Service {

    static final String CHANNEL_ID = "medtime_reminders_v1";
    static final String PREFS_STATUS = "medtime_status";
    static final String KEY_TTS_STATE = "tts_state"; // ok / no_hebrew / error

    private TextToSpeech tts;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private PowerManager.WakeLock wakeLock;

    static int notificationId(int reminderId) {
        return 5000 + (reminderId % 100000);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf();
            return START_NOT_STICKY;
        }
        int id = intent.getIntExtra(Reminders.EXTRA_ID, 0);
        String name = intent.getStringExtra(Reminders.EXTRA_NAME);
        String dose = intent.getStringExtra(Reminders.EXTRA_DOSE);

        Notification n = buildNotification(this, intent);
        int nid = notificationId(id);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(nid, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(nid, n);
        }

        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MedTime:reminder");
            wakeLock.acquire(60_000L);
        }

        speak(Reminders.speechText(name, dose));
        // Safety net: never keep the service running longer than a minute
        handler.postDelayed(this::finishKeepNotification, 60_000L);
        return START_NOT_STICKY;
    }

    private void speak(final String text) {
        tts = new TextToSpeech(getApplicationContext(), status -> {
            if (status != TextToSpeech.SUCCESS || tts == null) {
                saveTtsState("error");
                finishKeepNotification();
                return;
            }
            int r = tts.setLanguage(new Locale("he", "IL"));
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                r = tts.setLanguage(new Locale("iw", "IL"));
            }
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                saveTtsState("no_hebrew");
                finishKeepNotification();
                return;
            }
            saveTtsState("ok");
            // Play on the alarm volume, so it is heard even when media volume is low
            tts.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                    .build());
            tts.setSpeechRate(0.9f);
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String utteranceId) { }
                @Override public void onDone(String utteranceId) {
                    if ("last".equals(utteranceId)) handler.post(ReminderService.this::finishKeepNotification);
                }
                @Override public void onError(String utteranceId) {
                    handler.post(ReminderService.this::finishKeepNotification);
                }
            });
            // Let the notification sound finish first, then say it twice
            tts.playSilentUtterance(2000, TextToSpeech.QUEUE_FLUSH, "pause1");
            tts.speak(text, TextToSpeech.QUEUE_ADD, null, "first");
            tts.playSilentUtterance(1500, TextToSpeech.QUEUE_ADD, "pause2");
            tts.speak(text, TextToSpeech.QUEUE_ADD, null, "last");
        });
    }

    private void saveTtsState(String s) {
        getSharedPreferences(PREFS_STATUS, MODE_PRIVATE).edit().putString(KEY_TTS_STATE, s).apply();
    }

    /** Stop the service but leave the notification on screen until the user answers it. */
    private void finishKeepNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_DETACH);
        } else {
            stopForeground(false);
        }
        stopSelf();
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacksAndMessages(null);
        if (tts != null) {
            tts.stop();
            tts.shutdown();
            tts = null;
        }
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    // ---------- notification ----------

    static void ensureChannel(Context ctx) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null || nm.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL_ID, "תזכורות תרופות", NotificationManager.IMPORTANCE_HIGH);
        ch.setDescription("תזכורת בזמן לקחת תרופה, גם כשהאפליקציה סגורה");
        Uri sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
        if (sound == null) sound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        ch.setSound(sound, new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build());
        ch.enableVibration(true);
        ch.setVibrationPattern(new long[]{0, 600, 300, 600, 300, 900});
        ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        ch.setBypassDnd(true);
        nm.createNotificationChannel(ch);
    }

    static Notification buildNotification(Context ctx, Intent src) {
        ensureChannel(ctx);
        int id = src.getIntExtra(Reminders.EXTRA_ID, 0);
        String name = src.getStringExtra(Reminders.EXTRA_NAME);
        String dose = src.getStringExtra(Reminders.EXTRA_DOSE);
        Bundle extras = src.getExtras() != null ? src.getExtras() : new Bundle();

        Intent full = new Intent(ctx, AlarmActivity.class);
        full.putExtras(extras);
        full.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent fullPi = PendingIntent.getActivity(ctx, id * 2 + 1, full,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Intent taken = new Intent(ctx, ActionReceiver.class).setAction(ActionReceiver.ACTION_TAKEN).putExtras(extras);
        Intent snooze = new Intent(ctx, ActionReceiver.class).setAction(ActionReceiver.ACTION_SNOOZE).putExtras(extras);
        PendingIntent takenPi = PendingIntent.getBroadcast(ctx, id * 4 + 2, taken,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        PendingIntent snoozePi = PendingIntent.getBroadcast(ctx, id * 4 + 3, snooze,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        String body = "הגיע הזמן לקחת: " + name
                + (dose != null && !dose.trim().isEmpty() ? " (מינון: " + dose.trim() + ")" : "");

        Notification.Builder b = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(ctx, CHANNEL_ID)
                : new Notification.Builder(ctx);
        b.setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setContentTitle("💊 תזכורת תרופה")
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setCategory(Notification.CATEGORY_ALARM)
                .setPriority(Notification.PRIORITY_MAX)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setContentIntent(fullPi)
                .setFullScreenIntent(fullPi, true)
                .setAutoCancel(false)
                .setOngoing(true)
                .addAction(new Notification.Action.Builder(null, "✅ לקחתי", takenPi).build())
                .addAction(new Notification.Action.Builder(null, "⏰ דחה " + Reminders.SNOOZE_MINUTES + " דק'", snoozePi).build());
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            b.setDefaults(Notification.DEFAULT_ALL);
        }
        return b.build();
    }

    /** Fallback when the service may not start: show the notification without voice. */
    static void showWithoutVoice(Context ctx, Intent src) {
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(notificationId(src.getIntExtra(Reminders.EXTRA_ID, 0)), buildNotification(ctx, src));
    }
}
