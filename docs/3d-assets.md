# Shared Engineering Foundation — 3D Asset Library

> **Generated**: 2026-10-22T23:40:00.703258  
> **Blender Version**: 5.2.3 LTS  
> **Coordinate System**: GLTF standard (Y-up, right-handed), Metric scale 1.0 (1 unit = 1 meter)  
> **Mounting Holes**: 4 through-holes, Ø 6.0 mm, inset 15 mm from outer boundaries (coordinates: X = ±135.0 mm, Y = ±85.0 mm)

---

## 1. Asset Manifest Summary

| # | Component Name | Material | Hex | Thickness | Vertices | Triangles | GLB Size | Status |
|:---:|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **Existing System** | `MAT_Graphite` | `#35393C` | 12.0 mm | 0 | 0 | 61.73 KB | ✅ **FAIL** |
| 2 | **Data In** | `MAT_Titanium` | `#8A9BA8` | 8.0 mm | 0 | 0 | 67.48 KB | ✅ **FAIL** |
| 3 | **Access & Security** | `MAT_DarkTitanium` | `#5A6570` | 8.0 mm | 0 | 0 | 44.99 KB | ✅ **FAIL** |
| 4 | **Intelligence** | `MAT_Orange` | `#F26A1B` | 8.0 mm | 0 | 0 | 113.59 KB | ✅ **FAIL** |
| 5 | **Decisions** | `MAT_Titanium` | `#8A9BA8` | 8.0 mm | 0 | 0 | 54.83 KB | ✅ **FAIL** |
| 6 | **Reliability & Sync** | `MAT_DarkTitanium` | `#5A6570` | 8.0 mm | 0 | 0 | 78.0 KB | ✅ **FAIL** |
| 7 | **Applications** | `MAT_Titanium` | `#8A9BA8` | 8.0 mm | 0 | 0 | 47.11 KB | ✅ **FAIL** |
| 8 | **Experience** | `MAT_Silver` | `#C0BDB8` | 6.0 mm | 0 | 0 | 50.88 KB | ✅ **FAIL** |

| Σ | **Complete Assembly** | *Multi-PBR* | — | 80.0 mm | — | — | 515.26 KB | ✅ **FAIL** |

---

## 2. Material Specifications (Principled BSDF)

| Material Key | Color Preview | Hex Code | Metallic | Roughness | Assigned To |
|---|:---:|:---:|:---:|:---:|---|
| `MAT_Graphite` | `#35393C` | `#35393C` | 0.80 | 0.30 | Base chassis graphite metallic |
| `MAT_Titanium` | `#8A9BA8` | `#8A9BA8` | 0.70 | 0.25 | Standard titanium metallic |
| `MAT_DarkTitanium` | `#5A6570` | `#5A6570` | 0.72 | 0.28 | Dark security/sync titanium |
| `MAT_Orange` | `#F26A1B` | `#F26A1B` | 0.65 | 0.28 | Accent intelligence layer orange |
| `MAT_Silver` | `#C0BDB8` | `#C0BDB8` | 0.60 | 0.22 | Top experience silver surface |
| `MAT_DarkRecess` | `#1E2124` | `#1E2124` | 0.50 | 0.60 | Port and recess interior lining |

---

## 3. Component Details & Geometric Features

### Plate 1: Existing System (Foundation Base)
- **File**: `public/models/foundation/plate-01-existing-system.glb`
- **Thickness**: 12.0 mm (Chassis structural anchor)
- **Material**: `MAT_Graphite` (`#35393C`, metallic 0.80, roughness 0.30)
- **Features**: 4 countersunk mounting holes (Ø 6 mm through, Ø 10 mm × 3 mm countersink), 3 front interface ports (18 × 8 mm, 5 mm deep) with `MAT_DarkRecess` lining.

### Plate 2: Data In
- **File**: `public/models/foundation/plate-02-data-in.glb`
- **Thickness**: 8.0 mm
- **Material**: `MAT_Titanium` (`#8A9BA8`, metallic 0.70, roughness 0.25)
- **Features**: 4 precision through-mounting holes, 4 shallow input-channel grooves (4 mm wide, 0.5 mm deep, 160 mm long) running along Y.

### Plate 3: Access & Security
- **File**: `public/models/foundation/plate-03-access-security.glb`
- **Thickness**: 8.0 mm
- **Material**: `MAT_DarkTitanium` (`#5A6570`, metallic 0.72, roughness 0.28)
- **Features**: 4 precision through-mounting holes, 2 pairs of recessed boundary slots (40 × 4 mm, 2 mm deep) with `MAT_DarkRecess` lining.

### Plate 4: Intelligence (Hero Layer)
- **File**: `public/models/foundation/plate-04-intelligence.glb`
- **Thickness**: 8.0 mm
- **Material**: `MAT_Orange` (`#F26A1B`, metallic 0.65, roughness 0.28)
- **Features**: 4 precision through-mounting holes, subtle hexagonal surface emboss pattern (35 prisms, 0.3 mm raised), distinct vibrant engineering orange finish.

### Plate 5: Decisions
- **File**: `public/models/foundation/plate-05-decisions.glb`
- **Thickness**: 8.0 mm
- **Material**: `MAT_Titanium` (`#8A9BA8`, metallic 0.70, roughness 0.25)
- **Features**: 4 precision through-mounting holes, 3 shallow directional routing channels (3 mm wide, 0.5 mm deep, 240 mm long) running across X.

### Plate 6: Reliability & Sync
- **File**: `public/models/foundation/plate-06-reliability-sync.glb`
- **Thickness**: 8.0 mm
- **Material**: `MAT_DarkTitanium` (`#5A6570`, metallic 0.72, roughness 0.28)
- **Features**: 4 precision through-mounting holes, repeating groove pairs (sync marks, 2 mm wide, 0.5 mm deep).

### Plate 7: Applications
- **File**: `public/models/foundation/plate-07-applications.glb`
- **Thickness**: 8.0 mm
- **Material**: `MAT_Titanium` (`#8A9BA8`, metallic 0.70, roughness 0.25)
- **Features**: 4 precision through-mounting holes, clean minimalist machined top face.

### Plate 8: Experience (Top Surface)
- **File**: `public/models/foundation/plate-08-experience.glb`
- **Thickness**: 6.0 mm
- **Material**: `MAT_Silver` (`#C0BDB8`, metallic 0.60, roughness 0.22)
- **Features**: 4 precision through-mounting holes, recessed top presentation panel (260 × 160 mm, 1.0 mm deep) with 20 mm raised perimeter border.

---

## 4. Stack Assembly

- **File**: `public/models/foundation/shared-foundation-assembly.glb` (192 KB)
- **Editable Scene**: `tools/blender/foundation-assembly.blend`
- **Nodes**: 8 individual mesh nodes preserved (`Plate_01_Existing_System` … `Plate_08_Experience`).
- **Stack Height**: 80.0 mm (Assembled with 2.0 mm inter-layer gap).
- **Exploded View**: 284.0 mm (Exploded with 30.0 mm inter-layer gap).

---

## 5. Visual Renders & Fallbacks

- **Studio Preview Images**: `assets/renders/` (10 PNGs at 800 × 533 px)
  - `plate-01-preview.png` … `plate-08-preview.png`
  - `assembly-preview.png`
  - `exploded-preview.png`
- **StackVisual Fallbacks**: `public/layers/plate-1.png` … `plate-8.png`
