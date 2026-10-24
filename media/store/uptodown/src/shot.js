const { chromium } = require('playwright');
const MEDS = {
 he:[['אקמול','כדור אחד'],['ויטמין D','טיפה אחת'],['אומפרדקס','כדור לפני האוכל']],
 ar:[['باراسيتامول','حبة واحدة'],['فيتامين د','قطرة واحدة'],['أوميبرازول','حبة قبل الأكل']],
 ro:[['Paracetamol','o pastilă'],['Vitamina D','o picătură'],['Omeprazol','o pastilă înainte de masă']],
 fr:[['Paracétamol','un comprimé'],['Vitamine D','une goutte'],['Oméprazole','un comprimé avant le repas']],
 en:[['Paracetamol','one tablet'],['Vitamin D','one drop'],['Omeprazole','one tablet before food']],
 ru:[['Парацетамол','одна таблетка'],['Витамин D','одна капля'],['Омепразол','таблетка до еды']]};
(async () => {
  const b = await chromium.launch();
  for (const lang of ['he','ar','ro','fr','en','ru']) {
    const ctx = await b.newContext({ viewport: { width: 412, height: 732 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();
    const meds = MEDS[lang].map((m,i)=>({id:1000+i,time:['08:00','13:00','20:00'][i],items:[{name:m[0],dose:m[1],type:i==1?'drops':'pill'}],days:[]}));
    await p.addInitScript(([l,ms]) => { try {
      localStorage.setItem('medtime_lang', l); localStorage.setItem('medtime_sp_seen','1');
      localStorage.setItem('medtime_name', {he:'רוני',ar:'سارة',ro:'Ana',fr:'Marie',en:'Anna',ru:'Анна'}[l]);
      localStorage.setItem('medtime_ts','1'); localStorage.setItem('medtime_overlay_asked','1'); localStorage.setItem('mt_saver_told','1');
      if (!sessionStorage.getItem('x')) { localStorage.setItem('medtime_list', JSON.stringify(ms)); sessionStorage.setItem('x','1'); }
    } catch(e){} }, [lang, meds]);
    await p.goto('file:///home/claude/medtime-app/app/src/main/assets/index.html');
    await p.waitForTimeout(8000);
    await p.screenshot({ path: `raw-${lang}-1.png` });
    await p.evaluate(()=>openListPage()); await p.waitForTimeout(2500);
    await p.screenshot({ path: `raw-${lang}-2.png` });
    await p.reload(); await p.waitForTimeout(7000);
    await p.evaluate(()=>openRelax()); await p.waitForTimeout(6000);
    await p.screenshot({ path: `raw-${lang}-3.png` });
    await ctx.close();
  }
  await b.close();
})();
