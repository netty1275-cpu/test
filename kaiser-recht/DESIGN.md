---
name: Kaiser & Kaiser
description: Rechtsanwälte und Praxis für Mediation in Berlin-Mariendorf, gezeichnet als Linienplan mit zwei Wegen.
colors:
  petrol: "#1F4E4A"
  petrol-dk: "#163A37"
  petrol-lt: "#2E6B65"
  terra: "#A4482A"
  terra-text: "#933E22"
  terra-wash: "#F3E2D8"
  ink: "#22312E"
  muted: "#4C5753"
  leinen: "#F4EFE6"
  leinen-dk: "#E7DFD1"
  paper: "#FBF8F2"
  line: "#D6CCB9"
  field-stroke: "#B9AE9B"
  on-petrol: "#F4EFE6"
  on-petrol-muted: "#EBDCC6"
  error: "#8E3518"
typography:
  display:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3vw, 3.6rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.9rem, 1.4rem + 1.9vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.15rem, 1.05rem + .4vw, 1.35rem)"
    fontWeight: 600
    lineHeight: 1.25
  pull:
    fontFamily: "Literata, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.3rem, 1.1rem + .8vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + .25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  stop-label:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  button:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
  label-destination:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  hair: "2px"
  control: "3px"
  panel: "4px"
  track: "5px"
  stop: "50%"
spacing:
  gutter: "clamp(16px, 4.2vw, 56px)"
  section: "clamp(64px, 9vw, 120px)"
  block: "clamp(56px, 7vw, 96px)"
  max: "1240px"
  track: "10px"
  stop: "22px"
  stop-indent: "40px"
components:
  button-primary:
    backgroundColor: "{colors.petrol}"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "1rem 1.35rem"
  button-primary-hover:
    backgroundColor: "{colors.petrol-dk}"
    textColor: "#FFFFFF"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "1rem 1.35rem"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.leinen}"
  button-terra:
    backgroundColor: "{colors.terra}"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "1rem 1.35rem"
  button-terra-hover:
    backgroundColor: "{colors.terra-text}"
    textColor: "#FFFFFF"
  button-light:
    backgroundColor: "{colors.leinen}"
    textColor: "{colors.petrol}"
    rounded: "{rounded.control}"
    padding: "1rem 1.35rem"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: ".8rem .9rem"
  form-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(24px, 3.5vw, 40px)"
  card-info:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px 24px"
  bridge:
    backgroundColor: "{colors.terra-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px 26px"
  stop:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.stop}"
    size: "{spacing.stop}"
---

# Design System: Kaiser & Kaiser

## Overview

**Creative North Star: "Der Linienplan mit zwei Wegen"**

Die Website zeichnet die Kanzlei als Umsteigehalt. Wer mit einem Konflikt kommt, steigt am Halt „Westphalweg“ ein, und dort teilt sich die Strecke: Petrol führt zu „Recht bekommen“ (Akte, Verhandlung, Gericht), Terrakotta zu „Lösung finden“ (Mediation, Vereinbarung). Diese eine Metapher trägt die ganze Seite. Rechtsgebiete, Mediationsthemen, Schritte im Ablauf und sogar das Inhaltsverzeichnis der Unterseiten sind Halte an einer 10 px starken Linie, nie Karten in einem Raster.

Der Grund ist Leinen, warm und ruhig, darauf liegen Abschnitte in Papier, Sand und tiefem Petrol als tonale Flächen. Literata setzt Überschriften mit leiser Gelehrtheit, Public Sans beschriftet Halte, Schilder und Bedienelemente wie eine Verkehrsbeschilderung. Die Dichte ist großzügig, die Zeilen lang genug zum Lesen, die Bedienelemente groß genug für ältere Menschen am Handy. Die einzige Bewegung ist die Linie selbst: Beim ersten Laden zeichnet sich erst Petrol, dann Terrakotta.

Verweigert wird die Kanzlei-Norm aus Paragrafenzeichen, Waage, Navy und Gold und Kartenreihe. Ebenso verweigert sind fremde Verkehrsmarken: kein BVG-Gelb, kein U-Bahn-Logo, keine BVG-Typografie. Der Plan ist ein eigener, nicht der Plan der Stadt.

