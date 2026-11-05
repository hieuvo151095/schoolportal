# -*- coding: utf-8 -*-
"""Script to build and verify milestone1_data.py with all 16 sub-modules."""

import json

# We define the rest of Milestone 1 sub-modules (from 4 to 16)
SUBMODULES_4_TO_16 = [
    # 4. M5/SM5 - Khối lớp
    {
        "code": "M5/SM5",
        "name": "M5 - SM5 - Khối lớp",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý khối lớp (Grade Level Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm phân cấp cấu trúc giáo dục đào tạo theo đúng quy định của Bộ GD&ĐT (Mầm non, Tiểu học, THCS, THPT).",
            "goals": "Tổ chức danh mục khối lớp chuẩn hóa theo niên khóa, quản lý số lượng lớp học và tổng số học sinh của từng khối, làm căn cứ phân công chuyên môn và áp dụng chương trình giảng dạy.",
            "scope": "Master data phân cấp trung gian giữa Cấp học trường và danh mục Lớp học cụ thể.",
            "references": [
                {"doc": "docs_legacy/operating-portal/nha-truong/5. khoi-lop.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Khối lớp"},
                {"doc": "Điều lệ trường học các cấp (Bộ GD&ĐT)", "note": "Quy định phân loại khối lớp"}
            ]
        },
        "business": {
            "flow_desc": "Khối lớp được khởi tạo dựa trên cấp học đào tạo của trường, liên kết với Năm học và làm khung phân loại cho các lớp học thành viên.",
            "flow_steps": [
                {"actor": "Hệ thống", "action": "Khởi tạo theo cấp học", "desc": "Tự động sinh các khối tương ứng khi trường đăng ký cấp học (Ví dụ Tiểu học: Khối 1 đến Khối 5)."},
                {"actor": "BGH", "action": "Xem danh sách khối", "desc": "Lọc theo cấp học, năm học và xem tổng đếm số lớp/học sinh."},
                {"actor": "BGH", "action": "Điều hướng lớp học", "desc": "Bấm vào khối lớp để chuyển trực tiếp sang danh sách lớp học của khối đó."}
            ],
            "steps_narrative": [
                "Người dùng truy cập Nhà trường -> Khối lớp.",
                "Chọn Cấp học và Năm học tại thanh bộ lọc.",
                "Bảng hiển thị các khối lớp kèm thông tin: Tên khối, Thứ tự hiển thị, Số lượng lớp đang hoạt động, Tổng số học sinh.",
                "Bấm vào dòng khối lớp để xem danh sách chi tiết các lớp học thuộc khối."
            ],
            "rules": [
                {"id": "BR-01", "title": "Phân loại theo cấp học trường", "desc": "Danh sách khối lớp hiển thị tương ứng theo cấu hình cấp học của trường: Mầm non (Nhà trẻ, Mẫu giáo 3-5 tuổi), Tiểu học (Khối 1 - 5), THCS (Khối 6 - 9), THPT (Khối 10 - 12)."},
                {"id": "BR-02", "title": "Tính toán sĩ số động", "desc": "Tổng số lớp và tổng số học sinh của khối được tính toán tự động dựa trên dữ liệu các lớp học và học sinh đang ở trạng thái Hoạt động trong niên khóa đã chọn."},
                {"id": "BR-03", "title": "Bất biến mã khối hệ thống", "desc": "Mã khối lớp theo chuẩn Bộ GD&ĐT (gradeLevelCode) là giá trị cố định, không thể chỉnh sửa để đảm bảo tích hợp đồng bộ dữ liệu Sở."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-024 Quản lý khối lớp", "feature": "Danh sách khối lớp", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem danh sách các khối lớp theo cấp học để nắm tổng quan quy mô đào tạo.", "jira": "KL-001"},
                {"epic": "E-024 Quản lý khối lớp", "feature": "Chi tiết khối & Liên kết lớp", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn bấm vào khối để xem danh sách lớp học trực thuộc.", "jira": "KL-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-KL-01",
                    "name": "Xem danh sách và chi tiết khối lớp",
                    "desc": "Người dùng tra cứu thông tin quy mô khối lớp theo năm học.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Chọn menu 'Khối lớp'.",
                    "pre": "Đã có dữ liệu năm học và cấu hình cấp học.",
                    "happy_path": [
                        "Hệ thống tải danh sách các khối lớp của cấp học mặc định.",
                        "Hiển thị số lượng lớp và học sinh tương ứng.",
                        "Người dùng đổi năm học trên bộ lọc, bảng dữ liệu lập tức cập nhật lại số liệu thống kê."
                    ],
                    "exception": [
                        "Năm học chưa có lớp: Hiển thị 0 lớp và 0 học sinh."
                    ],
                    "post": "Người dùng có cái nhìn tổng quan về quy mô từng khối.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/grade</code> hoặc menu <strong>NHÀ TRƯỜNG &gt; Khối lớp</strong> (icon <code>faLayerGroup</code>).",
            "list_overview": "Bảng danh mục khối lớp hiển thị theo cấp học và niên khóa, có bộ lọc cấp học (Tabs) và năm học (Dropdown).",
            "list_fields": [
                {"name": "Tên khối", "format": "Text (Bold)", "desc": "Ví dụ: Khối 1, Khối 2, Lớp Chồi, Lớp Lá...", "note": "BR-01"},
                {"name": "Mã khối", "format": "Code Tag", "desc": "Mã định danh nội bộ hệ thống (K01, K02...).", "note": "BR-03"},
                {"name": "Số lớp học", "format": "Badge / Count", "desc": "Số lượng lớp học trực thuộc khối trong niên khóa.", "note": "BR-02"},
                {"name": "Tổng học sinh", "format": "Number", "desc": "Tổng số học sinh đang học tại các lớp của khối.", "note": "BR-02"},
                {"name": "Thao tác", "format": "Button (Link)", "desc": "Nút 'Xem danh sách lớp' điều hướng sang phân hệ Lớp học.", "note": ""}
            ],
            "form_fields": [],
            "notifications": []
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Khớp chuẩn cấp học đào tạo", "desc": "Trường tiểu học chỉ hiển thị đúng 5 khối (Khối 1 đến Khối 5); không xuất hiện các khối của THCS hoặc Mầm non."},
            {"code": "AC-02", "title": "Đếm chính xác sĩ số theo niên khóa", "desc": "Chuyển đổi năm học trên thanh lọc: tổng số lớp và số học sinh phải cập nhật ngay tức thì khớp với số liệu thực tế của niên khóa đó."},
            {"code": "AC-03", "title": "Điều hướng giữ ngữ cảnh năm học", "desc": "Bấm vào 'Xem danh sách lớp' của Khối 1: màn hình Lớp học mở ra phải tự động lọc sẵn Khối 1 và đúng năm học đang chọn."}
        ]
    },

    # 5. M5/SM1 - Học sinh
    {
        "code": "M5/SM1",
        "name": "M5 - SM1 - Học sinh",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý hồ sơ học sinh (Student 360° Profile)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> là trung tâm quản trị đối tượng đào tạo nòng cốt của Portal QLTH, lưu trữ toàn bộ thông tin cá nhân, nhân khẩu, y tế, học vụ và quan hệ phụ huynh.",
            "goals": "Quản lý vòng đời học sinh từ lúc nhập học, xếp lớp, theo dõi sức khỏe, nề nếp, thu học phí đến khi chuyển trường hoặc tốt nghiệp. Cung cấp hồ sơ học sinh 360° đa chiều phục vụ tương tác với phụ huynh và báo cáo dữ liệu định danh lên Sở GD&ĐT.",
            "scope": "Cơ sở dữ liệu master cho Điểm danh, Hoạt động, Thư viện ảnh, Trao đổi tin nhắn, Hóa đơn học phí và Báo cáo học vụ.",
            "references": [
                {"doc": "docs_legacy/operating-portal/nha-truong/1. hoc-sinh.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Học sinh"},
                {"doc": "Thông tư số 27/2020/TT-BGDĐT & 22/2021/TT-BGDĐT", "note": "Quy chế đánh giá học sinh tiểu học và trung học"}
            ]
        },
        "business": {
            "flow_desc": "Học sinh được tiếp nhận hồ sơ, sinh mã học sinh duy nhất, gán vào lớp học, liên kết với tài khoản phụ huynh và quản lý xuyên suốt các năm học.",
            "flow_steps": [
                {"actor": "Giáo vụ", "action": "Tiếp nhận & Tạo hồ sơ", "desc": "Nhập thông tin cá nhân, ngày sinh, giới tính, CCCD/mã định danh, địa chỉ và thông tin phụ huynh."},
                {"actor": "Hệ thống BE", "action": "Sinh mã học sinh duy nhất", "desc": "Tự động sinh mã học sinh theo quy tắc [MãTrường][Năm][STT] không trùng lặp."},
                {"actor": "Giáo vụ", "action": "Phân lớp học", "desc": "Gán học sinh vào một lớp học chính quy thuộc khối và năm học hiện hành."},
                {"actor": "Hệ thống BE", "action": "Liên kết phụ huynh", "desc": "Gửi SMS/OTP hoặc kích hoạt liên kết tài khoản App ECO Me của phụ huynh qua Số điện thoại."}
            ],
            "steps_narrative": [
                "Người dùng truy cập Nhà trường -> Học sinh, tra cứu danh sách học sinh theo khối, lớp, trạng thái và từ khóa tìm kiếm.",
                "Bấm '+ Tiếp nhận học sinh', nhập thông tin cá nhân (Họ tên, Ngày sinh, Giới tính, Dân tộc, Nơi sinh).",
                "Nhập thông tin phụ huynh (Họ tên Bố/Mẹ, SĐT liên hệ chính). SĐT này dùng để phụ huynh đăng nhập App ECO Me.",
                "Chọn Khối và Lớp tiếp nhận. Lưu hồ sơ.",
                "Xem trang chi tiết Học sinh 360°: Thông tin học vụ, Lịch sử điểm danh, Phiếu thu học phí, Ghi chú sức khỏe/dị ứng."
            ],
            "rules": [
                {"id": "BR-01", "title": "Mã học sinh duy nhất toàn trường", "desc": "Mỗi học sinh được cấp một Mã học sinh (Student Code) duy nhất và không đổi trong suốt quá trình theo học tại trường."},
                {"id": "BR-02", "title": "Bắt buộc 1 lớp chính quy tại 1 thời điểm", "desc": "Trong một niên khóa, một học sinh chỉ được thuộc về duy nhất một lớp học chính quy. Có thể tham gia thêm các lớp câu lạc bộ ngoại khóa."},
                {"id": "BR-03", "title": "Ràng buộc liên kết số điện thoại phụ huynh", "desc": "Số điện thoại phụ huynh là khóa định danh dùng để map tài khoản ứng dụng ECO Me (Phụ huynh). Một học sinh có thể liên kết tối đa 2 người giám hộ chính (Bố và Mẹ)."},
                {"id": "BR-04", "title": "Máy trạng thái vòng đời học sinh", "desc": "Trạng thái học sinh gồm: 'Đang học', 'Tạm nghỉ', 'Chuyển trường', 'Đã thôi học'. Chuyển trạng thái sang Chuyển trường/Thôi học sẽ tự động hủy điểm danh và chuyển hồ sơ sang phân hệ Lưu trữ."},
                {"id": "BR-05", "title": "Đồng bộ dữ liệu định danh CSDL Sở", "desc": "Trường hợp học sinh có mã định danh Bộ GD&ĐT (moetCode), các trường Họ tên, Ngày sinh, Giới tính sẽ bị khóa chỉnh sửa tự do để bảo đảm tính thống nhất với cơ sở dữ liệu quốc gia."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-020 Quản lý học sinh", "feature": "Danh sách & Lọc học sinh 360°", "platform": "Portal Web", "priority": "P1", "story": "Là giáo viên/giáo vụ, tôi muốn tìm kiếm và lọc danh sách học sinh theo lớp, khối, trạng thái để quản lý.", "jira": "HS-001"},
                {"epic": "E-020 Quản lý học sinh", "feature": "Tiếp nhận & Tạo mới hồ sơ", "platform": "Portal Web", "priority": "P1", "story": "Là giáo vụ, tôi muốn thêm mới hồ sơ học sinh đầy đủ thông tin cá nhân và phụ huynh.", "jira": "HS-002"},
                {"epic": "E-020 Quản lý học sinh", "feature": "Hồ sơ chi tiết Học sinh 360°", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN/BGH, tôi muốn xem toàn bộ lịch sử điểm danh, học tập, học phí của học sinh trên một màn hình.", "jira": "HS-003"},
                {"epic": "E-020 Quản lý học sinh", "feature": "Chuyển lớp & Chuyển trạng thái", "platform": "Portal Web", "priority": "P1", "story": "Là giáo vụ, tôi muốn chuyển lớp hoặc cập nhật trạng thái thôi học/chuyển trường cho học sinh.", "jira": "HS-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-HS-01",
                    "name": "Tiếp nhận học sinh mới",
                    "desc": "Nhập hồ sơ học sinh mới vào trường học.",
                    "actor": "Cán bộ giáo vụ",
                    "trigger": "Bấm nút '+ Thêm học sinh'.",
                    "pre": "Đã có dữ liệu lớp học cho năm học hiện hành.",
                    "happy_path": [
                        "Nhập Họ tên học sinh, Ngày sinh, Giới tính Nam/Nữ.",
                        "Nhập Số CCCD / Mã định danh cá nhân (nếu có).",
                        "Nhập Họ tên Mẹ/Bố và Số điện thoại liên hệ.",
                        "Chọn Khối 1 và Lớp 1A1.",
                        "Bấm 'Lưu hồ sơ'.",
                        "Hệ thống tạo mã học sinh tự động và hiển thị toast xanh 'Tiếp nhận học sinh thành công'."
                    ],
                    "exception": [
                        "SĐT phụ huynh không đúng định dạng: Báo lỗi 'Số điện thoại phải gồm 10 chữ số'.",
                        "Bỏ trống ngày sinh: Báo lỗi 'Vui lòng nhập ngày tháng năm sinh'."
                    ],
                    "post": "Học sinh xuất hiện trong danh sách lớp 1A1 và sẵn sàng để điểm danh.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/kid</code> hoặc menu <strong>NHÀ TRƯỜNG &gt; Học sinh</strong> (icon <code>faUserGraduate</code>).",
            "list_overview": "Bảng quản lý học sinh toàn trường kèm các bộ lọc: Năm học, Khối lớp, Lớp học, Trạng thái học sinh và ô tìm kiếm thông minh.",
            "list_fields": [
                {"name": "Học sinh", "format": "Avatar + Text (Họ tên)", "desc": "Ảnh thẻ học sinh, họ tên đầy đủ, ngày sinh và giới tính.", "note": ""},
                {"name": "Mã học sinh", "format": "Text (Bold)", "desc": "Mã định danh học sinh duy nhất trong trường.", "note": "BR-01"},
                {"name": "Lớp học", "format": "Badge", "desc": "Tên lớp học chính quy hiện tại (ví dụ: 1A1).", "note": "BR-02"},
                {"name": "Phụ huynh liên hệ", "format": "Text", "desc": "Tên phụ huynh chính và số điện thoại liên kết.", "note": "BR-03"},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Đang học (Xanh lá), Tạm nghỉ (Vàng), Chuyển trường (Tím), Thôi học (Xám).", "note": "BR-04"},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Xem hồ sơ 360°, Chỉnh sửa hồ sơ, Chuyển lớp, Đổi trạng thái.", "note": ""}
            ],
            "form_fields": [
                {"name": "Họ và tên học sinh *", "type": "Text Input", "validation": "Bắt buộc, viết hoa chữ cái đầu.", "note": "BR-05"},
                {"name": "Ngày sinh *", "type": "Date Picker", "validation": "Bắt buộc, ngày sinh hợp lý theo độ tuổi cấp học.", "note": ""},
                {"name": "Giới tính *", "type": "Radio Button", "validation": "Bắt buộc chọn Nam hoặc Nữ.", "note": ""},
                {"name": "Lớp tiếp nhận *", "type": "Select Dropdown", "validation": "Bắt buộc chọn 1 lớp học đang mở.", "note": "BR-02"},
                {"name": "SĐT phụ huynh *", "type": "Phone Input", "validation": "Bắt buộc, đúng định dạng 10 chữ số.", "note": "BR-03"}
            ],
            "notifications": [
                {"context": "Tiếp nhận học sinh thành công", "type": "Toast (Xanh)", "body": "Đã tạo hồ sơ học sinh và sinh mã thành công.", "onclick": "Xem hồ sơ."},
                {"context": "Chuyển trạng thái học sinh", "type": "Confirmation Modal", "body": "Chuyển trạng thái học sinh sang Thôi học sẽ lưu trữ hồ sơ. Tiếp tục?", "onclick": "Xác nhận / Hủy."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Sinh mã học sinh tự động không trùng", "desc": "Hệ thống tự động cấp mã học sinh theo đúng quy tắc và đảm bảo không bao giờ trùng lặp giữa hai học sinh trong toàn trường."},
            {"code": "AC-02", "title": "Khóa cứng chỉnh sửa đối với dữ liệu đồng bộ Sở", "desc": "Đối với học sinh có mã định danh Sở (moetCode), các trường Họ tên và Ngày sinh bị mờ (disabled) và không thể sửa đổi thủ công."},
            {"code": "AC-03", "title": "Cập nhật sĩ số lớp tức thì", "desc": "Khi thêm mới hoặc chuyển lớp cho học sinh sang lớp khác, sĩ số của lớp cũ giảm 1 và sĩ số của lớp mới tăng 1 ngay lập tức."},
            {"code": "AC-04", "title": "Liên kết phụ huynh qua số điện thoại", "desc": "Lưu số điện thoại phụ huynh: tài khoản ứng dụng ECO Me có SĐT tương ứng lập tức nhìn thấy hồ sơ con trên ứng dụng di động."}
        ]
    },

    # 6. M5/SM3 - Lớp học
    {
        "code": "M5/SM3",
        "name": "M5 - SM3 - Lớp học",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý lớp học (Class & Classroom Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm quản lý đơn vị tổ chức học tập căn bản của nhà trường, gán giáo viên chủ nhiệm, kiểm soát sĩ số và quản trị các hoạt động học vụ hàng ngày.",
            "goals": "Cung cấp công cụ thành lập lớp học mới theo khối và niên khóa, phân công Giáo viên chủ nhiệm (GVCN), theo dõi danh sách học sinh trong lớp, phân loại lớp chính khóa và câu lạc bộ ngoại khóa, đồng thời bảo vệ toàn vẹn dữ liệu điểm danh và học phí.",
            "scope": "Đơn vị điều phối nòng cốt cho Điểm danh, Hoạt động lớp, Thư viện ảnh, Sổ liên lạc Trao đổi, Thời khóa biểu và Biểu phí lớp.",
            "references": [
                {"doc": "docs_legacy/operating-portal/nha-truong/3. lop-hoc.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Lớp học"},
                {"doc": "Figma Hand-off / Quản lý Lớp học", "note": "Wireframe danh sách lớp, modal tạo lớp và danh sách học sinh"}
            ]
        },
        "business": {
            "flow_desc": "Thành lập lớp học thuộc khối lớp trong năm học mới, phân công GVCN, thêm học sinh vào lớp và kích hoạt các kênh tương tác hoạt động.",
            "flow_steps": [
                {"actor": "BGH", "action": "Tạo lớp học mới", "desc": "Chọn Khối lớp, Năm học, nhập Tên lớp (ví dụ: '1A1'), Phòng học và chọn GVCN."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra xung đột GVCN", "desc": "Cảnh báo nếu giáo viên được chọn đang làm chủ nhiệm một lớp chính quy khác trong cùng niên khóa."},
                {"actor": "Hệ thống BE", "action": "Khởi tạo kênh vận hành", "desc": "Tự động tạo kênh trao đổi lớp, album ảnh lớp và danh sách điểm danh hàng ngày."},
                {"actor": "GVCN", "action": "Tiếp nhận lớp", "desc": "Đăng nhập portal hoặc app để điểm danh, đăng hoạt động và quản lý học sinh."}
            ],
            "steps_narrative": [
                "BGH vào Nhà trường -> Lớp học, chọn Năm học để xem toàn bộ danh sách lớp.",
                "Bấm '+ Thêm lớp học', nhập Tên lớp, chọn Khối lớp, Phòng học và chọn Giáo viên chủ nhiệm.",
                "Hệ thống kiểm tra trùng tên lớp trong cùng khối và kiểm tra ràng buộc GVCN.",
                "Sau khi lưu, bấm vào dòng lớp học để xem danh sách học sinh, thêm/bớt học sinh hoặc chuyển lớp.",
                "Quy tắc xóa lớp: Chỉ cho phép xóa khi lớp học có sĩ số bằng 0 (chưa có học sinh nào)."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo vệ xóa lớp học (Sĩ số = 0)", "desc": "Lớp học chỉ có thể bị xóa khi sĩ số học sinh bằng 0 (studentCount === 0) và chưa phát sinh dữ liệu hóa đơn học phí hoặc điểm danh lịch sử."},
                {"id": "BR-02", "title": "Xung đột Giáo viên chủ nhiệm", "desc": "Mỗi giáo viên chỉ được làm Chủ nhiệm duy nhất 1 lớp chính quy trong một niên khóa. Nếu chọn GV đã có lớp, hệ thống hiển thị cảnh báo xác nhận hoán đổi."},
                {"id": "BR-03", "title": "Tên lớp duy nhất trong khối", "desc": "Trong cùng một khối lớp và cùng một niên khóa, không được đặt trùng tên lớp học."},
                {"id": "BR-04", "title": "Phân loại lớp chính khóa và câu lạc bộ", "desc": "Hệ thống phân biệt rõ 2 loại hình: 'Lớp chính quy' (học văn hóa bắt buộc) và 'Lớp năng khiếu / Câu lạc bộ' (học sinh tham gia tự chọn ngoài giờ)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-022 Quản lý lớp học", "feature": "Danh sách lớp học theo niên khóa", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem danh sách các lớp học theo khối và sĩ số để phân bổ giáo viên.", "jira": "LH-001"},
                {"epic": "E-022 Quản lý lớp học", "feature": "Thêm mới & Phân công GVCN", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn tạo lớp mới và gán GVCN để chuẩn bị năm học mới.", "jira": "LH-002"},
                {"epic": "E-022 Quản lý lớp học", "feature": "Chi tiết lớp & Danh sách học sinh", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN/BGH, tôi muốn xem danh sách toàn bộ học sinh trong lớp để quản lý học vụ.", "jira": "LH-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-LH-01",
                    "name": "Tạo lớp học mới và phân công GVCN",
                    "desc": "Tạo lớp học mới trong khối lớp.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Bấm nút '+ Thêm lớp học'.",
                    "pre": "Đã có danh mục khối lớp và danh sách giáo viên.",
                    "happy_path": [
                        "Chọn Khối lớp 'Khối 1'.",
                        "Nhập Tên lớp '1A1', Phòng học 'Phòng 201'.",
                        "Chọn GVCN 'Cô Nguyễn Thị Hoa'.",
                        "Bấm 'Lưu lớp học'.",
                        "Hệ thống lưu thành công, hiển thị toast xanh và cập nhật lớp 1A1 vào bảng."
                    ],
                    "exception": [
                        "GVCN đã chủ nhiệm lớp khác: Hiển thị popup 'Giáo viên này đang chủ nhiệm lớp 1A2. Bạn có muốn đổi GVCN sang lớp này?'",
                        "Trùng tên lớp trong khối: Báo lỗi 'Tên lớp 1A1 đã tồn tại trong Khối 1'."
                    ],
                    "post": "Lớp học được kích hoạt và sẵn sàng tiếp nhận học sinh.",
                    "rules": "BR-02, BR-03, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/classes</code> hoặc menu <strong>NHÀ TRƯỜNG &gt; Lớp học</strong> (icon <code>faChalkboard</code>).",
            "list_overview": "Bảng danh sách lớp học hiển thị theo dạng lưới thẻ (Grid) hoặc bảng (Table) kèm bộ lọc Khối lớp và Năm học.",
            "list_fields": [
                {"name": "Tên lớp", "format": "Text (Bold)", "desc": "Ví dụ: Lớp 1A1, Lớp 1A2, CLB Cờ vua...", "note": "BR-03"},
                {"name": "Khối lớp", "format": "Badge", "desc": "Khối lớp trực thuộc (Khối 1, Khối 2...).", "note": ""},
                {"name": "Giáo viên chủ nhiệm", "format": "Avatar + Text", "desc": "Họ tên và ảnh đại diện của GVCN phụ trách.", "note": "BR-02"},
                {"name": "Sĩ số", "format": "Number / Badge", "desc": "Tổng số học sinh hiện có trong lớp.", "note": "BR-01"},
                {"name": "Phòng học", "format": "Text", "desc": "Vị trí phòng học (ví dụ: Tầng 2, P.204).", "note": ""},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Xem danh sách học sinh, Chỉnh sửa thông tin, Xóa lớp (chỉ khi sĩ số = 0).", "note": "BR-01"}
            ],
            "form_fields": [
                {"name": "Tên lớp *", "type": "Text Input", "validation": "Bắt buộc, tối đa 50 ký tự.", "note": "BR-03"},
                {"name": "Khối lớp *", "type": "Select Dropdown", "validation": "Bắt buộc chọn 1 khối lớp.", "note": ""},
                {"name": "Giáo viên chủ nhiệm", "type": "Select Dropdown", "validation": "Tùy chọn, danh sách giáo viên đang hoạt động.", "note": "BR-02"},
                {"name": "Phòng học", "type": "Text Input", "validation": "Tùy chọn, tối đa 50 ký tự.", "note": ""},
                {"name": "Loại lớp *", "type": "Radio (Chính quy / CLB)", "validation": "Bắt buộc chọn loại hình lớp.", "note": "BR-04"}
            ],
            "notifications": [
                {"context": "Tạo lớp học thành công", "type": "Toast (Xanh)", "body": "Đã thêm lớp học mới thành công.", "onclick": "Đóng toast."},
                {"context": "Xóa lớp bị chặn do có học sinh", "type": "Modal Cảnh báo (Đỏ)", "body": "Không thể xóa lớp học đang có học sinh. Vui lòng chuyển học sinh sang lớp khác trước.", "onclick": "Đóng modal."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Chặn tuyệt đối hành vi xóa lớp có sĩ số > 0", "desc": "Hàng của lớp học có sĩ số lớn hơn 0 phải ẩn hoặc làm mờ nút Xóa; bấm xóa lớp qua API phải trả về lỗi HTTP 400 Bad Request kèm thông điệp cảnh báo."},
            {"code": "AC-02", "title": "Cảnh báo khi gán GVCN đã có lớp", "desc": "Chọn giáo viên đang chủ nhiệm lớp khác: hiển thị modal xác nhận hoán đổi vị trí GVCN; nếu bấm Hủy thì giữ nguyên GVCN cũ."},
            {"code": "AC-03", "title": "Liên kết tức thì với phân hệ Điểm danh", "desc": "Lớp học tạo thành công lập tức xuất hiện trong dropdown chọn lớp tại phân hệ Điểm danh và Hoạt động hàng ngày."}
        ]
    },

    # 7. M5/SM2 - Giáo viên
    {
        "code": "M5/SM2",
        "name": "M5 - SM2 - Giáo viên",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý cán bộ giáo viên (Teacher & Faculty Directory)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm quản lý hồ sơ nhân sự sư phạm, chuyên môn giảng dạy, phân công chủ nhiệm / bộ môn và cấp quyền giảng dạy trên các nền tảng ứng dụng.",
            "goals": "Số hóa hồ sơ giáo viên, quản lý mã ngạch/mã số cán bộ, phân công lớp giảng dạy, đồng bộ dữ liệu giáo viên với cổng CSDL Sở GD&ĐT, và cấp tài khoản sử dụng ứng dụng giáo viên ECO School Teacher.",
            "scope": "Nhân sự trung tâm điều phối phân hệ Điểm danh, Bài tập, Chấm điểm, Báo cáo học vụ và Trao đổi với phụ huynh.",
            "references": [
                {"doc": "docs_legacy/operating-portal/nha-truong/2. giao-vien.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Giáo viên"},
                {"doc": "Thông tư số 20/2018/TT-BGDĐT", "note": "Quy định chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông"}
            ]
        },
        "business": {
            "flow_desc": "Tiếp nhận hồ sơ giáo viên, phân bổ tổ chuyên môn, phân công lớp giảng dạy hoặc chủ nhiệm, và tự động liên kết tài khoản portal.",
            "flow_steps": [
                {"actor": "BGH", "action": "Thêm hồ sơ giáo viên", "desc": "Nhập Họ tên, Mã cán bộ, Email, SĐT, CCCD, Tổ chuyên môn và Vai trò (Chính / Hỗ trợ)."},
                {"actor": "Hệ thống BE", "action": "Tạo tài khoản tự động", "desc": "Liên kết hồ sơ giáo viên với tài khoản đăng nhập phân hệ M6/SM2 và gửi email kích hoạt."},
                {"actor": "BGH", "action": "Phân công lớp", "desc": "Gán giáo viên làm Chủ nhiệm (1 lớp) hoặc gán danh sách các lớp dạy bộ môn."},
                {"actor": "Giáo viên", "action": "Nhận phân công", "desc": "Mở ứng dụng ECO Teacher để xem danh sách lớp và học sinh được phân công."}
            ],
            "steps_narrative": [
                "BGH vào Nhà trường -> Giáo viên, xem danh bạ giáo viên toàn trường.",
                "Tìm kiếm giáo viên theo họ tên, số điện thoại, mã cán bộ hoặc lọc theo tổ bộ môn.",
                "Bấm '+ Thêm giáo viên', nhập thông tin cá nhân và chuyên môn.",
                "Thực hiện phân công lớp giảng dạy và lớp chủ nhiệm.",
                "Giáo viên chuyển trường hoặc nghỉ hưu được cập nhật trạng thái sang 'Tạm nghỉ' hoặc lưu trữ."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc Email sư phạm duy nhất", "desc": "Mỗi giáo viên phải có địa chỉ Email duy nhất để liên kết tài khoản ứng dụng giảng dạy và nhận thông báo của trường."},
                {"id": "BR-02", "title": "Ràng buộc phân công Chủ nhiệm duy nhất", "desc": "Một giáo viên chỉ được phân công làm Chủ nhiệm chính thức cho 1 lớp học chính quy trong một niên khóa."},
                {"id": "BR-03", "title": "Bảo vệ thông tin định danh CSDL Sở", "desc": "Hồ sơ giáo viên được đồng bộ từ CSDL Sở (synced = true) sẽ bị khóa cứng Mã cán bộ, Họ tên và CCCD để đảm bảo tính pháp lý ngành."},
                {"id": "BR-04", "title": "Quyền truy cập học vụ theo phân công", "desc": "Giáo viên chỉ được phép điểm danh, nhập điểm và gửi tin nhắn cho các lớp học mà mình được phân công làm GVCN hoặc giáo viên bộ môn."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-021 Quản lý giáo viên", "feature": "Danh bạ giáo viên", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem danh bạ giáo viên kèm tổ bộ môn và lớp phân công.", "jira": "GV-001"},
                {"epic": "E-021 Quản lý giáo viên", "feature": "Thêm mới & Phân công giảng dạy", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn thêm giáo viên mới và phân công lớp để sẵn sàng giảng dạy.", "jira": "GV-002"},
                {"epic": "E-021 Quản lý giáo viên", "feature": "Đồng bộ CSDL Sở GD&ĐT", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn đối soát và đồng bộ hồ sơ giáo viên từ hệ thống Sở.", "jira": "GV-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-GV-01",
                    "name": "Thêm mới giáo viên và phân công lớp",
                    "desc": "Tạo hồ sơ giáo viên mới trong hệ thống.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Bấm nút '+ Thêm giáo viên'.",
                    "pre": "Đã có danh sách lớp học của năm học.",
                    "happy_path": [
                        "Nhập Họ tên 'Thầy Lê Văn Bình', Email 'binh.lv@ecoschool.edu.vn', SĐT '0987654321'.",
                        "Chọn Tổ chuyên môn 'Tổ Tự nhiên'.",
                        "Chọn phân công Chủ nhiệm 'Lớp 6A1'.",
                        "Bấm 'Lưu hồ sơ'.",
                        "Hệ thống lưu thành công, tự động liên kết tài khoản và gửi email kích hoạt."
                    ],
                    "exception": [
                        "Email đã tồn tại: Báo lỗi 'Email này đã được đăng ký bởi giáo viên khác'."
                    ],
                    "post": "Giáo viên xuất hiện trong danh bạ và nhận quyền chủ nhiệm lớp 6A1.",
                    "rules": "BR-01, BR-02, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/teacher</code> hoặc menu <strong>NHÀ TRƯỜNG &gt; Giáo viên</strong> (icon <code>faChalkboardTeacher</code>).",
            "list_overview": "Danh bạ cán bộ giáo viên kèm bộ lọc: Tổ bộ môn, Phân quyền (Chính / Hỗ trợ), Trạng thái làm việc và ô tìm kiếm nhanh.",
            "list_fields": [
                {"name": "Giáo viên", "format": "Avatar + Họ tên", "desc": "Ảnh đại diện, họ và tên, chức danh sư phạm.", "note": ""},
                {"name": "Mã cán bộ", "format": "Text (Bold)", "desc": "Mã định danh cán bộ giáo viên (ví dụ: GV0123).", "note": "BR-03"},
                {"name": "Liên hệ", "format": "Email + Phone", "desc": "Email công vụ và số điện thoại liên lạc.", "note": "BR-01"},
                {"name": "Lớp chủ nhiệm", "format": "Badge (Xanh lá)", "desc": "Tên lớp chủ nhiệm (nếu có).", "note": "BR-02"},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Đang làm việc (Xanh), Tạm nghỉ (Vàng), Đã chuyển (Xám).", "note": ""},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Xem hồ sơ, Chỉnh sửa phân công, Đổi email, Xóa giáo viên.", "note": ""}
            ],
            "form_fields": [
                {"name": "Họ và tên *", "type": "Text Input", "validation": "Bắt buộc, tối đa 100 ký tự.", "note": "BR-03"},
                {"name": "Địa chỉ Email *", "type": "Email Input", "validation": "Bắt buộc, đúng định dạng, không trùng.", "note": "BR-01"},
                {"name": "Số điện thoại *", "type": "Phone Input", "validation": "Bắt buộc, 10 chữ số.", "note": ""},
                {"name": "Tổ chuyên môn *", "type": "Select Dropdown", "validation": "Bắt buộc chọn 1 tổ bộ môn.", "note": ""},
                {"name": "Lớp chủ nhiệm", "type": "Select Dropdown", "validation": "Tùy chọn, tối đa 1 lớp chính quy.", "note": "BR-02"}
            ],
            "notifications": [
                {"context": "Thêm giáo viên thành công", "type": "Toast (Xanh)", "body": "Đã thêm hồ sơ giáo viên và tạo tài khoản thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Bảo vệ xung đột lớp chủ nhiệm", "desc": "Nếu giáo viên A đã làm chủ nhiệm lớp 1A1, khi chọn giáo viên A cho lớp 1A2 hệ thống phải cảnh báo xung đột và yêu cầu xác nhận hoán đổi."},
            {"code": "AC-02", "title": "Đồng bộ quyền hạn trên App ECO Teacher", "desc": "Phân công lớp cho giáo viên xong: giáo viên đăng nhập app lập tức nhìn thấy danh sách học sinh của các lớp được phân công."},
            {"code": "AC-03", "title": "Không cho phép xóa giáo viên đang chủ nhiệm", "desc": "Nút xóa giáo viên bị vô hiệu hóa nếu giáo viên đó đang được phân công làm GVCN của một lớp học đang hoạt động."}
        ]
    }
]

print(f"Loaded {len(SUBMODULES_4_TO_16)} submodules (4 to 7). Now writing remaining submodules...")
