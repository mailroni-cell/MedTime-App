# Round 8 (Roni 14:29): no download stamp; bottom-right text 'להורדת האפליקציה:' + address in the
# title's look (rounded bold, blue, red edge), no QR; red stamp without the big glow, thin green line
# round all its letters and shapes; the dark bottom fades in gradually.
# Order: premium_fix6.py (round-1 image) -> this script (premium_fix7.py).
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
X0, X1, Y0, Y1 = 8, 1072, 1184, 1342
lc = img[Y0:Y1, X0-3:X0+2].mean(1); rc = img[Y0:Y1, X1-2:X1+3].mean(1)
t = np.linspace(0, 1, X1-X0)[None, :, None]
fill = lc[:, None]*(1-t) + rc[:, None]*t
fill = cv2.GaussianBlur(fill, (0, 0), 2)
fm = ~frame[Y0:Y1, X0:X1]
ramp = np.clip((np.arange(Y1-Y0) + 1) / 5.0, 0, 1)[:, None, None]  # soft top edge
blk = img[Y0:Y1, X0:X1]; new = blk*(1-ramp) + fill*ramp
blk[fm] = new[fm]; img[Y0:Y1, X0:X1] = blk
# gradual fade from the picture into the dark bottom (no hard edge)
F0 = 1096
wv = (np.clip((np.arange(F0, Y0) - F0) / float(Y0 - F0), 0, 1) ** 1.5)[:, None, None]
img[F0:Y0, X0:X1] = img[F0:Y0, X0:X1]*(1 - wv) + fill[0][None]*wv
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

# ---- download text, bottom right, in the title's look (no QR) ----
fhe = ImageFont.truetype(fd + '/fredoka-hebrew-700-normal.ttf', 40)
fla = ImageFont.truetype(fd + '/fredoka-latin-700-normal.ttf', 40)
tl1, tl2 = 'להורדת האפליקציה', 'medtime.pages.dev'   # the ':' comes from the Latin font (not in the Hebrew one)
cxT, yT1, yT2 = 852, 1060, 1110
def tmask(t, f, y, sw, rtl):
    L = Image.new('L', (W, H), 0); dd_ = ImageDraw.Draw(L)
    w_ = dd_.textlength(t, font=f, direction='rtl') if rtl else dd_.textlength(t, font=f)
    kw = dict(font=f, fill=255, stroke_width=sw, stroke_fill=255)
    if rtl: kw['direction'] = 'rtl'
    if rtl:
        wc = dd_.textlength(':', font=fla); x_ = cxT - (w_ + wc + 2)/2 + wc + 2
        dd_.text((x_, y), t, **kw)
        kw2 = dict(font=fla, fill=255, stroke_width=sw, stroke_fill=255); dd_.text((x_ - wc - 2, y), ':', **kw2)
    else:
        dd_.text((cxT - w_/2, y), t, **kw)
    return np.array(L).astype(np.float32)/255
lines_ = [(tl1, fhe, yT1, True), (tl2, fla, yT2, False)]
red_o = np.maximum.reduce([tmask(*l_[:3], 6, l_[3]) for l_ in lines_])
dark_o = np.maximum.reduce([tmask(*l_[:3], 3, l_[3]) for l_ in lines_])
body = np.maximum.reduce([tmask(*l_[:3], 0, l_[3]) for l_ in lines_])
img = img*(1 - 0.5*np.clip(cv2.GaussianBlur(red_o, (0, 0), 6)*2, 0, 1))[..., None]   # soft shadow
img = over(img, (255, 42, 74), red_o)
img = over(img, (10, 22, 52), dark_o)
grad = np.zeros((H, W, 3), np.float32)
for y_ in range(H):
    for (yy_, h_) in ((yT1, 48), (yT2, 48)):
        if yy_ <= y_ < yy_ + h_:
            t_ = (y_ - yy_) / h_
            grad[y_] = np.array([150, 236, 255])*(1-t_) + np.array([20, 120, 255])*t_ if t_ < 1 else 0
img = img*(1 - body[..., None]) + grad*body[..., None]

# ---- red stamp: no glow; a thin green line round all its letters and shapes ----
st = np.zeros((H, W), bool); st[10:285, 15:290] = True
ci = np.clip(img, 0, 255).astype(int)
red = st & (ci[..., 0] > 140) & (ci[..., 0] - ci[..., 1] > 70) & (ci[..., 0] - ci[..., 2] > 50)
shape = nd.binary_closing(red, disk(1))
ol = nd.binary_dilation(shape, disk(1)) & ~shape
img = over(img, (70, 255, 130), ol.astype(np.float32))
im_ = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
ImageDraw.Draw(im_).rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)   # blue edge frame
im_.save(out)
print('ok', x0, y0, nw, nh)
