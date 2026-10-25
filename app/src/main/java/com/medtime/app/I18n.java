package com.medtime.app;

import android.content.Context;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/** M-009: texts of the native screens / notification / voice in 6 languages (he, ar, ro, fr, en, ru). */
public class I18n {

    static final String KEY_LANG = "lang";
    static final String[] LANGS = {"he", "ar", "ro", "fr", "en", "ru"};

    private static final Map<String, Map<String, String>> T = new HashMap<>();

    private static void put(String key, String he, String ar, String ro, String fr, String en, String ru) {
        String[] v = {he, ar, ro, fr, en, ru};
        for (int i = 0; i < LANGS.length; i++) {
            Map<String, String> m = T.get(LANGS[i]);
            if (m == null) { m = new HashMap<>(); T.put(LANGS[i], m); }
            m.put(key, v[i]);
        }
    }

    static {
        put("notif_title", "💊 תזכורת תרופה", "💊 تذكير بالدواء", "💊 Memento medicament", "💊 Rappel de médicament", "💊 Medicine reminder", "💊 Напоминание о лекарстве");
        put("body_prefix", "הגיע הזמן לקחת:", "حان وقت تناول:", "Este timpul să iei:", "Il est temps de prendre :", "Time to take:", "Пора принять:");
        put("screen_one", "הגיע הזמן לקחת תרופה", "حان وقت تناول الدواء", "Este timpul pentru medicament", "C'est l'heure de votre médicament", "Time to take your medicine", "Пора принять лекарство");
        put("screen_many", "הגיע הזמן לקחת תרופות", "حان وقت تناول الأدوية", "Este timpul pentru medicamente", "C'est l'heure de vos médicaments", "Time to take your medicines", "Пора принять лекарства");
        put("taken", "✅ לקחתי", "✅ تناولته", "✅ Am luat", "✅ Pris", "✅ Taken", "✅ Принято");
        put("fam_sms", "MedTime: {who} עוד לא אישר/ה לקיחת {items} (תזכורת של {time}, לפני שעה). כדאי לבדוק שהכל בסדר.",
                "MedTime: {who} لم يؤكد بعد تناول {items} (تذكير الساعة {time}، قبل ساعة). يُستحسن الاطمئنان.",
                "MedTime: {who} nu a confirmat încă {items} (memento de la {time}, acum o oră). Verificați dacă e totul bine.",
                "MedTime : {who} n'a pas encore confirmé {items} (rappel de {time}, il y a une heure). Vérifiez que tout va bien.",
                "MedTime: {who} has not confirmed taking {items} yet (reminder at {time}, an hour ago). Please check all is well.", "MedTime: {who} ещё не подтвердил(а) приём {items} (напоминание в {time}, час назад). Проверьте, всё ли в порядке."); // M-100
        put("fam_tap", "👨‍👩‍👧 לחצו כדי לשלוח הודעה ל{name}", "👨‍👩‍👧 اضغط لإرسال رسالة إلى {name}", "👨‍👩‍👧 Apăsați pentru a trimite mesaj către {name}", "👨‍👩‍👧 Touchez pour envoyer un message à {name}", "👨‍👩‍👧 Tap to send a message to {name}", "👨‍👩‍👧 Нажмите, чтобы отправить сообщение {name}"); // Play edition
        put("fam_someone", "המשתמש/ת", "المستخدم", "utilizatorul", "l'utilisateur", "the user", "пользователь");
        put("skip", "✖️ ביטלתי (לא לוקח הפעם)", "✖️ ألغيت (لن آخذه هذه المرة)", "✖️ Anulez (nu iau acum)", "✖️ Annuler (pas cette fois)", "✖️ Skip (not this time)", "✖️ Пропустить (не в этот раз)"); // M-080
        put("open_app", "📱 פתח את MedTime", "📱 افتح MedTime", "📱 Deschide MedTime", "📱 Ouvrir MedTime", "📱 Open MedTime", "📱 Открыть MedTime");
        put("snooze_header", "⏰ להזכיר שוב בעוד:", "⏰ ذكّرني مرة أخرى بعد:", "⏰ Amintește-mi din nou peste:", "⏰ Me rappeler dans :", "⏰ Remind me again in:", "⏰ Напомнить снова через:");
        put("snooze_10", "10 דקות", "10 دقائق", "10 minute", "10 min", "10 min", "10 мин");
        put("snooze_30", "חצי שעה", "نصف ساعة", "30 de minute", "30 min", "30 min", "30 мин");
        put("snooze_60", "שעה", "ساعة", "o oră", "1 heure", "1 hour", "1 час");
        put("snooze_120", "שעתיים", "ساعتين", "2 ore", "2 heures", "2 hours", "2 часа");
        put("dose", "מינון", "الجرعة", "doza", "dose", "dose", "доза");
        put("speech_one", "תזכורת. הגיע הזמן לקחת את התרופה:", "تذكير. حان وقت تناول الدواء:", "Memento. Este timpul să iei medicamentul:", "Rappel. Il est temps de prendre votre médicament :", "Reminder. It is time to take your medicine:", "Напоминание. Пора принять лекарство:");
        put("speech_many", "תזכורת. הגיע הזמן לקחת את התרופות:", "تذكير. حان وقت تناول الأدوية:", "Memento. Este timpul să iei medicamentele:", "Rappel. Il est temps de prendre vos médicaments :", "Reminder. It is time to take your medicines:", "Напоминание. Пора принять лекарства:");
        put("speech_generic_one", "תזכורת. הגיע הזמן לקחת את התרופה.", "تذكير. حان وقت تناول الدواء.", "Memento. Este timpul să iei medicamentul.", "Rappel. Il est temps de prendre votre médicament.", "Reminder. It is time to take your medicine.", "Напоминание. Пора принять лекарство.");
        put("speech_generic_many", "תזכורת. הגיע הזמן לקחת את התרופות.", "تذكير. حان وقت تناول الأدوية.", "Memento. Este timpul să iei medicamentele.", "Rappel. Il est temps de prendre vos médicaments.", "Reminder. It is time to take your medicines.", "Напоминание. Пора принять лекарства.");
        // M-036: doctor appointments
        put("appt_header", "🩺 תזכורת לתור", "🩺 تذكير بموعد", "🩺 Memento programare", "🩺 Rappel de rendez-vous", "🩺 Appointment reminder", "🩺 Напоминание о приёме");
        put("appt_leave", "🚗 הגיע הזמן לצאת לתור", "🚗 حان وقت الخروج إلى الموعد", "🚗 Este timpul să pleci la programare", "🚗 Il est temps de partir au rendez-vous", "🚗 Time to leave for your appointment", "🚗 Пора выходить на приём");
        put("appt_today", "היום בשעה %t", "اليوم الساعة %t", "azi la ora %t", "aujourd'hui à %t", "today at %t", "сегодня в %t");
        put("appt_tomorrow", "מחר בשעה %t", "غدا الساعة %t", "mâine la ora %t", "demain à %t", "tomorrow at %t", "завтра в %t");
        put("appt_on", "ב-%d בשעה %t", "يوم %d الساعة %t", "pe %d la ora %t", "le %d à %t", "on %d at %t", "%d в %t");
        put("appt_speech", "תזכורת. יש לך תור %w %d.", "تذكير. لديك موعد %w %d.", "Memento. Ai o programare %w %d.", "Rappel. Vous avez un rendez-vous %w %d.", "Reminder. You have an appointment %w %d.", "Напоминание. У вас приём %w %d.");
        put("appt_speech_leave", "הגיע הזמן לצאת. יש לך תור %w %d.", "حان وقت الخروج. لديك موعد %w %d.", "Este timpul să pleci. Ai o programare %w %d.", "Il est temps de partir. Vous avez un rendez-vous %w %d.", "Time to leave. You have an appointment %w %d.", "Пора выходить. У вас приём %w %d.");
        put("appt_speech_at", "הכתובת: %a.", "العنوان: %a.", "Adresa: %a.", "Adresse : %a.", "Address: %a.", "Адрес: %a.");
        put("appt_waze", "🚗 נווט ב-Waze", "🚗 تنقّل بـ Waze", "🚗 Navighează cu Waze", "🚗 Naviguer avec Waze", "🚗 Navigate with Waze", "🚗 Маршрут в Waze");
        put("appt_call", "📞 התקשר", "📞 اتصل", "📞 Sună", "📞 Appeler", "📞 Call", "📞 Позвонить");
        put("upd_done", "עודכן לגרסה החדשה. לחצו כדי לפתוח", "تم التحديث إلى الإصدار الجديد. اضغط للفتح", "Actualizat la versiunea nouă. Atingeți pentru a deschide", "Mis à jour. Touchez pour ouvrir", "Updated to the new version. Tap to open", "Обновлено до новой версии. Нажмите, чтобы открыть"); // M-212
        put("medid_channel", "מידע רפואי לחירום", "معلومات طبية للطوارئ", "Informații medicale de urgență", "Informations médicales d'urgence", "Emergency medical info", "Медицинская информация для экстренных случаев"); // M-200
        put("appt_ok", "👍 הבנתי", "👍 فهمت", "👍 Am înțeles", "👍 Compris", "👍 Got it", "👍 Понятно");
        put("appt_maps", "🗺️ מפות", "🗺️ خرائط", "🗺️ Hărți", "🗺️ Cartes", "🗺️ Maps", "🗺️ Карты");
        // M-132: pill stock / M-134: widget
        put("stock_title", "📦 תרופה עומדת להיגמר", "📦 دواء على وشك النفاد", "📦 Medicament pe terminate", "📦 Médicament bientôt fini", "📦 Medicine running low", "📦 Лекарство заканчивается");
        put("stock_low", "נשארו {n} של {m}. כדאי לקנות עוד.", "تبقّى {n} من {m}. يُستحسن شراء المزيد.", "Au mai rămas {n} din {m}. Cumpărați mai mult.", "Il reste {n} de {m}. Pensez à en racheter.", "{n} left of {m}. Time to buy more.", "Осталось {n} из {m}. Пора купить ещё.");
        put("stock_out", "{m} נגמר. כדאי לקנות עוד.", "نفد {m}. يُستحسن شراء المزيد.", "{m} s-a terminat. Cumpărați mai mult.", "{m} est fini. Pensez à en racheter.", "{m} has run out. Time to buy more.", "{m} закончилось. Пора купить ещё.");
        put("w_next", "התרופה הבאה", "الدواء التالي", "Următorul medicament", "Prochain médicament", "Next medicine", "Следующее лекарство");
        put("w_today", "היום", "اليوم", "azi", "aujourd'hui", "today", "сегодня");
        put("w_tomorrow", "מחר", "غدًا", "mâine", "demain", "tomorrow", "завтра");
        put("w_none", "אין תזכורות. לחצו להוספה", "لا توجد تذكيرات. اضغط للإضافة", "Niciun memento. Atingeți pentru a adăuga", "Aucun rappel. Touchez pour ajouter", "No reminders. Tap to add one", "Нет напоминаний. Нажмите, чтобы добавить");
        put("w_low", "📦 להשלים: {m}", "📦 للشراء: {m}", "📦 De cumpărat: {m}", "📦 À racheter : {m}", "📦 Buy more: {m}", "📦 Купить: {m}");
        put("type_pill", "כדור", "حبة", "pastilă", "comprimé", "pill", "таблетка");
        put("type_injection", "זריקה", "حقنة", "injecție", "injection", "injection", "укол");
        put("type_drops", "טיפות", "قطرات", "picături", "gouttes", "drops", "капли");
        put("type_syrup", "סירופ", "شراب", "sirop", "sirop", "syrup", "сироп");
        put("type_cream", "משחה", "مرهم", "cremă", "crème", "cream", "крем");
        put("type_inhaler", "משאף", "بخاخ", "inhalator", "inhalateur", "inhaler", "ингалятор");
        if (BuildConfig.STORE) storeTexts();
    }

