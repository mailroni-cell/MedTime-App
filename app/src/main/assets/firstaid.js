// M-198 (owner 2026-10-22): first aid. A red button on the main screen opens quick dial (MDA 101, poison center)
// and short steps for common emergencies (overdose, wrong medicine, poisoning, seizure, ...), in all 6 languages.
// Steps follow the usual MDA / poison-center advice: call first when in doubt, the dispatcher guides.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const vib = () => { try { navigator.vibrate && navigator.vibrate(15); } catch (e) { } };
    const N = window.MedTimeNative;
    const MDA = '101', POISON = '047771900', POISON_SHOW = '04-7771900';
    const T = {
        btn: ['עזרה ראשונה', 'إسعاف أولي', 'Prim ajutor', 'Premiers secours', 'First aid', 'Первая помощь'],
        btnSub: ['חיוג מהיר ומה עושים במצב חירום', 'اتصال سريع وماذا تفعل في الطوارئ', 'Apel rapid și ce faci în urgență', 'Appel rapide et que faire en urgence', 'Quick call and what to do in an emergency', 'Быстрый звонок и что делать в экстренной ситуации'],
        title: ['🆘 עזרה ראשונה', '🆘 إسعاف أولي', '🆘 Prim ajutor', '🆘 Premiers secours', '🆘 First aid', '🆘 Первая помощь'],
        mda: ['📞 מד"א 101', '📞 نجمة داود الحمراء 101', '📞 Ambulanța (MDA) 101', '📞 Ambulance (MDA) 101', '📞 Ambulance (MDA) 101', '📞 Скорая (МАДА) 101'],
        poison: ['☎️ מרכז הרעלות', '☎️ مركز السموم', '☎️ Centrul de otrăviri', '☎️ Centre antipoison', '☎️ Poison center', '☎️ Токсикологический центр'],
        pick: ['מה קרה?', 'ماذا حدث؟', 'Ce s-a întâmplat?', 'Que s\'est-il passé ?', 'What happened?', 'Что случилось?'],
        disc: ['בחירום, תמיד חייגו קודם 101. המידע כאן לא מחליף את הנחיות המוקדן או הרופא.', 'في حالة الطوارئ اتصل أولًا دائمًا بـ 101. هذه المعلومات لا تغني عن تعليمات المُرسِل أو الطبيب.', 'În urgență, sună întâi la 101. Aceste informații nu înlocuiesc instrucțiunile dispecerului sau ale medicului.', 'En urgence, appelez toujours d\'abord le 101. Ces informations ne remplacent pas les consignes du régulateur ou du médecin.', 'In an emergency, always call 101 first. This information does not replace the dispatcher\'s or doctor\'s instructions.', 'В экстренной ситуации всегда сначала звоните 101. Эта информация не заменяет указаний диспетчера или врача.'],
        back: ['→ חזרה', '→ رجوع', '← Înapoi', '← Retour', '← Back', '← Назад'],
        close: ['סגירה', 'إغلاق', 'Închide', 'Fermer', 'Close', 'Закрыть']
    };
    // [key, icon, title x6, steps x6 (each a list)]
    const TOPICS = [
        ['overdose', '💊',
            ['לקחתי יותר מדי תרופה', 'تناولت جرعة زائدة من الدواء', 'Am luat prea mult medicament', 'J\'ai pris trop de médicament', 'I took too much medicine', 'Я принял слишком много лекарства'],
            [['ישנוניות קשה, קושי לנשום, בלבול או פרכוס: חייגו מיד 101.', 'אחרת, התקשרו למרכז ההרעלות (24 שעות ביממה).', 'הכינו את האריזה: שם התרופה, כמה נלקח ומתי.', 'אל תגרמו להקאה ואל תיקחו שום דבר "נגדי" בלי הוראה.', 'אל תיקחו את המנה הבאה עד שתקבלו הנחיה.'],
            ['نعاس شديد أو صعوبة في التنفس أو ارتباك أو تشنج: اتصل فورًا بـ 101.', 'وإلا فاتصل بمركز السموم (24 ساعة).', 'جهّز العلبة: اسم الدواء، كم أُخذ ومتى.', 'لا تحاول التقيؤ ولا تتناول أي شيء "مضاد" دون تعليمات.', 'لا تتناول الجرعة التالية حتى تحصل على تعليمات.'],
            ['Somnolență puternică, greutate la respirat, confuzie sau convulsii: sună imediat la 101.', 'Altfel, sună la centrul de otrăviri (non-stop).', 'Pregătește cutia: numele medicamentului, cât s-a luat și când.', 'Nu provoca vărsături și nu lua nimic „contra” fără indicații.', 'Nu lua doza următoare până nu primești indicații.'],
            ['Somnolence forte, difficulté à respirer, confusion ou convulsions : appelez immédiatement le 101.', 'Sinon, appelez le centre antipoison (24 h/24).', 'Préparez la boîte : nom du médicament, quantité prise et heure.', 'Ne faites pas vomir et ne prenez rien « contre » sans avis.', 'Ne prenez pas la dose suivante avant d\'avoir reçu des consignes.'],
            ['Severe drowsiness, trouble breathing, confusion or a seizure: call 101 right away.', 'Otherwise, call the poison center (24 hours a day).', 'Have the box ready: the medicine name, how much was taken and when.', 'Do not make yourself vomit and do not take any "antidote" unless told to.', 'Do not take the next dose until you are told what to do.'],
            ['Сильная сонливость, трудно дышать, спутанность или судороги: сразу звоните 101.', 'Иначе позвоните в токсикологический центр (круглосуточно).', 'Приготовьте упаковку: название лекарства, сколько и когда принято.', 'Не вызывайте рвоту и не принимайте ничего «против» без указаний.', 'Не принимайте следующую дозу, пока не получите указаний.']]],
        ['wrong', '🔄',
            ['לקחתי תרופה לא נכונה', 'تناولت دواءً خاطئًا', 'Am luat medicamentul greșit', 'J\'ai pris le mauvais médicament', 'I took the wrong medicine', 'Я принял не то лекарство'],
            [['אל תיבהלו. רוב הטעויות של מנה אחת אינן מסוכנות, אבל חשוב לבדוק.', 'התקשרו למרכז ההרעלות או לרוקח, עם שתי האריזות: מה נלקח ומה היה צריך לקחת.', 'סחרחורת קשה, קושי לנשום, התעלפות, או פריחה עם נפיחות: 101.', 'אל תיקחו את התרופה הנכונה "להשלמה" בלי לשאול.', 'רשמו מה נלקח ובאיזו שעה.'],
            ['لا تقلق. معظم أخطاء الجرعة الواحدة غير خطيرة، لكن يجب التحقق.', 'اتصل بمركز السموم أو بالصيدلي ومعك العلبتان: ما أُخذ وما كان يجب أخذه.', 'دوخة شديدة أو صعوبة في التنفس أو إغماء أو طفح مع تورم: 101.', 'لا تتناول الدواء الصحيح "للتعويض" دون أن تسأل.', 'سجّل ما أُخذ وفي أي ساعة.'],
            ['Nu te speria. Majoritatea greșelilor de o singură doză nu sunt periculoase, dar trebuie verificat.', 'Sună la centrul de otrăviri sau la farmacist, cu ambele cutii: ce s-a luat și ce trebuia luat.', 'Amețeală puternică, greutate la respirat, leșin sau erupție cu umflare: 101.', 'Nu lua medicamentul corect „ca să compensezi” fără să întrebi.', 'Notează ce s-a luat și la ce oră.'],
            ['Pas de panique. La plupart des erreurs d\'une seule prise ne sont pas graves, mais il faut vérifier.', 'Appelez le centre antipoison ou le pharmacien, avec les deux boîtes : ce qui a été pris et ce qui devait l\'être.', 'Vertige fort, difficulté à respirer, malaise ou éruption avec gonflement : 101.', 'Ne prenez pas le bon médicament « pour compenser » sans demander.', 'Notez ce qui a été pris et à quelle heure.'],
            ['Don\'t panic. Most single-dose mistakes are not dangerous, but it must be checked.', 'Call the poison center or the pharmacist with both boxes: what was taken and what should have been.', 'Severe dizziness, trouble breathing, fainting, or a rash with swelling: 101.', 'Do not take the right medicine "to make up" without asking.', 'Write down what was taken and at what time.'],
            ['Не паникуйте. Большинство ошибок с одной дозой не опасны, но это нужно проверить.', 'Позвоните в токсикологический центр или фармацевту, держа обе упаковки: что принято и что нужно было принять.', 'Сильное головокружение, трудно дышать, обморок или сыпь с отёком: 101.', 'Не принимайте правильное лекарство «в добавку», не спросив.', 'Запишите, что и во сколько было принято.']]],
        ['poison', '🧴',
            ['בליעת חומר ניקוי או רעל', 'ابتلاع مادة تنظيف أو سم', 'Am înghițit un detergent sau o otravă', 'Ingestion d\'un produit ménager ou d\'un poison', 'Swallowed a cleaning product or poison', 'Проглотил моющее средство или яд'],
            [['קושי לנשום, חוסר הכרה או פרכוס: 101 מיד.', 'אל תגרמו להקאה.', 'שטפו את הפה במים וירקו. אל תתנו לשתות הרבה.', 'חומר על העור או בעיניים: לשטוף במים זורמים 15 דקות.', 'התקשרו למרכז ההרעלות כשהאריזה ביד.'],
            ['صعوبة في التنفس أو فقدان الوعي أو تشنج: 101 فورًا.', 'لا تحاول التقيؤ.', 'اغسل الفم بالماء وابصق. لا تشرب كثيرًا.', 'مادة على الجلد أو في العينين: اغسل بماء جارٍ 15 دقيقة.', 'اتصل بمركز السموم والعلبة في يدك.'],
            ['Greutate la respirat, pierderea cunoștinței sau convulsii: 101 imediat.', 'Nu provoca vărsături.', 'Clătește gura cu apă și scuipă. Nu bea multă apă.', 'Substanță pe piele sau în ochi: clătește cu apă curgătoare 15 minute.', 'Sună la centrul de otrăviri cu ambalajul în mână.'],
            ['Difficulté à respirer, perte de connaissance ou convulsions : 101 immédiatement.', 'Ne faites pas vomir.', 'Rincez la bouche à l\'eau et recrachez. Ne faites pas boire beaucoup.', 'Produit sur la peau ou dans les yeux : rincer à l\'eau courante 15 minutes.', 'Appelez le centre antipoison avec l\'emballage en main.'],
            ['Trouble breathing, unconscious or a seizure: 101 right away.', 'Do not make the person vomit.', 'Rinse the mouth with water and spit. Do not give a lot to drink.', 'On the skin or in the eyes: rinse under running water for 15 minutes.', 'Call the poison center with the package in your hand.'],
            ['Трудно дышать, потеря сознания или судороги: сразу 101.', 'Не вызывайте рвоту.', 'Прополощите рот водой и сплюньте. Не давайте много пить.', 'Попало на кожу или в глаза: промывайте проточной водой 15 минут.', 'Позвоните в токсикологический центр, держа упаковку в руках.']]],
        ['seizure', '⚡',
            ['פרכוס', 'نوبة تشنج', 'Criză de convulsii', 'Crise convulsive', 'Seizure', 'Судорожный приступ'],
            [['שמרו על רוגע ומדדו את הזמן.', 'הרחיקו חפצים קשים ושימו משהו רך מתחת לראש.', 'אל תכניסו שום דבר לפה ואל תחזיקו בכוח.', 'כשהפרכוס נגמר: השכיבו על הצד ובדקו שהוא נושם.', 'חייגו 101 אם זה נמשך יותר מ־5 דקות, חוזר שוב, זה פרכוס ראשון, או שהייתה פגיעה.'],
            ['حافظ على هدوئك وانتبه للوقت.', 'أبعد الأشياء الصلبة وضع شيئًا لينًا تحت الرأس.', 'لا تضع أي شيء في الفم ولا تمسكه بالقوة.', 'عندما تنتهي النوبة: ضعه على جنبه وتأكد أنه يتنفس.', 'اتصل بـ 101 إذا استمرت أكثر من 5 دقائق، أو تكررت، أو كانت أول نوبة، أو حدثت إصابة.'],
            ['Păstrează calmul și cronometrează.', 'Îndepărtează obiectele tari și pune ceva moale sub cap.', 'Nu pune nimic în gură și nu ține persoana cu forța.', 'Când criza se termină: întoarce persoana pe o parte și verifică dacă respiră.', 'Sună la 101 dacă durează peste 5 minute, se repetă, e prima criză sau s-a lovit.'],
            ['Restez calme et regardez l\'heure.', 'Écartez les objets durs et mettez quelque chose de doux sous la tête.', 'Ne mettez rien dans la bouche et ne retenez pas la personne de force.', 'Quand la crise s\'arrête : mettez-la sur le côté et vérifiez qu\'elle respire.', 'Appelez le 101 si cela dure plus de 5 minutes, recommence, si c\'est une première crise ou s\'il y a une blessure.'],
            ['Stay calm and time it.', 'Move hard objects away and put something soft under the head.', 'Do not put anything in the mouth and do not hold the person down.', 'When it stops: roll the person onto their side and check they are breathing.', 'Call 101 if it lasts more than 5 minutes, happens again, is a first seizure, or there was an injury.'],
            ['Сохраняйте спокойствие и засеките время.', 'Уберите твёрдые предметы и подложите что-то мягкое под голову.', 'Ничего не кладите в рот и не удерживайте силой.', 'Когда приступ закончится: уложите на бок и проверьте дыхание.', 'Звоните 101, если длится дольше 5 минут, повторяется, это первый приступ или есть травма.']]],
        ['chest', '❤️',
            ['כאב בחזה', 'ألم في الصدر', 'Durere în piept', 'Douleur dans la poitrine', 'Chest pain', 'Боль в груди'],
            [['כאב או לחץ בחזה, שמקרין ליד, ללסת או לגב, עם זיעה, קוצר נשימה או בחילה: חייגו מיד 101.', 'הפסיקו כל מאמץ ושבו במנוחה.', 'אספירין: רק אם מוקדן 101 אומר לכם.', 'אל תנהגו לבד לבית החולים.', 'פתחו את הדלת והכינו את רשימת התרופות (מסך "התזכורות שלי").'],
            ['ألم أو ضغط في الصدر يمتد إلى الذراع أو الفك أو الظهر، مع تعرق أو ضيق تنفس أو غثيان: اتصل فورًا بـ 101.', 'توقف عن أي مجهود واجلس للراحة.', 'الأسبرين: فقط إذا قال لك مُرسِل 101.', 'لا تقد السيارة وحدك إلى المستشفى.', 'افتح الباب وجهّز قائمة الأدوية (شاشة "تذكيراتي").'],
            ['Durere sau apăsare în piept care iradiază în braț, maxilar sau spate, cu transpirație, lipsă de aer sau greață: sună imediat la 101.', 'Oprește orice efort și stai în repaus.', 'Aspirină: doar dacă îți spune dispecerul de la 101.', 'Nu conduce singur la spital.', 'Deschide ușa și pregătește lista de medicamente (ecranul „Mementourile mele”).'],
            ['Douleur ou pression dans la poitrine qui s\'étend au bras, à la mâchoire ou au dos, avec sueurs, essoufflement ou nausée : appelez immédiatement le 101.', 'Arrêtez tout effort et restez assis au repos.', 'Aspirine : seulement si le régulateur du 101 vous le dit.', 'Ne conduisez pas seul jusqu\'à l\'hôpital.', 'Ouvrez la porte et préparez la liste des médicaments (écran « Mes rappels »).'],
            ['Pain or pressure in the chest that spreads to the arm, jaw or back, with sweating, shortness of breath or nausea: call 101 right away.', 'Stop any effort and sit down and rest.', 'Aspirin: only if the 101 dispatcher tells you to.', 'Do not drive yourself to the hospital.', 'Unlock the door and have your medicine list ready ("My reminders" screen).'],
            ['Боль или давление в груди, отдающие в руку, челюсть или спину, с потом, одышкой или тошнотой: сразу звоните 101.', 'Прекратите любую нагрузку, сядьте и отдохните.', 'Аспирин: только если так скажет диспетчер 101.', 'Не садитесь за руль сами, чтобы ехать в больницу.', 'Откройте дверь и приготовьте список лекарств (экран «Мои напоминания»).']]],
        ['stroke', '🧠',
            ['סימנים לשבץ', 'علامات السكتة الدماغية', 'Semne de accident vascular', 'Signes d\'AVC', 'Signs of a stroke', 'Признаки инсульта'],
            [['פנים: צד אחד של הפה צונח כשמחייכים.', 'ידיים: יד אחת נופלת כשמרימים את שתיהן.', 'דיבור: דיבור משובש או לא מובן.', 'בכל אחד מהסימנים: חייגו מיד 101 ורשמו מתי זה התחיל.', 'אל תתנו לאכול, לשתות או לקחת תרופות.'],
            ['الوجه: جانب واحد من الفم يتدلى عند الابتسام.', 'الذراعان: ذراع واحدة تسقط عند رفع الاثنتين.', 'الكلام: كلام متلعثم أو غير مفهوم.', 'عند أي علامة: اتصل فورًا بـ 101 وسجّل متى بدأت.', 'لا تعطه طعامًا أو شرابًا أو أدوية.'],
            ['Fața: un colț al gurii cade la zâmbet.', 'Brațele: un braț cade când le ridici pe amândouă.', 'Vorbirea: vorbire încurcată sau neînțeleasă.', 'La oricare semn: sună imediat la 101 și notează când a început.', 'Nu da de mâncare, de băut sau medicamente.'],
            ['Visage : un côté de la bouche tombe au sourire.', 'Bras : un bras retombe quand on lève les deux.', 'Parole : parole confuse ou incompréhensible.', 'Au moindre signe : appelez immédiatement le 101 et notez l\'heure du début.', 'Ne donnez ni à manger, ni à boire, ni de médicaments.'],
            ['Face: one side of the mouth droops when smiling.', 'Arms: one arm drifts down when both are raised.', 'Speech: slurred or strange speech.', 'Any one of these: call 101 right away and note when it started.', 'Do not give food, drink or medicines.'],
            ['Лицо: один угол рта опускается при улыбке.', 'Руки: одна рука опускается, когда поднимают обе.', 'Речь: невнятная или непонятная.', 'При любом признаке: сразу звоните 101 и запомните, когда это началось.', 'Не давайте есть, пить или лекарства.']]],
        ['allergy', '🐝',
            ['תגובה אלרגית קשה', 'رد فعل تحسسي شديد', 'Reacție alergică gravă', 'Réaction allergique grave', 'Severe allergic reaction', 'Тяжёлая аллергическая реакция'],
            [['נפיחות בשפתיים, בלשון או בגרון, קושי לנשום או סחרחורת: 101 מיד.', 'אם יש מזרק אפינפרין (אפיפן): להזריק בצד החיצוני של הירך.', 'לשכב עם רגליים מורמות. אם קשה לנשום, לשבת.', 'להפסיק את מה שגרם לתגובה (תרופה, מזון, עקיצה).', 'גם אם זה השתפר, צריך בדיקת רופא.'],
            ['تورم في الشفتين أو اللسان أو الحلق، صعوبة في التنفس أو دوخة: 101 فورًا.', 'إذا كان لديك حقنة إبينفرين (إيبيبن): احقنها في الجانب الخارجي من الفخذ.', 'استلقِ مع رفع الساقين. إذا صعب التنفس، اجلس.', 'أوقف ما سبب التفاعل (دواء، طعام، لسعة).', 'حتى لو تحسنت الحالة، يلزم فحص طبيب.'],
            ['Umflarea buzelor, limbii sau gâtului, greutate la respirat sau amețeală: 101 imediat.', 'Dacă ai stilou de epinefrină (EpiPen): injectează în partea exterioară a coapsei.', 'Întinde-te cu picioarele ridicate. Dacă respiri greu, stai așezat.', 'Oprește ce a cauzat reacția (medicament, mâncare, înțepătură).', 'Chiar dacă s-a ameliorat, e nevoie de un consult medical.'],
            ['Gonflement des lèvres, de la langue ou de la gorge, difficulté à respirer ou vertige : 101 immédiatement.', 'Si vous avez un stylo d\'adrénaline (EpiPen) : injectez sur la face externe de la cuisse.', 'Allongez-vous jambes surélevées. Si respirer est difficile, restez assis.', 'Arrêtez ce qui a causé la réaction (médicament, aliment, piqûre).', 'Même si cela va mieux, il faut voir un médecin.'],
            ['Swelling of the lips, tongue or throat, trouble breathing or dizziness: 101 right away.', 'If there is an epinephrine pen (EpiPen): inject into the outer thigh.', 'Lie down with legs raised. If breathing is hard, sit up.', 'Stop whatever caused it (medicine, food, sting).', 'Even if it gets better, see a doctor.'],
            ['Отёк губ, языка или горла, трудно дышать или головокружение: сразу 101.', 'Если есть шприц-ручка адреналина (EpiPen): уколите в наружную сторону бедра.', 'Лягте с поднятыми ногами. Если трудно дышать, сядьте.', 'Прекратите то, что вызвало реакцию (лекарство, еда, укус).', 'Даже если стало лучше, нужен осмотр врача.']]],
        ['faint', '😵',
            ['התעלפות', 'إغماء', 'Leșin', 'Malaise / évanouissement', 'Fainting', 'Обморок'],
            [['השכיבו על הגב והרימו את הרגליים.', 'שחררו בגדים צמודים ודאגו לאוויר.', 'לא מתעורר תוך דקה, או לא נושם: 101. המוקדן ינחה אתכם.', 'אחרי שמתעורר: לשבת לאט ולשתות מים.', 'התעלפות אחרי תרופה חדשה, או עם כאב בחזה: לפנות לרופא.'],
            ['ضعه على ظهره وارفع ساقيه.', 'فكّ الملابس الضيقة ووفّر الهواء.', 'إذا لم يستيقظ خلال دقيقة أو لا يتنفس: 101. سيرشدك المُرسِل.', 'بعد أن يستيقظ: يجلس ببطء ويشرب ماء.', 'إغماء بعد دواء جديد أو مع ألم في الصدر: راجع الطبيب.'],
            ['Întinde persoana pe spate și ridică-i picioarele.', 'Desfă hainele strâmte și asigură aer.', 'Nu se trezește într-un minut sau nu respiră: 101. Dispecerul te va ghida.', 'După ce se trezește: să stea jos încet și să bea apă.', 'Leșin după un medicament nou sau cu durere în piept: mergi la medic.'],
            ['Allongez la personne sur le dos et surélevez ses jambes.', 'Desserrez les vêtements serrés et donnez de l\'air.', 'Pas de réveil en une minute, ou ne respire pas : 101. Le régulateur vous guidera.', 'Après le réveil : s\'asseoir lentement et boire de l\'eau.', 'Malaise après un nouveau médicament ou avec douleur thoracique : consultez un médecin.'],
            ['Lay the person on their back and raise their legs.', 'Loosen tight clothes and let in fresh air.', 'Not awake within a minute, or not breathing: 101. The dispatcher will guide you.', 'Once awake: sit up slowly and drink water.', 'Fainting after a new medicine, or with chest pain: see a doctor.'],
            ['Уложите на спину и поднимите ноги.', 'Ослабьте тесную одежду и обеспечьте приток воздуха.', 'Не приходит в себя за минуту или не дышит: 101. Диспетчер подскажет, что делать.', 'Когда придёт в себя: медленно сесть и выпить воды.', 'Обморок после нового лекарства или с болью в груди: обратитесь к врачу.']]],
        ['sugar', '🍬',
            ['סוכר נמוך', 'انخفاض السكر', 'Zahăr scăzut (hipoglicemie)', 'Hypoglycémie', 'Low blood sugar', 'Низкий сахар'],
            [['סימנים: רעד, זיעה, רעב, בלבול או דפיקות לב.', 'אם ער ויכול לבלוע: 3 עד 4 כפיות סוכר במים, או חצי כוס מיץ ממותק.', 'אחרי 15 דקות: למדוד שוב. אם עדיין נמוך, לחזור על זה.', 'אחר כך לאכול משהו, למשל פרוסת לחם.', 'מחוסר הכרה או לא יכול לבלוע: לא לתת לאכול, ולחייג 101.'],
            ['العلامات: رجفة، تعرق، جوع، ارتباك أو خفقان.', 'إذا كان واعيًا ويستطيع البلع: 3 إلى 4 ملاعق صغيرة سكر في ماء، أو نصف كوب عصير محلّى.', 'بعد 15 دقيقة: قِس مرة أخرى. إذا بقي منخفضًا، كرّر.', 'ثم تناول شيئًا، مثل شريحة خبز.', 'فاقد للوعي أو لا يستطيع البلع: لا تعطه طعامًا، واتصل بـ 101.'],
            ['Semne: tremur, transpirație, foame, confuzie sau palpitații.', 'Dacă e treaz și poate înghiți: 3-4 lingurițe de zahăr în apă sau o jumătate de pahar de suc îndulcit.', 'După 15 minute: măsoară din nou. Dacă e tot scăzut, repetă.', 'Apoi mănâncă ceva, de exemplu o felie de pâine.', 'Inconștient sau nu poate înghiți: nu-i da de mâncare și sună la 101.'],
            ['Signes : tremblements, sueurs, faim, confusion ou palpitations.', 'S\'il est éveillé et peut avaler : 3 à 4 cuillères à café de sucre dans de l\'eau, ou un demi-verre de jus sucré.', 'Après 15 minutes : mesurez à nouveau. Si c\'est encore bas, recommencez.', 'Ensuite, mangez quelque chose, par exemple une tranche de pain.', 'Inconscient ou ne peut pas avaler : ne rien donner à manger, appelez le 101.'],
            ['Signs: shaking, sweating, hunger, confusion or a racing heart.', 'If awake and able to swallow: 3 to 4 teaspoons of sugar in water, or half a glass of sweet juice.', 'After 15 minutes: measure again. If still low, repeat.', 'Then eat something, such as a slice of bread.', 'Unconscious or unable to swallow: give nothing by mouth, call 101.'],
            ['Признаки: дрожь, пот, голод, спутанность или сердцебиение.', 'Если в сознании и может глотать: 3–4 чайные ложки сахара в воде или полстакана сладкого сока.', 'Через 15 минут: измерьте снова. Если всё ещё низкий, повторите.', 'Потом поешьте, например кусок хлеба.', 'Без сознания или не может глотать: ничего не давать в рот, звонить 101.']]],
        ['choke', '🫁',
            ['חנק', 'اختناق', 'Sufocare (înec cu mâncare)', 'Étouffement', 'Choking', 'Подавился (удушье)'],
            [['אם יכול להשתעל: עודדו שיעול חזק.', 'לא יכול לדבר או לנשום: 5 מכות חזקות בגב, בין השכמות.', 'אחר כך 5 לחיצות בטן (היימליך). לחזור לסירוגין.', 'מאבד הכרה: 101 מיד, והמוקדן ינחה החייאה.', 'אחרי חנק צריך בדיקת רופא.'],
            ['إذا كان يستطيع السعال: شجّعه على السعال بقوة.', 'لا يستطيع الكلام أو التنفس: 5 ضربات قوية على الظهر بين لوحي الكتف.', 'ثم 5 ضغطات على البطن (هايمليك). كرّر بالتناوب.', 'إذا فقد الوعي: 101 فورًا، وسيرشدك المُرسِل للإنعاش.', 'بعد الاختناق يلزم فحص طبيب.'],
            ['Dacă poate tuși: încurajează-l să tușească puternic.', 'Nu poate vorbi sau respira: 5 lovituri puternice pe spate, între omoplați.', 'Apoi 5 compresii abdominale (Heimlich). Alternează.', 'Își pierde cunoștința: 101 imediat, dispecerul te ghidează pentru resuscitare.', 'După sufocare e nevoie de un consult medical.'],
            ['S\'il peut tousser : encouragez-le à tousser fort.', 'Ne peut ni parler ni respirer : 5 claques fortes dans le dos, entre les omoplates.', 'Puis 5 compressions abdominales (Heimlich). Alternez.', 'Perte de connaissance : 101 immédiatement, le régulateur guidera la réanimation.', 'Après un étouffement, il faut voir un médecin.'],
            ['If they can cough: encourage strong coughing.', 'Cannot speak or breathe: 5 firm back blows between the shoulder blades.', 'Then 5 abdominal thrusts (Heimlich). Keep alternating.', 'If they pass out: 101 right away, the dispatcher will guide CPR.', 'After choking, see a doctor.'],
            ['Если может кашлять: пусть сильно кашляет.', 'Не может говорить или дышать: 5 сильных ударов по спине между лопатками.', 'Затем 5 толчков в живот (Геймлих). Чередуйте.', 'Теряет сознание: сразу 101, диспетчер подскажет реанимацию.', 'После удушья нужен осмотр врача.']]],
        ['fall', '🦴',
            ['נפילה', 'سقوط', 'Cădere', 'Chute', 'A fall', 'Падение'],
            [['אל תמהרו לקום. בדקו כאב, דימום וחולשה.', 'כאב חזק בירך או בגב, מכה בראש, או נוטל מדללי דם: 101.', 'אם אפשר: להתגלגל לצד, לעבור לברכיים ולקום לאט בעזרת כיסא.', 'אחרי מכה בראש: לשים לב 24 שעות לבלבול, הקאות וכאב ראש.', 'ספרו לרופא. נפילה יכולה להיות קשורה לתרופות.'],
            ['لا تستعجل في النهوض. افحص الألم والنزيف والضعف.', 'ألم شديد في الورك أو الظهر، ضربة على الرأس، أو يتناول مميعات الدم: 101.', 'إن أمكن: تدحرج على جنبك، ثم على ركبتيك وانهض ببطء بمساعدة كرسي.', 'بعد ضربة على الرأس: راقب 24 ساعة الارتباك والتقيؤ والصداع.', 'أخبر الطبيب. قد يكون السقوط مرتبطًا بالأدوية.'],
            ['Nu te grăbi să te ridici. Verifică durerea, sângerarea și slăbiciunea.', 'Durere puternică la șold sau spate, lovitură la cap sau iei anticoagulante: 101.', 'Dacă poți: rostogolește-te pe o parte, treci în genunchi și ridică-te încet sprijinit de un scaun.', 'După o lovitură la cap: urmărește 24 de ore confuzia, vărsăturile și durerea de cap.', 'Spune-i medicului. Căderea poate avea legătură cu medicamentele.'],
            ['Ne vous relevez pas trop vite. Vérifiez douleur, saignement et faiblesse.', 'Douleur forte à la hanche ou au dos, choc à la tête, ou prise d\'anticoagulants : 101.', 'Si possible : roulez sur le côté, passez à genoux et relevez-vous lentement en vous aidant d\'une chaise.', 'Après un choc à la tête : surveillez 24 h confusion, vomissements et maux de tête.', 'Parlez-en au médecin. Une chute peut être liée aux médicaments.'],
            ['Don\'t rush to get up. Check for pain, bleeding and weakness.', 'Severe hip or back pain, a blow to the head, or taking blood thinners: 101.', 'If you can: roll onto your side, get onto your knees and stand up slowly using a chair.', 'After a blow to the head: watch for 24 hours for confusion, vomiting and headache.', 'Tell your doctor. A fall can be linked to medicines.'],
            ['Не спешите вставать. Проверьте боль, кровотечение и слабость.', 'Сильная боль в бедре или спине, удар головой или приём разжижающих кровь: 101.', 'Если можете: перекатитесь на бок, встаньте на колени и медленно поднимитесь, опираясь на стул.', 'После удара головой: 24 часа следите за спутанностью, рвотой и головной болью.', 'Скажите врачу. Падение может быть связано с лекарствами.']]]
    ];
    const tx = k => (T[k] || [])[li()] || (T[k] || [])[0] || k;

    const css = document.createElement('style');
    css.textContent = `
    .fa-bg{position:fixed!important;left:0!important;right:0!important;top:0!important;bottom:0!important;z-index:9650!important;background:#0f172a!important;display:flex!important;justify-content:center;margin:0!important;padding:0!important}
    .fa-sh{width:100%;max-width:560px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;background:linear-gradient(180deg,#3f0d12,#0f172a 55%);color:#fff;padding:calc(14px + env(safe-area-inset-top)) 16px calc(12px + env(safe-area-inset-bottom))}
    .fa-t{font-size:1.45rem;font-weight:800;margin:2px 0 10px}
    .fa-calls{display:flex;flex-direction:column;gap:8px;margin-bottom:10px}
    .fa-calls button{min-height:58px;border-radius:16px;border:none;color:#fff;font-size:1.25rem;font-weight:800;font-family:inherit}
    .fa-calls .c1{background:linear-gradient(135deg,#ef4444,#b91c1c);box-shadow:0 5px 0 #7f1d1d;min-height:66px;font-size:1.45rem}
    .fa-calls .c2{background:linear-gradient(135deg,#f59e0b,#b45309);box-shadow:0 4px 0 #78350f;font-size:1.1rem}
    .fa-calls button:active{transform:translateY(3px)}
    .fa-h{color:#fecaca;font-weight:800;margin:4px 0 6px}
    .fa-body{flex:1 1 auto;overflow:auto;min-height:60px}
    .fa-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .fa-grid button{display:flex;align-items:center;gap:8px;min-height:58px;text-align:start;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);color:#fff;font-size:1rem;font-weight:800;padding:8px 10px;font-family:inherit}
    .fa-grid i{font-style:normal;font-size:1.5rem}
    .fa-steps{margin:0;padding:0;list-style:none;counter-reset:s}
    .fa-steps li{counter-increment:s;position:relative;padding:10px 12px;padding-inline-start:46px;margin-bottom:8px;border-radius:14px;background:rgba(255,255,255,.07);font-size:1.15rem;line-height:1.45}
    .fa-steps li::before{content:counter(s);position:absolute;inset-inline-start:10px;top:10px;width:26px;height:26px;border-radius:50%;background:#ef4444;display:grid;place-items:center;font-weight:800;font-size:.95rem}
    .fa-steps li.hot{background:rgba(239,68,68,.22);border:1px solid rgba(248,113,113,.6)}
    .fa-disc{color:#cbd5e1;font-size:.88rem;margin:8px 0 4px}
    .fa-btns{display:flex;gap:10px;margin-top:6px}
    .fa-btns button{flex:1;min-height:50px;border-radius:14px;border:none;color:#fff;background:#334155;font-size:1.1rem;font-weight:800;font-family:inherit}
    #fa-home{display:flex;align-items:center;gap:12px;width:100%;min-height:58px;border-radius:999px;padding:5px 18px 5px 8px;border:2px solid rgba(254,202,202,.75);margin-top:10px;
        background:linear-gradient(135deg,#ef4444,#b91c1c);color:#fff;box-shadow:0 5px 0 #7f1d1d,0 9px 22px rgba(239,68,68,.4),inset 0 2px 0 rgba(255,255,255,.3);text-align:start;font:inherit}
    #fa-home:active{transform:translateY(3px);box-shadow:0 2px 0 #7f1d1d}
    #fa-home .fah-ico{flex:0 0 46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:1.5rem;background:radial-gradient(circle at 35% 28%,#fff,#fecaca 45%,#dc2626)}
    #fa-home .fah-txt{display:flex;flex-direction:column;line-height:1.2}
    #fa-home b{font-size:1.2rem;font-weight:800}#fa-home small{font-size:.85rem;opacity:.92}
    html.fit4 #fa-home{min-height:48px;margin-top:8px}html.fit4 #fa-home .fah-ico{flex-basis:38px;height:38px}
    html.fit6 #fa-home small{display:none}`;
    document.head.appendChild(css);

    function call(num) { vib(); if (N && typeof N.dial === 'function') N.dial(num); else location.href = 'tel:' + num; }
    function open() {
        vib();
        const bg = document.createElement('div'); bg.className = 'fa-bg';
        const sh = document.createElement('div'); sh.className = 'fa-sh'; bg.appendChild(sh); document.body.appendChild(bg);
        let topic = null;
        const unBack = window.mtBackPush ? mtBackPush(() => { if (topic) { topic = null; draw(); return true; } close(); return false; }) : null;
        const close = () => { bg.remove(); if (unBack) unBack(); };
        const draw = () => {
            const i = li();
            sh.innerHTML = `<div class="fa-t"></div><div class="fa-calls"><button type="button" class="c1"></button><button type="button" class="c2"></button></div>
                <div class="fa-body"><div class="fa-h"></div><div class="fa-in"></div><div class="fa-disc"></div></div><div class="fa-btns"></div>`;
            const q = c => sh.querySelector(c);
            q('.c1').textContent = tx('mda'); q('.c1').onclick = () => call(MDA);
            q('.c2').textContent = tx('poison') + ' '; const pn = document.createElement('span'); pn.dir = 'ltr'; pn.style.whiteSpace = 'nowrap'; pn.textContent = POISON_SHOW; q('.c2').appendChild(pn); q('.c2').onclick = () => call(POISON);
            q('.fa-disc').textContent = tx('disc');
            const btns = q('.fa-btns'), inn = q('.fa-in');
            if (!topic) {
                q('.fa-t').textContent = tx('title'); q('.fa-h').textContent = tx('pick');
                const g = document.createElement('div'); g.className = 'fa-grid';
                TOPICS.forEach(tp => {
                    const b = document.createElement('button'); b.type = 'button';
                    b.innerHTML = '<i></i><span></span>'; b.querySelector('i').textContent = tp[1]; b.querySelector('span').textContent = tp[2][i];
                    b.onclick = () => { vib(); topic = tp; draw(); };
                    g.appendChild(b);
                });
                inn.appendChild(g);
            } else {
                q('.fa-t').textContent = topic[1] + ' ' + topic[2][i]; q('.fa-h').remove();
                const ol = document.createElement('ol'); ol.className = 'fa-steps';
                topic[3][i].forEach(s => { const x = document.createElement('li'); x.textContent = s; if (/101/.test(s)) x.className = 'hot'; ol.appendChild(x); });
                inn.appendChild(ol);
                const bb = document.createElement('button'); bb.type = 'button'; bb.textContent = tx('back'); bb.onclick = () => { topic = null; draw(); };
                btns.appendChild(bb);
            }
            const cb = document.createElement('button'); cb.type = 'button'; cb.textContent = tx('close'); cb.onclick = close;
            btns.appendChild(cb);
            q('.fa-body').scrollTop = 0;
        };
        draw();
    }
    window.mtFirstAid = open;

    (function homeBtn() {
        const after = document.getElementById('sb-home') || document.getElementById('main-add');
        if (!after || document.getElementById('fa-home')) return;
        const b = document.createElement('button'); b.type = 'button'; b.id = 'fa-home';
        b.innerHTML = '<span class="fah-ico"><i>🆘</i></span><span class="fah-txt"><b></b><small></small></span>';
        const txt = () => { b.querySelector('b').textContent = tx('btn'); b.querySelector('small').textContent = tx('btnSub'); };
        txt(); b.onclick = open;
        after.parentNode.insertBefore(b, after.nextSibling);
        const pr = window.moreRender; window.moreRender = function () { if (pr) pr(); txt(); };
        if (typeof window.fitMain === 'function') setTimeout(window.fitMain, 100);
    })();
})();
