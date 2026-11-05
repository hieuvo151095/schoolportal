# -*- coding: utf-8 -*-
"""
Full execution script for Giai đoạn 1:
Update all 18 impacted PRD pages of '8. Portal QLTH' on Confluence (Space: EDUS)
based on the user-confirmed questionnaire answers (Phần A: Q1 - Q9).
"""

import sys
import os
import json
import time
import copy

sys.path.insert(0, os.path.abspath("."))

from tools.confluence.confluence_client import ConfluenceClient
from tools.confluence.prd_template import render_prd_storage_format
import tools.confluence.m1_submodules_part1 as m1_p1
import tools.confluence.m1_submodules_part2 as m1_p2
import tools.confluence.m1_submodules_part3 as m1_p3
import tools.confluence.m2_submodules_part1 as m2_p1
import tools.confluence.m2_submodules_part2 as m2_p2
import tools.confluence.m3_submodules_part1 as m3_p1
import tools.confluence.m3_submodules_part2 as m3_p2

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

# Collect all current PRDs in a lookup by code
ALL_PRDS = {}
for prd in m1_p1.PART1_PRDS:
    ALL_PRDS[prd["code"]] = copy.deepcopy(prd)
for prd in m1_p2.PART2_PRDS:
    ALL_PRDS[prd["code"]] = copy.deepcopy(prd)
for prd in m1_p3.PART3_PRDS:
    ALL_PRDS[prd["code"]] = copy.deepcopy(prd)
for prd in m2_p1.PART1_PRDS:
    ALL_PRDS[prd["code"]] = copy.deepcopy(prd)
for prd in m2_p2.PART2_PRDS:
    ALL_PRDS[prd["code"]] = copy.deepcopy(prd)
for prd in m3_p1.PART1_PRDS:
    ALL_PRDS[prd["code"]] = copy.deepcopy(prd)
for prd in m3_p2.PART2_PRDS:
    ALL_PRDS[prd["code"]] = copy.deepcopy(prd)

print(f"Total base PRDs loaded: {len(ALL_PRDS)}")

