/* Bomb Jack Remake – Start: Leinwand, Szenenwechsel und Hauptschleife */
'use strict';
(() => {
  const leinwand = document.getElementById('leinwand');
  const buehne = document.getElementById('buehne');
  const ctx = leinwand.getContext('2d');
  const A = BJ.audio, E = BJ.eingabe;
  const SCHRITT = 1 / 120;
  BJ.nurTouch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches);

  // ---------- Größe ----------
  let skala = 1, warte = 0;
  const anpassen = (sofort) => {
    const stil = getComputedStyle(buehne);
    const b = buehne.clientWidth - parseFloat(stil.paddingLeft) - parseFloat(stil.paddingRight);
    const h = buehne.clientHeight - parseFloat(stil.paddingTop) - parseFloat(stil.paddingBottom);
    const s = Math.max(0.1, Math.min(b / BJ.B, h / BJ.H));
    leinwand.style.width = Math.floor(BJ.B * s) + 'px';
    leinwand.style.height = Math.floor(BJ.H * s) + 'px';
    clearTimeout(warte);
    const fertig = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      leinwand.width = Math.round(BJ.B * s * dpr);
      leinwand.height = Math.round(BJ.H * s * dpr);
      const neu = leinwand.width / BJ.B;
      if (Math.abs(neu - skala) > 0.001) {
        skala = neu;
        BJ.gfx.skala = neu;
        BJ.gfx.leeren();
        BJ.kulissen.leeren();
      }
    };
    if (sofort) fertig(); else warte = setTimeout(fertig, 150);
  };
  window.addEventListener('resize', () => anpassen(false));

  // ---------- Szenen ----------
  BJ.blende = 1;
  BJ.wechsle = (name, param) => {
    if (BJ.szene && BJ.szene.verlassen) BJ.szene.verlassen();
    BJ.szeneName = name;
    BJ.szene = BJ.szenen[name];
    BJ.blende = 1;
    E.leeren();
    if (BJ.szene.betreten) BJ.szene.betreten(param || {});
  };

  // Pause, wenn das Fenster den Fokus verliert oder versteckt wird
  const spielLaeuft = () => BJ.szeneName === 'spiel' && BJ.spiel.aktiv && BJ.spiel.phase !== 'vorbei';
  BJ.beiFokusVerlust = () => { if (spielLaeuft()) BJ.spiel.pausieren(true); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { BJ.beiFokusVerlust(); A.anhalten(true); } else if (!(spielLaeuft() && BJ.spiel.pausiert)) A.anhalten(false);
  });

  // Maus: Fokus holen und Menüpunkte anklicken
  const logisch = (e) => {
    const r = leinwand.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * BJ.B, ((e.clientY - r.top) / r.height) * BJ.H];
  };
  leinwand.addEventListener('pointerdown', (e) => {
    leinwand.focus();
    A.starten();
    if (BJ.szene && BJ.szene.zeiger) BJ.szene.zeiger(...logisch(e), 'klick');
  });
  leinwand.addEventListener('pointermove', (e) => { if (BJ.szene && BJ.szene.zeiger) BJ.szene.zeiger(...logisch(e), 'bewegen'); });

  // ---------- Hauptschleife ----------
  const scanlines = () => {
    ctx.fillStyle = 'rgba(0,0,0,.16)';
    for (let y = 0; y < BJ.H; y += 3) ctx.fillRect(0, y, BJ.B, 1);
    ctx.fillStyle = BJ.gfx.radial(ctx, BJ.B / 2, BJ.H / 2, BJ.H * 0.4, BJ.B / 2, BJ.H / 2, BJ.B * 0.7, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.35)']]);
    ctx.fillRect(0, 0, BJ.B, BJ.H);
  };

  let letzte = performance.now(), rest = 0;
  const schleife = (jetzt) => {
    let dt = (jetzt - letzte) / 1000;
    letzte = jetzt;
    if (dt > 0.1) dt = 0.1;
    rest += dt;
    while (rest >= SCHRITT) {
      if (!E.textModus && E.neu('vollbild')) BJ.vollbild();
      BJ.szene.schritt(SCHRITT);
      E.leeren();
      BJ.blende = Math.max(0, BJ.blende - SCHRITT * 4);
      rest -= SCHRITT;
    }
    ctx.setTransform(skala, 0, 0, skala, 0, 0);
    ctx.fillStyle = '#0d0b1e';
    ctx.fillRect(0, 0, BJ.B, BJ.H);
    BJ.szene.zeichne(ctx, jetzt / 1000);
    if (BJ.einstellungen.scanlines) scanlines();
    if (BJ.blende > 0) { ctx.fillStyle = `rgba(5,3,15,${BJ.blende.toFixed(3)})`; ctx.fillRect(0, 0, BJ.B, BJ.H); }
    requestAnimationFrame(schleife);
  };

  // ---------- Start ----------
  const ladebild = () => {
    ctx.setTransform(skala, 0, 0, skala, 0, 0);
    ctx.fillStyle = '#0d0b1e';
    ctx.fillRect(0, 0, BJ.B, BJ.H);
    ctx.fillStyle = '#ffd23f';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Lade …', BJ.B / 2, BJ.H / 2);
  };
  const schriften = () => {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const laden = Promise.all([
      document.fonts.load(`40px ${BJ.SCHRIFT_TITEL}`),
      document.fonts.load(BJ.schrift(500, 20)),
      document.fonts.load(BJ.schrift(700, 20)),
      document.fonts.load(BJ.schrift(800, 20)),
    ]).catch(() => {});
    return Promise.race([laden, new Promise((r) => setTimeout(r, 2500))]);
  };

  const hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) hot.snapshot(() => ({ spiel: BJ.spiel.stand ? BJ.spiel.stand() : null }));

  const starten = (daten) => {
    anpassen(true);
    ladebild();
    schriften().then(() => {
      BJ.gfx.leeren();
      BJ.kulissen.leeren();
      const sprung = /^#runde(\d+)$/.exec(location.hash);
      if (daten && daten.spiel) BJ.wechsle('spiel', { runde: daten.spiel.runde, stand: daten.spiel });
      else if (sprung) BJ.wechsle('spiel', { runde: Math.max(0, Number(sprung[1]) - 1) });
      else BJ.wechsle('titel');
      letzte = performance.now();
      requestAnimationFrame(schleife);
    });
  };
  if (hot && hot.ready) hot.ready(starten);
  else starten((hot && hot.data) || {});
})();
