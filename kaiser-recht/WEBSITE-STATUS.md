# Website-Status

Diese Datei hält fest, wo das Projekt steht. Der Skill `website-bauen` liest sie bei jedem Aufruf und macht dort weiter.

Status: ✅ erledigt · 🔄 läuft · ⬜ offen

| Phase | Name | Status | Datum |
|---|---|---|---|
| 0 | Einrichten | ✅ | 2026-10-30 |
| 1 | Fundament | ✅ | 2026-10-30 |
| 2 | Recherche | ✅ | 2026-10-30 |
| 3 | Texte | ✅ | 2026-10-30 |
| 4 | Design-Richtung | ✅ | 2026-10-30 |
| 5 | Bauen | ✅ | 2026-10-30 |
| 6 | Prüfen und Feinschliff | 🔄 | 2026-10-30 |
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

**Neue Marke ab 2026-10-30 (Farbwelt B, gewählt von der Auftraggeberin):** Petrol #1F4E4A (Buttons, Flächen), Text #22312E, Terrakotta #A4482A (Akzent), Leinen #F4EFE6 (helle Fläche). Überschriften Literata, Fließtext Public Sans. Grundhaltung: Seriosität wie bei Gleiss Lutz, Wärme wie bei Kinfolk, Klarheit der Listen wie bei GOV.UK. Der alte Markenwert oben ist damit abgelöst.

Weitere Funde: Die alte Seite nutzt Matomo mit Cookie-Einwilligung (für Phase 7). Es gibt ein gemeinsames Foto der beiden Anwälte, aber nur 229 × 253 Pixel und sichtbar älter. Die Texte aller Unterseiten liegen in `archiv/alte-seite/`.

## Entscheidungen

Jede Entscheidung der Person mit Datum, damit sie nicht erneut diskutiert wird.

- 2026-10-30: Projekt ist kaiser-recht.de, nicht architekt-webseite/.
- 2026-10-30: Hauptziel neue Mandanten. Hosting bleibt, wo es ist. Recherche ohne DataForSEO.
- 2026-10-30: Alle acht Rechtsgebiete bleiben. Mediation wird ein eigener, gleichwertiger Bereich (ausdrücklicher Wunsch).
- 2026-10-30: Gestaltung eher ruhig und hochwertig, kein Cinematic Scroll. Endgültige Wahl in Phase 4.
- 2026-10-30: Phase 1 abgenommen. Marineblau ist nicht bindend, eine ganz neue Richtung ist erlaubt. Neuer Schriftzug statt alter Kopfgrafik.
- 2026-10-30: Neue Fotos kommen später. Bis dahin Platzhalter an festen Bildplätzen.
- 2026-10-30: Seitenaufbau an mich delegiert: Start, Verkehrsunfall, Bußgeld & Strafrecht, Familienrecht, Arbeitsrecht, Mietrecht, Baurecht, Mediation (eigener großer Bereich), Kanzlei, Kontakt & Anfahrt. Verkehrsrecht wird auf Unfall- und Bußgeldseite aufgeteilt.
- 2026-10-30: Gewählt: Vorbild Seriosität (Gleiss Lutz) und Farbwelt B warm und menschlich (Petrol, Leinen, Terrakotta; Literata + Public Sans). Phase 2 abgenommen.
- 2026-10-30: Texte Entwurf 1 vorläufig abgenommen. Eigene Texte der Kanzlei kommen später und ersetzen ihn.
- 2026-10-30: Design-Richtung gewählt: U6-Linienplan „Zwei Wege“ (Recht bekommen in Petrol, Lösung finden in Terrakotta), nach drei Neuwürfelungen. Richtungsvertrag in .impeccable/surfaces/index-html.md.
- 2026-10-30: Alle Seiten gebaut. Unterseiten werden mit `python _quellen/seiten.py` aus `_quellen/inhalte.py` erzeugt (Kopf, Kontakt, Fuß aus index.html).
- 2026-10-30: Unabhängige Abnahme: 2 Runden. Runde 2: 7 von 8 Befunden gelöst, Rest (Kosten-Satz nicht hervorheben) danach behoben, ohne dritte Prüfrunde. Regler-Panel entfällt (Cloud-Umgebung, lokaler Server nicht erreichbar).
- 2026-10-30: Technik: statisches HTML, CSS, etwas JavaScript, ohne Baukasten und ohne WordPress.

