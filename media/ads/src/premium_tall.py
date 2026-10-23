# Tall 9:16 version (1080x1920) of the premium ad, round 2 (Roni 15:22): the parts are spread over the
# whole height (no stretching of any text or picture): extra space is added only in quiet rows
# (top, between title and motto, before the phone, in the dark area, between and under the bottom rows),
# then colours a little richer and a light sharpening; thin blue frame round the whole picture.
# Run: python3 premium_tall.py MedTime-ad-premium.png OUT.png
import sys, numpy as np, cv2
from PIL import Image, ImageDraw
src, out = sys.argv[1:3]
ad = np.array(Image.open(src).convert('RGB')).astype(np.float32)
H0, W = ad.shape[:2]
B = 5                                              # old frame: replace with the pixels just inside it
ad[:B] = ad[B:B+1]; ad[-B:] = ad[-B-1:-B]; ad[:, :B] = ad[:, B:B+1]; ad[:, -B:] = ad[:, -B-1:-B]
# (row where space is added, how much)
INS = [(14, 170), (402, 80), (1195, 150), (1268, 50), (1336, 120)]
assert H0 + sum(n for _, n in INS) == 1920
parts, last = [], 0
for y, n in INS:
    parts.append(ad[last:y])
    a_, b_ = ad[y-3:y].mean(0), ad[y:y+3].mean(0)
    t = np.linspace(0, 1, n)[:, None, None]; t = t*t*(3 - 2*t)
    gap = a_[None]*(1 - t) + b_[None]*t
    gap = cv2.GaussianBlur(gap, (0, 0), sigmaX=0.8, sigmaY=1)   # keep vertical streaks (aurora) as they are
    gap = gap + np.random.default_rng(y).normal(0, 1.2, gap.shape).astype(np.float32)
    parts.append(gap)
    last = y
parts.append(ad[last:])
tall = np.concatenate(parts, 0)
# richer colours + light sharpening
hsv = cv2.cvtColor(np.clip(tall, 0, 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
hsv[..., 1] = np.clip(hsv[..., 1]*1.08, 0, 255)
tall = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB).astype(np.float32)
tall = np.clip(tall*1.0 + (tall - cv2.GaussianBlur(tall, (0, 0), 1.2))*0.45, 0, 255)
im = Image.fromarray(tall.astype(np.uint8))
ImageDraw.Draw(im).rectangle((0, 0, W-1, 1919), outline=(15, 184, 255), width=4)
im.save(out, optimize=True)
print('ok', im.size)
