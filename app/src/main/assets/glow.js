// M-164 (owner 2026-10-21): text in the main menus always stands out: bright white core, a dark outline that
// separates it from any background, and a fluorescent glow in the button's own colour (re-read when the theme changes).
(function () {
    'use strict';
    const SEL = '#main-add, .home-card .appt-btn, .home-card .list-btn, .home-card .relax-btn, .home-card [class*="vt-"], .home-card .nav-row > button, ' +
        '.gear-btn, .exit-btn, .lv-btn, .hello-line, .set-tile-head .set-title, .set-tile-head .set-sub, .settings-hero h2, .list-page h2';
    const css = document.createElement('style');
    css.textContent = `
    :is(${SEL}), :is(${SEL}) :is(span,b,i,small,div,label):not(.badge):not(.ba-cross):not(.rb-ico):not(.set-ico):not(.ab-count):not(.lb-count):not(.set-chev) {
        color: var(--mtc, #ffffff) !important;
        -webkit-text-stroke: 0.4px rgba(0,0,0,.7);
        font-weight: 800 !important;
        text-shadow: 0 0 2px #000, 0 1px 2px #000, 0 0 9px var(--mtg, #67e8f9) !important; /* M-165: 3 light layers, smooth on the phone */
    }
    /* second lines: in the fluorescent colour itself, with the dark outline */
    :is(${SEL}) :is(.set-sub, .ab-sub, .lb-next, .lb-nt), :is(${SEL}) .set-sub *, :is(#mt-x, .set-tile-head) .set-sub, :is(#mt-x, .set-tile-head) .set-sub * {
        opacity: 1 !important; color: var(--mts, #67e8f9) !important;
        text-shadow: 0 0 1px #000, 0 0 2px #000, 0 1px 3px #000, 0 0 10px rgba(0,0,0,.6) !important;
    }`;
    document.head.appendChild(css);

    // the button's own colour, made fluorescent (full saturation, light)
    function glowOf(el) {
        for (let n = el; n && n !== document.body; n = n.parentElement) {
            const cs = getComputedStyle(n);
            const m = (cs.backgroundImage + ' ' + cs.backgroundColor + ' ' + (n.style.getPropertyValue('--g') || '')).match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)(?:[ ,/]+([\d.]+))?|#([0-9a-f]{6})\b/i);
            if (!m) continue;
            let r, g, b, a = 1;
            if (m[5]) { r = parseInt(m[5].slice(0, 2), 16); g = parseInt(m[5].slice(2, 4), 16); b = parseInt(m[5].slice(4, 6), 16); }
            else { r = +m[1]; g = +m[2]; b = +m[3]; if (m[4] !== undefined) a = +m[4]; }
            if (a < 0.2) continue;
            const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
            if (mx - mn < 18) return { h: -1, own: n === el }; // grey / black
            let h; const d = mx - mn;
            if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
            h = Math.round(h * 60 + 360) % 360;
            return { h: h, own: n === el };
        }
        return null;
    }
    function paint() {
        document.querySelectorAll(SEL).forEach(el => {
            const host = el.closest('button,.set-tile') || el;
            const c = glowOf(host), btnBg = c && c.own && host.tagName === 'BUTTON' && c.h >= 0 && !host.classList.contains('set-tile-head');
            if (btnBg) {
                // text sits ON a coloured button: fluorescent colour that contrasts with it (cool button -> neon yellow, warm -> neon cyan)
                const warm = c.h < 70 || c.h > 300;
                const neon = warm ? '#5ff6ff' : '#fbff3a';
                host.style.setProperty('--mtc', neon); host.style.setProperty('--mtg', warm ? 'rgba(95,246,255,.55)' : 'rgba(251,255,58,.5)'); host.style.setProperty('--mts', '#ffffff');
            } else {
                // text on the dark page: white, glowing in the tile's own colour; second line in that colour
                const g = c && c.h >= 0 ? `hsl(${c.h},100%,70%)` : '#67e8f9';
                host.style.setProperty('--mtc', '#ffffff'); host.style.setProperty('--mtg', g); host.style.setProperty('--mts', '#fbff3a');
            }
        });
    }
    let q = 0;
    const later = () => { if (!q) q = setTimeout(() => { q = 0; paint(); }, 120); };
    new MutationObserver(later).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    new MutationObserver(later).observe(document.body, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    window.addEventListener('load', later);
    later();
})();
