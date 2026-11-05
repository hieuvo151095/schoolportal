# -*- coding: utf-8 -*-
"""
Publish/Update Module M4 - Tài chính PRDs on Confluence:
- Create & Publish: M4 - SM7 - Danh mục thu (Parent: M4 - Tài chính, ID 107850392)
- Update & Re-publish: M4 - SM3 - Khoản phí (ID 107850413) with Revenue Category mapping & filter
- Attach fresh screenshots for M4/SM1, M4/SM2, M4/SM3, M4/SM4, M4/SM6, M4/SM7
"""

import os
import json
import ssl
import sys

sys.path.insert(0, os.path.dirname(__file__))

from confluence_client import ConfluenceClient
from prd_template import render_prd_storage_format

BASE_URL = 'https://kb.finviet.com.vn'
TOKEN = os.environ.get("CONFLUENCE_TOKEN", "")
SPACE = 'EDUS'
M4_PARENT_ID = 107850392
M4_SM7_PAGE_ID = 107850958
M4_SM3_PAGE_ID = 107850413

SCREENSHOTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../crawler/screenshots'))

client = ConfluenceClient(BASE_URL, TOKEN, SPACE)

# -----------------------------------------------------------------------------
# 1. PRD DATA FOR M4 - SM7 - Danh mục thu
# -----------------------------------------------------------------------------
m4_sm7_prd_data = {
    "code": "M4/SM7",
    "name": "M4 - SM7 - Danh mục thu",
    "priority": "MUST HAVE",
    "status": "APPROVED FOR BUILD",
    "owner": "hieu.vo1@finviet.com.vn",
    "reviewer": "hieu.vo1@finviet.com.vn",
    "created_date": "2026-10-28",
    "parent_module": "M4 - Tài chính",
    "parent_category": "8. Portal QLTH > M4 - Tài chính > M4 - SM7 - Danh mục thu",
    "history": [
        {
            "version": "1.0",
            "section": "Khởi tạo tài liệu",
            "content": "Khởi tạo đặc tả phân hệ Danh mục thu (Revenue Categories) liên kết CSDL Sở GD&ĐT theo chuẩn ECO FINVIET Design System.",
            "date": "2026-10-28",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.1",
            "section": "Cập nhật Quy tắc BR & AC",
            "content": "Bổ sung chi tiết 8 Business Rules (BR-RC-01 đến BR-RC-08), 3 Use Cases, và bộ tiêu chuẩn nghiệm thu Given-When-Then.",
            "date": "2026-10-28",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.2",
            "section": "Đính kèm Prototype & Hóa đơn điện tử",
            "content": "Đính kèm hình ảnh chụp thực tế màn hình Danh mục thu live, liên thông mã định danh thuế và HĐĐT Viettel sInvoice.",
            "date": "2026-10-28",
            "author": "hieu.vo1@finviet.com.vn"
        }
    ],

    # 1. Thông tin tổng quan
    "overview": {
        "context": (
            "Phân hệ <strong>Quản lý Danh Mục Thu CSDL Sở (Educational Revenue Categories & Master Data Catalog)</strong> "
            "thuộc nhóm <strong>M4: Tài chính</strong> đóng vai trò là danh mục dữ liệu gốc (Master Data Catalog) được đồng bộ "
            "trực tiếp từ Cơ sở dữ liệu ngành Giáo dục và Đào tạo (CSDL Sở GD&ĐT) và Cổng Quản lý Vận hành QLTH (`/[schoolCode]/school/revenue-categories`). "
            "Phân hệ chịu trách nhiệm chuẩn hóa toàn bộ các nguồn thu được phép áp dụng tại nhà trường, quy định mã định danh thuế, căn cứ pháp lý, "
            "đơn vị tính chuẩn và thời hạn hiệu lực cho mọi khoản phí (`school-fees`), bảng kê học phí lớp (`tuition-management`), hóa đơn học sinh (`fee`), "
            "cũng như phục vụ phân loại nguồn thu và xuất hóa đơn điện tử (Viettel sInvoice / VNPT)."
        ),
        "goals_list": [
            "Chuẩn hóa và đồng bộ tập trung toàn bộ danh mục các nguồn thu của nhà trường theo danh mục định danh và quy định của Sở Giáo dục & Đào tạo (CSDL Sở) và Cổng Quản lý Vận hành QLTH.",
            "Cung cấp mã định danh duy nhất (Tax/CSDL ID) và căn cứ pháp lý cho từng danh mục nguồn thu phục vụ xuất Hóa đơn điện tử (Viettel sInvoice / VNPT) và đối soát tài chính.",
            "Tích hợp tính năng 'Đồng bộ CSDL' một chạm, tự động nạp các khoản thu quy định mới nhất từ cơ quan chủ quản.",
            "Liên kết trực tiếp với 'Khoản phí' (M4/SM3) và 'Quản lý học phí' (M4/SM4), phân loại doanh thu chính xác theo nguồn ngân sách và xã hội hóa.",
            "Hỗ trợ lọc theo trạng thái hiệu lực (Đang áp dụng / Ngừng áp dụng) và tìm kiếm không dấu thời gian thực."
        ],
        "target_users": [
            {
                "group": "Ban Giám Hiệu & Kế toán trường học",
                "role": "Theo dõi và đồng bộ danh mục",
                "actions": "Kiểm tra danh mục thu được phép thu theo niên khóa, thực hiện đồng bộ một chạm với CSDL Sở GD&ĐT, kiểm tra hiệu lực và trạng thái các nguồn thu."
            },
            {
                "group": "Quản trị viên hệ thống (Portal Vận hành)",
                "role": "Quản trị Master Data toàn trường",
                "actions": "Quản lý master catalog danh mục thu toàn hệ thống, phân quyền và thiết lập tính hiệu lực cho từng cấp học và địa bàn."
            },
            {
                "group": "Bộ phận Tài chính & Thuế",
                "role": "Đối soát & Xuất hóa đơn",
                "actions": "Đối soát mã danh mục thu với danh mục hàng hóa/dịch vụ trên hệ thống Hóa đơn điện tử (sInvoice), đảm bảo tuân thủ Thông tư 78/2021/TT-BTC."
            }
        ],
        "glossary": [
            {"term": "Danh mục thu (Revenue Category)", "definition": "Danh mục định danh chính thức các nguồn thu giáo dục do Sở GD&ĐT hoặc Nhà trường ban hành (e.g. Học phí chính khóa, Tiền ăn bán trú, Bảo hiểm y tế, Xe đưa đón), có mã chuẩn duy nhất."},
            {"term": "CSDL Sở", "definition": "Cơ sở dữ liệu ngành Giáo dục và Đào tạo quản lý tập trung mã số học sinh, lớp học và danh mục các khoản thu được phép áp dụng."},
            {"term": "Đồng bộ CSDL (Sync Database)", "definition": "Quy trình gọi API liên thông giữa School Portal và Central Database để kéo về phiên bản danh mục thu mới nhất mà không cần nhập liệu thủ công."},
            {"term": "Trạng thái áp dụng (Active / Inactive)", "definition": "Đang áp dụng (Active - hiệu lực thu) hoặc Ngừng áp dụng (Inactive - đã hết hạn hoặc tạm dừng theo quyết định chuyên môn)."},
            {"term": "Khoảng thời gian hiệu lực (Validity Period)", "definition": "Thời hạn áp dụng danh mục thu, ví dụ 'Từ 01/09/2025' hoặc '01/09/2025 - 30/06/2027'."},
            {"term": "Xuất HĐĐT (e-Invoice Export)", "definition": "Cờ kích hoạt xuất hóa đơn điện tử khi phụ huynh đóng tiền, liên kết mã danh mục thu với danh mục dịch vụ Viettel sInvoice / VNPT."}
        ]
    },

    # 2. Nghiệp vụ & Kiến trúc dữ liệu
    "business": {
        "flow_desc": "Mô hình hóa toàn bộ các luồng tương tác nghiệp vụ giữa Kế toán trường học, Web Portal QLTH, Hệ thống Backend (BE API) và Cơ sở dữ liệu CSDL Sở GD&ĐT / Portal Vận hành.",
        "flow_steps": [
            {"actor": "Kế toán", "action": "Truy cập Tài chính > Danh mục thu", "desc": "Gửi GET /api/1.0/revenue-categories?effective=all tới BE API"},
            {"actor": "BE API", "action": "Truy vấn CSDL", "desc": "Trả về danh sách danh mục thu đã đồng bộ kèm metadata CSDL Sở và trạng thái hiệu lực"},
            {"actor": "Web Portal", "action": "Hiển thị giao diện bảng", "desc": "Render bảng Master Table kèm pill trạng thái (Đang áp dụng / Ngừng áp dụng), căn cứ pháp lý và toolbar tìm kiếm"},
            {"actor": "Kế toán", "action": "Bấm 'Đồng bộ CSDL'", "desc": "Gửi trigger POST /api/1.0/revenue-categories/sync"},
            {"actor": "BE API & CSDL Sở", "action": "Đối soát & Cập nhật", "desc": "Kết nối API Central CSDL Sở, cập nhật các mã danh mục thu mới nhất, trả về HTTP 200"},
            {"actor": "Web Portal", "action": "Phát thông báo hoàn tất", "desc": "Toast thông báo 'Đồng bộ danh mục thu từ CSDL Sở thành công', tự động làm mới bảng dữ liệu"}
        ],
        "steps_narrative": [
            "Kế toán trường học đăng nhập hệ thống, điều hướng tới menu **Tài chính > Danh mục thu** (`/[schoolCode]/school/revenue-categories`).",
            "Hệ thống tải danh sách toàn bộ danh mục thu đang lưu trữ tại trường kèm mã danh mục chuẩn (e.g. HP001, KT0003, XD001, BH001), căn cứ pháp lý, trạng thái và thời gian hiệu lực.",
            "Kế toán kiểm tra và tra cứu nhanh theo tên/mã hoặc lọc danh mục theo trạng thái 'Đang áp dụng' / 'Ngừng áp dụng'.",
            "Định kỳ hoặc khi có văn bản hướng dẫn thu mới của Sở GD&ĐT, Kế toán bấm nút 'Đồng bộ CSDL' để cập nhật dữ liệu tự động.",
            "Hệ thống đối soát, cập nhật các mã danh mục thu mới hoặc đổi trạng thái các mã đã hết hiệu lực.",
            "Tại phân hệ **Khoản phí** (M4/SM3), trường 'Danh mục thu' tự động hiển thị các danh mục đang áp dụng để Kế toán liên kết khi tạo khoản phí mới.",
            "Tại phân hệ **Quản lý học phí** (M4/SM4) và **Học phí / Hóa đơn** (M4/SM1), hệ thống kế thừa mã danh mục thu để phục vụ xuất hóa đơn điện tử sInvoice và đối soát nguồn thu."
        ],
        "rules": [
            {"id": "BR-RC-01", "title": "Bảo toàn Danh mục CSDL Sở", "desc": "Nhà trường không được tự ý xóa hoặc tùy tiện đổi mã danh mục thu chính thức do Sở GD&ĐT ban hành. Mọi thay đổi về mã, tên chuẩn và căn cứ pháp lý phải thông qua luồng đồng bộ từ Cổng Vận hành / CSDL Sở."},
            {"id": "BR-RC-02", "title": "Đồng bộ một chạm (One-click Sync)", "desc": "Nút 'Đồng bộ CSDL' thực hiện đối soát và cập nhật toàn bộ danh mục thu mới nhất. Khi đang đồng bộ, nút hiển thị icon xoay (spinner) và chữ 'Đang đồng bộ...', khóa thao tác click trùng lặp."},
            {"id": "BR-RC-03", "title": "Phân loại Trạng thái Hiệu lực", "desc": "Hệ thống hỗ trợ 2 trạng thái rõ ràng: 'Đang áp dụng' (active=true, pill xanh lá) và 'Ngừng áp dụng' (active=false, pill xám). Chỉ các danh mục 'Đang áp dụng' mới xuất hiện trong dropdown chọn liên kết ở Khoản phí và Quản lý học phí."},
            {"id": "BR-RC-04", "title": "Liên kết bắt buộc với Khoản phí hệ thống", "desc": "2 khoản phí hệ thống bắt buộc (Học phí, Tiền ăn) được tự động map với mã danh mục thu quy chuẩn: Học phí -> HP001 (Học phí chính khóa), Tiền ăn -> KT0003 (Tiền ăn bán trú). Kế toán không thể gỡ bỏ mapping này."},
            {"id": "BR-RC-05", "title": "Liên thông Hóa đơn điện tử (sInvoice)", "desc": "Tất cả các khoản phí có gắn cờ 'Xuất HĐĐT' khi sinh hóa đơn học sinh sẽ sử dụng mã Danh mục thu tương ứng làm mã hàng hóa/dịch vụ trên cổng HĐĐT Viettel sInvoice / VNPT."},
            {"id": "BR-RC-06", "title": "Đơn vị tính chuẩn hóa", "desc": "Đơn vị tính của danh mục thu tuân thủ các đơn vị giáo dục chuẩn: Tháng, Năm, Học kỳ, Ngày, Khác, Lần."},
            {"id": "BR-RC-07", "title": "Tra cứu đa tiêu chí", "desc": "Ô tìm kiếm hỗ trợ lọc không phân biệt chữ hoa/thường, không phân biệt dấu tiếng Việt (diacritic-insensitive) theo Tên danh mục, Mã danh mục (e.g. XD001, KT0003), và Ghi chú."},
            {"id": "BR-RC-08", "title": "Hiển thị căn cứ pháp lý & Ghi chú", "desc": "Mỗi dòng danh mục hiển thị rõ ràng mã định danh (badge id_card), căn cứ pháp lý (legal reference - e.g. 'Luật Bảo hiểm y tế', 'Nghị định 81/2021/NĐ-CP') và ghi chú hướng dẫn thu chi thực tế."}
        ],
        "data_entities": [
            {"field": "id", "type": "BigInt (PK)", "required": True, "desc": "Khóa chính tự tăng của danh mục thu trong hệ thống"},
            {"field": "external_id", "type": "String", "required": True, "desc": "Mã định danh duy nhất từ hệ thống CSDL Sở / Portal Vận hành"},
            {"field": "code", "type": "String (Unique)", "required": True, "desc": "Mã số định danh danh mục thu (e.g. HP001, KT0003, XD001, BH001)"},
            {"field": "name", "type": "String", "required": True, "desc": "Tên chính thức của danh mục thu theo quyết định ban hành"},
            {"field": "unit", "type": "String", "required": True, "desc": "Đơn vị tính chuẩn (Tháng, Năm, Học kỳ, Ngày, Khác)"},
            {"field": "legal_reference", "type": "Text", "required": False, "desc": "Căn cứ pháp lý, văn bản chỉ đạo của Sở GD&ĐT hoặc UBND"},
            {"field": "note", "type": "Text", "required": False, "desc": "Ghi chú phạm vi áp dụng (e.g. Dành cho khối bán trú, theo tuyến xe)"},
            {"field": "effective_from", "type": "Date", "required": True, "desc": "Ngày bắt đầu có hiệu lực áp dụng"},
            {"field": "effective_to", "type": "Date", "required": False, "desc": "Ngày hết hiệu lực áp dụng (null = vô thời hạn)"},
            {"field": "active", "type": "Boolean", "required": True, "desc": "Trạng thái kích hoạt áp dụng tại trường: true = Đang áp dụng, false = Ngừng áp dụng"},
            {"field": "synced_at", "type": "DateTime", "required": True, "desc": "Thời điểm đồng bộ dữ liệu gần nhất từ CSDL Sở"}
        ]
    },

    # 3. Đặc tả tính năng & Use Cases chi tiết
    "features": {
        "breakdown": [
            {"epic": "E-004-FINANCE", "feature": "Quản lý Danh mục thu CSDL Sở", "platform": "Web Portal", "priority": "MUST HAVE", "story": "Kế toán tra cứu và đồng bộ danh mục thu từ CSDL Sở", "jira": "EDUS-FIN-0701"},
            {"epic": "E-004-FINANCE", "feature": "Bộ lọc trạng thái & Tra cứu", "platform": "Web Portal", "priority": "MUST HAVE", "story": "Kế toán tìm kiếm theo mã, tên, trạng thái áp dụng", "jira": "EDUS-FIN-0702"},
            {"epic": "E-004-FINANCE", "feature": "Liên kết Master Data Khoản phí", "platform": "Web Portal", "priority": "MUST HAVE", "story": "Kế toán chọn danh mục thu khi tạo khoản phí mới", "jira": "EDUS-FIN-0703"}
        ],
        "use_cases": [
            {
                "id": "UC-RC-01",
                "name": "Xem danh sách và tra cứu Danh mục thu",
                "actor": "Kế toán trường học, Ban Giám Hiệu",
                "pre": "Người dùng đã đăng nhập với vai trò Kế toán hoặc Admin, có quyền xem phân hệ Tài chính.",
                "happy_path": [
                    "1. Người dùng bấm chọn 'Tài chính' > 'Danh mục thu' trên menu điều hướng.",
                    "2. Hệ thống hiển thị bảng danh sách các danh mục thu phân trang 20 dòng/trang.",
                    "3. Mỗi dòng hiển thị đầy đủ: STT, Tên danh mục (kèm mã định danh và căn cứ pháp lý), Trạng thái áp dụng, Khoảng thời gian và Đơn vị tính.",
                    "4. Người dùng nhập từ khóa tìm kiếm (e.g. 'Ăn', 'KT0003', 'Xe') vào ô tìm kiếm.",
                    "5. Danh sách được lọc tức thời theo thời gian thực."
                ],
                "exceptions": ["Nếu không có kết quả phù hợp, hiển thị thông báo 'Chưa có danh mục thu phù hợp'."],
                "post": "Người dùng nắm rõ các danh mục thu hợp lệ đang áp dụng tại trường.",
                "rules": "BR-RC-01, BR-RC-07, BR-RC-08"
            },
            {
                "id": "UC-RC-02",
                "name": "Đồng bộ Danh mục thu từ CSDL Sở GD&ĐT",
                "actor": "Kế toán trường học, Admin",
                "pre": "Hệ thống có kết nối mạng tới CSDL ngành GD&ĐT / Central Portal.",
                "happy_path": [
                    "1. Tại trang Danh mục thu, người dùng nhấn nút 'Đồng bộ CSDL'.",
                    "2. Nút chuyển sang trạng thái loading với icon spinner xoay 'Đang đồng bộ...'.",
                    "3. Backend đối soát dữ liệu với CSDL Sở, cập nhật các danh mục mới và thời hạn hiệu lực.",
                    "4. Khi hoàn tất, hệ thống cập nhật bảng dữ liệu tại chỗ và phát thông báo Toast xanh 'Đồng bộ danh mục thu từ CSDL Sở GD&ĐT thành công!'.",
                    "5. Các sub-module Khoản phí và Quản lý học phí ngay lập tức nhận diện danh mục thu mới."
                ],
                "exceptions": ["Nếu lỗi kết nối API Sở, hiển thị thông báo Toast đỏ và giữ nguyên dữ liệu đã lưu trữ gần nhất."],
                "post": "Master data danh mục thu được cập nhật đồng nhất 100% với cơ quan quản lý.",
                "rules": "BR-RC-02, BR-RC-03"
            },
            {
                "id": "UC-RC-03",
                "name": "Lọc Danh mục thu theo Trạng thái áp dụng",
                "actor": "Kế toán trường học",
                "pre": "Người dùng đang ở trang Danh mục thu.",
                "happy_path": [
                    "1. Người dùng chọn dropdown 'Trạng thái' trên thanh công cụ.",
                    "2. Chọn 'Đang áp dụng' -> bảng chỉ hiển thị các danh mục đang có hiệu lực thu.",
                    "3. Chọn 'Ngừng áp dụng' -> bảng hiển thị các danh mục đã hết hiệu lực hoặc tạm dừng.",
                    "4. Chọn 'Tất cả trạng thái' -> hiển thị toàn bộ."
                ],
                "exceptions": ["Không có."],
                "post": "Bảng được phân loại theo đúng trạng thái mong muốn.",
                "rules": "BR-RC-03"
            }
        ]
    },

    # 4. Giao diện người dùng
    "ui": {
        "entry_point": "Điều hướng từ Sidebar: **TÀI CHÍNH > Danh mục thu** (`/[schoolCode]/school/revenue-categories/`).",
        "screens_table": [
            {
                "screen": "Danh sách Danh mục thu (Master Table)",
                "component": "RevenueCategoriesPage (table, toolbar, sync button, filter, pagination)",
                "format": "Desktop Web & Tablet Responsive",
                "desc": (
                    "Màn hình quản lý tập trung toàn bộ danh mục thu. Phía trên là Page Title 'Danh Mục Thu' "
                    "kèm icon coins, subtitle giải thích liên kết CSDL Sở, và nút 'Đồng bộ CSDL' màu xanh thương hiệu #0070CE. "
                    "Thanh Toolbar gồm ô tìm kiếm đa năng, dropdown lọc trạng thái (Đang áp dụng / Ngừng áp dụng), và tổng số lượng danh mục. "
                    "Bảng dữ liệu hiển thị 5 cột: STT, Tên danh mục (bold, gắn pill Mã định danh và căn cứ pháp lý), "
                    "Trạng thái (pill tròn xanh lá/xám), Khoảng thời gian (icon lịch), và Đơn vị tính. Chân bảng có phân trang chi tiết."
                ),
                "image": "02b_revenue_categories.png",
                "note": "BR-RC-01, BR-RC-02, BR-RC-07, BR-RC-08. Ảnh chụp thực tế từ hệ thống live."
            },
            {
                "screen": "Modal Chi tiết Danh mục thu",
                "component": "RevenueCategoryDetailModal",
                "format": "Modal pop-up hiển thị chi tiết căn cứ pháp lý, mã CSDL Sở và lịch sử đồng bộ",
                "desc": "Xem chi tiết văn bản hướng dẫn, ngày ban hành và danh sách các khoản phí đang liên kết với danh mục thu này.",
                "image": "02b_revenue_categories_detail_modal.png",
                "note": "Chỉ đọc (Read-only)"
            }
        ]
    },

    # 5. Tiêu chí nghiệm thu (AC)
    "acceptance_criteria": [
        {
            "id": "AC-RC-01",
            "title": "Hiển thị danh sách danh mục thu đầy đủ thông tin chuẩn",
            "scenario": "Given Kế toán truy cập route /[schoolCode]/school/revenue-categories\nWhen Trang hoàn tất tải dữ liệu\nThen Bảng hiển thị đầy đủ danh sách các danh mục thu kèm: Tên danh mục, Mã danh mục (e.g. HP001, KT0003), Căn cứ pháp lý, Ghi chú, Trạng thái pill và Đơn vị tính."
        },
        {
            "id": "AC-RC-02",
            "title": "Đồng bộ CSDL Sở thành công",
            "scenario": "Given Kế toán đang ở trang Danh mục thu\nWhen Nhấn nút 'Đồng bộ CSDL'\nThen Nút hiển thị spinner 'Đang đồng bộ...', gửi request đồng bộ và sau khi hoàn tất hiển thị Toast thông báo thành công, dữ liệu bảng được làm mới."
        },
        {
            "id": "AC-RC-03",
            "title": "Tìm kiếm danh mục theo từ khóa không dấu",
            "scenario": "Given Có 20+ danh mục thu trong hệ thống\nWhen Kế toán nhập 'xe' hoặc 'xd001' vào ô tìm kiếm\nThen Hệ thống lọc ra chính xác các bản ghi như 'Xe đưa đón học sinh' (XD001) và 'Xe đưa đón' (TX001)."
        },
        {
            "id": "AC-RC-04",
            "title": "Lọc danh mục theo trạng thái hiệu lực",
            "scenario": "Given Kế toán chọn filter Trạng thái = 'Đang áp dụng'\nWhen Bộ lọc được áp dụng\nThen Chỉ các danh mục có active=true xuất hiện trong danh sách, các danh mục 'Ngừng áp dụng' bị ẩn."
        },
        {
            "id": "AC-RC-05",
            "title": "Liên kết sang Khoản phí (school-fees)",
            "scenario": "Given Danh mục thu có mã KT0003 'Tiền ăn bán trú' đang áp dụng\nWhen Kế toán sang trang Khoản phí tạo khoản phí mới và mở dropdown 'Danh mục thu'\nThen Dropdown hiển thị tùy chọn '[KT0003] Tiền ăn bán trú (Khác)' để kế toán chọn liên kết."
        }
    ],

    # 6. Yêu cầu phi chức năng
    "nfr": {
        "performance": "Tải bảng danh mục thu < 300ms; Thời gian phản hồi API tra cứu < 200ms với dataset 500 danh mục.",
        "security": "Phân quyền RBAC nghiêm ngặt: chỉ tài khoản Admin và Kế toán trường học mới có quyền truy cập và đồng bộ CSDL Sở; Không cho phép sửa đổi trực tiếp khóa ngoại external_id đã liên kết với hóa đơn hoặc bảng kê học phí.",
        "ux": "Giao diện tuân thủ FINVIET ECO Design System: Pill trạng thái tròn màu xanh lá cho 'Đang áp dụng' và xám cho 'Ngừng áp dụng'; Mã định danh dạng badge dễ nhận biết."
    },

    # 7. Quy tắc phối hợp vận hành thực tế
    "operations_rules": [
        {
            "situation": "Sở GD&ĐT ban hành quyết định bổ sung danh mục thu mới trong năm học",
            "action": "Kế toán bấm 'Đồng bộ CSDL' tại trang Danh mục thu",
            "system": "Hệ thống nạp danh mục mới vào danh sách và sẵn sàng để chọn trong Khoản phí"
        },
        {
            "situation": "Một khoản thu tạm dừng thu theo chỉ đạo của cơ quan quản lý",
            "action": "Kế toán chuyển trạng thái hoặc hệ thống tự động đổi sang 'Ngừng áp dụng' qua đồng bộ",
            "system": "Khóa không cho tạo mới khoản phí liên kết với danh mục này, giữ nguyên lịch sử các khoản phí cũ"
        },
        {
            "situation": "Phát sinh lỗi kết nối cổng CSDL Sở GD&ĐT",
            "action": "Kế toán liên hệ quản trị viên FINVIET hỗ trợ kiểm tra đường truyền",
            "system": "Hệ thống hiển thị Toast cảnh báo và duy trì danh mục đã lưu trữ gần nhất"
        }
    ],

    # 8. Phụ lục: Danh mục thông báo, Xử lý ngoại lệ & Đề xuất chiến lược
    "appendix": {
        "notifications": [
            {
                "id": "NOTI-RC-01",
                "event": "Đồng bộ CSDL thành công",
                "recipient": "Kế toán trường học",
                "body": "Đồng bộ thành công danh mục thu từ CSDL Sở GD&ĐT.",
                "onclick": "Chuyển tới trang Danh mục thu"
            }
        ],
        "edge_cases": [
            {
                "case": "Mã danh mục thu bị trùng lặp từ CSDL Sở",
                "risk": "Xung đột khóa ngoại",
                "solution": "Hệ thống sử dụng external_id duy nhất làm khóa định danh, ghi log cảnh báo và giữ bản ghi mới nhất."
            }
        ],
        "strategic_recommendations": [
            {
                "title": "Tự động lên lịch đồng bộ định kỳ",
                "desc": "Thiết lập cron job tự động đồng bộ CSDL Sở vào 02:00 sáng hàng ngày để kế toán không cần bấm tay."
            }
        ]
    }
}

