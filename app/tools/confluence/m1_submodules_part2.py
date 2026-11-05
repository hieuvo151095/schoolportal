# -*- coding: utf-8 -*-
"""Milestone 1 Sub-modules Part 2: M5/SM2, M5/SM12, M6/SM3, M6/SM1, M4/SM3"""

PART2_PRDS = [
    # 7. M5/SM2 - Giáo viên
    {
        "code": "M5/SM2",
        "name": "M5 - SM2 - Giáo viên",
        "parent_module": "M5",
        "parent_category": "8. Portal QLTH > M5 - Nhà trường",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý hồ sơ cán bộ giáo viên &amp; Nhân sự (Teacher &amp; Staff Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm quản trị toàn bộ dữ liệu nhân sự sư phạm trong trường học theo quy chuẩn <strong>Thông tư 20/2018/TT-BGDĐT</strong> ban hành chuẩn nghề nghiệp giáo viên cơ sở giáo dục phổ thông. Giáo viên là chủ thể trực tiếp thực hiện hầu hết các tác vụ hàng ngày trên portal: Điểm danh (M2/SM1), Hoạt động (M2/SM2), Trao đổi với phụ huynh (M2/SM4), Thời khóa biểu (M3/SM1), Giao bài tập (M3/SM2) và Chấm điểm đánh giá (M3/SM3).",
            "goals_list": [
                "Quản lý hồ sơ nhân sự sư phạm toàn diện: Mã giáo viên, CCCD, Trình độ chuyên môn, Chứng chỉ sư phạm, Tổ bộ môn, Phân loại hợp đồng (Cơ hữu / Thỉnh giảng / Trợ giảng).",
                "Phân công nhiệm vụ giảng dạy linh hoạt: Phân công làm Giáo viên chủ nhiệm lớp (M5/SM3) hoặc Giáo viên phụ trách bộ môn theo khối lớp (M5/SM4).",
                "Tự động liên kết hồ sơ giáo viên với Tài khoản đăng nhập hệ thống (M6/SM2) và cấp phát quyền hạn tương ứng theo phân công.",
                "Theo dõi lịch sử công tác, khen thưởng, kỷ luật và quản lý hồ sơ giáo viên thôi việc / chuyển trường."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Quản lý nhân sự", "actions": "Phân công chuyên môn, gán GVCN, đánh giá chuẩn nghề nghiệp giáo viên."},
                {"group": "Cán bộ nhân sự", "role": "Quản trị hồ sơ", "actions": "Tiếp nhận hồ sơ tuyển dụng, cập nhật hợp đồng, bằng cấp và trạng thái công tác."},
                {"group": "Giáo viên", "role": "Người dùng", "actions": "Xem thông tin phân công giảng dạy, thời khóa biểu và cập nhật hồ sơ cá nhân."}
            ],
            "glossary": [
                {"term": "Giáo viên cơ hữu", "definition": "Cán bộ giáo viên biên chế hoặc ký hợp đồng lao động dài hạn toàn thời gian với trường."},
                {"term": "Giáo viên thỉnh giảng", "definition": "Giáo viên giảng dạy theo tiết hoặc hợp đồng khoán chuyên môn theo kỳ."},
                {"term": "Tổ bộ môn", "definition": "Đơn vị chuyên môn tập hợp các giáo viên cùng dạy một nhóm môn học (ví dụ: Tổ Toán - Tin, Tổ Tự nhiên, Tổ Xã hội)."}
            ]
        },
        "business": {
            "flow_desc": "Quy trình tiếp nhận giáo viên -> Tạo hồ sơ & Cấp tài khoản -> Phân công chuyên môn (Chủ nhiệm / Bộ môn) -> Vận hành giảng dạy -> Đánh giá & Lưu trữ.",
            "flow_steps": [
                {"actor": "Nhân sự / BGH", "action": "Khởi tạo hồ sơ giáo viên", "desc": "Nhập Họ tên, SĐT, Email, CCCD, Trình độ văn hóa, Tổ bộ môn và phân loại hợp đồng."},
                {"actor": "Hệ thống BE", "action": "Cấp mã GV & Tạo tài khoản", "desc": "Tự động sinh mã giáo viên (VD: GV-2026-001) và tạo tài khoản đăng nhập tương ứng trong M6/SM2."},
                {"actor": "BGH", "action": "Phân công chuyên môn", "desc": "Gán giáo viên làm chủ nhiệm lớp học hoặc phân công dạy môn học tại các lớp cụ thể."},
                {"actor": "Hệ thống BE", "action": "Cập nhật quyền truy cập", "desc": "Tự động cấp quyền mở sổ điểm, thời khóa biểu và điểm danh cho các lớp được phân công."}
            ],
            "steps_narrative": [
                "Bước 1: Quản trị viên vào Nhà trường -> Giáo viên, xem danh sách cán bộ giáo viên.",
                "Bước 2: Bấm nút '+ Thêm giáo viên', điền đầy đủ thông tin cá nhân và thông tin chuyên môn.",
                "Bước 3: Chọn Tổ bộ môn trực thuộc và hình thức hợp đồng.",
                "Bước 4: Bấm 'Lưu hồ sơ'. Hệ thống tự động tạo tài khoản đăng nhập tương ứng và gửi thông tin về email giáo viên.",
                "Bước 5: Thực hiện phân công giáo viên vào lớp học (M5/SM3) hoặc môn học (M5/SM4)."
            ],
            "rules": [
                {"id": "BR-01", "title": "Tính duy nhất của Mã giáo viên & SĐT", "desc": "Mã cán bộ giáo viên, Số điện thoại và Email công vụ là duy nhất trong toàn trường."},
                {"id": "BR-02", "title": "Bảo vệ toàn vẹn lịch sử giảng dạy", "desc": "Không cho phép xóa giáo viên đã có dữ liệu giảng dạy trong Thời khóa biểu, Điểm số hoặc Hoạt động lớp; chỉ được phép chuyển trạng thái sang 'Đã nghỉ việc'."},
                {"id": "BR-03", "title": "Tự động kích hoạt tài khoản đăng nhập", "desc": "Mỗi hồ sơ giáo viên khi được tạo thành công đều tự động sinh ra một tài khoản đăng nhập portal tương ứng với vai trò Teacher."}
            ],
            "data_entities": [
                {"field": "id", "type": "string", "required": True, "desc": "Mã giáo viên (ví dụ: gv-001, GV-2026-001)."},
                {"field": "fullName", "type": "string", "required": True, "desc": "Họ và tên giáo viên (tối thiểu 2 ký tự)."},
                {"field": "email", "type": "string", "required": True, "desc": "Email công vụ của giáo viên."},
                {"field": "phone", "type": "string", "required": True, "desc": "Số điện thoại di động 10 số."},
                {"field": "department", "type": "string", "required": True, "desc": "Tổ bộ môn trực thuộc (Toán, Văn, Ngoại ngữ...)."},
                {"field": "contractType", "type": "enum", "required": True, "desc": "Loại hợp đồng: co_huu (Cơ hữu), thinh_giang (Thỉnh giảng), tro_giang (Trợ giảng)."},
                {"field": "status", "type": "enum", "required": True, "desc": "Trạng thái: dang_lam_viec (Đang làm việc), da_nghi_viec (Đã nghỉ việc)."},
                {"field": "joinedDate", "type": "date", "required": True, "desc": "Ngày bắt đầu công tác tại trường."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-027 Quản lý giáo viên & nhân sự", "feature": "Hồ sơ giáo viên và chuyên môn", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn quản lý danh sách giáo viên để phân công chuyên môn giảng dạy hợp lý.", "jira": "GV-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-GV-01",
                    "name": "Thêm mới hồ sơ giáo viên",
                    "actor": "Ban Giám Hiệu / Cán bộ nhân sự",
                    "pre": "Đăng nhập với quyền quản trị nhân sự.",
                    "happy_path": [
                        "1. Vào Nhà trường -> Giáo viên, bấm '+ Thêm giáo viên'.",
                        "2. Điền Họ tên, Số điện thoại, Email, chọn Tổ bộ môn và Loại hợp đồng.",
                        "3. Bấm 'Lưu hồ sơ' -> Hệ thống kiểm tra hợp lệ thông tin.",
                        "4. Hệ thống lưu hồ sơ, tạo mã giáo viên và tài khoản portal tương ứng."
                    ],
                    "exceptions": [
                        "Trùng SĐT hoặc Email: Báo lỗi 'Số điện thoại hoặc Email đã tồn tại trong hệ thống'."
                    ],
                    "post": "Giáo viên mới xuất hiện trên danh sách và có thể được chọn để phân công chuyên môn.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Giáo viên</strong> (`/[schoolCode]/teacher`).",
            "screens_table": [
                {"screen": "SCR-GV-01: Danh sách giáo viên", "component": "Bảng quản lý giáo viên", "format": "Data Table", "desc": "Hiển thị: Avatar, Mã GV, Họ tên, Tổ bộ môn, Loại hợp đồng, SĐT, Email, Lớp phụ trách (Badge), Trạng thái, Thao tác (Xem/Sửa/Phân công).", "note": "Hỗ trợ lọc theo Tổ bộ môn và Trạng thái"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Thêm giáo viên mới và tạo tài khoản liên kết tự động",
                "scenario": "Given form Thêm giáo viên\nWhen điền đầy đủ Họ tên, SĐT 10 số, Email và chọn Tổ bộ môn\nThen hệ thống lưu hồ sơ thành công và tự động tạo tài khoản đăng nhập tương ứng trong Quản lý tài khoản."
            }
        ]
    },

    # 8. M5/SM12 - Lịch sự kiện
    {
        "code": "M5/SM12",
        "name": "M5 - SM12 - Lịch sự kiện",
        "parent_module": "M5",
        "parent_category": "8. Portal QLTH > M5 - Nhà trường",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Lịch sự kiện &amp; Kế hoạch công tác năm học (School Event Calendar)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm công bố kế hoạch thời gian các hoạt động học tập, ngày hội trường, kỳ thi học kỳ, ngày họp phụ huynh và các ngày nghỉ lễ tết theo quy định của Nhà nước và ngành giáo dục. Lịch sự kiện cung cấp góc nhìn trực quan toàn trường theo dạng Lịch tháng (Month view), Lịch tuần (Week view) và Danh sách sự kiện (Agenda view), giúp giáo viên và phụ huynh chủ động sắp xếp thời gian.",
            "goals_list": [
                "Quản lý lịch công tác và sự kiện toàn trường tập trung theo từng năm học.",
                "Phân loại sự kiện đa dạng: Lễ khai giảng/bế giảng, Kỳ thi định kỳ, Hoạt động dã ngoại, Họp cha mẹ học sinh, Ngày nghỉ học có phép.",
                "Đồng bộ sự kiện lịch sang ứng dụng di động của phụ huynh và giáo viên kèm thông báo nhắc hẹn trước ngày diễn ra.",
                "Tích hợp với phân hệ Điểm danh (M2/SM1) để tự động đánh dấu ngày nghỉ toàn trường không tính vắng mặt học sinh."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Ban điều hành", "actions": "Lập kế hoạch sự kiện năm học, phê duyệt ngày nghỉ và công bố lịch toàn trường."},
                {"group": "Giáo viên / Phụ huynh", "role": "Người theo dõi", "actions": "Xem lịch sự kiện theo tháng, tuần và nhận thông báo nhắc nhở sự kiện sắp tới."}
            ],
            "glossary": [
                {"term": "Ngày nghỉ toàn trường", "definition": "Ngày nghỉ lễ hoặc sự kiện đặc biệt được BGH phê duyệt nghỉ học, không tính điểm danh."},
                {"term": "Phạm vi sự kiện", "definition": "Đối tượng áp dụng: Toàn trường, Khối lớp cụ thể hoặc Lớp học cụ thể."}
            ]
        },
        "business": {
            "flow_desc": "BGH tạo sự kiện -> Chọn phạm vi áp dụng -> Cấu hình thời gian & nhắc hẹn -> Xuất bản lịch -> Đồng bộ lên app phụ huynh/giáo viên.",
            "flow_steps": [
                {"actor": "BGH / Thư ký", "action": "Tạo sự kiện mới", "desc": "Nhập tên sự kiện, chọn loại sự kiện, địa điểm, thời gian bắt đầu và kết thúc."},
                {"actor": "BGH", "action": "Chọn phạm vi áp dụng", "desc": "Chọn Toàn trường hoặc chỉ áp dụng cho một số khối lớp nhất định."},
                {"actor": "Hệ thống BE", "action": "Phát thông báo & Lên lịch", "desc": "Đưa sự kiện vào lịch công tác và lên lịch gửi push notification nhắc nhở trước 1 ngày."},
                {"actor": "Phụ huynh / GV", "action": "Theo dõi trên App", "desc": "Xem chi tiết sự kiện trên ứng dụng di động."}
            ],
            "steps_narrative": [
                "Bước 1: Người dùng vào Nhà trường -> Lịch sự kiện.",
                "Bước 2: Bấm nút 'Thêm sự kiện', nhập Tiêu đề, Loại sự kiện, Địa điểm, Thời gian bắt đầu và kết thúc.",
                "Bước 3: Chọn cờ 'Học sinh được nghỉ học' nếu sự kiện là ngày nghỉ lễ.",
                "Bước 4: Bấm 'Xuất bản sự kiện' -> Sự kiện hiển thị trên lịch toàn trường.",
                "Bước 5: Hệ thống tự động đẩy thông báo nhắc nhở tới phụ huynh có con thuộc phạm vi áp dụng."
            ],
            "rules": [
                {"id": "BR-01", "title": "Ràng buộc thời gian sự kiện", "desc": "Thời gian kết thúc sự kiện phải lớn hơn hoặc bằng thời gian bắt đầu; không cho phép tạo sự kiện có thời gian kết thúc trong quá khứ."},
                {"id": "BR-02", "title": "Tự động đồng bộ ngày nghỉ vào Điểm danh", "desc": "Nếu sự kiện được tích chọn 'Nghỉ học toàn trường', phân hệ Điểm danh M2/SM1 sẽ tự động khóa ngày đó và ghi chú 'Nghỉ theo lịch trường'."}
            ],
            "data_entities": [
                {"field": "id", "type": "string", "required": True, "desc": "Mã sự kiện duy nhất."},
                {"field": "title", "type": "string", "required": True, "desc": "Tiêu đề sự kiện (tối đa 255 ký tự)."},
                {"field": "eventType", "type": "enum", "required": True, "desc": "Loại: nghi_le (Nghỉ lễ), thi_cu (Thi cử), da_ngoai (Dã ngoại), hop_ph (Họp PH), khac (Khác)."},
                {"field": "startDate", "type": "date-time", "required": True, "desc": "Thời điểm bắt đầu."},
                {"field": "endDate", "type": "date-time", "required": True, "desc": "Thời điểm kết thúc."},
                {"field": "isDayOff", "type": "boolean", "required": True, "desc": "Cờ học sinh được nghỉ học (True/False)."},
                {"field": "scope", "type": "enum", "required": True, "desc": "Phạm vi: all (Toàn trường), grade (Khối lớp), class (Lớp học)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-028 Kế hoạch & Lịch sự kiện", "feature": "Quản lý lịch sự kiện năm học", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn công bố lịch sự kiện để toàn trường và phụ huynh nắm được kế hoạch.", "jira": "SK-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-SK-01",
                    "name": "Tạo sự kiện ngày nghỉ lễ toàn trường",
                    "actor": "Ban Giám Hiệu",
                    "pre": "Đã có niên khóa hiện hành.",
                    "happy_path": [
                        "1. Vào Nhà trường -> Lịch sự kiện, bấm '+ Thêm sự kiện'.",
                        "2. Nhập tiêu đề 'Nghỉ lễ Quốc khánh 02/09'.",
                        "3. Chọn loại 'Nghỉ lễ', tích chọn 'Học sinh được nghỉ học'.",
                        "4. Chọn thời gian từ 01/09 đến 03/09, phạm vi 'Toàn trường'.",
                        "5. Bấm 'Lưu' -> Sự kiện được công bố và đánh dấu trên lịch."
                    ],
                    "exceptions": [],
                    "post": "Học sinh được đánh dấu nghỉ học trên sổ điểm danh trong khoảng thời gian trên.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Lịch sự kiện</strong> (`/[schoolCode]/events`).",
            "screens_table": [
                {"screen": "SCR-SK-01: Lịch sự kiện trường", "component": "Bảng lịch tương tác", "format": "Calendar Grid (Month / Week / Agenda)", "desc": "Hiển thị các khối sự kiện có màu phân biệt theo loại (Xanh: Lễ hội, Đỏ: Ngày nghỉ, Vàng: Kỳ thi). Click vào sự kiện để xem chi tiết.", "note": "Hỗ trợ kéo thả đổi ngày"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Tạo sự kiện thành công và hiển thị trên lịch",
                "scenario": "Given form Thêm sự kiện\nWhen người dùng nhập tiêu đề, loại sự kiện và khoảng thời gian hợp lệ\nThen sự kiện xuất hiện trên bảng lịch tháng đúng vào ngày đã chọn."
            }
        ]
    },

    # 9. M6/SM3 - Cấu hình học phí
    {
        "code": "M6/SM3",
        "name": "M6 - SM3 - Học phí",
        "parent_module": "M6",
        "parent_category": "8. Portal QLTH > M6 - Cấu hình",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Cấu hình thông số tài chính &amp; Thu học phí (Tuition &amp; Billing Settings)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> là trung tâm thiết lập các tham số kỹ thuật và chính sách kế toán chi phối toàn bộ phân hệ Tài chính (M4). Tại đây, nhà trường cấu hình cổng thanh toán tự động (VietQR, Sepay, Finviet Payment Gateway), kết nối hệ thống Hóa đơn điện tử (VNPT-Invoice, Viettel S-Invoice, MISA meInvoice), thiết lập quy tắc phạt nộp muộn, cấu hình công thức hoàn tiền ăn khi học sinh vắng mặt (BR04/BR04b) và quy định nội dung cú pháp chuyển khoản.",
            "goals_list": [
                "Cấu hình tài khoản ngân hàng thụ hưởng và cơ chế gạch nợ tự động qua mã VietQR động / tĩnh.",
                "Tích hợp kết nối API phát hành Hóa đơn điện tử hợp chuẩn Tổng cục Thuế (Thông tư 78/2021/TT-BTC).",
                "Thiết lập quy tắc hoàn tiền học phí / tiền ăn khi học sinh xin nghỉ học có phép.",
                "Cấu hình thời hạn nộp học phí hàng tháng và chính sách nhắc nợ tự động."
            ],
            "target_users": [
                {"group": "Kế toán trưởng / Hiệu trưởng", "role": "Quản trị tài chính", "actions": "Cấu hình tài khoản ngân hàng, ký số hóa đơn điện tử và phê duyệt chính sách hoàn tiền."}
            ],
            "glossary": [
                {"term": "VietQR động", "definition": "Mã QR thanh toán ngân hàng có chứa sẵn số tiền học phí và cú pháp gạch nợ duy nhất của từng học sinh."},
                {"term": "HĐĐT", "definition": "Hóa đơn điện tử theo quy chuẩn Thông tư 78/2021/TT-BTC."}
            ]
        },
        "business": {
            "flow_desc": "Kế toán thiết lập tài khoản ngân hàng -> Tích hợp cổng Sepay/VietQR -> Cấu hình hóa đơn điện tử -> Thiết lập quy tắc hoàn tiền ăn -> Phân hệ Học phí M4 đọc cấu hình để vận hành.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Khai báo tài khoản ngân hàng", "desc": "Nhập Ngân hàng thụ hưởng, Số tài khoản, Tên chủ tài khoản và API Key Sepay."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra kết nối Webhook", "desc": "Gửi ping test kết nối tới ngân hàng/cổng thanh toán để xác nhận thông luồng."},
                {"actor": "Kế toán", "action": "Cấu hình quy tắc hoàn tiền ăn", "desc": "Thiết lập điều kiện: Học sinh vắng có phép >= 3 ngày liên tiếp được hoàn 100% tiền ăn theo đơn giá bữa."},
                {"actor": "Hệ thống BE", "action": "Lưu cấu hình", "desc": "Lưu tham số vào bảng cấu hình tenant và áp dụng ngay cho đợt lập hóa đơn tiếp theo."}
            ],
            "steps_narrative": [
                "Bước 1: Kế toán vào Cấu hình -> Cấu hình học phí.",
                "Bước 2: Thiết lập Tab 1: Tài khoản thu tiền (Ngân hàng, STK, Cú pháp chuyển khoản chuẩn).",
                "Bước 3: Thiết lập Tab 2: Hóa đơn điện tử (Chọn nhà cung cấp VNPT/Viettel/MISA, nhập tài khoản ký số).",
                "Bước 4: Thiết lập Tab 3: Chính sách hoàn tiền vắng mặt (Quy định số ngày vắng tối thiểu và tỷ lệ hoàn).",
                "Bước 5: Bấm 'Lưu cấu hình'. Hệ thống kiểm tra hợp lệ và áp dụng cho toàn bộ phân hệ M4."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo toàn cú pháp chuyển khoản gạch nợ tự động", "desc": "Cú pháp chuyển khoản bắt buộc chứa mã học sinh theo mẫu chuẩn (VD: HP {ma_hoc_sinh}) để webhook ngân hàng tự động đối soát gạch nợ trong < 3 giây."},
                {"id": "BR-02", "title": "Quy tắc hoàn tiền ăn khi vắng mặt", "desc": "Học sinh có đơn báo vắng được duyệt trước 07:30 sáng và vắng từ 3 ngày liên tiếp trở lên sẽ được tự động trừ tiền ăn vào kỳ hóa đơn tháng kế tiếp."}
            ],
            "data_entities": [
                {"field": "bankCode", "type": "string", "required": True, "desc": "Mã ngân hàng (MB, VCB, TCB...)."},
                {"field": "accountNumber", "type": "string", "required": True, "desc": "Số tài khoản ngân hàng trường."},
                {"field": "accountHolder", "type": "string", "required": True, "desc": "Tên chủ tài khoản thụ hưởng."},
                {"field": "invoiceProvider", "type": "enum", "required": False, "desc": "Nhà cung cấp HĐĐT: vnpt, viettel, misa."},
                {"field": "refundMinDays", "type": "number", "required": True, "desc": "Số ngày vắng tối thiểu để hoàn tiền ăn (mặc định: 3 ngày)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-033 Cấu hình học phí & thanh toán", "feature": "Cấu hình ngân hàng & hóa đơn điện tử", "platform": "Web Portal", "priority": "P1", "story": "Là Kế toán, tôi muốn cấu hình tài khoản thu tiền để phụ huynh quét mã VietQR tự động.", "jira": "CFHP-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-CFHP-01",
                    "name": "Cấu hình tài khoản ngân hàng và VietQR",
                    "actor": "Kế toán trưởng / Admin",
                    "pre": "Đã có thông tin tài khoản ngân hàng hợp pháp của trường.",
                    "happy_path": [
                        "1. Vào Cấu hình -> Học phí, chọn tab 'Tài khoản ngân hàng'.",
                        "2. Chọn ngân hàng từ danh mục, nhập STK và Tên chủ tài khoản.",
                        "3. Bấm 'Kiểm tra tài khoản' -> Hệ thống gọi API Napas xác thực tên chủ tài khoản.",
                        "4. Bấm 'Lưu cấu hình' -> Hệ thống sinh mã VietQR mẫu."
                    ],
                    "exceptions": [],
                    "post": "Mọi hóa đơn học phí phát sinh sau đó đều in kèm mã VietQR này.",
                    "rules": "BR-01"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Cấu hình</strong> -> Chọn <strong>Học phí</strong> (`/[schoolCode]/setting/tuition`).",
            "screens_table": [
                {"screen": "SCR-CFHP-01: Cấu hình học phí", "component": "Tabs cấu hình tài chính", "format": "Tab Navigation", "desc": "Tab 1: Ngân hàng & VietQR; Tab 2: Hóa đơn điện tử; Tab 3: Chính sách hoàn tiền & Hạn nộp.", "note": "Giao diện hiện đại"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Cấu hình tài khoản ngân hàng thành công",
                "scenario": "Given form Cấu hình học phí\nWhen nhập đúng thông tin ngân hàng và STK hợp lệ\nThen hệ thống lưu thành công và hiển thị mã VietQR mẫu có logo ngân hàng tương ứng."
            }
        ]
    },

    # 10. M6/SM1 - Cấu hình trường
    {
        "code": "M6/SM1",
        "name": "M6 - SM1 - Trường",
        "parent_module": "M6",
        "parent_category": "8. Portal QLTH > M6 - Cấu hình",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Hồ sơ đơn vị trường học &amp; Cấu hình vận hành (School Profile &amp; General Settings)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> là gốc rễ định danh của tenant trường học trên hệ sinh thái FINVIET School. Tại đây lưu trữ thông tin pháp lý của trường (Mã định danh Sở GD&ĐT, Tên trường chính thức, Địa chỉ, Số điện thoại, Email liên hệ, Website), cấu hình nhận diện thương hiệu (Logo trường, Favicon, Banner), thời gian làm việc hàng tuần (Khung giờ check-in sáng, check-out chiều, ngưỡng tính đi muộn) và các chính sách vận hành chung.",
            "goals_list": [
                "Lưu trữ và quản trị hồ sơ pháp lý trường học chuẩn hóa phục vụ đồng bộ dữ liệu với Sở GD&ĐT.",
                "Tùy biến nhận diện thương hiệu (White-label Branding) theo cấu hình của từng trường học.",
                "Cấu hình khung giờ điểm danh chuẩn: Giờ đón trẻ sáng (07:00 - 08:00), Ngưỡng tính đi muộn (> 08:00), Giờ trả trẻ chiều (16:30 - 17:30), Ngưỡng tính phí trả muộn (> 17:30).",
                "Cung cấp cơ chế cảnh báo thay đổi dữ liệu chưa lưu (Unsaved Changes Warning) để tránh mất mát thông tin."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Đại diện pháp lý", "actions": "Cập nhật thông tin trường, quy định giờ đón trả và duyệt cấu hình nhận diện thương hiệu."}
            ],
            "glossary": [
                {"term": "School Code", "definition": "Mã định danh tenant trường học duy nhất trong toàn hệ sinh thái FINVIET (ví dụ: demo, vinschool-hcm)."},
                {"term": "Ngưỡng tính đi muộn", "definition": "Mốc thời gian check-in sau đó học sinh bị hệ thống tự động ghi nhận là Đi muộn."}
            ]
        },
        "business": {
            "flow_desc": "BGH truy cập cấu hình trường -> Cập nhật thông tin chung / giờ đón trả -> Bấm lưu -> Hệ thống áp dụng ngay vào phân hệ Điểm danh M2/SM1 và thương hiệu trên App.",
            "flow_steps": [
                {"actor": "BGH", "action": "Mở hồ sơ trường", "desc": "Vào Cấu hình -> Trường, xem thông tin trường hiện hành."},
                {"actor": "BGH", "action": "Chỉnh sửa khung giờ", "desc": "Điều chỉnh giờ điểm danh sáng, giờ tan học và các ngày học trong tuần (Thứ 2 đến Thứ 6/Thứ 7)."},
                {"actor": "Hệ thống BE", "action": "Xác thực & Lưu cấu hình", "desc": "Kiểm tra tính hợp lệ của giờ mở cửa/đóng cửa và cập nhật vào cache hệ thống."}
            ],
            "steps_narrative": [
                "Bước 1: BGH vào Cấu hình -> Trường.",
                "Bước 2: Màn hình hiển thị 3 nhóm thông tin: Thông tin chung trường, Quy định giờ đón trả học sinh, Cấu hình các ngày học trong tuần.",
                "Bước 3: Nhập thông tin hoặc tải lên logo trường mới.",
                "Bước 4: Bấm 'Lưu thay đổi'. Hệ thống xác thực và cập nhật tức thì."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bất biến Mã trường (schoolCode)", "desc": "Mã tenant schoolCode là giá trị cố định được cấp khi khởi tạo dịch vụ, không thể chỉnh sửa qua giao diện để đảm bảo an toàn định tuyến URL."},
                {"id": "BR-02", "title": "Ràng buộc khung giờ hoạt động", "desc": "Giờ kết thúc đón trẻ sáng phải lớn hơn giờ bắt đầu tối thiểu 30 phút; ngưỡng tính đi muộn phải nằm trong khoảng giờ đón sáng."}
            ],
            "data_entities": [
                {"field": "schoolCode", "type": "string", "required": True, "desc": "Mã tenant trường học (bất biến)."},
                {"field": "schoolName", "type": "string", "required": True, "desc": "Tên chính thức của trường học."},
                {"field": "address", "type": "string", "required": True, "desc": "Địa chỉ cơ sở trường."},
                {"field": "morningCheckinStart", "type": "time (HH:mm)", "required": True, "desc": "Giờ bắt đầu đón sáng (VD: 07:00)."},
                {"field": "morningCheckinEnd", "type": "time (HH:mm)", "required": True, "desc": "Giờ kết thúc đón sáng / Ngưỡng muộn (VD: 08:00)."},
                {"field": "afternoonCheckoutStart", "type": "time (HH:mm)", "required": True, "desc": "Giờ bắt đầu trả chiều (VD: 16:30)."},
                {"field": "afternoonCheckoutEnd", "type": "time (HH:mm)", "required": True, "desc": "Giờ kết thúc trả chiều / Ngưỡng trông muộn (VD: 17:30)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-031 Cấu hình trường & giờ hoạt động", "feature": "Hồ sơ trường học & Giờ điểm danh", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn thiết lập giờ đón trả để hệ thống tính toán đi muộn chính xác.", "jira": "TRG-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-TRG-01",
                    "name": "Cập nhật giờ đón trả học sinh",
                    "actor": "Ban Giám Hiệu",
                    "pre": "Đăng nhập với quyền quản trị trường.",
                    "happy_path": [
                        "1. Vào Cấu hình -> Trường, chọn phần 'Quy định giờ đón trả'.",
                        "2. Thay đổi giờ bắt đầu đón từ 07:00 sang 06:45.",
                        "3. Bấm 'Lưu thay đổi' -> Hệ thống xác nhận thành công."
                    ],
                    "exceptions": [],
                    "post": "Phân hệ Điểm danh M2/SM1 lập tức áp dụng khung giờ mới cho các ngày tiếp theo.",
                    "rules": "BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Cấu hình</strong> -> Chọn <strong>Trường</strong> (`/[schoolCode]/setting/school`).",
            "screens_table": [
                {"screen": "SCR-TRG-01: Hồ sơ trường học", "component": "Form thông tin trường & Giờ hoạt động", "format": "Settings Form View", "desc": "Input Tên trường, Mã Sở, Địa chỉ, SĐT, Email, Upload Logo, Bộ chọn giờ Đón sáng / Trả chiều, Switch chọn các ngày học trong tuần.", "note": "Có modal cảnh báo Unsaved Changes"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Cập nhật thông tin trường thành công",
                "scenario": "Given form Cấu hình trường\nWhen người dùng chỉnh sửa địa chỉ và bấm 'Lưu'\nThen hệ thống lưu thành công và cập nhật ngay lập tức trên thanh tiêu đề trang."
            }
        ]
    },

    # 11. M4/SM3 - Khoản phí
    {
        "code": "M4/SM3",
        "name": "M4 - SM3 - Khoản phí",
        "parent_module": "M4",
        "parent_category": "8. Portal QLTH > M4 - Tài chính",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Danh mục khoản thu &amp; Biểu giá gốc (Fee Catalog Master Data)</strong> thuộc nhóm <strong>M4: Tài chính</strong> là danh mục gốc định nghĩa toàn bộ các khoản thu phát sinh trong trường học. Tại đây, kế toán thiết lập các khoản phí định kỳ (Học phí chính khóa, Tiền ăn bán trú, Tiền xe buýt đưa đón), các khoản phí một lần đầu năm (Đồng phục, Cơ sở vật chất, BHYT) và các khoản thu tự chọn (Câu lạc bộ ngoại khóa, Dã ngoại trải nghiệm). Đây là dữ liệu nền tảng bắt buộc để cấu hình Quản lý học phí (M4/SM4) và lập Hóa đơn học phí (M4/SM1).",
            "goals_list": [
                "Chuẩn hóa cây danh mục khoản thu toàn trường với mã khoản phí duy nhất và tên gọi minh bạch.",
                "Phân loại hình thức tính phí đa dạng: Thu theo tháng, Thu theo kỳ, Thu theo năm, Thu theo ngày (đơn giá bữa ăn), Thu phát sinh một lần.",
                "Cấu hình tính chất khoản thu: Bắt buộc (Mandatory) hoặc Tự chọn (Optional).",
                "Thiết lập chính sách miễn giảm và cờ áp dụng hoàn trả khi học sinh vắng mặt."
            ],
            "target_users": [
                {"group": "Kế toán trường", "role": "Quản trị danh mục phí", "actions": "Tạo mới khoản phí, cập nhật đơn giá gốc, thiết lập tính chất bắt buộc và phân loại chu kỳ thu."}
            ],
            "glossary": [
                {"term": "Khoản phí bắt buộc", "definition": "Khoản phí mọi học sinh theo học chương trình đều phải nộp (VD: Học phí, Cơ sở vật chất)."},
                {"term": "Khoản phí theo ngày", "definition": "Khoản phí tính theo số ngày thực tế sử dụng (VD: Tiền ăn bán trú = Đơn giá ngày × Số ngày đi học)."}
            ]
        },
        "business": {
            "flow_desc": "Kế toán khởi tạo danh mục khoản phí -> Thiết lập đơn giá và chu kỳ -> Kích hoạt -> Cung cấp danh mục cho Quản lý học phí M4/SM4 áp dụng theo lớp.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Tạo khoản phí mới", "desc": "Nhập Tên khoản phí (VD: Tiền ăn bán trú), Mã khoản phí, chọn Loại chu kỳ (Theo tháng/ngày)."},
                {"actor": "Kế toán", "action": "Thiết lập đơn giá", "desc": "Nhập số tiền định mức (VD: 35.000 VNĐ / ngày hoặc 1.500.000 VNĐ / tháng)."},
                {"actor": "Hệ thống BE", "action": "Lưu danh mục", "desc": "Ghi nhận vào CSDL master data và kích hoạt để gán vào các biểu phí lớp học."}
            ],
            "steps_narrative": [
                "Bước 1: Kế toán vào Tài chính -> Khoản phí.",
                "Bước 2: Bấm nút '+ Thêm khoản phí'.",
                "Bước 3: Nhập Mã khoản phí, Tên khoản phí, chọn Tính chất (Bắt buộc/Tự nguyện), chọn Chu kỳ thu (Tháng/Kỳ/Năm/Ngày).",
                "Bước 4: Nhập Đơn giá mặc định và cấu hình cờ 'Có hoàn tiền khi nghỉ học'.",
                "Bước 5: Bấm 'Lưu' -> Khoản phí sẵn sàng để phân bổ vào các lớp."
            ],
            "rules": [
                {"id": "BR-01", "title": "Tính duy nhất của Mã khoản phí", "desc": "Mã khoản phí là duy nhất trong toàn trường và viết hoa không dấu (VD: HOC_PHI, TIEN_AN, XE_BUS)."},
                {"id": "BR-02", "title": "Bảo vệ khoản phí đã phát sinh hóa đơn", "desc": "Không cho phép xóa khoản phí đã được sử dụng trong bất kỳ hóa đơn học phí nào; chỉ được phép chuyển trạng thái sang Tạm ngưng áp dụng."}
            ],
            "data_entities": [
                {"field": "feeCode", "type": "string", "required": True, "desc": "Mã khoản phí duy nhất."},
                {"field": "feeName", "type": "string", "required": True, "desc": "Tên khoản phí hiển thị trên hóa đơn."},
                {"field": "cycle", "type": "enum", "required": True, "desc": "Chu kỳ: monthly (Tháng), term (Kỳ), yearly (Năm), daily (Ngày), once (Một lần)."},
                {"field": "defaultAmount", "type": "number", "required": True, "desc": "Đơn giá tiền tệ VNĐ."},
                {"field": "isMandatory", "type": "boolean", "required": True, "desc": "Khoản bắt buộc hay tự chọn."},
                {"field": "isRefundable", "type": "boolean", "required": True, "desc": "Có hoàn trả khi vắng mặt hay không."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-020 Danh mục khoản phí", "feature": "Quản lý danh mục khoản phí gốc", "platform": "Web Portal", "priority": "P1", "story": "Là Kế toán, tôi muốn tạo danh mục các khoản phí để áp dụng cho các lớp học.", "jira": "KP-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-KP-01",
                    "name": "Tạo khoản phí tiền ăn tính theo ngày",
                    "actor": "Kế toán trường",
                    "pre": "Đăng nhập với quyền kế toán.",
                    "happy_path": [
                        "1. Vào Tài chính -> Khoản phí, bấm '+ Thêm khoản phí'.",
                        "2. Nhập Mã 'TIEN_AN', Tên 'Tiền ăn bán trú', Chu kỳ 'Theo ngày'.",
                        "3. Đơn giá '35000', tích chọn 'Bắt buộc' và 'Có hoàn tiền khi nghỉ học'.",
                        "4. Bấm 'Lưu' -> Khoản phí hiển thị trên bảng danh mục."
                    ],
                    "exceptions": [
                        "Trùng mã khoản phí: Báo lỗi 'Mã khoản phí đã tồn tại'."
                    ],
                    "post": "Khoản phí sẵn sàng để áp dụng vào biểu phí các lớp.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Tài chính</strong> -> Chọn <strong>Khoản phí</strong> (`/[schoolCode]/school/school-fees`).",
            "screens_table": [
                {"screen": "SCR-KP-01: Danh mục khoản phí", "component": "Bảng danh sách khoản phí", "format": "Data Table", "desc": "Hiển thị: Mã khoản phí, Tên khoản phí, Chu kỳ thu, Đơn giá định mức, Tính chất, Cờ hoàn tiền, Trạng thái (Áp dụng/Ngưng), Thao tác.", "note": "Hỗ trợ lọc theo chu kỳ"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Tạo khoản phí mới thành công",
                "scenario": "Given form Thêm khoản phí\nWhen nhập mã 'TIEN_AN', tên 'Tiền ăn bán trú' và đơn giá hợp lệ\nThen hệ thống lưu khoản phí thành công và hiển thị trên bảng danh mục."
            }
        ]
    }
]

print("Milestone 1 Sub-modules Part 2 defined successfully with 5 modules!")
