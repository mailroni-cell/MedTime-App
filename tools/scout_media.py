#!/usr/bin/env python3
"""M-196: scout real recordings and real nature videos on Wikimedia Commons (free licenses only) for calm mode.
Runs on GitHub Actions. For each key it keeps the best few candidates and makes a preview picture so Claude can choose:
  audio -> spectrogram + loudness stats, video -> 4 frames. Output: media-cache/scout.json and media-cache/prev/<key>.jpg"""
import json, os, re, subprocess, sys, time, urllib.error, urllib.parse, urllib.request
from PIL import Image, ImageDraw

UA = {'User-Agent': 'MedTimeMediaScout/1.0 (https://github.com/mailroni-cell/MedTime-App; one-off scout of a few CC files) python-urllib'}
API = 'https://commons.wikimedia.org/w/api.php'
OK_LIC = re.compile(r'^(cc0|public domain|pd|cc by(-sa)? ?[0-9.]*|cc-by(-sa)?-[0-9.]+)', re.I)
AUDIO = {
    'waterfall': ['waterfall sound', 'waterfall recording', 'cascade water sound'],
    'lake': ['lake shore waves sound', 'lapping water', 'gentle waves lake'],
    'rainroof': ['rain on roof', 'rain on window', 'rain on tent', 'rain on leaves'],
    'city': ['city ambience', 'city park ambience', 'street ambience recording'],
    'cafe': ['cafe ambience', 'restaurant ambience', 'coffee shop sound'],
    'train': ['train interior sound', 'train ride ambience', 'rail journey sound'],
    'jungle': ['rainforest ambience', 'tropical forest sound', 'jungle sounds'],
    'birds': ['dawn chorus', 'birdsong', 'songbirds recording'],
    'harbor': ['harbour ambience seagulls', 'seagulls sea', 'port ambience'],
    'frogs': ['frogs chorus', 'frogs night pond', 'tree frogs'],
    'cave': ['cave dripping water', 'cave ambience', 'water drops cave'],
    'meadow': ['meadow summer insects', 'grasshoppers meadow', 'summer field ambience'],
    'owls': ['owl night', 'tawny owl', 'night forest owl'],
    'cat': ['cat purring', 'purring cat', 'cat purr'],
    'whales': ['humpback whale song', 'whale song', 'whale sounds hydrophone'],
    'fountain': ['fountain water sound', 'fountain ambience', 'garden fountain'],
    'tibet': ['singing bowl', 'tibetan singing bowl', 'meditation bowl'],
    'river': ['river sound', 'river flowing recording', 'mountain river'],
}
VIDEO = {
    'v_ocean': ['ocean waves video', 'waves beach video', 'sea waves'],
    'v_forest': ['forest video', 'forest sunlight', 'woodland video'],
    'v_waterfall': ['waterfall video', 'waterfall'],
    'v_river': ['river stream video', 'creek flowing', 'mountain stream'],
    'v_rain': ['rain video', 'raindrops', 'rain on window'],
    'v_snow': ['snowfall video', 'snow falling', 'snowy forest'],
    'v_city': ['city night timelapse', 'city timelapse', 'night city lights'],
    'v_clouds': ['clouds timelapse', 'sunset timelapse', 'sky timelapse'],
    'v_stars': ['night sky timelapse', 'milky way timelapse', 'aurora borealis video'],
    'v_fire': ['campfire video', 'fireplace video', 'bonfire video'],
    'v_lake': ['lake video', 'lake reflection', 'calm lake'],
    'v_underwater': ['coral reef video', 'underwater video', 'fish reef'],
    'v_field': ['meadow wind video', 'wheat field wind', 'grass wind'],
    'v_mountain': ['mountains video', 'alps video', 'mountain landscape video'],
}
KEEP = 6
LOG = []
def log(*a):
    print(*a, flush=True); LOG.append(' '.join(str(x) for x in a))

def fetch(url, timeout=120, cap=0):
    for n in range(7):
        time.sleep(1.5)
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
                return r.read(cap) if cap else r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or n == 6: raise
            ra = e.headers.get('Retry-After')
            time.sleep(min(120, int(ra) if ra and ra.isdigit() else 10 * (n + 1)))

def get(params):
    return json.loads(fetch(API + '?' + urllib.parse.urlencode(dict(params, format='json', formatversion=2))))

def strip(h):
    return re.sub(r'<[^>]+>', '', h or '').strip()[:160]

def search(qs, kind):
    seen = {}
    for q in qs:
        try:
            d = get({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:' + kind, 'gsrnamespace': 6, 'gsrlimit': 50,
                     'prop': 'videoinfo', 'viprop': 'url|size|mime|extmetadata|metadata|derivatives',
                     'viextmetadatafilter': 'LicenseShortName|Artist|ImageDescription'})
        except Exception as e:
            log('search failed', q, repr(e)); continue
        for p in (d.get('query') or {}).get('pages', []):
            ii = (p.get('videoinfo') or [{}])[0]
            em = ii.get('extmetadata') or {}
            lic = strip((em.get('LicenseShortName') or {}).get('value'))
            if not OK_LIC.match(lic) or re.search(r'\bnc\b|\bnd\b|-nc|-nd', lic.lower()): continue
            length = 0
            for m in ii.get('metadata') or []:
                if m.get('name') in ('length', 'playtime_seconds', 'duration'):
                    try: length = float(m.get('value'))
                    except Exception: pass
            c = {'title': p['title'], 'len': round(length, 1), 'lic': lic, 'mime': ii.get('mime'), 'size': ii.get('size') or 0,
                 'w': ii.get('width') or 0, 'h': ii.get('height') or 0, 'url': ii.get('url'),
                 'artist': strip((em.get('Artist') or {}).get('value')), 'desc': strip((em.get('ImageDescription') or {}).get('value'))}
            if kind == 'video':
                ders = [x for x in (ii.get('derivatives') or []) if 'webm' in (x.get('type') or '') and (x.get('height') or 0) <= 1080]
                ders.sort(key=lambda x: -(x.get('height') or 0))
                c['src'] = ders[0]['src'] if ders else c['url']
            seen[p['title']] = c
    return list(seen.values())

