# Edits media/ads/MedTime-ad-premium.png in place (Roni's requests 2026-10-23):
# 1) thinner neon frame, 2) URL pill + QR bigger and glowing, below the language row,
# 3) white outline around the letters of the two bottom text rows.
# Input: the PNG from commit ddc63a0. Run: python3 premium_fix1.py IN.png OUT.png
import sys, numpy as np, cv2
from scipy import ndimage as nd
src, out = sys.argv[1], sys.argv[2]
img = cv2.imread(src)[:, :, ::-1].astype(np.float32)  # RGB
H, W = img.shape[:2]
a = img.astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]

def disk(n):
    y, x = np.ogrid[-n:n+1, -n:n+1]; return x*x + y*y <= n*n

# ---- 2) cut out pill and QR (before anything else changes) ----
P = (264, 1199, 690, 1285)    # pill box incl. green rim
Q = (697, 1186, 811, 1300)    # QR card
pill = img[P[1]:P[3], P[0]:P[2]].copy(); qr = img[Q[1]:Q[3], Q[0]:Q[2]].copy()
def shape_alpha(c):
    lum = c.mean(2); m = lum > 70; m = nd.binary_fill_holes(m)
    m = nd.binary_opening(m, disk(1))
    return cv2.GaussianBlur(m.astype(np.float32), (3, 3), 0)
pa, qa = shape_alpha(pill), shape_alpha(qr)

# ---- 3) text masks of the two bottom rows (before inpainting) ----
rows = np.zeros((H, W), bool); rows[1108:1194, 90:1000] = True
green = (np.abs(a - [92, 242, 143]).sum(2) < 60) & rows
yrow = np.zeros((H, W), bool); yrow[1155:1194, 840:960] = True
yellow = (np.abs(a - [255, 213, 74]).sum(2) < 60) & yrow
txt = green | yellow
tl, tn = nd.label(txt, np.ones((3, 3))); ts = nd.sum(txt, tl, range(1, tn+1))
txt = np.isin(tl, np.nonzero(ts >= 6)[0] + 1)
letters = nd.binary_dilation(txt, disk(4))          # fill + black outline

# ---- 1) frame mask ----
fm = ((g > 150) & (g - r > 40) & (g - b > 20)) | ((g > 235) & (r > 120) & (g - r > 30))
lab, n = nd.label(fm, np.ones((3, 3)))
frame = lab == (np.argmax(nd.sum(fm, lab, range(1, n+1))) + 1)
core = frame & (r > 120) & (g > 235)

# ---- inpaint old frame line + old pill/QR area ----
hole = nd.binary_dilation(frame, disk(1)) | (nd.binary_dilation(frame, disk(5)) & (g - r > 12) & (g - b > 0))
area = np.zeros((H, W), bool); area[1189:1306, 250:830] = True
oldglow = (g - r > 25) & (g > 60)
hole |= area & ~letters
u8 = np.clip(img, 0, 255).astype(np.uint8)[:, :, ::-1]
fixed = cv2.inpaint(u8, hole.astype(np.uint8)*255, 6, cv2.INPAINT_TELEA)[:, :, ::-1].astype(np.float32)
# keep the old frame where it lies inside the pill/QR area (bottom line), it is redrawn below
img = fixed

def over(base, col, alpha):
    al = alpha[..., None]; return base*(1-al) + np.array(col, np.float32)*al

# new thin frame: soft glow + 2px white core with 1px green rims
cf = core.astype(np.float32)
glow = cv2.GaussianBlur(nd.binary_dilation(core, disk(1)).astype(np.float32), (0, 0), 5) * 0.9
img = img + np.array([40, 220, 110], np.float32)[None, None]*np.clip(glow, 0, 1)[..., None]*0.55
img = over(img, (46, 224, 112), nd.binary_dilation(core, disk(1)).astype(np.float32))
img = over(img, (190, 250, 195), cf)

# ---- 3) white ring around letters, then put the letters back on top ----
ring_out = nd.binary_dilation(letters, disk(3))
ringA = cv2.GaussianBlur(ring_out.astype(np.float32), (3, 3), 0)
orig = cv2.imread(src)[:, :, ::-1].astype(np.float32)
img = over(img, (255, 255, 255), ringA)
la = cv2.GaussianBlur(letters.astype(np.float32), (3, 3), 0)
img = img*(1-la[..., None]) + orig*la[..., None]

# ---- 2) paste bigger pill + QR with glow ----
def paste(img, c, al, x, y, s, gcol, gstr):
    h, w = c.shape[:2]; nw, nh = int(round(w*s)), int(round(h*s))
    c2 = cv2.resize(c, (nw, nh), interpolation=cv2.INTER_CUBIC); a2 = cv2.resize(al, (nw, nh))
    big = np.zeros((H, W), np.float32); big[y:y+nh, x:x+nw] = a2
    gl = np.clip(cv2.GaussianBlur(big, (0, 0), 9)*gstr, 0, 1)
    img = over(img, gcol, gl*0.85)
    reg = img[y:y+nh, x:x+nw]; img[y:y+nh, x:x+nw] = reg*(1-a2[..., None]) + c2*a2[..., None]
    return img, nh
s = 1.0
top = 1197                               # languages row ends ~1192 incl. new ring
qs = (1302 - top) / qr.shape[0]          # QR fills 1197..1302
ps = 1.12
pw = int(round(pill.shape[1]*ps)); qw = int(round(qr.shape[1]*qs)); gap = 22
x0 = (W - (pw + gap + qw)) // 2
ph = int(round(pill.shape[0]*ps)); py = top + ((1302 - top) - ph)//2
img, _ = paste(img, pill, pa, x0, py, ps, (255, 200, 70), 1.6)
img, _ = paste(img, qr, qa, x0 + pw + gap, top, qs, (255, 255, 255), 1.6)

cv2.imwrite(out, np.clip(img, 0, 255).astype(np.uint8)[:, :, ::-1])
print('ok', x0, pw, qw, ph, py)
