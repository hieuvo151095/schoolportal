# -*- coding: utf-8 -*-
"""Milestone 1 Sub-modules Part 3: M4/SM4, M4/SM1, M4/SM5, M4/SM2, M4/SM6"""

PART3_PRDS = [
    # 12. M4/SM4 - Quản lý học phí
    {
        "code": "M4/SM4",
        "name": "M4 - SM4 - Quản lý học phí",
        "parent_module": "M4",
        "parent_category": "8. Portal QLTH > M4 - Tài chính",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý biểu phí &amp; Kế hoạch thu theo lớp (Class Fee Schedules &amp; Tuition Setup)</strong> thuộc nhóm <strong>M4: Tài chính</strong> là cầu nối thiết lập chính sách giữa danh mục Khoản phí gốc (M4/SM3) và các Lớp học cụ thể (M5/SM3). Mỗi lớp học hoặc khối lớp có các gói học phí, tiền ăn và dịch vụ gia tăng khác nhau tùy theo mô hình đào tạo (Lớp Tiêu chuẩn, Lớp Song ngữ quốc tế, Lớp Bán trú chất lượng cao). Phân hệ cho phép kế toán gán tập hợp các khoản thu cho từng lớp, thiết lập đơn giá riêng cho từng đối tượng nếu có chính sách ưu đãi, và làm khuôn mẫu tự động sinh hóa đơn hàng tháng.",
            "goals_list": [
                "Thiết lập biểu phí chi tiết áp dụng cho từng lớp học hoặc áp dụng đồng loạt theo khối lớp.",
                "Tùy biến đơn giá khoản phí theo từng lớp mà không làm thay đổi đơn giá gốc trong danh mục.",
                "Cấu hình các chính sách chiết khấu, miễn giảm học phí cho con em giáo viên hoặc học bổng theo học sinh.",
                "Làm cơ sở tự động sinh hóa đơn hàng loạt (Batch Invoice Generation) tại phân hệ Học phí M4/SM1."
            ],
            "target_users": [
                {"group": "Kế toán trường", "role": "Thiết lập biểu phí", "actions": "Chọn lớp, gán các khoản phí áp dụng, điều chỉnh đơn giá và cấu hình hạn nộp."},
                {"group": "Hiệu trưởng / Kế toán trưởng", "role": "Phê duyệt", "actions": "Duyệt biểu phí đầu năm học trước khi áp dụng phát hành thông báo thu tiền."}
            ],
            "glossary": [
                {"term": "Biểu phí lớp", "definition": "Tập hợp các khoản thu và đơn giá tương ứng được áp dụng cho toàn bộ học sinh của một lớp học."},
                {"term": "Gói thu định kỳ", "definition": "Các khoản phí được lập tự động định kỳ vào ngày đầu mỗi tháng (ví dụ: ngày 01 hàng tháng)."}
            ]
        },
        "business": {
            "flow_desc": "Kế toán chọn lớp học -> Chọn các khoản phí áp dụng từ M4/SM3 -> Điều chỉnh đơn giá & chính sách miễn giảm -> Kích hoạt biểu phí -> Sinh hóa đơn định kỳ.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Chọn lớp học cần gán biểu phí", "desc": "Chọn Lớp 1A1 trong niên khóa 2026-2027."},
                {"actor": "Kế toán", "action": "Gán các khoản phí", "desc": "Chọn: Học phí (2.500.000đ), Tiền ăn (35.000đ/ngày), Tiền nước uống (50.000đ/tháng), Tiền xe buýt (tùy chọn)."},
                {"actor": "Hệ thống BE", "action": "Tính toán tổng mức thu định kỳ", "desc": "Tổng hợp tổng số tiền dự kiến hàng tháng của 1 học sinh theo học lớp này."},
                {"actor": "Kế toán trưởng", "action": "Phê duyệt biểu phí", "desc": "Khóa biểu phí để làm căn cứ sinh hóa đơn tự động."}
            ],
            "steps_narrative": [
                "Bước 1: Kế toán vào Tài chính -> Quản lý học phí.",
                "Bước 2: Hệ thống hiển thị danh sách các lớp học kèm trạng thái biểu phí (Đã cấu hình / Chưa cấu hình).",
                "Bước 3: Chọn một lớp, bấm 'Cấu hình biểu phí'.",
                "Bước 4: Tích chọn các khoản phí áp dụng, nhập hạn nộp định kỳ hàng tháng (ví dụ: ngày 10 hàng tháng).",
                "Bước 5: Bấm 'Lưu và áp dụng' -> Biểu phí có hiệu lực ngay cho kỳ lập hóa đơn tiếp theo."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc có biểu phí trước khi lập hóa đơn", "desc": "Một lớp học bắt buộc phải được cấu hình biểu phí hợp lệ mới có thể sử dụng chức năng 'Lập hóa đơn học phí hàng loạt' tại phân hệ M4/SM1."},
                {"id": "BR-02", "title": "Kế thừa biểu phí theo khối", "desc": "Hệ thống hỗ trợ tính năng 'Áp dụng biểu phí cho toàn khối' để sao chép nhanh cấu hình từ lớp mẫu sang các lớp khác cùng khối."}
            ],
            "data_entities": [
                {"field": "id", "type": "string", "required": True, "desc": "Mã biểu phí lớp."},
                {"field": "classId", "type": "string", "required": True, "desc": "Mã lớp học áp dụng."},
                {"field": "feeItems", "type": "array<object>", "required": True, "desc": "Danh sách các khoản phí: mã khoản, tên, đơn giá áp dụng, tính chất."},
                {"field": "paymentDueDate", "type": "number", "required": True, "desc": "Ngày hạn chót nộp học phí hàng tháng (1 - 28)."},
                {"field": "status", "type": "enum", "required": True, "desc": "Trạng thái: active (áp dụng), draft (nháp)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-021 Biểu phí lớp học", "feature": "Cấu hình biểu phí theo lớp", "platform": "Web Portal", "priority": "P1", "story": "Là Kế toán, tôi muốn thiết lập biểu phí cho từng lớp để chuẩn bị lập hóa đơn học phí.", "jira": "QLHP-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-QLHP-01",
                    "name": "Cấu hình biểu phí cho lớp học",
                    "actor": "Kế toán trường",
                    "pre": "Đã có danh mục Khoản phí M4/SM3 và Lớp học M5/SM3.",
                    "happy_path": [
                        "1. Vào Tài chính -> Quản lý học phí, chọn Lớp 1A1.",
                        "2. Bấm '+ Gán khoản phí', chọn Học phí và Tiền ăn.",
                        "3. Nhập ngày hạn nộp là ngày 10 hàng tháng.",
                        "4. Bấm 'Lưu' -> Hệ thống ghi nhận biểu phí thành công."
                    ],
                    "exceptions": [],
                    "post": "Lớp 1A1 sẵn sàng để tạo hóa đơn học phí tháng.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Tài chính</strong> -> Chọn <strong>Quản lý học phí</strong> (`/[schoolCode]/school/tuition-management`).",
            "screens_table": [
                {"screen": "SCR-QLHP-01: Quản lý biểu phí lớp", "component": "Bảng biểu phí theo lớp", "format": "Data Table", "desc": "Hiển thị: Tên lớp, Khối, Số lượng khoản phí áp dụng, Tổng số tiền dự kiến/tháng, Hạn nộp hàng tháng, Trạng thái, Thao tác cấu hình.", "note": "Hỗ trợ sao chép biểu phí sang lớp khác"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Gán biểu phí cho lớp học thành công",
                "scenario": "Given màn hình Cấu hình biểu phí lớp 1A1\nWhen kế toán chọn các khoản thu hợp lệ và đặt hạn nộp ngày 10\nThen hệ thống lưu thành công và hiển thị tổng định mức tháng của lớp."
            }
        ]
    },

    # 13. M4/SM1 - Học phí
    {
        "code": "M4/SM1",
        "name": "M4 - SM1 - Học phí",
        "parent_module": "M4",
        "parent_category": "8. Portal QLTH > M4 - Tài chính",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý hóa đơn &amp; Thu học phí học sinh (Student Invoicing &amp; Billing Management)</strong> thuộc nhóm <strong>M4: Tài chính</strong> là trái tim vận hành doanh thu của trường học. Phân hệ chịu trách nhiệm lập hóa đơn học phí tự động hàng tháng cho từng học sinh, tính toán tiền ăn thực tế (trừ tiền hoàn vắng mặt theo BR04/BR04b từ Điểm danh M2/SM1), phát hành thông báo thu tiền qua ứng dụng ECO Parent, theo dõi trạng thái thanh toán theo thời gian thực (Chưa nộp, Nộp một phần, Đã hoàn thành), tự động gạch nợ khi phụ huynh quét mã VietQR và xuất biên lai thu tiền điện tử.",
            "goals_list": [
                "Tự động lập hóa đơn học phí hàng tháng cho toàn bộ học sinh theo lớp học dựa trên biểu phí đã cấu hình (M4/SM4).",
                "Tự động khấu trừ tiền hoàn ăn khi học sinh có đơn xin nghỉ học có phép được duyệt từ phân hệ Điểm danh (M2/SM1).",
                "Tích hợp mã thanh toán VietQR động trên từng hóa đơn: Quét mã chuyển khoản là gạch nợ tức thì trong < 3 giây.",
                "Quản lý biên lai thu tiền, hỗ trợ xuất phiếu thu PDF và phát hành Hóa đơn điện tử hợp chuẩn Tổng cục Thuế.",
                "Gửi thông báo đẩy và nhắc nợ tự động tới phụ huynh khi đến hạn nộp tiền."
            ],
            "target_users": [
                {"group": "Kế toán trường", "role": "Thu ngân & Kế toán", "actions": "Lập đợt thu học phí, kiểm tra hóa đơn, thu tiền mặt/chuyển khoản thủ công, in biên lai thu tiền."},
                {"group": "Ban Giám Hiệu (BGH)", "role": "Giám sát tài chính", "actions": "Xem tiến độ thu học phí theo ngày, duyệt các trường hợp miễn giảm đặc biệt."},
                {"group": "Phụ huynh học sinh", "role": "Người thanh toán", "actions": "Xem chi tiết bảng kê học phí trên app, quét mã VietQR để thanh toán và tải biên lai điện tử."}
            ],
            "glossary": [
                {"term": "Hóa đơn học phí", "definition": "Bảng kê chi tiết các khoản thu phát sinh trong tháng của một học sinh."},
                {"term": "Gạch nợ tự động (Auto-reconciliation)", "definition": "Hệ thống tự động chuyển trạng thái hóa đơn sang 'Đã hoàn thành' ngay khi nhận được tín hiệu tiền vào tài khoản ngân hàng khớp cú pháp."},
                {"term": "Khấu trừ vắng mặt", "definition": "Khoản tiền ăn được giảm trừ trong hóa đơn tháng này do học sinh nghỉ học có phép trong tháng trước."}
            ]
        },
        "business": {
            "flow_desc": "Kế toán tạo đợt thu tháng -> Hệ thống tính toán hóa đơn từng học sinh (trừ hoàn tiền ăn) -> Phát hành thông báo cho phụ huynh -> Phụ huynh quét VietQR thanh toán -> Webhook ngân hàng gạch nợ tự động -> Cập nhật trạng thái Đã nộp.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Khởi tạo đợt thu tháng mới", "desc": "Chọn tháng thu (VD: Tháng 10/2026), chọn các khối lớp và đặt hạn nộp tiền."},
                {"actor": "Hệ thống BE", "action": "Tính toán tiền học phí & Tiền ăn", "desc": "Đọc biểu phí lớp M4/SM4; đọc dữ liệu vắng mặt từ Điểm danh M2/SM1 để tự động trừ tiền ăn vắng; sinh mã VietQR động duy nhất cho từng hóa đơn."},
                {"actor": "Kế toán", "action": "Phát hành hóa đơn", "desc": "Duyệt đợt thu và bấm 'Phát hành'; hệ thống gửi thông báo push học phí kèm bảng kê chi tiết đến ứng dụng phụ huynh."},
                {"actor": "Phụ huynh", "action": "Quét VietQR chuyển khoản", "desc": "Mở app ngân hàng bất kỳ, quét mã VietQR in trên thông báo; ngân hàng tự điền số tiền và cú pháp."},
                {"actor": "Hệ thống BE", "action": "Gạch nợ tức thì", "desc": "Nhận webhook thông báo tiền vào từ Sepay/Ngân hàng; đối chiếu mã hóa đơn; chuyển trạng thái sang Đã hoàn thành và gửi biên lai cho phụ huynh."}
            ],
            "steps_narrative": [
                "Bước 1: Kế toán vào Tài chính -> Học phí, chọn tháng thu cần làm việc.",
                "Bước 2: Bấm nút 'Lập hóa đơn đợt thu', chọn toàn bộ các lớp hoặc lớp cụ thể.",
                "Bước 3: Hệ thống tự động tính toán tổng số tiền từng học sinh, hiển thị rõ cột 'Tiền giảm trừ nghỉ học'.",
                "Bước 4: Kế toán kiểm tra số liệu, bấm 'Phát hành thông báo thu tiền'.",
                "Bước 5: Khi phụ huynh thanh toán, hệ thống tự động gạch nợ; trường hợp phụ huynh nộp tiền mặt tại văn phòng, kế toán bấm 'Xác nhận thu tiền mặt' và in phiếu thu."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo vệ toàn vẹn hóa đơn đã thanh toán", "desc": "Hóa đơn đã ở trạng thái 'Đã hoàn thành' hoặc đã xuất hóa đơn điện tử tuyệt đối không được chỉnh sửa số tiền; nếu có sai sót bắt buộc phải lập biên bản hủy và tạo hóa đơn điều chỉnh."},
                {"id": "BR-02", "title": "Tự động trừ tiền ăn khi nghỉ học (Refund Mechanism)", "desc": "Tiền ăn được tự động giảm trừ vào hóa đơn tháng T+1 dựa trên tổng số ngày học sinh nghỉ có phép trong tháng T (nếu vắng từ 3 ngày liên tiếp trở lên theo cấu hình M6/SM3)."},
                {"id": "BR-03", "title": "Phân chia 3 trạng thái thanh toán chuẩn", "desc": "Hóa đơn gồm 3 trạng thái duy nhất: Chưa nộp (Chưa thanh toán đồng nào), Nộp một phần (Đã thanh toán một phần số tiền), Đã hoàn thành (Đã thanh toán đủ 100% số tiền)."}
            ],
            "data_entities": [
                {"field": "invoiceId", "type": "string", "required": True, "desc": "Mã hóa đơn duy nhất (ví dụ: INV-202610-0012)."},
                {"field": "studentId", "type": "string", "required": True, "desc": "Mã học sinh phải nộp."},
                {"field": "month", "type": "string", "required": True, "desc": "Kỳ thu phí (ví dụ: 10/2026)."},
                {"field": "totalAmount", "type": "number", "required": True, "desc": "Tổng số tiền phải nộp sau khi trừ miễn giảm."},
                {"field": "paidAmount", "type": "number", "required": True, "desc": "Số tiền thực tế đã thanh toán."},
                {"field": "refundAmount", "type": "number", "required": False, "desc": "Số tiền hoàn ăn được khấu trừ."},
                {"field": "paymentStatus", "type": "enum", "required": True, "desc": "Trạng thái: unpaid (Chưa nộp), partial (Nộp một phần), paid (Đã hoàn thành)."},
                {"field": "qrUrl", "type": "string", "required": False, "desc": "Đường dẫn ảnh mã VietQR thanh toán."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-018 Quản lý thu học phí", "feature": "Lập hóa đơn và theo dõi công nợ học sinh", "platform": "Web Portal", "priority": "P1", "story": "Là Kế toán, tôi muốn lập hóa đơn học phí hàng tháng cho học sinh để phụ huynh thanh toán.", "jira": "HP-001"},
                {"epic": "E-018 Quản lý thu học phí", "feature": "Gạch nợ tự động qua VietQR và Thu tiền mặt", "platform": "Web Portal", "priority": "P1", "story": "Là Kế toán, tôi muốn hệ thống tự động gạch nợ khi phụ huynh quét mã VietQR để không phải đối soát thủ công.", "jira": "HP-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-HP-01",
                    "name": "Lập hóa đơn học phí tháng mới",
                    "actor": "Kế toán trường",
                    "pre": "Đã có biểu phí lớp M4/SM4 và dữ liệu điểm danh tháng trước.",
                    "happy_path": [
                        "1. Vào Tài chính -> Học phí, chọn 'Tháng 10/2026'.",
                        "2. Bấm 'Lập hóa đơn học phí', chọn Khối 1.",
                        "3. Hệ thống tính toán hóa đơn cho tất cả học sinh Khối 1, tự động áp dụng tiền hoàn ăn.",
                        "4. Kế toán kiểm tra tổng tiền và bấm 'Phát hành đợt thu'.",
                        "5. Hệ thống gửi thông báo push kèm bảng kê chi tiết đến app của phụ huynh."
                    ],
                    "exceptions": [
                        "Lớp chưa có biểu phí: Báo lỗi 'Lớp {ten_lop} chưa cấu hình biểu phí, không thể lập hóa đơn'."
                    ],
                    "post": "Toàn bộ học sinh có hóa đơn ở trạng thái 'Chưa nộp' kèm mã VietQR sẵn sàng thanh toán.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Tài chính</strong> -> Chọn <strong>Học phí</strong> (`/[schoolCode]/school/fee`).",
            "screens_table": [
                {"screen": "SCR-HP-01: Danh sách hóa đơn học phí", "component": "Thanh tổng quan tiến độ thu", "format": "Metric Cards", "desc": "4 thẻ: Tổng phải thu, Đã thu, Còn phải thu, Tỷ lệ hoàn thành (%).", "note": "Cập nhật thời gian thực khi có tiền vào"},
                {"screen": "SCR-HP-01: Danh sách hóa đơn học phí", "component": "Bảng hóa đơn học sinh", "format": "Data Table", "desc": "Hiển thị: Mã HS, Họ tên, Lớp, Tổng tiền, Giảm trừ vắng mặt, Phải thu, Đã nộp, Còn nợ, Trạng thái (Chưa nộp: Đỏ, Hoàn thành: Xanh), Nút Thu tiền mặt, Nút Xem chi tiết / In biên lai.", "note": "Hỗ trợ lọc theo Lớp và Trạng thái thanh toán"},
                {"screen": "SCR-HP-02: Modal Chi tiết hóa đơn & VietQR", "component": "Phiếu báo học phí chi tiết", "format": "Modal Dialog / Print View", "desc": "Bảng kê từng khoản thu: Học phí, Bán trú, Xe buýt, Khấu trừ vắng mặt, Mã VietQR động kèm cú pháp chuyển khoản.", "note": "Hỗ trợ in trực tiếp hoặc xuất file PDF"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Lập hóa đơn và trừ tiền ăn vắng mặt chính xác",
                "scenario": "Given học sinh có đơn báo vắng được duyệt 4 ngày trong tháng 9\nWhen kế toán lập hóa đơn học phí tháng 10\nThen hóa đơn tự động hiển thị dòng khấu trừ 'Hoàn tiền ăn vắng mặt' bằng đúng 4 × đơn giá ngày."
            },
            {
                "id": "AC-02",
                "title": "Gạch nợ tức thì khi nhận webhook chuyển khoản",
                "scenario": "Given hóa đơn học phí đang ở trạng thái 'Chưa nộp'\nWhen phụ huynh quét mã VietQR chuyển khoản đủ số tiền với cú pháp chuẩn\nThen hệ thống nhận webhook, tự động chuyển trạng thái sang 'Đã hoàn thành' trong vòng < 3 giây và gửi thông báo xác nhận cho phụ huynh."
            }
        ]
    },

    # 14. M4/SM5 - Khoản chi
    {
        "code": "M4/SM5",
        "name": "M4 - SM5 - Khoản chi",
        "parent_module": "M4",
        "parent_category": "8. Portal QLTH > M4 - Tài chính",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Quản lý chi phí &amp; Phiếu chi tài chính (School Expenses &amp; Disbursements)</strong> thuộc nhóm <strong>M4: Tài chính</strong> quản lý toàn bộ dòng tiền chi ra trong hoạt động vận hành của trường học theo đúng <strong>Chế độ kế toán đơn vị hành chính sự nghiệp</strong>. Phân hệ bao gồm chi lương nhân sự, chi mua thực phẩm bán trú hàng ngày, chi bảo trì cơ sở vật chất, chi mua giáo cụ đồ dùng học tập và các khoản chi hoàn trả học phí thừa cho phụ huynh khi học sinh chuyển trường. Hệ thống áp dụng quy trình kiểm soát phê duyệt chi 2 cấp (Kế toán lập phiếu -> BGH phê duyệt chi) đảm bảo tính minh bạch tài chính tuyệt đối.",
            "goals_list": [
                "Quản lý danh mục các khoản chi phí vận hành trường học minh bạch, phân loại theo nhóm chi phí chuẩn.",
                "Quy trình lập, trình duyệt và ký số phiếu chi điện tử 2 cấp độ ngăn ngừa thất thoát tài chính.",
                "Quản lý quỹ tiền mặt tại quỹ và tài khoản ngân hàng chi trả của nhà trường.",
                "Tự động hạch toán đối soát dòng tiền thu - chi phục vụ báo cáo tài chính tổng hợp."
            ],
            "target_users": [
                {"group": "Kế toán viên", "role": "Lập phiếu chi", "actions": "Lập đề xuất chi, đính kèm hóa đơn chứng từ mua sắm và chuyển BGH phê duyệt."},
                {"group": "Hiệu trưởng / Chủ tài khoản", "role": "Người duyệt chi", "actions": "Kiểm tra chứng từ, phê duyệt hoặc từ chối phiếu chi tài chính."},
                {"group": "Thủ quỹ", "role": "Thực hiện chi tiền", "actions": "Thực hiện xuất quỹ tiền mặt hoặc chuyển khoản sau khi phiếu chi được duyệt."}
            ],
            "glossary": [
                {"term": "Phiếu chi (Expense Voucher)", "definition": "Chứng từ kế toán xác nhận số tiền đã chi ra từ quỹ tiền mặt hoặc tài khoản ngân hàng của trường."},
                {"term": "Duyệt chi 2 cấp", "definition": "Quy trình kiểm soát: Kế toán lập phiếu -> BGH ký duyệt chi -> Thủ quỹ thực hiện xuất tiền."}
            ]
        },
        "business": {
            "flow_desc": "Kế toán lập phiếu chi kèm hóa đơn chứng từ -> Trình BGH phê duyệt -> BGH duyệt -> Thủ quỹ chi tiền -> Cập nhật sổ quỹ tiền mặt.",
            "flow_steps": [
                {"actor": "Kế toán", "action": "Lập phiếu chi mới", "desc": "Nhập người nhận tiền, lý do chi, số tiền, chọn nhóm chi phí và tải lên ảnh chứng từ/hóa đơn."},
                {"actor": "Kế toán", "action": "Trình duyệt phiếu chi", "desc": "Chuyển phiếu chi sang trạng thái 'Chờ duyệt'."},
                {"actor": "Hiệu trưởng", "action": "Kiểm tra & Phê duyệt", "desc": "Mở phiếu chi xem chứng từ; bấm 'Phê duyệt chi' hoặc 'Từ chối' kèm lý do."},
                {"actor": "Thủ quỹ", "action": "Xuất quỹ chi tiền", "desc": "Chuyển trạng thái sang 'Đã chi tiền' và in phiếu chi ký xác nhận."}
            ],
            "steps_narrative": [
                "Bước 1: Kế toán vào Tài chính -> Khoản chi.",
                "Bước 2: Bấm nút '+ Tạo phiếu chi'.",
                "Bước 3: Nhập thông tin: Tiêu đề chi, Số tiền, Người nhận tiền, Nhóm khoản chi (Thực phẩm, Điện nước, Sửa chữa, Lương), đính kèm file hóa đơn.",
                "Bước 4: Bấm 'Lưu và trình duyệt' -> BGH nhận thông báo có phiếu chi cần duyệt.",
                "Bước 5: BGH bấm duyệt -> Thủ quỹ xuất tiền và hoàn tất chứng từ kế toán."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc phê duyệt đối với phiếu chi lớn", "desc": "Mọi khoản chi trên 5.000.000 VNĐ bắt buộc phải có chữ ký số hoặc phê duyệt điện tử của Hiệu trưởng trước khi thủ quỹ được phép xuất tiền."},
                {"id": "BR-02", "title": "Bất biến chứng từ đã chi", "desc": "Phiếu chi đã ở trạng thái 'Đã chi' không thể xóa hay sửa số tiền; chỉ cho phép tạo phiếu hủy chi có biên bản kiểm toán đính kèm."}
            ],
            "data_entities": [
                {"field": "voucherId", "type": "string", "required": True, "desc": "Mã phiếu chi (ví dụ: PC-202610-001)."},
                {"field": "title", "type": "string", "required": True, "desc": "Nội dung mục đích chi tiền."},
                {"field": "amount", "type": "number", "required": True, "desc": "Số tiền chi (VNĐ)."},
                {"field": "recipient", "type": "string", "required": True, "desc": "Họ tên người nhận tiền hoặc đơn vị thụ hưởng."},
                {"field": "category", "type": "enum", "required": True, "desc": "Nhóm chi: thuc_pham (Thực phẩm), sua_chua (Sửa chữa), giao_cu (Giáo cụ), luong (Lương), khac (Khác)."},
                {"field": "status", "type": "enum", "required": True, "desc": "Trạng thái: draft (Nháp), pending (Chờ duyệt), approved (Đã duyệt), paid (Đã chi), rejected (Từ chối)."},
                {"field": "attachments", "type": "array<string>", "required": False, "desc": "Danh sách file ảnh hóa đơn đính kèm."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-022 Quản lý khoản chi & phiếu chi", "feature": "Lập và duyệt phiếu chi điện tử", "platform": "Web Portal", "priority": "P1", "story": "Là Kế toán, tôi muốn lập phiếu chi để theo dõi các khoản chi tiêu vận hành trường.", "jira": "KC-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-KC-01",
                    "name": "Tạo phiếu chi tiền mua thực phẩm",
                    "actor": "Kế toán viên",
                    "pre": "Đã có chứng từ mua thực phẩm từ nhà cung cấp.",
                    "happy_path": [
                        "1. Vào Tài chính -> Khoản chi, bấm '+ Tạo phiếu chi'.",
                        "2. Nhập Tiêu đề 'Thanh toán tiền rau củ tuần 1 tháng 10'.",
                        "3. Số tiền '8500000', chọn nhóm 'Thực phẩm bán trú', người nhận 'Công ty CP Nông sản Xanh'.",
                        "4. Tải lên ảnh chụp hóa đơn GTGT đính kèm.",
                        "5. Bấm 'Trình duyệt' -> Phiếu chuyển sang Chờ duyệt."
                    ],
                    "exceptions": [],
                    "post": "Hiệu trưởng nhận được thông báo yêu cầu phê duyệt chi.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Tài chính</strong> -> Chọn <strong>Khoản chi</strong> (`/[schoolCode]/school/expenses`).",
            "screens_table": [
                {"screen": "SCR-KC-01: Danh sách phiếu chi", "component": "Bảng quản lý phiếu chi", "format": "Data Table", "desc": "Hiển thị: Mã phiếu chi, Ngày lập, Nội dung chi, Nhóm chi, Số tiền, Người nhận, Trạng thái (Badge: Chờ duyệt màu cam, Đã chi màu xanh), Thao tác (Duyệt/Xem/In).", "note": "Hỗ trợ lọc theo trạng thái và khoảng thời gian"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Tạo phiếu chi và chuyển trạng thái Chờ duyệt thành công",
                "scenario": "Given form Tạo phiếu chi\nWhen kế toán nhập đầy đủ thông tin, đính kèm hóa đơn và bấm 'Trình duyệt'\nThen phiếu chi được lưu ở trạng thái Chờ duyệt và hiển thị trên bảng danh sách của Hiệu trưởng."
            }
        ]
    },

    # 15. M4/SM2 - Đối soát
    {
        "code": "M4/SM2",
        "name": "M4 - SM2 - Đối soát",
        "parent_module": "M4",
        "parent_category": "8. Portal QLTH > M4 - Tài chính",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Đối soát giao dịch thanh toán &amp; Đối chiếu ngân hàng (Payment Reconciliation &amp; Gateway Settlement)</strong> thuộc nhóm <strong>M4: Tài chính</strong> là chốt chặn đảm bảo tính khớp đúng 100% giữa số liệu giao dịch trên cổng thanh toán (VietQR/Sepay), sao kê tài khoản ngân hàng của trường học và các hóa đơn học phí đã gạch nợ trên portal. Phân hệ cung cấp báo cáo phiên đối soát hàng ngày, tự động phát hiện các giao dịch chuyển khoản sai cú pháp, chuyển thừa hoặc thiếu tiền, giúp kế toán xử lý hoàn tiền hoặc gạch nợ thủ công mà không để thất thoát nguồn thu.",
            "goals_list": [
                "Tự động đối chiếu từng giao dịch ngân hàng phát sinh với mã hóa đơn học phí tương ứng.",
                "Phát hiện và cảnh báo tức thì các giao dịch bất thường: Chuyển thừa tiền, Chuyển thiếu tiền, Sai mã học sinh, Giao dịch bị trùng lặp.",
                "Quản lý phiên đối soát ngày và tháng, xuất biên bản đối soát tài chính phục vụ kiểm toán.",
                "Cung cấp công cụ gạch nợ thủ công có kiểm soát đối với các trường hợp phụ huynh quên ghi nội dung chuyển khoản."
            ],
            "target_users": [
                {"group": "Kế toán trường", "role": "Đối soát viên", "actions": "Kiểm tra phiên đối soát hàng ngày, xử lý các giao dịch bất thường và khóa sổ phiên đối chiếu."}
            ],
            "glossary": [
                {"term": "Phiên đối soát (Reconciliation Session)", "definition": "Khoảng thời gian (thường là 1 ngày từ 00:00 đến 23:59) chốt sổ toàn bộ giao dịch ngân hàng để đối chiếu với sổ thu học phí."},
                {"term": "Giao dịch bất thường", "definition": "Giao dịch tiền vào tài khoản ngân hàng nhưng hệ thống không thể tự động gạch nợ do sai cú pháp hoặc sai số tiền."}
            ]
        },
        "business": {
            "flow_desc": "Hệ thống lấy webhook ngân hàng -> Tự động đối chiếu với hóa đơn M4/SM1 -> Phân loại Khớp đúng / Lệch số tiền / Sai cú pháp -> Kế toán xử lý ngoại lệ -> Khóa sổ phiên đối soát.",
            "flow_steps": [
                {"actor": "Hệ thống BE", "action": "Ghi nhận giao dịch ngân hàng", "desc": "Lưu vết từng giao dịch chuyển khoản thành công từ ngân hàng."},
                {"actor": "Hệ thống BE", "action": "Đối soát tự động", "desc": "Khớp số tiền và cú pháp với hóa đơn; nếu khớp 100% đánh dấu 'Đã khớp'."},
                {"actor": "Kế toán", "action": "Xử lý giao dịch lệch", "desc": "Mở danh sách giao dịch chưa khớp, tra cứu học sinh theo tên người gửi và gán vào hóa đơn đúng."},
                {"actor": "Kế toán trưởng", "action": "Chốt phiên đối soát", "desc": "Khóa sổ phiên ngày và xuất file Excel đối chiếu kế toán."}
            ],
            "steps_narrative": [
                "Bước 1: Kế toán vào Tài chính -> Đối soát.",
                "Bước 2: Màn hình hiển thị danh sách các phiên đối soát theo ngày kèm tổng số tiền ngân hàng ghi có và tổng số tiền portal đã gạch nợ.",
                "Bước 3: Xem tab 'Giao dịch cần xử lý': hiển thị các khoản tiền phụ huynh chuyển nhưng ghi thiếu mã học sinh.",
                "Bước 4: Kế toán bấm 'Khớp thủ công', chọn học sinh tương ứng và bấm 'Xác nhận gạch nợ'.",
                "Bước 5: Sau khi hết các khoản lệch, kế toán bấm 'Khóa phiên đối soát'."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo vệ nguyên vẹn sao kê ngân hàng", "desc": "Toàn bộ giao dịch ngân hàng lấy về từ cổng thanh toán là dữ liệu bất biến (Immutable), kế toán không thể sửa hay xóa bất kỳ dòng giao dịch nào."},
                {"id": "BR-02", "title": "Audit log thao tác khớp thủ công", "desc": "Mọi thao tác gán giao dịch thủ công bắt buộc phải lưu vết Kế toán thực hiện, lý do gán và thời điểm gán để phục vụ kiểm toán độc lập."}
            ],
            "data_entities": [
                {"field": "sessionId", "type": "string", "required": True, "desc": "Mã phiên đối soát (ví dụ: REC-20261027)."},
                {"field": "transactionId", "type": "string", "required": True, "desc": "Mã giao dịch ngân hàng (Mã FT/Bank Ref)."},
                {"field": "amount", "type": "number", "required": True, "desc": "Số tiền thực tế tiền vào ngân hàng."},
                {"field": "bankDescription", "type": "string", "required": True, "desc": "Nội dung chuyển khoản gốc từ ngân hàng."},
                {"field": "matchedInvoiceId", "type": "string", "required": False, "desc": "Mã hóa đơn được khớp nợ."},
                {"field": "status", "type": "enum", "required": True, "desc": "Trạng thái: matched (Đã khớp), unmatched (Chưa khớp), resolved (Đã xử lý thủ công)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-019 Đối soát & thanh toán", "feature": "Bảng phiên đối soát ngân hàng", "platform": "Web Portal", "priority": "P1", "story": "Là Kế toán, tôi muốn xem bảng đối soát hàng ngày để đảm bảo tiền ngân hàng khớp đúng với tiền học phí.", "jira": "DS-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-DS-01",
                    "name": "Xử lý giao dịch chuyển khoản sai cú pháp",
                    "actor": "Kế toán trường",
                    "pre": "Có giao dịch ở trạng thái Chưa khớp trong phiên đối soát.",
                    "happy_path": [
                        "1. Vào Tài chính -> Đối soát, chọn phiên ngày hôm nay.",
                        "2. Xem danh sách giao dịch Chưa khớp.",
                        "3. Bấm 'Gán học sinh', tìm học sinh 'Nguyễn Văn Nam - Lớp 1A1'.",
                        "4. Bấm 'Xác nhận gạch nợ' -> Hóa đơn học sinh được gạch nợ và giao dịch chuyển sang 'Đã xử lý'."
                    ],
                    "exceptions": [],
                    "post": "Tổng tiền portal khớp với tổng tiền ngân hàng.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Tài chính</strong> -> Chọn <strong>Đối soát</strong> (`/[schoolCode]/school/reconciliation`).",
            "screens_table": [
                {"screen": "SCR-DS-01: Bảng đối soát phiên", "component": "Bảng phiên đối chiếu ngày", "format": "Data Table", "desc": "Hiển thị: Mã phiên, Ngày đối soát, Tổng số giao dịch, Tổng tiền ngân hàng, Tổng tiền portal, Chênh lệch, Trạng thái (Khớp / Lệch), Nút Xem chi tiết.", "note": "Phiên có chênh lệch hiển thị cờ đỏ cảnh báo"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Hiển thị chính xác số tiền khớp và chênh lệch",
                "scenario": "Given phiên đối soát ngày hôm nay\nWhen có 1 giao dịch 2.500.000đ chưa khớp mã học sinh\nThen hệ thống hiển thị dòng chênh lệch '+2.500.000đ' và đưa giao dịch vào hàng đợi xử lý."
            }
        ]
    },

    # 16. M4/SM6 - Báo cáo Học phí
    {
        "code": "M4/SM6",
        "name": "M4 - SM6 - Báo cáo Học phí",
        "parent_module": "M4",
        "parent_category": "8. Portal QLTH > M4 - Tài chính",
        "priority": "MUST HAVE",
        "status": "READY FOR REVIEW",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "2026-10-27",
        "reviewer": "hieu.vo1@finviet.com.vn",
        "overview": {
            "context": "Phân hệ <strong>Báo cáo doanh thu &amp; Phân tích tiến độ thu học phí (Tuition &amp; Collection Analytics)</strong> thuộc nhóm <strong>M4: Tài chính</strong> cung cấp cho Ban Giám Hiệu và Phòng Tài chính bức tranh toàn cảnh về tình hình tài chính học đường. Hệ thống tổng hợp số liệu đa chiều: Tỷ lệ hoàn thành thu học phí toàn trường, tỷ lệ nộp phí theo từng khối/lớp, phân tích cơ cấu nguồn thu (học phí, tiền ăn, đưa đón, năng khiếu), danh sách học sinh nợ học phí quá hạn (Age of Debt) và dự báo dòng tiền các tháng tiếp theo.",
            "goals_list": [
                "Cung cấp báo cáo tỷ lệ thu học phí tổng quan và chi tiết theo lớp/khối với biểu đồ trực quan.",
                "Theo dõi chi tiết tình trạng công nợ học sinh: danh sách học sinh chưa nộp, số ngày quá hạn, lịch sử gửi thông báo nhắc nợ.",
                "Phân tích cơ cấu doanh thu theo từng khoản phí (Học phí, Tiền ăn, Cơ sở vật chất, Xe buýt).",
                "Hỗ trợ xuất báo cáo tài chính chuẩn mực định dạng Excel và PDF có chữ ký số phục vụ báo cáo HĐQT / Phòng GD&ĐT."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Lãnh đạo điều hành", "actions": "Theo dõi tiến độ thu phí toàn trường, chỉ đạo kế hoạch thu nợ và cân đối thu chi."},
                {"group": "Kế toán trưởng", "role": "Phân tích tài chính", "actions": "Xuất báo cáo định kỳ tháng/kỳ, rà soát danh sách học sinh nợ phí để gửi thông báo nhắc nhở."}
            ],
            "glossary": [
                {"term": "Tỷ lệ thu (Collection Rate)", "definition": "Tỷ lệ phần trăm giữa tổng số tiền thực thu so với tổng số tiền phải thu của kỳ học phí."},
                {"term": "Tuổi nợ (Aging of Receivables)", "definition": "Số ngày trôi qua kể từ hạn chót nộp học phí mà phụ huynh chưa hoàn thành thanh toán."}
            ]
        },
        "business": {
            "flow_desc": "Hệ thống tự động quét dữ liệu hóa đơn M4/SM1 -> Tính toán tỷ lệ thu và công nợ -> Vẽ biểu đồ phân tích -> Kế toán/BGH xuất báo cáo tài chính.",
            "flow_steps": [
                {"actor": "Hệ thống BE", "action": "Tổng hợp số liệu thời gian thực", "desc": "Tính tổng phải thu, thực thu, còn nợ của toàn trường và từng lớp học."},
                {"actor": "BGH / Kế toán", "action": "Xem Dashboard Báo cáo", "desc": "Mở Tài chính -> Báo cáo học phí, xem biểu đồ tỷ lệ thu và bảng so sánh các lớp."},
                {"actor": "Kế toán", "action": "Lọc danh sách nợ phí", "desc": "Chọn tab 'Công nợ quá hạn' để xem các học sinh nợ trên 15 ngày."},
                {"actor": "Kế toán", "action": "Xuất báo cáo", "desc": "Bấm 'Xuất Excel' để tải bảng tổng hợp số liệu chi tiết."}
            ],
            "steps_narrative": [
                "Bước 1: Người dùng vào Tài chính -> Báo cáo học phí.",
                "Bước 2: Chọn Kỳ báo cáo (Tháng 10/2026 hoặc Học kỳ 1).",
                "Bước 3: Màn hình hiển thị 3 phần: Thẻ KPI doanh thu tổng hợp, Biểu đồ tiến độ thu theo khối, Bảng chi tiết từng lớp học.",
                "Bước 4: Có thể chuyển sang tab 'Báo cáo cơ cấu khoản thu' để xem tỷ trọng tiền ăn và học phí.",
                "Bước 5: Bấm 'Xuất báo cáo Excel' để tải dữ liệu hoàn chỉnh."
            ],
            "rules": [
                {"id": "BR-01", "title": "Độ chính xác dữ liệu 100%", "desc": "Mọi số liệu trong báo cáo phải khớp chính xác 100% với tổng số tiền của các hóa đơn học phí thực tế tại phân hệ M4/SM1."},
                {"id": "BR-02", "title": "Bảo mật số liệu tài chính", "desc": "Chỉ tài khoản có vai trò BGH, Kế toán trưởng hoặc Kế toán viên được phân quyền mới có thể xem màn hình báo cáo tài chính."}
            ],
            "data_entities": [
                {"field": "reportPeriod", "type": "string", "required": True, "desc": "Kỳ báo cáo (ví dụ: 10/2026)."},
                {"field": "totalExpected", "type": "number", "required": True, "desc": "Tổng doanh thu dự kiến phải thu."},
                {"field": "totalCollected", "type": "number", "required": True, "desc": "Tổng số tiền thực tế đã thu được."},
                {"field": "totalOutstanding", "type": "number", "required": True, "desc": "Tổng số tiền còn nợ quá hạn."},
                {"field": "collectionRate", "type": "number", "required": True, "desc": "Tỷ lệ thu phần trăm (0 - 100%)."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-023 Báo cáo học phí & phân tích", "feature": "Báo cáo tiến độ thu học phí đa chiều", "platform": "Web Portal", "priority": "P1", "story": "Là BGH, tôi muốn xem báo cáo tiến độ thu phí để chỉ đạo kế hoạch tài chính kịp thời.", "jira": "BCHP-001"}
            ],
            "use_cases": [
                {
                    "id": "UC-BCHP-01",
                    "name": "Xem báo cáo tỷ lệ thu học phí theo lớp",
                    "actor": "Ban Giám Hiệu / Kế toán",
                    "pre": "Đã có đợt thu học phí phát hành trong tháng.",
                    "happy_path": [
                        "1. Vào Tài chính -> Báo cáo học phí, chọn Tháng 10/2026.",
                        "2. Xem tỷ lệ thu chung toàn trường (VD: 85%).",
                        "3. Rà soát bảng so sánh giữa các lớp (Lớp 1A1 đạt 95%, Lớp 1A2 đạt 70%).",
                        "4. Click vào Lớp 1A2 để xem danh sách các học sinh còn nợ tiền."
                    ],
                    "exceptions": [],
                    "post": "Nắm bắt được lớp nào có tỷ lệ nộp phí thấp để phối hợp GVCN nhắc nhở phụ huynh.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Tài chính</strong> -> Chọn <strong>Báo cáo học phí</strong> (`/[schoolCode]/reports/fee/overview`).",
            "screens_table": [
                {"screen": "SCR-BCHP-01: Báo cáo học phí", "component": "Biểu đồ tiến độ thu (Collection Chart)", "format": "Bar & Donut Charts", "desc": "Biểu đồ tròn thể hiện tỷ lệ Đã thu / Chưa nộp; Biểu đồ cột so sánh tiến độ thu giữa các khối lớp.", "note": "Hover hiển thị số tiền chi tiết"},
                {"screen": "SCR-BCHP-01: Báo cáo học phí", "component": "Bảng tiến độ theo lớp", "format": "Data Table", "desc": "Hiển thị: Tên lớp, Khối, Sĩ số, Phải thu, Đã thu, Còn nợ, Tỷ lệ hoàn thành (Progress bar màu xanh), Nút Xem danh sách nợ.", "note": "Sắp xếp theo thứ tự tỷ lệ thu tăng/giảm dần"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-01",
                "title": "Báo cáo phản ánh chính xác số liệu thu học phí",
                "scenario": "Given toàn trường có 500 học sinh với tổng số tiền phải thu là 1.500.000.000đ\nWhen phụ huynh đã thanh toán được 1.200.000.000đ\nThen báo cáo hiển thị chính xác tỷ lệ thu là 80.0% và số tiền còn nợ là 300.000.000đ."
            }
        ]
    }
]

print("Milestone 1 Sub-modules Part 3 defined successfully with 5 modules!")
