"""Original chill-hop / cafe lo-fi track (120 BPM grid, swung hats, electric piano 7th chords, vinyl crackle)."""
import numpy as np, wave, sys

SR = 48000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
S16 = BEAT / 4
OUT = sys.argv[1] if len(sys.argv) > 1 else "bgm2.wav"
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 35.5
END_CARD = float(sys.argv[3]) if len(sys.argv) > 3 else 32.0
N = int((DUR + 2) * SR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4) * 1.414; r = np.sin((pan + 1) * np.pi / 4) * 1.414
    L[i:i + len(sig)] += sig * gain * l
    R[i:i + len(sig)] += sig * gain * r

def smooth(x, k):
    c = np.cumsum(np.concatenate([[0], x]))
    y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(len(x) - len(y))])

def onepole_lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); acc = 0.0
    # vectorised enough for our sizes via chunked recursion
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y

def fade_tail(s, ms=15):
    n = int(ms / 1000 * SR)
    if len(s) > n: s[-n:] *= np.linspace(1, 0, n)
    return s

# ---------- instruments
def epiano(f, d=1.6, vel=1.0):
    t = tt(d)
    I = 1.3 * np.exp(-t * 3.2) * vel
    s = np.sin(2 * np.pi * f * t + I * np.sin(2 * np.pi * f * t))
    s += 0.12 * np.sin(2 * np.pi * f * 7.0 * t) * np.exp(-t * 14)      # tine
    env = np.minimum(1, t / 0.004) * np.exp(-t * 1.6)
    trem = 0.9 + 0.1 * np.sin(2 * np.pi * 4.2 * t)
    return fade_tail(s * env * trem * vel)

def chord(notes, d, vel=1.0, strum=0.012):
    out = np.zeros(int((d + strum * len(notes) + 0.05) * SR))
    for k, m in enumerate(notes):
        s = epiano(midi(m), d, vel * (0.9 + 0.1 * rng.random()))
        i = int(k * strum * SR)
        out[i:i + len(s)] += s
    return out / len(notes) * 1.6

def kick():
    t = tt(0.4)
    f = 45 + 75 * np.exp(-t * 30)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    return np.tanh(s * 1.4)

def snare():
    t = tt(0.3)
    body = np.sin(2 * np.pi * 185 * t) * np.exp(-t * 28) * 0.6
    n = rng.standard_normal(len(t))
    bp = (smooth(n, 3) - smooth(n, 14)) * np.exp(-t * 16) * 1.3
    return body + bp

def hat(dec=55, amp=0.4):
    t = tt(0.1)
    n = rng.standard_normal(len(t))
    return (n - smooth(n, 2)) * np.exp(-t * dec) * amp

def bass(f, d):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1, t / 0.01) * (0.65 + 0.35 * np.exp(-t * 4))
    return fade_tail(np.tanh(s * env * 1.2) * 0.8, 25)

def riser(d=0.8):
    t = tt(d)
    n = rng.standard_normal(len(t))
    k = (t / d) ** 2
    s = smooth(n, 30) * (1 - k) + (n - smooth(n, 6)) * k
    s *= (t / d) ** 3
    s[-600:] *= np.linspace(1, 0, 600)
    return s * 0.5

# ---------- harmony: Fmaj7 - Em7 - Dm7 - Cmaj9
CH = [
    (41, [57, 60, 64, 67]),   # F  : A C E G  (Fmaj9-ish)
    (40, [55, 59, 62, 66]),   # E  : G B D F# (Em9)
    (38, [53, 57, 60, 64]),   # D  : F A C E  (Dm9)
    (36, [55, 59, 62, 64]),   # C  : G B D E  (Cmaj9/6)
]
MEL = [
    [(4, 76, 2), (6, 74, 2), (8, 72, 5)],
    [(2, 71, 2), (4, 74, 4), (10, 79, 5)],
    [(4, 77, 2), (6, 76, 2), (8, 74, 5)],
    [(0, 72, 4), (6, 71, 2), (8, 67, 7)],
]
BASS = [(0, 0, 5), (6, 0, 1), (8, 7, 3), (11, 12, 2), (14, 7, 2)]
SWING = 0.045