# -----------------------------------------------------------------------------
# 1. M7/SM1: M7 - SM1 - Khác (Completely rewritten to User Avatar Dropdown & System Announcement)
# -----------------------------------------------------------------------------
p_m7_sm1 = {
    "code": "M7/SM1",
    "name": "M7 - SM1 - Khác",
    "parent_module": "M7",
    "parent_category": "8. Portal QLTH > M7 - Khác",
    "priority": "HIGH",
    "status": "APPROVED",
    "owner": "hieu.vo1@finviet.com.vn",
    "created_date": "2026-10-28",
    "reviewer": "hieu.vo1@finviet.com.vn",
    "overview": {
        "context": "Phân hệ <strong>Tiện Ích Người Dùng Cá Nhân &amp; Thông Báo Hệ Thống (User Profile, Notifications, Multi-language &amp; System Announcements)</strong> thuộc nhóm <strong>M7: Khác</strong> bao gồm toàn bộ nhóm chức năng quản trị tài khoản cá nhân được truy cập trực tiếp qua <strong>Menu Dropdown Avatar</strong> ở góc trên bên phải mọi màn hình trong Portal QLTH. Menu bao gồm 5 mục cốt lõi: <strong>Tài khoản</strong> (xem thông tin hồ sơ tại <code>/user/profile/</code>, chỉnh sửa thông tin tại <code>/user/edit-profile/</code> và đổi mật khẩu tại <code>/user/change-password/</code>), <strong>Thông báo cá nhân</strong> (quản lý tin thông báo 4 tab tại <code>/user/notification/</code>), <strong>Thông báo hệ thống</strong> (kênh tiếp nhận thông báo vận hành, bảo trì và chính sách từ nhà cung cấp Finviet/SOHA tại <code>/system/announcement/</code>), <strong>Ngôn ngữ</strong> (chuyển đổi tức thì giữa Tiếng Việt và English dạng trượt trái) và <strong>Đăng xuất</strong> an toàn có modal xác nhận. Phân hệ đóng vai trò trung tâm đảm bảo trải nghiệm cá nhân hóa, bảo mật tài khoản người dùng và duy trì kênh truyền thông liên tục giữa đơn vị cung cấp giải pháp và nhà trường.",
        "goals_list": [
            "Cung cấp menu Avatar cá nhân 5 mục (Tài khoản, Thông báo, Thông báo hệ thống, Ngôn ngữ, Đăng xuất) nhất quán trên góc trên bên phải của toàn bộ hệ thống.",
            "Quản lý hồ sơ cá nhân và đổi mật khẩu an toàn: Xem thông tin lý lịch, bằng cấp, cập nhật ảnh đại diện và đổi mật khẩu có kiểm tra độ phức tạp.",
            "Trung tâm thông báo cá nhân 4 tab (Hoạt Động, Trao Đổi, Học Phí, Khác): Hiển thị badge số tin chưa đọc, hỗ trợ đánh dấu đã đọc khi xem và thao tác hàng loạt.",
            "Kênh tiếp nhận Thông báo hệ thống từ Finviet/SOHA (/system/announcement/): Cho phép nhà trường cập nhật các thông báo bảo trì, nâng cấp phiên bản và chính sách mới từ đơn vị phát triển.",
            "Hỗ trợ đa ngôn ngữ (Tiếng Việt / English): Chuyển đổi giao diện chrome tức thì mà không cần reload trang và lưu trữ theo thiết lập tài khoản."
        ],
        "target_users": [
            {"group": "Người dùng đăng nhập (Admin, GV, NV)", "role": "Quản lý thông tin cá nhân & Tiếp nhận thông báo", "actions": "Xem/sửa hồ sơ, đổi mật khẩu, xem thông báo cá nhân, đọc thông báo nâng cấp từ Finviet, chuyển ngôn ngữ và đăng xuất."},
            {"group": "Super Admin Finviet / SOHA", "role": "Đơn vị phát hành thông báo hệ thống", "actions": "Gửi các thông báo nâng cấp phiên bản, bảo trì máy chủ và văn bản chỉ đạo tới toàn bộ các trường từ Managing Portal M8."}
        ],
        "glossary": [
            {"term": "Menu Dropdown Avatar", "definition": "Menu điều hướng cá nhân xuất hiện khi bấm vào avatar người dùng ở góc trên bên phải giao diện."},
            {"term": "Thông báo hệ thống (System Announcements)", "definition": "Kênh thông báo 1 chiều từ nhà cung cấp giải pháp Finviet/SOHA tới nhà trường về lịch bảo trì, tính năng mới hoặc chính sách vận hành."},
            {"term": "UI Chrome", "definition": "Toàn bộ các thành phần khung giao diện của ứng dụng bao gồm thanh tiêu đề, menu điều hướng trái, nhãn nút và bảng điều khiển."}
        ]
    },
    "business": {
        "flow_desc": "Người dùng mở Menu Avatar để thực hiện các nghiệp vụ cá nhân: cập nhật hồ sơ, đổi mật khẩu, xem thông báo 4 tab, đọc thông báo hệ thống từ Finviet, đổi ngôn ngữ hoặc đăng xuất an toàn.",
        "flow_steps": [
            {"actor": "Người dùng", "action": "Nhấn avatar góc trên phải", "desc": "Hệ thống mở Menu Dropdown gồm 5 mục: Tài khoản, Thông báo, Thông báo hệ thống, Ngôn ngữ, Đăng xuất."},
            {"actor": "Người dùng", "action": "Chọn mục cần tác nghiệp", "desc": "Xem hồ sơ (/user/profile/), Thông báo (/user/notification/), Thông báo hệ thống (/system/announcement/), hoặc Đổi ngôn ngữ."},
            {"actor": "Hệ thống", "action": "Xử lý nghiệp vụ & Hiển thị", "desc": "Điều hướng trang, tải danh sách thông báo hoặc dịch tức thì giao diện chrome sang Tiếng Anh/Tiếng Việt."},
            {"actor": "Người dùng", "action": "Chọn Đăng xuất", "desc": "Hệ thống hiển thị modal xác nhận; nếu bấm Xác nhận thì hủy session và điều hướng về trang Đăng nhập."}
        ],
        "steps_narrative": [
            "Giai đoạn 1: Người dùng nhấn vào Avatar ở góc trên bên phải màn hình. Menu Dropdown mở ra hiển thị 5 mục: 1. Tài khoản, 2. Thông báo (kèm badge chưa đọc), 3. Thông báo hệ thống (kèm badge chưa đọc), 4. Ngôn ngữ, 5. Đăng xuất.",
            "Giai đoạn 2: Quản lý thông tin tài khoản: Bấm 'Tài khoản' dẫn tới /user/profile/ xem thông tin chi tiết. Bấm icon bút chì dẫn sang /user/edit-profile/ để đổi ảnh đại diện và thông tin liên hệ. Bấm 'Đổi mật khẩu' dẫn sang /user/change-password/.",
            "Giai đoạn 3: Xem thông báo cá nhân: Bấm 'Thông báo' dẫn tới /user/notification/ gồm 4 tab (Hoạt Động, Trao Đổi, Học Phí, Khác). Bấm vào từng tin để đánh dấu đã đọc hoặc bấm icon tác vụ hàng loạt.",
            "Giai đoạn 4: Tiếp nhận thông báo hệ thống: Bấm 'Thông báo hệ thống' dẫn tới /system/announcement/ xem các thông báo vận hành, nâng cấp và thông tư hướng dẫn từ Finviet/SOHA.",
            "Giai đoạn 5: Đổi ngôn ngữ & Đăng xuất: Bấm 'Ngôn ngữ' mở menu con trượt sang trái chọn Tiếng Việt/English; Bấm 'Đăng xuất' mở modal xác nhận an toàn."
        ],
        "rules": [
            {"id": "BR-KHAC-01", "title": "Phạm vi truy cập qua Menu Avatar", "desc": "Nhóm chức năng M7/SM1 không nằm trên sidebar điều hướng chính mà truy cập độc quyền qua Menu Avatar ở góc trên bên phải mọi trang."},
            {"id": "BR-KHAC-02", "title": "Cấu trúc 5 mục Menu Dropdown Avatar", "desc": "Menu Avatar gồm đúng 5 mục theo thứ tự: 1. Tài khoản, 2. Thông báo (kèm badge số chưa đọc), 3. Thông báo hệ thống (kèm badge số chưa đọc từ Finviet), 4. Ngôn ngữ, 5. Đăng xuất (ngăn cách bởi đường kẻ ngang)."},
            {"id": "BR-KHAC-03", "title": "Submenu Đổi ngôn ngữ trượt trái (Slideout Left)", "desc": "Mục Ngôn ngữ có icon mũi tên '‹'; khi nhấp chuột, menu con gồm English và Tiếng Việt trượt ra ở bên trái mục Ngôn ngữ. Thay đổi ngôn ngữ áp dụng ngay cho UI chrome mà không reload trang và được lưu vào hồ sơ tài khoản."},
            {"id": "BR-KHAC-04", "title": "Trang Tài khoản và Sửa thông tin cá nhân", "desc": "Trang /user/profile/ là view-only. Bấm icon bút chì chuyển sang /user/edit-profile/ cho phép cập nhật ảnh đại diện, số điện thoại, địa chỉ và thông tin bổ sung."},
            {"id": "BR-KHAC-05", "title": "Quy tắc Đổi mật khẩu an toàn", "desc": "Trang /user/change-password/ bắt buộc nhập Mật khẩu hiện tại, Mật khẩu mới (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt) và Xác nhận mật khẩu mới."},
            {"id": "BR-KHAC-06", "title": "Khắc phục triệt để lỗi banner chưa lưu của Legacy", "desc": "Sửa lỗi kỹ thuật của bản cũ: Tuyệt đối không hiển thị banner 'Thay đổi của bạn chưa được lưu...' khi vừa tải trang. Chỉ hiển thị cảnh báo khi form đã bị thay đổi (isDirty = true) và người dùng có hành động điều hướng rời trang."},
            {"id": "BR-KHAC-07", "title": "Thông báo cá nhân 4 tab chuyên biệt", "desc": "Trang /user/notification/ gồm 4 tab độc lập: Hoạt Động, Trao Đổi, Học Phí, Khác. Mỗi tab có badge số tin chưa đọc. Bấm vào tin tự động đánh dấu đã đọc. Hỗ trợ nút 'Đánh dấu tất cả đã đọc' và 'Xóa thông báo'."},
            {"id": "BR-KHAC-08", "title": "Kênh Thông báo hệ thống từ Finviet (/system/announcement/)", "desc": "Hiển thị danh sách thông báo điều hành nền tảng phát hành từ Super Admin Finviet (Managing Portal M8). Bảng hiển thị Tiêu đề, Nội dung tóm tắt, Ngày gửi, Trạng thái (Đã đọc/Chưa đọc) kèm xem chi tiết nội dung văn bản."},
            {"id": "BR-KHAC-09", "title": "Modal Xác nhận đăng xuất an toàn", "desc": "Nhấp 'Đăng xuất' luôn mở modal xác nhận 'Vui lòng xác nhận đăng xuất khỏi hệ thống!'. Nhấn 'Xác nhận' sẽ thu hồi token JWT, xóa cookie session và điều hướng về trang đăng nhập."}
        ],
        "data_entities": [
            {"field": "user_id", "type": "UUID", "required": "Bắt buộc", "desc": "Định danh tài khoản người dùng hiện tại."},
            {"field": "full_name", "type": "String (100)", "required": "Bắt buộc", "desc": "Họ và tên người dùng."},
            {"field": "avatar_url", "type": "String (URI)", "required": "Tùy chọn", "desc": "Đường dẫn ảnh đại diện người dùng."},
            {"field": "preferred_language", "type": "Enum ('vi', 'en')", "required": "Mặc định 'vi'", "desc": "Ngôn ngữ giao diện người dùng lựa chọn."},
            {"field": "unread_notifications_count", "type": "Integer", "required": "Mặc định 0", "desc": "Tổng số lượng thông báo cá nhân chưa đọc."},
            {"field": "unread_system_announcements_count", "type": "Integer", "required": "Mặc định 0", "desc": "Số lượng thông báo hệ thống từ Finviet chưa đọc."}
        ]
    },
    "features": {
        "breakdown": [
            {"epic": "E-024 Khác & Tiện ích người dùng", "feature": "Menu Avatar Dropdown & Đa ngôn ngữ", "platform": "Web Portal", "priority": "P1", "story": "Là người dùng, tôi muốn bấm avatar để truy cập nhanh hồ sơ, đổi mật khẩu và đổi ngôn ngữ.", "jira": "KHC-001"},
            {"epic": "E-024 Khác & Tiện ích người dùng", "feature": "Trung tâm thông báo cá nhân 4 tab", "platform": "Web Portal", "priority": "P1", "story": "Là người dùng, tôi muốn xem các thông báo liên quan đến hoạt động, học phí, trao đổi và đánh dấu đã đọc.", "jira": "KHC-002"},
            {"epic": "E-024 Khác & Tiện ích người dùng", "feature": "Kênh Thông báo hệ thống từ Finviet", "platform": "Web Portal", "priority": "P1", "story": "Là Admin trường, tôi muốn xem các thông báo bảo trì và nâng cấp tính năng từ Finviet.", "jira": "KHC-003"}
        ],
        "use_cases": [
            {
                "id": "UC-KHC-01",
                "name": "Mở Menu Avatar và đổi ngôn ngữ sang Tiếng Anh",
                "desc": "Người dùng chuyển đổi ngôn ngữ giao diện từ Tiếng Việt sang English.",
                "actor": "Người dùng đăng nhập",
                "trigger": "Bấm vào ảnh đại diện ở góc trên bên phải.",
                "pre": "Đã đăng nhập vào hệ thống.",
                "happy_path": [
                    "1. Người dùng bấm Avatar góc trên phải -> Menu mở ra 5 mục.",
                    "2. Di chuột hoặc bấm mục 'Ngôn ngữ' -> Submenu trượt sang trái hiển thị Tiếng Việt và English.",
                    "3. Chọn 'English' -> Hệ thống lưu tùy chọn và chuyển đổi toàn bộ nhãn giao diện chrome sang Tiếng Anh ngay lập tức."
                ],
                "exceptions": [
                    {"case": "Lỗi mạng khi lưu tùy chọn ngôn ngữ", "handling": "Hệ thống vẫn đổi UI cục bộ và thử lưu lại khi có mạng."}
                ],
                "post": "Giao diện chuyển sang Tiếng Anh và duy trì qua các phiên làm việc tiếp theo.",
                "rules": ["BR-KHAC-02", "BR-KHAC-03"]
            },
            {
                "id": "UC-KHC-02",
                "name": "Xem Thông báo hệ thống từ nhà cung cấp Finviet",
                "desc": "Admin trường tiếp nhận và đọc thông báo nâng cấp phiên bản mới.",
                "actor": "Admin trường / Người dùng",
                "trigger": "Bấm vào mục 'Thông báo hệ thống' trong Menu Avatar.",
                "pre": "Có thông báo mới phát hành từ Finviet.",
                "happy_path": [
                    "1. Bấm Avatar, thấy badge số đỏ tại mục 'Thông báo hệ thống'.",
                    "2. Nhấp 'Thông báo hệ thống' -> Điều hướng sang /system/announcement/.",
                    "3. Xem danh sách thông báo; nhấp vào thông báo 'Kế hoạch nâng cấp hệ thống ngày 30/10' để xem chi tiết.",
                    "4. Trạng thái thông báo tự động chuyển sang Đã đọc và badge số giảm tương ứng."
                ],
                "exceptions": [
                    {"case": "Chưa có thông báo nào", "handling": "Hiển thị trạng thái rỗng 'Hiện chưa có thông báo mới từ hệ thống'."}
                ],
                "post": "Thông báo được đánh dấu đã đọc.",
                "rules": ["BR-KHAC-02", "BR-KHAC-08"]
            }
        ]
    },
    "ui": {
        "entry_point": "Avatar người dùng ở góc trên bên phải màn hình mọi trang -> Menu Dropdown 5 mục.",
        "screens_table": [
            {"screen": "Menu Dropdown Avatar (`UserAvatarDropdown`)", "component": "Menu xổ xuống 5 mục", "format": "Dropdown panel nổi góc trên phải", "desc": "Gồm 5 mục: Tài khoản, Thông báo (badge), Thông báo hệ thống (badge), Ngôn ngữ (slideout left), Đăng xuất.", "note": "BR-KHAC-02, BR-KHAC-03", "image": "m7-uc01-avatar-dropdown.png"},
            {"screen": "Hồ sơ cá nhân (`UserProfileView`)", "component": "Trang xem thông tin tài khoản", "format": "Card thông tin view-only tại `/user/profile/`", "desc": "Hiển thị ảnh đại diện, họ tên, email, SĐT, CCCD, chức vụ, bộ phận, bằng cấp kèm nút sửa.", "note": "BR-KHAC-04", "image": "m7-uc02-thong-tin-tai-khoan.png"},
            {"screen": "Sửa thông tin cá nhân (`UserEditProfileView`)", "component": "Form cập nhật hồ sơ", "format": "Form nhập liệu tại `/user/edit-profile/`", "desc": "Tải ảnh đại diện mới, sửa số điện thoại, địa chỉ, bằng cấp. Khắc phục lỗi banner chưa lưu.", "note": "BR-KHAC-04, BR-KHAC-06", "image": "m7-uc02-chinh-sua-tai-khoan.png"},
            {"screen": "Đổi mật khẩu (`UserChangePasswordView`)", "component": "Form đổi mật khẩu", "format": "Form bảo mật tại `/user/change-password/`", "desc": "Mật khẩu hiện tại, mật khẩu mới chuẩn ISO 27001 và xác nhận mật khẩu mới.", "note": "BR-KHAC-05, BR-KHAC-06", "image": "m7-uc02-doi-mat-khau.png"},
            {"screen": "Submenu Ngôn ngữ (`LanguageSubmenu`)", "component": "Menu trượt trái chuyển đổi ngôn ngữ", "format": "Slideout panel bên trái mục Ngôn ngữ", "desc": "Hiển thị Tiếng Việt và English kèm dấu tích tại ngôn ngữ đang chọn.", "note": "BR-KHAC-03", "image": "m7-uc03-ngon-ngu-submenu.png"},
            {"screen": "Trung tâm Thông báo cá nhân (`UserNotificationsView`)", "component": "Danh sách thông báo 4 tab", "format": "Tab layout tại `/user/notification/`", "desc": "4 tab: Hoạt Động, Trao Đổi, Học Phí, Khác kèm nút Đánh dấu đã đọc và Xóa.", "note": "BR-KHAC-07", "image": "m7-uc04-thong-bao-trao-doi.png"},
            {"screen": "Thông báo hệ thống từ Finviet (`SystemAnnouncementView`)", "component": "Bảng thông báo hệ thống nền tảng", "format": "Bảng danh sách tại `/system/announcement/`", "desc": "Bảng thông báo vận hành từ Finviet/SOHA gồm Tiêu đề, Nội dung tóm tắt, Ngày gửi, Trạng thái.", "note": "BR-KHAC-08", "image": "m7-uc06-thong-bao-he-thong.png"},
            {"screen": "Modal Xác nhận đăng xuất (`LogoutConfirmModal`)", "component": "Hộp thoại xác nhận đăng xuất", "format": "Modal Dialog cảnh báo", "desc": "Tiêu đề 'Vui lòng xác nhận đăng xuất khỏi hệ thống!' với 2 nút Hủy bỏ và Xác nhận.", "note": "BR-KHAC-09", "image": "m7-uc05-dang-xuat-confirm.png"}
        ]
    },
    "acceptance_criteria": [
        {
            "id": "AC-KHC-01",
            "title": "Hiển thị đầy đủ 5 mục trong Menu Avatar và chuyển đổi ngôn ngữ",
            "scenario": "Given Người dùng bấm vào Avatar góc trên bên phải\nWhen quan sát menu xổ xuống\nThen hệ thống hiển thị đúng 5 mục: Tài khoản, Thông báo, Thông báo hệ thống, Ngôn ngữ, Đăng xuất; chọn English sẽ dịch ngay giao diện sang Tiếng Anh."
        },
        {
            "id": "AC-KHC-02",
            "title": "Truy cập kênh Thông báo hệ thống từ Finviet",
            "scenario": "Given Người dùng nhấp vào 'Thông báo hệ thống' trong Menu Avatar\nWhen trang /system/announcement/ được tải\nThen danh sách các thông báo điều hành từ Finviet hiển thị đầy đủ và badge số tin chưa đọc cập nhật chính xác."
        },
        {
            "id": "AC-KHC-03",
            "title": "Không hiển thị sai banner chưa lưu khi vừa tải trang hồ sơ",
            "scenario": "Given Người dùng truy cập trang /user/edit-profile/ hoặc /user/change-password/\nWhen trang vừa hoàn tất tải dữ liệu và chưa có bất kỳ thao tác gõ phím nào\nThen banner cảnh báo 'Thay đổi của bạn chưa được lưu...' tuyệt đối không xuất hiện."
        }
    ],
    "nfr": {
        "performance": "Chuyển đổi ngôn ngữ giao diện chrome hoàn tất tức thì dưới 100ms không cần reload trang.",
        "security": "Mật khẩu mã hóa Argon2id; Đăng xuất thu hồi triệt để JWT token cả client lẫn server.",
        "ux": "Menu trượt trái mượt mà; các badge số thông báo hiển thị nổi bật với màu đỏ cảnh báo."
    },
    "appendix": {
        "notifications": [
            {"event": "Thông báo hệ thống mới từ Finviet", "channel": "In-app Badge & Alert", "recipient": "Admin trường & Toàn thể nhân sự", "content": "Finviet vừa phát hành thông báo bảo trì hệ thống định kỳ. Kính mời thầy cô xem chi tiết."}
        ],
        "edge_cases": [
            {"condition": "Mất kết nối mạng khi đang đổi mật khẩu", "solution": "Hệ thống thông báo lỗi kết nối và giữ nguyên dữ liệu trong form để người dùng thử lại."}
        ]
    }
}
ALL_PRDS["M7/SM1"] = p_m7_sm1

