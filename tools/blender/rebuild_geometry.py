"""
rebuild_geometry.py - Advanced industrial procedural geometry generator for the 8 foundation plates.
Constructs physically plausible, mechanically distinct components while maintaining shared mounting datums.
"""

import math
from pathlib import Path
import bpy  # type: ignore
import bmesh  # type: ignore
import mathutils  # type: ignore

from config import (
    MM,
    PLATE_W,
    PLATE_D,
    PLATE_CORNER_R,
    BEVEL_W,
    HOLE_CENTRES,
    HOLE_DIA,
    COUNTERSINK_DIA,
    COUNTERSINK_DEPTH,
    PORT_W,
    PORT_H,
    PORT_D,
    PORT_CENTRES_X,
    PORT_Y,
)


def create_base_blank(
    width: float = PLATE_W,
    depth: float = PLATE_D,
    thickness: float = 8 * MM,
    corner_radius: float = PLATE_CORNER_R,
    name: str = "PlateBlank",
    corner_segments: int = 8,
) -> tuple[bpy.types.Object, bpy.types.Mesh]:
    """Creates a clean rounded plate blank with correct normals."""
    cx = width / 2 - corner_radius
    cy = depth / 2 - corner_radius

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

    res = bmesh.ops.extrude_face_region(bm, geom=[face])
    ext_verts = [v for v in res['geom'] if isinstance(v, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=(0, 0, thickness), verts=ext_verts)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(mesh)
    bm.free()

    return obj, mesh


def drill_mounting_holes(
    host_obj: bpy.types.Object,
    thickness: float,
    countersink: bool = False,
    segments: int = 24,
):
    """Drills through mounting holes (and optional countersinks on Plate 1)."""
    hole_r = HOLE_DIA / 2
    cs_r = COUNTERSINK_DIA / 2
    cutter_bm = bmesh.new()

    for hx, hy in HOLE_CENTRES:
        if countersink:
            z_bot = -0.003
            z_step = thickness - COUNTERSINK_DEPTH
            z_top = thickness + 0.003

            bot_ring, step_inner_ring, step_outer_ring, top_ring = [], [], [], []
            for i in range(segments):
                a = 2 * math.pi * (i / segments)
                ca, sa = math.cos(a), math.sin(a)
                bot_ring.append(cutter_bm.verts.new((hx + hole_r * ca, hy + hole_r * sa, z_bot)))
                step_inner_ring.append(cutter_bm.verts.new((hx + hole_r * ca, hy + hole_r * sa, z_step)))
                step_outer_ring.append(cutter_bm.verts.new((hx + cs_r * ca, hy + cs_r * sa, z_step)))
                top_ring.append(cutter_bm.verts.new((hx + cs_r * ca, hy + cs_r * sa, z_top)))

            cutter_bm.faces.new(list(reversed(bot_ring)))
            for i in range(segments):
                next_i = (i + 1) % segments
                cutter_bm.faces.new([bot_ring[i], bot_ring[next_i], step_inner_ring[next_i], step_inner_ring[i]])
                cutter_bm.faces.new([step_inner_ring[i], step_inner_ring[next_i], step_outer_ring[next_i], step_outer_ring[i]])
                cutter_bm.faces.new([step_outer_ring[i], step_outer_ring[next_i], top_ring[next_i], top_ring[i]])
            cutter_bm.faces.new(top_ring)
        else:
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

    c_mesh = bpy.data.meshes.new("holes_mesh")
    cutter_bm.to_mesh(c_mesh)
    cutter_bm.free()
    c_obj = bpy.data.objects.new("HolesCutter", c_mesh)
    bpy.context.collection.objects.link(c_obj)

    bpy.context.view_layer.objects.active = host_obj
    mod = host_obj.modifiers.new('HolesBool', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = c_obj
    bpy.ops.object.modifier_apply(modifier='HolesBool')

    bpy.data.objects.remove(c_obj, do_unlink=True)
    bpy.data.meshes.remove(c_mesh)


def apply_boolean_difference(target_obj: bpy.types.Object, cutter_bm: bmesh.types.BMesh, name: str = "Cutter"):
    """Applies a watertight boolean difference using EXACT solver and cleans up cutter object."""
    c_mesh = bpy.data.meshes.new(f"{name}_mesh")
    cutter_bm.to_mesh(c_mesh)
    cutter_bm.free()
    c_obj = bpy.data.objects.new(name, c_mesh)
    bpy.context.collection.objects.link(c_obj)

    bpy.context.view_layer.objects.active = target_obj
    target_obj.select_set(True)
    mod = target_obj.modifiers.new(name, 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = c_obj
    bpy.ops.object.modifier_apply(modifier=name)

    bpy.data.objects.remove(c_obj, do_unlink=True)
    bpy.data.meshes.remove(c_mesh)


def finalize_object(obj: bpy.types.Object, bevel_width: float = 0.001):
    """Applies edge bevels, removes doubles, recalculates normals, sets smooth shading."""
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    if bevel_width > 0:
        bev = obj.modifiers.new('EdgeBevel', 'BEVEL')
        bev.width = bevel_width
        bev.segments = 2
        bev.limit_method = 'ANGLE'
        bev.angle_limit = math.radians(35)
        bpy.ops.object.modifier_apply(modifier='EdgeBevel')

    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0001)
    bmesh.ops.dissolve_degenerate(bm, dist=0.0001, edges=bm.edges)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    for f in bm.faces:
        f.smooth = True
    bm.to_mesh(obj.data)
    bm.free()

    wn = obj.modifiers.new('WeightedNormal', 'WEIGHTED_NORMAL')
    wn.keep_sharp = True
    bpy.ops.object.modifier_apply(modifier='WeightedNormal')


# ==============================================================================
# INDIVIDUAL PLATE GENERATORS
# ==============================================================================

def build_plate_01_chassis() -> bpy.types.Object:
    """Plate 01: Substantial Base Chassis with front ports, side bays, and countersunk holes."""
    thickness = 12 * MM
    obj, _ = create_base_blank(thickness=thickness, name="Plate_01_Existing_System")
    drill_mounting_holes(obj, thickness, countersink=True)

    # 1. Front ports (3 interface ports)
    port_bm = bmesh.new()
    for px in PORT_CENTRES_X:
        bmesh.ops.create_cube(
            port_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((px, PORT_Y + (PORT_D - 0.002) / 2, thickness / 2))
                @ mathutils.Matrix.Scale(PORT_W, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(PORT_D + 0.004, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(PORT_H, 4, (0, 0, 1))
            )
        )
    # 2. Side connector bays (2 bays on left edge, 2 bays on right edge)
    side_w, side_l, side_h = 6 * MM, 26 * MM, 7 * MM
    for sx in [-PLATE_W / 2, PLATE_W / 2]:
        for sy in [-35 * MM, 35 * MM]:
            bmesh.ops.create_cube(
                port_bm,
                size=1.0,
                matrix=(
                    mathutils.Matrix.Translation((sx, sy, thickness / 2))
                    @ mathutils.Matrix.Scale(side_w * 2, 4, (1, 0, 0))
                    @ mathutils.Matrix.Scale(side_l, 4, (0, 1, 0))
                    @ mathutils.Matrix.Scale(side_h, 4, (0, 0, 1))
                )
            )

    p_mesh = bpy.data.meshes.new("p01_cuts")
    port_bm.to_mesh(p_mesh)
    port_bm.free()
    p_obj = bpy.data.objects.new("P01_Cutter", p_mesh)
    bpy.context.collection.objects.link(p_obj)

    mod = obj.modifiers.new('PortsBool', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = p_obj
    bpy.ops.object.modifier_apply(modifier='PortsBool')

    bpy.data.objects.remove(p_obj, do_unlink=True)
    bpy.data.meshes.remove(p_mesh)

    finalize_object(obj, bevel_width=1.0 * MM)
    return obj


def build_plate_02_data_in() -> bpy.types.Object:
    """Plate 02: Data-In Module (260 x 200 x 10 mm slide manifold).
    - Narrower width 260 mm clears chassis tie-rods (mounting_holes = False).
    - Lateral slide runner flanges stepped down to Z = 6 mm.
    - 4 front intake D-sub connector pockets at Y = -100 mm.
    - 4 longitudinal bus routing trenches leading from the front pockets.
    - 2 transverse cross-manifold routing channels.
    - Rear interlocking tongue feature at Y = +100 mm.
    """
    thickness = 10 * MM
    obj, _ = create_base_blank(width=260 * MM, depth=200 * MM, thickness=thickness, corner_radius=6 * MM, name="Plate_02_Data_In")

    # Pass 1: Lateral slide runner step-downs (stepped down 4mm to Z=6mm at |X| >= 123mm)
    runner_bm = bmesh.new()
    runner_step = 4.0 * MM
    for sx in [-127 * MM, 127 * MM]:
        bmesh.ops.create_cube(
            runner_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((sx, 0, thickness - runner_step / 2 + 0.0001))
                @ mathutils.Matrix.Scale(10 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(204 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(runner_step + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, runner_bm, "RunnerBool")

    # Pass 2: Rear interlocking tongue shoulder step-downs (stepped down 3mm at Y in [90, 101mm], |X| >= 30mm)
    tongue_bm = bmesh.new()
    tongue_step = 3.0 * MM
    for tx in [-80 * MM, 80 * MM]:
        bmesh.ops.create_cube(
            tongue_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((tx, 95.5 * MM, thickness - tongue_step / 2 + 0.0001))
                @ mathutils.Matrix.Scale(102 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(12 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(tongue_step + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, tongue_bm, "TongueBool")

    # Pass 3: 4 Front intake D-sub connector pockets at Y = -100mm
    port_bm = bmesh.new()
    for px in [-75 * MM, -25 * MM, 25 * MM, 75 * MM]:
        bmesh.ops.create_cube(
            port_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((px, -95 * MM, 4.25 * MM))
                @ mathutils.Matrix.Scale(18 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(12 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(5.5 * MM, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, port_bm, "PortsBool")

    # Pass 4: 4 Longitudinal bus trenches leading from the front pockets
    trench_bm = bmesh.new()
    trench_w = 8 * MM
    trench_d = 2.0 * MM
    for gx in [-75 * MM, -25 * MM, 25 * MM, 75 * MM]:
        bmesh.ops.create_cube(
            trench_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((gx, -15 * MM, thickness - trench_d / 2 + 0.0001))
                @ mathutils.Matrix.Scale(trench_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(150 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(trench_d + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, trench_bm, "TrenchBool")

    # Pass 5: 2 Transverse cross-manifold channels (coplanar floor with bus trenches)
    trans_bm = bmesh.new()
    for gy in [-30 * MM, 30 * MM]:
        bmesh.ops.create_cube(
            trans_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((0, gy, thickness - trench_d / 2 + 0.0001))
                @ mathutils.Matrix.Scale(170 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(6 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(trench_d + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, trans_bm, "TransBool")

    finalize_object(obj, bevel_width=0.6 * MM)
    return obj


def build_plate_03_security() -> bpy.types.Object:
    """Plate 03: Access & Security Frame Ring (300 x 200 x 12 mm).
    - 220 x 130 mm central through-opening framing the compute core.
    - 40 mm wide lateral side walls and 35 mm wide front/rear walls.
    - 4 chassis datum mounting holes pass cleanly through the frame walls at (X = ±135 mm, Y = ±85 mm).
    - 4 lateral security lock slots on the outer flanks (X = ±150 mm).
    - Filleted corners on the internal aperture with lead-in bevels.
    """
    thickness = 12 * MM
    obj, _ = create_base_blank(width=PLATE_W, depth=PLATE_D, thickness=thickness, name="Plate_03_Access_Security")

    # Pass 1: Central through-aperture 220 x 130 mm (with 8mm filleted corners)
    apt_w = 220 * MM
    apt_d = 130 * MM
    apt_r = 8 * MM
    cx = apt_w / 2 - apt_r
    cy = apt_d / 2 - apt_r
    apt_bm = bmesh.new()
    points = []
    for i in range(8):
        a = -math.pi / 2 + (math.pi / 2) * (i / 8)
        points.append((cx + apt_r * math.cos(a), -cy + apt_r * math.sin(a)))
    for i in range(8):
        a = 0.0 + (math.pi / 2) * (i / 8)
        points.append((cx + apt_r * math.cos(a), cy + apt_r * math.sin(a)))
    for i in range(8):
        a = math.pi / 2 + (math.pi / 2) * (i / 8)
        points.append((-cx + apt_r * math.cos(a), cy + apt_r * math.sin(a)))
    for i in range(8):
        a = math.pi + (math.pi / 2) * (i / 8)
        points.append((-cx + apt_r * math.cos(a), -cy + apt_r * math.sin(a)))

    bm_verts = [apt_bm.verts.new((p[0], p[1], -0.005)) for p in points]
    face = apt_bm.faces.new(bm_verts)
    if face.normal.z > 0:
        face.normal_flip()
    res = bmesh.ops.extrude_face_region(apt_bm, geom=[face])
    ext_verts = [v for v in res['geom'] if isinstance(v, bmesh.types.BMVert)]
    bmesh.ops.translate(apt_bm, vec=(0, 0, thickness + 0.010), verts=ext_verts)
    bmesh.ops.recalc_face_normals(apt_bm, faces=apt_bm.faces)
    apply_boolean_difference(obj, apt_bm, "ApertureBool")

    # Pass 2: 4 Lateral perimeter security interlock slots on lateral edges
    slots_bm = bmesh.new()
    for sx in [-PLATE_W / 2, PLATE_W / 2]:
        for sy in [-35 * MM, 35 * MM]:
            bmesh.ops.create_cube(
                slots_bm,
                size=1.0,
                matrix=(
                    mathutils.Matrix.Translation((sx, sy, thickness / 2))
                    @ mathutils.Matrix.Scale(14 * MM, 4, (1, 0, 0))
                    @ mathutils.Matrix.Scale(24 * MM, 4, (0, 1, 0))
                    @ mathutils.Matrix.Scale(thickness + 0.004, 4, (0, 0, 1))
                )
            )
    apply_boolean_difference(obj, slots_bm, "SlotsBool")

    # Pass 3: Drill standard datum mounting holes through the solid frame corners (X = ±135mm, Y = ±85mm)
    drill_mounting_holes(obj, thickness, countersink=False)

    finalize_object(obj, bevel_width=0.8 * MM)
    return obj


def build_plate_04_intelligence() -> bpy.types.Object:
    """Plate 04: Intelligence Module (Hero exposed compute core).
    - Core body: 160 mm x 110 mm x 14 mm (X in [-80, 80], Y in [-55, 55]).
    - Lateral heatsink fins: 8 fins on left (X: -100 to -80 mm), 8 fins on right (X: 80 to 100 mm).
    - Total footprint with fins: 200 mm x 110 mm.
    - Raised central computing die: 90 mm x 90 mm x 2 mm (Z in [14, 16 mm]), total thickness = 16 mm.
    - Honeycomb neural matrix etched into top of die.
    - Perimeter thermal moat around central die.
    - Clears tie-rods (mounting_holes = False).
    """
    thickness = 14 * MM
    obj, _ = create_base_blank(width=160 * MM, depth=110 * MM, thickness=thickness, corner_radius=6 * MM, name="Plate_04_Intelligence")

    # 1. Perimeter thermal moat surrounding central 90x90mm die (moat width 6mm, depth 2.5mm)
    moat_d = 2.5 * MM
    # Pass A: North and South moat channels
    ns_bm = bmesh.new()
    for my in [-48 * MM, 48 * MM]:
        bmesh.ops.create_cube(
            ns_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((0, my, thickness - moat_d / 2 + 0.0001))
                @ mathutils.Matrix.Scale(102 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(6 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(moat_d + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, ns_bm, "MoatNSBool")

    # Pass B: East and West moat channels
    ew_bm = bmesh.new()
    for mx in [-48 * MM, 48 * MM]:
        bmesh.ops.create_cube(
            ew_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((mx, 0, thickness - moat_d / 2 + 0.0001))
                @ mathutils.Matrix.Scale(6 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(90 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(moat_d + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, ew_bm, "MoatEWBool")

    # 2. Raised Central Compute Die (90x90mm, from Z=14 to 16mm)
    die_bm = bmesh.new()
    bmesh.ops.create_cube(
        die_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((0, 0, 14 * MM + 1.0 * MM))
            @ mathutils.Matrix.Scale(90 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(90 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(2.0 * MM, 4, (0, 0, 1))
        )
    )
    die_mesh = bpy.data.meshes.new("p04_die_mesh")
    die_bm.to_mesh(die_mesh)
    die_bm.free()
    die_obj = bpy.data.objects.new("P04_Die", die_mesh)
    bpy.context.collection.objects.link(die_obj)

    # Etch honeycomb neural matrix cells into die top (r=5.5mm, depth=0.6mm)
    hex_bm = bmesh.new()
    r_hex = 5.5 * MM
    d_hex = 0.6 * MM
    # Center cell
    bmesh.ops.create_cone(
        hex_bm,
        cap_ends=True,
        cap_tris=False,
        segments=6,
        radius1=r_hex,
        radius2=r_hex,
        depth=d_hex + 0.0001,
        matrix=mathutils.Matrix.Translation((0, 0, 16 * MM - d_hex / 2 + 0.0001))
    )
    # Ring of 6 cells
    for i in range(6):
        ang = i * (math.pi / 3)
        hx = 15 * MM * math.cos(ang)
        hy = 15 * MM * math.sin(ang)
        bmesh.ops.create_cone(
            hex_bm,
            cap_ends=True,
            cap_tris=False,
            segments=6,
            radius1=r_hex,
            radius2=r_hex,
            depth=d_hex + 0.0001,
            matrix=mathutils.Matrix.Translation((hx, hy, 16 * MM - d_hex / 2 + 0.0001))
        )
    apply_boolean_difference(die_obj, hex_bm, "HexBool")

    # 3. Lateral Heatsink Fins (8 on left extending to X=-100mm, 8 on right extending to X=+100mm)
    fins_bm = bmesh.new()
    fin_w = 20 * MM  # span in X
    fin_d = 4.0 * MM # thickness in Y
    fin_h = 13 * MM  # height in Z (Z from 0 to 13mm)
    for i in range(8):
        fy = -42 * MM + i * 12 * MM
        # Left fin
        bmesh.ops.create_cube(
            fins_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((-90 * MM, fy, fin_h / 2))
                @ mathutils.Matrix.Scale(fin_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(fin_d, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(fin_h, 4, (0, 0, 1))
            )
        )
        # Right fin
        bmesh.ops.create_cube(
            fins_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((90 * MM, fy, fin_h / 2))
                @ mathutils.Matrix.Scale(fin_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(fin_d, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(fin_h, 4, (0, 0, 1))
            )
        )
    f_mesh = bpy.data.meshes.new("p04_fins")
    fins_bm.to_mesh(f_mesh)
    fins_bm.free()
    fins_obj = bpy.data.objects.new("P04_Fins", f_mesh)
    bpy.context.collection.objects.link(fins_obj)

    # 4. Join die and fins into main core body
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    die_obj.select_set(True)
    fins_obj.select_set(True)
    bpy.ops.object.join()
    obj = bpy.context.active_object

    finalize_object(obj, bevel_width=0.5 * MM)
    return obj


def build_plate_05_decisions() -> bpy.types.Object:
    """Plate 05: Decisions Module (10 mm thickness, stepped lateral shelves, branching routing channels).
    - 260 mm wide central raised spine at Z = 10 mm.
    - Two 20 mm wide flanking lateral shelves stepped down to Z = 7 mm (|X| >= 130 mm).
    - 4 chassis datum mounting holes pass cleanly through the recessed lateral shelves at (X = ±135 mm, Y = ±85 mm).
    - Central distributor hub at (0, -45 mm) feeding 3 branching channels to decision gate nodes at (-50, 35), (0, 45), (50, 35).
    """
    thickness = 10 * MM
    obj, _ = create_base_blank(width=PLATE_W, depth=PLATE_D, thickness=thickness, name="Plate_05_Decisions")

    # Pass 1: Step-down lateral shelves (|X| >= 130 mm) down to Z = 7 mm
    shelf_bm = bmesh.new()
    shelf_step = 3.0 * MM  # cuts from Z = 7mm to 10mm
    shelf_w = 22 * MM      # covers from 129mm to 151mm
    for sx in [-141 * MM, 141 * MM]:
        bmesh.ops.create_cube(
            shelf_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((sx, 0, thickness - shelf_step / 2 + 0.0001))
                @ mathutils.Matrix.Scale(shelf_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(PLATE_D + 4 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(shelf_step + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, shelf_bm, "ShelfBool")

    # Drill standard datum mounting holes (they pass through the 7mm thick lateral shelves at X=±135, Y=±85)
    drill_mounting_holes(obj, thickness, countersink=False)

    cut_d = 2.2 * MM

    # Pass 2: Circular wells (Hub at (0, -45) and 3 Gate nodes)
    wells_bm = bmesh.new()
    # Central hub well
    bmesh.ops.create_cone(
        wells_bm,
        cap_ends=True,
        cap_tris=False,
        segments=32,
        radius1=14 * MM,
        radius2=14 * MM,
        depth=cut_d + 0.0002,
        matrix=mathutils.Matrix.Translation((0, -45 * MM, thickness - cut_d / 2 + 0.0001))
    )
    # 3 Decision gate wells
    gate_nodes = [
        (-50 * MM, 35 * MM, 12 * MM),
        (  0 * MM, 45 * MM, 13 * MM),
        ( 50 * MM, 35 * MM, 12 * MM),
    ]
    for gx, gy, gr in gate_nodes:
        bmesh.ops.create_cone(
            wells_bm,
            cap_ends=True,
            cap_tris=False,
            segments=32,
            radius1=gr,
            radius2=gr,
            depth=cut_d + 0.0002,
            matrix=mathutils.Matrix.Translation((gx, gy, thickness - cut_d / 2 + 0.0001))
        )
    apply_boolean_difference(obj, wells_bm, "WellsBool")

    # Pass 3: Intake feeder trunk (Y from -102mm to -45mm)
    trunk_bm = bmesh.new()
    bmesh.ops.create_cube(
        trunk_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((0, -73.5 * MM, thickness - cut_d / 2 + 0.0001))
            @ mathutils.Matrix.Scale(8 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(57 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(cut_d + 0.0002, 4, (0, 0, 1))
        )
    )
    apply_boolean_difference(obj, trunk_bm, "TrunkBool")

    # Pass 4: Central straight branch to center node
    center_bm = bmesh.new()
    bmesh.ops.create_cube(
        center_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((0, 0, thickness - cut_d / 2 + 0.0001))
            @ mathutils.Matrix.Scale(6 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(90 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(cut_d + 0.0002, 4, (0, 0, 1))
        )
    )
    apply_boolean_difference(obj, center_bm, "CenterBranchBool")

    # Pass 5: Left angled branch
    branch_len = math.hypot(50 * MM, 80 * MM)
    branch_ang = math.atan2(50, 80)
    left_bm = bmesh.new()
    bmesh.ops.create_cube(
        left_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((-25 * MM, -5 * MM, thickness - cut_d / 2 + 0.0001))
            @ mathutils.Matrix.Rotation(branch_ang, 4, 'Z')
            @ mathutils.Matrix.Scale(6 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(branch_len, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(cut_d + 0.0002, 4, (0, 0, 1))
        )
    )
    apply_boolean_difference(obj, left_bm, "LeftBranchBool")

    # Pass 6: Right angled branch
    right_bm = bmesh.new()
    bmesh.ops.create_cube(
        right_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((25 * MM, -5 * MM, thickness - cut_d / 2 + 0.0001))
            @ mathutils.Matrix.Rotation(-branch_ang, 4, 'Z')
            @ mathutils.Matrix.Scale(6 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(branch_len, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(cut_d + 0.0002, 4, (0, 0, 1))
        )
    )
    apply_boolean_difference(obj, right_bm, "RightBranchBool")

    # Pass 7: 3 Output channels from nodes towards rear edge
    outputs_bm = bmesh.new()
    for gx, gy, _ in gate_nodes:
        bmesh.ops.create_cube(
            outputs_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((gx, gy + 25 * MM, thickness - cut_d / 2 + 0.0001))
                @ mathutils.Matrix.Scale(6 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(50 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(cut_d + 0.0002, 4, (0, 0, 1))
            )
        )
    apply_boolean_difference(obj, outputs_bm, "OutputsBool")

    # Pass 8: Inlaid logic pins inside the wells (joined directly to avoid boolean topology glitches)
    pin_bm = bmesh.new()
    # Hub center pin
    bmesh.ops.create_cone(
        pin_bm,
        cap_ends=True,
        cap_tris=False,
        segments=24,
        radius1=5.0 * MM,
        radius2=5.0 * MM,
        depth=cut_d,
        matrix=mathutils.Matrix.Translation((0, -45 * MM, thickness - cut_d / 2))
    )
    # Gate pins
    for gx, gy, _ in gate_nodes:
        bmesh.ops.create_cone(
            pin_bm,
            cap_ends=True,
            cap_tris=False,
            segments=24,
            radius1=4.5 * MM,
            radius2=4.5 * MM,
            depth=cut_d,
            matrix=mathutils.Matrix.Translation((gx, gy, thickness - cut_d / 2))
        )
    pin_mesh = bpy.data.meshes.new("p05_pins")
    pin_bm.to_mesh(pin_mesh)
    pin_bm.free()
    pin_obj = bpy.data.objects.new("P05_Pins", pin_mesh)
    bpy.context.collection.objects.link(pin_obj)

    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    pin_obj.select_set(True)
    bpy.ops.object.join()
    obj = bpy.context.active_object

    finalize_object(obj, bevel_width=0.6 * MM)
    return obj



def build_plate_06_reliability_sync() -> bpy.types.Object:
    """Plate 06: Reliability & Sync Module (12 mm, 220 mm depth with +20 mm rear overhang). Dual spine beams, 8 sync comb tracks, 6 rear optical coupler sockets."""
    base_t = 10 * MM
    depth = 220 * MM
    obj, _ = create_base_blank(width=PLATE_W, depth=depth, thickness=base_t, name="Plate_06_Reliability_Sync")
    
    # Translate base blank so front edge stays at Y = -100mm and rear extends to Y = +120mm
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.transform.translate(value=(0, 10 * MM, 0))
    bpy.ops.object.transform_apply(location=True)

    # Drill mounting holes at standard chassis datum (X = ±135mm, Y = ±85mm)
    drill_mounting_holes(obj, base_t, countersink=False)

    # 1. Cut 8 transverse precision sync comb tracks and 6 rear coupler sockets
    cutter_bm = bmesh.new()
    track_d = 2.0 * MM
    # 8 Transverse sync tracks (spaced 16 mm in Y, 80 mm wide in X)
    for i in range(8):
        ty = -56 * MM + i * 16 * MM
        bmesh.ops.create_cube(
            cutter_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((0, ty, base_t - track_d / 2 + 0.0001))
                @ mathutils.Matrix.Scale(80 * MM, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(5 * MM, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(track_d + 0.0002, 4, (0, 0, 1))
            )
        )

    # 6 Rear circular optical sync coupler receptacles (diam 8mm, depth 6mm) at Y = +120mm
    sock_r = 4.0 * MM  # diam 8mm
    sock_d = 6.0 * MM
    for sx in [-75 * MM, -45 * MM, -15 * MM, 15 * MM, 45 * MM, 75 * MM]:
        bmesh.ops.create_cone(
            cutter_bm,
            cap_ends=True,
            cap_tris=False,
            segments=24,
            radius1=sock_r,
            radius2=sock_r,
            depth=sock_d + 0.002,
            matrix=(
                mathutils.Matrix.Translation((sx, 120 * MM - sock_d / 2 + 0.001, base_t / 2))
                @ mathutils.Matrix.Rotation(math.radians(90), 4, 'X')
            )
        )

    c_mesh = bpy.data.meshes.new("p06_cuts")
    cutter_bm.to_mesh(c_mesh)
    cutter_bm.free()
    c_obj = bpy.data.objects.new("P06_Cutter", c_mesh)
    bpy.context.collection.objects.link(c_obj)

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    mod = obj.modifiers.new('SyncBool', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = c_obj
    bpy.ops.object.modifier_apply(modifier='SyncBool')
    bpy.data.objects.remove(c_obj, do_unlink=True)
    bpy.data.meshes.remove(c_mesh)

    # 2. Add Dual Longitudinal Structural Spine Beams (raised 2.0 mm -> total Z = 12.0 mm)
    spine_bm = bmesh.new()
    spine_w = 14 * MM
    spine_l = 160 * MM
    spine_h = 2.0 * MM
    for sx in [-46 * MM, 46 * MM]:
        bmesh.ops.create_cube(
            spine_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((sx, 10 * MM, base_t + spine_h / 2))
                @ mathutils.Matrix.Scale(spine_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(spine_l, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(spine_h, 4, (0, 0, 1))
            )
        )

    sp_mesh = bpy.data.meshes.new("p06_spines")
    spine_bm.to_mesh(sp_mesh)
    spine_bm.free()
    sp_obj = bpy.data.objects.new("P06_Spines", sp_mesh)
    bpy.context.collection.objects.link(sp_obj)

    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    sp_obj.select_set(True)
    bpy.ops.object.join()
    obj = bpy.context.active_object

    finalize_object(obj, bevel_width=0.6 * MM)
    return obj


def build_plate_07_applications() -> bpy.types.Object:
    """Plate 07: Applications Module (14 mm). Expansion rail with 4 modular slide-in capability cartridges and 8 upward locator pins."""
    rail_t = 8 * MM
    obj, _ = create_base_blank(thickness=rail_t, name="Plate_07_Applications")
    drill_mounting_holes(obj, rail_t, countersink=False)

    slot_w = 44 * MM
    slot_l = 150 * MM
    slot_d = 3.0 * MM
    slot_xs = [-90 * MM, -30 * MM, 30 * MM, 90 * MM]

    # 1. Cut 4 longitudinal cartridge guide slots (3.0 mm deep into top face)
    slot_bm = bmesh.new()
    for sx in slot_xs:
        # Main slot channel (44 mm wide x 150 mm long x 3 mm deep)
        bmesh.ops.create_cube(
            slot_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((sx, 0, rail_t - slot_d / 2 + 0.0001))
                @ mathutils.Matrix.Scale(slot_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(slot_l, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(slot_d + 0.0002, 4, (0, 0, 1))
            )
        )

    s_mesh = bpy.data.meshes.new("p07_slots")
    slot_bm.to_mesh(s_mesh)
    slot_bm.free()
    s_obj = bpy.data.objects.new("P07_Slots", s_mesh)
    bpy.context.collection.objects.link(s_obj)

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    mod = obj.modifiers.new('SlotBool', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = s_obj
    bpy.ops.object.modifier_apply(modifier='SlotBool')
    bpy.data.objects.remove(s_obj, do_unlink=True)
    bpy.data.meshes.remove(s_mesh)

    # 2. Add 4 Modular Removable Cartridges (sitting proud in slots)
    # Cartridge block: 38 mm wide x 140 mm long x 7 mm tall (from Z = 5mm to 12mm)
    cart_bm = bmesh.new()
    cart_w = 38 * MM
    cart_l = 140 * MM
    cart_z_bot = rail_t - slot_d  # 5.0 mm
    cart_z_top = 12 * MM          # 12.0 mm
    cart_h = cart_z_top - cart_z_bot

    for cx in slot_xs:
        # Cartridge main block
        bmesh.ops.create_cube(
            cart_bm,
            size=1.0,
            matrix=(
                mathutils.Matrix.Translation((cx, 0, cart_z_bot + cart_h / 2))
                @ mathutils.Matrix.Scale(cart_w, 4, (1, 0, 0))
                @ mathutils.Matrix.Scale(cart_l, 4, (0, 1, 0))
                @ mathutils.Matrix.Scale(cart_h, 4, (0, 0, 1))
            )
        )

        # 2 Upward Locator Pins per cartridge (diam 5.0mm, height 2.0mm, reaching Z = 14.0mm)
        pin_r = 2.5 * MM  # diam 5mm
        pin_h = 2.0 * MM  # reaches Z = 14.0 mm
        for py in [-35 * MM, 35 * MM]:
            bmesh.ops.create_cone(
                cart_bm,
                cap_ends=True,
                cap_tris=False,
                segments=24,
                radius1=pin_r,
                radius2=pin_r,
                depth=pin_h,
                matrix=mathutils.Matrix.Translation((cx, py, cart_z_top + pin_h / 2))
            )

    c_mesh = bpy.data.meshes.new("p07_cartridges")
    cart_bm.to_mesh(c_mesh)
    cart_bm.free()
    c_obj = bpy.data.objects.new("P07_Cartridges", c_mesh)
    bpy.context.collection.objects.link(c_obj)

    # Join cartridges directly into rail object
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    c_obj.select_set(True)
    bpy.ops.object.join()
    obj = bpy.context.active_object

    finalize_object(obj, bevel_width=0.6 * MM)
    return obj


def build_plate_08_experience() -> bpy.types.Object:
    """Plate 08: Experience Top Module (8 mm). Precision recessed display surface, raised bezel, dual accent stripes, 8 underside mating sockets."""
    total_thickness = 8 * MM
    base_t = 7 * MM
    obj, _ = create_base_blank(thickness=base_t, name="Plate_08_Experience")
    drill_mounting_holes(obj, base_t, countersink=False)

    # 1. Underside 8 precision alignment socket bores (diam 6.0mm, depth 2.5mm)
    # matching P07 cartridge locator pins
    socket_bm = bmesh.new()
    sock_r = 3.0 * MM  # diam 6mm
    sock_depth = 2.5 * MM
    for sx, sy in [
        (-90 * MM, -35 * MM), (-90 * MM, 35 * MM),
        (-30 * MM, -35 * MM), (-30 * MM, 35 * MM),
        ( 30 * MM, -35 * MM), ( 30 * MM, 35 * MM),
        ( 90 * MM, -35 * MM), ( 90 * MM, 35 * MM),
    ]:
        bmesh.ops.create_cone(
            socket_bm,
            cap_ends=True,
            cap_tris=False,
            segments=24,
            radius1=sock_r,
            radius2=sock_r,
            depth=sock_depth + 0.001,
            matrix=mathutils.Matrix.Translation((sx, sy, sock_depth / 2 - 0.0005))
        )
    sock_mesh = bpy.data.meshes.new("p08_sockets_mesh")
    socket_bm.to_mesh(sock_mesh)
    socket_bm.free()
    sock_obj = bpy.data.objects.new("P08_Sockets", sock_mesh)
    bpy.context.collection.objects.link(sock_obj)

    mod_sock = obj.modifiers.new('SockBool', 'BOOLEAN')
    mod_sock.operation = 'DIFFERENCE'
    mod_sock.solver = 'EXACT'
    mod_sock.object = sock_obj
    bpy.ops.object.modifier_apply(modifier='SockBool')
    bpy.data.objects.remove(sock_obj, do_unlink=True)
    bpy.data.meshes.remove(sock_mesh)

    # 2. Recessed display panel cavity (240 x 140 mm, 2.0 mm deep into top face)
    disp_bm = bmesh.new()
    disp_w = 240 * MM
    disp_l = 140 * MM
    disp_d = 2.0 * MM
    bmesh.ops.create_cube(
        disp_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((0, 0, base_t - disp_d / 2 + 0.0001))
            @ mathutils.Matrix.Scale(disp_w, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(disp_l, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(disp_d + 0.0002, 4, (0, 0, 1))
        )
    )
    d_mesh = bpy.data.meshes.new("p08_disp")
    disp_bm.to_mesh(d_mesh)
    disp_bm.free()
    d_obj = bpy.data.objects.new("P08_DisplayCut", d_mesh)
    bpy.context.collection.objects.link(d_obj)

    mod = obj.modifiers.new('DispBool', 'BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.solver = 'EXACT'
    mod.object = d_obj
    bpy.ops.object.modifier_apply(modifier='DispBool')
    bpy.data.objects.remove(d_obj, do_unlink=True)
    bpy.data.meshes.remove(d_mesh)

    # 3. Add Raised Precision Bezel around the recess (1.0 mm proud of base plate -> Z = 8.0 mm)
    # Bezel outer: 248 x 148 mm, inner: 240 x 140 mm, height: 1.0 mm
    bezel_bm = bmesh.new()
    bezel_h = 1.0 * MM
    # Left wall (center -122mm, width 4mm, length 148mm)
    bmesh.ops.create_cube(
        bezel_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((-122 * MM, 0, base_t + bezel_h / 2))
            @ mathutils.Matrix.Scale(4 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(148 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(bezel_h, 4, (0, 0, 1))
        )
    )
    # Right wall (center +122mm, width 4mm, length 148mm)
    bmesh.ops.create_cube(
        bezel_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((122 * MM, 0, base_t + bezel_h / 2))
            @ mathutils.Matrix.Scale(4 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(148 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(bezel_h, 4, (0, 0, 1))
        )
    )
    # Front wall (center Y=-72mm, width 240mm, length 4mm)
    bmesh.ops.create_cube(
        bezel_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((0, -72 * MM, base_t + bezel_h / 2))
            @ mathutils.Matrix.Scale(240 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(4 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(bezel_h, 4, (0, 0, 1))
        )
    )
    # Rear wall (center Y=+72mm, width 240mm, length 4mm)
    bmesh.ops.create_cube(
        bezel_bm,
        size=1.0,
        matrix=(
            mathutils.Matrix.Translation((0, 72 * MM, base_t + bezel_h / 2))
            @ mathutils.Matrix.Scale(240 * MM, 4, (1, 0, 0))
            @ mathutils.Matrix.Scale(4 * MM, 4, (0, 1, 0))
            @ mathutils.Matrix.Scale(bezel_h, 4, (0, 0, 1))
        )
    )
    bez_mesh = bpy.data.meshes.new("p08_bezel_mesh")
    bezel_bm.to_mesh(bez_mesh)
    bezel_bm.free()
    bez_obj = bpy.data.objects.new("P08_Bezel", bez_mesh)
    bpy.context.collection.objects.link(bez_obj)

    mod_bez = obj.modifiers.new('BezelBool', 'BOOLEAN')
    mod_bez.operation = 'UNION'
    mod_bez.solver = 'EXACT'
    mod_bez.object = bez_obj
    bpy.ops.object.modifier_apply(modifier='BezelBool')
    bpy.data.objects.remove(bez_obj, do_unlink=True)
    bpy.data.meshes.remove(bez_mesh)

    # 4. Add 4 Tactile Corner Datum Pads (+0.5 mm circular tactile pads) inside recess
    pad_bm = bmesh.new()
    pad_r = 5.0 * MM
    pad_h = 0.5 * MM
    for px in [-100 * MM, 100 * MM]:
        for py in [-55 * MM, 55 * MM]:
            bmesh.ops.create_cone(
                pad_bm,
                cap_ends=True,
                cap_tris=False,
                segments=24,
                radius1=pad_r,
                radius2=pad_r,
                depth=pad_h,
                matrix=mathutils.Matrix.Translation((px, py, base_t - disp_d + pad_h / 2))
            )

    pad_mesh = bpy.data.meshes.new("p08_pads")
    pad_bm.to_mesh(pad_mesh)
    pad_bm.free()
    pad_obj = bpy.data.objects.new("P08_Pads", pad_mesh)
    bpy.context.collection.objects.link(pad_obj)

    mod2 = obj.modifiers.new('PadBool', 'BOOLEAN')
    mod2.operation = 'UNION'
    mod2.solver = 'EXACT'
    mod2.object = pad_obj
    bpy.ops.object.modifier_apply(modifier='PadBool')
    bpy.data.objects.remove(pad_obj, do_unlink=True)
    bpy.data.meshes.remove(pad_mesh)

    finalize_object(obj, bevel_width=0.6 * MM)
    return obj
