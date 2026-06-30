/* ============================================================================
   rain.js - WaW "[rain]" clan-tag animation (EXACT recreation)

   Reverse-engineered live from the running modded CoDWaW.exe via x32dbg.
   Dispatcher 0x65D2F0 routes the clan tag "rain" to the animator at 0x65CE20.
   Verified by FULL disassembly of that function.

   Unlike "cycl" (a 2-color sticky wipe), "rain" writes a SEPARATE color code in
   front of EVERY letter, incrementing the color per letter -> a full 5-color
   gradient that scrolls one step every 100ms:

     t    = timeGetTime() - t0          // ms since start
     base = floor(t / 100) % 5          // +1 every 100ms
     color[i] = (base + i) % 5          // each letter a distinct, consecutive color

   Output string built into 0x4DE9590: "^<base>c^<base+1>y^<base+2>c^<base+3>l^7"
   Full cycle = 5 * 100 = 500ms.

   Palette = engine ^1..^5 read live from g_color_table @ 0x00838680:
     ^1 #FF3333 red  ^2 #00FF00 green  ^3 #FFFF00 yellow  ^4 #0000FF blue  ^5 #00FFFF cyan

   Decoded constants (codwaw.exe): /100 via 0x51EB851F @0x65CE50, %5 via 0x66666667,
   per-letter color increment `add ecx,1` @0x65CEAA. Timer @0x7EB39C -> timeGetTime.

   NOTE: in-game this colors only the 4-char "rain" tag; this build applies it to
   the ENTIRE displayed name (same scope chosen for cycl.js).
   ============================================================================ */
(function () {
  'use strict';

  var PAL = ['#FF3333', '#00FF00', '#FFFF00', '#0000FF', '#00FFFF']; // ^1..^5
  var STEP_MS = 100;                   // gradient scrolls one step every 100ms
  var FULL = '[rain]Unknown Soldier';  // whole name (effect spans all of it)

  function build(el) {
    el.textContent = '';
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
    var el = document.getElementById('rain');
    if (!el) return;
    var letters = build(el);
    var L = letters.length;
    var t0 = null;

    function frame(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      var base = Math.floor(t / STEP_MS) % 5;     // scroll offset, +1 every 100ms
      for (var i = 0; i < L; i++) {
        letters[i].style.color = PAL[(base + i) % 5]; // each letter a distinct color
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
