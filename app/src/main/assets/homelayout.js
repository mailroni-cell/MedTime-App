// M-205 / M-209 (owner): main menu in a logical order, as big glossy 3D symbols floating over the background (no button frames).
// Row 1: Add reminder (biggest). Rows 2-3: My reminders, appointments, medicine check / vitals, serenity, first aid.
// M-210 (owner): a green ✓ on "My reminders" once every reminder due today was taken.
// The buttons themselves are not changed (same ids and handlers); they are only moved into the new box and restyled.
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const N = window.MedTimeNative;
    const ORDER = ['main-add', 'list-btn', 'appt-btn', 'sb-home', 'vt-btn', 'relax-btn', 'fa-home'];
    const ICO = '#main-add .ba-cross, #list-btn .lb-count, #appt-btn .ab-ico, #sb-home .sbh-ico, #vt-btn .rb-ico, #relax-btn .rb-ico, #fa-home .fah-ico';
    const css = document.createElement('style');
    const B = 'html .home-card .hm-float';
    const BT = B + ' > :is(#main-add,#list-btn,#appt-btn,#sb-home,#vt-btn,#relax-btn,#fa-home)'; // ids: beats the old per-button colours
    css.textContent = `
    .home-card .hm-empty{display:none!important}
    ${B}{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--hm-gap,14px) 6px;width:100%;align-items:start}
    ${BT}{all:unset;box-sizing:border-box;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:6px!important;
      min-width:0;min-height:0!important;height:auto!important;width:100%!important;margin:0!important;padding:0!important;background:none!important;border:0!important;box-shadow:none!important;outline:none;cursor:pointer;
      text-align:center!important;-webkit-tap-highlight-color:transparent;animation:hmFloat 4.2s ease-in-out infinite;will-change:transform}
    ${BT}::before,${BT}::after{display:none!important}
    ${B} > #main-add{grid-column:1 / -1}
    ${B} > button:nth-child(2){animation-delay:-.7s}${B} > button:nth-child(3){animation-delay:-1.4s}${B} > button:nth-child(4){animation-delay:-2.1s}
    ${B} > button:nth-child(5){animation-delay:-2.8s}${B} > button:nth-child(6){animation-delay:-3.5s}${B} > button:nth-child(7){animation-delay:-1s}
    @keyframes hmFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    ${B} > button:active{animation-play-state:paused;transform:scale(.93)}
    /* the symbol: a glossy 3D ball with a soft shadow under it */
    html .home-card .hm-float :is(${ICO}){position:relative;display:grid!important;place-items:center!important;box-sizing:border-box!important;
      width:var(--hm-o,74px)!important;height:var(--hm-o,74px)!important;min-width:var(--hm-o,74px)!important;flex:0 0 auto!important;margin:0!important;border-radius:50%!important;transform:none!important;
      background:radial-gradient(circle at 34% 26%,#fff 0,var(--c1) 22%,var(--c2) 62%,var(--c3) 100%)!important;border:0!important;
      box-shadow:inset 0 -8px 14px rgba(0,0,0,.35),inset 0 5px 8px rgba(255,255,255,.45),0 14px 18px -6px rgba(0,0,0,.65),0 0 22px var(--c2)!important}
    html .home-card .hm-float :is(${ICO})::after{content:'';position:absolute;left:22%;top:9%;width:42%;height:24%;border-radius:50%;background:linear-gradient(rgba(255,255,255,.85),rgba(255,255,255,0));pointer-events:none}
    html .home-card .hm-float :is(${ICO}) :is(i,svg){font-size:calc(var(--hm-o,74px) * .5)!important;width:auto!important;height:auto!important;line-height:1!important;filter:drop-shadow(0 3px 3px rgba(0,0,0,.45))}
    html .home-card .hm-float #main-add{--hm-o:var(--hm-big,96px)}
    html body .home-card .hm-float #main-add .ba-cross svg{width:calc(var(--hm-o) * .62)!important;height:calc(var(--hm-o) * .62)!important;flex:none!important;margin:0!important;filter:drop-shadow(0 0 2px #fff) drop-shadow(0 3px 3px rgba(0,0,0,.45))}
    html .home-card .hm-float #list-btn .lb-count{color:#fff!important;font-size:calc(var(--hm-o,74px) * .44)!important;font-weight:900!important;text-shadow:0 2px 3px rgba(0,0,0,.6)!important;min-height:0!important}
    #main-add{--c1:#bbf7d0;--c2:#10b981;--c3:#065f46}
    #list-btn{--c1:#e9d5ff;--c2:#8b5cf6;--c3:#4c1d95}
    #appt-btn{--c1:#ccfbf1;--c2:#14b8a6;--c3:#134e4a}
    #sb-home{--c1:#bfdbfe;--c2:#3b82f6;--c3:#1e3a8a}
    #vt-btn{--c1:#fbcfe8;--c2:#ec4899;--c3:#831843}
    #relax-btn{--c1:#c7d2fe;--c2:#6366f1;--c3:#312e81}
    #fa-home{--c1:#fecaca;--c2:#ef4444;--c3:#7f1d1d}
    /* labels: bright text with a dark outline and a glow in the symbol's colour */
    ${BT} :is(.ba-txt,.lb-title,.ab-title,.ab-txt,.sbh-txt,.rb-txt,.fah-txt,b){display:flex;flex-direction:column;align-items:center;font-size:var(--hm-t,1.08rem)!important;line-height:1.15!important;
      color:#fff!important;font-weight:900!important;--mtg:var(--c2)!important;text-shadow:0 0 2px #000,0 1px 3px #000,0 0 12px var(--c2)!important;margin:0!important;padding:0!important;min-width:0;white-space:normal!important}
    ${B} > #main-add .ba-txt{font-size:var(--hm-tb,1.35rem)!important}
    ${BT} :is(small,.ab-sub,.lb-next){font-size:.85rem!important;font-weight:800!important;color:#fde68a!important;text-shadow:0 0 2px #000,0 1px 2px #000!important;opacity:1!important}
    ${B} #sb-home small,${B} #fa-home small,${B} .ba-ecg,${B} .ab-count{display:none!important}
    ${B} #list-btn{flex-wrap:nowrap!important}
    ${B} #list-btn .lb-next{flex-basis:auto!important}
    /* M-210: all of today's reminders taken */
    #list-btn.hm-done .lb-count::before{content:'✓';position:absolute;right:-12px;bottom:-8px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
      font-size:1.2rem;font-weight:900;color:#fff;background:radial-gradient(circle at 35% 30%,#86efac,#16a34a 60%,#14532d);box-shadow:0 0 0 3px rgba(0,0,0,.5),0 0 14px #22c55e;z-index:2}
    html.fit1 .home-card{--hm-o:68px;--hm-big:88px}
    html.fit2 .home-card{--hm-o:62px;--hm-big:80px;--hm-gap:10px}
    html.fit3 .home-card{--hm-o:56px;--hm-big:72px;--hm-t:1rem;--hm-tb:1.2rem}
    html.fit6 .home-card{--hm-o:50px;--hm-big:64px;--hm-gap:6px;--hm-t:.95rem;--hm-tb:1.1rem}
    @media (prefers-reduced-motion: reduce){${B} > button{animation:none}}
    html.lowvision ${B} > button{animation:none}`;
    document.head.appendChild(css);

    function arrange() {
        const card = document.querySelector('.home-card'), add = $('main-add');
        if (!card || !add) return false;
        let box = card.querySelector('.hm-float');
        if (!box) { box = document.createElement('div'); box.className = 'hm-float'; card.insertBefore(box, card.firstChild); }
        ORDER.forEach(id => { const b = $(id); if (b && b.parentNode !== box) box.appendChild(b); });
        // keep the order even if a script inserted a button later
        ORDER.map($).filter(Boolean).forEach(b => box.appendChild(b));
        const gl = $('guide-btn'); if (gl) card.appendChild(gl);
        card.querySelectorAll('.nav-row, .home-pair, .hm-meds, .hm-grid').forEach(d => d.classList.toggle('hm-empty', !d.querySelector('button')));
        markDone();
        if (typeof window.fitMain === 'function') setTimeout(window.fitMain, 60);
        return ORDER.every(id => $(id));
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
            const taken = new Set(log.filter(e => e.d === day && e.s === 'taken').map(e => String(e.id)));
            done = due.length > 0 && due.every(m => taken.has(String(m.id)));
        } catch (e) { }
        btn.classList.toggle('hm-done', done);
    }
    window.mtHomeDone = markDone;
    document.addEventListener('visibilitychange', () => { if (!document.hidden) markDone(); });
    setInterval(markDone, 60000);
    // the list button is redrawn when reminders change: put the ✓ back
    const lb = $('list-btn'); if (lb) new MutationObserver(() => { if (!lb.classList.contains('hm-busy')) markDone(); }).observe(lb, { childList: true });

    let n = 0;
    const tick = () => { const done = arrange(); if (!done && ++n < 20) setTimeout(tick, 300); };
    tick(); setTimeout(arrange, 2500);
    window.mtHomeLayout = arrange;
})();
