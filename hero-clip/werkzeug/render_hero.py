#!/usr/bin/env python3
"""Rendert den Hero-Clip für eine Produktionsfirma für Funk und Fernsehen.

Szene: dunkles Studio, schwenkende Scheinwerfer, Staub im Licht,
Radio-Wellenform, ON-AIR-Schild und Kamera-Sucher (REC, Timecode, Pegel).
Alle Bewegungen sind periodisch über die Cliplänge, damit das Video als
Hintergrund nahtlos in Schleife läuft.

Aufruf:  python3 render_hero.py <ausgabeordner>
Benötigt: numpy, Pillow, ffmpeg
"""
import math
import subprocess
import sys
from multiprocessing import Pool
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

B, H = 1920, 1080          # Ausgabegröße
FPS = 25
DAUER = 20                 # Sekunden, Schleifenlänge
N = FPS * DAUER
TAU = 2 * math.pi

SCHRIFT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
SCHRIFT = "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf"
SCHRIFT_FETT = "/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf"

# --- Vorberechnungen ---------------------------------------------------------

hb, hh = B // 2, H // 2    # Lichtkegel werden in halber Auflösung gerechnet
yy, xx = np.mgrid[0:hh, 0:hb].astype(np.float32)

# Scheinwerfer: Quelle (x, y relativ), Grundwinkel, Schwenk, Phase, Breite, Farbe
SCHEINWERFER = [
    (0.10, -0.12, 0.42, 0.10, 0.0, 0.11, (1.00, 0.70, 0.40)),
    (0.38, -0.18, 0.10, 0.12, 1.7, 0.08, (0.80, 0.86, 1.00)),
    (0.66, -0.18, -0.12, 0.11, 3.3, 0.08, (1.00, 0.78, 0.52)),
    (0.92, -0.12, -0.45, 0.09, 4.6, 0.11, (0.95, 0.66, 0.40)),
]
kegel_geo = []
for sx, sy, *_ in SCHEINWERFER:
    dx = xx - sx * hb
    dy = yy - sy * hh
    kegel_geo.append((np.arctan2(dx, dy), np.sqrt(dx * dx + dy * dy) / hh))


# Studioboden: Kegel enden hier, darunter nur ein schwacher Widerschein
BODEN_Y = 0.80
BODEN_MASKE = (1.0 - np.clip((yy / hh - BODEN_Y + 0.01) / 0.03, 0, 1) * 0.88).astype(np.float32)


def periodisches_rauschen(h, w, glaette, saat):
    """Weiches Rauschen, das an den Rändern nahtlos umbricht (FFT-Filter)."""
    rng = np.random.default_rng(saat)
    f = np.fft.fft2(rng.standard_normal((h, w)))
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    f *= np.exp(-(fx * fx + fy * fy) * glaette)
    n = np.real(np.fft.ifft2(f))
    n -= n.min()
    return (n / n.max()).astype(np.float32)


DUNST = periodisches_rauschen(hh, hb, 4000.0, 7)

# Staubpartikel
rng = np.random.default_rng(42)
ANZ = 260
P_X = rng.uniform(0, B, ANZ)
P_Y = rng.uniform(0, H, ANZ)
P_TIEFE = rng.uniform(0, 1, ANZ) ** 2.2          # wenige große, nahe Partikel
P_PHASE = rng.uniform(0, TAU, ANZ)
P_WACKEL = rng.uniform(6, 30, ANZ)
P_HELL = rng.uniform(0.4, 1.0, ANZ)


def kern(r):
    a = np.arange(-2 * r, 2 * r + 1, dtype=np.float32)
    g = np.exp(-(a[:, None] ** 2 + a[None, :] ** 2) / (2 * r * r))
    return g


KERNE = {r: kern(r) for r in range(1, 9)}

