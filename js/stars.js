/* ============================================================================
   stars.js - WaW "[****]" clan-tag animation (EXACT recreation) - bouncing plus

   Reverse-engineered from the running modded CoDWaW.exe. Dispatcher 0x65D2F0
   matches tag "****" and calls the SAME char-bounce animator as "...." (0x65D100),
   but with glyphs ('-', '+', '*'): find = '*', default = '-', selected = '+'.
   (push 0x2D '-', push 0x2B '+', push 0x2A '*' @0x65D33C-0x65D342.)

   So every '*' in the tag is rewritten to '-', except the one at the bounce
   position which becomes '+'. Result: 4 dashes with a single '+' bouncing
   left <-> right. The asterisks are the trigger - they are replaced, not shown.

     phase = floor(t / 75) & 7              // 0..7, +1 every 75ms
     pos   = phase < 4 ? phase : 7 - phase  // 0,1,2,3,3,2,1,0  (bounce)
     char[i] = (i == pos) ? '+' : '-'
   Period = 8 * 75 = 600ms. No color. Tag-only - the name stays static.
   ============================================================================ */
(function () {
  'use strict';

  var STEP_MS = 75;                 // bounce advances every 75ms
  var TAGLEN = 4;                   // "****" -> 4 glyphs
  var DEFAULT = '-';                // non-selected glyph
  var SELECTED = '+';               // the bouncing glyph
  var NAME = 'Unknown Soldier';     // static - the effect never touches the name

  function start() {
    var el = document.getElementById('stars');
    if (!el) return;
    el.style.color = '#ffffff';
    el.textContent = '';
    el.appendChild(document.createTextNode('['));
    var tagSpan = document.createElement('span');   // only this part animates
    el.appendChild(tagSpan);
    el.appendChild(document.createTextNode(']' + NAME));

    var t0 = null;

    function frame(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      var phase = Math.floor(t / STEP_MS) % 8;          // 0..7
      var pos = (phase < 4) ? phase : (7 - phase);      // ping-pong: 0,1,2,3,3,2,1,0
      var s = '';
      for (var i = 0; i < TAGLEN; i++) s += (i === pos) ? SELECTED : DEFAULT;
      tagSpan.textContent = s;                          // tag only; name stays put
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