**Key Characteristics:**
- Zwei Linienfarben mit fester Bedeutung: Petrol für den Rechtsweg, Terrakotta für die Mediation.
- Halte als Ringe (22 px, 3,5 px Tintenrand, Papierfüllung), der Umsteigehalt als großer Ring.
- Listen sind Strecken mit Halten, nicht Kartenraster.
- Tonale Abschnittsfolge auf Leinen statt Schatten; Schatten nur für Gegenstände.
- Literata für Überschriften, Public Sans halbfett für Beschriftung, Versalien nur für Linienziele.
- Die Linie zeichnet sich einmal beim Laden; sonst nur kurze Zustandswechsel.

## Colors

Eine warme Leinenwelt mit zwei Linienfarben, deren Bedeutung nie wechselt.

### Primary
- **Tiefes Petrol** (petrol): Die Rechtsweg-Linie, alle Haupt-Buttons, Links, Kopf des Haltestellenschilds, Abschnitte für Kanzlei und Kontakt. Die Farbe von „Recht bekommen“.
- **Nachtpetrol** (petrol-dk): Hover-Zustand der Petrol-Buttons und Grund des Fußbereichs.
- **Helles Petrol** (petrol-lt): Fläche des Fotoplatzes auf Petrol-Abschnitten.

### Secondary
- **Terrakotta** (terra): Die Mediationslinie, Halte-Beschriftungen an ihr im SVG-Plan, Mediations-Buttons, Fokusring, Textauswahl, Einfügemarke. Die Farbe von „Lösung finden“.
- **Gebrannte Terrakotta** (terra-text): Terrakotta als Lesetext auf hellem Grund: zweite Zeile der H1, Mediationsthemen, Zitate, Link-Hover, Hover des Terrakotta-Buttons.
- **Terrakotta-Hauch** (terra-wash): Grund des Brückenkastens, der von einem Rechtsgebiet zur Mediation hinüberführt.

### Neutral
- **Tinte** (ink): Fließtext, Ränder der Halte, Rand des umrandeten Buttons.
- **Schiefer** (muted): Nebentext, Einleitungen, Untertitel von Halten, Linienziele.
- **Leinen** (leinen): Seitengrund und Grund der Wechselabschnitte auf Unterseiten.
- **Sand** (leinen-dk): Abschnitt Mediation auf der Startseite, Fragen-Abschnitt der Unterseiten, Scrollbar-Spur.
- **Papier** (paper): Füllung der Halte, Formular- und Infokasten, Haltestellenschild, helle Abschnitte.
- **Gleisschotter** (line): Haarlinien zwischen Listeneinträgen und Ränder der Kästen.
- **Feldkante** (field-stroke): Rand der Eingabefelder, dunkler als die Haarlinie, damit Felder als Felder lesbar sind.
- **Leinen auf Petrol** (on-petrol) und **Sand auf Petrol** (on-petrol-muted): Text und Nebentext auf Petrol-Flächen.
- **Fehlerrot** (error): Fehlermeldungen und Feldrand im Fehlerfall.

### Named Rules
**Die Zwei-Linien-Regel.** Petrol bedeutet Rechtsweg, Terrakotta bedeutet Mediation. Ein Terrakotta-Button, eine Terrakotta-Strecke oder ein Terrakotta-Kasten führt immer zur Mediation; ein Rechtsgebiet bekommt nie Terrakotta als Schmuck.

**Die Lesetext-Regel.** Terrakotta als Fläche, Strecke oder Ring ist terra; Terrakotta als Überschrift, Halte-Name oder Zitat in HTML ist terra-text.

## Typography

**Display Font:** Literata (mit Georgia, Times New Roman), variabel, selbst gehostet
**Body Font:** Public Sans (mit system-ui, Segoe UI), variabel, selbst gehostet

**Character:** Literata gibt den Überschriften eine ruhige, buchhafte Autorität ohne Kanzlei-Pathos; Public Sans ist die Schrift der Schilder und Halte, sachlich, halbfett, gut lesbar am Handy. Zahlen in Telefonnummern, Bürozeiten und Schildern stehen tabellarisch.

