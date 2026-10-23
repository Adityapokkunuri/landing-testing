"""
materials.py - Procedural PBR material factory for Blender 5.2.
Creates and manages Principled BSDF materials with proper sRGB-to-linear conversion.
"""

import bpy  # type: ignore
from config import MATERIALS


def srgb_to_linear(c: float) -> float:
    """Converts a single sRGB color channel (0.0 to 1.0) to linear space."""
    if c <= 0.04045:
        return c / 12.92
    else:
        return ((c + 0.055) / 1.055) ** 2.4


def hex_to_rgba(hex_code: str, alpha: float = 1.0) -> tuple:
    """Converts a hex color string (e.g. '#35393C') to linear RGBA tuple for Blender."""
    hex_code = hex_code.lstrip('#')
    if len(hex_code) == 6:
        r = int(hex_code[0:2], 16) / 255.0
        g = int(hex_code[2:4], 16) / 255.0
        b = int(hex_code[4:6], 16) / 255.0
    else:
        r, g, b = 0.5, 0.5, 0.5
    return (srgb_to_linear(r), srgb_to_linear(g), srgb_to_linear(b), alpha)


def create_material(name: str, hex_code: str, metallic: float = 0.7, roughness: float = 0.25) -> bpy.types.Material:
    """
    Creates or retrieves a Principled BSDF material.
    Ensures correct socket assignments for Blender 5.2.
    """
    if name in bpy.data.materials:
        mat = bpy.data.materials[name]
    else:
        mat = bpy.data.materials.new(name=name)

    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear non-standard nodes if freshly created
    bsdf = None
    output = None
    for n in nodes:
        if n.type == 'BSDF_PRINCIPLED':
            bsdf = n
        elif n.type == 'OUTPUT_MATERIAL':
            output = n

    if not bsdf:
        bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
        bsdf.location = (0, 0)
    if not output:
        output = nodes.new(type='ShaderNodeOutputMaterial')
        output.location = (300, 0)

    # Ensure link from BSDF to output
    if not any(link.to_node == output for link in links):
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    # Set parameters
    linear_rgba = hex_to_rgba(hex_code)
    if 'Base Color' in bsdf.inputs:
        bsdf.inputs['Base Color'].default_value = linear_rgba
    if 'Metallic' in bsdf.inputs:
        bsdf.inputs['Metallic'].default_value = metallic
    if 'Roughness' in bsdf.inputs:
        bsdf.inputs['Roughness'].default_value = roughness

    return mat


def setup_all_materials():
    """Pre-creates all defined materials from config.py."""
    for mat_name, spec in MATERIALS.items():
        create_material(
            name=mat_name,
            hex_code=spec["hex"],
            metallic=spec["metallic"],
            roughness=spec["roughness"]
        )
