/* Linienplan: Länge jeder Strecke messen, damit sie sich beim Laden zeichnet. */
(function () {
  "use strict";
  var tracks = document.querySelectorAll(".plan .trk");
  for (var i = 0; i < tracks.length; i++) {
    var len = Math.ceil(tracks[i].getTotalLength());
    tracks[i].style.setProperty("--len", len);
  }
})();
