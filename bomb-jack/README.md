# Bomb Jack Remake

Fan-Remake des Arcade-Klassikers Bomb Jack (Tehkan, 1984) für den Browser. Grafik, Musik und Geräusche sind neu erstellt, es werden keine Originaldaten verwendet.

## Starten

`index.html` im Browser öffnen, ein Doppelklick genügt. Ein Webserver ist nicht nötig.

## Steuerung

| Taste | Aktion |
|---|---|
| ← → (oder A, D) | laufen, in der Luft lenken |
| Leertaste (oder X) | springen |
| ↑ + Leertaste | Supersprung bis ganz nach oben |
| ↓ + Leertaste | kleiner Hüpfer |
| Leertaste in der Luft | Sprung anhalten; beim Fallen antippen zum Schweben |
| P oder Esc | Pause |
| M | Musik an oder aus |
| F | Vollbild |

## Spielregeln

- In jeder Runde liegen 24 Bomben, die alle eingesammelt werden müssen.
- Nach jeder Bombe zündet die nächste in der Reihe. Brennende Bomben zählen doppelt. Wer am Rundenende mindestens 20 brennende Bomben hat, bekommt 10.000 bis 50.000 Bonuspunkte.
- Münzen: **P** verwandelt alle Gegner kurz in Münzen, **B** erhöht den Multiplikator bis ×5, **E** gibt ein Extraleben, **S** einen Sonderbonus.
- Mumien laufen über die Plattformen und verwandeln sich unten in Vögel, Kugeln, UFOs, Irrlichter oder Hornissen.
- 10 Runden in fünf Welten: Ägypten, Griechenland, Bayern, Miami und New York. Danach geht es schneller wieder von vorn los.
- Bestenliste und Einstellungen werden im Browser gespeichert.

## Aufbau

| Datei | Inhalt |
|---|---|
| `js/kern.js` | Grundwerte, Eingabe, Speicher, Bestenliste |
| `js/audio.js` | Synthesizer, Musik-Sequenzer, Geräusche |
| `js/musik.js` | Musikstücke |
| `js/grafik.js` | Figuren, Bomben, Münzen, Partikel |
| `js/kulissen.js` | Welten, Plattformen, Rahmen, Titelbild |
| `js/runden.js` | Rundenpläne und Schwierigkeit |
| `js/figuren.js` | Bewegung von Jack, Gegnern und Münzen |
| `js/spiel.js` | Spielablauf und Anzeige |
| `js/menue.js` | Titelbild, Anleitung, Optionen, Bestenliste, Namenseingabe |
| `js/start.js` | Start und Hauptschleife |

Eigene Runden lassen sich in `js/runden.js` als Textplan mit 17 × 17 Zeichen anlegen: `=` Plattform, `a` bis `x` die Bomben in Zündreihenfolge, `J` Startplatz, `*` Eingang der Gegner.

Direkt in eine Runde springen: `index.html#runde5`.

Schriften: Bangers und Baloo 2 unter der SIL Open Font License, siehe Ordner `schriften/`.
