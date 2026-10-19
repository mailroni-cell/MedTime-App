// M-076: friendly permission screens. Before any Android permission screen the user first sees
// a calm card: why it is needed, a small picture of exactly what Android will show and which
// button to press. Used on first launch (only for what is missing) and by every "fix" button.
// window.mtPermGuide(key) -> Promise<boolean>  (key: notifications / exact / fullScreen / battery / install)
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const has = f => !!(N && typeof N[f] === 'function');
    const pick = a => a[li()] || a[0];
    const rtl = () => li() < 2;

    const T = {
        introT: ['ברוכים הבאים ל-MedTime 👋', 'مرحبًا بك في MedTime 👋', 'Bun venit în MedTime 👋', 'Bienvenue dans MedTime 👋', 'Welcome to MedTime 👋'],
        introX: ['כדי שהתזכורות יגיעו בזמן, גם כשהאפליקציה סגורה, צריך לאשר לטלפון {n} דברים קטנים. זה לוקח פחות מדקה, ואני אראה לכם בדיוק על מה ללחוץ.',
            'لكي تصل التذكيرات في وقتها حتى والتطبيق مغلق، يجب السماح للهاتف بـ {n} أمور صغيرة. يستغرق ذلك أقل من دقيقة، وسأريك بالضبط أين تضغط.',
            'Ca mementourile să vină la timp, chiar cu aplicația închisă, telefonul trebuie să permită {n} lucruri mici. Durează sub un minut și vă arăt exact unde să apăsați.',
            'Pour que les rappels arrivent à l\'heure, même appli fermée, le téléphone doit autoriser {n} petites choses. Moins d\'une minute, et je vous montre exactement où appuyer.',
            'So reminders arrive on time, even when the app is closed, the phone needs to allow {n} small things. It takes less than a minute, and I will show you exactly what to tap.'],
        safe: ['🔒 זה בטוח. הנתונים שלכם נשמרים רק בטלפון ולא נשלחים לשום מקום.', '🔒 هذا آمن. بياناتك تبقى في الهاتف فقط ولا تُرسل إلى أي مكان.', '🔒 Este sigur. Datele rămân doar în telefon și nu sunt trimise nicăieri.', '🔒 C\'est sûr. Vos données restent dans le téléphone et ne sont envoyées nulle part.', '🔒 It is safe. Your data stays on the phone and is not sent anywhere.'],
        start: ['בואו נתחיל', 'لنبدأ', 'Să începem', 'Commençons', 'Let\'s start'],
        later: ['אחר כך', 'لاحقًا', 'Mai târziu', 'Plus tard', 'Later'],
        go: ['הבנתי, המשך', 'فهمت، متابعة', 'Am înțeles, continuă', 'Compris, continuer', 'Got it, continue'],
        skip: ['דלג', 'تخطَّ', 'Sari peste', 'Passer', 'Skip'],
        retry: ['נסה שוב', 'حاول مجددًا', 'Încearcă din nou', 'Réessayer', 'Try again'],
        step: ['שלב {i} מתוך {n}', 'الخطوة {i} من {n}', 'Pasul {i} din {n}', 'Étape {i} sur {n}', 'Step {i} of {n}'],
        wait: ['ממתין לאישור שלכם במסך של אנדרואיד…', 'بانتظار موافقتك في شاشة أندرويد…', 'Se așteaptă aprobarea în ecranul Android…', 'En attente de votre accord dans l\'écran Android…', 'Waiting for your OK on the Android screen…'],
        okT: ['מעולה! ✓', 'ممتاز! ✓', 'Perfect! ✓', 'Parfait ! ✓', 'Great! ✓'],
        notYet: ['זה עוד לא אושר. לא נורא, אפשר לנסות שוב או לדלג ולסדר אחר כך בהגדרות ⚙️.', 'لم تتم الموافقة بعد. لا بأس، حاول مجددًا أو تخطَّ وأصلح لاحقًا في الإعدادات ⚙️.', 'Încă nu e aprobat. Nu-i nimic: încercați din nou sau săriți și reparați mai târziu din Setări ⚙️.', 'Pas encore autorisé. Pas grave : réessayez ou passez, et réglez plus tard dans Réglages ⚙️.', 'Not allowed yet. No problem: try again, or skip and fix it later in Settings ⚙️.'],
        doneT: ['הכל מוכן! 🎉', 'كل شيء جاهز! 🎉', 'Totul e gata! 🎉', 'Tout est prêt ! 🎉', 'All set! 🎉'],
        doneX: ['מעכשיו MedTime יזכיר לכם בזמן, גם כשהאפליקציה סגורה.', 'من الآن سيذكّرك MedTime في الوقت، حتى والتطبيق مغلق.', 'De acum MedTime vă amintește la timp, chiar cu aplicația închisă.', 'Désormais MedTime vous rappelle à l\'heure, même appli fermée.', 'From now on MedTime reminds you on time, even when the app is closed.'],
        doneB: ['יוצאים לדרך', 'هيا بنا', 'Începem', 'C\'est parti', 'Let\'s go'],
        back: ['ואז חזרו לכאן בכפתור "חזרה" ◁', 'ثم عُد إلى هنا بزر "رجوع" ◁', 'Apoi reveniți aici cu butonul „Înapoi” ◁', 'Puis revenez ici avec le bouton « Retour » ◁', 'Then come back here with the "Back" button ◁'],
        tap: ['לחצו כאן', 'اضغط هنا', 'Apăsați aici', 'Appuyez ici', 'Tap here']
    };

    // what each permission is for, and a picture of what Android shows
    const S = {
        notifications: {
            icon: '🔔', kind: 'dialog',
            t: ['התראות', 'الإشعارات', 'Notificări', 'Notifications', 'Notifications'],
            x: ['כדי שנוכל להזכיר לכם לקחת תרופה ולהגיע לתור. בחלון הבא לחצו על "אישור".', 'لنذكّرك بتناول الدواء والوصول إلى الموعد. في النافذة التالية اضغط "سماح".', 'Ca să vă putem aminti de medicament și de programări. În fereastra următoare apăsați „Permite”.', 'Pour vous rappeler vos médicaments et rendez-vous. Dans la fenêtre suivante, appuyez sur « Autoriser ».', 'So we can remind you to take medicine and go to appointments. In the next window tap "Allow".'],
            q: ['לאפשר ל-MedTime לשלוח לך התראות?', 'السماح لـ MedTime بإرسال إشعارات إليك؟', 'Permiteți MedTime să vă trimită notificări?', 'Autoriser MedTime à vous envoyer des notifications ?', 'Allow MedTime to send you notifications?'],
            yes: ['אישור', 'سماح', 'Permite', 'Autoriser', 'Allow'], no: ['אין אישור', 'عدم السماح', 'Nu permite', 'Ne pas autoriser', 'Don\'t allow']
        },
        exact: {
            icon: '⏰', kind: 'switch',
            t: ['שעון מעורר מדויק', 'منبّه دقيق', 'Alarmă exactă', 'Alarme exacte', 'Exact alarms'],
            x: ['כדי שהתזכורת תגיע בדיוק בשעה שבחרתם, לא כמה דקות אחר כך. במסך הבא הפעילו את המתג.', 'لكي يصل التذكير في الساعة التي اخترتها بالضبط. في الشاشة التالية فعّل المفتاح.', 'Ca mementoul să vină exact la ora aleasă. În ecranul următor porniți comutatorul.', 'Pour que le rappel arrive à l\'heure exacte choisie. Dans l\'écran suivant, activez l\'interrupteur.', 'So the reminder comes at exactly the time you chose. On the next screen turn the switch on.'],
            q: ['אפשר הגדרת התראות ותזכורות', 'السماح بضبط المنبهات والتذكيرات', 'Permite setarea alarmelor și mementourilor', 'Autoriser les alarmes et rappels', 'Allow setting alarms and reminders']
        },
        fullScreen: {
            icon: '📱', kind: 'switch',
            t: ['תזכורת על כל המסך', 'تذكير بملء الشاشة', 'Memento pe tot ecranul', 'Rappel plein écran', 'Full-screen reminder'],
            x: ['כדי שהתזכורת תופיע גדולה וברורה גם כשהטלפון נעול. במסך הבא הפעילו את המתג.', 'لكي يظهر التذكير كبيرًا وواضحًا حتى والهاتف مقفل. في الشاشة التالية فعّل المفتاح.', 'Ca mementoul să apară mare și clar chiar cu telefonul blocat. În ecranul următor porniți comutatorul.', 'Pour que le rappel s\'affiche en grand même téléphone verrouillé. Dans l\'écran suivant, activez l\'interrupteur.', 'So the reminder shows big and clear even when the phone is locked. On the next screen turn the switch on.'],
            q: ['אפשר התראות במסך מלא', 'السماح بالإشعارات بملء الشاشة', 'Permite notificări pe tot ecranul', 'Autoriser les notifications plein écran', 'Allow full-screen notifications']
        },
        battery: {
            icon: '🔋', kind: 'dialog',
            t: ['פעולה ברקע', 'العمل في الخلفية', 'Funcționare în fundal', 'Fonctionnement en arrière-plan', 'Running in the background'],
            x: ['חיסכון הסוללה של הטלפון עלול "להרדים" את התזכורות. בחלון הבא לחצו על "אישור". זה כמעט לא משפיע על הסוללה.', 'قد يؤدي توفير البطارية إلى "تنويم" التذكيرات. في النافذة التالية اضغط "سماح". التأثير على البطارية ضئيل جدًا.', 'Economisirea bateriei poate „adormi” mementourile. În fereastra următoare apăsați „Permite”. Bateria aproape nu e afectată.', 'L\'économiseur de batterie peut « endormir » les rappels. Dans la fenêtre suivante, appuyez sur « Autoriser ». Presque aucun effet sur la batterie.', 'The phone\'s battery saver may "put reminders to sleep". In the next window tap "Allow". It barely affects the battery.'],
            q: ['לאפשר לאפליקציה לפעול תמיד ברקע?', 'السماح للتطبيق بالعمل دائمًا في الخلفية؟', 'Permiteți aplicației să ruleze mereu în fundal?', 'Autoriser l\'appli à toujours fonctionner en arrière-plan ?', 'Let the app always run in the background?'],
            yes: ['אישור', 'سماح', 'Permite', 'Autoriser', 'Allow'], no: ['דחייה', 'رفض', 'Refuză', 'Refuser', 'Deny']
        },
        overlay: { // M-094
            icon: '💊', kind: 'switch',
            t: ['תזכורת מעל הכל', 'تذكير فوق كل شيء', 'Memento deasupra tuturor', 'Rappel au-dessus de tout', 'Reminder on top of everything'],
            x: ['כדי שתזכורת התרופה תופיע מעל כל אפליקציה ותישאר עד שתלחצו "לקחתי", "דחה" או "דלג". במסך הבא הפעילו את המתג.', 'لكي يظهر تذكير الدواء فوق أي تطبيق ويبقى حتى تضغط "أخذته" أو "تأجيل" أو "تخطَّ". في الشاشة التالية فعّل المفتاح.', 'Ca mementoul să apară peste orice aplicație și să rămână până apăsați „Am luat”, „Amână” sau „Sari”. În ecranul următor porniți comutatorul.', 'Pour que le rappel s\'affiche par-dessus toute appli et reste jusqu\'à « Pris », « Reporter » ou « Passer ». Dans l\'écran suivant, activez l\'interrupteur.', 'So the medicine reminder shows on top of any app and stays until you tap "Taken", "Snooze" or "Skip". On the next screen turn the switch on.'],
            q: ['הצגה מעל אפליקציות אחרות', 'العرض فوق التطبيقات الأخرى', 'Afișare peste alte aplicații', 'Superposition sur d\'autres applis', 'Display over other apps']
        },
        install: {
            icon: '🔄', kind: 'switch',
            t: ['עדכונים מתוך האפליקציה', 'التحديثات من داخل التطبيق', 'Actualizări din aplicație', 'Mises à jour depuis l\'appli', 'Updates from inside the app'],
            x: ['פעם אחת בלבד: אנדרואיד שואל אם מותר ל-MedTime להתקין את הגרסאות החדשות שלו. במסך הבא הפעילו את המתג. התזכורות שלכם נשמרות.', 'مرة واحدة فقط: يسأل أندرويد إن كان مسموحًا لـ MedTime تثبيت إصداراته الجديدة. في الشاشة التالية فعّل المفتاح. تذكيراتك محفوظة.', 'O singură dată: Android întreabă dacă MedTime își poate instala versiunile noi. În ecranul următor porniți comutatorul. Mementourile rămân.', 'Une seule fois : Android demande si MedTime peut installer ses nouvelles versions. Dans l\'écran suivant, activez l\'interrupteur. Vos rappels restent.', 'Only once: Android asks whether MedTime may install its own new versions. On the next screen turn the switch on. Your reminders stay.'],
            q: ['התרת התקנה ממקור זה', 'السماح من هذا المصدر', 'Permite din această sursă', 'Autoriser cette source', 'Allow from this source']
        }
    };
    const FIRST = ['overlay', 'notifications', 'exact', 'fullScreen', 'battery']; // M-095: overlay first, so after each later permission the app can come back by itself

    const status = () => { try { return JSON.parse(N.getStatus()) || {}; } catch (e) { return {}; } };
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (o && k in o) ? o[k] : m);
    const vib = () => { if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { } };

    // ---------- styles ----------
    const css = document.createElement('style');
    css.textContent = `
    .su-bg{position:fixed !important;inset:0;z-index:9600 !important;margin:0 !important;display:flex;align-items:center;justify-content:center;padding:18px;
      background:radial-gradient(ellipse at 50% 30%,rgba(14,116,144,.55),rgba(2,6,23,.94) 70%);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
      opacity:0;transition:opacity .3s}
    .su-bg.in{opacity:1}
    .su-card{width:100%;max-width:400px;max-height:94vh;overflow:auto;border-radius:30px;padding:26px 20px 20px;text-align:center;color:#fff;
      background:linear-gradient(160deg,rgba(15,23,42,.97),rgba(8,47,73,.97));border:1.5px solid rgba(103,232,249,.45);
      box-shadow:0 24px 70px rgba(0,0,0,.7),0 0 40px rgba(34,211,238,.25);transform:translateY(14px) scale(.97);transition:transform .35s}
    .su-bg.in .su-card{transform:none}
    .su-ico{width:86px;height:86px;margin:0 auto 12px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.7rem;
      background:radial-gradient(circle at 35% 30%,#a5f3fc,#0891b2 70%);box-shadow:0 0 0 6px rgba(34,211,238,.15),0 10px 30px rgba(8,145,178,.5)}
    .su-step{font-size:.95rem;color:#a5f3fc;margin-bottom:6px;letter-spacing:.02em}
    .su-dots{display:flex;gap:7px;justify-content:center;margin:0 0 12px}.su-dots i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.25)}
    .su-dots i.on{background:#22d3ee;box-shadow:0 0 8px #22d3ee}.su-dots i.ok{background:#4ade80}
    .su-t{font-size:1.55rem;font-weight:800;margin:0 0 10px;line-height:1.25}
    .su-x{font-size:1.15rem;line-height:1.55;color:#e2e8f0;margin:0 0 14px}
    .su-safe{font-size:.98rem;line-height:1.45;color:#bbf7d0;background:rgba(34,197,94,.12);border-radius:14px;padding:9px 12px;margin:0 0 16px}
    .su-mock{margin:2px auto 16px;max-width:300px;border-radius:20px;background:#f8fafc;color:#0f172a;padding:16px 14px 12px;box-shadow:0 10px 30px rgba(0,0,0,.45);text-align:start}
    .su-mock .q{font-size:1.02rem;font-weight:700;line-height:1.35;margin-bottom:12px;text-align:center}
    .su-mock .row{display:flex;gap:8px;justify-content:center}
    .su-mock .b{flex:1;border-radius:999px;padding:9px 6px;text-align:center;font-weight:700;font-size:.98rem;background:#e2e8f0;color:#475569}
    .su-mock .b.yes{background:#0e7490;color:#fff;position:relative;animation:suPulse 1.6s infinite}
    .su-mock .sw{display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:700;font-size:1rem}
    .su-mock .tg{flex:none;width:52px;height:30px;border-radius:999px;background:#0e7490;position:relative;animation:suPulse 1.6s infinite}
    .su-mock .tg:after{content:'';position:absolute;top:4px;inset-inline-end:4px;width:22px;height:22px;border-radius:50%;background:#fff}
    .su-mock .hand{display:block;text-align:center;margin-top:8px;font-size:.92rem;color:#0e7490;font-weight:700}
    .su-mock .bk{display:block;text-align:center;margin-top:10px;font-size:.92rem;color:#334155}
    @keyframes suPulse{0%{box-shadow:0 0 0 0 rgba(14,116,144,.6)}70%{box-shadow:0 0 0 12px rgba(14,116,144,0)}100%{box-shadow:0 0 0 0 rgba(14,116,144,0)}}
    .su-btns{display:flex;flex-direction:column;gap:10px}
    .su-go{border:0;border-radius:18px;padding:16px;font-size:1.25rem;font-weight:800;color:#042f2e;background:linear-gradient(135deg,#5eead4,#22d3ee);box-shadow:0 8px 24px rgba(34,211,238,.4)}
    .su-no{border:0;background:none;color:#cbd5e1;font-size:1.05rem;padding:8px;text-decoration:underline}
    .su-wait{font-size:1.05rem;color:#fde68a;margin:4px 0 12px}
    .su-big{font-size:4rem;margin:6px 0 4px;animation:suPop .5s}
    @keyframes suPop{0%{transform:scale(.3);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}`;
    document.head.appendChild(css);

    // ---------- one card on screen ----------
    let bg = null, onBack = null;
    function card(html) {
        if (!bg) {
            bg = document.createElement('div'); bg.className = 'su-bg';
            bg.setAttribute('role', 'dialog'); bg.setAttribute('aria-modal', 'true');
            document.body.appendChild(bg);
            requestAnimationFrame(() => bg && bg.classList.add('in'));
        }
        bg.dir = rtl() ? 'rtl' : 'ltr';
        bg.innerHTML = '<div class="su-card">' + html + '</div>';
        return bg;
    }
    function close() {
        if (!bg) return;
        const b = bg; bg = null; onBack = null;
        b.classList.remove('in'); setTimeout(() => b.remove(), 320);
    }
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    function mock(s) {
        if (s.kind === 'dialog') {
            return '<div class="su-mock"><div class="q">' + esc(pick(s.q)) + '</div><div class="row">' +
                '<span class="b yes">' + esc(pick(s.yes)) + '</span><span class="b">' + esc(pick(s.no)) + '</span></div>' +
                '<span class="hand">☝️ ' + esc(pick(T.tap)) + '</span></div>';
        }
        return '<div class="su-mock"><div class="sw"><span>' + esc(pick(s.q)) + '</span><span class="tg"></span></div>' +
            '<span class="hand">☝️ ' + esc(pick(T.tap)) + '</span><span class="bk">' + esc(pick(T.back)) + '</span></div>';
    }
    function dots(i, n) {
        if (!n) return '';
        let h = '<div class="su-step">' + esc(fill(pick(T.step), { i: i + 1, n: n })) + '</div><div class="su-dots">';
        for (let k = 0; k < n; k++) h += '<i class="' + (k < i ? 'ok' : k === i ? 'on' : '') + '"></i>';
        return h + '</div>';
    }

    // Shows one permission card; resolves true when Android reports it allowed.
    function guide(key, i, n) {
        const s = S[key];
        if (!s || !N) return Promise.resolve(false);
        return new Promise(res => {
            const head = '<div class="su-ico">' + s.icon + '</div>' + dots(i, n) + '<div class="su-t">' + esc(pick(s.t)) + '</div>';
            const ask = () => {
                card(head + '<div class="su-x">' + esc(pick(s.x)) + '</div>' + mock(s) +
                    '<div class="su-btns"><button type="button" class="su-go">' + esc(pick(T.go)) + '</button>' +
                    '<button type="button" class="su-no">' + esc(pick(n ? T.skip : T.later)) + '</button></div>');
                bg.querySelector('.su-go').onclick = () => { vib(); open(); };
                bg.querySelector('.su-no').onclick = () => { vib(); res(false); };
            };
            const open = () => {
                card(head + '<div class="su-wait">⏳ ' + esc(pick(T.wait)) + '</div>' + mock(s));
                onBack = () => { onBack = null; setTimeout(check, 450); };
                if (key === 'notifications' && has('requestNotifications')) N.requestNotifications();
                else if (key === 'install' && has('openInstallPermission')) N.openInstallPermission();
                else N.openSettings(key);
            };
            const check = () => {
                onBack = null;
                if (status()[key] !== false) {
                    card(head + '<div class="su-big">✅</div><div class="su-t">' + esc(pick(T.okT)) + '</div>');
                    if (navigator.vibrate) try { navigator.vibrate([10, 60, 20]); } catch (e) { }
                    setTimeout(() => res(true), 1000);
                } else {
                    card(head + '<div class="su-x">' + esc(pick(T.notYet)) + '</div>' + mock(s) +
                        '<div class="su-btns"><button type="button" class="su-go">' + esc(pick(T.retry)) + '</button>' +
                        '<button type="button" class="su-no">' + esc(pick(n ? T.skip : T.later)) + '</button></div>');
                    bg.querySelector('.su-go').onclick = () => { vib(); open(); };
                    bg.querySelector('.su-no').onclick = () => { vib(); res(false); };
                }
            };
            ask();
        });
    }

    // Back from an Android screen (MainActivity.onResume)
    const prevResumed = window.mtResumed;
    window.mtResumed = function () {
        if (typeof prevResumed === 'function') try { prevResumed(); } catch (e) { }
        if (onBack) onBack();
        if (typeof renderStatus === 'function') try { renderStatus(); } catch (e) { }
    };

    // Single card from a "fix" button or the updater
    window.mtPermGuide = function (key) {
        return guide(key, 0, 0).then(ok => { close(); if (typeof renderStatus === 'function') try { renderStatus(); } catch (e) { } return ok; });
    };

    // ---------- first launch: only what is missing ----------
    const KEY = 'medtime_setup';
    let done = false;
    try { done = localStorage.getItem(KEY) === '1'; } catch (e) { }
    if (!N || typeof N.getStatus !== 'function') return;
    if (done) {
        // M-094: people who finished the setup before: ask once for "on top of everything"
        let asked = false; try { asked = localStorage.getItem('medtime_overlay_asked') === '1'; } catch (e) { }
        if (asked || status().overlay !== false) return;
        const w2 = setInterval(() => {
            if (document.getElementById('splash') || document.querySelector('.ob-bg,.mt-dlg-bg,.su-bg')) return;
            clearInterval(w2);
            try { localStorage.setItem('medtime_overlay_asked', '1'); } catch (e) { }
            setTimeout(() => window.mtPermGuide('overlay'), 900);
        }, 500);
        return;
    }

    function ready() {
        if (document.getElementById('splash')) return false;
        const w = document.getElementById('welcome');
        if (w && w.classList.contains('show')) return false;
        if (document.querySelector('.ob-bg')) return false; // M-086: welcome wizard first
        return !document.querySelector('.mt-dlg-bg');
    }
    let tries = 0;
    const wait = setInterval(() => {
        if (++tries > 240) { clearInterval(wait); return; }
        if (!ready()) return;
        clearInterval(wait);
        setTimeout(run, 900);
    }, 500);

    async function run() {
        const st = status();
        const need = FIRST.filter(k => st[k] === false);
        try { localStorage.setItem(KEY, '1'); } catch (e) { }
        if (!need.length) return;
        const go = await new Promise(res => {
            card('<div class="su-ico">💊</div><div class="su-t">' + esc(pick(T.introT)) + '</div>' +
                '<div class="su-x">' + esc(fill(pick(T.introX), { n: need.length })) + '</div>' +
                '<div class="su-safe">' + esc(pick(T.safe)) + '</div>' +
                '<div class="su-btns"><button type="button" class="su-go">' + esc(pick(T.start)) + '</button>' +
                '<button type="button" class="su-no">' + esc(pick(T.later)) + '</button></div>');
            bg.querySelector('.su-go').onclick = () => { vib(); res(true); };
            bg.querySelector('.su-no').onclick = () => { vib(); res(false); };
        });
        if (!go) { close(); return; }
        for (let i = 0; i < need.length; i++) {
            if (status()[need[i]] === false) await guide(need[i], i, need.length);
        }
        const left = FIRST.filter(k => status()[k] === false).length;
        if (left) { close(); if (typeof renderStatus === 'function') try { renderStatus(); } catch (e) { } return; }
        card('<div class="su-big">🎉</div><div class="su-t">' + esc(pick(T.doneT)) + '</div><div class="su-x">' + esc(pick(T.doneX)) + '</div>' +
            '<div class="su-btns"><button type="button" class="su-go">' + esc(pick(T.doneB)) + '</button></div>');
        bg.querySelector('.su-go').onclick = () => { vib(); close(); };
    }
})();
