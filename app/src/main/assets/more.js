// M-080: three settings tiles: 📒 "did I take it?" log, 💾 backup & restore, 📤 share MedTime.
// Updated M-383 2026-10-27 (Claude, project "NOVA", thread "להמשיך את SUPER NOVA אחרי פרסום 108"): 📺 tile: link to the SUPER NOVA TV app
//       (code from the TV), the alarm list goes to the TV, "taken" on the TV is marked here (functions/api/tv.js).
// Updated M-385 2026-10-28 (Claude, project "NOVA", thread "להמשיך את SUPER NOVA אחרי פרסום 147"): the TV list also carries today's
//       answers from the phone (done: "id@day", taken / skipped), so the reminder window on the TV closes by itself.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const has = f => !!(N && typeof N[f] === 'function');
    const grid = document.querySelector('#settings-page .set-grid');
    if (!grid) return;
    const UTD = 'https://medtime.en.uptodown.com/android'; // M-378: Uptodown store page (approved 2026-10-26). M-379: share text also says scanned by 76 antivirus engines
    const LINK = 'https://medtime.pages.dev'; // M-318 official address (was GitHub Pages). M-229: the download page (direct APK links failed for some people)

    const T = {
        logT: ['📒 יומן תרופות', '📒 سجل الأدوية', '📒 Jurnal', '📒 Journal', '📒 Medicine log', '📒 Журнал лекарств'],
        logSub: ['השבוע: {a} מתוך {b} נלקחו', 'هذا الأسبوع: {a} من {b}', 'Săptămâna asta: {a} din {b}', 'Cette semaine : {a} sur {b}', 'This week: {a} of {b} taken', 'На этой неделе: принято {a} из {b}'],
        logEmpty: ['עוד אין רישומים. כשתגיע תזכורת ותלחצו "לקחתי" או "ביטלתי", זה יירשם כאן.', 'لا توجد سجلات بعد. عند وصول تذكير والضغط على "تناولته" أو "ألغيت" سيُسجَّل هنا.', 'Încă nimic. Când apăsați „Am luat” sau „Anulez” la un memento, apare aici.', 'Rien encore. Quand vous appuyez sur « Pris » ou « Annuler » à un rappel, cela s\'inscrit ici.', 'Nothing yet. When a reminder comes and you tap "Taken" or "Skip", it is written here.', 'Пока ничего. Когда придёт напоминание и вы нажмёте «Принято» или «Пропустить», это запишется здесь.'],
        week: ['7 הימים האחרונים', 'آخر 7 أيام', 'Ultimele 7 zile', '7 derniers jours', 'Last 7 days', 'Последние 7 дней'],
        taken: ['לקחתי', 'تناولته', 'Luat', 'Pris', 'Taken', 'Принято'],
        skipped: ['ביטלתי', 'ألغيت', 'Anulat', 'Annulé', 'Skipped', 'Пропущено'],
        missed: ['לא נענה', 'لم يُجب', 'Fără răspuns', 'Sans réponse', 'No answer', 'Нет ответа'],
        today: ['היום', 'اليوم', 'Azi', 'Aujourd\'hui', 'Today', 'Сегодня'],
        yest: ['אתמול', 'أمس', 'Ieri', 'Hier', 'Yesterday', 'Вчера'],
        send: ['📤 שליחת הדוח לרופא או למשפחה', '📤 إرسال التقرير للطبيب أو للعائلة', '📤 Trimite raportul medicului sau familiei', '📤 Envoyer au médecin ou à la famille', '📤 Send the report to a doctor or family', '📤 Отправить отчёт врачу или семье'],
        pdf: ['📄 דוח שבועי מעוצב (PDF) לרופא או למשפחה', '📄 تقرير أسبوعي (PDF) للطبيب أو العائلة', '📄 Raport săptămânal (PDF)', '📄 Rapport hebdomadaire (PDF)', '📄 Weekly report (PDF) for a doctor or family', '📄 Недельный отчёт (PDF) для врача или семьи'],
        pdfT: ['דוח תרופות שבועי', 'تقرير الأدوية الأسبوعي', 'Raport săptămânal de medicamente', 'Rapport hebdomadaire des médicaments', 'Weekly medicine report', 'Недельный отчёт о лекарствах'],
        pdfFor: ['עבור {n}', 'لـ {n}', 'Pentru {n}', 'Pour {n}', 'For {n}', 'Для {n}'],
        pdfAdh: ['נלקחו בזמן', 'نسبة الالتزام', 'Luate', 'Pris', 'Taken on time', 'Принято вовремя'],
        pdfMeds: ['לפי תרופה', 'حسب الدواء', 'Pe medicament', 'Par médicament', 'By medicine', 'По лекарствам'],
        pdfDays: ['יום אחרי יום', 'يومًا بيوم', 'Zi cu zi', 'Jour par jour', 'Day by day', 'По дням'],
        pdfFoot: ['הופק באפליקציית MedTime', 'أُنشئ بتطبيق MedTime', 'Creat cu MedTime', 'Créé avec MedTime', 'Made with the MedTime app', 'Сделано в приложении MedTime'],
        pdfErr: ['לא הצלחתי ליצור את הקובץ. שולח את הדוח כטקסט.', 'تعذر إنشاء الملف. سيُرسل كنص.', 'Fișierul nu a putut fi creat. Se trimite ca text.', 'Fichier impossible à créer. Envoi en texte.', 'Could not make the file. Sending the report as text.', 'Не удалось создать файл. Отправляю отчёт текстом.'],
        famT: ['👨‍👩‍👧 התראה לבן משפחה', '👨‍👩‍👧 تنبيه لأحد أفراد العائلة', '👨‍👩‍👧 Alertă pentru familie', '👨‍👩‍👧 Alerte famille', '👨‍👩‍👧 Family alert', '👨‍👩‍👧 Оповещение семьи'],
        famOn: ['פעיל: {n}', 'مفعّل: {n}', 'Activ: {n}', 'Actif : {n}', 'On: {n}', 'Вкл.: {n}'],
        famOff: ['כבוי', 'متوقف', 'Oprit', 'Désactivé', 'Off', 'Выкл.'],
        famX: ['אם תרופה לא אושרה שעה אחרי התזכורת, נשלחת הודעת SMS אחת מהטלפון הזה לבן המשפחה. בלי עלות מיוחדת (הודעת SMS רגילה).', 'إذا لم يُؤكَّد الدواء بعد ساعة من التذكير، تُرسل رسالة SMS واحدة من هذا الهاتف لفرد العائلة. بلا تكلفة خاصة.', 'Dacă un medicament nu e confirmat la o oră după memento, se trimite un SMS de pe acest telefon. Fără cost special.', 'Si un médicament n\'est pas confirmé une heure après le rappel, un SMS part de ce téléphone. Sans coût particulier.', 'If a medicine is not confirmed an hour after the reminder, one SMS goes from this phone to the family member. No special cost (a normal SMS).', 'Если лекарство не подтверждено через час после напоминания, с этого телефона члену семьи уйдёт одно SMS. Без особой платы (обычное SMS).'],
        famPick: ['📇 בחירה מאנשי הקשר', '📇 اختيار من جهات الاتصال', '📇 Alege din contacte', '📇 Choisir dans les contacts', '📇 Pick from contacts', '📇 Выбрать из контактов'],
        famName: ['שם (למשל: דנה)', 'الاسم', 'Nume', 'Nom', 'Name', 'Имя'],
        famPhone: ['מספר טלפון', 'رقم الهاتف', 'Telefon', 'Téléphone', 'Phone number', 'Номер телефона'],
        watT: ['💧 תזכורת לשתות מים', '💧 تذكير بشرب الماء', '💧 Memento pentru apă', '💧 Rappel pour boire', '💧 Drink water reminder', '💧 Напоминание пить воду'],
        watOn: ['פעיל · כל שעתיים, 9:00 עד 21:00', 'مفعّل · كل ساعتين، 9:00 حتى 21:00', 'Activ · la 2 ore, 9:00-21:00', 'Actif · toutes les 2 h, 9h-21h', 'On · every 2 hours, 9:00-21:00', 'Вкл. · каждые 2 часа, 9:00-21:00'],
        watX: ['מדליקים פעם אחת, והאפליקציה מזכירה לבד לשתות כוס מים כל שעתיים, בין 9:00 בבוקר ל-21:00 בערב. בלילה היא לא מפריעה, וזה לא נשלח למשפחה.', 'شغّله مرة واحدة، وسيذكّرك التطبيق بشرب كوب ماء كل ساعتين، من 9:00 صباحًا حتى 21:00 مساءً. لا إزعاج في الليل، ولا يُرسل شيء للعائلة.', 'Porniți o dată și aplicația vă amintește singură să beți un pahar cu apă la fiecare 2 ore, între 9:00 și 21:00. Noaptea nu deranjează, iar familia nu primește nimic.', 'Activez une fois : l\'application vous rappelle de boire un verre d\'eau toutes les 2 heures, de 9h à 21h. Rien la nuit, et rien n\'est envoyé à la famille.', 'Turn it on once and the app reminds you to drink a glass of water every 2 hours, from 9:00 to 21:00. Nothing at night, and nothing is sent to family.', 'Включите один раз, и приложение само напомнит выпить стакан воды каждые 2 часа, с 9:00 до 21:00. Ночью не беспокоит, семье ничего не отправляется.'],
        // M-383: 📺 SUPER NOVA TV link
        tvT: ['📺 תזכורת גם בטלוויזיה', '📺 التذكير على التلفاز أيضًا', '📺 Memento și pe televizor', '📺 Rappel aussi sur la télé', '📺 Reminder on the TV too', '📺 Напоминание и на телевизоре'],
        tvX: ['באפליקציית SUPER NOVA בטלוויזיה: הגדרות > MedTime. מופיע שם קוד של 6 ספרות. כותבים אותו כאן ולוחצים "חיבור". מאז, בשעת התרופה יופיע חלון גם על המסך של הטלוויזיה, ו"לקחתי" בטלוויזיה נרשם גם כאן.', 'في تطبيق SUPER NOVA على التلفاز: الإعدادات > MedTime. يظهر رمز من 6 أرقام. اكتبه هنا واضغط "ربط". بعدها تظهر نافذة التذكير على شاشة التلفاز أيضًا، و"تناولت" على التلفاز يُسجَّل هنا أيضًا.', 'În aplicația SUPER NOVA de pe televizor: Setări > MedTime. Apare un cod de 6 cifre. Scrieți-l aici și apăsați „Conectare”. De atunci, la ora medicamentului apare o fereastră și pe televizor, iar „Am luat” de pe televizor se notează și aici.', 'Dans l\'appli SUPER NOVA sur la télé : Réglages > MedTime. Un code de 6 chiffres s\'affiche. Écrivez-le ici et appuyez sur « Connecter ». Ensuite, à l\'heure du médicament, une fenêtre apparaît aussi sur la télé, et « Pris » sur la télé est noté ici aussi.', 'In the SUPER NOVA app on the TV: Settings > MedTime. A 6-digit code appears. Type it here and press "Connect". From then on, at pill time a window also shows on the TV screen, and "Taken" on the TV is recorded here too.', 'В приложении SUPER NOVA на телевизоре: Настройки > MedTime. Появится код из 6 цифр. Введите его здесь и нажмите «Подключить». После этого в час приёма окно появится и на экране телевизора, а «Принял» на телевизоре отметится и здесь.'],
        tvCode: ['קוד מהטלוויזיה', 'الرمز من التلفاز', 'Codul de pe televizor', 'Code de la télé', 'Code from the TV', 'Код с телевизора'],
        tvGo: ['חיבור', 'ربط', 'Conectare', 'Connecter', 'Connect', 'Подключить'],
        tvOff: ['ניתוק מהטלוויזיה', 'فصل التلفاز', 'Deconectare de la televizor', 'Déconnecter la télé', 'Disconnect the TV', 'Отключить телевизор'],
        tvOn: ['מחובר לטלוויזיה ✓', 'متصل بالتلفاز ✓', 'Conectat la televizor ✓', 'Connecté à la télé ✓', 'Connected to the TV ✓', 'Подключено к телевизору ✓'],
        tvBad: ['הקוד לא נמצא. בדקו את 6 הספרות בטלוויזיה ונסו שוב.', 'الرمز غير موجود. تحقق من الأرقام الستة على التلفاز وحاول مرة أخرى.', 'Codul nu a fost găsit. Verificați cele 6 cifre de pe televizor și încercați din nou.', 'Code introuvable. Vérifiez les 6 chiffres sur la télé et réessayez.', 'Code not found. Check the 6 digits on the TV and try again.', 'Код не найден. Проверьте 6 цифр на телевизоре и попробуйте снова.'],
        tvNet: ['אין חיבור לאינטרנט. נסו שוב בעוד רגע.', 'لا يوجد اتصال بالإنترنت. حاول بعد قليل.', 'Nu există internet. Încercați din nou imediat.', 'Pas d\'internet. Réessayez dans un instant.', 'No internet. Try again in a moment.', 'Нет интернета. Попробуйте чуть позже.'],
        watSw: ['תזכורת אוטומטית לשתות', 'تذكير تلقائي بالشرب', 'Memento automat', 'Rappel automatique', 'Automatic reminder', 'Автоматическое напоминание'],
        famSw: ['לשלוח התראה כשתרופה לא נלקחה', 'إرسال تنبيه عند عدم تناول الدواء', 'Trimite alertă', 'Envoyer l\'alerte', 'Send the alert when a medicine is missed', 'Отправлять оповещение, когда лекарство пропущено'],
        famTest: ['✉️ שליחת הודעת ניסיון', '✉️ إرسال رسالة تجربة', '✉️ Trimite un test', '✉️ Envoyer un test', '✉️ Send a test message', '✉️ Отправить тестовое сообщение'],
        famTestMsg: ['MedTime: זו הודעת ניסיון. אם תרופה לא תאושר שעה אחרי התזכורת, תקבל/י כאן הודעה.', 'MedTime: هذه رسالة تجربة. إن لم يُؤكَّد دواء بعد ساعة ستصلك رسالة هنا.', 'MedTime: mesaj de test. Dacă un medicament nu e confirmat într-o oră, primiți un mesaj aici.', 'MedTime : message de test. Si un médicament n\'est pas confirmé dans l\'heure, vous recevrez un message ici.', 'MedTime: this is a test. If a medicine is not confirmed within an hour of its reminder, you will get a message here.', 'MedTime: это тест. Если лекарство не будет подтверждено в течение часа после напоминания, вы получите здесь сообщение.'],
        famSent: ['✅ ההודעה נשלחה', '✅ أُرسلت الرسالة', '✅ Trimis', '✅ Envoyé', '✅ Message sent', '✅ Сообщение отправлено'],
        famNoPerm: ['צריך לאשר ל-MedTime לשלוח SMS. לחצו "אישור" בחלון שייפתח.', 'يجب السماح لـ MedTime بإرسال SMS. اضغط "سماح".', 'Permiteți MedTime să trimită SMS.', 'Autorisez MedTime à envoyer des SMS.', 'MedTime needs permission to send SMS. Tap "Allow" in the window that opens.', 'MedTime нужно разрешение на отправку SMS. Нажмите «Разрешить» в открывшемся окне.'],
        famNoPhone: ['חסר מספר טלפון', 'رقم الهاتف ناقص', 'Lipsește numărul', 'Numéro manquant', 'Phone number missing', 'Не указан номер телефона'],
        famFail: ['ההודעה לא נשלחה. בדקו את המספר ושיש קליטה.', 'لم تُرسل الرسالة. تحقق من الرقم والتغطية.', 'Nu s-a trimis. Verificați numărul și semnalul.', 'Non envoyé. Vérifiez le numéro et le réseau.', 'Not sent. Check the number and the signal.', 'Не отправлено. Проверьте номер и сигнал сети.'],
        repHead: ['דוח לקיחת תרופות מ-MedTime (30 יום אחרונים)', 'تقرير تناول الأدوية من MedTime (آخر 30 يومًا)', 'Raport MedTime (ultimele 30 de zile)', 'Rapport MedTime (30 derniers jours)', 'MedTime medicine report (last 30 days)', 'Отчёт MedTime о лекарствах (последние 30 дней)'],
        stT: ['📦 מלאי תרופות', '📦 مخزون الأدوية', '📦 Stoc medicamente', '📦 Stock de médicaments', '📦 Medicine stock', '📦 Запас лекарств'],
        stSub: ['עומד להיגמר: {n}', 'على وشك النفاد: {n}', 'Pe terminate: {n}', 'Bientôt fini : {n}', 'Running low: {n}', 'Заканчивается: {n}'],
        stSubOk: ['ספירה פעילה: {n}', 'العدّ مفعّل: {n}', 'Numărare activă: {n}', 'Comptage actif : {n}', 'Counting: {n}', 'Подсчёт: {n}'],
        stSubOff: ['כמה כדורים נשארו בבית', 'كم حبة تبقّت في البيت', 'Câte pastile mai sunt acasă', 'Combien il en reste à la maison', 'How many are left at home', 'Сколько осталось дома'],
        stX: ['כתבו כמה יש מכל תרופה. כל לחיצה על "לקחתי" מורידה מהספירה, וכשנשאר מעט מקבלים תזכורת לקנות עוד.', 'اكتب كم لديك من كل دواء. كل ضغطة على "تناولته" تُنقص العدد، وعندما يتبقى القليل يصلك تذكير بالشراء.', 'Scrieți câte aveți din fiecare. Fiecare „Am luat” scade numărul, iar când rămân puține primiți un memento să cumpărați.', 'Indiquez combien il vous en reste. Chaque « Pris » diminue le compte et, quand il en reste peu, un rappel vous invite à en racheter.', 'Write how many you have of each medicine. Every "Taken" lowers the count, and when few are left you get a reminder to buy more.', 'Укажите, сколько у вас есть каждого лекарства. Каждое «Принято» уменьшает число, а когда остаётся мало, вы получите напоминание купить ещё.'],
        stNone: ['עוד אין תזכורות. אחרי שתוסיפו תזכורת, התרופות יופיעו כאן.', 'لا توجد تذكيرات بعد. بعد إضافة تذكير ستظهر الأدوية هنا.', 'Încă nu sunt mementouri. După ce adăugați unul, medicamentele apar aici.', 'Pas encore de rappels. Après en avoir ajouté un, les médicaments apparaîtront ici.', 'No reminders yet. After you add one, its medicines show up here.', 'Пока нет напоминаний. После добавления их лекарства появятся здесь.'],
        stLeft: ['נשארו', 'تبقّى', 'Rămase', 'Reste', 'Left', 'Осталось'],
        stStart: ['➕ להתחיל לספור', '➕ ابدأ العدّ', '➕ Începe numărarea', '➕ Commencer à compter', '➕ Start counting', '➕ Начать подсчёт'],
        stPack: ['🛒 קניתי חבילה (+{n})', '🛒 اشتريت علبة (+{n})', '🛒 Am cumpărat o cutie (+{n})', '🛒 J\'ai acheté une boîte (+{n})', '🛒 Bought a pack (+{n})', '🛒 Купил упаковку (+{n})'],
        stLow: ['🔔 תזכורת כשנשארים {n}', '🔔 تذكير عند بقاء {n}', '🔔 Memento la {n}', '🔔 Rappel à {n}', '🔔 Remind me at {n}', '🔔 Напомнить при {n}'],
        stStop: ['⏹️ הפסק ספירה', '⏹️ أوقف العدّ', '⏹️ Oprește numărarea', '⏹️ Arrêter de compter', '⏹️ Stop counting', '⏹️ Остановить подсчёт'],
        stLowNow: ['⚠️ כדאי לקנות עוד', '⚠️ يُستحسن الشراء', '⚠️ Cumpărați mai mult', '⚠️ Pensez à racheter', '⚠️ Time to buy more', '⚠️ Пора купить ещё'],
        wgT: ['📱 ווידג\'ט למסך הבית', '📱 أداة للشاشة الرئيسية', '📱 Widget pe ecranul principal', '📱 Widget sur l\'écran d\'accueil', '📱 Home-screen widget', '📱 Виджет на главном экране'],
        wgOn: ['מופיע במסך הבית ✅', 'ظاهر في الشاشة الرئيسية ✅', 'Pe ecranul principal ✅', 'Sur l\'écran d\'accueil ✅', 'On the home screen ✅', 'На главном экране ✅'],
        wgOff: ['התרופה הבאה במסך הבית', 'الدواء التالي على الشاشة', 'Următorul medicament pe ecran', 'Prochain médicament à l\'écran', 'Next medicine on the home screen', 'Следующее лекарство на главном экране'],
        wgX: ['ריבוע קטן במסך הבית של הטלפון שמראה מתי התרופה הבאה ואיזו, ומה עומד להיגמר. נגיעה בו פותחת את MedTime.', 'مربع صغير في الشاشة الرئيسية يعرض موعد الدواء التالي واسمه وما سينفد قريبًا. لمسه يفتح MedTime.', 'Un pătrat mic pe ecranul principal arată când și ce medicament urmează și ce se termină. Atingerea lui deschide MedTime.', 'Un petit carré sur l\'écran d\'accueil montre quand et quel est le prochain médicament, et ce qui va manquer. Le toucher ouvre MedTime.', 'A small square on the phone\'s home screen shows when the next medicine is and which one, and what is running low. Tapping it opens MedTime.', 'Небольшой квадрат на главном экране телефона показывает, когда и какое следующее лекарство и что заканчивается. Нажатие открывает MedTime.'],
        wgGo: ['📱 הוספה למסך הבית', '📱 إضافة إلى الشاشة الرئيسية', '📱 Adaugă pe ecranul principal', '📱 Ajouter à l\'écran d\'accueil', '📱 Add to the home screen', '📱 Добавить на главный экран'],
        wgDel: ['🗑️ הסרה ממסך הבית', '🗑️ إزالة من الشاشة الرئيسية', '🗑️ Elimină de pe ecran', '🗑️ Retirer de l\'écran d\'accueil', '🗑️ Remove from the home screen', '🗑️ Убрать с главного экрана'],
        wgDone: ['הווידג\'ט הוסר ממסך הבית ✅', 'تمت إزالة الأداة ✅', 'Widgetul a fost eliminat ✅', 'Widget retiré ✅', 'The widget was removed ✅', 'Виджет убран ✅'],
        wgHow: ['אם לא נפתח חלון: לחיצה ארוכה על מקום ריק במסך הבית ← ווידג\'טים ← MedTime, וגוררים למסך.', 'إن لم تظهر نافذة: ضغطة طويلة على مكان فارغ ← الأدوات ← MedTime واسحبها.', 'Dacă nu apare nimic: apăsare lungă pe un loc gol ← Widgeturi ← MedTime și trageți-l.', 'Sinon : appui long sur un espace vide ← Widgets ← MedTime, puis faites-le glisser.', 'If no window opens: long-press an empty spot on the home screen → Widgets → MedTime, and drag it there.', 'Если окно не открылось: нажмите и удерживайте пустое место на главном экране → Виджеты → MedTime и перетащите его туда.'],
        autoNo: ['⏳ הגיבוי האוטומטי עוד לא נשמר', '⏳ لم يُحفظ النسخ التلقائي بعد', '⏳ Copia automată nu e salvată încă', '⏳ Sauvegarde auto pas encore faite', '⏳ Auto backup not saved yet', '⏳ Автокопия ещё не сохранена'],
        autoErr: ['⚠️ הגיבוי האוטומטי נכשל: {e}', '⚠️ فشل النسخ التلقائي: {e}', '⚠️ Copia automată a eșuat: {e}', '⚠️ Échec de la sauvegarde auto : {e}', '⚠️ Auto backup failed: {e}', '⚠️ Ошибка автокопии: {e}'],
        autoOn: ['גיבוי אוטומטי: {d}', 'نسخ تلقائي: {d}', 'Copie automată: {d}', 'Sauvegarde auto : {d}', 'Auto backup: {d}', 'Автокопия: {d}'],
        autoX: ['✅ מעכשיו הגיבוי נשמר לבד בכל שינוי, בתיקיית "הורדות" בטלפון (MedTime-auto-backup.json). הוא נשאר גם אם מוחקים את האפליקציה. כדי לשחזר: "שחזור מקובץ גיבוי" ובוחרים אותו.', '✅ من الآن تُحفظ النسخة تلقائيًا عند كل تغيير في مجلد "التنزيلات" (MedTime-auto-backup.json)، وتبقى حتى لو حُذف التطبيق. للاستعادة: "استعادة من ملف" واختره.', '✅ De acum copia se salvează singură la fiecare schimbare, în „Descărcări” (MedTime-auto-backup.json), și rămâne chiar dacă ștergeți aplicația. Restaurare: „Restaurează din fișier”.', '✅ Désormais la sauvegarde se fait seule à chaque changement, dans « Téléchargements » (MedTime-auto-backup.json), et reste même si l\'appli est supprimée. Pour restaurer : « Restaurer depuis un fichier ».', '✅ From now on the backup saves itself on every change, in the phone\'s Downloads folder (MedTime-auto-backup.json), and stays even if the app is removed. To restore: "Restore from a backup file" and pick it.', '✅ Теперь копия сохраняется сама при каждом изменении в папке «Загрузки» телефона (MedTime-auto-backup.json) и остаётся, даже если приложение удалено. Для восстановления: «Восстановить из файла копии» и выберите его.'],
        bakT: ['💾 גיבוי ושחזור', '💾 نسخ احتياطي واستعادة', '💾 Copie de rezervă', '💾 Sauvegarde', '💾 Backup & restore', '💾 Резервная копия и восстановление'],
        bakSub: ['גיבוי אחרון: {d}', 'آخر نسخة: {d}', 'Ultima copie: {d}', 'Dernière : {d}', 'Last backup: {d}', 'Последняя копия: {d}'],
        never: ['עוד לא גובה', 'لم يُنسخ بعد', 'niciodată', 'jamais', 'never', 'никогда'],
        bakX: ['התזכורות, התורים, היומן וההגדרות נשמרים רק בטלפון הזה. שמרו עותק ב-Google Drive, במייל או בוואטסאפ לעצמכם. בטלפון חדש לוחצים "שחזור" ובוחרים את הקובץ.', 'التذكيرات والمواعيد والسجل والإعدادات محفوظة في هذا الهاتف فقط. احفظ نسخة في Google Drive أو البريد أو واتساب. في هاتف جديد اضغط "استعادة" واختر الملف.', 'Mementourile, programările, jurnalul și setările sunt doar în acest telefon. Salvați o copie în Google Drive, e-mail sau WhatsApp. Pe un telefon nou apăsați „Restaurează” și alegeți fișierul.', 'Rappels, rendez-vous, journal et réglages ne sont que dans ce téléphone. Gardez une copie sur Google Drive, par e-mail ou WhatsApp. Sur un nouveau téléphone, « Restaurer » et choisissez le fichier.', 'Reminders, appointments, the log and settings live only on this phone. Keep a copy in Google Drive, mail or WhatsApp. On a new phone tap "Restore" and pick the file.', 'Напоминания, записи, журнал и настройки хранятся только на этом телефоне. Сохраните копию в Google Диске, почте или WhatsApp. На новом телефоне нажмите «Восстановить» и выберите файл.'],
        bakGo: ['💾 שמירת גיבוי עכשיו', '💾 احفظ نسخة الآن', '💾 Salvează copia acum', '💾 Sauvegarder maintenant', '💾 Save a backup now', '💾 Сохранить копию сейчас'],
        resGo: ['📂 שחזור מקובץ גיבוי', '📂 استعادة من ملف', '📂 Restaurează din fișier', '📂 Restaurer depuis un fichier', '📂 Restore from a backup file', '📂 Восстановить из файла копии'],
        resQ: ['לשחזר את הגיבוי מ-{d}? הוא יחליף את התזכורות, התורים וההגדרות שיש עכשיו בטלפון.', 'استعادة النسخة من {d}؟ ستحل محل التذكيرات والمواعيد والإعدادات الحالية.', 'Restaurați copia din {d}? Înlocuiește mementourile, programările și setările actuale.', 'Restaurer la sauvegarde du {d} ? Elle remplace les rappels, rendez-vous et réglages actuels.', 'Restore the backup from {d}? It replaces the reminders, appointments and settings now on the phone.', 'Восстановить копию от {d}? Она заменит напоминания, записи и настройки, которые сейчас на телефоне.'],
        resOk: ['שחזור', 'استعادة', 'Restaurează', 'Restaurer', 'Restore', 'Восстановить'],
        resBad: ['זה לא קובץ גיבוי של MedTime. בחרו את הקובץ ששמרתם מ"שמירת גיבוי".', 'هذا ليس ملف نسخة MedTime. اختر الملف الذي حفظته.', 'Nu e o copie MedTime. Alegeți fișierul salvat.', 'Ce n\'est pas une sauvegarde MedTime. Choisissez le fichier enregistré.', 'This is not a MedTime backup. Pick the file you saved with "Save a backup".', 'Это не копия MedTime. Выберите файл, сохранённый через «Сохранить копию».'],
        resDone: ['✅ השחזור הצליח! האפליקציה נטענת מחדש.', '✅ تمت الاستعادة! يُعاد التحميل.', '✅ Restaurat! Se reîncarcă.', '✅ Restauré ! Rechargement.', '✅ Restored! Reloading the app.', '✅ Восстановлено! Перезапускаю приложение.'],
        shT: ['📤 שתפו את MedTime', '📤 شارك MedTime', '📤 Distribuie MedTime', '📤 Partager MedTime', '📤 Share MedTime', '📤 Поделиться MedTime'],
        shSub: ['שלחו לחברים ולמשפחה', 'أرسل للأصدقاء والعائلة', 'Trimiteți prietenilor', 'Envoyer à vos proches', 'Send to friends and family', 'Отправьте друзьям и семье'],
        shX: ['ההודעה הזאת תישלח, עם קישור להורדה:', 'سيتم إرسال هذه الرسالة مع رابط التنزيل:', 'Se trimite acest mesaj cu link de descărcare:', 'Ce message sera envoyé avec le lien :', 'This message is sent, with a download link:', 'Будет отправлено это сообщение со ссылкой на загрузку:'],
        shGo: ['📤 שיתוף בוואטסאפ או בכל דרך', '📤 مشاركة عبر واتساب أو غيره', '📤 Distribuie pe WhatsApp sau altfel', '📤 Partager par WhatsApp ou autre', '📤 Share by WhatsApp or any way', '📤 Поделиться через WhatsApp или иначе'],
        // M-378 (Roni 2026-10-26): reassurance about the phone's install questions comes first, plus the Uptodown store link
        shMsg: ['היי 😊 אני משתמש ב-MedTime, אפליקציה שמזכירה לקחת תרופות ולהגיע לתורים לרופא. מומלץ!\n\n🛡️ חשוב לדעת: בהתקנה הטלפון ישאל אם מותר, ואולי יציג אזהרה. זה רגיל לגמרי לאפליקציה שלא מגיעה מ-Google Play. מאשרים וממשיכים. האפליקציה בטוחה, בלי פרסומות ובלי הרשמה, ולא אוספת שום מידע.\n✅ נסרקה ב-76 תוכנות אנטי-וירוס: נקייה מווירוסים, רוגלות ותוכנות זדוניות. נבדקה ואושרה בחנות Uptodown.\n\n⬇️ להתקנה (הדף מסביר על מה ללחוץ):\n',
            'مرحبًا 😊 أستخدم MedTime، تطبيق يذكّر بتناول الأدوية ومواعيد الطبيب. أنصح به!\n\n🛡️ مهم: أثناء التثبيت سيسأل الهاتف إن كان مسموحًا، وقد يعرض تحذيرًا. هذا طبيعي تمامًا لتطبيق لا يأتي من Google Play. وافق وتابع. التطبيق آمن، بلا إعلانات وبلا تسجيل، ولا يجمع أي معلومات.\n✅ فُحص بـ76 برنامج مكافحة فيروسات: خالٍ من الفيروسات وبرامج التجسس والبرامج الضارة. تمت مراجعته واعتماده في متجر Uptodown.\n\n⬇️ للتثبيت (الصفحة تشرح على ماذا تضغط):\n',
            'Salut 😊 Folosesc MedTime, o aplicație care amintește de medicamente și programări la medic. O recomand!\n\n🛡️ Bine de știut: la instalare telefonul va întreba dacă are voie și poate arăta un avertisment. E complet normal pentru o aplicație care nu vine din Google Play. Aprobi și continui. Aplicația e sigură, fără reclame, fără înregistrare și nu colectează date.\n✅ Scanată de 76 de antivirusuri: fără viruși, spyware sau malware. Verificată și aprobată în magazinul Uptodown.\n\n⬇️ Pentru instalare (pagina explică pe ce să apeși):\n',
            'Salut 😊 J\'utilise MedTime, une appli qui rappelle les médicaments et les rendez-vous chez le médecin. Je recommande !\n\n🛡️ Bon à savoir : à l\'installation, le téléphone demandera la permission et affichera peut-être un avertissement. C\'est tout à fait normal pour une appli qui ne vient pas de Google Play. Autorisez et continuez. L\'appli est sûre, sans pub, sans inscription et ne collecte aucune donnée.\n✅ Analysée par 76 antivirus : sans virus, logiciel espion ni malware. Vérifiée et approuvée sur le store Uptodown.\n\n⬇️ Pour l\'installer (la page explique où appuyer) :\n',
            'Hi 😊 I use MedTime, an app that reminds you to take medicine and go to doctor appointments. Recommended!\n\n🛡️ Good to know: while installing, the phone will ask for permission and may show a warning. That is completely normal for an app that does not come from Google Play. Allow it and continue. The app is safe, with no ads, no sign-up, and it collects no data.\n✅ Scanned by 76 antivirus engines: free of viruses, spyware and malware. Reviewed and approved on the Uptodown store.\n\n⬇️ To install (the page shows what to tap):\n',
            'Привет 😊 Я пользуюсь MedTime — приложением, которое напоминает принимать лекарства и ходить на приёмы к врачу. Рекомендую!\n\n🛡️ Важно: при установке телефон спросит разрешение и, возможно, покажет предупреждение. Это совершенно нормально для приложения не из Google Play. Разрешите и продолжайте. Приложение безопасное, без рекламы и регистрации, и не собирает никаких данных.\n✅ Проверено 76 антивирусами: без вирусов, шпионских и вредоносных программ. Проверено и одобрено в магазине Uptodown.\n\n⬇️ Для установки (страница подскажет, что нажать):\n'],
        shUtd: ['\n\n🏪 או מחנות Uptodown:\n', '\n\n🏪 أو من متجر Uptodown:\n', '\n\n🏪 Sau din magazinul Uptodown:\n', '\n\n🏪 Ou depuis le store Uptodown :\n', '\n\n🏪 Or from the Uptodown store:\n', '\n\n🏪 Или из магазина Uptodown:\n']
    };
    const tx = k => (T[k] || [k])[li()];
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
    const strip = s => s.replace(/^\S+\s/, '');
    const vib = () => { if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { } };

    const css = document.createElement('style');
    css.textContent = `
    .mo-btn{display:block;width:100%;border:0;border-radius:16px;padding:14px 12px;margin:10px 0 0;font-size:1.08rem;font-weight:700;color:#fff;
      background:linear-gradient(135deg,#0ea5e9,#6366f1);box-shadow:inset 0 2px 1px rgba(255,255,255,.35),0 6px 16px rgba(0,0,0,.45)}
    .mo-btn.alt{background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.25)}
    .mo-x{font-size:.98rem;line-height:1.5;opacity:.9;margin:4px 0 6px}
    /* M-276 (owner: the add button was a plain blue square): a small picture of the widget, a glossy button, and a button to remove it */
    #tile-widget .wg-prev{display:flex;flex-direction:column;gap:3px;width:150px;margin:6px auto 10px;padding:10px 14px;border-radius:20px;color:#fff;font-weight:800;text-align:start;
      background:linear-gradient(160deg,#4338ca,#1e1b4b);border:2px solid rgba(196,181,253,.8);box-shadow:0 8px 18px rgba(0,0,0,.5),0 0 18px rgba(139,92,246,.5);transform:rotate(-3deg)}
    #tile-widget .wg-prev b{font-size:1rem}#tile-widget .wg-prev span{font-size:.95rem;opacity:.9}
    html body #tile-widget #wg-go{border-radius:999px!important;min-height:56px;border:2px solid rgba(255,255,255,.9)!important;background:linear-gradient(180deg,#c4b5fd 0%,#8b5cf6 25%,#6d28d9 65%,#3b0764 100%)!important;
      text-shadow:0 1px 0 #4c1d95,0 2px 3px rgba(0,0,0,.6);box-shadow:inset 0 3px 4px rgba(255,255,255,.6),inset 0 -5px 8px rgba(46,16,101,.55),0 5px 0 #2e1065,0 10px 16px rgba(0,0,0,.45)!important}
    html body #tile-widget #wg-del{border-radius:999px!important;min-height:52px;border:2px solid rgba(254,202,202,.8)!important;background:linear-gradient(180deg,#f87171,#991b1b)!important;color:#fff!important;
      box-shadow:inset 0 3px 4px rgba(255,255,255,.45),0 5px 0 #450a0a,0 10px 16px rgba(0,0,0,.45)!important}
    .mo-msg{white-space:pre-wrap;font-size:.92rem;line-height:1.45;background:rgba(255,255,255,.08);border-radius:14px;padding:10px 12px;margin:6px 0}
    .lg-sum{display:flex;gap:8px;margin:6px 0 10px}
    .lg-sum div{flex:1;text-align:center;border-radius:14px;padding:8px 4px;background:rgba(255,255,255,.07);font-size:.85rem}
    .lg-sum b{display:block;font-size:1.5rem}
    .lg-day{margin:12px 0 4px;font-weight:800;color:#67e8f9;font-size:1rem}
    .lg-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.05);margin:4px 0;font-size:1rem}
    .lg-row .tm{font-weight:800;min-width:3.2em;direction:ltr}
    .lg-row .it{flex:1;line-height:1.3}
    .lg-row .st{font-weight:700;white-space:nowrap}
    .lg-row.taken .st{color:#4ade80}.lg-row.skipped .st{color:#fbbf24}.lg-row.missed .st{color:#f87171}
    .lg-list{max-height:46vh;overflow:auto}
    #bk-x{white-space:pre-line}`;
    document.head.appendChild(css);

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
    const heads = (el, k, sub) => {
        el.querySelector('.set-title').textContent = strip(tx(k));
        el.querySelector('.p-title').textContent = strip(tx(k));
        el.querySelector('.set-sub').textContent = sub;
    };

    // ---------------- 📒 log ----------------
    const logT = tile('tile-log', '📒', 'linear-gradient(135deg,#34d399,#0f766e)',
        '<div class="lg-sum" id="lg-sum"></div><div class="lg-list" id="lg-list"></div><button type="button" class="mo-btn" id="lg-pdf"></button><button type="button" class="mo-btn alt" id="lg-send"></button>');
    const readLog = () => { try { return has('getLog') ? JSON.parse(N.getLog()) || [] : []; } catch (e) { return []; } };
    const dayKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    function dayName(k) {
        const now = new Date(), y = new Date(Date.now() - 864e5);
        if (k === dayKey(now)) return tx('today');
        if (k === dayKey(y)) return tx('yest');
        const p = k.split('-'), d = new Date(+p[0], p[1] - 1, +p[2]);
        try { return d.toLocaleDateString(L5[li()], { weekday: 'long', day: 'numeric', month: 'numeric' }); } catch (e) { return k; }
    }
    const ICON = { taken: '✅', skipped: '✖️', missed: '❌' };
    function drawLog() {
        const log = readLog();
        const since = dayKey(new Date(Date.now() - 6 * 864e5));
        const wk = log.filter(e => e.d >= since);
        const c = s => wk.filter(e => e.s === s).length;
        heads(logT, 'logT', wk.length ? fill(tx('logSub'), { a: c('taken'), b: wk.length }) : strip(tx('week')));
        const sum = document.getElementById('lg-sum'), list = document.getElementById('lg-list'), send = document.getElementById('lg-send');
        send.textContent = tx('send');
        send.style.display = log.length && has('shareText') ? '' : 'none';
        const pdf = document.getElementById('lg-pdf'); // M-099
        pdf.textContent = tx('pdf');
        pdf.style.display = log.length && has('shareReportPdf') ? '' : 'none';
        if (!log.length) { sum.innerHTML = ''; list.innerHTML = '<div class="mo-x"></div>'; list.firstChild.textContent = tx('logEmpty'); return; }
        sum.innerHTML = '';
        [['taken', '✅'], ['skipped', '✖️'], ['missed', '❌']].forEach(([s, i]) => {
            const d = document.createElement('div'); d.innerHTML = '<b></b><span></span>';
            d.querySelector('b').textContent = i + ' ' + c(s); d.querySelector('span').textContent = tx(s); sum.appendChild(d);
        });
        list.innerHTML = '';
        let last = '';
        log.slice().reverse().filter(e => e.d >= dayKey(new Date(Date.now() - 30 * 864e5))).forEach(e => {
            if (e.d !== last) { last = e.d; const h = document.createElement('div'); h.className = 'lg-day'; h.textContent = dayName(e.d); list.appendChild(h); }
            const r = document.createElement('div'); r.className = 'lg-row ' + e.s;
            r.innerHTML = '<span class="tm"></span><span class="it"></span><span class="st"></span>';
            r.querySelector('.tm').textContent = e.t;
            r.querySelector('.it').textContent = (e.items || []).join(', ');
            r.querySelector('.st').textContent = (ICON[e.s] || '') + ' ' + tx(e.s);
            list.appendChild(r);
        });
    }
    document.getElementById('lg-send').onclick = () => {
        vib();
        const log = readLog().filter(e => e.d >= dayKey(new Date(Date.now() - 30 * 864e5)));
        let out = tx('repHead') + '\n', last = '';
        log.forEach(e => {
            if (e.d !== last) { last = e.d; out += '\n' + e.d + '\n'; }
            out += (ICON[e.s] || '') + ' ' + e.t + '  ' + (e.items || []).join(', ') + ' (' + tx(e.s) + ')\n';
        });
        N.shareText(out);
    };
    // M-099: weekly report as a designed PDF
    const COLOR = { taken: '#16a34a', skipped: '#d97706', missed: '#dc2626' };
    document.getElementById('lg-pdf').onclick = () => {
        vib();
        const since = dayKey(new Date(Date.now() - 6 * 864e5));
        const wk = readLog().filter(e => e.d >= since);
        const c = st => wk.filter(e => e.s === st).length;
        const pct = wk.length ? Math.round(c('taken') * 100 / wk.length) : 0;
        const per = {};
        wk.forEach(e => (e.items || []).forEach(it => { const p = per[it] || (per[it] = [0, 0]); p[1]++; if (e.s === 'taken') p[0]++; }));
        const meds = Object.keys(per).sort().map(k => [k, per[k][0] + '/' + per[k][1], Math.round(per[k][0] * 100 / per[k][1])]);
        const byDay = {};
        wk.forEach(e => (byDay[e.d] = byDay[e.d] || []).push(e));
        const days = Object.keys(byDay).sort().reverse().map(d => ({
            h: dayName(d) + '  ·  ' + d.split('-').reverse().join('.'),
            rows: byDay[d].sort((a, b) => a.t < b.t ? -1 : 1).map(e => [e.t, (e.items || []).join(', '), (ICON[e.s] || '') + ' ' + tx(e.s), COLOR[e.s] || '#0f172a'])
        }));
        let who = ''; try { who = localStorage.getItem('medtime_name') || ''; } catch (e) { }
        const fmt = k => k.split('-').reverse().join('.');
        const range = fmt(since) + ' – ' + fmt(dayKey(new Date()));
        const model = {
            rtl: li() <= 1, title: tx('pdfT'), sub: (who ? fill(tx('pdfFor'), { n: who }) + '   ·   ' : '') + range,
            stats: [[tx('pdfAdh'), pct + '%', pct >= 90 ? '#16a34a' : pct >= 70 ? '#d97706' : '#dc2626'],
                [tx('taken'), String(c('taken')), '#16a34a'], [tx('skipped'), String(c('skipped')), '#d97706'], [tx('missed'), String(c('missed')), '#dc2626']],
            medsHead: tx('pdfMeds'), meds: meds, daysHead: tx('pdfDays'), days: days, foot: tx('pdfFoot'),
            vitalsHead: window.mtVitalsPdf && mtVitalsPdf(since) ? mtVitalsPdf(since).head : '', vitals: window.mtVitalsPdf && mtVitalsPdf(since) ? mtVitalsPdf(since).days : [] // M-149
        };
        let ok = false;
        try { ok = N.shareReportPdf('MedTime-report-' + dayKey(new Date()) + '.pdf', JSON.stringify(model)); } catch (e) { }
        if (!ok) { if (window.mtAlert) mtAlert(tx('pdfErr')); document.getElementById('lg-send').click(); }
    };
    logT.querySelector('.set-tile-head').addEventListener('click', drawLog);

    // ---------------- 👨‍👩‍👧 family alert (M-100) ----------------
    const fam = tile('tile-family', '👨‍👩‍👧', 'linear-gradient(135deg,#f472b6,#be185d)',
        '<div class="mo-x" id="fm-x"></div><button type="button" class="mo-btn alt" id="fm-pick"></button>' +
        '<input class="fm-in" id="fm-name" autocomplete="off"><input class="fm-in" id="fm-phone" type="tel" dir="ltr" autocomplete="off">' +
        '<div class="vb-nag fm-row"><span id="fm-swl"></span><button type="button" class="vb-sw" id="fm-sw"></button></div>' +
        '<button type="button" class="mo-btn" id="fm-test"></button>');
    const famCss = document.createElement('style');
    famCss.textContent = `.fm-in{display:block;width:100%;box-sizing:border-box;margin:10px 0 0;padding:13px 14px;border-radius:14px;border:1.5px solid rgba(255,255,255,.25);
      background:rgba(255,255,255,.08);color:#fff;font-size:1.08rem}
    .fm-in::placeholder{color:rgba(255,255,255,.55)}
    .fm-row{margin-top:12px}`;
    document.head.appendChild(famCss);
    const famGet = () => { try { return JSON.parse(N.getFamily()); } catch (e) { return { name: '', phone: '', on: false, perm: false }; } };
    const famSave = on => { try { N.setFamily(document.getElementById('fm-name').value, document.getElementById('fm-phone').value, on); } catch (e) { } };
    function drawFam() {
        if (!has('getFamily')) { fam.style.display = 'none'; return; }
        const f = famGet();
        heads(fam, 'famT', f.on && f.phone ? fill(tx('famOn'), { n: f.name || f.phone }) : tx('famOff'));
        document.getElementById('fm-x').textContent = tx('famX');
        document.getElementById('fm-pick').textContent = tx('famPick');
        const nm = document.getElementById('fm-name'), ph = document.getElementById('fm-phone');
        nm.placeholder = tx('famName'); ph.placeholder = tx('famPhone');
        if (document.activeElement !== nm) nm.value = f.name || '';
        if (document.activeElement !== ph) ph.value = f.phone || '';
        document.getElementById('fm-swl').textContent = tx('famSw');
        document.getElementById('fm-sw').classList.toggle('on', !!(f.on && f.perm));
        document.getElementById('fm-test').textContent = tx('famTest');
    }
    const famInput = () => famSave(document.getElementById('fm-sw').classList.contains('on'));
    document.getElementById('fm-name').addEventListener('change', () => { famInput(); drawFam(); });
    document.getElementById('fm-phone').addEventListener('change', () => { famInput(); drawFam(); });
    document.getElementById('fm-pick').onclick = () => { vib(); if (has('pickContact')) N.pickContact(); };
    window.mtContact = function (name, phone) {
        document.getElementById('fm-name').value = name || '';
        document.getElementById('fm-phone').value = (phone || '').replace(/[^\d+]/g, '');
        famSave(true);
        if (!famGet().perm) N.requestSms();
        drawFam();
    };
    document.getElementById('fm-sw').onclick = () => {
        vib();
        const turnOn = !document.getElementById('fm-sw').classList.contains('on');
        if (turnOn && !document.getElementById('fm-phone').value.trim()) { if (window.mtAlert) mtAlert(tx('famNoPhone')); return; }
        famSave(turnOn);
        if (turnOn && !famGet().perm) { if (window.mtAlert) mtAlert(tx('famNoPerm')); N.requestSms(); }
        drawFam();
    };
    // ---------------- 💧 M-317: automatic water reminder, one switch ----------------
    const wat = tile('tile-water', '💧', 'linear-gradient(135deg,#38bdf8,#0369a1)',
        '<div class="mo-x" id="wt-x"></div><div class="vb-nag fm-row"><span id="wt-swl"></span><button type="button" class="vb-sw" id="wt-sw"></button></div>');
    const watCss = document.createElement('style'); // own copy of the switch look (vibe.js adds it only when vibration is available)
    watCss.textContent = `#tile-water .vb-nag{display:flex;align-items:center;gap:10px;margin-top:14px;padding:14px;border-radius:16px;background:rgba(255,255,255,.08);font-size:1.12rem;font-weight:800}
    #tile-water .vb-nag span{flex:1}
    #tile-water .vb-sw{flex:none;width:62px;height:34px;border-radius:999px;background:#475569;position:relative;border:0;transition:background .2s}
    #tile-water .vb-sw:after{content:'';position:absolute;top:4px;inset-inline-start:4px;width:26px;height:26px;border-radius:50%;background:#fff;transition:transform .2s}
    #tile-water .vb-sw.on{background:#10b981}
    #tile-water .vb-sw.on:after{transform:translateX(28px)}
    [dir=rtl] #tile-water .vb-sw.on:after{transform:translateX(-28px)}`;
    document.head.appendChild(watCss);
    const watOn = () => { try { return localStorage.getItem('medtime_water') === '1'; } catch (e) { return false; } };
    function drawWat() {
        heads(wat, 'watT', watOn() ? tx('watOn') : tx('famOff'));
        document.getElementById('wt-x').textContent = tx('watX');
        document.getElementById('wt-swl').textContent = tx('watSw');
        document.getElementById('wt-sw').classList.toggle('on', watOn());
    }
    document.getElementById('wt-sw').onclick = () => {
        vib();
        try { localStorage.setItem('medtime_water', watOn() ? '0' : '1'); } catch (e) { }
        if (typeof saveMeds === 'function' && typeof loadMeds === 'function') saveMeds(loadMeds()); // books or removes the alarms
        drawWat();
    };
    drawWat();

    // ---------------- 📺 M-383: SUPER NOVA TV link (functions/api/tv.js on medtime.pages.dev) ----------------
    const TVAPI = LINK + '/api/tv';
    const tvKey = () => { try { return localStorage.getItem('medtime_tv_key') || ''; } catch (e) { return ''; } };
    const tvPost = body => fetch(TVAPI, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) }).then(r => r.json());
    const tvt = tile('tile-tv', '📺', 'linear-gradient(135deg,#7FD3FF,#2F7BFF)',
        '<div class="mo-x" id="tv-x"></div><div id="tv-in"><input id="tv-code" inputmode="numeric" maxlength="6" autocomplete="off" style="width:100%;font-size:1.6rem;text-align:center;letter-spacing:.3em;padding:12px;border-radius:14px;border:0;margin:12px 0 4px">' +
        '<button type="button" class="mo-btn" id="tv-go"></button></div><button type="button" class="mo-btn alt" id="tv-off"></button>');
    function drawTv() {
        const on = !!tvKey();
        heads(tvt, 'tvT', on ? tx('tvOn') : tx('famOff'));
        document.getElementById('tv-x').textContent = tx('tvX');
        document.getElementById('tv-code').placeholder = tx('tvCode');
        document.getElementById('tv-go').textContent = tx('tvGo');
        document.getElementById('tv-off').textContent = tx('tvOff');
        document.getElementById('tv-in').style.display = on ? 'none' : '';
        document.getElementById('tv-off').style.display = on ? '' : 'none';
    }
    // The alarm list exactly as the phone books it (index.html syncNative), without the water reminders.
    let tvTimer = 0, tvR = null, tvDoneSent = '';
    // M-385: today's answers on the phone (taken / skipped), so the TV closes its window too.
    function tvDone() {
        try {
            const log = has('getLog') ? JSON.parse(N.getLog()) || [] : [];
            const today = dayKey(new Date());
            return log.filter(e => e.d === today && e.s && e.s !== 'missed').map(e => e.id + '@' + e.d);
        } catch (e) { return []; }
    }
    function tvSend() {
        if (!tvKey() || !tvR) return;
        const done = tvDone();
        tvDoneSent = done.join(',');
        tvPost({ op: 'push', key: tvKey(), sched: { v: 1, r: tvR, done: done } }).catch(() => { });
    }
    window.mtTvPush = function (alarms) {
        if (!tvKey()) return;
        clearTimeout(tvTimer);
        tvTimer = setTimeout(() => {
            tvR = (alarms || []).filter(a => !(a.items || []).some(i => i.type === 'water'))
                .map(a => ({ id: a.id, time: a.time, days: a.days || [], items: (a.items || []).map(i => ({ name: i.name || '', dose: i.dose || '' })) }));
            tvSend();
        }, 1500);
    };
    // "Taken" pressed on the TV: mark it here like "taken early" (stops today's alarm, log, stock). Each event once.
    function tvEvents() {
        if (tvKey() && tvR && tvDone().join(',') !== tvDoneSent) tvSend(); // M-385: an answer on the phone reaches the TV within a minute
        if (!tvKey() || !has('takenEarly')) return;
        tvPost({ op: 'events', key: tvKey() }).then(j => {
            if (!j || !j.ok) { if (j && j.why === 'gone') { try { localStorage.removeItem('medtime_tv_key'); } catch (e) { } drawTv(); } return; }
            let done = []; try { done = JSON.parse(localStorage.getItem('medtime_tv_done') || '[]'); } catch (e) { }
            const today = dayKey(new Date());
            (j.ev || []).forEach(e => {
                const k = e.id + '@' + e.at;
                if (e.d !== today || done.includes(k)) return;
                done.push(k);
                try { N.takenEarly(e.id >= 100000000 ? e.id - 100000000 : e.id); } catch (err) { }
            });
            try { localStorage.setItem('medtime_tv_done', JSON.stringify(done.slice(-60))); } catch (e) { }
            if (typeof renderMeds === 'function') try { renderMeds(); } catch (e) { }
        }).catch(() => { });
    }
    document.getElementById('tv-go').onclick = () => {
        vib();
        const code = document.getElementById('tv-code').value.replace(/\D/g, '');
        if (code.length !== 6) { if (window.mtAlert) mtAlert(tx('tvBad')); return; }
        tvPost({ op: 'link', code: code }).then(j => {
            if (!j || !j.ok) { if (window.mtAlert) mtAlert(tx('tvBad')); return; }
            try { localStorage.setItem('medtime_tv_key', j.key); } catch (e) { }
            if (has('setTvKey')) try { N.setTvKey(j.key); } catch (e) { } // M-385
            if (typeof saveMeds === 'function' && typeof loadMeds === 'function') saveMeds(loadMeds()); // sends the list now
            drawTv();
            if (window.mtAlert) mtAlert(tx('tvOn'), '📺');
        }).catch(() => { if (window.mtAlert) mtAlert(tx('tvNet')); });
    };
    document.getElementById('tv-off').onclick = () => {
        vib();
        const k = tvKey();
        try { localStorage.removeItem('medtime_tv_key'); } catch (e) { }
        if (k) tvPost({ op: 'unlink', key: k }).catch(() => { });
        if (has('setTvKey')) try { N.setTvKey(''); } catch (e) { } // M-385
        drawTv();
    };
    drawTv();
    if (tvKey() && has('setTvKey')) try { N.setTvKey(tvKey()); } catch (e) { } // M-385: phones linked before this version
    tvEvents();
    setInterval(tvEvents, 60000);
    const prevResTv = window.mtResumed;
    window.mtResumed = function () { if (typeof prevResTv === 'function') try { prevResTv(); } catch (e) { } tvEvents(); };

    document.getElementById('fm-test').onclick = () => {
        vib();
        famInput();
        const f = famGet();
        if (!f.phone) { if (window.mtAlert) mtAlert(tx('famNoPhone')); return; }
        if (!f.perm) { if (window.mtAlert) mtAlert(tx('famNoPerm')); N.requestSms(); return; }
        const ok = N.testFamily(tx('famTestMsg'));
        if (window.mtAlert) mtAlert(ok ? tx('famSent') : tx('famFail'), ok ? '✅' : '⚠️');
    };
    const prevRes = window.mtResumed;
    window.mtResumed = function () { if (typeof prevRes === 'function') try { prevRes(); } catch (e) { } drawFam(); };

    // ---------------- 📦 pill stock (M-132) ----------------
    const stk = tile('tile-stock', '📦', 'linear-gradient(135deg,#fbbf24,#c2410c)', '<div class="mo-x" id="st-x"></div><div id="st-list"></div>');
    const stCss = document.createElement('style');
    stCss.textContent = `.st-card{background:rgba(255,255,255,.07);border-radius:16px;padding:10px 12px;margin:10px 0}
    .st-card.low{background:rgba(251,191,36,.16);box-shadow:inset 0 0 0 2px rgba(251,191,36,.6)}
    .st-name{font-weight:800;font-size:1.12rem;margin-bottom:6px}
    .st-warn{color:#fde047;font-weight:800;font-size:.95rem;margin:2px 0 6px}
    .st-row{display:flex;align-items:center;gap:10px;justify-content:center}
    .st-row .lb{font-size:1rem;opacity:.85}
    .st-pm{width:54px;height:54px;border-radius:50%;border:0;font-size:1.8rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#0ea5e9,#6366f1);box-shadow:inset 0 2px 1px rgba(255,255,255,.35),0 4px 10px rgba(0,0,0,.4)}
    .st-n{width:86px;text-align:center;font-size:1.7rem;font-weight:800;border-radius:14px;border:1.5px solid rgba(255,255,255,.3);background:rgba(0,0,0,.25);color:#fff;padding:6px 0}
    .st-sm{display:flex;gap:8px;margin-top:8px}
    .st-sm button{flex:1;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:12px;padding:10px 6px;font-size:.95rem;font-weight:700}
    .st-off{display:block;width:100%;margin:10px 0 0;padding:11px 12px;border-radius:14px;border:1.5px solid #fca5a5;background:linear-gradient(135deg,#ef4444,#b91c1c);color:#fff;font-weight:800;font-size:1.02rem;box-shadow:0 3px 0 rgba(0,0,0,.3)}`;
    document.head.appendChild(stCss);
    const PACK = 30, LOWS = [3, 5, 7, 10, 14];
    const stKey = n => (n || '').trim().toLowerCase();
    const stGet = () => { try { return JSON.parse(N.getStock()) || {}; } catch (e) { return {}; } };
    const stSave = o => { try { N.setStock(JSON.stringify(o)); } catch (e) { } };
    function medNames() {
        const out = [], seen = {};
        try {
            (JSON.parse(localStorage.getItem('medtime_list') || '[]') || []).forEach(m => (m.items && m.items.length ? m.items : [{ name: m.name }]).forEach(it => {
                const n = (it && it.name || '').trim(); if (n && !seen[stKey(n)]) { seen[stKey(n)] = 1; out.push(n); }
            }));
        } catch (e) { }
        return out;
    }
    const nfmt = v => String(Math.round(v * 10) / 10);
    function drawStock() {
        if (!has('getStock')) { stk.style.display = 'none'; return; }
        const all = stGet(), names = medNames();
        const counted = names.filter(n => all[stKey(n)] && 'left' in all[stKey(n)]);
        const low = counted.filter(n => all[stKey(n)].left <= (all[stKey(n)].low || 5));
        heads(stk, 'stT', low.length ? fill(tx('stSub'), { n: low.join(', ') }) : counted.length ? fill(tx('stSubOk'), { n: counted.length }) : tx('stSubOff'));
        document.getElementById('st-x').textContent = names.length ? tx('stX') : tx('stNone');
        const box = document.getElementById('st-list');
        box.innerHTML = '';
        names.forEach(n => {
            const k = stKey(n), s = all[k];
            const c = document.createElement('div'); c.className = 'st-card';
            const h = document.createElement('div'); h.className = 'st-name'; h.textContent = '💊 ' + n; c.appendChild(h);
            if (!s || !('left' in s)) {
                const b = document.createElement('button'); b.type = 'button'; b.className = 'mo-btn alt'; b.textContent = tx('stStart');
                b.onclick = () => { vib(); const o = stGet(); o[k] = { n: n, left: PACK, low: 5 }; stSave(o); drawStock(); };
                c.appendChild(b); box.appendChild(c); return;
            }
            const lowLv = s.low || 5;
            if (s.left <= lowLv) { c.classList.add('low'); const w = document.createElement('div'); w.className = 'st-warn'; w.textContent = tx('stLowNow'); c.appendChild(w); }
            const r = document.createElement('div'); r.className = 'st-row';
            r.innerHTML = '<span class="lb"></span><button type="button" class="st-pm">−</button><input class="st-n" type="number" inputmode="decimal" min="0"><button type="button" class="st-pm">+</button>';
            r.querySelector('.lb').textContent = tx('stLeft');
            const inp = r.querySelector('.st-n'); inp.value = nfmt(s.left);
            const put = v => { const o = stGet(); if (!o[k]) return; o[k].left = Math.max(0, v); delete o[k].w; stSave(o); drawStock(); };
            const pm = r.querySelectorAll('.st-pm');
            pm[0].onclick = () => { vib(); put((+inp.value || 0) - 1); };
            pm[1].onclick = () => { vib(); put((+inp.value || 0) + 1); };
            inp.addEventListener('change', () => put(parseFloat(String(inp.value).replace(',', '.')) || 0));
            c.appendChild(r);
            const sm = document.createElement('div'); sm.className = 'st-sm';
            const pk = document.createElement('button'); pk.type = 'button'; pk.textContent = fill(tx('stPack'), { n: PACK });
            pk.onclick = () => { vib(); put((+inp.value || 0) + PACK); };
            const lw = document.createElement('button'); lw.type = 'button'; lw.textContent = fill(tx('stLow'), { n: lowLv });
            lw.onclick = () => { vib(); const o = stGet(); if (!o[k]) return; const i = LOWS.indexOf(o[k].low || 5); o[k].low = LOWS[(i + 1) % LOWS.length]; delete o[k].w; stSave(o); drawStock(); };
            sm.appendChild(pk); sm.appendChild(lw); c.appendChild(sm);
            const off = document.createElement('button'); off.type = 'button'; off.className = 'st-off'; off.textContent = tx('stStop');
            off.onclick = () => { vib(); const o = stGet(); delete o[k]; stSave(o); drawStock(); };
            c.appendChild(off);
            box.appendChild(c);
        });
    }
    stk.querySelector('.set-tile-head').addEventListener('click', drawStock);

    // ---------------- 📱 widget (M-134) ----------------
    const wg = tile('tile-widget', '📱', 'linear-gradient(135deg,#a78bfa,#4338ca)', '<div class="wg-prev" aria-hidden="true"><b>💊 MedTime</b><span>⏰ 08:00</span><span>✅ ✅ ⬜</span></div><div class="mo-x" id="wg-x"></div><button type="button" class="mo-btn" id="wg-go"></button><button type="button" class="mo-btn alt" id="wg-del"></button><div class="mo-x" id="wg-how" style="margin-top:10px;opacity:.75"></div>');
    function drawWidget() {
        if (!has('pinWidget')) { wg.style.display = 'none'; return; }
        let on = false; try { on = N.hasWidget(); } catch (e) { }
        heads(wg, 'wgT', on ? tx('wgOn') : tx('wgOff'));
        document.getElementById('wg-x').textContent = tx('wgX');
        document.getElementById('wg-go').textContent = tx('wgGo');
        document.getElementById('wg-how').textContent = tx('wgHow');
        const del = document.getElementById('wg-del'); del.textContent = tx('wgDel'); del.style.display = on && has('removeWidget') ? '' : 'none';
        document.getElementById('wg-go').style.display = on ? 'none' : ''; document.getElementById('wg-how').style.display = on ? 'none' : '';
    }
    document.getElementById('wg-del').onclick = () => { vib(); let ok = false; try { ok = N.removeWidget(); } catch (e) { } if (ok && window.mtAlert) mtAlert(tx('wgDone')); setTimeout(drawWidget, 1200); setTimeout(drawWidget, 3500); };
    document.getElementById('wg-go').onclick = () => { vib(); let ok = false; try { ok = N.pinWidget(); } catch (e) { } if (!ok && window.mtAlert) mtAlert(tx('wgHow')); };

    // ---------------- 💾 backup ----------------
    const BK = 'medtime_lastbackup';
    const bak = tile('tile-bak', '💾', 'linear-gradient(135deg,#60a5fa,#1d4ed8)',
        '<div class="mo-msg" id="bk-st"></div><div class="mo-x" id="bk-x"></div><button type="button" class="mo-btn" id="bk-save"></button><button type="button" class="mo-btn alt" id="bk-load"></button>');
    const fmtDate = ms => { try { return new Date(ms).toLocaleDateString(L5[li()], { day: 'numeric', month: 'numeric', year: 'numeric' }); } catch (e) { return ''; } };
    function drawBak() {
        let lastB = 0; try { lastB = +localStorage.getItem(BK) || 0; } catch (e) { }
        const autoOk = has('autoBackup');
        if (autoOk && autoT) {
            let d = ''; try { d = new Date(autoT).toLocaleString(L5[li()], { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { }
            heads(bak, 'bakT', fill(tx('autoOn'), { d: d }));
        } else heads(bak, 'bakT', fill(tx('bakSub'), { d: lastB ? fmtDate(lastB) : tx('never') }));
        // M-138: status of the automatic backup also inside the open window: time, or the reason it failed
        let er = autoJsErr; try { if (!er && has('autoBackupErr')) er = N.autoBackupErr(); } catch (e) { }
        let dd = ''; try { if (autoT) dd = new Date(autoT).toLocaleString(L5[li()], { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { }
        const st = document.getElementById('bk-st');
        st.style.display = autoOk ? '' : 'none';
        st.textContent = er ? fill(tx('autoErr'), { e: er }) : autoT ? '✅ ' + fill(tx('autoOn'), { d: dd }) : tx('autoNo');
        document.getElementById('bk-x').textContent = autoOk ? tx('autoX') + '\n\n' + tx('bakX') : tx('bakX');
        document.getElementById('bk-save').textContent = tx('bakGo');
        document.getElementById('bk-load').textContent = tx('resGo');
        document.getElementById('bk-save').style.display = has('exportBackup') ? '' : 'none';
        document.getElementById('bk-load').style.display = has('pickBackup') ? '' : 'none';
    }
    function backupFile(now) {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.indexOf('medtime') === 0 && k !== BK) data[k] = localStorage.getItem(k);
        }
        return { app: 'MedTime', v: 1, created: now, data: data, log: readLog(), stock: has('getStock') ? stGet() : {} };
    }
    // M-133: automatic backup on every change (when leaving the app and at start); native skips it if nothing changed
    let autoT = 0, autoJsErr = '';
    function autoBackup() {
        if (!has('autoBackup')) return;
        try {
            const f = backupFile(Date.now());
            const sig = JSON.stringify([f.data, f.log, f.stock]);
            autoT = +N.autoBackup(sig, JSON.stringify(f)) || autoT;
            autoJsErr = '';
        } catch (e) { autoJsErr = String(e && e.message || e); }
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) autoBackup(); });
    setTimeout(() => { autoBackup(); drawBak(); }, 6000);
    bak.querySelector('.set-tile-head').addEventListener('click', () => { autoBackup(); drawBak(); }); // M-138: fresh status when opened
    document.getElementById('bk-save').onclick = () => {
        vib();
        const now = Date.now();
        const file = backupFile(now);
        const name = 'MedTime-backup-' + dayKey(new Date(now)) + '.json';
        if (N.exportBackup(name, JSON.stringify(file))) { try { localStorage.setItem(BK, String(now)); } catch (e) { } drawBak(); }
    };
    document.getElementById('bk-load').onclick = () => { vib(); N.pickBackup(); };
    window.mtRestore = function (text) {
        let f = null;
        try { f = JSON.parse(text); } catch (e) { }
        if (!f || f.app !== 'MedTime' || !f.data || typeof f.data !== 'object') { if (window.mtAlert) mtAlert(tx('resBad')); return; }
        const go = window.mtDialog ? mtDialog({ icon: '📂', text: fill(tx('resQ'), { d: fmtDate(f.created) }), ok: tx('resOk') }) : Promise.resolve(true);
        go.then(ok => {
            if (!ok) return;
            Object.keys(localStorage).filter(k => k.indexOf('medtime') === 0 && k !== BK && k !== 'medtime_setup').forEach(k => localStorage.removeItem(k));
            Object.keys(f.data).forEach(k => { if (k.indexOf('medtime') === 0 && typeof f.data[k] === 'string') localStorage.setItem(k, f.data[k]); });
            if (Array.isArray(f.log) && has('setLog')) N.setLog(JSON.stringify(f.log));
            if (f.stock && typeof f.stock === 'object' && has('setStock')) N.setStock(JSON.stringify(f.stock)); // M-132
            const done = window.mtAlert ? mtAlert(tx('resDone'), '✅') : Promise.resolve();
            Promise.resolve(done).then(() => location.reload());
        });
    };

    // ---------------- 📤 share ----------------
    const sh = tile('tile-share', '📤', 'linear-gradient(135deg,#25d366,#128c7e)',
        '<div class="mo-x" id="sh-x"></div><div class="mo-msg" id="sh-msg"></div><button type="button" class="mo-btn" id="sh-go"></button>');
    const shareMsg = () => window.MT_STORE && window.mtStoreShare ? window.mtStoreShare() : tx('shMsg') + LINK + tx('shUtd') + UTD; // Play edition: store link. M-378: + Uptodown
    function drawShare() {
        heads(sh, 'shT', tx('shSub'));
        document.getElementById('sh-x').textContent = tx('shX');
        document.getElementById('sh-msg').textContent = shareMsg();
        document.getElementById('sh-go').textContent = tx('shGo');
        document.getElementById('sh-go').style.display = has('shareText') ? '' : 'none';
    }
    document.getElementById('sh-go').onclick = () => { vib(); N.shareText(shareMsg()); };

    window.moreRender = function () { drawLog(); drawFam(); drawStock(); drawWidget(); drawBak(); drawShare(); };
    const prevRes2 = window.mtResumed;
    window.mtResumed = function () { if (typeof prevRes2 === 'function') try { prevRes2(); } catch (e) { } drawWidget(); drawStock(); };
    moreRender();
})();
