/* Bomb Jack Remake – Musikstücke (eigene Kompositionen)
   Melodie in Achteln: Notenname = neuer Ton, „-“ = Ton halten, „.“ = Pause, „|“ = Taktstrich.
   Akkorde pro Takt; zwei Akkorde in einem Takt teilen ihn in zwei Hälften. */
'use strict';
BJ.lieder = {
  titel: {
    bpm: 132, bass: 'pump', begleitung: 'arp', schlagzeug: 'rock',
    akkorde: 'C | Am | F | G | C | Am | F G | C',
    melodie:
      'G4 C5 E5 G5 C6 - G5 E5 | A5 - E5 C5 A4 - C5 E5 | F5 - A5 F5 C5 - F5 A5 | G5 - - - D5 - B4 D5 | ' +
      'E5 G5 C6 - B5 A5 G5 E5 | A5 - G5 E5 C5 - E5 G5 | A5 - F5 A5 B5 - G5 B5 | C6 - - - - - . .',
  },

  aegypten: {
    bpm: 148, bass: 'pump', begleitung: 'arp', schlagzeug: 'maqsum',
    stimmen: { melodie: { typ: 'puls12', laut: 0.13 }, begleitung: { typ: 'puls25', laut: 0.035 } },
    akkorde: 'D | Eb | D | Cm | D | Gm | Eb | D | Gm | D | Gm | D | Eb | D | Cm | D',
    melodie:
      'D5 - Eb5 F#5 G5 - F#5 Eb5 | D5 - - Eb5 D5 C5 Bb4 - | A4 - D5 - F#5 - A5 G5 | G5 - Eb5 - C5 - Eb5 D5 | ' +
      'F#5 - G5 A5 Bb5 - A5 G5 | Bb5 A5 G5 - D5 - G5 Bb5 | Eb5 - G5 - Bb5 - G5 Eb5 | D5 - - - A4 - - - | ' +
      'G5 - Bb5 - A5 G5 F#5 G5 | A5 - - - F#5 - D5 - | G5 - Bb5 - D6 - Bb5 G5 | A5 - - - . . A5 Bb5 | ' +
      'Bb5 - G5 - Eb5 - G5 Bb5 | A5 - F#5 - D5 - F#5 A5 | G5 - Eb5 - C5 - Eb5 D5 | D5 - - - - - . .',
  },

  griechenland: {
    bpm: 152, bass: 'quint', begleitung: 'stich', schlagzeug: 'folk',
    akkorde: 'Am | Am | Dm | E | Am | G | F | E | Dm | Am | E | Am | Dm | Am | E | Am',
    melodie:
      'E5 - A5 - G#5 A5 B5 A5 | C6 - B5 A5 E5 - - - | F5 - A5 - D6 - C6 A5 | B5 - G#5 - E5 - - - | ' +
      'A5 B5 C6 B5 A5 G#5 A5 E5 | G5 - B5 - D6 - B5 G5 | A5 - F5 - C5 - F5 A5 | G#5 - - - E5 - - - | ' +
      'D5 E5 F5 G5 A5 - F5 D5 | E5 - A5 - C6 - A5 E5 | G#5 A5 B5 C6 B5 - G#5 E5 | A5 - - - E5 - A4 - | ' +
      'F5 - D5 - A5 - F5 D5 | C6 - B5 A5 E5 - C5 E5 | B4 - E5 - G#5 - B5 G#5 | A5 - - - - - . .',
  },

  bayern: {
    bpm: 180, takt: 12, terz: 5, bass: 'walzer', begleitung: 'walzer', schlagzeug: 'walzer',
    stimmen: { melodie: { typ: 'puls25', laut: 0.11 }, zweite: { typ: 'puls25', laut: 0.06 }, akkord: { typ: 'puls12', laut: 0.06 } },
    akkorde: 'F | F | C7 | C7 | C7 | C7 | F | F | F | F | Bb | Bb | F | C7 | F | F',
    melodie:
      'C5 - F5 - A5 - | C6 - - - A5 - | Bb5 - G5 - E5 - | C5 - - - - - | ' +
      'E5 - G5 - Bb5 - | C6 - Bb5 - G5 - | A5 - F5 - C5 - | F5 - - - - - | ' +
      'A5 - G5 - F5 - | A5 - C6 - A5 - | D6 - C6 - Bb5 - | F5 - - - D5 - | ' +
      'C5 - F5 - A5 - | G5 - Bb5 - E5 - | F5 - A5 - C6 - | F5 - - - . .',
  },

  miami: {
    bpm: 124, bass: 'latin', begleitung: 'stich', schlagzeug: 'latin',
    stimmen: { melodie: { typ: 'puls12', laut: 0.13 }, akkord: { typ: 'puls25', laut: 0.05 } },
    akkorde: 'G | Em | C | D | G | Em | Am | D | C | D | Bm | Em | C | D | G | G',
    melodie:
      'D5 . G5 . B5 - A5 G5 | E5 - - . G5 - B5 - | C6 - B5 A5 G5 - E5 - | F#5 - A5 - D6 - - - | ' +
      'D5 . G5 . B5 - D6 B5 | G5 - E5 - B4 - E5 G5 | A5 - C6 - E6 - D6 C6 | B5 - A5 - F#5 - D5 - | ' +
      'E5 - G5 - C6 - B5 - | A5 - F#5 - D5 - F#5 A5 | D6 - B5 - F#5 - B5 - | G5 - - - E5 - G5 B5 | ' +
      'C6 - E6 - D6 - C6 - | B5 - A5 - G5 - F#5 - | G5 - B5 - D6 - B5 - | G5 - - - - - . .',
  },

  newyork: {
    bpm: 116, bass: 'funk', begleitung: 'stich', schlagzeug: 'disko',
    stimmen: { melodie: { typ: 'saege', laut: 0.1, filter: 2600 }, bass: { typ: 'rechteck', laut: 0.13, filter: 900 }, akkord: { typ: 'puls25', laut: 0.045 } },
    akkorde: 'Em7 | Em7 | Am7 | B7 | Em7 | Em7 | Cmaj7 | B7 | Am7 | D7 | Gmaj7 | Cmaj7 | Am7 | B7 | Em7 | B7',
    melodie:
      'E5 . G5 A5 . B5 . D6 | B5 - - A5 G5 - E5 - | A5 . C6 A5 . G5 E5 . | F#5 - A5 - D#5 - B4 - | ' +
      'E5 . G5 A5 . B5 . D6 | E6 - D6 B5 A5 - G5 - | G5 - E5 G5 B5 - - G5 | A5 - F#5 - D#5 - . . | ' +
      'C6 - B5 A5 G5 - E5 - | F#5 - A5 - C6 - A5 F#5 | B5 - D6 - B5 - G5 - | E5 - G5 - B5 - - - | ' +
      'A5 . C6 . E6 . D6 C6 | B5 - A5 - F#5 - D#5 - | E5 - G5 - B5 - E6 - | D#6 - - - B5 - . .',
  },

  power: {
    bpm: 176, bass: 'pump', schlagzeug: 'power',
    stimmen: { melodie: { typ: 'puls25', laut: 0.11 } },
    akkorde: 'Cm | Ab | Bb | G',
    melodie:
      'C5 Eb5 G5 C6 G5 Eb5 C5 Eb5 | Ab4 C5 Eb5 Ab5 Eb5 C5 Ab4 C5 | Bb4 D5 F5 Bb5 F5 D5 Bb4 D5 | B4 D5 G5 B5 D6 B5 G5 D5',
  },

  // Kurze Melodien ohne Wiederholung
  rundeStart: {
    bpm: 150, schleife: false, bass: 'liegend', begleitung: 'flaeche', schlagzeug: 'fanfare',
    akkorde: 'C | C',
    melodie: 'G4 - C5 - E5 - G5 - | C6 - - - - - . .',
  },
  rundeGeschafft: {
    bpm: 150, schleife: false, bass: 'pump', begleitung: 'arp', schlagzeug: 'rock',
    akkorde: 'C | F | G | C',
    melodie: 'E5 G5 C6 - G5 - C6 - | A5 C6 F6 - C6 - A5 - | B5 D6 G6 - F6 - D6 - | E6 - - - C6 - - -',
  },
  tod: {
    bpm: 160, schleife: false,
    akkorde: 'C | C',
    melodie: 'G5 F#5 F5 E5 D#5 D5 C#5 C5 | B4 - - - - - . .',
  },
  gameover: {
    bpm: 92, schleife: false, bass: 'liegend', begleitung: 'flaeche',
    akkorde: 'Am | F | Dm | E',
    melodie: 'A4 - - - C5 - B4 A4 | F4 - - - A4 - G4 F4 | D4 - F4 - A4 - G4 F4 | E4 - - - - - . .',
  },
  rekord: {
    bpm: 140, schleife: false, bass: 'pump', begleitung: 'arp', schlagzeug: 'rock',
    akkorde: 'F | Bb | C | F',
    melodie: 'C5 F5 A5 C6 - A5 C6 - | D6 - Bb5 - F5 - D5 - | E5 G5 C6 - Bb5 - G5 - | F5 - - - - - . .',
  },
};
