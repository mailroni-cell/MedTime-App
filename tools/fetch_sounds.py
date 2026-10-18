#!/usr/bin/env python3
"""M-072: real nature recordings for calm mode, from Wikimedia Commons (free licenses only).
Runs on GitHub Actions (the cloud editor cannot reach Commons).
Step 1 (always): search candidates -> sound-cache/candidates.json
Step 2 (if tools/sounds_pick.json exists): download the picked files, make 90 s loops
         -> app/src/main/assets/ambient/<key>.ogg and sound-cache/CREDITS.json"""
import json, os, re, subprocess, time, traceback, urllib.error, urllib.parse, urllib.request
LOG = []
def log(*a):
    print(*a); LOG.append(' '.join(str(x) for x in a))

UA = {'User-Agent': 'MedTimeSoundFetch/1.0 (https://github.com/mailroni-cell/MedTime-App; one-off fetch of a few CC sound files) python-urllib'}
API = 'https://commons.wikimedia.org/w/api.php'
OK_LIC = re.compile(r'^(cc0|public domain|pd|cc by(-sa)? ?[0-9.]*|cc-by(-sa)?-[0-9.]+)', re.I)
QUERIES = {
    'rain': ['rain sound', 'rain on roof', 'rainfall recording'],
    'ocean': ['ocean waves sound', 'sea waves beach', 'surf waves recording'],
    'forest': ['forest birds ambience', 'birdsong forest morning', 'woodland ambience'],
    'night': ['crickets night', 'night ambience insects', 'cicadas night'],
    'fire': ['campfire', 'fireplace', 'crackling fire', 'bonfire', 'burning wood'],
    'wind': ['wind', 'windy', 'wind blowing', 'gale', 'breeze'],
    'storm': ['thunderstorm rain', 'thunder rain recording', 'distant thunder'],
    'underwater': ['underwater sound', 'underwater ambience', 'hydrophone'],
    'zen': ['stream water flowing', 'brook babbling', 'creek water sound'],
}

def fetch(url, timeout=60):
    # Wikimedia rate-limits shared GitHub runners: wait and retry, honouring Retry-After
    for n in range(7):
        time.sleep(2)
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or n == 6: raise
            ra = e.headers.get('Retry-After')
            time.sleep(min(120, int(ra) if ra and ra.isdigit() else 10 * (n + 1)))

def get(params):
    q = API + '?' + urllib.parse.urlencode(dict(params, format='json', formatversion=2))
    return json.loads(fetch(q))

def strip(h):
    return re.sub(r'<[^>]+>', '', h or '').strip()[:200]

def scout():
    try: out = json.load(open('sound-cache/candidates.json'))
    except Exception: out = {}
    for key, qs in QUERIES.items():
        if out.get(key): continue
        seen = {}
        for q in qs:
            try:
                d = get({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:audio', 'gsrnamespace': 6,
                         'gsrlimit': 40, 'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata|metadata',
                         'iiextmetadatafilter': 'LicenseShortName|Artist|ImageDescription'})
            except Exception as e:
                log('search failed', q, repr(e)); continue
            for p in (d.get('query') or {}).get('pages', []):
                ii = (p.get('imageinfo') or [{}])[0]
                em = ii.get('extmetadata') or {}
                lic = strip((em.get('LicenseShortName') or {}).get('value'))
                length = 0
                for m in ii.get('metadata') or []:
                    if m.get('name') in ('length', 'playtime_seconds'):
                        try: length = float(m.get('value'))
                        except Exception: pass
                if not OK_LIC.match(lic) or 'nc' in lic.lower() or 'nd' in lic.lower().split():
                    continue
                seen[p['title']] = {'title': p['title'], 'len': round(length, 1), 'lic': lic, 'mime': ii.get('mime'),
                                    'size': ii.get('size'), 'url': ii.get('url'),
                                    'artist': strip((em.get('Artist') or {}).get('value')),
                                    'desc': strip((em.get('ImageDescription') or {}).get('value'))}
        out[key] = sorted(seen.values(), key=lambda c: -c['len'])
        log(key, len(out[key]))
    os.makedirs('sound-cache', exist_ok=True)
    json.dump(out, open('sound-cache/candidates.json', 'w'), ensure_ascii=False, indent=1)

def make(key, items):
    """items: list of {title, start?}. Joins the picks, cuts 90 s, and blends the end into the start so it loops."""
    os.makedirs('sound-cache/raw', exist_ok=True)
    parts = []
    for i, it in enumerate(items):
        ii = get({'action': 'query', 'titles': it['title'], 'prop': 'imageinfo', 'iiprop': 'url|extmetadata',
                  'iiextmetadatafilter': 'LicenseShortName|Artist'})['query']['pages'][0]['imageinfo'][0]
        raw = 'sound-cache/raw/%s_%d' % (key, i)
        open(raw, 'wb').write(fetch(ii['url'], 300))
        wav = raw + '.wav'
        cmd = ['ffmpeg', '-y', '-v', 'error']
        if it.get('start'): cmd += ['-ss', str(it['start'])]
        cmd += ['-i', raw, '-ac', '2', '-ar', '44100', '-af', 'highpass=f=30,loudnorm=I=-24:TP=-3', wav]
        subprocess.run(cmd, check=True)
        parts.append(wav)
        em = ii.get('extmetadata') or {}
        CRED.append({'sound': key, 'file': it['title'], 'url': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(it['title'].replace(' ', '_')),
                     'license': strip((em.get('LicenseShortName') or {}).get('value')), 'artist': strip((em.get('Artist') or {}).get('value'))})
    src = 'sound-cache/raw/%s_all.wav' % key
    if len(parts) > 1:
        lst = 'sound-cache/raw/%s.txt' % key
        open(lst, 'w').write(''.join("file '%s'\n" % os.path.basename(p) for p in parts))
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', src], check=True)
    else:
        src = parts[0]
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src],
                               capture_output=True, text=True).stdout or 0)
    # cut a 90 s loop whose end blends into its start (equal-power cross-fade), so it repeats with no seam
    import numpy as np
    SR = 44100
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(pcm, dtype=np.float32).reshape(-1, 2)
    X = int(4 * SR)
    L = min(int(90 * SR), len(a) - X - SR)
    body, head = a[X:X + L].copy(), a[:X]
    w = np.linspace(0, 1, X, dtype=np.float32)[:, None]
    body[L - X:] = body[L - X:] * np.cos(w * np.pi / 2) + head * np.sin(w * np.pi / 2)
    out = 'app/src/main/assets/ambient/%s.ogg' % key
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'libvorbis', '-q:a', '2', out],
                   input=body.astype(np.float32).tobytes(), check=True)
    log('made', out, os.path.getsize(out))

CRED = []
if __name__ == '__main__':
    scout()
    if os.path.exists('tools/sounds_pick.json'):
        for key, items in json.load(open('tools/sounds_pick.json')).items():
            try: make(key, items)
            except Exception as e: log('FAILED', key, traceback.format_exc()[-1500:])
        json.dump(CRED, open('sound-cache/CREDITS.json', 'w'), ensure_ascii=False, indent=1)
    open('sound-cache/log.txt', 'w').write('\n'.join(LOG))
