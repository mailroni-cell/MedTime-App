// Icon designs in 108x108 dp space (Android adaptive icon). bg = full bleed, fg = inside the safe circle (r 33 around 54,54).
const defs = `
<defs>
 <radialGradient id="bgA" cx="38%" cy="28%" r="85%"><stop offset="0" stop-color="#1e6f9a"/><stop offset=".45" stop-color="#0b2a55"/><stop offset="1" stop-color="#050a24"/></radialGradient>
 <radialGradient id="bgB" cx="50%" cy="30%" r="90%"><stop offset="0" stop-color="#7c3aed"/><stop offset=".5" stop-color="#3b0f7a"/><stop offset="1" stop-color="#120326"/></radialGradient>
 <linearGradient id="bgC" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14b8a6"/><stop offset=".55" stop-color="#0e7490"/><stop offset="1" stop-color="#1e1b4b"/></linearGradient>
 <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#67e8f9" stop-opacity=".55"/><stop offset="1" stop-color="#67e8f9" stop-opacity="0"/></radialGradient>
 <radialGradient id="glowP" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f0abfc" stop-opacity=".5"/><stop offset="1" stop-color="#f0abfc" stop-opacity="0"/></radialGradient>
 <!-- capsule halves: gradient across the short side gives the round 3D body -->
 <linearGradient id="capR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fecaca"/><stop offset=".18" stop-color="#f87171"/><stop offset=".55" stop-color="#dc2626"/><stop offset="1" stop-color="#7f1d1d"/></linearGradient>
 <linearGradient id="capC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ecfeff"/><stop offset=".2" stop-color="#67e8f9"/><stop offset=".55" stop-color="#0891b2"/><stop offset="1" stop-color="#164e63"/></linearGradient>
 <linearGradient id="capW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#f1f5f9"/><stop offset=".7" stop-color="#cbd5e1"/><stop offset="1" stop-color="#64748b"/></linearGradient>
 <linearGradient id="spec" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
 <radialGradient id="face" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e2e8f0"/><stop offset="1" stop-color="#94a3b8"/></radialGradient>
 <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a5f3fc"/><stop offset=".5" stop-color="#22d3ee"/><stop offset="1" stop-color="#6d28d9"/></linearGradient>
 <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
 <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>`;
// capsule centered at 0,0 along x, length L, radius r
function capsule(L, r, left, right) {
  const h = L / 2 - r;
  return `
  <ellipse cx="2" cy="${r + 5}" rx="${L / 2}" ry="${r * .45}" fill="#000" opacity=".55" filter="url(#sh)"/>
  <path d="M0 ${-r} H${-h} A${r} ${r} 0 0 0 ${-h} ${r} H0 Z" fill="url(#${left})"/>
  <path d="M0 ${-r} H${h} A${r} ${r} 0 0 1 ${h} ${r} H0 Z" fill="url(#${right})"/>
  <rect x="-.5" y="${-r}" width="1" height="${2 * r}" fill="#0f172a" opacity=".35"/>
  <rect x="${-h - r * .55}" y="${-r * .72}" width="${L - r * 1.1}" height="${r * .5}" rx="${r * .25}" fill="url(#spec)" opacity=".85"/>
  <ellipse cx="${h * .55}" cy="${-r * .45}" rx="${r * .5}" ry="${r * .16}" fill="#fff" opacity=".9"/>`;
}
const D = {
  // A: glossy capsule over a glowing clock ring, navy-teal night sky
  A: {
    bg: `<rect width="108" height="108" fill="url(#bgA)"/>
         <circle cx="54" cy="52" r="40" fill="url(#glow)"/>
         ${[...Array(18)].map((_, i) => `<circle cx="${(i * 37) % 108}" cy="${(i * 53 + 11) % 108}" r="${.35 + (i % 3) * .25}" fill="#fff" opacity="${.35 + (i % 4) * .15}"/>`).join('')}`,
    fg: `<circle cx="54" cy="54" r="27" fill="none" stroke="url(#ring)" stroke-width="3.2"/>
         <circle cx="54" cy="54" r="27" fill="none" stroke="#e0f2fe" stroke-width=".6" opacity=".8"/>
         ${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<line x1="${54 + Math.cos(a) * 22.5}" y1="${54 + Math.sin(a) * 22.5}" x2="${54 + Math.cos(a) * (i % 3 ? 24 : 25)}" y2="${54 + Math.sin(a) * (i % 3 ? 24 : 25)}" stroke="#a5f3fc" stroke-width="${i % 3 ? .8 : 1.6}" stroke-linecap="round"/>`; }).join('')}
         <g transform="translate(54 54) rotate(-38)">${capsule(40, 8.6, 'capR', 'capW')}</g>`
  },
  // B: capsule + neon ECG line, purple
  B: {
    bg: `<rect width="108" height="108" fill="url(#bgB)"/><circle cx="54" cy="54" r="42" fill="url(#glowP)"/>`,
    fg: `<g transform="translate(54 50) rotate(-35)">${capsule(42, 9, 'capC', 'capW')}</g>
         <polyline points="24,72 40,72 45,64 50,80 55,66 59,72 84,72" fill="none" stroke="#f0abfc" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#soft)" opacity=".9"/>
         <polyline points="24,72 40,72 45,64 50,80 55,66 59,72 84,72" fill="none" stroke="#fff" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>`
  },
  // C: 3D clock whose hands are two small capsules, teal
  C: {
    bg: `<rect width="108" height="108" fill="url(#bgC)"/><circle cx="40" cy="30" r="30" fill="#fff" opacity=".08"/>`,
    fg: `<circle cx="55.5" cy="57.5" r="28" fill="#000" opacity=".45" filter="url(#sh)"/>
         <circle cx="54" cy="54" r="28" fill="url(#ring)"/>
         <circle cx="54" cy="54" r="23.5" fill="url(#face)"/>
         ${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<circle cx="${54 + Math.cos(a) * 19.5}" cy="${54 + Math.sin(a) * 19.5}" r="${i % 3 ? .9 : 1.6}" fill="#0e7490"/>`; }).join('')}
         <g transform="translate(54 54) rotate(-60) translate(8 0)">${capsule(17, 3.4, 'capR', 'capW')}</g>
         <g transform="translate(54 54) rotate(25) translate(6 0)">${capsule(13, 3.2, 'capC', 'capW')}</g>
         <circle cx="54" cy="54" r="2.4" fill="#0f172a"/><circle cx="53.4" cy="53.4" r=".8" fill="#fff"/>
         <path d="M32 40 A26 26 0 0 1 60 29" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/>`
  }
};
module.exports = { defs, D };
