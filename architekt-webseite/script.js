/* Atelier Weiss Architekten – gemeinsames Skript */
document.documentElement.classList.add('js');

// Mobiles Menü
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('hauptnavigation');
if (toggle && nav) {
  const schliessen = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };
  toggle.addEventListener('click', () => {
    const offen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!offen));
    nav.classList.toggle('is-open', !offen);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { schliessen(); toggle.focus(); }
  });
}

// Linie unter der Kopfzeile beim Scrollen
const header = document.querySelector('.site-header');
if (header) {
  const pruefen = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', pruefen, { passive: true });
  pruefen();
}

// Elemente beim Scrollen einblenden
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((eintraege) => {
    eintraege.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// Projektfilter
const filterButtons = document.querySelectorAll('.filter button');
if (filterButtons.length) {
  const projekte = document.querySelectorAll('[data-kategorie]');
  const status = document.getElementById('filter-status');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const wahl = btn.dataset.filter;
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let anzahl = 0;
      projekte.forEach((p) => {
        const sichtbar = wahl === 'alle' || p.dataset.kategorie.split(' ').includes(wahl);
        p.hidden = !sichtbar;
        if (sichtbar) { anzahl++; p.classList.add('is-visible'); }
      });
      if (status) status.textContent = anzahl + (anzahl === 1 ? ' Projekt' : ' Projekte') + ' angezeigt';
    });
  });
}

// Kontaktformular: öffnet das E-Mail-Programm mit vorausgefüllter Nachricht.
// Für den Versand direkt über die Webseite das Formular an einen Formular-Dienst
// oder ein Skript beim Webhoster anbinden (Attribut "action" im <form> setzen).
const formular = document.getElementById('kontaktformular');
if (formular && !formular.getAttribute('action')) {
  formular.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!formular.reportValidity()) return;
    const d = new FormData(formular);
    const zeilen = [
      'Name: ' + d.get('name'),
      'E-Mail: ' + d.get('email'),
      'Telefon: ' + (d.get('telefon') || '–'),
      'Vorhaben: ' + d.get('vorhaben'),
      'Ort des Objekts: ' + (d.get('ort') || '–'),
      '',
      d.get('nachricht'),
    ];
    const ziel = formular.dataset.empfaenger;
    const betreff = 'Projektanfrage: ' + d.get('vorhaben');
    window.location.href = 'mailto:' + ziel + '?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(zeilen.join('\n'));
    const s = document.getElementById('formular-status');
    if (s) s.textContent = 'Vielen Dank! Ihr E-Mail-Programm öffnet sich mit Ihrer Anfrage. Bitte senden Sie die Nachricht dort ab.';
  });
}

// Aktuelles Jahr in der Fußzeile
document.querySelectorAll('[data-jahr]').forEach((el) => { el.textContent = new Date().getFullYear(); });
