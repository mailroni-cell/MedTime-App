// M-147 / M-148 / M-149 (owner 2026-10-21): "taken early" and optional medicine photos on the reminder cards,
// and an optional 🌡️ vitals tile (blood pressure, sugar, pulse) with a 30-day chart, in the weekly PDF and the backup.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en', 'ru'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const has = f => !!(N && typeof N[f] === 'function');
    const vib = () => { try { navigator.vibrate && navigator.vibrate(12); } catch (e) { } };

    const T = {
        early: ['⏰ לקחתי כבר עכשיו', '⏰ تناولته الآن', '⏰ L-am luat deja', '⏰ Déjà pris', '⏰ Taken already', '⏰ Уже принял'],
        earlyQ: ['לסמן שלקחת עכשיו? התזכורת של היום ב-{t} לא תצלצל.', 'هل تناولته الآن؟ تذكير اليوم في {t} لن يرن.', 'Marchezi ca luat acum? Memento-ul de azi de la {t} nu va mai suna.', 'Marquer comme pris ? Le rappel de {t} aujourd\'hui ne sonnera pas.', 'Mark as taken now? Today\'s {t} reminder will stay quiet.', 'Отметить как принятое сейчас? Сегодняшнее напоминание в {t} будет беззвучным.'],
        earlyDone: ['✅ נרשם. התזכורת של {t} היום לא תצלצל.', '✅ تم التسجيل. تذكير {t} اليوم لن يرن.', '✅ Notat. Memento-ul de la {t} nu va suna azi.', '✅ Noté. Le rappel de {t} ne sonnera pas aujourd\'hui.', '✅ Saved. Today\'s {t} reminder will stay quiet.', '✅ Сохранено. Сегодняшнее напоминание в {t} будет беззвучным.'],
        earlyNone: ['לתזכורת הזו אין יותר צלצול היום.', 'لا يوجد تذكير آخر اليوم.', 'Nu mai e niciun memento azi.', 'Plus de rappel aujourd\'hui.', 'No more alarm today for this reminder.', 'Сегодня больше не будет сигнала для этого напоминания.'],
        earlyOn: ['✅ נלקח מוקדם היום', '✅ أُخذ مبكرًا اليوم', '✅ Luat mai devreme azi', '✅ Pris plus tôt aujourd\'hui', '✅ Taken early today', '✅ Сегодня принято заранее'],
        yes: ['כן, לקחתי', 'نعم، تناولته', 'Da, l-am luat', 'Oui, pris', 'Yes, taken', 'Да, принял'],
        no: ['ביטול', 'إلغاء', 'Anulează', 'Annuler', 'Cancel', 'Отмена'],
        photoAdd: ['📷 תמונה', '📷 صورة', '📷 Poză', '📷 Photo', '📷 Photo', '📷 Фото'],
        photoQ: ['תמונה של {n}', 'صورة {n}', 'Poza pentru {n}', 'Photo de {n}', 'Photo of {n}', 'Фото: {n}'],
        photoNew: ['📷 תמונה חדשה', '📷 صورة جديدة', '📷 Poză nouă', '📷 Nouvelle photo', '📷 New photo', '📷 Новое фото'],
        photoDel: ['🗑️ מחיקה', '🗑️ حذف', '🗑️ Șterge', '🗑️ Supprimer', '🗑️ Delete', '🗑️ Удалить'],
        photoDelQ: ['למחוק את התמונה של {n}?', 'حذف صورة {n}؟', 'Ștergi poza pentru {n}?', 'Supprimer la photo de {n} ?', 'Delete the photo of {n}?', 'Удалить фото {n}?'],
        photoErr: ['לא הצלחתי לשמור את התמונה. נסו שוב.', 'تعذر حفظ الصورة. حاول مرة أخرى.', 'Poza nu a putut fi salvată. Încearcă din nou.', 'Impossible d\'enregistrer la photo. Réessayez.', 'Could not save the photo. Please try again.', 'Не удалось сохранить фото. Попробуйте ещё раз.'],
        vT: ['🌡️ מדדים', '🌡️ القياسات', '🌡️ Măsurători', '🌡️ Mesures', '🌡️ Vitals', '🌡️ Показатели'],
        vSubNone: ['לחץ דם, סוכר, דופק', 'ضغط، سكر، نبض', 'Tensiune, glicemie, puls', 'Tension, glycémie, pouls', 'Blood pressure, sugar, pulse', 'Давление, сахар, пульс'],
        vSubLast: ['אחרון: {v}', 'الأخير: {v}', 'Ultima: {v}', 'Dernière : {v}', 'Last: {v}', 'Последнее: {v}'],
        bp: ['❤️ לחץ דם', '❤️ ضغط الدم', '❤️ Tensiune', '❤️ Tension', '❤️ Blood pressure', '❤️ Давление'],
        sugar: ['🩸 סוכר', '🩸 السكر', '🩸 Glicemie', '🩸 Glycémie', '🩸 Sugar', '🩸 Сахар'],
        pulse: ['💓 דופק', '💓 النبض', '💓 Puls', '💓 Pouls', '💓 Pulse', '💓 Пульс'],
        sys: ['עליון', 'الانقباضي', 'Sistolică', 'Systolique', 'Upper', 'Верхнее'],
        dia: ['תחתון', 'الانبساطي', 'Diastolică', 'Diastolique', 'Lower', 'Нижнее'],
        val: ['ערך', 'القيمة', 'Valoare', 'Valeur', 'Value', 'Значение'],
        save: ['💾 שמירה', '💾 حفظ', '💾 Salvează', '💾 Enregistrer', '💾 Save', '💾 Сохранить'],
        bad: ['נא להקליד מספר תקין', 'يرجى إدخال رقم صحيح', 'Introdu un număr valid', 'Entrez un nombre valide', 'Please type a valid number', 'Введите правильное число'],
        last30: ['30 הימים האחרונים', 'آخر 30 يومًا', 'Ultimele 30 de zile', '30 derniers jours', 'Last 30 days', 'Последние 30 дней'],
        empty: ['עוד אין מדידות. מקלידים מספר ולוחצים "שמירה".', 'لا توجد قياسات بعد.', 'Încă nu sunt măsurători.', 'Pas encore de mesures.', 'No measurements yet.', 'Пока нет измерений.'],
        note: ['הצבעים הם הכוונה כללית בלבד. מה תקין עבורכם קובע הרופא.', 'الألوان للإرشاد العام فقط. الطبيب يحدد ما هو طبيعي لك.', 'Culorile sunt doar orientative. Medicul stabilește ce e normal pentru tine.', 'Les couleurs sont indicatives. Votre médecin décide de ce qui est normal pour vous.', 'Colours are only a general guide. Your doctor decides what is normal for you.', 'Цвета — лишь общий ориентир. Что для вас норма, решает ваш врач.'],
        del: ['🗑️', '🗑️', '🗑️', '🗑️', '🗑️', '🗑️'],
        pdfV: ['מדדים', 'القياسات', 'Măsurători', 'Mesures', 'Vitals', 'Показатели'],
        done: ['✓ סיום', '✓ إنهاء', '✓ Gata', '✓ Terminé', '✓ Done', '✓ Готово']
    };
    const tx = k => (T[k] || [])[li()] || (T[k] || [])[0] || k;
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));

    const css = document.createElement('style');
    css.textContent = `
    .pl-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    .pl-early{border:1.5px solid #86efac!important;background:linear-gradient(135deg,#16a34a,#15803d)!important;color:#fff!important;border-radius:999px!important;padding:9px 14px!important;font-weight:800!important;font-size:1rem!important}
    .pl-on{display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(34,197,94,.18);color:#86efac;font-weight:800}
    .pl-cam{display:inline-flex!important;align-items:center;gap:8px;border:1.5px solid #7dd3fc!important;background:linear-gradient(135deg,#0ea5e9,#0369a1)!important;color:#fff!important;border-radius:999px!important;padding:8px 14px!important;font-size:.98rem!important;font-weight:800!important;min-height:44px}
    /* M-156: compact so the reminders list fits the page */
    .pl-row{gap:6px!important;margin-top:6px!important}
    .med-item.pl-wrap{flex-wrap:wrap!important}
    .list-page.pl-t1 .med-item{padding-top:8px!important;padding-bottom:8px!important}
    .list-page.pl-t1 .med-list{gap:8px!important}
    .list-page.pl-t1 .med-list > .med-item{margin-bottom:8px!important}
    .list-page.pl-t1 #wk-bar{padding:8px 12px!important;margin-bottom:8px!important}
    .list-page.pl-t2 #wk-bar .wk-note{display:none!important}
    .list-page.pl-t2 #wk-bar .af-chip{padding-top:5px!important;padding-bottom:5px!important}
    .list-page.pl-t2 .med-info h3{margin:0 0 2px!important;font-size:1.25rem!important}
    .list-page.pl-t2 .med-item .btn-edit, .list-page.pl-t2 .med-item .btn-delete{padding-top:4px!important;padding-bottom:4px!important;min-height:0!important}
    .med-item.pl-wrap > .pl-row{flex:1 0 100%;justify-content:flex-start}
    .pl-row .pl-cam,.pl-row .pl-early{min-height:34px!important;padding:4px 11px!important;font-size:.88rem!important}
    .pl-row .pl-on{padding:4px 10px;font-size:.88rem}
    .pl-row .pl-th{width:30px!important;height:30px!important;border-radius:8px!important;margin:-2px 0 -2px -4px!important}
    .pl-th{width:52px;height:52px;border-radius:12px;object-fit:cover;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);margin:-4px 0 -4px -6px}
    .vt-tabs{display:flex;gap:6px;margin:4px 0 10px}
    .vt-tabs button{flex:1;border:1.5px solid rgba(255,255,255,.25)!important;background:rgba(255,255,255,.07)!important;color:#fff!important;border-radius:14px!important;padding:10px 4px!important;font-weight:700!important;font-size:.95rem!important}
    .vt-tabs button.sel{background:linear-gradient(135deg,#f472b6,#db2777)!important;border-color:#fbcfe8!important}
    .vt-in{display:flex;gap:8px;align-items:flex-end}
    .vt-in label{flex:1;font-size:.85rem;opacity:.85}
    .vt-in input{width:100%;box-sizing:border-box;font-size:1.5rem;font-weight:800;text-align:center;padding:10px;border-radius:14px;border:1.5px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;direction:ltr}
    .vt-chart{width:100%;height:150px;margin:12px 0 4px;background:rgba(255,255,255,.05);border-radius:14px}
    /* M-157 (owner): the vitals panel fills the whole screen with no page scrolling; the chart takes the free height,
       only a long list of measurements scrolls inside its own box */
    #tile-vitals.open .set-body{top:0!important;max-height:none!important;height:100vh;height:100dvh;border-radius:0!important;display:flex!important;flex-direction:column;overflow:hidden!important;padding-top:calc(10px + env(safe-area-inset-top))!important}
    #tile-vitals.open .set-body > *{flex:none}
    #tile-vitals.open .vt-chart{flex:1 1 140px;min-height:70px;height:auto}
    #tile-vitals.open .vt-list{flex:0 1 auto;min-height:0;overflow-y:auto}
    #tile-vitals.open #vt-done{margin-top:10px!important}
    /* M-157 (owner): low-vision settings without scrolling: 2 columns, rows share the height, sizes follow the screen */
    html.lowvision #settings-page .set-grid{grid-template-rows:none!important;grid-auto-rows:minmax(0,1fr)!important;row-gap:6px!important;padding-bottom:calc(6px + env(safe-area-inset-bottom,0px))!important;align-content:stretch!important}
    html.lowvision #settings-page .set-grid > .set-tile{min-height:0!important;height:auto!important}
    html.lowvision #settings-page .set-grid .set-tile-head{gap:2px!important;padding:2px 1px 0!important;justify-content:center!important}
    html.lowvision #settings-page .set-grid .set-ico{width:min(14vw,5.4vh,72px)!important;height:min(14vw,5.4vh,72px)!important;font-size:min(7vw,2.8vh,2rem)!important;margin:0!important;flex:none}
    html.lowvision #settings-page .set-grid .set-title{font-size:min(1.15rem,4.6vw,2.2vh)!important;line-height:1.1!important;white-space:normal!important;text-align:center}
    html.lowvision #settings-page .set-grid .set-sub{display:none!important}
    .vt-list{max-height:30vh;overflow:auto}
    .vt-r{display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:12px;background:rgba(255,255,255,.05);margin:4px 0}
    .vt-r .d{flex:1;opacity:.8;font-size:.9rem}.vt-r b{font-size:1.15rem;direction:ltr}
    .vt-r button{border:0!important;background:none!important;font-size:1rem!important;padding:2px 6px!important}
    .vt-g{color:#4ade80}.vt-y{color:#facc15}.vt-rd{color:#f87171}`;
    document.head.appendChild(css);

    // ---------------- cards in "My reminders" ----------------
    const photoCache = {};
    const photoOf = name => {
        if (!has('getPhoto') || !name) return '';
        if (!(name in photoCache)) { try { photoCache[name] = N.getPhoto(name) || ''; } catch (e) { photoCache[name] = ''; } }
        return photoCache[name];
    };
    let photoPending = null;
    window.mtPhotoDone = function (ok) {
        if (photoPending) delete photoCache[photoPending];
        if (ok === false && photoPending && window.mtAlert) mtAlert(tx('photoErr'));
        photoPending = null;
        if (typeof renderMeds === 'function') renderMeds();
    };
    function pick(name) { vib(); photoPending = name; N.pickPhoto(name); }

    window.mtCardExtras = function (li, m) {
        if (!li || !m) return;
        // M-148 / M-150: photo per medicine (optional) - its own clear row under the medicines:
        // a thumbnail when there is a photo (tap: new photo / delete), else a big "📷 Photo: <name>" button
        const info = li.querySelector('.med-info') || li;
        if (has('pickPhoto')) {
            const prow = document.createElement('div'); prow.className = 'pl-row';
            (m.items || []).forEach(it => {
                if (!it || !it.name) return;
                const src = photoOf(it.name);
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'pl-cam';
                if (src) {
                    const img = document.createElement('img');
                    img.className = 'pl-th'; img.src = src; img.alt = '';
                    b.appendChild(img);
                    b.appendChild(document.createTextNode(it.name));
                    b.onclick = () => {
                        vib();
                        mtDialog({ title: fill(tx('photoQ'), { n: it.name }), icon: '📷', ok: tx('photoNew'), cancel: tx('photoDel') }).then(v => {
                            if (v) { pick(it.name); return; }
                            mtDialog({ text: fill(tx('photoDelQ'), { n: it.name }), danger: true, ok: tx('photoDel'), cancel: tx('no') }).then(d => {
                                if (!d) return;
                                try { N.deletePhoto(it.name); } catch (e) { }
                                delete photoCache[it.name]; renderMeds();
                            });
                        });
                    };
                } else {
                    b.textContent = tx('photoAdd') + ': ' + it.name;
                    b.onclick = () => pick(it.name);
                }
                prow.appendChild(b);
            });
            if (prow.children.length) info.appendChild(prow);
        }
        // M-147: taken early
        if (has('takenEarly')) {
            const box = document.createElement('div'); box.className = 'pl-row';
            let on = false; try { on = N.isTakenEarly(m.id); } catch (e) { }
            if (on) { const s = document.createElement('span'); s.className = 'pl-on'; s.textContent = tx('earlyOn'); box.appendChild(s); }
            else {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'pl-early'; b.textContent = tx('early');
                b.onclick = () => {
                    vib();
                    const wk = new Date().getDay() >= 5 && typeof wkTimeOf === 'function' && wkTimeOf(m) ? wkTimeOf(m) : m.time;
                    mtDialog({ text: fill(tx('earlyQ'), { t: wk }), icon: '⏰', ok: tx('yes'), cancel: tx('no') }).then(v => {
                        if (!v) return;
                        let t = ''; try { t = N.takenEarly(m.id) || ''; } catch (e) { }
                        mtAlert(t ? fill(tx('earlyDone'), { t: t }) : tx('earlyNone'), t ? '✅' : 'ℹ️');
                        renderMeds();
                    });
                };
                box.appendChild(b);
            }
            if (info) info.appendChild(box);
        }
        // M-156 (owner): keep the list short, photo and taken-early buttons share one compact row
        const rows = info.querySelectorAll(':scope > .pl-row');
        if (rows.length > 1) { while (rows[1].firstChild) rows[0].appendChild(rows[1].firstChild); rows[1].remove(); }
        if (rows[0]) { li.classList.add('pl-wrap'); li.appendChild(rows[0]); } // full card width, under the text and the edit buttons
    };
    // M-156 (owner): the reminders page fits the screen; tighter steps only while it would scroll
    function fitList() {
        const pg = document.getElementById('list-page'); if (!pg || !pg.classList.contains('open')) return;
        pg.classList.remove('pl-t1', 'pl-t2');
        for (const c of ['pl-t1', 'pl-t2']) { if (pg.scrollHeight <= pg.clientHeight + 2) break; pg.classList.add(c); }
        if (fitMo) fitMo.takeRecords(); // M-162: our own class changes must not start fitList again (endless loop = flicker)
    }
    const lp = document.getElementById('list-page');
    let fitMo = null, fitQ = 0;
    if (lp) (fitMo = new MutationObserver(() => { if (!fitQ) fitQ = requestAnimationFrame(() => { fitQ = 0; fitList(); }); })).observe(lp, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true });
    window.addEventListener('resize', () => setTimeout(fitList, 80));
    // M-157 (owner): Help sits at the top of settings, right after Language, both stand out
    try {
        const g2 = document.querySelector('#settings-page .set-grid'), hp = document.getElementById('tile-help');
        if (g2 && hp && g2.firstElementChild && g2.firstElementChild !== hp) g2.insertBefore(hp, g2.firstElementChild.nextSibling);
    } catch (e) { }
    // M-153: the list was drawn at start-up before this file loaded, so the cards had no photo / taken-early buttons
    if (typeof renderMeds === 'function') try { renderMeds(); } catch (e) { }

    // ---------------- 🌡️ vitals tile (M-149) ----------------
    const grid = document.querySelector('#settings-page .set-grid');
    if (!grid) return;
    const VK = 'medtime_vitals'; // starts with "medtime" -> part of the backup file
    const load = () => { try { return JSON.parse(localStorage.getItem(VK) || '[]') || []; } catch (e) { return []; } };
    const store = a => { try { localStorage.setItem(VK, JSON.stringify(a.slice(-1500))); } catch (e) { } };
    // general guide only (adults); green / yellow / red
    function level(k, v) {
        if (k === 'bp') { const s = v[0], d = v[1]; if (s >= 140 || d >= 90 || s < 90 || d < 60) return 'rd'; if (s >= 130 || d >= 85) return 'y'; return 'g'; }
        if (k === 'sugar') { if (v < 60 || v > 180) return 'rd'; if (v < 70 || v > 140) return 'y'; return 'g'; }
        if (v < 50 || v > 120) return 'rd'; if (v < 60 || v > 100) return 'y'; return 'g';
    }
    const COL = { g: '#16a34a', y: '#d97706', rd: '#dc2626' };
    const show = (k, v) => k === 'bp' ? v[0] + '/' + v[1] : String(v);
    const unit = k => k === 'bp' ? ' mmHg' : k === 'sugar' ? ' mg/dL' : ' bpm';

    const s = document.createElement('section');
    s.className = 'set-tile x-tile'; s.id = 'tile-vitals';
    s.style.setProperty('--g', 'linear-gradient(135deg,#f472b6,#be185d)');
    s.innerHTML = '<button type="button" class="set-tile-head" onclick="toggleTile(this)"><span class="set-ico">🌡️</span>' +
        '<span class="set-txt"><span class="set-title"></span><span class="set-sub"></span></span><span class="set-chev">⌄</span></button>' +
        '<div class="set-body"><div class="panel-head"><span class="grip"></span><span class="p-ico">🌡️</span><span class="p-title"></span>' +
        '<button type="button" class="p-close" aria-label="close">✕</button></div>' +
        '<div class="vt-tabs"></div><div class="vt-in"></div><button type="button" class="mo-btn" id="vt-save"></button>' +
        '<svg class="vt-chart" viewBox="0 0 300 150" preserveAspectRatio="none"></svg><div class="mo-x" id="vt-cap"></div>' +
        '<div class="vt-list"></div><div class="mo-x" id="vt-note" style="opacity:.6;font-size:.85rem"></div>' +
        '<button type="button" class="page-done" id="vt-done" style="margin-top:14px"></button></div>';
    s.querySelector('.p-close').onclick = () => closeTiles();
    s.querySelector('#vt-done').onclick = () => { vib(); closeTiles(); }; // M-152: finish -> back to the main screen
    s.querySelector('.p-ico').style.setProperty('--g', 'linear-gradient(135deg,#f472b6,#be185d)');
    grid.appendChild(s);
    let kind = 'bp';
    try { kind = localStorage.getItem('medtime_vkind') || 'bp'; } catch (e) { }

    function heads() {
        const a = load(), last = a[a.length - 1];
        const strip = x => x.replace(/^\S+\s/, '');
        s.querySelector('.set-title').textContent = strip(tx('vT'));
        s.querySelector('.p-title').textContent = strip(tx('vT'));
        s.querySelector('.set-sub').textContent = last ? fill(tx('vSubLast'), { v: show(last.k, last.v) }) : tx('vSubNone');
    }
    function draw() {
        heads();
        const tabs = s.querySelector('.vt-tabs'); tabs.innerHTML = '';
        ['bp', 'sugar', 'pulse'].forEach(k => {
            const b = document.createElement('button'); b.type = 'button'; b.textContent = tx(k);
            if (k === kind) b.className = 'sel';
            b.onclick = () => { vib(); kind = k; try { localStorage.setItem('medtime_vkind', k); } catch (e) { } draw(); };
            tabs.appendChild(b);
        });
        const inp = s.querySelector('.vt-in');
        inp.innerHTML = kind === 'bp'
            ? '<label><span></span><input id="vt-a" type="number" inputmode="numeric" min="40" max="260"></label><label><span></span><input id="vt-b" type="number" inputmode="numeric" min="30" max="160"></label>'
            : '<label><span></span><input id="vt-a" type="number" inputmode="decimal" min="20" max="600"></label>';
        const lbl = inp.querySelectorAll('label > span');
        if (kind === 'bp') { lbl[0].textContent = tx('sys'); lbl[1].textContent = tx('dia'); } else lbl[0].textContent = tx('val') + unit(kind);
        document.getElementById('vt-save').textContent = tx('save');
        document.getElementById('vt-note').textContent = tx('note'); document.getElementById('vt-done').textContent = tx('done');
        const since = Date.now() - 30 * 864e5;
        const rows = load().filter(e => e.k === kind && e.at >= since);
        chart(rows);
        document.getElementById('vt-cap').textContent = rows.length ? tx('last30') : tx('empty');
        const list = s.querySelector('.vt-list'); list.innerHTML = '';
        rows.slice().reverse().slice(0, 20).forEach(e => {
            const r = document.createElement('div'); r.className = 'vt-r';
            let d = ''; try { d = new Date(e.at).toLocaleString(L5[li()], { weekday: 'short', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (x) { }
            r.innerHTML = '<span class="d"></span><b class="vt-' + level(e.k, e.v) + '"></b><button type="button"></button>';
            r.querySelector('.d').textContent = d;
            r.querySelector('b').textContent = show(e.k, e.v);
            const del = r.querySelector('button'); del.textContent = tx('del');
            del.onclick = () => { vib(); store(load().filter(x => x.at !== e.at)); draw(); };
            list.appendChild(r);
        });
    }
    function chart(rows) {
        const svg = s.querySelector('.vt-chart');
        if (rows.length < 1) { svg.innerHTML = ''; return; }
        const series = kind === 'bp' ? [rows.map(e => e.v[0]), rows.map(e => e.v[1])] : [rows.map(e => e.v)];
        const all = series.flat(), lo = Math.min(...all) * 0.9, hi = Math.max(...all) * 1.1 || 1;
        const t0 = Date.now() - 30 * 864e5, X = at => 8 + (at - t0) / (30 * 864e5) * 284, Y = v => 142 - (v - lo) / (hi - lo || 1) * 134;
        let out = '';
        series.forEach((ser, si) => {
            const pts = rows.map((e, i) => X(e.at).toFixed(1) + ',' + Y(ser[i]).toFixed(1));
            out += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + (si ? '#a78bfa' : '#f472b6') + '" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';
            rows.forEach((e, i) => { out += '<circle cx="' + X(e.at).toFixed(1) + '" cy="' + Y(ser[i]).toFixed(1) + '" r="3.2" fill="' + COL[level(e.k, e.v)] + '" stroke="#fff" stroke-width="1" vector-effect="non-scaling-stroke"/>'; });
        });
        svg.innerHTML = out;
    }
    document.getElementById('vt-save').onclick = () => {
        vib();
        const a = +(document.getElementById('vt-a') || {}).value, b = kind === 'bp' ? +(document.getElementById('vt-b') || {}).value : 0;
        const ok = kind === 'bp' ? (a >= 40 && a <= 260 && b >= 30 && b <= 160) : (a >= 20 && a <= 600);
        if (!ok) { mtAlert(tx('bad')); return; }
        const arr = load(); arr.push({ k: kind, v: kind === 'bp' ? [Math.round(a), Math.round(b)] : Math.round(a * 10) / 10, at: Date.now() });
        store(arr); draw();
    };
    s.querySelector('.set-tile-head').addEventListener('click', draw);

    // M-150: owner: vitals as a separate button on the main screen (next to Serenity), not inside settings
    const home = document.getElementById('relax-btn');
    if (home && home.parentNode) {
        const vb = document.createElement('button');
        vb.type = 'button'; vb.id = 'vt-btn'; vb.className = 'relax-btn vt-btn';
        vb.innerHTML = '<span class="rb-ico"><i>🌡️</i></span><span class="rb-txt"></span>';
        const pair = document.createElement('div'); pair.className = 'home-pair';
        home.parentNode.insertBefore(pair, home);
        pair.appendChild(home); pair.appendChild(vb);
        let fromHome = false;
        vb.onclick = () => {
            vib();
            document.body.classList.add('vt-solo');
            openSettingsPage();
            setTimeout(() => { closeTiles(); s.classList.add('open'); document.getElementById('set-backdrop').classList.add('open'); draw(); fromHome = true; }, 30);
        };
        const ct = window.closeTiles;
        window.closeTiles = function () {
            ct.apply(this, arguments);
            if (fromHome) { fromHome = false; document.body.classList.remove('vt-solo'); if (window.closeSettingsPage) closeSettingsPage(); }
        };
        const lab = () => { vb.querySelector('.rb-txt').textContent = tx('vT').replace(/^\S+\s/, ''); };
        lab();
        const prevL = window.moreRender;
        window.moreRender = function () { if (prevL) prevL(); lab(); };
        // M-155: one more squeeze step (fit4) when the menu still reaches the bottom buttons (low-vision text is bigger),
        // and re-measure when low-vision is turned on / off
        if (typeof fitMain === 'function') {
            const fm = fitMain;
            window.fitMain = function () {
                document.documentElement.classList.remove('fit4');
                fm();
                const ex = document.getElementById('exit-btn'), gl = document.getElementById('guide-btn');
                if (ex && gl && gl.offsetParent && gl.getBoundingClientRect().bottom > ex.getBoundingClientRect().top - 10) document.documentElement.classList.add('fit4');
            };
            let lv = document.documentElement.classList.contains('lowvision');
            new MutationObserver(() => {
                const now = document.documentElement.classList.contains('lowvision');
                if (now !== lv) { lv = now; setTimeout(window.fitMain, 80); }
            }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        }
        const st = document.createElement('style');
        st.textContent = `
        #tile-vitals:not(.open){display:none!important}
        #tile-vitals > .set-tile-head{display:none!important}
        .home-pair{display:flex;gap:10px;width:100%}
        html.fit4 .hero-space{height:0!important;min-height:0!important}
        html.fit4 .home-card{gap:6px!important}
        html.fit4 .home-pair > .relax-btn{min-height:0!important;padding-top:3px!important;padding-bottom:3px!important}
        html.fit4 .home-pair .rb-ico{transform:scale(.78);margin:-4px 0}
        html.fit4 #guide-btn{margin-top:4px!important;padding-top:4px!important;padding-bottom:4px!important}
        .home-pair > .relax-btn{flex:1 1 0!important;min-width:0!important;width:auto!important;margin-left:0!important;margin-right:0!important}
        .home-card #vt-btn{background:linear-gradient(135deg,#ec4899,#9d174d)!important;border-color:rgba(251,207,232,.7)!important}
        .home-card #vt-btn .rb-ico{background:radial-gradient(circle at 35% 30%,#fce7f3,#f472b6 55%,#9d174d)!important}
        body.vt-solo #settings-page .set-grid > .set-tile:not(#tile-vitals), body.vt-solo #settings-page .settings-hero{visibility:hidden}`;
        document.head.appendChild(st);
    }
    heads();
    const prev = window.moreRender;
    window.moreRender = function () { if (prev) prev(); heads(); };

    // weekly PDF: vitals of the same days (used by more.js)
    window.mtVitalsPdf = function (sinceKey) {
        const dk = at => { const d = new Date(at); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
        const rows = load().filter(e => dk(e.at) >= sinceKey);
        if (!rows.length) return null;
        const byDay = {};
        rows.forEach(e => { const k = dk(e.at); (byDay[k] = byDay[k] || []).push(e); });
        return {
            head: tx('pdfV'),
            days: Object.keys(byDay).sort().reverse().map(k => ({
                h: k.split('-').reverse().join('.'),
                rows: byDay[k].map(e => {
                    const d = new Date(e.at), hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
                    return [hm, tx(e.k).replace(/^\S+\s/, ''), show(e.k, e.v) + unit(e.k), COL[level(e.k, e.v)]];
                })
            }))
        };
    };
})();
