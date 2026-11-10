# -*- coding: utf-8 -*-
"""Full generator for tools/confluence/milestone1_data.py containing all 16 Milestone 1 PRDs."""

import json

P1_PRDS = [
    # 1. M6/SM2 - Tài khoản
    {
        "code": "M6/SM2",
        "name": "M6 - SM2 - Tài khoản",
        "parent_module": "M6",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý tài khoản (Account Management)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> chịu trách nhiệm cấp phát, xác thực, phân quyền vai trò và bảo vệ danh tính cho cán bộ quản lý, giáo viên, kế toán và nhân viên nhà trường truy cập vào Portal QLTH.",
            "goals": "Cung cấp công cụ tập trung để Ban Giám hiệu và Quản trị viên cấp tài khoản mới qua email lời mời, phân quyền theo vai trò (Super Admin, Ban Giám Hiệu, Kế Toán, Giáo Viên), quản lý trạng thái hoạt động, khóa/mở khóa tài khoản và thiết lập lại mật khẩu an toàn theo quy định Nghị định 13/2023/NĐ-CP.",
            "scope": "Portal QLTH (Web) - Dành riêng cho nhân sự trường học; liên thông danh tính với hệ sinh thái ECO School và đồng bộ tài khoản từ CSDL Sở GD&ĐT.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M6-cau-hinh/SM2-tai-khoan.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Tài khoản"},
                {"doc": "Nghị định 13/2023/NĐ-CP", "note": "Bảo vệ dữ liệu cá nhân & nhật ký xác thực"},
                {"doc": "Figma Hand-off / Cấu hình Tài khoản", "note": "Wireframe màn hình danh sách, modal tạo tài khoản và phân quyền"}
            ]
        },
        "business": {
            "flow_desc": "Quy trình quản trị tài khoản bắt đầu từ việc tạo thông tin cán bộ, gửi lời mời kích hoạt qua email, người dùng tạo mật khẩu lần đầu và đăng nhập với đúng phân quyền vai trò.",
            "flow_steps": [
                {"actor": "Admin Trường", "action": "Khởi tạo tài khoản", "desc": "Nhập Họ tên, Email, Số điện thoại, Vai trò hệ thống và bấm 'Tạo & Gửi lời mời'."},
                {"actor": "Hệ thống BE", "action": "Gửi email kích hoạt", "desc": "Tạo token kích hoạt duy nhất có thời hạn 48 giờ và gửi email kèm liên kết tạo mật khẩu."},
                {"actor": "Người dùng", "action": "Thiết lập mật khẩu", "desc": "Mở liên kết email, nhập mật khẩu an toàn (tối thiểu 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt)."},
                {"actor": "Portal QLTH", "action": "Cấp phiên làm việc", "desc": "Xác thực JWT/JWE, tải bộ quyền tương ứng theo vai trò và mở giao diện phân hệ được phép."}
            ],
            "steps_narrative": [
                "Quản trị viên truy cập Cấu hình -> Tài khoản, xem danh sách tài khoản theo vai trò và trạng thái.",
                "Bấm 'Thêm tài khoản', nhập đầy đủ thông tin định danh và chọn vai trò phân quyền.",
                "Hệ thống kiểm tra tính duy nhất của Email và Số điện thoại trên toàn hệ thống.",
                "Khi lưu thành công, hệ thống gửi email kích hoạt và tạo bản ghi ở trạng thái 'Chờ kích hoạt'.",
                "Quản trị viên có thể đổi vai trò, bật/tắt trạng thái hoạt động hoặc kích hoạt cấp lại mật khẩu bất kỳ lúc nào."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc Email định danh duy nhất", "desc": "Mỗi tài khoản bắt buộc phải có một địa chỉ Email hợp lệ và duy nhất trên toàn tenant trường học."},
                {"id": "BR-02", "title": "Bảo vệ tài khoản Super-Admin", "desc": "Tài khoản Super-Admin mặc định của hệ thống không thể bị xóa, không thể bị vô hiệu hóa trạng thái và không thể bị hạ cấp quyền."},
                {"id": "BR-03", "title": "Bất biến tài khoản đồng bộ Sở", "desc": "Các tài khoản được đồng bộ từ hệ thống CSDL Sở GD&ĐT (có cờ synced = true) bị khóa cứng trường Họ tên và CCCD; chỉ được đổi vai trò nội bộ trường."},
                {"id": "BR-04", "title": "Thời hạn token kích hoạt", "desc": "Liên kết kích hoạt tài khoản lần đầu và liên kết đặt lại mật khẩu có hiệu lực tối đa 48 giờ kể từ thời điểm phát hành."},
                {"id": "BR-05", "title": "Nguyên tắc vô hiệu hóa tức thời", "desc": "Khi chuyển trạng thái tài khoản sang 'Ngừng hoạt động', tất cả phiên đăng nhập (Active Sessions) của người dùng đó phải bị hủy bỏ ngay lập tức."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-032 Cấu hình tài khoản", "feature": "Danh sách & Lọc tài khoản", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn tìm kiếm và lọc danh sách tài khoản theo vai trò, trạng thái để quản trị nhân sự.", "jira": "TK-001"},
                {"epic": "E-032 Cấu hình tài khoản", "feature": "Thêm mới & Gửi lời mời", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn thêm tài khoản và gửi email lời mời kích hoạt để người dùng tự đặt mật khẩu.", "jira": "TK-002"},
                {"epic": "E-032 Cấu hình tài khoản", "feature": "Phân quyền & Khóa tài khoản", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn chỉnh sửa vai trò hoặc bật/tắt trạng thái hoạt động để đảm bảo an toàn truy cập.", "jira": "TK-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-TK-01",
                    "name": "Admin tạo mới tài khoản và gửi lời mời",
                    "desc": "Tạo tài khoản cán bộ mới và gửi email kích hoạt tự động.",
                    "actor": "Quản trị viên trường",
                    "trigger": "Bấm nút '+ Thêm tài khoản' trên thanh công cụ.",
                    "pre": "Admin đã đăng nhập và có quyền Cấu hình hệ thống.",
                    "happy_path": [
                        "Hệ thống mở modal 'Thêm tài khoản mới'.",
                        "Admin nhập Họ tên, Email, Số điện thoại và chọn vai trò 'Giáo viên'.",
                        "Admin bấm 'Lưu & Gửi lời mời'.",
                        "Hệ thống kiểm tra trùng lặp email và lưu bản ghi vào CSDL.",
                        "Gửi email kích hoạt và hiển thị Toast xanh 'Thêm tài khoản thành công'."
                    ],
                    "exception": [
                        "Email đã tồn tại: Viền đỏ ô Email và thông báo 'Email này đã được sử dụng bởi tài khoản khác'.",
                        "Bỏ trống trường bắt buộc: Hiển thị lỗi validation 'Vui lòng điền thông tin bắt buộc'."
                    ],
                    "post": "Tài khoản mới xuất hiện ở đầu bảng với trạng thái 'Chờ kích hoạt'.",
                    "rules": "BR-01, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/setting/users</code> hoặc menu <strong>CẤU HÌNH &gt; Tài khoản</strong> (icon <code>faUserShield</code>).",
            "list_overview": "Bảng danh sách tài khoản kèm bộ lọc vai trò, ô tìm kiếm từ khóa, nút thêm mới và cột thao tác.",
            "list_fields": [
                {"name": "Họ và tên", "format": "Text + Avatar", "desc": "Hiển thị họ tên kèm mã nhân sự và ảnh đại diện.", "note": "BR-03"},
                {"name": "Tên đăng nhập / Email", "format": "Text", "desc": "Địa chỉ email định danh của người dùng.", "note": "BR-01"},
                {"name": "Vai trò", "format": "Badge", "desc": "Huy hiệu màu sắc: Super Admin (Đỏ), Ban Giám Hiệu (Tím), Kế Toán (Lam), Giáo Viên (Xanh lá).", "note": ""},
                {"name": "Trạng thái", "format": "Toggle Switch", "desc": "Công tắc bật/tắt: Đang hoạt động (Xanh) / Ngừng hoạt động (Xám).", "note": "BR-05"},
                {"name": "Thao tác", "format": "Dropdown Menu (•••)", "desc": "Các nút: 'Chỉnh sửa vai trò', 'Gửi lại lời mời', 'Đặt lại mật khẩu', 'Xóa tài khoản'.", "note": "BR-02"}
            ],
            "form_fields": [
                {"name": "Họ và tên *", "type": "Text Input", "validation": "Bắt buộc, tối đa 100 ký tự tiếng Việt.", "note": "BR-03"},
                {"name": "Địa chỉ Email *", "type": "Email Input", "validation": "Bắt buộc, đúng định dạng email, không trùng lặp.", "note": "BR-01"},
                {"name": "Số điện thoại", "type": "Phone Input", "validation": "Tùy chọn, đúng chuẩn 10 chữ số Việt Nam.", "note": ""},
                {"name": "Vai trò *", "type": "Select Dropdown", "validation": "Bắt buộc chọn 1 vai trò hợp lệ trong danh mục.", "note": ""}
            ],
            "notifications": [
                {"context": "Thêm tài khoản thành công", "type": "Toast (Xanh)", "body": "Đã tạo tài khoản và gửi email lời mời kích hoạt thành công.", "onclick": "Đóng toast."},
                {"context": "Khóa tài khoản nhân viên", "type": "Toast (Cam)", "body": "Đã chuyển trạng thái tài khoản sang Ngừng hoạt động.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Kiểm tra tính duy nhất của Email", "desc": "Khi tạo hoặc chỉnh sửa tài khoản với email đã tồn tại trong cùng trường, hệ thống phải chặn lưu và viền đỏ ô nhập kèm thông báo lỗi cụ thể."},
            {"code": "AC-02", "title": "Bảo vệ tài khoản Super-Admin", "desc": "Nút chuyển trạng thái Toggle và nút xóa trên hàng của tài khoản Super-Admin phải bị vô hiệu hóa hoàn toàn; không xuất hiện popup xác nhận xóa."},
            {"code": "AC-03", "title": "Khóa cứng Họ tên đối với tài khoản đồng bộ Sở", "desc": "Mở modal chỉnh sửa tài khoản có synced = true: trường Họ tên và CCCD ở trạng thái disabled kèm tooltip giải thích 'Dữ liệu được đồng bộ từ CSDL Sở GD&ĐT'."},
            {"code": "AC-04", "title": "Thu hồi phiên đăng nhập ngay khi tài khoản bị khóa", "desc": "Ngay khi Admin tắt Toggle chuyển trạng thái tài khoản sang Ngừng hoạt động, người dùng đó đang mở portal lập tức bị đẩy ra trang Đăng nhập khi thực hiện hành động tiếp theo."}
        ]
    },

    # 2. M7/SM2 - Đăng nhập
    {
        "code": "M7/SM2",
        "name": "M7 - SM2 - Đăng nhập",
        "parent_module": "M7",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Đăng nhập &amp; Xác thực (Authentication &amp; SSO Gateway)</strong> thuộc nhóm <strong>M7: Khác</strong> cung cấp cổng kiểm soát đăng nhập an toàn vào Portal QLTH thông qua 2 cơ chế: Tài khoản trường học và Đăng nhập SSO tập trung của Sở GD&ĐT.",
            "goals": "Bảo vệ toàn vẹn dữ liệu học vụ, xác thực danh tính người dùng đa phương thức, hỗ trợ giáo viên chuyển đổi linh hoạt giữa các trường học thuộc cùng tài khoản, đồng thời tuân thủ quy chuẩn an toàn thông tin của Bộ GD&ĐT.",
            "scope": "Cửa ngõ xác thực duy nhất tại đường dẫn <code>/{schoolCode}/login</code>; xử lý cookie mã hóa JWE, token Laravel Sanctum và tích hợp OIDC/SAML với cổng Sở GD&ĐT.",
            "references": [
                {"doc": "eco_school_ecosystem_source/tools/new_modules.py", "note": "Quy định đặc tả 12 yêu cầu chức năng Đăng nhập & SSO"},
                {"doc": "docs_legacy/operating-portal/00-inventory.md", "note": "Khảo sát luồng đăng nhập legacy portal"}
            ]
        },
        "business": {
            "flow_desc": "Người dùng lựa chọn tab 'Tài khoản' để nhập mật khẩu hoặc tab 'Đăng nhập SSO' để chuyển hướng sang hệ sinh thái xác thực tập trung của ngành giáo dục.",
            "flow_steps": [
                {"actor": "Người dùng", "action": "Truy cập trang đăng nhập", "desc": "Mở URL /{schoolCode}/login, hệ thống tải tên và logo của trường tương ứng."},
                {"actor": "Người dùng", "action": "Nhập thông tin", "desc": "Nhập Email/Username + Mật khẩu (có nút ẩn/hiện) hoặc bấm 'Đăng nhập bằng SSO Sở GD&ĐT'."},
                {"actor": "Auth Engine", "action": "Xác thực danh tính", "desc": "Kiểm tra mật khẩu băm bcrypt hoặc đối soát token phản hồi từ IdP Sở GD&ĐT."},
                {"actor": "Session Manager", "action": "Khởi tạo phiên", "desc": "Ghi cookie HttpOnly bảo mật, phân giải danh sách quyền và điều hướng đến Dashboard phù hợp."}
            ],
            "steps_narrative": [
                "Người dùng truy cập vào trang login có thương hiệu riêng của trường (Logo, Tên trường, Tông màu chủ đạo).",
                "Nếu chọn đăng nhập tài khoản thường: nhập thông tin xác thực, vượt qua kiểm tra chống brute-force và đăng nhập.",
                "Nếu chọn đăng nhập SSO: chuyển hướng sang Identity Provider của Sở GD&ĐT, chọn đơn vị trường công tác và hoàn tất callback.",
                "Hệ thống kiểm tra tài khoản có thuộc nhiều trường hay không; nếu có thì hiển thị màn hình chọn trường làm việc.",
                "Khi bấm 'Đăng xuất', hiển thị hộp thoại xác nhận hủy phiên làm việc an toàn."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo vệ chống Brute-Force", "desc": "Nhập sai mật khẩu liên tiếp 5 lần sẽ khóa tài khoản tạm thời trong vòng 15 phút kèm thông báo cảnh báo bảo mật."},
                {"id": "BR-02", "title": "Thông điệp lỗi bảo mật mờ", "desc": "Khi thông tin đăng nhập sai, hệ thống hiển thị thông báo chung 'Tên đăng nhập hoặc mật khẩu không chính xác' để tránh lộ danh tính tài khoản."},
                {"id": "BR-03", "title": "Cookie bảo mật tuyệt đối", "desc": "Session cookie bắt buộc phải thiết lập các cờ Secure, HttpOnly và SameSite=Lax/Strict, chống tấn công XSS và CSRF."},
                {"id": "BR-04", "title": "Xác thực chuyển đổi trường", "desc": "Trường hợp tài khoản liên kết công tác tại nhiều trường, sau khi xác thực bắt buộc phải chọn trường công tác trước khi truy cập dữ liệu học vụ."},
                {"id": "BR-05", "title": "Hộp thoại xác nhận đăng xuất", "desc": "Bấm nút Đăng xuất bắt buộc hiển thị hộp thoại xác nhận; chọn 'Hủy' giữ nguyên phiên, chọn 'Đăng xuất' lập tức thu hồi token và xóa cookie."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-001 Đăng nhập & Xác thực", "feature": "Đăng nhập Tài khoản thường", "platform": "Portal Web", "priority": "P1", "story": "Là cán bộ trường, tôi muốn đăng nhập bằng Email và Mật khẩu để làm việc trên portal.", "jira": "AUTH-001"},
                {"epic": "E-001 Đăng nhập & Xác thực", "feature": "Đăng nhập SSO Sở GD&ĐT", "platform": "Portal Web", "priority": "P1", "story": "Là giáo viên biên chế, tôi muốn đăng nhập bằng tài khoản CSDL Sở GD&ĐT để đồng bộ dữ liệu giảng dạy.", "jira": "AUTH-002"},
                {"epic": "E-001 Đăng nhập & Xác thực", "feature": "Quên mật khẩu & Đổi mật khẩu", "platform": "Portal Web", "priority": "P1", "story": "Là người dùng, tôi muốn nhận email khôi phục mật khẩu khi quên để tự phục hồi quyền truy cập.", "jira": "AUTH-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-AUTH-01",
                    "name": "Đăng nhập thành công với tài khoản trường",
                    "desc": "Người dùng đăng nhập thành công và được chuyển hướng vào phân hệ phù hợp.",
                    "actor": "Cán bộ / Giáo viên",
                    "trigger": "Bấm nút 'Đăng nhập' trên form.",
                    "pre": "Tài khoản đang ở trạng thái Hoạt động.",
                    "happy_path": [
                        "Nhập email và mật khẩu chính xác.",
                        "Bấm 'Đăng nhập'.",
                        "Hệ thống xác thực thành công, ghi nhận audit log thời gian đăng nhập.",
                        "Tạo session cookie bảo mật và điều hướng tới trang phân hệ đầu tiên người đó được phép truy cập."
                    ],
                    "exception": [
                        "Mật khẩu không đúng: Viền đỏ ô nhập và hiển thị 'Tên đăng nhập hoặc mật khẩu không chính xác'.",
                        "Tài khoản bị khóa: Hiển thị thông báo 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ Quản trị viên trường'."
                    ],
                    "post": "Người dùng truy cập vào Portal với danh sách menu đúng thẩm quyền.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/login</code> trên trình duyệt web.",
            "list_overview": "Giao diện màn hình đăng nhập tối giản gồm khung đăng nhập trung tâm, thương hiệu trường và 2 tab phương thức đăng nhập.",
            "list_fields": [
                {"name": "Logo & Tên trường", "format": "Image + Heading", "desc": "Hiển thị động theo cấu hình trường (School Profile) của schoolCode.", "note": ""},
                {"name": "Tab chọn phương thức", "format": "Tab Header", "desc": "Tab 1: 'Tài khoản trường học', Tab 2: 'Đăng nhập SSO Sở GD&ĐT'.", "note": ""},
                {"name": "Nút hiện/ẩn mật khẩu", "format": "Eye Icon Button", "desc": "Cho phép chuyển đổi giữa dạng dấu chấm (•••) và văn bản rõ.", "note": ""},
                {"name": "Quên mật khẩu", "format": "Hyperlink", "desc": "Mở popup nhập email nhận liên kết khôi phục mật khẩu.", "note": ""}
            ],
            "form_fields": [
                {"name": "Tên đăng nhập / Email *", "type": "Text/Email Input", "validation": "Bắt buộc, không để trống.", "note": ""},
                {"name": "Mật khẩu *", "type": "Password Input", "validation": "Bắt buộc, tối thiểu 6 ký tự.", "note": "BR-01"},
                {"name": "Ghi nhớ đăng nhập", "type": "Checkbox", "validation": "Tùy chọn, duy trì phiên trong 30 ngày nếu chọn.", "note": ""}
            ],
            "notifications": [
                {"context": "Khóa tạm do brute-force", "type": "Alert Banner (Đỏ)", "body": "Bạn đã nhập sai 5 lần. Tài khoản tạm khóa trong 15 phút.", "onclick": "Không."},
                {"context": "Yêu cầu đăng xuất", "type": "Confirmation Modal", "body": "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?", "onclick": "Xác nhận: Hủy phiên; Hủy: Đóng modal."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Bảo vệ thông tin định danh khi đăng nhập thất bại", "desc": "Dù email không tồn tại trong hệ thống hay mật khẩu sai, thông báo lỗi hiển thị luôn là 'Tên đăng nhập hoặc mật khẩu không chính xác'."},
            {"code": "AC-02", "title": "Cơ chế khóa tạm sau 5 lần thất bại", "desc": "Thực hiện nhập sai mật khẩu 5 lần liên tiếp: form đăng nhập bị khóa, nút Đăng nhập disabled kèm bộ đếm lùi thời gian mở khóa 15 phút."},
            {"code": "AC-03", "title": "Chuyển hướng chính xác theo phân quyền vai trò", "desc": "Tài khoản Giáo viên đăng nhập thành công phải được chuyển thẳng đến phân hệ Điểm danh lớp học; tài khoản Kế toán chuyển thẳng đến phân hệ Thu học phí."},
            {"code": "AC-04", "title": "Đăng xuất an toàn tuyệt đối", "desc": "Bấm Đăng xuất và xác nhận: toàn bộ cookie xác thực bị xóa sạch; bấm nút Back trên trình duyệt không thể xem lại các trang quản trị cũ."}
        ]
    },

    # 3. M5/SM13 - Năm học
    {
        "code": "M5/SM13",
        "name": "M5 - SM13 - Năm học",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý năm học &amp; Học kỳ (Academic Year &amp; Terms)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> đóng vai trò là xương sống thời gian học vụ của toàn bộ Portal QLTH, điều chỉnh chu kỳ hoạt động của học sinh, lớp học, sổ điểm và kế hoạch thu học phí.",
            "goals": "Cho phép Ban Giám hiệu thiết lập danh mục năm học (niên khóa), chia tách học kỳ (Học kỳ 1, Học kỳ 2), xác định khoảng thời gian bắt đầu/kết thúc và tự động kích hoạt năm học hiện hành theo thời gian thực.",
            "scope": "Master data nền tảng cho Khối lớp, Lớp học, Học phí, Điểm danh và Thời khóa biểu.",
            "references": [
                {"doc": "docs_legacy/operating-portal/nha-truong/13. nam-hoc.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Năm học"},
                {"doc": "Thông tư số 28/2020/TT-BGDĐT", "note": "Quy định khung kế hoạch thời gian năm học giáo dục phổ thông"}
            ]
        },
        "business": {
            "flow_desc": "Thiết lập niên khóa theo đúng khung năm học của Bộ GD&ĐT, xác định ngày tựu trường, ngày kết thúc năm học và chia tách mốc thời gian 2 học kỳ chính quy.",
            "flow_steps": [
                {"actor": "Ban Giám Hiệu", "action": "Khởi tạo năm học mới", "desc": "Nhập tên niên khóa (ví dụ '2026-2027'), ngày bắt đầu và kết thúc."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra tính hợp lệ", "desc": "Đảm bảo ngày kết thúc sau ngày bắt đầu, không chồng lấn niên khóa."},
                {"actor": "Hệ thống BE", "action": "Đánh giá Năm học hiện tại", "desc": "Tự động gán nhãn '(Hiện tại)' dựa trên ngày hiện tại nằm trong khoảng thời gian của năm học."},
                {"actor": "Portal QLTH", "action": "Cập nhật bộ lọc toàn hệ thống", "desc": "Các phân hệ Điểm danh, Lớp học, Học phí tự động nhận diện năm học hiện hành làm mặc định."}
            ],
            "steps_narrative": [
                "Quản trị viên vào Nhà trường -> Năm học, xem bảng niên khóa sắp xếp niên khóa mới nhất lên đầu.",
                "Bấm '+ Thêm năm học', nhập Tên năm học, Ngày bắt đầu, Ngày kết thúc.",
                "Hệ thống kiểm tra validation và lưu dữ liệu.",
                "Bấm vào biểu tượng Chỉnh sửa inline để điều chỉnh khoảng thời gian nếu có chỉ đạo dời lịch từ Sở.",
                "Niên khóa đã tạo không có nút Xóa để bảo vệ lịch sử dữ liệu học tập và học phí nhiều năm."
            ],
            "rules": [
                {"id": "BR-01", "title": "Tự động đánh giá Năm học hiện tại", "desc": "Hệ thống tự động so sánh ngày thực tế của máy chủ với khoảng [Ngày bắt đầu, Ngày kết thúc] để xác định năm học hiện hành kèm nhãn '(Hiện tại)'."},
                {"id": "BR-02", "title": "Bất biến niên khóa lịch sử (Không có nút Xóa)", "desc": "Các năm học đã phát sinh dữ liệu học sinh, lớp học hoặc học phí tuyệt đối không thể xóa để bảo toàn dữ liệu sổ bộ quốc gia."},
                {"id": "BR-03", "title": "Ràng buộc thời gian kết thúc > bắt đầu", "desc": "Ngày kết thúc niên khóa bắt buộc phải lớn hơn ngày bắt đầu ít nhất 6 tháng đối với năm học chính quy."},
                {"id": "BR-04", "title": "Tối đa 2 học kỳ chính khóa", "desc": "Mỗi năm học quy định chuẩn tối đa 2 học kỳ: Học kỳ 1 và Học kỳ 2; ngày kết thúc Kỳ 1 phải đứng trước ngày bắt đầu Kỳ 2."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-029 Quản lý năm học", "feature": "Danh sách năm học", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem danh sách các niên khóa để nắm bắt chu kỳ đào tạo của trường.", "jira": "NH-001"},
                {"epic": "E-029 Quản lý năm học", "feature": "Thêm & Sửa năm học", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn thêm niên khóa mới và cập nhật thời gian để chuẩn bị cho năm học tiếp theo.", "jira": "NH-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-NH-01",
                    "name": "Tạo niên khóa mới",
                    "desc": "Tạo năm học mới cho trường học.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Bấm nút '+ Thêm năm học'.",
                    "pre": "Đã có quyền quản trị master data.",
                    "happy_path": [
                        "Nhập tên năm học '2026-2027'.",
                        "Chọn Ngày bắt đầu 01/09/2026 và Ngày kết thúc 31/05/2027.",
                        "Bấm 'Lưu lại'.",
                        "Hệ thống lưu thành công và cập nhật lên đầu bảng niên khóa."
                    ],
                    "exception": [
                        "Ngày kết thúc nhỏ hơn ngày bắt đầu: Báo lỗi 'Ngày kết thúc phải lớn hơn ngày bắt đầu'."
                    ],
                    "post": "Năm học mới sẵn sàng để gán cho các khối lớp và biểu phí.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/academic-year</code> hoặc menu <strong>NHÀ TRƯỜNG &gt; Năm học</strong> (icon <code>faCalendarAlt</code>).",
            "list_overview": "Bảng danh sách các niên khóa hiển thị theo thứ tự thời gian mới nhất lên trên, hiển thị nhãn '(Hiện tại)' nổi bật.",
            "list_fields": [
                {"name": "Tên năm học", "format": "Text + Tag", "desc": "Tên niên khóa kèm tag xanh '(Hiện tại)' nếu đang hoạt động.", "note": "BR-01"},
                {"name": "Ngày bắt đầu", "format": "Date (DD/MM/YYYY)", "desc": "Thời điểm khai giảng hoặc bắt đầu năm học.", "note": ""},
                {"name": "Ngày kết thúc", "format": "Date (DD/MM/YYYY)", "desc": "Thời điểm bế giảng hoặc kết thúc năm học.", "note": "BR-03"},
                {"name": "Thao tác", "format": "Action Buttons", "desc": "Nút 'Chỉnh sửa' (faPencil). Không có nút Xóa.", "note": "BR-02"}
            ],
            "form_fields": [
                {"name": "Tên năm học *", "type": "Text Input", "validation": "Bắt buộc, ví dụ '2026-2027'.", "note": ""},
                {"name": "Ngày bắt đầu *", "type": "Date Picker", "validation": "Bắt buộc, đúng định dạng ngày.", "note": ""},
                {"name": "Ngày kết thúc *", "type": "Date Picker", "validation": "Bắt buộc, phải sau Ngày bắt đầu.", "note": "BR-03"}
            ],
            "notifications": [
                {"context": "Thêm năm học thành công", "type": "Toast (Xanh)", "body": "Đã thêm niên khóa mới thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Tự động đánh dấu Năm học hiện tại", "desc": "Hệ thống tự động hiển thị tag xanh lá '(Hiện tại)' cạnh tên niên khóa nếu ngày hiện tại của hệ thống nằm trong khoảng thời gian hiệu lực."},
            {"code": "AC-02", "title": "Tuyệt đối không hiển thị nút Xóa", "desc": "Kiểm tra toàn bộ các hàng trên bảng năm học: không có bất kỳ nút Xóa hoặc icon thùng rác nào xuất hiện."},
            {"code": "AC-03", "title": "Chặn lưu khoảng thời gian đảo ngược", "desc": "Nhập ngày kết thúc đứng trước ngày bắt đầu và bấm Lưu: form phải chặn lại kèm thông báo cảnh báo 'Ngày kết thúc không thể trước ngày bắt đầu'."}
        ]
    }
]

# We import the remaining 13 from helper script or inline
from build_milestone1 import SUBMODULES_4_TO_16
P1_PRDS.extend(SUBMODULES_4_TO_16)

# Now we append the rest of Milestone 1: 8 to 16
REST_8_TO_16 = [
    # 8. M5/SM12 - Lịch sự kiện
    {
        "code": "M5/SM12",
        "name": "M5 - SM12 - Lịch sự kiện",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý lịch sự kiện &amp; Ngày nghỉ (School Event &amp; Holiday Calendar)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm công bố lịch hoạt động, các mốc sự kiện quan trọng và danh mục các ngày nghỉ lễ toàn trường.",
            "goals": "Lập kế hoạch sự kiện trường học, thông báo ngày hội/lịch thi đến toàn thể phụ huynh và giáo viên, đồng thời cung cấp căn cứ trừ số ngày ăn bán trú tự động cho phân hệ Thu học phí M4/SM1.",
            "scope": "Cung cấp master data ngày nghỉ học cho phân hệ Điểm danh (M2/SM1) và phân hệ Học phí (M4/SM1).",
            "references": [
                {"doc": "docs_legacy/operating-portal/nha-truong/12. lich-su-kien.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Lịch sự kiện"},
                {"doc": "Bộ Luật Lao động 2019", "note": "Quy định ngày nghỉ lễ tết quốc gia"}
            ]
        },
        "business": {
            "flow_desc": "Khởi tạo sự kiện năm học, đánh dấu cờ 'Ngày nghỉ toàn trường', tự động loại trừ ngày ăn và phát thông báo trên ứng dụng phụ huynh.",
            "flow_steps": [
                {"actor": "BGH", "action": "Tạo sự kiện mới", "desc": "Nhập Tiêu đề, Ngày diễn ra, Địa điểm, Đối tượng tham gia và chọn cờ 'Học sinh được nghỉ'."},
                {"actor": "Hệ thống BE", "action": "Khóa ngày điểm danh", "desc": "Đánh dấu ngày nghỉ học trên lịch điểm danh toàn trường."},
                {"actor": "Module M4/SM1", "action": "Tính trừ tiền ăn", "desc": "Tự động trừ số ngày nghỉ này ra khỏi tổng số ngày ăn của tháng khi tính hóa đơn bán trú."},
                {"actor": "App ECO Me", "action": "Hiển thị lịch phụ huynh", "desc": "Phụ huynh mở ứng dụng thấy sự kiện nổi bật trên lịch tuần."}
            ],
            "steps_narrative": [
                "BGH vào Nhà trường -> Lịch sự kiện, xem lịch dạng Lưới tháng hoặc Danh sách.",
                "Bấm '+ Tạo sự kiện', điền thông tin và đính kèm thông báo nếu có.",
                "Chọn loại sự kiện: 'Nghỉ lễ/Tết', 'Hoạt động ngoại khóa', 'Thi học kỳ', 'Họp phụ huynh'.",
                "Lưu sự kiện: hệ thống gửi thông báo đẩy đến phụ huynh và giáo viên."
            ],
            "rules": [
                {"id": "BR-01", "title": "Loại trừ ngày ăn bán trú tự động", "desc": "Sự kiện được đánh dấu cờ 'Nghỉ học' sẽ tự động bị loại trừ khỏi số ngày ăn định mức tháng khi phân hệ Học phí M4 tính toán hóa đơn tiền ăn."},
                {"id": "BR-02", "title": "Phạm vi đối tượng tham gia", "desc": "Sự kiện có thể áp dụng toàn trường, theo từng khối lớp hoặc theo lớp học cụ thể."},
                {"id": "BR-03", "title": "Thời gian không chồng lấn vô lý", "desc": "Ngày kết thúc sự kiện phải lớn hơn hoặc bằng ngày bắt đầu."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-028 Lịch sự kiện", "feature": "Lịch sự kiện & Ngày nghỉ", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem lịch sự kiện năm học trên giao diện lịch trực quan.", "jira": "SK-001"},
                {"epic": "E-028 Lịch sự kiện", "feature": "Tạo & Công bố sự kiện", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn tạo ngày nghỉ lễ để hệ thống tự động trừ tiền ăn trên hóa đơn.", "jira": "SK-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-SK-01",
                    "name": "Tạo ngày nghỉ lễ Tết",
                    "desc": "Thêm lịch nghỉ Tết Nguyên đán toàn trường.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Bấm nút '+ Thêm sự kiện'.",
                    "pre": "Đã chọn năm học hiện hành.",
                    "happy_path": [
                        "Nhập tiêu đề 'Nghỉ Tết Nguyên Đán'.",
                        "Chọn khoảng ngày từ 01/02/2027 đến 14/02/2027.",
                        "Tích chọn 'Học sinh được nghỉ học'.",
                        "Bấm 'Lưu và Công bố'.",
                        "Hệ thống lưu thành công và cập nhật lên lịch."
                    ],
                    "exception": [
                        "Ngày kết thúc nhỏ hơn ngày bắt đầu: Báo lỗi validation."
                    ],
                    "post": "Các ngày trong khoảng tự động loại trừ khỏi số ngày ăn của tháng 2.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/calendar</code> hoặc menu <strong>NHÀ TRƯỜNG &gt; Lịch sự kiện</strong> (icon <code>faCalendarCheck</code>).",
            "list_overview": "Giao diện chuyển đổi linh hoạt giữa dạng Lịch tháng (Calendar Grid) và Danh sách (List view).",
            "list_fields": [
                {"name": "Tên sự kiện", "format": "Text (Bold)", "desc": "Tiêu đề sự kiện hoặc ngày nghỉ lễ.", "note": ""},
                {"name": "Thời gian", "format": "Date Range", "desc": "Từ ngày - Đến ngày.", "note": "BR-03"},
                {"name": "Loại sự kiện", "format": "Badge", "desc": "Nghỉ lễ (Đỏ), Ngoại khóa (Xanh), Họp PH (Vàng).", "note": "BR-01"},
                {"name": "Đối tượng", "format": "Text", "desc": "Toàn trường, Khối 1, Khối 2...", "note": "BR-02"},
                {"name": "Thao tác", "format": "Action Buttons", "desc": "Chỉnh sửa, Xóa sự kiện.", "note": ""}
            ],
            "form_fields": [
                {"name": "Tiêu đề sự kiện *", "type": "Text Input", "validation": "Bắt buộc, tối đa 150 ký tự.", "note": ""},
                {"name": "Từ ngày *", "type": "Date Picker", "validation": "Bắt buộc.", "note": ""},
                {"name": "Đến ngày *", "type": "Date Picker", "validation": "Bắt buộc, >= Từ ngày.", "note": "BR-03"},
                {"name": "Học sinh được nghỉ học", "type": "Checkbox", "validation": "Tích chọn để tự động trừ tiền ăn.", "note": "BR-01"}
            ],
            "notifications": [
                {"context": "Công bố sự kiện", "type": "Push Notification", "body": "Nhà trường thông báo lịch nghỉ Tết Nguyên Đán từ 01/02 đến 14/02.", "onclick": "Mở xem chi tiết sự kiện."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Khấu trừ số ngày ăn bán trú", "desc": "Sự kiện được tích 'Học sinh được nghỉ học': tháng diễn ra sự kiện tự động giảm số ngày ăn tương ứng khi Kế toán tạo đợt thu học phí."},
            {"code": "AC-02", "title": "Khóa điểm danh vào ngày nghỉ lễ", "desc": "Vào các ngày nghỉ lễ đã công bố, giao diện điểm danh lớp học tự động hiển thị trạng thái 'Ngày nghỉ lễ toàn trường' và không cho phép điểm danh."}
        ]
    },

    # 9. M6/SM3 - Học phí (Cấu hình học phí)
    {
        "code": "M6/SM3",
        "name": "M6 - SM3 - Học phí",
        "parent_module": "M6",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Cấu hình học phí (Tuition & Gateway Settings)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> chịu trách nhiệm thiết lập thông tin tài khoản ngân hàng thụ hưởng, kết nối cổng thanh toán trực tuyến, cấu hình mẫu hóa đơn điện tử và các tham số tài chính của trường.",
            "goals": "Cung cấp nền tảng tích hợp ngân hàng và cổng thanh toán tự động (QR EcoPay, Sepay, Ví Finviet), cấu hình xuất hóa đơn điện tử (VNPT / Viettel / MISA) và thiết lập email tiếp nhận báo cáo đối soát doanh thu.",
            "scope": "Điều kiện tiên quyết bắt buộc để phân hệ Tài chính M4 vận hành các luồng thu học phí, xuất hóa đơn và đối soát.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M6-cau-hinh/SM3-hoc-phi.md", "note": "Đặc tả nghiệp vụ legacy Cấu hình học phí"},
                {"doc": "Nghị định 123/2020/NĐ-CP & Thông tư 78/2021/TT-BTC", "note": "Quy định hóa đơn, chứng từ điện tử"}
            ]
        },
        "business": {
            "flow_desc": "Kế toán trưởng thiết lập tài khoản ngân hàng của trường, kích hoạt cổng thanh toán QR động và kiểm tra kết nối xuất hóa đơn điện tử.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Thiết lập tài khoản ngân hàng", "desc": "Nhập Số tài khoản, Chủ tài khoản, chọn Ngân hàng (Vietcombank, BIDV, MB...) và Chi nhánh."},
                {"actor": "Hệ thống BE", "action": "Xác thực tài khoản", "desc": "Tích hợp VietQR kiểm tra tính hợp lệ của tài khoản thụ hưởng."},
                {"actor": "Kế toán", "action": "Cấu hình cổng thanh toán", "desc": "Bật cổng QR EcoPay, nhập API Key và Secret do Finviet cấp."},
                {"actor": "Kế toán", "action": "Cấu hình hóa đơn điện tử", "desc": "Nhập thông tin tài khoản nhà cung cấp HĐĐT (Ký hiệu, Mẫu số, Tài khoản dịch vụ)."}
            ],
            "steps_narrative": [
                "Kế toán vào Cấu hình -> Học phí.",
                "Điền thông tin Tài khoản ngân hàng nhận tiền học phí.",
                "Cấu hình Cú pháp chuyển khoản chuẩn: [MãTrường] [MãHọcSinh] [ThángThu].",
                "Thiết lập Email nhận sao kê và báo cáo đối soát định kỳ hàng ngày.",
                "Bấm 'Lưu cấu hình', hệ thống kiểm tra và kích hoạt cổng thanh toán."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc 1 tài khoản thụ hưởng chính", "desc": "Mỗi trường học bắt buộc phải kích hoạt 1 tài khoản ngân hàng chính thức để tạo mã QR thanh toán trên hóa đơn học sinh."},
                {"id": "BR-02", "title": "Cú pháp chuyển khoản định danh", "desc": "Nội dung chuyển khoản trên mã VietQR bắt buộc chứa Mã học sinh để hệ thống Webhook tự động gạch nợ hóa đơn chính xác 100%."},
                {"id": "BR-03", "title": "Bảo mật thông tin API Key cổng thanh toán", "desc": "Các khóa bí mật (Secret Key) kết nối cổng thanh toán và HĐĐT được mã hóa lưu trữ và che dấu bằng ký tự hoa thị (••••••••)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-031 Cấu hình học phí", "feature": "Tài khoản ngân hàng thụ hưởng", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn cấu hình số tài khoản ngân hàng trường để phụ huynh quét mã chuyển khoản.", "jira": "CH-HP-001"},
                {"epic": "E-031 Cấu hình học phí", "feature": "Cấu hình cổng thanh toán & HĐĐT", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn kết nối cổng thanh toán tự động để gạch nợ hóa đơn không cần nhập tay.", "jira": "CH-HP-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-CH-HP-01",
                    "name": "Cấu hình tài khoản ngân hàng trường",
                    "desc": "Kế toán thiết lập tài khoản nhận tiền học phí.",
                    "actor": "Kế toán trưởng",
                    "trigger": "Bấm nút 'Chỉnh sửa' tại mục Tài khoản ngân hàng.",
                    "pre": "Đã có thông tin tài khoản ngân hàng chính thức của trường.",
                    "happy_path": [
                        "Chọn ngân hàng 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)'.",
                        "Nhập Số tài khoản '0123456789'.",
                        "Nhập Tên chủ tài khoản 'TRUONG TIEU HOC ECO SCHOOL'.",
                        "Bấm 'Lưu thông tin'.",
                        "Hệ thống lưu thành công và hiển thị bản xem trước mã VietQR mẫu."
                    ],
                    "exception": [
                        "Số tài khoản chứa chữ cái: Báo lỗi 'Số tài khoản chỉ bao gồm chữ số'."
                    ],
                    "post": "Tất cả hóa đơn phát hành sau đó sẽ mang thông tin tài khoản này.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/setting/fee</code> hoặc menu <strong>CẤU HÌNH &gt; Học phí</strong> (icon <code>faFileInvoiceDollar</code>).",
            "list_overview": "Màn hình cấu hình chia làm 3 khối chức năng: (1) Tài khoản ngân hàng & VietQR, (2) Cổng thanh toán trực tuyến, (3) Hóa đơn điện tử & Đối soát.",
            "list_fields": [
                {"name": "Ngân hàng thụ hưởng", "format": "Text + Logo", "desc": "Tên ngân hàng và logo VietQR.", "note": "BR-01"},
                {"name": "Số tài khoản", "format": "Text (Bold)", "desc": "Số tài khoản nhận tiền học phí.", "note": "BR-01"},
                {"name": "Chủ tài khoản", "format": "Text (Uppercase)", "desc": "Tên pháp nhân chủ tài khoản.", "note": ""},
                {"name": "Cổng thanh toán QR EcoPay", "format": "Toggle Switch", "desc": "Trạng thái bật/tắt cổng thanh toán trực tuyến.", "note": "BR-03"},
                {"name": "Email nhận đối soát", "format": "Email text", "desc": "Địa chỉ email kế toán nhận báo cáo phiên đối soát.", "note": ""}
            ],
            "form_fields": [
                {"name": "Ngân hàng *", "type": "Select Dropdown (Searchable)", "validation": "Bắt buộc chọn trong danh mục Napas.", "note": "BR-01"},
                {"name": "Số tài khoản *", "type": "Text Input", "validation": "Bắt buộc, chữ số.", "note": "BR-01"},
                {"name": "Chủ tài khoản *", "type": "Text Input (Auto Uppercase)", "validation": "Bắt buộc, viết hoa không dấu.", "note": ""},
                {"name": "Cú pháp chuyển khoản *", "type": "Text Template", "validation": "Bắt buộc chứa thẻ {studentCode}.", "note": "BR-02"}
            ],
            "notifications": [
                {"context": "Lưu cấu hình học phí", "type": "Toast (Xanh)", "body": "Đã cập nhật thông tin tài khoản và cổng thanh toán thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Bắt buộc định dạng VietQR chuẩn", "desc": "Lưu tài khoản ngân hàng thành công: hệ thống tạo thử nghiệm mã VietQR quét được chính xác số tài khoản và ngân hàng thụ hưởng."},
            {"code": "AC-02", "title": "Ẩn mã khóa bí mật (Secret Key)", "desc": "Các trường Secret Key kết nối cổng thanh toán phải được ẩn dạng password và có nút con mắt (faEye) để xem lại khi cần xác thực."}
        ]
    },

    # 10. M6/SM1 - Trường (Cấu hình trường)
    {
        "code": "M6/SM1",
        "name": "M6 - SM1 - Trường",
        "parent_module": "M6",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Thông tin &amp; Hồ sơ trường học (School Profile &amp; Operating Config)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> định danh pháp lý và quy chuẩn vận hành của nhà trường trên môi trường số.",
            "goals": "Quản lý thông tin thương hiệu (Tên trường, Logo, Website, Hotline, Địa chỉ), cấp học đào tạo (Mầm non, Tiểu học, THCS, THPT), cấu hình các ngày làm việc/học tập trong tuần và thời gian đón trả học sinh hàng ngày.",
            "scope": "Master data thiết lập thương hiệu cho trang Đăng nhập, Phiếu thu học phí, Báo cáo học vụ và giao diện ứng dụng phụ huynh.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M6-cau-hinh/SM1-truong.md", "note": "Đặc tả nghiệp vụ legacy Hồ sơ trường"},
                {"doc": "Điều lệ trường học các cấp", "note": "Quy định thông tin cơ sở giáo dục"}
            ]
        },
        "business": {
            "flow_desc": "Thiết lập hồ sơ trường học, tải logo thương hiệu, chọn cấp học và cấu hình ngày làm việc trong tuần.",
            "flow_steps": [
                {"actor": "Admin Trường", "action": "Truy cập thông tin trường", "desc": "Mở tab Thông tin trường, kiểm tra các trường dữ liệu định danh."},
                {"actor": "Admin Trường", "action": "Tải logo trường", "desc": "Tải tệp ảnh PNG/JPG sắc nét, kích thước tối đa 2MB."},
                {"actor": "Admin Trường", "action": "Cấu hình tuần làm việc", "desc": "Chọn các ngày học trong tuần: Thứ 2 đến Thứ 6 hoặc bao gồm cả Thứ 7."},
                {"actor": "Hệ thống BE", "action": "Đồng bộ thương hiệu", "desc": "Cập nhật logo và tên trường lên Header Portal, hóa đơn học phí và trang Login."}
            ],
            "steps_narrative": [
                "Admin vào Cấu hình -> Trường.",
                "Cập nhật Tên trường, Mã định danh trường (schoolCode), Số điện thoại liên hệ, Email văn phòng.",
                "Chọn Cấp học mà trường đang đào tạo (có thể chọn nhiều cấp học đối với trường liên cấp).",
                "Thiết lập Ngày học trong tuần (Thứ 2 - Thứ 6; Thứ 7 có học hay không). Phân hệ Điểm danh sẽ căn cứ vào đây để mở sổ điểm danh.",
                "Bấm 'Lưu thông tin'."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bất biến mã trường (schoolCode)", "desc": "Mã trường (schoolCode) là tiền tố đường dẫn duy nhất (URL path prefix) của tenant, không thể thay đổi sau khi khởi tạo hệ thống."},
                {"id": "BR-02", "title": "Quy chuẩn ngày học trong tuần", "desc": "Ngày học được cấu hình là ngày hoạt động bắt buộc; các ngày không được chọn (ví dụ: Chủ nhật) sẽ tự động khóa sổ điểm danh."},
                {"id": "BR-03", "title": "Định dạng logo thương hiệu", "desc": "Logo trường phải có tỷ lệ vuông hoặc chữ nhật tiêu chuẩn (1:1 hoặc 4:3), định dạng PNG/JPG/WEBP, dung lượng tối đa 2MB."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-030 Hồ sơ trường", "feature": "Thông tin pháp lý & Thương hiệu", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn cấu hình tên trường, logo và địa chỉ để hiển thị trên toàn bộ báo cáo và hóa đơn.", "jira": "TR-001"},
                {"epic": "E-030 Hồ sơ trường", "feature": "Cấu hình ngày học trong tuần", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn thiết lập các ngày học trong tuần để phân hệ điểm danh mở sổ đúng lịch.", "jira": "TR-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-TR-01",
                    "name": "Cập nhật logo và ngày học",
                    "desc": "Cập nhật logo trường và thiết lập ngày học.",
                    "actor": "Admin Trường",
                    "trigger": "Bấm 'Lưu thay đổi' trên trang Thông tin trường.",
                    "pre": "Đã có quyền Admin hệ thống.",
                    "happy_path": [
                        "Tải ảnh logo trường mới 'logo-ecoschool.png'.",
                        "Tích chọn các ngày học từ 'Thứ Hai' đến 'Thứ Sáu'.",
                        "Bấm 'Lưu thay đổi'.",
                        "Hệ thống cập nhật logo lên thanh Header và báo toast xanh 'Cập nhật thông tin trường thành công'."
                    ],
                    "exception": [
                        "Ảnh vượt dung lượng 2MB: Báo lỗi 'Kích thước tệp vượt quá 2MB'."
                    ],
                    "post": "Logo và thương hiệu mới hiển thị đồng bộ trên toàn bộ portal.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/setting/school</code> hoặc menu <strong>CẤU HÌNH &gt; Trường</strong> (icon <code>faSchool</code>).",
            "list_overview": "Giao diện cấu hình dạng hồ sơ gồm: Khung ảnh logo trường, Thông tin liên hệ chung, Danh mục cấp học và Bảng chọn ngày làm việc trong tuần.",
            "list_fields": [
                {"name": "Tên trường", "format": "Text (Bold)", "desc": "Tên trường chính thức (ví dụ: Trường Tiểu Học Eco School).", "note": ""},
                {"name": "Mã trường", "format": "Badge / Code", "desc": "Mã tenant (ví dụ: demo, th-ecoschool).", "note": "BR-01"},
                {"name": "Cấp học", "format": "Tag list", "desc": "Các cấp học: Mầm non, Tiểu học, THCS, THPT.", "note": ""},
                {"name": "Ngày học trong tuần", "format": "Checklist", "desc": "Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7.", "note": "BR-02"},
                {"name": "Logo", "format": "Image Preview", "desc": "Xem trước logo hiển thị trên nền sáng.", "note": "BR-03"}
            ],
            "form_fields": [
                {"name": "Tên trường học *", "type": "Text Input", "validation": "Bắt buộc, tối đa 200 ký tự.", "note": ""},
                {"name": "Địa chỉ trường *", "type": "Text Input", "validation": "Bắt buộc, địa chỉ đầy đủ.", "note": ""},
                {"name": "Số hotline liên hệ *", "type": "Phone Input", "validation": "Bắt buộc, số điện thoại hợp lệ.", "note": ""},
                {"name": "Tải logo mới", "type": "File Dropzone", "validation": "Định dạng PNG/JPG, dung lượng <= 2MB.", "note": "BR-03"}
            ],
            "notifications": [
                {"context": "Lưu hồ sơ trường", "type": "Toast (Xanh)", "body": "Đã lưu thông tin hồ sơ trường học thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Khóa cứng trường Mã trường", "desc": "Trường Mã trường (schoolCode) ở chế độ readonly và không có cách nào sửa đổi được trên giao diện web."},
            {"code": "AC-02", "title": "Đồng bộ logo lên toàn bộ giao diện", "desc": "Thay đổi logo trường và lưu thành công: thanh Header bên trái lập tức hiển thị logo mới mà không cần đăng nhập lại."}
        ]
    },

    # 11. M4/SM3 - Khoản phí
    {
        "code": "M4/SM3",
        "name": "M4 - SM3 - Khoản phí",
        "parent_module": "M4",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Danh mục khoản phí (Fee Catalog Master)</strong> thuộc nhóm <strong>M4: Tài chính</strong> quản lý toàn bộ biểu phí định mức thu của nhà trường (Học phí, Tiền ăn, Tiền xe bus, Cơ sở vật chất, Học liệu, Ngoại khóa).",
            "goals": "Xây dựng danh mục các khoản thu chuẩn hóa, quy định đơn vị tính (Tháng, Ngày, Năm, Lần, Chuyến), tính chất bắt buộc hoặc tùy chọn, và cờ chỉ định xuất hóa đơn điện tử phục vụ quản trị doanh thu.",
            "scope": "Master data danh mục thu cho Quản lý học phí (M4/SM4) và Hóa đơn học sinh (M4/SM1).",
            "references": [
                {"doc": "docs_legacy/operating-portal/tai-chinh/khoan-phi.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Khoản phí"},
                {"doc": "Nghị định 81/2021/NĐ-CP", "note": "Cơ chế thu, quản lý học phí và các khoản dịch vụ giáo dục"}
            ]
        },
        "business": {
            "flow_desc": "Kế toán thiết lập danh mục các khoản phí áp dụng cho năm học, xác định đơn giá định mức, đơn vị tính và cờ xuất HĐĐT.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Thêm khoản phí mới", "desc": "Nhập Tên khoản phí, chọn Đơn vị tính (Tháng/Ngày/Lần/Năm), Số tiền mặc định và Loại khoản (Bắt buộc/Tùy chọn)."},
                {"actor": "Kế toán", "action": "Bật cờ Xuất HĐĐT", "desc": "Chọn cờ 'Xuất hóa đơn điện tử': Có hoặc Không."},
                {"actor": "Hệ thống BE", "action": "Hiển thị popup xác nhận", "desc": "Yêu cầu kế toán xác nhận việc thay đổi cờ Xuất HĐĐT theo quy định an toàn thuế."},
                {"actor": "Module M4/SM4", "action": "Kế thừa khoản phí", "desc": "Khoản phí mới sẵn sàng để gán vào ma trận học phí của các lớp học."}
            ],
            "steps_narrative": [
                "Kế toán vào Tài chính -> Khoản phí.",
                "Tra cứu danh mục khoản phí theo Đơn vị tính và từ khóa tìm kiếm.",
                "Bấm '+ Thêm khoản phí', nhập tên khoản, số tiền và đơn vị tính.",
                "Bật cờ 'Xuất HĐĐT': hiển thị modal xác nhận an toàn.",
                "Khoản phí đã phát sinh hóa đơn thu tiền sẽ bị khóa xóa; chỉ được phép tạm dừng hoạt động."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc xác nhận khi đổi cờ Xuất HĐĐT", "desc": "Hành động chuyển đổi cờ 'Xuất HĐĐT' (Có <-> Không) bắt buộc phải hiển thị popup modal xác nhận trước khi lưu vào CSDL."},
                {"id": "BR-02", "title": "Bảo vệ xóa khoản phí đã sử dụng", "desc": "Khoản phí đã được gán cho bất kỳ lớp học nào hoặc đã từng phát sinh hóa đơn thanh toán tuyệt đối không được phép xóa."},
                {"id": "BR-03", "title": "Đơn vị tính chuẩn hóa", "desc": "Hệ thống chuẩn hóa danh mục đơn vị tính gồm: 'Tháng', 'Ngày', 'Năm', 'Lần', 'Chuyến', 'Bộ', 'Giờ', 'Khác'."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-010 Quản lý khoản phí", "feature": "Danh mục & Lọc khoản phí", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xem danh mục biểu phí kèm đơn vị tính và cờ HĐĐT.", "jira": "KP-001"},
                {"epic": "E-010 Quản lý khoản phí", "feature": "Thêm mới & Cập nhật cờ HĐĐT", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn thêm khoản thu mới và xác nhận xuất HĐĐT an toàn.", "jira": "KP-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-KP-01",
                    "name": "Thêm khoản phí và bật xuất HĐĐT",
                    "desc": "Tạo khoản thu học phí chính quy mới.",
                    "actor": "Kế toán trường",
                    "trigger": "Bấm nút '+ Thêm khoản phí'.",
                    "pre": "Đã có quyền quản trị tài chính.",
                    "happy_path": [
                        "Nhập Tên khoản phí 'Tiền ăn bán trú'.",
                        "Chọn Đơn vị tính 'Ngày'.",
                        "Nhập Số tiền '35.000'.",
                        "Tích chọn 'Xuất HĐĐT: Có'.",
                        "Hệ thống hiển thị popup 'Xác nhận xuất HĐĐT cho khoản phí này?'.",
                        "Kế toán bấm 'Xác nhận'.",
                        "Hệ thống lưu thành công và hiển thị toast xanh."
                    ],
                    "exception": [
                        "Số tiền âm: Báo lỗi 'Số tiền phải lớn hơn 0'."
                    ],
                    "post": "Khoản phí mới sẵn sàng để gán cho lớp học.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/school-fees</code> hoặc menu <strong>TÀI CHÍNH &gt; Khoản phí</strong> (icon <code>faTags</code>).",
            "list_overview": "Bảng danh mục biểu phí toàn trường kèm bộ lọc Đơn vị tính, sắp xếp cột theo đơn vị tính và cột thao tác.",
            "list_fields": [
                {"name": "Tên khoản phí", "format": "Text (Bold)", "desc": "Ví dụ: Học phí chính khóa, Tiền ăn, Xe đưa đón...", "note": ""},
                {"name": "Số tiền mặc định", "format": "Currency (VNĐ)", "desc": "Định dạng dấu chấm phân cách hàng nghìn (ví dụ: 3.500.000 đ).", "note": ""},
                {"name": "Đơn vị tính", "format": "Badge / Clickable sort", "desc": "Tháng, Ngày, Năm, Lần... Click tiêu đề để sắp xếp A-Z.", "note": "BR-03"},
                {"name": "Xuất HĐĐT", "format": "Status Badge", "desc": "Có (Xanh lá) / Không (Xám).", "note": "BR-01"},
                {"name": "Loại khoản", "format": "Badge", "desc": "Bắt buộc (Đỏ) / Tùy chọn (Lam).", "note": ""},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Chỉnh sửa khoản phí, Xóa khoản phí.", "note": "BR-02"}
            ],
            "form_fields": [
                {"name": "Tên khoản phí *", "type": "Text Input", "validation": "Bắt buộc, tối đa 100 ký tự.", "note": ""},
                {"name": "Số tiền mặc định *", "type": "Numeric Input", "validation": "Bắt buộc, >= 0.", "note": ""},
                {"name": "Đơn vị tính *", "type": "Select Dropdown", "validation": "Bắt buộc chọn 1 đơn vị.", "note": "BR-03"},
                {"name": "Xuất HĐĐT *", "type": "Radio (Có / Không)", "validation": "Bắt buộc chọn; yêu cầu popup xác nhận nếu đổi.", "note": "BR-01"}
            ],
            "notifications": [
                {"context": "Thay đổi cờ HĐĐT", "type": "Confirmation Modal", "body": "Bạn có chắc chắn muốn thay đổi trạng thái Xuất hóa đơn điện tử cho khoản phí này?", "onclick": "Xác nhận / Hủy."},
                {"context": "Thêm khoản phí thành công", "type": "Toast (Xanh)", "body": "Đã thêm khoản phí mới vào danh mục thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Popup xác nhận thay đổi cờ Xuất HĐĐT", "desc": "Khi chỉnh sửa cờ Xuất HĐĐT từ 'Không' sang 'Có' hoặc ngược lại, bấm Lưu bắt buộc hiển thị popup modal cảnh báo xác nhận; chỉ ghi CSDL khi bấm Đồng ý."},
            {"code": "AC-02", "title": "Sắp xếp linh hoạt theo Đơn vị tính", "desc": "Click vào tiêu đề cột 'Đơn vị': bảng danh sách tự động đảo chiều sắp xếp tăng dần / giảm dần theo bảng chữ cái tiếng Việt."}
        ]
    },

    # 12. M4/SM4 - Quản lý học phí
    {
        "code": "M4/SM4",
        "name": "M4 - SM4 - Quản lý học phí",
        "parent_module": "M4",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý học phí &amp; Biểu phí lớp (Class Fee Schedules &amp; Overrides)</strong> thuộc nhóm <strong>M4: Tài chính</strong> quản lý ma trận cấu hình biểu phí gán cho từng lớp học hoặc từng học sinh.",
            "goals": "Cho phép Kế toán áp dụng các gói học phí theo lớp, tùy chỉnh đơn giá linh hoạt (in-cell price override) cho từng học sinh đặc thù (con giáo viên, học sinh học bổng) và xem số lượng học sinh đăng ký các khoản thu tùy chọn.",
            "scope": "Cầu nối trực tiếp giữa Danh mục khoản phí (M4/SM3) và Hóa đơn thu học phí định kỳ (M4/SM1).",
            "references": [
                {"doc": "docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md", "note": "Đặc tả nghiệp vụ legacy Quản lý học phí"},
                {"doc": "ADR-008 Streamlining Class Fee Schedule", "note": "Chuẩn hóa bảng quản lý học phí 6 cột và modal 3 cột"}
            ]
        },
        "business": {
            "flow_desc": "Kế toán chọn lớp học, thêm các khoản thu áp dụng cho lớp, điều chỉnh mức thu riêng cho từng học sinh nếu có và lưu biểu phí áp dụng.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Chọn lớp cấu hình", "desc": "Mở danh sách lớp học theo khối trong niên khóa."},
                {"actor": "Kế toán", "action": "Gán khoản phí cho lớp", "desc": "Chọn từ Danh mục khoản phí M4/SM3 các khoản thu áp dụng cho cả lớp."},
                {"actor": "Kế toán", "action": "Điều chỉnh giá riêng (Override)", "desc": "Nhập đơn giá riêng cho từng học sinh; hệ thống hiển thị gợi ý màu xanh báo hiệu có điều chỉnh."},
                {"actor": "Hệ thống BE", "action": "Khóa cờ HĐĐT", "desc": "Cờ Xuất HĐĐT tại đây chỉ ở chế độ xem (readonly), kế thừa trực tiếp từ M4/SM3."}
            ],
            "steps_narrative": [
                "Kế toán vào Tài chính -> Quản lý học phí, xem bảng danh sách các lớp học.",
                "Bảng được chuẩn hóa gồm 6 cột: STT, Tên lớp, Khối, Sĩ số, Các khoản phí (Badge đếm + Icon con mắt), Thao tác.",
                "Bấm icon con mắt (faEye): mở modal bảng 3 cột hiển thị: Tên khoản phí, Số tiền, Xuất HĐĐT.",
                "Bấm 'Cấu hình chi tiết lớp': mở ma trận học sinh x khoản phí để điều chỉnh số tiền riêng.",
                "Lưu biểu phí: hệ thống ghi nhận và áp dụng cho các đợt lập hóa đơn tiếp theo."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảng tổng quan 6 cột chuẩn hóa", "desc": "Bảng Quản lý học phí tuân thủ nghiêm ngặt định dạng 6 cột theo ADR-008; cột Các khoản phí hiển thị dạng badge đếm (ví dụ: '9 khoản phí') kèm icon con mắt faEye."},
                {"id": "BR-02", "title": "Modal xem chi tiết 3 cột", "desc": "Bấm vào icon con mắt mở modal popup bảng đúng 3 cột: (1) Tên khoản phí, (2) Số tiền, (3) Xuất HĐĐT (Có: Xanh lá, Không: Xám)."},
                {"id": "BR-03", "title": "Cờ HĐĐT chỉ đọc (Readonly)", "desc": "Cờ Xuất HĐĐT trong phân hệ này chỉ để xem, không thể sửa đổi tại đây; muốn đổi phải sửa ở Danh mục khoản phí M4/SM3."},
                {"id": "BR-04", "title": "Phát hiện điều chỉnh giá riêng (Override)", "desc": "Khi đơn giá gán cho học sinh khác với đơn giá gốc của lớp, ô nhập liệu hiển thị viền/tag màu xanh báo hiệu mức giá đã được can thiệp thủ công."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-011 Cấu hình biểu phí lớp", "feature": "Tổng quan biểu phí lớp (Chuẩn 6 cột)", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xem tổng quan biểu phí từng lớp với bảng 6 cột tinh gọn.", "jira": "QLHP-001"},
                {"epic": "E-011 Cấu hình biểu phí lớp", "feature": "Modal chi tiết khoản phí (Chuẩn 3 cột)", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn bấm icon con mắt để xem bảng 3 cột chi tiết các khoản thu của lớp.", "jira": "QLHP-002"},
                {"epic": "E-011 Cấu hình biểu phí lớp", "feature": "Ma trận giá riêng từng học sinh", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn sửa đơn giá riêng cho học sinh được miễn giảm học phí.", "jira": "QLHP-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-QLHP-01",
                    "name": "Xem chi tiết khoản phí lớp qua modal 3 cột",
                    "desc": "Kế toán kiểm tra các khoản thu đã gán cho lớp.",
                    "actor": "Kế toán trường",
                    "trigger": "Bấm icon con mắt (faEye) trên hàng của Lớp 1A1.",
                    "pre": "Lớp 1A1 đã được gán biểu phí.",
                    "happy_path": [
                        "Hệ thống mở modal popup 'Chi tiết biểu phí - Lớp 1A1'.",
                        "Hiển thị bảng 3 cột: Tên khoản phí, Số tiền, Xuất HĐĐT.",
                        "Kế toán kiểm tra các khoản: Học phí (3.500.000 đ - Có HĐĐT), Tiền ăn (35.000 đ/ngày - Không HĐĐT).",
                        "Bấm nút 'Đóng' hoặc icon X để đóng modal."
                    ],
                    "exception": [
                        "Lớp chưa có khoản phí: Hiển thị badge '0 khoản phí' và bảng rỗng trong modal."
                    ],
                    "post": "Kế toán nắm bắt đầy đủ chính sách thu của lớp mà không cần rời màn hình.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/tuition-management</code> hoặc menu <strong>TÀI CHÍNH &gt; Quản lý học phí</strong> (icon <code>faSlidersH</code>).",
            "list_overview": "Bảng danh sách lớp học theo chuẩn 6 cột ADR-008 kèm bộ lọc Khối lớp và Năm học.",
            "list_fields": [
                {"name": "STT", "format": "Number", "desc": "Số thứ tự.", "note": ""},
                {"name": "Tên lớp", "format": "Text (Bold)", "desc": "Tên lớp học (Lớp 1A1, Lớp 1A2...).", "note": ""},
                {"name": "Khối", "format": "Badge", "desc": "Khối 1, Khối 2...", "note": ""},
                {"name": "Sĩ số", "format": "Number", "desc": "Số học sinh đang theo học.", "note": ""},
                {"name": "Các khoản phí", "format": "Count Badge + faEye Icon", "desc": "Ví dụ: '9 khoản phí' kèm icon con mắt faEye mở modal 3 cột.", "note": "BR-01, BR-02"},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Nút 'Cấu hình chi tiết', 'Áp dụng biểu phí hàng loạt'.", "note": ""}
            ],
            "form_fields": [
                {"name": "Tên khoản phí", "type": "Readonly Text", "validation": "Hiển thị trong modal 3 cột.", "note": "BR-02"},
                {"name": "Số tiền", "type": "Currency Text", "validation": "Số tiền áp dụng cho lớp.", "note": "BR-02"},
                {"name": "Xuất HĐĐT", "type": "Status Badge (Readonly)", "validation": "Có (Xanh) / Không (Xám).", "note": "BR-03"}
            ],
            "notifications": [
                {"context": "Cập nhật biểu phí lớp", "type": "Toast (Xanh)", "body": "Đã lưu biểu phí áp dụng cho lớp thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Định dạng bảng chuẩn 6 cột ADR-008", "desc": "Kiểm tra bảng Quản lý học phí: hiển thị đúng 6 cột theo thứ tự: STT, Tên lớp, Khối, Sĩ số, Các khoản phí, Thao tác; không còn các cột cũ như 'Tiền ăn', 'Học phí', 'Xuất HĐĐT'."},
            {"code": "AC-02", "title": "Modal con mắt hiển thị chính xác 3 cột", "desc": "Bấm vào icon con mắt (faEye) ở cột Các khoản phí: hiển thị modal popup chứa đúng 3 cột: Tên khoản phí, Số tiền, Xuất HĐĐT."},
            {"code": "AC-03", "title": "Khóa cứng chỉnh sửa cờ HĐĐT trong biểu phí lớp", "desc": "Cờ Xuất HĐĐT trong modal 3 cột hoàn toàn ở trạng thái hiển thị (Badge/Text), không thể click đổi giá trị tại đây."}
        ]
    },

    # 13. M4/SM1 - Học phí (Hóa đơn)
    {
        "code": "M4/SM1",
        "name": "M4 - SM1 - Học phí",
        "parent_module": "M4",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý hóa đơn thu học phí (Invoices &amp; Billing Cockpit)</strong> thuộc nhóm <strong>M4: Tài chính</strong> là trung tâm vận hành thu chi học đường, quản trị toàn bộ chu kỳ phát hành hóa đơn, thu tiền đa kênh, gạch nợ tự động và in phiếu thu học sinh.",
            "goals": "Tự động tính toán hóa đơn học phí hàng tháng cho từng học sinh, tự động trừ tiền ăn dựa trên số ngày nghỉ thực tế và ngày nghỉ lễ, hỗ trợ thanh toán trực tuyến qua mã VietQR động, ghi nhận thanh toán tiền mặt và phát hành hóa đơn điện tử hợp lệ.",
            "scope": "Nghiệp vụ tài chính nòng cốt; tương tác trực tiếp với ứng dụng phụ huynh ECO Me và hệ sinh thái cổng thanh toán ngân hàng.",
            "references": [
                {"doc": "docs_legacy/operating-portal/tai-chinh/hoc-phi.md", "note": "Đặc tả nghiệp vụ legacy Hóa đơn học phí"},
                {"doc": "ADR-006 & ADR-007 Học Phí Invoicing UX Enhancements", "note": "Chuẩn hóa bộ lọc thời gian và phương thức thanh toán thủ công"}
            ]
        },
        "business": {
            "flow_desc": "Tạo đợt thu học phí, tính toán số tiền phải thu, phát hành hóa đơn đến phụ huynh, tiếp nhận thanh toán qua chuyển khoản VietQR hoặc tiền mặt và phát hành phiếu thu.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Tạo đợt thu học phí", "desc": "Chọn Tháng thu, Khối/Lớp, Hạn đóng tiền và bấm 'Tạo hóa đơn tự động'."},
                {"actor": "Hệ thống BE", "action": "Tính toán khấu trừ", "desc": "Tính tiền ăn = (Số ngày ăn định mức - Số ngày vắng có phép - Ngày nghỉ lễ M5/SM12) x Đơn giá ăn/ngày."},
                {"actor": "Hệ thống BE", "action": "Sinh mã VietQR động", "desc": "Mỗi hóa đơn sinh 1 mã VietQR kèm số tiền chính xác và cú pháp định danh học sinh."},
                {"actor": "Phụ huynh", "action": "Thanh toán", "desc": "Quét mã QR trên App ECO Me hoặc nộp tiền mặt tại văn phòng kế toán trường."},
                {"actor": "Kế toán", "action": "Xác nhận & In phiếu thu", "desc": "Hệ thống gạch nợ tự động qua Webhook hoặc kế toán xác nhận nộp tiền mặt (3 hình thức)."}
            ],
            "steps_narrative": [
                "Kế toán vào Tài chính -> Học phí, xem danh sách hóa đơn theo lớp và tháng.",
                "Sử dụng bộ lọc thời gian kết hợp: 'Lọc theo Thời gian tạo HĐ' hoặc 'Hạn đóng HĐ' kèm khoảng ngày linh hoạt.",
                "Bấm vào hóa đơn để xem chi tiết từng dòng mục thu (Học phí, Tiền ăn, Xe đưa đón...).",
                "Tại màn hình chi tiết, dưới cột 'Thành tiền' hiển thị rõ badge trạng thái từng khoản: 'Đã thanh toán' (Xanh lá) hoặc 'Chưa thanh toán' (Đỏ).",
                "Nếu thu tiền mặt: mở modal 'Xác nhận thanh toán thủ công', chọn đúng 1 trong 3 hình thức: Tiền mặt, QR ECOPay, Ví Finviet."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bộ lọc thời gian kết hợp chuẩn ADR-007", "desc": "Bộ lọc thời gian có tiền tố 'Lọc theo:' cho phép chuyển đổi giữa 'Thời gian tạo HĐ' (createdAt) và 'Hạn đóng HĐ' (dueDate), đi kèm bộ chọn khoảng ngày (Date Range Popover)."},
                {"id": "BR-02", "title": "Chi tiết dòng phí có badge Đã/Chưa thanh toán", "desc": "Màn hình chi tiết hóa đơn (Invoice Detail) bắt buộc hiển thị tag trạng thái thanh toán bên dưới cột Thành tiền của từng khoản phí: 'Đã thanh toán' (Xanh) hoặc 'Chưa thanh toán' (Đỏ)."},
                {"id": "BR-03", "title": "Giới hạn 3 hình thức thanh toán thủ công", "desc": "Modal 'Xác nhận thanh toán thủ công' giới hạn nghiêm ngặt đúng 3 phương thức: (1) Tiền mặt (tien_mat), (2) QR ECOPay (qr_ecopay), (3) Ví Finviet (vi_finviet)."},
                {"id": "BR-04", "title": "Khấu trừ tiền ăn vắng có phép tự động", "desc": "Tiền ăn được hoàn trả hoặc cấn trừ tự động dựa trên số ngày điểm danh vắng có phép (được BGH duyệt) của tháng trước."},
                {"id": "BR-05", "title": "Máy trạng thái hóa đơn", "desc": "Trạng thái thanh toán gồm: 'Chưa thanh toán' (Đỏ), 'Thanh toán một phần' (Cam), 'Đã thanh toán' (Xanh lá), 'Đã hủy' (Xám)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-009 Quản lý hóa đơn", "feature": "Danh sách & Lọc hóa đơn nâng cao", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn lọc hóa đơn theo ngày tạo hoặc hạn đóng để theo dõi tiến độ thu phí.", "jira": "HP-001"},
                {"epic": "E-009 Quản lý hóa đơn", "feature": "Chi tiết hóa đơn & Trạng thái dòng thu", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xem chi tiết từng khoản thu có nhãn Đã/Chưa thanh toán rõ ràng.", "jira": "HP-002"},
                {"epic": "E-009 Quản lý hóa đơn", "feature": "Xác nhận thanh toán thủ công (3 hình thức)", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xác nhận phụ huynh nộp tiền mặt hoặc ví để gạch nợ hóa đơn.", "jira": "HP-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-HP-01",
                    "name": "Xác nhận nộp tiền học phí bằng tiền mặt",
                    "desc": "Kế toán xác nhận phụ huynh nộp tiền mặt tại văn phòng.",
                    "actor": "Kế toán trường",
                    "trigger": "Bấm 'Xác nhận thanh toán' trên hóa đơn chưa nộp.",
                    "pre": "Hóa đơn đang ở trạng thái 'Chưa thanh toán'.",
                    "happy_path": [
                        "Hệ thống mở modal 'Xác nhận thanh toán thủ công'.",
                        "Hiển thị số tiền cần thu '3.850.000 đ'.",
                        "Kế toán chọn phương thức 'Tiền mặt'.",
                        "Nhập ghi chú 'Phụ huynh em Nguyễn Văn An nộp trực tiếp'.",
                        "Bấm 'Lưu xác nhận'.",
                        "Hệ thống chuyển trạng thái hóa đơn sang 'Đã thanh toán', phát sinh số phiếu thu và hiển thị toast xanh."
                    ],
                    "exception": [
                        "Số tiền nhập không khớp: Báo lỗi 'Số tiền không hợp lệ'."
                    ],
                    "post": "Hóa đơn chuyển sang màu xanh và sẵn sàng in phiếu thu.",
                    "rules": "BR-02, BR-03, BR-05"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/fee</code> hoặc menu <strong>TÀI CHÍNH &gt; Học phí</strong> (icon <code>faReceipt</code>).",
            "list_overview": "Bảng danh sách hóa đơn toàn trường kèm widget lọc ngày kép (Thời gian tạo / Hạn đóng) chuẩn Image 1 ADR-007.",
            "list_fields": [
                {"name": "Mã hóa đơn", "format": "Text (Bold)", "desc": "Mã hóa đơn duy nhất (ví dụ: HĐ-202610-001).", "note": ""},
                {"name": "Học sinh", "format": "Họ tên + Lớp", "desc": "Tên học sinh và lớp đang học.", "note": ""},
                {"name": "Tổng tiền", "format": "Currency (VNĐ)", "desc": "Số tiền phải đóng của hóa đơn.", "note": ""},
                {"name": "Đã thanh toán", "format": "Currency (VNĐ)", "desc": "Số tiền thực tế đã thu.", "note": ""},
                {"name": "Hạn đóng", "format": "Date (DD/MM/YYYY)", "desc": "Hạn chót phụ huynh phải nộp tiền.", "note": "BR-01"},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Đã thanh toán (Xanh), Chưa nộp (Đỏ), Nộp một phần (Cam).", "note": "BR-05"},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Xem chi tiết, Xác nhận thanh toán, Xuất HĐĐT, In phiếu thu.", "note": ""}
            ],
            "form_fields": [
                {"name": "Phương thức thanh toán *", "type": "Select Dropdown", "validation": "Giới hạn đúng 3 hình thức: Tiền mặt, QR ECOPay, Ví Finviet.", "note": "BR-03"},
                {"name": "Số tiền xác nhận *", "type": "Currency Input", "validation": "Bắt buộc, > 0 và <= Số tiền còn thiếu.", "note": ""},
                {"name": "Ghi chú phiếu thu", "type": "Text Area", "validation": "Tùy chọn, tối đa 250 ký tự.", "note": ""}
            ],
            "notifications": [
                {"context": "Thanh toán thành công", "type": "Toast (Xanh)", "body": "Đã ghi nhận thanh toán và gạch nợ hóa đơn thành công.", "onclick": "In phiếu thu."},
                {"context": "Nhắc nợ học phí", "type": "Push Notification App ECO Me", "body": "Thông báo: Hóa đơn học phí tháng 10 của bé Nguyễn Văn An sắp đến hạn.", "onclick": "Mở xem hóa đơn trên app."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Bộ lọc thời gian kép hoạt động chính xác", "desc": "Chuyển đổi giữa 'Thời gian tạo HĐ' và 'Hạn đóng HĐ' trên widget lọc: bảng dữ liệu phải lọc đúng theo trường createdAt hoặc dueDate tương ứng."},
            {"code": "AC-02", "title": "Hiển thị nhãn Đã/Chưa thanh toán ở từng dòng phí", "desc": "Mở trang Chi tiết hóa đơn: bên dưới số tiền của từng dòng phí bắt buộc xuất hiện badge 'Đã thanh toán' màu xanh lá hoặc 'Chưa thanh toán' màu đỏ."},
            {"code": "AC-03", "title": "Giới hạn phương thức thanh toán thủ công duy nhất là Tiền mặt", "desc": "Trong modal Xác nhận thanh toán thủ công: dropdown phương thức chỉ hiển thị duy nhất 1 lựa chọn (Tiền mặt); các phương thức thanh toán điện tử như QR ECOPay, Ví Finviet được xử lý tự động qua cổng thanh toán/đối soát."}
        ]
    },

    # 14. M4/SM5 - Khoản chi
    {
        "code": "M4/SM5",
        "name": "M4 - SM5 - Khoản chi",
        "parent_module": "M4",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý chi tiêu &amp; Phiếu chi (Expense Vouchers &amp; Disbursements)</strong> thuộc nhóm <strong>M4: Tài chính</strong> quản lý các khoản chi hoạt động của trường (mua nguyên vật liệu thực phẩm bán trú, mua sắm trang thiết bị, văn phòng phẩm, hoàn tiền học phí, bảo trì cơ sở vật chất).",
            "goals": "Theo dõi dòng tiền chi ra, kiểm soát số chứng từ kế toán, phân loại danh mục chi phí, thực hiện quy trình phê duyệt phiếu chi và hủy phiếu chi minh bạch theo quy định tài chính.",
            "scope": "Nghiệp vụ chi nội bộ nhà trường; phục vụ tính toán dòng tiền thuần và báo cáo tài chính tổng hợp.",
            "references": [
                {"doc": "docs_legacy/operating-portal/tai-chinh/khoan-chi.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Khoản chi"},
                {"doc": "Thông tư số 107/2017/TT-BTC", "note": "Chế độ kế toán hành chính sự nghiệp"}
            ]
        },
        "business": {
            "flow_desc": "Lập đề xuất chi tiêu, kế toán duyệt phiếu chi, thực hiện chi tiền và lưu trữ chứng từ kế toán kèm hóa đơn mua hàng.",
            "flow_steps": [
                {"actor": "Nhân viên / Giáo viên", "action": "Tạo đề xuất chi", "desc": "Nhập Mục đích chi, Số tiền, Danh mục chi, Người nhận và đính kèm hóa đơn/chứng từ."},
                {"actor": "Kế toán trưởng", "action": "Kiểm tra & Duyệt phiếu chi", "desc": "Kiểm tra định mức ngân sách, duyệt hoặc từ chối phiếu chi."},
                {"actor": "Thủ quỹ", "action": "Xuất tiền chi", "desc": "Chi tiền mặt hoặc chuyển khoản cho người thụ hưởng, chuyển trạng thái 'Đã chi'."},
                {"actor": "Hệ thống BE", "action": "Ghi nhận sổ quỹ", "desc": "Cập nhật giảm số dư quỹ tiền mặt và tính vào báo cáo chi phí tháng."}
            ],
            "steps_narrative": [
                "Người dùng vào Tài chính -> Khoản chi, xem danh sách phiếu chi theo tháng.",
                "Bấm '+ Tạo phiếu chi', nhập Số tiền chi, Danh mục chi (Nguyên liệu bếp, Văn phòng phẩm, Sửa chữa...).",
                "Nhập thông tin Người nhận tiền, Số chứng từ kèm tệp đính kèm hóa đơn đỏ.",
                "Lưu phiếu chi ở trạng thái 'Chờ duyệt' hoặc 'Đã chi' (nếu kế toán có quyền duyệt trực tiếp).",
                "Trường hợp sai sót: thực hiện luồng Hủy phiếu chi kèm lý do bắt buộc."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc Số chứng từ phiếu chi duy nhất", "desc": "Số phiếu chi (Voucher Number) tự động tăng theo định dạng PC-YYYYMM-XXXX và không được trùng lặp."},
                {"id": "BR-02", "title": "Quy trình hủy phiếu chi có kiểm soát", "desc": "Phiếu chi đã chi tiền chỉ được phép Hủy bởi Kế toán trưởng hoặc Admin kèm lý do giải trình bắt buộc."},
                {"id": "BR-03", "title": "Ràng buộc số tiền chi dương", "desc": "Số tiền trên phiếu chi bắt buộc phải là số dương lớn hơn 0."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-013 Quản lý khoản chi", "feature": "Danh sách & Lọc phiếu chi", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn theo dõi danh sách các khoản chi theo thời gian và danh mục.", "jira": "KC-001"},
                {"epic": "E-013 Quản lý khoản chi", "feature": "Lập & Duyệt phiếu chi", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn tạo phiếu chi và duyệt chi để giải ngân hoạt động.", "jira": "KC-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-KC-01",
                    "name": "Tạo phiếu chi mua thực phẩm bán trú",
                    "desc": "Lập phiếu chi thanh toán cho nhà cung cấp thực phẩm.",
                    "actor": "Kế toán viên",
                    "trigger": "Bấm nút '+ Tạo phiếu chi'.",
                    "pre": "Đã có hóa đơn giao hàng từ nhà bếp.",
                    "happy_path": [
                        "Chọn danh mục chi 'Thực phẩm bán trú'.",
                        "Nhập Số tiền '12.500.000 đ'.",
                        "Nhập Người nhận 'Công ty Thực phẩm Sạch Việt'.",
                        "Tải ảnh hóa đơn giao hàng.",
                        "Bấm 'Lưu & Duyệt chi'.",
                        "Hệ thống sinh số phiếu chi PC-202610-0042 và cập nhật vào danh sách."
                    ],
                    "exception": [
                        "Số tiền bằng 0: Báo lỗi 'Số tiền chi phải lớn hơn 0'."
                    ],
                    "post": "Phiếu chi ở trạng thái Đã chi và trừ tiền vào quỹ tháng.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/expenses</code> hoặc menu <strong>TÀI CHÍNH &gt; Khoản chi</strong> (icon <code>faMoneyBillWave</code>).",
            "list_overview": "Bảng danh sách phiếu chi kèm thẻ thống kê tổng chi trong tháng, bộ lọc danh mục và ô tìm kiếm người nhận.",
            "list_fields": [
                {"name": "Số phiếu chi", "format": "Text (Bold)", "desc": "Mã phiếu chi (PC-202610-001).", "note": "BR-01"},
                {"name": "Ngày chi", "format": "Date (DD/MM/YYYY)", "desc": "Ngày thực hiện chi tiền.", "note": ""},
                {"name": "Người nhận", "format": "Text", "desc": "Cá nhân hoặc đơn vị thụ hưởng.", "note": ""},
                {"name": "Danh mục chi", "format": "Badge", "desc": "Bếp ăn, Cơ sở vật chất, Văn phòng phẩm...", "note": ""},
                {"name": "Số tiền", "format": "Currency (Đỏ)", "desc": "Số tiền chi ra (ví dụ: -5.000.000 đ).", "note": "BR-03"},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Đã chi (Xanh), Chờ duyệt (Cam), Đã hủy (Xám).", "note": "BR-02"},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Xem chi tiết, In phiếu chi, Hủy phiếu chi.", "note": ""}
            ],
            "form_fields": [
                {"name": "Danh mục chi *", "type": "Select Dropdown", "validation": "Bắt buộc chọn 1 danh mục chi phí.", "note": ""},
                {"name": "Số tiền chi *", "type": "Currency Input", "validation": "Bắt buộc, > 0.", "note": "BR-03"},
                {"name": "Người nhận tiền *", "type": "Text Input", "validation": "Bắt buộc, tối đa 100 ký tự.", "note": ""},
                {"name": "Nội dung chi *", "type": "Text Area", "validation": "Bắt buộc, diễn giải mục đích chi.", "note": ""}
            ],
            "notifications": [
                {"context": "Tạo phiếu chi thành công", "type": "Toast (Xanh)", "body": "Đã tạo phiếu chi thành công.", "onclick": "In phiếu chi."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Tự động sinh số phiếu chi duy nhất", "desc": "Mỗi phiếu chi tạo mới được cấp số phiếu định dạng chuẩn và không bao giờ trùng lặp."},
            {"code": "AC-02", "title": "Bắt buộc lý do khi hủy phiếu chi", "desc": "Bấm 'Hủy phiếu chi': bắt buộc nhập lý do giải trình trong modal; nếu để trống lý do thì nút Xác nhận hủy bị vô hiệu hóa."}
        ]
    },

    # 15. M4/SM2 - Đối soát
    {
        "code": "M4/SM2",
        "name": "M4 - SM2 - Đối soát",
        "parent_module": "M4",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Đối soát giao dịch &amp; Thanh toán (Reconciliation &amp; Settlement)</strong> thuộc nhóm <strong>M4: Tài chính</strong> quản trị các phiên đối soát dòng tiền giữa cổng thanh toán trực tuyến (Sepay, QR EcoPay, Ví Finviet), tài khoản ngân hàng trường học và danh sách hóa đơn học sinh.",
            "goals": "Đảm bảo tính chính xác 100% của dòng tiền thu qua cổng thanh toán, tự động đối chiếu số lượng giao dịch, tổng tiền thanh toán, phí giao dịch trung gian, số tiền thực nhận về tài khoản trường và cảnh báo sai lệch (lệch tiền, thừa/thiếu giao dịch).",
            "scope": "Nghiệp vụ đối soát trung gian giữa Cổng thanh toán và Kế toán trường.",
            "references": [
                {"doc": "docs_legacy/operating-portal/tai-chinh/doi-soat.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Đối soát"},
                {"doc": "Quy chế thanh toán không dùng tiền mặt Ngân hàng Nhà nước", "note": "Tiêu chuẩn đối soát dòng tiền điện tử"}
            ]
        },
        "business": {
            "flow_desc": "Hệ thống tự động gom giao dịch theo chu kỳ phiên (hàng ngày hoặc hàng tuần), đối chiếu với sao kê ngân hàng và xuất biên bản đối soát.",
            "flow_steps": [
                {"actor": "Hệ thống BE", "action": "Khởi tạo phiên đối soát", "desc": "Đóng phiên giao dịch lúc 23:59:59 hàng ngày và tổng hợp danh sách giao dịch thành công."},
                {"actor": "Cổng thanh toán", "action": "Gửi dữ liệu quyết toán", "desc": "Truyền file sao kê đối soát điện tử kèm tổng tiền thanh toán và phí giao dịch."},
                {"actor": "Kế toán", "action": "Đối chiếu phiên", "desc": "Kiểm tra trạng thái khớp lệnh giữa số tiền trên hóa đơn và số tiền ngân hàng thực chuyển."},
                {"actor": "Kế toán", "action": "Xác nhận đối soát", "desc": "Ký điện tử / xác nhận hoàn thành phiên đối soát và lưu biên bản đối soát."}
            ],
            "steps_narrative": [
                "Kế toán vào Tài chính -> Đối soát, xem danh sách các phiên đối soát theo thời gian.",
                "Mỗi phiên hiển thị: Mã phiên, Khoảng thời gian, Tổng giao dịch, Tổng tiền thu, Phí dịch vụ, Tiền thực nhận, Trạng thái (Khớp / Lệch / Chờ xác nhận).",
                "Bấm vào phiên để xem chi tiết từng giao dịch học sinh.",
                "Nếu có giao dịch sai lệch: bấm 'Xem chi tiết lệch' để đối chiếu mã giao dịch ngân hàng và xử lý thủ công.",
                "Bấm 'Xác nhận phiên' để hoàn tất quyết toán dòng tiền."
            ],
            "rules": [
                {"id": "BR-01", "title": "Khớp lệnh chính xác số tiền tuyệt đối", "desc": "Phiên đối soát chỉ được đánh dấu 'Đã khớp' khi tổng số tiền hóa đơn khớp chính xác 100% với số tiền quyết toán từ cổng thanh toán."},
                {"id": "BR-02", "title": "Tự động cảnh báo sai lệch", "desc": "Nếu có chênh lệch giữa số tiền phụ huynh quét trả và số tiền ghi nợ hóa đơn, phiên lập tức gắn nhãn 'Sai lệch' kèm chi tiết giao dịch bất thường."},
                {"id": "BR-03", "title": "Bất biến dữ liệu phiên đã đối soát", "desc": "Phiên đối soát sau khi Kế toán trưởng đã bấm 'Xác nhận hoàn thành' sẽ bị khóa cứng, không thể chỉnh sửa dữ liệu để phục vụ kiểm toán."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-012 Đối soát tài chính", "feature": "Danh sách phiên đối soát", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xem danh sách các phiên đối soát để quản lý dòng tiền quyết toán.", "jira": "DS-001"},
                {"epic": "E-012 Đối soát tài chính", "feature": "Chi tiết giao dịch phiên & Xử lý lệch", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xem chi tiết từng giao dịch và xử lý các khoản tiền lệch.", "jira": "DS-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-DS-01",
                    "name": "Xác nhận phiên đối soát thành công",
                    "desc": "Kế toán xác nhận phiên đối soát hàng ngày.",
                    "actor": "Kế toán trưởng",
                    "trigger": "Bấm 'Xác nhận đối soát' trên phiên khớp.",
                    "pre": "Dữ liệu giao dịch đã được hệ thống tự động kiểm tra khớp.",
                    "happy_path": [
                        "Mở phiên đối soát ngày 25/10/2026.",
                        "Kiểm tra 150 giao dịch với tổng tiền 450.000.000 đ.",
                        "Trạng thái hiển thị 'Khớp hoàn toàn'.",
                        "Bấm 'Xác nhận đối soát'.",
                        "Hệ thống khóa phiên và xuất biên bản PDF đối soát."
                    ],
                    "exception": [
                        "Phiên có giao dịch lệch: Nút 'Xác nhận' bị khóa kèm thông báo 'Vui lòng xử lý các giao dịch lệch trước khi chốt phiên'."
                    ],
                    "post": "Phiên chuyển sang trạng thái Đã chốt và lưu trữ vĩnh viễn.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/reconciliation</code> hoặc menu <strong>TÀI CHÍNH &gt; Đối soát</strong> (icon <code>faBalanceScale</code>).",
            "list_overview": "Bảng danh sách các phiên đối soát kèm bộ lọc thời gian, trạng thái phiên và ô tìm kiếm mã giao dịch.",
            "list_fields": [
                {"name": "Mã phiên đối soát", "format": "Text (Bold)", "desc": "Mã phiên (ví dụ: DS-20261025).", "note": ""},
                {"name": "Kỳ đối soát", "format": "Date Range", "desc": "Khoảng thời gian giao dịch của phiên.", "note": ""},
                {"name": "Số giao dịch", "format": "Number", "desc": "Tổng số lượt thanh toán thành công.", "note": ""},
                {"name": "Tổng tiền thu", "format": "Currency (VNĐ)", "desc": "Tổng giá trị giao dịch phụ huynh đã trả.", "note": "BR-01"},
                {"name": "Thực nhận", "format": "Currency (Xanh lá)", "desc": "Số tiền thực chuyển về tài khoản trường sau trừ phí.", "note": ""},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Đã khớp (Xanh), Sai lệch (Đỏ), Chờ đối soát (Vàng).", "note": "BR-02"},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Xem chi tiết phiên, Xác nhận đối soát, Tải biên bản Excel/PDF.", "note": "BR-03"}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Phiên có giao dịch lệch", "type": "Alert Banner (Đỏ)", "body": "Cảnh báo: Phiên đối soát DS-20261025 có 2 giao dịch không khớp số tiền.", "onclick": "Xem giao dịch lệch."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Khóa xác nhận khi còn giao dịch lệch", "desc": "Phiên đối soát có trạng thái 'Sai lệch': nút Xác nhận đối soát bắt buộc phải bị vô hiệu hóa; kế toán phải xử lý hết các khoản lệch mới được chốt phiên."},
            {"code": "AC-02", "title": "Bất biến dữ liệu sau khi chốt", "desc": "Phiên đã ở trạng thái 'Đã chốt': tất cả các trường dữ liệu bị khóa hoàn toàn, không thể xóa hoặc sửa giao dịch trong phiên."}
        ]
    },

    # 16. M4/SM6 - Báo cáo Học phí
    {
        "code": "M4/SM6",
        "name": "M4 - SM6 - Báo cáo Học phí",
        "parent_module": "M4",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Báo cáo thu học phí &amp; Công nợ (Tuition Collection &amp; Aging Reports)</strong> thuộc nhóm <strong>M4: Tài chính</strong> cung cấp các số liệu phân tích doanh thu, tỷ lệ hoàn thành thu phí và danh sách công nợ tồn đọng theo toàn trường, khối lớp và từng lớp học.",
            "goals": "Cung cấp cho Ban Giám hiệu và Kế toán cái nhìn tổng thể về tiến độ thu tiền học phí hàng tháng, tỷ lệ nộp học phí đúng hạn, danh sách học sinh chưa nộp để gửi thông báo nhắc nợ, và xuất dữ liệu báo cáo tài chính chuẩn cho cơ quan quản lý.",
            "scope": "Báo cáo số liệu tổng hợp cho toàn bộ phân hệ Tài chính M4.",
            "references": [
                {"doc": "docs_legacy/operating-portal/tai-chinh/bao-cao-hoc-phi.md", "note": "Đặc tả nghiệp vụ legacy Báo cáo học phí"}
            ]
        },
        "business": {
            "flow_desc": "Hệ thống tổng hợp dữ liệu hóa đơn thời gian thực, tính toán tỷ lệ thu, phân tích công nợ và xuất báo cáo biểu đồ trực quan.",
            "flow_steps": [
                {"actor": "BGH / Kế toán", "action": "Xem báo cáo tổng quan", "desc": "Xem KPI: Tổng phải thu, Đã thu, Còn phải thu, Tỷ lệ hoàn thành (%)."},
                {"actor": "BGH / Kế toán", "action": "Phân tích theo lớp", "desc": "Xem bảng tiến độ thu của từng lớp học để đôn đốc GVCN nhắc nhở phụ huynh."},
                {"actor": "Kế toán", "action": "Trích xuất danh sách nợ", "desc": "Lọc danh sách học sinh chưa nộp học phí và bấm 'Gửi thông báo nhắc nợ' tự động."},
                {"actor": "Kế toán", "action": "Xuất Excel", "desc": "Tải file Excel báo cáo chi tiết phục vụ kiểm toán và lưu trữ."}
            ],
            "steps_narrative": [
                "Người dùng vào Tài chính -> Báo cáo học phí.",
                "Chọn Năm học, Tháng báo cáo và Khối lớp.",
                "Xem 4 thẻ chỉ số KPI trên cùng: Tổng doanh thu dự kiến, Thực thu, Công nợ tồn đọng, Tỷ lệ thu (%).",
                "Xem biểu đồ tiến độ thu và bảng thống kê chi tiết từng lớp học.",
                "Bấm vào tab 'Học sinh chưa nộp' để xem danh sách chi tiết và gửi tin nhắn nhắc nợ hàng loạt."
            ],
            "rules": [
                {"id": "BR-01", "title": "Tính toán thời gian thực (Real-time)", "desc": "Số liệu báo cáo tỷ lệ thu học phí phải phản ánh tức thì ngay khi có giao dịch thanh toán thành công được gạch nợ trong hệ thống."},
                {"id": "BR-02", "title": "Phân loại 3 nhóm báo cáo", "desc": "Hệ thống chia làm 3 tab báo cáo chuyên biệt: (1) Tổng quan thu phí (Overview), (2) Báo cáo nộp một phần (Partial), (3) Báo cáo chưa nộp (Unpaid)."},
                {"id": "BR-03", "title": "Xuất dữ liệu Excel chuẩn kế toán", "desc": "File Excel xuất ra phải đúng biểu mẫu chuẩn, có đầy đủ công thức tính tổng và phân cách hàng nghìn rõ ràng."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-014 Báo cáo học phí", "feature": "Tổng quan tiến độ thu học phí", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem tỷ lệ thu học phí toàn trường để chỉ đạo công tác tài chính.", "jira": "BCHP-001"},
                {"epic": "E-014 Báo cáo học phí", "feature": "Báo cáo công nợ & Gửi nhắc nhở", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xuất danh sách học sinh chưa nộp học phí để gửi thông báo nhắc nhở.", "jira": "BCHP-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-BCHP-01",
                    "name": "Xem báo cáo tỷ lệ thu và gửi nhắc nợ",
                    "desc": "Kế toán kiểm tra tiến độ thu học phí tháng 10.",
                    "actor": "Kế toán trưởng",
                    "trigger": "Mở tab 'Báo cáo chưa nộp'.",
                    "pre": "Đã có đợt thu học phí tháng 10.",
                    "happy_path": [
                        "Xem danh sách 45 học sinh chưa đóng học phí.",
                        "Tích chọn 'Chọn tất cả'.",
                        "Bấm 'Gửi thông báo nhắc nợ qua App ECO Me'.",
                        "Hệ thống gửi thông báo đẩy đến 45 phụ huynh và báo toast xanh."
                    ],
                    "exception": [
                        "Không có học sinh nợ: Hiển thị thông báo 'Tất cả học sinh đã hoàn thành học phí'."
                    ],
                    "post": "Phụ huynh nhận được thông báo nhắc đóng tiền trên điện thoại.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/reports/fee/overview</code> hoặc menu <strong>TÀI CHÍNH &gt; Báo cáo học phí</strong> (icon <code>faChartPie</code>).",
            "list_overview": "Giao diện báo cáo trực quan gồm 4 thẻ KPI, thanh tiến độ tỷ lệ thu và bảng số liệu phân rã theo từng lớp.",
            "list_fields": [
                {"name": "Lớp học", "format": "Text (Bold)", "desc": "Tên lớp học.", "note": ""},
                {"name": "Sĩ số", "format": "Number", "desc": "Tổng học sinh của lớp.", "note": ""},
                {"name": "Tổng phải thu", "format": "Currency (VNĐ)", "desc": "Tổng tiền theo hóa đơn phát hành.", "note": ""},
                {"name": "Đã thu", "format": "Currency (Xanh lá)", "desc": "Số tiền đã nộp thành công.", "note": "BR-01"},
                {"name": "Còn nợ", "format": "Currency (Đỏ)", "desc": "Số tiền còn thiếu.", "note": "BR-01"},
                {"name": "Tỷ lệ thu", "format": "Progress Bar + %", "desc": "Thanh tiến độ màu sắc trực quan (ví dụ: 85%).", "note": ""},
                {"name": "Thao tác", "format": "Button", "desc": "Xem chi tiết lớp, Xuất Excel.", "note": "BR-03"}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Gửi nhắc nợ học phí", "type": "Toast (Xanh)", "body": "Đã gửi thông báo nhắc nợ học phí đến các phụ huynh được chọn.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Khớp số liệu thời gian thực giữa Báo cáo và Hóa đơn", "desc": "Ngay khi một hóa đơn được gạch nợ thành công, số tiền Thực thu trên thẻ KPI Báo cáo phải tự động tăng lên tương ứng."},
            {"code": "AC-02", "title": "Chuyển đổi 3 tab báo cáo linh hoạt", "desc": "Chuyển đổi giữa 3 tab Tổng quan, Đóng một phần, Chưa đóng: dữ liệu bảng lọc chính xác theo đúng trạng thái thanh toán."},
            {"code": "AC-03", "title": "Xuất file Excel đầy đủ trường và công thức", "desc": "Bấm 'Xuất báo cáo': tải về file Excel định dạng chuẩn chứa đầy đủ thông tin các lớp và dòng tổng cộng cuối bảng."}
        ]
    }
]

P1_PRDS.extend(REST_8_TO_16)

# Write to milestone1_data.py
content = f'''# -*- coding: utf-8 -*-
"""
Milestone 1 PRD Definitions for Portal QLTH (Rebuild Roadmap).
Total: {len(P1_PRDS)} sub-modules.
Generated automatically.
"""

MILESTONE_1_PRDS = {json.dumps(P1_PRDS, ensure_ascii=False, indent=2)}
'''

with open('tools/confluence/milestone1_data.py', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully generated tools/confluence/milestone1_data.py with {len(P1_PRDS)} sub-modules!")
