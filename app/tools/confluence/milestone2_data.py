# -*- coding: utf-8 -*-
"""
Milestone 2 PRD Definitions for Portal QLTH (Rebuild Roadmap) - Complete 10 Sub-modules.
Comprehensive 8-section enterprise standard template strictly adhering to [PH-22] Người đón trẻ.
"""

import os
import sys

_current_dir = os.path.dirname(os.path.abspath(__file__))
_root_dir = os.path.abspath(os.path.join(_current_dir, "../.."))
if _root_dir not in sys.path:
    sys.path.insert(0, _root_dir)
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

try:
    from tools.confluence.m2_submodules_part1 import PART1_PRDS
    from tools.confluence.m2_submodules_part2 import PART2_PRDS
except ImportError:
    from m2_submodules_part1 import PART1_PRDS
    from m2_submodules_part2 import PART2_PRDS

MILESTONE_2_PRDS = PART1_PRDS + PART2_PRDS

if __name__ == "__main__":
    print(f"Loaded {len(MILESTONE_2_PRDS)} Milestone 2 PRDs successfully.")
    for idx, p in enumerate(MILESTONE_2_PRDS, 1):
        print(f"  {idx:2d}. [{p['code']}] {p['name']} -> Parent {p['parent_module']}")
