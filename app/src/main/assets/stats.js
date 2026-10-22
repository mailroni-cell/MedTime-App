// M-229 (owner): a small share button on the main screen, anonymous usage numbers and, after a week of use, a short
// satisfaction survey. Everything goes to the owner's Google Form (sheet): a random install id, app version, language,
// and the survey answers. No name, no medicines, nothing else. FORM is empty until the owner's form is connected.
(function () {
    'use strict';
    const FORM = ''; // https://docs.google.com/forms/d/e/<id>/formResponse
    const F = { kind: '', id: '', ver: '', lang: '', stars: '', improve: '', text: '' }; // entry.NNN of each field
    const N = window.MedTimeNative;
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const T = {
        share: ['שיתוף', 'مشاركة', 'Distribuie', 'Partager', 'Share', 'Поделиться'],
        q0: ['שבוע עם MedTime 🎉', 'أسبوع مع MedTime 🎉', 'O săptămână cu MedTime 🎉', 'Une semaine avec MedTime 🎉', 'A week with MedTime 🎉', 'Неделя с MedTime 🎉'],
        q1: ['כמה את/ה מרוצה?', 'ما مدى رضاك؟', 'Cât de mulțumit(ă) sunteți?', 'Êtes-vous satisfait(e) ?', 'How happy are you?', 'Насколько вы довольны?'],
        q2: ['מה כדאי לשפר?', 'ما الذي يجب تحسينه؟', 'Ce să îmbunătățim?', 'Que faut-il améliorer ?', 'What should we improve?', 'Что улучшить?'],
        opts: [['⏰ תזכורות', '🎨 מראה', '🔊 צליל וקול', '👆 קלות שימוש', '💊 בדיקת תרופה', '✅ הכול טוב'],
            ['⏰ التذكيرات', '🎨 الشكل', '🔊 الصوت', '👆 سهولة الاستخدام', '💊 فحص الدواء', '✅ كل شيء جيد'],
            ['⏰ Mementouri', '🎨 Aspect', '🔊 Sunet și voce', '👆 Ușurință', '💊 Verificare medicament', '✅ Totul e bine'],
            ['⏰ Rappels', '🎨 Apparence', '🔊 Son et voix', '👆 Facilité', '💊 Vérif. médicament', '✅ Tout va bien'],
            ['⏰ Reminders', '🎨 Look', '🔊 Sound and voice', '👆 Ease of use', '💊 Medicine check', '✅ All good'],
            ['⏰ Напоминания', '🎨 Вид', '🔊 Звук и голос', '👆 Удобство', '💊 Проверка лекарства', '✅ Всё хорошо']],
        q3: ['משהו נוסף? (לא חובה)', 'شيء آخر؟ (اختياري)', 'Altceva? (opțional)', 'Autre chose ? (facultatif)', 'Anything else? (optional)', 'Что-то ещё? (необязательно)'],
        send: ['📨 שליחה', '📨 إرسال', '📨 Trimite', '📨 Envoyer', '📨 Send', '📨 Отправить'],
        later: ['אחר כך', 'لاحقًا', 'Mai târziu', 'Plus tard', 'Later', 'Позже'],
        thanks: ['תודה רבה! 💚', 'شكرًا جزيلًا! 💚', 'Mulțumim mult! 💚', 'Merci beaucoup ! 💚', 'Thank you! 💚', 'Спасибо! 💚']
    };
    const tx = k => T[k][li()];
    const get = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
    const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
    const today = () => new Date().toISOString().slice(0, 10);
    let iid = get('medtime_iid', '');
    if (!iid) { iid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); put('medtime_iid', iid); }
    if (!get('medtime_first', '')) put('medtime_first', today());
    const ver = () => { try { return N && N.getVersion ? String(N.getVersion()) : ''; } catch (e) { return ''; } };

    function send(kind, extra) {
        if (!FORM || !F.kind) return;
        const v = Object.assign({ kind: kind, id: iid, ver: ver(), lang: L5[li()] }, extra || {});
        const body = Object.keys(F).filter(k => F[k] && v[k] !== undefined && v[k] !== '').map(k => encodeURIComponent(F[k]) + '=' + encodeURIComponent(v[k])).join('&');
        try { fetch(FORM, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body }).catch(() => { }); } catch (e) { }
    }
    // once a day: "this install is alive" (the sheet counts active installs per version)
    function daily() {
        const d = today();
        let days = []; try { days = JSON.parse(get('medtime_days', '[]')); } catch (e) { }
        if (!days.includes(d)) { days.push(d); put('medtime_days', JSON.stringify(days.slice(-30))); }
        if (get('medtime_ping', '') !== d) { put('medtime_ping', d); send('ping'); }
        return days;
    }

    const css = document.createElement('style');
    css.textContent = `
    html body #mt-share{position:fixed!important;z-index:41;top:auto!important;bottom:calc(30px + env(safe-area-inset-bottom))!important;left:calc(25% + 6px)!important;right:auto!important;margin:0!important;width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,.9);
      display:grid;place-items:center;font-size:1.35rem;color:#fff;background:radial-gradient(circle at 34% 26%,#fff 0,#86efac 20%,#22c55e 60%,#14532d 100%);
      box-shadow:inset 0 -5px 8px rgba(0,0,0,.3),0 5px 0 #14532d,0 10px 14px rgba(0,0,0,.5);-webkit-tap-highlight-color:transparent;padding:0}
    #mt-share:active{transform:translateY(4px);box-shadow:0 1px 0 #14532d}
    html.relax-open #mt-share,html.med-open #mt-share,body:has(.settings-page.open) #mt-share,body:has(.open:is(.list-page,.appt-page)) #mt-share{display:none!important}
    #mt-sv{position:fixed;inset:0;z-index:9000;display:flex;align-items:flex-end;justify-content:center;background:rgba(2,6,23,.6);opacity:0;transition:opacity .25s}
    #mt-sv.in{opacity:1}
    #mt-sv .sv-card{width:100%;max-width:520px;box-sizing:border-box;background:linear-gradient(180deg,#1e293b,#0f172a);color:#fff;border-radius:26px 26px 0 0;
      padding:18px 16px calc(16px + env(safe-area-inset-bottom));box-shadow:0 -10px 30px rgba(0,0,0,.5);font-family:inherit}
    #mt-sv h3{margin:0 0 6px;text-align:center;font-size:1.35rem}
    #mt-sv .sv-q{font-weight:800;font-size:1.08rem;margin:12px 0 8px}
    #mt-sv .sv-stars{display:flex;justify-content:center;gap:6px;direction:ltr}
    #mt-sv .sv-stars button{font-size:2.3rem;background:none;border:0;padding:2px;filter:grayscale(1) brightness(.7);transition:transform .15s}
    #mt-sv .sv-stars button.on{filter:none;transform:scale(1.12)}
    #mt-sv .sv-ch{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
    #mt-sv .sv-ch button{min-height:46px;border-radius:14px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:#fff;font:inherit;font-weight:800;font-size:.98rem}
    #mt-sv .sv-ch button.on{border-color:#4ade80;background:rgba(34,197,94,.3)}
    #mt-sv textarea{width:100%;box-sizing:border-box;min-height:56px;border-radius:14px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:#fff;font:inherit;font-size:1rem;padding:10px}
    #mt-sv .sv-row{display:flex;gap:10px;margin-top:14px}
    #mt-sv .sv-row button{flex:1;min-height:52px;border-radius:999px;border:0;font:inherit;font-weight:900;font-size:1.08rem}
    #mt-sv .sv-go{background:linear-gradient(180deg,#86efac,#16a34a);color:#052e16}
    #mt-sv .sv-go:disabled{opacity:.45}
    #mt-sv .sv-no{background:rgba(255,255,255,.12);color:#fff}`;
    document.head.appendChild(css);

    function shareBtn() {
        if (document.getElementById('mt-share')) return;
        const b = document.createElement('button'); b.type = 'button'; b.id = 'mt-share'; b.textContent = '📤';
        b.setAttribute('aria-label', tx('share'));
        b.onclick = () => {
            if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { }
            const go = document.getElementById('sh-go');
            if (go && N && N.shareText) { go.click(); put('medtime_shares', String(+get('medtime_shares', '0') + 1)); send('share'); }
        };
        document.body.appendChild(b);
    }

    function survey() {
        if (document.getElementById('mt-sv')) return;
        const box = document.createElement('div'); box.id = 'mt-sv';
        const o = T.opts[li()];
        box.innerHTML = '<div class="sv-card"><h3></h3><div class="sv-q q1"></div><div class="sv-stars">' + [1, 2, 3, 4, 5].map(n => '<button type="button" data-n="' + n + '">⭐</button>').join('') +
            '</div><div class="sv-q q2"></div><div class="sv-ch">' + o.map((t, i) => '<button type="button" data-i="' + i + '"></button>').join('') +
            '</div><div class="sv-q q3"></div><textarea maxlength="300"></textarea><div class="sv-row"><button type="button" class="sv-go"></button><button type="button" class="sv-no"></button></div></div>';
        box.querySelector('h3').textContent = tx('q0');
        box.querySelector('.q1').textContent = tx('q1'); box.querySelector('.q2').textContent = tx('q2'); box.querySelector('.q3').textContent = tx('q3');
        box.querySelectorAll('.sv-ch button').forEach((b, i) => { b.textContent = o[i]; b.onclick = () => b.classList.toggle('on'); });
        let stars = 0;
        const go = box.querySelector('.sv-go'); go.textContent = tx('send'); go.disabled = true;
        box.querySelectorAll('.sv-stars button').forEach(b => b.onclick = () => {
            stars = +b.dataset.n; box.querySelectorAll('.sv-stars button').forEach(x => x.classList.toggle('on', +x.dataset.n <= stars)); go.disabled = false;
            if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) { }
        });
        const close = () => { box.classList.remove('in'); setTimeout(() => box.remove(), 260); };
        go.onclick = () => {
            const imp = [...box.querySelectorAll('.sv-ch button.on')].map(b => T.opts[4][+b.dataset.i].replace(/^\S+\s/, '')).join(', ');
            send('survey', { stars: stars, improve: imp, text: box.querySelector('textarea').value.trim() });
            put('medtime_survey', 'done');
            if (window.mtAlert) mtAlert(tx('thanks'), '💚');
            close();
        };
        const no = box.querySelector('.sv-no'); no.textContent = tx('later');
        no.onclick = () => { put('medtime_survey', 'later:' + (Date.now() + 3 * 864e5) + ':' + (+(get('medtime_survey', '').split(':')[2] || 0) + 1)); close(); };
        document.body.appendChild(box); requestAnimationFrame(() => box.classList.add('in'));
    }
    // after a week of use (7 days since the first day and at least 5 days with the app open), once; "later" asks again in 3 days, at most twice
    function maybeSurvey(days) {
        if (!FORM) return;
        const s = get('medtime_survey', '');
        if (s === 'done') return;
        if (s.startsWith('later:')) { const p = s.split(':'); if (+p[1] > Date.now() || +p[2] >= 2) return; }
        const first = new Date(get('medtime_first', today()));
        if ((Date.now() - first) / 864e5 < 7 || days.length < 5) return;
        if (document.getElementById('splash') || document.querySelector('.settings-page.open') || document.documentElement.classList.contains('relax-open')) return;
        survey();
    }
    function start() { shareBtn(); const d = daily(); setTimeout(() => maybeSurvey(d), 20000); }
    if (document.readyState === 'complete') setTimeout(start, 1500); else window.addEventListener('load', () => setTimeout(start, 1500));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) daily(); });
    window.mtSurvey = survey; // for testing
})();
