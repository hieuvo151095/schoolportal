# -*- coding: utf-8 -*-
"""
Milestone 2 Sub-modules Part 1 (Comprehensive v2 Standard)
Covers 5 sub-modules:
  1. M5/SM9 - M5 - SM9 - Điểm danh NV
  2. M6/SM4 - M6 - SM4 - Nhận diện (AI Facial Recognition Config)
  3. M6/SM5 - M6 - SM5 - Tính năng (Tenant Feature Flags & Semester Activation)
  4. M2/SM1 - M2 - SM1 - Điểm danh (Student Daily Attendance & Pickup)
  5. M2/SM2 - M2 - SM2 - Hoạt động (Class Activities & Moderation)
"""

PART1_PRDS = [
    # -------------------------------------------------------------------------
    # 1. M5/SM9 - Điểm danh NV
    # -------------------------------------------------------------------------
    {
        "code": "M5/SM9",
        "name": "M5 - SM9 - Điểm danh NV",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Chấm công & Điểm danh nhân viên (Staff Attendance Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm quản lý toàn diện thời gian làm việc hàng ngày của cán bộ quản lý, giáo viên, nhân viên nhà bếp, bảo vệ và tài xế xe buýt. Hệ thống số hóa sổ chấm công truyền thống, liên kết chặt chẽ với Cấu hình trường (M6/SM1) và phân hệ Quản lý tài khoản (M6/SM2), đồng thời tuân thủ các quy định về thời giờ làm việc theo Bộ luật Lao động Việt Nam và Nghị định 145/2020/NĐ-CP.",
            "goals_list": [
                "Cung cấp giao diện bảng tổng hợp chấm công thời gian thực theo từng ngày và từng tổ bộ môn.",
                "Hỗ trợ cơ chế điểm danh tức thì (Optimistic UI) với độ trễ < 50ms, tự động lưu ngầm và xử lý đồng bộ bất đồng bộ.",
                "Ghi nhận chi tiết trạng thái đi làm: Đúng giờ, Đi muộn, Về sớm, Nghỉ có phép (kèm lý do và số quyết định), Nghỉ không phép.",
                "Hỗ trợ điểm danh hàng loạt một chạm ('Điểm danh tất cả') và thiết lập giờ đến/về mặc định theo ca làm việc.",
                "Xuất bảng tổng hợp công tháng (Timesheet) chuẩn định dạng Excel phục vụ kế toán tính lương và thưởng chuyên cần."
            ],
            "target_users": [
                {"group": "Cán bộ Nhân sự (HR)", "role": "Điểm danh hàng ngày & duyệt nghỉ phép", "actions": "Mở bảng chấm công ngày, ghi nhận trạng thái nhân sự, duyệt đơn nghỉ phép và kiểm tra giờ check-in."},
                {"group": "Ban Giám Hiệu (BGH)", "role": "Giám sát kỷ luật & phê duyệt bảng công", "actions": "Xem tỷ lệ đi làm theo tổ bộ môn, phê duyệt mở khóa sổ chấm công tháng quá khứ và duyệt báo cáo chuyên cần."},
                {"group": "Kế toán tiền lương", "role": "Khai thác dữ liệu tính lương", "actions": "Xuất dữ liệu chấm công tháng, đối soát số ngày công chuẩn và tính giảm trừ do nghỉ không phép."}
            ],
            "glossary": [
                {"term": "Optimistic UI", "definition": "Kỹ thuật cập nhật trạng thái chấm công trên giao diện ngay khi người dùng thao tác và gửi request ngầm xuống API, tự động hoàn tác (rollback) nếu có lỗi mạng."},
                {"term": "Công chuẩn", "definition": "Số ngày làm việc quy định trong tháng (thường là 22 đến 26 ngày tùy theo cấp học và quy chế nhà trường)."},
                {"term": "Nghỉ có phép", "definition": "Trường hợp nhân viên gửi đơn xin nghỉ được BGH phê duyệt trước giờ làm việc, được hưởng nguyên lương hoặc chế độ BHXH theo quy định."},
                {"term": "Khóa sổ chấm công", "definition": "Thao tác chốt dữ liệu công vào ngày cuối tháng, ngăn chặn sửa đổi tùy tiện nếu không có quyền Admin cấp cao."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình chấm công bắt đầu từ việc nhân viên check-in tại cổng hoặc HR điểm danh tập trung trên Portal, hệ thống tự động đối chiếu ca làm việc, tổng hợp vào bảng công ngày và kết xuất dữ liệu tính lương cuối kỳ.",
            "flow_steps": [
                {"actor": "Nhân viên / Giáo viên", "action": "Check-in tại trường", "desc": "Nhân viên quét khuôn mặt tại camera AI cổng trường hoặc quẹt thẻ từ khi đến làm việc."},
                {"actor": "Cán bộ Nhân sự", "action": "Kiểm tra & Điểm danh nhanh", "desc": "Mở phân hệ M5/SM9, rà soát danh sách nhân sự theo tổ bộ môn, bấm 'Điểm danh tất cả' hoặc chuyển trạng thái từng người."},
                {"actor": "Hệ thống BE", "action": "Tính toán trạng thái công", "desc": "So khớp thời gian check-in với khung giờ quy định (ví dụ 07:30); nếu quá giờ tự động đánh dấu 'Đi muộn' kèm số phút trễ."},
                {"actor": "Cán bộ Nhân sự", "action": "Cập nhật lý do vắng", "desc": "Nhấp vào nhân sự vắng mặt để gắn trạng thái 'Có phép' (chọn lý do: Ốm đau, Thai sản, Việc riêng) hoặc 'Không phép'."},
                {"actor": "Kế toán / BGH", "action": "Chốt công & Xuất báo cáo", "desc": "Kiểm tra tổng công toàn trường cuối tháng, bấm khóa sổ và xuất file bảng chấm công Excel."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Đầu ca làm việc): Cán bộ nhân sự truy cập phân hệ 'Nhà trường -> Điểm danh NV' trên Portal QLTH, chọn ngày làm việc cần chấm công.",
                "Giai đoạn 2 (Ghi nhận hiện diện): Màn hình hiển thị danh sách toàn bộ cán bộ giáo viên kèm 4 thẻ KPI tổng quan (Tổng số NV, Có mặt, Đi muộn, Vắng mặt). HR có thể bấm nút 'Điểm danh tất cả' để đánh dấu toàn bộ nhân sự đang chọn là có mặt đúng giờ.",
                "Giai đoạn 3 (Xử lý ngoại lệ & Nghỉ phép): Đối với những trường hợp vắng hoặc đi muộn, HR nhấp nút tương ứng. Nếu vắng, modal 'Ghi nhận nghỉ phép' hiển thị cho phép chọn hình thức nghỉ, nhập số văn bản xin phép và đính kèm ghi chú.",
                "Giai đoạn 4 (Lưu trữ & Đồng bộ): Cơ chế Redux Toolkit + Optimistic UI cập nhật tức thì màn hình, đẩy payload JSON xuống API backend. Nếu có lỗi mạng, hiển thị thông báo lỗi và hoàn tác trạng thái.",
                "Giai đoạn 5 (Tổng kết & Xuất dữ liệu): Ban Giám hiệu hoặc Kế toán xem biểu đồ chuyên cần theo tổ, chọn khoảng thời gian và nhấn 'Xuất báo cáo Excel' chuẩn bảng công Bộ GD&ĐT."
            ],
            "rules": [
                {"id": "BR-DDNV-01", "title": "Cơ chế phản hồi tức thì (Optimistic UI)", "desc": "Khi người dùng click đổi trạng thái chấm công, UI phải cập nhật ngay trong vòng < 50ms và phát tín hiệu lưu nền. Khi API phản hồi lỗi (HTTP 4xx/5xx), hệ thống lập tức rollback trạng thái cũ và hiển thị thông báo lỗi rõ ràng."},
                {"id": "BR-DDNV-02", "title": "Quy tắc xác định Đi muộn & Về sớm", "desc": "Thời gian check-in sau giờ bắt đầu ca làm việc (cấu hình tại M6/SM1) từ 1 phút trở lên tự động tính là 'Đi muộn' và ghi nhận số phút muộn. Tương tự, check-out trước giờ tan làm tính là 'Về sớm'."},
                {"id": "BR-DDNV-03", "title": "Bảo vệ dữ liệu chấm công đã khóa sổ", "desc": "Bảng chấm công của các tháng đã kết chuyển và khóa sổ tính lương không được chỉnh sửa trực tiếp. Mọi thao tác sửa chữa bắt buộc phải có tài khoản Ban Giám Hiệu mở khóa và lưu vết nhật ký sửa đổi (Audit Trail)."},
                {"id": "BR-DDNV-04", "title": "Phân loại chế độ nghỉ phép", "desc": "Nghỉ có phép hợp lệ phải có đơn được phê duyệt hoặc minh chứng ốm đau có xác nhận của cơ sở y tế. Trường hợp không minh chứng bị tính là 'Nghỉ không phép' và tự động trừ lương tương ứng."},
                {"id": "BR-DDNV-05", "title": "Lọc theo tổ bộ môn và chức danh", "desc": "Giao diện phải hỗ trợ lọc danh sách nhân viên theo: Ban Giám Hiệu, Tổ chuyên môn (Toán, Văn, Anh...), Nhân viên hành chính, Nhân viên phục vụ/bếp/bảo vệ."}
            ],
            "data_entities": [
                {"field": "staff_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa ngoại tham chiếu đến cán bộ nhân sự trong phân hệ M5/SM2."},
                {"field": "attendance_date", "type": "Date (YYYY-MM-DD)", "required": "Bắt buộc", "desc": "Ngày chấm công làm việc."},
                {"field": "status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái hiện diện: 'present' (Đúng giờ), 'late' (Đi muộn), 'early_leave' (Về sớm), 'excused_absence' (Nghỉ có phép), 'unexcused_absence' (Nghỉ không phép)."},
                {"field": "check_in_time", "type": "Time (HH:mm:ss)", "required": "Tùy chọn", "desc": "Thời điểm nhân viên check-in thực tế tại cổng hoặc được ghi nhận."},
                {"field": "check_out_time", "type": "Time (HH:mm:ss)", "required": "Tùy chọn", "desc": "Thời điểm nhân viên check-out ra về."},
                {"field": "late_minutes", "type": "Integer", "required": "Tùy chọn", "desc": "Số phút đi muộn so với khung giờ bắt đầu ca."},
                {"field": "leave_reason", "type": "String (255)", "required": "Tùy chọn", "desc": "Lý do nghỉ phép (Ốm, Việc riêng, Công tác...)."},
                {"field": "recorded_by", "type": "UUID", "required": "Bắt buộc", "desc": "Tài khoản thực hiện chấm công (HR hoặc Admin)."},
                {"field": "is_locked", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ đánh dấu tháng chấm công đã được khóa sổ hay chưa."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-027 Điểm danh nhân viên", "feature": "Bảng chấm công hàng ngày", "platform": "Portal Web", "priority": "P1", "story": "Là cán bộ nhân sự, tôi muốn mở bảng chấm công ngày để ghi nhận nhanh trạng thái đi làm của toàn thể giáo viên và nhân viên trường.", "jira": "DDNV-001"},
                {"epic": "E-027 Điểm danh nhân viên", "feature": "Điểm danh hàng loạt một chạm", "platform": "Portal Web", "priority": "P1", "story": "Là cán bộ nhân sự, tôi muốn bấm 'Điểm danh tất cả' để tự động đánh dấu toàn bộ nhân viên có mặt nhằm tiết kiệm thời gian.", "jira": "DDNV-002"},
                {"epic": "E-027 Điểm danh nhân viên", "feature": "Modal ghi nhận nghỉ phép & đính kèm minh chứng", "platform": "Portal Web", "priority": "P1", "story": "Là cán bộ nhân sự, tôi muốn cập nhật lý do xin nghỉ phép cho giáo viên có đơn xin phép.", "jira": "DDNV-003"},
                {"epic": "E-027 Điểm danh nhân viên", "feature": "Xuất bảng chấm công tháng Excel", "platform": "Portal Web", "priority": "P2", "story": "Là Kế toán, tôi muốn xuất dữ liệu chấm công cả tháng ra Excel để tính lương.", "jira": "DDNV-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-DDNV-01",
                    "name": "Chấm công nhân viên hàng ngày",
                    "desc": "Cán bộ nhân sự ghi nhận sự hiện diện của nhân viên theo ngày.",
                    "actor": "Cán bộ Nhân sự (HR)",
                    "trigger": "HR truy cập menu 'Nhà trường -> Điểm danh NV' và chọn ngày làm việc.",
                    "pre": "Hệ thống đã có danh mục nhân viên và cấu hình thời gian làm việc.",
                    "happy_path": [
                        "1. HR chọn ngày chấm công (mặc định là ngày hôm nay).",
                        "2. Hệ thống tải danh sách nhân viên kèm trạng thái hiện tại (nếu có dữ liệu từ camera AI) và 4 thẻ KPI.",
                        "3. HR lọc theo tổ bộ môn 'Tổ Toán' hoặc chọn 'Tất cả'.",
                        "4. HR bấm nút 'Có mặt' trên dòng của giáo viên Nguyễn Văn A.",
                        "5. Hệ thống cập nhật trạng thái hiển thị tích xanh và lưu ngầm xuống CSDL qua API.",
                        "6. Thẻ KPI 'Có mặt' tăng thêm 1."
                    ],
                    "exceptions": [
                        {"case": "Mất kết nối mạng khi đang chấm công", "handling": "Hệ thống hiển thị cảnh báo đỏ 'Không thể đồng bộ', khôi phục lại trạng thái trước đó và yêu cầu kiểm tra kết nối."}
                    ],
                    "post": "Dữ liệu chấm công của giáo viên được lưu vào bảng staff_attendance.",
                    "rules": ["BR-DDNV-01", "BR-DDNV-02"]
                },
                {
                    "id": "UC-DDNV-02",
                    "name": "Ghi nhận nghỉ phép cho nhân sự",
                    "desc": "Cập nhật trạng thái vắng mặt kèm lý do và căn cứ phê duyệt.",
                    "actor": "Cán bộ Nhân sự",
                    "trigger": "HR bấm vào nút 'Vắng mặt' trên dòng của nhân viên.",
                    "pre": "Nhân viên chưa được chốt chấm công hoặc cần sửa trạng thái vắng.",
                    "happy_path": [
                        "1. HR bấm nút 'Vắng mặt' hoặc icon chỉnh sửa nghỉ phép.",
                        "2. Modal 'Ghi nhận nghỉ phép cán bộ' xuất hiện.",
                        "3. HR chọn Loại nghỉ: 'Có phép' hoặc 'Không phép'.",
                        "4. Nếu chọn 'Có phép', HR chọn danh mục lý do: 'Ốm đau / Thai sản / Việc gia đình' và nhập số văn bản / ghi chú.",
                        "5. HR bấm 'Xác nhận'.",
                        "6. Hệ thống đóng modal, chuyển trạng thái nhân viên thành badge màu cam (Có phép) hoặc màu đỏ (Không phép)."
                    ],
                    "exceptions": [
                        {"case": "Tháng chấm công đã khóa sổ", "handling": "Hệ thống thông báo lỗi 'Tháng chấm công đã khóa sổ, liên hệ BGH để mở khóa' và vô hiệu hóa nút Lưu."}
                    ],
                    "post": "Trạng thái nghỉ phép được ghi nhận vào hệ thống kèm lý do.",
                    "rules": ["BR-DDNV-03", "BR-DDNV-04"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Nhà trường -> Điểm danh NV (`/[schoolCode]/school/staff-attendance`)",
            "screens_table": [
                {"screen": "Bảng điều khiển chấm công (`StaffAttendanceTable`)", "component": "Thẻ KPI tổng quan (`StaffAttendanceSummaryCards`)", "format": "4 thẻ card ngang: Tổng số NV, Có mặt (xanh lá), Đi muộn (vàng), Vắng mặt (đỏ)", "desc": "Thống kê thời gian thực số lượng và tỷ lệ hiện diện của cán bộ nhân sự trong ngày đã chọn.", "note": "Tự động nhảy số khi đổi trạng thái (Optimistic UI)"},
                {"screen": "Bảng điều khiển chấm công (`StaffAttendanceTable`)", "component": "Thanh công cụ lọc (`StaffAttendanceToolbar`)", "format": "Date Picker, Dropdown Tổ bộ môn, Dropdown Chức vụ, Ô tìm kiếm tên NV, Nút 'Điểm danh tất cả', Nút 'Xuất Excel'", "desc": "Cho phép chuyển ngày, lọc nhanh theo đơn vị chuyên môn và kích hoạt thao tác hàng loạt.", "note": "BR-DDNV-05"},
                {"screen": "Bảng điều khiển chấm công (`StaffAttendanceTable`)", "component": "Bảng danh sách cán bộ (`StaffAttendanceTable`)", "format": "Table gồm: STT, Mã NV, Họ và tên (kèm Avatar), Tổ bộ môn, Giờ đến, Giờ về, Trạng thái (Pill buttons: Có mặt / Muộn / Vắng), Thao tác", "desc": "Bảng tương tác chính cho phép bấm trực tiếp vào các nút trạng thái trên từng dòng.", "note": "BR-DDNV-01"},
                {"screen": "Modal ghi nhận nghỉ phép (`StaffAbsenceModal`)", "component": "Hộp thoại ghi nhận vắng (`StaffAbsenceModal`)", "format": "Radio buttons (Có phép / Không phép), Dropdown Lý do nghỉ, Textarea Ghi chú, Nút 'Xác nhận' & 'Hủy'", "desc": "Modal nhập lý do và chi tiết nghỉ phép khi nhân sự vắng mặt.", "note": "BR-DDNV-04"},
                {"screen": "Modal hồ sơ chi tiết (`StaffProfileModal`)", "component": "Hộp thoại tóm tắt thông tin nhân sự", "format": "Ảnh thẻ, Thông tin liên hệ, Lịch sử chấm công 7 ngày gần nhất", "desc": "Xem nhanh lịch sử đi làm và thời gian check-in của nhân viên khi nhấp vào tên.", "note": "Chỉ đọc"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-DDNV-01",
                "title": "Hiển thị bảng chấm công và KPI theo ngày",
                "scenario": "Given Cán bộ nhân sự truy cập phân hệ Điểm danh NV\nWhen chọn ngày làm việc bất kỳ trên Date Picker\nThen hệ thống tải danh sách toàn bộ cán bộ giáo viên thuộc trường trong ngày đó và cập nhật đúng số liệu trên 4 thẻ KPI (Tổng số, Có mặt, Đi muộn, Vắng mặt) trong thời gian dưới 1 giây."
            },
            {
                "id": "AC-DDNV-02",
                "title": "Điểm danh nhanh một chạm (Optimistic UI)",
                "scenario": "Given Cán bộ nhân sự đang xem danh sách nhân sự chưa điểm danh\nWhen bấm vào nút 'Có mặt' trên dòng của giáo viên Nguyễn Văn A\nThen giao diện đổi sang trạng thái tích xanh ngay lập tức (< 50ms), thẻ KPI 'Có mặt' tăng thêm 1 và hệ thống lưu ngầm dữ liệu xuống backend mà không cần tải lại trang."
            },
            {
                "id": "AC-DDNV-03",
                "title": "Ghi nhận vắng có phép và không phép",
                "scenario": "Given Cán bộ nhân sự mở modal StaffAbsenceModal cho một nhân viên vắng mặt\nWhen chọn 'Nghỉ có phép', chọn lý do 'Ốm đau' và bấm 'Xác nhận'\nThen giao diện hiển thị badge màu cam 'Nghỉ có phép (Ốm đau)', đồng thời hệ thống ghi nhận vào CSDL đúng trường reason và status."
            },
            {
                "id": "AC-DDNV-04",
                "title": "Chặn sửa đổi khi tháng công đã khóa",
                "scenario": "Given Người dùng có vai trò Nhân sự truy cập bảng chấm công của một tháng đã được BGH bấm Khóa sổ\nWhen người dùng cố gắng nhấp đổi trạng thái chấm công của bất kỳ nhân viên nào\nThen hệ thống vô hiệu hóa các nút bấm, hiển thị badge cảnh báo 'Bảng công đã khóa sổ' và ngăn chặn mọi thao tác cập nhật."
            },
            {
                "id": "AC-DDNV-05",
                "title": "Xuất bảng chấm công Excel đầy đủ định dạng",
                "scenario": "Given Người dùng bấm nút 'Xuất Excel' trên thanh công cụ\nWhen chọn khoảng thời gian từ ngày 01 đến ngày 31 của tháng\nThen hệ thống tạo và tải xuống file Excel .xlsx chứa đầy đủ danh sách nhân viên, các ngày trong tháng kèm ký hiệu (X: Có mặt, M: Muộn, P: Có phép, KP: Không phép) và tổng số công chuẩn."
            }
        ],
        "nfr": {
            "performance": "Tải bảng điểm danh 200 nhân viên trong vòng < 600ms; thao tác chuyển trạng thái phản hồi UI < 50ms.",
            "security": "Phân quyền RBAC nghiêm ngặt: chỉ tài khoản có quyền Nhân sự hoặc Ban Giám Hiệu mới được sửa trạng thái; ghi nhận nhật ký thao tác đầy đủ.",
            "ux": "Giao diện tối ưu hóa cho màn hình máy tính bàn và laptop; màu sắc trạng thái chuẩn ECO Design System (Xanh lá #10B981, Vàng cam #F59E0B, Đỏ #EF4444)."
        },
        "appendix": {
            "notifications": [
                {"event": "Điểm danh hoàn tất", "channel": "Toast xanh", "recipient": "Cán bộ nhân sự", "content": "Đã lưu trạng thái chấm công của nhân viên [Họ tên]."},
                {"event": "Lỗi lưu dữ liệu", "channel": "Toast đỏ", "recipient": "Cán bộ nhân sự", "content": "Lỗi kết nối máy chủ! Không thể lưu trạng thái. Đang khôi phục lại..."},
                {"event": "Khóa sổ chấm công tháng", "channel": "In-app Notification", "recipient": "Kế toán, Ban Giám Hiệu", "content": "Bảng chấm công tháng [MM/YYYY] đã được chốt và khóa sổ bởi [Người thực hiện]."}
            ],
            "edge_cases": [
                {"condition": "Mất mạng đột ngột khi đang chấm công nhiều nhân viên liên tiếp", "solution": "Hệ thống kích hoạt cơ chế Retry ngầm 3 lần; nếu thất bại hoàn toàn, thông báo lỗi cho người dùng và hoàn tác lại các thao tác chưa lưu."},
                {"condition": "Nhân viên vừa check-in bằng camera AI vừa được HR điểm danh thủ công", "solution": "Hệ thống ưu tiên ghi nhận giờ check-in thực tế từ camera AI làm mốc xác định đi muộn, trạng thái do HR xác nhận được lưu bổ sung kèm cờ 'HR_verified'."},
                {"condition": "Nhân viên chuyển tổ bộ môn giữa tháng", "solution": "Lịch sử chấm công nửa đầu tháng gắn với tổ cũ, từ ngày có hiệu lực điều chuyển bảng công hiển thị tại tổ mới mà không làm mất dữ liệu cũ."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 2. M6/SM4 - Nhận diện (AI Facial Recognition Configuration)
    # -------------------------------------------------------------------------
    {
        "code": "M6/SM4",
        "name": "M6 - SM4 - Nhận diện",
        "parent_module": "M6",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Cấu hình & Quản lý Nhận diện khuôn mặt AI (AI Facial Recognition Configuration)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> cung cấp bộ công cụ quản trị thông số mô hình AI, quản lý kho dữ liệu vector đặc trưng khuôn mặt (Face Embeddings) của học sinh và nhân viên, quản lý thiết bị camera AI tại cổng và lớp học, đồng thời giám sát tỷ lệ nhận diện thành công trên toàn trường.",
            "goals_list": [
                "Cấu hình ngưỡng tin cậy nhận diện (Confidence Threshold, mặc định 85%) và chế độ nhận diện (Edge vs Cloud).",
                "Quản lý trạng thái dữ liệu mẫu khuôn mặt (Face Enrollment) của từng học sinh: Đã có ảnh chuẩn, Thiếu ảnh, Cần chụp lại.",
                "Cung cấp công cụ quét nhận diện khuôn mặt hàng loạt trên kho ảnh thư viện hoạt động (M2/SM3).",
                "Quản lý danh sách thiết bị Camera AI tại cổng trường, kiểm tra kết nối Heartbeat và gán luồng video vào lớp học tương ứng.",
                "Tuân thủ nghiêm ngặt quy định bảo mật sinh trắc học theo Nghị định 13/2023/NĐ-CP (mã hóa vector 512 chiều, không lưu trữ ảnh thô khi chưa có sự đồng ý của phụ huynh)."
            ],
            "target_users": [
                {"group": "Quản trị viên kỹ thuật (IT Admin)", "role": "Cấu hình thuật toán & thiết bị Camera", "actions": "Thiết lập ngưỡng tin cậy, khai báo địa chỉ RTSP camera cổng, theo dõi nhật ký quét AI."},
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Giám sát tỷ lệ mẫu ảnh học sinh lớp mình", "actions": "Xem danh sách học sinh chưa có ảnh mẫu chuẩn, hỗ trợ phụ huynh tải ảnh khuôn mặt rõ nét."},
                {"group": "Ban Giám Hiệu", "role": "Theo dõi hiệu quả ứng dụng AI", "actions": "Xem dashboard thống kê độ phủ nhận diện (Target: > 80% học sinh toàn trường có thể nhận diện tự động)."}
            ],
            "glossary": [
                {"term": "Face Embedding", "definition": "Véc-tơ số thực đa chiều (thường là 512 chiều) trích xuất từ đặc trưng khuôn mặt người, dùng để so sánh khoảng cách Cosine Similarity mà không cần đối chiếu ảnh gốc."},
                {"term": "Ngưỡng tin cậy (Threshold)", "definition": "Mức độ giống nhau tối thiểu (thường là 0.85 tương đương 85%) để hệ thống xác nhận ảnh chụp khớp với học sinh trong danh bạ."},
                {"term": "Face Enrollment", "definition": "Quá trình đăng ký ảnh khuôn mặt chuẩn ban đầu (chính diện, đủ sáng, không đeo kính râm hoặc khẩu trang) để sinh vector mẫu."},
                {"term": "Edge AI", "definition": "Xử lý nhận diện trực tiếp trên phần cứng camera hoặc máy chủ cục bộ tại trường giúp giảm độ trễ xuống < 200ms."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình bắt đầu từ việc đăng ký ảnh mẫu của học sinh, hệ thống trích xuất vector đặc trưng, camera hoặc album ảnh gửi ảnh chụp thực tế để thuật toán AI đối soát và tự động gắn thẻ (tag) học sinh.",
            "flow_steps": [
                {"actor": "Phụ huynh / GVCN", "action": "Tải ảnh chân dung học sinh", "desc": "Tải ảnh chính diện học sinh lên hồ sơ qua Mobile App hoặc Portal."},
                {"actor": "Hệ thống AI Engine", "action": "Trích xuất & Kiểm định mẫu", "desc": "Kiểm tra chất lượng ảnh (độ sáng, góc nghiêng, kích thước) và trích xuất vector embedding 512 chiều lưu vào Vector DB."},
                {"actor": "Admin Trường", "action": "Thiết lập thông số nhận diện", "desc": "Truy cập M6/SM4, điều chỉnh ngưỡng tin cậy (80% - 95%) và bật tính năng nhận diện cho lớp học."},
                {"actor": "Giáo viên", "action": "Kích hoạt quét ảnh album", "desc": "Trong phân hệ Thư viện (M2/SM3), giáo viên bấm 'Quét nhận diện AI', hệ thống tự động tìm và gắn thẻ học sinh trong ảnh."},
                {"actor": "Admin / BGH", "action": "Giám sát tỷ lệ độ phủ", "desc": "Theo dõi dashboard độ phủ nhận diện học sinh toàn trường (ví dụ: Đạt 78% độ phủ, 12 học sinh cần cập nhật ảnh)."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Thu thập dữ liệu mẫu): Phụ huynh hoặc giáo viên cung cấp từ 1 đến 3 ảnh chân dung rõ mặt của học sinh khi nhập học.",
                "Giai đoạn 2 (Tiền xử lý & Trích xuất đặc trưng): Backend AI thực hiện căn chỉnh khuôn mặt (Face Alignment), kiểm tra độ mờ nhòe (Blur Detection) và sinh vector đặc trưng lưu trữ bảo mật.",
                "Giai đoạn 3 (Quản trị & Cấu hình): Quản trị viên vào Cấu hình -> Nhận diện AI để kiểm tra danh sách học sinh theo lớp, xem trạng thái mẫu ảnh (Đã đạt / Chưa có ảnh / Ảnh chất lượng thấp).",
                "Giai đoạn 4 (Ứng dụng vào vận hành): Thuật toán AI được kích hoạt tự động khi: (1) Điểm danh tại cổng trường qua Camera AI; (2) Tải ảnh hoạt động lên Thư viện media để tự động gắn thẻ học sinh có mặt trong ảnh.",
                "Giai đoạn 5 (Đánh giá & Hiệu chỉnh): Nếu tỷ lệ nhận diện nhầm cao, IT Admin nâng ngưỡng tin cậy từ 85% lên 90%; nếu tỷ lệ bỏ sót cao, hạ ngưỡng xuống 80%."
            ],
            "rules": [
                {"id": "BR-AI-01", "title": "Tiêu chuẩn chất lượng ảnh mẫu (Enrollment)", "desc": "Ảnh đăng ký mẫu phải có độ phân giải tối thiểu 640x480px, khuôn mặt chiếm tối thiểu 20% khung hình, góc quay không quá 15 độ, không nhòe và không bị che khuất mắt."},
                {"id": "BR-AI-02", "title": "Bảo mật & Mã hóa dữ liệu sinh trắc học", "desc": "Hệ thống chỉ lưu trữ chuỗi vector nhị phân/số thực (Embedding) đã được băm mã hóa một chiều. Không lưu trữ ảnh gốc nếu không có sự đồng ý bằng văn bản của phụ huynh theo Nghị định 13/2023/NĐ-CP."},
                {"id": "BR-AI-03", "title": "Ngưỡng tin cậy nhận diện (Matching Threshold)", "desc": "Hệ thống mặc định ngưỡng tin cậy là 85% (Cosine distance <= 0.15). Các kết quả dưới 85% sẽ bị loại bỏ hoặc đưa vào hàng đợi xác nhận thủ công."},
                {"id": "BR-AI-04", "title": "Chỉ định tối đa số học sinh nhận diện trong 1 ảnh", "desc": "Mỗi ảnh tải lên trong album thư viện được quét và nhận diện tối đa 15 khuôn mặt đồng thời để tối ưu hóa thời gian xử lý và tránh quá tải CPU/GPU."},
                {"id": "BR-AI-05", "title": "Cơ chế gắn thẻ tự động và xác nhận của giáo viên", "desc": "Khi ảnh được AI tự động gắn thẻ, giáo viên có quyền nhấn xóa thẻ nếu AI nhận diện sai hoặc gắn thêm học sinh bị bỏ sót."}
            ],
            "data_entities": [
                {"field": "student_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa ngoại tham chiếu học sinh trong M5/SM1."},
                {"field": "face_vector", "type": "Binary / Array[512]", "required": "Bắt buộc", "desc": "Vector đặc trưng khuôn mặt 512 chiều được mã hóa."},
                {"field": "enrollment_status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái mẫu: 'enrolled' (Đã đăng ký), 'pending' (Chờ duyệt), 'rejected' (Không đạt chất lượng), 'missing' (Chưa có ảnh)."},
                {"field": "sample_photo_url", "type": "String (URL)", "required": "Tùy chọn", "desc": "Đường dẫn ảnh mẫu đại diện trong hệ thống lưu trữ đám mây."},
                {"field": "confidence_score", "type": "Decimal (0.00-1.00)", "required": "Tùy chọn", "desc": "Điểm tin cậy của lần quét nhận diện gần nhất."},
                {"field": "last_scanned_at", "type": "Timestamp", "required": "Tùy chọn", "desc": "Thời điểm nhận diện thành công gần nhất."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-028 Cấu hình Nhận diện AI", "feature": "Dashboard theo dõi độ phủ nhận diện toàn trường", "platform": "Portal Web", "priority": "P1", "story": "Là Ban Giám Hiệu, tôi muốn xem tỷ lệ phần trăm học sinh đã có ảnh nhận diện đạt chuẩn để đôn đốc các lớp hoàn thiện.", "jira": "AI-001"},
                {"epic": "E-028 Cấu hình Nhận diện AI", "feature": "Quản lý mẫu ảnh học sinh theo lớp", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem danh sách học sinh lớp mình và trạng thái mẫu ảnh của từng em.", "jira": "AI-002"},
                {"epic": "E-028 Cấu hình Nhận diện AI", "feature": "Cấu hình thông số thuật toán & camera", "platform": "Portal Web", "priority": "P2", "story": "Là IT Admin, tôi muốn cấu hình ngưỡng tin cậy nhận diện và khai báo luồng camera RTSP.", "jira": "AI-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-AI-01",
                    "name": "Giám sát & Quét nhận diện tự động cho album ảnh",
                    "desc": "Kích hoạt mô hình AI quét toàn bộ ảnh trong album và tự động gán nhãn học sinh.",
                    "actor": "Giáo viên chủ nhiệm / Admin",
                    "trigger": "Người dùng mở album ảnh trong Thư viện (M2/SM3) và bấm 'Nhận diện AI'.",
                    "pre": "Đã có kho dữ liệu vector khuôn mặt của học sinh trong lớp.",
                    "happy_path": [
                        "1. Người dùng bấm nút 'Nhận diện AI' trên thanh công cụ Thư viện.",
                        "2. Modal FaceRecognitionModal hiển thị tỷ lệ phủ hiện tại (ví dụ 78% lớp 1A1).",
                        "3. Người dùng bấm nút 'Bắt đầu quét AI'.",
                        "4. Hệ thống gửi task nhận diện xuống backend xử lý song song các ảnh trong album.",
                        "5. Thanh tiến trình hiển thị tỷ lệ hoàn thành (0% -> 100%).",
                        "6. Khi hoàn tất, hệ thống tự động gán thẻ (tag) học sinh vào từng ảnh tương ứng và cập nhật số lượng ảnh có mặt của mỗi em."
                    ],
                    "exceptions": [
                        {"case": "Ảnh có chất lượng quá thấp không tìm thấy khuôn mặt", "handling": "Hệ thống ghi nhận trạng thái bỏ qua ảnh đó và chuyển sang ảnh tiếp theo, xuất thông báo tóm tắt cuối quá trình."}
                    ],
                    "post": "Tất cả ảnh nhận diện được học sinh đều được gắn thẻ tự động.",
                    "rules": ["BR-AI-03", "BR-AI-04", "BR-AI-05"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Cấu hình -> Nhận diện (`/[schoolCode]/setting/ai-recognition`) và Modal trong Thư viện",
            "screens_table": [
                {"screen": "Màn hình cấu hình AI (`SettingAIRecognitionView`)", "component": "Card điều chỉnh ngưỡng tin cậy", "format": "Slider điều chỉnh từ 70% đến 98% (Mặc định 85%), Switch kích hoạt nhận diện tự động", "desc": "Cho phép Admin tinh chỉnh độ nhạy của thuật toán so khớp khuôn mặt.", "note": "BR-AI-03"},
                {"screen": "Màn hình cấu hình AI (`SettingAIRecognitionView`)", "component": "Bảng tiến độ mẫu ảnh theo lớp", "format": "Table gồm: Tên lớp, Khối, Sĩ số, Đã có mẫu (kèm thanh progress xanh lá), Chưa có mẫu, Thao tác", "desc": "Theo dõi tiến độ nạp dữ liệu nhận diện của từng lớp học trong trường.", "note": "Độ phủ mục tiêu > 80%"},
                {"screen": "Modal Nhận diện AI trong Thư viện (`FaceRecognitionModal`)", "component": "Dashboard phân tích nhận diện lớp học", "format": "Vòng tròn phần trăm độ phủ (Circular Gauge), Bảng thống kê chi tiết theo học sinh (Ảnh thẻ, Tên, Số ảnh được tag, Trạng thái), Nút 'Bắt đầu quét AI'", "desc": "Cung cấp cái nhìn trực quan về mức độ nhận diện của học sinh trong lớp.", "note": "Đã triển khai trong prototype"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-AI-01",
                "title": "Hiển thị tỷ lệ độ phủ nhận diện của lớp",
                "scenario": "Given Người dùng mở modal FaceRecognitionModal tại lớp 1A1\nWhen dữ liệu tải xong\nThen hệ thống hiển thị chính xác tỷ lệ học sinh có mẫu ảnh hợp lệ (ví dụ: 78%) cùng danh sách học sinh và số lượng ảnh đã được gắn thẻ tương ứng."
            },
            {
                "id": "AC-AI-02",
                "title": "Quét nhận diện tự động khi tải ảnh album",
                "scenario": "Given Giáo viên tải lên 5 bức ảnh chụp tập thể lớp 1A1 trong Thư viện\nWhen bấm 'Bắt đầu quét AI'\nThen hệ thống phát hiện khuôn mặt của học sinh trong ảnh với độ tin cậy >= 85% và tự động gắn thẻ tên học sinh vào từng ảnh tương ứng."
            },
            {
                "id": "AC-AI-03",
                "title": "Cho phép giáo viên hiệu chỉnh thủ công thẻ gắn",
                "scenario": "Given Một bức ảnh được AI gắn thẻ nhầm học sinh Trần Văn B\nWhen giáo viên bấm vào icon 'X' trên badge tên học sinh\nThen hệ thống xóa thẻ học sinh đó khỏi ảnh và lưu lại mà không cần quét lại toàn bộ album."
            }
        ],
        "nfr": {
            "performance": "Thời gian xử lý nhận diện 1 ảnh chứa tối đa 15 khuôn mặt không quá 1.5 giây.",
            "security": "Dữ liệu vector khuôn mặt được mã hóa AES-256 trong CSDL, không cho phép export raw vector qua API công khai.",
            "ux": "Hiển thị thanh tiến trình trực quan khi quét nhận diện album lớn để người dùng nắm rõ tiến độ."
        },
        "appendix": {
            "notifications": [
                {"event": "Quét album hoàn tất", "channel": "Toast xanh", "recipient": "Giáo viên", "content": "Đã hoàn thành quét nhận diện AI cho [N] ảnh trong album [Tên album]."},
                {"event": "Cảnh báo ảnh chưa đạt", "channel": "In-app Alert", "recipient": "GVCN", "content": "Học sinh [Họ tên] có ảnh mẫu chất lượng thấp, vui lòng cập nhật lại."}
            ],
            "edge_cases": [
                {"condition": "Học sinh đeo khẩu trang y tế hoặc kính râm khi chụp ảnh", "solution": "Hệ thống từ chối đăng ký mẫu và thông báo 'Khuôn mặt bị che khuất, vui lòng chụp lại'."},
                {"condition": "Hai học sinh sinh đôi cùng trứng trong cùng một lớp", "solution": "Hệ thống cảnh báo độ tương đồng vượt ngưỡng phân biệt, yêu cầu giáo viên xác nhận thủ công khi điểm danh."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 3. M6/SM5 - Tính năng (Tenant Feature Flags & Semester Activation)
    # -------------------------------------------------------------------------
    {
        "code": "M6/SM5",
        "name": "M6 - SM5 - Tính năng",
        "parent_module": "M6",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Quản lý Tính năng & Bật tắt phân hệ theo Trường (Feature Toggles & Tenant Module Control)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> cung cấp khả năng tùy biến linh hoạt mô hình hoạt động cho từng trường học (Tenant) trong nền tảng Multi-tenant. Do các trường có quy mô và cấp học khác nhau (Mầm non, Tiểu học, THCS, THPT hoặc trường Quốc tế liên cấp), hệ thống cho phép bật/tắt động từng phân hệ chức năng (Điểm danh đón hộ, Thực đơn ăn bán trú, Quản lý điểm số, Hóa đơn điện tử, Nhận diện AI...) mà không cần sửa đổi mã nguồn.",
            "goals_list": [
                "Cung cấp ma trận chuyển mạch (Feature Switches) trực quan cho từng trường học dựa trên mã định danh trường (`schoolCode`).",
                "Quản lý vòng đời kích hoạt tính năng theo cấp học: Ví dụ Mầm non bật 'Đón hộ trẻ & Thực đơn', cấp 2-3 bật 'Sổ điểm & Thời khóa biểu phức tạp'.",
                "Hỗ trợ phân quyền trải nghiệm theo gói dịch vụ (Standard, Advanced, Enterprise) ký kết giữa Finviet và Nhà trường.",
                "Đồng bộ tức thì trạng thái tính năng xuống Redux store và Menu Navigation của Portal để ẩn/hiện các menu tương ứng.",
                "Cung cấp cơ chế kích hoạt học kỳ hiện tại (Active Semester) để điều hướng toàn bộ dữ liệu nghiệp vụ của trường."
            ],
            "target_users": [
                {"group": "Finviet Super Admin / Customer Success", "role": "Kích hoạt tính năng theo hợp đồng", "actions": "Bật/tắt các module tính năng theo gói cước trường học đã đăng ký."},
                {"group": "Ban Giám Hiệu Trường", "role": "Xem danh sách tính năng đang sử dụng", "actions": "Kiểm tra các phân hệ trường đang được cấp phép và gửi yêu cầu kích hoạt module mở rộng."},
                {"group": "Tech Lead / Dev Team", "role": "Triển khai tính năng mới theo cờ (Feature Flag)", "actions": "Bật tính năng thử nghiệm Beta cho một số trường thí điểm trước khi phát hành đại trà."}
            ],
            "glossary": [
                {"term": "Feature Flag / Toggle", "definition": "Kỹ thuật lập trình cho phép bật hoặc tắt một tính năng trong hệ thống khi đang chạy mà không cần triển khai lại code."},
                {"term": "Multi-Tenant Switch", "definition": "Cơ chế cấu hình độc lập cho từng trường; việc bật tính năng ở trường A không ảnh hưởng đến trường B."},
                {"term": "Active Semester", "definition": "Học kỳ và năm học đang được kích hoạt làm việc mặc định trên toàn hệ thống của trường đó."}
            ]
        },
        "business": {
            "flow_desc": "Finviet Admin kích hoạt các module trong bảng cấu hình tenant, hệ thống lưu cờ tính năng vào cơ sở dữ liệu tenant, Portal frontend khi người dùng đăng nhập sẽ nạp danh sách flags và tự động ẩn/hiện menu tương ứng.",
            "flow_steps": [
                {"actor": "Finviet Admin / BGH", "action": "Truy cập Cấu hình tính năng", "desc": "Mở phân hệ M6/SM5, xem danh mục các module lớn và sub-module."},
                {"actor": "Admin", "action": "Bật/tắt switch tính năng", "desc": "Chuyển trạng thái toggle (ví dụ: Bật module 'Nhận diện AI cổng trường')."},
                {"actor": "Hệ thống BE", "action": "Cập nhật tenant_features", "desc": "Lưu trạng thái vào CSDL, xóa cache Redis của tenant tương ứng."},
                {"actor": "Portal Frontend", "action": "Đồng bộ Redux & Navigation", "desc": "Lắng nghe cập nhật hoặc khi người dùng refresh, menu tương ứng tự động xuất hiện hoặc ẩn đi."},
                {"actor": "Người dùng", "action": "Sử dụng tính năng", "desc": "Người dùng truy cập vào tính năng vừa được cấp phép."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Khởi tạo trường mới): Khi một trường học mới được ký hợp đồng, Finviet Admin tạo tenant và truy cập M6/SM5 để cấu hình gói tính năng cơ bản.",
                "Giai đoạn 2 (Phân loại theo cấp học): Hệ thống gợi ý template tính năng: Cấp Mầm non (bật Điểm danh, Đón hộ, Thực đơn, Album ảnh, Trao đổi; tắt Sổ điểm số). Cấp THCS/THPT (bật Sổ điểm, Bài tập, Thời khóa biểu; tắt Thực đơn).",
                "Giai đoạn 3 (Cấu hình chi tiết): Admin có thể bật/tắt từng sub-module cụ thể (ví dụ: Trong module Tài chính, bật 'Hóa đơn VietQR' nhưng tạm tắt 'Hóa đơn điện tử SInvoice').",
                "Giai đoạn 4 (Áp dụng & Kiểm soát truy cập): Nếu người dùng gõ URL trực tiếp vào một phân hệ đã bị tắt, middleware của Next.js sẽ chặn lại và chuyển hướng về trang 403 Forbidden kèm thông báo 'Tính năng chưa được kích hoạt cho trường của bạn'.",
                "Giai đoạn 5 (Chọn học kỳ công tác): Quản trị viên kích hoạt học kỳ làm việc hiện tại để các module nghiệp vụ tự động load dữ liệu của kỳ đó."
            ],
            "rules": [
                {"id": "BR-FEAT-01", "title": "Bảo toàn dữ liệu khi tắt tính năng", "desc": "Thao tác tắt một phân hệ tính năng chỉ ẩn giao diện và khóa API ghi; toàn bộ dữ liệu lịch sử đã tạo trước đó phải được bảo toàn nguyên vẹn trong CSDL."},
                {"id": "BR-FEAT-02", "title": "Ràng buộc phụ thuộc giữa các module (Dependencies)", "desc": "Nếu một module phụ thuộc vào module khác (ví dụ: Module 'Báo cáo điểm danh' phụ thuộc vào module 'Điểm danh hàng ngày'), hệ thống không cho phép bật module con nếu module cha đang bị tắt."},
                {"id": "BR-FEAT-03", "title": "Hiệu lực tức thì sau khi chuyển toggle", "desc": "Thời gian cập nhật cache Redis và áp dụng quyền cho tenant không quá 5 giây kể từ khi Admin lưu thay đổi."},
                {"id": "BR-FEAT-04", "title": "Chỉ duy nhất một học kỳ kích hoạt tại một thời điểm", "desc": "Mỗi trường chỉ được có duy nhất 1 Học kỳ làm việc chính thức (Active). Việc kích hoạt học kỳ mới tự động chuyển học kỳ cũ sang trạng thái 'Đã kết thúc'."}
            ],
            "data_entities": [
                {"field": "school_code", "type": "String (50)", "required": "Bắt buộc", "desc": "Mã định danh tenant trường học."},
                {"field": "module_key", "type": "String (100)", "required": "Bắt buộc", "desc": "Mã định danh tính năng: ví dụ 'operations_attendance', 'finance_invoices', 'ai_recognition'..."},
                {"field": "is_enabled", "type": "Boolean", "required": "Bắt buộc", "desc": "Trạng thái bật (True) hoặc tắt (False)."},
                {"field": "plan_tier", "type": "Enum", "required": "Bắt buộc", "desc": "Gói áp dụng: 'standard', 'pro', 'enterprise'."},
                {"field": "updated_by", "type": "UUID", "required": "Bắt buộc", "desc": "Tài khoản thực hiện cấu hình gần nhất."},
                {"field": "updated_at", "type": "Timestamp", "required": "Bắt buộc", "desc": "Thời điểm cập nhật thay đổi."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-029 Cấu hình Tính năng", "feature": "Ma trận bật/tắt module theo trường", "platform": "Portal Web", "priority": "P1", "story": "Là Finviet Admin, tôi muốn bật tắt từng module cho từng trường học để cung cấp đúng gói dịch vụ.", "jira": "FEAT-001"},
                {"epic": "E-029 Cấu hình Tính năng", "feature": "Kích hoạt học kỳ làm việc hiện tại", "platform": "Portal Web", "priority": "P1", "story": "Là Quản trị viên trường, tôi muốn chọn Học kỳ 1 hoặc Học kỳ 2 làm học kỳ làm việc chính thức.", "jira": "FEAT-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-FEAT-01",
                    "name": "Bật/Tắt module chức năng cho trường",
                    "desc": "Quản trị viên cấu hình danh sách module hoạt động của trường.",
                    "actor": "Super Admin / School Admin",
                    "trigger": "Admin truy cập Cấu hình -> Tính năng.",
                    "pre": "Tài khoản có quyền Quản trị cấp cao.",
                    "happy_path": [
                        "1. Admin chọn trường học cần cấu hình.",
                        "2. Hệ thống hiển thị cây phân cấp 7 nhóm module và các sub-module kèm nút gạt Switch tương ứng.",
                        "3. Admin gạt bật nút 'Nhận diện khuôn mặt AI'.",
                        "4. Hệ thống kiểm tra các ràng buộc phụ thuộc (module Media Thư viện đã bật).",
                        "5. Admin bấm 'Lưu cấu hình tính năng'.",
                        "6. Hệ thống hiển thị thông báo thành công và xóa cache tenant."
                    ],
                    "exceptions": [
                        {"case": "Vi phạm ràng buộc phụ thuộc module", "handling": "Hệ thống hiển thị cảnh báo đỏ: 'Tính năng này yêu cầu bật module Thư viện (M2/SM3) trước'."}
                    ],
                    "post": "Trạng thái tính năng được lưu vào CSDL và áp dụng ngay.",
                    "rules": ["BR-FEAT-02", "BR-FEAT-03"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Cấu hình -> Tính năng (`/[schoolCode]/setting/features`)",
            "screens_table": [
                {"screen": "Màn hình cấu hình tính năng (`FeatureToggleView`)", "component": "Bảng ma trận module và sub-module", "format": "Nhóm Accordion gồm 7 Module lớn: Tổng quan, Vận hành, Học tập, Tài chính, Nhà trường, Cấu hình, Khác. Mỗi sub-module có Switch toggle, Mô tả ngắn và Tag gói dịch vụ", "desc": "Giao diện quản lý trực quan trạng thái kích hoạt của 38 sub-module.", "note": "BR-FEAT-01"},
                {"screen": "Màn hình cấu hình tính năng (`FeatureToggleView`)", "component": "Thanh chọn học kỳ làm việc", "format": "Dropdown Học kỳ hiện tại (VD: 'Năm học 2026-2027 - Học kỳ 1'), Nút 'Kích hoạt kỳ này'", "desc": "Xác lập mốc thời gian làm việc mặc định cho toàn trường.", "note": "BR-FEAT-04"},
                {"screen": "Màn hình cấu hình tính năng (`FeatureToggleView`)", "component": "Hộp thoại xác nhận thay đổi (`ConfirmModal`)", "format": "Modal cảnh báo các menu liên quan sẽ bị ẩn nếu người dùng xác nhận tắt", "desc": "Đảm bảo Admin không tắt nhầm module đang hoạt động.", "note": "Xác nhận 2 bước"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-FEAT-01",
                "title": "Ẩn hiện menu điều hướng dựa trên cờ tính năng",
                "scenario": "Given Phân hệ 'Thực đơn' đang ở trạng thái Bật và hiển thị trên Menu Nhà trường\nWhen Admin gạt tắt tính năng 'Thực đơn' và bấm 'Lưu'\nThen Menu 'Thực đơn' biến mất khỏi thanh điều hướng bên trái của tất cả người dùng thuộc trường đó sau khi refresh."
            },
            {
                "id": "AC-FEAT-02",
                "title": "Chặn truy cập đường dẫn trực tiếp khi tính năng bị tắt",
                "scenario": "Given Phân hệ 'Điểm & Đánh giá' đang bị tắt cho Trường Mầm non Ánh Sao\nWhen một giáo viên cố tình gõ trực tiếp URL `/[schoolCode]/school/scoreboard/` vào trình duyệt\nThen hệ thống chuyển hướng về trang thông báo lỗi 403 'Tính năng này hiện không được kích hoạt cho trường học của bạn'."
            },
            {
                "id": "AC-FEAT-03",
                "title": "Kích hoạt học kỳ làm việc mới",
                "scenario": "Given Trường đang hoạt động ở Học kỳ 1\nWhen Admin chọn 'Học kỳ 2' và bấm 'Kích hoạt kỳ này'\nThen toàn bộ dữ liệu mặc định trên Portal (Thời khóa biểu, Điểm danh, Báo cáo) tự động chuyển sang phạm vi ngày của Học kỳ 2."
            }
        ],
        "nfr": {
            "performance": "Kiểm tra quyền truy cập route qua middleware Next.js trong thời gian < 10ms.",
            "security": "Chỉ tài khoản Super Admin hoặc Ban Giám Hiệu mới có quyền sửa đổi cờ tính năng; lưu đầy đủ Audit Log.",
            "ux": "Các nút gạt toggle có trạng thái loading rõ ràng trong lúc gửi request lưu dữ liệu."
        },
        "appendix": {
            "notifications": [
                {"event": "Cập nhật tính năng", "channel": "Toast xanh", "recipient": "Admin", "content": "Đã lưu thành công cấu hình tính năng cho trường."},
                {"event": "Thay đổi học kỳ", "channel": "Banner toàn trang", "recipient": "Toàn thể giáo viên", "content": "Nhà trường đã chuyển sang làm việc tại [Học kỳ 2, Năm học 2026-2027]."}
            ],
            "edge_cases": [
                {"condition": "Admin tắt module Tài chính trong khi phụ huynh đang thực hiện giao dịch quét QR", "solution": "Giao dịch thanh toán đang dở dang vẫn được xử lý ghi nhận vào webhook; giao diện Portal sẽ khóa chức năng tạo hóa đơn mới."},
                {"condition": "Xung đột khi hai Admin cùng cấu hình tính năng cùng lúc", "solution": "Hệ thống áp dụng cơ chế khóa phiên hoặc ghi nhận phiên lưu sau cùng kèm cảnh báo người dùng."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 4. M2/SM1 - Điểm danh (Student Daily Attendance & Pickup)
    # -------------------------------------------------------------------------
    {
        "code": "M2/SM1",
        "name": "M2 - SM1 - Điểm danh",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Điểm danh & Đón trả học sinh hàng ngày (Daily Student Attendance & Pickup Management)</strong> thuộc nhóm <strong>M2: Vận hành</strong> là trái tim của cổng tác nghiệp dành cho Giáo viên chủ nhiệm và Ban Giám Hiệu. Phân hệ chịu trách nhiệm ghi nhận sự hiện diện của học sinh, theo dõi giờ đến, đo thân nhiệt, ghi chép tình trạng sức khỏe đầu giờ, kiểm soát quy trình đón trả học sinh cuối ngày (chống đón nhầm trẻ), xác minh người đón ủy quyền (kèm ảnh chân dung và giấy tờ tùy thân), đồng thời kích hoạt tự động cơ chế hoàn trả tiền ăn bán trú (BR04/BR04b) liên thông với phân hệ Tài chính (M4/SM1).",
            "goals_list": [
                "Cung cấp sổ điểm danh điện tử trực quan theo từng lớp học (`/demo/class/{classId}/attendance/`).",
                "Hỗ trợ điểm danh 2 buổi (Check-in buổi sáng đón trẻ và Check-out buổi chiều trả trẻ).",
                "Kiểm soát an toàn đưa đón trẻ: Đối chiếu ảnh người đón thực tế với danh sách Người giám hộ hợp lệ (Bố, Mẹ, Người giám hộ ủy quyền Slot 1, Slot 2).",
                "Ghi nhận nhanh thân nhiệt, triệu chứng sức khỏe bất thường (sốt, ho, phát ban) và dặn thuốc từ phụ huynh.",
                "Tự động tính toán số tiền hoàn ăn bán trú theo cấu hình trường (M6/SM3) khi học sinh nghỉ học có phép đúng hạn.",
                "Thao tác hàng loạt nhanh chóng: 'Điểm danh đến tất cả', 'Báo vắng nhiều học sinh', 'Xác nhận giờ đón đồng loạt'."
            ],
            "target_users": [
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Điểm danh sáng & trả trẻ chiều", "actions": "Đón trẻ tại cửa lớp, ghi nhận giờ đến, kiểm tra thân nhiệt, xác nhận người đón cuối giờ và cập nhật lý do vắng."},
                {"group": "Bảo vệ / Cán bộ xe buýt", "role": "Kiểm soát an ninh đưa đón", "actions": "Kiểm tra thẻ học sinh, đối chiếu ảnh người đón tại cổng trường hoặc trên xe đưa đón."},
                {"group": "Ban Giám Hiệu", "role": "Giám sát chuyên cần toàn trường", "actions": "Xem tổng số học sinh vắng trong ngày, phát hiện sớm các ổ dịch bệnh học đường qua ghi chú sức khỏe."},
                {"group": "Kế toán học phí", "role": "Tổng hợp hoàn tiền ăn", "actions": "Nhận dữ liệu ngày vắng có phép để trừ tiền ăn bán trú vào hóa đơn kỳ kế tiếp."}
            ],
            "glossary": [
                {"term": "Check-in (Đón trẻ)", "definition": "Ghi nhận thời điểm học sinh đến lớp vào đầu giờ sáng, kiểm tra sức khỏe và người đưa trẻ đến trường."},
                {"term": "Check-out (Trả trẻ)", "definition": "Ghi nhận thời điểm học sinh rời lớp vào cuối giờ chiều và xác minh chính xác nhân thân của người đón trẻ."},
                {"term": "Người đón ủy quyền", "definition": "Cá nhân (ông bà, người giúp việc, tài xế) được bố mẹ đăng ký trước trong hồ sơ học sinh (M5/SM1) kèm ảnh CCCD để đưa đón trẻ an toàn."},
                {"term": "Hoàn tiền ăn bán trú (Meal Refund)", "definition": "Quy chế tài chính hoàn trả tiền suất ăn nếu học sinh có đơn báo vắng hợp lệ trước giờ quy định (ví dụ trước 08:00 sáng)."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình điểm danh diễn ra hai phiên trong ngày: Phiên sáng đón trẻ (Check-in, thân nhiệt, ghi chú) và Phiên chiều trả trẻ (Check-out, xác nhận người đón, thu phí trả muộn nếu có).",
            "flow_steps": [
                {"actor": "GVCN", "action": "Mở sổ điểm danh lớp", "desc": "Truy cập `/demo/class/{classId}/attendance/`, chọn ngày điểm danh."},
                {"actor": "GVCN", "action": "Ghi nhận Check-in sáng", "desc": "Bấm nút 'Đến' cho học sinh, nhập thân nhiệt nếu cần hoặc bấm 'Điểm danh đến cả lớp'."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra giờ quy định (BR01)", "desc": "Nếu check-in sau 08:00, hệ thống tự động đánh dấu cờ 'Đến muộn' kèm số phút trễ."},
                {"actor": "GVCN", "action": "Ghi nhận vắng & hoàn tiền (BR04)", "desc": "Chọn học sinh nghỉ học, bật toggle 'Có phép', hệ thống kích hoạt tính năng hoàn tiền ăn bán trú."},
                {"actor": "GVCN / Người đón", "action": "Check-out trả trẻ chiều (BR02)", "desc": "Khi phụ huynh đến đón, bấm 'Về', mở modal chọn Người đón trẻ (Bố/Mẹ/Người ủy quyền) và bấm xác nhận."},
                {"actor": "Hệ thống BE", "action": "Gửi thông báo tức thì", "desc": "Gửi Push Notification đến App Phụ huynh: 'Bé đã được [Họ tên người đón] đón lúc 17:15'."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Đầu giờ sáng - Đón trẻ): Giáo viên mở sổ điểm danh lớp trên máy tính bảng hoặc laptop. 4 thẻ KPI đầu trang hiển thị tức thì: Tổng số học sinh, Đã đến, Chưa đến, Nghỉ học.",
                "Giai đoạn 2 (Xử lý có mặt & Đến muộn): Giáo viên có thể bấm 'Đến' trên từng học sinh hoặc bấm nút 'Điểm danh đến tất cả' trên thanh công cụ. Đối với học sinh đến sau 08:00, hệ thống tự động đổi màu badge giờ đến sang cam và đánh dấu 'Đi muộn' (BR-ATT-01).",
                "Giai đoạn 3 (Xử lý học sinh nghỉ học & Hoàn tiền): Bấm nút 'Báo vắng', modal BulkAbsentModal hiển thị cho phép chọn nhiều học sinh, chọn loại vắng (Có phép / Không phép) và lý do (Bệnh, Việc riêng). Nếu trường có cấu hình hoàn tiền ăn (M6/SM3), hệ thống tự động tick cờ 'Hoàn tiền ăn bán trú' (BR-ATT-04).",
                "Giai đoạn 4 (Cuối giờ chiều - Trả trẻ): Phụ huynh đến đón, giáo viên bấm nút 'Về' trên danh sách. Modal PickupGuardianModal xuất hiện hiển thị các thẻ Người đón hợp lệ (ảnh chân dung, quan hệ: Bố, Mẹ, Ông, Bà, Tài xế). Giáo viên chọn đúng người đón và bấm 'Xác nhận trả trẻ' (BR-ATT-02, BR-ATT-09).",
                "Giai đoạn 5 (Tính phí trả muộn & Tổng kết): Nếu trả trẻ sau khung giờ quy định (ví dụ sau 17:30), hệ thống tự động tính thêm phụ phí trông muộn và chuyển số liệu sang phân hệ Báo cáo điểm danh (M2/SM5)."
            ],
            "rules": [
                {"id": "BR-ATT-01", "title": "Quy tắc xác định Đến muộn (Late Arrival)", "desc": "Thời điểm Check-in sau 08:00 (hoặc giờ cấu hình tại M6/SM1) tự động gắn cờ 'Đến muộn' kèm số phút trễ và hiển thị đồng hồ biểu tượng màu hồng cam."},
                {"id": "BR-ATT-02", "title": "Bắt buộc Check-in trước khi Check-out", "desc": "Học sinh chưa thực hiện Check-in (trạng thái 'Chưa đến' hoặc 'Vắng') không được phép thao tác Check-out (Nút 'Về' bị disable hoặc hiển thị thông báo lỗi MSG01)."},
                {"id": "BR-ATT-03", "title": "Tổng hợp thẻ KPI thời gian thực", "desc": "Tổng sĩ số = Đã đến (Bao gồm Đúng giờ + Đến muộn) + Chưa điểm danh + Nghỉ học (Có phép + Không phép). Thẻ KPI tự động cập nhật ngay khi thay đổi trạng thái (Optimistic UI)."},
                {"id": "BR-ATT-04", "title": "Điều kiện hoàn tiền ăn bán trú (BR04/BR04b)", "desc": "Chỉ những ngày nghỉ 'Có phép' được ghi nhận trước thời điểm chốt báo ăn (08:00 sáng) mới được tính hoàn tiền ăn. Tiền hoàn được tổng hợp và trừ vào đợt thu học phí tiếp theo."},
                {"id": "BR-ATT-09", "title": "Xác thực danh tính người đón trẻ", "desc": "Khi Check-out cho học sinh mầm non/tiểu học, bắt buộc phải chọn người đón từ danh sách giám hộ đã đăng ký hoặc nhập thông tin người đón đột xuất kèm ghi chú lý do và số CCCD."}
            ],
            "data_entities": [
                {"field": "student_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa ngoại tham chiếu học sinh trong lớp (M5/SM1)."},
                {"field": "class_id", "type": "UUID", "required": "Bắt buộc", "desc": "Lớp học thực hiện điểm danh (M5/SM3)."},
                {"field": "attendance_date", "type": "Date", "required": "Bắt buộc", "desc": "Ngày điểm danh."},
                {"field": "check_in_time", "type": "Time", "required": "Tùy chọn", "desc": "Thời điểm học sinh đến lớp."},
                {"field": "check_out_time", "type": "Time", "required": "Tùy chọn", "desc": "Thời điểm học sinh ra về."},
                {"field": "status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái: 'present', 'late', 'absent_excused', 'absent_unexcused', 'unmarked'."},
                {"field": "temperature", "type": "Decimal (35.0-41.0)", "required": "Tùy chọn", "desc": "Thân nhiệt đo được (°C)."},
                {"field": "health_note", "type": "String (255)", "required": "Tùy chọn", "desc": "Ghi chú sức khỏe hoặc dặn thuốc."},
                {"field": "pickup_guardian_id", "type": "UUID", "required": "Tùy chọn", "desc": "Khóa ngoại tham chiếu người đón trẻ trong hồ sơ giám hộ."},
                {"field": "is_meal_refunded", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ đánh dấu có được hoàn tiền ăn ngày vắng này hay không."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-001 Vận hành Điểm danh", "feature": "Sổ điểm danh lớp học trực quan", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn mở sổ điểm danh lớp để theo dõi và cập nhật trạng thái đến/về của học sinh hàng ngày.", "jira": "DD-001"},
                {"epic": "E-001 Vận hành Điểm danh", "feature": "Modal chọn Người đón trẻ ủy quyền", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn chọn người đón trẻ từ danh sách ảnh giám hộ khi trả trẻ cuối chiều.", "jira": "DD-002"},
                {"epic": "E-001 Vận hành Điểm danh", "feature": "Báo vắng hàng loạt & Hoàn tiền ăn bán trú", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn ghi nhận nghỉ học cho nhiều học sinh kèm cờ hoàn tiền ăn bán trú.", "jira": "DD-003"},
                {"epic": "E-001 Vận hành Điểm danh", "feature": "Xác nhận giờ đón hàng loạt (Bulk Time Confirm)", "platform": "Portal Web", "priority": "P2", "story": "Là GVCN, tôi muốn xác nhận giờ về đồng loạt cho cả lớp vào giờ tan trường.", "jira": "DD-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-ATT-01",
                    "name": "Check-in học sinh đầu giờ sáng",
                    "desc": "Giáo viên ghi nhận học sinh đến lớp.",
                    "actor": "Giáo viên chủ nhiệm (GVCN)",
                    "trigger": "Phụ huynh đưa trẻ đến lớp.",
                    "pre": "Giáo viên đang mở trang Điểm danh lớp.",
                    "happy_path": [
                        "1. GVCN tìm tên học sinh trên danh sách.",
                        "2. Bấm nút 'Đến'.",
                        "3. Hệ thống ghi nhận giờ hiện tại (ví dụ: 07:45), hiển thị badge xanh lá 'Đúng giờ'.",
                        "4. GVCN có thể nhập thêm thân nhiệt '36.8' và ghi chú sức khỏe nếu cần.",
                        "5. Thẻ KPI 'Đã đến' tăng thêm 1."
                    ],
                    "exceptions": [
                        {"case": "Check-in sau 08:00 sáng", "handling": "Hệ thống tự động hiển thị biểu tượng đồng hồ màu cam và ghi nhận trạng thái 'Đến muộn'."}
                    ],
                    "post": "Dữ liệu Check-in được lưu vào Redux và CSDL.",
                    "rules": ["BR-ATT-01", "BR-ATT-03"]
                },
                {
                    "id": "UC-ATT-02",
                    "name": "Check-out trả trẻ an toàn với Người đón",
                    "desc": "Xác thực danh tính người đón trẻ và lưu giờ về.",
                    "actor": "Giáo viên chủ nhiệm",
                    "trigger": "Phụ huynh hoặc người ủy quyền đến đón học sinh.",
                    "pre": "Học sinh đã được Check-in trước đó.",
                    "happy_path": [
                        "1. GVCN bấm nút 'Về' trên dòng học sinh.",
                        "2. Modal PickupGuardianModal xuất hiện hiển thị các thẻ người đón đã đăng ký kèm ảnh thẻ.",
                        "3. GVCN đối chiếu người đứng đón với ảnh thẻ (ví dụ: 'Mẹ - Nguyễn Thị Mai').",
                        "4. Bấm chọn thẻ Mẹ và bấm 'Xác nhận trả trẻ'.",
                        "5. Modal đóng, dòng học sinh chuyển trạng thái hoàn tất (Có giờ đến và Giờ về).",
                        "6. Hệ thống gửi thông báo Push tới ứng dụng di động của phụ huynh."
                    ],
                    "exceptions": [
                        {"case": "Người đón lạ mặt chưa có trong danh sách ủy quyền", "handling": "GVCN chọn 'Người đón khác', bắt buộc nhập Họ tên, SĐT, Số CCCD và gọi điện thoại cho phụ huynh xác nhận trước khi bấm lưu."}
                    ],
                    "post": "Học sinh hoàn tất chu trình đón trả an toàn trong ngày.",
                    "rules": ["BR-ATT-02", "BR-ATT-09"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Vận hành -> Điểm danh (`/[schoolCode]/class/[classId]/attendance`)",
            "screens_table": [
                {"screen": "Sổ điểm danh lớp học (`AttendanceRoster`)", "component": "Thẻ KPI tổng quan (`AttendanceSummaryCards`)", "format": "4 Card ngang: Sĩ số lớp, Đã đến (xanh lá), Chưa điểm danh (xám), Nghỉ học (đỏ)", "desc": "Cung cấp cái nhìn tức thì về tình hình chuyên cần của lớp trong ngày.", "note": "BR-ATT-03"},
                {"screen": "Sổ điểm danh lớp học (`AttendanceRoster`)", "component": "Thanh công cụ (`AttendanceToolbar`)", "format": "Dropdown chọn lớp, Date Picker chọn ngày, Ô tìm kiếm học sinh, Nút 'Đến tất cả', Nút 'Về tất cả', Nút 'Báo vắng'", "desc": "Các nút thao tác nhanh và bộ lọc học sinh.", "note": "Hỗ trợ Optimistic UI"},
                {"screen": "Sổ điểm danh lớp học (`AttendanceRoster`)", "component": "Bảng danh sách học sinh (`AttendanceRoster`)", "format": "Table gồm: STT, Ảnh, Họ tên, Giờ đến (kèm nút 'Đến'), Giờ về (kèm nút 'Về'), Thân nhiệt, Ghi chú, Nút thao tác", "desc": "Nơi giáo viên thao tác trực tiếp với từng học sinh trong lớp.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Modal chọn Người đón trẻ (`PickupGuardianModal`)", "component": "Hộp thoại xác thực người đón", "format": "Danh sách các Card người đón gồm: Ảnh chân dung, Họ tên, Quan hệ (Bố, Mẹ, Người ủy quyền), SĐT, Nút chọn Radio, Nút 'Xác nhận'", "desc": "Đảm bảo trả đúng người, tránh thất lạc hoặc bắt cóc trẻ em.", "note": "BR-ATT-09"},
                {"screen": "Modal báo vắng hàng loạt (`BulkAbsentModal`)", "component": "Hộp thoại ghi nhận vắng & hoàn tiền", "format": "Checkbox danh sách học sinh, Radio (Có phép / Không phép), Dropdown Lý do, Toggle 'Hoàn tiền ăn bán trú', Nút 'Lưu'", "desc": "Cho phép báo vắng nhanh nhiều học sinh một lúc kèm cấu hình hoàn tiền.", "note": "BR-ATT-04"},
                {"screen": "Modal xác nhận giờ về hàng loạt (`BulkTimeConfirmModal`)", "component": "Hộp thoại chốt giờ về cả lớp", "format": "Time Picker chọn giờ về chung (mặc định giờ hiện tại), Checkbox áp dụng cho toàn bộ học sinh đã đến, Nút 'Xác nhận'", "desc": "Dành cho trường hợp toàn lớp tan trường cùng lúc.", "note": "Tối ưu hóa thao tác"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-ATT-01",
                "title": "Check-in học sinh đúng giờ và muộn giờ",
                "scenario": "Given GVCN đang mở sổ điểm danh lớp 1A1\nWhen bấm 'Đến' cho học sinh lúc 07:45\nThen hệ thống hiển thị giờ đến 07:45 với badge xanh lá; nếu bấm lúc 08:15 thì hiển thị biểu tượng đồng hồ màu cam và đánh dấu 'Đến muộn'."
            },
            {
                "id": "AC-ATT-02",
                "title": "Chặn Check-out khi chưa Check-in",
                "scenario": "Given Học sinh Trần Văn B có trạng thái 'Chưa đến'\nWhen giáo viên cố tình bấm vào nút 'Về'\nThen hệ thống vô hiệu hóa nút bấm và hiển thị tooltip thông báo 'Học sinh chưa check-in đến lớp'."
            },
            {
                "id": "AC-ATT-03",
                "title": "Xác nhận người đón trong danh sách ủy quyền",
                "scenario": "Given Giáo viên bấm 'Về' cho học sinh đã đến\nWhen modal PickupGuardianModal xuất hiện và giáo viên chọn thẻ 'Mẹ - Nguyễn Thị Mai' rồi bấm 'Xác nhận trả trẻ'\nThen hệ thống lưu giờ về, gắn tên người đón là 'Nguyễn Thị Mai' và gửi thông báo Push về máy phụ huynh."
            },
            {
                "id": "AC-ATT-04",
                "title": "Tự động kích hoạt hoàn tiền ăn khi nghỉ có phép",
                "scenario": "Given Học sinh nghỉ ốm và phụ huynh gửi đơn trước 08:00 sáng\nWhen giáo viên chọn báo vắng 'Có phép' trong modal BulkAbsentModal\nThen cờ 'Hoàn tiền ăn bán trú' tự động được bật và hệ thống ghi nhận một suất ăn cần hoàn trả cho kỳ học phí sau."
            }
        ],
        "nfr": {
            "performance": "Tải sổ điểm danh 40 học sinh dưới 400ms; thao tác Check-in/Check-out phản hồi UI < 50ms.",
            "security": "Chỉ GVCN phụ trách lớp hoặc BGH mới có quyền điểm danh; ảnh người đón được lưu trữ bảo mật tuân thủ Nghị định 13.",
            "ux": "Các nút bấm kích thước lớn (tối thiểu 44x44px) hỗ trợ thao tác cảm ứng mượt mà trên iPad/máy tính bảng của giáo viên tại lớp."
        },
        "appendix": {
            "notifications": [
                {"event": "Đón trẻ thành công", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Bé [Tên bé] đã đến lớp lúc [HH:mm]. Thân nhiệt: [N]°C."},
                {"event": "Trả trẻ an toàn", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Bé [Tên bé] đã được [Tên người đón] đón về lúc [HH:mm]."},
                {"event": "Cảnh báo vắng mặt", "channel": "Push Notification / SMS", "recipient": "Phụ huynh", "content": "Bé [Tên bé] hiện chưa có mặt tại lớp lúc 08:30. Quý phụ huynh vui lòng liên hệ GVCN."}
            ],
            "edge_cases": [
                {"condition": "Mất mạng khi đang đứng ở cửa lớp trả trẻ", "solution": "Ứng dụng hoạt động ở chế độ Offline trên Redux Local Storage, cho phép chụp ảnh/ghi nhận người đón và tự động đồng bộ khi có kết nối trở lại."},
                {"condition": "Người lạ đến đón nhưng có giấy ủy quyền viết tay", "solution": "Giáo viên bắt buộc giữ trẻ tại lớp, chụp ảnh người đón và CCCD tải lên hệ thống, sau đó gọi video call trực tiếp cho bố mẹ để xác nhận trước khi bàn giao trẻ."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 5. M2/SM2 - Hoạt động (Class Daily Activities & Moderation)
    # -------------------------------------------------------------------------
    {
        "code": "M2/SM2",
        "name": "M2 - SM2 - Hoạt động",
        "parent_module": "M2",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Nhật ký Hoạt động Lớp học & Truyền thông Bán chuyên nghiệp (Daily Class Activities & Lesson Publishing)</strong> thuộc nhóm <strong>M2: Vận hành</strong> đóng vai trò như một mạng xã hội nội bộ thu nhỏ kết nối giữa Giáo viên chủ nhiệm và cộng đồng Phụ huynh học sinh. Phân hệ cho phép giáo viên chia sẻ nhanh các hoạt động học tập, bữa ăn bán trú, giấc ngủ trưa, sinh hoạt dã ngoại và bài giảng thực tế trong ngày (`/demo/class/{classId}/activity/`), hỗ trợ đính kèm ảnh đa phương tiện, gắn thẻ học sinh (@), gắn hashtag môn học (#), chèn câu mẫu sư phạm ($), đồng thời tích hợp quy trình kiểm duyệt nội dung (Moderation Queue) của Ban Giám Hiệu trước khi công bố ra phụ huynh.",
            "goals_list": [
                "Cung cấp bảng tin hoạt động (Activity Feed) sinh động, hiện đại theo từng lớp học.",
                "Trình soạn thảo hoạt động thông minh (`ActivityComposer`) hỗ trợ phím tắt: `@` để gắn thẻ học sinh, `#` để gắn chủ đề học tập, `$` để chèn câu mẫu sư phạm thông dụng.",
                "Hỗ trợ đính kèm chùm ảnh (Multi-photo Grid) với chế độ xem phóng to ảnh chất lượng cao (Lightbox).",
                "Tích hợp quy trình kiểm duyệt bài viết: Tự động chuyển bài vào hàng đợi 'Chờ duyệt' (BR06) hoặc đăng ngay nếu là BGH.",
                "Hỗ trợ ghim bài viết quan trọng lên đầu trang (Pin to top - BR07) và tương tác yêu thích (Like), bình luận hai chiều giữa phụ huynh và giáo viên.",
                "Tích hợp thanh ngữ cảnh bài học hôm nay (`LessonContextPanel` - BR08) giúp giáo viên nắm bắt mục tiêu sư phạm."
            ],
            "target_users": [
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Soạn & đăng tải bài viết hoạt động", "actions": "Chụp ảnh tại lớp, viết nhật ký hoạt động, gắn thẻ học sinh tham gia và gửi phê duyệt."},
                {"group": "Ban Giám Hiệu / Tổ trưởng", "role": "Kiểm duyệt nội dung bài đăng", "actions": "Xem danh sách bài chờ duyệt, bấm 'Phê duyệt' hoặc từ chối bài viết nếu có hình ảnh không phù hợp."},
                {"group": "Phụ huynh học sinh", "role": "Theo dõi hoạt động của con", "actions": "Xem ảnh và bài viết trên ứng dụng phụ huynh, thả tim (Like) và gửi lời nhắn cảm ơn giáo viên."}
            ],
            "glossary": [
                {"term": "Activity Feed", "definition": "Dòng thời gian hiển thị các bài viết nhật ký lớp học theo thứ tự thời gian đảo ngược (mới nhất lên trên, bài ghim ưu tiên hàng đầu)."},
                {"term": "Moderation Queue", "definition": "Hàng đợi kiểm duyệt nội dung; bài viết của giáo viên cần được Ban Giám Hiệu duyệt trước khi hiển thị cho toàn bộ phụ huynh xem."},
                {"term": "Câu mẫu sư phạm ($)", "definition": "Các mẫu câu nhận xét và mô tả hoạt động được biên soạn chuẩn mực (ví dụ: 'Các con ăn hết suất', 'Hôm nay lớp làm quen chữ cái mới')."},
                {"term": "Lightbox", "definition": "Trình hiển thị ảnh toàn màn hình có nền tối mờ giúp người dùng xem chi tiết chùm ảnh sắc nét."}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên soạn thảo bài viết hoạt động kèm ảnh tại lớp, gửi bài lên hệ thống; bài viết đi vào hàng đợi kiểm duyệt, BGH duyệt bài và bài được công bố tức thì đến phụ huynh kèm thông báo đẩy.",
            "flow_steps": [
                {"actor": "GVCN", "action": "Soạn bài viết", "desc": "Mở `/demo/class/{classId}/activity/`, nhập nội dung, chèn câu mẫu ($), gắn thẻ học sinh (@) và đính kèm ảnh."},
                {"actor": "GVCN", "action": "Chọn đối tượng & Đăng bài", "desc": "Chọn phạm vi (Cả lớp hoặc Nhóm học sinh riêng biệt), bấm 'Đăng bài'."},
                {"actor": "Hệ thống BE", "action": "Xếp vào hàng đợi kiểm duyệt (BR06)", "desc": "Gắn trạng thái `cho_duyet` và gửi thông báo đến BGH (hoặc đăng ngay nếu trường tắt kiểm duyệt)."},
                {"actor": "Ban Giám Hiệu", "action": "Phê duyệt bài viết", "desc": "Mở tab 'Chờ duyệt', rà soát hình ảnh và nội dung, bấm 'Phê duyệt'."},
                {"actor": "Hệ thống BE", "action": "Xuất bản & Push Notification", "desc": "Chuyển trạng thái `da_duyet`, hiển thị trên Feed và gửi Push Notification đến phụ huynh của các bé được gắn thẻ."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Thu thập hình ảnh & Soạn thảo): Trong giờ học hoặc sinh hoạt, giáo viên chụp ảnh các con bằng điện thoại và tải lên trình soạn thảo ActivityComposer.",
                "Giai đoạn 2 (Áp dụng phím tắt thông minh): Giáo viên gõ `@` để chọn nhanh những bé tham gia hoạt động góc này, gõ `#` để chọn chủ đề 'Toán mầm non' và gõ `$` để chèn câu mẫu 'Các con rất hào hứng tham gia'.",
                "Giai đoạn 3 (Kiểm tra hợp lệ - BR02): Hệ thống kiểm tra bài viết bắt buộc phải có nội dung chữ hoặc ít nhất 1 ảnh đính kèm; nếu rỗng, hiển thị cảnh báo lỗi.",
                "Giai đoạn 4 (Kiểm duyệt - BR06): Bài viết xuất hiện trong tab 'Chờ duyệt' với badge màu vàng. Ban Giám Hiệu hoặc Tổ trưởng chuyên môn bấm 'Duyệt nhanh' để bài viết được công bố.",
                "Giai đoạn 5 (Tương tác & Ghim bài - BR04, BR07): Bài viết công bố ra bảng tin chính thức. Giáo viên có thể bấm 'Ghim bài' để bài luôn nổi lên trên cùng của feed. Phụ huynh bấm like hoặc comment, số lượt tương tác nhảy số thời gian thực."
            ],
            "rules": [
                {"id": "BR-ACT-01", "title": "Phạm vi đối tượng người xem (Audience Scope)", "desc": "Hỗ trợ 3 phạm vi phát hành bài viết: 'Cả lớp' (Toàn bộ phụ huynh trong lớp), 'Học sinh được gắn thẻ' (Chỉ phụ huynh của các bé được tag mới nhìn thấy bài), 'Nội bộ giáo viên' (Chỉ giáo viên và BGH xem)."},
                {"id": "BR-ACT-02", "title": "Quy tắc xác thực bài viết hợp lệ", "desc": "Bài viết bắt buộc phải có tối thiểu một trong hai yếu tố: Đoạn văn bản nội dung (tối thiểu 5 ký tự) hoặc ít nhất 1 tệp ảnh/video hợp lệ. Không cho phép đăng bài hoàn toàn trống."},
                {"id": "BR-ACT-04", "title": "Cơ chế Thả tim & Bộ đếm tương tác", "desc": "Mỗi tài khoản phụ huynh hoặc giáo viên chỉ được like bài viết 1 lần; bấm lần thứ hai sẽ hủy like. Bộ đếm lượt xem (Views) và lượt thích (Likes) cập nhật thời gian thực."},
                {"id": "BR-ACT-06", "title": "Hàng đợi kiểm duyệt bài viết (Moderation Queue)", "desc": "Tất cả bài viết do giáo viên khởi tạo mặc định ở trạng thái `cho_duyet` và chưa hiển thị cho phụ huynh. Chỉ sau khi BGH hoặc Admin bấm duyệt bài mới chính thức xuất bản."},
                {"id": "BR-ATT-07", "title": "Ưu tiên bài viết được Ghim (Pin to top)", "desc": "Các bài viết được đánh dấu Ghim (Pinned) luôn luôn nổi lên vị trí đầu tiên của bảng tin bất kể thời gian đăng, kèm theo biểu tượng đinh ghim màu xanh nổi bật."}
            ],
            "data_entities": [
                {"field": "post_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính định danh bài viết."},
                {"field": "class_id", "type": "UUID", "required": "Bắt buộc", "desc": "Lớp học phát hành bài viết."},
                {"field": "content", "type": "Text", "required": "Tùy chọn", "desc": "Nội dung bài viết (hỗ trợ mention @ và hashtag #)."},
                {"field": "media_urls", "type": "Array[String]", "required": "Tùy chọn", "desc": "Danh sách URL ảnh hoặc video đính kèm."},
                {"field": "tagged_student_ids", "type": "Array[UUID]", "required": "Tùy chọn", "desc": "Danh sách học sinh được gắn thẻ trong bài."},
                {"field": "scope", "type": "Enum", "required": "Bắt buộc", "desc": "Phạm vi: 'whole_class', 'tagged_only', 'teachers_only'."},
                {"field": "moderation_status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái: 'da_duyet' (Đã duyệt), 'cho_duyet' (Chờ duyệt), 'tu_choi' (Từ chối)."},
                {"field": "is_pinned", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ ghim bài viết lên đầu trang."},
                {"field": "like_count", "type": "Integer", "required": "Mặc định 0", "desc": "Số lượt thích bài viết."},
                {"field": "created_by", "type": "UUID", "required": "Bắt buộc", "desc": "Giáo viên tạo bài viết."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-002 Vận hành Hoạt động", "feature": "Trình soạn thảo bài viết thông minh (ActivityComposer)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn có trình soạn bài hỗ trợ phím tắt @, #, $ và tải nhiều ảnh cùng lúc.", "jira": "ACT-001"},
                {"epic": "E-002 Vận hành Hoạt động", "feature": "Bảng tin hoạt động lớp học (ActivityFeed)", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên và BGH, tôi muốn xem dòng thời gian hoạt động với layout chùm ảnh và tương tác like/comment.", "jira": "ACT-002"},
                {"epic": "E-002 Vận hành Hoạt động", "feature": "Hàng đợi kiểm duyệt bài viết", "platform": "Portal Web", "priority": "P1", "story": "Là Ban Giám Hiệu, tôi muốn duyệt các bài viết hoạt động của giáo viên trước khi công bố ra phụ huynh.", "jira": "ACT-003"},
                {"epic": "E-002 Vận hành Hoạt động", "feature": "Thanh ngữ cảnh bài học hôm nay (LessonContextPanel)", "platform": "Portal Web", "priority": "P2", "story": "Là GVCN, tôi muốn xem mục tiêu bài học hôm nay để nhanh chóng chèn vào nội dung bài đăng.", "jira": "ACT-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-ACT-01",
                    "name": "Soạn và đăng tải bài viết hoạt động lớp",
                    "desc": "Giáo viên chia sẻ hình ảnh và nhật ký học tập của lớp.",
                    "actor": "Giáo viên chủ nhiệm (GVCN)",
                    "trigger": "GVCN mở phân hệ Hoạt động của lớp.",
                    "pre": "GVCN đã đăng nhập và đang phụ trách lớp học.",
                    "happy_path": [
                        "1. GVCN nhấp vào khung soạn thảo ActivityComposer.",
                        "2. Nhập nội dung: 'Hôm nay các con làm quen chữ cái A'.",
                        "3. Gõ phím '$' và chọn mẫu câu 'Cả lớp chú ý lắng nghe và hăng hái phát biểu'.",
                        "4. Bấm nút chọn ảnh và tải lên 4 bức ảnh chụp tại lớp.",
                        "5. Chọn phạm vi người xem: 'Cả lớp'.",
                        "6. Bấm nút 'Đăng bài'.",
                        "7. Hệ thống tạo bài viết với trạng thái 'Chờ duyệt' và hiển thị badge thông báo bài đang được gửi lên BGH."
                    ],
                    "exceptions": [
                        {"case": "Đăng bài không có nội dung chữ và không có ảnh", "handling": "Hệ thống hiển thị viền đỏ và thông báo lỗi 'Vui lòng nhập nội dung hoặc đính kèm ít nhất 1 ảnh'."}
                    ],
                    "post": "Bài viết được lưu vào Redux store và CSDL ở trạng thái chờ duyệt.",
                    "rules": ["BR-ACT-01", "BR-ACT-02", "BR-ACT-06"]
                },
                {
                    "id": "UC-ACT-02",
                    "name": "Ban Giám Hiệu phê duyệt bài viết hoạt động",
                    "desc": "BGH kiểm tra và phê duyệt bài viết để xuất bản tới phụ huynh.",
                    "actor": "Ban Giám Hiệu / Tổ trưởng",
                    "trigger": "BGH mở tab 'Chờ duyệt' trong phân hệ Hoạt động.",
                    "pre": "Có ít nhất 1 bài viết đang chờ duyệt.",
                    "happy_path": [
                        "1. BGH xem nội dung và chùm ảnh của bài viết chờ duyệt.",
                        "2. Bấm vào nút 'Phê duyệt' (icon tích xanh).",
                        "3. Hệ thống đổi trạng thái bài viết thành 'Đã duyệt'.",
                        "4. Bài viết lập tức chuyển sang tab 'Đã duyệt' và xuất hiện trên Feed chính của phụ huynh.",
                        "5. Hệ thống gửi thông báo Push tới các phụ huynh của lớp."
                    ],
                    "exceptions": [
                        {"case": "Bài viết chứa hình ảnh không chuẩn mực", "handling": "BGH bấm 'Từ chối', nhập lý do 'Ảnh mờ/Không đúng quy chuẩn' và gửi phản hồi lại cho GVCN sửa lại."}
                    ],
                    "post": "Bài viết được xuất bản công khai tới toàn thể phụ huynh.",
                    "rules": ["BR-ACT-06"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Vận hành -> Hoạt động (`/[schoolCode]/class/[classId]/activity`)",
            "screens_table": [
                {"screen": "Dòng thời gian hoạt động (`ActivityFeed`)", "component": "Trình soạn thảo bài viết (`ActivityComposer`)", "format": "Textarea đa dòng, Thanh toolbar chứa: Nút chọn phạm vi (Cả lớp / Tagged), Nút tải ảnh, Nút chèn `@` học sinh, Nút `#` hashtag, Nút `$` câu mẫu, Nút 'Đăng bài'", "desc": "Khung nhập liệu trung tâm hỗ trợ phím tắt và tải nhiều ảnh.", "note": "BR-ACT-01, BR-ACT-02"},
                {"screen": "Dòng thời gian hoạt động (`ActivityFeed`)", "component": "Thanh công cụ lọc (`ActivityToolbar`)", "format": "3 Tab chuyển: Tất cả, Đã duyệt, Chờ duyệt (kèm badge đếm số lượng), Ô tìm kiếm theo từ khóa", "desc": "Lọc nhanh các bài viết theo trạng thái kiểm duyệt.", "note": "BR-ACT-06"},
                {"screen": "Dòng thời gian hoạt động (`ActivityFeed`)", "component": "Thẻ bài viết hoạt động (`ActivityFeed`)", "format": "Header (Avatar GV, Tên GV, Thời gian đăng, Badge trạng thái kiểm duyệt, Nút ghim), Nội dung text, Grid chùm ảnh responsive (1, 2, 3, 4+ ảnh), Footer (Đếm like, Đếm view, Nút like, Nút comment, Nút duyệt nhanh)", "desc": "Trực quan hóa bài viết chuyên nghiệp như mạng xã hội.", "note": "BR-ACT-04, BR-ATT-07"},
                {"screen": "Dòng thời gian hoạt động (`ActivityFeed`)", "component": "Thanh ngữ cảnh bài học (`LessonContextPanel`)", "format": "Sidebar bên phải hiển thị: Tên bài học hôm nay theo TKB, Mục tiêu sư phạm, Danh sách câu mẫu gợi ý để click-chèn nhanh", "desc": "Hỗ trợ giáo viên nắm bắt giáo án và soạn bài nhanh.", "note": "BR-ACT-08"},
                {"screen": "Trình xem ảnh phóng to (`LightboxModal`)", "component": "Hộp thoại hiển thị ảnh toàn màn hình", "format": "Modal nền tối, Hiển thị ảnh kích thước lớn, Nút Previous/Next, Nút đóng, Hiển thị danh sách học sinh được tag trong ảnh", "desc": "Xem chi tiết ảnh với độ phân giải cao nhất.", "note": "Prototype hoàn chỉnh"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-ACT-01",
                "title": "Soạn và đăng bài với chùm ảnh và câu mẫu sư phạm",
                "scenario": "Given GVCN đang ở màn hình Hoạt động lớp 1A1\nWhen nhập nội dung, chọn 1 câu mẫu bằng phím '$', đính kèm 3 ảnh và bấm 'Đăng bài'\nThen hệ thống tạo bài viết mới ở trạng thái 'Chờ duyệt' hiển thị trong tab 'Chờ duyệt' với đầy đủ ảnh và nội dung."
            },
            {
                "id": "AC-ACT-02",
                "title": "Phê duyệt bài viết từ hàng đợi kiểm duyệt",
                "scenario": "Given Có bài viết đang ở tab 'Chờ duyệt'\nWhen Ban Giám Hiệu bấm vào nút 'Phê duyệt'\nThen trạng thái bài viết chuyển sang 'Đã duyệt', lập tức hiển thị trên Feed chính của phụ huynh và gửi thông báo Push."
            },
            {
                "id": "AC-ACT-03",
                "title": "Ghim bài viết lên vị trí đầu trang",
                "scenario": "Given Một bài viết quan trọng về thông báo dã ngoại đăng từ tuần trước\nWhen giáo viên bấm nút 'Ghim bài'\nThen bài viết lập tức di chuyển lên vị trí số 1 của bảng tin kèm theo badge đinh ghim màu xanh lá."
            },
            {
                "id": "AC-ACT-04",
                "title": "Thả tim (Like) và cập nhật số lượng tức thì",
                "scenario": "Given Người dùng đang xem một bài viết có 5 lượt thích\nWhen bấm vào icon trái tim\nThen icon trái tim chuyển sang màu đỏ và số lượt thích tăng lên 6 trong thời gian < 50ms (Optimistic UI)."
            }
        ],
        "nfr": {
            "performance": "Tải bảng tin 20 bài viết kèm ảnh dưới 800ms; nén ảnh client-side trước khi tải lên để tiết kiệm băng thông.",
            "security": "Phân quyền nghiêm ngặt: Phụ huynh chỉ xem được bài của lớp con mình hoặc bài con mình được tag; chỉ BGH và GVCN mới có quyền xóa bài.",
            "ux": "Layout lưới ảnh thông minh tự động co giãn theo số lượng ảnh (1 ảnh lớn, 2 ảnh đôi, 3 ảnh tam giác, 4 ảnh vuông, 5+ ảnh kèm số dư +N)."
        },
        "appendix": {
            "notifications": [
                {"event": "Bài viết mới được duyệt", "channel": "Push Notification", "recipient": "Phụ huynh lớp", "content": "Lớp [Tên lớp] vừa có hoạt động mới: '[Trích đoạn 50 ký tự]'."},
                {"event": "Học sinh được gắn thẻ", "channel": "Push Notification", "recipient": "Phụ huynh bé được tag", "content": "Bé [Tên con] vừa xuất hiện trong ảnh hoạt động mới của lớp!"},
                {"event": "Có bài viết mới cần duyệt", "channel": "In-app Alert", "recipient": "Ban Giám Hiệu", "content": "Giáo viên [Họ tên] vừa gửi 1 bài viết hoạt động lớp [Tên lớp] chờ phê duyệt."}
            ],
            "edge_cases": [
                {"condition": "Giáo viên tải lên tệp ảnh kích thước quá lớn (> 20MB)", "solution": "Client tự động nén ảnh xuống chuẩn WebP chất lượng 85% và kích thước tối đa 1920x1080 trước khi tải lên máy chủ."},
                {"condition": "Bài viết bị BGH từ chối phê duyệt", "solution": "Bài viết không bị xóa mà chuyển sang tab 'Bị từ chối' kèm lý do của BGH để giáo viên có thể chỉnh sửa và gửi duyệt lại."}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"Milestone 2 Part 1 defined successfully with {len(PART1_PRDS)} modules!")
    for p in PART1_PRDS:
        print(f"  - [{p['code']}] {p['name']}")
