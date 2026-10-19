// M-082: choose the reading voice, inside the 🔊 voice tile. Each voice has ▶ to hear a sample.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const N = window.MedTimeNative;
    const anchor = document.getElementById('v-on');
    if (!anchor || !N || typeof N.listVoices !== 'function') return;
    const body = anchor.closest('.set-body');

    const T = {
        title: ['🗣️ בחירת קול', '🗣️ اختيار الصوت', '🗣️ Alegeți vocea', '🗣️ Choix de la voix', '🗣️ Choose the voice'],
        note: ['לחצו ▶ כדי לשמוע, ועל השם כדי לבחור', 'اضغط ▶ للاستماع وعلى الاسم للاختيار', 'Apăsați ▶ ca să ascultați și numele ca să alegeți', '▶ pour écouter, le nom pour choisir', 'Tap ▶ to listen, the name to choose'],
        def: ['ברירת המחדל של הטלפון', 'الافتراضي في الهاتف', 'Implicită a telefonului', 'Par défaut du téléphone', 'Phone default'],
        voice: ['קול', 'صوت', 'Voce', 'Voix', 'Voice'],
        // M-082b: every voice gets a friendly name (unisex names: Android does not say if a voice is a man or a woman)
        names: [['נועם', 'טל', 'שי', 'עדי', 'אורי', 'יובל', 'גל', 'עומר'], ['نور', 'سلام', 'رضا', 'إيمان', 'وفاء', 'جهاد', 'صباح', 'هدى'],
            ['Alex', 'Andrei', 'Ioana', 'Dani', 'Cristi', 'Vali', 'Sasha', 'Mihai'], ['Camille', 'Dominique', 'Claude', 'Lou', 'Sacha', 'Maxime', 'Alix', 'Eden'],
            ['Alex', 'Sam', 'Jordan', 'Robin', 'Taylor', 'Jamie', 'Casey', 'Riley']],
        net: ['🌐 צריך אינטרנט', '🌐 يحتاج إنترنت', '🌐 necesită internet', '🌐 Internet requis', '🌐 needs internet'],
        man: ['גבר', 'رجل', 'bărbat', 'homme', 'man'],
        woman: ['אישה', 'امرأة', 'femeie', 'femme', 'woman'],
        offline: ['✨ קולות חדשים, עובדים בלי אינטרנט', '✨ أصوات جديدة تعمل بدون إنترنت', '✨ Voci noi, fără internet', '✨ Nouvelles voix, sans Internet', '✨ New voices, work offline'],
        dl: ['⏳ יורד לבד בפעם הראשונה ב-Wi-Fi', '⏳ يُنزَّل تلقائيًا أول مرة عبر Wi-Fi', '⏳ Se descarcă singur prima dată pe Wi-Fi', '⏳ Se télécharge seul la première fois en Wi-Fi', '⏳ Downloads by itself once, on Wi-Fi'],
        low: ['קול נמוך', 'صوت منخفض', 'voce joasă', 'voix grave', 'low voice'],
        high: ['קול גבוה', 'صوت عالٍ', 'voce înaltă', 'voix aiguë', 'high voice'],
        pitch: [['אבי', 'מיכל'], ['سامي', 'ليلى'], ['Andrei', 'Ioana'], ['Louis', 'Claire'], ['David', 'Emma']],
        noHe: ['בעברית יש רק את קול הטלפון. הקולות המובנים באפליקציה (בלי אינטרנט) קיימים בערבית, רומנית, צרפתית ואנגלית.', '', '', '', ''],
        loading: ['טוען קולות…', 'جارٍ التحميل…', 'Se încarcă…', 'Chargement…', 'Loading voices…'],
        sample: ['שלום, הגיע הזמן לקחת אקמול, כדור אחד.', 'مرحبًا، حان وقت تناول الدواء، حبة واحدة.', 'Bună, este timpul să luați medicamentul, o pastilă.', 'Bonjour, c\'est l\'heure de prendre votre médicament, un comprimé.', 'Hello, it is time to take your medicine, one tablet.']
    };
    const tx = k => T[k][li()];
    // M-088: the sample starts with the user's name, like the real reminder
    const sampleTx = () => { let n = ''; try { n = (localStorage.getItem('medtime_name') || '').trim(); } catch (e) { } return (n ? n + ', ' : '') + tx('sample'); };

    const css = document.createElement('style');
    css.textContent = `
    .vc-box{padding:12px 0 6px;border-top:1px solid rgba(255,255,255,.12);margin-top:10px}
    .vc-title{font-size:1.1rem;font-weight:700}.vc-note{font-size:.85rem;opacity:.7;margin:2px 0 8px}
    .vc-row{display:flex;align-items:center;gap:8px;margin:6px 0}
    .vc-pick{flex:1;text-align:start;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;border-radius:14px;padding:11px 12px;font-size:1rem;font-weight:600}
    .vc-pick small{display:block;font-weight:500;opacity:.7;font-size:.8rem}
    .vc-pick.sel{border-color:#22d3ee;background:linear-gradient(135deg,rgba(34,211,238,.28),rgba(99,102,241,.25));box-shadow:0 0 12px rgba(34,211,238,.45)}
    .vc-play{flex:none;width:48px;height:48px;border-radius:50%;border:0;font-size:1.2rem;color:#fff;background:linear-gradient(135deg,#22c55e,#0d9488)}`;
    document.head.appendChild(css);

    const box = document.createElement('div');
    box.className = 'vc-box';
    body.appendChild(box);
    let data = null;

    function draw() {
        box.innerHTML = '<div class="vc-title"></div><div class="vc-note"></div><div class="vc-list"></div>';
        box.querySelector('.vc-title').textContent = tx('title');
        box.querySelector('.vc-note').textContent = tx('note');
        const list = box.querySelector('.vc-list');
        if (!data) { list.textContent = tx('loading'); return; }
        // only voices that are on the phone and work without internet
        const nm = T.names[li()];
        // M-090: the phone's own variants sounded the same, so instead: the phone voice lower (man) and higher (woman)
        // M-091: phone voice + the voices built into the app (no pitch copies, no downloads)
        const items = [{ name: '', label: '🗣️ ' + tx('def') }];
        if (String(data.chosen || '').startsWith('pitch:')) data.chosen = '';
        // M-087: offline Piper voices with their own names (man / woman)
        const pv = (data.voices || []).filter(v => v.piper);
        if (pv.length) {
            items.push({ head: tx('offline') });
        } else if (li() === 0) items.push({ head: tx('noHe'), small: true });
        pv.forEach(v => items.push({ name: v.name, label: (v.g === 'f' ? '👩 ' : '👨 ') + v.label, sub: tx(v.g === 'f' ? 'woman' : 'man'), off: !v.ready }));
        items.forEach(it => {
            if (it.head) { const h = document.createElement('div'); h.className = 'vc-note'; h.style.marginTop = it.small ? '2px' : '12px'; h.style.opacity = it.small ? '.75' : '1'; h.style.fontWeight = it.small ? '500' : '700'; h.textContent = it.head; list.appendChild(h); return; }
            const r = document.createElement('div'); r.className = 'vc-row';
            r.innerHTML = '<button type="button" class="vc-pick"></button><button type="button" class="vc-play" aria-label="play">▶</button>';
            const p = r.querySelector('.vc-pick');
            p.textContent = it.label;
            if (it.sub) { const s = document.createElement('small'); s.textContent = it.sub; p.appendChild(s); }
            if ((data.chosen || '') === it.name) p.classList.add('sel');
            if (it.off) { p.disabled = true; p.style.opacity = '.55'; r.querySelector('.vc-play').style.visibility = 'hidden'; list.appendChild(r); return; }
            p.onclick = () => {
                data.chosen = it.name; N.setVoice(it.name);
                list.querySelectorAll('.vc-pick').forEach(x => x.classList.toggle('sel', x === p));
                N.previewVoice(it.name, sampleTx());
                if (navigator.vibrate) navigator.vibrate(10);
            };
            r.querySelector('.vc-play').onclick = () => N.previewVoice(it.name, sampleTx());
            list.appendChild(r);
        });
    }
    let again = null;
    window.mtVoices = function (o) {
        data = o || { voices: [] }; draw();
        // while voices are downloading, refresh the list now and then
        clearTimeout(again);
        if (data.piper && data.piper.busy && body.closest('.set-tile').classList.contains('open')) again = setTimeout(() => { try { N.listVoices(); } catch (e) { } }, 4000);
    };
    function load() { data = null; draw(); try { N.listVoices(); } catch (e) { } }
    // load when the tile opens and when the language changes (voices are per language)
    body.closest('.set-tile').querySelector('.set-tile-head').addEventListener('click', load);
    const sel = document.getElementById('lang-select');
    if (sel) sel.addEventListener('change', () => setTimeout(load, 300));
    draw();
})();
