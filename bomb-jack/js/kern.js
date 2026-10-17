/* Bomb Jack Remake – Kern: Grundwerte, Hilfsfunktionen, Eingabe, Speicher */
'use strict';
const BJ = (window.BJ = {});

// Logische Bildgröße; die Leinwand wird passend zum Fenster skaliert
BJ.B = 1280;
BJ.H = 720;
// Spielfeld (680 × 680) mit 17 × 17 Zellen à 40 Einheiten
BJ.FELD = { x: 300, y: 20, b: 680, h: 680 };
BJ.ZELLE = 40;
BJ.RASTER = 17;

// Schriften auf der Leinwand
BJ.SCHRIFT_TITEL = 'Bangers, Impact, "Arial Black", sans-serif';
BJ.SCHRIFT_TEXT = '"Baloo 2", "Trebuchet MS", "Segoe UI", sans-serif';
BJ.schrift = (gewicht, groesse, titel) => (titel ? `${groesse}px ${BJ.SCHRIFT_TITEL}` : `${gewicht} ${groesse}px ${BJ.SCHRIFT_TEXT}`);

// Mathe
BJ.klemme = (v, min, max) => (v < min ? min : v > max ? max : v);
BJ.mix = (a, b, t) => a + (b - a) * t;
BJ.zufall = (min, max) => min + Math.random() * (max - min);
BJ.zufallGanz = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
BJ.eines = (liste) => liste[Math.floor(Math.random() * liste.length)];
BJ.weich = (t) => t * t * (3 - 2 * t);
BJ.rausKubisch = (t) => 1 - Math.pow(1 - t, 3);
BJ.rausZurueck = (t) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
BJ.zahl = (n) => Math.round(n).toLocaleString('de-DE');

// Reproduzierbarer Zufall, damit Hintergründe beim Neuzeichnen gleich aussehen
BJ.saat = (s) => () => {
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Rechteck gegen Rechteck, Kreis gegen Rechteck
BJ.trifft = (a, b) => a.x < b.x + b.b && a.x + a.b > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
BJ.kreisTrifft = (cx, cy, r, q) => {
  const nx = BJ.klemme(cx, q.x, q.x + q.b), ny = BJ.klemme(cy, q.y, q.y + q.h);
  return (cx - nx) * (cx - nx) + (cy - ny) * (cy - ny) < r * r;
};

// Speicher (localStorage kann fehlen oder gesperrt sein)
BJ.speicher = {
  lesen(schluessel, standard) {
    try {
      const wert = localStorage.getItem('bombjack.' + schluessel);
      return wert === null ? standard : JSON.parse(wert);
    } catch (e) { return standard; }
  },
  schreiben(schluessel, wert) {
    try { localStorage.setItem('bombjack.' + schluessel, JSON.stringify(wert)); } catch (e) { /* ohne Speicher weiterspielen */ }
  },
};

// Einstellungen
BJ.einstellungen = Object.assign(
  { musik: true, effekte: true, lautstaerke: 7, schwierigkeit: 1, startrunde: 1, scanlines: false },
  BJ.speicher.lesen('einstellungen', {})
);
BJ.speichereEinstellungen = () => BJ.speicher.schreiben('einstellungen', BJ.einstellungen);
BJ.wenigBewegung = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Bestenliste
BJ.STANDARD_BESTENLISTE = [
  { name: 'JACK', punkte: 50000, runde: 8 },
  { name: 'TEHKAN', punkte: 40000, runde: 7 },
  { name: 'SPHINX', punkte: 30000, runde: 6 },
  { name: 'ZEUS', punkte: 25000, runde: 5 },
  { name: 'LUDWIG', punkte: 20000, runde: 4 },
  { name: 'MIAMI', punkte: 15000, runde: 3 },
  { name: 'BRONX', punkte: 10000, runde: 3 },
  { name: 'MUMIE', punkte: 7500, runde: 2 },
  { name: 'UFO', punkte: 5000, runde: 2 },
  { name: 'PIEPMATZ', punkte: 2500, runde: 1 },
];
BJ.bestenliste = () => {
  const liste = BJ.speicher.lesen('bestenliste', null);
  return Array.isArray(liste) && liste.length ? liste : BJ.STANDARD_BESTENLISTE.map((e) => ({ ...e }));
};
BJ.rekord = () => BJ.bestenliste()[0].punkte;
BJ.platzFuer = (punkte) => {
  const liste = BJ.bestenliste();
  const i = liste.findIndex((e) => punkte > e.punkte);
  return i === -1 ? (liste.length < 10 ? liste.length : -1) : i;
};
BJ.eintragen = (name, punkte, runde) => {
  const liste = BJ.bestenliste();
  const platz = BJ.platzFuer(punkte);
  if (platz < 0) return -1;
  liste.splice(platz, 0, { name, punkte, runde });
  BJ.speicher.schreiben('bestenliste', liste.slice(0, 10));
  return platz;
};

// Eingabe: gehaltene Tasten und neu gedrückte Tasten (pro Logikschritt)
(() => {
  const belegung = {
    links: ['ArrowLeft', 'KeyA'],
    rechts: ['ArrowRight', 'KeyD'],
    hoch: ['ArrowUp', 'KeyW'],
    runter: ['ArrowDown', 'KeyS'],
    sprung: ['Space', 'KeyX', 'KeyK'],
    ok: ['Enter', 'NumpadEnter', 'Space'],
    zurueck: ['Escape', 'Backspace'],
    pause: ['KeyP', 'Escape'],
    musik: ['KeyM'],
    vollbild: ['KeyF'],
  };
  const gehalten = new Set();
  const neu = new Set();
  let puffer = [];
  const blockiert = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Backspace', 'Tab']);

  BJ.eingabe = {
    textModus: false,
    halten: (aktion) => belegung[aktion].some((c) => gehalten.has(c)),
    neu: (aktion) => belegung[aktion].some((c) => neu.has(c)),
    irgendeine: () => neu.size > 0,
    zeichen() { const z = puffer; puffer = []; return z; },
    leeren: () => neu.clear(),
    loslassen() { gehalten.clear(); neu.clear(); },
  };

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (blockiert.has(e.code)) e.preventDefault();
    if (BJ.eingabe.textModus && (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter' || e.key === 'Escape')) {
      puffer.push(e.key);
      e.preventDefault();
    }
    if (!e.repeat) neu.add(e.code);
    gehalten.add(e.code);
    if (BJ.audio) BJ.audio.starten();
  });
  window.addEventListener('keyup', (e) => gehalten.delete(e.code));
  window.addEventListener('blur', () => {
    gehalten.clear();
    if (BJ.beiFokusVerlust) BJ.beiFokusVerlust();
  });
})();
