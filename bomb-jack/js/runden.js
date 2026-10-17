/* Bomb Jack Remake – Rundenpläne
   17 × 17 Zellen: „=“ Plattform, „a“–„x“ die 24 Bomben in Zündreihenfolge,
   „J“ Startplatz von Jack, „*“ Eingang der Gegner, „.“ frei. */
'use strict';
BJ.RUNDEN = [
  {
    name: 'Der Auftakt', welt: 0, flieger: ['vogel'],
    karte: [
      '..*...........*..',
      '.abc.........xwv.',
      '.===.........===.',
      '.................',
      '.................',
      'd...............u',
      'e.......J.......t',
      'f......===......s',
      'g...............r',
      '.................',
      '.hij.........opq.',
      '.===.........===.',
      '.................',
      '.................',
      '.................',
      '.................',
      '......kl.mn......',
    ],
  },
  {
    name: 'Die Pyramide', welt: 0, flieger: ['vogel', 'kugel'],
    karte: [
      '....*.......*....',
      'ab.............fg',
      '.......cde.......',
      '.......===.......',
      '.................',
      '......kj.ih......',
      '......=====......',
      '.................',
      '....ml.....xw....',
      '....=========....',
      '.................',
      '..on.........vu..',
      '..=============..',
      '.................',
      '........r........',
      '.................',
      'qp......J......st',
    ],
  },
  {
    name: 'Der Tempel', welt: 1, flieger: ['kugel', 'irrlicht'],
    karte: [
      '.....*.....*.....',
      '..a.....b.....c..',
      '.................',
      '....h.g.f.e.d....',
      '..=============..',
      '.................',
      '...i..n...o..t...',
      '.................',
      '...j..m...p..s...',
      '.................',
      '...k..l...q..r...',
      '........J........',
      '..=============..',
      '.................',
      '.................',
      '.................',
      '.x...w.....v...u.',
    ],
  },
  {
    name: 'Das Kreuz', welt: 1, flieger: ['vogel', 'irrlicht', 'kugel'],
    karte: [
      '...*.........*...',
      '.a.............l.',
      '..b...........k..',
      '...c.........j...',
      '....d..===..i....',
      '.....e.....h.....',
      '......f...g......',
      '.................',
      '........J........',
      '.===..=====..===.',
      '......s...r......',
      '.....t.....q.....',
      '....u.......p....',
      '...v...===...o...',
      '..w...........n..',
      '.x.............m.',
      '.................',
    ],
  },
  {
    name: 'Die Burg', welt: 2, flieger: ['ufo', 'vogel'],
    karte: [
      '...*.........*...',
      '..vwx.......def..',
      '..===.......===..',
      '.......abc.......',
      '.................',
      '.................',
      '..t.u.......g.h..',
      '..===.......===..',
      '.......onm.......',
      '.......===.......',
      '.................',
      '..s.r.......j.i..',
      '..===.......===..',
      '.................',
      '.................',
      '.................',
      '......qpJlk......',
    ],
  },
  {
    name: 'Die Treppen', welt: 2, flieger: ['ufo', 'kugel', 'irrlicht'],
    karte: [
      '.....*.....*.....',
      '.n.m....l....j.k.',
      '.===.........===.',
      '.................',
      '....o.p...h.i....',
      '....===...===....',
      '.................',
      '.......efg.......',
      '.......===.......',
      '.................',
      '....c.d...q.r....',
      '....===...===....',
      '.................',
      '.a.b.........s.t.',
      '.===.........===.',
      '.................',
      '......xwJvu......',
    ],
  },
  {
    name: 'Der Ring', welt: 3, flieger: ['hornisse', 'kugel'],
    kreis: { cx: 340, cy: 330, r: 245 },
    karte: [
      '.*.............*.',
      '.................',
      '.................',
      '===...........===',
      '.................',
      '.................',
      '.................',
      '.................',
      '........J........',
      '.......===.......',
      '.................',
      '.................',
      '.................',
      '===...........===',
      '.................',
      '.................',
      '.................',
    ],
  },
  {
    name: 'Die Kaimauern', welt: 3, flieger: ['hornisse', 'ufo', 'vogel'],
    karte: [
      '........*........',
      '..a.b.c...d.e.f..',
      '.................',
      '.................',
      '.................',
      '..l.k.j...i.h.g..',
      '..=============..',
      '.................',
      '.................',
      '.....==...==.....',
      '.................',
      '..m.n.o.J.p.q.r..',
      '..=============..',
      '.................',
      '.................',
      '.................',
      '..x.w.v...u.t.s..',
    ],
  },
  {
    name: 'Die Hochhäuser', welt: 4, flieger: ['ufo', 'hornisse', 'irrlicht'],
    karte: [
      '...*.........*...',
      '.................',
      '.......i.j.......',
      '.......===.......',
      '..g.h.......u.v..',
      '..===.......===..',
      '.......l.k.......',
      '.......===.......',
      '..e.f.......s.t..',
      '..===.......===..',
      '.......m.n.......',
      '.......===.......',
      '..c.d.......q.r..',
      '..===.......===..',
      '.......p.o.......',
      '.......===.......',
      'ab....J........wx',
    ],
  },
  {
    name: 'Der Diamant', welt: 4, flieger: ['vogel', 'kugel', 'ufo', 'irrlicht', 'hornisse'],
    karte: [
      '..*...........*..',
      '.................',
      '.......x.a.......',
      '......w...b......',
      '.===.v.....c.===.',
      '....u.......d....',
      '...t.........e...',
      '..s...........f..',
      '........J........',
      '..r...=====...g..',
      '...q.........h...',
      '....p.......i....',
      '.===.o.....j.===.',
      '......n...k......',
      '.......m.l.......',
      '.................',
      '.................',
    ],
  },
];

