"""
validate.py - Strengthened 5-layer validation suite for exported GLB foundation components.
Re-imports GLB files into clean scenes and performs bounding box, ray-cast, and manifold checks.
"""

import sys
import json
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
    HOLE_CENTRES,
    PORT_CENTRES_X,
    PORT_Y,
    PORT_D,
    TOLERANCE,
    MODELS_DIR,
)


def validate_glb_file(plate_id: int) -> dict:
    """
    Validates an exported GLB file according to the 5-layer acceptance criteria.
    Returns a dictionary of detailed validation results.
    """
    spec = PLATES.get(plate_id)
    if not spec:
        raise ValueError(f"Unknown plate_id: {plate_id}")

    glb_path = MODELS_DIR / f"{spec['slug']}.glb"
    result = {
        "plate_id": plate_id,
        "name": spec["name"],
        "slug": spec["slug"],
        "glb_path": str(glb_path),
        "layers": {},
        "overall": "FAIL",
    }

    # Layer 1: File existence and size
    if not glb_path.exists():
        result["layers"]["layer_1_file"] = {"status": "FAIL", "error": f"File does not exist: {glb_path}"}
        return result

    file_size = glb_path.stat().st_size
    if file_size < 10_000:
        result["layers"]["layer_1_file"] = {
            "status": "FAIL",
            "file_size_bytes": file_size,
            "error": "GLB file suspiciously small (< 10 KB)"
        }
        return result

    result["layers"]["layer_1_file"] = {
        "status": "PASS",
        "file_size_bytes": file_size,
        "file_size_kb": round(file_size / 1024, 2)
    }

    # Reset Blender scene and re-import GLB
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    # Clear meshes and materials from cache
    for m in bpy.data.meshes:
        bpy.data.meshes.remove(m)
    for mat in bpy.data.materials:
        bpy.data.materials.remove(mat)

    bpy.ops.import_scene.gltf(filepath=str(glb_path))

    mesh_objs = [o for o in bpy.context.selected_objects if o.type == 'MESH']
    if not mesh_objs:
        result["layers"]["layer_2_reimport"] = {"status": "FAIL", "error": "No mesh object found after re-import"}
        return result

    obj = mesh_objs[0]
    expected_w = spec.get("width", 0.300)
    expected_d = spec.get("depth", 0.200)
    expected_t = spec["thickness"]

    # Normalize glTF orientation if exported with export_yup=True
    # (where Y is thickness and Z is depth): map back to canonical Blender Z-up
    if obj.dimensions.z > obj.dimensions.y and abs(obj.dimensions.z - expected_d) < TOLERANCE:
        bm = bmesh.new()
        bm.from_mesh(obj.data)
        for v in bm.verts:
            v.co = mathutils.Vector((v.co.x, v.co.z, -v.co.y))
        bm.to_mesh(obj.data)
        bm.free()
        bpy.context.view_layer.update()

    dims = obj.dimensions
    w_diff = abs(dims.x - expected_w)
    d_diff = abs(dims.y - expected_d)
    t_diff = abs(dims.z - expected_t)

    dim_pass = (w_diff < TOLERANCE) and (d_diff < TOLERANCE) and (t_diff < TOLERANCE)
    result["layers"]["layer_2_dimensions"] = {
        "status": "PASS" if dim_pass else "FAIL",
        "measured_dimensions_m": [round(dims.x, 4), round(dims.y, 4), round(dims.z, 4)],
        "measured_dimensions_mm": {
            "w": round(dims.x * 1000, 2),
            "d": round(dims.y * 1000, 2),
            "t": round(dims.z * 1000, 2),
        },
        "expected_dimensions_mm": {
            "w": round(expected_w * 1000, 2),
            "d": round(expected_d * 1000, 2),
            "t": round(expected_t * 1000, 2),
        },
        "max_delta_mm": round(max(w_diff, d_diff, t_diff) * 1000, 3)
    }
    if not dim_pass:
        return result

    # Layer 3: Mounting hole raycast verification
    depsgraph = bpy.context.evaluated_depsgraph_get()
    hole_results = []
    holes_open = True

    if spec.get("mounting_holes", True):
        for i, (hx, hy) in enumerate(HOLE_CENTRES):
            origin = mathutils.Vector((hx, hy, 0.050))
            direction = mathutils.Vector((0, 0, -1))
            hit, loc, norm, idx, hit_obj, _ = bpy.context.scene.ray_cast(depsgraph, origin, direction)
            # Through hole: must not hit the plate top
            blocked = (hit and hit_obj == obj and loc.z > -0.001)
            if blocked:
                holes_open = False
            hole_results.append({
                "hole_index": i + 1,
                "center": [round(hx * 1000, 1), round(hy * 1000, 1)],
                "hit": hit,
                "blocked": blocked
            })

        result["layers"]["layer_3_holes"] = {
            "status": "PASS" if holes_open else "FAIL",
            "verified_holes_count": 4 if holes_open else sum(1 for h in hole_results if not h["blocked"]),
            "details": hole_results
        }
    else:
        result["layers"]["layer_3_holes"] = {
            "status": "PASS",
            "note": "Mounting holes intentionally clear chassis tie-rods (narrower/interior module)",
            "verified_holes_count": 0
        }
    if not holes_open:
        return result

    # Layer 4: Front port recess raycast verification (if applicable)
    if spec.get("ports"):
        port_results = []
        ports_pass = True
        front_y = PORT_Y
        expected_back_y = front_y + PORT_D

        for px in PORT_CENTRES_X:
            origin = mathutils.Vector((px, front_y - 0.010, spec["thickness"] / 2))
            direction = mathutils.Vector((0, 1, 0))
            hit, loc, norm, idx, hit_obj, _ = bpy.context.scene.ray_cast(depsgraph, origin, direction)
            depth_match = hit and (abs(loc.y - expected_back_y) < 1.5 * MM)
            if not depth_match:
                ports_pass = False
            port_results.append({
                "x_mm": round(px * 1000, 1),
                "hit": hit,
                "loc_y_m": round(loc.y, 4) if hit else None,
                "expected_y_m": round(expected_back_y, 4),
                "depth_match": depth_match
            })

        result["layers"]["layer_4_ports"] = {
            "status": "PASS" if ports_pass else "FAIL",
            "ports_count": len(PORT_CENTRES_X),
            "details": port_results
        }
        if not ports_pass:
            return result
    else:
        result["layers"]["layer_4_ports"] = {"status": "SKIPPED", "note": "No ports on this plate"}

    # Layer 5: Manifold, degenerate faces, and geometry counts
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.normal_update()

    non_manifold_edges = [e for e in bm.edges if not e.is_manifold]
    interior_nonmanifold = [e for e in non_manifold_edges if not e.is_boundary]
    boundary_count = len([e for e in non_manifold_edges if e.is_boundary])
    zero_faces = [f for f in bm.faces if f.calc_area() < 1e-14]

    vert_count = len(bm.verts)
    edge_count = len(bm.edges)
    face_count = len(bm.faces)
    tri_count = sum(len(f.verts) - 2 for f in bm.faces)  # Standard polygon triangulation count

    bm.free()

    manifold_pass = (len(interior_nonmanifold) == 0) and (len(zero_faces) <= 1)
    result["layers"]["layer_5_mesh_integrity"] = {
        "status": "PASS" if manifold_pass else "FAIL",
        "vertex_count": vert_count,
        "edge_count": edge_count,
        "face_count": face_count,
        "triangle_count": tri_count,
        "interior_nonmanifold_edges": len(interior_nonmanifold),
        "boundary_edges": boundary_count,
        "degenerate_faces": len(zero_faces),
    }

    if manifold_pass:
        result["overall"] = "PASS"

    return result


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Validate foundation plate GLBs")
    parser.add_argument("--plate", type=int, default=1, help="Plate ID (1-8)")
    
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    else:
        argv = []
    args = parser.parse_args(argv)

    res = validate_glb_file(args.plate)
    print("=== VALIDATION REPORT ===")
    print(json.dumps(res, indent=2))
    print("=========================")

    if res["overall"] != "PASS":
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
