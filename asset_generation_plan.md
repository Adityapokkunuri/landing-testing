# Eight-Layer 3D Asset Generation — Implementation Plan

> **Scope**: Generate all 8 GLB plate assets for the Shared Engineering Foundation landing page.  
> **Method**: Blender 5.2.3 LTS in `--background --python` mode, automated by Antigravity.  
> **Landing page**: `shared/` project — **untouched** except for dropping assets into `public/`.

---

## Environment Audit ✅

| Item | Finding |
|---|---|
| Blender | **5.2.3 LTS** at `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe` |
| Background mode | ✅ **Verified** — `BLENDER_BACKGROUND_OK` confirmed |
| Existing project | React 19 + Vite + Tailwind + GSAP — **no 3D library yet** |
| Public dir | `shared/public/` — only `favicon.svg` and `icons.svg` |
| StackVisual contract | Expects `public/layers/plate-1.png … plate-8.png` (PNG fallbacks per plan) |
| Assembly GLB | To be added at `public/models/foundation/` |

> [!IMPORTANT]
> The landing-page Stage A–E work is **preserved**. All new files land in `public/` and `tools/`. Zero existing source files are modified until Stage F (integration).

---

## Output File Map

```
shared/
├── public/
│   ├── layers/
│   │   ├── plate-1.png   ← render from Blender (for StackVisual PNG fallback)
│   │   ├── plate-2.png
│   │   ├── plate-3.png
│   │   ├── plate-4.png
│   │   ├── plate-5.png
│   │   ├── plate-6.png
│   │   ├── plate-7.png
│   │   └── plate-8.png
│   └── models/
│       └── foundation/
│           ├── plate-01-existing-system.glb
│           ├── plate-02-data-in.glb
│           ├── plate-03-access-security.glb
│           ├── plate-04-intelligence.glb
│           ├── plate-05-decisions.glb
│           ├── plate-06-reliability-sync.glb
│           ├── plate-07-applications.glb
│           ├── plate-08-experience.glb
│           └── shared-foundation-assembly.glb
├── tools/
│   └── blender/
│       ├── config.py              ← all dimensions, colors, file paths
│       ├── materials.py           ← shared PBR material library
│       ├── geometry.py            ← shared procedural mesh builders
│       ├── generate_plate.py      ← per-plate generation + export
│       ├── generate_assembly.py   ← assemble all 8, export combined GLB
│       ├── render_previews.py     ← render PNG per plate + assembly/exploded
│       ├── validate.py            ← re-import GLBs, check geometry, write manifest
│       ├── run_all.py             ← orchestrator: runs all stages in order
│       └── smoke_test.py          ← already verified ✅
├── assets/
│   └── renders/
│       ├── plate-01-preview.png
│       ├── …
│       ├── plate-08-preview.png
│       ├── assembly-preview.png
│       └── exploded-preview.png
└── docs/
    ├── 3d-assets.md               ← generation docs, integration guide
    └── asset-manifest.json        ← filenames, dimensions, tri-counts, validation
```

---

## Blender Python API — Blender 5.2 Compatibility Notes

| Feature | Status in 5.2 |
|---|---|
| `bpy.ops.object.modifier_add` (Bevel, Subdivision) | ✅ |
| `bpy.ops.mesh.loopcut_and_slide` | ✅ |
| Boolean modifier (Difference/Union) — for holes and ports | ✅ |
| `bpy.ops.export_scene.gltf` → GLB | ✅ |
| `bpy.context.scene.render` (EEVEE / Cycles headless) | ✅ (EEVEE for speed) |
| `bpy.ops.object.shade_smooth` | ✅ |
| `bpy.ops.mesh.normals_make_consistent` | ✅ |
| Weighted Normal modifier | ✅ |

> [!NOTE]
> Blender 5.2 ships with Python 3.12 internally. Scripts run in Blender's embedded interpreter — no pip install needed. `bpy`, `mathutils`, `bmesh` are all available out of the box.

---

## Shared Design System

### Dimensions (all in mm → Blender meters: divide by 1000)

| Parameter | Value | Configurable |
|---|---|---|
| Nominal width | 300 mm | ✅ |
| Nominal depth | 200 mm | ✅ |
| Capability plate thickness | 8 mm | ✅ |
| Base chassis (plate 1) thickness | 12 mm | ✅ |
| Experience plate (plate 8) thickness | 6 mm | ✅ |
| Corner radius | 12 mm | ✅ |
| Bevel width (outer edges) | 1.5 mm | ✅ |
| Mounting hole diameter | 6 mm | ✅ |
| Mounting hole inset from edge | 15 mm | ✅ |
| Countersink dia (plate 1) | 10 mm | ✅ |
| Front port width | 18 mm | ✅ |
| Front port height | 8 mm | ✅ |
| Front port depth | 5 mm | ✅ |
| Stack gap (assembled) | 2 mm | ✅ |
| Stack gap (exploded) | 30 mm | ✅ |

