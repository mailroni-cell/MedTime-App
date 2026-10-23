# Round 12 (Roni 15:04): phone back to its original size, no dark plate behind 'העתיד בכף ידך', thinner
# white ring round the 2 bottom rows, address filled red and a little higher, 'רק בהשקה!' green like 'חינם'.
# Round 11 (Roni 14:53-14:54): the two lines under the motto bigger; the phone as big as it fits
# (grows to the left and down, top-right corner fixed; "העתיד בכף ידך" stays on top); download lines bigger
# with a fluorescent-yellow edge; the two bottom rows bigger; smooth fade into the dark bottom.
# Run: premium_fix9.py <fix6 output> <ddc63a0.png> <font dir> <out>
# Round 9 (Roni 14:36): the round stamp is erased and drawn again, same layout, one flat ink colour,
# sharp (drawn 4x and scaled down); the address line is bigger with a thinner, sharper edge.
# Run: premium_fix8.py <fix6 output> <ddc63a0.png> <font dir> <out>
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
import sys, os, numpy as np, cv2
TALL = os.environ.get('MT_TALL') == '1'   # base for the tall version: no bottom rows, no download text
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
oi0 = org.astype(int); warmO0 = ((oi0[..., 0] - oi0[..., 2]) > 30) & (np.abs(oi0 - [92, 242, 143]).sum(2) > 120)
gl0_, _ = nd.label(gold, np.ones((3, 3))); dots0 = np.zeros_like(gold)
for i_, o_ in enumerate(nd.find_objects(gl0_)):
    if o_ is not None and (o_[0].stop - o_[0].start) <= 12 and (o_[1].stop - o_[1].start) <= 12 and (gl0_[o_] == i_+1).sum() >= 15 and abs((o_[0].start + o_[0].stop)/2 - np.median(txt.nonzero()[0])) < 8: dots0[o_] |= gl0_[o_] == i_+1
dots = nd.binary_dilation(dots0, disk(2))   # bullet dots only (not the phone's label text)
core0 = ((nd.binary_dilation(txt, disk(2)) & ~nd.binary_dilation(warmO0 & ~dots, disk(2))) | dots) & ~six
core0 &= np.arange(H)[:, None] > (txt.nonzero()[0].min() - 5)
cl0, _ = nd.label(core0); cnt0 = np.bincount(cl0[txt & core0], minlength=cl0.max()+1); cnt0[0] = 0
core0 = np.isin(cl0, np.nonzero(cnt0 >= 25)[0]) | (dots & core0)
rowimg = org[by0:by1, bx0:bx1].astype(np.float32)
rowal = cv2.GaussianBlur((core0 & keep)[by0:by1, bx0:bx1].astype(np.float32), (3, 3), 0)
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
    if sl is not None and (sl[0].stop - sl[0].start) <= 12 and (sl[1].stop - sl[1].start) <= 12 and (gl1[sl] == i+1).sum() >= 15 and abs((sl[0].start + sl[0].stop)/2 - np.median(t1m.nonzero()[0])) < 8:
        dotm[sl] |= gl1[sl] == i + 1
d1 = nd.binary_dilation(dotm, disk(2))
keep1 = lang1 | d1
ys, xs = np.nonzero(keep1); cx0, cx1, cy0, cy1 = xs.min(), xs.max()+1, ys.min(), ys.max()+1
oi = org.astype(int); warmO = ((oi[..., 0] - oi[..., 2]) > 30) & (np.abs(oi - [92, 242, 143]).sum(2) > 120)
core1 = (nd.binary_dilation(t1m, disk(2)) & ~nd.binary_dilation(warmO & ~d1, disk(2))) | d1
cl_, cn_ = nd.label(core1); core1 = np.isin(cl_, np.unique(cl_[(t1m | d1) & core1]))
core1 &= np.arange(H)[:, None] < (t1m.nonzero()[0].max() + 5)
cl1, _ = nd.label(core1); cnt1 = np.bincount(cl1[t1m & core1], minlength=cl1.max()+1); cnt1[0] = 0
core1 = np.isin(cl1, np.nonzero(cnt1 >= 25)[0]) | (d1 & core1)
row1img = org[cy0:cy1, cx0:cx1].astype(np.float32)
ylab = (a[..., 0] > 140) & (a[..., 1] > 110) & (a[..., 2] < 110) & ~d1      # phone label text under the row: leave out
cur_ = img.astype(int)
okpx = (cur_.max(2) < 70) | (cur_.min(2) > 200) | (np.abs(cur_ - [92, 242, 143]).sum(2) < 120) | d1
warm1 = ((cur_[..., 0] - cur_[..., 2]) > 30) & ~d1
keep1 = keep1 & ~nd.binary_dilation(warm1, disk(1))
row1al = cv2.GaussianBlur((core1 & keep1)[cy0:cy1, cx0:cx1].astype(np.float32), (3, 3), 0)

