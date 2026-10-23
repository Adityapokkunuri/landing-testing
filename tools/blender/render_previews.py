"""
render_previews.py - Headless EEVEE preview renderer for individual plates, assembled stack, and exploded stack.
Produces 800x533 (3:2) PNG renders with studio lighting and warm neutral background.
"""

import sys
import math
import shutil
import argparse
from pathlib import Path
import bpy  # type: ignore
import mathutils  # type: ignore

blender_dir = Path(__file__).resolve().parent
if str(blender_dir) not in sys.path:
    sys.path.insert(0, str(blender_dir))

from config import (
    MM,
    PLATES,
    GAP_EXPLODED,
    MODELS_DIR,
    RENDERS_DIR,
    LAYERS_DIR,
    ROOT_DIR,
    RENDER_WIDTH,
    RENDER_HEIGHT,
    RENDER_SAMPLES,
    RENDER_BG_HEX,
)
from materials import hex_to_rgba


def setup_render_environment(target_z: float = 0.006, cam_dist: float = 0.68, elevation_deg: float = 42.0, azimuth_deg: float = 35.0):
    """Sets up camera, 3-point studio lighting, and neutral world background."""
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0

    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = RENDER_WIDTH
    scene.render.resolution_y = RENDER_HEIGHT
    scene.render.resolution_percentage = 100

    # World background
    if scene.world is None:
        scene.world = bpy.data.worlds.new("StudioWorld")
    scene.world.use_nodes = True
    bg_node = scene.world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs['Color'].default_value = hex_to_rgba(RENDER_BG_HEX)
        bg_node.inputs['Strength'].default_value = 1.0

    # Clear old cameras and lights
    for o in list(scene.objects):
        if o.type in ('CAMERA', 'LIGHT'):
            bpy.data.objects.remove(o, do_unlink=True)

    # Studio Lighting (Key, Fill, Rim)
    key_data = bpy.data.lights.new('KeyLight', type='SUN')
    key_data.energy = 3.5
    key_data.color = (1.0, 0.98, 0.95)
    key_obj = bpy.data.objects.new('KeyLight', key_data)
    bpy.context.collection.objects.link(key_obj)
    key_obj.rotation_euler = (math.radians(50), math.radians(20), math.radians(-35))

    fill_data = bpy.data.lights.new('FillLight', type='SUN')
    fill_data.energy = 1.8
    fill_data.color = (0.95, 0.98, 1.0)
    fill_obj = bpy.data.objects.new('FillLight', fill_data)
    bpy.context.collection.objects.link(fill_obj)
    fill_obj.rotation_euler = (math.radians(40), math.radians(-30), math.radians(60))

    rim_data = bpy.data.lights.new('RimLight', type='SUN')
    rim_data.energy = 2.5
    rim_data.color = (1.0, 1.0, 1.0)
    rim_obj = bpy.data.objects.new('RimLight', rim_data)
    bpy.context.collection.objects.link(rim_obj)
    rim_obj.rotation_euler = (math.radians(-60), 0, math.radians(160))

    # Camera setup (isometric 3/4 engineering angle)
    cam_data = bpy.data.cameras.new('Camera')
    cam_data.lens = 50
    cam_obj = bpy.data.objects.new('Camera', cam_data)
    bpy.context.collection.objects.link(cam_obj)
    scene.camera = cam_obj

    # Position camera
    azimuth = math.radians(azimuth_deg)
    elevation = math.radians(elevation_deg)
    cx = cam_dist * math.cos(elevation) * math.sin(azimuth)
    cy = -cam_dist * math.cos(elevation) * math.cos(azimuth)
    cz = target_z + cam_dist * math.sin(elevation)

    cam_obj.location = (cx, cy, cz)

    # Point camera at target
    target = mathutils.Vector((0, 0, target_z))
    direction = target - cam_obj.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    cam_obj.rotation_euler = rot_quat.to_euler()

    return cam_obj


def render_plate_preview(plate_id: int) -> str:
    """Renders a single plate preview image from its native plate-0N.blend."""
    blend_file = blender_dir / f"plate-0{plate_id}.blend"
    if not blend_file.exists():
        raise FileNotFoundError(f"Blend not found: {blend_file}")

    bpy.ops.wm.open_mainfile(filepath=str(blend_file))

    spec = PLATES.get(plate_id)
    setup_render_environment(target_z=spec["thickness"] / 2, cam_dist=0.62)

    RENDERS_DIR.mkdir(parents=True, exist_ok=True)
    out_filename = f"plate-{plate_id:02d}-preview.png"
    out_path = RENDERS_DIR / out_filename

    bpy.context.scene.render.filepath = str(out_path.resolve())

    print(f"Rendering plate {plate_id} to: {out_path}...")
    bpy.ops.render.render(write_still=True)
    return str(out_path)


