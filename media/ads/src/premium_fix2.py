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

# ---- stamp-style neon download block under the stamp ----
NEON = (255, 52, 92); HOT = (255, 200, 210)
bw, bh = 214, 196; L = Image.new('L', (bw, bh), 0); d = ImageDraw.Draw(L)
d.rounded_rectangle((3, 3, bw-4, bh-4), 16, outline=255, width=4)
d.rounded_rectangle((10, 10, bw-11, bh-11), 11, outline=255, width=2)
fh = ImageFont.truetype(fd + '/rubik-hebrew-800-normal.ttf', 27)
fl = ImageFont.truetype(fd + '/rubik-latin-800-normal.ttf', 18)
t1 = 'להורדת התוכנה'; t2 = 'medtime.pages.dev'
w1 = d.textlength(t1, font=fh, direction='rtl'); d.text(((bw-w1)/2, 14), t1, font=fh, fill=255, direction='rtl')
w2 = d.textlength(t2, font=fl); d.text(((bw-w2)/2, 47), t2, font=fl, fill=255)
T = Image.new('L', (bw, bh), 0); dt = ImageDraw.Draw(T)
dt.text(((bw-w1)/2, 14), t1, font=fh, fill=255, direction='rtl', stroke_width=2, stroke_fill=255); dt.text(((bw-w2)/2, 47), t2, font=fl, fill=255, stroke_width=2, stroke_fill=255)
F = Image.new('L', (bw, bh), 0); df = ImageDraw.Draw(F)
df.text(((bw-w1)/2, 14), t1, font=fh, fill=255, direction='rtl'); df.text(((bw-w2)/2, 47), t2, font=fl, fill=255)
fillm = np.array(F).astype(np.float32)/255
txtm = np.array(T).astype(np.float32)/255
q0, qs = 72, 112                       # QR slot
d.rounded_rectangle(((bw-qs)/2-5, q0-5, (bw+qs)/2+5, q0+qs+5), 8, outline=255, width=3)
ink = np.array(L).astype(np.float32)/255
rng = np.random.default_rng(7)         # stamp ink texture (small gaps, like the red stamp)
spk = cv2.GaussianBlur((rng.random((bh, bw)) > 0.86).astype(np.float32), (3, 3), 0)
ink = np.maximum(ink*np.clip(1 - spk*1.3, 0.25, 1), txtm)
ang = 4                                 # slight stamp tilt
M = cv2.getRotationMatrix2D((bw/2, bh/2), ang, 1.0)
inkR = cv2.warpAffine(ink, M, (bw, bh))
qrimg = cv2.resize(qr, (qs, qs), interpolation=cv2.INTER_NEAREST)
qcard = np.zeros((bh, bw, 3), np.float32); qmask = np.zeros((bh, bw), np.float32)
xq = (bw-qs)//2; qcard[q0:q0+qs, xq:xq+qs] = qrimg; qmask[q0:q0+qs, xq:xq+qs] = 1
qcardR = cv2.warpAffine(qcard, M, (bw, bh), flags=cv2.INTER_LINEAR); qmaskR = cv2.warpAffine(qmask, M, (bw, bh))
X, Y = 40, 268
big = np.zeros((H, W), np.float32); big[Y:Y+bh, X:X+bw] = inkR
bq = np.zeros((H, W), np.float32); bq[Y:Y+bh, X:X+bw] = qmaskR
img = img*(1 - 0.6*np.clip(cv2.GaussianBlur(np.maximum(big, bq), (0, 0), 6)*2, 0, 1))[..., None]   # darken behind
gl = np.clip(cv2.GaussianBlur(big, (0, 0), 9)*1.8, 0, 1); img = img + np.array(NEON, np.float32)*gl[..., None]*1.0
gl2 = np.clip(cv2.GaussianBlur(bq, (0, 0), 8)*1.6, 0, 1); img = img + np.array(NEON, np.float32)*gl2[..., None]*0.5
img = over(img, NEON, big)
fb = np.zeros((H, W), np.float32); fb[Y:Y+bh, X:X+bw] = cv2.warpAffine(fillm, M, (bw, bh))
img = over(img, HOT, np.clip(cv2.erode(big, np.ones((2, 2), np.uint8)) - 0.5, 0, 1)*1.2)
img = over(img, (255, 236, 240), fb)
reg = img[Y:Y+bh, X:X+bw]; img[Y:Y+bh, X:X+bw] = reg*(1-qmaskR[..., None]) + qcardR*qmaskR[..., None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(out)
print('ok', x0, y0, nw, nh)
