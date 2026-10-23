import { json, ready } from '../../cf/db.js';
// Aggregates only. "Removed (estimate)": installs not seen for 14+ days (Android never tells an app it was removed).
export async function onRequestGet({ env }) {
  const DB = env.DB || env['medtime-stats']; if (!DB) return json({ ok: false, why: 'no-db' });
  const db = DB; await ready(db);
  const ago = n => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  const one = async (q, ...b) => (await db.prepare(q).bind(...b).first()) || {};
  const all = async (q, ...b) => (await db.prepare(q).bind(...b).all()).results || [];
  const sum = async k => (await one('SELECT COALESCE(SUM(n),0) AS n FROM counts WHERE k = ?1', k)).n;
  const days = await all('SELECT day, k, n FROM counts WHERE day >= ?1 ORDER BY day', ago(30));
  const by = {}; days.forEach(r => { (by[r.day] = by[r.day] || {})[r.k] = r.n; });
  const s = {
    ok: true, updated: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
    visits: await sum('visit'), ad_views: await sum('adview'), downloads: await sum('dl'),
    downloads_by_source: { fast: await sum('dl_fast'), gh: await sum('dl_gh'), drive: await sum('dl_drive') },
    installs: (await one('SELECT COUNT(*) AS n FROM installs')).n,
    active_7d: (await one('SELECT COUNT(*) AS n FROM installs WHERE last >= ?1', ago(6))).n,
    active_30d: (await one('SELECT COUNT(*) AS n FROM installs WHERE last >= ?1', ago(29))).n,
    removed_est: (await one('SELECT COUNT(*) AS n FROM installs WHERE last < ?1', ago(14))).n,
    shares: await sum('share'),
    by_version: Object.fromEntries((await all('SELECT v, COUNT(*) AS n FROM installs WHERE last >= ?1 GROUP BY v ORDER BY n DESC', ago(6))).map(r => [r.v, r.n])),
    by_language: Object.fromEntries((await all('SELECT l, COUNT(*) AS n FROM installs WHERE last >= ?1 GROUP BY l ORDER BY n DESC', ago(6))).map(r => [r.l, r.n])),
    stars_avg: (await one('SELECT ROUND(AVG(n),2) AS a, COUNT(*) AS c FROM stars')).a, surveys: (await one('SELECT COUNT(*) AS c FROM stars')).c,
    by_day: by
  };
  return json(s);
}
