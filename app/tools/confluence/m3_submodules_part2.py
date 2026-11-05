# -*- coding: utf-8 -*-
"""
Milestone 3 Sub-modules Part 2 (Comprehensive v2 Standard)
Covers Phase 3B (5 sub-modules):
   8. M3/SM1 - M3 - SM1 - Thời khóa biểu (Class Timetable & Schedule Management)
   9. M3/SM2 - M3 - SM2 - Bài tập (Homework Assignments & Student Submissions)
  10. M3/SM3 - M3 - SM3 - Điểm & Đánh giá (Gradebook Evaluation & Scoreboard)
  11. M1/SM1 - M1 - SM1 - Tổng quan (Executive School Dashboard & KPI Cockpit)
  12. M7/SM1 - M7 - SM1 - Khác (System Audit Trail & Tenant Diagnostics)
"""

PART2_PRDS = [
    # -------------------------------------------------------------------------
    # 8. M3/SM1 - Thời khóa biểu (Class Timetable & Schedule Management)
    # -------------------------------------------------------------------------
    {
        "code": "M3/SM1",
        "name": "M3 - SM1 - Thời khóa biểu",
        "parent_module": "M3",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Quản lý Thời Khóa Biểu & Lịch Học Lớp (Class Timetable & Master Schedule Management)</strong> thuộc nhóm <strong>M3: Học tập</strong> chịu trách nhiệm thiết lập, quản lý và xuất bản lịch học tuần, lịch sinh hoạt của từng lớp học trong toàn trường (`/[schoolCode]/school/schedule/`). Phân hệ hỗ trợ cả 2 chế độ hiển thị linh hoạt: Chế độ Lưới thời khóa biểu tương tác (`TimetableGridView`) hiển thị các tiết học theo thứ trong tuần kèm phòng học và giáo viên phụ trách, và Chế độ Tệp đính kèm (`TimetableFileView`) cho phép tải lên trực tiếp tệp thời khóa biểu định dạng PDF/Excel có chữ ký mộc đỏ của Hiệu trưởng (`UploadScheduleModal`). Ngoài ra, phân hệ tích hợp cơ chế sao chép thời khóa biểu giữa các tuần (`CloneScheduleModal`), xuất bản lịch học mới tới phụ huynh và lưu vết lịch sử gửi (`SendHistoryModal`).",
            "goals_list": [
                "Cung cấp 2 chế độ hiển thị và quản trị: Dạng Lưới tiết học trực quan (`TimetableGridView`) và Dạng Tệp tài liệu chính thức (`TimetableFileView`).",
                "Quản lý lịch học chuẩn từ Thứ 2 đến Thứ 6 (hoặc Thứ 7 tùy cấp học), hỗ trợ chia 2 buổi: Buổi sáng (Tiết 1 đến Tiết 5) và Buổi chiều (Tiết 6 đến Tiết 8).",
                "Kiểm tra xung đột tự động: Ngăn chặn xếp 1 giáo viên dạy 2 lớp khác nhau trong cùng 1 tiết học, hoặc trùng phòng học chuyên môn (Tin học, Thí nghiệm).",
                "Sao chép thời khóa biểu nhanh (`CloneScheduleModal`): Áp dụng thời khóa biểu từ lớp này sang lớp khác cùng khối hoặc sao chép giữa các học kỳ.",
                "Xuất bản và gửi thông báo thay đổi TKB (`SendHistoryModal`): Tự động phát Push Notification tới phụ huynh và giáo viên khi có lịch học mới hoặc đổi tiết."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu / Phó Hiệu trưởng chuyên môn", "role": "Xây dựng & duyệt Thời khóa biểu", "actions": "Xếp lịch học cho các lớp, kiểm tra định mức tiết dạy của giáo viên và phê duyệt xuất bản TKB."},
                {"group": "Giáo viên chủ nhiệm & Giáo viên bộ môn", "role": "Xem lịch dạy cá nhân & của lớp", "actions": "Theo dõi lịch giảng dạy hàng tuần, chuẩn bị giáo án và nhận thông báo đổi tiết."},
                {"group": "Phụ huynh & Học sinh", "role": "Theo dõi lịch học & chuẩn bị sách vở", "actions": "Xem thời khóa biểu ngày mai trên ứng dụng di động để chuẩn bị sách vở và đồ dùng học tập phù hợp."}
            ],
            "glossary": [
                {"term": "Timetable Grid View", "definition": "Giao diện lưới ma trận hiển thị Thứ trong tuần theo cột ngang và Tiết học theo hàng dọc."},
                {"term": "Xung đột lịch (Schedule Conflict)", "definition": "Hiện tượng một giáo viên hoặc một phòng học chức năng bị xếp trùng nhau tại cùng một khung giờ/tiết học."},
                {"term": "Đổi tiết / Dạy thay", "definition": "Thao tác hoán đổi tiết học giữa 2 giáo viên hoặc chỉ định một giáo viên khác dạy thay khi có người nghỉ phép đột xuất."}
            ]
        },
        "business": {
            "flow_desc": "BGH xếp thời khóa biểu trên giao diện lưới hoặc tải file PDF công văn, hệ thống kiểm tra xung đột; BGH bấm xuất bản và gửi thông báo tới phụ huynh và giáo viên.",
            "flow_steps": [
                {"actor": "BGH / Chuyên môn", "action": "Tạo thời khóa biểu lớp", "desc": "Mở `/school/schedule`, chọn Lớp 6A1 và Học kỳ 1, chọn chế độ Grid hoặc File."},
                {"actor": "BGH", "action": "Xếp tiết học vào lưới", "desc": "Gắp môn Toán vào Tiết 1 Thứ 2, chọn Giáo viên phụ trách và Phòng học."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra xung đột tiết", "desc": "Đối soát lịch: Đảm bảo giáo viên Toán chưa có giờ dạy ở lớp khác trong Tiết 1 Thứ 2."},
                {"actor": "BGH", "action": "Xuất bản thời khóa biểu", "desc": "Bấm 'Xuất bản TKB', chọn ngày áp dụng (bắt đầu từ Thứ 2 tuần sau)."},
                {"actor": "Phụ huynh / GV", "action": "Nhận Push Notification", "desc": "Nhận thông báo: 'Thời khóa biểu mới của lớp 6A1 đã được công bố'."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Lựa chọn lớp & Học kỳ): BGH dùng thanh công cụ ScheduleToolbar chọn Khối lớp, Lớp học và Học kỳ làm việc.",
                "Giai đoạn 2 (Xếp lịch tương tác - TimetableGridView): Các ô tiết học hiển thị rõ: Tên môn, Tên viết tắt của Giáo viên và Phòng học. Nhấp vào ô để chọn môn học từ danh mục M5/SM4.",
                "Giai đoạn 3 (Xử lý trường hợp dùng File chính thức - TimetableFileView): Nếu trường dùng phần mềm xếp TKB chuyên dụng (như TKB, FET), BGH mở UploadScheduleModal để tải lên tệp PDF thời khóa biểu có dấu đỏ.",
                "Giai đoạn 4 (Sao chép giữa các lớp - CloneScheduleModal): Nhân bản TKB từ lớp 6A1 sang 6A2 đối với các môn học cố định để tiết kiệm thời gian xếp lịch.",
                "Giai đoạn 5 (Công bố & Lưu lịch sử - SendHistoryModal): Bấm xuất bản, hệ thống lưu vết ngày gửi và tự động kích hoạt thông báo tới điện thoại của phụ huynh."
            ],
            "rules": [
                {"id": "BR-SCH-01", "title": "Chặn tuyệt đối xung đột giáo viên", "desc": "Một giáo viên bộ môn không thể được xếp dạy ở 2 lớp học khác nhau trong cùng một tiết học của một ngày."},
                {"id": "BR-SCH-02", "title": "Bảo vệ thời khóa biểu đang áp dụng", "desc": "Thời khóa biểu của tuần đang diễn ra nếu có thay đổi đột xuất bắt buộc phải có văn bản phê duyệt của BGH và lưu lịch sử đổi tiết."},
                {"id": "BR-SCH-03", "title": "Quy định số tiết tối đa trong ngày", "desc": "Học sinh tiểu học không học quá 7 tiết/ngày; học sinh THCS/THPT không học quá 8 tiết/ngày theo quy định chuẩn của Bộ GD&ĐT."}
            ],
            "data_entities": [
                {"field": "schedule_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính thời khóa biểu."},
                {"field": "class_id", "type": "UUID", "required": "Bắt buộc", "desc": "Lớp học áp dụng (M5/SM3)."},
                {"field": "term_id", "type": "UUID", "required": "Bắt buộc", "desc": "Học kỳ áp dụng."},
                {"field": "effective_from", "type": "Date", "required": "Bắt buộc", "desc": "Ngày bắt đầu có hiệu lực áp dụng."},
                {"field": "grid_data", "type": "JSON", "required": "Tùy chọn", "desc": "Dữ liệu các tiết học trong lưới (Thứ, Tiết, Môn, GV, Phòng)."},
                {"field": "file_url", "type": "String (URL)", "required": "Tùy chọn", "desc": "Đường dẫn tệp PDF đính kèm nếu dùng chế độ File."},
                {"field": "status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái: 'draft', 'published', 'archived'."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-020 Học tập Thời khóa biểu", "feature": "Chế độ xem lưới tương tác (TimetableGridView)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xếp lịch học bằng cách chọn môn và giáo viên trực tiếp vào từng ô tiết học.", "jira": "SCH-001"},
                {"epic": "E-020 Học tập Thời khóa biểu", "feature": "Chế độ tải lên tệp thời khóa biểu PDF (TimetableFileView)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn tải lên tệp PDF thời khóa biểu có dấu mộc đỏ chính thức của trường.", "jira": "SCH-002"},
                {"epic": "E-020 Học tập Thời khóa biểu", "feature": "Sao chép thời khóa biểu (CloneScheduleModal) & Lịch sử gửi", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn nhân bản TKB từ lớp này sang lớp khác cùng khối.", "jira": "SCH-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-SCH-01",
                    "name": "Xếp tiết học và phát hiện xung đột giáo viên",
                    "desc": "BGH xếp tiết học nhưng bị hệ thống cảnh báo trùng lịch dạy.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "BGH chọn môn Toán cho lớp 6A1 vào Tiết 2 Thứ 3.",
                    "pre": "Giáo viên Toán (Thầy An) đã được xếp dạy lớp 6A2 vào đúng Tiết 2 Thứ 3.",
                    "happy_path": [
                        "1. BGH nhấp vào ô Tiết 2 Thứ 3 trên lưới TKB lớp 6A1.",
                        "2. Chọn môn 'Toán', chọn giáo viên 'Thầy Nguyễn Văn An'.",
                        "3. Bấm 'Lưu tiết học'.",
                        "4. Hệ thống kiểm tra thấy Thầy An đang bận dạy lớp 6A2.",
                        "5. Hiển thị cảnh báo đỏ: 'Xung đột: Thầy Nguyễn Văn An đã có giờ dạy tại lớp 6A2 trong tiết này'.",
                        "6. BGH chọn giáo viên khác hoặc đổi tiết khác phù hợp."
                    ],
                    "exceptions": [
                        {"case": "BGH xác nhận đây là tiết học ghép 2 lớp (học chung)", "handling": "BGH tick chọn cờ 'Tiết ghép khối' để bỏ qua cảnh báo xung đột."}
                    ],
                    "post": "Tiết học được lưu an toàn không xảy ra xung đột.",
                    "rules": ["BR-SCH-01"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Học tập -> Thời khóa biểu (`/[schoolCode]/school/schedule`)",
            "screens_table": [
                {"screen": "Quản lý thời khóa biểu (`ScheduleTable`)", "component": "Thanh công cụ TKB (`ScheduleToolbar`)", "format": "Dropdown chọn Khối, Dropdown chọn Lớp, Toggle Lưới / File, Nút 'Tải tệp PDF', Nút 'Nhân bản TKB', Nút 'Xuất bản'", "desc": "Thanh điều khiển trung tâm quản lý lịch học.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Lưới thời khóa biểu (`TimetableGridView`)", "component": "Bảng ma trận tiết học theo tuần", "format": "Cột Thứ 2 đến Thứ 6; Hàng: Buổi sáng (Tiết 1-5), Buổi chiều (Tiết 6-8); Ô tiết hiển thị Môn học, GV, Phòng", "desc": "Giao diện xếp lịch trực quan.", "note": "BR-SCH-01, BR-SCH-03"},
                {"screen": "Chế độ tệp đính kèm (`TimetableFileView`)", "component": "Trình xem tệp PDF trực tuyến", "format": "Khung nhúng PDF xem trước (PDF Viewer), Nút tải file về máy, Ngày ký duyệt, Nút thay thế tệp", "desc": "Dành cho các trường sử dụng công văn TKB in.", "note": "UploadScheduleModal"},
                {"screen": "Modal nhân bản TKB (`CloneScheduleModal`)", "component": "Hộp thoại sao chép thời khóa biểu", "format": "Dropdown chọn Lớp nguồn, Checkbox chọn các Lớp đích nhận TKB, Nút 'Xác nhận nhân bản'", "desc": "Sao chép nhanh TKB giữa các lớp.", "note": "Prototype hoàn chỉnh"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-SCH-01",
                "title": "Cảnh báo xung đột khi xếp trùng giờ giáo viên",
                "scenario": "Given Giáo viên Nguyễn Văn An đã được xếp dạy lớp 6A1 vào Tiết 1 Thứ 2\nWhen BGH cố tình xếp Thầy An dạy thêm lớp 6A2 vào đúng Tiết 1 Thứ 2\nThen hệ thống lập tức hiển thị cảnh báo xung đột và ngăn chặn việc lưu tiết học."
            },
            {
                "id": "AC-SCH-02",
                "title": "Tải lên tệp PDF thời khóa biểu và xuất bản",
                "scenario": "Given BGH chọn chế độ File và mở UploadScheduleModal\nWhen tải lên tệp 'TKB_HocKy1_Khoi6.pdf' và bấm 'Xuất bản'\nThen tệp hiển thị trong khung PDF Viewer và gửi thông báo TKB mới tới phụ huynh."
            }
        ],
        "nfr": {
            "performance": "Tải lưới thời khóa biểu toàn trường dưới 400ms.",
            "security": "Chỉ BGH mới có quyền chỉnh sửa thời khóa biểu; giáo viên và phụ huynh chỉ có quyền xem.",
            "ux": "Hỗ trợ kéo thả (Drag and drop) các tiết học giữa các ô trong bảng lưới."
        },
        "appendix": {
            "notifications": [
                {"event": "Thời khóa biểu mới", "channel": "Push Notification", "recipient": "Phụ huynh & Học sinh", "content": "Thời khóa biểu tuần mới của lớp [Tên lớp] đã được cập nhật. Kính mời quý phụ huynh xem lại."}
            ],
            "edge_cases": [
                {"condition": "Giáo viên nghỉ ốm đột xuất vào buổi sáng", "solution": "BGH mở TKB ngày hôm nay, bấm vào ô tiết đó và chọn 'Chỉ định giáo viên dạy thay'."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 9. M3/SM2 - Bài tập (Homework Assignments & Student Submissions)
    # -------------------------------------------------------------------------
    {
        "code": "M3/SM2",
        "name": "M3 - SM2 - Bài tập",
        "parent_module": "M3",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Quản Lý Giao Bài Tập Về Nhà & Thu Nộp Bài Trực Tuyến (Homework Assignment Distribution & Submission Cockpit)</strong> thuộc nhóm <strong>M3: Học tập</strong> giúp giáo viên chủ nhiệm và giáo viên bộ môn dễ dàng giao bài tập về nhà, phiếu bài tập cuối tuần, đề tài nghiên cứu hoặc tài liệu đọc trước cho học sinh (`/[schoolCode]/school/assignment/`). Phân hệ hỗ trợ đầy đủ các tính năng: Đặt hạn nộp bài (Deadline), đính kèm tệp tài liệu PDF/Word/Hình ảnh, quản lý danh sách học sinh phải nộp (`ManageStudentsModal`), theo dõi trạng thái nộp bài thời gian thực trên bảng phân tích (`SubmissionRosterTable`), chấm điểm và nhận xét chi tiết từng bài làm (`SubmitGradingModal`), trao đổi giải đáp thắc mắc giữa thầy cô và học sinh trong tab thảo luận (`AssignmentDiscussionTab`), và các thẻ đo lường KPI hoàn thành (`AssignmentSummaryCards`).",
            "goals_list": [
                "Cung cấp công cụ giao bài tập theo Lớp và Môn học với đầy đủ tiêu đề, hướng dẫn chi tiết và tệp đính kèm.",
                "Quản lý danh sách học sinh nhận bài linh hoạt (`ManageStudentsModal`): Giao cho cả lớp hoặc chỉ giao bài tập nâng cao/bổ trợ cho một nhóm học sinh cụ thể.",
                "Theo dõi danh sách nộp bài trực quan (`SubmissionRosterTable`): Phân loại Đã nộp đúng hạn, Nộp muộn, Chưa nộp bài kèm tệp bài làm học sinh chụp gửi.",
                "Chấm điểm và nhận xét trực tuyến (`SubmitGradingModal`): Chấm điểm số thang 10 hoặc nhận xét Đạt/Chưa đạt, ghi chú lời khuyên sư phạm của giáo viên.",
                "Diễn đàn hỏi đáp về bài tập (`AssignmentDiscussionTab`): Cho phép học sinh và phụ huynh đặt câu hỏi khi gặp bài khó và giáo viên phản hồi.",
                "Thẻ tóm tắt KPI (`AssignmentSummaryCards`): Tỷ lệ nộp bài của lớp (mục tiêu > 90%), Điểm trung bình bài tập, Số bài chờ chấm điểm."
            ],
            "target_users": [
                {"group": "Giáo viên bộ môn (GVBM)", "role": "Giao bài & chấm điểm bài tập", "actions": "Tạo bài tập mới, đính kèm phiếu bài tập, kiểm tra bài nộp của học sinh, chấm điểm và trả nhận xét."},
                {"group": "Học sinh", "role": "Xem đề bài & nộp bài làm", "actions": "Xem bài tập được giao trên App, làm bài ra vở, chụp ảnh bài làm và bấm nộp bài trước hạn."},
                {"group": "Phụ huynh học sinh", "role": "Giám sát con làm bài", "actions": "Nhận thông báo khi cô giao bài mới, nhắc nhở con làm bài và xem điểm số, lời phê của cô."}
            ],
            "glossary": [
                {"term": "Hạn nộp (Deadline)", "definition": "Mốc thời gian quy định học sinh phải hoàn thành và nộp bài làm lên hệ thống."},
                {"term": "Nộp muộn (Late Submission)", "definition": "Trường hợp học sinh nộp bài sau thời điểm deadline nhưng trước khi giáo viên khóa cổng nộp bài."},
                {"term": "Chấm điểm trực tuyến (Online Grading)", "definition": "Hành động giáo viên xem ảnh bài làm của học sinh trên màn hình, nhập điểm số và viết nhận xét trả kết quả về App phụ huynh."}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên giao bài tập kèm hạn nộp; học sinh làm bài và chụp ảnh nộp qua App; giáo viên chấm điểm và nhận xét trên SubmissionRosterTable; điểm số tự động công bố tới phụ huynh.",
            "flow_steps": [
                {"actor": "Giáo viên", "action": "Tạo bài tập mới", "desc": "Mở `/school/assignment`, nhập tiêu đề 'Bài tập tuần 8 - Phép nhân', chọn Môn Toán, chọn Lớp 3A1, hạn nộp Chủ nhật."},
                {"actor": "Hệ thống BE", "action": "Phát hành & Push Notification", "desc": "Gửi thông báo tới toàn bộ phụ huynh và học sinh lớp 3A1: 'Cô vừa giao bài tập Toán mới'."},
                {"actor": "Học sinh / PH", "action": "Làm bài & Nộp ảnh bài làm", "desc": "Học sinh giải bài ra vở, chụp 2 ảnh trang vở và bấm 'Nộp bài'."},
                {"actor": "Giáo viên", "action": "Chấm điểm (SubmitGradingModal)", "desc": "Mở SubmissionRosterTable, xem ảnh bài làm, nhập điểm '9/10', nhận xét 'Chữ viết đẹp, tính toán chính xác'."},
                {"actor": "Phụ huynh", "action": "Xem kết quả chấm bài", "desc": "Nhận thông báo Push: 'Bài tập Toán của con đã được chấm: 9 điểm kèm lời khen'."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Giao bài tập): Giáo viên bấm 'Tạo bài tập mới', chọn môn học, nhập nội dung yêu cầu và tải lên tệp đề bài dạng PDF.",
                "Giai đoạn 2 (Chọn nhóm học sinh - ManageStudentsModal): Mặc định giao cho toàn bộ học sinh trong lớp. Giáo viên có thể bỏ tick một số em hoặc chỉ chọn giao bài tập nâng cao cho nhóm học sinh giỏi.",
                "Giai đoạn 3 (Theo dõi tiến độ nộp bài - SubmissionRosterTable): Giáo viên mở danh sách nộp bài. Bảng hiển thị danh sách học sinh kèm trạng thái: Đã nộp (xanh lá), Chưa nộp (đỏ). Giáo viên bấm 'Gửi nhắc nhở' cho các em chưa làm bài.",
                "Giai đoạn 4 (Chấm bài & Trả nhận xét - SubmitGradingModal): Nhấp vào bài của học sinh để phóng to ảnh bài làm, nhập điểm số, nhận xét chi tiết và bấm 'Lưu & Trả kết quả'.",
                "Giai đoạn 5 (Trao đổi thắc mắc - AssignmentDiscussionTab): Giáo viên và học sinh trao đổi các câu hỏi khó trong luồng bình luận bài tập."
            ],
            "rules": [
                {"id": "BR-ASN-01", "title": "Bắt buộc hạn nộp trong tương lai", "desc": "Thời điểm hạn nộp (Deadline) bắt buộc phải sau thời điểm tạo bài tập tối thiểu 2 giờ làm việc."},
                {"id": "BR-ASN-02", "title": "Chính sách nộp bài muộn", "desc": "Học sinh nộp bài sau giờ deadline sẽ bị gắn nhãn màu vàng 'Nộp muộn kèm [N] giờ trễ'. Giáo viên có quyền bật hoặc tắt tính năng 'Chặn nộp bài khi quá hạn'."},
                {"id": "BR-ASN-03", "title": "Bảo vệ kết quả điểm sau khi đã khóa sổ", "desc": "Sau khi giáo viên bấm 'Chốt điểm bài tập', điểm số không được phép chỉnh sửa tùy tiện."}
            ],
            "data_entities": [
                {"field": "assignment_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính bài tập."},
                {"field": "title", "type": "String (255)", "required": "Bắt buộc", "desc": "Tiêu đề bài tập về nhà."},
                {"field": "subject_id", "type": "UUID", "required": "Bắt buộc", "desc": "Môn học tương ứng (M5/SM4)."},
                {"field": "class_id", "type": "UUID", "required": "Bắt buộc", "desc": "Lớp học được giao bài."},
                {"field": "deadline", "type": "Timestamp", "required": "Bắt buộc", "desc": "Hạn chót nộp bài."},
                {"field": "allow_late_submission", "type": "Boolean", "required": "Mặc định True", "desc": "Cho phép nộp muộn hay không."},
                {"field": "created_by", "type": "UUID", "required": "Bắt buộc", "desc": "Giáo viên tạo bài tập."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-021 Học tập Bài tập", "feature": "Quản lý bài tập & Bảng theo dõi nộp bài (SubmissionRosterTable)", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên, tôi muốn xem danh sách học sinh ai đã nộp bài, ai chưa nộp.", "jira": "ASN-001"},
                {"epic": "E-021 Học tập Bài tập", "feature": "Chấm điểm & Nhận xét bài làm học sinh (SubmitGradingModal)", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên, tôi muốn xem ảnh bài làm, nhập điểm và gửi lời nhận xét cho học sinh.", "jira": "ASN-002"},
                {"epic": "E-021 Học tập Bài tập", "feature": "Quản lý đối tượng học sinh nhận bài (ManageStudentsModal)", "platform": "Portal Web", "priority": "P2", "story": "Là Giáo viên, tôi muốn chọn riêng một nhóm học sinh để giao bài tập nâng cao.", "jira": "ASN-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-ASN-01",
                    "name": "Chấm điểm và trả nhận xét bài tập",
                    "desc": "Giáo viên chấm bài tập làm văn của học sinh.",
                    "actor": "Giáo viên bộ môn",
                    "trigger": "Học sinh nộp bài làm.",
                    "pre": "Học sinh đã nộp ảnh bài làm lên hệ thống.",
                    "happy_path": [
                        "1. Giáo viên mở SubmissionRosterTable của bài tập Làm văn.",
                        "2. Bấm nút 'Chấm bài' trên dòng của học sinh Lê An.",
                        "3. Modal SubmitGradingModal xuất hiện hiển thị 2 ảnh trang vở viết tay của An.",
                        "4. Giáo viên xem xét, nhập Điểm: '8.5', Nhận xét: 'Bài viết giàu cảm xúc, cần chú ý chính tả đoạn cuối'.",
                        "5. Bấm 'Lưu kết quả & Gửi phản hồi'.",
                        "6. Hệ thống cập nhật điểm trên bảng và bắn thông báo Push về máy phụ huynh của An."
                    ],
                    "exceptions": [
                        {"case": "Ảnh bài làm của học sinh bị mờ không đọc được", "handling": "Giáo viên bấm 'Yêu cầu nộp lại', nhập lý do 'Ảnh mờ' để học sinh chụp lại ảnh mới."}
                    ],
                    "post": "Điểm số được ghi nhận vào sổ theo dõi bài tập của lớp.",
                    "rules": ["BR-ASN-03"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Học tập -> Bài tập (`/[schoolCode]/school/assignment`)",
            "screens_table": [
                {"screen": "Bảng danh sách bài tập (`AssignmentTable`)", "component": "Thẻ KPI bài tập (`AssignmentSummaryCards`)", "format": "3 Card ngang: Tỷ lệ nộp bài lớp (%), Điểm trung bình, Số bài chờ chấm điểm (cam)", "desc": "Theo dõi nhanh tiến độ học tập.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Bảng danh sách bài tập (`AssignmentTable`)", "component": "Danh sách các bài tập đã giao (`AssignmentTable`)", "format": "Table gồm: STT, Tiêu đề bài tập, Môn học, Lớp, Hạn nộp, Đã nộp / Tổng số, Trạng thái, Thao tác", "desc": "Quản trị các bài tập đã phát hành.", "note": "BR-ASN-01"},
                {"screen": "Danh sách nộp bài (`SubmissionRosterTable`)", "component": "Bảng chi tiết nộp bài của học sinh", "format": "Table gồm: Học sinh (Avatar, Tên), Trạng thái (Đã nộp / Chưa nộp / Nộp muộn), Thời điểm nộp, Tệp bài làm, Điểm số, Nút 'Chấm bài'", "desc": "Nơi giáo viên kiểm tra và theo dõi từng học sinh.", "note": "BR-ASN-02"},
                {"screen": "Modal chấm điểm bài tập (`SubmitGradingModal`)", "component": "Hộp thoại chấm bài trực tuyến", "format": "Khung xem ảnh bài làm phóng to, Input Điểm số (0-10), Textarea Nhận xét sư phạm, Nút 'Yêu cầu nộp lại', Nút 'Lưu & Trả kết quả'", "desc": "Thao tác chấm điểm nhanh chóng.", "note": "BR-ASN-03"},
                {"screen": "Tab thảo luận bài tập (`AssignmentDiscussionTab`)", "component": "Diễn đàn hỏi đáp về bài tập", "format": "Khung tin nhắn trao đổi giữa Giáo viên và Học sinh về các vướng mắc của đề bài", "desc": "Hỗ trợ học tập tương tác.", "note": "Prototype hoàn chỉnh"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-ASN-01",
                "title": "Giao bài tập mới với hạn nộp hợp lệ",
                "scenario": "Given Giáo viên nhập tiêu đề bài tập, môn Toán, hạn nộp là ngày mai\nWhen bấm 'Phát hành bài tập'\nThen bài tập xuất hiện trên bảng danh sách và toàn bộ học sinh trong lớp nhận được thông báo Push."
            },
            {
                "id": "AC-ASN-02",
                "title": "Chấm điểm và gửi nhận xét bài tập thành công",
                "scenario": "Given Học sinh đã nộp bài làm\nWhen giáo viên mở SubmitGradingModal, nhập điểm 8.5 và lời nhận xét rồi bấm Lưu\nThen dòng học sinh hiển thị điểm 8.5 màu xanh lá và phụ huynh nhận được thông báo điểm số trên ứng dụng."
            }
        ],
        "nfr": {
            "performance": "Tải bảng danh sách nộp bài của 40 học sinh dưới 400ms.",
            "security": "Chỉ giáo viên phụ trách môn và GVCN mới có quyền chấm điểm; học sinh không xem được bài làm của bạn khác.",
            "ux": "Trình xem ảnh bài làm có tính năng xoay ảnh (Rotate 90°) và phóng to chi tiết (Zoom)."
        },
        "appendix": {
            "notifications": [
                {"event": "Bài tập mới", "channel": "Push Notification", "recipient": "Phụ huynh & Học sinh", "content": "Thầy/Cô vừa giao bài tập mới môn [Tên môn]: '[Tiêu đề]'. Hạn nộp: [Hạn nộp]."},
                {"event": "Kết quả chấm bài", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Bài tập môn [Tên môn] của bé [Tên con] đã có điểm: [Điểm] điểm. Nhận xét: '[Lời phê]'."}
            ],
            "edge_cases": [
                {"condition": "Học sinh nộp nhầm ảnh bài làm môn khác", "solution": "Giáo viên bấm nút 'Yêu cầu nộp lại', hệ thống mở lại cổng nộp bài cho riêng học sinh đó."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 10. M3/SM3 - Điểm & Đánh giá (Gradebook Evaluation & Scoreboard)
    # -------------------------------------------------------------------------
    {
        "code": "M3/SM3",
        "name": "M3 - SM3 - Điểm & Đánh giá",
        "parent_module": "M3",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Sổ Điểm Điện Tử & Bảng Đánh Giá Xếp Loại Học Sinh (Digital Gradebook & Academic Scoreboard System)</strong> thuộc nhóm <strong>M3: Học tập</strong> là hệ thống quản trị kết quả học tập cốt lõi của nhà trường (`/[schoolCode]/school/scoreboard/`). Phân hệ tuân thủ nghiêm ngặt các quy định đánh giá, xếp loại học sinh theo Thông tư của Bộ GD&ĐT (Thông tư 27/2020/TT-BGDĐT đối với Tiểu học và Thông tư 22/2021/TT-BGDĐT đối với THCS/THPT). Hệ thống hỗ trợ bảng tổng hợp kết quả toàn diện (`ScoreboardOverviewGrid`), bảng nhập điểm chi tiết từng môn học (`SubjectGradeEntryTable`) gồm các cột điểm: Điểm đánh giá thường xuyên (ĐGTX 1, 2, 3, 4), Điểm đánh giá giữa kỳ (ĐGGK), Điểm đánh giá cuối kỳ (ĐGCK), tính toán tự động Điểm trung bình môn (ĐTBm), bảng tổng kết học kỳ (`TermSummaryTable`), đánh giá định kỳ phẩm chất năng lực (`PeriodicEvaluationModal`) và xuất học bạ điện tử chuẩn Sở GD&ĐT.",
            "goals_list": [
                "Cung cấp sổ điểm điện tử đa cấp: Bảng nhập điểm chi tiết theo môn (`SubjectGradeEntryTable`) và Bảng tổng hợp điểm các môn của lớp (`ScoreboardOverviewGrid`).",
                "Hỗ trợ đầy đủ các hình thức đánh giá: Chấm điểm số thang 10 (Toán, Văn, Anh...) và Đánh giá bằng nhận xét Đạt/Chưa đạt (Thể dục, Âm nhạc).",
                "Tự động tính toán điểm trung bình môn học kỳ (ĐTBmhk) và điểm trung bình cả năm (ĐTBmcn) theo trọng số quy định của Bộ GD&ĐT.",
                "Tự động xếp loại học lực / mức độ hoàn thành: Tốt / Hoàn thành tốt, Khá / Hoàn thành, Đạt, Chưa đạt.",
                "Đánh giá phẩm chất và năng lực định kỳ (`PeriodicEvaluationModal`): Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm.",
                "Quy trình khóa sổ điểm an toàn: Chặn giáo viên sửa điểm sau khi BGH đã chốt sổ điểm học kỳ, hỗ trợ quy trình xin mở khóa sửa điểm có lưu vết kiểm toán."
            ],
            "target_users": [
                {"group": "Giáo viên bộ môn (GVBM)", "role": "Nhập điểm kiểm tra thường xuyên & định kỳ", "actions": "Nhập điểm kiểm tra miệng, 15 phút, giữa kỳ và cuối kỳ cho học sinh các lớp mình giảng dạy."},
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Đánh giá phẩm chất & tổng kết học kỳ", "actions": "Nhập nhận xét rèn luyện, đánh giá phẩm chất năng lực và tổng hợp kết quả xếp loại thi đua của lớp."},
                {"group": "Ban Giám Hiệu (BGH)", "role": "Giám sát & phê duyệt sổ điểm", "actions": "Kiểm tra tiến độ nhập điểm toàn trường, phê duyệt mở khóa sửa điểm và ký số học bạ điện tử."},
                {"group": "Phụ huynh học sinh", "role": "Xem bảng điểm điện tử", "actions": "Xem điểm số các bài kiểm tra của con trên App ngay sau khi cô giáo công bố."}
            ],
            "glossary": [
                {"term": "ĐGTX (Đánh giá thường xuyên)", "definition": "Các đầu điểm kiểm tra miệng, kiểm tra 15 phút, thảo luận nhóm diễn ra thường xuyên trong quá trình học."},
                {"term": "ĐGGK (Đánh giá giữa kỳ)", "definition": "Điểm bài thi kiểm tra giữa học kỳ (thường nhân hệ số 2 trong công thức tính)."},
                {"term": "ĐGCK (Đánh giá cuối kỳ)", "definition": "Điểm bài thi kiểm tra học kỳ (thường nhân hệ số 3 trong công thức tính)."},
                {"term": "ĐTBm (Điểm trung bình môn)", "definition": "Điểm trung bình có tính trọng số của tất cả các đầu điểm kiểm tra trong học kỳ."},
                {"term": "Khóa sổ điểm", "definition": "Hành động đóng quyền nhập điểm của giáo viên sau ngày hạn định của nhà trường để chốt dữ liệu xếp loại."}
            ]
        },
        "business": {
            "flow_desc": "GVBM nhập điểm thường xuyên và định kỳ trên SubjectGradeEntryTable; hệ thống tự tính điểm trung bình; GVCN đánh giá phẩm chất trên PeriodicEvaluationModal; BGH khóa sổ và xuất bản bảng điểm tới phụ huynh.",
            "flow_steps": [
                {"actor": "GVBM", "action": "Nhập điểm kiểm tra", "desc": "Mở môn Toán lớp 6A1, nhập điểm miệng, 15 phút, giữa kỳ cho từng học sinh."},
                {"actor": "Hệ thống BE", "action": "Tính điểm trung bình môn", "desc": "Tự động tính ĐTBm = (Tổng ĐGTX + ĐGGK * 2 + ĐGCK * 3) / Tổng hệ số và xếp loại môn."},
                {"actor": "GVCN", "action": "Đánh giá phẩm chất năng lực", "desc": "Mở PeriodicEvaluationModal, đánh giá các phẩm chất (Tốt / Đạt / Cần cố gắng) và viết nhận xét rèn luyện."},
                {"actor": "BGH", "action": "Kiểm duyệt & Khóa sổ điểm", "desc": "Rà soát toàn trường, bấm 'Khóa sổ điểm Học kỳ 1' và ký số xuất bản bảng điểm."},
                {"actor": "Phụ huynh", "action": "Xem bảng điểm trên App", "desc": "Phụ huynh nhận thông báo, mở App xem đầy đủ bảng điểm các môn của con."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Lựa chọn lớp & Môn học): Giáo viên sử dụng thanh lọc chọn Lớp 6A1, Môn Toán và Học kỳ 1. Bảng SubjectGradeEntryTable hiển thị danh sách học sinh kèm các cột điểm.",
                "Giai đoạn 2 (Nhập điểm nhanh chóng): Nhập điểm trực tiếp trên bảng bằng bàn phím số (hỗ trợ phím Enter để nhảy xuống dòng dưới, phím Tab để nhảy sang cột kế tiếp). Hệ thống tô màu điểm kém (< 5.0 tô đỏ).",
                "Giai đoạn 3 (Tổng kết học kỳ - TermSummaryTable): Xem bảng tổng hợp toàn bộ các môn học của lớp. Cột Điểm trung bình tất cả các môn và Xếp loại danh hiệu (Học sinh Giỏi / Học sinh Tiên tiến) tự động nhảy số.",
                "Giai đoạn 4 (Đánh giá phẩm chất - PeriodicEvaluationModal): GVCN nhập mức độ rèn luyện 5 phẩm chất theo Thông tư 22/2021/TT-BGDĐT.",
                "Giai đoạn 5 (Khóa sổ & Trao đổi sửa điểm): BGH khóa sổ điểm. Nếu giáo viên cần sửa một đầu điểm do chấm phúc khảo, phải gửi yêu cầu mở khóa ghi rõ lý do và được BGH phê duyệt mới được sửa."
            ],
            "rules": [
                {"id": "BR-SCB-01", "title": "Giới hạn thang điểm số từ 0.0 đến 10.0", "desc": "Điểm số nhập vào bắt buộc phải nằm trong khoảng từ 0.0 đến 10.0 (chính xác đến 1 chữ số thập phân). Hệ thống chặn và báo lỗi nếu nhập số âm hoặc số lớn hơn 10."},
                {"id": "BR-SCB-02", "title": "Công thức tính điểm trung bình chuẩn Bộ GD&ĐT", "desc": "ĐTBmhk = [Tổng điểm ĐGTX + (2 x Điểm ĐGGK) + (3 x Điểm ĐGCK)] / [Số điểm ĐGTX + 5]. Kết quả làm tròn đến chữ số thập phân thứ nhất."},
                {"id": "BR-SCB-03", "title": "Khóa sổ điểm học kỳ nghiêm ngặt", "desc": "Khi BGH đã bấm Khóa sổ điểm, mọi thao tác sửa chữa trực tiếp của giáo viên đều bị vô hiệu hóa. Mọi sửa đổi bắt buộc phải qua quy trình xin phê duyệt mở khóa của BGH và lưu vết Audit Log."},
                {"id": "BR-SCB-04", "title": "Quy tắc xếp loại học lực theo Thông tư 22", "desc": "Xếp loại Tốt: Tất cả các môn ĐTBm >= 6.5, trong đó có ít nhất 6 môn >= 8.0 và các môn nhận xét đều Đạt. Các mức xếp loại Khá, Đạt, Chưa đạt được áp dụng công thức tương ứng."}
            ],
            "data_entities": [
                {"field": "score_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính bản ghi điểm số."},
                {"field": "student_id", "type": "UUID", "required": "Bắt buộc", "desc": "Học sinh được chấm điểm (M5/SM1)."},
                {"field": "subject_id", "type": "UUID", "required": "Bắt buộc", "desc": "Môn học tương ứng (M5/SM4)."},
                {"field": "term_id", "type": "UUID", "required": "Bắt buộc", "desc": "Học kỳ đánh giá."},
                {"field": "regular_scores", "type": "Array[Decimal]", "required": "Tùy chọn", "desc": "Mảng điểm đánh giá thường xuyên (ĐGTX)."},
                {"field": "midterm_score", "type": "Decimal (0.0-10.0)", "required": "Tùy chọn", "desc": "Điểm kiểm tra giữa kỳ."},
                {"field": "final_score", "type": "Decimal (0.0-10.0)", "required": "Tùy chọn", "desc": "Điểm kiểm tra cuối kỳ."},
                {"field": "average_score", "type": "Decimal (0.0-10.0)", "required": "Tùy chọn", "desc": "Điểm trung bình môn tính tự động."},
                {"field": "is_locked", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ khóa sổ điểm."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-022 Học tập Điểm số", "feature": "Bảng nhập điểm chi tiết môn học (SubjectGradeEntryTable)", "platform": "Portal Web", "priority": "P1", "story": "Là GVBM, tôi muốn nhập điểm miệng, 15 phút, giữa kỳ và cuối kỳ cho học sinh trên bảng tính nhanh.", "jira": "SCB-001"},
                {"epic": "E-022 Học tập Điểm số", "feature": "Bảng tổng hợp điểm các môn & Xếp loại (ScoreboardOverviewGrid)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem bảng tổng hợp điểm tất cả các môn của lớp để xếp loại học sinh.", "jira": "SCB-002"},
                {"epic": "E-022 Học tập Điểm số", "feature": "Đánh giá phẩm chất năng lực định kỳ (PeriodicEvaluationModal)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn đánh giá 5 phẩm chất năng lực của học sinh theo chuẩn Bộ GD&ĐT.", "jira": "SCB-003"},
                {"epic": "E-022 Học tập Điểm số", "feature": "Khóa sổ điểm & Quy trình phê duyệt sửa điểm", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn khóa sổ điểm cuối kỳ để bảo vệ dữ liệu học bạ.", "jira": "SCB-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-SCB-01",
                    "name": "Nhập điểm cuối kỳ và tự động tính điểm trung bình",
                    "desc": "Giáo viên Toán nhập điểm thi học kỳ cho học sinh.",
                    "actor": "Giáo viên bộ môn Toán",
                    "trigger": "Có kết quả thi học kỳ.",
                    "pre": "Học sinh đã có đầy đủ các cột điểm thường xuyên và giữa kỳ.",
                    "happy_path": [
                        "1. GVBM mở SubjectGradeEntryTable môn Toán lớp 6A1.",
                        "2. Tại dòng của học sinh Trần An (ĐGTX: 8, 9; ĐGGK: 8.5), giáo viên nhập điểm cuối kỳ: '9.0'.",
                        "3. Hệ thống tự động tính ĐTBmhk = (8 + 9 + 8.5*2 + 9*3) / (2 + 2 + 3) = 8.7.",
                        "4. Cột ĐTBm hiển thị số '8.7' màu xanh lá và xếp loại môn: 'Tốt'.",
                        "5. GVBM bấm 'Lưu bảng điểm'."
                    ],
                    "exceptions": [
                        {"case": "Nhập nhầm điểm 12", "handling": "Hệ thống hiển thị viền đỏ và thông báo 'Điểm số phải từ 0 đến 10'."}
                    ],
                    "post": "Điểm số được lưu vào CSDL và đồng bộ sang bảng tổng hợp của GVCN.",
                    "rules": ["BR-SCB-01", "BR-SCB-02"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Học tập -> Điểm & Đánh giá (`/[schoolCode]/school/scoreboard`)",
            "screens_table": [
                {"screen": "Sổ điểm chi tiết môn (`SubjectGradeEntryTable`)", "component": "Bảng nhập điểm theo học sinh", "format": "Table gồm: STT, Học sinh, ĐGTX 1, ĐGTX 2, ĐGTX 3, ĐGTX 4, ĐGGK (hệ số 2), ĐGCK (hệ số 3), ĐTBm, Xếp loại, Nhận xét", "desc": "Giao diện nhập điểm tốc độ cao.", "note": "BR-SCB-01, BR-SCB-02"},
                {"screen": "Bảng tổng hợp điểm lớp (`ScoreboardOverviewGrid`)", "component": "Ma trận điểm tất cả các môn của lớp", "format": "Table gồm: Học sinh, Cột điểm các môn (Toán, Văn, Anh, KHTN...), ĐTB chung, Xếp loại học lực, Danh hiệu thi đua", "desc": "Bức tranh tổng thể kết quả học tập của lớp.", "note": "BR-SCB-04"},
                {"screen": "Modal đánh giá phẩm chất (`PeriodicEvaluationModal`)", "component": "Hộp thoại đánh giá rèn luyện", "format": "Đánh giá 5 phẩm chất (Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm) theo 3 mức (Tốt / Đạt / Cần cố gắng), Textarea Nhận xét GVCN", "desc": "Đánh giá toàn diện theo Thông tư 22.", "note": "BR-SCB-04"},
                {"screen": "Thanh công cụ sổ điểm (`GradebookToolbar`)", "component": "Bộ lọc & Nút chức năng", "format": "Dropdown chọn Khối, Dropdown chọn Lớp, Dropdown chọn Môn, Dropdown chọn Kỳ, Nút 'Khóa sổ điểm', Nút 'Xuất học bạ Excel'", "desc": "Điều phối quản lý điểm.", "note": "BR-SCB-03"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-SCB-01",
                "title": "Tính chính xác điểm trung bình môn theo công thức Bộ GD&ĐT",
                "scenario": "Given Học sinh có ĐGTX là 8 và 9, ĐGGK là 8.5, ĐGCK là 9.0\nWhen giáo viên nhập đủ điểm trên SubjectGradeEntryTable\nThen hệ thống tính toán chính xác ĐTBm là 8.7 và hiển thị xếp loại Tốt."
            },
            {
                "id": "AC-SCB-02",
                "title": "Chặn sửa điểm sau khi sổ điểm đã khóa",
                "scenario": "Given BGH đã bấm Khóa sổ điểm Học kỳ 1\nWhen giáo viên bộ môn cố tình nhấp chuột vào ô điểm để sửa số\nThen các ô điểm đều ở trạng thái Read-only và hiển thị thông báo 'Sổ điểm đã khóa, liên hệ BGH để mở'."
            }
        ],
        "nfr": {
            "performance": "Tính toán và cập nhật điểm trung bình của cả lớp 45 học sinh dưới 200ms.",
            "security": "Chỉ GVBM được phân công mới có quyền sửa điểm môn đó; lưu đầy đủ Audit Log người sửa, giờ sửa và điểm cũ/mới.",
            "ux": "Tối ưu hóa thao tác bàn phím: Dùng phím Enter để nhảy xuống hàng dưới, phím Tab để nhảy sang cột phải."
        },
        "appendix": {
            "notifications": [
                {"event": "Công bố điểm kiểm tra", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Điểm kiểm tra [Giữa kỳ/Cuối kỳ] môn [Tên môn] của bé [Tên con] đã có: [Điểm] điểm."}
            ],
            "edge_cases": [
                {"condition": "Học sinh được miễn thi môn Thể dục do bệnh lý y khoa", "solution": "Hệ thống hỗ trợ gắn cờ 'Miễn kiểm tra (MT)' cho học sinh đó và không tính môn đó vào điểm trung bình chung."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 11. M1/SM1 - Tổng quan (Executive School Dashboard & KPI Cockpit)
    # -------------------------------------------------------------------------
    {
        "code": "M1/SM1",
        "name": "M1 - SM1 - Tổng quan",
        "parent_module": "M1",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Bảng Điều Khiển Tổng Quan Vận Hành & Trung Tâm Chỉ Huy Nhà Trường (Executive School Operational Dashboard & Cockpit)</strong> thuộc nhóm <strong>M1: Tổng quan</strong> đóng vai trò là trang chủ chào đón (Landing Cockpit) ngay sau khi người dùng đăng nhập thành công vào Portal QLTH (`/[schoolCode]/dashboard`). Dashboard cung cấp cái nhìn toàn cảnh, tổng hợp 360 độ về sức khỏe vận hành của nhà trường thông qua các khối chỉ số đo lường hiệu năng thời gian thực (Real-time KPI Cards): Tỷ lệ học sinh đi học chuyên cần hôm nay, Tỷ lệ thu học phí tháng hiện tại, Cảnh báo học sinh ốm/sốt cần theo dõi, Hàng đợi duyệt bài viết hoạt động, Lối tắt hành động nhanh (Quick Actions) và Luồng tin tức sự kiện khẩn cấp.",
            "goals_list": [
                "Cung cấp 4 thẻ chỉ số KPI vận hành trung tâm: Sĩ số toàn trường & Tỷ lệ chuyên cần hôm nay (%), Doanh thu học phí đã thu vs Mục tiêu thu (VND / %), Số nhân sự đi làm đúng giờ, Số lượng yêu cầu/góp ý đang chờ xử lý.",
                "Đồng hồ đo tỷ lệ thu tiền học phí thời gian thực (Collection Rate Gauge): Trực quan hóa tiến độ thu học phí theo lớp và toàn trường.",
                "Biểu đồ chuyên cần tuần (Weekly Attendance Trend): Biểu đồ đường/cột thể hiện số lượng học sinh có mặt từ Thứ 2 đến Thứ 6.",
                "Thanh lối tắt tác vụ nhanh (Quick Actions): Giúp giáo viên/admin 1-click truy cập ngay: Điểm danh nhanh, Tạo thông báo khẩn, Tạo bài viết hoạt động, Lập phiếu thu tiền mặt.",
                "Bảng cảnh báo vận hành ưu tiên (Operational Alerts): Cảnh báo học sinh nghỉ học bất thường > 3 ngày liên tiếp, cảnh báo các hóa đơn quá hạn chưa thanh toán."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Nắm bắt toàn cảnh & ra quyết định điều hành", "actions": "Xem tỷ lệ chuyên cần buổi sáng, theo dõi tiến độ thu học phí tháng và kiểm tra các cảnh báo khẩn cấp."},
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Xem nhiệm vụ trong ngày của lớp", "actions": "Kiểm tra sĩ số lớp mình hôm nay, xem bài tập cần chấm và duyệt đơn xin nghỉ học của phụ huynh."},
                {"group": "Kế toán trưởng", "role": "Theo dõi dòng tiền thu học phí", "actions": "Xem số tiền phụ huynh đã quét mã VietQR trong ngày và danh sách các lớp có tỷ lệ nộp học phí thấp."}
            ],
            "glossary": [
                {"term": "Executive Cockpit", "definition": "Bảng điều khiển trung tâm hiển thị các chỉ số sống còn của tổ chức giúp lãnh đạo ra quyết định nhanh chóng mà không cần mở nhiều báo cáo con."},
                {"term": "Tỷ lệ chuyên cần (Attendance Rate)", "definition": "Tỷ lệ phần trăm số học sinh có mặt thực tế tại trường so với tổng sĩ số danh bạ trong ngày."},
                {"term": "Tỷ lệ thu phí (Collection Rate)", "definition": "Tỷ lệ phần trăm số tiền học phí thực tế đã thu được so với tổng số tiền cần phải thu theo kế hoạch."}
            ]
        },
        "business": {
            "flow_desc": "Khi người dùng đăng nhập, Dashboard truy vấn dữ liệu từ các phân hệ Điểm danh M2/SM1, Học phí M4/SM1, Hoạt động M2/SM2 và hiển thị các widget theo đúng vai trò người dùng.",
            "flow_steps": [
                {"actor": "Người dùng", "action": "Đăng nhập thành công", "desc": "Hệ thống điều hướng người dùng về trang chủ `/[schoolCode]/dashboard`."},
                {"actor": "Hệ thống BE", "action": "Tổng hợp chỉ số thời gian thực", "desc": "Tính toán sĩ số có mặt hôm nay, tổng tiền học phí đã gạch nợ tự động trong ngày và số tin nhắn chưa đọc."},
                {"actor": "Dashboard UI", "action": "Hiển thị widget theo phân quyền", "desc": "BGH thấy toàn trường; GVCN thấy số liệu riêng của lớp mình phụ trách; Kế toán thấy biểu đồ tài chính."},
                {"actor": "Người dùng", "action": "Thao tác trên lối tắt nhanh", "desc": "Nhấp 'Điểm danh ngay' hoặc nhấp vào thẻ cảnh báo để nhảy thẳng tới phân hệ tương ứng."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Truy cập & Phân luồng vai trò): Người dùng truy cập Dashboard. Hệ thống nhận diện vai trò (BGH, GVCN, Kế toán) để tải layout giao diện phù hợp.",
                "Giai đoạn 2 (Hiển thị 4 thẻ KPI đỉnh trang): Thẻ 1: Sĩ số học sinh (Có mặt 950/1000 - 95%); Thẻ 2: Thu học phí (Đạt 85% kế hoạch tháng); Thẻ 3: Chấm công nhân sự (Đạt 98%); Thẻ 4: Góp ý cần xử lý (3 ticket).",
                "Giai đoạn 3 (Biểu đồ trực quan & Bản đồ nhiệt): Biểu đồ cột biểu diễn chuyên cần 7 ngày gần nhất; Biểu đồ hình tròn phân bổ trạng thái học phí (Đã hoàn thành / Nợ một phần / Chưa nộp).",
                "Giai đoạn 4 (Khối cảnh báo khẩn cấp): Khối đỏ hiển thị: 'Lớp 1A1 có 3 học sinh sốt cao đầu giờ'; 'Có 5 hóa đơn học phí quá hạn thanh toán trên 15 ngày'.",
                "Giai đoạn 5 (Lối tắt thao tác nhanh - Quick Actions): Dãy nút bấm màu sắc nhận diện giúp người dùng mở nhanh các màn hình thao tác thường ngày mà không cần tìm kiếm trong cây menu."
            ],
            "rules": [
                {"id": "BR-DSH-01", "title": "Bảo mật dữ liệu theo vai trò (Role-based Data Scope)", "desc": "Tài khoản Giáo viên chỉ được xem số liệu KPI của lớp học mình đang phụ trách; không xem được số liệu tài chính toàn trường của Kế toán."},
                {"id": "BR-DSH-02", "title": "Cơ chế cập nhật dữ liệu tự động (Auto-refresh)", "desc": "Dữ liệu trên Dashboard tự động làm mới mỗi 60 giây (polling) hoặc cập nhật tức thì qua WebSocket khi có sự kiện thanh toán hoặc điểm danh mới."},
                {"id": "BR-DSH-03", "title": "Ưu tiên cảnh báo an toàn sức khỏe", "desc": "Các cảnh báo về học sinh có thân nhiệt >= 38.0°C hoặc học sinh vắng mặt không phép luôn được xếp ở vị trí đầu tiên của danh sách cảnh báo."}
            ],
            "data_entities": [
                {"field": "metric_date", "type": "Date", "required": "Bắt buộc", "desc": "Ngày ghi nhận chỉ số."},
                {"field": "total_students", "type": "Integer", "required": "Bắt buộc", "desc": "Tổng sĩ số học sinh toàn trường."},
                {"field": "present_students", "type": "Integer", "required": "Bắt buộc", "desc": "Số lượng học sinh đã check-in có mặt."},
                {"field": "attendance_rate", "type": "Decimal (0.0-100.0)", "required": "Bắt buộc", "desc": "Tỷ lệ chuyên cần trong ngày (%)."},
                {"field": "tuition_collected_amount", "type": "Decimal (VND)", "required": "Bắt buộc", "desc": "Tổng số tiền học phí đã thu trong kỳ."},
                {"field": "tuition_collection_rate", "type": "Decimal (0.0-100.0)", "required": "Bắt buộc", "desc": "Tỷ lệ hoàn thành thu học phí (%)."},
                {"field": "pending_approvals_count", "type": "Integer", "required": "Mặc định 0", "desc": "Số lượng bài viết hoặc đơn từ đang chờ duyệt."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-023 Tổng quan Dashboard", "feature": "Bộ 4 thẻ KPI vận hành thời gian thực", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem ngay sĩ số có mặt hôm nay và tỷ lệ thu học phí khi vừa đăng nhập.", "jira": "DSH-001"},
                {"epic": "E-023 Tổng quan Dashboard", "feature": "Biểu đồ chuyên cần tuần & Biểu đồ tài chính", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem biểu đồ xu hướng học sinh đi học trong tuần.", "jira": "DSH-002"},
                {"epic": "E-023 Tổng quan Dashboard", "feature": "Khối cảnh báo vận hành ưu tiên & Lối tắt nhanh", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn được cảnh báo ngay khi có học sinh sốt hoặc việc khẩn cấp.", "jira": "DSH-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-DSH-01",
                    "name": "Kiểm tra tình hình vận hành đầu giờ sáng",
                    "desc": "Hiệu trưởng xem dashboard lúc 08:30 sáng.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "BGH đăng nhập vào hệ thống đầu ngày.",
                    "pre": "Các lớp đã hoàn tất điểm danh đầu giờ.",
                    "happy_path": [
                        "1. BGH mở trang Dashboard `/[schoolCode]/dashboard`.",
                        "2. Thẻ KPI Chuyên cần hiển thị '925/980 học sinh (94.4%)'.",
                        "3. Thẻ Cảnh báo hiển thị 2 cảnh báo đỏ: 'Bé Lê An (Lớp 1A1) sốt 38.5°C'.",
                        "4. BGH bấm vào thông báo, hệ thống mở sổ điểm danh lớp 1A1 để xem chi tiết ghi chú sức khỏe.",
                        "5. BGH gọi điện chỉ đạo phòng y tế trường xuống chăm sóc học sinh."
                    ],
                    "exceptions": [
                        {"case": "Mất kết nối mạng khi đang theo dõi dashboard", "handling": "Giao diện hiển thị biểu tượng Offline màu xám và tự động kết nối lại khi có mạng."}
                    ],
                    "post": "BGH bao quát và xử lý kịp thời các sự cố vận hành phát sinh.",
                    "rules": ["BR-DSH-01", "BR-DSH-03"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Tổng quan (`/[schoolCode]/dashboard`)",
            "screens_table": [
                {"screen": "Dashboard tổng thể (`DashboardView`)", "component": "Bộ 4 thẻ KPI đỉnh trang", "format": "4 Card ngang: Sĩ số & Tỷ lệ chuyên cần (xanh lá), Tiến độ thu học phí (xanh dương), Chấm công nhân sự (tím), Yêu cầu chờ xử lý (cam)", "desc": "Các chỉ số sống còn của trường học.", "note": "BR-DSH-01"},
                {"screen": "Dashboard tổng thể (`DashboardView`)", "component": "Biểu đồ trực quan trung tâm", "format": "Biểu đồ đường chuyên cần 7 ngày gần nhất; Đồng hồ đo tiến độ thu tiền học phí (Circular Gauge)", "desc": "Trực quan hóa xu hướng hoạt động.", "note": "BR-DSH-02"},
                {"screen": "Dashboard tổng thể (`DashboardView`)", "component": "Khối cảnh báo vận hành ưu tiên", "format": "Card cảnh báo viền đỏ/vàng: Học sinh sốt cao, Học sinh vắng không phép > 3 ngày, Hóa đơn nợ quá hạn, Bài viết chờ BGH duyệt", "desc": "Giúp lãnh đạo không bỏ sót việc gấp.", "note": "BR-DSH-03"},
                {"screen": "Dashboard tổng thể (`DashboardView`)", "component": "Thanh lối tắt tác vụ nhanh (Quick Actions)", "format": "Dãy các nút bấm icon: Điểm danh ngay, Gửi thông báo khẩn, Soạn nhật ký lớp, Tạo hóa đơn mới", "desc": "Tiết kiệm 50% thời gian điều hướng.", "note": "Prototype hoàn chỉnh"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-DSH-01",
                "title": "Hiển thị đúng số liệu chuyên cần thực tế hôm nay",
                "scenario": "Given Toàn trường có 1000 học sinh và có 950 em đã check-in sáng\nWhen BGH mở trang Dashboard lúc 08:30\nThen thẻ KPI Chuyên cần hiển thị chính xác con số '950 (95.0%)' trong thời gian tải dưới 500ms."
            },
            {
                "id": "AC-DSH-02",
                "title": "Phân quyền dữ liệu theo vai trò người dùng",
                "scenario": "Given Người dùng đăng nhập với vai trò Giáo viên chủ nhiệm lớp 1A1\nWhen truy cập Dashboard\nThen màn hình chỉ hiển thị số liệu chuyên cần của lớp 1A1 và hoàn toàn ẩn các widget về doanh thu tài chính của trường."
            }
        ],
        "nfr": {
            "performance": "Tải toàn bộ Dashboard dưới 600ms; tối ưu hóa truy vấn tổng hợp SQL có bộ nhớ đệm Redis Cache.",
            "security": "Áp dụng cơ chế phân quyền RBAC nghiêm ngặt đối với dữ liệu tài chính nhạy cảm.",
            "ux": "Layout dạng lưới Responsive thông minh (CSS Grid), tự động co giãn đẹp mắt trên màn hình từ iPad đến màn hình máy tính lớn 27 inch."
        },
        "appendix": {
            "notifications": [
                {"event": "Cảnh báo khẩn cấp đầu giờ", "channel": "Toast đỏ & Âm thanh báo", "recipient": "Ban Giám Hiệu", "content": "Phát hiện học sinh [Tên học sinh] có thân nhiệt cao [38.5]°C tại lớp [Tên lớp]."}
            ],
            "edge_cases": [
                {"condition": "Đầu tháng chưa phát hành hóa đơn học phí", "solution": "Widget tài chính hiển thị thông điệp 'Chưa có kỳ thu nào đang mở' kèm nút gợi ý 'Tạo đợt thu học phí mới'."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 12. M7/SM1 - Khác (System Audit Trail & Tenant Diagnostics)
    # -------------------------------------------------------------------------
    {
        "code": "M7/SM1",
        "name": "M7 - SM1 - Khác",
        "parent_module": "M7",
        "priority": "MEDIUM",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Nhật Ký Kiểm Toán Hệ Thống & Chẩn Đoán Trạng Thái Tenant (System Audit Trail, Diagnostics & Platform Utilities)</strong> thuộc nhóm <strong>M7: Khác</strong> đóng vai trò là 'hộp đen' an ninh và công cụ hỗ trợ vận hành hạ tầng cho toàn bộ nền tảng Portal QLTH (`/[schoolCode]/system/audit`). Phân hệ chịu trách nhiệm ghi lại chi tiết mọi hành vi sửa đổi dữ liệu quan trọng của người dùng (Audit Log: ai đã sửa điểm, ai đã xóa hóa đơn, ai đã mở khóa sổ chấm công, địa chỉ IP và thời gian thao tác), đồng thời cung cấp công cụ chẩn đoán trạng thái kết nối máy chủ (Server Health Check), trạng thái các dịch vụ bên thứ ba (Cổng thanh toán VietQR / SePay, Dịch vụ gửi tin nhắn Zalo ZNS / SMS Brandname, Dịch vụ Hóa đơn điện tử SInvoice Viettel, Hệ thống trí tuệ nhân tạo AI Recognition), tài liệu hướng dẫn sử dụng và kênh yêu cầu hỗ trợ kỹ thuật trực tiếp tới đội ngũ kỹ sư Finviet.",
            "goals_list": [
                "Ghi nhận nhật ký kiểm toán bất biến (Immutable Audit Trail) cho toàn bộ các hành động nhạy cảm (Sửa điểm số, Xóa hóa đơn, Cập nhật thông tin học sinh, Khóa/mở khóa sổ).",
                "Tìm kiếm và lọc nhật ký kiểm toán chuyên sâu: Lọc theo Người thực hiện (User), Hành động (CREATE, UPDATE, DELETE), Phân hệ (Học phí, Điểm số, Điểm danh) và Dải thời gian.",
                "Bảng chẩn đoán trạng thái hệ sinh thái (System Health Dashboard): Theo dõi độ trễ kết nối API (Ping latency), trạng thái kết nối Ngân hàng, Cổng SMS, Zalo OA và AI Engine.",
                "Trung tâm trợ giúp & Tài liệu hướng dẫn sử dụng (Help & Support Center): Cung cấp video hướng dẫn thao tác, tài liệu PDF và kênh gửi Ticket hỗ trợ tới Finviet Support.",
                "Quản lý thông tin giấy phép và phiên bản phần mềm (License & Version Cockpit): Theo dõi thời hạn bản quyền phần mềm trường học và nhật ký nâng cấp hệ thống (Changelog)."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Giám sát an ninh & điều tra sai phạm", "actions": "Truy cứu trách nhiệm khi có nghi vấn sửa điểm học sinh hoặc thất thoát tiền học phí qua nhật ký thao tác."},
                {"group": "Quản trị viên kỹ thuật (IT Admin)", "role": "Chẩn đoán sự cố kết nối", "actions": "Kiểm tra xem dịch vụ tin nhắn SMS hay cổng VietQR có đang bị gián đoạn hay không."},
                {"group": "Đội ngũ Finviet Customer Support & DevOps", "role": "Hỗ trợ khách hàng từ xa", "actions": "Xem log lỗi hệ thống của trường để khắc phục sự cố kỹ thuật kịp thời."}
            ],
            "glossary": [
                {"term": "Audit Trail (Vết kiểm toán)", "definition": "Bản ghi tuần tự về thời gian và các hành động đã diễn ra trong hệ thống, phục vụ công tác thanh tra và chứng thực pháp lý."},
                {"term": "Hành vi nhạy cảm", "definition": "Các thao tác có nguy cơ gây sai lệch hồ sơ sư phạm hoặc thất thoát tài chính (sửa điểm, xóa phiếu thu, đổi thông tin tài khoản ngân hàng)."},
                {"term": "Health Check", "definition": "Cơ chế kiểm tra tự động xem một dịch vụ phần mềm hoặc máy chủ có đang hoạt động bình thường hay không."}
            ]
        },
        "business": {
            "flow_desc": "Mọi thao tác quan trọng trên hệ thống đều tự động kích hoạt Middleware ghi log; Admin có thể tra cứu lịch sử thay đổi hoặc kiểm tra tình trạng kết nối các dịch vụ trong M7/SM1.",
            "flow_steps": [
                {"actor": "Người dùng", "action": "Thực hiện thao tác nhạy cảm", "desc": "Giáo viên sửa điểm thi giữa kỳ của học sinh từ 7.0 lên 8.0."},
                {"actor": "Hệ thống BE Middleware", "action": "Ghi nhận Audit Log", "desc": "Bắt trọn gói tin: User ID, Action: UPDATE_SCORE, Old: 7.0, New: 8.0, IP: 14.161.x.x, Timestamp: 14:30:22."},
                {"actor": "Hệ thống BE", "action": "Lưu trữ bất biến", "desc": "Ghi bản ghi vào CSDL kiểm toán chuyên biệt (Write-once, Append-only)."},
                {"actor": "BGH / IT Admin", "action": "Tra cứu khi có khiếu nại", "desc": "Mở M7/SM1, lọc theo mã học sinh để xem toàn bộ lịch sử ai đã sửa điểm và vào thời điểm nào."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Truy cập Trung tâm tiện ích): IT Admin hoặc BGH mở phân hệ Khác (`/[schoolCode]/system/audit`). Màn hình hiển thị 3 tab chính: Nhật ký kiểm toán (Audit Trail), Trạng thái hệ thống (Health Check) và Hỗ trợ kỹ thuật.",
                "Giai đoạn 2 (Tra cứu vết kiểm toán chi tiết): Bảng Audit Log hiển thị: Thời gian, Tài khoản thực hiện, Địa chỉ IP, Phân hệ, Hành động, Đối tượng tác động và Nút 'Xem chi tiết thay đổi (Diff)' so sánh dữ liệu trước và sau khi sửa.",
                "Giai đoạn 3 (Chẩn đoán kết nối dịch vụ): Tab Health Check hiển thị đèn tín hiệu xanh/đỏ của 5 dịch vụ: CSDL MySQL (Bình thường - 5ms), Redis Cache (Bình thường - 2ms), VietQR Gateway (Hoạt động), Zalo ZNS (Hoạt động), AI Engine (Sẵn sàng).",
                "Giai đoạn 4 (Gửi yêu cầu hỗ trợ tới Finviet): Nếu trường gặp trục trặc kỹ thuật, Admin bấm 'Tạo yêu cầu hỗ trợ', nhập mô tả lỗi và đính kèm ảnh chụp màn hình gửi trực tiếp tới đội ngũ kỹ thuật Finviet.",
                "Giai đoạn 5 (Kiểm tra giấy phép bản quyền): Xem thông tin gói dịch vụ trường đang sử dụng, thời hạn bản quyền và danh sách các tính năng được phép dùng."
            ],
            "rules": [
                {"id": "BR-AUD-01", "title": "Bất biến của nhật ký kiểm toán (Immutability)", "desc": "Bản ghi Audit Log chỉ được phép ghi thêm (Append-only); tuyệt đối KHÔNG có bất kỳ tài khoản nào (kể cả Super Admin) được phép sửa hoặc xóa dữ liệu kiểm toán."},
                {"id": "BR-AUD-02", "title": "Ghi nhận chi tiết Diff trước và sau khi sửa", "desc": "Đối với các hành động Cập nhật (UPDATE), bắt buộc phải lưu trữ cả giá trị cũ (Old value) và giá trị mới (New value) dưới dạng định dạng JSON để đối soát."},
                {"id": "BR-AUD-03", "title": "Thời gian lưu trữ nhật ký tối thiểu 5 năm", "desc": "Dữ liệu kiểm toán an ninh phải được lưu giữ tối thiểu 5 năm theo quy định của Luật An ninh mạng và chuẩn kiểm toán tài chính giáo dục."}
            ],
            "data_entities": [
                {"field": "audit_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính bản ghi kiểm toán."},
                {"field": "actor_id", "type": "UUID", "required": "Bắt buộc", "desc": "Tài khoản thực hiện thao tác."},
                {"field": "action_type", "type": "Enum", "required": "Bắt buộc", "desc": "Loại hành động: 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'LOCK', 'UNLOCK'."},
                {"field": "module_name", "type": "String (50)", "required": "Bắt buộc", "desc": "Phân hệ phát sinh: 'Scoreboard', 'Invoices', 'Attendance', 'Accounts'..."},
                {"field": "target_entity_id", "type": "String (100)", "required": "Bắt buộc", "desc": "ID của đối tượng bị thay đổi (Mã hóa đơn, Mã học sinh...)."},
                {"field": "old_data", "type": "JSON", "required": "Tùy chọn", "desc": "Dữ liệu trạng thái cũ trước khi thay đổi."},
                {"field": "new_data", "type": "JSON", "required": "Tùy chọn", "desc": "Dữ liệu trạng thái mới sau khi thay đổi."},
                {"field": "ip_address", "type": "String (45)", "required": "Bắt buộc", "desc": "Địa chỉ IP người dùng thực hiện."},
                {"field": "created_at", "type": "Timestamp", "required": "Bắt buộc", "desc": "Thời điểm chính xác ghi nhận thao tác."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-024 Khác Kiểm toán & Tiện ích", "feature": "Nhật ký kiểm toán hệ thống bất biến (Audit Trail)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem ai đã sửa điểm hoặc xóa hóa đơn để làm rõ trách nhiệm.", "jira": "AUD-001"},
                {"epic": "E-024 Khác Kiểm toán & Tiện ích", "feature": "Bảng chẩn đoán trạng thái hệ sinh thái (Health Check)", "platform": "Portal Web", "priority": "P2", "story": "Là IT Admin, tôi muốn kiểm tra xem kết nối ngân hàng VietQR và Zalo có thông suốt không.", "jira": "AUD-002"},
                {"epic": "E-024 Khác Kiểm toán & Tiện ích", "feature": "Trung tâm trợ giúp & Quản lý bản quyền phần mềm", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn gửi yêu cầu hỗ trợ tới Finviet và xem thời hạn bản quyền của trường.", "jira": "AUD-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-AUD-01",
                    "name": "Tra cứu lịch sử sửa đổi hóa đơn học phí",
                    "desc": "Kế toán trưởng kiểm tra ai đã hủy hóa đơn học phí.",
                    "actor": "Kế toán trưởng / BGH",
                    "trigger": "Phát hiện một hóa đơn học phí bị hủy bất thường.",
                    "pre": "Hóa đơn đã bị thao tác hủy trước đó.",
                    "happy_path": [
                        "1. Kế toán mở M7/SM1 mục Nhật ký kiểm toán.",
                        "2. Nhập mã hóa đơn 'HD-2026-00145' vào ô tìm kiếm.",
                        "3. Bảng hiển thị 1 dòng ghi nhận: Hành động 'DELETE', Người thực hiện: 'Nguyễn Văn Kế Toán', Thời gian: '10:15 ngày 25/10', IP: '118.69.12.5'.",
                        "4. Bấm 'Xem chi tiết', hiển thị lý do nhập khi hủy: 'Phụ huynh xin bảo lưu kỳ này'.",
                        "5. Kế toán trưởng đối soát và xác nhận thao tác hủy là chính xác."
                    ],
                    "exceptions": [
                        {"case": "Không tìm thấy vết thao tác", "handling": "Hệ thống xác nhận hóa đơn chưa từng bị can thiệp trên hệ thống."}
                    ],
                    "post": "Sự việc được làm sáng tỏ nhanh chóng và minh bạch.",
                    "rules": ["BR-AUD-01", "BR-AUD-02"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Khác -> Nhật ký & Tiện ích (`/[schoolCode]/system/audit`)",
            "screens_table": [
                {"screen": "Nhật ký kiểm toán (`AuditTrailView`)", "component": "Bảng nhật ký kiểm toán hệ thống", "format": "Bộ lọc nâng cao (Người dùng, Hành động, Phân hệ, Ngày tháng); Table gồm: Thời gian, Người thực hiện (kèm Avatar, Role), Hành động (Badge màu), Phân hệ, Đối tượng, IP, Nút 'Xem Diff'", "desc": "Nơi tra cứu mọi biến động dữ liệu.", "note": "BR-AUD-01, BR-AUD-02"},
                {"screen": "Chẩn đoán hệ thống (`SystemHealthView`)", "component": "Bảng đèn báo trạng thái dịch vụ", "format": "Lưới các thẻ dịch vụ: Cơ sở dữ liệu (Xanh), Redis Cache (Xanh), VietQR API (Xanh), Zalo ZNS Gateway (Xanh), Viettel SInvoice (Vàng cam - Độ trễ cao), AI Face Recognition (Xanh)", "desc": "Giám sát sức khỏe hạ tầng thời gian thực.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Modal so sánh dữ liệu (`AuditDiffModal`)", "component": "Hộp thoại hiển thị biến động dữ liệu (Diff Viewer)", "format": "2 Cột so sánh song song: Giá trị cũ (Old Value - tô đỏ) và Giá trị mới (New Value - tô xanh lá)", "desc": "Xem chi tiết chính xác trường dữ liệu nào bị thay đổi.", "note": "BR-AUD-02"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-AUD-01",
                "title": "Ghi nhận tức thì hành động cập nhật điểm số vào Audit Trail",
                "scenario": "Given Giáo viên thực hiện sửa một đầu điểm trong phân hệ M3/SM3\nWhen thao tác lưu điểm thành công\nThen một bản ghi mới lập tức xuất hiện trong bảng Nhật ký kiểm toán ghi rõ tài khoản giáo viên, điểm cũ, điểm mới và địa chỉ IP."
            },
            {
                "id": "AC-AUD-02",
                "title": "Bảo vệ bất biến không thể xóa bản ghi kiểm toán",
                "scenario": "Given Người dùng có tài khoản Super Admin truy cập bảng Audit Log\nWhen quan sát giao diện và gọi thử API xóa bản ghi\nThen hệ thống không cung cấp nút xóa trên giao diện và API trả về lỗi 403 Forbidden 'Audit records are immutable'."
            }
        ],
        "nfr": {
            "performance": "Ghi nhận log kiểm toán bất đồng bộ không làm tăng độ trễ của API chính quá 5ms.",
            "security": "Dữ liệu kiểm toán được lưu trữ trên vùng nhớ an toàn, mã hóa sao lưu định kỳ hàng ngày.",
            "ux": "Giao diện Diff Viewer trực quan, tô màu rõ ràng các ký tự bị thay đổi."
        },
        "appendix": {
            "notifications": [
                {"event": "Cảnh báo bảo mật hệ thống", "channel": "Email & In-app Alert", "recipient": "Ban Giám Hiệu & IT Admin", "content": "Phát hiện đăng nhập bất thường từ địa chỉ IP lạ đối với tài khoản Quản trị viên [Tên tài khoản]."}
            ],
            "edge_cases": [
                {"condition": "Mất kết nối Internet tạm thời tại cổng trường", "solution": "Các dịch vụ cục bộ lưu vết log tạm vào hàng đợi SQLite trên máy trạm và tự động đẩy lên máy chủ khi có mạng trở lại."}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"Milestone 3 Part 2 defined successfully with {len(PART2_PRDS)} modules!")
    for p in PART2_PRDS:
        print(f"  - [{p['code']}] {p['name']}")
