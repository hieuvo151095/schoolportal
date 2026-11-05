# -*- coding: utf-8 -*-
"""
Publisher script to render and publish all 38 PRDs for School Operating Portal
to Confluence Data Center under space EDUS, organized by module under 8. Portal QLTH.

Milestone 1: 16 sub-modules
Milestone 2: 10 sub-modules
Milestone 3: 12 sub-modules
Total: 38 sub-modules
"""

import sys
import os
sys.path.insert(0, os.path.abspath("."))
import time
import json
import argparse
from tools.confluence.confluence_client import ConfluenceClient
from tools.confluence.prd_template import render_prd_storage_format
import tools.confluence.milestone1_data as m1
import tools.confluence.milestone2_data as m2
import tools.confluence.milestone3_data as m3
from tools.confluence.capture_screenshots import SUBMODULE_ROUTES

TOKEN = os.environ.get("CONFLUENCE_TOKEN", "")
BASE_URL = "https://kb.finviet.com.vn"
SPACE_KEY = "EDUS"

MODULE_PARENTS = {
    "M1": 107850389,  # M1 - Tổng quan
    "M2": 107850390,  # M2 - Vận hành
    "M3": 107850391,  # M3 - Học tập
    "M4": 107850392,  # M4 - Tài chính
    "M5": 107850393,  # M5 - Nhà trường
    "M6": 107850394,  # M6 - Cấu hình
    "M7": 107850395   # M7 - Khác
}

def publish_milestone(client, prd_list, ms_name, delay=0.5):
    print(f"\n=======================================================")
    print(f"  PUBLISHING {ms_name.upper()} ({len(prd_list)} Sub-modules)")
    print(f"=======================================================")
    results = []
    
    for idx, prd in enumerate(prd_list, 1):
        code = prd["code"]
        name = prd["name"]
        parent_mod = prd["parent_module"]
        parent_id = MODULE_PARENTS.get(parent_mod)
        if not parent_id:
            raise ValueError(f"Unknown parent module {parent_mod} for {code}")
        
        print(f"[{idx}/{len(prd_list)}] Publishing {code:8} -> '{name}' (Parent {parent_mod}:{parent_id})...", end="", flush=True)
        
        # Check and attach prototype screenshot
        route_info = SUBMODULE_ROUTES.get(code)
        img_filename = route_info["filename"] if route_info else None
        img_path = os.path.join("tools/confluence/screenshots", img_filename) if img_filename else None
        
        # Upload attachment to existing page before updating storage format
        try:
            existing = client.get_page_by_title(name)
            if existing and img_path and os.path.exists(img_path):
                client.upload_attachment(existing['id'], img_path, img_filename)
        except Exception as e_att:
            pass
            
        # Bind screenshot to first screen row
        if img_filename and img_path and os.path.exists(img_path):
            if "ui" in prd and "screens_table" in prd["ui"] and len(prd["ui"]["screens_table"]) > 0:
                prd["ui"]["screens_table"][0]["image"] = img_filename
        
        html_storage = render_prd_storage_format(prd)
        
        try:
            res = client.create_or_update_page(name, parent_id, html_storage)
            action = res.get("action", "unknown")
            page_id = res.get("id")
            ver = res.get("version")
            webui = res.get("webui", "")
            page_url = f"{BASE_URL}/pages/viewpage.action?pageId={page_id}"
            print(f" {action.upper()} (ID: {page_id}, v{ver})")
            
            results.append({
                "milestone": ms_name,
                "code": code,
                "name": name,
                "parent_module": parent_mod,
                "parent_id": parent_id,
                "page_id": page_id,
                "version": ver,
                "action": action,
                "url": page_url,
                "webui": f"{BASE_URL}{webui}" if webui else page_url
            })
        except Exception as e:
            print(f" FAILED! Error: {e}")
            results.append({
                "milestone": ms_name,
                "code": code,
                "name": name,
                "parent_module": parent_mod,
                "parent_id": parent_id,
                "error": str(e)
            })
        
        if delay > 0:
            time.sleep(delay)
            
    return results

def main():
    parser = argparse.ArgumentParser(description="Publish School Operating Portal PRDs to Confluence.")
    parser.add_argument("--milestone", choices=["1", "2", "3", "all"], default="all", help="Milestone to publish (1, 2, 3, or all)")
    parser.add_argument("--delay", type=float, default=0.3, help="Delay in seconds between requests (default: 0.3)")
    args = parser.parse_args()

    client = ConfluenceClient(BASE_URL, TOKEN, SPACE_KEY)
    
    all_results = []
    
    if args.milestone in ["1", "all"]:
        r1 = publish_milestone(client, m1.MILESTONE_1_PRDS, "Milestone 1", delay=args.delay)
        all_results.extend(r1)
        
    if args.milestone in ["2", "all"]:
        r2 = publish_milestone(client, m2.MILESTONE_2_PRDS, "Milestone 2", delay=args.delay)
        all_results.extend(r2)
        
    if args.milestone in ["3", "all"]:
        r3 = publish_milestone(client, m3.MILESTONE_3_PRDS, "Milestone 3", delay=args.delay)
        all_results.extend(r3)

    # Save manifest
    manifest_path = "tools/confluence/published_prds_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
        
    print(f"\n=======================================================")
    print(f"  PUBLISHING SUMMARY")
    print(f"=======================================================")
    success_count = sum(1 for r in all_results if "page_id" in r)
    fail_count = len(all_results) - success_count
    print(f"Total processed: {len(all_results)}")
    print(f"Successfully published: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Manifest written to: {manifest_path}")

if __name__ == "__main__":
    main()
