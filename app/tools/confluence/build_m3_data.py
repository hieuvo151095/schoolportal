# -*- coding: utf-8 -*-
"""Data definitions for all 12 Milestone 3 PRDs."""
import json

MODULES_3A = [
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
    },

    # 29. M5/SM11 - Góp ý
    {
        "code": "M5/SM11",
        "name": "M5 - SM11 - Góp ý",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Góp ý &amp; Phản hồi (Feedback Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> là cầu nối tiếp nhận ý kiến đóng góp, phản ánh chất lượng giảng dạy, dịch vụ bán trú, xe buýt đưa đón và cơ sở vật chất từ phía phụ huynh và giáo viên.",
            "goals": "Lắng nghe ý kiến đa chiều, tự động phân luồng xử lý tới các bộ phận liên quan, đảm bảo thời hạn giải quyết (SLA 48h), bảo vệ tính ẩn danh của người phản ánh và nâng cao chất lượng dịch vụ giáo dục.",
            "scope": "Tiếp nhận và xử lý khiếu nại, phản hồi của toàn bộ phụ huynh và cán bộ giáo viên trên Web Portal và Mobile App.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M5-nha-truong/11. gop-y.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Góp ý"},
                {"doc": "Quy trình giải quyết khiếu nại nội bộ Finviet / School Portal", "note": "SLA và quy tắc bảo mật danh tính"}
            ]
        },
        "business": {
            "flow_desc": "Phụ huynh gửi góp ý kèm tùy chọn ẩn danh; hệ thống phân loại chuyên mục và điều hướng tới bộ phận phụ trách; nhà trường phản hồi và phụ huynh đánh giá mức độ hài lòng.",
            "flow_steps": [
                {"actor": "Phụ huynh / GV", "action": "Gửi ý kiến đóng góp", "desc": "Chọn chuyên mục (Bán trú/Học tập/Học phí/CSVC), soạn nội dung, chọn ẩn danh hoặc công khai."},
                {"actor": "Hệ thống BE", "action": "Tự động phân luồng", "desc": "Gửi thông báo đến cán bộ phụ trách chuyên mục tương ứng kèm đếm ngược SLA 48h."},
                {"actor": "Cán bộ chuyên trách", "action": "Xử lý và phản hồi", "desc": "Kiểm tra thực tế, cập nhật tiến độ xử lý và gửi câu trả lời chính thức."},
                {"actor": "Phụ huynh", "action": "Đánh giá kết quả", "desc": "Xem phản hồi, chấm điểm hài lòng (1-5 sao) hoặc gửi thêm câu hỏi làm rõ."}
            ],
            "steps_narrative": [
                "Cán bộ quản trị vào Nhà trường -> Góp ý, xem danh sách phản hồi theo các tab: Chờ xử lý, Đang xử lý, Đã phản hồi, Đã đóng.",
                "Hệ thống hiển thị nhãn chuyên mục, cờ Ẩn danh (nếu phụ huynh chọn) và chỉ số cảnh báo thời hạn SLA.",
                "Bấm vào từng góp ý để xem nội dung chi tiết, hình ảnh bằng chứng đính kèm và trao đổi nội bộ giữa các phòng ban.",
                "Nhập phản hồi chính thức cho phụ huynh và bấm 'Gửi phản hồi'.",
                "Sau khi gửi phản hồi, hệ thống gửi thông báo push về điện thoại phụ huynh; nếu sau 7 ngày phụ huynh không có phản hồi thêm thì luồng góp ý tự động đóng."
            ],
            "rules": [
                {"id": "BR-01", "title": "Bảo vệ tuyệt đối tính ẩn danh", "desc": "Khi người gửi chọn chế độ Ẩn danh, họ tên học sinh và phụ huynh hoàn toàn bị mã hóa, giáo viên và cán bộ tiếp nhận chỉ thấy mã ngẫu nhiên (VD: PH-Ẩn-Danh-882); chỉ Super Admin có quyền kiểm toán khi có sự cố nghiêm trọng."},
                {"id": "BR-02", "title": "SLA xử lý phản hồi 48 giờ", "desc": "Thời gian tối đa để nhà trường đưa ra phản hồi ban đầu là 48 giờ làm việc kể từ thời điểm tiếp nhận; quá hạn sẽ đổi màu cảnh báo đỏ trên dashboard."},
                {"id": "BR-03", "title": "Phân luồng theo chuyên mục nghiệp vụ", "desc": "Góp ý về 'Học phí' chuyển thẳng tới Kế toán; 'Bán trú & Suất ăn' chuyển tới Quản lý dinh dưỡng; 'Chất lượng đào tạo' chuyển tới Hiệu phó phụ trách chuyên môn."},
                {"id": "BR-04", "title": "Tự động đóng góp ý hoàn tất", "desc": "Sau khi nhà trường gửi phản hồi, nếu phụ huynh không có ý kiến phản hồi lại trong vòng 7 ngày thì hệ thống tự động chuyển trạng thái sang Đã đóng."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-030 Quản lý góp ý & phản ánh", "feature": "Tiếp nhận và phân luồng góp ý", "platform": "Portal Web", "priority": "P1", "story": "Là Cán bộ quản lý, tôi muốn xem các góp ý được phân chia theo phòng ban để giải quyết kịp thời.", "jira": "GY-001"},
                {"epic": "E-030 Quản lý góp ý & phản ánh", "feature": "Trao đổi và phản hồi phụ huynh", "platform": "Portal Web", "priority": "P1", "story": "Là Nhà trường, tôi muốn gửi câu trả lời và xem đánh giá mức độ hài lòng của phụ huynh.", "jira": "GY-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-GY-01",
                    "name": "Xử lý và phản hồi góp ý",
                    "desc": "Cán bộ trường trả lời phản hồi cho phụ huynh.",
                    "actor": "Cán bộ chuyên trách / BGH",
                    "trigger": "Chọn góp ý ở trạng thái 'Chờ xử lý'.",
                    "pre": "Đã có góp ý được gửi vào hệ thống.",
                    "happy_path": [
                        "1. Mở chi tiết góp ý, đọc nội dung và xem hình ảnh đính kèm.",
                        "2. Nhập nội dung phản hồi chính thức.",
                        "3. Đính kèm biên bản kiểm tra hoặc hình ảnh minh chứng (nếu có).",
                        "4. Bấm 'Gửi phản hồi' -> Hệ thống chuyển trạng thái sang 'Đã phản hồi' và gửi thông báo push cho phụ huynh."
                    ],
                    "exceptions": [
                        "Nội dung phản hồi rỗng: Báo lỗi 'Vui lòng nhập nội dung phản hồi'."
                    ],
                    "post": "Phụ huynh nhận được phản hồi và có thể chấm điểm sao mức độ hài lòng.",
                    "rules": "BR-02, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Góp ý</strong>.",
            "overview_screen": [
                {"component": "Tabs trạng thái xử lý", "format": "Tab Navigation", "desc": "Các tab: Tất cả, Chờ xử lý (có badge số đếm), Đang xử lý, Đã phản hồi, Đã đóng.", "note": "Hỗ trợ lọc nhanh theo chuyên mục"},
                {"component": "Bảng danh sách góp ý", "format": "Table dữ liệu", "desc": "Hiển thị: Mã góp ý, Ngày gửi, Người gửi (hoặc Ẩn danh), Chuyên mục, Tiêu đề tóm tắt, Cảnh báo SLA, Trạng thái, Thao tác.", "note": "Cảnh báo quá hạn SLA đổi nền đỏ nhạt"},
                {"component": "Bộ lọc chuyên sâu", "format": "Dropdown Select", "desc": "Lọc theo: Chuyên mục, Lớp học, Khoảng thời gian gửi, Đánh giá sao.", "note": "Hỗ trợ xuất báo cáo Excel"}
            ],
            "form_screen": [
                {"field": "Thông tin người gửi", "type": "Display Text", "validation": "Hiển thị 'Ẩn danh' hoặc Tên phụ huynh kèm SĐT", "note": "BR-01"},
                {"field": "Chuyên mục góp ý", "type": "Select Box", "validation": "Bắt buộc: Bán trú / Học vụ / Cơ sở vật chất / Đưa đón / Học phí", "note": "BR-03"},
                {"field": "Nội dung phản ánh", "type": "Text Area (Read-only)", "validation": "Hiển thị toàn bộ nội dung của người gửi", "note": "Kèm ảnh chụp đính kèm"},
                {"field": "Nội dung phản hồi nhà trường", "type": "Text Area", "validation": "Bắt buộc khi gửi trả lời, tối thiểu 10 ký tự", "note": "Lời lẽ lịch sự, chuẩn mực sư phạm"},
                {"field": "Tệp đính kèm phản hồi", "type": "File Upload", "validation": "Tối đa 3 file ảnh/văn bản giải trình", "note": "Tùy chọn"}
            ],
            "notifications": [
                {"context": "Có góp ý mới gửi đến", "type": "In-app Alert", "body": "Có 1 ý kiến góp ý mới thuộc chuyên mục {chuyen_muc} cần xử lý.", "onclick": "Mở danh sách Góp ý"},
                {"context": "Nhà trường đã phản hồi", "type": "Push Notification", "body": "Nhà trường đã phản hồi ý kiến góp ý mã #{ma_gop_y} của bạn. Chạm để xem chi tiết.", "onclick": "Mở app xem phản hồi"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Tiếp nhận và phân luồng góp ý chính xác", "desc": "Góp ý mới được hiển thị ngay lập tức trong tab 'Chờ xử lý' với đúng phân loại chuyên mục và bộ phận tiếp nhận."},
            {"id": "AC-02", "title": "Bảo vệ thông tin người gửi ẩn danh", "desc": "Toàn bộ thông tin học sinh, phụ huynh và số điện thoại bị ẩn hoàn toàn đối với giáo viên và cán bộ giải quyết khi người gửi chọn chế độ ẩn danh."},
            {"id": "AC-03", "title": "Cảnh báo thời hạn SLA 48h trực quan", "desc": "Hệ thống đếm ngược 48 giờ làm việc và hiển thị cờ cảnh báo màu vàng khi còn dưới 12h, màu đỏ khi đã quá hạn xử lý."},
            {"id": "AC-04", "title": "Gửi phản hồi và tự động đóng luồng theo quy định", "desc": "Nhà trường gửi phản hồi kích hoạt thông báo push thành công cho phụ huynh; luồng góp ý tự động đóng sau 7 ngày nếu không phát sinh thảo luận thêm."}
        ]
    },

    # 30. M5/SM10 - Sổ tay PH
    {
        "code": "M5/SM10",
        "name": "M5 - SM10 - Sổ tay PH",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Sổ tay phụ huynh (Parent Handbook)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> là kho lưu trữ và công bố cẩm nang học đường điện tử, bao gồm nội quy trường học, chính sách đồng phục, quy trình đưa đón, biểu phí năm học và danh bạ liên lạc các phòng ban hỗ trợ.",
            "goals": "Cung cấp tài liệu số minh bạch, dễ dàng tra cứu mọi lúc mọi nơi trên ứng dụng di động của phụ huynh, quản lý phiên bản tài liệu theo năm học và giảm thiểu tài liệu in ấn giấy.",
            "scope": "Quản lý và xuất bản tài liệu hướng dẫn, cẩm nang điện tử áp dụng cho toàn bộ phụ huynh trong trường.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M5-nha-truong/10. so-tay-ph.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Sổ tay PH"},
                {"doc": "Quy chế hoạt động nhà trường và điều lệ trường học", "note": "Văn bản pháp lý và quy định nội bộ"}
            ]
        },
        "business": {
            "flow_desc": "Ban Giám Hiệu tạo các chương mục sổ tay, tải lên tài liệu định dạng PDF hoặc bài viết số hóa theo năm học; phụ huynh mở app tra cứu trực tiếp hoặc tải về máy.",
            "flow_steps": [
                {"actor": "BGH / Admin", "action": "Khởi tạo mục sổ tay", "desc": "Đặt tên mục (Nội quy, Đưa đón, Y tế, Biểu phí), chọn năm học áp dụng."},
                {"actor": "Admin", "action": "Tải tài liệu PDF / Soạn thảo", "desc": "Tải lên tệp cẩm nang hoàn chỉnh hoặc soạn bài viết số hóa."},
                {"actor": "BGH", "action": "Xuất bản sổ tay", "desc": "Bật công khai tài liệu cho phụ huynh năm học mới."},
                {"actor": "Phụ huynh", "action": "Tra cứu sổ tay", "desc": "Mở ứng dụng xem trực tiếp qua trình xem PDF tích hợp."}
            ],
            "steps_narrative": [
                "Quản trị viên vào Nhà trường -> Sổ tay PH, xem danh sách các danh mục tài liệu đã thiết lập theo năm học.",
                "Bấm 'Thêm tài liệu sổ tay', nhập Tên tài liệu, chọn Chuyên mục (Nội quy học sinh, Cẩm nang phụ huynh, Hướng dẫn dịch vụ bán trú, Đường dây nóng).",
                "Tải lên tệp PDF hoặc nhập nội dung văn bản trực tiếp.",
                "Bật trạng thái 'Kích hoạt' -> Tài liệu lập tức xuất hiện trong mục Sổ tay PH trên Mobile App của phụ huynh.",
                "Hệ thống tự động lưu vết các lần cập nhật tài liệu để theo dõi lịch sử phiên bản."
            ],
            "rules": [
                {"id": "BR-01", "title": "Phân chia tài liệu theo năm học", "desc": "Mỗi tài liệu sổ tay phải gắn liền với Năm học (M5/SM13); phụ huynh mặc định xem tài liệu của năm học hiện hành."},
                {"id": "BR-02", "title": "Định dạng và dung lượng tệp", "desc": "Hỗ trợ tệp định dạng PDF tối đa 50MB; tài liệu tải lên tự động được tối ưu hóa để hiển thị nhanh trên trình duyệt và thiết bị di động."},
                {"id": "BR-03", "title": "Bảo vệ bản quyền tài liệu", "desc": "Tùy chọn đóng dấu mờ (Watermark) tên trường và chống tải về đối với các tài liệu quy chế độc quyền nếu nhà trường kích hoạt cờ bảo mật."},
                {"id": "BR-04", "title": "Danh bạ liên lạc khẩn cấp", "desc": "Mục 'Đường dây nóng' luôn được ghim ở vị trí đầu tiên để phụ huynh dễ dàng bấm gọi ngay khi có sự cố."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-031 Sổ tay phụ huynh điện tử", "feature": "Quản lý danh mục và tài liệu sổ tay", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn tải lên tài liệu nội quy để phụ huynh dễ dàng tra cứu trên ứng dụng.", "jira": "ST-001"},
                {"epic": "E-031 Sổ tay phụ huynh điện tử", "feature": "Danh bạ liên hệ hỗ trợ", "platform": "Portal Web", "priority": "P1", "story": "Là Phụ huynh, tôi muốn xem các số hotline hỗ trợ để liên hệ khi cần thiết.", "jira": "ST-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-ST-01",
                    "name": "Tải lên tài liệu cẩm nang mới",
                    "desc": "Admin tải tệp PDF sổ tay lên hệ thống.",
                    "actor": "Admin / BGH",
                    "trigger": "Bấm 'Thêm tài liệu'.",
                    "pre": "Đã có tệp PDF nội dung cẩm nang chuẩn bị sẵn.",
                    "happy_path": [
                        "1. Nhập Tên tài liệu (VD: Cẩm nang học đường 2026-2027).",
                        "2. Chọn chuyên mục và chọn Năm học áp dụng.",
                        "3. Tải lên tệp PDF.",
                        "4. Bấm 'Lưu và Xuất bản' -> Hệ thống xử lý và cập nhật lên ứng dụng phụ huynh."
                    ],
                    "exceptions": [
                        "Tệp không đúng định dạng PDF: Báo lỗi 'Hệ thống chỉ hỗ trợ tệp định dạng PDF'.",
                        "Dung lượng vượt quá 50MB: Báo lỗi 'Tệp vượt quá dung lượng tối đa 50MB'."
                    ],
                    "post": "Tài liệu sẵn sàng để phụ huynh xem và tra cứu.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Sổ tay PH</strong>.",
            "overview_screen": [
                {"component": "Bộ lọc Năm học & Chuyên mục", "format": "Select Box", "desc": "Lọc tài liệu theo năm học và các chuyên mục (Nội quy, Biểu phí, Y tế, Đưa đón).", "note": "Mặc định hiển thị năm học hiện tại"},
                {"component": "Lưới thẻ tài liệu cẩm nang", "format": "Card Grid", "desc": "Hiển thị ảnh bìa tài liệu, Tiêu đề, Dung lượng file, Ngày cập nhật, Lượt đọc, Nút Xem thử / Sửa / Xóa.", "note": "Hỗ trợ kéo thả sắp xếp thứ tự hiển thị"},
                {"component": "Nút tác vụ chính", "format": "Primary Button", "desc": "Nút 'Thêm tài liệu mới' và 'Quản lý danh bạ khẩn cấp'.", "note": "Phân quyền quản trị"}
            ],
            "form_screen": [
                {"field": "Tên tài liệu", "type": "Text Input", "validation": "Bắt buộc, tối đa 150 ký tự", "note": "Tên rõ ràng"},
                {"field": "Chuyên mục", "type": "Select Box", "validation": "Bắt buộc chọn chuyên mục", "note": "Nội quy / Đưa đón / Biểu phí / Hướng dẫn"},
                {"field": "Năm học áp dụng", "type": "Select Box", "validation": "Bắt buộc chọn năm học", "note": "BR-01"},
                {"field": "Tệp tài liệu PDF", "type": "File Drag & Drop", "validation": "Bắt buộc, định dạng PDF, tối đa 50MB", "note": "BR-02"},
                {"field": "Trạng thái công khai", "type": "Toggle Switch", "validation": "Bật/Tắt hiển thị cho phụ huynh", "note": "Mặc định Bật"}
            ],
            "notifications": [
                {"context": "Xuất bản tài liệu mới", "type": "Push Notification", "body": "Nhà trường đã cập nhật tài liệu mới: {ten_tai_lieu}. Kính mời quý phụ huynh xem chi tiết.", "onclick": "Mở xem tài liệu"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Tải lên và xuất bản tài liệu PDF thành công", "desc": "Admin tải tệp PDF lên thành công; tài liệu được hiển thị trên trình đọc PDF tích hợp mượt mà không bị lỗi font tiếng Việt."},
            {"id": "AC-02", "title": "Quản lý tài liệu theo năm học chuẩn xác", "desc": "Tài liệu phân bổ đúng theo năm học đã cấu hình; khi chuyển năm học trên bộ lọc thì danh sách tài liệu tương ứng thay đổi chính xác."},
            {"id": "AC-03", "title": "Hiển thị tối ưu trên thiết bị di động", "desc": "Phụ huynh mở ứng dụng di động có thể phóng to, thu nhỏ, cuộn trang mượt mà và tìm kiếm từ khóa trong tệp PDF."},
            {"id": "AC-04", "title": "Danh bạ khẩn cấp hỗ trợ gọi điện 1 chạm", "desc": "Số điện thoại đường dây nóng trong sổ tay cho phép phụ huynh chạm vào là kích hoạt ngay cuộc gọi trên điện thoại."}
        ]
    }
]

print("Milestone 3 Phase 3A part 2 defined...")

MODULES_3A_CONT = [
    # 31. M5/SM8 - Thực đơn
    {
        "code": "M5/SM8",
        "name": "M5 - SM8 - Thực đơn",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý thực đơn bán trú (School Meal Menu)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm lập kế hoạch, quản lý và công bố thực đơn dinh dưỡng hàng tuần cho các khối lớp học sinh mầm non và tiểu học.",
            "goals": "Cung cấp thực đơn dinh dưỡng minh bạch, hiển thị chi tiết các bữa sáng, trưa, xế, tráng miệng kèm bảng định lượng calo và cảnh báo dị ứng thực phẩm giúp phụ huynh an tâm tuyệt đối.",
            "scope": "Quản trị thực đơn bán trú cho toàn bộ các lớp ăn bán trú tại trường; đồng bộ lên ứng dụng di động cho phụ huynh theo dõi hàng ngày.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M5-nha-truong/8. thuc-don.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Thực đơn"},
                {"doc": "Thông tư liên tịch số 13/2016/TTLT-BYT-BGDĐT", "note": "Quy định về công tác y tế trường học và an toàn vệ sinh thực phẩm"}
            ]
        },
        "business": {
            "flow_desc": "Chuyên viên dinh dưỡng hoặc cán bộ bán trú tạo thực đơn tuần cho từng khối, nhập chi tiết các món ăn từng bữa, gắn nhãn dị ứng và xuất bản trước khi tuần mới bắt đầu.",
            "flow_steps": [
                {"actor": "Cán bộ bán trú", "action": "Khởi tạo thực đơn tuần", "desc": "Chọn khối lớp, chọn tuần lễ (từ Thứ 2 đến Thứ 6/Thứ 7)."},
                {"actor": "Cán bộ bán trú", "action": "Nhập món ăn & Dinh dưỡng", "desc": "Nhập tên món cho từng bữa: Sáng, Trưa, Xế; chọn cảnh báo dị ứng (hải sản, trứng, sữa, đậu phộng)."},
                {"actor": "BGH", "action": "Phê duyệt và Xuất bản", "desc": "Kiểm tra thực đơn và bấm xuất bản công khai cho phụ huynh."},
                {"actor": "Giáo viên tại lớp", "action": "Cập nhật ảnh bữa ăn thực tế", "desc": "Chụp ảnh khay cơm thực tế giờ ăn trưa đăng lên để phụ huynh đối chiếu."}
            ],
            "steps_narrative": [
                "Cán bộ bán trú vào Nhà trường -> Thực đơn, chọn Khối lớp và tuần học cần lên thực đơn.",
                "Hệ thống hiển thị lưới lịch tuần từ Thứ 2 đến Thứ 6 (hoặc Thứ 7).",
                "Có thể bấm 'Sao chép từ tuần trước' để kế thừa nhanh danh mục món ăn và chỉnh sửa các món thay đổi.",
                "Nhập tên món ăn cho từng bữa, tích chọn các thành phần dễ gây dị ứng để hệ thống tự động gắn biểu tượng cảnh báo màu đỏ.",
                "Sau khi hoàn tất, bấm 'Xuất bản' để phát thông báo tới ứng dụng phụ huynh."
            ],
            "rules": [
                {"id": "BR-01", "title": "Cấu trúc thực đơn theo tuần và khối lớp", "desc": "Thực đơn áp dụng riêng theo từng khối lớp (Mầm, Chồi, Lá, Lớp 1, Lớp 2...) theo từng tuần học cụ thể."},
                {"id": "BR-02", "title": "Thời hạn xuất bản trước 3 ngày", "desc": "Thực đơn tuần mới phải được xuất bản trước ít nhất 3 ngày (trước Thứ 6 của tuần trước) để phụ huynh chuẩn bị và báo lưu ý sức khỏe nếu cần."},
                {"id": "BR-03", "title": "Cảnh báo dị ứng bắt buộc", "desc": "Các món ăn chứa thành phần dễ gây dị ứng (hải sản, đậu phộng, trứng, sữa bò, bột mì) bắt buộc phải được gắn nhãn cảnh báo để giáo viên chủ nhiệm đối chiếu với hồ sơ sức khỏe học sinh."},
                {"id": "BR-04", "title": "Lưu trữ lịch sử thực đơn", "desc": "Thực đơn đã xuất bản và đã diễn ra không cho phép chỉnh sửa nhằm đảm bảo tính toàn vẹn khi kiểm tra vệ sinh an toàn thực phẩm."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-032 Quản lý thực đơn bán trú", "feature": "Lập và xuất bản thực đơn tuần", "platform": "Portal Web", "priority": "P1", "story": "Là Cán bộ bán trú, tôi muốn lên thực đơn tuần cho các khối lớp để phụ huynh theo dõi.", "jira": "TD-001"},
                {"epic": "E-032 Quản lý thực đơn bán trú", "feature": "Cảnh báo dinh dưỡng và dị ứng", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên/Phụ huynh, tôi muốn thấy cảnh báo dị ứng rõ ràng để bảo vệ an toàn cho học sinh.", "jira": "TD-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-TD-01",
                    "name": "Tạo thực đơn tuần mới bằng cách sao chép",
                    "desc": "Cán bộ dinh dưỡng tạo nhanh thực đơn bằng cách sao chép tuần cũ.",
                    "actor": "Cán bộ bán trú / Admin",
                    "trigger": "Bấm nút 'Sao chép từ tuần trước'.",
                    "pre": "Đã có thực đơn của tuần liền trước.",
                    "happy_path": [
                        "1. Chọn khối lớp và tuần đích cần tạo thực đơn.",
                        "2. Bấm 'Sao chép từ tuần trước' -> Hệ thống tự động đổ toàn bộ món ăn vào lưới.",
                        "3. Chỉnh sửa một số món ăn cho phù hợp với tuần mới.",
                        "4. Bấm 'Lưu và Xuất bản' -> Hệ thống kích hoạt thông báo cho phụ huynh."
                    ],
                    "exceptions": [
                        "Tuần trước chưa có thực đơn: Báo lỗi 'Không tìm thấy thực đơn tuần trước để sao chép'."
                    ],
                    "post": "Thực đơn tuần mới sẵn sàng và hiển thị trên ứng dụng của phụ huynh.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Thực đơn</strong>.",
            "overview_screen": [
                {"component": "Thanh điều hướng Tuần & Khối lớp", "format": "Dropdown Select Khối + Nút Next/Prev Tuần", "desc": "Chọn khối lớp và tuần học cần xem/sửa (kèm chỉ báo ngày bắt đầu và kết thúc).", "note": "Hiển thị tuần hiện tại theo mặc định"},
                {"component": "Lưới thực đơn tuần trực quan", "format": "Table dạng Lịch tuần", "desc": "Các cột Thứ 2 đến Thứ 6/7. Các dòng gồm: Bữa sáng, Bữa trưa (Món mặn, Món xào, Món canh, Tráng miệng), Bữa xế chiều.", "note": "Có icon cảnh báo dị ứng màu đỏ cạnh món ăn"},
                {"component": "Thanh tác vụ", "format": "Action Bar", "desc": "Nút 'Sao chép tuần trước', 'In thực đơn', 'Xuất bản cho phụ huynh'.", "note": "Có chỉ báo trạng thái: Bản nháp / Đã xuất bản"}
            ],
            "form_screen": [
                {"field": "Khối lớp áp dụng", "type": "Select Box", "validation": "Bắt buộc chọn khối lớp", "note": "BR-01"},
                {"field": "Tuần áp dụng", "type": "Date Range Picker", "validation": "Bắt buộc, chọn tuần hợp lệ", "note": "Từ Thứ 2 đến Thứ 6"},
                {"field": "Danh mục món ăn theo bữa", "type": "Text Input + Auto-suggest", "validation": "Bắt buộc nhập ít nhất bữa trưa và xế", "note": "Gợi ý món ăn từ kho dữ liệu"},
                {"field": "Cảnh báo dị ứng", "type": "Multi-tag Select", "validation": "Tùy chọn: Hải sản, Đậu phộng, Trứng, Sữa, Đậu nành", "note": "BR-03"},
                {"field": "Tổng calo ước tính", "type": "Number Input", "validation": "Tùy chọn, từ 500 đến 2500 Kcal", "note": "Theo tiêu chuẩn dinh dưỡng viện dinh dưỡng"}
            ],
            "notifications": [
                {"context": "Xuất bản thực đơn mới", "type": "Push Notification", "body": "Thực đơn tuần mới từ {ngay_bat_dau} đến {ngay_ket_thuc} đã được cập nhật. Kính mời phụ huynh tham khảo.", "onclick": "Mở trang thực đơn trên app"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Hiển thị bảng lưới thực đơn tuần trực quan", "desc": "Hệ thống hiển thị đầy đủ các ngày trong tuần và phân chia rõ ràng các bữa ăn sáng, trưa, xế kèm tên món ăn chi tiết."},
            {"id": "AC-02", "title": "Tính năng sao chép thực đơn tuần tiện lợi", "desc": "Bấm 'Sao chép từ tuần trước' sao chép chính xác toàn bộ danh mục món ăn sang tuần mới trong < 500ms giúp tiết kiệm thời gian nhập liệu."},
            {"id": "AC-03", "title": "Cảnh báo thành phần dị ứng nổi bật", "desc": "Các món ăn được gắn thẻ dị ứng hiển thị biểu tượng cảnh báo rõ ràng trên cả giao diện Web Portal và ứng dụng di động phụ huynh."},
            {"id": "AC-04", "title": "Khóa sửa đổi đối với thực đơn đã diễn ra", "desc": "Thực đơn của các tuần trong quá khứ được chuyển sang chế độ chỉ đọc (Read-only) để bảo toàn dữ liệu kiểm tra an toàn thực phẩm."}
        ]
    },

    # 32. M5/SM14 - Lưu trữ
    {
        "code": "M5/SM14",
        "name": "M5 - SM14 - Lưu trữ",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Kho lưu trữ hồ sơ (Archived Records Management)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> chịu trách nhiệm quản lý, bảo quản và tra cứu lâu dài hồ sơ của học sinh đã tốt nghiệp, thôi học hoặc chuyển trường, cũng như hồ sơ cán bộ giáo viên đã chấm dứt hợp đồng.",
            "goals": "Đảm bảo tính toàn vẹn và bảo mật của dữ liệu lịch sử giáo dục (điểm số, học bạ, biên lai học phí), đáp ứng yêu cầu lưu trữ hồ sơ học đường theo quy định nhà nước và hỗ trợ khôi phục hồ sơ khi học sinh quay lại trường.",
            "scope": "Lưu trữ hồ sơ học sinh và nhân sự đã ngưng hoạt động; hỗ trợ tra cứu nhanh, trích lục học bạ và phục hồi hồ sơ khi cần.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M5-nha-truong/14. luu-tru.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Lưu trữ"},
                {"doc": "Luật Lưu trữ số 01/2011/QH13 & Thông tư 28/2020/TT-BGDĐT", "note": "Thời hạn và quy định bảo quản hồ sơ học sinh"}
            ]
        },
        "business": {
            "flow_desc": "Khi học sinh tốt nghiệp hoặc chuyển trường và đã tất toán hết học phí tài chính M4, hồ sơ được chuyển vào kho lưu trữ; tại đây dữ liệu là chỉ đọc nhưng có thể tra cứu và khôi phục khi có quyết định tiếp nhận lại.",
            "flow_steps": [
                {"actor": "Giáo vụ / Kế toán", "action": "Kiểm tra tất toán công nợ", "desc": "Đảm bảo học sinh không còn nợ học phí chưa thanh toán trong phân hệ M4."},
                {"actor": "BGH / Admin", "action": "Chuyển hồ sơ vào Lưu trữ", "desc": "Chọn học sinh, nhập lý do (Tốt nghiệp/Chuyển trường/Thôi học), chuyển trạng thái lưu trữ."},
                {"actor": "Hệ thống BE", "action": "Khóa chỉnh sửa hồ sơ", "desc": "Đóng băng toàn bộ dữ liệu cá nhân, điểm số, học phí ở chế độ Read-only."},
                {"actor": "BGH / Giáo vụ", "action": "Tra cứu hoặc Khôi phục", "desc": "Tìm kiếm trích lục hồ sơ hoặc khôi phục lại danh sách học sinh đang hoạt động nếu quay lại học."}
            ],
            "steps_narrative": [
                "Người dùng vào Nhà trường -> Lưu trữ, xem danh sách các hồ sơ học sinh và giáo viên đã lưu trữ.",
                "Tìm kiếm nhanh theo Mã học sinh, Tên hoặc Số CCCD/Định danh.",
                "Mở xem chi tiết hồ sơ: hiển thị toàn bộ quá trình học tập qua các năm, điểm tổng kết từng kỳ và lịch sử hóa đơn học phí.",
                "Nếu học sinh quay lại nhập học, BGH bấm nút 'Khôi phục hồ sơ', nhập lý do tiếp nhận lại và chọn lớp học mới.",
                "Hệ thống ghi lại nhật ký kiểm toán (Audit log) chi tiết cho mọi thao tác khôi phục."
            ],
            "rules": [
                {"id": "BR-01", "title": "Điều kiện chuyển lưu trữ", "desc": "Học sinh chỉ được chuyển vào kho lưu trữ khi đã hoàn tất các thủ tục thôi học/tốt nghiệp và số dư công nợ học phí trong M4 bằng 0 (hoặc có phê duyệt ngoại lệ của Hiệu trưởng)."},
                {"id": "BR-02", "title": "Bảo vệ dữ liệu chỉ đọc (Read-only)", "desc": "Mọi thông tin lịch sử điểm số, chuyên cần và biên lai thu tiền trong hồ sơ lưu trữ là bất biến, không thể chỉnh sửa hay xóa bỏ."},
                {"id": "BR-03", "title": "Kiểm soát quyền khôi phục hồ sơ", "desc": "Chỉ tài khoản thuộc Ban Giám Hiệu hoặc Super Admin mới có quyền thực hiện khôi phục hồ sơ lưu trữ quay lại trạng thái đang hoạt động."},
                {"id": "BR-04", "title": "Audit log thao tác phục hồi", "desc": "Thao tác phục hồi hồ sơ bắt buộc phải nhập lý do và được ghi nhận vào nhật ký kiểm toán hệ thống kèm thời gian và ID người thực hiện."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-033 Kho lưu trữ hồ sơ", "feature": "Tra cứu và trích lục hồ sơ lưu trữ", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo vụ, tôi muốn tra cứu lại hồ sơ học sinh cũ để cấp bản sao học bạ khi phụ huynh yêu cầu.", "jira": "LT-001"},
                {"epic": "E-033 Kho lưu trữ hồ sơ", "feature": "Khôi phục hồ sơ nhập học lại", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn khôi phục hồ sơ học sinh chuyển về lại trường mà không mất dữ liệu cũ.", "jira": "LT-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-LT-01",
                    "name": "Tra cứu và in trích lục hồ sơ học sinh",
                    "desc": "Tìm kiếm học sinh cũ và xuất bảng kết quả học tập.",
                    "actor": "Giáo vụ / Ban Giám Hiệu",
                    "trigger": "Nhập mã học sinh hoặc tên vào thanh tìm kiếm.",
                    "pre": "Hồ sơ đã được lưu trữ trong hệ thống.",
                    "happy_path": [
                        "1. Nhập từ khóa tìm kiếm (Tên / CCCD / Mã HS).",
                        "2. Hệ thống trả về thông tin hồ sơ kèm năm tốt nghiệp/chuyển trường.",
                        "3. Bấm 'Xem chi tiết' để xem toàn bộ lịch sử điểm và chuyên cần.",
                        "4. Bấm 'Xuất trích lục PDF' để in bản sao học bạ xác thực."
                    ],
                    "exceptions": [
                        "Không tìm thấy hồ sơ: Hiển thị thông báo 'Không tìm thấy hồ sơ lưu trữ phù hợp'."
                    ],
                    "post": "Tải về tệp trích lục học bạ thành công.",
                    "rules": "BR-02"
                },
                {
                    "id": "UC-LT-02",
                    "name": "Khôi phục hồ sơ học sinh",
                    "desc": "Đưa học sinh từ kho lưu trữ quay lại danh sách hoạt động.",
                    "actor": "Ban Giám Hiệu",
                    "trigger": "Bấm nút 'Khôi phục hồ sơ'.",
                    "pre": "Tài khoản có quyền BGH hoặc Super Admin.",
                    "happy_path": [
                        "1. Mở modal khôi phục hồ sơ.",
                        "2. Chọn Năm học và Lớp học mới tiếp nhận.",
                        "3. Nhập lý do tiếp nhận lại (VD: Học sinh chuyển về từ trường khác).",
                        "4. Bấm 'Xác nhận khôi phục' -> Hồ sơ chuyển sang danh sách Học sinh hoạt động (M5/SM1)."
                    ],
                    "exceptions": [
                        "Chưa nhập lý do: Báo lỗi 'Vui lòng nhập lý do khôi phục hồ sơ'."
                    ],
                    "post": "Học sinh xuất hiện trong danh sách lớp mới và sẵn sàng điểm danh, thu học phí.",
                    "rules": "BR-03, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Lưu trữ</strong>.",
            "overview_screen": [
                {"component": "Bộ lọc nâng cao", "format": "Input Search + Select Loại hồ sơ (Học sinh/Giáo viên) + Select Năm lưu trữ", "desc": "Tìm kiếm theo từ khóa tên, mã hoặc CCCD; lọc theo năm chuyển lưu trữ.", "note": "Hỗ trợ tìm kiếm không dấu"},
                {"component": "Bảng danh sách hồ sơ lưu trữ", "format": "Table dữ liệu", "desc": "Hiển thị: STT, Mã định danh, Họ tên, Loại đối tượng, Lớp cuối cùng/Chức vụ, Ngày lưu trữ, Lý do lưu trữ, Thao tác (Xem/Khôi phục).", "note": "Thao tác Khôi phục chỉ hiển thị với BGH"},
                {"component": "Nút xuất dữ liệu", "format": "Secondary Button", "desc": "Nút 'Xuất danh sách lưu trữ Excel'.", "note": "Phục vụ báo cáo lưu trữ"}
            ],
            "form_screen": [
                {"field": "Lý do khôi phục", "type": "Text Area", "validation": "Bắt buộc khi khôi phục, tối thiểu 10 ký tự", "note": "BR-04"},
                {"field": "Năm học tiếp nhận", "type": "Select Box", "validation": "Bắt buộc chọn năm học hiện tại", "note": "Chọn năm học tiếp nhận lại"},
                {"field": "Lớp học mới", "type": "Select Box", "validation": "Bắt buộc chọn lớp tiếp nhận", "note": "Danh sách các lớp còn chỉ tiêu"}
            ],
            "notifications": [
                {"context": "Khôi phục hồ sơ thành công", "type": "Toast Success", "body": "Đã khôi phục hồ sơ học sinh {ten_hoc_sinh} vào lớp {ten_lop} thành công.", "onclick": "Đóng toast"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Tìm kiếm hồ sơ lưu trữ nhanh chóng và chính xác", "desc": "Hệ thống trả về kết quả tìm kiếm hồ sơ theo Mã định danh, Tên hoặc CCCD trong thời gian < 1 giây với dữ liệu đầy đủ."},
            {"id": "AC-02", "title": "Bảo vệ tuyệt đối dữ liệu lịch sử ở chế độ chỉ đọc", "desc": "Mọi thông tin điểm số, nhận xét, học bạ và biên lai trong hồ sơ lưu trữ không thể bị chỉnh sửa hay xóa bởi bất kỳ vai trò nào."},
            {"id": "AC-03", "title": "Khôi phục hồ sơ và bảo toàn dữ liệu cũ", "desc": "Hồ sơ sau khi khôi phục xuất hiện lại trong danh sách lớp mới với đầy đủ mã học sinh cũ và toàn bộ dữ liệu lịch sử các năm trước không bị mất mát."},
            {"id": "AC-04", "title": "Ghi nhận nhật ký kiểm toán khôi phục đầy đủ", "desc": "Mọi thao tác khôi phục hồ sơ đều được ghi lại trong Audit Log với ID người thực hiện, thời điểm và lý do khôi phục rõ ràng."}
        ]
    },

    # 33. M5/SM7 - Bình chọn
    {
        "code": "M5/SM7",
        "name": "M5 - SM7 - Bình chọn",
        "parent_module": "M5",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Bình chọn &amp; Khảo sát trực tuyến (School Polls &amp; Surveys)</strong> thuộc nhóm <strong>M5: Nhà trường</strong> cho phép khởi tạo các cuộc biểu quyết, lấy ý kiến tập thể từ phụ huynh và giáo viên về các hoạt động ngoại khóa, lựa chọn đồng phục, đăng ký dã ngoại hoặc bầu ban đại diện cha mẹ học sinh.",
            "goals": "Lấy ý kiến dân chủ, nhanh chóng và minh bạch; hỗ trợ biểu đồ thống kê kết quả theo thời gian thực (Real-time), chống gian lận phiếu bầu và hỗ trợ cả khảo sát công khai lẫn bỏ phiếu kín.",
            "scope": "Khảo sát và biểu quyết trực tuyến áp dụng toàn trường, theo khối lớp hoặc lớp học cụ thể trên Web Portal và Mobile App.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M5-nha-truong/7. binh-chon.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Bình chọn"},
                {"doc": "Điều lệ Ban đại diện cha mẹ học sinh theo Thông tư 55/2011/TT-BGDĐT", "note": "Quy định về lấy ý kiến phụ huynh học sinh"}
            ]
        },
        "business": {
            "flow_desc": "Nhà trường tạo cuộc bình chọn, thiết lập câu hỏi và thời hạn đóng mở; phụ huynh nhận thông báo và bỏ phiếu trực tiếp trên ứng dụng; hệ thống tự động tổng hợp biểu đồ kết quả.",
            "flow_steps": [
                {"actor": "BGH / Admin", "action": "Tạo cuộc bình chọn", "desc": "Nhập tiêu đề khảo sát, thêm các câu hỏi (Đơn lựa chọn/Đa lựa chọn), đặt hạn chót bỏ phiếu."},
                {"actor": "Hệ thống Notification", "action": "Phát thông báo mời tham gia", "desc": "Gửi thông báo đẩy đến danh sách phụ huynh/giáo viên mục tiêu."},
                {"actor": "Phụ huynh / GV", "action": "Thực hiện bỏ phiếu", "desc": "Chọn phương án trả lời trên Mobile App hoặc Web và bấm gửi phiếu."},
                {"actor": "Hệ thống BE", "action": "Tổng hợp thời gian thực", "desc": "Cập nhật số phiếu và tỷ lệ % vào biểu đồ phân tích trực quan."}
            ],
            "steps_narrative": [
                "Quản trị viên vào Nhà trường -> Bình chọn, xem danh sách các khảo sát đang diễn ra, sắp mở hoặc đã kết thúc.",
                "Bấm 'Tạo cuộc bình chọn mới', nhập Tiêu đề, Mô tả mục đích khảo sát và chọn đối tượng tham gia (Toàn trường/Khối/Lớp).",
                "Thêm các câu hỏi và các phương án lựa chọn: hỗ trợ tải ảnh minh họa cho từng phương án (VD: 3 mẫu đồng phục mới).",
                "Thiết lập thời gian bắt đầu và kết thúc tự động; tùy chọn chế độ 'Bỏ phiếu kín' (ẩn danh người chọn phương án).",
                "Sau khi cuộc bình chọn kết thúc, có thể xuất báo cáo kết quả chi tiết kèm danh sách người đã tham gia/chưa tham gia."
            ],
            "rules": [
                {"id": "BR-01", "title": "Chống gian lận phiếu bầu (1 tài khoản 1 phiếu)", "desc": "Mỗi tài khoản phụ huynh tương ứng với một học sinh chỉ được tham gia biểu quyết đúng 1 lần duy nhất cho mỗi cuộc bình chọn; không thể sửa lại sau khi đã xác nhận gửi."},
                {"id": "BR-02", "title": "Đóng mở tự động theo thời gian", "desc": "Hệ thống tự động mở bình chọn khi đến giờ bắt đầu và tự động khóa biểu mẫu ngay khi hết hạn chót; người dùng truy cập sau thời hạn chỉ được xem kết quả."},
                {"id": "BR-03", "title": "Chế độ bỏ phiếu kín", "desc": "Khi kích hoạt cờ 'Bỏ phiếu kín', hệ thống chỉ hiển thị số lượng phiếu và tỷ lệ % cho từng phương án mà không công khai danh tính người đã chọn phương án nào."},
                {"id": "BR-04", "title": "Điều kiện xuất bản bình chọn", "desc": "Một cuộc bình chọn phải có ít nhất 1 câu hỏi và mỗi câu hỏi phải có tối thiểu 2 phương án lựa chọn."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-034 Bình chọn & Khảo sát ý kiến", "feature": "Khởi tạo và quản lý cuộc bình chọn", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn tạo cuộc bình chọn để lấy ý kiến phụ huynh về địa điểm dã ngoại.", "jira": "BC-001"},
                {"epic": "E-034 Bình chọn & Khảo sát ý kiến", "feature": "Theo dõi và phân tích kết quả trực quan", "platform": "Portal Web", "priority": "P1", "story": "Là Ban quản lý, tôi muốn xem biểu đồ tỷ lệ phiếu bầu để ra quyết định nhanh chóng.", "jira": "BC-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-BC-01",
                    "name": "Tạo cuộc bình chọn mới",
                    "desc": "Admin thiết lập cuộc khảo sát lấy ý kiến.",
                    "actor": "Ban Giám Hiệu / Admin",
                    "trigger": "Bấm 'Tạo cuộc bình chọn'.",
                    "pre": "Tài khoản có quyền quản lý bình chọn.",
                    "happy_path": [
                        "1. Nhập Tiêu đề và Mô tả cuộc khảo sát.",
                        "2. Chọn đối tượng tham gia (VD: Khối Tiểu học).",
                        "3. Thêm câu hỏi và các phương án trả lời.",
                        "4. Đặt thời gian mở và hạn chót kết thúc.",
                        "5. Bấm 'Xuất bản' -> Hệ thống kích hoạt gửi thông báo mời bình chọn."
                    ],
                    "exceptions": [
                        "Hạn chót trong quá khứ: Báo lỗi 'Thời gian kết thúc phải lớn hơn thời điểm hiện tại'.",
                        "Câu hỏi ít hơn 2 lựa chọn: Báo lỗi 'Mỗi câu hỏi phải có tối thiểu 2 phương án'."
                    ],
                    "post": "Cuộc bình chọn xuất hiện trên bảng khảo sát của phụ huynh.",
                    "rules": "BR-02, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Nhà trường</strong> -> Chọn <strong>Bình chọn</strong>.",
            "overview_screen": [
                {"component": "Bộ lọc trạng thái", "format": "Tab Navigation", "desc": "Các tab: Đang diễn ra, Sắp diễn ra, Đã kết thúc.", "note": "Có đếm số lượng cuộc khảo sát theo tab"},
                {"component": "Lưới thẻ cuộc bình chọn", "format": "Card Grid", "desc": "Hiển thị: Tiêu đề cuộc bình chọn, Đối tượng áp dụng, Thời hạn còn lại, Số người đã tham gia / Tổng sĩ số, Tỷ lệ hoàn thành %, Nút Xem kết quả / Chỉnh sửa.", "note": "Thẻ đang mở có viền xanh nổi bật"},
                {"component": "Nút tác vụ chính", "format": "Primary Button", "desc": "Nút 'Tạo cuộc bình chọn mới' ở góc trên.", "note": "Phân quyền quản trị"}
            ],
            "form_screen": [
                {"field": "Tiêu đề cuộc bình chọn", "type": "Text Input", "validation": "Bắt buộc, tối đa 200 ký tự", "note": "Rõ ràng mục tiêu"},
                {"field": "Thời hạn bình chọn", "type": "Date Time Range Picker", "validation": "Bắt buộc, ngày kết thúc > ngày bắt đầu", "note": "BR-02"},
                {"field": "Loại câu hỏi", "type": "Radio Select", "validation": "Đơn lựa chọn (Radio) hoặc Đa lựa chọn (Checkbox)", "note": "Tùy biến theo câu hỏi"},
                {"field": "Danh sách phương án", "type": "Dynamic List Inputs", "validation": "Tối thiểu 2 phương án, hỗ trợ đính kèm ảnh minh họa", "note": "BR-04"},
                {"field": "Chế độ bỏ phiếu kín", "type": "Toggle Switch", "validation": "Bật/Tắt ẩn danh người bỏ phiếu", "note": "BR-03"}
            ],
            "notifications": [
                {"context": "Mời tham gia bình chọn", "type": "Push Notification", "body": "Nhà trường mời quý phụ huynh tham gia bình chọn: {tieu_de_binh_chon}. Hạn chót: {han_chot}.", "onclick": "Mở trang bình chọn trên app"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Tạo cuộc bình chọn với đầy đủ câu hỏi và phương án", "desc": "Người dùng tạo được cuộc bình chọn với các loại câu hỏi đơn lựa chọn hoặc đa lựa chọn kèm hình ảnh phương án rõ ràng."},
            {"id": "AC-02", "title": "Ràng buộc mỗi tài khoản bỏ phiếu duy nhất 1 lần", "desc": "Hệ thống chặn việc gửi phiếu lần thứ hai từ cùng một tài khoản và chuyển giao diện sang màn hình xem kết quả."},
            {"id": "AC-03", "title": "Tự động khóa biểu mẫu đúng thời hạn", "desc": "Ngay khi chạm thời điểm kết thúc quy định, hệ thống tự động khóa nút gửi phiếu và hiển thị nhãn 'Đã kết thúc'."},
            {"id": "AC-04", "title": "Biểu đồ kết quả cập nhật thời gian thực", "desc": "Kết quả bình chọn hiển thị dưới dạng biểu đồ thanh ngang và hình tròn cập nhật tức thì theo thời gian thực khi có người gửi phiếu mới."}
        ]
    }
]

print("Milestone 3 Phase 3A complete...")

MODULES_3B = [
    # 34. M3/SM1 - Thời khóa biểu
    {
        "code": "M3/SM1",
        "name": "M3 - SM1 - Thời khóa biểu",
        "parent_module": "M3",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Thời khóa biểu (Class Schedule &amp; Timetable)</strong> thuộc nhóm <strong>M3: Học tập</strong> quản lý lịch học tập hàng ngày cho từng lớp học theo học kỳ và tuần học; hỗ trợ cả hai hình thức: dựng lưới trực quan linh hoạt (Khung giờ × Thứ) và tải lên tệp ảnh/PDF có sẵn.",
            "goals": "Xây dựng lịch học chuẩn xác, phát hiện và cảnh báo tức thì xung đột giáo viên hoặc phòng học, hỗ trợ sao chép cấu trúc thời khóa biểu giữa các lớp, phát hành đến phụ huynh và lưu trữ đầy đủ lịch sử phát hành (Send History).",
            "scope": "Quản trị lịch học cho toàn bộ các lớp trong trường theo từng học kỳ; hiển thị lịch học hàng ngày trên ứng dụng di động cho học sinh và phụ huynh.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M3-hoc-tap/thoi-khoa-bieu.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Thời khóa biểu"},
                {"doc": "Kế hoạch thời gian năm học của Bộ Giáo dục & Đào tạo", "note": "Quy định khung giờ tiết học tiêu chuẩn"}
            ]
        },
        "business": {
            "flow_desc": "Giáo vụ hoặc BGH chọn lớp và học kỳ để dựng lưới tiết học, gán môn học và giáo viên phụ trách cho từng ô; kiểm tra xung đột trùng tiết; sau đó duyệt xuất bản và gửi thông báo cho phụ huynh.",
            "flow_steps": [
                {"actor": "Giáo vụ", "action": "Khởi tạo thời khóa biểu", "desc": "Chọn lớp, chọn học kỳ (Học kỳ 1 / Học kỳ 2) và chọn hình thức (Dựng lưới hoặc Tải file PDF/ảnh)."},
                {"actor": "Giáo vụ", "action": "Xếp môn học và giáo viên", "desc": "Điền môn học (từ M5/SM4) và giáo viên (M5/SM2) vào từng tiết học từ Thứ 2 đến Thứ 6/7."},
                {"actor": "Hệ thống BE", "action": "Kiểm tra xung đột tiết dạy", "desc": "Đối chiếu xem giáo viên hoặc phòng học có bị trùng giờ ở lớp khác hay không."},
                {"actor": "BGH", "action": "Phát hành thời khóa biểu", "desc": "Chuyển trạng thái sang 'Đã xuất bản' và bấm 'Gửi cho phụ huynh', lưu vết vào Send History."}
            ],
            "steps_narrative": [
                "Giáo vụ vào Học tập -> Thời khóa biểu, xem danh sách TKB theo từng lớp.",
                "Bấm 'Tạo thời khóa biểu', chọn Lớp và Học kỳ áp dụng.",
                "Chọn hình thức: Nếu có sẵn file thiết kế thì tải file PDF/Ảnh; nếu không thì dựng trên bảng lưới.",
                "Trên bảng lưới: thêm các dòng khung giờ (VD: Tiết 1: 07:30 - 08:15), click vào từng ô để chọn Môn học và Giáo viên đứng lớp.",
                "Hệ thống tự động phát hiện nếu giáo viên đã được xếp lịch dạy lớp khác cùng giờ và hiển thị cảnh báo đỏ.",
                "Bấm 'Xuất bản và gửi phụ huynh' -> Thời khóa biểu có hiệu lực ngay lập tức và gửi thông báo push đến phụ huynh của lớp."
            ],
            "rules": [
                {"id": "BR-01", "title": "Tính duy nhất của thời khóa biểu áp dụng", "desc": "Mỗi lớp học trong cùng một học kỳ chỉ có duy nhất 1 thời khóa biểu ở trạng thái 'Đang áp dụng'; khi xuất bản TKB mới thì TKB cũ tự động hết hiệu lực."},
                {"id": "BR-02", "title": "Kiểm tra xung đột lịch dạy của giáo viên", "desc": "Hệ thống kiểm tra tự động và cảnh báo ngay khi một giáo viên bị xếp trùng giờ ở hai lớp khác nhau trong cùng một trường."},
                {"id": "BR-03", "title": "Bảo toàn lịch sử phát hành (Send History)", "desc": "Mỗi lần bấm gửi hoặc gửi lại TKB cho phụ huynh đều được lưu lại lịch sử chi tiết: Người gửi, Thời gian gửi, Phiên bản TKB và Số lượng phụ huynh nhận."},
                {"id": "BR-04", "title": "Nhân bản cấu trúc thời khóa biểu", "desc": "Cho phép sao chép cấu trúc khung giờ và phân bổ tiết từ một lớp mẫu sang các lớp khác cùng khối để tiết kiệm thời gian xếp lịch."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-035 Quản lý thời khóa biểu", "feature": "Dựng và xuất bản thời khóa biểu", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo vụ, tôi muốn xếp thời khóa biểu theo lớp để học sinh và phụ huynh nắm được lịch học.", "jira": "TKB-001"},
                {"epic": "E-035 Quản lý thời khóa biểu", "feature": "Cảnh báo trùng tiết và Lịch sử gửi", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn kiểm tra trùng giờ giáo viên và xem lịch sử các lần gửi TKB.", "jira": "TKB-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-TKB-01",
                    "name": "Dựng lưới thời khóa biểu cho lớp học",
                    "desc": "Giáo vụ xếp lịch học các ngày trong tuần.",
                    "actor": "Giáo vụ / Ban Giám Hiệu",
                    "trigger": "Chọn lớp và bấm 'Tạo thời khóa biểu'.",
                    "pre": "Đã có danh mục Môn học (M5/SM4) và Giáo viên (M5/SM2).",
                    "happy_path": [
                        "1. Chọn Lớp học và Học kỳ.",
                        "2. Chọn hình thức 'Dựng bảng lưới'.",
                        "3. Thêm khung giờ các tiết học trong ngày.",
                        "4. Chọn môn học và giáo viên cho từng ô tiết học.",
                        "5. Bấm 'Lưu nháp' hoặc 'Xuất bản và gửi'."
                    ],
                    "exceptions": [
                        "Trùng lịch dạy giáo viên: Hệ thống bật cảnh báo xung đột 'Giáo viên {ten_gv} đã có tiết dạy tại lớp {ten_lop_khac} vào khung giờ này'."
                    ],
                    "post": "Thời khóa biểu được tạo thành công và đồng bộ lên app phụ huynh.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Học tập</strong> -> Chọn <strong>Thời khóa biểu</strong>.",
            "overview_screen": [
                {"component": "Thanh chọn Lớp & Học kỳ", "format": "Dropdown Select Khối/Lớp + Select Học kỳ", "desc": "Chuyển đổi xem nhanh TKB của các lớp trong trường.", "note": "Hỗ trợ lọc theo loại hình Dựng lưới hoặc File tải lên"},
                {"component": "Bảng hiển thị lưới thời khóa biểu", "format": "Grid Spreadsheet", "desc": "Các cột Thứ 2 đến Thứ 6/7. Các hàng tương ứng từng tiết học. Trong mỗi ô hiển thị: Tên môn học, Mã phòng học, Tên giáo viên phụ trách.", "note": "Ô có xung đột hiển thị viền đỏ cảnh báo"},
                {"component": "Thanh công cụ tác vụ", "format": "Action Bar", "desc": "Nút 'Chỉnh sửa', 'Sao chép sang lớp khác', 'Gửi cho phụ huynh', 'Lịch sử gửi'.", "note": "Hiển thị trạng thái: Bản nháp / Đang áp dụng"}
            ],
            "form_screen": [
                {"field": "Lớp học", "type": "Select Box", "validation": "Bắt buộc chọn lớp", "note": "BR-01"},
                {"field": "Học kỳ", "type": "Select Box", "validation": "Bắt buộc chọn học kỳ", "note": "Học kỳ 1 hoặc Học kỳ 2"},
                {"field": "Hình thức TKB", "type": "Radio Button", "validation": "Dựng lưới tương tác / Tải tệp có sẵn (PDF, Ảnh)", "note": "Linh hoạt lựa chọn"},
                {"field": "Cấu hình khung giờ tiết", "type": "Time Range Inputs", "validation": "Giờ bắt đầu < Giờ kết thúc", "note": "VD: 08:00 - 08:45"},
                {"field": "Ghi chú thời khóa biểu", "type": "Text Area", "validation": "Tùy chọn, tối đa 255 ký tự", "note": "Lưu ý trang phục hoặc dụng cụ học tập"}
            ],
            "notifications": [
                {"context": "Thời khóa biểu mới được phát hành", "type": "Push Notification", "body": "Thời khóa biểu mới của lớp {ten_lop} đã được cập nhật. Kính mời quý phụ huynh xem chi tiết.", "onclick": "Mở tab Thời khóa biểu trên app"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Dựng lưới thời khóa biểu mượt mà", "desc": "Giáo vụ dễ dàng chọn môn học và giáo viên cho từng ô tiết học trên bảng lưới; thao tác thêm/xóa tiết học phản hồi tức thì."},
            {"id": "AC-02", "title": "Phát hiện và cảnh báo xung đột lịch dạy chính xác", "desc": "Hệ thống ngay lập tức phát hiện nếu 1 giáo viên bị trùng tiết ở hai lớp khác nhau trong cùng khung giờ và ngăn chặn xuất bản cho đến khi xung đột được giải quyết."},
            {"id": "AC-03", "title": "Gửi thông báo và lưu vết Send History", "desc": "Thao tác 'Gửi cho phụ huynh' gửi push notification thành công và ghi nhận lịch sử vào Send History với đầy đủ ngày giờ và người gửi."},
            {"id": "AC-04", "title": "Hiển thị chuẩn xác lịch học theo ngày trên Mobile App", "desc": "Phụ huynh mở ứng dụng xem được đúng các tiết học của ngày hôm nay và toàn bộ tuần học của con."}
        ]
    },

    # 35. M3/SM2 - Bài tập
    {
        "code": "M3/SM2",
        "name": "M3 - SM2 - Bài tập",
        "parent_module": "M3",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Quản lý bài tập về nhà (Homework &amp; Assignment Management)</strong> thuộc nhóm <strong>M3: Học tập</strong> hỗ trợ giáo viên giao bài tập cho học sinh theo lớp hoặc theo nhóm cá nhân, đặt hạn nộp bài, theo dõi tiến độ nộp bài, chấm điểm và nhận xét đánh giá trực tuyến.",
            "goals": "Số hóa quy trình giao và chấm bài tập, giúp phụ huynh nắm bắt kịp thời nhiệm vụ học tập của con, hỗ trợ đính kèm bài làm dạng hình ảnh/tài liệu và cho phép giáo viên nộp bài thay khi học sinh nộp trực tiếp tại lớp.",
            "scope": "Quản lý bài tập về nhà áp dụng cho toàn bộ các môn học và lớp học; kết nối hai chiều giữa giáo viên và phụ huynh học sinh.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M3-hoc-tap/bai-tap.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Bài tập"},
                {"doc": "Thông tư số 32/2018/TT-BGDĐT", "note": "Chương trình giáo dục phổ thông mới về phương pháp giao nhiệm vụ học tập"}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên bộ môn soạn bài tập kèm tài liệu đính kèm, chọn lớp và đặt hạn nộp; phụ huynh/học sinh xem đề bài và nộp ảnh chụp bài làm; giáo viên chấm bài, cho điểm hoặc nhận xét.",
            "flow_steps": [
                {"actor": "Giáo viên bộ môn", "action": "Tạo và giao bài tập", "desc": "Nhập tiêu đề, chọn môn học, lớp học, soạn nội dung đề bài, đính kèm file và đặt hạn nộp (Deadline)."},
                {"actor": "Hệ thống Notification", "action": "Gửi thông báo bài tập mới", "desc": "Gửi thông báo đẩy đến phụ huynh của các học sinh được giao bài."},
                {"actor": "Phụ huynh / Học sinh", "action": "Nộp bài làm", "desc": "Chụp ảnh bài tập làm trên vở hoặc tải tệp tài liệu lên ứng dụng trước hạn nộp."},
                {"actor": "Giáo viên", "action": "Chấm bài và Đánh giá", "desc": "Xem bài nộp, nhập điểm số (thang 10) hoặc nhận xét đánh giá, gửi kết quả về cho phụ huynh."}
            ],
            "steps_narrative": [
                "Giáo viên vào Học tập -> Bài tập, xem danh sách bài tập đã giao theo các lớp mình phụ trách.",
                "Bấm 'Giao bài tập mới', chọn Môn học, Lớp học và phạm vi (Cả lớp hoặc chọn một số học sinh cần bồi dưỡng/phụ đạo).",
                "Soạn nội dung hướng dẫn bằng rich text, tải lên tệp đề bài đính kèm (PDF, ảnh, Word).",
                "Thiết lập hạn nộp bài và tùy chọn 'Ngày gửi' (nếu muốn hẹn giờ hệ thống tự động phát bài sau).",
                "Vào chi tiết bài tập để theo dõi danh sách nộp bài qua 2 tab: Đã nộp bài và Chưa nộp bài.",
                "Giáo viên có thể bấm 'Nộp bài thay' nếu học sinh nộp vở trực tiếp trên lớp.",
                "Thực hiện chấm bài: chấm điểm hoặc ghi lời phê nhận xét chi tiết cho từng bài làm."
            ],
            "rules": [
                {"id": "BR-01", "title": "Ràng buộc thông tin bài tập", "desc": "Bài tập bắt buộc phải có Tiêu đề, Môn học, Lớp học và Hạn nộp bài; hạn nộp phải lớn hơn thời điểm giao bài."},
                {"id": "BR-02", "title": "Giao bài theo đối tượng linh hoạt", "desc": "Cho phép giao bài tập cho toàn bộ lớp học hoặc chỉ chọn một danh sách học sinh cụ thể trong lớp."},
                {"id": "BR-03", "title": "Ghi nhận trạng thái nộp bài và nộp muộn", "desc": "Hệ thống tự động phân loại trạng thái: Chưa nộp, Đã nộp đúng hạn, Nộp muộn (nộp sau giờ deadline) và Đã được giáo viên chấm."},
                {"id": "BR-04", "title": "Quyền nộp bài thay của giáo viên", "desc": "Giáo viên và Admin có quyền nộp bài thay học sinh (tải ảnh bài làm hoặc xác nhận đã thu vở trên lớp) kèm ghi chú nộp thay."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-036 Giao và chấm bài tập", "feature": "Tạo và phát hành bài tập", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên, tôi muốn giao bài tập về nhà kèm hướng dẫn chi tiết để học sinh ôn tập.", "jira": "BT-001"},
                {"epic": "E-036 Giao và chấm bài tập", "feature": "Theo dõi nộp bài và Chấm điểm", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên, tôi muốn chấm bài trực tuyến và gửi nhận xét cho phụ huynh.", "jira": "BT-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-BT-01",
                    "name": "Tạo và giao bài tập mới",
                    "desc": "Giáo viên khởi tạo bài tập cho học sinh.",
                    "actor": "Giáo viên bộ môn / Giáo viên chủ nhiệm",
                    "trigger": "Bấm 'Tạo bài tập mới'.",
                    "pre": "Tài khoản giáo viên đã được phân công dạy môn học tại lớp.",
                    "happy_path": [
                        "1. Nhập Tiêu đề bài tập.",
                        "2. Chọn Môn học, Lớp học và chọn 'Cả lớp'.",
                        "3. Soạn nội dung hướng dẫn làm bài và đính kèm tệp đề bài.",
                        "4. Đặt Hạn nộp bài.",
                        "5. Bấm 'Giao bài tập' -> Hệ thống lưu và gửi thông báo push cho phụ huynh."
                    ],
                    "exceptions": [
                        "Hạn nộp trong quá khứ: Báo lỗi 'Hạn nộp bài phải lớn hơn thời điểm hiện tại'."
                    ],
                    "post": "Bài tập hiển thị trên danh sách bài tập của lớp và trên app phụ huynh.",
                    "rules": "BR-01, BR-02"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Học tập</strong> -> Chọn <strong>Bài tập</strong>.",
            "overview_screen": [
                {"component": "Bộ lọc Môn học & Lớp học", "format": "Select Box Lớp + Select Box Môn", "desc": "Lọc bài tập theo lớp và môn học được phân công giảng dạy.", "note": "Hỗ trợ tìm kiếm theo tiêu đề bài tập"},
                {"component": "Bảng danh sách bài tập đã giao", "format": "Table dữ liệu", "desc": "Hiển thị: STT, Tiêu đề bài tập, Môn học, Lớp, Ngày giao, Hạn nộp, Tiến độ nộp (Đã nộp/Sĩ số), Trạng thái (Đang mở/Đã hết hạn), Thao tác (Chấm bài/Sửa/Xóa).", "note": "Có thanh tiến độ nộp bài trực quan"},
                {"component": "Nút tác vụ chính", "format": "Primary Button", "desc": "Nút 'Tạo bài tập mới' ở góc phải trên.", "note": "Chỉ giáo viên và admin có quyền"}
            ],
            "form_screen": [
                {"field": "Tiêu đề bài tập", "type": "Text Input", "validation": "Bắt buộc, tối đa 200 ký tự", "note": "BR-01"},
                {"field": "Môn học", "type": "Select Box", "validation": "Bắt buộc chọn môn", "note": "Lấy từ danh mục Môn học M5/SM4"},
                {"field": "Lớp học & Đối tượng", "type": "Select Box + Radio", "validation": "Bắt buộc chọn lớp; Cả lớp hoặc Học sinh chỉ định", "note": "BR-02"},
                {"field": "Hạn nộp bài", "type": "Date Time Picker", "validation": "Bắt buộc, > thời điểm hiện tại", "note": "BR-01"},
                {"field": "Tệp đính kèm đề bài", "type": "File Upload", "validation": "Tối đa 5 file, < 25MB/file (PDF, DOCX, JPG, PNG)", "note": "Đề bài và tài liệu tham khảo"}
            ],
            "notifications": [
                {"context": "Có bài tập mới", "type": "Push Notification", "body": "Môn {ten_mon} vừa có bài tập mới: {tieu_de_bai_tap}. Hạn nộp: {han_nop}.", "onclick": "Mở chi tiết bài tập trên app"},
                {"context": "Giáo viên đã chấm bài", "type": "Push Notification", "body": "Bài tập môn {ten_mon} của bé đã được giáo viên chấm điểm và nhận xét. Chạm để xem chi tiết.", "onclick": "Xem kết quả bài tập"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Giao bài tập với đầy đủ tệp đính kèm và hạn nộp", "desc": "Giáo viên tạo được bài tập mới cho cả lớp hoặc học sinh chỉ định với đầy đủ văn bản hướng dẫn và tệp đính kèm dung lượng hợp lệ."},
            {"id": "AC-02", "title": "Theo dõi tiến độ nộp bài chính xác theo thời gian thực", "desc": "Danh sách nộp bài hiển thị chính xác các học sinh đã nộp và chưa nộp; bài nộp sau hạn nộp được gắn thẻ cảnh báo 'Nộp muộn' màu cam."},
            {"id": "AC-03", "title": "Chức năng nộp bài thay hoạt động chính xác", "desc": "Giáo viên nộp bài thay học sinh cập nhật trạng thái sang 'Đã nộp bài (Nộp thay)' và lưu lại ghi chú rõ ràng."},
            {"id": "AC-04", "title": "Chấm bài và gửi phản hồi điểm số/nhận xét thành công", "desc": "Sau khi giáo viên bấm 'Lưu đánh giá', kết quả điểm số và lời phê lập tức gửi thông báo push đến phụ huynh học sinh."}
        ]
    },

    # 36. M3/SM3 - Điểm & Đánh giá
    {
        "code": "M3/SM3",
        "name": "M3 - SM3 - Điểm & Đánh giá",
        "parent_module": "M3",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Sổ điểm &amp; Đánh giá học tập (Gradebook &amp; Student Evaluation)</strong> thuộc nhóm <strong>M3: Học tập</strong> là hệ thống quản lý kết quả học tập chính thống theo quy chế của Bộ Giáo dục &amp; Đào tạo (Thông tư 22, 27, 22); quản lý điểm kiểm tra thường xuyên, giữa kỳ, cuối kỳ, tổng kết điểm trung bình môn, đánh giá năng lực &amp; phẩm chất, và xuất phiếu liên lạc điện tử.",
            "goals": "Chuẩn hóa sổ điểm điện tử, hỗ trợ nhập điểm nhanh dạng bảng tính (Spreadsheet UI), tự động tính toán điểm trung bình chính xác, khóa sổ học kỳ chống gian lận và hỗ trợ trích xuất bảng tổng hợp học bạ chuẩn Bộ GD&ĐT.",
            "scope": "Quản lý điểm số và đánh giá định kỳ cho toàn bộ học sinh các cấp từ Tiểu học đến THPT trong toàn trường.",
            "references": [
                {"doc": "docs_legacy/operating-portal/M3-hoc-tap/diem-danh-gia.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Điểm & Đánh giá"},
                {"doc": "Thông tư 27/2020/TT-BGDĐT & Thông tư 22/2021/TT-BGDĐT", "note": "Quy chế đánh giá học sinh tiểu học và trung học cơ sở"}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên bộ môn nhập điểm kiểm tra theo từng đầu điểm quy định; hệ thống tự động tính điểm trung bình; BGH kiểm tra, khóa sổ học kỳ và phát hành phiếu kết quả cho phụ huynh.",
            "flow_steps": [
                {"actor": "Giáo viên bộ môn", "action": "Nhập điểm theo cột", "desc": "Mở bảng điểm lớp phụ trách, nhập điểm kiểm tra miệng, 15 phút, 1 tiết, giữa kỳ và cuối kỳ."},
                {"actor": "Hệ thống BE", "action": "Tính toán tự động", "desc": "Tính điểm trung bình môn theo đúng trọng số hệ số (HS1, HS2, HS3) do Bộ quy định."},
                {"actor": "Giáo viên chủ nhiệm", "action": "Đánh giá phẩm chất & Năng lực", "desc": "Nhận xét định tính các mức Hoàn thành tốt (T), Hoàn thành (H), Chưa hoàn thành (C)."},
                {"actor": "Ban Giám Hiệu", "action": "Khóa sổ điểm & Công bố", "desc": "Duyệt kết quả toàn trường, khóa sổ điểm học kỳ và phát hành phiếu liên lạc điện tử."}
            ],
            "steps_narrative": [
                "Giáo viên vào Học tập -> Điểm & Đánh giá, chọn Khối, Lớp, Môn học và Học kỳ cần nhập điểm.",
                "Giao diện hiển thị bảng điểm dạng bảng tính (Spreadsheet): danh sách học sinh theo thứ tự số báo danh hoặc ABC.",
                "Các cột điểm gồm: Điểm thường xuyên (ĐTX), Điểm giữa kỳ (ĐGK), Điểm cuối kỳ (ĐCK) và Cột điểm trung bình môn (TBM).",
                "Giáo viên nhập điểm nhanh bằng bàn phím số (hỗ trợ phím Enter để xuống dòng tiếp theo).",
                "Hệ thống kiểm tra tính hợp lệ: điểm phải từ 0.0 đến 10.0; nếu nhập sai sẽ báo lỗi viền đỏ ngay lập tức.",
                "Cuối học kỳ, BGH thực hiện 'Khóa sổ điểm': sau khi khóa, không ai được phép sửa đổi trừ khi có lệnh mở khóa đặc biệt kèm lý do kiểm toán."
            ],
            "rules": [
                {"id": "BR-01", "title": "Công thức tính điểm trung bình chuẩn Bộ GD&ĐT", "desc": "Điểm TBM tính theo công thức: (Tổng điểm ĐTX + Điểm ĐGK × 2 + Điểm ĐCK × 3) / (Số cột ĐTX + 5), làm tròn đến 1 chữ số thập phân."},
                {"id": "BR-02", "title": "Khóa sổ điểm học kỳ bảo vệ dữ liệu", "desc": "Sau khi BGH ban hành quyết định khóa sổ điểm học kỳ, giao diện chuyển sang chỉ đọc (Read-only); mọi yêu cầu sửa đổi điểm bắt buộc phải có biên bản kiểm tra và phê duyệt của Hiệu trưởng."},
                {"id": "BR-03", "title": "Ràng buộc khoảng điểm hợp lệ", "desc": "Điểm số phải là số thực từ 0.0 đến 10.0, bước nhảy 0.1 điểm. Với môn học đánh giá bằng nhận xét, chỉ chấp nhận các mức Đạt (Đ) hoặc Chưa đạt (CĐ)."},
                {"id": "BR-04", "title": "Nhật ký kiểm toán sửa điểm (Audit Log)", "desc": "Mọi thao tác sửa điểm sau khi đã lưu ban đầu bắt buộc phải lưu vết: Điểm cũ, Điểm mới, Người sửa, Thời gian và Lý do chỉnh sửa."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-037 Sổ điểm và Đánh giá học tập", "feature": "Nhập điểm và Tính toán tự động", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên bộ môn, tôi muốn nhập điểm trên bảng tính mượt mà và tự động tính điểm trung bình.", "jira": "DG-001"},
                {"epic": "E-037 Sổ điểm và Đánh giá học tập", "feature": "Khóa sổ điểm và Xuất phiếu liên lạc", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn khóa sổ điểm và xuất phiếu báo điểm định dạng PDF cho phụ huynh.", "jira": "DG-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-DG-01",
                    "name": "Nhập điểm kiểm tra môn học",
                    "desc": "Giáo viên nhập điểm theo bảng danh sách lớp.",
                    "actor": "Giáo viên bộ môn",
                    "trigger": "Chọn lớp, môn học và học kỳ.",
                    "pre": "Sổ điểm chưa bị khóa bởi BGH.",
                    "happy_path": [
                        "1. Mở bảng điểm môn học của lớp.",
                        "2. Nhập điểm vào các cột ĐTX, ĐGK, ĐCK bằng bàn phím số.",
                        "3. Hệ thống tự động tính lại điểm TBM tương ứng sau mỗi ô nhập.",
                        "4. Bấm 'Lưu bảng điểm' -> Hệ thống xác nhận và lưu thành công."
                    ],
                    "exceptions": [
                        "Điểm ngoài khoảng 0-10: Báo lỗi 'Điểm số không hợp lệ (phải từ 0 đến 10)'.",
                        "Sổ điểm đã khóa: Báo lỗi 'Sổ điểm học kỳ đã khóa, không thể chỉnh sửa'."
                    ],
                    "post": "Bảng điểm được cập nhật vào cơ sở dữ liệu học tập.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Học tập</strong> -> Chọn <strong>Điểm & Đánh giá</strong>.",
            "overview_screen": [
                {"component": "Thanh chọn Khối, Lớp, Môn, Kỳ", "format": "Dropdown Select", "desc": "Chọn Khối lớp, Lớp học, Môn học và Học kỳ (Học kỳ 1 / Học kỳ 2 / Cả năm).", "note": "Mặc định hiển thị học kỳ hiện hành"},
                {"component": "Bảng điểm Spreadsheet UI", "format": "Bảng nhập liệu tương tác", "desc": "Hiển thị: STT, Mã HS, Họ và tên, Các cột ĐTX 1, ĐTX 2, ĐTX 3, Điểm Giữa kỳ, Điểm Cuối kỳ, Điểm Trung bình môn (TBM).", "note": "Hỗ trợ phím tắt điều hướng Tab / Enter"},
                {"component": "Thanh tác vụ điều khiển", "format": "Action Bar", "desc": "Nút 'Lưu bảng điểm', 'Khóa sổ điểm' (chỉ BGH), 'Xuất bảng điểm Excel', 'In phiếu liên lạc PDF'.", "note": "Hiển thị badge trạng thái: Đang mở / Đã khóa"}
            ],
            "form_screen": [
                {"field": "Học sinh", "type": "Display Row", "validation": "Hiển thị Mã HS và Họ tên học sinh", "note": "Cố định cột bên trái khi cuộn ngang"},
                {"field": "Điểm thường xuyên", "type": "Number Input", "validation": "Từ 0.0 đến 10.0, bước nhảy 0.1", "note": "Hệ số 1"},
                {"field": "Điểm Giữa kỳ", "type": "Number Input", "validation": "Từ 0.0 đến 10.0, bước nhảy 0.1", "note": "Hệ số 2"},
                {"field": "Điểm Cuối kỳ", "type": "Number Input", "validation": "Từ 0.0 đến 10.0, bước nhảy 0.1", "note": "Hệ số 3"},
                {"field": "Lý do chỉnh sửa điểm", "type": "Text Input Modal", "validation": "Bắt buộc khi sửa điểm đã lưu trước đó", "note": "BR-04"}
            ],
            "notifications": [
                {"context": "Khóa sổ điểm học kỳ", "type": "In-app Alert", "body": "Ban Giám Hiệu đã thực hiện khóa sổ điểm môn {ten_mon} học kỳ {hoc_ky}.", "onclick": "Xem bảng điểm chỉ đọc"},
                {"context": "Công bố kết quả học tập", "type": "Push Notification", "body": "Bảng điểm tổng kết học kỳ của học sinh {ten_hoc_sinh} đã có. Kính mời quý phụ huynh xem phiếu liên lạc.", "onclick": "Mở phiếu báo điểm trên app"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Bảng nhập điểm tương tác nhanh và mượt mà", "desc": "Giáo viên nhập điểm liên tục bằng phím số và phím Enter/Tab mượt mà; hệ thống cập nhật tức thì điểm trung bình môn theo đúng công thức Bộ GD&ĐT."},
            {"id": "AC-02", "title": "Kiểm tra ràng buộc điểm số chính xác", "desc": "Hệ thống chặn việc lưu các giá trị điểm âm (< 0) hoặc lớn hơn 10 (> 10) và hiển thị cảnh báo đỏ ngay tại ô nhập liệu."},
            {"id": "AC-03", "title": "Khóa sổ điểm bảo vệ toàn vẹn dữ liệu", "desc": "Sau khi BGH bấm 'Khóa sổ điểm', toàn bộ các ô nhập điểm chuyển sang trạng thái Disable; không ai có thể sửa đổi nếu không có lệnh mở khóa kèm biên bản."},
            {"id": "AC-04", "title": "Xuất phiếu liên lạc PDF chuẩn mẫu Bộ GD&ĐT", "desc": "Xuất phiếu báo điểm và học bạ điện tử định dạng PDF hiển thị đầy đủ thông tin học sinh, điểm số chi tiết từng môn và nhận xét của giáo viên chủ nhiệm."}
        ]
    },

    # 37. M1/SM1 - Tổng quan
    {
        "code": "M1/SM1",
        "name": "M1 - SM1 - Tổng quan",
        "parent_module": "M1",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Tổng quan điều hành (Executive Dashboard)</strong> thuộc nhóm <strong>M1: Tổng quan</strong> là trung tâm thông tin điều hành dành cho Ban Giám Hiệu, Cán bộ quản lý và Kế toán trường học; cung cấp bức tranh toàn cảnh về quy mô học sinh, giáo viên, tỷ lệ chuyên cần điểm danh hàng ngày, tiến độ thu học phí tháng, biểu đồ thu chi và cảnh báo các công việc tồn đọng.",
            "goals": "Cung cấp chỉ số vận hành tức thì (Real-time KPI), giúp lãnh đạo nhà trường ra quyết định nhanh chóng, phát hiện sớm các bất thường về chuyên cần hoặc công nợ tài chính, và điều hướng nhanh đến các phân hệ nghiệp vụ chi tiết.",
            "scope": "Bảng điều khiển trung tâm tích hợp toàn diện dữ liệu từ tất cả các phân hệ Vận hành (M2), Học tập (M3), Tài chính (M4), Nhà trường (M5) và Cấu hình (M6).",
            "references": [
                {"doc": "docs_legacy/operating-portal/M1-tong-quan/SM1-tong-quan.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Tổng quan"},
                {"doc": "Hệ thống chỉ số quản trị trường học thông minh Finviet School Analytics", "note": "Quy chuẩn KPI và mô hình dữ liệu"}
            ]
        },
        "business": {
            "flow_desc": "Hệ thống tự động tổng hợp dữ liệu từ Điểm danh (M2/SM1), Học phí (M4/SM1), Học sinh (M5/SM1), Nhân viên (M5/SM2) và vẽ các thẻ chỉ số KPI, biểu đồ phân tích và danh sách cảnh báo vận hành.",
            "flow_steps": [
                {"actor": "Hệ thống BE", "action": "Tổng hợp chỉ số định kỳ", "desc": "Quét và tính toán dữ liệu tổng hợp theo thời gian thực hoặc bộ nhớ đệm cache 5 phút."},
                {"actor": "Ban Giám Hiệu", "action": "Truy cập Dashboard", "desc": "Mở màn hình Tổng quan, xem các thẻ KPI: Tổng học sinh, Tỷ lệ điểm danh hôm nay, Tiến độ thu học phí tháng."},
                {"actor": "Ban Giám Hiệu", "action": "Kiểm tra cảnh báo tồn đọng", "desc": "Xem danh sách việc cần xử lý: Đơn xin nghỉ phép chưa duyệt, Hóa đơn quá hạn, Góp ý chưa phản hồi."},
                {"actor": "Ban Giám Hiệu", "action": "Điều hướng chi tiết", "desc": "Click vào thẻ chỉ số để mở trực tiếp phân hệ nghiệp vụ tương ứng giải quyết công việc."}
            ],
            "steps_narrative": [
                "Người dùng đăng nhập vào hệ thống, trang đầu tiên hiển thị mặc định là Tổng quan điều hành.",
                "Hàng trên cùng hiển thị 4 thẻ KPI chính: Tổng số học sinh đang học, Tổng số cán bộ giáo viên, Tỷ lệ chuyên cần ngày hôm nay (%), Tiến độ hoàn thành thu học phí tháng (%).",
                "Phần thân trang gồm hai biểu đồ lớn: Biểu đồ cột theo dõi tỷ lệ điểm danh theo khối lớp trong tuần; và Biểu đồ đường phân tích dòng tiền thu chi theo từng tháng.",
                "Cột bên phải hiển thị danh sách widget 'Cần xử lý ngay': các đơn xin nghỉ phép chờ duyệt từ M2/SM4, ý kiến góp ý phụ huynh gần hết hạn SLA từ M5/SM11, và các bài viết chờ duyệt từ M5/SM6.",
                "Bấm vào bất kỳ thẻ hoặc chỉ số nào lập tức điều hướng chính xác đến trang quản trị phân hệ đó."
            ],
            "rules": [
                {"id": "BR-01", "title": "Dữ liệu cập nhật thời gian thực (Real-time)", "desc": "Các chỉ số về Điểm danh và Học sinh cập nhật ngay lập tức khi có check-in mới; số liệu tài chính đối soát đồng bộ định kỳ tối đa 5 phút."},
                {"id": "BR-02", "title": "Bảo mật hiển thị theo vai trò (Role-based Widget)", "desc": "Chỉ tài khoản BGH và Kế toán mới nhìn thấy thẻ chỉ số Doanh thu và Học phí; tài khoản giáo viên chỉ nhìn thấy chỉ số lớp mình phụ trách."},
                {"id": "BR-03", "title": "Cảnh báo chỉ số bất thường", "desc": "Làm nổi bật màu đỏ đối với các lớp có tỷ lệ học sinh vắng mặt > 10% trong ngày hoặc các khoản học phí quá hạn thanh toán trên 15 ngày."},
                {"id": "BR-04", "title": "Bộ lọc thời gian linh hoạt", "desc": "Hỗ trợ chuyển đổi nhanh góc nhìn thời gian: Hôm nay, Tuần này, Tháng này, Học kỳ này hoặc Năm học hiện tại."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-038 Trung tâm điều hành thông tin", "feature": "Thẻ KPI tổng hợp và Biểu đồ trực quan", "platform": "Portal Web", "priority": "P1", "story": "Là Ban Giám Hiệu, tôi muốn xem các chỉ số KPI trường học và biểu đồ vận hành ngay khi đăng nhập.", "jira": "TQ-001"},
                {"epic": "E-038 Trung tâm điều hành thông tin", "feature": "Widget danh sách công việc cần xử lý", "platform": "Portal Web", "priority": "P1", "story": "Là Cán bộ quản lý, tôi muốn thấy danh sách việc tồn đọng để xử lý kịp thời không bị trễ hạn.", "jira": "TQ-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-TQ-01",
                    "name": "Theo dõi các chỉ số vận hành trường học",
                    "desc": "BGH xem tổng quan tình hình toàn trường.",
                    "actor": "Ban Giám Hiệu / Quản trị viên",
                    "trigger": "Đăng nhập hệ thống hoặc bấm 'Tổng quan' trên menu.",
                    "pre": "Hệ thống đã có dữ liệu vận hành từ các phân hệ M2, M4, M5.",
                    "happy_path": [
                        "1. Hệ thống tải toàn bộ thẻ KPI và biểu đồ trong vòng < 1.5 giây.",
                        "2. Người dùng xem tỷ lệ chuyên cần hôm nay và tiến độ thu phí tháng.",
                        "3. Bấm vào một thẻ KPI (VD: Điểm danh) -> Điều hướng thẳng đến Bảng điểm danh M2/SM1."
                    ],
                    "exceptions": [],
                    "post": "Nắm bắt toàn cảnh hoạt động của trường học.",
                    "rules": "BR-01, BR-02, BR-03"
                }
            ]
        },
        "ui": {
            "entry_point": "Thanh điều hướng bên trái -> Chọn mục <strong>Tổng quan</strong> (Biểu tượng Home hoặc Dashboard).",
            "overview_screen": [
                {"component": "Bộ 4 thẻ KPI chính", "format": "Metric Cards", "desc": "1. Tổng học sinh (kèm biến động so với kỳ trước); 2. Tổng cán bộ giáo viên; 3. Tỷ lệ đi học hôm nay (kèm số vắng có phép/không phép); 4. Tỷ lệ thu học phí tháng (kèm số tiền đã thu/phải thu).", "note": "Mỗi thẻ có icon minh họa và liên kết nhanh"},
                {"component": "Biểu đồ cột Chuyên cần theo khối", "format": "Bar Chart (Recharts)", "desc": "So sánh tỷ lệ chuyên cần giữa các khối lớp trong tuần hiện tại.", "note": "Hover hiển thị tooltip chi tiết"},
                {"component": "Biểu đồ đường Dòng tiền thu chi", "format": "Line Chart (Recharts)", "desc": "Đường màu xanh (Học phí thu vào) và đường màu đỏ (Khoản chi giải ngân) qua 12 tháng.", "note": "Chỉ hiển thị cho BGH và Kế toán"},
                {"component": "Widget Việc cần xử lý ngay", "format": "Action List Widget", "desc": "Danh sách các tác vụ chờ phê duyệt: Đơn nghỉ phép (M2/SM4), Góp ý khẩn (M5/SM11), Bài viết chờ duyệt (M5/SM6).", "note": "Có badge đếm số lượng việc tồn"}
            ],
            "form_screen": [],
            "notifications": [
                {"context": "Cảnh báo chuyên cần bất thường", "type": "Dashboard Banner", "body": "Cảnh báo: Hôm nay lớp {ten_lop} có tỷ lệ vắng mặt vượt quá 15%. Chạm để kiểm tra.", "onclick": "Điều hướng đến Điểm danh lớp"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Tốc độ tải trang Dashboard tối ưu (< 1.5 giây)", "desc": "Màn hình Tổng quan tải nhanh chóng toàn bộ dữ liệu 4 thẻ KPI và 2 biểu đồ lớn trong thời gian < 1.5 giây nhờ cơ chế cache dữ liệu thông minh."},
            {"id": "AC-02", "title": "Độ chính xác dữ liệu 100% từ các phân hệ nguồn", "desc": "Số liệu học sinh, giáo viên, tỷ lệ điểm danh và tiến độ thu phí khớp chính xác 100% với dữ liệu thực tế tại M5/SM1, M5/SM2, M2/SM1 và M4/SM1."},
            {"id": "AC-03", "title": "Điều hướng 1 chạm từ thẻ KPI sang phân hệ nguồn", "desc": "Click vào thẻ chỉ số hoặc mục công việc tồn đọng chuyển hướng chính xác đến phân hệ chuyên môn với bộ lọc tương ứng được kích hoạt sẵn."},
            {"id": "AC-04", "title": "Bảo mật phân quyền thẻ tài chính nghiêm ngặt", "desc": "Tài khoản giáo viên hoặc nhân viên không có quyền tài chính sẽ bị ẩn hoàn toàn biểu đồ dòng tiền và thẻ doanh thu học phí."}
        ]
    },

    # 38. M7/SM1 - Khác
    {
        "code": "M7/SM1",
        "name": "M7 - SM1 - Khác",
        "parent_module": "M7",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "26 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "intro": "Phân hệ <strong>Tiện ích &amp; Quản trị tài khoản cá nhân (User Profile &amp; Account Utilities)</strong> thuộc nhóm <strong>M7: Khác</strong> chịu trách nhiệm quản lý thông tin hồ sơ của người dùng đang đăng nhập, đổi mật khẩu, quản lý phiên làm việc thiết bị, kích hoạt xác thực hai yếu tố (2FA), tùy chọn giao diện hiển thị và liên hệ hỗ trợ kỹ thuật Finviet.",
            "goals": "Cung cấp trung tâm quản lý tài khoản cá nhân an toàn, hỗ trợ người dùng tự cập nhật thông tin liên hệ, tăng cường bảo mật tài khoản với chính sách mật khẩu mạnh và hỗ trợ đăng xuất từ xa khi nghi ngờ lộ tài khoản.",
            "scope": "Áp dụng cho tất cả người dùng đăng nhập hệ thống Portal QLTH (BGH, Giáo viên, Kế toán, Nhân viên, Admin).",
            "references": [
                {"doc": "docs_legacy/operating-portal/M7-khac/SM1-khac.md", "note": "Đặc tả nghiệp vụ legacy phân hệ Khác"},
                {"doc": "Tiêu chuẩn an toàn thông tin ISO/IEC 27001", "note": "Quy định về quản lý phiên đăng nhập và mật khẩu"}
            ]
        },
        "business": {
            "flow_desc": "Người dùng đăng nhập mở trang cá nhân để xem thông tin, thực hiện đổi mật khẩu định kỳ, xem danh sách thiết bị đang đăng nhập tài khoản và liên hệ kênh trợ giúp kỹ thuật khi cần.",
            "flow_steps": [
                {"actor": "Người dùng", "action": "Mở trang tài khoản cá nhân", "desc": "Click vào avatar góc phải trên cùng -> Chọn 'Hồ sơ cá nhân'."},
                {"actor": "Người dùng", "action": "Đổi mật khẩu", "desc": "Nhập mật khẩu hiện tại, nhập mật khẩu mới thỏa mãn chính sách bảo mật, xác nhận đổi."},
                {"actor": "Hệ thống BE", "action": "Xác thực và Cập nhật", "desc": "Kiểm tra độ mạnh mật khẩu, mã hóa bcrypt/argon2 và gửi email thông báo bảo mật."},
                {"actor": "Người dùng", "action": "Đăng xuất thiết bị lạ", "desc": "Kiểm tra danh sách phiên đăng nhập và bấm 'Đăng xuất khỏi tất cả thiết bị khác'."}
            ],
            "steps_narrative": [
                "Người dùng click vào tên hoặc avatar góc trên bên phải thanh tiêu đề, chọn 'Tài khoản của tôi'.",
                "Màn hình hiển thị thông tin: Họ tên, Tên đăng nhập, Email, Số điện thoại, Vai trò trong trường và Danh sách quyền hạn.",
                "Chuyển sang tab 'Bảo mật': thực hiện đổi mật khẩu tài khoản bằng cách nhập mật khẩu cũ và mật khẩu mới.",
                "Xem mục 'Phiên đăng nhập': hiển thị danh sách các thiết bị/trình duyệt đang đăng nhập (kèm địa chỉ IP, vị trí và thời gian truy cập gần nhất).",
                "Nếu phát hiện phiên đăng nhập lạ, người dùng có thể bấm 'Đăng xuất khỏi thiết bị này' hoặc 'Đăng xuất khỏi tất cả thiết bị khác'.",
                "Chuyển sang tab 'Trợ giúp & Hỗ trợ': xem thông tin liên hệ tổng đài hỗ trợ Finviet, gửi phiếu yêu cầu kỹ thuật (Support Ticket) hoặc mở tài liệu hướng dẫn sử dụng."
            ],
            "rules": [
                {"id": "BR-01", "title": "Chính sách mật khẩu an toàn", "desc": "Mật khẩu mới tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ít nhất một ký tự đặc biệt (@, #, $, !); không được trùng với mật khẩu của 3 lần gần nhất."},
                {"id": "BR-02", "title": "Bảo vệ khi đổi mật khẩu", "desc": "Bắt buộc phải nhập chính xác mật khẩu hiện tại trước khi thiết lập mật khẩu mới; nếu nhập sai quá 5 lần sẽ tạm khóa chức năng đổi mật khẩu trong 30 phút."},
                {"id": "BR-03", "title": "Hủy phiên đăng nhập từ xa (Remote Session Revoke)", "desc": "Thao tác đăng xuất từ xa lập tức đưa JWT token của các thiết bị đó vào danh sách đen (Blacklist/Revocation list) và buộc đăng xuất ngay trong request tiếp theo."},
                {"id": "BR-04", "title": "Ghi nhận nhật ký bảo mật", "desc": "Mọi thay đổi về mật khẩu, email hoặc đăng xuất từ xa đều được ghi nhận vào nhật ký kiểm toán bảo mật và gửi thông báo cảnh báo về email của chủ tài khoản."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-039 Tiện ích tài khoản cá nhân", "feature": "Hồ sơ cá nhân và Đổi mật khẩu", "platform": "Portal Web", "priority": "P1", "story": "Là Người dùng, tôi muốn xem thông tin tài khoản và đổi mật khẩu định kỳ để bảo vệ tài khoản.", "jira": "KH-001"},
                {"epic": "E-039 Tiện ích tài khoản cá nhân", "feature": "Quản lý phiên đăng nhập và Trợ giúp", "platform": "Portal Web", "priority": "P1", "story": "Là Người dùng, tôi muốn kiểm tra các thiết bị đang đăng nhập và liên hệ hỗ trợ khi gặp sự cố.", "jira": "KH-002"}
            ],
            "use_cases": [
                {
                    "id": "UC-KH-01",
                    "name": "Đổi mật khẩu tài khoản cá nhân",
                    "desc": "Người dùng cập nhật mật khẩu mới.",
                    "actor": "Người dùng đang đăng nhập",
                    "trigger": "Vào Hồ sơ cá nhân -> Tab Bảo mật -> Bấm 'Đổi mật khẩu'.",
                    "pre": "Đang đăng nhập tài khoản hợp lệ.",
                    "happy_path": [
                        "1. Nhập mật khẩu hiện tại.",
                        "2. Nhập mật khẩu mới và xác nhận mật khẩu mới.",
                        "3. Hệ thống kiểm tra độ mạnh mật khẩu đạt yêu cầu.",
                        "4. Bấm 'Lưu thay đổi' -> Hệ thống cập nhật mật khẩu mới và gửi thông báo thành công."
                    ],
                    "exceptions": [
                        "Mật khẩu hiện tại không đúng: Báo lỗi 'Mật khẩu hiện tại không chính xác'.",
                        "Mật khẩu mới không đạt độ mạnh: Báo lỗi 'Mật khẩu mới phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt'."
                    ],
                    "post": "Mật khẩu mới có hiệu lực cho các lần đăng nhập tiếp theo.",
                    "rules": "BR-01, BR-02, BR-04"
                }
            ]
        },
        "ui": {
            "entry_point": "Góc phải trên cùng màn hình -> Click Avatar/Tên người dùng -> Chọn <strong>Tài khoản của tôi</strong> (hoặc Menu Khác).",
            "overview_screen": [
                {"component": "Tabs quản trị tài khoản", "format": "Tab Navigation", "desc": "Các tab: Thông tin chung, Bảo mật & Đổi mật khẩu, Phiên đăng nhập, Trợ giúp & Hỗ trợ.", "note": "Giao diện hiện đại, dễ thao tác"},
                {"component": "Thẻ thông tin hồ sơ", "format": "Profile Card", "desc": "Ảnh đại diện, Họ tên, Mã nhân sự/giáo viên, Đơn vị trường học, Vai trò (Admin/BGH/Giáo viên), Ngày tham gia hệ thống.", "note": "Hỗ trợ đổi ảnh đại diện"},
                {"component": "Danh sách phiên thiết bị", "format": "Session List", "desc": "Hiển thị: Tên thiết bị/Trình duyệt (Chrome trên MacOS), Địa chỉ IP, Vị trí ước tính, Thời điểm đăng nhập, Nút 'Đăng xuất thiết bị'.", "note": "Phiên hiện tại có nhãn 'Thiết bị này' màu xanh"}
            ],
            "form_screen": [
                {"field": "Mật khẩu hiện tại", "type": "Password Input", "validation": "Bắt buộc, kiểm tra đúng mật khẩu cũ", "note": "BR-02"},
                {"field": "Mật khẩu mới", "type": "Password Input", "validation": "Bắt buộc, tối thiểu 8 ký tự, đủ chữ hoa/thường/số/ký tự đặc biệt", "note": "BR-01"},
                {"field": "Xác nhận mật khẩu mới", "type": "Password Input", "validation": "Bắt buộc, phải trùng khớp với Mật khẩu mới", "note": "Khớp 100%"},
                {"field": "Số điện thoại liên hệ", "type": "Text Input", "validation": "10 chữ số chuẩn định dạng VN", "note": "Để nhận thông báo OTP"}
            ],
            "notifications": [
                {"context": "Đổi mật khẩu thành công", "type": "Toast Success + Email", "body": "Tài khoản của bạn vừa đổi mật khẩu thành công vào lúc {thoi_gian}. Nếu không phải bạn, hãy liên hệ ngay với hỗ trợ.", "onclick": "Đóng toast"}
            ]
        },
        "acceptance_criteria": [
            {"id": "AC-01", "title": "Đổi mật khẩu an toàn theo đúng chính sách bảo mật", "desc": "Hệ thống kiểm tra tính hợp lệ của mật khẩu cũ và áp dụng chính sách mật khẩu mạnh (chữ hoa, chữ thường, số, ký tự đặc biệt); chặn các mật khẩu yếu."},
            {"id": "AC-02", "title": "Hiển thị đầy đủ danh sách các phiên đăng nhập", "desc": "Mục Phiên đăng nhập liệt kê chính xác các thiết bị, trình duyệt và địa chỉ IP đang duy trì đăng nhập của tài khoản."},
            {"id": "AC-03", "title": "Đăng xuất từ xa hủy phiên làm việc lập tức", "desc": "Bấm 'Đăng xuất khỏi tất cả thiết bị khác' vô hiệu hóa tức thì JWT token trên các thiết bị cũ, buộc các phiên đó phải đăng nhập lại."},
            {"id": "AC-04", "title": "Kênh liên hệ hỗ trợ kỹ thuật rõ ràng", "desc": "Cung cấp đầy đủ thông tin số tổng đài hotline, Zalo hỗ trợ và nút gửi phiếu yêu cầu trợ giúp kỹ thuật Finviet trực tiếp trên portal."}
        ]
    }
]

print("Milestone 3 Phase 3B complete...")

ALL_M3 = []
ALL_M3.extend(MODULES_3A)
ALL_M3.extend(MODULES_3A_CONT)
ALL_M3.extend(MODULES_3B)

assert len(ALL_M3) == 12, f"Expected 12 modules, got {len(ALL_M3)}"

content = f'''# -*- coding: utf-8 -*-
"""
Milestone 3 PRD Definitions for Portal QLTH (Rebuild Roadmap).
Total: {len(ALL_M3)} sub-modules:
  Phase 3A (7 sub-modules): M5/SM4, M5/SM6, M5/SM11, M5/SM10, M5/SM8, M5/SM14, M5/SM7
  Phase 3B (5 sub-modules): M3/SM1, M3/SM2, M3/SM3, M1/SM1, M7/SM1
Generated automatically.
"""

MILESTONE_3_PRDS = {json.dumps(ALL_M3, ensure_ascii=False, indent=2)}
'''

with open('tools/confluence/milestone3_data.py', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully generated tools/confluence/milestone3_data.py with {len(ALL_M3)} sub-modules!")
