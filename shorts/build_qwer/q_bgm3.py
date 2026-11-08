"""Original upbeat disco-house track (120 BPM): four-on-the-floor, octave disco bass, piano-house stabs,
saw lead hook, snare rolls + risers into chapter changes, final hit on the end card."""
import numpy as np, wave, sys

SR = 48000
BPM = 120
BEAT = 60 / BPM; BAR = 4 * BEAT; S16 = BEAT / 4
OUT = sys.argv[1] if len(sys.argv) > 1 else "bgm3.wav"
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 35.5
END_CARD = float(sys.argv[3]) if len(sys.argv) > 3 else 32.0
CHAPTERS = (15.0, 27.0)
FINAL_HIT = 34.0
N = int((DUR + 2) * SR)
rng = np.random.default_rng(23)
DR = np.zeros((2, N)); MU = np.zeros((2, N))   # drum bus / music bus

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR

def add(bus, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    bus[0, i:i + len(sig)] += sig * gain * np.cos((pan + 1) * np.pi / 4) * 1.414
    bus[1, i:i + len(sig)] += sig * gain * np.sin((pan + 1) * np.pi / 4) * 1.414

def smooth(x, k):
    c = np.cumsum(np.concatenate([[0], x])); y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(len(x) - len(y))])

def tail(s, ms=12):
    n = int(ms / 1000 * SR)
    if len(s) > n: s[-n:] *= np.linspace(1, 0, n)
    return s

# ---------- drums
def kick():
    t = tt(0.32); f = 48 + 120 * np.exp(-t * 35)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    s += rng.standard_normal(len(t)) * np.exp(-t * 300) * 0.25
    return np.tanh(s * 2.0)

def clap():
    t = tt(0.28); n = rng.standard_normal(len(t))
    bp = smooth(n, 3) - smooth(n, 20)
    env = np.exp(-t * 20) * 0.8
    for d in (0.0, 0.01, 0.021):
        env += np.where(t >= d, np.exp(-(t - d) * 180), 0)
    snare_body = np.sin(2 * np.pi * 200 * t) * np.exp(-t * 30) * 0.4
    return bp * env * 1.3 + snare_body

def hat(dec, amp):
    t = tt(0.25); n = rng.standard_normal(len(t))
    return (n - smooth(n, 2)) * np.exp(-t * dec) * amp

def crash():
    t = tt(2.0); n = rng.standard_normal(len(t))
    return (n - smooth(n, 3)) * np.exp(-t * 2.2) * 0.5

def riser(d=1.0):
    t = tt(d); n = rng.standard_normal(len(t)); k = t / d
    s = smooth(n, 40) * (1 - k) ** 2 + (n - smooth(n, 4)) * k ** 1.5
    s *= k ** 2.5; s[-400:] *= np.linspace(1, 0, 400)
    return s * 0.6

# ---------- tonal
def saw(f, t, nh=14):
    return sum(np.sin(2 * np.pi * f * h * t) / h for h in range(1, nh + 1) if f * h < 16000)

def lead(f, d):
    t = tt(d)
    s = 0.5 * saw(f * 1.004, t) + 0.5 * saw(f * 0.996, t) + 0.3 * np.sin(2 * np.pi * f * 2 * t)
    env = np.minimum(1, t / 0.005) * (0.55 + 0.45 * np.exp(-t * 6))
    return tail(s * env * 0.35, 20)

def piano(notes, d=0.32):
    t = tt(d); out = np.zeros(len(t))
    for m in notes:
        f = midi(m)
        for h, a in ((1, 1.0), (2, 0.5), (3, 0.28), (4, 0.18), (5, 0.1), (6, 0.06)):
            out += a * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (7 + h * 3))
    env = np.minimum(1, t / 0.003)
    return tail(out * env / len(notes) * 1.4)

def bass(f, d):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * 2 * f * t) + 0.2 * np.sin(2 * np.pi * 3 * f * t)
    env = np.minimum(1, t / 0.004) * np.exp(-t * 5)
    return tail(np.tanh(s * env * 1.5) * 0.75, 15)