KICK, SNARE = kick(), snare()
bars = int(np.ceil(DUR / BAR)) + 1
duck = np.ones(N)
for b in range(bars):
    t0 = b * BAR
    if t0 >= DUR: break
    root, notes = CH[b % 4]
    drums = t0 < END_CARD - 1e-6
    # electric piano: long chord + re-strike on the "and" of 3
    add(chord(notes, 1.9, 0.9), t0, 0.55, -0.15)
    if drums:
        add(chord(notes, 0.7, 0.55), t0 + 10 * S16 + SWING, 0.4, -0.15)
    # melody from bar 1
    if b >= 1:
        for st, m, ln in MEL[b % 4]:
            sw = SWING if st % 2 else 0
            add(epiano(midi(m), ln * S16 + 0.6, 0.8), t0 + st * S16 + sw, 0.32, 0.25)
    if not drums:
        continue
    # bass
    for st, iv, ln in BASS:
        add(bass(midi(root + iv), ln * S16 * 0.95), t0 + st * S16 + (SWING if st % 2 else 0), 0.5)
    # drums: kick 1, (a of 2), 3+ ; snare 2 & 4 ; swung 8th hats
    for st, g in ((0, 1.0), (7, 0.55), (10, 0.85)):
        tk = t0 + st * S16 + (SWING if st % 2 else 0)
        add(KICK, tk, 0.9 * g)
        i = int(tk * SR); m = min(N, i + int(0.2 * SR))
        duck[i:m] = np.minimum(duck[i:m], 0.55 + 0.45 * np.linspace(0, 1, m - i))
    for st in (4, 12):
        add(SNARE, t0 + st * S16, 0.42, 0.05)
    for k in range(8):
        st = k * 2
        sw = SWING if k % 2 else 0
        amp = 0.26 if k % 2 else 0.18
        add(hat(70 if k != 7 else 18, amp), t0 + st * S16 + sw, 1.0, 0.35)
    if b % 2 == 1:
        add(hat(80, 0.1), t0 + 15 * S16 + SWING, 1.0, -0.3)

for tc in (15.0, 27.0):
    add(riser(0.8), tc - 0.8, 0.12)

mix = np.stack([L, R]) * (0.8 + 0.2 * duck)

# vinyl crackle + hiss
crk = np.zeros(N)
idx = rng.integers(0, N, int(DUR * 14))
crk[idx] = rng.standard_normal(len(idx)) * 0.35
crk = crk - smooth(crk, 4)
hiss = rng.standard_normal(N)
hiss = smooth(hiss, 6) * 0.012
mix += np.stack([crk + hiss, np.roll(crk, 37) + hiss]) * 0.6

# warm low-pass (~6.5 kHz) + small room reverb
mix = np.stack([onepole_lp(mix[0], 6500), onepole_lp(mix[1], 6500)])
ir_t = tt(1.1)
ir = rng.standard_normal((2, len(ir_t))) * np.exp(-ir_t * 5.5)
ir[:, : int(0.012 * SR)] = 0
nfft = 1 << int(np.ceil(np.log2(N + len(ir_t))))
wet = np.fft.irfft(np.fft.rfft(mix, nfft) * np.fft.rfft(ir, nfft), nfft)[:, :N]
mix = mix / (np.max(np.abs(mix)) + 1e-9) + wet / (np.max(np.abs(wet)) + 1e-9) * 0.14

n_end = int(DUR * SR)
fade = int(2.0 * SR)
mix[:, n_end - fade:n_end] *= np.linspace(1, 0, fade) ** 1.3
mix = mix[:, :n_end]
mix = np.tanh(mix * 1.15)
mix /= np.max(np.abs(mix)) / 0.89
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print("wrote", OUT)
