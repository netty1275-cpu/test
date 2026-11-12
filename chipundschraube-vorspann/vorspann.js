/* ==========================================================================
   Chip und Schraube – Vorspann für die Akquise-Seiten
   --------------------------------------------------------------------------
   Einbinden (eine Zeile im <head> der Vorschau-Seite):

     <script src="/vorspann/vorspann.js"
             data-firma="Rubin Umzüge"
             data-suche="Umzugshelfer Berlin"></script>

   data-firma    Name des Betriebs. Fehlt er, wird er aus der Seite gelesen
                 (JSON-LD "name", sonst og:site_name). Zu lange Namen kürzt
                 der Vorspann selbst.
   data-suche    Gewerbe und Ort für das Suchfeld. Fehlt er, entfällt die
                 Such-Szene.
   data-telefon  Optional, erscheint nur in der kurzen Fassung (Brief 2).

   Verhalten:
   - läuft beim ersten Öffnen der Seite auf einem Gerät, danach nicht mehr
   - noch einmal ansehen: jedes Element mit dem Attribut data-vorspann oder
     ein Link auf #vorspann, z. B. <a href="#vorspann">Wer hat das gebaut?</a>
   - ?vorspann=1 spielt ihn immer ab (zum Vorführen), ?vorspann=0 nie
   - ?b=2 (QR-Code im zweiten Brief) zeigt einmal die kurze Fassung
   ========================================================================== */
