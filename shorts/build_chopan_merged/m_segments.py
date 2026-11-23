"""Cut, speed-adjust and HDR->SDR tonemap each source clip into uniform 1080x1920/30fps segments."""
import json, os, subprocess, sys

UP = "/root/.claude/uploads/2244bc9f-e309-5626-b222-f97239416adb"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "segs")
os.makedirs(OUT, exist_ok=True)

def src(n):
    return os.path.join(UP, n + ".mov")

# (clip, source in-point, speed, output duration)
SEGS = [
    ("b4b50aa7-IMG_7025", 0.00, 1.0, 1.5),
    ("4380b128-IMG_6996", 0.00, 1.0, 1.5),
    ("49534e13-IMG_7033", 1.50, 1.0, 2.0),
    ("7beef5d3-IMG_7027", 0.30, 1.75, 2.0),
    ("7beef5d3-IMG_7027", 4.30, 1.0, 2.0),
    ("7beef5d3-IMG_7027", 7.20, 1.0, 2.0),
    ("d17d5cfe-IMG_7028", 1.00, 1.25, 2.0),
    ("eb17636e-IMG_7029", 4.60, 1.0, 2.5),
    ("648ffbc8-IMG_7032", 5.00, 1.2, 2.5),
    ("f3121f61-IMG_6998", 0.50, 1.0, 1.5),
    ("d8d16c5f-IMG_6999", 0.00, 1.0, 2.5),
    ("69053833-IMG_7001", 1.50, 1.5, 2.0),
    ("0fbca795-IMG_7002", 0.00, 1.5, 2.0),
    ("0fbca795-IMG_7002", 5.50, 1.6, 2.5),
    ("f8bbcc08-IMG_7005", 0.00, 1.33, 3.0),
    ("cba7f480-IMG_7003", 1.50, 1.0, 3.0),
    ("509d193c-IMG_7006", 3.00, 1.0, 2.5),
    ("6516bd48-IMG_7007", 1.50, 1.0, 2.5),
]

TONEMAP = ("zscale=tin=arib-std-b67:t=arib-std-b67:pin=bt2020:p=bt709:min=bt2020nc:m=bt709:rin=tv:r=tv,"
           "format=yuv420p")  # colour-space conversion only, no look/filter

def atempo(s):
    parts = []
    while s > 2.0:
        parts.append("atempo=2.0"); s /= 2.0
    parts.append(f"atempo={s:.6f}")
    return ",".join(parts)

def build(i, seg):
    n, tin, sp, dur = seg
    frames = round(dur * 30)
    out = os.path.join(OUT, f"s{i:02d}.mkv")
    vf = (f"{TONEMAP},scale=1080:1920:flags=lanczos,setsar=1,"
          f"setpts=(PTS-STARTPTS)/{sp},fps=30,format=yuv420p")
    af = (f"asetpts=PTS-STARTPTS,{atempo(sp)},aresample=48000,"
          f"apad,atrim=0:{dur},afade=t=in:d=0.02,afade=t=out:st={dur-0.03}:d=0.03")
    cmd = ["ffmpeg", "-v", "error", "-y", "-ss", str(tin), "-t", f"{dur*sp+0.2:.3f}",
           "-i", src(n), "-map", "0:v:0", "-map", "0:a:0", "-vf", vf, "-af", af,
           "-frames:v", str(frames), "-c:v", "libx264", "-preset", "fast", "-crf", "12",
           "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
           "-c:a", "pcm_s16le", "-ac", "2", "-t", str(dur), out]
    subprocess.run(cmd, check=True)
    return out

if __name__ == "__main__":
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(4) as ex:
        outs = list(ex.map(lambda a: build(*a), enumerate(SEGS)))
    json.dump([{"file": o, "dur": s[3], "clip": s[0]} for o, s in zip(outs, SEGS)],
              open(os.path.join(OUT, "segs.json"), "w"), indent=1)
    for o in outs:
        r = subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0",
                            "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", o],
                           capture_output=True, text=True)
        print(os.path.basename(o), r.stdout.strip())
