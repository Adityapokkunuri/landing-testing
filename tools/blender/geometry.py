"""
geometry.py - Procedural geometry generators and boolean operators for foundation plates.
All inputs and outputs strictly respect Blender meters (converted via MM = 0.001 in config).
"""

import math
import bpy  # type: ignore
import bmesh  # type: ignore
import mathutils  # type: ignore

from config import (
    MM,
    PLATE_W,
    PLATE_D,
    PLATE_CORNER_R,
    BEVEL_W,
    HOLE_DIA,
    HOLE_CENTRES,
    COUNTERSINK_DIA,
    COUNTERSINK_DEPTH,
    PORT_W,
    PORT_H,
    PORT_D,
    PORT_CENTRES_X,
    PORT_Y,
)


def make_rounded_plate(
    width: float = PLATE_W,
    depth: float = PLATE_D,
    thickness: float = 12 * MM,
    corner_radius: float = PLATE_CORNER_R,
    bevel_width: float = BEVEL_W,
    name: str = "BasePlate",
    corner_segments: int = 8,
) -> bpy.types.Object:
    """
    Creates a rounded rectangular plate mesh centered at (0, 0) in XY,
    resting on Z=0 with height 'thickness'.
    Top and bottom perimeter edges receive a bevel of 'bevel_width'.
    """
    cx = width / 2 - corner_radius
    cy = depth / 2 - corner_radius

    # Generate 2D boundary loop
    points = []
    # Corner 1: front-right (+X, -Y)
    for i in range(corner_segments):
        a = -math.pi / 2 + (math.pi / 2) * (i / corner_segments)
        points.append((cx + corner_radius * math.cos(a), -cy + corner_radius * math.sin(a)))
    # Corner 2: rear-right (+X, +Y)
    for i in range(corner_segments):
        a = 0.0 + (math.pi / 2) * (i / corner_segments)
        points.append((cx + corner_radius * math.cos(a), cy + corner_radius * math.sin(a)))
    # Corner 3: rear-left (-X, +Y)
    for i in range(corner_segments):
        a = math.pi / 2 + (math.pi / 2) * (i / corner_segments)
        points.append((-cx + corner_radius * math.cos(a), cy + corner_radius * math.sin(a)))
    # Corner 4: front-left (-X, -Y)
    for i in range(corner_segments):
        a = math.pi + (math.pi / 2) * (i / corner_segments)
        points.append((-cx + corner_radius * math.cos(a), -cy + corner_radius * math.sin(a)))

    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    bm_verts = [bm.verts.new((p[0], p[1], 0.0)) for p in points]
    face = bm.faces.new(bm_verts)
    if face.normal.z > 0:
        face.normal_flip()

    # Extrude along +Z
    res = bmesh.ops.extrude_face_region(bm, geom=[face])
    ext_verts = [v for v in res['geom'] if isinstance(v, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, thickness), verts=ext_verts)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    # Apply bevel modifier to top and bottom perimeter edges
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    if bevel_width > 0:
        bev = obj.modifiers.new('Bevel', 'BEVEL')
        bev.width = bevel_width
        bev.segments = 3
        bev.limit_method = 'ANGLE'
        bev.angle_limit = math.radians(45)
        bpy.ops.object.modifier_apply(modifier='Bevel')

    return obj


