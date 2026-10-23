# Finds free photos (CC0 / public domain, commercial use allowed) for the ads via the Openverse API.
# Output on branch adimg: <slug>/NN.jpg, <slug>/meta.json, <slug>/sheet.jpg (numbered contact sheet).
import json, os, sys, io, urllib.request, urllib.parse
from PIL import Image, ImageDraw
Q = json.loads(sys.argv[1])
OUT = 'out'
UA = {'User-Agent': 'MedTime-ad-photos/1.0 (github.com/mailroni-cell/MedTime-App)'}
def get(url, t=40):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=t).read()
for slug, q in Q.items():
    d = os.path.join(OUT, slug); os.makedirs(d, exist_ok=True)
    api = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license': 'cc0,pdm', 'page_size': 30, 'aspect_ratio': '', 'size': 'large'})
    try: res = json.loads(get(api))['results']
    except Exception as e: print('API', slug, e); continue
    meta, thumbs = [], []
    for r in res:
        if len(meta) >= 12: break
        try:
            im = Image.open(io.BytesIO(get(r['url']))).convert('RGB')
            if im.width < 1200: continue
            im.thumbnail((2000, 2000)); n = len(meta)
            im.save(os.path.join(d, f'{n:02d}.jpg'), quality=88)
            meta.append({'n': n, 'title': r.get('title'), 'creator': r.get('creator'), 'license': r.get('license'), 'source': r.get('source'), 'page': r.get('foreign_landing_url')})
            t = im.copy(); t.thumbnail((400, 300)); thumbs.append(t)
        except Exception as e: print('IMG', slug, e)
    json.dump(meta, open(os.path.join(d, 'meta.json'), 'w'), ensure_ascii=False, indent=1)
    if thumbs:
        sh = Image.new('RGB', (1600, 300 * ((len(thumbs) + 3) // 4)), 'white'); dr = ImageDraw.Draw(sh)
        for i, t in enumerate(thumbs):
            x, y = (i % 4) * 400, (i // 4) * 300; sh.paste(t, (x, y)); dr.rectangle([x, y, x + 46, y + 34], fill='black'); dr.text((x + 8, y + 8), str(i), fill='yellow')
        sh.save(os.path.join(d, 'sheet.jpg'), quality=85)
    print(slug, len(meta))
