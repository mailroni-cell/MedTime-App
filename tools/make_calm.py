# M-182: makes the recorded calm-mode guidance (assets/calm/<lang>/<voice>/<line>.mp3) with natural neural voices.
# Run in GitHub Actions (workflow calm-voices.yml): pip install edge-tts; python tools/make_calm.py
import asyncio, json, os, subprocess, edge_tts
ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'app/src/main/assets/calm')
LINES = json.load(open(os.path.join(ROOT, 'tools/calm_lines.json'), encoding='utf-8'))
ML_F, ML_M = 'en-US-AvaMultilingualNeural', 'en-US-AndrewMultilingualNeural'
NATIVE = {'he': ('he-IL-HilaNeural', 'he-IL-AvriNeural'), 'ar': ('ar-SA-ZariyahNeural', 'ar-SA-HamedNeural'),
          'ro': ('ro-RO-AlinaNeural', 'ro-RO-EmilNeural'), 'fr': ('fr-FR-DeniseNeural', 'fr-FR-HenriNeural'),
          'en': ('en-US-JennyNeural', 'en-GB-RyanNeural'), 'ru': ('ru-RU-SvetlanaNeural', 'ru-RU-DmitryNeural')}
# id: (voice, rate, pitch, soft) ; soft = quieter, darker, a little room (close to a whisper)
# M-191 (owner): slower and more natural: native voices only (Ava / Andrew only in English), long pauses at "…"
def voices(l):
    f, m = NATIVE[l]
    v = {'f': (f, '-28%', '-3Hz', 0), 'm': (m, '-28%', '-5Hz', 0), 'soft': (f, '-34%', '-6Hz', 1)}
    if l == 'en': v.update({'ava': (ML_F, '-26%', '-2Hz', 0), 'andrew': (ML_M, '-26%', '-4Hz', 0)})
    return v
SOFT = 'highpass=f=120,lowpass=f=4200,volume=0.8,aecho=0.8:0.6:60:0.18'
async def one(text, voice, rate, pitch, soft, dst):
    raw = dst + '.raw.mp3'
    for _ in range(4):
        try:
            await edge_tts.Communicate(text.replace('…', '... '), voice, rate=rate, pitch=pitch).save(raw); break
        except Exception as e:
            print('retry', dst, e); await asyncio.sleep(3)
    af = (SOFT + ',' if soft else '') + 'apad=pad_dur=0.25,loudnorm=I=-20:TP=-2'
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', raw, '-af', af, '-ac', '1', '-ar', '24000', '-b:a', '40k', dst], check=True)
    os.remove(raw)
async def main():
    import shutil; shutil.rmtree(OUT, ignore_errors=True)
    for l, lines in LINES.items():
        for vid, (voice, rate, pitch, soft) in voices(l).items():
            d = os.path.join(OUT, l, vid); os.makedirs(d, exist_ok=True)
            for k, text in lines.items():
                await one(text, voice, rate, pitch, soft, os.path.join(d, k + '.mp3'))
            print('done', l, vid)
asyncio.run(main())
