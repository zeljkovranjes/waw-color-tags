/* ============================================================================
   move.js - WaW "[move]" clan-tag animation (EXACT recreation) - horizontal slide

   Reverse-engineered live from the running modded CoDWaW.exe via x32dbg.
   Dispatcher 0x65D2F0 matches tag "move" (string @0x85E764) -> animator 0x65D1A0.
   Verified by FULL disassembly of 0x65D1A0.

   "move" adds NO color. It SLIDES the text horizontally by padding it with N
   leading spaces inside a 40-character field, where N follows 1 - |sin(t)|:

     t   = timeGetTime() - t0
     off = floor( (1 - |sin(t * 0.004)|) * (40 - L) )   // leading spaces, 0..(40-L)
     // buffer = (off spaces) + text   -> the name slides left <-> right

   In asm: field width = 0x28 = 40 (@0x65D1B1); off = ftol((1 - fabs(sinf(t*c1)))
   * (40 - L)); c1 = 0.004 @0x8AF8F4 (sinf @0x40DCB0, fabs @0x401000). It then
   memsets the buffer with `off` spaces (0x20) and appends the text. Text color is
   untouched (stays white ^7).
   |sin| period = PI / 0.004 ~= 785ms per right->left->right bounce - a sharp
   turnaround at the right edge (cusp) and a smooth ease at the left.

   Here the slide is reproduced with translateX in `ch` units (1 char width),
   matching the leading-space mechanic. Applies to the ENTIRE displayed name.
   ============================================================================ */
(function () {
  'use strict';

  var SPEED = 0.004;                   // sin speed, radians per ms (c1)
  var FIELD = 40;                      // 40-char field (0x28)
  var FULL = 'Unknown Soldier';

  function start() {
    var el = document.getElementById('move');
    if (!el) return;
    el.textContent = FULL;
    el.style.display = 'inline-block';  // so translateX applies
    el.style.color = '#ffffff';         // move adds no color: stays white
    var span = Math.max(0, FIELD - FULL.length); // max leading spaces = 40 - L
    var t0 = null;

    function frame(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      // leading-space count: 0 (text at left) .. span (text at right)
      var off = Math.floor((1 - Math.abs(Math.sin(t * SPEED))) * span);
      el.style.transform = 'translateX(' + off + 'ch)';
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
