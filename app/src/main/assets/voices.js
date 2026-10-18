// M-082: choose the reading voice, inside the 🔊 voice tile. Each voice has ▶ to hear a sample.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const anchor = document.getElementById('v-on');
    if (!anchor || !N || typeof N.listVoices !== 'function') return;
    const body = anchor.closest('.set-body');

    const T = {
        title: ['🗣️ בחירת קול', '🗣️ اختيار الصوت', '🗣️ Alegeți vocea', '🗣️ Choix de la voix', '🗣️ Choose the voice'],
        note: ['לחצו ▶ כדי לשמוע, ועל השם כדי לבחור', 'اضغط ▶ للاستماع وعلى الاسم للاختيار', 'Apăsați ▶ ca să ascultați și numele ca să alegeți', '▶ pour écouter, le nom pour choisir', 'Tap ▶ to listen, the name to choose'],
        def: ['ברירת המחדל של הטלפון', 'الافتراضي في الهاتف', 'Implicită a telefonului', 'Par défaut du téléphone', 'Phone default'],
        voice: ['קול', 'صوت', 'Voce', 'Voix', 'Voice'],
        net: ['🌐 צריך אינטרנט', '🌐 يحتاج إنترنت', '🌐 necesită internet', '🌐 Internet requis', '🌐 needs internet'],
        loading: ['טוען קולות…', 'جارٍ التحميل…', 'Se încarcă…', 'Chargement…', 'Loading voices…'],
        sample: ['שלום, הגיע הזמן לקחת אקמול, כדור אחד.', 'مرحبًا، حان وقت تناول الدواء، حبة واحدة.', 'Bună, este timpul să luați medicamentul, o pastilă.', 'Bonjour, c\'est l\'heure de prendre votre médicament, un comprimé.', 'Hello, it is time to take your medicine, one tablet.']
    };
    const tx = k => T[k][li()];

    const css = document.createElement('style');
    css.textContent = `
    .vc-box{padding:12px 0 6px;border-top:1px solid rgba(255,255,255,.12);margin-top:10px}
    .vc-title{font-size:1.1rem;font-weight:700}.vc-note{font-size:.85rem;opacity:.7;margin:2px 0 8px}
    .vc-row{display:flex;align-items:center;gap:8px;margin:6px 0}
    .vc-pick{flex:1;text-align:start;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;border-radius:14px;padding:11px 12px;font-size:1rem;font-weight:600}
    .vc-pick small{display:block;font-weight:500;opacity:.7;font-size:.8rem}
    .vc-pick.sel{border-color:#22d3ee;background:linear-gradient(135deg,rgba(34,211,238,.28),rgba(99,102,241,.25));box-shadow:0 0 12px rgba(34,211,238,.45)}
    .vc-play{flex:none;width:48px;height:48px;border-radius:50%;border:0;font-size:1.2rem;color:#fff;background:linear-gradient(135deg,#22c55e,#0d9488)}`;
    document.head.appendChild(css);

    const box = document.createElement('div');
    box.className = 'vc-box';
    body.appendChild(box);
    let data = null;

    function draw() {
        box.innerHTML = '<div class="vc-title"></div><div class="vc-note"></div><div class="vc-list"></div>';
        box.querySelector('.vc-title').textContent = tx('title');
        box.querySelector('.vc-note').textContent = tx('note');
        const list = box.querySelector('.vc-list');
        if (!data) { list.textContent = tx('loading'); return; }
        const items = [{ name: '', label: tx('def') }].concat((data.voices || []).filter(v => v.installed !== false)
            .map((v, n) => ({ name: v.name, label: tx('voice') + ' ' + (n + 1) + (v.country ? ' (' + v.country + ')' : ''), sub: v.local ? '' : tx('net') })));
        items.forEach(it => {
            const r = document.createElement('div'); r.className = 'vc-row';
            r.innerHTML = '<button type="button" class="vc-pick"></button><button type="button" class="vc-play" aria-label="play">▶</button>';
            const p = r.querySelector('.vc-pick');
            p.textContent = it.label;
            if (it.sub) { const s = document.createElement('small'); s.textContent = it.sub; p.appendChild(s); }
            if ((data.chosen || '') === it.name) p.classList.add('sel');
            p.onclick = () => {
                data.chosen = it.name; N.setVoice(it.name);
                list.querySelectorAll('.vc-pick').forEach(x => x.classList.toggle('sel', x === p));
                N.previewVoice(it.name, tx('sample'));
                if (navigator.vibrate) navigator.vibrate(10);
            };
            r.querySelector('.vc-play').onclick = () => N.previewVoice(it.name, tx('sample'));
            list.appendChild(r);
        });
    }
    window.mtVoices = function (o) { data = o || { voices: [] }; draw(); };
    function load() { data = null; draw(); try { N.listVoices(); } catch (e) { } }
    // load when the tile opens and when the language changes (voices are per language)
    body.closest('.set-tile').querySelector('.set-tile-head').addEventListener('click', load);
    const sel = document.getElementById('lang-select');
    if (sel) sel.addEventListener('change', () => setTimeout(load, 300));
    draw();
})();
