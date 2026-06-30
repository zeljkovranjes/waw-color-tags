/* ============================================================================
   dots.js - WaW "[....]" clan-tag animation (EXACT recreation) - bouncing dot

   Reverse-engineered live from the running modded CoDWaW.exe via x32dbg.
   Dispatcher 0x65D2F0 matches tag "...." -> copies the tag into the buffer, then
   calls the char-bounce animator 0x65D100 with glyphs ('.', 'o', '.').
   ("****" uses the SAME function with ('-', '+', '*').) Verified by full
   disassembly of 0x65D100.

   The animator scans the tag for the "find" glyph '.' and rewrites each one: the
   dot whose occurrence index == the bounce position becomes 'o', the rest stay
   '.'. The bounce position ping-pongs:
     phase = floor(t / 75) & 7              // 0..7, +1 every 75ms
     pos   = phase < 4 ? phase : 7 - phase  // 0,1,2,3,3,2,1,0  (bounce w/ end pause)
   So one 'o' bounces left <-> right among the 4 dots. Period = 8 * 75 = 600ms.
   NO color change (glyph swap only).

   IMPORTANT: this applies ONLY to the clan tag ("...."), never the name - so the
   name "Unknown Soldier" is left static here, matching the game.

   Constants (codwaw.exe): /75 magic 0x1B4E81B5 @0x65D130; mod 8 via
   `and 0x80000007` @0x65D141; ping-pong `7 - phase` @0x65D153; timer @0x7EB39C.
   ============================================================================ */
(function () {
  'use strict';

  var STEP_MS = 75;                 // bounce advances every 75ms
  var TAG = '....';                 // the animated clan tag (4 dots)
  var NAME = 'Unknown Soldier';     // static - the effect never touches the name

  function start() {
    var el = document.getElementById('dots');
    if (!el) return;
    el.style.color = '#ffffff';
    el.textContent = '';
    el.appendChild(document.createTextNode('['));
    var tagSpan = document.createElement('span');   // only this part animates
    el.appendChild(tagSpan);
    el.appendChild(document.createTextNode(']' + NAME));

    var L = TAG.length;
    var t0 = null;

    function frame(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      var phase = Math.floor(t / STEP_MS) % 8;          // 0..7
      var pos = (phase < 4) ? phase : (7 - phase);      // ping-pong: 0,1,2,3,3,2,1,0
      var s = '';
      for (var i = 0; i < L; i++) s += (i === pos) ? 'o' : '.';
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
