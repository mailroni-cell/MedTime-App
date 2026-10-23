// M-249 (owner): "My reminders" and every settings sub-menu get the look of the rest of the app:
// a deep glowing background, glossy 3D buttons with a dark outline, a small capsule for the panel icon and
// the round 3D font for titles. Only looks: sizes and layout stay as they are. Low vision keeps its own
// high-contrast colours; there only the title font and the room for the cards change.
(function () {
    'use strict';
    const N = 'html:not(.lowvision) body';
    const P = '#settings-page .set-tile.open .set-body';
    const BTN = `${P} button:not(.p-close):not(.mt-backbtn):not(.help-back):not(.page-done):not(.vc-play):not(.st-pm):not(.theme-sw), ${P} .sound-row`;
    const WB = ':is(#med-page,#appt-form-page,#appt-page) button:not(.close-3d):not(.mt-backbtn):not(.wz-back):not(.wz-next):not(.mw-submit):not(.page-done):not(.af-del):not(.tp-btn)';
    const T3 = "font-family:'MTBall','MTUI',sans-serif!important;font-weight:700!important;letter-spacing:.3px;color:#fff!important;-webkit-text-fill-color:#fff!important;" +
        "text-shadow:0 1px 0 #e2e8f0,0 2px 0 #94a3b8,0 3px 0 #475569,0 4px 4px rgba(0,0,0,.85),0 0 14px rgba(var(--gA),.7)!important";
    const css = document.createElement('style');
    css.textContent = `
    /* sub-menu background: deep space with a soft theme glow from the top */
    ${N} ${P}{background:radial-gradient(130% 55% at 50% -8%,rgba(var(--gA),.32),rgba(var(--gA),0) 62%),
      radial-gradient(90% 45% at 100% 100%,rgba(168,85,247,.2),rgba(168,85,247,0) 65%),linear-gradient(180deg,#1a2342 0%,#0d1328 55%,#070b1a 100%)!important}
    /* panel head: the icon is a small tilted capsule, the title in the round 3D font */
    html body ${P} .panel-head .p-ico{border-radius:999px!important;width:54px!important;min-width:54px!important;height:40px!important;font-size:1.4rem!important;transform:rotate(-14deg);
      box-shadow:inset 0 4px 5px rgba(255,255,255,.55),inset 0 -6px 9px rgba(0,0,0,.35),0 0 0 2px rgba(255,255,255,.92),0 0 0 4.5px rgba(0,0,0,.8),0 10px 12px -2px rgba(0,0,0,.7)!important}
    html body ${P} .panel-head .p-title{${T3};white-space:normal!important;line-height:1.08!important;font-size:min(1.4rem,5.8vw)!important}
    html.lowvision body ${P} .panel-head .p-title{text-shadow:0 2px 0 #000!important}
    /* every button in a sub-menu: glossy, raised, with a thin dark outline that lifts it off the background */
    ${N} :is(${BTN}){border-radius:20px!important;border:1.5px solid rgba(255,255,255,.28)!important;
      background-image:linear-gradient(180deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,.06) 40%,rgba(0,0,0,0) 60%,rgba(0,0,0,.22) 100%)!important;
      box-shadow:inset 0 2px 2px rgba(255,255,255,.35),inset 0 -4px 7px rgba(0,0,0,.35),0 0 0 1.5px rgba(0,0,0,.7),0 7px 12px rgba(0,0,0,.55)!important}
    ${N} :is(${BTN}):is(.sel,.on,.active,:has(input:checked)){border-color:#7dd3fc!important;
      box-shadow:inset 0 2px 2px rgba(255,255,255,.45),inset 0 -4px 7px rgba(0,0,0,.3),0 0 0 2px rgba(0,0,0,.75),0 7px 12px rgba(0,0,0,.55),0 0 16px rgba(56,189,248,.75)!important}
    ${N} :is(${BTN}):active{transform:translateY(3px)!important;box-shadow:inset 0 2px 2px rgba(255,255,255,.3),0 0 0 1.5px rgba(0,0,0,.7),0 2px 4px rgba(0,0,0,.5)!important}
    ${N} ${P} :is(.vc-play,.st-pm){box-shadow:inset 0 3px 3px rgba(255,255,255,.45),inset 0 -5px 8px rgba(0,0,0,.3),0 0 0 2px rgba(255,255,255,.85),0 0 0 4px rgba(0,0,0,.7),0 8px 12px rgba(0,0,0,.55)!important}
    ${N} ${P} .theme-sw{box-shadow:0 0 0 2px rgba(255,255,255,.75),0 0 0 4px rgba(0,0,0,.7),0 8px 12px rgba(0,0,0,.55)!important}
    ${N} ${P} .theme-sw.sel{box-shadow:0 0 0 3px #fff,0 0 0 5.5px rgba(0,0,0,.75),0 8px 12px rgba(0,0,0,.55),0 0 18px rgba(56,189,248,.9)!important}
    /* loose boxes and fields in a sub-menu: the same glass card as the rest of the app */
    ${N} ${P} :is(.toggle-row,.vol-row,.lg-sum,.st-box,input[type=number],input[type=text],textarea){border-radius:18px}
    ${N} ${P} :is(input[type=number],input[type=text],textarea){border:1.5px solid rgba(255,255,255,.25)!important;box-shadow:inset 0 3px 6px rgba(0,0,0,.45),0 0 0 1.5px rgba(0,0,0,.6)!important}

    /* ---- My reminders ---- */
    /* the clipboard picture above the title goes (like settings), so the cards get the room */
    html body #list-page .settings-hero .hero-gear{display:none!important}
    html body #list-page .settings-hero h2{${T3};font-size:min(1.9rem,8vw)!important;margin-top:2px!important}
    html body #list-page .settings-hero{padding-bottom:8px!important}
    /* cards: no half-cut stripe on the side; a glass card with a light rim, a dark outline and a deep shadow */
    ${N} #list-page .med-item{border:1.5px solid rgba(255,255,255,.26)!important;border-inline-start:1.5px solid rgba(255,255,255,.26)!important;
      background:linear-gradient(160deg,rgba(255,255,255,.13),rgba(255,255,255,.03) 45%),linear-gradient(180deg,rgba(30,41,59,.82),rgba(15,23,42,.78))!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -10px 24px rgba(var(--gA),.12),0 0 0 1.5px rgba(0,0,0,.7),0 16px 28px rgba(0,0,0,.6),0 0 18px rgba(var(--gA),.25)!important}
    html body #list-page .med-item .med-info h3{${T3}}
    html.lowvision body #list-page .med-item .med-info h3{text-shadow:none!important}
    ${N} #list-page .med-item :is(.btn-edit,.btn-delete,.sb-btn){border-radius:999px!important;
      box-shadow:inset 0 2px 2px rgba(255,255,255,.4),inset 0 -4px 6px rgba(0,0,0,.3),0 0 0 1.5px rgba(0,0,0,.7),0 6px 10px rgba(0,0,0,.5)!important}
    ${N} #list-page .med-item .btn-edit{background:linear-gradient(180deg,#7dd3fc,#0284c7 60%,#075985)!important;color:#fff!important;border:1.5px solid rgba(255,255,255,.7)!important}
    ${N} #list-page .med-item .btn-delete{background:linear-gradient(180deg,#fca5a5,#dc2626 60%,#7f1d1d)!important;color:#fff!important;border:1.5px solid rgba(255,255,255,.7)!important}
    ${N} #list-page #wk-bar{border:1.5px solid rgba(255,255,255,.22)!important;border-radius:24px!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 0 0 1.5px rgba(0,0,0,.65),0 12px 22px rgba(0,0,0,.5)!important}
    ${N} #list-page #wk-bar .af-chip{border-radius:999px!important}

    /* ---- M-250 (owner): Doctor appointments and the New reminder / New appointment wizards in the same look ---- */
    html body :is(#med-page,#appt-form-page) :is(.af-head h2,.wz-step-title){${T3}}
    html body #appt-page .settings-hero h2{${T3};font-size:min(1.9rem,8vw)!important;margin-top:2px!important}
    html body #appt-page .settings-hero .hero-gear{display:none!important}
    html body #appt-page .settings-hero{padding-bottom:8px!important}
    html.lowvision body :is(#med-page,#appt-form-page,#appt-page) :is(.af-head h2,.wz-step-title,.settings-hero h2){text-shadow:0 2px 0 #000!important}
    ${N} #appt-page .ap-card,${N} :is(#med-page,#appt-form-page) :is(.mw-summary,.af-summary){border:1.5px solid rgba(255,255,255,.26)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -10px 24px rgba(var(--gA),.12),0 0 0 1.5px rgba(0,0,0,.7),0 16px 28px rgba(0,0,0,.6),0 0 18px rgba(var(--gA),.25)!important}
    ${N} :is(${WB}){border:1.5px solid rgba(255,255,255,.3)!important;
      box-shadow:inset 0 2px 2px rgba(255,255,255,.35),inset 0 -4px 7px rgba(0,0,0,.35),0 0 0 1.5px rgba(0,0,0,.7),0 7px 12px rgba(0,0,0,.55)!important}
    ${N} :is(${WB}):is(.sel,.on,.cur,.active){border-color:#7dd3fc!important;
      box-shadow:inset 0 2px 2px rgba(255,255,255,.45),inset 0 -4px 7px rgba(0,0,0,.3),0 0 0 2px rgba(0,0,0,.75),0 7px 12px rgba(0,0,0,.55),0 0 16px rgba(56,189,248,.8)!important}
    ${N} :is(${WB}):active{transform:translateY(3px)!important}
    ${N} :is(#med-page,#appt-form-page) .wz-nav > button{box-shadow:inset 0 3px 3px rgba(255,255,255,.4),inset 0 -5px 8px rgba(0,0,0,.3),0 0 0 2px rgba(0,0,0,.7),0 9px 14px rgba(0,0,0,.6)!important}
    ${N} :is(#med-page,#appt-form-page) :is(input[type=text],input[type=tel],.af-in){border:1.5px solid rgba(255,255,255,.28)!important;box-shadow:inset 0 3px 6px rgba(0,0,0,.45),0 0 0 1.5px rgba(0,0,0,.6)!important}`;
    document.head.appendChild(css);

    // M-250 (owner: step 7 of a new reminder was cut at the bottom): the Save button moves into the bottom bar,
    // next to Back (like the appointment form), so the summary has the whole screen. form= keeps it a submit button.
    css.textContent += `
    html body #med-page[data-s="6"] .wz-nav.one{grid-template-columns:1fr 1.6fr!important}
    html body #med-page .wz-nav > .mw-submit{width:auto!important;margin:0!important;min-height:0!important;padding:10px 12px!important;font-size:1.15rem!important;align-items:center;justify-content:center}`;
    function moveSave() {
        const sb = document.querySelector('#med-page .mw-submit'), nav = document.querySelector('#med-page .wz-nav');
        if (!sb || !nav) return setTimeout(moveSave, 300);
        if (sb.parentNode === nav) return;
        sb.setAttribute('form', 'med-form');
        nav.appendChild(sb);
    }
    moveSave();

    // M-250: a wizard step that is taller than the screen (e.g. step 1 in big text) shrinks a little to fit, instead of hiding under the buttons
    function fitStep(pg) {
        const bd = pg.querySelector('.wz-body'); if (!bd || !pg.classList.contains('open')) return;
        const st = [...pg.querySelectorAll('.wz-step')].find(x => x.offsetParent) || pg.querySelector('#med-form'); if (!st) return;
        pg.querySelectorAll('.wz-step, #med-form').forEach(x => { if (x.style.zoom) x.style.zoom = ''; });
        const over = bd.scrollHeight - bd.clientHeight;
        if (over > 2) st.style.zoom = Math.max(0.72, (bd.clientHeight - 4) / bd.scrollHeight).toFixed(3);
    }
    function watchWiz() {
        const pages = ['appt-form-page', 'med-page'].map(id => document.getElementById(id)).filter(Boolean);
        if (pages.length < 2) return setTimeout(watchWiz, 400);
        pages.forEach(pg => {
            let q = 0; const go = () => { if (q) return; q = requestAnimationFrame(() => { q = 0; fitStep(pg); }); };
            new MutationObserver(go).observe(pg, { attributes: true, subtree: true, attributeFilter: ['class', 'data-s'] });
            addEventListener('resize', go);
        });
    }
    watchWiz();

    // M-251 (owner: "My reminders" must never scroll): after the two tighter steps of plus.js, if the page still
    // would scroll, the week bar and the cards shrink together just enough to fit above the Done button
    function fitAll() {
        const pg = document.getElementById('list-page'); if (!pg || !pg.classList.contains('open')) return;
        const parts = ['wk-bar', 'med-list'].map(id => document.getElementById(id)).filter(Boolean);
        parts.forEach(x => { x.style.zoom = ''; });
        const fits = () => pg.scrollHeight - pg.clientHeight <= 2;
        if (fits()) return;
        let lo = 0.4, hi = 1; // the biggest size that still fits, found in a few tries
        for (let i = 0; i < 7; i++) {
            const z = (lo + hi) / 2; parts.forEach(x => { x.style.zoom = z.toFixed(3); });
            if (fits()) lo = z; else hi = z;
        }
        parts.forEach(x => { x.style.zoom = lo.toFixed(3); });
    }
    function watchList() {
        const pg = document.getElementById('list-page'); if (!pg) return setTimeout(watchList, 400);
        let q = 0; const go = () => { if (!q) q = setTimeout(() => { q = 0; fitAll(); }, 90); };
        new MutationObserver(go).observe(pg, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
        addEventListener('resize', go);
        // opening the page is the main moment: fit right after it is drawn, and again after plus.js's own steps
        const op = window.openListPage;
        if (typeof op === 'function' && !op.mtFit) {
            const w = function () { const r = op.apply(this, arguments); setTimeout(fitAll, 120); setTimeout(fitAll, 450); return r; };
            w.mtFit = 1; window.openListPage = w;
        }
    }
    watchList();

    // M-252 (owner: the Display screen was not nice and not handy): the themes are pages you swipe sideways
    // (3 x 3, or 2 x 3 in low vision) with big arrows and dots, never a long list to scroll. Each theme is a card
    // with its colours, a small two-colour capsule and a clear name.
    css.textContent += `
    html body #settings-page #theme-grid{--tg-c:3;--tg-gap:10px;display:grid!important;grid-template-columns:none!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;
      grid-auto-flow:column!important;grid-auto-columns:calc((100% - (var(--tg-c) - 1) * var(--tg-gap)) / var(--tg-c))!important;gap:var(--tg-gap)!important;
      overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none;padding:6px 2px 8px!important;overscroll-behavior:contain}
    html body #settings-page #theme-grid::-webkit-scrollbar{display:none}
    html body #settings-page #theme-grid{scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scroll-behavior:smooth}
    html body #settings-page #theme-grid > .theme-sw:nth-child(9n+1){scroll-snap-align:start;scroll-snap-stop:always}
    html.lowvision body #settings-page #theme-grid > .theme-sw:nth-child(9n+1){scroll-snap-align:none;scroll-snap-stop:normal}
    html.lowvision body #settings-page #theme-grid > .theme-sw:nth-child(6n+1){scroll-snap-align:start;scroll-snap-stop:always}
    html body #settings-page #theme-grid.tg-moving .tw-world{animation-play-state:paused}
    html body #settings-page #theme-grid > .theme-sw{contain:layout paint}
    html.lowvision body #settings-page #theme-grid{--tg-c:2}
    html body #settings-page #theme-grid > .theme-sw{aspect-ratio:auto!important;min-height:0;border-radius:22px!important}
    html body #settings-page #theme-grid .tw-dot{top:34%!important;left:50%!important;width:58%!important;height:26%!important;border-radius:999px!important;transform:translate(-50%,-50%) rotate(-24deg);
      box-shadow:inset 0 4px 5px rgba(255,255,255,.6),inset 0 -6px 9px rgba(0,0,0,.35),0 0 0 2px rgba(255,255,255,.9),0 0 0 4px rgba(0,0,0,.6),0 8px 10px rgba(0,0,0,.55)!important}
    html body #settings-page #theme-grid .ta-ico{top:22%!important;font-size:2rem!important}
    html body #settings-page #theme-grid .tw-name{font-family:'MTBall','MTUI',sans-serif!important;font-weight:700!important;font-size:min(1rem,4.2vw)!important;line-height:1.15!important;
      padding:8px 4px 9px!important;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.82) 40%)!important;text-shadow:0 2px 0 #000!important;white-space:normal}
    html.lowvision body #settings-page #theme-grid .tw-name{font-size:min(1.25rem,5.4vw)!important}
    html body #settings-page .tg-pager{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:4px 2px calc(8px + env(safe-area-inset-bottom,0px))}
    html body #settings-page .tg-pager button{flex:0 0 auto;width:64px;height:52px;border-radius:999px!important;border:2px solid rgba(255,255,255,.85)!important;color:#fff!important;font-size:1.6rem!important;font-weight:900;
      background:linear-gradient(180deg,#a5f3fc 0%,#22d3ee 22%,#0891b2 60%,#155e75 100%)!important;box-shadow:inset 0 3px 4px rgba(255,255,255,.6),inset 0 -5px 8px rgba(8,51,68,.55),0 0 0 2px rgba(0,0,0,.6),0 8px 12px rgba(0,0,0,.5)!important}
    html body #settings-page .tg-pager button:disabled{opacity:.3}
    html body #settings-page .tg-dots{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}
    html body #settings-page .tg-dots i{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.3);box-shadow:0 0 0 1.5px rgba(0,0,0,.5)}
    html.lowvision body #settings-page .panel-head .p-close.mt-backbtn{font-size:min(1.08rem,3.9vw)!important;padding:8px 11px 10px!important}
    html body #settings-page .tg-dots i.on{background:#67e8f9;box-shadow:0 0 0 2px #fff,0 0 10px #22d3ee}`;
    // M-255 (owner: the theme cards looked too generic): every card shows its own world as a floating 3D symbol,
    // glows in the theme's own colour and writes its name in that light
    const WORLD = { space: '🪐', clouds: '☁️', synth: '🌆', ocean: '🐠', planets: '🪐', fire: '🔥', forest: '🌲', snow: '❄️', hearts: '💖', storm: '⚡',
        crystals: '💎', sakura: '🌸', dna: '🧬', blackhole: '🕳️', butterflies: '🦋', bubbles: '🫧', tunnel: '🌀', molecules: '⚛️', balloons: '🎈', galaxy3d: '🌌' };
    const BYNAME = { 'Cosmic nebula': '✨', 'Northern lights': '🌌', 'Golden sunset': '🌅', 'Deep ocean': '🐋', 'Fire & lava': '🌋', 'Enchanted forest': '🍄',
        'Snowy winter': '⛄', 'Matrix': '💻', 'Dreamy pink': '💗', 'Thunderstorm': '⛈️', 'Desert dawn': '🏜️', 'Emerald': '💚', 'Midnight sun': '☀️', 'Cyberpunk': '🤖',
        'Coral reef': '🐠', 'Lavender': '💜', 'Gold & black': '👑', 'Polar ice': '🧊', 'Violet space': '🔮', 'Blooming spring': '🌷', 'Tropical turquoise': '🏝️',
        'Ruby red': '❤️', 'Moonlit night': '🌙', 'Retro neon': '🕹️', 'Electric energy': '⚡', 'White calm': '🕊️' };
    function dress() {
        const g = document.getElementById('theme-grid'); if (!g || !window.MED_THEMES) return;
        [...g.children].forEach((b, k) => {
            if (b.querySelector('.tw-world')) return;
            const th = b.classList.contains('theme-auto') ? null : MED_THEMES[k - 1];
            const w = document.createElement('span'); w.className = 'tw-world'; w.setAttribute('aria-hidden', 'true');
            w.textContent = th ? (BYNAME[th.n[4]] || WORLD[th.world] || '✨') : '🌗';
            b.style.setProperty('--tc', th ? th.ga : '#facc15');
            b.style.setProperty('--td', (5 + (k % 5) * 0.7) + 's'); b.style.setProperty('--tl', (-(k % 7)) + 's');
            b.insertBefore(w, b.firstChild);
        });
    }
    css.textContent += `
    html body #settings-page #theme-grid > .theme-sw{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35),inset 0 0 22px color-mix(in srgb,var(--tc) 45%,transparent),0 0 0 2px color-mix(in srgb,var(--tc) 80%,#000),0 0 0 4px rgba(0,0,0,.7),0 8px 14px rgba(0,0,0,.6),0 0 16px color-mix(in srgb,var(--tc) 50%,transparent)!important}
    html body #settings-page #theme-grid > .theme-sw.sel{box-shadow:inset 0 0 0 2px #fff,inset 0 0 26px color-mix(in srgb,var(--tc) 60%,transparent),0 0 0 3px #fff,0 0 0 5.5px rgba(0,0,0,.75),0 8px 14px rgba(0,0,0,.6),0 0 24px 4px var(--tc)!important}
    html body #settings-page #theme-grid .tw-dot,html body #settings-page #theme-grid .ta-ico{display:none!important}
    html body #settings-page #theme-grid .tw-world{position:absolute;left:50%;top:40%;font-size:min(2.6rem,11vw);line-height:1;transform:translate(-50%,-50%);
      filter:drop-shadow(0 4px 3px rgba(0,0,0,.6)) drop-shadow(0 0 10px var(--tc));animation:twFloat var(--td,6s) ease-in-out infinite;animation-delay:var(--tl,0s)}
    html.lowvision body #settings-page #theme-grid .tw-world{animation:none;font-size:min(3.2rem,14vw)}
    @keyframes twFloat{0%,100%{transform:translate(-50%,-50%) rotate(-6deg)}33%{transform:translate(calc(-50% + 3px),calc(-50% - 6px)) rotate(5deg) scale(1.06)}66%{transform:translate(calc(-50% - 3px),calc(-50% - 3px)) rotate(-2deg)}}
    html body #settings-page #theme-grid .tw-name{color:#fff!important;text-shadow:0 2px 0 #000,0 0 10px var(--tc),0 0 2px var(--tc)!important}
    /* M-260 (owner: the sideways swipe still showed frames): the cards are drawn once and only slide; no blurred glows, filters or floating
       symbols to redraw while the finger moves (only the chosen theme's symbol floats), and no press-shrink under a swiping finger */
    html body #settings-page #theme-grid{will-change:scroll-position;scroll-behavior:auto!important}
    html body #settings-page #theme-grid > .theme-sw{transition:none!important;transform:translateZ(0);backface-visibility:hidden;
      box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.35),0 0 0 2px color-mix(in srgb,var(--tc) 80%,#000),0 0 0 4px rgba(0,0,0,.7),0 6px 0 rgba(0,0,0,.45)!important}
    html body #settings-page #theme-grid > .theme-sw.sel{box-shadow:inset 0 0 0 2px #fff,0 0 0 3px #fff,0 0 0 5.5px rgba(0,0,0,.75),0 6px 0 rgba(0,0,0,.45),0 0 18px 3px var(--tc)!important}
    html body #settings-page #theme-grid > .theme-sw:active{transform:translateZ(0)!important}
    html body #settings-page #theme-grid .tw-world{filter:none!important;animation:none!important;text-shadow:0 4px 3px rgba(0,0,0,.6),0 0 10px var(--tc)}
    html:not(.lowvision) body #settings-page #theme-grid > .theme-sw.sel .tw-world{animation:twFloat 6s ease-in-out infinite!important}
    html body #settings-page #theme-grid .tw-name{text-shadow:0 2px 0 #000,0 0 3px var(--tc)!important}`;
    function pager() {
        const g = document.getElementById('theme-grid'); if (!g) return setTimeout(pager, 400);
        let bar = document.querySelector('#settings-page .tg-pager');
        if (!bar) {
            bar = document.createElement('div'); bar.className = 'tg-pager';
            bar.innerHTML = '<button type="button" class="tg-prev" aria-label="previous"></button><div class="tg-dots"></div><button type="button" class="tg-next" aria-label="next"></button>';
            g.after(bar);
        }
        const rtl = () => getComputedStyle(g).direction === 'rtl';
        const per = () => (getComputedStyle(g).getPropertyValue('--tg-c').trim() === '2' ? 2 : 3) * 3;
        const pageW = () => { const c = g.children[0], gap = parseFloat(getComputedStyle(g).columnGap) || 10; return c ? (c.offsetWidth + gap) * (per() / 3) : g.clientWidth; };
        const pages = () => Math.max(1, Math.ceil(g.children.length / per()));
        const cur = () => Math.min(pages() - 1, Math.round(Math.abs(g.scrollLeft) / Math.max(1, pageW())));
        const to = (i, smooth) => g.scrollTo({ left: (rtl() ? -1 : 1) * i * pageW(), behavior: smooth ? 'smooth' : 'auto' });
        const go = d => to(Math.max(0, Math.min(pages() - 1, cur() + d)), true);
        let last = '';
        const draw = () => {
            const n = pages(), c = cur(), dots = bar.querySelector('.tg-dots');
            if (last === n + ':' + c + ':' + rtl()) return; last = n + ':' + c + ':' + rtl();
            if (dots.children.length !== n) dots.innerHTML = '<i></i>'.repeat(n);
            [...dots.children].forEach((d, i) => d.classList.toggle('on', i === c));
            const pv = bar.querySelector('.tg-prev'), nx = bar.querySelector('.tg-next');
            pv.textContent = rtl() ? '→' : '←'; nx.textContent = rtl() ? '←' : '→';
            pv.disabled = c === 0; nx.disabled = c >= n - 1;
            bar.style.display = n > 1 ? '' : 'none';
        };
        bar.querySelector('.tg-prev').onclick = () => go(-1);
        bar.querySelector('.tg-next').onclick = () => go(1);
        // M-257 (owner: the pages did not glide): the phone's own snapping moves page by page (CSS scroll-snap), the floating symbols rest while it moves
        let rest = 0;
        g.addEventListener('scroll', () => { clearTimeout(rest); rest = setTimeout(draw, 90); }, { passive: true }); // M-260: nothing changes on the page while the finger moves
        // the chosen theme's page is shown when the screen opens
        const show = () => { const sel = g.querySelector('.theme-sw.sel'); to(sel ? Math.floor([...g.children].indexOf(sel) / per()) : 0); draw(); };
        new MutationObserver(() => { dress(); setTimeout(show, 60); }).observe(g, { childList: true });
        dress();
        const tile = g.closest('.set-tile');
        if (tile) new MutationObserver(() => { if (tile.classList.contains('open')) setTimeout(show, 120); }).observe(tile, { attributes: true, attributeFilter: ['class'] });
        addEventListener('resize', () => setTimeout(draw, 80));
    }
    pager();

    // M-253 (owner): the tour line is one big floating hand with the word inside it, instead of a small hand and a sentence
    const HAND = ['הדרכה', 'شرح', 'Ghid', 'Guide', 'Guide', 'Гид'], L6 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    css.textContent += `
    /* M-258 (owner): a real, detailed hand (the phone's own high-resolution emoji) that taps clearly with its finger,
       drifts freely in every direction on its spot, and carries the word on its back */
    html body .home-card #guide-btn{flex:0 0 auto!important;width:min(84px,22vw)!important;height:min(92px,24vw)!important;min-height:0!important;padding:0!important;margin:0 auto!important;position:relative!important;
      background:radial-gradient(circle at 50% 55%,rgba(74,222,128,.35),rgba(74,222,128,0) 68%)!important;perspective:300px;
      animation:glFree 9s ease-in-out infinite!important;will-change:transform;justify-content:center!important;align-items:center!important;display:flex!important}
    html body .home-card #guide-btn > :not(.gl-real){position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important}
    html body .home-card #guide-btn > .gl-real{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:min(4.6rem,20vw);line-height:1;font-style:normal;
      filter:drop-shadow(0 8px 7px rgba(0,0,0,.6)) drop-shadow(0 0 10px rgba(74,222,128,.6));transform-origin:50% 20%;animation:glPress 2.8s cubic-bezier(.4,0,.2,1) infinite;pointer-events:none}
    html body .home-card #guide-btn::after{content:'';position:absolute;left:43%;top:12%;right:auto;bottom:auto;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;border:3px solid #bbf7d0;
      box-shadow:0 0 12px #4ade80,inset 0 0 8px #4ade80;opacity:0;animation:glRipple 2.8s ease-out infinite;pointer-events:none;display:block!important}
    html body .home-card #guide-btn::before{content:attr(data-hand);position:absolute;left:4%;right:4%;top:66%;z-index:2;text-align:center;font-family:'MTBall','MTUI',sans-serif;font-weight:700;
      font-size:min(.95rem,4vw);line-height:1;color:#fff;letter-spacing:.2px;text-shadow:0 0 3px #000,0 1px 0 #166534,0 2px 0 #14532d,0 3px 4px rgba(0,0,0,.9);pointer-events:none;animation:glPress 2.8s cubic-bezier(.4,0,.2,1) infinite}
    @keyframes glFree{0%,100%{transform:translate(0,0) rotate(-6deg) rotateY(0)}18%{transform:translate(-7px,-5px) rotate(5deg) rotateY(18deg)}37%{transform:translate(4px,-10px) rotate(-10deg) rotateY(-12deg)}
      55%{transform:translate(8px,-2px) rotate(8deg) rotateY(14deg)}74%{transform:translate(-4px,3px) rotate(-3deg) rotateY(-20deg)}88%{transform:translate(-8px,-6px) rotate(10deg) rotateY(6deg)}}
    @keyframes glPress{0%,30%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-5px) scale(.9)}48%{transform:translateY(-2px) scale(.95)}58%{transform:translateY(0) scale(1)}}
    @keyframes glRipple{0%,38%{opacity:0;transform:scale(.3)}42%{opacity:1;transform:scale(.5)}75%{opacity:0;transform:scale(1.9)}100%{opacity:0}}
    html.hm-slim body .home-card #guide-btn{width:66px!important;height:72px!important}html.hm-slim body .home-card #guide-btn > .gl-real{font-size:3.6rem}
    html.fit5 body .home-card #guide-btn{display:flex!important;width:60px!important;height:64px!important}html.fit5 body .home-card #guide-btn > .gl-real{font-size:3.2rem}
    html body .home-card > .hm-bar{justify-content:center!important}
    /* M-254 (owner): the busy 3D background is calmed behind the menu, so the capsules stand out clearly */
    html body .home-card .hm-float{isolation:isolate}
    html body .home-card .hm-float::before{content:'';position:absolute;inset:-14px -10px;z-index:-1;pointer-events:none;border-radius:40px;
      background:radial-gradient(ellipse 72% 64% at 50% 50%,rgba(3,6,20,.82) 0%,rgba(3,6,20,.6) 55%,rgba(3,6,20,0) 100%);filter:blur(6px)}
    /* M-264 (owner: less visual noise): the moving 3D background is calmer and darker (a cheap colour filter, no blur), so the medicine buttons stand on top of it */
    html body #bg3d{filter:brightness(.6) saturate(.65) contrast(.9)}
    html.lowvision body .home-card #guide-btn,html.lowvision body .home-card #guide-btn > .gl-real,html.lowvision body .home-card #guide-btn::before{animation:none!important}
    /* M-253 (owner): the greeting stays on the main screen; on short screens it just gets a little smaller */
    html.fit6 body .hello-line.hello-line{display:table!important;padding:4px 14px 5px!important;font-size:.98rem!important;margin:0 auto 4px!important}
    html.fit6 body .hello-line.hello-line b{font-size:1.3em!important}`;
    /* M-265 (owner): the hand is clearer and in a new colour (bright pink with a white outline), and it waits restlessly:
       slow circles on its spot, a wobble, and now and then two impatient taps */
    css.textContent += `
    html body .home-card #guide-btn{animation:glCircle 8s linear infinite!important;background:radial-gradient(circle at 50% 55%,rgba(244,114,182,.4),rgba(244,114,182,0) 68%)!important}
    html body .home-card #guide-btn > .gl-real{animation:glWait 8s ease-in-out infinite!important;
      filter:hue-rotate(285deg) saturate(1.9) brightness(1.08) drop-shadow(0 0 0 #fff) drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(0 8px 7px rgba(0,0,0,.65)) drop-shadow(0 0 12px #f472b6)!important}
    html body .home-card #guide-btn::after{border-color:#fbcfe8!important;box-shadow:0 0 12px #f472b6,inset 0 0 8px #f472b6!important;animation:glRip2 8s ease-out infinite!important}
    html body .home-card #guide-btn::before{animation:glWait 8s ease-in-out infinite!important;text-shadow:0 0 3px #000,0 1px 0 #9d174d,0 2px 0 #831843,0 3px 4px rgba(0,0,0,.9)!important}
    @keyframes glCircle{0%{transform:translate(0,-9px) rotate(-4deg)}12.5%{transform:translate(6px,-6px) rotate(3deg)}25%{transform:translate(9px,0) rotate(7deg)}37.5%{transform:translate(6px,6px) rotate(2deg)}
      50%{transform:translate(0,9px) rotate(-5deg)}62.5%{transform:translate(-6px,6px) rotate(-9deg)}75%{transform:translate(-9px,0) rotate(-3deg)}87.5%{transform:translate(-6px,-6px) rotate(4deg)}100%{transform:translate(0,-9px) rotate(-4deg)}}
    @keyframes glWait{0%,14%,30%,52%,100%{transform:translateY(0) rotate(0) scale(1)}20%{transform:translateY(-2px) rotate(-8deg)}26%{transform:translateY(-2px) rotate(8deg)}
      60%{transform:translateY(-6px) scale(.9)}64%{transform:translateY(0) scale(1)}68%{transform:translateY(-6px) scale(.9)}72%{transform:translateY(0) scale(1)}}
    @keyframes glRip2{0%,58%{opacity:0;transform:scale(.3)}61%{opacity:1;transform:scale(.5)}66%{opacity:0;transform:scale(1.6)}69%{opacity:1;transform:scale(.5)}76%{opacity:0;transform:scale(1.9)}100%{opacity:0}}
    html.lowvision body .home-card #guide-btn,html.lowvision body .home-card #guide-btn > .gl-real,html.lowvision body .home-card #guide-btn::before,html.lowvision body .home-card #guide-btn::after{animation:none!important}
    /* M-270 (owner): a smaller hand with only a thin glow round it */
    html body .home-card #guide-btn{width:min(66px,18vw)!important;height:min(72px,19vw)!important;background:none!important;box-shadow:none!important;border:0!important;outline:0!important;text-shadow:none!important}
    html body .home-card #guide-btn > .gl-real{font-size:min(3.3rem,15vw)!important;
      filter:hue-rotate(285deg) saturate(1.9) brightness(1.08) drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(0 4px 3px rgba(0,0,0,.6))!important}
    html body .home-card #guide-btn::before{font-size:min(.8rem,3.4vw)!important}
    html body .home-card #guide-btn::after{width:22px;height:22px;margin:-11px 0 0 -11px;box-shadow:0 0 5px #f472b6!important}
    html.hm-slim body .home-card #guide-btn,html.fit5 body .home-card #guide-btn{width:56px!important;height:60px!important}
    html.hm-slim body .home-card #guide-btn > .gl-real,html.fit5 body .home-card #guide-btn > .gl-real{font-size:2.8rem!important}`;
    /* M-271 (owner): the name MedTime spreads proudly from side to side on the main screen, with the ECG line under it edge to edge */
    css.textContent += `
    html:not(.hm-slim):not(.fit6) body h1.mt-logo.mt-logo{font-size:min(7rem,calc((100vw - 16px) / 4.4))!important;width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important}
    html body h1.mt-logo.mt-logo svg.mt-word{margin:0 auto}
    html body h1.mt-logo.mt-logo .lg-ecg{left:0!important;width:100%!important;height:.42em!important}
    @media (max-height:700px){html:not(.hm-slim):not(.fit6) body h1.mt-logo.mt-logo{font-size:min(5rem,calc((100vw - 16px) / 5.2))!important}}`;
    function handWord() {
        const gb = document.getElementById('guide-btn'); if (!gb) return setTimeout(handWord, 500);
        const set = () => { const i = Math.max(0, L6.indexOf(typeof LANG === 'string' ? LANG : document.documentElement.lang)); if (gb.dataset.hand !== HAND[i]) gb.dataset.hand = HAND[i];
            if (!gb.querySelector(':scope > .gl-real')) { const h = document.createElement('span'); h.className = 'gl-real'; h.setAttribute('aria-hidden', 'true'); h.textContent = '👆'; gb.appendChild(h); } };
        set(); new MutationObserver(set).observe(gb, { childList: true, subtree: true, characterData: true });
    }
    handWord();
    // M-259 (owner): the animated-guide sheet: a clear back button instead of the red ✕, topic buttons as glossy capsules whose words
    // never run into the next one, the "detailed help" box as one compact button beside "back", and everything fits with no scrolling
    const G = 'html #mt-guide', GBACK = ['למסך הראשי', 'للشاشة الرئيسية', 'Ecran principal', 'Écran principal', 'Main screen', 'На главный'];
    css.textContent += `
    ${G} .g-card{padding:calc(10px + env(safe-area-inset-top)) 12px calc(10px + env(safe-area-inset-bottom))!important;gap:0;
      background:radial-gradient(ellipse 90% 50% at 50% 0%,rgba(168,85,247,.45),rgba(168,85,247,0) 70%),linear-gradient(170deg,#3b0764,#1e1b4b 55%,#0b1023)!important}
    ${G} .g-t{font-family:'MTBall','MTUI',sans-serif;font-weight:700;font-size:min(1.6rem,7vw,3.6vh)!important;line-height:1.15;margin:2px 0 2px!important;color:#f5e8ff;
      text-shadow:0 1px 0 #7e22ce,0 2px 0 #6b21a8,0 3px 0 #581c87,0 5px 8px rgba(0,0,0,.7)}
    ${G} .g-s{font-size:min(1rem,4.2vw,2.2vh)!important;margin:0 0 8px!important;line-height:1.25}
    ${G} .g-voice{flex:none;margin:0 0 10px!important;padding:min(11px,1.3vh) 14px!important;font-size:min(1.08rem,4.6vw,2.4vh)!important;border-radius:999px!important;
      border:2px solid rgba(255,255,255,.85)!important;box-shadow:inset 0 2px 3px rgba(255,255,255,.45),inset 0 -4px 7px rgba(0,0,0,.35),0 0 0 3px rgba(0,0,0,.6),0 6px 12px rgba(0,0,0,.5)!important}
    ${G} .g-grid{gap:min(10px,1.2vh) 10px!important;padding:3px!important}
    ${G} .g-grid > button.g-b{display:flex!important;align-items:center;gap:8px;min-width:0;min-height:0;overflow:hidden;padding:2px 12px!important;border-radius:999px!important;text-align:start;
      font-family:inherit;font-weight:800;font-size:var(--gb-f,min(1.02rem,4.3vw,2.3vh))!important;line-height:1.12!important;color:#fff;
      border:2px solid rgba(255,255,255,.88)!important;background:linear-gradient(180deg,rgba(255,255,255,.34) 0,rgba(255,255,255,.08) 38%,rgba(0,0,0,0) 60%,rgba(0,0,0,.25) 100%),linear-gradient(170deg,#a855f7,#6d28d9 55%,#3b0764)!important;
      box-shadow:inset 0 2px 3px rgba(255,255,255,.5),inset 0 -5px 8px rgba(0,0,0,.35),0 0 0 3px rgba(0,0,0,.7),0 6px 10px rgba(0,0,0,.55)!important;text-shadow:0 1px 0 #3b0764,0 2px 3px rgba(0,0,0,.7)}
    ${G} .g-grid > button.g-b:nth-child(4n+2),${G} .g-grid > button.g-b:nth-child(4n+3){background:linear-gradient(180deg,rgba(255,255,255,.34) 0,rgba(255,255,255,.08) 38%,rgba(0,0,0,0) 60%,rgba(0,0,0,.25) 100%),linear-gradient(170deg,#6366f1,#4338ca 55%,#1e1b4b)!important}
    ${G} .g-grid > button.g-b:active{transform:translateY(3px)}
    ${G} .g-b .gb-e{flex:none;font-style:normal;font-size:1.45em;line-height:1;filter:drop-shadow(0 2px 2px rgba(0,0,0,.6))}
    ${G} .g-b .gb-t{flex:1 1 auto;min-width:0;overflow:hidden;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
    ${G} .g-more{display:none!important}
    ${G} .g-foot{flex:none;display:flex;gap:10px;align-items:stretch;margin-top:min(12px,1.4vh)}
    ${G} .g-foot > button{flex:1 1 0;min-width:0;min-height:min(52px,6.4vh);border-radius:999px;padding:6px 12px;font-family:inherit;font-weight:900;font-size:min(1.05rem,4.4vw,2.4vh);line-height:1.1;
      color:#fff;border:2px solid rgba(255,255,255,.9);overflow:hidden;overflow-wrap:anywhere}
    ${G} .g-foot > .g-x{position:static!important;width:auto!important;height:auto!important;background:linear-gradient(180deg,#a5f3fc 0%,#22d3ee 22%,#0891b2 60%,#155e75 100%)!important;
      text-shadow:0 1px 0 #0e7490,0 2px 0 #155e75,0 3px 4px rgba(0,0,0,.6);box-shadow:inset 0 3px 4px rgba(255,255,255,.65),inset 0 -5px 8px rgba(8,51,68,.55),0 5px 0 #0c4a5e,0 10px 14px rgba(0,0,0,.5),0 0 16px rgba(34,211,238,.5)!important}
    ${G} .g-foot > .g-help{width:auto!important;background:linear-gradient(180deg,#fef3c7 0%,#fbbf24 25%,#d97706 65%,#92400e 100%)!important;color:#fff!important;
      text-shadow:0 1px 0 #b45309,0 2px 0 #92400e,0 3px 4px rgba(0,0,0,.6);box-shadow:inset 0 3px 4px rgba(255,255,255,.65),inset 0 -5px 8px rgba(120,53,15,.55),0 5px 0 #78350f,0 10px 14px rgba(0,0,0,.5)!important}
    ${G} .g-foot > button:active{transform:translateY(4px)}
    html.lowvision #mt-guide .g-grid > button.g-b{background:#000!important;border-color:#fff!important;font-size:var(--gb-f,min(1.15rem,4.8vw,2.5vh))!important}
    html.lowvision #mt-guide .g-b .gb-e{font-size:1.25em}`;
    function dressGuide(sh) {
        const card = sh.querySelector('.g-card'), x = sh.querySelector('.g-x'), help = sh.querySelector('.g-help'), grid = sh.querySelector('.g-grid');
        if (!card || !x || !help || !grid || sh.querySelector('.g-foot')) return;
        const i = Math.max(0, L6.indexOf(typeof LANG === 'string' ? LANG : document.documentElement.lang));
        x.textContent = (i < 2 ? '→ ' : '← ') + '🏠 ' + GBACK[i]; x.setAttribute('aria-label', GBACK[i]);
        const foot = document.createElement('div'); foot.className = 'g-foot'; foot.append(x, help); card.appendChild(foot);
        [...grid.children].forEach(b => {
            const m = b.textContent.match(/^(\S+)\s+(.*)$/); if (!m) return;
            b.classList.add('g-b'); b.textContent = '';
            const e = document.createElement('i'); e.className = 'gb-e'; e.setAttribute('aria-hidden', 'true'); e.textContent = m[1];
            const t = document.createElement('span'); t.className = 'gb-t'; t.textContent = m[2]; b.append(e, t);
        });
        askBox(sh); fitGuide(sh); [350, 900].forEach(d => setTimeout(() => sh.isConnected && fitGuide(sh), d));
    }
    // M-265 (owner): a box for a free question; it finds the matching topic by its words (offline, 6 languages) and the hand shows it live
    const ASK = {
        ph: ['שאלו אותי כל דבר, למשל: איך מוסיפים תרופה?', 'اسألني أي شيء، مثلاً: كيف أضيف دواء؟', 'Întrebați orice, ex.: cum adaug un medicament?', 'Posez une question, ex. : comment ajouter un médicament ?', 'Ask me anything, e.g. how do I add a medicine?', 'Спросите что угодно, напр.: как добавить лекарство?'],
        go: ['שאל', 'اسأل', 'Întreabă', 'Demander', 'Ask', 'Спросить'],
        hit: ['מצאתי! ', 'وجدت! ', 'Am găsit! ', 'Trouvé ! ', 'Found it! ', 'Нашёл! '],
        show: ['👆 הראה לי', '👆 أرني', '👆 Arată-mi', '👆 Montre-moi', '👆 Show me', '👆 Покажи'],
        none: ['לא מצאתי בדיוק. נסו מילים אחרות, או בחרו נושא למטה 👇', 'لم أجد بالضبط. جرّب كلمات أخرى أو اختر موضوعًا 👇', 'Nu am găsit. Încercați alte cuvinte sau alegeți mai jos 👇', 'Pas trouvé. Essayez d\'autres mots ou choisissez ci-dessous 👇', 'Not found. Try other words, or pick a topic below 👇', 'Не нашёл. Попробуйте другие слова или выберите ниже 👇']
    };
    const KEYS = ['home', 'add', 'firstaid', 'tools', 'edit', 'wk', 'appt', 'log', 'fam', 'stock', 'widget', 'read', 'relax', 'settings'];
    const KW = {
        home: 'מסך ראשי|המסך הראשי|תפריט|الرئيسية|قائمة|ecran principal|meniu|accueil|écran principal|main screen|home screen|menu|главн|меню',
        add: 'הוסף|להוסיף|הוספ|מוסיפ|תרופה חדשה|תזכורת חדשה|כדור חדש|לקבוע תזכורת|קבע תזכורת|إضاف|أضيف|اضيف|دواء جديد|adaug|ajout|nouveau médicament|add|new medicine|new reminder|добав',
        firstaid: 'עזרה ראשונה|חירום|החייאה|פציע|כוויה|sos|إسعاف|طوارئ|prim ajutor|urgen|secours|urgence|first aid|emergency|первая помощь|скорая|срочн',
        tools: 'בדיקת תרופה|לבדוק תרופה|מדד|לחץ דם|סוכר|דופק|צילום|מצלמה|תרופה חליפית|גנרי|فحص|ضغط|سكر|نبض|verific|tensiun|glicem|puls|vérif|tension|glycém|pouls|check|blood pressure|sugar|pulse|camera|vital|провер|давлен|сахар|пульс',
        edit: 'לשנות|שינוי|לערוך|עריכה|למחוק|מחיקה|מוחק|משנים|לתקן|تعديل|حذف|غيّر|modific|șterg|sterg|modifier|supprim|change|edit|delete|remove|измен|удал|редакт',
        wk: 'סופ"ש|סופ״ש|סופש|סוף שבוע|שבת|חגים|نهاية الأسبوع|عطلة|weekend|sărbăt|week-end|holiday|выходн|праздн',
        appt: 'תור|רופא|פגישה|מרפאה|موعد|طبيب|programare|medic|rendez|médecin|appointment|doctor|приём|прием|врач',
        log: 'יומן|דוח|דו"ח|היסטוריה|מה לקחתי|pdf|سجل|تقرير|jurnal|raport|journal|rapport|log|report|history|журнал|отчёт|отчет',
        fam: 'משפחה|הילדים|התראה למשפחה|לא לקחתי|عائل|famil|семь',
        stock: 'מלאי|נגמר|נגמרים|כמה כדורים|קופסה|חבילה|مخزون|stoc|stock|refill|run out|запас',
        widget: 'ווידג|וידג|ويدجت|أداة|widget|виджет',
        read: 'קריאה|אותיות|גדול|להגדיל|גופן|טקסט|ראייה|قراءة|خط كبير|citire|font|lecture|texte|read|bigger|text size|vision|чтени|крупн|шрифт',
        relax: 'שלווה|מרגיע|להירגע|נשימה|מוזיקה|לישון|שינה|רגוע|سكين|هدوء|تنفس|liniș|linis|respira|séréni|calme|relax|calm|breath|sleep|serenity|поко|расслаб|дыхан|сон',
        settings: 'הגדרות|שפה|צליל|צלצול|ערכת נושא|רקע|צבע|עוצמה|إعدادات|لغة|صوت|setări|setari|limb|sunet|réglage|langue|settings|language|sound|ringtone|theme|volume|настрой|язык|звук'
    };
    const norm = t => String(t || '').toLowerCase().replace(/[֑-ׇً-ْ]/g, '').replace(/[?!.,;:()"'״׳]/g, ' ').replace(/\s+/g, ' ').trim();
    function findTopic(q, grid) {
        q = ' ' + norm(q) + ' '; if (q.trim().length < 2) return -1;
        let best = -1, bs = 0;
        KEYS.forEach((k, i) => {
            let sc = 0;
            KW[k].split('|').forEach(w => { w = norm(w); if (w && q.includes(w)) sc += 1 + w.length / 6; });
            const b = grid.children[i], t = b && norm(b.textContent);
            if (t) t.split(' ').forEach(w => { if (w.length >= 4 && q.includes(w)) sc += .6; });
            if (sc > bs) { bs = sc; best = i; }
        });
        return best;
    }
    function askBox(sh) {
        const card = sh.querySelector('.g-card'), grid = sh.querySelector('.g-grid'), sub = sh.querySelector('.g-s');
        if (!card || !grid || sh.querySelector('.g-ask')) return;
        const i = Math.max(0, L6.indexOf(typeof LANG === 'string' ? LANG : document.documentElement.lang));
        const f = document.createElement('form'); f.className = 'g-ask'; f.setAttribute('autocomplete', 'off');
        f.innerHTML = '<input type="text" enterkeyhint="search"><button type="submit"></button>';
        const inp = f.querySelector('input'); inp.placeholder = ASK.ph[i]; f.querySelector('button').textContent = '🔎 ' + ASK.go[i];
        const ans = document.createElement('div'); ans.className = 'g-ans';
        sub.after(f, ans);
        f.onsubmit = e => {
            e.preventDefault(); inp.blur();
            const n = findTopic(inp.value, grid); ans.textContent = '';
            [...grid.children].forEach(x => x.classList.remove('g-hit'));
            if (n < 0) { ans.textContent = ASK.none[i]; ans.className = 'g-ans on miss'; if (window.mtAskMiss) window.mtAskMiss(inp.value); }
            else {
                const b = grid.children[n], t = document.createElement('span'), go = document.createElement('button');
                t.textContent = ASK.hit[i] + b.textContent; go.type = 'button'; go.textContent = ASK.show[i]; go.onclick = () => b.click();
                ans.append(t, go); ans.className = 'g-ans on';
                b.classList.add('g-hit');
            }
            fitGuide(sh);
        };
    }
    css.textContent += `
    ${G} .g-ask{flex:none;display:flex;gap:8px;margin:0 0 8px}
    ${G} .g-ask input{flex:1 1 auto;min-width:0;padding:10px 14px;border-radius:999px;border:2px solid rgba(255,255,255,.85);background:#fff!important;color:#1e1b4b!important;-webkit-text-fill-color:#1e1b4b!important;
      font-family:inherit;font-weight:700;font-size:min(1rem,4.2vw,2.3vh);box-shadow:inset 0 2px 5px rgba(0,0,0,.25),0 0 0 3px rgba(0,0,0,.6)}
    ${G} .g-ask button{flex:none;padding:8px 14px;border-radius:999px;border:2px solid rgba(255,255,255,.9);font-family:inherit;font-weight:900;font-size:min(1rem,4.2vw,2.3vh);color:#fff;
      background:linear-gradient(180deg,#fbcfe8 0%,#f472b6 25%,#db2777 65%,#831843 100%);text-shadow:0 1px 0 #9d174d,0 2px 3px rgba(0,0,0,.6);box-shadow:inset 0 3px 4px rgba(255,255,255,.6),0 4px 0 #500724,0 0 0 3px rgba(0,0,0,.6)}
    ${G} .g-ans{display:none}
    ${G} .g-ans.on{flex:none;display:flex;align-items:center;gap:10px;margin:0 0 8px;padding:8px 12px;border-radius:18px;background:rgba(244,114,182,.18);border:1.5px solid rgba(251,207,232,.7);
      font-weight:800;font-size:min(1rem,4.2vw,2.2vh);line-height:1.2}
    ${G} .g-ans.on span{flex:1 1 auto;min-width:0}
    ${G} .g-ans.miss{color:#fde68a}
    ${G} .g-ans button{flex:none;padding:8px 14px;border-radius:999px;border:2px solid #fff;font-family:inherit;font-weight:900;font-size:inherit;color:#fff;
      background:linear-gradient(180deg,#a5f3fc 0%,#22d3ee 22%,#0891b2 60%,#155e75 100%);box-shadow:0 4px 0 #0c4a5e;animation:mtBkFloat 2s ease-in-out infinite}
    ${G} .g-grid > button.g-b.g-hit{outline:4px solid #f472b6;outline-offset:2px}
    html.lowvision #mt-guide .g-ask input{background:#fff!important;color:#000!important}`;
    // the words get a little smaller until every topic fits inside its own capsule and the sheet fits the screen
    function fitGuide(sh) {
        const grid = sh.querySelector('.g-grid'), card = sh.querySelector('.g-card'); if (!grid) return;
        grid.style.removeProperty('--gb-f');
        const bs = [...grid.children], over = () => card.scrollHeight > card.clientHeight + 1 || bs.some(b => { const t = b.querySelector('.gb-t'); return b.scrollHeight > b.clientHeight + 1 || (t && t.scrollHeight > t.clientHeight + 1); });
        let f = parseFloat(getComputedStyle(bs[0] || grid).fontSize);
        for (let k = 0; k < 16 && f > 11 && over(); k++) { f -= 1; grid.style.setProperty('--gb-f', f + 'px'); }
    }
    function hookGuide() {
        const og = window.mtGuide; if (typeof og !== 'function') return setTimeout(hookGuide, 500);
        window.mtGuide = function () { const r = og.apply(this, arguments); const sh = document.getElementById('mt-guide'); if (sh) dressGuide(sh); return r; };
        addEventListener('resize', () => { const sh = document.getElementById('mt-guide'); if (sh) fitGuide(sh); });
    }
    hookGuide();
})();
