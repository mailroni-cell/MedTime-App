# Tall version round 6 (Roni 2026-10-23 18:43): 1080x2340, laid out again from the same layers.
# - no empty strip at the top
# - the phone is whole (its bottom edge is closed with its own top edge, mirrored) and bigger
# - "העתיד בכף ידך" is not cut: it moves to the right column under the checklist, much bigger
# - the bottom rows are bigger; the background goes on to the bottom (mirror of the photo, blurred, darker)
# Layers come from premium_fix10.py run with MT_DUMP (see handoff/SYNC-LOG.md for the exact commands):
#   MT_TALL=1 MT_DUMP=layers.npz MT_F0=1339 MT_Y0=1340 python3 premium_fix10.py r1b.png orig.png FONTDIR base6.png
#   python3 premium_tall3.py base6.png layers.npz r1b.png FONTDIR OUT.png
import sys, os, numpy as np, cv2
from scipy import ndimage as nd
from PIL import Image, ImageDraw, ImageFont
base_p, lay_p, r1_p, fd, out = sys.argv[1:6]
PS = float(os.environ.get('MT_PS', '1.55'))
T = int(os.environ.get('MT_TOP', '40'))
base = np.array(Image.open(base_p).convert('RGB')).astype(np.float32)
r1 = np.array(Image.open(r1_p).convert('RGB')).astype(int)
d = np.load(lay_p)
W, H = 1080, 2340
SEAM = 1090                                   # base rows below this held the old bottom rows
def disk(n):
    y, x = np.ogrid[-n:n+1, -n:n+1]; return x*x + y*y <= n*n
def inpaint(im, m):
    return cv2.inpaint(np.clip(im, 0, 255).astype(np.uint8), m.astype(np.uint8)*255, 9, cv2.INPAINT_TELEA).astype(np.float32)
B = 5
base[:B] = base[B:B+1]; base[:, :B] = base[:, B:B+1]; base[:, -B:] = base[:, -B-1:-B]

# ---- "העתיד בכף ידך" from the round-1 image: green letters + their dark outline ----
g = (np.abs(r1 - [64, 231, 124]).sum(2) < 90); reg = np.zeros(g.shape, bool); reg[655:822, 55:298] = True; g &= reg
lab, n = nd.label(g, np.ones((3, 3))); sz = nd.sum(g, lab, range(1, n+1))
small = np.isin(lab, np.nonzero(sz < 12)[0] + 1); g = np.isin(lab, np.nonzero(sz >= 12)[0] + 1)
lm = nd.binary_dilation(g, disk(4)) & ~nd.binary_dilation(small, disk(4))   # no specks next to the letters
ys, xs = np.nonzero(lm); ly0, ly1, lx0, lx1 = ys.min(), ys.max()+1, xs.min(), xs.max()+1
lt_img = r1[ly0:ly1, lx0:lx1].astype(np.float32); lt_a = cv2.GaussianBlur(lm[ly0:ly1, lx0:lx1].astype(np.float32), (3, 3), 0)

# ---- background: the base with the old phone and the old side text taken out ----
phone_old = d['phone']; ltm = d['ltm']
rm = nd.binary_dilation(phone_old | ltm | lm, disk(4)); rm[SEAM:] = False
bg = inpaint(base[:SEAM+10], rm[:SEAM+10])[:SEAM]
rt_a = d['rta'][:SEAM]                         # checklist letters, put back over the phone later
# for the continuation under the seam also take the checklist letters out, then mirror and blur
bb = base[:SEAM].astype(int)
tx = ((bb[..., 0] > 190) & (bb[..., 1] > 170) & (bb[..., 2] < 140)) | (bb.min(2) > 190) | ((bb[..., 1] > 170) & (bb[..., 1] - bb[..., 0] > 60))
tx[:540] = False; tx[:, :560] = False
rtm = nd.binary_dilation((d['rta'][:SEAM] > .3) | tx, disk(5))
bgc = inpaint(bg, rtm)
src = bgc[560:SEAM]
L = H - (T + SEAM)
strip = np.concatenate([src[::-1], src, src[::-1], src], 0)[:L]
blur = cv2.GaussianBlur(strip, (0, 0), 16)
yy = np.arange(L, dtype=np.float32)[:, None, None]
w = np.clip(yy/220, 0, 1); w = w*w*(3 - 2*w)
cont = strip*(1 - w) + blur*w
t_ = np.clip(yy/(L*0.45), 0, 1); dk = 1 - 0.66*(t_*t_*(3 - 2*t_))
cont = cont*dk
canvas = np.zeros((H, W, 3), np.float32)
canvas[T:T+SEAM] = bg
canvas[T+SEAM:] = cont
topb = np.repeat(cv2.GaussianBlur(bg[:6].mean(0, keepdims=True), (0, 0), 30), T, 0)
canvas[:T] = topb
j = 14; wj = np.linspace(0, 1, j)[:, None, None]; canvas[T:T+j] = topb[-1:]*(1 - wj) + bg[:j]*wj

