# M-285: can a medicine be found by the barcode on its box? Probe the Ministry of Health registry (runs in GitHub Actions)
import json, re, urllib.request, urllib.parse, os
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36', 'Accept': 'application/json, */*', 'Origin': 'https://registries.health.gov.il', 'Referer': 'https://registries.health.gov.il/Medicines'}
def get(u, body=None, params=None):
    if params: u += '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(u, data=json.dumps(body).encode() if body is not None else None, headers=dict(H, **({'Content-Type': 'application/json'} if body is not None else {})), method='POST' if body is not None else 'GET')
    with urllib.request.urlopen(req, timeout=60) as r: return r.read().decode('utf-8', 'replace')
out = {}
base = 'https://registries.health.gov.il/Medicines/'
API = 'https://MohServicesApi.health.gov.il/api/Medicines/'
try:
    re_js = get(base + 'remoteEntry.js'); allj = re_js
    for c in re.findall(r'(\d+):"([0-9a-f]{8,20})"', re_js):
        try: allj += get(base + c[0] + '.' + c[1] + '.js')
        except Exception: pass
    out['barcode_js'] = list(dict.fromkeys(re.findall(r'.{0,200}(?:[Bb]ark?od|[Bb]arcode|BarCode|Gtin|GTIN).{0,200}', allj)))[:40]
    out['api_calls'] = sorted(set(re.findall(r'apiUrl\}?\+?"?`?(Get\w+)', allj)))
except Exception as e: out['js_err'] = str(e)
def tryit(name, fn):
    try: out[name] = json.loads(fn())
    except Exception as e: out[name] = 'ERR ' + str(e)[:300]
tryit('search', lambda: get(API + 'GetMedicines', {'medicineName': 'אקמול', 'pageIndex': 1, 'pageSize': 3}))
try:
    lst = out['search'].get('returnObject') if isinstance(out['search'], dict) else None
    items = (lst or {}).get('medicines') or (lst or {}).get('items') or lst or []
    if isinstance(items, dict): items = list(items.values())[0]
    first = items[0] if items else {}
    out['first_keys'] = list(first.keys()) if isinstance(first, dict) else str(first)[:200]
    mid = first.get('medicineId') or first.get('id')
    if mid: tryit('packages', lambda: get(API + 'GetMedicinePackages', params={'medicineId': mid}))
except Exception as e: out['pk_err'] = str(e)
for b in ['7290000068893', '7290008089478']:
    for ep in ['GetMedicineByBarcode', 'GetMedicinesByBarcode', 'GetMedicineByBarCode']:
        tryit(ep + '_' + b, lambda: get(API + ep, params={'barcode': b}))
os.makedirs('data-cache', exist_ok=True)
json.dump(out, open('data-cache/barcode_probe.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False)[:4000])