# -----------------------------------------------------------------------------
# 2. PRD UPDATE DATA FOR M4 - SM3 - Khoản phí
# -----------------------------------------------------------------------------
m4_sm3_prd_data = {
    "code": "M4/SM3",
    "name": "M4 - SM3 - Khoản phí",
    "priority": "MUST HAVE",
    "status": "APPROVED FOR BUILD",
    "owner": "hieu.vo1@finviet.com.vn",
    "reviewer": "hieu.vo1@finviet.com.vn",
    "created_date": "2026-10-28",
    "parent_module": "M4 - Tài chính",
    "parent_category": "8. Portal QLTH > M4 - Tài chính > M4 - SM3 - Khoản phí",
    "history": [
        {
            "version": "1.0",
            "section": "Khởi tạo tài liệu",
            "content": "Khởi tạo đặc tả phân hệ Khoản phí (School Fee Catalog) theo chuẩn ECO FINVIET Design System.",
            "date": "2026-10-26",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.1",
            "section": "Cập nhật Quy tắc BR & AC",
            "content": "Bổ sung quy tắc bảo vệ 3 khoản phí hệ thống, 8 đơn vị tính chuẩn và cờ Xuất HĐĐT inline.",
            "date": "2026-10-27",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.2",
            "section": "Liên kết Danh mục thu (CSDL Sở)",
            "content": "Bổ sung cột Danh mục thu, bộ lọc revenue_category_select trên thanh công cụ và picker Danh mục thu trong modal Thêm/Sửa khoản phí.",
            "date": "2026-10-28",
            "author": "hieu.vo1@finviet.com.vn"
        }
    ],

    # 1. Thông tin tổng quan
    "overview": {
        "context": (
            "Phân hệ <strong>Quản lý Danh Mục Khoản Phí Toàn Trường (School Fee Catalog Management)</strong> "
            "thuộc nhóm <strong>M4: Tài chính</strong> quản lý danh mục toàn bộ các khoản phí áp dụng cho học sinh bao gồm 3 khoản phí cố định hệ thống "
            "(Học phí, Tiền ăn, Phí trả trễ) và các khoản phí tùy chỉnh theo nhu cầu trường học (`/[schoolCode]/school/school-fees`). "
            "Phân hệ liên kết mật thiết với <strong>Danh mục thu CSDL Sở (M4/SM7)</strong> để chuẩn hóa mã số thuế, căn cứ pháp lý, "
            "cấu hình xuất Hóa đơn điện tử (Xuất HĐĐT) một chạm trực tiếp tại bảng, và làm cơ sở cho Quản lý học phí theo lớp (`tuition-management`)."
        ),
        "goals_list": [
            "Quản lý danh mục các khoản phí áp dụng toàn trường với mức giá mặc định và đơn vị tính chuẩn hóa.",
            "Bảo vệ toàn vẹn 3 khoản phí hệ thống cốt lõi: Học phí chính khóa, Tiền ăn bán trú, Phí trả học sinh trễ.",
            "Liên kết từng khoản phí với Danh mục thu chuẩn (M4/SM7) từ CSDL Sở GD&ĐT.",
            "Cấu hình xuất Hóa đơn điện tử (Xuất HĐĐT) trực tiếp trên từng dòng danh sách thông qua thao tác 1 chạm.",
            "Cung cấp bộ lọc đa năng: Tìm kiếm từ khóa, Lọc theo Danh mục thu, và Lọc theo cờ Xuất HĐĐT."
        ],
        "target_users": [
            {
                "group": "Kế toán trường học",
                "role": "Thiết lập và quản lý danh mục phí",
                "actions": "Tạo và thiết lập mức giá mặc định, đơn vị tính, liên kết Danh mục thu, và bật/tắt Xuất HĐĐT cho từng khoản phí."
            },
            {
                "group": "Ban Giám Hiệu",
                "role": "Phê duyệt biểu phí",
                "actions": "Phê duyệt danh mục phí áp dụng trong năm học theo đúng hướng dẫn của Sở GD&ĐT."
            }
        ],
        "glossary": [
            {"term": "Khoản phí hệ thống (System Fees)", "definition": "3 khoản phí bắt buộc không thể xóa: Học phí (HP001), Tiền ăn (KT0003), Phí trả học sinh trễ."},
            {"term": "Khoản phí tùy chỉnh (Custom Fees)", "definition": "Các khoản phí do nhà trường tự tạo theo chương trình riêng (e.g. Học STEAM, Kỹ năng sống, Xe đưa đón, Đồng phục)."},
            {"term": "Danh mục thu liên kết", "definition": "Mã danh mục thu từ CSDL Sở (M4/SM7) được gán cho khoản phí để đối soát hóa đơn điện tử."},
            {"term": "Xuất HĐĐT", "definition": "Cấu hình cho phép xuất hóa đơn điện tử tự động khi phụ huynh thanh toán khoản phí này."}
        ]
    },

    # 2. Nghiệp vụ & Kiến trúc dữ liệu
    "business": {
        "flow_desc": "Mô hình hóa quy trình thiết lập khoản phí, liên kết danh mục thu và đồng bộ sang phân hệ Quản lý học phí theo lớp.",
        "flow_steps": [
            {"actor": "Kế toán", "action": "Mở trang Khoản phí", "desc": "Gửi GET /api/1.0/school-fee-customs tới BE API"},
            {"actor": "BE API", "action": "Truy vấn danh mục phí", "desc": "Trả về danh sách khoản phí kèm revenue_category mapping và cờ Xuất HĐĐT"},
            {"actor": "Web Portal", "action": "Hiển thị bảng danh mục phí", "desc": "Render bảng với 6 cột: Tên khoản phí, Danh mục thu, Xuất HĐĐT, Số tiền, Đơn vị, Hành động"},
            {"actor": "Kế toán", "action": "Bấm 'Thêm khoản phí'", "desc": "Mở CreateFeeModal, chọn Danh mục thu liên kết và nhập số tiền mặc định"},
            {"actor": "Web Portal", "action": "Gửi dữ liệu tạo mới", "desc": "POST /api/1.0/school-fee-customs với revenue_category_id"},
            {"actor": "BE API", "action": "Tạo thành công", "desc": "Trả về HTTP 201, khoản phí mới sẵn sàng để gán cho các lớp học"}
        ],
        "steps_narrative": [
            "Kế toán truy cập **Tài chính > Khoản phí** (`/[schoolCode]/school/school-fees`).",
            "Bảng hiển thị danh mục phí với 6 cột chuẩn: Tên khoản phí, Danh mục thu, Xuất HĐĐT, Số tiền (Đ), Đơn vị, Hành động.",
            "Kế toán lọc danh sách theo từ khóa, Xuất HĐĐT (Có/Không), hoặc lọc theo Danh mục thu.",
            "Kế toán có thể bật/tắt trực tiếp cờ 'Xuất HĐĐT' ngay tại cột mà không cần mở modal sửa.",
            "Bấm 'Thêm khoản phí' để tạo khoản phí tùy chỉnh: nhập Tên, chọn Danh mục thu liên kết, Số tiền mặc định, Đơn vị tính (8 đơn vị), và cờ Xuất HĐĐT.",
            "Khi lưu, khoản phí mới sẵn sàng để gán cho các lớp học tại Quản lý học phí (tuition-management)."
        ],
        "rules": [
            {"id": "BR-KP-01", "title": "Bảo vệ 3 khoản phí hệ thống", "desc": "Học phí, Tiền ăn, Phí trả trễ là cố định, không được phép xóa."},
            {"id": "BR-KP-02", "title": "Liên kết Danh mục thu bắt buộc/tùy chọn", "desc": "Khoản phí hệ thống tự động gán mã Danh mục thu tương ứng (Học phí -> HP001, Tiền ăn -> KT0003). Khoản phí tùy chỉnh có thể chọn danh mục thu phù hợp từ danh sách active của M4/SM7."},
            {"id": "BR-KP-03", "title": "Cấu hình Xuất HĐĐT Inline", "desc": "Kế toán có thể thay đổi trạng thái Xuất HĐĐT (Có / Không) trực tiếp trên từng dòng danh sách thông qua popover xác nhận nhanh."},
            {"id": "BR-KP-04", "title": "Chuẩn hóa 8 đơn vị tính", "desc": "Chỉ cho phép 8 đơn vị tính giáo dục chuẩn: Ngày, Tháng, Năm, Lần, Chuyến, Bộ, Giờ, Khác."},
            {"id": "BR-KP-05", "title": "Bộ lọc đa năng", "desc": "Thanh công cụ hỗ trợ lọc đồng thời theo: Tìm kiếm từ khóa, Lọc theo Danh mục thu (revenue_category_select), và Lọc theo Xuất HĐĐT (Có/Không/Tất cả)."},
            {"id": "BR-KP-06", "title": "Đếm chính xác khoản phí tùy chỉnh", "desc": "Chân trang thống kê hiển thị số lượng khoản phí tùy chỉnh đã tạo, phân tách rõ ràng với các khoản phí mặc định của hệ thống."}
        ],
        "data_entities": [
            {"field": "id", "type": "String / Integer (PK)", "required": True, "desc": "Mã khoản phí duy nhất"},
            {"field": "name", "type": "String", "required": True, "desc": "Tên hiển thị của khoản phí"},
            {"field": "type", "type": "Enum", "required": True, "desc": "system (hệ thống) hoặc custom (tùy chỉnh trường tạo)"},
            {"field": "revenue_category_id", "type": "BigInt (FK)", "required": False, "desc": "Khóa ngoại liên kết tới Danh mục thu (Revenue Category)"},
            {"field": "is_electronic", "type": "Boolean", "required": True, "desc": "Cờ xuất Hóa đơn điện tử (Có / Không)"},
            {"field": "price", "type": "Decimal", "required": True, "desc": "Mức phí mặc định (VNĐ)"},
            {"field": "unit", "type": "Enum", "required": True, "desc": "Đơn vị tính: day, month, year, time, v.v."},
            {"field": "classes", "type": "Array", "required": False, "desc": "Danh sách các lớp học đang được áp dụng khoản phí này"}
        ]
    },

    # 3. Đặc tả tính năng & Use Cases chi tiết
    "features": {
        "breakdown": [
            {"epic": "E-004-FINANCE", "feature": "Quản lý Danh mục Khoản phí", "platform": "Web Portal", "priority": "MUST HAVE", "story": "Kế toán thiết lập danh mục khoản phí toàn trường", "jira": "EDUS-FIN-0301"},
            {"epic": "E-004-FINANCE", "feature": "Liên kết Danh mục thu CSDL Sở", "platform": "Web Portal", "priority": "MUST HAVE", "story": "Kế toán gán mã danh mục thu cho từng khoản phí", "jira": "EDUS-FIN-0302"},
            {"epic": "E-004-FINANCE", "feature": "Cấu hình Xuất HĐĐT Inline", "platform": "Web Portal", "priority": "MUST HAVE", "story": "Kế toán bật tắt xuất hóa đơn điện tử 1 chạm", "jira": "EDUS-FIN-0303"}
        ],
        "use_cases": [
            {
                "id": "UC-KP-01",
                "name": "Tạo khoản phí mới liên kết Danh mục thu",
                "actor": "Kế toán trường học",
                "pre": "Đã có Danh mục thu hiệu lực trong hệ thống.",
                "happy_path": [
                    "1. Kế toán nhấn 'Thêm khoản phí' trên thanh công cụ.",
                    "2. Modal mở ra, kế toán nhập Tên khoản phí (e.g. 'Thuận xe đưa đón').",
                    "3. Chọn dropdown 'Danh mục thu' liên kết (e.g. '[XD001] Xe đưa đón học sinh').",
                    "4. Nhập mức phí mặc định và chọn Đơn vị tính (e.g. 'ngày').",
                    "5. Bật/tắt cờ Xuất HĐĐT theo nhu cầu.",
                    "6. Nhấn 'Xác nhận' để lưu khoản phí."
                ],
                "exceptions": ["Nếu bỏ trống tên hoặc mức phí không hợp lệ, hệ thống báo lỗi viền đỏ."],
                "post": "Khoản phí mới hiển thị trên bảng và có thể gán cho lớp học.",
                "rules": "BR-KP-01, BR-KP-02, BR-KP-04"
            },
            {
                "id": "UC-KP-02",
                "name": "Lọc danh sách khoản phí theo Danh mục thu",
                "actor": "Kế toán trường học",
                "pre": "Đang ở trang Danh mục khoản phí.",
                "happy_path": [
                    "1. Kế toán nhấp vào dropdown 'Danh mục thu' trên thanh công cụ.",
                    "2. Chọn danh mục cụ thể (e.g. 'Tiền ăn bán trú').",
                    "3. Bảng chỉ hiển thị các khoản phí được liên kết với danh mục thu đó (e.g. Ăn trưa bán trú, Tiền ăn sáng bán trú 10A1)."
                ],
                "exceptions": ["Không có."],
                "post": "Bảng được lọc chính xác theo danh mục thu.",
                "rules": "BR-KP-05"
            },
            {
                "id": "UC-KP-03",
                "name": "Cập nhật nhanh cờ Xuất HĐĐT Inline",
                "actor": "Kế toán trường học",
                "pre": "Đang ở bảng danh mục khoản phí.",
                "happy_path": [
                    "1. Kế toán click vào trạng thái 'Xuất HĐĐT' (Có / Không) trên một dòng khoản phí.",
                    "2. Popover xác nhận hiển thị: 'Bạn có chắc muốn đổi trạng thái xuất HĐĐT?'.",
                    "3. Kế toán bấm 'Xác nhận'.",
                    "4. Hệ thống cập nhật trạng thái ngay lập tức mà không cần mở modal chỉnh sửa."
                ],
                "exceptions": ["Không có."],
                "post": "Trạng thái xuất hóa đơn điện tử của khoản phí được cập nhật.",
                "rules": "BR-KP-03"
            }
        ]
    },

    # 4. Giao diện người dùng
    "ui": {
        "entry_point": "Điều hướng từ Sidebar: **TÀI CHÍNH > Khoản phí** (`/[schoolCode]/school/school-fees`).",
        "screens_table": [
            {
                "screen": "Bảng Danh mục Khoản phí (`FeeCatalogTable`)",
                "component": "FeeCatalogTable (table, toolbar, filters, inline switch)",
                "format": "Desktop Web & Tablet Responsive",
                "desc": (
                    "Bảng danh mục phí gồm 6 cột: Tên khoản phí, Danh mục thu (hiển thị tên và badge mã CSDL Sở), "
                    "Xuất HĐĐT (pill Có/Không bấm đổi inline), Số tiền (Đ) định dạng phân tách hàng nghìn, Đơn vị tính, và Hành động. "
                    "Thanh công cụ tích hợp dropdown 'Danh mục thu' và dropdown 'Xuất HĐĐT'."
                ),
                "image": "02_school_fees.png",
                "note": "BR-KP-01, BR-KP-02, BR-KP-05. Ảnh chụp thực tế từ hệ thống live."
            },
            {
                "screen": "Modal Thêm Khoản phí (`CreateFeeModal`)",
                "component": "CreateFeeModal",
                "format": "Modal pop-up form với các trường thông tin chuẩn",
                "desc": "Form tạo khoản phí tùy chỉnh mới: Tên khoản phí, Dropdown chọn Danh mục thu liên kết (CSDL Sở / Quy định), Số tiền mặc định, Đơn vị tính (8 đơn vị), và cờ Xuất HĐĐT.",
                "image": "02_modal_add_school_fee.png",
                "note": "BR-KP-02, BR-KP-04"
            },
            {
                "screen": "Modal Chỉnh sửa Khoản phí (`EditFeeModal`)",
                "component": "EditFeeModal",
                "format": "Modal pop-up form chỉnh sửa khoản phí đã tồn tại",
                "desc": "Cho phép thay đổi tên, danh mục thu liên kết, giá mặc định và cờ HĐĐT. Đối với 3 khoản phí hệ thống, trường tên và mapping danh mục thu bị khóa không cho sửa.",
                "image": "02_modal_edit_school_fee.png",
                "note": "BR-KP-01"
            }
        ]
    },

    # 5. Tiêu chí nghiệm thu (AC)
    "acceptance_criteria": [
        {
            "id": "AC-KP-01",
            "title": "Hiển thị cột Danh mục thu trên bảng Khoản phí",
            "scenario": "Given Kế toán truy cập route /[schoolCode]/school/school-fees\nWhen Bảng dữ liệu hoàn tất tải\nThen Cột 'Danh mục thu' hiển thị tên danh mục kèm badge mã định danh (e.g. '[KT0003] Tiền ăn bán trú') cho từng khoản phí liên kết."
        },
        {
            "id": "AC-KP-02",
            "title": "Lọc khoản phí theo Danh mục thu",
            "scenario": "Given Kế toán chọn filter Danh mục thu = 'Tiền ăn bán trú'\nWhen Bộ lọc áp dụng\nThen Bảng chỉ hiển thị các khoản phí được liên kết với mã KT0003."
        },
        {
            "id": "AC-KP-03",
            "title": "Tạo khoản phí mới với Danh mục thu liên kết",
            "scenario": "Given Kế toán mở modal 'Thêm khoản phí'\nWhen Nhập tên 'Học bơi năng khiếu', chọn Danh mục thu 'Các khoản thu thỏa thuận khác', số tiền 500,000đ và bấm Xác nhận\nThen Khoản phí mới được thêm vào bảng kèm đúng thông tin danh mục thu đã chọn."
        },
        {
            "id": "AC-KP-04",
            "title": "Khóa xóa và đổi tên đối với 3 khoản phí hệ thống",
            "scenario": "Given Khoản phí 'Học phí' và 'Tiền ăn' trên bảng\nWhen Kế toán kiểm tra cột Hành động\nThen Nút xóa (icon thùng rác) hoàn toàn bị vô hiệu hóa hoặc ẩn đi, không thể xóa khoản phí hệ thống."
        }
    ],

    # 6. Yêu cầu phi chức năng
    "nfr": {
        "performance": "Tải bảng khoản phí < 250ms với 100+ khoản phí.",
        "security": "Chỉ Kế toán trường học và Admin mới có quyền tạo hoặc chỉnh sửa danh mục khoản phí.",
        "ux": "Chuyển trạng thái xuất HĐĐT tức thời (Optimistic UI) kèm toast thông báo thành công."
    },

    # 7. Quy tắc phối hợp vận hành thực tế
    "operations_rules": [
        {
            "situation": "Kế toán muốn đổi mức giá của một khoản phí cho riêng 1 lớp học",
            "action": "Không sửa ở Khoản phí (School Fees) mà vào Quản lý học phí (Tuition Management) để tùy biến mức giá cho riêng lớp đó",
            "system": "Khoản phí chỉ lưu mức giá mặc định toàn trường; Quản lý học phí cho phép ghi đè mức giá theo từng lớp"
        },
        {
            "situation": "Xóa một khoản phí tùy chỉnh đã từng phát hành hóa đơn",
            "action": "Hệ thống khuyến nghị chuyển sang trạng thái ẩn thay vì xóa cứng",
            "system": "Không cho phép xóa khoản phí đã có dữ liệu hóa đơn liên kết để bảo toàn tính toàn vẹn báo cáo"
        }
    ],

    # 8. Phụ lục: Danh mục thông báo, Xử lý ngoại lệ & Đề xuất chiến lược
    "appendix": {
        "notifications": [
            {
                "id": "NOTI-KP-01",
                "event": "Cập nhật danh mục phí",
                "recipient": "Kế toán trường học",
                "body": "Đã cập nhật cấu hình khoản phí thành công.",
                "onclick": "Ở lại trang Khoản phí"
            }
        ],
        "edge_cases": [
            {
                "case": "Khoản phí chưa liên kết Danh mục thu khi xuất hóa đơn",
                "risk": "Hóa đơn điện tử thiếu mã dịch vụ sInvoice",
                "solution": "Hệ thống cảnh báo Kế toán chọn Danh mục thu trước khi phát hành hóa đơn."
            }
        ],
        "strategic_recommendations": [
            {
                "title": "Gợi ý tự động Danh mục thu bằng AI",
                "desc": "Tự động phân tích tên khoản phí kế toán nhập để gợi ý Danh mục thu tương ứng từ CSDL Sở."
            }
        ]
    }
}

