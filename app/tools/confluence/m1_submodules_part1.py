# -*- coding: utf-8 -*-
"""Milestone 1 Sub-modules Part 1: M6/SM2, M7/SM2, M5/SM13, M5/SM5, M5/SM1, M5/SM3"""

PART1_PRDS = [
    # 1. M6/SM2 - Tài khoản
    {
        "code": "M6/SM2",
        "name": "M6 - SM2 - Tài khoản",
        "parent_module": "M6",
        "parent_category": "8. Portal QLTH > M6 - Cấu hình",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Trong môi trường giáo dục số hóa, phân hệ <strong>Quản lý tài khoản &amp; Phân quyền người dùng (User &amp; Role-based Access Control - RBAC)</strong> là chốt chặn bảo mật trọng yếu của toàn bộ hệ sinh thái Portal QLTH. Theo quy định tại <strong>Nghị định 13/2023/NĐ-CP</strong> về bảo vệ dữ liệu cá nhân và quy chế quản lý dữ liệu ngành giáo dục, hệ thống phải đảm bảo xác thực danh tính chặt chẽ, phân quyền nhiệm vụ rành mạch giữa các nhóm nhân sự (Ban Giám Hiệu, Giáo viên chủ nhiệm, Giáo viên bộ môn, Kế toán, Quản trị viên hệ thống), đồng thời ngăn ngừa triệt để các hành vi truy cập trái phép hoặc vượt quyền thao tác trên hồ sơ học sinh và dữ liệu tài chính.",
            "goals_list": [
                "Thiết lập cơ chế phân quyền dựa trên vai trò (RBAC) đa cấp độ, kiểm soát truy cập theo từng phân hệ và từng lớp học cụ thể.",
                "Quản lý vòng đời tài khoản toàn diện: Khởi tạo, cấp phát mật khẩu ban đầu, kích hoạt, tạm khóa, mở khóa và thu hồi quyền.",
                "Tích hợp xác thực hai yếu tố (2FA) qua mã OTP SMS/Email đối với các thao tác tài chính và quản trị master data nhạy cảm.",
                "Lưu trữ nhật ký kiểm toán (Audit Trail) cho toàn bộ hoạt động đăng nhập, phân quyền và thay đổi thông tin định danh.",
                "Đồng bộ liên thông tài khoản với phân hệ Giáo viên (M5/SM2) và Học sinh/Phụ huynh (M5/SM1)."
            ],
            "target_users": [
                {"group": "Quản trị viên trường (Admin)", "role": "Super Admin cấp trường", "actions": "Khởi tạo tài khoản nhân sự, gán vai trò quyền hạn, mở khóa tài khoản và thiết lập chính sách bảo mật."},
                {"group": "Ban Giám Hiệu (BGH)", "role": "Quản lý điều hành", "actions": "Xem danh sách người dùng, phê duyệt phân công chuyên môn và giám sát nhật ký truy cập hệ thống."},
                {"group": "Giáo viên / Kế toán", "role": "Người dùng nội bộ", "actions": "Đăng nhập tài khoản được cấp, cập nhật hồ sơ cá nhân, đổi mật khẩu và thực hiện nghiệp vụ theo phân quyền."}
            ],
            "glossary": [
                {"term": "RBAC", "definition": "Role-Based Access Control - Cơ chế kiểm soát truy cập dựa trên vai trò của người dùng trong tổ chức."},
                {"term": "Super Admin", "definition": "Tài khoản quản trị cao nhất của trường, có toàn quyền cấu hình tính năng và gán vai trò."},
                {"term": "2FA / OTP", "definition": "Two-Factor Authentication / One-Time Password - Xác thực 2 bước tăng cường bảo mật tài khoản."},
                {"term": "Audit Log", "definition": "Nhật ký kiểm toán ghi nhận mọi thay đổi trạng thái tài khoản và phân quyền trong hệ thống."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình cấp phát tài khoản, phân công vai trò chuyên môn, giám sát hoạt động và xử lý tình huống tài khoản bị khóa.",
            "flow_steps": [
                {"actor": "Quản trị viên trường", "action": "Khởi tạo tài khoản", "desc": "Nhập họ tên, email công vụ, số điện thoại và chọn vai trò chuyên môn (BGH, Kế toán, GVCN, GV Bộ môn)."},
                {"actor": "Hệ thống BE", "action": "Tạo thông tin & Gửi thông báo", "desc": "Tạo bản ghi trong CSDL, băm mật khẩu bằng Argon2id, gửi thông tin đăng nhập ban đầu qua email/SMS."},
                {"actor": "Người dùng nhân sự", "action": "Kích hoạt & Đổi mật khẩu", "desc": "Đăng nhập lần đầu bằng mật khẩu tạm, bắt buộc đổi mật khẩu mới đạt chuẩn bảo mật để kích hoạt tài khoản."},
                {"actor": "Quản trị viên", "action": "Phân công phạm vi dữ liệu", "desc": "Gán giáo viên vào các lớp học phụ trách; gán kế toán vào các khối thu học phí."},
                {"actor": "Hệ thống BE", "action": "Ghi nhận Audit Log", "desc": "Lưu vết thời gian đăng nhập, địa chỉ IP và lịch sử các lần thay đổi quyền hạn."}
            ],
            "steps_narrative": [
                "Bước 1: Quản trị viên truy cập Cấu hình -> Tài khoản, kiểm tra danh mục người dùng hiện có trong trường.",
                "Bước 2: Bấm nút 'Thêm tài liệu tài khoản', nhập đầy đủ thông tin định danh (Họ tên, SĐT, Email, CCCD, Mã nhân sự).",
                "Bước 3: Chọn vai trò từ danh mục RBAC chuẩn; nếu là Giáo viên, hệ thống yêu cầu chọn thêm chức danh (Chủ nhiệm lớp nào, Dạy bộ môn nào).",
                "Bước 4: Hệ thống tự động kích hoạt tài khoản và gửi mật khẩu ngẫu nhiên tới số điện thoại/email của nhân sự.",
                "Bước 5: Trường hợp nhân sự nhập sai mật khẩu quá 5 lần liên tiếp, hệ thống tự động khóa tài khoản trong 30 phút và gửi cảnh báo tới Admin."
            ],
            "rules": [
                {"id": "BR-01", "title": "Định danh duy nhất tài khoản", "desc": "Email công vụ và Số điện thoại di động là trường duy nhất trong toàn hệ thống multi-tenant, không được phép trùng lặp giữa các tài khoản."},
                {"id": "BR-02", "title": "Chính sách mật khẩu mạnh chuẩn ISO 27001", "desc": "Mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ít nhất một ký tự đặc biệt (@, #, $, !); không được trùng với 3 mật khẩu gần nhất; chu kỳ đổi mật khẩu tối đa 90 ngày."},
                {"id": "BR-03", "title": "Khóa tài khoản tự động chống tấn công dò mật khẩu (Brute Force)", "desc": "Nhập sai mật khẩu liên tiếp 5 lần sẽ khóa tài khoản trong 30 phút. Chỉ Super Admin mới có quyền mở khóa cưỡng bức trước thời hạn."},
                {"id": "BR-04", "title": "Ràng buộc dữ liệu khi ngưng hoạt động tài khoản", "desc": "Tài khoản nhân sự đã phát sinh giao dịch thu chi, điểm số hoặc nhật ký điểm danh không được xóa vĩnh viễn; chỉ cho phép chuyển sang trạng thái 'Đã khóa' (Suspended) hoặc 'Nghỉ việc'."},
                {"id": "BR-05", "title": "Phân quyền theo phạm vi lớp học (Data Scope)", "desc": "Giáo viên chủ nhiệm chỉ được truy cập dữ liệu học sinh, điểm danh và học phí của lớp mình phụ trách; không xem được thông tin của các lớp khác trừ khi được BGH phân quyền mở rộng."}
            ],
            "data_entities": [
                {"field": "id", "type": "string (UUID)", "required": True, "desc": "Định danh duy nhất của tài khoản người dùng."},
                {"field": "schoolCode", "type": "string", "required": True, "desc": "Mã trường học (Tenant ID, ví dụ: demo)."},
                {"field": "username", "type": "string", "required": True, "desc": "Tên đăng nhập (mặc định là số điện thoại hoặc email)."},
                {"field": "fullName", "type": "string", "required": True, "desc": "Họ và tên nhân sự (tối thiểu 2 ký tự)."},
                {"field": "email", "type": "string", "required": True, "desc": "Email công vụ nhận thông báo xác thực."},
                {"field": "phone", "type": "string", "required": True, "desc": "Số điện thoại di động chuẩn Việt Nam 10 chữ số."},
                {"field": "role", "type": "enum", "required": True, "desc": "Vai trò: admin, principal, homeroom_teacher, subject_teacher, accountant."},
                {"field": "assignedClassIds", "type": "array<string>", "required": False, "desc": "Danh sách mã lớp được phân công phụ trách."},
                {"field": "status", "type": "enum", "required": True, "desc": "Trạng thái: active (hoạt động), locked (tạm khóa), pending_activation (chờ kích hoạt)."},
                {"field": "failedLoginAttempts", "type": "number", "required": True, "desc": "Số lần đăng nhập sai liên tiếp (0 đến 5)."},
                {"field": "lastLoginAt", "type": "ISO 8601", "required": False, "desc": "Thời điểm đăng nhập gần nhất."},
                {"field": "createdAt", "type": "ISO 8601", "required": True, "desc": "Thời điểm khởi tạo tài khoản."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-032 Quản lý tài khoản & phân quyền", "feature": "Danh sách và quản trị tài khoản người dùng", "platform": "Web Portal", "priority": "P1", "story": "Là Admin trường, tôi muốn quản lý danh sách tài khoản nhân viên để kiểm soát quyền truy cập hệ thống.", "jira": "TK-001"},
                {"epic": "E-032 Quản lý tài khoản & phân quyền", "feature": "Phân vai trò và phân công lớp học", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn phân công giáo viên vào từng lớp để giáo viên thao tác đúng dữ liệu lớp mình.", "jira": "TK-002"},
                {"epic": "E-032 Quản lý tài khoản & phân quyền", "feature": "Khóa, mở khóa và cấp lại mật khẩu", "platform": "Web Portal", "priority": "P1", "story": "Là Admin, tôi muốn cấp lại mật khẩu hoặc mở khóa khi giáo viên quên mật khẩu.", "jira": "TK-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-TK-01",
                    "name": "Khởi tạo tài khoản nhân sự mới",
                    "actor": "Quản trị viên trường (Admin)",
                    "pre": "Đăng nhập hệ thống bằng tài khoản quyền Admin; đã có danh sách vai trò hệ thống.",
                    "happy_path": [
                        "1. Người dùng truy cập Cấu hình -> Tài khoản và bấm nút 'Thêm tài khoản'.",
                        "2. Điền thông tin Họ tên, Email, Số điện thoại và chọn Vai trò chuyên môn.",
                        "3. Nếu vai trò là Giáo viên, chọn thêm danh sách lớp phụ trách từ dropdown.",
                        "4. Bấm 'Lưu tài khoản' -> Hệ thống kiểm tra trùng lặp email/SĐT.",
                        "5. Hệ thống tạo tài khoản ở trạng thái 'Chờ kích hoạt' và gửi mã xác thực mật khẩu tạm tới SĐT/Email của nhân viên."
                    ],
                    "exceptions": [
                        "Email hoặc SĐT đã tồn tại: Hệ thống báo lỗi 'Số điện thoại hoặc Email đã được liên kết với một tài khoản khác'.",
                        "Chưa chọn vai trò: Báo lỗi 'Vui lòng chọn vai trò cho tài khoản'."
                    ],
                    "post": "Tài khoản mới xuất hiện trên danh sách với trạng thái Chờ kích hoạt.",
                    "rules": "BR-01, BR-02"
                },
                {
                    "id": "UC-TK-02",
                    "name": "Khóa và mở khóa tài khoản nhân sự",
                    "actor": "Quản trị viên trường (Admin)",
                    "pre": "Tài khoản đích đang ở trạng thái Hoạt động hoặc Bị khóa.",
                    "happy_path": [
                        "1. Tìm kiếm tài khoản cần xử lý trên bảng danh sách.",
                        "2. Bấm vào icon menu thao tác ba chấm (...) tại dòng tài khoản.",
                        "3. Chọn 'Khóa tài khoản' (hoặc 'Mở khóa tài khoản').",
                        "4. Nhập lý do thay đổi trạng thái vào modal xác nhận.",
                        "5. Bấm 'Xác nhận' -> Hệ thống cập nhật trạng thái và thu hồi token phiên làm việc hiện tại của tài khoản nếu bị khóa."
                    ],
                    "exceptions": [
                        "Tự khóa tài khoản của chính mình: Hệ thống ngăn chặn với thông báo 'Không thể tự khóa tài khoản quản trị đang đăng nhập'."
                    ],
                    "post": "Trạng thái tài khoản thay đổi ngay lập tức; phiên đăng nhập bị hủy nếu bị khóa.",
                    "rules": "BR-03, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Cấu hình</strong> -> Chọn <strong>Tài khoản</strong> (`/[schoolCode]/setting/users`).",
            "screens_table": [
                {"screen": "SCR-TK-01: Danh sách tài khoản", "component": "Thanh tìm kiếm & Bộ lọc vai trò", "format": "Input Search + Select Role + Select Status", "desc": "Tìm nhanh theo tên, SĐT, email; lọc theo vai trò (BGH, GV, Kế toán) và trạng thái (Hoạt động/Tạm khóa).", "note": "Gõ tìm kiếm debounce 300ms"},
                {"screen": "SCR-TK-01: Danh sách tài khoản", "component": "Bảng dữ liệu tài khoản (UserTable)", "format": "Responsive Table", "desc": "Hiển thị: Avatar, Họ tên, Mã nhân viên, Vai trò (Badge màu tương ứng), Email, SĐT, Lớp phân công, Trạng thái, Thao tác.", "note": "Hỗ trợ phân trang 20 dòng/trang"},
                {"screen": "SCR-TK-01: Danh sách tài khoản", "component": "Nút tác vụ chính", "format": "Primary Button (Vàng ECO)", "desc": "Nút '+ Thêm tài khoản' và 'Xuất danh sách Excel'.", "note": "Chỉ Admin nhìn thấy"},
                {"screen": "SCR-TK-02: Modal Thêm/Sửa tài khoản", "component": "Form thông tin định danh", "format": "Modal Dialog", "desc": "Các trường Họ tên*, SĐT*, Email*, CCCD, Vai trò*, Danh sách lớp phụ trách (Multi-select Tag).", "note": "Xác thực form theo BR-01"},
                {"screen": "SCR-TK-03: Modal Đặt lại mật khẩu", "component": "Popup cấp lại mật khẩu", "format": "Confirmation Modal", "desc": "Hiển thị thông báo gửi mật khẩu tạm thời qua SMS hoặc nhập mật khẩu mới trực tiếp.", "note": "Yêu cầu nhập mật khẩu Admin để xác thực"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Tạo tài khoản mới thành công với dữ liệu hợp lệ",
                "scenario": "Given Quản trị viên đang ở màn hình Thêm tài khoản\nWhen điền đầy đủ Họ tên, SĐT 10 số, Email hợp lệ và chọn Vai trò Giáo viên kèm lớp phụ trách\nThen hệ thống lưu tài khoản thành công, hiển thị Toast xanh 'Đã khởi tạo tài khoản thành công' và gửi thông báo kích hoạt đến người dùng."
            },
            {
                "id": "AC-02",
                "title": "Chặn tạo tài khoản khi trùng lặp SĐT hoặc Email",
                "scenario": "Given form Thêm tài khoản\nWhen người dùng nhập Email hoặc SĐT đã tồn tại trên trường khác hoặc cùng trường\nThen hệ thống chặn thao tác lưu và hiển thị thông báo lỗi viền đỏ tại trường dữ liệu tương ứng."
            },
            {
                "id": "AC-03",
                "title": "Tự động khóa tài khoản khi đăng nhập sai 5 lần",
                "scenario": "Given tài khoản đang ở trạng thái Hoạt động\nWhen người dùng nhập sai mật khẩu liên tiếp 5 lần tại màn hình Đăng nhập\nThen hệ thống tự động chuyển trạng thái tài khoản sang Bị khóa trong 30 phút và hiển thị thông báo liên hệ Admin."
            },
            {
                "id": "AC-04",
                "title": "Thu hồi phiên làm việc tức thì khi khóa tài khoản",
                "scenario": "Given người dùng đang thao tác trên Web Portal\nWhen Quản trị viên thực hiện khóa tài khoản đó tại màn hình Quản lý tài khoản\nThen ở request tiếp theo, phiên làm việc của người dùng bị hủy và tự động chuyển hướng về trang Đăng nhập."
            }
        ],
        "nfr": {
            "performance": [
                "Thời gian tải bảng danh sách tài khoản < 300ms đối với quy mô trường 500 nhân sự.",
                "Tốc độ băm và xác thực mật khẩu qua thuật toán Argon2id tối ưu < 250ms trên backend container."
            ],
            "security": [
                "Tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về bảo mật thông tin cá nhân giáo viên và học sinh.",
                "Mã hóa AES-256 các trường nhạy cảm (CCCD, SĐT) trong cơ sở dữ liệu.",
                "Không ghi mật khẩu dưới dạng plaintext trong bất kỳ file log nào."
            ],
            "accessibility": [
                "Đáp ứng tiêu chuẩn WCAG 2.1 AA cho độ tương phản màu sắc của các Badge trạng thái.",
                "Hỗ trợ điều hướng bằng phím Tab và phím mũi tên trên toàn bộ bảng tài khoản."
            ]
        },
        "appendix": {
            "notifications": [
                {"id": "NOTI-TK-01", "event": "Khởi tạo tài khoản thành công", "recipient": "Người dùng mới", "body": "Chào mừng Thầy/Cô gia nhập hệ thống QLTH {ten_truong}. Mật khẩu tạm thời của bạn là: {mat_khau_tam}.", "onclick": "Mở trang Đăng nhập"},
                {"id": "NOTI-TK-02", "event": "Tài khoản bị khóa", "recipient": "Admin trường & Chủ tài khoản", "body": "Cảnh báo: Tài khoản {email} vừa bị tạm khóa do nhập sai mật khẩu quá 5 lần liên tiếp.", "onclick": "Mở chi tiết tài khoản"}
            ],
            "edge_cases": [
                {"case": "Nhân viên kiêm nhiệm nhiều vai trò (vừa là GVCN vừa là Tổ trưởng bộ môn)", "risk": "Xung đột quyền hạn truy cập", "solution": "Hệ thống hỗ trợ gán nhiều vai trò (Multi-role); quyền hạn của tài khoản là tập hợp hợp (Union) của tất cả vai trò được gán."},
                {"case": "Mất kết nối mạng khi đang gửi mã kích hoạt SMS", "risk": "Người dùng không nhận được mật khẩu", "solution": "Hệ thống hỗ trợ nút 'Gửi lại mã kích hoạt' với cơ chế chống spam (khoảng cách tối thiểu 60s giữa 2 lần gửi)."}
            ]
        }
    },

    # 2. M7/SM2 - Đăng nhập
    {
        "code": "M7/SM2",
        "name": "M7 - SM2 - Đăng nhập",
        "parent_module": "M7",
        "parent_category": "8. Portal QLTH > M7 - Khác",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Cổng xác thực đăng nhập <strong>Authentication &amp; Session Management</strong> thuộc nhóm <strong>M7: Khác</strong> là cửa ngõ truy cập duy nhất vào hệ thống School Operating Portal. Trong kiến trúc SaaS multi-tenant, phân hệ này giải quyết bài toán định danh chính xác trường học theo tiền tố đường dẫn `/{schoolCode}`, xác thực danh tính người dùng bằng phiên mã hóa an toàn JWT/JWE, tích hợp cơ chế bảo vệ phiên đăng nhập CSRF, cookie HTTP-Only và hỗ trợ chuyển đổi trường học đối với cán bộ quản lý nhiều cơ sở.",
            "goals_list": [
                "Xác thực danh tính an toàn qua cặp định danh Tên đăng nhập/Email/SĐT và Mật khẩu.",
                "Hỗ trợ kiến trúc đa người thuê (Multi-tenancy): tự động phát hiện `schoolCode` từ URL và tải cấu hình nhận diện thương hiệu (Logo, Tên trường) tương ứng.",
                "Quản lý phiên làm việc thông qua JSON Web Token (JWT) mã hóa, lưu trong Cookie an toàn (HttpOnly, Secure, SameSite=Strict).",
                "Bảo vệ hệ thống trước các cuộc tấn công Brute-force, Replay attack và đánh cắp phiên (Session Hijacking).",
                "Hỗ trợ cơ chế 'Quên mật khẩu' tự phục vụ qua mã OTP gửi về số điện thoại đã xác minh."
            ],
            "target_users": [
                {"group": "Toàn bộ người dùng", "role": "Mọi vai trò đăng nhập", "actions": "Đăng nhập, duy trì phiên làm việc, đổi mật khẩu lần đầu, khôi phục mật khẩu quên và đăng xuất an toàn."},
                {"group": "Quản trị viên Finviet", "role": "Hỗ trợ kỹ thuật", "actions": "Giám sát lưu lượng đăng nhập, phát hiện IP bất thường và duy trì chứng chỉ SSL/TLS."}
            ],
            "glossary": [
                {"term": "Multi-tenant Path", "definition": "Cấu trúc URL có tiền tố mã trường, ví dụ: domain.vn/demo/login."},
                {"term": "JWE / JWT", "definition": "JSON Web Encryption / Token - Tiêu chuẩn mã hóa token phiên làm việc bảo mật cao."},
                {"term": "HttpOnly Cookie", "definition": "Cờ bảo mật ngăn chặn JavaScript phía client truy cập vào cookie phiên, chống XSS."}
            ]
        },
        "business": {
            "flow_desc": "Luồng đăng nhập đa người thuê: Nhận diện trường -> Nhập thông tin xác thực -> Kiểm tra trạng thái tài khoản -> Cấp phát token phiên -> Điều hướng về Dashboard phân hệ.",
            "flow_steps": [
                {"actor": "Người dùng", "action": "Truy cập đường dẫn trường", "desc": "Truy cập URL `https://portal.domain.vn/{schoolCode}/login`."},
                {"actor": "Hệ thống Web", "action": "Tải thương hiệu trường", "desc": "Đọc `schoolCode`, tải tên trường, logo và màu sắc chủ đạo từ Cấu hình trường M6/SM1."},
                {"actor": "Người dùng", "action": "Nhập thông tin xác thực", "desc": "Điền Tên đăng nhập / Số điện thoại và Mật khẩu cá nhân."},
                {"actor": "Hệ thống BE", "action": "Xác thực danh tính", "desc": "Kiểm tra mật khẩu băm, kiểm tra trạng thái khóa tài khoản và kiểm tra quyền truy cập tenant."},
                {"actor": "Hệ thống BE", "action": "Khởi tạo phiên", "desc": "Phát hành JWE session token vào Cookie HttpOnly và điều hướng người dùng vào Dashboard tương ứng."}
            ],
            "steps_narrative": [
                "Bước 1: Người dùng nhập URL của trường học hoặc quét mã QR do nhà trường cung cấp.",
                "Bước 2: Trang đăng nhập hiển thị đúng tên trường, logo nhận diện và form đăng nhập chuẩn ECO FINVIET.",
                "Bước 3: Nhập thông tin đăng nhập. Có thể chọn ghi nhớ tài khoản trên thiết bị cá nhân.",
                "Bước 4: Bấm 'Đăng nhập'. Hệ thống xác thực dữ liệu qua API `/api/1.0/auth/login` với thời gian phản hồi < 200ms.",
                "Bước 5: Nếu tài khoản đang ở trạng thái 'Yêu cầu đổi mật khẩu lần đầu', hệ thống bắt buộc chuyển hướng đến màn hình tạo mật khẩu mới trước khi vào portal."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo vệ cách ly Tenant", "desc": "Tài khoản của trường A tuyệt đối không thể đăng nhập vào đường dẫn của trường B; hệ thống trả về thông báo 'Tài khoản không thuộc đơn vị trường học này'."},
                {"id": "BR-02", "title": "Thời hạn phiên làm việc (Session Timeout)", "desc": "Phiên đăng nhập Web Portal mặc định có hiệu lực 8 giờ làm việc; tự động đăng xuất sau 30 phút không có thao tác (Idle timeout) để bảo vệ dữ liệu."},
                {"id": "BR-03", "title": "Bắt buộc đổi mật khẩu lần đầu", "desc": "Tài khoản mới được cấp mật khẩu tạm thời bắt buộc phải hoàn thành việc đổi mật khẩu mới mới được phép truy cập vào các tính năng bên trong."},
                {"id": "BR-04", "title": "Giới hạn tần suất gọi API đăng nhập (Rate Limiting)", "desc": "Giới hạn tối đa 10 lượt đăng nhập sai trong 1 phút từ cùng một địa chỉ IP để chống tấn công từ chối dịch vụ."}
            ],
            "data_entities": [
                {"field": "loginId", "type": "string", "required": True, "desc": "Số điện thoại, email hoặc tên đăng nhập của nhân sự."},
                {"field": "password", "type": "string", "required": True, "desc": "Mật khẩu xác thực (truyền qua kênh HTTPS mã hóa TLS 1.3)."},
                {"field": "schoolCode", "type": "string", "required": True, "desc": "Mã định danh tenant trường học."},
                {"field": "rememberMe", "type": "boolean", "required": False, "desc": "Tùy chọn kéo dài thời hạn phiên đăng nhập."},
                {"field": "deviceFingerprint", "type": "string", "required": False, "desc": "Dấu vân tay trình duyệt phục vụ kiểm toán an ninh."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-039 Đăng nhập & Xác thực", "feature": "Màn hình đăng nhập đa người thuê", "platform": "Web Portal", "priority": "P1", "story": "Là Người dùng, tôi muốn đăng nhập vào đúng trường học của mình một cách an toàn.", "jira": "DN-001"},
                {"epic": "E-039 Đăng nhập & Xác thực", "feature": "Khôi phục mật khẩu tự phục vụ", "platform": "Web Portal", "priority": "P1", "story": "Là Người dùng, tôi muốn tự lấy lại mật khẩu qua mã OTP khi bị quên.", "jira": "DN-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-DN-01",
                    "name": "Đăng nhập hệ thống thành công",
                    "actor": "Người dùng đã có tài khoản",
                    "pre": "Tài khoản đang ở trạng thái Hoạt động; đúng URL trường học.",
                    "happy_path": [
                        "1. Người dùng mở trang `/{schoolCode}/login`.",
                        "2. Nhập chính xác tên đăng nhập và mật khẩu.",
                        "3. Bấm nút 'Đăng nhập'.",
                        "4. Hệ thống xác thực thành công, ghi nhận token phiên.",
                        "5. Chuyển hướng người dùng về trang Tổng quan hoặc module phân công."
                    ],
                    "exceptions": [
                        "Sai mật khẩu: Báo lỗi 'Thông tin đăng nhập không chính xác. Bạn còn {n} lần thử'.",
                        "Tài khoản bị khóa: Báo lỗi 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên'."
                    ],
                    "post": "Thiết lập phiên làm việc thành công; Cookie HttpOnly được lưu trữ.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập trực tiếp đường dẫn `/[schoolCode]/login` trên trình duyệt web.",
            "screens_table": [
                {"screen": "SCR-DN-01: Màn hình Đăng nhập", "component": "Card đăng nhập trung tâm", "format": "Centered Form Card", "desc": "Chứa Logo trường, Tiêu đề 'Đăng nhập hệ thống QLTH', Tên trường nhận diện, Input Tên đăng nhập, Input Mật khẩu (có icon ẩn/hiện mắt), Checkbox 'Ghi nhớ đăng nhập', Nút 'Đăng nhập' (Vàng ECO DS).", "note": "Thiết kế chuẩn ECO Design System"},
                {"screen": "SCR-DN-01: Màn hình Đăng nhập", "component": "Liên kết Quên mật khẩu", "format": "Text Link", "desc": "Nằm ngay dưới ô mật khẩu, click mở modal khôi phục tài khoản qua OTP.", "note": "Màu xanh thương hiệu Finviet #0070CE"},
                {"screen": "SCR-DN-02: Modal Quên mật khẩu", "component": "Form nhập SĐT nhận OTP", "format": "Modal Dialog", "desc": "Nhập số điện thoại đã đăng ký, bấm 'Gửi mã xác thực' -> Nhập OTP 6 số -> Thiết lập mật khẩu mới.", "note": "Đếm ngược thời gian OTP 60 giây"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Hiển thị đúng thương hiệu trường theo URL",
                "scenario": "Given người dùng truy cập vào đường dẫn '/demo/login'\nWhen trang đăng nhập tải xong\nThen giao diện hiển thị đúng tên trường 'Trường Tiểu học Demo FINVIET' và logo của trường tương ứng."
            },
            {
                "id": "AC-02",
                "title": "Đăng nhập thành công và thiết lập Cookie an toàn",
                "scenario": "Given người dùng nhập đúng tên đăng nhập và mật khẩu hợp lệ\nWhen bấm nút 'Đăng nhập'\nThen hệ thống chuyển hướng vào trang chính trong < 500ms và Cookie phiên được thiết lập với đầy đủ thuộc tính HttpOnly và Secure."
            },
            {
                "id": "AC-03",
                "title": "Chặn đăng nhập sai tenant",
                "scenario": "Given tài khoản thuộc trường A\nWhen cố tình đăng nhập tại URL của trường B\nThen hệ thống từ chối đăng nhập và hiển thị thông báo lỗi 'Tài khoản không thuộc đơn vị trường học này'."
            }
        ],
        "nfr": {
            "performance": [
                "Thời gian hoàn tất xác thực đăng nhập API < 200ms.",
                "Trang đăng nhập tối ưu dung lượng tải ban đầu < 150KB."
            ],
            "security": [
                "Toàn bộ kết nối bắt buộc sử dụng giao thức HTTPS với chứng chỉ SSL/TLS 1.3.",
                "Chống tấn công XSS thông qua việc không lưu trữ token trong LocalStorage."
            ]
        }
    },

    # 3. M5/SM13 - Năm học
    {
        "code": "M5/SM13",
        "name": "M5 - SM13 - Năm học",
        "parent_module": "M5",
        "parent_category": "8. Portal QLTH > M5 - Nhà trường",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý niên khóa &amp; Năm học (Academic Year Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> giữ vai trò trục xương sống về mặt thời gian cho toàn bộ hoạt động học tập, tài chính và nhân sự trong trường học. Mọi dữ liệu phân lớp (M5/SM3), phân công giáo viên (M5/SM2), biểu phí học phí (M4/SM4) và sổ điểm đánh giá (M3/SM3) đều gắn liền với một Năm học cụ thể theo <strong>Khung kế hoạch thời gian năm học do Bộ Giáo dục &amp; Đào tạo ban hành hàng năm</strong>.",
            "goals_list": [
                "Thiết lập và quản lý danh mục niên khóa học (ví dụ: 2025-2026, 2026-2027) với đầy đủ ngày khai giảng và ngày kết thúc năm học.",
                "Cấu hình các học kỳ trong năm học (Học kỳ 1, Học kỳ 2, Khóa hè) kèm mốc thời gian chốt sổ đánh giá.",
                "Cung cấp cơ chế chuyển giao niên khóa (Year-end Transition): kết chuyển trạng thái học sinh, lên lớp và lưu trữ dữ liệu cũ.",
                "Xác định duy nhất một năm học ở trạng thái 'Hiện hành' (Active Year) để làm ngữ cảnh mặc định cho toàn portal."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Lãnh đạo chuyên môn", "actions": "Phê duyệt kế hoạch năm học, kích hoạt năm học mới và thực hiện quy trình kết chuyển cuối năm."},
                {"group": "Giáo vụ / Kế toán", "role": "Vận hành", "actions": "Theo dõi các mốc thời gian học kỳ để lên thời khóa biểu và xuất hóa đơn học phí theo kỳ."}
            ],
            "glossary": [
                {"term": "Niên khóa", "definition": "Khoảng thời gian một năm học, thường kéo dài từ tháng 9 năm trước đến tháng 5 năm sau."},
                {"term": "Năm học hiện hành", "definition": "Năm học đang diễn ra, làm bộ lọc mặc định cho tất cả các màn hình tác nghiệp."},
                {"term": "Kết chuyển niên khóa", "definition": "Quy trình chuyển học sinh lên lớp mới khi kết thúc năm học cũ."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình khởi tạo năm học mới -> Cấu hình học kỳ -> Kích hoạt năm học hiện hành -> Vận hành -> Đóng sổ và kết chuyển niên khóa.",
            "flow_steps": [
                {"actor": "BGH / Giáo vụ", "action": "Khởi tạo năm học mới", "desc": "Nhập tên năm học (VD: 2026-2027), chọn ngày bắt đầu (05/09/2026) và ngày kết thúc (31/05/2027)."},
                {"actor": "BGH", "action": "Thiết lập học kỳ", "desc": "Cấu hình ngày bắt đầu và kết thúc của Học kỳ 1 và Học kỳ 2."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra ràng buộc thời gian", "desc": "Đảm bảo các khoảng thời gian học kỳ không bị chồng chéo và nằm trọn trong niên khóa."},
                {"actor": "BGH", "action": "Kích hoạt năm hiện hành", "desc": "Chuyển trạng thái năm học sang Active; hệ thống tự động đổi ngữ cảnh toàn trường sang năm mới."}
            ],
            "steps_narrative": [
                "Bước 1: Giáo vụ vào Nhà trường -> Năm học, xem danh sách các niên khóa đã thiết lập.",
                "Bước 2: Bấm nút 'Thêm năm học', nhập tên niên khóa theo định dạng chuẩn YYYY-YYYY.",
                "Bước 3: Chọn mốc thời gian: Ngày bắt đầu niên khóa, Ngày kết thúc niên khóa, Thời gian HK1, Thời gian HK2.",
                "Bước 4: Bấm 'Lưu'. Hệ thống tạo năm học mới ở trạng thái 'Sắp diễn ra'.",
                "Bước 5: Khi đến thời điểm khai giảng, BGH bấm 'Kích hoạt năm học hiện hành' để mở khóa các phân hệ phân lớp và thu phí."
            ],
            "rules": [
                {"id": "BR-01", "title": "Duy nhất một năm học hiện hành", "desc": "Tại một thời điểm, toàn trường chỉ có duy nhất 1 năm học ở trạng thái 'Đang áp dụng' (Active). Khi kích hoạt năm học mới, năm học cũ tự động chuyển sang 'Đã kết thúc'."},
                {"id": "BR-02", "title": "Tính toàn vẹn mốc thời gian", "desc": "Ngày kết thúc năm học phải lớn hơn ngày bắt đầu tối thiểu 8 tháng; thời gian Học kỳ 2 phải nối tiếp sau Học kỳ 1 và không bị chồng lấn ngày."},
                {"id": "BR-03", "title": "Bảo vệ năm học đã phát sinh dữ liệu", "desc": "Không cho phép xóa bất kỳ năm học nào đã có lớp học, học sinh, giao dịch tài chính hoặc điểm số; chỉ được phép chỉnh sửa tên hiển thị hoặc ghi chú."}
            ],
            "data_entities": [
                {"field": "id", "type": "string", "required": True, "desc": "Mã năm học (ví dụ: nam-hoc-2026-2027)."},
                {"field": "name", "type": "string", "required": True, "desc": "Tên năm học hiển thị (ví dụ: Năm học 2026 - 2027)."},
                {"field": "startDate", "type": "date (YYYY-MM-DD)", "required": True, "desc": "Ngày bắt đầu năm học."},
                {"field": "endDate", "type": "date (YYYY-MM-DD)", "required": True, "desc": "Ngày kết thúc năm học."},
                {"field": "isCurrent", "type": "boolean", "required": True, "desc": "Cờ đánh dấu năm học hiện hành (True/False)."},
                {"field": "terms", "type": "array<object>", "required": True, "desc": "Danh sách các học kỳ kèm ngày bắt đầu và kết thúc."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-029 Quản lý năm học", "feature": "Danh mục và thiết lập năm học", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn thiết lập năm học và học kỳ để làm khung thời gian vận hành cho trường.", "jira": "NH-001"},
                {"epic": "E-029 Quản lý năm học", "feature": "Chuyển giao năm học hiện hành", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn chuyển năm học hiện hành sang niên khóa mới khi khai giảng.", "jira": "NH-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-NH-01",
                    "name": "Kích hoạt năm học hiện hành",
                    "actor": "Ban Giám Hiệu",
                    "pre": "Năm học đích đã được thiết lập đầy đủ thông tin học kỳ.",
                    "happy_path": [
                        "1. Mở danh sách Năm học tại mục Nhà trường.",
                        "2. Tìm năm học cần kích hoạt và bấm nút 'Đặt làm năm học hiện hành'.",
                        "3. Hệ thống hiển thị modal cảnh báo về việc chuyển đổi ngữ cảnh toàn portal.",
                        "4. BGH bấm 'Xác nhận kích hoạt'.",
                        "5. Hệ thống cập nhật cờ isCurrent=True cho năm học mới và gỡ cờ năm cũ."
                    ],
                    "exceptions": [
                        "Năm học chưa cấu hình ngày: Báo lỗi 'Vui lòng hoàn thành cấu hình thời gian học kỳ trước khi kích hoạt'."
                    ],
                    "post": "Tất cả các bộ lọc năm học trên toàn hệ thống tự động nhận năm học mới.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Năm học</strong> (`/[schoolCode]/school/academic-year`).",
            "screens_table": [
                {"screen": "SCR-NH-01: Danh sách năm học", "component": "Bảng danh mục niên khóa", "format": "Data Table", "desc": "Hiển thị: Tên năm học, Ngày bắt đầu, Ngày kết thúc, Số học kỳ, Trạng thái (Badge 'Hiện hành' xanh lá), Nút Đặt làm hiện hành, Nút Chỉnh sửa.", "note": "Hàng năm học hiện hành có viền xanh nổi bật"},
                {"screen": "SCR-NH-02: Modal Thêm năm học", "component": "Form cấu hình niên khóa & học kỳ", "format": "Modal Dialog", "desc": "Input Tên năm học, DatePicker Ngày bắt đầu/kết thúc năm học, Khung cấu hình ngày bắt đầu/kết thúc cho từng Học kỳ 1 và Học kỳ 2.", "note": "Validate thời gian theo BR-02"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Tạo năm học mới thành công",
                "scenario": "Given form Thêm năm học\nWhen người dùng nhập tên 'Năm học 2026 - 2027' và khoảng thời gian hợp lệ\nThen hệ thống lưu niên khóa mới thành công và hiển thị trong bảng danh sách."
            },
            {
                "id": "AC-02",
                "title": "Chỉ duy nhất một năm học có trạng thái Hiện hành",
                "scenario": "Given năm học 2025-2026 đang là Hiện hành\nWhen BGH bấm đặt năm học 2026-2027 làm Hiện hành\nThen năm 2026-2027 đổi sang Hiện hành và năm 2025-2026 tự động tắt cờ Hiện hành."
            }
        ]
    }
]

print("Milestone 1 Sub-modules Part 1 defined successfully!")

PART1_PRDS.extend([
    # 4. M5/SM5 - Khối lớp
    {
        "code": "M5/SM5",
        "name": "M5 - SM5 - Khối lớp",
        "parent_module": "M5",
        "parent_category": "8. Portal QLTH > M5 - Nhà trường",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý khối lớp (Grade Level Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm chuẩn hóa cấu trúc phân cấp giáo dục đào tạo theo <strong>Điều lệ trường mầm non và phổ thông của Bộ Giáo dục &amp; Đào tạo</strong>. Khối lớp đóng vai trò mắt xích tổ chức trung gian phân chia học sinh theo độ tuổi và trình độ đào tạo (Mầm non: Nhà trẻ, Mầm, Chồi, Lá; Tiểu học: Khối 1 đến Khối 5; THCS: Khối 6 đến Khối 9; THPT: Khối 10 đến Khối 12), làm căn cứ nền tảng để áp dụng chương trình môn học (M5/SM4), khung biểu phí (M4/SM4) và các quy chuẩn đánh giá học lực.",
            "goals_list": [
                "Tự động khởi tạo và chuẩn hóa danh mục khối lớp dựa trên cấu hình Cấp học đăng ký của trường học (M6/SM1).",
                "Quản lý chỉ số sĩ số động: Tự động tổng hợp số lượng lớp học đang mở và tổng số học sinh đang học theo từng khối.",
                "Làm trục phân nhóm bộ lọc cho các nghiệp vụ Thu học phí (M4), Báo cáo chuyên cần (M2) và Quản lý môn học (M5).",
                "Cho phép tùy biến thứ tự hiển thị và tên gọi đặc thù của khối lớp phù hợp với các trường quốc tế / song ngữ."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Lãnh đạo chuyên môn", "actions": "Xem tổng quan quy mô học sinh theo từng khối lớp để phân bổ biên chế giáo viên."},
                {"group": "Giáo vụ / Kế toán", "role": "Vận hành", "actions": "Lọc danh sách học sinh và áp dụng chính sách học phí theo khối lớp."}
            ],
            "glossary": [
                {"term": "Khối lớp (Grade Level)", "definition": "Nhóm tập hợp các lớp học có cùng độ tuổi hoặc cùng chương trình đào tạo của một năm học."},
                {"term": "Cấp học", "definition": "Bậc học theo hệ thống giáo dục quốc dân: Mầm non, Tiểu học, THCS, THPT."}
            ]
        },
        "business": {
            "flow_desc": "Khối lớp được sinh tự động theo cấp học của trường, liên kết với Năm học hiện hành và cập nhật sĩ số thời gian thực khi có biến động lớp học/học sinh.",
            "flow_steps": [
                {"actor": "Hệ thống", "action": "Khởi tạo theo cấp học", "desc": "Tự động sinh các khối tương ứng khi trường đăng ký cấp học (Ví dụ trường liên cấp 1-2 sinh Khối 1 đến Khối 9)."},
                {"actor": "BGH / Giáo vụ", "action": "Kiểm tra danh mục khối", "desc": "Xem danh sách khối kèm số lớp và tổng sĩ số được tính toán thời gian thực."},
                {"actor": "Giáo vụ", "action": "Điều hướng danh sách lớp", "desc": "Click vào khối lớp để chuyển nhanh sang màn hình quản lý lớp học thuộc khối đó."}
            ],
            "steps_narrative": [
                "Bước 1: Giáo vụ vào Nhà trường -> Khối lớp.",
                "Bước 2: Hệ thống hiển thị các thẻ/hàng khối lớp thuộc các cấp học của trường.",
                "Bước 3: Người dùng chọn Năm học tại thanh bộ lọc để xem số liệu phân bổ của niên khóa đó.",
                "Bước 4: Mỗi khối hiển thị: Tên khối, Mã khối, Số lượng lớp đang hoạt động, Tổng số học sinh đang theo học.",
                "Bước 5: Bấm vào dòng khối lớp để mở trực tiếp danh sách các lớp thành viên."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bất biến mã khối chuẩn Bộ GD&ĐT", "desc": "Mã định danh khối lớp (gradeLevelCode) là giá trị cố định theo chuẩn Bộ GD&ĐT (ví dụ: K01, K02... K12), không được phép chỉnh sửa để đảm bảo tích hợp đồng bộ dữ liệu Sở."},
                {"id": "BR-02", "title": "Tính toán sĩ số động thời gian thực", "desc": "Số lượng lớp và tổng sĩ số học sinh của khối được hệ thống tự động đếm dựa trên các lớp học và học sinh có trạng thái Hoạt động trong niên khóa đã chọn."},
                {"id": "BR-03", "title": "Bảo toàn khối lớp", "desc": "Khối lớp là danh mục master data hệ thống, không cho phép xóa thủ công; chỉ ẩn hiển thị nếu trường không có cấp học tương ứng."}
            ],
            "data_entities": [
                {"field": "id", "type": "string", "required": True, "desc": "Mã khối lớp (ví dụ: khoi-1, khoi-2)."},
                {"field": "name", "type": "string", "required": True, "desc": "Tên khối lớp (ví dụ: Khối 1, Khối Lớp Lá)."},
                {"field": "levelCode", "type": "string", "required": True, "desc": "Mã cấp học: pre_k, primary, secondary, high_school."},
                {"field": "sortOrder", "type": "number", "required": True, "desc": "Thứ tự sắp xếp hiển thị từ nhỏ đến lớn."},
                {"field": "totalClasses", "type": "number", "required": False, "desc": "Tổng số lớp học đang hoạt động trong khối."},
                {"field": "totalStudents", "type": "number", "required": False, "desc": "Tổng số học sinh đang theo học trong khối."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-026 Quản lý khối lớp", "feature": "Tổng quan danh mục khối lớp", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn xem tổng quan các khối lớp và sĩ số để nắm bắt quy mô trường.", "jira": "KL-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-KL-01",
                    "name": "Xem danh sách khối lớp và điều hướng lớp học",
                    "actor": "Ban Giám Hiệu / Giáo vụ",
                    "pre": "Đã thiết lập cấp học của trường tại Cấu hình trường M6/SM1.",
                    "happy_path": [
                        "1. Vào Nhà trường -> Khối lớp.",
                        "2. Chọn Năm học trên thanh bộ lọc.",
                        "3. Xem tổng sĩ số và số lớp của từng khối.",
                        "4. Click vào một khối lớp cụ thể để chuyển sang màn hình danh sách lớp học của khối đó."
                    ],
                    "exceptions": [],
                    "post": "Chuyển hướng thành công sang phân hệ Lớp học với bộ lọc khối được áp dụng sẵn.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Khối lớp</strong> (`/[schoolCode]/school/season`).",
            "screens_table": [
                {"screen": "SCR-KL-01: Danh sách khối lớp", "component": "Bảng tổng hợp khối lớp", "format": "Data Table", "desc": "Hiển thị: Thứ tự, Tên khối lớp, Cấp học, Số lượng lớp đang hoạt động, Tổng số học sinh, Thao tác xem chi tiết.", "note": "Hỗ trợ lọc theo Năm học"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Hiển thị chính xác danh mục khối theo cấp học trường",
                "scenario": "Given trường học có cấp học 'Tiểu học'\nWhen người dùng truy cập màn hình Khối lớp\nThen hệ thống hiển thị chính xác 5 khối từ Khối 1 đến Khối 5 với thứ tự chuẩn xác."
            },
            {
                "id": "AC-02",
                "title": "Sĩ số học sinh và số lớp tính toán động chính xác",
                "scenario": "Given Khối 1 có 3 lớp học với tổng cộng 95 học sinh đang hoạt động\nWhen màn hình Khối lớp tải dữ liệu\nThen cột Số lớp hiển thị '3' và cột Tổng học sinh hiển thị '95'."
            }
        ]
    },

    # 5. M5/SM1 - Học sinh
    {
        "code": "M5/SM1",
        "name": "M5 - SM1 - Học sinh",
        "parent_module": "M5",
        "parent_category": "8. Portal QLTH > M5 - Nhà trường",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý hồ sơ học sinh (Student Information System - SIS)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> là trung tâm dữ liệu hạt nhân của toàn bộ nền tảng giáo dục. Hồ sơ học sinh liên kết trực tiếp với dữ liệu Điểm danh (M2/SM1), Học phí (M4/SM1), Nhận diện khuôn mặt AI (M6/SM4), Kết quả học tập (M3/SM3) và Tài khoản phụ huynh (M6/SM2). Theo <strong>Thông tư 28/2020/TT-BGDĐT</strong> ban hành Điều lệ trường tiểu học và <strong>Nghị định 13/2023/NĐ-CP</strong> về bảo vệ dữ liệu cá nhân, thông tin định danh học sinh, hồ sơ sức khỏe, mã định danh cơ sở dữ liệu ngành giáo dục và danh bạ phụ huynh phải được bảo mật, mã hóa và quản lý vòng đời chặt chẽ.",
            "goals_list": [
                "Quản lý hồ sơ điện tử học sinh toàn diện: Mã học sinh duy nhất, Mã định danh CSDL ngành, Họ tên, Ngày sinh, Giới tính, Dân tộc, Địa chỉ thường trú và Hồ sơ y tế dị ứng.",
                "Quản lý mối quan hệ gia đình: Thiết lập Người liên kết chính (Slot 0 - Cha/Mẹ có toàn quyền tài chính & pháp lý) và tối đa 2 Người được ủy quyền đón trẻ (Slot 1, 2 có ảnh chân dung xác thực 6 tháng).",
                "Quản lý trạng thái học tập theo thời gian: Đang học, Bảo lưu, Tạm nghỉ, Đã thôi học, Đã tốt nghiệp.",
                "Hỗ trợ tính năng Nhập/Xuất dữ liệu học sinh hàng loạt bằng tệp mẫu Excel chuẩn hóa, tự động kiểm tra trùng lặp và xác thực dữ liệu.",
                "Tích hợp hồ sơ ảnh nhận diện khuôn mặt phục vụ điểm danh AI tại cổng và gắn thẻ thư viện ảnh lớp."
            ],
            "target_users": [
                {"group": "Giáo vụ trường", "role": "Quản trị dữ liệu học sinh", "actions": "Tiếp nhận hồ sơ nhập học, xếp lớp, cập nhật thông tin cá nhân và chuyển đổi trạng thái học tập."},
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Quản lý lớp phụ trách", "actions": "Xem hồ sơ học sinh trong lớp, cập nhật ghi chú y tế/dị ứng, tra cứu thông tin liên hệ phụ huynh và theo dõi điểm danh hàng ngày."},
                {"group": "Kế toán trường", "role": "Quản lý tài chính", "actions": "Tra cứu mã học sinh để xuất hóa đơn học phí và quản lý chính sách miễn giảm."},
                {"group": "Phụ huynh học sinh", "role": "Người giám hộ", "actions": "Cập nhật ảnh thẻ học sinh, khai báo người đón trẻ ủy quyền và nhận thông báo kết quả học tập."}
            ],
            "glossary": [
                {"term": "Mã định danh CSDL Ngành", "definition": "Mã số định danh học sinh thống nhất trên hệ thống cơ sở dữ liệu của Bộ Giáo dục & Đào tạo (MOET ID)."},
                {"term": "Slot 0 (Người liên kết chính)", "definition": "Phụ huynh đứng tên hợp đồng học phí và hồ sơ học sinh, có quyền quản trị toàn bộ tài khoản và ủy quyền đón con."},
                {"term": "Người đón trẻ ủy quyền", "definition": "Tối đa 2 người thân (ông, bà, cô, dì, tài xế, người giúp việc) được phụ huynh cấp quyền đón con kèm ảnh nhận diện 6 tháng."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình tiếp nhận học sinh -> Nhập liệu hồ sơ & ảnh thẻ -> Gán lớp học -> Liên kết phụ huynh Slot 0 -> Vận hành điểm danh & học phí -> Kết chuyển / Lưu trữ hồ sơ.",
            "flow_steps": [
                {"actor": "Giáo vụ", "action": "Tạo hồ sơ học sinh", "desc": "Nhập thông tin cá nhân, tải ảnh đại diện, điền thông tin phụ huynh và chọn lớp học trong năm học hiện hành."},
                {"actor": "Hệ thống BE", "action": "Xác thực & Cấp mã học sinh", "desc": "Tự động sinh mã học sinh duy nhất (VD: HS-2026-001) và kiểm tra tính hợp lệ của CCCD/SĐT phụ huynh."},
                {"actor": "Hệ thống BE", "action": "Tạo liên kết tài khoản PH", "desc": "Tự động liên kết số điện thoại phụ huynh với tài khoản Mobile App ECO Parent."},
                {"actor": "GVCN / Giáo vụ", "action": "Cập nhật hồ sơ sức khỏe", "desc": "Ghi nhận nhóm máu, tiền sử dị ứng thực phẩm và tình trạng tiêm chủng."},
                {"actor": "Kế toán", "action": "Áp dụng biểu phí", "desc": "Hệ thống tự động đưa học sinh vào danh sách thu học phí của lớp tương ứng tại M4/SM1."}
            ],
            "steps_narrative": [
                "Bước 1: Giáo vụ vào Nhà trường -> Học sinh, chọn khối lớp và lớp học cần quản lý.",
                "Bước 2: Bấm nút '+ Thêm học sinh' (hoặc 'Nhập từ Excel' nếu tuyển sinh đầu cấp).",
                "Bước 3: Điền đầy đủ 4 nhóm thông tin: Thông tin định danh cá nhân, Thông tin học tập & Lớp học, Thông tin phụ huynh liên lạc chính, Thông tin y tế & Bán trú.",
                "Bước 4: Bấm 'Lưu hồ sơ'. Hệ thống kiểm tra trùng lặp SĐT/CCCD và lưu trữ bản ghi vào CSDL.",
                "Bước 5: Khi học sinh chuyển trường hoặc nghỉ học, Giáo vụ chuyển trạng thái sang 'Đã thôi học', hệ thống yêu cầu xác nhận tất toán công nợ M4 trước khi chuyển hồ sơ vào Lưu trữ M5/SM14."
            ],
            "rules": [
                {"id": "BR-01", "title": "Tính duy nhất của Mã học sinh", "desc": "Mã học sinh là duy nhất trong toàn trường và không đổi trong suốt quá trình theo học từ lúc nhập trường đến khi tốt nghiệp."},
                {"id": "BR-02", "title": "Bảo vệ thông tin người liên kết chính (Slot 0)", "desc": "Mỗi học sinh bắt buộc phải có ít nhất 1 Người liên kết chính (Cha hoặc Mẹ) kèm Số điện thoại di động hợp lệ để làm đầu mối liên lạc pháp lý và nhận hóa đơn học phí."},
                {"id": "BR-03", "title": "Ràng buộc dữ liệu khi xóa học sinh", "desc": "Không cho phép xóa học sinh đã có dữ liệu điểm danh, điểm số học tập hoặc giao dịch học phí. Nếu học sinh nghỉ học, chỉ được phép chuyển trạng thái sang 'Đã thôi học' hoặc 'Lưu trữ'."},
                {"id": "BR-04", "title": "Đồng bộ nhận diện khuôn mặt", "desc": "Khi ảnh chân dung của học sinh được cập nhật hoặc thay đổi, hệ thống tự động đánh dấu cờ cần đồng bộ lại mô hình nhận diện khuôn mặt AI tại phân hệ M6/SM4."}
            ],
            "data_entities": [
                {"field": "id", "type": "string", "required": True, "desc": "Mã học sinh nội bộ (ví dụ: hs-001, HS-2026-001)."},
                {"field": "fullName", "type": "string", "required": True, "desc": "Họ và tên học sinh (tối thiểu 2 ký tự)."},
                {"field": "dob", "type": "date (YYYY-MM-DD)", "required": True, "desc": "Ngày tháng năm sinh."},
                {"field": "gender", "type": "enum", "required": True, "desc": "Giới tính: nam (Nam), nu (Nữ)."},
                {"field": "classId", "type": "string", "required": True, "desc": "Mã lớp học hiện tại (liên kết M5/SM3)."},
                {"field": "avatar", "type": "string (URL)", "required": False, "desc": "Đường dẫn ảnh đại diện / ảnh nhận diện khuôn mặt."},
                {"field": "parentName", "type": "string", "required": True, "desc": "Họ tên người liên kết chính (Slot 0)."},
                {"field": "parentPhone", "type": "string", "required": True, "desc": "Số điện thoại phụ huynh chính (10 số, bắt đầu bằng 0)."},
                {"field": "parentRelationship", "type": "enum", "required": True, "desc": "Quan hệ: Bố, Mẹ, Người giám hộ hợp pháp."},
                {"field": "status", "type": "enum", "required": True, "desc": "Trạng thái: dang_hoc (Đang học), bao_luu (Bảo lưu), thoi_hoc (Thôi học)."},
                {"field": "allergies", "type": "string", "required": False, "desc": "Ghi chú dị ứng thực phẩm và thuốc."},
                {"field": "joinedDate", "type": "date", "required": True, "desc": "Ngày nhập học tại trường."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-024 Quản lý hồ sơ học sinh", "feature": "Danh sách và hồ sơ học sinh", "platform": "Web Portal", "priority": "P1", "story": "Là Giáo vụ, tôi muốn quản lý danh sách học sinh theo lớp để theo dõi thông tin học tập của các em.", "jira": "HS-001"},
                {"epic": "E-024 Quản lý hồ sơ học sinh", "feature": "Nhập xuất dữ liệu học sinh bằng Excel", "platform": "Web Portal", "priority": "P1", "story": "Là Giáo vụ, tôi muốn nhập danh sách học sinh đầu năm bằng file Excel để tiết kiệm thời gian.", "jira": "HS-002"},
                {"epic": "E-024 Quản lý hồ sơ học sinh", "feature": "Liên kết phụ huynh và người đón trẻ", "platform": "Web Portal", "priority": "P1", "story": "Là GVCN, tôi muốn tra cứu thông tin người đón bé để bàn giao an toàn giờ tan trường.", "jira": "HS-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-HS-01",
                    "name": "Thêm mới hồ sơ học sinh",
                    "actor": "Giáo vụ trường / Admin",
                    "pre": "Đã có danh sách lớp học được tạo trong năm học hiện hành.",
                    "happy_path": [
                        "1. Vào Nhà trường -> Học sinh, bấm '+ Thêm học sinh'.",
                        "2. Điền Họ và tên, Ngày sinh, Giới tính, chọn Lớp học.",
                        "3. Điền Họ tên phụ huynh chính, Số điện thoại và Quan hệ.",
                        "4. Tùy chọn tải ảnh thẻ chân dung và nhập ghi chú dị ứng.",
                        "5. Bấm 'Lưu hồ sơ' -> Hệ thống xác nhận và tạo mã học sinh thành công."
                    ],
                    "exceptions": [
                        "Số điện thoại phụ huynh không đúng định dạng: Báo lỗi 'Số điện thoại phải gồm 10 chữ số bắt đầu bằng 0'.",
                        "Bỏ trống trường bắt buộc: Hệ thống highlight đỏ các trường thiếu."
                    ],
                    "post": "Học sinh mới xuất hiện trong danh sách lớp và danh sách điểm danh hàng ngày.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Học sinh</strong> (`/[schoolCode]/school/kid/accounts`).",
            "screens_table": [
                {"screen": "SCR-HS-01: Danh sách học sinh", "component": "Thanh tìm kiếm & Bộ lọc Lớp", "format": "Input Search + Select Khối + Select Lớp + Select Trạng thái", "desc": "Tìm nhanh theo tên học sinh, mã HS hoặc SĐT phụ huynh; lọc theo lớp cụ thể.", "note": "Debounce tìm kiếm 300ms"},
                {"screen": "SCR-HS-01: Danh sách học sinh", "component": "Bảng dữ liệu học sinh", "format": "Responsive Data Table", "desc": "Hiển thị: Ảnh đại diện, Mã HS, Họ tên, Ngày sinh, Giới tính, Lớp, Phụ huynh liên hệ, SĐT, Trạng thái (Đang học/Bảo lưu), Thao tác (Xem/Sửa/Chuyển lớp).", "note": "Hỗ trợ checkbox chọn nhiều học sinh"},
                {"screen": "SCR-HS-01: Danh sách học sinh", "component": "Cụm nút tác vụ hàng đầu", "format": "Action Buttons", "desc": "Nút '+ Thêm học sinh', 'Nhập Excel', 'Xuất Excel', 'Chuyển lớp hàng loạt'.", "note": "Màu vàng ECO DS nổi bật"},
                {"screen": "SCR-HS-02: Form Thêm/Sửa hồ sơ học sinh", "component": "Form nhập liệu đa tab", "format": "Modal Dialog / Full Page", "desc": "Các khu vực: 1. Thông tin cá nhân (Họ tên*, Ngày sinh*, Giới tính*, Nơi sinh, CCCD/Mã định danh); 2. Thông tin học tập (Lớp học*, Ngày nhập học*, Trạng thái*); 3. Phụ huynh liên hệ (Họ tên PH*, SĐT*, Quan hệ*, Email, Địa chỉ); 4. Y tế bán trú (Dị ứng, Chế độ ăn).", "note": "Validate chặt chẽ theo BR-02"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Thêm học sinh mới thành công",
                "scenario": "Given form Thêm học sinh\nWhen người dùng điền đầy đủ Họ tên, Ngày sinh, Giới tính, chọn Lớp học và nhập đúng SĐT phụ huynh 10 số\nThen hệ thống lưu hồ sơ thành công, sinh mã học sinh duy nhất và hiển thị Toast thông báo thành công."
            },
            {
                "id": "AC-02",
                "title": "Kiểm tra hợp lệ số điện thoại phụ huynh",
                "scenario": "Given form Thêm học sinh\nWhen người dùng nhập số điện thoại phụ huynh không đủ 10 số hoặc chứa chữ cái\nThen hệ thống chặn thao tác lưu và hiển thị thông báo lỗi 'Số điện thoại không hợp lệ'."
            },
            {
                "id": "AC-03",
                "title": "Chuyển lớp học sinh cập nhật dữ liệu liên thông",
                "scenario": "Given học sinh đang ở Lớp 1A1\nWhen Giáo vụ thực hiện chuyển học sinh sang Lớp 1A2 trong năm học hiện tại\nThen học sinh tự động xuất hiện trong danh sách điểm danh và danh sách thu phí của Lớp 1A2 và rời khỏi Lớp 1A1."
            }
        ],
        "nfr": {
            "performance": ["Thời gian tải danh sách 50 học sinh trong lớp < 200ms."],
            "security": ["Mã hóa số điện thoại phụ huynh và thông tin y tế dị ứng theo chuẩn Nghị định 13/2023/NĐ-CP."]
        }
    },

    # 6. M5/SM3 - Lớp học
    {
        "code": "M5/SM3",
        "name": "M5 - SM3 - Lớp học",
        "parent_module": "M5",
        "parent_category": "8. Portal QLTH > M5 - Nhà trường",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý lớp học (Class &amp; Section Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> là đơn vị tổ chức học tập cơ sở của trường học. Mọi nghiệp vụ vận hành hàng ngày (Điểm danh M2/SM1, Hoạt động học tập M2/SM2, Album ảnh M2/SM3, Kênh trò chuyện phụ huynh M2/SM4), học tập (Thời khóa biểu M3/SM1, Bài tập M3/SM2, Sổ điểm M3/SM3) và tài chính (Biểu phí M4/SM4, Hóa đơn học phí M4/SM1) đều lấy Lớp học làm đơn vị quy chiếu trung tâm.",
            "goals_list": [
                "Khởi tạo và quản lý danh mục lớp học theo từng Khối lớp (M5/SM5) và Năm học (M5/SM13).",
                "Phân công Giáo viên chủ nhiệm (GVCN) chịu trách nhiệm chính và tối đa 2 giáo viên phụ trách/trợ giảng.",
                "Cấu hình các thông số lớp học: Sĩ số tối đa, Phòng học, Phân loại lớp (Chính khóa bán trú, Bán trú, Tăng cường ngoại ngữ, Câu lạc bộ năng khiếu).",
                "Kiểm soát sĩ số lớp học thực tế và tự động cảnh báo khi sĩ số chạm ngưỡng giới hạn quy định.",
                "Đồng bộ liên thông dữ liệu lớp học sang Thời khóa biểu, Sổ điểm danh và Hóa đơn học phí."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Lãnh đạo nhà trường", "actions": "Phê duyệt mở lớp mới, phân bổ GVCN và giám sát sĩ số các lớp."},
                {"group": "Giáo vụ trường", "role": "Quản trị viên lớp học", "actions": "Tạo lớp, cập nhật phòng học, gán giáo viên và chuyển lớp học sinh."},
                {"group": "Giáo viên chủ nhiệm", "role": "Quản lý lớp", "actions": "Thực hiện điểm danh, đăng bài hoạt động và trao đổi với phụ huynh của lớp mình."}
            ],
            "glossary": [
                {"term": "GVCN", "definition": "Giáo viên chủ nhiệm - người chịu trách nhiệm quản lý toàn diện học sinh trong một lớp học."},
                {"term": "Sĩ số tối đa", "definition": "Số lượng học sinh tối đa được phép tiếp nhận vào lớp học theo quy chuẩn diện tích phòng học của Bộ GD&ĐT."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình tạo lớp học mới -> Gán GVCN -> Tiếp nhận học sinh -> Vận hành giảng dạy & thu phí -> Đóng sổ lớp học cuối năm.",
            "flow_steps": [
                {"actor": "BGH / Giáo vụ", "action": "Khởi tạo lớp học", "desc": "Nhập tên lớp (VD: Lớp 1A1), chọn Khối lớp (Khối 1), chọn Năm học và chỉ định phòng học."},
                {"actor": "BGH", "action": "Phân công GVCN", "desc": "Chọn giáo viên từ danh mục Giáo viên M5/SM2 làm chủ nhiệm lớp."},
                {"actor": "Hệ thống BE", "action": "Cấp quyền truy cập", "desc": "Tự động cấp quyền quản lý điểm danh, trao đổi và sổ điểm lớp cho tài khoản của GVCN."},
                {"actor": "Giáo vụ", "action": "Xếp học sinh vào lớp", "desc": "Thêm học sinh vào lớp; hệ thống tự động cập nhật sĩ số thời gian thực."}
            ],
            "steps_narrative": [
                "Bước 1: Người dùng vào Nhà trường -> Lớp học, xem danh sách các lớp trong niên khóa hiện tại.",
                "Bước 2: Bấm nút 'Thêm lớp học', nhập Tên lớp (phải là duy nhất trong khối), chọn Khối lớp áp dụng.",
                "Bước 3: Chọn Giáo viên chủ nhiệm từ danh sách cán bộ giáo viên đang hoạt động.",
                "Bước 4: Nhập Sĩ số dự kiến (ví dụ: 35) và Số phòng học (ví dụ: P.201 - Tầng 2).",
                "Bước 5: Bấm 'Lưu lớp học' -> Lớp học xuất hiện trên danh mục và sẵn sàng tiếp nhận học sinh."
            ],
            "rules": [
                {"id": "BR-01", "title": "Tính duy nhất của Tên lớp học", "desc": "Tên lớp học là duy nhất trong cùng một Khối lớp và cùng một Năm học (không thể có hai 'Lớp 1A1' trong cùng niên khóa 2026-2027)."},
                {"id": "BR-02", "title": "Bảo vệ toàn vẹn lớp học đã phát sinh dữ liệu", "desc": "Không cho phép xóa lớp học đã có học sinh, thời khóa biểu hoặc giao dịch học phí. Nếu lớp ngưng hoạt động, chỉ được chuyển trạng thái sang 'Đã đóng'."},
                {"id": "BR-03", "title": "Duy nhất một GVCN chính", "desc": "Mỗi lớp học chỉ có duy nhất 1 Giáo viên chủ nhiệm chính tại một thời điểm; khi phân công GVCN mới, GVCN cũ sẽ tự động chuyển thành giáo viên phụ trách hoặc kết thúc nhiệm vụ."}
            ],
            "data_entities": [
                {"field": "id", "type": "string", "required": True, "desc": "Mã lớp học duy nhất (ví dụ: lop-1a1)."},
                {"field": "name", "type": "string", "required": True, "desc": "Tên lớp học hiển thị (ví dụ: Lớp 1A1)."},
                {"field": "gradeId", "type": "string", "required": True, "desc": "Mã khối lớp trực thuộc (liên kết M5/SM5)."},
                {"field": "academicYearId", "type": "string", "required": True, "desc": "Mã niên khóa áp dụng (liên kết M5/SM13)."},
                {"field": "homeroomTeacherId", "type": "string", "required": True, "desc": "Mã giáo viên chủ nhiệm (liên kết M5/SM2)."},
                {"field": "roomNumber", "type": "string", "required": False, "desc": "Số hiệu phòng học (ví dụ: Phòng 204 - Dãy A)."},
                {"field": "maxCapacity", "type": "number", "required": True, "desc": "Sĩ số tối đa quy định (mặc định: 35 học sinh)."},
                {"field": "currentStudents", "type": "number", "required": False, "desc": "Sĩ số học sinh thực tế đang theo học."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-025 Quản lý lớp học", "feature": "Danh mục và khởi tạo lớp học", "platform": "Web Portal", "priority": "P1", "story": "Là Giáo vụ, tôi muốn tạo danh mục lớp học đầu năm để sắp xếp học sinh và giáo viên.", "jira": "LH-001"},
                {"epic": "E-025 Quản lý lớp học", "feature": "Phân công giáo viên chủ nhiệm", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn phân công GVCN cho từng lớp để bàn giao quyền quản lý học sinh.", "jira": "LH-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-LH-01",
                    "name": "Tạo lớp học mới và phân công GVCN",
                    "actor": "Ban Giám Hiệu / Giáo vụ",
                    "pre": "Đã có danh mục Khối lớp và Giáo viên trong hệ thống.",
                    "happy_path": [
                        "1. Vào Nhà trường -> Lớp học, bấm '+ Thêm lớp học'.",
                        "2. Nhập Tên lớp 'Lớp 1A1', chọn Khối 'Khối 1'.",
                        "3. Chọn GVCN 'Nguyễn Thị Thanh' từ dropdown giáo viên.",
                        "4. Nhập Phòng học 'P.201', Sĩ số tối đa '35'.",
                        "5. Bấm 'Lưu lớp học' -> Hệ thống xác nhận và tạo lớp thành công."
                    ],
                    "exceptions": [
                        "Trùng tên lớp trong khối: Báo lỗi 'Tên lớp học đã tồn tại trong khối này'."
                    ],
                    "post": "Lớp học mới hiển thị trên danh mục và sẵn sàng tiếp nhận học sinh.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Lớp học</strong> (`/[schoolCode]/class`).",
            "screens_table": [
                {"screen": "SCR-LH-01: Danh sách lớp học", "component": "Lưới thẻ lớp học (Class Cards)", "format": "Responsive Card Grid", "desc": "Mỗi thẻ hiển thị: Tên lớp, Khối lớp, Họ tên GVCN kèm avatar, Sĩ số hiện tại / Sĩ số tối đa (thanh progress bar), Phòng học, Nút 'Điểm danh', Nút 'Xem danh sách HS'.", "note": "Thẻ lớp đầy học sinh có viền cam cảnh báo"},
                {"screen": "SCR-LH-02: Modal Thêm/Sửa lớp học", "component": "Form nhập liệu lớp học", "format": "Modal Dialog", "desc": "Input Tên lớp*, Select Khối lớp*, Select GVCN*, Input Phòng học, Input Sĩ số tối đa.", "note": "Validate theo BR-01"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Tạo lớp học mới thành công",
                "scenario": "Given form Thêm lớp học\nWhen người dùng nhập tên lớp 'Lớp 1A1', chọn Khối 1 và chọn GVCN hợp lệ\nThen hệ thống lưu lớp học thành công và hiển thị thẻ lớp trong bảng danh mục."
            },
            {
                "id": "AC-02",
                "title": "Chặn tạo trùng tên lớp trong cùng một khối",
                "scenario": "Given Khối 1 đã có 'Lớp 1A1'\nWhen người dùng cố tình tạo thêm một lớp tên 'Lớp 1A1' trong Khối 1\nThen hệ thống chặn lưu và hiển thị thông báo lỗi 'Tên lớp học đã tồn tại trong khối này'."
            }
        ]
    }
])

print("Milestone 1 Sub-modules Part 1 fully expanded with 6 modules!")
