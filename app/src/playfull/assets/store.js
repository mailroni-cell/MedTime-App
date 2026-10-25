// M-375: full MedTime from Google Play (internal testing). Everything stays; only the self-update
// tile and pill are hidden, because Google Play updates the app.
(function () {
    'use strict';
    window.MT_GPLAY = true;
    const css = document.createElement('style');
    css.textContent = 'html body #tile-upd, html body #upd-pill{display:none!important}';
    (document.head || document.documentElement).appendChild(css);
})();
