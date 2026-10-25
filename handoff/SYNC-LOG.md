# יומן שינויים משותף לשני החשבונות (SYNC-LOG)

כל שינוי נרשם כאן עם חתימה: מתי, איזה חשבון/שיחה, מה בדיוק, אילו קבצים, ואיך להחזיר אחורה.
החדש ביותר למעלה. להחזרה: `git revert <commit>` או לקחת את הקובץ מה-commit הקודם.

## 2026-10-25 ~07:15Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: M-374 המתקין במחשב (tools/medtime_autoinstall.ps1 -> C:\Projects\MedTime) מושך כל 10 דקות בכבל את alarm_log.txt מהטלפון ל-C:\Projects\MedTime\alarm_log.txt. התחיל מחדש לבד 09:10. MyTime AAB נבנה מחדש: versionCode 1102 (כולל M-373).
- להחזרה: git checkout HEAD~1 -- tools/medtime_autoinstall.ps1 והעתקה למחשב.

## 2026-10-25 ~07:10Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: רוני "שחרר לכולם": release/stable.txt = run 246. latest מאומת.
- להחזרה: "run 244" ב-release/stable.txt (git revert 28ec363).

## 2026-10-25 ~06:45Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: M-373 דיוק תזכורות: תזכורת מים בלי מסך מלא; ביטול דחייה/חזרה ממתינה של תזכורת שנמחקה; יומן צלצולים alarm_log.txt (Reminders.log). בנייה 246 על test.
- להחזרה: git revert 82593ee.

## 2026-10-25 ~01:30Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: M-372 MyTime (גרסת Google Play) הועברה ל-main: קבצי app/src/play, תנאי MT_STORE/BuildConfig.STORE בקבצים משותפים (MedTime לא משתנה), workflow חדש mytime-bundle.yml (play-bundle.yml היה מושבת). AAB ריצה 1 = versionCode 1101 ב-release play. MedTime בנייה 245 על test.
- להחזרה: git revert bd8ef72. ענף play-edition הישן לא נגעתי בו.

## 2026-10-25 ~01:25Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: M-371 דף הסטטיסטיקה: תוויות "התחילו הורדה" ו"התקנות שנפתחו" + הסבר במשפט הסיכום (docs/stats.html). stats.js שולח ping גם מיד אחרי עדכון גרסה (ייכנס לבנייה הבאה). סנכרון מהמחשב: HANDOFF במחשב זהה לשרת; 244 הותקנה בטלפון 24.10 14:24.
- להחזרה: git revert <commit זה>.

## 2026-10-24 ~14:50Z · חשבון 1 · פרויקט TELEGRAM_BOT, thread "להפיץ את MedTime בלי אזהרות התקנה"
- מה: לבקשת רוני, כל מה שקשור ל-MedTime מפרויקט הטלגרם רוכז ב-handoff/from-telegram-project/README.md (2 שיחות: סטטיסטיקה + Uptodown), כולל files/MedTime-ad.jpg ו-MedTime-post.txt. מעכשיו MedTime רק בפרויקט MedTime.
- להחזרה: git revert של ה-commit (מסמכים בלבד).

## 2026-10-24 ~14:40Z · חשבון 1 · פרויקט TELEGRAM_BOT, thread "להפיץ את MedTime בלי אזהרות התקנה"
- מה: רוני העלה את MedTime ל-Uptodown בהנחיה (נשלח לבדיקה). נוספו media/store/uptodown/MedTime-Uptodown-images.zip ו-images/icon-200.png. HANDOFF סעיף 34 עודכן.
- להחזרה: אין קוד; ב-Uptodown אפשר למחוק את האפליקציה מה-Console.

## 2026-10-24 ~14:10Z · חשבון 1 · פרויקט TELEGRAM_BOT, thread "להפיץ את MedTime בלי אזהרות התקנה"
- מה: M-370, חבילת Uptodown: media/store/uptodown/ (texts.md טקסטים ב-6 שפות, steps-he.md הוראות העלאה, images/ אייקון + 18 צילומי מסך + 6 תמונות ראשיות, src/ הסקריפטים שיצרו אותם מהאפליקציה עצמה). קוד האפליקציה לא השתנה. החלטת רוני: בלי עוסק פטור, לכן לא Google Play לגרסה המלאה; ממשיכים ב-Uptodown.
- להחזרה: git revert של ה-commit הזה (רק קבצי מדיה ומסמכים).

