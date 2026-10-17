/* Bomb Jack Remake – Figuren: Jack, Gegner und Bonusmünzen (Bewegung und Verhalten) */
'use strict';
(() => {
  const G = BJ.gfx, P = BJ.partikel;
  const FB = BJ.FELD.b, FH = BJ.FELD.h;

  // Bewegung mit Plattform-Kollision. o.x = Mitte, o.y = Füße
  BJ.bewegen = (o, dt, plattformen, halb, hoehe) => {
    o.wand = 0;
    o.kopf = false;
    o.x += o.vx * dt;
    let box = { x: o.x - halb, y: o.y - hoehe, b: halb * 2, h: hoehe };
    for (const p of plattformen) {
      if (!BJ.trifft(box, p)) continue;
      if (o.vx > 0) { o.x = p.x - halb; o.wand = 1; } else if (o.vx < 0) { o.x = p.x + p.b + halb; o.wand = -1; }
      box.x = o.x - halb;
    }
    if (o.x < halb) { o.x = halb; o.wand = -1; } else if (o.x > FB - halb) { o.x = FB - halb; o.wand = 1; }
    if (o.wand) o.vx = 0;

    const altY = o.y;
    o.y += o.vy * dt;
    o.amBoden = false;
    box = { x: o.x - halb, y: o.y - hoehe, b: halb * 2, h: hoehe };
    for (const p of plattformen) {
      if (!BJ.trifft(box, p)) continue;
      if (o.vy >= 0 && altY <= p.y + 0.5) { o.y = p.y; o.vy = 0; o.amBoden = true; } else if (o.vy < 0 && altY - hoehe >= p.y + p.h - 0.5) {
        o.y = p.y + p.h + hoehe; o.vy = 0; o.kopf = true;
      } else if (o.y - p.y < p.y + p.h - (o.y - hoehe)) { o.y = p.y; o.vy = Math.min(0, o.vy); o.amBoden = true; } else {
        o.y = p.y + p.h + hoehe; o.vy = Math.max(0, o.vy);
      }
      box.y = o.y - hoehe;
    }
    if (o.y >= FH) { o.y = FH; o.vy = 0; o.amBoden = true; }
    if (o.y - hoehe < 0) { o.y = hoehe; if (o.vy < 0) { o.vy = 0; o.kopf = true; } }
  };

  // Oberkante unter einem Punkt (für den Schatten)
  const bodenUnter = (x, y, plattformen) => {
    let boden = FH;
    for (const p of plattformen) if (x > p.x && x < p.x + p.b && p.y >= y - 1 && p.y < boden) boden = p.y;
    return boden;
  };

  // Abprallen an Rand und Plattformen (Kugel und Bonusmünzen)
  const abprallen = (o, dt, plattformen, r) => {
    o.x += o.vx * dt;
    let box = { x: o.x - r, y: o.y - r, b: r * 2, h: r * 2 };
    if (o.x < r || o.x > FB - r || plattformen.some((p) => BJ.trifft(box, p))) { o.x -= o.vx * dt; o.vx = -o.vx; }
    o.y += o.vy * dt;
    box = { x: o.x - r, y: o.y - r, b: r * 2, h: r * 2 };
    if (o.y < r || o.y > FH - r || plattformen.some((p) => BJ.trifft(box, p))) { o.y -= o.vy * dt; o.vy = -o.vy; }
  };

  // Im Spielfeld halten; true, wenn der Rand erreicht wurde
  const grenzen = (g, r = 16) => {
    let rand = false;
    if (g.x < r) { g.x = r; g.vx = Math.abs(g.vx); rand = true; } else if (g.x > FB - r) { g.x = FB - r; g.vx = -Math.abs(g.vx); rand = true; }
    if (g.y < r) { g.y = r; g.vy = Math.abs(g.vy); rand = true; } else if (g.y > FH - r) { g.y = FH - r; g.vy = -Math.abs(g.vy); rand = true; }
    return rand;
  };

  // ---------- Jack ----------
  const G_STEIG = 2700, G_FALL = 1150, MAX_FALL = 320;
  const SPRUNG = { normal: 285, super: 650, klein: 105 };

  BJ.Jack = class {
    constructor(x, y) {
      Object.assign(this, {
        x, y, vx: 0, vy: 0, richtung: 1, amBoden: true, steigt: false, sprungArt: 'normal', kojote: 0, schweben: 0, gleiten: 0,
        anim: 0, laufWeg: 0, tot: false, jubel: false, drehung: 0, schutz: 0, spur: [], schattenY: y,
      });
    }
    get trefferBox() { return { x: this.x - 9, y: this.y - 44, b: 18, h: 40 }; }
    get sammelBox() { return { x: this.x - 13, y: this.y - 50, b: 26, h: 50 }; }

    schritt(dt, plattformen) {
      const E = BJ.eingabe;
      this.anim += dt;
      if (this.tot) {
        this.vy += 900 * dt;
        this.y += this.vy * dt;
        this.drehung += dt * 8;
        return;
      }
      if (this.jubel) return;
      if (this.schutz > 0) this.schutz -= dt;

      const ziel = (E.halten('rechts') ? 1 : 0) - (E.halten('links') ? 1 : 0);
      if (ziel) this.richtung = ziel;
      const max = this.amBoden ? 235 : 215;
      if (ziel) {
        const beschl = (this.amBoden ? 2600 : 2200) * (Math.sign(this.vx) === -ziel ? 2 : 1);
        this.vx = BJ.klemme(this.vx + ziel * beschl * dt, -max, max);
      } else {
        const brems = (this.amBoden ? 3400 : 1800) * dt;
        this.vx = Math.abs(this.vx) <= brems ? 0 : this.vx - Math.sign(this.vx) * brems;
      }

      this.kojote = this.amBoden ? 0.08 : Math.max(0, this.kojote - dt);
      if (E.neu('sprung')) {
        if (this.amBoden || this.kojote > 0) {
          const art = E.halten('hoch') ? 'super' : E.halten('runter') ? 'klein' : 'normal';
          this.vy = -Math.sqrt(2 * G_STEIG * SPRUNG[art]);
          this.steigt = true;
          this.amBoden = false;
          this.kojote = 0;
          this.sprungArt = art;
          BJ.audio.effekt(art === 'super' ? 'supersprung' : art === 'klein' ? 'huepfer' : 'sprung');
          P.rauch(this.x, this.y - 2, 5, 'rgba(255,255,255,.35)', 60, 6);
        } else if (this.steigt && this.vy < -60) {
          // Sprung anhalten und kurz in der Luft stehen
          this.vy = -25;
          this.steigt = false;
          this.schweben = 0.22;
          BJ.audio.effekt('gleiten');
        } else {
          // Beim Fallen antippen: langsam herabschweben
          this.vy = Math.min(this.vy, 25);
          this.gleiten = 0.34;
          BJ.audio.effekt('gleiten');
          P.funken(this.x, this.y - 30, 3, '#bfe3ff', 60, 0.4, 2.5, 0);
        }
      }

      let g = G_FALL, maxFall = MAX_FALL;
      if (this.steigt) { g = G_STEIG; maxFall = Infinity; } else if (this.schweben > 0 || this.gleiten > 0) { g = 170; maxFall = 70; }
      this.schweben = Math.max(0, this.schweben - dt);
      this.gleiten = Math.max(0, this.gleiten - dt);
      this.vy = Math.min(this.vy + g * dt, maxFall);
      if (this.vy >= 0) this.steigt = false;

      const warAmBoden = this.amBoden;
      BJ.bewegen(this, dt, plattformen, 12, 48);
      if (this.kopf) this.steigt = false;
      if (this.amBoden && !warAmBoden) P.rauch(this.x, this.y - 2, 4, 'rgba(255,255,255,.3)', 45, 5);
      if (this.amBoden) this.laufWeg += Math.abs(this.vx) * dt;
      this.schattenY = bodenUnter(this.x, this.y, plattformen);

      if (this.steigt && this.sprungArt === 'super') this.spur.push({ x: this.x, y: this.y, alter: 0 });
      for (const s of this.spur) s.alter += dt;
      while (this.spur.length && this.spur[0].alter > 0.18) this.spur.shift();
    }

    pose() {
      if (this.tot) return 'tod';
      if (this.jubel) return 'jubel';
      if (this.amBoden) return Math.abs(this.vx) > 20 ? 'laufen' : 'stehen';
      if (this.steigt) return 'steigen';
      if (this.schweben > 0 || this.gleiten > 0) return 'schweben';
      return 'fallen';
    }

    zeichne(ctx) {
      const pose = this.pose();
      const ph = pose === 'laufen' ? this.laufWeg / 52 : this.anim * (pose === 'stehen' ? 0.9 : pose === 'jubel' ? 2.4 : 2.2);
      const links = this.richtung < 0;
      if (!this.tot) {
        const abstand = Math.min(1, (this.schattenY - this.y) / 260);
        ctx.fillStyle = `rgba(0,0,0,${(0.35 * (1 - abstand)).toFixed(3)})`;
        G.oval(ctx, this.x, this.schattenY - 1, 13 * (1 - abstand * 0.5), 3.5 * (1 - abstand * 0.5));
        ctx.fill();
      }
      for (const s of this.spur) {
        ctx.globalAlpha = 0.3 * (1 - s.alter / 0.18);
        G.male(ctx, G.jack('steigen', ph), s.x, s.y, links);
      }
      ctx.globalAlpha = this.schutz > 0 && Math.floor(this.schutz * 12) % 2 ? 0.35 : 1;
      const bild = G.jack(pose, ph);
      if (this.tot) {
        ctx.save();
        ctx.translate(this.x, this.y - 24);
        ctx.rotate(this.drehung * this.richtung);
        G.male(ctx, bild, 0, 24, links);
        ctx.restore();
      } else G.male(ctx, bild, this.x, this.y, links);
      ctx.globalAlpha = 1;
    }
  };

  // ---------- Gegner ----------
  const ANIM = { mumie: 1.9, vogel: 3.2, kugel: 0.7, ufo: 1.2, irrlicht: 1.6, hornisse: 1.4 };
  const VERHALTEN = {
    mumie(g, dt, s) {
      const v = 64 * g.tempo;
      if (g.amBoden && g.y >= FH - 0.5) {
        g.vx = 0;
        g.verwandeln += dt;
        if (g.verwandeln > 0.4) s.verwandle(g);
        return;
      }
      if (g.amBoden) {
        g.vx = g.richtung * v;
        const vorn = { x: g.x + g.richtung * 13 - 1, y: g.y + 1, b: 2, h: 4 };
        const traegt = s.runde.plattformen.some((p) => BJ.trifft(vorn, p));
        if (!traegt && !g.kanteGeprueft) {
          g.kanteGeprueft = true;
          if (Math.random() < 0.35) { g.richtung *= -1; g.vx = g.richtung * v; }
        }
        if (traegt) g.kanteGeprueft = false;
      }
      g.vy = Math.min(g.vy + 1300 * dt, 380);
      BJ.bewegen(g, dt, s.runde.plattformen, 11, 38);
      if (g.wand) g.richtung = -g.wand;
    },
    vogel(g, dt, s) {
      const j = s.jack, v = 108 * g.tempo;
      const dx = j.x - g.x, dy = j.y - 26 - g.y, d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, 1.5 * dt);
      g.vx += ((dx / d) * v - g.vx) * k;
      g.vy += ((dy / d) * v - g.vy) * k;
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      grenzen(g);
      if (Math.abs(g.vx) > 8) g.richtung = Math.sign(g.vx);
    },
    kugel(g, dt, s) {
      if (!g.bereit) {
        g.bereit = true;
        const w = BJ.eines([0.62, 2.52, 3.76, 5.66]) + BJ.zufall(-0.2, 0.2), v = 128 * g.tempo;
        g.vx = Math.cos(w) * v;
        g.vy = Math.sin(w) * v;
      }
      abprallen(g, dt, s.runde.plattformen, 14);
      g.richtung = Math.sign(g.vx) || 1;
    },
    ufo(g, dt, s) {
      if (!g.bereit) { g.bereit = true; g.modus = 'kreuzen'; g.t2 = BJ.zufall(1, 2); g.vx = (Math.random() < 0.5 ? -1 : 1) * 82 * g.tempo; }
      g.t2 -= dt;
      if (g.modus === 'sturz') {
        g.x += g.vx * dt;
        g.y += g.vy * dt;
        if (g.t2 <= 0 || grenzen(g, 22)) { g.modus = 'kreuzen'; g.t2 = BJ.zufall(1.4, 2.4); g.vx = (Math.random() < 0.5 ? -1 : 1) * 82 * g.tempo; g.vy = 0; }
      } else if (g.modus === 'zielen') {
        g.vx *= 0.9; g.vy *= 0.9;
        g.x += g.vx * dt; g.y += g.vy * dt;
        if (g.t2 <= 0) {
          const j = s.jack, dx = j.x - g.x, dy = j.y - 26 - g.y, d = Math.hypot(dx, dy) || 1, v = 255 * g.tempo;
          g.vx = (dx / d) * v; g.vy = (dy / d) * v;
          g.modus = 'sturz';
          g.t2 = Math.min(1.6, d / v + 0.25);
        }
      } else {
        g.vy = Math.sin(g.anim * 2.2) * 30;
        g.x += g.vx * dt; g.y += g.vy * dt;
        grenzen(g, 22);
        if (g.t2 <= 0) { g.modus = 'zielen'; g.t2 = 0.55; }
      }
      g.richtung = Math.sign(g.vx) || g.richtung;
    },
    irrlicht(g, dt, s) {
      if (!g.bereit) { g.bereit = true; g.vx = g.richtung * 96 * g.tempo; g.basisY = BJ.klemme(g.y, 70, FH - 70); }
      const j = s.jack;
      g.basisY = BJ.klemme(g.basisY + Math.sign(j.y - 26 - g.basisY) * 34 * g.tempo * dt, 70, FH - 70);
      g.x += g.vx * dt;
      if (g.x < 16 || g.x > FB - 16) { g.vx = -g.vx; g.x = BJ.klemme(g.x, 16, FB - 16); }
      g.y = g.basisY + Math.sin(g.anim * 2.3) * 55;
      g.richtung = Math.sign(g.vx) || 1;
    },
    hornisse(g, dt, s) {
      g.t2 -= dt;
      const j = s.jack;
      if (g.t2 <= 0 || !g.ziel) { g.ziel = { x: j.x + BJ.zufall(-90, 90), y: j.y - 26 + BJ.zufall(-70, 70) }; g.t2 = BJ.zufall(0.6, 1.0); }
      const dx = g.ziel.x - g.x, dy = g.ziel.y - g.y, d = Math.hypot(dx, dy) || 1, v = 165 * g.tempo;
      const k = Math.min(1, 3.2 * dt);
      g.vx += ((dx / d) * v - g.vx) * k + BJ.zufall(-1, 1) * 260 * dt;
      g.vy += ((dy / d) * v - g.vy) * k + BJ.zufall(-1, 1) * 260 * dt;
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      grenzen(g);
      if (Math.abs(g.vx) > 10) g.richtung = Math.sign(g.vx);
    },
  };

  BJ.Gegner = class {
    constructor(typ, x, y, tempo) {
      Object.assign(this, {
        typ, x, y, vx: 0, vy: 0, tempo, zustand: 'erscheinen', zeit: 0, anim: Math.random(), richtung: Math.random() < 0.5 ? -1 : 1,
        amBoden: false, verwandeln: 0, bereit: false, t2: 0, mx: x, my: y, muenzRest: 0,
      });
    }
    get radius() { return this.typ === 'ufo' ? 17 : this.typ === 'mumie' ? 14 : 15; }
    get mitteY() { return this.typ === 'mumie' ? this.y - 20 : this.y; }

    schritt(dt, s) {
      this.anim += dt;
      this.zeit += dt;
      if (this.zustand === 'erscheinen') {
        if (this.zeit >= 1) { this.zustand = 'aktiv'; this.zeit = 0; }
        return;
      }
      if (this.zustand === 'aktiv') VERHALTEN[this.typ](this, dt, s);
    }

    // Wird zur Bonusmünze (nach dem Einsammeln eines P)
    zuMuenze() {
      this.zustand = 'muenze';
      this.mx = this.x;
      this.my = this.mitteY;
    }

    zeichne(ctx, t) {
      if (this.zustand === 'muenze') {
        const blinkt = this.muenzRest < 1.6 && Math.floor(this.muenzRest * 8) % 2 === 0;
        if (blinkt) {
          ctx.globalAlpha = 0.55;
          G.male(ctx, G.gegner(this.typ, this.anim * ANIM[this.typ]), this.x, this.y, this.richtung < 0);
          ctx.globalAlpha = 1;
        } else {
          ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.45;
          G.male(ctx, G.licht('#ffd23f'), this.mx, this.my, false, 1.8);
          ctx.restore();
          G.male(ctx, G.muenze('★', t * 1.2 + this.anim), this.mx, this.my + Math.sin(t * 4 + this.anim * 3) * 3);
        }
        return;
      }
      const bild = G.gegner(this.typ, this.anim * ANIM[this.typ]);
      const links = this.richtung < 0;
      if (this.zustand === 'erscheinen') {
        const k = Math.min(1, this.zeit);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = `rgba(200,150,255,${(1 - k * 0.6).toFixed(2)})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.ellipse(this.x, this.mitteY, 26 * (1 - k * 0.3) + i * 5, 8 + i * 3, 0, t * 4 + i * 2, t * 4 + i * 2 + 4);
          ctx.stroke();
        }
        ctx.restore();
        ctx.globalAlpha = 0.25 + k * 0.6;
        G.male(ctx, bild, this.x, this.y, links, 0.4 + k * 0.6);
        ctx.globalAlpha = 1;
        return;
      }
      if (this.typ === 'ufo' && this.modus === 'zielen' && Math.floor(t * 16) % 2) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        G.male(ctx, G.licht('#ff5a7a'), this.x, this.y, false, 2);
        ctx.restore();
      }
      G.male(ctx, bild, this.x, this.y, links);
    }
  };

  // ---------- Bonusmünzen P, B, E, S ----------
  BJ.Muenze = class {
    constructor(art, x, y) {
      const w = BJ.eines([0.7, 2.44, 3.84, 5.58]) + BJ.zufall(-0.15, 0.15);
      Object.assign(this, { art, x, y, vx: Math.cos(w) * 115, vy: Math.sin(w) * 115, zeit: 0, leben: 11 });
    }
    schritt(dt, plattformen) {
      this.zeit += dt;
      abprallen(this, dt, plattformen, 15);
    }
    zeichne(ctx, t) {
      const rest = this.leben - this.zeit;
      if (rest < 3 && Math.floor(rest * 6) % 2 === 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.5 + Math.sin(t * 6) * 0.15;
      G.male(ctx, G.licht(G.MUENZ_FARBEN[this.art][1]), this.x, this.y, false, 2.3);
      ctx.restore();
      G.male(ctx, G.muenze(this.art, this.zeit * 0.9), this.x, this.y);
    }
  };
})();
