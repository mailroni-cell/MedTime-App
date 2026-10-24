<!-- חתימה: חשבון 1 · פרויקט TELEGRAM_BOT, thread "להפיץ את MedTime בלי אזהרות התקנה" · 2026-10-24 · M-370 · הוראות העלאה ל-Uptodown -->
# איך מעלים את MedTime ל-Uptodown (צעד אחר צעד)

זה בחינם. לוקח בערך 20 דקות. את הרשמה עושים רק אתה (Claude לא יכול להירשם בשמך).
כל הקבצים במאגר בתיקייה `media/store/uptodown/` (במחשב: `C:\Projects\MedTime\` אחרי סנכרון, או להוריד מ-GitHub).

## לפני שמתחילים: מורידים 2 דברים למחשב
1. ה-APK העדכני (גרסה 244, 44 MB): https://github.com/mailroni-cell/MedTime-App/releases/download/latest/MedTime-latest.apk
2. התמונות: https://github.com/mailroni-cell/MedTime-App/tree/main/media/store/uptodown/images
   (לוחצים על כל קובץ, ואז על כפתור ההורדה ⬇️ מימין למעלה)

## שלב 1: נרשמים כמפתח
1. נכנסים ל-https://www.uptodown.dev
2. לוחצים **Sign up** (או **Log in**) ובוחרים **Continue with Google**, עם המייל שלך.
3. ממלאים שם מפתח: `Roni` (או השם שתרצה שיופיע), מדינה: Israel. מאשרים את התנאים.

## שלב 2: מוסיפים את האפליקציה
1. בתפריט משמאל: **Apps** ← **Add new app**.
2. בוחרים **Android** ומעלים את הקובץ `MedTime-latest.apk`. מחכים שהעלאה תסתיים (כמה דקות).
3. **General information**:
   - Icon: `icon-512.png`
   - Name: `MedTime`
   - Category: Health (בריאות)
   - Package name: מתמלא לבד (`com.medtime.app`)
   - Official website: `https://medtime.pages.dev`
   - PEGI: 3
   - Country restrictions: בלי (כל העולם)
   - Author: `Roni`
4. **Images**:
   - Featured image: `feature-1024x500-en.jpg`
   - Screenshots: `screenshot-1-en.jpg`, `screenshot-2-en.jpg`, `screenshot-3-en.jpg`
     (צילומים באנגלית מוצגים בכל השפות. אם יש אפשרות להוסיף לכל שפה, מוסיפים גם את הקבצים עם he / ar / ro / fr / ru)
5. **Descriptions**: לכל שפה מעתיקים מהקובץ `texts.md` את ה-Short ואת ה-Description.
   מתחילים ב-English, ואז מוסיפים שפה (**Add language**): עברית, ערבית, רומנית, צרפתית, רוסית.
6. **Version details**: המספר מתמלא לבד (1.0.244). Development stage: **Stable**. Changelog: מעתיקים מסוף `texts.md`.
7. **Distribution**: Free · IAP: No · Subscription: No · Ads: No · License: Proprietary.
8. לוחצים **Submit for review**.

## שלב 3: מחכים לאישור
- Uptodown בודקים ומפרסמים, בדרך כלל תוך יום-יומיים. מגיע מייל.
- אחרי האישור שולחים לי את הקישור לדף (נראה בערך כך: `https://medtime.en.uptodown.com/android`), ואני מוסיף כפתור "הורדה מ-Uptodown" לדף ההורדה ולהודעת השיתוף.

## עדכונים בעתיד
- כל פעם שאתה אומר "משחררים לכולם", אני מזכיר לך: Developers Console ← Apps ← MedTime ← **Upload new version** ← מעלים את ה-APK החדש מאותו קישור.
- מי שכבר התקין ממשיך לקבל עדכונים בתוך האפליקציה כמו היום.

## חשוב לדעת
- Uptodown לא מעלימה את האזהרות של אנדרואיד. בהתקנה הראשונה של אפליקציית Uptodown הטלפון ישאל "לאפשר התקנה". היתרון: חנות מוכרת עם 100 מיליון משתמשים, ככה אנשים סומכים יותר וממשיכים להתקין.
- רק Google Play מתקינה בלי אזהרות. בשביל MedTime היא דורשת חשבון ארגון, ורוני החליט לא לפתוח עסק (2026-10-24). גרסת MyTime (תזכורות כלליות) ב-Play מטופלת בשיחה אחרת.