## Offene Fragen an die Person

- IONOS-Zugang (Kundenlogin oder SFTP) wird in Phase 7 gebraucht; die Person weiß noch nicht, wer ihn hat.
- Woher kommen die meisten Mandanten (Annahme: Google)?
- Neue Fotos der Anwälte (kommen, noch kein Termin)
- Offene Fragen aus texte.md Abschnitt 14 (fachliche Freigabe, Zuständigkeiten, Mediationskosten u. a.)
- Wer betreut welches Rechtsgebiet? Gibt es Fachanwaltstitel?
- Online-Fragebogen für Verkehrsunfälle beibehalten?
- Ohne Tracking (bisher Matomo)?
- Impressum: alte Seite nennt „UStId.-Nr.“, die Nummer ist aber eine Steuernummer (Finanzamt Neukölln-Süd). In Phase 7 klären.
- Datenschutzerklärung neu erstellen (Phase 7).
- ChatGPT/Perplexity: drei Fragen aus recherche/keywords-geo.md Abschnitt 3 stellen und Antworten liefern
- „Keine Schuld – keine Kosten“ beim Verkehrsunfall: fachlich freigegeben?
- Was kostet die Mediation, und ist das Informationsgespräch kostenlos?

## Vor dem Livegang von der Kanzlei zu bestätigen

Alle mit [prüfen] markierten Stellen aus `texte.md` (43). Bis zur Bestätigung stehen sie als Entwurf auf der Seite.

