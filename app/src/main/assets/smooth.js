// M-165 (owner 2026-10-21): background animation and opening video stuttered. Keep every running animation on the
// GPU only (move / fade), so nothing is re-drawn every frame, and hold the menu animations while the opening plays.
(function () {
    'use strict';
    const css = document.createElement('style');
    css.textContent = `
    /* while the opening video plays, the screen behind it stands still */
    /* the running heart line inside a button gets its own layer: the button text is not re-drawn with it */
    .ba-ecg, .home-card svg, h1.mt-logo .lg-ecg, h1.mt-logo .mt-word, .hello-line, .home-card button > span, .ba-txt { will-change: transform; }
    /* logo shine: plain layer (screen blending over the moving 3D background was re-mixed every frame) */
    h1.mt-logo .mt-shine { mix-blend-mode: normal !important; opacity: .55; }
    /* moon: the glow no longer changes every frame (that re-drew it 60 times a second) */
    @keyframes mtMoon { 0%,100% { transform: translateY(1px) rotate(-8deg) scale(1); } 50% { transform: translateY(-2px) rotate(8deg) scale(1.08); } }
    /* guide button: the pulse fades a glow layer instead of re-drawing the shadow */
    #guide-btn { animation: none !important; position: relative; }
    #guide-btn::after { content: ''; position: absolute; inset: -1px; border-radius: inherit; pointer-events: none;
        box-shadow: 0 0 14px rgba(74,222,128,1), 0 0 30px rgba(74,222,128,.6); opacity: 0; will-change: opacity; animation: mtGlFade 3s ease-in-out infinite; }
    @keyframes mtGlFade { 50% { opacity: 1; } }
    /* M-221 (owner): the heart line seemed to stick at the start of every beat: the light ran off the line's end, waited,
       then popped back whole at the start. Now it enters from before the start and leaves past the end, with no wait */
    html h1.mt-logo .lg-ecg .e-pulse { stroke-dasharray: 46 246 !important; animation: ecgLg 1.5s linear infinite !important;
        filter: drop-shadow(0 0 3px #ffffff) drop-shadow(0 0 10px #22d3ee) !important; }
    @keyframes ecgLg { from { stroke-dashoffset: 46; } to { stroke-dashoffset: -246; } }
    html #splash .sp-ecg .e-pulse { stroke-dasharray: 46 354 !important; animation: ecgSp 1.45s linear 3.4s infinite both !important; }
    @keyframes ecgSp { from { stroke-dashoffset: 46; } to { stroke-dashoffset: -354; } }`;
    document.head.appendChild(css);

    // M-166: while the opening plays, the endless menu animations behind it stand still; at the hand-over they come
    // back in small groups, not all in the same frame as the first 3D picture
    const held = new Set();
    const isSplash = el => !!(el && el.closest && el.closest('#splash'));
    const spOn = () => { const sp = document.getElementById('splash'); return sp && !sp.classList.contains('out') && sp.style.display !== 'none'; };
    function hold() {
        if (!document.getAnimations) return;
        document.getAnimations().forEach(a => {
            try { if (a.effect && a.effect.getTiming().iterations === Infinity && !isSplash(a.effect.target) && a.playState === 'running') { a.pause(); held.add(a); } } catch (e) { }
        });
    }
    function release() {
        const list = Array.from(held); held.clear();
        list.forEach((a, i) => setTimeout(() => { try { a.play(); } catch (e) { } }, 250 + Math.floor(i / 4) * 120));
    }
    if (spOn()) {
        hold();
        const iv = setInterval(() => { if (spOn()) hold(); else { clearInterval(iv); release(); } }, 400);
    }

    // logo shine: it ran non-stop on the main thread (SVG animation) and re-drew the 84-layer logo every frame.
    // Now one short sweep every 7 seconds, only while the main screen is visible.
    const g = document.getElementById('mtShine'), an = g && g.querySelector('animateTransform');
    if (g && an) {
        an.remove();
        const off = 'translate(-3000 0)'; g.setAttribute('gradientTransform', off);
        const sweep = () => {
            const spl = document.getElementById('splash');
            if (document.hidden || (spl && !spl.classList.contains('out'))) return;
            const t0 = performance.now();
            const step = now => {
                const k = Math.min((now - t0) / 1400, 1);
                g.setAttribute('gradientTransform', 'translate(' + Math.round(-3000 + 16000 * k) + ' 0)');
                if (k < 1) requestAnimationFrame(step); else g.setAttribute('gradientTransform', off);
            };
            requestAnimationFrame(step);
        };
        setInterval(sweep, 7000);
    }
})();
