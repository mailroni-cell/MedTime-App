// M-107: interactive help. An animated hand moves over the screens, taps, types and scrolls to show how things work.
// Demos (from the Help tile): add a reminder, change a reminder, weekend mode, tour of the settings.
// Hint mode (first-install wizard): the hand bobs over the control to use now.
// Demos never save anything: the add / edit wizard is closed without saving at the end.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const T = {
        demos: ['🎬 הדגמות: יד שמראה לכם', '🎬 عروض: يد تريك', '🎬 Demonstrații: o mână vă arată', '🎬 Démos : une main vous montre', '🎬 Demos: a hand shows you'],
        dAdd: ['➕ הוספת תזכורת', '➕ إضافة تذكير', '➕ Adăugare memento', '➕ Ajouter un rappel', '➕ Add a reminder'],
        dEdit: ['✏️ שינוי תזכורת', '✏️ تعديل تذكير', '✏️ Modificare memento', '✏️ Modifier un rappel', '✏️ Change a reminder'],
        dWk: ['🌴 מצב סופ״ש', '🌴 نهاية الأسبوع', '🌴 Mod weekend', '🌴 Mode week-end', '🌴 Weekend mode'],
        dSet: ['⚙️ סיור בהגדרות', '⚙️ جولة في الإعدادات', '⚙️ Tur prin setări', '⚙️ Visite des réglages', '⚙️ Settings tour'],
        stop: ['✕ עצירה', '✕ إيقاف', '✕ Stop', '✕ Arrêter', '✕ Stop'],
        a1: ['במסך הראשי לוחצים "הוסף תזכורת"', 'في الشاشة الرئيسية اضغط "إضافة تذكير"', 'Pe ecranul principal apăsați „Adaugă memento”', 'Sur l\'écran principal, appuyez sur « Ajouter un rappel »', 'On the main screen tap "Add reminder"'],
        a2: ['בוחרים את סוג התרופה', 'اختر نوع الدواء', 'Alegeți tipul medicamentului', 'Choisissez le type', 'Choose the kind of medicine'],
        a3: ['כותבים את שם התרופה', 'اكتب اسم الدواء', 'Scrieți numele', 'Écrivez le nom', 'Type the medicine name'],
        a4: ['לוחצים "הבא"', 'اضغط "التالي"', 'Apăsați „Înainte”', 'Appuyez sur « Suivant »', 'Tap "Next"'],
        a5: ['המינון לא חובה. אפשר להמשיך', 'الجرعة اختيارية. تابع', 'Doza e opțională. Continuați', 'La dose est facultative', 'The dose is optional. Go on'],
        a6: ['אפשר להוסיף עוד תרופה לאותה שעה, או להמשיך', 'يمكن إضافة دواء آخر لنفس الساعة أو المتابعة', 'Puteți adăuga alt medicament sau continua', 'Ajoutez un autre médicament ou continuez', 'Add another medicine for the same time, or go on'],
        a7: ['בוחרים שעה', 'اختر الساعة', 'Alegeți ora', 'Choisissez l\'heure', 'Pick a time'],
        a8: ['בוחרים ימים. בלי בחירה = כל יום', 'اختر الأيام. بدون اختيار = كل يوم', 'Alegeți zilele. Fără alegere = zilnic', 'Choisissez les jours. Sans choix = tous les jours', 'Pick days. Nothing = every day'],
        a9: ['בסוף לוחצים "שמור תזכורת" וזהו!', 'في النهاية اضغط "حفظ التذكير"!', 'La final apăsați „Salvează”!', 'À la fin, « Enregistrer » !', 'At the end tap "Save reminder". Done!'],
        demoNote: ['(בהדגמה לא שומרים כלום)', '(لا يُحفظ شيء في العرض)', '(În demonstrație nu se salvează nimic)', '(Rien n\'est enregistré dans la démo)', '(Nothing is saved in the demo)'],
        e0: ['קודם צריך תזכורת אחת לפחות', 'تحتاج أولاً إلى تذكير واحد', 'Mai întâi adăugați un memento', 'Ajoutez d\'abord un rappel', 'First add at least one reminder'],
        e1: ['פותחים את "התזכורות שלי"', 'افتح "تذكيراتي"', 'Deschideți „Mementourile mele”', 'Ouvrez « Mes rappels »', 'Open "My reminders"'],
        e2: ['לוחצים ✏️ עריכה על התזכורת', 'اضغط ✏️ تعديل', 'Apăsați ✏️ Editează', 'Appuyez sur ✏️ Modifier', 'Tap ✏️ Edit on the reminder'],
        e3: ['נגיעה בשעה משנה את השעה', 'المس الساعة لتغييرها', 'Atingeți ora pentru a o schimba', 'Touchez l\'heure pour la changer', 'Tap the time to change it'],
        e4: ['נגיעה בימים משנה את הימים', 'المس الأيام لتغييرها', 'Atingeți zilele', 'Touchez les jours', 'Tap the days to change them'],
        e5: ['✕ מוריד תרופה, ➕ מוסיף תרופה', '✕ يزيل دواء، ➕ يضيف دواء', '✕ șterge, ➕ adaugă', '✕ retire, ➕ ajoute', '✕ removes a medicine, ➕ adds one'],
        e6: ['ובסוף "שמירת השינויים"', 'ثم "حفظ التغييرات"', 'Apoi „Salvează modificările”', 'Puis « Enregistrer »', 'Then "Save changes"'],
        w1: ['כאן בוחרים שעה אחרת לשישי ושבת, רק לתזכורת הזו', 'هنا تختار ساعة أخرى للجمعة والسبت', 'Aici alegeți altă oră vineri și sâmbătă', 'Ici, une autre heure le vendredi et samedi', 'Here you pick another time for Friday and Saturday'],
        w2: ['ובראש הרשימה: הזזה אחת לכל התזכורות בסופ״ש', 'وفي أعلى القائمة: تأخير واحد لكل التذكيرات', 'Sus în listă: o mutare pentru toate', 'En haut de la liste : un décalage pour tous', 'At the top of the list: one shift for all reminders'],
        s0: ['במסך הראשי לוחצים על גלגל השיניים ⚙️', 'اضغط على الترس ⚙️', 'Apăsați rotița ⚙️', 'Appuyez sur la roue ⚙️', 'Tap the gear ⚙️ on the main screen'],
        sEnd: ['נגיעה בכל ריבוע פותחת אותו. זהו!', 'المس أي مربع لفتحه!', 'Atingeți un pătrat pentru a-l deschide!', 'Touchez une case pour l\'ouvrir !', 'Tap any square to open it. That\'s it!'],
        swipe: ['גוללים למטה לעוד', 'مرّر للأسفل للمزيد', 'Derulați pentru mai mult', 'Faites défiler pour plus', 'Scroll down for more'],
        demoMed: ['אקמול', 'باراسيتامول', 'Paracetamol', 'Paracétamol', 'Tylenol']
    };
    const tx = k => (T[k] || [k])[li()];
    const $ = id => document.getElementById(id);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const vib = p => { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) { } };

    const css = document.createElement('style');
    css.textContent = `
    #mt-hand{position:fixed;left:0;top:0;z-index:2147483600;width:70px;height:70px;font-size:62px;line-height:70px;text-align:center;pointer-events:none;
      filter:drop-shadow(0 8px 10px rgba(0,0,0,.55)) drop-shadow(0 0 2px #fff);transition:transform .75s cubic-bezier(.4,.1,.2,1),opacity .3s;opacity:0;will-change:transform}
    #mt-hand.on{opacity:1}
    #mt-hand .hd{display:block;transform-origin:50% 10%;transition:transform .16s}
    #mt-hand.press .hd{transform:scale(.82) translateY(4px)}
    #mt-hand.bob .hd{animation:mtBob 1.1s ease-in-out infinite}
    @keyframes mtBob{0%,100%{transform:translateY(0)}50%{transform:translateY(12px) scale(.94)}}
    .mt-ripple{position:fixed;z-index:2147483599;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:3px solid #fde047;pointer-events:none;animation:mtRip .6s ease-out forwards}
    @keyframes mtRip{to{transform:scale(4.5);opacity:0}}
    #mt-veil{position:fixed;inset:0;z-index:2147483590;background:transparent}
    #mt-bubble{position:fixed;left:50%;top:max(72px,calc(env(safe-area-inset-top) + 72px));transform:translateX(-50%) translateY(-20px);z-index:2147483601;max-width:88vw;width:max-content;
      padding:14px 20px;border-radius:20px;background:linear-gradient(160deg,#fef3c7,#fde68a);color:#422006;font-weight:800;font-size:1.15rem;line-height:1.35;text-align:center;
      box-shadow:inset 0 2px 0 #fff,0 10px 26px rgba(0,0,0,.5);opacity:0;transition:opacity .3s,transform .3s;pointer-events:none}
    #mt-bubble.on{opacity:1;transform:translateX(-50%) translateY(0)}
    #mt-bubble.low{top:auto;bottom:max(96px,calc(env(safe-area-inset-bottom) + 96px))}
    #mt-stop{position:fixed;left:12px;top:max(12px,env(safe-area-inset-top));z-index:2147483602;padding:12px 26px;border-radius:999px;border:0;
      background:#dc2626;color:#fff;font-weight:900;font-size:1.1rem;box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 6px 0 #7f1d1d,0 10px 20px rgba(0,0,0,.5)}
    .mt-flash{outline:3px solid #fde047!important;outline-offset:3px;border-radius:14px;transition:outline-color .3s}
    .help-demos{margin:0 0 14px}
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
        hand = document.createElement('div'); hand.id = 'mt-hand'; hand.innerHTML = '<span class="hd">👆</span>';
        bubble = document.createElement('div'); bubble.id = 'mt-bubble';
        document.documentElement.append(hand, bubble);
        place(hx, hy, true);
    }
    // the fingertip is near the top middle of the emoji
    function place(x, y, now) {
        hx = x; hy = y;
        if (now) { hand.style.transition = 'none'; requestAnimationFrame(() => { hand.style.transition = ''; }); }
        hand.style.transform = 'translate(' + (x - 30) + 'px,' + (y - 6) + 'px)';
    }
    function centerOf(el) { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + Math.min(r.height / 2, 40)]; }
    function visible(el) { const r = el.getBoundingClientRect(); return r.width > 0 && r.top >= 60 && r.bottom <= innerHeight - 90; }
    function check() { if (aborted) throw new Error('stop'); }

    async function say(text, low) {
        ensure(); check();
        bubble.classList.remove('on'); await sleep(120);
        bubble.textContent = text; bubble.classList.toggle('low', !!low); bubble.classList.add('on');
    }
    // scroll a far element into view while the hand "swipes" up
    async function bring(el) {
        if (!el || visible(el)) return;
        ensure();
        place(innerWidth / 2, innerHeight * 0.72); await sleep(500); check();
        hand.classList.add('press');
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        place(innerWidth / 2, innerHeight * 0.32);
        await sleep(800); hand.classList.remove('press'); await sleep(250); check();
    }
    async function moveTo(el) {
        ensure(); check();
        if (!el) return;
        await bring(el);
        const [x, y] = centerOf(el);
        place(x, y); await sleep(800); check();
    }
    async function tap(el, doClick) {
        if (el) await moveTo(el);
        hand.classList.add('press'); vib(10);
        const r = document.createElement('div'); r.className = 'mt-ripple'; r.style.left = hx + 'px'; r.style.top = hy + 'px';
        document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700);
        await sleep(180); hand.classList.remove('press');
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
        if (el) el.classList.add('mt-flash');
        await sleep(ms || 1600);
        if (el) el.classList.remove('mt-flash');
        check();
    }

    function hideAll() {
        if (hand) { hand.classList.remove('on', 'bob', 'press'); }
        if (bubble) bubble.classList.remove('on');
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
        try { await fn(); await sleep(900); } catch (e) { if (e && e.message !== 'stop') console.error(e); }
        cleanUp();
        hideAll();
        running = false;
    }
    // leave every screen the demo opened, without saving
    function cleanUp() {
        try { if ($('med-page') && $('med-page').classList.contains('open')) { if (window.mwEditing === undefined) window.mwEditing = null; closeMedPage(); } } catch (e) { }
        try { if (typeof itemRows !== 'undefined' && !window.mwEditing) { itemRows.innerHTML = ''; addItemRow(); if (typeof resetTimeBtn === 'function') resetTimeBtn(); const t = $('med-time'); if (t) t.value = ''; selDays = []; window.mwWk = ''; } } catch (e) { }
        try { closeListPage(); } catch (e) { }
    }
    function home() {
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
                if (++n >= 12) break;
            }
            await say(tx('sEnd'));
            await sleep(1800);
            try { const sp = $('settings-page'); sp.scrollTo ? sp.scrollTo({ top: 0, behavior: 'smooth' }) : 0; } catch (e) { }
        }
    };
    window.mtDemo = name => {
        const f = demos[name]; if (!f) return;
        run(f);
    };

    // ---------- help tile: demo buttons ----------
    function drawDemoButtons() {
        const list = $('help-list'); if (!list) return;
        let box = document.querySelector('.help-demos');
        if (!box) { box = document.createElement('div'); box.className = 'help-demos'; list.parentNode.insertBefore(box, list); }
        box.innerHTML = '<div class="hd-t"></div><div class="hd-g"></div>';
        box.querySelector('.hd-t').textContent = tx('demos');
        [['add', 'dAdd'], ['edit', 'dEdit'], ['wk', 'dWk'], ['settings', 'dSet']].forEach(([k, l]) => {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = tx(l);
            b.onclick = () => { vib(12); window.mtDemo(k); };
            box.querySelector('.hd-g').appendChild(b);
        });
    }
    drawDemoButtons();
    const xr = window.xRender;
    window.xRender = function () { if (xr) xr(); drawDemoButtons(); };
    const lsel = $('lang-select');
    if (lsel) lsel.addEventListener('change', () => setTimeout(drawDemoButtons, 250));

    // M-109: a word under the exit button
    function exitLbl() { const e = $('exit-btn'); if (e && typeof t === 'function') e.dataset.lbl = t('exitShort'); }
    exitLbl(); if (lsel) lsel.addEventListener('change', () => setTimeout(exitLbl, 250));

    // ---------- hint mode (no blocking): the hand bobs over one control, then the next ----------
    let hintTimer = null;
    window.mtHint = function (targets) {
        window.mtHintOff();
        const list = (targets || []).filter(Boolean);
        if (!list.length) return;
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
        place(innerWidth / 2, innerHeight + 40, true);
        setTimeout(go, 700); // after the card has slid in
        hintTimer = setInterval(go, list.length > 1 ? 2600 : 1500); // also follows the control if the layout moves
    };
    window.mtHintOff = function () {
        if (hintTimer) { clearInterval(hintTimer); hintTimer = null; }
        if (hand && !running) hand.classList.remove('on', 'bob');
    };
})();
