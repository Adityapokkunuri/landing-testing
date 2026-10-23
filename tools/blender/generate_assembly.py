"""
generate_assembly.py - Builds the 8-layer foundation stack assembly and exports to GLB.
Preserves separate named nodes for each plate layer and applies cumulative Z stacking offsets.
"""

import sys
from pathlib import Path
import bpy  # type: ignore
import bmesh  # type: ignore
import mathutils  # type: ignore

blender_dir = Path(__file__).resolve().parent
if str(blender_dir) not in sys.path:
    sys.path.insert(0, str(blender_dir))

from config import (
    MM,
    PLATES,
    GAP_ASSEMBLED,
    GAP_EXPLODED,
    MODELS_DIR,
    ASSEMBLY_BLEND_FILE,
)


def build_assembly(exploded: bool = False) -> bpy.types.Scene:
    """
    Imports all 8 GLB plates into a clean scene and positions them along Z
    with cumulative vertical offsets and the specified gap.
    """
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    scene.unit_settings.length_unit = 'MILLIMETERS'

    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat)

    gap = GAP_EXPLODED if exploded else GAP_ASSEMBLED
    current_z = 0.0
    imported_objects = []

    for p_id in range(1, 9):
        spec = PLATES[p_id]
        glb_path = MODELS_DIR / f"{spec['slug']}.glb"
        if not glb_path.exists():
            raise FileNotFoundError(f"Missing GLB for plate {p_id}: {glb_path}")

        # Note selected objects before import
        existing_objs = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=str(glb_path))
        new_objs = [o for o in bpy.data.objects if o not in existing_objs and o.type == 'MESH']

        if not new_objs:
            raise RuntimeError(f"No mesh found in imported GLB: {glb_path}")

        obj = new_objs[0]
        obj.name = spec["object_name"]
        if obj.data:
            obj.data.name = f"{spec['object_name']}_Mesh"

        # Ensure canonical Blender Z-up orientation if Y and Z are swapped on import
        if obj.dimensions.z > obj.dimensions.y and abs(obj.dimensions.z - spec["depth"]) < 0.005:
            bm = bmesh.new()
            bm.from_mesh(obj.data)
            for v in bm.verts:
                v.co = mathutils.Vector((v.co.x, v.co.z, -v.co.y))
            bm.to_mesh(obj.data)
            bm.free()
            bpy.context.view_layer.update()

        # Position along Z
        obj.location = (0.0, 0.0, current_z)
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)

        imported_objects.append(obj)
        current_z += spec["thickness"] + gap

    print(f"Assembly built ({'EXPLODED' if exploded else 'ASSEMBLED'}): {len(imported_objects)} layers, top Z={current_z*1000:.1f}mm")
    return imported_objects


def export_assembly():
    """Builds the assembled stack, saves .blend, exports GLB, and validates."""
    print("\n==========================================")
    print("Building Shared Foundation Assembly")
    print("==========================================")

    objs = build_assembly(exploded=False)

    # Save editable assembly blend
    ASSEMBLY_BLEND_FILE.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(ASSEMBLY_BLEND_FILE))
    print(f"Saved assembly blend file to: {ASSEMBLY_BLEND_FILE}")

    # Export combined GLB (preserving separate nodes)
    out_glb = MODELS_DIR / "shared-foundation-assembly.glb"
    bpy.ops.object.select_all(action='SELECT')

    print(f"Exporting assembly GLB to: {out_glb}")
    bpy.ops.export_scene.gltf(
        filepath=str(out_glb),
        export_format='GLB',
        export_apply=True,
        export_yup=True,
        export_materials='EXPORT',
        use_selection=True,
    )

    print("Running assembly validation...")
    val = validate_assembly_glb(out_glb)
    if val["overall"] != "PASS":
        print("FAILED: Assembly validation failed!")
        sys.exit(1)

    print(f"SUCCESS: Assembly exported and validated! ({val['file_size_kb']} KB)")
    return val


def validate_assembly_glb(glb_path: Path) -> dict:
    """Validates the assembly GLB file."""
    res = {
        "glb_path": str(glb_path),
        "overall": "FAIL",
    }

    if not glb_path.exists():
        res["error"] = "Assembly GLB does not exist"
        return res

    file_size = glb_path.stat().st_size
    res["file_size_bytes"] = file_size
    res["file_size_kb"] = round(file_size / 1024, 2)
    if file_size < 30_000:
        res["error"] = "Assembly GLB suspiciously small (< 30 KB)"
        return res

    # Re-import into fresh scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for m in list(bpy.data.meshes):
        bpy.data.meshes.remove(m)

    bpy.ops.import_scene.gltf(filepath=str(glb_path))
    mesh_objs = [o for o in bpy.context.selected_objects if o.type == 'MESH']

    res["mesh_count"] = len(mesh_objs)
    res["mesh_names"] = [o.name for o in mesh_objs]

    if len(mesh_objs) != 8:
        res["error"] = f"Expected 8 mesh nodes in assembly, found {len(mesh_objs)}"
        return res

    # Check Z heights and bounding box ranges using world coordinates
    layers_data = []
    
    # Calculate world bounds for each object
    obj_bounds = []
    for o in mesh_objs:
        world_zs = [(o.matrix_world @ mathutils.Vector(v)).z for v in o.bound_box]
        obj_bounds.append((o, min(world_zs), max(world_zs)))

    sorted_bounds = sorted(obj_bounds, key=lambda item: item[1])
    prev_top_z = -1.0
    no_overlap = True

    for o, min_z, max_z in sorted_bounds:
        if min_z < prev_top_z - 0.0005:  # Tolerate micro floating point diff
            no_overlap = False
        layers_data.append({
            "name": o.name,
            "z_min_mm": round(min_z * 1000, 2),
            "z_max_mm": round(max_z * 1000, 2),
            "thickness_mm": round((max_z - min_z) * 1000, 2),
        })
        prev_top_z = max_z

    res["layers"] = layers_data
    res["no_z_overlap"] = no_overlap

    if no_overlap:
        res["overall"] = "PASS"

    import json
    print("=== ASSEMBLY VALIDATION ===")
    print(json.dumps(res, indent=2))
    print("===========================")

    return res


if __name__ == "__main__":
    export_assembly()