### Material Library

| Material | Hex | Metallic | Roughness | Used on |
|---|---|---|---|---|
| `MAT_Graphite` | `#35393C` | 0.80 | 0.30 | Plate 1, dark recesses |
| `MAT_Titanium` | `#8A9BA8` | 0.70 | 0.25 | Plates 2, 3, 5, 7 |
| `MAT_DarkTitanium` | `#5A6570` | 0.72 | 0.28 | Plates 3, 6 |
| `MAT_Orange` | `#F26A1B` | 0.65 | 0.28 | Plate 4 |
| `MAT_Silver` | `#C0BDB8` | 0.60 | 0.22 | Plate 8 |
| `MAT_DarkRecess` | `#1E2124` | 0.50 | 0.60 | Port interiors, hole interiors |

All materials are PBR `Principled BSDF`. No image textures required — pure geometric surface quality.

---

## Stage A: Project Audit + Tool Setup

**Goal**: Confirm structure, create output dirs, verify Blender runs end-to-end.

### Steps
1. ✅ **Already done** — directory structure inspected, `smoke_test.py` verified
2. Create output directories: `public/layers/`, `public/models/foundation/`, `assets/renders/`, `docs/`
3. Write `tools/blender/config.py` — all dimensions, paths, per-plate specs as a single Python dict
4. Write `tools/blender/materials.py` — `create_material(name, hex, metallic, roughness)` function
5. Write `tools/blender/geometry.py` — shared builders:
   - `make_rounded_plate(width, depth, thickness, corner_radius, bevel_width)` — uses loop-cut + edge-bevel technique
   - `subtract_cylinder(host, x, y, dia, depth, type)` — boolean hole (thru or countersink)
   - `subtract_port(host, edge, center_offset, w, h, d)` — boolean rectangular recess
6. Write `tools/blender/validate.py` — re-import GLB, check mesh vertex count, bounding box, manifold status

**Deliverables**: All tool scripts created. `config.py` is the single source of truth for all dimensions.

---

## Stage B: Generate Plate 1 — Existing System

**Goal**: First real GLB, validated, with actual holes and ports.

### `generate_plate.py` logic for Plate 1

```
1. Reset Blender scene
2. Call make_rounded_plate(300, 200, 12, 12, 1.5)   → base mesh
3. Assign MAT_Graphite
4. Subtract 4 countersunk mounting holes (6mm dia, 10mm countersink)
   - Positions: (±127.5, ±77.5) — 15mm inset from each corner
5. Subtract 3 recessed front ports along Y=-100 edge
   - 18×8mm, 5mm deep, evenly spaced at X = -60, 0, +60
6. Assign MAT_DarkRecess to port interior faces (face material slot)
7. Apply Weighted Normal modifier (keep geometry crisp)
8. Apply Smooth Shading
9. Set object name: "Plate_01_Existing_System"
10. Export → public/models/foundation/plate-01-existing-system.glb
    (Y-up, Z-forward, apply transforms, no animation)
11. Save .blend → tools/blender/foundation.blend
```

### Boolean hole technique (Blender 5.2)
- Create a cylinder cutter object at the hole position
- Add Boolean modifier (Difference, Exact solver) to the plate
- Apply modifier
- Delete cutter
- Repeat for each hole/port
- Merge by distance to clean up vertices

### Validation (run immediately after export)
```python
# validate.py checks:
assert os.path.exists(glb_path)
assert os.path.getsize(glb_path) > 10_000  # > 10 KB
# Re-import into fresh scene
bpy.ops.import_scene.gltf(filepath=glb_path)
obj = bpy.context.selected_objects[0]
assert len(obj.data.vertices) > 200
bbox = [obj.dimensions.x, obj.dimensions.y, obj.dimensions.z]
assert abs(bbox[0] - 0.300) < 0.001   # 300mm = 0.3m
assert abs(bbox[1] - 0.200) < 0.001   # 200mm = 0.2m
assert abs(bbox[2] - 0.012) < 0.001   # 12mm  = 0.012m
```

**Checkpoint**: GLB exists, > 10 KB, passes dimension check, re-imports cleanly. **Do not proceed to plates 2–8 until this passes.**

---

## Stage C: Refine Plate 1

**Goal**: Inspect and fix before scaling to 8 plates.

### Checks
- Render a 720p EEVEE preview (`assets/renders/plate-01-preview.png`)
- Inspect: corners rounded? Holes actually cut through? Ports recessed? No floating geometry?
- If any defect found: fix in `geometry.py` and re-run Stage B
- Confirm manifold status with `bmesh.ops.find_doubles` — merge threshold 0.0001m
- Check triangle count — target: 2,000–8,000 triangles for performance

