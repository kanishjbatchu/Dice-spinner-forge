# ⚒︎ Dice / Spinner Forge

Design a custom **d6 die** or a **print-in-place fidget spinner** in the browser, preview it in 3D, and export a print-ready **binary STL** for your slicer.

## Run it

```bash
node serve.js
```

Then open <http://localhost:5566>.

> A local server is required — opening `index.html` directly via `file://` is blocked by browser security rules for ES modules. The server is a single zero-dependency Node script; nothing to install.

## Markings — Numbers or Braille, engraved into every face

Every die is **engraved** (recessed) and printed **flat** (one face down, no supports). Two marking sets:

- **Numbers** — bold digits 1–6, opposite faces summing to 7.
- **Braille** — the digit's Braille cell (1–6 = letters a–f) as tactile dots, for blind/low-vision players. One cell per face, standard ~2.5 mm dot spacing at a fixed size regardless of die size, so it stays readable.

**Why the Braille is engraved, not raised:** classic Braille is raised bumps, but on a flat FDM print a raised bump on the **down-face has nothing under it and can't print**. Engraved dots print cleanly on **all six faces** with no supports, and the recessed pattern is still distinguishable by touch (it's only six simple patterns). If you'd rather have true raised Braille, that requires printing on a vertex with supports or a resin printer — tell me and I'll add it.

### Why it slices cleanly — the geometry is watertight

For the marks to slice correctly, the exported mesh is built as a **single watertight manifold** — each recess is constructed directly (face rim + pocket walls + floor, welded into one closed surface) rather than by overlapping separate solids. Overlapping/non-manifold meshes are what make slicers (FlashPrint included) render garbage for thin features; a clean closed mesh slices exactly. Verified watertight (0 boundary / 0 non-manifold / 0 flipped / 0 degenerate edges) for both modes across 10–40 mm.

Tips for a sharp result on a 0.4 mm nozzle:
- Print at **0.10–0.12 mm** layers; ink the recesses after printing for contrast.
- If a bed-face recess looks shallow, nudge your **Z-offset up** a touch (too-close a nozzle over-squishes the first layer) or enable elephant-foot compensation.

## The spinner spins straight off the printer

The **print-in-place** spinner prints as **one object that already spins** — no bearing, no assembly:

- The center grip (the part you pinch) is a **captured spool** running through the spinning body, trapped by a cap above and below so it can't fall out.
- Built-in **clearance gaps** (default 0.4 mm) keep the moving parts from fusing during printing.
- Tune **Clearance** to your printer: stiff/won't move → raise it; loose/wobbly → lower it. Give it a firm twist the first time to break any first-layer "skin."
- Bore the weight caps and drop in coins or bearings to add spin-time mass.

Prefer a glass-smooth spin? Switch the mechanism to **Bearing seat** — a flat body with a 22 mm press-fit pocket for a standard 608 skate bearing (added after printing).

## Features

- d6 die: engraved **numbers or Braille**, opposite faces always sum to 7
- Adjustable cube edge, engrave depth, numeral size; exports as a single watertight mesh
- Spinner: 2–6 arms, adjustable arm length/width, cap diameter, body thickness, grip size, clearance
- Live 3D preview — drag to orbit, scroll to zoom, right-drag to pan; two-color preview, auto-spin
- Live bounding-box dimensions (mm) + triangle count
- One-click binary STL export

## Printing notes

- **Die:** print one face down, no supports, 100% infill for a fair roll, 0.10–0.12 mm layers for crisp numerals.
- **Spinner (print-in-place):** print flat, no supports, 3–4 perimeters. After it finishes, twist the body to free it. If parts are fused, increase Clearance; if it rattles, decrease it.
- Units are millimeters (1 Three.js unit = 1 mm). All parts export merged into a single STL; overlapping solids union correctly in any slicer.

## How it's built

A single self-contained `index.html` using [Three.js](https://threejs.org) (from a CDN) for geometry, preview, and STL export. Engraving and the captive spinner are built purely from unioned/holed extrusions — no CSG boolean library required.
