"""
generate_plate.py - Generates an individual foundation plate and exports it to GLB.
Usage: blender --background --python tools/blender/generate_plate.py -- --plate 1
"""

import sys
import argparse
from pathlib import Path
import bpy
import bmesh
import mathutils

# Add tools/blender to sys.path so imports work cleanly inside Blender
blender_dir = Path(__file__).resolve().parent
if str(blender_dir) not in sys.path:
    sys.path.insert(0, str(blender_dir))

from config import (
    MM,
    PLATES,
    PLATE_W,
    PLATE_D,
    PLATE_CORNER_R,
    BEVEL_W,
    HOLE_CENTRES,
    HOLE_DIA,
    COUNTERSINK_DIA,
    COUNTERSINK_DEPTH,
    PORT_W,
    PORT_H,
    PORT_D,
    PORT_CENTRES_X,
    PORT_Y,
    MODELS_DIR,
    BLEND_FILE,
)
from materials import setup_all_materials, create_material
from geometry import (
    make_rounded_plate,
    apply_mounting_holes,
    apply_front_ports,
    finalize_mesh,
)
from validate import validate_glb_file


def setup_scene():
    """Initializes a clean metric Blender scene."""
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    scene.unit_settings.length_unit = 'MILLIMETERS'

    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    for m in bpy.data.meshes:
        bpy.data.meshes.remove(m)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)


