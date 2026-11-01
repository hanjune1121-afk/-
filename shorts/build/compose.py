"""Composite captions/stickers/zoom transitions onto the cut segments and encode the final short."""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "fonts")
W, H, FPS = 1080, 1920, 30
EMOJI_FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"

YELLOW = (255, 226, 64)
WHITE = (255, 255, 255)
BLACK = (18, 18, 22)
PURPLE = (92, 56, 168)
PINK = (255, 92, 160)
GREEN = (30, 125, 64)
RED = (235, 40, 70)

_fc = {}
def font(name, size):
    k = (name, size)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(os.path.join(FONTS, f"Pretendard-{name}.otf"), size)
    return _fc[k]

def is_emoji(ch):
    cp = ord(ch)
    return 0x1F000 <= cp <= 0x1FAFF or 0x2600 <= cp <= 0x27BF

_ec = {}
def emoji_img(ch, size):
    k = (ch, size)
    if k not in _ec:
        f = ImageFont.truetype(EMOJI_FONT, 109)
        im = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
        ImageDraw.Draw(im).text((10, 10), ch, font=f, embedded_color=True)
        im = im.crop(im.getbbox())
        s = size / im.height
        _ec[k] = im.resize((max(1, round(im.width * s)), size), Image.LANCZOS)
    return _ec[k]

def runs(text):
    out, cur, cur_e = [], "", None
    for ch in text:
        if ch == "️":
            continue
        e = is_emoji(ch)
        if cur and e != cur_e:
            out.append((cur, cur_e)); cur = ""
        cur += ch; cur_e = e
    if cur:
        out.append((cur, cur_e))
    return out

def text_line(parts, size, weight="Black", stroke=None, stroke_color=BLACK, shadow=True, max_w=960):
    """parts: list of (text, rgb). Returns RGBA image of a single line with stroke + soft shadow."""
    stroke = round(size * 0.11) if stroke is None else stroke
    f = font(weight, size)
    items, total = [], 0
    for txt, col in parts:
        for r, e in runs(txt):
            if e:
                ims = [emoji_img(c, round(size * 0.95)) for c in r]
                for im in ims:
                    items.append(("e", im, col, im.width + round(size * 0.06))); total += items[-1][3]
            else:
                w = f.getlength(r)
                items.append(("t", r, col, w)); total += w
    pad = stroke + 24
    asc, desc = f.getmetrics()
    cw, ch = int(total + 2 * pad), int(asc + desc + 2 * pad)
    layer = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, base = pad, pad + asc
    for kind, obj, col, w in items:
        if kind == "t":
            if stroke:
                d.text((x, base), obj, font=f, fill=col, anchor="ls", stroke_width=stroke, stroke_fill=stroke_color)
            else:
                d.text((x, base), obj, font=f, fill=col, anchor="ls")
        else:
            layer.alpha_composite(obj, (int(x), int(base - obj.height + desc * 0.35)))
        x += w
    if shadow:
        a = layer.getchannel("A").filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.55))
        sh = Image.new("RGBA", layer.size, (0, 0, 0, 0)); sh.putalpha(a)
        out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        out.alpha_composite(sh, (0, 8)); out.alpha_composite(layer)
        layer = out
    if layer.width > max_w + 2 * pad:
        s = (max_w + 2 * pad) / layer.width
        layer = layer.resize((round(layer.width * s), round(layer.height * s)), Image.LANCZOS)
    return layer.crop(layer.getbbox())

def stack(lines, gap=6, align="center"):
    w = max(l.width for l in lines); h = sum(l.height for l in lines) + gap * (len(lines) - 1)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0)); y = 0
    for l in lines:
        x = (w - l.width) // 2 if align == "center" else 0
        out.alpha_composite(l, (x, y)); y += l.height + gap
    return out

def caption(l1, l2=None, s1=66, s2=104, c1=WHITE, c2=YELLOW):
    lines = []
    if l1: lines.append(text_line([(l1, c1)], s1))
    if l2: lines.append(text_line([(l2, c2)], s2))
    return stack(lines, gap=4)

