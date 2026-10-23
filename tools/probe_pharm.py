# M-299: how good is OpenStreetMap for pharmacies in Israel (names, phones, opening hours)? Runs in GitHub Actions
import json, urllib.request, urllib.parse, os, collections
q = '[out:json][timeout:120];area["ISO3166-1"="IL"][admin_level=2]->.a;(node["amenity"="pharmacy"](area.a);way["amenity"="pharmacy"](area.a););out center tags;'
out = {}
for url in ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']:
    try:
        req = urllib.request.Request(url, data=urllib.parse.urlencode({'data': q}).encode(), headers={'User-Agent': 'MedTime-probe/1.0'})
        d = json.loads(urllib.request.urlopen(req, timeout=180).read().decode()); out['url'] = url; break
    except Exception as e: out.setdefault('err', []).append(url + ' ' + str(e)[:200])
el = d.get('elements', []) if 'url' in out else []
tags = [e.get('tags', {}) for e in el]
out['count'] = len(el)
for k in ['name', 'name:he', 'opening_hours', 'phone', 'contact:phone', 'addr:street', 'addr:city', 'dispensing', 'brand']:
    out['has_' + k] = sum(1 for t in tags if t.get(k))
out['oh_samples'] = collections.Counter(t['opening_hours'] for t in tags if t.get('opening_hours')).most_common(40)
out['samples'] = tags[:15]
os.makedirs('data-cache', exist_ok=True)
json.dump(out, open('data-cache/pharm_probe.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False)[:3000])
