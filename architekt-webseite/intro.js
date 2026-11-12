/* Begrüßungs-Animation für die Kundenakquise (Demo-Modus) – siehe intro.css.
   Wird im <head> geladen, damit die Seite nicht kurz vorher aufblitzt.
   - läuft einmal pro Gerät (Merker im Browser-Speicher)
   - index.html?intro=1 zeigt sie erneut (zum Vorführen)
   - index.html?intro=0 überspringt sie */
(function () {
  var MERKER = 'intro-gesehen';
  var AUTO_WEITER_MS = 12200; // Ende des Laufbalkens im Button (6,2 s + 6 s)
  var wunsch = new URLSearchParams(location.search).get('intro');
  var gesehen = false;
  try { gesehen = localStorage.getItem(MERKER) === '1'; } catch (e) { /* privater Modus */ }
  if (wunsch === '0' || (gesehen && wunsch !== '1')) return;

  var wurzel = document.documentElement;
  wurzel.classList.add('vorab-wartet');

  function zeigen() {
    var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var intro = document.createElement('div');
    intro.className = 'vorab vorab--laeuft';
    intro.setAttribute('role', 'dialog');
    intro.setAttribute('aria-modal', 'true');
    intro.setAttribute('aria-label', 'Kurz vorab: Wofür diese Webseite da ist');
    intro.innerHTML =
      '<button class="vorab__ueberspringen" type="button">Überspringen</button>' +
      '<div class="vorab__inhalt">' +
        '<svg class="vorab__zeichen" viewBox="0 0 64 64" aria-hidden="true"><path pathLength="100" d="M12 52V28l20-16 20 16v24"/></svg>' +
        '<p class="vorab__zeile vorab__zeile--leise">Diese Webseite soll nicht nur gut aussehen.</p>' +
        '<p class="vorab__zeile vorab__zeile--laut">Sie soll Ihnen <em>Kunden bringen.</em></p>' +
        '<ol class="vorab__weg">' +
          '<li><strong>Besucher</strong>findet Sie</li>' +
          '<li><strong>Anfrage</strong>meldet sich</li>' +
          '<li><strong>Auftrag</strong>wird Kunde</li>' +
        '</ol>' +
        '<p class="vorab__schluss">Jede Seite führt zum Erstgespräch – per Anruf, E-Mail oder Formular. Sehen Sie selbst.</p>' +
        '<button class="vorab__start" type="button">Webseite ansehen</button>' +
      '</div>';

    var seite = Array.prototype.slice.call(document.body.children);
    document.body.appendChild(intro);
    seite.forEach(function (el) { el.inert = true; });
    wurzel.classList.add('vorab-aktiv');
    wurzel.classList.remove('vorab-wartet');

    var timer = null;
    var zu = false;
    function schliessen() {
      if (zu) return;
      zu = true;
      clearTimeout(timer);
      try { localStorage.setItem(MERKER, '1'); } catch (e) { /* privater Modus */ }
      seite.forEach(function (el) { el.inert = false; });
      wurzel.classList.remove('vorab-aktiv');
      intro.classList.add('vorab--zu');
      setTimeout(function () { intro.remove(); }, ruhig ? 0 : 950);
    }

    intro.querySelector('.vorab__start').addEventListener('click', schliessen);
    intro.querySelector('.vorab__ueberspringen').addEventListener('click', schliessen);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') schliessen(); });
    intro.querySelector('.vorab__start').focus({ preventScroll: true });
    // Ohne Bewegung (Systemeinstellung) bleibt die Tafel stehen, bis getippt wird.
    if (!ruhig) timer = setTimeout(schliessen, AUTO_WEITER_MS);
  }

  if (document.body) zeigen();
  else document.addEventListener('DOMContentLoaded', zeigen);
})();
