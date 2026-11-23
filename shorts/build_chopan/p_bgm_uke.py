"""Original bouncy acoustic pop (120 BPM): Karplus-Strong ukulele strums, glockenspiel hook,
plucked bass, kick / finger-snap / shaker, glock run-ups into chapter changes, final ringing strum."""
import numpy as np, wave, sys

SR = 48000
BPM = 120
BEAT = 60 / BPM; BAR = 4 * BEAT; S16 = BEAT / 4
OUT = sys.argv[1] if len(sys.argv) > 1 else "bgm_uke.wav"
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 25.8
END_CARD = float(sys.argv[3]) if len(sys.argv) > 3 else 22.3
CHAPTERS = (10.0, 18.0)
FINAL_HIT = 24.0
N = int((DUR + 3) * SR)
rng = np.random.default_rng(31)
DR = np.zeros((2, N)); MU = np.zeros((2, N))

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

# ---------- Karplus-Strong string (vectorised per period)
_ks = {}
def ks(m, d=1.2, bright=0.5, decay=0.996):
    key = (m, d)
    if key in _ks: return _ks[key]
    f = midi(m); P = max(2, int(round(SR / f)))
    n = int(d * SR)
    y = np.zeros(n + P + 1)
    burst = rng.uniform(-1, 1, P)
    burst = burst * (1 - bright) + smooth(burst, 2) * bright
    y[:P] = burst
    i = P
    while i < n + P:
        j = min(i + P, n + P)
        prev = y[i - P:j - P]; prev2 = y[i - P - 1:j - P - 1] if i - P - 1 >= 0 else np.concatenate([[0], y[i - P:j - P - 1]])
        y[i:j] = decay * 0.5 * (prev + prev2)
        i = j
    s = y[P:P + n]
    s[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    _ks[key] = s
    return s

def strum(notes, t, down=True, gain=1.0, d=0.9):
    order = notes if down else notes[::-1]
    for k, m in enumerate(order):
        add(MU, ks(m, d), t + k * 0.011, gain * (1.0 if down else 0.7) / len(notes) * 2.2, -0.25 + 0.12 * k)

# ---------- glockenspiel
def glock(f, d=0.9):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 4.5)
    s += 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 11)
    s += 0.18 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 20)
    s *= np.minimum(1, t / 0.0015)
    s[-300:] *= np.linspace(1, 0, 300)
    return s

def bass(f, d):
    t = tt(d)
    s = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1, t / 0.004) * np.exp(-t * 6)
    s = s * env; s[-500:] *= np.linspace(1, 0, 500)
    return s * 0.8

# ---------- percussion
def kick():
    t = tt(0.28); f = 50 + 90 * np.exp(-t * 32)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * 1.6)

def snap():
    t = tt(0.12); n = rng.standard_normal(len(t))
    s = (smooth(n, 2) - smooth(n, 9)) * np.exp(-t * 55)
    s += np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 90) * 0.3
    return s * 1.6

def shaker(acc):
    t = tt(0.07); n = rng.standard_normal(len(t))
    env = np.minimum(1, t / 0.012) * np.exp(-t * 60)
    return (n - smooth(n, 2)) * env * (0.22 if acc else 0.12)

# ---------- song: D - A - Bm - G (uke-style voicings)
CH = [(38, [62, 66, 69, 74]), (45, [61, 64, 69, 73]), (47, [62, 66, 71, 74]), (43, [62, 67, 71, 74])]
MEL = [
    [(0, 86, 2), (2, 85, 2), (4, 86, 2), (6, 88, 2), (8, 90, 4), (12, 88, 2), (14, 86, 2)],
    [(0, 85, 3), (4, 81, 2), (6, 83, 2), (8, 85, 4), (12, 88, 4)],
    [(0, 86, 2), (2, 88, 2), (4, 90, 2), (6, 91, 2), (8, 93, 3), (12, 90, 2), (14, 88, 2)],
    [(0, 86, 4), (4, 83, 2), (6, 85, 2), (8, 86, 6)],
]
STRUM = [(0, True, 1.0), (4, True, 0.8), (6, False, 0.6), (10, False, 0.6), (12, True, 0.8), (14, False, 0.6)]
KICK, SNAP = kick(), snap()

bars = int(np.ceil(FINAL_HIT / BAR))
for b in range(bars):
    t0 = b * BAR
    root, notes = CH[b % 4]
    for st, dn, g in STRUM:
        tk = t0 + st * S16
        if tk < FINAL_HIT: strum(notes, tk, dn, g)
    for st, iv in ((0, 0), (6, 7), (8, 0), (14, 7)):
        tk = t0 + st * S16
        if tk < FINAL_HIT: add(MU, bass(midi(root + iv), 0.28), tk, 0.55)
    if b >= 1:
        for st, m, ln in MEL[b % 4]:
            tk = t0 + st * S16
            if tk < FINAL_HIT: add(MU, glock(midi(m), ln * S16 + 0.5), tk, 0.22, 0.3)
    for k in range(4):
        tb = t0 + k * BEAT
        if tb >= FINAL_HIT: break
        if k in (0, 2): add(DR, KICK, tb, 0.85)
        if k == 1: add(DR, KICK, tb + 2 * S16, 0.45)
        if k in (1, 3): add(DR, SNAP, tb, 0.55, 0.15)
    for s in range(16):
        tk = t0 + s * S16
        if tk < FINAL_HIT: add(DR, shaker(s % 2 == 1), tk, 1.0, 0.4)

# glock run-up into chapter changes and the end card
for tc in CHAPTERS + (END_CARD,):
    run = [74, 76, 78, 79, 81, 83, 85, 86]
    for k, m in enumerate(run):
        add(MU, glock(midi(m + 12), 0.4), tc - BEAT + k * (BEAT / 8), 0.12 + 0.012 * k, 0.3)

# final ringing strum + glock chord
root, notes = CH[0]
for k in range(3):
    strum(notes, FINAL_HIT + k * 0.06, True, 1.2, d=2.0)
add(MU, bass(midi(root), 1.2), FINAL_HIT, 0.7)
for m in (86, 90, 93):
    add(MU, glock(midi(m), 1.8), FINAL_HIT, 0.18, 0.3)
add(DR, KICK, FINAL_HIT, 0.9)

# room reverb on music
ir_t = tt(0.8)
ir = rng.standard_normal((2, len(ir_t))) * np.exp(-ir_t * 7); ir[:, : int(0.01 * SR)] = 0
nfft = 1 << int(np.ceil(np.log2(N + len(ir_t))))
wet = np.fft.irfft(np.fft.rfft(MU, nfft) * np.fft.rfft(ir, nfft), nfft)[:, :N]
mix = DR / np.max(np.abs(DR)) * 0.75 + MU / np.max(np.abs(MU)) * 0.95 + wet / np.max(np.abs(wet)) * 0.14

n_end = int(DUR * SR)
fade = int(1.2 * SR)
mix[:, n_end - fade:n_end] *= np.linspace(1, 0, fade) ** 1.5
mix = mix[:, :n_end]
mix = np.tanh(mix * 1.15)
mix /= np.max(np.abs(mix)) / 0.89
with wave.open(OUT, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix.T * 32767).astype(np.int16).tobytes())
print("wrote", OUT)
