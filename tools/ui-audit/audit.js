// M-349 (owner): UI audit. Opens every main screen at 3 phone sizes, normal and low-vision, and lists anything that
// goes past the screen edge or is cut. Usage: node tools/ui-audit/audit.js app/src/main/assets [screen,screen]  (screenshots in ./shots)
const { chromium } = require(process.env.PW || 'playwright');
const A = process.argv[2], only = process.argv[3];
const sizes = [[360,640],[393,820],[412,915]];
const seed = (lv) => {
  localStorage.setItem('medtime_lang','he'); localStorage.setItem('medtime_name','רוני');
  localStorage.setItem('medtime_list', JSON.stringify([{id:11,name:'אקמול פורטה 500 מ"ג',time:'23:30',dose:'1'},{id:12,name:'ויטמין D3 טיפות',time:'08:00',dose:'2'},{id:13,name:'אומפרזול',time:'13:15',dose:'1'}]));
  const d=new Date(Date.now()+3*864e5), iso=x=>x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
  localStorage.setItem('medtime_appts', JSON.stringify([
    {id:1,type:'family',doctor:'ד"ר אלכסנדרה רוזנבלום-כהן',date:iso(d),time:'10:30',fund:'כללית',place:'מרפאת רמת אביב ג׳ המרכזית',city:'תל אביב - יפו',street:'אינשטיין',house:'40',phone:'03-1234567',before:60,travel:20,notes:'להביא בדיקות דם ותוצאות אולטרסאונד'},
    {id:2,type:'specialist',doctor:'פרופ׳ יהונתן בן-אברהם',date:iso(new Date(Date.now()+864e5)),time:'08:15',fund:'מכבי',place:'בית החולים איכילוב',city:'תל אביב - יפו',street:'ויצמן',house:'6',phone:'*2700',before:120,travel:30,notes:''},
    {id:3,type:'family',doctor:'ד"ר שרה',date:iso(new Date(Date.now()+20*864e5)),time:'16:45',fund:'',place:'',city:'',street:'',house:'',phone:'',before:60,travel:0,notes:''}]));
  localStorage.setItem('medtime_vitals', JSON.stringify([{k:'bp',v:[128,82],at:Date.now()-864e5},{k:'pulse',v:72,at:Date.now()-2*864e5},{k:'sugar',v:105,at:Date.now()-3*864e5}]));
  if (lv) localStorage.setItem('medtime_lowvision','1');
  try { localStorage.setItem('mt_setup_done','1'); } catch(e){}
  window.MedTimeNative={getLog:()=>'[]',getSounds:()=>'[]',listVoices:()=>{}};
};
const screens = [
  ['home', null],
  ['appts', 'openApptPage()'],
  ['apptForm', 'openApptPage(); openApptForm()'],
  ['apptEdit', 'openApptPage(); openApptForm(0)'],
  ['list', 'openListPage()'],
  ['addMed', 'typeof openMedPage==="function"?openMedPage():document.getElementById("main-add").click()'],
  ['settings', 'openSettingsPage()'],
  ['relax', 'openRelax()'],
  ['vitals', 'document.getElementById("vt-btn").click()'],
  ['scan', 'document.getElementById("sb-home").click()'],
  ['guide', 'document.getElementById("fa-home")?document.getElementById("fa-home").click():0'],
  ['sos', 'document.getElementById("sos-btn").click()'],
];
const check = () => {
  const W = innerWidth, H = innerHeight, out = [];
  const vis = e => { for (let a = e; a && a !== document.documentElement; a = a.parentElement) { const c = getComputedStyle(a); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) return false; } return true; };
  const d = e => (e.tagName + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0,2).join('.') : '')) + ' "' + (e.innerText || '').trim().slice(0, 30).replace(/\n/g,' ') + '"';
  const all = [...document.querySelectorAll('body *')].filter(e => !['SCRIPT','STYLE','CANVAS','svg','path','BR'].includes(e.tagName));
  for (const e of all) {
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.bottom < 0 || r.top > H * 3) continue;
    if (r.right <= W + 2 && r.left >= -2) {
      // text cut inside its own box
      const c = getComputedStyle(e);
      if (e.children.length === 0 && (e.innerText||'').trim() && e.scrollWidth > e.clientWidth + 3 && /hidden|clip/.test(c.overflowX) && c.textOverflow !== 'ellipsis' && vis(e)) out.push('CUT ' + d(e));
      continue;
    }
    if (!vis(e)) continue;
    // is it clipped by an on-screen ancestor?
    let clipped = false;
    for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      const c = getComputedStyle(a);
      if (/hidden|auto|scroll|clip/.test(c.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= W + 2 && ar.left >= -2) { clipped = /auto|scroll/.test(c.overflowX) ? 'scroll' : true; break; } }
      const ar = a.getBoundingClientRect(); if (ar.right > W + 2 || ar.left < -2) { clipped = 'parent'; break; }
    }
    if (clipped === 'parent') continue; // reported at the parent
    if (clipped === true) { if ((e.innerText||'').trim() && e.children.length < 3) out.push('CLIPPED ' + d(e) + ' ' + Math.round(r.left) + '..' + Math.round(r.right)); continue; }
    if (clipped === 'scroll') continue;
    out.push('OVER ' + d(e) + ' ' + Math.round(r.left) + '..' + Math.round(r.right));
  }
  if (document.documentElement.scrollWidth > W + 2) out.push('PAGE scrollWidth ' + document.documentElement.scrollWidth);
  return [...new Set(out)].slice(0, 25);
};
require('fs').mkdirSync('shots', { recursive: true });
(async () => {
  const b = await chromium.launch();
  const rep = [];
  for (const lv of [0, 1]) for (const [w, h] of sizes) {
    for (const [name, js] of screens) {
      if (only && !only.split(',').includes(name)) continue;
      const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await p.addInitScript(seed, lv);
      const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
      await p.goto('file://' + A + '/index.html'); await p.waitForTimeout(4500);
      await p.evaluate(() => { document.querySelectorAll('[id*=splash],.splash,#welcome,#setup,.setup-page').forEach(e => e.remove()); dispatchEvent(new Event('resize')); });
      await p.waitForTimeout(1200);
      if (js) { try { await p.evaluate(js); } catch (e) { errs.push('open: ' + String(e).slice(0, 100)); } await p.waitForTimeout(1500); }
      const r = await p.evaluate(check);
      const tag = `${name}_${w}${lv ? '_LV' : ''}`;
      await p.screenshot({ path: `shots/${tag}.png` });
      rep.push(`== ${tag}: ${r.length ? r.length + ' issues' : 'ok'}${errs.length ? ' ERR ' + errs.join(' | ') : ''}\n` + r.map(x => '   ' + x).join('\n'));
      await p.close();
    }
  }
  console.log(rep.join('\n'));
  await b.close();
})();