(function () {
  'use strict';
  var skript = document.currentScript;
  var daten = skript ? skript.dataset : {};
  var frage = new URLSearchParams(location.search);
  var brief2 = frage.get('b') === '2';
  var wunsch = frage.get('vorspann');
  var MERKER = 'cs-vorspann:' + location.pathname + (brief2 ? ':2' : '');
  var wurzel = document.documentElement;
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var gesehen = false;
  try { gesehen = localStorage.getItem(MERKER) === '1'; } catch (e) { /* privater Modus */ }
  var sofort = wunsch === '1' || (wunsch !== '0' && !gesehen);

  var CSS = [
    'html.cs-wartet body{visibility:hidden}html.cs-wartet,html.cs-aktiv{background:#15171A;overflow:hidden}',
    '.cs-vorspann{--cs-blatt:#15171A;--cs-tinte:#1E2023;--cs-grau:#E5E5E1;--cs-leise:#A9ADB3;--cs-gelb:#F0B400;--cs-gelb-hell:#FFC933;',
    'position:fixed;inset:0;z-index:2147483000;overflow:hidden;margin:0;color:var(--cs-grau);text-align:center;',
    'font:400 17px/1.4 "Barlow","Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;letter-spacing:normal;',
    'background:radial-gradient(120% 70% at 50% 38%,#262a30 0%,var(--cs-blatt) 62%);transition:transform .9s cubic-bezier(.7,0,.2,1)}',
    '.cs-vorspann,.cs-vorspann *,.cs-vorspann *::before,.cs-vorspann *::after{box-sizing:border-box}',
    '.cs-vorspann p{margin:0}.cs-vorspann button{font:inherit;cursor:pointer}',
    '.cs-vorspann.cs-zu{transform:translateY(-100%)}',
    '.cs-vorspann :focus-visible{outline:2px solid var(--cs-gelb-hell);outline-offset:3px}',
    '.cs-vorspann:focus{outline:none}.cs-vorspann .cs-weg{position:absolute;z-index:2;top:calc(10px + env(safe-area-inset-top,0px));right:10px;padding:12px;font-size:14px;color:var(--cs-leise);background:none;border:0}',
    /* Logo */
    '.cs-logo{position:absolute;left:50%;top:46%;width:300px;height:300px;margin:-150px 0 0 -150px;perspective:900px;transition:top .9s cubic-bezier(.6,0,.2,1),transform .9s cubic-bezier(.6,0,.2,1)}',
    '.cs-s4 .cs-logo{top:17%;transform:scale(.62)}',
    '.cs-ring{position:absolute;left:50%;top:50%;width:130px;height:130px;margin:-65px 0 0 -65px;border-radius:50%;border:2px solid var(--cs-gelb);opacity:0}',
    '.cs-s3 .cs-ring{animation:cs-ring .9s ease-out}',
    '.cs-ebene{position:absolute;inset:0;transform:rotateX(60deg) rotateZ(-35deg);transition:opacity .8s}.cs-ebene svg{width:100%;height:100%;overflow:visible}',
    '.cs-s4 .cs-ebene{opacity:.5}',
    '.cs-bahn{fill:none;stroke:var(--cs-gelb);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:100;stroke-dashoffset:100;transition:stroke-dashoffset .9s ease-out}',
    '.cs-s3 .cs-bahn{stroke-dashoffset:0}',
    '.cs-auge{fill:var(--cs-gelb);opacity:0;transition:opacity .3s .8s}.cs-s3 .cs-auge{opacity:1}',
    '.cs-s3 .cs-ebene svg{filter:drop-shadow(0 0 5px rgba(240,180,0,.55))}',
    '.cs-schraube{position:absolute;left:50%;top:50%;width:46px;height:190px;margin-left:-23px;overflow:visible;opacity:0;transform:translateY(150px);transition:transform 1.5s cubic-bezier(.2,.7,.2,1),opacity .4s}',
    '.cs-s1 .cs-schraube{opacity:1;transform:none}',
    '.cs-gewinde{animation:cs-lauf .2s linear infinite;animation-play-state:paused}.cs-s1 .cs-gewinde{animation-play-state:running}.cs-s2 .cs-gewinde{animation-duration:.5s}.cs-s3 .cs-gewinde{animation-play-state:paused}',
    '.cs-modell{position:absolute;left:50%;top:50%;width:170px;height:110px;margin:-55px 0 0 -85px;transform-style:preserve-3d;transform:rotateX(60deg) rotateZ(-35deg);opacity:0}',
    '.cs-s0 .cs-modell{opacity:1;animation:cs-ein .9s cubic-bezier(.2,.7,.2,1) both}.cs-s2 .cs-modell{animation:cs-dreh 1s cubic-bezier(.3,.6,.2,1) both}',
    '.cs-koerper{position:absolute;inset:0;transform-style:preserve-3d}.cs-s3 .cs-koerper{animation:cs-druck .4s ease-out}',
    '.cs-oben{position:absolute;inset:0;transform:translateZ(28px);border-radius:3px;background:linear-gradient(135deg,#5b6068 0%,#3a3e44 70%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.16)}',
    '.cs-oben::before{content:"";position:absolute;left:10px;top:10px;width:9px;height:9px;border-radius:50%;background:rgba(0,0,0,.35)}',
    '.cs-schlitz{position:absolute;left:27%;right:27%;top:50%;height:14px;margin-top:-7px;border-radius:7px;background:#5d4f1c;transition:background .25s,box-shadow .5s}',
    '.cs-s3 .cs-schlitz{background:var(--cs-gelb-hell);box-shadow:0 0 22px 6px rgba(240,180,0,.65)}',
    '.cs-wand{position:absolute;background:#24272c}',
    '.cs-wand-v,.cs-wand-h{left:0;width:100%;height:28px;transform-origin:top;transform:rotateX(90deg)}.cs-wand-v{top:100%;background:linear-gradient(#2c3036,#1c1e22)}.cs-wand-h{top:0}',
    '.cs-wand-l,.cs-wand-r{top:0;width:28px;height:100%;transform-origin:left;transform:rotateY(-90deg)}.cs-wand-l{left:0;background:#1a1c1f}.cs-wand-r{left:100%;background:linear-gradient(90deg,#17191c,#2a2d32)}',
    '.cs-bein{position:absolute;width:16px;height:16px;transform-style:preserve-3d;transform:translateZ(14px);background:linear-gradient(#eceef0,#a4a9b0)}',
    '.cs-bein::after{content:"";position:absolute;top:0;width:14px;height:100%;background:#7d828a;transform-origin:left;transform:rotateY(90deg)}',
    '.cs-bein-l{left:-16px}.cs-bein-l::after{left:0}.cs-bein-r{left:100%}.cs-bein-r::after{left:100%}.cs-bein-1{top:20px}.cs-bein-2{top:74px}',
    '@keyframes cs-ein{from{opacity:0;transform:rotateX(60deg) rotateZ(-95deg) translateZ(70px)}to{opacity:1;transform:rotateX(60deg) rotateZ(-35deg)}}',
    '@keyframes cs-dreh{from{transform:rotateX(60deg) rotateZ(-35deg)}to{transform:rotateX(60deg) rotateZ(-395deg)}}',
    '@keyframes cs-druck{0%{transform:translateZ(0)}35%{transform:translateZ(-9px)}100%{transform:translateZ(0)}}',
    '@keyframes cs-lauf{to{transform:translateY(16px)}}',
    '@keyframes cs-ring{from{opacity:.9;transform:scaleY(.5) scale(.5)}to{opacity:0;transform:scaleY(.5) scale(3)}}',
    '@keyframes cs-blinken{50%{opacity:0}}',
    /* Name unter dem großen Logo */
    '.cs-name{position:absolute;left:0;right:0;top:calc(46% + 204px);font:800 28px/1.1 "Archivo","Helvetica Neue","Arial Narrow",Arial,sans-serif;letter-spacing:-.02em;opacity:0;transition:opacity .5s}',
    '.cs-s3 .cs-name{opacity:1}.cs-s4 .cs-name{opacity:0}',
    /* Suche */
    '.cs-suche{position:absolute;left:50%;top:60%;width:300px;height:300px;margin:-150px 0 0 -150px;padding:20px 6px 0;text-align:left;transition:opacity .5s}.cs-ux .cs-suche{opacity:0}',
    '.cs-feld{position:relative;display:flex;align-items:center;gap:8px;height:50px;padding:0 14px;border-radius:25px;background:#f4f4f1;color:var(--cs-tinte);font-size:16px;font-weight:600;opacity:0;transform:translateY(10px);transition:opacity .5s,transform .5s}',
    '.cs-u0 .cs-feld{opacity:1;transform:none}.cs-feld svg{flex:none;width:20px;height:20px}',
    '.cs-bsp{position:absolute;left:16px;top:-19px;font:500 11px/1 "Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--cs-leise)}',
    '.cs-tipp{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cs-tipp::after{content:"";display:inline-block;width:2px;height:1.1em;margin-left:2px;vertical-align:-.15em;background:currentColor;animation:cs-blinken 1s steps(1) infinite}',
    '.cs-treffer{position:relative;height:200px;margin-top:18px}',
    '.cs-zeile{position:absolute;left:0;right:0;top:0;height:44px;padding:10px 14px;border-radius:8px;background:#24272c;opacity:0;transition:transform .9s cubic-bezier(.6,0,.2,1),opacity .5s}',
    '.cs-zeile::before,.cs-zeile::after{content:"";display:block;height:8px;border-radius:4px;background:#454a51}.cs-zeile::before{width:55%}.cs-zeile::after{width:82%;margin-top:8px;opacity:.6}',
    '.cs-zeile:nth-child(2){transform:translateY(52px)}.cs-zeile:nth-child(3){transform:translateY(104px)}',
    '.cs-zeile.cs-ihr{transform:translateY(156px);background:#2c2710;box-shadow:inset 0 0 0 2px var(--cs-gelb);color:var(--cs-gelb-hell);font-size:16px;font-weight:700;line-height:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.cs-zeile.cs-ihr::before,.cs-zeile.cs-ihr::after{display:none}',
    '.cs-u2 .cs-zeile{opacity:1}.cs-u3 .cs-zeile:nth-child(1){transform:translateY(52px)}.cs-u3 .cs-zeile:nth-child(2){transform:translateY(104px)}.cs-u3 .cs-zeile:nth-child(3){transform:translateY(156px)}.cs-u3 .cs-zeile.cs-ihr{transform:translateY(0)}',
    '.cs-anfrage{position:absolute;right:0;top:146px;display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:22px;background:var(--cs-gelb);color:var(--cs-tinte);font-size:16px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,.5);opacity:0;transform:scale(.6);transform-origin:80% 0;transition:opacity .3s,transform .45s cubic-bezier(.3,1.6,.5,1)}',
    '.cs-anfrage svg{width:18px;height:18px}.cs-up .cs-anfrage{opacity:1;transform:none}',
    /* Aussage */
    '.cs-inhalt{position:absolute;left:0;right:0;top:37%;bottom:0;margin:0 auto;max-width:460px;display:flex;flex-direction:column;align-items:center;',
    'padding:0 max(24px,env(safe-area-inset-right,0px)) calc(20px + env(safe-area-inset-bottom,0px)) max(24px,env(safe-area-inset-left,0px))}',
    '.cs-auf{opacity:0;transform:translateY(12px);transition:opacity .6s,transform .6s cubic-bezier(.2,.7,.2,1)}',
    '.cs-s5 .cs-auf5,.cs-s6 .cs-auf6,.cs-s9 .cs-auf9{opacity:1;transform:none}',
    '.cs-marke{font:800 25px/1.1 "Archivo","Helvetica Neue","Arial Narrow",Arial,sans-serif;letter-spacing:-.02em}',
    '.cs-marke small{display:block;margin-top:6px;font:500 12px/1.2 "Barlow Semi Condensed","Arial Narrow",Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--cs-leise)}',
    '.cs-vorspann .cs-satz{margin-top:22px;font-size:19px;line-height:1.4}.cs-satz strong{font-weight:600;color:#fff}',
    '.cs-vorspann .cs-tel{margin-top:16px;font-size:17px}.cs-tel a{color:var(--cs-gelb-hell);font-weight:600}',
    '.cs-vorspann .cs-los{margin-top:auto;width:100%;min-height:54px;padding:0 24px;border:0;border-radius:8px;background:var(--cs-gelb);color:var(--cs-tinte);font-size:18px;font-weight:700}.cs-vorspann .cs-los:hover{background:var(--cs-gelb-hell)}',
    '@media (max-height:600px){.cs-s4 .cs-logo{top:15%;transform:scale(.5)}.cs-inhalt{top:33%}.cs-vorspann .cs-satz{margin-top:14px;font-size:17px}.cs-suche{top:62%}}',
    '@media (prefers-reduced-motion:reduce){.cs-vorspann,.cs-vorspann *,.cs-vorspann *::before,.cs-vorspann *::after{transition:none!important;animation:none!important}}'
  ].join('');

  var stil = document.createElement('style');
  stil.textContent = CSS;
  document.head.appendChild(stil);
  if (sofort) wurzel.classList.add('cs-wartet');

  var LANG = [[0, 's0'], [500, 's1'], [2000, 's2'], [3000, 's3'], [5600, 's4'], [6200, 'u0'], [6700, 'u1'], [8800, 'u2'], [10200, 'u3'], [11900, 'up'], [15200, 'ux'], [15700, 's5'], [16100, 's6'], [17600, 's9']];
  var OHNE_SUCHE = [[0, 's0'], [500, 's1'], [2000, 's2'], [3000, 's3'], [5600, 's4'], [6100, 's5'], [6500, 's6'], [8000, 's9']];
  var KURZ = [[0, 's0'], [0, 's1'], [0, 's2'], [0, 's3'], [0, 's4'], [900, 's5'], [1300, 's6'], [2400, 's9']];

  function text(s) { return String(s).replace(/[&<>"]/g, function (z) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[z]; }); }

  function firmaLesen() {
    if (daten.firma) return daten.firma;
    var ld = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < ld.length; i++) {
      try { var j = JSON.parse(ld[i].textContent); if (j && typeof j.name === 'string' && j.name) return j.name; } catch (e) { /* weiter */ }
    }
    var og = document.querySelector('meta[property="og:site_name"]');
    return (og && og.content) || 'Ihr Betrieb';
  }

  // Kurzformen eines Firmennamens, von vollständig bis knapp. Nichts davon wird von Hand gepflegt.
  function kurzformen(name) {
    var liste = [];
    function dazu(n) { n = n.replace(/\s+/g, ' ').replace(/^[\s,;:&·|–-]+|[\s,;:&·|–-]+$/g, ''); if (n && liste.indexOf(n) < 0) liste.push(n); return n; }
    var n = dazu(name.replace(/\s*\([^)]*\)/g, ''));                                   // Zusätze in Klammern weg
    n = dazu(n.replace(/\s*,?\s*\b(GmbH\s*&\s*Co\.?\s*KG|gGmbH|GmbH|mbH|UG|GbR|OHG|KG|AG|e\.\s?K\.?|e\.\s?Kfm\.?|Inh\.?\s.*)$/i, ''));  // Rechtsform weg
    n = dazu(n.split(/\s[–|·-]\s|,\s/)[0]);                                           // nur der Teil vor Gedankenstrich oder Komma
    dazu(n.replace(/^(Institut|Praxis|Zentrum|Studio|Salon|Büro|Kanzlei|Firma)\s+(für\s+)?/i, ''));  // allgemeinen Vorsatz weg
    var worte = n.split(' ');
    while (worte.length > 1) { worte.pop(); if (!/^(&|und|für|am|im|an|der|die|das)$/i.test(worte[worte.length - 1])) dazu(worte.join(' ') + ' …'); }
    return liste;
  }

  // Erst die Schrift verkleinern, dann die nächste Kurzform nehmen, bis der Name in die Zeile passt.
  function nameEinpassen(el, name) {
    var liste = kurzformen(name);
    for (var i = 0; i < liste.length; i++) {
      el.textContent = liste[i];
      for (var g = 16; g >= 13; g--) { el.style.fontSize = g + 'px'; if (el.scrollWidth <= el.clientWidth) return; }
    }
  }

  var bahnen = [['M50 124H30L8 102V60', 8, 60], ['M50 176H34L14 196V262', 14, 262], ['M250 124H272L292 104V50', 292, 50], ['M250 176H266L288 198V256', 288, 256], ['M190 95V60L214 36', 214, 36], ['M110 205V242L86 266', 86, 266]]
    .map(function (b) { return '<path class="cs-bahn" pathLength="100" d="' + b[0] + '"/><circle class="cs-auge" cx="' + b[1] + '" cy="' + b[2] + '" r="5"/>'; }).join('');
  var gewinde = '';
  for (var y = -24; y <= 184; y += 16) gewinde += '<path d="M-2 ' + y + 'Q23 ' + (y + 16) + ' 48 ' + (y - 8) + '"/>';
  var LOGO =
    '<div class="cs-logo" aria-hidden="true"><div class="cs-ring"></div>' +
    '<div class="cs-ebene"><svg viewBox="0 0 300 300">' + bahnen + '</svg></div>' +
    '<svg class="cs-schraube" viewBox="0 0 46 190"><defs>' +
      '<linearGradient id="cs-metall" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2a2d32"/><stop offset=".28" stop-color="#9a9fa6"/><stop offset=".45" stop-color="#e6e8ea"/><stop offset=".7" stop-color="#737880"/><stop offset="1" stop-color="#22252a"/></linearGradient>' +
      '<clipPath id="cs-schaft"><path d="M0 0H46V150L23 190 0 150Z"/></clipPath></defs>' +
      '<path d="M0 0H46V150L23 190 0 150Z" fill="url(#cs-metall)"/>' +
      '<g clip-path="url(#cs-schaft)"><g class="cs-gewinde" fill="none" stroke-linecap="round">' +
        '<g stroke="#15171A" stroke-opacity=".8" stroke-width="3.5">' + gewinde + '</g>' +
        '<g stroke="#fff" stroke-opacity=".35" stroke-width="1" transform="translate(0 3)">' + gewinde + '</g></g></g></svg>' +
    '<div class="cs-modell"><div class="cs-koerper">' +
      '<div class="cs-wand cs-wand-h"></div><div class="cs-wand cs-wand-l"></div><div class="cs-wand cs-wand-r"></div><div class="cs-wand cs-wand-v"></div>' +
      '<div class="cs-bein cs-bein-l cs-bein-1"></div><div class="cs-bein cs-bein-l cs-bein-2"></div><div class="cs-bein cs-bein-r cs-bein-1"></div><div class="cs-bein cs-bein-r cs-bein-2"></div>' +
      '<div class="cs-oben"><div class="cs-schlitz"></div></div></div></div></div>';

  var offen = null;

  function abspielen(kurz) {
    if (offen || !document.body) return;
    var firma = firmaLesen();
    var suche = kurz ? '' : (daten.suche || '');
    var ablauf = kurz ? KURZ : (suche ? LANG : OHNE_SUCHE);
    var vorher = document.activeElement;

    var el = document.createElement('div');
    el.className = 'cs-vorspann';
    el.setAttribute('role', 'dialog');
    el.tabIndex = -1;
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Kurz vorab: Wer diese Seite gebaut hat und wofür');
    el.innerHTML =
      '<button class="cs-weg" type="button">Überspringen</button>' + LOGO +
      (kurz ? '' : '<p class="cs-name" aria-hidden="true">Chip und Schraube</p>') +
      (suche ? '<div class="cs-suche" aria-hidden="true"><div class="cs-feld">' +
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l5 5"/></svg>' +
        '<span class="cs-tipp"></span><span class="cs-bsp">Beispiel</span></div>' +
        '<div class="cs-treffer"><div class="cs-zeile"></div><div class="cs-zeile"></div><div class="cs-zeile"></div><div class="cs-zeile cs-ihr"></div></div>' +
        '<div class="cs-anfrage"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M5.2 1.5h2.6l1.3 4-1.8 1.4a10 10 0 0 0 5.8 5.800l1.400-1.800 4 1.300v2.600c0 1-.8 1.800-1.800 1.700C9 16.200 3.800 11 3.500 3.300 3.400 2.300 4.200 1.500 5.200 1.500z"/></svg>Neue Anfrage</div></div>' : '') +
      '<div class="cs-inhalt">' +
        '<p class="cs-marke cs-auf cs-auf5">Chip und Schraube<small>Webseiten aus Berlin-Wedding</small></p>' +
        (kurz
          ? '<p class="cs-satz cs-auf cs-auf6">Ihr Entwurf ist noch online. Er hat weiterhin nur eine Aufgabe: <strong>Anfragen bringen.</strong></p>' +
            (daten.telefon ? '<p class="cs-tel cs-auf cs-auf6">Fragen dazu? <a href="tel:' + text(daten.telefon.replace(/[^\d+]/g, '')) + '">' + text(daten.telefon) + '</a></p>' : '')
          : '<p class="cs-satz cs-auf cs-auf6">Ich habe Ihnen eine zweite Webseite gebaut. Ihre jetzige bleibt, wie sie ist. Die neue hat nur eine Aufgabe: <strong>Anfragen bringen.</strong></p>') +
        '<button class="cs-los cs-auf cs-auf9" type="button">Entwurf ansehen</button>' +
      '</div>';

    var seite = Array.prototype.slice.call(document.body.children);
    document.body.appendChild(el);
    seite.forEach(function (k) { if (k !== el) k.inert = true; });
    wurzel.classList.add('cs-aktiv');
    wurzel.classList.remove('cs-wartet');
    offen = el;

    var ihr = el.querySelector('.cs-ihr');
    if (ihr) nameEinpassen(ihr, firma);
    var tipp = el.querySelector('.cs-tipp');
    var los = el.querySelector('.cs-los');
    var timer = [];
    function später(fn, ms) { timer.push(setTimeout(fn, ms)); }

    function schliessen() {
      if (offen !== el) return;
      offen = null;
      timer.forEach(clearTimeout);
      try { localStorage.setItem(MERKER, '1'); } catch (e) { /* privater Modus */ }
      seite.forEach(function (k) { k.inert = false; });
      wurzel.classList.remove('cs-aktiv');
      document.removeEventListener('keydown', taste);
      el.classList.add('cs-zu');
      setTimeout(function () { el.remove(); }, ruhig ? 0 : 950);
      if (vorher && vorher.focus) vorher.focus({ preventScroll: true });
    }
    function taste(e) { if (e.key === 'Escape') schliessen(); }

    los.addEventListener('click', schliessen);
    el.querySelector('.cs-weg').addEventListener('click', schliessen);
    document.addEventListener('keydown', taste);
    el.focus({ preventScroll: true });

    void el.offsetWidth;
    ablauf.forEach(function (schritt) {
      später(function () {
        el.classList.add('cs-' + schritt[1]);
        if (schritt[1] === 'u1' && tipp) {
          if (ruhig) tipp.textContent = suche;
          else suche.split('').forEach(function (z, i) { später(function () { tipp.textContent = suche.slice(0, i + 1); }, i * 85); });
        }
      }, ruhig ? 0 : schritt[0]);
    });
  }

  function bereit() {
    document.addEventListener('click', function (e) {
      var ziel = e.target.closest && e.target.closest('[data-vorspann], a[href="#vorspann"]');
      if (!ziel) return;
      e.preventDefault();
      abspielen(false);
    });
    if (sofort) abspielen(brief2);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bereit);
  else bereit();
})();
