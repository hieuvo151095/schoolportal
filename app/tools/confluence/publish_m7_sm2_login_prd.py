# -*- coding: utf-8 -*-
"""
Publish/Update Module M7 - SM2 - Đăng nhập PRD on Confluence:
- Space: EDUS
- Parent: M7 - Khác (Parent ID: 107850395)
- Target Page: M7 - SM2 - Đăng nhập (Page ID: 107850404)
- Uploads 10 fresh screenshots from scratch/
- Renders comprehensive 8-section XHTML storage format complying with [DS] ECO ME DASHBOARD v1.2.0
- Fully incorporates user decisions:
    1. SSO Protocol: JWT currently (same as HCMEDU SSO), with architectural note for future adaptation per Sở
    2. Account Mapping: School already has accounts pre-synchronized by Sở
    3. Session Duration: 24 hours (active session & remember me)
    4. Retry Limit: No limit
"""

import os
import sys
import json
import time

sys.path.insert(0, os.path.abspath("."))

from tools.confluence.confluence_client import ConfluenceClient
from tools.confluence.prd_template import render_prd_storage_format, escape_xml, sanitize_xhtml

BASE_URL = "https://kb.finviet.com.vn"
TOKEN = os.environ.get("CONFLUENCE_TOKEN", "")
SPACE_KEY = "EDUS"
PARENT_ID = 107850395  # M7 - Khác
PAGE_ID = 107850404    # M7 - SM2 - Đăng nhập

SCREENSHOTS = [
    {"source": "scratch/login_1_sso.png", "target": "m7_sm2_tab_sso.png", "title": "Tab Đăng nhập SSO (Mặc định)"},
    {"source": "scratch/login_2_sso_error.png", "target": "m7_sm2_sso_error.png", "title": "Cảnh báo lỗi chưa chọn trường học"},
    {"source": "scratch/login_3_sso_list.png", "target": "m7_sm2_sso_search_list.png", "title": "ComboboxField tìm kiếm trường tiếng Việt không dấu"},
    {"source": "scratch/login_4_sso_selected.png", "target": "m7_sm2_sso_school_selected.png", "title": "Trường học được chọn hợp lệ"},
    {"source": "scratch/login_5_sso_portal.png", "target": "m7_sm2_sso_portal_hcmedu.png", "title": "Cổng xác thực SSO Sở GD&ĐT (định dạng HCMEDU SSO)"},
    {"source": "scratch/login_6_sso_portal_error.png", "target": "m7_sm2_sso_portal_error.png", "title": "Cảnh báo lỗi xác thực cổng SSO"},
    {"source": "scratch/login_7_account.png", "target": "m7_sm2_tab_account.png", "title": "Tab Đăng nhập bằng tài khoản Finviet"},
    {"source": "scratch/login_8_account_errors.png", "target": "m7_sm2_account_validation_errors.png", "title": "Kiểm tra tính hợp lệ dữ liệu các trường nhập"},
    {"source": "scratch/login_9_account_wrong.png", "target": "m7_sm2_account_security_generic_error.png", "title": "Thông báo lỗi an ninh bảo mật chung (chống rà quét)"},
    {"source": "scratch/login_10_account_revealed.png", "target": "m7_sm2_account_password_revealed.png", "title": "Tính năng ẩn/hiện mật khẩu"},
]

