#!/usr/bin/env python3
"""Akquise-Briefe erzeugen und über onlinebrief24.de drucken und versenden.

Befehle:
  python3 brief.py einzelbrief --firma .. --strasse .. --plz .. --ort .. --text ..   einen Brief erzeugen
  python3 brief.py erzeugen            PDFs aus empfaenger.csv + vorlage.txt erzeugen (ausgabe/)
  python3 brief.py senden              PDFs im TESTMODUS übertragen (landen im Warenkorb)
  python3 brief.py senden --live       PDFs wirklich drucken und versenden lassen
  python3 brief.py preis [--seiten N]  Preis je Brief abfragen
  python3 brief.py guthaben            Guthaben abfragen
  python3 brief.py auftraege [--filter queue|hold|done|canceled|draft]

Zugangsdaten (Kundencenter > Einstellungen > API Zugang > Zugangsdaten):
  export OB24_API_KEY=...
  export OB24_API_SECRET=...
"""
import argparse
import base64
import csv
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

BASIS = Path(__file__).resolve().parent
AUSGABE = BASIS / "ausgabe"
PROTOKOLL = BASIS / "versandprotokoll.csv"
API = os.environ.get("OB24_API_URL", "https://api.onlinebrief24.de/v1")

SCHRIFT, SCHRIFT_FETT, GROESSE = "Helvetica", "Helvetica-Bold", 11


# ---------------------------------------------------------------- PDF (DIN 5008, Form B)

def briefanrede(e):
    if e["anrede"] == "Frau" and e["nachname"]:
        return f"Sehr geehrte Frau {e['nachname']},"
    if e["anrede"] == "Herr" and e["nachname"]:
        return f"Sehr geehrter Herr {e['nachname']},"
    return "Sehr geehrte Damen und Herren,"


def anschrift(e):
    zeilen = []
    if e.get("firma"):
        zeilen.append(e["firma"])
    person = " ".join(x for x in (e.get("anrede", ""), e.get("vorname", ""), e.get("nachname", "")) if x)
    if person and person not in ("Frau", "Herr"):
        zeilen.append(person)
    zeilen.append(e["strasse"])
    zeilen.append(f"{e['plz']} {e['ort']}")
    land = (e.get("land") or "").strip()
    if land and land.lower() not in ("deutschland", "de"):
        zeilen.append(land.upper())
    return zeilen


def umbrechen(text, breite, c):
    """Absätze bleiben erhalten, einfache Zeilenumbrüche innerhalb eines Absatzes werden zusammengezogen."""
    ergebnis = []
    for absatz in re.split(r"\n\s*\n", text.strip("\n")):
        zeilen_im_absatz = absatz.split("\n")
        # Grußformel/Signatur (kurze Zeilen) nicht zusammenziehen
        if all(len(z) < 45 for z in zeilen_im_absatz):
            ergebnis.extend(zeilen_im_absatz)
        else:
            woerter, zeile = " ".join(z.strip() for z in zeilen_im_absatz).split(), ""
            for w in woerter:
                probe = f"{zeile} {w}".strip()
                if c.stringWidth(probe, SCHRIFT, GROESSE) <= breite:
                    zeile = probe
                else:
                    ergebnis.append(zeile)
                    zeile = w
            if zeile:
                ergebnis.append(zeile)
        ergebnis.append("")
    return ergebnis[:-1]


def brief_pdf(pfad, absender, empfaenger, vorlage):
    werte = {**{k: v for k, v in empfaenger.items()},
             "briefanrede": briefanrede(empfaenger),
             "telefon": absender["telefon"], "email": absender["email"], "web": absender["web"],
             "absender_name": absender["name"], "absender_firma": absender["firma"]}
    text = vorlage.format(**werte)
    betreff = ""
    if text.startswith("Betreff:"):
        betreff, text = text.split("\n", 1)
        betreff = betreff[len("Betreff:"):].strip()

    c = canvas.Canvas(str(pfad), pagesize=A4)
    c.setTitle(f"Brief an {empfaenger.get('firma') or empfaenger.get('nachname')}")
    _, hoehe = A4
    oben = lambda y_mm: hoehe - y_mm * mm  # noqa: E731
    links, rechts = 25 * mm, 20 * mm
    breite = A4[0] - links - rechts

    # Briefkopf
    c.setFont(SCHRIFT_FETT, 14)
    c.drawString(links, oben(20), absender["firma"])
    c.setFont(SCHRIFT, 9)
    c.drawString(links, oben(26), f"{absender['strasse']} · {absender['plz_ort']} · {absender['telefon']} · {absender['email']}")

    # Falz- und Lochmarken (Form B: 105 mm / 210 mm, Lochmarke 148,5 mm)
    c.setLineWidth(0.3)
    for y in (105, 210, 148.5):
        c.line(3 * mm, oben(y), (8 if y == 148.5 else 6) * mm, oben(y))

    # Anschriftfeld: 45 mm von oben, 85 x 45 mm; Rücksendeangabe in der Vermerkzone
    c.setFont(SCHRIFT, 7)
    c.drawString(links, oben(45 + 15), f"{absender['firma']} · {absender['strasse']} · {absender['plz_ort']}")
    c.setFont(SCHRIFT, GROESSE)
    y = 45 + 17.7 + 4.5
    for zeile in anschrift(empfaenger)[:9]:
        c.drawString(links, oben(y), zeile)
        y += 4.5

    # Datum (rechtsbündig in Höhe der Informationszone) und Betreff
    c.drawRightString(A4[0] - rechts, oben(97.4), f"{absender['ort_fuer_datum']}, {date.today():%d.%m.%Y}")
    y = 103.4
    if betreff:
        c.setFont(SCHRIFT_FETT, GROESSE)
        c.drawString(links, oben(y), betreff)
        y += 2 * 4.8
    c.setFont(SCHRIFT, GROESSE)
    for zeile in umbrechen(text.lstrip("\n"), breite, c):
        if y > 280:
            c.showPage()
            c.setFont(SCHRIFT, GROESSE)
            y = 25
        c.drawString(links, oben(y), zeile)
        y += 4.8
    c.save()