# ---- the phone: upright it, cut above the hidden bottom buttons, close it with its own top edge ----
ph, pa = d['ph'], d['pa']; px0, px1, py0, py1 = [int(v) for v in d['box']]
P = 80
ph = cv2.copyMakeBorder(ph, P, P, P, P, cv2.BORDER_CONSTANT); pa = cv2.copyMakeBorder(pa, P, P, P, P, cv2.BORDER_CONSTANT)
hh, ww = pa.shape; ANG = -6.6
M = cv2.getRotationMatrix2D((ww/2, hh/2), ANG, 1); Mi = cv2.invertAffineTransform(M)
u = cv2.warpAffine(ph, M, (ww, hh), flags=cv2.INTER_CUBIC); ua = cv2.warpAffine(pa, M, (ww, hh))
rows = np.nonzero((ua > .5).sum(1) > 200)[0]; TOPR = rows.min()
RE = int(os.environ.get('MT_PRE', '439')); ua[:, RE:] = 0   # nothing right of the frame (old checklist letters)
LE = int(os.environ.get('MT_PLE', '113')); ua[:, :LE] = 0    # nothing left of it (old side text)
u[110:372, LE:142] = u[400:401, LE:142]   # the left frame where the old side text crossed it (the frame is straight here)
CUT = int(os.environ.get('MT_PCUT', '636')); CAP = int(os.environ.get('MT_CAP', '44'))
capi = u[TOPR-14:TOPR-14+CAP][::-1].copy(); capa = ua[TOPR-14:TOPR-14+CAP][::-1].copy()
txt = (capi[..., 0] > 140) & (capi[..., 1] > 190)                          # yellow-green text lines above the phone
capa = capa*(1 - cv2.GaussianBlur(nd.binary_dilation(txt, disk(3)).astype(np.float32), (5, 5), 0))
capa = cv2.erode(capa, np.ones((int(os.environ.get('MT_CAPE', '9')),)*2, np.uint8))
u2 = u.copy(); a2 = ua.copy()
u2[CUT:] = 0; a2[CUT:] = 0
u2[CUT:CUT+CAP] = capi; a2[CUT:CUT+CAP] = capa
k = 12; wk = np.linspace(0, 1, k)[:, None, None]                          # soft join of screen and cap
u2[CUT-k//2:CUT+k//2] = u[CUT-k//2:CUT+k//2]*(1 - wk) + capi[:1]*wk
ph2 = cv2.warpAffine(u2, Mi, (ww, hh), flags=cv2.INTER_CUBIC); pa2 = cv2.warpAffine(a2, Mi, (ww, hh))
ys, xs = np.nonzero(pa2 > .02); cy0, cy1, cx0, cx1 = ys.min(), ys.max()+1, xs.min(), xs.max()+1
ph2, pa2 = ph2[cy0:cy1, cx0:cx1], pa2[cy0:cy1, cx0:cx1]
# where it sat in the base: crop origin (px0-P, py0-P)
ox, oy = px0 - P + cx0, py0 - P + cy0
nw, nh = int(ph2.shape[1]*PS), int(ph2.shape[0]*PS)
phs = cv2.resize(ph2, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
phs = np.clip(phs + (phs - cv2.GaussianBlur(phs, (0, 0), 1.0))*0.6, 0, 255)
pas = np.clip(cv2.resize(pa2, (nw, nh)), 0, 1)
right = ox + ph2.shape[1]
nx0 = int(os.environ.get('MT_PX', str(right - nw))); ny0 = T + oy
nx0 = max(nx0, 14 - int(np.nonzero(pas.max(0) > .5)[0].min()))
sh = np.zeros((H, W), np.float32)
xa, xb = max(nx0, 0), min(nx0 + nw, W); sh[ny0:ny0+nh, xa:xb] = pas[:, xa-nx0:xb-nx0]
canvas = canvas*(1 - 0.55*np.clip(cv2.GaussianBlur(sh, (0, 0), 12)*1.5, 0, 1))[..., None]
gh = np.clip(np.clip(cv2.GaussianBlur(sh, (0, 0), 7)*1.4, 0, 1) - sh, 0, 1)
canvas = canvas + np.array([40, 230, 110], np.float32)*gh[..., None]*0.35
reg = canvas[ny0:ny0+nh, xa:xb]; al = pas[:, xa-nx0:xb-nx0, None]
canvas[ny0:ny0+nh, xa:xb] = reg*(1 - al) + phs[:, xa-nx0:xb-nx0]*al
phone_bottom = int(ny0 + np.nonzero(pas.max(1) > .5)[0].max())
# checklist letters back on top (they cross the phone's right edge)
ra = np.zeros((H, W), np.float32); ra[T:T+SEAM] = rt_a
bl = np.zeros((H, W, 3), np.float32); bl[T:T+SEAM] = base[:SEAM]
canvas = canvas*(1 - ra[..., None]) + bl*ra[..., None]

# ---- "העתיד בכף ידך", much bigger, right column under the checklist ----
colx0 = int(np.nonzero(sh[min(phone_bottom - 40, H-1)] > .5)[0].max()) + 30
LT_TOP = T + int(os.environ.get('MT_LTY0', '1040'))          # just under the checklist
LS = float(os.environ.get('MT_LS', '0'))
if not LS: LS = min((W - 26 - colx0)/lt_img.shape[1], (phone_bottom - 10 - LT_TOP)/lt_img.shape[0])
lw_, lh_ = int(lt_img.shape[1]*LS), int(lt_img.shape[0]*LS)
lti = cv2.resize(lt_img, (lw_, lh_), interpolation=cv2.INTER_LANCZOS4); lti = np.clip(lti + (lti - cv2.GaussianBlur(lti, (0, 0), 1.2))*0.5, 0, 255)
lta = np.clip(cv2.resize(lt_a, (lw_, lh_), interpolation=cv2.INTER_LINEAR), 0, 1)
ltx = W - 26 - lw_
lty = LT_TOP + (phone_bottom - 10 - LT_TOP - lh_)//2
sh2 = np.zeros((H, W), np.float32); sh2[lty:lty+lh_, ltx:ltx+lw_] = lta
canvas = canvas*(1 - 0.5*np.clip(cv2.GaussianBlur(sh2, (0, 0), 10)*1.3, 0, 1))[..., None]
reg = canvas[lty:lty+lh_, ltx:ltx+lw_]; canvas[lty:lty+lh_, ltx:ltx+lw_] = reg*(1 - lta[..., None]) + lti*lta[..., None]

# ---- download lines and bottom rows (same colours and fonts as before, bigger rows) ----
def F(name, size): return ImageFont.truetype(fd + '/' + name + '.ttf', size)
def seg_masks(segs, y, sw):
    Lm = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(Lm)
    ws = [dr.textlength(t, font=f, direction='rtl') if r else dr.textlength(t, font=f) for t, f, r in segs]
    x = (W - sum(ws)) / 2
    for (t, f, r), w_ in zip(segs, ws):
        kw = dict(font=f, fill=255, stroke_width=sw, stroke_fill=255)
        if r: kw['direction'] = 'rtl'
        dr.text((x, y), t, **kw); x += w_
    return np.array(Lm).astype(np.float32)/255
def over(b, col, a): return b*(1 - a[..., None]) + np.array(col, np.float32)*a[..., None]
def paint(img, segs, y, fill, edges):
    for col, sw in edges: img = over(img, col, seg_masks(segs, y, sw))
    return over(img, fill, seg_masks(segs, y, 0))
he = lambda s: F('fredoka-hebrew-700-normal', s); la = lambda s: F('fredoka-latin-700-normal', s)
ar = lambda s: F('rubik-arabic-800-normal', s); ru = lambda s: F('rubik-cyrillic-800-normal', s)
lx = lambda s: F('rubik-latin-ext-800-normal', s)
RED, YEL, NAVY = (255, 36, 64), (244, 255, 26), (10, 22, 52)
GRN, BLK, WHT = (92, 242, 143), (12, 12, 14), (255, 255, 255)
rowsH = 3*92
free = H - 30 - phone_bottom - 250 - rowsH            # room left over, split into 3 equal gaps
gap = max(free//3, 20)
y0 = phone_bottom + gap
canvas = paint(canvas, [(':', la(96), False), ('להורדת האפליקציה', he(96), True)], y0, RED, [(YEL, 5), (NAVY, 2)])
canvas = paint(canvas, [('medtime.pages.dev', la(112), False)], y0 + 125, RED, [(YEL, 6), (NAVY, 2)])
dot = ('  •  ', la(52), False)
def row(img, segs, y): return paint(img, segs, y, GRN, [(WHT, 4), (BLK, 3)])
y1 = y0 + 250 + gap
canvas = row(canvas, [('בלי פרסומות', he(62), True), dot, ('עוזר קולי', he(62), True), dot, ('כרטיס חירום', he(62), True)], y1)
canvas = row(canvas, [('Român', la(58), False), ('ă', lx(56), False), dot, ('العربية', ar(56), True), dot, ('עברית', he(60), True)], y1 + 92)
canvas = row(canvas, [('English', la(58), False), dot, ('Русский', ru(56), False), dot, ('Français', la(58), False)], y1 + 184)
im = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))
ImageDraw.Draw(im).rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)
im.save(out, optimize=True)
print('ok phone', ny0, phone_bottom, 'x', nx0, nx0+nw, 'lt', ltx, lty, lw_, lh_, 'gap', gap, 'end', y1 + 184 + 70)