# frame pixels to protect
ci = img.astype(int); g, r, b_ = ci[..., 1], ci[..., 0], ci[..., 2]
fmk = ((g > 150) & (g - r > 40) & (g - b_ > 20)) | ((g > 235) & (r > 120) & (g - r > 30))
lb, nl = nd.label(fmk, np.ones((3, 3)))
frame = np.zeros((H, W), bool)   # old frame already removed by premium_fix6.py

# clear 2: old language row letters + "6 שפות" (thin shapes -> inpaint)
sixm = six & nd.binary_dilation(np.abs(a - [255, 213, 74]).sum(2) < 60, disk(8))
clr = nd.binary_dilation(lang | dots | sixm | keep1, disk(2))
img = inpaint(img, clr & ~frame)

# ---- round 11: the two lines under the motto, bigger (same centres) ----
cu = img.astype(int)
for (ya, yb) in ((418, 462), (476, 524)):
    band_ = np.zeros((H, W), bool); band_[ya:yb, 60:1020] = True
    fillm_ = ((np.abs(cu - [234, 255, 92]).sum(2) < 150) | ((cu[..., 1] > 150) & (cu[..., 1] - cu[..., 2] > 90))) & band_
    lab_, n_ = nd.label(fillm_, np.ones((3, 3))); sz_ = nd.sum(fillm_, lab_, range(1, n_+1))
    fillm_ = np.isin(lab_, np.nonzero(sz_ >= 5)[0] + 1)
    tm_ = nd.binary_closing(nd.binary_dilation(fillm_, disk(5)), disk(3))
    glw = nd.binary_dilation(fillm_, disk(9)) & (cu[..., 1] - cu[..., 0] > 60) & (cu[..., 1] > 120)
    tm_ = tm_ | glw
    ys_, xs_ = np.nonzero(tm_); x0_, x1_, y0_, y1_ = xs_.min(), xs_.max()+1, ys_.min(), ys_.max()+1
    piece = img[y0_:y1_, x0_:x1_].copy(); pal = cv2.GaussianBlur(tm_[y0_:y1_, x0_:x1_].astype(np.float32), (3, 3), 0)
    img = inpaint(img, nd.binary_dilation(tm_, disk(2)))
    sc_ = 1.16 if ya < 470 else 1.12
    nw_, nh_ = int((x1_-x0_)*sc_), int((y1_-y0_)*sc_)
    pc = cv2.resize(piece, (nw_, nh_), interpolation=cv2.INTER_CUBIC); pa_ = cv2.resize(pal, (nw_, nh_))
    cx_, cy_ = (x0_+x1_)//2, (y0_+y1_)//2 + (3 if ya > 470 else -2)
    xa, ya2 = cx_ - nw_//2, cy_ - nh_//2
    reg = img[ya2:ya2+nh_, xa:xa+nw_]; img[ya2:ya2+nh_, xa:xa+nw_] = reg*(1-pa_[..., None]) + pc*pa_[..., None]