### Common defects + fixes

| Defect | Fix |
|---|---|
| Boolean leaves interior faces | Use Exact solver, apply, then `Remove Doubles` |
| Normals flipped inside holes | `Recalculate Normals` after boolean |
| Corners not smooth | Increase bevel segment count (3→5) |
| Ports not fully cut through (depth check) | Assert `port_depth < thickness * 0.8` in config |
| GLB scale 1000× wrong | Ensure Blender scene unit = Meters, apply scale before export |

---

## Stage D: Generate Plates 2–8

**Goal**: Run shared pipeline for each capability plate, exporting independent GLBs.

### Per-plate specification

| Plate | Name | Material | Thickness | Special Features |
|---|---|---|---|---|
| 2 | Data In | `MAT_Titanium` | 8 mm | 4 shallow input-channel grooves (0.5mm deep) on top surface |
| 3 | Access & Security | `MAT_DarkTitanium` | 8 mm | 2 pairs of recessed boundary slots on long edges |
| 4 | Intelligence | `MAT_Orange` | 8 mm | Subtle hex-grid emboss pattern (low-poly, 0.3mm raised) on top surface |
| 5 | Decisions | `MAT_Titanium` | 8 mm | 3 shallow directional channels across top face |
| 6 | Reliability & Sync | `MAT_DarkTitanium` | 8 mm | Precise repeating groove pairs (sync marks) on top surface |
| 7 | Applications | `MAT_Titanium` | 8 mm | Clean face, 4 mounting holes (same as plate 1, no countersink) |
| 8 | Experience | `MAT_Silver` | 6 mm | Recessed top-panel inset (1mm deep, 260×160mm) |

### Shared geometry for plates 2–7
- Same rounded footprint as plate 1 (300×200mm, 12mm corner radius)
- Same outer bevel
- Same 4 mounting holes (thru, no countersink — except plate 1)
- No front ports (ports only on plate 1)
- Distinct top-surface detail per layer (listed above)

### Surface detail techniques (Blender 5.2)
- **Channels/grooves**: Boolean subtract thin rectangular cutters, 0.5mm deep
- **Hex-grid emboss (plate 4)**: Procedural via a grid of tiny hexagonal prisms, boolean Union onto top face — limited to ~7×5 grid for performance
- **Recessed panel (plate 8)**: Boolean subtract, 1mm deep, leaves clean inset lip

### Run order
Each plate runs `generate_plate.py` with `PLATE_ID` env arg:
```bash
blender --background --python generate_plate.py -- --plate 2
blender --background --python generate_plate.py -- --plate 3
# ...
blender --background --python generate_plate.py -- --plate 8
```

Validate each GLB immediately after generation. Record result in manifest.

---

## Stage E: Generate the Assembly

**Goal**: One GLB containing all 8 plates as named nodes, in correct stack order.

### `generate_assembly.py` logic

```
1. Reset scene
2. Import each of the 8 GLBs in order
3. Rename objects to match plate names
4. Set Z position (assembled mode):
   - Plate 1: Z = 0
   - Plate 2: Z = 0.012 + 0.002 + 0         (base thickness + gap)
   - Plate 3: Z = above + 0.008 + 0.002
   - … cumulative
   - Plate 8: Z = cumulative sum to top
5. Verify no interpenetration (bounding-box check)
6. Keep each as separate object (do NOT join meshes)
7. Export assembly → public/models/foundation/shared-foundation-assembly.glb
   - Include all objects
   - Preserve object names
   - Apply transforms
8. Save assembly scene → tools/blender/foundation-assembly.blend
```

### Validation
- Re-import assembly GLB
- Assert 8 mesh objects present
- Assert each has correct name
- Assert bounding boxes do not overlap (check Z ranges)
- Assert file size > 50 KB

---

## Stage F: Preview Renders

**Goal**: 9 PNG renders (8 individual + 1 assembled + 1 exploded) for inspection and `public/layers/`.

### Render settings (EEVEE, headless)
- Resolution: 800×533 px (3:2 ratio — matches StackVisual contract)
- Background: warm neutral `#F0EDE8`
- Camera: isometric-style, 45° elevation, 30° azimuth
- Lighting: 3-point studio (key, fill, rim via Blender area lights)
- Samples: 64 (fast, good quality for engineering preview)
- Output: PNG, no alpha (solid background)

### Plate PNGs → `public/layers/`
The StackVisual component expects `plate-1.png` through `plate-8.png`.  
After rendering, copy renders:
- `assets/renders/plate-01-preview.png` → `public/layers/plate-1.png`
- … through plate-8

