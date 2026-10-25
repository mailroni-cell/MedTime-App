# MedTime המלאה ב-Google Play - בדיקה פנימית (M-375)

כל מה שאפשר לעשות לבד כבר נעשה: הקוד, הבנייה, החתימה והבדיקה של הקובץ.
מה שנשאר זה רק לחיצות ב-Play Console. ל-Claude אין אפשרות ללחוץ בדפדפן, ואת יצירת האפליקציה גוגל לא מאפשרים לעשות מבחוץ.

## הקישורים
- הקובץ להעלאה (52 MB): https://github.com/mailroni-cell/MedTime-App/releases/download/play-full/MedTime-full-play.aab
- Play Console: https://play.google.com/console/u/0/developers
- מדיניות פרטיות (להדבקה): https://medtime.pages.dev/privacy.html
- כתובת האפליקציה (נוצרת מהקובץ, לא מקלידים): io.github.mailronicell.medtime.full

## שלב 1: ליצור את האפליקציה (2 דקות)
1. פותחים https://play.google.com/console/u/0/developers
2. כפתור כחול למעלה מימין: **Create app**
3. App name: `MedTime` | Default language: `Hebrew – iw-IL` | App or game: **App** | Free or paid: **Free**
4. מסמנים את שתי ההצהרות (Developer Program Policies, US export laws) ← **Create app**

## שלב 2: רשימת בודקים והעלאה (5 דקות)
1. בתפריט מימין: **Test and release ← Testing ← Internal testing**
2. לשונית **Testers** ← **Create email list** ← שם: `MedTime testers` ← מדביקים מיילים (מופרדים בפסיק) ← **Save changes**. מסמנים V ליד הרשימה ← **Save**.
3. לשונית **Releases** (או הכפתור **Create new release**)
4. אם נשאלים על Play App Signing: **Use Google-generated key** (ברירת המחדל) ← Continue
5. גוררים את הקובץ MedTime-full-play.aab לתיבה ← מחכים שיעלה
6. Release name נכתב לבד (101 (1.0.1)) ← **Next** ← **Save** ← **Go to overview / Start rollout to Internal testing** ← Rollout
7. חוזרים ללשונית **Testers** ← למטה **Copy link** ← שולחים לבודקים בוואטסאפ

הבודק: פותח את הקישור בטלפון ← **Accept invite** ← **Download it on Google Play** ← Install.
(הבודק צריך להיות מחובר בטלפון לאותו חשבון Google שהמייל שלו ברשימה.)

## שלב 3: אם גוגל עוצרים ומבקשים "App content" - התשובות המוכנות
בתפריט: **Policy and programs ← App content** (או Dashboard ← "Set up your app"). לכל סעיף **Start**:

| סעיף | מה לבחור |
|---|---|
| Privacy policy | https://medtime.pages.dev/privacy.html |
| App access | All functionality is available without special access |
| Ads | No, my app does not contain ads |
| Content rating | Email: שלך · Category: **All other app types** · כל השאלות **No** · Save ← Submit |
| Target audience | **18 and over** בלבד · Appeal to children: **No** |
| News app | No |
| Data safety | ראו למטה |
| Government apps | No |
| Financial features | My app doesn't provide any financial features |
| Health | מסמנים **Medication and treatment management** (זה מה שהאפליקציה עושה, לא מצהירים אחרת) |
| Advertising ID | No |

### Data safety
1. Does your app collect or share any of the required user data types? **Yes**
2. Is all of the user data encrypted in transit? **Yes**
3. Account creation: **My app does not allow users to create an account**
4. Data deletion URL: אפשר להשאיר ריק / Users can't request deletion (אין חשבון; המידע אנונימי)
5. סוגי מידע: **Device or other IDs** בלבד (מספר אקראי להתקנה + גרסה ושפה)
   - Collected: Yes · Shared: No · Processed ephemerally: No · Required: Yes · Purpose: **Analytics**
6. כל השאר (תרופות, תמונות, מיקום, בן משפחה) **נשאר בטלפון ולא נשלח**, ולכן לא מסמנים אותם.
7. Next ← Save

## מה חשוב לדעת
- הסיכון: גוגל דחו את MedTime ב-21.10 כי אפליקציית תרופות מחשבון פרטי. בבדיקה פנימית בדרך כלל אין בדיקה מוקדמת, אבל אם יבדקו ויחסמו, זה לא נוגע ב-MyTime.
- מי שיש לו כבר MedTime מההורדה הרגילה: הגרסה מגוגל תותקן לידה כאפליקציה שנייה (המידע לא עובר ביניהן).
- גרסה חדשה לגוגל: Claude מריץ את workflow "MedTime full - Google Play internal testing bundle (AAB)" והקובץ מתעדכן באותו קישור. מעלים אותו ב-Internal testing ← Create new release, והבודקים מקבלים עדכון אוטומטי.
