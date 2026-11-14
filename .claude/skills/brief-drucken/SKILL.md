---
name: brief-drucken
description: Einen Brief über onlinebrief24.de drucken und per Post verschicken lassen. Verwenden, wenn der Nutzer sagt „drucke einen Brief“, „schick einen Brief an …“, „Brief über onlinebrief“, „Akquisebrief an …“ oder Briefe aus einer Adressliste versenden will.
---

# Brief über onlinebrief24.de drucken

Werkzeug zum Erzeugen der PDFs: `briefversand/brief.py` (Anleitung: `briefversand/ANLEITUNG.md`). Benötigt `reportlab`
(`pip install reportlab`, falls der Import fehlschlägt); nur für den API-Versand zusätzlich die
Umgebungsvariablen `OB24_API_KEY` und `OB24_API_SECRET`.

## Versandweg wählen

- **Lokal auf dem Rechner des Nutzers mit installiertem onlinebrief24-Druckertreiber (bevorzugt):**
  Kein API-Zugang nötig. Der Treiber installiert ZWEI Drucker:
  - `Als Brief versenden (onlinebrief24.de)` → echter, kostenpflichtiger Postversand. NUR diesen zum Versenden nehmen.
  - `Als PDF-Datei speichern (onlinebrief24.de)` → erzeugt nur ein PDF, nichts wird verschickt. Nicht verwechseln!
  Drucker suchen:
  - macOS/Linux: `lpstat -p | grep -i "brief versenden"`
  - Windows (PowerShell): `Get-Printer | Where-Object Name -like "Als Brief versenden*"`
  Gefunden → Schritte 1–4 unten, dann statt `brief.py senden` das PDF an diesen Drucker schicken:
  - macOS/Linux: `lp -d "<Druckername>" "<pdf>"`
  - Windows: `Start-Process -FilePath "<pdf>" -Verb PrintTo -ArgumentList '"<Druckername>"'`
    (braucht einen PDF-Reader mit PrintTo-Unterstützung, z. B. Adobe Acrobat Reader; sonst das PDF
    öffnen und den Nutzer im Druckdialog den onlinebrief24-Drucker wählen lassen).
  Der Druckertreiber kann danach ein Fenster zur Auftragsbestätigung öffnen; den Nutzer darauf hinweisen.
- **Cloud-Sitzung oder kein Druckertreiber:** API über `brief.py senden` (Schritte 4–5 unten).

## Ablauf für einen einzelnen Brief

1. **Angaben klären.** Nötig: Empfänger (Firma und/oder Anrede, Vorname, Nachname), Straße, PLZ, Ort.
   Fehlt die Adresse, nachfragen. Fehlt der Inhalt, einen kurzen, sachlichen Akquisetext
   für ein Architekturbüro vorschlagen (Anrede und Grußformel setzt das Werkzeug selbst).
   Optional: Betreff, Farbdruck, beidseitig, Versanddatum.
2. **PDF erzeugen:**

       cd briefversand && python3 brief.py einzelbrief --anrede Herr --vorname Hans --nachname Huber \
         --firma "…" --strasse "Bergstraße 3" --plz 83022 --ort Rosenheim \
         --betreff "…" --text "…"

   Längere Texte vorher in eine Datei schreiben und `--text-datei` verwenden. Die letzte Zeile der
   Ausgabe ist der PDF-Pfad.
3. **Vorschau zeigen:** `pdftoppm -r 80 -png <pdf> <scratchpad>/vorschau` erzeugen, das Bild selbst
   ansehen (Adresse im Fensterbereich, Text vollständig, keine Platzhalter in [eckigen Klammern])
   und dem Nutzer per SendUserFile schicken, zusammen mit dem Preis (`python3 brief.py preis --seiten N`).
4. **Bestätigung einholen.** Der Liveversand kostet Geld und lässt sich nur 15 Minuten lang stornieren.
   Ohne ausdrückliches „ja, senden“ des Nutzers nur im Testmodus übertragen:

       python3 brief.py senden <pdf>              # Testmodus: landet im Warenkorb im Kundencenter

5. **Nach Bestätigung live senden:**

       python3 brief.py senden --live --ja <pdf>

   Ergebnis melden: Auftragsnummer, erkannte Adresse, Preis. Stimmt die von onlinebrief24
   erkannte Adresse nicht mit der gewünschten überein, sofort darauf hinweisen (Löschen im
   Kundencenter innerhalb von 15 Minuten möglich).

## Mehrere Briefe

`briefversand/empfaenger.csv` und `briefversand/vorlage.txt` nutzen, dann `python3 brief.py erzeugen`,
Stichproben-Vorschau zeigen, bestätigen lassen und `python3 brief.py senden --live --ja`.

## Wenn etwas fehlt

- `OB24_API_KEY`/`OB24_API_SECRET` nicht gesetzt: Den Nutzer bitten, beide als Umgebungsvariablen in den
  Einstellungen der Cloud-Umgebung einzutragen (Kundencenter › Einstellungen › API Zugang ›
  Zugangsdaten). Schlüssel niemals im Chat erfragen und niemals in Dateien oder Commits schreiben.
  Bis dahin kann das PDF trotzdem erzeugt und gezeigt werden.
- `absender.json` enthält noch Platzhalter `[…]`: Vor dem Liveversand nachfragen und eintragen.
- Erzeugte PDFs und `versandprotokoll.csv` nicht committen (stehen in `.gitignore`).