### Hierarchy
- **Display** (Literata 500, fließend 2,4 bis 3,6 rem, Zeilenhöhe 1,04, leicht enger gesperrt): H1 der Startseite, höchstens 14 Zeichen breit. Unterseiten nutzen eine kleinere Stufe (2,1 bis 3,3 rem, 18 Zeichen breit).
- **Headline** (Literata 500, fließend 1,9 bis 2,75 rem, 1,1): Abschnittsüberschriften. Auf Unterseiten steht die H2 links und bleibt beim Scrollen kleben.
- **Title** (Literata 600, fließend 1,15 bis 1,35 rem, 1,25): Rechtsgebiete in der Liste, Mediationsthemen, Schritte, Fragen im Akkordeon.
- **Pull** (Literata 500, fließend 1,3 bis 1,75 rem, 1,35): ein hervorgehobener Satz in Terrakotta oder Tinte; auf der Startseite eine etwas größere Stufe bis 2 rem.
- **Body** (Public Sans 400, fließend 1,0625 bis 1,1875 rem, 1,6): Fließtext, höchstens 68 Zeichen breit; Einleitungen 33 bis 46 Zeichen.
- **Stop-Label** (Public Sans 600, 1,3): Namen der Halte im HTML-Plan und im Inhaltsverzeichnis; im SVG-Plan 17 px.
- **Button** (Public Sans 600, 1 rem, 1): alle Buttons.
- **Linienziel** (Public Sans 700, 0,72 rem, 0,16 em gesperrt, Versalien): nur die Ziele einer Linie („RECHT BEKOMMEN“, „LÖSUNG FINDEN“) und die Zeile „Rechtsanwälte · Mediation“ in der Wortmarke.

### Named Rules
**Die Schilder-Regel.** Versalien sind Linienzielen vorbehalten. Über Überschriften steht keine Dachzeile; die Überschrift beginnt den Abschnitt selbst.

**Die Wortmarken-Regel.** Die Wortmarke ist „Kaiser & Kaiser“ in Literata 500, 1,6 rem, Petrol, das Et-Zeichen in Terrakotta, darunter die Linienziel-Zeile in Schiefer. Sie ist das Logo und wird nicht variiert.

## Layout

Ein zentrierter Rahmen von höchstens 1240 px mit fließendem Rand (16 bis 56 px). Abschnitte der Startseite haben fließenden Vertikalabstand (64 bis 120 px), Abschnitte der Unterseiten etwas weniger (56 bis 96 px). Fast jeder Abschnitt ist zweispaltig mit großzügigem Spaltenabstand (bis 96 px) und fällt unter 860 bis 960 px auf eine Spalte.

Die Startseite öffnet links mit H1, Einleitung, zwei Buttons und Adresse, rechts der Linienplan über die volle Höhe. Unter 900 px wird der Plan zu HTML: die Linie läuft senkrecht am linken Rand neben H1 und Buttons, der Umsteigehalt folgt, die Gabelung teilt sich in zwei gleichrangige Äste nebeneinander.

Unterseiten öffnen mit Brotkrume, H1, Einleitung und Buttons links (1,5 Anteile) und einer ruhigen Infospalte rechts (1 Anteil): das Inhaltsverzeichnis als kleine Linie und ein Infokasten mit Telefon, Bürozeiten, Anfahrt. Darunter folgen Blöcke mit klebender H2 links und Text rechts, in der Folge Papier, Leinen, Papier und Sand für die Fragen.

Die Abschnittsfarbe wechselt tonal: Leinen, Papier, Sand, Petrol. Petrol-Abschnitte tragen Kanzlei und Kontakt. Unter 700 px liegt eine feste Anrufleiste mit zwei Buttons am unteren Rand. Die Kopfzeile zeigt die Nummer als Petrol-Button; unter 860 px wird die Navigation zu einem Menü, dessen Seitenliste selbst eine Linie mit Halten ist.

### Named Rules
**Die Halte-statt-Karten-Regel.** Wiederkehrende Einträge (Rechtsgebiete, Themen, Schritte, Seitenabschnitte) stehen als Halte an einer senkrechten Linie, getrennt durch Haarlinien. Ein Raster aus gleichen Karten gibt es nicht.

## Elevation & Depth

