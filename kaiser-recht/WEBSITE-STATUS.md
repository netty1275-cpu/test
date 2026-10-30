# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ | 2026-10-30 |
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
- Hauptziel der Seite: neue Mandanten gewinnen (Anruf, Rückruf, Anfrage)
- Hosting: bleibt beim bisherigen Anbieter. Laut DNS IONOS (Nameserver ui-dns, IP 217.160.0.14, Apache, Mail über mx00/mx01.ionos.de). Upload als statische Seite.
- Werkzeuge: impeccable ✅ (v0.1.18, im Projekt unter .claude/) · Playwright ✅ · DataForSEO — (nicht genutzt, Recherche von Hand) · Hosting-MCP ⬜ · Formular-Ziel ⬜

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
- 2026-10-30: Hauptziel neue Mandanten. Hosting bleibt, wo es ist. Recherche ohne DataForSEO.
- 2026-10-30: Technik: statisches HTML, CSS, etwas JavaScript, ohne Baukasten und ohne WordPress.

## Offene Fragen an die Person

- IONOS-Zugang (Kundenlogin oder SFTP) wird in Phase 7 gebraucht; die Person weiß noch nicht, wer ihn hat.
- Logo, Briefpapier oder andere Markendateien der Kanzlei vorhanden?

## Update-Ablauf nach dem Livegang

1. Änderung in der Seite und in `texte.md`
2. `python deploy/build.py`
3. Upload:
4. Cache leeren:
5. Live prüfen
