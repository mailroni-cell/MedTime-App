// MedTime · M-383 · 2026-10-27
// Signed: Claude · project "NOVA" · thread "להמשיך את SUPER NOVA אחרי פרסום 108" (Roni approved "MedTime on the TV").
// What: links MedTime on the phone to the SUPER NOVA TV app, so the TV shows the pill reminder over the picture
//       and "taken" on the TV reaches the phone. Cloudflare Pages Function + the same D1 database (free tier).
// Flow: TV {op:"new"} -> 6-digit code + TV key; phone {op:"link", code} -> phone key; phone {op:"push"} the alarm list;
//       TV {op:"pull"} reads it; TV {op:"taken"} adds an event; phone {op:"events"} reads them; {op:"unlink"} deletes.
// Stored: the code, hashes of the two random keys, the alarm list (times, days, pill names / doses) and the last
//       "taken" events. No name, phone number or device id. A code nobody linked is dropped after a day.
import { CORS, json } from '../../cf/db.js';

const MAX_SCHED = 20000;
const rnd = n => [...crypto.getRandomValues(new Uint8Array(n))].map(x => x.toString(16).padStart(2, '0')).join('');
async function kh(k) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('medtime-tv:' + k));
  return [...new Uint8Array(b)].slice(0, 16).map(x => x.toString(16).padStart(2, '0')).join('');
}
async function ready(db) {
  await db.prepare('CREATE TABLE IF NOT EXISTS tvlink (code TEXT PRIMARY KEY, tk TEXT, pk TEXT, sched TEXT, ev TEXT, t INTEGER)').run();
}

export const onRequestOptions = () => new Response(null, { headers: CORS });
export async function onRequestPost({ request, env }) {
  const db = env.DB || env['medtime-stats']; if (!db) return json({ ok: false, why: 'no-db' });
  let m; try { m = JSON.parse(await request.text()); } catch (e) { return json({ ok: false }, 400); }
  await ready(db);
  const now = Date.now();
  const op = String(m.op || '');
  if (op === 'new') {
    await db.prepare('DELETE FROM tvlink WHERE pk IS NULL AND t < ?1').bind(now - 864e5).run();
    const key = rnd(16);
    for (let i = 0; i < 8; i++) {
      const code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
      const r = await db.prepare('INSERT OR IGNORE INTO tvlink (code, tk, pk, sched, ev, t) VALUES (?1, ?2, NULL, NULL, ?3, ?4)')
        .bind(code, await kh(key), '[]', now).run();
      if (r.meta && r.meta.changes) return json({ ok: true, code, key });
    }
    return json({ ok: false, why: 'busy' }, 503);
  }
  if (op === 'link') {
    const code = String(m.code || '').replace(/\D/g, '');
    const row = await db.prepare('SELECT code FROM tvlink WHERE code = ?1 AND pk IS NULL AND t > ?2').bind(code, now - 864e5).first();
    if (!row) return json({ ok: false, why: 'code' });
    const key = rnd(16);
    await db.prepare('UPDATE tvlink SET pk = ?1, t = ?2 WHERE code = ?3').bind(await kh(key), now, code).run();
    return json({ ok: true, key });
  }
  const h = await kh(String(m.key || ''));
  if (op === 'push') {
    const s = JSON.stringify(m.sched || null);
    if (s.length > MAX_SCHED) return json({ ok: false, why: 'big' }, 413);
    const r = await db.prepare('UPDATE tvlink SET sched = ?1, t = ?2 WHERE pk = ?3').bind(s, now, h).run();
    return json({ ok: !!(r.meta && r.meta.changes) });
  }
  if (op === 'pull') {
    const row = await db.prepare('SELECT pk, sched FROM tvlink WHERE tk = ?1').bind(h).first();
    if (!row) return json({ ok: false, why: 'gone' });
    return json({ ok: true, linked: !!row.pk, sched: row.sched ? JSON.parse(row.sched) : null });
  }
  if (op === 'taken') {
    const row = await db.prepare('SELECT ev FROM tvlink WHERE tk = ?1').bind(h).first();
    if (!row) return json({ ok: false, why: 'gone' });
    let ev = []; try { ev = JSON.parse(row.ev || '[]'); } catch (e) { }
    ev.push({ id: parseInt(m.id) || 0, d: String(m.d || '').slice(0, 10), at: now });
    await db.prepare('UPDATE tvlink SET ev = ?1 WHERE tk = ?2').bind(JSON.stringify(ev.slice(-50)), h).run();
    return json({ ok: true });
  }
  if (op === 'events') {
    const row = await db.prepare('SELECT ev FROM tvlink WHERE pk = ?1').bind(h).first();
    if (!row) return json({ ok: false, why: 'gone' });
    return json({ ok: true, ev: JSON.parse(row.ev || '[]') });
  }
  if (op === 'unlink') {
    await db.prepare('DELETE FROM tvlink WHERE tk = ?1 OR pk = ?1').bind(h).run();
    return json({ ok: true });
  }
  return json({ ok: false }, 400);
}
