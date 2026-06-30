/* ============================================================================
   colors.js - WaW STATIC color clan-tags: RED, GRN, YELW, BLUE, CYAN

   Found in the dispatcher's DEFAULT path. 0x65D260 compares the clan tag against
   the list {RED, GRN, YELW, BLUE, CYAN} (strings @0x89011C..0x890134) and, on a
   match, formats it via:
       sprintf(buf, "[^%i%s^7]%s", colorIndex, tag, name)   (@0x65D2C8)
   where colorIndex = (match index + 1): RED->^1, GRN->^2, YELW->^3, BLUE->^4,
   CYAN->^5. So the tag text is shown in a fixed engine color.

   These are STATIC - there is NO animation, no timer, no per-frame work. The tag
   just renders in its color (brackets + name stay white). Palette ^1..^5 read
   from g_color_table @0x838680.

   (For reference: any tag that is NOT one of the animated presets or these color
   names, when flag bit 0x01 is set, gets the default "[^6%s^7]" PINK wrap via the
   format string @0x890178 - also static.)
   ============================================================================ */
(function () {
  'use strict';

  var WHITE = '#ffffff';
  var TAGS = [
    { id: 'col-red',  tag: 'RED',  color: '#FF3333' }, // ^1
    { id: 'col-grn',  tag: 'GRN',  color: '#00FF00' }, // ^2
    { id: 'col-yelw', tag: 'YELW', color: '#FFFF00' }, // ^3
    { id: 'col-blue', tag: 'BLUE', color: '#0000FF' }, // ^4
    { id: 'col-cyan', tag: 'CYAN', color: '#00FFFF' }  // ^5
  ];

  function start() {
    TAGS.forEach(function (t) {
      var el = document.getElementById(t.id);
      if (!el) return;
      el.textContent = '';
      el.style.color = WHITE;                       // brackets + name white
      el.appendChild(document.createTextNode('['));
      var s = document.createElement('span');
      s.textContent = t.tag;
      s.style.color = t.color;                       // tag text in its fixed color
      el.appendChild(s);
      el.appendChild(document.createTextNode(']Unknown Soldier'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
