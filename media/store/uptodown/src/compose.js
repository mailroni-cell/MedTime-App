// Store images for Uptodown: framed screenshots (1080x1920) and feature image (1024x500) in 6 languages
const { chromium } = require('playwright');
const fs = require('fs');
const T = {
 he:{rtl:1,s:[['הכל במסך אחד','תזכורות, תורים לרופא ומדדים'],['התזכורות שלי','שעה, תרופה ומינון, בגדול וברור'],['רגע של שלווה','נשימה, צלילי טבע וסרטונים מרגיעים']],f:['תזכורת לתרופות','בקול, במסך מלא, בגדול.','פשוט לכל אחד.']},
 ar:{rtl:1,s:[['كل شيء في شاشة واحدة','تذكيرات ومواعيد الطبيب والقياسات'],['تذكيراتي','الوقت والدواء والجرعة، بخط كبير وواضح'],['لحظة هدوء','تنفس وأصوات الطبيعة وفيديوهات مريحة']],f:['تذكير بالأدوية','بالصوت، بملء الشاشة، بخط كبير.','سهل للجميع.']},
 ro:{s:[['Totul pe un singur ecran','Mementouri, programări la medic și măsurători'],['Mementourile mele','Ora, medicamentul și doza, mare și clar'],['Un moment de liniște','Respirație, sunete din natură și video relaxante']],f:['Memento pentru medicamente','Cu voce, pe tot ecranul, cu litere mari.','Simplu pentru oricine.']},
 fr:{s:[['Tout sur un seul écran','Rappels, rendez-vous médicaux et mesures'],['Mes rappels','Heure, médicament et dose, en grand et clair'],['Un moment de sérénité','Respiration, sons de la nature et vidéos apaisantes']],f:['Rappel de médicaments','À voix haute, plein écran, en grand.','Simple pour tous.']},
 en:{s:[['Everything on one screen','Reminders, doctor appointments and vitals'],['My reminders','Time, medicine and dose, big and clear'],['A moment of calm','Breathing, nature sounds and relaxing videos']],f:['Medication reminder','Out loud, full screen, in big letters.','Simple for everyone.']},
 ru:{s:[['Всё на одном экране','Напоминания, визиты к врачу и показатели'],['Мои напоминания','Время, лекарство и доза, крупно и понятно'],['Минута спокойствия','Дыхание, звуки природы и спокойные видео']],f:['Напоминание о лекарствах','Вслух, на весь экран, крупно.','Просто для всех.']}};
const b64 = f => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const stars = Array.from({length:40},(_,i)=>`<i style="left:${(i*137)%100}%;top:${(i*61)%100}%;width:${3+i%5}px;height:${3+i%5}px;opacity:${.2+(i%4)/6}"></i>`).join('');
const base = `*{margin:0;box-sizing:border-box}body{font-family:'Noto Sans','Noto Sans Hebrew','Noto Sans Arabic',sans-serif;color:#fff;overflow:hidden;background:radial-gradient(circle at 50% 35%,#1d5f8f 0%,#0d2c55 45%,#071330 100%)}i{position:absolute;border-radius:50%;background:#fff}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  fs.mkdirSync('out', {recursive:true});
  for (const [l, t] of Object.entries(T)) {
    const dir = t.rtl ? 'rtl' : 'ltr';
    for (let k = 0; k < 3; k++) {
      await p.setViewportSize({width:1080,height:1920});
      await p.setContent(`<html dir="${dir}"><style>${base}
      h1{position:absolute;top:95px;width:100%;text-align:center;font-size:${t.s[k][0].length>20?82:100}px;font-weight:800;text-shadow:0 0 30px rgba(110,220,255,.6)}
      h2{position:absolute;top:230px;width:100%;text-align:center;font-size:48px;font-weight:500;color:#9fe6ff;padding:0 60px}
      .ph{position:absolute;left:125px;top:340px;width:830px;height:1490px;border-radius:60px;border:8px solid #4fa8c8;overflow:hidden;box-shadow:0 0 60px rgba(79,200,255,.35)}
      .ph img{width:100%;height:100%;object-fit:cover;object-position:top}</style><body>${stars}
      <h1>${t.s[k][0]}</h1><h2>${t.s[k][1]}</h2><div class="ph"><img src="${b64(`raw-${l}-${k+1}.png`)}"></div></body></html>`);
      await p.waitForTimeout(300);
      await p.screenshot({path:`out/screenshot-${k+1}-${l}.png`});
    }
    await p.setViewportSize({width:1024,height:500});
    await p.setContent(`<html dir="ltr"><style>${base}
      .ic{position:absolute;left:70px;top:70px;width:360px;height:360px;border-radius:70px;overflow:hidden;box-shadow:0 0 50px rgba(79,200,255,.3);border:2px solid rgba(255,255,255,.15)}
      .ic img{width:100%;height:100%}
      .tx{position:absolute;left:470px;right:60px;top:95px;text-align:${t.rtl?'right':'left'};direction:${dir}}
      .tx b{display:block;font-size:92px;font-weight:800;direction:ltr;text-align:inherit;text-shadow:0 0 25px rgba(110,220,255,.5)}
      .tx p{font-size:${t.f[0].length>22?40:50}px;font-weight:700;color:#7fe0ff;margin:10px 0 26px}
      .tx span{display:block;font-size:27px;line-height:1.4}</style><body>${stars}
      <div class="ic"><img src="${b64('icon-512.png')}"></div>
      <div class="tx"><b>MedTime</b><p>${t.f[0]}</p><span>${t.f[1]}</span><span>${t.f[2]}</span></div></body></html>`);
    await p.waitForTimeout(300);
    await p.screenshot({path:`out/feature-1024x500-${l}.png`});
  }
  await b.close();
})();
