// M-188 (owner): "simple mode" button. One tap strips the main screen of the special extras (3D scene, animations,
// serenity, guided tour, medicine check) and leaves only medicines, doctor appointments and vitals, plain and clear.
// Tap again for the full screen. Stored in medtime_simple (part of the backup).
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const T = {
        on: ['▫️ מצב פשוט', '▫️ وضع بسيط', '▫️ Mod simplu', '▫️ Mode simple', '▫️ Simple mode', '▫️ Простой режим'],
        off: ['✨ מצב מלא', '✨ الوضع الكامل', '✨ Mod complet', '✨ Mode complet', '✨ Full mode', '✨ Полный режим']
    };
    const tx = k => T[k][li()];
    const KEY = 'medtime_simple';
    const isOn = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
    const root = document.documentElement;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'simple-btn';
    document.body.appendChild(b);
    function apply() {
        const on = isOn();
        root.classList.toggle('simple', on);
        b.textContent = on ? tx('off') : tx('on');
        try { if (window.MedTime3D) pause(on); } catch (e) { }
        if (typeof window.fitMain === 'function') setTimeout(window.fitMain, 60);
    }
    // the 3D background stays stopped in simple mode (calm mode resumes it when it closes)
    let pause = () => { };
    if (window.MedTime3D) {
        const orig = window.MedTime3D.pause.bind(window.MedTime3D);
        pause = on => orig(on);
        window.MedTime3D.pause = on => orig(on || isOn());
    }
    b.onclick = () => {
        try { navigator.vibrate && navigator.vibrate(12); } catch (e) { }
        try { localStorage.setItem(KEY, isOn() ? '0' : '1'); } catch (e) { }
        apply();
    };
    const pr = window.moreRender; window.moreRender = function () { if (pr) pr(); apply(); };
    const st = document.createElement('style');
    st.textContent = `
    #simple-btn{position:fixed!important;top:calc(8px + env(safe-area-inset-top))!important;bottom:auto!important;inset-inline-start:8px!important;inset-inline-end:auto!important;
        width:auto!important;min-height:0!important;margin:0!important;z-index:41;border-radius:999px!important;padding:5px 11px!important;
        font-size:.85rem!important;font-weight:700!important;color:#fff!important;background:rgba(15,23,42,.6)!important;border:1.5px solid rgba(255,255,255,.4)!important;box-shadow:none!important}
    html.relax-open #simple-btn, html.med-open #simple-btn, body:has(.settings-page.open) #simple-btn{display:none!important}
    html.simple #bg3d{visibility:hidden!important}
    html.simple body{background:#0f172a!important}
    html.simple .hero-space, html.simple #relax-btn, html.simple #guide-btn, html.simple #sb-home, html.simple #upd-pill{display:none!important}
    html.simple header *, html.simple .home-card *, html.simple .hello-line, html.simple .hello-line *{animation:none!important;transition:none!important}
    html.simple .home-card{gap:16px!important;margin-top:18px}
    html.simple .home-pair > .relax-btn{min-height:72px!important}`;
    document.head.appendChild(st);
    apply();
})();