def apply_plate_features(obj: bpy.types.Object, plate_id: int, spec: dict):
    """Applies plate-specific surface features for plates 2-8."""
    thickness = spec["thickness"]

    if plate_id == 2:
        # Plate 2: 4 shallow input-channel grooves (0.5mm deep) across top face
        groove_bm = bmesh.new()
        groove_w = 4 * MM
        groove_d = 0.5 * MM
        for gx in [-60 * MM, -20 * MM, 20 * MM, 60 * MM]:
            bmesh.ops.create_cube(
                groove_bm,
                size=1.0,
                matrix=(
                    mathutils.Matrix.Translation((gx, 0, thickness - groove_d / 2 + 0.0001))
                    @ mathutils.Matrix.Scale(groove_w, 4, (1, 0, 0))
                    @ mathutils.Matrix.Scale(160 * MM, 4, (0, 1, 0))
                    @ mathutils.Matrix.Scale(groove_d + 0.0002, 4, (0, 0, 1))
                )
            )
        g_mesh = bpy.data.meshes.new("groove_cutter")
        groove_bm.to_mesh(g_mesh)
        groove_bm.free()
        g_obj = bpy.data.objects.new("GrooveCutter", g_mesh)
        bpy.context.collection.objects.link(g_obj)
        mod = obj.modifiers.new('GrooveBool', 'BOOLEAN')
        mod.operation = 'DIFFERENCE'
        mod.solver = 'EXACT'
        mod.object = g_obj
        bpy.ops.object.modifier_apply(modifier='GrooveBool')
        bpy.data.objects.remove(g_obj, do_unlink=True)
        bpy.data.meshes.remove(g_mesh)

    elif plate_id == 3:
        # Plate 3: 2 pairs of recessed boundary slots on long edges
        slot_bm = bmesh.new()
        slot_w = 40 * MM
        slot_d = 4 * MM
        slot_depth = 2 * MM
        for sx in [-70 * MM, 70 * MM]:
            for sy in [-PLATE_D / 2, PLATE_D / 2]:
                bmesh.ops.create_cube(
                    slot_bm,
                    size=1.0,
                    matrix=(
                        mathutils.Matrix.Translation((sx, sy, thickness - slot_depth / 2 + 0.0001))
                        @ mathutils.Matrix.Scale(slot_w, 4, (1, 0, 0))
                        @ mathutils.Matrix.Scale(slot_d * 2, 4, (0, 1, 0))
                        @ mathutils.Matrix.Scale(slot_depth + 0.0002, 4, (0, 0, 1))
                    )
                )
        s_mesh = bpy.data.meshes.new("slot_cutter")
        slot_bm.to_mesh(s_mesh)
        slot_bm.free()
        s_obj = bpy.data.objects.new("SlotCutter", s_mesh)
        bpy.context.collection.objects.link(s_obj)

        dark_mat = bpy.data.materials.get("MAT_DarkRecess")
        if dark_mat:
            s_obj.data.materials.append(dark_mat)

        mod = obj.modifiers.new('SlotBool', 'BOOLEAN')
        mod.operation = 'DIFFERENCE'
        mod.solver = 'EXACT'
        mod.object = s_obj
        bpy.ops.object.modifier_apply(modifier='SlotBool')
        bpy.data.objects.remove(s_obj, do_unlink=True)
        bpy.data.meshes.remove(s_mesh)

    elif plate_id == 4:
        # Plate 4: Hex-grid emboss pattern (low-poly 7x5 grid, 0.3mm raised) on top surface
        hex_bm = bmesh.new()
        r_hex = 10 * MM
        h_hex = 0.3 * MM
        for row in range(-2, 3):
            for col in range(-3, 4):
                hx = col * (r_hex * 1.732) + (row % 2) * (r_hex * 0.866)
                hy = row * (r_hex * 1.5)
                if abs(hx) < 100 * MM and abs(hy) < 60 * MM:
                    bmesh.ops.create_cone(
                        hex_bm,
                        cap_ends=True,
                        cap_tris=False,
                        segments=6,
                        radius1=r_hex * 0.85,
                        radius2=r_hex * 0.85,
                        depth=h_hex,
                        matrix=mathutils.Matrix.Translation((hx, hy, thickness + h_hex / 2))
                    )
        h_mesh = bpy.data.meshes.new("hex_emboss")
        hex_bm.to_mesh(h_mesh)
        hex_bm.free()
        h_obj = bpy.data.objects.new("HexEmboss", h_mesh)
        bpy.context.collection.objects.link(h_obj)
        mod = obj.modifiers.new('HexBool', 'BOOLEAN')
        mod.operation = 'UNION'
        mod.solver = 'EXACT'
        mod.object = h_obj
        bpy.ops.object.modifier_apply(modifier='HexBool')
        bpy.data.objects.remove(h_obj, do_unlink=True)
        bpy.data.meshes.remove(h_mesh)

    elif plate_id == 5:
        # Plate 5: 3 directional routing channels across top face
        chan_bm = bmesh.new()
        c_w = 3 * MM
        c_depth = 0.5 * MM
        for cy in [-30 * MM, 0, 30 * MM]:
            bmesh.ops.create_cube(
                chan_bm,
                size=1.0,
                matrix=(
                    mathutils.Matrix.Translation((0, cy, thickness - c_depth / 2 + 0.0001))
                    @ mathutils.Matrix.Scale(240 * MM, 4, (1, 0, 0))
                    @ mathutils.Matrix.Scale(c_w, 4, (0, 1, 0))
                    @ mathutils.Matrix.Scale(c_depth + 0.0002, 4, (0, 0, 1))
                )
            )
        c_mesh = bpy.data.meshes.new("chan_cutter")
        chan_bm.to_mesh(c_mesh)
        chan_bm.free()
        c_obj = bpy.data.objects.new("ChanCutter", c_mesh)
        bpy.context.collection.objects.link(c_obj)
        mod = obj.modifiers.new('ChanBool', 'BOOLEAN')
        mod.operation = 'DIFFERENCE'
        mod.solver = 'EXACT'
        mod.object = c_obj
        bpy.ops.object.modifier_apply(modifier='ChanBool')
        bpy.data.objects.remove(c_obj, do_unlink=True)
        bpy.data.meshes.remove(c_mesh)

    elif plate_id == 6:
        # Plate 6: Repeating groove pairs (sync marks)
        sync_bm = bmesh.new()
        s_w = 2 * MM
        s_d = 0.5 * MM
        for sx in [-80 * MM, -40 * MM, 0, 40 * MM, 80 * MM]:
            for offset in [-3 * MM, 3 * MM]:
                bmesh.ops.create_cube(
                    sync_bm,
                    size=1.0,
                    matrix=(
                        mathutils.Matrix.Translation((sx + offset, 0, thickness - s_d / 2 + 0.0001))
                        @ mathutils.Matrix.Scale(s_w, 4, (1, 0, 0))
                        @ mathutils.Matrix.Scale(80 * MM, 4, (0, 1, 0))
                        @ mathutils.Matrix.Scale(s_d + 0.0002, 4, (0, 0, 1))
                    )
                )
        sync_mesh = bpy.data.meshes.new("sync_cutter")
        sync_bm.to_mesh(sync_mesh)
        sync_bm.free()
        sync_obj = bpy.data.objects.new("SyncCutter", sync_mesh)
        bpy.context.collection.objects.link(sync_obj)
        mod = obj.modifiers.new('SyncBool', 'BOOLEAN')
        mod.operation = 'DIFFERENCE'
        mod.solver = 'EXACT'
        mod.object = sync_obj
        bpy.ops.object.modifier_apply(modifier='SyncBool')
        bpy.data.objects.remove(sync_obj, do_unlink=True)
        bpy.data.meshes.remove(sync_mesh)

    elif plate_id == 8:
        # Plate 8: Recessed top-panel inset (1mm deep, 260x160mm)
        inset_bm = bmesh.new()
        bmesh.ops.create_cube(
            inset_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((0, 0, thickness - 0.5 * MM + 0.0001))
                @ mathutils.Matrix.Scale(260 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(160 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(1.0 * MM + 0.0002, 4, (0, 0, 1))
            )
        )
        i_mesh = bpy.data.meshes.new("inset_cutter")
        inset_bm.to_mesh(i_mesh)
        inset_bm.free()
        i_obj = bpy.data.objects.new("InsetCutter", i_mesh)
        bpy.context.collection.objects.link(i_obj)
        mod = obj.modifiers.new('InsetBool', 'BOOLEAN')
        mod.operation = 'DIFFERENCE'
        mod.solver = 'EXACT'
        mod.object = i_obj
        bpy.ops.object.modifier_apply(modifier='InsetBool')
        bpy.data.objects.remove(i_obj, do_unlink=True)
        bpy.data.meshes.remove(i_mesh)


def generate_plate(plate_id: int, force: bool = False):
    """Generates the specified plate, exports GLB, saves .blend, and validates."""
    spec = PLATES.get(plate_id)
    if not spec:
        raise ValueError(f"Unknown plate_id: {plate_id}")

    glb_path = MODELS_DIR / f"{spec['slug']}.glb"

    # Preserve approved Plate 1
    if plate_id == 1 and not force and glb_path.exists():
        print(f"\n==========================================")
        print(f"Plate 1 ({spec['name']}) already approved and preserved.")
        print(f"Re-validating existing asset: {glb_path}")
        print(f"==========================================")
        val_report = validate_glb_file(1)
        if val_report["overall"] == "PASS":
            print(f"SUCCESS: Plate 1 verified clean.")
            return val_report

    print(f"\n==========================================")
    print(f"Generating Plate {plate_id}: {spec['name']}")
    print(f"Thickness: {spec['thickness'] * 1000:.1f} mm | Material: {spec['material']}")
    print(f"==========================================")

    setup_scene()
    setup_all_materials()

    # 1. Base plate
    obj = make_rounded_plate(
        width=PLATE_W,
        depth=PLATE_D,
        thickness=spec["thickness"],
        corner_radius=PLATE_CORNER_R,
        bevel_width=BEVEL_W,
        name=spec["object_name"],
    )

    # 2. Material assignment
    mat = bpy.data.materials.get(spec["material"])
    if mat:
        obj.data.materials.append(mat)

    # 3. 4 mounting holes
    apply_mounting_holes(
        host_obj=obj,
        thickness=spec["thickness"],
        hole_centres=HOLE_CENTRES,
        hole_dia=HOLE_DIA,
        countersink=spec.get("countersink", False),
        cs_dia=COUNTERSINK_DIA,
        cs_depth=COUNTERSINK_DEPTH,
    )

    # 4. Front ports (if Plate 1)
    if spec.get("ports"):
        dark_mat = bpy.data.materials.get("MAT_DarkRecess")
        apply_front_ports(
            host_obj=obj,
            thickness=spec["thickness"],
            port_centres_x=PORT_CENTRES_X,
            port_w=PORT_W,
            port_h=PORT_H,
            port_d=PORT_D,
            front_y=PORT_Y,
            recess_material=dark_mat,
        )

    # 5. Plate-specific surface details
    apply_plate_features(obj, plate_id, spec)

    # 6. Finalize mesh topology and normals
    finalize_mesh(obj)

    # 7. Export GLB
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    print(f"Exporting GLB to: {glb_path}")
    bpy.ops.export_scene.gltf(
        filepath=str(glb_path),
        export_format='GLB',
        export_apply=True,
        export_yup=True,
        export_materials='EXPORT',
        use_selection=True,
    )

    # 8. Save .blend files (individual plate blend + master foundation if plate 1)
    BLEND_FILE.parent.mkdir(parents=True, exist_ok=True)
    per_plate_blend = BLEND_FILE.parent / f"plate-{plate_id:02d}.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(per_plate_blend))
    print(f"Saved editable .blend file to: {per_plate_blend}")
    if plate_id == 1:
        bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_FILE))

    # 9. Run validation
    print("\nRunning 5-layer validation...")
    val_report = validate_glb_file(plate_id)

    import json
    print("=== VALIDATION RESULT ===")
    print(json.dumps(val_report, indent=2))
    print("=========================")

    if val_report["overall"] != "PASS":
        print(f"FAILED: Plate {plate_id} failed validation!")
        sys.exit(1)

    print(f"SUCCESS: Plate {plate_id} generated, exported, and validated successfully!")
    return val_report


def main():
    parser = argparse.ArgumentParser(description="Generate foundation plate")
    parser.add_argument("--plate", type=int, default=1, help="Plate ID (1-8)")
    parser.add_argument("--all", action="store_true", help="Generate all plates 1-8")
    parser.add_argument("--remaining", action="store_true", help="Generate plates 2-8 (preserves Plate 1)")
    parser.add_argument("--force", action="store_true", help="Force regenerate Plate 1")

    if "--" in sys.argv:
        idx = sys.argv.index("--")
        args = parser.parse_args(sys.argv[idx + 1:])
    else:
        args = parser.parse_args()

    if args.all:
        for p in range(1, 9):
            generate_plate(p, force=args.force)
    elif args.remaining:
        for p in range(2, 9):
            generate_plate(p, force=args.force)
    else:
        generate_plate(args.plate, force=args.force)


if __name__ == "__main__":
    main()
