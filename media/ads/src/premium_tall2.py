# Tall version round 3 (Roni 15:25-15:27): 1080x2340 (about 9:19.5, the shape of most phones today).
# Base = the 4:5 ad built by premium_fix10.py with MT_TALL=1 (no download text, no bottom rows);
# the space above is the top's plain dark; the big dark area below gets the download lines and the
# bottom rows written again, much bigger, in the same colours and fonts. Nothing is stretched.
# Run: MT_TALL=1 python3 premium_fix10.py ... base.png ; python3 premium_tall2.py base.png FONTDIR OUT.png
import sys, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
src, fd, out = sys.argv[1:4]
ad = np.array(Image.open(src).convert('RGB')).astype(np.float32)
W, H = 1080, 2340
B = 5
ad[:B] = ad[B:B+1]; ad[:, :B] = ad[:, B:B+1]; ad[:, -B:] = ad[:, -B-1:-B]
CUT = 1196                                   # the base is used down to the start of its dark bottom
TOP = 220
canvas = np.zeros((H, W, 3), np.float32)
top = np.repeat(cv2.GaussianBlur(ad[B:B+6].mean(0, keepdims=True), (0, 0), 40), TOP, 0)
canvas[:TOP] = top + np.random.default_rng(1).normal(0, 1.2, top.shape).astype(np.float32)
canvas[TOP:TOP+CUT] = ad[:CUT]
dark = np.median(ad[CUT-6:CUT, 100:-100].reshape(-1, 3), axis=0)
canvas[TOP+CUT:] = dark
j = 20; w_ = np.linspace(0, 1, j)[:, None, None]
canvas[TOP:TOP+j] = top[-1:]*(1-w_) + ad[:j]*w_

def F(name, size): return ImageFont.truetype(fd + '/' + name + '.ttf', size)
def seg_masks(segs, y, sw):
    """segs: [(text, font, rtl)] drawn left to right, centred; returns a 0..1 mask."""
    L = Image.new('L', (W, H), 0); d = ImageDraw.Draw(L)
    ws = [d.textlength(t, font=f, direction='rtl') if r else d.textlength(t, font=f) for t, f, r in segs]
    x = (W - sum(ws)) / 2
    for (t, f, r), w in zip(segs, ws):
        kw = dict(font=f, fill=255, stroke_width=sw, stroke_fill=255)
        if r: kw['direction'] = 'rtl'
        d.text((x, y), t, **kw); x += w
    return np.array(L).astype(np.float32)/255
def over(base, col, al): return base*(1-al[..., None]) + np.array(col, np.float32)*al[..., None]
def paint(img, segs, y, fill, edges):
    for col, sw in edges: img = over(img, col, seg_masks(segs, y, sw))
    return over(img, fill, seg_masks(segs, y, 0))

he = lambda s: F('fredoka-hebrew-700-normal', s); la = lambda s: F('fredoka-latin-700-normal', s)
ar = lambda s: F('rubik-arabic-800-normal', s); ru = lambda s: F('rubik-cyrillic-800-normal', s)
lx = lambda s: F('rubik-latin-ext-800-normal', s)
img = canvas
# download (red fill, fluorescent-yellow edge, thin dark line)
RED, YEL, NAVY = (255, 36, 64), (244, 255, 26), (10, 22, 52)
y0 = TOP + CUT + 60
img = paint(img, [(':', la(76), False), ('להורדת האפליקציה', he(76), True)], y0, RED, [(YEL, 5), (NAVY, 2)])
img = paint(img, [('medtime.pages.dev', la(96), False)], y0 + 100, RED, [(YEL, 5), (NAVY, 2)])
# bottom rows (green fill, dark edge, thin white ring), two lines each
GRN, BLK, WHT = (92, 242, 143), (12, 12, 14), (255, 255, 255)
dot = ('  •  ', la(64), False)
dotg = (205, 170, 110)
def row(img, segs, y):
    img = paint(img, segs, y, GRN, [(WHT, 5), (BLK, 3)])
    return img
y1 = y0 + 320
img = row(img, [('בלי פרסומות', he(70), True), dot, ('עוזר קולי', he(70), True)], y1)
img = row(img, [('כרטיס חירום', he(70), True)], y1 + 100)
img = row(img, [('Român', la(60), False), ('ă', lx(58), False), dot, ('العربية', ar(58), True), dot, ('עברית', he(62), True)], y1 + 245)
img = row(img, [('English', la(60), False), dot, ('Русский', ru(58), False), dot, ('Français', la(60), False)], y1 + 335)
im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
ImageDraw.Draw(im).rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)
im.save(out, optimize=True)
print('ok', y1 + 335 + 80)
