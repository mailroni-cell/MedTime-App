// M-195 (owner): medicine dictionary. Type (or scan) a medicine name and get a short, plain explanation of what it is for,
// by its active ingredient group, in 6 languages, plus the official approved use from the Ministry of Health registry and a
// link to the official page with the leaflets. General information only, never a replacement for the doctor or pharmacist.
// Used by subst.js (main-screen button "Check a medicine"). window.mtDict(entry) -> {cat, text, warn} or null.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    // [he, ar, ro, fr, en, ru]: what it is for | (optional) what to watch for
    const CAT = {
        pain: [['משכך כאבים ומוריד חום.', 'مسكّن للألم وخافض للحرارة.', 'Calmează durerea și scade febra.', 'Soulage la douleur et fait baisser la fièvre.', 'Relieves pain and lowers fever.', 'Снимает боль и снижает температуру.'],
            ['לא לעבור את המינון היומי המותר.', 'لا تتجاوز الجرعة اليومية المسموح بها.', 'Nu depășiți doza zilnică permisă.', 'Ne dépassez pas la dose quotidienne autorisée.', 'Do not take more than the daily dose allowed.', 'Не превышайте допустимую суточную дозу.']],
        nsaid: [['משכך כאבים, מפחית דלקת ומוריד חום.', 'يسكّن الألم ويخفف الالتهاب ويخفض الحرارة.', 'Calmează durerea, reduce inflamația și febra.', 'Soulage la douleur, l\'inflammation et la fièvre.', 'Relieves pain, inflammation and fever.', 'Снимает боль, воспаление и жар.'],
            ['לקחת עם אוכל. עלול לגרות את הקיבה.', 'يؤخذ مع الطعام. قد يهيّج المعدة.', 'Se ia cu mâncare. Poate irita stomacul.', 'À prendre en mangeant. Peut irriter l\'estomac.', 'Take with food. It may irritate the stomach.', 'Принимать во время еды. Может раздражать желудок.']],
        opioid: [['משכך כאבים חזק (אופיואיד).', 'مسكّن قوي للألم (أفيوني).', 'Analgezic puternic (opioid).', 'Antidouleur puissant (opioïde).', 'A strong pain reliever (opioid).', 'Сильное обезболивающее (опиоид).'],
            ['עלול לגרום לישנוניות ולעצירות. לא לנהוג ולא לשתות אלכוהול.', 'قد يسبب النعاس والإمساك. لا تقد السيارة ولا تشرب الكحول.', 'Poate da somnolență și constipație. Nu conduceți, fără alcool.', 'Peut causer somnolence et constipation. Ne conduisez pas, pas d\'alcool.', 'May cause drowsiness and constipation. Do not drive or drink alcohol.', 'Может вызывать сонливость и запор. Не водите машину, без алкоголя.']],
        diab: [['מוריד את רמת הסוכר בדם (סוכרת).', 'يخفض مستوى السكر في الدم (السكري).', 'Scade glicemia (diabet).', 'Fait baisser le sucre dans le sang (diabète).', 'Lowers blood sugar (diabetes).', 'Снижает сахар в крови (диабет).'],
            ['לשים לב לסימני סוכר נמוך: רעד, הזעה, חולשה.', 'انتبه لعلامات انخفاض السكر: رجفة، تعرّق، ضعف.', 'Atenție la semnele de glicemie mică: tremur, transpirație, slăbiciune.', 'Attention aux signes d\'hypoglycémie : tremblements, sueurs, faiblesse.', 'Watch for signs of low sugar: shaking, sweating, weakness.', 'Следите за признаками низкого сахара: дрожь, пот, слабость.']],
        statin: [['מוריד כולסטרול ושומנים בדם ושומר על הלב וכלי הדם.', 'يخفض الكوليسترول والدهون في الدم ويحمي القلب والأوعية.', 'Scade colesterolul și protejează inima și vasele.', 'Fait baisser le cholestérol et protège le cœur et les vaisseaux.', 'Lowers cholesterol and protects the heart and blood vessels.', 'Снижает холестерин и защищает сердце и сосуды.'],
            ['לספר לרופא על כאבי שרירים לא רגילים.', 'أخبر الطبيب عن آلام عضلية غير عادية.', 'Spuneți medicului de dureri musculare neobișnuite.', 'Signalez au médecin des douleurs musculaires inhabituelles.', 'Tell the doctor about unusual muscle pain.', 'Сообщите врачу о необычных болях в мышцах.']],
        anticoag: [['מדלל דם: מונע קרישי דם ושבץ.', 'مميّع للدم: يمنع الجلطات والسكتة.', 'Subțiază sângele: previne cheagurile și accidentul vascular.', 'Fluidifie le sang : prévient les caillots et l\'AVC.', 'A blood thinner: prevents clots and stroke.', 'Разжижает кровь: предотвращает тромбы и инсульт.'],
            ['לשים לב לדימום חריג. לספר לכל רופא ורופא שיניים.', 'انتبه لأي نزيف غير عادي. أخبر كل طبيب وطبيب أسنان.', 'Atenție la sângerări neobișnuite. Spuneți fiecărui medic și dentist.', 'Attention aux saignements inhabituels. Prévenez chaque médecin et dentiste.', 'Watch for unusual bleeding. Tell every doctor and dentist.', 'Следите за необычными кровотечениями. Сообщайте каждому врачу и стоматологу.']],
        antiplate: [['מונע היצמדות טסיות וקרישי דם, למשל אחרי התקף לב או צנתור.', 'يمنع تكتّل الصفائح والجلطات، مثلاً بعد نوبة قلبية أو قسطرة.', 'Previne cheagurile (antiagregant), de ex. după infarct sau stent.', 'Empêche les caillots (antiagrégant), par ex. après un infarctus ou un stent.', 'Prevents blood clots (antiplatelet), e.g. after a heart attack or stent.', 'Предотвращает тромбы (антиагрегант), например после инфаркта или стента.'],
            ['לשים לב לדימום חריג. לא להפסיק בלי רופא.', 'انتبه لأي نزيف غير عادي. لا توقفه دون الطبيب.', 'Atenție la sângerări. Nu opriți fără medic.', 'Attention aux saignements. N\'arrêtez pas sans le médecin.', 'Watch for unusual bleeding. Do not stop without the doctor.', 'Следите за кровотечениями. Не прекращайте без врача.']],
        aspirin: [['בכמות נמוכה (אספירין) מונע קרישי דם; בכמות גבוהה משכך כאבים.', 'بجرعة منخفضة يمنع الجلطات، وبجرعة عالية يسكّن الألم.', 'În doză mică previne cheagurile; în doză mare calmează durerea.', 'À faible dose, prévient les caillots ; à forte dose, soulage la douleur.', 'In a low dose it prevents blood clots; in a high dose it relieves pain.', 'В малой дозе предотвращает тромбы, в большой снимает боль.'],
            ['עלול לגרות את הקיבה ולהגביר דימום.', 'قد يهيّج المعدة ويزيد النزيف.', 'Poate irita stomacul și crește sângerarea.', 'Peut irriter l\'estomac et augmenter les saignements.', 'May irritate the stomach and increase bleeding.', 'Может раздражать желудок и усиливать кровотечения.']],
        bp: [['מוריד לחץ דם ושומר על הלב והכליות.', 'يخفض ضغط الدم ويحمي القلب والكلى.', 'Scade tensiunea și protejează inima și rinichii.', 'Fait baisser la tension et protège le cœur et les reins.', 'Lowers blood pressure and protects the heart and kidneys.', 'Снижает давление и защищает сердце и почки.'],
            ['לקום לאט: עלולה להיות סחרחורת.', 'انهض ببطء: قد تشعر بدوخة.', 'Ridicați-vă încet: poate apărea amețeala.', 'Levez-vous lentement : vertiges possibles.', 'Stand up slowly: it may cause dizziness.', 'Вставайте медленно: возможно головокружение.']],
        beta: [['מאט את קצב הלב ומוריד לחץ דם.', 'يبطئ نبض القلب ويخفض ضغط الدم.', 'Încetinește inima și scade tensiunea.', 'Ralentit le cœur et fait baisser la tension.', 'Slows the heart rate and lowers blood pressure.', 'Замедляет пульс и снижает давление.'],
            ['לא להפסיק בבת אחת.', 'لا توقفه فجأة.', 'Nu opriți brusc.', 'N\'arrêtez pas brutalement.', 'Do not stop suddenly.', 'Не прекращайте резко.']],
        diuretic: [['משתן: מוציא נוזלים עודפים מהגוף ומוריד לחץ דם.', 'مدرّ للبول: يخرج السوائل الزائدة ويخفض الضغط.', 'Diuretic: elimină lichidele în exces și scade tensiunea.', 'Diurétique : élimine l\'excès d\'eau et fait baisser la tension.', 'A water pill: removes extra fluid and lowers blood pressure.', 'Мочегонное: выводит лишнюю жидкость и снижает давление.'],
            ['עדיף לקחת בבוקר. לשתות לפי הנחיית הרופא.', 'يفضّل أخذه صباحاً. اشرب حسب تعليمات الطبيب.', 'De preferat dimineața. Beți cât vă spune medicul.', 'De préférence le matin. Buvez selon l\'avis du médecin.', 'Best taken in the morning. Drink as your doctor advises.', 'Лучше принимать утром. Пейте по указанию врача.']],
        heart: [['עוזר ללב לעבוד טוב יותר (אי ספיקת לב).', 'يساعد القلب على العمل بشكل أفضل (قصور القلب).', 'Ajută inima să lucreze mai bine (insuficiență cardiacă).', 'Aide le cœur à mieux fonctionner (insuffisance cardiaque).', 'Helps the heart work better (heart failure).', 'Помогает сердцу работать лучше (сердечная недостаточность).'], null],
        rhythm: [['מסדיר את קצב הלב (הפרעות קצב).', 'ينظّم ضربات القلب (اضطراب النظم).', 'Reglează ritmul inimii (aritmie).', 'Régule le rythme du cœur (arythmie).', 'Regulates the heartbeat (arrhythmia).', 'Регулирует ритм сердца (аритмия).'], null],
        adhd: [['משפר קשב וריכוז (הפרעת קשב, ADHD).', 'يحسّن الانتباه والتركيز (اضطراب نقص الانتباه).', 'Îmbunătățește atenția și concentrarea (ADHD).', 'Améliore l\'attention et la concentration (TDAH).', 'Improves attention and focus (ADHD).', 'Улучшает внимание и концентрацию (СДВГ).'],
            ['עלול להפחית תיאבון ולהפריע לשינה.', 'قد يقلل الشهية ويؤثر على النوم.', 'Poate scădea pofta de mâncare și tulbura somnul.', 'Peut couper l\'appétit et gêner le sommeil.', 'May reduce appetite and disturb sleep.', 'Может снижать аппетит и мешать сну.']],
        antidep: [['טיפול בדיכאון ובחרדה.', 'علاج الاكتئاب والقلق.', 'Tratează depresia și anxietatea.', 'Traite la dépression et l\'anxiété.', 'Treats depression and anxiety.', 'Лечит депрессию и тревогу.'],
            ['ההשפעה מורגשת אחרי כמה שבועות. לא להפסיק בבת אחת.', 'يظهر التأثير بعد بضعة أسابيع. لا توقفه فجأة.', 'Efectul apare după câteva săptămâni. Nu opriți brusc.', 'L\'effet apparaît après quelques semaines. N\'arrêtez pas brutalement.', 'It takes a few weeks to work. Do not stop suddenly.', 'Действует через несколько недель. Не прекращайте резко.']],
        antipsych: [['טיפול במצבים נפשיים כמו סכיזופרניה או הפרעה דו־קוטבית.', 'علاج حالات نفسية مثل الفصام أو الاضطراب ثنائي القطب.', 'Tratează afecțiuni psihice precum schizofrenia sau tulburarea bipolară.', 'Traite des troubles psychiques comme la schizophrénie ou le trouble bipolaire.', 'Treats mental health conditions such as schizophrenia or bipolar disorder.', 'Лечит психические расстройства, например шизофрению или биполярное расстройство.'],
            ['עלול לגרום לישנוניות ולעלייה במשקל.', 'قد يسبب النعاس وزيادة الوزن.', 'Poate da somnolență și creștere în greutate.', 'Peut causer somnolence et prise de poids.', 'May cause drowsiness and weight gain.', 'Может вызывать сонливость и прибавку веса.']],
        calm: [['מרגיע חרדה או עוזר לשינה.', 'يهدّئ القلق أو يساعد على النوم.', 'Calmează anxietatea sau ajută la somn.', 'Calme l\'anxiété ou aide à dormir.', 'Calms anxiety or helps you sleep.', 'Успокаивает тревогу или помогает уснуть.'],
            ['גורם לישנוניות ועלול ליצור תלות. בלי אלכוהול ובלי נהיגה.', 'يسبب النعاس وقد يسبب الاعتماد. بلا كحول وبلا قيادة.', 'Dă somnolență și poate crea dependență. Fără alcool, fără condus.', 'Rend somnolent et peut créer une dépendance. Pas d\'alcool, pas de conduite.', 'Causes drowsiness and can be habit-forming. No alcohol, no driving.', 'Вызывает сонливость и может вызывать зависимость. Без алкоголя и вождения.']],
        epilepsy: [['מונע התקפים (אפילפסיה). חלק מהתרופות גם מייצבות מצב רוח.', 'يمنع النوبات (الصرع). بعضها يثبّت المزاج أيضاً.', 'Previne crizele (epilepsie). Unele stabilizează și dispoziția.', 'Prévient les crises (épilepsie). Certains stabilisent aussi l\'humeur.', 'Prevents seizures (epilepsy). Some also steady the mood.', 'Предотвращает приступы (эпилепсия). Некоторые также стабилизируют настроение.'],
            ['לא להפסיק בבת אחת.', 'لا توقفه فجأة.', 'Nu opriți brusc.', 'N\'arrêtez pas brutalement.', 'Do not stop suddenly.', 'Не прекращайте резко.']],
        nerve: [['מקל על כאבים שמקורם בעצבים.', 'يخفف آلام الأعصاب.', 'Calmează durerile de nerv.', 'Soulage les douleurs d\'origine nerveuse.', 'Relieves nerve pain.', 'Снимает нервную боль.'],
            ['עלול לגרום לסחרחורת ולישנוניות.', 'قد يسبب الدوخة والنعاس.', 'Poate da amețeală și somnolență.', 'Peut causer vertiges et somnolence.', 'May cause dizziness and drowsiness.', 'Может вызывать головокружение и сонливость.']],
        antibiotic: [['אנטיביוטיקה נגד זיהומים של חיידקים.', 'مضاد حيوي ضد الالتهابات البكتيرية.', 'Antibiotic împotriva infecțiilor bacteriene.', 'Antibiotique contre les infections bactériennes.', 'An antibiotic for bacterial infections.', 'Антибиотик против бактериальных инфекций.'],
            ['לסיים את כל הטיפול גם אם מרגישים טוב.', 'أكمل العلاج كاملاً حتى لو شعرت بتحسن.', 'Terminați tot tratamentul, chiar dacă vă simțiți bine.', 'Terminez tout le traitement, même si vous allez mieux.', 'Finish the whole course, even if you feel better.', 'Пройдите весь курс, даже если стало лучше.']],
        antifungal: [['טיפול בזיהומי פטריות.', 'علاج الالتهابات الفطرية.', 'Tratează infecțiile cu ciuperci.', 'Traite les infections à champignons.', 'Treats fungal infections.', 'Лечит грибковые инфекции.'], null],
        antiviral: [['טיפול בזיהומים של נגיפים (וירוסים), כמו הרפס, צהבת או HIV.', 'علاج الالتهابات الفيروسية مثل الهربس أو التهاب الكبد أو HIV.', 'Tratează infecții virale, precum herpes, hepatită sau HIV.', 'Traite des infections virales, comme l\'herpès, l\'hépatite ou le VIH.', 'Treats viral infections such as herpes, hepatitis or HIV.', 'Лечит вирусные инфекции: герпес, гепатит или ВИЧ.'], null],
        stomach: [['מפחית חומצה בקיבה: לצרבת ולכיב.', 'يقلل حموضة المعدة: للحرقة والقرحة.', 'Scade aciditatea gastrică: pentru arsuri și ulcer.', 'Réduit l\'acidité de l\'estomac : brûlures et ulcère.', 'Reduces stomach acid: for heartburn and ulcers.', 'Снижает кислотность желудка: от изжоги и язвы.'],
            ['בדרך כלל לוקחים חצי שעה לפני האוכל.', 'يؤخذ عادة قبل الطعام بنصف ساعة.', 'De obicei cu o jumătate de oră înainte de masă.', 'En général une demi-heure avant le repas.', 'Usually taken half an hour before a meal.', 'Обычно за полчаса до еды.']],
        allergy: [['מקל על תסמיני אלרגיה: עיטושים, גרד, פריחה.', 'يخفف أعراض الحساسية: العطس، الحكة، الطفح.', 'Calmează alergia: strănut, mâncărime, urticarie.', 'Soulage l\'allergie : éternuements, démangeaisons, urticaire.', 'Relieves allergy: sneezing, itching, hives.', 'Снимает аллергию: чихание, зуд, сыпь.'],
            ['חלק מהתרופות גורמות לישנוניות.', 'بعضها يسبب النعاس.', 'Unele dau somnolență.', 'Certains rendent somnolent.', 'Some cause drowsiness.', 'Некоторые вызывают сонливость.']],
        lungs: [['פותח את דרכי הנשימה או מונע התקפי אסטמה ו־COPD.', 'يوسّع مجاري التنفس أو يمنع نوبات الربو والانسداد الرئوي.', 'Deschide căile respiratorii sau previne crizele de astm și BPOC.', 'Ouvre les bronches ou prévient les crises d\'asthme et de BPCO.', 'Opens the airways or prevents asthma and COPD attacks.', 'Расширяет бронхи или предотвращает приступы астмы и ХОБЛ.'],
            ['אחרי משאף עם סטרואיד לשטוף את הפה.', 'بعد البخاخ الذي يحوي ستيرويد اشطف الفم.', 'După inhalatorul cu cortizon clătiți gura.', 'Après un inhalateur à la cortisone, rincez-vous la bouche.', 'Rinse your mouth after a steroid inhaler.', 'После ингалятора с гормоном прополощите рот.']],
        steroid: [['סטרואיד (קורטיזון) שמפחית דלקת ואלרגיה.', 'ستيرويد (كورتيزون) يخفف الالتهاب والحساسية.', 'Cortizon: reduce inflamația și alergia.', 'Corticoïde : réduit l\'inflammation et l\'allergie.', 'A steroid (cortisone) that reduces inflammation and allergy.', 'Гормон (кортизон), снимает воспаление и аллергию.'],
            ['אחרי שימוש ממושך לא להפסיק בבת אחת.', 'بعد استعمال طويل لا توقفه فجأة.', 'După folosire îndelungată nu opriți brusc.', 'Après un long usage, n\'arrêtez pas brutalement.', 'After long use, do not stop suddenly.', 'После долгого приёма не прекращайте резко.']],
        thyroid: [['הורמון של בלוטת התריס (מחליף הורמון חסר).', 'هرمون الغدة الدرقية (تعويض نقص الهرمون).', 'Hormon tiroidian (înlocuiește hormonul lipsă).', 'Hormone thyroïdienne (remplace l\'hormone manquante).', 'Thyroid hormone (replaces a missing hormone).', 'Гормон щитовидной железы (замещает недостающий).'],
            ['לקחת בבוקר על קיבה ריקה, חצי שעה לפני האוכל.', 'يؤخذ صباحاً على معدة فارغة، قبل الطعام بنصف ساعة.', 'Dimineața, pe stomacul gol, cu o jumătate de oră înainte de masă.', 'Le matin à jeun, une demi-heure avant le repas.', 'Take in the morning on an empty stomach, half an hour before food.', 'Утром натощак, за полчаса до еды.']],
        cold: [['מקל על תסמיני הצטננות: אף סתום, נזלת או שיעול.', 'يخفف أعراض الزكام: انسداد الأنف أو السعال.', 'Calmează răceala: nas înfundat sau tuse.', 'Soulage le rhume : nez bouché ou toux.', 'Relieves cold symptoms: blocked nose or cough.', 'Облегчает простуду: заложенный нос или кашель.'],
            ['תרופות לאף סתום עלולות להעלות לחץ דם. טיפות לאף רק כמה ימים.', 'أدوية انسداد الأنف قد ترفع الضغط. قطرات الأنف لأيام قليلة فقط.', 'Decongestionantele pot crește tensiunea. Picăturile de nas doar câteva zile.', 'Les décongestionnants peuvent augmenter la tension. Gouttes nasales quelques jours seulement.', 'Decongestants may raise blood pressure. Use nose drops for a few days only.', 'Сосудосуживающие могут повышать давление. Капли в нос только несколько дней.']],
        female: [['הורמון נשי: למניעת היריון או לטיפול בגיל המעבר.', 'هرمون أنثوي: لمنع الحمل أو لعلاج سن اليأس.', 'Hormon feminin: contracepție sau menopauză.', 'Hormone féminine : contraception ou ménopause.', 'A female hormone: for birth control or menopause.', 'Женский гормон: контрацепция или менопауза.'],
            ['לא מתאים למעשנות מעל גיל 35 בלי בירור עם הרופא.', 'غير مناسب للمدخّنات فوق 35 دون استشارة الطبيب.', 'Nu pentru fumătoare peste 35 de ani fără medic.', 'Déconseillé aux fumeuses de plus de 35 ans sans avis médical.', 'Not for smokers over 35 without the doctor\'s advice.', 'Не для курящих старше 35 лет без врача.']],
        prostate: [['מקל על מתן שתן כשהערמונית מוגדלת.', 'يسهّل التبول عند تضخم البروستاتا.', 'Ușurează urinarea la prostată mărită.', 'Facilite la miction en cas de prostate élargie.', 'Eases urination with an enlarged prostate.', 'Облегчает мочеиспускание при увеличенной простате.'],
            ['לקום לאט: עלולה להיות סחרחורת.', 'انهض ببطء: قد تشعر بدوخة.', 'Ridicați-vă încet: poate apărea amețeala.', 'Levez-vous lentement : vertiges possibles.', 'Stand up slowly: it may cause dizziness.', 'Вставайте медленно: возможно головокружение.']],
        bladder: [['מרגיע שלפוחית רגיזה (דחיפות ותכיפות במתן שתן).', 'يهدّئ المثانة مفرطة النشاط (إلحاح وتكرار التبول).', 'Calmează vezica hiperactivă (urinări urgente și dese).', 'Calme la vessie hyperactive (envies urgentes et fréquentes).', 'Calms an overactive bladder (urgent, frequent urination).', 'Успокаивает гиперактивный мочевой пузырь.'], null],
        ed: [['טיפול בבעיות זקפה (חלק גם ליתר לחץ דם ריאתי).', 'علاج ضعف الانتصاب (وبعضها لارتفاع ضغط الرئة).', 'Tratează disfuncția erectilă (unele și hipertensiunea pulmonară).', 'Traite les troubles de l\'érection (certains aussi l\'hypertension pulmonaire).', 'Treats erectile problems (some also lung blood pressure).', 'Лечит эректильную дисфункцию (некоторые и лёгочную гипертензию).'],
            ['אסור יחד עם ניטרטים (תרופות ללב בתחושת לחץ בחזה).', 'ممنوع مع النترات (أدوية ألم الصدر).', 'Interzis împreună cu nitrații (medicamente pentru angină).', 'Interdit avec les nitrates (médicaments de l\'angine).', 'Never together with nitrates (chest pain medicines).', 'Нельзя вместе с нитратами (средства от стенокардии).']],
        dementia: [['עוזר לזיכרון ולחשיבה בדמנציה (אלצהיימר).', 'يساعد الذاكرة والتفكير في الخرف (ألزهايمر).', 'Ajută memoria și gândirea în demență (Alzheimer).', 'Aide la mémoire et la pensée dans la démence (Alzheimer).', 'Helps memory and thinking in dementia (Alzheimer\'s).', 'Помогает памяти и мышлению при деменции (Альцгеймер).'], null],
        parkinson: [['מקל על תסמיני פרקינסון (רעד ונוקשות).', 'يخفف أعراض باركنسون (الرجفة والتيبّس).', 'Calmează simptomele Parkinson (tremor și rigiditate).', 'Soulage les symptômes de Parkinson (tremblements, raideur).', 'Eases Parkinson\'s symptoms (tremor and stiffness).', 'Облегчает симптомы Паркинсона (дрожь, скованность).'],
            ['לקחת בשעות קבועות.', 'يؤخذ في أوقات ثابتة.', 'Luați-l la ore fixe.', 'À prendre à heures fixes.', 'Take it at fixed times.', 'Принимайте в одно и то же время.']],
        migraine: [['עוצר התקף מיגרנה.', 'يوقف نوبة الشقيقة.', 'Oprește criza de migrenă.', 'Arrête la crise de migraine.', 'Stops a migraine attack.', 'Снимает приступ мигрени.'], null],
        nausea: [['מונע בחילות והקאות.', 'يمنع الغثيان والتقيؤ.', 'Previne greața și vărsăturile.', 'Prévient les nausées et les vomissements.', 'Prevents nausea and vomiting.', 'Предотвращает тошноту и рвоту.'], null],
        digest: [['מקל על בעיות עיכול: שלשול, עצירות או גזים.', 'يخفف مشاكل الهضم: الإسهال أو الإمساك أو الغازات.', 'Ajută digestia: diaree, constipație sau balonare.', 'Soulage la digestion : diarrhée, constipation ou gaz.', 'Eases digestive problems: diarrhea, constipation or gas.', 'Облегчает пищеварение: диарея, запор или газы.'], null],
        ibd: [['טיפול במחלות מעי דלקתיות (קרוהן, קוליטיס).', 'علاج أمراض الأمعاء الالتهابية (كرون، التهاب القولون).', 'Tratează bolile inflamatorii intestinale (Crohn, colită).', 'Traite les maladies inflammatoires de l\'intestin (Crohn, colite).', 'Treats inflammatory bowel disease (Crohn\'s, colitis).', 'Лечит воспалительные заболевания кишечника (Крона, колит).'], null],
        vitamin: [['ויטמין או מינרל: תוסף לגוף.', 'فيتامين أو معدن: مكمّل للجسم.', 'Vitamină sau mineral: supliment.', 'Vitamine ou minéral : complément.', 'A vitamin or mineral supplement.', 'Витамин или минерал: добавка.'], null],
        skin: [['טיפול בעור: אקנה, פסוריאזיס או דלקת.', 'علاج الجلد: حب الشباب أو الصدفية أو الالتهاب.', 'Tratament pentru piele: acnee, psoriazis sau inflamație.', 'Soin de la peau : acné, psoriasis ou inflammation.', 'Skin treatment: acne, psoriasis or inflammation.', 'Лечение кожи: акне, псориаз или воспаление.'],
            ['חלק מהתכשירים אסורים בהיריון.', 'بعضها ممنوع أثناء الحمل.', 'Unele sunt interzise în sarcină.', 'Certains sont interdits pendant la grossesse.', 'Some are not allowed in pregnancy.', 'Некоторые запрещены при беременности.']],
        eye: [['טיפות עיניים לגלאוקומה: מורידות את הלחץ בעין.', 'قطرات للعين للزرق: تخفض ضغط العين.', 'Picături pentru glaucom: scad presiunea din ochi.', 'Gouttes pour le glaucome : baissent la pression de l\'œil.', 'Eye drops for glaucoma: lower the pressure in the eye.', 'Глазные капли от глаукомы: снижают давление в глазу.'], null],
        bone: [['מחזק את העצמות (אוסטאופורוזיס).', 'يقوّي العظام (هشاشة العظام).', 'Întărește oasele (osteoporoză).', 'Renforce les os (ostéoporose).', 'Strengthens the bones (osteoporosis).', 'Укрепляет кости (остеопороз).'], null],
        immune: [['תרופה שמווסתת את מערכת החיסון, למחלות דלקתיות כמו פסוריאזיס, דלקת מפרקים, קרוהן או טרשת נפוצה.', 'دواء ينظّم جهاز المناعة لأمراض التهابية مثل الصدفية والتهاب المفاصل وكرون والتصلب المتعدد.', 'Reglează sistemul imunitar în boli inflamatorii: psoriazis, artrită, Crohn sau scleroză multiplă.', 'Régule le système immunitaire dans des maladies inflammatoires : psoriasis, arthrite, Crohn ou sclérose en plaques.', 'Calms the immune system in inflammatory diseases such as psoriasis, arthritis, Crohn\'s or MS.', 'Регулирует иммунитет при воспалительных болезнях: псориаз, артрит, Крона или рассеянный склероз.'],
            ['להודיע לרופא על כל זיהום או חום.', 'أبلغ الطبيب عن أي عدوى أو حرارة.', 'Anunțați medicul la orice infecție sau febră.', 'Signalez au médecin toute infection ou fièvre.', 'Tell the doctor about any infection or fever.', 'Сообщайте врачу о любой инфекции или температуре.']],
        cancer: [['טיפול במחלת הסרטן או בגידולים, בהשגחת רופא מומחה.', 'علاج للسرطان أو الأورام، بإشراف طبيب مختص.', 'Tratament pentru cancer, sub supravegherea medicului specialist.', 'Traitement du cancer, sous surveillance d\'un spécialiste.', 'A cancer treatment, given under a specialist\'s care.', 'Лечение рака под наблюдением врача-специалиста.'], null],
        transplant: [['מונע דחייה של איבר מושתל ומרגיע את מערכת החיסון.', 'يمنع رفض العضو المزروع ويهدّئ المناعة.', 'Previne respingerea organului transplantat.', 'Prévient le rejet d\'un organe greffé.', 'Prevents rejection of a transplanted organ.', 'Предотвращает отторжение пересаженного органа.'],
            ['צריך בדיקות דם קבועות.', 'يحتاج فحوص دم منتظمة.', 'Necesită analize de sânge regulate.', 'Nécessite des prises de sang régulières.', 'Needs regular blood tests.', 'Нужны регулярные анализы крови.']],
        smoking: [['עוזר להפסיק לעשן.', 'يساعد على الإقلاع عن التدخين.', 'Ajută la renunțarea la fumat.', 'Aide à arrêter de fumer.', 'Helps you quit smoking.', 'Помогает бросить курить.'], null],
        antiseptic: [['מחטא את העור, הפה או פצעים.', 'يطهّر الجلد أو الفم أو الجروح.', 'Dezinfectează pielea, gura sau rănile.', 'Désinfecte la peau, la bouche ou les plaies.', 'Disinfects the skin, mouth or wounds.', 'Дезинфицирует кожу, рот или раны.'], null],
        numb: [['הרדמה מקומית: מאלחש כאב באזור מסוים.', 'تخدير موضعي: يخدّر الألم في منطقة محددة.', 'Anestezic local: amorțește o zonă.', 'Anesthésique local : endort une zone.', 'A local anesthetic: numbs one area.', 'Местный анестетик: обезболивает участок.'], null],
        anemia: [['מעודד ייצור כדוריות דם אדומות (אנמיה, מחלת כליות).', 'يحفّز إنتاج خلايا الدم الحمراء (فقر الدم، أمراض الكلى).', 'Stimulează globulele roșii (anemie, boli de rinichi).', 'Stimule les globules rouges (anémie, maladie rénale).', 'Boosts red blood cells (anemia, kidney disease).', 'Стимулирует эритроциты (анемия, болезни почек).'], null],
        lungbp: [['טיפול ביתר לחץ דם ריאתי.', 'علاج ارتفاع ضغط الدم الرئوي.', 'Tratează hipertensiunea pulmonară.', 'Traite l\'hypertension pulmonaire.', 'Treats high blood pressure in the lungs.', 'Лечит лёгочную гипертензию.'], null],
        fibrosis: [['מאט צלקות בריאות (פיברוזיס ריאתי).', 'يبطئ تليّف الرئة.', 'Încetinește fibroza pulmonară.', 'Ralentit la fibrose pulmonaire.', 'Slows lung scarring (pulmonary fibrosis).', 'Замедляет фиброз лёгких.'], null],
        cf: [['טיפול בסיסטיק פיברוזיס.', 'علاج التليف الكيسي.', 'Tratează fibroza chistică.', 'Traite la mucoviscidose.', 'Treats cystic fibrosis.', 'Лечит муковисцидоз.'], null],
        muscle: [['מרפה שרירים נוקשים (ספסטיות).', 'يرخي العضلات المتيبّسة.', 'Relaxează mușchii rigizi.', 'Détend les muscles raides.', 'Relaxes stiff muscles.', 'Расслабляет напряжённые мышцы.'],
            ['עלול לגרום לישנוניות.', 'قد يسبب النعاس.', 'Poate da somnolență.', 'Peut rendre somnolent.', 'May cause drowsiness.', 'Может вызывать сонливость.']],
        liver: [['עוזר לזרימת המרה ולכבד, וממיס אבני מרה.', 'يساعد تدفق الصفراء والكبد ويذيب حصى المرارة.', 'Ajută fluxul bilei și ficatul; dizolvă calculii biliari.', 'Aide la bile et le foie ; dissout les calculs biliaires.', 'Helps bile flow and the liver; dissolves gallstones.', 'Помогает оттоку желчи и печени; растворяет камни.'], null],
        hormone_m: [['הורמון גברי (טסטוסטרון).', 'هرمون ذكري (تستوستيرون).', 'Hormon masculin (testosteron).', 'Hormone masculine (testostérone).', 'Male hormone (testosterone).', 'Мужской гормон (тестостерон).'], null],
        sleep_aid: [['עוזר להירדם; חלק גם נגד בחילות בהיריון.', 'يساعد على النوم؛ وبعضه ضد غثيان الحمل.', 'Ajută la adormire; unele și pentru greața din sarcină.', 'Aide à s\'endormir ; certains contre les nausées de grossesse.', 'Helps you fall asleep; some also for pregnancy nausea.', 'Помогает уснуть; некоторые от тошноты беременных.'],
            ['גורם לישנוניות. לא לנהוג.', 'يسبب النعاس. لا تقد.', 'Dă somnolență. Nu conduceți.', 'Rend somnolent. Ne conduisez pas.', 'Causes drowsiness. Do not drive.', 'Вызывает сонливость. Не водите.']]
    };
    const MAP = {
        pain: 'PARACETAMOL DIPYRONE',
        nsaid: 'IBUPROFEN DICLOFENAC ETORICOXIB ETODOLAC NAPROXEN CELECOXIB MELOXICAM KETOPROFEN INDOMETHACIN NAPROXEN SODIUM',
        opioid: 'FENTANYL OXYCODONE TRAMADOL CODEINE MORPHINE BUPRENORPHINE TAPENTADOL HYDROMORPHONE METHADONE',
        diab: 'METFORMIN SITAGLIPTIN LINAGLIPTIN VILDAGLIPTIN SAXAGLIPTIN ALOGLIPTIN GLIMEPIRIDE GLICLAZIDE PIOGLITAZONE DAPAGLIFLOZIN EMPAGLIFLOZIN CANAGLIFLOZIN ERTUGLIFLOZIN SEMAGLUTIDE TIRZEPATIDE LIRAGLUTIDE DULAGLUTIDE REPAGLINIDE INSULIN LISPRO INSULIN GLARGINE INSULIN ASPART INSULIN DEGLUDEC INSULIN DETEMIR INSULIN GLULISINE INSULIN HUMAN',
        statin: 'ROSUVASTATIN ATORVASTATIN SIMVASTATIN PRAVASTATIN FLUVASTATIN PITAVASTATIN EZETIMIBE FENOFIBRATE BEZAFIBRATE EVOLOCUMAB ALIROCUMAB INCLISIRAN BEMPEDOIC ACID',
        anticoag: 'RIVAROXABAN APIXABAN EDOXABAN DABIGATRAN ETEXILATE WARFARIN ENOXAPARIN HEPARIN',
        antiplate: 'TICAGRELOR CLOPIDOGREL PRASUGREL',
        aspirin: 'ACETYLSALICYLIC ACID',
        bp: 'VALSARTAN LOSARTAN CANDESARTAN IRBESARTAN TELMISARTAN OLMESARTAN AMLODIPINE LERCANIDIPINE NIFEDIPINE FELODIPINE ENALAPRIL RAMIPRIL LISINOPRIL PERINDOPRIL DILTIAZEM VERAPAMIL DOXAZOSIN MINOXIDIL',
        beta: 'BISOPROLOL METOPROLOL ATENOLOL PROPRANOLOL CARVEDILOL NEBIVOLOL',
        diuretic: 'HYDROCHLOROTHIAZIDE FUROSEMIDE SPIRONOLACTONE INDAPAMIDE CHLORTALIDONE EPLERENONE',
        heart: 'SACUBITRIL/VALSARTAN AS SODIUM SALT COMPLEX DIGOXIN IVABRADINE',
        rhythm: 'FLECAINIDE AMIODARONE PROPAFENONE DRONEDARONE',
        adhd: 'METHYLPHENIDATE LISDEXAMFETAMINE AMPHETAMINE SULFATE DEXTROAMPHETAMINE SULFATE DEXTROAMPHETAMINE SACCHARATE AMPHETAMINE ASPARTATE MONOHYDRATE ATOMOXETINE DEXMETHYLPHENIDATE',
        antidep: 'ESCITALOPRAM SERTRALINE CITALOPRAM FLUOXETINE PAROXETINE FLUVOXAMINE DULOXETINE VENLAFAXINE DESVENLAFAXINE VORTIOXETINE BUPROPION MIRTAZAPINE TRAZODONE AGOMELATINE',
        antipsych: 'QUETIAPINE RISPERIDONE OLANZAPINE ARIPIPRAZOLE PALIPERIDONE HALOPERIDOL ZIPRASIDONE BREXPIPRAZOLE ZUCLOPENTHIXOL CLOZAPINE LURASIDONE CARIPRAZINE ILOPERIDONE LITHIUM',
        calm: 'ALPRAZOLAM CLONAZEPAM DIAZEPAM LORAZEPAM OXAZEPAM BROTIZOLAM ZOPICLONE ZOLPIDEM',
        epilepsy: 'LEVETIRACETAM LAMOTRIGINE LACOSAMIDE VALPROIC ACID CARBAMAZEPINE OXCARBAZEPINE TOPIRAMATE PERAMPANEL BRIVARACETAM CENOBAMATE RUFINAMIDE PHENYTOIN',
        nerve: 'PREGABALIN GABAPENTIN',
        antibiotic: 'AMOXICILLIN CLAVULANIC ACID AZITHROMYCIN CLARITHROMYCIN CIPROFLOXACIN LEVOFLOXACIN MOXIFLOXACIN OFLOXACIN CEFUROXIME CEFALEXIN CLINDAMYCIN METRONIDAZOLE DOXYCYCLINE FOSFOMYCIN NITROFURANTOIN SULFAMETHOXAZOLE TRIMETHOPRIM PHENOXYMETHYLPENICILLIN FUSIDIC ACID MUPIROCIN',
        antifungal: 'CLOTRIMAZOLE FLUCONAZOLE TERBINAFINE MICONAZOLE BIFONAZOLE CICLOPIROX NYSTATIN ITRACONAZOLE KETOCONAZOLE',
        antiviral: 'ACICLOVIR VALACICLOVIR FAMCICLOVIR OSELTAMIVIR EMTRICITABINE TENOFOVIR DISOPROXIL TENOFOVIR ALAFENAMIDE DOLUTEGRAVIR LAMIVUDINE ENTECAVIR RILPIVIRINE BICTEGRAVIR',
        stomach: 'OMEPRAZOLE ESOMEPRAZOLE PANTOPRAZOLE LANSOPRAZOLE RABEPRAZOLE FAMOTIDINE',
        allergy: 'LORATADINE DESLORATADINE CETIRIZINE LEVOCETIRIZINE FEXOFENADINE DIMETINDENE CHLORPHENIRAMINE PROMETHAZINE AZELASTINE BILASTINE RUPATADINE HYDROXYZINE',
        lungs: 'FORMOTEROL SALBUTAMOL SALMETEROL VILANTEROL UMECLIDINIUM TIOTROPIUM IPRATROPIUM BROMIDE GLYCOPYRRONIUM INDACATEROL MONTELUKAST THEOPHYLLINE BUDESONIDE MICRONIZED BECLOMETASONE',
        steroid: 'PREDNISOLONE PREDNISONE DEXAMETHASONE METHYLPREDNISOLONE HYDROCORTISONE BETAMETHASONE TRIAMCINOLONE BUDESONIDE FLUTICASONE MOMETASONE CLOBETASOL',
        thyroid: 'LEVOTHYROXINE',
        cold: 'PSEUDOEPHEDRINE PHENYLEPHRINE XYLOMETAZOLINE OXYMETAZOLINE DEXTROMETHORPHAN GUAIFENESIN CARBOCISTEINE ACETYLCYSTEINE AMBROXOL GUAIACOLSULFONATE TETRYZOLINE',
        female: 'ESTRADIOL ETHINYLESTRADIOL DROSPIRENONE LEVONORGESTREL DESOGESTREL GESTODENE NORETHISTERONE PROGESTERONE DIENOGEST',
        prostate: 'TAMSULOSIN ALFUZOSIN SILODOSIN DUTASTERIDE FINASTERIDE',
        bladder: 'MIRABEGRON SOLIFENACIN FESOTERODINE TROSPIUM OXYBUTYNIN TOLTERODINE',
        ed: 'SILDENAFIL TADALAFIL VARDENAFIL',
        dementia: 'DONEPEZIL RIVASTIGMINE MEMANTINE GALANTAMINE',
        parkinson: 'LEVODOPA CARBIDOPA ENTACAPONE PRAMIPEXOLE ROPINIROLE RASAGILINE SAFINAMIDE OPICAPONE',
        migraine: 'SUMATRIPTAN ELETRIPTAN RIZATRIPTAN ZOLMITRIPTAN NARATRIPTAN FREMANEZUMAB GALCANEZUMAB ERENUMAB RIMEGEPANT',
        nausea: 'ONDANSETRON PALONOSETRON METOCLOPRAMIDE DOMPERIDONE GRANISETRON',
        digest: 'LOPERAMIDE SIMETHICONE POLYETHYLENE GLYCOL 3350 BISMUTH SUBSALICYLATE LACTULOSE BISACODYL SENNOSIDES MACROGOL',
        ibd: 'MESALAZINE',
        vitamin: 'FOLIC ACID PYRIDOXINE (VIT B6) CYANOCOBALAMIN (VIT B12) THIAMINE (VIT B1) COLECALCIFEROL ASCORBIC ACID CALCIUM CARBONATE IRON FERROUS ZINC ZINC SULFATE MAGNESIUM CARBONATE FISH OIL',
        skin: 'BENZOYL PEROXIDE ADAPALENE TRETINOIN ISOTRETINOIN CALCIPOTRIOL SALICYLIC ACID',
        eye: 'TIMOLOL LATANOPROST BIMATOPROST TRAVOPROST DORZOLAMIDE BRINZOLAMIDE BRIMONIDINE',
        bone: 'DENOSUMAB ZOLEDRONIC ACID ALENDRONIC ACID RISEDRONIC ACID IBANDRONIC ACID TERIPARATIDE',
        immune: 'ADALIMUMAB USTEKINUMAB ETANERCEPT INFLIXIMAB RISANKIZUMAB TOCILIZUMAB APREMILAST TOFACITINIB UPADACITINIB BARICITINIB METHOTREXATE DIMETHYL FUMARATE TERIFLUNOMIDE SECUKINUMAB IXEKIZUMAB GUSELKUMAB DUPILUMAB OCRELIZUMAB VEDOLIZUMAB HYDROXYCHLOROQUINE',
        cancer: 'DASATINIB LENALIDOMIDE ABIRATERONE POMALIDOMIDE SUNITINIB AXITINIB ENZALUTAMIDE PALBOCICLIB IMATINIB ERLOTINIB RUXOLITINIB IBRUTINIB BOSUTINIB CAPECITABINE TEMOZOLOMIDE FULVESTRANT TAMOXIFEN LETROZOLE ANASTROZOLE EXEMESTANE BICALUTAMIDE APALUTAMIDE DAROLUTAMIDE RIBOCICLIB ABEMACICLIB OLAPARIB NILOTINIB AVAPRITINIB',
        transplant: 'TACROLIMUS CICLOSPORIN MYCOPHENOLATE MOFETIL MYCOPHENOLIC ACID',
        smoking: 'NICOTINE VARENICLINE',
        antiseptic: 'CHLORHEXIDINE POVIDONE-IODINE DICHLOROBENZYL ALCOHOL AMYLMETACRESOL',
        numb: 'LIDOCAINE BENZOCAINE PRILOCAINE',
        anemia: 'EPOETIN ALFA DARBEPOETIN ALFA',
        lungbp: 'AMBRISENTAN BOSENTAN MACITENTAN SELEXIPAG RIOCIGUAT TREPROSTINIL',
        fibrosis: 'NINTEDANIB PIRFENIDONE',
        cf: 'IVACAFTOR TEZACAFTOR ELEXACAFTOR LUMACAFTOR',
        muscle: 'BACLOFEN TIZANIDINE ORPHENADRINE',
        liver: 'URSODEOXYCHOLIC ACID',
        hormone_m: 'TESTOSTERONE',
        sleep_aid: 'DOXYLAMINE DIPHENHYDRAMINE'
    };
    // multi-word names first, then single words
    const ING = {};
    Object.keys(MAP).forEach(c => {
        let rest = ' ' + MAP[c] + ' ';
        const multi = ['DABIGATRAN ETEXILATE', 'INSULIN LISPRO', 'INSULIN GLARGINE', 'INSULIN ASPART', 'INSULIN DEGLUDEC', 'INSULIN DETEMIR', 'INSULIN GLULISINE', 'INSULIN HUMAN',
            'BEMPEDOIC ACID', 'ACETYLSALICYLIC ACID', 'SACUBITRIL/VALSARTAN AS SODIUM SALT COMPLEX', 'AMPHETAMINE SULFATE', 'DEXTROAMPHETAMINE SULFATE', 'DEXTROAMPHETAMINE SACCHARATE',
            'AMPHETAMINE ASPARTATE MONOHYDRATE', 'VALPROIC ACID', 'CLAVULANIC ACID', 'FUSIDIC ACID', 'TENOFOVIR DISOPROXIL', 'TENOFOVIR ALAFENAMIDE', 'IPRATROPIUM BROMIDE', 'BUDESONIDE MICRONIZED',
            'POLYETHYLENE GLYCOL 3350', 'BISMUTH SUBSALICYLATE', 'FOLIC ACID', 'PYRIDOXINE (VIT B6)', 'CYANOCOBALAMIN (VIT B12)', 'THIAMINE (VIT B1)', 'ASCORBIC ACID', 'CALCIUM CARBONATE',
            'ZINC SULFATE', 'MAGNESIUM CARBONATE', 'FISH OIL', 'BENZOYL PEROXIDE', 'SALICYLIC ACID', 'ZOLEDRONIC ACID', 'ALENDRONIC ACID', 'RISEDRONIC ACID', 'IBANDRONIC ACID',
            'DIMETHYL FUMARATE', 'MYCOPHENOLATE MOFETIL', 'MYCOPHENOLIC ACID', 'DICHLOROBENZYL ALCOHOL', 'EPOETIN ALFA', 'DARBEPOETIN ALFA', 'URSODEOXYCHOLIC ACID', 'NAPROXEN SODIUM'];
        multi.forEach(m => { if (rest.indexOf(' ' + m + ' ') >= 0) { ING[m] = c; rest = rest.replace(' ' + m + ' ', ' '); } });
        rest.trim().split(/\s+/).forEach(w => { if (w && !ING[w]) ING[w] = c; });
    });
    // insulin of any kind, vitamins by name
    function catOf(name) {
        const n = String(name || '').toUpperCase().trim();
        if (ING[n]) return ING[n];
        if (/^INSULIN/.test(n)) return 'diab';
        if (/VIT(AMIN)? ?[A-K]|\(VIT /.test(n)) return 'vitamin';
        const first = n.split(/[\s,(]/)[0];
        return ING[first] || null;
    }
    // entry: registry row object from subst.js ({a: [[code, ingredient, dose], ...]}). The first ingredient with a group wins.
    window.mtDict = function (entry) {
        if (!entry || !entry.a) return null;
        const cats = [];
        entry.a.forEach(x => { const c = catOf(x[1]); if (c && cats.indexOf(c) < 0) cats.push(c); });
        if (!cats.length) return null;
        const i = li();
        return cats.slice(0, 2).map(c => ({ cat: c, text: CAT[c][0][i], warn: CAT[c][1] ? CAT[c][1][i] : '' }));
    };
    window.mtDictCat = catOf; // for tests
})();
