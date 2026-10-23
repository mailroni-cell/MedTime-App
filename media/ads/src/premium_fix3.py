# Round 3 (Roni 14:04): download stamp moves to the top-right, opposite the red stamp,
# bigger clearer address (2 lines), no tilt; the red stamp also gets a neon glow.
# Same as round 2 otherwise. Run on the ROUND-1 image (cdddeed), not on round 2.
# Round 2 on media/ads/MedTime-ad-premium.png (Roni 2026-10-23 ~14:00):
# - remove the bottom URL pill + QR, remove "6 שפות", move the language row down (more room)
# - under the red stamp: "להורדת התוכנה" + medtime.pages.dev + the same QR, stamp style, neon
# Run: python3 premium_fix2.py CUR.png ORIG_ddc63a0.png FONTDIR OUT.png
import sys, numpy as np, cv2
from scipy import ndimage as nd
from PIL import Image, ImageDraw, ImageFont
cur_p, orig_p, fd, out = sys.argv[1:5]
img = np.array(Image.open(cur_p).convert('RGB')).astype(np.float32)
org = np.array(Image.open(orig_p).convert('RGB')).astype(int)
H, W = img.shape[:2]
def disk(n):
    y, x = np.ogrid[-n:n+1, -n:n+1]; return x*x + y*y <= n*n
def over(base, col, al):
    return base*(1-al[..., None]) + np.array(col, np.float32)*al[..., None]
def inpaint(im, m):
    u = np.clip(im, 0, 255).astype(np.uint8)
    return cv2.inpaint(u, m.astype(np.uint8)*255, 7, cv2.INPAINT_TELEA).astype(np.float32)

# QR image from the original (unchanged modules)
qr = org[1194:1290, 706:802].astype(np.float32)

# language row mask (same as fix1) -> letters + white ring
a = org
row = np.zeros((H, W), bool); row[1155:1194, 90:1000] = True
txt = (np.abs(a - [92, 242, 143]).sum(2) < 60) & row
tl, tn = nd.label(txt, np.ones((3, 3))); ts = nd.sum(txt, tl, range(1, tn+1))
txt = np.isin(tl, np.nonzero(ts >= 6)[0] + 1)
six = np.zeros((H, W), bool); six[1150:1198, 840:960] = True   # "6 שפות" (yellow)
lang = nd.binary_dilation(txt, disk(4)); lang = nd.binary_dilation(lang, disk(3))
dots = np.zeros((H, W), bool)
# bullets between languages are gold dots inside the row: keep them
gold = (np.abs(a - [205, 170, 110]).sum(2) < 90) & row & ~six
dots = nd.binary_dilation(gold, disk(2))
keep = (lang | dots) & ~six
ys, xs = np.nonzero(keep); bx0, bx1, by0, by1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
rowimg = img[by0:by1, bx0:bx1].copy()
rowal = cv2.GaussianBlur(keep[by0:by1, bx0:bx1].astype(np.float32), (3, 3), 0)

# frame pixels to protect
ci = img.astype(int); g, r, b_ = ci[..., 1], ci[..., 0], ci[..., 2]
fmk = ((g > 150) & (g - r > 40) & (g - b_ > 20)) | ((g > 235) & (r > 120) & (g - r > 30))
lb, nl = nd.label(fmk, np.ones((3, 3)))
frame = nd.binary_dilation(lb == (np.argmax(nd.sum(fmk, lb, range(1, nl+1))) + 1), disk(4))

# clear 2: old language row letters + "6 שפות" (thin shapes -> inpaint)
sixm = six & nd.binary_dilation(np.abs(a - [255, 213, 74]).sum(2) < 60, disk(8))
clr = nd.binary_dilation(lang | dots | sixm, disk(2))
img = inpaint(img, clr & ~frame)

# clear 1: the pill/QR band -> per-row blend of the background just left/right of it
X0, X1, Y0, Y1 = 118, 966, 1160, 1312
lc = img[Y0:Y1, X0-8:X0-3].mean(1); rc = img[Y0:Y1, X1+3:X1+8].mean(1)
t = np.linspace(0, 1, X1-X0)[None, :, None]
fill = lc[:, None]*(1-t) + rc[:, None]*t
fill = cv2.GaussianBlur(fill, (0, 0), 2)
fm = ~frame[Y0:Y1, X0:X1]
ramp = np.clip((np.arange(Y1-Y0) - 0) / 30.0, 0, 1)[:, None, None]  # soft top edge
blk = img[Y0:Y1, X0:X1]; new = blk*(1-ramp) + fill*ramp
blk[fm] = new[fm]; img[Y0:Y1, X0:X1] = blk
# paste language row, bigger, centred lower
s = 1.15
nw, nh = int((bx1-bx0)*s), int((by1-by0)*s)
ri = cv2.resize(rowimg, (nw, nh), interpolation=cv2.INTER_CUBIC); ra = cv2.resize(rowal, (nw, nh))
x0 = (W - nw)//2; y0 = 1222 - nh//2
reg = img[y0:y0+nh, x0:x0+nw]; img[y0:y0+nh, x0:x0+nw] = reg*(1-ra[..., None]) + ri*ra[..., None]