def score_audio(c):
    if c['len'] < 60: return -1
    lossless = 1.0 if re.search(r'wav|flac', (c['mime'] or '') + c['title'], re.I) else 0
    rate = c['size'] / max(c['len'], 1)  # bytes per second: higher = less compressed
    return min(c['len'], 900) / 900 + lossless + min(rate / 40000, 1)

def score_video(c):
    if c['len'] < 8 or c['w'] < 1280: return -1
    return min(c['len'], 120) / 120 + (1 if c['w'] >= 1920 else 0.5)

def label(img, text):
    d = ImageDraw.Draw(img); d.rectangle([0, 0, img.width, 16], fill=(0, 0, 0)); d.text((4, 2), text[:120], fill=(255, 255, 0))
    return img

def audio_prev(key, cands):
    rows = []
    for i, c in enumerate(cands):
        raw = 'media-cache/raw/%s_%d' % (key, i)
        try:
            open(raw, 'wb').write(fetch(c['url'], 300, 120 * 1024 * 1024))
            st = c.get('start', min(60, c['len'] / 4))
            r = subprocess.run(['ffmpeg', '-v', 'info', '-ss', str(st), '-t', '120', '-i', raw, '-af', 'volumedetect,astats=metadata=0', '-f', 'null', '-'],
                               capture_output=True, text=True).stderr
            g = lambda pat: (re.search(pat, r) or [None, '?'])[1]
            c['stats'] = {'max_db': g(r'max_volume: (-?[\d.]+)'), 'mean_db': g(r'mean_volume: (-?[\d.]+)'), 'sr': g(r'(\d+) Hz'),
                          'noise_floor': g(r'Noise floor dB: (-?[\d.inf]+)')}
            png = raw + '.png'
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(st), '-t', '120', '-i', raw, '-lavfi', 'showspectrumpic=s=900x160:legend=0:scale=log', png], check=True)
            im = label(Image.open(png).convert('RGB'), '%d %s | %ss %s | max %s mean %s sr %s' % (i, c['title'][5:60], c['len'], c['lic'], c['stats']['max_db'], c['stats']['mean_db'], c['stats']['sr']))
            rows.append(im)
        except Exception as e:
            c['err'] = repr(e)[:200]; log('audio prev failed', key, c['title'], repr(e)[:200])
        finally:
            if os.path.exists(raw): os.remove(raw)
    return rows

def video_prev(key, cands):
    rows = []
    for i, c in enumerate(cands):
        raw = 'media-cache/raw/%s_%d' % (key, i)
        try:
            open(raw, 'wb').write(fetch(c['src'], 600, 300 * 1024 * 1024))
            fr = []
            for k in range(4):
                jp = '%s_%d.jpg' % (raw, k)
                subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(c['len'] * (k + 0.5) / 4.5), '-i', raw, '-frames:v', '1', '-vf', 'scale=300:-2', jp], check=True)
                fr.append(Image.open(jp).convert('RGB')); os.remove(jp)
            h = max(f.height for f in fr); im = Image.new('RGB', (1200, h + 16))
            for k, f in enumerate(fr): im.paste(f, (k * 300, 16))
            rows.append(label(im, '%d %s | %ss %dx%d %s' % (i, c['title'][5:70], c['len'], c['w'], c['h'], c['lic'])))
        except Exception as e:
            c['err'] = repr(e)[:200]; log('video prev failed', key, c['title'], repr(e)[:200])
        finally:
            if os.path.exists(raw): os.remove(raw)
    return rows

if __name__ == '__main__':
    only = sys.argv[1:]  # optional: keys to (re)scout
    os.makedirs('media-cache/raw', exist_ok=True); os.makedirs('media-cache/prev', exist_ok=True)
    try: out = json.load(open('media-cache/scout.json'))
    except Exception: out = {}
    for kind, table, sc, prev in (('audio', AUDIO, score_audio, audio_prev), ('video', VIDEO, score_video, video_prev)):
        for key, qs in table.items():
            if only and key not in only: continue
            if not only and out.get(key): continue
            cands = [c for c in search(qs, kind) if sc(c) >= 0]
            cands.sort(key=lambda c: -sc(c)); cands = cands[:KEEP]
            log(key, len(cands))
            rows = prev(key, cands) if cands else []
            if rows:
                W = max(r.width for r in rows); img = Image.new('RGB', (W, sum(r.height for r in rows)), (30, 30, 30)); y = 0
                for r in rows: img.paste(r, (0, y)); y += r.height
                img.save('media-cache/prev/%s.jpg' % key, quality=80)
            out[key] = cands
            json.dump(out, open('media-cache/scout.json', 'w'), ensure_ascii=False, indent=1)
    open('media-cache/log.txt', 'w').write('\n'.join(LOG))
