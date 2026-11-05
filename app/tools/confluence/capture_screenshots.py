# -*- coding: utf-8 -*-
"""
Automated Prototype Screenshot Capturer for School Operating Portal PRDs.
Uses Google Chrome Headless to capture clean 1280x800 desktop screenshots
for all 38 sub-module prototype routes running on http://localhost:3000.
"""

import os
import subprocess
import sys
import time

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUTPUT_DIR = os.path.abspath("tools/confluence/screenshots")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Mapping of submodule code to prototype route and screenshot filename
SUBMODULE_ROUTES = {
    "M6/SM2": {"route": "/demo/setting/users", "filename": "m6_sm2_users.png"},
    "M7/SM2": {"route": "/demo", "filename": "m7_sm2_login.png"},
    "M5/SM13": {"route": "/demo/school/academic-year", "filename": "m5_sm13_academic_year.png"},
    "M5/SM5": {"route": "/demo/school/grades", "filename": "m5_sm5_grades.png"},
    "M5/SM1": {"route": "/demo/school/kid", "filename": "m5_sm1_students.png"},
    "M5/SM3": {"route": "/demo/school/classes", "filename": "m5_sm3_classes.png"},
    "M5/SM2": {"route": "/demo/school/teacher", "filename": "m5_sm2_teachers.png"},
    "M5/SM12": {"route": "/demo/school/calendar", "filename": "m5_sm12_calendar.png"},
    "M6/SM3": {"route": "/demo/setting/fee", "filename": "m6_sm3_fee_settings.png"},
    "M6/SM1": {"route": "/demo/setting/school", "filename": "m6_sm1_school_settings.png"},
    "M4/SM3": {"route": "/demo/school/school-fees", "filename": "m4_sm3_fee_catalog.png"},
    "M4/SM4": {"route": "/demo/school/tuition-management", "filename": "m4_sm4_tuition_matrix.png"},
    "M4/SM1": {"route": "/demo/school/fee", "filename": "m4_sm1_invoices.png"},
    "M4/SM5": {"route": "/demo/school/expenses", "filename": "m4_sm5_expenses.png"},
    "M4/SM2": {"route": "/demo/school/reconciliation", "filename": "m4_sm2_reconciliation.png"},
    "M4/SM6": {"route": "/demo/reports/fee/overview", "filename": "m4_sm6_fee_reports.png"},
    
    # Milestone 2
    "M5/SM9": {"route": "/demo/school/staff-attendance", "filename": "m5_sm9_staff_attendance.png"},
    "M6/SM4": {"route": "/demo/setting/face-recognition", "filename": "m6_sm4_ai_recognition.png"},
    "M6/SM5": {"route": "/demo/setting/features", "filename": "m6_sm5_feature_toggles.png"},
    "M2/SM1": {"route": "/demo/class/lop-1a1/attendance", "filename": "m2_sm1_attendance_roster.png"},
    "M2/SM2": {"route": "/demo/class/lop-1a1/activity", "filename": "m2_sm2_activity_feed.png"},
    "M2/SM4": {"route": "/demo/conversations", "filename": "m2_sm4_conversations.png"},
    "M6/SM6": {"route": "/demo/setting/notification", "filename": "m6_sm6_notification_settings.png"},
    "M2/SM5": {"route": "/demo/reports/attendance", "filename": "m2_sm5_attendance_report.png"},
    "M2/SM3": {"route": "/demo/class/lop-1a1/media", "filename": "m2_sm3_media_albums.png"},
    "M2/SM6": {"route": "/demo/reports/extended", "filename": "m2_sm6_extended_reports.png"},
    
    # Milestone 3
    "M5/SM4": {"route": "/demo/school/subjects", "filename": "m5_sm4_subjects.png"},
    "M5/SM6": {"route": "/demo/school/announcements", "filename": "m5_sm6_announcements.png"},
    "M5/SM11": {"route": "/demo/school/feedback", "filename": "m5_sm11_feedback.png"},
    "M5/SM10": {"route": "/demo/school/handbook", "filename": "m5_sm10_handbook.png"},
    "M5/SM8": {"route": "/demo/school/menu", "filename": "m5_sm8_menu.png"},
    "M5/SM14": {"route": "/demo/school/archive", "filename": "m5_sm14_archive.png"},
    "M5/SM7": {"route": "/demo/school/poll", "filename": "m5_sm7_poll.png"},
    "M3/SM1": {"route": "/demo/school/schedule", "filename": "m3_sm1_schedule.png"},
    "M3/SM2": {"route": "/demo/school/assignment", "filename": "m3_sm2_assignment.png"},
    "M3/SM3": {"route": "/demo/school/scoreboard", "filename": "m3_sm3_scoreboard.png"},
    "M1/SM1": {"route": "/demo", "filename": "m1_sm1_dashboard.png"},
    "M7/SM1": {"route": "/demo", "filename": "m7_sm1_system_audit.png"}
}

def capture_screenshot(code, info):
    route = info["route"]
    filename = info["filename"]
    filepath = os.path.join(OUTPUT_DIR, filename)
    url = f"http://localhost:3000{route}"
    user_data_dir = f"/tmp/chrome-profile-{code.replace('/', '_')}"
    
    cmd = [
        CHROME_BIN,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--user-data-dir={user_data_dir}",
        "--window-size=1280,820",
        f"--screenshot={filepath}",
        url
    ]
    
    try:
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20)
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            size_kb = os.path.getsize(filepath) // 1024
            print(f"  [OK] {code:8} -> {filename} ({size_kb} KB)")
            return filepath
        else:
            print(f"  [FAIL] {code:8} -> Failed to generate {filename}")
            return None
    except Exception as e:
        print(f"  [ERROR] {code:8} -> {e}")
        return None

def main():
    print(f"=======================================================")
    print(f"  CAPTURING PROTOTYPE SCREENSHOTS ({len(SUBMODULE_ROUTES)} modules)")
    print(f"=======================================================")
    
    success = 0
    for code, info in SUBMODULE_ROUTES.items():
        res = capture_screenshot(code, info)
        if res:
            success += 1
            
    print(f"\nCaptured {success}/{len(SUBMODULE_ROUTES)} screenshots successfully in: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
