import bpy  # type: ignore
import sys
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()
bpy.ops.mesh.primitive_cube_add()
print("BLENDER_BACKGROUND_OK")
sys.exit(0)
