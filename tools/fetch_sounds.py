#!/usr/bin/env python3
"""M-072: real nature recordings for calm mode, from Wikimedia Commons (free licenses only).
Runs on GitHub Actions (the cloud editor cannot reach Commons).
Step 1 (always): search candidates -> sound-cache/candidates.json
Step 2 (if tools/sounds_pick.json exists): download the picked files, make 90 s loops
         -> app/src/main/assets/ambient/<key>.ogg and sound-cache/CREDITS.json"""
import json, os, re, subprocess, urllib.parse, urllib.request

UA = {'User-Agent': 'MedTime-App/1.0 (github.com/mailroni-cell/MedTime-App; calm sounds)'}
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

def get(params):
    q = API + '?' + urllib.parse.urlencode(dict(params, format='json', formatversion=2))
    with urllib.request.urlopen(urllib.request.Request(q, headers=UA), timeout=60) as r:
        return json.load(r)

def strip(h):
    return re.sub(r'<[^>]+>', '', h or '').strip()[:200]

def scout():
    out = {}
    for key, qs in QUERIES.items():
        seen = {}
        for q in qs:
            try:
                d = get({'action': 'query', 'generator': 'search', 'gsrsearch': q + ' filetype:audio', 'gsrnamespace': 6,
                         'gsrlimit': 40, 'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata|metadata',
                         'iiextmetadatafilter': 'LicenseShortName|Artist|ImageDescription'})
            except Exception as e:
                print('search failed', q, e); continue
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
        print(key, len(out[key]))
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
        with urllib.request.urlopen(urllib.request.Request(ii['url'], headers=UA), timeout=300) as r, open(raw, 'wb') as f:
            f.write(r.read())
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
    L = min(90.0, dur - 4)
    X = 4.0  # seconds of overlap so the end flows into the start
    out = 'app/src/main/assets/ambient/%s.ogg' % key
    # body = [X, L+X), its last X seconds are cross-faded with the first X seconds [0, X)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-filter_complex',
                    '[0]atrim=%f:%f,asetpts=N/SR/TB[body];[0]atrim=0:%f,asetpts=N/SR/TB[head];'
                    '[body]atrim=0:%f,asetpts=N/SR/TB[b1];[body]atrim=%f,asetpts=N/SR/TB[b2];'
                    '[b2][head]acrossfade=d=%f:c1=qsin:c2=qsin[tail];[b1][tail]concat=n=2:v=0:a=1[o]' % (X, L + X, X, L - X, L - X, X),
                    '-map', '[o]', '-c:a', 'libvorbis', '-q:a', '2', out], check=True)
    print('made', out, os.path.getsize(out))

CRED = []
if __name__ == '__main__':
    scout()
    if os.path.exists('tools/sounds_pick.json'):
        for key, items in json.load(open('tools/sounds_pick.json')).items():
            try: make(key, items)
            except Exception as e: print('FAILED', key, e)
        json.dump(CRED, open('sound-cache/CREDITS.json', 'w'), ensure_ascii=False, indent=1)
