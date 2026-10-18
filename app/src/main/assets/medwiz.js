// M-050: new medicine reminder as a step-by-step wizard on its own screen.
// Steps: type, name, dose, another medicine?, time, days, summary + save.
// Re-uses the existing item rows, dose picker, time sheet and save logic of index.html.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const TX = {
        title: ['תזכורת חדשה', 'تذكير جديد', 'Memento nou', 'Nouveau rappel', 'New reminder'],
        s0: ['1. איזה סוג תרופה?', '1. ما نوع الدواء؟', '1. Ce tip de medicament?', '1. Quel type ?', '1. What kind of medicine?'],
        s1: ['2. מה שם התרופה?', '2. ما اسم الدواء؟', '2. Numele medicamentului?', '2. Nom du médicament ?', '2. Medicine name?'],
        s2: ['3. מה המינון?', '3. ما الجرعة؟', '3. Ce doză?', '3. Quelle dose ?', '3. What dose?'],
        s3: ['4. עוד תרופה באותה שעה?', '4. دواء آخر في نفس الوقت؟', '4. Alt medicament la aceeași oră?', '4. Un autre à la même heure ?', '4. Another medicine at the same time?'],
        s4: ['5. באיזו שעה?', '5. في أي ساعة؟', '5. La ce oră?', '5. À quelle heure ?', '5. What time?'],
        s5: ['6. באילו ימים?', '6. في أي أيام؟', '6. În ce zile?', '6. Quels jours ?', '6. Which days?'],
        s6: ['7. סיכום', '7. ملخص', '7. Rezumat', '7. Résumé', '7. Summary'],
        next: ['הבא ⬅', 'التالي ⬅', 'Înainte ➡', 'Suivant ➡', 'Next ➡'],
        back: ['➡ הקודם', '➡ السابق', '⬅ Înapoi', '⬅ Retour', '⬅ Back'],
        done: ['סיום', 'إنهاء', 'Gata', 'Terminé', 'Done'],
        save: ['שמור תזכורת', 'حفظ التذكير', 'Salvează mementoul', 'Enregistrer le rappel', 'Save reminder'],
        saved: ['✅ התזכורת נשמרה', '✅ تم حفظ التذكير', '✅ Memento salvat', '✅ Rappel enregistré', '✅ Reminder saved'],
        doseOpt: ['לא חובה. נגיעה בשדה פותחת בחירת מינון', 'اختياري. المس الحقل لاختيار الجرعة', 'Opțional. Atinge câmpul pentru doză', 'Facultatif. Touchez le champ pour la dose', 'Optional. Tap the field to pick a dose'],
        moreNote: ['אם אין עוד תרופה, לחצו "הבא"', 'إذا لا يوجد دواء آخر اضغط "التالي"', 'Dacă nu mai e altul, apasă „Înainte”', 'Sinon, appuyez sur « Suivant »', 'If not, tap "Next"'],
        otherTime: ['⏰ שעה אחרת', '⏰ ساعة أخرى', '⏰ Altă oră', '⏰ Autre heure', '⏰ Other time'],
        pickTime: ['בחרו שעה', 'اختر الساعة', 'Alegeți ora', "Choisissez l'heure", 'Pick a time'],
        needTime: ['בחרו שעה לתזכורת', 'اختر وقت التذكير', 'Alegeți ora', "Choisissez l'heure", 'Choose a time'],
        everyDayNote: ['בלי בחירה = כל יום', 'بدون اختيار = كل يوم', 'Fără alegere = zilnic', 'Sans choix = tous les jours', 'Nothing chosen = every day'],
        qMorning: ['בוקר', 'صباح', 'Dimineața', 'Matin', 'Morning'], qNoon: ['צהריים', 'ظهر', 'Prânz', 'Midi', 'Noon'],
        qEvening: ['ערב', 'مساء', 'Seara', 'Soir', 'Evening'], qNight: ['לילה', 'ليل', 'Noaptea', 'Nuit', 'Night']
    };
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const tx = k => (TX[k] || [k])[li()];
    const $ = id => document.getElementById(id);
    const page = $('med-page');
    if (!page) return;
    const LAST = 6;
    let step = 0;
    const vib = p => { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) { } };
    const QUICK = [['qMorning', '07:00'], ['qMorning', '08:00'], ['qMorning', '09:00'], ['qNoon', '12:00'], ['qNoon', '14:00'], ['qEvening', '18:00'], ['qEvening', '20:00'], ['qNight', '22:00']];

    // the day chips live in the wizard now
    const dayRow = $('day-row');
    if (dayRow) $('mw-days-slot').appendChild(dayRow);
    const sub = page.querySelector('.mw-submit .ba-txt');
    if (sub) sub.removeAttribute('data-i18n');

    const cur = () => (typeof openRow === 'function' ? openRow() : null);
    function ensureOpenRow() {
        let r = cur();
        if (!r) {
            const rows = itemRows.querySelectorAll('.item-row');
            if (rows.length) { r = rows[rows.length - 1]; expandRow(r); } else { addItemRow(); r = cur(); }
        }
        return r;
    }
    function drawChips() {
        const rows = [...itemRows.querySelectorAll('.item-row.collapsed')];
        $('mw-chips').innerHTML = '';
        rows.forEach(r => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'mw-chip';
            b.textContent = r.querySelector('.chip-ico').textContent + ' ' + r.querySelector('.chip-txt').textContent;
            b.onclick = () => { expandRow(r); step = 1; draw(); };
            $('mw-chips').appendChild(b);
        });
    }
    function drawTime() {
        const v = $('med-time').value;
        $('mw-time-big').textContent = v ? '⏰ ' + v : tx('pickTime');
        $('mw-time-big').classList.toggle('empty', !v);
        const q = $('mw-quick'); q.innerHTML = '';
        QUICK.forEach(([k, h]) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'af-chip' + (v === h ? ' sel' : '');
            b.innerHTML = '<span>' + tx(k) + '</span><b>' + h + '</b>';
            b.onclick = () => { setTime(h); vib(10); };
            q.appendChild(b);
        });
        $('time-btn').textContent = tx('otherTime');
    }
    function setTime(v) {
        $('med-time').value = v;
        drawTime();
    }
    window.mwOtherTime = function () {
        openTimePicker($('med-time').value || '08:00', v => setTime(v), true);
    };
    function drawDays() {
        if (typeof renderDayRow === 'function') renderDayRow();
        $('mw-days-text').textContent = (typeof selDays !== 'undefined' && selDays.length ? '📅 ' + daysText(selDays) : tx('everyDayNote'));
    }
    function drawSummary() {
        const rows = [...itemRows.querySelectorAll('.item-row')].filter(r => r.querySelector('.it-name').value.trim());
        const lines = ['<div class="s-when">⏰ ' + ($('med-time').value || '--:--') + ' · 📅 ' + daysText(typeof selDays !== 'undefined' ? selDays : []) + '</div>'];
        rows.forEach(r => {
            const n = r.querySelector('.it-name').value.trim(), d = r.querySelector('.it-dose').value.trim();
            lines.push('<div>' + (TYPE_ICON[r.dataset.type] || '💊') + ' ' + escapeHtml(n) + (d ? ' · ' + escapeHtml(d) : '') + '</div>');
        });
        $('mw-summary').innerHTML = '<div class="af-sum">' + lines.join('') + '</div>';
        if (sub) sub.textContent = tx('save');
    }
    function draw() {
        page.dataset.s = step;
        $('mw-title').textContent = tx('title');
        $('mw-step-title').textContent = tx('s' + step);
        const dots = $('mw-dots'); dots.innerHTML = '';
        for (let i = 0; i <= LAST; i++) {
            const d = document.createElement('button');
            d.type = 'button'; d.textContent = i + 1;
            d.className = i === step ? 'cur' : (i < step ? 'done' : '');
            d.onclick = () => { if (i > 1 && !nameOk()) return; jump(i); };
            dots.appendChild(d);
        }
        $('mw-back').textContent = tx('back');
        $('mw-back').disabled = step === 0;
        $('mw-next').textContent = tx('next');
        $('mw-next').style.display = step === LAST ? 'none' : '';
        page.querySelector('.wz-nav').classList.toggle('one', step === LAST);
        page.querySelector('.wz-body').scrollTop = 0;
        if (step <= 2) ensureOpenRow();
        if (step === 2) { const n = $('mw-dose-note'); if (n) n.textContent = tx('doseOpt'); }
        if (step === 3) { const r = cur(); if (r && r.querySelector('.it-name').value.trim()) collapseRow(r); drawChips(); $('mw-more-note').textContent = tx('moreNote'); }
        else drawChips();
        if (step === 4) drawTime();
        if (step === 5) drawDays();
        if (step === LAST) drawSummary();
        if (step === 1) setTimeout(() => { const r = cur(); if (r) r.querySelector('.it-name').focus(); }, 250);
    }
    function nameOk() {
        const any = [...itemRows.querySelectorAll('.item-row')].some(r => r.querySelector('.it-name').value.trim());
        if (!any) { step = 1; draw(); vib([30, 40, 30]); return false; }
        return true;
    }
    function jump(i) {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        step = Math.max(0, Math.min(LAST, i)); vib(10); draw();
    }
    window.mwGo = function (d) {
        if (d > 0 && step === 1) {
            const r = cur();
            if (!r || !r.querySelector('.it-name').value.trim()) { if (r) r.querySelector('.it-name').focus(); vib([30, 40, 30]); return; }
        }
        if (d > 0 && step === 4 && !$('med-time').value) { mtAlert(tx('needTime'), '⏰'); return; }
        if (d < 0 && step === 4) { jump(3); return; }
        jump(step + d);
    };
    window.mwAddMore = function () {
        const r = cur();
        if (r && r.querySelector('.it-name').value.trim()) collapseRow(r);
        if (!cur()) addItemRow();
        step = 0; draw();
    };
    // tapping a type goes on to the name
    itemRows.addEventListener('click', e => {
        if (step === 0 && e.target.closest('.type-btn')) setTimeout(() => jump(1), 220);
    });
    // "Enter" on the name goes to the dose
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && step === 1 && e.target.matches && e.target.matches('#med-page .it-name')) { e.preventDefault(); e.stopPropagation(); mwGo(1); }
    }, true);

    window.openMedPage = function () {
        step = 0;
        if (!itemRows.querySelector('.item-row')) addItemRow();
        page.classList.add('open'); document.documentElement.classList.add('med-open');
        // notes inside the steps
        const r = ensureOpenRow();
        draw();
        vib(12);
    };
    window.closeMedPage = function () {
        page.classList.remove('open'); document.documentElement.classList.remove('med-open');
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    };
    window.mwSaved = function () {
        closeMedPage();
        const d = document.createElement('div');
        d.className = 'mt-toast'; d.textContent = tx('saved');
        document.body.appendChild(d); setTimeout(() => d.remove(), 2700);
    };
    // notes placed once
    const doseNote = document.createElement('div'); doseNote.id = 'mw-dose-note'; doseNote.className = 'af-opt mw-dose-note';
    const moreNote = document.createElement('div'); moreNote.id = 'mw-more-note'; moreNote.className = 'af-opt mw-more-note';
    $('med-form').insertBefore(doseNote, $('item-rows').nextSibling);
    $('med-form').insertBefore(moreNote, page.querySelector('.btn-add-item').nextSibling);
    const doneTxt = () => { const d = $('list-done-txt'); if (d) d.textContent = tx('done'); };
    doneTxt();
    window.mwRender = function () { doneTxt(); if (page.classList.contains('open')) draw(); };
})();
