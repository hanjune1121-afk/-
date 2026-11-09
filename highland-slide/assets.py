import sys
from PIL import Image, ImageDraw, ImageFilter
DPI = 200
W, H = 13.333, 7.5
def px(v): return int(round(v * DPI))

# Background: light right side, slightly darker diagonal left panel (as in reference slide)
bg = Image.new("RGB", (px(W), px(H)), (0xF1, 0xF1, 0xF1))
d = ImageDraw.Draw(bg)
d.polygon([(0, 0), (px(2.3), 0), (px(6.95), px(H)), (0, px(H))], fill=(0xE8, 0xE8, 0xE8))
bg.save("bg.png")

# Soft ground shadow under the Venn cluster
cx, top, r, s = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
ay = top + r
cy = ay + s * 0.8660254
centers = [(cx - s / 2, ay), (cx + s / 2, ay), (cx, cy)]
m = 0.6
x0, y0 = cx - s / 2 - r - m, top - m
x1, y1 = cx + s / 2 + r + m, cy + r + m
im = Image.new("L", (px(x1 - x0), px(y1 - y0)), 0)
dd = ImageDraw.Draw(im)
off = 0.12
for (x, y) in centers:
    dd.ellipse([px(x - r - x0), px(y - r - y0 + off), px(x + r - x0), px(y + r - y0 + off)], fill=255)
im = im.filter(ImageFilter.GaussianBlur(px(0.16)))
alpha = im.point(lambda v: int(v * 0.30))
sh = Image.new("RGBA", im.size, (0x2E, 0x3D, 0x28, 0))
sh.putalpha(alpha)
sh.save("venn_shadow.png")
print(f"{x0:.4f} {y0:.4f} {x1-x0:.4f} {y1-y0:.4f}")
