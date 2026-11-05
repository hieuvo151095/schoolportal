# -*- coding: utf-8 -*-
"""
Update Root Page '9. Portal Vận hành QLTH' (ID: 107850725)
with an executive dashboard, cross-portal architecture matrix, and complete 37-submodule index.
"""

import sys
import os
import json
import time

sys.path.insert(0, os.path.abspath("."))

from tools.confluence.confluence_client import ConfluenceClient

TOKEN = os.environ.get("CONFLUENCE_TOKEN", "")
BASE_URL = "https://kb.finviet.com.vn"
SPACE_KEY = "EDUS"
ROOT_PAGE_ID = 107850725

client = ConfluenceClient(BASE_URL, TOKEN, SPACE_KEY)

with open("tools/confluence/managing_portal_manifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Group submodules by parent module
grouped = {}
for item in manifest:
    pmod = item["parent_module"]
    if pmod not in grouped:
        grouped[pmod] = []
    grouped[pmod].append(item)

# Build HTML content for Root Page
html_parts = []

# 1. Header Metadata Table
html_parts.append("""
<table class="wrapped">
<colgroup><col style="width: 220px;"/><col style="width: 580px;"/></colgroup>
<thead><tr><th colspan="2" style="background-color: #0070CE; color: #FFFFFF; font-size: 16px;"><strong>HỆ THỐNG ĐIỀU HÀNH &amp; QUẢN TRỊ NỀN TẢNG (MANAGING PORTAL QLTH)</strong></th></tr></thead>
<tbody>
<tr><td><strong>Nền tảng / Domain</strong></td><td><code>api-dev.ecoschool.com.vn</code> (Managing Console)</td></tr>
<tr><td><strong>Mục đích hệ thống</strong></td><td>Điều phối đa trường (Multi-tenant Orchestration), Cấu hình Tenant 14 Tab, Cấp VietQR/SMTP, Đối soát thanh toán tập trung, Quản lý kho bài học Montessori và Giám sát kỹ thuật toàn hệ thống.</td></tr>
<tr><td><strong>Đối tượng người dùng</strong></td><td>Ban Lãnh Đạo Finviet / SOHA, Đội ngũ Kỹ sư Hệ thống (DevOps), Kế toán Nền tảng, và Chuyên viên CSKH / Triển khai.</td></tr>
<tr><td><strong>Trạng thái tài liệu</strong></td><td><span style="color: #0A8754; font-weight: bold;">APPROVED FOR PRODUCTION REBUILD</span></td></tr>
<tr><td><strong>Tiêu chuẩn kỹ thuật &amp; An ninh</strong></td><td>OWASP Top 10, ISO 27001, Nghị định 13/2023/NĐ-CP (Bảo vệ dữ liệu cá nhân), Xóa bỏ hoàn toàn Backdoor/Hidden Password, Che giấu thông tin nhạy cảm (Credentials Masking).</td></tr>
<tr><td><strong>Quy mô phân hệ</strong></td><td><strong>21 Module Cha (M1 – M21)</strong> | <strong>37 Phân hệ con (Sub-modules)</strong> | <strong>109 Ảnh chụp thực tế đính kèm</strong></td></tr>
<tr><td><strong>Ngày phê duyệt</strong></td><td>28/10/2026</td></tr>
</tbody>
</table>
""")

# 2. Executive Overview
html_parts.append("""
<h2>1. Tổng Quan Kiến Trúc Nền Tảng Multi-Tenant</h2>
<p><strong>Managing Portal QLTH</strong> là trung tâm chỉ huy tối cao (Super Admin Control Plane) điều phối toàn bộ các cơ sở giáo dục vận hành trên nền tảng. Hệ thống được liên thông chặt chẽ với <strong>8. Portal QLTH</strong> (Operating Portal của từng trường học):</p>
<ul>
    <li><strong>Khởi tạo &amp; Cấu hình Tenant (M2):</strong> Quản lý danh sách trường học và trang <strong>14 Tab Settings</strong> chi phối toàn bộ hành vi của Operating Portal (Hạn mức 3.000 ảnh/500p video tại M1, Ngưỡng chốt suất ăn 10:00 tại M1, TOFACE AI Face Recognition tại M6/SM4, Từ điển Wordbook <em>'trẻ' ⇄ 'học sinh'</em> tại M6/SM1, và Cấu hình 2 kỳ học độc lập tại M3/SM3).</li>
    <li><strong>Hạ tầng Thanh toán &amp; Đối soát (M7, M16):</strong> Quản trị 14 cấu hình VietQR Profile (Client ID &amp; API Key) và vận hành tiến trình đối soát thanh toán học phí hàng loạt qua <code>api.super.reconciliation-logs.create</code>, cấp dữ liệu trực tiếp cho phân hệ Đối soát M4/SM2 của trường.</li>
    <li><strong>Tính cước bản quyền B2B (M4):</strong> Thu phí phần mềm trường học theo công thức <code>Đơn giá học sinh (Price per kid) &times; Số học sinh tính phí (Charged kids)</code> trừ vào hạn mức Tín dụng (Credits) của trường.</li>
    <li><strong>Kho học liệu chuẩn Montessori (M11, M15):</strong> Lưu trữ 5.217 bài học (8 Bộ, 54 Lĩnh vực, 1.135 Nhóm) được đồng bộ từ Transparent Classroom, cung cấp dữ liệu gắn thẻ <code># Bài học</code> cho giáo viên tại M2/SM2 (Hoạt động).</li>
    <li><strong>Kênh Thông báo hệ thống (M8):</strong> Phát hành thông báo vận hành, bảo trì và thông tư trực tiếp tới phân hệ M7/SM1 (<code>/system/announcement/</code>) của từng trường học.</li>
</ul>
""")

# 3. Security Highlights
html_parts.append("""
<h2>2. Khung Tiêu Chuẩn Bảo Mật &amp; Điểm Cải Tiến Chiến Lược (Rebuild 2026)</h2>
<table class="wrapped">
<colgroup><col style="width: 250px;"/><col style="width: 550px;"/></colgroup>
<thead><tr><th><strong>Quy định bảo mật</strong></th><th><strong>Nội dung chuẩn hóa trong PRD</strong></th></tr></thead>
<tbody>
<tr><td><strong>1. Xóa bỏ hoàn toàn Hidden Password (Câu 13)</strong></td><td>Triệt tiêu hoàn toàn cơ chế mật khẩu phụ/backdoor tại M2 (User School) và M18 (Campus Admin). Loại bỏ cột chấm màu trạng thái và 3 action trong menu More. Thay thế bằng cơ chế <strong>Support Token có thời hạn ngắn (15 phút)</strong> ghi nhận Audit Log bất biến khi CSKH cần hỗ trợ.</td></tr>
<tr><td><strong>2. Che giấu Credential &amp; API Key (Quy tắc 11.1)</strong></td><td>Toàn bộ mật khẩu SMTP (M10), VietQR Client ID &amp; Key (M7), SInvoice/VNPAY Secret Key (M2), Transparent Classroom Token (M15) mặc định hiển thị dạng <code>••••••••</code> (<code>type="password"</code>).</td></tr>
<tr><td><strong>3. Bảo vệ nghiêm ngặt Command Runner (Quy tắc 11.2)</strong></td><td>Phân hệ M21 yêu cầu xác thực lại mật khẩu (<code>password.confirm</code>), thực thi theo Whitelist lệnh an toàn, bắt buộc có Confirm Modal nêu rõ tên Tenant bị tác động, tự động che giấu tham số nhạy cảm trong log.</td></tr>
<tr><td><strong>4. Nâng cấp Rich Text Editor (Quy tắc 11.3)</strong></td><td>Thay thế CKEditor 4.18.0 lỗi thời bằng bộ soạn thảo hiện đại có cơ chế làm sạch mã nguồn (HTML Sanitization) chống tấn công XSS tại M8, M11, M12.</td></tr>
<tr><td><strong>5. Hộp thoại xác nhận thao tác (Quy tắc 11.4)</strong></td><td>Bắt buộc có Confirm Modal trước khi Xóa bản ghi (Delete), Đăng nhập hộ (Impersonate / Login As) hoặc Gán/Gỡ trường khỏi QR Profile.</td></tr>
<tr><td><strong>6. Hoàn thiện các tính năng bị bỏ dở (Quy tắc 12)</strong></td><td>Bổ sung CRUD đầy đủ cho Lesson Plan Categories (M12/SM2), chuẩn hóa Modal Apply School Year (M14), sửa truy vấn Tracking Announcement (M9/SM1), bổ sung nút Retry Webhook (M9/SM4), thêm chọn School cho Mailer Profile (M10) và nút Trigger Reconciliation thủ công (M16/SM4).</td></tr>
</tbody>
</table>
""")

# 4. Master Submodule Index
html_parts.append("""
<h2>3. Danh Mục 21 Module &amp; 37 Sub-Module PRD</h2>
<table class="wrapped">
<colgroup><col style="width: 100px;"/><col style="width: 320px;"/><col style="width: 180px;"/><col style="width: 120px;"/><col style="width: 80px;"/></colgroup>
<thead><tr><th><strong>Mã</strong></th><th><strong>Tên phân hệ (Sub-module)</strong></th><th><strong>Phân hệ cha</strong></th><th><strong>Trạng thái</strong></th><th><strong>Hình ảnh</strong></th></tr></thead>
<tbody>
""")

for item in manifest:
    code = item["code"]
    name = item["name"]
    pmod = item["parent_module"]
    url = item["url"]
    sc_count = item.get("screenshots_count", 0)
    html_parts.append(f"""
<tr>
    <td><strong>{code}</strong></td>
    <td><a href="{url}"><strong>{name}</strong></a></td>
    <td>{pmod}</td>
    <td><span style="color: #0A8754; font-weight: bold;">PUBLISHED (v{item.get('version', 1)})</span></td>
    <td style="text-align: center;">{sc_count} ảnh</td>
</tr>
""")

html_parts.append("""
</tbody>
</table>
""")

full_html = "".join(html_parts)

# Update Root page
existing = client.get_page(ROOT_PAGE_ID)
curr_ver = existing["version"]["number"]
res = client.update_page(ROOT_PAGE_ID, "9. Portal Vận hành QLTH", None, full_html, curr_ver)
print(f"Root Page '9. Portal Vận hành QLTH' updated successfully: Version {res['version']['number']}")
