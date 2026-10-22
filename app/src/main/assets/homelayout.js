// M-205 (owner): main menu in a logical order, with the important part framed.
// 1. "My medicines" frame (stands out): Add reminder + My reminders.
// 2. Health tools, 2 x 2 equal tiles: doctor appointments, medicine check, vitals, serenity.
// 3. First aid (emergency) on its own, full width, red.
// 4. The guide line.
// The buttons themselves are not changed (same ids and handlers); they are only moved into the new boxes.
(function () {
    'use strict';
    const $ = id => document.getElementById(id);
    const css = document.createElement('style');
    css.textContent = `
    .home-card .hm-meds{display:flex;flex-direction:column;gap:10px;width:100%;box-sizing:border-box;padding:10px;border-radius:30px;
      background:linear-gradient(180deg,rgba(253,224,71,.16),rgba(15,23,42,.35));border:2.5px solid rgba(253,224,71,.85);
      box-shadow:0 0 0 1px rgba(0,0,0,.45),0 0 18px rgba(253,224,71,.45),inset 0 1px 0 rgba(255,255,255,.25);animation:hmGlow 3.2s ease-in-out infinite}
    @keyframes hmGlow{0%,100%{box-shadow:0 0 0 1px rgba(0,0,0,.45),0 0 12px rgba(253,224,71,.35),inset 0 1px 0 rgba(255,255,255,.25)}50%{box-shadow:0 0 0 1px rgba(0,0,0,.45),0 0 24px rgba(253,224,71,.65),inset 0 1px 0 rgba(255,255,255,.25)}}
    .home-card .hm-meds > button{width:100%!important;margin:0!important}
    .home-card .hm-meds #list-btn{min-height:72px}
    .home-card .hm-grid{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:1fr;gap:10px;width:100%;margin-top:12px}
    .home-card .hm-grid > button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;
      width:auto!important;min-width:0!important;min-height:92px!important;margin:0!important;padding:8px 6px!important;border-radius:26px!important;text-align:center!important;font-size:1.12rem!important;line-height:1.15!important}
    html .home-card .hm-grid > button > span:first-child,html .home-card .hm-grid #appt-btn .ab-ico{width:46px!important;height:46px!important;min-width:46px!important;flex:0 0 46px!important;margin:0!important;transform:none!important;display:grid!important;place-items:center!important}
    html .home-card .hm-grid > button > span:first-child i,html .home-card .hm-grid #appt-btn .ab-ico i{font-size:28px!important;line-height:1!important}
    .home-card .hm-grid #sb-home small,.home-card .hm-grid #appt-btn .ab-sub:empty{display:none!important}
    .home-card .hm-grid #sb-home .sbh-txt{align-items:center!important;text-align:center!important}
    .home-card .hm-grid #sb-home .sbh-txt b,.home-card .hm-grid #appt-btn .ab-title{font-size:1.12rem!important;line-height:1.15!important}
    .home-card .hm-grid #appt-btn .ab-sub{font-size:.85rem!important}
    .home-card .hm-grid .ba-ecg{display:none!important}
    .home-card > #fa-home{margin-top:12px!important;min-height:64px}
    .home-card .hm-empty{display:none!important}
    html.fit1 .home-card .hm-grid > button{min-height:80px!important}
    html.fit1 .home-card .hm-meds{padding:8px;gap:8px}
    html.fit2 .home-card .hm-grid > button{min-height:70px!important;padding:4px 6px!important}
    html.fit2 .home-card .hm-grid{margin-top:8px;gap:8px}
    html.fit2 .home-card > #fa-home{margin-top:8px!important;min-height:54px}
    html.fit3 .home-card .hm-grid > button{min-height:62px!important}
    html.fit3 .home-card .hm-grid > button > span:first-child,html.fit3 .home-card .hm-grid #appt-btn .ab-ico{width:38px!important;height:38px!important;min-width:38px!important;flex-basis:38px!important}
    html.fit3 .home-card .hm-grid > button > span:first-child i,html.fit3 .home-card .hm-grid #appt-btn .ab-ico i{font-size:23px!important}
    html .home-card .hm-grid #appt-btn{border-radius:26px!important}
    html.fit6 .home-card .hm-grid > button{min-height:0!important;padding:3px 6px!important;font-size:1rem!important}
    html.fit6 .home-card .hm-grid #sb-home .sbh-txt b,html.fit6 .home-card .hm-grid #appt-btn .ab-title{font-size:1rem!important}
    html.fit6 .home-card .hm-grid > button > span:first-child,html.fit6 .home-card .hm-grid #appt-btn .ab-ico{width:32px!important;height:32px!important;min-width:32px!important;flex-basis:32px!important}
    html.fit6 .home-card .hm-grid > button > span:first-child i,html.fit6 .home-card .hm-grid #appt-btn .ab-ico i{font-size:20px!important}
    html.fit6 .home-card .hm-meds{padding:6px;gap:6px;border-radius:24px}
    html.fit6 .home-card > #fa-home{min-height:48px}
    html.lowvision .home-card .hm-meds{background:#000!important;border-color:#fff!important;animation:none}`;
    document.head.appendChild(css);

    function arrange() {
        const card = document.querySelector('.home-card'), add = $('main-add');
        if (!card || !add) return false;
        let meds = card.querySelector('.hm-meds');
        if (!meds) { meds = document.createElement('div'); meds.className = 'hm-meds'; card.insertBefore(meds, card.firstChild); }
        let grid = card.querySelector('.hm-grid');
        if (!grid) { grid = document.createElement('div'); grid.className = 'hm-grid'; card.insertBefore(grid, meds.nextSibling); }
        [add, $('list-btn')].forEach(b => { if (b && b.parentNode !== meds) meds.appendChild(b); });
        ['appt-btn', 'sb-home', 'vt-btn', 'relax-btn'].forEach(id => { const b = $(id); if (b && b.parentNode !== grid) grid.appendChild(b); });
        const fa = $('fa-home'); if (fa) card.insertBefore(fa, grid.nextSibling);
        const gl = $('guide-btn'); if (gl) card.appendChild(gl);
        card.querySelectorAll('.nav-row, .home-pair').forEach(d => d.classList.toggle('hm-empty', !d.querySelector('button')));
        if (typeof window.fitMain === 'function') setTimeout(window.fitMain, 60);
        return !!($('sb-home') && $('fa-home') && $('vt-btn'));
    }
    // the other scripts add their buttons at different moments: arrange again until all are in place
    let n = 0;
    const tick = () => { const done = arrange(); if (!done && ++n < 20) setTimeout(tick, 300); };
    tick(); setTimeout(arrange, 2500);
    window.mtHomeLayout = arrange;
})();
