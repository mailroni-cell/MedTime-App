// M-246 (owner): the settings icons are glossy 3D capsules like the main screen: big, two-colour, tilted,
// each one floating on its own in a slow gentle sway. The tile's own colour becomes the capsule's colour.
(function () {
    'use strict';
    const S = 'html body #settings-page .set-grid';
    const css = document.createElement('style');
    css.textContent = `
    ${S}{--sp-o:min(20vw,10.4vh,88px)}
    html.lowvision ${S}{--sp-o:min(28vw,9.6vh,112px)}
    ${S} > .set-tile:not(.open){overflow:visible!important}
    /* rows as tall as their capsule and words (the old fixed rows let the words run into the next capsule), spread evenly */
    html body #settings-page .set-grid:not(:has(> .set-tile.open)){grid-template-rows:none!important;grid-auto-rows:auto!important;align-content:space-evenly!important}
    ${S} .set-tile-head .set-ico.sp-on{position:relative!important;width:var(--sp-o)!important;height:calc(var(--sp-o) * var(--sp-k,.8))!important;flex:0 0 auto!important;
      margin:calc(var(--sp-o) * .14) auto calc(var(--sp-o) * .12)!important;background:none!important;box-shadow:none!important;outline:none!important;border-radius:0!important;animation:none!important;
      overflow:visible!important;font-size:calc(var(--sp-o) * .44)!important;line-height:1!important;transform:none!important}
    ${S} .set-ico.sp-on::before,${S} .set-ico.sp-on::after{display:none!important}
    /* M-347 (owner): the words sat under the turning capsule and got cut: the capsule's box is as tall as the capsule at any angle, so the words start below it */
    html:not(.lowvision) ${S}{--sp-k:1.42}
    ${S} .set-tile-head .set-ico.sp-on:not(#mt-x){margin:0 auto calc(var(--sp-o) * .02)!important}
    ${S} .sp-pill{position:absolute;left:50%;top:50%;width:calc(var(--sp-o) * 1.3);height:calc(var(--sp-o) * .64);border-radius:999px;pointer-events:none;z-index:0;
      transform:translate(-50%,-50%) rotate(-24deg);will-change:transform;animation:spPill var(--sp-d,10s) ease-in-out infinite;animation-delay:var(--sp-dl,0s);
      background:linear-gradient(180deg,rgba(255,255,255,.85) 0,rgba(255,255,255,.3) 14%,rgba(255,255,255,0) 36%,rgba(0,0,0,0) 58%,rgba(0,0,0,.22) 80%,rgba(0,0,0,.5) 100%),
        linear-gradient(90deg,rgba(0,0,0,.28) 0,rgba(0,0,0,0) 12%,rgba(0,0,0,0) 88%,rgba(0,0,0,.28) 100%),
        linear-gradient(90deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 49.4%,rgba(0,0,0,.4) 49.4%,rgba(0,0,0,.4) 50.6%,#f8fafc 50.6%,#e2e8f0 100%),
        var(--sp-bg,linear-gradient(#64748b,#334155));
      box-shadow:inset 0 -8px 12px rgba(0,0,0,.3),inset 0 6px 9px rgba(255,255,255,.55),0 0 0 2.5px rgba(255,255,255,.92),0 0 0 5px rgba(0,0,0,.8),0 0 0 6px rgba(0,0,0,.35),0 14px 16px -4px rgba(0,0,0,.85),0 4px 22px rgba(0,0,0,.6)}
    ${S} .set-ico.sp-on > .mt-glint{inset:auto!important;top:50%!important;left:50%!important;width:calc(var(--sp-o) * 1.3)!important;height:calc(var(--sp-o) * .64)!important;
      margin:calc(var(--sp-o) * -.32) 0 0 calc(var(--sp-o) * -.65)!important;border-radius:999px!important;padding:3px!important;transform:rotate(-24deg)!important}
    ${S} .sp-pill::after{content:'';position:absolute;left:10%;top:9%;width:72%;height:20%;border-radius:999px;background:linear-gradient(rgba(255,255,255,.95),rgba(255,255,255,0))}
    ${S} .sp-sym{position:relative;z-index:2;display:inline-block;filter:drop-shadow(0 3px 2px rgba(0,0,0,.55)) drop-shadow(0 0 6px rgba(255,255,255,.35));
      will-change:transform;animation:spSym calc(var(--sp-d,10s) * 1.2) ease-in-out infinite;animation-delay:calc(var(--sp-dl,0s) - 1s)}
    @keyframes spPill{0%,100%{transform:translate(-50%,-50%) rotate(-24deg)}25%{transform:translate(calc(-50% + 2px),calc(-50% - 4px)) rotate(-20deg)}
      50%{transform:translate(calc(-50% - 2px),calc(-50% - 6px)) rotate(-27deg)}75%{transform:translate(calc(-50% - 3px),calc(-50% - 2px)) rotate(-22deg)}}
    @keyframes spSym{0%,100%{transform:translate(0,0) rotate(0deg)}35%{transform:translate(2px,-4px) rotate(4deg)}70%{transform:translate(-2px,-3px) rotate(-4deg)}}
    ${S} > .set-tile:nth-child(3n+1){--sp-d:9.5s;--sp-dl:-1s}${S} > .set-tile:nth-child(3n+2){--sp-d:11s;--sp-dl:-4s}${S} > .set-tile:nth-child(3n){--sp-d:8.8s;--sp-dl:-6s}
    ${S} > .set-tile:nth-child(4n){--sp-d:10.4s;--sp-dl:-2.5s}${S} > .set-tile:nth-child(5n){--sp-d:12s;--sp-dl:-7s}
    html.lowvision ${S} :is(.sp-pill,.sp-sym){animation:none!important}
    @media (prefers-reduced-motion: reduce){${S} :is(.sp-pill,.sp-sym){animation:none!important}}
    /* the tiles that stand out keep their own ring: Language gold, Help sky blue, Share pulsing green */
    ${S} > .set-tile:first-child .sp-pill{box-shadow:inset 0 -8px 12px rgba(0,0,0,.3),inset 0 6px 9px rgba(255,255,255,.55),0 0 0 3px #fde047,0 0 0 6px rgba(0,0,0,.8),0 14px 16px -4px rgba(0,0,0,.85),0 0 22px 4px rgba(250,204,21,.8)}
    ${S} > #tile-help .sp-pill{box-shadow:inset 0 -8px 12px rgba(0,0,0,.3),inset 0 6px 9px rgba(255,255,255,.55),0 0 0 3px #7dd3fc,0 0 0 6px rgba(0,0,0,.8),0 14px 16px -4px rgba(0,0,0,.85),0 0 22px 4px rgba(56,189,248,.8)}
    ${S} > #tile-share .sp-pill{box-shadow:inset 0 -8px 12px rgba(0,0,0,.3),inset 0 6px 9px rgba(255,255,255,.55),0 0 0 3px #a3ff6b,0 0 0 6px rgba(0,0,0,.8),0 14px 16px -4px rgba(0,0,0,.85),0 0 22px 5px #4ade80}
    ${S} > #tile-share .sp-pill::before{content:'';position:absolute;inset:-8px;border-radius:999px;border:3px solid #a3ff6b;box-shadow:0 0 16px 4px #4ade80;opacity:.2;animation:mtShP 3.4s ease-in-out infinite}
    html.lowvision ${S} > #tile-share .sp-pill::before{animation:none;opacity:.8}
    /* room for the bigger capsules: the turning gear goes, the title is a little smaller */
    html body #settings-page .settings-hero .hero-gear{display:none!important}
    html body #settings-page .settings-hero h2{font-size:min(1.7rem,7vw)!important;margin-top:2px!important}
    html body #settings-page .settings-hero{padding-bottom:6px!important}
    /* M-247 (owner): the back-to-main button sits low on the left, with a margin; the tiles keep room above it */
    html body #settings-page .settings-hero > .close-3d.mt-backbtn{position:fixed!important;top:auto!important;right:auto!important;inset-inline-end:auto!important;
      left:16px!important;bottom:calc(16px + env(safe-area-inset-bottom,0px))!important;margin:0!important;z-index:30!important}
    html body #settings-page:has(.set-tile.open) .settings-hero > .close-3d.mt-backbtn{display:none!important}
    html body #settings-page .set-grid.set-grid{padding-bottom:calc(84px + env(safe-area-inset-bottom,0px))!important}
    html.lowvision body #settings-page .set-grid.set-grid{padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important}
    /* M-286 (owner): the capsules are full, clear glass: the tile colour is a see-through body, the symbol floats inside it,
       a glass coat with a bright shine lies on top, and every capsule slowly turns round itself while a gleam sweeps over the glass */
    ${S} .set-ico.sp-on > .mt-glint{display:none!important}
    ${S} .sp-pill{opacity:.5;background:linear-gradient(90deg,rgba(0,0,0,.35) 0,rgba(0,0,0,0) 18%,rgba(0,0,0,0) 82%,rgba(0,0,0,.35) 100%),var(--sp-bg,linear-gradient(#64748b,#334155))!important;animation:spRoll var(--sp-r,22s) linear infinite!important;animation-delay:var(--sp-dl,0s)!important;
      box-shadow:inset 0 -8px 14px rgba(0,0,0,.35),inset 0 6px 12px rgba(255,255,255,.5),0 0 0 2px rgba(255,255,255,.95),0 10px 16px -4px rgba(0,0,0,.7)!important}
    ${S} .sp-pill::after{display:none}
    ${S} .sp-glass{position:absolute;left:50%;top:50%;right:auto;z-index:3;pointer-events:none;width:calc(var(--sp-o) * 1.3);height:calc(var(--sp-o) * .64);border-radius:999px;
      background:linear-gradient(180deg,rgba(255,255,255,.8) 0,rgba(255,255,255,.22) 20%,rgba(255,255,255,0) 42%,rgba(255,255,255,0) 72%,rgba(255,255,255,.18) 92%,rgba(255,255,255,.35) 100%),
        linear-gradient(100deg,rgba(255,255,255,0) 38%,rgba(255,255,255,.65) 50%,rgba(255,255,255,0) 62%) no-repeat;
      background-size:100% 100%,260% 100%;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.75),inset 0 0 12px rgba(255,255,255,.35);
      transform:translate(-50%,-50%) rotate(-24deg);will-change:transform;animation:spRoll var(--sp-r,22s) linear infinite,spSheen 4.2s ease-in-out infinite;animation-delay:var(--sp-dl,0s)}
    ${S} .sp-sym{z-index:2;filter:drop-shadow(0 2px 2px rgba(0,0,0,.5)) drop-shadow(0 0 8px rgba(255,255,255,.5))!important}
    /* M-294 (owner: the symbols looked cut off from the turning capsules, the words stood still): the symbol sits inside the glass and turns with it,
       and the words under it float gently in the same rhythm */
    ${S} .sp-sym{animation:spRollS var(--sp-r,22s) linear infinite!important;animation-delay:var(--sp-dl,0s)!important;transform-origin:50% 50%}
    @keyframes spRollS{0%{transform:rotate(-24deg)}100%{transform:rotate(336deg)}}
    ${S} > .set-tile:not(.open) .set-tile-head .set-txt{animation:spWords 5.5s ease-in-out infinite;animation-delay:var(--sp-dl,0s);will-change:transform}
    @keyframes spWords{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    html.lowvision ${S} .sp-sym,html.lowvision ${S} > .set-tile .set-tile-head .set-txt{animation:none!important}
    @keyframes spRoll{0%{transform:translate(-50%,-50%) rotate(-24deg)}100%{transform:translate(-50%,-50%) rotate(336deg)}}
    @keyframes spSheen{0%{background-position:0 0,130% 0}55%,100%{background-position:0 0,-30% 0}}
    ${S} > .set-tile:nth-child(3n+1){--sp-r:24s}${S} > .set-tile:nth-child(3n+2){--sp-r:20s}${S} > .set-tile:nth-child(3n){--sp-r:27s}${S} > .set-tile:nth-child(4n){--sp-r:22s}
    html.lowvision ${S} .sp-glass{animation:none}
    @media (prefers-reduced-motion: reduce){${S} .sp-glass{animation:none}}`;
    document.head.appendChild(css);

    function wrap() {
        document.querySelectorAll('#settings-page .set-grid .set-tile-head .set-ico:not(.sp-on)').forEach(o => {
            const bg = getComputedStyle(o).backgroundImage;
            if (bg && bg !== 'none') o.style.setProperty('--sp-bg', bg);
            else { const c = getComputedStyle(o).backgroundColor; if (c) o.style.setProperty('--sp-bg', 'linear-gradient(' + c + ',' + c + ')'); }
            const sym = document.createElement('span'); sym.className = 'sp-sym';
            while (o.firstChild) sym.appendChild(o.firstChild);
            const p = document.createElement('span'); p.className = 'sp-pill'; p.setAttribute('aria-hidden', 'true');
            const gl = document.createElement('span'); gl.className = 'sp-glass'; gl.setAttribute('aria-hidden', 'true'); // M-286: the clear glass coat over the symbol
            o.append(p, sym, gl); o.classList.add('sp-on');
        });
    }
    // the tilted capsule is taller than its box: shrink every capsule a little until no tile spills into the next row
    let busy = 0;
    // M-347 (owner: "the capsules change size and jump at random after a minute or two"): every text change in the
    // settings (backup time, version...) ran the fit again from full size. Now it runs again only when the screen,
    // the language, low-vision or the set of tiles changed.
    let lastKey = '';
    function fit() {
        const pg = document.getElementById('settings-page'), g = pg && pg.querySelector('.set-grid');
        if (busy || !g || !g.offsetParent && getComputedStyle(pg).display === 'none') return;
        const key = innerWidth + 'x' + innerHeight + document.documentElement.className + document.documentElement.lang + '|' + [...g.children].map(t => (t.offsetParent ? 1 : 0) + (t.classList.contains('open') ? 'o' : '')).join('');
        if (key === lastKey) return;
        lastKey = key;
        busy = 1; g.style.removeProperty('--sp-o');
        const tiles = [...g.children].filter(t => t.offsetParent && !t.classList.contains('open') && t.querySelector('.sp-on'));
        const spill = () => { const gb = Math.min(g.getBoundingClientRect().bottom - parseFloat(getComputedStyle(g).paddingBottom), innerHeight) + 1;
            return tiles.some(t => t.getBoundingClientRect().bottom > gb || [...t.querySelectorAll('.set-txt > *')].some(x => x.getBoundingClientRect().bottom > gb)); };
        let o = tiles[0] ? tiles[0].querySelector('.sp-on').getBoundingClientRect().width : 0;
        for (let i = 0; i < 14 && o > 52 && spill(); i++) { o -= 4; g.style.setProperty('--sp-o', o + 'px'); }
        busy = 0;
    }
    function start() {
        const g = document.querySelector('#settings-page .set-grid'); if (!g) return setTimeout(start, 300);
        wrap(); fit(); new MutationObserver(() => { wrap(); requestAnimationFrame(fit); }).observe(g, { childList: true, subtree: true, characterData: true });
        const pg = document.getElementById('settings-page');
        new MutationObserver(() => setTimeout(fit, 80)).observe(pg, { attributes: true, attributeFilter: ['class', 'style'] });
        new MutationObserver(() => setTimeout(fit, 80)).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'lang'] });
        addEventListener('resize', () => setTimeout(fit, 80));
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 400)); else setTimeout(start, 400);
})();
