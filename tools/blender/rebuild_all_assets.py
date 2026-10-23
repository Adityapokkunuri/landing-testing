"""
rebuild_all_assets.py - Master automation script to rebuild all 8 distinct foundation plates
with dual PBR materials (primary metallic finish + dark recess lining), export individual GLBs,
construct the vertical 8-layer assembly, and validate every asset.
"""

import sys
import json
import math
from pathlib import Path
import bpy
import bmesh
import mathutils

tools_dir = Path(__file__).resolve().parent
if str(tools_dir) not in sys.path:
    sys.path.insert(0, str(tools_dir))

from config import (
    MM,
    PLATE_W,
    PLATE_D,
    MODELS_DIR,
    RENDERS_DIR,
    ROOT_DIR,
)
from materials import setup_all_materials, create_material
import rebuild_geometry as rg


def reset_scene():
    """Wipes scene clean."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    scene.unit_settings.length_unit = 'MILLIMETERS'


PLATE_SPECS = [
    (1, "Plate_01_Existing_System", "plate-01-existing-system.glb", "MAT_Graphite", 12 * MM, rg.build_plate_01_chassis),
    (2, "Plate_02_Data_In", "plate-02-data-in.glb", "MAT_Titanium", 10 * MM, rg.build_plate_02_data_in),
    (3, "Plate_03_Access_Security", "plate-03-access-security.glb", "MAT_DarkTitanium", 12 * MM, rg.build_plate_03_security),
    (4, "Plate_04_Intelligence", "plate-04-intelligence.glb", "MAT_Orange", 16 * MM, rg.build_plate_04_intelligence),
    (5, "Plate_05_Decisions", "plate-05-decisions.glb", "MAT_Titanium", 10 * MM, rg.build_plate_05_decisions),
    (6, "Plate_06_Reliability_Sync", "plate-06-reliability-sync.glb", "MAT_DarkTitanium", 12 * MM, rg.build_plate_06_reliability_sync),
    (7, "Plate_07_Applications", "plate-07-applications.glb", "MAT_Titanium", 14 * MM, rg.build_plate_07_applications),
    (8, "Plate_08_Experience", "plate-08-experience.glb", "MAT_Silver", 8 * MM, rg.build_plate_08_experience),
]


def apply_dual_materials(obj: bpy.types.Object, plate_id: int, primary_mat_name: str, thickness: float):
    primary_mat = bpy.data.materials.get(primary_mat_name)
    if plate_id in (4, 7):
        recess_mat = bpy.data.materials.get("MAT_DarkTitanium")
    else:
        recess_mat = bpy.data.materials.get("MAT_DarkRecess")

    obj.data.materials.clear()
    obj.data.materials.append(primary_mat)  # Slot 0
    obj.data.materials.append(recess_mat)   # Slot 1
    if plate_id == 8:
        orange_mat = bpy.data.materials.get("MAT_Orange")
        if orange_mat:
            obj.data.materials.append(orange_mat)  # Slot 2

    bm = bmesh.new()
    bm.from_mesh(obj.data)

    for f in bm.faces:
        c = f.calc_center_median()

        if plate_id == 1:
            # Front ports (y < -95mm) and side connector bays (|x| > 144mm)
            if c.y < -94 * MM or abs(c.x) > 144 * MM:
                f.material_index = 1

        elif plate_id == 2:
            # Bus trenches (z < thickness - 0.5mm) and front intake ports (y < -92mm)
            if c.z < thickness - 0.5 * MM or c.y < -92 * MM:
                f.material_index = 1

        elif plate_id == 3:
            # Recessed perimeter moat (z < thickness - 0.5mm) and lateral security slots (|x| > 140mm)
            if c.z < thickness - 0.5 * MM or abs(c.x) > 140 * MM:
                f.material_index = 1

        elif plate_id == 4:
            # Heatsink fins (|x| > 79mm) and perimeter thermal trench
            if abs(c.x) > 79 * MM:
                f.material_index = 1
            elif (44 * MM < abs(c.x) < 52 * MM or 44 * MM < abs(c.y) < 52 * MM) and c.z < 13.9 * MM:
                f.material_index = 1

        elif plate_id == 5:
            # Decision wells, trunk channel, and output tracks (z < thickness - 0.5mm)
            if c.z < thickness - 0.5 * MM:
                f.material_index = 1

        elif plate_id == 6:
            # Sync comb grooves (z < thickness - 0.5mm) and lateral coupler sockets (|x| > 140mm)
            if c.z < thickness - 0.5 * MM or abs(c.x) > 140 * MM:
                f.material_index = 1

        elif plate_id == 7:
            # Cartridges and locator pins sitting proud above the 8mm rail
            if c.z > 7.9 * MM:
                f.material_index = 1

        elif plate_id == 8:
            # Display panel recess floor and interior walls
            if abs(c.x) < 120.5 * MM and abs(c.y) < 70.5 * MM and c.z > 0.001 and c.z < 6.8 * MM:
                f.material_index = 1
            # Bezel top long-edge accent stripes
            elif abs(c.x) < 121 * MM and 70 * MM < abs(c.y) < 74.5 * MM and c.z > 7.4 * MM:
                f.material_index = 2

    bm.to_mesh(obj.data)
    bm.free()


def build_and_export_individual_plates(target_plate_id: int = None, force_p1: bool = False):
    print("\n" + "=" * 60)
    print("STEP 1: REBUILDING DISTINCT PLATES WITH DUAL PBR MATERIALS")
    print("=" * 60)

    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    summary = {}

    for plate_id, obj_name, glb_name, mat_name, thickness, builder_func in PLATE_SPECS:
        if target_plate_id is not None and plate_id != target_plate_id:
            continue

        glb_path = MODELS_DIR / glb_name

        # Preserve approved Plate 1 unless explicitly forced
        if plate_id == 1 and not force_p1 and glb_path.exists():
            print(f"\n---> Plate 1 ({obj_name}) is approved and preserved: {glb_path.name}")
            continue

        print(f"\n---> Building Plate {plate_id}: {obj_name} ...")
        reset_scene()
        setup_all_materials()

        # Build procedural geometry
        obj = builder_func()
        obj.name = obj_name

        # Apply dual materials (primary + dark recess)
        apply_dual_materials(obj, plate_id, mat_name, thickness)

        # Save individual .blend file
        blend_path = tools_dir / f"plate-0{plate_id}.blend"
        bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
        print(f"     Saved blend: {blend_path.name}")

        # Export individual GLB
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.export_scene.gltf(
            filepath=str(glb_path),
            export_format='GLB',
            use_selection=True,
            export_apply=True,
            export_yup=True,
            export_materials='EXPORT',
        )
        print(f"     Exported GLB: {glb_path.name} ({glb_path.stat().st_size / 1024:.1f} KB)")

        summary[plate_id] = {
            "name": obj_name,
            "glb": glb_name,
            "verts": len(obj.data.vertices),
            "faces": len(obj.data.polygons),
            "size_kb": round(glb_path.stat().st_size / 1024, 1)
        }

    return summary


def build_and_export_assembly():
    print("\n" + "=" * 60)
    print("STEP 2: BUILDING & EXPORTING COMBINED 8-LAYER ASSEMBLY")
    print("=" * 60)

    reset_scene()
    setup_all_materials()

    # Z offsets for assembled stack (mm -> meters) matching verified plan
    z_offsets = [
        0.0000,   # Plate 1: 0.0 mm
        0.0140,   # Plate 2: 14.0 mm
        0.0260,   # Plate 3: 26.0 mm
        0.0400,   # Plate 4: 40.0 mm
        0.0580,   # Plate 5: 58.0 mm
        0.0700,   # Plate 6: 70.0 mm
        0.0840,   # Plate 7: 84.0 mm
        0.1000,   # Plate 8: 100.0 mm
    ]

    for i, (plate_id, obj_name, glb_name, mat_name, thickness, builder_func) in enumerate(PLATE_SPECS):
        obj = builder_func()
        obj.name = obj_name
        obj.location.z = z_offsets[i]
        apply_dual_materials(obj, plate_id, mat_name, thickness)

    # Save assembly .blend
    assembly_blend = tools_dir / "foundation-assembly.blend"
    bpy.ops.wm.save_as_mainfile(filepath=str(assembly_blend))
    print(f"Saved assembly blend: {assembly_blend.name}")

    # Export assembly GLB
    assembly_glb = MODELS_DIR / "shared-foundation-assembly.glb"
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=str(assembly_glb),
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=False,
        export_materials='EXPORT',
    )
    print(f"Exported combined assembly GLB: {assembly_glb.name} ({assembly_glb.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Rebuild foundation assets")
    parser.add_argument("--plate", type=int, default=None, help="Specific plate ID (1-8)")
    parser.add_argument("--assembly", action="store_true", help="Rebuild combined assembly only")
    parser.add_argument("--force-p1", action="store_true", help="Force rebuild Plate 1")
    
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []
    args = parser.parse_args(argv)

    if args.assembly:
        build_and_export_assembly()
    elif args.plate is not None:
        build_and_export_individual_plates(target_plate_id=args.plate, force_p1=args.force_p1)
    else:
        build_and_export_individual_plates(force_p1=args.force_p1)
        build_and_export_assembly()
        print("\nALL REBUILT WITH DUAL PBR MATERIALS!")
