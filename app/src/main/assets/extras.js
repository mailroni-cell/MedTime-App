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
        helpBack: ['→ למסך הראשי', '→ للشاشة الرئيسية', '← Ecran principal', '← Écran principal', '← Main screen', '← На главный'],
        helpTopics: ['→ חזרה לנושאים', '→ رجوع للمواضيع', '← Înapoi la subiecte', '← Retour aux sujets', '← Back to topics', '← Назад к темам'],
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
        // M-168 (owner): on opening, a newer version updates by itself behind a "please wait" screen
        wait: ['נא להמתין, מעדכן לגרסה חדשה יותר…', 'يرجى الانتظار، جارٍ التحديث إلى إصدار أحدث…', 'Vă rugăm așteptați, se actualizează la o versiune nouă…', 'Veuillez patienter, mise à jour vers une version plus récente…', 'Please wait, updating to a newer version…', 'Пожалуйста, подождите, обновляем до новой версии…'],
        waitSub: ['התזכורות, התורים וההגדרות שלכם נשמרים', 'تذكيراتك ومواعيدك وإعداداتك محفوظة', 'Mementourile, programările și setările rămân', 'Vos rappels, rendez-vous et réglages sont conservés', 'Your reminders, appointments and settings stay', 'Ваши напоминания, записи и настройки сохранятся'],
        waitTap: ['כמעט סיימנו: במסך של אנדרואיד לחצו "עדכון". אם הטלפון מבקש אישור, לחצו "אישור" או "אפשר"', 'اقتربنا: اضغط "تحديث" في شاشة أندرويد. إذا طلب الهاتف موافقة، اضغط "موافق" أو "سماح"', 'Aproape gata: apăsați "Actualizează" pe ecranul Android. Dacă telefonul cere confirmare, apăsați "OK" sau "Permite"', 'Presque fini : touchez « Mettre à jour » sur l\'écran Android. Si le téléphone demande une confirmation, touchez « OK » ou « Autoriser »', 'Almost done: tap "Update" on the Android screen. If the phone asks to confirm, tap "OK" or "Allow"', 'Почти готово: нажмите «Обновить» на экране Android. Если телефон просит подтверждение, нажмите «ОК» или «Разрешить»'],
        preT: ['יש גרסה חדשה של MedTime', 'يوجد إصدار جديد من MedTime', 'Există o versiune nouă MedTime', 'Une nouvelle version de MedTime est disponible', 'A new MedTime version is available', 'Доступна новая версия MedTime'],
        preOk: ['הבנתי, לעדכן 👍', 'فهمت، حدّث 👍', 'Am înțeles, actualizează 👍', 'Compris, mettre à jour 👍', 'Got it, update 👍', 'Понятно, обновить 👍'],
        doneT: ['✅ MedTime עודכן לגרסה {v}', '✅ تم تحديث MedTime إلى الإصدار {v}', '✅ MedTime a fost actualizat la versiunea {v}', '✅ MedTime a été mis à jour (version {v})', '✅ MedTime was updated to version {v}', '✅ MedTime обновлён до версии {v}'],
        doneX: ['העדכון מתחיל עכשיו. אם הטלפון מבקש אישור, לחצו "עדכון", "אישור" או "אפשר". התזכורות, התורים וההגדרות שלכם נשמרים.', 'سيبدأ التحديث الآن. إذا طلب الهاتف موافقة، اضغط "تحديث" أو "موافق" أو "سماح". تذكيراتك ومواعيدك وإعداداتك محفوظة.', 'Actualizarea începe acum. Dacă telefonul cere confirmare, apăsați "Actualizează", "OK" sau "Permite". Mementourile, programările și setările rămân.', 'La mise à jour commence maintenant. Si le téléphone demande une confirmation, touchez « Mettre à jour », « OK » ou « Autoriser ». Vos rappels, rendez-vous et réglages sont conservés.', 'The update starts now. If the phone asks to confirm, tap "Update", "OK" or "Allow". Your reminders, appointments and settings stay.', 'Обновление начинается. Если телефон просит подтверждение, нажмите «Обновить», «ОК» или «Разрешить». Ваши напоминания, записи и настройки сохранятся.'],
        doneOk: ['הבנתי 👍', 'فهمت 👍', 'Am înțeles 👍', 'Compris 👍', 'Got it 👍', 'Понятно 👍'],
        // M-212 (owner): choose now or later; after "now" everything happens by itself, including closing and reopening
        upQ: ['העדכון לוקח בערך דקה. האפליקציה תיסגר ותיפתח מחדש לבד. התזכורות, התורים וההגדרות נשמרים. בפעם הראשונה הטלפון עלול לבקש אישור אחד: לחצו "עדכון".',
            'يستغرق التحديث نحو دقيقة. سيُغلق التطبيق ويُفتح من جديد تلقائيًا. التذكيرات والمواعيد والإعدادات محفوظة. في المرة الأولى قد يطلب الهاتف موافقة واحدة: اضغط "تحديث".',
            'Actualizarea durează cam un minut. Aplicația se închide și se redeschide singură. Mementourile, programările și setările rămân. Prima dată telefonul poate cere o confirmare: apăsați „Actualizează”.',
            'La mise à jour prend environ une minute. L’appli se ferme et se rouvre toute seule. Rappels, rendez-vous et réglages sont conservés. La première fois, le téléphone peut demander une confirmation : appuyez sur « Mettre à jour ».',
            'The update takes about a minute. The app closes and opens again by itself. Reminders, appointments and settings are kept. The first time, the phone may ask once: tap "Update".',
            'Обновление займёт около минуты. Приложение само закроется и снова откроется. Напоминания, записи и настройки сохранятся. В первый раз телефон может попросить подтверждение: нажмите «Обновить».'],
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
            ['בהגדרות ⚙️ ← "צליל וקול" ← לשונית "🗣️ הקראה וקול": מדליקים "להקריא בקול", בוחרים אם להגיד גם את שמות התרופות והמינון, ובוחרים קול (▶ משמיע דוגמה).',
                'في الإعدادات ⚙️ ← "الصوت والقراءة" ← تبويب "🗣️ القراءة والصوت": شغّل القراءة بصوت عالٍ، واختر قول أسماء الأدوية والجرعة، واختر الصوت (▶ يُسمع مثالًا).',
                'În setări ⚙️ → „Sunet și voce” → fila „🗣️ Citire și voce”: porniți citirea cu voce, alegeți dacă spune numele și doza, și alegeți vocea (▶ redă un exemplu).',
                'Réglages ⚙️ → « Son et voix » → onglet « 🗣️ Lecture et voix » : activez la lecture à voix haute, choisissez de dire les noms et la dose, et choisissez la voix (▶ pour écouter).',
                'Settings ⚙️ → "Sound and voice" → tab "🗣️ Readout and voice": turn on reading aloud, choose whether to say the medicine names and dose, and pick a voice (▶ plays a sample).', 'Настройки ⚙️ → «Звук и голос» → вкладка «🗣️ Чтение и голос»: включите чтение вслух, выберите, называть ли лекарства и дозу, и выберите голос (▶ — пример).']],
        ['🔔', ['צליל ועוצמה', 'الصوت والمستوى', 'Sunet și volum', 'Son et volume', 'Sound and volume', 'Звук и громкость'],
            ['בהגדרות ⚙️ ← "צליל וקול" ← לשונית "🎵 צליל": למעלה 9 צלילים מומלצים, נגיעה בוחרת ומשמיעה. עוד צלילים וצלילי הטלפון נמצאים מתחת. בלשונית "📳 רטט" בוחרים סוג רטט.',
                'في الإعدادات ⚙️ ← "الصوت والقراءة" ← تبويب "🎵 الصوت": في الأعلى 9 أصوات مقترحة، اللمس يختار ويُسمع. المزيد وأصوات الهاتف في الأسفل. وفي تبويب "📳 الاهتزاز" تختار نوع الاهتزاز.',
                'Setări ⚙️ → „Sunet și voce” → fila „🎵 Sunet”: sus 9 sunete recomandate, atingerea alege și redă. Alte sunete și cele ale telefonului sunt mai jos. Fila „📳 Vibrație” alege vibrația.',
                'Réglages ⚙️ → « Son et voix » → onglet « 🎵 Son » : en haut 9 sons conseillés, un toucher choisit et fait écouter. Les autres sons et ceux du téléphone sont en dessous. L’onglet « 📳 Vibration » règle la vibration.',
                'Settings ⚙️ → "Sound and voice" → tab "🎵 Sound": 9 recommended sounds at the top, a tap chooses and plays. More sounds and the phone\'s own are below. The "📳 Vibration" tab picks the vibration.', 'Настройки ⚙️ → «Звук и голос» → вкладка «🎵 Звук»: вверху 9 рекомендуемых звуков, нажатие выбирает и проигрывает. Другие звуки и звуки телефона ниже. Вкладка «📳 Вибрация» — выбор вибрации.']],
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

    // M-206 (owner): help topics for everything added lately, in a logical order, shown as big tiles (no scrolling)
    HELP.push(
        ['💊', ['כבר לקחתי ותמונה', 'تناولته مبكرًا وصورة', 'Luat deja și poză', 'Déjà pris et photo', 'Taken early and photo', 'Уже принял и фото'],
            ['בכל תזכורת ב"התזכורות שלי": "⏰ כבר לקחתי" מסמן שלקחתם מוקדם, והתזכורת של היום לא תצלצל. "📷 תמונה" שומר תמונה של הכדור, והיא מופיעה גם במסך התזכורת, כדי שלא תתבלבלו.',
                'في كل تذكير داخل "تذكيراتي": "⏰ تناولته مبكرًا" يسجّل أنك أخذت الدواء، فلا يرنّ تذكير اليوم. "📷 صورة" تحفظ صورة الحبة وتظهر أيضًا في شاشة التذكير حتى لا تخطئ.',
                'La fiecare memento din „Mementourile mele”: „⏰ Luat deja” notează că l-ați luat mai devreme și mementoul de azi nu mai sună. „📷 Poză” salvează o poză a pastilei, care apare și pe ecranul mementoului.',
                'Sur chaque rappel de « Mes rappels » : « ⏰ Déjà pris » note que vous l’avez pris en avance, et le rappel du jour ne sonne pas. « 📷 Photo » garde une photo du comprimé, affichée aussi sur l’écran du rappel.',
                'On each reminder in "My reminders": "⏰ Taken already" marks that you took it early, so today\'s reminder will not ring. "📷 Photo" saves a picture of the pill, shown on the reminder screen too, so you never mix them up.',
                'В каждом напоминании в «Мои напоминания»: «⏰ Уже принял» отмечает, что вы приняли лекарство раньше, и сегодня напоминание не прозвенит. «📷 Фото» сохраняет снимок таблетки, он виден и на экране напоминания.']],
        ['📷', ['בדיקת תרופה', 'فحص دواء', 'Verificare medicament', 'Vérifier un médicament', 'Medicine check', 'Проверка лекарства'],
            ['הכפתור הכחול במסך הראשי: מצלמים את האריזה או כותבים שם, ורואים הסבר פשוט למה התרופה משמשת, אזהרה חשובה, ואת העלון הרשמי של משרד הבריאות. קיבלתם בבית המרקחת תרופה אחרת? "להשוות" בודק אם היא תחליף לתרופה שלכם. בכל תרופה ב"התזכורות שלי" יש גם כפתור "📖 מה זה?".',
                'الزر الأزرق في الشاشة الرئيسية: صوّر العلبة أو اكتب الاسم، وسترى شرحًا بسيطًا لاستعمال الدواء وتحذيرًا مهمًا والنشرة الرسمية لوزارة الصحة. أعطتك الصيدلية دواءً آخر؟ "قارن" يفحص إن كان بديلًا لدوائك. ولكل دواء في "تذكيراتي" زر "📖 ما هذا؟".',
                'Butonul albastru de pe ecranul principal: fotografiați cutia sau scrieți numele și vedeți o explicație simplă, o avertizare importantă și prospectul oficial al Ministerului Sănătății. Ați primit alt medicament la farmacie? „Compară” verifică dacă e un înlocuitor. Fiecare medicament din „Mementourile mele” are și „📖 Ce este?”.',
                'Le bouton bleu de l’écran principal : photographiez la boîte ou écrivez le nom, et voyez une explication simple, un avertissement important et la notice officielle du ministère de la Santé. La pharmacie vous a donné un autre médicament ? « Comparer » vérifie s’il remplace le vôtre. Chaque médicament de « Mes rappels » a aussi « 📖 C’est quoi ? ».',
                'The blue button on the main screen: photograph the box or type the name, and see a plain explanation of what the medicine is for, an important warning, and the official Ministry of Health leaflet. Got a different medicine at the pharmacy? "Compare" checks if it replaces yours. Every medicine in "My reminders" also has a "📖 What is it?" button.',
                'Синяя кнопка на главном экране: сфотографируйте упаковку или введите название и увидите простое объяснение, важное предупреждение и официальный вкладыш Минздрава. В аптеке дали другое лекарство? «Сравнить» проверит, заменяет ли оно ваше. У каждого лекарства в «Мои напоминания» есть кнопка «📖 Что это?».']],
        ['🌡️', ['מדדים', 'القياسات', 'Valori', 'Mesures', 'Vitals', 'Показатели'],
            ['הכפתור הוורוד במסך הראשי: רושמים לחץ דם, סוכר, דופק ומשקל בלי להקליד. הכפתורים − ו־+ משנים את המספר (לחיצה ארוכה = מהר). רואים גרף ורשימה, והכל נכנס לדוח ה־PDF לרופא.',
                'الزر الوردي في الشاشة الرئيسية: سجّل ضغط الدم والسكر والنبض والوزن بلا كتابة. الزران − و+ يغيّران الرقم (الضغط المطوّل = أسرع). ترى رسمًا بيانيًا وقائمة، وكل شيء يدخل تقرير PDF للطبيب.',
                'Butonul roz de pe ecranul principal: notați tensiunea, glicemia, pulsul și greutatea fără să scrieți. Butoanele − și + schimbă numărul (apăsare lungă = repede). Vedeți grafic și listă, iar totul intră în raportul PDF pentru medic.',
                'Le bouton rose de l’écran principal : notez tension, glycémie, pouls et poids sans taper. Les boutons − et + changent le nombre (appui long = rapide). Vous voyez un graphique et une liste, et tout figure dans le rapport PDF pour le médecin.',
                'The pink button on the main screen: log blood pressure, sugar, pulse and weight without typing. The − and + buttons change the number (hold = fast). You see a chart and a list, and everything goes into the PDF report for the doctor.',
                'Розовая кнопка на главном экране: записывайте давление, сахар, пульс и вес без набора текста. Кнопки − и + меняют число (долгое нажатие = быстро). Видны график и список, всё попадает в PDF-отчёт для врача.']],
        ['🆘', ['עזרה ראשונה', 'إسعاف أولي', 'Prim ajutor', 'Premiers secours', 'First aid', 'Первая помощь'],
            ['הכפתור האדום במסך הראשי. למעלה: חיוג מהיר למד"א 101 ולמרכז ההרעלות. מתחת בוחרים מה קרה: מינון יתר, תרופה לא נכונה, הרעלה, פרכוס, כאב בחזה, שבץ, אלרגיה, עילפון, סוכר נמוך, חנק או נפילה, ומקבלים 5 צעדים פשוטים. במצב חירום תמיד מתקשרים קודם ל־101.',
                'الزر الأحمر في الشاشة الرئيسية. في الأعلى: اتصال سريع بنجمة داود الحمراء 101 وبمركز السموم. في الأسفل تختار ما حدث: جرعة زائدة، دواء خاطئ، تسمم، نوبة تشنج، ألم في الصدر، سكتة، حساسية، إغماء، سكر منخفض، اختناق أو سقوط، وتحصل على 5 خطوات بسيطة. في الطوارئ اتصل أولًا بـ 101.',
                'Butonul roșu de pe ecranul principal. Sus: apel rapid la ambulanță (MDA) 101 și la centrul de toxicologie. Dedesubt alegeți ce s-a întâmplat: supradoză, medicament greșit, otrăvire, criză, durere în piept, AVC, alergie, leșin, zahăr scăzut, sufocare sau cădere, și primiți 5 pași simpli. În urgență sunați întâi la 101.',
                'Le bouton rouge de l’écran principal. En haut : appel rapide du SAMU israélien (MDA) 101 et du centre antipoison. En dessous, choisissez ce qui s’est passé : surdose, mauvais médicament, intoxication, convulsions, douleur thoracique, AVC, allergie, malaise, hypoglycémie, étouffement ou chute, et suivez 5 étapes simples. En urgence, appelez toujours d’abord le 101.',
                'The red button on the main screen. At the top: quick call to MDA 101 and the poison center. Below, pick what happened: overdose, wrong medicine, poisoning, seizure, chest pain, stroke, allergy, fainting, low sugar, choking or a fall, and get 5 simple steps. In an emergency always call 101 first.',
                'Красная кнопка на главном экране. Вверху: быстрый звонок в скорую (МАДА) 101 и в токсикологический центр. Ниже выберите, что случилось: передозировка, не то лекарство, отравление, судороги, боль в груди, инсульт, аллергия, обморок, низкий сахар, удушье или падение, и получите 5 простых шагов. В экстренной ситуации сначала звоните 101.']],
        ['📇', ['כרטיס חירום ומסך נעילה', 'بطاقة الطوارئ وشاشة القفل', 'Fișă de urgență și ecran blocat', 'Fiche d’urgence et écran verrouillé', 'Emergency card and lock screen', 'Карта экстренной помощи и экран блокировки'],
            ['בתוך עזרה ראשונה: "📋 הצג לצוות החירום". כרטיס לבן וגדול עם השם, התרופות הקבועות והשעות, אלרגיות ומחלות (לוחצים "עריכה" כדי לכתוב), ואיש הקשר במשפחה עם כפתור חיוג. מדליקים "הצג במסך הנעילה" והמידע יופיע גם כשהטלפון נעול, כדי שצוות רפואי יראה אותו.',
                'داخل الإسعاف الأولي: "📋 اعرض لفريق الطوارئ". بطاقة بيضاء كبيرة فيها الاسم والأدوية الدائمة ومواعيدها والحساسية والأمراض (اضغط "تعديل" للكتابة) وجهة الاتصال من العائلة مع زر اتصال. فعّل "اعرض في شاشة القفل" لتظهر المعلومات حتى والهاتف مقفل، ليراها الفريق الطبي.',
                'În Prim ajutor: „📋 Arată echipei de urgență”. O fișă albă, mare, cu numele, medicamentele zilnice și orele, alergiile și bolile (apăsați „Editează” pentru a scrie) și persoana de contact din familie, cu buton de apel. Porniți „Arată pe ecranul blocat” ca informația să apară și cu telefonul blocat.',
                'Dans Premiers secours : « 📋 Montrer à l’équipe de secours ». Une grande fiche blanche avec le nom, les médicaments habituels et leurs heures, les allergies et maladies (appuyez sur « Modifier » pour écrire) et le contact familial avec un bouton d’appel. Activez « Afficher sur l’écran verrouillé » pour que les secours la voient même téléphone verrouillé.',
                'Inside First aid: "📋 Show to the emergency team". A big white card with the name, regular medicines and their times, allergies and conditions (tap "Edit" to write them) and the family contact with a call button. Turn on "Show on the lock screen" and the card appears even when the phone is locked, so medical staff can see it.',
                'В «Первой помощи»: «📋 Показать бригаде скорой». Большая белая карта: имя, постоянные лекарства и время приёма, аллергии и болезни (нажмите «Изменить», чтобы написать) и контакт из семьи с кнопкой звонка. Включите «Показывать на экране блокировки», и медики увидят карту даже на заблокированном телефоне.']]
    );
    // the calm topic now covers the real videos and sounds; the old credits topic is replaced by the © button in calm mode
    (h => { if (h) h[2] = ['כפתור השלווה פותח סרטוני טבע אמיתיים (ים, יער, מפל, גשם, כוכבים ועוד) ועולמות תלת־ממדיים, עם צלילי טבע מוקלטים לבחירה וטיימר שמכבה הכל לבד. צליל מתחיל רק כשבוחרים אותו. שמות היוצרים והרישיונות נמצאים בכפתור © במסך השלווה.',
        'زر السكينة يفتح فيديوهات طبيعة حقيقية (بحر، غابة، شلال، مطر، نجوم وغيرها) وعوالم ثلاثية الأبعاد، مع أصوات طبيعة مسجّلة تختارها ومؤقت يطفئ كل شيء تلقائيًا. الصوت لا يبدأ إلا عندما تختاره. أسماء المبدعين والتراخيص في زر © بشاشة السكينة.',
        'Butonul liniște deschide filme reale din natură (mare, pădure, cascadă, ploaie, stele și altele) și lumi 3D, cu sunete reale la alegere și un temporizator care oprește totul singur. Sunetul pornește doar când îl alegeți. Autorii și licențele sunt la butonul © din ecranul de liniște.',
        'Le bouton Sérénité ouvre de vraies vidéos de nature (mer, forêt, cascade, pluie, étoiles…) et des mondes 3D, avec des sons de nature enregistrés au choix et une minuterie qui éteint tout. Un son ne démarre que si vous le choisissez. Auteurs et licences : bouton © de l’écran Sérénité.',
        'The Serenity button opens real nature videos (sea, forest, waterfall, rain, stars and more) and 3D worlds, with recorded nature sounds you pick and a timer that turns everything off. A sound starts only when you choose it. Authors and licenses are under the © button on the serenity screen.',
        'Кнопка «Покой» открывает настоящие видео природы (море, лес, водопад, дождь, звёзды и др.) и 3D-миры, с записанными звуками природы на выбор и таймером, который всё выключает. Звук включается только по вашему выбору. Авторы и лицензии — кнопка © на экране покоя.']; })(HELP.find(h => h[0] === '🌙'));
    const HELP_ORDER = ['➕', '📋', '⏰', '💊', '📷', '🌡️', '🩺', '🆘', '📇', '🌙', '🌐', '🔊', '🔔', '🎨', '👓', '✅', '🔄', '💡'];
    HELP.splice(0, HELP.length, ...HELP_ORDER.map(k => HELP.find(h => h[0] === k)).filter(Boolean));

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
            // M-169 (owner): before the update, and only when there is one: say the phone may ask to approve, then update
            if (fromAuto && latest > cur && cur) {
                const go = () => { waitShow(); install(); };
                // M-212: "Later" waits 4 hours before asking again (the update stays available in settings ⚙️ → Updates)
                if ((st.later || 0) > Date.now()) return;
                if (window.mtDialog) mtDialog({ icon: '🎉', title: tx('preT'), text: tx('upQ'), ok: '🔄 ' + tx('now'), cancel: '⏰ ' + tx('later') }).then(v => {
                    if (v) go(); else { st.later = Date.now() + 4 * 3600e3; save(); }
                }); else go();
            }
        } else if (r.type === 'progress') { mode = 'loading'; pct = r.pct; drawUpd(); waitDraw(); }
        else if (r.type === 'ready') { mode = 'idle'; msgKey = 'ready'; drawUpd(); waitDraw(true); }
        else if (r.type === 'permission') {
            waitHide();
            // M-076: a friendly explanation first, then Android's one-time screen; when allowed, the download starts by itself
            mode = 'idle'; msgKey = 'perm'; drawUpd();
            if (window.mtPermGuide) mtPermGuide('install').then(ok => { if (ok) install(); });
            else if (has('openInstallPermission')) N.openInstallPermission();
        }
        else if (r.type === 'error') { mode = 'idle'; msgKey = 'error'; drawUpd(); waitHide(); }
    };
    // M-168: full-screen "please wait, updating" while the new version downloads
    let wt = null;
    function waitShow() {
        if (wt) return;
        if (!document.getElementById('mt-wait-css')) {
            const c = document.createElement('style'); c.id = 'mt-wait-css';
            c.textContent = '#mt-wait{position:fixed!important;left:0!important;right:0!important;top:0!important;bottom:0!important;margin:0!important;width:auto!important;height:auto!important;box-sizing:border-box;z-index:2147483600!important;display:flex!important;background:radial-gradient(circle at 50% 35%,#1e3a8a,#020617 70%);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:24px;text-align:center;opacity:0;transition:opacity .3s}' +
                '#mt-wait.in{opacity:1}#mt-wait .w-ico{font-size:4.2rem;will-change:transform;animation:mtWSpin 2.2s linear infinite}@keyframes mtWSpin{to{transform:rotate(360deg)}}' +
                '#mt-wait b{font-size:1.5rem;line-height:1.4;max-width:420px}#mt-wait small{font-size:1.05rem;color:#bae6fd}' +
                '#mt-wait>*{margin-left:auto!important;margin-right:auto!important}#mt-wait .w-bar{width:min(320px,80vw);flex:0 0 auto;height:14px;border-radius:9px;background:rgba(255,255,255,.15);overflow:hidden}#mt-wait .w-bar i{display:block;height:100%;width:8%;background:linear-gradient(90deg,#22d3ee,#a78bfa);border-radius:9px;transition:width .3s}' +
                '#mt-wait .w-pct{font-size:1.2rem;font-weight:800;color:#67e8f9}#mt-wait.done .w-ico{animation:none}';
            document.head.appendChild(c);
        }
        wt = document.createElement('div'); wt.id = 'mt-wait'; wt.dir = li() < 2 ? 'rtl' : 'ltr';
        wt.innerHTML = '<div class="w-ico">🔄</div><b></b><div class="w-bar"><i></i></div><div class="w-pct"></div><small></small>';
        document.body.appendChild(wt); requestAnimationFrame(() => wt && wt.classList.add('in'));
        waitDraw();
    }
    function waitDraw(ready) {
        if (!wt) return;
        wt.classList.toggle('done', !!ready);
        wt.querySelector('.w-ico').textContent = ready ? '✅' : '🔄';
        wt.querySelector('b').textContent = tx(ready ? 'waitTap' : 'wait');
        wt.querySelector('small').textContent = tx('waitSub');
        wt.querySelector('.w-bar i').style.width = (ready ? 100 : Math.max(8, pct)) + '%';
        wt.querySelector('.w-pct').textContent = ready ? '' : (pct >= 0 ? pct + '%' : '');
        // if Android's screen was closed without updating, let the user back into the app
        if (ready) { clearTimeout(wt._t); wt._t = setTimeout(waitHide, 60000); }
    }
    function waitHide() { if (!wt) return; const w = wt; wt = null; w.classList.remove('in'); setTimeout(() => w.remove(), 350); }
    // small floating line while downloading outside the settings screen
    const pill = document.createElement('div'); pill.id = 'upd-pill'; pill.className = 'upd-pill';
    document.body.appendChild(pill);
    // M-168: automatic check on every opening, once the opening video is gone
    (function autoCheck() {
        const sp = document.getElementById('splash');
        if (sp && !sp.classList.contains('out') && sp.style.display !== 'none') { setTimeout(autoCheck, 700); return; }
        if (cur) { st.ver = cur; save(); }
        setTimeout(() => { if (st.auto && has('checkUpdate')) check(true); }, 1500);
    })();

    // ---------------- help ----------------
    function drawHelp() {
        const i = li();
        help.querySelector('.set-title').textContent = tx('helpTitle').replace(/^\S+\s/, '');
        help.querySelector('.p-title').textContent = tx('helpTitle').replace(/^\S+\s/, '');
        help.querySelector('.set-sub').textContent = tx('helpSub');
        const list = $('help-list');
        // M-206 (owner): big tiles in a grid that fill the panel (no scrolling); a tile opens its explanation on the whole panel
        list.innerHTML = ''; list.classList.add('help-grid');
        HELP.forEach((h, n) => {
            const b = document.createElement('button'); b.type = 'button'; b.className = 'help-tile'; b.dataset.i = n;
            b.innerHTML = '<span class="ht-ico"></span><span class="ht-t"></span>';
            b.querySelector('.ht-ico').textContent = h[0]; b.querySelector('.ht-t').textContent = h[1][i];
            b.onclick = () => { if (navigator.vibrate) navigator.vibrate(8); helpOpen(n); };
            list.appendChild(b);
        });
        helpHead();
        if (helpCur >= 0) helpOpen(helpCur);
    }
    let helpCur = -1;
    // the panel's ✕ becomes a clear "back to the main screen" button (owner)
    function helpHead() {
        const old = help.querySelector('.p-close'); if (old) old.style.display = 'none';
        let bk = help.querySelector('.help-back');
        if (!bk) {
            bk = document.createElement('button'); bk.type = 'button'; bk.className = 'help-back';
            bk.onclick = () => { if (navigator.vibrate) navigator.vibrate(10); helpShut(); try { closeTiles(); closeSettingsPage(); } catch (e) { } };
            help.querySelector('.panel-head').appendChild(bk);
        }
        bk.textContent = tx('helpBack');
    }
    let helpUnBack = null;
    function helpShut() { if (helpUnBack) { const u = helpUnBack; helpUnBack = null; u(); } helpCur = -1; const d = help.querySelector('.help-detail'); if (d) d.remove(); help.classList.remove('help-in'); }
    function helpOpen(n) {
        const h = HELP[n]; if (!h) return;
        const i = li(); helpCur = n;
        let d = help.querySelector('.help-detail');
        if (!d) { d = document.createElement('div'); d.className = 'help-detail'; $('help-list').parentNode.appendChild(d); }
        d.innerHTML = '<div class="hdt-head"><span class="hdt-ico"></span><span class="hdt-t"></span></div><p class="hdt-p"></p><button type="button" class="hdt-back"></button>';
        d.querySelector('.hdt-ico').textContent = h[0]; d.querySelector('.hdt-t').textContent = h[1][i];
        d.querySelector('.hdt-p').textContent = h[2][i];
        d.querySelector('.hdt-back').textContent = tx('helpTopics');
        d.querySelector('.hdt-back').onclick = () => { if (navigator.vibrate) navigator.vibrate(8); helpShut(); };
        help.classList.add('help-in');
        if (!helpUnBack && window.mtBackPush) helpUnBack = mtBackPush(() => { helpUnBack = null; helpShut(); return false; }); // phone back: to the topics first
        // long text in a big font: shrink it a little until it fits, never below a readable size
        const p = d.querySelector('.hdt-p'); let fs = 1.32; p.style.fontSize = fs + 'rem';
        requestAnimationFrame(() => { while (p.scrollHeight > p.clientHeight + 1 && fs > 1.02) { fs -= 0.04; p.style.fontSize = fs + 'rem'; } });
    }
    new MutationObserver(() => { if (!help.classList.contains('open') && helpCur >= 0) helpShut(); }).observe(help, { attributes: true, attributeFilter: ['class'] });

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
