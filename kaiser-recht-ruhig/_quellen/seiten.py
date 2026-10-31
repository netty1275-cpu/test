"""Erzeugt die Unterseiten aus den Texten in texte.md.

Kopfzeile, Kontaktblock, Fußbereich und Anrufleiste werden aus index.html
übernommen, damit alle Seiten gleich bleiben. Nach Änderungen an index.html
oder an den Inhalten hier einfach neu ausführen:

    python _quellen/seiten.py

Dieser Ordner wird nicht hochgeladen.
"""
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://www.kaiser-recht.de/"
INDEX = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()


def cut(start, end):
    i = INDEX.index(start)
    j = INDEX.index(end, i) + len(end)
    return INDEX[i:j]


HEADER = cut('<header class="site-head">', "</header>").replace('href="#rechtsgebiete"', 'href="index.html#rechtsgebiete"')
CONTACT = cut('<section class="section section--petrol" id="rueckruf"', "</section>")
FOOTER = cut('<footer class="site-foot">', "</footer>")
CALLBAR = cut('<div class="callbar">', "</div>")

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>'

BUTTONS = (
    '<div class="actions"><a class="btn" href="tel:+49306612254">' + PHONE + '030 661 22 54 anrufen</a>'
    '<a class="btn btn--line" href="#rueckruf">Rückruf erbitten</a></div>'
)


def slug(text):
    t = text.replace("&shy;", "").lower()
    for a, b in (("ä", "ae"), ("ö", "oe"), ("ü", "ue"), ("ß", "ss")):
        t = t.replace(a, b)
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def ul(items):
    return "<ul class=\"ticks\">" + "".join("<li>" + i + "</li>" for i in items) + "</ul>"


def steps(items, line="p"):
    out = '<ol class="steps steps--' + line + '">'
    for title, text in items:
        out += "<li><b>" + title + "</b>" + ("<span>" + text + "</span>" if text else "") + "</li>"
    return out + "</ol>"


def bridge(text, href, label):
    return (
        '<aside class="bridge"><p>' + text + '</p><a class="btn btn--terra" href="' + href + '">'
        + label + " " + ARROW + "</a></aside>"
    )


def page(p):
    sections = p.get("sections", [])
    faq = p.get("faq", [])
    line = p.get("line", "p")
    toc = [(s["h2"], s.get("id") or slug(s["h2"])) for s in sections]
    if faq:
        toc.append((p.get("faq_h2", "Häufige Fragen"), "fragen"))

    # Linienverlauf der Seite als Inhaltsverzeichnis
    route = ""
    if len(toc) > 1:
        route = '<nav class="route route--' + line + '" aria-label="Auf dieser Seite"><p class="route-h">Auf dieser Seite</p><ol>'
        route += "".join('<li><a href="#' + i + '">' + t + "</a></li>" for t, i in toc)
        route += "</ol></nav>"

    body = ""
    for n, s in enumerate(sections):
        sid = s.get("id") or slug(s["h2"])
        cls = "block" + (" block--alt" if n % 2 else "")
        body += '<section class="' + cls + '" id="' + sid + '" aria-labelledby="' + sid + '-h"><div class="wrap block-grid"><h2 id="' + sid + '-h">' + s["h2"] + '</h2><div class="prose">' + s["html"] + "</div></div></section>\n"

    if faq:
        body += '<section class="block block--faq" id="fragen" aria-labelledby="fragen-h"><div class="wrap block-grid"><h2 id="fragen-h">' + p.get("faq_h2", "Häufige Fragen") + '</h2><div class="faq">'
        for q, a in faq:
            body += "<details><summary>" + q + "</summary><div><p>" + a + "</p></div></details>"
        body += "</div></div></section>\n"

    ld = [{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": p["title"],
        "url": BASE + p["file"],
        "description": p["desc"],
        "about": {"@id": BASE + "#kanzlei"},
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Startseite", "item": BASE},
                {"@type": "ListItem", "position": 2, "name": p["crumb"], "item": BASE + p["file"]},
            ],
        },
    }]
    if faq:
        ld.append({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {"@type": "Question", "name": re.sub("<.*?>", "", q), "acceptedAnswer": {"@type": "Answer", "text": re.sub("<.*?>", "", a)}}
                for q, a in faq
            ],
        })
    ld += p.get("ld_extra", [])
    ld_html = "".join('<script type="application/ld+json">\n' + json.dumps(x, ensure_ascii=False, indent=1) + "\n</script>\n" for x in ld)

    header = HEADER
    current = p.get("nav")
    if current:
        header = header.replace('href="' + current + '"', 'href="' + current + '" aria-current="page"', 1)

    hero_cls = "sub-hero sub-hero--" + line
    contact = "" if p.get("no_contact") else CONTACT

    return f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p["title"]}</title>
<meta name="description" content="{html.escape(p["desc"])}">
<link rel="canonical" href="{BASE + p["file"]}">
<meta name="theme-color" content="#2D4654">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:title" content="{html.escape(p["title"])}">
<meta property="og:description" content="{html.escape(p["desc"])}">
<meta property="og:image" content="{BASE}assets/img/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta property="og:url" content="{BASE + p["file"]}">
{'<meta name="robots" content="noindex">' if p.get("noindex") else ''}
<link rel="preload" href="assets/fonts/spectral-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/atkinson-hyperlegible-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/css/site.css">
<link rel="stylesheet" href="assets/css/tweaks.css">
<script>document.documentElement.classList.add("js")</script>
{ld_html}</head>
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>

{header}

<main id="inhalt">

<section class="{hero_cls} light-room" aria-labelledby="h1">
  <div class="light light--a" aria-hidden="true" style="opacity:.6"></div>
  <div class="wrap sub-hero-grid">
    <div>
      <p class="crumb"><a href="index.html">Startseite</a> <span aria-hidden="true">/</span> {p["crumb"]}</p>
      <h1 id="h1">{p["h1"]}</h1>
      {''.join('<p class="lead">' + x + '</p>' for x in p["intro"])}
      {p.get("hero_buttons", BUTTONS)}
    </div>
    <aside class="info">
      {route}
      <dl class="card-info">
        <dt>Telefon</dt><dd><a href="tel:+49306612254">030 661 22 54</a><br><a href="tel:+49306612255">030 661 22 55</a></dd>
        <dt>Bürozeiten</dt><dd>Mo bis Do 9 bis 18 Uhr<br>Fr 9 bis 13 Uhr</dd>
        <dt>Kanzlei</dt><dd>Mariendorfer Damm 73<br>U6 Westphalweg, 20 Meter</dd>
      </dl>
    </aside>
  </div>
</section>

{body}{p.get("extra", "")}
{contact}

</main>

{FOOTER}

{CALLBAR}

<script src="assets/js/main.js" defer></script>
{'<script src="assets/js/formular.js" defer></script>' if contact else ''}
</body>
</html>
"""


from inhalte import PAGES  # noqa: E402

for p in PAGES:
    with open(os.path.join(ROOT, p["file"]), "w", encoding="utf-8") as f:
        f.write(page(p))
    print("geschrieben:", p["file"])
