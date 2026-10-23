# Order: premium_fix6.py (round-1 image) -> this script.
# Round 5 (Roni 14:13): download stamp: green bold 'להורדת התוכנה', address in ONE line,
# thin green halo; red round stamp letters get a thin green outline. Otherwise = round 3.
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
c0_ = img.astype(int)
ok0 = (c0_.max(2) < 70) | (c0_.min(2) > 200) | (np.abs(c0_ - [92, 242, 143]).sum(2) < 120) | dots
warm0 = ((c0_[..., 0] - c0_[..., 2]) > 30) & ~dots
keep = keep & ~nd.binary_dilation(warm0, disk(1))      # leave out the phone's label text under the row
ys, xs = np.nonzero(keep); bx0, bx1, by0, by1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
rowimg = img[by0:by1, bx0:bx1].copy()
rowal = cv2.GaussianBlur(keep[by0:by1, bx0:bx1].astype(np.float32), (3, 3), 0)
# row 1 ("עוזר קולי • בלי פרסומות • כרטיס חירום"): same way (round 7: both rows go lower, closer)
row1 = np.zeros((H, W), bool); row1[1108:1155, 90:1000] = True
t1m = (np.abs(a - [92, 242, 143]).sum(2) < 60) & row1
l1, n1 = nd.label(t1m, np.ones((3, 3))); s1 = nd.sum(t1m, l1, range(1, n1+1))
t1m = np.isin(l1, np.nonzero(s1 >= 6)[0] + 1)
lang1 = nd.binary_dilation(nd.binary_dilation(t1m, disk(4)), disk(3))
gold1 = (np.abs(a - [205, 170, 110]).sum(2) < 90) & row1 & (a[..., 1] < 200)
gold1 &= nd.binary_dilation(lang1, disk(25)) & ~nd.binary_dilation(lang1, disk(0))
gl1, gn1 = nd.label(gold1, np.ones((3, 3)))
dotm = np.zeros_like(gold1)
for i, sl in enumerate(nd.find_objects(gl1)):   # bullet dots only: small and round
    if sl is not None and (sl[0].stop - sl[0].start) <= 12 and (sl[1].stop - sl[1].start) <= 12 and (gl1[sl] == i+1).sum() >= 15:
        dotm[sl] |= gl1[sl] == i + 1
d1 = nd.binary_dilation(dotm, disk(2))
keep1 = lang1 | d1
ys, xs = np.nonzero(keep1); cx0, cx1, cy0, cy1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
row1img = img[cy0:cy1, cx0:cx1].copy()
ylab = (a[..., 0] > 140) & (a[..., 1] > 110) & (a[..., 2] < 110) & ~d1      # phone label text under the row: leave out
cur_ = img.astype(int)
okpx = (cur_.max(2) < 70) | (cur_.min(2) > 200) | (np.abs(cur_ - [92, 242, 143]).sum(2) < 120) | d1
warm1 = ((cur_[..., 0] - cur_[..., 2]) > 30) & ~d1
keep1 = keep1 & ~nd.binary_dilation(warm1, disk(1))
row1al = cv2.GaussianBlur(keep1[cy0:cy1, cx0:cx1].astype(np.float32), (3, 3), 0)

# frame pixels to protect
ci = img.astype(int); g, r, b_ = ci[..., 1], ci[..., 0], ci[..., 2]
fmk = ((g > 150) & (g - r > 40) & (g - b_ > 20)) | ((g > 235) & (r > 120) & (g - r > 30))
lb, nl = nd.label(fmk, np.ones((3, 3)))
frame = np.zeros((H, W), bool)   # old frame already removed by premium_fix6.py

# clear 2: old language row letters + "6 שפות" (thin shapes -> inpaint)
sixm = six & nd.binary_dilation(np.abs(a - [255, 213, 74]).sum(2) < 60, disk(8))
clr = nd.binary_dilation(lang | dots | sixm | keep1, disk(2))
img = inpaint(img, clr & ~frame)

# clear 1: the pill/QR band -> per-row blend of the background just left/right of it
X0, X1, Y0, Y1 = 118, 966, 1184, 1342
lc = img[Y0:Y1, X0-8:X0-3].mean(1); rc = img[Y0:Y1, X1+3:X1+8].mean(1)
t = np.linspace(0, 1, X1-X0)[None, :, None]
fill = lc[:, None]*(1-t) + rc[:, None]*t
fill = cv2.GaussianBlur(fill, (0, 0), 2)
fm = ~frame[Y0:Y1, X0:X1]
ramp = np.clip((np.arange(Y1-Y0) + 1) / 5.0, 0, 1)[:, None, None]  # soft top edge
blk = img[Y0:Y1, X0:X1]; new = blk*(1-ramp) + fill*ramp
blk[fm] = new[fm]; img[Y0:Y1, X0:X1] = blk
# paste language row, bigger, centred lower
s = 1.15
nw, nh = int((bx1-bx0)*s), int((by1-by0)*s)
ri = cv2.resize(rowimg, (nw, nh), interpolation=cv2.INTER_CUBIC); ra = cv2.resize(rowal, (nw, nh))
x0 = (W - nw)//2; y0 = 1298 - nh//2
reg = img[y0:y0+nh, x0:x0+nw]; img[y0:y0+nh, x0:x0+nw] = reg*(1-ra[..., None]) + ri*ra[..., None]
s1_ = 1.1
nw1, nh1 = int((cx1-cx0)*s1_), int((cy1-cy0)*s1_)
r1i = cv2.resize(row1img, (nw1, nh1), interpolation=cv2.INTER_CUBIC); r1a = cv2.resize(row1al, (nw1, nh1))
x1_ = (W - nw1)//2; y1_ = y0 - 4 - nh1
reg = img[y1_:y1_+nh1, x1_:x1_+nw1]; img[y1_:y1_+nh1, x1_:x1_+nw1] = reg*(1-r1a[..., None]) + r1i*r1a[..., None]

