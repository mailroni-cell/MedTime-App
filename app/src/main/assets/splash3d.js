// M-048: 3D opening (about 6.6 s): warp-speed stars, a glossy capsule flies in and spins,
// a glowing DNA double helix wraps it, a shock-wave and spark burst, then the title.
// Falls back to the CSS capsule when WebGL is missing.
(function () {
    'use strict';
    var sp = document.getElementById('splash');
    if (!sp || !window.THREE) return;
    var canvas = document.createElement('canvas');
    canvas.id = 'sp3d';
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { return; }
    sp.insertBefore(canvas, sp.firstChild);
    sp.classList.add('sp-3d');

    var W = innerWidth, H = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    renderer.setSize(W, H, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
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
    var sGeo = new THREE.BufferGeometry(); sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    var sMat = new THREE.LineBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    var streaks = new THREE.LineSegments(sGeo, sMat); scene.add(streaks);

    // ---- glossy capsule (two halves + shiny band) ----
    var cap = new THREE.Group();
    function half(color, up) {
        var pts = [], R = 0.62, L = 0.95;
        for (var k = 0; k <= 16; k++) { var t = k / 16 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(t) * R, L + Math.sin(t) * R)); }
        pts.unshift(new THREE.Vector2(R, 0)); pts.unshift(new THREE.Vector2(0.001, 0));
        pts.sort(function (p, q) { return p.y - q.y; });
        var g = new THREE.LatheGeometry(pts.filter(function (p, n) { return n === 0 || p.x > 0.0005 || n === pts.length - 1; }), 48);
        var m = new THREE.MeshPhysicalMaterial({ color: color, metalness: 0.1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.9 });
        var mesh = new THREE.Mesh(g, m); if (!up) mesh.rotation.z = Math.PI; return mesh;
    }
    var top = half(0xdc2626, true), bot = half(0x2563eb, false);
    cap.add(top); cap.add(bot);
    var band = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 12, 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 1, roughness: 0.15 }));
    band.rotation.x = Math.PI / 2; cap.add(band);
    var capGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0x60a5fa, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    capGlow.scale.set(6, 6, 1); cap.add(capGlow);
    cap.scale.setScalar(0.001);
    scene.add(cap);

    // ---- DNA double helix of glowing beads ----
    var helix = new THREE.Group(), beads = [], NB = 34;
    var beadG = new THREE.SphereGeometry(0.09, 12, 12);
    var mA = new THREE.MeshBasicMaterial({ color: 0x67e8f9 }), mB = new THREE.MeshBasicMaterial({ color: 0xe879f9 });
    var rungM = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
    for (var b = 0; b < NB; b++) {
        var y = (b / (NB - 1) - 0.5) * 4.2, ang = b * 0.55;
        [0, Math.PI].forEach(function (off, s) {
            var m = new THREE.Mesh(beadG, s ? mB : mA);
            m.position.set(Math.cos(ang + off) * 1.25, y, Math.sin(ang + off) * 1.25);
            var gs = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: s ? 0xe879f9 : 0x67e8f9, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }));
            gs.scale.set(0.38, 0.38, 1); m.add(gs);
            helix.add(m); beads.push({ m: m, d: b / NB });
        });
        if (b % 2 === 0) {
            var rung = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.5, 6), rungM);
            rung.position.y = y; rung.rotation.z = Math.PI / 2; rung.rotation.y = -ang; helix.add(rung);
        }
    }
    helix.rotation.z = 0.5; helix.scale.setScalar(0.001);
    scene.add(helix);

    // ---- shock-wave ring + spark burst ----
    var ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.05, 64), new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(ring);
    var NP = 260, pPos = new Float32Array(NP * 3), pVel = [];
    for (var q = 0; q < NP; q++) {
        var v = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(2 + Math.random() * 6);
        pVel.push(v);
    }
    var pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    var pMat = new THREE.PointsMaterial({ map: glow, size: 0.28, color: 0xfde68a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    var sparks = new THREE.Points(pGeo, pMat); scene.add(sparks);

    // ---- bloom when available ----
    var composer = null;
    try {
        if (THREE.EffectComposer && THREE.UnrealBloomPass) {
            composer = new THREE.EffectComposer(renderer);
            composer.addPass(new THREE.RenderPass(scene, camera));
            composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(W, H), 0.55, 0.4, 0.6));
        }
    } catch (e) { composer = null; }

    var ease = function (x) { x = Math.min(1, Math.max(0, x)); return 1 - Math.pow(1 - x, 3); };
    var back = function (x) { x = Math.min(1, Math.max(0, x)); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
    try { renderer.compile(scene, camera); } catch (e) { } // M-057: build shaders before the show starts
    var t0 = 0, last = 0, T = 0, alive = true, slow = 0;

    function frame(now) {
        if (!alive) return;
        if (!document.body.contains(sp)) { cleanup(); return; }
        requestAnimationFrame(frame);
        // M-057: start only once the page is ready (the go-signal exists), and run on our own clock so a slow frame never skips part of the show
        if (!t0) { if (!window.__spGo) return; t0 = now; last = now; window.__spGo(); }
        var dt = Math.min(0.1, (now - last) / 1000); last = now; T += dt;
        var t = T;
        if (dt > 0.045) slow++;
        if (slow > 25 && composer) composer = null; // weak phone: drop bloom

        // warp: fast at first, then slows and fades
        var warp = t < 1.6 ? 1 : Math.max(0, 1 - (t - 1.6) / 1.4);
        for (var i = 0; i < NS; i++) {
            var s = sData[i];
            s.z += s.v * dt * (0.15 + 0.85 * warp);
            if (s.z > 12) s.z -= 200;
            var len = 0.4 + 6 * warp;
            sPos.set([s.x, s.y, s.z, s.x, s.y, s.z - len], i * 6);
        }
        sGeo.attributes.position.needsUpdate = true;
        sMat.opacity = 0.25 + 0.65 * warp;

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
        if (bt > 0 && bt < 1.6) {
            ring.position.copy(home); ring.lookAt(camera.position);
            ring.scale.setScalar(1 + bt * 4); ring.material.opacity = 0.45 * (1 - bt / 1.6);
            pMat.opacity = 1 - bt / 1.6;
            for (var p = 0; p < NP; p++) { var v = pVel[p]; pPos.set([home.x + v.x * bt, home.y + v.y * bt, v.z * bt], p * 3); }
            pGeo.attributes.position.needsUpdate = true;
        } else { ring.material.opacity = 0; pMat.opacity = 0; }

        key.position.x = Math.sin(t) * 6; rim.position.y = Math.cos(t * 0.8) * 4;
        var fin = ease((t - 6.6) / 1.4); // M-057: finale: capsule and helix rush toward the viewer
        if (fin > 0) { cap.position.z += fin * 9; helix.position.z = cap.position.z; cap.rotation.y += fin * 4; helix.scale.multiplyScalar(1 + fin * 1.5); capGlow.material.opacity = 0.18 + fin * 0.6; }
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
    requestAnimationFrame(frame);
})();
