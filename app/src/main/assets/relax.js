// M-044: calm mode. Full-screen real 3D animated worlds (Three.js canvas), zen / meditation sounds
// (synthesized singing bowls and OM drone, or nature loops), a breathing guide and a sleep timer that
// fades sound and picture out and closes by itself.
(function () {
    'use strict';
    const L5 = ['he', 'ar', 'ro', 'fr', 'en'];
    // [he, ar, ro, fr, en]
    const TX = {
        btn: ['רוגע', 'هدوء', 'Relaxare', 'Détente', 'Calm'],
        title: ['🌙 רגע של רוגע', '🌙 لحظة هدوء', '🌙 Clipă de liniște', '🌙 Un moment de calme', '🌙 A calm moment'],
        scene: ['🎬 רקע', '🎬 الخلفية', '🎬 Peisaj', '🎬 Décor', '🎬 Scene'],
        sound: ['🎵 צליל', '🎵 الصوت', '🎵 Sunet', '🎵 Son', '🎵 Sound'],
        timer: ['⏳ כיבוי אוטומטי', '⏳ إيقاف تلقائي', '⏳ Oprire automată', '⏳ Arrêt automatique', '⏳ Sleep timer'],
        vol: ['🔊 עוצמה', '🔊 مستوى الصوت', '🔊 Volum', '🔊 Volume', '🔊 Volume'],
        breath: ['🫁 הנחיית נשימה', '🫁 إرشاد التنفس', '🫁 Ghid de respirație', '🫁 Guide de respiration', '🫁 Breathing guide'],
        inhale: ['שאיפה…', 'شهيق…', 'Inspiră…', 'Inspirez…', 'Breathe in…'],
        hold: ['להחזיק', 'احبس', 'Ține', 'Retenez', 'Hold'],
        exhale: ['נשיפה…', 'زفير…', 'Expiră…', 'Expirez…', 'Breathe out…'],
        off: ['ללא', 'بدون', 'Fără', 'Non', 'Off'],
        min: ['דק׳', 'د', 'min', 'min', 'min'],
        tapHint: ['נגיעה במסך מציגה או מסתירה את התפריט', 'المس الشاشة لإظهار القائمة أو إخفائها', 'Atinge ecranul pentru meniu', 'Touchez l’écran pour le menu', 'Tap the screen to show or hide the menu'],
        left: ['ייסגר בעוד', 'يُغلق بعد', 'Se oprește în', 'Arrêt dans', 'Ends in'],
        noGL: ['המכשיר לא תומך בתלת־ממד', 'الجهاز لا يدعم ثلاثي الأبعاد', 'Dispozitivul nu suportă 3D', 'Pas de 3D sur cet appareil', 'This device has no 3D support'],
        s_aurora: ['זוהר צפוני', 'الشفق القطبي', 'Aurora', 'Aurore', 'Aurora'],
        s_ocean: ['ים בלילה', 'بحر ليلي', 'Mare noaptea', 'Mer la nuit', 'Night sea'],
        s_galaxy: ['גלקסיה', 'مجرّة', 'Galaxie', 'Galaxie', 'Galaxy'],
        s_lanterns: ['פנסים צפים', 'فوانيس طائرة', 'Lampioane', 'Lanternes', 'Lanterns'],
        s_orb: ['כדור נשימה', 'كرة التنفس', 'Sfera respirației', 'Sphère de souffle', 'Breathing orb'],
        a_bowls: ['קערות טיבטיות', 'أوعية تبتية', 'Boluri tibetane', 'Bols tibétains', 'Singing bowls'],
        a_drone: ['אום מדיטציה', 'أوم تأمل', 'Om meditație', 'Om méditation', 'Om meditation'],
        a_zen: ['זן', 'زن', 'Zen', 'Zen', 'Zen'],
        a_rain: ['גשם', 'مطر', 'Ploaie', 'Pluie', 'Rain'],
        a_ocean: ['גלים', 'أمواج', 'Valuri', 'Vagues', 'Waves'],
        a_forest: ['יער', 'غابة', 'Pădure', 'Forêt', 'Forest'],
        a_night: ['לילה', 'ليل', 'Noapte', 'Nuit', 'Night'],
        a_fire: ['אח בוערת', 'موقد', 'Foc', 'Feu', 'Fireplace'],
        a_none: ['שקט', 'صمت', 'Liniște', 'Silence', 'Silence']
    };
    const li = () => Math.max(0, L5.indexOf(typeof LANG === 'string' ? LANG : 'he'));
    const tx = k => (TX[k] || [k])[li()];

    const SCENES = [['aurora', '🌌'], ['ocean', '🌊'], ['galaxy', '🌀'], ['lanterns', '🏮'], ['orb', '🔮']];
    const SOUNDS = [['bowls', '🔔'], ['drone', '🕉️'], ['zen', '🎋'], ['rain', '🌧️'], ['ocean', '🌊'], ['forest', '🌲'], ['night', '🦗'], ['fire', '🔥'], ['none', '🔇']];
    const TIMERS = [0, 10, 20, 30, 45, 60];
    const BREATH = { inh: 4, hold: 1.5, exh: 6 }; // seconds, calm 4 / 1.5 / 6 rhythm
    const BP = BREATH.inh + BREATH.hold + BREATH.exh;

    let st = { scene: 'aurora', sound: 'bowls', timer: 30, vol: 60, breath: false };
    try { Object.assign(st, JSON.parse(localStorage.getItem('medtime_relax') || '{}')); } catch (e) { }
    const save = () => { try { localStorage.setItem('medtime_relax', JSON.stringify(st)); } catch (e) { } };

    // ======================= page =======================
    let root, canvas, panel, hideT = 0, open = false;
    function build() {
        if (root) return;
        root = document.createElement('div');
        root.id = 'relax';
        root.innerHTML =
            '<canvas id="rx-canvas"></canvas>' +
            '<div class="rx-fade"></div>' +
            '<button type="button" class="rx-close" aria-label="close">✕</button>' +
            '<div class="rx-left"></div>' +
            '<div class="rx-breath"><div class="rx-ring"></div><div class="rx-btext"></div></div>' +
            '<div class="rx-hint"></div>' +
            '<div class="rx-panel">' +
            '<div class="rx-title"></div>' +
            '<div class="rx-lbl" data-k="scene"></div><div class="rx-row" id="rx-scenes"></div>' +
            '<div class="rx-lbl" data-k="sound"></div><div class="rx-row" id="rx-sounds"></div>' +
            '<div class="rx-lbl" data-k="timer"></div><div class="rx-row" id="rx-timers"></div>' +
            '<div class="rx-line"><span data-k="vol"></span><input type="range" class="vol" id="rx-vol" min="0" max="100" step="5"></div>' +
            '<label class="rx-line"><span data-k="breath"></span><input type="checkbox" id="rx-br" class="toggle"></label>' +
            '</div>';
        document.body.appendChild(root);
        canvas = root.querySelector('#rx-canvas');
        panel = root.querySelector('.rx-panel');
        root.querySelector('.rx-close').addEventListener('click', e => { e.stopPropagation(); closeRelax(); });
        const vol = root.querySelector('#rx-vol');
        vol.addEventListener('input', () => { st.vol = +vol.value; paintVol(); setVol(st.vol / 100); save(); poke(); });
        const br = root.querySelector('#rx-br');
        br.addEventListener('change', () => { st.breath = br.checked; save(); drawBreath(); poke(); });
        panel.addEventListener('pointerdown', e => { e.stopPropagation(); poke(); });
        // tap on the picture: show / hide the menu; drag: look around
        let sx = 0, sy = 0, down = false;
        root.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sy = e.clientY; });
        root.addEventListener('pointermove', e => {
            if (!down) return;
            look.tx = Math.max(-1, Math.min(1, look.tx + (e.clientX - sx) / innerWidth * 1.5));
            look.ty = Math.max(-1, Math.min(1, look.ty + (e.clientY - sy) / innerHeight * 1.5));
            sx = e.clientX; sy = e.clientY;
        });
        root.addEventListener('pointerup', e => {
            if (!down) return; down = false;
            if (Math.abs(e.clientX - sx) < 8 && Math.abs(e.clientY - sy) < 8 && !e.target.closest('.rx-panel, .rx-close')) togglePanel();
        });
    }
    function paintVol() { const v = root.querySelector('#rx-vol'); v.value = st.vol; v.style.setProperty('--p', st.vol + '%'); }
    function chips(id, list, cur, label, pick) {
        const box = root.querySelector('#' + id);
        box.innerHTML = list.map(([k, ico]) => '<button type="button" class="rx-chip' + (k === cur ? ' sel' : '') + '" data-k="' + k + '">' +
            (ico ? '<span class="rx-ico">' + ico + '</span>' : '') + '<span>' + label(k) + '</span></button>').join('');
        box.querySelectorAll('.rx-chip').forEach(b => b.addEventListener('click', () => { pick(b.dataset.k); poke(); }));
        const sel = box.querySelector('.sel'); if (sel) sel.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    function drawPanel() {
        root.querySelector('.rx-title').textContent = tx('title');
        root.querySelectorAll('[data-k]').forEach(el => { if (!el.classList.contains('rx-chip') && TX[el.dataset.k]) el.textContent = tx(el.dataset.k); });
        root.querySelector('.rx-hint').textContent = tx('tapHint');
        chips('rx-scenes', SCENES, st.scene, k => tx('s_' + k), k => { st.scene = k; save(); setScene(k); drawPanel(); });
        chips('rx-sounds', SOUNDS, st.sound, k => tx('a_' + k), k => { st.sound = k; save(); playSound(k); drawPanel(); });
        chips('rx-timers', TIMERS.map(m => [String(m), m ? '' : '♾️']), String(st.timer), k => +k ? k + ' ' + tx('min') : tx('off'),
            k => { st.timer = +k; save(); startTimer(); drawPanel(); });
        paintVol();
        root.querySelector('#rx-br').checked = !!st.breath;
        drawBreath();
    }
    function poke() { clearTimeout(hideT); root.classList.remove('rx-hide'); hideT = setTimeout(() => root.classList.add('rx-hide'), 9000); }
    function togglePanel() { if (root.classList.contains('rx-hide')) poke(); else { clearTimeout(hideT); root.classList.add('rx-hide'); } }
    function drawBreath() { root.classList.toggle('rx-br-on', !!st.breath || st.scene === 'orb'); }

    // ======================= sleep timer =======================
    let endAt = 0, tickT = 0, ending = false;
    function startTimer() {
        endAt = st.timer ? Date.now() + st.timer * 60000 : 0; ending = false;
        root.classList.remove('rx-ending'); setVol(st.vol / 100);
        clearInterval(tickT); tickT = setInterval(tick, 1000); tick();
    }
    function tick() {
        const el = root.querySelector('.rx-left');
        if (!endAt) { el.textContent = ''; return; }
        const left = Math.max(0, endAt - Date.now());
        const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
        el.textContent = '⏳ ' + tx('left') + ' ' + m + ':' + String(s).padStart(2, '0');
        if (left <= 20000 && !ending) { ending = true; root.classList.add('rx-ending'); fadeVol(0, 19000); }
        if (left <= 0) closeRelax();
    }

    // ======================= sound =======================
    let ac = null, master = null, wet = null, loopEl = null, synthT = 0, nodes = [], vol = 0.6, fadeI = 0;
    function audio() {
        if (!ac) {
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
            ac = new AC(); master = ac.createGain(); master.connect(ac.destination);
            const conv = ac.createConvolver(), len = ac.sampleRate * 5, buf = ac.createBuffer(2, len, ac.sampleRate);
            for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
            conv.buffer = buf; wet = ac.createGain(); wet.gain.value = 0.9; wet.connect(conv); conv.connect(master);
        }
        if (ac.state === 'suspended') ac.resume();
        return ac;
    }
    function setVol(v) {
        vol = v; clearInterval(fadeI);
        if (master) master.gain.setTargetAtTime(v * 0.9, ac.currentTime, 0.1);
        if (loopEl) loopEl.volume = Math.min(1, v);
    }
    function fadeVol(to, ms) {
        clearInterval(fadeI); const from = vol, t0 = Date.now();
        fadeI = setInterval(() => {
            const k = Math.min(1, (Date.now() - t0) / ms), v = from + (to - from) * k; vol = v;
            if (master) master.gain.value = v * 0.9; if (loopEl) loopEl.volume = Math.max(0, Math.min(1, v));
            if (k >= 1) clearInterval(fadeI);
        }, 100);
    }
    function stopSound() {
        clearTimeout(synthT); synthT = 0;
        if (loopEl) { loopEl.pause(); loopEl.src = ''; loopEl = null; }
        nodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch (e) { } }); nodes = [];
    }
    function bowl(f, amp) {
        const t = ac.currentTime, out = ac.createGain(); out.gain.value = amp;
        out.connect(master); out.connect(wet);
        [[1, 1, 11], [2.71, 0.45, 7], [5.15, 0.2, 4.5], [8.5, 0.08, 3]].forEach(([r, a, dec]) => {
            [0, 0.7].forEach(det => {
                const o = ac.createOscillator(), g = ac.createGain();
                o.type = 'sine'; o.frequency.value = f * r + det;
                g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(a * 0.22, t + 0.015);
                g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
                o.connect(g); g.connect(out); o.start(t); o.stop(t + dec + 0.1);
            });
        });
    }
    function bowls() {
        const notes = [174.6, 196, 220, 261.6, 293.7, 329.6, 392];
        const f = notes[Math.floor(Math.random() * notes.length)];
        bowl(f, 0.9);
        if (Math.random() < 0.3) setTimeout(() => open && bowl(f * 1.5, 0.45), 900 + Math.random() * 900);
        synthT = setTimeout(bowls, 6500 + Math.random() * 5500);
    }
    function drone() {
        const t = ac.currentTime, bus = ac.createGain(); bus.gain.value = 0;
        bus.gain.linearRampToValueAtTime(0.5, t + 4); bus.connect(master); bus.connect(wet); nodes.push(bus);
        [[108, 'sine', 0.5], [162, 'sine', 0.22], [216, 'triangle', 0.14], [54, 'sine', 0.3], [324, 'sine', 0.06]].forEach(([f, type, a], i) => {
            const o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
            o.type = type; o.frequency.value = f + (i % 2 ? 0.4 : -0.3); g.gain.value = a;
            lfo.frequency.value = 0.05 + i * 0.023; lg.gain.value = a * 0.45; lfo.connect(lg); lg.connect(g.gain);
            o.connect(g); g.connect(bus); o.start(); lfo.start(); nodes.push(o, lfo);
        });
        // soft breathing air
        const len = ac.sampleRate * 2, nb = ac.createBuffer(1, len, ac.sampleRate), d = nb.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const n = ac.createBufferSource(); n.buffer = nb; n.loop = true;
        const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
        const ng = ac.createGain(); ng.gain.value = 0.05;
        const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 1 / BP; lg.gain.value = 0.045;
        lfo.connect(lg); lg.connect(ng.gain);
        n.connect(lp); lp.connect(ng); ng.connect(bus); n.start(); lfo.start(); nodes.push(n, lfo);
        synthT = setTimeout(function chime() { if (!open) return; bowl(216, 0.35); synthT = setTimeout(chime, 22000 + Math.random() * 15000); }, 9000);
    }
    function playSound(k) {
        stopSound();
        if (k === 'none' || !open) return;
        if (k === 'bowls' || k === 'drone') {
            if (!audio()) return;
            master.gain.value = vol * 0.9;
            k === 'bowls' ? bowls() : drone();
        } else {
            loopEl = new Audio('ambient/' + k + '.ogg'); loopEl.loop = true; loopEl.volume = Math.min(1, vol);
            loopEl.play().catch(() => { });
        }
    }

    // ======================= 3D =======================
    let renderer = null, scene = null, camera = null, world = null, clock = null, raf = 0;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };
    let glowTexC = null;
    function glowTex() {
        if (glowTexC) return glowTexC;
        const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
        const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.18, 'rgba(255,255,255,0.75)');
        r.addColorStop(0.45, 'rgba(255,255,255,0.18)'); r.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = r; g.fillRect(0, 0, 128, 128);
        glowTexC = new THREE.CanvasTexture(c); return glowTexC;
    }
    function skyDome(top, bottom, horizon) {
        const m = new THREE.ShaderMaterial({
            side: THREE.BackSide, depthWrite: false,
            uniforms: { uTop: { value: new THREE.Color(top) }, uBot: { value: new THREE.Color(bottom) }, uHor: { value: new THREE.Color(horizon || bottom) } },
            vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
            fragmentShader: 'uniform vec3 uTop,uBot,uHor; varying vec3 vP; void main(){ float h=vP.y; vec3 c = h>0. ? mix(uHor,uTop,pow(h,0.55)) : mix(uHor,uBot,pow(-h,0.4)); gl_FragColor=vec4(c,1.); }'
        });
        const s = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), m); s.renderOrder = -10; return s;
    }
    function stars(n, rad, minY, size) {
        const g = new THREE.BufferGeometry(), p = new Float32Array(n * 3), c = new Float32Array(n * 3), ph = new Float32Array(n);
        const col = new THREE.Color();
        for (let i = 0; i < n; i++) {
            let v; do { v = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1); } while (v.length() > 1 || v.length() < 0.2);
            v.normalize().multiplyScalar(rad * (0.8 + Math.random() * 0.2)); if (v.y < minY) v.y = Math.abs(v.y) + minY;
            p.set([v.x, v.y, v.z], i * 3);
            col.setHSL(0.55 + Math.random() * 0.2, 0.5, 0.75 + Math.random() * 0.25); c.set([col.r, col.g, col.b], i * 3); ph[i] = Math.random() * 6.28;
        }
        g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1));
        const m = new THREE.ShaderMaterial({
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            uniforms: { uT: { value: 0 }, uMap: { value: glowTex() }, uS: { value: size || 3 } },
            vertexShader: 'attribute float ph; attribute vec3 color; uniform float uT,uS; varying vec3 vC; varying float vA; void main(){ vC=color; vA=0.55+0.45*sin(uT*1.3+ph*3.); vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=uS*(0.6+0.6*fract(ph)); gl_Position=projectionMatrix*mv; }',
            fragmentShader: 'uniform sampler2D uMap; varying vec3 vC; varying float vA; void main(){ vec4 t=texture2D(uMap,gl_PointCoord); gl_FragColor=vec4(vC*vA, t.a*vA); }'
        });
        const pts = new THREE.Points(g, m); pts.userData.u = m.uniforms; return pts;
    }
    const NOISE = 'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}' +
        'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}' +
        'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}';
    function breathK(t) { // 0..1 orb size and phase name
        const x = t % BP;
        if (x < BREATH.inh) { const k = x / BREATH.inh; return [0.5 - 0.5 * Math.cos(k * Math.PI), 'inhale']; }
        if (x < BREATH.inh + BREATH.hold) return [1, 'hold'];
        const k = (x - BREATH.inh - BREATH.hold) / BREATH.exh; return [0.5 + 0.5 * Math.cos(k * Math.PI), 'exhale'];
    }

    const WORLDS = {
        aurora() {
            scene.add(skyDome(0x02030f, 0x01020a, 0x0b1f3a));
            const st1 = stars(2500, 700, 5, 3.2); scene.add(st1);
            const mats = [];
            const auroraMat = (c1, c2, seed) => {
                const m = new THREE.ShaderMaterial({
                    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
                    uniforms: { uT: { value: 0 }, uC1: { value: new THREE.Color(c1) }, uC2: { value: new THREE.Color(c2) }, uS: { value: seed } },
                    vertexShader: 'uniform float uT,uS; varying vec2 vUv; void main(){ vUv=uv; vec3 p=position; p.z+=sin(p.x*0.025+uT*0.12+uS)*28.+sin(p.x*0.07-uT*0.09)*7.; p.y+=sin(p.x*0.03+uT*0.1)*4.; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }',
                    fragmentShader: 'uniform float uT,uS; uniform vec3 uC1,uC2; varying vec2 vUv; ' + NOISE +
                        'void main(){ float n=fbm(vec2(vUv.x*5.+uS+uT*0.035, uT*0.06)); float rays=noise(vec2(vUv.x*140.+n*14., uT*0.25+uS)); rays=0.35+0.65*rays*rays;' +
                        'float top=0.45+0.5*n; float band=smoothstep(0.,0.18,vUv.y)*(1.-smoothstep(top-0.3,top,vUv.y)); float a=band*rays*(0.45+n)*1.6;' +
                        'float edge=smoothstep(0.,0.12,vUv.x)*smoothstep(1.,0.88,vUv.x); vec3 col=mix(uC1,uC2,smoothstep(0.15,0.85,vUv.y)); gl_FragColor=vec4(col*a*edge, a*edge); }'
                });
                mats.push(m); return m;
            };
            const g = new THREE.PlaneGeometry(520, 90, 260, 1);
            const a1 = new THREE.Mesh(g, auroraMat(0x22ff99, 0x7c3aed, 0.0)); a1.position.set(0, 58, -260); scene.add(a1);
            const a2 = new THREE.Mesh(g, auroraMat(0x2dd4bf, 0xec4899, 3.1)); a2.position.set(40, 70, -330); a2.rotation.y = 0.25; scene.add(a2);
            const a3 = new THREE.Mesh(g, auroraMat(0x4ade80, 0x38bdf8, 6.2)); a3.position.set(-80, 64, -300); a3.rotation.y = -0.3; scene.add(a3);
            // mountains
            const mg = new THREE.PlaneGeometry(1400, 260, 140, 26); mg.rotateX(-Math.PI / 2);
            const pa = mg.attributes.position;
            for (let i = 0; i < pa.count; i++) {
                const x = pa.getX(i), z = pa.getZ(i), far = (130 - z) / 260;
                const h = Math.max(0, (Math.sin(x * 0.011) * 0.5 + Math.sin(x * 0.027 + 1.7) * 0.3 + Math.sin(x * 0.061 + z * 0.02) * 0.2 + 0.35) * 70 * far + Math.random() * 3 * far);
                pa.setY(i, h);
            }
            mg.computeVertexNormals();
            const mm = new THREE.MeshStandardMaterial({ color: 0x0a1226, roughness: 0.95, flatShading: true });
            const mtn = new THREE.Mesh(mg, mm); mtn.position.set(0, -2, -290); scene.add(mtn);
            const mtnR = new THREE.Mesh(mg, new THREE.MeshBasicMaterial({ color: 0x050b18, side: THREE.DoubleSide })); mtnR.scale.y = -1; mtnR.position.set(0, -2, -290); scene.add(mtnR);
            scene.add(new THREE.HemisphereLight(0x3ddc97, 0x020617, 0.28));
            const dl = new THREE.DirectionalLight(0x8b5cf6, 0.25); dl.position.set(-1, 2, -2); scene.add(dl);
            // lake with mirrored aurora
            const mir = [a1, a2, a3].map(a => { const r = a.clone(); r.scale.y = -1; r.position.y = -a.position.y - 4; scene.add(r); return r; });
            const lake = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0x010614, transparent: true, opacity: 0.72, depthWrite: false }));
            lake.rotation.x = -Math.PI / 2; lake.position.y = -2.2; lake.renderOrder = 5; scene.add(lake);
            camera.position.set(0, 6, 40); camera.userData.base = new THREE.Vector3(0, 6, 40); camera.userData.at = new THREE.Vector3(0, 30, -200);
            return { update(t) { mats.forEach(m => m.uniforms.uT.value = t); st1.userData.u.uT.value = t; } };
        },

        ocean() {
            scene.add(skyDome(0x030716, 0x01030a, 0x1b2a55));
            const st1 = stars(2000, 700, 30, 3); scene.add(st1);
            const moonPos = new THREE.Vector3(0, 95, -520);
            const moon = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xfff7d6, blending: THREE.AdditiveBlending, depthWrite: false }));
            moon.scale.set(60, 60, 1); moon.position.copy(moonPos); scene.add(moon);
            const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0x6d8cff, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
            halo.scale.set(320, 320, 1); halo.position.copy(moonPos); scene.add(halo);
            const disc = new THREE.Mesh(new THREE.CircleGeometry(13, 48), new THREE.MeshBasicMaterial({ color: 0xfffbe8 }));
            disc.position.copy(moonPos); disc.lookAt(0, 0, 0); scene.add(disc);
            const g = new THREE.PlaneGeometry(900, 900, 300, 300); g.rotateX(-Math.PI / 2);
            const m = new THREE.ShaderMaterial({
                uniforms: { uT: { value: 0 }, uMoon: { value: moonPos.clone().normalize() } },
                vertexShader: 'uniform float uT; varying vec3 vW; varying vec3 vN;' +
                    'void wv(vec2 p,vec2 d,float f,float a,float s,inout float h,inout vec2 g){ d=normalize(d); float x=dot(p,d)*f+uT*s; h+=a*sin(x); g+=a*f*cos(x)*d; }' +
                    'void main(){ vec3 p=position; float h=0.; vec2 g=vec2(0.);' +
                    'wv(p.xz,vec2(1.,0.6),0.05,1.3,0.8,h,g); wv(p.xz,vec2(-0.7,1.),0.09,0.6,1.2,h,g); wv(p.xz,vec2(0.3,1.),0.16,0.25,1.9,h,g); wv(p.xz,vec2(1.,-0.4),0.23,0.12,2.5,h,g);' +
                    'p.y+=h; vN=normalize(vec3(-g.x,1.,-g.y)); vec4 wp=modelMatrix*vec4(p,1.); vW=wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }',
                fragmentShader: 'uniform vec3 uMoon; uniform float uT; varying vec3 vW; varying vec3 vN; ' + NOISE +
                    'void main(){ vec2 q=vW.xz*0.35; float e=0.6; float n0=fbm(q+uT*0.25); vec3 N=normalize(vN+vec3(fbm(q+vec2(e,0.)+uT*0.25)-n0,0.,fbm(q+vec2(0.,e)+uT*0.25)-n0)*0.9);' +
                    'vec3 V=normalize(cameraPosition-vW); vec3 R=reflect(-V,N); float F=0.02+0.98*pow(1.-max(dot(N,V),0.),5.);' +
                    'float sp=pow(max(dot(R,uMoon),0.),300.)*4.+pow(max(dot(R,uMoon),0.),40.)*0.22; vec3 deep=vec3(0.004,0.015,0.04); vec3 sky=vec3(0.06,0.11,0.32);' +
                    'vec3 c=mix(deep,sky,F)+sp*vec3(1.,0.94,0.78); float d=length(vW-cameraPosition); c=mix(c,vec3(0.07,0.1,0.22),smoothstep(100.,440.,d)); gl_FragColor=vec4(c,1.); }'
            });
            scene.add(new THREE.Mesh(g, m));
            camera.position.set(0, 7, 30); camera.userData.base = new THREE.Vector3(0, 7, 30); camera.userData.at = new THREE.Vector3(0, 14, -200);
            return { update(t) { m.uniforms.uT.value = t; st1.userData.u.uT.value = t; camera.userData.bob = Math.sin(t * 0.6) * 0.5; } };
        },

        galaxy() {
            scene.add(skyDome(0x02010a, 0x02010a, 0x0b0626));
            const st1 = stars(2500, 700, -999, 2.6); scene.add(st1);
            const N = 26000, g = new THREE.BufferGeometry(), p = new Float32Array(N * 3), c = new Float32Array(N * 3), s = new Float32Array(N);
            const inC = new THREE.Color(0xffb36b), outC = new THREE.Color(0x4f7bff), pink = new THREE.Color(0xd946ef), col = new THREE.Color();
            for (let i = 0; i < N; i++) {
                const r = Math.pow(Math.random(), 1.6) * 60, arm = (i % 4) / 4 * Math.PI * 2, spin = r * 0.11;
                const rnd = () => Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * (2 + r * 0.22);
                p.set([Math.cos(arm + spin) * r + rnd(), rnd() * 0.35, Math.sin(arm + spin) * r + rnd()], i * 3);
                col.copy(inC).lerp(outC, r / 60); if (Math.random() < 0.08) col.lerp(pink, 0.7); c.set([col.r, col.g, col.b], i * 3);
                s[i] = Math.random();
            }
            g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.setAttribute('ph', new THREE.BufferAttribute(s, 1));
            const m = new THREE.ShaderMaterial({
                transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
                uniforms: { uT: { value: 0 }, uMap: { value: glowTex() }, uPR: { value: renderer.getPixelRatio() } },
                vertexShader: 'attribute vec3 color; attribute float ph; uniform float uPR; varying vec3 vC; void main(){ vC=color; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=(1.+ph*2.4)*uPR*(170./-mv.z); gl_Position=projectionMatrix*mv; }',
                fragmentShader: 'uniform sampler2D uMap; varying vec3 vC; void main(){ float a=texture2D(uMap,gl_PointCoord).a; gl_FragColor=vec4(vC*a*1.0,a); }'
            });
            const gal = new THREE.Points(g, m); scene.add(gal);
            const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xffd7a0, blending: THREE.AdditiveBlending, depthWrite: false }));
            core.scale.set(14, 14, 1); scene.add(core);
            const nebula = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0x7c3aed, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
            nebula.scale.set(150, 150, 1); scene.add(nebula);
            camera.userData.base = null;
            return {
                update(t) {
                    gal.rotation.y = t * 0.03; st1.userData.u.uT.value = t;
                    const a = t * 0.02, r = 72 - Math.sin(t * 0.05) * 10;
                    camera.position.set(Math.sin(a) * r + look.x * 15, 34 + Math.sin(t * 0.07) * 8 - look.y * 15, Math.cos(a) * r);
                    camera.lookAt(0, 0, 0);
                }
            };
        },

        lanterns() {
            scene.add(skyDome(0x0b0a2a, 0x02030c, 0x5a2a3a));
            const st1 = stars(1500, 700, 40, 2.8); scene.add(st1);
            const water = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0x02030a, transparent: true, opacity: 0.9, depthWrite: false }));
            water.rotation.x = -Math.PI / 2; water.renderOrder = 5; scene.add(water);
            const hills = new THREE.Mesh(new THREE.PlaneGeometry(2000, 40), new THREE.MeshBasicMaterial({ color: 0x050616 }));
            hills.position.set(0, 8, -420); scene.add(hills);
            const body = new THREE.CylinderGeometry(0.55, 0.42, 1.1, 14, 1, true);
            const bodyM = new THREE.MeshBasicMaterial({ color: 0xffa94d, side: THREE.DoubleSide });
            const glowM = new THREE.SpriteMaterial({ map: glowTex(), color: 0xff8a3d, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
            const reflM = new THREE.SpriteMaterial({ map: glowTex(), color: 0xff7a2e, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false });
            const L = [];
            const reset = (o, first) => {
                o.x = (Math.random() - 0.5) * 110; o.z = -12 - Math.random() * 170; o.y = first ? Math.random() * 70 : -2 - Math.random() * 5;
                o.v = 0.7 + Math.random() * 0.9; o.ph = Math.random() * 6.28;
            };
            for (let i = 0; i < 90; i++) {
                const g = new THREE.Group(), mb = new THREE.Mesh(body, bodyM), gl = new THREE.Sprite(glowM), rf = new THREE.Sprite(reflM);
                gl.scale.set(6.5, 6.5, 1); g.add(mb); g.add(gl); rf.scale.set(4, 7, 1); rf.renderOrder = 1;
                scene.add(g); scene.add(rf);
                const o = { g, rf }; reset(o, true); L.push(o);
            }
            camera.position.set(0, 6, 30); camera.userData.base = new THREE.Vector3(0, 6, 30); camera.userData.at = new THREE.Vector3(0, 26, -200);
            return {
                update(t, dt) {
                    st1.userData.u.uT.value = t;
                    L.forEach(o => {
                        o.y += o.v * dt; if (o.y > 90) reset(o, false);
                        const sw = Math.sin(t * 0.5 + o.ph) * 1.2;
                        o.g.position.set(o.x + sw, o.y, o.z); o.g.rotation.z = Math.sin(t * 0.8 + o.ph) * 0.08;
                        o.rf.position.set(o.x + sw, -o.y * 0.6 - 0.5, o.z); o.rf.visible = o.y < 70;
                        o.rf.material.opacity = 0.32;
                    });
                }
            };
        },

        orb() {
            scene.add(skyDome(0x050826, 0x010208, 0x16123a));
            const st1 = stars(1800, 700, -999, 2.5); scene.add(st1);
            const m = new THREE.ShaderMaterial({
                transparent: true,
                uniforms: { uT: { value: 0 }, uB: { value: 0 } },
                vertexShader: 'uniform float uT,uB; varying vec3 vN; varying vec3 vV; varying float vD;' +
                    'void main(){ vec3 p=position; float d=sin(p.x*2.1+uT*0.9)*sin(p.y*2.3+uT*0.7)*sin(p.z*1.9+uT*0.8); vD=d; p+=normal*d*(0.16+0.1*uB);' +
                    'vec4 mv=modelViewMatrix*vec4(p,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
                fragmentShader: 'uniform float uB; varying vec3 vN; varying vec3 vV; varying float vD; void main(){ float f=pow(1.-max(dot(vN,vV),0.),2.2);' +
                    'vec3 a=vec3(0.13,0.83,0.93), b=vec3(0.55,0.36,0.96); vec3 c=mix(a,b,0.5+0.5*vD)*(0.45+1.5*f)+vec3(1.)*pow(f,5.)*0.6; c*=0.75+0.45*uB; gl_FragColor=vec4(c,0.55+0.45*f); }'
            });
            const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 48), m); scene.add(orb);
            const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0x38bdf8, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
            glow.scale.set(18, 18, 1); scene.add(glow);
            const N = 3000, g = new THREE.BufferGeometry(), p = new Float32Array(N * 3), ph = new Float32Array(N), c = new Float32Array(N * 3), col = new THREE.Color();
            for (let i = 0; i < N; i++) {
                const r = 5 + Math.random() * 9, a = Math.random() * Math.PI * 2, y = (Math.random() - 0.5) * 2.2 * (1 + (r - 5) * 0.15);
                p.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3); ph[i] = Math.random();
                col.setHSL(0.5 + Math.random() * 0.25, 0.8, 0.7); c.set([col.r, col.g, col.b], i * 3);
            }
            g.setAttribute('position', new THREE.BufferAttribute(p, 3)); g.setAttribute('ph', new THREE.BufferAttribute(ph, 1)); g.setAttribute('color', new THREE.BufferAttribute(c, 3));
            const pm = new THREE.ShaderMaterial({
                transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
                uniforms: { uT: { value: 0 }, uMap: { value: glowTex() }, uS: { value: 1 } },
                vertexShader: 'attribute float ph; attribute vec3 color; uniform float uT,uS; varying vec3 vC; varying float vA; void main(){ vC=color; vA=0.4+0.6*sin(uT*2.+ph*40.); vec3 p=position*uS; vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=(2.+ph*3.)*(30./-mv.z); gl_Position=projectionMatrix*mv; }',
                fragmentShader: 'uniform sampler2D uMap; varying vec3 vC; varying float vA; void main(){ float a=texture2D(uMap,gl_PointCoord).a*vA; gl_FragColor=vec4(vC*a,a); }'
            });
            const ring = new THREE.Points(g, pm); ring.rotation.x = 0.45; scene.add(ring);
            camera.position.set(0, 0, 26); camera.userData.base = new THREE.Vector3(0, 0, 26); camera.userData.at = new THREE.Vector3(0, 0, 0);
            return {
                update(t) {
                    const [b] = breathK(t);
                    m.uniforms.uT.value = t; m.uniforms.uB.value = b; st1.userData.u.uT.value = t;
                    const s = 0.82 + 0.38 * b; orb.scale.setScalar(s); glow.scale.setScalar(14 + 10 * b);
                    ring.rotation.y = t * 0.08; pm.uniforms.uT.value = t; pm.uniforms.uS.value = 0.9 + 0.2 * b; orb.rotation.y = t * 0.1;
                }
            };
        }
    };

    function disposeScene() {
        if (!scene) return;
        scene.traverse(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
        });
        scene = null; world = null;
    }
    function setScene(k) {
        if (!renderer) return;
        disposeScene();
        scene = new THREE.Scene();
        camera.position.set(0, 0, 30); camera.userData = {};
        world = (WORLDS[k] || WORLDS.aurora)();
        drawBreath(); root.classList.toggle('rx-orb', k === 'orb');
        root.classList.remove('rx-in'); void root.offsetWidth; root.classList.add('rx-in');
    }
    function start3D() {
        if (!window.THREE) { root.querySelector('.rx-hint').textContent = tx('noGL'); return; }
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
        } catch (e) { renderer = null; root.querySelector('.rx-hint').textContent = tx('noGL'); return; }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        renderer.setSize(innerWidth, innerHeight, false);
        camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 2500);
        clock = new THREE.Clock();
        setScene(st.scene);
        loop();
    }
    function loop() {
        if (!open || !renderer) return;
        raf = requestAnimationFrame(loop);
        if (document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
        look.x += (look.tx - look.x) * 0.04; look.y += (look.ty - look.y) * 0.04;
        const b = camera.userData.base;
        if (b) {
            camera.position.set(b.x + look.x * 12 + Math.sin(t * 0.05) * 3, b.y - look.y * 5 + (camera.userData.bob || 0), b.z);
            const at = camera.userData.at; camera.lookAt(at.x + look.x * 60, at.y - look.y * 40, at.z);
        }
        if (world) world.update(t, dt);
        renderer.render(scene, camera);
        if (st.breath || st.scene === 'orb') {
            const [k, ph] = breathK(t);
            const ring = root.querySelector('.rx-ring'), txt = root.querySelector('.rx-btext');
            ring.style.transform = 'scale(' + (0.55 + 0.45 * k).toFixed(3) + ')';
            const w = tx(ph); if (txt.textContent !== w) txt.textContent = w;
        }
    }
    function onResize() {
        if (!renderer) return;
        renderer.setSize(innerWidth, innerHeight, false);
        camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    }

    // ======================= open / close =======================
    window.openRelax = function () {
        build(); if (open) return;
        open = true; window.relaxOn = true;
        if (window.amb) try { window.amb.pause(); } catch (e) { }
        if (window.MedTime3D && window.MedTime3D.pause) window.MedTime3D.pause(true);
        root.classList.add('open'); document.documentElement.classList.add('relax-open');
        drawPanel(); poke();
        root.querySelector('.rx-hint').classList.remove('gone');
        setTimeout(() => root && root.querySelector('.rx-hint').classList.add('gone'), 6000);
        vol = st.vol / 100;
        start3D();
        playSound(st.sound);
        startTimer();
        try { history.pushState({ relax: 1 }, ''); } catch (e) { }
    };
    function closeRelax(fromBack) {
        if (!open) return;
        open = false; window.relaxOn = false;
        cancelAnimationFrame(raf); clearInterval(tickT); clearInterval(fadeI); clearTimeout(hideT);
        stopSound(); if (ac) { try { ac.suspend(); } catch (e) { } }
        disposeScene();
        if (renderer) { renderer.dispose(); try { renderer.forceContextLoss(); } catch (e) { } renderer = null; }
        root.classList.remove('open', 'rx-ending'); document.documentElement.classList.remove('relax-open');
        if (window.MedTime3D && window.MedTime3D.pause) window.MedTime3D.pause(false);
        if (typeof window.updateAmbient === 'function') window.updateAmbient();
        if (!fromBack) { try { if (history.state && history.state.relax) history.back(); } catch (e) { } }
        // canvas loses its context; make a fresh one next time
        const c2 = canvas.cloneNode(false); canvas.replaceWith(c2); canvas = c2;
    }
    window.closeRelax = closeRelax;
    window.addEventListener('popstate', () => { if (open) closeRelax(true); });
    window.addEventListener('resize', onResize);
    window.relaxBtnText = () => tx('btn');
    window.relaxRender = function () { const b = document.getElementById('relax-btn'); if (b) b.querySelector('.rb-txt').textContent = tx('btn'); if (open) drawPanel(); };
    document.addEventListener('DOMContentLoaded', window.relaxRender);
    window.relaxRender();
})();
