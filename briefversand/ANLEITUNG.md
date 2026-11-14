# Akquise-Briefe über onlinebrief24.de versenden

Dieses Werkzeug erstellt aus einer Adressliste fertige Briefe als PDF (DIN 5008, Form B,
passend für Fensterumschläge) und überträgt sie per API an onlinebrief24.de. Dort werden
sie gedruckt, kuvertiert und mit der Post verschickt (ab ca. 0,75 € netto je Brief).

## Einmalig einrichten

1. Geschäftskonto bei onlinebrief24.de anlegen und Guthaben aufladen.
2. Im Kundencenter unter **Einstellungen › API Zugang › Zugangsdaten** API-Key und API-Secret erzeugen.
3. Python 3 und reportlab installieren: `pip install reportlab`
4. In `absender.json` die eigenen Firmendaten eintragen (Platzhalter in [eckigen Klammern] ersetzen).
5. Zugangsdaten im Terminal setzen (nicht in Dateien speichern):

       export OB24_API_KEY=ihr-key
       export OB24_API_SECRET=ihr-secret

## Briefe versenden

1. `empfaenger.csv` mit den Adressen füllen (Trennzeichen Semikolon, z. B. aus Excel als „CSV UTF-8“ speichern).
   Spalten: anrede (Frau/Herr/leer), vorname, nachname, firma, strasse, plz, ort, land, notiz.
2. Text in `vorlage.txt` anpassen. Platzhalter wie `{briefanrede}`, `{firma}`, `{nachname}` werden je Empfänger ersetzt.
3. PDFs erzeugen und im Ordner `ausgabe/` ansehen:

       python3 brief.py erzeugen

4. Im **Testmodus** übertragen – nichts wird gedruckt, die Briefe landen im Warenkorb im Kundencenter
   und können dort geprüft, gelöscht oder per Klick versendet werden:

       python3 brief.py senden

5. Wenn alles stimmt, **wirklich versenden** (mit Sicherheitsabfrage):

       python3 brief.py senden --live

Optionen: `--farbe` (Farbdruck), `--duplex` (beidseitig), `--versanddatum 2026-12-01`,
`--kostenstelle Akquise`. Einzelne Dateien: `python3 brief.py senden --live ausgabe/001_….pdf`.

Jeder Versand wird in `versandprotokoll.csv` festgehalten. Bereits live versendete Briefe werden
automatisch übersprungen, damit niemand doppelt Post bekommt.

## Weitere Befehle

    python3 brief.py guthaben                  # Guthaben abfragen
    python3 brief.py preis --seiten 1          # Preis je Brief
    python3 brief.py auftraege --filter done   # Status und Sendungsverfolgung

Ein Auftrag kann nur in den ersten 15 Minuten nach der Übertragung im Kundencenter geändert oder gelöscht werden.

## Rechtliche Hinweise

- Werbebriefe per Post sind in Deutschland ohne vorherige Einwilligung erlaubt, solange der Empfänger
  nicht widersprochen hat. Widersprüche (und Einträge in der Robinsonliste) aus der Adressliste entfernen.
- Nach DSGVO müssen Empfänger informiert werden, woher ihre Adresse stammt (Art. 14). Ein kurzer
  Hinweis mit Link zur Datenschutzerklärung im Brief ist ratsam.
- Für Architektinnen und Architekten gilt das Berufsrecht der Kammer: Werbung muss sachlich bleiben.
- Echte Adresslisten nicht ins Git-Repository hochladen.
