// S-01 (owner 2026-10-21): "I got a different medicine" - when the pharmacy hands out a substitute (generic) for the
// medicine the doctor prescribed, compare both in the Ministry of Health registry (drugs_il.js): same active
// ingredients + same dose + same form = full substitute. Always ends with "check with the pharmacist". (M-161)
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const vib = () => { try { navigator.vibrate && navigator.vibrate(12); } catch (e) { } };
    const T = {
        btn: ['🔄 קיבלתי תרופה אחרת', '🔄 استلمت دواءً آخر', '🔄 Am primit alt medicament', '🔄 J\'ai reçu un autre médicament', '🔄 I got a different medicine'],
        which: ['לאיזו תרופה בכרטיס?', 'لأي دواء في البطاقة؟', 'Pentru care medicament din card?', 'Pour quel médicament de la carte ?', 'For which medicine on the card?'],
        q1: ['איזו תרופה רשם הרופא?', 'ما الدواء الذي وصفه الطبيب؟', 'Ce medicament a prescris medicul?', 'Quel médicament le médecin a-t-il prescrit ?', 'Which medicine did the doctor prescribe?'],
        q2: ['מה קיבלת בבית המרקחת?', 'ماذا استلمت من الصيدلية؟', 'Ce ai primit la farmacie?', 'Qu\'avez-vous reçu à la pharmacie ?', 'What did you get at the pharmacy?'],
        hint: ['מקלידים את השם כמו על האריזה, ובוחרים מהרשימה', 'اكتب الاسم كما على العلبة واختر من القائمة', 'Scrie numele ca pe cutie și alege din listă', 'Tapez le nom comme sur la boîte et choisissez dans la liste', 'Type the name as on the box and pick from the list'],
        none: ['לא נמצא במאגר משרד הבריאות. נסו לכתוב את השם כמו על האריזה.', 'غير موجود في سجل وزارة الصحة. جرّب كتابة الاسم كما على العلبة.', 'Nu există în registrul Ministerului Sănătății. Scrie numele ca pe cutie.', 'Introuvable dans le registre du ministère de la Santé. Tapez le nom comme sur la boîte.', 'Not found in the Ministry of Health registry. Type the name as on the box.'],
        prev: ['→ חזרה', '→ رجوع', '← Înapoi', '← Retour', '← Back'],
        scan: ['📷 סריקה', '📷 مسح', '📷 Scanează', '📷 Scanner', '📷 Scan'],
        hintScan: ['מקלידים את השם כמו על האריזה, או 📷 מצלמים את הברקוד שעל הקופסה', 'اكتب الاسم كما على العلبة أو 📷 صوّر الباركود', 'Scrie numele ca pe cutie sau 📷 fotografiază codul de bare', 'Tapez le nom comme sur la boîte ou 📷 photographiez le code-barres', 'Type the name as on the box, or 📷 photograph the barcode on the box'],
        noRead: ['לא הצלחתי לקרוא ברקוד בתמונה. צלמו מקרוב את הברקוד, באור טוב, או הקלידו את השם.', 'تعذرت قراءة الباركود. صوّره عن قرب وبإضاءة جيدة أو اكتب الاسم.', 'Codul nu a putut fi citit. Fotografiază-l de aproape, la lumină bună, sau scrie numele.', 'Code illisible. Photographiez-le de près, avec une bonne lumière, ou tapez le nom.', 'Could not read a barcode. Photograph it up close in good light, or type the name.'],
        noCode: ['הברקוד נקרא, אבל הוא לא במאגר משרד הבריאות. הקלידו את השם.', 'تمت قراءة الباركود لكنه غير موجود في السجل. اكتب الاسم.', 'Codul a fost citit, dar nu e în registru. Scrie numele.', 'Code lu, mais absent du registre. Tapez le nom.', 'Barcode read, but it is not in the registry. Please type the name.'],
        loading: ['טוען את מאגר התרופות...', 'جارٍ تحميل سجل الأدوية...', 'Se încarcă registrul de medicamente...', 'Chargement du registre des médicaments...', 'Loading the medicine registry...'],
        full: ['✅ חלופה מלאה: אותו חומר פעיל, אותו מינון ואותה צורה.', '✅ بديل كامل: نفس المادة الفعالة والجرعة والشكل.', '✅ Înlocuitor complet: aceeași substanță activă, aceeași doză și formă.', '✅ Substitut complet : même principe actif, même dose et même forme.', '✅ Full substitute: same active ingredient, same dose and same form.'],
        near: ['🟢 אותו חומר פעיל ואותו מינון, רק צורה מעט שונה (טבליה / כמוסה). בדרך כלל זו חלופה.', '🟢 نفس المادة الفعالة والجرعة، فقط الشكل مختلف قليلًا (قرص / كبسولة). عادةً هذا بديل.', '🟢 Aceeași substanță și doză, doar forma diferă puțin (comprimat / capsulă). De obicei e un înlocuitor.', '🟢 Même principe actif et même dose, seule la forme diffère un peu (comprimé / gélule). C\'est en général un substitut.', '🟢 Same active ingredient and dose, only a slightly different form (tablet / capsule). Usually a substitute.'],
        form: ['⚠️ אותו חומר פעיל, אבל צורה או אופן שחרור שונים. זו לא בהכרח חלופה מלאה.', '⚠️ نفس المادة الفعالة لكن الشكل أو طريقة الإطلاق مختلفة. ليس بالضرورة بديلًا كاملًا.', '⚠️ Aceeași substanță, dar formă sau eliberare diferită. Nu e neapărat un înlocuitor complet.', '⚠️ Même principe actif, mais forme ou libération différente. Pas forcément un substitut complet.', '⚠️ Same active ingredient, but a different form or release. Not necessarily a full substitute.'],
        dose: ['⚠️ אותו חומר פעיל אבל מינון שונה. ייתכן שצריך לקחת כמות אחרת.', '⚠️ نفس المادة الفعالة لكن بجرعة مختلفة. قد تحتاج كمية مختلفة.', '⚠️ Aceeași substanță, dar doză diferită. Poate fi nevoie de altă cantitate.', '⚠️ Même principe actif mais dose différente. Il faudra peut-être une autre quantité.', '⚠️ Same active ingredient but a different dose. You may need a different amount.'],
        diff: ['❌ חומר פעיל שונה. זו לא אותה תרופה.', '❌ مادة فعالة مختلفة. هذا ليس نفس الدواء.', '❌ Substanță activă diferită. Nu este același medicament.', '❌ Principe actif différent. Ce n\'est pas le même médicament.', '❌ Different active ingredient. This is not the same medicine.'],
        pharm: ['כדאי לוודא עם הרוקח.', 'يُفضّل التأكد مع الصيدلي.', 'Verifică și cu farmacistul.', 'Vérifiez avec le pharmacien.', 'Please confirm with the pharmacist.'],
        was: ['רשם הרופא', 'وصفة الطبيب', 'Prescris', 'Prescrit', 'Prescribed'],
        got: ['קיבלת', 'استلمت', 'Primit', 'Reçu', 'You got'],
        keep: ['💾 לשמור בכרטיס', '💾 حفظ في البطاقة', '💾 Salvează în card', '💾 Garder sur la carte', '💾 Save on the card'],
        close: ['סגירה', 'إغلاق', 'Închide', 'Fermer', 'Close'],
        back: ['ביטול', 'إلغاء', 'Anulează', 'Annuler', 'Cancel'],
        now: ['🔄 כרגע: {n}', '🔄 حاليًا: {n}', '🔄 Acum: {n}', '🔄 Actuellement : {n}', '🔄 Now: {n}'],
        delQ: ['להסיר את "{n}" מהכרטיס ולחזור ל{o}?', 'إزالة "{n}" من البطاقة والعودة إلى {o}؟', 'Elimini "{n}" din card și revii la {o}?', 'Retirer « {n} » de la carte et revenir à {o} ?', 'Remove "{n}" from the card and go back to {o}?'],
        del: ['הסרה', 'إزالة', 'Elimină', 'Retirer', 'Remove'],
        src: ['לפי מאגר התרופות של משרד הבריאות', 'حسب سجل الأدوية لوزارة الصحة', 'Conform registrului Ministerului Sănătății', 'Selon le registre du ministère de la Santé', 'From the Ministry of Health medicine registry']
    };
    const tx = k => (T[k] || [])[li()] || (T[k] || [])[0] || k;
    const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (k in o ? o[k] : m));
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    // ---------- registry ----------
    let DB = null;
    function loadDb() {
        if (DB) return Promise.resolve(DB);
        return new Promise(res => {
            const done = () => {
                DB = (window.IL_DRUGS || []).map(r => ({ h: r[0], e: r[1], fe: r[2], f: r[3], a: r[4], b: r[5] || [], s: norm(r[0] + ' ' + r[1]) }));
                res(DB);
            };
            if (window.IL_DRUGS) return done();
            const s = document.createElement('script');
            s.src = 'drugs_il.js'; s.onload = done; s.onerror = () => { DB = []; res(DB); };
            document.head.appendChild(s);
        });
    }
    function norm(s) {
        return String(s || '').toLowerCase().replace(/[®™"'׳״`.,()\-/+]/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function search(q, max) {
        const n = norm(q); if (!n) return [];
        const toks = n.split(' ');
        const out = [];
        for (const d of DB) {
            if (toks.every(t => d.s.includes(t) || d.a.some(c => norm(c[2]).replace(/ /g, '').startsWith(t)))) out.push(d);
        }
        const first = toks[0];
        const score = d => (d.s.startsWith(first) ? 0 : (' ' + d.s).includes(' ' + first) ? 1 : 2) * 1000 + d.s.length;
        return out.sort((x, y) => score(x) - score(y)).slice(0, max || 30);
    }
    const nd = s => String(s || '').toUpperCase().replace(/\s+/g, '');
    const ingText = d => d.a.map(c => c[1] + ' ' + c[2]).join(' + ');
    const formOf = d => (li() === 0 ? (d.f || d.fe) : (d.fe || d.f));
    const nameOf = d => (li() === 0 || li() === 1 ? (d.h || d.e) : (d.e || d.h));
    function group(fe) {
        fe = String(fe || '').toUpperCase();
        if (/INJ|INFUS/.test(fe)) return 'inj';
        if (/EYE/.test(fe)) return 'eye';
        if (/EAR/.test(fe)) return 'ear';
        if (/NASAL/.test(fe)) return 'nose';
        if (/INHAL/.test(fe)) return 'inh';
        if (/SUPPOS|RECTAL|VAGIN|PESSAR/.test(fe)) return 'rv';
        if (/CREAM|OINT|GEL|EXTERNAL|PATCH|LOTION|SHAMPOO|FOAM|PASTE|PLASTER/.test(fe)) return 'top';
        if (/SUBLING|BUCCAL|CHEW|ORODISP|EFFERV|LOZENG|DISPERS/.test(fe)) return 'oral2:' + fe;
        if (/TABLET|CAPLET/.test(fe)) return 'tab';
        if (/CAPSUL/.test(fe)) return 'cap';
        return 'liq';
    }
    function release(fe) {
        fe = String(fe || '').toUpperCase();
        if (/PROLONG|EXTEND|SUSTAIN|SLOW|MODIFIED|CONTROL|RETARD/.test(fe)) return 'mr';
        if (/GASTRO|ENTERIC|DELAYED/.test(fe)) return 'gr';
        return 'ir';
    }
    function compare(a, b) {
        const ka = a.a.map(c => c[0]).sort().join(','), kb = b.a.map(c => c[0]).sort().join(',');
        if (ka !== kb) return 'diff';
        const da = a.a.map(c => c[0] + ':' + nd(c[2])).sort().join(','), db = b.a.map(c => c[0] + ':' + nd(c[2])).sort().join(',');
        if (da !== db) return 'dose';
        if (release(a.fe) !== release(b.fe)) return 'form';
        const ga = group(a.fe), gb = group(b.fe);
        if (ga === gb) return 'full';
        if ((ga === 'tab' && gb === 'cap') || (ga === 'cap' && gb === 'tab')) return 'near';
        return 'form';
    }

    // ---------- saved substitutes (per reminder + medicine name) ----------
    const SK = 'medtime_subst';
    const loadS = () => { try { return JSON.parse(localStorage.getItem(SK) || '{}') || {}; } catch (e) { return {}; } };
    const saveS = o => { try { localStorage.setItem(SK, JSON.stringify(o)); } catch (e) { } };

    // ---------- UI ----------
    const css = document.createElement('style');
    css.textContent = `
    .sb-btn{display:inline-flex!important;align-items:center;gap:6px;border:1.5px solid #c4b5fd!important;background:linear-gradient(135deg,#7c3aed,#5b21b6)!important;color:#fff!important;border-radius:999px!important;min-height:34px!important;padding:4px 11px!important;font-size:.88rem!important;font-weight:800!important}
    .sb-now{display:inline-block;margin-top:4px;padding:4px 10px;border-radius:999px;background:rgba(167,139,250,.18);color:#ddd6fe;font-weight:800;font-size:.9rem;border:none}
    /* M-162 (owner): full-screen solid page at the top (the half-see-through layer made the 3D background flicker,
       and the keyboard covered a bottom sheet); its height follows the visible area above the keyboard */
    .sb-bg{position:fixed!important;left:0!important;right:0!important;top:0;z-index:9600!important;height:100vh;background:#0b1024!important;display:flex!important;justify-content:center}
    .sb-sh{width:100%;max-width:560px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;background:linear-gradient(180deg,#1e1b4b,#0f172a);color:#fff;padding:calc(14px + env(safe-area-inset-top)) 16px 12px}
    .sb-t{font-size:1.35rem;font-weight:800;margin:2px 0 4px}
    .sb-h{color:#c7d2fe;font-size:.95rem;margin-bottom:10px}
    .sb-in{width:100%;box-sizing:border-box;font-size:1.25rem;padding:12px 14px;border-radius:14px;border:2px solid #a78bfa;background:#0b1024;color:#fff;outline:none}
    .sb-inrow{display:flex;gap:8px;align-items:stretch}
    .sb-inrow .sb-in{flex:1;min-width:0}
    .sb-scan{flex:0 0 auto;border:none;border-radius:14px;padding:0 14px;font-size:1.05rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#0ea5e9,#0369a1)}
    .sb-list{overflow:auto;margin-top:10px;flex:1;min-height:120px}
    .sb-it{display:block;width:100%;text-align:start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;color:#fff;padding:10px 12px;margin-bottom:8px;font-size:1.05rem;font-weight:800}
    .sb-it small{display:block;font-weight:500;color:#a5b4fc;font-size:.85rem;margin-top:2px;direction:ltr;text-align:start}
    .sb-msg{color:#fde68a;padding:10px 4px}
    .sb-res{font-size:1.2rem;font-weight:800;line-height:1.45;margin:6px 0 12px}
    .sb-row{background:rgba(255,255,255,.06);border-radius:14px;padding:10px 12px;margin-bottom:8px}
    .sb-row b{display:block;color:#c4b5fd;font-size:.85rem}
    .sb-row small{display:block;color:#a5b4fc;direction:ltr;text-align:start}
    .sb-src{color:#94a3b8;font-size:.8rem;margin:4px 0 10px}
    .sb-btns{display:flex;gap:10px;margin-top:8px}
    .sb-btns button{flex:1;min-height:52px;border-radius:14px;font-size:1.1rem;font-weight:800;border:none;color:#fff;background:#334155}
    .sb-btns .ok{background:linear-gradient(135deg,#7c3aed,#5b21b6)}
    `;
    document.head.appendChild(css);

    function sheet() {
        const bg = document.createElement('div'); bg.className = 'sb-bg';
        const sh = document.createElement('div'); sh.className = 'sb-sh'; bg.appendChild(sh);
        const vv = window.visualViewport;
        const fit = () => { bg.style.height = (vv ? vv.height : window.innerHeight) + 'px'; bg.style.top = (vv ? vv.offsetTop : 0) + 'px'; };
        fit();
        if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
        window.addEventListener('resize', fit);
        document.body.appendChild(bg);
        const o = { bg, sh, onBack: null };
        const unBack = window.mtBackPush ? mtBackPush(() => (o.onBack ? o.onBack() : (close(), false))) : null; // M-163: phone back = one step back
        const close = () => { if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); } window.removeEventListener('resize', fit); bg.remove(); if (unBack) unBack(); };
        o.close = close;
        return o;
    }
    // one step: type a name (or scan the box), pick a registry entry. Resolves an entry, 'back' or null (close).
    function pickStep(s, title, start, canBack) {
        return new Promise(res => {
            s.sh.innerHTML = `<div class="sb-t"></div><div class="sb-h"></div><div class="sb-inrow"><input class="sb-in" type="text" autocomplete="off"></div><div class="sb-list"></div><div class="sb-btns"></div>`;
            s.sh.querySelector('.sb-t').textContent = title;
            s.sh.querySelector('.sb-h').textContent = tx(canScan() ? 'hintScan' : 'hint');
            const inp = s.sh.querySelector('.sb-in'), list = s.sh.querySelector('.sb-list'), btns = s.sh.querySelector('.sb-btns');
            s.onBack = () => { res(canBack ? 'back' : null); return canBack; };
            if (canScan()) {
                const sc = document.createElement('button'); sc.type = 'button'; sc.className = 'sb-scan'; sc.textContent = tx('scan');
                sc.onclick = () => scan().then(r => { if (r && r.length === 1) res(r[0]); else if (r) show(r, r.length ? '' : tx('noCode')); else show([], tx('noRead')); });
                s.sh.querySelector('.sb-inrow').appendChild(sc);
            }
            if (canBack) { const bb = document.createElement('button'); bb.type = 'button'; bb.textContent = tx('prev'); bb.onclick = () => res('back'); btns.appendChild(bb); }
            const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = tx('back'); cancel.onclick = () => res(null); btns.appendChild(cancel);
            const show = (r, msg) => {
                list.innerHTML = '';
                if (msg) { const m = document.createElement('div'); m.className = 'sb-msg'; m.textContent = msg; list.appendChild(m); }
                r.forEach(d => {
                    const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-it';
                    b.innerHTML = esc(nameOf(d)) + `<small>${esc(ingText(d))} · ${esc(formOf(d))}</small>`;
                    b.onclick = () => { vib(); res(d); };
                    list.appendChild(b);
                });
            };
            const draw = () => { const r = search(inp.value, 30); show(r, !r.length && inp.value.trim() ? tx('none') : ''); };
            inp.value = start || ''; inp.oninput = draw; draw();
            if (!start) setTimeout(() => { try { inp.focus(); } catch (e) { } }, 50);
        });
    }
    function chooseItem(m) {
        const items = (m.items || []).filter(it => it && it.name);
        if (items.length <= 1) return Promise.resolve(items[0] || null);
        return new Promise(res => {
            const s = sheet();
            s.onBack = () => { s.close(); res(null); return false; };
            s.sh.innerHTML = `<div class="sb-t"></div><div class="sb-list"></div><div class="sb-btns"><button type="button"></button></div>`;
            s.sh.querySelector('.sb-t').textContent = tx('which');
            const list = s.sh.querySelector('.sb-list');
            items.forEach(it => {
                const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-it'; b.textContent = it.name;
                b.onclick = () => { s.close(); res(it); };
                list.appendChild(b);
            });
            const c = s.sh.querySelector('.sb-btns button'); c.textContent = tx('back'); c.onclick = () => { s.close(); res(null); };
        });
    }
    function resultStep(s, m, it, orig, got) {
        return new Promise(res => {
            const lv = compare(orig, got);
            s.onBack = () => { res('back'); return true; };
            s.sh.innerHTML = `<div class="sb-res"></div>
                <div class="sb-row"><b></b><span class="n1"></span><small class="i1"></small></div>
                <div class="sb-row"><b></b><span class="n2"></span><small class="i2"></small></div>
                <div class="sb-res pharm" style="font-size:1.05rem;color:#fde68a"></div><div class="sb-src"></div>
                <div class="sb-btns"><button type="button" class="pv"></button><button type="button" class="cl"></button>${lv === 'diff' ? '' : '<button type="button" class="ok"></button>'}</div>`;
            s.sh.querySelector('.sb-res').textContent = tx(lv);
            const bs = s.sh.querySelectorAll('.sb-row b'); bs[0].textContent = tx('was'); bs[1].textContent = tx('got');
            s.sh.querySelector('.n1').textContent = nameOf(orig); s.sh.querySelector('.i1').textContent = ingText(orig) + ' · ' + formOf(orig);
            s.sh.querySelector('.n2').textContent = nameOf(got); s.sh.querySelector('.i2').textContent = ingText(got) + ' · ' + formOf(got);
            s.sh.querySelector('.pharm').textContent = tx('pharm');
            s.sh.querySelector('.sb-src').textContent = tx('src');
            const pv = s.sh.querySelector('.pv'); pv.textContent = tx('prev'); pv.onclick = () => res('back');
            const cl = s.sh.querySelector('.cl'); cl.textContent = tx('close'); cl.onclick = () => res(null);
            const ok = s.sh.querySelector('.ok');
            if (ok) {
                ok.textContent = tx('keep');
                ok.onclick = () => {
                    const o = loadS(); o[m.id + '|' + it.name] = { n: nameOf(got), o: nameOf(orig), lv: lv };
                    saveS(o); res(null); if (typeof renderMeds === 'function') renderMeds();
                };
            }
            if (navigator.vibrate) try { navigator.vibrate(lv === 'full' ? 20 : [15, 40, 15]); } catch (e) { }
        });
    }
    async function start(m) {
        vib();
        const it = await chooseItem(m); if (!it) return;
        const s = sheet();
        s.sh.innerHTML = `<div class="sb-t">${esc(tx('loading'))}</div>`;
        await loadDb();
        let step = 0, orig = null, got = null;
        for (;;) {
            if (step === 0) {
                const r = await pickStep(s, tx('q1'), orig ? nameOf(orig) : it.name, false);
                if (!r || r === 'back') break; orig = r; step = 1;
            } else if (step === 1) {
                const r = await pickStep(s, tx('q2'), '', true);
                if (r === 'back') { step = 0; continue; } if (!r) break; got = r; step = 2;
            } else {
                const r = await resultStep(s, m, it, orig, got);
                if (r === 'back') { step = 1; continue; } break;
            }
        }
        s.close();
    }

    // ---------- M-163: scan the box (barcode / DataMatrix on the package) ----------
    const N = window.MedTimeNative;
    const canScan = () => !!(N && typeof N.pickPhoto === 'function' && typeof N.getPhoto === 'function');
    let scanRes = null;
    const prevDone = window.mtPhotoDone;
    window.mtPhotoDone = function (ok) {
        if (!scanRes) return prevDone ? prevDone(ok) : undefined;
        const r = scanRes; scanRes = null;
        let src = ''; try { src = ok ? N.getPhoto('__scan__') : ''; } catch (e) { }
        try { N.deletePhoto && N.deletePhoto('__scan__'); } catch (e) { }
        r(src);
    };
    function loadZx() {
        if (window.ZXing) return Promise.resolve();
        return new Promise(res => { const s = document.createElement('script'); s.src = 'lib/zxing.min.js'; s.onload = res; s.onerror = res; document.head.appendChild(s); });
    }
    function gtinToEans(t) {
        const out = new Set(); t = String(t || '');
        const m = t.match(/(?:^|\x1d|\u001d)?01(\d{14})/); // GS1 DataMatrix: (01) + 14-digit GTIN
        const d = m ? m[1] : t.replace(/\D/g, '');
        if (d) { out.add(d); out.add(d.replace(/^0+/, '')); if (d.length === 14) out.add(d.slice(1)); }
        return [...out].filter(x => x.length >= 8);
    }
    async function decode(src) {
        const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
        if (!img) return [];
        const found = [];
        if ('BarcodeDetector' in window) {
            try { (await new BarcodeDetector().detect(img)).forEach(b => found.push(b.rawValue)); } catch (e) { }
        }
        if (!found.length) {
            await loadZx();
            if (window.ZXing) {
                const Z = window.ZXing, hints = new Map();
                hints.set(Z.DecodeHintType.TRY_HARDER, true);
                hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.DATA_MATRIX, Z.BarcodeFormat.CODE_128, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.QR_CODE]);
                for (const rot of [0, 90]) {
                    try {
                        const c = document.createElement('canvas'), w = img.naturalWidth, h = img.naturalHeight;
                        c.width = rot ? h : w; c.height = rot ? w : h;
                        const g = c.getContext('2d'); if (rot) { g.translate(h, 0); g.rotate(Math.PI / 2); } g.drawImage(img, 0, 0);
                        const lum = new Z.HTMLCanvasElementLuminanceSource(c);
                        const r = new Z.MultiFormatReader(); r.setHints(hints);
                        found.push(r.decode(new Z.BinaryBitmap(new Z.HybridBinarizer(lum))).getText()); break;
                    } catch (e) { }
                }
            }
        }
        return found;
    }
    // resolves: list of registry entries (maybe empty = code not in the registry), or null = no code could be read
    function scan() {
        return new Promise(res => {
            scanRes = async src => {
                if (!src) return res(null);
                const codes = await decode(src); if (!codes.length) return res(null);
                const keys = new Set(); codes.forEach(c => gtinToEans(c).forEach(k => keys.add(k)));
                res(DB.filter(d => d.b.some(b => keys.has(String(b).replace(/\D/g, '')))));
            };
            vib(); N.pickPhoto('__scan__');
        });
    }

    // ---------- cards ----------
    const prev = window.mtCardExtras;
    window.mtCardExtras = function (li, m) {
        if (prev) try { prev(li, m); } catch (e) { console.error(e); }
        if (!li || !m) return;
        const info = li.querySelector('.med-info') || li;
        const saved = loadS();
        (m.items || []).forEach(it => {
            const v = it && saved[m.id + '|' + it.name];
            if (!v) return;
            const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-now';
            b.textContent = fill(tx('now'), { n: v.n }) + ' · ' + tx(v.lv).split(':')[0].split('.')[0];
            b.onclick = () => {
                mtDialog({ text: fill(tx('delQ'), { n: v.n, o: it.name }), icon: '🔄', ok: tx('del'), cancel: tx('back') }).then(d => {
                    if (!d) return;
                    const o = loadS(); delete o[m.id + '|' + it.name]; saveS(o); renderMeds();
                });
            };
            info.appendChild(b);
        });
        let row = li.querySelector(':scope > .pl-row');
        if (!row) { row = document.createElement('div'); row.className = 'pl-row'; li.classList.add('pl-wrap'); li.appendChild(row); }
        const b = document.createElement('button'); b.type = 'button'; b.className = 'sb-btn'; b.textContent = tx('btn');
        b.onclick = () => start(m);
        row.appendChild(b);
    };
    if (typeof renderMeds === 'function') try { renderMeds(); } catch (e) { }
    window.mtSubstCompare = compare; // for tests
})();
