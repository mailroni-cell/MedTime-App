import { CORS, json, day, ready, hash } from '../../cf/db.js';
const KINDS = new Set(['visit', 'dl', 'ping', 'share', 'survey', 'adview']);
const SRC = new Set(['fast', 'gh', 'drive']);
export const onRequestOptions = () => new Response(null, { headers: CORS });
export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false, why: 'no-db' });
  let m; try { m = JSON.parse(await request.text()); } catch (e) { return json({ ok: false }, 400); }
  const k = String(m.kind || ''); if (!KINDS.has(k)) return json({ ok: false }, 400);
  const d = day(), db = env.DB; await ready(db);
  const inc = key => db.prepare('INSERT INTO counts (day, k, n) VALUES (?1, ?2, 1) ON CONFLICT(day, k) DO UPDATE SET n = n + 1').bind(d, key);
  const ops = [];
  if (k === 'visit' || k === 'adview' || k === 'share') ops.push(inc(k));
  else if (k === 'dl') ops.push(inc('dl'), inc('dl_' + (SRC.has(m.src) ? m.src : 'gh')));
  else {
    const id = String(m.id || '').slice(0, 40); if (id.length < 6) return json({ ok: false }, 400);
    const h = await hash(id), v = String(m.ver || '').slice(0, 8), l = String(m.lang || '').slice(0, 3);
    const old = await db.prepare('SELECT last FROM installs WHERE h = ?1').bind(h).first();
    if (!old) ops.push(inc('new'));
    if (!old || old.last !== d) ops.push(inc('active'));
    ops.push(db.prepare('INSERT INTO installs (h, first, last, v, l) VALUES (?1, ?2, ?2, ?3, ?4) ON CONFLICT(h) DO UPDATE SET last = ?2, v = COALESCE(NULLIF(?3, \'\'), v), l = COALESCE(NULLIF(?4, \'\'), l)').bind(h, d, v, l));
    if (k === 'survey') ops.push(db.prepare('INSERT INTO stars (day, n, improve) VALUES (?1, ?2, ?3)').bind(d, Math.max(0, Math.min(5, parseInt(m.stars) || 0)), String(m.improve || '').slice(0, 120)));
  }
  await db.batch(ops);
  return json({ ok: true });
}
