# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ | 2026-10-30 |
| 1 | Fundament | 🔄 | 2026-10-30 |
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

Gemessen am 2026-10-30 von https://www.kaiser-recht.de (`archiv/alte-seite/marke.json`, Kopfgrafik `Logorechts.jpg`, `Logolinks.jpg`).

| Rolle | Wert |
|---|---|
| Hauptfarbe | Marineblau #0A328C (Überschriften, Links), Titelbalken #083088 |
| Akzent | Taubenblau #7F92CA (Kopfgrafik), Graublau #B0C8D8 (Navigation) |
| helle Fläche | Weiß #FFFFFF, Hellgrau #F5F5F5, Blaugrau hell #E6ECF1 |
| Text | Schwarz #000000, Grau #7C7C7C für Bildunterschriften |
| Überschriften | Arial/Helvetica 700, Systemschrift, keine eigene Hausschrift |
| Fließtext | Arial/Helvetica 400 |
| Merkmale | Kein eigenständiges Logo, nur eine Kopfgrafik: §-Zeichen über einem Brückenfoto, daneben „ANDREAS KAISER · CLAUDIA KAISER“ in Versalien mit Schatten. Unterzeile „Rechtsanwaltskanzlei in Berlin und Praxis für Mediation“. Die Marke lebt vom Blau. |

Nicht Marke: Das Grün #8EC760 kommt nur vom Cookie-Banner.

Weitere Funde: Die alte Seite nutzt Matomo mit Cookie-Einwilligung (für Phase 7). Es gibt ein gemeinsames Foto der beiden Anwälte, aber nur 229 × 253 Pixel und sichtbar älter. Die Texte aller Unterseiten liegen in `archiv/alte-seite/`.

## Entscheidungen

Jede Entscheidung der Person mit Datum, damit sie nicht erneut diskutiert wird.

- 2026-10-30: Projekt ist kaiser-recht.de, nicht architekt-webseite/.
- 2026-10-30: Hauptziel neue Mandanten. Hosting bleibt, wo es ist. Recherche ohne DataForSEO.
- 2026-10-30: Alle acht Rechtsgebiete bleiben. Mediation wird ein eigener, gleichwertiger Bereich (ausdrücklicher Wunsch).
- 2026-10-30: Gestaltung eher ruhig und hochwertig, kein Cinematic Scroll. Endgültige Wahl in Phase 4.
- 2026-10-30: Technik: statisches HTML, CSS, etwas JavaScript, ohne Baukasten und ohne WordPress.

## Offene Fragen an die Person

- IONOS-Zugang (Kundenlogin oder SFTP) wird in Phase 7 gebraucht; die Person weiß noch nicht, wer ihn hat.
- Logo, Briefpapier oder andere Markendateien der Kanzlei vorhanden? Sonst neuer Schriftzug (Annahme).
- Woher kommen die meisten Mandanten (Annahme: Google)?
- Gibt es neue oder bessere Fotos der Anwälte?
- Wer betreut welches Rechtsgebiet? Gibt es Fachanwaltstitel?
- Online-Fragebogen für Verkehrsunfälle beibehalten?
- Ohne Tracking (bisher Matomo)?

## Update-Ablauf nach dem Livegang

1. Änderung in der Seite und in `texte.md`
2. `python deploy/build.py`
3. Upload:
4. Cache leeren:
5. Live prüfen
