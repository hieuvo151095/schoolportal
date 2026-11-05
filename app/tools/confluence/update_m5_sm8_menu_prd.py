#!/usr/bin/env python3
"""
Update PRD for M5 - SM8 - Thực đơn on Confluence (Page ID: 107850433)
with Buổi Ăn (Meal Session) based Tick Xanh Trách Nhiệm architecture.
"""

import os
import sys
import time

sys.path.insert(0, os.path.dirname(__file__))

from confluence_client import ConfluenceClient
from prd_template import render_prd_storage_format
from m3_submodules_part1 import PART1_PRDS as M3_PART1

TOKEN = os.environ.get("CONFLUENCE_TOKEN", "")
BASE_URL = "https://kb.finviet.com.vn"
SPACE_KEY = "EDUS"

def main():
    client = ConfluenceClient(BASE_URL, TOKEN, SPACE_KEY)
    
    # 1. Find M5/SM8 in M3_PART1
    m5_sm8_prd = None
    for p in M3_PART1:
        if p.get("code") == "M5/SM8":
            m5_sm8_prd = p
            break
            
    if not m5_sm8_prd:
        print("ERROR: M5/SM8 not found in m3_submodules_part1!")
        sys.exit(1)
        
    title = m5_sm8_prd["name"]
    parent_id = "107850393" # M5 - Nhà trường
    target_page_id = "107850433"
    
    print(f"Target PRD: {m5_sm8_prd['code']} -> '{title}' (Parent: {parent_id}, PageID: {target_page_id})")
    
    # 2. Upload Screenshots
    user_uploaded_dir = "/Users/hieuvo/.gemini/antigravity/brain/f6078a0f-28bb-4dfe-ab21-82289071001e/.user_uploaded"
    screenshots = [
        (os.path.join(user_uploaded_dir, "media_1793172000198_1401474e.png"), "m5-sm8-thuc-don-luoi-tick-xanh-buoi-an.png"),
        (os.path.join(user_uploaded_dir, "media_1793172089628_bcd6eeaf.png"), "m5-sm8-modal-khai-bao-tick-xanh-buoi-an.png"),
    ]
    
    for path, filename in screenshots:
        if os.path.exists(path):
            print(f"Uploading attachment '{filename}'...")
            try:
                res_att = client.upload_attachment(target_page_id, path, filename)
                print(f" -> Uploaded: {res_att.get('results', [{}])[0].get('title', filename)}")
            except Exception as e:
                print(f" -> Warning uploading {filename}: {e}")
        else:
            print(f" -> File not found: {path}")
            
    # 3. Render XHTML
    print("Rendering PRD Storage Format XHTML...")
    html_storage = render_prd_storage_format(m5_sm8_prd)
    
    # 4. Update Confluence page directly by Page ID
    print(f"Fetching current page version for Page ID {target_page_id}...")
    existing = client.get_page(target_page_id)
    current_ver = existing.get("version", {}).get("number", 1)
    print(f"Current version: v{current_ver}")
    
    print("Publishing update to Confluence...")
    res = client.update_page(target_page_id, title, parent_id, html_storage, current_ver)
    
    print("\n=======================================================")
    print(f"Action: UPDATED")
    print(f"Page ID: {res.get('id')}")
    print(f"Version: {res.get('version', {}).get('number')}")
    print(f"Title: {res.get('title')}")
    print("=======================================================")

if __name__ == "__main__":
    main()