def dateiname(nr, e):
    roh = e.get("firma") or f"{e.get('nachname', '')}_{e.get('vorname', '')}"
    sicher = re.sub(r"[^A-Za-z0-9ÄÖÜäöüß_-]+", "_", roh).strip("_")
    return f"{nr:03d}_{sicher}.pdf"


def einzelbrief(args):
    """Einen einzelnen Brief erzeugen, ohne CSV und Vorlage."""
    absender = json.loads((BASIS / "absender.json").read_text(encoding="utf-8"))
    e = {"anrede": args.anrede or "", "vorname": args.vorname or "", "nachname": args.nachname or "",
         "firma": args.firma or "", "strasse": args.strasse, "plz": args.plz, "ort": args.ort, "land": args.land or ""}
    text = Path(args.text_datei).read_text(encoding="utf-8") if args.text_datei else args.text
    text = text.replace("{", "{{").replace("}", "}}")
    vorlage = (f"Betreff: {args.betreff}\n\n" if args.betreff else "") + "{briefanrede}\n\n" + text.strip() + \
        "\n\nMit freundlichen Grüßen\n\n{absender_name}\n{absender_firma}"
    if args.ohne_anrede:
        vorlage = vorlage.replace("{briefanrede}\n\n", "", 1)
    AUSGABE.mkdir(exist_ok=True)
    nr = len(list(AUSGABE.glob("*.pdf"))) + 1
    pfad = AUSGABE / dateiname(nr, e)
    brief_pdf(pfad, absender, e, vorlage)
    print(pfad)


def erzeugen(_args):
    absender = json.loads((BASIS / "absender.json").read_text(encoding="utf-8"))
    vorlage = (BASIS / "vorlage.txt").read_text(encoding="utf-8")
    AUSGABE.mkdir(exist_ok=True)
    with open(BASIS / "empfaenger.csv", newline="", encoding="utf-8-sig") as f:
        empfaenger = [{k: (v or "").strip() for k, v in z.items()} for z in csv.DictReader(f, delimiter=";")]
    for nr, e in enumerate(empfaenger, 1):
        if not (e.get("strasse") and e.get("plz") and e.get("ort")):
            print(f"Übersprungen (Adresse unvollständig): Zeile {nr + 1}")
            continue
        pfad = AUSGABE / dateiname(nr, e)
        brief_pdf(pfad, absender, e, vorlage)
        print(f"Erzeugt: {pfad.relative_to(BASIS)}")
    if any("[" in v for v in absender.values()):
        print("\nHinweis: absender.json enthält noch Platzhalter in [eckigen Klammern].")


# ---------------------------------------------------------------- onlinebrief24-API

