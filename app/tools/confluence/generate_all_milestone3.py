# -*- coding: utf-8 -*-
"""
Generator for tools/confluence/milestone3_data.py containing all 12 Milestone 3 PRDs:
Phase 3A:
  1. M5/SM4: Môn học (Nhà trường)
  2. M5/SM6: Bảng thông tin (Nhà trường)
  3. M5/SM11: Góp ý (Nhà trường)
  4. M5/SM10: Sổ tay PH (Nhà trường)
  5. M5/SM8: Thực đơn (Nhà trường)
  6. M5/SM14: Lưu trữ (Nhà trường)
  7. M5/SM7: Bình chọn (Nhà trường)
Phase 3B:
  8. M3/SM1: Thời khóa biểu (Học tập)
  9. M3/SM2: Bài tập (Học tập)
  10. M3/SM3: Điểm & Đánh giá (Học tập)
  11. M1/SM1: Tổng quan (Tổng quan)
  12. M7/SM1: Khác (Khác)
"""

import json

P3_PRDS = [
    # 27. M5/SM4 - Môn học
    {
        "code": "M5/SM4",
        "name": "M5 - SM4 - Môn học",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Môn học (Subject Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm quản lý danh mục môn học giảng dạy, phân loại môn theo khối/lớp, cấu hình hình thức đánh giá (cho điểm hoặc nhận xét) và phân công giáo viên bộ môn.",
            "goals": "Chuẩn hóa cây danh mục môn học toàn trường, liên kết môn học với Khối lớp (M5/SM5) và Năm học (M5/SM13), làm nền tảng cốt lõi bắt buộc để triển khai Thời khóa biểu (M3/SM1), Bài tập (M3/SM2) và Sổ điểm (M3/SM3).",
            "scope": "Quản trị danh mục môn học văn hóa, năng khiếu, kỹ năng sống và tự chọn cho toàn bộ các cấp học.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M5-nha-truong/4. mon-hoc.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Môn học"},
                {"doc": "Thông tư 22/2021/TT-BGDĐT & 27/2020/TT-BGDĐT", "note": "Quy định về đánh giá học sinh tiểu học và trung học"}
            ]
        },
        "business": {
            "flow_desc": "Ban Giám Hiệu hoặc Giáo vụ khởi tạo danh mục môn học, phân bổ môn theo từng khối lớp, chọn hình thức đánh giá và phân công giáo viên giảng dạy cho từng lớp.",
            "flow_steps": [
                {"actor": "BGH / Giáo vụ", "action": "Khởi tạo môn học", "desc": "Nhập mã môn, tên môn, loại môn (Bắt buộc/Tự chọn) và hình thức đánh giá."},
                {"actor": "Giáo vụ", "action": "Gán khối lớp áp dụng", "desc": "Chọn các khối lớp học môn này và số tiết quy định/tuần."},
                {"actor": "BGH", "action": "Phân công giáo viên", "desc": "Gán giáo viên phụ trách môn học cho từng lớp cụ thể."},
                {"actor": "Hệ thống M3", "action": "Mở khóa học tập", "desc": "Cung cấp danh mục môn cho Thời khóa biểu, Bài tập và Sổ điểm."}
            ],
            "steps_narrative": [
                "Giáo vụ vào Nhà trường -> Môn học, xem danh sách môn học đã khai báo.",
                "Bấm 'Thêm môn học', nhập Mã môn (duy nhất), Tên môn, chọn Khối lớp áp dụng và chọn hình thức đánh giá (Điểm số hoặc Nhận xét).",
                "Phân công giáo viên bộ môn theo từng lớp: chọn lớp, chọn giáo viên chính và giáo viên trợ giảng (nếu có).",
                "Hệ thống kiểm tra ràng buộc: nếu môn học đã có điểm hoặc xếp lịch trong TKB, không cho phép xóa mà chỉ cho phép chuyển sang trạng thái 'Tạm ngưng'."
            ],
            "rules": [
                {"id": "BR-01", "title": "Mã môn học duy nhất", "desc": "Mã môn học là duy nhất trong toàn trường, viết hoa không dấu và không chứa ký tự đặc biệt."},
                {"id": "BR-02", "title": "Bảo vệ môn học đã phát sinh dữ liệu", "desc": "Không cho phép xóa môn học đã có dữ liệu trong Thời khóa biểu, Bài tập hoặc Sổ điểm; chỉ được chuyển trạng thái sang Tạm ngưng."},
                {"id": "BR-03", "title": "Cấu hình hình thức đánh giá", "desc": "Mỗi môn học phải xác định rõ hình thức đánh giá: Thang điểm 10 hoặc Đánh giá bằng nhận xét (Đạt/Chưa đạt) theo quy định Bộ GD&ĐT."},
                {"id": "BR-04", "title": "Phân công giáo viên theo lớp", "desc": "Một môn học trong một lớp có thể có 1 giáo viên phụ trách chính và tối đa 2 trợ giảng."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-028 Quản lý môn học", "feature": "Danh mục môn học", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo vụ, tôi muốn quản lý danh mục môn học để áp dụng cho các khối lớp.", "jira": "MH-001"},
                {"epic": "E-028 Quản lý môn học", "feature": "Phân công giáo viên bộ môn", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn phân công giáo viên phụ trách môn cho từng lớp.", "jira": "MH-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-MH-01",
                    "name": "Thêm mới môn học",
                    "desc": "Giáo vụ tạo môn học mới trong hệ thống.",
                    "actor": "Giáo vụ / Admin",
                    "trigger": "Bấm nút 'Thêm môn học'.",
                    "pre": "Đã có danh sách khối lớp trong hệ thống.",
                    "happy_path": [
                        "1. Người dùng chọn 'Thêm môn học'.",
                        "2. Nhập Mã môn, Tên môn, chọn Khối lớp áp dụng.",
                        "3. Chọn hình thức đánh giá (Điểm số / Nhận xét).",
                        "4. Bấm 'Lưu' -> Hệ thống xác thực và tạo môn học thành công."
                    ],
                    "exceptions": [
                        "Trùng mã môn: Báo lỗi 'Mã môn học đã tồn tại'.",
                        "Chưa chọn khối lớp: Báo lỗi 'Vui lòng chọn ít nhất 1 khối lớp áp dụng'."
                    ],
                    "post": "Môn học hiển thị trên danh sách và sẵn sàng để phân công giảng dạy.",
                    "rules": "BR-01, BR-03"
                },
                {
                    "id": "UC-MH-02",
                    "name": "Phân công giáo viên bộ môn",
                    "desc": "Gán giáo viên phụ trách môn cho từng lớp.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Chọn môn học và bấm 'Phân công giảng dạy'.",
                    "pre": "Đã có danh sách lớp và giáo viên đang hoạt động.",
                    "happy_path": [
                        "1. Hệ thống hiển thị danh sách các lớp thuộc khối áp dụng.",
                        "2. BGH chọn giáo viên phụ trách cho từng lớp.",
                        "3. Bấm 'Lưu phân công' -> Hệ thống ghi nhận quyền chấm điểm và giao bài tập cho giáo viên."
                    ],
                    "exceptions": [
                        "Giáo viên đã nghỉ việc: Không hiển thị trong danh sách lựa chọn."
                    ],
                    "post": "Giáo viên được cấp quyền truy cập sổ điểm và bài tập của môn học tại lớp được phân công.",
                    "rules": "BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Môn học</strong>.",
            "overview_screen": [
                {"component": "Thanh tìm kiếm & Bộ lọc", "format": "Input Text + Select Khối lớp + Select Trạng thái", "desc": "Tìm môn học theo mã hoặc tên, lọc theo khối lớp và tình trạng áp dụng.", "note": "Hỗ trợ lọc nhanh môn Văn hóa / Năng khiếu"},
                {"component": "Bảng danh sách môn học", "format": "Table dữ liệu", "desc": "Hiển thị: STT, Mã môn, Tên môn học, Khối áp dụng, Hình thức đánh giá, Số lớp đang học, Trạng thái (Đang dạy/Tạm ngưng), Thao tác.", "note": "Có nút Phân công và Chỉnh sửa"},
                {"component": "Nút tác vụ chính", "format": "Primary Button", "desc": "Nút 'Thêm môn học' và 'Xuất danh sách Excel'.", "note": "Chỉ BGH và Giáo vụ có quyền"}
            ],
            "form_screen": [
                {"field": "Mã môn học", "type": "Text Input", "validation": "Bắt buộc, tối đa 15 ký tự, chữ hoa không dấu", "note": "BR-01"},
                {"field": "Tên môn học", "type": "Text Input", "validation": "Bắt buộc, tối đa 100 ký tự", "note": "Ví dụ: Toán học, Tiếng Anh, Mỹ thuật"},
                {"field": "Khối lớp áp dụng", "type": "Multi-select Checkbox", "validation": "Bắt buộc chọn ít nhất 1 khối", "note": "Chọn các khối lớp theo học môn này"},
                {"field": "Hình thức đánh giá", "type": "Radio Button", "validation": "Bắt buộc: Điểm số thang 10 / Nhận xét (Đạt - Chưa đạt)", "note": "BR-03"},
                {"field": "Số tiết quy định / tuần", "type": "Number Input", "validation": "Tùy chọn, từ 1 đến 15", "note": "Phục vụ đối chiếu khi xếp Thời khóa biểu"}
            ],
            "notifications": [
                {"context": "Thêm môn học thành công", "type": "Toast Success", "body": "Đã tạo mới môn học {ten_mon} thành công.", "onclick": "Đóng toast"},
                {"context": "Phân công giảng dạy", "type": "In-app Notification", "body": "Thầy/Cô đã được phân công giảng dạy môn {ten_mon} cho lớp {ten_lop}.", "onclick": "Điều hướng đến phân hệ Bài tập / Sổ điểm"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Khởi tạo môn học thành công", "desc": "Người dùng có quyền BGH/Giáo vụ tạo được môn học mới với đầy đủ mã môn, tên môn, khối áp dụng và hình thức đánh giá; dữ liệu lập tức hiển thị trên danh sách."},
            {"id": "AC-02", "title": "Xác thực tính duy nhất của Mã môn học", "desc": "Hệ thống báo lỗi và chặn lưu nếu người dùng nhập mã môn học đã tồn tại trong trường (không phân biệt chữ hoa/thường)."},
            {"id": "AC-03", "title": "Bảo vệ toàn vẹn dữ liệu khi xóa môn học", "desc": "Hệ thống chặn thao tác xóa và hiển thị thông báo yêu cầu chuyển sang 'Tạm ngưng' nếu môn học đã phát sinh tiết dạy trong TKB hoặc điểm số trong Sổ điểm."},
            {"id": "AC-04", "title": "Phân công giáo viên bộ môn chính xác", "desc": "Sau khi BGH phân công giáo viên cho lớp, tài khoản giáo viên được cấp quyền truy cập đúng lớp và môn đó trong phân hệ Bài tập (M3/SM2) và Điểm & Đánh giá (M3/SM3)."}
        ]
    },

    # 28. M5/SM6 - Bảng thông tin
    {
        "code": "M5/SM6",
        "name": "M5 - SM6 - Bảng thông tin",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Bảng thông tin (School Bulletin Board)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> là kênh truyền thông chính thống dùng để đăng tải tin tức, thông báo nội bộ, lịch công tác, hướng dẫn phòng dịch và văn bản chỉ đạo tới giáo viên, nhân viên và phụ huynh.",
            "goals": "Số hóa bản tin trường học, hỗ trợ đăng bài viết kèm hình ảnh/tệp đính kèm, phân nhóm đối tượng nhận tin, ghim tin quan trọng và theo dõi tỷ lệ người đã đọc.",
            "scope": "Truyền thông nội bộ hai chiều trong toàn trường; hỗ trợ cả giao diện Portal Web và hiển thị trên ứng dụng di động dành cho phụ huynh.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M5-nha-truong/6. bang-thong-tin.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Bảng thông tin"},
                {"doc": "Luật An toàn thông tin mạng số 86/2015/QH13", "note": "Quy định về bảo mật và kiểm duyệt nội dung thông tin"}
            ]
        },
        "business": {
            "flow_desc": "Người dùng tạo bài viết thông báo, chọn nhóm đối tượng nhận, đính kèm tệp văn bản/ảnh. Nếu người tạo là giáo viên thì bài viết chuyển vào hàng đợi duyệt của BGH trước khi xuất bản rộng rãi.",
            "flow_steps": [
                {"actor": "Người tạo tin", "action": "Soạn bài viết", "desc": "Nhập tiêu đề, nội dung rich text, đính kèm file và chọn đối tượng nhận tin."},
                {"actor": "BGH / Kiểm duyệt", "action": "Phê duyệt bài viết", "desc": "Kiểm tra nội dung; duyệt xuất bản hoặc từ chối kèm lý do chỉnh sửa."},
                {"actor": "Hệ thống Notification", "action": "Phát thông báo", "desc": "Gửi thông báo đẩy (Push) và đưa bài viết lên bảng tin của người dùng mục tiêu."},
                {"actor": "Phụ huynh / GV", "action": "Đọc bài viết", "desc": "Mở đọc chi tiết bài viết; hệ thống ghi nhận lượt đọc vào thống kê."}
            ],
            "steps_narrative": [
                "Người dùng vào Nhà trường -> Bảng thông tin, xem danh sách các bài viết đã xuất bản và bài viết nháp.",
                "Bấm 'Tạo bài viết', soạn tiêu đề và nội dung bằng trình soạn thảo định dạng phong phú (Rich text editor).",
                "Chọn phạm vi nhận tin: Toàn trường, Khối lớp, Lớp cụ thể hoặc Nhóm giáo viên.",
                "Tùy chọn: Ghim bài viết lên đầu trang, Hẹn giờ xuất bản, hoặc Đính kèm tệp PDF công văn.",
                "Sau khi bài được duyệt và xuất bản, người quản trị có thể xem danh sách chi tiết các phụ huynh/giáo viên đã đọc tin."
            ],
            "rules": [
                {"id": "BR-01", "title": "Phân quyền phê duyệt bài viết", "desc": "Bài viết do giáo viên hoặc nhân viên tạo phải được Ban Giám Hiệu phê duyệt trước khi công khai; bài do BGH/Admin tạo được xuất bản trực tiếp."},
                {"id": "BR-02", "title": "Phạm vi nhận tin mục tiêu", "desc": "Người dùng chỉ nhìn thấy các bài viết được phân quyền gửi tới nhóm đối tượng của mình (Toàn trường, Khối lớp hoặc Lớp học cụ thể)."},
                {"id": "BR-03", "title": "Giới hạn tệp đính kèm", "desc": "Hỗ trợ đính kèm tối đa 5 tệp văn bản (PDF, DOCX) hoặc hình ảnh (PNG, JPG), dung lượng tối đa 20MB/tệp."},
                {"id": "BR-04", "title": "Ghim bài viết ưu tiên", "desc": "Tối đa 3 bài viết được ghim đồng thời lên đầu trang bảng tin; bài viết mới hơn được xếp trước."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-029 Bảng thông tin nhà trường", "feature": "Soạn thảo và xuất bản tin tức", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên/BGH, tôi muốn đăng thông báo để gửi tới toàn bộ phụ huynh hoặc lớp học.", "jira": "BTT-001"},
                {"epic": "E-029 Bảng thông tin nhà trường", "feature": "Kiểm duyệt và thống kê lượt đọc", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn kiểm duyệt bài viết và xem danh sách phụ huynh đã đọc tin.", "jira": "BTT-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-BTT-01",
                    "name": "Tạo và gửi thông báo mới",
                    "desc": "Người dùng soạn bài thông báo và chọn đối tượng nhận.",
                    "actor": "Giáo viên / Ban Giám Hiệu",
                    "trigger": "Bấm 'Tạo bài viết'.",
                    "pre": "Tài khoản có quyền đăng tin trên Bảng thông tin.",
                    "happy_path": [
                        "1. Soạn tiêu đề và nội dung thông báo.",
                        "2. Tải lên tệp đính kèm công văn hoặc ảnh minh họa.",
                        "3. Chọn phạm vi nhận: 'Toàn trường' hoặc chọn lớp cụ thể.",
                        "4. Bấm 'Xuất bản' (hoặc 'Gửi duyệt' nếu là giáo viên)."
                    ],
                    "exceptions": [
                        "Dung lượng tệp vượt quá 20MB: Báo lỗi 'Tệp đính kèm vượt quá giới hạn 20MB'.",
                        "Tiêu đề để trống: Báo lỗi 'Vui lòng nhập tiêu đề bài viết'."
                    ],
                    "post": "Bài viết được lưu và hiển thị trên bảng tin theo đúng phạm vi.",
                    "rules": "BR-01, BR-02, BR-03"
                },
                {
                    "id": "UC-BTT-02",
                    "name": "Theo dõi lượt xem bài viết",
                    "desc": "Xem thống kê số lượng và danh sách người đã đọc thông báo.",
                    "actor": "Ban Giám Hiệu / Người tạo bài",
                    "trigger": "Bấm biểu tượng 'Lượt xem' tại bài viết.",
                    "pre": "Bài viết đã ở trạng thái Đã xuất bản.",
                    "happy_path": [
                        "1. Hệ thống hiển thị modal thống kê lượt xem.",
                        "2. Hiển thị tổng số người nhận, số người đã xem và tỷ lệ % hoàn thành.",
                        "3. Danh sách chi tiết gồm: Tên phụ huynh/học sinh, Lớp, Thời điểm mở đọc tin lần đầu."
                    ],
                    "exceptions": [],
                    "post": "Người quản lý nắm được mức độ tiếp cận thông tin của phụ huynh.",
                    "rules": "BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Bảng thông tin</strong>.",
            "overview_screen": [
                {"component": "Thanh công cụ & Bộ lọc", "format": "Input Tìm kiếm + Select Trạng thái + Select Đối tượng", "desc": "Tìm kiếm bài viết theo từ khóa tiêu đề, lọc theo Đã xuất bản / Chờ duyệt / Bản nháp.", "note": "Hỗ trợ lọc theo ngày đăng"},
                {"component": "Danh sách thẻ bài viết", "format": "Card Grid / List Table", "desc": "Hiển thị: Ảnh đại diện bài viết, Tiêu đề, Badge Ghim, Người đăng, Ngày đăng, Phạm vi nhận, Số lượt xem, Nút thao tác (Sửa/Xóa/Ghim).", "note": "Có chỉ báo bài chờ duyệt màu vàng"},
                {"component": "Nút tác vụ chính", "format": "Primary Button", "desc": "Nút 'Tạo bài viết mới' nổi bật ở góc phải.", "note": "Phân quyền theo vai trò"}
            ],
            "form_screen": [
                {"field": "Tiêu đề bài viết", "type": "Text Input", "validation": "Bắt buộc, tối đa 255 ký tự", "note": "Tiêu đề rõ ràng, súc tích"},
                {"field": "Nội dung bài viết", "type": "Rich Text Editor", "validation": "Bắt buộc, hỗ trợ định dạng chữ, chèn link, chèn ảnh inline", "note": "Trình soạn thảo WYSIWYG"},
                {"field": "Phạm vi đối tượng nhận", "type": "Radio + Multi-select", "validation": "Bắt buộc: Toàn trường / Khối lớp / Lớp học cụ thể / Nhóm giáo viên", "note": "BR-02"},
                {"field": "Tệp đính kèm", "type": "File Upload", "validation": "Tối đa 5 tệp, dung lượng < 20MB/tệp, định dạng PDF, DOCX, JPG, PNG", "note": "BR-03"},
                {"field": "Ghim bài viết lên đầu trang", "type": "Toggle Switch", "validation": "Tùy chọn, tối đa 3 bài ghim", "note": "BR-04"}
            ],
            "notifications": [
                {"context": "Bài viết mới được xuất bản", "type": "Push Notification", "body": "[Thông báo trường]: {tieu_de_bai_viet}", "onclick": "Mở chi tiết bài viết trên App/Web"},
                {"context": "Phê duyệt bài viết", "type": "In-app Alert", "body": "Bài viết '{tieu_de}' của Thầy/Cô đã được Ban Giám Hiệu phê duyệt xuất bản.", "onclick": "Xem bài viết"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Soạn thảo và xuất bản bài viết thành công", "desc": "Người dùng có quyền tạo được bài viết với rich text, hình ảnh và tệp đính kèm hợp lệ; bài viết xuất hiện đúng trên bảng tin của nhóm đối tượng được chọn."},
            {"id": "AC-02", "title": "Quy trình kiểm duyệt bài viết chặt chẽ", "desc": "Bài viết của giáo viên tự động chuyển vào hàng đợi 'Chờ duyệt' và chỉ hiển thị công khai sau khi Ban Giám Hiệu bấm 'Phê duyệt'."},
            {"id": "AC-03", "title": "Cơ chế ghim tin ưu tiên hoạt động chính xác", "desc": "Các bài viết được bật cờ 'Ghim' luôn đứng đầu danh sách tin tức theo thứ tự thời gian ghim; không cho phép ghim quá 3 bài cùng lúc."},
            {"id": "AC-04", "title": "Ghi nhận và hiển thị chính xác lượt đọc tin", "desc": "Hệ thống ghi nhận thời điểm mở đọc tin lần đầu của từng tài khoản và hiển thị danh sách người đã đọc/chưa đọc đầy đủ trong modal thống kê."}
        ]
    }
]

print("Milestone 3 Phase 3A part 1 defined...")
