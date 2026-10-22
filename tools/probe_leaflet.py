# M-195: learn how the Ministry of Health registry links a medicine page and its leaflets (runs in GitHub Actions)
import json, re, urllib.request, urllib.parse, os
H = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0 Safari/537.36', 'Accept': '*/*', 'Origin': 'https://registries.health.gov.il', 'Referer': 'https://registries.health.gov.il/Medicines'}
def get(u, body=None):
    req = urllib.request.Request(u, data=json.dumps(body).encode() if body is not None else None, headers=dict(H, **({'Content-Type': 'application/json'} if body is not None else {})), method='POST' if body is not None else 'GET')
    with urllib.request.urlopen(req, timeout=60) as r: return r.read().decode('utf-8', 'replace')
out = {}
base = 'https://registries.health.gov.il/Medicines/'
try:
    re_js = get(base + 'remoteEntry.js'); out['remote_len'] = len(re_js)
    chunks = set(re.findall(r'"([\w.-]+\.js)"', re_js)) | set(re.findall(r'(\d+)\s*:\s*"([0-9a-f]{8,})"', re_js) and [])
    allj = re_js
    for c in re.findall(r'(\d+):"([0-9a-f]{8,20})"', re_js):
        try: allj += get(base + c[0] + '.' + c[1] + '.js')
        except Exception as e: out.setdefault('chunk_err', []).append(str(e))
    for name in sorted(chunks)[:80]:
        try: allj += get(urllib.parse.urljoin(base, name))
        except Exception: pass
    out['all_len'] = len(allj)
    for pat in [r'.{0,120}(?:[Bb]rochure|[Ll]eaflet|[Pp]amphlet|[Ff]ileUrl|\.pdf).{0,160}', r'.{0,80}path:\s*"[^"]*".{0,80}', r'.{0,60}(?:GetMedicine\w*|GetBrochure\w*|Get\w*Files?\w*).{0,100}']:
        out[pat[:30]] = list(dict.fromkeys(re.findall(pat, allj)))[:60]
    cfg = json.loads(get(base + 'assets/medicines/config.prod.json')); out['cfg'] = cfg
except Exception as e:
    out['err'] = str(e)
os.makedirs('data-cache', exist_ok=True)
json.dump(out, open('data-cache/leaflet_probe.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False)[:3000])
