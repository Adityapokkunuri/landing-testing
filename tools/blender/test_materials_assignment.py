"""
test_materials_assignment.py - Tests dual PBR material assignment on Plate 4.
"""

import sys
import math
from pathlib import Path
import bpy
import bmesh
import mathutils

tools_dir = Path(__file__).resolve().parent
if str(tools_dir) not in sys.path:
    sys.path.insert(0, str(tools_dir))

from config import MM, RENDER_WIDTH, RENDER_HEIGHT, RENDERS_DIR
from materials import setup_all_materials, hex_to_rgba
import rebuild_geometry as rg

bpy.ops.wm.read_factory_settings(use_empty=True)
setup_all_materials()

# Build Plate 4
obj = rg.build_plate_04_intelligence()

mat_orange = bpy.data.materials.get("MAT_Orange")
mat_recess = bpy.data.materials.get("MAT_DarkRecess")

obj.data.materials.clear()
obj.data.materials.append(mat_orange)   # slot 0
obj.data.materials.append(mat_recess)   # slot 1

# In bmesh, assign slot 1 (dark recess) to trench faces
bm = bmesh.new()
bm.from_mesh(obj.data)

thickness = 8 * MM
for f in bm.faces:
    # If the face is inside the thermal trench cavity (z <= thickness - 0.001)
    center = f.calc_center_median()
    if center.z < thickness - 0.0005:
        f.material_index = 1
    # Also if it's the trench bottom or side walls around the die
    elif abs(center.x) < 68 * MM and abs(center.y) < 68 * MM and (abs(center.x) > 50 * MM or abs(center.y) > 50 * MM):
        f.material_index = 1

bm.to_mesh(obj.data)
bm.free()

# Setup EEVEE studio lighting and camera
scene = bpy.context.scene
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = 800
scene.render.resolution_y = 533

if scene.world is None:
    scene.world = bpy.data.worlds.new("World")
scene.world.use_nodes = True
scene.world.node_tree.nodes["Background"].inputs['Color'].default_value = hex_to_rgba("#F0EDE8")

# Light
key = bpy.data.lights.new('Key', 'SUN')
key.energy = 4.0
key_obj = bpy.data.objects.new('Key', key)
bpy.context.collection.objects.link(key_obj)
key_obj.rotation_euler = (math.radians(45), math.radians(20), math.radians(-30))

fill = bpy.data.lights.new('Fill', 'SUN')
fill.energy = 2.0
fill_obj = bpy.data.objects.new('Fill', fill)
bpy.context.collection.objects.link(fill_obj)
fill_obj.rotation_euler = (math.radians(30), math.radians(-30), math.radians(60))

# Camera at isometric angle
cam = bpy.data.cameras.new('Cam')
cam.lens = 65
cam_obj = bpy.data.objects.new('Cam', cam)
bpy.context.collection.objects.link(cam_obj)
scene.camera = cam_obj

cam_dist = 0.58
elev = math.radians(35)
azim = math.radians(40)
cam_obj.location = (
    cam_dist * math.cos(elev) * math.sin(azim),
    -cam_dist * math.cos(elev) * math.cos(azim),
    0.008 + cam_dist * math.sin(elev)
)
direction = mathutils.Vector((0, 0, 0.008)) - cam_obj.location
cam_obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()

out_path = RENDERS_DIR / "plate-04-dualmat-test.png"
scene.render.filepath = str(out_path)
bpy.ops.render.render(write_still=True)
print(f"Rendered test to: {out_path}")
