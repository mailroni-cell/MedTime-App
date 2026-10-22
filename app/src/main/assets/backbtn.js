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
    html body :is(.close-3d,.p-close).mt-backbtn,html body .panel-head .p-close.mt-backbtn{max-width:60vw!important;overflow:hidden!important;text-overflow:ellipsis!important;width:auto!important;height:auto!important;min-width:0!important;min-height:46px!important;flex:0 0 auto!important;border-radius:999px!important;
      padding:8px 16px!important;background:#f8fafc!important;color:#0f172a!important;border:0!important;font-family:inherit!important;font-weight:900!important;
      font-size:1.02rem!important;line-height:1.1!important;white-space:nowrap!important;text-shadow:none!important;-webkit-text-stroke:0!important;
      box-shadow:0 4px 0 #64748b,0 8px 16px rgba(0,0,0,.4)!important;animation:none!important;display:inline-flex!important;align-items:center!important;gap:6px!important}
    html body :is(.close-3d,.p-close).mt-backbtn:active{transform:translateY(3px)!important;box-shadow:0 1px 0 #64748b!important}
    html body .close-3d.mt-backbtn.mt-exit{background:#fee2e2!important;color:#7f1d1d!important;box-shadow:0 4px 0 #b91c1c,0 8px 16px rgba(0,0,0,.4)!important}
    html.lowvision body :is(.close-3d,.p-close).mt-backbtn{background:#fff!important;color:#000!important;font-size:1.2rem!important}`;
    document.head.appendChild(css);

    const arrow = () => (li() < 2 ? '→ ' : '← ');
    function label(b, kind) {
        b.classList.add('mt-backbtn'); b.classList.toggle('mt-exit', kind === 'exit');
        b.textContent = (kind === 'exit' ? '✕ ' : arrow()) + T[kind][li()];
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
