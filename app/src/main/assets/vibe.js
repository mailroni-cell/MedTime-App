// M-079: vibration choice for reminders, in the 🔔 sound tile of settings. Tap = choose + feel it.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const list = document.getElementById('sound-list');
    if (!list || !N || typeof N.setVibration !== 'function') return;

    const TITLE = ['📳 רטט בתזכורת', '📳 الاهتزاز في التذكير', '📳 Vibrație la memento', '📳 Vibration du rappel', '📳 Reminder vibration'];
    const NOTE = ['לחצו על סוג רטט כדי להרגיש אותו', 'اضغط على نوع لتشعر به', 'Atingeți un tip ca să-l simțiți', 'Touchez un type pour le sentir', 'Tap a type to feel it'];
    const OPT = [
        ['off', '🚫', ['בלי רטט', 'بدون اهتزاز', 'Fără', 'Aucune', 'None']],
        ['soft', '🪶', ['עדין', 'خفيف', 'Ușoară', 'Douce', 'Gentle']],
        ['normal', '📳', ['רגיל', 'عادي', 'Normală', 'Normale', 'Normal']],
        ['strong', '💪', ['חזק', 'قوي', 'Puternică', 'Forte', 'Strong']],
        ['heart', '💓', ['דופק לב', 'نبض القلب', 'Puls', 'Battement', 'Heartbeat']],
        ['long', '〰️', ['ארוך ורציף', 'طويل متواصل', 'Lungă', 'Longue', 'Long']]
    ];

    const NAG = ['🔁 רטט חזק כל 30 שניות עד שעונים לתזכורת', '🔁 اهتزاز قوي كل 30 ثانية حتى الرد', '🔁 Vibrație puternică la 30 s până răspundeți', '🔁 Forte vibration toutes les 30 s jusqu\'à la réponse', '🔁 Strong vibration every 30 s until answered']; // M-098
    const css = document.createElement('style');
    css.textContent = `
    .vb-box{padding:12px 0 10px;border-bottom:1px solid rgba(255,255,255,.12);margin-bottom:8px}
    .vb-title{font-size:1.1rem;font-weight:700;margin-bottom:4px}
    .vb-note{font-size:.85rem;opacity:.7;margin-bottom:10px}
    .vb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .vb-opt{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px;border-radius:16px;border:1.5px solid rgba(255,255,255,.18);
      background:rgba(255,255,255,.06);color:#fff;font-size:.95rem;font-weight:600;line-height:1.2}
    .vb-opt i{font-style:normal;font-size:1.5rem}
    .vb-opt.sel{border-color:#fbbf24;background:linear-gradient(135deg,rgba(245,158,11,.35),rgba(234,88,12,.3));box-shadow:0 0 14px rgba(251,191,36,.5)}
    .vb-opt.buzz i{animation:vbBuzz .12s linear 8}
    .vb-nag{display:flex;align-items:center;gap:10px;margin-top:12px;padding:12px;border-radius:16px;background:rgba(255,255,255,.06);font-size:1rem;font-weight:600;line-height:1.3}
    .vb-nag span{flex:1}
    .vb-sw{flex:none;width:54px;height:30px;border-radius:999px;background:#475569;position:relative;border:0;transition:background .2s}
    .vb-sw:after{content:'';position:absolute;top:4px;inset-inline-start:4px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s}
    .vb-sw.on{background:#10b981}
    .vb-sw.on:after{transform:translateX(24px)}
    [dir=rtl] .vb-sw.on:after{transform:translateX(-24px)}
    @keyframes vbBuzz{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px) rotate(-6deg)}75%{transform:translateX(3px) rotate(6deg)}}`;
    document.head.appendChild(css);

    const box = document.createElement('div');
    box.className = 'vb-box';
    list.parentNode.insertBefore(box, list);
    let cur = 'normal';
    try { cur = N.getVibration() || 'normal'; } catch (e) { }

    function draw() {
        const i = li();
        box.innerHTML = '<div class="vb-title"></div><div class="vb-note"></div><div class="vb-grid"></div>';
        box.querySelector('.vb-title').textContent = TITLE[i];
        box.querySelector('.vb-note').textContent = NOTE[i];
        const g = box.querySelector('.vb-grid');
        OPT.forEach(o => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'vb-opt' + (o[0] === cur ? ' sel' : '');
            b.innerHTML = '<i>' + o[1] + '</i><span></span>';
            b.querySelector('span').textContent = o[2][i];
            b.onclick = () => {
                cur = o[0];
                try { N.setVibration(cur); N.previewVibration(cur); } catch (e) { }
                g.querySelectorAll('.vb-opt').forEach(x => x.classList.toggle('sel', x === b));
                if (cur !== 'off') { b.classList.remove('buzz'); void b.offsetWidth; b.classList.add('buzz'); }
            };
            g.appendChild(b);
        });
        if (typeof N.setVibeNag === 'function') {
            const row = document.createElement('div'); row.className = 'vb-nag';
            row.innerHTML = '<span></span><button type="button" class="vb-sw"></button>';
            row.querySelector('span').textContent = NAG[i];
            const sw = row.querySelector('.vb-sw');
            let on = true; try { on = N.getVibeNag(); } catch (e) { }
            sw.classList.toggle('on', on);
            sw.onclick = () => { on = !on; sw.classList.toggle('on', on); try { N.setVibeNag(on); if (on) N.previewVibration('strong'); } catch (e) { } };
            box.appendChild(row);
        }
    }
    draw();
    // redraw when the language changes
    const sel = document.getElementById('lang-select');
    if (sel) sel.addEventListener('change', () => setTimeout(draw, 50));
})();
