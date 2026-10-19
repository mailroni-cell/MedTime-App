// M-093: records the 3D opening frame by frame (exact 60 fps clock) and makes app/src/main/assets/splash.mp4.
// Run: NODE_PATH=<global node_modules with playwright> node tools/splash-capture.js   (needs ffmpeg)
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'app/src/main/assets/splash.mp4');
const frames = '/tmp/medtime-splash-frames';
const FPS = 60, SECONDS = 11.7; // M-097: 1.5 s calm end with the logo
(async () => {
  fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2 });
  await p.addInitScript(() => {
    window.__spCapture = true; window.__sp3d = true;
    localStorage.setItem('medtime_lang', 'he'); localStorage.setItem('medtime_setup', '1');
  });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(root, 'app/src/main/assets/index.html'));
  await p.waitForFunction(() => window.__spRender && window.__spGo, null, { timeout: 30000 });
  const tagY = await p.evaluate(() => {
    document.querySelector('#splash .sp-tag').style.visibility = 'hidden'; // the language line stays live text in the app
    window.endSplash = function () { };
    window.__spGo();
    const r = document.getElementById('sp-tag').getBoundingClientRect();
    return r.top / innerHeight;
  });
  console.log('SPLASH_TAG_Y', tagY.toFixed(4));
  const N = Math.round(SECONDS * FPS);
  const A = +(process.env.FROM || 0), B = +(process.env.TO || N); // test a part only: FROM=300 TO=360
  for (let i = A; i < B; i++) {
    const ms = i * 1000 / FPS;
    await p.evaluate(ms => {
      document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = ms; } catch (e) { } });
      window.__spRender(ms / 1000);
      // M-096: wait until the browser really drew this state (without it some frames came out stale -> credit flicker)
      return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, ms);
    await p.screenshot({ path: path.join(frames, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 95 });
    if (i % 60 === 0) console.log('frame', i, '/', N);
  }
  await b.close();
  if (process.env.TO) return;
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${frames}/%04d.jpg -c:v libx264 -profile:v high -level 4.1 -pix_fmt yuv420p -crf 21 -preset slow -movflags +faststart ${out}`);
  console.log('done', out, fs.statSync(out).size);
})();
