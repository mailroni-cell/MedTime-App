# S-01: downloads the Israeli Ministry of Health drug registry (runs in GitHub Actions, the cloud editor cannot reach it).
# Output in data-cache/: drugs_probe.json (raw samples, to learn the format), drugs.json (compact list), drugs_log.json.
import json, os, urllib.request, time, itertools, string
os.makedirs('data-cache', exist_ok=True)
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36', 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*', 'Origin': 'https://israeldrugs.health.gov.il', 'Referer': 'https://israeldrugs.health.gov.il/', 'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8'}
BASE = 'https://israeldrugs.health.gov.il/GovServiceList/IDRServer/'
log, probe = {}, {}
def call(url, body=None):
    data = json.dumps(body).encode() if body is not None else None
    for k in range(4):
        try:
            req = urllib.request.Request(url, data=data, headers=H, method='POST' if data else 'GET')
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())
        except Exception as e:
            err = e; time.sleep(2 + k * 3)
    raise err
# 1) open-data catalogue: is there a ready dataset?
try:
    d = call('https://data.gov.il/api/3/action/package_search?q=%D7%AA%D7%A8%D7%95%D7%A4%D7%95%D7%AA&rows=20')
    probe['datagov'] = [{'name': p.get('name'), 'title': p.get('title'), 'res': [(r.get('id'), r.get('name'), r.get('format')) for r in p.get('resources', [])]} for p in d['result']['results']]
except Exception as e:
    probe['datagov_err'] = str(e)
# 2b) can we reach the site at all? (403 = blocked outside Israel)
for u in ['https://israeldrugs.health.gov.il/', 'https://www.health.gov.il/']:
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': H['User-Agent']}), timeout=30) as r:
            probe['home_' + u] = r.status
    except Exception as e:
        probe['home_' + u] = str(e)
# 2c) learn the real API addresses from the site's own scripts
import re
try:
    def gett(u):
        with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': H['User-Agent']}), timeout=60) as r:
            return r.read().decode('utf-8', 'replace')
    home = gett('https://israeldrugs.health.gov.il/')
    probe['home_head'] = home[:3000]
    found = {}
    for src in re.findall(r'src="([^"]+\.js)"', home):
        u = src if src.startswith('http') else 'https://israeldrugs.health.gov.il/' + src.lstrip('/')
        try:
            js = gett(u)
            found[u] = sorted(set(re.findall(r'[\w/.:-]*(?:IDRServer|GovServiceList|api)[\w/.:-]*', js)))[:80]
            found[u + '#ctx'] = [js[max(0, m.start() - 200): m.start() + 300] for m in re.finditer(r'SearchByName|searchByName', js)][:4]
        except Exception as e:
            found[u] = str(e)
    probe['scripts'] = found
except Exception as e:
    probe['scripts_err'] = str(e)
# 2) registry search API sample
def search(val, page=1):
    return call(BASE + 'SearchByName', {'val': val, 'prescription': False, 'healthServices': False, 'pageIndex': page, 'orderBy': 0})
try:
    s = search('acamol'); probe['search_acamol'] = s
except Exception as e:
    probe['search_err'] = str(e)
json.dump(probe, open('data-cache/drugs_probe.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
# 3) full crawl by two-letter prefixes (deduplicated by registration number)
def results(d):
    return d.get('results') or d.get('Results') or []
drugs = {}
if os.environ.get('CRAWL') == '1' and 'search_acamol' in probe and results(probe['search_acamol']):
    t0 = time.time()
    for a, b in itertools.product(string.ascii_lowercase, repeat=2):
        page = 1
        while page <= 40:
            try:
                d = search(a + b, page)
            except Exception as e:
                log.setdefault('errors', []).append(f'{a}{b}:{page}:{e}'); break
            rs = results(d)
            for r in rs:
                key = r.get('dragRegNum') or r.get('dragEnName')
                if key and key not in drugs:
                    drugs[key] = r
            if len(rs) == 0 or page >= (d.get('pages') or d.get('totalPages') or 1):
                break
            page += 1
        if time.time() - t0 > 3 * 3600: break
    def comp(r):
        ac = r.get('activeComponents') or []
        return {'r': r.get('dragRegNum'), 'h': r.get('dragHebName'), 'e': r.get('dragEnName'),
                'f': r.get('dosageForm'), 'fe': r.get('dosageFormEng'),
                'a': [[c.get('componentName'), c.get('dosage')] for c in ac],
                'b': r.get('barcodes')}
    json.dump([comp(r) for r in drugs.values()], open('data-cache/drugs.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    json.dump(list(drugs.values())[:5], open('data-cache/drugs_raw_sample.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
log['count'] = len(drugs)
json.dump(log, open('data-cache/drugs_log.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('drugs:', len(drugs))
