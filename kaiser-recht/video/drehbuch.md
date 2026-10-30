# Erklärvideo Mediation: Drehbuch

Stand 2026-10-30, Entwurf 1. Länge 60 Sekunden, Format 16:9 (1920 × 1080). Motion-Grafik im Stil der Website: Leinen, Petrol, Terrakotta, Literata und Public Sans, die Linie, die sich in „Recht bekommen“ und „Lösung finden“ teilt.

Entscheidung 2026-10-30: nur Animation mit Text, ohne Sprecher. Alle Aussagen stehen als Text im Bild. Die Spalte Sprechertext bleibt als Vorlage, falls später doch eine Stimme dazukommt.

Umsetzung: `animation.html` (Animation), `render.py` (rendert sie zu `mediation.mp4`). Auf der Website liegt das Video unter `assets/video/mediation.mp4`, das Vorschaubild unter `assets/img/mediation-poster.jpg`.

Alle Aussagen stammen von der Mediationsseite. Ablauf in fünf Schritten und „vertraulich“ sind dort noch mit [prüfen] markiert und müssen von Claudia Kaiser bestätigt werden.

| Zeit | Bild | Text im Bild | Sprechertext |
|---|---|---|---|
| 0:00–0:06 | Petrol-Fläche. Zwei Punkte stehen weit auseinander, zwischen ihnen nichts. | Wenn Reden nicht mehr geht. | Trennung, Erbe, Nachbarn, Kollegen. Manchmal geht nichts mehr. „Mit dem kann man nicht reden.“ |
| 0:06–0:14 | Leinen. Eine Linie zeichnet sich von „Ihr Konflikt“ zum Halt „Kaiser & Kaiser“ und teilt sich: Petrol nach rechts, Terrakotta nach unten. Dann tritt Petrol zurück. | Zwei Wege. Recht bekommen: vor Gericht. Lösung finden: in der Mediation. | Bei uns gibt es zwei Wege. Wir vertreten Sie vor Gericht. Oder Sie finden mit der anderen Seite selbst eine Lösung: in der Mediation. |
| 0:14–0:25 | Die zwei Punkte bewegen sich aufeinander zu, Terrakotta-Linien führen beide zu einem großen Ring in der Mitte, dem Tisch. | Eine neutrale Mediatorin bringt beide Seiten an einen Tisch. Sie entscheiden selbst, nicht ein Gericht. | In der Mediation begleitet eine neutrale Mediatorin beide Seiten. Sie entscheidet nichts und ergreift für niemanden Partei. Die Entscheidung bleibt bei Ihnen. |
| 0:25–0:35 | Senkrechte Terrakotta-Linie, drei Halte erscheinen nacheinander. | Vertraulich. Sie behalten die Entscheidung. Eine Lösung, die zu Ihrem Fall passt. | Das Gespräch ist vertraulich. Sie behalten die Kontrolle. Und am Ende steht eine Lösung, die zu Ihrem Fall passt, nicht nur eine Antwort nach Schema. |
| 0:35–0:52 | Waagerechte Terrakotta-Linie, ein Punkt fährt die fünf Halte ab. | So läuft es ab: 1 Informationsgespräch · 2 Themen sammeln · 3 Interessen klären · 4 Lösungen entwickeln · 5 Vereinbarung | Es beginnt mit einem Informationsgespräch. Dann sammeln Sie die Themen, klären, worum es Ihnen wirklich geht, entwickeln gemeinsam Lösungen und halten am Ende eine Vereinbarung schriftlich fest. |
| 0:52–1:00 | Petrol-Fläche. Schriftzug, darunter Name, Adresse und Telefon. | Kaiser & Kaiser. Praxis für Mediation in Berlin-Mariendorf. Claudia Kaiser, Rechtsanwältin und Master of Mediation. Informationsgespräch: 030 661 22 54 | Ich bin Claudia Kaiser, Rechtsanwältin und Mediatorin in Berlin-Mariendorf. Rufen Sie an und vereinbaren Sie ein Informationsgespräch. |

Sprechertext gesamt: etwa 140 Wörter, ruhig gesprochen rund 60 Sekunden.

## Einbau auf der Website

- Datei auf dem eigenen Server (kein YouTube, sonst wäre ein Cookie-Banner nötig).
- Vorschaubild, kein Autostart, Steuerelemente sichtbar, Untertitel eingebunden.
- Der Sprechertext steht als ausklappbare Textfassung unter dem Video (für Barrierefreiheit, Google und KI-Suchen).
