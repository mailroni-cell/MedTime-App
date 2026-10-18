# Downloads open data from data.gov.il (runs in GitHub Actions, the cloud editor cannot reach it).
# Output in data-cache/: streets.json, cities.json, search2.json, samples.
import json, os, urllib.request, urllib.parse, time
os.makedirs('data-cache', exist_ok=True)
H = {'User-Agent': 'Mozilla/5.0 (MedTime data fetch)'}
def get(url):
    for k in range(4):
        try:
            req = urllib.request.Request(url, headers=H)
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except Exception as e:
            err = e; time.sleep(3)
    raise err
def ds(resource, extra=''):
    rows, off = [], 0
    while True:
        d = json.loads(get(f'https://data.gov.il/api/3/action/datastore_search?resource_id={resource}&limit=32000&offset={off}{extra}'))
        rec = d['result']['records']; rows += rec
        if len(rec) < 32000: break
        off += 32000
    return rows
log = {}
for name, rid in [('streets', '9ad3862c-8391-4b2f-84a4-2d4c68625f4b'),
                  ('cities', '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba'),
                  ('cities_multi', 'e9701dcb-9f1c-43bb-bd44-eb380ade542f')]:
    try:
        rows = ds(rid)
        json.dump(rows, open(f'data-cache/{name}.json', 'w', encoding='utf-8'), ensure_ascii=False)
        log[name] = {'rows': len(rows), 'sample': rows[:3]}
    except Exception as e:
        log[name] = 'ERROR ' + repr(e)
out = {}
for q in ['בתי חולים', 'בית חולים', 'hospitals', 'מוקדים רפואיים', 'מרכז רפואי', 'טיפת חלב', 'משרד הבריאות']:
    try:
        d = json.loads(get('https://data.gov.il/api/3/action/package_search?rows=12&q=' + urllib.parse.quote(q)))
        out[q] = [{'name': p['name'], 'title': p['title'], 'org': (p.get('organization') or {}).get('title'),
                   'res': [{'id': r['id'], 'name': r.get('name'), 'fmt': r.get('format')} for r in p['resources']][:4]}
                  for p in d['result']['results']]
    except Exception as e:
        out[q] = 'ERROR ' + repr(e)
log['search'] = out
json.dump(log, open('data-cache/log.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