m7_sm2_prd_data = {
    "code": "M7/SM2",
    "name": "M7 - SM2 - Đăng nhập",
    "priority": "MUST HAVE",
    "status": "APPROVED FOR BUILD",
    "owner": "hieu.vo1@finviet.com.vn",
    "reviewer": "hieu.vo1@finviet.com.vn",
    "created_date": "2026-10-27",
    "parent_module": "M7 - Khác",
    "parent_category": "8. Portal QLTH > M7 - Khác > M7 - SM2 - Đăng nhập",
    "history": [
        {
            "version": "1.0",
            "section": "Khởi tạo đặc tả tính năng",
            "content": "Khởi tạo đặc tả phân hệ Đăng nhập hệ thống School Operating Portal trong kiến trúc SaaS đa người thuê (Multi-tenancy).",
            "date": "2026-10-27",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.1",
            "section": "Chốt quyết định kiến trúc & Nghiệp vụ đa Sở",
            "content": "Cập nhật 2 phương thức xác thực độc lập (SSO Sở GD&ĐT và Tài khoản Finviet). Chốt giao thức SSO sử dụng JWT (tương thích HCMEDU SSO) kèm Adapter Pattern cho các Sở khác; chốt cơ chế ánh xạ tài khoản đồng bộ từ Sở; chốt thời hạn phiên 24 giờ; không giới hạn số lần thử đăng nhập.",
            "date": "2026-10-31",
            "author": "hieu.vo1@finviet.com.vn"
        },
        {
            "version": "1.2",
            "section": "Đính kèm Prototype & Bàn giao kỹ thuật",
            "content": "Hoàn thiện 10 hình ảnh chụp màn hình Prototype thực tế tuân thủ Design System v1.2.0, bảng đặc tả chi tiết Given-When-Then, NFR và Hand-off API contracts.",
            "date": "2026-10-31",
            "author": "hieu.vo1@finviet.com.vn"
        }
    ],

    # 1. Thông tin tổng quan
    "overview": {
        "context": (
            "Cổng xác thực đăng nhập <strong>Authentication &amp; Session Management</strong> thuộc nhóm <strong>M7: Khác</strong> "
            "là cửa ngõ truy cập duy nhất vào hệ thống School Operating Portal. Trong kiến trúc SaaS đa người thuê (Multi-tenant SaaS), "
            "phân hệ giải quyết bài toán định danh chính xác trường học theo tiền tố đường dẫn <code>/{schoolCode}</code> hoặc qua lựa chọn tập trung tại trang <code>/signin</code>.<br /><br />"
            "Để đáp ứng đặc thù ngành giáo dục Việt Nam với sự đa dạng giữa các khối trường công lập và ngoài công lập, hệ thống hỗ trợ <strong>2 phương thức đăng nhập độc lập</strong>:<br />"
            "1. <strong>Đăng nhập SSO bằng dữ liệu Sở GD&ĐT:</strong> Dành cho các cơ sở giáo dục thuộc các Sở GD&ĐT đã triển khai hệ thống xác thực tập trung (như Sở GD&ĐT TP. Hồ Chí Minh với cổng HCMEDU SSO <code>api.hcm.edu.vn</code>). Người dùng chọn Sở, tìm kiếm trường, sau đó chuyển hướng xác thực tại cổng của Sở bằng số Căn cước công dân (CCCD 12 số).<br />"
            "2. <strong>Đăng nhập bằng tài khoản Finviet:</strong> Dành cho cán bộ quản lý, giáo viên, kế toán thuộc các trường ngoài công lập hoặc các đơn vị sử dụng tài khoản do Finviet trực tiếp cấp phát (Mã trường + Email + Mật khẩu)."
        ),
        "goals_list": [
            "Cung cấp giao diện đăng nhập hiện đại, rõ ràng, phân định minh bạch giữa 2 phương thức xác thực SSO và Tài khoản Finviet trên cùng một màn hình <code>/signin</code>.",
            "Bảo đảm tính bảo mật đa người thuê (Multi-tenant Isolation): tài khoản thuộc trường học nào tuyệt đối chỉ được truy cập vào đúng phạm vi dữ liệu của trường học đó.",
            "Triệt tiêu nguy cơ rà quét tài khoản (User Enumeration Attacks) thông qua chính sách phản hồi thông báo lỗi an ninh bảo mật chung (Generic Security Error Messages).",
            "Hỗ trợ tìm kiếm trường học thông minh trong danh mục của Sở: tìm kiếm không phân biệt chữ hoa/thường và không dấu với độ trễ phản hồi dưới 50ms.",
            "Thiết lập phiên làm việc an toàn có thời hạn 24 giờ (cả phiên thông thường và phiên 'Nhớ mật khẩu'), hỗ trợ chuyển hướng an toàn theo tham số <code>?next=</code> chống Open-Redirect."
        ],
        "target_users": [
            {"group": "Ban Giám Hiệu / Quản trị viên", "role": "Quản trị cơ sở trường học", "actions": "Đăng nhập điều hành tổng thể, phê duyệt biểu phí, phân quyền nhân sự và cấu hình năm học."},
            {"group": "Giáo viên chủ nhiệm / Bộ môn", "role": "Tác nghiệp chuyên môn hàng ngày", "actions": "Đăng nhập điểm danh học sinh, ghi nhận nhật ký hoạt động, chấm điểm và trao đổi thông tin với phụ huynh."},
            {"group": "Kế toán trường học", "role": "Quản lý tài chính học đường", "actions": "Đăng nhập quản lý danh mục thu, lập và phát hành hóa đơn học phí, đối soát giao dịch ngân hàng."},
            {"group": "Quản trị viên Finviet (Super Admin)", "role": "Hỗ trợ & Vận hành hạ tầng", "actions": "Giám sát lưu lượng xác thực, cấu hình kết nối SSO với các Sở GD&ĐT mới, duy trì chứng chỉ bảo mật."}
        ],
        "glossary": [
            {"term": "SSO (Single Sign-On)", "definition": "Cơ chế đăng nhập một lần cho phép người dùng sử dụng một bộ thông tin định danh (CCCD) của Sở GD&ĐT để đăng nhập vào School Portal."},
            {"term": "HCMEDU SSO", "definition": "Hệ thống xác thực tập trung ngành giáo dục do Sở GD&ĐT TP. Hồ Chí Minh vận hành tại tên miền <code>api.hcm.edu.vn</code>."},
            {"term": "CCCD", "definition": "Căn cước công dân gắn chip gồm đúng 12 chữ số theo tiêu chuẩn định danh quốc gia Việt Nam."},
            {"term": "Multi-tenancy", "definition": "Kiến trúc phần mềm một phiên bản phục vụ nhiều trường học độc lập, cách ly dữ liệu bằng <code>schoolCode</code>."},
            {"term": "JWT (JSON Web Token)", "definition": "Tiêu chuẩn mở (RFC 7519) định nghĩa phương thức truyền tải thông tin xác thực an toàn giữa các bên dưới dạng đối tượng JSON."},
            {"term": "Open-Redirect Attack", "definition": "Lỗ hổng bảo mật cho phép kẻ tấn công lợi dụng tham số chuyển hướng để lừa người dùng sang trang web độc hại bên ngoài."}
        ]
    },

    # 2. Tổng quan nghiệp vụ & Kiến trúc dữ liệu
    "business": {
        "flow_desc": "Mô hình hóa hai luồng xác thực độc lập: Luồng 1 (SSO Sở GD&ĐT qua cổng xác thực tập trung) và Luồng 2 (Tài khoản Finviet cấp qua API nội bộ).",
        "flow_steps": [
            {"actor": "Người dùng", "action": "Truy cập màn hình đăng nhập", "desc": "Truy cập <code>/signin</code>. Nếu đã có phiên làm việc 24h còn hạn, tự động chuyển vào Portal."},
            {"actor": "Người dùng (Luồng SSO)", "action": "Chọn Sở GD&ĐT & Tìm kiếm trường", "desc": "Chọn Sở từ dropdown; gõ tìm kiếm không dấu tên/mã trường trong <code>ComboboxField</code>. Bấm [Đăng nhập SSO]."},
            {"actor": "Cổng SSO Sở", "action": "Xác thực danh tính công dân", "desc": "Người dùng nhập CCCD (12 số) và Mật khẩu tại cổng của Sở. Sở xác thực và cấp mã/token JWT chuyển hướng về Portal."},
            {"actor": "Backend Portal", "action": "Ánh xạ tài khoản & Cấp phiên", "desc": "Kiểm tra chữ ký JWT, khớp CCCD với hồ sơ nhân sự có sẵn của trường (đã đồng bộ từ Sở), cấp phiên 24 giờ."},
            {"actor": "Người dùng (Luồng Tài khoản)", "action": "Nhập mã trường, email & mật khẩu", "desc": "Điền form tài khoản Finviet. Tùy chọn xem mật khẩu và tích chọn 'Nhớ mật khẩu'. Bấm [Đăng nhập]."},
            {"actor": "Backend Portal", "action": "Kiểm tra xác thực & Cấp phiên", "desc": "Xác thực mã trường, email, mật khẩu băm. Hợp lệ: cấp phiên 24h. Thất bại: báo lỗi an ninh chung và xóa ô mật khẩu."}
        ],
        "steps_narrative": [
            "Bước 1: Người dùng truy cập vào liên kết <code>/signin</code> trên trình duyệt web. Nếu trên URL có tham số <code>?method=account</code>, hệ thống kích hoạt sẵn tab Tài khoản; ngược lại mặc định mở tab SSO.",
            "Bước 2 (Luồng SSO): Người dùng chọn Sở GD&ĐT quản lý (mặc định Sở GD&ĐT TP.HCM). Danh sách trường được nạp tương ứng. Người dùng gõ tên hoặc mã trường không dấu vào ô Combobox để chọn trường, sau đó bấm 'Đăng nhập SSO'.",
            "Bước 3 (Luồng SSO): Hệ thống chuyển hướng người dùng sang cổng SSO của Sở GD&ĐT (định dạng chuẩn HCMEDU SSO). Người dùng nhập số CCCD (12 chữ số) và mật khẩu rồi bấm Đăng nhập.",
            "Bước 4 (Luồng SSO): Cổng Sở xác thực thành công và chuyển hướng người dùng quay lại School Portal kèm JWT token. Portal xác thực token, đối chiếu số CCCD với danh sách nhân sự đã có sẵn của trường và khởi tạo phiên làm việc 24 giờ.",
            "Bước 5 (Luồng Tài khoản): Người dùng nhập Mã trường, Email và Mật khẩu do Finviet cấp. Có thể bấm icon mắt để kiểm tra mật khẩu vừa nhập và tích chọn 'Nhớ mật khẩu'.",
            "Bước 6 (Luồng Tài khoản): Bấm nút 'Đăng nhập'. Form chuyển sang trạng thái Loading (nút đổi nhãn 'Đang đăng nhập...'). Hệ thống gọi API xác thực. Nếu thành công, cấp phiên 24 giờ và chuyển vào hệ thống. Nếu thất bại, hiển thị thông báo lỗi bảo mật chung và làm trống ô mật khẩu.",
            "Bước 7: Sau khi đăng nhập thành công ở cả 2 luồng, hệ thống chuyển hướng người dùng vào trang Điểm danh của trường (<code>/{schoolCode}/class/lop-1a1/attendance</code>) hoặc trang đích theo tham số <code>?next=</code> hợp lệ."
        ],
        "rules": [
            {"id": "DN-01", "title": "Chuẩn hóa Mã trường (Tenant Code)", "desc": "Mã trường không phân biệt chữ hoa, chữ thường (<code>case-insensitive</code>) và tự động được cắt bỏ khoảng trắng ở hai đầu (<code>trim</code>). Ví dụ: <code> DEMO </code> được xử lý thành <code>demo</code>."},
            {"id": "DN-02", "title": "Chuẩn hóa Email & Mật khẩu", "desc": "Địa chỉ email tự động chuyển thành chữ thường (<code>lowercase</code>). Mật khẩu <strong>bắt buộc phân biệt chữ hoa và chữ thường</strong> (<code>case-sensitive</code>) nhằm đảm bảo an toàn mật mã học."},
            {"id": "DN-03", "title": "Xác thực tính đầy đủ cục bộ (Form Validation)", "desc": "Nếu người dùng để trống bất kỳ trường thông tin bắt buộc nào (Sở, Trường, Mã trường, Email, Mật khẩu), hệ thống hiển thị thông báo lỗi cục bộ dưới từng ô tương ứng và chưa gửi yêu cầu lên máy chủ."},
            {"id": "DN-04", "title": "Thông báo lỗi an ninh bảo mật chung (Security Generic Error)", "desc": "Khi thông tin đăng nhập không hợp lệ (sai mã trường, sai email, hoặc sai mật khẩu), hệ thống <strong>bắt buộc hiển thị cùng một thông báo lỗi duy nhất</strong>: <em>'Mã trường, email hoặc mật khẩu không chính xác.'</em>. Tuyệt đối không thông báo riêng lẻ 'Email không tồn tại' hay 'Mật khẩu không đúng' nhằm triệt tiêu nguy cơ rà quét tài khoản (User Enumeration Attacks)."},
            {"id": "DN-05", "title": "Thông báo lỗi cổng SSO Sở", "desc": "Tại cổng SSO của Sở, khi người dùng nhập sai thông tin, hiển thị thông báo chung: <em>'Tên tài khoản hoặc mật khẩu không chính xác.'</em>. Tài khoản SSO của trường A tuyệt đối không được phép đăng nhập vào trường B."},
            {"id": "DN-06", "title": "Xóa trắng mật khẩu khi thất bại", "desc": "Sau mỗi lượt đăng nhập không thành công, ô nhập mật khẩu tự động được làm trống (<code>clear</code>) và con trỏ tập trung (focus) trở lại ô mật khẩu để người dùng nhập lại an toàn."},
            {"id": "DN-07", "title": "Chống gửi trùng lặp (Anti Double-Submission)", "desc": "Trong quá trình hệ thống đang xử lý xác thực (in-flight request), toàn bộ các ô nhập dữ liệu và nút bấm đều ở trạng thái <code>disabled</code>, nhãn nút hiển thị <code>Đang đăng nhập...</code> kèm biểu tượng xoay."},
            {"id": "DN-08", "title": "Định dạng số định danh cá nhân CCCD", "desc": "Tên tài khoản tại cổng SSO Sở bắt buộc phải là số Căn cước công dân (CCCD) gồm đúng <strong>12 chữ số</strong> (Regex: <code>^\\d{12}$</code>). Nhập thiếu số, thừa số hoặc chứa chữ cái sẽ bị chặn ngay tại client."},
            {"id": "DN-09", "title": "Thời hạn hiệu lực của phiên làm việc (Session Duration)", "desc": "Phiên làm việc sau khi xác thực thành công (cả phiên thông thường và phiên có tích chọn 'Nhớ mật khẩu') có thời hạn hiệu lực chính xác là <strong>24 giờ (24 hours)</strong>. Sau 24 giờ, phiên tự động hết hạn và điều hướng người dùng về trang đăng nhập."},
            {"id": "DN-10", "title": "Giới hạn số lần thử (Retry Limit)", "desc": "<strong>Không giới hạn (No limit)</strong> số lần thử đăng nhập của người dùng ở phiên bản hiện tại, nhằm hỗ trợ giáo viên và cán bộ nhà trường thuận tiện tác nghiệp trong giờ giảng dạy mà không bị khóa tài khoản đột ngột."},
            {"id": "DN-11", "title": "Ánh xạ tài khoản SSO với dữ liệu trường (Account Provisioning)", "desc": "Toàn bộ các cơ sở trường học được Sở GD&ĐT cấp quyền sử dụng SSO đều đã có sẵn danh mục hồ sơ giáo viên/nhân sự đồng bộ từ CSDL Sở. Cổng Portal tự động khớp số CCCD từ token SSO với hồ sơ nhân sự của trường để cấp quyền tương ứng, không yêu cầu người dùng phải tự đăng ký ngoài luồng."},
            {"id": "DN-12", "title": "Kiến trúc SSO linh hoạt đa Sở (Adaptive SSO Protocol)", "desc": "Ở giai đoạn hiện tại, hệ thống sử dụng giao thức <strong>JWT (JSON Web Token)</strong> đồng nhất với định dạng SSO của Sở GD&ĐT TP.HCM (<code>api.hcm.edu.vn</code>). Tầng xử lý backend áp dụng Adapter Pattern để sẵn sàng cấu hình thêm các giao thức khác (OAuth2/OIDC, SAML) khi tích hợp với các Sở GD&ĐT tỉnh/thành khác trong tương lai khi có đặc tả chi tiết."},
            {"id": "DN-13", "title": "Điều hướng trang sau đăng nhập (Post-Login Redirection)", "desc": "Đăng nhập thành công sẽ đưa người dùng vào trang mặc định: <code>/{schoolCode}/class/lop-1a1/attendance</code> (Điểm danh lớp 1A1). Nếu trên URL có tham số <code>?next=</code> hợp lệ, hệ thống sẽ điều hướng người dùng đến trang đích đó."},
            {"id": "DN-14", "title": "Chống tấn công chuyển hướng ngoài (Open-Redirect Protection)", "desc": "Tham số <code>?next=</code> chỉ được chấp nhận nếu là đường dẫn nội bộ hợp lệ bắt đầu bằng <code>/</code>. Hệ thống tự động từ chối và loại bỏ các URL có dạng <code>//domain.com</code>, <code>http://...</code>, <code>https://...</code>, chứa ký tự <code>\\</code>, hoặc trỏ ngược về <code>/signin</code>, <code>/sso/...</code>."},
            {"id": "DN-15", "title": "Tự động chuyển hướng khi đã có phiên (Active Session Bypass)", "desc": "Khi người dùng đã có phiên hợp lệ truy cập vào <code>/signin</code>, hệ thống tự động kiểm tra và chuyển hướng ngay vào cổng vận hành của trường mà không yêu cầu đăng nhập lại."},
            {"id": "DN-16", "title": "Đăng xuất an toàn (Safe Logout)", "desc": "Nút Đăng xuất trên thanh điều hướng đầu trang (<code>AppHeader</code>) sẽ lập tức xóa sạch token phiên làm việc trên trình duyệt và chuyển hướng người dùng về trang <code>/signin</code>."}
        ],
        "data_entities": [
            {"field": "EducationDepartment", "type": "Interface / Entity", "required": True, "desc": "Thực thể Sở Giáo dục & Đào tạo: <code>{ id, name, portalName, operator, ssoEndpoint }</code>."},
            {"field": "SsoSchool", "type": "Interface / Entity", "required": True, "desc": "Thực thể Trường học trực thuộc Sở: <code>{ id, departmentId, schoolCode, schoolName, csdlCode }</code>."},
            {"field": "SchoolAccount", "type": "Interface / Entity", "required": True, "desc": "Tài khoản Finviet trường học: <code>{ id, schoolCode, schoolName, email, passwordHash, fullName, role, status }</code>."},
            {"field": "SsoAccount", "type": "Interface / Entity", "required": True, "desc": "Tài khoản nhân sự SSO: <code>{ id, departmentId, schoolCode, cccd, passwordHash, fullName, role }</code>."},
            {"field": "AuthSession", "type": "Interface / Entity", "required": True, "desc": "Phiên làm việc người dùng: <code>{ userId, schoolCode, schoolName, email, fullName, role, loginMethod, createdAt, expiresAt }</code> (thời hạn 24 giờ)."}
        ]
    },

    # 3. Đặc tả tính năng & Use Cases chi tiết
    "features": {
        "breakdown": [
            {"epic": "E-007 Xác thực & Phiên làm việc", "feature": "Đăng nhập SSO Sở GD&ĐT", "platform": "Web Portal", "priority": "P0", "story": "Là Giáo viên/Cán bộ trường công lập, tôi muốn đăng nhập bằng tài khoản Sở GD&ĐT để truy cập hệ thống nhanh chóng bằng CCCD.", "jira": "DN-001"},
            {"epic": "E-007 Xác thực & Phiên làm việc", "feature": "Đăng nhập bằng tài khoản Finviet", "platform": "Web Portal", "priority": "P0", "story": "Là Kế toán/Quản trị viên trường học, tôi muốn đăng nhập bằng mã trường và email để làm việc.", "jira": "DN-002"},
            {"epic": "E-007 Xác thực & Phiên làm việc", "feature": "Quản lý phiên làm việc 24h & Đăng xuất an toàn", "platform": "Web Portal", "priority": "P0", "story": "Là Người dùng, tôi muốn phiên đăng nhập được duy trì ổn định 24h và có thể đăng xuất an toàn.", "jira": "DN-003"}
        ],
        "use_cases": [
            {
                "id": "UC-DN-01",
                "name": "Đăng nhập SSO qua cổng Sở GD&ĐT thành công",
                "actor": "Giáo viên / Cán bộ nhân sự thuộc Sở GD&ĐT",
                "pre": "Trường học trực thuộc Sở đã kết nối SSO; Người dùng đã có số CCCD trong danh mục nhân sự nhà trường.",
                "happy_path": [
                    "1. Người dùng truy cập trang <code>/signin</code>, hệ thống kích hoạt sẵn tab 'Đăng nhập SSO'.",
                    "2. Người dùng chọn Sở GD&ĐT (ví dụ: Sở GD&ĐT TP. Hồ Chí Minh).",
                    "3. Trong ô Combobox, người dùng gõ từ khóa không dấu (ví dụ: 'sao mai') và chọn 'Liên cấp PT Sao Mai (74719001)'.",
                    "4. Người dùng bấm nút 'Đăng nhập SSO'.",
                    "5. Hệ thống chuyển hướng sang cổng xác thực SSO Sở (<code>/sso/login</code> hoặc <code>api.hcm.edu.vn</code>).",
                    "6. Người dùng nhập số CCCD (<code>079201001234</code>) và mật khẩu cá nhân, sau đó bấm 'Đăng nhập'.",
                    "7. Cổng SSO xác thực thành công, phát hành JWT token và chuyển hướng về School Portal.",
                    "8. School Portal kiểm tra tính hợp lệ của token, khởi tạo phiên làm việc 24 giờ và đưa người dùng vào trang Điểm danh."
                ],
                "exceptions": [
                    "Người dùng bấm 'Đăng nhập SSO' nhưng chưa chọn trường: Hiển thị cảnh báo đỏ dưới ô nhập và không chuyển trang.",
                    "Người dùng nhập CCCD không đủ 12 chữ số: Báo lỗi 'Số CCCD phải gồm đúng 12 chữ số'.",
                    "Người dùng nhập sai CCCD hoặc mật khẩu: Báo lỗi chung 'Tên tài khoản hoặc mật khẩu không chính xác.'."
                ],
                "post": "Khởi tạo thành công AuthSession có thời hạn 24 giờ; Điều hướng người dùng vào trang tác nghiệp của trường.",
                "rules": "DN-03, DN-05, DN-08, DN-09, DN-11, DN-12, DN-13"
            },
            {
                "id": "UC-DN-02",
                "name": "Đăng nhập bằng tài khoản Finviet thành công",
                "actor": "Quản trị viên / Kế toán / Giáo viên trường học",
                "pre": "Nhà trường và tài khoản người dùng đã được kích hoạt trong cơ sở dữ liệu Finviet.",
                "happy_path": [
                    "1. Người dùng truy cập trang <code>/signin</code>, bấm chọn tab 'Đăng nhập bằng tài khoản'.",
                    "2. Người dùng nhập Mã trường (ví dụ: 'demo'), Email ('admin@demo.edu.vn') và Mật khẩu ('Demo@2026').",
                    "3. (Tùy chọn) Người dùng bấm icon mắt để kiểm tra mật khẩu và tích chọn 'Nhớ mật khẩu'.",
                    "4. Người dùng bấm nút 'Đăng nhập'.",
                    "5. Nút chuyển sang trạng thái Loading 'Đang đăng nhập...', hệ thống gọi API xác thực.",
                    "6. Backend kiểm tra thông tin hợp lệ, cấp phát phiên làm việc 24 giờ.",
                    "7. Hệ thống chuyển hướng người dùng vào trang Điểm danh của trường hoặc trang đích theo <code>?next=</code>."
                ],
                "exceptions": [
                    "Để trống mã trường, email hoặc mật khẩu: Báo lỗi chi tiết dưới từng ô nhập liệu.",
                    "Nhập sai bất kỳ thông tin nào (mã trường, email hoặc mật khẩu): Hiển thị thông báo an ninh chung 'Mã trường, email hoặc mật khẩu không chính xác.' và tự động làm trống ô mật khẩu.",
                    "Người dùng thử lại nhiều lần: Hệ thống không giới hạn số lần thử, người dùng nhập lại mật khẩu đúng và đăng nhập thành công."
                ],
                "post": "Thiết lập AuthSession lưu mã trường, email, vai trò; thời hạn 24 giờ.",
                "rules": "DN-01, DN-02, DN-03, DN-04, DN-06, DN-07, DN-09, DN-10, DN-13, DN-14"
            }
        ]
    },

    # 4. Bảng đặc tả chi tiết giao diện & Trải nghiệm
    "ui": {
        "entry_point": "Truy cập trực tiếp đường dẫn <code>/signin</code> trên trình duyệt web. Hỗ trợ tham số <code>?method=sso|account</code> để kích hoạt sẵn tab tương ứng và tham số <code>?next=/{path}</code> để điều hướng sau đăng nhập.",
        "screens_table": [
            {
                "screen": "Màn hình 1: Tab Đăng nhập SSO (Mặc định)",
                "image": "m7_sm2_tab_sso.png",
                "component": "SegmentedControl & Form SSO",
                "format": "Split Screen (Banner trái 50% + Auth Box phải 50%)",
                "desc": "Bố cục chia đôi hiện đại: Cột trái hiển thị banner 'Giải pháp Chuyển đổi số Giáo dục', hotline 1900 9005; Cột phải hiển thị Logo Finviet, tiêu đề 'Đăng nhập vào trường', tab chuyển đổi SegmentedControl ('Đăng nhập SSO' active), dropdown chọn Sở GD&ĐT và ô ComboboxField chọn trường.",
                "note": "Tuân thủ Design System v1.2.0, banner tự động ẩn dưới 900px."
            },
            {
                "screen": "Màn hình 2: Cảnh báo chưa chọn trường",
                "image": "m7_sm2_sso_error.png",
                "component": "Validation Alert",
                "format": "Inline Error Message",
                "desc": "Khi người dùng bấm 'Đăng nhập SSO' khi chưa chọn trường học, ô nhập chuyển sang viền đỏ (border-danger) và hiển thị thông báo lỗi 'Vui lòng chọn trường học' với icon cảnh báo màu đỏ.",
                "note": "Quy tắc DN-03, chặn chuyển trang."
            },
            {
                "screen": "Màn hình 3: Tìm kiếm trường học không dấu",
                "image": "m7_sm2_sso_search_list.png",
                "component": "ComboboxField Dropdown Popover",
                "format": "Searchable Dropdown Listbox",
                "desc": "Danh sách các trường trực thuộc Sở đã chọn hiển thị nổi. Hỗ trợ bộ gõ tiếng Việt không dấu (ví dụ: gõ 'hoa hong' tìm ra 'Trường MN Hoa Hồng (74718333)'). Hỗ trợ phím mũi tên Lên/Xuống và Enter.",
                "note": "Chuẩn WCAG 2.1 AA Accessibility với ARIA attributes."
            },
            {
                "screen": "Màn hình 4: Trường học đã chọn hợp lệ",
                "image": "m7_sm2_sso_school_selected.png",
                "component": "ComboboxField Selected State",
                "format": "Form Input Validated",
                "desc": "Ô chọn trường hiển thị tên trường học kèm mã định danh trong ngoặc đơn, nút 'Đăng nhập SSO' sẵn sàng kích hoạt chuyển hướng.",
                "note": "Đổi Sở sẽ tự động xóa trường đã chọn."
            },
            {
                "screen": "Màn hình 5: Cổng SSO Sở GD&ĐT",
                "image": "m7_sm2_sso_portal_hcmedu.png",
                "component": "Mock SSO Portal (HCMEDU SSO)",
                "format": "Centered Card Modal Layout",
                "desc": "Giao diện mô phỏng cổng SSO của Sở GD&ĐT (định dạng api.hcm.edu.vn). Hiển thị biểu trưng Sở, tên trường đã chọn, ô nhập Tên tài khoản (*Nhập số CCCD) và ô Mật khẩu.",
                "note": "Quy tắc DN-08, yêu cầu CCCD 12 chữ số."
            },
            {
                "screen": "Màn hình 6: Cảnh báo lỗi cổng SSO Sở",
                "image": "m7_sm2_sso_portal_error.png",
                "component": "SSO Alert Error",
                "format": "Alert Banner",
                "desc": "Khi nhập sai số CCCD hoặc mật khẩu, hệ thống hiển thị thông báo cảnh báo màu đỏ 'Tên tài khoản hoặc mật khẩu không chính xác.' hoặc 'Số CCCD phải gồm đúng 12 chữ số'.",
                "note": "Quy tắc DN-05 và DN-08."
            },
            {
                "screen": "Màn hình 7: Tab Đăng nhập bằng tài khoản",
                "image": "m7_sm2_tab_account.png",
                "component": "Form Đăng nhập Tài khoản",
                "format": "Form Fields (TextField + Checkbox + Button)",
                "desc": "Form gồm 3 ô nhập chuẩn: Mã trường (icon school), Email (icon user), Mật khẩu (icon lock + eye toggle), hộp chọn 'Nhớ mật khẩu' và nút 'Đăng nhập' màu xanh.",
                "note": "100% sử dụng TextField Design System v1.2.0."
            },
            {
                "screen": "Màn hình 8: Kiểm tra tính hợp lệ dữ liệu",
                "image": "m7_sm2_account_validation_errors.png",
                "component": "Form Field Validation Errors",
                "format": "Inline Validation State",
                "desc": "Khi người dùng để trống hoặc nhập sai định dạng email, hệ thống hiển thị thông báo lỗi cụ thể dưới từng ô nhập (ví dụ: 'Vui lòng nhập mã trường', 'Vui lòng nhập email hợp lệ').",
                "note": "Quy tắc DN-03."
            },
            {
                "screen": "Màn hình 9: Thông báo lỗi an ninh bảo mật chung",
                "image": "m7_sm2_account_security_generic_error.png",
                "component": "Security Alert Banner",
                "format": "Top Form Alert Box",
                "desc": "Khi xác thực thất bại (sai mã trường, email hoặc mật khẩu), hệ thống hiển thị hộp cảnh báo màu đỏ với thông điệp chung: 'Mã trường, email hoặc mật khẩu không chính xác.'. Ô mật khẩu tự động làm trống.",
                "note": "Quy tắc DN-04 và DN-06 chống rà quét tài khoản."
            },
            {
                "screen": "Màn hình 10: Tính năng ẩn/hiện mật khẩu",
                "image": "m7_sm2_account_password_revealed.png",
                "component": "Password Visibility Toggle",
                "format": "Interactive Input Suffix Button",
                "desc": "Bấm icon mắt đổi icon sang eye-slash, chuyển kiểu input từ password sang text giúp người dùng kiểm tra mật khẩu đã nhập trước khi bấm Đăng nhập.",
                "note": "Tích hợp sẵn trong TextField Component DS v1.2.0."
            }
        ]
    },

    # 5. Tiêu chí nghiệm thu (Acceptance Criteria - AC)
    "acceptance_criteria": [
        {
            "id": "AC-01",
            "title": "Tải danh sách trường chính xác theo Sở GD&ĐT",
            "scenario": "Given người dùng truy cập màn hình đăng nhập tab SSO\nWhen người dùng chọn 'Sở GD&ĐT TP. Hồ Chí Minh'\nThen danh sách trường chỉ hiển thị các trường thuộc Sở TP.HCM; khi đổi sang Sở khác, trường đã chọn tự động xóa trống."
        },
        {
            "id": "AC-02",
            "title": "Tìm kiếm trường học không dấu trong Combobox",
            "scenario": "Given người dùng mở danh sách chọn trường\nWhen người dùng gõ từ khóa tiếng Việt không dấu 'hoa hong'\nThen kết quả gợi ý hiển thị chính xác 'Trường MN Hoa Hồng (74718333)' trong < 50ms."
        },
        {
            "id": "AC-03",
            "title": "Chặn gửi yêu cầu SSO khi chưa chọn trường",
            "scenario": "Given người dùng chưa chọn trường học\nWhen người dùng bấm nút 'Đăng nhập SSO'\nThen hệ thống hiển thị cảnh báo đỏ 'Vui lòng chọn trường học' dưới ô nhập và không thực hiện chuyển hướng."
        },
        {
            "id": "AC-04",
            "title": "Kiểm tra định dạng số CCCD tại cổng SSO",
            "scenario": "Given người dùng đang ở cổng SSO của Sở\nWhen người dùng nhập số CCCD ít hơn hoặc nhiều hơn 12 chữ số (ví dụ: '12345')\nThen hệ thống báo lỗi 'Số CCCD phải gồm đúng 12 chữ số' và không gửi yêu cầu xác thực."
        },
        {
            "id": "AC-05",
            "title": "Đăng nhập tài khoản với mã trường viết hoa và thừa khoảng trắng",
            "scenario": "Given người dùng nhập mã trường '  DEMO  ', email 'admin@demo.edu.vn', mật khẩu 'Demo@2026'\nWhen người dùng bấm 'Đăng nhập'\nThen hệ thống tự động chuẩn hóa mã trường thành 'demo' và xác thực thành công."
        },
        {
            "id": "AC-06",
            "title": "Thông báo lỗi an ninh bảo mật chung và xóa mật khẩu",
            "scenario": "Given người dùng nhập sai thông tin đăng nhập (mã trường, email hoặc mật khẩu)\nWhen người dùng bấm 'Đăng nhập'\nThen hệ thống hiển thị cùng thông báo 'Mã trường, email hoặc mật khẩu không chính xác.', ô mật khẩu tự động làm trống và con trỏ chuột quay lại ô mật khẩu."
        },
        {
            "id": "AC-07",
            "title": "Không giới hạn số lần thử đăng nhập (No limit)",
            "scenario": "Given người dùng nhập sai thông tin đăng nhập 5 lần liên tiếp\nWhen người dùng nhập đúng thông tin ở lần thứ 6\nThen hệ thống không khóa tài khoản và cho phép đăng nhập thành công bình thường."
        },
        {
            "id": "AC-08",
            "title": "Thời hạn phiên làm việc chính xác 24 giờ",
            "scenario": "Given người dùng đăng nhập thành công vào hệ thống\nWhen phiên làm việc được khởi tạo (kể cả có tích chọn 'Nhớ mật khẩu')\nThen token phiên có thời hạn hiệu lực chính xác 24 giờ; truy cập lại /signin trong vòng 24 giờ tự động vào thẳng hệ thống."
        },
        {
            "id": "AC-09",
            "title": "Chống tấn công chuyển hướng ngoài (Open-Redirect)",
            "scenario": "Given URL đăng nhập có tham số '?next=https://evil.com' hoặc '?next=//malicious.site'\nWhen người dùng đăng nhập thành công\nThen hệ thống tự động loại bỏ URL độc hại và điều hướng an toàn vào trang mặc định '/demo/class/lop-1a1/attendance'."
        },
        {
            "id": "AC-10",
            "title": "Đăng xuất an toàn và xóa phiên",
            "scenario": "Given người dùng đang trong phiên làm việc\nWhen người dùng bấm nút 'Đăng xuất' trên thanh điều hướng\nThen phiên làm việc bị xóa hoàn toàn khỏi trình duyệt và người dùng được chuyển hướng về trang '/signin'."
        }
    ],

    # 6. Yêu cầu phi chức năng (NFR)
    "nfr": {
        "performance": [
            "Thời gian tải trang ban đầu của màn hình `/signin` đạt dưới 1.0 giây trên đường truyền mạng tiêu chuẩn.",
            "Tốc độ lọc tìm kiếm trường học trong `ComboboxField` tức thì với độ trễ phản hồi < 50ms.",
            "Thời gian phản hồi của API xác thực backend < 300ms."
        ],
        "security": [
            "Tuyệt đối không lưu trữ mật khẩu phía trình duyệt dưới bất kỳ hình thức nào (LocalStorage, SessionStorage, Cookies).",
            "Triệt tiêu nguy cơ rà quét tài khoản (User Enumeration Attacks) thông qua thông báo lỗi an ninh bảo mật chung.",
            "Toàn bộ kết nối bắt buộc qua giao thức HTTPS với chứng chỉ SSL/TLS 1.3 và cờ bảo mật HttpOnly, Secure, SameSite=Strict.",
            "Chống tấn công chuyển hướng ngoài (Open-Redirect Protection) bằng việc kiểm duyệt chặt chẽ tham số `?next=`."
        ],
        "design_system": [
            "Tuân thủ nghiêm ngặt Design System `[DS] ECO ME DASHBOARD v1.2.0`.",
            "Sử dụng 100% các thành phần chuẩn: `TextField`, `ComboboxField`, `SegmentedControl`, `Checkbox`, `Button`. Tuyệt đối không dùng thẻ `<input>` thô.",
            "Màu sắc nhận diện thương hiệu chuẩn: Vàng `#FEC020` và Xanh `#0066CC`."
        ]
    }
}