# ---- round 11: the phone, bigger (top-right corner stays, it grows left and down) ----
r1 = np.array(Image.open(cur_p).convert('RGB')).astype(int)
gl_ = (r1[..., 1] > 140) & (r1[..., 1] - r1[..., 0] > 50) & (r1[..., 1] - r1[..., 2] > 20)
reg_ = np.zeros((H, W), bool); reg_[500:1130, 220:680] = True
olab, on_ = nd.label(gl_ & reg_, np.ones((3, 3)))
parts = [i+1 for i, sl in enumerate(nd.find_objects(olab)) if sl is not None and (sl[0].stop - sl[0].start) > 100]   # the phone's outline pieces
oy, ox = np.nonzero(np.isin(olab, parts))
pts = list(zip(ox, oy))
# the lower right edge is hidden in the fade: extend the right edge line down to the bottom of the outline
rr = [(y_, ox[oy == y_].max()) for y_ in range(880, 1000) if (oy == y_).any()]
fy = np.polyfit([q[0] for q in rr], [q[1] for q in rr], 1)
yb = oy.max()
pts += [(int(np.polyval(fy, yb - 20)), yb - 20), (int(np.polyval(fy, yb - 20)) - 25, yb)]
hull = cv2.convexHull(np.array(pts, np.int32))
pm = np.zeros((H, W), np.uint8); cv2.fillPoly(pm, [hull], 1)
phone = nd.binary_dilation(pm > 0, disk(6))
ys_, xs_ = np.nonzero(phone); px0, px1, py0, py1 = xs_.min(), xs_.max()+1, ys_.min(), ys_.max()+1
halo = nd.binary_dilation(phone, disk(12)) & ~phone
pal = np.clip(phone.astype(np.float32) + halo.astype(np.float32)*0.0, 0, 1)
pal = cv2.GaussianBlur(pal, (5, 5), 0)
# "העתיד בכף ידך" (left), to put back on top
lt = np.zeros((H, W), bool); lt[620:840, 30:310] = True
ltf = (np.abs(r1 - [64, 231, 124]).sum(2) < 90) & lt
ltm = nd.binary_dilation(ltf, disk(6)) & lt
plate = cv2.GaussianBlur((nd.binary_closing(nd.binary_dilation(ltf, disk(8)), disk(22)) & lt).astype(np.float32), (0, 0), 4)
ltimg = img.copy(); lta = cv2.GaussianBlur(ltm.astype(np.float32), (3, 3), 0)
# checklist text right of the phone, to keep on top too
rt = np.zeros((H, W), bool); rt[540:1030, 600:1075] = True
rtf = rt & ((np.abs(r1 - [234, 255, 92]).sum(2) < 90) | (r1.min(2) > 200) | (np.abs(r1 - [255, 213, 74]).sum(2) < 90) | ((r1[..., 1] > 180) & (r1[..., 1] - r1[..., 0] > 60)))
rtm = nd.binary_dilation(rtf, disk(3)) & rt
rta = cv2.GaussianBlur(rtm.astype(np.float32), (3, 3), 0)
PS = 1.0   # round 12: original size
ph_img = img[py0:py1, px0:px1].copy(); ph_a = pal[py0:py1, px0:px1]
nwp, nhp = int((px1-px0)*PS), int((py1-py0)*PS)
ph2 = cv2.resize(ph_img, (nwp, nhp), interpolation=cv2.INTER_CUBIC); pa2 = cv2.resize(ph_a, (nwp, nhp))
nx0, ny0 = px1 - nwp, py0
sh = np.zeros((H, W), np.float32); sh[ny0:ny0+nhp, nx0:nx0+nwp] = pa2
if PS != 1.0: img = img*(1 - 0.55*np.clip(cv2.GaussianBlur(sh, (0, 0), 10)*1.5, 0, 1))[..., None]      # soft shadow round the bigger phone
gh = np.clip(cv2.GaussianBlur(sh, (0, 0), 7)*1.4, 0, 1) - sh; gh = np.clip(gh, 0, 1)
if PS != 1.0: img = img + np.array([40, 230, 110], np.float32)*gh[..., None]*0.35                       # its thin green glow
reg = img[ny0:ny0+nhp, nx0:nx0+nwp]; img[ny0:ny0+nhp, nx0:nx0+nwp] = reg*(1-pa2[..., None]) + ph2*pa2[..., None]
img = img*(1 - lta[..., None]) + ltimg*lta[..., None]
img = img*(1 - rta[..., None]) + ltimg*rta[..., None]

# clear 1 + fade (round 11): one calm dark colour at the bottom, reached smoothly from above
X0, X1, Y0, Y1 = 4, 1076, 1200, 1346
dark = np.median(img[1300:1340, 200:880].reshape(-1, 3), axis=0)
fill = np.ones((Y1-Y0, X1-X0, 3), np.float32)*dark[None, None]
img[Y0:Y1, X0:X1] = fill
F0 = 1030
tt_ = np.clip((np.arange(F0, Y0) - F0) / float(Y0 - F0), 0, 1); wv = (tt_*tt_*(3 - 2*tt_))[:, None, None]
img[F0:Y0, X0:X1] = img[F0:Y0, X0:X1]*(1 - wv) + dark[None, None]*wv

