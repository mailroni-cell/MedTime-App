// M-208 (owner): sound, voice readout and voice choice were hard to find. Now one settings tile "🔔 Sound and voice"
// with three big tabs: 🎵 Sound (recommended sounds first, the rest folded), 🗣️ Voice (readout on / off, what to say,
// which voice, voice volume), 📳 Vibration. The voice tile is hidden; its controls are moved here (same ids, same handlers).
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const $ = id => document.getElementById(id);
    const T = {
        snd: ['🎵 צליל', '🎵 الصوت', '🎵 Sunet', '🎵 Son', '🎵 Sound', '🎵 Звук'],
        voice: ['🗣️ הקראה וקול', '🗣️ القراءة والصوت', '🗣️ Citire și voce', '🗣️ Lecture et voix', '🗣️ Readout and voice', '🗣️ Чтение и голос'],
        vib: ['📳 רטט', '📳 الاهتزاز', '📳 Vibrație', '📳 Vibration', '📳 Vibration', '📳 Вибрация'],
        best: ['⭐ צלילים מומלצים: נגיעה = בחירה ושמיעה', '⭐ أصوات مقترحة: لمسة = اختيار واستماع', '⭐ Sunete recomandate: atingere = alegere și ascultare', '⭐ Sons conseillés : toucher = choisir et écouter', '⭐ Recommended sounds: tap = choose and hear', '⭐ Рекомендуемые звуки: нажмите, чтобы выбрать и услышать'],
        moreMt: ['🎶 עוד צלילים של MedTime', '🎶 المزيد من أصوات MedTime', '🎶 Alte sunete MedTime', '🎶 Autres sons MedTime', '🎶 More MedTime sounds', '🎶 Другие звуки MedTime'],
        phone: ['📱 צלילים מהטלפון', '📱 أصوات من الهاتف', '📱 Sunete din telefon', '📱 Sons du téléphone', '📱 Phone sounds', '📱 Звуки телефона']
    };
    const tx = k => T[k][li()];
    const BEST = ['wind_chimes', 'kalimba', 'music_box', 'harp', 'morning_birds', 'celesta', 'crystal_bells', 'marimba', 'tibetan_bowl'];

    const css = document.createElement('style');
    css.textContent = `
    .sv-hidden{display:none!important}
    .sv-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:2px 0 12px}
    .sv-tabs button{min-height:58px;border-radius:18px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:#fff;font-weight:900;font-size:1.02rem;line-height:1.15;font-family:inherit;padding:4px}
    .sv-tabs button.on{border-color:#fbbf24;background:linear-gradient(135deg,rgba(245,158,11,.45),rgba(234,88,12,.4));box-shadow:0 0 14px rgba(251,191,36,.5)}
    .sv-pane{display:none}.sv-pane.on{display:block}
    .sv-best-t{font-weight:800;font-size:1rem;margin:10px 0 8px;color:#fde68a}
    .sv-best{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .sv-best .sound-row{display:block!important;margin:0!important;padding:0!important;border:0!important}
    .sv-best .sound-row label{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:74px;padding:6px 4px;border-radius:16px;
      border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);text-align:center;font-weight:800;font-size:.98rem;line-height:1.15;cursor:pointer}
    .sv-best .sound-row input{position:absolute;opacity:0;pointer-events:none}
    .sv-best .sound-row label:has(input:checked){border-color:#fbbf24;background:linear-gradient(135deg,rgba(245,158,11,.4),rgba(234,88,12,.35));box-shadow:0 0 12px rgba(251,191,36,.5)}
    .sv-best .sound-row button{display:none!important}
    .sv-more{margin-top:10px;border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14)}
    .sv-more > summary{list-style:none;padding:14px;font-weight:800;font-size:1.02rem;cursor:pointer}
    .sv-more > summary::-webkit-details-marker{display:none}
    .sv-more > summary::after{content:'⌄';float:inline-end;opacity:.7}
    .sv-more[open] > summary::after{content:'⌃'}
    .sv-more > .sv-in{padding:0 10px 10px}
    .sv-pane .toggle-row:first-child{font-size:1.15rem;font-weight:900}
    /* M-214 (owner): no settings panel scrolls. Every panel opens on the whole screen; only long choice lists scroll inside their own box */
    #settings-page .set-tile.open .set-body{top:0!important;max-height:none!important;height:100vh;height:100dvh;border-radius:0!important;box-sizing:border-box;
      padding-top:calc(10px + env(safe-area-inset-top))!important;display:flex!important;flex-direction:column;overflow-y:auto}
    #settings-page .set-tile.open .set-body > *{flex:none}
    .sv-tile.open .set-body{overflow:hidden!important}
    /* choice lists keep their own scroll: themes */
    #settings-page .set-tile.open .set-body:has(#theme-grid){overflow:hidden!important}
    #settings-page .set-tile.open .set-body > :has(#theme-grid),#settings-page .set-tile.open .set-body > #theme-grid{flex:1 1 auto!important;min-height:0;overflow-y:auto;overscroll-behavior:contain}
    .sv-tile .sv-pane.on{display:flex;flex-direction:column;flex:1 1 auto!important;min-height:0}
    .sv-tile .sv-pane > *{flex:none}
    .sv-tile .sv-pane #sound-list,.sv-tile .sv-pane .vc-box{flex:1 1 auto!important;min-height:0;max-height:none!important;height:auto!important;overflow-y:auto;overscroll-behavior:contain}
    .sv-tile .sv-pane .toggle-row{padding-top:10px!important;padding-bottom:10px!important}`;
    document.head.appendChild(css);

    let busy = false;
    // the sound list is drawn again on every language change: re-sort it each time
    function sortSounds() {
        const list = $('sound-list'); if (!list || busy) return;
        busy = true;
        try {
            const rows = [...list.querySelectorAll('.sound-row')];
            const mtRows = rows.filter(r => /\/raw\/mt_/.test((r.querySelector('input') || {}).value || ''));
            if (!mtRows.length && !list.querySelector('.sound-group')) return;
            const key = r => ((r.querySelector('input') || {}).value || '').replace(/^.*\/raw\/mt_/, '');
            const best = document.createElement('div'); best.className = 'sv-best';
            BEST.forEach(k => { const r = mtRows.find(x => key(x) === k); if (r) best.appendChild(r); });
            const fold = (title, nodes) => {
                if (!nodes.length) return null;
                const d = document.createElement('details'); d.className = 'sv-more';
                d.innerHTML = '<summary></summary><div class="sv-in"></div>'; d.querySelector('summary').textContent = title;
                nodes.forEach(n => d.querySelector('.sv-in').appendChild(n));
                if (nodes.some(n => n.querySelector && n.querySelector('input:checked'))) d.open = true;
                return d;
            };
            const restMt = mtRows.filter(r => !best.contains(r));
            const phoneRows = rows.filter(r => !mtRows.includes(r) && r.parentNode === list && !/^(|none)$/.test((r.querySelector('input') || {}).value || ''));
            list.querySelectorAll('.sound-group').forEach(g => g.remove());
            const bt = document.createElement('div'); bt.className = 'sv-best-t'; bt.textContent = tx('best');
            list.prepend(bt, best); // recommended first, then phone alarm / no sound, then the folded lists
            [fold(tx('moreMt'), restMt), fold(tx('phone'), phoneRows)].forEach(d => d && list.appendChild(d));
            // a tap on a recommended sound plays it (the list already does: choose = preview)
        } finally { setTimeout(() => { busy = false; }, 0); }
    }

    function build() {
        const sl = $('sound-list'), von = $('v-on');
        if (!sl || !von) return false;
        const sBody = sl.closest('.set-body'), vTile = von.closest('.set-tile');
        if (!sBody || !vTile || sBody.querySelector('.sv-tabs')) return true;
        const vBody = vTile.querySelector('.set-body');
        const tabs = document.createElement('div'); tabs.className = 'sv-tabs';
        const pane = n => { const d = document.createElement('div'); d.className = 'sv-pane'; d.dataset.k = n; return d; };
        const pS = pane('snd'), pV = pane('voice'), pB = pane('vib');
        // sound: its volume and the list
        const volA = $('vol-alert') && $('vol-alert').closest('.vol-row'), volV = $('vol-voice') && $('vol-voice').closest('.vol-row');
        const note = sBody.querySelector('.vol-note:not(#upd-note)');
        if (volA) pS.appendChild(volA);
        pS.appendChild(sl);
        // voice: readout switches, voice volume, voice choice
        [...vBody.children].filter(c => !c.classList.contains('panel-head')).forEach(c => pV.appendChild(c));
        if (volV) pV.insertBefore(volV, pV.querySelector('.vc-box'));
        if (note) pV.insertBefore(note, pV.querySelector('.vc-box'));
        // vibration
        const vb = sBody.querySelector('.vb-box'); if (vb) pB.appendChild(vb);
        const head = sBody.querySelector('.panel-head');
        [...sBody.children].forEach(c => { if (c !== head) pS.appendChild(c); }); // anything else stays with the sound
        sBody.append(tabs, pS, pV, pB);
        vTile.classList.add('sv-hidden');
        sBody.closest('.set-tile').classList.add('sv-tile');
        let cur = 'snd';
        const show = k => {
            cur = k;
            [pS, pV, pB].forEach(p => p.classList.toggle('on', p.dataset.k === k));
            tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
            if (k === 'voice') { try { N && N.listVoices && N.listVoices(); } catch (e) { } }
        };
        const drawTabs = () => {
            tabs.innerHTML = '';
            ['snd', 'voice', 'vib'].forEach(k => {
                const b = document.createElement('button'); b.type = 'button'; b.dataset.k = k; b.textContent = tx(k);
                b.onclick = () => { if (navigator.vibrate) navigator.vibrate(8); show(k); };
                tabs.appendChild(b);
            });
            show(cur);
        };
        drawTabs();
        if (!pB.children.length) tabs.querySelector('[data-k=vib]').classList.add('sv-hidden');
        new MutationObserver(() => { if (!busy && !sl.querySelector('.sv-best')) sortSounds(); }).observe(sl, { childList: true });
        sortSounds();
        const sel = $('lang-select'); if (sel) sel.addEventListener('change', () => setTimeout(drawTabs, 300));
        window.mtSoundVoice = show;
        return true;
    }
    // M-214: if a panel's content is still taller than the screen, shrink it a little (never below 78%) instead of scrolling
    function fitPanel(t) {
        const body = t && t.querySelector('.set-body'); if (!body || t.classList.contains('sv-tile') || t.id === 'tile-help' || body.querySelector('#theme-grid')) return;
        const parts = [...body.children].filter(c => !c.classList.contains('panel-head'));
        let z = 1; const set = () => parts.forEach(c => { c.style.zoom = z === 1 ? '' : z; }); set();
        while (body.scrollHeight > body.clientHeight + 1 && z > 0.8) { z = Math.round((z - 0.03) * 100) / 100; set(); }
    }
    new MutationObserver(ms => ms.forEach(m => { const t = m.target; if (t.classList && t.classList.contains('open')) setTimeout(() => fitPanel(t), 380); }))
        .observe(document.getElementById('settings-page') || document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
    let n = 0;
    const tick = () => { if (!build() && ++n < 20) setTimeout(tick, 300); };
    tick();
})();