## 2026-10-24 ~11:00Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: M-369 דיאטה סבב 3 (רוני: "א ב לך על זה ועדכן את השרת ושחרר לכולם"): מנוע הקול (sherpa-onnx) יורד עם הקול הראשון (engine_arm64.zip ב-release media; Piper.java, Tts.kt, build-apk.yml placeholder 64-bit, media.yml); 11 צלילי טבע בפנים, 21 הועברו ל-media/ambient ונמשכים בבחירה ראשונה (relax.js ambSrc, Media.java). בנייה 244 = 44.0 MB. שוחררה לכולם: stable = run 244 (כולל M-367, M-368).
- להחזרה: לכתוב "run 242" ב-release/stable.txt ולדחוף; קוד: git revert a898977 e0fe14a.

## 2026-10-24 ~10:45Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: M-368 דיאטה סבב 2 (רוני בחר 2+3): קולות שלווה מוקלטים - רק עברית בתוך האפליקציה, שאר השפות כ-calm_<lang>.zip ב-release media (media/calm, Media.calm, NativeBridge.calmBase, relax.js calmBase); כיווץ קוד R8 בבניית debug (app/build.gradle, app/proguard-rules.pro). בנייה 243 = 62.6 MB, על test בלבד.
- להחזרה: git revert e0fe14a.

## 2026-10-24 ~10:30Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה"
- מה: רוני "שחרר לכולם": release/stable.txt = run 242 (M-367). release latest מאומת = run 242.
- להחזרה: לכתוב "run 240" ב-release/stable.txt ולדחוף (git revert f75c265).

## 2026-10-24 ~10:15Z · חשבון 1 · thread "📌 MedTime – הרזיית האפליקציה" (session_011Z3KyZMgrnCK6NN9VAyN4e)
- מה: M-367 דיאטה (רוני בחר א+ב+ג): קולות Piper יורדים רק לשפת האפליקציה (Piper.java, Voices.java, voices.js; build-apk.yml מכניס רק espeak); 32 צלילי טבע ב-Opus 48k (assets/ambient); 13 סרטוני שלווה הועברו ל-media/video ומתפרסמים ב-release media (media.yml), Media.java + NativeBridge.mediaFile + relax.js vidSrc. נשארו בפנים: v_ocean, v_beach, v_stars. APK צפוי ~70 MB במקום 204.
- להחזרה: git revert 18b94e6 (ואז בנייה).

## 2026-10-24 ~09:55Z · חשבון 1 · פרויקט TELEGRAM_BOT, thread "לשפר דף סטטיסטיקה של MedTime"
- מה: M-366, השרת הישן (ntfy) כובה לנתוני שימוש: app/src/main/assets/stats.js (עדכון מהיר), docs/download.html, docs/privacy.html (6 שפות), .github/workflows/stats.yml (בלי cron). ההתראות הפרטיות לרוני (סקר, שאלות במדריך) נשארו ב-ntfy. בניית APK 241 בוטלה.
- להחזרה: git revert 9ed203f 26c3207.

## 2026-10-24 ~09:45Z · חשבון 1 · פרויקט TELEGRAM_BOT, thread "לשפר דף סטטיסטיקה של MedTime"
- מה: M-365, docs/stats.html: הוסר "המונה הישן" (ntfy/summary.json); הכול מ-/api/stats של Cloudflare, כולל גרפים יומיים מ-by_day; רענון אוטומטי כל 10 דקות + כפתור רענון; תוויות התאריכים בגרפים תוקנו (היו הפוכות). CHANGES.md, HANDOFF.md סעיף 29.
- להחזרה: git revert cc23aae (או git checkout 9e8c583 -- docs/stats.html).

## 2026-10-23 ~16:30Z · חשבון שני · thread MedTime מלא (session_01A9pNaGupDEjWngj1PsdFue)
- מה: M-326 הורדה אוטומטית בכניסה לדף ההורדה באנדרואיד (docs/download.html, sessionStorage mt_auto, 1.2 שניות); טקסט שלב 1 ב-6 שפות. whatsapp_ad_he.txt מקשר ל-/ad/.
- להחזרה: git revert d515f0d 30260c4.

## 2026-10-23 ~16:20Z · חשבון שני · thread MedTime מלא (session_01A9pNaGupDEjWngj1PsdFue)
- מה: M-325, תיקון שגיאת ההורדה מדף המודעה: docs/_redirects = '/ /download 200' בלבד (נמחקה '/download /download.html 301' שיצרה לולאת הפניות). Cloudflare Pages: success על 66e7773.
- להחזרה: git revert 66e7773.

