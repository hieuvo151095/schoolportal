# -*- coding: utf-8 -*-
"""
Milestone 3 Sub-modules Part 1 (Comprehensive v2 Standard)
Covers Phase 3A (7 sub-modules):
  1. M5/SM4 - M5 - SM4 - Môn học (Subjects & Teacher Assignment)
  2. M5/SM6 - M5 - SM6 - Bảng thông tin (School Announcements & Bulletins)
  3. M5/SM11 - M5 - SM11 - Góp ý (Parent Feedback & Service Desk)
  4. M5/SM10 - M5 - SM10 - Sổ tay PH (Parent Handbook & Regulations)
  5. M5/SM8 - M5 - SM8 - Thực đơn (Nutrition Menu & Food Ingredients)
  6. M5/SM14 - M5 - SM14 - Lưu trữ (Student & Staff Data Archive)
  7. M5/SM7 - M5 - SM7 - Bình chọn (School Polls & Voting)
"""

PART1_PRDS = [
    # -------------------------------------------------------------------------
    # 1. M5/SM4 - Môn học (Subjects & Teacher Assignment)
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM4",
        "name": "M5 - SM4 - Môn học",
        "parent_module": "M5",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Quản lý Danh mục Môn học & Phân công Giáo viên Bộ môn (Curriculum Subjects & Teacher Assignment Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm thiết lập cây danh mục môn học chuẩn theo quy định của Bộ GD&ĐT (Toán, Ngữ văn, Tiếng Anh, Khoa học tự nhiên, Lịch sử & Địa lý, Tin học, Giáo dục thể chất, Nghệ thuật...) và các môn học tự chọn, câu lạc bộ ngoại khóa của nhà trường (`/[schoolCode]/school/subjects`). Phân hệ đóng vai trò là dữ liệu nguồn (Master Data) thiết yếu để xây dựng Thời khóa biểu (M3/SM1), giao Bài tập về nhà (M3/SM2) và nhập Điểm đánh giá học tập (M3/SM3).",
            "goals_list": [
                "Quản lý danh mục môn học theo cấp học và khối lớp: Tên môn, Mã môn viết tắt, Số tiết quy định trong tuần, Hệ số tính điểm.",
                "Phân loại tính chất môn học: Môn bắt buộc (Core), Môn tự chọn (Elective), Hoạt động trải nghiệm sáng tạo, Câu lạc bộ sau giờ học.",
                "Hỗ trợ phân công giáo viên giảng dạy (`AssignTeacherModal`): Gán giáo viên bộ môn phụ trách từng lớp kèm kiểm tra xung đột số tiết tối đa.",
                "Cung cấp ngăn kéo chi tiết môn học (`SubjectDetailDrawer`): Xem toàn bộ danh sách lớp đang dạy môn này và giáo viên đang đảm nhiệm.",
                "Thẻ tóm tắt KPI (`SubjectSummaryCards`): Thống kê tổng số môn học, số môn đã phân công đủ giáo viên, số môn còn khuyết giáo viên."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu / Khối trưởng chuyên môn", "role": "Xây dựng khung chương trình & phân công", "actions": "Tạo danh mục môn học, phân bổ số tiết học/tuần và chỉ định giáo viên bộ môn cho các lớp."},
                {"group": "Giáo viên bộ môn (GVBM)", "role": "Xem danh sách môn và lớp phụ trách", "actions": "Theo dõi các lớp mình được phân công giảng dạy để chuẩn bị giáo án và lên lịch kiểm tra."},
                {"group": "Bộ phận Học vụ", "role": "Kiểm tra định mức tiết dạy", "actions": "Rà soát số tiết giảng dạy của giáo viên trong trường để cân đối tải trọng công việc."}
            ],
            "glossary": [
                {"term": "Hệ số môn học", "definition": "Trọng số nhân của môn học khi tính điểm trung bình môn học kỳ (ví dụ: Toán, Văn hệ số 2; các môn khác hệ số 1)."},
                {"term": "Phân công giảng dạy", "definition": "Hành động liên kết một giáo viên bộ môn cụ thể chịu trách nhiệm giảng dạy môn học đó tại một lớp học cụ thể trong học kỳ."},
                {"term": "Môn đánh giá bằng nhận xét", "definition": "Môn học không chấm điểm bằng số mà chỉ xếp loại Đạt (Đ) hoặc Chưa đạt (CĐ) theo Thông tư 22/2021/TT-BGDĐT (ví dụ: Thể dục, Âm nhạc)."}
            ]
        },
        "business": {
            "flow_desc": "BGH thiết lập danh mục môn học theo khung Bộ GD&ĐT, chỉ định số tiết/tuần cho từng khối lớp, sau đó thực hiện phân công giáo viên bộ môn cho từng lớp học cụ thể.",
            "flow_steps": [
                {"actor": "BGH / Học vụ", "action": "Tạo môn học mới", "desc": "Mở `/school/subjects`, bấm 'Thêm môn học', nhập Tên môn, Khối lớp áp dụng, Số tiết/tuần."},
                {"actor": "BGH", "action": "Phân công giáo viên", "desc": "Bấm nút 'Phân công' trên dòng môn học, chọn lớp học và chọn giáo viên bộ môn tương ứng."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra hợp lệ & Xung đột", "desc": "Kiểm tra xem lớp đó đã có giáo viên dạy môn này chưa và giáo viên có vượt định mức tiết dạy không."},
                {"actor": "Hệ thống BE", "action": "Lưu phân công", "desc": "Lưu liên kết vào bảng class_subject_teacher và kích hoạt quyền nhập điểm cho giáo viên đó."},
                {"actor": "GVBM", "action": "Nhận thông báo phân công", "desc": "GVBM nhận thông báo phân công giảng dạy và thấy lớp xuất hiện trên Thời khóa biểu."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Thiết lập danh mục đầu năm): BGH truy cập Quản lý Môn học, kiểm tra danh mục môn chuẩn. Có thể nhập nhanh danh mục từ file Excel hoặc từ template chuẩn của Bộ GD&ĐT.",
                "Giai đoạn 2 (Cấu hình chi tiết môn): Xác lập cách tính điểm (Tính điểm số thang 10 hoặc Đánh giá nhận xét Đ/CĐ), hệ số môn và số tiết quy định trong tuần.",
                "Giai đoạn 3 (Phân công lớp - AssignTeacherModal): BGH chọn môn (ví dụ: Tiếng Anh khối 6), chọn danh sách các lớp (6A1, 6A2, 6A3) và chọn giáo viên phụ trách (Cô Mai).",
                "Giai đoạn 4 (Hủy phân công - UnassignTeacherModal): Khi có sự thay đổi nhân sự giữa kỳ, BGH có thể hủy phân công và thay thế bằng giáo viên khác mà không làm mất lịch sử điểm số cũ.",
                "Giai đoạn 5 (Theo dõi KPI): SubjectSummaryCards hiển thị cảnh báo các lớp còn thiếu giáo viên bộ môn để BGH kịp thời điều động."
            ],
            "rules": [
                {"id": "BR-SUB-01", "title": "Tính duy nhất của môn học theo khối", "desc": "Trong cùng một khối lớp, không được phép tạo hai môn học trùng tên hoặc trùng mã môn."},
                {"id": "BR-SUB-02", "title": "Duy nhất một giáo viên chính phụ trách môn/lớp", "desc": "Tại một thời điểm trong học kỳ, một lớp học chỉ được có duy nhất 1 giáo viên chính đảm nhiệm 1 môn học. Nếu cần chia lớp (như môn Tin học, Ngoại ngữ), phải khai báo dưới hình thức nhóm học phụ."},
                {"id": "BR-SUB-03", "title": "Ràng buộc dữ liệu khi xóa môn học", "desc": "Môn học đã phát sinh dữ liệu trong Thời khóa biểu, Bài tập hoặc Sổ điểm không được phép xóa; chỉ được chuyển trạng thái sang 'Ngừng hoạt động'."}
            ],
            "data_entities": [
                {"field": "subject_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính môn học."},
                {"field": "subject_name", "type": "String (100)", "required": "Bắt buộc", "desc": "Tên môn học (Toán, Tiếng Anh...)."},
                {"field": "subject_code", "type": "String (20)", "required": "Bắt buộc", "desc": "Mã viết tắt (MATH, ENG, PHYS...)."},
                {"field": "grade_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khối lớp áp dụng (M5/SM5)."},
                {"field": "periods_per_week", "type": "Integer", "required": "Bắt buộc", "desc": "Số tiết học quy định trong tuần."},
                {"field": "evaluation_type", "type": "Enum", "required": "Bắt buộc", "desc": "Hình thức đánh giá: 'numeric' (Chấm điểm số) hoặc 'comment' (Nhận xét Đ/CĐ)."},
                {"field": "coefficient", "type": "Decimal (1.0-3.0)", "required": "Mặc định 1.0", "desc": "Hệ số tính điểm trung bình."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-013 Nhà trường Môn học", "feature": "Danh mục môn học & Thẻ KPI tổng quan", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem danh sách môn học theo khối và biết môn nào còn thiếu giáo viên.", "jira": "SUB-001"},
                {"epic": "E-013 Nhà trường Môn học", "feature": "Phân công giáo viên bộ môn (AssignTeacherModal)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn gán giáo viên dạy môn cho từng lớp học cụ thể.", "jira": "SUB-002"},
                {"epic": "E-013 Nhà trường Môn học", "feature": "Ngăn kéo chi tiết môn học (SubjectDetailDrawer)", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn xem chi tiết danh sách giáo viên đang dạy môn này trên toàn trường.", "jira": "SUB-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-SUB-01",
                    "name": "Phân công giáo viên bộ môn cho lớp",
                    "desc": "BGH chỉ định giáo viên dạy môn Tiếng Anh cho lớp 6A1.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "BGH bấm nút 'Phân công' trên dòng môn Tiếng Anh khối 6.",
                    "pre": "Đã có danh sách giáo viên bộ môn Tiếng Anh trong hệ thống.",
                    "happy_path": [
                        "1. BGH chọn lớp '6A1'.",
                        "2. Chọn giáo viên 'Cô Nguyễn Thị Hoa'.",
                        "3. Bấm 'Lưu phân công'.",
                        "4. Hệ thống lưu liên kết, cập nhật bảng hiển thị tên cô Hoa tại dòng lớp 6A1.",
                        "5. Thẻ KPI 'Môn đã phân công đủ' tăng thêm 1."
                    ],
                    "exceptions": [
                        {"case": "Lớp 6A1 đã có giáo viên Tiếng Anh trước đó", "handling": "Hệ thống hiển thị cảnh báo 'Lớp 6A1 đang do Thầy Hùng phụ trách, bạn có muốn thay thế không?'."}
                    ],
                    "post": "Giáo viên được cấp quyền truy cập sổ điểm lớp 6A1 cho môn Tiếng Anh.",
                    "rules": ["BR-SUB-02"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Môn học (`/[schoolCode]/school/subjects`)",
            "screens_table": [
                {"screen": "Quản lý môn học (`SubjectTable`)", "component": "Thẻ KPI môn học (`SubjectSummaryCards`)", "format": "3 Card ngang: Tổng số môn học, Môn đã phân công đủ (xanh lá), Môn chưa phân công (vàng cam)", "desc": "Cảnh báo tình trạng phân công nhân sự sư phạm.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Quản lý môn học (`SubjectTable`)", "component": "Bảng danh sách môn học (`SubjectTable`)", "format": "Table gồm: STT, Mã môn, Tên môn, Khối lớp, Số tiết/tuần, Hình thức đánh giá, Giáo viên phụ trách, Thao tác", "desc": "Hiển thị chi tiết môn học và phân công.", "note": "BR-SUB-01"},
                {"screen": "Modal phân công giáo viên (`AssignTeacherModal`)", "component": "Hộp thoại gán giáo viên", "format": "Dropdown chọn Lớp học, Dropdown chọn Giáo viên bộ môn, Checkbox áp dụng cho nhiều lớp, Nút 'Xác nhận'", "desc": "Thao tác gán quyền giảng dạy nhanh chóng.", "note": "BR-SUB-02"},
                {"screen": "Ngăn kéo chi tiết môn (`SubjectDetailDrawer`)", "component": "Drawer trượt từ phải sang", "format": "Thông tin môn học, Định mức tiết dạy, Danh sách toàn bộ các lớp kèm giáo viên đang dạy, Lịch sử thay đổi", "desc": "Xem chi tiết phân bổ giảng dạy của một môn học.", "note": "Chỉ đọc"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-SUB-01",
                "title": "Tạo môn học mới hợp lệ theo khối",
                "scenario": "Given BGH nhập Tên môn 'Khoa học tự nhiên', Khối 'Khối 6', Số tiết '4 tiết/tuần'\nWhen bấm 'Lưu môn học'\nThen hệ thống tạo môn học thành công và hiển thị trong danh mục môn khối 6."
            },
            {
                "id": "AC-SUB-02",
                "title": "Chặn tạo trùng tên môn học trong cùng một khối",
                "scenario": "Given Khối 6 đã có môn 'Toán học'\nWhen người dùng cố tình tạo thêm một môn khác tên 'Toán học' cho Khối 6\nThen hệ thống báo lỗi 'Tên môn học đã tồn tại trong khối này'."
            }
        ],
        "nfr": {
            "performance": "Tải danh mục 50 môn học dưới 400ms.",
            "security": "Chỉ BGH mới có quyền thêm/sửa/xóa môn học và phân công giáo viên.",
            "ux": "Hỗ trợ lọc nhanh theo khối lớp qua các tab ngang đầu trang."
        },
        "appendix": {
            "notifications": [
                {"event": "Phân công giảng dạy mới", "channel": "In-app Alert", "recipient": "Giáo viên bộ môn", "content": "Thầy/Cô vừa được phân công giảng dạy môn [Tên môn] tại lớp [Tên lớp]."}
            ],
            "edge_cases": [
                {"condition": "Giáo viên nghỉ thai sản giữa năm học", "solution": "BGH mở phân công môn học, chọn giáo viên dạy thay; toàn bộ điểm số cũ của giáo viên trước đó vẫn được bảo toàn nguyên vẹn."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 2. M5/SM6 - Bảng thông tin (School Announcements & Bulletins)
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM6",
        "name": "M5 - SM6 - Bảng thông tin",
        "parent_module": "M5",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Bảng Tin Tức & Thông Báo Chính Thức Toàn Trường (School Digital Bulletin & Official Announcement Cockpit)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> là kênh truyền thông chính thống một chiều từ Ban Giám Hiệu và các phòng ban chức năng tới toàn thể Cán bộ Giáo viên, Nhân viên và Phụ huynh học sinh (`/[schoolCode]/school/announcements`). Phân hệ hỗ trợ phát hành các thông báo khẩn cấp (nghỉ bão lũ, lịch nghỉ Tết, tiêm chủng y tế), các bản tin tuần, kế hoạch năm học, hỗ trợ đính kèm tệp văn bản PDF/Word công văn, nhúng video YouTube, cấu hình đối tượng nhận linh hoạt (Toàn trường, Khối lớp, Lớp học cụ thể, hoặc Nhóm giáo viên) và xem trước danh sách người nhận thực tế (`RecipientPreviewModal`).",
            "goals_list": [
                "Cung cấp trình soạn thảo thông báo chuyên nghiệp (`AnnouncementComposer`): Hỗ trợ định dạng văn bản giàu (Rich Text), đính kèm công văn dấu đỏ (PDF/Ảnh) và liên kết ngoài.",
                "Phân loại thông báo rõ ràng: Thông báo khẩn cấp (Urgent - ghim đầu bảng tin và phát âm thanh chuông), Tin tức sự kiện, Kế hoạch học tập, Thông báo thu học phí.",
                "Bộ lọc đối tượng nhận đa cấp: Toàn trường, Khối lớp được chọn, Danh sách lớp cụ thể, hoặc Chỉ gửi nội bộ Cán bộ Giáo viên.",
                "Tính năng xem trước danh sách người nhận thực tế (`RecipientPreviewModal`): Tính toán chính xác số lượng phụ huynh và giáo viên sẽ nhận được thông báo trước khi bấm gửi.",
                "Theo dõi tỷ lệ đọc thông báo thời gian thực: Thống kê số lượng người đã xem (Views) và danh sách phụ huynh chưa đọc để giáo viên chủ nhiệm đôn đốc."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Ban hành thông báo trường", "actions": "Soạn và ký duyệt phát hành thông báo chính thức, chọn gửi khẩn cấp khi có thiên tai dịch bệnh."},
                {"group": "Cán bộ Hành chính / Văn phòng", "role": "Đăng tải bản tin hoạt động", "actions": "Đăng tải tin tức sự kiện tuần, thư mời họp phụ huynh và thực đơn tuần."},
                {"group": "Phụ huynh & Giáo viên", "role": "Tiếp nhận & đọc thông báo", "actions": "Nhận thông báo đẩy trên App, xem công văn đính kèm và bấm nút 'Đã đọc'."}
            ],
            "glossary": [
                {"term": "Thông báo khẩn cấp (Urgent)", "definition": "Bản tin có mức ưu tiên cao nhất, luôn ghim nổi trên đầu ứng dụng và phát âm thanh cảnh báo tới điện thoại người nhận."},
                {"term": "Recipient Preview", "definition": "Tính năng tính toán và hiển thị trước danh sách đích danh các phụ huynh/giáo viên sẽ nhận tin dựa trên bộ lọc đã chọn."},
                {"term": "Công văn đính kèm", "definition": "Tệp văn bản chính thức (thường là PDF có chữ ký số hoặc dấu mộc đỏ của nhà trường) đính kèm trong bài thông báo."}
            ]
        },
        "business": {
            "flow_desc": "BGH soạn thông báo, chọn nhóm đối tượng nhận, xem trước số lượng người nhận, bấm xuất bản; hệ thống lập tức đẩy thông báo lên bảng tin và bắn Push Notification tới ứng dụng người nhận.",
            "flow_steps": [
                {"actor": "BGH / Văn phòng", "action": "Soạn thông báo", "desc": "Truy cập `/school/announcements`, nhập tiêu đề, nội dung rich text và đính kèm công văn PDF."},
                {"actor": "BGH", "action": "Chọn đối tượng nhận", "desc": "Chọn phạm vi: 'Toàn trường' hoặc 'Khối Mầm non (Lớp Mầm 1, Mầm 2)'."},
                {"actor": "BGH", "action": "Xem trước người nhận (Preview)", "desc": "Mở RecipientPreviewModal, hệ thống báo có 150 phụ huynh sẽ nhận được thông báo."},
                {"actor": "BGH", "action": "Bấm 'Xuất bản'", "desc": "Xác nhận gửi; nếu là tin khẩn cấp thì kích hoạt đồng thời kênh SMS/Zalo."},
                {"actor": "Phụ huynh / GV", "action": "Nhận tin & Xem", "desc": "Nhận Push Notification trên điện thoại, bấm vào xem chi tiết bài thông báo."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Khởi tạo bản tin): Người dùng bấm nút 'Tạo thông báo mới' trên thanh công cụ AnnouncementToolbar.",
                "Giai đoạn 2 (Nhập liệu đa phương tiện): Sử dụng AnnouncementComposer để nhập tiêu đề, phân loại chuyên mục (Khẩn cấp / Sự kiện / Học vụ), tải tệp công văn và chọn ảnh bìa bản tin.",
                "Giai đoạn 3 (Phân loại người nhận & Preview): Chọn nhóm đối tượng. Nhấp 'Xem trước người nhận' (RecipientPreviewModal) để kiểm tra danh sách phụ huynh, tránh gửi nhầm đối tượng.",
                "Giai đoạn 4 (Phát hành & Ghim tin): Bấm 'Đăng thông báo' hoặc 'Lên lịch phát hành vào ngày mai'. Chọn cờ 'Ghim lên đầu bảng tin' để tin luôn hiển thị ở vị trí dễ thấy nhất.",
                "Giai đoạn 5 (Giám sát đọc tin): Màn hình AnnouncementDetailView hiển thị biểu đồ tỷ lệ đọc (ví dụ: 135/150 phụ huynh đã đọc, đạt 90%). BGH có thể bấm 'Gửi nhắc nhở' cho 15 phụ huynh chưa đọc."
            ],
            "rules": [
                {"id": "BR-ANN-01", "title": "Bắt buộc tiêu đề và phân loại bản tin", "desc": "Thông báo phải có tiêu đề từ 5 đến 200 ký tự và bắt buộc chọn 1 chuyên mục phân loại cụ thể."},
                {"id": "BR-ANN-02", "title": "Xử lý thông báo khẩn cấp", "desc": "Khi đánh dấu cờ 'Khẩn cấp', thông báo sẽ tự động gửi Push tức thì bất kể khung giờ yên tĩnh và kích hoạt thêm kênh gửi SMS/Zalo nếu được cấp phép."},
                {"id": "BR-ANN-03", "title": "Không được sửa đối tượng nhận sau khi đã phát hành", "desc": "Thông báo đã gửi thành công tới người nhận không được thay đổi phạm vi đối tượng nhận; chỉ cho phép chỉnh sửa câu chữ nội dung hoặc xóa bản tin."}
            ],
            "data_entities": [
                {"field": "announcement_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính bản thông báo."},
                {"field": "title", "type": "String (200)", "required": "Bắt buộc", "desc": "Tiêu đề bản tin thông báo."},
                {"field": "category", "type": "Enum", "required": "Bắt buộc", "desc": "Chuyên mục: 'urgent' (Khẩn cấp), 'general' (Chung), 'academic' (Học vụ), 'fee' (Học phí)."},
                {"field": "content", "type": "HTML / Text", "required": "Bắt buộc", "desc": "Nội dung văn bản định dạng phong phú."},
                {"field": "target_scope", "type": "Enum", "required": "Bắt buộc", "desc": "Phạm vi: 'all_school', 'specific_grades', 'specific_classes', 'staff_only'."},
                {"field": "attachment_urls", "type": "Array[String]", "required": "Tùy chọn", "desc": "Danh sách URL tệp đính kèm."},
                {"field": "is_urgent", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ thông báo khẩn cấp."},
                {"field": "is_pinned", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ ghim đầu trang."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-014 Nhà trường Bảng thông tin", "feature": "Trình soạn thảo thông báo đa phương tiện (AnnouncementComposer)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn soạn thông báo đính kèm tệp PDF công văn và chọn đối tượng nhận.", "jira": "ANN-001"},
                {"epic": "E-014 Nhà trường Bảng thông tin", "feature": "Xem trước danh sách người nhận (RecipientPreviewModal)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn kiểm tra trước số lượng phụ huynh nhận tin để đảm bảo không gửi nhầm.", "jira": "ANN-002"},
                {"epic": "E-014 Nhà trường Bảng thông tin", "feature": "Chi tiết thông báo & Giám sát tỷ lệ đọc (AnnouncementDetailView)", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn biết bao nhiêu phụ huynh đã đọc thông báo của trường.", "jira": "ANN-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-ANN-01",
                    "name": "Phát hành thông báo khẩn cấp nghỉ học do bão",
                    "desc": "BGH gửi thông báo nghỉ học khẩn cấp tới toàn trường.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Có công văn khẩn của Sở GD&ĐT.",
                    "pre": "BGH đã đăng nhập tài khoản có quyền Quản trị.",
                    "happy_path": [
                        "1. BGH nhập Tiêu đề: 'Thông báo khẩn: Học sinh toàn trường nghỉ học phòng tránh bão số 6'.",
                        "2. Tích chọn cờ 'Khẩn cấp' và chọn chuyên mục 'Khẩn cấp'.",
                        "3. Chọn phạm vi người nhận: 'Toàn trường'.",
                        "4. Đính kèm công văn số 1234/SGDĐT-CTTT dạng PDF.",
                        "5. Bấm 'Xuất bản thông báo ngay'.",
                        "6. Hệ thống gửi thông báo Push khẩn cấp tới 100% phụ huynh và giáo viên toàn trường."
                    ],
                    "exceptions": [
                        {"case": "Tệp đính kèm vượt quá 20MB", "handling": "Hệ thống báo lỗi 'Kích thước tệp đính kèm tối đa là 20MB, vui lòng nén tệp trước khi tải lên'."}
                    ],
                    "post": "Thông báo khẩn cấp được ghim trên cùng của bảng tin trên toàn hệ thống.",
                    "rules": ["BR-ANN-01", "BR-ANN-02"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Bảng thông tin (`/[schoolCode]/school/announcements`)",
            "screens_table": [
                {"screen": "Bảng tin thông báo (`AnnouncementTable`)", "component": "Thẻ KPI tổng quan (`AnnouncementSummaryCards`)", "format": "3 Card ngang: Tổng số thông báo, Thông báo khẩn cấp (đỏ), Tỷ lệ xem trung bình (xanh lá)", "desc": "Báo cáo nhanh hiệu quả truyền thông trường học.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Trình soạn thông báo (`AnnouncementComposer`)", "component": "Khung soạn thảo văn bản giàu", "format": "Input Tiêu đề, Dropdown Chuyên mục, Switch Khẩn cấp, Switch Ghim tin, Trình soạn thảo Rich Text, Khung đính kèm tệp PDF, Bộ chọn đối tượng nhận", "desc": "Nơi soạn thảo và phát hành bản tin chính thức.", "note": "BR-ANN-01, BR-ANN-02"},
                {"screen": "Modal xem trước người nhận (`RecipientPreviewModal`)", "component": "Hộp thoại tóm tắt danh sách người nhận", "format": "Tổng số người nhận (Phụ huynh, Giáo viên), Bảng danh sách xem trước (Họ tên, Vai trò, Lớp liên quan), Nút 'Xác nhận gửi'", "desc": "Chống gửi nhầm đối tượng.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Chi tiết thông báo (`AnnouncementDetailView`)", "component": "Trang chi tiết bản tin và thống kê đọc", "format": "Tiêu đề lớn, Badge chuyên mục, Ngày đăng, Nội dung chi tiết, Danh sách tệp đính kèm tải về, Thanh tiến trình tỷ lệ đọc (Đã đọc / Chưa đọc)", "desc": "Xem toàn văn bản tin và theo dõi tỷ lệ tương tác.", "note": "BR-ANN-03"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-ANN-01",
                "title": "Phát hành thông báo toàn trường thành công",
                "scenario": "Given BGH soạn thông báo với tiêu đề hợp lệ, phạm vi Toàn trường\nWhen bấm nút 'Xuất bản ngay'\nThen thông báo xuất hiện trên đầu bảng tin và toàn bộ phụ huynh nhận được thông báo Push trên điện thoại."
            },
            {
                "id": "AC-ANN-02",
                "title": "Xem trước danh sách người nhận chính xác",
                "scenario": "Given BGH chọn đối tượng nhận là 'Khối 1' (gồm 3 lớp 1A1, 1A2, 1A3 với 90 phụ huynh)\nWhen bấm nút 'Xem trước người nhận'\nThen RecipientPreviewModal hiển thị chính xác con số '90 phụ huynh' kèm danh sách chi tiết."
            }
        ],
        "nfr": {
            "performance": "Gửi thông báo Push đến 1000 phụ huynh trong thời gian < 5 giây.",
            "security": "Chỉ BGH và cán bộ văn phòng được cấp quyền mới có thể đăng thông báo trường.",
            "ux": "Giao diện soạn thảo rich text mượt mà, hỗ trợ copy-paste ảnh trực tiếp từ clipboard."
        },
        "appendix": {
            "notifications": [
                {"event": "Thông báo trường mới", "channel": "Push Notification", "recipient": "Phụ huynh & Giáo viên", "content": "Nhà trường vừa phát hành thông báo mới: '[Tiêu đề thông báo]'."}
            ],
            "edge_cases": [
                {"condition": "Mất điện hoặc sự cố mạng khi đang soạn dở thông báo dài", "solution": "Trình soạn thảo tự động lưu nháp cục bộ (Auto-save draft) vào LocalStorage mỗi 30 giây."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 3. M5/SM11 - Góp ý (Parent Feedback & Service Desk)
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM11",
        "name": "M5 - SM11 - Góp ý",
        "parent_module": "M5",
        "priority": "MEDIUM",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Tiếp Nhận & Xử Lý Ý Kiến Đóng Góp, Khiếu Nại Của Phụ Huynh (Parent Feedback & School Service Desk)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> đóng vai trò là hòm thư góp ý điện tử chính thức và minh bạch của nhà trường (`/[schoolCode]/school/feedback`). Phân hệ cho phép phụ huynh gửi các phản ánh, kiến nghị liên quan đến chất lượng bữa ăn bán trú, vệ sinh an toàn thực phẩm, thái độ sư phạm, cơ sở vật chất, xe đưa đón học sinh hoặc học phí. Hệ thống cung cấp quy trình phân loại xử lý theo từng phòng ban, luồng thảo luận hai chiều nội bộ (`DiscussionStream`, `DiscussionComposer`), đánh giá chỉ số hài lòng (CSAT), theo dõi thời gian phản hồi (SLA) và quy trình đóng hồ sơ khiếu nại có biên bản kết luận (`ClosureModal`).",
            "goals_list": [
                "Cung cấp sổ tiếp nhận ý kiến đóng góp (`FeedbackRoster`) với bộ lọc trạng thái: Mới tiếp nhận, Đang xử lý, Đã giải quyết, Đã đóng hồ sơ.",
                "Thẻ đo lường KPI dịch vụ (`FeedbackKPICards`): Tổng số ý kiến tiếp nhận trong tháng, Tỷ lệ xử lý đúng hạn SLA (mục tiêu > 95%), Điểm hài lòng trung bình CSAT.",
                "Ngăn xử lý chi tiết (`FeedbackDetailPane`): Hiển thị toàn bộ lịch sử phản ánh của phụ huynh, hồ sơ nhanh của học sinh (`ProfileQuickViewModal`).",
                "Luồng trao đổi hai chiều giữa BGH và Phụ huynh (`DiscussionStream`): Nhắn tin giải trình, đính kèm hình ảnh khắc phục (ví dụ: ảnh sửa chữa điều hòa hỏng).",
                "Quy trình đóng hồ sơ khiếu nại chuẩn mực (`ClosureModal`): Nhập kết luận xử lý, giải pháp phòng ngừa và gửi khảo sát đánh giá độ hài lòng cho phụ huynh."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Giám sát & chỉ đạo xử lý khiếu nại", "actions": "Đọc các phản ánh bức xúc, phân công bộ phận chuyên trách xử lý và duyệt văn bản phản hồi."},
                {"group": "Bộ phận Chăm sóc khách hàng / Văn phòng", "role": "Tiếp nhận & điều phối khiếu nại", "actions": "Phân loại ý kiến (Bếp ăn, Cơ sở vật chất, Học phí), trao đổi với phụ huynh và theo dõi hạn xử lý SLA."},
                {"group": "Phụ huynh học sinh", "role": "Gửi phản ánh & đánh giá", "actions": "Gửi ý kiến qua ứng dụng di động, theo dõi tiến độ xử lý của trường và chấm điểm hài lòng."}
            ],
            "glossary": [
                {"term": "SLA (Service Level Agreement)", "definition": "Cam kết thời gian phản hồi và xử lý xong một phản ánh của phụ huynh (thường là trong vòng 24 giờ đến 48 giờ làm việc)."},
                {"term": "CSAT (Customer Satisfaction Score)", "definition": "Điểm đánh giá mức độ hài lòng của phụ huynh sau khi nhà trường xử lý xong phản ánh (thang điểm từ 1 đến 5 sao)."},
                {"term": "Đóng hồ sơ (Ticket Closure)", "definition": "Thao tác kết thúc xử lý một phản ánh sau khi phụ huynh đồng thuận với phương án giải quyết của nhà trường."}
            ]
        },
        "business": {
            "flow_desc": "Phụ huynh gửi phản ánh qua App, phân hệ ghi nhận và phân loại ticket, trường cử bộ phận liên quan xử lý và phản hồi trong luồng thảo luận; sau khi hoàn tất, BGH đóng hồ sơ và phụ huynh chấm điểm hài lòng.",
            "flow_steps": [
                {"actor": "Phụ huynh", "action": "Gửi phản ánh", "desc": "Phụ huynh mở App, chọn chuyên mục 'Chất lượng bữa ăn', nhập nội dung và tải ảnh minh họa."},
                {"actor": "Hệ thống BE", "action": "Khởi tạo Ticket & Tính hạn SLA", "desc": "Tạo bản ghi mới ở trạng thái 'Mới tiếp nhận' và đặt hạn phản hồi SLA là 24h."},
                {"actor": "Văn phòng / BGH", "action": "Tiếp nhận & Trao đổi", "desc": "Mở FeedbackDetailPane, kiểm tra và phản hồi: 'Nhà trường đã làm việc với nhà bếp để điều chỉnh thực đơn'."},
                {"actor": "Phụ huynh", "action": "Xác nhận hài lòng", "desc": "Phụ huynh đọc phản hồi, đồng ý với cách xử lý của trường."},
                {"actor": "BGH", "action": "Đóng hồ sơ (ClosureModal)", "desc": "Bấm 'Đóng hồ sơ', nhập kết luận và hệ thống gửi khảo sát 5 sao tới phụ huynh."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Tiếp nhận phản ánh): Phụ huynh gửi ý kiến từ Mobile App. Sổ tiếp nhận FeedbackRoster hiển thị dòng khiếu nại mới kèm nhãn màu đỏ 'Mới'.",
                "Giai đoạn 2 (Xem xét hồ sơ & Tra cứu ngữ cảnh): Cán bộ bấm vào xem chi tiết. Panel bên phải mở FeedbackDetailPane, hiển thị ProfileQuickViewModal của học sinh để biết bé học lớp nào, phụ huynh là ai.",
                "Giai đoạn 3 (Trao đổi trực tiếp trong luồng - DiscussionStream): Nhà trường nhập nội dung trả lời qua DiscussionComposer. Nếu phụ huynh gửi thêm câu hỏi, luồng tin nhắn nối tiếp nhau như cuộc hội thoại chuyên nghiệp.",
                "Giai đoạn 4 (Đóng hồ sơ khiếu nại - ClosureModal): Khi vấn đề đã được giải quyết triệt để, cán bộ bấm 'Đóng hồ sơ'. Modal yêu cầu nhập tóm tắt phương án giải quyết và chọn phân loại nguyên nhân.",
                "Giai đoạn 5 (Đánh giá mức độ hài lòng): Ứng dụng phụ huynh hiển thị pop-up mời chấm điểm từ 1 đến 5 sao và để lại nhận xét về thái độ xử lý của trường."
            ],
            "rules": [
                {"id": "BR-FDB-01", "title": "Bảo mật danh tính người góp ý nếu chọn ẩn danh", "desc": "Nếu phụ huynh tick chọn 'Góp ý ẩn danh', hệ thống tuyệt đối không hiển thị tên phụ huynh và tên học sinh cho giáo viên lớp đó xem (chỉ BGH cấp cao nhất mới có quyền tra cứu khi có vấn đề pháp lý)."},
                {"id": "BR-FDB-02", "title": "Cam kết thời gian xử lý SLA 24h-48h", "desc": "Tất cả phản ánh phải được phản hồi lần đầu trong vòng 24 giờ làm việc. Nếu quá 48 giờ chưa xử lý, hệ thống tự động đổi màu ticket sang đỏ và gửi cảnh báo tới Hiệu trưởng."},
                {"id": "BR-FDB-03", "title": "Bắt buộc nhập lý do khi đóng hồ sơ", "desc": "Khi đóng hồ sơ khiếu nại, người xử lý bắt buộc phải nhập nội dung giải pháp đã thực hiện và kết quả đồng thuận của phụ huynh."}
            ],
            "data_entities": [
                {"field": "feedback_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính phiếu góp ý."},
                {"field": "student_id", "type": "UUID", "required": "Tùy chọn", "desc": "Học sinh liên quan (nếu không ẩn danh)."},
                {"field": "parent_id", "type": "UUID", "required": "Tùy chọn", "desc": "Phụ huynh gửi góp ý."},
                {"field": "category", "type": "Enum", "required": "Bắt buộc", "desc": "Chuyên mục: 'meal' (Bữa ăn), 'facility' (Cơ sở vật chất), 'teacher' (Giáo viên), 'bus' (Xe buýt), 'tuition' (Học phí), 'other'."},
                {"field": "status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái: 'new' (Mới), 'processing' (Đang xử lý), 'resolved' (Đã giải quyết), 'closed' (Đã đóng)."},
                {"field": "rating_score", "type": "Integer (1-5)", "required": "Tùy chọn", "desc": "Điểm đánh giá hài lòng của phụ huynh."},
                {"field": "resolution_note", "type": "Text", "required": "Tùy chọn", "desc": "Nội dung biên bản kết luận giải quyết."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-015 Nhà trường Góp ý", "feature": "Sổ tiếp nhận ý kiến & Thẻ KPI dịch vụ", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem danh sách các phản ánh của phụ huynh và tỷ lệ xử lý đúng hạn.", "jira": "FDB-001"},
                {"epic": "E-015 Nhà trường Góp ý", "feature": "Luồng thảo luận giải quyết hai chiều (DiscussionStream)", "platform": "Portal Web", "priority": "P1", "story": "Là cán bộ trường, tôi muốn trao đổi trực tiếp với phụ huynh để làm rõ vấn đề khiếu nại.", "jira": "FDB-002"},
                {"epic": "E-015 Nhà trường Góp ý", "feature": "Quy trình đóng hồ sơ & Khảo sát CSAT (ClosureModal)", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn đóng hồ sơ có biên bản kết luận và ghi nhận điểm hài lòng của phụ huynh.", "jira": "FDB-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-FDB-01",
                    "name": "Xử lý và phản hồi ý kiến phụ huynh về cơ sở vật chất",
                    "desc": "Nhà trường tiếp nhận phản ánh điều hòa hỏng và thông báo kết quả sửa chữa.",
                    "actor": "Cán bộ Quản trị thiết bị",
                    "trigger": "Phụ huynh gửi phản ánh 'Điều hòa lớp 1A1 không mát'.",
                    "pre": "Ticket đã được tạo trên hệ thống.",
                    "happy_path": [
                        "1. Cán bộ mở ticket trong FeedbackRoster.",
                        "2. Nhập vào DiscussionComposer: 'Nhà trường đã cử thợ bảo dưỡng nạp gas điều hòa vào chiều nay'.",
                        "3. Đính kèm ảnh biên bản nghiệm thu kỹ thuật.",
                        "4. Bấm 'Gửi phản hồi'.",
                        "5. Phụ huynh nhận thông báo và bấm xác nhận 'Đã hài lòng'.",
                        "6. Cán bộ bấm 'Đóng hồ sơ' trong ClosureModal."
                    ],
                    "exceptions": [
                        {"case": "Phụ huynh chưa hài lòng với kết quả xử lý", "handling": "Ticket giữ ở trạng thái 'Đang xử lý' và chuyển tiếp lên Hiệu trưởng xem xét trực tiếp."}
                    ],
                    "post": "Hồ sơ được đóng thành công và lưu vào kho lưu trữ khiếu nại.",
                    "rules": ["BR-FDB-02", "BR-FDB-03"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Góp ý (`/[schoolCode]/school/feedback`)",
            "screens_table": [
                {"screen": "Bảng tiếp nhận góp ý (`FeedbackRoster`)", "component": "Thẻ KPI chất lượng dịch vụ (`FeedbackKPICards`)", "format": "3 Card ngang: Tổng số góp ý tháng, Tỷ lệ đúng hạn SLA (%), Điểm hài lòng CSAT (Sao trung bình)", "desc": "Đo lường mức độ hài lòng của phụ huynh toàn trường.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Bảng tiếp nhận góp ý (`FeedbackRoster`)", "component": "Danh sách phiếu góp ý (`FeedbackRoster`)", "format": "Table gồm: Mã ticket, Phụ huynh / Ẩn danh, Học sinh & Lớp, Chuyên mục, Trạng thái (Pill badge), Hạn SLA, Thao tác", "desc": "Bảng điều phối và xử lý phản ánh.", "note": "BR-FDB-01"},
                {"screen": "Ngăn chi tiết xử lý (`FeedbackDetailPane`)", "component": "Luồng thảo luận hai chiều (`DiscussionStream`)", "format": "Timeline trao đổi giữa Trường và Phụ huynh, Khung soạn thảo phản hồi (`DiscussionComposer`), Nút xem hồ sơ nhanh (`ProfileQuickViewModal`), Nút 'Đóng hồ sơ' (`ClosureModal`)", "desc": "Khu vực tác nghiệp giải quyết khiếu nại trực tiếp.", "note": "BR-FDB-02, BR-FDB-03"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-FDB-01",
                "title": "Ẩn danh hoàn toàn thông tin phụ huynh khi chọn ẩn danh",
                "scenario": "Given Phụ huynh gửi góp ý và tích chọn 'Ẩn danh'\nWhen cán bộ trường xem chi tiết ticket trên FeedbackDetailPane\nThen tên phụ huynh hiển thị là 'Phụ huynh ẩn danh', không có thông tin số điện thoại hay tên học sinh liên quan."
            },
            {
                "id": "AC-FDB-02",
                "title": "Cảnh báo quá hạn SLA khi chưa phản hồi sau 24h",
                "scenario": "Given Một góp ý được tạo từ 08:00 sáng hôm qua\nWhen qua 24 giờ mà trường chưa có tin nhắn phản hồi nào\nThen ticket tự động đổi màu viền sang đỏ và hiển thị badge 'Quá hạn SLA 24h'."
            }
        ],
        "nfr": {
            "performance": "Tải luồng thảo luận trao đổi dưới 300ms.",
            "security": "Nội dung góp ý được bảo mật nghiêm ngặt, không rò rỉ ra ngoài ban điều hành trường.",
            "ux": "Giao diện chia 2 cột hiện đại: Cột trái danh sách ticket, cột phải là luồng thảo luận trực tiếp."
        },
        "appendix": {
            "notifications": [
                {"event": "Góp ý mới gửi đến", "channel": "In-app Alert", "recipient": "Ban Giám Hiệu", "content": "Có 1 ý kiến đóng góp mới từ phụ huynh về chuyên mục [Chuyên mục]."},
                {"event": "Trường đã phản hồi", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Nhà trường vừa phản hồi ý kiến đóng góp của bạn: '[Đoạn trích]'."}
            ],
            "edge_cases": [
                {"condition": "Phụ huynh liên tục gửi spam các góp ý vô căn cứ", "solution": "Hệ thống hỗ trợ Admin gắn cờ cảnh báo hoặc tạm khóa chức năng gửi góp ý của tài khoản đó trong 7 ngày."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 4. M5/SM10 - Sổ tay PH (Parent Handbook & Regulations)
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM10",
        "name": "M5 - SM10 - Sổ tay PH",
        "parent_module": "M5",
        "priority": "MEDIUM",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Sổ Tay Phụ Huynh & Cẩm Nang Quy Định Nhà Trường (Digital Parent Handbook & School Policies)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> đóng vai trò là cuốn cẩm nang số hóa toàn bộ nội quy, quy chế hoạt động, hướng dẫn đưa đón học sinh, quy định tài chính và thông tin liên hệ khẩn cấp của nhà trường (`/[schoolCode]/school/handbook`). Thay vì in ấn cuốn sổ tay giấy tốn kém và dễ thất lạc, phụ huynh có thể tra cứu thông tin nhanh chóng trên ứng dụng di động bất kỳ lúc nào với cấu trúc cây thư mục chuyên mục phân cấp rõ ràng (`HandbookAccordionTree`), tìm kiếm toàn văn (Full-text Search) và xác nhận cam kết thực hiện nội quy trực tuyến.",
            "goals_list": [
                "Quản lý cây chuyên mục sổ tay phân cấp nhiều tầng (`CategoryModal`): Quy định chung, Chế độ chăm sóc nuôi dưỡng, Quy định đưa đón trẻ, Chính sách học phí và hoàn tiền, Sơ đồ liên hệ khẩn cấp.",
                "Trình hiển thị bài viết chi tiết (`HandbookDetailPanel`): Hỗ trợ định dạng văn bản chuẩn mực, bảng biểu, ảnh sơ đồ trường và các tệp biểu mẫu tải về (đơn xin nghỉ phép dài hạn, giấy ủy quyền đưa đón).",
                "Quản lý danh sách câu hỏi thường gặp (FAQ) được phụ huynh quan tâm nhiều nhất.",
                "Hỗ trợ tìm kiếm từ khóa thông minh: Giúp phụ huynh gõ 'tiền ăn', 'đón muộn' là ra ngay điều khoản quy định tương ứng.",
                "Ghi nhận nhật ký đọc và ký cam kết: Theo dõi phụ huynh đã đọc và bấm nút 'Tôi đã hiểu và cam kết tuân thủ nội quy trường học' đầu năm học."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Ban hành nội quy trường", "actions": "Biên tập các điều khoản quy định, cập nhật chính sách mới đầu năm học và duyệt xuất bản sổ tay."},
                {"group": "Cán bộ Văn phòng trường", "role": "Quản trị nội dung cẩm nang", "actions": "Tạo các danh mục, cập nhật số điện thoại đường dây nóng và tải lên các tệp mẫu đơn."},
                {"group": "Phụ huynh học sinh", "role": "Tra cứu quy định & Ký cam kết", "actions": "Đọc nội quy trường trên App di động, tra cứu chính sách học phí và ký xác nhận đồng thuận đầu năm học."}
            ],
            "glossary": [
                {"term": "Sổ tay phụ huynh số (Digital Handbook)", "definition": "Kho tài liệu điện tử tổng hợp toàn bộ quy tắc ứng xử, quyền lợi và nghĩa vụ của gia đình và nhà trường."},
                {"term": "Accordion Tree", "definition": "Cấu trúc hiển thị phân cấp dạng cây có thể mở rộng/thu gọn linh hoạt theo từng chương mục."},
                {"term": "Ký cam kết nội quy", "definition": "Hành động bấm nút xác nhận điện tử của phụ huynh trên ứng dụng xác nhận đã đọc và cam kết thực hiện đúng nội quy trường học."}
            ]
        },
        "business": {
            "flow_desc": "BGH biên soạn các chương mục quy định trong sổ tay, xuất bản lên Portal; phụ huynh mở ứng dụng di động để tra cứu thông tin hoặc ký xác nhận cam kết nội quy đầu năm học.",
            "flow_steps": [
                {"actor": "BGH", "action": "Tạo chương mục mới", "desc": "Mở `/school/handbook`, bấm 'Thêm chuyên mục', tạo nhóm 'Quy định đón trả trẻ'."},
                {"actor": "BGH", "action": "Soạn nội dung điều khoản", "desc": "Nhập các quy tắc về giờ giấc, người đón ủy quyền và mức phụ phí đón muộn."},
                {"actor": "BGH", "action": "Xuất bản sổ tay", "desc": "Bấm 'Xuất bản', hệ thống đồng bộ nội dung mới lên ứng dụng phụ huynh."},
                {"actor": "Phụ huynh", "action": "Tra cứu & Ký cam kết", "desc": "Phụ huynh mở mục Sổ tay trên App, đọc nội dung và bấm 'Cam kết tuân thủ'."},
                {"actor": "Hệ thống BE", "action": "Ghi nhận cam kết", "desc": "Lưu vết thời gian ký và tài khoản phụ huynh vào hồ sơ học sinh."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Thiết lập cây chuyên mục): BGH dùng CategoryModal để tạo các chương: Chương 1 - Giới thiệu chung; Chương 2 - Quy định chăm sóc bán trú; Chương 3 - Quy định đưa đón; Chương 4 - Học phí & Phụ phí.",
                "Giai đoạn 2 (Biên tập nội dung từng bài viết): Sử dụng HandbookDetailPanel để nhập chi tiết từng điều khoản, chèn ảnh sơ đồ vị trí các cổng đón trả trẻ và đính kèm file PDF biểu mẫu.",
                "Giai đoạn 3 (Xóa hoặc sắp xếp lại thứ tự): BGH có thể kéo thả thay đổi vị trí các chương hoặc bấm xóa chuyên mục không còn phù hợp qua HandbookDeleteModal.",
                "Giai đoạn 4 (Xuất bản & Thông báo): Bấm xuất bản sổ tay năm học mới. Hệ thống tự động gửi Push thông báo tới toàn thể phụ huynh đầu năm học.",
                "Giai đoạn 5 (Theo dõi tỷ lệ cam kết): BGH xem bảng thống kê số lượng phụ huynh của từng lớp đã hoàn thành ký cam kết nội quy trực tuyến."
            ],
            "rules": [
                {"id": "BR-HND-01", "title": "Bảo vệ chuyên mục khi đang có bài viết con", "desc": "Không cho phép xóa chuyên mục cha nếu bên trong vẫn còn chứa các bài viết con; bắt buộc phải xóa hoặc chuyển các bài con trước."},
                {"id": "BR-HND-02", "title": "Lưu vết phiên bản sổ tay phụ huynh", "desc": "Mỗi lần sửa đổi nội dung quy định lớn, hệ thống tự động sinh số phiên bản mới (ví dụ: v2.0 - Năm học 2026-2027) để đảm bảo tính pháp lý khi đối soát khiếu nại."},
                {"id": "BR-HND-03", "title": "Bắt buộc ký cam kết đối với học sinh nhập học mới", "desc": "Phụ huynh học sinh mới nhập học bắt buộc phải đọc và bấm 'Cam kết tuân thủ nội quy' trước khi thực hiện các tác vụ khác trên Mobile App."}
            ],
            "data_entities": [
                {"field": "handbook_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính bài viết cẩm nang."},
                {"field": "category_id", "type": "UUID", "required": "Bắt buộc", "desc": "Chuyên mục cha chứa bài viết."},
                {"field": "title", "type": "String (200)", "required": "Bắt buộc", "desc": "Tiêu đề điều khoản hoặc quy định."},
                {"field": "content", "type": "HTML / Text", "required": "Bắt buộc", "desc": "Nội dung văn bản quy chế chi tiết."},
                {"field": "order_index", "type": "Integer", "required": "Mặc định 0", "desc": "Thứ tự sắp xếp hiển thị trong cây thư mục."},
                {"field": "is_mandatory_acknowledge", "type": "Boolean", "required": "Mặc định False", "desc": "Yêu cầu phụ huynh bắt buộc bấm cam kết hay không."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-016 Nhà trường Sổ tay PH", "feature": "Cây thư mục cẩm nang quy chế (HandbookAccordionTree)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn phân loại sổ tay thành các chương mục rõ ràng để phụ huynh dễ tra cứu.", "jira": "HND-001"},
                {"epic": "E-016 Nhà trường Sổ tay PH", "feature": "Trình xem và chỉnh sửa bài viết nội quy (HandbookDetailPanel)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn soạn thảo chi tiết các quy định đón trẻ, học phí và đính kèm biểu mẫu.", "jira": "HND-002"},
                {"epic": "E-016 Nhà trường Sổ tay PH", "feature": "Ký cam kết nội quy trực tuyến đầu năm", "platform": "Mobile App / Web", "priority": "P2", "story": "Là Phụ huynh, tôi muốn bấm cam kết thực hiện nội quy trực tuyến thay vì ký giấy.", "jira": "HND-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-HND-01",
                    "name": "Cập nhật chính sách hoàn tiền ăn trong sổ tay",
                    "desc": "BGH bổ sung điều khoản báo vắng trước 08:00 sáng để được hoàn tiền.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Bắt đầu năm học mới.",
                    "pre": "Đã có chuyên mục 'Chính sách tài chính & hoàn tiền'.",
                    "happy_path": [
                        "1. BGH nhấp vào mục 'Chính sách tài chính' trong cây thư mục.",
                        "2. Chọn bài viết 'Quy định hoàn tiền ăn bán trú'.",
                        "3. Bổ sung nội dung: 'Phụ huynh báo vắng trước 08:00 sáng qua ứng dụng sẽ được hoàn trả 100% tiền ăn ngày đó'.",
                        "4. Bấm 'Lưu thay đổi'.",
                        "5. Hệ thống cập nhật tức thì trên ứng dụng di động của phụ huynh."
                    ],
                    "exceptions": [
                        {"case": "Chuyên mục bị khóa do đang có người khác chỉnh sửa", "handling": "Hệ thống hiển thị thông báo người đang thao tác và khóa tạm thời trong 5 phút."}
                    ],
                    "post": "Điều khoản mới được công bố chính thức tới phụ huynh.",
                    "rules": ["BR-HND-02"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Sổ tay PH (`/[schoolCode]/school/handbook`)",
            "screens_table": [
                {"screen": "Quản trị sổ tay (`HandbookAccordionTree`)", "component": "Thanh công cụ cẩm nang (`HandbookToolbar`)", "format": "Ô tìm kiếm quy chế, Nút 'Thêm chuyên mục', Nút 'Thêm bài viết', Nút 'Xem trước bản in'", "desc": "Các nút thao tác quản trị nội dung.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Quản trị sổ tay (`HandbookAccordionTree`)", "component": "Cây thư mục cẩm nang (`HandbookAccordionTree`)", "format": "Danh sách các chương mục dạng Accordion mở rộng/thu gọn, Biểu tượng folder, Số lượng bài viết con, Nút sửa/xóa chuyên mục", "desc": "Cấu trúc phân cấp cẩm nang trường học.", "note": "BR-HND-01"},
                {"screen": "Khung xem & soạn thảo (`HandbookDetailPanel`)", "component": "Khung nội dung chi tiết bài viết", "format": "Tiêu đề bài viết, Trình soạn thảo văn bản, Danh sách tệp đính kèm tải xuống, Nút 'Lưu thay đổi'", "desc": "Khu vực biên tập văn bản quy chế chi tiết.", "note": "BR-HND-02"},
                {"screen": "Modal quản lý chuyên mục (`CategoryModal`)", "component": "Hộp thoại thêm/sửa chuyên mục", "format": "Input Tên chuyên mục, Dropdown Chuyên mục cha, Input Thứ tự hiển thị, Nút 'Xác nhận'", "desc": "Tạo mới hoặc đổi tên chương mục sổ tay.", "note": "Prototype hoàn chỉnh"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-HND-01",
                "title": "Tạo chuyên mục sổ tay mới thành công",
                "scenario": "Given BGH mở CategoryModal và nhập tên 'Quy định xe đưa đón học sinh'\nWhen bấm 'Xác nhận'\nThen chuyên mục mới xuất hiện trong cây thư mục Accordion bên trái."
            },
            {
                "id": "AC-HND-02",
                "title": "Chặn xóa chuyên mục cha khi còn bài con",
                "scenario": "Given Chuyên mục 'Chính sách học phí' đang có 3 bài viết con bên trong\nWhen người dùng bấm icon thùng rác để xóa chuyên mục cha\nThen hệ thống cảnh báo 'Không thể xóa chuyên mục đang chứa bài viết, vui lòng dọn dẹp bài con trước'."
            }
        ],
        "nfr": {
            "performance": "Tải toàn bộ cây thư mục sổ tay và nội dung bài viết dưới 300ms.",
            "security": "Phụ huynh chỉ có quyền đọc; chỉ BGH và cán bộ văn phòng được sửa đổi nội dung.",
            "ux": "Hỗ trợ tìm kiếm từ khóa với hiệu ứng highlight vàng các từ khớp trong văn bản."
        },
        "appendix": {
            "notifications": [
                {"event": "Cập nhật sổ tay phụ huynh", "channel": "Push Notification", "recipient": "Toàn thể phụ huynh", "content": "Nhà trường vừa cập nhật nội dung Sổ tay phụ huynh năm học mới. Quý phụ huynh vui lòng kiểm tra."}
            ],
            "edge_cases": [
                {"condition": "Phụ huynh chưa ký cam kết nhưng cần thao tác gấp trên ứng dụng", "solution": "Cho phép bấm 'Nhắc tôi sau 24 giờ' tối đa 3 lần trước khi bắt buộc phải bấm cam kết."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 5. M5/SM8 - Thực đơn (Nutrition Menu & Food Ingredients)
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM8",
        "name": "M5 - SM8 - Thực đơn",
        "parent_module": "M5",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Quản lý Thực Đơn Dinh Dưỡng Bán Trú & Nguồn Gốc Thực Phẩm (School Nutrition Menu & Dietary Traceability Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm số hóa công tác xây dựng thực đơn, tính toán hàm lượng calo/dinh dưỡng và công khai thực đơn ăn bán trú hàng tuần tới toàn thể phụ huynh học sinh (`/[schoolCode]/school/menu`). Phân hệ hỗ trợ cả 2 phương thức nhập liệu: Trình chỉnh sửa lưới thực đơn tương tác trực tiếp (`MenuGridEditor`) và Tải lên tệp ảnh/PDF thực đơn (`MenuFileUploadEditor`), tích hợp mô hình trí tuệ nhân tạo gợi ý món ăn theo mùa (`AIMenuSuggestionModal`), quản lý định lượng calo và dị ứng thực phẩm (`FoodIngredientModal`, `FoodIngredientViewModal`), đặc biệt tích hợp chương trình <strong>'Suất ăn minh bạch - Tick Xanh Trách Nhiệm' do Sở Công Thương TP.HCM chủ trì</strong> gắn trực tiếp theo từng <strong>Buổi ăn (Ăn sáng, Ăn trưa, Ăn xế)</strong> của mỗi ngày trong tuần (`MealSessionTickXanhModal`), sao chép thực đơn giữa các tuần (`CloneMenuModal`), xuất bản thực đơn tới phụ huynh (`PublishMenuModal`) và truy vết lịch sử gửi (`SendHistoryModal`).",
            "goals_list": [
                "Quản lý danh sách thực đơn tuần theo từng khối lớp hoặc toàn trường (Khối Mầm, Chồi, Lá, Tiểu học bán trú).",
                "Hỗ trợ 2 chế độ biên tập: Nhập liệu theo ô bữa ăn (Ăn sáng, Ăn trưa, Ăn xế) trên `MenuGridEditor` hoặc tải file PDF/ảnh thực đơn trên `MenuFileUploadEditor`.",
                "Tích hợp chương trình 'Suất ăn minh bạch - Tick Xanh Trách Nhiệm' của Sở Công Thương TP.HCM theo từng Buổi ăn (Ăn sáng, Ăn trưa, Ăn xế): Gắn URL truy xuất nguồn gốc (`https://tfd.tf/...`) độc lập cho từng buổi ăn của mỗi ngày; nút trạng thái trực quan tại chân mỗi ô buổi ăn: 'Đã có tick xanh' (pill xanh có icon check) và 'Chưa có tick xanh' (pill nét đứt xám); modal khai báo `MealSessionTickXanhModal`.",
                "Quản lý nguyên liệu thực phẩm cấp Món ăn (`FoodIngredientModal`, `FoodIngredientViewModal`): Khai báo danh mục nguyên liệu cấu thành, mã vạch quốc gia GTIN (GS1 Việt Nam chuẩn 8-13 số), số lô Lot Number và tự động nhận diện doanh nghiệp cung cấp đạt chuẩn VSATTP.",
                "Tích hợp AI gợi ý thực đơn thông minh (`AIMenuSuggestionModal`): Cân đối 4 nhóm chất (đạm, béo, bột đường, vitamin) đạt chuẩn viện Dinh dưỡng Quốc gia.",
                "Nhân bản thực đơn thông minh (`CloneMenuModal`): Tái sử dụng thực đơn tuần trước sang tuần mới chỉ với 1 click.",
                "Xuất bản thực đơn và lưu vết lịch sử gửi (`PublishMenuModal`, `SendHistoryModal`): Bắn thông báo Push tự động tới phụ huynh vào mỗi chiều thứ Sáu."
            ],
            "target_users": [
                {"group": "Nhân viên Dinh dưỡng / Bếp trưởng", "role": "Lên thực đơn, định lượng calo & gắn Tick Xanh", "actions": "Nhập danh sách món ăn từng bữa, khai báo link Tick Xanh Trách Nhiệm cho từng buổi ăn, kiểm tra dinh dưỡng và gửi BGH phê duyệt."},
                {"group": "Ban Giám Hiệu (BGH)", "role": "Kiểm duyệt & công bố thực đơn", "actions": "Duyệt thực đơn tuần, kiểm tra nguồn gốc thực phẩm Tick Xanh và bấm xuất bản tới phụ huynh."},
                {"group": "Phụ huynh học sinh", "role": "Xem thực đơn & truy xuất Tick Xanh", "actions": "Xem thực đơn của con mỗi ngày trên App di động, bấm vào link Tick Xanh để xem nguồn gốc thực phẩm và dặn cô giáo nếu con bị dị ứng món ăn cụ thể."}
            ],
            "glossary": [
                {"term": "Thực đơn lưới (Menu Grid)", "definition": "Bảng ma trận hiển thị các ngày trong tuần (Thứ 2 đến Thứ 7 kèm ngày tháng cụ thể DD/MM/YYYY) theo cột và các bữa ăn trong ngày theo hàng."},
                {"term": "Tick Xanh Trách Nhiệm", "definition": "Chương trình 'Suất ăn minh bạch - Tick Xanh Trách Nhiệm' do Sở Công Thương TP.HCM chủ trì nhằm kiểm soát chuỗi cung ứng thực phẩm an toàn học đường; được gắn theo BUỔI ĂN của từng ngày."},
                {"term": "Mã vạch GTIN", "definition": "Mã số vật phẩm thương mại toàn cầu (Global Trade Item Number) chuẩn GS1 Việt Nam (đầu số 893) dùng để truy xuất nhà sản xuất thực phẩm đạt chuẩn."},
                {"term": "Bữa xế chiều", "definition": "Bữa phụ sau giờ ngủ trưa của học sinh bán trú (sữa chua, hoa quả, bánh flan, sinh tố)."}
            ]
        },
        "business": {
            "flow_desc": "Bếp trưởng lên thực đơn tuần trên MenuGridEditor, khai báo link Tick Xanh Trách Nhiệm cho từng buổi ăn (Sáng, Trưa, Xế), khai báo nguyên liệu GTIN cho từng món ăn, gửi BGH duyệt; BGH bấm xuất bản trong PublishMenuModal, hệ thống gửi thông báo tới phụ huynh.",
            "flow_steps": [
                {"actor": "Bếp trưởng", "action": "Khởi tạo thực đơn tuần", "desc": "Mở `/school/menu`, chọn Tuần 42 (12/10/2026 - 17/10/2026), bấm 'Tạo thực đơn' hoặc mở thực đơn hiện có."},
                {"actor": "Bếp trưởng", "action": "Soạn món ăn & Khai báo nguyên liệu", "desc": "Nhập các món ăn vào từng bữa (hoặc dùng AI gợi ý), bấm 'Thêm nguyên liệu' trên từng món để nhập mã GTIN và số lô."},
                {"actor": "Bếp trưởng", "action": "Khai báo Tick Xanh theo Buổi ăn", "desc": "Tại chân mỗi ô buổi ăn (Ăn sáng, Ăn trưa, Ăn xế), bấm 'Chưa có tick xanh' để mở MealSessionTickXanhModal, nhập link URL truy xuất nguồn gốc do Sở Công Thương cấp và Lưu thay đổi."},
                {"actor": "BGH", "action": "Phê duyệt & Xuất bản (PublishMenuModal)", "desc": "Kiểm tra thực đơn và bấm 'Xuất bản tới phụ huynh' (tùy chọn đăng Bảng Thông Tin)."},
                {"actor": "Phụ huynh", "action": "Xem thực đơn & Truy xuất trên App", "desc": "Phụ huynh nhận thông báo, xem chi tiết món ăn từng ngày và bấm vào nút Tick Xanh để tra cứu nguồn gốc thực phẩm của từng buổi ăn."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Lựa chọn tuần & Khối): Cán bộ mở phân hệ Thực đơn, dùng MenuToolbar để chọn tuần học và đối tượng áp dụng (Toàn trường hoặc từng lớp cụ thể).",
                "Giai đoạn 2 (Nhập liệu thực đơn - MenuGridEditor): Bảng lưới hiển thị Thứ 2 đến Thứ 7 kèm ngày tháng cụ thể (ví dụ: Thứ 2 (12/10/2026)). Nhập chi tiết các món ăn vào từng hàng: Ăn sáng (Nui, Trà sữa), Ăn trưa (Cơm gà, Canh bí sườn), Ăn xế (Cơm bò, Sữa chua). Bấm FoodIngredientModal trên từng món để khai báo nguyên liệu và mã vạch GTIN.",
                "Giai đoạn 3 (Khai báo Tick Xanh Trách Nhiệm - MealSessionTickXanhModal): Tại chân mỗi ô buổi ăn, cán bộ kiểm tra trạng thái Tick Xanh. Bấm vào nút để mở modal 'Khai báo an toàn thực phẩm & Truy xuất nguồn gốc', xem phụ đề buổi ăn và danh sách món ăn, nhập URL Tick Xanh do Sở Công Thương TP.HCM cấp (ví dụ: https://tfd.tf/26198-B-29-0040260) và Lưu. Trạng thái ô đổi ngay sang '● Đã có tick xanh ✓'.",
                "Giai đoạn 4 (Nhân bản tuần trước - CloneMenuModal): Nếu chu kỳ món ăn lặp lại theo tuần hoặc tháng, cán bộ bấm 'Sao chép', chọn sao chép sang tuần đích mà không cần nhập lại từ đầu.",
                "Giai đoạn 5 (Phê duyệt & Phát hành - PublishMenuModal): BGH kiểm tra và bấm 'Xuất bản'. Hệ thống gửi thông báo Push tới 100% phụ huynh của khối lớp tương ứng và lưu vết vào SendHistoryModal."
            ],
            "rules": [
                {"id": "BR-MNU-01", "title": "Bắt buộc điền đủ các bữa ăn chính", "desc": "Thực đơn ngày học bắt buộc phải có tối thiểu Bữa trưa và Bữa xế chiều đối với học sinh bán trú; không được để trống hoàn toàn một ngày trong tuần."},
                {"id": "BR-MNU-02", "title": "Quy tắc Tick Xanh Trách Nhiệm gắn theo Buổi ăn", "desc": "Chương trình 'Suất ăn minh bạch - Tick Xanh Trách Nhiệm' do Sở Công Thương TP.HCM chủ trì được quản lý theo BUỔI ĂN (Ăn sáng, Ăn trưa, Ăn xế) của từng ngày, KHÔNG gắn theo từng món ăn riêng lẻ. Mỗi buổi ăn được cấp một đường dẫn URL truy xuất nguồn gốc (ví dụ: `https://tfd.tf/...`). Chân mỗi ô buổi ăn hiển thị nút trạng thái: 'Đã có tick xanh' (pill xanh có icon check) hoặc 'Chưa có tick xanh' (pill nét đứt xám). Phụ huynh và học sinh có nút bấm trực tiếp trên App di động để mở liên kết này."},
                {"id": "BR-MNU-03", "title": "Khai báo nguyên liệu và mã vạch GTIN cấp Món ăn", "desc": "Đối với từng món ăn cụ thể, nhà trường quản lý độc lập về hàm lượng calo (kcal) và danh mục nguyên liệu cấu thành. Hỗ trợ 2 phương thức: Mã vạch quốc gia GTIN (GS1 Việt Nam chuẩn 8-13 số kèm số lô Lot Number) hoặc Mã tem nội bộ/Chứng chỉ cơ sở. Hệ thống tự động tra cứu nhà cung cấp đạt chuẩn VSATTP và đánh giá trạng thái 'Đạt chuẩn' hoặc 'Chưa đủ thông tin'."},
                {"id": "BR-MNU-04", "title": "Cảnh báo chất gây dị ứng", "desc": "Các món ăn chứa thành phần nằm trong danh mục 8 nhóm thực phẩm dễ gây dị ứng (Bộ Y tế) bắt buộc phải gắn biểu tượng cảnh báo màu vàng để GVCN và phụ huynh lưu ý."},
                {"id": "BR-MNU-05", "title": "Khóa chỉnh sửa thực đơn đã qua", "desc": "Thực đơn của các tuần trong quá khứ đã phục vụ xong sẽ chuyển sang trạng thái Read-only để phục vụ thanh tra an toàn thực phẩm."}
            ],
            "data_entities": [
                {"field": "menu_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính thực đơn tuần."},
                {"field": "scope", "type": "Enum", "required": "Bắt buộc", "desc": "Phạm vi: 'all' (Toàn trường) hoặc 'class' (Lớp cụ thể)."},
                {"field": "class_id", "type": "UUID", "required": "Tùy chọn", "desc": "Mã lớp học nếu phạm vi là 'class'."},
                {"field": "week_number", "type": "Integer", "required": "Bắt buộc", "desc": "Số thứ tự tuần trong năm (Tuần 1 đến 52)."},
                {"field": "year", "type": "Integer", "required": "Bắt buộc", "desc": "Năm học tương ứng."},
                {"field": "start_date / end_date", "type": "Date", "required": "Bắt buộc", "desc": "Ngày bắt đầu (Thứ 2) và kết thúc (Thứ 7) của tuần thực đơn."},
                {"field": "content_type", "type": "Enum", "required": "Bắt buộc", "desc": "Hình thức nội dung: 'grid' (Dạng lưới món ăn) hoặc 'file' (Tệp đính kèm PDF/ảnh)."},
                {"field": "schedule", "type": "JSON", "required": "Bắt buộc", "desc": "Dữ liệu ma trận món ăn theo ngày và buổi, kèm cấu trúc tickXanh theo từng buổi ăn (breakfast, lunch, snack) chứa URL và trạng thái verified."},
                {"field": "status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái: 'draft' (Bản nháp), 'published' (Đã xuất bản)."},
                {"field": "published_at", "type": "Timestamp", "required": "Tùy chọn", "desc": "Thời điểm công bố thực đơn."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-017 Nhà trường Thực đơn", "feature": "Trình chỉnh sửa thực đơn lưới trực quan (MenuGridEditor) & Nút Tick Xanh theo Buổi ăn", "platform": "Portal Web", "priority": "P1", "story": "Là Bếp trưởng, tôi muốn nhập món ăn theo từng bữa và thấy rõ trạng thái Tick Xanh của từng buổi ăn ngay dưới chân ô.", "jira": "MNU-001"},
                {"epic": "E-017 Nhà trường Thực đơn", "feature": "Modal Khai báo an toàn thực phẩm & Truy xuất nguồn gốc theo Buổi ăn (MealSessionTickXanhModal)", "platform": "Portal Web", "priority": "P1", "story": "Là Bếp trưởng, tôi muốn khai báo URL Tick Xanh Trách Nhiệm của Sở Công Thương cho buổi ăn cụ thể.", "jira": "MNU-002"},
                {"epic": "E-017 Nhà trường Thực đơn", "feature": "Modal Khai báo nguyên liệu thực phẩm & GTIN theo Món ăn (FoodIngredientModal, FoodIngredientViewModal)", "platform": "Portal Web", "priority": "P1", "story": "Là Nhân viên dinh dưỡng, tôi muốn nhập danh mục nguyên liệu, mã GTIN và số lô cho từng món ăn độc lập.", "jira": "MNU-003"},
                {"epic": "E-017 Nhà trường Thực đơn", "feature": "AI gợi ý thực đơn cân đối dinh dưỡng (AIMenuSuggestionModal)", "platform": "Portal Web", "priority": "P1", "story": "Là Nhân viên dinh dưỡng, tôi muốn AI gợi ý thực đơn tuần đủ calo cho trẻ.", "jira": "MNU-004"},
                {"epic": "E-017 Nhà trường Thực đơn", "feature": "Nhân bản thực đơn tuần (CloneMenuModal) & Xuất bản gửi phụ huynh (PublishMenuModal, SendHistoryModal)", "platform": "Portal Web", "priority": "P2", "story": "Là Bếp trưởng, tôi muốn sao chép thực đơn tuần trước sang tuần này và xuất bản tới phụ huynh.", "jira": "MNU-005"}
            ],
            "use_cases": [
                {
                    "id": "UC-MNU-01",
                    "name": "Khai báo Tick Xanh Trách Nhiệm cho một Buổi ăn",
                    "desc": "Bếp trưởng khai báo URL truy xuất nguồn gốc do Sở Công Thương TP.HCM cấp cho buổi Ăn sáng ngày Thứ 2.",
                    "actor": "Bếp trưởng / Nhân viên dinh dưỡng",
                    "trigger": "Bấm vào nút 'Chưa có tick xanh' hoặc 'Đã có tick xanh' tại chân ô buổi ăn trong MenuGridEditor.",
                    "pre": "Thực đơn tuần đang mở ở chế độ xem hoặc chỉnh sửa.",
                    "happy_path": [
                        "1. Người dùng bấm vào nút Tick Xanh tại chân ô Thứ 2 - Ăn sáng.",
                        "2. Hệ thống mở MealSessionTickXanhModal với tiêu đề 'Khai báo an toàn thực phẩm & Truy xuất nguồn gốc', hiển thị phụ đề 'Ăn sáng - 12/10/2026' và danh sách món 'Món ăn: Nui, Trà sữa'.",
                        "3. Thẻ thương hiệu hiển thị rõ 'SUẤT ĂN MINH BẠCH - TICK XANH TRÁCH NHIỆM (Bản quyền thương hiệu Tick Xanh Trách Nhiệm thuộc Sở Công Thương TP.HCM)'.",
                        "4. Người dùng nhập đường dẫn URL: 'https://tfd.tf/26198-B-29-0040260' vào ô 'Đường dẫn Tick Xanh'.",
                        "5. Người dùng bấm 'Lưu thay đổi'.",
                        "6. Hệ thống lưu URL vào schedule.monday.tickXanh.breakfast và cập nhật nút tại chân ô thành '● Đã có tick xanh ✓' màu xanh lá nổi bật."
                    ],
                    "exceptions": [
                        {"case": "URL sai định dạng", "handling": "Hệ thống hiển thị thông báo lỗi 'Vui lòng nhập đường dẫn URL hợp lệ (ví dụ: https://tfd.tf/...)' và không cho lưu."},
                        {"case": "Xóa link Tick Xanh", "handling": "Người dùng xóa trắng ô URL và bấm Lưu thay đổi; ô đổi về trạng thái '○ Chưa có tick xanh'."}
                    ],
                    "post": "Buổi ăn được kích hoạt huy hiệu Tick Xanh thành công, sẵn sàng liên thông sang ứng dụng di động phụ huynh.",
                    "rules": ["BR-MNU-02"]
                },
                {
                    "id": "UC-MNU-02",
                    "name": "Khai báo nguyên liệu và mã GTIN cho từng Món ăn",
                    "desc": "Bếp trưởng khai báo nguyên liệu cấu thành món ăn và mã vạch GTIN/GS1.",
                    "actor": "Bếp trưởng / Nhân viên dinh dưỡng",
                    "trigger": "Bấm vào nút '+ Thêm' hoặc icon chỉnh sửa nguyên liệu trên món ăn cụ thể.",
                    "pre": "Món ăn đã được thêm vào ô bữa ăn.",
                    "happy_path": [
                        "1. Người dùng bấm icon chỉnh sửa nguyên liệu trên món 'Nui'.",
                        "2. Hệ thống mở FoodIngredientModal hiển thị tên món ăn và danh mục nguyên liệu hiện có.",
                        "3. Người dùng bấm 'Thêm nguyên liệu', nhập tên 'Nui ống Safoco', chọn phương thức 'Mã vạch quốc gia GTIN (GS1 Việt Nam)', nhập mã '8936014002194' và số lô 'LOT-NUI-1012'.",
                        "4. Hệ thống tự động đối soát tiền tố mã vạch và nhận diện nhà cung cấp 'Công ty Cổ phần Lương thực Safoco', hiển thị huy hiệu 'Đã chứng nhận' và đánh dấu nguyên liệu 'Đạt chuẩn'.",
                        "5. Bấm 'Lưu thay đổi', huy hiệu trên thẻ món ăn cập nhật thành '1 thực phẩm' màu xanh lá."
                    ],
                    "exceptions": [
                        {"case": "Chưa nhập số lô hoặc mã vạch thiếu số", "handling": "Nguyên liệu hiển thị trạng thái 'Chưa đủ thông tin' cảnh báo màu cam."}
                    ],
                    "post": "Dữ liệu nguồn gốc nguyên liệu của món ăn được lưu vết độc lập với Tick Xanh của buổi ăn.",
                    "rules": ["BR-MNU-03"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Thực đơn (`/[schoolCode]/school/menu`)",
            "screens_table": [
                {"screen": "Bảng quản lý thực đơn (`MenuTable`)", "component": "Thanh công cụ tuần (`MenuToolbar`)", "format": "Dropdown chọn Đối tượng/Lớp, Dropdown chọn Tuần, Nút 'AI Gợi ý', Nút 'Nhân bản', Nút 'Tạo mới', Nút 'Xuất bản'", "desc": "Điều phối quản lý danh sách thực đơn toàn trường.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Trình chỉnh sửa thực đơn lưới (`MenuGridEditor`)", "component": "Bảng ma trận bữa ăn và ngày trong tuần", "format": "Cột Thứ 2 đến Thứ 7 kèm ngày cụ thể (DD/MM/YYYY) và nút gán nhanh 'Gán Tick Xanh (N/3)'; Hàng: Ăn sáng, Ăn trưa, Ăn xế; Căn đáy đồng nhất (uniform baseline) cho mọi ô; Thẻ món ăn kèm số lượng thực phẩm; Chân mỗi ô buổi ăn: nút '● Đã có tick xanh' (xanh lá kèm icon Sửa khi hover) hoặc nút '+ Thêm link Tick Xanh' (viền nét đứt xanh ngọc nổi bật khi đang chỉnh sửa) / '○ Chưa có tick xanh' (khi chỉ xem)", "desc": "Giao diện soạn thảo thực đơn và hiển thị trạng thái Tick Xanh cấp Buổi ăn.", "note": "BR-MNU-01, BR-MNU-02", "image": "m5-sm8-thuc-don-luoi-tick-xanh-buoi-an.png"},
                {"screen": "Modal Khai báo an toàn thực phẩm & Truy xuất nguồn gốc (`MealSessionTickXanhModal`)", "component": "Hộp thoại khai báo Tick Xanh theo Buổi ăn", "format": "Header xanh nhạt có badge MENU, phụ đề Buổi ăn - Ngày và danh sách món ăn; Khung thương hiệu 'SUẤT ĂN MINH BẠCH - TICK XANH TRÁCH NHIỆM' (Sở Công Thương TP.HCM); Trường nhập 'Đường dẫn Tick Xanh' kèm icon link và nút Sửa/Xem; Checkbox 'Áp dụng liên kết này cho tất cả buổi ăn trong ngày'; Nút Hủy và Lưu thay đổi", "desc": "Khai báo hoặc cập nhật URL truy xuất nguồn gốc cho từng buổi ăn cụ thể hoặc áp dụng cho cả ngày.", "note": "media_1793172089628_bcd6eeaf.png", "image": "m5-sm8-modal-khai-bao-tick-xanh-buoi-an.png"},
                {"screen": "Modal Khai báo nguyên liệu thực phẩm & GTIN (`FoodIngredientModal`)", "component": "Hộp thoại khai báo thành phần cấp Món ăn", "format": "Tên món ăn, danh mục nguyên liệu, mã vạch GTIN, số lô Lot Number, phương thức nội bộ, nhận diện nhà cung cấp VSATTP tự động", "desc": "Khai báo định lượng và nguồn gốc nguyên liệu của từng món ăn cụ thể.", "note": "Tách bạch với Tick Xanh buổi ăn"},
                {"screen": "Modal Chi tiết truy xuất nguồn gốc thực phẩm (`FoodIngredientViewModal`)", "component": "Hộp thoại xem chi tiết nguyên liệu (chỉ đọc)", "format": "Danh sách nguyên liệu cấu thành món ăn kèm trạng thái Đạt chuẩn/Chưa đủ thông tin, mã GTIN, số lô và nhà cung cấp", "desc": "Xem nhanh nguồn gốc nguyên liệu của món ăn khi bấm vào huy hiệu 'N thực phẩm'.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Modal AI gợi ý thực đơn (`AIMenuSuggestionModal`)", "component": "Hộp thoại trợ lý AI dinh dưỡng", "format": "Lựa chọn độ tuổi trẻ (Nhà trẻ / Mẫu giáo), Chọn mức calo mục tiêu (700-900 kcal), Nút 'Tạo thực đơn AI'", "desc": "Tự động sinh thực đơn cân đối 4 nhóm chất.", "note": "Tích hợp AI Engine"},
                {"screen": "Modal nhân bản thực đơn (`CloneMenuModal`)", "component": "Hộp thoại sao chép thực đơn", "format": "Dropdown chọn Tuần nguồn, Dropdown chọn Tuần đích, Nút 'Xác nhận'", "desc": "Sao chép nhanh thực đơn giữa các tuần.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Modal xuất bản thực đơn (`PublishMenuModal`)", "component": "Hộp thoại gửi thực đơn tới phụ huynh", "format": "Xem trước thực đơn tuần, Checkbox gửi Bảng Thông Tin, Nút 'Xuất bản ngay'", "desc": "Công bố thực đơn chính thức.", "note": "Lưu SendHistoryModal"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-MNU-01",
                "title": "Khai báo và hiển thị Tick Xanh theo Buổi ăn thành công",
                "scenario": "Given Bếp trưởng đang xem hoặc chỉnh sửa thực đơn tuần trên MenuGridEditor\nWhen bấm vào nút 'Chưa có tick xanh' tại ô Thứ 4 - Ăn trưa\nThen hệ thống mở MealSessionTickXanhModal với tiêu đề hiển thị đúng Buổi ăn - Ngày và danh sách món ăn trong buổi\nAnd khi nhập URL 'https://tfd.tf/26198-B-29-0040260' và bấm 'Lưu thay đổi'\nThen ô Thứ 4 - Ăn trưa đổi sang nút '● Đã có tick xanh ✓' màu xanh lá và dữ liệu được lưu vào DayMealSchedule.tickXanh."
            },
            {
                "id": "AC-MNU-02",
                "title": "Khai báo nguyên liệu thực phẩm cấp Món ăn độc lập",
                "scenario": "Given Bếp trưởng mở FoodIngredientModal từ món 'Nui'\nWhen thêm nguyên liệu 'Nui ống Safoco', chọn mã GTIN '8936014002194' và số lô 'LOT-NUI-1012'\nThen hệ thống tự động nhận diện nhà cung cấp 'Công ty Cổ phần Lương thực Safoco' và chuyển trạng thái nguyên liệu sang 'Đạt chuẩn' mà không ảnh hưởng đến liên kết Tick Xanh của buổi ăn."
            },
            {
                "id": "AC-MNU-03",
                "title": "Nhân bản thực đơn tuần thành công",
                "scenario": "Given Tuần 40 có đầy đủ món ăn các ngày từ Thứ 2 đến Thứ 7\nWhen Bếp trưởng nhân bản sang Tuần 42 trong modal CloneMenuModal\nThen Tuần 42 mang toàn bộ danh sách món ăn và dữ liệu Tick Xanh của Tuần 40 ở trạng thái Bản nháp."
            },
            {
                "id": "AC-MNU-04",
                "title": "Xuất bản thực đơn và lưu vết lịch sử gửi",
                "scenario": "Given Thực đơn tuần 42 đã hoàn tất các bữa ăn và khai báo Tick Xanh\nWhen BGH bấm 'Xuất bản' trong PublishMenuModal\nThen trạng thái đổi sang 'Đã xuất bản', gửi thông báo tới phụ huynh và tạo một bản ghi lịch sử gửi mới trong SendHistoryModal."
            },
            {
                "id": "AC-MNU-05",
                "title": "Nút thêm mới Tick Xanh và gán nhanh theo ngày",
                "scenario": "Given Người dùng đang ở chế độ chỉnh sửa thực đơn tuần (/school/menu/edit/{id})\nWhen quan sát các buổi ăn chưa có liên kết Tick Xanh\nThen hệ thống hiển thị nút '+ Thêm link Tick Xanh' viền nét đứt màu xanh ngọc được căn đáy đồng nhất trên cùng một dòng với các ô khác\nAnd khi bấm nút 'Gán Tick Xanh (N/3)' trên tiêu đề cột ngày và chọn checkbox 'Áp dụng cho tất cả buổi ăn trong ngày'\nThen toàn bộ các buổi ăn của ngày đó được cập nhật liên kết Tick Xanh đồng bộ chỉ với một lần lưu."
            }
        ],
        "nfr": {
            "performance": "Tải lưới thực đơn tuần dưới 300ms; AI sinh thực đơn trong thời gian < 3 giây.",
            "security": "Chỉ nhân viên bếp và BGH mới có quyền chỉnh sửa thực đơn; phụ huynh chỉ có quyền xem.",
            "ux": "Trực quan hóa trạng thái Tick Xanh tại chân mỗi ô buổi ăn: màu xanh lá khi đã có liên kết, viền nét đứt khi chưa có; click 1 chạm để mở modal khai báo."
        },
        "operations_rules": [
            {
                "situation": "Đơn vị cung cấp suất ăn gửi liên kết Tick Xanh muộn hơn thời điểm lên thực đơn",
                "action": "Bếp trưởng vẫn xuất bản thực đơn cho phụ huynh xem trước món ăn, sau đó bổ sung liên kết Tick Xanh theo từng buổi ăn khi nhận được thông tin",
                "system": "Hệ thống hỗ trợ cập nhật link Tick Xanh độc lập cho từng buổi ăn mà không cần hủy xuất bản toàn bộ thực đơn tuần"
            },
            {
                "situation": "Phát hiện sự cố chất lượng nguồn gốc thực phẩm đối với một buổi ăn cụ thể",
                "action": "BGH mở modal Tick Xanh của buổi ăn đó, cập nhật link truy xuất mới hoặc tạm thời gỡ liên kết",
                "system": "Hệ thống lưu vết thời gian sửa đổi và cập nhật ngay lập tức trạng thái hiển thị trên App Phụ huynh"
            },
            {
                "situation": "Trường tổ chức dã ngoại / sự kiện đột xuất không dùng suất ăn bán trú theo buổi",
                "action": "Bếp trưởng ghi chú 'Dã ngoại / Tự chuẩn bị' vào buổi ăn tương ứng và để trống link Tick Xanh",
                "system": "Hệ thống hiển thị trạng thái 'Chưa có tick xanh' nhưng không chặn quá trình xuất bản thực đơn của các ngày khác"
            }
        ],
        "appendix": {
            "notifications": [
                {"event": "Thực đơn tuần mới", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Thực đơn tuần mới của bé đã được cập nhật kèm liên kết Tick Xanh an toàn thực phẩm. Kính mời quý phụ huynh đón xem!"}
            ],
            "edge_cases": [
                {"condition": "Trường nghỉ đột xuất vào ngày Thứ 4 do thiên tai", "solution": "BGH có thể mở thực đơn tuần và đánh dấu 'Nghỉ học' cho riêng ngày Thứ 4 mà không ảnh hưởng các ngày khác."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 6. M5/SM14 - Lưu trữ (Student & Staff Data Archive)
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM14",
        "name": "M5 - SM14 - Lưu trữ",
        "parent_module": "M5",
        "priority": "MEDIUM",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Kho Lưu Trữ Hồ Sơ Học Sinh & Nhân Sự Đã Tốt Nghiệp, Chuyển Trường (Student & Staff Historical Archive Cockpit)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm quản trị vòng đời cuối cùng của hồ sơ dữ liệu (`/[schoolCode]/school/archive`). Khi học sinh tốt nghiệp ra trường, chuyển trường hoặc nhân viên nghỉ việc/nghỉ hưu, hồ sơ của họ sẽ được chuyển từ danh mục đang hoạt động vào Kho lưu trữ lịch sử để giữ cho danh bạ trường luôn tinh gọn, đồng thời bảo toàn trọn vẹn học bạ, điểm số, lịch sử điểm danh và sổ học phí phục vụ công tác tra cứu đối soát lâu dài theo Luật Lưu trữ và quy định Bộ GD&ĐT. Phân hệ cung cấp các tác vụ: Xem chi tiết hồ sơ lưu trữ (`ArchivedStudentDetailModal`), Khôi phục hồ sơ về trạng thái hoạt động (`RestoreConfirmModal`) và Xóa vĩnh viễn với quy trình kiểm soát 2 lớp (`PermanentDeleteModal`).",
            "goals_list": [
                "Quản lý danh sách học sinh và nhân sự đã chuyển vào kho lưu trữ (`ArchiveTable`).",
                "Phân loại lý do lưu trữ: Đã tốt nghiệp ra trường, Chuyển trường khác, Thôi học, Nhân viên nghỉ việc, Nghỉ hưu.",
                "Bảo toàn nguyên vẹn 100% dữ liệu lịch sử liên kết (Học bạ, Bảng điểm các năm, Hóa đơn học phí, Hình ảnh kỷ niệm).",
                "Hỗ trợ khôi phục hồ sơ (`RestoreConfirmModal`): Đưa học sinh hoặc giáo viên trở lại danh mục đang hoạt động khi họ quay lại trường học/làm việc.",
                "Quy trình xóa vĩnh viễn an toàn (`PermanentDeleteModal`): Bắt buộc nhập mật khẩu cấp cao của Hiệu trưởng và gõ cụm từ xác nhận để ngăn chặn việc xóa nhầm dữ liệu lịch sử."
            ],
            "target_users": [
                {"group": "Cán bộ Văn thư / Học vụ", "role": "Lưu trữ & tra cứu hồ sơ cũ", "actions": "Chuyển học sinh tốt nghiệp vào kho lưu trữ, tra cứu trích lục học bạ cho cựu học sinh."},
                {"group": "Ban Giám Hiệu (BGH)", "role": "Phê duyệt khôi phục hoặc xóa", "actions": "Duyệt khôi phục học sinh chuyển trường quay lại học và phê duyệt hủy hồ sơ rác."},
                {"group": "Kế toán trường học", "role": "Tra cứu công nợ cũ", "actions": "Xem lại lịch sử thanh toán học phí của học sinh đã ra trường khi có yêu cầu đối chiếu."}
            ],
            "glossary": [
                {"term": "Kho lưu trữ (Archive)", "definition": "Nơi cất giữ các hồ sơ dữ liệu không còn hoạt động thường xuyên nhưng bắt buộc phải lưu giữ theo quy định pháp lý."},
                {"term": "Khôi phục hồ sơ (Restore)", "definition": "Hành động đưa một bản ghi từ kho lưu trữ trở lại danh mục hoạt động bình thường."},
                {"term": "Xóa vĩnh viễn (Permanent Delete)", "definition": "Hành động xóa sạch hoàn toàn bản ghi khỏi cơ sở dữ liệu, không thể phục hồi."}
            ]
        },
        "business": {
            "flow_desc": "Học sinh tốt nghiệp hoặc chuyển trường được chuyển vào kho lưu trữ; cán bộ học vụ có thể tra cứu trích lục hồ sơ bất kỳ lúc nào hoặc khôi phục lại khi học sinh tái nhập học.",
            "flow_steps": [
                {"actor": "Cán bộ Học vụ", "action": "Chuyển hồ sơ vào kho lưu trữ", "desc": "Trong danh sách học sinh M5/SM1, chọn học sinh đã chuyển trường và bấm 'Lưu trữ hồ sơ'."},
                {"actor": "Hệ thống BE", "action": "Cập nhật trạng thái", "desc": "Chuyển trạng thái học sinh sang `archived`, ẩn khỏi sổ điểm danh và danh bạ lớp học."},
                {"actor": "Cán bộ Học vụ", "action": "Tra cứu hồ sơ cũ", "desc": "Vào `/school/archive`, tìm theo tên học sinh, mở ArchivedStudentDetailModal xem lại học bạ."},
                {"actor": "BGH", "action": "Khôi phục hồ sơ nếu quay lại", "desc": "Bấm 'Khôi phục' (RestoreConfirmModal), chọn lớp học mới để đưa học sinh hoạt động trở lại."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Lọc & Tìm kiếm hồ sơ lưu trữ): Cán bộ truy cập ArchiveTable, lọc theo loại đối tượng (Học sinh / Nhân viên), lọc theo lý do (Tốt nghiệp / Chuyển trường) và năm học ra trường.",
                "Giai đoạn 2 (Xem trích lục chi tiết - ArchivedStudentDetailModal): Xem lại toàn bộ thông tin cá nhân, hồ sơ phụ huynh, lịch sử các lớp đã học và kết quả rèn luyện qua các năm.",
                "Giai đoạn 3 (Khôi phục hồ sơ - RestoreConfirmModal): Khi học sinh quay lại nhập học, BGH bấm 'Khôi phục'. Hệ thống yêu cầu chỉ định lớp học hiện tại và năm học mới.",
                "Giai đoạn 4 (Xóa vĩnh viễn hồ sơ rác - PermanentDeleteModal): Chỉ áp dụng cho các hồ sơ tạo nhầm hoặc hồ sơ thử nghiệm; yêu cầu nhập mật khẩu xác nhận của Admin."
            ],
            "rules": [
                {"id": "BR-ARC-01", "title": "Bảo vệ hồ sơ đã phát sinh giao dịch tài chính", "desc": "Hồ sơ học sinh đã từng phát sinh hóa đơn học phí hoặc điểm số học tập tuyệt đối KHÔNG được xóa vĩnh viễn; chỉ được phép lưu trữ vĩnh viễn trong CSDL."},
                {"id": "BR-ARC-02", "title": "Khôi phục hồ sơ bắt buộc gán lớp mới", "desc": "Khi khôi phục một học sinh từ kho lưu trữ về trạng thái hoạt động, bắt buộc phải chọn một lớp học đang mở để tiếp nhận học sinh đó."}
            ],
            "data_entities": [
                {"field": "archive_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính bản ghi lưu trữ."},
                {"field": "entity_type", "type": "Enum", "required": "Bắt buộc", "desc": "Loại đối tượng: 'student' (Học sinh) hoặc 'staff' (Nhân sự)."},
                {"field": "original_id", "type": "UUID", "required": "Bắt buộc", "desc": "ID gốc của học sinh hoặc nhân viên."},
                {"field": "archive_reason", "type": "Enum", "required": "Bắt buộc", "desc": "Lý do: 'graduated' (Tốt nghiệp), 'transferred' (Chuyển trường), 'resigned' (Nghỉ việc), 'retired' (Nghỉ hưu)."},
                {"field": "archived_at", "type": "Timestamp", "required": "Bắt buộc", "desc": "Thời điểm đưa vào kho lưu trữ."},
                {"field": "archived_by", "type": "UUID", "required": "Bắt buộc", "desc": "Tài khoản thực hiện lưu trữ."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-018 Nhà trường Lưu trữ", "feature": "Bảng danh sách hồ sơ lưu trữ (ArchiveTable)", "platform": "Portal Web", "priority": "P1", "story": "Là Văn thư, tôi muốn xem danh sách cựu học sinh và nhân sự đã nghỉ việc.", "jira": "ARC-001"},
                {"epic": "E-018 Nhà trường Lưu trữ", "feature": "Khôi phục hồ sơ hoạt động (RestoreConfirmModal)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn khôi phục học sinh chuyển trường quay trở lại học tập.", "jira": "ARC-002"},
                {"epic": "E-018 Nhà trường Lưu trữ", "feature": "Trích lục chi tiết hồ sơ cũ (ArchivedStudentDetailModal)", "platform": "Portal Web", "priority": "P2", "story": "Là Văn thư, tôi muốn xem lại toàn bộ học bạ và điểm số của cựu học sinh.", "jira": "ARC-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-ARC-01",
                    "name": "Khôi phục học sinh tái nhập học",
                    "desc": "BGH đưa học sinh đã lưu trữ trở lại học tại lớp 2A1.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Phụ huynh làm thủ tục nhập học lại cho con.",
                    "pre": "Hồ sơ học sinh đang nằm trong kho lưu trữ.",
                    "happy_path": [
                        "1. BGH tìm tên học sinh trong ArchiveTable.",
                        "2. Bấm nút 'Khôi phục'.",
                        "3. Modal RestoreConfirmModal xuất hiện.",
                        "4. BGH chọn Lớp tiếp nhận: 'Lớp 2A1'.",
                        "5. Bấm 'Xác nhận khôi phục'.",
                        "6. Hệ thống chuyển trạng thái học sinh thành 'Đang học', hiển thị lại trên sổ điểm danh lớp 2A1."
                    ],
                    "exceptions": [
                        {"case": "Lớp 2A1 đã đủ sĩ số tối đa", "handling": "Hệ thống cảnh báo 'Lớp 2A1 đã đạt sĩ số tối đa (35/35), bạn có muốn tiếp tục?'."}
                    ],
                    "post": "Học sinh được kích hoạt trở lại thành công.",
                    "rules": ["BR-ARC-02"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Lưu trữ (`/[schoolCode]/school/archive`)",
            "screens_table": [
                {"screen": "Kho lưu trữ hồ sơ (`ArchiveTable`)", "component": "Thanh công cụ lọc (`ArchiveToolbar`)", "format": "Tab Học sinh / Tab Nhân viên, Dropdown Lý do lưu trữ, Dropdown Năm học ra trường, Ô tìm kiếm tên/mã", "desc": "Bộ lọc tra cứu hồ sơ cũ.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Kho lưu trữ hồ sơ (`ArchiveTable`)", "component": "Bảng hồ sơ lưu trữ (`ArchiveTable`)", "format": "Table gồm: STT, Mã hồ sơ, Họ và tên, Lớp/Tổ cũ, Ngày lưu trữ, Lý do, Thao tác (Xem trích lục, Khôi phục, Xóa)", "desc": "Danh sách các bản ghi lịch sử.", "note": "BR-ARC-01"},
                {"screen": "Modal trích lục hồ sơ (`ArchivedStudentDetailModal`)", "component": "Hộp thoại xem chi tiết hồ sơ cũ", "format": "Thông tin nhân thân, Lịch sử các năm học, Điểm tổng kết, Trạng thái học phí", "desc": "Xem trích lục học bạ phục vụ chứng thực.", "note": "Chỉ đọc"},
                {"screen": "Modal khôi phục hồ sơ (`RestoreConfirmModal`)", "component": "Hộp thoại gán lớp khôi phục", "format": "Tên học sinh, Dropdown chọn Lớp mới tiếp nhận, Nút 'Xác nhận khôi phục'", "desc": "Đưa đối tượng trở lại hoạt động.", "note": "BR-ARC-02"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-ARC-01",
                "title": "Khôi phục học sinh và đưa vào lớp mới",
                "scenario": "Given Học sinh đang ở kho lưu trữ\nWhen BGH bấm 'Khôi phục', chọn lớp 2A1 và bấm xác nhận\nThen học sinh biến mất khỏi kho lưu trữ và xuất hiện trong danh sách học sinh đang học của lớp 2A1."
            },
            {
                "id": "AC-ARC-02",
                "title": "Chặn xóa hồ sơ đã có lịch sử điểm số hoặc tài chính",
                "scenario": "Given Học sinh đã hoàn thành lớp 1 và có điểm số trong hệ thống\nWhen người dùng cố gắng bấm xóa vĩnh viễn hồ sơ trong kho lưu trữ\nThen hệ thống thông báo 'Hồ sơ đã phát sinh dữ liệu học vụ, không thể xóa vĩnh viễn theo quy định'."
            }
        ],
        "nfr": {
            "performance": "Tra cứu hồ sơ cũ trong kho 10.000 bản ghi dưới 500ms.",
            "security": "Chỉ BGH và cán bộ văn thư được phân quyền mới có thể truy cập kho lưu trữ.",
            "ux": "Giao diện hiển thị rõ badge màu phân biệt lý do (Tốt nghiệp: Xanh lá, Chuyển trường: Vàng cam, Thôi việc: Xám)."
        },
        "appendix": {
            "notifications": [
                {"event": "Khôi phục hồ sơ thành công", "channel": "Toast xanh", "recipient": "BGH", "content": "Đã khôi phục thành công hồ sơ học sinh [Họ tên] vào lớp [Tên lớp]."}
            ],
            "edge_cases": [
                {"condition": "Học sinh chuyển trường quay lại nhưng phụ huynh đổi số điện thoại mới", "solution": "Cho phép cập nhật số điện thoại liên lạc mới của phụ huynh ngay trong modal khôi phục hồ sơ."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 7. M5/SM7 - Bình chọn (School Polls & Voting)
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM7",
        "name": "M5 - SM7 - Bình chọn",
        "parent_module": "M5",
        "priority": "MEDIUM",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Khảo Sát Ý Kiến & Bình Chọn Điện Tử Toàn Trường (School Digital Polls & Community Voting Cockpit)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> cung cấp công cụ lấy ý kiến số hóa nhanh chóng, dân chủ và khách quan giữa Nhà trường và cộng đồng Phụ huynh học sinh hoặc Cán bộ Giáo viên (`/[schoolCode]/school/poll`). Phân hệ phục vụ việc lấy ý kiến biểu quyết về các chủ trương lớn: Lựa chọn mẫu đồng phục mới, Khảo sát địa điểm dã ngoại cuối năm, Lấy ý kiến về chương trình học ngoại khóa tiếng Anh, hoặc Bầu ban đại diện cha mẹ học sinh. Hệ thống hỗ trợ trình tạo cuộc bình chọn đa dạng phương án (`PollComposer`), trung tâm chỉ huy theo dõi kết quả biểu quyết trực tiếp theo thời gian thực (`PollDetailCockpit`), danh sách cử tri đã bầu (`PollVoterRoster`), quản lý thời hạn mở/đóng bình chọn (`SendPollModal`, `DeletePollModal`) và bảo mật kết quả biểu quyết kín.",
            "goals_list": [
                "Cung cấp trình tạo cuộc bình chọn (`PollComposer`): Thiết lập câu hỏi, các phương án lựa chọn, cho phép chọn một hoặc chọn nhiều phương án, và đặt thời hạn kết thúc (Deadline).",
                "Trung tâm hiển thị kết quả thời gian thực (`PollDetailCockpit`): Biểu đồ thanh ngang (Bar Chart) và biểu đồ tròn (Pie Chart) hiển thị tỷ lệ phiếu bầu của từng phương án.",
                "Quản lý danh sách cử tri (`PollVoterRoster`): Theo dõi ai đã bình chọn, ai chưa bình chọn để gửi thông báo đôn đốc (áp dụng cho bình chọn công khai).",
                "Hỗ trợ chế độ Bình chọn Ẩn danh (Secret Ballot): Giữ bí mật danh tính cử tri đối với các vấn đề nhạy cảm (đánh giá ban giám hiệu, xếp loại thi đua).",
                "Thẻ tóm tắt KPI (`PollSummaryCards`): Số cuộc bình chọn đang mở, Tỷ lệ tham gia biểu quyết trung bình (mục tiêu > 85%), Tổng số phiếu đã thu thập."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Khởi xướng cuộc bình chọn", "actions": "Tạo câu hỏi khảo sát, chọn phạm vi phụ huynh tham gia, theo dõi kết quả trực tiếp và chốt phương án."},
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Đôn đốc phụ huynh biểu quyết", "actions": "Mở PollVoterRoster kiểm tra phụ huynh lớp mình ai chưa vote để nhắn tin nhắc nhở."},
                {"group": "Phụ huynh học sinh", "role": "Bỏ phiếu bình chọn", "actions": "Nhận thông báo trên App, chọn phương án đồng thuận và bấm gửi phiếu biểu quyết."}
            ],
            "glossary": [
                {"term": "Bình chọn đơn (Single Choice)", "definition": "Hình thức biểu quyết người tham gia chỉ được chọn duy nhất 1 phương án (Radio button)."},
                {"term": "Bình chọn đa phương án (Multiple Choice)", "definition": "Hình thức cho phép người tham gia tick chọn từ 2 phương án trở lên (Checkbox)."},
                {"term": "Bình chọn ẩn danh (Anonymous Poll)", "definition": "Cuộc bỏ phiếu mà hệ thống chỉ lưu tổng số phiếu của từng phương án, không lưu danh tính ai đã chọn phương án nào."}
            ]
        },
        "business": {
            "flow_desc": "BGH tạo cuộc bình chọn trong PollComposer, gửi tới phụ huynh; phụ huynh bỏ phiếu trên Mobile App; kết quả nhảy số thời gian thực trên PollDetailCockpit; hết hạn hệ thống tự động khóa sổ.",
            "flow_steps": [
                {"actor": "BGH", "action": "Tạo cuộc bình chọn", "desc": "Mở `/school/poll`, nhập câu hỏi 'Lựa chọn địa điểm dã ngoại', tạo 3 phương án: Thảo Cầm Viên, Nông trại Xanh, Bảo tàng."},
                {"actor": "BGH", "action": "Cấu hình & Phát hành (SendPollModal)", "desc": "Đặt thời hạn đóng bình chọn lúc 17:00 ngày Thứ 6, bấm 'Phát hành'."},
                {"actor": "Hệ thống BE", "action": "Gửi Push Notification", "desc": "Gửi thông báo tới toàn thể phụ huynh: 'Nhà trường mời Quý phụ huynh tham gia bình chọn địa điểm dã ngoại'."},
                {"actor": "Phụ huynh", "action": "Bỏ phiếu trên App", "desc": "Phụ huynh chọn 'Nông trại Xanh' và bấm 'Gửi biểu quyết'."},
                {"actor": "BGH / GVCN", "action": "Theo dõi kết quả (PollDetailCockpit)", "desc": "Xem tỷ lệ phần trăm các phương án nhảy số trực tiếp và xuất kết quả sau khi đóng sổ."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Thiết lập cuộc bình chọn): BGH bấm 'Tạo bình chọn mới'. Khung PollComposer hỗ trợ nhập câu hỏi, tối thiểu 2 phương án và tối đa 10 phương án.",
                "Giai đoạn 2 (Thiết lập thể lệ biểu quyết): Chọn hình thức (Đơn hay Đa lựa chọn), bật/tắt chế độ 'Bình chọn ẩn danh', chọn ngày giờ đóng bình chọn tự động.",
                "Giai đoạn 3 (Phát hành tới cử tri - SendPollModal): Chọn nhóm đối tượng nhận (Toàn trường hoặc riêng Khối 5). Hệ thống gửi Push thông báo tới phụ huynh.",
                "Giai đoạn 4 (Giám sát tiến độ - PollDetailCockpit & PollVoterRoster): BGH quan sát biểu đồ cột tỷ lệ phiếu. Tab cử tri hiển thị danh sách phụ huynh chưa bỏ phiếu; BGH bấm 'Gửi nhắc nhở hàng loạt'.",
                "Giai đoạn 5 (Đóng bình chọn & Báo cáo): Khi chạm mốc deadline, hệ thống tự động khóa cổng vote. BGH xuất báo cáo kết quả biểu quyết ra file PDF công bố toàn trường."
            ],
            "rules": [
                {"id": "BR-POL-01", "title": "Mỗi phụ huynh chỉ được bỏ phiếu 1 lần", "desc": "Hệ thống ghi nhận duy nhất 1 lượt biểu quyết trên mỗi tài khoản phụ huynh học sinh. Sau khi đã bấm gửi phiếu, phụ huynh không thể thay đổi phương án trừ khi BGH cho phép 'Sửa phiếu'."},
                {"id": "BR-POL-02", "title": "Bảo vệ cuộc bình chọn đang mở", "desc": "Khi cuộc bình chọn đã phát sinh ít nhất 1 phiếu bầu thực tế, BGH không được phép sửa đổi câu hỏi hoặc xóa các phương án lựa chọn đã có."},
                {"id": "BR-POL-03", "title": "Tự động khóa khi hết hạn", "desc": "Đúng thời điểm Deadline cấu hình, cổng bình chọn tự động chuyển trạng thái sang 'Đã kết thúc' và không tiếp nhận thêm phiếu bầu mới."}
            ],
            "data_entities": [
                {"field": "poll_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính cuộc bình chọn."},
                {"field": "title", "type": "String (255)", "required": "Bắt buộc", "desc": "Tiêu đề câu hỏi bình chọn."},
                {"field": "description", "type": "Text", "required": "Tùy chọn", "desc": "Mô tả chi tiết hoặc hướng dẫn thể lệ biểu quyết."},
                {"field": "options", "type": "JSON", "required": "Bắt buộc", "desc": "Danh sách các phương án bình chọn (id, text, vote_count)."},
                {"field": "is_multiple_choice", "type": "Boolean", "required": "Mặc định False", "desc": "Cho phép chọn nhiều phương án hay không."},
                {"field": "is_anonymous", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ bình chọn ẩn danh."},
                {"field": "end_time", "type": "Timestamp", "required": "Bắt buộc", "desc": "Thời điểm đóng cổng biểu quyết."},
                {"field": "status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái: 'draft', 'active', 'closed'."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-019 Nhà trường Bình chọn", "feature": "Trình tạo cuộc bình chọn đa dạng (PollComposer)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn tạo cuộc bình chọn với nhiều phương án và đặt hạn kết thúc.", "jira": "POL-001"},
                {"epic": "E-019 Nhà trường Bình chọn", "feature": "Cockpit theo dõi kết quả trực tiếp (PollDetailCockpit)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem biểu đồ kết quả bình chọn nhảy số theo thời gian thực.", "jira": "POL-002"},
                {"epic": "E-019 Nhà trường Bình chọn", "feature": "Quản lý danh sách cử tri (PollVoterRoster) & Nhắc nhở", "platform": "Portal Web", "priority": "P2", "story": "Là GVCN, tôi muốn biết phụ huynh nào trong lớp chưa bình chọn để nhắc nhở.", "jira": "POL-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-POL-01",
                    "name": "Tạo và phát hành bình chọn mẫu đồng phục",
                    "desc": "BGH lấy ý kiến phụ huynh về 3 mẫu đồng phục mới.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Chuẩn bị kế hoạch năm học mới.",
                    "pre": "Đã có ảnh 3 mẫu đồng phục.",
                    "happy_path": [
                        "1. BGH nhập Tiêu đề: 'Khảo sát lựa chọn mẫu đồng phục năm học 2026-2027'.",
                        "2. Thêm 3 phương án: 'Mẫu 1 - Phong cách Hàn Quốc', 'Mẫu 2 - Truyền thống', 'Mẫu 3 - Thể thao năng động' kèm ảnh minh họa.",
                        "3. Chọn thể lệ: Chọn đơn (Single Choice).",
                        "4. Đặt thời hạn đóng: '18:00 ngày 31/10/2026'.",
                        "5. Bấm 'Phát hành bình chọn'.",
                        "6. Cuộc bình chọn kích hoạt và gửi Push thông báo tới toàn thể phụ huynh."
                    ],
                    "exceptions": [
                        {"case": "Chưa nhập đủ tối thiểu 2 phương án", "handling": "Hệ thống báo lỗi 'Cuộc bình chọn phải có ít nhất 2 phương án lựa chọn'."}
                    ],
                    "post": "Cuộc bình chọn xuất hiện trên bảng điều khiển PollTable.",
                    "rules": ["BR-POL-01", "BR-POL-02"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Bình chọn (`/[schoolCode]/school/poll`)",
            "screens_table": [
                {"screen": "Bảng quản lý bình chọn (`PollTable`)", "component": "Thẻ KPI bình chọn (`PollSummaryCards`)", "format": "3 Card ngang: Bình chọn đang mở (xanh lá), Tỷ lệ tham gia trung bình (%), Tổng phiếu thu thập", "desc": "Tổng quan mức độ tương tác biểu quyết của phụ huynh.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Bảng quản lý bình chọn (`PollTable`)", "component": "Danh sách các cuộc bình chọn (`PollTable`)", "format": "Table gồm: STT, Tiêu đề, Phạm vi cử tri, Ngày tạo, Hạn kết thúc, Trạng thái (Đang mở / Đã đóng), Số phiếu, Thao tác", "desc": "Quản trị danh sách các cuộc khảo sát.", "note": "BR-POL-03"},
                {"screen": "Trình tạo cuộc bình chọn (`PollComposer`)", "component": "Khung soạn thảo câu hỏi và phương án", "format": "Input Tiêu đề, Textarea Mô tả, Danh sách Input Phương án (+ Thêm phương án), Switch Bình chọn ẩn danh, Switch Chọn nhiều phương án, Date-Time Picker Hạn đóng, Nút 'Phát hành'", "desc": "Tạo lập khảo sát biểu quyết.", "note": "BR-POL-01, BR-POL-02"},
                {"screen": "Cockpit kết quả chi tiết (`PollDetailCockpit`)", "component": "Bảng điều khiển kết quả trực tiếp", "format": "Biểu đồ cột phần trăm các phương án, Thống kê tổng số phiếu, Đồng hồ đếm ngược thời gian còn lại, Nút 'Đóng bình chọn sớm', Nút 'Xuất báo cáo PDF'", "desc": "Trực quan hóa kết quả biểu quyết thời gian thực.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Danh sách cử tri (`PollVoterRoster`)", "component": "Bảng theo dõi người đã vote", "format": "Danh sách học sinh & Phụ huynh: Trạng thái (Đã vote / Chưa vote), Phương án đã chọn (nếu không ẩn danh), Nút 'Gửi nhắc nhở'", "desc": "Giúp GVCN đôn đốc tỷ lệ hoàn thành.", "note": "Prototype hoàn chỉnh"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-POL-01",
                "title": "Tạo cuộc bình chọn thành công và hiển thị thời gian thực",
                "scenario": "Given BGH tạo bình chọn với 3 phương án hợp lệ và hạn kết thúc sau 3 ngày\nWhen bấm 'Phát hành'\nThen cuộc bình chọn chuyển sang trạng thái 'Đang mở' và xuất hiện trên ứng dụng phụ huynh."
            },
            {
                "id": "AC-POL-02",
                "title": "Chặn biểu quyết 2 lần trên cùng 1 tài khoản",
                "scenario": "Given Phụ huynh đã bấm bỏ phiếu cho Phương án 1\nWhen phụ huynh cố tình bấm bỏ phiếu lại lần nữa\nThen hệ thống hiển thị thông báo 'Bạn đã hoàn thành biểu quyết cho cuộc bình chọn này' và khóa nút gửi phiếu."
            },
            {
                "id": "AC-POL-03",
                "title": "Tự động đóng bình chọn khi hết hạn",
                "scenario": "Given Cuộc bình chọn có hạn kết thúc là 17:00 ngày 27/10\nWhen đồng hồ hệ thống chuyển sang 17:01\nThen trạng thái cuộc bình chọn tự động đổi sang 'Đã đóng' và phụ huynh không thể vote thêm phiếu nào."
            }
        ],
        "nfr": {
            "performance": "Ghi nhận 500 phiếu bầu đồng thời trong 1 phút không gây nghẽn hệ thống; cập nhật kết quả biểu đồ < 500ms.",
            "security": "Mã hóa một chiều danh tính cử tri khi chọn bình chọn ẩn danh để không ai có thể truy ngược lại.",
            "ux": "Biểu đồ kết quả trực quan sinh động với màu sắc phân biệt rõ các phương án."
        },
        "appendix": {
            "notifications": [
                {"event": "Cuộc bình chọn mới", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Nhà trường kính mời Quý phụ huynh tham gia bình chọn: '[Tiêu đề khảo sát]'."}
            ],
            "edge_cases": [
                {"condition": "Hai phương án có số phiếu bằng nhau tuyệt đối khi kết thúc", "solution": "Hệ thống hiển thị trạng thái 'Hòa phiếu', BGH có thể mở bình chọn hiệp phụ giữa 2 phương án cao nhất."}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"Milestone 3 Part 1 defined successfully with {len(PART1_PRDS)} modules!")
    for p in PART1_PRDS:
        print(f"  - [{p['code']}] {p['name']}")

