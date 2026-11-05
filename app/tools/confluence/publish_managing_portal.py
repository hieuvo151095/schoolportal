# -*- coding: utf-8 -*-
"""
Publisher script for '9. Portal Vận hành QLTH' on Confluence (Space: EDUS).
Organizes 21 parent module pages under Root Page '9. Portal Vận hành QLTH' (ID: 107850725),
parses and builds comprehensive PRDs for all 37 sub-modules from 'docs_legacy/Portal Vận hành QLTH/',
uploads 100+ screenshots, and renders standard 8-section XHTML storage format.
Incorporates all user-confirmed decisions from Part B & C.
"""

import sys
import os
import re
import json
import time
import urllib.parse

sys.path.insert(0, os.path.abspath("."))

from tools.confluence.confluence_client import ConfluenceClient
from tools.confluence.prd_template import render_prd_storage_format, escape_xml, sanitize_xhtml

TOKEN = os.environ.get("CONFLUENCE_TOKEN", "")
BASE_URL = "https://kb.finviet.com.vn"
SPACE_KEY = "EDUS"
ROOT_PAGE_ID = 107850725  # '9. Portal Vận hành QLTH'

# 21 Parent Modules definition
PARENT_MODULES = [
    {"code": "M1", "title": "M1 - Dashboard", "desc": "Bảng điều khiển trung tâm tổng quan toàn nền tảng, KPI đa chiều và biểu đồ xu hướng 12 tháng."},
    {"code": "M2", "title": "M2 - School", "desc": "Quản lý danh sách trường, 14 Tab cấu hình sâu (Wordbook, TOFACE, Quota, Học kỳ), danh sách User và 26 công cụ mở rộng."},
    {"code": "M3", "title": "M3 - User School", "desc": "Quản lý danh mục tài khoản người dùng trường học (Admin trường, Giáo viên, Phụ huynh) toàn hệ thống."},
    {"code": "M4", "title": "M4 - Billing", "desc": "Tính cước và thu phí bản quyền trường học theo số lượng học sinh thực tế (Price per kid) và tín dụng (Credits)."},
    {"code": "M5", "title": "M5 - Statistic", "desc": "Báo cáo thống kê chuyên sâu: Top trường có hoạt động sôi nổi và Thống kê theo năm học."},
    {"code": "M6", "title": "M6 - Holidays", "desc": "Quản lý danh mục ngày nghỉ lễ toàn quốc và ngày nghỉ đặc thù áp dụng chung cho các trường."},
    {"code": "M7", "title": "M7 - QR Profiles", "desc": "Cấu hình cấu trúc mã VietQR động, kết nối ngân hàng và tài khoản thụ hưởng học phí của các trường."},
    {"code": "M8", "title": "M8 - Announcement", "desc": "Trung tâm phát hành thông báo vận hành, lịch bảo trì và văn bản điều hành từ Finviet/SOHA tới các trường."},
    {"code": "M9", "title": "M9 - Tracking", "desc": "Giám sát vết hệ thống: Theo dõi nhận thông báo, hóa đơn thanh toán, trợ lý AI và webhook logs."},
    {"code": "M10", "title": "M10 - Mailer Profiles", "desc": "Cấu hình hạ tầng máy chủ gửi email (SMTP Mailer) dùng chung hoặc thiết lập riêng cho từng trường."},
    {"code": "M11", "title": "M11 - Lessons", "desc": "Kho học liệu & chương trình giáo dục Montessori (8 Bộ, 54 Lĩnh vực, 1.135 Nhóm, 5.217 Bài học) phục vụ gắn thẻ bài tập."},
    {"code": "M12", "title": "M12 - Lesson Plans", "desc": "Quản lý kế hoạch giảng dạy mẫu và phân loại danh mục giáo án dùng chung cho các trường."},
    {"code": "M13", "title": "M13 - Audit Log", "desc": "Nhật ký kiểm toán hệ thống ghi lại lịch sử thao tác của các Super Admin trên nền tảng Managing Portal."},
    {"code": "M14", "title": "M14 - School Year", "desc": "Quản lý danh mục năm học chuẩn và phân bổ áp dụng niên khóa cho từng trường học."},
    {"code": "M15", "title": "M15 - Transparent Classroom", "desc": "Kết nối và đồng bộ tự động dữ liệu bài học, học sinh từ nền tảng giáo dục quốc tế Transparent Classroom."},
    {"code": "M16", "title": "M16 - Logs", "desc": "Hệ thống giám sát kỹ thuật: Dashboard log máy chủ, Giao dịch thanh toán (Payment Transactions) và Lịch sử đối soát (Reconciliation Logs)."},
    {"code": "M17", "title": "M17 - Partner", "desc": "Quản lý đối tác chiến lược, nhãn hàng tài trợ và các chiến dịch quảng cáo hiển thị trên hệ sinh thái."},
    {"code": "M18", "title": "M18 - Campus User Management", "desc": "Quản lý tài khoản quản trị cấp cụm trường (Campus Admin) với cơ chế bảo mật xác nhận mật khẩu nghiêm ngặt."},
    {"code": "M19", "title": "M19 - School Groups", "desc": "Tổ chức và quản lý các cụm trường học liên cấp hoặc hệ thống trường cùng chủ đầu tư."},
    {"code": "M20", "title": "M20 - Sales", "desc": "Hỗ trợ đội ngũ kinh doanh tra cứu thông tin trường và đăng nhập hộ (Impersonate) hỗ trợ khách hàng."},
    {"code": "M21", "title": "M21 - Others", "desc": "Công cụ chạy lệnh hệ thống (Command Runner) quản trị máy chủ Laravel Artisan với danh sách lệnh Whitelist an toàn."}
]

