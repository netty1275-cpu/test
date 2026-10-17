/* Bomb Jack Remake – Klang: Synthesizer, Musik-Sequenzer und Geräusche (alles mit Web Audio erzeugt) */
'use strict';
(() => {
  const A = (BJ.audio = { ctx: null, bereit: false });
  let haupt, musikBus, effektBus, hall, rausch;
  const wellen = {};
  let lied = null;          // gerade laufendes Musikstück
  let liedMarke = 0;        // erkennt veraltete „danach“-Aufrufe
  let wunsch = null;        // Musik, die vor der ersten Taste angefordert wurde
  const kompiliert = {};

  // ---------- Aufbau ----------
  A.starten = () => {
    if (!A.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { A.ctx = new AC(); } catch (e) { return; }
      aufbauen();
      setInterval(takt, 25);
    }
    if (A.ctx.state === 'suspended' && !A.angehalten) A.ctx.resume().catch(() => {});
    if (wunsch && !lied) { const w = wunsch; wunsch = null; A.spieleLied(w.name, w.optionen); }
  };

  function aufbauen() {
    const c = A.ctx;
    const komp = c.createDynamicsCompressor();
    komp.threshold.value = -16; komp.knee.value = 12; komp.ratio.value = 4;
    komp.attack.value = 0.004; komp.release.value = 0.2;
    komp.connect(c.destination);
    haupt = c.createGain();
    haupt.gain.value = pegel();
    haupt.connect(komp);
    musikBus = c.createGain(); musikBus.gain.value = BJ.einstellungen.musik ? MUSIK_PEGEL : 0; musikBus.connect(haupt);
    effektBus = c.createGain(); effektBus.gain.value = BJ.einstellungen.effekte ? EFFEKT_PEGEL : 0; effektBus.connect(haupt);

    // Raumhall, von beiden Bussen gespeist (stumme Busse bleiben dadurch auch im Hall stumm)
    hall = c.createConvolver();
    hall.buffer = hallImpuls(c, 1.7);
    hall.connect(haupt);
    const hallM = c.createGain(); hallM.gain.value = 0.16; musikBus.connect(hallM); hallM.connect(hall);
    const hallE = c.createGain(); hallE.gain.value = 0.2; effektBus.connect(hallE); hallE.connect(hall);

    rausch = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = rausch.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    wellen.puls25 = pulsWelle(c, 0.25);
    wellen.puls12 = pulsWelle(c, 0.125);
    A.bereit = true;
  }

  function pulsWelle(c, tastgrad) {
    const n = 64, re = new Float32Array(n), im = new Float32Array(n);
    for (let k = 1; k < n; k++) re[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * tastgrad);
    return c.createPeriodicWave(re, im);
  }

  function hallImpuls(c, sekunden) {
    const laenge = Math.floor(c.sampleRate * sekunden);
    const puffer = c.createBuffer(2, laenge, c.sampleRate);
    for (let k = 0; k < 2; k++) {
      const d = puffer.getChannelData(k);
      for (let i = 0; i < laenge; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / laenge, 3.2);
    }
    return puffer;
  }

  // Geräusche sollen sich klar von der Musik abheben
  const MUSIK_PEGEL = 0.7, EFFEKT_PEGEL = 1.9;
  const pegel = () => Math.pow(BJ.einstellungen.lautstaerke / 10, 1.6) * 0.9;
  A.setzeLautstaerke = () => { if (A.bereit) haupt.gain.setTargetAtTime(pegel(), A.ctx.currentTime, 0.05); };
  A.setzeMusik = () => { if (A.bereit) musikBus.gain.setTargetAtTime(BJ.einstellungen.musik ? MUSIK_PEGEL : 0, A.ctx.currentTime, 0.05); };
  A.setzeEffekte = () => { if (A.bereit) effektBus.gain.setTargetAtTime(BJ.einstellungen.effekte ? EFFEKT_PEGEL : 0, A.ctx.currentTime, 0.05); };

  // Anhalten (Pause, verstecktes Fenster)
  A.anhalten = (an) => {
    A.angehalten = an;
    if (!A.ctx) return;
    if (an) A.ctx.suspend().catch(() => {}); else A.ctx.resume().catch(() => {});
  };

  // ---------- Klangbausteine ----------
  const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
  A.hz = hz;

  // Ein Ton mit Hüllkurve. o: typ, freq, start, dauer, laut, an, ab, halt, frei, gleiten, arp, vibrato, filter, pan, ziel
  A.ton = (o) => {
    if (!A.bereit) return;
    const c = A.ctx;
    const t0 = o.start !== undefined ? o.start : c.currentTime;
    const dauer = o.dauer || 0.2;
    const laut = o.laut !== undefined ? o.laut : 0.15;
    const an = o.an || 0.005, ab = o.ab || 0.08, halt = o.halt !== undefined ? o.halt : 0.7, frei = o.frei || 0.06;
    const ende = t0 + Math.max(dauer, an + ab);

    const osc = c.createOscillator();
    if (wellen[o.typ]) osc.setPeriodicWave(wellen[o.typ]);
    else osc.type = { dreieck: 'triangle', sinus: 'sine', saege: 'sawtooth', rechteck: 'square' }[o.typ] || 'square';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.gleiten) osc.frequency.exponentialRampToValueAtTime(o.gleiten, t0 + (o.gleitZeit || dauer));
    if (o.arp) {
      const schritt = o.arpTempo || 1 / 50;
      for (let t = t0, i = 0; t < ende + frei; t += schritt, i++) osc.frequency.setValueAtTime(o.arp[i % o.arp.length], t);
    }
    if (o.vibrato && dauer > 0.22) {
      const lfo = c.createOscillator(), tiefe = c.createGain();
      lfo.frequency.value = 5.6;
      tiefe.gain.setValueAtTime(0, t0);
      tiefe.gain.linearRampToValueAtTime(o.freq * o.vibrato, t0 + 0.18);
      lfo.connect(tiefe); tiefe.connect(osc.frequency);
      lfo.start(t0); lfo.stop(ende + frei + 0.05);
    }
    const g = c.createGain();
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(laut, t0 + an);
    g.gain.linearRampToValueAtTime(laut * halt, t0 + an + ab);
    g.gain.setValueAtTime(laut * halt, ende);
    g.gain.linearRampToValueAtTime(0, ende + frei);

    let kette = osc;
    if (o.filter) {
      const f = c.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = o.filter; f.Q.value = 0.7;
      osc.connect(f); kette = f;
    }
    kette.connect(g);
    const ziel = o.ziel || effektBus;
    if (o.pan && c.createStereoPanner) {
      const p = c.createStereoPanner(); p.pan.value = o.pan;
      g.connect(p); p.connect(ziel);
    } else g.connect(ziel);
    osc.start(t0);
    osc.stop(ende + frei + 0.05);
  };

  // Rauschstoß durch ein Filter
  A.rauschen = (o) => {
    if (!A.bereit) return;
    const c = A.ctx;
    const t0 = o.start !== undefined ? o.start : c.currentTime;
    const dauer = o.dauer || 0.1;
    const q = c.createBufferSource(); q.buffer = rausch;
    const f = c.createBiquadFilter();
    f.type = o.filter || 'highpass';
    f.frequency.setValueAtTime(o.freq || 1000, t0);
    if (o.freqEnde) f.frequency.exponentialRampToValueAtTime(o.freqEnde, t0 + dauer);
    f.Q.value = o.q || 0.8;
    const g = c.createGain();
    g.gain.setValueAtTime(o.laut !== undefined ? o.laut : 0.1, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dauer);
    q.connect(f); f.connect(g); g.connect(o.ziel || effektBus);
    q.start(t0, Math.random() * 0.5);
    q.stop(t0 + dauer + 0.02);
  };

  // ---------- Schlagzeug ----------
  const trommeln = {
    k(t, z) { // Bassdrum
      if (!A.bereit) return;
      const c = A.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
      g.gain.setValueAtTime(0.62, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g); g.connect(z); o.start(t); o.stop(t + 0.32);
      A.rauschen({ start: t, dauer: 0.012, laut: 0.12, filter: 'highpass', freq: 2500, ziel: z });
    },
    s(t, z) { // Snare
      A.rauschen({ start: t, dauer: 0.16, laut: 0.26, filter: 'bandpass', freq: 1900, q: 0.6, ziel: z });
      A.ton({ typ: 'dreieck', freq: 190, gleiten: 140, start: t, dauer: 0.06, laut: 0.2, ab: 0.04, halt: 0.2, frei: 0.03, ziel: z });
    },
    h(t, z) { A.rauschen({ start: t, dauer: 0.035, laut: 0.06, filter: 'highpass', freq: 7600, ziel: z }); },
    o(t, z) { A.rauschen({ start: t, dauer: 0.2, laut: 0.06, filter: 'highpass', freq: 6800, ziel: z }); },
    r(t, z) { A.ton({ typ: 'sinus', freq: 2450, start: t, dauer: 0.025, laut: 0.11, an: 0.001, ab: 0.02, halt: 0.1, frei: 0.02, ziel: z }); },
    t(t, z) { // „Tek“ der Darbuka
      A.rauschen({ start: t, dauer: 0.05, laut: 0.12, filter: 'bandpass', freq: 3200, q: 1.2, ziel: z });
      A.ton({ typ: 'sinus', freq: 420, gleiten: 300, start: t, dauer: 0.05, laut: 0.16, ab: 0.03, halt: 0.2, frei: 0.02, ziel: z });
    },
    c(t, z) { // Klatschen
      for (let i = 0; i < 3; i++) A.rauschen({ start: t + i * 0.012, dauer: 0.07, laut: 0.12, filter: 'bandpass', freq: 1300, q: 0.9, ziel: z });
    },
  };

  // ---------- Musikstücke vorbereiten ----------
  const NOTEN = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const notenNr = (name) => {
    const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
    if (!m) return 60;
    return NOTEN[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) + 1) * 12;
  };
  const ARTEN = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], sus4: [0, 5, 7], dim: [0, 3, 6], 6: [0, 4, 7, 9] };
  const akkord = (name) => {
    const m = /^([A-G])([#b]?)(.*)$/.exec(name);
    const grund = (NOTEN[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
    return { grund, toene: ARTEN[m[3]] || ARTEN[''] };
  };
  // Terz darunter in einer Dur-Tonart (für zweistimmige Melodien)
  const DUR = [0, 2, 4, 5, 7, 9, 11];
  const terzDarunter = (midi, tonika) => {
    const stufe = (((midi - tonika) % 12) + 12) % 12;
    const i = DUR.indexOf(stufe);
    if (i < 0) return midi - 3;
    return midi - ((stufe - DUR[(i + 5) % 7] + 12) % 12);
  };

  const bassStile = {
    pump(e, s0, n, a) { for (let s = 0; s < n; s += 2) e[s0 + s].push({ stimme: 'bass', midi: 36 + a.grund + ((s / 2) % 2 ? 12 : 0), dauer: 1.6 }); },
    quint(e, s0, n, a) { for (let s = 0; s < n; s += 4) e[s0 + s].push({ stimme: 'bass', midi: 36 + a.grund + ((s / 4) % 2 ? 7 : 0), dauer: 3.4 }); },
    walzer(e, s0, n, a, takt) { e[s0].push({ stimme: 'bass', midi: 36 + a.grund - (takt % 2 ? 5 : 0), dauer: 3 }); },
    funk(e, s0, n, a) {
      [[0, 0, 2], [3, 0, 1], [6, 12, 1], [8, 0, 2], [10, 7, 1], [12, 12, 1], [14, 0, 1]].forEach(([s, iv, d]) => {
        if (s < n) e[s0 + s].push({ stimme: 'bass', midi: 36 + a.grund + iv, dauer: d });
      });
    },
    latin(e, s0, n, a) {
      [[0, 0, 3], [6, 7, 2], [8, 0, 3], [14, 7, 2]].forEach(([s, iv, d]) => {
        if (s < n) e[s0 + s].push({ stimme: 'bass', midi: 36 + a.grund + iv, dauer: d });
      });
    },
    liegend(e, s0, n, a) { e[s0].push({ stimme: 'bass', midi: 36 + a.grund, dauer: n }); },
  };
  const akkordToene = (a) => a.toene.map((iv) => 60 + a.grund + iv);
  const begleitStile = {
    arp(e, s0, n, a) {
      const t = akkordToene(a); t.push(t[0] + 12);
      for (let s = 0; s < n; s++) e[s0 + s].push({ stimme: 'begleitung', midi: t[s % t.length], dauer: 1 });
    },
    stich(e, s0, n, a) { for (const s of [2, 6, 10, 14]) if (s < n) e[s0 + s].push({ stimme: 'akkord', midis: akkordToene(a), dauer: 1.5 }); },
    walzer(e, s0, n, a) { for (const s of [4, 8]) if (s < n) e[s0 + s].push({ stimme: 'akkord', midis: akkordToene(a), dauer: 2.5 }); },
    flaeche(e, s0, n, a) { e[s0].push({ stimme: 'akkord', midis: akkordToene(a), dauer: n, flaeche: true }); },
  };
  const SCHLAGZEUG = {
    rock: { k: 'x.......x.x.....', s: '....x.......x...', h: 'x.x.x.x.x.x.x.x.' },
    disko: { k: 'x...x...x...x...', s: '....x.......x...', h: 'x...x...x...x...', o: '..x...x...x...x.' },
    latin: { k: 'x.....x.x.....x.', r: 'x..x..x...x.x...', h: 'x.xxx.xxx.xxx.xx' },
    maqsum: { k: 'x.......x.......', t: '..x...x.....x..x', h: 'x.x.x.x.x.x.x.x.' },
    folk: { k: 'x.......x.......', s: '....x.......x...', h: '..x...x...x...x.' },
    walzer: { k: 'x...........', s: '....x...x...', h: '..x...x...x.' },
    power: { k: 'x...x...x...x...', s: '....x.......x.xx', h: 'xxxxxxxxxxxxxxxx' },
    fanfare: { k: 'x...x...x...x...', c: '....x.......x...' },
  };

  function kompiliere(d) {
    const takt = d.takt || 16;
    const raster = d.raster || 2;
    const takte = d.akkorde.split('|').map((s) => s.trim().split(/\s+/));
    const laenge = takte.length * takt;
    const e = Array.from({ length: laenge }, () => []);
    const toks = d.melodie.replace(/\|/g, ' ').trim().split(/\s+/);
    for (let i = 0; i < toks.length && i * raster < laenge; i++) {
      if (toks[i] === '-' || toks[i] === '.') continue;
      let n = 1;
      while (toks[i + n] === '-') n++;
      const midi = notenNr(toks[i]);
      e[i * raster].push({ stimme: 'melodie', midi, dauer: n * raster });
      if (d.terz !== undefined) e[i * raster].push({ stimme: 'zweite', midi: terzDarunter(midi, d.terz), dauer: n * raster });
    }
    takte.forEach((teile, ti) => {
      const n = takt / teile.length;
      teile.forEach((name, ai) => {
        const a = akkord(name), s0 = ti * takt + ai * n;
        if (d.bass) bassStile[d.bass](e, s0, n, a, ti);
        if (d.begleitung) begleitStile[d.begleitung](e, s0, n, a, ti);
      });
      const muster = SCHLAGZEUG[d.schlagzeug];
      if (muster) for (const inst in muster) {
        const m = muster[inst];
        for (let s = 0; s < takt; s++) if (m[s % m.length] === 'x') e[ti * takt + s].push({ stimme: 'trommel', inst });
      }
    });
    const st = Object.assign({
      melodie: { typ: 'puls25', laut: 0.12 },
      zweite: { typ: 'puls12', laut: 0.06 },
      bass: { typ: 'dreieck', laut: 0.3 },
      begleitung: { typ: 'puls12', laut: 0.045 },
      akkord: { typ: 'puls25', laut: 0.045 },
    }, d.stimmen);
    return { d, laenge, takt, e, st, schritt: 60 / d.bpm / 4 };
  }

  // ---------- Sequenzer ----------
  function spieleSchritt(l, i, t) {
    const { st, schritt } = l.k;
    for (const ev of l.k.e[i]) {
      const dauer = ev.dauer * schritt;
      switch (ev.stimme) {
        case 'melodie':
          A.ton({ typ: st.melodie.typ, freq: hz(ev.midi), start: t, dauer: dauer * 0.9, laut: st.melodie.laut, an: 0.006, ab: 0.12, halt: 0.62, frei: 0.09, vibrato: 0.011, filter: st.melodie.filter, ziel: l.echo });
          break;
        case 'zweite':
          A.ton({ typ: st.zweite.typ, freq: hz(ev.midi), start: t, dauer: dauer * 0.9, laut: st.zweite.laut, an: 0.006, ab: 0.12, halt: 0.6, frei: 0.08, vibrato: 0.01, pan: -0.3, ziel: l.gain });
          break;
        case 'bass':
          A.ton({ typ: st.bass.typ, freq: hz(ev.midi), start: t, dauer: dauer * 0.88, laut: st.bass.laut, an: 0.003, ab: 0.06, halt: 0.75, frei: 0.04, filter: st.bass.filter, ziel: l.gain });
          break;
        case 'begleitung':
          A.ton({ typ: st.begleitung.typ, freq: hz(ev.midi), start: t, dauer: dauer * 0.7, laut: st.begleitung.laut, an: 0.002, ab: 0.05, halt: 0.35, frei: 0.03, pan: -0.25, ziel: l.gain });
          break;
        case 'akkord':
          A.ton({ typ: st.akkord.typ, freq: hz(ev.midis[0]), arp: ev.midis.map(hz), start: t, dauer: dauer * 0.85, laut: st.akkord.laut * (ev.flaeche ? 0.8 : 1), an: ev.flaeche ? 0.08 : 0.004, ab: 0.1, halt: ev.flaeche ? 0.8 : 0.45, frei: ev.flaeche ? 0.25 : 0.05, pan: 0.25, ziel: l.gain });
          break;
        case 'trommel':
          trommeln[ev.inst](t, l.gain);
          break;
      }
    }
  }

  function takt() {
    if (!lied || !A.bereit || A.ctx.state !== 'running') return;
    const c = A.ctx;
    if (lied.naechste < c.currentTime - 0.2) lied.naechste = c.currentTime + 0.02; // nach Aussetzern nicht nachholen
    while (lied && lied.naechste < c.currentTime + 0.12) {
      spieleSchritt(lied, lied.pos, lied.naechste);
      lied.naechste += lied.k.schritt;
      lied.pos++;
      if (lied.pos >= lied.k.laenge) {
        if (lied.schleife) lied.pos = 0;
        else {
          const danach = lied.danach, marke = liedMarke;
          const rest = Math.max(0, (lied.naechste - c.currentTime) * 1000);
          lied = null;
          if (danach) setTimeout(() => { if (marke === liedMarke) danach(); }, rest);
        }
      }
    }
  }

  // Musik starten. optionen: schleife, danach (Rückruf), ab (Taktnummer)
  A.spieleLied = (name, optionen = {}) => {
    A.stoppeLied();
    liedMarke++;
    if (!A.bereit) {
      if (optionen.schleife !== false && BJ.lieder[name].schleife !== false) wunsch = { name, optionen };
      return;
    }
    const k = kompiliert[name] || (kompiliert[name] = kompiliere(BJ.lieder[name]));
    const c = A.ctx;
    const gain = c.createGain(); gain.connect(musikBus);
    // Echo nur für die Melodie
    const echo = c.createGain(); echo.connect(gain);
    const verz = c.createDelay(1); verz.delayTime.value = Math.min(0.9, k.schritt * 3);
    const rueck = c.createGain(); rueck.gain.value = 0.3;
    const tief = c.createBiquadFilter(); tief.type = 'lowpass'; tief.frequency.value = 2200;
    const nass = c.createGain(); nass.gain.value = 0.32;
    echo.connect(verz); verz.connect(tief); tief.connect(rueck); rueck.connect(verz); tief.connect(nass); nass.connect(gain);
    const schleife = optionen.schleife !== undefined ? optionen.schleife : k.d.schleife !== false;
    lied = { name, k, gain, echo, pos: ((optionen.ab || 0) * k.takt) % k.laenge, naechste: c.currentTime + 0.05, schleife, danach: optionen.danach };
  };

  A.stoppeLied = (blende = 0.12) => {
    wunsch = null;
    if (!lied) return;
    const g = lied.gain;
    lied = null;
    if (A.bereit) {
      const t = A.ctx.currentTime;
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0, t + blende);
      setTimeout(() => g.disconnect(), blende * 1000 + 600);
    }
  };

  A.liedName = () => (lied ? lied.name : wunsch ? wunsch.name : null);
  A.liedTakt = () => (lied ? Math.floor(lied.pos / lied.k.takt) : 0);

  // ---------- Geräusche ----------
  const fx = {
    sprung: () => A.ton({ typ: 'puls25', freq: 330, gleiten: 990, dauer: 0.14, laut: 0.12, ab: 0.1, halt: 0.5 }),
    supersprung() {
      A.ton({ typ: 'puls25', freq: 260, gleiten: 1500, dauer: 0.24, laut: 0.12, ab: 0.15, halt: 0.5 });
      A.ton({ typ: 'puls12', freq: 520, gleiten: 3000, dauer: 0.22, laut: 0.05, ab: 0.1, halt: 0.4, start: A.ctx.currentTime + 0.02 });
    },
    huepfer: () => A.ton({ typ: 'puls25', freq: 440, gleiten: 700, dauer: 0.08, laut: 0.1 }),
    gleiten() {
      A.ton({ typ: 'dreieck', freq: 720, gleiten: 520, dauer: 0.09, laut: 0.13, ab: 0.06, halt: 0.3 });
      A.rauschen({ dauer: 0.1, laut: 0.035, filter: 'bandpass', freq: 2400, freqEnde: 900 });
    },
    landen: () => A.rauschen({ dauer: 0.06, laut: 0.04, filter: 'lowpass', freq: 600 }),
    bombe() {
      const t = A.ctx.currentTime;
      A.ton({ typ: 'puls12', freq: 1046, start: t, dauer: 0.05, laut: 0.12, ab: 0.04, halt: 0.5 });
      A.ton({ typ: 'puls12', freq: 1568, start: t + 0.05, dauer: 0.07, laut: 0.12, ab: 0.05, halt: 0.4 });
    },
    brennend(n = 0) {
      const t = A.ctx.currentTime, basis = 72 + Math.min(n, 23) * 0.5;
      [0, 4, 7, 12].forEach((iv, i) => A.ton({ typ: 'puls25', freq: hz(basis + iv), start: t + i * 0.035, dauer: 0.06, laut: 0.1, ab: 0.05, halt: 0.4 }));
      A.ton({ typ: 'sinus', freq: hz(basis + 24), start: t + 0.12, dauer: 0.25, laut: 0.06, ab: 0.2, halt: 0.2, frei: 0.2 });
    },
    muenzeDa() {
      const t = A.ctx.currentTime;
      [84, 88, 91, 96].forEach((m, i) => A.ton({ typ: 'sinus', freq: hz(m), start: t + i * 0.06, dauer: 0.12, laut: 0.07, ab: 0.1, halt: 0.3, frei: 0.1 }));
    },
    power() {
      const t = A.ctx.currentTime;
      [60, 64, 67, 72, 76, 79, 84, 88].forEach((m, i) => A.ton({ typ: 'puls25', freq: hz(m), start: t + i * 0.04, dauer: 0.07, laut: 0.11 }));
      A.rauschen({ start: t, dauer: 0.4, laut: 0.07, filter: 'bandpass', freq: 600, freqEnde: 6000, q: 2 });
    },
    gegnerMuenze(i = 0) {
      const t = A.ctx.currentTime, m = 76 + Math.min(i, 9) * 2;
      A.ton({ typ: 'puls25', freq: hz(m), start: t, dauer: 0.05, laut: 0.12 });
      A.ton({ typ: 'puls25', freq: hz(m + 7), start: t + 0.05, dauer: 0.05, laut: 0.12 });
      A.ton({ typ: 'puls12', freq: hz(m + 12), start: t + 0.1, dauer: 0.12, laut: 0.1, ab: 0.1, halt: 0.3 });
    },
    bonus() {
      const t = A.ctx.currentTime;
      [67, 71, 74, 79, 83].forEach((m, i) => A.ton({ typ: 'puls25', freq: hz(m), start: t + i * 0.05, dauer: 0.09, laut: 0.1 }));
      A.ton({ typ: 'sinus', freq: hz(91), start: t + 0.25, dauer: 0.5, laut: 0.08, ab: 0.4, halt: 0.2, frei: 0.3 });
    },
    extraleben() {
      const t = A.ctx.currentTime;
      [[72, 0], [76, 0.09], [79, 0.18], [84, 0.27], [79, 0.4], [84, 0.49]].forEach(([m, d], i) =>
        A.ton({ typ: 'puls25', freq: hz(m), start: t + d, dauer: i === 5 ? 0.4 : 0.08, laut: 0.12, vibrato: 0.01 }));
    },
    sonder() {
      const t = A.ctx.currentTime;
      for (let i = 0; i < 12; i++) A.ton({ typ: 'sinus', freq: hz(96 - i * 2 + (i % 2) * 7), start: t + i * 0.04, dauer: 0.1, laut: 0.07, ab: 0.08, halt: 0.3, frei: 0.1 });
      fx.bonus();
    },
    erscheinen: () => A.ton({ typ: 'sinus', freq: 180, gleiten: 520, dauer: 0.35, laut: 0.06, ab: 0.3, halt: 0.6, vibrato: 0.08 }),
    verwandlung() {
      A.rauschen({ dauer: 0.18, laut: 0.12, filter: 'bandpass', freq: 1500, freqEnde: 300 });
      A.ton({ typ: 'dreieck', freq: 600, gleiten: 180, dauer: 0.15, laut: 0.14 });
    },
    tod() {
      A.ton({ typ: 'puls25', freq: 1200, gleiten: 90, gleitZeit: 0.9, dauer: 0.95, laut: 0.14, ab: 0.3, halt: 0.8, vibrato: 0.06 });
      A.rauschen({ dauer: 0.5, laut: 0.12, filter: 'lowpass', freq: 3000, freqEnde: 200 });
    },
    menue: () => A.ton({ typ: 'puls12', freq: 880, dauer: 0.04, laut: 0.08 }),
    ok() {
      const t = A.ctx.currentTime;
      A.ton({ typ: 'puls25', freq: 660, start: t, dauer: 0.05, laut: 0.1 });
      A.ton({ typ: 'puls25', freq: 990, start: t + 0.06, dauer: 0.08, laut: 0.1 });
    },
    zurueck() {
      const t = A.ctx.currentTime;
      A.ton({ typ: 'puls25', freq: 660, start: t, dauer: 0.05, laut: 0.09 });
      A.ton({ typ: 'puls25', freq: 440, start: t + 0.06, dauer: 0.07, laut: 0.09 });
    },
    tick: () => A.ton({ typ: 'puls12', freq: 1760, dauer: 0.02, laut: 0.05 }),
    tippen: () => A.ton({ typ: 'puls12', freq: 1200, dauer: 0.03, laut: 0.07 }),
    feuerwerk() {
      A.rauschen({ dauer: 0.5, laut: 0.05, filter: 'lowpass', freq: 1800, freqEnde: 200 });
    },
  };
  A.effekt = (name, wert) => {
    if (!A.bereit || !BJ.einstellungen.effekte || A.ctx.state !== 'running') return;
    fx[name](wert);
  };
})();
