# MedTime: איך ממשיכים מחשבון Claude אחר

כל מה ש-Claude צריך נמצא במאגר הזה ב-GitHub. כל חשבון שמחובר אליו רואה בדיוק את אותו הדבר.

## מה יש כאן
1. `CLAUDE.md`: כל החוקים (עברית בלבד, 5 שפות, ערוץ test מול latest, "משחררים לכולם" ועוד).
2. `STATE.md`: איפה אנחנו עומדים.
3. `CHANGES.md`: כל שינוי מ-M-001 עד היום, עם סטטוס.
4. `SESSIONS.md`: יומן השיחות.
5. `handoff/project-memory.md`: הזיכרון של הפרויקט (מה Claude למד על העבודה איתך). הועתק באישור רוני ב-2026-10-20.
6. `handoff/run_watcher.cmd` ו-`tools/medtime_autoinstall.ps1`: המתקין האוטומטי במחשב.
7. `handoff/*.png`: דוגמאות הפונטים והאייקונים שבחרת מהן.

## צעדים בחשבון השני
1. נכנסים ל-claude.ai עם החשבון השני.
2. מחברים את GitHub של mailroni-cell: https://claude.ai/connect-github
3. פותחים Claude Code או פרויקט חדש, ובוחרים את המאגר `mailroni-cell/MedTime-App`.
4. באפליקציית Claude במחשב, בחשבון השני, מאשרים גישה לתיקייה `C:\Users\Roni\Downloads\MedTime` (כדי לקרוא את install_log.txt).
5. מדביקים את ההודעה שבתיבה למטה.

## ההודעה להדבקה
```
ממשיכים את פרויקט MedTime בדיוק מהנקודה שעצרנו. עונים רק בעברית.
המאגר: github.com/mailroni-cell/MedTime-App (main).
קודם כול קרא את CLAUDE.md, STATE.md, CHANGES.md ו-handoff/project-memory.md, ופעל לפיהם בדיוק.
כל בנייה הולכת רק לגרסה test (הטלפון שלי). המתקין במחשב מוריד ומתקין לבד. היומן נמצא ב-C:\Users\Roni\Downloads\MedTime\install_log.txt.
כל שינוי בעברית חל על כל 5 השפות.
```

## מה לא עובר
- היסטוריית הצ'אט עצמה לא עוברת בין חשבונות. כל מה שחשוב ממנה כתוב בקבצים שלמעלה.
- כדאי לעבוד בכל פעם מחשבון אחד בלבד, כדי ששתי בניות לא ידרסו זו את זו בטלפון.
