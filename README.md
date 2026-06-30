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

## Spinner — two mechanisms

**Bearing (default)** — a realistic fidget-spinner body: rounded lobes joined by concave waists, with a **press-fit seat in the center for your bearing**, plus matching cap buttons.
- Set **Bearing Ø (OD)** to your bearing's outer diameter (default **12 mm**). The center hole is a clean cylinder at that size; FDM prints holes a hair small, so the bearing presses in and grips. Ream/sand if too tight.
- Set **Body thickness** to your bearing's thickness for a flush fit.
- **Arm length** = how far the lobes sit from center; **Lobe Ø** = lobe size. Lobes are solid for spin weight, with optional **recessed finger-grip dimples** on top.
- **Cap buttons:** the two pinch-caps print *beside* the body (so it's one print). Each has a peg that press-fits the bearing's **inner bore** — set **Bearing bore (ID)** to that diameter. A small boss keeps the cap clear of the body so it spins free. Press the bearing into the center, then press a cap onto each side.

**Print-in-place** — prints as **one object that already spins**, no bearing or assembly:
- The center grip is a **captured spool** trapped by a cap above and below; built-in **clearance gaps** (default 0.4 mm) stop the parts fusing while printing.
- Tune **Clearance**: stiff → raise it; wobbly → lower it. Give it a firm twist the first time to free it.

## Features

- d6 die: engraved **numbers or Braille**, opposite faces always sum to 7
- Adjustable cube edge, engrave depth, numeral size; exports as a single watertight mesh
- Spinner: realistic lobed body (2–6 lobes) with a press-fit bearing seat, or a print-in-place mechanism; adjustable arm length, lobe/cap size, thickness
- Live 3D preview — drag to orbit, scroll to zoom, right-drag to pan; two-color preview, auto-spin
- Live bounding-box dimensions (mm) + triangle count
- One-click binary STL export

## Printing notes

- **Die:** print one face down, no supports, 100% infill for a fair roll, 0.10–0.12 mm layers for crisp numerals.
- **Spinner (bearing):** print flat, no supports, 3–4 perimeters. The body and both caps print together. Press the bearing into the center seat (a vise or two flat surfaces help), then press a cap onto each side. Too tight → sand the bore or drop the bearing OD by ~0.1 mm; too loose → add ~0.1 mm. Tune **Bearing bore (ID)** so the cap pegs grip the bearing's inner race.
- **Spinner (print-in-place):** print flat, no supports, 3–4 perimeters. Twist the body to free it after printing; fused → raise Clearance, rattly → lower it.
- Units are millimeters (1 Three.js unit = 1 mm). All parts export merged into a single STL; overlapping solids union correctly in any slicer.

## How it's built

A single self-contained `index.html` using [Three.js](https://threejs.org) (from a CDN) for geometry, preview, and STL export. Engraving and the captive spinner are built purely from unioned/holed extrusions — no CSG boolean library required.
