// M-215 (owner): every screen and menu has a clear, worded way out instead of a bare red ✕, by its logic:
// settings panels -> "back to settings", pages opened from the main screen -> "main screen", wizards -> "exit".
// Only the label and look change; each button keeps its own handler.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const T = {
        main: ['למסך הראשי', 'للشاشة الرئيسية', 'Ecran principal', 'Écran principal', 'Main screen', 'На главный'],
        set: ['להגדרות', 'للإعدادات', 'La setări', 'Aux réglages', 'To settings', 'К настройкам'],
        exit: ['יציאה', 'خروج', 'Ieșire', 'Quitter', 'Exit', 'Выход']
    };
    const css = document.createElement('style');
    css.textContent = `
    /* M-227 (owner): a beautiful glossy 3D button that floats, not a plain white box */
    html body :is(.close-3d,.p-close).mt-backbtn,html body .panel-head .p-close.mt-backbtn{max-width:62vw!important;overflow:hidden!important;text-overflow:ellipsis!important;
      width:auto!important;height:auto!important;min-width:0!important;min-height:50px!important;flex:0 0 auto!important;border-radius:999px!important;padding:9px 20px 11px!important;
      background:linear-gradient(180deg,#a5f3fc 0%,#22d3ee 22%,#0891b2 60%,#155e75 100%)!important;color:#fff!important;border:2px solid rgba(255,255,255,.9)!important;
      font-family:inherit!important;font-weight:900!important;font-size:1.08rem!important;line-height:1.1!important;white-space:nowrap!important;
      text-shadow:0 1px 0 #0e7490,0 2px 0 #155e75,0 3px 0 #164e63,0 4px 5px rgba(0,0,0,.6)!important;-webkit-text-stroke:0!important;
      box-shadow:inset 0 3px 4px rgba(255,255,255,.65),inset 0 -5px 8px rgba(8,51,68,.55),0 6px 0 #0c4a5e,0 14px 18px rgba(0,0,0,.5),0 0 18px rgba(34,211,238,.55)!important;
      animation:mtBkFloat 3.4s ease-in-out infinite!important;will-change:transform;display:inline-flex!important;align-items:center!important;gap:7px!important}
    html body .settings-hero > .close-3d.mt-backbtn{position:relative!important;top:auto!important;left:auto!important;right:auto!important;inset-inline-end:auto!important;
      margin:0 auto 8px!important;display:flex!important;width:fit-content!important}
    /* M-237 (owner: checked one by one, normal and low vision): wizard heads put the exit button above the title, so it never covers it */
    html body .af-head{display:flex!important;flex-direction:column!important;align-items:center!important}
    html body .af-head > .close-3d.mt-backbtn{position:relative!important;top:auto!important;left:auto!important;right:auto!important;inset-inline-end:auto!important;
      margin:0 auto 4px!important;min-height:42px!important;padding:6px 16px 8px!important;font-size:1rem!important}
    /* low vision settings: no big gear on top, so the tiles can be bigger */
    html.lowvision #settings-page .settings-hero .hero-gear{display:none!important}
    html.lowvision body #settings-page .set-grid .set-ico{width:min(26vw,8.6vh,104px)!important;height:min(26vw,8.6vh,104px)!important;font-size:min(12vw,4.4vh,3rem)!important}
    html.lowvision body #settings-page .set-grid .set-title{font-size:min(1.35rem,5.2vw,2.7vh)!important}
    @keyframes mtBkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    html body :is(.close-3d,.p-close).mt-backbtn:active{animation:none!important;transform:translateY(5px)!important;box-shadow:inset 0 3px 4px rgba(255,255,255,.5),0 1px 0 #0c4a5e,0 4px 8px rgba(0,0,0,.5)!important}
    html body .close-3d.mt-backbtn.mt-exit{background:linear-gradient(180deg,#fecaca 0%,#f87171 22%,#dc2626 60%,#7f1d1d 100%)!important;
      text-shadow:0 1px 0 #b91c1c,0 2px 0 #991b1b,0 3px 0 #7f1d1d,0 4px 5px rgba(0,0,0,.6)!important;
      box-shadow:inset 0 3px 4px rgba(255,255,255,.6),inset 0 -5px 8px rgba(69,10,10,.55),0 6px 0 #5f0d0d,0 14px 18px rgba(0,0,0,.5),0 0 18px rgba(248,113,113,.5)!important}
    html.lowvision body :is(.close-3d,.p-close).mt-backbtn{font-size:1.2rem!important;animation:none!important}
    @media (prefers-reduced-motion: reduce){html body :is(.close-3d,.p-close).mt-backbtn{animation:none!important}}
    /* M-350 (owner): in low-vision the words of the big back button were cut at its edge: it may be as wide as the screen */
    html.lowvision body :is(.close-3d,.p-close).mt-backbtn:not(#mt-x),html.lowvision body .panel-head .p-close.mt-backbtn:not(#mt-x){max-width:calc(100vw - 24px)!important;text-overflow:clip!important;overflow:visible!important}
`;
    document.head.appendChild(css);

    const arrow = () => (li() < 2 ? '→ ' : '← ');
    function label(b, kind) {
        b.classList.add('mt-backbtn'); b.classList.toggle('mt-exit', kind === 'exit');
        b.textContent = (kind === 'exit' ? '✕ ' : arrow()) + (kind === 'main' ? '🏠 ' : '') + T[kind][li()];
        b.setAttribute('aria-label', T[kind][li()]);
    }
    const PAGES = { 'med-page': 'exit', 'appt-form-page': 'exit', 'list-page': 'main', 'appt-page': 'main', 'settings-page': 'main' };
    function draw() {
        Object.keys(PAGES).forEach(id => {
            const pg = document.getElementById(id), b = pg && pg.querySelector(':scope > .af-head .close-3d, :scope > * > .close-3d, :scope .close-3d');
            if (b) label(b, PAGES[id]);
        });
        // settings panels (Help has its own "main screen" button)
        document.querySelectorAll('#settings-page .set-tile:not(#tile-help) .panel-head .p-close').forEach(b => label(b, 'set'));
    }
    draw(); setTimeout(draw, 1500); setTimeout(draw, 4000);
    const sel = document.getElementById('lang-select');
    if (sel) sel.addEventListener('change', () => setTimeout(draw, 300));
    const pr = window.moreRender; window.moreRender = function () { if (pr) pr(); draw(); };
    window.mtBackLabels = draw;
})();