def pill(parts, size=40, bg=PURPLE, padx=30, pady=16, radius=None, weight="ExtraBold", rot=0, border=None, shadow=True):
    t = text_line(parts, size, weight=weight, stroke=0, shadow=False)
    w, h = t.width + 2 * padx, t.height + 2 * pady
    radius = h // 2 if radius is None else radius
    m = 30
    im = Image.new("RGBA", (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if shadow:
        sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
        ImageDraw.Draw(sh).rounded_rectangle([m, m + 8, m + w, m + h + 8], radius, fill=(0, 0, 0, 110))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(9)))
    d.rounded_rectangle([m, m, m + w, m + h], radius, fill=bg + ((255,) if len(bg) == 3 else ()),
                        outline=border, width=6 if border else 0)
    im.alpha_composite(t, (m + padx, m + (h - t.height) // 2))
    if rot:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    return im.crop(im.getbbox())

def price_sticker(label, price, bg=YELLOW, rot=-7):
    a = text_line([(label, BLACK)], 34, weight="ExtraBold", stroke=0, shadow=False)
    b = text_line([(price, BLACK)], 78, weight="Black", stroke=0, shadow=False)
    inner = stack([a, b], gap=0)
    return pill([], 1, bg=bg) if False else _box(inner, bg, rot)

def _box(inner, bg, rot, padx=38, pady=22, radius=34, border=BLACK):
    w, h = inner.width + 2 * padx, inner.height + 2 * pady
    m = 30
    im = Image.new("RGBA", (w + 2 * m, h + 2 * m), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([m + 6, m + 10, m + w + 6, m + h + 10], radius, fill=(0, 0, 0, 120))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
    ImageDraw.Draw(im).rounded_rectangle([m, m, m + w, m + h], radius, fill=bg + (255,), outline=border, width=6)
    im.alpha_composite(inner, (m + padx, m + pady))
    im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    return im.crop(im.getbbox())

# ---------------- easing / animation
def ease_out_back(x, s=1.9):
    x -= 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2

def anim_state(kind, lt):
    """returns (scale, alpha, dx, dy, rot)"""
    if kind == "pop":
        d = 0.28
        p = min(1, max(0, lt / d))
        return 0.55 + 0.45 * ease_out_back(p), min(1, lt / 0.08), 0, 0, 0
    if kind == "slide":
        d = 0.25; p = min(1, max(0, lt / d)); e = 1 - (1 - p) ** 3
        return 1, min(1, lt / 0.12), 0, 50 * (1 - e), 0
    if kind == "wiggle":
        s, a, _, _, _ = anim_state("pop", lt)
        return s, a, 0, 0, (4 if int(lt * 12) % 2 else -4)
    return 1, 1, 0, 0, 0

class Ov:
    def __init__(self, img, t0, t1, cx=None, cy=None, top=None, bottom=None, anim="pop"):
        self.img, self.t0, self.t1, self.anim = img, t0, t1, anim
        self.cx = W // 2 if cx is None else cx
        if top is not None: self.cy = top + img.height // 2
        elif bottom is not None: self.cy = bottom - img.height // 2
        else: self.cy = cy

    def draw(self, frame, t):
        if not (self.t0 <= t < self.t1): return
        s, a, dx, dy, rot = anim_state(self.anim, t - self.t0)
        im = self.img
        if rot: im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
        if abs(s - 1) > 1e-3:
            im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.BILINEAR)
        if a < 1:
            im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
        x = int(self.cx - im.width / 2 + dx); y = int(self.cy - im.height / 2 + dy)
        frame.alpha_composite(im, (x, y)) if frame.mode == "RGBA" else frame.paste(im, (x, y), im)

# ---------------- timeline
segs = json.load(open(os.path.join(HERE, "segs", "segs.json")))
starts = [0.0]
for s in segs: starts.append(starts[-1] + s["dur"])
S = starts  # S[i] = start of segment i, S[-1] = end of last clip
END0 = S[-1]; END_DUR = 3.5; TOTAL = END0 + END_DUR
TOP, BOTTOM = 345, 1470

def chapter(num, name):
    return pill([(num + "  ", YELLOW), (name, WHITE)], size=38, bg=(20, 20, 26, 205), padx=26, pady=14)

ovs = [
    # hook
    Ov(pill([("이마트24 × 재혼황후", WHITE)], size=42, bg=PURPLE), S[0], S[2], cy=280, anim="slide"),
    Ov(caption("편의점에 황실 디저트가?!", "콜라보 싹 다 털어옴 👑", s1=70, s2=112), S[0], S[2], bottom=BOTTOM),
    Ov(pill([("11.11 빼빼로데이 준비 💝", WHITE)], size=40, bg=PINK, rot=5), S[1] + 0.15, S[2], cx=720, cy=420),
    # chapter 1: pepero
    Ov(chapter("01", "빼빼로 3종"), S[2], S[11], cx=60, cy=250, anim="slide"),
    Ov(caption("박스 옆면에 명대사까지 ㄷㄷ", "디테일 무슨 일?"), S[2], S[3], top=TOP),
    Ov(pill([("아몬드", WHITE)], size=54, bg=GREEN, rot=-6, padx=40, pady=18), S[3] + 0.05, S[4], cx=280, cy=1390),
    Ov(caption("봉지에도 메시지가 있음", "뜯기 전부터 설렘 💌"), S[4], S[5], bottom=BOTTOM),
    Ov(pill([("딸기", WHITE)], size=54, bg=PINK, rot=-6, padx=44, pady=18), S[5] + 0.03, S[6], cx=280, cy=1390),
    Ov(caption("딸기 빼빼로는", "수고했어 오늘도 🍓"), S[6], S[7], bottom=BOTTOM),
    Ov(caption("고마워 · 수고했어 · 최애야?", "골라서 선물하기 딱 🎁"), S[7], S[8], top=TOP),
    Ov(text_line([("바스락 바스락", WHITE)], 84), S[8], S[9], cx=560, cy=560, anim="wiggle"),
    Ov(caption("꺼내자마자", "딸기 코팅 듬뿍 🍓"), S[9], S[10], top=TOP),
    Ov(caption(None, "3종 한 번에 개봉!"), S[10], S[11], top=TOP),
    Ov(price_sticker("빼빼로 각", "2,000원"), S[10] + 0.25, S[11], cx=300, cy=1360),
    # chapter 2: macaron
    Ov(chapter("02", "마카롱"), S[11], S[14], cx=60, cy=250, anim="slide"),
    Ov(caption("다음은 디저트", "얼그레이 & 딸기 마카롱"), S[11], S[12], top=TOP),
    Ov(caption("마카롱에 캐릭터가", "그려져 있음 ㅠㅠ 💜"), S[12], S[13], top=TOP),
    Ov(caption("남주·여주 하나씩 프린팅", "크림 꽉 찬 단면 🤤"), S[13], S[14], top=TOP),
    Ov(price_sticker("마카롱", "3,800원"), S[13] + 0.3, S[14], cx=300, cy=1360),
    # chapter 3: milk tea
    Ov(chapter("03", "로얄밀크티"), S[14], S[16], cx=60, cy=250, anim="slide"),
    Ov(caption("마지막은 황실 밀크티", "아쌈·우바·루후나 블렌딩"), S[14], S[15], top=TOP),
    Ov(caption("향긋하고 부드러운", "로얄밀크티 완성 ☕"), S[15], S[16], top=TOP),
    Ov(price_sticker("로얄밀크티", "2,000원"), S[15] + 0.25, S[16], cx=300, cy=1360),
]
# chapter pills are anchored by their left edge
for o in ovs:
    if o.cx == 60:
        o.cx = 60 + o.img.width // 2

# ---------------- end card
def event_card():
    cw = 920
    rows = [
        pill([("카드 결제 할인", WHITE)], size=34, bg=PINK, padx=24, pady=10, shadow=False),
        text_line([("11/1 ~ 11/10", PURPLE)], 54, weight="ExtraBold", stroke=0, shadow=False),
        text_line([("빼빼로 ", BLACK), ("30% ", RED), ("할인", BLACK)], 96, stroke=0, shadow=False),
        text_line([("농협·삼성카드 / 카카오페이·네이버페이", (70, 70, 80))], 36, weight="Bold", stroke=0, shadow=False),
        text_line([("(머니·포인트) 결제 시 · 단품 3종 & 기획세트 3종", (110, 110, 120))], 30, weight="SemiBold", stroke=0, shadow=False),
    ]
    inner = stack(rows, gap=14)
    ch = inner.height + 70
    m = 30
    im = Image.new("RGBA", (cw + 2 * m, ch + 2 * m), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle([m, m + 12, m + cw, m + ch + 12], 44, fill=(0, 0, 0, 140))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(14)))
    ImageDraw.Draw(im).rounded_rectangle([m, m, m + cw, m + ch], 44, fill=(255, 255, 255, 245), outline=PURPLE, width=8)
    im.alpha_composite(inner, (m + (cw - inner.width) // 2, m + 35))
    return im

def build_endcard_bg():
    # sharp full-lineup frame from the first segment
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", "1.0", "-i", segs[0]["file"], "-frames:v", "1",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    im = Image.frombuffer("RGB", (W, H), r.stdout).copy()
    return im

end_bg = build_endcard_bg()
hashtags = stack([
    text_line([("#이마트24 #편슐랭스타 #대학생서포터즈", WHITE)], 44, weight="ExtraBold"),
    text_line([("#재혼황후콜라보 #편의점디저트", YELLOW)], 44, weight="ExtraBold"),
], gap=4)
end_ovs = [
    Ov(pill([("이마트24 × 재혼황후", WHITE)], size=44, bg=PURPLE), END0, TOTAL + 1, cy=330, anim="slide"),
    Ov(caption("11.11 빼빼로데이", "준비 끝! 💝", s1=78, s2=128), END0 + 0.12, TOTAL + 1, top=400),
    Ov(event_card(), END0 + 0.35, TOTAL + 1, cy=0),
    Ov(hashtags, END0 + 0.6, TOTAL + 1, cy=0, anim="slide"),
]
end_ovs[2].cy = 400 + end_ovs[1].img.height + 30 + end_ovs[2].img.height // 2
end_ovs[3].cy = end_ovs[2].cy + end_ovs[2].img.height // 2 + 10 + hashtags.height // 2

def endcard_frame(lt):
    z = 1.0 + 0.05 * (lt / END_DUR)
    cw, chh = W / z, H / z
    bg = end_bg.crop((int((W - cw) / 2), int((H - chh) / 2), int((W + cw) / 2), int((H + chh) / 2))).resize((W, H), Image.BILINEAR)
    k = min(1, lt / 0.25)
    blur = bg.filter(ImageFilter.GaussianBlur(10 * k))
    dark = Image.new("RGB", (W, H), (25, 12, 45))
    return Image.blend(blur, dark, 0.45 * k)

# ---------------- render loop
def seg_index(t):
    for i in range(len(segs)):
        if S[i] <= t < S[i + 1]: return i
    return len(segs) - 1

def punch(img, lt):
    d = 0.22
    if lt >= d: return img
    p = lt / d; z = 1 + 0.09 * (1 - p) ** 2
    cw, chh = W / z, H / z
    return img.crop((int((W - cw) / 2), int((H - chh) / 2), int((W + cw) / 2), int((H + chh) / 2))).resize((W, H), Image.BILINEAR)

def main(out_path, audio_path, preview_times=None):
    nframes = round(TOTAL * FPS)
    if preview_times is None:
        lst = os.path.join(HERE, "segs", "list.txt")
        with open(lst, "w") as f:
            for s in segs: f.write(f"file '{s['file']}'\n")
        dec = subprocess.Popen(["ffmpeg", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst,
                                "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
        enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                                "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", audio_path,
                                "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "9M", "-bufsize", "18M",
                                "-profile:v", "high", "-pix_fmt", "yuv420p",
                                "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
                                "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest",
                                "-movflags", "+faststart", out_path], stdin=subprocess.PIPE)
        frames_iter = range(nframes)
    else:
        frames_iter = [round(t * FPS) for t in preview_times]
    fsize = W * H * 3
    for n in frames_iter:
        t = n / FPS
        if t < END0:
            if preview_times is None:
                buf = dec.stdout.read(fsize)
                if len(buf) < fsize:  # safety: repeat last frame
                    buf = last
                last = buf
                img = Image.frombuffer("RGB", (W, H), buf)
            else:
                i = seg_index(t)
                r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t - S[i]:.3f}", "-i", segs[i]["file"],
                                    "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                                   capture_output=True, check=True)
                img = Image.frombuffer("RGB", (W, H), r.stdout)
            i = seg_index(t)
            img = punch(img, t - S[i]).copy() if (t - S[i]) < 0.22 else img.copy()
            for o in ovs: o.draw(img, t)
        else:
            img = endcard_frame(t - END0)
            for o in end_ovs: o.draw(img, t)
        if preview_times is None:
            enc.stdin.write(img.tobytes())
            if n % 150 == 0: print(f"frame {n}/{nframes}", flush=True)
        else:
            img.save(os.path.join(HERE, "preview", f"p_{t:05.2f}.jpg"), quality=85)
    if preview_times is None:
        enc.stdin.close(); enc.wait(); dec.wait()
        print("done", out_path)

if __name__ == "__main__":
    if sys.argv[1] == "preview":
        os.makedirs(os.path.join(HERE, "preview"), exist_ok=True)
        ts = [float(x) for x in sys.argv[2:]]
        main(None, None, preview_times=ts)
    else:
        main(sys.argv[1], sys.argv[2])