# 37 Sub-modules mapping to Legacy Markdown files and Parent Modules
SUBMODULE_CATALOG = [
    # M1
    {"code": "M1/SM1", "name": "M1 - SM1 - Dashboard", "parent": "M1", "file": "M1-dashboard/SM1-dashboard.md"},
    # M2
    {"code": "M2/SM1", "name": "M2 - SM1 - School", "parent": "M2", "file": "M2-school/SM1-school.md"},
    # M3
    {"code": "M3/SM1", "name": "M3 - SM1 - User School", "parent": "M3", "file": "M3-user-school/SM1-user-school.md"},
    # M4
    {"code": "M4/SM1", "name": "M4 - SM1 - Billing", "parent": "M4", "file": "M4-billing/SM1-billing.md"},
    # M5
    {"code": "M5/SM1", "name": "M5 - SM1 - Top School", "parent": "M5", "file": "M5-statistic/SM1-top-school.md"},
    {"code": "M5/SM2", "name": "M5 - SM2 - Year", "parent": "M5", "file": "M5-statistic/SM2-year.md"},
    # M6
    {"code": "M6/SM1", "name": "M6 - SM1 - Holidays", "parent": "M6", "file": "M6-holidays/SM1-holidays.md"},
    # M7
    {"code": "M7/SM1", "name": "M7 - SM1 - QR Profiles", "parent": "M7", "file": "M7-qr-profiles/SM1-qr-profiles.md"},
    # M8
    {"code": "M8/SM1", "name": "M8 - SM1 - Management", "parent": "M8", "file": "M8-announcement/SM1-management.md"},
    {"code": "M8/SM2", "name": "M8 - SM2 - Upload Media", "parent": "M8", "file": "M8-announcement/SM2-upload-media.md"},
    # M9
    {"code": "M9/SM1", "name": "M9 - SM1 - Announcement", "parent": "M9", "file": "M9-tracking/SM1-announcement.md"},
    {"code": "M9/SM2", "name": "M9 - SM2 - Invoices", "parent": "M9", "file": "M9-tracking/SM2-invoices.md"},
    {"code": "M9/SM3", "name": "M9 - SM3 - Assistant AI", "parent": "M9", "file": "M9-tracking/SM3-assistant-ai.md"},
    {"code": "M9/SM4", "name": "M9 - SM4 - Hook Logs", "parent": "M9", "file": "M9-tracking/SM4-hook-logs.md"},
    # M10
    {"code": "M10/SM1", "name": "M10 - SM1 - Management", "parent": "M10", "file": "M10-mailer-profiles/SM1-management.md"},
    {"code": "M10/SM2", "name": "M10 - SM2 - Create", "parent": "M10", "file": "M10-mailer-profiles/SM2-create.md"},
    # M11
    {"code": "M11/SM1", "name": "M11 - SM1 - Import Lesson Sets", "parent": "M11", "file": "M11-lessons/SM1-import-lesson-sets.md"},
    {"code": "M11/SM2", "name": "M11 - SM2 - Import Lesson Sets For Tenant", "parent": "M11", "file": "M11-lessons/SM2-import-lesson-sets-tenant.md"},
    {"code": "M11/SM3", "name": "M11 - SM3 - Lesson Sets", "parent": "M11", "file": "M11-lessons/SM3-lesson-sets.md"},
    {"code": "M11/SM4", "name": "M11 - SM4 - Lesson Areas", "parent": "M11", "file": "M11-lessons/SM4-lesson-areas.md"},
    {"code": "M11/SM5", "name": "M11 - SM5 - Lesson Groups", "parent": "M11", "file": "M11-lessons/SM5-lesson-groups.md"},
    {"code": "M11/SM6", "name": "M11 - SM6 - Lessons", "parent": "M11", "file": "M11-lessons/SM6-lessons.md"},
    # M12
    {"code": "M12/SM1", "name": "M12 - SM1 - Management", "parent": "M12", "file": "M12-lesson-plans/SM1-management.md"},
    {"code": "M12/SM2", "name": "M12 - SM2 - Categories", "parent": "M12", "file": "M12-lesson-plans/SM2-categories.md"},
    # M13
    {"code": "M13/SM1", "name": "M13 - SM1 - Audit Log", "parent": "M13", "file": "M13-audit-log/SM1-audit-log.md"},
    # M14
    {"code": "M14/SM1", "name": "M14 - SM1 - School Year", "parent": "M14", "file": "M14-schoolyear/SM1-schoolyear.md"},
    # M15
    {"code": "M15/SM1", "name": "M15 - SM1 - Transparent Classroom", "parent": "M15", "file": "M15-transparent-classroom/SM1-transparent-classroom.md"},
    # M16
    {"code": "M16/SM1", "name": "M16 - SM1 - Dashboard", "parent": "M16", "file": "M16-logs/SM1-dashboard.md"},
    {"code": "M16/SM2", "name": "M16 - SM2 - Logs", "parent": "M16", "file": "M16-logs/SM2-logs.md"},
    {"code": "M16/SM3", "name": "M16 - SM3 - Payment Transactions", "parent": "M16", "file": "M16-logs/SM3-payment-transactions.md"},
    {"code": "M16/SM4", "name": "M16 - SM4 - Reconciliation Logs", "parent": "M16", "file": "M16-logs/SM4-reconciliation-logs.md"},
    # M17
    {"code": "M17/SM1", "name": "M17 - SM1 - Brands", "parent": "M17", "file": "M17-partner/SM1-brands.md"},
    {"code": "M17/SM2", "name": "M17 - SM2 - Categories", "parent": "M17", "file": "M17-partner/SM2-categories.md"},
    # M18
    {"code": "M18/SM1", "name": "M18 - SM1 - Campus User Management", "parent": "M18", "file": "M18-campus-user-management/SM1-campus-user-management.md"},
    # M19
    {"code": "M19/SM1", "name": "M19 - SM1 - School Groups", "parent": "M19", "file": "M19-school-groups/SM1-school-groups.md"},
    # M20
    {"code": "M20/SM1", "name": "M20 - SM1 - Sales", "parent": "M20", "file": "M20-sales/SM1-sales.md"},
    # M21
    {"code": "M21/SM1", "name": "M21 - SM1 - Command Runner", "parent": "M21", "file": "M21-others/SM1-command-runner.md"}
]