# -----------------------------------------------------------------------------
# 2. M1/SM1: M1 - SM1 - Tổng quan (Enhanced with 11 Widgets + 2 Modals + Clickable visual cues)
# -----------------------------------------------------------------------------
p_m1_sm1 = ALL_PRDS.get("M1/SM1")
if p_m1_sm1:
    p_m1_sm1["overview"]["context"] = (
        "Phân hệ <strong>Bảng Điều Khiển Tổng Quan Vận Hành &amp; Bảng Tin Nhà Trường (Executive School Operational Dashboard &amp; Overview)</strong> "
        "thuộc nhóm <strong>M1: Tổng quan</strong> là trang chủ chào đón mặc định ngay sau khi đăng nhập thành công vào Portal QLTH (<code>/overview/</code>). "
        "Dashboard tổng hợp toàn diện bức tranh hoạt động của nhà trường qua <strong>11 Khối thông tin (Widgets)</strong> chủ đạo: "
        "4 thẻ KPI tổng quan (Số học sinh, Số lớp học, Số giáo viên/nhân viên, Số phụ huynh kích hoạt), "
        "Tổng quan tài chính 2 chế độ xem (Tab Tổng quan &amp; Tab Chi tiết học phí theo lớp), "
        "Thông tin trong ngày 7 mục (Báo vắng, Báo đón trẻ, Dặn thuốc, Trao đổi, Hoạt động mới, Hình ảnh/video mới, Tổng suất ăn), "
        "Điểm danh trong ngày dạng biểu đồ Donut, Dung lượng lưu trữ ảnh/video (theo dõi hạn mức 3.000 ảnh / 500 phút video mỗi tháng), "
        "Trung tâm kiểm duyệt hoạt động, Biểu đồ hoạt động trong tuần, Bảng thông tin nội bộ, Top giáo viên nhận tim tháng, "
        "Danh sách học sinh vắng nhiều, và Hộp thư góp ý &amp; Sinh nhật trong tháng. "
        "Đặc biệt, hệ thống cung cấp <strong>2 Modal tác nghiệp nhanh</strong> được mở trực tiếp khi bấm vào nhãn <em>'Tổng suất ăn'</em> "
        "(Modal Suất ăn theo lớp kèm cảnh báo lớp chưa chốt sĩ số trước 10:00) và nhãn <em>'Chưa điểm danh'</em> "
        "(Modal Danh sách chưa điểm danh kèm icon mở thẳng trang điểm danh từng lớp), được thiết kế với chỉ dẫn trực quan rõ ràng."
    )
    p_m1_sm1["business"]["rules"].extend([
        {"id": "BR-DSH-04", "title": "Chỉ dẫn trực quan tại nhãn tác nghiệp nhanh", "desc": "Tại các nhãn 'Tổng suất ăn' và 'Chưa điểm danh', hệ thống bổ sung chỉ dẫn trực quan (gạch chân link, con trỏ chuột pointer và biểu tượng icon mở rộng) để người dùng dễ dàng nhận biết đây là nút mở modal xem nhanh mà không cần rời trang."},
        {"id": "BR-DSH-05", "title": "Modal Suất ăn theo lớp & Ngưỡng chốt 10:00", "desc": "Modal 'Suất ăn theo lớp' tổng hợp sĩ số ăn bán trú chi tiết của từng lớp trong ngày. Hiển thị dấu cảnh báo ⚠ màu cam đối với các lớp chưa hoàn thành điểm danh chốt suất ăn trước 10:00 sáng (cấu hình từ Managing Portal M2 Tab 8)."},
        {"id": "BR-DSH-06", "title": "Modal Danh sách chưa điểm danh & Shortcut lớp", "desc": "Modal 'Danh sách chưa điểm danh' liệt kê toàn bộ các lớp chưa hoàn thành điểm danh sáng. Mỗi dòng lớp học có icon 'cửa' dẫn thẳng sang trang Điểm danh của lớp đó (/class/{classId}/attendance/)."},
        {"id": "BR-DSH-07", "title": "Theo dõi hạn mức Media và Toggle Top Giáo viên", "desc": "Widget Dung lượng lưu trữ hiển thị tiến độ sử dụng hạn mức ảnh (3.000 ảnh) và video (500 phút) được cấu hình từ Managing Portal M2 Tab 2. Widget Top giáo viên nhận tim tháng có thể bật/tắt hiển thị linh hoạt từ Managing Portal M2 Tab 13."}
    ])
    p_m1_sm1["ui"]["screens_table"] = [
        {"screen": "Bảng tin Tổng quan & 4 Thẻ KPI", "component": "Executive Dashboard View", "format": "Lưới responsive 11 widget", "desc": "4 Thẻ KPI đỉnh trang, Biểu đồ thu chi tài chính, Thông tin trong ngày và Điểm danh.", "note": "BR-DSH-01, BR-DSH-04", "image": "tq-uc01-kpi-overview.png"},
        {"screen": "Tài chính chi tiết theo lớp", "component": "Tab Chi tiết tài chính", "format": "Bảng dữ liệu theo lớp + nút Xuất báo cáo", "desc": "4 thẻ tổng hợp tài chính và bảng chi tiết số tiền học phí phải thu, đã thu theo từng lớp.", "note": "BR-DSH-03", "image": "tq-uc01-tai-chinh-chi-tiet.png"},
        {"screen": "Điểm danh trong ngày", "component": "Donut Chart Widget", "format": "Biểu đồ tròn 3 phân đoạn", "desc": "Tỷ lệ Có mặt, Vắng, Chưa điểm danh kèm nhãn gạch chân mở modal danh sách.", "note": "BR-DSH-04", "image": "tq-uc02-diem-danh-trong-ngay.png"},
        {"screen": "Thông tin trong ngày 7 mục", "component": "Daily Activity Summary Card", "format": "Danh sách 7 chỉ số tác nghiệp", "desc": "Báo vắng, Báo đón trẻ, Dặn thuốc, Trao đổi, Hoạt động mới, Ảnh/video mới và Tổng suất ăn.", "note": "BR-DSH-04", "image": "tq-uc02-thong-tin-trong-ngay.png"},
        {"screen": "Modal Suất ăn theo lớp (`ClassMealModal`)", "component": "Hộp thoại tổng hợp suất ăn", "format": "Modal Dialog có cảnh báo ⚠", "desc": "Bảng tổng hợp suất ăn theo lớp, cảnh báo các lớp chưa chốt sĩ số trước 10:00 sáng.", "note": "BR-DSH-05", "image": "tq-uc06-suat-an-modal.png"},
        {"screen": "Modal Danh sách chưa điểm danh (`UnattendedClassModal`)", "component": "Hộp thoại danh sách lớp chưa điểm danh", "format": "Modal Dialog kèm shortcut hành động", "desc": "Danh sách lớp chưa điểm danh với icon cửa mở thẳng trang điểm danh từng lớp.", "note": "BR-DSH-06", "image": "tq-uc06-danh-sach-chua-diem-danh.png"}
    ]

