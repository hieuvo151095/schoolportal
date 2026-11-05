# -*- coding: utf-8 -*-
"""Generator for tools/confluence/milestone2_data.py containing all 10 Milestone 2 PRDs."""

import json

P2_PRDS = [
    # 17. M5/SM9 - Điểm danh NV
    {
        "code": "M5/SM9",
        "name": "M5 - SM9 - Điểm danh NV",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Chấm công &amp; Điểm danh nhân viên (Staff Attendance Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm ghi nhận thời gian làm việc hàng ngày của cán bộ quản lý, giáo viên, nhân viên nhà bếp, bảo vệ và tài xế xe buýt.",
            "goals": "Số hóa sổ chấm công, hỗ trợ điểm danh nhanh (Optimistic UI), ghi nhận giờ đến/giờ về, theo dõi ngày nghỉ có phép/không phép, tính toán tổng công và xuất dữ liệu chấm công phục vụ tính lương hàng tháng.",
            "scope": "Quản trị chấm công toàn bộ cán bộ nhân sự trường học; hỗ trợ cả điểm danh thủ công trên web và nhận diện khuôn mặt AI tại cổng.",
            "references": [
                {"doc": "docs_legacy/operating-portal/nha-truong/9 .diem-danh-nv.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Điểm danh NV"},
                {"doc": "Nghị định 145/2020/NĐ-CP", "note": "Quy định về thời giờ làm việc và nghỉ ngơi"}
            ]
        },
        "business": {
            "flow_desc": "Hàng ngày nhân viên chấm công qua camera AI hoặc cán bộ nhân sự điểm danh trên bảng tổng hợp, ghi nhận trạng thái đi làm, đi muộn, về sớm hoặc nghỉ phép.",
            "flow_steps": [
                {"actor": "Nhân viên", "action": "Chấm công cổng trường", "desc": "Check-in qua camera nhận diện AI hoặc quẹt thẻ từ."},
                {"actor": "Nhân sự", "action": "Điểm danh nhanh", "desc": "Mở bảng điểm danh ngày, bấm 'Điểm danh tất cả' cho nhân viên có mặt."},
                {"actor": "Hệ thống BE", "action": "Tính toán giờ công", "desc": "Đối chiếu giờ check-in với khung giờ quy định trong Cấu hình trường M6/SM1."},
                {"actor": "Kế toán / BGH", "action": "Xuất bảng công tháng", "desc": "Tổng hợp số công chuẩn, số buổi nghỉ phép và xuất file Excel tính lương."}
            ],
            "steps_narrative": [
                "Cán bộ nhân sự vào Nhà trường -> Điểm danh NV, chọn ngày chấm công.",
                "Bảng hiển thị danh sách nhân viên theo tổ bộ môn kèm các cột trạng thái: Đúng giờ, Đi muộn, Về sớm, Nghỉ có phép, Nghỉ không phép.",
                "Áp dụng cơ chế điểm danh nhanh (Optimistic UI): click chuyển trạng thái lập tức cập nhật giao diện và tự động lưu nền.",
                "Bấm vào từng nhân viên để nhập ghi chú hoặc đính kèm đơn xin nghỉ phép.",
                "Cuối tháng xuất bảng tổng hợp công chi tiết."
            ],
            "rules": [
                {"id": "BR-01", "title": "Cơ chế điểm danh nhanh (Optimistic UI)", "desc": "Thao tác điểm danh nhân viên phản hồi giao diện tức thì (< 50ms) và đồng bộ bất đồng bộ xuống CSDL mà không làm gián đoạn trải nghiệm người dùng."},
                {"id": "BR-02", "title": "Bảo vệ sửa lịch sử chấm công", "desc": "Dữ liệu chấm công các tháng trước đã khóa sổ chỉ được chỉnh sửa khi có phê duyệt của Ban Giám Hiệu."},
                {"id": "BR-03", "title": "Phân biệt ngày công có phép và không phép", "desc": "Ngày nghỉ có phép phải có đơn đính kèm và được hưởng lương theo quy định trường; ngày không phép bị trừ công trực tiếp."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-027 Điểm danh nhân viên", "feature": "Bảng điểm danh hàng ngày", "platform": "Portal Web", "priority": "P1", "story": "Là Nhân sự, tôi muốn điểm danh nhanh toàn bộ cán bộ giáo viên trong ngày.", "jira": "DDNV-001"},
                {"epic": "E-027 Điểm danh nhân viên", "feature": "Báo cáo tổng hợp công tháng", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xuất bảng tổng hợp ngày công tháng để tính lương.", "jira": "DDNV-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-DDNV-01",
                    "name": "Điểm danh hàng ngày cho nhân viên",
                    "desc": "Nhân sự chấm công cho cán bộ trường.",
                    "actor": "Cán bộ nhân sự",
                    "trigger": "Chọn ngày làm việc hiện tại.",
                    "pre": "Đã có danh sách nhân viên đang hoạt động.",
                    "happy_path": [
                        "Bấm 'Điểm danh tất cả: Đúng giờ'.",
                        "Chuyển trạng thái 2 nhân viên nghỉ có phép sang 'Có phép'.",
                        "Bấm 'Lưu bảng chấm công'.",
                        "Hệ thống lưu thành công và cập nhật số lượng có mặt."
                    ],
                    "exception": [
                        "Ngày nghỉ lễ: Hiển thị thông báo 'Hôm nay là ngày nghỉ lễ toàn trường'."
                    ],
                    "post": "Bảng công ngày hoàn tất và sẵn sàng cho báo cáo.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/school/staff-attendance</code> hoặc menu <strong>NHÀ TRƯỜNG &gt; Điểm danh NV</strong> (icon <code>faUserClock</code>).",
            "list_overview": "Bảng chấm công ngày kèm bộ chọn ngày, nút 'Điểm danh nhanh cả trường' và các chip trạng thái.",
            "list_fields": [
                {"name": "Nhân viên", "format": "Avatar + Họ tên", "desc": "Họ tên và mã nhân sự.", "note": ""},
                {"name": "Vị trí / Tổ", "format": "Badge", "desc": "Giáo viên, Ban giám hiệu, Bảo vệ, Bếp...", "note": ""},
                {"name": "Giờ đến", "format": "Time (HH:mm)", "desc": "Giờ check-in thực tế.", "note": ""},
                {"name": "Giờ về", "format": "Time (HH:mm)", "desc": "Giờ check-out thực tế.", "note": ""},
                {"name": "Trạng thái", "format": "Radio Group", "desc": "Có mặt, Đi muộn, Về sớm, Có phép, Không phép.", "note": "BR-01"},
                {"name": "Ghi chú", "format": "Text Input inline", "desc": "Lý do đi muộn hoặc đơn phép đính kèm.", "note": "BR-03"}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Lưu điểm danh NV", "type": "Toast (Xanh)", "body": "Đã lưu dữ liệu điểm danh nhân viên thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Phản hồi điểm danh nhanh không giật lag", "desc": "Bấm chọn trạng thái trên hàng nhân viên: icon và màu sắc cập nhật ngay tức thì mà không load lại trang."},
            {"code": "AC-02", "title": "Tự động tính số phút đi muộn", "desc": "Nhân viên check-in sau 08:00 sáng: hệ thống tự động gắn trạng thái 'Đi muộn' và ghi nhận số phút trễ."}
        ]
    },

    # 18. M6/SM4 - Nhận diện
    {
        "code": "M6/SM4",
        "name": "M6 - SM4 - Nhận diện",
        "parent_module": "M6",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Đăng ký &amp; Cấu hình nhận diện khuôn mặt AI (Face Recognition Registration Authority)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> quản lý ngân hàng dữ liệu sinh trắc học khuôn mặt của học sinh và nhân viên, thiết lập ngưỡng tin cậy camera AI điểm danh và gắn thẻ ảnh tự động.",
            "goals": "Thu thập ảnh chân dung đạt chuẩn sinh trắc học, quản trị tỷ lệ phủ sóng đăng ký nhận diện toàn trường (KPI Coverage), cung cấp dữ liệu vector đặc trưng (Embeddings) cho camera AI tại cổng trường và phục vụ tự động gắn thẻ học sinh trong album ảnh Thư viện M2/SM3.",
            "scope": "Trung tâm quản trị sinh trắc học toàn trường; tuân thủ nghiêm ngặt bảo vệ dữ liệu trẻ em theo Nghị định 13/2023/NĐ-CP.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M6-cau-hinh/SM4-nhan-dien.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Nhận diện"},
                {"doc": "Nghị định 13/2023/NĐ-CP", "note": "Quy định bảo vệ dữ liệu sinh trắc học"}
            ]
        },
        "business": {
            "flow_desc": "Thu thập ảnh mẫu, kiểm tra chất lượng ảnh qua AI Quality Check (rõ nét, chính diện, không che mặt), lưu trữ vector sinh trắc học và đồng bộ sang hệ thống camera cổng trường.",
            "flow_steps": [
                {"actor": "Nhân viên / Phụ huynh", "action": "Tải ảnh chân dung", "desc": "Tải ảnh chụp góc thẳng, phông nền sáng, độ phân giải tối thiểu 600x800px."},
                {"actor": "AI Engine", "action": "Kiểm tra chất lượng ảnh", "desc": "Quét góc mặt, độ sắc nét, kiểm tra mắt mở và không đeo kính đen/khẩu trang."},
                {"actor": "Hệ thống BE", "action": "Sinh Face Vector", "desc": "Mã hóa đặc trưng khuôn mặt thành vector 512 chiều bảo mật, xóa ảnh gốc nếu phụ huynh yêu cầu."},
                {"actor": "Camera AI Gateway", "action": "Đồng bộ nhận diện", "desc": "Đồng bộ dữ liệu sang camera cổng để điểm danh tự động khi học sinh bước qua cổng."}
            ],
            "steps_narrative": [
                "Admin vào Cấu hình -> Nhận diện, xem 3 thẻ KPI: Tổng học sinh, Tỷ lệ đã đăng ký (%), Số học sinh chưa có ảnh.",
                "Lọc danh sách học sinh theo trạng thái: 'Đã đăng ký' hoặc 'Chưa có ảnh'.",
                "Bấm 'Tải ảnh nhận diện' cho học sinh, chọn ảnh chân dung đạt chuẩn.",
                "Hệ thống kiểm tra chất lượng và lưu trữ an toàn.",
                "Khi xóa dữ liệu nhận diện: hiển thị modal xác nhận an toàn cao kèm họ tên học sinh và cảnh báo ngắt điểm danh tự động."
            ],
            "rules": [
                {"id": "BR-01", "title": "Chuẩn chất lượng ảnh sinh trắc học", "desc": "Ảnh đăng ký nhận diện bắt buộc phải có 1 khuôn mặt duy nhất, mắt mở rõ ràng, góc nghiêng không quá 15 độ và độ phân giải tối thiểu 480p."},
                {"id": "BR-02", "title": "Bảo vệ xóa dữ liệu sinh trắc học", "desc": "Modal xóa khuôn mặt bắt buộc hiển thị rõ Họ tên học sinh và cảnh báo 'Hành động này sẽ ngắt điểm danh tự động của học sinh tại cổng trường'."},
                {"id": "BR-03", "title": "Mã hóa vector đặc trưng bảo mật", "desc": "Dữ liệu khuôn mặt được lưu trữ dưới dạng vector mã hóa toán học, không thể dịch ngược thành ảnh gốc theo chuẩn Nghị định 13/2023/NĐ-CP."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-033 Cấu hình nhận diện", "feature": "Dashboard tỷ lệ đăng ký khuôn mặt", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn theo dõi tỷ lệ học sinh đã có ảnh nhận diện để hoàn thành đăng ký.", "jira": "ND-001"},
                {"epic": "E-033 Cấu hình nhận diện", "feature": "Đăng ký & Cập nhật ảnh khuôn mặt", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn tải ảnh nhận diện mới cho học sinh để điểm danh camera AI.", "jira": "ND-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-ND-01",
                    "name": "Đăng ký ảnh nhận diện cho học sinh",
                    "desc": "Tải ảnh chân dung mới đạt chuẩn.",
                    "actor": "Quản trị viên",
                    "trigger": "Bấm 'Đăng ký ảnh' trên hàng học sinh chưa có ảnh.",
                    "pre": "Học sinh đang ở trạng thái 'Chưa có ảnh'.",
                    "happy_path": [
                        "Mở modal 'Tải ảnh nhận diện'.",
                        "Chọn tệp ảnh 'portrait-an.jpg'.",
                        "Hệ thống phân tích AI: 'Chất lượng ảnh: Tốt (98%)'.",
                        "Bấm 'Lưu dữ liệu'.",
                        "Học sinh chuyển trạng thái sang 'Đã đăng ký' và tăng tỷ lệ phủ sóng toàn trường."
                    ],
                    "exception": [
                        "Ảnh bị mờ hoặc che mặt: Báo lỗi 'Ảnh không đạt chuẩn: Khuôn mặt bị che khuất hoặc quá mờ'."
                    ],
                    "post": "Học sinh sẵn sàng để camera AI điểm danh tại cổng.",
                    "rules": "BR-01, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/setting/face-recognition</code> hoặc menu <strong>CẤU HÌNH &gt; Nhận diện</strong> (icon <code>faCamera</code>).",
            "list_overview": "Giao diện gồm 3 thẻ KPI trên cùng (Tổng số, % Đã đăng ký, Chưa có ảnh) kèm bảng danh sách học sinh và bộ lọc trạng thái ảnh.",
            "list_fields": [
                {"name": "Học sinh", "format": "Avatar + Họ tên", "desc": "Họ tên và mã học sinh.", "note": ""},
                {"name": "Lớp học", "format": "Badge", "desc": "Lớp học hiện tại.", "note": ""},
                {"name": "Ảnh nhận diện", "format": "Thumbnail + Click to Lightbox", "desc": "Ảnh chân dung mẫu đã duyệt; click để phóng to chất lượng cao.", "note": "BR-01"},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Đã đăng ký (Xanh lá) / Chưa có ảnh (Cam).", "note": ""},
                {"name": "Thao tác", "format": "Action Buttons", "desc": "Tải ảnh mới, Cập nhật ảnh, Xóa dữ liệu nhận diện.", "note": "BR-02"}
            ],
            "form_fields": [
                {"name": "Ảnh chân dung *", "type": "File Dropzone", "validation": "PNG/JPG, dung lượng <= 5MB, 1 khuôn mặt rõ ràng.", "note": "BR-01"}
            ],
            "notifications": [
                {"context": "Xóa ảnh nhận diện", "type": "Confirmation Modal (Đỏ)", "body": "Xác nhận xóa dữ liệu khuôn mặt của bé {studentName}? Bé sẽ không thể điểm danh camera AI.", "onclick": "Xác nhận xóa."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Kiểm tra chất lượng ảnh tự động trước khi lưu", "desc": "Tải lên ảnh phong cảnh không có khuôn mặt hoặc ảnh có 2 người: hệ thống chặn lưu và hiển thị thông báo lỗi 'Ảnh phải chứa duy nhất một khuôn mặt rõ nét'."},
            {"code": "AC-02", "title": "Modal xóa khuôn mặt hiển thị đúng họ tên", "desc": "Bấm nút Xóa ảnh của học sinh A: modal xác nhận bắt buộc hiển thị chính xác chuỗi tên của học sinh A trong câu hỏi xác nhận."}
        ]
    },

    # 19. M6/SM5 - Tính năng
    {
        "code": "M6/SM5",
        "name": "M6 - SM5 - Tính năng",
        "parent_module": "M6",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Bật/Tắt tính năng &amp; Cấu hình học kỳ (Feature Flags &amp; Academic Terms)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> cung cấp bộ công tắc kiểm soát linh hoạt các tính năng tương tác phụ huynh (bình luận, duyệt bình luận) và thiết lập lịch học kỳ chi tiết.",
            "goals": "Tách bạch 2 luồng cấu hình độc lập: (1) Cấu hình hoạt động (Bình luận & Duyệt bình luận) tại <code>/setting/activity</code>, và (2) Cấu hình học kỳ tại <code>/setting/period</code>; thực thi chỉnh sửa dòng bảng inline và khóa tối đa 2 học kỳ/năm theo chuẩn MoET.",
            "scope": "Cấu hình chính sách tương tác cho phân hệ Hoạt động M2/SM2 và khung thời gian cho Sổ điểm M3/SM3.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M6-cau-hinh/SM5-tinh-nang.md", "note": "Đặc tả nghiệp vụ legacy Tính năng"},
                {"doc": "ADR-034 Feature Flags Decoupling", "note": "Tách độc lập công tắc bình luận và giới hạn 2 học kỳ"}
            ]
        },
        "business": {
            "flow_desc": "Quản trị viên cấu hình chính sách bình luận bài viết hoạt động lớp học, và thiết lập ngày bắt đầu/kết thúc của Học kỳ 1 và Học kỳ 2.",
            "flow_steps": [
                {"actor": "Admin Trường", "action": "Cấu hình bình luận", "desc": "Bật/Tắt độc lập: 'Cho phép phụ huynh bình luận' và 'Kiểm duyệt bình luận trước khi hiển thị'."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra Dirty-State", "desc": "Nút 'Cập nhật' chỉ sáng lên khi giá trị công tắc khác biệt với giá trị đã lưu."},
                {"actor": "Admin Trường", "action": "Cấu hình học kỳ", "desc": "Chuyển sang tab Học kỳ, chọn năm học, chỉnh sửa ngày bắt đầu/kết thúc trực tiếp trên dòng (inline)."},
                {"actor": "Hệ thống BE", "action": "Khóa tối đa 2 kỳ", "desc": "Nếu năm học đã có 2 kỳ, nút '+ Thêm học kỳ' tự động bị vô hiệu hóa."}
            ],
            "steps_narrative": [
                "Admin truy cập Cấu hình -> Tính năng (tự động mở tab Hoạt động tại /setting/activity).",
                "Điều chỉnh 2 công tắc: 'Bình luận' và 'Duyệt bình luận'. Hai công tắc này hoàn toàn độc lập, không ép buộc liên đới.",
                "Bấm 'Cập nhật' khi nút kích hoạt để lưu cấu hình.",
                "Chuyển sang tab 'Học kỳ' (/setting/period), chọn Năm học.",
                "Thêm hoặc sửa học kỳ trực tiếp inline trên hàng với 2 nút: Dấu tích xanh (Lưu) và Dấu X xám (Hủy)."
            ],
            "rules": [
                {"id": "BR-01", "title": "Định tuyến kép độc lập chuẩn ADR-034", "desc": "Tab Hoạt động nằm tại URL canonical /setting/activity; tab Học kỳ nằm tại /setting/period; URL /setting/features tự động chuyển hướng về /setting/activity."},
                {"id": "BR-02", "title": "Hai công tắc bình luận hoàn toàn độc lập", "desc": "Công tắc 'Bình luận' và 'Duyệt bình luận' hoạt động tách rời, không có side-effect tự động tắt hoặc bật theo nhau."},
                {"id": "BR-03", "title": "Bất biến nút Cập nhật Dirty-State", "desc": "Nút 'Cập nhật' mặc định bị disabled; chỉ sáng lên khi trạng thái công tắc hiện tại khác với giá trị đã lưu gần nhất."},
                {"id": "BR-04", "title": "Trần tối đa 2 học kỳ / năm học", "desc": "Hệ thống thực thi nghiêm ngặt quy định Bộ GD&ĐT: mỗi năm học chỉ có tối đa 2 kỳ (Kỳ 1, Kỳ 2). Nút '+ Thêm học kỳ' bị disabled khi số kỳ >= 2."},
                {"id": "BR-05", "title": "Chỉnh sửa inline thuần túy và khóa hàng", "desc": "Thao tác thêm/sửa học kỳ diễn ra trực tiếp trên dòng bảng (không modal); khi 1 dòng đang sửa thì toàn bộ nút sửa của các dòng khác bị khóa."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-034 Cấu hình tính năng", "feature": "Cấu hình chính sách bình luận", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn cấu hình cho phép phụ huynh bình luận hoặc duyệt bình luận bài viết.", "jira": "TN-001"},
                {"epic": "E-034 Cấu hình tính năng", "feature": "Thiết lập học kỳ inline", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn cấu hình mốc ngày 2 học kỳ chính quy bằng chỉnh sửa trực tiếp trên bảng.", "jira": "TN-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-TN-01",
                    "name": "Bật duyệt bình luận hoạt động",
                    "desc": "Admin kích hoạt chế độ kiểm duyệt bình luận.",
                    "actor": "Admin Trường",
                    "trigger": "Bật công tắc 'Duyệt bình luận'.",
                    "pre": "Đang ở trang /setting/activity.",
                    "happy_path": [
                        "Admin bật công tắc 'Duyệt bình luận'.",
                        "Nút 'Cập nhật' ở góc phải lập tức sáng xanh.",
                        "Bấm 'Cập nhật'.",
                        "Hệ thống lưu thành công, hiển thị toast xanh và nút 'Cập nhật' trở về disabled."
                    ],
                    "exception": [
                        "Mất kết nối mạng: Báo lỗi và giữ nguyên trạng thái sửa dở dang."
                    ],
                    "post": "Mọi bình luận của phụ huynh trên App ECO Me phải qua giáo viên duyệt mới hiển thị.",
                    "rules": "BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/setting/activity</code> hoặc menu <strong>CẤU HÌNH &gt; Tính năng</strong> (icon <code>faToggleOn</code>).",
            "list_overview": "Giao diện chia 2 tab rõ ràng: Tab 1 'Hoạt động' (/setting/activity) và Tab 2 'Học kỳ' (/setting/period).",
            "list_fields": [
                {"name": "Bình luận", "format": "Toggle Switch", "desc": "Bật/Tắt tính năng bình luận cho phụ huynh.", "note": "BR-02"},
                {"name": "Duyệt bình luận", "format": "Toggle Switch", "desc": "Bắt buộc kiểm duyệt trước khi bình luận công khai.", "note": "BR-02"},
                {"name": "Tên học kỳ", "format": "Inline Text / Input", "desc": "Học kỳ 1, Học kỳ 2.", "note": "BR-04"},
                {"name": "Ngày bắt đầu", "format": "Inline Date Picker", "desc": "Mốc bắt đầu kỳ.", "note": ""},
                {"name": "Ngày kết thúc", "format": "Inline Date Picker", "desc": "Mốc kết thúc kỳ (> bắt đầu).", "note": ""},
                {"name": "Thao tác inline", "format": "Save (Tick xanh) / Cancel (X xám)", "desc": "Lưu hoặc hủy sửa đổi trực tiếp trên dòng.", "note": "BR-05"}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Lưu tính năng thành công", "type": "Toast (Xanh)", "body": "Đã cập nhật cấu hình tính năng thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Nút Cập nhật tuân thủ Dirty-State", "desc": "Khi mở trang, nút 'Cập nhật' bị disabled; chỉ khi bật/tắt ít nhất 1 công tắc khác với giá trị ban đầu thì nút mới được kích hoạt."},
            {"code": "AC-02", "title": "Khóa thêm học kỳ khi đủ 2 kỳ", "desc": "Chọn năm học đã có đủ 2 học kỳ (Kỳ 1 và Kỳ 2): nút '+ Thêm học kỳ' bắt buộc phải bị disabled kèm cảnh báo 'Năm học đã đủ 2 học kỳ'."},
            {"code": "AC-03", "title": "Khóa thao tác sửa chéo giữa các hàng inline", "desc": "Đang chỉnh sửa trên hàng Học kỳ 1: nút Sửa trên hàng Học kỳ 2 phải bị làm mờ (disabled), ngăn chặn xung đột sửa đồng thời."}
        ]
    },

    # 20. M2/SM1 - Điểm danh
    {
        "code": "M2/SM1",
        "name": "M2 - SM1 - Điểm danh",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Điểm danh lớp học &amp; Nề nếp học sinh (Class Attendance &amp; Check-in Cockpit)</strong> thuộc nhóm <strong>M2: Vận hành</strong> là phân hệ vận hành hàng ngày quan trọng nhất của giáo viên chủ nhiệm, quản lý sĩ số, nề nếp, đo thân nhiệt, đón/trả học sinh và tự động kết nối hoàn tiền ăn.",
            "goals": "Cung cấp sổ điểm danh lớp học trực quan theo ngày, hỗ trợ điểm danh check-in buổi sáng, check-out buổi chiều, ghi nhận người đón hộ, cảnh báo học sinh đi muộn sau 08:00, kiểm tra điều kiện hoàn tiền ăn bán trú và gửi thông báo đẩy tức thời cho phụ huynh.",
            "scope": "Vận hành hàng ngày theo từng lớp học tại đường dẫn <code>/class/{classId}/attendance</code>.",
            "references": [
                {"doc": "docs_legacy/operating-portal/van-hanh/diem-danh.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Điểm danh"},
                {"doc": "PRD Hoàn tiền khi nghỉ học", "note": "Cơ chế tính hoàn tiền ăn tự động khi vắng có phép"}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên chủ nhiệm mở sổ điểm danh lớp theo ngày, check-in học sinh đến trường, ghi nhận thân nhiệt/sức khỏe, báo vắng có phép và xác nhận người đón lúc tan trường.",
            "flow_steps": [
                {"actor": "GVCN", "action": "Mở sổ điểm danh ngày", "desc": "Truy cập /class/{classId}/attendance, hệ thống tải danh sách học sinh của lớp."},
                {"actor": "GVCN", "action": "Check-in buổi sáng", "desc": "Bấm 'Điểm danh đến' (Có mặt / Đi muộn / Vắng phép / Vắng không phép)."},
                {"actor": "GVCN", "action": "Nhập thân nhiệt inline", "desc": "Bấm nút +/- hoặc nhập trực tiếp nhiệt độ (ví dụ: 36.8°C), tự động cảnh báo đỏ nếu sốt >= 37.5°C."},
                {"actor": "GVCN", "action": "Check-out buổi chiều", "desc": "Bấm 'Trả học sinh', chọn Người đón (Bố, Mẹ, Người đón hộ ủy quyền)."},
                {"actor": "App ECO Me", "action": "Nhận thông báo đẩy", "desc": "Phụ huynh nhận push noti thông báo con đã đến lớp hoặc đã được đón an toàn."}
            ],
            "steps_narrative": [
                "GVCN chọn Lớp và Ngày điểm danh trên thanh công cụ.",
                "Thanh tóm tắt đầu trang hiển thị tức thì 4 thẻ KPI: Sĩ số lớp, Có mặt, Đi muộn, Vắng mặt (Có phép / Không phép).",
                "Sử dụng nút 'Điểm danh nhanh cả lớp' để tích có mặt cho toàn bộ học sinh.",
                "Với học sinh vắng: chọn Vắng có phép hoặc Vắng không phép; bật cờ 'Hoàn tiền ăn' nếu đơn xin phép gửi trước giờ quy định.",
                "Buổi chiều: thực hiện xác nhận trả trẻ kèm thông tin người đón hợp lệ."
            ],
            "rules": [
                {"id": "BR-01", "title": "Quy tắc cảnh báo đi muộn sau 08:00", "desc": "Học sinh check-in sau 08:00 sáng sẽ tự động được hệ thống gắn nhãn 'Đi muộn' kèm icon đồng hồ màu hồng và thời gian đến thực tế."},
                {"id": "BR-02", "title": "Bắt buộc check-in trước khi check-out", "desc": "Học sinh chưa có giờ check-in đến trường hoặc đang đánh dấu Vắng mặt thì không thể thực hiện hành động Check-out trả học sinh (thông báo MSG01 & MSG02)."},
                {"id": "BR-03", "title": "Cơ chế hoàn tiền ăn bán trú (BR04 & BR04b)", "desc": "Học sinh vắng có phép có đơn gửi trước 07:30 sáng và được GVCN xác nhận sẽ tự động được bật cờ 'Hoàn tiền ăn' để cấn trừ vào hóa đơn tháng sau."},
                {"id": "BR-04", "title": "Nhập thân nhiệt inline tiện lợi", "desc": "Thân nhiệt có thể điều chỉnh trực tiếp bằng nút stepper (- / +) hoặc gõ phím với phím Enter/Blur tự động lưu ngay lập tức."},
                {"id": "BR-05", "title": "Xác thực người đón được ủy quyền", "desc": "Khi check-out trả trẻ, danh sách người đón hiển thị đúng các đối tượng được đăng ký hợp lệ: Bố, Mẹ hoặc Người đón hộ có ủy quyền kèm ảnh định danh."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-001 Điểm danh lớp học", "feature": "Sổ điểm danh hàng ngày", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn điểm danh học sinh đến lớp và về nhà nhanh chóng, chính xác.", "jira": "DD-001"},
                {"epic": "E-001 Điểm danh lớp học", "feature": "Theo dõi thân nhiệt & Sức khỏe", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn đo và ghi nhận thân nhiệt học sinh để phát hiện sớm các bé bị sốt.", "jira": "DD-002"},
                {"epic": "E-001 Điểm danh lớp học", "feature": "Báo vắng & Hoàn tiền ăn", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn ghi nhận học sinh vắng có phép và xác nhận hoàn tiền ăn cho phụ huynh.", "jira": "DD-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-DD-01",
                    "name": "Check-in học sinh có mặt và ghi nhận thân nhiệt",
                    "desc": "GVCN điểm danh sáng cho học sinh.",
                    "actor": "Giáo viên chủ nhiệm",
                    "trigger": "Bấm nút 'Có mặt' trên hàng học sinh.",
                    "pre": "Đang mở sổ điểm danh ngày hiện tại.",
                    "happy_path": [
                        "GVCN bấm nút check-in 'Có mặt'.",
                        "Hệ thống ghi nhận thời gian đến thực tế '07:45'.",
                        "GVCN bấm stepper thân nhiệt lên '36.6°C'.",
                        "Hệ thống lưu thành công, thẻ KPI tăng số Có mặt lên 1.",
                        "Gửi push noti đến App ECO Me của phụ huynh: 'Bé Nguyễn Văn An đã đến lớp lúc 07:45'."
                    ],
                    "exception": [
                        "Học sinh đến sau 08:00: Hệ thống tự động chuyển trạng thái thành 'Đi muộn'."
                    ],
                    "post": "Dữ liệu sẵn sàng cho bữa ăn bán trú trưa.",
                    "rules": "BR-01, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/class/{classId}/attendance</code> hoặc menu <strong>VẬN HÀNH &gt; Điểm danh</strong> (icon <code>faUserCheck</code>).",
            "list_overview": "Bảng điểm danh lớp học kèm 4 thẻ KPI tóm tắt, bộ chọn ngày học, thanh tìm kiếm học sinh và các nút thao tác hàng loạt.",
            "list_fields": [
                {"name": "Học sinh", "format": "Avatar + Họ tên", "desc": "Ảnh đại diện, họ tên và mã học sinh.", "note": ""},
                {"name": "Check-in Đến", "format": "Button / Time Tag", "desc": "Nút bấm 'Có mặt' hoặc hiển thị giờ đến kèm icon muộn.", "note": "BR-01"},
                {"name": "Thân nhiệt", "format": "Stepper (- / +) + Input", "desc": "Hiển thị độ C; chữ đỏ nếu sốt >= 37.5°C.", "note": "BR-04"},
                {"name": "Check-out Về", "format": "Button / Người đón", "desc": "Giờ về và tên người đón (Bố/Mẹ/Đón hộ).", "note": "BR-02, BR-05"},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Có mặt (Xanh), Đi muộn (Cam), Vắng P (Vàng), Vắng KP (Đỏ).", "note": "BR-03"},
                {"name": "Ghi chú sức khỏe", "format": "Text Input inline", "desc": "Ghi chú dặn thuốc hoặc tình trạng sức khỏe bé.", "note": ""}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Điểm danh đến lớp", "type": "Push Notification App ECO Me", "body": "Bé {studentName} đã đến lớp an toàn lúc {checkInTime}.", "onclick": "Mở tab điểm danh trên app."},
                {"context": "Đón trẻ buổi chiều", "type": "Push Notification App ECO Me", "body": "Bé {studentName} đã được {guardianName} đón lúc {checkOutTime}.", "onclick": "Mở tab điểm danh trên app."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Tự động gán nhãn Đi muộn sau 08:00", "desc": "Học sinh điểm danh check-in sau 08:00: hệ thống hiển thị badge 'Đi muộn' màu cam kèm icon đồng hồ màu hồng và ghi nhận đúng giờ đến."},
            {"code": "AC-02", "title": "Chặn check-out đối với học sinh vắng mặt", "desc": "Bấm nút check-out cho học sinh đang ở trạng thái 'Vắng mặt': hệ thống chặn lại và hiển thị cảnh báo 'Không thể trả học sinh đang vắng mặt'."},
            {"code": "AC-03", "title": "Cảnh báo thân nhiệt vượt ngưỡng 37.5°C", "desc": "Nhập thân nhiệt >= 37.5°C: ô số lập tức chuyển sang màu đỏ cảnh báo kèm nhãn 'Sốt'."}
        ]
    }
]

# We need submodules 21 to 26 for Milestone 2:
# 21. M2/SM2 - Hoạt động
# 22. M2/SM4 - Trao đổi
# 23. M6/SM6 - Thông báo
# 24. M2/SM5 - Báo cáo Điểm danh
# 25. M2/SM3 - Thư viện
# 26. M2/SM6 - Báo cáo Mở rộng

REST_21_TO_26 = [
    # 21. M2/SM2 - Hoạt động
    {
        "code": "M2/SM2",
        "name": "M2 - SM2 - Hoạt động",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Nhật ký hoạt động lớp học (Class Activity Feed &amp; Daily Journal)</strong> thuộc nhóm <strong>M2: Vận hành</strong> là kênh truyền thông đa phương tiện giữa giáo viên và phụ huynh, ghi lại các hoạt động học tập, vui chơi, bữa ăn và giấc ngủ của học sinh hàng ngày.",
            "goals": "Cho phép giáo viên đăng tải bài viết kèm ảnh/video, gắn hashtag bài học (#Toán, #TiếngAnh), gắn thẻ học sinh (@An, @Bình), ghim bài viết quan trọng, áp dụng quy trình kiểm duyệt bài đăng (Moderation Queue) và tương tác thả tim/bình luận với phụ huynh.",
            "scope": "Kênh nhật ký hoạt động lớp học tại <code>/class/{classId}/activity</code>, hiển thị trực tiếp lên bảng tin phụ huynh App ECO Me.",
            "references": [
                {"doc": "docs_legacy/operating-portal/van-hanh/hoat-dong.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Hoạt động"}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên soạn thảo bài viết hoạt động, đính kèm ảnh/video, gắn thẻ học sinh, gửi duyệt hoặc đăng trực tiếp theo cấu hình phân quyền.",
            "flow_steps": [
                {"actor": "GVCN", "action": "Soạn bài viết", "desc": "Nhập nội dung, chọn phạm vi đối tượng (Cả lớp hoặc học sinh cụ thể), chèn hashtag bài học."},
                {"actor": "GVCN", "action": "Đính kèm hình ảnh/video", "desc": "Tải nhiều ảnh chụp hoạt động lớp (lưới ảnh tự động co giãn)."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra hàng đợi duyệt", "desc": "Nếu bật duyệt hoạt động: bài viết vào trạng thái 'Chờ duyệt'; nếu không: chuyển 'Đã duyệt' và công bố."},
                {"actor": "Phụ huynh", "action": "Tương tác bảng tin", "desc": "Phụ huynh xem ảnh con trên App ECO Me, thả tim và bình luận động viên."}
            ],
            "steps_narrative": [
                "GVCN vào Vận hành -> Hoạt động của lớp.",
                "Sử dụng khung soạn thảo đa năng: chọn phạm vi đối tượng, gắn thẻ học sinh (@), chèn hashtag môn học (#) hoặc câu mẫu gợi ý ($).",
                "Tải ảnh/video chất lượng cao.",
                "Bấm 'Đăng hoạt động' hoặc 'Gửi duyệt'.",
                "Quản trị viên có thể duyệt bài nhanh với 1 cú click (One-click Approve)."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bắt buộc có văn bản hoặc hình ảnh", "desc": "Bài viết hoạt động bắt buộc phải có ít nhất nội dung văn bản hoặc ít nhất 1 tệp hình ảnh/video đính kèm."},
                {"id": "BR-02", "title": "Ưu tiên bài viết được ghim (Pinned Posts)", "desc": "Các bài viết được ghim (Pinned) luôn luôn hiển thị nổi trên đầu bảng tin hoạt động bất kể thời gian đăng."},
                {"id": "BR-03", "title": "Cơ chế hàng đợi phê duyệt (Moderation Queue)", "desc": "Khi hệ thống bật cờ duyệt bài: bài đăng mới mặc định ở trạng thái 'Chờ duyệt' (cho_duyet); chỉ Admin hoặc BGH duyệt thì phụ huynh mới nhìn thấy."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-002 Hoạt động lớp học", "feature": "Bảng tin hoạt động & Lưới ảnh", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem dòng thời gian hoạt động của lớp kèm lưới ảnh trực quan.", "jira": "HD-001"},
                {"epic": "E-002 Hoạt động lớp học", "feature": "Khung soạn thảo đa năng (Composer)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn soạn bài viết gắn thẻ học sinh và hashtag bài học nhanh chóng.", "jira": "HD-002"},
                {"epic": "E-002 Hoạt động lớp học", "feature": "Hàng đợi kiểm duyệt bài đăng", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn kiểm duyệt nội dung bài đăng trước khi công bố tới phụ huynh.", "jira": "HD-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-HD-01",
                    "name": "Đăng bài viết hoạt động học tập có gắn thẻ",
                    "desc": "GVCN đăng bài hoạt động kèm ảnh lớp.",
                    "actor": "Giáo viên chủ nhiệm",
                    "trigger": "Bấm 'Đăng hoạt động'.",
                    "pre": "Đã có nội dung và ảnh đính kèm.",
                    "happy_path": [
                        "Nhập nội dung 'Giờ học Tiếng Anh vui nhộn với thầy John!'.",
                        "Gắn hashtag '#TiengAnh'.",
                        "Gắn thẻ 3 học sinh xuất sắc: @An, @Bình, @Chi.",
                        "Tải 4 ảnh hoạt động.",
                        "Bấm 'Đăng hoạt động'.",
                        "Hệ thống công bố bài viết, gửi push noti đến phụ huynh 3 bé được gắn thẻ."
                    ],
                    "exception": [
                        "Không có chữ và không có ảnh: Báo lỗi 'Vui lòng nhập nội dung hoặc đính kèm ảnh'."
                    ],
                    "post": "Bài viết xuất hiện trên đầu bảng tin lớp học.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/class/{classId}/activity</code> hoặc menu <strong>VẬN HÀNH &gt; Hoạt động</strong> (icon <code>faClock</code>).",
            "list_overview": "Dòng thời gian hoạt động dạng Feed mạng xã hội hiện đại kèm thanh công cụ lọc trạng thái duyệt và thanh ngữ cảnh bài học bên phải.",
            "list_fields": [
                {"name": "Người đăng", "format": "Avatar + Tên GV + Thời gian", "desc": "Thông tin giáo viên và thời điểm đăng bài.", "note": ""},
                {"name": "Nội dung bài viết", "format": "Rich Text", "desc": "Nội dung, hashtag xanh lá, thẻ học sinh xanh dương.", "note": ""},
                {"name": "Lưới hình ảnh", "format": "Responsive Multi-photo Grid", "desc": "Bố cục 1, 2, 3, 4+ ảnh thông minh, click để mở Lightbox.", "note": ""},
                {"name": "Trạng thái duyệt", "format": "Badge", "desc": "Đã duyệt (Xanh), Chờ duyệt (Cam).", "note": "BR-03"},
                {"name": "Tương tác", "format": "Icons + Counters", "desc": "Số lượt thích (Tim đỏ), Lượt xem, Bình luận.", "note": ""}
            ],
            "form_fields": [
                {"name": "Nội dung hoạt động", "type": "Text Area", "validation": "Tối đa 2000 ký tự.", "note": "BR-01"},
                {"name": "Đính kèm ảnh/video", "type": "Dropzone", "validation": "Tối đa 10 ảnh, dung lượng <= 10MB/tệp.", "note": "BR-01"}
            ],
            "notifications": [
                {"context": "Có hoạt động mới của lớp", "type": "Push Notification App ECO Me", "body": "Cô {teacherName} vừa đăng hoạt động mới của lớp {className}.", "onclick": "Mở xem bài viết."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Bắt buộc có nội dung hoặc hình ảnh", "desc": "Để trống cả ô nội dung văn bản và không tải ảnh: nút Đăng bài bị vô hiệu hóa hoặc bấm vào hiển thị thông báo yêu cầu bổ sung dữ liệu."},
            {"code": "AC-02", "title": "Bài viết ghim luôn ở vị trí đầu tiên", "desc": "Ghim một bài viết bất kỳ: bài viết đó lập tức nổi lên vị trí trên cùng của feed kèm biểu tượng đinh ghim màu xanh nổi bật."},
            {"code": "AC-03", "title": "Phê duyệt nhanh 1-click cho Quản trị viên", "desc": "Trên bài viết có trạng thái 'Chờ duyệt': Admin bấm nút 'Duyệt' là bài viết chuyển trạng thái 'Đã duyệt' và push noti phát đi ngay tức thì."}
        ]
    },

    # 22. M2/SM4 - Trao đổi
    {
        "code": "M2/SM4",
        "name": "M2 - SM4 - Trao đổi",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Trao đổi &amp; Tin nhắn phụ huynh (Parent Messaging &amp; Absence Requests)</strong> thuộc nhóm <strong>M2: Vận hành</strong> là trung tâm tương tác hai chiều trực tiếp giữa nhà trường/giáo viên với phụ huynh học sinh (1:1 và Nhóm lớp), tiếp nhận và phê duyệt đơn xin nghỉ học, dặn thuốc và đón hộ.",
            "goals": "Xây dựng kênh liên lạc chính thức, bảo mật thông tin gia đình, loại bỏ sự phụ thuộc vào các ứng dụng chat bên ngoài (Zalo/Viber); tự động xử lý đơn xin nghỉ học đồng bộ trực tiếp vào sổ điểm danh M2/SM1.",
            "scope": "Kênh trao đổi 1:1 và Nhóm lớp tại <code>/conversations</code> và <code>/conversations/group</code>.",
            "references": [
                {"doc": "docs_legacy/operating-portal/van-hanh/trao-doi.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Trao đổi"}
            ]
        },
        "business": {
            "flow_desc": "Phụ huynh gửi tin nhắn hoặc gửi đơn nghỉ học trên App ECO Me, giáo viên nhận trên Portal, duyệt đơn và phản hồi tin nhắn trực tiếp.",
            "flow_steps": [
                {"actor": "Phụ huynh", "action": "Gửi đơn xin nghỉ học", "desc": "Chọn ngày nghỉ, lý do nghỉ (ốm, việc bận), tải ảnh đơn thuốc hoặc giấy phép."},
                {"actor": "Portal QLTH", "action": "Hiển thị thẻ nghỉ học", "desc": "Tin nhắn hiển thị dạng thẻ tương tác Interactive Absence Card có 2 nút: Xác nhận nghỉ / Từ chối."},
                {"actor": "GVCN", "action": "Duyệt đơn", "desc": "Bấm 'Xác nhận nghỉ'; hệ thống tự động ghi nhận vắng có phép vào sổ điểm danh M2/SM1."},
                {"actor": "Hệ thống BE", "action": "Gửi thông báo", "desc": "Gửi push noti phản hồi cho phụ huynh: 'Đơn xin nghỉ học đã được cô chủ nhiệm xác nhận'."}
            ],
            "steps_narrative": [
                "GVCN vào Vận hành -> Trao đổi, xem danh sách hội thoại chia 2 tab: 'Trực tiếp 1:1' và 'Nhóm'.",
                "Bộ lọc phân loại thông minh: Tất cả, Báo vắng, Dặn thuốc, Đón hộ.",
                "Mở luồng hội thoại với phụ huynh em An: xem lịch sử trao đổi.",
                "Với tin nhắn Báo vắng: bấm 'Xác nhận nghỉ' trực tiếp trên thẻ tin nhắn.",
                "Hệ thống tự động chèn tin nhắn audit hệ thống: 'Giáo viên đã xác nhận đơn nghỉ học ngày DD/MM'."
            ],
            "rules": [
                {"id": "BR-01", "title": "Cấu trúc topo kép: 1:1 và Nhóm", "desc": "Hệ thống tách biệt rành mạch giữa kênh trao đổi cá nhân 1:1 (GV - PH) và kênh trao đổi nhóm (Toàn lớp hoặc nhóm phụ huynh chuyên biệt)."},
                {"id": "BR-02", "title": "Tự động đồng bộ điểm danh khi duyệt đơn", "desc": "Bấm 'Xác nhận nghỉ' trên thẻ đơn báo vắng: hệ thống lập tức cập nhật trạng thái học sinh thành 'Vắng có phép' trên sổ điểm danh M2/SM1 của đúng ngày đó."},
                {"id": "BR-03", "title": "Khử trùng lặp phụ huynh nhiều con (BR08)", "desc": "Trong kênh nhóm lớp, phụ huynh có 2 con học cùng lớp được gộp danh tính hiển thị thông minh dạng 'PH của Em A, Em B' để tránh trùng lặp tin nhắn."},
                {"id": "BR-04", "title": "Thu hồi tin nhắn an toàn (BR12)", "desc": "Giáo viên có quyền thu hồi tin nhắn trong vòng 60 phút kể từ thời điểm gửi nếu phát hiện sai sót nội dung."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-004 Trao đổi phụ huynh", "feature": "Hộp thư hội thoại 1:1 & Nhóm", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn chat trực tiếp với phụ huynh để trao đổi tình hình học sinh.", "jira": "TD-001"},
                {"epic": "E-004 Trao đổi phụ huynh", "feature": "Duyệt thẻ đơn xin nghỉ học tương tác", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn duyệt đơn nghỉ học của phụ huynh với 1 cú click.", "jira": "TD-002"},
                {"epic": "E-004 Trao đổi phụ huynh", "feature": "Quản lý đơn dặn thuốc & Đón hộ", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn theo dõi danh sách dặn thuốc và người đón hộ của lớp.", "jira": "TD-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-TD-01",
                    "name": "Duyệt đơn xin nghỉ học của phụ huynh",
                    "desc": "GVCN tiếp nhận và xác nhận đơn nghỉ học.",
                    "actor": "Giáo viên chủ nhiệm",
                    "trigger": "Bấm 'Xác nhận nghỉ' trên thẻ đơn trong khung chat.",
                    "pre": "Đơn đang ở trạng thái 'Chờ xác nhận'.",
                    "happy_path": [
                        "GVCN đọc lý do 'Bé bị sốt phát ban'.",
                        "Bấm nút 'Xác nhận nghỉ'.",
                        "Thẻ chuyển trạng thái sang 'Đã xác nhận' màu xanh lá.",
                        "Hệ thống tự động cập nhật sổ điểm danh ngày tương ứng thành 'Vắng có phép'.",
                        "Gửi thông báo thành công đến điện thoại phụ huynh."
                    ],
                    "exception": [
                        "Đơn đã bị hủy: Báo lỗi 'Đơn này đã được phụ huynh thu hồi'."
                    ],
                    "post": "Sổ điểm danh được đồng bộ và phụ huynh an tâm.",
                    "rules": "BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/conversations</code> hoặc menu <strong>VẬN HÀNH &gt; Trao đổi</strong> (icon <code>faComments</code>).",
            "list_overview": "Giao diện 2 cột: Cột trái là danh sách hội thoại có bộ lọc chip (Báo vắng, Dặn thuốc, Đón hộ), Cột phải là luồng tin nhắn và khung soạn thảo.",
            "list_fields": [
                {"name": "Hội thoại phụ huynh", "format": "Avatar + Tên PH + Tên HS", "desc": "Ví dụ: Chị Lan (Mẹ bé Minh An).", "note": "BR-03"},
                {"name": "Tin nhắn gần nhất", "format": "Text preview", "desc": "Trích đoạn tin nhắn mới nhất.", "note": ""},
                {"name": "Thời gian", "format": "Timestamp", "desc": "Giờ gửi hoặc ngày gửi.", "note": ""},
                {"name": "Badge chưa đọc", "format": "Red Counter", "desc": "Số lượng tin nhắn mới chưa đọc.", "note": ""},
                {"name": "Thẻ Đơn nghỉ học", "format": "Interactive Card", "desc": "Khung viền vàng nổi bật có nút 'Xác nhận nghỉ' và 'Từ chối'.", "note": "BR-02"}
            ],
            "form_fields": [
                {"name": "Khung soạn tin", "type": "Text Area + Attachments", "validation": "Hỗ trợ gõ chữ, gửi ảnh, tài liệu PDF.", "note": ""}
            ],
            "notifications": [
                {"context": "Xác nhận đơn nghỉ học", "type": "Push Notification App ECO Me", "body": "Cô giáo đã xác nhận đơn xin nghỉ học của bé {studentName}.", "onclick": "Mở màn hình trao đổi."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Đồng bộ tức thời sang phân hệ Điểm danh", "desc": "Bấm 'Xác nhận nghỉ' trên thẻ đơn: chuyển sang màn hình Điểm danh M2/SM1 của đúng ngày đó, học sinh phải tự động được đánh dấu 'Vắng có phép'."},
            {"code": "AC-02", "title": "Ghi nhận tin nhắn hệ thống kiểm toán (Audit Message)", "desc": "Sau khi bấm xác nhận đơn nghỉ, khung chat phải tự động chèn 1 tin nhắn hệ thống ghi nhận thời gian và người duyệt."}
        ]
    },

    # 23. M6/SM6 - Thông báo
    {
        "code": "M6/SM6",
        "name": "M6 - SM6 - Thông báo",
        "parent_module": "M6",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Cấu hình thông báo tự động (Automated Notification Governance Cockpit)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> là trung tâm đầu não điều khiển toàn bộ quy tắc phát tin nhắn, cảnh báo đẩy (Push Noti) và email tự động trong toàn trường.",
            "goals": "Tập trung hóa quy tắc thông báo trên 5 nhóm nghiệp vụ: (1) Điểm danh, (2) Sinh nhật, (3) Học phí, (4) Khác, và (5) Phụ huynh nhận thông báo. Bảo vệ mốc giờ hoạt động cố định (17:00 và 20:00), xử lý tràn ngày cuối tháng (Calendar Overflow Fallback) và bắt buộc modal xác nhận an toàn.",
            "scope": "Điều phối toàn bộ logic phát thông báo tự động tới hàng nghìn ứng dụng phụ huynh và giáo viên.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M6-cau-hinh/SM6-thong-bao.md", "note": "Đặc tả nghiệp vụ legacy Cấu hình thông báo"},
                {"doc": "Nghị định 91/2020/NĐ-CP", "note": "Chống tin nhắn rác, thư điện tử rác"}
            ]
        },
        "business": {
            "flow_desc": "Admin điều chỉnh các quy tắc thông báo trên form nguyên khối, kiểm tra dirty-state, xác nhận qua modal bảo vệ và commit lưu trữ toàn trường.",
            "flow_steps": [
                {"actor": "Admin Trường", "action": "Điều chỉnh quy tắc", "desc": "Bật/Tắt công tắc, chọn phạm vi lớp ngoại khóa, điều chỉnh ngày nhắc học phí tương đối."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra Dirty-State", "desc": "Nút 'Cập nhật' ở thanh cố định phía dưới chỉ kích hoạt khi có thay đổi so với baseline đã lưu."},
                {"actor": "Admin Trường", "action": "Bấm Cập nhật", "desc": "Hệ thống hiển thị modal xác nhận 'Vui lòng xác nhận thay đổi cấu hình thông báo của trường!'."},
                {"actor": "Hệ thống BE", "action": "Commit nguyên khối (Atomic)", "desc": "Lưu toàn bộ 5 nhóm cấu hình cùng lúc, thông báo toast xanh và cập nhật lịch phát tin tự động."}
            ],
            "steps_narrative": [
                "Admin vào Cấu hình -> Thông báo (/setting/notification).",
                "Đọc banner thông tin 3 nguyên tắc ở đầu trang.",
                "Điều chỉnh Thẻ 1 (Điểm danh: giờ 17:00 cố định, chọn lớp ngoại khóa), Thẻ 2 (Sinh nhật: giờ 09:00 cố định), Thẻ 3 (Học phí: nhắc trước/sau hạn X ngày), Thẻ 4 (Khác: công tắc Email riêng biệt), Thẻ 5 (Phụ huynh: từ khóa cam đậm).",
                "Bấm 'Cập nhật' trên sticky action bar.",
                "Xác nhận trên modal: bấm Hủy giữ nguyên chỉnh sửa; bấm Xác nhận lưu atomic vào hệ thống."
            ],
            "rules": [
                {"id": "BR-01", "title": "Kiến trúc Form nguyên khối (Monolithic Save)", "desc": "Toàn bộ 5 nhóm cấu hình được quản lý trên 1 form duy nhất với 1 nút 'Cập nhật' ở thanh cố định phía dưới điều khiển bởi dirty-state predicate (K095)."},
                {"id": "BR-02", "title": "Bắt buộc modal xác nhận an toàn (K096)", "desc": "Bấm 'Cập nhật' bắt buộc hiển thị modal với prompt đúng văn bản: 'Vui lòng xác nhận thay đổi cấu hình thông báo của trường!'. Hủy thì giữ nguyên working edits."},
                {"id": "BR-03", "title": "Xử lý tràn ngày cuối tháng (Calendar Overflow Fallback)", "desc": "Thuật toán adjustDayForMonth tự động co ngày nhắc 29-31 về ngày cuối tháng đối với tháng ngắn (tháng 2 có 28/29 ngày, tháng 4, 6, 9, 11 có 30 ngày) để không sót tin (K097)."},
                {"id": "BR-04", "title": "Hàng lịch sinh nhật không có công tắc độc lập (K098)", "desc": "Hàng tham số ngày và giờ gửi chúc mừng sinh nhật không có công tắc bật/tắt riêng; các công tắc con (Giáo viên / Ban giám hiệu) tự động kế thừa lịch này."},
                {"id": "BR-05", "title": "Bất đối xứng đa kênh: Công tắc Email riêng biệt (K099)", "desc": "Hai công tắc Web/App và Email độc lập chỉ áp dụng nghiêm ngặt cho Mục 4 hàng đợi quản trị ('Hoạt động chờ duyệt' và 'Nhật ký hằng ngày')."},
                {"id": "BR-06", "title": "Khóa cứng giờ vận hành cố định (K100)", "desc": "Các mốc giờ cố định 17:00 (điểm danh) và 20:00 (nhật ký) ở trạng thái readonly màu xám, không thể chỉnh sửa."},
                {"id": "BR-07", "title": "Từ khóa hành động phụ huynh màu cam đậm (K103)", "desc": "Các từ khóa hành động trong Mục 5 ('điểm danh', 'hoạt động', 'album', 'hình/video') bắt buộc in đậm màu cam #EA580C."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-035 Cấu hình thông báo", "feature": "Monolithic Notification Cockpit", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn cấu hình toàn bộ quy tắc thông báo trường trên 1 màn hình an toàn.", "jira": "TB-001"},
                {"epic": "E-035 Cấu hình thông báo", "feature": "Quy tắc nhắc học phí tương đối & Fallback", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn đặt lịch nhắc nợ trước/sau hạn học phí tự động co ngày theo tháng.", "jira": "TB-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-TB-01",
                    "name": "Cập nhật ngày nhắc học phí và xác nhận modal",
                    "desc": "Admin điều chỉnh lịch nhắc nợ học phí.",
                    "actor": "Admin Trường",
                    "trigger": "Thay đổi ngày nhắc học phí sang 'Sau hạn 5 ngày'.",
                    "pre": "Đang mở /setting/notification.",
                    "happy_path": [
                        "Admin chọn 'Sau hạn đóng học phí 5 ngày'.",
                        "Nút 'Cập nhật' ở thanh sticky action bar sáng xanh.",
                        "Bấm 'Cập nhật'.",
                        "Modal hiển thị 'Vui lòng xác nhận thay đổi cấu hình thông báo của trường!'.",
                        "Admin bấm 'Xác nhận'.",
                        "Hệ thống commit atomic, hiển thị toast xanh và vô hiệu hóa nút Cập nhật."
                    ],
                    "exception": [
                        "Bấm Hủy bỏ trên modal: Modal đóng lại, form giữ nguyên giá trị 'Sau hạn 5 ngày', nút Cập nhật vẫn sáng."
                    ],
                    "post": "Hệ thống tự động quét và gửi push noti nhắc nợ sau 5 ngày kể từ dueDate.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/setting/notification</code> hoặc menu <strong>CẤU HÌNH &gt; Thông báo</strong> (icon <code>faBell</code>, vị trí thứ 6).",
            "list_overview": "Màn hình cockpit gồm Banner 3 nguyên tắc đầu trang, 5 thẻ nhóm cấu hình, sticky action bar chân trang và confirmation modal.",
            "list_fields": [
                {"name": "Banner quy định chung", "format": "Info Banner", "desc": "Chi tiết 3 nguyên tắc: Toàn trường, Đa nền tảng, Xử lý tràn ngày cuối tháng.", "note": "BR-03"},
                {"name": "Thẻ 1: Điểm danh", "format": "Card", "desc": "Giờ 17:00 readonly, bộ chọn lớp ngoại khóa.", "note": "BR-06"},
                {"name": "Thẻ 2: Sinh nhật", "format": "Card", "desc": "Ngày 1-31, giờ 09:00 mặc định, công tắc GV/BGH.", "note": "BR-04"},
                {"name": "Thẻ 3: Học phí", "format": "Card", "desc": "Nhắc thay đổi học phí, nhắc quá hạn, nhắc tương đối (Trước/Sau hạn + 1-31 ngày).", "note": "BR-03"},
                {"name": "Thẻ 4: Khác", "format": "Card", "desc": "Tin nhắn trao đổi, dual Web/Email switches, giờ 20:00 readonly.", "note": "BR-05, BR-06"},
                {"name": "Thẻ 5: Phụ huynh", "format": "Card", "desc": "Từ khóa cam đậm #EA580C, danh xưng 'học sinh' chuẩn hóa.", "note": "BR-07"},
                {"name": "Sticky Action Bar", "format": "Bottom Bar", "desc": "Nút 'Cập nhật' duy nhất được điều khiển bởi dirty-state predicate.", "note": "BR-01"}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Lưu cấu hình thông báo", "type": "Toast (Xanh)", "body": "Cập nhật cấu hình thông báo thành công!", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Bắt buộc modal xác nhận khi bấm Cập nhật", "desc": "Bấm nút 'Cập nhật': bắt buộc hiển thị modal với đúng thông điệp 'Vui lòng xác nhận thay đổi cấu hình thông báo của trường!'; bấm Hủy phải giữ nguyên dữ liệu đang sửa trên form."},
            {"code": "AC-02", "title": "Nút Cập nhật vô hiệu hóa khi chưa sửa đổi", "desc": "Mở trang: nút 'Cập nhật' bị disabled; chỉ khi có ít nhất 1 giá trị thay đổi so với baseline thì nút mới được kích hoạt."},
            {"code": "AC-03", "title": "Từ khóa hành động phụ huynh hiển thị màu cam #EA580C", "desc": "Các từ 'điểm danh', 'hoạt động', 'album', 'hình/video' trong thẻ Phụ huynh bắt buộc phải được bọc trong thẻ span với style font-weight: bold và color: #EA580C."},
            {"code": "AC-04", "title": "Thuật toán xử lý tràn ngày cuối tháng", "desc": "Cấu hình nhắc ngày 31: vào tháng 2 (28 ngày), hệ thống tự động co về kích hoạt vào ngày 28 mà không bị bỏ sót."}
        ]
    },

    # 24. M2/SM5 - Báo cáo Điểm danh
    {
        "code": "M2/SM5",
        "name": "M2 - SM5 - Báo cáo Điểm danh",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Báo cáo điểm danh &amp; Phí đón muộn (Monthly Attendance &amp; Overtime Pickup Reports)</strong> thuộc nhóm <strong>M2: Vận hành</strong> cung cấp bảng theo dõi điểm danh chuyên cần theo tháng của học sinh và nhân viên, hỗ trợ chỉnh sửa vắng phép hồi tố và tính toán phụ phí trả trẻ muộn.",
            "goals": "Tổng hợp tỷ lệ chuyên cần theo tháng của từng lớp, hỗ trợ sửa đổi trạng thái vắng có phép/không phép hồi tố cho học sinh, và tự động tính phụ phí trông giữ ngoài giờ (50.000 đ / 30 phút muộn) để gửi hóa đơn thu phí.",
            "scope": "Báo cáo vận hành hàng tháng của phân hệ Điểm danh M2/SM1 tại <code>/reports/attendance</code>.",
            "references": [
                {"doc": "docs_legacy/operating-portal/van-hanh/bao-cao-diem-danh.md", "note": "Đặc tả nghiệp vụ legacy Báo cáo điểm danh"}
            ]
        },
        "business": {
            "flow_desc": "Hệ thống tổng hợp dữ liệu điểm danh theo ma trận lịch tháng, hiển thị trạng thái từng ngày, tính tổng buổi đi học/vắng mặt và xuất bảng phụ phí đón muộn.",
            "flow_steps": [
                {"actor": "GVCN / BGH", "action": "Xem báo cáo tháng", "desc": "Chọn Lớp học và Tháng báo cáo (Lưới ma trận Học sinh x Các ngày trong tháng)."},
                {"actor": "GVCN", "action": "Sửa vắng phép hồi tố", "desc": "Bấm vào ô ngày vắng để đổi giữa 'Có phép (P)' và 'Không phép (KP)' kèm lý do."},
                {"actor": "Hệ thống BE", "action": "Tính phí đón muộn", "desc": "Tính tổng số phút đón sau 17:30 và nhân đơn giá 50.000 đ / mỗi block 30 phút."},
                {"actor": "Kế toán", "action": "Đẩy phí sang hóa đơn", "desc": "Chuyển dữ liệu phụ phí đón muộn sang phân hệ Học phí M4/SM1 để thu tiền tháng tới."}
            ],
            "steps_narrative": [
                "Người dùng vào Vận hành -> Báo cáo điểm danh, chọn tab Học sinh hoặc Nhân viên.",
                "Lưới ma trận hiển thị ký hiệu trực quan: Dấu tích xanh (Đúng giờ), Đồng hồ hồng (Muộn), P vàng (Nghỉ phép), KP đỏ (Không phép).",
                "Xem cột tổng cộng: Tổng ngày học, Tổng vắng phép, Vắng không phép, Số lần muộn.",
                "Bấm vào link 'Xem phụ phí đón muộn' để mở modal chi tiết số phút trễ và tổng tiền thu của từng học sinh."
            ],
            "rules": [
                {"id": "BR-01", "title": "Ma trận lịch tháng động chuẩn xác", "desc": "Số cột của bảng tự động co giãn theo số ngày thực tế của tháng (28, 29, 30, hoặc 31 ngày) kèm thứ trong tuần tiếng Việt (T2, T3, T4, T5, T6, T7, CN)."},
                {"id": "BR-02", "title": "Định mức tính phụ phí đón muộn (BR05 & BR06)", "desc": "Thời gian sau 17:30 bắt đầu tính phí đón muộn; định mức 50.000 VNĐ cho mỗi block 30 phút (trễ từ 1-30 phút tính 50k; 31-60 phút tính 100k)."},
                {"id": "BR-03", "title": "Hồi tố chỉnh sửa trạng thái nghỉ", "desc": "Sửa đổi vắng phép hồi tố bắt buộc phải cập nhật lại ngay tức thì tổng số ngày ăn của tháng phục vụ tính hoàn tiền."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-005 Báo cáo vận hành", "feature": "Ma trận điểm danh tháng học sinh & nhân viên", "platform": "Portal Web", "priority": "P1", "story": "Là BGH/GVCN, tôi muốn xem ma trận điểm danh cả tháng của lớp để nắm tỷ lệ chuyên cần.", "jira": "BCDD-001"},
                {"epic": "E-005 Báo cáo vận hành", "feature": "Báo cáo & Tính phụ phí đón muộn", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xem danh sách các buổi đón muộn và tổng tiền phạt để lập hóa đơn.", "jira": "BCDD-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-BCDD-01",
                    "name": "Xem phụ phí đón muộn của học sinh",
                    "desc": "Kế toán kiểm tra danh sách phụ phí đón trễ tháng 10.",
                    "actor": "Kế toán trường",
                    "trigger": "Bấm link 'Xem phụ phí đón muộn'.",
                    "pre": "Đã có dữ liệu check-out sau 17:30.",
                    "happy_path": [
                        "Hệ thống mở modal 'Chi tiết phụ phí đón muộn'.",
                        "Hiển thị học sinh Nguyễn Văn An: 3 buổi đón muộn (Tổng 75 phút trễ).",
                        "Hệ thống tính toán: 2 block 30p + 1 block 30p = 3 block x 50.000 đ = 150.000 đ.",
                        "Bấm 'Xuất Excel'."
                    ],
                    "exception": [
                        "Không có học sinh muộn: Hiển thị 'Không có lượt đón muộn nào trong tháng'."
                    ],
                    "post": "Dữ liệu sẵn sàng để kết chuyển sang hóa đơn thu phí.",
                    "rules": "BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/reports/attendance</code> hoặc menu <strong>VẬN HÀNH &gt; BC Điểm danh</strong> (icon <code>faFileAlt</code>).",
            "list_overview": "Bảng ma trận tháng toàn màn hình (Scroll ngang) kèm 2 tab Học sinh / Nhân viên và bộ chọn lớp.",
            "list_fields": [
                {"name": "Học sinh", "format": "Text (Cố định cột trái)", "desc": "Họ tên và mã học sinh.", "note": ""},
                {"name": "Các ngày trong tháng", "format": "Ma trận cột (1..31)", "desc": "Tích xanh, Đồng hồ hồng, P, KP.", "note": "BR-01"},
                {"name": "Tổng ngày học", "format": "Number", "desc": "Số ngày có mặt thực tế.", "note": ""},
                {"name": "Vắng P / Vắng KP", "format": "Badge", "desc": "Tổng số buổi nghỉ phép / không phép.", "note": "BR-03"},
                {"name": "Phụ phí đón muộn", "format": "Link (Tiền VNĐ)", "desc": "Số tiền phạt đón trễ; click để xem chi tiết.", "note": "BR-02"}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Cập nhật vắng phép hồi tố", "type": "Toast (Xanh)", "body": "Đã cập nhật trạng thái vắng phép thành công.", "onclick": "Đóng toast."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Tính chính xác số tiền phụ phí đón muộn theo block", "desc": "Học sinh đón lúc 18:05 (muộn 35 phút): hệ thống bắt buộc tính thành 2 block (tương đương 100.000 VNĐ)."},
            {"code": "AC-02", "title": "Cố định cột Học sinh khi cuộn ngang", "desc": "Cuộn ngang bảng ma trận để xem ngày 25-31: cột Họ tên học sinh bên trái phải được ghim cố định (sticky) để dễ đối chiếu."}
        ]
    },

    # 25. M2/SM3 - Thư viện
    {
        "code": "M2/SM3",
        "name": "M2 - SM3 - Thư viện",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Thư viện hình ảnh &amp; Album nhận diện khuôn mặt AI (Media Library &amp; AI Face Tagging)</strong> thuộc nhóm <strong>M2: Vận hành</strong> quản lý kho lưu trữ hình ảnh/video của lớp học và sự kiện toàn trường, tích hợp trí tuệ nhân tạo quét nhận diện khuôn mặt tự động gắn thẻ học sinh.",
            "goals": "Tạo các album ảnh sinh hoạt học đường, tự động quét nhận diện các gương mặt học sinh xuất hiện trong ảnh (AI Tagging Coverage), cho phép phụ huynh lọc và tải về các bức ảnh có mặt con mình một cách nhanh chóng, đồng thời bảo vệ các album mặc định hệ thống.",
            "scope": "Thư viện truyền thông đa phương tiện tại <code>/class/{classId}/media</code>.",
            "references": [
                {"doc": "docs_legacy/operating-portal/van-hanh/thu-vien.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Thư viện"}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên tạo album ảnh, tải hàng loạt ảnh lớp học, hệ thống AI quét nhận diện khuôn mặt tự động gắn thẻ học sinh và phụ huynh xem trên App ECO Me.",
            "flow_steps": [
                {"actor": "GVCN", "action": "Tạo album mới", "desc": "Nhập Tiêu đề album, Mô tả, chọn Phạm vi đối tượng (Cả lớp hoặc nhóm học sinh)."},
                {"actor": "GVCN", "action": "Tải ảnh hàng loạt", "desc": "Tải lên tối đa 100 ảnh chất lượng cao vào album."},
                {"actor": "AI Face Engine", "action": "Quét nhận diện tự động", "desc": "Đối chiếu các khuôn mặt trong ảnh với ngân hàng vector M6/SM4 và tự động gắn thẻ học sinh."},
                {"actor": "Phụ huynh", "action": "Lọc ảnh có mặt con", "desc": "Mở album trên App ECO Me, bấm 'Ảnh có mặt con' để xem ngay các bức ảnh của bé."}
            ],
            "steps_narrative": [
                "GVCN vào Vận hành -> Thư viện ảnh của lớp.",
                "Xem danh sách album chia theo ngày tải lên hoặc dạng lưới album tổng.",
                "Bấm '+ Tạo album mới', nhập tên và chọn ảnh bìa.",
                "Tải ảnh hoạt động vào album; AI tự động quét nhận diện nền.",
                "Bấm 'Báo cáo nhận diện AI' để xem tỷ lệ nhận diện thành công của cả lớp.",
                "Quy tắc bảo vệ: 2 album hệ thống ('Hoạt động' và 'Điểm danh') tuyệt đối không thể xóa hay đổi tên."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo vệ tuyệt đối album hệ thống (BR01)", "desc": "Hai album mặc định của hệ thống gồm 'Hoạt động' và 'Điểm danh' bị khóa hoàn toàn nút Đổi tên và nút Xóa."},
                {"id": "BR-02", "title": "Giới hạn bộ lọc học sinh nâng cao (BR06)", "desc": "Bộ lọc nâng cao trong album cho phép lọc tối đa 5 học sinh cụ thể hoặc lọc 'Cả lớp' / 'Chưa gắn thẻ'."},
                {"id": "BR-03", "title": "Gom nhóm ảnh theo ngày tải lên (BR04)", "desc": "Trong chi tiết album, hình ảnh được tự động gom nhóm theo từng mốc ngày tải lên kèm tên người tải và thời gian tải."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-003 Thư viện ảnh lớp", "feature": "Lưới album & Chi tiết ảnh", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem danh sách các album ảnh của lớp theo sự kiện.", "jira": "TV-001"},
                {"epic": "E-003 Thư viện ảnh lớp", "feature": "AI Facial Recognition Tagging", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN/PH, tôi muốn hệ thống tự động nhận diện khuôn mặt học sinh để tìm ảnh con nhanh.", "jira": "TV-002"},
                {"epic": "E-003 Thư viện ảnh lớp", "feature": "Tải về hàng loạt (Batch Download)", "platform": "Portal Web", "priority": "P1", "story": "Là PH/GV, tôi muốn chọn nhiều ảnh để tải về máy tính với độ phân giải gốc.", "jira": "TV-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-TV-01",
                    "name": "Tạo album dã ngoại và chạy quét AI",
                    "desc": "GVCN tạo album ngoại khóa mới.",
                    "actor": "Giáo viên chủ nhiệm",
                    "trigger": "Bấm nút '+ Tạo album mới'.",
                    "pre": "Đã có ảnh chụp dã ngoại của lớp.",
                    "happy_path": [
                        "Nhập tiêu đề 'Chuyến đi Thảo Cầm Viên 2026'.",
                        "Tải lên 35 ảnh.",
                        "Bấm 'Lưu album & Quét nhận diện AI'.",
                        "Hệ thống tải ảnh lên, quét nhận diện và gắn thẻ tự động cho 28 học sinh.",
                        "Hiển thị thông báo 'Nhận diện thành công 92% học sinh'."
                    ],
                    "exception": [
                        "Trùng tên album hệ thống: Báo lỗi 'Không thể đặt tên trùng với album hệ thống'."
                    ],
                    "post": "Phụ huynh mở app thấy album mới và thông báo có ảnh con.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/class/{classId}/media</code> hoặc menu <strong>VẬN HÀNH &gt; Thư viện</strong> (icon <code>faImages</code>).",
            "list_overview": "Giao diện chuyển đổi giữa 2 chế độ: Chế độ Album (Grid thẻ bìa) và Chế độ Danh sách ảnh gom nhóm theo ngày.",
            "list_fields": [
                {"name": "Ảnh bìa album", "format": "Cover Image", "desc": "Ảnh đại diện của album kèm số lượng ảnh.", "note": ""},
                {"name": "Tên album", "format": "Text (Bold)", "desc": "Tiêu đề album hoạt động.", "note": "BR-01"},
                {"name": "Số lượng ảnh", "format": "Badge", "desc": "Ví dụ: '45 ảnh'.", "note": ""},
                {"name": "Tỷ lệ nhận diện AI", "format": "Progress / %", "desc": "Tỷ lệ học sinh đã được gắn thẻ trong album.", "note": ""},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Chỉnh sửa album, Tải tất cả, Xóa album (chỉ album do người dùng tạo).", "note": "BR-01"}
            ],
            "form_fields": [
                {"name": "Tên album *", "type": "Text Input", "validation": "Bắt buộc, không trùng album hệ thống.", "note": "BR-01"},
                {"name": "Mô tả", "type": "Text Area", "validation": "Tùy chọn, tối đa 500 ký tự.", "note": ""}
            ],
            "notifications": [
                {"context": "Quét nhận diện AI hoàn tất", "type": "Toast (Xanh)", "body": "Đã hoàn thành quét nhận diện khuôn mặt cho album ảnh.", "onclick": "Xem chi tiết."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Bảo vệ không cho phép xóa album Hoạt động và Điểm danh", "desc": "Trên hàng của 2 album hệ thống 'Hoạt động' và 'Điểm danh': nút Đổi tên và nút Xóa bị vô hiệu hóa hoặc ẩn hoàn toàn."},
            {"code": "AC-02", "title": "Giới hạn chọn tối đa 5 học sinh ở bộ lọc nâng cao", "desc": "Mở popup lọc ảnh nâng cao: chọn đến học sinh thứ 5 thì các checkbox của các học sinh còn lại bị làm mờ (disabled)."}
        ]
    },

    # 26. M2/SM6 - Báo cáo Mở rộng
    {
        "code": "M2/SM6",
        "name": "M2 - SM6 - Báo cáo Mở rộng",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Báo cáo đánh giá định kỳ &amp; Mở rộng (Extended Developmental Reports &amp; Checklists)</strong> thuộc nhóm <strong>M2: Vận hành</strong> quản lý các biểu mẫu báo cáo đánh giá sự phát triển của học sinh theo mẫu chuẩn quy định của trường hoặc của Sở GD&ĐT.",
            "goals": "Cung cấp các mẫu đánh giá phát triển (nhận thức, ngôn ngữ, thể chất, kỹ năng xã hội), hỗ trợ giáo viên đánh giá checklist theo tiêu chí, ghi nhận lời nhận xét tổng quát, nhân bản (clone) báo cáo theo mẫu cố định và ký duyệt số 3 bên (GVCN, BGH, Phụ huynh).",
            "scope": "Báo cáo học vụ toàn diện tại <code>/reports/extended</code> và <code>/reports/extended/{reportId}</code>.",
            "references": [
                {"doc": "docs_legacy/operating-portal/van-hanh/bao-cao-mo-rong.md", "note": "Đặc tả nghiệp vụ legacy Báo cáo mở rộng"}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên tạo phiếu đánh giá định kỳ từ mẫu chuẩn, đánh giá từng tiêu chí, gửi duyệt BGH và xuất bản tới phụ huynh.",
            "flow_steps": [
                {"actor": "GVCN", "action": "Tạo báo cáo mới", "desc": "Chọn Mẫu đánh giá (ví dụ: 'Đánh giá phát triển Mầm non 5 tuổi'), chọn Học sinh và Kỳ đánh giá."},
                {"actor": "GVCN", "action": "Điền checklist tiêu chí", "desc": "Tích chọn mức độ: Đạt / Chưa đạt / Cần cố gắng cho từng kỹ năng."},
                {"actor": "GVCN", "action": "Nhập nhận xét tổng quát", "desc": "Ghi nhận xét ưu điểm và định hướng phát triển cho trẻ."},
                {"actor": "Hệ thống BE", "action": "Chuyển trạng thái vòng đời", "desc": "Tiến trình một chiều: Bản nháp (draft) -> Đã gửi duyệt (sent) -> Hoàn thành (completed)."}
            ],
            "steps_narrative": [
                "GVCN vào Vận hành -> Báo cáo mở rộng.",
                "Xem danh sách các phiếu đánh giá theo lớp và kỳ học.",
                "Bấm '+ Tạo báo cáo mở rộng', chọn mẫu đánh giá chuẩn và học sinh.",
                "Chức năng Nhân bản (Clone): cho phép sao chép cấu trúc mẫu sang học sinh khác nhưng xóa trắng kết quả đánh giá để điền mới.",
                "Chỉ báo cáo ở trạng thái 'Bản nháp' mới có nút Xóa; báo cáo đã gửi hoặc hoàn thành bị khóa xóa vĩnh viễn."
            ],
            "rules": [
                {"id": "BR-01", "title": "Quy tắc xóa nghiêm ngặt chỉ áp dụng Bản nháp (BR03)", "desc": "Chỉ có các báo cáo ở trạng thái 'Bản nháp' (draft) mới hiển thị nút Xóa; báo cáo đã gửi (sent) hoặc hoàn tất (completed) tuyệt đối không thể xóa."},
                {"id": "BR-02", "title": "Tiến trình vòng đời một chiều (BR02 & BR09)", "desc": "Vòng đời báo cáo chỉ tiến một chiều: Bản nháp (draft) -> Đã gửi (sent) -> Hoàn thành (completed); không thể chuyển ngược trạng thái."},
                {"id": "BR-03", "title": "Nhân bản giữ nguyên cấu trúc mẫu (BR08)", "desc": "Thao tác nhân bản báo cáo (Clone) giữ nguyên toàn bộ bộ khung tiêu chí của mẫu nhưng xóa trắng toàn bộ điểm đánh giá và nhận xét của học sinh cũ."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-005 Báo cáo vận hành", "feature": "Danh sách báo cáo đánh giá định kỳ", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem danh sách các phiếu đánh giá của học sinh theo kỳ.", "jira": "BCMR-001"},
                {"epic": "E-005 Báo cáo vận hành", "feature": "Checklist tiêu chí & Nhận xét tổng quát", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn đánh giá chi tiết theo ma trận tiêu chí phát triển của trẻ.", "jira": "BCMR-002"},
                {"epic": "E-005 Báo cáo vận hành", "feature": "Nhân bản báo cáo cố định mẫu (Clone)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn nhân bản mẫu đánh giá cho học sinh khác trong lớp.", "jira": "BCMR-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-BCMR-01",
                    "name": "Đánh giá checklist và hoàn tất phiếu phát triển",
                    "desc": "GVCN đánh giá phiếu phát triển học kỳ cho học sinh.",
                    "actor": "Giáo viên chủ nhiệm",
                    "trigger": "Mở phiếu đánh giá của học sinh.",
                    "pre": "Phiếu đang ở trạng thái 'Bản nháp'.",
                    "happy_path": [
                        "Đánh giá 15 tiêu chí phát triển nhận thức và thể chất.",
                        "Nhập nhận xét 'Bé nhanh nhẹn, hòa đồng, tự tin phát biểu'.",
                        "Bấm 'Hoàn thành và Gửi phụ huynh'.",
                        "Phiếu chuyển trạng thái sang 'Hoàn thành' và phát hành lên App ECO Me."
                    ],
                    "exception": [
                        "Chưa đánh giá hết các tiêu chí bắt buộc: Báo lỗi 'Vui lòng hoàn thành tất cả tiêu chí đánh giá'."
                    ],
                    "post": "Phụ huynh xem được phiếu đánh giá điện tử chính thức.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Truy cập đường dẫn <code>/{schoolCode}/reports/extended</code> hoặc menu <strong>VẬN HÀNH &gt; BC Mở rộng</strong> (icon <code>faClipboardList</code>).",
            "list_overview": "Bảng danh sách phiếu đánh giá kèm bộ lọc Mẫu báo cáo, Kỳ đánh giá, Trạng thái vòng đời và nút tạo mới.",
            "list_fields": [
                {"name": "Học sinh", "format": "Avatar + Họ tên", "desc": "Thông tin học sinh được đánh giá.", "note": ""},
                {"name": "Mẫu báo cáo", "format": "Badge", "desc": "Tên biểu mẫu chuẩn (ví dụ: Mầm non 5 tuổi).", "note": ""},
                {"name": "Kỳ đánh giá", "format": "Text", "desc": "Học kỳ 1, Cuối năm học...", "note": ""},
                {"name": "Trạng thái", "format": "Status Badge", "desc": "Bản nháp (Xám), Đã gửi (Lam), Hoàn thành (Xanh lá).", "note": "BR-02"},
                {"name": "Thao tác", "format": "Dropdown (•••)", "desc": "Xem chi tiết, Chỉnh sửa, Nhân bản (Clone), Xóa (chỉ bản nháp).", "note": "BR-01, BR-03"}
            ],
            "form_fields": [],
            "notifications": [
                {"context": "Xuất bản báo cáo thành công", "type": "Push Notification App ECO Me", "body": "Nhà trường đã gửi Phiếu đánh giá định kỳ học kỳ 1 của bé {studentName}.", "onclick": "Mở xem phiếu đánh giá."}
            ]
        },
        "acceptance_criteria": [
            {"code": "AC-01", "title": "Khóa cứng nút Xóa khi không phải Bản nháp", "desc": "Phiếu đánh giá ở trạng thái 'Đã gửi' hoặc 'Hoàn thành': nút Xóa bắt buộc phải biến mất hoàn toàn khỏi menu thao tác."},
            {"code": "AC-02", "title": "Nhân bản phiếu làm sạch dữ liệu cũ", "desc": "Bấm 'Nhân bản' phiếu đánh giá sang học sinh mới: toàn bộ checklist và ô nhận xét của học sinh mới phải hoàn toàn trống để giáo viên đánh giá lại."}
        ]
    }
]

P2_PRDS.extend(REST_21_TO_26)

content = f'''# -*- coding: utf-8 -*-
"""
Milestone 2 PRD Definitions for Portal QLTH (Rebuild Roadmap).
Total: {len(P2_PRDS)} sub-modules.
Generated automatically.
"""

MILESTONE_2_PRDS = {json.dumps(P2_PRDS, ensure_ascii=False, indent=2)}
'''

with open('tools/confluence/milestone2_data.py', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully generated tools/confluence/milestone2_data.py with {len(P2_PRDS)} sub-modules!")
