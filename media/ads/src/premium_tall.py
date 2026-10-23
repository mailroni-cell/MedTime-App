# Tall 9:16 version (1080x1920) of the premium ad for WhatsApp Status / full screen.
# The 4:5 ad stays as it is in the middle; the space above continues the top's dark sky softly,
# the space below continues the dark bottom; the thin blue frame goes round the whole picture.
# Run: python3 premium_tall.py MedTime-ad-premium.png OUT.png
import sys, numpy as np, cv2
from PIL import Image, ImageDraw
src, out = sys.argv[1:3]
ad = np.array(Image.open(src).convert('RGB')).astype(np.float32)
B = 5                                             # old frame width to cut off
core = ad[B:-B, B:-B]                              # 1070 x 1340
W, H = 1080, 1920
top_h = (H - core.shape[0]) // 2 - 40              # a bit more room below than above
canvas = np.zeros((H, W, 3), np.float32)
x0 = (W - core.shape[1]) // 2
# above: the ad's top rows, stretched up and blurred, getting slightly darker towards the top
row = cv2.GaussianBlur(core[:6].mean(0, keepdims=True), (0, 0), 40)   # colour of the very top row, smoothed
up = np.repeat(row, top_h, axis=0)
up = up + np.random.default_rng(2).normal(0, 1.5, up.shape).astype(np.float32)
k = np.linspace(0.8, 1.0, top_h)[:, None, None]
canvas[:top_h, x0:x0+core.shape[1]] = up * k
canvas[top_h:top_h+core.shape[0], x0:x0+core.shape[1]] = core
# soft join over 40 px
j = 24; w_ = np.linspace(0, 1, j)[:, None, None]
canvas[top_h:top_h+j, x0:x0+core.shape[1]] = up[-1:]*k[-1]*(1-w_) + core[:j]*w_
# below: the flat dark colour of the ad's bottom
dark = np.median(core[-30:, 100:-100].reshape(-1, 3), axis=0)
canvas[top_h+core.shape[0]:, :] = dark
canvas[:, :x0] = canvas[:, x0:x0+1]; canvas[:, x0+core.shape[1]:] = canvas[:, x0+core.shape[1]-1:x0+core.shape[1]]
im = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))
ImageDraw.Draw(im).rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)
im.save(out)
print('ok', top_h)
