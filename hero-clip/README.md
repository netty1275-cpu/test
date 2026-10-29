# Hero-Clip: Produktionsfirma für Funk und Fernsehen

Ein 20 Sekunden langer Hintergrundclip für den Hero-Bereich, nahtlos in Schleife und ohne Ton.

**Inhalt:** ein dunkles Studio mit schwenkenden Scheinwerfern und Staub im Licht, dazu eine Radio-Wellenform auf dem Studioboden und ein „ON AIR“-Schild, das am Anfang flackernd angeht. Von Sekunde 4 bis 16 blendet ein Kamera-Sucher ein: REC, Timecode, Kameradaten und Audiopegel.

| Datei | Zweck | Größe |
|---|---|---|
| `hero-funk-fernsehen-1080p.mp4` | Standard (H.264, Full HD) | ca. 6,3 MB |
| `hero-funk-fernsehen-1080p.webm` | kleiner für Chrome/Firefox (VP9) | ca. 2,5 MB |
| `hero-funk-fernsehen-720p.mp4` | für Handys | ca. 1,7 MB |
| `hero-poster.jpg` | Standbild, das vor dem Laden und bei „reduzierte Bewegung“ erscheint | ca. 160 KB |
| `demo.html` | fertiges Hero-Beispiel zum Ansehen und Kopieren | |

## Einbau

```html
<section class="hero">
  <video class="hero__video" autoplay muted loop playsinline preload="auto"
         poster="hero-poster.jpg" aria-hidden="true">
    <source src="hero-funk-fernsehen-720p.mp4" type="video/mp4" media="(max-width: 900px)">
    <source src="hero-funk-fernsehen-1080p.webm" type="video/webm">
    <source src="hero-funk-fernsehen-1080p.mp4" type="video/mp4">
  </video>
  <!-- Überschrift, Text, Knopf … -->
</section>
```

Das CSS dazu steht in `demo.html`. Die Attribute `muted` und `playsinline` sind Pflicht, sonst starten iPhones und die meisten Browser das Video nicht automatisch.

## Neu rendern

`werkzeug/render_hero.py` erzeugt den Clip komplett per Code, gebraucht werden numpy, Pillow und ffmpeg. Die Länge stellt man über `DAUER` ein; alle Bewegungen passen sich an und bleiben schleifenfähig.

```bash
python3 werkzeug/render_hero.py /tmp/render
ffmpeg -i /tmp/render/_roh.mov -c:v libx264 -preset slow -crf 23 -maxrate 3M -bufsize 6M \
       -tune grain -pix_fmt yuv420p -movflags +faststart -an hero-funk-fernsehen-1080p.mp4
```