# leftover phone label specks between the two rows -> background
ci2 = img.astype(int); zone = np.zeros((H, W), bool); zone[y1_+nh1-14:y0+6, 300:800] = True
spec = zone & ((ci2[..., 0] - ci2[..., 2]) > 25)
spec = nd.binary_dilation(spec, disk(2)) & zone & ~((ci2.min(2) > 170))
img[spec] = fill[np.clip(np.nonzero(spec)[0] - Y0, 0, Y1-Y0-1), np.clip(np.nonzero(spec)[1] - X0, 0, X1-X0-1)]

# ---- download stamp, top-right (mirror of the red stamp) ----
NEON = (255, 52, 92); HOT = (255, 244, 246); GRN = (60, 245, 120)
bw, bh = 250, 240; X, Y = 1080 - 8 - bw, 22
fh = ImageFont.truetype(fd + '/rubik-hebrew-800-normal.ttf', 31)
fu = ImageFont.truetype(fd + '/rubik-latin-800-normal.ttf', 23)
t1, t2 = 'להורדת התוכנה', 'medtime.pages.dev'
q0, qs = 92, 132
def L_(draw_fn):
    L = Image.new('L', (bw, bh), 0); draw_fn(ImageDraw.Draw(L)); return np.array(L).astype(np.float32)/255
def border(d):
    d.rounded_rectangle((2, 2, bw-3, bh-3), 18, outline=255, width=4)
    d.rounded_rectangle((9, 9, bw-10, bh-10), 13, outline=255, width=2)
    d.rounded_rectangle(((bw-qs)/2-5, q0-5, (bw+qs)/2+5, q0+qs+5), 8, outline=255, width=3)
dd = ImageDraw.Draw(Image.new('L', (1, 1)))
w1 = dd.textlength(t1, font=fh, direction='rtl'); w2 = dd.textlength(t2, font=fu)
def t1f(d, sw=0): d.text(((bw-w1)/2, 14), t1, font=fh, fill=255, direction='rtl', stroke_width=sw, stroke_fill=255)
def t2f(d, sw=0): d.text(((bw-w2)/2, 56), t2, font=fu, fill=255, stroke_width=sw, stroke_fill=255)
bord = L_(border)
rng = np.random.default_rng(7)
spk = cv2.GaussianBlur((rng.random((bh, bw)) > 0.9).astype(np.float32), (3, 3), 0)
bord = np.maximum(bord - bord*np.clip(spk*1.2, 0, 0.6), 0)   # light stamp texture on the border
h1, h1s = L_(lambda d: t1f(d)), L_(lambda d: t1f(d, 2))
h2, h2s = L_(lambda d: t2f(d)), L_(lambda d: t2f(d, 2))
xq = (bw-qs)//2
qrimg = cv2.resize(qr, (qs, qs), interpolation=cv2.INTER_NEAREST)
def place(m):
    z = np.zeros((H, W), np.float32); z[Y:Y+bh, X:X+bw] = m; return z
B, T1, T1s, T2, T2s = place(bord), place(h1), place(h1s), place(h2), place(h2s)
bq = np.zeros((H, W), np.float32); bq[Y+q0:Y+q0+qs, X+xq:X+xq+qs] = 1
allm = np.maximum.reduce([B, T1s, T2s, bq])
img = img*(1 - 0.75*np.clip(cv2.GaussianBlur(allm, (0, 0), 7)*3, 0, 1))[..., None]      # dark plate
img = img + np.array(GRN, np.float32)*np.clip(cv2.GaussianBlur(np.maximum(B, bq), (0, 0), 3)*1.4, 0, 1)[..., None]*0.8  # thin green halo
img = over(img, NEON, B)
img = over(img, (0, 0, 0), T1s); img = over(img, GRN, T1)         # green bold heading, dark edge
img = over(img, NEON, T2s); img = over(img, HOT, T2)              # address: white with red edge
img[Y+q0:Y+q0+qs, X+xq:X+xq+qs] = qrimg

# ---- red stamp: neon glow ----
st = np.zeros((H, W), bool); st[10:285, 15:290] = True
ci = np.clip(img, 0, 255).astype(int)
red = st & (ci[..., 0] > 140) & (ci[..., 0] - ci[..., 1] > 70) & (ci[..., 0] - ci[..., 2] > 50)
rm = cv2.GaussianBlur(red.astype(np.float32), (3, 3), 0)
glr = np.clip(cv2.GaussianBlur(rm, (0, 0), 8)*2.0, 0, 1)
img = img + np.array(NEON, np.float32)*glr[..., None]*0.45
img = over(img, NEON, rm*0.9)
img = over(img, (255, 190, 200), np.clip(cv2.erode(rm, np.ones((3, 3), np.uint8)) - 0.4, 0, 1)*0.7)
# ---- red stamp letters: thin green outline (not the two rings) ----
lb2, n2 = nd.label(red, np.ones((3, 3)))
keepL = np.zeros_like(red)
for i, sl in enumerate(nd.find_objects(lb2)):
    if sl is None: continue
    if (sl[0].stop - sl[0].start) < 90 and (sl[1].stop - sl[1].start) < 90:
        keepL[sl] |= lb2[sl] == i + 1
letters_r = nd.binary_closing(keepL, disk(2))
ol = nd.binary_dilation(letters_r, disk(1)) & ~letters_r
img = over(img, (70, 255, 130), ol.astype(np.float32))
im_ = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
ImageDraw.Draw(im_).rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)   # blue edge frame
im_.save(out)
print('ok', x0, y0, nw, nh)
