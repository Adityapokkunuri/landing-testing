import math
import sys
from pathlib import Path
import bpy
import bmesh
import mathutils

tools_dir = Path(__file__).resolve().parent
if str(tools_dir) not in sys.path:
    sys.path.insert(0, str(tools_dir))

from config import MM, PLATE_W, PLATE_D, PLATE_CORNER_R
import rebuild_geometry as rg

bpy.ops.wm.read_factory_settings(use_empty=True)

thickness = 8 * MM
obj, _ = rg.create_base_blank(thickness=thickness, name="Plate_05_Decisions")
rg.drill_mounting_holes(obj, thickness, countersink=False)

cut_d = 2.0 * MM
nodes = [
    (-60 * MM, 30 * MM, 16 * MM),
    (  0 * MM, 42 * MM, 19 * MM),
    ( 60 * MM, 30 * MM, 16 * MM),
]

# Pass 1: Circular wells
wells_bm = bmesh.new()
for nx, ny, nr in nodes:
    bmesh.ops.create_cone(
        wells_bm,
        cap_ends=True,
        cap_tris=False,
        segments=32,
        radius1=nr,
        radius2=nr,
        depth=cut_d + 0.0002,
        matrix=mathutils.Matrix.Translation((nx, ny, thickness - cut_d / 2 + 0.0001))
    )
w_mesh = bpy.data.meshes.new("wells_mesh")
wells_bm.to_mesh(w_mesh)
wells_bm.free()
w_obj = bpy.data.objects.new("Wells", w_mesh)
bpy.context.collection.objects.link(w_obj)

mod = obj.modifiers.new('WellsBool', 'BOOLEAN')
mod.operation = 'DIFFERENCE'
mod.solver = 'EXACT'
mod.object = w_obj
bpy.ops.object.modifier_apply(modifier='WellsBool')
bpy.data.objects.remove(w_obj, do_unlink=True)
bpy.data.meshes.remove(w_mesh)

# Pass 2: Main trunk
trunk_bm = bmesh.new()
bmesh.ops.create_cube(
    trunk_bm,
    size=1.0,
    matrix=(
        mathutils.Matrix.Translation((0, -42.5 * MM, thickness - cut_d / 2 + 0.0001))
        @ mathutils.Matrix.Scale(9 * MM, 4, (1, 0, 0))
        @ mathutils.Matrix.Scale(65 * MM, 4, (0, 1, 0))
        @ mathutils.Matrix.Scale(cut_d + 0.0002, 4, (0, 0, 1))
    )
)
t_mesh = bpy.data.meshes.new("trunk_mesh")
trunk_bm.to_mesh(t_mesh)
trunk_bm.free()
t_obj = bpy.data.objects.new("Trunk", t_mesh)
bpy.context.collection.objects.link(t_obj)

mod2 = obj.modifiers.new('TrunkBool', 'BOOLEAN')
mod2.operation = 'DIFFERENCE'
mod2.solver = 'EXACT'
mod2.object = t_obj
bpy.ops.object.modifier_apply(modifier='TrunkBool')
bpy.data.objects.remove(t_obj, do_unlink=True)
bpy.data.meshes.remove(t_mesh)

# Pass 3: Rear output tracks
tracks_bm = bmesh.new()
for nx, ny, nr in nodes:
    bmesh.ops.create_cube(
        tracks_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((nx, ny + 25 * MM, thickness - cut_d / 2 + 0.0001))
            @ mathutils.Matrix.Scale(6 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(50 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(cut_d + 0.0002, 4, (0, 0, 1))
        )
    )
tr_mesh = bpy.data.meshes.new("tracks_mesh")
tracks_bm.to_mesh(tr_mesh)
tracks_bm.free()
tr_obj = bpy.data.objects.new("Tracks", tr_mesh)
bpy.context.collection.objects.link(tr_obj)

mod3 = obj.modifiers.new('TracksBool', 'BOOLEAN')
mod3.operation = 'DIFFERENCE'
mod3.solver = 'EXACT'
mod3.object = tr_obj
bpy.ops.object.modifier_apply(modifier='TracksBool')
bpy.data.objects.remove(tr_obj, do_unlink=True)
bpy.data.meshes.remove(tr_mesh)

# Pass 4: Inner Core Pins in the wells
core_bm = bmesh.new()
for nx, ny, nr in nodes:
    bmesh.ops.create_cone(
        core_bm,
        cap_ends=True,
        cap_tris=False,
        segments=24,
        radius1=nr * 0.45,
        radius2=nr * 0.45,
        depth=cut_d,
        matrix=mathutils.Matrix.Translation((nx, ny, thickness - cut_d / 2))
    )
core_mesh = bpy.data.meshes.new("cores_mesh")
core_bm.to_mesh(core_mesh)
core_bm.free()
core_obj = bpy.data.objects.new("Cores", core_mesh)
bpy.context.collection.objects.link(core_obj)

mod4 = obj.modifiers.new('CoreBool', 'BOOLEAN')
mod4.operation = 'UNION'
mod4.solver = 'EXACT'
mod4.object = core_obj
bpy.ops.object.modifier_apply(modifier='CoreBool')
bpy.data.objects.remove(core_obj, do_unlink=True)
bpy.data.meshes.remove(core_mesh)

rg.finalize_object(obj, bevel_width=0.8 * MM)

print(f"Plate 5 final vertices: {len(obj.data.vertices)}, polygons: {len(obj.data.polygons)}")
zs = [v.co.z for v in obj.data.vertices]
print(f"Z range: min={min(zs):.4f}, max={max(zs):.4f}")