# -----------------------------------------------------------------------------
# 3. M6/SM2: M6 - SM2 - Tài khoản (Updated with Rule 9.1: No parent account creation, keep others, locked admin)
# -----------------------------------------------------------------------------
p_m6_sm2 = ALL_PRDS.get("M6/SM2")
if p_m6_sm2:
    p_m6_sm2["overview"]["context"] = (
        "Phân hệ <strong>Quản lý tài khoản &amp; Phân quyền người dùng (User &amp; Role-based Access Control - RBAC)</strong> "
        "thuộc nhóm <strong>M6: Cấu hình</strong> chịu trách nhiệm quản trị danh mục tài khoản người dùng nội bộ của nhà trường "
        "qua 2 tab riêng biệt: <strong>Tab Người Dùng</strong> (<code>/setting/users/</code>) và <strong>Tab Học Sinh</strong> (<code>/setting/students/</code>). "
        "Theo <strong>Quy tắc nghiệp vụ 9.1</strong>, phân hệ <strong>tuyệt đối không cho phép tạo tài khoản Phụ huynh thủ công trên Web Portal</strong> "
        "(tài khoản Phụ huynh được hệ thống tự động sinh và kích hoạt khi khai báo hồ sơ học sinh và liên kết số điện thoại phụ huynh tại M5/SM1 hoặc qua App Phụ huynh). "
        "Chức năng tạo tài khoản trên Web Portal được giữ nguyên cho các nhóm nhân sự nội bộ (Quản trị viên, Giáo viên, Nhân viên). "
        "Đồng thời, phân hệ khóa cứng không cho Admin trường tự tạo/sửa/xóa tài khoản có vai trò Super Admin (chỉ cấp từ Managing Portal M2), "
        "khóa sửa Họ tên/Trạng thái đối với tài khoản đồng bộ từ CSDL Sở GD&ĐT, và vai trò Nhân viên bắt buộc chọn 1 trong 4 chức năng chuyên biệt."
    )
    p_m6_sm2["business"]["rules"].extend([
        {"id": "BR-TK-06", "title": "Khóa tạo tài khoản Phụ huynh thủ công trên Web (Quy tắc 9.1)", "desc": "Hệ thống tuyệt đối không cung cấp form tạo tài khoản Phụ huynh thủ công trên Web Portal. Tài khoản Phụ huynh được tự động sinh khi thêm học sinh và liên kết số điện thoại cha/mẹ tại phân hệ M5/SM1. Form tạo tài khoản chỉ áp dụng cho nhân sự nội bộ (BGH, Giáo viên, Nhân viên)."},
        {"id": "BR-TK-07", "title": "Bảo vệ tài khoản Super Admin & Đồng bộ CSDL Sở", "desc": "Tài khoản Quản trị viên cấp trường (School Admin) không có quyền tạo mới, chỉnh sửa vai trò hoặc xóa tài khoản có quyền Super Admin (tài khoản này chỉ được quản lý từ Managing Portal M2). Đối với các tài khoản có nhãn 'CSDL Sở' (đồng bộ từ Sở GD&ĐT), hệ thống khóa cứng các trường Họ tên và Trạng thái hoạt động."},
        {"id": "BR-TK-08", "title": "Quy định 4 chức năng chuyên biệt cho vai trò Nhân viên", "desc": "Khi chọn vai trò 'Nhân viên', hệ thống bắt buộc người dùng phải chọn đúng 1 trong 4 chức năng nghiệp vụ chuyên biệt: 1. Điểm danh, 2. Kế toán, 3. Thông báo, 4. Chăm sóc/Y tế để giới hạn phạm vi truy cập phù hợp."},
        {"id": "BR-TK-09", "title": "Khắc phục lỗi placeholder {{{object}}} ở tooltip", "desc": "Sửa lỗi kỹ thuật hiển thị chuỗi biến thô '{{{object}}}' trên tooltip của bảng danh sách người dùng; truyền đúng danh từ vai trò hoặc tên đối tượng tương ứng."}
    ])

