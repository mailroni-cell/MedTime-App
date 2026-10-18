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
    scene.fog = new THREE.FogExp2(0x120a2e, 0.03);

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
            uniforms: {
                uTime: { value: 0 }, uMode: { value: 0 }, uDens: { value: 1 }, uStars: { value: 1 },
                uDeep: { value: new THREE.Color(0x050212) }, uLow: { value: new THREE.Color(0x030814) }, uHigh: { value: new THREE.Color(0x140533) },
                uC1: { value: new THREE.Color(0x8c26d9) }, uC2: { value: new THREE.Color(0x0dbfd9) }, uC3: { value: new THREE.Color(0xf23f99) }
            },
            vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
            fragmentShader: [
                'uniform float uTime; uniform float uMode; uniform float uDens; uniform float uStars;',
                'uniform vec3 uDeep; uniform vec3 uLow; uniform vec3 uHigh; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;',
                'varying vec3 vP;',
                'float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }',
                'float n3(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);',
                '  return mix(mix(mix(h3(i), h3(i+vec3(1,0,0)), f.x), mix(h3(i+vec3(0,1,0)), h3(i+vec3(1,1,0)), f.x), f.y),',
                '             mix(mix(h3(i+vec3(0,0,1)), h3(i+vec3(1,0,1)), f.x), mix(h3(i+vec3(0,1,1)), h3(i+vec3(1,1,1)), f.x), f.y), f.z); }',
                'float fbm(vec3 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++){ v += a * n3(p); p *= 2.03; a *= 0.5; } return v; }',
                'void main(){',
                '  float h = vP.y * 0.5 + 0.5;',
                '  vec3 c = mix(uLow, uHigh, smoothstep(0.2, 1.0, h));',
                '  vec3 q = vP * 2.2 + vec3(uTime * 0.012, uTime * 0.008, 0.0);',
                '  float n1 = fbm(q);',
                '  float n2 = fbm(q * 1.7 + vec3(5.2, 1.3, uTime * 0.01));',
                '  if (uMode < 0.5) {',  // nebula
                '    vec3 neb = mix(uC1, uC2, smoothstep(0.35, 0.75, n2));',
                '    neb = mix(neb, uC3, smoothstep(0.62, 0.85, n1) * 0.7);',
                '    c += neb * smoothstep(0.38, 0.85, n1) * smoothstep(0.05, 0.6, h) * 0.75 * uDens;',
                '  } else if (uMode < 1.5) {',  // aurora curtains
                '    float w = vP.x * 3.0 + vP.z * 2.0 + n1 * 3.0 + uTime * 0.08;',
                '    float band = pow(abs(sin(w)), 6.0) + 0.6 * pow(abs(sin(w * 1.7 + 1.3)), 8.0);',
                '    float hb = smoothstep(0.45, 0.62, h) * (1.0 - smoothstep(0.75, 0.98, h));',
                '    float flick = 0.7 + 0.3 * n3(vec3(vP.x * 20.0, uTime * 0.5, vP.z * 20.0));',
                '    vec3 ac = mix(uC1, uC2, smoothstep(0.5, 0.85, h)); ac = mix(ac, uC3, smoothstep(0.8, 0.95, h) * 0.6);',
                '    c += ac * band * hb * flick * 0.55 * uDens;',
                '    c += uC1 * 0.06 * smoothstep(0.4, 0.55, h);',
                '  } else if (uMode < 2.5) {',  // sunset / moon
                '    float hz = exp(-abs(h - 0.47) * 9.0);',
                '    c = mix(c, uC1 * 0.8, hz * 0.7);',
                '    vec3 sd = normalize(vec3(0.0, 0.06, -1.0)); float sun = max(0.0, dot(vP, sd));',
                '    c += uC2 * (smoothstep(0.9985, 0.9995, sun) * 1.4 + pow(sun, 60.0) * 0.6);',
                '    float cl = smoothstep(0.5, 0.8, fbm(vec3(vP.x * 3.0 + uTime * 0.01, vP.y * 9.0, vP.z * 3.0)));',
                '    c = mix(c, uC3 * (0.4 + hz), cl * smoothstep(0.42, 0.6, h) * 0.6 * uDens);',
                '  } else if (uMode < 3.5) {',  // synthwave: striped sun + floor grid
                '    vec3 sd = normalize(vec3(0.0, 0.12, -1.0)); float sun = dot(vP, sd);',
                '    float disc = smoothstep(0.988, 0.9895, sun);',
                '    float stripes = step(0.0, sin((vP.y - 0.05) * 160.0 - uTime * 2.0)) + step(0.62, h) ;',
                '    c += mix(uC2, uC1, smoothstep(0.5, 0.6, h)) * disc * clamp(stripes, 0.0, 1.0) * 0.9;',
                '    c += uC1 * pow(max(0.0, sun), 30.0) * 0.25;',
                '    c += uC1 * exp(-abs(h - 0.49) * 40.0) * 0.4;',
                '    if (h < 0.49) { vec2 g = vP.xz / max(0.02, 0.5 - h) * 0.6; g.y += uTime * 0.6;',
                '      float gl = max(smoothstep(0.94, 1.0, abs(sin(g.x * 3.14))), smoothstep(0.94, 1.0, abs(sin(g.y * 3.14))));',
                '      c += uC3 * gl * smoothstep(0.1, 0.48, h) * 0.6 * uDens; }',
                '  } else if (uMode < 4.5) {',  // ocean: caustics + light rays
                '    vec3 wq = vec3(vP.x * 6.0, vP.y * 3.0, vP.z * 6.0) + vec3(0.0, uTime * 0.05, uTime * 0.07);',
                '    float ca = pow(1.0 - abs(fbm(wq) * 2.0 - 1.0), 6.0);',
                '    c += mix(uC1, uC2, n2) * ca * smoothstep(0.3, 1.0, h) * 0.3 * uDens;',
                '    float rays = pow(abs(sin(vP.x * 18.0 + sin(uTime * 0.2) * 2.0 + n1 * 4.0)), 18.0) * smoothstep(0.55, 1.0, h);',
                '    c += uC3 * rays * 0.18;',
                '  } else if (uMode < 5.5) {',  // galaxy band
                '    vec3 ax = normalize(vec3(0.35, 1.0, 0.25)); float d = abs(dot(vP, ax));',
                '    float bandd = exp(-d * d * 28.0); float dust = fbm(vP * 6.0 + uTime * 0.005);',
                '    vec3 gc = mix(uC2, uC1, exp(-d * d * 120.0)); gc = mix(gc, uC3, smoothstep(0.55, 0.8, n2) * 0.5);',
                '    c += gc * bandd * (0.3 + 0.7 * dust) * uDens * 0.6;',
                '    c -= vec3(0.08) * bandd * smoothstep(0.6, 0.75, dust);',
                '  } else {',  // soft dreamy clouds
                '    float cl = smoothstep(0.35, 0.8, fbm(q * 0.8));',
                '    vec3 cc = mix(uC1, uC2, smoothstep(0.3, 0.7, n2)); cc = mix(cc, uC3, smoothstep(0.6, 0.85, n1) * 0.6);',
                '    c = mix(c, cc * 0.5, cl * 0.6 * uDens * smoothstep(0.1, 0.5, h));',
                '  }',
                '  float stars = step(1.0 - 0.0035 * uStars, h3(floor(vP * 420.0)));',
                '  c += vec3(stars) * smoothstep(0.3, 0.9, h) * 0.9 * step(0.01, uStars);',
                '  c = mix(uDeep, c, smoothstep(0.0, 0.25, h));',
                '  gl_FragColor = vec4(max(c, vec3(0.0)), 1.0);',
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
    // M-017: vivid = saturated colour that glows from inside, so ACES tone mapping does not wash it out
    const vividMat = (color, glow) => glossy(color, {
        roughness: 0.22, clearcoatRoughness: 0.03, envMapIntensity: 0.3, emissive: color, emissiveIntensity: glow,
        toneMapped: false, fog: false
    });
    function capsule(c1, c2, scale, glow) {
        const g = new THREE.Group();
        const r = 0.5, len = 1.0;
        const m1 = glow ? vividMat(c1, glow) : glossy(c1, { emissive: c1, emissiveIntensity: 0.12 });
        const m2 = glow ? vividMat(c2, glow * 0.8) : glossy(c2, { emissive: c2, emissiveIntensity: 0.08 });
        const body1 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len / 2, 40, 1, true), m1);
        body1.position.y = len / 4;
        const cap1 = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), m1);
        cap1.position.y = len / 2;
        const body2 = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len / 2, 40, 1, true), m2);
        body2.position.y = -len / 4;
        const cap2 = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), m2);
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
    const hero = capsule(0xd4001f, 0x0066ee, 1.25, 0.12); // M-017: strong red + bright blue
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

    // ---- M-015: far bokeh lights (big soft colored circles) ----
    const bokehColors = [0x22d3ee, 0xa855f7, 0xf472b6, 0x38bdf8, 0x34d399, 0xfbbf24];
    const bokeh = [];
    for (let i = 0; i < 26; i++) {
        const m = new THREE.SpriteMaterial({ map: dot, color: bokehColors[i % bokehColors.length], transparent: true, opacity: rnd(0.12, 0.32), depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
        const sp = new THREE.Sprite(m);
        const sc = rnd(2.5, 7);
        sp.scale.set(sc, sc, 1);
        sp.position.set(rnd(-28, 28), rnd(-6, 18), rnd(-45, -20));
        sp.userData = { ph: Math.random() * 6.28, sp: rnd(0.1, 0.35), base: sp.position.clone(), op: m.opacity };
        scene.add(sp);
        bokeh.push(sp);
    }

    // ---- M-015: soft colored light beams from above ----
    const beamTex = (() => {
        const c = document.createElement('canvas');
        c.width = 64; c.height = 256;
        const g = c.getContext('2d');
        const gr = g.createLinearGradient(0, 0, 0, 256);
        gr.addColorStop(0, 'rgba(255,255,255,0.9)');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 256);
        const gx = g.createLinearGradient(0, 0, 64, 0);
        gx.addColorStop(0, 'rgba(0,0,0,1)'); gx.addColorStop(0.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(0,0,0,1)');
        g.globalCompositeOperation = 'destination-out';
        g.fillStyle = gx;
        g.fillRect(0, 0, 64, 256);
        return new THREE.CanvasTexture(c);
    })();
    const beams = [];
    [[0x22d3ee, -5], [0xc084fc, 1], [0xf472b6, 6]].forEach(([color, x], i) => {
        const beam = new THREE.Mesh(
            new THREE.PlaneGeometry(4.5, 26),
            new THREE.MeshBasicMaterial({ map: beamTex, color, transparent: true, opacity: 0.16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false })
        );
        beam.position.set(x, 6, -16 - i * 3);
        beam.rotation.z = (i - 1) * 0.35;
        beam.userData = { ph: i * 2.1, rz: beam.rotation.z };
        scene.add(beam);
        beams.push(beam);
    });

    // ---- M-015: a second, closer layer of bigger glowing particles = more depth ----
    const N2 = 70;
    const p2 = new Float32Array(N2 * 3);
    for (let i = 0; i < N2; i++) {
        p2[i * 3] = rnd(-9, 9); p2[i * 3 + 1] = rnd(-6, 9); p2[i * 3 + 2] = rnd(2, 8);
    }
    const g2 = new THREE.BufferGeometry();
    g2.setAttribute('position', new THREE.BufferAttribute(p2, 3));
    const nearParticles = new THREE.Points(g2, new THREE.PointsMaterial({
        size: 0.35, map: dot, color: 0xbae6fd, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending
    }));
    scene.add(nearParticles);

    // ---- M-028: themes ----
    const hemi = scene.children.find(o => o.isHemisphereLight);
    let motion = 'drift';
    const basePos = pos.slice();
    function applyTheme(th) {
        if (!th) return;
        const u = dome.material.uniforms, C = v => new THREE.Color(v);
        u.uMode.value = th.mode; u.uDens.value = th.dens; u.uStars.value = th.stars;
        u.uDeep.value.set(th.sky[0]); u.uLow.value.set(th.sky[1]); u.uHigh.value.set(th.sky[2]);
        u.uC1.value.set(th.neb[0]); u.uC2.value.set(th.neb[1]); u.uC3.value.set(th.neb[2]);
        scene.fog.color.set(th.fog);
        cyan.color.set(th.l[0]); magenta.color.set(th.l[1]);
        if (hemi) hemi.color.set(th.l[0]);
        const a = C(th.p[0]), b = C(th.p[1]), tc = new THREE.Color();
        for (let i = 0; i < N; i++) { tc.copy(a).lerp(b, Math.random()); col[i * 3] = tc.r; col[i * 3 + 1] = tc.g; col[i * 3 + 2] = tc.b; }
        pGeo.attributes.color.needsUpdate = true;
        nearParticles.material.color.set(th.p[0]);
        const bc = [th.neb[0], th.neb[1], th.neb[2], th.p[0], th.p[1], th.l[1]];
        bokeh.forEach((sp, i) => sp.material.color.set(bc[i % bc.length]));
        beams.forEach((bm, i) => bm.material.color.set([th.l[0], th.neb[0], th.l[1]][i % 3]));
        halo.material.color.set(th.ga); halo2.material.color.set(th.gb);
        let k = 0;
        hero.traverse(o => { if (o.isMesh && o.material.emissive && k < 4) { const c = k < 2 ? th.hero[0] : th.hero[1]; o.material.color.set(c); o.material.emissive.set(c); k++; } });
        ringBase = new THREE.Color(th.ga).getHSL({});
        if (bloom) bloom.strength = th.bloom;
        motion = th.motion;
        if (worlds) worlds.set(th.world || 'meds', th);
        // fewer medicines when the theme has its own world
        floaters.forEach((o, i) => { o.visible = !th.world || th.world === 'meds' || i % 2 === 0; });
        for (let i = 0; i < pos.length; i++) pos[i] = basePos[i];
        pGeo.attributes.position.needsUpdate = true;
        particles.rotation.set(0, 0, 0);
        particles.material.size = 0.18;
        particles.position.set(0, 0, 0);
    }
    let ringBase = { h: 0.53, s: 0.9, l: 0.6 };
    // M-030: animated world per theme
    const worlds = window.MedWorlds ? window.MedWorlds(THREE, { scene, dot }) : null;
    let flashLevel = 0;
    if (worlds) worlds.onFlash(v => { flashLevel = v; });

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
        setDim(on) { canvas.style.opacity = on ? '0.35' : '1'; },
        pause(on) { paused = !!on; if (!paused && running) { clock.getDelta(); requestAnimationFrame(loop); } }, // M-044: calm mode has its own 3D
        setTheme(i) { applyTheme((window.MED_THEMES || [])[i]); }
    };
    try { const ti = window.medEffectiveTheme ? window.medEffectiveTheme() : parseInt(localStorage.getItem('medtime_theme') || '0', 10) || 0; applyTheme((window.MED_THEMES || [])[ti]); } catch (e) { }

    if (document.documentElement.classList.contains('lowvision')) window.MedTime3D.setDim(true);

    // ---- loop with automatic quality control ----
    const clock = new THREE.Clock();
    let paused = false;
    let running = true, frames = 0, fpsTime = 0, lowQuality = false;
    document.addEventListener('visibilitychange', () => {
        running = !document.hidden;
        if (running && !paused) { clock.getDelta(); requestAnimationFrame(loop); }
    });

    function loop() {
        if (!running || paused) return;
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
        if (worlds) worlds.update(dt, t);
        renderer.toneMappingExposure = 0.95 + flashLevel * 1.6;

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
        ring.material.color.setHSL(ringBase.h + Math.sin(t * 0.2) * 0.06, 0.9, 0.6);

        bokeh.forEach(b => {
            const u = b.userData;
            b.position.x = u.base.x + Math.sin(t * u.sp + u.ph) * 2.5;
            b.position.y = u.base.y + Math.cos(t * u.sp * 0.8 + u.ph) * 1.5;
            b.material.opacity = u.op * (0.7 + 0.3 * Math.sin(t * 0.9 + u.ph));
        });
        beams.forEach(b => {
            b.rotation.z = b.userData.rz + Math.sin(t * 0.15 + b.userData.ph) * 0.12;
            b.material.opacity = 0.11 + 0.07 * Math.sin(t * 0.4 + b.userData.ph);
        });
        nearParticles.rotation.y = -t * 0.015;
        nearParticles.position.y = Math.sin(t * 0.3) * 0.6;
        // M-028: particle motion per theme
        if (motion === 'snow' || motion === 'rise') {
            const dir = motion === 'snow' ? -1 : 1, sp = motion === 'snow' ? 1.1 : 0.7;
            for (let i = 0; i < N; i++) {
                let y = pos[i * 3 + 1] + dir * sp * dt * (0.5 + (i % 7) / 7);
                if (y < -7) y = 12; if (y > 12) y = -7;
                pos[i * 3 + 1] = y;
                pos[i * 3] += Math.sin(t * 0.8 + i) * dt * 0.25;
            }
            pGeo.attributes.position.needsUpdate = true;
        } else if (motion === 'swirl') {
            particles.rotation.y = t * 0.12;
            particles.rotation.z = Math.sin(t * 0.1) * 0.2;
        } else if (motion === 'sparkle') {
            particles.material.size = 0.18 + Math.sin(t * 3) * 0.06;
            particles.rotation.y = t * 0.02;
        } else {
            particles.rotation.y = t * 0.02;
            particles.position.y = Math.sin(t * 0.2) * 0.5;
        }

        if (composer && !lowQuality) composer.render();
        else renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
})();
