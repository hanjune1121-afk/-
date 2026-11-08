"""Cut, speed-adjust and HDR->SDR tonemap each source clip into uniform 1080x1920/30fps segments."""
import json, os, subprocess, sys

UP = "/root/.claude/uploads/2244bc9f-e309-5626-b222-f97239416adb"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "segs")
os.makedirs(OUT, exist_ok=True)

def src(n):
    return os.path.join(UP, n + ".mov")

# (clip, source in-point, speed, output duration)
SEGS = [
    ("1283850f-IMG_6726", 0.00, 1.0, 1.5),
    ("f0998b01-IMG_6736", 0.00, 1.0, 2.0),
    ("1283850f-IMG_6726", 3.00, 1.0, 2.0),
    ("251ce3d9-IMG_6728", 8.00, 1.5, 2.0),
    ("251ce3d9-IMG_6728", 11.00, 1.0, 2.5),
    ("f717b08a-IMG_6729", 0.50, 1.0, 3.0),
    ("b9d25f1b-IMG_6731", 0.00, 1.0, 2.0),
    ("a0956626-IMG_6732", 1.00, 1.0, 2.5),
    ("fa7b5da4-IMG_6732", 13.00, 1.4, 2.5),
    ("29c2a0a1-IMG_6733", 0.00, 1.0, 1.5),
    ("2f5cba76-IMG_6734", 0.50, 1.33, 3.0),
    ("9cf4a64d-IMG_6735", 0.00, 1.0, 2.5),
    ("5424f51f-IMG_6737", 2.50, 1.0, 3.0),
    ("85750783-IMG_6727", 0.50, 1.0, 2.0),
]

TONEMAP = ("zscale=tin=arib-std-b67:t=arib-std-b67:pin=bt2020:p=bt709:min=bt2020nc:m=bt709:rin=tv:r=tv,"
           "format=yuv420p,eq=contrast=1.12:saturation=1.15:brightness=0.01")

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
