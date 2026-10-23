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

    // M-011: the channel is silent; the service plays the sound chosen in settings.
    // M-079: v3 does not vibrate either; the service plays the vibration chosen in settings (Vibe).
    static final String CHANNEL_ID = "medtime_reminders_v3";
    static final long SOUND_MS = 4500;
    static final String PREFS_STATUS = "medtime_status";
    static final String KEY_TTS_STATE = "tts_state"; // ok / no_hebrew / error

    private TextToSpeech tts;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private PowerManager.WakeLock wakeLock;
    private android.media.Ringtone ringtone;

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
        String items = intent.getStringExtra(Reminders.EXTRA_ITEMS);

        boolean appt = Appointments.isAppt(intent); // M-036
        Notification n = appt ? Appointments.buildNotification(this, intent) : buildNotification(this, intent);
        // M-094: the medicine reminder opens on top of everything (also while another app is in use) until taken / snoozed / skipped
        if (!appt && Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && android.provider.Settings.canDrawOverlays(this)) {
            try {
                Intent full = new Intent(this, AlarmActivity.class).putExtras(intent);
                full.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(full);
            } catch (Exception ignored) { }
        }
        int nid = appt ? Appointments.notificationId(id) : notificationId(id);
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

        // M-011: chosen sound first, then the voice
        boolean hasSound = playSound();
        // M-080: unanswered reminders come back; from the 3rd time the vibration is strong
        int nag = appt ? 0 : intent.getIntExtra(Reminders.EXTRA_NAG, 0);
        String vk = Vibe.chosen(this);
        Vibe.play(this, nag >= 2 && !"off".equals(vk) ? "strong" : vk); // M-079
        if (!appt && !Reminders.isWater(intent)) { // M-317: water reminders ring once
            if (nag < Reminders.NAG_MAX) Reminders.nag(this, intent, nag + 1);
            else { MedLog.record(this, intent, "missed"); Family.alertMissed(this, intent); } // M-100
        }
        if (Reminders.voiceOn(this)) {
            speak(appt ? Appointments.speechText(this, intent) : Reminders.speechText(this, items), hasSound ? SOUND_MS : 800);
        } else {
            handler.postDelayed(this::finishKeepNotification, hasSound ? SOUND_MS + 500 : 3000L);
        }
        // Safety net: never keep the service running longer than a minute
        handler.postDelayed(this::finishKeepNotification, 60_000L);
        return START_NOT_STICKY;
    }

    private boolean playSound() {
        try {
            if (ringtone != null) ringtone.stop();
            ringtone = Sounds.ringtone(this, Sounds.chosen(this));
            if (ringtone == null) return false;
            ringtone.play();
            handler.postDelayed(() -> { if (ringtone != null) ringtone.stop(); }, SOUND_MS);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void speak(String said, final long delayMs) {
        // M-088: start with the user's name, e.g. "רוני, הגיע הזמן לקחת..."
        String who = getSharedPreferences(Reminders.PREFS, MODE_PRIVATE).getString("user_name", "");
        final String text = who.isEmpty() ? said : who + ", " + said;
        // M-087: an offline Piper voice chosen in settings speaks by itself; if it cannot, the phone voice speaks
        String pv = Voices.chosen(this);
        if (Piper.isPiper(pv) && Piper.ready(this, pv)) {
            saveTtsState("ok");
            Piper.speakTwice(this, pv, text, delayMs,
                    () -> handler.post(this::finishKeepNotification),
                    () -> handler.post(() -> speakPhone(text, delayMs, false)));
            return;
        }
        speakPhone(text, delayMs, true);
    }

    private void speakPhone(final String text, final long delayMs, final boolean piperFallback) {
        // A second reminder at the same moment replaces the first voice instead of talking over it
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        tts = new TextToSpeech(getApplicationContext(), status -> {
            if (status != TextToSpeech.SUCCESS || tts == null) {
                saveTtsState("error");
                finishKeepNotification();
                return;
            }
            // M-009: voice in the language chosen in the app
            int r = TextToSpeech.LANG_NOT_SUPPORTED;
            for (Locale loc : I18n.voiceLocales(ReminderService.this)) {
                r = tts.setLanguage(loc);
                if (r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED) break;
            }
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                // M-087: the phone has no voice for this language: use an offline Piper voice if there is one
                String fb = piperFallback ? Piper.firstReady(ReminderService.this, Voices.norm(I18n.lang(ReminderService.this))) : null;
                if (fb != null) {
                    saveTtsState("ok");
                    Piper.speakTwice(ReminderService.this, fb, text, delayMs,
                            () -> handler.post(ReminderService.this::finishKeepNotification),
                            () -> handler.post(ReminderService.this::finishKeepNotification));
                    return;
                }
                saveTtsState("no_voice");
                finishKeepNotification();
                return;
            }
            saveTtsState("ok");
            Voices.apply(ReminderService.this, tts); // M-082: the voice chosen in settings
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
            tts.playSilentUtterance(delayMs, TextToSpeech.QUEUE_FLUSH, "pause1");
            // M-032: voice volume from settings
            Bundle vp = new Bundle();
            vp.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, Sounds.voiceVolume(ReminderService.this));
            tts.speak(text, TextToSpeech.QUEUE_ADD, vp, "first");
            tts.playSilentUtterance(1500, TextToSpeech.QUEUE_ADD, "pause2");
            tts.speak(text, TextToSpeech.QUEUE_ADD, vp, "last");
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
        Piper.stop();
        if (tts != null) {
            tts.stop();
            tts.shutdown();
            tts = null;
        }
        if (ringtone != null) {
            ringtone.stop();
            ringtone = null;
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
        if (nm == null) return;
        if (nm.getNotificationChannel("medtime_reminders_v1") != null) nm.deleteNotificationChannel("medtime_reminders_v1");
        if (nm.getNotificationChannel("medtime_reminders_v2") != null) nm.deleteNotificationChannel("medtime_reminders_v2");
        if (nm.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL_ID, "תזכורות תרופות", NotificationManager.IMPORTANCE_HIGH);
        ch.setDescription("תזכורת בזמן לקחת תרופה, גם כשהאפליקציה סגורה");
        ch.setSound(null, null);
        ch.enableVibration(false);
        ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        ch.setBypassDnd(true);
        nm.createNotificationChannel(ch);
    }

    static Notification buildNotification(Context ctx, Intent src) {
        ensureChannel(ctx);
        int id = src.getIntExtra(Reminders.EXTRA_ID, 0);
        String[] lines = Reminders.lines(ctx, src.getStringExtra(Reminders.EXTRA_ITEMS));
        Bundle extras = src.getExtras() != null ? src.getExtras() : new Bundle();

        Intent full = new Intent(ctx, AlarmActivity.class);
        full.putExtras(extras);
        full.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent fullPi = PendingIntent.getActivity(ctx, id * 2 + 1, full,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Intent taken = new Intent(ctx, ActionReceiver.class).setAction(ActionReceiver.ACTION_TAKEN).putExtras(extras);
        PendingIntent takenPi = PendingIntent.getBroadcast(ctx, id * 8 + 2, taken,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        // Notification has room for 3 buttons: taken, 10 min, 30 min (all 4 snooze choices are on the full screen)
        PendingIntent snooze10 = snoozeIntent(ctx, extras, id, 10, 3);
        // M-080: third button is "skip" (the full screen still has all 4 snooze choices)
        Intent skip = new Intent(ctx, ActionReceiver.class).setAction(ActionReceiver.ACTION_SKIP).putExtras(extras);
        PendingIntent skipPi = PendingIntent.getBroadcast(ctx, id * 8 + 5, skip,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        String body = I18n.t(ctx, "body_prefix") + "\n" + String.join("\n", lines);

        Notification.Builder b = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(ctx, CHANNEL_ID)
                : new Notification.Builder(ctx);
        b.setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setContentTitle(I18n.t(ctx, "notif_title"))
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setCategory(Notification.CATEGORY_ALARM)
                .setPriority(Notification.PRIORITY_MAX)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setContentIntent(fullPi)
                .setFullScreenIntent(fullPi, true)
                .setAutoCancel(false)
                .setOngoing(true)
                .addAction(new Notification.Action.Builder(null, I18n.t(ctx, "taken"), takenPi).build())
                .addAction(new Notification.Action.Builder(null, "⏰ " + I18n.t(ctx, "snooze_10"), snooze10).build())
                .addAction(new Notification.Action.Builder(null, I18n.t(ctx, "skip"), skipPi).build());
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            b.setDefaults(Notification.DEFAULT_LIGHTS); // M-079: vibration comes from Vibe
        }
        return b.build();
    }

    static PendingIntent snoozeIntent(Context ctx, Bundle extras, int id, int minutes, int slot) {
        Intent i = new Intent(ctx, ActionReceiver.class).setAction(ActionReceiver.ACTION_SNOOZE).putExtras(extras);
        i.putExtra(Reminders.EXTRA_SNOOZE_MIN, minutes);
        return PendingIntent.getBroadcast(ctx, id * 8 + slot, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Fallback when the service may not start: show the notification without voice. */
    static void showWithoutVoice(Context ctx, Intent src) {
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        int id = src.getIntExtra(Reminders.EXTRA_ID, 0);
        if (Appointments.isAppt(src)) nm.notify(Appointments.notificationId(id), Appointments.buildNotification(ctx, src));
        else nm.notify(notificationId(id), buildNotification(ctx, src));
    }
}
