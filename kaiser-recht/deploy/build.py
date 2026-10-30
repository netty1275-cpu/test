"""Baut den Upload-Ordner mit genau den Dateien, die auf den Server gehören.

Live (www.kaiser-recht.de):      python deploy/build.py
Versteckte Vorschau (Unterordner auf einer anderen Domain):
                                 python deploy/build.py --vorschau

Live    -> dist/ und dist.zip
Vorschau -> vorschau/ und vorschau.zip. Unterschiede zur Live-Fassung:
  - jede Seite trägt <meta name="robots" content="noindex, nofollow">
  - robots.txt sperrt alles, keine sitemap.xml und keine llms.txt
  - .htaccess ohne Weiterleitung auf www.kaiser-recht.de, dafür X-Robots-Tag: noindex
  - das Formular öffnet das E-Mail-Programm, statt an anfrage.php zu senden
  - anfrage.php wird nicht mitgeliefert

Die Liste FILES ist absichtlich von Hand gepflegt. Neue Dateien hier eintragen.
"""
import os
import re
import shutil
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VORSCHAU = "--vorschau" in sys.argv

PAGES = [
    "index.html", "verkehrsunfall.html", "bussgeld-strafrecht.html", "familienrecht.html",
    "arbeitsrecht.html", "mietrecht.html", "baurecht.html", "mediation.html",
    "kanzlei.html", "kontakt.html", "impressum.html", "datenschutz.html",
]
FILES = PAGES + [
    "robots.txt", "sitemap.xml", "llms.txt", ".htaccess", "anfrage.php",
    "assets/css/site.css", "assets/css/tweaks.css", "assets/js/main.js", "assets/js/formular.js",
    "assets/fonts/literata-latin-opsz-normal.woff2", "assets/fonts/public-sans-latin-wght-normal.woff2",
    "assets/img/favicon.svg", "assets/img/favicon-32.png", "assets/img/favicon-512.png",
    "assets/img/apple-touch-icon.png", "assets/img/og-image.png",
    "assets/img/mediation-poster.jpg", "assets/img/mediation-poster-960.jpg", "assets/video/mediation.mp4",
]
if VORSCHAU:
    FILES = [f for f in FILES if f not in ("sitemap.xml", "llms.txt", "anfrage.php")]

OUT = os.path.join(ROOT, "vorschau" if VORSCHAU else "dist")
ZIP = OUT + ".zip"

missing = [rel for rel in FILES if not os.path.exists(os.path.join(ROOT, rel))]
if missing:
    raise SystemExit("Fehlt im Projekt:\n  " + "\n  ".join(missing))

if os.path.exists(OUT):
    shutil.rmtree(OUT)
for rel in FILES:
    src, dst = os.path.join(ROOT, rel), os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)

if VORSCHAU:
    for rel in PAGES:
        path = os.path.join(OUT, rel)
        html = open(path, encoding="utf-8").read()
        html = re.sub(r'<meta name="robots"[^>]*>\n?', "", html)
        html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta name="robots" content="noindex, nofollow">', 1)
        html = html.replace('data-endpoint="anfrage.php"', 'data-endpoint=""')
        open(path, "w", encoding="utf-8").write(html)
    open(os.path.join(OUT, "robots.txt"), "w").write("User-agent: *\nDisallow: /\n")
    open(os.path.join(OUT, ".htaccess"), "w").write(
        "# Vorschau: nicht in Suchmaschinen aufnehmen\n"
        "<IfModule mod_headers.c>\n  Header set X-Robots-Tag \"noindex, nofollow\"\n</IfModule>\n"
        "AddType font/woff2 .woff2\nAddType image/svg+xml .svg\nAddType video/mp4 .mp4\n"
    )

with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
    for rel in FILES:
        z.write(os.path.join(OUT, rel), rel)

size = sum(os.path.getsize(os.path.join(OUT, r)) for r in FILES)
print(f"{len(FILES)} Dateien, {size / 1024:.0f} KB, {os.path.basename(OUT)}/ und {os.path.basename(ZIP)} erstellt")
