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
    html.lowvision body #settings-page .panel-head .p-close.mt-backbtn{font-size:min(1.08rem,4.3vw)!important;padding:8px 13px 10px!important}
    html body #settings-page .tg-dots i.on{background:#67e8f9;box-shadow:0 0 0 2px #fff,0 0 10px #22d3ee}`;
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
        const draw = () => {
            const n = pages(), c = cur(), dots = bar.querySelector('.tg-dots');
            if (dots.children.length !== n) dots.innerHTML = '<i></i>'.repeat(n);
            [...dots.children].forEach((d, i) => d.classList.toggle('on', i === c));
            const pv = bar.querySelector('.tg-prev'), nx = bar.querySelector('.tg-next');
            pv.textContent = rtl() ? '→' : '←'; nx.textContent = rtl() ? '←' : '→';
            pv.disabled = c === 0; nx.disabled = c >= n - 1;
            bar.style.display = n > 1 ? '' : 'none';
        };
        bar.querySelector('.tg-prev').onclick = () => go(-1);
        bar.querySelector('.tg-next').onclick = () => go(1);
        let q = 0, st = 0, held = false;
        g.addEventListener('touchstart', () => { held = true; }, { passive: true });
        g.addEventListener('touchend', () => { held = false; clearTimeout(st); st = setTimeout(settle, 160); }, { passive: true });
        // a swipe always ends on a whole page
        const settle = () => { if (held) return; const want = cur() * pageW(); if (Math.abs(Math.abs(g.scrollLeft) - want) > 3) to(cur(), true); };
        g.addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(() => { q = 0; draw(); }); clearTimeout(st); st = setTimeout(settle, 160); }, { passive: true });
        // the chosen theme's page is shown when the screen opens
        const show = () => { const sel = g.querySelector('.theme-sw.sel'); to(sel ? Math.floor([...g.children].indexOf(sel) / per()) : 0); draw(); };
        new MutationObserver(() => setTimeout(show, 60)).observe(g, { childList: true });
        const tile = g.closest('.set-tile');
        if (tile) new MutationObserver(() => { if (tile.classList.contains('open')) setTimeout(show, 120); }).observe(tile, { attributes: true, attributeFilter: ['class'] });
        addEventListener('resize', () => setTimeout(draw, 80));
    }
    pager();
})();
