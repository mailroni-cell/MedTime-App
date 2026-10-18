const { chromium } = require('playwright');
const { defs, D } = require('./icons.js');
const [key, resDir] = process.argv.slice(2);
const d = D[key];
const svg = (inner, px, vb) => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="${vb}">${defs}${inner}</svg>`;
const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  async function shot(html, px, file, round) {
    await p.setViewportSize({ width: px, height: px });
    await p.setContent(`<body style="margin:0;background:transparent"><div style="width:${px}px;height:${px}px;overflow:hidden;${round ? 'border-radius:50%' : ''}">${html}</div></body>`);
    await p.screenshot({ path: file, omitBackground: true });
  }
  for (const [n, s] of Object.entries(DENS)) {
    const dir = `${resDir}/mipmap-${n}`; require('fs').mkdirSync(dir, { recursive: true });
    await shot(svg(d.bg, 108 * s, '0 0 108 108'), 108 * s, `${dir}/ic_launcher_background.png`);
    await shot(svg(d.fg, 108 * s, '0 0 108 108'), 108 * s, `${dir}/ic_launcher_foreground.png`);
    await shot(svg(d.bg + d.fg, 48 * s, '18 18 72 72'), 48 * s, `${dir}/ic_launcher.png`);
    await shot(svg(d.bg + d.fg, 48 * s, '18 18 72 72'), 48 * s, `${dir}/ic_launcher_round.png`, true);
  }
  await b.close();
})();