def apply_mounting_holes(
    host_obj: bpy.types.Object,
    thickness: float,
    hole_centres: list = HOLE_CENTRES,
    hole_dia: float = HOLE_DIA,
    countersink: bool = False,
    cs_dia: float = COUNTERSINK_DIA,
    cs_depth: float = COUNTERSINK_DEPTH,
    segments: int = 24,
):
    """
    Drills through mounting holes (and optional countersinks) into host_obj using exact booleans.
    Uses non-self-intersecting manifold stepped cylinder cutters for clean topology.
    """
    cutter_bm = bmesh.new()
    hole_r = hole_dia / 2
    cs_r = cs_dia / 2

    for hx, hy in hole_centres:
        if countersink:
            # Build clean, manifold stepped cylinder with zero self-intersection
            z_bot = -0.003
            z_step = thickness - cs_depth
            z_top = thickness + 0.003

            bot_ring = []
            step_inner_ring = []
            step_outer_ring = []
            top_ring = []

            for i in range(segments):
                a = 2 * math.pi * (i / segments)
                ca = math.cos(a)
                sa = math.sin(a)
                bot_ring.append(cutter_bm.verts.new((hx + hole_r * ca, hy + hole_r * sa, z_bot)))
                step_inner_ring.append(cutter_bm.verts.new((hx + hole_r * ca, hy + hole_r * sa, z_step)))
                step_outer_ring.append(cutter_bm.verts.new((hx + cs_r * ca, hy + cs_r * sa, z_step)))
                top_ring.append(cutter_bm.verts.new((hx + cs_r * ca, hy + cs_r * sa, z_top)))

            # Bottom cap
            cutter_bm.faces.new(list(reversed(bot_ring)))
            # Inner through-cylinder wall
            for i in range(segments):
                next_i = (i + 1) % segments
                cutter_bm.faces.new([bot_ring[i], bot_ring[next_i], step_inner_ring[next_i], step_inner_ring[i]])
            # Annular step shelf
            for i in range(segments):
                next_i = (i + 1) % segments
                cutter_bm.faces.new([step_inner_ring[i], step_inner_ring[next_i], step_outer_ring[next_i], step_outer_ring[i]])
            # Outer countersink cylinder wall
            for i in range(segments):
                next_i = (i + 1) % segments
                cutter_bm.faces.new([step_outer_ring[i], step_outer_ring[next_i], top_ring[next_i], top_ring[i]])
            # Top cap
            cutter_bm.faces.new(top_ring)
        else:
            # Standard through cylinder
            bmesh.ops.create_cone(
                cutter_bm,
                cap_ends=True,
                cap_tris=False,
                segments=segments,
                radius1=hole_r,
                radius2=hole_r,
                depth=thickness + 0.010,
                matrix=mathutils.Matrix.Translation((hx, hy, thickness / 2))
            )

    cutter_mesh = bpy.data.meshes.new("hole_cutters_mesh")
    cutter_bm.to_mesh(cutter_mesh)
    cutter_bm.free()
    cutter_obj = bpy.data.objects.new("HoleCutters", cutter_mesh)
    bpy.context.collection.objects.link(cutter_obj)

    bpy.context.view_layer.objects.active = host_obj
    host_obj.select_set(True)

    bool_mod = host_obj.modifiers.new('HolesBool', 'BOOLEAN')
    bool_mod.operation = 'DIFFERENCE'
    bool_mod.solver = 'EXACT'
    bool_mod.object = cutter_obj
    bpy.ops.object.modifier_apply(modifier='HolesBool')

    bpy.data.objects.remove(cutter_obj, do_unlink=True)
    bpy.data.meshes.remove(cutter_mesh)


def apply_front_ports(
    host_obj: bpy.types.Object,
    thickness: float,
    port_centres_x: list = PORT_CENTRES_X,
    port_w: float = PORT_W,
    port_h: float = PORT_H,
    port_d: float = PORT_D,
    front_y: float = PORT_Y,
    recess_material: bpy.types.Material = None,
):
    """
    Cuts rectangular ports into the front edge of host_obj.
    Applies recess_material to the interior faces of the cut.
    """
    port_bm = bmesh.new()
    margin = 0.005  # Extend cutter outside front face for clean cut

    for px in port_centres_x:
        # Cutter bounds in Y: front_y - margin to front_y + port_d
        center_y = front_y + (port_d - margin) / 2
        total_depth_y = port_d + margin

        bmesh.ops.create_cube(
            port_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((px, center_y, thickness / 2))
                @ mathutils.Matrix.Scale(port_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(total_depth_y, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(port_h, 4, (0, 0, 1))
            )
        )

    port_mesh = bpy.data.meshes.new("port_cutters_mesh")
    port_bm.to_mesh(port_mesh)
    port_bm.free()
    port_obj = bpy.data.objects.new("PortCutters", port_mesh)
    bpy.context.collection.objects.link(port_obj)

    if recess_material:
        port_obj.data.materials.append(recess_material)

    bpy.context.view_layer.objects.active = host_obj
    host_obj.select_set(True)

    bool_mod = host_obj.modifiers.new('PortsBool', 'BOOLEAN')
    bool_mod.operation = 'DIFFERENCE'
    bool_mod.solver = 'EXACT'
    bool_mod.object = port_obj
    bpy.ops.object.modifier_apply(modifier='PortsBool')

    bpy.data.objects.remove(port_obj, do_unlink=True)
    bpy.data.meshes.remove(port_mesh)


def finalize_mesh(obj: bpy.types.Object):
    """
    Cleans up doubles, recalculates normals, applies smooth shading and weighted normal modifier.
    """
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0001)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(obj.data)
    bm.free()

    # Smooth shading
    for poly in obj.data.polygons:
        poly.use_smooth = True

    # Weighted normal modifier for crisp bevels and mechanical look
    wn_mod = obj.modifiers.new('WeightedNormal', 'WEIGHTED_NORMAL')
    wn_mod.keep_sharp = True
    bpy.ops.object.modifier_apply(modifier='WeightedNormal')
