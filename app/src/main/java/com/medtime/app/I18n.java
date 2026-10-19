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
        put("fam_sms", "MedTime: {who} עוד לא אישר/ה לקיחת {items} (תזכורת של {time}, לפני שעה). כדאי לבדוק שהכל בסדר.",
                "MedTime: {who} لم يؤكد بعد تناول {items} (تذكير الساعة {time}، قبل ساعة). يُستحسن الاطمئنان.",
                "MedTime: {who} nu a confirmat încă {items} (memento de la {time}, acum o oră). Verificați dacă e totul bine.",
                "MedTime : {who} n'a pas encore confirmé {items} (rappel de {time}, il y a une heure). Vérifiez que tout va bien.",
                "MedTime: {who} has not confirmed taking {items} yet (reminder at {time}, an hour ago). Please check all is well."); // M-100
        put("fam_someone", "המשתמש/ת", "المستخدم", "utilizatorul", "l'utilisateur", "the user");
        put("skip", "✖️ ביטלתי (לא לוקח הפעם)", "✖️ ألغيت (لن آخذه هذه المرة)", "✖️ Anulez (nu iau acum)", "✖️ Annuler (pas cette fois)", "✖️ Skip (not this time)"); // M-080
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
        // M-036: doctor appointments
        put("appt_header", "🩺 תזכורת לתור", "🩺 تذكير بموعد", "🩺 Memento programare", "🩺 Rappel de rendez-vous", "🩺 Appointment reminder");
        put("appt_leave", "🚗 הגיע הזמן לצאת לתור", "🚗 حان وقت الخروج إلى الموعد", "🚗 Este timpul să pleci la programare", "🚗 Il est temps de partir au rendez-vous", "🚗 Time to leave for your appointment");
        put("appt_today", "היום בשעה %t", "اليوم الساعة %t", "azi la ora %t", "aujourd'hui à %t", "today at %t");
        put("appt_tomorrow", "מחר בשעה %t", "غدا الساعة %t", "mâine la ora %t", "demain à %t", "tomorrow at %t");
        put("appt_on", "ב-%d בשעה %t", "يوم %d الساعة %t", "pe %d la ora %t", "le %d à %t", "on %d at %t");
        put("appt_speech", "תזכורת. יש לך תור %w %d.", "تذكير. لديك موعد %w %d.", "Memento. Ai o programare %w %d.", "Rappel. Vous avez un rendez-vous %w %d.", "Reminder. You have an appointment %w %d.");
        put("appt_speech_leave", "הגיע הזמן לצאת. יש לך תור %w %d.", "حان وقت الخروج. لديك موعد %w %d.", "Este timpul să pleci. Ai o programare %w %d.", "Il est temps de partir. Vous avez un rendez-vous %w %d.", "Time to leave. You have an appointment %w %d.");
        put("appt_speech_at", "הכתובת: %a.", "العنوان: %a.", "Adresa: %a.", "Adresse : %a.", "Address: %a.");
        put("appt_waze", "🚗 נווט ב-Waze", "🚗 تنقّل بـ Waze", "🚗 Navighează cu Waze", "🚗 Naviguer avec Waze", "🚗 Navigate with Waze");
        put("appt_call", "📞 התקשר", "📞 اتصل", "📞 Sună", "📞 Appeler", "📞 Call");
        put("appt_ok", "👍 הבנתי", "👍 فهمت", "👍 Am înțeles", "👍 Compris", "👍 Got it");
        put("appt_maps", "🗺️ מפות", "🗺️ خرائط", "🗺️ Hărți", "🗺️ Cartes", "🗺️ Maps");
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
