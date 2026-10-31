/* Morgenlicht: Das Licht wandert beim Scrollen ein wenig weiter. Einzige Bewegung der Seite. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var rooms = document.querySelectorAll(".light-room");
  if (!rooms.length) return;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    for (var i = 0; i < rooms.length; i++) {
      var r = rooms[i].getBoundingClientRect();
      var p = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / vh));
      rooms[i].style.setProperty("--drift", p.toFixed(3));
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
