// M-205 / M-209 (owner): main menu in a logical order, as big glossy 3D symbols floating over the background (no button frames).
// Row 1: Add reminder (biggest). Rows 2-3: My reminders, appointments, medicine check / vitals, serenity, first aid.
// M-210 (owner): a green ✓ on "My reminders" once every reminder due today was taken.
// The buttons themselves are not changed (same ids and handlers); they are only moved into the new box and restyled.
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const N = window.MedTimeNative;
    const ORDER = ['main-add', 'hm-now', 'appt-btn', 'vt-btn', 'sb-home', 'list-btn', 'relax-btn', 'fa-home']; // M-338 (owner): doctor appointments and measurements on top, my reminders below
    const ICO = '#hm-now .hn-ico, #main-add .ba-cross, #list-btn .lb-count, #appt-btn .ab-ico, #sb-home .sbh-ico, #vt-btn .rb-ico, #relax-btn .rb-ico, #fa-home .fah-ico';
    const css = document.createElement('style');
    const B = 'html .home-card .hm-float';
    const BT = B + ' > :is(#hm-now,#main-add,#list-btn,#appt-btn,#sb-home,#vt-btn,#relax-btn,#fa-home)'; // ids: beats the old per-button colours
    css.textContent = `
    /* M-231 (owner: nicer font): labels in the rounded bold Fredoka (Hebrew, Latin); Arabic and Russian in Rubik ExtraBold */
    @font-face{font-family:'MTBall';font-weight:700;font-display:swap;src:url(fonts/fredoka-hebrew-700-normal.woff2) format('woff2');unicode-range:U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F}
    @font-face{font-family:'MTBall';font-weight:700;font-display:swap;src:url(fonts/fredoka-latin-700-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}
    @font-face{font-family:'MTBall';font-weight:700;font-display:swap;src:url(fonts/rubik-arabic-800-normal.woff2) format('woff2');unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF}
    @font-face{font-family:'MTBall';font-weight:700;font-display:swap;src:url(fonts/rubik-cyrillic-800-normal.woff2) format('woff2');unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116}
    @font-face{font-family:'MTBall';font-weight:700;font-display:swap;src:url(fonts/rubik-latin-ext-800-normal.woff2) format('woff2');unicode-range:U+0100-02AF,U+0218-021B,U+1E00-1EFF}
    .home-card .hm-empty{display:none!important}
    .home-card > .hm-bar{display:flex;align-items:center;gap:10px;width:100%}
    .home-card > .hm-bar > #guide-btn{flex:1 1 auto;min-width:0;margin:0!important;padding-inline:10px!important;gap:6px!important}
    .home-card > .hm-bar > #guide-btn .gl-t{font-size:.98rem!important;white-space:nowrap}
    ${B}{display:grid;grid-template-columns:repeat(6,1fr);gap:var(--hm-gap,14px) 6px;width:100%;align-items:start}
    ${BT}{all:unset;box-sizing:border-box;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;
      min-width:0;min-height:0!important;height:auto!important;width:100%!important;margin:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important;outline:none;cursor:pointer;
      text-align:center!important;grid-column:span 2;-webkit-tap-highlight-color:transparent}
    ${BT}::before,${BT}::after{display:none!important}
    ${B} > #main-add{grid-column:1 / -1}
    ${B}.hm-has-now > #main-add,${B} > #hm-now{grid-column:span 3}
    ${B} > button:nth-child(2){animation-delay:-.7s}${B} > button:nth-child(3){animation-delay:-1.4s}${B} > button:nth-child(4){animation-delay:-2.1s}
    ${B} > button:nth-child(5){animation-delay:-2.8s}${B} > button:nth-child(6){animation-delay:-3.5s}${B} > button:nth-child(7){animation-delay:-1s}
    @keyframes hmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    ${B} > button:active{animation-play-state:paused;transform:scale(.93)}
    /* the symbol: a glossy 3D ball with a soft shadow under it */
    html .home-card .hm-float :is(${ICO}){position:relative;display:grid!important;place-items:center!important;box-sizing:border-box!important;
      width:var(--hm-o,118px)!important;height:var(--hm-o,118px)!important;min-width:var(--hm-o,118px)!important;flex:0 0 auto!important;margin:0!important;border-radius:50%!important;transform:none!important;
      background:radial-gradient(ellipse 30% 9% at 50% 84%,rgba(0,0,0,.42),rgba(0,0,0,0) 100%),radial-gradient(circle at 34% 26%,#fff 0,var(--c1) 22%,var(--c2) 62%,var(--c3) 100%)!important;border:0!important;
      box-shadow:inset 0 -8px 14px rgba(0,0,0,.35),inset 0 5px 8px rgba(255,255,255,.45),0 0 0 3px rgba(255,255,255,.92),0 0 0 6px rgba(0,0,0,.6),0 14px 18px -6px rgba(0,0,0,.75),0 0 24px var(--c2)!important;will-change:auto!important}
    html .home-card .hm-float :is(${ICO})::after{content:'';position:absolute;left:22%;top:9%;width:42%;height:24%;border-radius:50%;background:linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,0));pointer-events:none}
    /* M-241 (owner): every menu symbol sits on a glossy two-colour 3D capsule (a pill), tilted, instead of a ball */
    html body .home-card .hm-float :is(${ICO}){background:none!important;box-shadow:none!important;border-radius:0!important}
    html body .home-card .hm-float :is(${ICO})::after{display:none!important}
    /* M-242 (owner): bigger, thicker capsules that wrap the symbol and look round (cylinder light and shade, rounded ends) */
    html body .home-card .hm-float .hm-pill{position:absolute;left:50%;top:50%;width:calc(var(--hm-o,118px) * 1.36);height:calc(var(--hm-o,118px) * .72);border-radius:999px;pointer-events:none;z-index:0;
      transform:translate(-50%,-50%) rotate(-24deg);will-change:transform;animation:hmPill var(--hm-pd,9s) ease-in-out infinite;animation-delay:var(--hm-pdl,0s);
      background:linear-gradient(180deg,rgba(255,255,255,.9) 0,rgba(255,255,255,.35) 14%,rgba(255,255,255,0) 36%,rgba(0,0,0,0) 58%,rgba(0,0,0,.22) 80%,rgba(0,0,0,.5) 100%),
        linear-gradient(90deg,rgba(0,0,0,.28) 0,rgba(0,0,0,0) 12%,rgba(0,0,0,0) 88%,rgba(0,0,0,.28) 100%),
        linear-gradient(90deg,var(--c2) 0,var(--c2) 49.4%,rgba(0,0,0,.4) 49.4%,rgba(0,0,0,.4) 50.6%,#f8fafc 50.6%,#e2e8f0 100%),
        linear-gradient(180deg,var(--c1),var(--c2) 45%,var(--c3));
      box-shadow:inset 0 -9px 14px rgba(0,0,0,.3),inset 0 7px 10px rgba(255,255,255,.55),0 0 0 3px rgba(255,255,255,.92),0 0 0 6px rgba(0,0,0,.8),0 0 0 7px rgba(0,0,0,.35),0 18px 18px -4px rgba(0,0,0,.85),0 5px 26px rgba(0,0,0,.6),0 0 26px var(--c2)} /* M-248: dark outline and deeper shadow, like the settings capsules */
    /* M-243 (owner): each capsule floats on its own, slowly, with a very gentle sway; the label stays still */
    @keyframes hmPill{0%,100%{transform:translate(-50%,-50%) rotate(-24deg)}25%{transform:translate(calc(-50% + 3px),calc(-50% - 6px)) rotate(-19deg)}
      50%{transform:translate(calc(-50% - 2px),calc(-50% - 9px)) rotate(-27deg)}75%{transform:translate(calc(-50% - 4px),calc(-50% - 3px)) rotate(-21deg)}}
    html body .home-card .hm-float > :nth-child(1){--hm-pd:9.5s;--hm-pdl:-1s}html body .home-card .hm-float > :nth-child(2){--hm-pd:11s;--hm-pdl:-4s}
    html body .home-card .hm-float > :nth-child(3){--hm-pd:8.5s;--hm-pdl:-6s}html body .home-card .hm-float > :nth-child(4){--hm-pd:10.5s;--hm-pdl:-2.5s}
    html body .home-card .hm-float > :nth-child(5){--hm-pd:12s;--hm-pdl:-7s}html body .home-card .hm-float > :nth-child(6){--hm-pd:9s;--hm-pdl:-5s}
    html body .home-card .hm-float > :nth-child(7){--hm-pd:11.5s;--hm-pdl:-3s}html body .home-card .hm-float > :nth-child(8){--hm-pd:10s;--hm-pdl:-8s}
    /* M-245 (owner): the labels float too, on their own, a little behind the capsule, like bodies drifting in a liquid */
    @keyframes hmLbl{0%,100%{transform:translate(0,0) rotate(0deg)}30%{transform:translate(2px,-4px) rotate(1deg)}60%{transform:translate(-2px,-6px) rotate(-1.2deg)}80%{transform:translate(-3px,-2px) rotate(.6deg)}}
    ${BT} > :not(.ba-cross):not(.lb-count):not(.ab-ico):not(.sbh-ico):not(.rb-ico):not(.fah-ico):not(.hn-ico):not(.mt-glint){will-change:transform;
      animation:hmLbl calc(var(--hm-pd,9s) * 1.25) ease-in-out infinite;animation-delay:calc(var(--hm-pdl,0s) - 1.2s)}
    html.lowvision ${BT} > *{animation:none!important}
    html.lowvision body .home-card .hm-float .hm-pill{animation:none}
    html body .home-card .hm-float .hm-pill::after{content:'';position:absolute;left:10%;top:9%;width:72%;height:20%;border-radius:999px;background:linear-gradient(rgba(255,255,255,.95),rgba(255,255,255,0))}
    html body .home-card .hm-float .hm-pill::before{content:'';position:absolute;left:14%;bottom:12%;width:60%;height:10%;border-radius:999px;background:linear-gradient(rgba(255,255,255,0),rgba(255,255,255,.35))}
    html body .home-card .hm-float :is(${ICO}) > :not(.hm-pill){position:relative;z-index:2}
    html body .home-card .hm-float #fa-home .hm-pill{box-shadow:0 0 0 4px #f4ff1a,0 0 0 7.5px rgba(0,0,0,.8),0 16px 16px -4px rgba(0,0,0,.85),0 0 28px 6px #ff1744}
    /* M-223 (owner): the symbols are solid 3D objects (a stack of layers gives them thickness) that turn all the way round,
       slowly, as if floating in liquid or in space, with a gentle tilt up and down. Each ball has its own speed and start */
    html .home-card .hm-float :is(${ICO}){perspective:300px}
    html .home-card .hm-float .hm-3d{display:grid;place-items:center;transform-style:preserve-3d;will-change:transform;animation:hmSpin var(--hm-sp,13s) cubic-bezier(.45,.05,.55,.95) infinite;animation-delay:var(--hm-dl,0s)}
    html body .home-card .hm-float :is(#main-add,#hm-now,#list-btn,#appt-btn,#sb-home,#vt-btn,#relax-btn,#fa-home) .hm-3d > *{grid-area:1/1;display:block;font-size:calc(var(--hm-o,118px) * .66)!important;width:auto!important;height:auto!important;line-height:1!important;font-style:normal;
      filter:none!important;text-shadow:none!important;-webkit-text-stroke:0!important;animation:none!important;margin:0!important;backface-visibility:visible;flex:none!important}
    html body .home-card .hm-float #main-add .hm-3d > svg{width:calc(var(--hm-o) * .64)!important;height:calc(var(--hm-o) * .64)!important}
    /* M-256 (owner: thin stripes showed on the side when a symbol turned edge-on): 13 layers 0.7px apart make one solid body */
    ${(() => { let o = ''; for (let k = 1; k <= 13; k++) { const z = (4.2 - (k - 1) * 0.7).toFixed(1), b = k === 1 || k === 13 ? '' : 'filter:brightness(' + (0.45 + Math.abs(7 - k) * 0.025).toFixed(3) + ')!important;';
        o += `html body .home-card .hm-float :is(#main-add,#hm-now,#list-btn,#appt-btn,#sb-home,#vt-btn,#relax-btn,#fa-home) .hm-3d > .hm-l${k}{transform:translateZ(${z}px)!important;${b}}\n`; } return o; })()}
    /* M-268 (owner): no medicine shapes on the main screen any more: only the solid 3D symbols, bigger, floating on the calm background */
    html body .home-card .hm-float .hm-pill,${B} > button > .mt-glint{display:none!important}
    html body .home-card .hm-float :is(#main-add,#hm-now,#list-btn,#appt-btn,#sb-home,#vt-btn,#relax-btn,#fa-home) .hm-3d > *{font-size:calc(var(--hm-o,118px) * .82)!important}
    html body .home-card .hm-float #main-add .hm-3d > svg{width:calc(var(--hm-o) * .8)!important;height:calc(var(--hm-o) * .8)!important}
    html body .home-card .hm-float #list-btn .lb-count{font-size:calc(var(--hm-o,118px) * .66)!important}
    html body .home-card .hm-float #list-btn .lb-count > .lb-time{position:absolute;left:50%;bottom:calc(var(--hm-o,118px) * -.04);transform:translateX(-50%);z-index:3;white-space:nowrap;
      font-family:inherit;font-size:calc(var(--hm-o,118px) * .17)!important;font-weight:900;line-height:1.2;color:#fff!important;padding:1px 7px;border-radius:999px;
      background:rgba(30,27,75,.88);border:1.5px solid #c4b5fd;text-shadow:none!important;box-shadow:0 2px 6px rgba(0,0,0,.6)}
    /* M-269 (owner: a flat edge showed when a symbol turned side-on): the symbols sway and tilt up to 38° each way but never turn edge-on,
       so they always look full and round; they still drift gently in space */
    html .home-card .hm-float .hm-3d{animation-name:hmSway!important}
    @keyframes hmSway{0%,100%{transform:translate3d(0,calc(var(--hm-o,118px) * .02),16px) rotateX(10deg) rotateY(-30deg) rotateZ(-6deg)}
      25%{transform:translate3d(calc(var(--hm-o,118px) * -.06),calc(var(--hm-o,118px) * -.06),26px) rotateX(-12deg) rotateY(12deg) rotateZ(5deg)}
      50%{transform:translate3d(calc(var(--hm-o,118px) * .05),calc(var(--hm-o,118px) * -.08),18px) rotateX(14deg) rotateY(38deg) rotateZ(-4deg)}
      75%{transform:translate3d(calc(var(--hm-o,118px) * .06),calc(var(--hm-o,118px) * .04),24px) rotateX(-8deg) rotateY(-14deg) rotateZ(7deg)}}
    /* M-269 (owner: the words got in the way): the names stay, but quieter: smaller, a soft shadow instead of the thick 3D letters, and they stay still */
    ${BT} :is(.hn-t,.ba-txt,.lb-title,.ab-title,.ab-txt,.sbh-txt,.rb-txt,.fah-txt,b):not(#mt-x){font-size:calc(var(--hm-t,1.4rem) * .78)!important;color:rgba(255,255,255,.9)!important;
      text-shadow:0 1px 2px rgba(0,0,0,.95),0 0 8px rgba(0,0,0,.8)!important;-webkit-text-stroke:0!important;padding:2px 4px 0!important;animation:none!important}
    ${B} > #main-add .ba-txt:not(#mt-x){font-size:calc(var(--hm-tb,1.65rem) * .8)!important}
    html body .home-card .hm-float #fa-home :is(b,.fah-txt):not(#mt-x){color:#fde047!important;text-shadow:0 1px 2px rgba(0,0,0,.95),0 0 8px rgba(0,0,0,.8)!important}
    html.lowvision ${BT} :is(.hn-t,.ba-txt,.lb-title,.ab-title,.ab-txt,.sbh-txt,.rb-txt,.fah-txt,b):not(#mt-x){font-size:var(--hm-t,1.4rem)!important;color:#fff!important}
    /* M-239 (owner): the symbols float freely in every direction, as in space: drifting up/down/sideways, tilting on all axes and turning round */
    @keyframes hmSpin{0%{transform:translate3d(calc(var(--hm-o,118px) * 0),calc(var(--hm-o,118px) * .02),16px) rotateX(10deg) rotateY(0deg) rotateZ(-6deg)}20%{transform:translate3d(calc(var(--hm-o,118px) * -.07),calc(var(--hm-o,118px) * -.06),26px) rotateX(-14deg) rotateY(80deg) rotateZ(5deg)}45%{transform:translate3d(calc(var(--hm-o,118px) * .05),calc(var(--hm-o,118px) * -.09),18px) rotateX(16deg) rotateY(170deg) rotateZ(-4deg)}65%{transform:translate3d(calc(var(--hm-o,118px) * .08),calc(var(--hm-o,118px) * .03),28px) rotateX(-8deg) rotateY(250deg) rotateZ(8deg)}85%{transform:translate3d(calc(var(--hm-o,118px) * -.04),calc(var(--hm-o,118px) * .06),20px) rotateX(12deg) rotateY(320deg) rotateZ(-3deg)}100%{transform:translate3d(calc(var(--hm-o,118px) * 0),calc(var(--hm-o,118px) * .02),16px) rotateX(10deg) rotateY(360deg) rotateZ(-6deg)}}
    html .home-card .hm-float > :nth-child(2){--hm-sp:12.5s;--hm-dl:-3s}html .home-card .hm-float > :nth-child(3){--hm-sp:10s;--hm-dl:-6s}
    html .home-card .hm-float > :nth-child(4){--hm-sp:13s;--hm-dl:-2s}html .home-card .hm-float > :nth-child(5){--hm-sp:11.5s;--hm-dl:-8s}
    html .home-card .hm-float > :nth-child(6){--hm-sp:12s;--hm-dl:-4.5s}html .home-card .hm-float > :nth-child(7){--hm-sp:10.5s;--hm-dl:-1s}html .home-card .hm-float > :nth-child(8){--hm-sp:14s;--hm-dl:-7s}
    /* M-224 (owner): the light that runs round a menu now and then follows the ball, not the invisible square around it */
    ${BT}{position:relative!important}
    ${B} > button > .mt-glint{inset:auto!important;top:calc(var(--hm-o,118px) * .14)!important;left:50%!important;width:calc(var(--hm-o,118px) * 1.36)!important;height:calc(var(--hm-o,118px) * .72)!important;margin-left:calc(var(--hm-o,118px) * -.68)!important;border-radius:999px!important;padding:3px!important;transform:rotate(-24deg)}
    html .home-card .hm-float #main-add{--hm-o:var(--hm-big,140px)}
    /* M-262 (owner): "add reminder" is a round 3D tablet instead of a capsule: a thick disc with a rim, a dividing line and a shine */
    html body .home-card .hm-float #main-add .hm-pill{width:calc(var(--hm-o) * 1.02);height:calc(var(--hm-o) * 1.02);border-radius:50%;animation-name:hmTab;
      background:radial-gradient(circle at 34% 26%,rgba(255,255,255,.95) 0,rgba(255,255,255,.35) 16%,rgba(255,255,255,0) 34%),
        linear-gradient(transparent calc(50% - 1.5px),rgba(0,0,0,.32) calc(50% - 1.5px),rgba(0,0,0,.32) calc(50% + .5px),rgba(255,255,255,.45) calc(50% + .5px),rgba(255,255,255,.45) calc(50% + 2px),transparent calc(50% + 2px)),
        radial-gradient(circle at 50% 40%,var(--c1) 0,var(--c2) 52%,var(--c3) 100%);
      box-shadow:inset 0 -10px 16px rgba(0,0,0,.35),inset 0 8px 12px rgba(255,255,255,.55),inset 0 0 0 5px rgba(255,255,255,.18),0 7px 0 var(--c3),0 8px 0 rgba(0,0,0,.55),
        0 0 0 3px rgba(255,255,255,.92),0 7px 0 3px rgba(255,255,255,.6),0 0 0 6px rgba(0,0,0,.8),0 7px 0 6px rgba(0,0,0,.8),0 22px 20px -4px rgba(0,0,0,.85),0 0 26px var(--c2)}
    html body .home-card .hm-float #main-add .hm-pill::after{left:18%;top:9%;width:46%;height:22%;transform:rotate(-20deg)}
    html body .home-card .hm-float #main-add .hm-pill::before{display:none}
    @keyframes hmTab{0%,100%{transform:translate(-50%,-50%) rotate(-14deg)}25%{transform:translate(calc(-50% + 3px),calc(-50% - 6px)) rotate(-8deg)}
      50%{transform:translate(calc(-50% - 2px),calc(-50% - 9px)) rotate(-18deg)}75%{transform:translate(calc(-50% - 4px),calc(-50% - 3px)) rotate(-10deg)}}
    html.lowvision body .home-card .hm-float #main-add .hm-pill{transform:translate(-50%,-50%) rotate(-14deg)}
    ${B} > #main-add > .mt-glint{top:calc(var(--hm-o) * -.01)!important;width:calc(var(--hm-o) * 1.02)!important;height:calc(var(--hm-o) * 1.02)!important;margin-left:calc(var(--hm-o) * -.51)!important;border-radius:50%!important;transform:none}
    /* M-263 (owner): every main button has its own medicine shape: reminders a lozenge, medicine check a pill bottle, measurements a caplet,
       calm a soft gel; doctor and first aid keep the capsule. Size, corners and tilt come from --sw/--sh/--sr/--rt */
    html body .home-card .hm-float :is(#list-btn,#sb-home,#vt-btn,#relax-btn) .hm-pill{width:calc(var(--hm-o) * var(--sw));height:calc(var(--hm-o) * var(--sh));border-radius:var(--sr);animation-name:hmShape}
    @keyframes hmShape{0%,100%{transform:translate(-50%,-50%) rotate(var(--rt))}25%{transform:translate(calc(-50% + 3px),calc(-50% - 6px)) rotate(calc(var(--rt) + 5deg))}
      50%{transform:translate(calc(-50% - 2px),calc(-50% - 9px)) rotate(calc(var(--rt) - 3deg))}75%{transform:translate(calc(-50% - 4px),calc(-50% - 3px)) rotate(calc(var(--rt) + 3deg))}}
    html.lowvision body .home-card .hm-float :is(#list-btn,#sb-home,#vt-btn,#relax-btn) .hm-pill{transform:translate(-50%,-50%) rotate(var(--rt))}
    /* lozenge: a rounded square standing on its corner, bevelled edges */
    #list-btn{--sw:.84;--sh:.84;--sr:26%;--rt:45deg}
    html body .home-card .hm-float #list-btn .hm-pill{background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.85) 0,rgba(255,255,255,.2) 22%,rgba(255,255,255,0) 40%),radial-gradient(circle at 50% 50%,var(--c1) 0,var(--c2) 55%,var(--c3) 100%);
      box-shadow:inset 0 0 0 calc(var(--hm-o) * .06) rgba(255,255,255,.22),inset -6px -8px 12px rgba(0,0,0,.35),inset 5px 6px 10px rgba(255,255,255,.5),0 0 0 3px rgba(255,255,255,.92),0 0 0 6px rgba(0,0,0,.8),0 0 0 7px rgba(0,0,0,.35),8px 14px 16px -2px rgba(0,0,0,.8),0 0 24px var(--c2)}
    html body .home-card .hm-float #list-btn .hm-pill::after{left:14%;top:14%;width:44%;height:16%;transform:rotate(-45deg) translate(-12%,30%)}
    html body .home-card .hm-float #list-btn .hm-pill::before{display:none}
    /* pill bottle: coloured bottle with a white label and a ridged white cap */
    #sb-home{--sw:.74;--sh:.92;--sr:18% / 14%;--rt:-9deg}
    html body .home-card .hm-float #sb-home .hm-pill{overflow:visible;margin-top:calc(var(--hm-o) * .06);
      background:linear-gradient(90deg,rgba(0,0,0,.35) 0,rgba(0,0,0,0) 16%,rgba(255,255,255,.45) 26%,rgba(255,255,255,0) 40%,rgba(0,0,0,0) 78%,rgba(0,0,0,.4) 100%),
        linear-gradient(180deg,var(--c2) 0,var(--c2) 26%,#f8fafc 26%,#e2e8f0 70%,var(--c2) 70%,var(--c3) 100%);
      box-shadow:inset 0 -8px 12px rgba(0,0,0,.3),0 0 0 3px rgba(255,255,255,.92),0 0 0 6px rgba(0,0,0,.8),0 0 0 7px rgba(0,0,0,.35),0 16px 16px -4px rgba(0,0,0,.85),0 0 24px var(--c2)}
    html body .home-card .hm-float #sb-home .hm-pill::before{left:8%;right:auto;bottom:auto;top:calc(var(--hm-o) * -.2);width:84%;height:calc(var(--hm-o) * .2);border-radius:7px 7px 3px 3px;
      background:linear-gradient(90deg,rgba(0,0,0,.3),rgba(0,0,0,0) 20%,rgba(255,255,255,.6) 32%,rgba(0,0,0,0) 50%,rgba(0,0,0,.35)),repeating-linear-gradient(90deg,#f8fafc 0 4px,#cbd5e1 4px 6px);
      box-shadow:0 0 0 3px rgba(255,255,255,.92),0 0 0 6px rgba(0,0,0,.8)}
    html body .home-card .hm-float #sb-home .hm-pill::after{left:18%;top:4%;width:12%;height:88%}
    /* caplet: a long tablet with flat sides and a dividing line */
    #vt-btn{--sw:1.3;--sh:.58;--sr:calc(var(--hm-o) * .22);--rt:-24deg}
    html body .home-card .hm-float #vt-btn .hm-pill{background:linear-gradient(180deg,rgba(255,255,255,.75) 0,rgba(255,255,255,.2) 18%,rgba(255,255,255,0) 40%,rgba(0,0,0,0) 62%,rgba(0,0,0,.35) 100%),
        linear-gradient(90deg,transparent calc(50% - 1.5px),rgba(0,0,0,.35) calc(50% - 1.5px),rgba(0,0,0,.35) calc(50% + .5px),rgba(255,255,255,.5) calc(50% + .5px),rgba(255,255,255,.5) calc(50% + 2px),transparent calc(50% + 2px)),
        linear-gradient(180deg,var(--c1),var(--c2) 45%,var(--c3))}
    html body .home-card .hm-float #vt-btn .hm-pill::before{display:none}
    /* soft gel: a clear, glowing oval with liquid inside */
    #relax-btn{--sw:1.18;--sh:.8;--sr:50%;--rt:-18deg}
    html body .home-card .hm-float #relax-btn .hm-pill{background:radial-gradient(ellipse 60% 40% at 34% 26%,rgba(255,255,255,.95) 0,rgba(255,255,255,.25) 40%,rgba(255,255,255,0) 70%),
        radial-gradient(ellipse at 50% 70%,color-mix(in srgb,var(--c1) 70%,transparent) 0,color-mix(in srgb,var(--c2) 75%,transparent) 50%,color-mix(in srgb,var(--c3) 90%,transparent) 100%);
      box-shadow:inset 0 -10px 18px color-mix(in srgb,var(--c3) 80%,transparent),inset 0 0 18px rgba(255,255,255,.45),0 0 0 3px rgba(255,255,255,.92),0 0 0 6px rgba(0,0,0,.8),0 0 0 7px rgba(0,0,0,.35),0 16px 16px -4px rgba(0,0,0,.85),0 0 30px var(--c2)}
    html body .home-card .hm-float #relax-btn .hm-pill::after{left:16%;top:10%;width:40%;height:22%}
    html body .home-card .hm-float #relax-btn .hm-pill::before{left:30%;bottom:10%;width:46%;height:14%;background:radial-gradient(rgba(255,255,255,.55),rgba(255,255,255,0) 70%)}
    /* the light that runs round each one follows its shape */
    ${B} > :is(#list-btn,#sb-home,#vt-btn,#relax-btn) > .mt-glint{top:calc(var(--hm-o) * (.5 - var(--sh) / 2))!important;width:calc(var(--hm-o) * var(--sw))!important;height:calc(var(--hm-o) * var(--sh))!important;
      margin-left:calc(var(--hm-o) * var(--sw) / -2)!important;border-radius:var(--sr)!important;transform:rotate(var(--rt))}
    html .home-card .hm-float #list-btn .lb-count{color:#fff!important;font-size:calc(var(--hm-o,118px) * .46)!important;font-weight:900!important;animation:none!important;text-shadow:0 1px 0 #e2e8f0,0 2px 0 #cbd5e1,0 3px 0 #94a3b8,0 4px 0 #64748b,0 5px 0 #475569,0 7px 8px rgba(0,0,0,.6)!important;min-height:0!important}
    #main-add{--c1:#bbf7d0;--c2:#10b981;--c3:#065f46}
    #hm-now{--c1:#fef9c3;--c2:#f59e0b;--c3:#78350f;--hm-o:var(--hm-big,120px)}
    #hm-now .hn-ico{animation:hnPulse 1.6s ease-in-out infinite}
    @keyframes hnPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
    ${B} > #hm-now .hn-t{font-size:var(--hm-tb,1.65rem)!important}
    #list-btn{--c1:#e9d5ff;--c2:#8b5cf6;--c3:#4c1d95}
    #appt-btn{--c1:#ccfbf1;--c2:#14b8a6;--c3:#134e4a}
    #sb-home{--c1:#bfdbfe;--c2:#3b82f6;--c3:#1e3a8a}
    #vt-btn{--c1:#fbcfe8;--c2:#ec4899;--c3:#831843}
    #relax-btn{--c1:#c7d2fe;--c2:#6366f1;--c3:#312e81}
    #fa-home{--c1:#fecaca;--c2:#ef4444;--c3:#7f1d1d}
    /* labels: bright text with a dark outline and a glow in the symbol's colour */
    ${BT} :is(.hn-t,.ba-txt,.lb-title,.ab-title,.ab-txt,.sbh-txt,.rb-txt,.fah-txt,b){display:flex;flex-direction:column;align-items:center;font-size:var(--hm-t,1.4rem)!important;line-height:1.15!important;letter-spacing:.2px;
      color:#fff!important;font-family:'MTBall','MTUI',sans-serif!important;font-weight:700!important;letter-spacing:.3px!important;--mtg:var(--c2)!important;text-shadow:0 1px 0 #e2e8f0,0 2px 0 #94a3b8,0 3px 0 #64748b,0 4px 0 #334155,0 5px 0 #1e293b,0 6px 6px rgba(0,0,0,.85),0 0 16px var(--c2),0 0 3px #000!important;-webkit-text-stroke:.6px rgba(0,0,0,.55)!important;margin:0!important;padding:0 4px 4px!important;border-radius:0!important;background:none!important;min-width:0;white-space:normal!important}
    ${B} > #main-add .ba-txt{font-size:var(--hm-tb,1.65rem)!important}
    ${BT} :is(.hn-s,small,.ab-sub,.lb-next){font-size:.95rem!important;font-weight:800!important;color:#fde68a!important;text-shadow:0 0 2px #000,0 1px 2px #000!important;opacity:1!important}
    ${B} #sb-home small,${B} #fa-home small,${B} .ba-ecg,${B} .ab-count{display:none!important}
    ${B} #list-btn{flex-wrap:nowrap!important}
    ${B} #list-btn .lb-next{flex-basis:auto!important}
    ${B} #list-btn.hm-next .lb-next{display:none!important}
    html body .home-card .hm-float #list-btn.hm-next .lb-count{display:flex!important;flex-direction:column!important;gap:0!important;line-height:1!important}
    html body .home-card .hm-float #list-btn.hm-next .lb-count small{font-size:calc(var(--hm-o,118px) * .2)!important;line-height:1!important;color:inherit!important;text-shadow:none!important;-webkit-text-stroke:0!important;margin-bottom:2px}
    html body .home-card .hm-float #list-btn.hm-next .lb-count b{font-family:'MTBall','MTUI',sans-serif!important;font-weight:700!important;font-size:calc(var(--hm-o,118px) * .27)!important;line-height:1!important;color:#fff!important;direction:ltr;
      text-shadow:0 1px 0 #e2e8f0,0 2px 0 #94a3b8,0 3px 0 #475569,0 4px 5px rgba(0,0,0,.7)!important;-webkit-text-stroke:0!important}
    /* M-240 (owner): no "no appointments" line; when there are appointments the line glows fluorescent green */
    ${B} #appt-btn:not(:has(.ab-count)) .ab-sub{display:none!important}
    html body .home-card .hm-float #appt-btn:has(.ab-count) .ab-sub{color:#a3ff6b!important;font-size:1.05rem!important;text-shadow:0 0 2px #000,0 1px 2px #000,0 0 10px #4ade80,0 0 18px #22c55e!important}
    /* M-210: all of today's reminders taken */
    #list-btn.hm-done .lb-count::before{content:'✓';position:absolute;right:-12px;bottom:-8px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
      font-size:1.2rem;font-weight:900;color:#fff;background:radial-gradient(circle at 35% 30%,#86efac,#16a34a 60%,#14532d);box-shadow:0 0 0 3px rgba(0,0,0,.5),0 0 14px #22c55e;z-index:2}
    html.fit1 .home-card{--hm-o:108px;--hm-big:126px}
    html.fit2 .home-card{--hm-o:98px;--hm-big:112px;--hm-gap:10px;--hm-t:1.3rem;--hm-tb:1.5rem}
    html.fit3 .home-card{--hm-o:88px;--hm-big:100px;--hm-t:1.2rem;--hm-tb:1.4rem}
    html.fit6 .home-card{--hm-o:70px;--hm-big:82px;--hm-gap:6px;--hm-t:1.1rem;--hm-tb:1.25rem}
    /* M-217 (owner): SOS is fluorescent and impossible to miss: neon red ball, neon-yellow ring, a beating glow halo */
    html body .home-card .hm-float #fa-home{--c1:#fff1f2;--c2:#ff1744;--c3:#b0001e}
        html body .home-card .hm-float #fa-home .fah-ico::before{content:'';position:absolute;inset:-14px;border-radius:50%;pointer-events:none;
      background:radial-gradient(circle,rgba(255,23,68,0) 52%,rgba(255,40,80,.85) 62%,rgba(244,255,26,.55) 70%,rgba(255,23,68,0) 78%);animation:faNeon 1.4s ease-in-out infinite;will-change:transform,opacity}
    @keyframes faNeon{0%,100%{opacity:.35;transform:scale(.92)}50%{opacity:1;transform:scale(1.1)}}
    html body .home-card .hm-float #fa-home :is(b,.fah-txt){color:#f4ff1a!important;text-shadow:0 1px 0 #fde047,0 2px 0 #ca8a04,0 3px 0 #a16207,0 4px 0 #7f1d1d,0 5px 0 #450a0a,0 6px 6px rgba(0,0,0,.85),0 0 18px #ff1744!important;background:none!important}
    /* M-236 (owner): the tour line has no frame: a soft, blurred green halo, a hand that drifts in space and the 3D words */
    html body .home-card #guide-btn{border:0!important;box-shadow:none!important;overflow:visible!important;padding:6px 10px!important;
      background:radial-gradient(ellipse 58% 75% at 50% 50%,rgba(74,222,128,.28),rgba(34,197,94,.1) 55%,rgba(34,197,94,0) 78%)!important}
    html body .home-card #guide-btn::after{display:none!important}
    html body .home-card #guide-btn .gl-h{font-size:2rem!important;filter:none!important;text-shadow:0 0 14px #4ade80,0 0 4px #bbf7d0;display:inline-block;animation:glDrift 5.5s ease-in-out infinite!important;will-change:transform}
    @keyframes glDrift{0%,100%{transform:translate(0,0) rotate(-12deg)}25%{transform:translate(-6px,-7px) rotate(8deg) scale(1.08)}50%{transform:translate(3px,-2px) rotate(-4deg)}75%{transform:translate(6px,-8px) rotate(14deg) scale(1.05)}}
    html body .home-card #guide-btn .gl-t{font-family:'MTBall','MTUI',sans-serif!important;font-weight:700!important;font-size:1.15rem!important;color:#dcfce7!important;letter-spacing:.3px;
      text-shadow:0 1px 0 #bbf7d0,0 2px 0 #4ade80,0 3px 0 #15803d,0 4px 5px rgba(0,0,0,.8),0 0 14px rgba(74,222,128,.7)!important;-webkit-text-stroke:0!important;overflow:visible!important}
    html.lowvision body .home-card #guide-btn{background:radial-gradient(ellipse 60% 80% at 50% 50%,rgba(0,0,0,.75),rgba(0,0,0,0) 80%)!important}
    html.lowvision body .home-card #guide-btn .gl-t{color:#fff!important;font-size:1.3rem!important}
    html.hm-slim h1.mt-logo{font-size:min(3.7rem,calc((100vw - 28px) / 6.2))!important;margin-bottom:.35em!important}
        @media (prefers-reduced-motion: reduce){${B} > button{animation:none}}
    html.lowvision ${BT}{animation:none!important}
    /* M-273 (owner): bottom row of four equal round buttons: settings, reading glasses, SOS, close; the hand sits in the menu where first aid was */
    ${B} > #fa-home{display:none!important}
    ${B} > #guide-btn{justify-self:center;align-self:center}
    html body #lv-btn{left:37%!important;bottom:calc(31px + env(safe-area-inset-bottom))!important}
    #sos-btn{position:fixed;left:63%;bottom:calc(30px + env(safe-area-inset-bottom));z-index:5;width:66px;height:66px;border-radius:50%;padding:0;display:grid;place-items:center;overflow:visible;
      border:3px solid #fde047;background:radial-gradient(circle at 35% 28%,#fecaca,#ef4444 40%,#7f1d1d 88%);transform:translateX(-50%);animation:sosFloat 3.6s ease-in-out infinite;animation-delay:-2.6s;
      box-shadow:inset 0 3px 4px rgba(255,255,255,.6),inset 0 -6px 10px rgba(69,10,10,.6),0 6px 0 #450a0a,0 12px 20px rgba(0,0,0,.55),0 0 22px rgba(250,204,21,.7)}
    #sos-btn .sos-ico{font-size:2.2rem;line-height:1;filter:drop-shadow(0 2px 0 rgba(0,0,0,.45))}
    #sos-btn::after{content:attr(data-lbl);position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:9px;white-space:nowrap;font-size:.95rem;font-weight:900;color:#fde047;text-shadow:0 1px 2px #000,0 0 8px rgba(0,0,0,.8)}
    #sos-btn:active{transform:translateX(-50%) translateY(4px)}
    @keyframes sosFloat{0%,100%{transform:translateX(-50%)}50%{transform:translateX(-50%) translateY(-5px)}}
    html.lowvision #sos-btn{animation:none}
    body:has(.settings-page.open) #sos-btn{display:none}
    /* M-274 (owner): the "Add reminder" words sit close under the cross, so the symbols below have more room */
    ${B} > #main-add .ba-txt:not(#mt-x){margin-top:calc(var(--hm-big,140px) * -.16)!important}
    /* M-278 (owner): SOS beats like a heart and glows fluorescent: neon-yellow ring, red neon glow and a ring that spreads out with every beat */
    html body #sos-btn{animation:sosBeat 1.3s ease-in-out infinite!important;border-color:#f4ff1a!important;
      box-shadow:inset 0 3px 4px rgba(255,255,255,.6),inset 0 -6px 10px rgba(69,10,10,.6),0 6px 0 #450a0a,0 0 0 3px rgba(244,255,26,.55),0 0 18px #ff1744,0 0 34px rgba(244,255,26,.75)!important}
    html body #sos-btn::before{content:'';position:absolute;inset:-5px;border-radius:50%;border:3px solid #f4ff1a;box-shadow:0 0 14px #ff1744,inset 0 0 10px #ff1744;pointer-events:none;animation:sosRing 1.3s ease-out infinite}
    @keyframes sosBeat{0%,100%{transform:translateX(-50%) scale(1)}14%{transform:translateX(-50%) scale(1.13)}28%{transform:translateX(-50%) scale(.98)}42%{transform:translateX(-50%) scale(1.08)}60%{transform:translateX(-50%) scale(1)}}
    @keyframes sosRing{0%{opacity:.95;transform:scale(1)}70%,100%{opacity:0;transform:scale(1.55)}}
    html.lowvision body #sos-btn{animation:sosBeat 1.3s ease-in-out infinite!important}
    /* M-279 (owner: "the glasses button is not clear at all"): a big "A+" on it and its name under it, like the buttons beside it */
    html body #lv-btn .lv-g{display:none!important}
    html body #lv-btn{overflow:visible!important}
    html body #lv-btn::before{content:'A+';font-family:'MTBall','MTUI',sans-serif;font-weight:900;font-size:1.75rem;line-height:1;color:#422006;letter-spacing:-1px;text-shadow:0 1px 0 rgba(255,255,255,.6)}
    html.lowvision body #lv-btn::before{color:#000}
    html body #lv-btn::after{content:attr(data-lbl);position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:9px;white-space:nowrap;font-size:.95rem;font-weight:900;color:#fef08a;text-shadow:0 1px 2px #000,0 0 8px rgba(0,0,0,.8)}
    /* M-281 (owner): the hand is a full-size symbol like the others, with the same glow round it, and it is alive by itself:
       it squashes, stretches, bends and taps (a soft jelly hand), while it floats gently on its spot */
    html body .home-card .hm-float > #guide-btn:not(#mt-x){width:var(--hm-o,118px)!important;height:var(--hm-o,118px)!important;animation:glFloat 7s ease-in-out infinite!important;align-self:start}
    html body .home-card .hm-float > #guide-btn:not(#mt-x) > .gl-real{font-size:calc(var(--hm-o,118px) * .78)!important;transform-origin:50% 92%;animation:glJelly 3.6s ease-in-out infinite!important;
      filter:hue-rotate(285deg) saturate(1.9) brightness(1.08) drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(0 0 2px #000) drop-shadow(0 0 9px #67e8f9)!important}
    html body .home-card .hm-float > #guide-btn:not(#mt-x)::before{top:100%;left:-20%;right:-20%;padding-top:2px;font-family:inherit;font-weight:900;font-size:calc(var(--hm-t,1.4rem) * .78)!important;color:rgba(255,255,255,.9)!important;
      text-shadow:0 1px 2px rgba(0,0,0,.95),0 0 8px rgba(0,0,0,.8)!important;animation:none!important}
    html body .home-card .hm-float > #guide-btn:not(#mt-x)::after{left:44%;top:16%}
    @keyframes glFloat{0%,100%{transform:translate(0,0)}25%{transform:translate(-4px,-6px)}50%{transform:translate(3px,-9px)}75%{transform:translate(5px,-3px)}}
    @keyframes glJelly{0%,100%{transform:rotate(-7deg) scale(1,1)}9%{transform:rotate(-2deg) scale(1.1,.88)}17%{transform:rotate(5deg) scale(.93,1.1) translateY(-5%)}
      27%{transform:rotate(-3deg) skewX(7deg) scale(1.03,.97)}40%{transform:rotate(9deg) skewX(-8deg) scale(.98,1.03)}52%{transform:rotate(-4deg) scale(1,1)}
      58%{transform:rotate(-4deg) scale(1.12,.86) translateY(5%)}63%{transform:rotate(-4deg) scale(.92,1.1) translateY(-7%)}68%{transform:rotate(-4deg) scale(1.1,.88) translateY(4%)}
      74%{transform:rotate(-2deg) scale(.95,1.06) translateY(-3%)}84%{transform:rotate(6deg) skewY(5deg)}92%{transform:rotate(-9deg) skewX(4deg)}}
    html.lowvision body .home-card .hm-float > #guide-btn:not(#mt-x),html.lowvision body .home-card .hm-float > #guide-btn:not(#mt-x) > .gl-real{animation:none!important}
    /* M-282 (owner): the camera has the same glow round it as the other symbols */
    html body .home-card .hm-float #sb-home .hm-3d > *:not(#mt-x){text-shadow:0 0 2px #000,0 1px 2px #000,0 0 9px var(--mtg,#67e8f9)!important}
    /* M-283 (owner): the greeting has no frame: soft handwriting like the name, floating slowly across the screen as if in space */
    html body #hello-line.hello-line:not(#mt-x){background:none!important;border:0!important;box-shadow:none!important;padding:2px 12px!important;margin:0 auto 6px!important;
      font-family:'MTName','MTUI',sans-serif!important;font-weight:400!important;font-size:1.45rem!important;letter-spacing:.4px;animation:hlSpace 22s ease-in-out infinite;will-change:transform}
    html body #hello-line.hello-line:not(#mt-x) :is(span,i,b):not(#mt-x){font-family:'MTName','MTUI',sans-serif!important;font-weight:400!important;-webkit-text-stroke:0!important}
    html body #hello-line.hello-line:not(#mt-x) > :not(b):not(#mt-x),html body #hello-line.hello-line:not(#mt-x){color:#f5f3ff!important;text-shadow:0 1px 2px rgba(0,0,0,.9),0 0 10px rgba(167,139,250,.75),0 0 22px rgba(34,211,238,.35)!important}
    html.fit6 body #hello-line.hello-line:not(#mt-x){font-size:1.15rem!important;margin-bottom:2px!important}
    @keyframes hlSpace{0%,100%{transform:translate(0,0) rotate(-1deg)}20%{transform:translate(-18px,-5px) rotate(.5deg)}45%{transform:translate(-6px,4px) rotate(1.5deg)}
      70%{transform:translate(20px,-3px) rotate(-.5deg)}85%{transform:translate(10px,5px) rotate(-1.5deg)}}
    html.lowvision body #hello-line.hello-line:not(#mt-x){animation:none}
    /* M-280 (owner: "the symbols are pressed against the bottom"): the empty space under the title shrinks, so the menu moves up and keeps clear room above the bottom row */
    html body .hero-space.hero-space:not(#mt-x){height:clamp(0px,1vh,10px)!important;min-height:0!important}
    html body #lv-btn{direction:ltr}
    /* M-289 (owner): the next time sits inside the 📋, on its paper, not under it */
    html body .home-card .hm-float #list-btn .hm-3d > .lb-time:not(#mt-x){position:static;grid-area:1/1;align-self:center;justify-self:center;left:auto;bottom:auto;
      transform:translate3d(0,calc(var(--hm-o,118px) * .1),5px)!important;font-family:'MTBall','MTUI',sans-serif;font-size:calc(var(--hm-o,118px) * .17)!important;font-weight:900;
      color:#0f172a!important;-webkit-text-stroke:0!important;text-shadow:0 0 1px #fff!important;opacity:1!important;filter:none!important;background:none;border:0;box-shadow:none;padding:0;letter-spacing:-.5px;direction:ltr}
    /* M-292: the big green tick on the paper; the old small badge goes */
    html body .home-card .hm-float #list-btn.hm-done .hm-3d > .lb-time:not(#mt-x){font-family:sans-serif;font-size:calc(var(--hm-o,118px) * .42)!important;color:#16a34a!important;
      text-shadow:0 1px 0 #14532d,0 0 6px rgba(255,255,255,.9)!important;transform:translate3d(0,calc(var(--hm-o,118px) * .08),5px)!important}
    html body #list-btn.hm-done .lb-count:not(#mt-x)::before{display:none!important}
    /* M-290 (owner): the hand moves away from its neighbour (to the outer side of its place) */
    ${B} > #guide-btn:not(#mt-x){justify-self:center;position:relative!important;inset-inline-start:calc(var(--hm-o,118px) * .3)}
    /* M-291 (owner): all the symbols higher still; the bottom row stays where it is */
    html body .home-card .hm-float:not(#mt-x){margin-top:-6px}
    /* M-320 (owner): greeting and the add-reminder cross a little higher */
    html body #hello-line.hello-line:not(#mt-x){margin-top:-28px!important}
    /* M-321 (owner): even layout for every symbol, no cut-offs: rows are centred (a row of 2 sits in the middle) */
    html body .home-card .hm-float:not(#mt-x){display:flex!important;flex-wrap:wrap!important;justify-content:center!important;align-items:flex-start!important;row-gap:calc(var(--hm-gap,14px) + 10px)!important;column-gap:0!important}
    html body .home-card .hm-float:not(#mt-x) > #list-btn[style*="display: none"]{display:none!important}
    html body .home-card .hm-float:not(#mt-x) > :is(#hm-now,#main-add,#list-btn,#appt-btn,#sb-home,#vt-btn,#relax-btn,#fa-home){flex:0 0 33.333%!important;width:33.333%!important;max-width:33.333%!important}
    html body .home-card .hm-float:not(#mt-x) > #main-add{flex-basis:100%!important;width:100%!important;max-width:100%!important}
    html body .home-card .hm-float.hm-has-now:not(#mt-x) > :is(#main-add,#hm-now){flex-basis:50%!important;width:50%!important;max-width:50%!important}
    html body .home-card .hm-float:not(#mt-x) > #guide-btn{flex:0 0 auto!important;margin-inline:calc((33.333% - var(--hm-o,118px)) / 2)!important;inset-inline-start:0!important}
    /* M-322 (owner): appointment: a short "when" sits on the symbol itself; no long line under the name */
    html body .home-card .hm-float #appt-btn .ab-sub:not(#mt-x){display:none!important}
    html body .home-card .hm-float #appt-btn .ab-when{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%);z-index:5;white-space:nowrap;unicode-bidi:plaintext;
      padding:2px 9px;border-radius:999px;background:rgba(2,20,12,.82);border:2px solid #4ade80;color:#d9ffe7;font-family:'MTBall','MTUI',sans-serif;font-weight:700;
      font-size:calc(var(--hm-o,118px) * .15);line-height:1.15;box-shadow:0 0 10px #22c55e,0 2px 6px rgba(0,0,0,.7);text-shadow:0 1px 2px #000;pointer-events:none}
    /* M-332 (owner, M-334 internet update test): no appointment count on the symbol; greeting and the add-reminder cross higher still, together */
    html body .home-card .hm-float #appt-btn .ab-count:not(#mt-x){display:none!important}
    /* M-340 (owner): no picture next to the greeting; the greeting in a warm, personal colour (soft peach-amber)
       with a dark edge so it reads on any background, without shouting */
    html body #hello-line.hello-line .hl-ico:not(#mt-x){display:none!important}
    html body #hello-line.hello-line:not(#mt-x) > :not(b):not(#mt-x),html body #hello-line.hello-line:not(#mt-x){color:#ffd8a8!important;
      text-shadow:0 1px 1px rgba(0,0,0,.95),0 0 3px rgba(0,0,0,.85),0 0 12px rgba(251,146,60,.45)!important}
    html body #hello-line.hello-line > b:not(#mt-x){background:none!important;-webkit-text-fill-color:#ffb870!important;color:#ffb870!important;filter:none!important;
      text-shadow:0 1px 1px rgba(0,0,0,.95),0 0 3px rgba(0,0,0,.85),0 0 14px rgba(251,146,60,.6)!important}
    /* M-339 (owner): no appointment badge at all on the symbol (also the when-pill) */
    html body .home-card .hm-float #appt-btn :is(.ab-when,.ab-count,.lb-count):not(#mt-x){display:none!important}
    html body #hello-line.hello-line:not(#mt-x){margin-top:-46px!important}
    html body .home-card .hm-float:not(#mt-x) > #main-add{margin-top:-18px!important}`;
    document.head.appendChild(css);
    // M-279: the name under the A+ button, in the app language
    const lvLbl = () => { const b = $('lv-btn'); if (!b) return; const i = Math.max(0, ['he', 'ar', 'ro', 'fr', 'en', 'ru'].indexOf(typeof LANG === 'string' ? LANG : 'he'));
        const t = ['אותיות גדולות', 'خط كبير', 'Litere mari', 'Gros texte', 'Big letters', 'Крупный шрифт'][i]; if (b.dataset.lbl !== t) b.dataset.lbl = t; };
    lvLbl(); setInterval(lvLbl, 2000);

    function sosBtn() {
        const gear = $('gear-btn'); if (!gear || $('sos-btn')) return;
        const b = document.createElement('button'); b.type = 'button'; b.id = 'sos-btn'; b.className = 'sos-btn'; b.dataset.lbl = 'SOS'; b.setAttribute('aria-label', 'SOS');
        b.innerHTML = '<span class="sos-ico">🚑</span>';
        b.onclick = () => { const f = $('fa-home'); if (f) f.click(); };
        gear.parentNode.insertBefore(b, gear.nextSibling);
    }
    function arrange() {
        const card = document.querySelector('.home-card'), add = $('main-add');
        if (!card || !add) return false;
        let box = card.querySelector('.hm-float');
        if (!box) { box = document.createElement('div'); box.className = 'hm-float'; card.insertBefore(box, card.firstChild); }
        ORDER.forEach(id => { const b = $(id); if (b && b.parentNode !== box) box.appendChild(b); });
        // keep the order even if a script inserted a button later
        ORDER.map($).filter(Boolean).forEach(b => box.appendChild(b));
        // M-232 (owner): the share button sits at the end of the tour button's line, as one unit
        let bar = card.querySelector(':scope > .hm-bar');
        if (!bar) { bar = document.createElement('div'); bar.className = 'hm-bar'; }
        card.appendChild(bar);
        // M-273 (owner): the tour hand takes the first-aid place in the menu; first aid moves down to the bottom row as SOS
        const gl = $('guide-btn'); if (gl && (gl.parentNode !== box || gl.nextSibling)) box.appendChild(gl);
        sosBtn();
        card.querySelectorAll('.nav-row, .home-pair, .hm-meds, .hm-grid').forEach(d => d.classList.toggle('hm-empty', !d.querySelector('button')));
        markDone(); make3d();
        if (typeof window.fitMain === 'function') setTimeout(window.fitMain, 60);
        return ORDER.every(id => id === 'hm-now' || $(id));
    }

    // M-241: a pill shape under every symbol (a real element, so the ball's own ::before / ::after stay free)
    function addPills() {
        document.querySelectorAll(ICO.split(',').map(x => '.home-card .hm-float ' + x.trim()).join(',')).forEach(o => {
            if (!o.querySelector(':scope > .hm-pill')) { const p = document.createElement('span'); p.className = 'hm-pill'; p.setAttribute('aria-hidden', 'true'); o.insertBefore(p, o.firstChild); }
        });
    }
    // M-223: wrap each symbol in a turning box with 5 copies at different depths (front and back bright, the middle darker = its edge)
    function make3d() {
        document.querySelectorAll(ICO.split(',').map(x => '.home-card .hm-float ' + x.trim()).join(',')).forEach(o => {
            if (o.querySelector('.hm-3d')) return;
            const sym = o.querySelector(':scope > i, :scope > svg'); if (!sym) return;
            const w = document.createElement('span'); w.className = 'hm-3d'; w.setAttribute('aria-hidden', 'true');
            sym.replaceWith(w);
            for (let k = 1; k <= 13; k++) { const c = k === 1 ? sym : sym.cloneNode(true); c.classList.add('hm-l' + k); w.appendChild(c); }
        });
        addPills();
    }
    // M-210: ✓ when every reminder due today has a "taken" entry for today
    function markDone() {
        const btn = $('list-btn'); if (!btn) return;
        let done = false;
        try {
            const meds = JSON.parse(localStorage.getItem('medtime_list') || '[]');
            const log = N && typeof N.getLog === 'function' ? JSON.parse(N.getLog()) || [] : [];
            const d = new Date(), day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            const due = meds.filter(m => !m.days || !m.days.length || m.days.includes(d.getDay()));
            const taken = new Set(log.filter(e => e.d === day && e.s === 'taken').map(e => String(e.id % 100000000)));
            done = due.length > 0 && due.every(m => taken.has(String(m.id))); // weekend copies have id + 100000000
        } catch (e) { }
        btn.classList.toggle('hm-done', done);
        // M-233 (owner): the ball shows the time of the next reminder instead of how many there are; the line under it goes
        const c = btn.querySelector('.lb-count'), nx = btn.querySelector('.lb-next');
        const m = nx && /\b\d{1,2}:\d{2}\b/.exec(nx.textContent || '');
        // M-272 (owner: the "My reminders" symbol was tiny): a full-size 3D 📋 like its neighbours; the next time sits on it as a small tag
        const want = done ? '✓' : m ? m[0] : ''; // M-292 (owner): all of today taken = a big green ✓ on the paper instead of the time
        if (c && (c.dataset.t !== want || !c.querySelector(':scope > i, :scope > .hm-3d'))) {
            c.dataset.t = want; c.innerHTML = '<i>📋</i>' + (want ? '<b class="lb-time"></b>' : '');
            if (want) c.querySelector('.lb-time').textContent = want;
            make3d();
            // M-289 (owner): the time is written on the clipboard's paper itself and moves with it
            const t = c.querySelector(':scope > .lb-time'), w = c.querySelector('.hm-3d'); if (t && w) w.appendChild(t);
        }
        btn.classList.toggle('hm-next', !!m);
        addPills();
    }
    // M-211 (owner approved idea): "💊 Taken now" ball, only in the 30 minutes before a reminder that was not taken yet today
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const NT = {
        t: ['לקחתי עכשיו', 'تناولته الآن', 'Am luat acum', 'Je l’ai pris', 'Taken now', 'Принял сейчас'],
        q: ['לסמן שלקחת עכשיו את התרופות של {t}? התזכורת לא תצלצל.', 'هل تناولت أدوية الساعة {t} الآن؟ لن يرن التذكير.', 'Marcați ca luate acum medicamentele de la {t}? Mementoul nu va mai suna.', 'Noter comme pris les médicaments de {t} ? Le rappel ne sonnera pas.', 'Mark the {t} medicines as taken now? The reminder will not ring.', 'Отметить лекарства на {t} как принятые? Напоминание не прозвенит.'],
        ok: ['✅ נרשם. כל הכבוד!', '✅ تم التسجيل. أحسنت!', '✅ Notat. Bravo!', '✅ Noté. Bravo !', '✅ Saved. Well done!', '✅ Записано. Молодец!'],
        yes: ['כן, לקחתי', 'نعم، تناولته', 'Da, le-am luat', 'Oui, pris', 'Yes, taken', 'Да, принял'],
        no: ['עוד לא', 'ليس بعد', 'Încă nu', 'Pas encore', 'Not yet', 'Ещё нет']
    };
    const nt = k => NT[k][li()];
    function soon() {
        try {
            if (!N || typeof N.takenEarly !== 'function') return null;
            const meds = JSON.parse(localStorage.getItem('medtime_list') || '[]');
            const log = typeof N.getLog === 'function' ? JSON.parse(N.getLog()) || [] : [];
            const d = new Date(), day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
            const taken = new Set(log.filter(e => e.d === day && e.s === 'taken').map(e => String(e.id % 100000000)));
            const nowMin = d.getHours() * 60 + d.getMinutes(), wk = d.getDay() >= 5;
            let best = null;
            meds.forEach(m => {
                if (m.days && m.days.length && !m.days.includes(d.getDay())) return;
                if (taken.has(String(m.id))) return;
                try { if (N.isTakenEarly && N.isTakenEarly(m.id)) return; } catch (e) { }
                const t = (wk && typeof wkTimeOf === 'function' && wkTimeOf(m)) || m.time || '';
                const p = t.split(':'); if (p.length < 2) return;
                const left = (+p[0]) * 60 + (+p[1]) - nowMin;
                if (left > 0 && left <= 30 && (!best || left < best.left)) best = { m: m, t: t, left: left };
            });
            return best;
        } catch (e) { return null; }
    }
    function drawNow() {
        const box = document.querySelector('.home-card .hm-float'); if (!box) return;
        const s = soon();
        let b = $('hm-now');
        if (!s) { if (b) b.remove(); box.classList.remove('hm-has-now'); return; }
        if (!b) {
            b = document.createElement('button'); b.type = 'button'; b.id = 'hm-now';
            b.innerHTML = '<span class="hn-ico"><i>💊</i></span><span class="hn-t"></span><span class="hn-s"></span>'; setTimeout(make3d, 0);
            box.insertBefore(b, $('main-add') ? $('main-add').nextSibling : box.firstChild);
        }
        b.querySelector('.hn-t').textContent = nt('t');
        b.querySelector('.hn-s').textContent = '⏰ ' + s.t;
        b.onclick = () => {
            if (navigator.vibrate) navigator.vibrate(12);
            const go = window.mtDialog ? mtDialog({ icon: '💊', text: nt('q').replace('{t}', s.t), ok: nt('yes'), cancel: nt('no') }) : Promise.resolve(true);
            go.then(v => {
                if (!v) return;
                let t = ''; try { t = N.takenEarly(s.m.id) || ''; } catch (e) { }
                if (t && window.mtAlert) mtAlert(nt('ok'), '✅');
                try { if (typeof renderMeds === 'function') renderMeds(); } catch (e) { }
                drawNow(); markDone();
            });
        };
        box.classList.add('hm-has-now');
        if (typeof window.fitMain === 'function') setTimeout(window.fitMain, 60);
    }
    setInterval(drawNow, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) drawNow(); });
    setTimeout(drawNow, 1200);
    window.mtHomeDone = markDone;
    document.addEventListener('visibilitychange', () => { if (!document.hidden) markDone(); });
    setInterval(markDone, 60000);
    // the list button is redrawn when reminders change: put the ✓ back
    const lb = $('list-btn'); if (lb) new MutationObserver(() => { if (!lb.classList.contains('hm-busy')) markDone(); }).observe(lb, { childList: true });

    // M-216 (owner): the balls always stand out from the chosen background. A ball whose colour is close to one of the
    // theme's colours gets another colour from this set, the one furthest from the theme (first aid always stays red)
    const PAL = [['#bbf7d0', '#10b981', '#065f46'], ['#fef9c3', '#f59e0b', '#78350f'], ['#e9d5ff', '#8b5cf6', '#4c1d95'], ['#ccfbf1', '#14b8a6', '#134e4a'],
        ['#bfdbfe', '#3b82f6', '#1e3a8a'], ['#fbcfe8', '#ec4899', '#831843'], ['#c7d2fe', '#6366f1', '#312e81'], ['#ecfccb', '#84cc16', '#365314'],
        ['#fed7aa', '#f97316', '#7c2d12'], ['#fef08a', '#eab308', '#713f12'], ['#a5f3fc', '#06b6d4', '#164e63'], ['#f5d0fe', '#d946ef', '#701a75']];
    const hue = hex => {
        const m = /#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(hex || ''); if (!m) return -1;
        const [r, g, bl] = m.slice(1).map(x => parseInt(x, 16) / 255), mx = Math.max(r, g, bl), mn = Math.min(r, g, bl), d = mx - mn;
        if (d < 0.12) return -1;
        let h = mx === r ? ((g - bl) / d) % 6 : mx === g ? (bl - r) / d + 2 : (r - g) / d + 4;
        return (h * 60 + 360) % 360;
    };
    const far = (h, list) => list.reduce((m, t) => Math.min(m, Math.min(Math.abs(h - t), 360 - Math.abs(h - t))), 360);
    let lastTheme = '';
    function contrast() {
        const T = window.MED_THEMES || [], gA = document.documentElement.style.getPropertyValue('--gA').replace(/\s/g, ''); // set when a theme is shown or previewed
        let th = gA && T.find(t => { const m = /#?(..)(..)(..)/.exec(t.ga); return m && m.slice(1).map(x => parseInt(x, 16)).join(',') === gA; });
        if (!th) try { th = T[window.medEffectiveTheme()]; } catch (e) { }
        if (!th) return;
        const key = th.ga + th.gb; if (key === lastTheme && document.querySelector('.hm-float [data-hmc]')) return; lastTheme = key;
        const tH = [th.ga, th.gb].concat(th.neb || [], th.l || [], th.hero || []).map(hue).filter(h => h >= 0);
        const used = [];
        ORDER.filter(id => id !== 'fa-home').map($).filter(Boolean).forEach(b => {
            b.style.removeProperty('--c1'); b.style.removeProperty('--c2'); b.style.removeProperty('--c3');
            const own = getComputedStyle(b).getPropertyValue('--c2').trim();
            if (far(hue(own), tH) >= 40 && far(hue(own), used) >= 25) { used.push(hue(own)); b.dataset.hmc = '0'; return; }
            const sc = p => Math.min(far(hue(p[1]), tH), 90) + 0.8 * Math.min(far(hue(p[1]), used), 90);
            const pick = PAL.filter(p => !used.includes(hue(p[1]))).sort((p, q) => sc(q) - sc(p))[0] || PAL[0];
            ['--c1', '--c2', '--c3'].forEach((v, i) => b.style.setProperty(v, pick[i]));
            used.push(hue(pick[1])); b.dataset.hmc = '1';
        });
    }
    new MutationObserver(() => setTimeout(contrast, 50)).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    setTimeout(contrast, 800); setInterval(contrast, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(contrast, 300); });
    // M-220 (owner): a soft "pop" sound and a short buzz when a ball is pressed
    let ac = null;
    function pop() {
        if (navigator.vibrate) try { navigator.vibrate(14); } catch (e) { }
        try {
            ac = ac || new (window.AudioContext || window.webkitAudioContext)();
            const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
            o.type = 'sine'; o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(1040, t + 0.07);
            g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
            o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.14);
        } catch (e) { }
    }
    document.addEventListener('pointerdown', e => { const b = e.target.closest && e.target.closest('.home-card .hm-float > button'); if (b) pop(); }, true);

    // M-222 (owner: "still not big enough"): the balls take all the room there is. The screen fit first runs with small
    // balls (so it hides nothing that is not needed), then the balls grow until the menu reaches the bottom buttons
    // the lowest thing of the menu: the balls, or the tour button under them when it is shown
    function low() {
        const box = document.querySelector('.home-card .hm-float'), gl = $('guide-btn');
        let b = box ? box.getBoundingClientRect().bottom : 0;
        if (gl && gl.offsetParent && getComputedStyle(gl).display !== 'none') b = Math.max(b, gl.getBoundingClientRect().bottom);
        return b;
    }
    function sizeBalls() {
        const box = document.querySelector('.home-card .hm-float'), ex = $('exit-btn');
        if (!box || !ex || !box.offsetParent || ex.getBoundingClientRect().height < 10) return false; // M-226: another screen is open: keep the size
        const lim = ex.getBoundingClientRect().top - 60, colW = box.clientWidth / 3 - 8;
        let o = Math.min(150, Math.floor(colW / 1.02)); // M-264 (owner): bigger still // M-239/M-242: as big as the room allows; the capsule is wider than the box
        const set = () => { box.style.setProperty('--hm-o', o + 'px'); box.style.setProperty('--hm-big', Math.round(o * 1.15) + 'px'); };
        set();
        while (o > 64 && (low() > lim || document.body.scrollHeight > innerHeight + 2)) { o -= 4; set(); }
        return true;
    }
    function hookFit() {
        const fm = window.fitMain; if (typeof fm !== 'function' || fm.mtBalls) return;
        let sig = '';
        const look = () => {
            const card = document.querySelector('.home-card');
            return innerWidth + 'x' + innerHeight + (document.documentElement.classList.contains('lowvision') ? 'L' : '') + (document.querySelector('.settings-page.open') ? 'S' : '') + '|' +
                (card ? card.querySelectorAll('*:not(.mt-glint)').length + ':' + card.textContent.length + ':' + card.offsetHeight + ':' + document.body.scrollHeight : '');
        };
        const w = function () {
            if (look() === sig) return;
            const box = document.querySelector('.home-card .hm-float');
            const ex = $('exit-btn'), shown = box && box.offsetParent && ex && ex.getBoundingClientRect().height >= 10 && !document.querySelector('.settings-page.open'); // fixed button: no offsetParent
            if (!shown) return; // measured only when the main screen is really in front (else the balls shrank, then grew back)
            const o0 = box.style.getPropertyValue('--hm-o');
            box.style.setProperty('--hm-o', '70px'); box.style.setProperty('--hm-big', '80px');
            fm.apply(this, arguments);
            // M-228 (owner: the animated tour button disappeared): the balls shrink first; the tour button / greeting go only if even the smallest balls do not fit
            const R = document.documentElement, had5 = R.classList.contains('fit5'), had6 = R.classList.contains('fit6');
            R.classList.remove('fit5', 'fit6');
            if (!sizeBalls() && o0) box.style.setProperty('--hm-o', o0);
            const over = () => low() > ex.getBoundingClientRect().top - 60 || document.body.scrollHeight > innerHeight + 2;
            // M-235 (owner: low vision lost the tour button): greeting goes first, then the title gets smaller, the tour button only last
            R.classList.remove('hm-slim');
            if ((had5 || had6) && over()) { R.classList.add('fit6'); sizeBalls();
                if (over()) { R.classList.add('hm-slim'); sizeBalls(); if (over()) { R.classList.add('fit5'); sizeBalls(); } } }
            sig = look();
        };
        w.mtBalls = true; window.fitMain = w;
    }
    hookFit(); setTimeout(() => { hookFit(); window.fitMain && window.fitMain(); }, 600);
    // M-226 (owner): back on the main screen (from settings, low vision on/off, a page or serenity) it is measured again at once
    const refit = () => setTimeout(() => window.fitMain && window.fitMain(), 30);
    new MutationObserver(refit).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const sp = document.getElementById('settings-page'); if (sp) new MutationObserver(refit).observe(sp, { attributes: true, attributeFilter: ['class'] });

    // a button that redraws itself (appointments, reminders) gets its 3D symbol and pill back
    let m3q = 0;
    const watch3d = () => { const box = document.querySelector('.home-card .hm-float'); if (!box || box.dataset.w3) return; box.dataset.w3 = '1';
        new MutationObserver(() => { if (!m3q) m3q = requestAnimationFrame(() => { m3q = 0; make3d(); }); }).observe(box, { childList: true, subtree: true }); };
    setTimeout(watch3d, 1000);
    let n = 0;
    const tick = () => { const done = arrange(); if (!done && ++n < 20) setTimeout(tick, 300); };
    tick(); setTimeout(arrange, 2500);
    window.mtHomeLayout = arrange;

    // M-342 (owner): the space above the bottom buttons stays empty (the floor ring is hidden in scene3d.js, M-341)
})();
