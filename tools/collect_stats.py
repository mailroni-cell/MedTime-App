# M-238: collect the app's anonymous usage messages from ntfy.sh into docs/stats/ (run by stats.yml).
# Stored: a hash of the random install id, version, language, first/last day; share count; survey stars and choices.
# Survey free text is NOT stored here (the repo is public); it only goes to the owner's survey topic.
import json, hashlib, os, urllib.request, datetime, collections
TOPIC = 'medtime-v3tqzebpancz9djidfg7bh'
D = 'docs/stats'
os.makedirs(D, exist_ok=True)
def load(n, d):
    try: return json.load(open(os.path.join(D, n)))
    except Exception: return d
state = load('state.json', {'since': 'all'})
ids = load('ids.json', {})
surveys = load('surveys.json', [])
shares = load('shares.json', {})
daily = load('daily.json', {})
dls = load('downloads.json', {})  # M-315: day -> {"visit": n, "fast": n, "gh": n, "drive": n} from the download page  # day -> list of id hashes seen that day (daily active users)
url = 'https://ntfy.sh/%s/json?poll=1&since=%s' % (TOPIC, state['since'])
raw = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'medtime-stats'}), timeout=60).read().decode()
n = 0
for line in raw.splitlines():
    try: ev = json.loads(line)
    except Exception: continue
    if ev.get('event') != 'message': continue
    state['since'] = ev['id']
    try: m = json.loads(ev.get('message', ''))
    except Exception: continue
    day = datetime.datetime.utcfromtimestamp(ev.get('time', 0)).strftime('%Y-%m-%d')
    if m.get('kind') in ('visit', 'dl'):  # download page: counted, no install id
        k2 = 'visit' if m['kind'] == 'visit' else (str(m.get('src', '')) if m.get('src') in ('fast', 'gh', 'drive') else 'gh')
        c = dls.setdefault(day, {}); c[k2] = c.get(k2, 0) + 1; n += 1
        continue
    h = hashlib.sha256(str(m.get('id', '')).encode()).hexdigest()[:16]
    r = ids.setdefault(h, {'first': day})
    r.update({'last': day, 'v': str(m.get('ver', ''))[:8], 'l': str(m.get('lang', ''))[:3]})
    dl = daily.setdefault(day, [])
    if h not in dl: dl.append(h)
    k = m.get('kind')
    if k == 'share': shares[day] = shares.get(day, 0) + 1
    if k == 'survey':
        try: st = max(0, min(5, int(m.get('stars', 0))))
        except Exception: st = 0
        surveys.append({'d': day, 'stars': st, 'improve': str(m.get('improve', ''))[:120], 'l': r['l'], 'v': r['v']})
    n += 1
today = datetime.date.today()
def within(d, days): return (today - datetime.date.fromisoformat(d)).days < days
act7 = [r for r in ids.values() if within(r['last'], 7)]
act30 = [r for r in ids.values() if within(r['last'], 30)]
imp = collections.Counter(x.strip() for s in surveys for x in s['improve'].split(',') if x.strip())
summary = {
    'updated': datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC'),
    'installs_total': len(ids), 'active_7d': len(act7), 'active_30d': len(act30),
    'active_7d_by_version': dict(collections.Counter(r['v'] for r in act7).most_common()),
    'active_7d_by_language': dict(collections.Counter(r['l'] for r in act7).most_common()),
    'new_installs_by_day': dict(sorted(collections.Counter(r['first'] for r in ids.values()).items())[-30:]),
    'active_by_day': {d: len(v) for d, v in sorted(daily.items())[-30:]},
    'shares_total': sum(shares.values()), 'shares_by_day': dict(sorted(shares.items())[-30:]),
    'surveys': len(surveys), 'stars_avg': round(sum(s['stars'] for s in surveys) / len(surveys), 2) if surveys else None,
    'stars_count': dict(sorted(collections.Counter(s['stars'] for s in surveys).items())),
    'improve': dict(imp.most_common()),
    'visits_total': sum(c.get('visit', 0) for c in dls.values()),
    'downloads_total': sum(v for c in dls.values() for k, v in c.items() if k != 'visit'),
    'downloads_by_source': dict(collections.Counter({k: sum(c.get(k, 0) for c in dls.values()) for k in ('fast', 'gh', 'drive')})),
    'downloads_by_day': {d: sum(v for k, v in c.items() if k != 'visit') for d, c in sorted(dls.items())[-30:]},
    'visits_by_day': {d: c.get('visit', 0) for d, c in sorted(dls.items())[-30:]},
}
daily = dict(sorted(daily.items())[-40:])
for name, obj in [('daily.json', daily), ('state.json', state), ('ids.json', ids), ('surveys.json', surveys), ('shares.json', shares), ('downloads.json', dls), ('summary.json', summary)]:
    json.dump(obj, open(os.path.join(D, name), 'w'), ensure_ascii=False, indent=1)
print('messages', n, 'installs', len(ids), 'active7', len(act7))
