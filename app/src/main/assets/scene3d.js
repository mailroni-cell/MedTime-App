/* M-013: full-screen 3D world behind the whole app (Three.js, works offline).
 * Glossy floating medicines with real reflections, soft shadows, moving colored lights,
 * glowing particles, bloom, depth fog and parallax (phone tilt / touch / scroll). */
(function () {
    'use strict';
    if (!window.THREE) return;

    const canvas = document.getElementById('bg3d');
    if (!canvas) return;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch (e) {
        canvas.style.display = 'none';
        return;
    }

    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a1c, 0.035);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0.6, 12);

    // ---- reflections: studio environment map ----
    const pmrem = new THREE.PMREMGenerator(renderer);
    if (THREE.RoomEnvironment) {
        scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    }

    // ---- background: deep gradient dome ----
    const dome = new THREE.Mesh(
        new THREE.SphereGeometry(80, 48, 24),
        new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            fog: false,
            uniforms: { uTime: { value: 0 } },
            vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
            fragmentShader: [
                'uniform float uTime; varying vec3 vP;',
                'void main(){',
                '  float h = vP.y * 0.5 + 0.5;',
                '  vec3 top = vec3(0.10, 0.06, 0.28);',
                '  vec3 mid = vec3(0.02, 0.10, 0.22);',
                '  vec3 bot = vec3(0.01, 0.02, 0.06);',
                '  vec3 c = mix(bot, mid, smoothstep(0.0, 0.5, h));',
                '  c = mix(c, top, smoothstep(0.5, 1.0, h));',
                '  float aur = sin(vP.x * 6.0 + uTime * 0.25) * sin(vP.z * 5.0 - uTime * 0.18);',
                '  c += vec3(0.0, 0.25, 0.35) * smoothstep(0.55, 1.0, aur) * smoothstep(0.35, 0.8, h) * 0.35;',
                '  gl_FragColor = vec4(c, 1.0);',
                '}'
            ].join('\n')
        })
    );
    scene.add(dome);

    // ---- lights ----
    scene.add(new THREE.HemisphereLight(0x9ad7ff, 0x1a1033, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 9, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -10;
    key.shadow.camera.right = 10;
    key.shadow.camera.top = 10;
    key.shadow.camera.bottom = -10;
    key.shadow.radius = 6;
    key.shadow.bias = -0.0005;
    scene.add(key);

    const cyan = new THREE.PointLight(0x22d3ee, 2.2, 30, 2);
    const magenta = new THREE.PointLight(0xe879f9, 1.8, 30, 2);
    scene.add(cyan, magenta);

    // ---- glossy floor far below, catches shadows and reflections ----
    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(40, 64),
        new THREE.MeshStandardMaterial({ color: 0x050816, roughness: 0.55, metalness: 0.3, envMapIntensity: 0.25 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -6.5;
    floor.receiveShadow = true;
    scene.add(floor);

    // glowing ring on the floor
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(5.5, 0.05, 16, 160),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -6.45;
    scene.add(ring);

    // ---- materials ----
    const glossy = (color, extra) => new THREE.MeshPhysicalMaterial(Object.assign({
        color, roughness: 0.28, metalness: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.06, envMapIntensity: 0.45
    }, extra || {}));
    const PALETTE = [
        [0xef4444, 0xf8fafc], [0x38bdf8, 0xf8fafc], [0xa855f7, 0xfde68a],
        [0x10b981, 0xf8fafc], [0xf59e0b, 0x1e293b], [0xec4899, 0xe0f2fe]
    ];

    // ---- shapes ----
    function capsule(c1, c2, scale) {
        const g = new THREE.Group();
        const r = 0.5, len = 1.0;
        const body1 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len / 2, 40, 1, true), glossy(c1));
        body1.position.y = len / 4;
        const cap1 = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), glossy(c1));
        cap1.position.y = len / 2;
        const body2 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len / 2, 40, 1, true), glossy(c2));
        body2.position.y = -len / 4;
        const cap2 = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glossy(c2));
        cap2.position.y = -len / 2;
        const band = new THREE.Mesh(new THREE.TorusGeometry(r * 1.005, 0.025, 8, 40), glossy(0xffffff, { metalness: 0.8, roughness: 0.2 }));
        band.rotation.x = Math.PI / 2;
        g.add(body1, cap1, body2, cap2, band);
        g.scale.setScalar(scale);
        return g;
    }

    function tablet(color, scale) {
        // round tablet with soft bevel and score line
        const pts = [];
        const R = 0.7, H = 0.14, B = 0.1;
        pts.push(new THREE.Vector2(0, -H - B));
        for (let i = 0; i <= 8; i++) {
            const a = -Math.PI / 2 + (i / 8) * Math.PI;
            pts.push(new THREE.Vector2(R - B + Math.cos(a) * B, Math.sin(a) * (H + B) * 0.9));
        }
        pts.push(new THREE.Vector2(0, H + B));
        const g = new THREE.Group();
        const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), glossy(color, { roughness: 0.35, clearcoat: 0.6 }));
        const score = new THREE.Mesh(new THREE.BoxGeometry(R * 1.6, 0.03, 0.05), glossy(0x94a3b8, { roughness: 0.6 }));
        score.position.y = H + B - 0.01;
        g.add(m, score);
        g.scale.setScalar(scale);
        return g;
    }

    function vial(color, scale) {
        const g = new THREE.Group();
        const glass = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.35, 1.1, 40),
            new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transmission: 0.95, transparent: true, opacity: 0.55, clearcoat: 1, envMapIntensity: 1.5 })
        );
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.65, 32), glossy(color, { emissive: color, emissiveIntensity: 0.35 }));
        liquid.position.y = -0.2;
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 32), glossy(0xcbd5e1, { metalness: 0.9, roughness: 0.25 }));
        cap.position.y = 0.66;
        g.add(glass, liquid, cap);
        g.scale.setScalar(scale);
        return g;
    }

    function syringe(scale) {
        const g = new THREE.Group();
        const barrel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.22, 0.22, 1.6, 32),
            new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, roughness: 0.08, transmission: 0.9, transparent: true, opacity: 0.6, clearcoat: 1 })
        );
        const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.9, 24), glossy(0x22d3ee, { emissive: 0x0891b2, emissiveIntensity: 0.6 }));
        fluid.position.y = -0.3;
        const plunger = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 12), glossy(0xf1f5f9));
        plunger.position.y = 1.15;
        const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32), glossy(0xf1f5f9));
        thumb.position.y = 1.6;
        const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.9, 8), glossy(0xe2e8f0, { metalness: 1, roughness: 0.15 }));
        needle.position.y = -1.25;
        g.add(barrel, fluid, plunger, thumb, needle);
        g.scale.setScalar(scale);
        return g;
    }

    // ---- floating objects ----
    const floaters = [];
    function addFloater(obj, x, y, z) {
        obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        obj.position.set(x, y, z);
        obj.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
        obj.userData = {
            base: new THREE.Vector3(x, y, z),
            spin: new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.4),
            phase: Math.random() * Math.PI * 2,
            amp: 0.25 + Math.random() * 0.45
        };
        scene.add(obj);
        floaters.push(obj);
    }

    const rnd = (a, b) => a + Math.random() * (b - a);
    for (let i = 0; i < 9; i++) {
        const p = PALETTE[i % PALETTE.length];
        addFloater(capsule(p[0], p[1], rnd(0.6, 1.1)), rnd(-7, 7), rnd(-5, 6), rnd(-14, -2));
    }
    for (let i = 0; i < 6; i++) addFloater(tablet([0xf8fafc, 0xfde68a, 0xbae6fd, 0xfbcfe8][i % 4], rnd(0.6, 1.0)), rnd(-7, 7), rnd(-5, 6), rnd(-14, -3));
    for (let i = 0; i < 3; i++) addFloater(vial([0x22d3ee, 0xa855f7, 0x10b981][i], rnd(0.8, 1.1)), rnd(-6, 6), rnd(-4, 5), rnd(-12, -4));
    addFloater(syringe(0.9), rnd(-5, -2), rnd(1, 4), -6);
    addFloater(syringe(0.8), rnd(2, 5), rnd(-3, 0), -8);

    // ---- hero capsule at the top of the screen ----
    const hero = capsule(0xef4444, 0xf8fafc, 1.25);
    hero.traverse(o => { if (o.isMesh) o.castShadow = true; });
    scene.add(hero);
    const halo = new THREE.Mesh(
        new THREE.TorusGeometry(1.5, 0.03, 12, 120),
        new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.9 })
    );
    scene.add(halo);
    const halo2 = halo.clone();
    halo2.material = halo.material.clone();
    halo2.material.color.set(0xf0abfc);
    halo2.scale.setScalar(1.2);
    scene.add(halo2);

    // ---- glowing particles ----
    const N = 600;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const cA = new THREE.Color(0x67e8f9), cB = new THREE.Color(0xf0abfc), tmp = new THREE.Color();
    for (let i = 0; i < N; i++) {
        pos[i * 3] = rnd(-18, 18);
        pos[i * 3 + 1] = rnd(-7, 12);
        pos[i * 3 + 2] = rnd(-25, 4);
        tmp.copy(cA).lerp(cB, Math.random());
        col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const dot = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(255,255,255,1)');
        gr.addColorStop(0.3, 'rgba(255,255,255,0.6)');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    })();
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.18, map: dot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    scene.add(particles);

    // ---- bloom ----
    let composer = null, bloom = null;
    if (THREE.EffectComposer && THREE.UnrealBloomPass) {
        composer = new THREE.EffectComposer(renderer);
        composer.addPass(new THREE.RenderPass(scene, camera));
        bloom = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.45, 0.5, 0.93);
        composer.addPass(bloom);
    }

    // ---- layout: keep the hero near the top whatever the screen shape ----
    function placeHero() {
        const dist = camera.position.z;
        const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
        const y = halfH * 0.68;
        hero.userData.y = y;
        halo.position.set(0, y, 0);
        halo2.position.set(0, y, 0);
    }

    function resize() {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.fov = w < h ? 58 : 46;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        if (composer) composer.setSize(w, h);
        placeHero();
    }
    window.addEventListener('resize', resize);
    resize();

    // ---- parallax: tilt, touch, scroll ----
    const target = { x: 0, y: 0 };
    let scrollDepth = 0;
    window.addEventListener('deviceorientation', e => {
        if (e.gamma == null) return;
        target.x = Math.max(-1, Math.min(1, e.gamma / 30));
        target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    });
    window.addEventListener('pointermove', e => {
        target.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
    window.addEventListener('scroll', () => {
        scrollDepth = Math.min(1, window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight));
    }, { passive: true });

    // ---- celebration when a reminder is added ----
    let burst = 0;
    window.MedTime3D = {
        pulse() { burst = 1; },
        setDim(on) { canvas.style.opacity = on ? '0.35' : '1'; }
    };

    if (document.documentElement.classList.contains('lowvision')) window.MedTime3D.setDim(true);

    // ---- loop with automatic quality control ----
    const clock = new THREE.Clock();
    let running = true, frames = 0, fpsTime = 0, lowQuality = false;
    document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running) { clock.getDelta(); requestAnimationFrame(loop); }
    });

    function loop() {
        if (!running) return;
        requestAnimationFrame(loop);
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        // quality: if the phone struggles, drop bloom and resolution once
        frames++; fpsTime += dt;
        if (fpsTime > 3) {
            const fps = frames / fpsTime;
            if (fps < 32 && !lowQuality) {
                lowQuality = true;
                dpr = 1;
                renderer.setPixelRatio(dpr);
                renderer.shadowMap.enabled = false;
                resize();
            }
            frames = 0; fpsTime = 0;
        }

        dome.material.uniforms.uTime.value = t;

        // camera parallax + depth with scroll
        camera.position.x += (target.x * 1.2 - camera.position.x) * 0.04;
        camera.position.y += (0.6 - target.y * 0.8 - scrollDepth * 1.5 - camera.position.y) * 0.04;
        camera.position.z += (12 - scrollDepth * 2.5 - camera.position.z) * 0.04;
        camera.lookAt(0, -scrollDepth * 1.5, -4);

        // moving colored lights = moving highlights on every glossy surface
        cyan.position.set(Math.cos(t * 0.5) * 7, 3 + Math.sin(t * 0.7) * 2, Math.sin(t * 0.5) * 5 - 3);
        magenta.position.set(Math.cos(t * 0.37 + 2) * 7, -1 + Math.sin(t * 0.5) * 2, Math.sin(t * 0.37 + 2) * 5 - 4);

        floaters.forEach(o => {
            const u = o.userData;
            o.rotation.x += u.spin.x * dt;
            o.rotation.y += u.spin.y * dt;
            o.rotation.z += u.spin.z * dt;
            o.position.y = u.base.y + Math.sin(t * 0.6 + u.phase) * u.amp;
            o.position.x = u.base.x + Math.cos(t * 0.3 + u.phase) * u.amp * 0.5;
        });

        // hero: slow spin, faster during a celebration burst
        burst = Math.max(0, burst - dt * 0.8);
        hero.rotation.z = Math.PI / 5 + Math.sin(t * 0.8) * 0.15;
        hero.rotation.y += dt * (0.9 + burst * 12);
        hero.position.set(0, (hero.userData.y || 3) + Math.sin(t * 1.2) * 0.15, 0);
        const hs = 1.25 * (1 + burst * 0.35);
        hero.scale.setScalar(hs);
        halo.rotation.set(Math.PI / 2 + Math.sin(t) * 0.3, t * 0.6, 0);
        halo2.rotation.set(Math.PI / 2.4 + Math.cos(t * 0.8) * 0.3, -t * 0.4, 0);
        halo.material.opacity = 0.6 + Math.sin(t * 2) * 0.3;
        ring.material.color.setHSL(0.53 + Math.sin(t * 0.2) * 0.08, 0.9, 0.6);

        particles.rotation.y = t * 0.02;
        particles.position.y = Math.sin(t * 0.2) * 0.5;

        if (composer && !lowQuality) composer.render();
        else renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
})();
