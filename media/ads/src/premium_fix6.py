# Round 6 (Roni 14:13): removes the old neon frame completely, repairs the 22:00 box,
# blue frame right on the outer edge. Runs FIRST, on the round-1 image; then premium_fix5.py.
# Round 4 (Roni 14:04): remove the neon ECG frame; instead a thin, plain frame at the very edge
# in the MedTime title blue (#0fb8ff), touching nothing. Run on the round-3 image.
import sys, numpy as np, cv2
from scipy import ndimage as nd
from PIL import Image
src, out = sys.argv[1:3]
img = np.array(Image.open(src).convert('RGB'))
a = img.astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
H, W = r.shape
def disk(n):
    y, x = np.ogrid[-n:n+1, -n:n+1]; return x*x + y*y <= n*n
m = ((g > 120) & (g - r > 35) & (g - b > 15)) | ((g > 220) & (r > 110) & (g - r > 25))
lab, n = nd.label(m, np.ones((3, 3)))
frame = lab == (np.argmax(nd.sum(m, lab, range(1, n+1))) + 1)
yy, xx = np.mgrid[0:H, 0:W]
band = (xx < 56) | (xx > 1040) | (yy < 52) | (yy > 1284)   # frame only
boxes = (xx > 980) & (xx < 1048) & (yy > 585) & (yy < 1045)   # keep the check boxes
band &= ~boxes
band |= (xx > 1012) & (yy > 1045)   # lower right: old frame glow column
frame &= band
# the old line + its soft green glow around it
near = nd.binary_dilation(frame, disk(9))
glow = band & (g - r > 6) & (g - b > -8)
glow = nd.binary_dilation(glow, disk(2)) & band
near2 = nd.binary_dilation(frame, disk(12)) & band
warm = near2 & (g > 90) & (g - b > 10)          # yellowish mix of green glow over the red stamp
hole = nd.binary_dilation(frame, disk(4)) | glow | nd.binary_dilation(warm, disk(2))
fixed = cv2.inpaint(img[:, :, ::-1].copy(), hole.astype(np.uint8)*255, 9, cv2.INPAINT_TELEA)[:, :, ::-1]
# (where the old frame crossed the red stamp the ring now has small gaps, like a worn rubber stamp)
im = Image.fromarray(fixed)
from PIL import ImageDraw
d = ImageDraw.Draw(im)
d.rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)
im.save(out)
print('frame px', frame.sum())

# repair the 22:00 check box (damaged by the old frame spike + glowing dot in round 1):
# clean the area, then copy the identical 18:00 check box from the original ad (ddc63a0)
if len(sys.argv) > 3:
    org = np.array(Image.open(sys.argv[3]).convert('RGB'))
    im2 = np.array(Image.open(out).convert('RGB'))
    ci = im2.astype(int)
    area = np.zeros((H, W), bool); area[862:962, 1004:1068] = True
    blob = area & ((ci[..., 1] - ci[..., 0] > 30) | (ci.min(2) > 225) | (np.abs(ci - [72, 72, 72]).sum(2) < 60))
    blob = nd.binary_dilation(blob, disk(3)) & area
    im2 = cv2.inpaint(im2[:, :, ::-1].copy(), blob.astype(np.uint8)*255, 7, cv2.INPAINT_TELEA)[:, :, ::-1].copy()
    tpl = org[795:841, 981:1027]
    al = np.zeros((46, 46), np.uint8); cv2.rectangle(al, (2, 2), (43, 43), 255, -1)
    al = cv2.GaussianBlur(al, (3, 3), 0).astype(np.float32)[..., None]/255
    y0, x0 = 875, 1011
    reg = im2[y0:y0+46, x0:x0+46].astype(np.float32)
    im2[y0:y0+46, x0:x0+46] = (reg*(1-al) + tpl*al).astype(np.uint8)
    im = Image.fromarray(im2); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W-1, H-1), outline=(15, 184, 255), width=4)
    im.save(out)
