// M-048: 3D opening (about 6.6 s): warp-speed stars, a glossy capsule flies in and spins,
// a glowing DNA double helix wraps it, a shock-wave and spark burst, then the title.
// Falls back to the CSS capsule when WebGL is missing.
(function () {
    'use strict';
    var sp = document.getElementById('splash');
    if (!sp) return;
    var CAP = !!window.__spCapture; // M-093: tools/splash-capture.js records this show frame by frame into splash.mp4
    function start3d() {
    if (!window.THREE) return;
    var canvas = document.createElement('canvas');
    canvas.id = 'sp3d';
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { return; }
    sp.insertBefore(canvas, sp.firstChild);
    sp.classList.add('sp-3d');

    var W = innerWidth, H = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); // M-085: fewer pixels = smooth
    renderer.setSize(W, H, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 400);
    camera.position.set(0, 0, 12);
    if (THREE.RoomEnvironment) {
        var pm = new THREE.PMREMGenerator(renderer);
        scene.environment = pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    }
    scene.add(new THREE.AmbientLight(0x6677ff, 0.2));
    var key = new THREE.PointLight(0x67e8f9, 0.9, 60); key.position.set(5, 6, 8); scene.add(key);
    var rim = new THREE.PointLight(0xc084fc, 1.0, 60); rim.position.set(-6, -3, 4); scene.add(rim);

    // where the capsule should sit: the centre of the (now empty) CSS stage
    var stage = sp.querySelector('.sp-stage');
    function stageY() {
        if (!stage) return 1.2;
        var r = stage.getBoundingClientRect(), ndc = 1 - 2 * ((r.top + r.height / 2) / innerHeight);
        return ndc * Math.tan(THREE.MathUtils.degToRad(22.5)) * 12;
    }
    var home = new THREE.Vector3(0, stageY() + 0.5, 0);

    function glowTex() {
        var c = document.createElement('canvas'); c.width = c.height = 64; var g = c.getContext('2d');
        var r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.3, 'rgba(255,255,255,0.6)'); r.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
    }
    var glow = glowTex();

    // ---- warp stars: streaks rushing at the camera ----
    var NS = 700, sPos = new Float32Array(NS * 6), sData = [];
    for (var i = 0; i < NS; i++) {
        var a = Math.random() * Math.PI * 2, r = 1.5 + Math.random() * 18;
        sData.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: -Math.random() * 200, v: 60 + Math.random() * 80 });
    }
    // M-085: every streak has its own colour (cyan, violet, pink, gold), bright head, faded tail
    var sCol = new Float32Array(NS * 6), PAL = [0x67e8f9, 0xa78bfa, 0xf472b6, 0xfde047, 0x34d399, 0x60a5fa], cc = new THREE.Color();
    for (var i2 = 0; i2 < NS; i2++) {
        cc.setHex(PAL[i2 % PAL.length]);
        sCol.set([cc.r, cc.g, cc.b, cc.r * 0.15, cc.g * 0.15, cc.b * 0.15], i2 * 6);
    }
    var sGeo = new THREE.BufferGeometry(); sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute('color', new THREE.BufferAttribute(sCol, 3));
    var sMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });

    // M-085: colourful nebula clouds far behind, slowly drifting and breathing
    var neb = [], NEB = [[0x6d28d9, -7, 5], [0x0891b2, 7, -4], [0xbe185d, -5, -6], [0x1d4ed8, 6, 6], [0xb45309, 0, -1]];
    NEB.forEach(function (n, j) {
        var m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: n[0], transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
        m.position.set(n[1] * 2.2, n[2] * 2.2, -60); m.scale.set(46, 46, 1); scene.add(m);
        neb.push({ m: m, x: n[1] * 2.2, y: n[2] * 2.2, ph: j * 1.3 });
    });
    var streaks = new THREE.LineSegments(sGeo, sMat); scene.add(streaks);

    // ---- glossy capsule (two halves + shiny band) ----
    var cap = new THREE.Group();
    function half(color, up) {
        var pts = [], R = 0.62, L = 0.95;
        for (var k = 0; k <= 16; k++) { var t = k / 16 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(t) * R, L + Math.sin(t) * R)); }
        pts.unshift(new THREE.Vector2(R, 0)); pts.unshift(new THREE.Vector2(0.001, 0));
        pts.sort(function (p, q) { return p.y - q.y; });
        var g = new THREE.LatheGeometry(pts.filter(function (p, n) { return n === 0 || p.x > 0.0005 || n === pts.length - 1; }), 48);
        var m = new THREE.MeshPhysicalMaterial({ color: color, emissive: color, emissiveIntensity: 0.32, metalness: 0, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.08, envMapIntensity: 0.22, toneMapped: false }); // M-092: deeper colour
        var mesh = new THREE.Mesh(g, m); if (!up) mesh.rotation.z = Math.PI; return mesh;
    }
    var top = half(0xff0a1e, true), bot = half(0x1d5cff, false);
    cap.add(top); cap.add(bot);
    var band = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 12, 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.15 }));
    band.rotation.x = Math.PI / 2; cap.add(band);
    var capGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0x60a5fa, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    capGlow.scale.set(6, 6, 1); cap.add(capGlow);
    cap.scale.setScalar(0.001);
    scene.add(cap);

    // ---- DNA double helix of glowing beads ----
    // M-092: drawn as 3 objects (bead glow, bead cores, rungs) instead of ~150, so the phone keeps a steady frame rate
    var helix = new THREE.Group(), NB = 34;
    var hPos = [], hCol = [], rPos = [], hc = new THREE.Color();
    for (var b = 0; b < NB; b++) {
        var y = (b / (NB - 1) - 0.5) * 4.2, ang = b * 0.55, ends = [];
        for (var s2 = 0; s2 < 2; s2++) {
            var off = s2 * Math.PI, px = Math.cos(ang + off) * 1.25, pz = Math.sin(ang + off) * 1.25;
            hc.setHSL(((b / NB) * 0.8 + s2 * 0.5) % 1, 1, 0.55); // rainbow, full colour
            hPos.push(px, y, pz); hCol.push(hc.r, hc.g, hc.b); ends.push(px, y, pz);
        }
        if (b % 2 === 0) rPos.push.apply(rPos, ends);
    }
    var hGeo = new THREE.BufferGeometry();
    hGeo.setAttribute('position', new THREE.Float32BufferAttribute(hPos, 3));
    hGeo.setAttribute('color', new THREE.Float32BufferAttribute(hCol, 3));
    helix.add(new THREE.Points(hGeo, new THREE.PointsMaterial({ map: glow, size: 0.62, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
    helix.add(new THREE.Points(hGeo, new THREE.PointsMaterial({ map: glow, size: 0.24, color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })));
    var rGeo = new THREE.BufferGeometry(); rGeo.setAttribute('position', new THREE.Float32BufferAttribute(rPos, 3));
    helix.add(new THREE.LineSegments(rGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })));
    helix.rotation.z = 0.5; helix.scale.setScalar(0.001);
    scene.add(helix);

    // ---- shock-wave ring + spark burst ----
    // M-085: three coloured shock-waves one after another
    var rings = [0x22d3ee, 0xe879f9, 0xfacc15].map(function (c) {
        var r0 = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.08, 64), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
        scene.add(r0); return r0;
    });
    // M-085: light rays turning behind the capsule after the burst
    function rayTex() {
        var c = document.createElement('canvas'); c.width = c.height = 256; var g = c.getContext('2d');
        g.translate(128, 128);
        for (var k = 0; k < 18; k++) {
            g.rotate(Math.PI * 2 / 18);
            var gr = g.createLinearGradient(0, 0, 0, -128); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
            g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(-7, -128); g.lineTo(7, -128); g.closePath(); g.fill();
        }
        return new THREE.CanvasTexture(c);
    }
    var rays = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: rayTex(), color: 0xa5f3fc, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    rays.scale.set(9, 9, 1); scene.add(rays);
    var NP = 260, pPos = new Float32Array(NP * 3), pVel = [];
    for (var q = 0; q < NP; q++) {
        var v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(2 + Math.random() * 6);
        pVel.push(v);
    }
    var pCol = new Float32Array(NP * 3);
    for (var q2 = 0; q2 < NP; q2++) { cc.setHSL(Math.random(), 0.95, 0.65); pCol.set([cc.r, cc.g, cc.b], q2 * 3); } // M-085: rainbow sparks
    var pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    var pMat = new THREE.PointsMaterial({ map: glow, size: 0.32, vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    var sparks = new THREE.Points(pGeo, pMat); scene.add(sparks);

    // ---- bloom when available ----
    var composer = null;
    try {
        if (THREE.EffectComposer && THREE.UnrealBloomPass) {
            composer = new THREE.EffectComposer(renderer);
            composer.addPass(new THREE.RenderPass(scene, camera));
            if (composer.setPixelRatio) composer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25)); // M-085: lighter glow pass
            composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.55, 0.4, 0.62));
        }
    } catch (e) { composer = null; }

    var ease = function (x) { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 3); };
    var back = function (x) { x = Math.min(1, Math.max(0, x)); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
    try { renderer.compile(scene, camera); } catch (e) { } // M-057: build shaders before the show starts
    var sdt = 1 / 60, t0 = 0, last = 0, T = 0, alive = true, slow = 0, ended = false;

    function frame(now) {
        if (!alive) return;
        if (!document.body.contains(sp)) { cleanup(); return; }
        if (!CAP) requestAnimationFrame(frame);
        // M-089: while it fades out it keeps moving (no frozen moment), drawn the light way without the glow pass
        // M-090: during the fade the 3D layer fades away fast and stops drawing, so only the main screen uses the graphics chip
        if (sp.classList.contains('out')) return;
        // M-057: start only once the page is ready (the go-signal exists), and run on our own clock so a slow frame never skips part of the show
        if (!t0) { if (!window.__spGo) return; t0 = now; last = now; window.__sp3d = true; window.__spGo(); }
        var raw, dt;
        if (CAP) { raw = dt = 1 / 60; } else {
            raw = Math.min(0.1, (now - last) / 1000); last = now;
            // M-092: steady "film" motion: the step is smoothed, so one late frame does not make a jump
            sdt += (raw - sdt) * 0.12; dt = raw > 0.08 ? raw : sdt; T += dt;
        }
        var t = T;
        // M-085: decide about the glow only once, in the first 0.5 s (before anything is on screen),
        // so the look never jumps in the middle of the show
        if (t > 0.15 && t < 0.5 && raw > 0.034) slow++;
        if (slow > 4 && composer && t < 0.6) composer = null; // weak phone: no glow

        // warp: fast at first, then slows and fades
        var warp = t < 1.6 ? 1 : Math.max(0, 1 - (t - 1.6) / 1.4);
        for (var i = 0; i < NS; i++) {
            var s = sData[i];
            s.z += s.v * dt * (0.15 + 0.85 * warp);
            if (s.z > 12) s.z -= 200;
            var len = 0.4 + 6 * warp;
            var o = i * 6; // M-085: no new arrays each frame (no garbage = no hiccups)
            sPos[o] = s.x; sPos[o + 1] = s.y; sPos[o + 2] = s.z; sPos[o + 3] = s.x; sPos[o + 4] = s.y; sPos[o + 5] = s.z - len;
        }
        sGeo.attributes.position.needsUpdate = true;
        sMat.opacity = 0.25 + 0.65 * warp;
        for (var n = 0; n < neb.length; n++) {
            var nb = neb[n];
            nb.m.material.opacity = (0.13 + 0.05 * Math.sin(t * 0.9 + nb.ph)) * ease(t / 1.2); // M-092: less haze = deeper colours
            nb.m.position.x = nb.x + Math.sin(t * 0.25 + nb.ph) * 3; nb.m.position.y = nb.y + Math.cos(t * 0.2 + nb.ph) * 2;
        }

        // capsule: flies in from far (0.5-2.3 s), settles at home, keeps turning
        var k = back((t - 0.5) / 1.8);
        cap.scale.setScalar(Math.max(0.001, k * 0.72));
        cap.position.set(home.x, home.y, -40 * (1 - ease((t - 0.5) / 1.8)));
        cap.rotation.set(0.25 + Math.sin(t * 0.8) * 0.1, t * 1.6 + (1 - ease((t - 0.5) / 1.8)) * 10, 0.6 - (1 - ease((t - 0.5) / 1.8)) * 3);
        capGlow.material.opacity = 0.18 * ease((t - 1.8) / 0.8);
        // halves open a little at the burst, then close
        var open = Math.max(0, Math.sin(Math.min(1, Math.max(0, (t - 2.9) / 0.9)) * Math.PI)) * 0.35;
        top.position.y = open; bot.position.y = -open;

        // helix appears around it
        var hk = back((t - 1.5) / 1.2);
        helix.scale.setScalar(Math.max(0.001, hk * 0.8));
        helix.position.copy(cap.position); helix.rotation.y = t * 1.1;

        // burst at 2.9 s
        var bt = t - 2.9;
        for (var ri = 0; ri < 3; ri++) {
            var rt = bt - ri * 0.22, rg = rings[ri];
            if (rt > 0 && rt < 1.6) { rg.position.copy(home); rg.lookAt(camera.position); rg.scale.setScalar(1 + rt * (4 + ri)); rg.material.opacity = 0.4 * (1 - rt / 1.6); }
            else rg.material.opacity = 0;
        }
        if (bt > 0 && bt < 1.8) {
            var bk = bt / 1.8;
            pMat.opacity = 1 - bk;
            for (var p = 0; p < NP; p++) { var v = pVel[p], po = p * 3, dr = bt * (1 - bk * 0.35); pPos[po] = home.x + v.x * dr; pPos[po + 1] = home.y + v.y * dr - bt * bt * 0.4; pPos[po + 2] = v.z * dr; }
            pGeo.attributes.position.needsUpdate = true;
        } else pMat.opacity = 0;
        // rays: appear with the burst, keep turning softly, change colour slowly
        rays.position.set(home.x, home.y, cap.position.z - 1.5);
        rays.rotation.z = t * 0.35;
        rays.material.opacity = bt > 0 ? Math.min(0.22, bt * 0.5) * (1 - ease((t - 7.4) / 0.8)) : 0;
        rays.material.color.setHSL((0.5 + t * 0.06) % 1, 1, 0.55);

        key.position.x = Math.sin(t) * 6; rim.position.y = Math.cos(t * 0.8) * 4;
        var fin = ease((t - 6.6) / 1.4); // M-057: finale: capsule and helix rush toward the viewer
        if (fin > 0) { cap.position.z += fin * 9; helix.position.z = cap.position.z; cap.rotation.y += fin * 4; helix.scale.multiplyScalar(1 + fin * 1.5); capGlow.material.opacity = 0.18 + fin * 0.25; }
        // M-078: end only after the whole show (finale ends 8.0 s, then the finished credit stays a moment);
        // on a slow phone this clock runs behind real time, so the CSS parts are surely finished too
        if (t >= 8.4) window.__spPrewarm = true; // M-089: main screen gets ready during the calm last second
        if (t >= 9.3 && !ended && !CAP) { ended = true; if (window.endSplash) window.endSplash(); }
        camera.position.set(Math.sin(t * 0.3) * 0.6, Math.cos(t * 0.25) * 0.3, 12 - ease(t / 6) * 1.2);
        camera.lookAt(0, home.y * 0.6, 0);
        if (composer) composer.render(); else renderer.render(scene, camera);
    }
    function cleanup() {
        alive = false;
        scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
        renderer.dispose(); try { renderer.forceContextLoss(); } catch (e) { }
    }
    window.addEventListener('resize', function () {
        W = innerWidth; H = innerHeight; renderer.setSize(W, H, false);
        camera.aspect = W / H; camera.updateProjectionMatrix(); home.y = stageY() + 0.5;
        if (composer) composer.setSize(W, H);
    });
    if (CAP) { t0 = 1; window.__spRender = function (tt) { T = tt; frame(0); }; }
    else requestAnimationFrame(frame);
    }

    // M-121: on the very first launch the language screen comes first; the opening starts after a language is chosen
    var first = false;
    try { first = !CAP && !localStorage.getItem('medtime_lang'); } catch (e) { }
    if (first) { window.__spBegin = begin; return; }
    begin();
    function begin() {
    if (CAP || /[?&]novideo/.test(location.search)) { start3d(); return; }

    // ---- M-093: the opening is a ready-made video (recorded from this same 3D show), so it plays smooth like a film
    // on every phone; the language line under the title stays live text. If the video cannot play, the live 3D show runs.
    var v = document.createElement('video');
    v.id = 'spv'; v.muted = true; v.defaultMuted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
    // M-177 (owner): the full film only the first time; afterwards only its last 5 seconds (M-361) (the calm logo ending)
    var seen = false; try { seen = !!localStorage.getItem('medtime_sp_seen'); } catch (e) { }
    v.src = seen ? 'splash.mp4#t=6.35' : 'splash.mp4'; // M-361: repeat opening 2 s longer (was 8.35)
    // M-360: the poster is the film's own first frame, shown at once (no dark wait before the film moves)
    var pst = seen ? 'splash_b.jpg' : 'splash_a.jpg';
    v.poster = pst; sp.style.background = '#000 url(' + pst + ') center / cover no-repeat';
    v.classList.add('on');
    sp.insertBefore(v, sp.firstChild);
    sp.classList.add('sp-video');
    window.__sp3d = true; // the video ends the opening itself
    var started = false, failed = false, endAt = 11.35; // M-096/M-097: the film plays (almost) to its end, incl. the calm logo ending
    function fail() {
        if (failed || started) return;
        failed = true; try { v.pause(); } catch (e) { }
        v.remove(); sp.classList.remove('sp-video'); sp.style.background = ''; window.__sp3d = false;
        start3d();
    }
    function go() { if (window.__spGo) window.__spGo(); else setTimeout(go, 16); }
    function placeTag() {
        // the language line sits where it was when the video was recorded (video fills the screen, edges may be cut)
        var tag = document.getElementById('sp-tag'), f = window.SPLASH_TAG_Y || 0.673;
        if (!tag || !v.videoWidth) return;
        var sc = Math.max(innerWidth / v.videoWidth, innerHeight / v.videoHeight), h = v.videoHeight * sc;
        tag.style.top = ((innerHeight - h) / 2 + f * h) + 'px';
    }
    v.addEventListener('error', fail);
    v.addEventListener('loadedmetadata', placeTag);
    window.addEventListener('resize', placeTag);
    v.addEventListener('playing', function () { if (started) return; started = true; try { localStorage.setItem('medtime_sp_seen', '1'); } catch (e) { } v.classList.add('on'); placeTag(); go(); });
    v.addEventListener('timeupdate', function () {
        if (v.currentTime >= 9.8) window.__spPrewarm = true; // main screen gets ready during the calm end
        if (v.currentTime >= endAt && window.endSplash) window.endSplash(); // fade starts while the video still moves
    });
    v.addEventListener('ended', function () { if (window.endSplash) window.endSplash(); });
    try { var pr = v.play(); if (pr && pr.catch) pr.catch(fail); } catch (e) { fail(); }
    setTimeout(function () { if (!started) fail(); }, 3000);
    }
})();
