// M-044: calm mode. Full-screen real 3D animated worlds (Three.js canvas), zen / meditation sounds
// (synthesized singing bowls and OM drone, or nature loops), a breathing guide and a sleep timer that
// fades sound and picture out and closes by itself.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    // [he, ar, ro, fr, en]
    const TX = {
        btn: ['שלווה', 'سكينة', 'Liniște', 'Sérénité', 'Serenity'],
        title: ['🌙 רגע של שלווה', '🌙 لحظة سكينة', '🌙 Clipă de liniște', '🌙 Un moment de sérénité', '🌙 A moment of serenity'],
        scene: ['תצוגה', 'المشهد', 'Peisaj', 'Décor', 'Scene'],
        sound: ['צליל', 'الصوت', 'Sunet', 'Son', 'Sound'],
        timer: ['כיבוי אוטומטי', 'إيقاف تلقائي', 'Oprire automată', 'Arrêt automatique', 'Sleep timer'],
        vol: ['🔊 עוצמה', '🔊 مستوى الصوت', '🔊 Volum', '🔊 Volume', '🔊 Volume'],
        breath: ['🫁 הנחיית נשימה', '🫁 إرشاد التنفس', '🫁 Ghid de respirație', '🫁 Guide de respiration', '🫁 Breathing guide'],
        inhale: ['שאיפה…', 'شهيق…', 'Inspiră…', 'Inspirez…', 'Breathe in…'],
        hold: ['להחזיק', 'احبس', 'Ține', 'Retenez', 'Hold'],
        exhale: ['נשיפה…', 'زفير…', 'Expiră…', 'Expirez…', 'Breathe out…'],
        off: ['ללא', 'بدون', 'Fără', 'Non', 'Off'],
        min: ['דק׳', 'د', 'min', 'min', 'min'],
        tapHint: ['נגיעה במסך מציגה או מסתירה את התפריט', 'المس الشاشة لإظهار القائمة أو إخفائها', 'Atinge ecranul pentru meniu', 'Touchez l’écran pour le menu', 'Tap the screen to show or hide the menu'],
        left: ['ייסגר בעוד', 'يُغلق بعد', 'Se oprește în', 'Arrêt dans', 'Ends in'],
        noGL: ['המכשיר לא תומך בתלת־ממד', 'الجهاز لا يدعم ثلاثي الأبعاد', 'Dispozitivul nu suportă 3D', 'Pas de 3D sur cet appareil', 'This device has no 3D support'],
        s_aurora: ['זוהר צפוני', 'الشفق القطبي', 'Aurora', 'Aurore', 'Aurora'],
        s_ocean: ['ים בלילה', 'بحر ليلي', 'Mare noaptea', 'Mer la nuit', 'Night sea'],
        s_galaxy: ['גלקסיה', 'مجرّة', 'Galaxie', 'Galaxie', 'Galaxy'],
        s_lanterns: ['פנסים צפים', 'فوانيس طائرة', 'Lampioane', 'Lanternes', 'Lanterns'],
        s_orb: ['כדור נשימה', 'كرة التنفس', 'Sfera respirației', 'Sphère de souffle', 'Breathing orb'],
        a_bowls: ['קערות טיבטיות', 'أوعية تبتية', 'Boluri tibetane', 'Bols tibétains', 'Singing bowls'],
        a_drone: ['אום מדיטציה', 'أوم تأمل', 'Om meditație', 'Om méditation', 'Om meditation'],
        a_zen: ['זן', 'زن', 'Zen', 'Zen', 'Zen'],
        a_rain: ['גשם', 'مطر', 'Ploaie', 'Pluie', 'Rain'],
        a_ocean: ['גלים', 'أمواج', 'Valuri', 'Vagues', 'Waves'],
        a_forest: ['יער', 'غابة', 'Pădure', 'Forêt', 'Forest'],
        a_night: ['לילה', 'ليل', 'Noapte', 'Nuit', 'Night'],
        a_fire: ['אח בוערת', 'موقد', 'Foc', 'Feu', 'Fireplace'],
        a_none: ['ללא צליל', 'بدون صوت', 'Fără sunet', 'Sans son', 'No sound'],
        // M-068: new worlds, sounds and the tabbed menu
        s_snow: ['יער מושלג', 'غابة ثلجية', 'Pădure înzăpezită', 'Forêt enneigée', 'Snowy forest'],
        s_jelly: ['מדוזות במעמקים', 'قناديل البحر', 'Meduze', 'Méduses', 'Jellyfish deep'],
        s_fireflies: ['גחליליות', 'يراعات', 'Licurici', 'Lucioles', 'Fireflies'],
        s_sunset: ['שקיעה בים', 'غروب على البحر', 'Apus pe mare', 'Coucher de soleil', 'Sea sunset'],
        s_nebula: ['ערפילית', 'سديم', 'Nebuloasă', 'Nébuleuse', 'Nebula'],
        a_chimes: ['פעמוני רוח', 'أجراس الرياح', 'Clopoței de vânt', 'Carillon', 'Wind chimes'],
        a_wind: ['רוח', 'رياح', 'Vânt', 'Vent', 'Wind'],
        a_storm: ['סערה רחוקה', 'عاصفة بعيدة', 'Furtună', 'Orage', 'Far storm'],
        a_underwater: ['מתחת למים', 'تحت الماء', 'Sub apă', 'Sous l’eau', 'Underwater'],
        a_space: ['חלל', 'فضاء', 'Spațiu', 'Espace', 'Space'],
        a_synth: ['גלים אלקטרוניים', 'موجات إلكترونية', 'Sintetizator', 'Nappes synthé', 'Synth pads'],
        go: ['✓ התחלה', '✓ ابدأ', '✓ Începe', '✓ Commencer', '✓ Start'],
        menu: ['תפריט', 'القائمة', 'Meniu', 'Menu', 'Menu'],
        last: ['מצב אחרון', 'الوضع الأخير', 'Ultimul mod', 'Dernier mode', 'Last mode'],
        lock: ['נעילה', 'قفل', 'Blocare', 'Verrouiller', 'Lock'],
        locked: ['🔒 המסך נעול · החזיקו את המנעול לפתיחה', '🔒 الشاشة مقفلة · اضغط مطولاً على القفل للفتح', '🔒 Ecran blocat · țineți apăsat lacătul', '🔒 Écran verrouillé · maintenez le cadenas', '🔒 Screen locked · hold the lock to open']
    };
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const tx = k => (TX[k] || [k])[li()];

    const SCENES = [['aurora', '🌌'], ['ocean', '🌊'], ['galaxy', '🌀'], ['lanterns', '🏮'], ['orb', '🔮'], ['snow', '🌲'], ['jelly', '🪼'], ['fireflies', '✨'], ['sunset', '🌅'], ['nebula', '☁️']];
    const SOUNDS = [['none', '🔇'], ['bowls', '🔔'], ['drone', '🕉️'], ['chimes', '🎐'], ['zen', '🎋'], ['rain', '🌧️'], ['ocean', '🌊'], ['forest', '🌲'], ['night', '🦗'], ['fire', '🔥'], ['wind', '🍃'], ['storm', '⛈️'], ['underwater', '🫧'], ['space', '🪐'], ['synth', '🎹']];
    const TIMERS = [0, 10, 20, 30, 45, 60];
    const BREATH = { inh: 4, hold: 1.5, exh: 6 }; // seconds, calm 4 / 1.5 / 6 rhythm
    const BP = BREATH.inh + BREATH.hold + BREATH.exh;

    // M-074: calm mode always opens fresh (quiet, nothing pre-chosen); "Last mode" brings back the last choices
    const FRESH = { scene: 'aurora', sound: 'none', timer: 0 };
    let st = { scene: 'aurora', sound: 'bowls', timer: 30, vol: 60, breath: false };
    try { Object.assign(st, JSON.parse(localStorage.getItem('medtime_relax') || '{}')); } catch (e) { }
    let last = { scene: st.scene, sound: st.sound, timer: st.timer }, chosen = {};
    // only what was really chosen this time replaces the stored "last mode"
    const save = () => { try {
        const sv = JSON.parse(localStorage.getItem('medtime_relax') || '{}'); sv.vol = st.vol; sv.breath = st.breath;
        ['scene', 'sound', 'timer'].forEach(k => { if (chosen[k]) sv[k] = st[k]; });
        localStorage.setItem('medtime_relax', JSON.stringify(sv));
    } catch (e) { } };

    // ======================= page =======================
    let root, canvas, panel, hideT = 0, open = false;
    function build() {
        if (root) return;
        root = document.createElement('div');
        root.id = 'relax';
        root.innerHTML =
            '<canvas id="rx-canvas"></canvas>' +
            '<div class="rx-fade"></div>' +
            '<button type="button" class="rx-close" aria-label="close">✕</button>' +
            '<div class="rx-left"></div>' +
            '<div class="rx-breath"><div class="rx-ring"></div><div class="rx-btext"></div></div>' +
            '<div class="rx-hint"></div>' +
            '<div class="rx-panel">' +
            '<div class="rx-title"></div>' +
            '<div class="rx-scroll">' +
            ['scene', 'sound', 'timer'].map((t, i) => '<section class="rx-sec" data-t="' + t + '"><div class="rx-h"><span class="rx-hn">' + (i + 1) + '</span><b></b><small></small></div>' +
                '<div class="rx-grid"></div></section>').join('') +
            '<div class="rx-line"><span data-k="vol"></span><input type="range" class="vol" id="rx-vol" min="0" max="100" step="5"></div>' +
            '<label class="rx-line"><span data-k="breath"></span><input type="checkbox" id="rx-br" class="toggle"></label>' +
            '</div>' +
            '<button type="button" class="rx-go"></button>' +
            '</div>' +
            '<button type="button" class="rx-mini"><span class="rx-mini-ico"></span><span class="rx-mini-t"></span></button>' +
            '<div class="rx-bar">' + ['scene', 'sound', 'timer', 'last', 'lock'].map(t => '<button type="button" data-s="' + t + '"><span class="rx-bi"></span><small></small></button>').join('') + '</div>' +
            '<button type="button" class="rx-unlock" aria-label="unlock"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="29"/></svg><span>🔒</span></button>' +
            '<div class="rx-lockmsg"></div>';
        document.body.appendChild(root);
        canvas = root.querySelector('#rx-canvas');
        panel = root.querySelector('.rx-panel');
        root.querySelector('.rx-close').addEventListener('click', e => { e.stopPropagation(); closeRelax(); });
        const vol = root.querySelector('#rx-vol');
        vol.addEventListener('input', () => { st.vol = +vol.value; paintVol(); setVol(st.vol / 100); save(); poke(); });
        const br = root.querySelector('#rx-br');
        br.addEventListener('change', () => { st.breath = br.checked; save(); drawBreath(); poke(); });
        panel.addEventListener('pointerdown', e => { e.stopPropagation(); poke(); });
        root.querySelector('.rx-go').addEventListener('click', e => { e.stopPropagation(); hidePanel(); });
        // M-073: light menu: a slim bar with 3 small buttons; each one opens only its own choices
        root.querySelectorAll('.rx-bar button').forEach(b => {
            b.addEventListener('pointerdown', e => e.stopPropagation());
            b.addEventListener('click', e => {
                e.stopPropagation(); vib(10);
                if (b.dataset.s === 'last') { useLast(); return; }
                if (b.dataset.s === 'lock') { lockOn(); return; }
                setSec(sec === b.dataset.s ? '' : b.dataset.s); poke();
            });
        });
        // M-074: lock: taps do nothing; hold the lock 1.2 s to open again
        const ul = root.querySelector('.rx-unlock'); let holdT = 0;
        const holdEnd = () => { clearTimeout(holdT); ul.classList.remove('hold'); };
        ul.addEventListener('pointerdown', e => { e.stopPropagation(); ul.classList.add('hold'); holdT = setTimeout(() => { holdEnd(); lockOff(); }, 1200); });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => ul.addEventListener(ev, holdEnd));
        const mini = root.querySelector('.rx-mini');
        mini.addEventListener('pointerdown', e => e.stopPropagation());
        mini.addEventListener('click', e => { e.stopPropagation(); poke(); });
        // tap on the picture: show / hide the menu; drag: look around
        let sx = 0, sy = 0, down = false;
        root.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sy = e.clientY; });
        root.addEventListener('pointermove', e => {
            if (!down) return;
            look.tx = Math.max(-1, Math.min(1, look.tx + (e.clientX - sx) / innerWidth * 1.5));
            look.ty = Math.max(-1, Math.min(1, look.ty + (e.clientY - sy) / innerHeight * 1.5));
            sx = e.clientX; sy = e.clientY;
        });
        root.addEventListener('pointerup', e => {
            if (!down) return; down = false;
            if (Math.abs(e.clientX - sx) < 8 && Math.abs(e.clientY - sy) < 8 && !e.target.closest('.rx-panel, .rx-close, .rx-mini, .rx-bar, .rx-unlock')) { if (root.classList.contains('rx-locked')) lockMsg(); else if (sec) setSec(''); else togglePanel(); }
        });
    }
    function paintVol() { const v = root.querySelector('#rx-vol'); v.value = st.vol; v.style.setProperty('--p', st.vol + '%'); }
    const vib = ms => { if (navigator.vibrate) try { navigator.vibrate(ms); } catch (e) { } };
    // M-071: one list with a separate heading for each part (background / sound / timer) and the choices under it
    function grid(t, list, cur, label, pick) {
        const box = root.querySelector('.rx-sec[data-t=' + t + '] .rx-grid');
        box.innerHTML = list.map(([k, ico]) => '<button type="button" class="rx-tile' + (k === cur ? ' sel' : '') + '" data-k="' + k + '">' +
            '<span class="rx-ico">' + (ico || '⏳') + '</span><span class="rx-tl">' + label(k) + '</span></button>').join('');
        box.querySelectorAll('.rx-tile').forEach(b => b.addEventListener('click', () => { vib(12); pick(b.dataset.k); poke(); }));
    }
    function drawPanel() {
        root.querySelector('.rx-title').textContent = tx('title');
        root.querySelectorAll('[data-k]').forEach(el => { if (!el.classList.contains('rx-tile') && TX[el.dataset.k]) el.textContent = tx(el.dataset.k); });
        root.querySelector('.rx-hint').textContent = tx('tapHint');
        root.querySelectorAll('.rx-sec').forEach(sec => {
            const t = sec.dataset.t;
            const cur = t === 'scene' ? (SCENES.find(x => x[0] === st.scene) || [])[1] + ' ' + tx('s_' + st.scene)
                : t === 'sound' ? (SOUNDS.find(x => x[0] === st.sound) || [])[1] + ' ' + tx('a_' + st.sound)
                    : (+st.timer ? st.timer + ' ' + tx('min') : '♾️ ' + tx('off'));
            sec.querySelector('.rx-h b').textContent = tx(t);
            sec.querySelector('.rx-h small').textContent = cur;
        });
        const goTo = t => setTimeout(() => {
            const sec = root.querySelector('.rx-sec[data-t=' + t + ']'), box = root.querySelector('.rx-scroll');
            if (sec && box) box.scrollTo({ top: sec.offsetTop - box.offsetTop - 4, behavior: 'smooth' });
        }, 350);
        const done = () => setTimeout(() => setSec(''), 380);
        grid('scene', SCENES, chosen.scene ? st.scene : '', k => tx('s_' + k), k => { st.scene = k; chosen.scene = 1; save(); setScene(k); drawPanel(); done(); });
        grid('sound', SOUNDS, chosen.sound ? st.sound : '', k => tx('a_' + k), k => { st.sound = k; chosen.sound = 1; save(); playSound(k); drawPanel(); });
        grid('timer', TIMERS.map(m => [String(m), m ? '⏳' : '♾️']), chosen.timer ? String(st.timer) : '', k => +k ? k + ' ' + tx('min') : tx('off'),
            k => { st.timer = +k; chosen.timer = 1; save(); startTimer(); drawPanel(); done(); });
        root.querySelectorAll('.rx-bar button').forEach(b => {
            const t = b.dataset.s;
            if (t === 'last') { b.querySelector('.rx-bi').textContent = '↺'; b.querySelector('small').textContent = tx('last'); b.hidden = !!(chosen.scene || chosen.sound || chosen.timer); return; }
            if (t === 'lock') { b.querySelector('.rx-bi').textContent = '🔓'; b.querySelector('small').textContent = tx('lock'); return; }
            b.querySelector('.rx-bi').textContent = !chosen[t] ? (t === 'scene' ? '🖼️' : t === 'sound' ? '🎵' : '⏳')
                : t === 'scene' ? (SCENES.find(x => x[0] === st.scene) || [])[1] : t === 'sound' ? (SOUNDS.find(x => x[0] === st.sound) || [])[1] : (+st.timer ? '⏳' : '♾️');
            b.querySelector('small').textContent = t === 'timer' && chosen.timer ? (+st.timer ? st.timer + ' ' + tx('min') : tx('off')) : tx(t);
            b.classList.toggle('on', sec === t);
        });
        root.querySelector('.rx-go').textContent = tx('go');
        root.querySelector('.rx-mini-ico').textContent = (SCENES.find(x => x[0] === st.scene) || ['', '🌙'])[1];
        root.querySelector('.rx-mini-t').textContent = tx('menu');
        paintVol();
        root.querySelector('#rx-br').checked = !!st.breath;
        drawBreath();
    }
    let sec = '';
    function setSec(t) {
        sec = t; root.dataset.sec = t;
        root.querySelectorAll('.rx-bar button').forEach(b => b.classList.toggle('on', b.dataset.s === t));
        const box = root.querySelector('.rx-scroll'); if (box) box.scrollTop = 0;
    }
    function useLast() {
        Object.assign(st, last); chosen = { scene: 1, sound: 1, timer: 1 };
        setScene(st.scene); playSound(st.sound); startTimer(); save(); drawPanel(); setSec(''); poke();
    }
    function lockMsg() {
        const m = root.querySelector('.rx-lockmsg'); m.textContent = tx('locked');
        m.classList.add('show'); clearTimeout(m._t); m._t = setTimeout(() => m.classList.remove('show'), 2200);
    }
    function lockOn() { setSec(''); root.classList.add('rx-locked'); hidePanel(); lockMsg(); }
    function lockOff() { vib(25); root.classList.remove('rx-locked'); poke(); }
    function hidePanel() { clearTimeout(hideT); setSec(''); root.classList.add('rx-hide'); }
    function poke() { clearTimeout(hideT); root.classList.remove('rx-hide'); hideT = setTimeout(hidePanel, 25000); }
    function togglePanel() { if (root.classList.contains('rx-hide')) poke(); else hidePanel(); }
    function drawBreath() { root.classList.toggle('rx-br-on', !!st.breath || st.scene === 'orb'); }

    // ======================= sleep timer =======================
    let endAt = 0, tickT = 0, ending = false;
    function startTimer() {
        endAt = st.timer ? Date.now() + st.timer * 60000 : 0; ending = false;
        root.classList.remove('rx-ending'); setVol(st.vol / 100);
        clearInterval(tickT); tickT = setInterval(tick, 1000); tick();
    }
    function tick() {
        const el = root.querySelector('.rx-left');
        if (!endAt) { el.textContent = ''; return; }
        const left = Math.max(0, endAt - Date.now());
        const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
        el.textContent = '⏳ ' + tx('left') + ' ' + m + ':' + String(s).padStart(2, '0');
        if (left <= 20000 && !ending) { ending = true; root.classList.add('rx-ending'); fadeVol(0, 19000); }
        if (left <= 0) closeRelax();
    }

    // ======================= sound =======================
    let ac = null, master = null, wet = null, loopEl = null, synthT = 0, nodes = [], vol = 0.6, fadeI = 0;
    function audio() {
        if (!ac) {
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
            ac = new AC(); master = ac.createGain(); master.connect(ac.destination);
            const conv = ac.createConvolver(), len = ac.sampleRate * 5, buf = ac.createBuffer(2, len, ac.sampleRate);
            for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
            conv.buffer = buf; wet = ac.createGain(); wet.gain.value = 0.9; wet.connect(conv); conv.connect(master);
        }
        if (ac.state === 'suspended') ac.resume();
        return ac;
    }
    function setVol(v) {
        vol = v; clearInterval(fadeI);
        if (master) master.gain.setTargetAtTime(v * 0.9, ac.currentTime, 0.1);
    }
    function fadeVol(to, ms) {
        clearInterval(fadeI); const from = vol, t0 = Date.now();
        fadeI = setInterval(() => {
            const k = Math.min(1, (Date.now() - t0) / ms), v = from + (to - from) * k; vol = v;
            if (master) master.gain.value = v * 0.9;
            if (k >= 1) clearInterval(fadeI);
        }, 100);
    }
    function stopSound() {
        clearTimeout(synthT); synthT = 0;
        if (loopEl) { loopEl.stop(); loopEl = null; }
        nodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) { } }); nodes = [];
    }
    function bowl(f, amp) {
        const t = ac.currentTime, out = ac.createGain(); out.gain.value = amp;
        out.connect(master); out.connect(wet);
        [[1, 1, 11], [2.71, 0.45, 7], [5.15, 0.2, 4.5], [8.5, 0.08, 3]].forEach(([r, a, dec]) => {
            [0, 0.7].forEach(det => {
                const o = ac.createOscillator(), g = ac.createGain();
                o.type = 'sine'; o.frequency.value = f * r + det;
                g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a * 0.22, t + 0.015);
                g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
                o.connect(g); g.connect(out); o.start(t); o.stop(t + dec + 0.1);
            });
        });
    }
    function bowls() {
        const notes = [174.6, 196, 220, 261.6, 293.7, 329.6, 392];
        const f = notes[Math.floor(Math.random() * notes.length)];
        bowl(f, 0.9);
        if (Math.random() < 0.3) setTimeout(() => open && bowl(f * 1.5, 0.45), 900 + Math.random() * 900);
        synthT = setTimeout(bowls, 6500 + Math.random() * 5500);
    }
    function drone() {
        const t = ac.currentTime, bus = ac.createGain(); bus.gain.value = 0;
        bus.gain.linearRampToValueAtTime(0.5, t + 4); bus.connect(master); bus.connect(wet); nodes.push(bus);
        [[108, 'sine', 0.5], [162, 'sine', 0.22], [216, 'triangle', 0.14], [54, 'sine', 0.3], [324, 'sine', 0.06]].forEach(([f, type, a], i) => {
            const o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
            o.type = type; o.frequency.value = f + (i % 2 ? 0.4 : -0.3); g.gain.value = a;
            lfo.frequency.value = 0.05 + i * 0.023; lg.gain.value = a * 0.45; lfo.connect(lg); lg.connect(g.gain);
            o.connect(g); g.connect(bus); o.start(); lfo.start(); nodes.push(o, lfo);
        });
        // soft breathing air
        const len = ac.sampleRate * 2, nb = ac.createBuffer(1, len, ac.sampleRate), d = nb.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const n = ac.createBufferSource(); n.buffer = nb; n.loop = true;
        const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
        const ng = ac.createGain(); ng.gain.value = 0.05;
        const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 1 / BP; lg.gain.value = 0.045;
        lfo.connect(lg); lg.connect(ng.gain);
        n.connect(lp); lp.connect(ng); ng.connect(bus); n.start(); lfo.start(); nodes.push(n, lfo);
        synthT = setTimeout(function chime() { if (!open) return; bowl(216, 0.35); synthT = setTimeout(chime, 22000 + Math.random() * 15000); }, 9000);
    }
    // M-068: wind chimes: soft random bell notes of a pentatonic scale
    function chimes() {
        const notes = [523.3, 587.3, 659.3, 784, 880, 1046.5, 1174.7];
        const n = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < n; i++) setTimeout(() => { if (open && ac) bowl(notes[Math.floor(Math.random() * notes.length)], 0.28 + Math.random() * 0.2); }, i * (180 + Math.random() * 420));
        synthT = setTimeout(chimes, 1600 + Math.random() * 3800);
    }
    // M-071: nature sounds with no cut and no noticeable repeat: two players take turns, each one starts at a
    // random spot of the recording at a slightly different speed, with a slow 3 s cross-fade, plus a gentle slow swell
    function ambPlayer(k) {
        const els = [0, 1].map(() => { const e = new Audio('ambient/' + k + '.ogg'); e.preload = 'auto'; e.loop = true; e.volume = 0; e.preservesPitch = false; return e; });
        const g = [0, 0], ph = Math.random() * 6.28, t0 = Date.now();
        let cur = 0, nextAt = 0, alive = true;
        const go = i => {
            const e = els[i], d = isFinite(e.duration) && e.duration > 6 ? e.duration : 0;
            const at = d ? Math.random() * (d - 8) : 0, rate = 0.93 + Math.random() * 0.14;
            try { if (d) e.currentTime = at; } catch (x) { }
            try { e.playbackRate = rate; } catch (x) { }
            e.play().catch(() => { });
            // hand over before this player reaches the end of the recording (so its loop point is never heard)
            const room = d ? ((d - at) / rate - 3.3) * 1000 : 9000;
            cur = i; nextAt = Date.now() + Math.max(3500, Math.min(room, 7000 + Math.random() * 6000));
        };
        go(0);
        const iv = setInterval(() => {
            if (!alive) return;
            if (Date.now() > nextAt) go(1 - cur);
            const tt = (Date.now() - t0) / 1000, swell = 0.82 + 0.1 * Math.sin(tt * 0.11 + ph) + 0.08 * Math.sin(tt * 0.047 + ph * 2);
            for (let i = 0; i < 2; i++) {
                g[i] = i === cur ? Math.min(1, g[i] + 0.017) : Math.max(0, g[i] - 0.017);
                // equal-power cross-fade, so the loudness does not dip in the middle
                els[i].volume = Math.max(0, Math.min(1, Math.sin(g[i] * Math.PI / 2) * vol * swell));
                if (i !== cur && g[i] === 0 && !els[i].paused) els[i].pause();
            }
        }, 50);
        return { stop() { alive = false; clearInterval(iv); els.forEach(e => { try { e.pause(); e.removeAttribute('src'); e.load(); } catch (x) { } }); } };
    }
    function playSound(k) {
        stopSound();
        if (k === 'none' || !open) return;
        if (k === 'bowls' || k === 'drone' || k === 'chimes') {
            if (!audio()) return;
            master.gain.value = vol * 0.9;
            k === 'bowls' ? bowls() : k === 'drone' ? drone() : chimes();
        } else {
            loopEl = ambPlayer(k);
        }
    }

    // ======================= 3D =======================
    let renderer = null, scene = null, camera = null, world = null, clock = null, raf = 0;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    let glowTexC = null;
    function glowTex() {
        if (glowTexC) return glowTexC;
        const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
        const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(255,255,255,0.75)');
        r.addColorStop(0.45, 'rgba(255,255,255,0.18)'); r.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = r; g.fillRect(0, 0, 128, 128);
        glowTexC = new THREE.CanvasTexture(c); return glowTexC;
    }
    function skyDome(top, bottom, horizon) {
        const m = new THREE.ShaderMaterial({
            side: THREE.BackSide, depthWrite: false,
            uniforms: { uTop: { value: new THREE.Color(top) }, uBot: { value: new THREE.Color(bottom) }, uHor: { value: new THREE.Color(horizon || bottom) } },
            vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
            fragmentShader: 'uniform vec3 uTop,uBot,uHor; varying vec3 vP; void main(){ float h=vP.y; vec3 c = h>0. ? mix(uHor,uTop,pow(h,0.55)) : mix(uHor,uBot,pow(-h,0.4)); gl_FragColor=vec4(c,1.); }'
        });
        const s = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), m); s.renderOrder = -10; return s;
    }
    function stars(n, rad, minY, size) {
        const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3), c = new Float32Array(n * 3), ph = new Float32Array(n);
        const col = new THREE.Color();
        for (let i = 0; i < n; i++) {
            let v; do { v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1); } while (v.length() > 1 || v.length() < 0.2);
            v.normalize().multiplyScalar(rad * (0.8 + Math.random() * 0.2)); if (v.y < minY) v.y = Math.abs(v.y) + minY;
            p.set([v.x, v.y, v.z], i * 3);
            col.setHSL(0.55 + Math.random() * 0.2, 0.5, 0.75 + Math.random() * 0.25); c.set([col.r, col.g, col.b], i * 3); ph[i] = Math.random() * 6.28;
        }
        g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1));
        const m = new THREE.ShaderMaterial({
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            uniforms: { uT: { value: 0 }, uMap: { value: glowTex() }, uS: { value: size || 3 } },
            vertexShader: 'attribute float ph; attribute vec3 color; uniform float uT,uS; varying vec3 vC; varying float vA; void main(){ vC=color; vA=0.55+0.45*sin(uT*1.3+ph*3.); vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=uS*(0.6+0.6*fract(ph)); gl_Position=projectionMatrix*mv; }',
            fragmentShader: 'uniform sampler2D uMap; varying vec3 vC; varying float vA; void main(){ vec4 t=texture2D(uMap,gl_PointCoord); gl_FragColor=vec4(vC*vA, t.a*vA); }'
        });
        const pts = new THREE.Points(g, m); pts.userData.u = m.uniforms; return pts;
    }
    const NOISE = 'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
        'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}' +
        'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}';
    function breathK(t) { // 0..1 orb size and phase name
        const x = t % BP;
        if (x < BREATH.inh) { const k = x / BREATH.inh; return [0.5 - 0.5 * Math.cos(k * Math.PI), 'inhale']; }
        if (x < BREATH.inh + BREATH.hold) return [1, 'hold'];
        const k = (x - BREATH.inh - BREATH.hold) / BREATH.exh; return [0.5 + 0.5 * Math.cos(k * Math.PI), 'exhale'];
    }

    const WORLDS = {
        aurora() {
            scene.add(skyDome(0x02030f, 0x01020a, 0x0b1f3a));
            const st1 = stars(2500, 700, 5, 3.2); scene.add(st1);
            const mats = [];
            const auroraMat = (c1, c2, seed) => {
                const m = new THREE.ShaderMaterial({
                    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
                    uniforms: { uT: { value: 0 }, uC1: { value: new THREE.Color(c1) }, uC2: { value: new THREE.Color(c2) }, uS: { value: seed } },
                    vertexShader: 'uniform float uT,uS; varying vec2 vUv; void main(){ vUv=uv; vec3 p=position; p.z+=sin(p.x*0.025+uT*0.12+uS)*28.+sin(p.x*0.07-uT*0.09)*7.; p.y+=sin(p.x*0.03+uT*0.1)*4.; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }',
                    fragmentShader: 'uniform float uT,uS; uniform vec3 uC1,uC2; varying vec2 vUv; ' + NOISE +
                        'void main(){ float n=fbm(vec2(vUv.x*5.+uS+uT*0.035, uT*0.06)); float rays=noise(vec2(vUv.x*140.+n*14., uT*0.25+uS)); rays=0.35+0.65*rays*rays;' +
                        'float top=0.45+0.5*n; float band=smoothstep(0.,0.18,vUv.y)*(1.-smoothstep(top-0.3,top,vUv.y)); float a=band*rays*(0.45+n)*1.6;' +
                        'float edge=smoothstep(0.,0.12,vUv.x)*smoothstep(1.,0.88,vUv.x); vec3 col=mix(uC1,uC2,smoothstep(0.15,0.85,vUv.y)); gl_FragColor=vec4(col*a*edge, a*edge); }'
                });
                mats.push(m); return m;
            };
            const g = new THREE.PlaneGeometry(520, 90, 260, 1);
            const a1 = new THREE.Mesh(g, auroraMat(0x22ff99, 0x7c3aed, 0.0)); a1.position.set(0, 58, -260); scene.add(a1);
            const a2 = new THREE.Mesh(g, auroraMat(0x2dd4bf, 0xec4899, 3.1)); a2.position.set(40, 70, -330); a2.rotation.y = 0.25; scene.add(a2);
            const a3 = new THREE.Mesh(g, auroraMat(0x4ade80, 0x38bdf8, 6.2)); a3.position.set(-80, 64, -300); a3.rotation.y = -0.3; scene.add(a3);
            // mountains
            const mg = new THREE.PlaneGeometry(1400, 260, 140, 26); mg.rotateX(-Math.PI / 2);
            const pa = mg.attributes.position;
            for (let i = 0; i < pa.count; i++) {
                const x = pa.getX(i), z = pa.getZ(i), far = (130 - z) / 260;
                const h = Math.max(0, (Math.sin(x * 0.011) * 0.5 + Math.sin(x * 0.027 + 1.7) * 0.3 + Math.sin(x * 0.061 + z * 0.02) * 0.2 + 0.35) * 70 * far + Math.random() * 3 * far);
                pa.setY(i, h);
            }
            mg.computeVertexNormals();
            const mm = new THREE.MeshStandardMaterial({ color: 0x0a1226, roughness: 0.95, flatShading: true });
            const mtn = new THREE.Mesh(mg, mm); mtn.position.set(0, -2, -290); scene.add(mtn);
            const mtnR = new THREE.Mesh(mg, new THREE.MeshBasicMaterial({ color: 0x050b18, side: THREE.DoubleSide })); mtnR.scale.y = -1; mtnR.position.set(0, -2, -290); scene.add(mtnR);
            scene.add(new THREE.HemisphereLight(0x3ddc97, 0x020617, 0.28));
            const dl = new THREE.DirectionalLight(0x8b5cf6, 0.25); dl.position.set(-1, 2, -2); scene.add(dl);
            // lake with mirrored aurora
            const mir = [a1, a2, a3].map(a => { const r = a.clone(); r.scale.y = -1; r.position.y = -a.position.y - 4; scene.add(r); return r; });
            const lake = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0x010614, transparent: true, opacity: 0.72, depthWrite: false }));
            lake.rotation.x = -Math.PI / 2; lake.position.y = -2.2; lake.renderOrder = 5; scene.add(lake);
            camera.position.set(0, 6, 40); camera.userData.base = new THREE.Vector3(0, 6, 40); camera.userData.at = new THREE.Vector3(0, 30, -200);
            return { update(t) { mats.forEach(m => m.uniforms.uT.value = t); st1.userData.u.uT.value = t; } };
        },

        ocean() {
            scene.add(skyDome(0x030716, 0x01030a, 0x1b2a55));
            const st1 = stars(2000, 700, 30, 3); scene.add(st1);
            const moonPos = new THREE.Vector3(0, 95, -520);
            const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xfff7d6, blending: THREE.AdditiveBlending, depthWrite: false }));
            moon.scale.set(60, 60, 1); moon.position.copy(moonPos); scene.add(moon);
            const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0x6d8cff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
            halo.scale.set(320, 320, 1); halo.position.copy(moonPos); scene.add(halo);
            const disc = new THREE.Mesh(new THREE.CircleGeometry(13, 48), new THREE.MeshBasicMaterial({ color: 0xfffbe8 }));
            disc.position.copy(moonPos); disc.lookAt(0, 0, 0); scene.add(disc);
            const g = new THREE.PlaneGeometry(900, 900, 300, 300); g.rotateX(-Math.PI / 2);
            const m = new THREE.ShaderMaterial({
                uniforms: { uT: { value: 0 }, uMoon: { value: moonPos.clone().normalize() } },
                vertexShader: 'uniform float uT; varying vec3 vW; varying vec3 vN;' +
                    'void wv(vec2 p,vec2 d,float f,float a,float s,inout float h,inout vec2 g){ d=normalize(d); float x=dot(p,d)*f+uT*s; h+=a*sin(x); g+=a*f*cos(x)*d; }' +
                    'void main(){ vec3 p=position; float h=0.; vec2 g=vec2(0.);' +
                    'wv(p.xz,vec2(1.,0.6),0.05,1.3,0.8,h,g); wv(p.xz,vec2(-0.7,1.),0.09,0.6,1.2,h,g); wv(p.xz,vec2(0.3,1.),0.16,0.25,1.9,h,g); wv(p.xz,vec2(1.,-0.4),0.23,0.12,2.5,h,g);' +
                    'p.y+=h; vN=normalize(vec3(-g.x,1.,-g.y)); vec4 wp=modelMatrix*vec4(p,1.); vW=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }',
                fragmentShader: 'uniform vec3 uMoon; uniform float uT; varying vec3 vW; varying vec3 vN; ' + NOISE +
                    'void main(){ vec2 q=vW.xz*0.35; float e=0.6; float n0=fbm(q+uT*0.25); vec3 N=normalize(vN+vec3(fbm(q+vec2(e,0.)+uT*0.25)-n0,0.,fbm(q+vec2(0.,e)+uT*0.25)-n0)*0.9);' +
                    'vec3 V=normalize(cameraPosition-vW); vec3 R=reflect(-V,N); float F=0.02+0.98*pow(1.-max(dot(N,V),0.),5.);' +
                    'float sp=pow(max(dot(R,uMoon),0.),300.)*4.+pow(max(dot(R,uMoon),0.),40.)*0.22; vec3 deep=vec3(0.004,0.015,0.04); vec3 sky=vec3(0.06,0.11,0.32);' +
                    'vec3 c=mix(deep,sky,F)+sp*vec3(1.,0.94,0.78); float d=length(vW-cameraPosition); c=mix(c,vec3(0.07,0.1,0.22),smoothstep(100.,440.,d)); gl_FragColor=vec4(c,1.); }'
            });
            scene.add(new THREE.Mesh(g, m));
            camera.position.set(0, 7, 30); camera.userData.base = new THREE.Vector3(0, 7, 30); camera.userData.at = new THREE.Vector3(0, 14, -200);
            return { update(t) { m.uniforms.uT.value = t; st1.userData.u.uT.value = t; camera.userData.bob = Math.sin(t * 0.6) * 0.5; } };
        },

        galaxy() {
            scene.add(skyDome(0x02010a, 0x02010a, 0x0b0626));
            const st1 = stars(2500, 700, -999, 2.6); scene.add(st1);
            const N = 26000, g = new THREE.BufferGeometry(), p = new Float32Array(N * 3), c = new Float32Array(N * 3), s = new Float32Array(N);
            const inC = new THREE.Color(0xffb36b), outC = new THREE.Color(0x4f7bff), pink = new THREE.Color(0xd946ef), col = new THREE.Color();
            for (let i = 0; i < N; i++) {
                const r = Math.pow(Math.random(), 1.6) * 60, arm = (i % 4) / 4 * Math.PI * 2, spin = r * 0.11;
                const rnd = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (2 + r * 0.22);
                p.set([Math.cos(arm + spin) * r + rnd(), rnd() * 0.35, Math.sin(arm + spin) * r + rnd()], i * 3);
                col.copy(inC).lerp(outC, r / 60); if (Math.random() < 0.08) col.lerp(pink, 0.7); c.set([col.r, col.g, col.b], i * 3);
                s[i] = Math.random();
            }
            g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.setAttribute('ph', new THREE.BufferAttribute(s, 1));
            const m = new THREE.ShaderMaterial({
                transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
                uniforms: { uT: { value: 0 }, uMap: { value: glowTex() }, uPR: { value: renderer.getPixelRatio() } },
                vertexShader: 'attribute vec3 color; attribute float ph; uniform float uPR; varying vec3 vC; void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=(1.+ph*2.4)*uPR*(170./-mv.z); gl_Position=projectionMatrix*mv; }',
                fragmentShader: 'uniform sampler2D uMap; varying vec3 vC; void main(){ float a=texture2D(uMap,gl_PointCoord).a; gl_FragColor=vec4(vC*a*1.0,a); }'
            });
            const gal = new THREE.Points(g, m); scene.add(gal);
            const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xffd7a0, blending: THREE.AdditiveBlending, depthWrite: false }));
            core.scale.set(14, 14, 1); scene.add(core);
            const nebula = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0x7c3aed, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
            nebula.scale.set(150, 150, 1); scene.add(nebula);
            camera.userData.base = null;
            return {
                update(t) {
                    gal.rotation.y = t * 0.03; st1.userData.u.uT.value = t;
                    const a = t * 0.02, r = 72 - Math.sin(t * 0.05) * 10;
                    camera.position.set(Math.sin(a) * r + look.x * 15, 34 + Math.sin(t * 0.07) * 8 - look.y * 15, Math.cos(a) * r);
                    camera.lookAt(0, 0, 0);
                }
            };
        },

        lanterns() {
            scene.add(skyDome(0x0b0a2a, 0x02030c, 0x5a2a3a));
            const st1 = stars(1500, 700, 40, 2.8); scene.add(st1);
            const water = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0x1c1436, transparent: true, opacity: 0.8, depthWrite: false }));
            water.rotation.x = -Math.PI / 2; water.renderOrder = 0; scene.add(water);
            const hills = new THREE.Mesh(new THREE.PlaneGeometry(2000, 40), new THREE.MeshBasicMaterial({ color: 0x150f30 }));
            hills.position.set(0, 8, -420); scene.add(hills);
            const body = new THREE.CylinderGeometry(0.55, 0.42, 1.1, 14, 1, true);
            const bodyM = new THREE.MeshBasicMaterial({ color: 0xffa94d, side: THREE.DoubleSide });
            const glowM = new THREE.SpriteMaterial({ map: glowTex(), color: 0xff8a3d, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
            const reflM = new THREE.SpriteMaterial({ map: glowTex(), color: 0xff7a2e, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
            const L = [];
            const reset = (o, first) => {
                o.x = (Math.random() - 0.5) * 110; o.z = -12 - Math.random() * 170; o.y = first ? Math.random() * 70 : -2 - Math.random() * 5;
                o.v = 0.7 + Math.random() * 0.9; o.ph = Math.random() * 6.28;
            };
            for (let i = 0; i < 90; i++) {
                const g = new THREE.Group(), mb = new THREE.Mesh(body, bodyM), gl = new THREE.Sprite(glowM), rf = new THREE.Sprite(reflM);
                gl.scale.set(6.5, 6.5, 1); g.add(mb); g.add(gl); rf.scale.set(6, 14, 1); rf.renderOrder = 6;
                scene.add(g); scene.add(rf);
                const o = { g, rf }; reset(o, true); L.push(o);
            }
            camera.position.set(0, 6, 30); camera.userData.base = new THREE.Vector3(0, 6, 30); camera.userData.at = new THREE.Vector3(0, 52, -200);
            return {
                update(t, dt) {
                    st1.userData.u.uT.value = t;
                    L.forEach(o => {
                        o.y += o.v * dt; if (o.y > 90) reset(o, false);
                        const sw = Math.sin(t * 0.5 + o.ph) * 1.2;
                        o.g.position.set(o.x + sw, o.y, o.z); o.g.rotation.z = Math.sin(t * 0.8 + o.ph) * 0.08;
                        o.rf.position.set(o.x + sw, -o.y * 0.6 - 0.5, o.z); o.rf.visible = o.y < 70;
                    });
                }
            };
        },

        orb() {
            scene.add(skyDome(0x050826, 0x010208, 0x16123a));
            const st1 = stars(1800, 700, -999, 2.5); scene.add(st1);
            const m = new THREE.ShaderMaterial({
                transparent: true,
                uniforms: { uT: { value: 0 }, uB: { value: 0 } },
                vertexShader: 'uniform float uT,uB; varying vec3 vN; varying vec3 vV; varying float vD;' +
                    'void main(){ vec3 p=position; float d=sin(p.x*2.1+uT*0.9)*sin(p.y*2.3+uT*0.7)*sin(p.z*1.9+uT*0.8); vD=d; p+=normal*d*(0.16+0.1*uB);' +
                    'vec4 mv=modelViewMatrix*vec4(p,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
                fragmentShader: 'uniform float uB; varying vec3 vN; varying vec3 vV; varying float vD; void main(){ float f=pow(1.-max(dot(vN,vV),0.),2.2);' +
                    'vec3 a=vec3(0.13,0.83,0.93), b=vec3(0.55,0.36,0.96); vec3 c=mix(a,b,0.5+0.5*vD)*(0.45+1.5*f)+vec3(1.)*pow(f,5.)*0.6; c*=0.75+0.45*uB; gl_FragColor=vec4(c,0.55+0.45*f); }'
            });
            const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 48), m); scene.add(orb);
            const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0x38bdf8, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
            glow.scale.set(18, 18, 1); scene.add(glow);
            const N = 3000, g = new THREE.BufferGeometry(), p = new Float32Array(N * 3), ph = new Float32Array(N), c = new Float32Array(N * 3), col = new THREE.Color();
            for (let i = 0; i < N; i++) {
                const r = 5 + Math.random() * 9, a = Math.random() * Math.PI * 2, y = (Math.random() - 0.5) * 2.2 * (1 + (r - 5) * 0.15);
                p.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3); ph[i] = Math.random();
                col.setHSL(0.5 + Math.random() * 0.25, 0.8, 0.7); c.set([col.r, col.g, col.b], i * 3);
            }
            g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); g.setAttribute('color', new THREE.BufferAttribute(c, 3));
            const pm = new THREE.ShaderMaterial({
                transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
                uniforms: { uT: { value: 0 }, uMap: { value: glowTex() }, uS: { value: 1 } },
                vertexShader: 'attribute float ph; attribute vec3 color; uniform float uT,uS; varying vec3 vC; varying float vA; void main(){ vC=color; vA=0.4+0.6*sin(uT*2.+ph*40.); vec3 p=position*uS; vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=(2.+ph*3.)*(30./-mv.z); gl_Position=projectionMatrix*mv; }',
                fragmentShader: 'uniform sampler2D uMap; varying vec3 vC; varying float vA; void main(){ float a=texture2D(uMap,gl_PointCoord).a*vA; gl_FragColor=vec4(vC*a,a); }'
            });
            const ring = new THREE.Points(g, pm); ring.rotation.x = 0.45; scene.add(ring);
            camera.position.set(0, 0, 26); camera.userData.base = new THREE.Vector3(0, 0, 26); camera.userData.at = new THREE.Vector3(0, 0, 0);
            return {
                update(t) {
                    const [b] = breathK(t);
                    m.uniforms.uT.value = t; m.uniforms.uB.value = b; st1.userData.u.uT.value = t;
                    const s = 0.82 + 0.38 * b; orb.scale.setScalar(s); glow.scale.setScalar(14 + 10 * b);
                    ring.rotation.y = t * 0.08; pm.uniforms.uT.value = t; pm.uniforms.uS.value = 0.9 + 0.2 * b; orb.rotation.y = t * 0.1;
                }
            };
        }
    };

    // ---------- M-068: five more worlds ----------
    function points(n, place, color, size, extra) {
        const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3), ph = new Float32Array(n), c = new Float32Array(n * 3), col = new THREE.Color();
        for (let i = 0; i < n; i++) { const v = place(i); p.set(v, i * 3); ph[i] = Math.random(); color(col, i); c.set([col.r, col.g, col.b], i * 3); }
        g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); g.setAttribute('color', new THREE.BufferAttribute(c, 3));
        const m = new THREE.ShaderMaterial({
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            uniforms: { uT: { value: 0 }, uMap: { value: glowTex() }, uS: { value: size }, uPR: { value: renderer.getPixelRatio() } },
            vertexShader: 'attribute float ph; attribute vec3 color; uniform float uT,uS,uPR; varying vec3 vC; varying float vA; void main(){ vC=color; ' + (extra || 'vA=1.;') +
                ' vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=uS*uPR*(0.6+ph)*(60./-mv.z); gl_Position=projectionMatrix*mv; }',
            fragmentShader: 'uniform sampler2D uMap; varying vec3 vC; varying float vA; void main(){ float a=texture2D(uMap,gl_PointCoord).a*vA; gl_FragColor=vec4(vC*a,a); }'
        });
        const pts = new THREE.Points(g, m); pts.userData.u = m.uniforms; pts.userData.p = p; return pts;
    }
    function glowSprite(color, size, opacity) {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color, transparent: true, opacity: opacity == null ? 1 : opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
        sp.scale.set(size, size, 1); return sp;
    }
    Object.assign(WORLDS, {
        snow() {
            scene.add(skyDome(0x0b1a3a, 0x03050c, 0x2a4a75));
            const st1 = stars(1600, 700, 30, 2.6); scene.add(st1);
            const moon = glowSprite(0xe0f2fe, 60, 0.9); moon.position.set(-60, 90, -320); scene.add(moon);
            const moonC = new THREE.Mesh(new THREE.CircleGeometry(7, 40), new THREE.MeshBasicMaterial({ color: 0xf8fafc })); moonC.position.set(-60, 90, -321); scene.add(moonC);
            const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshBasicMaterial({ color: 0x4a6288 }));
            ground.rotation.x = -Math.PI / 2; scene.add(ground);
            const fogM = new THREE.Mesh(new THREE.PlaneGeometry(1600, 120), new THREE.MeshBasicMaterial({ color: 0x2a4a75, transparent: true, opacity: 0.55, depthWrite: false }));
            fogM.position.set(0, 30, -330); scene.add(fogM);
            const treeG = new THREE.ConeGeometry(1, 2.6, 7), capG = new THREE.ConeGeometry(0.62, 1.1, 7);
            const treeM = new THREE.MeshBasicMaterial({ color: 0x0c2a22 }), capM = new THREE.MeshBasicMaterial({ color: 0xdbe7f5 });
            for (let i = 0; i < 160; i++) {
                const x = (Math.random() - 0.5) * 420, z = -20 - Math.random() * 300; if (Math.abs(x) < 10 && z > -60) continue;
                const h = 4 + Math.random() * 7, g = new THREE.Group();
                for (let k = 0; k < 3; k++) { const c = new THREE.Mesh(treeG, treeM); c.scale.set(h * (0.5 - k * 0.12), h * 0.5, h * (0.5 - k * 0.12)); c.position.y = h * (0.45 + k * 0.38); g.add(c);
                    const cp = new THREE.Mesh(capG, capM); cp.scale.set(h * (0.5 - k * 0.12), h * 0.3, h * (0.5 - k * 0.12)); cp.position.y = h * (0.62 + k * 0.38); g.add(cp); }
                g.position.set(x, 0, z); scene.add(g);
            }
            const N = 2600, snow = points(N, () => [(Math.random() - 0.5) * 160, Math.random() * 70, -Math.random() * 150 + 20], c => c.setRGB(1, 1, 1), 1.4, 'vA=0.55+0.45*ph;');
            scene.add(snow); const sp = snow.userData.p, vel = new Float32Array(N); for (let i = 0; i < N; i++) vel[i] = 1.5 + Math.random() * 2.5;
            camera.position.set(0, 7, 34); camera.userData.base = new THREE.Vector3(0, 7, 34); camera.userData.at = new THREE.Vector3(0, 16, -200);
            return { update(t, dt) {
                st1.userData.u.uT.value = t;
                for (let i = 0; i < N; i++) { let y = sp[i * 3 + 1] - vel[i] * dt; if (y < 0) y += 70; sp[i * 3 + 1] = y; sp[i * 3] += Math.sin(t * 0.7 + i) * dt * 0.6; }
                snow.geometry.attributes.position.needsUpdate = true;
            } };
        },
        jelly() {
            scene.add(skyDome(0x0e7490, 0x01060f, 0x0b3b5c));
            const rays = [], rayM = () => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
                uniforms: { uT: { value: 0 }, uP: { value: Math.random() * 6 } },
                vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
                fragmentShader: 'uniform float uT,uP; varying vec2 vUv; void main(){ float a=smoothstep(0.,0.5,vUv.x)*smoothstep(1.,0.5,vUv.x)*vUv.y*(0.5+0.5*sin(uT*0.4+uP)); gl_FragColor=vec4(vec3(0.5,0.9,1.)*a*0.22,a*0.22); }' });
            for (let i = 0; i < 9; i++) { const m = rayM(); rays.push(m); const r = new THREE.Mesh(new THREE.PlaneGeometry(14, 160), m); r.position.set((Math.random() - 0.5) * 140, 40, -60 - Math.random() * 120); r.rotation.z = (Math.random() - 0.5) * 0.4; scene.add(r); }
            const bellG = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
            const J = [], cols = [0xf0abfc, 0x67e8f9, 0xa78bfa, 0xfda4af, 0x5eead4];
            for (let i = 0; i < 14; i++) {
                const col = new THREE.Color(cols[i % cols.length]);
                const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
                    uniforms: { uC: { value: col } },
                    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
                    fragmentShader: 'uniform vec3 uC; varying vec3 vN; varying vec3 vV; void main(){ float f=pow(1.-abs(dot(vN,vV)),1.6); gl_FragColor=vec4(uC*(0.25+1.3*f),0.2+0.8*f); }' });
                const g = new THREE.Group(), bell = new THREE.Mesh(bellG, m); g.add(bell);
                const TN = 7, tents = [];
                for (let k = 0; k < TN; k++) {
                    const tg = new THREE.BufferGeometry(), tp = new Float32Array(12 * 3); tg.setAttribute('position', new THREE.BufferAttribute(tp, 3));
                    const ln = new THREE.Line(tg, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })); g.add(ln); tents.push([ln, tp, k / TN * Math.PI * 2]);
                }
                g.add(glowSprite(col.getHex(), 7, 0.35));
                const s = 1.4 + Math.random() * 2.2; g.scale.setScalar(s);
                const o = { g, bell, tents, x: (Math.random() - 0.5) * 70, y: (Math.random() - 0.5) * 50, z: -10 - Math.random() * 70, ph: Math.random() * 6.28, v: 0.6 + Math.random() * 0.8 };
                scene.add(g); J.push(o);
            }
            const plank = points(1800, () => [(Math.random() - 0.5) * 150, (Math.random() - 0.5) * 90, -Math.random() * 140 + 15], c => c.setHSL(0.5, 0.6, 0.8), 1.1, 'vA=0.3+0.7*abs(sin(uT*0.8+ph*30.));');
            scene.add(plank);
            camera.position.set(0, 0, 30); camera.userData.base = new THREE.Vector3(0, 0, 30); camera.userData.at = new THREE.Vector3(0, 6, -100);
            return { update(t, dt) {
                rays.forEach(m => m.uniforms.uT.value = t); plank.userData.u.uT.value = t; plank.rotation.y = t * 0.01;
                J.forEach(o => {
                    const pulse = 0.5 + 0.5 * Math.sin(t * 1.6 * o.v + o.ph);
                    o.y += dt * (0.4 + pulse * 1.4) * o.v; if (o.y > 34) o.y = -34;
                    o.g.position.set(o.x + Math.sin(t * 0.2 + o.ph) * 3, o.y, o.z); o.g.rotation.z = Math.sin(t * 0.3 + o.ph) * 0.15;
                    o.bell.scale.set(1 + 0.18 * pulse, 1 - 0.2 * pulse, 1 + 0.18 * pulse);
                    o.tents.forEach(([ln, tp, a]) => {
                        for (let k = 0; k < 12; k++) { const d = k / 11, w = Math.sin(t * 2 + d * 5 + a + o.ph) * 0.35 * d;
                            tp[k * 3] = Math.cos(a) * 0.7 + w; tp[k * 3 + 1] = -d * 4.5; tp[k * 3 + 2] = Math.sin(a) * 0.7 + Math.cos(t * 1.7 + d * 4 + a) * 0.3 * d; }
                        ln.geometry.attributes.position.needsUpdate = true;
                    });
                });
            } };
        },
        fireflies() {
            scene.add(skyDome(0x071a2a, 0x010403, 0x123a3a));
            const st1 = stars(1400, 700, 25, 2.4); scene.add(st1);
            const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshBasicMaterial({ color: 0x03100a }));
            ground.rotation.x = -Math.PI / 2; scene.add(ground);
            const treeM = new THREE.MeshBasicMaterial({ color: 0x010805 }), treeG = new THREE.ConeGeometry(1, 3, 6);
            for (let i = 0; i < 110; i++) { const x = (Math.random() - 0.5) * 500, z = -50 - Math.random() * 260, h = 8 + Math.random() * 16; const tr = new THREE.Mesh(treeG, treeM); tr.scale.set(h * 0.28, h * 0.5, h * 0.28); tr.position.set(x, h * 0.72, z); scene.add(tr); }
            const grassM = new THREE.MeshBasicMaterial({ color: 0x0a2a18, side: THREE.DoubleSide }), grassG = new THREE.PlaneGeometry(0.15, 1);
            for (let i = 0; i < 700; i++) { const b = new THREE.Mesh(grassG, grassM); const h = 0.6 + Math.random() * 1.6; b.scale.y = h; b.position.set((Math.random() - 0.5) * 70, h / 2, -Math.random() * 60 + 15); b.rotation.set(0, Math.random() * 3, (Math.random() - 0.5) * 0.4); scene.add(b); }
            const N = 420, ff = points(N, () => [(Math.random() - 0.5) * 90, 0.5 + Math.random() * 12, -Math.random() * 90 + 15], (c, i) => c.setHSL(0.17 + Math.random() * 0.08, 1, 0.62), 18,
                'float b=sin(uT*(1.2+ph*2.)+ph*40.); vA=0.15+0.85*smoothstep(-0.2,1.,b);');
            scene.add(ff); const fp = ff.userData.p, base = fp.slice(), seeds = new Float32Array(N).map(() => Math.random() * 100);
            const moon = glowSprite(0xd9f99d, 40, 0.35); moon.position.set(70, 70, -300); scene.add(moon);
            camera.position.set(0, 3, 26); camera.userData.base = new THREE.Vector3(0, 3, 26); camera.userData.at = new THREE.Vector3(0, 6, -100);
            return { update(t) {
                st1.userData.u.uT.value = t; ff.userData.u.uT.value = t;
                for (let i = 0; i < N; i++) { const s = seeds[i];
                    fp[i * 3] = base[i * 3] + Math.sin(t * 0.21 + s) * 3 + Math.sin(t * 0.53 + s * 2) * 1.2;
                    fp[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.33 + s * 3) * 1.5;
                    fp[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.17 + s) * 3; }
                ff.geometry.attributes.position.needsUpdate = true;
            } };
        },
        sunset() {
            scene.add(skyDome(0x1e1b4b, 0x120a10, 0xfb7a3c));
            const sun = new THREE.Mesh(new THREE.CircleGeometry(26, 48), new THREE.MeshBasicMaterial({ color: 0xffd08a })); sun.position.set(0, 16, -600); scene.add(sun);
            const halo = glowSprite(0xff8c42, 260, 0.8); halo.position.set(0, 16, -590); scene.add(halo);
            const clouds = [];
            for (let i = 0; i < 26; i++) { const c = glowSprite([0xf472b6, 0xfb923c, 0xc084fc, 0xfda4af][i % 4], 60 + Math.random() * 120, 0.18 + Math.random() * 0.15);
                c.scale.y *= 0.22; c.position.set((Math.random() - 0.5) * 900, 40 + Math.random() * 120, -350 - Math.random() * 200); scene.add(c); clouds.push(c); }
            const g = new THREE.PlaneGeometry(2400, 2400, 1, 1); g.rotateX(-Math.PI / 2);
            const m = new THREE.ShaderMaterial({ uniforms: { uT: { value: 0 } },
                vertexShader: 'varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
                fragmentShader: 'uniform float uT; varying vec3 vW; ' + NOISE +
                    'void main(){ float d=length(vW.xz-cameraPosition.xz); vec3 deep=vec3(0.05,0.03,0.09), hor=vec3(0.95,0.45,0.25); float k=smoothstep(30.,600.,d); vec3 c=mix(deep,hor*0.55,k);' +
                    'float lane=exp(-pow(vW.x/(14.+d*0.18),2.)); float sp=noise(vec2(vW.x*0.5,vW.z*0.08+uT*0.9))*noise(vec2(vW.x*0.9-uT*0.3,vW.z*0.2)); c+=vec3(1.,0.72,0.42)*lane*(0.25+2.2*pow(sp,2.))*smoothstep(10.,140.,d);' +
                    'float w=fbm(vec2(vW.x*0.05,vW.z*0.12+uT*0.15)); c*=0.8+0.4*w; gl_FragColor=vec4(c,1.); }' });
            scene.add(new THREE.Mesh(g, m));
            const birds = points(14, () => [(Math.random() - 0.5) * 120, 40 + Math.random() * 30, -200], c => c.setRGB(0.15, 0.08, 0.12), 2.5, 'vA=1.;');
            camera.position.set(0, 5, 30); camera.userData.base = new THREE.Vector3(0, 5, 30); camera.userData.at = new THREE.Vector3(0, 18, -400);
            return { update(t) { m.uniforms.uT.value = t; clouds.forEach((c, i) => { c.position.x += Math.sin(i) * 0.02 + 0.03; if (c.position.x > 500) c.position.x = -500; }); halo.material.opacity = 0.7 + 0.1 * Math.sin(t * 0.5); camera.userData.bob = Math.sin(t * 0.5) * 0.4; } };
        },
        nebula() {
            scene.add(skyDome(0x050314, 0x020108, 0x120a2e));
            const st1 = stars(3000, 700, -999, 2.8); scene.add(st1);
            const cl = [], C = [0x7c3aed, 0xdb2777, 0x0ea5e9, 0x22d3ee, 0xf97316, 0xa855f7];
            for (let i = 0; i < 70; i++) { const s = glowSprite(C[i % C.length], 40 + Math.random() * 90, 0.035 + Math.random() * 0.045);
                const a = Math.random() * 6.28, r = 15 + Math.random() * 70; s.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 40, -60 - Math.sin(a) * r - Math.random() * 80); s.userData.ph = Math.random() * 6.28; scene.add(s); cl.push(s); }
            const dust = points(3000, () => [(Math.random() - 0.5) * 220, (Math.random() - 0.5) * 120, -Math.random() * 220], c => c.setHSL(0.6 + Math.random() * 0.3, 0.7, 0.75), 1.3, 'vA=0.4+0.6*abs(sin(uT*0.5+ph*20.));');
            scene.add(dust);
            const star = glowSprite(0xffffff, 14, 0.8); star.position.set(10, 6, -110); scene.add(star);
            camera.position.set(0, 0, 30); camera.userData.base = new THREE.Vector3(0, 0, 30); camera.userData.at = new THREE.Vector3(0, 0, -120);
            return { update(t) {
                st1.userData.u.uT.value = t; dust.userData.u.uT.value = t; dust.rotation.z = t * 0.006;
                cl.forEach(s => { s.material.rotation = t * 0.02 + s.userData.ph; s.position.y += Math.sin(t * 0.1 + s.userData.ph) * 0.01; });
                star.scale.setScalar(13 + 2 * Math.sin(t * 1.3)); camera.position.z = 30 + Math.sin(t * 0.05) * 8;
            } };
        }
    });

    function disposeScene() {
        if (!scene) return;
        scene.traverse(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
        });
        scene = null; world = null;
    }
    function setScene(k) {
        if (!renderer) return;
        disposeScene();
        scene = new THREE.Scene();
        camera.position.set(0, 0, 30); camera.userData = {};
        world = (WORLDS[k] || WORLDS.aurora)();
        drawBreath(); root.classList.toggle('rx-orb', k === 'orb');
        root.classList.remove('rx-in'); void root.offsetWidth; root.classList.add('rx-in');
    }
    function start3D() {
        if (!window.THREE) { root.querySelector('.rx-hint').textContent = tx('noGL'); return; }
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
        } catch (e) { renderer = null; root.querySelector('.rx-hint').textContent = tx('noGL'); return; }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.setSize(innerWidth, innerHeight, false);
        camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 2500);
        clock = new THREE.Clock();
        setScene(st.scene);
        loop();
    }
    function loop() {
        if (!open || !renderer) return;
        raf = requestAnimationFrame(loop);
        if (document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
        look.x += (look.tx - look.x) * 0.04; look.y += (look.ty - look.y) * 0.04;
        const b = camera.userData.base;
        if (b) {
            camera.position.set(b.x + look.x * 12 + Math.sin(t * 0.05) * 3, b.y - look.y * 5 + (camera.userData.bob || 0), b.z);
            const at = camera.userData.at; camera.lookAt(at.x + look.x * 60, at.y - look.y * 40, at.z);
        }
        if (world) world.update(t, dt);
        renderer.render(scene, camera);
        if (st.breath || st.scene === 'orb') {
            const [k, ph] = breathK(t);
            const ring = root.querySelector('.rx-ring'), txt = root.querySelector('.rx-btext');
            ring.style.transform = 'scale(' + (0.55 + 0.45 * k).toFixed(3) + ')';
            const w = tx(ph); if (txt.textContent !== w) txt.textContent = w;
        }
    }
    function onResize() {
        if (!renderer) return;
        renderer.setSize(innerWidth, innerHeight, false);
        camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    }

    // ======================= open / close =======================
    window.openRelax = function () {
        build(); if (open) return;
        open = true; window.relaxOn = true;
        if (window.amb) try { window.amb.pause(); } catch (e) { }
        if (window.MedTime3D && window.MedTime3D.pause) window.MedTime3D.pause(true);
        root.classList.add('open'); document.documentElement.classList.add('relax-open');
        try { const sv = JSON.parse(localStorage.getItem('medtime_relax') || '{}'); last = { scene: sv.scene || 'aurora', sound: sv.sound || 'none', timer: sv.timer || 0 }; } catch (e) { }
        Object.assign(st, FRESH); chosen = {}; root.classList.remove('rx-locked');
        setSec(''); drawPanel(); poke();
        root.querySelector('.rx-hint').classList.remove('gone');
        setTimeout(() => root && root.querySelector('.rx-hint').classList.add('gone'), 6000);
        vol = st.vol / 100;
        start3D();
        playSound(st.sound);
        startTimer();
        try { history.pushState({ relax: 1 }, ''); } catch (e) { }
    };
    function closeRelax(fromBack) {
        if (!open) return;
        open = false; window.relaxOn = false;
        cancelAnimationFrame(raf); clearInterval(tickT); clearInterval(fadeI); clearTimeout(hideT);
        stopSound(); if (ac) { try { ac.suspend(); } catch (e) { } }
        disposeScene();
        if (renderer) { renderer.dispose(); try { renderer.forceContextLoss(); } catch (e) { } renderer = null; }
        root.classList.remove('open', 'rx-ending'); document.documentElement.classList.remove('relax-open');
        if (window.MedTime3D && window.MedTime3D.pause) window.MedTime3D.pause(false);
        if (typeof window.updateAmbient === 'function') window.updateAmbient();
        if (!fromBack) { try { if (history.state && history.state.relax) history.back(); } catch (e) { } }
        // canvas loses its context; make a fresh one next time
        const c2 = canvas.cloneNode(false); canvas.replaceWith(c2); canvas = c2;
    }
    window.closeRelax = closeRelax;
    window.addEventListener('popstate', () => { if (open) closeRelax(true); });
    window.addEventListener('resize', onResize);
    window.relaxBtnText = () => tx('btn');
    window.relaxRender = function () { const b = document.getElementById('relax-btn'); if (b) b.querySelector('.rb-txt').textContent = tx('btn'); if (open) drawPanel(); };
    document.addEventListener('DOMContentLoaded', window.relaxRender);
    window.relaxRender();
})();
