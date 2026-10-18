// M-036 (stage 2): doctor appointments. List screen, form with city / street autocomplete
// (Israeli streets from data.gov.il, geo.js), hospitals, saved doctors, health fund call centres,
// Waze / maps / call buttons, alarms in Android (Appointments.java).
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    // [he, ar, ro, fr, en]
    const TX = {
        apptTitle: ['תורים לרופא', 'مواعيد الطبيب', 'Programări la medic', 'Rendez-vous médicaux', 'Doctor appointments'],
        apptBtn: ['תורים לרופא', 'مواعيد الطبيب', 'Programări', 'Rendez-vous', 'Appointments'],
        apptNew: ['תור חדש', 'موعد جديد', 'Programare nouă', 'Nouveau rendez-vous', 'New appointment'],
        apptEdit: ['עריכת תור', 'تعديل الموعد', 'Editare programare', 'Modifier le rendez-vous', 'Edit appointment'],
        apptNone: ['אין תורים קרובים. לחצו על "תור חדש" כדי להוסיף.', 'لا توجد مواعيد قريبة. اضغط "موعد جديد" للإضافة.', 'Nicio programare. Apăsați „Programare nouă”.', 'Aucun rendez-vous. Touchez « Nouveau rendez-vous ».', 'No upcoming appointments. Tap "New appointment" to add one.'],
        apptPast: ['תורים שעברו', 'مواعيد سابقة', 'Programări trecute', 'Rendez-vous passés', 'Past appointments'],
        noAppt: ['אין תורים', 'لا مواعيد', 'Nicio programare', 'Aucun', 'None yet'],
        lType: ['סוג התור', 'نوع الموعد', 'Tipul programării', 'Type de rendez-vous', 'Type'],
        lDoctor: ['שם הרופא', 'اسم الطبيب', 'Numele medicului', 'Nom du médecin', "Doctor's name"],
        phDoctor: ['לדוגמה: ד״ר כהן', 'مثال: د. كوهين', 'ex.: Dr. Cohen', 'ex. : Dr Cohen', 'e.g. Dr. Cohen'],
        lWhen: ['מתי?', 'متى؟', 'Când?', 'Quand ?', 'When?'],
        today: ['היום', 'اليوم', 'Azi', "Aujourd'hui", 'Today'],
        tomorrow: ['מחר', 'غدًا', 'Mâine', 'Demain', 'Tomorrow'],
        otherDate: ['📅 תאריך אחר', '📅 تاريخ آخر', '📅 Altă dată', '📅 Autre date', '📅 Other date'],
        pickTime: ['⏰ שעת התור', '⏰ ساعة الموعد', '⏰ Ora programării', '⏰ Heure du rendez-vous', '⏰ Appointment time'],
        lFund: ['קופת חולים', 'صندوق المرضى', 'Casa de sănătate', 'Caisse maladie', 'Health fund'],
        lWhere: ['איפה?', 'أين؟', 'Unde?', 'Où ?', 'Where?'],
        phPlace: ['שם המקום (מרפאה / בית חולים)', 'اسم المكان (عيادة / مستشفى)', 'Locul (clinică / spital)', 'Lieu (cabinet / hôpital)', 'Place (clinic / hospital)'],
        phCity: ['עיר', 'المدينة', 'Oraș', 'Ville', 'City'],
        phStreet: ['רחוב', 'الشارع', 'Stradă', 'Rue', 'Street'],
        phHouse: ['מס׳', 'رقم', 'Nr.', 'N°', 'No.'],
        phPhone: ['📞 טלפון של המרפאה', '📞 هاتف العيادة', '📞 Telefonul clinicii', '📞 Téléphone du cabinet', '📞 Clinic phone'],
        lBefore: ['🔔 להזכיר לפני התור', '🔔 التذكير قبل الموعد', '🔔 Amintește-mi înainte cu', '🔔 Me rappeler avant', '🔔 Remind me before'],
        lTravel: ['🚗 זמן נסיעה: תזכורת "הגיע הזמן לצאת"', '🚗 مدة الطريق: تذكير "حان وقت الخروج"', '🚗 Timp de drum: memento „e timpul să pleci”', '🚗 Temps de trajet : rappel « il est temps de partir »', '🚗 Travel time: "time to leave" reminder'],
        phNotes: ['📝 הערות (לדוגמה: לבוא בצום)', '📝 ملاحظات (مثال: الحضور صائمًا)', '📝 Note (ex.: pe nemâncate)', '📝 Notes (ex. : venir à jeun)', '📝 Notes (e.g. come fasting)'],
        stWhat: ['1. איזה תור?', '1. أي موعد؟', '1. Ce programare?', '1. Quel rendez-vous ?', '1. What appointment?'],
        stWhen: ['2. באיזה יום?', '2. في أي يوم؟', '2. În ce zi?', '2. Quel jour ?', '2. Which day?'],
        stTime: ['3. באיזו שעה?', '3. في أي ساعة؟', '3. La ce oră?', '3. À quelle heure ?', '3. What time?'],
        stWhere: ['4. איפה?', '4. أين؟', '4. Unde?', '4. Où ?', '4. Where?'],
        stMore: ['5. טלפון והערות', '5. هاتف وملاحظات', '5. Telefon și note', '5. Téléphone et notes', '5. Phone and notes'],
        stNav: ['6. ניווט', '6. الملاحة', '6. Navigație', '6. Navigation', '6. Navigation'],
        stRemind: ['7. תזכורת וסיכום', '7. التذكير والملخص', '7. Memento și rezumat', '7. Rappel et résumé', '7. Reminder and summary'],
        optional: ['לא חובה. אפשר ללחוץ "הבא"', 'اختياري. يمكن الضغط "التالي"', 'Opțional. Poți apăsa „Înainte”', 'Facultatif. Vous pouvez appuyer sur « Suivant »', 'Optional. You can tap "Next"'],
        navAsk: ['רוצים לבדוק את הדרך בווייז?', 'هل تريد فحص الطريق في Waze؟', 'Verifici drumul în Waze?', 'Vérifier le trajet dans Waze ?', 'Check the route in Waze?'],
        next: ['הבא ⬅', 'التالي ⬅', 'Înainte ➡', 'Suivant ➡', 'Next ➡'],
        back: ['➡ הקודם', '➡ السابق', '⬅ Înapoi', '⬅ Retour', '⬅ Back'],
        hourL: ['שעה', 'ساعة', 'oră', 'heure', 'hour'], minL: ['דקות', 'دقائق', 'minute', 'minutes', 'minutes'],
        pickDay: ['בחרו יום', 'اختر اليوم', 'Alegeți ziua', 'Choisissez le jour', 'Choose the day'],
        navCheck: ['🚗 בדיקה ב-Waze', '🚗 فحص في Waze', '🚗 Verifică în Waze', '🚗 Vérifier dans Waze', '🚗 Check in Waze'],
        navNeed: ['🚗 כתבו מקום או כתובת לניווט', '🚗 اكتب مكانًا أو عنوانًا للملاحة', '🚗 Scrieți locul sau adresa', '🚗 Indiquez le lieu ou l’adresse', '🚗 Enter a place or address to navigate'],
        savedOk: ['✅ התור נשמר', '✅ تم حفظ الموعد', '✅ Programare salvată', '✅ Rendez-vous enregistré', '✅ Appointment saved'],
        save: ['💾 שמור תור', '💾 حفظ الموعد', '💾 Salvează', '💾 Enregistrer', '💾 Save appointment'],
        del: ['🗑️ מחק תור', '🗑️ حذف الموعد', '🗑️ Șterge', '🗑️ Supprimer', '🗑️ Delete'],
        confirmDel: ['למחוק את התור?', 'حذف الموعد؟', 'Ștergeți programarea?', 'Supprimer ce rendez-vous ?', 'Delete this appointment?'],
        needWhen: ['בחרו תאריך ושעה לתור', 'اختر التاريخ والساعة', 'Alegeți data și ora', "Choisissez la date et l'heure", 'Choose the date and time'],
        needWhat: ['כתבו שם רופא, סוג תור או מקום', 'اكتب اسم الطبيب أو النوع أو المكان', 'Scrieți medicul, tipul sau locul', 'Indiquez le médecin, le type ou le lieu', 'Enter a doctor, type or place'],
        pastWarn: ['השעה שבחרתם כבר עברה', 'الوقت الذي اخترته قد مضى', 'Ora aleasă a trecut deja', "L'heure choisie est déjà passée", 'That time has already passed'],
        none: ['בלי', 'بدون', 'Fără', 'Sans', 'None'],
        b15: ['15 דק׳', '15 دقيقة', '15 min', '15 min', '15 min'], b30: ['30 דק׳', '30 دقيقة', '30 min', '30 min', '30 min'],
        b45: ['45 דק׳', '45 دقيقة', '45 min', '45 min', '45 min'], b60: ['שעה', 'ساعة', '1 oră', '1 h', '1 hour'],
        b90: ['שעה וחצי', 'ساعة ونصف', '1,5 ore', '1 h 30', '1.5 hours'], b120: ['שעתיים', 'ساعتان', '2 ore', '2 h', '2 hours'],
        b180: ['3 שעות', '3 ساعات', '3 ore', '3 h', '3 hours'], b1440: ['יום לפני', 'قبل يوم', 'cu o zi înainte', 'la veille', 'a day before'],
        callFund: ['📞 מוקד', '📞 مركز', '📞 Centrul', '📞 Centre', '📞 Call centre'],
        todayBang: ['היום!', 'اليوم!', 'Azi!', "Aujourd'hui !", 'Today!'],
        inDays: ['בעוד %n ימים', 'بعد %n أيام', 'peste %n zile', 'dans %n jours', 'in %n days'],
        leaveAt: ['🚗 יציאה ב-%t', '🚗 الخروج الساعة %t', '🚗 Plecare la %t', '🚗 Départ à %t', '🚗 Leave at %t'],
        remindAt: ['🔔 תזכורת %s לפני', '🔔 تذكير قبل %s', '🔔 Memento cu %s înainte', '🔔 Rappel %s avant', '🔔 Reminder %s before'],
        waze: ['Waze', 'Waze', 'Waze', 'Waze', 'Waze'], maps: ['מפות', 'خرائط', 'Hărți', 'Cartes', 'Maps'], call: ['חיוג', 'اتصال', 'Sună', 'Appeler', 'Call'],
        edit: ['עריכה', 'تعديل', 'Editare', 'Modifier', 'Edit'],
        testAppt: ['🔔 בדיקת תזכורת תור (בעוד דקה)', '🔔 اختبار تذكير الموعد (بعد دقيقة)', '🔔 Testează memento (peste 1 minut)', '🔔 Tester le rappel (dans 1 minute)', '🔔 Test appointment reminder (in 1 minute)'],
        testAlert: ['תזכורת בדיקה לתור תגיע בעוד דקה. אפשר לסגור את האפליקציה.', 'سيصل تذكير تجريبي بعد دقيقة. يمكنك إغلاق التطبيق.', 'Un memento de test vine peste un minut. Puteți închide aplicația.', "Un rappel de test arrivera dans une minute. Vous pouvez fermer l'application.", 'A test appointment reminder will come in one minute. You can close the app.'],
        testDoc: ['ד״ר בדיקה', 'د. تجربة', 'Dr. Test', 'Dr Test', 'Dr. Test'],
        saved: ['⭐ שמור', '⭐ محفوظ', '⭐ salvat', '⭐ enregistré', '⭐ saved'],
        hosp: ['🏥 בית חולים', '🏥 مستشفى', '🏥 spital', '🏥 hôpital', '🏥 hospital']
    };
    const TYPES = [
        ['family', '🩺', ['רופא משפחה', 'طبيب العائلة', 'Medic de familie', 'Médecin traitant', 'Family doctor']],
        ['specialist', '👨‍⚕️', ['רופא מומחה', 'طبيب مختص', 'Medic specialist', 'Spécialiste', 'Specialist']],
        ['lab', '🧪', ['בדיקת דם', 'فحص دم', 'Analize', 'Prise de sang', 'Blood test']],
        ['imaging', '📷', ['בדיקת הדמיה', 'فحص تصوير', 'Imagistică', 'Imagerie', 'Imaging']],
        ['dentist', '🦷', ['רופא שיניים', 'طبيب أسنان', 'Dentist', 'Dentiste', 'Dentist']],
        ['vaccine', '💉', ['חיסון / טיפול', 'تطعيم / علاج', 'Vaccin / tratament', 'Vaccin / soin', 'Vaccine / treatment']],
        ['hospital', '🏥', ['בית חולים', 'مستشفى', 'Spital', 'Hôpital', 'Hospital']],
        ['other', '📋', ['אחר', 'آخر', 'Altul', 'Autre', 'Other']]
    ];
    // Health funds and their national call centres (from each fund's public site)
    const FUNDS = [
        ['clalit', ['כללית', 'كلاليت', 'Clalit', 'Clalit', 'Clalit'], '*2700', '#0ea5e9'],
        ['maccabi', ['מכבי', 'مكابي', 'Maccabi', 'Maccabi', 'Maccabi'], '*3555', '#2563eb'],
        ['meuhedet', ['מאוחדת', 'مئوحيدت', 'Meuhedet', 'Meuhedet', 'Meuhedet'], '*3833', '#f59e0b'],
        ['leumit', ['לאומית', 'لئوميت', 'Leumit', 'Leumit', 'Leumit'], '*507', '#10b981']
    ];
    // Main general hospitals: [Hebrew name, English name, city (Hebrew, as in the streets list)]
    const HOSPITALS = [
        ['המרכז הרפואי שיבא, תל השומר', 'Sheba Medical Center', 'רמת גן'], ['איכילוב (סוראסקי)', 'Ichilov (Sourasky)', 'תל אביב - יפו'],
        ['בילינסון (מרכז רפואי רבין)', 'Beilinson (Rabin)', 'פתח תקווה'], ['השרון (מרכז רפואי רבין)', 'HaSharon (Rabin)', 'פתח תקווה'],
        ['שניידר לילדים', "Schneider Children's", 'פתח תקווה'], ['הדסה עין כרם', 'Hadassah Ein Kerem', 'ירושלים'],
        ['הדסה הר הצופים', 'Hadassah Mount Scopus', 'ירושלים'], ['שערי צדק', 'Shaare Zedek', 'ירושלים'],
        ['רמב"ם', 'Rambam', 'חיפה'], ['בני ציון', 'Bnai Zion', 'חיפה'], ['כרמל', 'Carmel', 'חיפה'],
        ['סורוקה', 'Soroka', 'באר שבע'], ['אסותא אשדוד', 'Assuta Ashdod', 'אשדוד'], ['ברזילי', 'Barzilai', 'אשקלון'],
        ['קפלן', 'Kaplan', 'רחובות'], ['שמיר (אסף הרופא)', 'Shamir (Assaf Harofeh)', 'באר יעקב'], ['מאיר', 'Meir', 'כפר סבא'],
        ['לניאדו', 'Laniado', 'נתניה'], ['הלל יפה', 'Hillel Yaffe', 'חדרה'], ['וולפסון', 'Wolfson', 'חולון'],
        ['העמק', 'HaEmek', 'עפולה'], ['זיו', 'Ziv', 'צפת'], ['המרכז הרפואי לגליל', 'Galilee Medical Center', 'נהריה'],
        ['פוריה (ברוך פדה)', 'Poriya (Baruch Padeh)', 'טבריה'], ['מעייני הישועה', 'Mayanei HaYeshua', 'בני ברק'],
        ['אסותא רמת החייל', 'Assuta Ramat HaHayal', 'תל אביב - יפו'], ['יוספטל', 'Yoseftal', 'אילת'],
        ['לוינשטיין', 'Loewenstein', 'רעננה'], ['בית החולים האנגלי נצרת', 'Nazareth EMMS Hospital', 'נצרת'],
        ['בית החולים האיטלקי נצרת', 'Italian Hospital Nazareth', 'נצרת'], ['המשפחה הקדושה נצרת', 'Holy Family Hospital Nazareth', 'נצרת']
    ];
    const BEFORE = [15, 30, 60, 120, 180, 1440];
    const TRAVEL = [0, 15, 30, 45, 60, 90];

    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const tt = k => (TX[k] || [k])[li()] || TX[k][4];
    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const N = window.MedTimeNative || null;
    const $ = id => document.getElementById(id);
    const vib = ms => { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { } } };
    const locale = () => ({ he: 'he-IL', ar: 'ar', ro: 'ro-RO', fr: 'fr-FR', en: 'en-GB' })[L5[li()]];
    const typeOf = k => TYPES.find(x => x[0] === k) || TYPES[7];
    const typeText = a => a.type ? typeOf(a.type)[2][li()] : '';
    const fundOf = k => FUNDS.find(f => f[0] === k);
    const pad2 = n => String(n).padStart(2, '0');
    const isoDate = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    const whenOf = a => { const [y, m, d] = a.date.split('-').map(Number); const [h, mi] = (a.time || '09:00').split(':').map(Number); return new Date(y, m - 1, d, h, mi).getTime(); };
    const minsText = m => tt('b' + m);

    // ---------- storage ----------
    function load() { try { return JSON.parse(localStorage.getItem('medtime_appts') || '[]'); } catch (e) { return []; } }
    function save(list) {
        list.sort((a, b) => whenOf(a) - whenOf(b));
        try { localStorage.setItem('medtime_appts', JSON.stringify(list)); } catch (e) { }
        sync(list);
        render();
    }
    function sync(list) {
        if (!N || !N.syncAppointments) return;
        const now = Date.now();
        try {
            N.syncAppointments(JSON.stringify((list || load()).filter(a => whenOf(a) > now - 3600e3).map(a => Object.assign({}, a, { typeText: typeText(a) }))));
        } catch (e) { }
    }
    // Doctors / places the user already used: offered again with all their details
    function savedContacts() {
        try { return JSON.parse(localStorage.getItem('medtime_doctors') || '[]'); } catch (e) { return []; }
    }
    function rememberContact(a) {
        if (!a.doctor && !a.place) return;
        const key = (a.doctor + '|' + a.place).toLowerCase();
        const list = savedContacts().filter(c => (c.doctor + '|' + c.place).toLowerCase() !== key);
        list.unshift({ doctor: a.doctor, place: a.place, type: a.type, fund: a.fund, city: a.city, cityCode: a.cityCode, street: a.street, house: a.house, phone: a.phone });
        try { localStorage.setItem('medtime_doctors', JSON.stringify(list.slice(0, 60))); } catch (e) { }
    }
    // remove appointments that ended more than 30 days ago
    (function cleanup() {
        const l = load(), keep = l.filter(a => whenOf(a) > Date.now() - 30 * 864e5);
        if (keep.length !== l.length) { try { localStorage.setItem('medtime_appts', JSON.stringify(keep)); } catch (e) { } }
    })();

    // ---------- address helpers ----------
    function navQuery(a) {
        let s = ((a.street || '') + ' ' + (a.house || '')).trim();
        if (a.city) s = s ? s + ', ' + a.city : a.city;
        if (!a.street && a.place) s = s ? a.place + ', ' + s : a.place;
        return s;
    }
    function addressText(a) {
        let s = ((a.street || '') + ' ' + (a.house || '')).trim();
        if (a.city) s = s ? s + ', ' + a.city : a.city;
        return s;
    }
    window.apptNav = (i, how) => {
        const a = load()[i]; if (!a) return;
        const q = navQuery(a); if (!q) return;
        vib(15);
        if (how === 'maps') { if (N && N.openMaps) N.openMaps(q); else window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q)); }
        else { if (N && N.openWaze) N.openWaze(q); else window.open('https://waze.com/ul?navigate=yes&q=' + encodeURIComponent(q)); }
    };
    window.apptCall = i => {
        const a = load()[i]; if (!a || !a.phone) return;
        vib(15);
        if (N && N.dial) N.dial(a.phone); else location.href = 'tel:' + a.phone;
    };

    // ---------- geo data (loaded on first use, ~1 MB) ----------
    let geoReady = false, geoLoading = false;
    function loadGeo(cb) {
        if (geoReady) { cb && cb(); return; }
        if (geoLoading) { setTimeout(() => loadGeo(cb), 150); return; }
        geoLoading = true;
        const s = document.createElement('script');
        s.src = 'geo.js';
        s.onload = () => { geoReady = !!window.GEO_CITIES; geoLoading = false; cb && cb(); };
        s.onerror = () => { geoLoading = false; };
        document.body.appendChild(s);
    }
    const norm = s => String(s || '').toLowerCase().replace(/["'׳״`\-–().,]/g, ' ').replace(/\s+/g, ' ').trim();
    function score(name, q) {
        const n = norm(name);
        if (!q) return -1;
        if (n === q) return 0;
        if (n.startsWith(q)) return 1;
        if ((' ' + n).includes(' ' + q)) return 2;
        if (n.includes(q)) return 3;
        return -1;
    }
    function rank(items, q, keyFn, max) {
        const out = [];
        for (const it of items) {
            let best = -1;
            for (const k of keyFn(it)) { const sc = score(k, q); if (sc >= 0 && (best < 0 || sc < best)) best = sc; }
            if (best >= 0) out.push([best, it]);
        }
        out.sort((a, b) => a[0] - b[0] || String(keyFn(a[1])[0]).length - String(keyFn(b[1])[0]).length);
        return out.slice(0, max).map(x => x[1]);
    }
    const cityName = c => (L5[li()] === 'ar' && c[3]) ? c[3] : (L5[li()] === 'he' || !c[2]) ? c[1] : c[2];

    // ---------- suggestions box (opens above the field, best match nearest the field) ----------
    function attachSuggest(input, source) {
        const wrap = input.parentElement;
        const box = document.createElement('div');
        box.className = 'af-sug';
        wrap.appendChild(box);
        const close = () => box.classList.remove('open');
        const show = () => {
            const q = norm(input.value);
            const list = source(q);
            if (!list.length || document.activeElement !== input) { close(); return; }
            box.innerHTML = '';
            list.forEach(o => {
                const b = document.createElement('button');
                b.type = 'button';
                b.innerHTML = `<span class="ic">${o.icon || '📍'}</span><b></b>${o.sub ? '<small></small>' : ''}`;
                b.querySelector('b').textContent = o.label;
                if (o.sub) b.querySelector('small').textContent = o.sub;
                b.addEventListener('pointerdown', ev => { ev.preventDefault(); o.apply(); close(); vib(12); });
                box.appendChild(b);
            });
            box.classList.add('open');
        };
        input.addEventListener('input', show);
        input.addEventListener('focus', show);
        input.addEventListener('blur', () => setTimeout(close, 120));
        return show;
    }

    // ---------- form ----------
    let editIdx = -1, form = {};
    function blank() { return { type: 'family', doctor: '', date: '', time: '', fund: '', place: '', city: '', cityCode: 0, street: '', house: '', phone: '', before: 60, travel: 0, notes: '' }; }

    function chipRow(id, items, cur, onPick) {
        const box = $(id); box.innerHTML = '';
        items.forEach(([val, html, extra]) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'af-chip' + (String(val) === String(cur) ? ' sel' : '') + (extra ? ' ' + extra : '');
            b.innerHTML = html; b.dataset.v = val;
            b.onclick = () => { box.querySelectorAll('.af-chip').forEach(x => x.classList.toggle('sel', x === b)); vib(10); onPick(val); };
            box.appendChild(b);
        });
    }
    // M-042: the form is 4 short steps: what / when / where / reminders + summary
    let step = 0;
    const STEP_TITLES = ['stWhat', 'stWhen', 'stTime', 'stWhere', 'stMore', 'stNav', 'stRemind'];
    const LAST = STEP_TITLES.length - 1;
    function drawForm() {
        $('af-title').textContent = tt(editIdx >= 0 ? 'apptEdit' : 'apptNew');
        document.querySelectorAll('#appt-form-page [data-tx]').forEach(el => { el.textContent = tt(el.dataset.tx); });
        document.querySelectorAll('#appt-form-page [data-txph]').forEach(el => { el.placeholder = tt(el.dataset.txph); });
        chipRow('af-types', TYPES.map(x => [x[0], `<span class="big">${x[1]}</span><span>${esc(x[2][li()])}</span>`, 'type']), form.type, v => { form.type = v; });
        chipRow('af-funds', [['', esc(tt('none'))]].concat(FUNDS.map(f => [f[0], esc(f[1][li()])])), form.fund || '', v => { form.fund = v; drawFundCall(); });
        chipRow('af-before', BEFORE.map(m => [m, esc(minsText(m))]), form.before, v => { form.before = +v; drawSummary(); });
        chipRow('af-travel', TRAVEL.map(m => [m, esc(m ? minsText(m) : tt('none'))]), form.travel, v => { form.travel = +v; drawSummary(); });
        chipRow('tp-quick', ['08:00', '09:00', '10:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map(v => [v, v]), form.time, v => { form.time = v; drawWhen(); });
        ['doctor', 'place', 'city', 'street', 'house', 'phone', 'notes'].forEach(k => { $('af-' + k).value = form[k] || ''; });
        drawWhen(); drawFundCall(); drawNavTest(); drawStep();
    }
    function drawStep() {
        document.querySelectorAll('#appt-form-page .wz-step').forEach(el => el.classList.toggle('on', +el.dataset.step === step));
        $('wz-step-title').textContent = tt(STEP_TITLES[step]);
        const dots = $('wz-dots'); dots.innerHTML = '';
        for (let i = 0; i <= LAST; i++) {
            const d = document.createElement('button');
            d.type = 'button'; d.textContent = i + 1;
            d.className = i === step ? 'cur' : (i < step ? 'done' : '');
            d.onclick = () => { readFields(); step = i; drawStep(); };
            dots.appendChild(d);
        }
        $('wz-back').disabled = step === 0;
        $('wz-back').textContent = tt('back');
        const nx = $('wz-next');
        nx.textContent = step === LAST ? tt('save') : tt('next');
        nx.classList.toggle('save', step === LAST);
        if (step === LAST) drawSummary();
        if (step === 5) drawNavTest();
        $('appt-form-page').querySelector('.wz-body').scrollTop = 0;
    }
    window.wzGo = function (d) {
        readFields();
        if (d > 0 && (step === 1 || step === 2) && (!form.date || !form.time)) {
            if (!form.date) { form.date = isoDate(new Date()); }
            if (!form.time) { form.time = '09:00'; }
            drawWhen();
        }
        if (d > 0 && step === LAST) { apptSave(); return; }
        step = Math.max(0, Math.min(LAST, step + d));
        vib(10);
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        drawStep();
    };
    function drawFundCall() {
        const f = fundOf(form.fund), b = $('af-fundcall');
        if (!f) { b.style.display = 'none'; return; }
        b.style.display = '';
        b.textContent = '📞 ' + f[2];
        b.onclick = () => { $('af-phone').value = f[2]; form.phone = f[2]; vib(10); };
    }
    function drawNavTest() {
        readFields();
        const q = navQuery(form), b = $('af-navtest');
        b.disabled = !q;
        b.textContent = q ? tt('navCheck') + ': ' + q : tt('navNeed');
        b.onclick = () => { if (!q) return; vib(15); if (N && N.openWaze) N.openWaze(q); else window.open('https://waze.com/ul?navigate=yes&q=' + encodeURIComponent(q)); };
    }
    function drawSummary() {
        readFields();
        const box = $('af-summary');
        if (!box) return;
        if (!form.date || !form.time) { box.innerHTML = ''; return; }
        const ty = TYPES.find(x => x[0] === form.type);
        const lines = [
            '<div class="s-when">📅 ' + esc(new Date(whenOf(form)).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' })) + ' · ⏰ ' + esc(form.time) + '</div>',
            '<div>' + (ty ? ty[1] + ' ' + esc(ty[2][li()]) : '🩺') + (form.doctor ? ' · ' + esc(form.doctor) : '') + '</div>'
        ];
        const ad = addressText(form); if (ad) lines.push('<div>📍 ' + esc(ad) + '</div>');
        if (form.phone) lines.push('<div>📞 ' + esc(form.phone) + '</div>');
        lines.push('<div>🔔 ' + esc(minsText(form.before)) + '</div>');
        if (form.travel) lines.push('<div>🚗 ' + esc(minsText(form.travel)) + '</div>');
        box.innerHTML = '<div class="af-sum">' + lines.join('') + '</div>';
    }
    // inline time: ▲ / ▼ for hour and minutes (tap = 1 step, hold = repeat)
    function curHM() { const [h, m] = (form.time || '09:00').split(':').map(Number); return [h, m]; }
    function stepTime(code) {
        let [h, m] = curHM();
        const n = parseInt(code.slice(1), 10);
        if (code[0] === 'h') h = (h + n + 24) % 24;
        else { m = Math.round(m / 5) * 5 + n; if (m >= 60) { m = 0; h = (h + 1) % 24; } if (m < 0) { m = 55; h = (h + 23) % 24; } }
        form.time = pad2(h) + ':' + pad2(m);
        vib(8); drawWhen();
    }
    document.querySelectorAll('.tp-btn').forEach(b => {
        let tm = null, iv = null;
        const stop = () => { clearTimeout(tm); clearInterval(iv); };
        b.addEventListener('pointerdown', e => {
            e.preventDefault(); stepTime(b.dataset.tp);
            tm = setTimeout(() => { iv = setInterval(() => stepTime(b.dataset.tp), 130); }, 450);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
    });
    function drawWhen() {
        if (!form.time) form.time = '09:00';
        const t0 = new Date(), t1 = new Date(Date.now() + 864e5);
        const isT = form.date === isoDate(t0), isM = form.date === isoDate(t1);
        $('af-today').classList.toggle('sel', isT);
        $('af-tomorrow').classList.toggle('sel', isM);
        const other = $('af-other');
        other.classList.toggle('sel', !!form.date && !isT && !isM);
        other.querySelector('span').textContent = (!!form.date && !isT && !isM)
            ? '📅 ' + new Date(whenOf({ date: form.date, time: '12:00' })).toLocaleDateString(locale(), { weekday: 'short', day: 'numeric', month: 'short' })
            : tt('otherDate');
        const [h, m] = curHM();
        $('tp-h').textContent = pad2(h); $('tp-m').textContent = pad2(m);
        $('tp-quick').querySelectorAll('.af-chip').forEach(x => x.classList.toggle('sel', x.dataset.v === form.time));
        drawDays();
        $('af-day-text').textContent = form.date ? '📅 ' + new Date(whenOf({ date: form.date, time: '12:00' })).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }) : tt('pickDay');
        $('af-when-text').textContent = form.date
            ? '📅 ' + new Date(whenOf(form)).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ⏰ ' + form.time
            : tt('pickDay');
    }
    function drawDays() {
        const box = $('af-days'); if (!box) return;
        box.innerHTML = '';
        for (let n = 2; n < 14; n++) {
            const d = new Date(Date.now() + n * 864e5), iso = isoDate(d);
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'af-chip' + (form.date === iso ? ' sel' : '');
            b.innerHTML = '<span>' + esc(d.toLocaleDateString(locale(), { weekday: 'short' })) + '</span><b>' + d.getDate() + '</b><span>' + esc(d.toLocaleDateString(locale(), { month: 'short' })) + '</span>';
            b.onclick = () => { form.date = iso; vib(10); drawWhen(); };
            box.appendChild(b);
        }
    }
    function readFields() {
        ['doctor', 'place', 'city', 'street', 'house', 'phone', 'notes'].forEach(k => { form[k] = $('af-' + k).value.trim(); });
    }
    // M-046: "Next" on the keyboard goes to the next field, or to the next step
    const ENTER_NEXT = { 'af-doctor': 'step', 'af-place': 'af-city', 'af-city': 'af-street', 'af-street': 'af-house', 'af-house': 'step', 'af-phone': 'af-notes', 'af-notes': 'step' };
    document.addEventListener('keydown', e => {
        if (e.key !== 'Enter' || !e.target || !ENTER_NEXT[e.target.id]) return;
        e.preventDefault();
        const nx = ENTER_NEXT[e.target.id];
        if (nx === 'step') { e.target.blur(); wzGo(1); } else { const el = $(nx); if (el) el.focus(); }
    });
    window.openApptForm = function (idx) {
        editIdx = typeof idx === 'number' ? idx : -1;
        form = editIdx >= 0 ? Object.assign(blank(), load()[editIdx]) : blank();
        if (!form.time) form.time = '09:00';
        step = 0;
        drawForm();
        $('af-delete').style.display = editIdx >= 0 ? '' : 'none';
        $('appt-form-page').classList.add('open');
        loadGeo();
    };
    window.closeApptForm = function () { $('appt-form-page').classList.remove('open'); };
    window.apptSetDay = function (n) {
        form.date = isoDate(new Date(Date.now() + n * 864e5));
        vib(10); drawWhen();
    };
    window.apptSave = function () {
        readFields();
        if (!form.date || !form.time) { alert(tt('needWhen')); step = 1; drawStep(); return; }
        if (!form.doctor && !form.place && !form.type) { alert(tt('needWhat')); return; }
        if (whenOf(form) < Date.now() && !confirm(tt('pastWarn') + '. OK?')) return;
        const list = load();
        if (!form.id) form.id = list.reduce((m, a) => Math.max(m, a.id || 0), 0) % 99000 + 1;
        if (editIdx >= 0) list[editIdx] = form; else list.push(form);
        rememberContact(form);
        save(list);
        closeApptForm();
        toast(tt('savedOk'));
        if (typeof playChime === 'function') playChime();
        vib([20, 40, 20]);
    };
    function toast(msg) {
        const d = document.createElement('div');
        d.className = 'mt-toast'; d.textContent = msg;
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 2700);
    }
    window.apptDelete = function (idx) {
        const i = typeof idx === 'number' ? idx : editIdx;
        if (i < 0 || !confirm(tt('confirmDel'))) return;
        const list = load(); list.splice(i, 1); save(list);
        closeApptForm();
    };

    // ---------- list screen ----------
    window.openApptPage = function () { render(); $('appt-page').classList.add('open'); };
    window.closeApptPage = function () { $('appt-page').classList.remove('open'); };
    function countdown(a) {
        const d0 = new Date(); d0.setHours(0, 0, 0, 0);
        const w = new Date(whenOf(a)); w.setHours(0, 0, 0, 0);
        const days = Math.round((w - d0) / 864e5);
        if (days === 0) return ['now', tt('todayBang')];
        if (days === 1) return ['soon', tt('tomorrow')];
        return [days <= 7 ? 'week' : '', tt('inDays').replace('%n', days)];
    }
    function card(a, i, past) { return cardHtml(a, i, past, false); }
    function cardHtml(a, i, past, preview) {
        const w = new Date(whenOf(a)), loc = locale();
        const [cls, cd] = past ? ['', ''] : countdown(a);
        const ty = typeOf(a.type);
        const addr = addressText(a), q = navQuery(a);
        const fund = fundOf(a.fund);
        let leave = '';
        if (!past && a.travel) { const d = new Date(whenOf(a) - a.travel * 60000); leave = tt('leaveAt').replace('%t', pad2(d.getHours()) + ':' + pad2(d.getMinutes())); }
        return `<div class="ap-card${past ? ' past' : ''}">
            <div class="ap-date"><span class="wd">${esc(w.toLocaleDateString(loc, { weekday: 'short' }))}</span><span class="dn">${w.getDate()}</span><span class="mo">${esc(w.toLocaleDateString(loc, { month: 'short' }))}</span></div>
            <div class="ap-body">
                ${cd ? `<span class="ap-cd ${cls}">${esc(cd)}</span>` : ''}
                <div class="ap-time">⏰ ${esc(a.time)}</div>
                <div class="ap-what">${ty[1]} ${esc(typeText(a))}${a.doctor ? ' · ' + esc(a.doctor) : ''}</div>
                ${a.place ? `<div class="ap-line">🏥 ${esc(a.place)}</div>` : ''}
                ${addr ? `<div class="ap-line">📍 ${esc(addr)}</div>` : ''}
                ${fund ? `<div class="ap-line">💳 ${esc(fund[1][li()])}</div>` : ''}
                ${a.notes ? `<div class="ap-line">📝 ${esc(a.notes)}</div>` : ''}
                ${leave ? `<div class="ap-line ap-leave">${esc(leave)}</div>` : ''}
                ${!past && a.before ? `<div class="ap-line ap-rem">${esc(tt('remindAt').replace('%s', minsText(a.before)))}</div>` : ''}
                ${preview ? '' : `<div class="ap-acts">
                    ${q && !past ? `<button type="button" class="ap-act waze" onclick="apptNav(${i},'waze')">🚗 ${esc(tt('waze'))}</button><button type="button" class="ap-act" onclick="apptNav(${i},'maps')">🗺️ ${esc(tt('maps'))}</button>` : ''}
                    ${a.phone ? `<button type="button" class="ap-act call" onclick="apptCall(${i})">📞 ${esc(tt('call'))}</button>` : ''}
                    <button type="button" class="ap-act" onclick="openApptForm(${i})">✏️ ${esc(tt('edit'))}</button>
                    <button type="button" class="ap-act del" onclick="apptDelete(${i})" aria-label="delete">🗑️</button>
                </div>`}
            </div>
        </div>`;
    }
    function render() {
        const list = load(), now = Date.now();
        const up = [], past = [];
        list.forEach((a, i) => (whenOf(a) >= now - 3600e3 ? up : past).push([a, i]));
        const box = $('appt-list');
        if (box) {
            let html = up.length ? up.map(([a, i]) => card(a, i, false)).join('') : `<div class="ap-empty">${esc(tt('apptNone'))}</div>`;
            if (past.length) html += `<div class="ap-sep">${esc(tt('apptPast'))}</div>` + past.reverse().map(([a, i]) => card(a, i, true)).join('');
            box.innerHTML = html;
        }
        document.querySelectorAll('#appt-page [data-tx]').forEach(el => { el.textContent = tt(el.dataset.tx); });
        // main screen button
        const btn = $('appt-btn');
        if (btn) {
            const next = up[0] && up[0][0];
            let sub = tt('noAppt');
            if (next) {
                const [, cd] = countdown(next);
                sub = cd + ' ' + next.time;
            }
            btn.innerHTML = `<span class="ab-ico">🩺</span><span class="ab-txt"><span class="ab-title"></span><span class="ab-sub"></span></span>${up.length ? `<span class="lb-count ab-count">${up.length}</span>` : ''}`;
            btn.querySelector('.ab-title').textContent = tt('apptBtn');
            btn.querySelector('.ab-sub').textContent = sub;
        }
    }
    window.apptRender = function () { render(); sync(); if ($('appt-form-page').classList.contains('open')) { readFields(); drawForm(); } };
    window.apptTest = function () {
        if (!N || !N.testAppointment) return;
        const now = new Date(Date.now() + 3600e3);
        N.testAppointment(JSON.stringify({ id: 99999, type: 'family', typeText: typeOf('family')[2][li()], doctor: tt('testDoc'), date: isoDate(now), time: pad2(now.getHours()) + ':' + pad2(now.getMinutes()), place: 'שערי צדק', city: 'ירושלים', street: '', house: '', phone: '*2700', before: 60, travel: 0, notes: '' }), 60);
        alert(tt('testAlert'));
    };

    // ---------- autocomplete wiring ----------
    function init() {
        const fDoctor = $('af-doctor'), fPlace = $('af-place'), fCity = $('af-city'), fStreet = $('af-street');
        const applyContact = c => {
            ['doctor', 'place', 'city', 'street', 'house', 'phone'].forEach(k => { if (c[k] != null) { form[k] = c[k]; $('af-' + k).value = c[k]; } });
            if (c.cityCode) form.cityCode = c.cityCode;
            if (c.type) form.type = c.type;
            if (c.fund) form.fund = c.fund;
            readFields(); drawForm();
        };
        attachSuggest(fDoctor, q => q.length < 1 ? [] : rank(savedContacts().filter(c => c.doctor), q, c => [c.doctor], 6)
            .map(c => ({ icon: '⭐', label: c.doctor, sub: [c.place, c.city].filter(Boolean).join(' · '), apply: () => applyContact(c) })));
        attachSuggest(fPlace, q => {
            if (q.length < 2) return [];
            const own = rank(savedContacts().filter(c => c.place), q, c => [c.place], 3)
                .map(c => ({ icon: '⭐', label: c.place, sub: [c.doctor, c.city].filter(Boolean).join(' · '), apply: () => applyContact(Object.assign({}, c, { doctor: form.doctor || c.doctor })) }));
            const hosp = rank(HOSPITALS, q, h => [h[0], h[1]], 5).map(h => ({
                icon: '🏥', label: L5[li()] === 'he' ? h[0] : h[1] + ' · ' + h[0], sub: h[2],
                apply: () => {
                    form.place = h[0]; fPlace.value = h[0]; form.city = h[2]; fCity.value = h[2];
                    const c = (window.GEO_CITIES || []).find(x => x[1] === h[2]); form.cityCode = c ? c[0] : 0;
                    if (!form.type || form.type === 'family') { form.type = 'hospital'; drawForm(); }
                }
            }));
            return own.concat(hosp).slice(0, 6);
        });
        attachSuggest(fCity, q => {
            if (!geoReady) { loadGeo(() => fCity.dispatchEvent(new Event('input'))); return []; }
            if (!q) return [];
            return rank(window.GEO_CITIES, q, c => [c[1], c[2], c[3]], 6).map(c => ({
                icon: '🏙️', label: cityName(c), sub: cityName(c) === c[1] ? (c[2] || '') : c[1],
                apply: () => { form.city = cityName(c); form.cityCode = c[0]; fCity.value = form.city; setTimeout(() => fStreet.focus(), 50); }
            }));
        });
        fCity.addEventListener('input', () => { form.cityCode = 0; });
        const streetsOf = code => {
            const s = window.GEO_STREETS && window.GEO_STREETS[String(code)];
            return s ? (typeof s === 'string' ? (window.GEO_STREETS[String(code)] = s.split('|')) : s) : [];
        };
        attachSuggest(fStreet, q => {
            if (!geoReady) { loadGeo(() => fStreet.dispatchEvent(new Event('input'))); return []; }
            let code = form.cityCode;
            if (!code && fCity.value.trim()) {
                const c = rank(window.GEO_CITIES, norm(fCity.value), c => [c[1], c[2], c[3]], 1)[0];
                if (c && norm(cityName(c)) === norm(fCity.value)) { code = form.cityCode = c[0]; }
            }
            if (!code || !q) return [];
            return rank(streetsOf(code), q, s => [s], 6).map(s => ({
                icon: '🛣️', label: s,
                apply: () => { form.street = s; fStreet.value = s; setTimeout(() => $('af-house').focus(), 50); }
            }));
        });
        // other date: native date picker hidden under the chip
        $('af-date').addEventListener('change', e => { if (e.target.value) { form.date = e.target.value; drawWhen(); } });
        $('af-other').addEventListener('click', () => {
            const d = $('af-date');
            d.value = form.date || isoDate(new Date());
            d.min = isoDate(new Date());
            try { d.showPicker(); } catch (e) { d.focus(); d.click(); }
        });
        render();
        sync();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
