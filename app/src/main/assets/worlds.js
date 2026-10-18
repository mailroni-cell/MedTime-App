/* M-030: animated "worlds" for the display themes: each theme gets its own moving objects
 * (planets, fish, jellyfish, snowflakes, fireflies, leaves, petals, lanterns, hearts, gems,
 * lightning, neon shapes, lava orbs, clouds, shooting stars). Used by scene3d.js. */
window.MedWorlds = function (THREE, ctx) {
    'use strict';
    const { scene, dot } = ctx;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = a => a[Math.floor(Math.random() * a.length)];

    function canvasTex(w, h, draw) {
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        draw(c.getContext('2d'), w, h);
        const t = new THREE.CanvasTexture(c); return t;
    }
    const flakeTex = canvasTex(128, 128, (g) => {
        g.strokeStyle = '#fff'; g.lineWidth = 6; g.lineCap = 'round'; g.translate(64, 64);
        g.shadowColor = '#bae6fd'; g.shadowBlur = 10;
        for (let i = 0; i < 6; i++) {
            g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -54);
            g.moveTo(0, -30); g.lineTo(-14, -44); g.moveTo(0, -30); g.lineTo(14, -44);
            g.moveTo(0, -16); g.lineTo(-10, -26); g.moveTo(0, -16); g.lineTo(10, -26); g.stroke();
        }
    });
    const leafTex = canvasTex(128, 128, (g) => {
        g.translate(64, 64); g.rotate(-0.6);
        const gr = g.createLinearGradient(-50, 0, 50, 0); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#ddd');
        g.fillStyle = gr; g.beginPath(); g.moveTo(0, -56); g.quadraticCurveTo(44, -10, 0, 56); g.quadraticCurveTo(-44, -10, 0, -56); g.fill();
        g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -50); g.lineTo(0, 54); g.stroke();
    });
    const petalTex = canvasTex(128, 128, (g) => {
        g.translate(64, 64);
        const gr = g.createRadialGradient(0, 20, 4, 0, 0, 60); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#fbcfe8');
        g.fillStyle = gr; g.beginPath(); g.moveTo(0, 54); g.bezierCurveTo(50, 20, 40, -40, 8, -50); g.lineTo(0, -38); g.lineTo(-8, -50);
        g.bezierCurveTo(-40, -40, -50, 20, 0, 54); g.fill();
    });
    function bandTex(c1, c2) {
        return canvasTex(256, 128, (g, w, h) => {
            for (let y = 0; y < h; y++) {
                const k = 0.5 + 0.5 * Math.sin(y * 0.25 + Math.sin(y * 0.07) * 3);
                g.fillStyle = k > 0.5 ? c1 : c2; g.globalAlpha = 0.6 + 0.4 * k; g.fillRect(0, y, w, 1);
            }
        });
    }

    let group = null, updaters = [], flash = null;

    // ---------- shared: shooting stars ----------
    function shootingStars(n, color) {
        const stars = [];
        for (let i = 0; i < n; i++) {
            const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(-3, 1.2, 0)]);
            const ln = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: color || 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, fog: false }));
            const head = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: color || 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, fog: false }));
            head.scale.set(0.6, 0.6, 1);
            const o = new THREE.Group(); o.add(ln, head); group.add(o);
            stars.push({ o, ln, head, life: -rnd(0, 6), v: new THREE.Vector3() });
        }
        updaters.push((dt) => stars.forEach(s => {
            s.life += dt;
            if (s.life > 1.4) { s.life = -rnd(2, 7); }
            if (s.life >= 0 && s.life <= 1.4) {
                if (s.life < dt * 1.5) { s.o.position.set(rnd(-4, 14), rnd(5, 13), rnd(-30, -15)); s.v.set(-rnd(10, 16), -rnd(3, 6), 0); }
                s.o.position.addScaledVector(s.v, dt);
                const a = Math.sin(Math.PI * s.life / 1.4);
                s.ln.material.opacity = a * 0.8; s.head.material.opacity = a;
            } else { s.ln.material.opacity = 0; s.head.material.opacity = 0; }
        }));
    }
    function falling(tex, n, colors, opt) {
        opt = opt || {};
        const items = [];
        for (let i = 0; i < n; i++) {
            const m = new THREE.MeshBasicMaterial({ map: tex, color: pick(colors), transparent: true, side: THREE.DoubleSide, depthWrite: false, opacity: opt.opacity || 0.9 });
            const s = rnd(opt.min || 0.25, opt.max || 0.55);
            const p = new THREE.Mesh(new THREE.PlaneGeometry(s, s), m);
            p.position.set(rnd(-10, 10), rnd(-6, 12), rnd(-12, 5));
            p.userData = { vy: rnd(0.4, 1.0) * (opt.speed || 1), sw: rnd(0.5, 1.5), ph: rnd(0, 6), spin: new THREE.Vector3(rnd(-2, 2), rnd(-2, 2), rnd(-1, 1)) };
            group.add(p); items.push(p);
        }
        updaters.push((dt, t) => items.forEach(p => {
            const u = p.userData;
            p.position.y -= u.vy * dt; p.position.x += Math.sin(t * u.sw + u.ph) * dt * 0.6;
            p.rotation.x += u.spin.x * dt; p.rotation.y += u.spin.y * dt; p.rotation.z += u.spin.z * dt;
            if (p.position.y < -7) { p.position.y = 12; p.position.x = rnd(-10, 10); }
        }));
    }
    function glossy(color, extra) {
        return new THREE.MeshPhysicalMaterial(Object.assign({ color, roughness: 0.25, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.6 }, extra || {}));
    }

    const W = {
        planets(th) {
            const cols = [th.neb[0], th.neb[1], th.neb[2], th.p[0], th.l[1]];
            for (let i = 0; i < 5; i++) {
                const r = rnd(0.5, 1.4);
                const m = new THREE.MeshStandardMaterial({ map: bandTex(cols[i], cols[(i + 2) % 5]), roughness: 0.7, emissive: new THREE.Color(cols[i]), emissiveIntensity: 0.15 });
                const pl = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 24), m);
                const holder = new THREE.Group(); holder.add(pl);
                if (i % 2 === 0) {
                    const ring = new THREE.Mesh(new THREE.RingGeometry(r * 1.4, r * 2.1, 64), new THREE.MeshBasicMaterial({ color: cols[(i + 1) % 5], side: THREE.DoubleSide, transparent: true, opacity: 0.55 }));
                    ring.rotation.x = Math.PI / 2.3; holder.add(ring);
                }
                const orbitR = rnd(6, 12), sp = rnd(0.03, 0.08) * (i % 2 ? 1 : -1), ph = rnd(0, 6.28), y = rnd(-3, 7);
                holder.userData = { orbitR, sp, ph, y };
                group.add(holder);
                updaters.push((dt, t) => {
                    const a = ph + t * sp;
                    holder.position.set(Math.cos(a) * orbitR, y + Math.sin(t * 0.2 + ph) * 0.5, -14 + Math.sin(a) * orbitR * 0.5);
                    pl.rotation.y += dt * 0.3;
                });
            }
            shootingStars(4);
        },
        ocean(th) {
            for (let i = 0; i < 12; i++) {
                const c = pick([th.neb[0], th.neb[1], th.neb[2], th.hero[0], th.hero[1]]);
                const f = new THREE.Group();
                const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 16), glossy(c, { emissive: new THREE.Color(c), emissiveIntensity: 0.2 }));
                body.scale.set(1.6, 0.8, 0.5);
                const tail = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 4), glossy(c));
                tail.rotation.z = Math.PI / 2; tail.position.x = -0.7; tail.scale.set(1, 1, 0.3);
                const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
                eye.position.set(0.35, 0.08, 0.15);
                f.add(body, tail, eye);
                const dir = Math.random() < 0.5 ? 1 : -1, sp = rnd(0.8, 1.8), y = rnd(-5, 8), z = rnd(-12, -2), s = rnd(0.6, 1.3);
                f.scale.set(s * dir, s, s); f.position.set(rnd(-12, 12), y, z);
                group.add(f);
                updaters.push((dt, t) => {
                    f.position.x += dir * sp * dt; f.position.y = y + Math.sin(t * 0.8 + z) * 0.4;
                    tail.rotation.y = Math.sin(t * 8 + z) * 0.5;
                    if (f.position.x > 14) f.position.x = -14; if (f.position.x < -14) f.position.x = 14;
                });
            }
            for (let i = 0; i < 5; i++) {
                const c = pick([th.p[0], th.p[1], th.ga]);
                const j = new THREE.Group();
                const bell = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
                    new THREE.MeshPhysicalMaterial({ color: c, emissive: new THREE.Color(c), emissiveIntensity: 0.5, transparent: true, opacity: 0.55, roughness: 0.2, side: THREE.DoubleSide }));
                j.add(bell);
                for (let k = 0; k < 6; k++) {
                    const pts = []; for (let q = 0; q < 8; q++) pts.push(new THREE.Vector3(Math.cos(k) * 0.35, -q * 0.22, Math.sin(k) * 0.35));
                    const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.6 }));
                    j.add(ln);
                }
                const x = rnd(-8, 8), z = rnd(-14, -4), y0 = rnd(-6, 6);
                j.position.set(x, y0, z); group.add(j);
                updaters.push((dt, t) => {
                    const p = 1 + Math.sin(t * 2 + x) * 0.12; bell.scale.set(p, 2 - p, p);
                    j.position.y += dt * (0.25 + 0.2 * Math.max(0, Math.sin(t * 2 + x)));
                    if (j.position.y > 12) j.position.y = -8;
                });
            }
        },
        snow(th) {
            falling(flakeTex, 70, ['#ffffff', '#e0f2fe', th.p[0]], { min: 0.3, max: 0.8, speed: 0.8 });
            for (let i = 0; i < 7; i++) {
                const g = new THREE.Mesh(new THREE.OctahedronGeometry(rnd(0.4, 0.9)), new THREE.MeshPhysicalMaterial({ color: 0xe0f2fe, roughness: 0.05, metalness: 0.1, transmission: 0.8, transparent: true, opacity: 0.8, clearcoat: 1, envMapIntensity: 1.6 }));
                g.scale.y = 1.6; g.position.set(rnd(-8, 8), rnd(-4, 8), rnd(-12, -3)); group.add(g);
                const sp = rnd(0.3, 0.8); updaters.push((dt, t) => { g.rotation.y += sp * dt; g.position.y += Math.sin(t + sp * 10) * dt * 0.2; });
            }
        },
        forest(th) {
            falling(leafTex, 35, ['#84cc16', '#eab308', '#f97316', '#22c55e'], { min: 0.35, max: 0.7, speed: 0.6 });
            fireflies(60, th.p[1] || '#d9f99d');
        },
        sakura(th) {
            falling(petalTex, 80, ['#fbcfe8', '#f9a8d4', '#ffffff'], { min: 0.2, max: 0.45, speed: 0.55 });
            for (let i = 0; i < 7; i++) {
                const l = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 0.6, 16), new THREE.MeshStandardMaterial({ color: 0xffa94d, emissive: new THREE.Color(0xff7b00), emissiveIntensity: 1.2 }));
                const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: 0xffb703, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false }));
                glow.scale.set(2.2, 2.2, 1); l.add(glow);
                l.position.set(rnd(-9, 9), rnd(-7, 10), rnd(-14, -4)); group.add(l);
                const sp = rnd(0.2, 0.45), ph = rnd(0, 6);
                updaters.push((dt, t) => { l.position.y += sp * dt; l.position.x += Math.sin(t * 0.4 + ph) * dt * 0.2; glow.material.opacity = 0.45 + 0.2 * Math.sin(t * 3 + ph); if (l.position.y > 13) l.position.y = -8; });
            }
        },
        hearts(th) {
            const sh = new THREE.Shape();
            sh.moveTo(0, 0.25); sh.bezierCurveTo(0, 0.5, -0.5, 0.55, -0.5, 0.2); sh.bezierCurveTo(-0.5, -0.1, -0.2, -0.3, 0, -0.5);
            sh.bezierCurveTo(0.2, -0.3, 0.5, -0.1, 0.5, 0.2); sh.bezierCurveTo(0.5, 0.55, 0, 0.5, 0, 0.25);
            const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.25, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 4, curveSegments: 24 });
            geo.center();
            for (let i = 0; i < 14; i++) {
                const c = pick([th.hero[0], th.hero[1], th.neb[0], '#ff1744']);
                const h = new THREE.Mesh(geo, glossy(c, { emissive: new THREE.Color(c), emissiveIntensity: 0.25 }));
                const s = rnd(0.8, 1.8); h.scale.setScalar(s); h.position.set(rnd(-9, 9), rnd(-6, 9), rnd(-14, -2)); group.add(h);
                const ph = rnd(0, 6), sp = rnd(0.3, 0.7);
                updaters.push((dt, t) => { h.rotation.y = Math.sin(t * sp + ph) * 0.8; const b = 1 + 0.08 * Math.max(0, Math.sin(t * 4 + ph)) ** 8; h.scale.setScalar(s * b); h.position.y += Math.sin(t * 0.5 + ph) * dt * 0.3; });
            }
            fireflies(40, th.p[0]);
        },
        crystals(th) {
            const geos = [new THREE.IcosahedronGeometry(0.7, 0), new THREE.OctahedronGeometry(0.8, 0), new THREE.DodecahedronGeometry(0.65, 0)];
            for (let i = 0; i < 14; i++) {
                const c = pick([th.neb[0], th.neb[1], th.neb[2], th.ga]);
                const g = new THREE.Mesh(pick(geos), new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.3, roughness: 0.05, clearcoat: 1, flatShading: true, emissive: new THREE.Color(c), emissiveIntensity: 0.25, envMapIntensity: 1.4 }));
                const s = rnd(0.6, 1.5); g.scale.setScalar(s); g.position.set(rnd(-9, 9), rnd(-5, 9), rnd(-14, -2)); group.add(g);
                const sp = new THREE.Vector3(rnd(-0.6, 0.6), rnd(-0.8, 0.8), 0), ph = rnd(0, 6);
                updaters.push((dt, t) => { g.rotation.x += sp.x * dt; g.rotation.y += sp.y * dt; g.position.y += Math.sin(t * 0.6 + ph) * dt * 0.3; });
            }
            fireflies(50, th.p[1]);
        },
        storm(th) {
            const N = 400, pos = new Float32Array(N * 6);
            for (let i = 0; i < N; i++) { const x = rnd(-14, 14), y = rnd(-7, 14), z = rnd(-16, 6); pos.set([x, y, z, x - 0.05, y - 0.6, z], i * 6); }
            const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const rain = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.45 }));
            group.add(rain);
            const boltMat = new THREE.LineBasicMaterial({ color: 0xe0e7ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, fog: false });
            let bolt = null, next = rnd(2, 5), life = 0;
            const light = new THREE.PointLight(0xc7d2fe, 0, 80, 1.5); light.position.set(0, 12, -10); group.add(light);
            updaters.push((dt) => {
                const a = geo.attributes.position.array;
                for (let i = 0; i < N; i++) { let y = a[i * 6 + 1] - 22 * dt; if (y < -7) y += 21; a[i * 6 + 1] = y; a[i * 6 + 4] = y - 0.6; }
                geo.attributes.position.needsUpdate = true;
                next -= dt;
                if (next <= 0) {
                    next = rnd(3, 7); life = 0.35;
                    if (bolt) group.remove(bolt);
                    const pts = []; let x = rnd(-8, 8), y = 14;
                    while (y > -2) { pts.push(new THREE.Vector3(x, y, -18)); x += rnd(-1.4, 1.4); y -= rnd(0.8, 1.8); }
                    bolt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), boltMat); group.add(bolt);
                    light.position.x = x;
                }
                if (life > 0) {
                    life -= dt; const f = life > 0.25 ? 1 : (life > 0.15 ? 0.3 : (life > 0.08 ? 1 : 0.4));
                    boltMat.opacity = f * (life > 0 ? 1 : 0); light.intensity = f * 6; if (flash) flash(f * 0.5);
                } else { boltMat.opacity = 0; light.intensity = 0; if (flash) flash(0); }
            });
        },
        synth(th) {
            const geos = [new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.OctahedronGeometry(1), new THREE.TorusGeometry(0.8, 0.25, 8, 16), new THREE.ConeGeometry(0.9, 1.4, 4)];
            for (let i = 0; i < 12; i++) {
                const c = pick([th.neb[0], th.neb[2], th.ga, th.gb]);
                const e = new THREE.LineSegments(new THREE.EdgesGeometry(pick(geos)), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.95 }));
                const s = rnd(0.7, 1.6); e.scale.setScalar(s); e.position.set(rnd(-10, 10), rnd(-4, 9), rnd(-16, -3)); group.add(e);
                const sp = new THREE.Vector3(rnd(-0.8, 0.8), rnd(-0.8, 0.8), rnd(-0.3, 0.3)), ph = rnd(0, 6);
                updaters.push((dt, t) => { e.rotation.x += sp.x * dt; e.rotation.y += sp.y * dt; e.rotation.z += sp.z * dt; e.material.opacity = 0.6 + 0.4 * Math.sin(t * 2 + ph); });
            }
            shootingStars(3, th.ga);
        },
        fire(th) {
            for (let i = 0; i < 9; i++) {
                const c = pick(['#ff5400', '#ffbd00', '#ff006e', th.neb[0]]);
                const o = new THREE.Mesh(new THREE.SphereGeometry(rnd(0.3, 0.8), 32, 16), new THREE.MeshStandardMaterial({ color: c, emissive: new THREE.Color(c), emissiveIntensity: 1.4, roughness: 0.4 }));
                const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: c, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
                glow.scale.set(3, 3, 1); o.add(glow);
                o.position.set(rnd(-9, 9), rnd(-7, 9), rnd(-14, -3)); group.add(o);
                const sp = rnd(0.3, 0.7), ph = rnd(0, 6);
                updaters.push((dt, t) => { o.position.y += sp * dt; const s = 1 + 0.15 * Math.sin(t * 5 + ph); o.scale.setScalar(s); glow.material.opacity = 0.4 + 0.25 * Math.sin(t * 7 + ph); if (o.position.y > 12) o.position.y = -8; });
            }
        },
        clouds(th) {
            for (let i = 0; i < 9; i++) {
                const cl = new THREE.Group();
                const m = new THREE.MeshStandardMaterial({ color: pick([th.neb[0], th.neb[1], '#ffffff']), roughness: 1, transparent: true, opacity: 0.85, emissive: new THREE.Color(th.neb[1]), emissiveIntensity: 0.15 });
                for (let k = 0; k < 6; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(rnd(0.6, 1.1), 20, 14), m); s.position.set(rnd(-1.4, 1.4), rnd(-0.3, 0.4), rnd(-0.4, 0.4)); cl.add(s); }
                cl.position.set(rnd(-14, 14), rnd(-2, 9), rnd(-18, -8)); cl.scale.setScalar(rnd(0.8, 1.6)); group.add(cl);
                const sp = rnd(0.2, 0.5);
                updaters.push((dt) => { cl.position.x += sp * dt; if (cl.position.x > 16) cl.position.x = -16; });
            }
            fireflies(30, '#ffffff');
        },
        space(th) { shootingStars(6, th.p[0]); twinkle(th); },
        meds() { }
    };
    function fireflies(n, color) {
        const flies = [];
        for (let i = 0; i < n; i++) {
            const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: color || 0xd9f99d, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
            const sc = rnd(0.25, 0.5); s.scale.set(sc, sc, 1);
            s.userData = { base: new THREE.Vector3(rnd(-10, 10), rnd(-6, 9), rnd(-12, 4)), ph: rnd(0, 6), sp: rnd(0.3, 0.9) };
            s.position.copy(s.userData.base); group.add(s); flies.push(s);
        }
        updaters.push((dt, t) => flies.forEach(s => {
            const u = s.userData;
            s.position.set(u.base.x + Math.sin(t * u.sp + u.ph) * 1.2, u.base.y + Math.cos(t * u.sp * 0.7 + u.ph) * 0.8, u.base.z + Math.sin(t * 0.3 + u.ph));
            s.material.opacity = Math.max(0, Math.sin(t * 1.6 * u.sp + u.ph)) ** 2;
        }));
    }
    function twinkle(th) {
        const st = [];
        for (let i = 0; i < 30; i++) {
            const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: pick(['#ffffff', th.p[0], th.p[1]]), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
            const sc = rnd(0.4, 1.0); s.scale.set(sc, sc, 1); s.position.set(rnd(-25, 25), rnd(0, 16), rnd(-35, -20)); s.userData = { ph: rnd(0, 6), sp: rnd(1, 3), sc };
            group.add(s); st.push(s);
        }
        updaters.push((dt, t) => st.forEach(s => { const k = 0.5 + 0.5 * Math.sin(t * s.userData.sp + s.userData.ph); s.material.opacity = 0.2 + 0.8 * k; s.scale.setScalar(s.userData.sc * (0.7 + 0.6 * k)); }));
    }

    function clear() {
        if (group) {
            scene.remove(group);
            group.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map && o.material.map !== dot && o.material.map !== flakeTex && o.material.map !== leafTex && o.material.map !== petalTex) o.material.map.dispose(); o.material.dispose(); } });
        }
        group = null; updaters = []; if (flash) flash(0);
    }
    return {
        set(kind, th) {
            clear();
            group = new THREE.Group(); scene.add(group);
            (W[kind] || W.meds)(th);
        },
        update(dt, t) { for (let i = 0; i < updaters.length; i++) updaters[i](dt, t); },
        onFlash(fn) { flash = fn; }
    };
};
