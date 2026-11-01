"""Synthesize an original, royalty-free cute pop beat (120 BPM) with numpy."""
import numpy as np, wave, sys

SR = 48000
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 38.0
OUT = sys.argv[1] if len(sys.argv) > 1 else "bgm.wav"
N = int(DUR * SR) + SR
rng = np.random.default_rng(7)

L = np.zeros(N); R = np.zeros(N)

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(sig)] += sig * gain * l * 1.414
    R[i:i + len(sig)] += sig * gain * r * 1.414

def smooth(x, k):
    c = np.cumsum(np.concatenate([[0], x]))
    y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(len(x) - len(y))])

def tt(d): return np.arange(int(d * SR)) / SR

# ---- drums
def kick():
    t = tt(0.35)
    f = 50 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 9)
    click = rng.standard_normal(len(t)) * np.exp(-t * 400) * 0.3
    return np.tanh((s + click) * 1.6)

def clap():
    t = tt(0.3)
    n = rng.standard_normal(len(t))
    bp = smooth(n, 4) - smooth(n, 24)
    env = np.exp(-t * 18)
    for d in (0.0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 160), 0) * 0.8
    return bp * env * 1.4

def hat(decay=60):
    t = tt(0.12)
    n = rng.standard_normal(len(t))
    hp = n - smooth(n, 3)
    return hp * np.exp(-t * decay) * 0.5

def swoosh(d=0.9):
    t = tt(d)
    n = rng.standard_normal(len(t))
    k = np.clip((t / d) ** 2, 0, 1)
    out = np.zeros_like(n)
    # crude rising filter: blend low-passed -> bright noise
    lo = smooth(n, 40); hi = n - smooth(n, 4)
    out = lo * (1 - k) + hi * k
    return out * (t / d) ** 2.5 * 0.6

# ---- tonal
def pluck(freqs, d=0.45, bright=7.0):
    t = tt(d)
    s = np.zeros(len(t))
    for f in freqs:
        for det in (-0.004, 0.004):
            ff = f * (1 + det)
            for h in range(1, 9):
                s += np.sin(2 * np.pi * ff * h * t) / h * np.exp(-t * (bright + h * 3.5))
    s *= np.minimum(1, t / 0.003)
    return s / (len(freqs) * 2.5)

def bell(f, d=0.6):
    t = tt(d)
    mod = np.sin(2 * np.pi * f * 3.5 * t) * 1.2 * np.exp(-t * 8)
    s = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 5)
    s += 0.25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 9)
    return s * np.minimum(1, t / 0.002)

def bass(f, d=0.22):
    t = tt(d)
    s = sum(np.sin(2 * np.pi * f * h * t) / h for h in range(1, 5))
    env = np.minimum(1, t / 0.005) * np.exp(-t * 6)
    env[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))
    return np.tanh(s * env * 1.2) * 0.8

# progression F - G - Em - Am (IV V iii vi in C)
CHORDS = [
    (41, [65, 69, 72]),   # F
    (43, [67, 71, 74]),   # G
    (40, [64, 67, 71]),   # Em
    (45, [64, 69, 72]),   # Am
]
# melody (step in 16ths, midi, length in 16ths) per chord bar
MEL = [
    [(0, 81, 2), (2, 84, 2), (4, 81, 2), (6, 79, 2), (8, 77, 3), (12, 79, 4)],
    [(0, 79, 2), (2, 83, 2), (4, 86, 2), (6, 83, 2), (8, 79, 3), (12, 81, 4)],
    [(0, 79, 2), (2, 83, 2), (4, 88, 2), (6, 86, 2), (8, 83, 3), (12, 79, 4)],
    [(0, 76, 2), (2, 81, 2), (4, 84, 2), (6, 83, 2), (8, 81, 6)],
]
STAB = [0, 3, 6, 8, 11, 14]
S16 = BEAT / 4

KICK, CLAP = kick(), clap()
HAT_C, HAT_O = hat(70), hat(22)

end_card = 34.5
bars = int(np.ceil(DUR / BAR))
duck = np.ones(N)
for b in range(bars):
    t0 = b * BAR
    root, tri = CHORDS[b % 4]
    for k in range(4):
        tb = t0 + k * BEAT
        if tb >= DUR: break
        add(KICK, tb, 0.9)
        i = int(tb * SR); m = min(N, i + int(0.18 * SR))
        duck[i:m] = np.minimum(duck[i:m], 0.35 + 0.65 * np.linspace(0, 1, m - i) ** 0.6)
        if k in (1, 3): add(CLAP, tb, 0.45, 0.05)
        add(HAT_C, tb + BEAT / 2, 0.30, 0.35)
        add(HAT_C, tb + 3 * S16, 0.12, -0.3)
        add(HAT_C, tb + S16, 0.08, 0.3)
    for s in STAB:
        add(pluck([midi(m) for m in tri]), t0 + s * S16, 0.42, -0.15)
    for k in range(8):
        add(bass(midi(root) * (2 if k % 2 else 1)), t0 + k * BEAT / 2, 0.55)
    if b >= 1:  # melody enters after first bar
        for st, m, ln in MEL[b % 4]:
            add(bell(midi(m), d=ln * S16 + 0.35), t0 + st * S16, 0.22, 0.2)

# swooshes into chapter changes (macaron 20.5s, milk tea 29.0s, end card 34.5s)
for tc in (20.5, 29.0, end_card):
    sw = swoosh(0.9); sw[-720:] *= np.linspace(1, 0.2, 720); add(sw, tc - 0.9, 0.22)

# sidechain-ish pump on the whole bed except kick (approximate by ducking total then re-adding kick is costly; light global pump)
mix = np.stack([L, R])[:, :N] * (0.75 + 0.25 * duck)

# simple reverb (FFT convolution with decaying noise IR)
ir_t = tt(1.4)
ir = rng.standard_normal((2, len(ir_t))) * np.exp(-ir_t * 4.5)
ir[:, : int(0.01 * SR)] = 0
nfft = 1 << int(np.ceil(np.log2(N + len(ir_t))))
wet = np.fft.irfft(np.fft.rfft(mix, nfft) * np.fft.rfft(ir, nfft), nfft)[:, :N]
wet /= np.max(np.abs(wet)) + 1e-9
mix = mix / (np.max(np.abs(mix)) + 1e-9) + wet * 0.12

# fade out at the very end
n_end = int(DUR * SR)
fade = int(1.2 * SR)
mix[:, n_end - fade:n_end] *= np.linspace(1, 0, fade) ** 1.5
mix = mix[:, :n_end]
mix = np.tanh(mix * 1.1)
mix /= np.max(np.abs(mix)) / 0.89

pcm = (mix.T * 32767).astype(np.int16)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", OUT, DUR)
