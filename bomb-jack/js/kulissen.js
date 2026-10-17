/* Bomb Jack Remake – Kulissen: fünf Welten, Plattformen, Rahmen und Titelbild
   Die Bilder werden einmal pro Auflösung gemalt und dann nur noch kopiert. */
'use strict';
(() => {
  const G = BJ.gfx;
  const { oval, rund, linear, radial, sternPfad } = G;
  const TAU = Math.PI * 2;
  const wahl = (r, liste) => liste[Math.floor(r() * liste.length)];

  // ---------- Malhelfer ----------
  const flaeche = (ctx, w, h, stops) => { ctx.fillStyle = linear(ctx, 0, 0, 0, h, stops); ctx.fillRect(0, 0, w, h); };
  const sterne = (ctx, w, h, n, r, maxGroesse = 1.4) => {
    for (let i = 0; i < n; i++) {
      const x = r() * w, y = r() * r() * h, s = 0.3 + r() * maxGroesse;
      ctx.fillStyle = `rgba(255,255,255,${(0.25 + r() * 0.75).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(x, y, s, 0, TAU); ctx.fill();
    }
  };
  const gluehen = (ctx, x, y, r, farbe, alpha) => {
    ctx.fillStyle = radial(ctx, x, y, 0, x, y, r, [[0, farbe + alpha + ')'], [1, farbe + '0)']]);
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  // Hügelkette aus überlagerten Sinuswellen
  const kette = (ctx, w, basis, amp, r, farbe, unten, rau = 0) => {
    const f1 = 0.004 + r() * 0.004, f2 = 0.011 + r() * 0.01, p1 = r() * 9, p2 = r() * 9;
    ctx.beginPath(); ctx.moveTo(0, unten);
    for (let x = 0; x <= w + 4; x += 4) {
      const y = basis - amp * (0.6 * Math.sin(x * f1 + p1) + 0.4 * Math.sin(x * f2 + p2)) - (rau ? r() * rau : 0);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, unten); ctx.closePath();
    ctx.fillStyle = farbe; ctx.fill();
  };
  // Zackige Berge, optional mit Schneekappen
  const berge = (ctx, w, basis, hoehe, r, farbe, schnee) => {
    const spitzen = [];
    let x = -40;
    while (x < w + 60) { spitzen.push([x, basis - hoehe * (0.45 + r() * 0.55)]); x += 50 + r() * 70; }
    ctx.beginPath(); ctx.moveTo(-40, basis + 200);
    spitzen.forEach(([sx, sy], i) => {
      ctx.lineTo(sx, sy);
      if (i < spitzen.length - 1) { const n = spitzen[i + 1]; ctx.lineTo((sx + n[0]) / 2, Math.max(sy, n[1]) + hoehe * (0.2 + r() * 0.2)); }
    });
    ctx.lineTo(w + 60, basis + 200); ctx.closePath();
    ctx.fillStyle = farbe; ctx.fill();
    if (!schnee) return;
    ctx.fillStyle = schnee;
    spitzen.forEach(([sx, sy]) => {
      const t = hoehe * 0.16;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + t * 0.9, sy + t);
      ctx.lineTo(sx + t * 0.4, sy + t * 0.8);
      ctx.lineTo(sx, sy + t * 1.1);
      ctx.lineTo(sx - t * 0.45, sy + t * 0.75);
      ctx.lineTo(sx - t * 0.8, sy + t * 0.95);
      ctx.closePath(); ctx.fill();
    });
  };
  // Mondsichel über eine Hilfsleinwand (Kreis minus versetzter Kreis)
  const mondsichel = (ctx, x, y, r, farbe) => {
    const k = G.skala, c = document.createElement('canvas');
    c.width = c.height = Math.ceil(r * 2.4 * k);
    const m = c.getContext('2d');
    m.scale(k, k);
    m.fillStyle = farbe; m.beginPath(); m.arc(r * 1.2, r * 1.2, r, 0, TAU); m.fill();
    m.globalCompositeOperation = 'destination-out';
    m.beginPath(); m.arc(r * 1.2 + r * 0.45, r * 1.2 - r * 0.25, r * 0.92, 0, TAU); m.fill();
    gluehen(ctx, x, y, r * 3, 'rgba(255,240,200,', 0.25);
    ctx.drawImage(c, x - r * 1.2, y - r * 1.2, r * 2.4, r * 2.4);
  };
  const wolke = (ctx, x, y, b, r) => {
    const teile = [];
    for (let i = 0; i < 7; i++) teile.push([x + (r() - 0.5) * b, y + (r() - 0.5) * b * 0.18, b * (0.14 + r() * 0.14)]);
    ctx.fillStyle = 'rgba(205,225,245,.95)';
    teile.forEach(([cx, cy, cr]) => { ctx.beginPath(); ctx.arc(cx, cy + cr * 0.18, cr, 0, TAU); ctx.fill(); });
    ctx.fillStyle = '#ffffff';
    teile.forEach(([cx, cy, cr]) => { ctx.beginPath(); ctx.arc(cx - cr * 0.12, cy - cr * 0.1, cr * 0.92, 0, TAU); ctx.fill(); });
  };
  const palme = (ctx, x, y, s, stamm, wedel, wedelHell, neigung = 1) => {
    const tx = x + 26 * s * neigung, ty = y - 150 * s;
    ctx.lineCap = 'round';
    ctx.strokeStyle = stamm; ctx.lineWidth = 9 * s;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 2 * s * neigung, y - 90 * s, tx, ty); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1.5 * s;
    for (let i = 1; i < 12; i++) {
      const u = i / 12, px = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * (x + 2 * s * neigung) + u * u * tx, py = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * (y - 90 * s) + u * u * ty;
      ctx.beginPath(); ctx.moveTo(px - 4 * s, py); ctx.lineTo(px + 4 * s, py - 2 * s); ctx.stroke();
    }
    const blaetter = [-2.9, -2.4, -1.95, -1.5, -1.1, -0.7, -0.25];
    blaetter.forEach((a, i) => {
      const L = (62 + (i % 3) * 8) * s, ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.55 + 22 * s;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.5, ty + Math.sin(a) * L * 0.6 - 16 * s, ex, ey);
      ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.45, ty + Math.sin(a) * L * 0.4 - 2 * s, tx, ty + 3 * s);
      ctx.fillStyle = i % 2 ? wedel : wedelHell; ctx.fill();
    });
    oval(ctx, tx, ty + 3 * s, 7 * s, 6 * s); ctx.fillStyle = stamm; ctx.fill();
  };

  // ---------- Sehenswürdigkeiten ----------
  const pyramide = (ctx, x, basisY, halbB, hoehe, licht, schatten, kante) => {
    const sy = basisY - hoehe, gratX = x + halbB * 0.28;
    ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x - halbB, basisY); ctx.lineTo(gratX, basisY); ctx.closePath();
    ctx.fillStyle = schatten; ctx.fill();
    ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(gratX, basisY); ctx.lineTo(x + halbB, basisY); ctx.closePath();
    ctx.fillStyle = licht; ctx.fill();
    if (!kante) return;
    ctx.save();
    ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x - halbB, basisY); ctx.lineTo(x + halbB, basisY); ctx.closePath(); ctx.clip();
    ctx.strokeStyle = 'rgba(70,25,10,.16)'; ctx.lineWidth = 1;
    for (let y = sy + 5; y < basisY; y += Math.max(3, hoehe / 28)) { ctx.beginPath(); ctx.moveTo(x - halbB, y); ctx.lineTo(x + halbB, y); ctx.stroke(); }
    ctx.restore();
    ctx.strokeStyle = kante; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, sy); ctx.lineTo(x + halbB, basisY); ctx.stroke();
  };

  // Liegende Sphinx mit Kopftuch (Nemes), Blick nach rechts; (x0, y0) = hinten unten, L = Länge
  const sphinx = (ctx, x0, y0, L, licht, schatten, dunkel) => {
    const P = (u, v) => [x0 + u * L, y0 + v * L];
    const pfad = (punkte) => {
      ctx.beginPath();
      for (const s of punkte) {
        if (s[0] === 'm') ctx.moveTo(...P(s[1], s[2]));
        else if (s[0] === 'l') ctx.lineTo(...P(s[1], s[2]));
        else ctx.quadraticCurveTo(...P(s[1], s[2]), ...P(s[3], s[4]));
      }
      ctx.closePath();
    };
    const verlaufX = linear(ctx, x0, 0, x0 + L, 0, [[0, schatten], [0.55, licht], [0.8, licht], [1, schatten]]);
    // Löwenkörper mit Pfoten
    pfad([
      ['m', 0, -0.05], ['l', 0.012, -0.13], ['q', 0.02, -0.2, 0.1, -0.2], ['q', 0.3, -0.18, 0.5, -0.21], ['q', 0.58, -0.22, 0.64, -0.25],
      ['l', 0.74, -0.25], ['q', 0.78, -0.2, 0.79, -0.1], ['l', 0.975, -0.1], ['q', 1.0, -0.1, 1.0, -0.075], ['l', 1.0, -0.05],
    ]);
    ctx.fillStyle = verlaufX; ctx.fill();
    // Kopftuch mit Streifen
    const tuch = [
      ['m', 0.6, -0.27], ['l', 0.604, -0.4], ['q', 0.625, -0.47, 0.69, -0.465], ['q', 0.73, -0.46, 0.742, -0.42],
      ['l', 0.75, -0.3], ['l', 0.762, -0.2], ['l', 0.705, -0.2], ['l', 0.665, -0.255],
    ];
    pfad(tuch);
    ctx.fillStyle = linear(ctx, 0, y0 - L * 0.47, 0, y0 - L * 0.2, [[0, licht], [1, schatten]]); ctx.fill();
    ctx.save(); pfad(tuch); ctx.clip();
    ctx.strokeStyle = dunkel; ctx.lineWidth = L * 0.006; ctx.globalAlpha = 0.45;
    for (let v = -0.47; v < -0.18; v += 0.018) { ctx.beginPath(); ctx.moveTo(...P(0.58, v)); ctx.lineTo(...P(0.78, v + 0.01)); ctx.stroke(); }
    ctx.restore();
    // Gesicht
    pfad([
      ['m', 0.706, -0.43], ['l', 0.742, -0.428], ['l', 0.75, -0.39], ['l', 0.766, -0.362], ['l', 0.754, -0.348],
      ['l', 0.757, -0.322], ['q', 0.756, -0.305, 0.74, -0.302], ['l', 0.712, -0.305], ['q', 0.7, -0.37, 0.706, -0.43],
    ]);
    ctx.fillStyle = linear(ctx, x0 + L * 0.7, 0, x0 + L * 0.77, 0, [[0, schatten], [0.5, licht], [1, licht]]); ctx.fill();
    ctx.fillStyle = dunkel; ctx.globalAlpha = 0.7;
    G.oval(ctx, ...P(0.736, -0.39), L * 0.008, L * 0.004); ctx.fill();
    ctx.fillRect(...P(0.728, -0.4), L * 0.018, L * 0.003);
    ctx.fillRect(...P(0.738, -0.326), L * 0.014, L * 0.003);
    // Schattenkanten an Pfoten und Bauch
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(...P(0.79, -0.1)); ctx.lineTo(...P(0.975, -0.1)); ctx.lineTo(...P(0.975, -0.085)); ctx.lineTo(...P(0.79, -0.085)); ctx.fill();
    ctx.beginPath(); ctx.moveTo(...P(0.1, -0.06)); ctx.quadraticCurveTo(...P(0.4, -0.1), ...P(0.75, -0.06)); ctx.lineTo(...P(0.75, -0.05)); ctx.lineTo(...P(0.1, -0.05)); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = linear(ctx, 0, y0 - L * 0.05, 0, y0, [[0, licht], [1, schatten]]);
    ctx.fillRect(x0 - L * 0.02, y0 - L * 0.05, L * 1.05, L * 0.05);
  };

  const parthenon = (ctx, cx, basisY, breite, hoehe, licht, schatten, innen) => {
    const x0 = cx - breite / 2, stufe = hoehe * 0.045;
    for (let k = 0; k < 3; k++) {
      const ein = k * breite * 0.012;
      ctx.fillStyle = k % 2 ? schatten : licht;
      ctx.fillRect(x0 + ein, basisY - (k + 1) * stufe, breite - 2 * ein, stufe);
    }
    const oben = basisY - 3 * stufe, saeuleH = hoehe * 0.52, saeuleOben = oben - saeuleH;
    ctx.fillStyle = innen;
    ctx.fillRect(x0 + breite * 0.05, saeuleOben, breite * 0.9, saeuleH);
    const n = 8, sb = breite * 0.055, abst = (breite * 0.9 - sb) / (n - 1);
    for (let i = 0; i < n; i++) {
      const x = x0 + breite * 0.05 + i * abst;
      if (i === 6) { // eine eingestürzte Säule
        ctx.fillStyle = linear(ctx, x, 0, x + sb, 0, [[0, schatten], [0.55, licht], [1, schatten]]);
        ctx.fillRect(x, oben - saeuleH * 0.35, sb, saeuleH * 0.35);
        continue;
      }
      ctx.fillStyle = linear(ctx, x, 0, x + sb, 0, [[0, schatten], [0.55, licht], [1, schatten]]);
      ctx.fillRect(x, saeuleOben, sb, saeuleH);
      ctx.strokeStyle = 'rgba(90,50,60,.35)'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(x + sb * 0.33, saeuleOben); ctx.lineTo(x + sb * 0.33, oben); ctx.moveTo(x + sb * 0.66, saeuleOben); ctx.lineTo(x + sb * 0.66, oben); ctx.stroke();
      ctx.fillStyle = licht; ctx.fillRect(x - sb * 0.15, saeuleOben - hoehe * 0.03, sb * 1.3, hoehe * 0.03);
    }
    const gebH = hoehe * 0.13, gebY = saeuleOben - hoehe * 0.03 - gebH;
    ctx.fillStyle = linear(ctx, 0, gebY, 0, gebY + gebH, [[0, licht], [1, schatten]]);
    ctx.fillRect(x0 + breite * 0.02, gebY, breite * 0.78, gebH);
    ctx.fillRect(x0 + breite * 0.84, gebY + gebH * 0.35, breite * 0.14, gebH * 0.65);
    ctx.fillStyle = 'rgba(80,40,60,.35)';
    for (let x = x0 + breite * 0.04; x < x0 + breite * 0.78; x += breite * 0.045) ctx.fillRect(x, gebY + gebH * 0.15, breite * 0.012, gebH * 0.4);
    ctx.beginPath();
    ctx.moveTo(x0 + breite * 0.02, gebY);
    ctx.lineTo(cx - breite * 0.05, gebY - hoehe * 0.2);
    ctx.lineTo(cx + breite * 0.12, gebY - hoehe * 0.11);
    ctx.lineTo(cx + breite * 0.14, gebY - hoehe * 0.05);
    ctx.lineTo(cx + breite * 0.2, gebY - hoehe * 0.07);
    ctx.lineTo(cx + breite * 0.25, gebY);
    ctx.closePath();
    ctx.fillStyle = licht; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x0 + breite * 0.09, gebY - hoehe * 0.012);
    ctx.lineTo(cx - breite * 0.05, gebY - hoehe * 0.16);
    ctx.lineTo(cx + breite * 0.1, gebY - hoehe * 0.09);
    ctx.lineTo(cx + breite * 0.18, gebY - hoehe * 0.012);
    ctx.closePath();
    ctx.fillStyle = schatten; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1;
  };

  const zypresse = (ctx, x, y, h, farbe) => {
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.quadraticCurveTo(x + h * 0.16, y - h * 0.55, x + h * 0.09, y);
    ctx.lineTo(x - h * 0.09, y);
    ctx.quadraticCurveTo(x - h * 0.16, y - h * 0.55, x, y - h);
    ctx.fillStyle = farbe; ctx.fill();
  };

  const tanne = (ctx, x, y, h, farbe, schnee) => {
    ctx.fillStyle = '#0a1122';
    ctx.fillRect(x - h * 0.03, y - h * 0.1, h * 0.06, h * 0.1);
    for (let k = 0; k < 4; k++) {
      const ty = y - h * 0.08 - k * h * 0.2, tb = h * (0.5 - k * 0.1);
      ctx.beginPath(); ctx.moveTo(x - tb / 2, ty); ctx.lineTo(x, ty - h * 0.38); ctx.lineTo(x + tb / 2, ty); ctx.closePath();
      ctx.fillStyle = farbe; ctx.fill();
      if (schnee) {
        ctx.beginPath(); ctx.moveTo(x - tb / 2, ty); ctx.lineTo(x, ty - h * 0.38); ctx.lineTo(x - tb * 0.12, ty - h * 0.05); ctx.closePath();
        ctx.fillStyle = schnee; ctx.fill();
      }
    }
  };

  // Neuschwanstein-ähnliches Schloss; (cx, basisY) = Fuß, W = Breite
  const schloss = (ctx, cx, basisY, W, f, r) => {
    const wand = (x, y, b, h) => { ctx.fillStyle = linear(ctx, x, 0, x + b, 0, [[0, f.wandDunkel], [0.35, f.wand], [1, f.wandHell]]); ctx.fillRect(x, y, b, h); };
    const kegel = (x, y, b, h) => {
      ctx.beginPath(); ctx.moveTo(x - b * 0.08, y); ctx.lineTo(x + b / 2, y - h); ctx.lineTo(x + b * 1.08, y); ctx.closePath();
      ctx.fillStyle = linear(ctx, x, 0, x + b, 0, [[0, f.dachDunkel], [0.6, f.dach], [1, f.dachDunkel]]); ctx.fill();
    };
    const fenster = (x, y, b, h, anzahl, reihen, dichte) => {
      for (let j = 0; j < reihen; j++) for (let i = 0; i < anzahl; i++) {
        const fx = x + (i + 0.5) * (b / anzahl) - W * 0.006, fy = y + j * h;
        const an = r() < dichte;
        ctx.fillStyle = an ? f.licht : f.fensterAus;
        ctx.beginPath(); ctx.moveTo(fx, fy + W * 0.022); ctx.lineTo(fx, fy + W * 0.008); ctx.arc(fx + W * 0.006, fy + W * 0.008, W * 0.006, Math.PI, 0); ctx.lineTo(fx + W * 0.012, fy + W * 0.022); ctx.closePath(); ctx.fill();
        if (an && f.leuchten) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; gluehen(ctx, fx + W * 0.006, fy + W * 0.014, W * 0.025, 'rgba(255,200,90,', 0.35); ctx.restore(); }
      }
    };
    const u = W;
    // Torbau (vorn links, Backstein)
    ctx.fillStyle = f.torbau; ctx.fillRect(cx - 0.4 * u, basisY - 0.2 * u, 0.28 * u, 0.2 * u);
    for (let i = 0; i < 7; i++) ctx.fillRect(cx - 0.4 * u + i * 0.042 * u, basisY - 0.225 * u, 0.022 * u, 0.025 * u);
    wand(cx - 0.43 * u, basisY - 0.28 * u, 0.06 * u, 0.28 * u); kegel(cx - 0.43 * u, basisY - 0.28 * u, 0.06 * u, 0.1 * u);
    wand(cx - 0.15 * u, basisY - 0.26 * u, 0.05 * u, 0.26 * u); kegel(cx - 0.15 * u, basisY - 0.26 * u, 0.05 * u, 0.09 * u);
    fenster(cx - 0.37 * u, basisY - 0.16 * u, 0.2 * u, 0.05 * u, 4, 2, 0.5);
    // Viereckturm links
    wand(cx - 0.26 * u, basisY - 0.55 * u, 0.1 * u, 0.4 * u);
    ctx.fillStyle = f.wand;
    for (let i = 0; i < 4; i++) ctx.fillRect(cx - 0.265 * u + i * 0.03 * u, basisY - 0.575 * u, 0.018 * u, 0.025 * u);
    kegel(cx - 0.235 * u, basisY - 0.575 * u, 0.04 * u, 0.1 * u);
    fenster(cx - 0.25 * u, basisY - 0.5 * u, 0.08 * u, 0.07 * u, 2, 4, 0.45);
    // Palas (Hauptbau) mit steilem Dach
    wand(cx - 0.13 * u, basisY - 0.45 * u, 0.3 * u, 0.45 * u);
    ctx.beginPath(); ctx.moveTo(cx - 0.14 * u, basisY - 0.45 * u); ctx.lineTo(cx - 0.1 * u, basisY - 0.56 * u); ctx.lineTo(cx + 0.14 * u, basisY - 0.56 * u); ctx.lineTo(cx + 0.18 * u, basisY - 0.45 * u); ctx.closePath();
    ctx.fillStyle = linear(ctx, 0, basisY - 0.56 * u, 0, basisY - 0.45 * u, [[0, f.dach], [1, f.dachDunkel]]); ctx.fill();
    ctx.fillStyle = f.wandHell;
    ctx.beginPath(); ctx.moveTo(cx + 0.0 * u, basisY - 0.45 * u); ctx.lineTo(cx + 0.03 * u, basisY - 0.53 * u); ctx.lineTo(cx + 0.06 * u, basisY - 0.45 * u); ctx.fill();
    fenster(cx - 0.12 * u, basisY - 0.42 * u, 0.28 * u, 0.065 * u, 7, 5, 0.55);
    // Ecktürmchen am Palas
    for (const [x, h] of [[-0.15, 0.5], [0.165, 0.52]]) { wand(cx + x * u, basisY - h * u, 0.03 * u, 0.12 * u); kegel(cx + x * u, basisY - h * u, 0.03 * u, 0.08 * u); }
    // Schlanker Hauptturm rechts
    wand(cx + 0.2 * u, basisY - 0.66 * u, 0.055 * u, 0.62 * u);
    ctx.fillStyle = f.wandHell; ctx.fillRect(cx + 0.195 * u, basisY - 0.67 * u, 0.065 * u, 0.02 * u);
    kegel(cx + 0.2 * u, basisY - 0.67 * u, 0.055 * u, 0.2 * u);
    fenster(cx + 0.205 * u, basisY - 0.6 * u, 0.045 * u, 0.08 * u, 1, 6, 0.6);
    // Kapellenturm (kleiner, dahinter)
    wand(cx + 0.28 * u, basisY - 0.36 * u, 0.04 * u, 0.33 * u); kegel(cx + 0.28 * u, basisY - 0.36 * u, 0.04 * u, 0.12 * u);
    // Verbindungsmauer
    ctx.fillStyle = f.wandDunkel; ctx.fillRect(cx - 0.12 * u, basisY - 0.12 * u, 0.44 * u, 0.12 * u);
    fenster(cx + 0.18 * u, basisY - 0.1 * u, 0.13 * u, 0.05 * u, 3, 1, 0.4);
  };

  const hochhaus = (ctx, x, basisY, b, h, f, stil, r, lichtDichte) => {
    const oben = basisY - h;
    ctx.fillStyle = linear(ctx, x, 0, x + b, 0, [[0, f.dunkel], [0.4, f.farbe], [1, f.hell]]);
    ctx.fillRect(x, oben, b, h);
    if (stil === 'stufen') {
      ctx.fillRect(x + b * 0.15, oben - h * 0.08, b * 0.7, h * 0.08);
      ctx.fillRect(x + b * 0.3, oben - h * 0.14, b * 0.4, h * 0.06);
      ctx.fillRect(x + b * 0.46, oben - h * 0.24, b * 0.08, h * 0.1);
    } else if (stil === 'spitze') {
      ctx.beginPath(); ctx.moveTo(x, oben); ctx.lineTo(x + b / 2, oben - h * 0.22); ctx.lineTo(x + b, oben); ctx.closePath(); ctx.fill();
    } else if (stil === 'rund') {
      ctx.beginPath(); ctx.arc(x + b / 2, oben, b / 2, Math.PI, 0); ctx.fill();
    } else if (stil === 'antenne') {
      ctx.fillRect(x + b * 0.47, oben - h * 0.18, Math.max(1.2, b * 0.05), h * 0.18);
    }
    const fb = Math.max(2, b * 0.09), fh = Math.max(2, b * 0.07), sx = b * 0.18, sy = fh * 2.2;
    for (let y = oben + sy * 0.8; y < basisY - fh * 2; y += sy) {
      for (let fx = x + sx * 0.6; fx < x + b - fb - 1; fx += sx) {
        const an = r() < lichtDichte;
        ctx.fillStyle = an ? wahl(r, f.fenster) : f.fensterAus;
        ctx.globalAlpha = an ? 0.55 + r() * 0.45 : 0.6;
        ctx.fillRect(fx, y, fb, fh);
      }
    }
    ctx.globalAlpha = 1;
  };

  const empireState = (ctx, cx, basisY, b, H, f, r) => {
    const stufe = (bb, hh, y) => { hochhaus(ctx, cx - bb / 2, y, bb, hh, f, 'flach', r, 0.55); return y - hh; };
    let y = stufe(b, H * 0.1, basisY);
    y = stufe(b * 0.78, H * 0.46, y);
    y = stufe(b * 0.56, H * 0.1, y);
    y = stufe(b * 0.42, H * 0.06, y);
    ctx.fillStyle = f.krone;
    ctx.fillRect(cx - b * 0.17, y - H * 0.05, b * 0.34, H * 0.05);
    ctx.fillRect(cx - b * 0.08, y - H * 0.12, b * 0.16, H * 0.07);
    ctx.fillRect(cx - b * 0.025, y - H * 0.22, b * 0.05, H * 0.1);
    ctx.fillStyle = f.dunkel;
    ctx.fillRect(cx - 1, y - H * 0.3, 2, H * 0.08);
    return [cx, y - H * 0.3];
  };

  const chrysler = (ctx, cx, basisY, b, H, f, r) => {
    hochhaus(ctx, cx - b / 2, basisY, b, H * 0.6, f, 'flach', r, 0.5);
    let y = basisY - H * 0.6;
    for (let i = 0; i < 5; i++) {
      const bb = b * (0.9 - i * 0.15), hh = H * 0.05;
      ctx.fillStyle = linear(ctx, cx - bb / 2, 0, cx + bb / 2, 0, [[0, '#6c6f8f'], [0.5, f.krone], [1, '#6c6f8f']]);
      ctx.beginPath(); ctx.moveTo(cx - bb / 2, y); ctx.lineTo(cx - bb / 2, y - hh * 0.4); ctx.arc(cx, y - hh * 0.4, bb / 2, Math.PI, 0); ctx.lineTo(cx + bb / 2, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff6d8';
      for (let k = -2; k <= 2; k++) {
        const a = Math.PI * 1.5 + k * 0.35, rx = cx + Math.cos(a) * bb * 0.36, ry = y - hh * 0.4 + Math.sin(a) * bb * 0.36;
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 1.6, ry + 4); ctx.lineTo(rx + 1.6, ry + 4); ctx.closePath(); ctx.fill();
      }
      y -= hh * 0.4 + bb * 0.3;
    }
    ctx.fillStyle = f.krone;
    ctx.beginPath(); ctx.moveTo(cx - b * 0.05, y + 2); ctx.lineTo(cx, y - H * 0.18); ctx.lineTo(cx + b * 0.05, y + 2); ctx.closePath(); ctx.fill();
    return [cx, y - H * 0.18];
  };

  // ---------- Die fünf Welten ----------
  const welten = (BJ.welten = [
    {
      name: 'ÄGYPTEN', ort: 'Die Sphinx von Gizeh', lied: 'aegypten', plattform: 'sandstein',
      akzent: '#ffb347', rahmen: ['#fff1b8', '#e3a43c', '#7a4a10'],
      male(ctx, w, h) {
        const r = BJ.saat(7), hor = h * 0.72;
        flaeche(ctx, w, h, [[0, '#191241'], [0.28, '#43206a'], [0.5, '#a53f6b'], [0.62, '#ec6f45'], [0.72, '#ffbf68'], [1, '#ffd89a']]);
        sterne(ctx, w, h * 0.42, 80, r, 1.2);
        const sx = w * 0.68, sy = hor - h * 0.035, sr = w * 0.085;
        gluehen(ctx, sx, sy, w * 0.6, 'rgba(255,170,90,', 0.45);
        gluehen(ctx, sx, sy, sr * 2.3, 'rgba(255,230,160,', 0.7);
        oval(ctx, sx, sy, sr, sr);
        ctx.fillStyle = radial(ctx, sx, sy - sr * 0.3, 1, sx, sy, sr, [[0, '#fffbe6'], [0.6, '#ffe08a'], [1, '#ffb347']]);
        ctx.fill();
        ctx.fillStyle = 'rgba(200,80,90,.4)';
        for (const [dy, b] of [[-0.02, 0.32], [0.0, 0.22], [0.018, 0.36]]) { rund(ctx, sx - (w * b) / 2 + dy * w * 3, sy + dy * h, w * b, h * 0.009, 3); ctx.fill(); }
        kette(ctx, w, hor - h * 0.01, h * 0.018, r, '#d98a63', h);
        pyramide(ctx, w * 0.82, hor + h * 0.012, w * 0.075, h * 0.1, '#e8a160', '#9b5534', '#ffd9a0');
        pyramide(ctx, w * 0.6, hor + h * 0.016, w * 0.15, h * 0.19, '#eda763', '#97502f', '#ffdca6');
        pyramide(ctx, w * 0.32, hor + h * 0.02, w * 0.23, h * 0.29, '#f2b06a', '#94492a', '#ffe1ae');
        kette(ctx, w, hor + h * 0.05, h * 0.025, r, '#c9733f', h);
        kette(ctx, w, hor + h * 0.12, h * 0.03, r, '#a85a30', h);
        sphinx(ctx, w * 0.03, h * 0.9, w * 0.5, '#d99a5c', '#7a4126', '#3d1d10');
        palme(ctx, w * 0.84, h * 0.97, (1.0 * w) / 680, '#3a1d14', '#2e1a14', '#45251b', 1);
        palme(ctx, w * 0.94, h * 0.99, (0.75 * w) / 680, '#3a1d14', '#2e1a14', '#45251b', -1);
        ctx.fillStyle = linear(ctx, 0, h * 0.9, 0, h, [[0, '#8e4a28'], [1, '#4f2414']]);
        ctx.fillRect(0, h * 0.9, w, h * 0.1);
      },
      animiere(ctx, t, w, h) {
        ctx.strokeStyle = 'rgba(40,16,40,.8)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
          const x = w - (((t * (22 + i * 7) + i * 260) % (w + 80)) - 40), y = h * (0.2 + i * 0.07) + Math.sin(t * 0.7 + i) * 6;
          const f = Math.sin(t * 7 + i * 2) * 4;
          ctx.beginPath(); ctx.moveTo(x - 7, y - f); ctx.quadraticCurveTo(x - 3, y - 2, x, y); ctx.quadraticCurveTo(x + 3, y - 2, x + 7, y - f); ctx.stroke();
        }
        funkeln(ctx, t, w, h * 0.35, 14, 3);
      },
    },
    {
      name: 'GRIECHENLAND', ort: 'Die Akropolis von Athen', lied: 'griechenland', plattform: 'marmor',
      akzent: '#9fd0ff', rahmen: ['#ffffff', '#b9c6dc', '#4c5a7a'],
      male(ctx, w, h) {
        const r = BJ.saat(23), hor = h * 0.76;
        flaeche(ctx, w, h, [[0, '#17143d'], [0.32, '#3d3279'], [0.55, '#9b5f9e'], [0.7, '#f0a08c'], [0.76, '#ffd2a0']]);
        sterne(ctx, w, h * 0.45, 60, r, 1.2);
        mondsichel(ctx, w * 0.16, h * 0.14, w * 0.04, '#fff3d6');
        ctx.fillStyle = linear(ctx, 0, hor, 0, h, [[0, '#6a5aa8'], [0.4, '#2c2b66'], [1, '#161838']]);
        ctx.fillRect(0, hor, w, h - hor);
        for (let i = 0; i < 90; i++) {
          const v = Math.pow(r(), 1.4), y = hor + v * (h - hor), bb = (6 + r() * 26) * (1 - v * 0.4);
          const x = w * 0.6 + (r() - 0.5) * (30 + v * (h - hor) * 1.2);
          ctx.fillStyle = `rgba(255,${190 + Math.floor(r() * 50)},150,${(0.15 + r() * 0.45) * (1 - v * 0.6)})`;
          ctx.fillRect(x - bb / 2, y, bb, 1.4);
        }
        ctx.fillStyle = '#4b3a7a';
        ctx.beginPath(); ctx.moveTo(0, hor); ctx.quadraticCurveTo(w * 0.08, hor - h * 0.035, w * 0.2, hor); ctx.fill();
        ctx.beginPath(); ctx.moveTo(w * 0.72, hor); ctx.quadraticCurveTo(w * 0.86, hor - h * 0.03, w, hor - h * 0.01); ctx.lineTo(w, hor); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w * 0.0, h); ctx.lineTo(w * 0.03, h * 0.72); ctx.quadraticCurveTo(w * 0.1, h * 0.62, w * 0.19, h * 0.57);
        ctx.lineTo(w * 0.7, h * 0.565); ctx.quadraticCurveTo(w * 0.8, h * 0.6, w * 0.87, h * 0.71); ctx.lineTo(w * 0.94, h); ctx.closePath();
        ctx.fillStyle = linear(ctx, 0, h * 0.56, 0, h, [[0, '#76507a'], [0.4, '#4a3358'], [1, '#231a36']]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(20,10,30,.25)'; ctx.lineWidth = 1.2;
        for (let i = 0; i < 26; i++) {
          const x = w * (0.06 + r() * 0.82), y = h * (0.62 + r() * 0.3);
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * (0.02 + r() * 0.05), y + h * (r() - 0.5) * 0.02); ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(255,190,160,.55)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w * 0.19, h * 0.57); ctx.lineTo(w * 0.7, h * 0.565); ctx.quadraticCurveTo(w * 0.8, h * 0.6, w * 0.87, h * 0.71); ctx.stroke();
        parthenon(ctx, w * 0.45, h * 0.568, w * 0.46, h * 0.3, '#ffe2bc', '#c7948a', '#6a3f5e');
        zypresse(ctx, w * 0.1, h * 0.66, h * 0.13, '#2a1f40');
        zypresse(ctx, w * 0.145, h * 0.64, h * 0.1, '#33264c');
        zypresse(ctx, w * 0.82, h * 0.67, h * 0.12, '#2a1f40');
        for (let i = 0; i < 11; i++) {
          const x = w * (-0.02 + i * 0.1 + r() * 0.03), hb = w * (0.06 + r() * 0.03), hh = h * (0.05 + r() * 0.04), y = h * (0.94 - (i % 2) * 0.02);
          ctx.fillStyle = '#e9d9e6'; ctx.fillRect(x, y - hh, hb, hh + h * 0.08);
          ctx.fillStyle = '#b98aa5'; ctx.fillRect(x, y - hh, hb * 0.25, hh + h * 0.08);
          ctx.fillStyle = '#c4553a';
          ctx.beginPath(); ctx.moveTo(x - hb * 0.06, y - hh); ctx.lineTo(x + hb * 0.5, y - hh - h * 0.025); ctx.lineTo(x + hb * 1.06, y - hh); ctx.closePath(); ctx.fill();
          ctx.fillStyle = r() < 0.6 ? '#ffd27a' : '#5a4a6a';
          ctx.fillRect(x + hb * 0.45, y - hh * 0.6, hb * 0.18, hh * 0.3);
        }
      },
      animiere(ctx, t, w, h) {
        funkeln(ctx, t, w, h * 0.45, 16, 5);
        // Möwen über dem Meer
        ctx.strokeStyle = 'rgba(255,240,250,.85)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        for (let i = 0; i < 2; i++) {
          const x = ((t * (18 + i * 8) + i * 300) % (w + 80)) - 40, y = h * (0.3 + i * 0.08) + Math.sin(t * 0.9 + i * 2) * 8;
          const f = Math.sin(t * 6 + i) * 3.5;
          ctx.beginPath(); ctx.moveTo(x - 8, y - f); ctx.quadraticCurveTo(x - 3, y - 3, x, y); ctx.quadraticCurveTo(x + 3, y - 3, x + 8, y - f); ctx.stroke();
        }
      },
    },
    {
      name: 'BAYERN', ort: 'Schloss Neuschwanstein', lied: 'bayern', plattform: 'holzschnee',
      akzent: '#a9c8ff', rahmen: ['#e8eefc', '#8fa3cf', '#2c3a63'],
      male(ctx, w, h) {
        const r = BJ.saat(31);
        flaeche(ctx, w, h, [[0, '#030617'], [0.35, '#0a1640'], [0.7, '#1b3270'], [1, '#2b4a86']]);
        sterne(ctx, w, h * 0.8, 170, r, 1.5);
        gluehen(ctx, w * 0.8, h * 0.15, w * 0.3, 'rgba(170,190,255,', 0.32);
        oval(ctx, w * 0.8, h * 0.15, w * 0.058, w * 0.058);
        ctx.fillStyle = radial(ctx, w * 0.79, h * 0.14, 1, w * 0.8, h * 0.15, w * 0.058, [[0, '#ffffff'], [1, '#efe7c4']]);
        ctx.fill();
        ctx.fillStyle = 'rgba(150,140,110,.25)';
        for (const [dx, dy, rr] of [[-0.015, -0.01, 0.012], [0.02, 0.012, 0.009], [0.005, 0.025, 0.007], [-0.022, 0.02, 0.006]]) { oval(ctx, w * (0.8 + dx), h * 0.15 + w * dy, w * rr, w * rr); ctx.fill(); }
        berge(ctx, w, h * 0.6, h * 0.24, r, '#24365f', 'rgba(220,232,255,.9)');
        berge(ctx, w, h * 0.68, h * 0.14, r, '#18284f', 'rgba(200,215,250,.75)');
        ctx.beginPath();
        ctx.moveTo(w * 0.12, h); ctx.lineTo(w * 0.26, h * 0.7); ctx.lineTo(w * 0.33, h * 0.66); ctx.lineTo(w * 0.64, h * 0.655); ctx.lineTo(w * 0.72, h * 0.7); ctx.lineTo(w * 0.86, h);
        ctx.closePath();
        ctx.fillStyle = linear(ctx, 0, h * 0.65, 0, h, [[0, '#26345c'], [1, '#0f1730']]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(200,215,255,.35)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(w * 0.26, h * 0.7); ctx.lineTo(w * 0.33, h * 0.66); ctx.lineTo(w * 0.64, h * 0.655); ctx.stroke();
        schloss(ctx, w * 0.48, h * 0.665, w * 0.58, {
          wand: '#c9d4ee', wandHell: '#eef3ff', wandDunkel: '#7d8bb3', dach: '#4a62a8', dachDunkel: '#24346a',
          torbau: '#a86e5a', licht: '#ffd36b', fensterAus: '#3a4670', leuchten: true,
        }, r);
        for (let reihe = 0; reihe < 3; reihe++) {
          const y = h * (0.86 + reihe * 0.055), hoehe = h * (0.14 - reihe * 0.02);
          for (let x = -20 + reihe * 17; x < w + 30; x += 22 + r() * 22) {
            if (reihe === 0 && x > w * 0.2 && x < w * 0.78 && r() < 0.6) continue;
            tanne(ctx, x, y + r() * 8, hoehe * (0.75 + r() * 0.4), reihe === 2 ? '#081022' : '#0d1830', 'rgba(215,228,255,.75)');
          }
        }
        ctx.fillStyle = linear(ctx, 0, h * 0.94, 0, h, [[0, '#9fb4de'], [1, '#e2ecff']]);
        ctx.beginPath(); ctx.moveTo(0, h * 0.95);
        for (let x = 0; x <= w; x += 20) ctx.lineTo(x, h * 0.95 - Math.sin(x * 0.02) * 4);
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
      },
      animiere(ctx, t, w, h) {
        funkeln(ctx, t, w, h * 0.55, 20, 7);
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        for (let i = 0; i < 90; i++) {
          const tempo = 18 + (i % 7) * 6, groesse = 0.8 + (i % 4) * 0.45;
          const y = ((i * 97.3 + t * tempo) % (h + 20)) - 10;
          const x = ((i * 53.7 + Math.sin(t * 0.9 + i) * 14 + t * 6) % (w + 20)) - 10;
          ctx.beginPath(); ctx.arc(x, y, groesse, 0, TAU); ctx.fill();
        }
      },
    },
    {
      name: 'MIAMI', ort: 'Wolkenkratzer am Hafen', lied: 'miami', plattform: 'artdeco',
      akzent: '#5ef0d0', rahmen: ['#ffe8f2', '#ff9cc4', '#a8346a'],
      male(ctx, w, h) {
        const r = BJ.saat(47), ufer = h * 0.62;
        flaeche(ctx, w, h, [[0, '#1b62c4'], [0.38, '#4aa4e8'], [0.58, '#9ad8f2'], [0.63, '#ffe3c6']]);
        gluehen(ctx, w * 0.15, h * 0.12, w * 0.4, 'rgba(255,250,210,', 0.6);
        oval(ctx, w * 0.15, h * 0.12, w * 0.05, w * 0.05); ctx.fillStyle = '#fffdf0'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,230,.18)'; ctx.lineWidth = 6;
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * TAU + 0.2;
          ctx.beginPath(); ctx.moveTo(w * 0.15 + Math.cos(a) * w * 0.07, h * 0.12 + Math.sin(a) * w * 0.07); ctx.lineTo(w * 0.15 + Math.cos(a) * w * 0.16, h * 0.12 + Math.sin(a) * w * 0.16); ctx.stroke();
        }
        wolke(ctx, w * 0.62, h * 0.15, w * 0.22, r);
        wolke(ctx, w * 0.32, h * 0.3, w * 0.15, r);
        wolke(ctx, w * 0.9, h * 0.34, w * 0.13, r);
        ctx.fillStyle = linear(ctx, 0, ufer, 0, h, [[0, '#45d6dc'], [0.5, '#1797b2'], [1, '#0c6b8c']]);
        ctx.fillRect(0, ufer, w, h - ufer);
        const farben = [
          { farbe: '#f7b6c8', hell: '#ffe1ea', dunkel: '#c27b96' }, { farbe: '#a6f0dc', hell: '#e3fff6', dunkel: '#5fb3a3' },
          { farbe: '#fbe3b0', hell: '#fff6e0', dunkel: '#c9a56a' }, { farbe: '#e8eef8', hell: '#ffffff', dunkel: '#a5b2c9' },
          { farbe: '#b9c9f7', hell: '#e6edff', dunkel: '#7e8fc4' },
        ];
        const stile = ['stufen', 'flach', 'rund', 'antenne', 'flach', 'spitze'];
        const haeuser = [];
        for (let x = w * 0.06; x < w * 0.98;) { const b = w * (0.045 + r() * 0.05); haeuser.push([x, b, h * (0.12 + r() * 0.26)]); x += b * (0.7 + r() * 0.5); }
        haeuser.sort((a, b) => b[2] - a[2]);
        haeuser.forEach(([x, b, hh], i) => {
          const f = Object.assign({ fenster: ['#bff3ff', '#e9fdff'], fensterAus: '#6fb8d6' }, farben[i % farben.length]);
          hochhaus(ctx, x, ufer, b, hh, f, stile[i % stile.length], r, 0.5);
          ctx.fillStyle = linear(ctx, 0, ufer, 0, ufer + hh * 0.5, [[0, 'rgba(255,255,255,.28)'], [1, 'rgba(255,255,255,0)']]);
          ctx.fillRect(x, ufer, b, hh * 0.5);
        });
        ctx.fillStyle = 'rgba(255,255,255,.55)';
        ctx.fillRect(0, ufer, w, 1.5);
        for (let i = 0; i < 70; i++) {
          const y = ufer + r() * (h * 0.24), b = 4 + r() * 14;
          ctx.fillStyle = `rgba(255,255,255,${(0.2 + r() * 0.5).toFixed(2)})`;
          ctx.fillRect(r() * w, y, b, 1.3);
        }
        for (const [x, y, s] of [[0.3, 0.7, 1], [0.72, 0.74, 0.8]]) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.moveTo(w * x, h * y); ctx.lineTo(w * x, h * y - 34 * s); ctx.lineTo(w * x + 20 * s, h * y - 4 * s); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#ff7aa8';
          ctx.beginPath(); ctx.moveTo(w * x - 2 * s, h * y - 4 * s); ctx.lineTo(w * x - 16 * s, h * y - 28 * s); ctx.lineTo(w * x - 2 * s, h * y - 30 * s); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#2b3a66'; ctx.fillRect(w * x - 18 * s, h * y, 40 * s, 5 * s);
        }
        ctx.fillStyle = linear(ctx, 0, h * 0.86, 0, h, [[0, '#fbe6b2'], [1, '#e2b56e']]);
        ctx.beginPath(); ctx.moveTo(0, h * 0.88);
        for (let x = 0; x <= w; x += 16) ctx.lineTo(x, h * 0.875 + Math.sin(x * 0.025) * 5);
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 16) ctx.lineTo(x, h * 0.872 + Math.sin(x * 0.025) * 5);
        ctx.stroke();
        palme(ctx, w * 0.06, h * 1.0, (1.15 * w) / 680, '#8a5a32', '#1f9e5a', '#2fc477', 1);
        palme(ctx, w * 0.95, h * 1.0, (1.0 * w) / 680, '#8a5a32', '#178a4c', '#2fc477', -1);
      },
      animiere(ctx, t, w, h) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        gluehen(ctx, w * 0.15, h * 0.12, w * 0.2, 'rgba(255,245,200,', 0.35 + Math.sin(t * 1.5) * 0.05);
        ctx.restore();
        oval(ctx, w * 0.15, h * 0.12, w * 0.05, w * 0.05); ctx.fillStyle = '#fffbe6'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
          const x = ((t * (26 + i * 9) + i * 230) % (w + 80)) - 40, y = h * (0.18 + i * 0.09) + Math.sin(t * 0.8 + i * 2) * 10;
          const f = Math.sin(t * 5 + i) * 4;
          ctx.beginPath(); ctx.moveTo(x - 9, y - f); ctx.quadraticCurveTo(x - 4, y - 3, x, y); ctx.quadraticCurveTo(x + 4, y - 3, x + 9, y - f); ctx.stroke();
        }
        for (let i = 0; i < 18; i++) {
          const a = Math.pow(Math.max(0, Math.sin(t * 2.4 + i * 2.3)), 8);
          if (a < 0.05) continue;
          ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
          ctx.fillRect(((i * 137) % w), h * 0.64 + ((i * 47) % (h * 0.2)), 10, 1.8);
        }
      },
    },
    {
      name: 'NEW YORK', ort: 'Die Stadt bei Nacht', lied: 'newyork', plattform: 'stahl',
      akzent: '#ff6fd8', rahmen: ['#ffd6f6', '#c56bff', '#3a1a6b'],
      male(ctx, w, h) {
        const r = BJ.saat(59), ufer = h * 0.84;
        flaeche(ctx, w, h, [[0, '#05031a'], [0.4, '#170c3c'], [0.62, '#3a1859'], [0.76, '#86306b'], [0.84, '#c75479']]);
        sterne(ctx, w, h * 0.5, 45, r, 1.1);
        mondsichel(ctx, w * 0.85, h * 0.12, w * 0.035, '#fff0e0');
        for (let x = -10; x < w;) {
          const b = 18 + r() * 40, hh = h * (0.12 + r() * 0.22);
          hochhaus(ctx, x, ufer, b, hh, { farbe: '#2c1a52', hell: '#3a2466', dunkel: '#1f1240', fenster: ['#8b6fc9', '#c79bd8'], fensterAus: '#24164a' }, wahl(r, ['flach', 'antenne', 'flach']), r, 0.25);
          x += b + 2;
        }
        const nacht = { farbe: '#160d30', hell: '#22164a', dunkel: '#0c0720', fenster: ['#ffd98a', '#fff2c8', '#ffe0a0', '#9ff6ff'], fensterAus: '#1c1238', krone: '#d7dcf5' };
        const lichter = [];
        for (let x = -10; x < w;) {
          const b = 30 + r() * 48, hh = h * (0.1 + r() * 0.2);
          if (!(x > w * 0.26 && x < w * 0.46) && !(x > w * 0.6 && x < w * 0.76)) {
            hochhaus(ctx, x, ufer, b, hh, nacht, wahl(r, ['flach', 'antenne', 'stufen']), r, 0.42);
            if (r() < 0.5) lichter.push([x + b / 2, ufer - hh - 3]);
          }
          x += b + 3;
        }
        lichter.push(empireState(ctx, w * 0.36, ufer, w * 0.15, h * 0.62, Object.assign({}, nacht, { krone: '#ff8ad8' }), r));
        lichter.push(chrysler(ctx, w * 0.68, ufer, w * 0.1, h * 0.55, nacht, r));
        gluehen(ctx, w * 0.36, h * 0.27, w * 0.08, 'rgba(255,120,220,', 0.35);
        this.warnlichter = lichter;
        ctx.fillStyle = linear(ctx, 0, ufer, 0, h, [[0, '#1a0f33'], [1, '#07041a']]);
        ctx.fillRect(0, ufer, w, h - ufer);
        for (let i = 0; i < 160; i++) {
          const x = r() * w, y = ufer + r() * (h - ufer), b = 2 + r() * 10;
          ctx.fillStyle = wahl(r, ['rgba(255,217,138,', 'rgba(255,140,220,', 'rgba(160,240,255,']) + (0.12 + r() * 0.35).toFixed(2) + ')';
          ctx.fillRect(x, y, b, 1.3);
        }
      },
      animiere(ctx, t, w, h) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 2; i++) {
          const fx = w * (0.18 + i * 0.66), fy = h * 0.84, a = -Math.PI / 2 + Math.sin(t * 0.35 + i * 2) * 0.55;
          const lang = h * 0.95, breite = 0.05;
          ctx.beginPath(); ctx.moveTo(fx, fy);
          ctx.lineTo(fx + Math.cos(a - breite) * lang, fy + Math.sin(a - breite) * lang);
          ctx.lineTo(fx + Math.cos(a + breite) * lang, fy + Math.sin(a + breite) * lang);
          ctx.closePath();
          ctx.fillStyle = linear(ctx, fx, fy, fx + Math.cos(a) * lang, fy + Math.sin(a) * lang, [[0, 'rgba(200,180,255,.22)'], [1, 'rgba(200,180,255,0)']]);
          ctx.fill();
        }
        ctx.restore();
        for (const [i, [x, y]] of (this.warnlichter || []).entries()) {
          if (Math.sin(t * 2.6 + i * 1.9) < 0.2) continue;
          ctx.save(); ctx.globalCompositeOperation = 'lighter';
          G.male(ctx, G.licht('#ff3a3a'), x, y, false, 0.5);
          ctx.restore();
        }
      },
    },
  ]);

  // Funkelnde Sterne als kleine Kreuze
  function funkeln(ctx, t, w, h, n, saat) {
    for (let i = 0; i < n; i++) {
      const a = Math.max(0, Math.sin(t * (1.3 + (i % 4) * 0.5) + i * saat));
      if (a < 0.2) continue;
      const x = ((i * 211 + saat * 37) % 1000) / 1000 * w, y = ((i * 97 + saat * 53) % 1000) / 1000 * h;
      ctx.strokeStyle = `rgba(255,255,255,${(a * 0.9).toFixed(2)})`; ctx.lineWidth = 1;
      const s = 2 + a * 3;
      ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke();
    }
  }

  // ---------- Plattformen ----------
  const PLATTFORMEN = {
    sandstein(ctx, p) {
      rund(ctx, p.x, p.y, p.b, p.h, 3);
      ctx.fillStyle = linear(ctx, 0, p.y, 0, p.y + p.h, [[0, '#ffd893'], [0.35, '#e3a75a'], [1, '#b0702f']]);
      ctx.fill();
      ctx.save(); ctx.clip();
      ctx.strokeStyle = 'rgba(95,50,20,.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(p.x, p.y + p.h * 0.5); ctx.lineTo(p.x + p.b, p.y + p.h * 0.5);
      for (let x = p.x + 13; x < p.x + p.b; x += 26) { ctx.moveTo(x, p.y); ctx.lineTo(x, p.y + p.h * 0.5); ctx.moveTo(x + 13, p.y + p.h * 0.5); ctx.lineTo(x + 13, p.y + p.h); }
      ctx.stroke();
      for (let x = p.x + 20, i = 0; x < p.x + p.b - 6; x += 40, i++) { ctx.fillStyle = i % 2 ? '#ffd23f' : '#2bb3b8'; ctx.fillRect(x, p.y + p.h * 0.62, 4, 3); }
      ctx.restore();
      ctx.fillStyle = 'rgba(255,246,214,.85)'; ctx.fillRect(p.x + 2, p.y + 1, p.b - 4, 2);
      rund(ctx, p.x, p.y, p.b, p.h, 3); ctx.lineWidth = 1.6; ctx.strokeStyle = '#4a2610'; ctx.stroke();
    },
    marmor(ctx, p) {
      rund(ctx, p.x, p.y, p.b, p.h, 2);
      ctx.fillStyle = linear(ctx, 0, p.y, 0, p.y + p.h, [[0, '#ffffff'], [0.3, '#ece6dc'], [1, '#bdb3a6']]);
      ctx.fill();
      ctx.save(); ctx.clip();
      const r = BJ.saat(Math.floor(p.x * 7 + p.y));
      ctx.strokeStyle = 'rgba(120,110,130,.35)'; ctx.lineWidth = 0.8;
      for (let i = 0; i < p.b / 30; i++) {
        const x = p.x + r() * p.b;
        ctx.beginPath(); ctx.moveTo(x, p.y); ctx.quadraticCurveTo(x + 6, p.y + p.h * 0.4, x + 2 + r() * 10, p.y + p.h); ctx.stroke();
      }
      ctx.strokeStyle = '#b6553a'; ctx.lineWidth = 1.4;
      const y0 = p.y + 6.5, y1 = p.y + 12.5;
      ctx.beginPath();
      for (let x = p.x + 3; x < p.x + p.b - 10; x += 10) {
        ctx.moveTo(x, y1); ctx.lineTo(x, y0); ctx.lineTo(x + 7, y0); ctx.lineTo(x + 7, y1 - 2.5); ctx.lineTo(x + 3.5, y1 - 2.5); ctx.lineTo(x + 3.5, y0 + 3);
      }
      ctx.stroke();
      ctx.restore();
      rund(ctx, p.x, p.y, p.b, p.h, 2); ctx.lineWidth = 1.6; ctx.strokeStyle = '#4c3f5c'; ctx.stroke();
    },
    holzschnee(ctx, p) {
      rund(ctx, p.x, p.y + 2, p.b, p.h - 2, 3);
      ctx.fillStyle = linear(ctx, 0, p.y, 0, p.y + p.h, [[0, '#8a5634'], [1, '#4a2a16']]);
      ctx.fill();
      ctx.save(); ctx.clip();
      ctx.strokeStyle = 'rgba(30,12,4,.4)'; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(p.x, p.y + 6 + i * 3.5); for (let x = p.x; x <= p.x + p.b; x += 12) ctx.lineTo(x, p.y + 6 + i * 3.5 + Math.sin(x * 0.2 + i) * 1.2); ctx.stroke(); }
      ctx.restore();
      rund(ctx, p.x, p.y + 2, p.b, p.h - 2, 3); ctx.lineWidth = 1.5; ctx.strokeStyle = '#1e0f06'; ctx.stroke();
      ctx.fillStyle = '#ffd36b';
      for (let x = p.x + 8; x < p.x + p.b - 4; x += 24) { ctx.beginPath(); ctx.arc(x, p.y + 11, 1.6, 0, TAU); ctx.fill(); }
      ctx.fillStyle = '#e9f2ff';
      ctx.beginPath();
      ctx.moveTo(p.x - 2, p.y + 5);
      ctx.quadraticCurveTo(p.x - 1, p.y - 5, p.x + 8, p.y - 4);
      for (let x = p.x + 8; x < p.x + p.b - 8; x += 16) ctx.quadraticCurveTo(x + 8, p.y - 6.5, x + 16, p.y - 4);
      ctx.quadraticCurveTo(p.x + p.b + 1, p.y - 5, p.x + p.b + 2, p.y + 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(120,150,210,.6)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(220,235,255,.9)';
      for (let x = p.x + 6; x < p.x + p.b - 4; x += 15) {
        const lang = 3 + ((x * 7) % 5);
        ctx.beginPath(); ctx.moveTo(x - 2, p.y + p.h); ctx.lineTo(x, p.y + p.h + lang); ctx.lineTo(x + 2, p.y + p.h); ctx.closePath(); ctx.fill();
      }
    },
    artdeco(ctx, p) {
      rund(ctx, p.x, p.y, p.b, p.h, 4);
      ctx.fillStyle = linear(ctx, 0, p.y, 0, p.y + p.h, [[0, '#ffd1df'], [0.5, '#ff9cbc'], [1, '#d4567f']]);
      ctx.fill();
      ctx.save(); ctx.clip();
      ctx.fillStyle = '#3ad6c5'; ctx.fillRect(p.x, p.y + 8, p.b, 3);
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      for (let x = p.x + 6; x < p.x + p.b - 4; x += 14) { ctx.beginPath(); ctx.moveTo(x, p.y + 14); ctx.lineTo(x + 4, p.y + 11.5); ctx.lineTo(x + 8, p.y + 14); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = linear(ctx, 0, p.y, 0, p.y + 4, [[0, '#ffffff'], [1, '#b9c7d8']]);
      rund(ctx, p.x, p.y, p.b, 4, 2); ctx.fill();
      rund(ctx, p.x, p.y, p.b, p.h, 4); ctx.lineWidth = 1.6; ctx.strokeStyle = '#6a1f3f'; ctx.stroke();
    },
    stahl(ctx, p) {
      ctx.fillStyle = linear(ctx, 0, p.y, 0, p.y + p.h, [[0, '#ff8a5c'], [1, '#a5361b']]);
      ctx.fillRect(p.x, p.y, p.b, 4.5);
      ctx.fillRect(p.x, p.y + p.h - 4.5, p.b, 4.5);
      ctx.fillStyle = '#7a2414'; ctx.fillRect(p.x + 3, p.y + 4.5, p.b - 6, p.h - 9);
      ctx.strokeStyle = '#4a140a'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = p.x + 3; x < p.x + p.b - 10; x += 14) { ctx.moveTo(x, p.y + p.h - 4.5); ctx.lineTo(x + 7, p.y + 4.5); ctx.lineTo(x + 14, p.y + p.h - 4.5); }
      ctx.stroke();
      ctx.fillStyle = '#ffd0b8';
      for (let x = p.x + 6; x < p.x + p.b - 3; x += 12) { ctx.beginPath(); ctx.arc(x, p.y + 2.3, 1.2, 0, TAU); ctx.arc(x, p.y + p.h - 2.3, 1.2, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = '#3a0f08'; ctx.lineWidth = 1.5; ctx.strokeRect(p.x, p.y, p.b, p.h);
      ctx.fillStyle = 'rgba(255,220,200,.6)'; ctx.fillRect(p.x + 1, p.y + 0.8, p.b - 2, 1.2);
    },
  };

  // ---------- Zwischenspeicher ----------
  const speicher = new Map();
  const leinwand = (b, h, zeichner) => {
    const k = G.skala, c = document.createElement('canvas');
    c.width = Math.ceil(b * k); c.height = Math.ceil(h * k);
    const x = c.getContext('2d');
    x.scale(k, k);
    zeichner(x);
    return c;
  };
  const K = (BJ.kulissen = {});
  K.leeren = () => speicher.clear();

  K.hintergrund = (welt) => {
    const s = 'hg' + welt;
    if (!speicher.has(s)) speicher.set(s, leinwand(BJ.FELD.b, BJ.FELD.h, (ctx) => welten[welt].male(ctx, BJ.FELD.b, BJ.FELD.h)));
    return speicher.get(s);
  };

  // Spielfeld einer Runde: Kulisse, Abdunklung und Plattformen
  K.rundenbild = (runde) => {
    const s = 'runde' + runde.nr;
    if (speicher.has(s)) return speicher.get(s);
    const welt = welten[runde.welt], { b, h } = BJ.FELD, k = G.skala;
    const bild = leinwand(b, h, (ctx) => {
      ctx.drawImage(K.hintergrund(runde.welt), 0, 0, b, h);
      ctx.fillStyle = 'rgba(10,6,30,.2)'; ctx.fillRect(0, 0, b, h);
      ctx.fillStyle = radial(ctx, b / 2, h / 2, b * 0.3, b / 2, h / 2, b * 0.75, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(5,2,20,.45)']]);
      ctx.fillRect(0, 0, b, h);
      for (const p of runde.plattformen) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 10 * k; ctx.shadowOffsetY = 6 * k;
        ctx.fillStyle = 'rgba(0,0,0,.5)';
        rund(ctx, p.x + 1, p.y + 2, p.b - 2, p.h - 2, 3); ctx.fill();
        ctx.restore();
        PLATTFORMEN[welt.plattform](ctx, p);
      }
    });
    for (const alt of [...speicher.keys()]) if (alt.startsWith('runde')) speicher.delete(alt);
    speicher.set(s, bild);
    return bild;
  };

  // Ruhende Bildschirmebene: Hintergrund der Seitenleisten und Rahmen ums Spielfeld
  K.ebene = (weltNr) => {
    const s = 'ebene' + weltNr;
    if (speicher.has(s)) return speicher.get(s);
    const welt = welten[weltNr], F = BJ.FELD;
    const bild = leinwand(BJ.B, BJ.H, (ctx) => {
      ctx.save();
      if ('filter' in ctx) ctx.filter = `blur(${Math.round(14 * G.skala)}px)`;
      ctx.drawImage(K.hintergrund(weltNr), -60, -340, BJ.B + 120, BJ.B + 120);
      ctx.restore();
      ctx.fillStyle = 'rgba(8,5,24,.72)'; ctx.fillRect(0, 0, BJ.B, BJ.H);
      for (const x of [20, 1000]) {
        rund(ctx, x, 20, 260, 680, 18);
        ctx.fillStyle = 'rgba(14,9,36,.78)'; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,.09)'; ctx.stroke();
      }
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowBlur = 24 * G.skala;
      rund(ctx, F.x - 12, F.y - 12, F.b + 24, F.h + 24, 14); ctx.fillStyle = '#000'; ctx.fill();
      ctx.restore();
      rund(ctx, F.x - 12, F.y - 12, F.b + 24, F.h + 24, 14);
      ctx.fillStyle = linear(ctx, F.x, F.y - 12, F.x + F.b, F.y + F.h + 12, [[0, welt.rahmen[0]], [0.3, welt.rahmen[1]], [0.65, welt.rahmen[2]], [1, welt.rahmen[1]]]);
      ctx.fill();
      rund(ctx, F.x - 4, F.y - 4, F.b + 8, F.h + 8, 8);
      ctx.fillStyle = '#0d0b1e'; ctx.fill();
      rund(ctx, F.x - 12, F.y - 12, F.b + 24, F.h + 24, 14);
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.stroke();
      ctx.fillStyle = welt.rahmen[0];
      for (const [x, y] of [[F.x - 6, F.y - 6], [F.x + F.b + 6, F.y - 6], [F.x - 6, F.y + F.h + 6], [F.x + F.b + 6, F.y + F.h + 6]]) {
        sternPfad(ctx, x, y, 7, 2.6, 4, 0); ctx.fill();
      }
    });
    for (const alt of [...speicher.keys()]) if (alt.startsWith('ebene')) speicher.delete(alt);
    speicher.set(s, bild);
    return bild;
  };

  // Titelbild: Nachthimmel über einem Panorama aller fünf Welten
  K.titelbild = () => {
    if (speicher.has('titel')) return speicher.get('titel');
    const w = BJ.B, h = BJ.H;
    const bild = leinwand(w, h, (ctx) => {
      const r = BJ.saat(99);
      flaeche(ctx, w, h, [[0, '#04031a'], [0.45, '#140a3e'], [0.7, '#3d1660'], [0.86, '#8f2f6e'], [1, '#d65a6f']]);
      ctx.save(); ctx.translate(w * 0.5, h * 0.35); ctx.rotate(-0.35);
      ctx.fillStyle = radial(ctx, 0, 0, 10, 0, 0, w * 0.6, [[0, 'rgba(150,120,255,.16)'], [1, 'rgba(150,120,255,0)']]);
      ctx.scale(1, 0.18); ctx.beginPath(); ctx.arc(0, 0, w * 0.6, 0, TAU); ctx.fill();
      ctx.restore();
      sterne(ctx, w, h * 0.85, 320, r, 1.4);
      gluehen(ctx, w * 0.86, h * 0.17, 150, 'rgba(200,190,255,', 0.25);
      oval(ctx, w * 0.86, h * 0.17, 46, 46);
      ctx.fillStyle = radial(ctx, w * 0.85, h * 0.16, 2, w * 0.86, h * 0.17, 46, [[0, '#ffffff'], [1, '#e9e2c8']]);
      ctx.fill();
      kette(ctx, w, h * 0.8, 20, r, '#2a1546', h);
      const s = '#120a28', f = { wand: s, wandHell: '#1d1240', wandDunkel: s, dach: '#1a1038', dachDunkel: s, torbau: s, licht: '#ffd36b', fensterAus: s, leuchten: false };
      pyramide(ctx, 120, h * 0.86, 120, 150, '#1c1036', '#120a28');
      pyramide(ctx, 270, h * 0.86, 80, 95, '#1c1036', '#120a28');
      sphinx(ctx, 20, h * 0.92, 210, '#1c1036', '#120a28', '#0a0618');
      ctx.fillStyle = '#150c2e';
      ctx.beginPath(); ctx.moveTo(300, h); ctx.lineTo(330, h * 0.8); ctx.lineTo(560, h * 0.79); ctx.lineTo(600, h); ctx.fill();
      parthenon(ctx, 450, h * 0.8, 210, 160, '#24164a', '#120a28', '#0b0620');
      ctx.fillStyle = '#100827';
      ctx.beginPath(); ctx.moveTo(560, h); ctx.lineTo(610, h * 0.84); ctx.lineTo(700, h * 0.82); ctx.lineTo(760, h); ctx.fill();
      schloss(ctx, 660, h * 0.84, 250, f, r);
      const stadt = { farbe: '#120a28', hell: '#1a1036', dunkel: '#0c0620', fenster: ['#ffd98a', '#fff2c8', '#ff9ae6'], fensterAus: '#120a28', krone: '#ff8ad8' };
      for (const [x, b, hh, stil] of [[790, 34, 150, 'stufen'], [828, 44, 210, 'flach'], [876, 30, 120, 'rund'], [910, 40, 180, 'antenne']]) hochhaus(ctx, x, h * 0.9, b, hh, stadt, stil, r, 0.3);
      palme(ctx, 800, h * 0.98, 0.9, '#0c0620', '#120a28', '#160c30', 1);
      for (let x = 950; x < w;) { const b = 26 + r() * 40, hh = 80 + r() * 160; hochhaus(ctx, x, h * 0.93, b, hh, stadt, wahl(r, ['flach', 'antenne']), r, 0.35); x += b + 4; }
      empireState(ctx, 1090, h * 0.93, 90, 380, stadt, r);
      ctx.fillStyle = linear(ctx, 0, h * 0.92, 0, h, [[0, '#0b0620'], [1, '#05030f']]);
      ctx.fillRect(0, h * 0.92, w, h * 0.08);
      ctx.fillStyle = radial(ctx, w / 2, h * 0.4, 100, w / 2, h * 0.45, w * 0.7, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.45)']]);
      ctx.fillRect(0, 0, w, h);
    });
    speicher.set('titel', bild);
    return bild;
  };
  K.funkeln = funkeln;
})();