s = 1.3
nw, nh = int((bx1-bx0)*s), int((by1-by0)*s)
ri = cv2.resize(rowimg, (nw, nh), interpolation=cv2.INTER_CUBIC); ra = cv2.resize(rowal, (nw, nh))
x0 = (W - nw)//2; y0 = 1300 - nh//2
if TALL: ra = ra*0
rg_ = np.zeros((H, W), np.float32); rg_[y0:y0+nh, x0:x0+nw] = ra
rgo = cv2.dilate((rg_ > .5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))).astype(np.float32)
img = over(img, (255, 255, 255), rgo*0.95)   # thin white ring (1px), round 13: dark edge + ring about half as wide
reg = img[y0:y0+nh, x0:x0+nw]; img[y0:y0+nh, x0:x0+nw] = reg*(1-ra[..., None]) + ri*ra[..., None]
s1_ = 1.26
nw1, nh1 = int((cx1-cx0)*s1_), int((cy1-cy0)*s1_)
r1i = cv2.resize(row1img, (nw1, nh1), interpolation=cv2.INTER_CUBIC); r1a = cv2.resize(row1al, (nw1, nh1))
x1_ = (W - nw1)//2; y1_ = y0 - 2 - nh1
if TALL: r1a = r1a*0
rg_ = np.zeros((H, W), np.float32); rg_[y1_:y1_+nh1, x1_:x1_+nw1] = r1a
rgo = cv2.dilate((rg_ > .5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))).astype(np.float32)
img = over(img, (255, 255, 255), rgo*0.95)   # thin white ring (1px), round 13: dark edge + ring about half as wide
reg = img[y1_:y1_+nh1, x1_:x1_+nw1]; img[y1_:y1_+nh1, x1_:x1_+nw1] = reg*(1-r1a[..., None]) + r1i*r1a[..., None]

# leftover phone label specks between the two rows -> background
ci2 = img.astype(int); zone = np.zeros((H, W), bool); zone[y1_+nh1-14:y0+6, 300:800] = True
spec = zone & ((ci2[..., 0] - ci2[..., 2]) > 25)
spec = nd.binary_dilation(spec, disk(2)) & zone & ~((ci2.min(2) > 170))
img[spec] = fill[np.clip(np.nonzero(spec)[0] - Y0, 0, Y1-Y0-1), np.clip(np.nonzero(spec)[1] - X0, 0, X1-X0-1)]

# ---- download text, bottom right, in the title's look (no QR) ----
fhe = ImageFont.truetype(fd + '/fredoka-hebrew-700-normal.ttf', 50)   # round 11: bigger
fla = ImageFont.truetype(fd + '/fredoka-latin-700-normal.ttf', 50)
flaB = ImageFont.truetype(fd + '/fredoka-latin-700-normal.ttf', 55)   # the address, bigger
tl1, tl2 = ('', '') if TALL else ('להורדת האפליקציה', 'medtime.pages.dev')   # the ':' comes from the Latin font (not in the Hebrew one)
cxT, yT1, yT2 = 840, 1052, 1106
def tmask(t, f, y, sw, rtl):
    L = Image.new('L', (W, H), 0); dd_ = ImageDraw.Draw(L)
    w_ = dd_.textlength(t, font=f, direction='rtl') if rtl else dd_.textlength(t, font=f)
    kw = dict(font=f, fill=255, stroke_width=sw, stroke_fill=255)
    if rtl: kw['direction'] = 'rtl'
    if rtl:
        wc = dd_.textlength(':', font=fla); x_ = cxT - (w_ + wc + 2)/2 + wc + 2
        dd_.text((x_, y), t, **kw)
        kw2 = dict(font=fla, fill=255, stroke_width=sw, stroke_fill=255)
        if t: dd_.text((x_ - wc - 2, y), ':', **kw2)
    else:
        dd_.text((cxT - w_/2, y), t, **kw)
    return np.array(L).astype(np.float32)/255
lines_ = [(tl1, fhe, yT1, True), (tl2, flaB, yT2, False)]
red_o = np.maximum.reduce([tmask(*l_[:3], 3, l_[3]) for l_ in lines_])
dark_o = np.maximum.reduce([tmask(*l_[:3], 1, l_[3]) for l_ in lines_])
body = np.maximum.reduce([tmask(*l_[:3], 0, l_[3]) for l_ in lines_])
img = over(img, (244, 255, 26), red_o)   # round 11: fluorescent yellow edge
img = over(img, (10, 22, 52), dark_o)
grad = np.ones((H, W, 3), np.float32)*np.array([255, 36, 64], np.float32)   # round 12: red fill
img = img*(1 - body[..., None]) + grad*body[..., None]

