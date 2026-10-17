/* Bomb Jack Remake – Spielablauf: Runden, Punkte, Gegner, Münzen und Anzeige */
'use strict';
(() => {
  const G = BJ.gfx, P = BJ.partikel, A = BJ.audio, F = BJ.FELD;
  const RUNDEN_BONUS = { 20: 10000, 21: 20000, 22: 30000, 23: 50000 };
  const MUENZ_WERTE = [100, 200, 300, 500, 800, 1200, 2000, 3000, 5000, 8000];
  const E_SCHWELLEN = [30000, 100000, 200000, 350000, 500000];
  const S_SCHWELLEN = [75000, 250000, 500000];
  const POWER_VOLL = 16;
  const schwelle = (liste, i, schritt) => (i < liste.length ? liste[i] : liste[liste.length - 1] + (i - liste.length + 1) * schritt);
  const bonusFuer = (n) => (n >= 20 ? RUNDEN_BONUS[Math.min(n, 23)] : 0);

  const S = (BJ.spiel = { aktiv: false });

  // ---------- Spielstart und Runden ----------
  S.neu = (startRunde = 0, stand) => {
    S.punkte = stand ? stand.punkte : 0;
    S.leben = stand ? stand.leben : BJ.einstellungen.schwierigkeit === 0 ? 5 : 3;
    S.multi = stand ? stand.multi : 1;
    S.power = 0;
    S.naechstesB = S.punkte + 5000;
    S.eNr = 0;
    S.sNr = 0;
    while (schwelle(E_SCHWELLEN, S.eNr, 200000) <= S.punkte) S.eNr++;
    while (schwelle(S_SCHWELLEN, S.sNr, 300000) <= S.punkte) S.sNr++;
    S.rekord = Math.max(BJ.rekord(), S.punkte);
    S.warteschlange = [];
    S.aktiv = true;
    S.pausiert = false;
    S.starteRunde(startRunde);
  };

  S.starteRunde = (nr) => {
    S.runde = BJ.baueRunde(nr);
    S.werte = BJ.rundenWerte(nr);
    S.welt = BJ.welten[S.runde.welt];
    S.brennend = null;
    S.brennendGezaehlt = 0;
    S.kette = 0;
    S.gegner = [];
    S.muenzen = [];
    S.muenzPause = 2;
    S.powerZeit = 0;
    S.powerKette = 0;
    S.einlass = 1.2;
    S.naechsterEingang = 0;
    S.jack = new BJ.Jack(S.runde.start.x, S.runde.start.y);
    S.phase = 'intro';
    S.phasenZeit = 0;
    S.introDauer = 2.4;
    S.iris = 0;
    S.schuetteln = 0;
    S.blitz = 0;
    S.zeitlupe = 0;
    S.meldung = null;
    S.bilanz = null;
    S.todLied = false;
    P.leeren();
    const frei = BJ.speicher.lesen('freigeschaltet', 1);
    if (nr % BJ.RUNDEN.length + 1 > frei) BJ.speicher.schreiben('freigeschaltet', nr % BJ.RUNDEN.length + 1);
    const welt = S.welt;
    A.spieleLied('rundeStart', { danach: () => { if (S.aktiv && S.welt === welt && (S.phase === 'intro' || S.phase === 'laeuft') && S.powerZeit <= 0) A.spieleLied(welt.lied); } });
  };

  // Stand für einen Neustart nach Aktualisierung der Seite
  S.stand = () => (S.aktiv && S.phase !== 'vorbei' ? { runde: S.runde.nr, punkte: S.punkte, leben: S.leben, multi: S.multi } : null);

  const melde = (text, farbe = '#ffffff', dauer = 1.4) => { S.meldung = { text, farbe, zeit: 0, dauer }; };

  S.punkteDazu = (n) => {
    S.punkte += n;
    if (S.punkte > S.rekord) S.rekord = S.punkte;
    if (S.punkte >= S.naechstesB) {
      if (S.multi < 5 && !S.warteschlange.includes('B') && !S.muenzen.some((m) => m.art === 'B')) S.warteschlange.push('B');
      S.naechstesB = S.punkte + 4000 * S.multi;
    }
    while (S.punkte >= schwelle(E_SCHWELLEN, S.eNr, 200000)) { S.eNr++; S.warteschlange.push('E'); }
    while (S.punkte >= schwelle(S_SCHWELLEN, S.sNr, 300000)) { S.sNr++; S.warteschlange.push('S'); }
  };

  const naechsteBombe = (index) => {
    const l = S.runde.bomben;
    for (let k = 1; k <= l.length; k++) {
      const b = l[(index + k) % l.length];
      if (!b.weg) return b;
    }
    return null;
  };

  S.sammleBombe = (b) => {
    b.weg = true;
    const warBrennend = b === S.brennend;
    b.warBrennend = warBrennend;
    let wert = warBrennend ? 200 : 100;
    if (warBrennend) { S.brennendGezaehlt++; S.kette++; } else S.kette = 0;
    wert *= S.multi;
    S.punkteDazu(wert);
    S.power += warBrennend ? 2 : 1;
    // Nach einer brennenden (oder der ersten) Bombe zündet die nächste in der Reihe
    if (warBrennend || !S.brennend) {
      if (S.brennend) S.brennend.brennend = false;
      S.brennend = naechsteBombe(b.index);
      if (S.brennend) S.brennend.brennend = true;
    }
    if (warBrennend) {
      P.funken(b.x, b.y, 20, '#ffcf4a', 230, 0.65, 3.5);
      P.ring(b.x, b.y, '#ffd86b', 48);
      P.text(b.x, b.y - 24, BJ.zahl(wert), '#ffd23f', 24);
      A.effekt('brennend', S.kette);
    } else {
      P.funken(b.x, b.y, 10, '#ff7a6b', 150, 0.45, 3);
      P.text(b.x, b.y - 24, BJ.zahl(wert), '#ffffff', 20);
      A.effekt('bombe');
    }
    P.rauch(b.x, b.y, 4, 'rgba(255,220,200,.35)', 40, 7);
    if (S.runde.bomben.every((x) => x.weg)) { S.zeitlupe = 0.45; S.blitz = 0.5; S.blitzFarbe = 'rgba(255,240,200,'; }
  };

  S.muenzeErscheint = (art) => {
    let x, y, versuch = 0;
    do { x = BJ.zufall(50, F.b - 50); y = BJ.zufall(40, 140); versuch++; } while (versuch < 30 && S.runde.plattformen.some((p) => BJ.kreisTrifft(x, y, 20, p)));
    S.muenzen.push(new BJ.Muenze(art, x, y));
    P.sterne(x, y, 8, '#fff3b0', 90);
    A.effekt('muenzeDa');
  };

  S.nimmMuenze = (m) => {
    P.sterne(m.x, m.y, 14, G.MUENZ_FARBEN[m.art][1], 160);
    P.ring(m.x, m.y, '#ffffff', 52);
    switch (m.art) {
      case 'P': S.powerStart(); break;
      case 'B':
        S.multi = Math.min(5, S.multi + 1);
        melde('BONUS ×' + S.multi, '#7fd4ff');
        A.effekt('bonus');
        break;
      case 'E':
        S.leben = Math.min(9, S.leben + 1);
        melde('EXTRALEBEN!', '#7dff9a');
        A.effekt('extraleben');
        break;
      case 'S': {
        const wert = 10000 * S.multi;
        S.punkteDazu(wert);
        P.text(m.x, m.y - 26, BJ.zahl(wert), '#ff9ae6', 28);
        melde('SONDERBONUS!', '#ff9ae6');
        A.effekt('sonder');
        break;
      }
    }
  };

  S.powerStart = () => {
    S.powerZeit = S.werte.powerDauer;
    S.powerKette = 0;
    S.blitz = 0.6;
    S.blitzFarbe = 'rgba(255,240,170,';
    for (const g of S.gegner) {
      g.zuMuenze();
      g.muenzRest = S.powerZeit;
      P.sterne(g.mx, g.my, 6, '#ffe066', 80);
    }
    if (A.liedName() === S.welt.lied) S.weltTakt = A.liedTakt();
    A.effekt('power');
    A.spieleLied('power');
    melde('POWER!', '#ffd23f');
  };

  S.powerEnde = () => {
    S.powerZeit = 0;
    for (const g of S.gegner) if (g.zustand === 'muenze') {
      g.zustand = 'aktiv';
      P.rauch(g.mx, g.my, 5, 'rgba(255,255,255,.4)');
    }
    A.spieleLied(S.welt.lied, { ab: S.weltTakt || 0 });
  };

  S.frissMuenze = (g) => {
    const wert = MUENZ_WERTE[Math.min(S.powerKette, MUENZ_WERTE.length - 1)] * S.multi;
    A.effekt('gegnerMuenze', S.powerKette);
    S.powerKette++;
    S.punkteDazu(wert);
    P.text(g.mx, g.my - 20, BJ.zahl(wert), '#ffe066', 22);
    P.sterne(g.mx, g.my, 10, '#ffe066', 140);
    P.ring(g.mx, g.my, '#ffe066', 40);
  };

  S.verwandle = (g) => {
    g.typ = BJ.eines(S.runde.flieger);
    g.y -= 22;
    g.vx = 0;
    g.vy = 0;
    g.bereit = false;
    g.modus = null;
    g.verwandeln = 0;
    P.rauch(g.x, g.y, 10, 'rgba(230,220,255,.6)', 70, 9);
    P.funken(g.x, g.y, 8, '#c9a6ff', 120);
    A.effekt('verwandlung');
  };

  // Neue Gegner durch die Eingänge hereinlassen
  const einlassen = (dt) => {
    if (S.powerZeit > 0) return;
    S.einlass -= dt;
    if (S.einlass > 0) return;
    if (S.gegner.length >= S.werte.maxGegner) { S.einlass = 0.5; return; }
    const e = S.runde.eingaenge[S.naechsterEingang++ % S.runde.eingaenge.length];
    const typ = Math.random() < S.werte.direkt ? BJ.eines(S.runde.flieger) : 'mumie';
    S.gegner.push(new BJ.Gegner(typ, e.x, typ === 'mumie' ? e.y : e.y - 20, S.werte.tempo));
    A.effekt('erscheinen');
    S.einlass = S.gegner.length < 2 ? 1.2 : S.werte.abstand;
  };

  // ---------- Ablauf je Phase ----------
  const laufen = (dt) => {
    const j = S.jack, R = S.runde;
    j.schritt(dt, R.plattformen);
    const box = j.sammelBox;
    for (const b of R.bomben) if (!b.weg && BJ.kreisTrifft(b.x, b.y, 12, box)) S.sammleBombe(b);
    if (S.brennend && Math.random() < dt * 14) P.funken(S.brennend.x + G.ZUENDER.x, S.brennend.y + G.ZUENDER.y, 1, '#ffc94a', 70, 0.4, 2.2, 140);

    for (let i = S.muenzen.length - 1; i >= 0; i--) {
      const m = S.muenzen[i];
      m.schritt(dt, R.plattformen);
      if (BJ.kreisTrifft(m.x, m.y, 15, box)) { S.muenzen.splice(i, 1); S.nimmMuenze(m); } else if (m.zeit >= m.leben) { S.muenzen.splice(i, 1); P.rauch(m.x, m.y, 6); }
    }

    if (S.powerZeit > 0) {
      S.powerZeit -= dt;
      for (const g of S.gegner) if (g.zustand === 'muenze') g.muenzRest = S.powerZeit;
      if (S.powerZeit <= 0) S.powerEnde();
    }

    einlassen(dt);
    const treffer = j.trefferBox;
    for (let i = S.gegner.length - 1; i >= 0; i--) {
      const g = S.gegner[i];
      g.schritt(dt, S);
      if (g.zustand === 'muenze') {
        if (BJ.kreisTrifft(g.mx, g.my, 16, box)) { S.gegner.splice(i, 1); S.frissMuenze(g); }
      } else if (g.zustand === 'aktiv' && j.schutz <= 0 && BJ.kreisTrifft(g.x, g.mitteY, g.radius, treffer)) {
        stirb();
        return;
      }
    }

    S.muenzPause = Math.max(0, S.muenzPause - dt);
    if (S.power >= POWER_VOLL && S.powerZeit <= 0 && !S.muenzen.some((m) => m.art === 'P') && !S.warteschlange.includes('P')) {
      S.power -= POWER_VOLL;
      S.warteschlange.push('P');
    }
    if (S.warteschlange.length && S.muenzPause <= 0) {
      const art = S.warteschlange[0];
      if (!S.muenzen.some((m) => m.art === art)) { S.warteschlange.shift(); S.muenzeErscheint(art); S.muenzPause = 1.2; }
    }

    if (R.bomben.every((b) => b.weg)) rundeGeschafft();
  };

  const stirb = () => {
    S.phase = 'tod';
    S.phasenZeit = 0;
    const j = S.jack;
    j.tot = true;
    j.vy = -380;
    j.drehung = 0;
    S.schuetteln = 1;
    S.blitz = 0.5;
    S.blitzFarbe = 'rgba(255,60,60,';
    A.stoppeLied(0.05);
    A.effekt('tod');
    P.sterne(j.x, j.y - 24, 12, '#ffffff', 160);
  };

  const sterben = (dt) => {
    S.jack.schritt(dt, S.runde.plattformen);
    if (S.phasenZeit > 0.9 && !S.todLied) { S.todLied = true; A.spieleLied('tod'); }
    if (S.phasenZeit < 2.5) return;
    S.leben--;
    if (S.leben <= 0) {
      S.phase = 'vorbei';
      S.phasenZeit = 0;
      A.spieleLied('gameover');
      return;
    }
    for (const g of S.gegner) P.rauch(g.x, g.mitteY, 6);
    S.gegner = [];
    S.powerZeit = 0;
    S.multi = 1;
    S.jack = new BJ.Jack(S.runde.start.x, S.runde.start.y);
    S.jack.schutz = 2;
    S.einlass = 1.6;
    S.phase = 'intro';
    S.introDauer = 1.5;
    S.phasenZeit = 0;
    S.iris = 1;
    S.todLied = false;
    A.spieleLied(S.welt.lied);
  };

  const rundeGeschafft = () => {
    S.phase = 'geschafft';
    S.phasenZeit = 0;
    S.jack.jubel = true;
    for (const g of S.gegner) { P.rauch(g.x, g.mitteY, 8, 'rgba(255,255,255,.5)'); P.funken(g.x, g.mitteY, 6, '#ffffff', 120); }
    S.gegner = [];
    for (const m of S.muenzen) if (m.art !== 'P') S.warteschlange.push(m.art);
    S.muenzen = [];
    S.powerZeit = 0;
    const n = S.brennendGezaehlt;
    S.bilanz = { brennend: n, bonus: bonusFuer(n), gezaehlt: 0, tick: 0 };
    A.spieleLied('rundeGeschafft');
  };

  const geschafft = (dt) => {
    const b = S.bilanz;
    S.jack.anim += dt;
    if (S.phasenZeit > 1.3 && b.gezaehlt < b.bonus) {
      const neu = Math.min(b.bonus, Math.round(b.gezaehlt + (b.bonus * dt) / 1.2));
      S.punkteDazu(neu - b.gezaehlt);
      b.gezaehlt = neu;
      b.tick -= dt;
      if (b.tick <= 0) { A.effekt('tick'); b.tick = 0.05; }
    }
    if (S.phasenZeit > 4.8) S.iris = Math.max(0, S.iris - dt * 1.8);
    if (S.phasenZeit > 5.5) {
      if (b.gezaehlt < b.bonus) S.punkteDazu(b.bonus - b.gezaehlt);
      S.starteRunde(S.runde.nr + 1);
    }
  };

  const vorbei = () => {
    if (S.phasenZeit > 5 || (S.phasenZeit > 1.5 && (BJ.eingabe.neu('ok') || BJ.eingabe.neu('sprung')))) {
      S.aktiv = false;
      const platz = BJ.platzFuer(S.punkte);
      if (platz >= 0 && S.punkte > 0) BJ.wechsle('name', { punkte: S.punkte, runde: S.runde.nr + 1, platz });
      else BJ.wechsle('bestenliste', {});
    }
  };

  // ---------- Pause ----------
  const PAUSE_PUNKTE = ['WEITERSPIELEN', 'ZUM TITELBILD'];
  S.pausieren = (an) => {
    if (S.pausiert === an) return;
    S.pausiert = an;
    S.pauseWahl = 0;
    BJ.eingabe.loslassen();
    A.anhalten(an);
  };
  const pauseSchritt = () => {
    const E = BJ.eingabe;
    if (E.neu('pause')) { S.pausieren(false); return; }
    if (E.neu('hoch') || E.neu('runter')) S.pauseWahl = 1 - S.pauseWahl;
    if (E.neu('ok')) {
      if (S.pauseWahl === 0) S.pausieren(false);
      else { S.pausieren(false); S.aktiv = false; A.stoppeLied(); BJ.wechsle('titel'); }
    }
  };

  S.schritt = (dt) => {
    if (S.pausiert) { pauseSchritt(); return; }
    const E = BJ.eingabe;
    if (E.neu('pause') && S.phase !== 'vorbei') { S.pausieren(true); return; }
    if (E.neu('musik')) {
      BJ.einstellungen.musik = !BJ.einstellungen.musik;
      BJ.speichereEinstellungen();
      A.setzeMusik();
      S.hinweis = { text: BJ.einstellungen.musik ? 'Musik an' : 'Musik aus', zeit: 0 };
    }
    if (S.hinweis) { S.hinweis.zeit += dt; if (S.hinweis.zeit > 1.6) S.hinweis = null; }
    S.phasenZeit += dt;
    S.schuetteln = Math.max(0, S.schuetteln - dt * 2.5);
    S.blitz = Math.max(0, S.blitz - dt * 2);
    if (S.meldung) { S.meldung.zeit += dt; if (S.meldung.zeit > S.meldung.dauer) S.meldung = null; }
    let zdt = dt;
    if (S.zeitlupe > 0) { S.zeitlupe -= dt; zdt = dt * 0.3; }
    switch (S.phase) {
      case 'intro':
        S.iris = Math.min(1, S.iris + dt * 1.5);
        S.jack.anim += dt;
        if (S.phasenZeit >= S.introDauer) { S.phase = 'laeuft'; S.phasenZeit = 0; melde('LOS!', '#ffd23f', 0.8); }
        break;
      case 'laeuft': laufen(zdt); break;
      case 'tod': sterben(dt); break;
      case 'geschafft': geschafft(dt); break;
      case 'vorbei': vorbei(dt); break;
    }
    P.schritt(zdt);
  };

  // ---------- Zeichnen ----------
  const beschriftung = (ctx, text, x, y) => G.text(ctx, text, x, y, { font: BJ.schrift(800, 14), farbe: '#a79fdc', abstand: 3 });

  const hud = (ctx, t) => {
    const R = S.runde, welt = S.welt;
    G.male(ctx, G.logo(46), 150, 80);
    G.text(ctx, 'REMAKE', 150, 104, { font: BJ.schrift(800, 13), ausrichtung: 'center', farbe: '#b9b0e6', abstand: 6 });

    beschriftung(ctx, 'PUNKTE', 44, 154);
    G.text(ctx, BJ.zahl(S.punkte), 256, 196, { font: BJ.schrift(800, 42), ausrichtung: 'right', farbe: '#ffffff', schatten: 'rgba(0,0,0,.45)' });
    beschriftung(ctx, 'REKORD', 44, 236);
    G.text(ctx, BJ.zahl(S.rekord), 256, 268, { font: BJ.schrift(800, 28), ausrichtung: 'right', farbe: '#ffd23f' });

    beschriftung(ctx, 'RUNDE', 44, 316);
    G.text(ctx, String(R.nr + 1), 256, 324, { font: BJ.schrift(800, 34), ausrichtung: 'right', farbe: '#ffffff' });
    G.text(ctx, welt.name, 44, 364, { font: `36px ${BJ.SCHRIFT_TITEL}`, farbe: welt.akzent, abstand: 1, umriss: G.UMRISS, umrissBreite: 4 });
    G.text(ctx, R.name + (R.durchgang ? ` · ${R.durchgang + 1}. Durchgang` : ''), 44, 388, { font: BJ.schrift(500, 16), farbe: '#c9c2ee' });

    beschriftung(ctx, 'BOMBEN', 44, 432);
    const bombe = G.bombe();
    R.bomben.forEach((b, i) => {
      const x = 62 + (i % 6) * 34, y = 462 + Math.floor(i / 6) * 34;
      if (b.weg) {
        ctx.globalAlpha = b.warBrennend ? 1 : 0.35;
        if (b.warBrennend) {
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5;
          G.male(ctx, G.licht('#ffb43a'), x, y, false, 1.1);
          ctx.restore();
        }
        G.oval(ctx, x, y, 9, 9);
        ctx.fillStyle = b.warBrennend ? '#ffd23f' : '#6b6488';
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        const blinkt = b.brennend && Math.floor(t * 6) % 2 === 0;
        G.male(ctx, bombe, x, y + 1, false, 0.62);
        if (blinkt) G.zuendfunke(ctx, x + G.ZUENDER.x * 0.62, y + 1 + G.ZUENDER.y * 0.62, t);
      }
    });
    G.text(ctx, 'Brennend gesammelt', 44, 612, { font: BJ.schrift(700, 16), farbe: '#c9c2ee' });
    G.text(ctx, String(S.brennendGezaehlt), 256, 614, { font: BJ.schrift(800, 26), ausrichtung: 'right', farbe: '#ffd23f' });
    const n = S.brennendGezaehlt;
    G.text(ctx, n >= 20 ? `Rundenbonus: ${BJ.zahl(bonusFuer(n))}` : `Rundenbonus ab 20 brennenden`, 44, 638, { font: BJ.schrift(500, 15), farbe: n >= 20 ? '#ffe9a0' : '#8f88bd' });
    G.text(ctx, 'P Pause  ·  M Musik  ·  F Vollbild', 150, 684, { font: BJ.schrift(700, 13), ausrichtung: 'center', farbe: '#7d76ab' });

    beschriftung(ctx, 'LEBEN', 1024, 66);
    const kopf = G.jackKopf();
    for (let i = 0; i < Math.min(S.leben, 6); i++) G.male(ctx, kopf, 1036 + i * 36, 104 + 38.5);
    if (S.leben > 6) G.text(ctx, '+' + (S.leben - 6), 1250, 112, { font: BJ.schrift(800, 18), ausrichtung: 'right', farbe: '#ffffff' });

    beschriftung(ctx, 'BONUS', 1024, 166);
    for (let k = 1; k <= 5; k++) {
      const x = 1024 + (k - 1) * 44, an = k <= S.multi;
      G.rund(ctx, x, 180, 38, 34, 8);
      ctx.fillStyle = an ? G.linear(ctx, 0, 180, 0, 214, [[0, '#fff2a8'], [1, '#e8a417']]) : 'rgba(255,255,255,.06)';
      ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = an ? '#7a4a05' : 'rgba(255,255,255,.12)'; ctx.stroke();
      G.text(ctx, '×' + k, x + 19, 198, { font: BJ.schrift(800, 18), ausrichtung: 'center', grundlinie: 'middle', farbe: an ? '#4a2a05' : '#5d5684' });
    }

    beschriftung(ctx, 'POWER', 1024, 254);
    const voll = Math.min(POWER_VOLL, S.power);
    for (let i = 0; i < POWER_VOLL; i++) {
      const x = 1024 + i * 13.3;
      G.rund(ctx, x, 266, 10.5, 22, 3);
      ctx.fillStyle = i < voll ? G.linear(ctx, 0, 266, 0, 288, [[0, '#ffe58a'], [1, '#ff7a1f']]) : 'rgba(255,255,255,.07)';
      ctx.fill();
    }
    const pDa = S.muenzen.some((m) => m.art === 'P') || S.warteschlange.includes('P');
    if (S.powerZeit > 0) {
      beschriftung(ctx, 'POWER-ZEIT', 1024, 318);
      G.rund(ctx, 1024, 328, 212, 12, 6); ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fill();
      G.rund(ctx, 1024, 328, 212 * BJ.klemme(S.powerZeit / S.werte.powerDauer, 0, 1), 12, 6);
      ctx.fillStyle = '#ffd23f'; ctx.fill();
    } else if (pDa) {
      ctx.globalAlpha = 0.6 + Math.sin(t * 6) * 0.4;
      G.text(ctx, 'Hol dir das P!', 1024, 320, { font: BJ.schrift(800, 18), farbe: '#ffd23f' });
      ctx.globalAlpha = 1;
    } else G.text(ctx, 'Bomben füllen die Leiste', 1024, 320, { font: BJ.schrift(500, 15), farbe: '#8f88bd' });

    beschriftung(ctx, 'STEUERUNG', 1024, 392);
    let y = 410;
    const zeile = (tasten, text) => {
      let x = 1024;
      for (const tk of tasten) {
        if (tk.startsWith('+')) { G.text(ctx, tk, x, y + 17, { font: BJ.schrift(700, 15), farbe: '#c9c2ee' }); x += 62; continue; }
        x += G.taste(ctx, x, y, tk) + 6;
      }
      G.text(ctx, text, 1236, y + 17, { font: BJ.schrift(700, 15), ausrichtung: 'right', farbe: '#ece7ff' });
      y += 38;
    };
    zeile(['←', '→'], 'laufen');
    zeile(['Leertaste'], 'springen');
    zeile(['↑', '+ Sprung'], 'ganz hoch');
    zeile(['↓', '+ Sprung'], 'kleiner Sprung');
    G.text(ctx, 'In der Luft erneut springen:', 1024, y + 12, { font: BJ.schrift(700, 15), farbe: '#c9c2ee' });
    G.text(ctx, 'anhalten und schweben', 1024, y + 32, { font: BJ.schrift(700, 15), farbe: '#ece7ff' });
    y += 58;
    G.text(ctx, 'Brennende Bomben der Reihe', 1024, y + 12, { font: BJ.schrift(500, 15), farbe: '#8f88bd' });
    G.text(ctx, 'nach holen bringt mehr Punkte.', 1024, y + 31, { font: BJ.schrift(500, 15), farbe: '#8f88bd' });
  };

  const iris = (ctx, x, y, offen) => {
    const r = BJ.rausKubisch(offen) * 980;
    ctx.beginPath();
    ctx.rect(-30, -30, F.b + 60, F.h + 60);
    ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2, true);
    ctx.fillStyle = '#05030f';
    ctx.fill();
  };

  const mitte = { x: F.b / 2, y: F.h / 2 };
  const grossText = (ctx, text, y, groesse, farbe, skala = 1) => {
    ctx.save();
    ctx.translate(mitte.x, y);
    ctx.scale(skala, skala);
    G.text(ctx, text, 0, 0, { font: `${groesse}px ${BJ.SCHRIFT_TITEL}`, ausrichtung: 'center', grundlinie: 'middle', farbe, umriss: G.UMRISS, umrissBreite: groesse * 0.14, schatten: 'rgba(0,0,0,.45)', schattenY: groesse * 0.08, abstand: 2 });
    ctx.restore();
  };

  const tafel = (ctx, x, y, b, h) => {
    G.rund(ctx, x, y, b, h, 20);
    ctx.fillStyle = 'rgba(12,8,32,.86)'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.stroke();
  };

  const zeichneMeldungen = (ctx, t) => {
    if (S.phase === 'intro') {
      const k = BJ.klemme(S.phasenZeit / 0.45, 0, 1);
      if (S.introDauer > 2) {
        grossText(ctx, 'RUNDE ' + (S.runde.nr + 1), mitte.y - 70, 92, '#ffffff', BJ.rausZurueck(k));
        grossText(ctx, S.welt.name, mitte.y + 10, 52, S.welt.akzent, BJ.rausZurueck(BJ.klemme((S.phasenZeit - 0.2) / 0.45, 0, 1)));
        G.text(ctx, `${S.runde.name} · ${S.welt.ort}`, mitte.x, mitte.y + 62, { font: BJ.schrift(700, 22), ausrichtung: 'center', farbe: '#f4efe6', umriss: G.UMRISS, umrissBreite: 5 });
      }
      if (Math.floor(t * 3) % 2 === 0) grossText(ctx, 'BEREIT?', mitte.y + 150, 44, '#ffd23f');
    }
    if (S.meldung) {
      const m = S.meldung, k = m.zeit / m.dauer;
      ctx.globalAlpha = k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1;
      grossText(ctx, m.text, mitte.y - 40 - k * 30, 70, m.farbe, BJ.rausZurueck(BJ.klemme(m.zeit / 0.25, 0, 1)));
      ctx.globalAlpha = 1;
    }
    if (S.phase === 'geschafft' && S.phasenZeit > 0.7) {
      const k = BJ.rausKubisch(BJ.klemme((S.phasenZeit - 0.7) / 0.4, 0, 1));
      ctx.save();
      ctx.globalAlpha = k;
      ctx.translate(0, (1 - k) * 40);
      tafel(ctx, 110, 190, 460, 280);
      grossText(ctx, 'RUNDE GESCHAFFT!', 245, 54, '#ffd23f');
      const b = S.bilanz;
      G.text(ctx, 'Brennende Bomben', 150, 318, { font: BJ.schrift(700, 24), farbe: '#ece7ff' });
      G.text(ctx, `${b.brennend} / 23`, 530, 318, { font: BJ.schrift(800, 28), ausrichtung: 'right', farbe: '#ffd23f' });
      G.text(ctx, 'Rundenbonus', 150, 362, { font: BJ.schrift(700, 24), farbe: '#ece7ff' });
      G.text(ctx, BJ.zahl(b.gezaehlt), 530, 362, { font: BJ.schrift(800, 28), ausrichtung: 'right', farbe: '#ffffff' });
      const fuss = b.bonus ? 'Stark! Weiter so.' : 'Ab 20 brennenden Bomben gibt es einen Bonus.';
      G.text(ctx, fuss, mitte.x, 420, { font: BJ.schrift(500, 18), ausrichtung: 'center', farbe: '#a79fdc' });
      ctx.restore();
    }
    if (S.phase === 'vorbei') {
      ctx.fillStyle = `rgba(5,3,15,${Math.min(0.6, S.phasenZeit * 0.6).toFixed(2)})`;
      ctx.fillRect(0, 0, F.b, F.h);
      const k = BJ.rausZurueck(BJ.klemme(S.phasenZeit / 0.6, 0, 1));
      grossText(ctx, 'SPIEL VORBEI', mitte.y - 40, 96, '#ff5a6a', k);
      G.text(ctx, `${BJ.zahl(S.punkte)} Punkte · Runde ${S.runde.nr + 1}`, mitte.x, mitte.y + 40, { font: BJ.schrift(800, 28), ausrichtung: 'center', farbe: '#ffffff', umriss: G.UMRISS, umrissBreite: 6 });
      if (S.phasenZeit > 1.5 && Math.floor(t * 2) % 2 === 0) G.text(ctx, 'Weiter mit Leertaste', mitte.x, mitte.y + 100, { font: BJ.schrift(700, 20), ausrichtung: 'center', farbe: '#c9c2ee' });
    }
  };

  const pauseBild = (ctx) => {
    ctx.fillStyle = 'rgba(5,3,15,.7)';
    ctx.fillRect(0, 0, BJ.B, BJ.H);
    ctx.save();
    ctx.translate(F.x, F.y);
    tafel(ctx, 140, 200, 400, 270);
    grossText(ctx, 'PAUSE', 262, 72, '#ffffff');
    PAUSE_PUNKTE.forEach((text, i) => {
      const y = 340 + i * 56, an = i === S.pauseWahl;
      if (an) { G.rund(ctx, 190, y - 24, 300, 46, 23); ctx.fillStyle = '#ffd23f'; ctx.fill(); }
      G.text(ctx, text, mitte.x, y, { font: BJ.schrift(800, 24), ausrichtung: 'center', grundlinie: 'middle', farbe: an ? '#2b1a05' : '#ece7ff' });
    });
    ctx.restore();
  };

  S.zeichne = (ctx, t) => {
    const R = S.runde;
    ctx.drawImage(BJ.kulissen.ebene(R.welt), 0, 0, BJ.B, BJ.H);
    ctx.save();
    let dx = 0, dy = 0;
    if (S.schuetteln > 0 && !BJ.wenigBewegung) { const s = S.schuetteln * 7; dx = BJ.zufall(-s, s); dy = BJ.zufall(-s, s); }
    ctx.translate(F.x + dx, F.y + dy);
    ctx.beginPath(); ctx.rect(0, 0, F.b, F.h); ctx.clip();
    ctx.drawImage(BJ.kulissen.rundenbild(R), 0, 0, F.b, F.h);
    if (S.welt.animiere) S.welt.animiere(ctx, t, F.b, F.h);

    const bombe = G.bombe();
    for (const b of R.bomben) {
      if (b.weg) continue;
      if (b.brennend) {
        const puls = 0.5 + Math.sin(t * 8) * 0.5, zittern = Math.sin(t * 40) * 0.8;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.35 + puls * 0.3;
        G.male(ctx, G.licht('#ff8a2a'), b.x, b.y + 2, false, 2.4);
        ctx.restore();
        G.male(ctx, bombe, b.x + zittern, b.y);
        G.zuendfunke(ctx, b.x + zittern + G.ZUENDER.x, b.y + G.ZUENDER.y, t);
      } else G.male(ctx, bombe, b.x, b.y);
    }
    for (const m of S.muenzen) m.zeichne(ctx, t);
    for (const g of S.gegner) g.zeichne(ctx, t);
    S.jack.zeichne(ctx);
    P.zeichne(ctx);
    if (S.blitz > 0) {
      ctx.fillStyle = (S.blitzFarbe || 'rgba(255,255,255,') + (S.blitz * (BJ.wenigBewegung ? 0.25 : 0.6)).toFixed(3) + ')';
      ctx.fillRect(0, 0, F.b, F.h);
    }
    if (S.iris < 1) iris(ctx, S.jack.x, S.jack.y - 24, S.iris);
    zeichneMeldungen(ctx, t);
    if (S.hinweis) G.text(ctx, S.hinweis.text, F.b - 16, 34, { font: BJ.schrift(800, 18), ausrichtung: 'right', farbe: '#ffffff', umriss: G.UMRISS, umrissBreite: 5 });
    ctx.restore();
    hud(ctx, t);
    if (S.pausiert) pauseBild(ctx);
  };

  // ---------- Szene ----------
  BJ.szenen = BJ.szenen || {};
  BJ.szenen.spiel = {
    betreten(o = {}) { S.neu(o.runde || 0, o.stand); },
    schritt: (dt) => S.schritt(dt),
    zeichne: (ctx, t) => S.zeichne(ctx, t),
    verlassen() { S.aktiv = false; S.pausiert = false; A.anhalten(false); },
  };
})();
