"""Cut, speed-adjust and HDR->SDR tonemap each source clip into uniform 1080x1920/30fps segments."""
import json, os, subprocess, sys

UP = "/root/.claude/uploads/2244bc9f-e309-5626-b222-f97239416adb"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "segs")
os.makedirs(OUT, exist_ok=True)

def src(n):
    for f in os.listdir(UP):
        if f.endswith(f"IMG_{n}.mov"):
            return os.path.join(UP, f)
    raise FileNotFoundError(n)

# (clip, source in-point, speed, output duration)
SEGS = [
    (6464, 0.30, 1.0, 1.5),
    (6466, 0.10, 1.0, 2.0),
    (6467, 0.00, 1.0, 2.5),
    (6471, 0.40, 1.0, 1.0),
    (6471, 5.50, 1.5, 2.0),
    (6469, 2.75, 1.0, 0.5),
    (6469, 6.90, 1.3, 2.0),
    (6472, 0.20, 1.0, 2.5),
    (6474, 1.50, 2.0, 1.5),
    (6473, 3.70, 1.3, 3.0),
    (6475, 0.00, 1.1, 2.0),
    (6476, 0.20, 1.0, 2.5),
    (6478, 1.00, 1.2, 3.0),
    (6481, 0.25, 1.2, 3.0),
    (6483, 4.00, 2.0, 3.0),
    (6489, 0.10, 1.1, 2.5),
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
