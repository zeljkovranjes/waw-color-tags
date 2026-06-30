/* ============================================================================
   cyln.js - WaW "[cyln]" clan-tag animation (EXACT recreation) - the "Cylon" eye

   Reverse-engineered live from the running modded CoDWaW.exe via x32dbg.
   Dispatcher 0x65D2F0 routes the tags "cyln" AND "krdr" to the same animator at
   0x65D010 (cyln = Cylon, krdr = Knight Rider - both are the red scanner eye).
   Verified by FULL disassembly of 0x65D010.

   A single RED letter scans back and forth across the word; its position is
   driven by a COSINE, so it eases (slows) at each end and is fastest in the
   middle - a Knight-Rider / Battlestar scanner:

     t   = timeGetTime() - t0                          // ms since start
     pos = floor( (cos(t * 0.004) + 1) * 0.5 * L )     // 0..L, cosine bounce
     color[i] = (i == pos) ? red(^1) : white(^7)       // one red letter, rest white

   In asm: pos = ftol( (fcos(t * c1) + c2) * c3 * L ), then per letter the one at
   pos is written as "^1<char>^7". Constants read live from codwaw.exe:
     c1 = 0.004 @0x8AF8F4   c2 = 1.0 @0x826A4C   c3 = 0.5 @0x82B678
   Cosine period = 2*PI / 0.004 ~= 1571ms (full right->left->right sweep).
   Highlight = ^1 red #FF3333; everything else = ^7 white #FFFFFF.

   NOTE: in-game this scans only the short tag; this build applies it to the
   ENTIRE displayed name (same scope chosen for cycl.js / rain.js).
   ============================================================================ */
(function () {
  'use strict';

  var RED = '#FF3333';   // ^1 (the scanner eye)
  var WHITE = '#FFFFFF'; // ^7 (everything else)
  var SPEED = 0.004;     // cosine speed, radians per ms (c1)
  var FULL = '[cyln]Unknown Soldier';

  function build(el) {
    el.textContent = '';
    el.style.color = WHITE;
    var letters = [];
    for (var i = 0; i < FULL.length; i++) {
      var s = document.createElement('span');
      s.textContent = FULL.charAt(i);
      el.appendChild(s);
      letters.push(s);
    }
    return letters;
  }

  function start() {
    var el = document.getElementById('cyln');
    if (!el) return;
    var letters = build(el);
    var L = letters.length;
    var t0 = null;

    function frame(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      // cosine bounce over [0, L]; eases at both ends like a scanner eye
      var pos = Math.floor((Math.cos(t * SPEED) + 1) * 0.5 * L);
      for (var i = 0; i < L; i++) {
        letters[i].style.color = (i === pos) ? RED : WHITE;
      }
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