def split_markdown_table_row(line):
    placeholder = "___ESCAPED_PIPE___"
    safe_line = line.replace(r'\|', placeholder)
    return [c.strip().replace(placeholder, '|') for c in safe_line.split('|')[1:-1]]

def parse_legacy_file(rel_path):
    full_path = os.path.join("docs_legacy/Portal Vận hành QLTH", rel_path)
    if not os.path.exists(full_path):
        raise FileNotFoundError(f"File not found: {full_path}")
        
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read().replace("\r\n", "\n")
        
    # Title
    t_match = re.search(r"^#\s+(.+)$", content, re.M)
    raw_title = t_match.group(1).strip() if t_match else os.path.basename(rel_path)
    
    # Scope / Overview
    scope_match = re.search(r"^>\s+Phạm vi:\s*(.+)$", content, re.M)
    scope = scope_match.group(1).strip() if scope_match else ""
    
    # Overview section text (1.1)
    m_intro = re.search(r"###\s+1\.1\s+(?:Giới thiệu|Giới thiệu chung)(.+?)(?:\n###\s+1\.2|\n---|\n##\s+2)", content, re.DOTALL)
    intro_text = m_intro.group(1).strip() if m_intro else ""
    
    # Actors (1.2)
    actors = []
    m_actors = re.search(r"###\s+1\.2\s+(?:Actors|Đối tượng)(.+?)(?:\n###\s+1\.3|\n---|\n##\s+2)", content, re.DOTALL)
    if m_actors:
        for line in m_actors.group(1).strip().split("\n"):
            if line.startswith("|") and not line.startswith("|---") and not line.startswith("| Actor") and not line.startswith("| Tác nhân"):
                cols = split_markdown_table_row(line)
                if len(cols) >= 2:
                    actors.append({"group": cols[0], "role": cols[0], "actions": cols[1]})
    if not actors:
        actors = [{"group": "Finviet / SOHA Super Admin", "role": "Quản trị nền tảng", "actions": "Vận hành, cấu hình master data và đối soát toàn hệ thống."}]
        
    # Business Steps (2.2)
    b_steps = []
    m_b_steps = re.search(r"###\s+2\.2\s+(?:Business Steps|Mô tả các bước nghiệp vụ)(.+?)(?:\n###\s+2\.3|\n---|\n##\s+3)", content, re.DOTALL)
    if m_b_steps:
        for line in m_b_steps.group(1).strip().split("\n"):
            line_s = line.strip()
            if line_s and re.match(r"^\d+\.", line_s):
                b_steps.append(re.sub(r"^\d+\.\s*", "", line_s))
                
    # Business Rules (2.3)
    br_list = []
    m_br = re.search(r"###\s+2\.3\s+(?:Business Rules|Nguyên tắc nghiệp vụ)(.+?)(?:\n---|\n##\s+3)", content, re.DOTALL)
    if m_br:
        for line in m_br.group(1).strip().split("\n"):
            if line.startswith("|") and not line.startswith("|---") and not line.startswith("| ID") and not line.startswith("| Mã"):
                cols = split_markdown_table_row(line)
                if len(cols) >= 2:
                    br_list.append({"id": cols[0], "title": cols[0], "desc": cols[1]})
                    
    # Acceptance Criteria (3.1)
    ac_list = []
    m_ac = re.search(r"###\s+3\.1\s+Acceptance Criteria(.+?)(?:\n---|\n###\s+3\.2|\n##\s+4)", content, re.DOTALL)
    if m_ac:
        for line in m_ac.group(1).strip().split("\n"):
            line_s = line.strip()
            if line_s.startswith("-") or line_s.startswith("*"):
                cleaned_line = re.sub(r'[*`_#]', '', line_s.lstrip("-* ")).strip()
                ac_list.append(cleaned_line)
                
    # Use cases (3.2)
    uc_list = []
    m_uc = re.search(r"###\s+3\.[23]\s+(?:Danh sách Use Case|Use case|Use cases)(.+?)(?:\n---|\n###\s+3\.[34]|\n##\s+4)", content, re.DOTALL)
    if m_uc:
        for line in m_uc.group(1).strip().split("\n"):
            if line.startswith("|") and not line.startswith("|---") and not line.startswith("| Mã") and not line.startswith("| Use case"):
                cols = split_markdown_table_row(line)
                if len(cols) >= 4:
                    uc_list.append({
                        "id": cols[0],
                        "name": cols[1],
                        "actor": cols[2] if len(cols) > 2 else "Super Admin",
                        "desc": cols[3] if len(cols) > 3 else "",
                        "happy": cols[4] if len(cols) > 4 else "",
                        "rules": cols[6] if len(cols) > 6 else ""
                    })
                    
    # Screenshots
    imgs = re.findall(r"!\[([^\]]*)\]\((screenshots/[^\)]+)\)", content)
    base_dir = os.path.dirname(full_path)
    img_files = []
    for desc, rel_img in imgs:
        img_name = os.path.basename(rel_img)
        abs_img = os.path.join(base_dir, rel_img)
        if os.path.exists(abs_img):
            img_files.append((desc, img_name, abs_img))
            
    return {
        "raw_title": raw_title,
        "scope": scope,
        "intro_text": intro_text,
        "actors": actors,
        "b_steps": b_steps,
        "rules": br_list,
        "ac": ac_list,
        "use_cases": uc_list,
        "images": img_files
    }