# -----------------------------------------------------------------------------
# 4. M5/SM3: M5 - SM3 - Lớp học (Updated with 2 Tabs: Chính khóa vs Ngoại khóa & Phân công bộ môn)
# -----------------------------------------------------------------------------
p_m5_sm3 = ALL_PRDS.get("M5/SM3")
if p_m5_sm3:
    p_m5_sm3["business"]["rules"].extend([
        {"id": "BR-CLS-06", "title": "Phân chia 2 Tab độc lập: Lớp chính khóa vs Lớp ngoại khóa (Quy tắc 9.3)", "desc": "Danh sách lớp học chia thành 2 tab độc lập: Tab 'Lớp chính khóa' (hỗ trợ đầy đủ 6 khoản học phí, danh sách học sinh, phiếu đánh giá, phân công bộ môn, thời khóa biểu, bài tập) và Tab 'Lớp ngoại khóa' (chỉ hỗ trợ Điểm danh, Hoạt động, Thư viện ảnh và 1 khoản học phí rút gọn)."},
        {"id": "BR-CLS-07", "title": "Phân công bộ môn là nguồn dữ liệu cho Bài tập & Điểm số (Câu 5)", "desc": "Tab 'Phân công bộ môn' tại chi tiết lớp học là nguồn dữ liệu duy nhất quyết định danh mục Môn học xuất hiện khi Giáo viên tạo Bài tập (M3/SM2) hoặc nhập Điểm & Đánh giá (M3/SM3). Lớp học bắt buộc phải được gán giáo viên bộ môn tại đây trước khi có thể giao bài hoặc chấm điểm."}
    ])

