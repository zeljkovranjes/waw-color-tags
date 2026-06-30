# waw-color-tags

Browser recreations of the animated clan tag effects from Call of Duty: World at War (2008).

Each effect was reverse engineered from the running game (`CoDWaW.exe`) by attaching a debugger, locating the engine color table and the clan tag dispatcher, and disassembling each animator function. The exact timing, palette, and per letter logic are reproduced in plain JavaScript, with no build step and no dependencies.

## What it is

In a modified WaW client, setting your clan tag to a special keyword triggers a built in name animation. A dispatcher compares the tag against a preset list and routes it to a small animator that rewrites the name each frame using the engine `^` color codes (or by moving characters). This project rebuilds those animators 1:1 in the browser.

Open `index.html` to see every effect running on the name `Unknown Soldier`.

## Effects

| Tag | Effect | Source function |
|-----|--------|-----------------|
| `cycl` | Sticky color wipe. One color fills the word one letter at a time, left to right, then the next color wipes in. | `0x65CED0` |
| `rain` | Per letter rainbow gradient that scrolls one step every 100 ms. Each letter is a different color. | `0x65CE20` |
| `cyln` / `krdr` | A single red letter scans back and forth, cosine driven, slow at the ends. (Cylon / Knight Rider scanner.) | `0x65D010` |
| `move` | No color. The text slides left and right inside a 40 character field. | `0x65D1A0` |
| `....` | A bouncing `o` ping pongs among the dots. Tag only. | `0x65D100` |
| `****` | A bouncing `+` ping pongs among dashes. Same function as `....`. | `0x65D100` |
| `RED` `GRN` `YELW` `BLUE` `CYAN` | Static color tags. The tag text shows in a fixed color. | `0x65D260` |

## Palette

The engine color table (`g_color_table`) used by the `^` codes:

| Code | Name | Hex |
|------|------|-----|
| `^1` | red | `#FF3333` |
| `^2` | green | `#00FF00` |
| `^3` | yellow | `#FFFF00` |
| `^4` | blue | `#0000FF` |
| `^5` | cyan | `#00FFFF` |

`^1` red and `^6` pink are softened in WaW (`^1` is `255, 51, 51`, not a pure primary), which is why a naive Quake 3 palette does not match.

## How the timing works

All animators read the millisecond clock (`winmm.timeGetTime`) and derive a step from it.

```
cycl   base = floor(t / (L*100)) % 5 ;  pos = floor(t / 100) % L
       color[i] = (i < pos) ? base : (base+4)%5      // sticky two color wipe

rain   base = floor(t / 100) % 5
       color[i] = (base + i) % 5                      // scrolling gradient, 500 ms cycle

cyln   pos = floor( (cos(t * 0.004) + 1) * 0.5 * L )  // cosine bounce, ~1571 ms
       color[i] = (i == pos) ? red : white

move   off = floor( (1 - |sin(t * 0.004)|) * (40 - L) ) // leading spaces, ~785 ms bounce

dots   phase = floor(t / 75) & 7
       pos   = phase < 4 ? phase : 7 - phase          // ping pong, 600 ms
```

`L` is the length of the animated text.

## Files

```
index.html     demo page, one line per effect
js/cycl.js     cycl wipe
js/rain.js     rain gradient
js/cyln.js     cyln / krdr scanner
js/move.js     move slide
js/dots.js     .... bouncing dot
js/stars.js    **** bouncing plus
js/colors.js   RED GRN YELW BLUE CYAN static colors
doc.txt        extracted color palette reference
```

## Running

No server or build needed. Open `index.html` in any modern browser.

## Notes

This is a clean reimplementation of the visible behavior for educational and preservation purposes. It contains no game code or assets.
