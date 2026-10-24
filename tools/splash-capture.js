// M-093: records the 3D opening frame by frame (exact 60 fps clock) and makes app/src/main/assets/splash.mp4.
// Run: NODE_PATH=<global node_modules with playwright> node tools/splash-capture.js   (needs ffmpeg)
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const out = path.join(root, 'app/src/main/assets/splash.mp4');
const frames = '/tmp/medtime-splash-frames';
const FPS = 60, SECONDS = 11.7; // M-097: 1.5 s calm end with the logo
if (!process.env.ENCODE_ONLY) (async () => {
  if (!process.env.KEEP) fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true }); // KEEP=1: parts in parallel (FROM/TO), then ENCODE_ONLY=1
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 360, height: 800 }, deviceScaleFactor: +(process.env.DPR || 3) }); // M-364: 1080x2400 like most phones (was 720x1600, upscaled = soft)
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
    if (process.env.KEEP && fs.existsSync(path.join(frames, String(i).padStart(4, '0') + '.png'))) continue;
    const ms = i * 1000 / FPS;
    await p.evaluate(ms => {
      document.getAnimations().forEach(a => { try { a.pause(); a.currentTime = ms; } catch (e) { } });
      window.__spRender(ms / 1000);
      // M-096: wait until the browser really drew this state (without it some frames came out stale -> credit flicker)
      return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, ms);
    await p.screenshot({ path: path.join(frames, String(i).padStart(4, '0') + '.png'), type: 'png' }); // M-363: lossless frames (JPEG made blocky dark gradients)
    if (i % 60 === 0) console.log('frame', i, '/', N);
  }
  await b.close();
  if (process.env.TO) return;
  encode();
})();
// M-363 (owner: deeper black, stronger colour, smooth background with no pixels): colour grade on the lossless frames,
// a fine grain so dark gradients do not band in 8-bit video, high quality. Also the repeat opening (from 6.35 s) as its own file.
function encode() {
  const assets = path.join(root, 'app/src/main/assets');
  const vf = 'format=gbrp,colorlevels=rimin=0.06:gimin=0.06:bimin=0.06,eq=saturation=1.9:contrast=1.1:gamma=0.97,noise=alls=2:allf=t,format=yuv420p';
  const enc = `-c:v libx264 -profile:v high -level 5.1 -pix_fmt yuv420p -crf 20 -preset slower -tune film -x264-params aq-mode=3 -g 60 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -movflags +faststart -an`;
  const both = (from, file) => execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -start_number ${from} -i ${frames}/%04d.png -vf ${vf},scale=out_color_matrix=bt709 ${enc} ${path.join(assets, file)}`);
  both(0, 'splash.mp4'); both(Math.round(6.35 * FPS), 'splash_end.mp4');
  execSync(`ffmpeg -y -loglevel error -i ${path.join(assets, 'splash.mp4')} -frames:v 1 -q:v 3 ${path.join(assets, 'splash_a.jpg')}`);
  execSync(`ffmpeg -y -loglevel error -i ${path.join(assets, 'splash_end.mp4')} -frames:v 1 -q:v 3 ${path.join(assets, 'splash_b.jpg')}`);
  ['splash.mp4', 'splash_end.mp4'].forEach(f => console.log('done', f, fs.statSync(path.join(assets, f)).size));
}
if (process.env.ENCODE_ONLY) { encode(); process.exit(0); }
