// M-107: interactive help. An animated hand moves over the screens, taps, types and scrolls to show how things work.
// Demos (from the Help tile): add a reminder, change a reminder, weekend mode, tour of the settings.
// Hint mode (first-install wizard): the hand bobs over the control to use now.
// Demos never save anything: the add / edit wizard is closed without saving at the end.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const T = {
        demos: ['🎬 הדגמות: יד שמראה לכם', '🎬 عروض: يد تريك', '🎬 Demonstrații: o mână vă arată', '🎬 Démos : une main vous montre', '🎬 Demos: a hand shows you', '🎬 Демо: рука покажет вам'],
        dAdd: ['➕ הוספת תזכורת', '➕ إضافة تذكير', '➕ Adăugare memento', '➕ Ajouter un rappel', '➕ Add a reminder', '➕ Добавить напоминание'],
        dEdit: ['✏️ שינוי תזכורת', '✏️ تعديل تذكير', '✏️ Modificare memento', '✏️ Modifier un rappel', '✏️ Change a reminder', '✏️ Изменить напоминание'],
        dWk: ['🌴 מצב סופ״ש', '🌴 نهاية الأسبوع', '🌴 Mod weekend', '🌴 Mode week-end', '🌴 Weekend mode', '🌴 Режим выходных'],
        dSet: ['⚙️ סיור בהגדרות', '⚙️ جولة في الإعدادات', '⚙️ Tur prin setări', '⚙️ Visite des réglages', '⚙️ Settings tour', '⚙️ Обзор настроек'],
        stop: ['✕ עצירה', '✕ إيقاف', '✕ Stop', '✕ Arrêter', '✕ Stop', '✕ Стоп'],
        a1: ['במסך הראשי לוחצים "הוסף תזכורת"', 'في الشاشة الرئيسية اضغط "إضافة تذكير"', 'Pe ecranul principal apăsați „Adaugă memento”', 'Sur l\'écran principal, appuyez sur « Ajouter un rappel »', 'On the main screen tap "Add reminder"', 'На главном экране нажмите «Добавить напоминание»'],
        a2: ['בוחרים את סוג התרופה', 'اختر نوع الدواء', 'Alegeți tipul medicamentului', 'Choisissez le type', 'Choose the kind of medicine', 'Выберите вид лекарства'],
        a3: ['כותבים את שם התרופה', 'اكتب اسم الدواء', 'Scrieți numele', 'Écrivez le nom', 'Type the medicine name', 'Введите название лекарства'],
        a4: ['לוחצים "הבא"', 'اضغط "التالي"', 'Apăsați „Înainte”', 'Appuyez sur « Suivant »', 'Tap "Next"', 'Нажмите «Далее»'],
        a5: ['המינון לא חובה. אפשר להמשיך', 'الجرعة اختيارية. تابع', 'Doza e opțională. Continuați', 'La dose est facultative', 'The dose is optional. Go on', 'Доза необязательна. Продолжайте'],
        a6: ['אפשר להוסיף עוד תרופה לאותה שעה, או להמשיך', 'يمكن إضافة دواء آخر لنفس الساعة أو المتابعة', 'Puteți adăuga alt medicament sau continua', 'Ajoutez un autre médicament ou continuez', 'Add another medicine for the same time, or go on', 'Добавьте ещё одно лекарство на то же время или продолжайте'],
        a7: ['בוחרים שעה', 'اختر الساعة', 'Alegeți ora', 'Choisissez l\'heure', 'Pick a time', 'Выберите время'],
        a8: ['בוחרים ימים. בלי בחירה = כל יום', 'اختر الأيام. بدون اختيار = كل يوم', 'Alegeți zilele. Fără alegere = zilnic', 'Choisissez les jours. Sans choix = tous les jours', 'Pick days. Nothing = every day', 'Выберите дни. Ничего = каждый день'],
        a9: ['בסוף לוחצים "שמור תזכורת" וזהו!', 'في النهاية اضغط "حفظ التذكير"!', 'La final apăsați „Salvează”!', 'À la fin, « Enregistrer » !', 'At the end tap "Save reminder". Done!', 'В конце нажмите «Сохранить напоминание». Готово!'],
        demoNote: ['(בהדגמה לא שומרים כלום)', '(لا يُحفظ شيء في العرض)', '(În demonstrație nu se salvează nimic)', '(Rien n\'est enregistré dans la démo)', '(Nothing is saved in the demo)', '(В демо ничего не сохраняется)'],
        e0: ['קודם צריך תזכורת אחת לפחות', 'تحتاج أولاً إلى تذكير واحد', 'Mai întâi adăugați un memento', 'Ajoutez d\'abord un rappel', 'First add at least one reminder', 'Сначала добавьте хотя бы одно напоминание'],
        e1: ['פותחים את "התזכורות שלי"', 'افتح "تذكيراتي"', 'Deschideți „Mementourile mele”', 'Ouvrez « Mes rappels »', 'Open "My reminders"', 'Откройте «Мои напоминания»'],
        e2: ['לוחצים ✏️ עריכה על התזכורת', 'اضغط ✏️ تعديل', 'Apăsați ✏️ Editează', 'Appuyez sur ✏️ Modifier', 'Tap ✏️ Edit on the reminder', 'Нажмите ✏️ Изменить на напоминании'],
        e3: ['נגיעה בשעה משנה את השעה', 'المس الساعة لتغييرها', 'Atingeți ora pentru a o schimba', 'Touchez l\'heure pour la changer', 'Tap the time to change it', 'Нажмите на время, чтобы его изменить'],
        e4: ['נגיעה בימים משנה את הימים', 'المس الأيام لتغييرها', 'Atingeți zilele', 'Touchez les jours', 'Tap the days to change them', 'Нажмите на дни, чтобы их изменить'],
        e5: ['✕ מוריד תרופה, ➕ מוסיף תרופה', '✕ يزيل دواء، ➕ يضيف دواء', '✕ șterge, ➕ adaugă', '✕ retire, ➕ ajoute', '✕ removes a medicine, ➕ adds one', '✕ убирает лекарство, ➕ добавляет'],
        e6: ['ובסוף "שמירת השינויים"', 'ثم "حفظ التغييرات"', 'Apoi „Salvează modificările”', 'Puis « Enregistrer »', 'Then "Save changes"', 'Затем «Сохранить изменения»'],
        w1: ['כאן בוחרים שעה אחרת לשישי ושבת, רק לתזכורת הזו', 'هنا تختار ساعة أخرى للجمعة والسبت', 'Aici alegeți altă oră vineri și sâmbătă', 'Ici, une autre heure le vendredi et samedi', 'Here you pick another time for Friday and Saturday', 'Здесь выбирается другое время на пятницу и субботу'],
        w2: ['ובראש הרשימה: הזזה אחת לכל התזכורות בסופ״ש', 'وفي أعلى القائمة: تأخير واحد لكل التذكيرات', 'Sus în listă: o mutare pentru toate', 'En haut de la liste : un décalage pour tous', 'At the top of the list: one shift for all reminders', 'Вверху списка: один сдвиг для всех напоминаний'],
        s0: ['במסך הראשי לוחצים על גלגל השיניים ⚙️', 'اضغط على الترس ⚙️', 'Apăsați rotița ⚙️', 'Appuyez sur la roue ⚙️', 'Tap the gear ⚙️ on the main screen', 'Нажмите шестерёнку ⚙️ на главном экране'],
        sEnd: ['נגיעה בכל ריבוע פותחת אותו. זהו!', 'المس أي مربع لفتحه!', 'Atingeți un pătrat pentru a-l deschide!', 'Touchez une case pour l\'ouvrir !', 'Tap any square to open it. That\'s it!', 'Нажмите на любой квадрат, чтобы открыть его. Вот и всё!'],
        swipe: ['גוללים למטה לעוד', 'مرّر للأسفل للمزيد', 'Derulați pentru mai mult', 'Faites défiler pour plus', 'Scroll down for more', 'Прокрутите вниз, там ещё'],
        // M-110: guide button on the main screen + more demos
        guide: ['הדרכה', 'إرشاد', 'Ghid', 'Guide', 'Guide', 'Гид'],
        gLine: ['הדרכה מונפשת: איך משתמשים', 'إرشاد متحرك: كيف تستخدم', 'Ghid animat: cum se folosește', 'Guide animé : comment faire', 'Animated guide: how to use', 'Анимированный гид: как пользоваться'],
        gTitle: ['👆 הדרכה מונפשת', '👆 إرشاد متحرك', '👆 Ghid animat', '👆 Guide animé', '👆 Animated guide', '👆 Анимированный гид'],
        gSub: ['בחרו נושא, ויד על המסך תראה לכם איך עושים', 'اختر موضوعًا، ويد على الشاشة تريك كيف', 'Alegeți un subiect și o mână vă arată cum', 'Choisissez un sujet, une main vous montre comment', 'Pick a topic and a hand on the screen shows you how', 'Выберите тему, и рука на экране покажет как'],
        gMore: ['📖 רוצים הסבר מפורט בכתב? יש עזרה גם בתוך ההגדרות ⚙️', '📖 تريد شرحًا مكتوبًا مفصلًا؟ توجد مساعدة داخل الإعدادات ⚙️', '📖 Explicații scrise detaliate: Ajutor în setări ⚙️', '📖 Explications détaillées : Aide dans les réglages ⚙️', '📖 Want detailed written help? There is Help inside Settings ⚙️', '📖 Нужна подробная письменная помощь? Она есть в Настройках ⚙️'],
        gOpenHelp: ['לפתוח עזרה מפורטת', 'افتح المساعدة المفصلة', 'Deschide ajutorul', "Ouvrir l'aide", 'Open detailed help', 'Открыть подробную помощь'],
        gVoice: ['🔊 הקראה קולית של ההסברים', '🔊 قراءة الشرح بصوت', '🔊 Citire cu voce a explicațiilor', '🔊 Lecture des explications à voix haute', '🔊 Read the explanations aloud', '🔊 Читать объяснения вслух'],
        vOn: ['פועל', 'مفعّل', 'Pornit', 'Activé', 'On', 'Вкл.'],
        vOff: ['כבוי', 'متوقف', 'Oprit', 'Désactivé', 'Off', 'Выкл.'],
        gClose: ['סגירה', 'إغلاق', 'Închide', 'Fermer', 'Close', 'Закрыть'],
        dAppt: ['🩺 תור לרופא', '🩺 موعد طبيب', '🩺 Programare la medic', '🩺 Rendez-vous médical', '🩺 Doctor appointment', '🩺 Приём у врача'],
        dLog: ['📒 יומן ודוח לרופא', '📒 السجل وتقرير للطبيب', '📒 Jurnal și raport', '📒 Journal et rapport', '📒 Log and report', '📒 Журнал и отчёт'],
        dFam: ['👨‍👩‍👧 התראה למשפחה', '👨‍👩‍👧 تنبيه العائلة', '👨‍👩‍👧 Alertă familie', '👨‍👩‍👧 Alerte famille', '👨‍👩‍👧 Family alert', '👨‍👩‍👧 Оповещение семьи'],
        dRead: ['🔠 קריאה נוחה', '🔠 قراءة مريحة', '🔠 Citire ușoară', '🔠 Lecture facile', '🔠 Easy reading', '🔠 Удобное чтение'],
        dRelax: ['🌙 מצב שלווה', '🌙 وضع السكينة', '🌙 Mod liniște', '🌙 Mode sérénité', '🌙 Serenity mode', '🌙 Режим покоя'],
        dHome: ['🏠 המסך הראשי', '🏠 الشاشة الرئيسية', '🏠 Ecranul principal', "🏠 L'écran principal", '🏠 Main screen', '🏠 Главный экран'],
        p1: ['"תורים לרופא" פותח את רשימת התורים', '"مواعيد الطبيب" يفتح قائمة المواعيد', '„Programări” deschide lista', '« Rendez-vous » ouvre la liste', '"Doctor appointments" opens the list', '«Записи к врачу» открывает список'],
        p2: ['לוחצים "תור חדש"', 'اضغط "موعد جديد"', 'Apăsați „Programare nouă”', 'Appuyez sur « Nouveau rendez-vous »', 'Tap "New appointment"', 'Нажмите «Новая запись»'],
        p3: ['בוחרים סוג וכותבים שם רופא', 'اختر النوع واكتب اسم الطبيب', 'Alegeți tipul și scrieți medicul', 'Choisissez le type et le médecin', 'Pick a type and write the doctor', 'Выберите тип и впишите врача'],
        p4: ['בוחרים יום ושעה', 'اختر اليوم والساعة', 'Alegeți ziua și ora', 'Choisissez le jour et l\'heure', 'Pick the day and time', 'Выберите день и время'],
        p5: ['אחר כך: מקום, טלפון, ניווט בוויז ותזכורת לפני. ובסוף שמירה', 'ثم: المكان، الهاتف، Waze وتذكير مسبق. ثم حفظ', 'Apoi: locul, telefonul, Waze și memento. Apoi salvați', 'Puis : lieu, téléphone, Waze et rappel. Puis enregistrer', 'Then: place, phone, Waze and a reminder before. Then save', 'Затем: место, телефон, Waze и напоминание заранее. Потом сохраните'],
        demoDoc: ['ד״ר כהן', 'د. كوهين', 'Dr. Cohen', 'Dr Cohen', 'Dr. Cohen', 'Д-р Коэн'],
        l1: ['בהגדרות ⚙️ יש "יומן תרופות"', 'في الإعدادات ⚙️ يوجد "سجل الأدوية"', 'În setări ⚙️: „Jurnal”', 'Dans les réglages ⚙️ : « Journal »', 'In Settings ⚙️ there is the "Medicine log"', 'В Настройках ⚙️ есть «Журнал лекарств»'],
        l2: ['כאן רואים מה נלקח, מה נדחה ומה הוחמץ, יום אחרי יום', 'هنا ترى ما أُخذ وما أُجّل وما فات', 'Aici vedeți ce s-a luat și ce s-a ratat', 'On voit ce qui a été pris ou manqué', 'Here you see what was taken, skipped or missed, day by day', 'Здесь видно, что принято, пропущено или забыто, по дням'],
        l3: ['ובכפתור הזה: דוח שבועי יפה ב-PDF לשלוח לרופא או למשפחה', 'وهذا الزر: تقرير أسبوعي PDF للطبيب أو العائلة', 'Acest buton: raport PDF săptămânal', 'Ce bouton : un rapport PDF de la semaine', 'This button: a nice weekly PDF report for the doctor or family', 'Эта кнопка: красивый недельный PDF-отчёт для врача или семьи'],
        dStock: ['📦 מלאי כדורים', '📦 مخزون الأدوية', '📦 Stoc pastile', '📦 Stock de médicaments', '📦 Pill stock', '📦 Запас таблеток'],
        dWidget: ['📱 ווידג׳ט למסך הבית', '📱 أداة الشاشة الرئيسية', '📱 Widget pe ecran', "📱 Widget d'accueil", '📱 Home-screen widget', '📱 Виджет на главном экране'],
        k1: ['בהגדרות ⚙️ יש "מלאי תרופות"', 'في الإعدادات ⚙️ "مخزون الأدوية"', 'În setări ⚙️: „Stoc medicamente”', 'Dans les réglages ⚙️ : « Stock de médicaments »', 'In Settings ⚙️ there is "Medicine stock"', 'В Настройках ⚙️ есть «Запас лекарств»'],
        k2: ['כותבים כמה יש בבית. כל "לקחתי" מוריד מהספירה', 'اكتب كم لديك. كل "تناولته" يُنقص العدد', 'Scrieți câte aveți. Fiecare „Am luat” scade', 'Indiquez combien il en reste. Chaque « Pris » le diminue', 'Write how many you have. Every "Taken" lowers the count', 'Укажите, сколько у вас есть. Каждое «Принято» уменьшает число'],
        k3: ['קניתם חבילה? לחיצה אחת מוסיפה אותה', 'اشتريت علبة؟ ضغطة واحدة تضيفها', 'Ați cumpărat o cutie? O atingere o adaugă', 'Nouvelle boîte ? Un geste l\'ajoute', 'Bought a pack? One tap adds it', 'Купили упаковку? Одно касание — и она добавлена'],
        k4: ['וכשנשאר מעט, מקבלים תזכורת לקנות עוד', 'وعندما يتبقى القليل يصلك تذكير بالشراء', 'Când rămân puține, primiți un memento', 'Quand il en reste peu, un rappel arrive', 'When few are left, you get a reminder to buy more', 'Когда остаётся мало, вы получите напоминание купить ещё'],
        y1: ['בהגדרות ⚙️ יש "ווידג׳ט למסך הבית"', 'في الإعدادات ⚙️ "أداة للشاشة الرئيسية"', 'În setări ⚙️: „Widget pe ecranul principal”', "Dans les réglages ⚙️ : « Widget sur l'écran d'accueil »", 'In Settings ⚙️ there is "Home-screen widget"', 'В Настройках ⚙️ есть «Виджет на главном экране»'],
        y2: ['לחיצה כאן שמה במסך הבית ריבוע עם התרופה הבאה', 'هذا الزر يضع مربعًا بالدواء التالي على الشاشة', 'Acest buton pune pe ecran următorul medicament', "Ce bouton place le prochain médicament sur l'écran d'accueil", 'This button puts a square with the next medicine on the home screen', 'Эта кнопка ставит на главный экран квадрат со следующим лекарством'],
        f1: ['בהגדרות ⚙️ יש "התראה למשפחה"', 'في الإعدادات ⚙️ "تنبيه العائلة"', 'În setări ⚙️: „Alertă familie”', 'Dans les réglages ⚙️ : « Alerte famille »', 'In Settings ⚙️ there is "Family alert"', 'В Настройках ⚙️ есть «Оповещение семьи»'],
        f3: ['ומדליקים את המתג, וזה פועל', 'ثم شغّل المفتاح ليعمل التنبيه', 'Apoi porniți comutatorul', "Puis activez l'interrupteur", 'Then turn the switch on', 'Затем включите переключатель'],
        f4: ['כאן שולחים הודעת ניסיון, לבדוק שהכל עובד', 'هنا ترسل رسالة تجربة للتأكد', 'Aici trimiteți un mesaj de probă', "Ici, envoyez un message d'essai", 'Here you send a test message to check it works', 'Здесь отправляется тестовое сообщение, чтобы проверить работу'],
        f5: ['או כותבים שם ומספר טלפון בעצמכם', 'أو اكتب الاسم ورقم الهاتف بنفسك', 'Sau scrieți numele și telefonul', 'Ou écrivez le nom et le numéro', 'Or type a name and phone number yourself', 'Или введите имя и номер телефона сами'],
        f2: ['בוחרים איש קשר. אם תרופה לא נלקחה שעה, הוא מקבל SMS', 'اختر جهة اتصال. إذا لم يؤخذ الدواء ساعة يصله SMS', 'Alegeți un contact: primește SMS după o oră', 'Choisissez un contact : il reçoit un SMS après une heure', 'Pick a contact. If a dose is not taken for an hour, they get an SMS', 'Выберите контакт. Если доза не принята в течение часа, он получит SMS'],
        r1: ['במשקפיים 👓 בתחתית: הכל גדול וברור בלחיצה אחת', 'النظارة 👓 في الأسفل: كل شيء كبير بلمسة', 'Ochelarii 👓: totul mare dintr-o atingere', 'Les lunettes 👓 : tout en grand en un geste', 'The glasses 👓 at the bottom: everything big and clear in one tap', 'Очки 👓 внизу: всё крупно и чётко в одно касание'],
        r2: ['ובהגדרות "גודל הטקסט" בוחרים גודל שנוח לכם', 'وفي الإعدادات "حجم النص"', 'În setări: „Mărimea textului”', 'Dans les réglages : « Taille du texte »', 'And in Settings, "Text size" lets you choose', 'А в Настройках «Размер текста» позволяет выбрать'],
        q1: ['"שלווה" פותח מסך שקט עם צלילי טבע אמיתיים', '"سكينة" يفتح شاشة هادئة بأصوات الطبيعة', '„Liniște”: sunete reale din natură', '« Sérénité » : de vrais sons de la nature', '"Serenity" opens a quiet screen with real nature sounds', '«Покой» открывает тихий экран с настоящими звуками природы'],
        q2: ['טוב לפני השינה או כשצריך להירגע', 'جيد قبل النوم أو للاسترخاء', 'Bun înainte de somn', 'Idéal avant de dormir', 'Good before sleep or to relax', 'Хорошо перед сном или чтобы расслабиться'],
        h1: ['כאן הברכה לפי השעה ביום', 'هنا التحية حسب الوقت', 'Aici salutul după oră', "Ici, le salut selon l'heure", 'Here is the greeting by time of day', 'Здесь приветствие по времени суток'],
        h2: ['הוספת תזכורת חדשה', 'إضافة تذكير جديد', 'Adăugare memento', 'Ajouter un rappel', 'Add a new reminder', 'Добавить новое напоминание'],
        h3: ['כל התזכורות שלכם, והבאה בתור', 'كل تذكيراتك والتالي', 'Toate mementourile și următorul', 'Tous vos rappels et le prochain', 'All your reminders, and the next one', 'Все ваши напоминания и следующее из них'],
        h4: ['תורים לרופא, עם ניווט', 'مواعيد الطبيب مع الملاحة', 'Programări cu navigare', 'Rendez-vous avec navigation', 'Doctor appointments, with navigation', 'Записи к врачу с навигацией'],
        h5: ['הגדרות', 'الإعدادات', 'Setări', 'Réglages', 'Settings', 'Настройки'],
        h6: ['ויציאה מהאפליקציה. התזכורות ימשיכו לעבוד גם כשהיא סגורה', 'والخروج. التذكيرات تعمل حتى والتطبيق مغلق', 'Ieșire. Mementourile merg și cu aplicația închisă', "Quitter. Les rappels marchent même l'appli fermée", 'And exit. Reminders keep working when the app is closed', 'И выход. Напоминания работают и при закрытом приложении'],
        demoMed: ['אקמול', 'باراسيتامول', 'Paracetamol', 'Paracétamol', 'Tylenol', 'Парацетамол']
    };
    const tx = k => (T[k] || [k])[li()];
    const $ = id => document.getElementById(id);
    const PACE = 1.8; // M-111: owner found the demos too fast
    // M-118: optional voice that reads each caption aloud, in the app language, with the voice chosen in settings
    const voiceOn = () => { try { return localStorage.getItem('medtime_guide_voice') === '1'; } catch (e) { return false; } };
    const sleep = ms => new Promise(r => setTimeout(r, ms * (voiceOn() ? PACE * 1.15 : PACE)));
    const LANGS = ['he-IL', 'ar', 'ro-RO', 'fr-FR', 'en-US', 'ru-RU'];
    function speak(text) {
        text = String(text || '').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '').replace(/["“”]/g, '').trim();
        if (!text) return;
        const N = window.MedTimeNative;
        try {
            if (N && typeof N.speakGuide === 'function') { N.speakGuide(text); return; }
            if (window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = LANGS[li()] || 'he-IL'; u.rate = .95; speechSynthesis.speak(u); }
        } catch (e) { }
    }
    function hush() {
        const N = window.MedTimeNative;
        try { if (N && typeof N.stopSpeech === 'function') N.stopSpeech(); else if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { }
    }
    const vib = p => { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) { } };

    const css = document.createElement('style');
    css.textContent = `
    /* M-113: a real-looking 3D hand (SVG), glowing halo, floating, fingers moving */
    #mt-hand{position:fixed;left:0;top:0;z-index:2147483601;width:84px;height:110px;pointer-events:none;opacity:0;will-change:transform;
      transition:transform 1.3s cubic-bezier(.4,.1,.2,1),opacity .4s;
      filter:drop-shadow(0 0 5px rgba(125,249,255,.95)) drop-shadow(0 0 14px rgba(56,189,248,.7)) drop-shadow(0 14px 12px rgba(0,0,0,.5))}
    #mt-hand.on{opacity:1}
    #mt-hand .hd{display:block;width:100%;height:100%;transform-origin:46% 8%;animation:mtFloat 2.6s ease-in-out infinite}
    #mt-hand svg{width:100%;height:100%;overflow:visible}
    #mt-hand .hp{display:block;width:100%;height:100%;transform-origin:50% 12%;transition:transform .45s cubic-bezier(.45,0,.25,1)}
    #mt-hand .fg{transform-box:fill-box;transform-origin:50% 100%}
    /* M-115: smooth, round finger bend: the tip folds at the knuckle, a fingertip pad shows, everything eases in and out */
    #mt-hand .fb,#mt-hand .ft,#mt-hand .fi{transform-box:fill-box;transform-origin:50% 100%;transition:transform .45s cubic-bezier(.45,0,.25,1)}
    #mt-hand .nl{transition:opacity .35s ease}
    #mt-hand .pd{opacity:0;transition:opacity .35s ease}
    #mt-hand .f-idx{animation:mtIdx 1.8s cubic-bezier(.45,0,.55,1) infinite}
    #mt-hand .f-mid{animation:mtCurl 1.6s cubic-bezier(.45,0,.55,1) infinite}
    #mt-hand .f-ring{animation:mtCurl 1.6s cubic-bezier(.45,0,.55,1) .2s infinite}
    #mt-hand .f-pin{animation:mtCurl 1.6s cubic-bezier(.45,0,.55,1) .4s infinite}
    #mt-hand .f-thb{transform-origin:80% 80%;animation:mtThumb 2s cubic-bezier(.45,0,.55,1) infinite}
    @keyframes mtFloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-6px) rotate(3deg)}}
    /* M-117: bigger, clearly visible finger motion: a soft wave curl across the fingers, thumb sways, index wiggles */
    @keyframes mtIdx{0%,100%{transform:rotate(-9deg)}50%{transform:rotate(7deg)}}
    @keyframes mtCurl{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(4px) scaleY(.66)}}
    @keyframes mtThumb{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(22deg)}}
    /* tap: the finger bends and the hand dips */
    #mt-hand.press .hp{transform:perspective(260px) rotateX(16deg) translateY(6px) scale(.96)}
    #mt-hand.press .fb{transform:scaleY(.94)}
    #mt-hand.press .ft{transform:scaleY(.52)}
    #mt-hand.press .nl{opacity:.1}
    #mt-hand.press .pd{opacity:1}
    #mt-hand.press .fi{transform:scaleY(.8)}
    /* hint mode: floats and taps again and again */
    #mt-hand.bob .hd{animation:mtFloat 2.6s ease-in-out infinite}
    #mt-hand.bob .ft{animation:mtTapLoop 2.2s cubic-bezier(.45,0,.25,1) infinite}
    #mt-hand.bob .pd{animation:mtPad 2.2s ease-in-out infinite}
    #mt-hand.bob .nl{animation:mtNail 2.2s ease-in-out infinite}
    #mt-hand.bob .hp{animation:mtTilt 2.2s cubic-bezier(.45,0,.25,1) infinite}
    @keyframes mtTapLoop{0%,50%,100%{transform:scaleY(1)}72%{transform:scaleY(.52)}}
    @keyframes mtPad{0%,50%,100%{opacity:0}72%{opacity:1}}
    @keyframes mtNail{0%,50%,100%{opacity:1}72%{opacity:.1}}
    @keyframes mtTilt{0%,50%,100%{transform:none}72%{transform:perspective(260px) rotateX(16deg) translateY(6px) scale(.96)}}
    .mt-ripple{position:fixed;z-index:2147483599;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:3px solid #fde047;pointer-events:none;animation:mtRip .6s ease-out forwards}
    @keyframes mtRip{to{transform:scale(4.5);opacity:0}}
    #mt-veil{position:fixed;inset:0;z-index:2147483590;background:transparent}
    /* M-116: the caption rides right next to the hand (under it, or above when there is no room), so eyes follow one spot */
    #mt-bubble{position:fixed;left:0;top:0;transform:translate(-999px,-999px);will-change:transform;z-index:2147483600;width:min(84vw,340px);box-sizing:border-box;
      padding:12px 16px;border-radius:20px;background:#fff7cc;color:#1c1917;font-weight:900;font-size:1.35rem;line-height:1.3;text-align:center;
      border:4px solid #f59e0b;box-shadow:0 0 0 3px rgba(0,0,0,.55),0 12px 30px rgba(0,0,0,.6);opacity:0;transition:opacity .35s,transform 1.3s cubic-bezier(.4,.1,.2,1);pointer-events:none}
    #mt-bubble.on{opacity:1}
    #mt-bubble.on.mv{opacity:0;transition:opacity .18s}
    #mt-stop{position:fixed;left:12px;top:max(12px,env(safe-area-inset-top));z-index:2147483602;padding:12px 26px;border-radius:999px;border:0;
      background:#dc2626;color:#fff;font-weight:900;font-size:1.1rem;box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 6px 0 #7f1d1d,0 10px 20px rgba(0,0,0,.5)}
    .mt-pressed{transform:scale(.95)!important;filter:brightness(1.15);transition:transform .35s cubic-bezier(.45,0,.25,1),filter .35s!important}
    .mt-flash{outline:3px solid #fde047!important;outline-offset:3px;border-radius:14px;transition:outline-color .3s}
    .guide-line{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;margin-top:10px;padding:7px 12px;white-space:nowrap;overflow:hidden;border-radius:999px;cursor:pointer;
      background:rgba(6,40,30,.35);border:2px solid #4ade80;color:#bbf7d0;font-weight:800;font-size:1rem;letter-spacing:.2px;
      text-shadow:0 0 6px rgba(74,222,128,.9),0 0 14px rgba(74,222,128,.6);
      box-shadow:0 0 8px rgba(74,222,128,.75),0 0 22px rgba(74,222,128,.45),inset 0 0 12px rgba(74,222,128,.35);animation:glPulse 3s ease-in-out infinite}
    .guide-line .gl-t{overflow:hidden;text-overflow:ellipsis}
    .guide-line .gl-h{font-size:1.2rem;filter:drop-shadow(0 0 6px rgba(187,247,208,.9));animation:glTap 3s ease-in-out infinite}
    .guide-line:active{transform:scale(.98)}
    @keyframes glPulse{50%{box-shadow:0 0 14px rgba(74,222,128,1),0 0 34px rgba(74,222,128,.7),inset 0 0 16px rgba(74,222,128,.5);border-color:#86efac}}
    @keyframes glTap{0%,70%,100%{transform:translateY(0)}80%{transform:translateY(4px) scale(.9)}}
    html.lowvision .guide-line{background:#000!important;color:#fff!important;text-shadow:none!important;border-color:#fff!important;animation:none}
    #mt-guide{position:fixed;inset:0;z-index:2147483500;background:rgba(2,6,23,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;opacity:0;transition:opacity .25s}
    #mt-guide.in{opacity:1}
    #mt-guide .g-card{position:relative;width:100%;max-width:560px;max-height:88vh;overflow-y:auto;box-sizing:border-box;padding:22px 16px calc(18px + env(safe-area-inset-bottom));border-radius:28px 28px 0 0;
      background:linear-gradient(170deg,#3b0764,#1e1b4b 55%,#0f172a);border-top:2px solid rgba(233,213,255,.5);box-shadow:0 -10px 40px rgba(0,0,0,.6);transform:translateY(40px);transition:transform .25s;color:#fff}
    #mt-guide.in .g-card{transform:none}
    #mt-guide .g-x{position:absolute;top:12px;inset-inline-end:12px;width:42px;height:42px;border-radius:50%;border:0;background:radial-gradient(circle at 35% 30%,#fca5a5,#dc2626 50%,#7f1d1d);color:#fff;font-size:1.2rem;font-weight:900;box-shadow:0 4px 0 #450a0a}
    #mt-guide .g-t{font-size:1.5rem;font-weight:900;color:#e9d5ff;text-align:center;margin:4px 40px 4px}
    #mt-guide .g-s{text-align:center;opacity:.85;font-size:1rem;margin-bottom:14px}
    #mt-guide .g-voice{display:flex;align-items:center;gap:12px;width:100%;margin:0 0 14px;padding:13px 16px;border-radius:18px;border:2px solid rgba(125,211,252,.6);
      background:linear-gradient(170deg,rgba(14,165,233,.35),rgba(30,58,138,.55));color:#fff;font-weight:900;font-size:1.12rem;text-align:start;box-shadow:0 4px 0 rgba(0,0,0,.35)}
    #mt-guide .g-voice .gv-t{flex:1}
    #mt-guide .g-voice .gv-sw{flex:none;position:relative;width:54px;height:30px;border-radius:999px;background:#475569;transition:background .25s}
    #mt-guide .g-voice .gv-sw i{position:absolute;top:3px;inset-inline-start:3px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.4);transition:inset-inline-start .25s}
    #mt-guide .g-voice.on .gv-sw{background:#22c55e}
    #mt-guide .g-voice.on .gv-sw i{inset-inline-start:27px}
    #mt-guide .g-voice .gv-st{flex:none;min-width:3.2em;text-align:center;color:#fde68a}
    #mt-guide .g-voice.on{border-color:#86efac;background:linear-gradient(170deg,rgba(34,197,94,.4),rgba(20,83,45,.6))}
    #mt-guide .g-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    /* M-152 (owner): the guide sheet fills the whole screen, top to bottom, with no scrolling */
    #mt-guide .g-card{height:100vh;height:100dvh;max-height:none;overflow:hidden;display:flex;flex-direction:column;border-radius:0;padding-top:calc(14px + env(safe-area-inset-top))}
    #mt-guide .g-grid{flex:1 1 auto;min-height:0;grid-auto-rows:1fr;gap:8px}
    #mt-guide .g-grid button{padding:4px 8px;min-height:0;line-height:1.15;font-size:min(1.05rem,2.4vh)}
    #mt-guide .g-more{flex:none;margin-top:10px}
    /* M-155 (owner): in low-vision mode the guide text spilled out of the cards: sizes follow the screen height, long words wrap */
    html.lowvision #mt-guide .g-grid button{font-size:min(1.05rem,2.3vh)!important;overflow:hidden;overflow-wrap:anywhere;padding:2px 6px!important}
    html.lowvision #mt-guide .g-t{font-size:min(1.5rem,3.2vh)!important;margin-top:0}
    html.lowvision #mt-guide .g-s,html.lowvision #mt-guide .g-m{font-size:min(1rem,2.1vh)!important;margin-bottom:8px}
    html.lowvision #mt-guide .g-voice{font-size:min(1.12rem,2.3vh)!important;padding:8px 12px;margin-bottom:8px}
    html.lowvision #mt-guide .g-help{font-size:min(1.1rem,2.3vh)!important}
    /* M-154 (owner): Help fills the screen exactly: big cards in one column that share the height, no scrolling */
    #tile-help.open .set-body{display:flex!important;flex-direction:column}
    #tile-help.open .help-demos{flex:none;margin-bottom:8px}
    #tile-help.open .help-list{flex:1 1 auto;min-height:0;display:flex!important;flex-direction:column;gap:min(8px,.9vh)!important;padding-bottom:0!important}
    #tile-help.open .help-item:not([open]){flex:1 1 0;min-height:0;display:flex;flex-direction:column;justify-content:center}
    #tile-help.open .help-item[open]{flex:none}
    #tile-help.open .help-list:has(.help-item[open]){overflow-y:auto}
    #tile-help.open .help-list:has(.help-item[open]) .help-item:not([open]){flex:none}
    #tile-help.open .help-item summary{padding:0 14px!important;min-height:0;font-size:min(1.12rem,2.6vh)!important}
    /* M-154 (owner): the Help tile in settings stands out from all the others: bright sky-blue pulsing icon */
    #tile-help .set-ico{outline:3px solid #e0f2fe;outline-offset:-1px;background:radial-gradient(circle at 35% 28%,#e0f2fe,#38bdf8 45%,#1d4ed8)!important;animation:mtHelpGlow 2.2s ease-in-out infinite!important}
    #tile-help .set-title{position:relative;z-index:2;color:#7dd3fc!important;-webkit-text-fill-color:#7dd3fc!important;opacity:1!important;font-weight:900!important;text-shadow:0 2px 0 rgba(0,0,0,.7)!important}
    #tile-help .set-sub{color:#e0f2fe!important}
    @keyframes mtHelpGlow{0%,100%{outline-color:#e0f2fe;outline-offset:-1px}50%{outline-color:#38bdf8;outline-offset:3px}}
    #tile-help.open .set-body{top:0!important;max-height:none!important;height:100vh;height:100dvh;border-radius:0!important;padding-top:calc(10px + env(safe-area-inset-top))!important}
    #mt-guide .g-grid button{padding:15px 8px;border-radius:18px;border:1.5px solid rgba(233,213,255,.45);background:linear-gradient(170deg,rgba(168,85,247,.45),rgba(59,7,100,.6));color:#fff;font-weight:800;font-size:1.05rem;
      box-shadow:inset 0 2px 0 rgba(255,255,255,.3),inset 0 -4px 8px rgba(0,0,0,.35),0 6px 0 rgba(0,0,0,.35),0 10px 18px rgba(0,0,0,.4)}
    #mt-guide .g-grid button:active{transform:translateY(4px)}
    #mt-guide .g-more{margin-top:16px;padding:14px;border-radius:18px;background:rgba(253,230,138,.12);border:1.5px solid rgba(253,230,138,.5);text-align:center}
    #mt-guide .g-m{font-weight:700;color:#fde68a;margin-bottom:10px}
    #mt-guide .g-help{width:100%;padding:13px;border-radius:999px;border:0;background:#fbbf24;color:#422006;font-weight:900;font-size:1.08rem;box-shadow:0 5px 0 #92400e}
    .help-demos{margin:0 0 14px}
    .help-demos .hd-one{width:100%;padding:15px;border-radius:999px;border:0;font-weight:900;font-size:1.1rem;color:#fff;background:radial-gradient(circle at 35% 28%,#c084fc,#7e22ce 60%,#3b0764);box-shadow:0 5px 0 #3b0764,0 10px 18px rgba(0,0,0,.45)}
    .help-demos .hd-t{font-weight:900;font-size:1.1rem;color:#fde68a;margin:2px 4px 10px}
    .help-demos .hd-g{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .help-demos button{padding:14px 8px;border-radius:16px;border:1.5px solid rgba(253,230,138,.55);background:linear-gradient(170deg,rgba(253,230,138,.25),rgba(120,53,15,.35));
      color:#fff;font-weight:800;font-size:1.02rem;box-shadow:inset 0 2px 0 rgba(255,255,255,.3),inset 0 -4px 8px rgba(0,0,0,.35),0 6px 0 rgba(0,0,0,.35),0 10px 18px rgba(0,0,0,.4)}
    .help-demos button:active{transform:translateY(4px)}`;
    document.head.appendChild(css);

    // ---------- the hand ----------
    let hand = null, bubble = null, veil = null, stopBtn = null, running = false, aborted = false;
    let hx = innerWidth / 2, hy = innerHeight * 0.75;
    function ensure() {
        if (hand) return;
        hand = document.createElement('div'); hand.id = 'mt-hand'; hand.innerHTML = '<span class="hd"><span class="hp"><svg viewBox="0 0 100 130" aria-hidden="true"><defs><linearGradient id="mtSk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe9d2"/><stop offset=".45" stop-color="#f8c99c"/><stop offset="1" stop-color="#d4925f"/></linearGradient><linearGradient id="mtSk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdcb8"/><stop offset="1" stop-color="#e0a372"/></linearGradient><radialGradient id="mtHi" cx=".35" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><radialGradient id="mtPad" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#ffe6cf"/><stop offset=".6" stop-color="#f4bd91"/><stop offset="1" stop-color="#d48c5c"/></radialGradient><linearGradient id="mtCuff" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#6366f1"/></linearGradient></defs><g stroke="#9a5f38" stroke-width="1.6" stroke-linejoin="round"><rect x="44" y="104" width="46" height="22" rx="7" fill="url(#mtCuff)" stroke="#1e3a8a"/><rect x="36" y="56" width="58" height="54" rx="20" fill="url(#mtSk)"/><g class="fg f-pin"><g class="fi"><rect x="82" y="60" width="13" height="24" rx="6.5" fill="url(#mtSk2)"/></g></g><g class="fg f-ring"><g class="fi"><rect x="70" y="52" width="15" height="28" rx="7.5" fill="url(#mtSk2)"/></g></g><g class="fg f-mid"><g class="fi"><rect x="56" y="47" width="16" height="31" rx="8" fill="url(#mtSk2)"/></g></g><g class="fg f-idx"><g class="fb"><rect x="38" y="32" width="19" height="39" rx="9.5" fill="url(#mtSk)"/><path d="M41 50 q6 3 13 0" fill="none" stroke="#b97a52" stroke-width="1.2"/><g class="ft"><rect x="38" y="3" width="19" height="40" rx="9.5" fill="url(#mtSk)"/><rect class="nl" x="42" y="6" width="11" height="12" rx="5" fill="#ffe4e6" stroke="#c98a6a" stroke-width="1"/><path d="M41 34 q6 3 13 0" fill="none" stroke="#b97a52" stroke-width="1.2"/><rect x="38" y="3" width="19" height="36" rx="9.5" fill="url(#mtHi)" stroke="none"/><ellipse class="pd" cx="47.5" cy="11" rx="8.6" ry="7.5" fill="url(#mtPad)" stroke="#b97a52" stroke-width="1"/></g></g></g><g class="fg f-thb"><g class="fi"><rect x="18" y="64" width="20" height="38" rx="10" fill="url(#mtSk)" transform="rotate(-38 28 83)"/></g></g></g><rect x="36" y="56" width="58" height="54" rx="20" fill="url(#mtHi)"/></svg></span></span>';
        bubble = document.createElement('div'); bubble.id = 'mt-bubble';
        document.documentElement.append(hand, bubble);
        place(hx, hy, true);
    }
    // the fingertip is near the top middle of the emoji
    function place(x, y, now) {
        hx = x; hy = y;
        if (now) { hand.style.transition = 'none'; requestAnimationFrame(() => { hand.style.transition = ''; }); }
        hand.style.transform = 'translate(' + (x - 40) + 'px,' + (y - 3) + 'px)'; // fingertip of the SVG hand
        if (!bubble) return;
        // M-129: the caption never travels across the screen (it covered things on the way): it fades out while the
        // hand moves and comes back at the new spot when the hand arrives
        if (!now && bubble.classList.contains('on')) {
            bubble.classList.add('mv'); clearTimeout(mvT);
            mvT = setTimeout(() => { setSpot(hy, true); bubble.classList.remove('mv'); }, 1350);
        } else if (!bubble.classList.contains('mv')) setSpot(y, now);
    }
    let mvT = 0;
    // M-129: safety check while a caption shows: if the screen moved under it and it now covers the shown element
    // or the fingertip, it jumps to a free spot
    setInterval(() => {
        if (!bubble || !bubble.classList.contains('on') || bubble.classList.contains('mv')) return;
        const b = bubble.getBoundingClientRect(), hit = q => q.right > b.left && q.left < b.right && q.bottom > b.top && q.top < b.bottom;
        const tip = { left: hx - 6, right: hx + 6, top: hy - 6, bottom: hy + 6 };
        if (hit(tip) || (curEl && curEl.isConnected && hit(curEl.getBoundingClientRect()))) setSpot(hy, true);
    }, 400);
    // hand high -> caption at the bottom; hand low (e.g. "Next") -> caption in the middle, so titles at the top stay visible
    // M-116: caption sits just under the hand (or just above the fingertip when the hand is low), centred on it
    function setSpot(y, now) {
        const x = hx, w = bubble.offsetWidth || 300, h = bubble.offsetHeight || 80, H = innerHeight;
        y = Math.min(Math.max(y, 0), H);
        // M-129: the live rect of the element being shown (it may have scrolled since)
        let r = curEl && curEl.isConnected ? curEl.getBoundingClientRect() : null;
        if (r && !(x >= r.left - 5 && x <= r.right + 5 && y >= r.top - 5 && y <= r.bottom + 5)) r = null;
        const below = Math.max(y + 112, r ? r.bottom + 12 : 0), above = Math.min(y - 16, r ? r.top - 12 : y) - h;
        let by;
        if (below + h <= H - 10) by = below;
        else if (above >= 10) by = above;
        else by = (H - below) > above + h ? H - h - 10 : 10; // no clean room: the side with more space
        by = Math.max(10, Math.min(by, H - h - 10));
        const bx = Math.max(8, Math.min(x - w / 2, innerWidth - w - 8));
        if (now) { bubble.style.transition = 'none'; requestAnimationFrame(() => { bubble.style.transition = ''; }); }
        bubble.style.transform = 'translate(' + Math.round(bx) + 'px,' + Math.round(by) + 'px)';
    }
    let curEl = null; // M-117/M-129: what the hand points at, so the caption never covers it
    function centerOf(el) { const r = el.getBoundingClientRect(); curEl = el; return [r.left + r.width / 2, r.top + Math.min(r.height / 2, 40)]; }
    function visible(el) { const r = el.getBoundingClientRect(); return r.width > 0 && r.top >= 4 && r.bottom <= innerHeight - 4; } // M-113: on screen = no swipe
    function check() { if (aborted) throw new Error('stop'); }

    async function say(text, low) {
        ensure(); check();
        bubble.classList.remove('on'); await sleep(120);
        bubble.textContent = text; setSpot(hy, !bubble.dataset.shown); bubble.dataset.shown = '1'; bubble.classList.add('on');
        if (voiceOn()) speak(text);
    }
    // scroll a far element into view while the hand "swipes" up
    async function bring(el) {
        if (!el || visible(el)) return;
        ensure();
        // M-111: short swipe up from where the hand already is (no trip back to a start point)
        const sy = Math.min(Math.max(hy, innerHeight * 0.45), innerHeight * 0.75);
        if (Math.abs(sy - hy) > 4) { place(hx, sy); await sleep(450); check(); }
        hand.classList.add('press');
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        place(hx, sy - 150);
        await sleep(700); hand.classList.remove('press'); await sleep(200); check();
    }
    async function moveTo(el) {
        ensure(); check();
        if (!el) return;
        await bring(el);
        const [x, y] = centerOf(el);
        place(x, y); await sleep(800); check();
    }
    // M-119: a clear press: the finger bends down, the button sinks a little and a ripple shows, then both come back
    const wait = ms => new Promise(r => setTimeout(r, ms));
    async function press(el) {
        hand.classList.add('press'); vib(10);
        if (el) { el.classList.add('mt-pressed'); }
        await wait(420);
        const r = document.createElement('div'); r.className = 'mt-ripple'; r.style.left = hx + 'px'; r.style.top = hy + 'px';
        document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700);
        await wait(180);
        hand.classList.remove('press'); if (el) el.classList.remove('mt-pressed');
        await wait(260); check();
    }
    async function tap(el, doClick) {
        if (el) await moveTo(el);
        await press(el);
        if (el && doClick) { if (typeof doClick === 'function') doClick(); else el.click(); }
        await sleep(650); check();
    }
    async function type(el, text) {
        await moveTo(el); await tap(null);
        el.value = '';
        for (const ch of text) { check(); el.value += ch; el.dispatchEvent(new Event('input', { bubbles: true })); await sleep(140); }
        try { el.blur(); } catch (e) { }
        await sleep(400);
    }
    async function point(el, text, ms) {
        if (text) await say(text);
        await moveTo(el);
        if (el) { el.classList.add('mt-flash'); await press(el); }
        await sleep(ms || 1600);
        if (el) el.classList.remove('mt-flash');
        check();
    }

    function quiet() { if (bubble) { bubble.classList.remove('on', 'mv'); delete bubble.dataset.shown; } if (hand) hand.classList.remove('bob', 'press'); }
    function hideAll() {
        if (hand) { hand.classList.remove('on', 'bob', 'press'); }
        if (bubble) { bubble.classList.remove('on'); delete bubble.dataset.shown; }
        hush();
        if (veil) { veil.remove(); veil = null; }
        if (stopBtn) { stopBtn.remove(); stopBtn = null; }
        document.querySelectorAll('.mt-flash').forEach(e => e.classList.remove('mt-flash'));
    }

    // ---------- demo runner ----------
    async function run(fn) {
        if (running) return;
        running = true; aborted = false;
        ensure();
        veil = document.createElement('div'); veil.id = 'mt-veil';
        stopBtn = document.createElement('button'); stopBtn.type = 'button'; stopBtn.id = 'mt-stop'; stopBtn.textContent = tx('stop');
        stopBtn.onclick = () => { aborted = true; vib(15); };
        document.documentElement.append(veil, stopBtn);
        place(innerWidth / 2, innerHeight + 40, true);
        hand.classList.add('on');
        try { await fn(); await sleep(900); quiet(); await sleep(250); } catch (e) { if (e && e.message !== 'stop') console.error(e); }
        cleanUp();
        hideAll();
        running = false;
    }
    // leave every screen the demo opened, without saving
    function cleanUp() {
        try { if ($('med-page') && $('med-page').classList.contains('open')) { if (window.mwEditing === undefined) window.mwEditing = null; closeMedPage(); } } catch (e) { }
        try { if (typeof itemRows !== 'undefined' && !window.mwEditing) { itemRows.innerHTML = ''; addItemRow(); if (typeof resetTimeBtn === 'function') resetTimeBtn(); const t = $('med-time'); if (t) t.value = ''; selDays = []; window.mwWk = ''; } } catch (e) { }
        try { closeListPage(); } catch (e) { }
        home(); // M-111: always end on the main screen
    }
    function home() {
        try { closeApptForm(); } catch (e) { }
        try { closeApptPage(); } catch (e) { }
        try { closeTiles(); } catch (e) { }
        try { closeSettingsPage(); } catch (e) { }
        try { closeListPage(); } catch (e) { }
    }

    const demos = {
        async add() {
            home(); await sleep(450);
            await say(tx('a1'), true);
            await tap($('main-add'), true); await sleep(500);
            await say(tx('a2'));
            const row = document.querySelector('#item-rows .item-row:last-child');
            await tap(row && (row.querySelector('.type-btn[data-type=pill]') || row.querySelector('.type-btn')), true); await sleep(500);
            await say(tx('a3'));
            const nm = document.querySelector('#item-rows .item-row:last-child .it-name');
            if (nm) await type(nm, tx('demoMed'));
            await say(tx('a4')); await tap($('mw-next'), true); await sleep(300);
            await say(tx('a5')); await tap($('mw-next'), true); await sleep(300);
            await say(tx('a6')); await tap($('mw-next'), true); await sleep(400);
            await say(tx('a7'));
            const chip = [...document.querySelectorAll('#mw-quick .af-chip')].find(c => (c.textContent || '').includes('08:00')) || document.querySelector('#mw-quick .af-chip');
            await tap(chip, true); await sleep(300);
            await say(tx('a4')); await tap($('mw-next'), true); await sleep(400);
            await say(tx('a8'));
            await point(document.querySelector('#day-row'), null, 1500);
            await tap($('mw-next'), true); await sleep(500);
            await say(tx('a9') + ' ' + tx('demoNote'));
            await tap(document.querySelector('.mw-submit'), false); // pressed for show only
            await sleep(1500);
        },
        async edit() {
            home(); await sleep(450);
            if (!loadMeds().length) { await say(tx('e0')); await sleep(2500); return; }
            await say(tx('e1'), true);
            await tap($('list-btn'), () => openListPage()); await sleep(600);
            await say(tx('e2'));
            await tap(document.querySelector('#med-list .btn-edit'), true); await sleep(700);
            const lines = document.querySelectorAll('.mw-sum-edit .mw-tap');
            await point(lines[0], tx('e3'));
            await point(lines[1], tx('e4'));
            await point(document.querySelector('.mw-add-med'), tx('e5'));
            await say(tx('e6') + ' ' + tx('demoNote'));
            await tap(document.querySelector('.mw-submit'), false);
            await sleep(1300);
            window.mwEditing = null;
        },
        async wk() {
            home(); await sleep(450);
            if (!loadMeds().length) { await say(tx('e0')); await sleep(2500); return; }
            await say(tx('e1'), true);
            await tap($('list-btn'), () => openListPage()); await sleep(600);
            await point($('wk-bar'), tx('w2'), 2400);
            await say(tx('e2'));
            await tap(document.querySelector('#med-list .btn-edit'), true); await sleep(700);
            const box = document.querySelector('.mw-wk-box');
            await point(box && box.querySelector('.wkb-btn'), tx('w1'), 2600);
            await sleep(400);
            window.mwEditing = null;
        },
        async settings() {
            home(); await sleep(450);
            await say(tx('s0'), true);
            const gear = $('gear-btn');
            await tap(gear, () => openSettingsPage()); await sleep(700);
            const tiles = [...document.querySelectorAll('#settings-page .set-tile')].filter(t => t.offsetParent !== null);
            let n = 0;
            for (const t of tiles) {
                const title = (t.querySelector('.set-title') || {}).textContent || '';
                const sub = (t.querySelector('.set-sub') || {}).textContent || '';
                if (!visible(t)) await say(tx('swipe'));
                await point(t.querySelector('.set-ico') || t, (t.querySelector('.set-ico') ? t.querySelector('.set-ico').textContent.trim() + ' ' : '') + title + (sub ? ': ' + sub : ''), 1500);
                if (++n >= 14) break;
            }
            await say(tx('sEnd'));
            await sleep(1800);
            try { const sp = $('settings-page'); sp.scrollTo ? sp.scrollTo({ top: 0, behavior: 'smooth' }) : 0; } catch (e) { }
        }
    };
    // M-135: after a tile opens, the old caption goes and the hand moves to the panel title (not left on the ✕)
    async function openTile(id) {
        const t = $(id);
        await tap(t && t.querySelector('.set-ico'), () => openTileById(id));
        quiet(); await sleep(450);
        const pt = t && t.querySelector('.p-title');
        if (pt && t.classList.contains('open')) await moveTo(pt);
        return t;
    }
    function openTileById(id) { const t = $(id); const h = t && t.querySelector('.set-tile-head'); if (h && !t.classList.contains('open')) toggleTile(h); return t; }
    function tileByTitle(word) { return [...document.querySelectorAll('#settings-page .set-tile')].find(t => ((t.querySelector('.set-title') || {}).textContent || '').includes(word)); }
    Object.assign(demos, {
        async home() {
            home(); await sleep(450);
            await point($('hello-line'), tx('h1'), 1800);
            await point($('main-add'), tx('h2'), 1800);
            await point($('list-btn'), tx('h3'), 1800);
            await point($('appt-btn'), tx('h4'), 1800);
            await point($('relax-btn'), tx('q1'), 1800);
            await point($('lv-btn'), tx('r1'), 2000);
            await point($('gear-btn'), tx('h5'), 1500);
            await point($('exit-btn'), tx('h6'), 2600);
        },
        async appt() {
            home(); await sleep(450);
            await say(tx('p1'), true);
            await tap($('appt-btn'), true); await sleep(600);
            await say(tx('p2'), true);
            await tap(document.querySelector('#appt-page .appt-new'), true); await sleep(700);
            await say(tx('p3'));
            await tap(document.querySelector('#af-types button, #af-types .af-chip'), true);
            if ($('af-doctor')) await type($('af-doctor'), tx('demoDoc'));
            await tap($('wz-next'), true); await sleep(500);
            await say(tx('p4'));
            await tap($('af-tomorrow'), true); await sleep(400);
            await tap($('wz-next'), true); await sleep(600);
            const tq = document.querySelectorAll('#tp-quick .af-chip');
            if (tq.length) await tap(tq[Math.min(1, tq.length - 1)], true);
            await sleep(900);
            await say(tx('p5'));
            await point($('wz-next'), null, 2600);
            quiet(); await sleep(300);
            try { closeApptForm(); closeApptPage(); } catch (e) { }
        },
        async log() {
            home(); await sleep(450);
            await say(tx('l1'), true);
            await tap($('gear-btn'), () => openSettingsPage()); await sleep(700);
            const t = $('tile-log');
            await openTile('tile-log');
            const sm = $('lg-sum'), pdf = $('lg-pdf');
            await point(sm && sm.offsetHeight > 8 ? sm : $('lg-list'), tx('l2'), 2400);
            if (pdf && pdf.offsetParent !== null) await point(pdf, tx('l3'), 2600);
            else { await say(tx('l3')); await sleep(2400); }
            quiet(); await sleep(300);
            try { closeTiles(); } catch (e) { }
        },
        async fam() {
            home(); await sleep(450);
            await say(tx('f1'), true);
            await tap($('gear-btn'), () => openSettingsPage()); await sleep(700);
            const t = $('tile-family');
            await openTile('tile-family');
            // M-131: step by step on the real controls (it used to aim at the panel's close ✕)
            await point($('fm-pick'), tx('f2'), 2600);
            await point($('fm-phone'), tx('f5'), 2200);
            await point($('fm-sw'), tx('f3'), 2400);
            await point($('fm-test'), tx('f4'), 2400);
            quiet(); await sleep(300);
            try { closeTiles(); } catch (e) { }
        },
        async stock() { // M-132
            home(); await sleep(450);
            await say(tx('k1'), true);
            await tap($('gear-btn'), () => openSettingsPage()); await sleep(700);
            const t = $('tile-stock');
            await openTile('tile-stock');
            const card = t && t.querySelector('.st-card');
            await point((card && (card.querySelector('.st-n') || card.querySelector('.mo-btn'))) || $('st-x'), tx('k2'), 2600);
            const sm = card && card.querySelectorAll('.st-sm button');
            if (sm && sm.length > 1) { await point(sm[0], tx('k3'), 2200); await point(sm[1], tx('k4'), 2400); }
            else { await say(tx('k4')); await sleep(2400); }
            quiet(); await sleep(300);
            try { closeTiles(); } catch (e) { }
        },
        async widget() { // M-134
            home(); await sleep(450);
            await say(tx('y1'), true);
            await tap($('gear-btn'), () => openSettingsPage()); await sleep(700);
            const t = $('tile-widget');
            await openTile('tile-widget');
            await point($('wg-go'), tx('y2'), 3000);
            quiet(); await sleep(300);
            try { closeTiles(); } catch (e) { }
        },
        async read() {
            home(); await sleep(450);
            await point($('lv-btn'), tx('r1'), 2400);
            await say(tx('r2'), true);
            await tap($('gear-btn'), () => openSettingsPage()); await sleep(700);
            const head = $('sub-lowVisionTitle') && $('sub-lowVisionTitle').closest('.set-tile');
            await tap(head && head.querySelector('.set-ico'), () => { const h = head.querySelector('.set-tile-head'); if (h) toggleTile(h); });
            quiet(); await sleep(450);
            if (head && head.querySelector('.p-title')) await moveTo(head.querySelector('.p-title'));
            await point(head && head.querySelector('.ts-row'), null, 2600);
            quiet(); await sleep(300);
            try { closeTiles(); } catch (e) { }
        },
        async relax() {
            home(); await sleep(450);
            await point($('relax-btn'), tx('q1'), 2600);
            await say(tx('q2')); await sleep(2000);
        }
    });
    window.mtDemo = name => {
        const f = demos[name]; if (!f) return;
        run(f);
    };

    // ---------- M-110: the guide sheet (from the button on the main screen) ----------
    const LIST = [['home', 'dHome'], ['add', 'dAdd'], ['edit', 'dEdit'], ['wk', 'dWk'], ['appt', 'dAppt'], ['log', 'dLog'], ['fam', 'dFam'], ['stock', 'dStock'], ['widget', 'dWidget'], ['read', 'dRead'], ['relax', 'dRelax'], ['settings', 'dSet']];
    let sheet = null;
    function closeGuide(fromBack) {
        if (!sheet) return;
        const s = sheet; sheet = null; s.classList.remove('in'); setTimeout(() => s.remove(), 250);
        if (fromBack !== true) { try { if (history.state && history.state.guide) history.back(); } catch (e) { } }
    }
    window.addEventListener('popstate', () => { if (sheet) closeGuide(true); }); // phone back button closes the sheet
    window.mtGuide = function () {
        vib(12);
        if (sheet) return;
        sheet = document.createElement('div'); sheet.id = 'mt-guide';
        sheet.dir = li() < 2 ? 'rtl' : 'ltr';
        sheet.innerHTML = '<div class="g-card"><button type="button" class="g-x" aria-label="close">✕</button><div class="g-t"></div><div class="g-s"></div><button type="button" class="g-voice"><span class="gv-t"></span><span class="gv-sw"><i></i></span><b class="gv-st"></b></button><div class="g-grid"></div>' +
            '<div class="g-more"><div class="g-m"></div><button type="button" class="g-help"></button></div></div>';
        sheet.querySelector('.g-t').textContent = tx('gTitle');
        sheet.querySelector('.g-s').textContent = tx('gSub');
        sheet.querySelector('.g-m').textContent = tx('gMore');
        const gv = sheet.querySelector('.g-voice');
        const drawVoice = () => { const on = voiceOn(); gv.classList.toggle('on', on); gv.querySelector('.gv-t').textContent = tx('gVoice'); gv.querySelector('.gv-st').textContent = on ? tx('vOn') : tx('vOff'); };
        drawVoice();
        gv.onclick = () => {
            vib(12); const on = !voiceOn();
            try { localStorage.setItem('medtime_guide_voice', on ? '1' : '0'); } catch (e) { }
            drawVoice(); if (on) speak(tx('gVoice') + '. ' + tx('vOn')); else hush();
        };
        sheet.querySelector('.g-help').textContent = '📖 ' + tx('gOpenHelp');
        LIST.forEach(([k, l]) => {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = tx(l);
            b.onclick = () => { closeGuide(); setTimeout(() => window.mtDemo(k), 280); };
            sheet.querySelector('.g-grid').appendChild(b);
        });
        sheet.querySelector('.g-x').onclick = () => { vib(10); closeGuide(); };
        sheet.onclick = e => { if (e.target === sheet) closeGuide(); };
        sheet.querySelector('.g-help').onclick = () => {
            vib(12); closeGuide();
            try { openSettingsPage(); setTimeout(() => { openTileById('tile-help'); }, 350); } catch (e) { }
        };
        document.documentElement.appendChild(sheet);
        try { history.pushState({ guide: 1 }, ''); } catch (e) { }
        requestAnimationFrame(() => sheet && sheet.classList.add('in'));
    };
    // back button closes the sheet first
    window.mtGuideOpen = () => !!sheet;
    window.mtGuideClose = closeGuide;

    // M-111: a glowing line under the main menu (instead of a round button)
    const gb = document.createElement('button'); gb.type = 'button'; gb.id = 'guide-btn'; gb.className = 'guide-line';
    gb.onclick = () => window.mtGuide();
    const card = document.querySelector('.home-card');
    if (card) card.appendChild(gb); else document.body.appendChild(gb);
    if (typeof fitMain === 'function') setTimeout(fitMain, 50);
    function guideLbl() { gb.innerHTML = '<span class="gl-h">👆</span><span class="gl-t"></span>'; gb.querySelector('.gl-t').textContent = tx('gLine');
        // narrow screen or big text: the short name only
        requestAnimationFrame(() => { const t = gb.querySelector('.gl-t'); if (t && t.scrollWidth > t.clientWidth + 1) t.textContent = tx('gTitle').replace(/^\S+\s/, ''); }); }
    guideLbl();

    // in the Help tile: one button that opens the same guide
    function drawDemoButtons() {
        const list = $('help-list'); if (!list) return;
        let box = document.querySelector('.help-demos');
        if (!box) { box = document.createElement('div'); box.className = 'help-demos'; list.parentNode.insertBefore(box, list); }
        box.innerHTML = '<button type="button" class="hd-one"></button>';
        const b = box.querySelector('button'); b.textContent = tx('gTitle');
        b.onclick = () => { vib(12); try { closeTiles(); closeSettingsPage(); } catch (e) { } setTimeout(() => window.mtGuide(), 300); };
    }
    drawDemoButtons();
    const xr = window.xRender;
    window.xRender = function () { if (xr) xr(); drawDemoButtons(); };
    const lsel = $('lang-select');
    if (lsel) lsel.addEventListener('change', () => setTimeout(() => { drawDemoButtons(); guideLbl(); }, 250));

    // M-109: a word under the exit button
    function exitLbl() {
        const e = $('exit-btn'); if (e && typeof t === 'function') e.dataset.lbl = t('exitShort');
        const g = $('gear-btn'); if (g) g.dataset.lbl = ['הגדרות', 'الإعدادات', 'Setări', 'Réglages', 'Settings', 'Настройки'][li()]; // M-127
    }
    exitLbl(); if (lsel) lsel.addEventListener('change', () => setTimeout(exitLbl, 250));

    // ---------- hint mode (no blocking): the hand bobs over one control, then the next ----------
    let hintTimer = null;
    window.mtHint = function (targets) {
        if (hintTimer) { clearInterval(hintTimer); hintTimer = null; } // keep the hand where it is: it glides to the next control
        const list = (targets || []).filter(Boolean);
        if (!list.length) { window.mtHintOff(); return; }
        ensure();
        let i = 0;
        const go = () => {
            const el = list[i % list.length];
            if (!el || !el.isConnected || running) return;
            const [x, y] = centerOf(el);
            hand.classList.add('on', 'bob');
            place(x, y);
            i++;
        };
        if (!hand.classList.contains('on')) place(innerWidth / 2, innerHeight + 40, true); // first time only
        setTimeout(go, 700); // after the card has slid in
        hintTimer = setInterval(go, list.length > 1 ? 2600 : 1500); // also follows the control if the layout moves
    };
    window.mtHintOff = function () {
        if (hintTimer) { clearInterval(hintTimer); hintTimer = null; }
        if (hand && !running) hand.classList.remove('on', 'bob');
    };
})();
