// M-050: new medicine reminder as a step-by-step wizard on its own screen.
// Steps: type, name, dose, another medicine?, time, days, summary + save.
// Re-uses the existing item rows, dose picker, time sheet and save logic of index.html.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const TX = {
        title: ['תזכורת חדשה', 'تذكير جديد', 'Memento nou', 'Nouveau rappel', 'New reminder', 'Новое напоминание'],
        s0: ['1. איזה סוג תרופה?', '1. ما نوع الدواء؟', '1. Ce tip de medicament?', '1. Quel type ?', '1. What kind of medicine?', '1. Какое лекарство?'],
        s1: ['2. מה שם התרופה?', '2. ما اسم الدواء؟', '2. Numele medicamentului?', '2. Nom du médicament ?', '2. Medicine name?', '2. Название лекарства?'],
        s2: ['3. מה המינון?', '3. ما الجرعة؟', '3. Ce doză?', '3. Quelle dose ?', '3. What dose?', '3. Какая доза?'],
        s3: ['4. עוד תרופה באותה שעה?', '4. دواء آخر في نفس الوقت؟', '4. Alt medicament la aceeași oră?', '4. Un autre à la même heure ?', '4. Another medicine at the same time?', '4. Ещё одно лекарство в то же время?'],
        s4: ['5. באיזו שעה?', '5. في أي ساعة؟', '5. La ce oră?', '5. À quelle heure ?', '5. What time?', '5. Во сколько?'],
        s5: ['6. באילו ימים?', '6. في أي أيام؟', '6. În ce zile?', '6. Quels jours ?', '6. Which days?', '6. В какие дни?'],
        s6: ['7. סיכום', '7. ملخص', '7. Rezumat', '7. Résumé', '7. Summary', '7. Итог'],
        next: ['הבא ⬅', 'التالي ⬅', 'Înainte ➡', 'Suivant ➡', 'Next ➡', 'Далее ➡'],
        back: ['➡ הקודם', '➡ السابق', '⬅ Înapoi', '⬅ Retour', '⬅ Back', '⬅ Назад'],
        done: ['סיום', 'إنهاء', 'Gata', 'Terminé', 'Done', 'Готово'],
        save: ['שמור תזכורת', 'حفظ التذكير', 'Salvează mementoul', 'Enregistrer le rappel', 'Save reminder', 'Сохранить напоминание'],
        saved: ['✅ התזכורת נשמרה', '✅ تم حفظ التذكير', '✅ Memento salvat', '✅ Rappel enregistré', '✅ Reminder saved', '✅ Напоминание сохранено'],
        doseOpt: ['לא חובה. נגיעה בשדה פותחת בחירת מינון', 'اختياري. المس الحقل لاختيار الجرعة', 'Opțional. Atinge câmpul pentru doză', 'Facultatif. Touchez le champ pour la dose', 'Optional. Tap the field to pick a dose', 'Необязательно. Нажмите на поле, чтобы выбрать дозу'],
        moreNote: ['אם אין עוד תרופה, לחצו "הבא"', 'إذا لا يوجد دواء آخر اضغط "التالي"', 'Dacă nu mai e altul, apasă „Înainte”', 'Sinon, appuyez sur « Suivant »', 'If not, tap "Next"', 'Если нет, нажмите «Далее»'],
        otherTime: ['⏰ שעה אחרת', '⏰ ساعة أخرى', '⏰ Altă oră', '⏰ Autre heure', '⏰ Other time', '⏰ Другое время'],
        pickTime: ['בחרו שעה', 'اختر الساعة', 'Alegeți ora', "Choisissez l'heure", 'Pick a time', 'Выберите время'],
        needTime: ['בחרו שעה לתזכורת', 'اختر وقت التذكير', 'Alegeți ora', "Choisissez l'heure", 'Choose a time', 'Выберите время'],
        everyDayNote: ['בלי בחירה = כל יום', 'بدون اختيار = كل يوم', 'Fără alegere = zilnic', 'Sans choix = tous les jours', 'Nothing chosen = every day', 'Ничего не выбрано = каждый день'],
        // M-101: edit an existing reminder (add / remove medicines, change time or days)
        editTitle: ['עריכת תזכורת', 'تعديل التذكير', 'Editează mementoul', 'Modifier le rappel', 'Edit reminder', 'Изменить напоминание'],
        saveEdit: ['שמירת השינויים', 'حفظ التغييرات', 'Salvează modificările', 'Enregistrer', 'Save changes', 'Сохранить изменения'],
        savedEdit: ['✅ השינויים נשמרו', '✅ تم حفظ التغييرات', '✅ Modificări salvate', '✅ Modifications enregistrées', '✅ Changes saved', '✅ Изменения сохранены'],
        edit: ['✏️ עריכה', '✏️ تعديل', '✏️ Editează', '✏️ Modifier', '✏️ Edit', '✏️ Изменить'],
        addMed: ['➕ להוסיף תרופה', '➕ إضافة دواء', '➕ Adaugă medicament', '➕ Ajouter un médicament', '➕ Add a medicine', '➕ Добавить лекарство'],
        tapHint: ['נגיעה בשורה משנה אותה', 'المس سطرًا لتغييره', 'Atingeți un rând pentru a-l schimba', 'Touchez une ligne pour la modifier', 'Tap a line to change it', 'Нажмите на строку, чтобы изменить'],
        // M-102: weekend mode - optional other time on Friday + Saturday
        wkTitle: ['🌴 מצב סופ״ש', '🌴 وضع نهاية الأسبوع', '🌴 Mod weekend', '🌴 Mode week-end', '🌴 Weekend mode', '🌴 Режим выходных'],
        wkSub: ['לא חובה: שעה אחרת לתזכורת הזו בשישי ושבת', 'اختياري: ساعة أخرى يومي الجمعة والسبت', 'Opțional: altă oră vineri și sâmbătă', 'Facultatif : autre heure le vendredi et samedi', 'Optional: another time on Friday and Saturday', 'Необязательно: другое время в пятницу и субботу'],
        wkPick: ['⏰ לבחור שעה לסופ״ש', '⏰ اختر ساعة لنهاية الأسبوع', '⏰ Alege ora de weekend', "⏰ Choisir l'heure du week-end", '⏰ Pick a weekend time', '⏰ Выберите время для выходных'],
        wkOn: ['🌴 בשישי-שבת: ', '🌴 الجمعة-السبت: ', '🌴 Vineri-sâmbătă: ', '🌴 Vendredi-samedi : ', '🌴 Fri-Sat: ', '🌴 Пт-Сб: '],
        wkCancel: ['✕ לבטל מצב סופ״ש', '✕ إلغاء', '✕ Anulează', '✕ Annuler', '✕ Turn off', '✕ Выключить'],
        // M-103: one weekend shift for all reminders
        wkAll: ['🌴 בסופ״ש (ו׳-ש׳) כל התזכורות:', '🌴 في نهاية الأسبوع كل التذكيرات:', '🌴 În weekend toate mementourile:', '🌴 Le week-end, tous les rappels :', '🌴 On the weekend all reminders:', '🌴 В выходные все напоминания:'],
        wkSame: ['באותה שעה', 'نفس الساعة', 'Aceeași oră', 'Même heure', 'Same time', 'То же время'],
        wkMin: ['30 דק׳', '30 د', '30 min', '30 min', '30 min', '30 мин'], wkH1: ['שעה', 'ساعة', '1 oră', '1 h', '1 h', '1 ч'],
        wkH15: ['שעה וחצי', 'ساعة ونصف', '1,5 ore', '1 h 30', '1.5 h', '1,5 ч'], wkH2: ['שעתיים', 'ساعتين', '2 ore', '2 h', '2 h', '2 ч'],
        wkNote: ['תזכורת עם שעת סופ״ש משלה (✏️) נשארת כמו שקבעתם', 'التذكير بوقت خاص به يبقى كما هو', 'Mementourile cu oră proprie rămân la fel', 'Un rappel avec sa propre heure reste ainsi', 'A reminder with its own weekend time keeps it', 'Напоминание со своим временем на выходные сохраняет его'],
        qMorning: ['בוקר', 'صباح', 'Dimineața', 'Matin', 'Morning', 'Утро'], qNoon: ['צהריים', 'ظهر', 'Prânz', 'Midi', 'Noon', 'Полдень'],
        qEvening: ['ערב', 'مساء', 'Seara', 'Soir', 'Evening', 'Вечер'], qNight: ['לילה', 'ليل', 'Noaptea', 'Nuit', 'Night', 'Ночь']
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
    // M-101: every line of the summary can be changed: time, days, each medicine (✏️ / ✕), and "add a medicine"
    function drawSummary() {
        const rows = [...itemRows.querySelectorAll('.item-row')].filter(r => r.querySelector('.it-name').value.trim());
        const box = document.createElement('div'); box.className = 'af-sum mw-sum-edit';
        const line = (cls, html, onTap) => {
            const d = document.createElement('div'); d.className = cls; d.innerHTML = html;
            if (onTap) d.onclick = e => { if (!e.target.closest('.mw-x')) { vib(10); onTap(); } };
            box.appendChild(d); return d;
        };
        line('s-when mw-tap', '⏰ ' + ($('med-time').value || '--:--') + ' <i>✏️</i>', () => jump(4));
        line('s-when mw-tap', '📅 ' + escapeHtml(daysText(typeof selDays !== 'undefined' ? selDays : [])) + ' <i>✏️</i>', () => jump(5));
        // M-102/M-104: weekend time in its own clear box (optional), only when the reminder rings on Fri or Sat
        const sd = typeof selDays !== 'undefined' ? selDays : [];
        let wkBox = null;
        if (!sd.length || sd.includes(5) || sd.includes(6)) {
            wkBox = document.createElement('div'); wkBox.className = 'mw-wk-box';
            const h = document.createElement('div'); h.className = 'wkb-h'; h.textContent = tx('wkTitle');
            const sb = document.createElement('div'); sb.className = 'wkb-sub'; sb.textContent = tx('wkSub');
            const inp = document.createElement('input'); inp.type = 'time'; inp.className = 'mw-wk-in'; inp.value = window.mwWk || '';
            const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'wkb-btn';
            const x = document.createElement('button'); x.type = 'button'; x.className = 'wkb-off'; x.textContent = tx('wkCancel');
            const paint = () => {
                btn.textContent = window.mwWk ? tx('wkOn') + window.mwWk + '  ✏️' : tx('wkPick');
                wkBox.classList.toggle('on', !!window.mwWk);
                x.style.display = window.mwWk ? '' : 'none';
            };
            x.onclick = () => { vib(12); window.mwWk = ''; inp.value = ''; paint(); };
            inp.onchange = () => { window.mwWk = inp.value === $('med-time').value ? '' : inp.value; paint(); };
            btn.onclick = () => { vib(10); if (!inp.value) inp.value = window.mwWk || $('med-time').value || '09:00'; try { inp.showPicker(); } catch (er) { inp.focus(); inp.click(); } };
            wkBox.append(h, sb, btn, x, inp); paint();
        }
        rows.forEach(r => {
            const n = r.querySelector('.it-name').value.trim(), d = r.querySelector('.it-dose').value.trim();
            const el = line('mw-tap mw-med', '<span>' + (TYPE_ICON[r.dataset.type] || '💊') + ' ' + escapeHtml(n) + (d ? ' · ' + escapeHtml(d) : '') +
                '</span><i>✏️</i>' + (rows.length > 1 ? '<button type="button" class="mw-x" aria-label="remove">✕</button>' : ''), () => {
                    const c = cur(); if (c && c !== r && c.querySelector('.it-name').value.trim()) collapseRow(c);
                    expandRow(r); step = 1; draw();
                });
            const x = el.querySelector('.mw-x');
            if (x) x.onclick = () => { vib([15, 30, 15]); r.remove(); numberRows(); draw(); };
        });
        const add = document.createElement('button'); add.type = 'button'; add.className = 'mw-add-med'; add.textContent = tx('addMed');
        add.onclick = () => { vib(12); window.mwAddMore(); };
        const hint = document.createElement('div'); hint.className = 'mw-hint'; hint.textContent = tx('tapHint');
        $('mw-summary').innerHTML = '';
        $('mw-summary').append(box, hint, add);
        if (wkBox) $('mw-summary').append(wkBox);
        if (sub) sub.textContent = tx(window.mwEditing ? 'saveEdit' : 'save');
    }
    function draw() {
        page.dataset.s = step;
        $('mw-title').textContent = tx(window.mwEditing ? 'editTitle' : 'title');
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

    function clearForm() {
        itemRows.innerHTML = '';
        $('med-time').value = '';
        if (typeof selDays !== 'undefined') selDays = [];
        window.mwWk = '';
        if (typeof resetTimeBtn === 'function') resetTimeBtn();
    }
    // M-103: weekend shift bar at the top of the reminders list
    window.drawWkBar = function () {
        const list = $('med-list'); if (!list) return;
        let bar = $('wk-bar');
        if (!bar) { bar = document.createElement('div'); bar.id = 'wk-bar'; list.parentNode.insertBefore(bar, list); }
        let cur = 0; try { cur = parseInt(localStorage.getItem('medtime_wkshift') || '0', 10) || 0; } catch (e) { }
        bar.innerHTML = '';
        const h = document.createElement('div'); h.className = 'wk-h'; h.textContent = tx('wkAll');
        const row = document.createElement('div'); row.className = 'wk-row';
        [[0, tx('wkSame')], [30, '+' + tx('wkMin')], [60, '+' + tx('wkH1')], [90, '+' + tx('wkH15')], [120, '+' + tx('wkH2')]].forEach(([v, l]) => {
            const b = document.createElement('button'); b.type = 'button'; b.className = 'af-chip' + (v === cur ? ' sel' : ''); b.textContent = l;
            b.onclick = () => {
                vib(12);
                try { localStorage.setItem('medtime_wkshift', String(v)); } catch (e) { }
                if (typeof saveMeds === 'function') saveMeds(loadMeds()); // re-book alarms + redraw
            };
            row.appendChild(b);
        });
        const n = document.createElement('div'); n.className = 'wk-note'; n.textContent = tx('wkNote');
        bar.append(h, row, n);
    };
    window.mwEditing = null;
    window.mwEditLabel = () => tx('edit');
    // M-101: open the wizard on the summary of an existing reminder, filled in
    window.editMed = function (idx) {
        const m = loadMeds()[idx];
        if (!m) return;
        clearForm();
        (m.items || []).forEach(it => {
            addItemRow();
            const r = itemRows.lastElementChild;
            r.dataset.type = it.type || 'pill';
            r.querySelectorAll('.type-btn').forEach(b => b.classList.toggle('sel', b.dataset.type === r.dataset.type));
            r.querySelector('.it-name').value = it.name || '';
            r.querySelector('.it-dose').value = it.dose || '';
            collapseRow(r);
        });
        $('med-time').value = m.time || '';
        selDays = (m.days || []).slice();
        window.mwWk = m.wk || '';
        window.mwEditing = m.id;
        if (typeof closeListPage === 'function') closeListPage();
        step = LAST;
        page.classList.add('open'); document.documentElement.classList.add('med-open');
        draw();
        vib(12);
    };

    window.openMedPage = function () {
        if (window.mwEditing) { window.mwEditing = null; clearForm(); }
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
        if (window.mwEditing) { window.mwEditing = null; clearForm(); addItemRow(); } // edit closed without saving: nothing changes
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    };
    window.mwSaved = function (edited) {
        closeMedPage();
        const d = document.createElement('div');
        d.className = 'mt-toast'; d.textContent = tx(edited ? 'savedEdit' : 'saved');
        document.body.appendChild(d); setTimeout(() => d.remove(), 2700);
    };
    const css = document.createElement('style');
    css.textContent = `.mw-sum-edit .mw-tap{display:flex;align-items:center;gap:8px;cursor:pointer;border-radius:12px;padding:6px 8px;margin:0 -8px;white-space:normal!important}
    .mw-sum-edit .mw-tap:active{background:rgba(255,255,255,.12)}
    .mw-sum-edit .mw-tap i{font-style:normal;font-size:.95rem;opacity:.75;margin-inline-start:auto}
    .mw-sum-edit .mw-med span{flex:1;overflow:hidden;text-overflow:ellipsis}
    .mw-sum-edit .mw-x{flex:none;width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(248,113,113,.7);background:rgba(127,29,29,.45);color:#fecaca;font-size:1rem;font-weight:800}
    .mw-add-med{display:block;width:100%;margin:12px 0 0;padding:13px;border-radius:16px;border:1.5px dashed rgba(103,232,249,.7);background:rgba(8,145,178,.18);color:#a5f3fc;font-size:1.1rem;font-weight:800}
    .mw-wk-box{margin:16px 0 4px;padding:16px;border-radius:22px;text-align:center;background:linear-gradient(135deg,rgba(250,204,21,.18),rgba(234,88,12,.14));border:2.5px solid #fbbf24;box-shadow:0 0 22px rgba(251,191,36,.25)}
    .mw-wk-box .wkb-h{font-size:1.35rem;font-weight:900;color:#fde68a}
    .mw-wk-box .wkb-sub{font-size:.95rem;opacity:.85;margin:4px 0 12px}
    .mw-wk-box .wkb-btn{width:100%;padding:14px;border-radius:999px;border:0;background:#fbbf24;color:#422006;font-size:1.2rem;font-weight:900}
    .mw-wk-box.on .wkb-btn{background:#fde68a}
    .mw-wk-box .wkb-off{margin-top:10px;background:none;border:0;color:#fca5a5;font-size:1rem;font-weight:700}
    .mw-wk-in{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none}
    #wk-bar{margin:0 14px 12px;padding:12px 14px;border-radius:18px;background:rgba(253,230,138,.08);border:1.5px solid rgba(253,230,138,.35)}
    #wk-bar .wk-h{font-weight:800;color:#fde68a;font-size:1.05rem;margin-bottom:8px}
    #wk-bar .wk-row{display:flex;flex-wrap:wrap;gap:8px}
    #wk-bar .af-chip{padding:8px 12px;border-radius:999px;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.06);color:#fff;font-weight:700;font-size:.95rem}
    #wk-bar .af-chip.sel{background:#fde68a;color:#422006;border-color:#fde68a}
    #wk-bar .wk-note{font-size:.82rem;opacity:.7;margin-top:8px}
    .mw-hint{text-align:center;font-size:.9rem;opacity:.7;margin-top:8px}`;
    document.head.appendChild(css);
    // notes placed once
    const doseNote = document.createElement('div'); doseNote.id = 'mw-dose-note'; doseNote.className = 'af-opt mw-dose-note';
    const moreNote = document.createElement('div'); moreNote.id = 'mw-more-note'; moreNote.className = 'af-opt mw-more-note';
    $('med-form').insertBefore(doseNote, $('item-rows').nextSibling);
    $('med-form').insertBefore(moreNote, page.querySelector('.btn-add-item').nextSibling);
    const doneTxt = () => { const d = $('list-done-txt'); if (d) d.textContent = tx('done'); };
    doneTxt();
    window.mwRender = function () { doneTxt(); if (page.classList.contains('open')) draw(); };
    if (typeof renderMeds === 'function') try { renderMeds(); } catch (e) { } // M-101: the list gets its ✏️ buttons
})();
