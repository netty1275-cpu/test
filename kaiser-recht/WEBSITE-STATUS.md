# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | 🔄 | 2026-10-30 |
| 1 | Fundament | ⬜ | |
| 2 | Recherche | ⬜ | |
| 3 | Texte | ⬜ | |
| 4 | Design-Richtung | ⬜ | |
| 5 | Bauen | ⬜ | |
| 6 | Prüfen und Feinschliff | ⬜ | |
| 7 | Livegang | ⬜ | |
| 8 | Danach | ⬜ | |

## Ausgangslage

- Bestehende Website oder Marke: https://www.kaiser-recht.de (Rechtsanwälte Andreas und Claudia Kaiser, Kanzlei und Praxis für Mediation, Mariendorfer Damm 73, 12109 Berlin). Neue Seite soll sie ersetzen.
- Hauptziel der Seite: offen (Vorschlag: Mandatsanfragen/Rückruf)
- Hosting: offen
- Werkzeuge: impeccable ✅ (v0.1.18, im Projekt unter .claude/) · Playwright ✅ · DataForSEO ⬜ · Hosting-MCP ⬜ · Formular-Ziel ⬜

## Marke

| Rolle | Wert |
|---|---|
| Hauptfarbe | |
| Akzent | |
| helle Fläche | |
| Text | |
| Überschriften | |
| Fließtext | |
| Merkmale | |

## Entscheidungen

Jede Entscheidung der Person mit Datum, damit sie nicht erneut diskutiert wird.

- 2026-10-30: Projekt ist kaiser-recht.de, nicht architekt-webseite/.

## Offene Fragen an die Person

- Hauptziel, Hosting, DataForSEO ja/nein

## Update-Ablauf nach dem Livegang

1. Änderung in der Seite und in `texte.md`
2. `python deploy/build.py`
3. Upload:
4. Cache leeren:
5. Live prüfen