## 2026-10-23 ~19:05 · account 1 · thread "📌 MedTime – שיחה חדשה" · ad web page
- Roni: make the ad a web page on Cloudflare, full screen, with a live link. New: docs/ad/index.html + docs/ad/ad.jpg (the 4:5 ad, JPG q92) + docs/ad/bg.jpg (blurred fill). Address: https://medtime.pages.dev/ad/ . Tap anywhere opens https://medtime.pages.dev/ ; pulsing red "⬇️ להורדה בחינם" button at the bottom on phones; WhatsApp preview (og:image) is the ad itself.
- Pushed WITHOUT [skip ci] so Cloudflare Pages deploys (docs/** does not start an APK build).
- Undo: git rm -r docs/ad (state before: e66a29e)

## 2026-10-23 ~19:00 · account 1 · thread "📌 MedTime – שיחה חדשה" · back to the original 4:5 ad
- Roni: "go back to the original version, before the changes and the stretching". The ad to send is media/ads/MedTime-ad-premium.png (4:5, 1080x1350, unchanged by the tall rounds, checked pixel for pixel). The tall version (MedTime-ad-premium-tall.png, round 6) is set aside, kept only in the repo history; do not send it.

## 2026-10-23 ~18:55 · account 1 · thread "📌 MedTime – שיחה חדשה" · tall ad round 6
- Roni: side text "העתיד בכף ידך" was cut, bottom rows too small, empty strip at the top, phone should be whole, the black bottom should continue the background.
- New script media/ads/src/premium_tall3.py (round 6): no empty top strip; phone 1.55x and whole (it is turned upright, cut above the hidden bottom buttons, closed with its own top edge mirrored, turned back); "העתיד בכף ידך" moved to the right column under the checklist, about 1.9x, not cut; the background goes on to the bottom (mirror of the photo, blurred, gradually darker); bottom rows bigger (62/58px, 3 lines). premium_fix10.py got MT_DUMP (writes the layers). The 4:5 ad is unchanged (checked pixel for pixel).
- Run: MT_TALL=1 MT_DUMP=layers.npz MT_F0=1339 MT_Y0=1340 python3 premium_fix10.py r1b.png orig.png FONTDIR base6.png ; python3 premium_tall3.py base6.png layers.npz r1b.png FONTDIR out.png
- Undo: git checkout 8eacdcf -- media/ads/MedTime-ad-premium-tall.png (round 5; premium_tall2.py stays for it)

## 2026-10-23 ~16:20 · account 1 · thread "📌 MedTime – שיחה חדשה" · tall ad round 5
- Roni: "all the content above the two bottom rows should be bigger". Phone 1.42x (was 1.22x), background fades out above the old bottom rows, download lines bigger (96/112), bottom rows compact (one line each, at the very bottom), more spacing.
- Files: media/ads/MedTime-ad-premium-tall.png, media/ads/src/premium_fix10.py (MT_BF0/MT_BY0, Y1 follows height), media/ads/src/premium_tall2.py (MT_TOP/MT_CUT/MT_GAP, compact rows). 4:5 ad unchanged (checked pixel for pixel).
- Run: pad r1b.png/orig.png with 450 rows at the bottom; MT_TALL=1 MT_PS=1.42 MT_BF0=1000 MT_BY0=1190 MT_F0=1330 MT_Y0=1420 python3 premium_fix10.py r1b_pad orig_pad fonts base3.png; MT_TOP=170 MT_CUT=1420 MT_GAP=150 python3 premium_tall2.py base3.png fonts out.png
- Undo: git checkout 8826e73 -- media/ads/MedTime-ad-premium-tall.png media/ads/src/premium_tall2.py media/ads/src/premium_fix10.py

## 2026-10-23 ~14:35 (אפליקציה) · חשבון ראשי · שיחה "📌 MedTime – שיחה חדשה" (session_01VsxPbo6X9KYMbXyBhgnXSS)
- מה: M-320..M-324 (פירוט ב-CHANGES.md): ברכה וצלב למעלה; פריסה שווה (3 בשורה, שורה קצרה ממורכזת); תור רופא: תווית קצרה על הסמל; חיסכון בסוללה (saver.js + WebView onPause/onResume + isPowerSave/batteryLevel/isCharging ב-NativeBridge); טיפ הגדרות בסוף ההגדרה הראשונית.
- קומיטים: cc5f4ca (דף, עדכון מהיר), 36dcecb (Java, בנייה 223). להחזרה: git revert 36dcecb cc5f4ca.

## 2026-10-23 ~15:55 · חשבון ראשי · אותה שיחה
- מה: גרסה גבוהה סבב 4: טלפון גדול ×1.22 (Lanczos + חידוד), התחתית שלו נמוגה נמוך יותר; הוסרו שאריות הכפתור/ברקוד הישנים מאחוריו; הכיתובים למטה נפרסו מחדש. הרצה: MT_TALL=1 MT_PS=1.22 MT_F0=1150 MT_Y0=1300 premium_fix10.py (cdddeed→fix6 out, ddc63a0, fonts, base) ואז premium_tall2.py base fonts out. גרסת 4:5 לא השתנתה (נבדק: זהה).

## 2026-10-23 ~15:45 · חשבון ראשי · אותה שיחה
- מה: הגרסה הגבוהה, סבב 3: 1080x2340 (9:19.5, רוב הטלפונים). בסיס = premium_fix10.py עם MT_TALL=1 (בלי כתובת ובלי שורות תחתונות); למעלה 220 רקע כהה; באזור הכהה למטה נכתבו מחדש בגדול: "להורדת האפליקציה:" + הכתובת (אדום, קו צהוב), "עוזר קולי • בלי פרסומות" / "כרטיס חירום", והשפות בשתי שורות (ירוק, קו כהה, טבעת לבנה דקה). סקריפט: media/ads/src/premium_tall2.py (מחליף את premium_tall.py). גרסת 4:5 לא השתנתה.

## 2026-10-23 ~15:35 · חשבון ראשי · אותה שיחה
- מה: הגרסה הגבוהה, סבב 2: החלקים נפרסים לכל הגובה בלי למתוח טקסט או תמונה: רווח נוסף רק בשורות שקטות (למעלה 170, בין המוטו לשורות הצהובות 80, באזור הכהה 150, בין השורות התחתונות 50, למטה 120); צבעים +8% רוויה וחידוד קל. סקריפט: premium_tall.py.

## 2026-10-23 ~15:30 · חשבון ראשי · אותה שיחה
- מה: רוני בחר "שתי גרסאות": נוספה media/ads/MedTime-ad-premium-tall.png (1080x1920, 9:16) לסטטוס/מסך מלא: המודעה באמצע, למעלה המשך רך של צבע הרקע העליון, למטה הצבע הכהה, מסגרת כחולה סביב הכל. סקריפט: media/ads/src/premium_tall.py. גרסת 4:5 נשארת לצ'אטים. טקסט לצירוף: media/ads/whatsapp_ad_he.txt.

## 2026-10-23 ~15:25 · חשבון ראשי · אותה שיחה
- מה: מודעה סבב 13: הקו הכהה וההילה הלבנה סביב שתי השורות התחתונות בערך חצי (קו כהה 2px, לבן 1px); ניקוי שאריות כיתוב הטלפון בין השורות. נוסף media/ads/MedTime-ad-premium-whatsapp-preview.jpg: תצוגה של התמונה בדחיסת וואטסאפ (JPEG 70) על מסך טלפון מלא 1080x2400. קובץ: premium_fix10.py.

## 2026-10-23 ~15:20 · חשבון ראשי · אותה שיחה
- מה: מודעה סבב 12 (premium_fix10.py, מחליף את fix9): הטלפון בגודל המקורי; בלי הרקע הכהה מאחורי "העתיד בכף ידך"; שתי השורות התחתונות נלקחות מהמקור ומקבלות טבעת לבנה דקה (2px); כתובת ההורדה במילוי אדום #ff2440 עם קו צהוב, קצת למעלה; "רק בהשקה!" בירוק כמו "חינם". סדר: fix6 ואז fix10.

## 2026-10-23 ~15:10 · חשבון ראשי · אותה שיחה
- מה: מודעה סבב 11 (premium_fix9.py, מחליף את fix8): שתי השורות מתחת למוטו גדולות יותר (×1.16/×1.12); הטלפון גדול ×1.13 (פינה ימנית עליונה קבועה, גדל שמאלה ולמטה, צל + הילה ירוקה דקה, "העתיד בכף ידך" ורשימת "היום שלי" נשארים מעליו); שורות ההורדה גדולות יותר (50/57px) עם קו צהוב זרחני; שתי השורות התחתונות גדולות יותר (×1.26/×1.3); מעבר רך (smoothstep) מ-y=1030 לצבע כהה אחיד בתחתית. סדר: fix6 ואז fix9. להחזרה: התמונה מהקומיט הקודם.

## 2026-10-23 ~15:00 · חשבון ראשי · אותה שיחה
- מה: מודעה סבב 10: "חינם" בירוק זרחני #39ff6a; שורות ההורדה גדולות יותר (44/51px), מילוי כחול זוהר אחיד #2dc4ff בלי הילה/צל, קו אדום דק נשאר. קובץ: premium_fix8.py, התמונה. להחזרה: התמונה מ-ba79630.

## 2026-10-23 ~14:55 · חשבון ראשי · אותה שיחה
- מה: תיקון טעות: במרכז החותמת "חינם" (לא "חיים"; במקור הפונט השבלוני נקרא בטעות). קובץ: premium_fix8.py, התמונה.

## 2026-10-23 ~14:50 · חשבון ראשי · שיחה "📌 MedTime – שיחה חדשה" (session_01VsxPbo6X9KYMbXyBhgnXSS)
- מה: מודעה סבב 9: החותמת העגולה הישנה נמחקה (רקע כהה אחיד עם מעבר רך) ונבנתה חדשה באותה צורה: טבעת חיצונית ופנימית, "הורדה לזמן מוגבל" בקשת למעלה משמאל, "חיים" גדול, "רק בהשקה!", 3 כוכבים; צבע דיו אחד #e81e3a, חד (צויר פי 4 והוקטן), נטוי 8°. שורת הכתובת הוגדלה (49px) והקו סביב האותיות דק וחד יותר (אדום 3px, כהה 1px).
- קבצים: media/ads/MedTime-ad-premium.png, media/ads/src/premium_fix8.py (מחליף את fix7). סדר: fix6 ואז fix8 (out, ddc63a0.png, fonts, final).
- להחזרה: התמונה מ-e65fa37.

## 2026-10-23 ~14:45 · חשבון ראשי · שיחה "📌 MedTime – שיחה חדשה" (session_01VsxPbo6X9KYMbXyBhgnXSS)
- מה: מודעת הפרימיום, סבב 8: חותמת ההורדה בוטלה (בלי ברקוד). למטה מימין: "להורדת האפליקציה:" + medtime.pages.dev בפונט מעוגל עבה (Fredoka 700) כחול עם קו אדום כמו הכותרת. החותמת העגולה בלי ההילה, עם קו ירוק דקיק סביב כל האותיות והצורות. החלק השחור למטה נכנס בהדרגה (מעבר רך מ-y=1096 עד 1184). הוסרה גם שארית הילה ירוקה בצד ימין למטה.
- קבצים: media/ads/MedTime-ad-premium.png, media/ads/src/premium_fix7.py (מחליף את fix5), premium_fix6.py. סדר: fix6 (cdddeed.png, out, ddc63a0.png) ואז fix7 (out, ddc63a0.png, fonts, final). גופנים: Fredoka/Rubik מ-app/src/main/assets/fonts הומרו ל-ttf.
- להחזרה: התמונה מ-fd08a47.

## 2026-10-23 ~14:35 · חשבון ראשי · שיחה "📌 MedTime – שיחה חדשה" (session_01VsxPbo6X9KYMbXyBhgnXSS)
- מה: מודעת הפרימיום, סבבים 5-7 (נבנית מתמונת סבב 1 cdddeed + המקור ddc63a0):
  1. premium_fix6.py: מסגרת הניאון הישנה נמחקה כולה (כולל ההילה), תיבת 22:00 שוחזרה, מסגרת כחולה #0fb8ff ברוחב 4px צמודה לקצה החיצוני.
  2. premium_fix5.py: חותמת ההורדה בפינה הימנית: "להורדת התוכנה" בירוק בולט, medtime.pages.dev בשורה אחת (לבן עם קו אדום), ברקוד 132px, הילה ירוקה דקה. אותיות החותמת העגולה קיבלו קו ירוק דקיק. שתי השורות התחתונות ירדו למטה וצמודות יותר (שורה 1 ×1.1, שורת השפות ×1.15).
  3. בטבעת של החותמת העגולה יש פערים קטנים במקום שהמסגרת הישנה עברה (נראה כמו חותמת שחוקה).
- קבצים: media/ads/MedTime-ad-premium.png, media/ads/src/premium_fix5.py, premium_fix6.py. סדר הרצה: fix6 (cdddeed.png, out, ddc63a0.png) ואז fix5 (out, ddc63a0.png, fonts, final).
- להחזרה: התמונה מ-61abc08.

## 2026-10-23 ~14:25 · חשבון ראשי · שיחה "📌 MedTime – שיחה חדשה" (session_01VsxPbo6X9KYMbXyBhgnXSS)
- מה: מודעת הפרימיום, סבבים 3+4:
  1. חותמת ההורדה עברה לפינה הימנית העליונה, מול החותמת האדומה. כתובת גדולה בשתי שורות (medtime / .pages.dev), טקסט לבן-זוהר עם קו ניאון אדום, בלי הטיה; הברקוד 124px (אותו ברקוד מהמקור).
  2. החותמת האדומה קיבלה זוהר ניאון.
  3. מסגרת הניאון הירוקה עם קפיצות האק"ג בוטלה לגמרי; במקומה מסגרת דקה פשוטה (3px, פינות מעוגלות) בקצה התמונה, בכחול של הכותרת MedTime (#0fb8ff), לא נוגעת בכלום.
  4. תיבת הסימון של 22:00 (נפגעה בסבב 1 ליד הנקודה הזוהרת) שוחזרה מהעתק של תיבת 18:00 מהמקור.
- קבצים: media/ads/MedTime-ad-premium.png, media/ads/src/premium_fix3.py (רץ על תמונת סבב 1, cdddeed), media/ads/src/premium_fix4.py (רץ על פלט fix3 + המקור ddc63a0).
- להחזרה: לקחת את התמונה מ-37ec640 (סבב 2) או cdddeed (סבב 1).

## 2026-10-23 ~14:15 · חשבון ראשי · שיחה "📌 MedTime – שיחה חדשה" (session_01VsxPbo6X9KYMbXyBhgnXSS)
- מה: מודעת הפרימיום, סבב 2 (עריכה על התמונה מסבב 1):
  1. הוסרו מלמטה כפתור הכתובת והברקוד, והוסר הכיתוב "6 שפות".
  2. שורת השפות הוגדלה פי 1.15, מורכזה והורדה למטה (פריסה מרווחת).
  3. מתחת לחותמת האדומה: חותמת ניאון אדומה-זרחנית "להורדת התוכנה" + medtime.pages.dev + אותו ברקוד בדיוק (נלקח מהתמונה המקורית), נטויה 4° כמו חותמת.
- קבצים: media/ads/MedTime-ad-premium.png, media/ads/src/premium_fix2.py (הרצה: premium_fix2.py <תמונת סבב 1> <תמונה מ-ddc63a0> <תיקיית גופני rubik ttf> <פלט>; הגופנים מ-app/src/main/assets/fonts הומרו מ-woff2 ל-ttf).
- להחזרה: לקחת את התמונה מה-commit של סבב 1 (cdddeed).

## 2026-10-23 ~14:05 · חשבון ראשי · שיחה "📌 MedTime – שיחה חדשה" (session_01VsxPbo6X9KYMbXyBhgnXSS)
- מה: מודעת הפרימיום. עריכה ישירה על התמונה הקיימת (מ-commit ddc63a0), בלי לבנות מחדש:
  1. מסגרת הניאון דקה יותר (קו מרכזי 2px + שוליים ירוקים 1px, הילה רכה; הקו העבה הישן נמחק).
  2. כפתור הכתובת medtime.pages.dev גדול פי 1.12 עם הילה זהובה; הברקוד עם הילה לבנה; שניהם מתחת לשורת השפות בלי לגעת בה.
  3. קו לבן סביב האותיות בשתי השורות התחתונות ("עוזר קולי..." ושורת השפות).
- קבצים: media/ads/MedTime-ad-premium.png (הוחלף), media/ads/src/premium_fix1.py (הסקריפט שעשה את זה, אפשר להריץ שוב על ddc63a0).
- להחזרה: לקחת את media/ads/MedTime-ad-premium.png מ-ddc63a0.
- הערה: קובץ העיצוב המקורי premium.html נבנה בחשבון השני ולא נשמר במאגר. אם הוא עדיין קיים שם, לשמור אותו ב-media/ads/src/.

## 2026-10-23 ~13:50 · חשבון ראשי · אותה שיחה
- מה: כללים חדשים ב-CLAUDE.md: AUTO NEW THREAD (שיחה חדשה אוטומטית ב~60% טוקנים), SIGNED LOG (היומן הזה).
- קבצים: CLAUDE.md. להחזרה: git revert d42be4b 1d5dac4.
