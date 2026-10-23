"""
test_individual_plate.py - Tests each plate builder individually and reports vertex/polygon count.
"""

import sys
from pathlib import Path
import bpy  # type: ignore

tools_dir = Path(__file__).resolve().parent
if str(tools_dir) not in sys.path:
    sys.path.insert(0, str(tools_dir))

import rebuild_geometry as rg

builders = [
    (1, "Plate 1", rg.build_plate_01_chassis),
    (2, "Plate 2", rg.build_plate_02_data_in),
    (3, "Plate 3", rg.build_plate_03_security),
    (4, "Plate 4", rg.build_plate_04_intelligence),
    (5, "Plate 5", rg.build_plate_05_decisions),
    (6, "Plate 6", rg.build_plate_06_reliability_sync),
    (7, "Plate 7", rg.build_plate_07_applications),
    (8, "Plate 8", rg.build_plate_08_experience),
]

for pid, name, func in builders:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    try:
        obj = func()
        print(f"[SUCCESS] {name}: {len(obj.data.vertices)} vertices, {len(obj.data.polygons)} polygons")
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