# vi - IV - I - V in D : Bm7 - Gmaj7 - Dadd9 - A
CH = [(47, [59, 62, 66, 69]), (43, [55, 59, 62, 66]), (50, [62, 64, 66, 69]), (45, [57, 61, 64, 69])]
MEL = [
    [(0, 74, 2), (2, 74, 2), (4, 78, 2), (6, 76, 2), (8, 74, 3), (12, 71, 2), (14, 74, 2)],
    [(0, 74, 2), (2, 74, 2), (4, 79, 2), (6, 78, 2), (8, 76, 4), (12, 74, 4)],
    [(0, 78, 2), (2, 78, 2), (4, 81, 2), (6, 78, 2), (8, 76, 3), (12, 74, 2), (14, 76, 2)],
    [(0, 76, 2), (2, 73, 2), (4, 76, 2), (6, 78, 2), (8, 76, 6)],
]
STABS = [2, 5, 8, 11, 14]
KICK, CLAP, CRASH = kick(), clap(), crash()
OH, CHH = hat(18, 0.32), hat(80, 0.16)

duck = np.ones(N)
bars = int(np.ceil(FINAL_HIT / BAR))
for b in range(bars):
    t0 = b * BAR
    root, notes = CH[b % 4]
    for k in range(4):
        tb = t0 + k * BEAT
        if tb >= FINAL_HIT: break
        add(DR, KICK, tb, 0.95)
        i = int(tb * SR); m = min(N, i + int(0.22 * SR))
        duck[i:m] = np.minimum(duck[i:m], 0.3 + 0.7 * np.linspace(0, 1, m - i) ** 0.7)
        if k in (1, 3): add(DR, CLAP, tb, 0.5, 0.05)
        add(DR, OH, tb + BEAT / 2, 1.0, 0.3)
        for s in (1, 3): add(DR, CHH, tb + s * S16, 0.9 if s == 3 else 0.6, -0.3)
    for s in STABS:
        if t0 + s * S16 < FINAL_HIT:
            add(MU, piano(notes), t0 + s * S16, 0.6, -0.2)
    for k in range(8):   # disco octave bass: low on the beat, high on the and
        tk = t0 + k * BEAT / 2
        if tk < FINAL_HIT:
            add(MU, bass(midi(root - 12 + (12 if k % 2 else 0)), BEAT / 2 * 0.9), tk, 0.62)
    for st, m, ln in MEL[b % 4]:
        tk = t0 + st * S16
        if tk < FINAL_HIT:
            add(MU, lead(midi(m), ln * S16 * 0.92), tk, 0.24, 0.15)

# snare-roll + riser into chapter changes and the end card
for tc in CHAPTERS + (END_CARD,):
    add(DR, riser(1.0), tc - 1.0, 0.35)
    for j in range(8):
        add(DR, CLAP, tc - BEAT + j * (BEAT / 8), 0.12 + 0.05 * j, 0.0)
    add(DR, CRASH, tc, 0.45)

# final hit
add(DR, KICK, FINAL_HIT, 1.0); add(DR, CRASH, FINAL_HIT, 0.6)
add(MU, piano(CH[2][1] + [74], d=1.4), FINAL_HIT, 0.9)
add(MU, bass(midi(CH[2][0] - 12), 1.2), FINAL_HIT, 0.7)
add(MU, lead(midi(74), 1.2), FINAL_HIT, 0.25)

MU *= duck
ir_t = tt(0.9)
ir = rng.standard_normal((2, len(ir_t))) * np.exp(-ir_t * 6.5); ir[:, : int(0.01 * SR)] = 0
nfft = 1 << int(np.ceil(np.log2(N + len(ir_t))))
wet = np.fft.irfft(np.fft.rfft(MU, nfft) * np.fft.rfft(ir, nfft), nfft)[:, :N]
mix = DR / np.max(np.abs(DR)) * 0.9 + MU / np.max(np.abs(MU)) * 0.85 + wet / np.max(np.abs(wet)) * 0.12

n_end = int(DUR * SR)
fade = int(1.0 * SR)
mix[:, n_end - fade:n_end] *= np.linspace(1, 0, fade) ** 1.5
mix = mix[:, :n_end]
mix = np.tanh(mix * 1.2)
mix /= np.max(np.abs(mix)) / 0.89
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print("wrote", OUT)
