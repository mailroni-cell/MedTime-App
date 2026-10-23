// M-327: private, reliable usage counts on Cloudflare (Pages Functions + D1, free tier), replacing ntfy.sh step by step.
// Needs a D1 database bound to the Pages project as "DB" (Settings > Bindings); owner bound "medtime-stats" on 2026-10-23. Without it the endpoints answer {ok:false} and change nothing.
// Stored: per-day counters and, per install, a hash of the random install id with first/last day, version and language. Nothing personal.
export const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
export const json = (o, s) => new Response(JSON.stringify(o), { status: s || 200, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, CORS) });
export const day = () => new Date().toISOString().slice(0, 10);
export async function ready(db) {
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS counts (day TEXT, k TEXT, n INTEGER, PRIMARY KEY (day, k))'),
    db.prepare('CREATE TABLE IF NOT EXISTS installs (h TEXT PRIMARY KEY, first TEXT, last TEXT, v TEXT, l TEXT)'),
    db.prepare('CREATE TABLE IF NOT EXISTS stars (day TEXT, n INTEGER, improve TEXT)')
  ]);
}
export async function hash(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('medtime:' + s));
  return [...new Uint8Array(b)].slice(0, 8).map(x => x.toString(16).padStart(2, '0')).join('');
}