# -----------------------------------------------------------------------------
# 5. M5/SM13: M5 - SM13 - Năm học (Updated: Auto badge 'Hiện tại', No delete button)
# -----------------------------------------------------------------------------
p_m5_sm13 = ALL_PRDS.get("M5/SM13")
if p_m5_sm13:
    p_m5_sm13["business"]["rules"].extend([
        {"id": "BR-AY-05", "title": "Tự động gắn nhãn 'Hiện tại' và Bảo toàn dữ liệu (Quy tắc 9.7)", "desc": "Năm học tự động gắn badge màu xanh lá 'Hiện tại' dựa trên ngày thực tế hôm nay (startDate <= today <= endDate). Để bảo vệ toàn vẹn lịch sử học tập và học phí nhiều năm, hệ thống hoàn toàn không cung cấp nút Xóa năm học; chỉ cho phép Thêm mới hoặc Chỉnh sửa khoảng thời gian."}
    ])

# -----------------------------------------------------------------------------
# 6. M2/SM1: M2 - SM1 - Điểm danh (2-way auto sync with absence request)
# -----------------------------------------------------------------------------
p_m2_sm1 = ALL_PRDS.get("M2/SM1")
if p_m2_sm1:
    p_m2_sm1["business"]["rules"].extend([
        {"id": "BR-ATT-10", "title": "Tự động đồng bộ 2 chiều với Đơn báo vắng (Câu 7)", "desc": "Khi đơn Báo vắng của phụ huynh được Giáo viên hoặc Admin bấm 'Xác nhận báo vắng' (trong Trao đổi M2/SM4 hoặc tại Hàng đợi Báo vắng đầu giờ), hệ thống tự động ghi nhận trạng thái Vắng Có Phép (CP) cho học sinh trên Sổ điểm danh ngày của lớp tương ứng mà không cần giáo viên phải thao tác thủ công."}
    ])

# -----------------------------------------------------------------------------
# 7. M2/SM4: M2 - SM4 - Trao đổi (2-way sync with absence & 7 unified categories)
# -----------------------------------------------------------------------------
p_m2_sm4 = ALL_PRDS.get("M2/SM4")
if p_m2_sm4:
    p_m2_sm4["business"]["rules"].extend([
        {"id": "BR-CV-13", "title": "Đồng bộ tự động trạng thái Vắng có phép sang Sổ điểm danh & Báo cáo (Câu 7)", "desc": "Khi bấm 'Xác nhận báo vắng' trong luồng chat Trao đổi, hệ thống vừa gửi tin nhắn xác nhận vào khung chat, vừa tự động ghi nhận trạng thái Vắng Có Phép (CP) trên Sổ điểm danh ngày (M2/SM1) và Báo cáo điểm danh tháng (M2/SM5). Nếu phụ huynh hoặc giáo viên bấm 'Hủy báo vắng' trước ngày nghỉ, hệ thống tự động hủy trạng thái vắng đã ghi nhận."},
        {"id": "BR-CV-14", "title": "Đồng bộ thống nhất danh mục 7 Thể loại Trao đổi (Câu 8)", "desc": "Thống nhất đồng bộ danh mục Thể loại ở cả thanh Chip lọc nhanh và khung tạo cuộc trao đổi mới gồm đầy đủ 7 mục: 1. Tất cả, 2. Tin nhắn, 3. Báo vắng, 4. Dặn thuốc, 5. Đón hộ, 6. Góp ý, 7. Khác."}
    ])

# -----------------------------------------------------------------------------
# 8. M2/SM5: M2 - SM5 - Báo cáo Điểm danh (Auto sync absence & Late pickup calc)
# -----------------------------------------------------------------------------
p_m2_sm5 = ALL_PRDS.get("M2/SM5")
if p_m2_sm5:
    p_m2_sm5["business"]["rules"].extend([
        {"id": "BR-RPT-10", "title": "Tự động đồng bộ Vắng Có Phép từ đơn Báo vắng (Câu 7)", "desc": "Lưới Báo cáo điểm danh tháng tự động cập nhật ký hiệu 'P' (Có phép) cho các ngày học sinh có đơn báo vắng đã được giáo viên xác nhận trong phân hệ Trao đổi M2/SM4, đảm bảo số liệu tổng kết chuyên cần và hoàn tiền ăn khớp 100%."},
        {"id": "BR-RPT-11", "title": "Tính phụ phí trả trẻ muộn tự động", "desc": "Hệ thống tự động ghi nhận thời gian trả trẻ thực tế sau giờ quy định (17:30) và tính phụ phí làm thêm giờ theo công thức 50.000 VNĐ cho mỗi block 30 phút muộn, tổng hợp vào bảng thanh toán học phí cuối tháng."}
    ])

# -----------------------------------------------------------------------------
# 9. M4/SM1: M4 - SM1 - Học phí (6 invoice states, Excel batch adjustment, 3 system fees)
# -----------------------------------------------------------------------------
p_m4_sm1 = ALL_PRDS.get("M4/SM1")
if p_m4_sm1:
    p_m4_sm1["business"]["rules"].extend([
        {"id": "BR-FEE-08", "title": "Vòng đời 6 trạng thái hóa đơn & Tự động quá hạn (Quy tắc 9.5)", "desc": "Hóa đơn học phí vận hành theo 6 trạng thái chuẩn: Chưa phát hành, Chờ thanh toán, Nộp một phần, Đã hoàn thành, Quá hạn, Đã hủy. Hệ thống tự động chuyển hóa đơn sang trạng thái 'Quá hạn' sau 2 ngày kể từ hạn nộp nếu chưa thu đủ 100% tiền."},
        {"id": "BR-FEE-09", "title": "Điều chỉnh hóa đơn hàng loạt bằng tệp Excel (Quy tắc 9.5)", "desc": "Kế toán có thể xuất danh sách hóa đơn ra tệp Excel, nhập số tiền điều chỉnh (miễn giảm học bổng, phụ thu hoạt động phát sinh), tải tệp lên lại hệ thống để cập nhật hàng loạt cho toàn khối/toàn trường."}
    ])

