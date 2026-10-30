"""Rendert animation.html Bild für Bild zu mediation.mp4 (30 Bilder pro Sekunde, 60 Sekunden).

Aufruf im Ordner video/:  python render.py
Braucht Playwright und ffmpeg.
"""
import pathlib
import subprocess
from playwright.sync_api import sync_playwright

FPS, DAUER = 30, 60
OUT = "mediation.mp4"
src = "file://" + str(pathlib.Path("animation.html").resolve())

ff = subprocess.Popen([
    "ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "slow", "-movflags", "+faststart", OUT,
], stdin=subprocess.PIPE)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto(src)
    pg.wait_for_timeout(1500)
    for i in range(FPS * DAUER):
        pg.evaluate(f"render({i / FPS})")
        ff.stdin.write(pg.screenshot(type="png"))
        if i % 300 == 0:
            print(f"{i // FPS} s")
    pg.evaluate(f"render(57)")
    pg.screenshot(path="poster.png")
    b.close()

ff.stdin.close()
ff.wait()
print("fertig:", OUT)
