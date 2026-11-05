# -*- coding: utf-8 -*-
"""
Milestone 1 PRD Definitions for Portal QLTH (Rebuild Roadmap) - Complete 16 Sub-modules.
Comprehensive 8-section enterprise standard template strictly adhering to [PH-22] Người đón trẻ.
"""

import os
import sys

# Ensure both project root and tools/confluence are in sys.path
_current_dir = os.path.dirname(os.path.abspath(__file__))
_root_dir = os.path.abspath(os.path.join(_current_dir, "../.."))
if _root_dir not in sys.path:
    sys.path.insert(0, _root_dir)
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

try:
    from tools.confluence.m1_submodules_part1 import PART1_PRDS
    from tools.confluence.m1_submodules_part2 import PART2_PRDS
    from tools.confluence.m1_submodules_part3 import PART3_PRDS
except ImportError:
    from m1_submodules_part1 import PART1_PRDS
    from m1_submodules_part2 import PART2_PRDS
    from m1_submodules_part3 import PART3_PRDS

MILESTONE_1_PRDS = PART1_PRDS + PART2_PRDS + PART3_PRDS

if __name__ == "__main__":
    print(f"Loaded {len(MILESTONE_1_PRDS)} Milestone 1 PRDs successfully.")
    for idx, p in enumerate(MILESTONE_1_PRDS, 1):
        print(f"  {idx:2d}. [{p['code']}] {p['name']} -> Parent {p['parent_module']}")