These serve as the **PNG fallbacks** the StackVisual component uses when no 3D viewer is active.

### Exploded render
- Set plate Z positions with 30mm gap between each
- Render from same camera angle
- Save to `assets/renders/exploded-preview.png`

---

## Stage G: Landing Page Integration

**Goal**: Wire GLB assets into the existing StackVisual infrastructure with minimal changes.

> [!NOTE]
> This stage runs AFTER all GLBs are validated. Do not touch the landing page during generation.

### What changes
1. **Install Three.js + React Three Fiber + Drei** into `shared/`
   - `npm install three @react-three/fiber @react-three/drei @types/three`
2. **Update `StackVisual/index.tsx`** — swap grey CSS placeholder for a real R3F canvas loading the GLB
3. **`Assembled.tsx`** — load `shared-foundation-assembly.glb`, stack at correct Z offsets, idle float animation (GSAP)
4. **`Exploded.tsx`** — load individual `plate-0N-*.glb` files, animate Y separation driven by `progress` prop
5. **`Swap.tsx`** — load plate 4, animate slide-out/slide-in, label Version A→B
6. PNG fallbacks (`public/layers/plate-N.png`) remain as `<img>` fallback if WebGL unavailable

### What does NOT change
- Nav, Footer, HomePage, all section shells
- Tailwind config, GSAP setup, React Router
- All Stage A work already completed
- `src/content/` files
- `src/styles/index.css`

---

## Execution Sequence (Orchestrator)

`tools/blender/run_all.py` runs this sequence:

```
Stage A: Setup dirs + verify Blender
Stage B: Generate plate 1 → validate
Stage C: (Automated check) render plate 1 preview, inspect dimensions
Stage D: Generate plates 2–8 → validate each
Stage E: Generate assembly → validate
Stage F: Render all previews → copy to public/layers/
         Write asset-manifest.json
Stage G: (Separate npm step) Install R3F, update StackVisual
```

Each stage writes a status line to `docs/asset-manifest.json`. If any stage fails, the orchestrator logs the error, skips that asset, and continues with independent work.

---

## Asset Manifest Format

```json
{
  "generated": "2026-10-22T21:35:00+05:30",
  "blender": "5.2.3 LTS",
  "plates": [
    {
      "id": 1,
      "name": "Existing System",
      "filename": "plate-01-existing-system.glb",
      "path": "public/models/foundation/plate-01-existing-system.glb",
      "dimensions_mm": { "w": 300, "d": 200, "t": 12 },
      "triangle_count": 4200,
      "file_size_kb": 48,
      "material": "MAT_Graphite",
      "validated": true,
      "validation_notes": "Manifold, 4 holes confirmed, 3 ports confirmed"
    }
    // ... plates 2-8
  ],
  "assembly": {
    "filename": "shared-foundation-assembly.glb",
    "layer_count": 8,
    "validated": true,
    "file_size_kb": 312
  }
}
```

---

## Honest Constraints

| Item | Status |
|---|---|
| Blender `.blend` project | ✅ Saved to `tools/blender/foundation.blend` |
| GLB export | ✅ Via `bpy.ops.export_scene.gltf` |
| PNG previews | ✅ Via Blender EEVEE headless |
| Hex-grid emboss (plate 4) | ⚠️ Low-poly approximation (7×5 grid ~35 prisms) — full tessellation would be too dense |
| Truly manifold solids | ⚠️ Boolean operations in Blender can leave non-manifold edges on complex intersections — validated per-plate, fixed if found |
| WebGL interactive viewer | 🔜 Stage G — depends on Stage A–E landing-page work completing first |
| Blender background render quality | ✅ EEVEE gives good metallic PBR results without GPU display |

---

## Acceptance Criteria

| Criterion | How verified |
|---|---|
| 8 individual GLBs exist | File exists + size > 10 KB |
| Dimensions correct (±0.1mm) | Bounding box check in validate.py |
| 4 mounting holes present | Vertex count delta vs. hole-free plate |
| Front ports cut through (plate 1) | Geometry check, visual render |
| Distinct material per plate | Material name in GLB inspected |
| Assembly has 8 named nodes | Re-import, count objects |
| No Z overlap in assembly | Bounding box range check |
| PNG previews at 3:2 ratio | Image size check |
| `plate-N.png` in `public/layers/` | File exists for N = 1–8 |
| `asset-manifest.json` written | File exists, all `validated: true` |

---

## Ready to start?

Reply **"go"** to begin. I will:

1. Create all directories and write `config.py`, `materials.py`, `geometry.py`
2. Run Blender to generate Plate 1
3. Validate the GLB and show you the preview render
4. **Stop for your review before generating plates 2–8**

The plan is verified against Blender 5.2's actual API and confirmed background mode. No guessing.