# -----------------------------------------------------------------------------
# 10. M5/SM8: M5 - SM8 - Thực đơn (Grid & File mode, GTIN/Batch traceability, AI Menu)
# -----------------------------------------------------------------------------
p_m5_sm8 = ALL_PRDS.get("M5/SM8")
if p_m5_sm8:
    p_m5_sm8["business"]["rules"].extend([
        {"id": "BR-MNU-07", "title": "Hỗ trợ 2 chế độ: Dạng lưới & Sử dụng tệp tải lên (Quy tắc 9.6)", "desc": "Nhà trường có thể chọn xây dựng thực đơn dạng lưới (nhập món ăn chi tiết theo Bữa sáng, Bữa trưa, Bữa xế từng ngày) hoặc chế độ Sử dụng tệp tải lên (upload file PDF/Excel thực đơn đã được BGH duyệt để phụ huynh xem trực tiếp)."},
        {"id": "BR-MNU-08", "title": "Truy xuất nguồn gốc thực phẩm & Khối tạo thực đơn AI (Quy tắc 9.6)", "desc": "Hỗ trợ khai báo truy xuất nguồn gốc nguyên liệu thực phẩm theo mã chuẩn quốc tế GTIN + Số lô hoặc Mã tem nội bộ. Tích hợp khối 'Tạo thực đơn AI' gợi ý món ăn dinh dưỡng cân bằng theo tuần khi được bật cờ từ Managing Portal M2 Tab 8."}
    ])

# -----------------------------------------------------------------------------
# 11. M5/SM9: M5 - SM9 - Điểm danh NV (Retroactive 45 days & Auto-save onBlur)
# -----------------------------------------------------------------------------
p_m5_sm9 = ALL_PRDS.get("M5/SM9")
if p_m5_sm9:
    p_m5_sm9["business"]["rules"].extend([
        {"id": "BR-STF-05", "title": "Giới hạn chấm công lùi 45 ngày & Tự động lưu onBlur (Quy tắc 9.7)", "desc": "Admin và Quản lý nhân sự chỉ được phép cập nhật dữ liệu chấm công lùi tối đa 45 ngày so với ngày hiện tại (ngăn chặn sửa đổi công quá khứ xa). Ô nhập Ghi chú trên từng dòng nhân sự tự động kích hoạt lưu dữ liệu ngay khi con trỏ chuột rời ô (sự kiện onBlur) mà không cần nút Lưu riêng."}
    ])

# -----------------------------------------------------------------------------
# 12. M4/SM3: M4 - SM3 - Khoản phí (3 system fees protected & 8 fixed units)
# -----------------------------------------------------------------------------
p_m4_sm3 = ALL_PRDS.get("M4/SM3")
if p_m4_sm3:
    p_m4_sm3["business"]["rules"].extend([
        {"id": "BR-SF-06", "title": "Bảo vệ 3 khoản phí hệ thống cố định & 8 Đơn vị tính (Quy tắc 9.5)", "desc": "Hệ thống bảo vệ nghiêm ngặt 3 khoản phí hệ thống mặc định: Học phí, Tiền ăn, Phí trả học sinh trễ (khóa sửa tên, khóa xóa; chỉ cho phép bật/tắt cờ Xuất HĐĐT inline). Các khoản phí tùy chỉnh mới tạo bắt buộc chọn 1 trong 8 đơn vị tính cố định: Ngày, Tháng, Năm, Lần, Chuyến, Bộ, Khác, Giờ."}
    ])

# -----------------------------------------------------------------------------
# 13. M4/SM4: M4 - SM4 - Quản lý học phí (Fix false dirty banner on initial load)
# -----------------------------------------------------------------------------
p_m4_sm4 = ALL_PRDS.get("M4/SM4")
if p_m4_sm4:
    p_m4_sm4["business"]["rules"].extend([
        {"id": "BR-TM-09", "title": "Khắc phục triệt để banner báo chưa lưu khi tải trang (Câu 9.8)", "desc": "Sửa lỗi kỹ thuật hiển thị sai banner 'Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!' ngay khi vừa tải bảng cấu hình học phí theo lớp. Banner chỉ xuất hiện khi người dùng thực sự sửa giá trị trong bảng (isDirty = true) và cố gắng rời khỏi trang."}
    ])

# -----------------------------------------------------------------------------
# 14. M6/SM5: M6 - SM5 - Tính năng (2 tabs: Hoạt Động & Học Kỳ, max 2 terms, fix dirty banner)
# -----------------------------------------------------------------------------
p_m6_sm5 = ALL_PRDS.get("M6/SM5")
if p_m6_sm5:
    p_m6_sm5["business"]["rules"].extend([
        {"id": "BR-FEA-06", "title": "Cấu hình Tính năng 2 Tab: Hoạt Động & Học Kỳ (Quy tắc 9.7 & 9.8)", "desc": "Giao diện chia 2 tab: Tab 'Hoạt Động' (cấu hình duyệt bài, cho phép tương tác tim/bình luận) và Tab 'Học Kỳ' (thêm/sửa inline tối đa 2 học kỳ trong một năm học, không có nút Xóa để bảo vệ lịch sử học tập). Khắc phục triệt để lỗi hiển thị banner chưa lưu ngay khi vừa tải trang."}
    ])

# -----------------------------------------------------------------------------
# 15. M5/SM4: M5 - SM4 - Môn học (4 tabs by level, Admin only assigns teachers)
# -----------------------------------------------------------------------------
p_m5_sm4 = ALL_PRDS.get("M5/SM4")
if p_m5_sm4:
    p_m5_sm4["business"]["rules"].extend([
        {"id": "BR-SUB-05", "title": "Phân chia 4 Tab theo cấp học & Giới hạn quyền sửa môn gốc (Quy tắc 9.2)", "desc": "Danh mục môn học chia thành 4 tab: Tiểu học (TH), THCS, THPT, GDTX. Đối với tài khoản Admin trường, hệ thống khóa không cho phép Thêm, Sửa hoặc Xóa bản ghi môn học gốc (môn học do Bộ GD&ĐT quy định và cấp từ Managing Portal); Admin trường chỉ được quyền Thêm/Xóa Giáo viên giảng dạy vào từng môn học tương ứng."}
    ])

# -----------------------------------------------------------------------------
# 16. M3/SM1: M3 - SM1 - Thời khóa biểu (Date validation & Fix undefined term)
# -----------------------------------------------------------------------------
p_m3_sm1 = ALL_PRDS.get("M3/SM1")
if p_m3_sm1:
    p_m3_sm1["business"]["rules"].extend([
        {"id": "BR-SCH-05", "title": "Ràng buộc khoảng thời gian hợp lệ & Khắc phục lỗi Học kỳ undefined (Câu 6)", "desc": "Khi tạo Thời khóa biểu dạng lưới, hệ thống bắt buộc kiểm tra điều kiện Ngày bắt đầu <= Ngày kết thúc của Học kỳ và phải nằm trong niên khóa hợp lệ (khắc phục lỗi 'Khoảng thời gian không hợp lệ'). Đồng thời, trang Chỉnh sửa Thời khóa biểu binding chính xác tên Học kỳ, khắc phục hoàn toàn lỗi hiển thị 'Học kỳ: undefined'."}
    ])

