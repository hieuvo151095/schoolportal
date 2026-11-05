# -*- coding: utf-8 -*-
"""
Milestone 2 Sub-modules Part 2 (Comprehensive v2 Standard)
Covers 5 sub-modules:
  6. M2/SM4 - M2 - SM4 - Trao đổi (Parent Messaging & Absence Approvals)
  7. M6/SM6 - M6 - SM6 - Thông báo (Notification Settings & Templates)
  8. M2/SM5 - M2 - SM5 - Báo cáo Điểm danh (Monthly Attendance & Overtime Late Fees)
  9. M2/SM3 - M2 - SM3 - Thư viện (Media Albums & AI Face Recognition Tagging)
 10. M2/SM6 - M2 - SM6 - Báo cáo Mở rộng (Developmental Extended Reports & Evaluation)
"""

PART2_PRDS = [
    # -------------------------------------------------------------------------
    # 6. M2/SM4 - Trao đổi (Parent Messaging & Absence Approvals)
    # -------------------------------------------------------------------------
    {
        "code": "M2/SM4",
        "name": "M2 - SM4 - Trao đổi",
        "parent_module": "M2",
        "priority": "MUST HAVE",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Kênh Trao đổi Thông tin Trực tiếp & Quản lý Đơn xin phép (Direct Parent Messaging & Digital Absence Approval)</strong> thuộc nhóm <strong>M2: Vận hành</strong> đóng vai trò là cầu nối giao tiếp bảo mật, chính thống và tập trung giữa Nhà trường (Ban Giám Hiệu, Giáo viên chủ nhiệm) và Phụ huynh học sinh. Phân hệ xóa bỏ sự phân mảnh khi trao đổi qua các mạng xã hội bên ngoài (Zalo cá nhân, tin nhắn SMS), cung cấp 2 cấu trúc liên lạc chuyên biệt: Kênh trò chuyện 1:1 (`/demo/conversations/`) và Kênh trò chuyện nhóm lớp/nhóm chuyên đề (`/demo/conversations/group/`). Đồng thời, phân hệ tích hợp quy trình số hóa tiếp nhận và phê duyệt 'Đơn xin nghỉ học', 'Dặn thuốc y tế', 'Ủy quyền đón hộ' qua các Thẻ tin nhắn tương tác (Interactive Cards), tự động tiêm tin nhắn kiểm toán hệ thống và liên thông với sổ điểm danh.",
            "goals_list": [
                "Cung cấp 2 mô hình trao đổi độc lập: Trò chuyện 1:1 với từng phụ huynh và Trò chuyện Nhóm (toàn lớp hoặc nhóm phụ huynh tự chọn).",
                "Phân loại hội thoại thông minh theo nhãn nghiệp vụ (Category Filtering): Báo vắng, Dặn thuốc, Đón hộ, Trao đổi chung.",
                "Tích hợp thẻ tương tác 'Đơn xin nghỉ học' (`AbsenceMessageCard`) cho phép giáo viên bấm 1-chạm 'Xác nhận nghỉ' hoặc 'Từ chối' trực tiếp trong luồng chat.",
                "Tự động tiêm thông điệp kiểm toán hệ thống (Audit Trail System Message) khi trạng thái đơn nghỉ học thay đổi.",
                "Thuật toán khử trùng lặp người nhận thông minh (Smart Parent Recipient Deduplication) gom nhóm phụ huynh có nhiều con cùng học ('PH của Em A, Em B').",
                "Hỗ trợ tìm kiếm sâu đa yếu tố (Multi-factor Deep Search) theo tên phụ huynh, tên học sinh, số điện thoại và nội dung tin nhắn.",
                "Hỗ trợ tính năng thu hồi tin nhắn trong vòng 15 phút (Message Recall) và đánh dấu hội thoại 'Đã phản hồi' (School Responded Star)."
            ],
            "target_users": [
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Tương tác trực tiếp & duyệt đơn nghỉ", "actions": "Đọc tin nhắn phụ huynh, trả lời thắc mắc, bấm duyệt thẻ báo vắng và xem danh sách dặn thuốc."},
                {"group": "Phụ huynh học sinh", "role": "Gửi tin nhắn & nộp đơn xin phép", "actions": "Gửi đơn xin nghỉ học, dặn cô giáo cho con uống thuốc, thông báo người đón hộ và trao đổi tình hình học tập."},
                {"group": "Cán bộ Y tế trường học", "role": "Theo dõi đơn dặn thuốc", "actions": "Xem đơn dặn thuốc của phụ huynh gửi giáo viên để phối hợp cho học sinh uống thuốc đúng giờ và đúng liều lượng."}
            ],
            "glossary": [
                {"term": "Thẻ tin nhắn tương tác (Interactive Card)", "definition": "Khung tin nhắn đặc biệt có cấu trúc (gồm tiêu đề, thời gian nghỉ, lý do, nút bấm hành động 'Xác nhận' / 'Từ chối') hiển thị trực tiếp trong cuộc hội thoại."},
                {"term": "Deduplication người nhận", "definition": "Cơ chế tự động gom một phụ huynh có 2 con trở lên học cùng trường thành một đối tượng nhận duy nhất để tránh gửi trùng tin nhắn."},
                {"term": "Thu hồi tin nhắn (Recall)", "definition": "Hành động hủy hiển thị nội dung tin nhắn đối với cả người gửi và người nhận khi phát hiện sai sót trong thời gian cho phép."},
                {"term": "Ngôi sao phản hồi (Responded Star)", "definition": "Biểu tượng ngôi sao vàng đánh dấu giáo viên đã trả lời hoặc xử lý xong yêu cầu của phụ huynh, giúp tránh bỏ sót tin nhắn."}
            ]
        },
        "business": {
            "flow_desc": "Phụ huynh gửi đơn xin nghỉ qua App, tin nhắn chuyển thành thẻ tương tác trong kênh chat của GVCN; giáo viên bấm 'Xác nhận nghỉ', hệ thống tự động tiêm tin nhắn kiểm toán và đồng bộ vắng mặt vào sổ điểm danh M2/SM1.",
            "flow_steps": [
                {"actor": "Phụ huynh", "action": "Gửi đơn xin nghỉ học", "desc": "Phụ huynh mở App, chọn 'Báo vắng', nhập ngày nghỉ từ 28/10 đến 29/10, lý do 'Bé sốt cao' và bấm gửi."},
                {"actor": "Hệ thống BE", "action": "Tạo Interactive Card", "desc": "Chuyển đổi yêu cầu thành AbsenceMessageCard và đẩy vào luồng chat 1:1 của GVCN lớp tương ứng."},
                {"actor": "GVCN", "action": "Xem & Bấm 'Xác nhận nghỉ'", "desc": "Mở `/demo/conversations/`, đọc đơn xin phép và nhấp nút 'Xác nhận nghỉ' màu xanh lá."},
                {"actor": "Hệ thống BE", "action": "Tiêm tin nhắn kiểm toán & Đồng bộ", "desc": "Cập nhật trạng thái card thành 'Đã duyệt', tiêm tin nhắn 'Hệ thống: Giáo viên [Tên GV] đã duyệt đơn nghỉ', đồng thời cập nhật sổ điểm danh ngày 28-29/10."},
                {"actor": "Phụ huynh", "action": "Nhận Push Notification", "desc": "App phụ huynh nhận thông báo tức thì: 'Đơn xin nghỉ học của bé đã được cô giáo xác nhận'."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Tiếp nhận tin nhắn & Phân loại): GVCN truy cập phân hệ Trao đổi. Cột danh sách bên trái hiển thị 2 tab: 'Cá nhân (1:1)' và 'Nhóm'. Phía trên có các chip lọc: Tất cả, Báo vắng, Dặn thuốc, Đón hộ. Badge đỏ hiển thị số tin nhắn chưa đọc.",
                "Giai đoạn 2 (Xử lý đơn tương tác): Khi nhấp vào cuộc trò chuyện có đơn báo vắng, khung chat hiển thị AbsenceMessageCard nổi bật với thông tin bé, thời gian nghỉ và lý do. Giáo viên có thể bấm 'Xác nhận' hoặc 'Hủy đơn' (BR-MSG-03).",
                "Giai đoạn 3 (Kiểm toán tự động): Ngay khi bấm duyệt, hệ thống tiêm một dòng tin nhắn hệ thống màu xám chính giữa luồng chat ghi rõ danh tính người duyệt và thời gian (BR-MSG-04).",
                "Giai đoạn 4 (Trao đổi hai chiều): Giáo viên gõ nội dung trả lời trong khung soạn thảo kèm gửi ảnh hoặc tệp tài liệu. Nếu gửi nhầm, giáo viên có thể rê chuột và chọn 'Thu hồi tin nhắn' trong vòng 15 phút (BR-MSG-12).",
                "Giai đoạn 5 (Quản lý nhóm & Banner cảnh báo): Tại kênh nhóm lớp, GVCN có thể mở modal quản lý thành viên, kiểm tra danh sách phụ huynh đã gom nhóm (BR-MSG-08). Banner đầu trang hiển thị thông báo quan trọng về các bé đang ốm cần theo dõi."
            ],
            "rules": [
                {"id": "BR-MSG-01", "title": "Phân định 2 topology trò chuyện (1:1 vs Nhóm)", "desc": "Hệ thống tách biệt hoàn toàn luồng chat riêng tư 1:1 (giáo viên và một phụ huynh) với luồng chat Nhóm (giáo viên và tập thể phụ huynh trong lớp hoặc ban đại diện)."},
                {"id": "BR-MSG-02", "title": "Bộ lọc hội thoại theo chuyên đề", "desc": "Cho phép lọc nhanh các hội thoại có phát sinh: Báo vắng học sinh, Dặn thuốc y tế, Ủy quyền đón hộ để giáo viên ưu tiên xử lý việc khẩn cấp đầu giờ."},
                {"id": "BR-MSG-03", "title": "Máy trạng thái Đơn báo vắng (State Machine)", "desc": "Thẻ đơn báo vắng có 3 trạng thái: 'Chờ duyệt' (nút Xác nhận & Hủy hiển thị), 'Đã xác nhận' (hiển thị badge xanh lá, khóa nút), 'Đã từ chối' (hiển thị badge xám kèm lý do)."},
                {"id": "BR-MSG-04", "title": "Tiêm tin nhắn kiểm toán hệ thống (Audit Message)", "desc": "Mọi thay đổi trạng thái đơn từ bắt buộc phải sinh ra một tin nhắn hệ thống (System Message) không thể xóa trong luồng chat để đảm bảo tính pháp lý và minh bạch."},
                {"id": "BR-MSG-08", "title": "Khử trùng lặp người nhận (Deduplication)", "desc": "Nếu một phụ huynh có từ 2 con trở lên học cùng lớp hoặc trường, khi giáo viên gửi thông báo nhóm hoặc tạo danh sách, phụ huynh chỉ xuất hiện 1 lần duy nhất với nhãn hiển thị gom: 'PH của Em A, Em B'."},
                {"id": "BR-MSG-12", "title": "Quy tắc thu hồi tin nhắn", "desc": "Người gửi chỉ được phép thu hồi tin nhắn trong vòng tối đa 15 phút kể từ thời điểm gửi. Sau 15 phút, tùy chọn thu hồi sẽ bị vô hiệu hóa."}
            ],
            "data_entities": [
                {"field": "conversation_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính định danh phòng trò chuyện."},
                {"field": "type", "type": "Enum", "required": "Bắt buộc", "desc": "Loại phòng: 'direct' (1:1) hoặc 'group' (Nhóm)."},
                {"field": "class_id", "type": "UUID", "required": "Tùy chọn", "desc": "Lớp học liên kết nếu là nhóm lớp."},
                {"field": "sender_id", "type": "UUID", "required": "Bắt buộc", "desc": "Tài khoản gửi tin nhắn."},
                {"field": "message_text", "type": "Text", "required": "Tùy chọn", "desc": "Nội dung văn bản tin nhắn."},
                {"field": "message_type", "type": "Enum", "required": "Bắt buộc", "desc": "Loại tin: 'text', 'image', 'file', 'absence_card', 'medicine_card', 'system_audit'."},
                {"field": "card_payload", "type": "JSON", "required": "Tùy chọn", "desc": "Dữ liệu chi tiết của thẻ đơn xin nghỉ / dặn thuốc (thời gian, lý do, trạng thái)."},
                {"field": "is_recalled", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ đánh dấu tin nhắn đã bị thu hồi hay chưa."},
                {"field": "created_at", "type": "Timestamp", "required": "Bắt buộc", "desc": "Thời điểm gửi tin nhắn."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-004 Vận hành Trao đổi", "feature": "Danh sách hội thoại đa kênh & Bộ lọc chuyên đề", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem danh sách các cuộc trò chuyện phân loại theo Báo vắng, Dặn thuốc để xử lý nhanh.", "jira": "TD-001"},
                {"epic": "E-004 Vận hành Trao đổi", "feature": "Luồng chat trực tiếp & Thẻ đơn xin nghỉ học tương tác", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn bấm duyệt đơn xin nghỉ học của phụ huynh ngay trong cửa sổ chat.", "jira": "TD-002"},
                {"epic": "E-004 Vận hành Trao đổi", "feature": "Kênh trò chuyện nhóm lớp & Quản lý thành viên gom nhóm", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn gửi thông báo chung cho toàn thể phụ huynh lớp trong kênh chat nhóm.", "jira": "TD-003"},
                {"epic": "E-004 Vận hành Trao đổi", "feature": "Thu hồi tin nhắn & Banner tin quan trọng", "platform": "Portal Web", "priority": "P2", "story": "Là GVCN, tôi muốn thu hồi tin nhắn gửi nhầm và ghim các dặn dò quan trọng.", "jira": "TD-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-TD-01",
                    "name": "Duyệt đơn xin nghỉ học trong luồng chat",
                    "desc": "Giáo viên tiếp nhận và phê duyệt thẻ đơn báo vắng.",
                    "actor": "Giáo viên chủ nhiệm (GVCN)",
                    "trigger": "GVCN mở cuộc trò chuyện với phụ huynh có đơn báo vắng.",
                    "pre": "Phụ huynh đã gửi đơn xin phép nghỉ từ ứng dụng di động.",
                    "happy_path": [
                        "1. GVCN mở danh sách hội thoại, nhấp vào phụ huynh có badge 'Báo vắng'.",
                        "2. Khung chat hiển thị AbsenceMessageCard ghi rõ ngày nghỉ và lý do.",
                        "3. GVCN bấm nút 'Xác nhận nghỉ' (màu xanh lá).",
                        "4. Hệ thống đổi trạng thái thẻ thành 'Đã duyệt'.",
                        "5. Một tin nhắn hệ thống được tiêm vào luồng chat: 'Cô [Tên GV] đã xác nhận đơn nghỉ'.",
                        "6. Hệ thống đồng bộ vắng có phép vào sổ điểm danh M2/SM1."
                    ],
                    "exceptions": [
                        {"case": "Đơn xin nghỉ gửi vào ngày đã khóa sổ", "handling": "Hệ thống thông báo 'Ngày xin nghỉ đã qua thời hạn xử lý' và yêu cầu liên hệ BGH."}
                    ],
                    "post": "Đơn nghỉ được duyệt và đồng bộ vào CSDL điểm danh.",
                    "rules": ["BR-MSG-03", "BR-MSG-04"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Vận hành -> Trao đổi (`/[schoolCode]/conversations` và `.../group`)",
            "screens_table": [
                {"screen": "Giao diện trò chuyện tổng thể (`ChatThread`)", "component": "Cột danh sách hội thoại (`ConversationList`)", "format": "2 Tab chính: 1:1 và Nhóm; Hàng chip lọc: Tất cả, Báo vắng, Dặn thuốc, Đón hộ; Danh sách hội thoại (Avatar, Tên PH, Tên con, Đoạn trích tin cuối, Badge chưa đọc, Ngôi sao vàng)", "desc": "Cột trái cho phép chuyển đổi nhanh giữa các cuộc trò chuyện.", "note": "BR-MSG-01, BR-MSG-02"},
                {"screen": "Giao diện trò chuyện tổng thể (`ChatThread`)", "component": "Khung hiển thị tin nhắn (`ChatThread`)", "format": "Header phòng chat (Tên người nhận, Trạng thái online, Nút lịch sử), Dòng thời gian tin nhắn (Bong bóng chat gửi/nhận, Phân cách ngày, Thẻ đơn từ), Khung soạn thảo tin nhắn", "desc": "Khu vực tương tác chính giữa GV và Phụ huynh.", "note": "Hỗ trợ thu hồi tin nhắn"},
                {"screen": "Thẻ tin nhắn đơn xin nghỉ (`AbsenceMessageCard`)", "component": "Thẻ đơn báo vắng tương tác", "format": "Card bo góc màu vàng nhạt gồm: Tên học sinh, Khoảng ngày nghỉ, Lý do, Badge trạng thái, 2 Nút hành động: 'Xác nhận nghỉ' (xanh lá) và 'Hủy đơn' (đỏ)", "desc": "Thẻ chức năng phê duyệt nhanh không cần rời khỏi màn hình chat.", "note": "BR-MSG-03, BR-MSG-04"},
                {"screen": "Modal tin quan trọng (`ImportantMessagesModal`)", "component": "Hộp thoại tổng hợp dặn thuốc và ốm đau", "format": "Danh sách các đơn dặn thuốc đang có hiệu lực trong ngày và danh sách học sinh đang nghỉ ốm", "desc": "Kích hoạt từ banner đỉnh trang để giáo viên bao quát nhanh.", "note": "Prototype hoàn chỉnh"},
                {"screen": "Modal chi tiết nhóm lớp (`GroupDetailsModal`)", "component": "Hộp thoại quản lý thành viên nhóm chat", "format": "Tab Danh sách học sinh (kèm nút xóa học sinh khỏi nhóm), Tab Danh sách phụ huynh (đã áp dụng khử trùng lặp PH có nhiều con)", "desc": "Quản trị người nhận trong kênh trao đổi nhóm lớp.", "note": "BR-MSG-08"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-TD-01",
                "title": "Lọc hội thoại theo thẻ chuyên đề Báo vắng",
                "scenario": "Given GVCN đang có 15 cuộc trò chuyện với phụ huynh\nWhen bấm vào chip lọc 'Báo vắng'\nThen danh sách lập tức lọc chỉ hiển thị các cuộc trò chuyện có chứa đơn xin nghỉ học chưa duyệt hoặc vừa phát sinh."
            },
            {
                "id": "AC-TD-02",
                "title": "Phê duyệt đơn xin nghỉ học một chạm",
                "scenario": "Given Phụ huynh gửi đơn xin nghỉ 2 ngày từ 28/10 đến 29/10 trong luồng chat\nWhen GVCN bấm nút 'Xác nhận nghỉ' trên thẻ AbsenceMessageCard\nThen thẻ chuyển sang trạng thái 'Đã duyệt' màu xanh lá, xuất hiện dòng tin nhắn hệ thống ghi rõ người duyệt và hệ thống đồng bộ trạng thái vắng có phép vào sổ điểm danh."
            },
            {
                "id": "AC-TD-03",
                "title": "Thu hồi tin nhắn trong vòng 15 phút",
                "scenario": "Given GVCN vừa gửi một tin nhắn văn bản vào lúc 09:00\nWhen giáo viên bấm menu ngữ cảnh và chọn 'Thu hồi tin nhắn' lúc 09:05\nThen nội dung tin nhắn được thay thế bằng thông điệp 'Tin nhắn đã được thu hồi' ở cả màn hình giáo viên và phụ huynh."
            },
            {
                "id": "AC-TD-04",
                "title": "Khử trùng lặp phụ huynh có 2 con trong nhóm lớp",
                "scenario": "Given Phụ huynh Lê Thu Trang có 2 con sinh đôi cùng học lớp 1A1\nWhen GVCN mở modal GroupDetailsModal xem danh sách người nhận nhóm\nThen hệ thống chỉ hiển thị 1 dòng đại diện duy nhất cho phụ huynh Lê Thu Trang với mô tả 'PH của Em An, Em Bình'."
            }
        ],
        "nfr": {
            "performance": "Gửi và nhận tin nhắn qua WebSocket trong thời gian < 200ms; tải lịch sử 50 tin nhắn gần nhất dưới 500ms.",
            "security": "Mã hóa đường truyền TLS 1.3; phân quyền nghiêm ngặt không cho phép phụ huynh lớp này xem trộm tin nhắn lớp khác.",
            "ux": "Giao diện chia 2 cột chuẩn thiết kế ứng dụng chat hiện đại (Telegram / Messenger style) kết hợp màu sắc nhận diện Finviet ECO."
        },
        "appendix": {
            "notifications": [
                {"event": "Tin nhắn mới đến", "channel": "Toast & In-app sound", "recipient": "Giáo viên", "content": "Phụ huynh [Họ tên] vừa gửi tin nhắn: '[Đoạn trích]'."},
                {"event": "Đơn nghỉ được duyệt", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Đơn xin nghỉ học của bé [Tên con] đã được cô giáo [Tên GV] xác nhận."},
                {"event": "Nhắc nhở dặn thuốc", "channel": "Banner đỉnh trang", "recipient": "Giáo viên", "content": "Hôm nay lớp có 2 học sinh có đơn dặn thuốc cần cho uống lúc 11:30."}
            ],
            "edge_cases": [
                {"condition": "Phụ huynh thu hồi tin nhắn sau khi giáo viên đã bấm duyệt đơn báo vắng", "solution": "Hệ thống chỉ cho phép thu hồi tin nhắn văn bản; đối với Thẻ đơn xin nghỉ học đã được giáo viên phê duyệt thì không thể thu hồi."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 7. M6/SM6 - Cấu hình thông báo (Notification Settings & Templates)
    # -------------------------------------------------------------------------
    {
        "code": "M6/SM6",
        "name": "M6 - SM6 - Thông báo",
        "parent_module": "M6",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Cấu hình Kênh & Mẫu Thông báo Đẩy Tự động (Notification Channel Matrix & Automated Event Triggers)</strong> thuộc nhóm <strong>M6: Cấu hình</strong> chịu trách nhiệm quản trị toàn bộ chính sách thông tin liên lạc tự động từ trường học tới Phụ huynh, Giáo viên và Cán bộ quản lý (`/[schoolCode]/setting/notification`). Phân hệ cung cấp ma trận điều phối đa kênh (Push Notification trên Mobile App, Tin nhắn Zalo ZNS / Zalo OA, Tin nhắn SMS Brandname và Email thông báo), hỗ trợ quản lý kho mẫu thông điệp (Notification Templates) kèm các biến động (Dynamic Variables), đồng thời thiết lập khung giờ giới hạn gửi tin ('Giờ yên lặng') để tránh làm phiền phụ huynh vào ban đêm.",
            "goals_list": [
                "Cung cấp ma trận cấu hình kênh gửi cho 25+ sự kiện vận hành (Điểm danh đến/về, Báo vắng, Phát hành hóa đơn học phí, Nhắc nợ, Hoạt động mới...).",
                "Quản lý trạng thái bật/tắt của từng kênh: Push Notification (miễn phí), Zalo ZNS (tối ưu chi phí), SMS Brandname (dự phòng khẩn cấp) và Email.",
                "Biên tập mẫu thông báo động với trình soạn thảo hỗ trợ chèn biến: `{ten_hoc_sinh}`, `{ten_lop}`, `{gio_checkin}`, `{so_tien_hoc_phi}`, `{han_nop}`...",
                "Thiết lập cơ chế Fallback thông minh: Ưu tiên gửi App Push -> nếu không có internet hoặc chưa cài app thì tự động chuyển tiếp qua Zalo ZNS sau 15 phút -> nếu thất bại chuyển sang SMS Brandname.",
                "Cấu hình khung giờ yên lặng (Quiet Hours): Ngăn chặn hệ thống tự động bắn tin nhắn không khẩn cấp từ 21:30 đến 06:30 sáng hôm sau."
            ],
            "target_users": [
                {"group": "Ban Giám Hiệu (BGH)", "role": "Ban hành chính sách truyền thông", "actions": "Quyết định sự kiện nào được gửi SMS tốn phí, sự kiện nào chỉ gửi Push App miễn phí để tối ưu hóa ngân sách."},
                {"group": "Kế toán trường học", "role": "Cấu hình thông báo học phí", "actions": "Kích hoạt kênh nhắc nợ học phí tự động vào ngày mùng 5 và ngày 10 hàng tháng qua Zalo ZNS."},
                {"group": "Quản trị viên hệ thống (IT Admin)", "role": "Cấu hình tích hợp nhà mạng & Zalo OA", "actions": "Khai báo Brandname SMS, cấu hình Zalo OA App ID và Secret Key, kiểm tra tỷ lệ gửi thành công."}
            ],
            "glossary": [
                {"term": "Push Notification", "definition": "Thông báo đẩy trực tiếp lên màn hình khóa điện thoại thông qua ứng dụng di động của phụ huynh hoặc giáo viên."},
                {"term": "Zalo ZNS", "definition": "Dịch vụ tin nhắn thông báo chăm sóc khách hàng qua Zalo Official Account có tích xanh, chi phí rẻ hơn SMS và định dạng đẹp."},
                {"term": "SMS Brandname", "definition": "Tin nhắn viễn thông hiển thị tên trường (ví dụ: TRUONG_ANHSAO) tại mục người gửi thay vì số điện thoại rác."},
                {"term": "Quiet Hours", "definition": "Khoảng thời gian ban đêm hệ thống tạm hoãn phát thông báo thông thường và gom lại gửi vào đầu giờ sáng hôm sau."}
            ]
        },
        "business": {
            "flow_desc": "Khi sự kiện nghiệp vụ phát sinh (ví dụ: Check-in đón trẻ), hệ thống đối chiếu ma trận M6/SM6, nạp mẫu tin, thay thế biến động và đẩy vào hàng đợi gửi tin theo đúng kênh đã kích hoạt.",
            "flow_steps": [
                {"actor": "Sự kiện vận hành", "action": "Phát sinh sự kiện", "desc": "Giáo viên check-in cho học sinh lúc 07:45."},
                {"actor": "Hệ thống Thông báo", "action": "Tra cứu ma trận cấu hình", "desc": "Kiểm tra sự kiện 'Điểm danh đến': Kênh Push App đang Bật, Kênh Zalo đang Tắt, Kênh SMS đang Tắt."},
                {"actor": "Hệ thống Thông báo", "action": "Trộn mẫu & Biến động", "desc": "Lấy mẫu: 'Bé {ten_hoc_sinh} đã đến lớp {ten_lop} lúc {gio_checkin}', thay thế thành 'Bé Minh Khang đã đến lớp 1A1 lúc 07:45'."},
                {"actor": "Hàng đợi Message Queue", "action": "Đẩy qua Gateway", "desc": "Gửi payload qua Firebase Cloud Messaging (FCM) đến máy phụ huynh."},
                {"actor": "Phụ huynh", "action": "Nhận thông báo", "desc": "Màn hình điện thoại hiển thị thông báo với âm thanh báo nhẹ nhàng."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Truy cập & Lựa chọn nhóm sự kiện): Admin vào Cấu hình -> Thông báo. Màn hình phân loại sự kiện theo 4 nhóm lớn: Vận hành điểm danh, Tài chính học phí, Học tập & Nhà trường, Hoạt động & Trao đổi.",
                "Giai đoạn 2 (Thiết lập kênh gửi): Tại mỗi dòng sự kiện, Admin có 4 nút gạt Switch tương ứng: Push App, Zalo ZNS, SMS Brandname, Email. Admin bật kênh mong muốn.",
                "Giai đoạn 3 (Chỉnh sửa nội dung mẫu tin): Bấm nút 'Sửa mẫu' trên từng sự kiện để mở modal biên tập. Người dùng có thể chỉnh sửa câu chữ và nhấp chọn các biến động gợi ý bên dưới.",
                "Giai đoạn 4 (Cấu hình ngân sách & Hạn mức SMS): Admin thiết lập số lượng tin SMS tối đa được phát trong tháng để tránh phát sinh chi phí viễn thông vượt kế hoạch.",
                "Giai đoạn 5 (Kích hoạt Giờ yên tĩnh): Đặt khung giờ hoãn tin ban đêm (ví dụ: 22:00 - 06:00). Mọi thông báo không thuộc nhóm khẩn cấp sẽ được lưu vào hàng đợi và tự động bắn vào lúc 06:30."
            ],
            "rules": [
                {"id": "BR-NOTI-01", "title": "Ưu tiên kênh không tốn phí (App Push First)", "desc": "Hệ thống luôn ưu tiên gửi thông báo qua Mobile App Push miễn phí trước. Chỉ kích hoạt SMS Brandname tốn phí đối với các sự kiện khẩn cấp (Sức khỏe, Nghỉ học đột xuất do bão lũ, Nhắc nợ quá hạn)."},
                {"id": "BR-NOTI-02", "title": "Bảo vệ Giờ yên tĩnh (Quiet Hours Enforcement)", "desc": "Không gửi thông báo thông thường (khen thưởng, ảnh hoạt động, thực đơn tuần) trong khoảng thời gian từ 21:30 đến 06:30. Các tin này được dời lịch tự động sang 06:30 sáng hôm sau."},
                {"id": "BR-NOTI-03", "title": "Ràng buộc tính toàn vẹn của biến mẫu tin", "desc": "Khi chỉnh sửa nội dung mẫu tin, các biến động bắt buộc (như `{ten_hoc_sinh}`) không được để trống hoặc sai cú pháp ký tự."},
                {"id": "BR-NOTI-04", "title": "Hạn mức ngân sách viễn thông hàng tháng (Budget Cap)", "desc": "Nếu số lượng tin SMS Brandname trong tháng chạm ngưỡng 95% gói ngân sách đã đăng ký, hệ thống tự động gửi cảnh báo tới Kế toán và tạm thời ngắt kênh SMS tự động."}
            ],
            "data_entities": [
                {"field": "event_code", "type": "String (50)", "required": "Bắt buộc", "desc": "Mã sự kiện: ví dụ 'ATTENDANCE_CHECKIN', 'FEE_INVOICE_ISSUED' 'FEE_REMINDER' 'HEALTH_ALERT'..."},
                {"field": "event_name", "type": "String (100)", "required": "Bắt buộc", "desc": "Tên mô tả sự kiện hiển thị trên UI."},
                {"field": "is_push_enabled", "type": "Boolean", "required": "Mặc định True", "desc": "Bật/Tắt kênh Mobile App Push."},
                {"field": "is_zalo_enabled", "type": "Boolean", "required": "Mặc định False", "desc": "Bật/Tắt kênh Zalo ZNS."},
                {"field": "is_sms_enabled", "type": "Boolean", "required": "Mặc định False", "desc": "Bật/Tắt kênh SMS Brandname."},
                {"field": "is_email_enabled", "type": "Boolean", "required": "Mặc định False", "desc": "Bật/Tắt kênh Email."},
                {"field": "template_content", "type": "Text", "required": "Bắt buộc", "desc": "Nội dung mẫu tin nhắn chứa các biến động."},
                {"field": "quiet_hours_enabled", "type": "Boolean", "required": "Mặc định True", "desc": "Áp dụng khung giờ yên tĩnh hay không."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-030 Cấu hình Thông báo", "feature": "Ma trận điều phối kênh thông báo", "platform": "Portal Web", "priority": "P1", "story": "Là BGH, tôi muốn xem bảng ma trận các sự kiện và bật tắt các kênh gửi tương ứng.", "jira": "NOTI-001"},
                {"epic": "E-030 Cấu hình Thông báo", "feature": "Trình chỉnh sửa mẫu thông báo động", "platform": "Portal Web", "priority": "P1", "story": "Là Admin, tôi muốn sửa nội dung mẫu tin nhắn gửi phụ huynh và chèn các biến như Tên bé, Giờ đón.", "jira": "NOTI-002"},
                {"epic": "E-030 Cấu hình Thông báo", "feature": "Thiết lập khung giờ yên tĩnh & Hạn mức SMS", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn chặn gửi thông báo ban đêm và kiểm soát chi phí tin nhắn SMS.", "jira": "NOTI-003"}
            ],
            "use_cases": [
                {
                    "id": "UC-NOTI-01",
                    "name": "Cấu hình kênh gửi cho sự kiện Phát hành hóa đơn",
                    "desc": "Kích hoạt kênh Zalo ZNS khi trường phát hành hóa đơn học phí mới.",
                    "actor": "Kế toán / School Admin",
                    "trigger": "Admin mở Cấu hình -> Thông báo -> Nhóm Tài chính.",
                    "pre": "Trường đã tích hợp Zalo OA thành công.",
                    "happy_path": [
                        "1. Admin tìm đến dòng sự kiện 'Phát hành thông báo học phí'.",
                        "2. Gạt bật công tắc ở cột 'Zalo ZNS' và 'Push App'.",
                        "3. Bấm vào nút icon bút chì để xem trước mẫu tin ZNS.",
                        "4. Mẫu tin hiển thị: 'Kính gửi PH {ten_phu_huynh}, Trường xin gửi thông báo học phí tháng {thang} của bé {ten_hoc_sinh}: {so_tien} VNĐ'.",
                        "5. Admin bấm 'Lưu cấu hình'.",
                        "6. Hệ thống hiển thị Toast thông báo thành công."
                    ],
                    "exceptions": [
                        {"case": "Zalo OA chưa kết nối API key", "handling": "Hệ thống cảnh báo 'Vui lòng cấu hình kết nối Zalo OA trước khi kích hoạt kênh ZNS'."}
                    ],
                    "post": "Cấu hình kênh thông báo được lưu vào CSDL tenant.",
                    "rules": ["BR-NOTI-01", "BR-NOTI-03"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Cấu hình -> Thông báo (`/[schoolCode]/setting/notification`)",
            "screens_table": [
                {"screen": "Bảng cấu hình thông báo (`NotificationSettingsView`)", "component": "Bảng ma trận sự kiện và kênh", "format": "Bảng phân nhóm: Tên sự kiện, Mô tả, 4 Cột Switch toggle (App Push, Zalo ZNS, SMS, Email), Cột Xem/Sửa mẫu, Nút Lưu tổng thể", "desc": "Trung tâm điều khiển chính toàn bộ kênh thông báo trường.", "note": "BR-NOTI-01"},
                {"screen": "Bảng cấu hình thông báo (`NotificationSettingsView`)", "component": "Card cấu hình giờ yên tĩnh", "format": "Switch kích hoạt, Time Picker 'Từ giờ' (21:30) và 'Đến giờ' (06:30), Checkbox ngoại lệ cho sự kiện khẩn cấp", "desc": "Bảo vệ giấc ngủ của phụ huynh và giáo viên.", "note": "BR-NOTI-02"},
                {"screen": "Modal sửa mẫu thông báo (`TemplateEditModal`)", "component": "Hộp thoại chỉnh sửa nội dung mẫu tin", "format": "Textarea soạn thảo, Thanh chip biến số gợi ý ({ten_hoc_sinh}, {gio_checkin}...), Khung mô phỏng hiển thị trên màn hình điện thoại (Phone Mockup Preview)", "desc": "Giúp người dùng xem trước chính xác tin nhắn phụ huynh sẽ nhận được.", "note": "BR-NOTI-03"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-NOTI-01",
                "title": "Bật tắt kênh gửi theo sự kiện thành công",
                "scenario": "Given Sự kiện 'Đón trẻ thành công' đang chỉ bật kênh App Push\nWhen Admin gạt bật thêm kênh 'Zalo ZNS' và bấm 'Lưu cấu hình'\nThen hệ thống lưu thành công và kể từ lần điểm danh tiếp theo, phụ huynh có đăng ký Zalo sẽ nhận được cả tin nhắn Push và tin Zalo."
            },
            {
                "id": "AC-NOTI-02",
                "title": "Hoãn gửi tin trong khung giờ yên tĩnh",
                "scenario": "Given Khung giờ yên tĩnh được cấu hình từ 22:00 đến 06:00 sáng hôm sau\nWhen giáo viên tải lên album ảnh lớp lúc 23:00\nThen hệ thống hoãn việc bắn thông báo Push về máy phụ huynh và lên lịch tự động phát đi vào lúc 06:30 sáng hôm sau."
            }
        ],
        "nfr": {
            "performance": "Gửi thông báo đẩy đến 500 phụ huynh trong thời gian < 3 giây qua hàng đợi Redis Queue.",
            "security": "Nội dung thông báo không chứa thông tin nhạy cảm (mật khẩu, mã OTP) trừ khi người dùng chủ động yêu cầu.",
            "ux": "Khung xem trước màn hình điện thoại (Phone Mockup) phản ánh chân thực giao diện thông báo iOS và Android."
        },
        "appendix": {
            "notifications": [
                {"event": "Lưu cấu hình kênh", "channel": "Toast xanh", "recipient": "Admin", "content": "Đã cập nhật thành công ma trận cấu hình kênh thông báo."},
                {"event": "Cảnh báo hạn mức SMS", "channel": "In-app Alert", "recipient": "BGH / Kế toán", "content": "Ngân sách SMS Brandname của trường đã dùng hết 90% số lượng trong tháng."}
            ],
            "edge_cases": [
                {"condition": "Mất kết nối API Gateway của nhà mạng viễn thông SMS", "solution": "Hệ thống tự động chuyển tiếp tin nhắn sang kênh Zalo ZNS hoặc Push App để đảm bảo phụ huynh vẫn nhận được thông tin."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 8. M2/SM5 - Báo cáo Điểm danh (Monthly Attendance & Overtime Late Fees)
    # -------------------------------------------------------------------------
    {
        "code": "M2/SM5",
        "name": "M2 - SM5 - Báo cáo Điểm danh",
        "parent_module": "M2",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Báo cáo Chuyên cần Tháng & Quản lý Phụ phí Trông muộn (Monthly Attendance Ledger & Overtime Childcare Surcharge)</strong> thuộc nhóm <strong>M2: Vận hành</strong> đóng vai trò là cơ quan tổng kết và chuẩn hóa dữ liệu điểm danh toàn trường (`/demo/reports/attendance/`). Phân hệ hỗ trợ cả 2 đối tượng trọng yếu: Học sinh và Nhân sự giáo viên. Với giao diện Lịch tháng trực quan (Monthly Calendar Matrix Grid), phân hệ hiển thị chi tiết lịch sử chuyên cần của từng học sinh/giáo viên theo từng ngày trong tháng, cho phép chỉnh sửa hồi tố lý do vắng mặt (Có phép P / Không phép KP), kiểm tra thân nhiệt và ghi chú từng ngày, đồng thời tự động tính toán phụ phí trông muộn (Late Pickup Fee) theo công thức bậc thang (ví dụ: 50.000 VNĐ / 30 phút muộn) để liên thông lập tức sang phân hệ Hóa đơn học phí (M4/SM1).",
            "goals_list": [
                "Cung cấp ma trận lịch chuyên cần tháng (Calendar Matrix Grid) hiển thị toàn bộ ngày trong tháng kèm ký hiệu trực quan (Tích xanh, Đồng hồ cam muộn, Chữ P có phép, Chữ KP không phép).",
                "Hỗ trợ tab kép: Báo cáo chuyên cần Học sinh theo Lớp và Báo cáo chấm công Cán bộ Nhân viên theo Tổ.",
                "Cung cấp Modal xem chi tiết ngày (`DailyAttendanceModal`): Hiển thị giờ đón, giờ trả, người đón, thân nhiệt và ghi chú sức khỏe của từng ngày cụ thể.",
                "Cho phép chỉnh sửa hồi tố trạng thái vắng (`EditAbsenceModal`): Bổ sung đơn xin phép nộp muộn để chuyển từ 'Không phép' sang 'Có phép' phục vụ xét hoàn tiền ăn.",
                "Tự động tính toán chi tiết phụ phí trông muộn (`LatePickupReportModal`): Xác định các ngày trả trẻ sau 17:30, tính số phút vượt chuẩn, tính tổng tiền phạt theo đơn giá 50.000 VNĐ/30 phút và xuất dữ liệu sang hóa đơn thu phí.",
                "Xuất bảng tổng hợp chuyên cần tháng định dạng Excel chuẩn quy định Sở GD&ĐT."
            ],
            "target_users": [
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Rà soát & chốt sổ chuyên cần tháng", "actions": "Kiểm tra lại số ngày vắng của lớp, cập nhật bổ sung phép cho học sinh nộp đơn muộn trước ngày khóa sổ."},
                {"group": "Kế toán học phí", "role": "Thu phí trông muộn & chốt ngày hoàn ăn", "actions": "Mở modal LatePickupReportModal để kiểm tra danh sách học sinh phát sinh phí trả muộn và đẩy vào hóa đơn tháng tới."},
                {"group": "Ban Giám Hiệu", "role": "Theo dõi tỷ lệ chuyên cần", "actions": "Đánh giá lớp có tỷ lệ đi học đều nhất trường để trao cờ thi đua và xem báo cáo chấm công của nhân sự."}
            ],
            "glossary": [
                {"term": "Ma trận lịch chuyên cần", "definition": "Bảng hiển thị học sinh theo hàng dọc và các ngày trong tháng (từ ngày 01 đến 31) theo hàng ngang, tự động ẩn các ngày Chủ nhật hoặc ngày nghỉ lễ."},
                {"term": "Ký hiệu P / KP", "definition": "P là viết tắt của 'Nghỉ Có Phép' (được hoàn tiền ăn bán trú); KP là viết tắt của 'Nghỉ Không Phép' (không được hoàn tiền)."},
                {"term": "Phụ phí trông muộn (Late Pickup)", "definition": "Khoản chi phí phụ thu khi phụ huynh đến đón con sau khung giờ quy định của nhà trường (thường là sau 17:30 hoặc 18:00)."},
                {"term": "Sửa hồi tố", "definition": "Thao tác cập nhật lại dữ liệu điểm danh của các ngày trong quá khứ trước khi tháng báo cáo được bấm Khóa sổ chính thức."}
            ]
        },
        "business": {
            "flow_desc": "Hệ thống tổng hợp dữ liệu điểm danh hàng ngày thành ma trận lịch tháng; GVCN rà soát và bổ sung phép, hệ thống tự động tính phụ phí trông muộn và chuyển số liệu sang kế toán lập hóa đơn.",
            "flow_steps": [
                {"actor": "GVCN / Kế toán", "action": "Mở Báo cáo điểm danh", "desc": "Truy cập `/demo/reports/attendance/`, chọn Lớp 1A1 và Tháng 10/2026."},
                {"actor": "Hệ thống BE", "action": "Sinh ma trận lịch tháng", "desc": "Truy vấn dữ liệu điểm danh từ M2/SM1, tính toán tổng số ngày Có mặt, Đến muộn, Có phép, Không phép và số buổi trông muộn."},
                {"actor": "GVCN", "action": "Chỉnh sửa hồi tố nếu có đơn", "desc": "Nhấp vào ngày 15/10 của học sinh An, mở EditAbsenceModal chuyển từ KP sang P kèm số đơn."},
                {"actor": "Kế toán", "action": "Kiểm tra phí trông muộn", "desc": "Bấm vào số buổi trông muộn, mở LatePickupReportModal để xem chi tiết các ngày muộn và tổng số tiền phụ thu."},
                {"actor": "Kế toán / BGH", "action": "Chốt số liệu & Xuất hóa đơn", "desc": "Bấm 'Đồng bộ sang Học phí' để tự động tạo khoản thu trông muộn trên hóa đơn kỳ tới."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Chọn đối tượng & Thời gian): Người dùng chọn tab 'Học Sinh' hoặc 'Nhân Viên', chọn Lớp học và Tháng làm việc. Hệ thống hiển thị thanh công cụ lọc và bảng ma trận lịch.",
                "Giai đoạn 2 (Xem ma trận chi tiết): Ma trận hiển thị các cột: Học sinh, các ngày từ 1 đến 31 (kèm ký hiệu thứ trong tuần: T2, T3, T4, T5, T6, T7), 4 cột tổng kết: Tổng có mặt, Đến muộn, Nghỉ phép (P), Không phép (KP) và Cột Phí trông muộn.",
                "Giai đoạn 3 (Kiểm tra ngày đơn lẻ): Nhấp đúp vào bất kỳ ô ngày nào của học sinh để mở DailyAttendanceModal hiển thị ảnh người đón, thân nhiệt 36.8°C và người ghi nhận.",
                "Giai đoạn 4 (Tính toán tiền trông muộn - BR05, BR06): Bấm vào link số buổi trông muộn, LatePickupReportModal tính toán chi tiết: Ví dụ ngày 10/10 đón lúc 18:15 (muộn 45 phút) -> tính 2 block 30 phút = 100.000 VNĐ.",
                "Giai đoạn 5 (Khóa sổ & Xuất báo cáo): Khi hết tháng, BGH bấm nút 'Khóa sổ chuyên cần' và xuất file Excel lưu trữ hồ sơ nhà trường."
            ],
            "rules": [
                {"id": "BR-REP-02", "title": "Xác định ngày làm việc và ngày nghỉ", "desc": "Ma trận lịch tự động tô xám các ngày Chủ nhật và các ngày nghỉ lễ toàn quốc đã cấu hình trong M5/SM12. Những ngày này không tính vào công chuẩn hoặc ngày đi học."},
                {"id": "BR-REP-03", "title": "Quyền sửa hồi tố có giới hạn", "desc": "Giáo viên chỉ được sửa hồi tố dữ liệu điểm danh trong tháng hiện tại trước ngày mùng 2 của tháng kế tiếp. Sau thời điểm này, bảng báo cáo bị khóa và chỉ có BGH mới có quyền mở lại."},
                {"id": "BR-REP-05", "title": "Công thức tính phụ phí trông muộn bậc thang", "desc": "Thời gian trả trẻ sau giờ chuẩn (17:30) bắt đầu tính phí theo block 30 phút. Từ 1 đến 30 phút tính 1 block (50.000 VNĐ), từ 31 đến 60 phút tính 2 block (100.000 VNĐ). Đơn giá lấy theo cấu hình trường M6/SM3."},
                {"id": "BR-REP-06", "title": "Tự động liên thông số liệu hoàn tiền và phụ thu", "desc": "Số ngày nghỉ Có phép (P) hợp lệ sẽ được chuyển sang phân hệ M4/SM1 để trừ tiền ăn. Tổng tiền phạt trông muộn được cộng vào dòng phụ phí của hóa đơn tháng tiếp theo."}
            ],
            "data_entities": [
                {"field": "student_id", "type": "UUID", "required": "Bắt buộc", "desc": "Học sinh được tổng hợp báo cáo."},
                {"field": "class_id", "type": "UUID", "required": "Bắt buộc", "desc": "Lớp học tương ứng."},
                {"field": "month_year", "type": "String (YYYY-MM)", "required": "Bắt buộc", "desc": "Tháng năm báo cáo."},
                {"field": "total_present", "type": "Integer", "required": "Bắt buộc", "desc": "Tổng số buổi có mặt."},
                {"field": "total_late", "type": "Integer", "required": "Bắt buộc", "desc": "Tổng số buổi đến muộn."},
                {"field": "total_excused", "type": "Integer", "required": "Bắt buộc", "desc": "Tổng số buổi nghỉ có phép (P)."},
                {"field": "total_unexcused", "type": "Integer", "required": "Bắt buộc", "desc": "Tổng số buổi nghỉ không phép (KP)."},
                {"field": "late_pickup_count", "type": "Integer", "required": "Bắt buộc", "desc": "Số lần phụ huynh đón muộn trong tháng."},
                {"field": "late_pickup_fee_total", "type": "Decimal (VND)", "required": "Bắt buộc", "desc": "Tổng tiền phạt trông muộn phát sinh trong tháng."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-005 Vận hành Báo cáo", "feature": "Ma trận lịch chuyên cần tháng (Calendar Grid)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN và Kế toán, tôi muốn xem lịch chuyên cần của cả lớp trong cả tháng để nắm bức tranh tổng thể.", "jira": "BC-001"},
                {"epic": "E-005 Vận hành Báo cáo", "feature": "Modal tính phụ phí trông muộn (LatePickupReportModal)", "platform": "Portal Web", "priority": "P1", "story": "Là Kế toán, tôi muốn xem bảng tính chi tiết các buổi đón muộn và tổng tiền phụ thu của từng học sinh.", "jira": "BC-002"},
                {"epic": "E-005 Vận hành Báo cáo", "feature": "Modal chỉnh sửa hồi tố vắng mặt (EditAbsenceModal)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn cập nhật lý do có phép cho học sinh nộp giấy xin phép muộn.", "jira": "BC-003"},
                {"epic": "E-005 Vận hành Báo cáo", "feature": "Xuất bảng chuyên cần tháng Excel", "platform": "Portal Web", "priority": "P2", "story": "Là BGH, tôi muốn xuất file Excel báo cáo chuyên cần để lưu hồ sơ trường.", "jira": "BC-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-BC-01",
                    "name": "Xem & tính toán phụ phí đón muộn",
                    "desc": "Kế toán kiểm tra số tiền phạt trông muộn của học sinh.",
                    "actor": "Kế toán học phí",
                    "trigger": "Kế toán bấm vào link số buổi trông muộn của học sinh.",
                    "pre": "Học sinh có ít nhất 1 buổi đón sau giờ quy định trong tháng.",
                    "happy_path": [
                        "1. Kế toán mở Báo cáo điểm danh lớp 1A1 tháng 10/2026.",
                        "2. Tại dòng của học sinh Lê Minh Khang, cột Trông muộn hiển thị '3 buổi (150.000 đ)'.",
                        "3. Kế toán nhấp vào liên kết này.",
                        "4. Modal LatePickupReportModal hiển thị chi tiết 3 ngày: Ngày 05/10 về lúc 18:05 (muộn 35p, 2 block = 100k), Ngày 12/10 về 17:50 (muộn 20p, 1 block = 50k)...",
                        "5. Kế toán kiểm tra và bấm 'Xác nhận đưa vào hóa đơn'.",
                        "6. Hệ thống đồng bộ khoản thu sang phân hệ Hóa đơn học phí M4/SM1."
                    ],
                    "exceptions": [
                        {"case": "Phụ huynh có giấy xác nhận miễn trừ trông muộn từ BGH", "handling": "Kế toán bấm nút 'Miễn trừ' trên dòng ngày đó và nhập lý do miễn phí."}
                    ],
                    "post": "Khoản phụ phí trông muộn được xác nhận và chuyển sang hóa đơn.",
                    "rules": ["BR-REP-05", "BR-REP-06"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Vận hành -> Báo cáo điểm danh (`/[schoolCode]/reports/attendance`)",
            "screens_table": [
                {"screen": "Báo cáo chuyên cần tháng (`AttendanceCalendarGrid`)", "component": "Tab chuyển đối tượng (`AttendanceReportTabs`)", "format": "2 Tab lớn: Học Sinh / Nhân Viên, Dropdown chọn Lớp, Dropdown chọn Tháng, Nút Xuất Excel, Nút Khóa sổ", "desc": "Điều hướng và lựa chọn phạm vi dữ liệu báo cáo.", "note": "Hỗ trợ cả 2 đối tượng"},
                {"screen": "Báo cáo chuyên cần tháng (`AttendanceCalendarGrid`)", "component": "Ma trận lịch tháng (`AttendanceCalendarGrid`)", "format": "Bảng responsive: Cột Học sinh, 31 Cột ngày trong tháng (hiển thị icon Tích xanh, Đồng hồ cam, P, KP), 4 Cột tổng kết chuyên cần, Cột Phí trông muộn (kèm link clickable)", "desc": "Trung tâm trực quan hóa toàn bộ dữ liệu chuyên cần trong tháng.", "note": "BR-REP-02"},
                {"screen": "Modal chi tiết ngày (`DailyAttendanceModal`)", "component": "Hộp thoại xem thông tin điểm danh ngày", "format": "Thông tin học sinh, Giờ đến thực tế, Giờ về thực tế, Người đón kèm ảnh thẻ, Thân nhiệt đo được, Ghi chú sức khỏe", "desc": "Xem bằng chứng điểm danh khi nhấp vào một ô ngày.", "note": "Chỉ đọc"},
                {"screen": "Modal sửa hồi tố vắng (`EditAbsenceModal`)", "component": "Hộp thoại cập nhật trạng thái nghỉ phép", "format": "Radio chọn Có phép (P) / Không phép (KP), Dropdown Lý do nghỉ, Textarea Ghi chú, Nút 'Cập nhật'", "desc": "Cho phép sửa đổi dữ liệu quá khứ trước khi khóa sổ.", "note": "BR-REP-03"},
                {"screen": "Modal báo cáo trông muộn (`LatePickupReportModal`)", "component": "Hộp thoại tính toán phụ thu ngoài giờ", "format": "Bảng chi tiết các buổi muộn: Ngày, Giờ về thực tế, Số phút vượt chuẩn, Số block tính tiền, Thành tiền (50.000 VNĐ / block), Tổng phụ thu, Nút 'Đồng bộ sang học phí'", "desc": "Tự động hóa hoàn toàn phép tính phạt đón muộn.", "note": "BR-REP-05, BR-REP-06"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-BC-01",
                "title": "Hiển thị ma trận lịch chuyên cần tháng đầy đủ 31 ngày",
                "scenario": "Given Người dùng chọn Lớp 1A1 và Tháng 10/2026\nWhen dữ liệu tải xong\nThen hệ thống hiển thị bảng ma trận với đầy đủ các ngày trong tháng, các ngày Chủ nhật được tô xám và các ký hiệu hiện diện (Tích xanh, P, KP) khớp chính xác với dữ liệu điểm danh thực tế."
            },
            {
                "id": "AC-BC-02",
                "title": "Tính toán chính xác phụ phí trông muộn 50.000 VNĐ / 30 phút",
                "scenario": "Given Học sinh được đón lúc 18:15 (giờ chuẩn 17:30, muộn 45 phút)\nWhen mở modal LatePickupReportModal\nThen hệ thống xác định 45 phút tương đương 2 block tính tiền và tính thành tiền chính xác là 100.000 VNĐ."
            },
            {
                "id": "AC-BC-03",
                "title": "Chỉnh sửa hồi tố chuyển trạng thái vắng từ KP sang P",
                "scenario": "Given Học sinh đang có trạng thái Không phép (KP) vào ngày 10/10\nWhen giáo viên mở EditAbsenceModal, chọn 'Có phép' kèm lý do 'Ốm có giấy viện' và bấm Lưu\nThen ô ngày 10/10 đổi thành chữ 'P' màu cam, cột tổng Nghỉ có phép tăng thêm 1 và tự động kích hoạt hoàn tiền ăn."
            }
        ],
        "nfr": {
            "performance": "Tải ma trận lịch tháng của lớp 40 học sinh trong thời gian < 1.2 giây; xuất file Excel < 2 giây.",
            "security": "Chỉ GVCN phụ trách lớp, Kế toán và BGH mới được xem báo cáo; sau khi bấm Khóa sổ, mọi thao tác sửa chữa đều bị chặn.",
            "ux": "Các ô ngày có tooltip hiển thị nhanh giờ đến/về khi rê chuột qua; màu sắc trực quan dễ phân biệt."
        },
        "appendix": {
            "notifications": [
                {"event": "Khóa sổ chuyên cần tháng", "channel": "In-app Alert", "recipient": "Kế toán & GVCN", "content": "Báo cáo chuyên cần tháng [MM/YYYY] của lớp [Tên lớp] đã được khóa sổ thành công."},
                {"event": "Đồng bộ tiền trông muộn", "channel": "Toast xanh", "recipient": "Kế toán", "content": "Đã chuyển thành công [N] khoản phụ phí trông muộn sang danh sách hóa đơn tháng tới."}
            ],
            "edge_cases": [
                {"condition": "Phụ huynh khiếu nại về giờ đón thực tế do camera ghi nhận sai", "solution": "BGH kiểm tra nhật ký camera cổng, nếu đúng lỗi kỹ thuật có thể mở khóa hồi tố để điều chỉnh lại giờ về thực tế."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 9. M2/SM3 - Thư viện (Media Albums & AI Face Recognition Tagging)
    # -------------------------------------------------------------------------
    {
        "code": "M2/SM3",
        "name": "M2 - SM3 - Thư viện",
        "parent_module": "M2",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Thư viện Kho ảnh Hoạt động & Quản lý Nhận diện Sinh trắc học (Media Album Repository & AI Face Recognition Tagging)</strong> thuộc nhóm <strong>M2: Vận hành</strong> chịu trách nhiệm lưu trữ tập trung, phân loại khoa học và xuất bản kho tư liệu hình ảnh/video của lớp học và toàn trường (`/demo/class/{classId}/media/`). Phân hệ tích hợp các thuật toán trí tuệ nhân tạo (AI Facial Recognition) từ M6/SM4 để tự động phát hiện và gắn thẻ học sinh có mặt trong từng bức ảnh, bảo vệ nghiêm ngặt các 'Album Hệ thống' (không cho phép xóa/đổi tên album mặc định như 'Hoạt động hàng ngày', 'Ảnh điểm danh'), hỗ trợ chế độ xem đa dạng (Grid album, Flat gallery, Nhóm theo ngày tải lên kèm tên người đăng), đồng thời cung cấp công cụ lọc nâng cao theo từng học sinh (tối đa 5 học sinh) để phụ huynh dễ dàng tìm lại toàn bộ khoảnh khắc của con mình.",
            "goals_list": [
                "Quản lý danh sách album ảnh theo lớp học và toàn trường với ảnh bìa, số lượng tệp và phạm vi phát hành.",
                "Bảo vệ tự động các Album Hệ thống (System Albums: 'Hoạt động', 'Điểm danh'): Ngăn chặn xóa hoặc đổi tên tùy tiện (BR01).",
                "Hỗ trợ chế độ xem nhóm theo ngày tải lên (`AlbumDetailView`): Hiển thị ảnh phân chia theo mốc thời gian, tên giáo viên tải lên và số lượng ảnh (BR04).",
                "Chế độ xem phẳng toàn bộ ảnh trong album (`Flat Gallery View` - BR05) phục vụ chọn nhiều ảnh để tải xuống hoặc xóa.",
                "Bộ lọc đa chiều nâng cao (`MediaFilterModal`): Cho phép chọn lọc ảnh có mặt 'Cả lớp', 'Ảnh chưa gắn thẻ' hoặc chọn đích danh tối đa 5 học sinh cụ thể (BR06).",
                "Tích hợp bảng điều khiển nhận diện khuôn mặt AI (`FaceRecognitionModal`): Hiển thị độ phủ nhận diện học sinh của lớp (Target: > 78%) và kích hoạt quét AI tự động (BR08, BR09).",
                "Thao tác chọn nhiều ảnh (Batch Selection) để tải xuống tệp ZIP chất lượng cao hoặc chia sẻ sang bài viết hoạt động."
            ],
            "target_users": [
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Tạo album & tải ảnh lớp", "actions": "Tạo album theo chủ đề (dã ngoại, lễ hội), tải chùm ảnh lên và bấm quét nhận diện AI."},
                {"group": "Phụ huynh học sinh", "role": "Xem & tải ảnh kỷ niệm của con", "actions": "Mở thư viện ảnh trên ứng dụng, lọc xem các bức ảnh có mặt con mình và tải về máy điện thoại."},
                {"group": "Ban Giám Hiệu / Truyền thông", "role": "Khai thác tư liệu trường", "actions": "Chọn lọc các bức ảnh đẹp nhất từ các lớp để xuất bản lên cổng thông tin trường hoặc kỷ yếu."}
            ],
            "glossary": [
                {"term": "Album Hệ thống (System Album)", "definition": "Các album do hệ thống tự sinh phục vụ lưu trữ ảnh tự động từ phân hệ Điểm danh và Hoạt động, có biểu tượng khiên bảo vệ và không thể xóa."},
                {"term": "Gắn thẻ tự động (AI Tagging)", "definition": "Tính năng AI tự nhận dạng khuôn mặt học sinh trong ảnh và gắn ID của em vào metadata của bức ảnh đó."},
                {"term": "Flat Gallery View", "definition": "Chế độ xem phẳng hiển thị toàn bộ ảnh trong album thành một lưới liên tục không phân chia ngày tháng để dễ quét mắt và chọn nhiều."},
                {"term": "Độ phủ nhận diện (Recognition Coverage)", "definition": "Tỷ lệ phần trăm học sinh trong lớp đã có đủ mẫu ảnh chuẩn và có thể được AI nhận diện chính xác."}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên tạo album mới hoặc mở album có sẵn, tải lên hàng loạt ảnh sự kiện; bấm 'Nhận diện AI' để hệ thống tự động gán thẻ học sinh, phụ huynh mở app có thể lọc xem ngay ảnh của con mình.",
            "flow_steps": [
                {"actor": "GVCN", "action": "Tạo album mới", "desc": "Bấm 'Tạo album mới', nhập tên 'Lễ hội Halloween 2026', chọn phạm vi 'Cả lớp' và chọn ảnh bìa."},
                {"actor": "GVCN", "action": "Tải ảnh lên album", "desc": "Kéo thả 30 bức ảnh từ máy tính hoặc điện thoại vào khung tải ảnh."},
                {"actor": "Hệ thống BE", "action": "Lưu trữ & Tạo thumbnail", "desc": "Nén ảnh, lưu vào Cloud Storage (S3/GCS) và tạo các bản thumbnail kích thước nhỏ."},
                {"actor": "GVCN", "action": "Kích hoạt Quét AI (BR08)", "desc": "Mở FaceRecognitionModal, xem độ phủ hiện tại (78%) và bấm 'Bắt đầu quét AI'."},
                {"actor": "AI Engine", "action": "Gắn thẻ tự động (BR09)", "desc": "Phát hiện khuôn mặt, so khớp vector và gắn thẻ học sinh vào từng ảnh."},
                {"actor": "Phụ huynh", "action": "Lọc ảnh theo con (BR06)", "desc": "Phụ huynh bé Mai mở thư viện, hệ thống tự lọc danh mục ảnh có mặt bé Mai."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Quản lý danh sách album): Giáo viên truy cập `/demo/class/{classId}/media/`. Giao diện hiển thị danh sách các album dạng lưới thẻ (Grid) gồm ảnh bìa, tên album, số lượng ảnh, phạm vi (Cả lớp / Nội bộ) và badge 'Album hệ thống' đối với các album được bảo vệ.",
                "Giai đoạn 2 (Tạo album mới - BR02): Giáo viên bấm 'Tạo album mới', modal CreateAlbumModal hiển thị bắt buộc nhập tiêu đề (từ 3 đến 100 ký tự), chọn chủ đề và chọn phạm vi đối tượng.",
                "Giai đoạn 3 (Xem chi tiết album & Nhóm ngày - BR04, BR05): Khi nhấp vào một album, người dùng vào giao diện AlbumDetailView. Mặc định ảnh được nhóm theo ngày tải lên kèm tên giáo viên đăng và mốc thời gian. Người dùng có thể chuyển sang chế độ xem phẳng (Flat Gallery).",
                "Giai đoạn 4 (Ứng dụng AI & Đánh giá độ phủ - BR08, BR09): Giáo viên bấm nút 'Nhận diện AI' trên thanh công cụ. Modal FaceRecognitionModal hiển thị biểu đồ tròn tỷ lệ nhận diện của lớp (ví dụ: 78%). Giáo viên bấm 'Bắt đầu quét AI' để AI quét toàn bộ ảnh chưa gắn thẻ.",
                "Giai đoạn 5 (Bộ lọc nâng cao & Tải xuống - BR06, BR07): Người dùng mở MediaFilterModal để chọn lọc nhanh ảnh có mặt tối đa 5 học sinh cụ thể hoặc lọc ảnh chưa ai được tag. Người dùng có thể tích chọn hàng loạt ảnh và bấm 'Tải xuống tệp ZIP'."
            ],
            "rules": [
                {"id": "BR-MED-01", "title": "Bảo vệ Album Hệ thống (System Album Protection)", "desc": "Các album mặc định của hệ thống ('Hoạt động', 'Điểm danh') được gắn cờ `is_system = true`. Giao diện tự động ẩn nút 'Xóa album' và nút 'Đổi tên album' để tránh làm gián đoạn luồng đồng bộ ảnh tự động từ các phân hệ khác."},
                {"id": "BR-MED-02", "title": "Quy tắc đặt tên và tính duy nhất của Album", "desc": "Tên album tạo mới phải có độ dài từ 3 đến 100 ký tự, không chứa ký tự đặc biệt nguy hiểm và không được trùng tên với các album đang hoạt động trong cùng một lớp."},
                {"id": "BR-MED-04", "title": "Quy tắc nhóm ảnh theo ngày tải lên", "desc": "Ở chế độ xem mặc định, ảnh trong album bắt buộc phải được nhóm theo ngày tải lên (Upload Date Grouping), hiển thị rõ: Ngày tháng, Họ tên giáo viên đăng tải và tổng số ảnh của nhóm đó."},
                {"id": "BR-MED-05", "title": "Hỗ trợ chế độ xem phẳng (Flat View)", "desc": "Cho phép chuyển đổi linh hoạt giữa chế độ xem 'Nhóm theo ngày' và chế độ xem 'Lưới phẳng liên tục' (Flat Gallery View) để thuận tiện cho việc kiểm tra số lượng và chọn ảnh hàng loạt."},
                {"id": "BR-MED-06", "title": "Giới hạn bộ lọc học sinh tối đa 5 em", "desc": "Trong hộp thoại lọc ảnh nâng cao (MediaFilterModal), người dùng được chọn: 'Tất cả', 'Không gắn thẻ' hoặc chọn đích danh tối đa 5 học sinh cùng lúc nhằm tối ưu hiệu năng truy vấn vector."},
                {"id": "BR-MED-08", "title": "Bảng đo độ phủ nhận diện AI lớp học", "desc": "Phân hệ phải cung cấp bảng thống kê tỷ lệ phần trăm học sinh trong lớp đã có mẫu nhận diện hợp lệ (Target tối thiểu đạt 75% độ phủ)."},
                {"id": "BR-MED-09", "title": "Gắn thẻ tự động và quyền ghi đè của giáo viên", "desc": "Các thẻ tên học sinh do AI gắn tự động phải có biểu tượng AI nhỏ bên cạnh. Giáo viên có quyền xóa thẻ gắn nhầm hoặc gắn thêm học sinh thủ công bất kỳ lúc nào."}
            ],
            "data_entities": [
                {"field": "album_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính định danh album ảnh."},
                {"field": "class_id", "type": "UUID", "required": "Bắt buộc", "desc": "Lớp học sở hữu album."},
                {"field": "title", "type": "String (100)", "required": "Bắt buộc", "desc": "Tên tiêu đề album."},
                {"field": "description", "type": "String (255)", "required": "Tùy chọn", "desc": "Mô tả ngắn gọn về sự kiện/album."},
                {"field": "is_system", "type": "Boolean", "required": "Mặc định False", "desc": "Cờ đánh dấu album hệ thống được bảo vệ."},
                {"field": "cover_photo_url", "type": "String (URL)", "required": "Tùy chọn", "desc": "Ảnh đại diện hiển thị ngoài danh sách."},
                {"field": "photo_count", "type": "Integer", "required": "Mặc định 0", "desc": "Tổng số lượng ảnh trong album."},
                {"field": "tagged_student_ids", "type": "Array[UUID]", "required": "Tùy chọn", "desc": "Danh sách các học sinh được gắn thẻ trong album."},
                {"field": "created_by", "type": "UUID", "required": "Bắt buộc", "desc": "Tài khoản giáo viên tạo album."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-003 Vận hành Thư viện", "feature": "Quản lý danh sách album ảnh lớp học (AlbumGrid)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem danh sách các album ảnh của lớp và phân biệt được album hệ thống.", "jira": "MED-001"},
                {"epic": "E-003 Vận hành Thư viện", "feature": "Chế độ xem chi tiết nhóm theo ngày & xem phẳng (AlbumDetailView)", "platform": "Portal Web", "priority": "P1", "story": "Là Giáo viên và Phụ huynh, tôi muốn xem ảnh nhóm theo ngày chụp hoặc xem lưới phẳng.", "jira": "MED-002"},
                {"epic": "E-003 Vận hành Thư viện", "feature": "Tích hợp Nhận diện AI & Bảng độ phủ (FaceRecognitionModal)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn quét AI tự động để gắn thẻ học sinh trong album và xem tỷ lệ phủ.", "jira": "MED-003"},
                {"epic": "E-003 Vận hành Thư viện", "feature": "Bộ lọc nâng cao theo tối đa 5 học sinh (MediaFilterModal)", "platform": "Portal Web", "priority": "P1", "story": "Là Phụ huynh, tôi muốn lọc nhanh các bức ảnh có mặt con mình.", "jira": "MED-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-MED-01",
                    "name": "Tải ảnh và kích hoạt quét AI tự động",
                    "desc": "Giáo viên tải ảnh sự kiện lên album và quét nhận diện học sinh.",
                    "actor": "Giáo viên chủ nhiệm (GVCN)",
                    "trigger": "GVCN mở một album ảnh của lớp.",
                    "pre": "Đã có album và danh sách vector nhận diện học sinh.",
                    "happy_path": [
                        "1. GVCN mở album 'Hội diễn văn nghệ 20/11'.",
                        "2. Bấm 'Tải ảnh lên' và chọn 20 ảnh từ máy tính.",
                        "3. Ảnh tải lên hoàn tất và hiển thị trong nhóm ngày hôm nay.",
                        "4. GVCN bấm nút 'Nhận diện AI' trên thanh công cụ.",
                        "5. Modal FaceRecognitionModal hiển thị độ phủ hiện tại của lớp là 82%.",
                        "6. GVCN bấm 'Bắt đầu quét AI'.",
                        "7. Hệ thống quét các ảnh và tự động gắn thẻ học sinh tìm thấy vào từng bức ảnh tương ứng.",
                        "8. Các badge tên học sinh xuất hiện trên góc dưới của ảnh kèm icon AI."
                    ],
                    "exceptions": [
                        {"case": "Ảnh có góc chụp nghiêng không nhận diện được", "handling": "Hệ thống gắn cờ 'Chưa gắn thẻ' để giáo viên có thể nhấp vào ảnh và gán tên học sinh thủ công."}
                    ],
                    "post": "Toàn bộ ảnh được lưu trữ và gán thẻ nhận diện học sinh.",
                    "rules": ["BR-MED-08", "BR-MED-09"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Vận hành -> Thư viện (`/[schoolCode]/class/[classId]/media`)",
            "screens_table": [
                {"screen": "Bảng danh sách album (`AlbumGrid`)", "component": "Thanh công cụ Thư viện (`MediaToolbar`)", "format": "Dropdown chọn lớp, Ô tìm kiếm album, Toggle chuyển dạng Lưới / Danh sách, Nút 'Nhận diện AI', Nút 'Tạo album mới'", "desc": "Điều hướng và kích hoạt các tính năng chính của kho media.", "note": "BR-MED-08"},
                {"screen": "Bảng danh sách album (`AlbumGrid`)", "component": "Lưới thẻ album (`AlbumGrid`)", "format": "Card album gồm: Ảnh bìa lớn, Tiêu đề album, Số lượng ảnh, Badge phạm vi (Cả lớp), Badge khiên bảo vệ (Album hệ thống)", "desc": "Hiển thị trực quan toàn bộ album ảnh của lớp học.", "note": "BR-MED-01"},
                {"screen": "Xem chi tiết album (`AlbumDetailView`)", "component": "Khung xem ảnh phân nhóm ngày và xem phẳng", "format": "Breadcrumb quay lại, Tiêu đề album, Toggle chế độ xem (Nhóm ngày / Xem phẳng), Nhóm ảnh theo ngày (Ngày tải, Tên người đăng, Lưới ảnh), Checkbox chọn nhiều ảnh trên từng ảnh, Thanh tác vụ hàng loạt (Tải ZIP, Xóa)", "desc": "Trực quan hóa ảnh chất lượng cao và hỗ trợ tương tác hàng loạt.", "note": "BR-MED-04, BR-MED-05, BR-MED-07"},
                {"screen": "Modal tạo album mới (`CreateAlbumModal`)", "component": "Hộp thoại khởi tạo album", "format": "Input Tiêu đề (3-100 ký tự), Textarea Mô tả, Radio chọn Phạm vi (Cả lớp / Riêng tư), Khung chọn ảnh bìa mẫu, Nút 'Tạo album'", "desc": "Khởi tạo album ảnh mới theo sự kiện lớp.", "note": "BR-MED-02"},
                {"screen": "Modal lọc nâng cao (`MediaFilterModal`)", "component": "Hộp thoại lọc ảnh theo học sinh", "format": "Radio chọn 'Tất cả ảnh', Radio chọn 'Ảnh chưa gắn thẻ', Danh sách chọn tối đa 5 học sinh cụ thể (Checkbox kèm Avatar), Nút 'Áp dụng bộ lọc'", "desc": "Lọc nhanh các ảnh cần tìm.", "note": "BR-MED-06"},
                {"screen": "Modal nhận diện AI (`FaceRecognitionModal`)", "component": "Dashboard phân tích độ phủ sinh trắc học", "format": "Biểu đồ tròn độ phủ (Target > 75%), Bảng danh sách học sinh (Ảnh thẻ, Tên, Số ảnh đã tag, Trạng thái), Nút 'Bắt đầu quét AI'", "desc": "Đánh giá chất lượng và kích hoạt trí tuệ nhân tạo nhận diện.", "note": "BR-MED-08, BR-MED-09"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-MED-01",
                "title": "Bảo vệ không cho phép xóa Album Hệ thống",
                "scenario": "Given Người dùng mở xem Album Hệ thống 'Hoạt động hàng ngày'\nWhen quan sát giao diện\nThen nút 'Xóa album' và nút 'Đổi tên' hoàn toàn bị ẩn hoặc vô hiệu hóa, kèm theo badge khiên xanh 'Album hệ thống'."
            },
            {
                "id": "AC-MED-02",
                "title": "Nhóm ảnh theo ngày tải lên và xem phẳng",
                "scenario": "Given Album có ảnh chụp từ 3 ngày khác nhau\nWhen người dùng xem ở chế độ mặc định\nThen các ảnh được phân chia rõ thành 3 khối ngày kèm tên người tải lên; khi bấm chuyển sang 'Xem phẳng' thì toàn bộ ảnh gộp chung thành một lưới liên tục."
            },
            {
                "id": "AC-MED-03",
                "title": "Giới hạn chọn tối đa 5 học sinh trong bộ lọc",
                "scenario": "Given Người dùng đang mở modal MediaFilterModal\nWhen đã tích chọn đủ 5 học sinh và cố gắng tích thêm học sinh thứ 6\nThen hệ thống vô hiệu hóa các checkbox còn lại và hiển thị cảnh báo 'Chỉ được chọn tối đa 5 học sinh cùng lúc'."
            },
            {
                "id": "AC-MED-04",
                "title": "Quét nhận diện AI tự động gắn thẻ học sinh",
                "scenario": "Given Giáo viên tải lên chùm ảnh có mặt học sinh Nguyễn Văn A\nWhen bấm 'Bắt đầu quét AI' trong FaceRecognitionModal\nThen các ảnh có mặt em A được tự động gắn badge tên 'Nguyễn Văn A' ở góc dưới và số ảnh có mặt của em tăng lên tương ứng."
            }
        ],
        "nfr": {
            "performance": "Tải lưới 50 thumbnail ảnh dưới 600ms; hiển thị ảnh độ phân giải đầy đủ trong Lightbox dưới 1 giây.",
            "security": "Chỉ phụ huynh có con học trong lớp hoặc người được gắn thẻ mới có quyền xem ảnh; tuân thủ Nghị định 13/2023/NĐ-CP về quyền riêng tư hình ảnh trẻ em.",
            "ux": "Hỗ trợ kéo thả nhiều tệp ảnh cùng lúc; tự động xoay ảnh đúng chiều dựa trên EXIF orientation."
        },
        "appendix": {
            "notifications": [
                {"event": "Album mới được đăng", "channel": "Push Notification", "recipient": "Phụ huynh lớp", "content": "Lớp [Tên lớp] vừa có album ảnh mới: '[Tên album]' với [N] bức ảnh."},
                {"event": "Ảnh mới có mặt bé", "channel": "Push Notification", "recipient": "Phụ huynh bé được tag", "content": "Bé [Tên con] vừa có thêm [N] ảnh mới trong album '[Tên album]'."}
            ],
            "edge_cases": [
                {"condition": "Mất mạng khi đang tải lên 50 bức ảnh nặng", "solution": "Cơ chế Tải phân mảnh (Chunked Upload) cho phép tiếp tục tải từ bức ảnh bị dở dang mà không phải tải lại từ đầu."}
            ]
        }
    },

    # -------------------------------------------------------------------------
    # 10. M2/SM6 - Báo cáo Mở rộng (Developmental Extended Reports & Evaluation)
    # -------------------------------------------------------------------------
    {
        "code": "M2/SM6",
        "name": "M2 - SM6 - Báo cáo Mở rộng",
        "parent_module": "M2",
        "priority": "HIGH",
        "status": "In Review",
        "owner": "hieu.vo1@finviet.com.vn",
        "created_date": "27 Oct 2026",
        "reviewer": "Ban Giám Hiệu / Tech Lead / Product Owner",
        "overview": {
            "context": "Phân hệ <strong>Báo cáo Phát triển Toàn diện & Phiếu Đánh giá Mầm non Chuẩn hóa (Comprehensive Developmental Extended Reports & Holistic Evaluation Sheets)</strong> thuộc nhóm <strong>M2: Vận hành</strong> chịu trách nhiệm số hóa toàn diện quy trình đánh giá sự phát triển thể chất, nhận thức, ngôn ngữ, thẩm mỹ và tình cảm - kỹ năng xã hội của trẻ mầm non và học sinh tiểu học (`/demo/reports/extended/`). Phân hệ hỗ trợ các biểu mẫu đánh giá chuẩn theo Chương trình Giáo dục Mầm non của Bộ GD&ĐT (Thông tư 51/2020/TT-BGDĐT) và các mẫu phiếu theo tiêu chuẩn quốc tế (Montessori, Reggio Emilia, Cambridge Early Years). Hệ thống cung cấp ma trận checklist đánh giá tiêu chí đa cấp, cho phép giáo viên nhập nhận xét sư phạm chuyên sâu, nhân bản nhanh phiếu đánh giá (`DuplicateReportModal` - BR08), quản lý vòng đời chuyển trạng thái một chiều nghiêm ngặt (Nháp -> Đã gửi BGH -> Hoàn thành xuất bản - BR02, BR09), áp dụng chính sách chỉ được xóa khi ở trạng thái Nháp (BR03), và định dạng phiếu đánh giá chính thức có tiêu đề trường kèm 3 khối chữ ký số (Giáo viên chủ nhiệm, Ban Giám Hiệu, Đại diện Phụ huynh).",
            "goals_list": [
                "Quản lý danh sách phiếu đánh giá phát triển của học sinh theo từng kỳ (Tháng, Học kỳ 1, Cuối năm học) với bộ lọc đa chiều (`ExtendedFilterModal`).",
                "Cung cấp mẫu phiếu đánh giá chuẩn hóa theo Bộ GD&ĐT gồm 5 lĩnh vực phát triển: Thể chất, Nhận thức, Ngôn ngữ, Tình cảm - Kỹ năng xã hội, Thẩm mỹ.",
                "Hỗ trợ ma trận tiêu chí đánh giá đa cấp (Checklist Matrix): Đạt (Đ), Chưa đạt (CĐ), Cần cố gắng, kèm ô nhập chi tiết hành vi quan sát được của trẻ.",
                "Áp dụng vòng đời trạng thái tiến một chiều (Forward-only Lifecycle - BR02, BR09): 'Bản nháp' (Draft) -> 'Đã gửi duyệt' (Submitted) -> 'Hoàn thành' (Completed).",
                "Bảo vệ dữ liệu nghiêm ngặt: Chỉ cho phép Xóa đối với các bản ghi đang ở trạng thái 'Bản nháp' (Draft-only Deletion - BR03).",
                "Tính năng nhân bản thông minh (`DuplicateReportModal` - BR08): Cho phép sao chép cấu trúc biểu mẫu sang học sinh khác hoặc kỳ đánh giá tiếp theo để tiết kiệm thời gian.",
                "Định dạng phiếu đánh giá chính thức (`ExtendedReportDetail`): Giao diện chuẩn văn bản hành chính gồm Quốc hiệu/Tiêu đề trường, Hồ sơ học sinh, Ma trận đánh giá, Nhận xét của cô giáo và Khối 3 chữ ký số."
            ],
            "target_users": [
                {"group": "Giáo viên chủ nhiệm (GVCN)", "role": "Quan sát & nhập phiếu đánh giá", "actions": "Đánh giá các tiêu chí phát triển của trẻ, viết lời nhận xét chi tiết, gửi BGH duyệt và nhân bản phiếu cho các bé cùng nhóm phát triển."},
                {"group": "Ban Giám Hiệu (BGH)", "role": "Kiểm tra chất lượng sư phạm & phê duyệt", "actions": "Đọc nhận xét của giáo viên, duyệt xuất bản phiếu đánh giá gửi tới phụ huynh học sinh."},
                {"group": "Phụ huynh học sinh", "role": "Xem & ký nhận kết quả phát triển", "actions": "Đọc phiếu đánh giá định kỳ của con trên ứng dụng di động, gửi lời phản hồi và ký xác nhận trực tuyến."}
            ],
            "glossary": [
                {"term": "Báo cáo Mở rộng (Extended Report)", "definition": "Phiếu đánh giá sự phát triển định kỳ toàn diện của học sinh theo các lĩnh vực chuẩn mực ngoài phạm vi điểm số đơn thuần."},
                {"term": "Forward-only Lifecycle", "definition": "Quy tắc vòng đời trạng thái chỉ tiến về phía trước (Nháp -> Gửi -> Hoàn thành), không cho phép quay ngược lại trạng thái cũ trừ khi có can thiệp đặc biệt của Admin."},
                {"term": "Checklist Matrix", "definition": "Bảng tiêu chí đánh giá dạng lưới đa cấp cho phép giáo viên đánh dấu nhanh mức độ hoàn thành kỹ năng của trẻ."},
                {"term": "Khối chữ ký 3 bên", "definition": "Khu vực xác nhận ở cuối phiếu báo cáo gồm: Chữ ký của Giáo viên chủ nhiệm, Chữ ký của Ban Giám Hiệu và Chữ ký xác nhận của Phụ huynh học sinh."}
            ]
        },
        "business": {
            "flow_desc": "Giáo viên tạo phiếu đánh giá từ mẫu chuẩn, chấm checklist và viết nhận xét; gửi BGH phê duyệt; sau khi BGH duyệt, phiếu chuyển sang trạng thái Hoàn thành và tự động công bố tới phụ huynh kèm bản in PDF.",
            "flow_steps": [
                {"actor": "GVCN", "action": "Tạo phiếu đánh giá mới", "desc": "Truy cập `/demo/reports/create/create-extended/`, chọn học sinh và mẫu biểu đánh giá Bộ GD&ĐT."},
                {"actor": "GVCN", "action": "Đánh giá checklist & Nhận xét", "desc": "Tích chọn mức độ Đạt / Chưa đạt cho từng tiêu chí phát triển và viết đoạn nhận xét tổng quát."},
                {"actor": "GVCN", "action": "Lưu nháp hoặc Gửi duyệt (BR02)", "desc": "Bấm 'Lưu nháp' nếu chưa xong hoặc bấm 'Gửi Ban Giám Hiệu' để chuyển trạng thái sang `submitted`."},
                {"actor": "Ban Giám Hiệu", "action": "Phê duyệt phiếu đánh giá", "desc": "Mở phiếu đánh giá, kiểm tra tính sư phạm của nhận xét và bấm 'Phê duyệt & Xuất bản' (chuyển sang `completed`)."},
                {"actor": "Phụ huynh", "action": "Xem phiếu & Ký nhận", "desc": "Xem phiếu đánh giá định dạng chuẩn trên App, gửi phản hồi và bấm ký nhận trực tuyến."}
            ],
            "steps_narrative": [
                "Giai đoạn 1 (Lựa chọn & Lọc báo cáo): Giáo viên truy cập `/demo/reports/extended/`. Bảng danh sách ExtendedReportTable hiển thị toàn bộ báo cáo đã lập kèm trạng thái (Nháp, Đã gửi, Hoàn thành), avatar học sinh, tên mẫu biểu và kỳ đánh giá.",
                "Giai đoạn 2 (Soạn thảo theo mẫu chuẩn): Giáo viên mở phiếu đánh giá. Khung checklist hiển thị theo từng lĩnh vực: Phát triển thể chất (Vận động thô, vận động tinh), Nhận thức (Toán sơ đẳng, khám phá khoa học), Ngôn ngữ (Phát âm, diễn đạt), Tình cảm - Xã hội và Thẩm mỹ. Giáo viên tích chọn mức độ và nhập ghi chú minh chứng.",
                "Giai đoạn 3 (Nhân bản biểu mẫu - BR08): Để tiết kiệm thời gian cho các học sinh có cùng mức phát triển, giáo viên bấm 'Nhân bản' (DuplicateReportModal), chọn học sinh nhận mới và kỳ đánh giá mới; hệ thống sao chép nguyên trạng checklist để giáo viên chỉ cần sửa nhận xét cá nhân.",
                "Giai đoạn 4 (Kiểm duyệt & Vòng đời - BR02, BR03, BR09): Giáo viên gửi phiếu lên BGH. Phiếu chuyển trạng thái từ 'Bản nháp' sang 'Đã gửi duyệt'. Khi đã gửi, nút Xóa bị vô hiệu hóa (chỉ xóa được bản nháp). BGH bấm 'Hoàn thành' để xuất bản chính thức.",
                "Giai đoạn 5 (Xuất bản chính thức & Bản in - ExtendedReportDetail): Báo cáo hoàn chỉnh hiển thị trang trọng với quốc hiệu, tiêu đề trường mầm non, mã QR tra cứu, bảng ma trận chi tiết và 3 khối chữ ký số."
            ],
            "rules": [
                {"id": "BR-EXT-02", "title": "Vòng đời trạng thái tiến một chiều (Forward-only)", "desc": "Báo cáo tuân thủ nghiêm ngặt chu trình: 'Bản nháp' (Draft) -> 'Đã gửi duyệt' (Submitted) -> 'Hoàn thành' (Completed). Không cho phép đảo ngược trạng thái từ Hoàn thành về Nháp."},
                {"id": "BR-EXT-03", "title": "Chính sách chỉ được xóa Bản nháp (Draft-only Deletion)", "desc": "Chỉ các báo cáo đang ở trạng thái 'Bản nháp' mới hiển thị nút Xóa. Khi báo cáo đã chuyển sang 'Đã gửi duyệt' hoặc 'Hoàn thành', nút Xóa hoàn toàn bị ẩn để bảo vệ tính toàn vẹn của hồ sơ sư phạm."},
                {"id": "BR-EXT-08", "title": "Quy tắc nhân bản báo cáo thông minh (Cloning)", "desc": "Khi nhân bản báo cáo (Duplicate), hệ thống giữ nguyên cấu trúc mẫu biểu và các tích chọn checklist, nhưng bắt buộc người dùng chọn Học sinh đích mới và Kỳ đánh giá mới để tránh trùng lặp dữ liệu."},
                {"id": "BR-EXT-09", "title": "Bảo vệ báo cáo đã Hoàn thành", "desc": "Báo cáo ở trạng thái 'Hoàn thành' sẽ bị khóa toàn bộ các trường nhập liệu và checklist; chỉ cho phép xem (Read-only) và xuất file PDF có chữ ký số."},
                {"id": "BR-EXT-10", "title": "Bắt buộc khối chữ ký 3 bên", "desc": "Bản in chính thức của báo cáo mở rộng bắt buộc phải có đầy đủ 3 khối xác nhận: (1) Giáo viên chủ nhiệm lập phiếu; (2) Ban Giám Hiệu phê duyệt; (3) Đại diện Cha mẹ học sinh ký nhận."}
            ],
            "data_entities": [
                {"field": "report_id", "type": "UUID", "required": "Bắt buộc", "desc": "Khóa chính định danh phiếu báo cáo đánh giá."},
                {"field": "student_id", "type": "UUID", "required": "Bắt buộc", "desc": "Học sinh được đánh giá (M5/SM1)."},
                {"field": "template_id", "type": "String", "required": "Bắt buộc", "desc": "Mã biểu mẫu áp dụng: ví dụ 'MN_BGD_5TUOI', 'MONTESSORI_TERM'..."},
                {"field": "evaluation_period", "type": "String (50)", "required": "Bắt buộc", "desc": "Kỳ đánh giá: ví dụ 'Học kỳ 1 - 2026', 'Cuối năm học 2026-2027'..."},
                {"field": "status", "type": "Enum", "required": "Bắt buộc", "desc": "Trạng thái vòng đời: 'draft' (Bản nháp), 'submitted' (Đã gửi), 'completed' (Hoàn thành)."},
                {"field": "checklist_data", "type": "JSON", "required": "Bắt buộc", "desc": "Dữ liệu ma trận các tiêu chí đánh giá và mức độ hoàn thành."},
                {"field": "teacher_comment", "type": "Text", "required": "Tùy chọn", "desc": "Lời nhận xét tổng thể của giáo viên chủ nhiệm."},
                {"field": "principal_comment", "type": "Text", "required": "Tùy chọn", "desc": "Ý kiến phê duyệt của Ban Giám Hiệu."},
                {"field": "created_by", "type": "UUID", "required": "Bắt buộc", "desc": "Giáo viên khởi tạo báo cáo."}
            ]
        },
        "features": {
            "breakdown": [
                {"epic": "E-005 Vận hành Báo cáo Mở rộng", "feature": "Danh sách phiếu đánh giá học sinh (ExtendedReportTable)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn xem danh sách các phiếu đánh giá phát triển của học sinh trong lớp.", "jira": "EXT-001"},
                {"epic": "E-005 Vận hành Báo cáo Mở rộng", "feature": "Biểu mẫu đánh giá ma trận checklist đa cấp", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn đánh giá học sinh theo ma trận 5 lĩnh vực phát triển chuẩn Bộ GD&ĐT.", "jira": "EXT-002"},
                {"epic": "E-005 Vận hành Báo cáo Mở rộng", "feature": "Nhân bản phiếu đánh giá thông minh (DuplicateReportModal)", "platform": "Portal Web", "priority": "P1", "story": "Là GVCN, tôi muốn nhân bản phiếu đánh giá sang học sinh khác để tiết kiệm thời gian nhập liệu.", "jira": "EXT-003"},
                {"epic": "E-005 Vận hành Báo cáo Mở rộng", "feature": "Trang chi tiết phiếu báo cáo chuẩn văn bản hành chính (ExtendedReportDetail)", "platform": "Portal Web", "priority": "P1", "story": "Là BGH và Phụ huynh, tôi muốn xem phiếu đánh giá hoàn chỉnh có khối 3 chữ ký số và xuất PDF.", "jira": "EXT-004"}
            ],
            "use_cases": [
                {
                    "id": "UC-EXT-01",
                    "name": "Nhân bản phiếu đánh giá sang học sinh mới",
                    "desc": "Giáo viên sao chép cấu trúc đánh giá sang học sinh khác trong lớp.",
                    "actor": "Giáo viên chủ nhiệm (GVCN)",
                    "trigger": "GVCN bấm nút icon 'Nhân bản' trên dòng của học sinh mẫu.",
                    "pre": "Đã có ít nhất 1 phiếu đánh giá hoàn chỉnh.",
                    "happy_path": [
                        "1. GVCN bấm nút 'Nhân bản' trên dòng phiếu của bé Nguyễn An.",
                        "2. Modal DuplicateReportModal xuất hiện hiển thị tên mẫu biểu cố định.",
                        "3. GVCN chọn học sinh đích mới: 'Trần Bình'.",
                        "4. GVCN chọn kỳ đánh giá: 'Học kỳ 1 - 2026-2027'.",
                        "5. Bấm nút 'Nhân bản báo cáo'.",
                        "6. Hệ thống tạo một bản ghi mới ở trạng thái 'Bản nháp' cho bé Trần Bình mang toàn bộ tiêu chí đã đánh dấu của bé An.",
                        "7. GVCN mở bản ghi mới để chỉnh sửa lời nhận xét riêng cho bé Bình."
                    ],
                    "exceptions": [
                        {"case": "Bé Trần Bình đã có báo cáo trong kỳ này", "handling": "Hệ thống cảnh báo 'Học sinh này đã có phiếu đánh giá trong kỳ đã chọn, vui lòng kiểm tra lại'."}
                    ],
                    "post": "Bản sao báo cáo mới được lưu vào hệ thống ở trạng thái Bản nháp.",
                    "rules": ["BR-EXT-08"]
                }
            ]
        },
        "ui": {
            "entry_point": "Menu chính -> Vận hành -> Báo cáo mở rộng (`/[schoolCode]/reports/extended`)",
            "screens_table": [
                {"screen": "Bảng danh sách báo cáo (`ExtendedReportTable`)", "component": "Thanh công cụ và bộ lọc (`ExtendedFilterModal`)", "format": "Dropdown chọn lớp, Ô tìm kiếm học sinh, Filter theo trạng thái (Nháp / Đã gửi / Hoàn thành), Filter theo mẫu biểu, Nút 'Tạo báo cáo mới'", "desc": "Quản trị danh sách toàn bộ phiếu đánh giá của lớp.", "note": "BR-EXT-02"},
                {"screen": "Bảng danh sách báo cáo (`ExtendedReportTable`)", "component": "Bảng dữ liệu báo cáo (`ExtendedReportTable`)", "format": "Table gồm: STT, Học sinh (Avatar, Họ tên), Biểu mẫu áp dụng, Kỳ đánh giá, Trạng thái (Pill badge màu), Ngày tạo, Thao tác (Xem chi tiết, Nhân bản, Xóa chỉ khi là Nháp)", "desc": "Bảng hiển thị chính với quy tắc bảo vệ nút xóa.", "note": "BR-EXT-03"},
                {"screen": "Modal nhân bản báo cáo (`DuplicateReportModal`)", "component": "Hộp thoại sao chép cấu trúc báo cáo", "format": "Tên biểu mẫu (Readonly), Dropdown chọn Học sinh đích mới, Dropdown chọn Kỳ đánh giá, Nút 'Xác nhận nhân bản'", "desc": "Tiết kiệm 80% thời gian soạn phiếu cho giáo viên.", "note": "BR-EXT-08"},
                {"screen": "Trang chi tiết phiếu báo cáo (`ExtendedReportDetail`)", "component": "Văn bản đánh giá phát triển chính thức", "format": "Header trang trọng: Tiêu đề Sở/Phòng GD&ĐT, Tên trường mầm non, Quốc hiệu; Khối thông tin học sinh (Ảnh thẻ, Lớp, Ngày sinh); Ma trận checklist 5 lĩnh vực phát triển; Textarea nhận xét giáo viên; Khối 3 chữ ký số: GVCN, Hiệu trưởng, Phụ huynh", "desc": "Giao diện chuẩn hóa phục vụ xuất bản và in ấn PDF.", "note": "BR-EXT-09, BR-EXT-10"}
            ]
        },
        "acceptance_criteria": [
            {
                "id": "AC-EXT-01",
                "title": "Chỉ hiển thị nút Xóa đối với báo cáo Bản nháp",
                "scenario": "Given Báo cáo của học sinh A đang ở trạng thái 'Hoàn thành' và báo cáo của học sinh B đang ở trạng thái 'Bản nháp'\nWhen giáo viên quan sát cột Thao tác trên bảng danh sách\nThen dòng của học sinh B hiển thị icon thùng rác màu đỏ (Xóa được), trong khi dòng của học sinh A hoàn toàn không có icon xóa."
            },
            {
                "id": "AC-EXT-02",
                "title": "Vòng đời trạng thái tiến một chiều",
                "scenario": "Given Báo cáo đang ở trạng thái 'Bản nháp'\nWhen GVCN bấm 'Gửi Ban Giám Hiệu'\nThen trạng thái chuyển thành 'Đã gửi duyệt' (màu xanh dương) và không có bất kỳ nút nào cho phép chuyển ngược lại thành 'Bản nháp'."
            },
            {
                "id": "AC-EXT-03",
                "title": "Nhân bản báo cáo sang học sinh mới thành công",
                "scenario": "Given Phiếu đánh giá của bé An có 25 tiêu chí Đạt\nWhen GVCN thực hiện nhân bản sang bé Bình trong modal DuplicateReportModal\nThen hệ thống tạo mới một phiếu đánh giá cho bé Bình ở trạng thái 'Bản nháp' với đầy đủ 25 tiêu chí Đạt y hệt bản gốc."
            },
            {
                "id": "AC-EXT-04",
                "title": "Hiển thị đầy đủ 3 khối chữ ký trên phiếu hoàn chỉnh",
                "scenario": "Given Phiếu đánh giá đã chuyển sang trạng thái 'Hoàn thành'\nWhen người dùng xem trang chi tiết ExtendedReportDetail hoặc bấm In PDF\nThen văn bản có đầy đủ 3 khối chữ ký gồm: Giáo viên lập biểu, Ban Giám Hiệu phê duyệt và Đại diện Cha mẹ học sinh."
            }
        ],
        "nfr": {
            "performance": "Tải bảng danh sách 100 báo cáo dưới 800ms; kết xuất file PDF chất lượng in ấn dưới 2.5 giây.",
            "security": "Chỉ BGH và GVCN phụ trách lớp mới được xem và sửa phiếu; dữ liệu đánh giá được bảo mật theo quy chế bảo vệ dữ liệu học sinh.",
            "ux": "Giao diện nhập checklist dạng ma trận thân thiện, hỗ trợ phím Tab và phím mũi tên để chuyển nhanh giữa các tiêu chí."
        },
        "appendix": {
            "notifications": [
                {"event": "Phiếu đánh giá được duyệt", "channel": "Push Notification", "recipient": "Phụ huynh", "content": "Nhà trường vừa gửi Phiếu đánh giá phát triển định kỳ của bé [Tên con]. Quý phụ huynh vui lòng xem và ký nhận."},
                {"event": "Báo cáo mới cần duyệt", "channel": "In-app Alert", "recipient": "Ban Giám Hiệu", "content": "Lớp [Tên lớp] vừa nộp [N] phiếu đánh giá phát triển học sinh chờ phê duyệt."}
            ],
            "edge_cases": [
                {"condition": "Học sinh chuyển lớp giữa kỳ đánh giá", "solution": "Phiếu đánh giá đã hoàn thành của kỳ trước vẫn lưu giữ trong hồ sơ lưu trữ; kỳ mới sẽ do GVCN lớp mới đảm nhiệm khởi tạo."}
            ]
        }
    }
]

if __name__ == "__main__":
    print(f"Milestone 2 Part 2 defined successfully with {len(PART2_PRDS)} modules!")
    for p in PART2_PRDS:
        print(f"  - [{p['code']}] {p['name']}")