- 1. Startseite: Persönlich:** Sie sprechen direkt mit Ihrer Anwältin oder Ihrem Anwalt, nicht mit wechselnden Ansprechpartnern (stimmt das so?)
- 1. Startseite: Bevor Sie uns beauftragen, beraten wir Sie kostenfrei über die Anwaltsgebühren, über Ihre Rechtsschutzversiche (gilt das weiterhin so wie auf der alten Seite?)
- 1. Startseite: Nach einem Verkehrsunfall, an dem Sie keine Schuld haben, muss in der Regel die Versicherung des Unfallgegners
- 2. Verkehrsunfall: (Überschrift/Liste) (Liste vollständig und richtig?)
- 2. Verkehrsunfall: Wenn Sie den Unfall nicht verursacht haben, muss in der Regel die Haftpflichtversicherung des Unfallgegners au
- 2. Verkehrsunfall: (Überschrift/Liste)
- 2. Verkehrsunfall: Nein. Als Geschädigter dürfen Sie in der Regel einen unabhängigen Gutachter selbst beauftragen. Bei Bagatellsc
- 2. Verkehrsunfall: Wenn Sie beim Unfall verletzt wurden, haben Sie in der Regel Anspruch auf Schmerzensgeld. Wie hoch es ausfällt
- 2. Verkehrsunfall: Ansprüche auf Schadensersatz und Schmerzensgeld verjähren in der Regel nach drei Jahren, gerechnet ab dem Ende
- 2. Verkehrsunfall: Dann wird der Schaden nach Quoten verteilt. Wir prüfen den Hergang und vertreten Sie, wenn Ihnen auch ein Bußg
- 3. Bußgeld und Strafrecht: Viele Bußgeldbescheide halten einer Prüfung nicht stand: Die Messung war fehlerhaft, das Foto zeigt nicht eind („viele“ belegbar? Sonst „Manche“.)
- 3. Bußgeld und Strafrecht: Gegen einen Bußgeldbescheid können Sie innerhalb von zwei Wochen nach Zustellung Einspruch einlegen. Ist die F
- 3. Bußgeld und Strafrecht: Wer beruflich auf das Auto angewiesen ist, für den ist ein Fahrverbot oft schlimmer als das Bußgeld. Wir prüfe
- 3. Bußgeld und Strafrecht: Angaben zu Ihrer Person müssen Sie machen. Zur Sache selbst müssen Sie sich nicht äußern. Sprechen Sie vorher 
- 3. Bußgeld und Strafrecht: Das hängt von den Folgen ab. Bei Punkten in Flensburg oder einem drohenden Fahrverbot lohnt sich die Prüfung f
- 3. Bußgeld und Strafrecht: Einer Vorladung als Beschuldigter bei der Polizei müssen Sie nicht folgen. Rufen Sie uns an, wir beantragen Ak
- 4. Familienrecht: (Überschrift/Liste) (Liste vollständig? Auch Versorgungsausgleich, Ehevertrag?)
- 4. Familienrecht: 1. **Trennungsjahr:** In der Regel müssen Sie ein Jahr getrennt leben, bevor die Ehe geschieden werden kann.
- 4. Familienrecht: 2. **Scheidungsantrag:** Ein Anwalt reicht den Antrag beim Familiengericht ein.
- 4. Familienrecht: Die Kosten richten sich nach dem Einkommen beider Ehepartner und danach, was geregelt werden muss. Wir beraten
- 4. Familienrecht: Den Scheidungsantrag muss ein Anwalt stellen. Der andere Ehepartner braucht keinen eigenen Anwalt, wenn er nur
- 5. Arbeitsrecht: Wer sich gegen eine Kündigung wehren will, muss innerhalb von drei Wochen nach Zugang der Kündigung Klage beim
- 5. Arbeitsrecht: Melden Sie sich außerdem spätestens drei Tage nach Zugang der Kündigung bei der Agentur für Arbeit arbeitssuch
- 5. Arbeitsrecht: (Überschrift/Liste) (Liste vollständig?)
- 5. Arbeitsrecht: Einen gesetzlichen Anspruch gibt es nur in wenigen Fällen. Abfindungen entstehen meist durch Verhandlung oder 
- 5. Arbeitsrecht: Unterschreiben Sie nichts sofort. Ein Aufhebungsvertrag kann zu einer Sperrzeit beim Arbeitslosengeld führen. 
- 5. Arbeitsrecht: In der ersten Instanz trägt jede Seite ihre Anwaltskosten selbst, auch wenn sie gewinnt. Eine Rechtsschutzvers
- 6. Mietrecht: (Überschrift/Liste) (Liste vollständig? Auch Gewerbemiete?)
- 6. Mietrecht: Nicht unbedingt. Die Kündigung muss den Bedarf konkret begründen, und in bestimmten Härtefällen können Sie wid
- 6. Mietrecht: Eine Erhöhung bis zur ortsüblichen Vergleichsmiete ist frühestens 15 Monate nach Einzug oder nach der letzten 
- 6. Mietrecht: Einwände gegen die Abrechnung müssen Sie innerhalb von zwölf Monaten nach Zugang erheben.
- 7. Baurecht: (Überschrift/Liste) (Liste vollständig? Nur privates Baurecht?)
- 7. Baurecht: Bei Bauwerken verjähren die Mängelansprüche in der Regel fünf Jahre nach der Abnahme.
- 7. Baurecht: Mit der Abnahme beginnt die Verjährung, und die Beweislast für Mängel geht in der Regel auf den Bauherrn über.
- 8. Mediation: (Überschrift/Liste) (Arbeitet Claudia Kaiser so in fünf Schritten? Sonst anpassen.)
- 8. Mediation: Als Rechtsanwältin weiß ich, welche rechtlichen Folgen eine Vereinbarung hat. In der Mediation bin ich aber ni (Sieht Claudia Kaiser das so?)
- 8. Mediation: Gründungsmitglied des Mediationszentrums Harz in Halberstadt (Claudia Kaiser?)
- 8. Mediation: Die Vereinbarung ist ein Vertrag zwischen Ihnen. Für manche Regelungen, etwa zu Grundstücken oder für die Voll
- 9. Kanzlei: Claudia Kaiser hat Rechtswissenschaften an der Universität Saarbrücken und der Freien Universität Berlin studi (Gründungsmitglied Mediationszentrum Harz hier ergänzen?)
- 11. Formular: Rückruf erbitten: Hinweis unter dem Formular:** Bitte schicken Sie über dieses Formular noch keine vertraulichen Einzelheiten. D
- 13. Faktensätze: Vor der Beauftragung berät die Kanzlei kostenfrei über die Anwaltsgebühren, die Rechtsschutzversicherung sowie
- 14. Offene Fragen an die Kanzlei: 1. **Fachliche Freigabe:** Alle mit  markierten Rechtsaussagen lesen und freigeben oder korrigieren.

## Update-Ablauf nach dem Livegang

1. Änderung in der Seite und in `texte.md`
2. `python deploy/build.py`
3. Upload:
4. Cache leeren:
5. Live prüfen
