// M-229 (owner): anonymous usage numbers and, after a week of use, a short satisfaction survey.
// M-238 (owner approved ntfy.sh 2026-10-22): sent to ntfy.sh (free, no account): a random install id, app version,
// language and the survey answers. No name, no medicines, nothing else. stats.yml collects them into stats/ and
// docs/stats.html; survey answers also arrive as a notification on the owner's survey topic.
(function () {
    'use strict';
    const NT = 'https://ntfy.sh/', TOPIC = 'medtime-v3tqzebpancz9djidfg7bh', STOPIC = 'medtime-s-pj9eh8jegcpcfn6wbkpp';
    const CF = 'https://medtime.pages.dev/api/hit';
    const FORM = NT + TOPIC; // the survey is on when this is set
    const N = window.MedTimeNative;
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const T = {
        share: ['שיתוף', 'مشاركة', 'Distribuie', 'Partager', 'Share', 'Поделиться'],
        q0: ['כמה ימים עם MedTime 🎉', 'بضعة أيام مع MedTime 🎉', 'Câteva zile cu MedTime 🎉', 'Quelques jours avec MedTime 🎉', 'A few days with MedTime 🎉', 'Несколько дней с MedTime 🎉'],
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

    function post(url, body, hdr) { try { fetch(url, { method: 'POST', body: body, headers: hdr || {} }).catch(() => { }); } catch (e) { } }
    function send(kind, extra) {
        const v = Object.assign({ kind: kind, id: iid, ver: ver(), lang: L5[li()] }, extra || {});
        post(NT + TOPIC, JSON.stringify(v));
        // M-327: the same anonymous message to our own Cloudflare counter (survey free text is never sent there)
        const c = Object.assign({}, v); delete c.text; post(CF, JSON.stringify(c), { 'Content-Type': 'text/plain' });
        if (kind === 'survey') // a readable copy for the owner's phone
            post(NT + STOPIC, '⭐'.repeat(+v.stars || 0) + ' (' + v.lang + ', v' + v.ver + ')\n' + (v.improve || '') + (v.text ? '\n💬 ' + v.text : ''), { Title: 'MedTime survey' });
    }
    // M-267 (owner): a question the guide's question box could not answer goes only to the owner's private topic (never to the public stats),
    // with no id, numbers masked, at most 5 a day and no repeats, so we learn which guide topics to add
    window.mtAskMiss = q => {
        q = String(q || '').replace(/\d{3,}/g, '#').replace(/\S+@\S+/g, '@').trim().slice(0, 160); if (q.length < 3) return;
        const d = today(); let seen = []; try { seen = JSON.parse(get('medtime_askmiss', '[]')); } catch (e) { }
        seen = seen.filter(x => x[0] === d); if (seen.length >= 5 || seen.some(x => x[1] === q)) return;
        seen.push([d, q]); put('medtime_askmiss', JSON.stringify(seen));
        post(NT + STOPIC, '❓ ' + q + '\n(' + L5[li()] + ', v' + ver() + ')', { Title: 'MedTime: question with no answer' });
    };
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
    #tile-share .set-ico{position:relative;overflow:visible!important}
    #tile-share .set-ico::before{content:'';position:absolute;inset:-7px;border-radius:inherit;pointer-events:none;border:3px solid #a3ff6b;
      box-shadow:0 0 16px 4px #4ade80,inset 0 0 12px #4ade80;opacity:.25;transform:scale(.94);animation:mtShP 3.4s ease-in-out infinite;will-change:transform,opacity}
    @keyframes mtShP{0%,100%{opacity:.2;transform:scale(.94)}50%{opacity:1;transform:scale(1.06)}}
    html.lowvision #tile-share .set-ico::before{animation:none;opacity:.8}
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

    // M-234 (owner): no share button on the main screen; the settings share tile glows and pulses slowly instead.
    // A tap on its send button is counted (anonymous)
    function shareBtn() {
        const old = document.getElementById('mt-share'); if (old) old.remove();
        const go = document.getElementById('sh-go');
        if (go && !go.dataset.mtCount) { go.dataset.mtCount = '1'; go.addEventListener('click', () => { put('medtime_shares', String(+get('medtime_shares', '0') + 1)); send('share'); }); }
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
    // M-331 (owner): after 3 days of use (3 days since the first day and at least 2 days with the app open), once; "later" asks again in 3 days, at most twice
    function maybeSurvey(days) {
        if (!FORM) return;
        const s = get('medtime_survey', '');
        if (s === 'done') return;
        if (s.startsWith('later:')) { const p = s.split(':'); if (+p[1] > Date.now() || +p[2] >= 2) return; }
        const first = new Date(get('medtime_first', today()));
        if ((Date.now() - first) / 864e5 < 3 || days.length < 2) return;
        if (document.getElementById('splash') || document.querySelector('.settings-page.open') || document.documentElement.classList.contains('relax-open')) return;
        survey();
    }
    function start() { shareBtn(); const d = daily(); setTimeout(() => maybeSurvey(d), 20000); }
    if (document.readyState === 'complete') setTimeout(start, 1500); else window.addEventListener('load', () => setTimeout(start, 1500));
    document.addEventListener('visibilitychange', () => { if (!document.hidden) daily(); });
    window.mtSurvey = survey; // for testing
})();