// Runde aus dem Plan aufbauen (nr ab 0, nach Runde 10 beginnt ein schnellerer Durchgang)
BJ.baueRunde = (nr) => {
  const vorlage = BJ.RUNDEN[nr % BJ.RUNDEN.length];
  const Z = BJ.ZELLE;
  const runde = {
    nr, durchgang: Math.floor(nr / BJ.RUNDEN.length), welt: vorlage.welt, name: vorlage.name, flieger: vorlage.flieger,
    plattformen: [], bomben: [], eingaenge: [], start: { x: 340, y: 680 },
  };
  vorlage.karte.forEach((zeile, r) => {
    let anfang = -1;
    for (let c = 0; c <= zeile.length; c++) {
      const z = zeile[c];
      if (z === '=') { if (anfang < 0) anfang = c; } else if (anfang >= 0) {
        runde.plattformen.push({ x: anfang * Z, y: r * Z, b: (c - anfang) * Z, h: 16 });
        anfang = -1;
      }
      if (z >= 'a' && z <= 'x') runde.bomben.push({ buchstabe: z, x: c * Z + Z / 2, y: r * Z + Z / 2 });
      else if (z === 'J') runde.start = { x: c * Z + Z / 2, y: (r + 1) * Z };
      else if (z === '*') runde.eingaenge.push({ x: c * Z + Z / 2, y: r * Z + Z });
    }
  });
  if (vorlage.kreis) {
    const { cx, cy, r } = vorlage.kreis;
    for (let i = 0; i < 24; i++) {
      const w = (i / 24) * Math.PI * 2;
      runde.bomben.push({ buchstabe: String.fromCharCode(97 + i), x: cx + Math.sin(w) * r, y: cy - Math.cos(w) * r });
    }
  }
  runde.bomben.sort((a, b) => (a.buchstabe < b.buchstabe ? -1 : 1));
  runde.bomben.forEach((b, i) => { b.index = i; b.weg = false; b.brennend = false; });
  return runde;
};

// Schwierigkeit je Runde
BJ.rundenWerte = (nr) => {
  const i = nr % BJ.RUNDEN.length, d = Math.floor(nr / BJ.RUNDEN.length);
  const stufe = BJ.einstellungen.schwierigkeit;
  const s = [0.85, 1, 1.18][stufe];
  return {
    tempo: (1 + i * 0.045 + d * 0.15) * s,
    maxGegner: Math.min(10, 3 + Math.floor(i / 2) + d + (stufe === 2 ? 1 : 0)),
    abstand: Math.max(1.6, (5.2 - i * 0.28 - d * 0.6) / s),
    powerDauer: Math.max(3, 7.5 - i * 0.3 - d * 0.8 - (stufe === 2 ? 0.8 : 0)),
    direkt: i < 2 && d === 0 ? 0 : 0.25,
  };
};