Das System ist flach und arbeitet mit tonalen Flächen. Schatten bekommen nur Dinge, die wie ein Gegenstand auf der Seite liegen: das Haltestellenschild, das Rückrufformular, der Fotoplatz, das aufgeklappte Menü und die Anrufleiste. Diese Schatten sind weich, tief und mit negativer Ausbreitung, fallen nach unten und haben nie einen harten Versatz.

### Shadow Vocabulary
- **Schild** (`box-shadow: 0 24px 48px -28px rgba(34, 49, 46, .45), 0 0 0 1px #D6CCB9`): Haltestellenschild.
- **Liegender Bogen** (`box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .5)`): Formular auf Petrol; der Fotoplatz mit .45.
- **Herabhängendes Menü** (`box-shadow: 0 24px 40px -24px rgba(34, 49, 46, .45)`): aufgeklapptes Mobilmenü.
- **Anrufleiste** (`box-shadow: 0 -8px 24px -12px rgba(34, 49, 46, .35)`): feste Leiste am unteren Rand.
- **Haarrahmen** (`box-shadow: 0 0 0 1px #D6CCB9`): Infokasten ohne Höhe.

### Named Rules
**Die Gegenstands-Regel.** Ein Schatten heißt: dieses Ding liegt auf der Seite. Listen, Abschnitte und Buttons bleiben flach; ihre Zustände ändern Farbe, nicht Höhe.

## Shapes

Die Formsprache kommt aus dem Linienplan: Strecken mit runden Enden (10 px, Ecken 5 px), Halte als volle Kreise, der Abzweig der Terrakotta-Linie im Mobilplan als Bogen mit 18 px Radius. Alles Rechteckige ist dagegen fast kantig: Buttons und Felder 3 px, Kästen und Schild 4 px, Fokusring und Bildunterschrift 2 px. Trennungen sind 1 px Haarlinien in Gleisschotter; der umrandete Button trägt einen 1,5 px Innenrand.

### Named Rules
**Die Rund-nur-am-Gleis-Regel.** Rund sind nur Linien und Halte. Flächen und Bedienelemente bleiben knapp gerundet (3 bis 4 px).

## Components

### Buttons
Groß, ruhig, eindeutig; jeder Button sagt, was passiert.
- **Shape:** knapp gerundet (3 px), Innenabstand 1 rem × 1,35 rem, Public Sans 600, optionales Strich-Icon (Telefon, Pfeil) mit 1,1 em.
- **Primär:** Petrol, weiße Schrift; Hover Nachtpetrol. Erster Button jedes Paares ist der Anruf.
- **Umrandet:** transparent, Tinte, 1,5 px Innenrand; Hover füllt mit Tinte, Schrift Leinen. Zweiter Button des Paares („Rückruf erbitten“).
- **Terrakotta:** nur für Wege zur Mediation; Hover gebrannte Terrakotta.
- **Hell und Hell-umrandet:** Varianten für Petrol-Flächen.
- **Fokus:** 3 px Terrakotta-Ring mit 3 px Abstand, siteweit. Übergänge 0,2 s ease. Gesperrt: Deckkraft .6, Cursor „progress“.

### Linienliste (Signatur)
Rechtsgebiete als Halte an der Petrol-Linie. Senkrechte 10 px Linie links, jeder Eintrag ein Halt (22 px Ring) mit Titel in Literata, Satz in Schiefer und „Zum …“-Verweis mit Pfeil rechts. Hover tönt die Zeile leicht Petrol, füllt den Ring Petrol, färbt den Verweis Terrakotta und schiebt den Pfeil 4 px. Die Terrakotta-Variante trägt Mediationsthemen mit Titel in gebrannter Terrakotta, ohne Verweis.

### Linienplan (Signatur)
SVG auf dem Desktop, HTML-Linien auf dem Handy. Strecken 10 px mit runden Enden, Halte als Ringe (r 12, 3,5 px Tinte, Papierfüllung), Umsteigehalt als großer Ring (r 21, 5 px). Halte-Namen in Public Sans 600, Umsteigehalt in Literata 600, Linienziele in gesperrten Versalien. Halte sind Links; Fokus färbt den Ring Terrakotta.