def anfrage(methode, pfad, nutzdaten=None, live=False):
    key, secret = os.environ.get("OB24_API_KEY"), os.environ.get("OB24_API_SECRET")
    if not key or not secret:
        sys.exit("Fehlt: Umgebungsvariablen OB24_API_KEY und OB24_API_SECRET setzen.")
    body = {"auth": {"apiKey": key, "apiSecret": secret, "mode": "live" if live else "test"}}
    body.update(nutzdaten or {})
    req = urllib.request.Request(API + pfad, data=json.dumps(body).encode(), method=methode,
                                 headers={"Content-Type": "application/json", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as fehler:
        sys.exit(f"API-Fehler {fehler.code} bei {pfad}: {fehler.read().decode(errors='replace')[:500]}")


def spezifikation(args):
    return {"color": "4" if args.farbe else "1", "mode": "duplex" if args.duplex else "simplex",
            "shipping": "national"}


def bereits_gesendet():
    if not PROTOKOLL.exists():
        return set()
    with open(PROTOKOLL, newline="", encoding="utf-8") as f:
        return {z["datei"] for z in csv.DictReader(f, delimiter=";") if z["modus"] == "live"}


def protokollieren(zeile):
    neu = not PROTOKOLL.exists()
    with open(PROTOKOLL, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["datum", "datei", "modus", "auftrag_id", "status", "betrag_netto"], delimiter=";")
        if neu:
            w.writeheader()
        w.writerow(zeile)


def senden(args):
    dateien = sorted(AUSGABE.glob("*.pdf")) if not args.dateien else [Path(d) for d in args.dateien]
    if not dateien:
        sys.exit("Keine PDFs gefunden. Zuerst: python3 brief.py erzeugen")
    if args.live:
        gesendet = bereits_gesendet()
        uebersprungen = [d for d in dateien if d.name in gesendet]
        dateien = [d for d in dateien if d.name not in gesendet]
        for d in uebersprungen:
            print(f"Bereits live versendet, übersprungen: {d.name}")
        if not dateien:
            return
        if args.ja:
            antwort = "ja"
        else:
            antwort = input(f"{len(dateien)} Brief(e) werden WIRKLICH gedruckt und kostenpflichtig versendet. Fortfahren? (ja/nein) ")
        if antwort.strip().lower() != "ja":
            sys.exit("Abgebrochen.")
    for d in dateien:
        b64 = base64.b64encode(d.read_bytes()).decode()
        letter = {"base64_file": b64, "base64_file_checksum": hashlib.md5(b64.encode()).hexdigest(),
                  "specification": spezifikation(args), "filename_original": d.name}
        if args.versanddatum:
            letter["dispatch_date"] = args.versanddatum
        if args.kostenstelle:
            letter["cost_unit"] = args.kostenstelle
        daten = anfrage("POST", "/printjobs", {"letter": letter}, live=args.live).get("data", {})
        betrag = sum(float(i.get("amount") or 0) for i in daten.get("items", []))
        adresse = "; ".join(i.get("address", "") for i in daten.get("items", []))
        print(f"{d.name}: Auftrag {daten.get('id')} – Status {daten.get('status')} – {betrag:.2f} € netto – erkannt: {adresse}")
        protokollieren({"datum": date.today().isoformat(), "datei": d.name, "modus": "live" if args.live else "test",
                        "auftrag_id": daten.get("id"), "status": daten.get("status"), "betrag_netto": f"{betrag:.2f}"})
    if not args.live:
        print("\nTestmodus: Die Aufträge liegen im Warenkorb im Kundencenter (7 Tage) und können dort geprüft werden.")


def preis(args):
    spec = {**spezifikation(args), "pages": args.seiten}
    d = anfrage("GET", "/price", {"letter": {"specification": spec}}).get("data", {})
    print(f"Preis je Brief ({args.seiten} Seite(n)): {d.get('price')} € netto")


def guthaben(_args):
    d = anfrage("GET", "/balance").get("data", {})
    print(f"Guthaben: {d.get('balance')} {d.get('currency')}")


def auftraege(args):
    pfad = "/printjobs" + (f"?filter={args.filter}" if args.filter else "")
    for j in anfrage("GET", pfad, live=args.filter != "draft").get("data", {}).get("printjobs", []):
        for i in j.get("items", []):
            print(f"{j['id']}  {j['status']:<8} {j.get('filename_original') or '':<40} {i.get('status', ''):<8} "
                  f"{i.get('tracking_status') or ''}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="befehl", required=True)
    s.add_parser("erzeugen").set_defaults(f=erzeugen)
    eb = s.add_parser("einzelbrief", help="einen Brief direkt erzeugen (gibt den PDF-Pfad aus)")
    for feld in ("anrede", "vorname", "nachname", "firma", "land", "betreff", "text", "text-datei"):
        eb.add_argument(f"--{feld}")
    for feld in ("strasse", "plz", "ort"):
        eb.add_argument(f"--{feld}", required=True)
    eb.add_argument("--ohne-anrede", action="store_true", help="Text enthält die Anrede bereits")
    eb.set_defaults(f=einzelbrief)
    for name, f in (("senden", senden), ("preis", preis)):
        sp = s.add_parser(name)
        sp.add_argument("--farbe", action="store_true", help="Farbdruck statt schwarz/weiß")
        sp.add_argument("--duplex", action="store_true", help="beidseitig drucken")
        sp.set_defaults(f=f)
        if name == "senden":
            sp.add_argument("--live", action="store_true", help="wirklich versenden (sonst Testmodus/Warenkorb)")
            sp.add_argument("--versanddatum", help="JJJJ-MM-TT, muss in der Zukunft liegen")
            sp.add_argument("--kostenstelle")
            sp.add_argument("--ja", action="store_true", help="Sicherheitsabfrage beim Liveversand überspringen")
            sp.add_argument("dateien", nargs="*", help="einzelne PDFs (Standard: alle in ausgabe/)")
        else:
            sp.add_argument("--seiten", type=int, default=1)
    s.add_parser("guthaben").set_defaults(f=guthaben)
    a = s.add_parser("auftraege")
    a.add_argument("--filter", choices=["queue", "hold", "done", "canceled", "draft"])
    a.set_defaults(f=auftraege)
    args = p.parse_args()
    args.f(args)


if __name__ == "__main__":
    main()
