"""Baut den Ordner für den USB-Stick: Startmenü mit neuer und alter Website.

Aufruf im Projektordner:  python _quellen/stick.py
Ergebnis: stick/Kaiser-Website/ und stick/Kaiser-Website.zip
"""
import glob
import os
import shutil
import subprocess
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "stick", "Kaiser-Website")
ALT_ZIP = os.path.join(ROOT, "archiv", "alte-seite-kaiser-recht.zip")

subprocess.run(["python3", os.path.join(ROOT, "deploy", "build.py"), "--vorschau"], check=True)
if os.path.exists(os.path.dirname(OUT)):
    shutil.rmtree(os.path.dirname(OUT))
shutil.copytree(os.path.join(ROOT, "vorschau"), os.path.join(OUT, "neu"))
with zipfile.ZipFile(ALT_ZIP) as z:
    z.extractall(OUT)
os.rename(os.path.join(OUT, "alte-seite-kaiser-recht"), os.path.join(OUT, "alt"))
with zipfile.ZipFile(os.path.join(ROOT, "archiv", "entwurf-august-2026.zip")) as z:
    z.extractall(os.path.join(OUT, "entwurf-august"))
for f in ("LIESMICH-fuer-den-Provider.txt", "robots.txt"):
    p = os.path.join(OUT, "entwurf-august", f)
    if os.path.exists(p):
        os.remove(p)
for f in (".htaccess", "robots.txt"):
    p = os.path.join(OUT, "neu", f)
    if os.path.exists(p):
        os.remove(p)

# Kleiner Knopf zurück zur Übersicht auf jeder Seite beider Websites
BTN = ('<a href="{href}START.html" style="position:fixed;left:16px;bottom:16px;z-index:2147483647;'
       'background:#22312E;color:#F4EFE6;font:600 15px/1 system-ui,sans-serif;text-decoration:none;'
       'padding:12px 16px;border-radius:999px;box-shadow:0 8px 20px -8px rgba(0,0,0,.5)">&larr; Zur Übersicht</a>')
for page in glob.glob(os.path.join(OUT, "**", "*.html"), recursive=True):
    rel = os.path.relpath(OUT, os.path.dirname(page)).replace(os.sep, "/") + "/"
    raw = open(page, "rb").read()
    enc = "utf-8"
    try:
        html = raw.decode("utf-8")
    except UnicodeDecodeError:
        html, enc = raw.decode("latin-1"), "latin-1"
    btn = BTN.format(href=rel)
    if enc == "latin-1":
        btn = btn.replace("Ü", "&Uuml;")
    i = html.lower().rfind("</body>")
    html = html[:i] + btn + "\n" + html[i:] if i != -1 else html + btn
    open(page, "w", encoding=enc, errors="xmlcharrefreplace").write(html)

shutil.copy(os.path.join(ROOT, "_quellen", "stick-start.html"), os.path.join(OUT, "START.html"))
shutil.copy(os.path.join(ROOT, "archiv", "alte-seite", "startseite.png"), os.path.join(OUT, "alt-vorschau.png"))
shutil.copy(os.path.join(ROOT, "archiv", "entwurf-august-vorschau.png"), os.path.join(OUT, "entwurf-vorschau.png"))
shutil.copy(os.path.join(ROOT, "archiv", "audit-kaiser-recht-2026-10.pdf"), os.path.join(OUT, "Pruefbericht-bisherige-Website.pdf"))
shutil.copy(os.path.join(ROOT, "_quellen", "stick-fragen.html"), os.path.join(OUT, "Fragen.html"))

zpath = os.path.join(ROOT, "stick", "Kaiser-Website.zip")
with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
    for path in glob.glob(os.path.join(OUT, "**", "*"), recursive=True):
        if os.path.isfile(path):
            z.write(path, os.path.relpath(path, os.path.dirname(OUT)))
print("fertig:", zpath)