def publish():
    print(f"\n=======================================================")
    print(f"  PUBLISHING PRD M7/SM2: ĐĂNG NHẬP TO CONFLUENCE")
    print(f"  Space: {SPACE_KEY} | Target Page ID: {PAGE_ID}")
    print(f"=======================================================")

    client = ConfluenceClient(BASE_URL, TOKEN, SPACE_KEY)

    # 1. Check existing page
    print(f"\n[1/3] Checking current page status on Confluence...")
    existing = client.get_page(PAGE_ID)
    curr_ver = existing.get("version", {}).get("number", 1)
    title = existing.get("title", "M7 - SM2 - Đăng nhập")
    print(f"  -> Page found: '{title}' (Version: {curr_ver})")

    # 2. Upload Screenshots
    print(f"\n[2/3] Uploading {len(SCREENSHOTS)} Prototype screenshots...")
    for idx, sc in enumerate(SCREENSHOTS, 1):
        src_path = sc["source"]
        tgt_name = sc["target"]
        title_desc = sc["title"]
        if os.path.exists(src_path):
            print(f"  [{idx}/{len(SCREENSHOTS)}] Uploading '{tgt_name}' ({title_desc})...")
            try:
                res = client.upload_attachment(PAGE_ID, src_path, tgt_name)
                print(f"      OK -> Attachment uploaded/updated.")
            except Exception as e:
                print(f"      Warning: upload error: {e}")
        else:
            print(f"  [{idx}/{len(SCREENSHOTS)}] Skipping '{src_path}' (file not found).")
        time.sleep(0.3)

    # 3. Render and Update Page Storage Format
    print(f"\n[3/3] Rendering 8-section XHTML storage format and updating page...")
    storage_html = render_prd_storage_format(m7_sm2_prd_data)
    
    update_res = client.update_page(
        page_id=PAGE_ID,
        title=title,
        parent_id=PARENT_ID,
        html_content=storage_html,
        current_version=curr_ver
    )

    new_ver = update_res.get("version", {}).get("number", curr_ver + 1)
    webui_url = f"{BASE_URL}/pages/viewpage.action?pageId={PAGE_ID}"

    print(f"\n=======================================================")
    print(f"  SUCCESSFULLY PUBLISHED PRD TO CONFLUENCE!")
    print(f"  Page ID: {PAGE_ID}")
    print(f"  Version: {new_ver} (Previous: {curr_ver})")
    print(f"  URL: {webui_url}")
    print(f"=======================================================\n")

if __name__ == "__main__":
    publish()
