"""
audit_assets.py - Audits the 8 existing GLB models and assembly in public/models/foundation/.
Runs inside Blender to extract exact bounding box dimensions, mesh counts, vertex counts,
material assignments, and surface feature metrics.
"""

import sys
import json
from pathlib import Path
import bpy
import mathutils

ROOT = Path(r"c:\Users\ASUS\Desktop\shared")
MODELS_DIR = ROOT / "public" / "models" / "foundation"

GLB_FILES = [
    ("Plate 01 Existing System", "plate-01-existing-system.glb", 1),
    ("Plate 02 Data In", "plate-02-data-in.glb", 2),
    ("Plate 03 Access Security", "plate-03-access-security.glb", 3),
    ("Plate 04 Intelligence", "plate-04-intelligence.glb", 4),
    ("Plate 05 Decisions", "plate-05-decisions.glb", 5),
    ("Plate 06 Reliability Sync", "plate-06-reliability-sync.glb", 6),
    ("Plate 07 Applications", "plate-07-applications.glb", 7),
    ("Plate 08 Experience", "plate-08-experience.glb", 8),
    ("Combined Assembly", "shared-foundation-assembly.glb", 0),
]

def audit_file(filepath: Path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    if not filepath.exists():
        return {"status": "MISSING", "error": f"File not found: {filepath.name}"}

    try:
        bpy.ops.import_scene.gltf(filepath=str(filepath))
    except Exception as e:
        return {"status": "ERROR", "error": str(e)}

    meshes = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    
    if not meshes:
        return {"status": "ERROR", "error": "No mesh objects found"}

    total_verts = sum(len(m.data.vertices) for m in meshes)
    total_faces = sum(len(m.data.polygons) for m in meshes)
    
    # Calculate overall bounding box
    min_co = mathutils.Vector((float('inf'), float('inf'), float('inf')))
    max_co = mathutils.Vector((float('-inf'), float('-inf'), float('-inf')))
    
    materials_found = set()
    mesh_names = []
    
    for obj in meshes:
        mesh_names.append(obj.name)
        for mat_slot in obj.material_slots:
            if mat_slot.material:
                materials_found.add(mat_slot.material.name)
                
        for v in obj.data.vertices:
            world_v = obj.matrix_world @ v.co
            min_co.x = min(min_co.x, world_v.x)
            min_co.y = min(min_co.y, world_v.y)
            min_co.z = min(min_co.z, world_v.z)
            max_co.x = max(max_co.x, world_v.x)
            max_co.y = max(max_co.y, world_v.y)
            max_co.z = max(max_co.z, world_v.z)

    dim_x_mm = (max_co.x - min_co.x) * 1000
    dim_y_mm = (max_co.y - min_co.y) * 1000
    dim_z_mm = (max_co.z - min_co.z) * 1000

    return {
        "status": "PASS",
        "mesh_count": len(meshes),
        "mesh_names": mesh_names,
        "total_verts": total_verts,
        "total_faces": total_faces,
        "dimensions_mm": {
            "width_x": round(dim_x_mm, 2),
            "depth_y": round(dim_y_mm, 2),
            "height_z": round(dim_z_mm, 2),
        },
        "materials": list(materials_found),
        "file_size_kb": round(filepath.stat().st_size / 1024, 2),
    }

results = {}
for label, filename, plate_id in GLB_FILES:
    fp = MODELS_DIR / filename
    results[label] = audit_file(fp)

out_json = ROOT / "tools" / "blender" / "audit_results.json"
with open(out_json, "w") as f:
    json.dump(results, f, indent=2)

print("AUDIT_COMPLETED")
