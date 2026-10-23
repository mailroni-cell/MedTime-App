// M-323 (owner): battery saver. When the phone is in battery-saver mode, or the battery is at 20% or less
// and not charging, the moving background and animations stop by themselves; they come back when it is fine again.
(function () {
    'use strict';
    const N = window.MedTimeNative;
    const has = f => N && typeof N[f] === 'function';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const MSG = ['🔋 חיסכון בסוללה: האנימציות נעצרו', '🔋 توفير البطارية: توقفت الرسوم المتحركة', '🔋 Economie baterie: animațiile s-au oprit', '🔋 Économie de batterie : animations en pause', '🔋 Battery saver: animations paused', '🔋 Экономия батареи: анимация остановлена'];
    const css = document.createElement('style');
    css.textContent = 'html.mt-saver body *,html.mt-saver body *::before,html.mt-saver body *::after{animation-play-state:paused!important}';
    document.head.appendChild(css);
    let bat = null, on = false, told = false;
    function low() {
        try { if (has('isPowerSave') && N.isPowerSave()) return true; } catch (e) { }
        let lvl = -1, chg = false;
        try { if (has('batteryLevel')) lvl = N.batteryLevel(); } catch (e) { }
        try { if (has('isCharging')) chg = N.isCharging(); } catch (e) { }
        if (lvl < 0 && bat) { lvl = Math.round(bat.level * 100); chg = bat.charging; }
        return lvl >= 0 && lvl <= 20 && !chg;
    }
    function toast() {
        if (told) return; told = true;
        // M-335 (owner): the phone's own battery saver is often on all the time, so the note shows at most once a day
        try { const d = new Date().toDateString(); if (localStorage.getItem('mt_saver_told') === d) return; localStorage.setItem('mt_saver_told', d); } catch (e) { }
        const t = document.createElement('div');
        t.textContent = MSG[li()];
        t.style.cssText = 'position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:99999;padding:8px 16px;border-radius:999px;background:rgba(0,0,0,.82);color:#fef08a;font-weight:800;font-size:.95rem;box-shadow:0 2px 12px rgba(0,0,0,.6);pointer-events:none;transition:opacity .5s';
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 600); }, 3500);
    }
    function check() {
        const want = low();
        if (want === on) return;
        on = want;
        document.documentElement.classList.toggle('mt-saver', on);
        try { if (window.MedTime3D) MedTime3D.pause(on); } catch (e) { }
        if (on) toast(); else told = false;
    }
    window.mtSaverCheck = check;
    try { if (navigator.getBattery) navigator.getBattery().then(b => { bat = b; b.addEventListener('levelchange', check); b.addEventListener('chargingchange', check); check(); }).catch(() => { }); } catch (e) { }
    setTimeout(check, 3000);
    setInterval(() => { if (!document.hidden) check(); }, 60000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
})();