    /** Google Play edition: a general daily reminders app (no medicine wording). */
    private static void storeTexts() {
        put("notif_title", "⏰ תזכורת", "⏰ تذكير", "⏰ Memento", "⏰ Rappel", "⏰ Reminder", "⏰ Напоминание");
        put("body_prefix", "הגיע הזמן:", "حان الوقت:", "Este timpul:", "C'est l'heure :", "It is time:", "Пора:");
        put("screen_one", "הגיע הזמן לתזכורת", "حان وقت التذكير", "Este timpul pentru memento", "C'est l'heure de votre rappel", "Time for your reminder", "Пора: напоминание");
        put("screen_many", "הגיע הזמן לתזכורות", "حان وقت التذكيرات", "Este timpul pentru mementouri", "C'est l'heure de vos rappels", "Time for your reminders", "Пора: напоминания");
        put("taken", "✅ ביצעתי", "✅ تم", "✅ Gata", "✅ Fait", "✅ Done", "✅ Сделано");
        put("fam_sms", "MedTime: {who} עוד לא אישר/ה את התזכורת {items} (משעה {time}, לפני שעה). כדאי לבדוק שהכל בסדר.",
                "MedTime: {who} لم يؤكد بعد التذكير {items} (الساعة {time}، قبل ساعة). يُستحسن الاطمئنان.",
                "MedTime: {who} nu a confirmat încă mementoul {items} (de la {time}, acum o oră). Verificați dacă e totul bine.",
                "MedTime : {who} n'a pas encore confirmé le rappel {items} ({time}, il y a une heure). Vérifiez que tout va bien.",
                "MedTime: {who} has not confirmed the reminder {items} yet ({time}, an hour ago). Please check all is well.", "MedTime: {who} ещё не подтвердил(а) напоминание {items} ({time}, час назад). Проверьте, всё ли в порядке.");
        put("skip", "✖️ דילוג (לא הפעם)", "✖️ تخطٍّ (ليس هذه المرة)", "✖️ Sari (nu acum)", "✖️ Passer (pas cette fois)", "✖️ Skip (not this time)", "✖️ Пропустить (не в этот раз)");
        put("speech_one", "תזכורת. הגיע הזמן:", "تذكير. حان الوقت:", "Memento. Este timpul:", "Rappel. C'est l'heure :", "Reminder. It is time:", "Напоминание. Пора:");
        put("speech_many", "תזכורת. הגיע הזמן:", "تذكير. حان الوقت:", "Memento. Este timpul:", "Rappel. C'est l'heure :", "Reminder. It is time:", "Напоминание. Пора:");
        put("speech_generic_one", "תזכורת. הגיע הזמן.", "تذكير. حان الوقت.", "Memento. Este timpul.", "Rappel. C'est l'heure.", "Reminder. It is time.", "Напоминание. Пора.");
        put("speech_generic_many", "תזכורת. הגיע הזמן.", "تذكير. حان الوقت.", "Memento. Este timpul.", "Rappel. C'est l'heure.", "Reminder. It is time.", "Напоминание. Пора.");
        put("w_next", "התזכורת הבאה", "التذكير التالي", "Următorul memento", "Prochain rappel", "Next reminder", "Следующее напоминание");
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
            case "ru": return new Locale[]{new Locale("ru", "RU"), new Locale("ru")};
            default:   return new Locale[]{new Locale("he", "IL"), new Locale("iw", "IL")};
        }
    }
}
