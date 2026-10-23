"""
config.py - Central configuration and single source of truth for 3D asset generation.
Enforces strict millimeter-to-meter conversion (MM = 0.001) across all systems.
"""

from pathlib import Path

# Conversion constants
MM = 0.001  # 1 millimeter in Blender meters
UNIT_SCALE = MM

# Base plate dimensions
PLATE_W = 300 * MM     # 0.300 m (300 mm)
PLATE_D = 200 * MM     # 0.200 m (200 mm)
PLATE_CORNER_R = 12 * MM  # 0.012 m (12 mm corner radius)
BEVEL_W = 1.5 * MM     # 0.0015 m (1.5 mm outer edge bevel)

# Mounting holes (Correction 1: x = ±135mm, y = ±85mm for 15mm edge inset)
HOLE_INSET = 15 * MM   # 0.015 m
HOLE_DIA = 6 * MM      # 0.006 m (6 mm diameter)
HOLE_CENTRES = [
    (-135 * MM, -85 * MM),  # Front-left
    ( 135 * MM, -85 * MM),  # Front-right
    (-135 * MM,  85 * MM),  # Rear-left
    ( 135 * MM,  85 * MM),  # Rear-right
]

# Plate 1 specific hardware features
PLATE_1_THICKNESS = 12 * MM
COUNTERSINK_DIA = 10 * MM
COUNTERSINK_DEPTH = 3 * MM
PORT_W = 18 * MM
PORT_H = 8 * MM
PORT_D = 5 * MM
PORT_CENTRES_X = [-60 * MM, 0.0, 60 * MM]
PORT_Y = -PLATE_D / 2   # Front edge (-100 mm)

# Stack spacing
GAP_ASSEMBLED = 2 * MM   # 2 mm gap between stacked plates
GAP_EXPLODED = 36 * MM   # 36 mm gap in exploded view
TOLERANCE = 0.5 * MM     # 0.5 mm validation tolerance

# P07 / P08 Cartridge & socket mating coordinates
CARTRIDGE_CENTRES_X = [-90 * MM, -30 * MM, 30 * MM, 90 * MM]
CARTRIDGE_LOCATOR_PINS = [
    (-90 * MM, -35 * MM), (-90 * MM, 35 * MM),
    (-30 * MM, -35 * MM), (-30 * MM, 35 * MM),
    ( 30 * MM, -35 * MM), ( 30 * MM, 35 * MM),
    ( 90 * MM, -35 * MM), ( 90 * MM, 35 * MM),
]

# Materials definitions (Principled BSDF)
MATERIALS = {
    "MAT_Graphite": {
        "hex": "#35393C",
        "metallic": 0.80,
        "roughness": 0.30,
        "description": "Base chassis graphite metallic"
    },
    "MAT_Titanium": {
        "hex": "#8A9BA8",
        "metallic": 0.70,
        "roughness": 0.25,
        "description": "Standard titanium metallic"
    },
    "MAT_DarkTitanium": {
        "hex": "#5A6570",
        "metallic": 0.72,
        "roughness": 0.28,
        "description": "Dark security/sync titanium"
    },
    "MAT_Orange": {
        "hex": "#F26A1B",
        "metallic": 0.65,
        "roughness": 0.28,
        "description": "Accent intelligence layer orange"
    },
    "MAT_Silver": {
        "hex": "#C0BDB8",
        "metallic": 0.60,
        "roughness": 0.22,
        "description": "Top experience silver surface"
    },
    "MAT_DarkRecess": {
        "hex": "#1E2124",
        "metallic": 0.50,
        "roughness": 0.60,
        "description": "Port and recess interior lining"
    },
}

