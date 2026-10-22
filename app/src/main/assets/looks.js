// M-249 (owner): "My reminders" and every settings sub-menu get the look of the rest of the app:
// a deep glowing background, glossy 3D buttons with a dark outline, a small capsule for the panel icon and
// the round 3D font for titles. Only looks: sizes and layout stay as they are. Low vision keeps its own
// high-contrast colours; there only the title font and the room for the cards change.
(function () {
    'use strict';
    const N = 'html:not(.lowvision) body';
    const P = '#settings-page .set-tile.open .set-body';
    const BTN = `${P} button:not(.p-close):not(.mt-backbtn):not(.help-back):not(.page-done):not(.vc-play):not(.st-pm):not(.theme-sw), ${P} .sound-row`;
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
    /* the last card is never hidden under the Done button */
    html body #list-page #med-list{padding-bottom:calc(110px + env(safe-area-inset-bottom,0px))!important}
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
    ${N} #list-page #wk-bar .af-chip{border-radius:999px!important}`;
    document.head.appendChild(css);
})();