def publish_prd(page_id, prd_data, attachments=None):
    title = prd_data["name"]
    print(f"\n=================================================================")
    print(f"Publishing PRD: {prd_data['code']} -> '{title}' (PageID: {page_id})")
    print(f"=================================================================")
    
    # 1. Upload Attachments
    if attachments:
        for att in attachments:
            att_path = os.path.join(SCREENSHOTS_DIR, att)
            if os.path.exists(att_path):
                print(f"Uploading attachment: {att}...")
                try:
                    res_att = client.upload_attachment(page_id, att_path, att)
                    print(f" -> OK: {res_att.get('results', [{}])[0].get('title', att)}")
                except Exception as e:
                    print(f" -> Warning uploading {att}: {e}")
            else:
                print(f" -> File not found: {att_path}")
                
    # 2. Render Storage Format XHTML
    print("Rendering Storage Format XHTML...")
    html_storage = render_prd_storage_format(prd_data)
    print(f"Storage XHTML Length: {len(html_storage)} bytes")
    
    # 3. Fetch current version
    print(f"Fetching current version for Page {page_id}...")
    existing = client.get_page(page_id)
    curr_ver = existing.get("version", {}).get("number", 1)
    print(f"Current version: v{curr_ver}")
    
    # 4. Update Confluence page
    print(f"Updating Confluence page {page_id} to v{curr_ver + 1}...")
    res = client.update_page(page_id, title, M4_PARENT_ID, html_storage, curr_ver)
    
    print(f"SUCCESS: Page '{title}' updated to v{res.get('version', {}).get('number')}!")
    print(f"URL: {res.get('_links', {}).get('webui', '')}")
    return res