# Per-plate definitions
PLATES = {
    1: {
        "id": 1,
        "name": "Existing System",
        "object_name": "Plate_01_Existing_System",
        "slug": "plate-01-existing-system",
        "material": "MAT_Graphite",
        "width": 300 * MM,
        "depth": 200 * MM,
        "thickness": 12 * MM,
        "countersink": True,
        "ports": True,
        "mounting_holes": True,
        "description": "Foundation base chassis with 4 countersunk mounting holes and 3 front interface ports",
    },
    2: {
        "id": 2,
        "name": "Data In",
        "object_name": "Plate_02_Data_In",
        "slug": "plate-02-data-in",
        "material": "MAT_Titanium",
        "width": 260 * MM,
        "depth": 200 * MM,
        "thickness": 10 * MM,
        "countersink": False,
        "ports": False,
        "mounting_holes": False,
        "description": "Data In slide manifold with lateral T-profile guide runners and 4 front intake connector pockets",
    },
    3: {
        "id": 3,
        "name": "Access & Security",
        "object_name": "Plate_03_Access_Security",
        "slug": "plate-03-access-security",
        "material": "MAT_DarkTitanium",
        "width": 300 * MM,
        "depth": 200 * MM,
        "thickness": 12 * MM,
        "aperture_w": 220 * MM,
        "aperture_d": 130 * MM,
        "countersink": False,
        "ports": False,
        "mounting_holes": True,
        "description": "Security frame ring with 220x130mm central opening framing the compute core",
    },
    4: {
        "id": 4,
        "name": "Intelligence",
        "object_name": "Plate_04_Intelligence",
        "slug": "plate-04-intelligence",
        "material": "MAT_Orange",
        "width": 200 * MM,
        "depth": 110 * MM,
        "thickness": 16 * MM,
        "core_w": 160 * MM,
        "core_d": 110 * MM,
        "countersink": False,
        "ports": False,
        "mounting_holes": False,
        "description": "Intelligence compute core with 16 exposed heatsink fins and raised hexagonal neural die",
    },
    5: {
        "id": 5,
        "name": "Decisions",
        "object_name": "Plate_05_Decisions",
        "slug": "plate-05-decisions",
        "material": "MAT_Titanium",
        "width": 300 * MM,
        "depth": 200 * MM,
        "thickness": 10 * MM,
        "countersink": False,
        "ports": False,
        "mounting_holes": True,
        "description": "Decisions distribution hub with stepped lateral shelf lands and branching routing channels",
    },
    6: {
        "id": 6,
        "name": "Reliability & Sync",
        "object_name": "Plate_06_Reliability_Sync",
        "slug": "plate-06-reliability-sync",
        "material": "MAT_DarkTitanium",
        "width": 300 * MM,
        "depth": 220 * MM,
        "thickness": 12 * MM,
        "countersink": False,
        "ports": False,
        "mounting_holes": True,
        "description": "Reliability & sync bus with +20mm rear overhang housing 6 circular coupler sockets",
    },
    7: {
        "id": 7,
        "name": "Applications",
        "object_name": "Plate_07_Applications",
        "slug": "plate-07-applications",
        "material": "MAT_Titanium",
        "width": 300 * MM,
        "depth": 200 * MM,
        "thickness": 14 * MM,
        "countersink": False,
        "ports": False,
        "mounting_holes": True,
        "description": "Applications expansion rail with 4 modular slide-in capability cartridges",
    },
    8: {
        "id": 8,
        "name": "Experience",
        "object_name": "Plate_08_Experience",
        "slug": "plate-08-experience",
        "material": "MAT_Silver",
        "width": 300 * MM,
        "depth": 200 * MM,
        "thickness": 8 * MM,
        "countersink": False,
        "ports": False,
        "mounting_holes": True,
        "description": "Experience top interface with recessed display panel, precision bezel, and dual orange accent stripes",
    },
}

# Directories and file paths
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
MODELS_DIR = ROOT_DIR / "public" / "models" / "foundation"
LAYERS_DIR = ROOT_DIR / "public" / "layers"
RENDERS_DIR = ROOT_DIR / "assets" / "renders"
DOCS_DIR = ROOT_DIR / "docs"
BLEND_FILE = ROOT_DIR / "tools" / "blender" / "foundation.blend"
ASSEMBLY_BLEND_FILE = ROOT_DIR / "tools" / "blender" / "foundation-assembly.blend"
MANIFEST_FILE = DOCS_DIR / "asset-manifest.json"

# Blender binary path
BLENDER_BIN = r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"

# Render settings
RENDER_WIDTH = 800
RENDER_HEIGHT = 533
RENDER_SAMPLES = 64
RENDER_BG_HEX = "#F0EDE8"