### Schritte
Ein Ablauf als Strecke: Linie in Petrol oder Terrakotta, Halte als 36 px Ringe mit der Schrittnummer in Public Sans 700, Titel in Literata.

### Inhaltsverzeichnis und Menü
Kleine Linie: 8 px Strecke, 20 px Ringe mit 3 px Rand, Einträge Public Sans 600. Hover füllt den Ring in der Linienfarbe und färbt den Text gebrannte Terrakotta. Dieselbe Linie bildet die Seitenliste im Mobilmenü, Mediation dort mit Terrakotta-Ring.

### Haltestellenschild
Papierfläche mit Schild-Schatten und 4 px Ecken, Kopfband in Petrol mit dem Haltnamen in Literata und Zusatz in Public Sans, darunter Zeilen mit Beschriftung links (Schiefer) und Wert rechts (600, tabellarische Ziffern), getrennt durch Haarlinien.

### Cards / Containers
- **Infokasten:** Papier, 4 px, Haarrahmen statt Schatten, Innenabstand 20 × 24 px, Definitionsliste mit Begriff in Schiefer 600.
- **Rückrufformular:** Papier auf Petrol, 4 px, Liegender-Bogen-Schatten, fließender Innenabstand 24 bis 40 px.
- **Brückenkasten:** Terrakotta-Hauch, 4 px, 24 × 26 px, ein Satz in Literata 500 und ein Terrakotta-Button zur Mediation.

### Inputs / Fields
- **Style:** weißer Grund, 1,5 px Feldkante, 3 px Ecken, Innenabstand .8 × .9 rem, Beschriftung darüber in 600, optionale Felder mit „(optional)“ in Schiefer.
- **Focus:** Rand Petrol plus 3 px Petrol-Schein (`rgba(31, 78, 74, .18)`), 0,15 s.
- **Error:** Rand und Meldung in Fehlerrot, Meldung 600 unter dem Feld. Checkbox 20 px mit Petrol-Akzent.

### Navigation
Wortmarke links, Links in Tinte rechts, Hover und aktuelle Seite in Terrakotta, die Telefonnummer als Petrol-Button. Unter 860 px ein Menü-Button mit Innenrand, geöffnet Tinte gefüllt; unter 520 px entfällt der Telefon-Button oben zugunsten der Anrufleiste.

### Fragen
Akkordeon zwischen Haarlinien; Frage in Literata 600, rechts ein Petrol-Winkel, der sich beim Öffnen dreht. Antworten höchstens 64 Zeichen breit.

## Do's and Don'ts

### Do:
- **Do** führe jede Liste von Gebieten, Themen oder Schritten als Halte an einer 10 px Linie mit 22 px Ringen.
- **Do** setze Terrakotta nur dort, wo der Weg zur Mediation führt, und als Lesetext in terra-text.
- **Do** paare Buttons immer gleich: Anruf als gefüllter Petrol-Button zuerst, „Rückruf erbitten“ umrandet daneben.
- **Do** wechsle Abschnitte tonal (Leinen, Papier, Sand, Petrol) statt mit Schatten oder Rahmen.
- **Do** setze Telefonnummern, Bürozeiten und Schilderwerte mit tabellarischen Ziffern.
- **Do** halte die Linienzeichnung beim Laden als einzige Bewegung (1,1 s, `cubic-bezier(.16, 1, .3, 1)`, Petrol vor Terrakotta) und schalte sie bei reduzierter Bewegung ab.

### Don't:
- **Don't** baue Raster aus gleichen Karten für Rechtsgebiete oder Leistungen.
- **Don't** setze Dachzeilen oder Versalien-Etiketten über Überschriften; Versalien gehören nur den Linienzielen.
- **Don't** verwende Paragrafenzeichen, Waage, Navy und Gold oder andere Kanzlei-Klischees.
- **Don't** übernimm BVG-Gelb, das U-Bahn-Logo oder andere Zeichen der Berliner Verkehrsbetriebe.
- **Don't** gib Listen, Abschnitten oder Buttons Schatten; Schatten tragen nur Gegenstände wie Schild, Formular und Menü.
- **Don't** runde Flächen und Bedienelemente stärker als 4 px; rund sind nur Linien und Halte.