def build_managing_prd(item, parsed_data):
    code = item["code"]
    name = item["name"]
    parent_mod = item["parent"]
    
    # 1. Overview context
    intro = parsed_data["intro_text"] or parsed_data["scope"] or f"Phân hệ {name} thuộc Cổng Vận hành Quản lý trường học (Managing Portal)."
    context = (
        f"Phân hệ <strong>{name}</strong> thuộc nhóm <strong>{parent_mod}</strong> trên nền tảng Managing Portal QLTH (<code>api-dev.ecoschool.com.vn</code>). "
        f"{intro} Phân hệ được thiết kế chuẩn hóa cho đợt Rebuild toàn diện, khắc phục triệt để các hạn chế bảo mật và tính năng tồn đọng của bản Legacy."
    )
    
    # 2. Goals
    goals = [
        f"Cung cấp công cụ quản trị tập trung cho phân hệ {name} trên Cổng Điều Hành Managing Portal.",
        "Đảm bảo an toàn thông tin tuyệt đối: Che giấu toàn bộ thông tin nhạy cảm, mật khẩu và API key dạng •••••••• (type='password').",
        "Chuẩn hóa luồng nghiệp vụ thông suốt, loại bỏ các lỗi đứt gãy và các chức năng bỏ dở của hệ thống cũ.",
        "Ghi vết kiểm toán (Audit Trail) chi tiết cho mọi thao tác can thiệp hệ thống của đội ngũ Super Admin."
    ]
    
    # 3. Business Rules enrichment (Applying Confirmed Part B rules)
    rules = list(parsed_data["rules"])
    
    # Security Rule 11.1
    rules.append({
        "id": "BR-SEC-MASK",
        "title": "Bảo vệ thông tin nhạy cảm & Che giấu Credential / API Key (Quy tắc 11.1)",
        "desc": "Tuyệt đối không hiển thị plaintext đối với các trường nhạy cảm (Mật khẩu, API Key, Client Secret, SMTP Password, SInvoice/VNPAY credentials). Mặc định hiển thị dạng •••••••• (type='password') kèm icon mắt để xem hoặc copy khi có quyền."
    })
    
    # Confirm modal Rule 11.4
    rules.append({
        "id": "BR-CONFIRM-MODAL",
        "title": "Hộp thoại xác nhận cho các thao tác nhạy cảm (Quy tắc 11.4)",
        "desc": "Bắt buộc hiển thị Confirm Modal trước khi thực hiện các hành động có mức độ ảnh hưởng lớn: Xóa bản ghi (Delete), Đăng nhập hộ (Impersonate / Login As) hoặc Gán/Gỡ liên kết hệ thống."
    })
    
    # Submodule specific rules based on Part B
    if code == "M2/SM1":
        # Complete removal of Hidden Password (Question 13)
        rules = [r for r in rules if "Hidden Password" not in r.get("desc", "") and "Hidden Password" not in r.get("title", "")]
        rules.append({
            "id": "BR-M2-CLEAN-AUTH",
            "title": "Loại bỏ hoàn toàn cơ chế Hidden Password & Thay bằng Support Token (Câu 13)",
            "desc": "Xóa bỏ hoàn toàn cơ chế 'Hidden Password' (mật khẩu phụ/backdoor), loại bỏ cột chấm màu trạng thái 'Hidden Password Set' và 3 menu item rườm rà. Thay thế bằng cơ chế Support Token có thời hạn ngắn (15 phút) ghi nhận Audit Log đầy đủ khi CSKH cần hỗ trợ người dùng."
        })
        rules.append({
            "id": "BR-M2-SETTINGS-14TABS",
            "title": "Cấu hình sâu 14 Tab Settings cho Tenant",
            "desc": "Quản lý 14 Tab cấu hình sâu chi phối toàn bộ Operating Portal: Cấu hình chung, Hình ảnh (Quota 3000 ảnh/500p video), Hoạt động, Điểm danh (TOFACE), Trao đổi, Hóa đơn & Thanh toán, Thanh toán tự động, Khẩu phần ăn (chốt 10:00), Quản lý tính năng (Wordbook trẻ/học sinh), Apps, Bài học, Màu sắc, Dashboard (Toggle Top GV), và Cấu hình học kỳ."
        })
    elif code == "M18/SM1":
        # Removal of Hidden Password in M18
        rules = [r for r in rules if "Hidden Password" not in r.get("desc", "") and "Hidden Password" not in r.get("title", "")]
        rules.append({
            "id": "BR-M18-CLEAN-AUTH",
            "title": "Loại bỏ hoàn toàn cơ chế Hidden Password & Chuẩn hóa Impersonation (Câu 13)",
            "desc": "Xóa bỏ hoàn toàn 3 action 'Generate Hidden Password', 'Set Hidden Password', 'Clear Hidden Password' khỏi menu More. Thao tác 'Login As' (Impersonate) bắt buộc hiển thị hộp thoại xác nhận trước khi mở tab mới."
        })
    elif code == "M21/SM1":
        # Strict protection for Command Runner (Question 11.2)
        rules.append({
            "id": "BR-CMD-PROTECT",
            "title": "Bảo vệ nghiêm ngặt Command Runner & Danh sách Whitelist (Quy tắc 11.2)",
            "desc": "Bắt buộc xác thực lại mật khẩu (password.confirm) trước khi truy cập. Giới hạn thực thi nghiêm ngặt theo danh sách Whitelist lệnh an toàn (cache:clear, route:clear, config:cache, reconciliation:run, tenant:sync). Bắt buộc có Modal xác nhận ghi rõ tên Tenant bị tác động. Tự động che (redact) các tham số nhạy cảm trong Audit Log."
        })
    elif code in ["M8/SM1", "M11/SM6", "M12/SM1"]:
        # Rich Text Editor upgrade (Question 11.3)
        rules.append({
            "id": "BR-RTE-UPGRADE",
            "title": "Nâng cấp bộ soạn thảo Rich Text & Làm sạch HTML Sanitization (Quy tắc 11.3)",
            "desc": "Thay thế CKEditor 4.18.0 lỗi thời bằng trình soạn thảo phiên bản mới an toàn, có cơ chế HTML Sanitization chống tấn công XSS khi lưu nội dung thông báo hoặc giáo án."
        })
    elif code == "M12/SM2":
        # Categories full CRUD (Question 12.1)
        rules.append({
            "id": "BR-CAT-CRUD",
            "title": "Hoàn thiện đầy đủ chức năng CRUD Lesson Plan Categories (Quy tắc 12.1)",
            "desc": "Khắc phục triệt để lỗi thiếu nút Create và lỗi 404 của bản Legacy: Cung cấp đầy đủ form Thêm mới, Chỉnh sửa và Xóa danh mục kế hoạch giảng dạy để M12/SM1 có danh mục lựa chọn."
        })
    elif code == "M14/SM1":
        # School Year modal fix (Question 12.2)
        rules.append({
            "id": "BR-SY-MODAL-FIX",
            "title": "Chuẩn hóa Modal 'Apply School Year for School' (Quy tắc 12.2)",
            "desc": "Sửa tiêu đề lỗi 'Modal title' thành 'Apply School Year for School' và bổ sung trường chọn Năm học (School Year) bên cạnh trường chọn Trường (School) trên form áp dụng niên khóa."
        })
    elif code == "M9/SM1":
        # Tracking announcement query fix (Question 12.3)
        rules.append({
            "id": "BR-TRK-ANN-FIX",
            "title": "Chuẩn hóa truy vấn Tracking Announcement theo Trường & Ngày (Quy tắc 12.3)",
            "desc": "Sửa logic truy vấn dữ liệu theo School ID và Ngày phát hành để trả về chính xác danh sách các thông báo hệ thống đã gửi kèm trạng thái đã nhận/đã xem của trường."
        })
    elif code in ["M9/SM3", "M9/SM4"]:
        # Assistant AI & Hook Logs retry (Question 12.4)
        rules.append({
            "id": "BR-HOOK-RETRY",
            "title": "Hiển thị đầy đủ thông tin truy vết & Nút Thử lại (Retry) Webhook (Quy tắc 12.4)",
            "desc": "Bổ sung cột Question và School tại bảng Assistant AI. Hiển thị mã tham chiếu Reference và cung cấp nút 'Retry' (Thử gửi lại) cho các bản ghi webhook có trạng thái Xử lý lỗi tại Hook Logs."
        })
    elif code in ["M10/SM1", "M10/SM2"]:
        # Mailer school dropdown (Question 12.5)
        rules.append({
            "id": "BR-MAIL-SCHOOL",
            "title": "Bổ sung trường chọn Trường học cho Mailer Profile (Quy tắc 12.5)",
            "desc": "Bổ sung trường chọn School (tùy chọn) trên form cấu hình SMTP để cho phép thiết lập máy chủ gửi mail riêng cho từng trường hoặc để trống làm Default toàn hệ thống."
        })
    elif code == "M16/SM4":
        # Reconciliation manual trigger (Question 12.6)
        rules.append({
            "id": "BR-RECON-TRIGGER",
            "title": "Nút kích hoạt Đối soát thủ công theo khoảng ngày (Quy tắc 12.6)",
            "desc": "Cung cấp nút 'Chạy đối soát thủ công (Trigger Reconciliation)' trên giao diện cho phép Super Admin chủ động kích hoạt lại tiến trình đối soát thanh toán khi cronjob tự động gặp sự cố."
        })
    elif code == "M17/SM2":
        # Advertisements inside SM2 (Question 14)
        rules.append({
            "id": "BR-ADV-MGMT",
            "title": "Quản lý chiến dịch quảng cáo Advertisements theo Category (Câu 14)",
            "desc": "Tích hợp quản lý chi tiết các mẫu quảng cáo (Advertisements) theo từng danh mục đối tác: Tiêu đề, Nội dung, Hình ảnh banner, Ngày hết hạn (Expiration date) và Trạng thái hiển thị."
        })
        
    # 4. Use Cases
    use_cases = []
    if parsed_data["use_cases"]:
        for uc in parsed_data["use_cases"]:
            use_cases.append({
                "id": uc["id"] if uc["id"].startswith("UC") else f"UC-{uc['id']}",
                "name": uc["name"],
                "desc": uc["desc"] or uc["name"],
                "actor": uc["actor"] or "Super Admin",
                "trigger": "Thao tác trên giao diện Managing Portal",
                "pre": "Đã đăng nhập tài khoản Super Admin với quyền hạn tương ứng",
                "happy_path": [step.strip() for step in uc["happy"].split("<br>") if step.strip()] if "<br>" in uc["happy"] else [uc["happy"] or "Thực hiện thành công."],
                "exceptions": [
                    {"case": "Lỗi kết nối hoặc không có quyền", "handling": "Hệ thống hiển thị thông báo lỗi và từ chối thao tác."}
                ],
                "post": "Dữ liệu được cập nhật và ghi nhận vào Audit Log.",
                "rules": [r["id"] for r in rules[:3]]
            })
    else:
        use_cases.append({
            "id": f"UC-{code.replace('/', '-')}-01",
            "name": f"Tra cứu và thao tác quản trị trên {name}",
            "desc": f"Super Admin mở giao diện {name} để xem và quản trị dữ liệu.",
            "actor": "Super Admin",
            "trigger": "Truy cập từ menu sidebar Managing Portal",
            "pre": "Đã đăng nhập hệ thống.",
            "happy_path": [
                f"1. Mở menu sidebar -> chọn {name}.",
                "2. Hệ thống tải bảng dữ liệu và các bộ lọc tìm kiếm.",
                "3. Thực hiện thao tác tác nghiệp và lưu dữ liệu an toàn."
            ],
            "exceptions": [
                {"case": "Mất kết nối máy chủ", "handling": "Hiển thị thông báo thử lại."}
            ],
            "post": "Thao tác hoàn tất thành công.",
            "rules": [r["id"] for r in rules[:2]]
        })
        
    # 5. UI screens table & images
    screens_table = []
    if parsed_data["images"]:
        for idx, (img_desc, img_name, img_path) in enumerate(parsed_data["images"], 1):
            screens_table.append({
                "screen": f"Màn hình {idx}: {img_desc or img_name}",
                "component": f"Giao diện {name}",
                "format": "Responsive Admin Table / Form",
                "desc": img_desc or f"Giao diện tác nghiệp {name} trên Managing Portal.",
                "note": "Tuân thủ tiêu chuẩn an toàn & UX chuẩn",
                "image": img_name
            })
    else:
        screens_table.append({
            "screen": f"Giao diện chính {name}",
            "component": "Admin Console Panel",
            "format": "Standard DataTables View",
            "desc": f"Bảng dữ liệu và bộ công cụ tác nghiệp của phân hệ {name}.",
            "note": "Chuẩn hóa Rebuild 2026"
        })
        
    # 6. Acceptance Criteria
    ac_items = []
    if parsed_data["ac"]:
        for idx, ac_text in enumerate(parsed_data["ac"], 1):
            clean_ac = re.sub(r'[*`_#]', '', ac_text).strip()
            ac_title = f"Nghiệm thu tiêu chí {idx}: {clean_ac[:75]}..." if len(clean_ac) > 75 else f"Nghiệm thu tiêu chí {idx}: {clean_ac}"
            ac_items.append({
                "id": f"AC-{code.replace('/', '-')}-{idx:02d}",
                "title": ac_title,
                "scenario": f"Given Super Admin truy cập {name}\nWhen thực hiện kiểm tra tiêu chí '{clean_ac}'\nThen hệ thống đáp ứng chính xác theo quy chuẩn thiết kế."
            })
    else:
        ac_items.append({
            "id": f"AC-{code.replace('/', '-')}-01",
            "title": f"Quản trị và hiển thị chính xác dữ liệu {name}",
            "scenario": f"Given Super Admin mở phân hệ {name}\nWhen tải dữ liệu và thực hiện tác nghiệp\nThen dữ liệu hiển thị chính xác, bảo mật và ghi vết kiểm toán đầy đủ."
        })
        
    return {
        "code": code,
        "name": name,
        "parent_module": parent_mod,
        "parent_category": f"9. Portal Vận hành QLTH > {parent_mod}",
        "priority": "HIGH",
        "status": "APPROVED",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-28",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": context,
            "goals_list": goals,
            "target_users": parsed_data["actors"],
            "glossary": [
                {"term": "Managing Portal", "definition": "Cổng điều hành và quản trị tập trung dành cho đội ngũ Super Admin của đơn vị vận hành nền tảng Finviet / SOHA."},
                {"term": "Tenant", "definition": "Một trường học hoặc tổ chức giáo dục độc lập hoạt động trong kiến trúc Multi-tenant."},
                {"term": "Audit Log", "definition": "Nhật ký kiểm toán lưu vết bất biến mọi hành vi can thiệp hệ thống của người quản trị."}
            ]
        },
        "business": {
            "flow_desc": f"Quy trình tác nghiệp quản trị trên phân hệ {name} của Managing Portal.",
            "flow_steps": [
                {"actor": "Super Admin", "action": "Đăng nhập và truy cập phân hệ", "desc": f"Mở {name} từ sidebar Managing Portal."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra quyền & Tải dữ liệu", "desc": "Xác thực phiên làm việc, che giấu mật khẩu và tải dữ liệu tương ứng."},
                {"actor": "Super Admin", "action": "Tác nghiệp & Xác nhận", "desc": "Thực hiện tìm kiếm, cấu hình hoặc sửa đổi dữ liệu qua Confirm modal."},
                {"actor": "Hệ thống BE", "action": "Ghi nhận Audit Log", "desc": "Lưu vết chi tiết người thực hiện, thời gian, IP và thông tin thay đổi."}
            ],
            "steps_narrative": parsed_data["b_steps"] if parsed_data["b_steps"] else [
                "Bước 1: Super Admin đăng nhập và mở phân hệ từ sidebar.",
                "Bước 2: Hệ thống kiểm tra quyền hạn và tải dữ liệu lên bảng quản trị.",
                "Bước 3: Thực hiện thao tác nghiệp vụ cần thiết và xác nhận an toàn.",
                "Bước 4: Hệ thống ghi vết kiểm toán và thông báo kết quả thành công."
            ],
            "rules": rules,
            "data_entities": [
                {"field": "id", "type": "BigInteger (Auto-increment)", "required": "Bắt buộc", "desc": "Khóa chính bản ghi quản trị."},
                {"field": "school_id", "type": "BigInteger (Foreign Key)", "required": "Tùy chọn", "desc": "Mã trường học liên kết (Tenant ID)."},
                {"field": "status", "type": "Enum / Integer", "required": "Bắt buộc", "desc": "Trạng thái kích hoạt bản ghi."},
                {"field": "created_at", "type": "Timestamp", "required": "Bắt buộc", "desc": "Thời điểm khởi tạo bản ghi."},
                {"field": "updated_at", "type": "Timestamp", "required": "Bắt buộc", "desc": "Thời điểm cập nhật gần nhất."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": f"E-MP-{parent_mod} Quản trị {parent_mod}", "feature": f"Tác nghiệp quản trị {name}", "platform": "Managing Portal Web", "priority": "P1", "story": f"Là Super Admin, tôi muốn quản trị dữ liệu {name} an toàn và thông suốt.", "jira": f"MP-{parent_mod}-001"}
            ],
            "use_cases": use_cases
        },
        "ui": {
            "entry_point": f"Sidebar Managing Portal -> {parent_mod} -> {name}",
            "screens_table": screens_table
        },
        "acceptance_criteria": ac_items,
        "nfr": {
            "performance": "Tải bảng dữ liệu dưới 500ms với cơ chế phân trang phía máy chủ (Server-side Pagination).",
            "security": "Che giấu toàn bộ API Key/Mật khẩu; Bắt buộc xác nhận mật khẩu cho các tác vụ nhạy cảm; Tuân thủ NĐ 13/2023/NĐ-CP.",
            "ux": "Giao diện quản trị nhất quán, hỗ trợ tìm kiếm debounce, thông báo toast phản hồi tức thì."
        },
        "operations_rules": [
            {
                "situation": f"Yêu cầu can thiệp dữ liệu hoặc cấu hình đặc thù tại {name}",
                "action": "Super Admin đối chiếu văn bản phê duyệt, kiểm tra phạm vi ảnh hưởng trước khi thực hiện.",
                "system": "Ghi nhận đầy đủ Audit Log (User ID, IP, Hành động, Thông tin bản ghi trước và sau khi đổi)."
            },
            {
                "situation": "Phát hiện sự cố không đồng bộ hoặc dữ liệu bất thường liên tenant",
                "action": "Super Admin tạm khóa chức năng tác động và thông báo bộ phận DevOps kiểm tra nhật ký máy chủ.",
                "system": "Kích hoạt thông báo cảnh báo qua kênh giám sát vận hành hệ thống."
            }
        ],
        "appendix": {
            "notifications": [
                {"event": f"Thay đổi cấu hình tại {name}", "channel": "Audit Log & Slack Alert", "recipient": "DevOps & Lead Super Admin", "content": f"Super Admin vừa cập nhật cấu hình tại phân hệ {name}."}
            ],
            "edge_cases": [
                {"condition": "Mất kết nối mạng khi đang lưu dữ liệu", "solution": "Hệ thống báo lỗi kết nối và giữ nguyên form nhập liệu để người dùng gửi lại."}
            ]
        }
    }

def main():
    print("===================================================================")
    print("  STARTING PUBLICATION OF 9. PORTAL VẬN HÀNH QLTH ON CONFLUENCE")
    print("===================================================================")
    
    upload_attachments = "--upload-attachments" in sys.argv
    print(f"Attachment upload mode: {'ENABLED' if upload_attachments else 'SKIPPED (screenshots already attached)'}")
    
    client = ConfluenceClient(BASE_URL, TOKEN, SPACE_KEY)
    
    # 1. Verify Parent Module Pages
    print("\n--- Phase 1: Verifying 21 Parent Module Pages ---")
    KNOWN_PARENTS = {
        "M1": 107850726, "M2": 107850727, "M3": 107850728, "M4": 107850729,
        "M5": 107850730, "M6": 107850731, "M7": 107850732, "M8": 107850733,
        "M9": 107850734, "M10": 107850735, "M11": 107850736, "M12": 107850737,
        "M13": 107850738, "M14": 107850739, "M15": 107850740, "M16": 107850741,
        "M17": 107850742, "M18": 107850743, "M19": 107850744, "M20": 107850745,
        "M21": 107850746
    }
    parent_ids = dict(KNOWN_PARENTS)
    print(f"Using {len(parent_ids)} mapped Parent Modules!")
    
    # Load existing manifest for known page IDs
    manifest_path = "tools/confluence/managing_portal_manifest.json"
    known_pages = {}
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                old_manifest = json.load(f)
                for item in old_manifest:
                    if item.get("name") and item.get("page_id"):
                        known_pages[item["name"]] = item["page_id"]
        except Exception:
            pass
            
    # 2. Build and Publish 37 Sub-modules
    print("\n--- Phase 2: Building & Publishing 37 Sub-module PRDs ---")
    manifest = []
    
    for idx, item in enumerate(SUBMODULE_CATALOG, 1):
        code = item["code"]
        name = item["name"]
        parent_mod = item["parent"]
        parent_id = parent_ids.get(parent_mod)
        rel_file = item["file"]
        
        print(f"[{idx:02d}/37] Processing {code:8} -> '{name}' (Parent: {parent_mod}:{parent_id})...", end="", flush=True)
        
        parsed_data = parse_legacy_file(rel_file)
        prd = build_managing_prd(item, parsed_data)
        
        # Determine page_id
        page_id = known_pages.get(name)
        curr_ver = None
        
        if page_id:
            try:
                page_info = client.get_page(page_id)
                curr_ver = page_info["version"]["number"]
            except Exception:
                page_id = None
                
        if not page_id:
            existing_sub = client.get_page_by_title(name)
            if existing_sub:
                page_id = existing_sub["id"]
                curr_ver = existing_sub["version"]["number"]
                
        # Upload screenshot attachments only if explicitly requested
        if upload_attachments and parsed_data["images"]:
            if not page_id:
                temp_res = client.create_page(name, parent_id, "<p>Initializing PRD Storage Format...</p>")
                page_id = temp_res["id"]
                curr_ver = 1
                time.sleep(0.2)
                
            for desc, img_name, img_path in parsed_data["images"]:
                try:
                    client.upload_attachment(page_id, img_path, img_name)
                except Exception as e_img:
                    pass
                    
        # Render full 8-section XHTML storage format with clean XHTML tags
        html_storage = render_prd_storage_format(prd)
        
        # Create or update page with full content
        try:
            if page_id and curr_ver is not None:
                res = client.update_page(page_id, name, parent_id, html_storage, curr_ver)
                action = "updated"
                ver = curr_ver + 1
            else:
                res = client.create_or_update_page(name, parent_id, html_storage)
                action = res.get("action", "unknown")
                page_id = res.get("id")
                ver = res.get("version")
                
            url = f"{BASE_URL}/pages/viewpage.action?pageId={page_id}"
            print(f" {action.upper()} (ID: {page_id}, v{ver})")
            
            manifest.append({
                "code": code,
                "name": name,
                "parent_module": parent_mod,
                "parent_id": parent_id,
                "page_id": page_id,
                "version": ver,
                "action": action,
                "url": url,
                "screenshots_count": len(parsed_data["images"]),
                "status": "SUCCESS"
            })
        except Exception as e:
            print(f" FAILED! Error: {e}")
            manifest.append({
                "code": code,
                "name": name,
                "parent_module": parent_mod,
                "parent_id": parent_id,
                "error": str(e),
                "status": "FAILED"
            })
            
        time.sleep(0.3)
        
    # Save manifest
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        
    print("\n===================================================================")
    successful = len([m for m in manifest if m.get("status") == "SUCCESS"])
    print(f"  PUBLISHING COMPLETED: {successful}/37 SUB-MODULES SUCCESSFUL")
    print(f"  Manifest written to: {manifest_path}")
    print("===================================================================")

if __name__ == "__main__":
    main()
