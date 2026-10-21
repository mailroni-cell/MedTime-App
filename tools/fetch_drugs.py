# S-01: downloads the Israeli Ministry of Health drug registry (runs in GitHub Actions, the cloud editor cannot reach it).
# Output in data-cache/: drugs_probe.json (raw samples, to learn the format), drugs.json (compact list), drugs_log.json.
import json, os, urllib.request, urllib.parse, time, itertools, string
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
    HOME = 'https://registries.health.gov.il/Medicines'
    home = gett(HOME)
    probe['home_head'] = home[:3000]
    found = {}
    for src in re.findall(r'src="([^"]+[.]js)"', home):
        u = src if src.startswith('http') else urllib.parse.urljoin('https://registries.health.gov.il/', src)
        try:
            js = gett(u); found[u] = len(js)
            if 'main' in src:
                allj = js
                for cid, h in re.findall(r'(\d+):"([0-9a-f]{16})"', js):
                    try:
                        allj += '\n//CHUNK ' + cid + '\n' + gett(f'https://registries.health.gov.il/{cid}.{h}.js')
                    except Exception as e:
                        found[cid] = str(e)
                open('data-cache/drugs_main.js', 'w', encoding='utf-8').write(allj)
        except Exception as e:
            found[u] = str(e)
    probe['scripts'] = found
    for u in ['https://registries.health.gov.il/assets/config.prod.json', 'https://registries.health.gov.il/assets/data/menuItems.v3.json']:
        try:
            probe[u] = gett(u)[:6000]
        except Exception as e:
            probe[u] = str(e)
    # the Medicines screen is a separate bundle: find its remoteEntry and save all its code
    for u in ['https://registries.health.gov.il/api/Registries/GetAllRegistries', 'https://registries.health.gov.il/api/Registries/GetAllSubMenus']:
        try:
            probe[u] = gett(u)[:8000]
        except Exception as e:
            probe[u] = str(e)
    cfg = probe.get('https://registries.health.gov.il/api/Registries/GetAllRegistries', '')
    m = re.search(r'"Medicines"\s*:\s*(?:\{[^}]*?"remoteEntry"\s*:\s*)?"([^"]+)"', cfg) or re.search(r'([^"]*[Mm]edicines[^"]*remoteEntry[^"]*)', cfg)
    if m:
        re_url = urllib.parse.urljoin('https://registries.health.gov.il/', m.group(1)); probe['med_remote'] = re_url
        base = re_url.rsplit('/', 1)[0] + '/'
        code = gett(re_url)
        for cid, h in re.findall(r'(\d+):"([0-9a-f]{16,20})"', code):
            try:
                code += '\n//CHUNK ' + cid + '\n' + gett(f'{base}{cid}.{h}.js')
            except Exception as e:
                found['med' + cid] = str(e)
        open('data-cache/drugs_med.js', 'w', encoding='utf-8').write(code)
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
# 3) full download through the registry's own API (GetMedicines, the same call its "export to Excel" uses)
import gzip
try:
    cfgm = json.loads(gett('https://registries.health.gov.il/Medicines/assets/medicines/config.prod.json'))
    api = urllib.parse.urljoin('https://registries.health.gov.il/', cfgm['moh-package']['medicinesApiUrl']); log['api'] = api
    allm, seen, page, total = [], set(), 0, None
    while page < 60:
        d = call(api + 'GetMedicines', {'sortBy': 'tradeNameHeb', 'sortDirection': 'asc', 'maxResult': 1000, 'pageNumber': page})
        ro = d.get('returnObject') or {}
        meds = ro.get('medicinesList') or []
        total = ro.get('totalRows'); log['total'] = total
        new = [m for m in meds if m.get('medicineId') not in seen]
        seen.update(m.get('medicineId') for m in new); allm += new
        if not new or (total and len(allm) >= total): break
        page += 1
    log['pages'] = page + 1
    # compact list for the app: human medicines that are not cancelled
    def num(x): return ' '.join((x or '').split())
    comp = []
    for m in allm:
        if m.get('veterinaryUse') == 'כן' or m.get('canceled') == 'כן':
            continue
        comp.append({'h': num(m.get('tradeNameHeb')), 'e': num(m.get('tradeName')),
                     'f': num(m.get('dosageFormHeb')), 'fe': num(m.get('dosageFormE')),
                     'a': [[c.get('componentCode'), num(c.get('componentDesc')), num(c.get('dosage'))] for c in (m.get('components') or [])],
                     'b': sorted({p.get('barkod').strip() for p in (m.get('packages') or []) if (p.get('barkod') or '').strip()}),
                     'k': 1 if m.get('basket') == 'כן' else 0})
    log['app_count'] = len(comp)
    json.dump(comp, open('data-cache/drugs_app.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    log['count'] = len(allm)
    with gzip.open('data-cache/drugs_raw.json.gz', 'wt', encoding='utf-8') as f:
        json.dump(allm, f, ensure_ascii=False)
    json.dump(allm[:3], open('data-cache/drugs_raw_sample.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
except Exception as e:
    log['crawl_err'] = repr(e)
json.dump(log, open('data-cache/drugs_log.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(log)
