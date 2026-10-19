package com.medtime.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/**
 * M-082: choosing the reading voice. Lists the phone's voices for the app language,
 * plays a sample, saves the choice per language, opens the screen that downloads more voices.
 */
class Voices {
    static final String KEY = "voice_name_"; // + language
    private static TextToSpeech tts;
    private static boolean ready = false;

    static String norm(String l) { return "iw".equals(l) ? "he" : "in".equals(l) ? "id" : l; }

    static String chosen(Context ctx) {
        return ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getString(KEY + I18n.lang(ctx), "");
    }

    static void choose(Context ctx, String name) {
        ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).edit().putString(KEY + I18n.lang(ctx), name == null ? "" : name).apply();
    }

    /** Voices of this language on the phone; local ones first. */
    static List<Voice> forLang(Context ctx, TextToSpeech t) {
        List<Voice> out = new ArrayList<>();
        try {
            String want = norm(I18n.voiceLocales(ctx)[0].getLanguage());
            if (t.getVoices() != null) for (Voice v : t.getVoices()) {
                if (v.getLocale() != null && want.equals(norm(v.getLocale().getLanguage()))) out.add(v);
            }
        } catch (Exception ignored) { }
        Collections.sort(out, (a, b) -> {
            int na = a.isNetworkConnectionRequired() ? 1 : 0, nb = b.isNetworkConnectionRequired() ? 1 : 0;
            return na != nb ? na - nb : a.getName().compareTo(b.getName());
        });
        return out;
    }

    /** Applies the chosen voice to a ready TTS (used by the reminder service). */
    /** M-090: "pitch:0.78" = the phone voice, lower or higher (sounds like a man / a woman). */
    static float pitchOf(String name) {
        return 1f; // M-091: owner dropped the pitch variants (same voice); an old "pitch:" choice now means the normal voice
    }

    static void apply(Context ctx, TextToSpeech t) {
        String name = chosen(ctx);
        try { t.setPitch(pitchOf(name)); } catch (Exception ignored) { }
        if (name.isEmpty() || Piper.isPiper(name) || name.startsWith("pitch:")) return;
        try {
            for (Voice v : forLang(ctx, t)) if (v.getName().equals(name)) { t.setVoice(v); return; }
        } catch (Exception ignored) { }
    }

    private static void withTts(Activity a, Runnable r) {
        if (tts != null && ready) { r.run(); return; }
        if (tts != null) { try { tts.shutdown(); } catch (Exception ignored) { } }
        ready = false;
        tts = new TextToSpeech(a.getApplicationContext(), st -> {
            ready = st == TextToSpeech.SUCCESS;
            r.run();
        });
    }

    /** Sends {voices:[{name, local, installed}], chosen, ok} to window.mtVoices. */
    static void list(Activity a, WebView wv) {
        withTts(a, () -> {
            JSONObject o = new JSONObject();
            try {
                JSONArray arr = new JSONArray();
                if (ready) for (Voice v : forLang(a, tts)) {
                    boolean notInstalled = v.getFeatures() != null && v.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED);
                    arr.put(new JSONObject().put("name", v.getName()).put("local", !v.isNetworkConnectionRequired())
                            .put("installed", !notInstalled).put("country", v.getLocale().getCountry()));
                }
                // M-087: the offline Piper voices of this language (downloaded once by the app)
                JSONArray pv = Piper.list(a, norm(I18n.lang(a)));
                for (int i = 0; i < pv.length(); i++) arr.put(pv.get(i));
                o.put("ok", ready).put("voices", arr).put("chosen", chosen(a)).put("piper", Piper.status(a));
            } catch (Exception ignored) { }
            final String js = "window.mtVoices && mtVoices(" + o + ")";
            a.runOnUiThread(() -> wv.evaluateJavascript(js, null));
        });
    }

    /** Says a sample sentence with a voice ("" = phone default for the language). */
    static void preview(Activity a, String name, String text) {
        if (Piper.isPiper(name)) { if (tts != null) try { tts.stop(); } catch (Exception ignored) { } Piper.preview(a.getApplicationContext(), name, text); return; }
        Piper.stop();
        withTts(a, () -> {
            if (!ready) return;
            try {
                tts.stop();
                for (Locale loc : I18n.voiceLocales(a)) {
                    int r = tts.setLanguage(loc);
                    if (r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED) break;
                }
                tts.setPitch(pitchOf(name));
                if (name != null && !name.isEmpty() && !name.startsWith("pitch:")) for (Voice v : forLang(a, tts)) if (v.getName().equals(name)) { tts.setVoice(v); break; }
                Bundle p = new Bundle();
                p.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, Sounds.voiceVolume(a));
                tts.setSpeechRate(0.9f);
                tts.speak(text, TextToSpeech.QUEUE_FLUSH, p, "preview");
            } catch (Exception ignored) { }
        });
    }

    /** Opens the phone's "download voices" screen (Google speech services), else the speech settings. */
    static void install(Activity a) {
        a.runOnUiThread(() -> {
            try {
                a.startActivity(new Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));
            } catch (Exception e) {
                try { a.startActivity(new Intent("com.android.settings.TTS_SETTINGS").addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)); }
                catch (Exception ignored) { }
            }
        });
    }
}