# Vignette und Körnung
vy, vx = np.mgrid[0:H, 0:B].astype(np.float32)
VIGNETTE = 1.0 - 0.62 * (((vx / B - 0.5) * 1.25) ** 2 + ((vy / H - 0.48) * 1.6) ** 2)
VIGNETTE = np.clip(VIGNETTE, 0.25, 1.0)[..., None]
KORN = [np.random.default_rng(100 + i).normal(0, 1, (H // 2, B // 2)).astype(np.float32)
        for i in range(8)]

F_TC = ImageFont.truetype(SCHRIFT_MONO, 30)
F_KLEIN = ImageFont.truetype(SCHRIFT, 22)
F_REC = ImageFont.truetype(SCHRIFT_FETT, 28)
F_ONAIR = ImageFont.truetype(SCHRIFT_FETT, 46)


# --- Hilfsfunktionen ---------------------------------------------------------

def glatt(a, b, x):
    t = min(max((x - a) / (b - a), 0.0), 1.0)
    return t * t * (3 - 2 * t)


def fenster(t, ein0, ein1, aus0, aus1):
    return glatt(ein0, ein1, t) * (1 - glatt(aus0, aus1, t))


def welle(t):
    """Grundphase, die nach DAUER Sekunden exakt wieder bei 0 ist."""
    return TAU * t / DAUER


def splat(bild, x, y, r, farbe, staerke):
    k = KERNE[r]
    s = k.shape[0] // 2
    xi, yi = int(x), int(y)
    x0, x1 = max(xi - s, 0), min(xi + s + 1, B)
    y0, y1 = max(yi - s, 0), min(yi + s + 1, H)
    if x0 >= x1 or y0 >= y1:
        return
    kk = k[y0 - (yi - s):y1 - (yi - s), x0 - (xi - s):x1 - (xi - s)]
    bild[y0:y1, x0:x1] += kk[..., None] * (np.array(farbe, np.float32) * staerke)


# --- Ebenen ------------------------------------------------------------------

def lichtkegel(t):
    licht = np.zeros((hh, hb, 3), np.float32)
    w = welle(t)
    for (sx, sy, grund, schwenk, ph, breite, farbe), (phi, dist) in zip(SCHEINWERFER, kegel_geo):
        theta = grund + schwenk * math.sin(w + ph)
        d = phi - theta
        kegel = np.exp(-(d / breite) ** 2)
        # feine Strahlen im Licht, die mit dem Kegel mitwandern
        strahlen = 0.82 + 0.18 * np.sin(d * 70 + ph * 3) * np.sin(d * 23 - ph)
        abfall = np.exp(-dist * 0.85) * np.clip(dist * 3.0, 0, 1)
        atmen = 0.85 + 0.15 * math.sin(2 * w + ph)
        i = kegel * strahlen * abfall * atmen * BODEN_MASKE
        # Lichtpfütze dort, wo der Kegel auf den Boden trifft
        tx = sx * hb + math.tan(theta) * (BODEN_Y * hh - sy * hh)
        pfuetze = np.exp(-((xx - tx) / (hb * 0.07)) ** 2 - ((yy - BODEN_Y * hh) / (hh * 0.025)) ** 2)
        i = i + pfuetze * 0.55 * atmen
        licht += i[..., None] * np.array(farbe, np.float32)
    # Dunst bewegt sich einmal ganz durchs Bild pro Schleife -> nahtlos
    verschiebung = int(round(t / DAUER * hb))
    dunst = np.roll(DUNST, verschiebung, axis=1)
    licht *= (0.45 + 0.9 * dunst)[..., None]
    return licht


def boden_und_hintergrund():
    grund = np.zeros((H, B, 3), np.float32)
    grad = (vy / H)[..., None]
    grund += np.array([0.010, 0.014, 0.030], np.float32) * (1.0 - grad)
    grund += np.array([0.030, 0.022, 0.020], np.float32) * grad ** 3
    return grund


HINTERGRUND = boden_und_hintergrund()


def staub(bild, t, licht_hr):
    w = welle(t)
    for i in range(ANZ):
        # steigt genau einmal pro Schleife durchs Bild
        y = (P_Y[i] - (t / DAUER) * (H + 80)) % (H + 80) - 40
        x = P_X[i] + P_WACKEL[i] * math.sin(w * 2 + P_PHASE[i])
        tiefe = P_TIEFE[i]
        r = 1 + int(tiefe * 7)
        lx = min(max(int(x / 2), 0), hb - 1)
        ly = min(max(int(y / 2), 0), hh - 1)
        im_licht = float(licht_hr[ly, lx].mean())
        funkeln = 0.75 + 0.25 * math.sin(w * 6 + P_PHASE[i] * 3)
        staerke = P_HELL[i] * (0.04 + 2.6 * im_licht) * funkeln * (0.9 - 0.55 * tiefe)
        splat(bild, x, y, r, (1.0, 0.86, 0.68), staerke * 0.55)


def wellenform(t, staerke):
    """Leuchtende Oszilloskop-Linien im unteren Drittel (Funk/Radio)."""
    if staerke <= 0.001:
        return None
    ebene = Image.new("RGB", (B, H), (0, 0, 0))
    zeichen = ImageDraw.Draw(ebene)
    w = welle(t)
    cy = H * BODEN_Y
    xs = np.linspace(0, B, 480)
    rel = xs / B
    huelle = np.exp(-((rel - 0.5) / 0.30) ** 2)
    linien = [
        ((255, 190, 120), 0.0, 1.0, 3),
        ((150, 190, 255), 1.3, 0.7, 2),
        ((255, 120, 90), 2.6, 0.5, 2),
    ]
    for farbe, ph, amp, breite in linien:
        y = np.zeros_like(xs)
        # ganzzahlige Zeitfrequenzen -> periodisch über die Schleife
        y += np.sin(rel * TAU * 3.0 - w * 4 + ph) * 34
        y += np.sin(rel * TAU * 7.0 + w * 6 + ph * 2) * 16
        y += np.sin(rel * TAU * 17.0 - w * 10 + ph) * 7 * (0.6 + 0.4 * math.sin(w * 3 + ph))
        y += np.sin(rel * TAU * 41.0 + w * 14) * 3
        pegel = 0.55 + 0.45 * math.sin(w * 5 + ph) ** 2
        y = cy + y * huelle * amp * pegel * 1.9
        punkte = list(zip(xs.tolist(), y.tolist()))
        zeichen.line(punkte, fill=farbe, width=breite, joint="curve")
    arr = np.asarray(ebene, np.float32) / 255.0
    glow = np.asarray(ebene.filter(ImageFilter.GaussianBlur(10)), np.float32) / 255.0
    return (arr * 0.8 + glow * 3.0) * staerke


def on_air(t):
    """Leuchtschild: geht nach dem Start flackernd an, am Ende wieder aus."""
    an = glatt(1.6, 1.75, t) * (1 - glatt(18.4, 19.0, t))
    # kurzes Einschaltflackern wie bei einer echten Röhre
    if 1.75 < t < 2.4:
        an *= 0.55 + 0.45 * (math.sin(t * 90) > -0.2)
    return an


def onair_ebene(t):
    an = on_air(t)
    ebene = Image.new("RGB", (B, H), (0, 0, 0))
    z = ImageDraw.Draw(ebene)
    text = "ON AIR"
    tb = z.textbbox((0, 0), text, font=F_ONAIR)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    cx, cy = int(B * 0.80), int(H * 0.30)
    pad_x, pad_y = 34, 22
    box = (cx - tw // 2 - pad_x, cy - th // 2 - pad_y, cx + tw // 2 + pad_x, cy + th // 2 + pad_y + 6)
    # ausgeschaltet bleibt das Schild als dunkler Rahmen sichtbar
    rahmen = (int(60 + 120 * an), int(22 + 20 * an), int(22 + 16 * an))
    z.rounded_rectangle(box, radius=10, outline=rahmen, width=3,
                        fill=(int(14 + 150 * an), int(6 + 18 * an), int(6 + 14 * an)))
    schrift = (int(70 + 185 * an), int(40 + 205 * an), int(40 + 195 * an))
    z.text((cx - tw // 2 - tb[0], cy - th // 2 - tb[1]), text, font=F_ONAIR, fill=schrift)
    arr = np.asarray(ebene, np.float32) / 255.0
    glow = np.asarray(ebene.filter(ImageFilter.GaussianBlur(28)), np.float32) / 255.0
    rot = np.array([1.0, 0.25, 0.18], np.float32)
    return arr * 0.9 + glow * rot * 2.4 * an


def timecode(t):
    gesamt = int(round(t * FPS)) + 10 * 3600 * FPS + 15 * 60 * FPS  # Start 10:15:00:00
    f = gesamt % FPS
    s = gesamt // FPS
    return f"{s // 3600:02d}:{s // 60 % 60:02d}:{s % 60:02d}:{f:02d}"


def sucher_ebene(t, staerke):
    """Kamera-Sucher: Ecken, REC, Timecode, Kameradaten, Audiopegel."""
    if staerke <= 0.001:
        return None
    ebene = Image.new("RGBA", (B, H), (0, 0, 0, 0))
    z = ImageDraw.Draw(ebene)
    weiss = (235, 238, 245, 220)
    rand, lang, dicke = 70, 80, 3
    for ex, ey, sx, sy in [(rand, rand, 1, 1), (B - rand, rand, -1, 1),
                           (rand, H - rand, 1, -1), (B - rand, H - rand, -1, -1)]:
        z.line([(ex, ey), (ex + sx * lang, ey)], fill=weiss, width=dicke)
        z.line([(ex, ey), (ex, ey + sy * lang)], fill=weiss, width=dicke)
    # Mittelkreuz
    mx, my = B // 2, H // 2
    z.line([(mx - 18, my), (mx + 18, my)], fill=(235, 238, 245, 120), width=2)
    z.line([(mx, my - 18), (mx, my + 18)], fill=(235, 238, 245, 120), width=2)
    # REC mit blinkendem Punkt
    if (t % 1.0) < 0.62:
        z.ellipse([rand + 30, rand + 30, rand + 54, rand + 54], fill=(240, 50, 45, 255))
    z.text((rand + 66, rand + 26), "REC", font=F_REC, fill=weiss)
    # Timecode
    tc = "TC " + timecode(t)
    tb = z.textbbox((0, 0), tc, font=F_TC)
    z.text((B - rand - 30 - (tb[2] - tb[0]), rand + 26), tc, font=F_TC, fill=weiss)
    # Kameradaten
    z.text((rand + 30, H - rand - 52), "4K   25P   ISO 800   5600K   ND 0.6", font=F_KLEIN,
           fill=(235, 238, 245, 190))
    # Audiopegel L/R
    w = welle(t)
    for k, kanal in enumerate("LR"):
        y0 = H - rand - 60 + k * 22
        x0 = B - rand - 330
        z.text((x0 - 26, y0 - 6), kanal, font=F_KLEIN, fill=(235, 238, 245, 190))
        pegel = 0.55 + 0.25 * math.sin(w * 9 + k) + 0.15 * math.sin(w * 23 + 2 * k) \
            + 0.05 * math.sin(w * 61 + k)
        segmente = 24
        for s in range(segmente):
            an = s / segmente < pegel
            if s >= 20:
                farbe = (240, 70, 60)
            elif s >= 16:
                farbe = (240, 200, 70)
            else:
                farbe = (110, 220, 140)
            alpha = 230 if an else 50
            z.rectangle([x0 + s * 13, y0, x0 + s * 13 + 9, y0 + 12], fill=farbe + (alpha,))
    arr = np.asarray(ebene, np.float32) / 255.0
    return arr[..., :3] * arr[..., 3:] * staerke


# --- Einzelbild --------------------------------------------------------------

def bild(i):
    t = i / FPS
    licht_hr = lichtkegel(t)
    licht = np.asarray(
        Image.fromarray(np.clip(licht_hr * 80, 0, 255).astype(np.uint8)).resize((B, H), Image.BILINEAR),
        np.float32) / 80.0
    rahmen = HINTERGRUND + licht * 0.62
    staub(rahmen, t, licht_hr)

    wf = wellenform(t, 0.85)
    if wf is not None:
        rahmen += wf * 0.55
    rahmen += onair_ebene(t) * 0.75

    # Ton-Mapping (weiches Abrollen der Lichter) und leichte Farbgebung
    rahmen = 1.0 - np.exp(-rahmen * 1.55)
    rahmen *= VIGNETTE
    rahmen = rahmen ** np.array([1.0, 1.02, 1.08], np.float32)

    # Sucher kommt nach dem Ton-Mapping, damit Linien gestochen scharf bleiben
    s = fenster(t, 3.6, 4.6, 15.4, 16.6)
    sucher = sucher_ebene(t, s)
    if sucher is not None:
        rahmen = rahmen + sucher * 0.8

    korn = KORN[i % len(KORN)]
    korn = np.repeat(np.repeat(korn, 2, axis=0), 2, axis=1)[..., None]
    rahmen += korn * 0.010

    return (np.clip(rahmen, 0, 1) * 255 + 0.5).astype(np.uint8).tobytes()


def main():
    ziel = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
    ziel.mkdir(parents=True, exist_ok=True)
    roh = ziel / "_roh.mov"
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{B}x{H}", "-r", str(FPS), "-i", "-",
         "-c:v", "libx264", "-preset", "slow", "-crf", "10", "-pix_fmt", "yuv444p", str(roh)],
        stdin=subprocess.PIPE)
    with Pool(4) as pool:
        for n, daten in enumerate(pool.imap(bild, range(N), chunksize=4)):
            ff.stdin.write(daten)
            if n % 50 == 0:
                print(f"Bild {n}/{N}", flush=True)
    ff.stdin.close()
    ff.wait()
    print("Rohfassung fertig:", roh)


if __name__ == "__main__":
    main()
