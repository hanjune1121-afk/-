"""v2: vlog-style captions (cute pixel text + stars, mint/yellow keyword narration, black info boxes, big price numbers)."""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "..", "fonts")
W, H, FPS = 1080, 1920, 30
EMOJI_FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"

WHITE = (255, 255, 255)
INK = (34, 28, 30)
PALE_Y = (255, 243, 150)      # ref1 / ref4 pale yellow
MINT = (128, 244, 222)        # ref3 keyword mint
HOTPINK = (255, 92, 170)      # ref2 keyword pink
LABEL_Y = (247, 243, 178)     # ref2 "잠시 캡처" label

FONT_FILES = {
    "pixel": "Galmuri11-Bold.ttf",
    "hand": "GamjaFlower-Regular.ttf",
    "hand2": "GamjaFlower-Regular.ttf",
    "cond": "DoHyeon-Regular.ttf",
    "sans": "Pretendard-Bold.otf",
}
FALLBACK = {"pixel": "sans", "hand": "hand2", "cond": "sans", "hand2": "sans"}

_fc = {}
def font(name, size):
    k = (name, size)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(os.path.join(FONTS, FONT_FILES[name]), size)
    return _fc[k]

_cov = {}
def has_glyph(name, ch):
    k = (name, ch)
    if k not in _cov:
        f = font(name, 40)
        nd = f.getmask("\U000F0000")
        m = f.getmask(ch)
        _cov[k] = not (m.size == nd.size and bytes(m) == bytes(nd))
    return _cov[k]

def is_emoji(ch):
    cp = ord(ch)
    return 0x1F000 <= cp <= 0x1FAFF or 0x2600 <= cp <= 0x27BF and ch not in "★☆"

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

