package com.medtime.app;

import android.content.Context;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/** M-009: texts of the native screens / notification / voice in 5 languages (he, ar, ro, fr, en). */
public class I18n {

    static final String KEY_LANG = "lang";
    static final String[] LANGS = {"he", "ar", "ro", "fr", "en"};

    private static final Map<String, Map<String, String>> T = new HashMap<>();

    private static void put(String key, String he, String ar, String ro, String fr, String en) {
        String[] v = {he, ar, ro, fr, en};
        for (int i = 0; i < LANGS.length; i++) {
            Map<String, String> m = T.get(LANGS[i]);
            if (m == null) { m = new HashMap<>(); T.put(LANGS[i], m); }
            m.put(key, v[i]);
        }
    }

    static {
        put("notif_title", "💊 תזכורת תרופה", "💊 تذكير بالدواء", "💊 Memento medicament", "💊 Rappel de médicament", "💊 Medicine reminder");
        put("body_prefix", "הגיע הזמן לקחת:", "حان وقت تناول:", "Este timpul să iei:", "Il est temps de prendre :", "Time to take:");
        put("screen_one", "הגיע הזמן לקחת תרופה", "حان وقت تناول الدواء", "Este timpul pentru medicament", "C'est l'heure de votre médicament", "Time to take your medicine");
        put("screen_many", "הגיע הזמן לקחת תרופות", "حان وقت تناول الأدوية", "Este timpul pentru medicamente", "C'est l'heure de vos médicaments", "Time to take your medicines");
        put("taken", "✅ לקחתי", "✅ تناولته", "✅ Am luat", "✅ Pris", "✅ Taken");
        put("open_app", "📱 פתח את MedTime", "📱 افتح MedTime", "📱 Deschide MedTime", "📱 Ouvrir MedTime", "📱 Open MedTime");
        put("snooze_header", "⏰ להזכיר שוב בעוד:", "⏰ ذكّرني مرة أخرى بعد:", "⏰ Amintește-mi din nou peste:", "⏰ Me rappeler dans :", "⏰ Remind me again in:");
        put("snooze_10", "10 דקות", "10 دقائق", "10 minute", "10 min", "10 min");
        put("snooze_30", "חצי שעה", "نصف ساعة", "30 de minute", "30 min", "30 min");
        put("snooze_60", "שעה", "ساعة", "o oră", "1 heure", "1 hour");
        put("snooze_120", "שעתיים", "ساعتين", "2 ore", "2 heures", "2 hours");
        put("dose", "מינון", "الجرعة", "doza", "dose", "dose");
        put("speech_one", "תזכורת. הגיע הזמן לקחת את התרופה:", "تذكير. حان وقت تناول الدواء:", "Memento. Este timpul să iei medicamentul:", "Rappel. Il est temps de prendre votre médicament :", "Reminder. It is time to take your medicine:");
        put("speech_many", "תזכורת. הגיע הזמן לקחת את התרופות:", "تذكير. حان وقت تناول الأدوية:", "Memento. Este timpul să iei medicamentele:", "Rappel. Il est temps de prendre vos médicaments :", "Reminder. It is time to take your medicines:");
        put("speech_generic_one", "תזכורת. הגיע הזמן לקחת את התרופה.", "تذكير. حان وقت تناول الدواء.", "Memento. Este timpul să iei medicamentul.", "Rappel. Il est temps de prendre votre médicament.", "Reminder. It is time to take your medicine.");
        put("speech_generic_many", "תזכורת. הגיע הזמן לקחת את התרופות.", "تذكير. حان وقت تناول الأدوية.", "Memento. Este timpul să iei medicamentele.", "Rappel. Il est temps de prendre vos médicaments.", "Reminder. It is time to take your medicines.");
        put("type_pill", "כדור", "حبة", "pastilă", "comprimé", "pill");
        put("type_injection", "זריקה", "حقنة", "injecție", "injection", "injection");
        put("type_drops", "טיפות", "قطرات", "picături", "gouttes", "drops");
        put("type_syrup", "סירופ", "شراب", "sirop", "sirop", "syrup");
        put("type_cream", "משחה", "مرهم", "cremă", "crème", "cream");
        put("type_inhaler", "משאף", "بخاخ", "inhalator", "inhalateur", "inhaler");
    }

    static String lang(Context ctx) {
        String l = ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).getString(KEY_LANG, "he");
        return T.containsKey(l) ? l : "he";
    }

    static void setLang(Context ctx, String lang) {
        ctx.getSharedPreferences(Reminders.PREFS, Context.MODE_PRIVATE).edit().putString(KEY_LANG, lang).apply();
    }

    static String t(Context ctx, String key) {
        String v = T.get(lang(ctx)).get(key);
        return v != null ? v : T.get("he").get(key);
    }

    static boolean rtl(Context ctx) {
        String l = lang(ctx);
        return l.equals("he") || l.equals("ar");
    }

    /** Voice locales to try, best first. */
    static Locale[] voiceLocales(Context ctx) {
        switch (lang(ctx)) {
            case "ar": return new Locale[]{new Locale("ar"), new Locale("ar", "SA"), new Locale("ar", "EG")};
            case "ro": return new Locale[]{new Locale("ro", "RO"), new Locale("ro")};
            case "fr": return new Locale[]{Locale.FRANCE, Locale.FRENCH};
            case "en": return new Locale[]{Locale.US, Locale.UK, Locale.ENGLISH};
            default:   return new Locale[]{new Locale("he", "IL"), new Locale("iw", "IL")};
        }
    }
}