# -----------------------------------------------------------------------------
# 17. M3/SM2: M3 - SM2 - Bài tập (Link subjects from Class Assignment M5/SM3)
# -----------------------------------------------------------------------------
p_m3_sm2 = ALL_PRDS.get("M3/SM2")
if p_m3_sm2:
    p_m3_sm2["business"]["rules"].extend([
        {"id": "BR-ASN-04", "title": "Liên thông danh mục Môn học từ Phân công bộ môn (Câu 5)", "desc": "Khắc phục triệt để điểm đứt gãy 'Chưa có môn học': Dropdown môn học trong form tạo bài tập tự động lấy danh sách môn học đã được phân công giáo viên tại phân hệ M5/SM3 (Lớp học -> Tab Phân công bộ môn). Nếu lớp học chưa được phân công môn, hệ thống hiển thị thông báo hướng dẫn 'Lớp này chưa có phân công môn học' kèm nút shortcut dẫn thẳng sang trang phân công bộ môn của lớp đó."}
    ])

# -----------------------------------------------------------------------------
# 18. M3/SM3: M3 - SM3 - Điểm & Đánh giá (Link subjects + 2 independent tabs TT51)
# -----------------------------------------------------------------------------
p_m3_sm3 = ALL_PRDS.get("M3/SM3")
if p_m3_sm3:
    p_m3_sm3["business"]["rules"].extend([
        {"id": "BR-GRD-04", "title": "Liên thông danh mục Môn học từ Phân công bộ môn (Câu 5)", "desc": "Khắc phục triệt để điểm đứt gãy 'Chưa có môn học': Danh sách môn học hiển thị trên bảng nhập điểm được đồng bộ tự động từ tab Phân công bộ môn của Lớp học (M5/SM3). Lớp học bắt buộc phải có phân công môn học mới có thể nhập điểm."},
        {"id": "BR-GRD-05", "title": "Hỗ trợ 2 Tab độc lập: Bảng điểm học tập & Phiếu đánh giá học tập TT51 (Quy tắc 9.4)", "desc": "Phân hệ chia thành 2 tab độc lập: Tab 'Bảng điểm học tập' (nhập điểm số ĐĐGTX 1–5, ĐĐGGK, ĐĐGCK, Điểm tổng kết) và Tab 'Phiếu đánh giá học tập' (đánh giá mức Tốt / Đạt / Cần cố gắng cho các môn học, Năng lực chung [3 mục: Tự chủ & tự học, Giao tiếp & hợp tác, Giải quyết vấn đề], Năng lực đặc thù [7 mục: Ngôn ngữ, Tính toán, Khoa học, Công nghệ, Tin học, Thẩm mỹ, Thể chất], Phẩm chất [5 mục: Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm] theo chuẩn Thông tư 51/2020/TT-BGDĐT)."}
    ])

# -----------------------------------------------------------------------------
# Execution & Publishing to Confluence
# -----------------------------------------------------------------------------
TARGET_CODES = [
    "M7/SM1", "M1/SM1", "M6/SM2", "M5/SM3", "M5/SM13",
    "M2/SM1", "M2/SM4", "M2/SM5", "M4/SM1", "M5/SM8",
    "M5/SM9", "M4/SM3", "M4/SM4", "M6/SM5", "M5/SM4",
    "M3/SM1", "M3/SM2", "M3/SM3"
]

print(f"\n=======================================================")
print(f"  EXECUTING GIAI ĐOẠN 1: UPDATING 18 PRDS ON CONFLUENCE")
print(f"=======================================================")

client = ConfluenceClient(BASE_URL, TOKEN, SPACE_KEY)
results = []

# Screenshots mapping for M7/SM1 and M1/SM1
SCREENSHOTS_TO_UPLOAD = {
    "M7/SM1": [
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc01-avatar-dropdown.png", "m7-uc01-avatar-dropdown.png"),
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc02-thong-tin-tai-khoan.png", "m7-uc02-thong-tin-tai-khoan.png"),
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc02-chinh-sua-tai-khoan.png", "m7-uc02-chinh-sua-tai-khoan.png"),
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc02-doi-mat-khau.png", "m7-uc02-doi-mat-khau.png"),
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc03-ngon-ngu-submenu.png", "m7-uc03-ngon-ngu-submenu.png"),
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc04-thong-bao-trao-doi.png", "m7-uc04-thong-bao-trao-doi.png"),
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc06-thong-bao-he-thong.png", "m7-uc06-thong-bao-he-thong.png"),
        ("docs_legacy/Portal QLTH/M7-khac/screenshots/m7-uc05-dang-xuat-confirm.png", "m7-uc05-dang-xuat-confirm.png")
    ],
    "M1/SM1": [
        ("docs_legacy/Portal QLTH/M1-tong-quan/screenshots/tq-uc01-kpi-overview.png", "tq-uc01-kpi-overview.png"),
        ("docs_legacy/Portal QLTH/M1-tong-quan/screenshots/tq-uc01-tai-chinh-chi-tiet.png", "tq-uc01-tai-chinh-chi-tiet.png"),
        ("docs_legacy/Portal QLTH/M1-tong-quan/screenshots/tq-uc02-diem-danh-trong-ngay.png", "tq-uc02-diem-danh-trong-ngay.png"),
        ("docs_legacy/Portal QLTH/M1-tong-quan/screenshots/tq-uc02-thong-tin-trong-ngay.png", "tq-uc02-thong-tin-trong-ngay.png"),
        ("docs_legacy/Portal QLTH/M1-tong-quan/screenshots/tq-uc06-suat-an-modal.png", "tq-uc06-suat-an-modal.png"),
        ("docs_legacy/Portal QLTH/M1-tong-quan/screenshots/tq-uc06-danh-sach-chua-diem-danh.png", "tq-uc06-danh-sach-chua-diem-danh.png")
    ]
}

for idx, code in enumerate(TARGET_CODES, 1):
    prd = ALL_PRDS.get(code)
    if not prd:
        print(f"[{idx}/{len(TARGET_CODES)}] ERROR: Code {code} not found in base PRDs!")
        continue
        
    name = prd["name"]
    parent_mod = prd["parent_module"]
    parent_id = MODULE_PARENTS.get(parent_mod)
    
    print(f"[{idx}/{len(TARGET_CODES)}] Updating {code:8} -> '{name}' (Parent: {parent_mod}:{parent_id})...", end="", flush=True)
    
    # 1. Upload screenshots if applicable
    existing_page = client.get_page_by_title(name)
    if existing_page and code in SCREENSHOTS_TO_UPLOAD:
        for file_path, file_name in SCREENSHOTS_TO_UPLOAD[code]:
            if os.path.exists(file_path):
                client.upload_attachment(existing_page["id"], file_path, file_name)
                
    # 2. Render XHTML Storage Format
    html_storage = render_prd_storage_format(prd)
    
    # 3. Create or update Confluence page
    try:
        res = client.create_or_update_page(name, parent_id, html_storage)
        action = res.get("action", "unknown")
        page_id = res.get("id")
        ver = res.get("version")
        print(f" {action.upper()} (ID: {page_id}, v{ver})")
        results.append({
            "code": code,
            "name": name,
            "parent_module": parent_mod,
            "page_id": page_id,
            "version": ver,
            "status": "SUCCESS"
        })
    except Exception as e:
        print(f" FAILED! Error: {e}")
        results.append({
            "code": code,
            "name": name,
            "parent_module": parent_mod,
            "error": str(e),
            "status": "FAILED"
        })
        
    time.sleep(0.3)

print("\n=======================================================")
print(f"  GIAI ĐOẠN 1 COMPLETED: {len([r for r in results if r['status'] == 'SUCCESS'])}/{len(TARGET_CODES)} SUCCESSFUL")
print("=======================================================")
