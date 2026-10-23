# Finds free photos (CC0 / public domain, commercial use allowed) for the ads via the Openverse API.
# Output on branch adimg: <slug>/NN.jpg, <slug>/meta.json, <slug>/sheet.jpg (numbered contact sheet).
import json, os, sys, io, urllib.request, urllib.parse
from PIL import Image, ImageDraw
Q = json.loads(sys.argv[1])
IDS = Q.pop('_unsplash', []) if isinstance(Q, dict) else []
PX = Q.pop('_pexels', [])
OUT = 'out'
LOG = []
UA = {'User-Agent': 'MedTime-ad-photos/1.0 (github.com/mailroni-cell/MedTime-App)'}
def get(url, t=40):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=t).read()
import re
def unsplash_ids():
    d = os.path.join(OUT, 'u'); os.makedirs(d, exist_ok=True); meta = []
    for pid in IDS:
        im = None
        for url in (f'https://unsplash.com/photos/{pid}/download?force=true&w=2400', f'https://unsplash.com/photos/{pid}/download'):
            try: im = Image.open(io.BytesIO(get(url, 60))).convert('RGB'); break
            except Exception as e: LOG.append(f'U {pid} {url[-20:]} {e}')
        if im is None:
            try:
                h = get(f'https://unsplash.com/photos/{pid}').decode('utf8', 'ignore')
                m = re.search(r'https://images\.unsplash\.com/photo-[\w-]+', h)
                if m: im = Image.open(io.BytesIO(get(m.group(0) + '?w=2400&q=88&fm=jpg'))).convert('RGB')
            except Exception as e: LOG.append(f'U page {pid} {e}')
        if im is None: continue
        im.thumbnail((2400, 2400)); im.save(os.path.join(d, f'{pid}.jpg'), quality=88); meta.append(pid); LOG.append(f'U ok {pid} {im.size}')
    json.dump(meta, open(os.path.join(d, 'meta.json'), 'w'))
if IDS: unsplash_ids()
if PX:
    d = os.path.join(OUT, 'p'); os.makedirs(d, exist_ok=True); thumbs = []
    for pid in PX:
        try:
            im = Image.open(io.BytesIO(get(f'https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=2400', 60))).convert('RGB')
            im.save(os.path.join(d, f'{pid}.jpg'), quality=88); LOG.append(f'P ok {pid} {im.size}')
            t = im.copy(); t.thumbnail((400, 300)); thumbs.append((pid, t))
        except Exception as e: LOG.append(f'P {pid} {e}')
    if thumbs:
        sh = Image.new('RGB', (1600, 300 * ((len(thumbs) + 3) // 4)), 'white'); dr = ImageDraw.Draw(sh)
        for i, (pid, t) in enumerate(thumbs):
            x, y = (i % 4) * 400, (i // 4) * 300; sh.paste(t, (x, y)); dr.rectangle([x, y, x + 110, y + 22], fill='black'); dr.text((x + 4, y + 5), pid, fill='yellow')
        sh.save(os.path.join(d, 'sheet.jpg'), quality=85)
for slug, q in Q.items():
    d = os.path.join(OUT, slug); os.makedirs(d, exist_ok=True)
    res = []
    # Unsplash (Unsplash License: free commercial use, no attribution needed); skip Unsplash+ (paid) photos
    try:
        u = json.loads(get('https://unsplash.com/napi/search/photos?' + urllib.parse.urlencode({'query': q, 'per_page': 30})))['results']
        for r in u:
            if r.get('premium') or r.get('plus'): continue
            res.append({'url': r['urls']['raw'] + '&w=2000&q=85&fm=jpg', 'title': r.get('alt_description'), 'creator': (r.get('user') or {}).get('name'), 'license': 'unsplash', 'source': 'unsplash', 'foreign_landing_url': (r.get('links') or {}).get('html')})
    except Exception as e: LOG.append(f'UNSPLASH {slug} {e}')
    try:
        api = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license': 'cc0,pdm', 'page_size': 20, 'size': 'large'})
        res += json.loads(get(api))['results']
    except Exception as e: LOG.append(f'OPENVERSE {slug} {e}')
    meta, thumbs = [], []
    for r in res:
        if len(meta) >= 16: break
        try:
            im = Image.open(io.BytesIO(get(r['url']))).convert('RGB')
            if im.width < 1200: continue
            im.thumbnail((2000, 2000)); n = len(meta)
            im.save(os.path.join(d, f'{n:02d}.jpg'), quality=88)
            meta.append({'n': n, 'title': r.get('title'), 'creator': r.get('creator'), 'license': r.get('license'), 'source': r.get('source'), 'page': r.get('foreign_landing_url')})
            t = im.copy(); t.thumbnail((400, 300)); thumbs.append(t)
        except Exception as e: LOG.append(f'IMG {slug} {e}')
    json.dump(meta, open(os.path.join(d, 'meta.json'), 'w'), ensure_ascii=False, indent=1)
    if thumbs:
        sh = Image.new('RGB', (1600, 300 * ((len(thumbs) + 3) // 4)), 'white'); dr = ImageDraw.Draw(sh)
        for i, t in enumerate(thumbs):
            x, y = (i % 4) * 400, (i // 4) * 300; sh.paste(t, (x, y)); dr.rectangle([x, y, x + 46, y + 34], fill='black'); dr.text((x + 8, y + 8), str(i), fill='yellow')
        sh.save(os.path.join(d, 'sheet.jpg'), quality=85)
    LOG.append(f'{slug} {len(meta)}')
os.makedirs(OUT, exist_ok=True); open(os.path.join(OUT, 'log.txt'), 'w').write('\n'.join(LOG)); print('\n'.join(LOG))