def render_assembly_preview() -> str:
    """Renders the assembled stack directly from foundation-assembly.blend."""
    blend_file = blender_dir / "foundation-assembly.blend"
    if not blend_file.exists():
        raise FileNotFoundError(f"Assembly blend not found: {blend_file}")

    bpy.ops.wm.open_mainfile(filepath=str(blend_file))
    setup_render_environment(target_z=0.054, cam_dist=0.68)

    RENDERS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = RENDERS_DIR / "assembly-preview.png"
    bpy.context.scene.render.filepath = str(out_path.resolve())

    print(f"Rendering assembly preview to: {out_path}...")
    bpy.ops.render.render(write_still=True)
    return str(out_path)


def render_exploded_preview() -> str:
    """Renders the exploded stack directly from foundation-assembly.blend with clean gaps."""
    blend_file = blender_dir / "foundation-assembly.blend"
    if not blend_file.exists():
        raise FileNotFoundError(f"Assembly blend not found: {blend_file}")

    bpy.ops.wm.open_mainfile(filepath=str(blend_file))

    gap = 48 * MM
    z_pos = 0.0

    plate_order = [
        "Plate_01_Existing_System",
        "Plate_02_Data_In",
        "Plate_03_Access_Security",
        "Plate_04_Intelligence",
        "Plate_05_Decisions",
        "Plate_06_Reliability_Sync",
        "Plate_07_Applications",
        "Plate_08_Experience",
    ]

    for name in plate_order:
        obj = bpy.data.objects.get(name)
        if obj:
            max_z = max(v.co.z for v in obj.data.vertices)
            min_z = min(v.co.z for v in obj.data.vertices)
            obj.location.z = z_pos - min_z
            thickness = max_z - min_z
            z_pos += thickness + gap

    total_height = z_pos - gap
    mid_z = total_height / 2
    setup_render_environment(target_z=mid_z, cam_dist=1.35, elevation_deg=26.0, azimuth_deg=38.0)

    RENDERS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = RENDERS_DIR / "exploded-preview.png"
    bpy.context.scene.render.filepath = str(out_path.resolve())

    print(f"Rendering exploded preview to: {out_path}...")
    bpy.ops.render.render(write_still=True)
    return str(out_path)


def copy_layers_pngs():
    """Copies plate preview renders to public/layers/plate-N.png and public/renders/."""
    LAYERS_DIR.mkdir(parents=True, exist_ok=True)
    pub_renders = ROOT_DIR / "public" / "renders"
    pub_renders.mkdir(parents=True, exist_ok=True)

    print("\nCopying PNG fallbacks to public/layers/ and public/renders/...")
    for p_id in range(1, 9):
        src = RENDERS_DIR / f"plate-{p_id:02d}-preview.png"
        dst = LAYERS_DIR / f"plate-{p_id}.png"
        if src.exists():
            shutil.copy2(src, dst)
            shutil.copy2(src, pub_renders / src.name)
            print(f"  Copied {src.name} -> {dst.name}")
        else:
            print(f"  WARNING: Source render missing: {src}")

    # Also copy assembly and exploded previews
    for name in ["assembly-preview.png", "exploded-preview.png"]:
        src = RENDERS_DIR / name
        if src.exists():
            shutil.copy2(src, pub_renders / name)
            print(f"  Copied {name} -> public/renders/{name}")


def main():
    parser = argparse.ArgumentParser(description="Render preview images")
    parser.add_argument("--plate", type=int, default=None, help="Plate ID (1-8)")
    parser.add_argument("--assembly", action="store_true", help="Render assembled stack")
    parser.add_argument("--exploded", action="store_true", help="Render exploded stack")
    parser.add_argument("--all", action="store_true", help="Render all 10 images and copy PNG fallbacks")

    if "--" in sys.argv:
        idx = sys.argv.index("--")
        args = parser.parse_args(sys.argv[idx + 1:])
    else:
        args = parser.parse_args()

    if args.all:
        print("\n=== RENDERING ALL 10 PREVIEWS ===")
        for p in range(1, 9):
            render_plate_preview(p)
        render_assembly_preview()
        render_exploded_preview()
        copy_layers_pngs()
        print("=== ALL RENDERS COMPLETE ===")
    elif args.assembly:
        render_assembly_preview()
    elif args.exploded:
        render_exploded_preview()
    elif args.plate is not None:
        render_plate_preview(args.plate)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
