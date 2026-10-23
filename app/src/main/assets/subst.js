// S-01 (owner 2026-10-21): "I got a different medicine" - when the pharmacy hands out a substitute (generic) for the
// medicine the doctor prescribed, compare both in the Ministry of Health registry (drugs_il.js): same active
// ingredients + same dose + same form = full substitute. Always ends with "check with the pharmacist". (M-161)
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const vib = () => { try { navigator.vibrate && navigator.vibrate(12); } catch (e) { } };
    const T = {
        btn: ['🔄 קיבלתי תרופה אחרת', '🔄 استلمت دواءً آخر', '🔄 Am primit alt medicament', '🔄 J\'ai reçu un autre médicament', '🔄 I got a different medicine', '🔄 Мне дали другое лекарство'],
        which: ['לאיזו תרופה בכרטיס?', 'لأي دواء في البطاقة؟', 'Pentru care medicament din card?', 'Pour quel médicament de la carte ?', 'For which medicine on the card?', 'Для какого лекарства в карточке?'],
        q1: ['איזו תרופה רשם הרופא?', 'ما الدواء الذي وصفه الطبيب؟', 'Ce medicament a prescris medicul?', 'Quel médicament le médecin a-t-il prescrit ?', 'Which medicine did the doctor prescribe?', 'Какое лекарство выписал врач?'],
        q2: ['מה קיבלת בבית המרקחת?', 'ماذا استلمت من الصيدلية؟', 'Ce ai primit la farmacie?', 'Qu\'avez-vous reçu à la pharmacie ?', 'What did you get at the pharmacy?', 'Что вам дали в аптеке?'],
        hint: ['מקלידים את השם כמו על האריזה, ובוחרים מהרשימה', 'اكتب الاسم كما على العلبة واختر من القائمة', 'Scrie numele ca pe cutie și alege din listă', 'Tapez le nom comme sur la boîte et choisissez dans la liste', 'Type the name as on the box and pick from the list', 'Введите название как на коробке и выберите из списка'],
        none: ['לא נמצא במאגר משרד הבריאות. נסו לכתוב את השם כמו על האריזה.', 'غير موجود في سجل وزارة الصحة. جرّب كتابة الاسم كما على العلبة.', 'Nu există în registrul Ministerului Sănătății. Scrie numele ca pe cutie.', 'Introuvable dans le registre du ministère de la Santé. Tapez le nom comme sur la boîte.', 'Not found in the Ministry of Health registry. Type the name as on the box.', 'Не найдено в реестре Министерства здравоохранения. Введите название как на коробке.'],
        prev: ['→ חזרה', '→ رجوع', '← Înapoi', '← Retour', '← Back', '← Назад'],
        home: ['בדיקת תרופה', 'فحص دواء', 'Verifică medicament', 'Vérifier un médicament', 'Check a medicine', 'Проверка лекарства'], // M-187; M-209: short, under a floating symbol
        homeSub: ['📖 מה התרופה עושה · צילום או הקלדת שם', '📖 ماذا يفعل الدواء · صورة أو اسم', '📖 La ce folosește · poză sau nume', '📖 À quoi sert-il · photo ou nom', '📖 What it does · photo or name', '📖 Для чего лекарство · фото или название'],
        // M-195: medicine dictionary
        what: ['📖 מה זה?', '📖 ما هذا؟', '📖 Ce este?', '📖 C\'est quoi ?', '📖 What is it?', '📖 Что это?'],
        q0: ['איזו תרופה לבדוק?', 'أي دواء تريد أن تفحص؟', 'Ce medicament verifici?', 'Quel médicament vérifier ?', 'Which medicine to check?', 'Какое лекарство проверить?'],
        dFor: ['📖 למה התרופה משמשת', '📖 لماذا يُستخدم الدواء', '📖 La ce folosește medicamentul', '📖 À quoi sert ce médicament', '📖 What the medicine is for', '📖 Для чего это лекарство'],
        dNone: ['אין לי הסבר פשוט לתרופה הזו. אפשר לקרוא את ההתוויה הרשמית למטה או את העלון.', 'لا يوجد لدي شرح مبسّط لهذا الدواء. يمكن قراءة الدواعي الرسمية أدناه أو النشرة.', 'Nu am o explicație simplă pentru acest medicament. Poți citi indicația oficială mai jos sau prospectul.', 'Je n\'ai pas d\'explication simple pour ce médicament. Lisez l\'indication officielle ci-dessous ou la notice.', 'I have no simple explanation for this medicine. You can read the official indication below or the leaflet.', 'Для этого лекарства нет простого объяснения. Можно прочитать официальные показания ниже или листок-вкладыш.'],
        dOff: ['ההתוויה הרשמית (באנגלית, ממשרד הבריאות)', 'الدواعي الرسمية (بالإنجليزية، من وزارة الصحة)', 'Indicația oficială (în engleză, de la Ministerul Sănătății)', 'Indication officielle (en anglais, du ministère de la Santé)', 'Official indication (Ministry of Health)', 'Официальные показания (на английском, от Минздрава)'],
        dLeaf: ['📄 עלון רשמי באתר משרד הבריאות', '📄 النشرة الرسمية في موقع وزارة الصحة', '📄 Prospect oficial pe site-ul Ministerului Sănătății', '📄 Notice officielle sur le site du ministère', '📄 Official leaflet on the Ministry of Health site', '📄 Официальный листок-вкладыш на сайте Минздрава'],
        dCmp: ['🔄 קיבלתי תרופה אחרת - להשוות', '🔄 استلمت دواءً آخر - قارن', '🔄 Am primit alt medicament - compară', '🔄 J\'ai reçu un autre médicament - comparer', '🔄 I got a different medicine - compare', '🔄 Мне дали другое - сравнить'],
        dDisc: ['מידע כללי בלבד, לא תחליף לרופא או לרוקח.', 'معلومات عامة فقط، وليست بديلًا عن الطبيب أو الصيدلي.', 'Doar informații generale, nu înlocuiesc medicul sau farmacistul.', 'Information générale uniquement, ne remplace pas le médecin ou le pharmacien.', 'General information only, not a substitute for a doctor or pharmacist.', 'Только общая информация, не заменяет врача или фармацевта.'],
        scan: ['📷 סריקת הברקוד שעל הקופסה', '📷 مسح الباركود على العلبة', '📷 Scanează codul de bare de pe cutie', '📷 Scanner le code-barres de la boîte', '📷 Scan the barcode on the box', '📷 Сканировать штрихкод на коробке'], // M-287: bigger, clearer words
        hintScan: ['מקלידים את השם כמו על האריזה, או 📷 מצלמים את הברקוד שעל הקופסה', 'اكتب الاسم كما على العلبة أو 📷 صوّر الباركود', 'Scrie numele ca pe cutie sau 📷 fotografiază codul de bare', 'Tapez le nom comme sur la boîte ou 📷 photographiez le code-barres', 'Type the name as on the box, or 📷 photograph the barcode on the box', 'Введите название как на коробке или 📷 сфотографируйте штрихкод на коробке'],
        noRead: ['לא הצלחתי לקרוא ברקוד בתמונה. צלמו מקרוב את הברקוד, באור טוב, או הקלידו את השם.', 'تعذرت قراءة الباركود. صوّره عن قرب وبإضاءة جيدة أو اكتب الاسم.', 'Codul nu a putut fi citit. Fotografiază-l de aproape, la lumină bună, sau scrie numele.', 'Code illisible. Photographiez-le de près, avec une bonne lumière, ou tapez le nom.', 'Could not read a barcode. Photograph it up close in good light, or type the name.', 'Не удалось прочитать штрихкод. Сфотографируйте его вблизи при хорошем свете или введите название.'],
        noCode: ['הברקוד נקרא, אבל הוא לא במאגר משרד הבריאות. הקלידו את השם.', 'تمت قراءة الباركود لكنه غير موجود في السجل. اكتب الاسم.', 'Codul a fost citit, dar nu e în registru. Scrie numele.', 'Code lu, mais absent du registre. Tapez le nom.', 'Barcode read, but it is not in the registry. Please type the name.', 'Штрихкод прочитан, но его нет в реестре. Введите название.'],
        loading: ['טוען את מאגר התרופות...', 'جارٍ تحميل سجل الأدوية...', 'Se încarcă registrul de medicamente...', 'Chargement du registre des médicaments...', 'Loading the medicine registry...', 'Загрузка реестра лекарств...'],
        full: ['✅ חלופה מלאה: אותו חומר פעיל, אותו מינון ואותה צורה.', '✅ بديل كامل: نفس المادة الفعالة والجرعة والشكل.', '✅ Înlocuitor complet: aceeași substanță activă, aceeași doză și formă.', '✅ Substitut complet : même principe actif, même dose et même forme.', '✅ Full substitute: same active ingredient, same dose and same form.', '✅ Полная замена: то же действующее вещество, та же доза и та же форма.'],
        near: ['🟢 אותו חומר פעיל ואותו מינון, רק צורה מעט שונה (טבליה / כמוסה). בדרך כלל זו חלופה.', '🟢 نفس المادة الفعالة والجرعة، فقط الشكل مختلف قليلًا (قرص / كبسولة). عادةً هذا بديل.', '🟢 Aceeași substanță și doză, doar forma diferă puțin (comprimat / capsulă). De obicei e un înlocuitor.', '🟢 Même principe actif et même dose, seule la forme diffère un peu (comprimé / gélule). C\'est en général un substitut.', '🟢 Same active ingredient and dose, only a slightly different form (tablet / capsule). Usually a substitute.', '🟢 То же действующее вещество и доза, только немного другая форма (таблетка / капсула). Обычно это замена.'],
        form: ['⚠️ אותו חומר פעיל, אבל צורה או אופן שחרור שונים. זו לא בהכרח חלופה מלאה.', '⚠️ نفس المادة الفعالة لكن الشكل أو طريقة الإطلاق مختلفة. ليس بالضرورة بديلًا كاملًا.', '⚠️ Aceeași substanță, dar formă sau eliberare diferită. Nu e neapărat un înlocuitor complet.', '⚠️ Même principe actif, mais forme ou libération différente. Pas forcément un substitut complet.', '⚠️ Same active ingredient, but a different form or release. Not necessarily a full substitute.', '⚠️ То же действующее вещество, но другая форма или способ высвобождения. Не обязательно полная замена.'],
        dose: ['⚠️ אותו חומר פעיל אבל מינון שונה. ייתכן שצריך לקחת כמות אחרת.', '⚠️ نفس المادة الفعالة لكن بجرعة مختلفة. قد تحتاج كمية مختلفة.', '⚠️ Aceeași substanță, dar doză diferită. Poate fi nevoie de altă cantitate.', '⚠️ Même principe actif mais dose différente. Il faudra peut-être une autre quantité.', '⚠️ Same active ingredient but a different dose. You may need a different amount.', '⚠️ То же действующее вещество, но другая доза. Возможно, нужно другое количество.'],
        diff: ['❌ חומר פעיל שונה. זו לא אותה תרופה.', '❌ مادة فعالة مختلفة. هذا ليس نفس الدواء.', '❌ Substanță activă diferită. Nu este același medicament.', '❌ Principe actif différent. Ce n\'est pas le même médicament.', '❌ Different active ingredient. This is not the same medicine.', '❌ Другое действующее вещество. Это не то же лекарство.'],
        tFull: ['חלופה מלאה', 'بديل كامل', 'Înlocuitor complet', 'Substitut complet', 'Full substitute', 'Полная замена'],
        tNear: ['כמעט זהה', 'شبه مطابق', 'Aproape identic', 'Presque identique', 'Almost identical', 'Почти идентично'],
        tForm: ['צורה שונה', 'شكل مختلف', 'Formă diferită', 'Forme différente', 'Different form', 'Другая форма'],
        tDose: ['מינון שונה', 'جرعة مختلفة', 'Doză diferită', 'Dose différente', 'Different dose', 'Другая доза'],
        tDiff: ['תרופה אחרת', 'دواء مختلف', 'Alt medicament', 'Autre médicament', 'Different medicine', 'Другое лекарство'],
        wFull: ['ההבדל הוא רק בשם המסחרי וביצרן. החומר שפועל בגוף זהה, ולכן ההשפעה אמורה להיות זהה.', 'الفرق فقط في الاسم التجاري والشركة المصنعة. المادة التي تعمل في الجسم هي نفسها، لذا يجب أن يكون التأثير نفسه.', 'Diferă doar numele comercial și producătorul. Substanța care acționează în corp este aceeași, deci efectul ar trebui să fie același.', 'Seuls le nom commercial et le fabricant changent. La substance qui agit dans le corps est la même, l\'effet devrait donc être le même.', 'Only the brand name and the maker differ. The substance that acts in the body is the same, so the effect should be the same.', 'Отличаются только торговое название и производитель. Вещество, которое действует в организме, то же, поэтому и действие должно быть тем же.'],
        wNear: ['טבליה וכמוסה משחררות את התרופה כמעט תמיד באותו אופן. אם קשה לך לבלוע, שאל את הרוקח.', 'القرص والكبسولة يطلقان الدواء دائمًا تقريبًا بنفس الطريقة. إذا كان البلع صعبًا عليك، اسأل الصيدلي.', 'Comprimatul și capsula eliberează medicamentul aproape mereu la fel. Dacă înghițitul e greu pentru tine, întreabă farmacistul.', 'Comprimé et gélule libèrent le médicament presque toujours de la même façon. Si avaler est difficile, demandez au pharmacien.', 'Tablets and capsules almost always release the medicine the same way. If swallowing is hard for you, ask the pharmacist.', 'Таблетки и капсулы почти всегда высвобождают лекарство одинаково. Если вам трудно глотать, спросите фармацевта.'],
        wForm: ['תרופה בשחרור מושהה פועלת לאורך זמן ארוך יותר, ולכן לפעמים משתנה מספר הפעמים ביום. אל תשנה לבד, שאל את הרוקח.', 'الدواء ممتد المفعول يعمل لفترة أطول، لذلك قد يتغير عدد المرات في اليوم. لا تغيّر بنفسك، اسأل الصيدلي.', 'Un medicament cu eliberare prelungită acționează mai mult timp, așa că uneori se schimbă numărul de doze pe zi. Nu schimba singur, întreabă farmacistul.', 'Un médicament à libération prolongée agit plus longtemps, le nombre de prises par jour peut donc changer. Ne changez rien seul, demandez au pharmacien.', 'An extended-release medicine works over a longer time, so the number of doses a day can change. Don\'t change it yourself, ask the pharmacist.', 'Лекарство с пролонгированным высвобождением действует дольше, поэтому число приёмов в день может измениться. Не меняйте сами, спросите фармацевта.'],
        wDose: ['השווה את המספרים בשתי השורות למעלה. ייתכן שצריך יותר או פחות כדורים כדי לקבל את אותה כמות. בדוק עם הרוקח לפני שלוקחים.', 'قارن الأرقام في السطرين أعلاه. قد تحتاج أقراصًا أكثر أو أقل للحصول على نفس الكمية. تحقق مع الصيدلي قبل التناول.', 'Compară cifrele din cele două rânduri de mai sus. Poate fi nevoie de mai multe sau mai puține comprimate pentru aceeași cantitate. Verifică cu farmacistul înainte.', 'Comparez les chiffres des deux lignes ci-dessus. Il faudra peut-être plus ou moins de comprimés pour la même quantité. Vérifiez avec le pharmacien avant.', 'Compare the numbers in the two lines above. You may need more or fewer pills to get the same amount. Check with the pharmacist before taking it.', 'Сравните числа в двух строках выше. Возможно, понадобится больше или меньше таблеток, чтобы получить то же количество. Проверьте у фармацевта перед приёмом.'],
        wDiff: ['החומר הפעיל הוא מה שעושה את העבודה בגוף. כאן הוא שונה, ולכן אל תיקח את התרופה הזו במקום המקורית. חזור לבית המרקחת.', 'المادة الفعالة هي ما يعمل في الجسم. هنا هي مختلفة، لذا لا تتناول هذا الدواء بدل الأصلي. ارجع إلى الصيدلية.', 'Substanța activă este cea care acționează în corp. Aici este diferită, deci nu lua acest medicament în locul celui original. Întoarce-te la farmacie.', 'Le principe actif est ce qui agit dans le corps. Ici il est différent : ne prenez pas ce médicament à la place de l\'original. Retournez à la pharmacie.', 'The active ingredient is what does the work in the body. Here it is different, so don\'t take this medicine instead of the original. Go back to the pharmacy.', 'Действующее вещество — это то, что работает в организме. Здесь оно другое, поэтому не принимайте это лекарство вместо назначенного. Вернитесь в аптеку.'],
        pharm: ['כדאי לוודא עם הרוקח.', 'يُفضّل التأكد مع الصيدلي.', 'Verifică și cu farmacistul.', 'Vérifiez avec le pharmacien.', 'Please confirm with the pharmacist.', 'Уточните у фармацевта.'],
        was: ['רשם הרופא', 'وصفة الطبيب', 'Prescris', 'Prescrit', 'Prescribed', 'Выписано'],
        got: ['קיבלת', 'استلمت', 'Primit', 'Reçu', 'You got', 'Вам дали'],
        keep: ['💾 לשמור בכרטיס', '💾 حفظ في البطاقة', '💾 Salvează în card', '💾 Garder sur la carte', '💾 Save on the card', '💾 Сохранить в карточке'],
        close: ['סגירה', 'إغلاق', 'Închide', 'Fermer', 'Close', 'Закрыть'],
        back: ['ביטול', 'إلغاء', 'Anulează', 'Annuler', 'Cancel', 'Отмена'],
        now: ['🔄 כרגע: {n}', '🔄 حاليًا: {n}', '🔄 Acum: {n}', '🔄 Actuellement : {n}', '🔄 Now: {n}', '🔄 Сейчас: {n}'],
        delQ: ['להסיר את "{n}" מהכרטיס ולחזור ל{o}?', 'إزالة "{n}" من البطاقة والعودة إلى {o}؟', 'Elimini "{n}" din card și revii la {o}?', 'Retirer « {n} » de la carte et revenir à {o} ?', 'Remove "{n}" from the card and go back to {o}?', 'Убрать «{n}» из карточки и вернуться к {o}?'],
        del: ['הסרה', 'إزالة', 'Elimină', 'Retirer', 'Remove', 'Убрать'],
        src: ['לפי מאגר התרופות של משרד הבריאות', 'حسب سجل الأدوية لوزارة الصحة', 'Conform registrului Ministerului Sănătății', 'Selon le registre du ministère de la Santé', 'From the Ministry of Health medicine registry', 'По реестру лекарств Министерства здравоохранения']
    };
    const tx = k => (T[k] || [])[li()] || (T[k] || [])[0] || k;
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ---------- registry ----------
    let DB = null;
    function loadDb() {
        if (DB) return Promise.resolve(DB);
        return new Promise(res => {
            const done = () => {
                DB = (window.IL_DRUGS || []).map((r, i) => ({ i: i, h: r[0], e: r[1], fe: r[2], f: r[3], a: r[4], b: r[5] || [], s: norm(r[0] + ' ' + r[1]) }));
                res(DB);
            };
            if (window.IL_DRUGS) return done();
            const s = document.createElement('script');
            s.src = 'drugs_il.js'; s.onload = done; s.onerror = () => { DB = []; res(DB); };
            document.head.appendChild(s);
        });
    }
    function norm(s) {
        return String(s || '').toLowerCase().replace(/[®™"'׳״`.,()\-/+]/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function search(q, max) {
        const n = norm(q); if (!n) return [];
        const toks = n.split(' ');
        const out = [];
        for (const d of DB) {
            if (toks.every(t => d.s.includes(t) || d.a.some(c => norm(c[2]).replace(/ /g, '').startsWith(t)))) out.push(d);
        }
        const first = toks[0];
        const score = d => (d.s.startsWith(first) ? 0 : (' ' + d.s).includes(' ' + first) ? 1 : 2) * 1000 + d.s.length;
        return out.sort((x, y) => score(x) - score(y)).slice(0, max || 30);
    }
    const nd = s => String(s || '').toUpperCase().replace(/\s+/g, '');
    const ingText = d => d.a.map(c => c[1] + ' ' + c[2]).join(' + ');
    const formOf = d => (li() === 0 ? (d.f || d.fe) : (d.fe || d.f));
    const nameOf = d => (li() === 0 || li() === 1 ? (d.h || d.e) : (d.e || d.h));
    function group(fe) {
        fe = String(fe || '').toUpperCase();
        if (/INJ|INFUS/.test(fe)) return 'inj';
        if (/EYE/.test(fe)) return 'eye';
        if (/EAR/.test(fe)) return 'ear';
        if (/NASAL/.test(fe)) return 'nose';
        if (/INHAL/.test(fe)) return 'inh';
        if (/SUPPOS|RECTAL|VAGIN|PESSAR/.test(fe)) return 'rv';
        if (/CREAM|OINT|GEL|EXTERNAL|PATCH|LOTION|SHAMPOO|FOAM|PASTE|PLASTER/.test(fe)) return 'top';
        if (/SUBLING|BUCCAL|CHEW|ORODISP|EFFERV|LOZENG|DISPERS/.test(fe)) return 'oral2:' + fe;
        if (/TABLET|CAPLET/.test(fe)) return 'tab';
        if (/CAPSUL/.test(fe)) return 'cap';
        return 'liq';
    }
    function release(fe) {
        fe = String(fe || '').toUpperCase();
        if (/PROLONG|EXTEND|SUSTAIN|SLOW|MODIFIED|CONTROL|RETARD/.test(fe)) return 'mr';
        if (/GASTRO|ENTERIC|DELAYED/.test(fe)) return 'gr';
        return 'ir';
    }
    function compare(a, b) {
        const ka = a.a.map(c => c[0]).sort().join(','), kb = b.a.map(c => c[0]).sort().join(',');
        if (ka !== kb) return 'diff';
        const da = a.a.map(c => c[0] + ':' + nd(c[2])).sort().join(','), db = b.a.map(c => c[0] + ':' + nd(c[2])).sort().join(',');
        if (da !== db) return 'dose';
        if (release(a.fe) !== release(b.fe)) return 'form';
        const ga = group(a.fe), gb = group(b.fe);
        if (ga === gb) return 'full';
        if ((ga === 'tab' && gb === 'cap') || (ga === 'cap' && gb === 'tab')) return 'near';
        return 'form';
    }

    // ---------- saved substitutes (per reminder + medicine name) ----------
    const SK = 'medtime_subst';
    const loadS = () => { try { return JSON.parse(localStorage.getItem(SK) || '{}') || {}; } catch (e) { return {}; } };
    const saveS = o => { try { localStorage.setItem(SK, JSON.stringify(o)); } catch (e) { } };

    // ---------- UI ----------
    const css = document.createElement('style');
    css.textContent = `
    .sb-btn{display:inline-flex!important;align-items:center;gap:6px;border:1.5px solid #c4b5fd!important;background:linear-gradient(135deg,#7c3aed,#5b21b6)!important;color:#fff!important;border-radius:999px!important;min-height:34px!important;padding:4px 11px!important;font-size:.88rem!important;font-weight:800!important}
    .sb-now{display:inline-block;margin-top:4px;padding:4px 10px;border-radius:999px;background:rgba(167,139,250,.18);color:#ddd6fe;font-weight:800;font-size:.9rem;border:none}
    /* M-162 (owner): full-screen solid page at the top (the half-see-through layer made the 3D background flicker,
       and the keyboard covered a bottom sheet); its height follows the visible area above the keyboard */
    .sb-bg{position:fixed!important;left:0!important;right:0!important;top:0;z-index:9600!important;height:100vh;background:#0b1024!important;display:flex!important;justify-content:center}
    .sb-sh{width:100%;max-width:560px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;background:linear-gradient(180deg,#1e1b4b,#0f172a);color:#fff;padding:calc(14px + env(safe-area-inset-top)) 16px 12px}
    .sb-t{font-size:1.35rem;font-weight:800;margin:2px 0 4px}
    .sb-h{color:#c7d2fe;font-size:.95rem;margin-bottom:10px}
    .sb-in{width:100%;box-sizing:border-box;font-size:1.25rem;padding:12px 14px;border-radius:14px;border:2px solid #a78bfa;background:#0b1024;color:#fff;outline:none}
    .sb-inrow{display:flex;gap:8px;align-items:stretch}
    .sb-inrow .sb-in{flex:1;min-width:0}
    .sb-scan{flex:0 0 auto;border:none;border-radius:14px;padding:0 14px;font-size:1.05rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#0ea5e9,#0369a1)}
    /* M-287 (owner asked for barcode scanning; it was there but small): a big scan card under the name box, with barcode stripes on it */
    .sb-inrow{flex-wrap:wrap}
    .sb-inrow .sb-in{flex:1 1 100%}
    .sb-scan{order:2;flex:1 1 100%;position:relative;min-height:92px;margin-top:6px;padding:44px 14px 10px;border-radius:20px;font-size:1.2rem;line-height:1.25;
      background:linear-gradient(135deg,#0ea5e9,#0369a1);box-shadow:inset 0 2px 3px rgba(255,255,255,.45),0 5px 0 #0c4a6e,0 10px 18px rgba(0,0,0,.45)}
    .sb-scan::before{content:'';position:absolute;left:50%;top:10px;width:118px;height:28px;transform:translateX(-50%);border-radius:4px;background:#fff
      repeating-linear-gradient(90deg,#0f172a 0 2px,transparent 2px 4px,#0f172a 4px 7px,transparent 7px 9px,#0f172a 9px 10px,transparent 10px 13px) content-box;padding:3px 6px;box-sizing:border-box}
    .sb-scan:active{transform:translateY(4px);box-shadow:inset 0 2px 3px rgba(255,255,255,.45),0 1px 0 #0c4a6e}
    /* M-295 (owner: the medicine screens were not big and readable enough; the keyboard hid "Cancel"):
       bigger letters everywhere, and while typing the hint, the scan card and the bottom buttons step aside so the results have the room */
    .sb-sh .sb-t{font-size:1.65rem}
    .sb-sh .sb-h{font-size:1.1rem;line-height:1.4}
    .sb-sh .sb-in{font-size:1.4rem;padding:14px 16px}
    .sb-sh .sb-it{font-size:1.3rem;padding:13px 14px}
    .sb-sh .sb-it small{font-size:1rem}
    .sb-sh .sb-msg{font-size:1.15rem}
    .sb-sh .sb-res{font-size:1.35rem}
    .sb-sh .sb-row{font-size:1.15rem}.sb-sh .sb-row b{font-size:1rem}
    .sb-sh .sb-sub{font-size:1.05rem}
    .sb-sh .sb-dh{font-size:1.35rem}
    .sb-sh .sb-dict p{font-size:1.35rem;line-height:1.55}
    .sb-sh .sb-dict .sb-warn{font-size:1.2rem}
    .sb-sh .sb-off p{font-size:1.15rem;line-height:1.5}.sb-sh .sb-off b{font-size:1rem}
    .sb-sh .sb-why{font-size:1.2rem}
    .sb-sh .sb-disc{font-size:1rem}
    .sb-sh .sb-btns button{font-size:1.25rem;min-height:58px}
    .sb-sh.sb-typing :is(.sb-h,.sb-scan){display:none!important}
    .sb-sh.sb-kb .sb-btns{display:none!important}
    .sb-sh.sb-typing .sb-list{margin-top:8px}
    /* M-310 (owner): the info / result pages always show their buttons, plus a round red ✕ at the top corner */
    .sb-sh{position:relative}
    .sb-x{position:absolute;top:calc(10px + env(safe-area-inset-top));inset-inline-end:12px;z-index:3;width:46px;height:46px;border-radius:50%;border:2px solid rgba(255,255,255,.85);
      background:radial-gradient(circle at 35% 30%,#f87171,#dc2626 60%,#991b1b);color:#fff;font-size:1.35rem;font-weight:900;line-height:1;display:grid;place-items:center;padding:0;box-shadow:0 4px 0 #7f1d1d,0 8px 16px rgba(0,0,0,.45)}
    .sb-x:active{transform:translateY(2px);box-shadow:0 2px 0 #7f1d1d}
    .sb-info :is(.sb-t,.sb-sub){padding-inline-end:56px}
    .sb-list{overflow:auto;margin-top:10px;flex:1;min-height:120px}
    .sb-it{display:block;width:100%;text-align:start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;color:#fff;padding:10px 12px;margin-bottom:8px;font-size:1.05rem;font-weight:800}
    .sb-it small{display:block;font-weight:500;color:#a5b4fc;font-size:.85rem;margin-top:2px;direction:ltr;text-align:start}
    .sb-msg{color:#fde68a;padding:10px 4px}
    .sb-res{font-size:1.2rem;font-weight:800;line-height:1.45;margin:6px 0 12px}
    .sb-row{background:rgba(255,255,255,.06);border-radius:14px;padding:10px 12px;margin-bottom:8px}
    .sb-row b{display:block;color:#c4b5fd;font-size:.85rem}
    .sb-row small{display:block;color:#a5b4fc;direction:ltr;text-align:start}
    .sb-src{color:#94a3b8;font-size:.8rem;margin:4px 0 10px}
    .sb-btns{display:flex;gap:10px;margin-top:8px}
    .sb-btns button{flex:1;min-height:52px;border-radius:14px;font-size:1.1rem;font-weight:800;border:none;color:#fff;background:#334155}
    .sb-top{flex:1 1 auto;overflow:auto;min-height:60px}
    .sb-verd{position:relative;margin:6px 0 4px;padding:12px 14px 10px;border-radius:22px;text-align:center;background:linear-gradient(180deg,rgba(var(--vc),.22),rgba(var(--vc),.08));border:2px solid rgba(var(--vc),.85);animation:sbUp .45s cubic-bezier(.2,.9,.3,1.2) both}
    .sb-verd.v-full,.sb-verd.v-near{--vc:52,211,153;--vh:#34d399;--vd:#047857}
    .sb-verd.v-form,.sb-verd.v-dose{--vc:251,191,36;--vh:#fbbf24;--vd:#b45309}
    .sb-verd.v-diff{--vc:248,113,113;--vh:#f87171;--vd:#b91c1c}
    @keyframes sbUp{from{transform:translateY(60%);opacity:0}to{transform:none;opacity:1}}
    .sb-orb3{position:relative;width:92px;height:104px;margin:0 auto;perspective:300px}
    .sb-orb{position:absolute;left:6px;top:0;width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;will-change:transform;
      background:radial-gradient(circle at 34% 28%,#fff 0,var(--vh) 22%,var(--vd) 78%,#111 120%);box-shadow:inset -8px -10px 18px rgba(0,0,0,.45),inset 6px 6px 12px rgba(255,255,255,.35),0 0 18px var(--vh);
      animation:sbFloat 2.4s ease-in-out infinite}
    .sb-orb span{font-size:2.9rem;font-weight:900;color:#fff;line-height:1;text-shadow:0 2px 0 rgba(0,0,0,.35),0 4px 6px rgba(0,0,0,.4);transform:translateZ(20px)}
    .sb-halo{position:absolute;left:-8px;top:-14px;width:108px;height:108px;border-radius:50%;background:radial-gradient(circle,var(--vh) 0,rgba(var(--vc),.35) 40%,transparent 68%);will-change:opacity,transform;animation:sbBlink 1.1s ease-in-out infinite}
    .sb-shd{position:absolute;left:18px;bottom:0;width:56px;height:10px;border-radius:50%;background:rgba(0,0,0,.55);will-change:transform,opacity;animation:sbShd 2.4s ease-in-out infinite}
    @keyframes sbFloat{0%,100%{transform:translateY(0) rotateY(-22deg) rotateX(8deg)}50%{transform:translateY(-12px) rotateY(22deg) rotateX(-6deg)}}
    @keyframes sbBlink{0%,100%{opacity:.25;transform:scale(.85)}50%{opacity:1;transform:scale(1.08)}}
    @keyframes sbShd{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(.65);opacity:.25}}
    .sb-vt{font-size:2rem;font-weight:900;color:var(--vh);margin:4px 0 2px;text-shadow:0 0 1px #000,0 2px 3px #000}
    .sb-verd .sb-res{font-size:1.15rem;margin:2px 0 6px}
    .sb-why{font-size:1.02rem;line-height:1.5;color:#e2e8f0;margin-bottom:6px}
    .sb-verd .pharm{font-size:1.02rem;font-weight:800;color:#fde68a}
    .sb-verd .sb-src{margin:4px 0 0}
    .sb-btns .ok{background:linear-gradient(135deg,#7c3aed,#5b21b6)}
    .sb-btn.sb-what{border-color:#bae6fd!important;background:linear-gradient(135deg,#0ea5e9,#0369a1)!important}
    .sb-info{flex:1 1 auto;overflow:auto;min-height:60px}
    .sb-sub{color:#a5b4fc;font-size:.9rem;direction:ltr;text-align:start;margin-bottom:10px}
    .sb-dh{color:#fde68a;font-weight:800;font-size:1.1rem;margin:4px 0}
    .sb-dict p{margin:0 0 8px;font-size:1.2rem;line-height:1.5}
    .sb-dict .sb-warn{font-size:1.05rem;color:#fecaca;background:rgba(239,68,68,.14);border-radius:12px;padding:8px 10px}
    .sb-off{background:rgba(255,255,255,.06);border-radius:14px;padding:10px 12px;margin:8px 0}
    .sb-off b{display:block;color:#c4b5fd;font-size:.85rem;margin-bottom:4px}
    .sb-off p{margin:0;font-size:.95rem;line-height:1.45;color:#e2e8f0;text-align:left}
    .sb-disc{color:#94a3b8;font-size:.85rem;margin:6px 0}
    .sb-col{flex-direction:column}.sb-row2{display:flex;gap:10px}
    .sb-btns .lf{background:linear-gradient(135deg,#0ea5e9,#0369a1)}
    `;
    document.head.appendChild(css);

    function sheet() {
        const bg = document.createElement('div'); bg.className = 'sb-bg';
        const sh = document.createElement('div'); sh.className = 'sb-sh'; bg.appendChild(sh);
        const vv = window.visualViewport;
        const fit = () => { bg.style.height = (vv ? vv.height : window.innerHeight) + 'px'; bg.style.top = (vv ? vv.offsetTop : 0) + 'px'; };
        fit();
        if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
        window.addEventListener('resize', fit);
        document.body.appendChild(bg);
        const o = { bg, sh, onBack: null };
        const unBack = window.mtBackPush ? mtBackPush(() => (o.onBack ? o.onBack() : (close(), false))) : null; // M-163: phone back = one step back
        const close = () => { if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); } window.removeEventListener('resize', fit); bg.remove(); if (unBack) unBack(); };
        o.close = close;
        return o;
    }
    // M-310: a typed search left the "keyboard open" mode on, which hid the buttons of the next page. Clear it and add a ✕.
    function xBtn(s, res) {
        s.sh.classList.remove('sb-kb', 'sb-typing');
        const x = document.createElement('button'); x.type = 'button'; x.className = 'sb-x'; x.textContent = '✕';
        x.setAttribute('aria-label', tx('close')); x.onclick = () => res(null); s.sh.appendChild(x);
    }
    // one step: type a name (or scan the box), pick a registry entry. Resolves an entry, 'back' or null (close).
    function pickStep(s, title, start, canBack) {
        return new Promise(res => {
            s.sh.innerHTML = `<div class="sb-t"></div><div class="sb-h"></div><div class="sb-inrow"><input class="sb-in" type="text" autocomplete="off"></div><div class="sb-list"></div><div class="sb-btns"></div>`;
            s.sh.querySelector('.sb-t').textContent = title;
            s.sh.querySelector('.sb-h').textContent = tx(canScan() ? 'hintScan' : 'hint');
            const inp = s.sh.querySelector('.sb-in'), list = s.sh.querySelector('.sb-list'), btns = s.sh.querySelector('.sb-btns');
            // M-295: keyboard open = the bottom buttons step aside; once letters are typed the hint and the scan card step aside too (they come back when the box is empty)
            const kb = on => { s.sh.classList.toggle('sb-kb', on || !!inp.value.trim()); s.sh.classList.toggle('sb-typing', !!inp.value.trim()); };
            inp.addEventListener('focus', () => kb(true)); inp.addEventListener('blur', () => kb(false)); inp.addEventListener('input', () => kb(true));
            s.onBack = () => { res(canBack ? 'back' : null); return canBack; };
            if (canScan()) {
                const sc = document.createElement('button'); sc.type = 'button'; sc.className = 'sb-scan'; sc.textContent = tx('scan');
                sc.onclick = () => scan().then(r => { if (r && r.length === 1) res(r[0]); else if (r) show(r, r.length ? '' : tx('noCode')); else show([], tx('noRead')); });
                s.sh.querySelector('.sb-inrow').appendChild(sc);
            }
            if (canBack) { const bb = document.createElement('button'); bb.type = 'button'; bb.textContent = tx('prev'); bb.onclick = () => res('back'); btns.appendChild(bb); }
            const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = tx('back'); cancel.onclick = () => res(null); btns.appendChild(cancel);
            const show = (r, msg) => {
                list.innerHTML = '';
                if (msg) { const m = document.createElement('div'); m.className = 'sb-msg'; m.textContent = msg; list.appendChild(m); }
                r.forEach(d => {
                    const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-it';
                    b.innerHTML = esc(nameOf(d)) + `<small>${esc(ingText(d))} · ${esc(formOf(d))}</small>`;
                    b.onclick = () => { vib(); res(d); };
                    list.appendChild(b);
                });
            };
            const draw = () => { const r = search(inp.value, 30); show(r, !r.length && inp.value.trim() ? tx('none') : ''); };
            inp.value = start || ''; inp.oninput = draw; draw();
            if (!start) setTimeout(() => { try { inp.focus(); } catch (e) { } }, 50);
        });
    }
    function chooseItem(m) {
        const items = (m.items || []).filter(it => it && it.name);
        if (items.length <= 1) return Promise.resolve(items[0] || null);
        return new Promise(res => {
            const s = sheet();
            s.onBack = () => { s.close(); res(null); return false; };
            s.sh.innerHTML = `<div class="sb-t"></div><div class="sb-list"></div><div class="sb-btns"><button type="button"></button></div>`;
            s.sh.querySelector('.sb-t').textContent = tx('which');
            const list = s.sh.querySelector('.sb-list');
            items.forEach(it => {
                const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-it'; b.textContent = it.name;
                b.onclick = () => { s.close(); res(it); };
                list.appendChild(b);
            });
            const c = s.sh.querySelector('.sb-btns button'); c.textContent = tx('back'); c.onclick = () => { s.close(); res(null); };
        });
    }
    function resultStep(s, m, it, orig, got) {
        return new Promise(res => {
            const lv = compare(orig, got);
            s.onBack = () => { res('back'); return true; };
            // M-165 (owner): the answer opens big at the bottom, with a floating, blinking 3D sign and a clear explanation
            const K = lv.charAt(0).toUpperCase() + lv.slice(1);
            s.sh.innerHTML = `<div class="sb-top">
                <div class="sb-row"><b></b><span class="n1"></span><small class="i1"></small></div>
                <div class="sb-row"><b></b><span class="n2"></span><small class="i2"></small></div></div>
                <div class="sb-verd v-${lv}"><div class="sb-orb3"><i class="sb-halo"></i><div class="sb-orb"><span>${({ full: '✓', near: '≈', form: '!', dose: '!', diff: '✕' })[lv]}</span></div><i class="sb-shd"></i></div>
                <div class="sb-vt"></div><div class="sb-res"></div><div class="sb-why"></div><div class="pharm"></div><div class="sb-src"></div></div>
                <div class="sb-btns"><button type="button" class="pv"></button><button type="button" class="cl"></button>${lv === 'diff' || !m ? '' : '<button type="button" class="ok"></button>'}</div>`;
            s.sh.querySelector('.sb-vt').textContent = tx('t' + K);
            s.sh.querySelector('.sb-res').textContent = tx(lv).replace(/^\S+\s+/, '').replace(/^[^:.]+\s*:\s*/, '').replace(/^./, c => c.toUpperCase());
            s.sh.querySelector('.sb-why').textContent = tx('w' + K);
            const bs = s.sh.querySelectorAll('.sb-row b'); bs[0].textContent = tx('was'); bs[1].textContent = tx('got');
            s.sh.querySelector('.n1').textContent = nameOf(orig); s.sh.querySelector('.i1').textContent = ingText(orig) + ' · ' + formOf(orig);
            s.sh.querySelector('.n2').textContent = nameOf(got); s.sh.querySelector('.i2').textContent = ingText(got) + ' · ' + formOf(got);
            s.sh.querySelector('.pharm').textContent = tx('pharm');
            s.sh.querySelector('.sb-src').textContent = tx('src');
            xBtn(s, res);
            const pv = s.sh.querySelector('.pv'); pv.textContent = tx('prev'); pv.onclick = () => res('back');
            const cl = s.sh.querySelector('.cl'); cl.textContent = tx('close'); cl.onclick = () => res(null);
            const ok = s.sh.querySelector('.ok');
            if (ok) {
                ok.textContent = tx('keep');
                ok.onclick = () => {
                    const o = loadS(); o[m.id + '|' + it.name] = { n: nameOf(got), o: nameOf(orig), lv: lv };
                    saveS(o); res(null); if (typeof renderMeds === 'function') renderMeds();
                };
            }
            if (navigator.vibrate) try { navigator.vibrate(lv === 'full' ? 20 : [15, 40, 15]); } catch (e) { }
        });
    }
    // M-195: dictionary card for one medicine: plain explanation (dict.js), official indication (drugs_ind.js), leaflet link
    let IND = null;
    function loadInd() {
        if (IND) return Promise.resolve(IND);
        return new Promise(res => {
            const s = document.createElement('script'); s.src = 'drugs_ind.js';
            s.onload = () => { IND = window.IL_IND || []; res(IND); }; s.onerror = () => { IND = []; res(IND); };
            document.head.appendChild(s);
        });
    }
    async function infoStep(s, d) {
        await loadInd();
        return new Promise(res => {
            s.onBack = () => { res('back'); return true; };
            const ind = IND[d.i] || ['', ''];
            const dc = window.mtDict ? window.mtDict(d) : null;
            s.sh.innerHTML = `<div class="sb-info"><div class="sb-t"></div><div class="sb-sub"></div>
                <div class="sb-dh"></div><div class="sb-dict"></div><div class="sb-off"><b></b><p dir="ltr"></p></div><div class="sb-disc"></div></div>
                <div class="sb-btns sb-col"><button type="button" class="lf"></button><button type="button" class="ok cmp"></button><div class="sb-row2"><button type="button" class="pv"></button><button type="button" class="cl"></button></div></div>`;
            const q = c => s.sh.querySelector(c);
            q('.sb-t').textContent = nameOf(d); q('.sb-sub').textContent = ingText(d) + ' · ' + formOf(d);
            q('.sb-dh').textContent = tx('dFor');
            const box = q('.sb-dict');
            if (dc) dc.forEach(x => {
                const p = document.createElement('p'); p.textContent = x.text; box.appendChild(p);
                if (x.warn) { const w = document.createElement('p'); w.className = 'sb-warn'; w.textContent = '⚠️ ' + x.warn; box.appendChild(w); }
            });
            else box.textContent = tx('dNone');
            if (ind[0]) { q('.sb-off b').textContent = tx('dOff'); q('.sb-off p').textContent = ind[0]; } else q('.sb-off').remove();
            q('.sb-disc').textContent = tx('dDisc');
            const lf = q('.lf');
            if (ind[1] && N && typeof N.openMohPage === 'function') { lf.textContent = tx('dLeaf'); lf.onclick = () => { vib(); N.openMohPage(ind[1]); }; } else lf.remove();
            q('.cmp').textContent = tx('dCmp'); q('.cmp').onclick = () => { vib(); res('cmp'); };
            xBtn(s, res);
            q('.pv').textContent = tx('prev'); q('.pv').onclick = () => res('back');
            q('.cl').textContent = tx('close'); q('.cl').onclick = () => res(null);
        });
    }
    async function start(m, info) { // info: open the dictionary card first (M-197: "📖 what is it?" on a medicine card)
        vib();
        const it = m ? await chooseItem(m) : { name: '' }; if (!it) return; // M-187: from the main screen there is no card
        const s = sheet();
        s.sh.innerHTML = `<div class="sb-t">${esc(tx('loading'))}</div>`;
        await loadDb();
        let step = 0, orig = null, got = null;
        const dictFirst = !m || info;
        if (info) { const r = search(it.name, 2); if (r.length && norm(nameOf(r[0])) === norm(it.name) || r.length === 1) { orig = r[0]; step = 3; } }
        for (;;) {
            if (step === 0) {
                const r = await pickStep(s, tx(dictFirst ? 'q0' : 'q1'), orig ? nameOf(orig) : it.name, false);
                if (!r || r === 'back') break; orig = r; step = dictFirst ? 3 : 1; // M-195: from the main screen, the dictionary card first
            } else if (step === 3) {
                const r = await infoStep(s, orig);
                if (r === 'back') { step = 0; continue; } if (!r) break; step = 1;
            } else if (step === 1) {
                const r = await pickStep(s, tx('q2'), '', true);
                if (r === 'back') { step = dictFirst ? 3 : 0; continue; } if (!r) break; got = r; step = 2;
            } else {
                const r = await resultStep(s, m, it, orig, got);
                if (r === 'back') { step = 1; continue; } break;
            }
        }
        s.close();
    }

    // ---------- M-163: scan the box (barcode / DataMatrix on the package) ----------
    const N = window.MedTimeNative;
    const canScan = () => !!(N && typeof N.pickPhoto === 'function' && typeof N.getPhoto === 'function');
    let scanRes = null;
    const prevDone = window.mtPhotoDone;
    window.mtPhotoDone = function (ok) {
        if (!scanRes) return prevDone ? prevDone(ok) : undefined;
        const r = scanRes; scanRes = null;
        let src = ''; try { src = ok ? N.getPhoto('__scan__') : ''; } catch (e) { }
        try { N.deletePhoto && N.deletePhoto('__scan__'); } catch (e) { }
        r(src);
    };
    function loadZx() {
        if (window.ZXing) return Promise.resolve();
        return new Promise(res => { const s = document.createElement('script'); s.src = 'lib/zxing.min.js'; s.onload = res; s.onerror = res; document.head.appendChild(s); });
    }
    function gtinToEans(t) {
        const out = new Set(); t = String(t || '');
        const m = t.match(/(?:^|\x1d|\u001d)?01(\d{14})/); // GS1 DataMatrix: (01) + 14-digit GTIN
        const d = m ? m[1] : t.replace(/\D/g, '');
        if (d) { out.add(d); out.add(d.replace(/^0+/, '')); if (d.length === 14) out.add(d.slice(1)); }
        return [...out].filter(x => x.length >= 8);
    }
    async function decode(src) {
        const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
        if (!img) return [];
        const found = [];
        if ('BarcodeDetector' in window) {
            try { (await new BarcodeDetector().detect(img)).forEach(b => found.push(b.rawValue)); } catch (e) { }
        }
        if (!found.length) {
            await loadZx();
            if (window.ZXing) {
                const Z = window.ZXing, hints = new Map();
                hints.set(Z.DecodeHintType.TRY_HARDER, true);
                hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.DATA_MATRIX, Z.BarcodeFormat.CODE_128, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.QR_CODE]);
                for (const rot of [0, 90]) {
                    try {
                        const c = document.createElement('canvas'), w = img.naturalWidth, h = img.naturalHeight;
                        c.width = rot ? h : w; c.height = rot ? w : h;
                        const g = c.getContext('2d'); if (rot) { g.translate(h, 0); g.rotate(Math.PI / 2); } g.drawImage(img, 0, 0);
                        const lum = new Z.HTMLCanvasElementLuminanceSource(c);
                        const r = new Z.MultiFormatReader(); r.setHints(hints);
                        found.push(r.decode(new Z.BinaryBitmap(new Z.HybridBinarizer(lum))).getText()); break;
                    } catch (e) { }
                }
            }
        }
        return found;
    }
    // resolves: list of registry entries (maybe empty = code not in the registry), or null = no code could be read
    function scan() {
        return new Promise(res => {
            scanRes = async src => {
                if (!src) return res(null);
                const codes = await decode(src); if (!codes.length) return res(null);
                const keys = new Set(); codes.forEach(c => gtinToEans(c).forEach(k => keys.add(k)));
                res(DB.filter(d => d.b.some(b => keys.has(String(b).replace(/\D/g, '')))));
            };
            vib(); N.pickPhoto('__scan__');
        });
    }

    // ---------- cards ----------
    const prev = window.mtCardExtras;
    window.mtCardExtras = function (li, m) {
        if (prev) try { prev(li, m); } catch (e) { console.error(e); }
        if (!li || !m) return;
        const info = li.querySelector('.med-info') || li;
        const saved = loadS();
        (m.items || []).forEach(it => {
            const v = it && saved[m.id + '|' + it.name];
            if (!v) return;
            const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-now';
            b.textContent = fill(tx('now'), { n: v.n }) + ' · ' + tx(v.lv).split(':')[0].split('.')[0];
            b.onclick = () => {
                mtDialog({ text: fill(tx('delQ'), { n: v.n, o: it.name }), icon: '🔄', ok: tx('del'), cancel: tx('back') }).then(d => {
                    if (!d) return;
                    const o = loadS(); delete o[m.id + '|' + it.name]; saveS(o); renderMeds();
                });
            };
            info.appendChild(b);
        });
        let row = li.querySelector(':scope > .pl-row');
        if (!row) { row = document.createElement('div'); row.className = 'pl-row'; li.classList.add('pl-wrap'); li.appendChild(row); }
        const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-btn'; b.textContent = tx('btn');
        b.onclick = () => start(m);
        const w = document.createElement('button'); w.type = 'button'; w.className = 'sb-btn sb-what'; w.textContent = tx('what');
        w.onclick = () => start(m, true);
        row.appendChild(w); row.appendChild(b);
    };
    if (typeof renderMeds === 'function') try { renderMeds(); } catch (e) { }
    window.mtSubstCompare = compare; // for tests
    // M-187 (owner): checking a medicine / substitute is important: a big button on the main screen (scan the box or type)
    (function homeBtn() {
        const add = document.getElementById('main-add');
        if (!add || document.getElementById('sb-home')) return;
        const b = document.createElement('button'); b.type = 'button'; b.id = 'sb-home';
        b.innerHTML = '<span class="sbh-ico"><i>📷</i></span><span class="sbh-txt"><b></b><small></small></span>';
        const txt = () => { b.querySelector('b').textContent = tx('home'); b.querySelector('small').textContent = tx('homeSub'); };
        txt(); b.onclick = () => start(null);
        add.parentNode.insertBefore(b, add.nextSibling);
        const pr = window.moreRender; window.moreRender = function () { if (pr) pr(); txt(); };
        const st = document.createElement('style');
        st.textContent = `#sb-home{display:flex;align-items:center;gap:12px;width:100%;min-height:66px;border-radius:999px;padding:6px 18px 6px 8px;border:2px solid rgba(186,230,253,.75);
            background:linear-gradient(135deg,#0ea5e9,#1d4ed8);color:#fff;box-shadow:0 6px 0 #1e3a8a,0 10px 24px rgba(14,165,233,.45),inset 0 2px 0 rgba(255,255,255,.35);text-align:start;font:inherit}
        #sb-home:active{transform:translateY(3px);box-shadow:0 3px 0 #1e3a8a,0 6px 14px rgba(14,165,233,.4)}
        #sb-home .sbh-ico{flex:0 0 52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:1.7rem;background:radial-gradient(circle at 35% 28%,#fff,#bae6fd 45%,#0284c7)}
        #sb-home .sbh-txt{display:flex;flex-direction:column;line-height:1.2}
        #sb-home b{font-size:1.3rem;font-weight:800}#sb-home small{font-size:.9rem;opacity:.9}
        html.fit4 #sb-home{min-height:54px}html.fit4 #sb-home .sbh-ico{flex-basis:42px;height:42px}`;
        document.head.appendChild(st);
        if (typeof window.fitMain === 'function') setTimeout(window.fitMain, 100);
    })();
})();