# ---- round stamp: erase the old one, draw a new one in the same layout, flat ink colour, sharp ----
yy_s, xx_s = np.mgrid[0:H, 0:W]
SC, SY = 158, 146
dist_s = np.hypot(xx_s - SC, yy_s - SY)
era = (dist_s < 150) & (xx_s > 3) & (yy_s > 3) & (xx_s < 288)
ci_ = img.astype(int)
ann = (dist_s >= 150) & (dist_s < 175) & (xx_s > 3) & (yy_s > 3) & (ci_.max(2) < 110) & (np.abs(ci_[..., 0] - ci_[..., 2]) < 50)
bgc = np.median(img[ann], axis=0)                      # the calm dark background colour around the stamp
noise = np.random.default_rng(5).normal(0, 2.0, (H, W, 1)).astype(np.float32)
flat = np.ones_like(img)*bgc[None, None] + noise
wE = (np.clip((150 - dist_s) / 14.0, 0, 1) * np.clip((290 - xx_s) / 10.0, 0, 1))[..., None]   # soft edge
img = img*(1 - wE) + flat*wE
K = 4; R0 = 140; SZ = 2*R0*K
st = Image.new('L', (SZ, SZ), 0); ds = ImageDraw.Draw(st); c0 = SZ/2
def circ(r, w): ds.ellipse((c0 - r*K, c0 - r*K, c0 + r*K, c0 + r*K), outline=255, width=int(w*K))
circ(114, 7); circ(78, 3)
fA = ImageFont.truetype(fd + '/rubik-hebrew-800-normal.ttf', 22*K)
arc = 'הורדה לזמן מוגבל'
ws = [ds.textlength(ch, font=fA) for ch in arc]; tot = sum(ws) + 1.5*K*(len(arc) - 1)
rA = 94*K; ang0 = -108                                       # centre of the arc text (upper left, like before)
a_ = np.radians(ang0) + (tot/2)/rA                            # Hebrew: first letter on the right end
for ch, w_ in zip(arc, ws):
    am = a_ - (w_/2)/rA
    if ch != ' ':
        g = Image.new('L', (int(w_ + 8*K), int(32*K)), 0); ImageDraw.Draw(g).text((4*K, 0), ch, font=fA, fill=255)
        g = g.rotate(-(np.degrees(am) + 90), resample=Image.BICUBIC, expand=True)
        px, py = c0 + rA*np.cos(am), c0 + rA*np.sin(am)
        st.paste(255, (int(px - g.width/2), int(py - g.height/2)), g)
    a_ -= (w_ + 1.5*K)/rA
def star(cx_, cy_, r_):
    pts = [(cx_ + (r_ if i % 2 == 0 else r_*.45)*np.cos(np.radians(-90 + 36*i)), cy_ + (r_ if i % 2 == 0 else r_*.45)*np.sin(np.radians(-90 + 36*i))) for i in range(10)]
    ds.polygon(pts, fill=255)
for ad in (52, 76, 100):
    star(c0 + 95*K*np.cos(np.radians(ad)), c0 + 95*K*np.sin(np.radians(ad)), 11*K)
cen = Image.new('L', (SZ, SZ), 0); dc = ImageDraw.Draw(cen)
fB = ImageFont.truetype(fd + '/rubik-hebrew-800-normal.ttf', 58*K); fC = ImageFont.truetype(fd + '/rubik-hebrew-800-normal.ttf', 20*K)
fL = ImageFont.truetype(fd + '/rubik-latin-800-normal.ttf', 20*K)
cenG = Image.new('L', (SZ, SZ), 0); dg = ImageDraw.Draw(cenG)   # round 10: "חינם" in fluorescent green
for t_, f_, y_ in (('חינם', fB, -42), ('רק בהשקה', fC, 24)):
    w_ = dc.textlength(t_, font=f_, direction='rtl')
    extra = dc.textlength('!', font=fL) if f_ is fC else 0
    x_ = c0 - (w_ + extra)/2 + extra
    dg.text((x_, c0 + y_*K), t_, font=f_, fill=255, direction='rtl')
    if extra: dg.text((x_ - extra, c0 + y_*K), '!', font=fL, fill=255)
cen = cen.rotate(10, resample=Image.BICUBIC, center=(c0, c0))
cenG = cenG.rotate(10, resample=Image.BICUBIC, center=(c0, c0)).rotate(8, resample=Image.BICUBIC, center=(c0, c0)).resize((2*R0, 2*R0), Image.LANCZOS)
st = Image.fromarray(np.maximum(np.array(st), np.array(cen)))
st = st.rotate(8, resample=Image.BICUBIC, center=(c0, c0))   # the whole stamp a little tilted
st = st.resize((2*R0, 2*R0), Image.LANCZOS)
sa = np.zeros((H, W), np.float32); sa[SY-R0:SY+R0, SC-R0:SC+R0] = np.array(st).astype(np.float32)/255
INK = (232, 30, 58)
img = over(img, INK, sa)
ga = np.zeros((H, W), np.float32); ga[SY-R0:SY+R0, SC-R0:SC+R0] = np.array(cenG).astype(np.float32)/255
img = over(img, (57, 255, 106), ga)
im_ = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
ImageDraw.Draw(im_).rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)   # blue edge frame
im_.save(out)
print('ok', x0, y0, nw, nh)
