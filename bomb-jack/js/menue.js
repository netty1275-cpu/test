/* Bomb Jack Remake – Titelbild, Anleitung, Optionen, Bestenliste und Namenseingabe */
'use strict';
(() => {
  const G = BJ.gfx, P = BJ.partikel, A = BJ.audio, E = BJ.eingabe;
  BJ.szenen = BJ.szenen || {};
  const MITTE = BJ.B / 2;
  const titelText = (ctx, text, x, y, groesse, farbe = '#ffffff') =>
    G.text(ctx, text, x, y, { font: `${groesse}px ${BJ.SCHRIFT_TITEL}`, ausrichtung: 'center', grundlinie: 'middle', farbe, umriss: G.UMRISS, umrissBreite: groesse * 0.14, schatten: 'rgba(0,0,0,.45)', schattenY: groesse * 0.07, abstand: 2 });
  const tafel = (ctx, x, y, b, h) => {
    G.rund(ctx, x, y, b, h, 24);
    ctx.fillStyle = 'rgba(12,8,32,.88)'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.14)'; ctx.stroke();
  };
  const fussnote = (ctx, text) => G.text(ctx, text, MITTE, 690, { font: BJ.schrift(700, 16), ausrichtung: 'center', farbe: '#a79fdc' });

  // Gemeinsamer Hintergrund aller Menüs: Titelbild mit Sternenfunkeln und Feuerwerk
  const himmel = { raketen: [], naechste: 1 };
  const himmelSchritt = (dt) => {
    himmel.naechste -= dt;
    if (himmel.naechste <= 0 && !BJ.wenigBewegung) {
      himmel.naechste = BJ.zufall(1.4, 3);
      himmel.raketen.push({ x: BJ.zufall(140, BJ.B - 140), y: BJ.H, vy: -BJ.zufall(420, 560), ziel: BJ.zufall(90, 300), farbe: BJ.eines(['#ffd23f', '#ff6fd8', '#5ef0ff', '#7dff9a', '#ff8a5c']) });
    }
    for (let i = himmel.raketen.length - 1; i >= 0; i--) {
      const r = himmel.raketen[i];
      r.y += r.vy * dt;
      if (Math.random() < 0.6) P.funken(r.x, r.y + 6, 1, '#ffcf8a', 30, 0.35, 2, 40);
      if (r.y <= r.ziel) {
        himmel.raketen.splice(i, 1);
        P.funken(r.x, r.y, 46, r.farbe, 250, 1.2, 3.4, 70);
        P.sterne(r.x, r.y, 6, '#ffffff', 120);
        P.ring(r.x, r.y, r.farbe, 90, 0.6);
      }
    }
    P.schritt(dt);
  };
  const himmelZeichnen = (ctx, t, dunkel = 0) => {
    ctx.drawImage(BJ.kulissen.titelbild(), 0, 0, BJ.B, BJ.H);
    BJ.kulissen.funkeln(ctx, t, BJ.B, BJ.H * 0.6, 26, 11);
    for (const r of himmel.raketen) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      G.male(ctx, G.licht('#ffe2a8'), r.x, r.y, false, 0.6);
      ctx.restore();
    }
    P.zeichne(ctx);
    if (dunkel) { ctx.fillStyle = `rgba(5,3,18,${dunkel})`; ctx.fillRect(0, 0, BJ.B, BJ.H); }
  };
  const musikTitel = () => { if (A.liedName() !== 'titel') A.spieleLied('titel'); };
  const tasteMusik = () => {
    if (!E.neu('musik')) return;
    BJ.einstellungen.musik = !BJ.einstellungen.musik;
    BJ.speichereEinstellungen();
    A.setzeMusik();
  };

  // ---------- Titelbild ----------
  const PUNKTE = [['SPIEL STARTEN', 'spiel'], ['ANLEITUNG', 'anleitung'], ['BESTENLISTE', 'bestenliste'], ['OPTIONEN', 'optionen']];
  const titel = { wahl: 0, leerlauf: 0, zeit: 0, felder: [] };
  BJ.szenen.titel = {
    betreten() {
      titel.leerlauf = 0;
      P.leeren();
      musikTitel();
    },
    schritt(dt) {
      titel.zeit += dt;
      titel.leerlauf += dt;
      himmelSchritt(dt);
      tasteMusik();
      if (E.irgendeine()) titel.leerlauf = 0;
      if (E.neu('hoch')) { titel.wahl = (titel.wahl + PUNKTE.length - 1) % PUNKTE.length; A.effekt('menue'); }
      if (E.neu('runter')) { titel.wahl = (titel.wahl + 1) % PUNKTE.length; A.effekt('menue'); }
      if (E.neu('ok')) waehlen();
      if (titel.leerlauf > 30) BJ.wechsle('bestenliste', { vorfuehrung: true });
    },
    zeichne(ctx, t) {
      himmelZeichnen(ctx, t);
      // Jack fliegt in einem Bogen über das Logo von einer Seite zur anderen
      const bahn = (u) => [MITTE + Math.sin(u) * 500, 440 - 360 * Math.abs(Math.cos(u))];
      const [x, y] = bahn(t * 0.45), [x2, y2] = bahn(t * 0.45 + 0.01);
      const pose = y2 < y - 0.3 ? 'steigen' : 'schweben';
      G.male(ctx, G.jack(pose, t * 2.2), x, y + 30, x2 < x, 1.25);
      // Bomben links und rechts vom Logo, eine davon brennt
      [[170, 196, 1.5], [262, 236, 1.0], [1018, 236, 1.0], [1110, 196, 1.5]].forEach(([bx, by, s], i) => {
        const yb = by + Math.sin(t * 1.6 + i) * 8;
        G.male(ctx, G.bombe(), bx, yb, false, s);
        if (i === Math.floor(t / 1.5) % 4) G.zuendfunke(ctx, bx + G.ZUENDER.x * s, yb + G.ZUENDER.y * s, t);
      });
      const puls = 1 + Math.sin(t * 2.2) * 0.015;
      G.male(ctx, G.logo(150), MITTE, 222 + Math.sin(t * 1.3) * 4, false, puls);
      G.text(ctx, 'REMAKE', MITTE, 266, { font: BJ.schrift(800, 22), ausrichtung: 'center', farbe: '#ffe9a0', abstand: 16, umriss: G.UMRISS, umrissBreite: 5 });

      titel.felder = [];
      PUNKTE.forEach(([text], i) => {
        const y = 352 + i * 58, an = i === titel.wahl;
        ctx.font = BJ.schrift(800, 30);
        const b = ctx.measureText(text).width + 70;
        titel.felder.push({ x: MITTE - b / 2, y: y - 25, b, h: 50 });
        if (an) {
          G.rund(ctx, MITTE - b / 2, y - 25, b, 50, 25);
          ctx.fillStyle = G.linear(ctx, 0, y - 25, 0, y + 25, [[0, '#fff2a8'], [1, '#ffb52e']]);
          ctx.fill();
          ctx.lineWidth = 3; ctx.strokeStyle = G.UMRISS; ctx.stroke();
          const wipp = Math.sin(t * 6) * 3;
          G.male(ctx, G.bombe(), MITTE - b / 2 - 30 - wipp, y + 2, false, 0.9);
          G.male(ctx, G.bombe(), MITTE + b / 2 + 30 + wipp, y + 2, true, 0.9);
        }
        G.text(ctx, text, MITTE, y + 2, { font: BJ.schrift(800, 30), ausrichtung: 'center', grundlinie: 'middle', farbe: an ? '#2b1a05' : '#ffffff', umriss: an ? null : G.UMRISS, umrissBreite: 6 });
      });

      const liste = BJ.bestenliste();
      G.text(ctx, `REKORD  ${BJ.zahl(liste[0].punkte)}  ·  ${liste[0].name}`, MITTE, 606, { font: BJ.schrift(800, 22), ausrichtung: 'center', farbe: '#ffd23f', umriss: G.UMRISS, umrissBreite: 6 });
      G.text(ctx, '↑ ↓ auswählen  ·  Enter bestätigen  ·  M Musik  ·  F Vollbild', MITTE, 648, { font: BJ.schrift(700, 17), ausrichtung: 'center', farbe: '#ece7ff', umriss: G.UMRISS, umrissBreite: 5 });
      G.text(ctx, 'Fan-Remake, inspiriert vom Arcade-Klassiker Bomb Jack (Tehkan, 1984)', MITTE, 692, { font: BJ.schrift(500, 15), ausrichtung: 'center', farbe: '#a79fdc' });

      if (BJ.nurTouch) hinweisBand(ctx, t, 'Dieses Spiel wird mit der Tastatur gespielt.');
      else if (!document.hasFocus()) hinweisBand(ctx, t, 'Klicke ins Spiel, damit es auf die Tastatur hört.');
    },
    zeiger(x, y, art) {
      const i = titel.felder.findIndex((f) => BJ.trifft({ x, y, b: 1, h: 1 }, f));
      if (i < 0) return;
      if (i !== titel.wahl && art === 'bewegen') { titel.wahl = i; A.effekt('menue'); }
      if (art === 'klick') { titel.wahl = i; waehlen(); }
    },
  };
  const waehlen = () => {
    A.effekt('ok');
    const ziel = PUNKTE[titel.wahl][1];
    if (ziel === 'spiel') BJ.wechsle('spiel', { runde: BJ.klemme(BJ.einstellungen.startrunde, 1, freigeschaltet()) - 1 });
    else BJ.wechsle(ziel, {});
  };
  const freigeschaltet = () => BJ.klemme(BJ.speicher.lesen('freigeschaltet', 1), 1, BJ.RUNDEN.length);
  const hinweisBand = (ctx, t, text) => {
    ctx.globalAlpha = 0.75 + Math.sin(t * 4) * 0.25;
    G.rund(ctx, MITTE - 330, 8, 660, 40, 20);
    ctx.fillStyle = '#ffd23f'; ctx.fill();
    G.text(ctx, text, MITTE, 29, { font: BJ.schrift(800, 19), ausrichtung: 'center', grundlinie: 'middle', farbe: '#2b1a05' });
    ctx.globalAlpha = 1;
  };

  // ---------- Anleitung ----------
  const anleitung = { seite: 0 };
  const SEITEN = ['So wird gespielt', 'Bomben und Münzen', 'Die Gegner'];
  BJ.szenen.anleitung = {
    betreten() { anleitung.seite = 0; musikTitel(); },
    schritt(dt) {
      himmelSchritt(dt);
      tasteMusik();
      if (E.neu('rechts')) { anleitung.seite = Math.min(SEITEN.length - 1, anleitung.seite + 1); A.effekt('menue'); }
      if (E.neu('links')) { anleitung.seite = Math.max(0, anleitung.seite - 1); A.effekt('menue'); }
      if (E.neu('ok')) {
        if (anleitung.seite < SEITEN.length - 1) { anleitung.seite++; A.effekt('menue'); } else { A.effekt('zurueck'); BJ.wechsle('titel'); }
      }
      if (E.neu('zurueck')) { A.effekt('zurueck'); BJ.wechsle('titel'); }
    },
    zeichne(ctx, t) {
      himmelZeichnen(ctx, t, 0.35);
      tafel(ctx, 120, 40, 1040, 620);
      titelText(ctx, SEITEN[anleitung.seite].toUpperCase(), MITTE, 98, 58, '#ffd23f');
      [seite1, seite2, seite3][anleitung.seite](ctx, t);
      for (let i = 0; i < SEITEN.length; i++) {
        G.oval(ctx, MITTE - 24 + i * 24, 628, 6, 6);
        ctx.fillStyle = i === anleitung.seite ? '#ffd23f' : 'rgba(255,255,255,.25)'; ctx.fill();
      }
      fussnote(ctx, '← → blättern  ·  Enter weiter  ·  Esc zurück');
    },
  };
  const absatz = (ctx, text, x, y, o = {}) => G.text(ctx, text, x, y, Object.assign({ font: BJ.schrift(500, 21), farbe: '#ece7ff' }, o));
  const seite1 = (ctx, t) => {
    G.male(ctx, G.jack('schweben', t * 2), 300, 330, false, 2.4);
    for (let i = 0; i < 4; i++) {
      const w = t * 0.8 + (i * Math.PI) / 2;
      G.male(ctx, G.bombe(), 300 + Math.cos(w) * 120, 280 + Math.sin(w) * 90, false, 1.2);
    }
    G.zuendfunke(ctx, 300 + Math.cos(t * 0.8) * 120 + G.ZUENDER.x * 1.2, 280 + Math.sin(t * 0.8) * 90 + G.ZUENDER.y * 1.2, t);
    absatz(ctx, 'Sammle in jeder Runde alle 24 Bomben ein.', 500, 170, { font: BJ.schrift(800, 24), farbe: '#ffffff' });
    absatz(ctx, 'Eine Berührung mit einem Gegner kostet ein Leben.', 500, 202);
    const zeilen = [
      [['←', '→'], 'laufen und in der Luft lenken'],
      [['Leertaste'], 'springen'],
      [['↑', '+', 'Leertaste'], 'Supersprung bis ganz nach oben'],
      [['↓', '+', 'Leertaste'], 'kleiner Hüpfer'],
      [['Leertaste'], 'in der Luft: Sprung anhalten'],
      [['Leertaste', 'Leertaste'], 'beim Fallen antippen: schweben'],
      [['P', 'M', 'F'], 'Pause, Musik, Vollbild'],
    ];
    zeilen.forEach(([tasten, text], i) => {
      const y = 246 + i * 50;
      let x = 500;
      for (const tk of tasten) {
        if (tk === '+') { G.text(ctx, '+', x + 2, y + 20, { font: BJ.schrift(800, 20), farbe: '#ece7ff' }); x += 22; continue; }
        x += G.taste(ctx, x, y, tk, { font: BJ.schrift(800, 16), hoehe: 30, mindest: 32 }) + 8;
      }
      absatz(ctx, text, Math.max(x + 10, 760), y + 22);
    });
  };
  const seite2 = (ctx, t) => {
    G.male(ctx, G.bombe(), 220, 190, false, 1.6);
    G.zuendfunke(ctx, 220 + G.ZUENDER.x * 1.6, 190 + G.ZUENDER.y * 1.6, t);
    absatz(ctx, 'Nach jeder eingesammelten Bombe zündet die nächste in der Reihe.', 290, 176, { font: BJ.schrift(800, 21), farbe: '#ffffff' });
    absatz(ctx, 'Brennende Bomben zählen doppelt. Folgst du der Zündreihenfolge,', 290, 206);
    absatz(ctx, 'gibt es am Rundenende einen Bonus:', 290, 236);
    [['20', '10.000'], ['21', '20.000'], ['22', '30.000'], ['23', '50.000']].forEach(([n, p], i) => {
      const x = 290 + i * 200;
      G.rund(ctx, x, 256, 180, 44, 12); ctx.fillStyle = 'rgba(255,210,63,.14)'; ctx.fill();
      G.text(ctx, `${n} →`, x + 16, 285, { font: BJ.schrift(800, 20), farbe: '#ffd23f' });
      G.text(ctx, p, x + 166, 285, { font: BJ.schrift(800, 20), ausrichtung: 'right', farbe: '#ffffff' });
    });
    const muenzen = [
      ['P', 'Power', 'Alle Gegner werden kurz zu Münzen. Schnapp sie dir!'],
      ['B', 'Bonus', 'Erhöht den Punkte-Multiplikator bis ×5.'],
      ['E', 'Extra', 'Ein zusätzliches Leben.'],
      ['S', 'Sonder', 'Sonderbonus: 10.000 Punkte mal Multiplikator.'],
    ];
    muenzen.forEach(([z, name, text], i) => {
      const y = 360 + i * 56;
      G.male(ctx, G.muenze(z, 0), 220, y, false, 1.25);
      G.text(ctx, name, 262, y + 8, { font: `28px ${BJ.SCHRIFT_TITEL}`, farbe: G.MUENZ_FARBEN[z][1], umriss: G.UMRISS, umrissBreite: 4, abstand: 1 });
      absatz(ctx, text, 380, y + 8);
    });
    absatz(ctx, 'Die Power-Leiste füllt sich mit jeder Bombe. Ist sie voll, erscheint das P.', MITTE, 596, { ausrichtung: 'center', farbe: '#c9c2ee', font: BJ.schrift(500, 19) });
  };
  const GEGNER = [
    ['mumie', 'Mumie', 'Läuft über die Plattformen.', 'Unten angekommen verwandelt sie sich.'],
    ['vogel', 'Vogel', 'Verfolgt dich hartnäckig', 'quer durchs ganze Bild.'],
    ['kugel', 'Kugel', 'Prallt schräg von Wänden', 'und Plattformen ab.'],
    ['ufo', 'UFO', 'Kreuzt, zielt kurz', 'und stürzt sich auf dich.'],
    ['irrlicht', 'Irrlicht', 'Schwebt in Wellen hin und her', 'und folgt deiner Höhe.'],
    ['hornisse', 'Hornisse', 'Schwirrt unberechenbar', 'um dich herum.'],
  ];
  const seite3 = (ctx, t) => {
    GEGNER.forEach(([typ, name, z1, z2], i) => {
      const x = 170 + (i % 2) * 500, y = 190 + Math.floor(i / 2) * 140;
      G.rund(ctx, x - 20, y - 50, 460, 120, 18); ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fill();
      const bild = G.gegner(typ, t * 1.5 + i * 0.3);
      G.male(ctx, bild, x + 50, typ === 'mumie' ? y + 38 : y + 8, false, 1.7);
      G.text(ctx, name, x + 120, y - 6, { font: `32px ${BJ.SCHRIFT_TITEL}`, farbe: '#ffffff', umriss: G.UMRISS, umrissBreite: 5, abstand: 1 });
      absatz(ctx, z1, x + 120, y + 26, { font: BJ.schrift(500, 19) });
      absatz(ctx, z2, x + 120, y + 50, { font: BJ.schrift(500, 19), farbe: '#c9c2ee' });
    });
  };

  // ---------- Optionen ----------
  const optionen = { wahl: 0, sicher: false, felder: [] };
  const STUFEN = ['Leicht', 'Normal', 'Schwer'];
  const vollbildAn = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  BJ.vollbild = () => {
    try {
      if (vollbildAn()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else {
        const el = document.documentElement, f = el.requestFullscreen || el.webkitRequestFullscreen;
        const r = f && f.call(el);
        if (r && r.catch) r.catch(() => {});
      }
    } catch (e) { /* Vollbild ist hier nicht erlaubt */ }
  };
  const OPTIONEN = [
    { name: 'Musik', wert: () => (BJ.einstellungen.musik ? 'An' : 'Aus'), aendern() { BJ.einstellungen.musik = !BJ.einstellungen.musik; A.setzeMusik(); } },
    { name: 'Soundeffekte', wert: () => (BJ.einstellungen.effekte ? 'An' : 'Aus'), aendern() { BJ.einstellungen.effekte = !BJ.einstellungen.effekte; A.setzeEffekte(); } },
    { name: 'Lautstärke', regler: () => BJ.einstellungen.lautstaerke / 10, aendern(r = 1) { BJ.einstellungen.lautstaerke = BJ.klemme(BJ.einstellungen.lautstaerke + r, 0, 10); A.setzeLautstaerke(); } },
    { name: 'Schwierigkeit', wert: () => STUFEN[BJ.einstellungen.schwierigkeit], aendern(r = 1) { BJ.einstellungen.schwierigkeit = (BJ.einstellungen.schwierigkeit + r + 3) % 3; } },
    { name: 'Startrunde', wert: () => `${BJ.klemme(BJ.einstellungen.startrunde, 1, freigeschaltet())} von ${freigeschaltet()}`, aendern(r = 1) { const n = freigeschaltet(); BJ.einstellungen.startrunde = ((BJ.klemme(BJ.einstellungen.startrunde, 1, n) - 1 + r + n) % n) + 1; } },
    { name: 'Retro-Bildschirm', wert: () => (BJ.einstellungen.scanlines ? 'An' : 'Aus'), aendern() { BJ.einstellungen.scanlines = !BJ.einstellungen.scanlines; } },
    { name: 'Vollbild', wert: () => (vollbildAn() ? 'An' : 'Aus'), aendern() { BJ.vollbild(); } },
    { name: 'Bestenliste zurücksetzen', knopf: true, aendern() {
      if (!optionen.sicher) { optionen.sicher = true; return; }
      BJ.speicher.schreiben('bestenliste', BJ.STANDARD_BESTENLISTE);
      optionen.sicher = false;
      optionen.gemeldet = 2;
    } },
    { name: 'Zurück', knopf: true, aendern() { BJ.wechsle('titel'); } },
  ];
  BJ.szenen.optionen = {
    betreten() { optionen.wahl = 0; optionen.sicher = false; optionen.gemeldet = 0; musikTitel(); },
    schritt(dt) {
      himmelSchritt(dt);
      optionen.gemeldet = Math.max(0, optionen.gemeldet - dt);
      const n = OPTIONEN.length;
      if (E.neu('hoch')) { optionen.wahl = (optionen.wahl + n - 1) % n; optionen.sicher = false; A.effekt('menue'); }
      if (E.neu('runter')) { optionen.wahl = (optionen.wahl + 1) % n; optionen.sicher = false; A.effekt('menue'); }
      const o = OPTIONEN[optionen.wahl];
      if (!o.knopf && (E.neu('links') || E.neu('rechts'))) { o.aendern(E.neu('links') ? -1 : 1); BJ.speichereEinstellungen(); A.effekt('menue'); }
      if (E.neu('ok')) { o.aendern(1); BJ.speichereEinstellungen(); A.effekt('ok'); }
      if (E.neu('zurueck')) { A.effekt('zurueck'); BJ.wechsle('titel'); }
    },
    zeichne(ctx, t) {
      himmelZeichnen(ctx, t, 0.35);
      tafel(ctx, 290, 40, 700, 620);
      titelText(ctx, 'OPTIONEN', MITTE, 98, 58, '#ffd23f');
      optionen.felder = [];
      OPTIONEN.forEach((o, i) => {
        const y = 170 + i * 52, an = i === optionen.wahl;
        optionen.felder.push({ x: 330, y: y - 22, b: 620, h: 44 });
        if (an) { G.rund(ctx, 330, y - 22, 620, 44, 22); ctx.fillStyle = 'rgba(255,210,63,.16)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#ffd23f'; ctx.stroke(); }
        let name = o.name;
        if (o.knopf && an && optionen.sicher) name = 'Wirklich zurücksetzen? Enter drücken';
        if (o.knopf && optionen.gemeldet > 0 && i === 7) name = 'Bestenliste zurückgesetzt';
        G.text(ctx, name, o.knopf ? MITTE : 360, y + 1, { font: BJ.schrift(800, 22), ausrichtung: o.knopf ? 'center' : 'left', grundlinie: 'middle', farbe: an ? '#ffffff' : '#d9d3f5' });
        if (o.regler) {
          for (let k = 0; k < 10; k++) {
            G.rund(ctx, 700 + k * 22, y - 10, 16, 20, 4);
            ctx.fillStyle = k < BJ.einstellungen.lautstaerke ? '#ffd23f' : 'rgba(255,255,255,.12)'; ctx.fill();
          }
        } else if (o.wert) {
          G.text(ctx, (an ? '‹  ' : '') + o.wert() + (an ? '  ›' : ''), 920, y + 1, { font: BJ.schrift(800, 22), ausrichtung: 'right', grundlinie: 'middle', farbe: an ? '#ffd23f' : '#ffffff' });
        }
      });
      fussnote(ctx, '↑ ↓ auswählen  ·  ← → ändern  ·  Enter umschalten  ·  Esc zurück');
    },
    zeiger(x, y, art) {
      const i = optionen.felder.findIndex((f) => BJ.trifft({ x, y, b: 1, h: 1 }, f));
      if (i < 0) return;
      if (art === 'bewegen' && i !== optionen.wahl) { optionen.wahl = i; optionen.sicher = false; }
      if (art === 'klick') { optionen.wahl = i; OPTIONEN[i].aendern(1); BJ.speichereEinstellungen(); A.effekt('ok'); }
    },
  };

  // ---------- Bestenliste ----------
  const liste = { markiert: -1, zeit: 0, vorfuehrung: false };
  BJ.szenen.bestenliste = {
    betreten(o) { liste.markiert = o.markiert === undefined ? -1 : o.markiert; liste.zeit = 0; liste.vorfuehrung = !!o.vorfuehrung; musikTitel(); },
    schritt(dt) {
      liste.zeit += dt;
      himmelSchritt(dt);
      tasteMusik();
      if (E.neu('ok') || E.neu('zurueck') || (liste.vorfuehrung && (E.irgendeine() || liste.zeit > 12))) { A.effekt('zurueck'); BJ.wechsle('titel'); }
    },
    zeichne(ctx, t) {
      himmelZeichnen(ctx, t, 0.35);
      tafel(ctx, 290, 40, 700, 620);
      titelText(ctx, 'BESTENLISTE', MITTE, 98, 58, '#ffd23f');
      G.text(ctx, 'PLATZ', 340, 156, { font: BJ.schrift(800, 14), farbe: '#a79fdc', abstand: 3 });
      G.text(ctx, 'NAME', 430, 156, { font: BJ.schrift(800, 14), farbe: '#a79fdc', abstand: 3 });
      G.text(ctx, 'RUNDE', 790, 156, { font: BJ.schrift(800, 14), ausrichtung: 'right', farbe: '#a79fdc', abstand: 3 });
      G.text(ctx, 'PUNKTE', 940, 156, { font: BJ.schrift(800, 14), ausrichtung: 'right', farbe: '#a79fdc', abstand: 3 });
      BJ.bestenliste().forEach((e, i) => {
        const y = 196 + i * 44, an = i === liste.markiert;
        if (an) { G.rund(ctx, 320, y - 24, 640, 40, 12); ctx.fillStyle = Math.floor(t * 4) % 2 ? 'rgba(255,210,63,.3)' : 'rgba(255,210,63,.16)'; ctx.fill(); }
        const farbe = an ? '#ffd23f' : i === 0 ? '#ffe9a0' : '#ece7ff';
        G.text(ctx, `${i + 1}.`, 372, y, { font: BJ.schrift(800, 22), ausrichtung: 'right', farbe });
        G.text(ctx, e.name, 430, y, { font: BJ.schrift(800, 22), farbe });
        G.text(ctx, String(e.runde), 790, y, { font: BJ.schrift(700, 22), ausrichtung: 'right', farbe });
        G.text(ctx, BJ.zahl(e.punkte), 940, y, { font: BJ.schrift(800, 22), ausrichtung: 'right', farbe });
      });
      fussnote(ctx, 'Enter oder Esc: zurück zum Titelbild');
    },
  };

  // ---------- Namenseingabe ----------
  const eingabe = { name: '', punkte: 0, runde: 1, platz: 0 };
  const ERLAUBT = /^[A-ZÄÖÜ0-9 .\-!]$/;
  BJ.szenen.name = {
    betreten(o) {
      Object.assign(eingabe, { name: BJ.speicher.lesen('letzterName', ''), punkte: o.punkte, runde: o.runde, platz: o.platz });
      E.textModus = true;
      E.zeichen();
      A.spieleLied('rekord', { danach: () => A.spieleLied('titel') });
      P.leeren();
    },
    verlassen() { E.textModus = false; },
    schritt(dt) {
      himmelSchritt(dt);
      for (const z of E.zeichen()) {
        if (z === 'Enter') { speichern(); return; }
        if (z === 'Escape') { eingabe.name = ''; continue; }
        if (z === 'Backspace') { eingabe.name = eingabe.name.slice(0, -1); A.effekt('tippen'); continue; }
        const g = z.toUpperCase();
        if (ERLAUBT.test(g) && eingabe.name.length < 12) { eingabe.name += g; A.effekt('tippen'); }
      }
    },
    zeichne(ctx, t) {
      himmelZeichnen(ctx, t, 0.3);
      tafel(ctx, 290, 90, 700, 520);
      titelText(ctx, 'NEUER REKORD!', MITTE, 160, 72, '#ffd23f');
      G.text(ctx, `Platz ${eingabe.platz + 1}  ·  ${BJ.zahl(eingabe.punkte)} Punkte  ·  Runde ${eingabe.runde}`, MITTE, 236, { font: BJ.schrift(800, 26), ausrichtung: 'center', farbe: '#ffffff' });
      G.text(ctx, 'Wie heißt du?', MITTE, 318, { font: BJ.schrift(700, 24), ausrichtung: 'center', farbe: '#c9c2ee' });
      G.rund(ctx, 400, 344, 480, 72, 18);
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fill();
      ctx.lineWidth = 3; ctx.strokeStyle = '#ffd23f'; ctx.stroke();
      const cursor = Math.floor(t * 2.5) % 2 ? '_' : ' ';
      G.text(ctx, eingabe.name + cursor, MITTE, 382, { font: BJ.schrift(800, 40), ausrichtung: 'center', grundlinie: 'middle', farbe: '#ffffff', abstand: 4 });
      G.text(ctx, 'Tippe deinen Namen und drücke Enter.', MITTE, 470, { font: BJ.schrift(500, 21), ausrichtung: 'center', farbe: '#ece7ff' });
      G.male(ctx, G.jack('jubel', t * 2.4), MITTE, 590, false, 1.5);
    },
  };
  const speichern = () => {
    const name = eingabe.name.trim() || 'JACK';
    BJ.speicher.schreiben('letzterName', name);
    const platz = BJ.eintragen(name, eingabe.punkte, eingabe.runde);
    A.effekt('ok');
    BJ.wechsle('bestenliste', { markiert: platz });
  };
})();