# ---- neon download stamp, top-right (mirror of the red stamp) ----
NEON = (255, 52, 92); HOT = (255, 240, 244)
bw, bh = 214, 252; X, Y = 824, 24
fh = ImageFont.truetype(fd + '/rubik-hebrew-800-normal.ttf', 28)
fa = ImageFont.truetype(fd + '/rubik-latin-800-normal.ttf', 36)
fb_ = ImageFont.truetype(fd + '/rubik-latin-800-normal.ttf', 27)
lines = [('להורדת התוכנה', fh, 12, 'rtl'), ('medtime', fa, 44, None), ('.pages.dev', fb_, 82, None)]
q0, qs = 116, 124
def layer(stroke, fill_text=True, frame_lines=True):
    L = Image.new('L', (bw, bh), 0); d = ImageDraw.Draw(L)
    if frame_lines:
        d.rounded_rectangle((3, 3, bw-4, bh-4), 18, outline=255, width=4)
        d.rounded_rectangle((10, 10, bw-11, bh-11), 13, outline=255, width=2)
        d.rounded_rectangle(((bw-qs)/2-5, q0-5, (bw+qs)/2+5, q0+qs+5), 8, outline=255, width=3)
    for t, f, y, dr in lines:
        w = d.textlength(t, font=f, direction=dr) if dr else d.textlength(t, font=f)
        kw = dict(font=f, fill=255)
        if dr: kw['direction'] = dr
        if stroke: kw.update(stroke_width=stroke, stroke_fill=255)
        if fill_text or stroke: d.text(((bw-w)/2, y), t, **kw)
    return np.array(L).astype(np.float32)/255
ink = layer(3)                      # frame lines + text with neon outline
fillm = layer(0, frame_lines=False) # text body (white-hot)
rng = np.random.default_rng(7)
spk = cv2.GaussianBlur((rng.random((bh, bw)) > 0.9).astype(np.float32), (3, 3), 0)
linesm = layer(0, fill_text=False)
ink = np.maximum(ink - linesm*np.clip(spk*1.2, 0, 0.6), 0)   # light stamp texture on the border only
xq = (bw-qs)//2
qrimg = cv2.resize(qr, (qs, qs), interpolation=cv2.INTER_NEAREST)
def place(m):
    z = np.zeros((H, W), np.float32); z[Y:Y+bh, X:X+bw] = m; return z
big, fb, bq = place(ink), place(fillm), np.zeros((H, W), np.float32); bq[Y+q0:Y+q0+qs, X+xq:X+xq+qs] = 1
img = img*(1 - 0.7*np.clip(cv2.GaussianBlur(np.maximum(big, bq), (0, 0), 8)*2.5, 0, 1))[..., None]
gl = np.clip(cv2.GaussianBlur(big, (0, 0), 9)*1.8, 0, 1); img = img + np.array(NEON, np.float32)*gl[..., None]
gl2 = np.clip(cv2.GaussianBlur(bq, (0, 0), 9)*1.6, 0, 1); img = img + np.array(NEON, np.float32)*gl2[..., None]*0.5
img = over(img, NEON, big)
img = over(img, HOT, fb)
img[Y+q0:Y+q0+qs, X+xq:X+xq+qs] = qrimg

# ---- red stamp: neon glow ----
st = np.zeros((H, W), bool); st[10:285, 15:290] = True
ci = np.clip(img, 0, 255).astype(int)
red = st & (ci[..., 0] > 140) & (ci[..., 0] - ci[..., 1] > 70) & (ci[..., 0] - ci[..., 2] > 50)
rm = cv2.GaussianBlur(red.astype(np.float32), (3, 3), 0)
glr = np.clip(cv2.GaussianBlur(rm, (0, 0), 8)*2.0, 0, 1)
img = img + np.array(NEON, np.float32)*glr[..., None]*0.8
img = over(img, NEON, rm*0.9)
img = over(img, (255, 190, 200), np.clip(cv2.erode(rm, np.ones((3, 3), np.uint8)) - 0.4, 0, 1)*0.7)
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(out)
print('ok', x0, y0, nw, nh)
