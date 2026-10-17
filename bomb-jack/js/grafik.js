/* Bomb Jack Remake – Grafik: Figuren, Gegenstände, Partikel und Schrift
   Alles wird mit Pfaden gezeichnet und in passender Auflösung zwischengespeichert. */
'use strict';
(() => {
  const G = (BJ.gfx = { skala: 1 });
  const UMRISS = '#1d0f2e';
  G.UMRISS = UMRISS;
  const TAU = Math.PI * 2;
  const cache = new Map();
  G.leeren = () => cache.clear();

  // Sprite in Bildschirmauflösung vorzeichnen. (ax, ay) = Ursprung der Figur im Sprite
  G.sprite = (schluessel, b, h, ax, ay, zeichner) => {
    let s = cache.get(schluessel);
    if (!s) {
      const k = G.skala;
      const c = document.createElement('canvas');
      c.width = Math.max(1, Math.ceil(b * k));
      c.height = Math.max(1, Math.ceil(h * k));
      const x = c.getContext('2d');
      x.scale(k, k);
      x.translate(ax, ay);
      zeichner(x);
      s = { bild: c, b, h, ax, ay };
      cache.set(schluessel, s);
    }
    return s;
  };
  G.male = (ctx, s, x, y, spiegeln, groesse = 1) => {
    if (spiegeln || groesse !== 1) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(spiegeln ? -groesse : groesse, groesse);
      ctx.drawImage(s.bild, -s.ax, -s.ay, s.b, s.h);
      ctx.restore();
    } else ctx.drawImage(s.bild, x - s.ax, y - s.ay, s.b, s.h);
  };

  // ---------- Zeichenhelfer ----------
  const oval = (ctx, x, y, rx, ry, rot = 0) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); };
  const rund = (ctx, x, y, b, h, r) => {
    r = Math.min(r, b / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + b, y, x + b, y + h, r);
    ctx.arcTo(x + b, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + b, y, r);
    ctx.closePath();
  };
  const fuell = (ctx, farbe, breite = 2, umriss = UMRISS) => {
    ctx.fillStyle = farbe; ctx.fill();
    if (breite) { ctx.lineWidth = breite; ctx.strokeStyle = umriss; ctx.lineJoin = 'round'; ctx.stroke(); }
  };
  const linear = (ctx, x0, y0, x1, y1, stops) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  };
  const radial = (ctx, x0, y0, r0, x1, y1, r1, stops) => {
    const g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    return g;
  };
  // Mehrere Glieder: erst alle Umrisse, dann alle Füllungen
  const glieder = (ctx, liste) => {
    ctx.lineCap = 'round';
    for (const [x1, y1, x2, y2, r] of liste) {
      ctx.strokeStyle = UMRISS; ctx.lineWidth = r * 2 + 3;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
    for (const [x1, y1, x2, y2, r, farbe] of liste) {
      ctx.strokeStyle = farbe; ctx.lineWidth = r * 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
  };
  const sternPfad = (ctx, x, y, aussen, innen, zacken, drehung = -Math.PI / 2) => {
    ctx.beginPath();
    for (let i = 0; i < zacken * 2; i++) {
      const r = i % 2 ? innen : aussen, w = drehung + (i * Math.PI) / zacken;
      ctx.lineTo(x + Math.cos(w) * r, y + Math.sin(w) * r);
    }
    ctx.closePath();
  };
  Object.assign(G, { oval, rund, fuell, linear, radial, glieder, sternPfad });

  // Text mit optionalem Umriss und Schatten
  G.text = (ctx, text, x, y, o = {}) => {
    ctx.font = o.font || BJ.schrift(800, 20);
    ctx.textAlign = o.ausrichtung || 'left';
    ctx.textBaseline = o.grundlinie || 'alphabetic';
    const abstand = 'letterSpacing' in ctx && o.abstand;
    if (abstand) ctx.letterSpacing = o.abstand + 'px';
    if (o.schatten) { ctx.fillStyle = o.schatten; ctx.fillText(text, x + (o.schattenX || 0), y + (o.schattenY === undefined ? 3 : o.schattenY)); }
    if (o.umriss) { ctx.lineJoin = 'round'; ctx.lineWidth = o.umrissBreite || 4; ctx.strokeStyle = o.umriss; ctx.strokeText(text, x, y); }
    ctx.fillStyle = o.farbe || '#fff';
    ctx.fillText(text, x, y);
    if (abstand) ctx.letterSpacing = '0px';
  };

  // Taste als kleine Tastenkappe, gibt die Breite zurück
  G.taste = (ctx, x, y, beschriftung, o = {}) => {
    ctx.font = o.font || BJ.schrift(800, 14);
    const b = Math.max(o.mindest || 26, ctx.measureText(beschriftung).width + 14), h = o.hoehe || 24;
    rund(ctx, x, y + 2, b, h, 6); ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fill();
    rund(ctx, x, y, b, h, 6); ctx.fillStyle = linear(ctx, 0, y, 0, y + h, [[0, '#f6f1ff'], [1, '#c9c1e6']]); ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = '#2b2150'; ctx.stroke();
    G.text(ctx, beschriftung, x + b / 2, y + h / 2 + 1, { font: ctx.font, ausrichtung: 'center', grundlinie: 'middle', farbe: '#2b2150' });
    return b;
  };

  // ---------- Bomb Jack ----------
  // Winkel: 0 = nach unten, positiv = nach vorn (Blickrichtung), ±π = nach oben
  const POSEN = {
    stehen: (s) => ({ bv: 0.05, bh: -0.05, av: 0.2, ah: -0.2, hub: s * 0.5, cw: -0.55 + s * 0.06, cl: 24, cb: 18 }),
    laufen: (s, c) => ({ bv: s * 0.8, bh: -s * 0.8, av: -s * 0.9 + 0.15, ah: s * 0.9 + 0.15, hub: -Math.abs(c) * 2.2, cw: -1.2 + s * 0.1, cl: 25, cb: 18 }),
    steigen: (s) => ({ bv: -0.12, bh: -0.42, av: 2.75, ah: -2.75, hub: 0, cw: -0.42 + s * 0.08, cl: 29, cb: 15 }),
    fallen: (s) => ({ bv: 0.28, bh: -0.22, av: 2.0, ah: -1.9, hub: 0, cw: -2.62 + s * 0.08, cl: 29, cb: 24 }),
    schweben: (s) => ({ bv: 0.1, bh: -0.1, av: 2.45, ah: -2.45, hub: s * 0.4, cw: Math.PI, cl: 31, cb: 42 }),
    jubel: (s) => ({ bv: 0.08, bh: -0.08, av: 2.7 + s * 0.15, ah: -2.7 - s * 0.15, hub: -Math.abs(s) * 3, cw: -0.6 + s * 0.08, cl: 24, cb: 18 }),
    tod: (s) => ({ bv: 0.6, bh: -0.5, av: 2.2 + s * 0.3, ah: -2.0 - s * 0.3, hub: 0, cw: -2.4, cl: 24, cb: 20 }),
  };

  function umhang(ctx, p, ph) {
    const ax = -2, ay = -28;
    const w = p.cw, L = p.cl, B = p.cb;
    const dx = Math.sin(w), dy = Math.cos(w);
    const px = Math.cos(w), py = -Math.sin(w);
    const ex = ax + dx * L, ey = ay + dy * L;
    const pkt = [];
    for (let i = 0; i <= 6; i++) {
      const u = i / 6 - 0.5;
      const welle = Math.sin(ph * TAU + i * 1.3) * 2.6;
      pkt.push([ex + px * u * B + dx * welle, ey + py * u * B + dy * welle]);
    }
    ctx.beginPath();
    ctx.moveTo(ax - px * 4.5, ay - py * 4.5);
    ctx.quadraticCurveTo(ax - px * B * 0.32 + dx * L * 0.5, ay - py * B * 0.32 + dy * L * 0.5, pkt[0][0], pkt[0][1]);
    for (let i = 1; i < pkt.length; i++) {
      const mx = (pkt[i - 1][0] + pkt[i][0]) / 2, my = (pkt[i - 1][1] + pkt[i][1]) / 2;
      ctx.quadraticCurveTo(pkt[i - 1][0], pkt[i - 1][1], mx, my);
    }
    ctx.lineTo(pkt[6][0], pkt[6][1]);
    ctx.quadraticCurveTo(ax + px * B * 0.32 + dx * L * 0.5, ay + py * B * 0.32 + dy * L * 0.5, ax + px * 4.5, ay + py * 4.5);
    ctx.closePath();
    fuell(ctx, linear(ctx, ax, ay, ex, ey, [[0, '#ff6a55'], [0.55, '#e3233b'], [1, '#9c0d2a']]));
    // Falten
    ctx.strokeStyle = 'rgba(90,0,25,.45)';
    ctx.lineWidth = 1.4;
    for (const u of [-0.18, 0.16]) {
      ctx.beginPath();
      ctx.moveTo(ax + px * u * 6, ay + py * u * 6);
      ctx.quadraticCurveTo(ax + dx * L * 0.5 + px * u * B * 0.6, ay + dy * L * 0.5 + py * u * B * 0.6, ex + px * u * B * 0.8, ey + py * u * B * 0.8);
      ctx.stroke();
    }
  }

  function bein(ctx, x, y, w, hinten) {
    const L = 13;
    const sx = Math.sin(w), cy = Math.cos(w);
    const ex = x + sx * L, ey = y + cy * L;
    const bx = x + sx * L * 0.58, by = y + cy * L * 0.58;
    const fx = ex + cy * 3.6, fy = ey - sx * 3.6;
    const anzug = hinten ? '#1c3d9e' : '#2a5fd8', stiefel = hinten ? '#b8142e' : '#ec2a43';
    glieder(ctx, [[x, y, ex, ey, 3.8, anzug], [bx, by, ex, ey, 4.3, stiefel], [ex, ey, fx, fy, 3.4, stiefel]]);
  }

  function arm(ctx, x, y, w, hinten) {
    const L = 12.5, ex = x + Math.sin(w) * L, ey = y + Math.cos(w) * L;
    glieder(ctx, [[x, y, ex, ey, 3.3, hinten ? '#1c3d9e' : '#2a5fd8']]);
    oval(ctx, ex, ey, 3.9, 3.9);
    fuell(ctx, hinten ? '#d9dcef' : '#ffffff', 1.8);
  }

  function rumpf(ctx) {
    rund(ctx, -8.5, -31, 17, 19, 6.5);
    fuell(ctx, linear(ctx, -8, -31, 8, -12, [[0, '#5a90ff'], [0.55, '#2a5fd8'], [1, '#1c3d9e']]));
    ctx.fillStyle = '#ffd23f';
    ctx.fillRect(-7.6, -17.6, 15.2, 3.6);
    ctx.lineWidth = 1.2; ctx.strokeStyle = UMRISS;
    ctx.strokeRect(-7.6, -17.6, 15.2, 3.6);
    ctx.fillStyle = '#fff3b0';
    ctx.fillRect(1.6, -17.9, 3.8, 4.2);
    sternPfad(ctx, 2.6, -24.2, 4.2, 1.9, 5);
    fuell(ctx, '#ffd23f', 1.2);
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-5, -27); ctx.quadraticCurveTo(-6.5, -22, -5.5, -19); ctx.stroke();
  }

  function kopf(ctx, tot) {
    const kx = 1, ky = -38.5, r = 10.5;
    oval(ctx, kx, ky, r, r);
    fuell(ctx, radial(ctx, kx - 3, ky - 4, 1, kx, ky, r + 2, [[0, '#7aa6ff'], [0.5, '#2f66e0'], [1, '#1c3d9e']]));
    // Maskenspitzen
    ctx.beginPath(); ctx.moveTo(kx - 6, ky - 7); ctx.lineTo(kx - 8.5, ky - 14.5); ctx.lineTo(kx - 1.5, ky - 9.6); ctx.closePath();
    fuell(ctx, '#2a5fd8', 1.6);
    // Gesicht
    ctx.save();
    oval(ctx, kx, ky, r - 1.1, r - 1.1); ctx.clip();
    oval(ctx, kx + 4.6, ky + 2.6, 7.6, 7.2);
    ctx.fillStyle = linear(ctx, kx, ky - 4, kx, ky + 10, [[0, '#ffe3c4'], [1, '#f2b483']]);
    ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(29,15,46,.6)'; ctx.stroke();
    ctx.restore();
    ctx.lineWidth = 1.4; ctx.strokeStyle = UMRISS; ctx.lineCap = 'round';
    if (tot) {
      for (const ax of [kx + 2.8, kx + 7.4]) {
        ctx.beginPath();
        ctx.moveTo(ax - 1.8, ky - 1.6); ctx.lineTo(ax + 1.8, ky + 2.2);
        ctx.moveTo(ax + 1.8, ky - 1.6); ctx.lineTo(ax - 1.8, ky + 2.2);
        ctx.stroke();
      }
      oval(ctx, kx + 5.4, ky + 5.8, 1.6, 1.9); ctx.fillStyle = UMRISS; ctx.fill();
      return;
    }
    oval(ctx, kx + 7.3, ky + 0.4, 2.5, 3.3); fuell(ctx, '#fff', 1.1);
    oval(ctx, kx + 2.7, ky + 0.4, 2.3, 3.2); fuell(ctx, '#fff', 1.1);
    oval(ctx, kx + 8, ky + 0.9, 1.3, 1.8); ctx.fillStyle = UMRISS; ctx.fill();
    oval(ctx, kx + 3.4, ky + 0.9, 1.2, 1.7); ctx.fill();
    ctx.fillStyle = '#fff';
    oval(ctx, kx + 8.4, ky + 0.2, 0.5, 0.5); ctx.fill();
    ctx.beginPath(); ctx.arc(kx + 5.6, ky + 4.6, 2.3, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(kx - 1, ky - 1, r - 3.2, 1.05 * Math.PI, 1.45 * Math.PI); ctx.stroke();
  }

  function zeichneJack(ctx, pose, ph) {
    const s = Math.sin(ph * TAU), c = Math.cos(ph * TAU);
    const p = POSEN[pose](s, c);
    ctx.save();
    ctx.translate(0, p.hub);
    umhang(ctx, p, ph);
    bein(ctx, -3, -14, p.bh, true);
    arm(ctx, -6.5, -26.5, p.ah, true);
    rumpf(ctx);
    bein(ctx, 3, -14, p.bv, false);
    kopf(ctx, pose === 'tod');
    arm(ctx, 6.5, -26.5, p.av, false);
    ctx.restore();
  }
  const JACK_BILDER = 8;
  G.jack = (pose, ph) => {
    const f = Math.floor((((ph % 1) + 1) % 1) * JACK_BILDER);
    return G.sprite(`jack:${pose}:${f}`, 84, 92, 42, 66, (ctx) => zeichneJack(ctx, pose, f / JACK_BILDER));
  };
  // Kopf für die Lebensanzeige; Mitte des Kopfes liegt bei (x + 1, y - 38.5)
  G.jackKopf = () => G.sprite('jackkopf', 32, 34, 15, 55, (ctx) => kopf(ctx, false));

  // ---------- Gegner ----------
  function zeichneMumie(ctx, ph) {
    const s = Math.sin(ph * TAU);
    const hell = '#efe3c2', dunkel = '#c9b88f';
    glieder(ctx, [[-4, -12, -4 - s * 3.5, 0, 4, dunkel], [4, -12, 4 + s * 3.5, 0, 4, hell]]);
    glieder(ctx, [[-2, -26, 13, -24 + s, 3.4, dunkel]]);
    rund(ctx, -10, -30, 20, 20, 7);
    fuell(ctx, linear(ctx, -10, -30, 10, -10, [[0, '#fff6dc'], [1, dunkel]]));
    ctx.save();
    rund(ctx, -10, -30, 20, 20, 7); ctx.clip();
    ctx.strokeStyle = 'rgba(120,96,60,.55)'; ctx.lineWidth = 1.3;
    for (let i = -40; i < 20; i += 5) { ctx.beginPath(); ctx.moveTo(-12, i + 4); ctx.lineTo(12, i - 4); ctx.stroke(); }
    ctx.restore();
    oval(ctx, 1, -35, 9, 8.5);
    fuell(ctx, linear(ctx, -8, -44, 10, -26, [[0, '#fff6dc'], [1, dunkel]]));
    ctx.save();
    oval(ctx, 1, -35, 9, 8.5); ctx.clip();
    ctx.strokeStyle = 'rgba(120,96,60,.5)'; ctx.lineWidth = 1.2;
    for (let i = -46; i < -24; i += 4.5) { ctx.beginPath(); ctx.moveTo(-9, i + 3); ctx.lineTo(11, i - 2); ctx.stroke(); }
    ctx.restore();
    rund(ctx, -2.5, -37.6, 12.5, 5, 2.2); ctx.fillStyle = '#2a1a1a'; ctx.fill();
    ctx.save();
    ctx.shadowColor = '#ff2a1a'; ctx.shadowBlur = 6;
    ctx.fillStyle = '#ff5a3d';
    oval(ctx, 2.6, -35.2, 1.7, 1.6); ctx.fill();
    oval(ctx, 7.2, -35.2, 1.7, 1.6); ctx.fill();
    ctx.restore();
    glieder(ctx, [[2, -25, 16, -23 - s, 3.6, hell]]);
    ctx.lineCap = 'round';
    ctx.strokeStyle = UMRISS; ctx.lineWidth = 4.5;
    const binde = () => { ctx.beginPath(); ctx.moveTo(-7, -37); ctx.quadraticCurveTo(-13, -33 + s * 2, -19, -37 - s * 3); ctx.stroke(); };
    binde(); ctx.strokeStyle = hell; ctx.lineWidth = 2.5; binde();
  }

  function fluegel(ctx, x, y, f, hinten) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.3 - f * 0.9);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-6, -14, -19, -12);
    ctx.quadraticCurveTo(-13, -7, -15, -2);
    ctx.quadraticCurveTo(-7, -1, 0, 4);
    ctx.closePath();
    fuell(ctx, hinten ? '#8e2bb0' : '#ea6ae6');
    ctx.strokeStyle = 'rgba(29,15,46,.4)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(-13, -8); ctx.moveTo(-3, 1); ctx.lineTo(-11, -2); ctx.stroke();
    ctx.restore();
  }
  function zeichneVogel(ctx, ph) {
    const f = Math.sin(ph * TAU);
    for (let i = -1; i <= 1; i++) { oval(ctx, -15, 2 + i * 3, 7.5, 2.6, i * 0.35 + 0.15); fuell(ctx, '#7a1fa2', 1.6); }
    fluegel(ctx, -2, -5, f, true);
    oval(ctx, 0, 0, 14, 11.5);
    fuell(ctx, radial(ctx, -3, -5, 1, 0, 0, 15, [[0, '#ff9ae6'], [0.45, '#d145d6'], [1, '#7a1fa2']]));
    ctx.save(); oval(ctx, 0, 0, 13, 10.5); ctx.clip();
    oval(ctx, 4, 6, 8.5, 6); ctx.fillStyle = 'rgba(255,214,245,.85)'; ctx.fill();
    ctx.restore();
    oval(ctx, 7, -4, 4.4, 4.8); fuell(ctx, '#fff', 1.4);
    oval(ctx, 8.6, -3.4, 2, 2.4); ctx.fillStyle = UMRISS; ctx.fill();
    ctx.strokeStyle = UMRISS; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(3, -10); ctx.lineTo(11.5, -7.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, -2.5); ctx.lineTo(21.5, 1); ctx.lineTo(12, 4.5); ctx.closePath();
    fuell(ctx, '#ffb020', 1.6);
    ctx.beginPath(); ctx.moveTo(12.5, 1); ctx.lineTo(20, 1); ctx.lineWidth = 1; ctx.stroke();
    fluegel(ctx, -1, -3, f, false);
    ctx.strokeStyle = '#ff9f1c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-2, 11); ctx.lineTo(-3, 15); ctx.moveTo(3, 11); ctx.lineTo(3, 15); ctx.stroke();
  }

  function zeichneKugel(ctx, ph) {
    const w = ph * TAU;
    oval(ctx, 0, 0, 26, 26);
    ctx.fillStyle = radial(ctx, 0, 0, 8, 0, 0, 26, [[0, 'rgba(90,220,255,.45)'], [1, 'rgba(90,220,255,0)']]);
    ctx.fill();
    const ring = (von, bis) => {
      ctx.save(); ctx.rotate(-0.4);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.ellipse(0, 0, 22, 6.5, 0, von, bis);
      ctx.strokeStyle = UMRISS; ctx.lineWidth = 5.6; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 0, 22, 6.5, 0, von, bis);
      ctx.strokeStyle = '#ffe36b'; ctx.lineWidth = 2.8; ctx.stroke();
      const pw = w % TAU;
      if (pw > von && pw < bis) {
        ctx.fillStyle = '#fff';
        oval(ctx, Math.cos(pw) * 22, Math.sin(pw) * 6.5, 2.4, 2.4); ctx.fill();
      }
      ctx.restore();
    };
    ring(Math.PI, TAU);
    oval(ctx, 0, 0, 14, 14);
    fuell(ctx, radial(ctx, -5, -5, 1, 0, 0, 15, [[0, '#ffffff'], [0.25, '#8ff2ff'], [0.62, '#20a8e8'], [1, '#1239a0']]));
    ctx.save(); oval(ctx, 0, 0, 13, 13); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 2;
    for (let k = 0; k < 3; k++) {
      const x = ((w / TAU) * 30 + k * 10) % 30 - 15;
      ctx.beginPath(); ctx.ellipse(x, 0, 4, 14, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    oval(ctx, 2, 0.5, 5.4, 5.4); fuell(ctx, '#fff6c9', 1.4);
    oval(ctx, 2.6, 0.5, 1.5, 4.2); ctx.fillStyle = UMRISS; ctx.fill();
    ring(0, Math.PI);
    oval(ctx, -5.5, -6.5, 3, 2, -0.6); ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
  }

  function zeichneUfo(ctx, ph) {
    oval(ctx, 0, 9, 20, 12);
    ctx.fillStyle = radial(ctx, 0, 8, 2, 0, 9, 20, [[0, 'rgba(255,240,150,.5)'], [1, 'rgba(255,240,150,0)']]);
    ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -2, 10.5, 11, 0, Math.PI, TAU); ctx.closePath();
    fuell(ctx, radial(ctx, -4, -9, 1, 0, -3, 12, [[0, 'rgba(255,255,255,.95)'], [0.35, 'rgba(160,240,255,.75)'], [1, 'rgba(40,140,200,.75)']]), 1.8);
    oval(ctx, 0, -5.5, 5, 4.6); fuell(ctx, '#7dff6a', 1.2);
    ctx.fillStyle = UMRISS;
    oval(ctx, -2, -5.5, 1.4, 2); ctx.fill();
    oval(ctx, 2, -5.5, 1.4, 2); ctx.fill();
    ctx.strokeStyle = '#7dff6a'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, -12.5); ctx.stroke();
    oval(ctx, 0, 1, 21, 7.5);
    fuell(ctx, linear(ctx, 0, -6, 0, 9, [[0, '#ffffff'], [0.45, '#b8c0de'], [1, '#4a5078']]));
    oval(ctx, 0, 2.5, 20, 3.2); ctx.strokeStyle = 'rgba(29,15,46,.5)'; ctx.lineWidth = 1.2; ctx.stroke();
    const farben = ['#ff4d6d', '#ffd23f', '#5ef0ff'];
    const schritt = Math.floor(ph * 6);
    for (let i = 0; i < 5; i++) {
      const x = -15 + i * 7.5;
      ctx.fillStyle = farben[(i + schritt) % 3];
      ctx.save(); ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 5;
      oval(ctx, x, 3.2, 1.9, 1.6); ctx.fill();
      ctx.restore();
    }
    oval(ctx, 0, 7, 7.5, 2.2); fuell(ctx, '#3a3f60', 1.2);
  }

  function zeichneIrrlicht(ctx, ph) {
    const w = ph * TAU;
    oval(ctx, 0, 0, 28, 28);
    ctx.fillStyle = radial(ctx, 0, 0, 6, 0, 0, 28, [[0, 'rgba(120,255,200,.45)'], [1, 'rgba(120,255,200,0)']]);
    ctx.fill();
    const koerper = (k) => {
      ctx.beginPath();
      ctx.moveTo(-12 * k, 2 * k);
      ctx.bezierCurveTo(-13 * k, -8 * k, -6 * k, (-10 + Math.sin(w) * 2) * k, (-10 + Math.sin(w * 2) * 3) * k, -22 * k);
      ctx.bezierCurveTo(-2 * k, -16 * k, 8 * k, -14 * k, 11 * k, -4 * k);
      ctx.bezierCurveTo(14 * k, 6 * k, 6 * k, 13 * k, -1 * k, 13 * k);
      ctx.bezierCurveTo(-8 * k, 13 * k, -12 * k, 9 * k, -12 * k, 2 * k);
      ctx.closePath();
    };
    koerper(1);
    fuell(ctx, radial(ctx, 2, 3, 1, 1, 0, 19, [[0, '#ffffff'], [0.3, '#b6ffd9'], [0.68, '#36e09b'], [1, '#0f8f7a']]), 2, '#0b3b3a');
    ctx.save(); ctx.translate(1, 3); koerper(0.55); ctx.fillStyle = 'rgba(240,255,248,.65)'; ctx.fill(); ctx.restore();
    ctx.fillStyle = '#0b2e2a';
    oval(ctx, 0.5, 0, 2.2, 3.3); ctx.fill();
    oval(ctx, 6.5, 0, 2.2, 3.3); ctx.fill();
    ctx.fillStyle = '#d9fff0';
    oval(ctx, 1.2, -1, 0.8, 0.8); ctx.fill();
    oval(ctx, 7.2, -1, 0.8, 0.8); ctx.fill();
    oval(ctx, 3.8, 6.2, 1.7, 2.2); ctx.fillStyle = '#0b2e2a'; ctx.fill();
  }

  function zeichneHornisse(ctx, ph) {
    const flatter = Math.sin(ph * TAU * 3);
    const fluegelH = (rot) => {
      ctx.save(); ctx.translate(-1, -7); ctx.rotate(rot);
      oval(ctx, -6, -6, 9.5, 4.5, -0.45);
      ctx.fillStyle = 'rgba(215,240,255,.6)'; ctx.fill();
      ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(29,15,46,.65)'; ctx.stroke();
      ctx.restore();
    };
    fluegelH(-0.5 + flatter * 0.35);
    oval(ctx, -7, 2, 11, 8, 0.15);
    ctx.fillStyle = '#ffcc1f'; ctx.fill();
    ctx.save(); oval(ctx, -7, 2, 11, 8, 0.15); ctx.clip();
    ctx.fillStyle = UMRISS;
    for (const x of [-15, -9, -3]) ctx.fillRect(x, -10, 3.2, 24);
    ctx.restore();
    oval(ctx, -7, 2, 11, 8, 0.15); ctx.lineWidth = 2; ctx.strokeStyle = UMRISS; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-17, 4); ctx.lineTo(-24, 6.5); ctx.lineTo(-17, 7.5); ctx.closePath();
    ctx.fillStyle = UMRISS; ctx.fill();
    ctx.strokeStyle = UMRISS; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(2, 4); ctx.lineTo(0, 10); ctx.moveTo(5, 4); ctx.lineTo(5, 10); ctx.moveTo(8, 3); ctx.lineTo(10, 9);
    ctx.stroke();
    oval(ctx, 4, -1, 6, 5.5); fuell(ctx, '#4a3320', 1.8);
    oval(ctx, 10.5, -2, 5.6, 5.2); fuell(ctx, '#ffcc1f', 1.8);
    oval(ctx, 12.4, -3, 2.6, 3); ctx.fillStyle = '#c4152f'; ctx.fill();
    oval(ctx, 13, -3.8, 0.8, 0.8); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(11.5, -6.5); ctx.quadraticCurveTo(13, -11, 17, -12.5); ctx.moveTo(9, -6.5); ctx.quadraticCurveTo(9.5, -11, 13, -13.5);
    ctx.strokeStyle = UMRISS; ctx.lineWidth = 1.3; ctx.stroke();
    fluegelH(-0.15 - flatter * 0.35);
  }

  const GEGNER = {
    mumie: { f: zeichneMumie, b: 64, h: 64, ax: 32, ay: 50 },
    vogel: { f: zeichneVogel, b: 64, h: 56, ax: 30, ay: 28 },
    kugel: { f: zeichneKugel, b: 60, h: 60, ax: 30, ay: 30 },
    ufo: { f: zeichneUfo, b: 56, h: 52, ax: 28, ay: 24 },
    irrlicht: { f: zeichneIrrlicht, b: 60, h: 64, ax: 30, ay: 32 },
    hornisse: { f: zeichneHornisse, b: 62, h: 50, ax: 32, ay: 26 },
  };
  G.gegner = (typ, ph) => {
    const d = GEGNER[typ], f = Math.floor((((ph % 1) + 1) % 1) * 8);
    return G.sprite(`gegner:${typ}:${f}`, d.b, d.h, d.ax, d.ay, (ctx) => d.f(ctx, f / 8));
  };

  // ---------- Bomben und Münzen ----------
  function zeichneBombe(ctx) {
    oval(ctx, 0, 2, 13.5, 13.5);
    fuell(ctx, radial(ctx, -4, -3, 1, 0, 2, 15, [[0, '#ff9a8f'], [0.35, '#ee3344'], [0.8, '#a50f22'], [1, '#6e0715']]));
    ctx.strokeStyle = 'rgba(255,170,150,.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 2, 10.5, 0.1 * Math.PI, 0.55 * Math.PI); ctx.stroke();
    rund(ctx, -5, -14, 10, 6, 1.6);
    fuell(ctx, linear(ctx, 0, -14, 0, -8, [[0, '#f1f2fa'], [1, '#8e93ad']]), 1.6);
    const zuend = () => { ctx.beginPath(); ctx.moveTo(0, -14); ctx.bezierCurveTo(1, -19, 5, -21, 8, -19); ctx.stroke(); };
    ctx.lineCap = 'round';
    ctx.strokeStyle = UMRISS; ctx.lineWidth = 3.6; zuend();
    ctx.strokeStyle = '#e8d3a0'; ctx.lineWidth = 2; zuend();
    oval(ctx, -5, -3, 4, 2.6, -0.6); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill();
    oval(ctx, -0.5, -7.5, 1.4, 1); ctx.fill();
  }
  G.bombe = () => G.sprite('bombe', 40, 44, 20, 24, zeichneBombe);
  G.ZUENDER = { x: 8, y: -19 };

  const MUENZ_FARBEN = {
    P: ['#fff2a8', '#ffcd3c', '#c78411', '#7a4a05'],
    B: ['#d6f3ff', '#5cc8ff', '#1f6fd1', '#0e3a7a'],
    E: ['#dcffe4', '#5ef08a', '#1e9e4a', '#0d5226'],
    S: ['#ffe0f7', '#ff7ad9', '#b52bb0', '#5e0f63'],
    '★': ['#fffbe0', '#ffe066', '#e0a21b', '#8a5a00'],
  };
  G.MUENZ_FARBEN = MUENZ_FARBEN;
  function zeichneMuenze(ctx, zeichen, dreh) {
    const f = MUENZ_FARBEN[zeichen];
    const sx = Math.max(0.1, Math.abs(dreh));
    // Randdicke wird sichtbar, wenn die Münze schräg steht
    oval(ctx, 0, 0, 15.5 * sx + (1 - sx) * 2.5, 15.5); fuell(ctx, f[3], 2.2);
    oval(ctx, 0, 0, 13 * sx, 13);
    ctx.fillStyle = radial(ctx, -4 * sx, -5, 1, 0, 0, 14, [[0, f[0]], [0.45, f[1]], [1, f[2]]]);
    ctx.fill();
    ctx.strokeStyle = f[0]; ctx.globalAlpha = 0.6; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.ellipse(0, 0, 10.5 * sx, 10.5, 0, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 1;
    if (sx > 0.3) {
      ctx.save();
      ctx.scale(sx, 1);
      if (zeichen === '★') { sternPfad(ctx, 0, 0.5, 8, 3.6, 5); fuell(ctx, '#fff7cf', 1.5, f[3]); }
      else G.text(ctx, zeichen, 0, 1.5, { font: `20px ${BJ.SCHRIFT_TITEL}`, ausrichtung: 'center', grundlinie: 'middle', farbe: '#ffffff', umriss: f[3], umrissBreite: 4 });
      ctx.restore();
    }
  }
  G.muenze = (zeichen, ph) => {
    const f = Math.floor((((ph % 1) + 1) % 1) * 16);
    return G.sprite(`muenze:${zeichen}:${f}`, 40, 40, 20, 20, (ctx) => zeichneMuenze(ctx, zeichen, Math.cos((f / 16) * TAU)));
  };

  // Leuchtpunkt für Funken (wird mit „lighter“ überlagert)
  G.licht = (farbe) => G.sprite(`licht:${farbe}`, 32, 32, 16, 16, (ctx) => {
    oval(ctx, 0, 0, 16, 16);
    ctx.fillStyle = radial(ctx, 0, 0, 0, 0, 0, 16, [[0, '#ffffff'], [0.18, farbe], [1, 'rgba(0,0,0,0)']]);
    ctx.fill();
  });

  // Glimmender Zündfunke einer brennenden Bombe
  G.zuendfunke = (ctx, x, y, t) => {
    const puls = 0.75 + Math.sin(t * 30) * 0.25;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    G.male(ctx, G.licht('#ffb43a'), x, y, false, 1.4 * puls);
    ctx.translate(x, y);
    ctx.rotate(t * 6);
    sternPfad(ctx, 0, 0, 6.5 * puls, 1.6, 4, 0);
    ctx.fillStyle = '#fff6c0';
    ctx.fill();
    ctx.restore();
  };

  // ---------- Logo ----------
  G.logo = (groesse) => {
    if (cache.has(`logo:${groesse}`)) return cache.get(`logo:${groesse}`);
    const font = `${groesse}px ${BJ.SCHRIFT_TITEL}`;
    const mess = document.createElement('canvas').getContext('2d');
    mess.font = font;
    if ('letterSpacing' in mess) mess.letterSpacing = groesse * 0.03 + 'px';
    const b = Math.ceil(mess.measureText('BOMB JACK').width + groesse * 0.5);
    const h = Math.ceil(groesse * 1.35);
    return G.sprite(`logo:${groesse}`, b, h, b / 2, groesse * 1.02, (ctx) => {
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      if ('letterSpacing' in ctx) ctx.letterSpacing = groesse * 0.03 + 'px';
      // 3D-Schrift: dunkler Umriss um alles, rote Seitenflächen, dann die Vorderseite
      const tiefe = Math.max(3, Math.round(groesse * 0.07));
      ctx.lineJoin = 'round';
      ctx.strokeStyle = UMRISS;
      ctx.lineWidth = groesse * 0.12;
      for (let i = tiefe; i >= 0; i--) ctx.strokeText('BOMB JACK', i * 0.6, i);
      ctx.fillStyle = linear(ctx, 0, -groesse * 0.8, 0, tiefe, [[0, '#c4243a'], [1, '#6e0a20']]);
      for (let i = tiefe; i > 0; i--) ctx.fillText('BOMB JACK', i * 0.6, i);
      ctx.lineWidth = groesse * 0.045;
      ctx.strokeText('BOMB JACK', 0, 0);
      ctx.fillStyle = linear(ctx, 0, -groesse * 0.8, 0, 0, [[0, '#fff7c2'], [0.4, '#ffd23f'], [0.72, '#ff8f1f'], [1, '#e8452c']]);
      ctx.fillText('BOMB JACK', 0, 0);
    });
  };

  // ---------- Partikel ----------
  const P = (BJ.partikel = { liste: [] });
  P.neu = (o) => {
    const t = Object.assign({ x: 0, y: 0, vx: 0, vy: 0, leben: 0.6, alter: 0, groesse: 3, farbe: '#ffffff', art: 'funke', schwer: 0, reibung: 0, dreh: 0, drehV: 0 }, o);
    P.liste.push(t);
    return t;
  };
  P.funken = (x, y, n, farbe, tempo = 160, leben = 0.6, groesse = 3, schwer = 120) => {
    for (let i = 0; i < n; i++) {
      const w = Math.random() * TAU, v = tempo * (0.35 + Math.random() * 0.65);
      P.neu({ x, y, vx: Math.cos(w) * v, vy: Math.sin(w) * v, leben: leben * (0.6 + Math.random() * 0.6), groesse: groesse * (0.6 + Math.random() * 0.7), farbe, art: 'funke', schwer, reibung: 1.5 });
    }
  };
  P.rauch = (x, y, n, farbe = 'rgba(255,255,255,.55)', tempo = 50, groesse = 10) => {
    for (let i = 0; i < n; i++) {
      const w = Math.random() * TAU, v = tempo * Math.random();
      P.neu({ x: x + Math.cos(w) * 4, y: y + Math.sin(w) * 4, vx: Math.cos(w) * v, vy: Math.sin(w) * v - 15, leben: 0.5 + Math.random() * 0.4, groesse: groesse * (0.6 + Math.random() * 0.6), farbe, art: 'rauch', reibung: 2.5 });
    }
  };
  P.sterne = (x, y, n, farbe = '#fff6c0', tempo = 120) => {
    for (let i = 0; i < n; i++) {
      const w = Math.random() * TAU, v = tempo * (0.4 + Math.random() * 0.6);
      P.neu({ x, y, vx: Math.cos(w) * v, vy: Math.sin(w) * v, leben: 0.7 + Math.random() * 0.4, groesse: 4 + Math.random() * 4, farbe, art: 'stern', reibung: 2, drehV: (Math.random() - 0.5) * 10 });
    }
  };
  P.ring = (x, y, farbe, groesse = 40, leben = 0.45) => P.neu({ x, y, farbe, groesse, leben, art: 'ring' });
  P.text = (x, y, text, farbe = '#ffffff', groesse = 22) => P.neu({ x, y, vy: -46, text, farbe, groesse, leben: 1.15, art: 'text', reibung: 1.2 });

  P.schritt = (dt) => {
    const l = P.liste;
    for (let i = l.length - 1; i >= 0; i--) {
      const t = l[i];
      t.alter += dt;
      if (t.alter >= t.leben) { l[i] = l[l.length - 1]; l.pop(); continue; }
      t.vy += t.schwer * dt;
      if (t.reibung) { const r = Math.max(0, 1 - t.reibung * dt); t.vx *= r; t.vy *= r; }
      t.x += t.vx * dt;
      t.y += t.vy * dt;
      t.dreh += t.drehV * dt;
    }
  };

  P.zeichne = (ctx) => {
    for (const t of P.liste) {
      const k = t.alter / t.leben;
      switch (t.art) {
        case 'funke': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 1 - k;
          G.male(ctx, G.licht(t.farbe), t.x, t.y, false, (t.groesse / 6) * (1 - k * 0.5));
          break;
        }
        case 'rauch': {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = (1 - k) * 0.8;
          oval(ctx, t.x, t.y, t.groesse * (0.6 + k), t.groesse * (0.6 + k));
          ctx.fillStyle = t.farbe; ctx.fill();
          break;
        }
        case 'stern': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 1 - k * k;
          ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.dreh);
          sternPfad(ctx, 0, 0, t.groesse * (1 - k * 0.4), t.groesse * 0.3, 4, 0);
          ctx.fillStyle = t.farbe; ctx.fill();
          ctx.restore();
          break;
        }
        case 'ring': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 1 - k;
          ctx.lineWidth = 4 * (1 - k) + 1;
          ctx.strokeStyle = t.farbe;
          ctx.beginPath(); ctx.arc(t.x, t.y, t.groesse * BJ.rausKubisch(k), 0, TAU); ctx.stroke();
          break;
        }
        case 'text': {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
          const s = k < 0.12 ? BJ.rausZurueck(k / 0.12) : 1;
          ctx.save(); ctx.translate(t.x, t.y); ctx.scale(s, s);
          G.text(ctx, t.text, 0, 0, { font: BJ.schrift(800, t.groesse), ausrichtung: 'center', grundlinie: 'middle', farbe: t.farbe, umriss: UMRISS, umrissBreite: 5 });
          ctx.restore();
          break;
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };
  P.leeren = () => { P.liste.length = 0; };
})();
