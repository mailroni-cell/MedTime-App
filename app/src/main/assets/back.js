// M-163 (owner 2026-10-21): the phone's back button goes one step back inside MedTime instead of leaving the app.
// Every open page (reminders, settings, doctor appointments, add-reminder wizard) gets a history entry; back closes the
// top one (a wizard first goes to its previous step). Other screens register with mtBackPush(handler):
// the handler runs on back, and returning true keeps it open (one step back inside it).
(function () {
    'use strict';
    const stack = []; // { el?, fn? }
    let ignore = 0;
    const depthNow = () => (history.state && history.state.mtb) || 0;
    function push(entry) {
        stack.push(entry);
        try { history.pushState({ mtb: stack.length }, ''); } catch (e) { }
    }
    function drop(entry) { // closed by its own button: remove our history entry too
        const i = stack.indexOf(entry); if (i < 0) return;
        const wasTop = i === stack.length - 1;
        stack.splice(i, 1);
        if (wasTop && depthNow() > stack.length) { ignore++; try { history.back(); } catch (e) { ignore--; } }
    }
    window.mtBackPush = function (fn) { const e = { fn: fn }; push(e); return () => drop(e); };

    function stepBack(page) {
        const b = page.querySelector('.wz-back');
        if (b && b.offsetParent !== null && !b.disabled && getComputedStyle(b).visibility !== 'hidden') { b.click(); return true; }
        return false;
    }
    function closePage(page) {
        const x = page.querySelector('.close-3d');
        if (x) x.click(); else page.classList.remove('open');
    }
    window.addEventListener('popstate', () => {
        if (ignore) { ignore--; return; }
        const d = depthNow();
        while (stack.length > d) {
            const e = stack.pop();
            let keep = false;
            if (e.el) {
                if (!e.el.classList.contains('open')) continue;
                keep = stepBack(e.el);
                if (!keep) { e.closing = true; closePage(e.el); }
            } else if (e.fn) {
                try { keep = e.fn() === true; } catch (err) { }
            }
            if (keep) { push(e); break; }
        }
    });

    // pages: watch their "open" class
    document.querySelectorAll('.settings-page').forEach(pg => {
        let entry = null;
        new MutationObserver(() => {
            const open = pg.classList.contains('open');
            if (open && !entry) { entry = { el: pg }; push(entry); }
            else if (!open && entry) { const e = entry; entry = null; if (!e.closing) drop(e); }
        }).observe(pg, { attributes: true, attributeFilter: ['class'] });
    });
})();
