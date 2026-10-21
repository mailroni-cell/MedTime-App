// M-086: first-install welcome wizard (after the language choice, before the permission cards):
// name, reading comfort (text size + 👓), look (theme), voice readout. Then a personal greeting on the home screen.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const pick = a => a[li()] || a[0];
    const N = window.MedTimeNative;
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const vib = () => { if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { } };
    const NAME_KEY = 'medtime_name';
    const getName = () => { try { return (localStorage.getItem(NAME_KEY) || '').trim(); } catch (e) { return ''; } };

    const T = {
        hiT: ['נעים להכיר! 👋', 'تشرّفنا! 👋', 'Încântat de cunoștință! 👋', 'Enchanté ! 👋', 'Nice to meet you! 👋', 'Приятно познакомиться! 👋'],
        hiX: ['כמה שאלות קצרות, ו-MedTime יותאם בדיוק בשבילכם.', 'بعض الأسئلة القصيرة ليتلاءم MedTime معك تمامًا.', 'Câteva întrebări scurte și MedTime se potrivește exact pentru dvs.', 'Quelques questions rapides et MedTime sera fait pour vous.', 'A few quick questions, and MedTime will fit you just right.', 'Несколько коротких вопросов, и MedTime будет удобен именно вам.'],
        start: ['בואו נתחיל', 'لنبدأ', 'Să începem', 'Commençons', 'Let\'s start', 'Начнём'],
        next: ['המשך', 'متابعة', 'Continuă', 'Continuer', 'Continue', 'Продолжить'],
        skip: ['דלג', 'تخطَّ', 'Sari peste', 'Passer', 'Skip', 'Пропустить'],
        nameT: ['איך קוראים לך?', 'ما اسمك؟', 'Cum vă numiți?', 'Comment vous appelez-vous ?', 'What is your name?', 'Как вас зовут?'],
        nameX: ['ככה נוכל לפנות אליך בשם.', 'هكذا نناديك باسمك.', 'Așa vă putem spune pe nume.', 'Ainsi nous pourrons vous appeler par votre prénom.', 'So we can greet you by name.', 'Чтобы обращаться к вам по имени.'],
        namePh: ['השם שלך', 'اسمك', 'Numele dvs.', 'Votre prénom', 'Your name', 'Ваше имя'],
        readT: ['מה נוח לך לקרוא?', 'ما الحجم المريح للقراءة؟', 'Ce mărime vă e comodă?', 'Quelle taille vous convient ?', 'What is comfortable to read?', 'Какой текст удобно читать?'],
        readX: ['בחרו גודל כתב. אפשר לשנות בכל עת בהגדרות ⚙️.', 'اختر حجم الخط. يمكن تغييره دائمًا في الإعدادات ⚙️.', 'Alegeți mărimea textului. Se poate schimba oricând din Setări ⚙️.', 'Choisissez la taille du texte. Modifiable à tout moment dans Réglages ⚙️.', 'Pick a text size. You can change it any time in Settings ⚙️.', 'Выберите размер текста. Его можно изменить в любое время в Настройках ⚙️.'],
        ts: [['רגיל', 'גדול', 'גדול מאוד'], ['عادي', 'كبير', 'كبير جدًا'], ['Normal', 'Mare', 'Foarte mare'], ['Normal', 'Grand', 'Très grand'], ['Normal', 'Large', 'Extra large'], ['Обычный', 'Крупный', 'Очень крупный']],
        lv: ['👓 כפתורים גדולים במיוחד', '👓 أزرار كبيرة جدًا', '👓 Butoane foarte mari', '👓 Très gros boutons', '👓 Extra big buttons', '👓 Очень крупные кнопки'],
        lookT: ['איזה עיצוב אוהבים?', 'أي تصميم تحب؟', 'Ce aspect vă place?', 'Quel style aimez-vous ?', 'Which look do you like?', 'Какой вид вам нравится?'],
        lookX: ['לחצו כדי לראות ברקע. יש עוד 30 עיצובים בהגדרות.', 'اضغط لترى في الخلفية. يوجد 30 تصميمًا آخر في الإعدادات.', 'Apăsați ca să vedeți în fundal. Mai sunt 30 în Setări.', 'Appuyez pour voir en fond. 30 autres styles dans Réglages.', 'Tap to see it behind. 30 more looks in Settings.', 'Нажмите, чтобы увидеть его на фоне. Ещё 30 вариантов в Настройках.'],
        auto: ['🌅🌙 לפי שעות היום', '🌅🌙 حسب ساعات اليوم', '🌅🌙 După ora zilei', '🌅🌙 Selon l\'heure', '🌅🌙 By time of day', '🌅🌙 По времени суток'],
        voiceT: ['להקריא את התזכורת בקול?', 'قراءة التذكير بصوت عالٍ؟', 'Citim mementoul cu voce tare?', 'Lire le rappel à voix haute ?', 'Read the reminder out loud?', 'Зачитывать напоминание вслух?'],
        voiceX: ['בזמן התזכורת הטלפון יגיד את שם התרופה והמינון. לחצו ▶ כדי לשמוע.', 'وقت التذكير يقول الهاتف اسم الدواء والجرعة. اضغط ▶ للاستماع.', 'La memento telefonul spune numele medicamentului și doza. Apăsați ▶.', 'Au rappel, le téléphone dit le nom du médicament et la dose. Appuyez ▶.', 'At reminder time the phone says the medicine name and dose. Tap ▶ to hear.', 'Во время напоминания телефон произносит название лекарства и дозу. Нажмите ▶, чтобы послушать.'],
        yes: ['🔊 כן, להקריא', '🔊 نعم، اقرأ', '🔊 Da, citește', '🔊 Oui, lire', '🔊 Yes, read it', '🔊 Да, зачитывать'],
        no: ['🔕 בלי קול', '🔕 بدون صوت', '🔕 Fără voce', '🔕 Sans voix', '🔕 No voice', '🔕 Без голоса'],
        sample: ['הגיע הזמן לקחת אקמול, כדור אחד.', 'حان وقت تناول الدواء، حبة واحدة.', 'Este timpul pentru medicament, o pastilă.', 'C\'est l\'heure du médicament, un comprimé.', 'It is time to take your medicine, one tablet.', 'Пора принять лекарство, одну таблетку.'],
        doneT: ['שלום {n}! הכל מוכן 🎉', 'أهلًا {n}! كل شيء جاهز 🎉', 'Bună, {n}! Totul e gata 🎉', 'Bonjour {n} ! Tout est prêt 🎉', 'Hi {n}! All set 🎉', 'Привет, {n}! Всё готово 🎉'],
        doneT0: ['הכל מוכן 🎉', 'كل شيء جاهز 🎉', 'Totul e gata 🎉', 'Tout est prêt 🎉', 'All set 🎉', 'Всё готово 🎉'],
        doneX: ['עכשיו נאשר לטלפון לשלוח תזכורות, ואז מוסיפים את התרופה הראשונה ➕.', 'الآن نسمح للهاتف بإرسال التذكيرات، ثم نضيف أول دواء ➕.', 'Acum permitem telefonului să trimită mementouri, apoi adăugăm primul medicament ➕.', 'Autorisons maintenant les rappels, puis ajoutons le premier médicament ➕.', 'Now let the phone send reminders, then add your first medicine ➕.', 'Теперь разрешите телефону присылать напоминания, затем добавьте первое лекарство ➕.'],
        again: ['✨ אשף הפתיחה מההתחלה (שם, כתב, עיצוב, קול)', '✨ معالج البداية من جديد (الاسم، الخط، التصميم، الصوت)', '✨ Asistentul de început din nou', '✨ Relancer l\'assistant de bienvenue', '✨ Run the welcome setup again', '✨ Пройти начальную настройку снова'],
        doneB: ['יוצאים לדרך', 'هيا بنا', 'Începem', 'C\'est parti', 'Let\'s go', 'Поехали'],
        // home greeting by time of day
        g: [['בוקר טוב', 'צהריים טובים', 'ערב טוב', 'לילה טוב'], ['صباح الخير', 'نهارك سعيد', 'مساء الخير', 'تصبح على خير'],
            ['Bună dimineața', 'Bună ziua', 'Bună seara', 'Noapte bună'], ['Bonjour', 'Bon après-midi', 'Bonsoir', 'Bonne nuit'],
            ['Good morning', 'Good afternoon', 'Good evening', 'Good night'], ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Доброй ночи']]
    };

    const css = document.createElement('style');
    css.textContent = `
    .ob-bg{position:fixed !important;inset:0;z-index:9650 !important;display:flex;align-items:flex-end;justify-content:center;padding:14px;
      background:linear-gradient(180deg,rgba(2,6,23,.25),rgba(2,6,23,.75));opacity:0;transition:opacity .3s}
    .ob-bg.in{opacity:1}
    .ob-card{width:100%;max-width:420px;max-height:92vh;overflow:auto;border-radius:30px;padding:22px 18px 18px;text-align:center;color:#fff;
      background:linear-gradient(160deg,rgba(30,27,75,.94),rgba(15,23,42,.96));border:1px solid rgba(255,255,255,.14);box-shadow:0 20px 60px rgba(0,0,0,.55);
      transform:translateY(30px);transition:transform .35s cubic-bezier(.2,1.2,.4,1)}
    .ob-bg.in .ob-card{transform:none}
    .ob-dots{display:flex;gap:7px;justify-content:center;margin-bottom:14px}
    .ob-dots i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.25)}.ob-dots i.on{background:#22d3ee;width:24px;border-radius:9px}
    .ob-ico{font-size:3.2rem;line-height:1.1;margin-bottom:6px}
    .ob-t{font-size:1.45rem;font-weight:800;margin-bottom:6px}.ob-x{font-size:1.05rem;opacity:.85;line-height:1.45;margin-bottom:16px}
    .ob-in{width:100%;box-sizing:border-box;font-size:1.35rem;padding:14px 16px;border-radius:18px;border:2px solid rgba(34,211,238,.6);background:rgba(255,255,255,.08);color:#fff;text-align:center;margin-bottom:16px}
    .ob-in::placeholder{color:rgba(255,255,255,.45)}
    .ob-ts{display:flex;gap:8px;margin-bottom:12px}
    .ob-ts button,.ob-opt{flex:1;border:2px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);color:#fff;border-radius:18px;padding:12px 6px;font-weight:700}
    .ob-ts button.sel,.ob-opt.sel{border-color:#22d3ee;background:linear-gradient(135deg,rgba(34,211,238,.3),rgba(168,85,247,.28));box-shadow:0 0 14px rgba(34,211,238,.45)}
    .ob-ts b{display:block;line-height:1.1}
    .ob-lv{width:100%;margin-bottom:16px;font-size:1.1rem}
    .ob-th{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:16px}
    .ob-th button{border:2px solid rgba(255,255,255,.18);border-radius:18px;padding:0;overflow:hidden;color:#fff;font-weight:700;font-size:.85rem;background:#111}
    .ob-th button span{display:block;height:54px}.ob-th button em{display:block;font-style:normal;padding:6px 4px;background:rgba(0,0,0,.45);line-height:1.2}
    .ob-th button.sel{border-color:#22d3ee;box-shadow:0 0 14px rgba(34,211,238,.6)}
    .ob-row{display:flex;gap:8px;align-items:center;margin-bottom:16px}
    .ob-row .ob-opt{font-size:1.1rem;padding:15px 6px}
    .ob-play{flex:none;width:54px;height:54px;border-radius:50%;border:0;font-size:1.3rem;color:#fff;background:linear-gradient(135deg,#22c55e,#0d9488)}
    .ob-go{width:100%;border:0;border-radius:18px;padding:16px;font-size:1.25rem;font-weight:800;color:#042f2e;background:linear-gradient(135deg,#5eead4,#22d3ee);box-shadow:0 8px 24px rgba(34,211,238,.4)}
    .ob-skip{border:0;background:none;color:#cbd5e1;font-size:1.05rem;padding:10px;text-decoration:underline;margin-top:4px}
    /* M-089: greeting as a clear glass badge (readable on every background) */
    .hello-line{display:table;margin:2px auto 8px;padding:8px 20px 9px;border-radius:999px;font-family:'MTUI','Rubik',sans-serif;
      font-size:1.12rem;font-weight:700;letter-spacing:.01em;color:#fff;line-height:1.25;
      background:linear-gradient(135deg,rgba(15,23,42,.82),rgba(30,27,75,.78)) padding-box,linear-gradient(135deg,#22d3ee,#a855f7,#f472b6) border-box;
      border:2px solid transparent;box-shadow:0 6px 18px rgba(0,0,0,.45),0 0 14px rgba(34,211,238,.25)}
    .hello-line .hl-ico{margin-inline-end:6px}
    /* M-114: the name in a beautiful font, a bit bigger, glowing gold */
    .hello-line b{font-family:'MTName','MTUI',sans-serif;font-weight:400;font-size:1.6em;line-height:1.1;letter-spacing:.5px;
      background:linear-gradient(180deg,#fff7c2 0%,#fde047 45%,#f59e0b 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
      filter:drop-shadow(0 2px 0 rgba(120,53,15,.9)) drop-shadow(0 0 6px rgba(253,224,71,.45));vertical-align:-0.08em;margin-inline-start:2px;padding:0 2px}
    html.lowvision .hello-line b{background:none;color:#fff;filter:none}
    .hello-line:empty{display:none}`;
    document.head.appendChild(css);

    // ---------- home greeting ----------
    function hello() {
        const el = document.getElementById('hello-line'); if (!el) return;
        const n = getName();
        // M-088: the reminder voice starts with the name
        if (N && typeof N.setUserName === 'function') try { N.setUserName(n); } catch (e) { }
        // M-106: greet by the time of day always (with the name when there is one)
        const h = new Date().getHours(), k = h >= 5 && h < 12 ? 0 : h >= 12 && h < 17 ? 1 : h >= 17 && h < 22 ? 2 : 3;
        el.innerHTML = '<span class="hl-ico">' + ['☀️', '🌤️', '🌆', '🌙'][k] + '</span>' + esc(pick(T.g)[k]) + (n ? ', <b>' + esc(n) + '</b>' : '');
        el.dir = li() < 2 ? 'rtl' : 'ltr';
    }
    window.mtHello = hello;
    hello();
    setInterval(hello, 10 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) hello(); });
    const lsel = document.getElementById('lang-select');
    if (lsel) lsel.addEventListener('change', () => setTimeout(hello, 200));

    // ---------- button in settings (language tile) to run the welcome setup again ----------
    if (lsel) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'ob-again';
        b.style.cssText = 'width:100%;margin-top:12px;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:16px;padding:13px 10px;font-size:1rem;font-weight:700';
        const lbl = () => { b.textContent = pick(T.again); };
        lbl(); lsel.addEventListener('change', () => setTimeout(lbl, 200));
        b.onclick = () => {
            vib();
            if (typeof closeTiles === 'function') try { closeTiles(); } catch (e) { }
            if (typeof closeSettingsPage === 'function') try { closeSettingsPage(); } catch (e) { }
            setTimeout(() => window.mtOnboard(), 350);
        };
        lsel.parentNode.appendChild(b);
    }

    // ---------- the wizard ----------
    let bg = null;
    function card(step, html) {
        if (!bg) {
            bg = document.createElement('div'); bg.className = 'ob-bg';
            bg.setAttribute('role', 'dialog'); bg.setAttribute('aria-modal', 'true');
            document.body.appendChild(bg);
            requestAnimationFrame(() => bg && bg.classList.add('in'));
        }
        bg.dir = li() < 2 ? 'rtl' : 'ltr';
        let dots = '';
        if (step > 0) { dots = '<div class="ob-dots">'; for (let i = 1; i <= 4; i++) dots += '<i class="' + (i === step ? 'on' : '') + '"></i>'; dots += '</div>'; }
        bg.innerHTML = '<div class="ob-card">' + dots + html + '</div>';
        // M-107: the hand bobs over the choice of this step, then over "next"
        if (window.mtHint) setTimeout(() => {
            if (!bg) return;
            const c = bg.querySelector('.ob-in') || bg.querySelector('.ob-ts button.sel, .ob-th button.sel') || bg.querySelector('.ob-ts button, .ob-th button, .ob-opt[data-v="1"]');
            window.mtHint([c, bg.querySelector('.ob-go')]);
        }, 80);
        return bg;
    }
    function close() { if (window.mtHintOff) window.mtHintOff(); if (!bg) return; const b = bg; bg = null; b.classList.remove('in'); setTimeout(() => b.remove(), 320); }
    const wait = sel => new Promise(res => bg.querySelectorAll(sel).forEach(b => b.addEventListener('click', () => { vib(); res(b); })));

    async function stepName() {
        card(1, '<div class="ob-ico">😊</div><div class="ob-t">' + esc(pick(T.nameT)) + '</div><div class="ob-x">' + esc(pick(T.nameX)) + '</div>' +
            '<input class="ob-in" type="text" maxlength="24" autocomplete="given-name" enterkeyhint="done">' +
            '<button type="button" class="ob-go">' + esc(pick(T.next)) + '</button><button type="button" class="ob-skip">' + esc(pick(T.skip)) + '</button>');
        const inp = bg.querySelector('.ob-in');
        inp.placeholder = pick(T.namePh); inp.value = getName();
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); inp.blur(); bg.querySelector('.ob-go').click(); } });
        const b = await wait('.ob-go,.ob-skip');
        const v = b.classList.contains('ob-go') ? inp.value.replace(/[<>]/g, '').trim().slice(0, 24) : '';
        try { if (v) localStorage.setItem(NAME_KEY, v); else localStorage.removeItem(NAME_KEY); } catch (e) { }
        if (v && N && typeof N.setUserName === 'function') try { N.setUserName(v); } catch (e) { }
        inp.blur();
    }

    async function stepRead() {
        let ts = 1; try { ts = parseInt(localStorage.getItem('medtime_ts'), 10) || 1; } catch (e) { }
        const lvBox = document.getElementById('low-vision');
        card(2, '<div class="ob-ico">🔎</div><div class="ob-t">' + esc(pick(T.readT)) + '</div><div class="ob-x">' + esc(pick(T.readX)) + '</div>' +
            '<div class="ob-ts">' + pick(T.ts).map((s, i) => '<button type="button" data-ts="' + (i + 1) + '"><b style="font-size:' + [1.2, 1.6, 2][i] + 'rem">A</b>' + esc(s) + '</button>').join('') + '</div>' +
            (lvBox ? '<button type="button" class="ob-opt ob-lv">' + esc(pick(T.lv)) + '</button>' : '') +
            '<button type="button" class="ob-go">' + esc(pick(T.next)) + '</button>');
        const mark = () => bg.querySelectorAll('.ob-ts button').forEach(b => b.classList.toggle('sel', +b.dataset.ts === ts));
        mark();
        bg.querySelectorAll('.ob-ts button').forEach(b => b.onclick = () => {
            vib(); ts = +b.dataset.ts; mark();
            if (typeof applyTextSize === 'function') applyTextSize(ts);
            try { localStorage.setItem('medtime_ts', ts); } catch (e) { }
        });
        const lv = bg.querySelector('.ob-lv');
        if (lv) {
            lv.classList.toggle('sel', lvBox.checked);
            lv.onclick = () => {
                vib(); lvBox.checked = !lvBox.checked; lvBox.dispatchEvent(new Event('change'));
                lv.classList.toggle('sel', lvBox.checked);
                // turning 👓 off resets the size; keep what was chosen here
                if (!lvBox.checked && typeof applyTextSize === 'function') { applyTextSize(ts); try { localStorage.setItem('medtime_ts', ts); } catch (e) { } }
            };
        }
        await wait('.ob-go');
        if (typeof updateSettingsSummary === 'function') try { updateSettingsSummary(); } catch (e) { }
    }

    async function stepLook() {
        const TH = window.MED_THEMES || [];
        const picks = ['auto', 0, 1, 2, 8, 4].filter(i => i === 'auto' || TH[i]);
        let cur = 'auto'; try { cur = localStorage.getItem('medtime_theme') || 'auto'; } catch (e) { }
        const name = th => th.n[li()] || th.n[4];
        card(3, '<div class="ob-ico">🎨</div><div class="ob-t">' + esc(pick(T.lookT)) + '</div><div class="ob-x">' + esc(pick(T.lookX)) + '</div>' +
            '<div class="ob-th">' + picks.map(i => {
                if (i === 'auto') return '<button type="button" data-th="auto"><span style="background:linear-gradient(135deg,#f59e0b,#ec4899 45%,#1e3a8a)"></span><em>' + esc(pick(T.auto)) + '</em></button>';
                const th = TH[i];
                return '<button type="button" data-th="' + i + '"><span style="background:linear-gradient(135deg,' + th.sky[2] + ',' + th.ga + ',' + th.gb + ')"></span><em>' + esc(name(th)) + '</em></button>';
            }).join('') + '</div><button type="button" class="ob-go">' + esc(pick(T.next)) + '</button>');
        const mark = () => bg.querySelectorAll('.ob-th button').forEach(b => b.classList.toggle('sel', b.dataset.th === String(cur)));
        mark();
        bg.querySelectorAll('.ob-th button').forEach(b => b.onclick = () => {
            vib(); cur = b.dataset.th; mark();
            try { localStorage.setItem('medtime_theme', cur); } catch (e) { }
            const i = cur === 'auto' ? (typeof window.medEffectiveTheme === 'function' ? window.medEffectiveTheme() : 0) : +cur;
            if (window.MedTime3D) try { MedTime3D.setTheme(i); } catch (e) { }
            if (typeof applyThemeUI === 'function') try { applyThemeUI(i); } catch (e) { }
        });
        await wait('.ob-go');
        if (typeof renderThemes === 'function') try { renderThemes(); } catch (e) { }
    }

    async function stepVoice() {
        const vOn = document.getElementById('v-on');
        if (!vOn) return;
        card(4, '<div class="ob-ico">🗣️</div><div class="ob-t">' + esc(pick(T.voiceT)) + '</div><div class="ob-x">' + esc(pick(T.voiceX)) + '</div>' +
            '<div class="ob-row"><button type="button" class="ob-opt" data-v="1">' + esc(pick(T.yes)) + '</button>' +
            '<button type="button" class="ob-play" aria-label="play">▶</button></div>' +
            '<div class="ob-row"><button type="button" class="ob-opt" data-v="0">' + esc(pick(T.no)) + '</button></div>' +
            '<button type="button" class="ob-go">' + esc(pick(T.next)) + '</button>');
        const mark = () => bg.querySelectorAll('.ob-opt').forEach(b => b.classList.toggle('sel', (b.dataset.v === '1') === vOn.checked));
        mark();
        const say = () => { if (N && typeof N.previewVoice === 'function') try { N.previewVoice('', (getName() ? getName() + ', ' : '') + pick(T.sample)); } catch (e) { } };
        bg.querySelector('.ob-play').onclick = () => { vib(); say(); };
        bg.querySelectorAll('.ob-opt').forEach(b => b.onclick = () => {
            vib();
            const on = b.dataset.v === '1';
            if (vOn.checked !== on) { vOn.checked = on; vOn.dispatchEvent(new Event('change')); }
            mark(); if (on) say();
        });
        await wait('.ob-go');
    }

    window.mtOnboard = async function () {
        card(0, '<div class="ob-ico">💊</div><div class="ob-t">' + esc(pick(T.hiT)) + '</div><div class="ob-x">' + esc(pick(T.hiX)) + '</div>' +
            '<button type="button" class="ob-go">' + esc(pick(T.start)) + '</button><button type="button" class="ob-skip">' + esc(pick(T.skip)) + '</button>');
        const b = await wait('.ob-go,.ob-skip');
        if (b.classList.contains('ob-go')) {
            await stepName();
            await stepRead();
            await stepLook();
            await stepVoice();
        }
        const n = getName();
        card(0, '<div class="ob-ico">🎉</div><div class="ob-t">' + esc(n ? pick(T.doneT).replace('{n}', n) : pick(T.doneT0)) + '</div>' +
            '<div class="ob-x">' + esc(pick(T.doneX)) + '</div><button type="button" class="ob-go">' + esc(pick(T.doneB)) + '</button>');
        await wait('.ob-go');
        close(); hello();
        if (typeof fitMain === 'function') setTimeout(fitMain, 400);
    };
})();
