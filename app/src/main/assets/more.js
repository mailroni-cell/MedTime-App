// M-080: three settings tiles: 📒 "did I take it?" log, 💾 backup & restore, 📤 share MedTime.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const has = f => !!(N && typeof N[f] === 'function');
    const grid = document.querySelector('#settings-page .set-grid');
    if (!grid) return;
    const LINK = 'https://github.com/mailroni-cell/MedTime-App/releases/download/latest/MedTime-latest.apk';

    const T = {
        logT: ['📒 יומן תרופות', '📒 سجل الأدوية', '📒 Jurnal', '📒 Journal', '📒 Medicine log'],
        logSub: ['השבוע: {a} מתוך {b} נלקחו', 'هذا الأسبوع: {a} من {b}', 'Săptămâna asta: {a} din {b}', 'Cette semaine : {a} sur {b}', 'This week: {a} of {b} taken'],
        logEmpty: ['עוד אין רישומים. כשתגיע תזכורת ותלחצו "לקחתי" או "ביטלתי", זה יירשם כאן.', 'لا توجد سجلات بعد. عند وصول تذكير والضغط على "تناولته" أو "ألغيت" سيُسجَّل هنا.', 'Încă nimic. Când apăsați „Am luat” sau „Anulez” la un memento, apare aici.', 'Rien encore. Quand vous appuyez sur « Pris » ou « Annuler » à un rappel, cela s\'inscrit ici.', 'Nothing yet. When a reminder comes and you tap "Taken" or "Skip", it is written here.'],
        week: ['7 הימים האחרונים', 'آخر 7 أيام', 'Ultimele 7 zile', '7 derniers jours', 'Last 7 days'],
        taken: ['לקחתי', 'تناولته', 'Luat', 'Pris', 'Taken'],
        skipped: ['ביטלתי', 'ألغيت', 'Anulat', 'Annulé', 'Skipped'],
        missed: ['לא נענה', 'لم يُجب', 'Fără răspuns', 'Sans réponse', 'No answer'],
        today: ['היום', 'اليوم', 'Azi', 'Aujourd\'hui', 'Today'],
        yest: ['אתמול', 'أمس', 'Ieri', 'Hier', 'Yesterday'],
        send: ['📤 שליחת הדוח לרופא או למשפחה', '📤 إرسال التقرير للطبيب أو للعائلة', '📤 Trimite raportul medicului sau familiei', '📤 Envoyer au médecin ou à la famille', '📤 Send the report to a doctor or family'],
        pdf: ['📄 דוח שבועי מעוצב (PDF) לרופא או למשפחה', '📄 تقرير أسبوعي (PDF) للطبيب أو العائلة', '📄 Raport săptămânal (PDF)', '📄 Rapport hebdomadaire (PDF)', '📄 Weekly report (PDF) for a doctor or family'],
        pdfT: ['דוח תרופות שבועי', 'تقرير الأدوية الأسبوعي', 'Raport săptămânal de medicamente', 'Rapport hebdomadaire des médicaments', 'Weekly medicine report'],
        pdfFor: ['עבור {n}', 'لـ {n}', 'Pentru {n}', 'Pour {n}', 'For {n}'],
        pdfAdh: ['נלקחו בזמן', 'نسبة الالتزام', 'Luate', 'Pris', 'Taken on time'],
        pdfMeds: ['לפי תרופה', 'حسب الدواء', 'Pe medicament', 'Par médicament', 'By medicine'],
        pdfDays: ['יום אחרי יום', 'يومًا بيوم', 'Zi cu zi', 'Jour par jour', 'Day by day'],
        pdfFoot: ['הופק באפליקציית MedTime', 'أُنشئ بتطبيق MedTime', 'Creat cu MedTime', 'Créé avec MedTime', 'Made with the MedTime app'],
        pdfErr: ['לא הצלחתי ליצור את הקובץ. שולח את הדוח כטקסט.', 'تعذر إنشاء الملف. سيُرسل كنص.', 'Fișierul nu a putut fi creat. Se trimite ca text.', 'Fichier impossible à créer. Envoi en texte.', 'Could not make the file. Sending the report as text.'],
        famT: ['👨‍👩‍👧 התראה לבן משפחה', '👨‍👩‍👧 تنبيه لأحد أفراد العائلة', '👨‍👩‍👧 Alertă pentru familie', '👨‍👩‍👧 Alerte famille', '👨‍👩‍👧 Family alert'],
        famOn: ['פעיל: {n}', 'مفعّل: {n}', 'Activ: {n}', 'Actif : {n}', 'On: {n}'],
        famOff: ['כבוי', 'متوقف', 'Oprit', 'Désactivé', 'Off'],
        famX: ['אם תרופה לא אושרה שעה אחרי התזכורת, נשלחת הודעת SMS אחת מהטלפון הזה לבן המשפחה. בלי עלות מיוחדת (הודעת SMS רגילה).', 'إذا لم يُؤكَّد الدواء بعد ساعة من التذكير، تُرسل رسالة SMS واحدة من هذا الهاتف لفرد العائلة. بلا تكلفة خاصة.', 'Dacă un medicament nu e confirmat la o oră după memento, se trimite un SMS de pe acest telefon. Fără cost special.', 'Si un médicament n\'est pas confirmé une heure après le rappel, un SMS part de ce téléphone. Sans coût particulier.', 'If a medicine is not confirmed an hour after the reminder, one SMS goes from this phone to the family member. No special cost (a normal SMS).'],
        famPick: ['📇 בחירה מאנשי הקשר', '📇 اختيار من جهات الاتصال', '📇 Alege din contacte', '📇 Choisir dans les contacts', '📇 Pick from contacts'],
        famName: ['שם (למשל: דנה)', 'الاسم', 'Nume', 'Nom', 'Name'],
        famPhone: ['מספר טלפון', 'رقم الهاتف', 'Telefon', 'Téléphone', 'Phone number'],
        famSw: ['לשלוח התראה כשתרופה לא נלקחה', 'إرسال تنبيه عند عدم تناول الدواء', 'Trimite alertă', 'Envoyer l\'alerte', 'Send the alert when a medicine is missed'],
        famTest: ['✉️ שליחת הודעת ניסיון', '✉️ إرسال رسالة تجربة', '✉️ Trimite un test', '✉️ Envoyer un test', '✉️ Send a test message'],
        famTestMsg: ['MedTime: זו הודעת ניסיון. אם תרופה לא תאושר שעה אחרי התזכורת, תקבל/י כאן הודעה.', 'MedTime: هذه رسالة تجربة. إن لم يُؤكَّد دواء بعد ساعة ستصلك رسالة هنا.', 'MedTime: mesaj de test. Dacă un medicament nu e confirmat într-o oră, primiți un mesaj aici.', 'MedTime : message de test. Si un médicament n\'est pas confirmé dans l\'heure, vous recevrez un message ici.', 'MedTime: this is a test. If a medicine is not confirmed within an hour of its reminder, you will get a message here.'],
        famSent: ['✅ ההודעה נשלחה', '✅ أُرسلت الرسالة', '✅ Trimis', '✅ Envoyé', '✅ Message sent'],
        famNoPerm: ['צריך לאשר ל-MedTime לשלוח SMS. לחצו "אישור" בחלון שייפתח.', 'يجب السماح لـ MedTime بإرسال SMS. اضغط "سماح".', 'Permiteți MedTime să trimită SMS.', 'Autorisez MedTime à envoyer des SMS.', 'MedTime needs permission to send SMS. Tap "Allow" in the window that opens.'],
        famNoPhone: ['חסר מספר טלפון', 'رقم الهاتف ناقص', 'Lipsește numărul', 'Numéro manquant', 'Phone number missing'],
        famFail: ['ההודעה לא נשלחה. בדקו את המספר ושיש קליטה.', 'لم تُرسل الرسالة. تحقق من الرقم والتغطية.', 'Nu s-a trimis. Verificați numărul și semnalul.', 'Non envoyé. Vérifiez le numéro et le réseau.', 'Not sent. Check the number and the signal.'],
        repHead: ['דוח לקיחת תרופות מ-MedTime (30 יום אחרונים)', 'تقرير تناول الأدوية من MedTime (آخر 30 يومًا)', 'Raport MedTime (ultimele 30 de zile)', 'Rapport MedTime (30 derniers jours)', 'MedTime medicine report (last 30 days)'],
        bakT: ['💾 גיבוי ושחזור', '💾 نسخ احتياطي واستعادة', '💾 Copie de rezervă', '💾 Sauvegarde', '💾 Backup & restore'],
        bakSub: ['גיבוי אחרון: {d}', 'آخر نسخة: {d}', 'Ultima copie: {d}', 'Dernière : {d}', 'Last backup: {d}'],
        never: ['עוד לא גובה', 'لم يُنسخ بعد', 'niciodată', 'jamais', 'never'],
        bakX: ['התזכורות, התורים, היומן וההגדרות נשמרים רק בטלפון הזה. שמרו עותק ב-Google Drive, במייל או בוואטסאפ לעצמכם. בטלפון חדש לוחצים "שחזור" ובוחרים את הקובץ.', 'التذكيرات والمواعيد والسجل والإعدادات محفوظة في هذا الهاتف فقط. احفظ نسخة في Google Drive أو البريد أو واتساب. في هاتف جديد اضغط "استعادة" واختر الملف.', 'Mementourile, programările, jurnalul și setările sunt doar în acest telefon. Salvați o copie în Google Drive, e-mail sau WhatsApp. Pe un telefon nou apăsați „Restaurează” și alegeți fișierul.', 'Rappels, rendez-vous, journal et réglages ne sont que dans ce téléphone. Gardez une copie sur Google Drive, par e-mail ou WhatsApp. Sur un nouveau téléphone, « Restaurer » et choisissez le fichier.', 'Reminders, appointments, the log and settings live only on this phone. Keep a copy in Google Drive, mail or WhatsApp. On a new phone tap "Restore" and pick the file.'],
        bakGo: ['💾 שמירת גיבוי עכשיו', '💾 احفظ نسخة الآن', '💾 Salvează copia acum', '💾 Sauvegarder maintenant', '💾 Save a backup now'],
        resGo: ['📂 שחזור מקובץ גיבוי', '📂 استعادة من ملف', '📂 Restaurează din fișier', '📂 Restaurer depuis un fichier', '📂 Restore from a backup file'],
        resQ: ['לשחזר את הגיבוי מ-{d}? הוא יחליף את התזכורות, התורים וההגדרות שיש עכשיו בטלפון.', 'استعادة النسخة من {d}؟ ستحل محل التذكيرات والمواعيد والإعدادات الحالية.', 'Restaurați copia din {d}? Înlocuiește mementourile, programările și setările actuale.', 'Restaurer la sauvegarde du {d} ? Elle remplace les rappels, rendez-vous et réglages actuels.', 'Restore the backup from {d}? It replaces the reminders, appointments and settings now on the phone.'],
        resOk: ['שחזור', 'استعادة', 'Restaurează', 'Restaurer', 'Restore'],
        resBad: ['זה לא קובץ גיבוי של MedTime. בחרו את הקובץ ששמרתם מ"שמירת גיבוי".', 'هذا ليس ملف نسخة MedTime. اختر الملف الذي حفظته.', 'Nu e o copie MedTime. Alegeți fișierul salvat.', 'Ce n\'est pas une sauvegarde MedTime. Choisissez le fichier enregistré.', 'This is not a MedTime backup. Pick the file you saved with "Save a backup".'],
        resDone: ['✅ השחזור הצליח! האפליקציה נטענת מחדש.', '✅ تمت الاستعادة! يُعاد التحميل.', '✅ Restaurat! Se reîncarcă.', '✅ Restauré ! Rechargement.', '✅ Restored! Reloading the app.'],
        shT: ['📤 שתפו את MedTime', '📤 شارك MedTime', '📤 Distribuie MedTime', '📤 Partager MedTime', '📤 Share MedTime'],
        shSub: ['שלחו לחברים ולמשפחה', 'أرسل للأصدقاء والعائلة', 'Trimiteți prietenilor', 'Envoyer à vos proches', 'Send to friends and family'],
        shX: ['ההודעה הזאת תישלח, עם קישור להורדה:', 'سيتم إرسال هذه الرسالة مع رابط التنزيل:', 'Se trimite acest mesaj cu link de descărcare:', 'Ce message sera envoyé avec le lien :', 'This message is sent, with a download link:'],
        shGo: ['📤 שיתוף בוואטסאפ או בכל דרך', '📤 مشاركة عبر واتساب أو غيره', '📤 Distribuie pe WhatsApp sau altfel', '📤 Partager par WhatsApp ou autre', '📤 Share by WhatsApp or any way'],
        shMsg: ['היי 😊 אני משתמש ב-MedTime, אפליקציה שמזכירה לקחת תרופות ולהגיע לתורים לרופא. מומלץ!\n\nלהתקנה לוחצים על הקישור, ואם הטלפון שואל, מאשרים התקנה. האפליקציה מסבירה לבד על מה ללחוץ:\n',
            'مرحبًا 😊 أستخدم MedTime، تطبيق يذكّر بتناول الأدوية ومواعيد الطبيب. أنصح به!\n\nللتثبيت اضغط على الرابط، وإن سأل الهاتف وافق على التثبيت. التطبيق يشرح بنفسه:\n',
            'Salut 😊 Folosesc MedTime, o aplicație care amintește de medicamente și programări. O recomand!\n\nPentru instalare apăsați linkul și, dacă telefonul întreabă, permiteți instalarea:\n',
            'Salut 😊 J\'utilise MedTime, une appli qui rappelle les médicaments et les rendez-vous. Je recommande !\n\nPour l\'installer, ouvrez le lien et, si le téléphone demande, autorisez l\'installation :\n',
            'Hi 😊 I use MedTime, an app that reminds you to take medicine and go to doctor appointments. Recommended!\n\nTo install, open the link and, if the phone asks, allow the install. The app explains the rest:\n']
    };
    const tx = k => (T[k] || [k])[li()];
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
    const strip = s => s.replace(/^\S+\s/, '');
    const vib = () => { if (navigator.vibrate) try { navigator.vibrate(12); } catch (e) { } };

    const css = document.createElement('style');
    css.textContent = `
    .mo-btn{display:block;width:100%;border:0;border-radius:16px;padding:14px 12px;margin:10px 0 0;font-size:1.08rem;font-weight:700;color:#fff;
      background:linear-gradient(135deg,#0ea5e9,#6366f1);box-shadow:inset 0 2px 1px rgba(255,255,255,.35),0 6px 16px rgba(0,0,0,.45)}
    .mo-btn.alt{background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.25)}
    .mo-x{font-size:.98rem;line-height:1.5;opacity:.9;margin:4px 0 6px}
    .mo-msg{white-space:pre-wrap;font-size:.92rem;line-height:1.45;background:rgba(255,255,255,.08);border-radius:14px;padding:10px 12px;margin:6px 0}
    .lg-sum{display:flex;gap:8px;margin:6px 0 10px}
    .lg-sum div{flex:1;text-align:center;border-radius:14px;padding:8px 4px;background:rgba(255,255,255,.07);font-size:.85rem}
    .lg-sum b{display:block;font-size:1.5rem}
    .lg-day{margin:12px 0 4px;font-weight:800;color:#67e8f9;font-size:1rem}
    .lg-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.05);margin:4px 0;font-size:1rem}
    .lg-row .tm{font-weight:800;min-width:3.2em;direction:ltr}
    .lg-row .it{flex:1;line-height:1.3}
    .lg-row .st{font-weight:700;white-space:nowrap}
    .lg-row.taken .st{color:#4ade80}.lg-row.skipped .st{color:#fbbf24}.lg-row.missed .st{color:#f87171}
    .lg-list{max-height:46vh;overflow:auto}`;
    document.head.appendChild(css);

    function tile(id, ico, grad, bodyHtml) {
        const s = document.createElement('section');
        s.className = 'set-tile x-tile'; s.id = id;
        s.style.setProperty('--g', grad);
        s.innerHTML = '<button type="button" class="set-tile-head" onclick="toggleTile(this)"><span class="set-ico">' + ico +
            '</span><span class="set-txt"><span class="set-title"></span><span class="set-sub"></span></span><span class="set-chev">⌄</span></button>' +
            '<div class="set-body"><div class="panel-head"><span class="grip"></span><span class="p-ico">' + ico +
            '</span><span class="p-title"></span><button type="button" class="p-close" aria-label="close">✕</button></div>' + bodyHtml + '</div>';
        s.querySelector('.p-close').onclick = () => closeTiles();
        s.querySelector('.p-ico').style.setProperty('--g', grad);
        grid.appendChild(s);
        return s;
    }
    const heads = (el, k, sub) => {
        el.querySelector('.set-title').textContent = strip(tx(k));
        el.querySelector('.p-title').textContent = strip(tx(k));
        el.querySelector('.set-sub').textContent = sub;
    };

    // ---------------- 📒 log ----------------
    const logT = tile('tile-log', '📒', 'linear-gradient(135deg,#34d399,#0f766e)',
        '<div class="lg-sum" id="lg-sum"></div><div class="lg-list" id="lg-list"></div><button type="button" class="mo-btn" id="lg-pdf"></button><button type="button" class="mo-btn alt" id="lg-send"></button>');
    const readLog = () => { try { return has('getLog') ? JSON.parse(N.getLog()) || [] : []; } catch (e) { return []; } };
    const dayKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    function dayName(k) {
        const now = new Date(), y = new Date(Date.now() - 864e5);
        if (k === dayKey(now)) return tx('today');
        if (k === dayKey(y)) return tx('yest');
        const p = k.split('-'), d = new Date(+p[0], p[1] - 1, +p[2]);
        try { return d.toLocaleDateString(L5[li()], { weekday: 'long', day: 'numeric', month: 'numeric' }); } catch (e) { return k; }
    }
    const ICON = { taken: '✅', skipped: '✖️', missed: '❌' };
    function drawLog() {
        const log = readLog();
        const since = dayKey(new Date(Date.now() - 6 * 864e5));
        const wk = log.filter(e => e.d >= since);
        const c = s => wk.filter(e => e.s === s).length;
        heads(logT, 'logT', wk.length ? fill(tx('logSub'), { a: c('taken'), b: wk.length }) : strip(tx('week')));
        const sum = document.getElementById('lg-sum'), list = document.getElementById('lg-list'), send = document.getElementById('lg-send');
        send.textContent = tx('send');
        send.style.display = log.length && has('shareText') ? '' : 'none';
        const pdf = document.getElementById('lg-pdf'); // M-099
        pdf.textContent = tx('pdf');
        pdf.style.display = log.length && has('shareReportPdf') ? '' : 'none';
        if (!log.length) { sum.innerHTML = ''; list.innerHTML = '<div class="mo-x"></div>'; list.firstChild.textContent = tx('logEmpty'); return; }
        sum.innerHTML = '';
        [['taken', '✅'], ['skipped', '✖️'], ['missed', '❌']].forEach(([s, i]) => {
            const d = document.createElement('div'); d.innerHTML = '<b></b><span></span>';
            d.querySelector('b').textContent = i + ' ' + c(s); d.querySelector('span').textContent = tx(s); sum.appendChild(d);
        });
        list.innerHTML = '';
        let last = '';
        log.slice().reverse().filter(e => e.d >= dayKey(new Date(Date.now() - 30 * 864e5))).forEach(e => {
            if (e.d !== last) { last = e.d; const h = document.createElement('div'); h.className = 'lg-day'; h.textContent = dayName(e.d); list.appendChild(h); }
            const r = document.createElement('div'); r.className = 'lg-row ' + e.s;
            r.innerHTML = '<span class="tm"></span><span class="it"></span><span class="st"></span>';
            r.querySelector('.tm').textContent = e.t;
            r.querySelector('.it').textContent = (e.items || []).join(', ');
            r.querySelector('.st').textContent = (ICON[e.s] || '') + ' ' + tx(e.s);
            list.appendChild(r);
        });
    }
    document.getElementById('lg-send').onclick = () => {
        vib();
        const log = readLog().filter(e => e.d >= dayKey(new Date(Date.now() - 30 * 864e5)));
        let out = tx('repHead') + '\n', last = '';
        log.forEach(e => {
            if (e.d !== last) { last = e.d; out += '\n' + e.d + '\n'; }
            out += (ICON[e.s] || '') + ' ' + e.t + '  ' + (e.items || []).join(', ') + ' (' + tx(e.s) + ')\n';
        });
        N.shareText(out);
    };
    // M-099: weekly report as a designed PDF
    const COLOR = { taken: '#16a34a', skipped: '#d97706', missed: '#dc2626' };
    document.getElementById('lg-pdf').onclick = () => {
        vib();
        const since = dayKey(new Date(Date.now() - 6 * 864e5));
        const wk = readLog().filter(e => e.d >= since);
        const c = st => wk.filter(e => e.s === st).length;
        const pct = wk.length ? Math.round(c('taken') * 100 / wk.length) : 0;
        const per = {};
        wk.forEach(e => (e.items || []).forEach(it => { const p = per[it] || (per[it] = [0, 0]); p[1]++; if (e.s === 'taken') p[0]++; }));
        const meds = Object.keys(per).sort().map(k => [k, per[k][0] + '/' + per[k][1], Math.round(per[k][0] * 100 / per[k][1])]);
        const byDay = {};
        wk.forEach(e => (byDay[e.d] = byDay[e.d] || []).push(e));
        const days = Object.keys(byDay).sort().reverse().map(d => ({
            h: dayName(d) + '  ·  ' + d.split('-').reverse().join('.'),
            rows: byDay[d].sort((a, b) => a.t < b.t ? -1 : 1).map(e => [e.t, (e.items || []).join(', '), (ICON[e.s] || '') + ' ' + tx(e.s), COLOR[e.s] || '#0f172a'])
        }));
        let who = ''; try { who = localStorage.getItem('medtime_name') || ''; } catch (e) { }
        const fmt = k => k.split('-').reverse().join('.');
        const range = fmt(since) + ' – ' + fmt(dayKey(new Date()));
        const model = {
            rtl: li() <= 1, title: tx('pdfT'), sub: (who ? fill(tx('pdfFor'), { n: who }) + '   ·   ' : '') + range,
            stats: [[tx('pdfAdh'), pct + '%', pct >= 90 ? '#16a34a' : pct >= 70 ? '#d97706' : '#dc2626'],
                [tx('taken'), String(c('taken')), '#16a34a'], [tx('skipped'), String(c('skipped')), '#d97706'], [tx('missed'), String(c('missed')), '#dc2626']],
            medsHead: tx('pdfMeds'), meds: meds, daysHead: tx('pdfDays'), days: days, foot: tx('pdfFoot')
        };
        let ok = false;
        try { ok = N.shareReportPdf('MedTime-report-' + dayKey(new Date()) + '.pdf', JSON.stringify(model)); } catch (e) { }
        if (!ok) { if (window.mtAlert) mtAlert(tx('pdfErr')); document.getElementById('lg-send').click(); }
    };
    logT.querySelector('.set-tile-head').addEventListener('click', drawLog);

    // ---------------- 👨‍👩‍👧 family alert (M-100) ----------------
    const fam = tile('tile-family', '👨‍👩‍👧', 'linear-gradient(135deg,#f472b6,#be185d)',
        '<div class="mo-x" id="fm-x"></div><button type="button" class="mo-btn alt" id="fm-pick"></button>' +
        '<input class="fm-in" id="fm-name" autocomplete="off"><input class="fm-in" id="fm-phone" type="tel" dir="ltr" autocomplete="off">' +
        '<div class="vb-nag fm-row"><span id="fm-swl"></span><button type="button" class="vb-sw" id="fm-sw"></button></div>' +
        '<button type="button" class="mo-btn" id="fm-test"></button>');
    const famCss = document.createElement('style');
    famCss.textContent = `.fm-in{display:block;width:100%;box-sizing:border-box;margin:10px 0 0;padding:13px 14px;border-radius:14px;border:1.5px solid rgba(255,255,255,.25);
      background:rgba(255,255,255,.08);color:#fff;font-size:1.08rem}
    .fm-in::placeholder{color:rgba(255,255,255,.55)}
    .fm-row{margin-top:12px}`;
    document.head.appendChild(famCss);
    const famGet = () => { try { return JSON.parse(N.getFamily()); } catch (e) { return { name: '', phone: '', on: false, perm: false }; } };
    const famSave = on => { try { N.setFamily(document.getElementById('fm-name').value, document.getElementById('fm-phone').value, on); } catch (e) { } };
    function drawFam() {
        if (!has('getFamily')) { fam.style.display = 'none'; return; }
        const f = famGet();
        heads(fam, 'famT', f.on && f.phone ? fill(tx('famOn'), { n: f.name || f.phone }) : tx('famOff'));
        document.getElementById('fm-x').textContent = tx('famX');
        document.getElementById('fm-pick').textContent = tx('famPick');
        const nm = document.getElementById('fm-name'), ph = document.getElementById('fm-phone');
        nm.placeholder = tx('famName'); ph.placeholder = tx('famPhone');
        if (document.activeElement !== nm) nm.value = f.name || '';
        if (document.activeElement !== ph) ph.value = f.phone || '';
        document.getElementById('fm-swl').textContent = tx('famSw');
        document.getElementById('fm-sw').classList.toggle('on', !!(f.on && f.perm));
        document.getElementById('fm-test').textContent = tx('famTest');
    }
    const famInput = () => famSave(document.getElementById('fm-sw').classList.contains('on'));
    document.getElementById('fm-name').addEventListener('change', () => { famInput(); drawFam(); });
    document.getElementById('fm-phone').addEventListener('change', () => { famInput(); drawFam(); });
    document.getElementById('fm-pick').onclick = () => { vib(); if (has('pickContact')) N.pickContact(); };
    window.mtContact = function (name, phone) {
        document.getElementById('fm-name').value = name || '';
        document.getElementById('fm-phone').value = (phone || '').replace(/[^\d+]/g, '');
        famSave(true);
        if (!famGet().perm) N.requestSms();
        drawFam();
    };
    document.getElementById('fm-sw').onclick = () => {
        vib();
        const turnOn = !document.getElementById('fm-sw').classList.contains('on');
        if (turnOn && !document.getElementById('fm-phone').value.trim()) { if (window.mtAlert) mtAlert(tx('famNoPhone')); return; }
        famSave(turnOn);
        if (turnOn && !famGet().perm) { if (window.mtAlert) mtAlert(tx('famNoPerm')); N.requestSms(); }
        drawFam();
    };
    document.getElementById('fm-test').onclick = () => {
        vib();
        famInput();
        const f = famGet();
        if (!f.phone) { if (window.mtAlert) mtAlert(tx('famNoPhone')); return; }
        if (!f.perm) { if (window.mtAlert) mtAlert(tx('famNoPerm')); N.requestSms(); return; }
        const ok = N.testFamily(tx('famTestMsg'));
        if (window.mtAlert) mtAlert(ok ? tx('famSent') : tx('famFail'), ok ? '✅' : '⚠️');
    };
    const prevRes = window.mtResumed;
    window.mtResumed = function () { if (typeof prevRes === 'function') try { prevRes(); } catch (e) { } drawFam(); };

    // ---------------- 💾 backup ----------------
    const BK = 'medtime_lastbackup';
    const bak = tile('tile-bak', '💾', 'linear-gradient(135deg,#60a5fa,#1d4ed8)',
        '<div class="mo-x" id="bk-x"></div><button type="button" class="mo-btn" id="bk-save"></button><button type="button" class="mo-btn alt" id="bk-load"></button>');
    const fmtDate = ms => { try { return new Date(ms).toLocaleDateString(L5[li()], { day: 'numeric', month: 'numeric', year: 'numeric' }); } catch (e) { return ''; } };
    function drawBak() {
        let lastB = 0; try { lastB = +localStorage.getItem(BK) || 0; } catch (e) { }
        heads(bak, 'bakT', fill(tx('bakSub'), { d: lastB ? fmtDate(lastB) : tx('never') }));
        document.getElementById('bk-x').textContent = tx('bakX');
        document.getElementById('bk-save').textContent = tx('bakGo');
        document.getElementById('bk-load').textContent = tx('resGo');
        document.getElementById('bk-save').style.display = has('exportBackup') ? '' : 'none';
        document.getElementById('bk-load').style.display = has('pickBackup') ? '' : 'none';
    }
    document.getElementById('bk-save').onclick = () => {
        vib();
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.indexOf('medtime') === 0 && k !== BK) data[k] = localStorage.getItem(k);
        }
        const now = Date.now();
        const file = { app: 'MedTime', v: 1, created: now, data: data, log: readLog() };
        const name = 'MedTime-backup-' + dayKey(new Date(now)) + '.json';
        if (N.exportBackup(name, JSON.stringify(file))) { try { localStorage.setItem(BK, String(now)); } catch (e) { } drawBak(); }
    };
    document.getElementById('bk-load').onclick = () => { vib(); N.pickBackup(); };
    window.mtRestore = function (text) {
        let f = null;
        try { f = JSON.parse(text); } catch (e) { }
        if (!f || f.app !== 'MedTime' || !f.data || typeof f.data !== 'object') { if (window.mtAlert) mtAlert(tx('resBad')); return; }
        const go = window.mtDialog ? mtDialog({ icon: '📂', text: fill(tx('resQ'), { d: fmtDate(f.created) }), ok: tx('resOk') }) : Promise.resolve(true);
        go.then(ok => {
            if (!ok) return;
            Object.keys(localStorage).filter(k => k.indexOf('medtime') === 0 && k !== BK && k !== 'medtime_setup').forEach(k => localStorage.removeItem(k));
            Object.keys(f.data).forEach(k => { if (k.indexOf('medtime') === 0 && typeof f.data[k] === 'string') localStorage.setItem(k, f.data[k]); });
            if (Array.isArray(f.log) && has('setLog')) N.setLog(JSON.stringify(f.log));
            const done = window.mtAlert ? mtAlert(tx('resDone'), '✅') : Promise.resolve();
            Promise.resolve(done).then(() => location.reload());
        });
    };

    // ---------------- 📤 share ----------------
    const sh = tile('tile-share', '📤', 'linear-gradient(135deg,#25d366,#128c7e)',
        '<div class="mo-x" id="sh-x"></div><div class="mo-msg" id="sh-msg"></div><button type="button" class="mo-btn" id="sh-go"></button>');
    const shareMsg = () => tx('shMsg') + LINK;
    function drawShare() {
        heads(sh, 'shT', tx('shSub'));
        document.getElementById('sh-x').textContent = tx('shX');
        document.getElementById('sh-msg').textContent = shareMsg();
        document.getElementById('sh-go').textContent = tx('shGo');
        document.getElementById('sh-go').style.display = has('shareText') ? '' : 'none';
    }
    document.getElementById('sh-go').onclick = () => { vib(); N.shareText(shareMsg()); };

    window.moreRender = function () { drawLog(); drawFam(); drawBak(); drawShare(); };
    moreRender();
})();
