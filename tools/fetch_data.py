# Step 1: discover which data.gov.il datasets exist (search), save a short summary.
import json, os, urllib.request, urllib.parse
os.makedirs('data-cache', exist_ok=True)
H = {'User-Agent': 'Mozilla/5.0 (MedTime data fetch)'}
def get(url):
    req = urllib.request.Request(url, headers=H)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()
out = {}
for q in ['רחובות', 'ישובים', 'מרפאות', 'קופות חולים', 'כללית', 'מכבי', 'מאוחדת', 'לאומית', 'מוסדות רפואיים', 'streets']:
    try:
        d = json.loads(get('https://data.gov.il/api/3/action/package_search?rows=15&q=' + urllib.parse.quote(q)))
        out[q] = [{'name': p['name'], 'title': p['title'], 'org': (p.get('organization') or {}).get('title'),
                   'res': [{'id': r['id'], 'name': r.get('name'), 'fmt': r.get('format'), 'url': r.get('url')} for r in p['resources']]}
                  for p in d['result']['results']]
    except Exception as e:
        out[q] = 'ERROR ' + repr(e)
json.dump(out, open('data-cache/search.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False)[:3000])
