// M-058: updates from inside the app, M-059: a light that runs around the menu frames now and then,
// M-060: a help screen in settings that explains every part of the app in all 5 languages.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const $ = id => document.getElementById(id);
    const N = window.MedTimeNative;
    const has = f => !!(N && typeof N[f] === 'function');
    const TX = {
        updTitle: ['🔄 עדכונים', '🔄 التحديثات', '🔄 Actualizări', '🔄 Mises à jour', '🔄 Updates', '🔄 Обновления'],
        helpTitle: ['📖 עזרה', '📖 مساعدة', '📖 Ajutor', '📖 Aide', '📖 Help', '📖 Помощь'],
        helpSub: ['הסבר על כל דבר', 'شرح لكل شيء', 'Explicații pentru tot', 'Tout est expliqué', 'Everything explained', 'Всё объяснено'],
        version: ['גרסה', 'الإصدار', 'Versiunea', 'Version', 'Version', 'Версия'],
        check: ['🔍 בדוק עדכונים עכשיו', '🔍 ابحث عن تحديث الآن', '🔍 Verifică acum', '🔍 Vérifier maintenant', '🔍 Check now', '🔍 Проверить сейчас'],
        checking: ['בודק…', 'جارٍ الفحص…', 'Se verifică…', 'Vérification…', 'Checking…', 'Проверка…'],
        upToDate: ['✅ יש לכם את הגרסה החדשה ביותר', '✅ لديك أحدث إصدار', '✅ Aveți cea mai nouă versiune', '✅ Vous avez la dernière version', '✅ You have the newest version', '✅ У вас самая новая версия'],
        newer: ['🎉 יש גרסה חדשה: ', '🎉 يوجد إصدار جديد: ', '🎉 Versiune nouă: ', '🎉 Nouvelle version : ', '🎉 New version: ', '🎉 Новая версия: '],
        install: ['⬇️ הורד והתקן', '⬇️ تنزيل وتثبيت', '⬇️ Descarcă și instalează', '⬇️ Télécharger et installer', '⬇️ Download & install', '⬇️ Скачать и установить'],
        loading: ['מוריד… ', 'جارٍ التنزيل… ', 'Se descarcă… ', 'Téléchargement… ', 'Downloading… ', 'Загрузка… '],
        ready: ['✅ ההורדה הסתיימה. במסך של אנדרואיד לחצו "עדכון"', '✅ اكتمل التنزيل. اضغط "تحديث" في شاشة أندرويد', '✅ Gata. Apăsați „Actualizează” în ecranul Android', '✅ Terminé. Appuyez sur « Mettre à jour » dans l\'écran Android', '✅ Done. Tap "Update" on the Android screen', '✅ Готово. Нажмите «Обновить» на экране Android'],
        perm: ['אנדרואיד מבקש אישור חד-פעמי: הפעילו "התרת התקנה ממקור זה", חזרו ולחצו שוב "הורד והתקן"', 'يطلب أندرويد إذنًا لمرة واحدة: فعّل "السماح من هذا المصدر" ثم عد واضغط "تنزيل وتثبيت"', 'Android cere o aprobare unică: activați „Permite din această sursă”, reveniți și apăsați din nou', 'Android demande une autorisation unique : activez « Autoriser cette source », revenez et réessayez', 'Android asks once: turn on "Allow from this source", come back and tap again', 'Android спросит один раз: включите «Разрешить из этого источника», вернитесь и нажмите снова'],
        error: ['⚠️ אין חיבור לאינטרנט או שהשרת לא ענה. נסו שוב מאוחר יותר', '⚠️ لا يوجد اتصال أو لم يرد الخادم. حاول لاحقًا', '⚠️ Fără internet sau serverul nu răspunde. Încercați mai târziu', '⚠️ Pas d\'internet ou serveur muet. Réessayez plus tard', '⚠️ No internet or no answer. Try again later', '⚠️ Нет интернета или нет ответа. Попробуйте позже'],
        auto: ['לבדוק עדכונים לבד בכל פתיחה', 'البحث عن تحديثات تلقائيًا عند الفتح', 'Verifică singur la pornire', 'Vérifier tout seul à l\'ouverture', 'Check by itself when opening', 'Проверять самостоятельно при открытии'],
        note: ['העדכון שומר את כל התזכורות, התורים וההגדרות.', 'التحديث يحتفظ بكل التذكيرات والمواعيد والإعدادات.', 'Actualizarea păstrează mementourile, programările și setările.', 'La mise à jour garde rappels, rendez-vous et réglages.', 'Updating keeps all reminders, appointments and settings.', 'Обновление сохраняет все напоминания, записи и настройки.'],
        appOnly: ['זמין רק בתוך האפליקציה בטלפון', 'متاح فقط داخل التطبيق على الهاتف', 'Disponibil doar în aplicația de pe telefon', 'Disponible seulement dans l\'application', 'Available only in the phone app', 'Доступно только в приложении на телефоне'],
        dlgTitle: ['גרסה חדשה של MedTime', 'إصدار جديد من MedTime', 'Versiune nouă MedTime', 'Nouvelle version de MedTime', 'New MedTime version', 'Новая версия MedTime'],
        dlgText: ['יש גרסה חדשה ומשופרת. לעדכן עכשיו? התזכורות שלכם נשמרות.', 'يوجد إصدار جديد ومحسّن. التحديث الآن؟ تذكيراتك محفوظة.', 'Există o versiune nouă. Actualizați acum? Mementourile rămân.', 'Une nouvelle version est prête. Mettre à jour ? Vos rappels restent.', 'A newer version is ready. Update now? Your reminders stay.', 'Готова новая версия. Обновить сейчас? Ваши напоминания сохранятся.'],
        later: ['אחר כך', 'لاحقًا', 'Mai târziu', 'Plus tard', 'Later', 'Позже'],
        now: ['עדכן עכשיו', 'حدّث الآن', 'Actualizează', 'Mettre à jour', 'Update now', 'Обновить сейчас']
    };
    const tx = k => (TX[k] || [k])[li()];

    // ---------------- help topics: [icon, title x5, text x5] ----------------
    const HELP = [
        ['➕', ['הוספת תזכורת', 'إضافة تذكير', 'Adăugare memento', 'Ajouter un rappel', 'Adding a reminder', 'Добавление напоминания'],
            ['לחצו "הוסף תזכורת" במסך הראשי. אשף קצר ילווה אתכם שלב אחרי שלב: סוג התרופה, השם, המינון (לא חובה), עוד תרופה לאותה שעה, השעה והימים. בסוף לחצו "שמור תזכורת".',
                'اضغط "إضافة تذكير" في الشاشة الرئيسية. سيرافقك معالج قصير خطوة بخطوة: نوع الدواء، الاسم، الجرعة (اختياري)، دواء آخر لنفس الساعة، الساعة والأيام. في النهاية اضغط "حفظ التذكير".',
                'Apăsați „Adaugă memento” pe ecranul principal. Un ghid scurt vă duce pas cu pas: tipul, numele, doza (opțional), alt medicament la aceeași oră, ora și zilele. La final apăsați „Salvează mementoul”.',
                'Appuyez sur « Ajouter un rappel » sur l\'écran principal. Un assistant vous guide pas à pas : type, nom, dose (facultatif), autre médicament à la même heure, heure et jours. Puis « Enregistrer le rappel ».',
                'Tap "Add reminder" on the main screen. A short wizard guides you step by step: type, name, dose (optional), another medicine at the same time, the time and the days. Then tap "Save reminder".', 'Нажмите «Добавить напоминание» на главном экране. Короткий мастер проведёт вас шаг за шагом: тип, название, доза (необязательно), ещё одно лекарство в то же время, время и дни. Затем нажмите «Сохранить напоминание».']],
        ['📋', ['רשימת התזכורות', 'قائمة التذكيرات', 'Lista mementourilor', 'Liste des rappels', 'Reminder list', 'Список напоминаний'],
            ['כפתור הרשימה מציג את כל התזכורות לפי השעה. שם אפשר גם למחוק תזכורת. תזכורת חוזרת בכל יום שבחרתם, בלי סוף, עד שמוחקים אותה.',
                'زر القائمة يعرض كل التذكيرات حسب الساعة، ويمكن حذف تذكير من هناك. يتكرر التذكير في كل يوم اخترته بلا نهاية حتى تحذفه.',
                'Butonul listă arată toate mementourile după oră; de acolo puteți și șterge. Un memento se repetă în zilele alese, fără sfârșit, până îl ștergeți.',
                'Le bouton liste montre tous les rappels par heure ; on peut aussi en supprimer. Un rappel se répète les jours choisis, sans fin, jusqu\'à sa suppression.',
                'The list button shows all reminders by time; you can delete one there. A reminder repeats on the chosen days, forever, until you delete it.', 'Кнопка списка показывает все напоминания по времени; там же можно удалить напоминание. Напоминание повторяется в выбранные дни, всегда, пока вы его не удалите.']],
        ['⏰', ['כשמגיעה תזכורת', 'عند وصول التذكير', 'Când vine mementoul', 'Quand le rappel arrive', 'When a reminder comes', 'Когда приходит напоминание'],
            ['המסך נדלק גם כשהטלפון נעול והאפליקציה סגורה, נשמע צליל, ואם בחרתם, התזכורת גם מוקראת בקול. לחצו "✅ לקחתי", או בחרו להזכיר שוב בעוד 10 דקות, חצי שעה, שעה או שעתיים.',
                'تضيء الشاشة حتى لو كان الهاتف مقفلًا والتطبيق مغلقًا، ويُسمع صوت، وإن اخترت يُقرأ التذكير بصوت عالٍ. اضغط "✅ تناولته" أو اختر التذكير مجددًا بعد 10 دقائق أو نصف ساعة أو ساعة أو ساعتين.',
                'Ecranul se aprinde chiar dacă telefonul e blocat și aplicația închisă, se aude un sunet și, dacă ați ales, mementoul e citit cu voce. Apăsați „✅ Am luat” sau amânați 10 min, 30 min, 1 oră sau 2 ore.',
                'L\'écran s\'allume même téléphone verrouillé et appli fermée, un son retentit et, si choisi, le rappel est lu à voix haute. Appuyez sur « ✅ Pris » ou faites-le revenir dans 10 min, 30 min, 1 h ou 2 h.',
                'The screen lights up even when the phone is locked and the app is closed, a sound plays and, if chosen, the reminder is read aloud. Tap "✅ Taken", or snooze for 10 min, 30 min, 1 hour or 2 hours.', 'Экран загорается, даже если телефон заблокирован и приложение закрыто, звучит сигнал и, если выбрано, напоминание зачитывается вслух. Нажмите «✅ Принято», или отложите на 10 мин, 30 мин, 1 час или 2 часа.']],
        ['🩺', ['תורים לרופא', 'مواعيد الطبيب', 'Programări la medic', 'Rendez-vous médicaux', 'Doctor appointments', 'Записи к врачу'],
            ['כפתור התורים פותח אשף: סוג הרופא, היום, השעה, המקום, פרטים נוספים (קופה, טלפון, הערות), ניווט ב-Waze ותזכורת לפני התור. התזכורת מגיעה בזמן שבחרתם, ואפשר לנווט אליו בלחיצה.',
                'زر المواعيد يفتح معالجًا: نوع الطبيب، اليوم، الساعة، المكان، تفاصيل إضافية (صندوق، هاتف، ملاحظات)، الملاحة في Waze وتذكير قبل الموعد. يصل التذكير في الوقت الذي اخترته ويمكن الملاحة بضغطة.',
                'Butonul programări deschide un ghid: medicul, ziua, ora, locul, detalii (asigurare, telefon, note), navigare Waze și memento înainte. Mementoul vine la timpul ales, iar navigarea e la o atingere.',
                'Le bouton rendez-vous ouvre un assistant : médecin, jour, heure, lieu, détails (caisse, téléphone, notes), navigation Waze et rappel avant. Le rappel arrive à l\'heure choisie, la navigation en un geste.',
                'The appointments button opens a wizard: doctor, day, time, place, extra details (health fund, phone, notes), Waze navigation and a reminder before. The reminder comes when you chose, and navigation is one tap away.', 'Кнопка записей открывает мастер: врач, день, время, место, доп. данные (больничная касса, телефон, заметки), навигация Waze и напоминание заранее. Напоминание придёт, когда вы выбрали, а навигация — в одно касание.']],
        ['🌙', ['רגע של שלווה', 'لحظة سكينة', 'Moment de liniște', 'Moment de sérénité', 'Moment of serenity', 'Минута покоя'],
            ['כפתור השלווה פותח עולמות תלת-ממדיים שקטים עם צלילים מרגיעים, תרגיל נשימה וטיימר שמכבה הכל לבד. מתאים לפני השינה.',
                'زر السكينة يفتح عوالم ثلاثية الأبعاد هادئة مع أصوات مريحة وتمرين تنفس ومؤقت يطفئ كل شيء تلقائيًا. مناسب قبل النوم.',
                'Butonul liniște deschide lumi 3D calme cu sunete relaxante, exercițiu de respirație și un temporizator care oprește totul singur. Ideal înainte de somn.',
                'Le bouton Sérénité ouvre des mondes 3D paisibles avec sons apaisants, exercice de respiration et minuterie d\'arrêt. Idéal avant de dormir.',
                'The Serenity button opens peaceful 3D worlds with soothing sounds, a breathing guide and a sleep timer that turns everything off. Great before sleep.', 'Кнопка «Покой» открывает спокойные 3D-миры с успокаивающими звуками, помощником дыхания и таймером сна, который всё выключает. Отлично перед сном.']],
        ['🌐', ['שפה', 'اللغة', 'Limba', 'Langue', 'Language', 'Язык'],
            ['בחרו אחת מ-6 שפות. כל האפליקציה, ההתראות וההקראה הקולית עוברות לשפה שבחרתם.',
                'اختر واحدة من 6 لغات. التطبيق كله والإشعارات والقراءة الصوتية تنتقل إلى اللغة المختارة.',
                'Alegeți una din 6 limbi. Toată aplicația, notificările și vocea trec în limba aleasă.',
                'Choisissez parmi 6 langues. Toute l\'appli, les notifications et la voix passent dans cette langue.',
                'Pick one of 6 languages. The whole app, notifications and voice switch to it.', 'Выберите один из 6 языков. Всё приложение, уведомления и голос переключатся на него.']],
        ['🔊', ['הקראה קולית', 'القراءة الصوتية', 'Citire cu voce', 'Lecture vocale', 'Voice readout', 'Чтение вслух'],
            ['הטלפון מקריא את התזכורת בקול. אפשר לבחור אם להקריא גם את שמות התרופות ואת המינון.',
                'الهاتف يقرأ التذكير بصوت عالٍ. يمكنك اختيار قراءة أسماء الأدوية والجرعة أيضًا.',
                'Telefonul citește mementoul cu voce. Puteți alege să citească și numele și doza.',
                'Le téléphone lit le rappel à voix haute, avec si vous voulez les noms et la dose.',
                'The phone reads the reminder aloud. You can choose to include medicine names and the dose.', 'Телефон зачитывает напоминание вслух. Можно включить названия лекарств и дозу.']],
        ['🔔', ['צליל ועוצמה', 'الصوت والمستوى', 'Sunet și volum', 'Son et volume', 'Sound and volume', 'Звук и громкость'],
            ['בחרו את צליל ההתראה (נגיעה משמיעה דוגמה) וכוונו עוצמה נפרדת לצליל ולהקראה.',
                'اختر صوت التنبيه (اللمس يُسمع مثالًا) واضبط مستوى منفصلًا للصوت وللقراءة.',
                'Alegeți sunetul (o atingere îl redă) și reglați separat volumul alertei și al vocii.',
                'Choisissez le son (un toucher le fait écouter) et réglez séparément alerte et voix.',
                'Choose the alert sound (tap to hear it) and set separate volumes for the sound and the voice.', 'Выберите звук сигнала (нажмите, чтобы послушать) и задайте отдельную громкость для звука и голоса.']],
        ['🎨', ['רקע ומראה', 'الخلفية والمظهر', 'Fundal și aspect', 'Fond et apparence', 'Background and look', 'Фон и вид'],
            ['40 רקעים תלת-ממדיים מונפשים. נגיעה ברקע מציגה אותו מיד. "אוטומטי" מחליף רקע לפי שעות היום. אפשר גם להפעיל צלילי רקע ולכוון את העוצמה.',
                '40 خلفية ثلاثية الأبعاد متحركة. اللمس يعرضها فورًا. "تلقائي" يغيّر الخلفية حسب ساعات اليوم. يمكن أيضًا تشغيل أصوات الخلفية وضبطها.',
                '40 de fundaluri 3D animate. O atingere îl arată imediat. „Automat” schimbă fundalul după ora zilei. Puteți porni și sunete de fundal.',
                '40 fonds 3D animés. Un toucher l\'affiche aussitôt. « Auto » change selon l\'heure. On peut aussi activer des sons d\'ambiance.',
                '40 animated 3D backgrounds. Tap one to see it right away. "Auto" changes it by time of day. You can also turn on background sounds.', '40 анимированных 3D-фонов. Нажмите на фон, чтобы сразу его увидеть. «Авто» меняет его по времени суток. Можно также включить фоновые звуки.']],
        ['👓', ['ראייה נוחה וגודל טקסט', 'رؤية مريحة وحجم النص', 'Vedere ușoară și mărimea textului', 'Lecture facile et taille du texte', 'Easy reading and text size', 'Удобное чтение и размер текста'],
            ['כפתור 👓 הצהוב בתחתית המסך הראשי מדליק ומכבה תצוגה לכבדי ראייה: כתב גדול, צהוב על שחור. גודל הטקסט הרגיל נבחר בהגדרות ← גודל הטקסט (A קטן, בינוני, גדול).',
                'زر 👓 الأصفر أسفل الشاشة الرئيسية يشغّل ويطفئ عرض ضعاف البصر: نص كبير، أصفر على أسود. حجم النص العادي يُختار في الإعدادات ← حجم النص.',
                'Butonul galben 👓 de jos pe ecranul principal pornește și oprește afișarea pentru vedere slabă: text mare, galben pe negru. Mărimea textului se alege în Setări ← Mărimea textului.',
                'Le bouton jaune 👓 en bas de l\'écran principal active ou coupe l\'affichage malvoyants : grand texte jaune sur noir. La taille du texte se choisit dans Réglages ← Taille du texte.',
                'The yellow 👓 button at the bottom of the main screen turns low-vision display on and off: big yellow text on black. The normal text size is chosen in Settings → Text size.', 'Жёлтая кнопка 👓 внизу главного экрана включает и выключает режим для слабого зрения: крупный жёлтый текст на чёрном. Обычный размер текста выбирается в Настройки → Размер текста.']],
        ['✅', ['מצב התזכורות', 'حالة التذكيرات', 'Starea mementourilor', 'État des rappels', 'Reminder status', 'Статус напоминаний'],
            ['בודק שכל ההרשאות של הטלפון פתוחות, כדי שתזכורות יגיעו גם כשהאפליקציה סגורה. אם משהו מסומן כבעיה, לחצו עליו והטלפון יפתח את המקום לתקן.',
                'يتحقق من أن كل أذونات الهاتف مفعّلة لتصل التذكيرات حتى والتطبيق مغلق. إن ظهرت مشكلة اضغط عليها ليفتح الهاتف مكان الإصلاح.',
                'Verifică permisiunile telefonului ca mementourile să vină și cu aplicația închisă. Dacă apare o problemă, atingeți-o pentru a o repara.',
                'Vérifie les autorisations du téléphone pour que les rappels arrivent même appli fermée. En cas de problème, touchez-le pour corriger.',
                'Checks the phone permissions so reminders arrive even when the app is closed. If something shows a problem, tap it to fix it.', 'Проверяет разрешения телефона, чтобы напоминания приходили, даже когда приложение закрыто. Если что-то показано как проблема, нажмите, чтобы исправить.']],
        ['🔄', ['עדכונים', 'التحديثات', 'Actualizări', 'Mises à jour', 'Updates', 'Обновления'],
            ['בודק אם יש גרסה חדשה של MedTime, ומוריד ומתקין אותה בלחיצה. בפעם הראשונה אנדרואיד מבקש אישור "התקנה ממקור זה". כל הנתונים נשמרים.',
                'يبحث عن إصدار جديد من MedTime وينزله ويثبته بضغطة. في المرة الأولى يطلب أندرويد إذن "التثبيت من هذا المصدر". كل البيانات محفوظة.',
                'Caută o versiune nouă MedTime, o descarcă și o instalează la o atingere. Prima dată Android cere permisiunea „din această sursă”. Datele rămân.',
                'Cherche une nouvelle version de MedTime, la télécharge et l\'installe d\'un geste. La première fois Android demande l\'autorisation « cette source ». Rien n\'est perdu.',
                'Looks for a new MedTime version, downloads and installs it in one tap. The first time Android asks to allow "this source". All your data stays.', 'Ищет новую версию MedTime, скачивает и устанавливает её в одно касание. В первый раз Android попросит разрешить «этот источник». Все ваши данные сохраняются.']],
        ['💡', ['טיפ חשוב', 'نصيحة مهمة', 'Sfat important', 'Conseil important', 'Important tip', 'Важный совет'],
            ['כדי שהתזכורות תמיד יגיעו: אל תעצרו את האפליקציה בכוח מהגדרות הטלפון, ואשרו "ללא הגבלת סוללה" כשהטלפון שואל. כפתור היציאה סוגר רק את המסך, התזכורות ממשיכות.',
                'لكي تصل التذكيرات دائمًا: لا توقف التطبيق قسرًا من إعدادات الهاتف، ووافق على "بلا قيود للبطارية". زر الخروج يغلق الشاشة فقط والتذكيرات تستمر.',
                'Ca mementourile să vină mereu: nu opriți forțat aplicația din setări și acceptați „fără restricții de baterie”. Butonul de ieșire închide doar ecranul.',
                'Pour que les rappels arrivent toujours : ne forcez pas l\'arrêt de l\'appli et acceptez « batterie sans restriction ». Le bouton quitter ferme seulement l\'écran.',
                'So reminders always arrive: don\'t force-stop the app in phone settings, and allow "no battery restrictions". The exit button only closes the screen; reminders go on.', 'Чтобы напоминания приходили всегда: не останавливайте приложение принудительно в настройках телефона и разрешите «без ограничений батареи». Кнопка выхода только закрывает экран; напоминания продолжают работать.']],
        ['🎧', ['צלילי הטבע', 'أصوات الطبيعة', 'Sunetele naturii', 'Sons de la nature', 'Nature sounds', 'Звуки природы'],
            ['במצב שלווה יש הקלטות טבע אמיתיות מ־Wikimedia Commons, ברישיון חופשי. תודה למקליטים: גשם: Zuvji (CC BY-SA 4.0) · ים: Luftrum (CC BY 3.0) · יער: Matutinho (CC BY-SA 4.0) · לילה: Glaneur de sons (CC BY 3.0) · סערה: Serg Childed (CC BY-SA 4.0) · נחל: Extemporalist (CC0) · רוח: Robert EA Harvey (CC BY-SA 4.0).',
                'في وضع السكينة تسجيلات طبيعة حقيقية من Wikimedia Commons برخصة حرة. شكرًا للمسجلين: Rain: Zuvji (CC BY-SA 4.0) · Sea: Luftrum (CC BY 3.0) · Forest: Matutinho (CC BY-SA 4.0) · Night: Glaneur de sons (CC BY 3.0) · Storm: Serg Childed (CC BY-SA 4.0) · Stream: Extemporalist (CC0) · Wind: Robert EA Harvey (CC BY-SA 4.0).',
                'Modul liniște folosește înregistrări reale din Wikimedia Commons, cu licență liberă. Mulțumiri: Rain: Zuvji (CC BY-SA 4.0) · Sea: Luftrum (CC BY 3.0) · Forest: Matutinho (CC BY-SA 4.0) · Night: Glaneur de sons (CC BY 3.0) · Storm: Serg Childed (CC BY-SA 4.0) · Stream: Extemporalist (CC0) · Wind: Robert EA Harvey (CC BY-SA 4.0).',
                'Le mode sérénité utilise de vrais enregistrements de Wikimedia Commons, sous licence libre. Merci à : Rain: Zuvji (CC BY-SA 4.0) · Sea: Luftrum (CC BY 3.0) · Forest: Matutinho (CC BY-SA 4.0) · Night: Glaneur de sons (CC BY 3.0) · Storm: Serg Childed (CC BY-SA 4.0) · Stream: Extemporalist (CC0) · Wind: Robert EA Harvey (CC BY-SA 4.0).',
                'Serenity mode uses real nature recordings from Wikimedia Commons under free licenses. Thanks to: Rain: Zuvji (CC BY-SA 4.0) · Sea: Luftrum (CC BY 3.0) · Forest: Matutinho (CC BY-SA 4.0) · Night: Glaneur de sons (CC BY 3.0) · Storm: Serg Childed (CC BY-SA 4.0) · Stream: Extemporalist (CC0) · Wind: Robert EA Harvey (CC BY-SA 4.0).', 'Режим покоя использует настоящие записи природы с Wikimedia Commons по свободным лицензиям. Спасибо: Дождь: Zuvji (CC BY-SA 4.0) · Море: Luftrum (CC BY 3.0) · Лес: Matutinho (CC BY-SA 4.0) · Ночь: Glaneur de sons (CC BY 3.0) · Гроза: Serg Childed (CC BY-SA 4.0) · Ручей: Extemporalist (CC0) · Ветер: Robert EA Harvey (CC BY-SA 4.0).']],
    ];

    // ---------------- build the two tiles ----------------
    const grid = document.querySelector('#settings-page .set-grid');
    if (!grid) return;
    function tile(id, ico, grad, bodyHtml) {
        const s = document.createElement('section');
        s.className = 'set-tile x-tile'; s.id = id;
        s.style.setProperty('--g', grad);
        s.innerHTML = '<button type="button" class="set-tile-head" onclick="toggleTile(this)"><span class="set-ico">' + ico +
            '</span><span class="set-txt"><span class="set-title"></span><span class="set-sub"></span></span><span class="set-chev">⌄</span></button>' +
            '<div class="set-body"><div class="panel-head"><span class="grip"></span><span class="p-ico">' + ico +
            '</span><span class="p-title"></span><button type="button" class="p-close" aria-label="close">✕</button></div>' + bodyHtml + '</div>';
        s.querySelector('.p-close').onclick = () => closeTiles();
        s.querySelector('.p-ico').style.setProperty('--g', grad);
        grid.appendChild(s);
        return s;
    }
    const upd = tile('tile-upd', '🔄', 'linear-gradient(135deg,#2dd4bf,#0e7490)',
        '<div class="upd-ver" id="upd-ver"></div><button type="button" class="upd-btn" id="upd-btn"></button>' +
        '<div class="upd-bar" id="upd-bar"><i></i></div><div class="upd-msg" id="upd-msg"></div>' +
        '<label class="toggle-row"><span id="upd-auto-txt"></span><input type="checkbox" id="upd-auto" class="toggle"></label>' +
        '<div class="vol-note" id="upd-note"></div>');
    const help = tile('tile-help', '📖', 'linear-gradient(135deg,#7dd3fc,#818cf8)', '<div class="help-list" id="help-list"></div>');

    // ---------------- updates ----------------
    const KEY = 'medtime_upd';
    const st = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
    if (st.auto === undefined) st.auto = true;
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } };
    const cur = has('getVersion') ? N.getVersion() : 0;
    let latest = 0, mode = 'idle', pct = -1, msgKey = '', fromAuto = false;

    function drawUpd() {
        upd.querySelector('.set-title').textContent = tx('updTitle').replace(/^\S+\s/, '');
        upd.querySelector('.p-title').textContent = tx('updTitle').replace(/^\S+\s/, '');
        upd.querySelector('.set-sub').textContent = latest > cur && cur ? tx('newer').replace(/^\S+\s/, '') + latest : tx('version') + ' ' + (cur || '—');
        $('upd-ver').innerHTML = '<span>' + tx('version') + '</span><b>' + (cur || '—') + '</b>';
        const b = $('upd-btn');
        b.disabled = !has('checkUpdate') || mode === 'checking' || mode === 'loading';
        b.classList.toggle('go', latest > cur && !!cur);
        b.textContent = mode === 'checking' ? tx('checking') : (latest > cur && cur ? tx('install') : tx('check'));
        const bar = $('upd-bar');
        bar.classList.toggle('on', mode === 'loading');
        bar.firstChild.style.width = (pct < 0 ? 30 : pct) + '%';
        bar.classList.toggle('busy', mode === 'loading' && pct < 0);
        let m = '';
        if (!has('checkUpdate')) m = tx('appOnly');
        else if (mode === 'loading') m = tx('loading') + (pct >= 0 ? pct + '%' : '');
        else if (msgKey === 'newer') m = tx('newer') + latest;
        else if (msgKey) m = tx(msgKey);
        $('upd-msg').textContent = m;
        $('upd-msg').className = 'upd-msg ' + msgKey;
        $('upd-auto-txt').textContent = tx('auto');
        $('upd-auto').checked = !!st.auto;
        $('upd-note').textContent = tx('note');
        const pill = $('upd-pill');
        if (pill) {
            if (mode === 'loading' || msgKey === 'ready' || msgKey === 'error' || msgKey === 'perm') {
                pill.textContent = mode === 'loading' ? '⬇️ ' + tx('loading') + (pct >= 0 ? pct + '%' : '') : tx(msgKey);
                pill.classList.add('on');
                if (mode !== 'loading') { clearTimeout(pill._t); pill._t = setTimeout(() => pill.classList.remove('on'), 7000); }
            }
        }
    }
    function check(auto) {
        if (!has('checkUpdate') || mode === 'checking' || mode === 'loading') return;
        fromAuto = !!auto; mode = 'checking'; msgKey = ''; drawUpd();
        st.last = Date.now(); save();
        N.checkUpdate();
    }
    function install() {
        if (!has('installUpdate')) return;
        mode = 'loading'; pct = -1; msgKey = ''; drawUpd();
        N.installUpdate();
    }
    $('upd-btn').onclick = () => { if (navigator.vibrate) navigator.vibrate(12); latest > cur && cur ? install() : check(false); };
    $('upd-auto').onchange = e => { st.auto = e.target.checked; save(); };
    window.mtUpd = function (r) {
        if (!r) return;
        if (r.type === 'check') {
            mode = 'idle';
            if (!r.ok) { msgKey = fromAuto ? '' : 'error'; drawUpd(); return; }
            latest = r.latest;
            msgKey = latest > cur ? 'newer' : 'upToDate';
            drawUpd();
            if (fromAuto && latest > cur && st.skip !== latest && window.mtDialog) {
                mtDialog({ icon: '🎉', title: tx('dlgTitle'), text: tx('dlgText'), ok: tx('now'), cancel: tx('later') }).then(ok => {
                    if (ok) install(); else { st.skip = latest; save(); }
                });
            }
        } else if (r.type === 'progress') { mode = 'loading'; pct = r.pct; drawUpd(); }
        else if (r.type === 'ready') { mode = 'idle'; msgKey = 'ready'; drawUpd(); }
        else if (r.type === 'permission') {
            // M-076: a friendly explanation first, then Android's one-time screen; when allowed, the download starts by itself
            mode = 'idle'; msgKey = 'perm'; drawUpd();
            if (window.mtPermGuide) mtPermGuide('install').then(ok => { if (ok) install(); });
            else if (has('openInstallPermission')) N.openInstallPermission();
        }
        else if (r.type === 'error') { mode = 'idle'; msgKey = 'error'; drawUpd(); }
    };
    // small floating line while downloading outside the settings screen
    const pill = document.createElement('div'); pill.id = 'upd-pill'; pill.className = 'upd-pill';
    document.body.appendChild(pill);
    // automatic check a little after the opening, at most every 6 hours
    setTimeout(() => { if (st.auto && has('checkUpdate') && (!st.last || Date.now() - st.last > 6 * 3600e3)) check(true); }, 14000);

    // ---------------- help ----------------
    function drawHelp() {
        const i = li();
        help.querySelector('.set-title').textContent = tx('helpTitle').replace(/^\S+\s/, '');
        help.querySelector('.p-title').textContent = tx('helpTitle').replace(/^\S+\s/, '');
        help.querySelector('.set-sub').textContent = tx('helpSub');
        const list = $('help-list');
        const open = [...list.querySelectorAll('details[open]')].map(d => d.dataset.i);
        list.innerHTML = '';
        HELP.forEach((h, n) => {
            const d = document.createElement('details');
            d.className = 'help-item'; d.dataset.i = n;
            if (open.includes(String(n))) d.open = true;
            d.innerHTML = '<summary><span class="h-ico">' + h[0] + '</span><span class="h-t"></span><span class="h-chev">⌄</span></summary><p></p>';
            d.querySelector('.h-t').textContent = h[1][i];
            d.querySelector('p').textContent = h[2][i];
            d.addEventListener('toggle', () => {
                if (d.open) { list.querySelectorAll('details[open]').forEach(o => { if (o !== d) o.open = false; }); if (navigator.vibrate) navigator.vibrate(8); }
            });
            list.appendChild(d);
        });
    }

    window.xRender = function () { drawUpd(); drawHelp(); };
    xRender();

    // ---------------- M-059: a light runs around a random menu frame now and then ----------------
    const SEL = '.set-tile:not(.open) .set-ico, .ap-card, .med-item, .list-btn, .appt-btn, .relax-btn, .btn-med, .wz-nav button, .page-done, .appt-new, .af-chip, .type-btn, .help-item';
    function visible(el) {
        const r = el.getBoundingClientRect();
        if (r.width < 40 || r.height < 24 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.3) return false;
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 20));
        return !!hit && (el === hit || el.contains(hit) || hit.contains(el));
    }
    function glint() {
        setTimeout(glint, 1800 + Math.random() * 3200);
        if (document.hidden || window.relaxOn || $('splash')) return;
        if (document.documentElement.classList.contains('lowvision')) return;
        const all = [...document.querySelectorAll(SEL)].filter(visible);
        if (!all.length) return;
        const el = all[Math.floor(Math.random() * all.length)];
        if (el.querySelector(':scope > .mt-glint')) return;
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        const g = document.createElement('span');
        g.className = 'mt-glint';
        g.style.setProperty('--gs', Math.floor(Math.random() * 360) + 'deg');
        g.style.setProperty('--gd', (Math.random() < 0.5 ? 1 : -1) * 360 + 'deg');
        el.appendChild(g);
        setTimeout(() => g.remove(), 2000);
    }
    setTimeout(glint, 9000);
})();