def upload_extra_screenshots():
    extra_uploads = [
        (107850415, "06_fee_students.png"),          # M4/SM1 - Học phí
        (107850401, "10_reconciliation.png"),        # M4/SM2 - Đối soát
        (107850400, "05_tuition_management.png"),    # M4/SM4 - Quản lý học phí
        (107850402, "11_report_fee_overview.png"),   # M4/SM6 - Báo cáo Học phí
    ]
    print("\n=================================================================")
    print("Uploading Fresh Live Screenshots to Other M4 Finance Sub-modules")
    print("=================================================================")
    for p_id, filename in extra_uploads:
        p_path = os.path.join(SCREENSHOTS_DIR, filename)
        if os.path.exists(p_path):
            print(f"Uploading {filename} to Page {p_id}...")
            try:
                res = client.upload_attachment(p_id, p_path, filename)
                print(f" -> OK: {filename}")
            except Exception as e:
                print(f" -> Warning {filename}: {e}")

if __name__ == '__main__':
    # 1. Publish M4 - SM7 - Danh mục thu
    publish_prd(
        M4_SM7_PAGE_ID, 
        m4_sm7_prd_data, 
        attachments=["02b_revenue_categories.png", "02b_revenue_categories_detail_modal.png"]
    )
    
    # 2. Publish M4 - SM3 - Khoản phí
    publish_prd(
        M4_SM3_PAGE_ID, 
        m4_sm3_prd_data, 
        attachments=["02_school_fees.png", "02_modal_add_school_fee.png", "02_modal_edit_school_fee.png"]
    )
    
    # 3. Extra screenshots
    upload_extra_screenshots()
    print("\nALL FINANCE PRDS PUBLISHED SUCCESSFULLY!")
