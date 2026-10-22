#!/usr/bin/env python3
"""M-196: real sounds and nature videos for calm mode, from the picks in tools/media_pick.json (Wikimedia Commons, free licenses).
Runs on GitHub Actions.  mode 'strip': for each video, frames every 3 s over 60 s from its start -> media-cache/strip/<key>.jpg
(to choose a window with no cuts).  mode 'make': sounds -> assets/ambient/<key>.ogg (90 s seamless loop, same as fetch_sounds.py),
videos -> assets/video/<key>.mp4 (portrait 720x1280, seamless loop) + media-cache/out/<key>.jpg, credits -> assets/media_credits.js"""
import json, os, subprocess, sys, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
import fetch_sounds as fs
from PIL import Image, ImageDraw

P = json.load(open('tools/media_pick.json', encoding='utf-8'))
VD, XF = 20.0, 2.5  # video loop length and cross-fade (seconds)

def info(title):
    p = fs.get({'action': 'query', 'titles': title, 'prop': 'videoinfo', 'viprop': 'url|extmetadata|derivatives',
                'viextmetadatafilter': 'LicenseShortName|Artist'})['query']['pages'][0]['videoinfo'][0]
    ders = [x for x in (p.get('derivatives') or []) if 'webm' in (x.get('type') or '') and (x.get('height') or 0) <= 1080]
    ders.sort(key=lambda x: -(x.get('height') or 0))
    em = p.get('extmetadata') or {}
    return (ders[0]['src'] if ders else p['url']), fs.strip((em.get('LicenseShortName') or {}).get('value')), fs.strip((em.get('Artist') or {}).get('value'))

def grab(key, title):
    src, lic, art = info(title)
    raw = 'media-cache/raw/' + key
    if not os.path.exists(raw): open(raw, 'wb').write(fs.fetch(src, 900))
    return raw, lic, art

def strip(key, v):
    raw, _, _ = grab(key, v['title'])
    fr = []
    for k in range(20):
        jp = 'media-cache/raw/%s_%d.jpg' % (key, k)
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(v['start'] + k * 3), '-i', raw, '-frames:v', '1', '-vf', 'scale=240:-2', jp], check=True)
        im = Image.open(jp).convert('RGB'); d = ImageDraw.Draw(im); d.rectangle([0, 0, 40, 14], fill=(0, 0, 0)); d.text((2, 1), str(v['start'] + k * 3), fill=(255, 255, 0))
        fr.append(im); os.remove(jp)
    w, h = fr[0].size; img = Image.new('RGB', (w * 5, h * 4))
    for k, f in enumerate(fr): img.paste(f, ((k % 5) * w, (k // 5) * h))
    os.makedirs('media-cache/strip', exist_ok=True); img.save('media-cache/strip/%s.jpg' % key, quality=78)

def video(key, v):
    raw, lic, art = grab(key, v['title'])
    s = float(v['start'])
    out = 'app/src/main/assets/video/%s.mp4' % key
    os.makedirs('app/src/main/assets/video', exist_ok=True)
    # A = [s+XF, s+XF+VD], B = [s, s+XF]; the end of A fades into B, whose last frame leads into the first frame of A -> seamless loop
    crop = "crop='min(iw,ih*9/16)':ih,scale=720:1280:flags=lanczos,fps=30,setsar=1,format=yuv420p"
    fc = ('[0:v]trim=start=%.2f:duration=%.2f,setpts=PTS-STARTPTS,%s[a];[0:v]trim=start=%.2f:duration=%.2f,setpts=PTS-STARTPTS,%s[b];'
          '[a][b]xfade=transition=fade:duration=%.2f:offset=%.2f[v]') % (s + XF, VD, crop, s, XF, crop, XF, VD - XF)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', raw, '-filter_complex', fc, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow',
                    '-crf', str(v.get('crf', 27)), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], check=True)
    fr = []
    for k in range(6):
        jp = 'media-cache/raw/o_%s_%d.jpg' % (key, k)
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', str(k * VD / 6), '-i', out, '-frames:v', '1', '-vf', 'scale=180:-2', jp], check=True)
        fr.append(Image.open(jp).convert('RGB')); os.remove(jp)
    w, h = fr[0].size; img = Image.new('RGB', (w * 6, h))
    for k, f in enumerate(fr): img.paste(f, (k * w, 0))
    os.makedirs('media-cache/out', exist_ok=True); img.save('media-cache/out/%s.jpg' % key, quality=80)
    fs.log('video', out, os.path.getsize(out))
    return {'kind': 'video', 'key': key, 'file': v['title'], 'license': lic, 'artist': art,
            'url': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(v['title'].replace(' ', '_'))}

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'make'
    only = sys.argv[2:]
    os.makedirs('media-cache/raw', exist_ok=True)
    if mode == 'strip':
        for k, v in P['videos'].items():
            if only and k not in only: continue
            try: strip(k, v)
            except Exception as e: fs.log('STRIP FAILED', k, repr(e)[:300])
    else:
        try: cred = json.load(open('media-cache/credits.json', encoding='utf-8'))
        except Exception: cred = []
        for k, items in P['sounds'].items():
            if only and k not in only: continue
            try:
                n = len(fs.CRED); fs.make(k, items)
                cred = [c for c in cred if c.get('key') != k] + [dict(c, kind='sound', key=k) for c in fs.CRED[n:]]
            except Exception as e: fs.log('SOUND FAILED', k, repr(e)[:300])
        for k, v in P['videos'].items():
            if only and k not in only: continue
            try: c = video(k, v); cred = [x for x in cred if x.get('key') != k] + [c]
            except Exception as e: fs.log('VIDEO FAILED', k, repr(e)[:300])
        json.dump(cred, open('media-cache/credits.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        old = json.load(open('sound-cache/CREDITS.json', encoding='utf-8')) if os.path.exists('sound-cache/CREDITS.json') else []
        allc = [{'k': c['sound'], 'f': c['file'][5:], 'l': c['license'], 'a': c['artist']} for c in old] + \
               [{'k': c['key'], 'f': c['file'][5:], 'l': c['license'], 'a': c['artist']} for c in cred]
        open('app/src/main/assets/media_credits.js', 'w', encoding='utf-8').write(
            '/* M-196: authors and licenses of the real recordings and videos (Wikimedia Commons). Generated by tools/make_media.py. */\nwindow.MT_MEDIA_CREDITS=' +
            json.dumps(allc, ensure_ascii=False) + ';\n')
    open('media-cache/make_log.txt', 'w').write('\n'.join(fs.LOG))
