/* ============================================================================
   cycl.js - WaW "[cycl]" clan-tag effect (EXACT recreation)

   Reverse-engineered live from the running, modded CoDWaW.exe via x32dbg.
   The effect is baked into the game binary (not an external cheat): a dispatcher
   at 0x65D2F0 matches the clan tag against a preset table in .rdata; the tag
   "cycl" routes to the animator at 0x65CED0, which rewrites the tag as an engine
   ^-color-coded string into buffer 0x4DE9590 every frame. The player NAME stays
   ^7 white; only the bracketed tag animates.

   It is STEPPED (discrete engine color codes), NOT a smooth HSV blend: the color
   snaps every 100ms, driven by winmm timeGetTime() (a millisecond clock).

   Palette = the 5 engine color codes ^1..^5, read live from g_color_table
   @ 0x00838680:
     ^1 #FF3333 red   ^2 #00FF00 green   ^3 #FFFF00 yellow
     ^4 #0000FF blue  ^5 #00FFFF cyan
   (^5 is cyan in this build, verified from memory.)

   NOTE: in-game the animation covers ONLY the 4-char "cycl" tag (name stays
   white). This build intentionally applies it to the ENTIRE displayed name, so
   L below is the full string length and the wave sweeps across the whole name.

   CYCL animator (0x65CED0) - verified by FULL disassembly. L = animated length:
     t    = timeGetTime() - t0                  // ms since start
     base = floor(t / (L*100)) % 5              // the incoming color, +1 every L*100ms
     pos  = floor(t / 100)     % L              // wipe boundary, +1 letter every 100ms
   It writes a ^-coded string "^<base> <chars> ^7" and inserts ONE extra code
   "^<base-1>" right before letter `pos`. Because engine ^-codes are STICKY, that
   single insertion recolors letter `pos` AND everything after it:
     color[i] = (i < pos) ? base : (base+4)%5          // (base+4)%5 == base-1 mod 5
   So a color wipes across the word one letter at a time (D, then O, then G...),
   leaving each letter changed, then the next color wipes in.
   One color's wipe = L*100ms; full 5-color cycle = 5*L*100ms.

   Decoded magic constants (codwaw.exe): /100 via 0x51EB851F @0x65CE50/0x65CF61,
   *100 via 0x64 @0x65CF12, %5 via 0x66666667. Timer ptr @0x7EB39C -> timeGetTime.
   ============================================================================ */
(function () {
  'use strict';

  var PAL = ['#FF3333', '#00FF00', '#FFFF00', '#0000FF', '#00FFFF']; // ^1..^5
  var STEP_MS = 100;                   // color snaps every 100ms
  var FULL = 'Unknown Soldier';  // whole name - the effect spans all of it

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
    var el = document.getElementById('cycl');
    if (!el) return;
    var letters = build(el);
    var L = letters.length;
    var t0 = null;

    function frame(now) {
      if (t0 === null) t0 = now;
      var t = now - t0;
      var base = Math.floor(t / (L * STEP_MS)) % 5;   // incoming color
      var pos  = Math.floor(t / STEP_MS) % L;         // wipe boundary (sweeps left->right)
      for (var i = 0; i < L; i++) {
        // engine ^-codes are STICKY: one "^behind" code is inserted at `pos`, so
        // letters before the boundary show the new color and letters at/after it
        // keep the previous color -> the boundary wipes the new color across.
        var idx = (i < pos) ? base : (base + 4) % 5;
        letters[i].style.color = PAL[idx];
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
