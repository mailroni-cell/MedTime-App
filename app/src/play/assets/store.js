// Google Play edition ("play" flavor only; the full edition has an empty store.js).
// MyTime is a general daily reminders app: no medicine features, no medicine wording, no medicine pictures.
// Loaded first in <head>: sets the flag the other scripts read, hides what the Play edition does not have,
// rewrites medicine wording to reminder wording in all 6 languages, and gives the home screen its own layout.
(function () {
    'use strict';
    window.MT_STORE = true;
    const L6 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L6.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const PLAY = 'https://play.google.com/store/apps/details?id=io.github.mailronicell.medtime';

    // ---------- 1. what the Play edition does not have ----------
    const HIDE = [
        '#sb-home', '#vt-btn', '#fa-home', '#appt-btn',           // medicine check, vitals, first aid, doctor appointments
        '#tile-vitals', '#tile-stock', '#tile-upd', '#lg-pdf',    // vitals, pill stock, self-update, report for the doctor
        '#row-dose', '#dose-sheet', '.type-grid', '.dose-wrap', '.dose-units', '.sug-dose',
        '#splash .sp-ecg', '#splash .sp-cap', '.mt-word', '.lg-ecg', '.ba-ecg',
        '.sb-btn', '.sb-now'                                       // "what is this medicine" and "I got a substitute" on the cards
    ];
    const css = document.createElement('style');
    css.id = 'mt-store-css';
    css.textContent = HIDE.map(x => 'html body ' + x + ', html body .home-card .hm-float > ' + x).join(',') + '{display:none!important}' + `
    /* add button: a blue plus (not a red cross) */
    html body .ba-cross path{fill:#38bdf8!important;stroke:#e0f2fe!important;stroke-linejoin:round}
    html body #main-add{--c1:#e0e7ff;--c2:#6366f1;--c3:#312e81}
    /* the logo as text (the drawn logo spells the full edition's name) */
    .st-logo{font-family:'MTLogo2','MTLogo','Segoe UI',sans-serif;direction:ltr;display:inline-block;line-height:1.05;
      background:linear-gradient(180deg,#ffffff 0,#a5f3fc 45%,#38bdf8 70%,#818cf8 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
      filter:drop-shadow(0 3px 0 #083344) drop-shadow(0 0 14px rgba(56,189,248,.65))}
    h1.mt-logo .st-logo{font-size:1em}
    #splash .sp-title .st-logo{font-size:1em;animation:stLogo 1.4s cubic-bezier(.2,1.4,.4,1) 2.4s both}
    @keyframes stLogo{0%{opacity:0;transform:scale(.4) translateY(30px)}100%{opacity:1;transform:none}}
    /* round glossy orbs instead of capsules behind the menu symbols */
    html body .home-card .hm-float .hm-pill{width:calc(var(--hm-o,118px) * 1.12)!important;height:calc(var(--hm-o,118px) * 1.12)!important;border-radius:50%!important}
    html body #settings-page .sp-pill{width:calc(var(--sp-o) * .95)!important;height:calc(var(--sp-o) * .95)!important;border-radius:50%!important}
    /* home: next-reminder card on top, then add, then my reminders + calm side by side */
    html body .home-card .hm-float > #list-btn, html body .home-card .hm-float > #relax-btn{grid-column:span 3!important}
    #st-next{grid-column:1 / -1;order:-1;display:flex;align-items:center;gap:14px;box-sizing:border-box;width:100%;margin:0 0 4px;padding:12px 16px;border-radius:26px;
      color:#f8fafc;cursor:pointer;-webkit-tap-highlight-color:transparent;text-align:start;
      background:linear-gradient(135deg,rgba(14,116,144,.55),rgba(76,29,149,.5));border:2px solid rgba(165,243,252,.55);
      box-shadow:0 10px 26px -8px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.35),0 0 22px rgba(56,189,248,.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
    #st-next:active{transform:scale(.97)}
    #st-next .sn-ring{flex:0 0 auto;width:74px;height:74px;position:relative}
    #st-next .sn-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
    #st-next .sn-ring circle{fill:none;stroke-width:9;stroke-linecap:round}
    #st-next .sn-ring .bg{stroke:rgba(255,255,255,.18)}
    #st-next .sn-ring .fg{stroke:url(#st-grad);transition:stroke-dashoffset .8s ease}
    #st-next .sn-num{position:absolute;inset:0;display:grid;place-items:center;font-weight:900;font-size:1.05rem;direction:ltr}
    #st-next .sn-txt{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:2px}
    #st-next .sn-k{font-size:.92rem;opacity:.85;font-weight:700}
    #st-next .sn-t{font-size:2rem;font-weight:900;line-height:1.05;direction:ltr;text-align:start;text-shadow:0 0 12px rgba(56,189,248,.8)}
    #st-next .sn-n{font-size:1.02rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #st-next .sn-in{font-size:.92rem;font-weight:700;color:#fde68a}
    html.lowvision #st-next{background:#000!important;border-color:#ffeb3b!important;color:#ffeb3b!important;backdrop-filter:none!important}
    html.lowvision #st-next .sn-t{text-shadow:none;color:#ffeb3b}
    #st-sug{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px 0 4px}
    #st-sug button{border:1.5px solid rgba(165,243,252,.45);background:rgba(14,116,144,.35);color:#fff;border-radius:999px;padding:10px 14px;font-size:1.05rem;font-weight:700}
    #st-sug button:active{transform:scale(.95)}
    html.lowvision #st-sug button{background:#000;border-color:#ffeb3b;color:#ffeb3b}`;
    (document.head || document.documentElement).appendChild(css);

    // ---------- 2. reminder wording instead of medicine wording ----------
    // [from, to] in order (longer first). Every "to" is free of every "from", so running twice changes nothing.
    const W = {
        he: [['MedTime', 'MyTime'], ['מה שם התרופה?', 'על מה להזכיר לך?'], ['שם התרופה', 'על מה להזכיר? (למשל: לשתות מים)'], ['💊', '⏰'], ['💉', '⏰'], ['🩺', '✅'], ['התרופות', 'התזכורות'], ['תרופות', 'תזכורות'], ['התרופה', 'התזכורת'], ['תרופה', 'תזכורת'],
            ['תרופת', 'תזכורת'], ['כדורים', 'תזכורות'], ['הכדור', 'התזכורת'], ['כדור', 'תזכורת'], ['שלקחתם', 'שביצעתם'], ['שלקחת', 'שביצעת'], ['לקחתי', 'ביצעתי'],
            ['לקחתם', 'ביצעתם'], ['לקחת', 'לבצע'], ['לקחו', 'ביצעו'], ['לוקח', 'מבצע'], ['נלקחה', 'בוצעה'], ['נלקחו', 'בוצעו'], ['נלקח', 'בוצע'], ['לקיחת', 'ביצוע'],
            ['לקיחה', 'ביצוע'], ['המינון', 'הפרטים'], ['מינון', 'פרטים']],
        ar: [['MedTime', 'MyTime'], ['ما اسم الدواء؟', 'بماذا نذكّرك؟'], ['اسم الدواء', 'بماذا نذكّرك؟ (مثلًا: شرب الماء)'], ['💊', '⏰'], ['💉', '⏰'], ['🩺', '✅'], ['الأدوية', 'التذكيرات'], ['أدوية', 'تذكيرات'], ['الدواء', 'التذكير'], ['دواء', 'تذكير'],
            ['تناولتها', 'أنجزتها'], ['تناولته', 'أنجزته'], ['تناولت', 'أنجزت'], ['تناول', 'إنجاز'], ['الحبوب', 'التذكيرات'], ['حبة', 'تذكير'], ['الجرعة', 'التفاصيل'], ['جرعة', 'تفاصيل']],
        ro: [['MedTime', 'MyTime'], ['Numele medicamentului?', 'Ce să vă amintim?'], ['Numele medicamentului', 'Ce să vă amintim? (ex.: să beți apă)'], ['💊', '⏰'], ['💉', '⏰'], ['🩺', '✅'], ['medicamentelor', 'mementourilor'], ['medicamentele', 'mementourile'], ['medicamentul', 'mementoul'],
            ['medicamente', 'mementouri'], ['Medicamente', 'Mementouri'], ['medicament', 'memento'], ['Medicament', 'Memento'], ['pastilele', 'mementourile'], ['pastila', 'mementoul'],
            ['pastile', 'mementouri'], ['pastilă', 'memento'], ['Am luat', 'Gata'], ['Luat', 'Făcut'], ['luat', 'făcut'], ['doza', 'detaliile'], ['doză', 'detalii'], ['Doza', 'Detalii']],
        fr: [['MedTime', 'MyTime'], ['Nom du médicament ?', 'De quoi se souvenir ?'], ['Nom du médicament', 'De quoi se souvenir ? (ex. : boire de l’eau)'], ['💊', '⏰'], ['💉', '⏰'], ['🩺', '✅'], ['médicaments', 'rappels'], ['Médicaments', 'Rappels'], ['médicament', 'rappel'], ['Médicament', 'Rappel'],
            ['comprimés', 'rappels'], ['comprimé', 'rappel'], ['Déjà pris', 'Déjà fait'], ['Je l’ai pris', 'C’est fait'], ['Oui, pris', 'Oui, fait'], ['Pris', 'Fait'], [' pris', ' fait'],
            ['la dose', 'le détail'], ['dose', 'détail']],
        en: [['MedTime', 'MyTime'], ['Medicine name?', 'What should I remind you about?'], ['Medicine name', 'What to remind you about? (e.g. drink water)'], ['💊', '⏰'], ['💉', '⏰'], ['🩺', '✅'], ['medications', 'reminders'], ['Medications', 'Reminders'], ['medication', 'reminder'], ['Medication', 'Reminder'],
            ['medicines', 'reminders'], ['Medicines', 'Reminders'], ['medicine', 'reminder'], ['Medicine', 'Reminder'], ['pills', 'reminders'], ['pill', 'reminder'], ['Pill', 'Reminder'],
            ['Taken', 'Done'], ['taken', 'done'], ['took', 'did'], ['take your', 'do your'], ['doses', 'notes'], ['dose', 'note'], ['Dose', 'Note']],
        ru: [['MedTime', 'MyTime'], ['Название лекарства?', 'О чём напомнить?'], ['Название лекарства', 'О чём напомнить? (например: выпить воды)'], ['💊', '⏰'], ['💉', '⏰'], ['🩺', '✅'], ['лекарствами', 'напоминаниями'], ['лекарствам', 'напоминаниям'], ['лекарством', 'напоминанием'],
            ['лекарства', 'напоминания'], ['лекарство', 'напоминание'], ['лекарств', 'напоминаний'], ['Лекарства', 'Напоминания'], ['Лекарство', 'Напоминание'],
            ['таблетки', 'напоминания'], ['таблетку', 'напоминание'], ['таблетка', 'напоминание'], ['Принял(а)', 'Сделал(а)'], ['Принял', 'Сделал'], ['принял', 'сделал'],
            ['Принято', 'Сделано'], ['принять', 'сделать'], ['Пора принять', 'Пора'], ['дозу', 'детали'], ['доза', 'детали'], ['Доза', 'Детали']]
    };
    // the name of the app is the same in every language
    function fix(s) {
        if (!s) return s;
        let o = s;
        const list = W[L6[li()]] || W.he;
        for (const [a, b] of list) if (o.indexOf(a) >= 0) o = o.split(a).join(b);
        if (o.indexOf('MedTime') >= 0) o = o.split('MedTime').join('MyTime');
        return o;
    }
    window.mtStoreFix = fix;
    // what the user wrote stays exactly as written
    const OWN = '#st-sug, .med-item li, .chip-txt, .it-chip, .suggest, .lg-list, .ap-card, #fm-name, script, style, textarea';
    const ATTRS = ['placeholder', 'title', 'aria-label'];
    function fixAttrs(el) {
        if (!el.getAttribute || (el.closest && el.closest('.med-item li, .chip-txt, .suggest, .lg-list'))) return;
        for (const a of ATTRS) {
            const v = el.getAttribute(a);
            if (v) { const f = fix(v); if (f !== v) el.setAttribute(a, f); }
        }
    }
    function fixText(n) {
        const p = n.parentElement;
        if (!p || p.closest(OWN)) return;
        const v = fix(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v;
    }
    function fixNode(n) {
        if (n.nodeType === 3) { fixText(n); return; }
        if (n.nodeType !== 1) return;
        fixAttrs(n);
        if (n.closest(OWN)) return;
        const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
            acceptNode: x => x.nodeType === 1 && x.matches(OWN) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        for (let c = w.nextNode(); c; c = w.nextNode()) { if (c.nodeType === 3) fixText(c); else fixAttrs(c); }
    }

    // ---------- 2b. quick ideas under the name field of a new reminder (one tap fills it) ----------
    const SUG = [
        ['💧 לשתות מים', '🚶 הליכה', '📞 להתקשר למשפחה', '🍽️ ארוחה', '🏋️ תרגילים', '🌱 להשקות עציצים', '🐕 להוציא את הכלב', '😴 ללכת לישון'],
        ['💧 شرب الماء', '🚶 المشي', '📞 الاتصال بالعائلة', '🍽️ وجبة', '🏋️ تمارين', '🌱 سقي النباتات', '🐕 إخراج الكلب', '😴 وقت النوم'],
        ['💧 Să beau apă', '🚶 Plimbare', '📞 Sun familia', '🍽️ Masa', '🏋️ Exerciții', '🌱 Ud florile', '🐕 Plimb câinele', '😴 La culcare'],
        ['💧 Boire de l’eau', '🚶 Marcher', '📞 Appeler la famille', '🍽️ Repas', '🏋️ Exercices', '🌱 Arroser les plantes', '🐕 Sortir le chien', '😴 Se coucher'],
        ['💧 Drink water', '🚶 Walk', '📞 Call family', '🍽️ Meal', '🏋️ Exercise', '🌱 Water the plants', '🐕 Walk the dog', '😴 Bedtime'],
        ['💧 Выпить воды', '🚶 Прогулка', '📞 Позвонить родным', '🍽️ Еда', '🏋️ Зарядка', '🌱 Полить цветы', '🐕 Выгулять собаку', '😴 Спать']
    ];
    function sugChips() {
        const wiz = document.querySelector('.med-wiz[data-s="1"]');
        const old = document.getElementById('st-sug');
        if (!wiz) { if (old) old.remove(); return; }
        const row = wiz.querySelector('.item-row:not(.collapsed) .name-wrap');
        if (!row || (old && old.parentNode === row && old.dataset.l === String(li()))) return;
        if (old) old.remove();
        const box = document.createElement('div'); box.id = 'st-sug'; box.dataset.l = String(li());
        // the user's own reminders come first (⭐), so a name written once never has to be typed again
        let mine = [];
        try { (JSON.parse(localStorage.getItem('medtime_list')) || []).forEach(r => (r.items || []).forEach(it => { const n = (it.name || '').trim(); if (n && mine.indexOf(n) < 0) mine.push(n); })); } catch (e) { }
        mine.slice(0, 6).map(n => '⭐ ' + n).concat(SUG[li()]).forEach(t => {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = t;
            b.onclick = () => {
                const inp = row.querySelector('.it-name'); if (!inp) return;
                inp.value = t.replace(/^\S+\s/, ''); inp.dispatchEvent(new Event('input', { bubbles: true }));
                if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { }
            };
            box.appendChild(b);
        });
        row.appendChild(box);
    }

    // ---------- 3. help topics about features the Play edition does not have ----------
    // help topics are found by their title (the help screen is drawn in more than one way)
    const NO_HELP = [
        ['תורים לרופא', 'مواعيد الطبيب', 'Programări la medic', 'Rendez-vous médicaux', 'Doctor appointments', 'Записи к врачу'],
        ['עדכונים', 'التحديثات', 'Actualizări', 'Mises à jour', 'Updates', 'Обновления'],
        ['בדיקת תרופה', 'فحص دواء', 'Verificare medicament', 'Vérifier un médicament', 'Medicine check', 'Проверка лекарства'],
        ['מדדים', 'القياسات', 'Valori', 'Mesures', 'Vitals', 'Показатели'],
        ['עזרה ראשונה', 'إسعاف أولي', 'Prim ajutor', 'Premiers secours', 'First aid', 'Первая помощь'],
        ['כרטיס חירום ומסך נעילה', 'بطاقة الطوارئ وشاشة القفل', 'Fișă de urgență și ecran blocat', 'Fiche d’urgence et écran verrouillé', 'Emergency card and lock screen', 'Карта экстренной помощи и экран блокировки']
    ];
    const bare = t => (t || '').replace(/[^\p{L}\p{N}’' ]/gu, ' ').replace(/\s+/g, ' ').trim();
    function hideHelp() {
        const i = li(), set = new Set();
        NO_HELP.forEach(t => { set.add(bare(t[i])); set.add(bare(fix(t[i]))); });
        document.querySelectorAll('.help-tile, #tile-help button, #mt-guide button, [id^="mt-guide"] button').forEach(b => {
            if (b.style.display !== 'none' && set.has(bare(b.textContent))) b.style.display = 'none';
        });
    }

    // ---------- 4. logo as text ----------
    function logo() {
        document.querySelectorAll('h1.mt-logo, #splash .sp-title').forEach(h => {
            if (h.querySelector('.st-logo')) return;
            const s = document.createElement('span'); s.className = 'st-logo'; s.textContent = 'MyTime';
            h.appendChild(s); h.setAttribute('aria-label', 'MyTime');
        });
        document.title = 'MyTime';
    }

    // ---------- 5. home: the next reminder and today's progress ----------
    const NX = {
        next: ['התזכורת הבאה', 'التذكير التالي', 'Următorul memento', 'Prochain rappel', 'Next reminder', 'Следующее напоминание'],
        none: ['אין עוד תזכורות היום 🎉', 'لا تذكيرات أخرى اليوم 🎉', 'Niciun memento azi 🎉', 'Plus de rappels aujourd’hui 🎉', 'No more reminders today 🎉', 'Сегодня больше нет напоминаний 🎉'],
        empty: ['עוד אין תזכורות. לחצו על ➕', 'لا توجد تذكيرات بعد. اضغط ➕', 'Niciun memento încă. Apăsați ➕', 'Pas encore de rappel. Touchez ➕', 'No reminders yet. Tap ➕', 'Пока нет напоминаний. Нажмите ➕'],
        inH: ['בעוד {h} ש׳ ו-{m} ד׳', 'بعد {h} س و{m} د', 'peste {h} h {m} min', 'dans {h} h {m} min', 'in {h} h {m} min', 'через {h} ч {m} мин'],
        inM: ['בעוד {m} דקות', 'بعد {m} دقيقة', 'peste {m} min', 'dans {m} min', 'in {m} min', 'через {m} мин'],
        now: ['עכשיו!', 'الآن!', 'Acum!', 'Maintenant !', 'Now!', 'Сейчас!']
    };
    const nx = k => NX[k][li()];
    function dayKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
    function today() {
        const d = new Date(), wk = d.getDay() >= 5, nowMin = d.getHours() * 60 + d.getMinutes();
        let list = []; try { list = JSON.parse(localStorage.getItem('medtime_list') || '[]'); } catch (e) { }
        let done = new Set();
        try {
            const N = window.MedTimeNative;
            const log = N && typeof N.getLog === 'function' ? JSON.parse(N.getLog()) || [] : [];
            const k = dayKey(d);
            done = new Set(log.filter(e => e.d === k && e.s === 'taken').map(e => String(e.id % 100000000)));
        } catch (e) { }
        const items = [];
        list.forEach(m => {
            if (m.days && m.days.length && !m.days.includes(d.getDay())) return;
            const t = (wk && typeof wkTimeOf === 'function' && wkTimeOf(m)) || m.time || '';
            const p = t.split(':'); if (p.length < 2) return;
            let early = false; try { early = !!(window.MedTimeNative && MedTimeNative.isTakenEarly && MedTimeNative.isTakenEarly(m.id)); } catch (e) { }
            items.push({ m, t, min: (+p[0]) * 60 + (+p[1]), ok: done.has(String(m.id)) || early });
        });
        items.sort((a, b) => a.min - b.min);
        const next = items.find(x => !x.ok && x.min >= nowMin - 1);
        return { all: list.length, n: items.length, ok: items.filter(x => x.ok).length, next, nowMin };
    }
    function drawNext() {
        const box = document.querySelector('.home-card .hm-float'); if (!box) return;
        let c = document.getElementById('st-next');
        if (!c) {
            c = document.createElement('button'); c.type = 'button'; c.id = 'st-next';
            c.innerHTML = '<span class="sn-ring"><svg viewBox="0 0 80 80"><defs><linearGradient id="st-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#a78bfa"/></linearGradient></defs>' +
                '<circle class="bg" cx="40" cy="40" r="33"/><circle class="fg" cx="40" cy="40" r="33"/></svg><span class="sn-num"></span></span>' +
                '<span class="sn-txt"><span class="sn-k"></span><span class="sn-t"></span><span class="sn-n"></span><span class="sn-in"></span></span>';
            c.onclick = () => { if (navigator.vibrate) navigator.vibrate(10); const b = document.getElementById('list-btn'); if (b) b.click(); };
            box.insertBefore(c, box.firstChild);
        }
        const s = today();
        const C = 2 * Math.PI * 33, fg = c.querySelector('.fg');
        fg.style.strokeDasharray = C; fg.style.strokeDashoffset = s.n ? C * (1 - s.ok / s.n) : C;
        c.querySelector('.sn-num').textContent = s.ok + '/' + s.n;
        const k = c.querySelector('.sn-k'), t = c.querySelector('.sn-t'), n = c.querySelector('.sn-n'), i = c.querySelector('.sn-in');
        if (!s.all) { k.textContent = ''; t.textContent = ''; n.textContent = nx('empty'); i.textContent = ''; return; }
        if (!s.next) { k.textContent = ''; t.textContent = ''; n.textContent = nx('none'); i.textContent = ''; return; }
        const left = s.next.min - s.nowMin;
        k.textContent = '⏰ ' + nx('next');
        t.textContent = s.next.t;
        n.textContent = (s.next.m.items || []).map(x => x && x.name).filter(Boolean).join(' · ');
        i.textContent = left <= 0 ? nx('now') : left < 60 ? nx('inM').replace('{m}', left) : nx('inH').replace('{h}', Math.floor(left / 60)).replace('{m}', left % 60);
    }

    // ---------- 6. share: the store link ----------
    const SH = ['היי 😊 אני משתמש ב-MyTime, אפליקציית תזכורות יומיות בקול, עם מסך גדול וברור. מומלץ!\n\n',
        'مرحبًا 😊 أستخدم MyTime، تطبيق تذكيرات يومية بالصوت وبشاشة كبيرة وواضحة. أنصح به!\n\n',
        'Salut 😊 Folosesc MyTime, o aplicație de mementouri zilnice cu voce și ecran mare și clar. O recomand!\n\n',
        'Salut 😊 J’utilise MyTime, une appli de rappels quotidiens à voix haute, avec un grand écran clair. Je recommande !\n\n',
        'Hi 😊 I use MyTime, a daily reminders app that speaks, with a big clear screen. Recommended!\n\n',
        'Привет 😊 Я пользуюсь MyTime, приложением ежедневных напоминаний с голосом и большим понятным экраном. Рекомендую!\n\n'];
    window.mtStoreShare = () => SH[li()] + PLAY;

    // ---------- run ----------
    let busy = false;
    function all() {
        if (busy || !document.body) return;
        busy = true;
        try { fixNode(document.body); hideHelp(); logo(); drawNext(); } catch (e) { console.error(e); }
        busy = false;
    }
    function start() {
        all();
        const mo = new MutationObserver(ms => {
            if (busy) return;
            busy = true;
            try {
                for (const m of ms) {
                    if (m.type === 'characterData') fixNode(m.target);
                    else if (m.type === 'attributes') fixNode(m.target);
                    else m.addedNodes.forEach(fixNode);
                }
                hideHelp(); sugChips();
            } catch (e) { console.error(e); }
            busy = false;
        });
        mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
        setInterval(drawNext, 20000);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) { all(); } });
        // language changes re-render everything; a pass a moment later catches what was drawn by timers
        setTimeout(all, 800); setTimeout(all, 3000);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