def text_line(parts, size, fname, stroke=0, stroke_color=INK, shadow=0, max_w=950, bold=0):
    """parts: [(text, rgb)] -> RGBA image. Per-character font fallback + color emoji."""
    items = []
    for txt, col in parts:
        for ch in txt:
            if ch == "️": continue
            if is_emoji(ch):
                items.append(("e", ch, col))
            else:
                fn = fname if (ch == " " or has_glyph(fname, ch)) else FALLBACK.get(fname, "sans")
                if items and items[-1][0] == "t" and items[-1][3] == fn and items[-1][2] == col:
                    items[-1] = ("t", items[-1][1] + ch, col, fn)
                else:
                    items.append(("t", ch, col, fn))
    f0 = font(fname, size)
    asc, desc = f0.getmetrics()
    widths = []
    for it in items:
        if it[0] == "e": widths.append(emoji_img(it[1], round(size * 0.92)).width + round(size * 0.08))
        else: widths.append(font(it[3], size).getlength(it[1]))
    pad = stroke + bold + 30
    layer = Image.new("RGBA", (int(sum(widths) + 2 * pad), int(asc + desc + 2 * pad)), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x, base = pad, pad + asc
    for it, w in zip(items, widths):
        if it[0] == "t":
            kw = dict(font=font(it[3], size), fill=it[2], anchor="ls")
            if stroke: kw.update(stroke_width=stroke, stroke_fill=stroke_color)
            elif bold: kw.update(stroke_width=bold, stroke_fill=it[2])
            d.text((x, base), it[1], **kw)
        else:
            e = emoji_img(it[1], round(size * 0.92))
            layer.alpha_composite(e, (int(x + size * 0.04), int(base - e.height + desc * 0.3)))
        x += w
    if shadow:
        a = layer.getchannel("A").filter(ImageFilter.GaussianBlur(shadow)).point(lambda v: int(v * 0.6))
        sh = Image.new("RGBA", layer.size, (0, 0, 0, 0)); sh.putalpha(a)
        out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        out.alpha_composite(sh, (0, 4)); out.alpha_composite(layer); layer = out
    layer = layer.crop(layer.getbbox())
    if layer.width > max_w:
        s = max_w / layer.width
        layer = layer.resize((round(layer.width * s), round(layer.height * s)), Image.LANCZOS)
    return layer

def stack(lines, gap=6):
    w = max(l.width for l in lines); h = sum(l.height for l in lines) + gap * (len(lines) - 1)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0)); y = 0
    for l in lines:
        out.alpha_composite(l, ((w - l.width) // 2, y)); y += l.height + gap
    return out

def kw(s, color):
    """'plain [key] plain' -> parts with [key] in color, rest white."""
    parts, cur, on = [], "", False
    for ch in s:
        if ch in "[]":
            if cur: parts.append((cur, color if on else WHITE))
            cur, on = "", ch == "["
        else: cur += ch
    if cur: parts.append((cur, color if on else WHITE))
    return parts

# ---------------- caption styles
def narration(lines, color=MINT, size=78):
    """ref3/ref4: condensed white subtitle, thin outline + soft shadow, keyword colored."""
    return stack([text_line(kw(l, color), size, "cond", stroke=4, shadow=8) for l in lines], gap=2)

def cute(lines, size=66):
    """ref1: pixel-handwriting pale yellow with dark outline."""
    return stack([text_line([(l, PALE_Y)], size, "pixel", stroke=6, shadow=0) for l in lines], gap=10)

def bignum(num, sub):
    """ref4: big pale-yellow number + white line under it."""
    a = text_line([(num, PALE_Y)], 160, "cond", stroke=5, shadow=10)
    b = text_line(kw(sub, PALE_Y), 76, "cond", stroke=4, shadow=8)
    return stack([a, b], gap=0)

def info_box(lines, size=64, color=HOTPINK):
    """ref2: black rectangle, white handwriting, pink keyword."""
    rows = [text_line(kw(l, color), size, "hand", bold=2, max_w=960) for l in lines]
    inner = stack(rows, gap=4)
    px, py = 30, 18
    im = Image.new("RGBA", (inner.width + 2 * px, inner.height + 2 * py), (0, 0, 0, 238))
    im.alpha_composite(inner, (px, py))
    return im

def capture_label(text="잠시 캡처📸"):
    t = text_line([(text, INK)], 78, "hand2", bold=1)
    px, py = 34, 16
    im = Image.new("RGBA", (t.width + 2 * px, t.height + 2 * py), LABEL_Y + (255,))
    im.alpha_composite(t, (px, py))
    return im

def star_img(r, fill=PALE_Y, outline=INK):
    s = int(r * 2 + 16)
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    c = s / 2
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append((c + rr * math.cos(a), c + rr * math.sin(a)))
    ImageDraw.Draw(im).polygon(pts, fill=fill, outline=outline, width=5)
    return im

# ---------------- animation
def ease_out_back(x, s=1.6):
    x -= 1
    return 1 + (s + 1) * x ** 3 + s * x ** 2

class Ov:
    def __init__(self, img, t0, t1, cx=W // 2, cy=900, anim="fade", stars=None):
        self.img, self.t0, self.t1, self.cx, self.cy, self.anim = img, t0, t1, cx, cy, anim
        self.stars = stars or []   # [(dx, dy, radius, phase)] relative to block center

    def state(self, lt):
        if self.anim == "fade":
            p = min(1, lt / 0.12); return 1.0, p, (1 - p) * 14
        if self.anim == "pop":
            p = min(1, lt / 0.22); return 0.8 + 0.2 * ease_out_back(p), min(1, lt / 0.08), 0
        return 1.0, 1.0, 0

    def draw(self, frame, t):
        if not (self.t0 <= t < self.t1): return
        lt = t - self.t0
        s, a, dy = self.state(lt)
        im = self.img
        if abs(s - 1) > 1e-3:
            im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.BILINEAR)
        if a < 1:
            im = im.copy(); im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
        frame.paste(im, (int(self.cx - im.width / 2), int(self.cy - im.height / 2 + dy)), im)
        for (sx, sy, r, ph) in self.stars:
            if lt < 0.05 + ph * 0.05: continue
            tw = 0.82 + 0.22 * math.sin(lt * 7 + ph * 2.1)
            st = star_img(r * tw)
            if a < 1: st.putalpha(st.getchannel("A").point(lambda v: int(v * a)))
            frame.paste(st, (int(self.cx + sx - st.width / 2), int(self.cy + sy - st.height / 2 + dy)), st)

def cute_ov(lines, t0, t1, cy):
    img = cute(lines)
    w, h = img.width, img.height
    stars = [(-w / 2 + 14, -h / 2 - 38, 32, 0), (w / 2 - 34, -h / 2 - 26, 26, 1),
             (-w / 2 - 30, h / 2 - 30, 28, 2), (w / 2 + 26, h / 2 - 8, 32, 3), (40, h / 2 + 40, 22, 4)]
    return Ov(img, t0, t1, cy=cy, anim="pop", stars=stars)

# ---------------- timeline
segs = json.load(open(os.path.join(HERE, "segs", "segs.json")))
S = [0.0]
for s in segs: S.append(S[-1] + s["dur"])
END0 = S[-1]; END_DUR = 3.5; TOTAL = END0 + END_DUR

ovs = [
    cute_ov(["이마트24 X 재혼황후 콜라보", "신상 받아봤어요💗"], S[0], S[2], cy=900),
    Ov(narration(["박스 옆면에 [명대사]까지 있더라고요", "디테일 미쳤다 진짜.."], PALE_Y), S[2], S[3], cy=560),
    Ov(narration(["첫 번째는 [아몬드] 빼빼로예요"]), S[3], S[4], cy=1240),
    Ov(narration(["[“내가 최애 빼빼로야?”]", "봉지가 말을 걸어요ㅋㅋㅋ"]), S[4], S[5], cy=420),
    Ov(narration(["딸기 맛은 [‘수고했어 오늘도’]래요", "괜히 위로받았어요.. ㅠㅠ"], PALE_Y), S[5], S[7], cy=1060),
    cute_ov(["봉지마다 메시지가 달라서", "선물하기 딱 좋겠죠?💗"], S[7], S[8], cy=900),
    Ov(narration(["[(바스락 바스락)]"]), S[8], S[9], cy=880),
    Ov(narration(["딸기 코팅 보이시나요?", "[진짜 듬뿍] 묻어 있어요!"]), S[9], S[10], cy=620),
    Ov(bignum("2,000원", "빼빼로 3종 [전부 이 가격이에요]"), S[10], S[11], cy=700, anim="pop"),
    Ov(narration(["이번엔 디저트 차례예요", "[얼그레이 & 딸기 마카롱]"], PALE_Y), S[11], S[12], cy=540),
    cute_ov(["마카롱에 캐릭터가 그려져 있어요", "아까워서 어떻게 먹어..💗"], S[12], S[13], cy=480),
    Ov(bignum("3,800원", "남주·여주가 [하나씩] 들어 있어요"), S[13], S[14], cy=500, anim="pop"),
    Ov(narration(["마지막은 [로얄밀크티]예요", "홍차 3종 블렌딩이라 [향긋했어요]"]), S[14], S[15], cy=480),
    Ov(bignum("2,000원", "황실 밀크티가 [이 가격 실화?]"), S[15], S[16], cy=500, anim="pop"),
]

# ---------------- end card (ref2 style info boxes over the full lineup)
def build_endcard_bg():
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", "1.0", "-i", segs[0]["file"], "-frames:v", "1",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return Image.frombuffer("RGB", (W, H), r.stdout).copy()

end_bg = build_endcard_bg()
lab = capture_label()
box1 = info_box(["①행사카드 결제 시 [빼빼로 30% 할인]", "(농협카드/삼성카드/카카오페이·네이버페이", "포인트&머니)"])
box2 = info_box(["②기간 [11/1 ~ 11/10]", "빼빼로 단품 3종 & 기획세트 3종 대상"])
tags = stack([text_line([("#이마트24 #편슐랭스타 #대학생서포터즈", WHITE)], 46, "cond", stroke=4, shadow=6),
              text_line([("#재혼황후콜라보 #편의점디저트", PALE_Y)], 46, "cond", stroke=4, shadow=6)], gap=2)
y = 560
end_ovs = []
for img, delay, anim in ((lab, 0.0, "pop"), (box1, 0.25, "fade"), (box2, 0.5, "fade"), (tags, 0.8, "fade")):
    end_ovs.append(Ov(img, END0 + delay, TOTAL + 1, cy=y + img.height // 2, anim=anim))
    y += img.height + (34 if img is lab else 26)

def endcard_frame(lt):
    z = 1.0 + 0.04 * (lt / END_DUR)
    cw, chh = W / z, H / z
    bg = end_bg.crop((int((W - cw) / 2), int((H - chh) / 2), int((W + cw) / 2), int((H + chh) / 2))).resize((W, H), Image.BILINEAR)
    k = min(1, lt / 0.25)
    return Image.blend(bg, bg.filter(ImageFilter.GaussianBlur(4)), k).point(lambda v: int(v * (1 - 0.25 * k)))

# ---------------- render
def seg_index(t):
    for i in range(len(segs)):
        if S[i] <= t < S[i + 1]: return i
    return len(segs) - 1

def punch(img, lt):
    d = 0.22
    p = lt / d; z = 1 + 0.07 * (1 - p) ** 2
    cw, chh = W / z, H / z
    return img.crop((int((W - cw) / 2), int((H - chh) / 2), int((W + cw) / 2), int((H + chh) / 2))).resize((W, H), Image.BILINEAR)

def get_frame_single(t):
    i = seg_index(t)
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t - S[i]:.3f}", "-i", segs[i]["file"], "-frames:v", "1",
                        "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True)
    return Image.frombuffer("RGB", (W, H), r.stdout)

def render_frame(n, src):
    t = n / FPS
    if t < END0:
        lt = t - S[seg_index(t)]
        img = punch(src, lt) if lt < 0.22 else src.copy()
        for o in ovs: o.draw(img, t)
    else:
        img = endcard_frame(t - END0)
        for o in end_ovs: o.draw(img, t)
    return img

def main(out_path, audio_path):
    nframes = round(TOTAL * FPS)
    lst = os.path.join(HERE, "segs", "list.txt")
    with open(lst, "w") as f:
        for s in segs: f.write(f"file '{s['file']}'\n")
    dec = subprocess.Popen(["ffmpeg", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst,
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                            "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", audio_path,
                            "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
                            "-maxrate", "9M", "-bufsize", "18M", "-profile:v", "high", "-pix_fmt", "yuv420p",
                            "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
                            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest",
                            "-movflags", "+faststart", out_path], stdin=subprocess.PIPE)
    fsize = W * H * 3; last = None
    for n in range(nframes):
        src = None
        if n / FPS < END0:
            buf = dec.stdout.read(fsize)
            if len(buf) < fsize: buf = last
            last = buf
            src = Image.frombuffer("RGB", (W, H), buf)
        enc.stdin.write(render_frame(n, src).tobytes())
        if n % 150 == 0: print(f"frame {n}/{nframes}", flush=True)
    enc.stdin.close(); enc.wait(); dec.wait()
    print("done", out_path)

if __name__ == "__main__":
    if sys.argv[1] == "preview":
        out = os.path.join(HERE, "preview2"); os.makedirs(out, exist_ok=True)
        for x in sys.argv[2:]:
            t = float(x); n = round(t * FPS)
            src = get_frame_single(t) if t < END0 else None
            render_frame(n, src).save(os.path.join(out, f"p_{t:05.2f}.jpg"), quality=85)
    else:
        main(sys.argv[1], sys.argv[2])
