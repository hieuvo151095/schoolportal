# -*- coding: utf-8 -*-
"""
Test parser for docs_legacy/Portal Vận hành QLTH/ markdown files.
"""

import os
import re

def parse_managing_doc(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract title
    title_match = re.search(r'^#\s+(.+)$', content, re.M)
    title = title_match.group(1).strip() if title_match else os.path.basename(file_path)

    # Extract scope/overview quote
    quote_match = re.search(r'^>\s+Phạm vi:\s*(.+)$', content, re.M)
    scope_quote = quote_match.group(1).strip() if quote_match else ""

    # Extract Business Rules table
    br_rows = []
    br_section = re.search(r'###\s+2\.3\s+Business Rules(.*?)(?:---|\n##\s+3)', content, re.DOTALL)
    if br_section:
        table_text = br_section.group(1)
        for line in table_text.strip().split("\n"):
            if line.startswith("|") and not line.startswith("|---") and not line.startswith("| ID"):
                cols = [c.strip() for c in line.split("|")[1:-1]]
                if len(cols) >= 2:
                    br_rows.append({"id": cols[0], "desc": cols[1]})

    # Extract Use Cases
    uc_rows = []
    uc_section = re.search(r'###\s+3\.2\s+Danh sách Use Case(.*?)(?:---|\n###\s+3\.3)', content, re.DOTALL)
    if uc_section:
        table_text = uc_section.group(1)
        for line in table_text.strip().split("\n"):
            if line.startswith("|") and not line.startswith("|---") and not line.startswith("| Mã") and not line.startswith("| Use case"):
                cols = [c.strip() for c in line.split("|")[1:-1]]
                if len(cols) >= 4:
                    uc_rows.append({
                        "id": cols[0],
                        "name": cols[1],
                        "actor": cols[2] if len(cols) > 2 else "Admin",
                        "desc": cols[3] if len(cols) > 3 else "",
                        "happy": cols[4] if len(cols) > 4 else "",
                        "rules": cols[6] if len(cols) > 6 else ""
                    })

    # Extract Screenshots
    screenshots = re.findall(r'!\[([^\]]*)\]\((screenshots/[^\)]+)\)', content)

    return {
        "title": title,
        "scope_quote": scope_quote,
        "rules_count": len(br_rows),
        "use_cases_count": len(uc_rows),
        "screenshots": screenshots
    }

if __name__ == "__main__":
    test_files = [
        "docs_legacy/Portal Vận hành QLTH/M1-dashboard/SM1-dashboard.md",
        "docs_legacy/Portal Vận hành QLTH/M2-school/SM1-school.md",
        "docs_legacy/Portal Vận hành QLTH/M7-qr-profiles/SM1-qr-profiles.md",
        "docs_legacy/Portal Vận hành QLTH/M18-campus-user-management/SM1-campus-user-management.md",
        "docs_legacy/Portal Vận hành QLTH/M21-others/SM1-command-runner.md"
    ]
    for tf in test_files:
        info = parse_managing_doc(tf)
        print(f"File: {tf}")
        print(f"  Title: {info['title']}")
        print(f"  Rules: {info['rules_count']}, Use Cases: {info['use_cases_count']}, Screenshots: {len(info['screenshots'])}")
