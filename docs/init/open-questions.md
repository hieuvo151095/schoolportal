# 📋 Bảng Câu Hỏi Mở & Quyết Định Dứt Điểm (Open Questions & Resolutions)

> **Dự án:** School Operating Portal (Finviet / SOHA)  
> **Chế độ Wiki:** `new` (Đặc tả thuần kỹ thuật & nghiệp vụ ban đầu)  
> **Tài liệu tham chiếu:** `docs/prd/`, `docs/tech-specs/system-architecture-blueprint.md`, `docs/guides/decisions.md`  
> **Nguyên tắc:** Mọi điểm chưa rõ PHẢI được phân tích thấu đáo, đưa ra các phương án (Options) và chốt quyết định dứt điểm (Resolved). Tuyệt đối **không để lại tag `[CẦN LÀM RÕ]`** trong tài liệu đặc tả.

---

## 1. TỔNG HỢP TRẠNG THÁI GIẢI QUYẾT

| Mã câu hỏi | Chủ đề | Mức độ ưu tiên | Trạng thái | Quyết định chốt |
|---|---|:---:|:---:|---|
| **OQ-01** | Kiến trúc Multi-Tenancy & Đường dẫn URL | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Tiền tố `/{schoolCode}/` trên toàn bộ URL, kiểm soát bởi PostgreSQL RLS |
| **OQ-02** | Cơ chế hoàn tiền ăn khi nghỉ học (Meal Refund) | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Tự động tính từ điểm danh tháng M, khấu trừ trực tiếp vào hóa đơn M+1 |
| **OQ-03** | Xử lý trùng lặp Chính sách Miễn giảm học phí | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Cảnh báo khi tạo + Checkbox xác nhận thay thế; Áp dụng mức giảm cao nhất |
| **OQ-04** | Nhận diện khuôn mặt AI cho Thư viện ảnh | Trung bình | ✅ ĐÃ GIẢI QUYẾT | Xử lý bất đồng bộ qua hàng đợi BullMQ/Cloud Run; không chặn UI |
| **OQ-05** | Phân loại lớp học & Chốt chặn an toàn khi xóa lớp | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Phân tách Lớp chính khóa / Ngoại khóa; Chặn xóa nếu có học sinh/học phí |
| **OQ-06** | Cơ chế kiểm duyệt đăng bài hoạt động lớp học | Trung bình | ✅ ĐÃ GIẢI QUYẾT | Phân quyền 2 cấp: Giáo viên chính đăng ngay, Giáo viên hỗ trợ chờ duyệt |
| **OQ-07** | Định dạng số tiền và chuyển đổi đơn vị giảm trừ | Tiêu chuẩn | ✅ ĐÃ GIẢI QUYẾT | Dấu chấm ngăn cách hàng nghìn; Toggle chuyển đổi linh hoạt giữa `%` và `đ` |
| **OQ-08** | Chiến lược lưu trữ dữ liệu & Kiểm soát đồng thời | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | PostgreSQL 16 + Pessimistic Row Lock (`FOR UPDATE`) cho tài chính |
| **OQ-09** | Xử lý Tiền Hoàn Vượt Học Phí (Credit Balance), Chuyển Lớp Giữa Tháng & Race Condition VietQR | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Sinh Credit Balance lũy kế hoặc hoàn tiền; Hoàn ăn theo snapshot đơn giá lớp cũ; VietQR hóa đơn hủy vào quỹ treo đối soát |
| **OQ-10** | Trả Trẻ Cho Người Lạ Ngoài Giờ & Quy Tắc Hoàn Tiền Đón Về Nửa Ngày Do Y Tế | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Chặn giao trẻ người lạ nếu không xác thực phụ huynh; Biên bản giữ trẻ 3 bên & báo Công an; Đón về nửa ngày do y tế hoàn 50% tiền ăn |
| **OQ-11** | Bảo Toàn Điểm Số Khi Chuyển Trường Giữa Kỳ & Cơ Chế Mở Khóa Sổ Điểm Kèm Audit Trail | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Kế thừa điểm TX, GK theo môn tương đương tính TBHK MoET; Sổ điểm đã khóa chỉ mở cục bộ 60 phút có duyệt BGH và Audit Trail bất biến |
| **OQ-12** | Chốt Chặn Xóa Lớp Còn Nợ Học Phí & Khôi Phục Học Sinh Từ Archive Bắt Buộc Chọn Lớp Đích | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Chặn tuyệt đối xóa vật lý khi còn nợ, lưu trữ lớp và mang nợ sang niên khóa mới; Phục hồi khi lớp cũ giải thể bắt buộc chọn lớp đích |
| **OQ-13** | Cô Lập Phiên Đa Trường Đồng Thời (Tab Isolation), Phân Kênh WebSocket & Dọn Redux State | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Phân vùng LocalStorage theo schoolCode; WebSocket phân kênh `{schoolCode}:user:{userId}:{channel}`; Chuyển trường kích hoạt RESET_TENANT_STATE |
| **OQ-14** | Lớp Ngoại Khóa: Đóng Trùng Biểu Phí, Xếp Trùng Lịch & Phân Rã Hóa Đơn | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Conflict scheduler 4 chiều; Biểu phí buổi/tháng; Phân rã Sub-invoice và Partial payment khi từ chối ngoại khóa |
| **OQ-15** | Đồng Bộ CSDL Ngành (Sở GD&ĐT) & Đóng Băng Dữ Liệu Kỳ Thi | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Cờ `is_sync_locked` khi Sở chốt thi; Đối soát Data Drift 2 chiều; Retry Queue và DLQ cô lập lỗi ngắt quãng từng học sinh |
| **OQ-16** | Quyền Riêng Tư Khuôn Mặt AI (Opt-Out) & Tranh Chấp Quyền Giám Hộ Trẻ | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Cờ `opt_out_face_ai` bỏ qua nhận diện & làm mờ mặt; Danh sách `restricted_guardians` và cảnh báo đỏ cấm giao trẻ |
| **OQ-17** | Rút Hồ Sơ / Thôi Học Giữa Kỳ & Thanh Lý Quyết Toán Học Phí | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Quyết toán Pro-rata rạch ròi; Phiếu chi hoàn tiền rút hồ sơ; Hủy hóa đơn tương lai; Thu hồi mobile app sang chỉ đọc |
| **OQ-18** | Giao Dịch VietQR Bất Thường — Chuyển Tiền Thừa, Thiếu & Tra Soát Ngân Hàng | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Chuyển thừa kết chuyển Credit Balance/hoàn tiền; Chuyển thiếu `PARTIAL_PAID` & sinh lại VietQR nợ; Đóng băng `FROZEN_UNDER_REVIEW` chặn VAT khi tra soát |
| **OQ-19** | Sổ Dặn Thuốc Y Tế & Quy Trình Xác Nhận Cho Uống Thuốc Trưa | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Phụ huynh gửi đơn dặn thuốc qua app; Giáo viên xác nhận "Đã cho uống thuốc lúc HH:mm" và gửi thông báo an tâm tức thời |
| **OQ-20** | Điểm Danh Đến Muộn, Đón Sớm Giữa Buổi & Quy Tắc Không Hoàn Tiền Ăn Khi Đón Sớm | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Ghi nhận Đến muộn (tùy chọn báo suất ăn với bếp), Đón sớm; Phụ huynh chủ động đón sớm KHÔNG hoàn tiền ăn; Suất ăn chỉ hoàn khi ngày lễ, trường cho nghỉ, hoặc có đơn xin nghỉ cả ngày hợp lệ |
| **OQ-21** | Cơ Chế Tự Động Khóa Sổ Điểm Danh Cuối Tháng Trước Kỳ Tính Phí | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Không cần nút nộp thủ công; Tự động khóa đóng băng điểm danh tháng (Freeze / Read-Only) vào ngày cuối tháng trước khi tính phí |
| **OQ-22** | Học Sinh Nhập Học Giữa Tháng (Prorated) & Quy Định Hóa Đơn Riêng Lẻ Từng Học Sinh | Nghiêm ngặt | ✅ ĐÃ GIẢI QUYẾT | Nhập học giữa tháng tính học phí và tiền ăn lẻ ngày (Prorated); Mỗi học sinh có một hóa đơn riêng lẻ, mã VietQR riêng biệt, gạch nợ độc lập (không gộp gia đình) |
| **OQ-23** | Chính Sách Miễn Giảm Học Phí Anh Chị Em Ruột (Sibling Discount) Tự Động Theo SĐT Phụ Huynh | Tiêu chuẩn | ✅ ĐÃ GIẢI QUYẾT | Tự động liên kết anh/chị/em theo số điện thoại phụ huynh; Tự động áp dụng mức giảm cho con thứ 2/thứ 3 khi anh/chị đang học `ACTIVE`; Tự động ngưng khi con lớn ra trường |

---

## 2. CHI TIẾT CÁC CÂU HỎI & QUYẾT ĐỊNH DỨT ĐIỂM

### OQ-01: Định Danh Multi-Tenancy & Cấu Trúc Định Tuyến URL
- **Vấn đề:** Hệ thống phục vụ nhiều trường học đồng thời (Multi-tenancy). Cần xác định phương án cô lập dữ liệu và cấu trúc URL truy cập giữa các trường.
- **Phương án A:** Dùng Subdomain riêng cho mỗi trường (ví dụ: `vinschool.eco-portal.vn`).
- **Phương án B:** Dùng đường dẫn tiền tố `/{schoolCode}/` (ví dụ: `/TH-ECO01/dashboard`).
- **Phương án C:** Lưu trường hiện tại trong Cookie/JWT Header, URL giữ phẳng không có mã trường.
- **Phân tích:** 
  - Phương án A đòi hỏi cấu hình DNS wildcard và SSL certificate phức tạp, khó test local và tốn chi phí hạ tầng.
  - Phương án C dễ gây nhầm lẫn khi người dùng mở nhiều tab hoặc chuyển trường, vi phạm tính tường minh của RESTful URL.
  - Phương án B đảm bảo URL tường minh, tương thích hoàn hảo với Next.js dynamic routing `[schoolCode]`, dễ dàng cho proxy (Nginx/OpenResty) định tuyến và hỗ trợ giáo viên dạy liên trường chuyển đổi mượt mà.
- **Quyết định chốt:** **Chọn Phương án B**. Mọi route nghiệp vụ bắt buộc có tiền tố `/{schoolCode}/`. Tầng CSDL áp dụng **PostgreSQL Row Level Security (RLS)** dựa trên cột `school_code` (hoặc `tenant_id`) để cô lập tuyệt đối dữ liệu giữa các trường.

---

### OQ-02: Cơ Chế Hoàn Tiền Ăn Bán Trú Khi Nghỉ Học
- **Vấn đề:** Khi học sinh nghỉ học (có phép/không phép), việc hoàn trả tiền ăn bán trú hoặc tiền dịch vụ được tính toán và bù trừ vào kỳ nào?
- **Phương án A:** Hoàn trả tiền mặt hoặc chuyển khoản trực tiếp cho phụ huynh vào cuối tháng.
- **Phương án B:** Tự động tổng hợp số ngày nghỉ hợp lệ từ dữ liệu điểm danh tháng M, tính toán số tiền hoàn theo cấu hình tỷ lệ hoàn tiền ăn, và tự động tạo dòng giảm trừ (Huy hiệu xanh: "Hoàn tiền: -X đ") trên hóa đơn học phí của tháng tiếp theo (M+1).
- **Phương án C:** Kế toán phải tự mở bảng excel đối soát điểm danh rồi gõ số tiền hoàn thủ công vào từng hóa đơn.
- **Phân tích:**
  - Phương án A phát sinh chi phí giao dịch ngân hàng và quá tải công việc kế toán.
  - Phương án C là quy trình thủ công dễ sai sót đang muốn loại bỏ.
  - Phương án B liên thông trực tiếp phân hệ Vận hành (Điểm danh) với Tài chính (Hóa đơn), minh bạch đối chiếu ngày nghỉ và giảm 90% thời gian tạo hóa đơn.
- **Quyết định chốt:** **Chọn Phương án B**. Hóa đơn tháng M+1 tự động truy vấn số ngày vắng có phép từ `AttendanceDaily` của tháng M, nhân với đơn giá tiền ăn/ngày và tỷ lệ cấu hình tại `FeeGlobalSetting`, sinh ra dòng giảm trừ tự động.

---

### OQ-03: Xử Lý Xung Đột & Trùng Lặp Chính Sách Miễn Giảm Học Phí
- **Vấn đề:** Một học sinh có thể vừa thuộc lớp được giảm 10% học phí chung, vừa có chính sách con giáo viên giảm 50%. Khi xuất hóa đơn hoặc khi thêm chính sách mới, hệ thống xử lý xung đột như thế nào?
- **Phương án A:** Cho phép cộng dồn tất cả các chính sách miễn giảm (10% + 50% = 60%).
- **Phương án B:** Luôn áp dụng chính sách mới nhất tạo sau, ghi đè hoàn toàn chính sách cũ.
- **Phương án C:** 
  1. Khi tạo chính sách mới: Nếu phát hiện học sinh đã có chính sách trùng lặp cho cùng một khoản thu, hiển thị cảnh báo chi tiết (Tên học sinh, lớp, khoản phí, mức cũ, mức mới) và yêu cầu người dùng tích vào checkbox xác nhận thay thế: `[ ] Tôi xác nhận thay thế chính sách cũ bằng chính sách mới này cho các học sinh bị trùng lặp`.
  2. Khi xuất hóa đơn: Tự động so sánh các chính sách đang có hiệu lực và áp dụng mức giảm có lợi nhất (cao nhất) cho học sinh.
- **Phân tích:** Phương án A có nguy cơ làm thất thoát tài chính nhà trường nếu giảm quá 100%. Phương án B tự động ghi đè ngầm mà không hỏi người dùng là rất nguy hiểm. Phương án C minh bạch, an toàn và tối đa quyền lợi cho người học.
- **Quyết định chốt:** **Chọn Phương án C**. Thực hiện đúng đặc tả `FR-FIN-019` trong PRD Tài chính: Cảnh báo tại modal tạo + Checkbox xác nhận thay thế + Tự động chọn mức giảm cao nhất khi lập hóa đơn.

---

### OQ-04: Xử Lý Nhận Diện Khuôn Mặt AI Cho Thư Viện Ảnh Lớp
- **Vấn đề:** Mỗi lần giáo viên tải lên 50 - 100 ảnh hoạt động chất lượng cao, việc nhận diện khuôn mặt từng học sinh bằng mô hình AI nếu chạy đồng bộ (synchronous) sẽ gây nghẽn server và timeout request.
- **Phương án A:** Nhận diện trực tiếp trên trình duyệt máy khách (Client-side WebAssembly/TensorFlow.js).
- **Phương án B:** Nhận diện đồng bộ trên Backend API trước khi trả lời HTTP 200.
- **Phương án C:** Tải ảnh lên Object Storage (S3/GCS), trả phản hồi thành công ngay lập tức kèm trạng thái ảnh `processing`, đồng thời đẩy một tác vụ xử lý vào hàng đợi bất đồng bộ (BullMQ / Cloud Run Worker) để AI nhận diện khuôn mặt và tự động gắn tag học sinh trong nền.
- **Phân tích:**
  - Phương án A làm đơ máy giáo viên (đặc biệt khi dùng máy tính bảng hoặc laptop cấu hình thấp).
  - Phương án B gây timeout HTTP request (vượt ngưỡng 30-60s của Gateway).
  - Phương án C theo đúng kiến trúc phân tầng tại `system-architecture-blueprint.md`, bảo đảm trải nghiệm upload mượt mà dưới 1 giây.
- **Quyết định chốt:** **Chọn Phương án C**. Kiến trúc bất đồng bộ: Client upload $\rightarrow$ GCS $\rightarrow$ BullMQ Job $\rightarrow$ Python/AI Worker $\rightarrow$ Ghi tag vào PostgreSQL $\rightarrow$ Báo trạng thái hoàn tất qua WebSocket / SSE.

---

### OQ-05: Chốt Chặn An Toàn Khi Xóa Lớp Học & Phân Loại Lớp
- **Vấn đề:** Xóa nhầm lớp học đang có dữ liệu học sinh hoặc các hóa đơn học phí đã thu tiền sẽ gây ra lỗi toàn vẹn dữ liệu nghiêm trọng.
- **Phương án A:** Cho phép xóa mềm (Soft Delete) lớp bất cứ lúc nào, ẩn lớp đó khỏi giao diện.
- **Phương án B:** Không bao giờ cho phép xóa lớp học, chỉ cho phép đóng hoặc chuyển trạng thái Lưu trữ (Archived).
- **Phương án C:** Cho phép xóa lớp nhưng áp dụng chốt chặn an toàn 3 cấp:
  1. Nếu lớp đang có học sinh: Chặn tuyệt đối nút xóa, hiển thị thông báo yêu cầu chuyển hết học sinh sang lớp khác trước.
  2. Nếu lớp đã phát sinh giao dịch tài chính / hóa đơn: Chặn xóa, chỉ cho phép chuyển sang trạng thái "Ngừng hoạt động / Lưu trữ".
  3. Chỉ cho phép xóa vĩnh viễn khi lớp rỗng (0 học sinh và 0 giao dịch phát sinh).
- **Phân tích:** Phương án C đảm bảo tính toàn vẹn dữ liệu tài chính và học vụ theo quy định kế toán, đồng thời vẫn cho phép dọn dẹp các lớp tạo nhầm trong giai đoạn đầu năm học.
- **Quyết định chốt:** **Chọn Phương án C**. Thực hiện đúng tiêu chuẩn `US-SCH-04`. Đồng thời phân tách rõ 2 loại lớp: Lớp chính khóa (đầy đủ điểm danh, học tập, học phí) và Lớp ngoại khóa (chỉ bật tính năng điểm danh và bài tập riêng).

---

### OQ-06: Cơ Chế Kiểm Duyệt Bài Đăng Hoạt Động Lớp Học
- **Vấn đề:** Làm thế nào để đảm bảo nội dung hình ảnh và bài đăng của giáo viên gửi tới phụ huynh tuân thủ chuẩn mực sư phạm và không bị rò rỉ thông tin nhạy cảm?
- **Phương án A:** Mọi bài đăng của mọi giáo viên đều phải qua Hiệu trưởng/Ban giám hiệu duyệt trước khi hiển thị cho phụ huynh.
- **Phương án B:** Không kiểm duyệt, giáo viên nào cũng được quyền đăng bài trực tiếp ngay lập tức.
- **Phương án C:** Cơ chế phân quyền kiểm duyệt 2 cấp:
  1. Giáo viên chính nhiệm (Chủ nhiệm / Trưởng bộ môn): Được quyền đăng bài trực tiếp không cần duyệt.
  2. Giáo viên hỗ trợ / Thực tập sinh / Giáo viên bộ môn mới: Bài đăng chuyển vào trạng thái "Chờ duyệt" (`pending_review`). Giáo viên chính hoặc Quản trị viên duyệt thì bài mới được phát hành tới phụ huynh.
- **Phân tích:** Phương án A gây quá tải cho Ban giám hiệu và làm chậm trễ thông tin trong ngày. Phương án B tiềm ẩn rủi ro phát ngôn không chuẩn mực. Phương án C phân quyền linh hoạt theo cấp bậc và trách nhiệm sư phạm.
- **Quyết định chốt:** **Chọn Phương án C**. Quy định rõ trong hồ sơ giáo viên tại `TeacherStaff` trường `approval_role` (`direct_publish` hoặc `require_approval`).

---

### OQ-07: Định Dạng Tiền Tệ & Đơn Vị Giảm Trừ Trong Hóa Đơn
- **Vấn đề:** Khi kế toán thao tác trên dòng khoản thu của hóa đơn, việc nhập mức giảm theo phần trăm hay tiền mặt và hiển thị số tiền cần tuân thủ quy chuẩn nào?
- **Phương án A:** Chỉ hỗ trợ giảm trừ theo phần trăm (%).
- **Phương án B:** Chỉ hỗ trợ giảm trừ theo số tiền mặt cố định (VNĐ).
- **Phương án C:** Hỗ trợ linh hoạt cả 2 hình thức: Cung cấp nút chuyển đổi (Toggle) giữa `[%]` và `[đ]` ngay trên từng dòng khoản thu; Định dạng đơn giá và thành tiền bắt buộc có dấu chấm phân cách hàng nghìn (ví dụ: `2.500.000 đ`); Hiển thị số tiền giảm quy đổi bằng VNĐ màu xanh lá bên dưới ô nhập liệu.
- **Phân tích:** Thực tế các trường có cả chính sách giảm 100% học phí (theo %) lẫn giảm cố định 200.000 đ tiền xe đưa đón (theo tiền mặt). Do đó chỉ hỗ trợ 1 loại sẽ gây bất tiện lớn cho kế toán.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai theo tiêu chuẩn `FR-FIN-022`: Toggle chuyển đổi `[%]` / `[đ]`, hiển thị số tiền quy đổi màu xanh lá, định dạng chấm ngăn cách hàng nghìn.

---

### OQ-08: Chiến Lược Lưu Trữ Dữ Liệu & Kiểm Soát Đồng Thời (Concurrency Control)
- **Vấn đề:** Trong giờ cao điểm đón trẻ (7:30 - 8:30 sáng) hoặc thời điểm thu học phí đầu kỳ, nhiều giáo viên và phụ huynh cùng thao tác ghi dữ liệu, làm thế nào để tránh ghi đè dữ liệu (race conditions) và lỗi toàn vẹn?
- **Phương án A:** Dùng NoSQL (MongoDB) để ghi nhanh, không dùng transaction.
- **Phương án B:** Dùng cơ chế Optimistic Lock trên toàn bộ bảng dữ liệu.
- **Phương án C:** Áp dụng mô hình đa cấp theo đúng `system-architecture-blueprint.md`:
  1. Dữ liệu đọc nhiều / ghi ít (tin tức, thời khóa biểu): Sử dụng Redis In-Memory Cache (Cache-Aside + TTL).
  2. Dữ liệu sửa đổi thông thường (hồ sơ học sinh, điểm danh): Sử dụng Optimistic Lock (`version` column).
  3. Dữ liệu tài chính, thanh toán, số dư và hạn ngạch: Bắt buộc sử dụng Pessimistic Row Lock (`SELECT ... FOR UPDATE`) bên trong Database Transaction (`BEGIN ... COMMIT`) và Redis Distributed Lock (Redlock) cho các tác vụ Cron/Job chạy nền.
- **Phân tích:** Dữ liệu tài chính trường học và điểm danh học sinh liên quan trực tiếp đến tiền bạc và an toàn trẻ nhỏ, tuyệt đối không được phép xảy ra race conditions.
- **Quyết định chốt:** **Chọn Phương án C**. Tuân thủ nghiêm ngặt nguyên tắc Zero-Mock, PostgreSQL ACID Transaction, và Pessimistic Lock cho toàn bộ phân hệ Tài chính (M4).

---

### OQ-09: Xử Lý Tiền Hoàn Vượt Học Phí (Credit Balance), Chuyển Lớp Giữa Tháng & Race Condition VietQR
- **Vấn đề:** 
  1. Học sinh nghỉ học có phép cả tháng dẫn đến tiền hoàn ăn lớn hơn tổng học phí tháng M+1 -> hệ thống có cho phép hóa đơn âm không? Xử lý phần tiền thừa thế nào?
  2. Học sinh chuyển lớp giữa tháng (ví dụ từ Nhà trẻ sang Mẫu giáo có đơn giá tiền ăn khác nhau) -> tiền ăn hoàn tháng trước tính theo đơn giá lớp cũ hay lớp mới?
  3. Race condition: Phụ huynh quét mã VietQR động thanh toán đúng tích tắc kế toán đang bấm nút "Hủy hóa đơn" hoặc "Chỉnh sửa hóa đơn".
- **Phương án A:** 
  - Hóa đơn cho phép xuất số âm; Hoàn tiền theo đơn giá lớp hiện tại; Bỏ qua giao dịch webhook nếu hóa đơn đã hủy.
- **Phương án B:** 
  - Cắt giảm tiền hoàn chỉ bằng đúng số tiền học phí (học sinh mất phần tiền thừa); Kế toán tính tay tiền ăn chuyển lớp; Webhook tự động tạo lại hóa đơn mới.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Cơ chế Credit Balance (Số dư tín dụng):** Hóa đơn không bao giờ xuất số âm (`amount_due = max(0, gross - discounts - refund)`). Toàn bộ phần hoàn thừa $(\text{refund} + \text{discounts} - \text{gross} > 0)$ được tự động kết chuyển thành `credit_balance` (Số dư tín dụng) lưu trong hồ sơ học sinh và tự động cấn trừ vào hóa đơn tháng tiếp theo (M+2, M+3...). Nếu học sinh thôi học, chuyển trường hoặc tốt nghiệp, nhà trường xuất Phiếu chi hoàn tiền mặt/chuyển khoản trả lại phụ huynh.
  2. **Snapshot đơn giá theo lịch sử ngày học:** Tiền ăn hoàn tính chính xác theo từng ngày vắng dựa vào đơn giá của lớp mà học sinh đang theo học tại thời điểm ngày vắng đó: $\sum (\text{excused\_days}_{\text{class } i} \times \text{meal\_rate}_{\text{class } i} \times \text{refund\_rate})$.
  3. **Xử lý Race condition VietQR:** Áp dụng Pessimistic Row Lock (`FOR UPDATE`) trên cả webhook ngân hàng và luồng hủy hóa đơn. Khi kế toán bấm hủy/sửa, mã QR payload lập tức bị vô hiệu hóa. Nếu tiền đã vào tài khoản ngân hàng và webhook bắn tới sau khi hóa đơn vừa hủy, hệ thống không nuốt tiền mà tự động gom vào Quỹ treo chờ xử lý (`UNMATCHED_SUSPENSE_POOL`), đồng thời cảnh báo khẩn cấp tại màn hình Đối soát (M4-SM2) cho phép kế toán 1-chạm kết chuyển sang `credit_balance` của học sinh hoặc lập phiếu chi hoàn tiền.
- **Phân tích:** Phương án C giải quyết triệt để tính toàn vẹn tài chính, bảo vệ quyền lợi hợp pháp của phụ huynh học sinh và chống thất thoát dòng tiền.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai đồng bộ trong `meal-refund-engine`, `tuition-invoice` và `vietqr-dynamic-reconciliation`.

---

### OQ-10: Quy Trình Bảo Vệ Pháp Lý Trả Trẻ Ngoài Giờ Cho Người Lạ Không Liên Lạc Được & Quy Tắc Hoàn Tiền Bán Trú Đón Về Nửa Ngày Do Y Tế
- **Vấn đề:** 
  1. Sau 17:00/17:30, người đến đón học sinh không có tên/ảnh trong danh bạ ủy quyền và giáo viên không thể liên lạc được với phụ huynh -> xử lý giữ trẻ và bảo vệ pháp lý cho nhà trường ra sao?
  2. Học sinh đến lớp buổi sáng nhưng sốt cao 39.5°C lúc 10:00 sáng được phụ huynh đón về nửa ngày -> quy tắc tính hoàn tiền suất ăn có phân chia nửa ngày hay tính theo mốc giờ báo vắng?
- **Phương án A:** Cho người lạ đón nếu có xuất trình CMND/CCCD và chụp ảnh; Không hoàn tiền ăn nếu đã đến trường sau 08:30 sáng.
- **Phương án B:** Giữ trẻ tại lớp đến khi phụ huynh tới đón; Hoàn 100% tiền ăn nếu đón về trước giờ ăn trưa 11:30.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Quy trình giữ trẻ tạm thời 4 cấp & bảo vệ pháp lý khẩn cấp:**
     - *Tuyệt đối cấm giao trẻ:* Nghiêm cấm bàn giao trẻ cho người không có trong danh bạ ủy quyền nếu chưa có xác thực trực tiếp từ phụ huynh (qua video call/OTP xác nhận từ số điện thoại chính thức).
     - *Cấp 1 (17:30 - 18:00):* Đưa trẻ về Phòng lưu giữ trẻ / Y tế / Văn phòng BGH, có mặt tối thiểu 2 nhân sự (GVCN + Nhân viên Y tế hoặc Bảo vệ) và bật camera an ninh giám sát.
     - *Cấp 2 (18:00 - 18:30):* Liên lạc khẩn cấp đa kênh: Gọi luân phiên 3 số điện thoại bảo trợ (Bố, Mẹ, Người giám hộ khẩn cấp), gửi SMS Brandname SOS và thông báo đẩy ưu tiên cao qua app.
     - *Cấp 3 (18:30 - 19:30):* Lập "Biên bản giữ trẻ tạm thời ngoài giờ do bất khả kháng" trên hệ thống (e-Form) ký số 3 bên: Giáo viên trực, Đại diện Ban Giám Hiệu và Nhân viên Bảo vệ trực ca.
     - *Cấp 4 (Sau 19:30):* Kích hoạt quy trình an ninh pháp lý: BGH liên hệ và báo cáo trực tiếp Lãnh đạo Công an Phường sở tại và Tổng đài Bảo vệ Trẻ em Quốc gia (111) để phối hợp xử lý theo quy định pháp luật. Lưu vết toàn bộ hình ảnh camera và nhật ký gọi vào `UnclaimedChildIncident`.
  2. **Quy tắc hoàn tiền bán trú nửa ngày do y tế:**
     - Suất ăn bán trú chốt định mức sơ chế thực phẩm tươi sống lúc 08:30 sáng.
     - Học sinh phát sinh sốt cao ($\ge 38.5^\circ\text{C}$) hoặc bệnh đột xuất có xác nhận của Y tế trường và được đón về trước 10:30 sáng: Hệ thống ghi nhận trạng thái điểm danh `half_day_leave` và tự động áp dụng hoàn trả **50% định mức suất ăn ngày đó** (khấu trừ phần bữa xế/chiều chưa chế biến và chưa phân phối).
     - Học sinh đón về sau 11:30 sáng (đã ăn trưa xong): Hoàn 0% tiền ăn ngày đó.
- **Phân tích:** Phương án C thiết lập chốt chặn pháp lý vững chắc bảo vệ an toàn tính mạng trẻ em và giáo viên, đồng thời quy định tỷ lệ hoàn tiền công bằng, minh bạch giữa nhà trường và phụ huynh.
- **Quyết định chốt:** **Chọn Phương án C**. Bổ sung vào `fl-diem-danh-don-tra`, `attendance-daily` và `meal-refund-engine`.

---

### OQ-11: Bảo Toàn Kết Quả Điểm Số Khi Chuyển Trường Giữa Học Kỳ & Cơ Chế Mở Khóa Sổ Điểm Kèm Audit Trail Bất Biến
- **Vấn đề:** 
  1. Học sinh chuyển trường giữa học kỳ -> làm sao bảo toàn các đầu điểm thường xuyên và giữa kỳ đã có để trường mới không phải kiểm tra lại?
  2. Sổ điểm đã khóa phát hiện giáo viên nhập nhầm điểm bài thi học kỳ -> cơ chế mở khóa thế nào để chống tiêu cực và bảo đảm tính toàn vẹn?
- **Phương án A:** Xóa toàn bộ điểm cũ khi chuyển trường, học sinh thi lại từ đầu; Mở khóa toàn bộ sổ điểm để giáo viên tự do sửa lại.
- **Phương án B:** Nhập tay điểm trung bình cũ sang trường mới; Admin CSDL vào trực tiếp database sửa điểm giúp giáo viên.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Bảo toàn điểm số khi chuyển trường (Inter-School Grade Continuity):**
     - *Chuyển trường cùng hệ thống ECO:* Hệ thống tự động trích xuất bảng điểm đánh giá thường xuyên ($TX$) và giữa kỳ ($GK$), đóng gói thành Bảng điểm chuyển trường có chữ ký số điện tử của BGH trường cũ. Trường tiếp nhận sử dụng tính năng "Map môn học tương đương", kế thừa 100% các cột điểm đã có vào sổ điểm lớp mới để tính $\text{TBHK}$ theo Thông tư 22/27 của Bộ GD&ĐT mà không bắt học sinh phải kiểm tra lại.
     - *Chuyển trường ngoài hệ sinh thái:* Xuất Bảng điểm xác thực điện tử có mã QR truy xuất nguồn gốc và đặt trạng thái học sinh thành `TRANSFERRED_OUT`.
  2. **Cơ chế mở khóa sổ điểm đặc biệt & Audit Trail bất biến:**
     - Giáo viên tạo "Phiếu đề nghị điều chỉnh điểm số" (`GradeCorrectionRequest`), đính kèm ảnh bài thi gốc, giải trình lý do sai sót (cộng nhầm điểm, phúc khảo).
     - BGH (Hiệu trưởng / Hiệu phó chuyên môn) thẩm định và phê duyệt trên portal.
     - Ngay khi phê duyệt, hệ thống kích hoạt **Mở khóa cục bộ có phạm vi (Scoped Temporary Unlock):** CHỈ mở duy nhất ô điểm cần sửa của đúng học sinh đó trong thời hạn tối đa 60 phút (TTL: 3600s), tất cả các ô điểm khác vẫn bị khóa chặt.
     - Hệ thống ghi bản ghi bất biến vào `GradeAuditTrail` (chứa `timestamp`, `teacher_id`, `approver_id`, `old_score`, `new_score`, `reason`, `evidence_url`, `ip_address`). Bản ghi này chỉ ghi thêm (Append-Only), không ai có quyền sửa/xóa kể cả DB Admin. Tự động tính lại điểm TBHK và thông báo tới phụ huynh.
- **Phân tích:** Phương án C tuân thủ nghiêm ngặt quy chế đánh giá của Bộ GD&ĐT, minh bạch học bạ và triệt tiêu mọi khả năng gian lận sửa điểm.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `curriculum-assessment-standard`, `gradebook-record` và `fl-nhap-so-diem`.

---

### OQ-12: Chốt Chặn Bảo Toàn Công Nợ Khi Xóa Lớp Cũ & Khôi Phục Học Sinh Từ Archive Bắt Buộc Chọn Lớp Đích Đang Hoạt Động
- **Vấn đề:** 
  1. Xóa/lưu trữ lớp học cũ khi kết thúc niên khóa nhưng còn học sinh nợ học phí chưa tất toán -> công nợ có bị mất liên kết hoặc bị xóa theo không?
  2. Khôi phục học sinh từ kho lưu trữ Archive khi lớp học cũ đã bị giải thể/xóa -> học sinh rơi vào trạng thái mồ côi (không lớp, không biểu phí).
- **Phương án A:** Xóa sạch công nợ khi xóa lớp; Cho phép phục hồi học sinh về trạng thái mồ côi không lớp.
- **Phương án B:** Chặn đóng niên khóa chừng nào còn học sinh nợ tiền; Tự động tạo lại lớp cũ để đưa học sinh về.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Chốt chặn bảo toàn công nợ (Debt Preservation Guard):**
     - Tuyệt đối cấm xóa vật lý (Hard Delete) bất kỳ lớp học nào còn học sinh có dư nợ học phí (`outstanding_debt > 0`).
     - Khi kết thúc niên khóa, lớp học được chuyển trạng thái sang "Lưu trữ" (`Archived`). Toàn bộ hóa đơn nợ gắn liền với mã định danh học sinh (`student_id`), không phụ thuộc vào trạng thái đóng của lớp học cũ.
     - Khi học sinh lên lớp mới ở niên khóa mới, hệ thống tự động mang theo công nợ cũ (Carried-over Debt) hiển thị tại mục "Nợ kỳ trước" trên hóa đơn mới, và kế toán vẫn có thể thu tiền cho hóa đơn cũ tại màn hình Thu học phí.
  2. **Khôi phục học sinh bắt buộc chỉ định lớp đích đang hoạt động:**
     - Khi bấm "Phục hồi" từ kho lưu trữ: Hệ thống kiểm tra tình trạng lớp học cũ (`formerClassId`).
     - Nếu lớp cũ đã bị giải thể, đóng hoặc kết thúc niên khóa: Hệ thống CHẶN không cho phục hồi mồ côi.
     - Modal phục hồi BẮT BUỘC quản trị viên phải chọn một "Lớp học đích đang hoạt động" (`active_target_class_id`) thuộc niên khóa hiện hành.
     - Hệ thống kiểm tra sĩ số lớp đích: Nếu đã đủ sĩ số tối đa (`enrolled >= capacity`), cảnh báo vượt sĩ số và yêu cầu xác nhận ghi đè có thẩm quyền. Sau khi phục hồi, học sinh tự động liên kết biểu phí và giáo viên chủ nhiệm của lớp mới.
- **Phân tích:** Phương án C bảo toàn tuyệt đối dòng tiền của nhà trường, loại bỏ hoàn toàn tình trạng thất thoát công nợ và ngăn ngừa lỗi dữ liệu mồ côi trong CSDL.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `class-deletion-guard`, `student-archive-record`, `fl-kho-luu-tru-hoc-sinh` và `student-lifecycle-transitions`.

---

### OQ-13: Cô Lập Phiên Đa Trường Đồng Thời (Tab Isolation), Phân Kênh WebSocket schoolCode & Dọn Redux State RESET_TENANT_STATE
- **Vấn đề:** Giáo viên dạy kiêm nhiệm 2 trường (ví dụ TH-ECO01 và TH-ECO02) mở đồng thời 2 tab trình duyệt trên cùng máy tính -> nguy cơ rò rỉ dữ liệu chéo trường qua WebSocket, xung đột token trong LocalStorage và tồn đọng dữ liệu trong Redux Store.
- **Phương án A:** Chỉ cho phép đăng nhập 1 trường tại một thời điểm, mở tab mới sẽ đá văng tab cũ; Dùng chung một kênh WebSocket cho mọi trường.
- **Phương án B:** Dùng chung Redux store không reset, dựa vào kiểm tra API từng request.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Tab Isolation & Tenant-Scoped Storage:**
     - Toàn bộ token xác thực và thông tin phiên làm việc được lưu trong `localStorage` theo tiền tố mã trường: `eco_token_{schoolCode}` và `eco_session_{schoolCode}`.
     - Mỗi tab trình duyệt hoạt động độc lập tuyệt đối theo route `/{schoolCode}/...` trên URL của tab đó, lấy đúng token của trường đó khi gửi request, loại bỏ hoàn toàn race condition ghi đè token giữa các tab.
  2. **Cô lập kênh WebSocket theo Tenant:**
     - URL kết nối WebSocket bắt buộc chứa mã trường: `wss://socket.eco-portal.vn/{schoolCode}/ws?token=...`.
     - Topic subscription trên message broker (Redis Pub/Sub) bắt buộc có định dạng phân tầng: `{schoolCode}:user:{userId}:{channel}` (ví dụ: `TH-ECO01:user:123:attendance`). WebSocket Gateway kiểm tra quyền của `userId` đối với `schoolCode` trong handshake token trước khi cho phép subscribe. Ngăn chặn tuyệt đối việc tab của Trường A nhận thông báo điểm danh của Trường B.
  3. **Redux State Cleanup Hook (`RESET_TENANT_STATE`):**
     - Khi người dùng chuyển đổi trường học trên cùng một tab (chuyển URL từ `/[schoolCode1]/` sang `/[schoolCode2]/`): Next.js Router hook / Redux middleware lập tức kích hoạt action `RESET_TENANT_STATE`.
     - Action này lập tức xóa sạch toàn bộ state của các slice dữ liệu nhạy cảm (học sinh, lớp học, điểm danh, hóa đơn, thông báo, sổ điểm) về initial state rỗng, ngăn chặn hoàn toàn việc hiển thị dữ liệu "bóng ma" (stale/ghost data) của trường cũ trước khi dữ liệu trường mới tải xong.
- **Phân tích:** Phương án C bảo đảm an toàn dữ liệu đa người thuê (Multi-tenancy) ở cấp độ cao nhất trên cả Client-side, Network transport và Real-time messaging.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `multi-tenancy-isolation`, `fl-dang-nhap-da-truong` và `auth-session`.

---

### OQ-14: Lớp Ngoại Khóa — Đóng Trùng Biểu Phí, Xếp Trùng Lịch & Phân Rã Hóa Đơn
- **Vấn đề:** 
  1. Khi học sinh đăng ký các lớp ngoại khóa (Câu lạc bộ năng khiếu, Tiếng Anh nâng cao, Thể thao...): Nguy cơ xếp trùng ca học (với tiết chính khóa hoặc ngoại khóa khác), trùng phòng học/sân bãi, trùng giáo viên đứng lớp.
  2. Mô hình tính phí ngoại khóa đa dạng: Có lớp tính trọn gói theo tháng/khóa (`TERM_FIXED`), có lớp tính theo số buổi thực tế tham gia (`PER_SESSION`). Nếu gộp nguyên khối vào hóa đơn học phí chính khóa sẽ gây khó khăn cho phụ huynh muốn thanh toán riêng hoặc đổi ý rút khỏi lớp ngoại khóa sau khi hóa đơn đã xuất.
  3. Phụ huynh đồng ý đóng học phí chính khóa nhưng từ chối/khiếu nại khoản ngoại khóa: Nếu hóa đơn không thể phân rã, toàn bộ nghĩa vụ tài chính của học sinh bị treo nợ xấu (`OVERDUE`), ảnh hưởng đối soát và báo cáo công nợ nhà trường.
- **Phương án A:** Chỉ cho phép học ngoại khóa vào cuối tuần; tính phí trọn gói 1 mức giá; bắt buộc phụ huynh thanh toán 100% toàn bộ hóa đơn mới coi là hợp lệ.
- **Phương án B:** Cho phép trùng lịch và giáo viên tự thỏa thuận đổi ca; kế toán tính tiền ngoại khóa thủ công bằng Excel ngoài phần mềm.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Bộ điều phối lịch học & Phát hiện xung đột 4 chiều (4-Way Conflict Scheduler):**
     - Khi xếp thời khóa biểu lớp ngoại khóa: Hệ thống tự động kiểm tra xung đột thời gian thực trên 4 chiều:
       - *(a) Học sinh (Student):* Không được trùng khung giờ với tiết chính khóa hoặc lớp ngoại khóa khác đã ghi danh.
       - *(b) Giáo viên (Teacher):* Không bị gán dạy 2 lớp cùng một thời điểm.
       - *(c) Phòng học / Sân bãi (Room/Facility):* Kiểm tra trùng lặp cơ sở vật chất (sân bóng, phòng lab, nhà đa năng).
       - *(d) Sĩ số tối đa (Capacity):* Chặn ghi danh vượt sĩ số lớp ngoại khóa đã cấu hình.
     - Nếu phát hiện trùng lịch, hệ thống chặn lưu (Hard Block) và hiển thị cảnh báo chi tiết vị trí xung đột.
  2. **Mô hình tính phí linh hoạt (Flexible Extracurricular Fee Engine):**
     - Hỗ trợ 2 phương thức tính phí: `TERM_FIXED` (Trọn gói theo tháng/khóa) và `PER_SESSION` (Tính theo số buổi thực tế tham gia). Với `PER_SESSION`, hệ thống tự động tổng hợp số buổi tham dự thực tế từ dữ liệu điểm danh lớp ngoại khóa trong tháng để nhân đơn giá buổi học.
  3. **Phân rã hóa đơn (Sub-Invoice Decomposition) & Partial Payment:**
     - Thiết kế cấu trúc hóa đơn phân rã độc lập: Khoản phí ngoại khóa được định danh là Sub-Invoice / Dòng phí phân rã (`is_separable = true`).
     - Khi phụ huynh từ chối đóng hoặc chưa đóng ngoại khóa:
       - Cho phép phụ huynh thanh toán riêng khoản Chính khóa (Hóa đơn chính chuyển thành `PARTIAL_PAID` hoặc Sub-invoice Chính khóa chuyển sang `PAID`).
       - Nút chức năng "Tách hóa đơn ngoại khóa" (Decompose Sub-Invoice): Độc lập hóa khoản ngoại khóa thành hóa đơn riêng (`INV-EXT-...`), giải phóng hóa đơn chính khóa về trạng thái `PAID` hoàn tất; nếu phụ huynh chính thức hủy tham gia lớp ngoại khóa, cho phép hủy riêng hóa đơn ngoại khóa (`CANCELLED`) có lý do mà không ảnh hưởng gì đến học phí chính khóa.
- **Phân tích:** Phương án C giải quyết triệt để bài toán xếp thời khóa biểu không xung đột, đồng thời mang lại sự linh hoạt tối đa cho kế toán và phụ huynh trong thanh toán học phí.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `extracurricular-billing-scheduling`, `classroom`, `timetable-weekly`, `tuition-invoice`, `fl-lap-thoi-khoa-bieu` và `fl-lap-phat-hanh-hoa-don`.

---

### OQ-15: Đồng Bộ CSDL Ngành (Sở GD&ĐT) & Đóng Băng Dữ Liệu Kỳ Thi
- **Vấn đề:** 
  1. Khi Sở GD&ĐT chốt dữ liệu phục vụ kỳ thi học kỳ hoặc xét chuyển cấp: Mọi thay đổi thông tin định danh học sinh trên portal trong thời gian này sẽ gây sai lệch hồ sơ dự thi và vi phạm quy chế của Sở.
  2. Dữ liệu giữa CSDL Ngành (trên cổng của Bộ/Sở) và CSDL Portal nội bộ có thể xảy ra Data Drift (lệch tên, ngày sinh, sai số định danh CCCD/mã định danh VNeID, sai mã lớp).
  3. Khi thực hiện tiến trình đồng bộ dữ liệu hàng loạt (batch sync) qua API CSDL ngành, nếu một vài học sinh bị lỗi (sai định dạng, trùng CCCD) thì toàn bộ batch có bị rollback làm gián đoạn hay không?
- **Phương án A:** Không khóa dữ liệu; khi có lệch số liệu thì tự động ghi đè từ Portal lên Sở; một học sinh lỗi làm dừng toàn bộ tiến trình đồng bộ.
- **Phương án B:** Khóa toàn bộ portal không cho người dùng truy cập; xuất file Excel nhập thủ công vào cổng CSDL của Sở.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Cơ chế Khóa dữ liệu kỳ thi (Sync Locked / Exam Freeze Guard):**
     - Khi Sở GD&ĐT ban hành mốc chốt kỳ thi, Quản trị viên kích hoạt trạng thái `is_sync_locked = true` cho khối lớp/kỳ thi tương ứng.
     - Khi `is_sync_locked = true`, hệ thống khóa cứng (Read-Only) các trường định danh học sinh nhạy cảm (`full_name`, `dob`, `gender`, `national_id_number`, `moet_student_code`, `class_id`). Mọi thao tác chỉnh sửa thông thường bị vô hiệu hóa kèm thông báo: *"Dữ liệu đã đóng băng đồng bộ theo kỳ thi Sở GD&ĐT. Vui lòng liên hệ BGH để lập phiếu đề nghị mở khóa đặc biệt"*.
     - Mở khóa đặc biệt đòi hỏi BGH ký số phê duyệt và ghi log vào `SyncLockAuditTrail`.
  2. **Cơ chế hòa giải sai lệch dữ liệu (Bidirectional Data Drift Reconciliation):**
     - Thiết lập công cụ đối soát 2 chiều giữa Portal và CSDL Sở. CSDL ngành được coi là Căn cứ pháp lý danh bộ (Legal Ground Truth).
     - Khi quét định kỳ, hệ thống phát hiện các điểm sai lệch (`data_drift_items`), gắn cờ cảnh báo vàng tại Màn hình CSDL Sở (`m4-sm7-danh-muc-thu`), hiển thị bảng so sánh 2 cột: `Giá trị CSDL Sở` vs `Giá trị Portal`.
     - Cung cấp 2 lựa chọn xử lý có thẩm quyền: (a) *Cập nhật theo Sở* (Pull to Portal) hoặc (b) *Tạo biên bản giải trình sai lệch* gửi Phòng/Sở GD&ĐT.
  3. **Cô lập lỗi ngắt quãng từng học sinh (Per-Student Partial Failure Isolation & DLQ):**
     - Kiến trúc đồng bộ batch không dùng Transaction đơn lẻ bao trùm toàn bộ batch. Mỗi học sinh là một sub-transaction độc lập.
     - Nếu học sinh A lỗi (lỗi schema, lỗi mạng, Sở từ chối), hệ thống ghi nhận trạng thái của học sinh A là `SYNC_FAILED`, đẩy vào Hàng đợi thử lại (Retry Queue với Exponential Backoff 3 lần) hoặc Dead Letter Queue (DLQ), kèm mã lỗi nguyên nhân chi tiết.
     - Các học sinh còn lại trong batch vẫn đồng bộ thành công (`SYNC_SUCCESS`) bình thường. Tỷ lệ thành công được báo cáo minh bạch (ví dụ: `Đồng bộ thành công 495/500 học sinh, 5 lỗi cần xử lý`).
- **Phân tích:** Phương án C bảo vệ tính toàn vẹn pháp lý của hồ sơ học sinh trước kỳ thi quốc gia/sở, cô lập rủi ro và đảm bảo tiến trình đồng bộ không bao giờ bị nghẽn toàn cục.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `csdl-so-integration`, `student-profile`, `revenue-category`, `fl-dong-bo-danh-muc-thu`, `m4-sm7-danh-muc-thu` và `m5-sm1-hoc-sinh`.

---

### OQ-16: Quyền Riêng Tư Khuôn Mặt AI (Opt-Out) & Tranh Chấp Quyền Giám Hộ Trẻ
- **Vấn đề:** 
  1. Theo Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, dữ liệu sinh trắc khuôn mặt của trẻ em là dữ liệu nhạy cảm cao. Phụ huynh có quyền từ chối cho phép hệ thống AI quét, nhận diện hoặc công khai hình ảnh khuôn mặt con họ.
  2. Tình huống tranh chấp quyền nuôi con / ly hôn căng thẳng: Tòa án ra phán quyết tước quyền hoặc cấm tiếp cận của một bên phụ huynh. Nếu phụ huynh bị cấm vẫn đến trường đón trẻ, làm sao hệ thống nhận diện và bảo vệ an toàn tính mạng đứa trẻ ngay tại cổng trường?
- **Phương án A:** Bắt buộc 100% học sinh phải dùng AI nhận diện khuôn mặt; Giáo viên tự ghi nhớ mặt phụ huynh tranh chấp bằng mắt thường.
- **Phương án B:** Xóa tài khoản của học sinh từ chối AI; Khi có tranh chấp thì cho học sinh nghỉ học ở nhà.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Cơ chế Quyền riêng tư khuôn mặt AI (AI Biometric Privacy Opt-Out):**
     - Trong Hồ sơ học sinh và Ứng dụng phụ huynh cung cấp cờ cấu hình `opt_out_face_ai` (mặc định: `false`).
     - Khi phụ huynh bật `opt_out_face_ai = true`:
       - Worker AI nhận diện khuôn mặt (BullMQ Face Pipeline) tự động **bỏ qua** trích xuất vector embedding và không gắn tag tên học sinh lên ảnh tập thể lớp.
       - Tự động xóa/vô hiệu hóa các vector sinh trắc học đã lưu trong `face_biometric_registrations` của học sinh đó.
       - Cung cấp tùy chọn cấu hình bảo mật ảnh: `AUTO_BLUR_FACE` (Tự động làm mờ khuôn mặt học sinh trong các album ảnh công bố ra bên ngoài lớp) hoặc `EXCLUDE_FROM_PUBLIC_ALBUM`.
       - Tại màn hình Thư viện ảnh, ảnh chứa học sinh này hiển thị biểu tượng lá chắn bảo vệ quyền riêng tư.
  2. **Cơ chế Bảo vệ Tranh chấp quyền giám hộ (Restricted Custody & Red Alert Pickup Guard):**
     - Hồ sơ học sinh bổ sung danh sách giám sát đặc biệt: `restricted_guardians` (Danh sách người bị hạn chế tiếp cận), bao gồm: Họ tên, CCCD, quan hệ, ảnh nhận diện, lý do hạn chế, và văn bản phán quyết của Tòa án đính kèm.
     - **Chốt chặn an toàn tại Màn hình Điểm danh Đón/Trả (`m2-sm1-diem-danh`):**
       - Học sinh có cảnh báo tranh chấp sẽ có **Huy hiệu Khiên Đỏ (Custody Alert)** ngay trên danh sách điểm danh.
       - Khi quét thẻ đón, quét QR hoặc chọn người đón là người nằm trong danh sách hạn chế (hoặc người lạ không phải người được ủy quyền): Màn hình lập tức bật **Cảnh báo đỏ toàn màn hình (Red Modal Alert)** kèm chuông cảnh báo âm thanh, hiển thị dòng chữ: *"CẢNH BÁO AN NINH: Người này bị TÒA ÁN HẠN CHẾ TIẾP CẬN TRẺ theo Bản án số [X]. TUYỆT ĐỐI KHÔNG GIAO TRẺ"*.
       - Hệ thống tự động khóa nút "Xác nhận trả trẻ", gửi thông báo SOS đến Trưởng Ban Quản trị, Tổ Bảo vệ và Ban Giám hiệu, đồng thời kích hoạt quy trình giữ trẻ an toàn tại phòng BGH.
- **Phân tích:** Phương án C tuân thủ chặt chẽ pháp luật về bảo vệ dữ liệu cá nhân trẻ em, đồng thời thiết lập lá chắn pháp lý và thể chất vững chắc bảo vệ an toàn tối đa cho học sinh trong các biến cố gia đình phức tạp.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `ai-face-recognition`, `face-biometric-registration`, `student-profile`, `attendance-daily`, `fl-diem-danh-don-tra`, `fl-nhan-dien-album-anh`, `m2-sm1-diem-danh` và `m2-sm3-thu-vien`.

---

### OQ-17: Rút Hồ Sơ / Thôi Học Giữa Kỳ & Thanh Lý Quyết Toán Học Phí
- **Vấn đề:** 
  1. Khi học sinh rút hồ sơ chuyển trường hoặc thôi học đột xuất giữa học kỳ: Cách thức tính toán số tiền hoàn trả hoặc số tiền còn nợ phải thu thêm (Pro-rata settlement) có quy tắc rõ ràng nào không? Khoản nào được hoàn, khoản nào không hoàn?
  2. Sau khi có quyết định thôi học: Các hóa đơn học phí tương lai đã lập dự kiến xử lý ra sao? Quy trình hoàn tiền qua phiếu chi kế toán?
  3. Quyền truy cập Mobile App của phụ huynh: Nếu để tài khoản hoạt động bình thường sẽ gây rò rỉ dữ liệu lớp học, nhưng nếu xóa sạch tài khoản thì phụ huynh mất bằng chứng lịch sử học tập và giao dịch tài chính cũ.
- **Phương án A:** Không hoàn lại bất kỳ đồng nào khi thôi học giữa kỳ; Xóa sạch tài khoản học sinh và phụ huynh ngay lập tức.
- **Phương án B:** Kế toán tính vo ngoài giấy bút số tiền hoàn trả; Giữ nguyên tài khoản phụ huynh trong nhóm chat lớp.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Quy tắc quyết toán hoàn tiền Pro-rata minh bạch:**
     - Ban hành chính sách phân loại khoản thu khi thôi học giữa kỳ (`WithdrawalFeePolicy`):
       - *(a) Khoản không hoàn lại (Non-refundable):* Phí ghi danh / nhập học đầu năm, Quỹ phát triển nhà trường / cơ sở vật chất đã phân bổ, đồng phục / giáo trình / học phẩm đã bàn giao phụ huynh.
       - *(b) Khoản hoàn lại theo tỷ lệ thời gian học thực tế (Pro-rata Refund):*
         - *Học phí chính khóa:* Hoàn theo tỷ lệ tuần học chưa diễn ra tính từ ngày quyết định thôi học có hiệu lực đến hết kỳ: $\text{Refund} = \text{Tuition} \times \frac{\text{Số tuần còn lại}}{\text{Tổng số tuần kỳ học}}$.
         - *Tiền ăn bán trú & Bán trú phí:* Hoàn 100% các ngày chưa học kể từ ngày có hiệu lực.
         - *Dịch vụ xe đưa đón / CLB ngoại khóa:* Hoàn 100% các buổi/tháng chưa sử dụng.
     - Công thức quyết toán ròng (Net Settlement): $\text{Net} = \text{Tiền hoàn hợp lệ} + \text{Credit Balance hiện có} - \text{Nợ cũ chưa trả}$.
       - Nếu $\text{Net} > 0$: Nhà trường hoàn trả lại phụ huynh.
       - Nếu $\text{Net} < 0$: Phụ huynh phải nộp thêm trước khi nhận lại hồ sơ gốc.
  2. **Quy trình Lập Phiếu chi hoàn tiền & Hủy hóa đơn tương lai:**
     - Kế toán khởi tạo "Biên bản thanh lý học phí rút hồ sơ" (`WithdrawalSettlementStatement`), hệ thống tự động sinh Phiếu chi hoàn tiền (`TuitionRefundVoucher`) loại `STUDENT_WITHDRAWAL_REFUND`.
     - Phê duyệt 2 cấp (Kế toán trưởng $\rightarrow$ Hiệu trưởng) trước khi giải ngân chuyển khoản/tiền mặt.
     - Hệ thống tự động quét và **Hủy vĩnh viễn (Void/Cancel)** tất cả các hóa đơn dự kiến chưa đến hạn thanh toán trong tương lai của học sinh đó, khóa không phát sinh hóa đơn tự động tiếp theo.
  3. **Thu hồi quyền truy cập Mobile App có kiểm soát (Graceful Account Downgrade):**
     - Ngay khi trạng thái học sinh chuyển thành `WITHDRAWN` (Đã rút hồ sơ):
       - Thu hồi ngay lập tức (Immediate Revocation) quyền truy cập vào các kênh tương tác trực tiếp: Rời khỏi nhóm chat lớp, danh sách điểm danh, bảng tin hoạt động lớp, quyền bình chọn và đặt lịch.
       - Chuyển tài khoản phụ huynh sang chế độ **"Lưu trữ chỉ đọc" (`READ_ONLY_ARCHIVE`)**: Phụ huynh chỉ được quyền tra cứu lịch sử bảng điểm, phiếu thu/hóa đơn và chứng từ kế toán đã phát sinh trong thời gian theo học để bảo vệ quyền lợi pháp lý.
       - Vô hiệu hóa tính năng gửi tin nhắn và thông báo mới.
- **Phân tích:** Phương án C bảo đảm tính minh bạch, công bằng tài chính giữa gia đình và nhà trường, tuân thủ nguyên tắc kế toán chuẩn mực và ngăn chặn rò rỉ thông tin lớp học.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `student-lifecycle-transitions`, `student-profile`, `expense-voucher`, `tuition-invoice`, `student-archive-record`, `fl-kho-luu-tru-hoc-sinh`, `m4-sm1-hoc-phi`, `m4-sm5-khoan-chi`, `m5-sm1-hoc-sinh` và `m5-sm14-luu-tru`.

---

### OQ-18: Giao Dịch VietQR Bất Thường — Chuyển Tiền Thừa, Thiếu & Tra Soát Ngân Hàng
- **Vấn đề:** 
  1. Khi phụ huynh thanh toán học phí qua mã VietQR động, phụ huynh vô tình chuyển 2 lần hoặc cố tình sửa số tiền chuyển thừa so với giá trị hóa đơn.
  2. Phụ huynh sửa số tiền chuyển thiếu (ví dụ hóa đơn 5.200.000 đ nhưng chỉ chuyển 5.000.000 đ hoặc gõ nhầm 520.000 đ).
  3. Ngân hàng phát sinh yêu cầu tra soát giao dịch (Chargeback), khiếu nại tài khoản nguồn bị xâm nhập, hoặc giao dịch có dấu hiệu rửa tiền/gian lận. Nếu hệ thống đã tự động xuất hóa đơn điện tử VAT hoặc giải ngân thì xử lý ra sao?
- **Phương án A:** Chuyển thừa thì nhà trường giữ lại không tính vào đâu; Chuyển thiếu thì hủy bỏ giao dịch coi như chưa nộp; Tra soát thì để kế toán tự giải quyết với ngân hàng ngoài cổng.
- **Phương án B:** Bắt buộc ngân hàng tự rollback tiền thừa; Chuyển thiếu bắt nộp lại toàn bộ hóa đơn từ đầu.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Xử lý Chuyển tiền thừa / Chuyển 2 lần (Overpayment & Duplicate Transfer Resolution):**
     - Khi webhook ngân hàng ghi nhận số tiền chuyển $\text{Amount}_{\text{transfer}} > \text{Amount}_{\text{due}}$:
       - Hệ thống tự động gạch nợ hóa đơn sang trạng thái `PAID` cho đúng số tiền cần thu.
       - Toàn bộ số tiền dôi dư $(\text{Amount}_{\text{transfer}} - \text{Amount}_{\text{due}})$ được tự động kết chuyển thành `credit_balance` (Số dư tín dụng) của học sinh, thông báo ngay qua mobile app cho phụ huynh.
       - Đồng thời tại màn hình Đối soát (`m4-sm2-doi-soat`) hiển thị giao dịch kèm cờ xanh lá `OVERPAID`, cung cấp 2 nút xử lý: (a) *Giữ lại cấn trừ học phí kỳ sau*, hoặc (b) *Tạo phiếu chi hoàn tiền thừa* (Refund Excess Amount) để kế toán chuyển khoản trả lại ngay cho phụ huynh.
  2. **Xử lý Chuyển tiền thiếu (Underpayment / Partial Payment & Dynamic QR Regeneration):**
     - Khi số tiền chuyển $\text{Amount}_{\text{transfer}} < \text{Amount}_{\text{due}}$:
       - Hệ thống không từ chối giao dịch mà chuyển trạng thái hóa đơn sang **`PARTIAL_PAID`** (Thanh toán một phần).
       - Ghi nhận chính xác `paid_amount += Amount_{transfer}` và tính số dư nợ còn lại `remaining_amount = Amount_{due} - paid_amount`.
       - Hệ thống **tự động sinh lại mã VietQR động mới (Dynamic QR Regeneration)** với số tiền payload đúng bằng `remaining_amount` và cập nhật thông báo tới phụ huynh trên Mobile App / Web: *"Bạn đã thanh toán X đ. Vui lòng quét mã QR mới để thanh toán số tiền còn thiếu Y đ"*.
       - Khi phụ huynh quét mã mới trả nốt, hóa đơn tự động chuyển sang `PAID` hoàn tất.
  3. **Cơ chế Đóng băng Chờ tra soát & Ngăn xuất hóa đơn VAT (Chargeback Dispute & Frozen State):**
     - Khi kế toán hoặc cổng thanh toán kích hoạt cờ tranh chấp / yêu cầu tra soát ngân hàng:
       - Hóa đơn và giao dịch lập tức chuyển sang trạng thái **`FROZEN_UNDER_REVIEW` (Đóng băng chờ tra soát)**.
       - Khóa cứng (Hard Lock): **Ngăn chặn tuyệt đối việc xuất Hóa đơn điện tử VAT**, chặn kết chuyển vào quỹ trường, chặn tính vào báo cáo doanh thu thực thu, và chặn rút `credit_balance` liên quan đến giao dịch này.
       - Giao diện Đối soát hiển thị cảnh báo viền đỏ nhấp nháy `DISPUTE_HOLD`.
       - Chỉ khi có biên bản đối soát phân xử cuối cùng từ ngân hàng (Ngân hàng xác nhận hợp lệ $\rightarrow$ Mở khóa `PAID`; Ngân hàng thu hồi / bồi hoàn $\rightarrow$ Kích hoạt `CHARGEBACK_REFUNDED` và phục hồi công nợ học sinh).
- **Phân tích:** Phương án C triệt tiêu rủi ro pháp lý và thất thoát dòng tiền, bảo vệ sự chính xác của báo cáo tài chính và hóa đơn điện tử VAT trước các nghiệp vụ tra soát liên ngân hàng phức tạp.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `vietqr-dynamic-reconciliation`, `tuition-invoice`, `reconciliation-session`, `fl-doi-soat-giao-dich`, `fl-lap-phat-hanh-hoa-don`, `m4-sm1-hoc-phi`, `m4-sm2-doi-soat` và `m6-sm7-lich-su-thanh-toan`.

---

### OQ-19: Sổ Dặn Thuốc Y Tế & Quy Trình Xác Nhận Cho Uống Thuốc Trưa (Medical Administration)
- **Vấn đề:** Trẻ mầm non và tiểu học thường xuyên phải uống thuốc theo toa bác sĩ (kháng sinh, hạ sốt, siro ho, men vi sinh) vào cữ trưa/chiều tại trường. Nếu phụ huynh chỉ dặn miệng hoặc gửi giấy viết tay kẹp trong balo, giáo viên rất dễ quên, nhầm lẫn liều lượng giữa các học sinh, hoặc phụ huynh lo lắng không biết con đã được uống thuốc đúng giờ hay chưa.
- **Phương án A:** Phụ huynh ghi giấy dán lên lọ thuốc; giáo viên tự ghi nhớ uống; không có lưu vết trên phần mềm.
- **Phương án B:** Nhà trường nghiêm cấm nhận dặn thuốc tại lớp; phụ huynh phải tự đến trường vào giờ trưa để cho con uống.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Đơn dặn thuốc điện tử từ Phụ huynh (Digital Medical Request):**
     - Phụ huynh gửi đơn dặn thuốc trực tiếp trên Mobile App trước giờ vào lớp (kèm tên thuốc, liều lượng, đơn vị giọt/muỗng/viên, hướng dẫn uống trước hay sau ăn, và chụp ảnh đơn thuốc của bác sĩ/vỏ thuốc).
     - Đơn dặn thuốc lập tức đồng bộ về phân hệ Vận hành và hiển thị trực quan tại Màn hình Điểm danh Lớp học (`m2-sm1-diem-danh`) và Hồ sơ y tế học sinh.
  2. **Giao diện Giám sát Uống thuốc Trưa của Giáo viên (Teacher Administration Workflow):**
     - Tại màn hình điểm danh, học sinh có đơn dặn thuốc trong ngày được gắn **Huy hiệu Viên thuốc (Medical Badge)** màu cam nổi bật, kèm danh sách checklist thuốc cần cho uống vào cữ trưa/chiều.
     - Sau khi cho học sinh uống thuốc đúng liều lượng, giáo viên bấm nút xác nhận 1-chạm: **"Đã cho uống thuốc lúc HH:mm"** (hệ thống tự động ghi nhận thời gian thực hoặc cho phép điều chỉnh phút, kèm chụp ảnh đối chứng tùy chọn).
  3. **Thông báo an tâm tức thời tới Phụ huynh (Instant Peace-of-Mind Notification):**
     - Ngay khi giáo viên bấm xác nhận, hệ thống tự động bắn Push Notification ưu tiên tới ứng dụng phụ huynh: *"Bé [Tên học sinh] đã được cô giáo [Tên GV] cho uống thuốc [Tên thuốc] đầy đủ vào lúc [HH:mm]. Chúc bé mau khỏe!"*.
     - Bản ghi xác nhận được lưu vết lịch sử bất biến trong `student_medical_logs` phục vụ tra cứu và kiểm toán y tế học đường.
- **Phân tích:** Phương án C giải tỏa 100% âu lo của phụ huynh, triệt tiêu nguy cơ nhầm lẫn thuốc học đường, chuẩn hóa quy trình chăm sóc bán trú và nâng cao uy tín sư phạm của nhà trường.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `attendance-daily`, `student-profile`, `fl-diem-danh-don-tra` và `m2-sm1-diem-danh`.

---

### OQ-20: Ghi Nhận Đến Muộn, Đón Sớm Giữa Buổi & Quy Tắc Không Hoàn Tiền Suất Ăn Khi Phụ Huynh Chủ Động Đón Sớm
- **Vấn đề:** 
  1. Trong thực tế vận hành trường học: Có học sinh đến muộn (sau giờ điểm danh 08:30 sáng) do kẹt xe hoặc khám bệnh sáng; và có trường hợp phụ huynh chủ động đến đón sớm giữa buổi (ví dụ lúc 10:00 sáng, 14:00 chiều) để đưa con về quê, đi khám răng hoặc việc gia đình.
  2. Về mặt tài chính bán trú: Khi phụ huynh chủ động đón con về sớm như vậy thì suất ăn bán trú trong ngày có được hoàn lại tiền không?
- **Phương án A:** Hoàn tiền ăn theo tỷ lệ phần trăm giờ có mặt; Cấm phụ huynh đón sớm trong giờ học.
- **Phương án B:** Hoàn 100% tiền ăn nếu đón trước giờ ăn trưa 11:30; Không ghi nhận giờ đến muộn trên hệ thống.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Ghi nhận trạng thái Đến muộn & Đón sớm giữa buổi trên Điểm danh (`m2-sm1-diem-danh`):**
     - *Đến muộn (Late Arrival):* Ghi nhận giờ đến thực tế `check_in_time > 08:30`. Cung cấp tùy chọn toggle *"Báo bổ sung suất ăn với bếp"* nếu học sinh đến trước 09:00 sáng.
     - *Đón sớm giữa buổi (Early Departure):* Ghi nhận trạng thái đón sớm, giờ đón thực tế `check_out_time`, lý do đón sớm (việc riêng, phụ huynh chủ động) và xác thực người đón hợp lệ theo đúng quy chuẩn an toàn.
  2. **Quy tắc dứt điểm về Hoàn tiền suất ăn bán trú (Meal Refund Rules):**
     - **NGUYÊN TẮC CỐT LÕI: Phụ huynh chủ động đón sớm sau khi học sinh đã đến trường thì TUYỆT ĐỐI KHÔNG HOÀN TIỀN GÌ CẢ (Tỷ lệ hoàn: 0%).** Lý do: Định mức thực phẩm tươi sống đã được nhà bếp thu mua, sơ chế và tính toán khẩu phần từ 08:30 sáng theo sĩ số học sinh có mặt.
     - **Quy tắc hoàn tiền ăn CHỈ áp dụng trong các trường hợp sau:**
       - *(a) Rơi vào các ngày nghỉ lễ, Tết* theo lịch quốc gia hoặc văn bản của Bộ/Sở GD&ĐT.
       - *(b) Nhà trường chủ động cho nghỉ:* Toàn trường hoặc từng lớp nghỉ do thiên tai, bão lũ, dịch bệnh, sửa chữa cơ sở vật chất hoặc sự cố bất khả kháng.
       - *(c) Phụ huynh có đơn xin nghỉ học cả ngày hợp lệ:* Được gửi trên hệ thống và được nhà trường/giáo viên chủ nhiệm phê duyệt trước mốc chốt báo vắng hằng ngày (08:30 sáng).
       - *(d) Trường hợp đón về nửa ngày do Y TẾ (Ngoại lệ duy nhất đã chốt tại OQ-10):* Học sinh đến trường nhưng sốt cao $\ge 38.5^\circ\text{C}$ hoặc có sự cố y tế đột xuất được Y tế trường xác nhận và đón về trước 10:30 sáng $\rightarrow$ Hoàn 50% tiền ăn ngày đó. Sau 11:30 sáng (đã ăn trưa) $\rightarrow$ Hoàn 0%.
- **Phân tích:** Phương án C phân định rạch ròi giữa quyền chủ động đón con của gia đình và chi phí vận hành bếp ăn thực tế của nhà trường, loại bỏ hoàn toàn các khiếu nại tranh cãi tiền lẻ và bảo đảm công bằng tài chính.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `attendance-daily`, `meal-refund-engine`, `fl-diem-danh-don-tra`, `fl-bao-vang-hoan-tien` và `m2-sm1-diem-danh`.

---

### OQ-21: Cơ Chế Tự Động Khóa Sổ Điểm Danh Cuối Tháng Trước Kỳ Tính Phí (Monthly Attendance Auto-Freeze Guard)
- **Vấn đề:** 
  - Vào thời điểm cuối tháng, kế toán cần số liệu ngày nghỉ có phép chính xác tuyệt đối để engine tính toán khấu trừ hoàn tiền ăn và lập đợt hóa đơn học phí tháng tiếp theo (M+1).
  - Nếu yêu cầu giáo viên phải bấm nút "Nộp sổ điểm danh tháng" thủ công cho từng lớp: Giáo viên có thể quên, nộp trễ, hoặc mỗi lớp nộp một giờ khác nhau khiến kế toán không thể chạy batch job đồng loạt.
  - Ngược lại, nếu không có cơ chế khóa: Giáo viên có thể tùy tiện vào sửa lại điểm danh của các ngày trong tháng cũ sau khi hóa đơn đã xuất, gây sai lệch nghiêm trọng giữa số tiền giảm trừ trên hóa đơn và dữ liệu điểm danh thực tế.
- **Phương án A:** Giáo viên bắt buộc phải bấm nút nộp thủ công; nếu lớp nào chưa nộp thì kế toán dừng phát hành hóa đơn lớp đó.
- **Phương án B:** Không khóa dữ liệu; kế toán xuất báo cáo Excel điểm danh tĩnh tại một thời điểm rồi tự nhập tay vào hóa đơn.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Loại bỏ nút nộp thủ công — Tự động đóng băng theo lịch trình hệ thống (Automated Monthly Freeze):**
     - Hệ thống hoàn toàn không cần giáo viên phải thao tác bấm nút nộp sổ thủ công.
     - Vào đúng thời khắc kết thúc ngày cuối cùng của tháng (ví dụ 23:59:59 ngày 30 hoặc 31 hàng tháng), **trước khi tiến trình batch job tính phí cho tháng tiếp theo khởi chạy**, hệ thống kích hoạt cơ chế **TỰ ĐỘNG KHÓA SỔ ĐIỂM DANH (Monthly Attendance Auto-Freeze)** cho toàn bộ các lớp trong trường.
  2. **Trạng thái đóng băng chỉ đọc (Read-Only Freeze Guard):**
     - Ngay khi bị khóa, toàn bộ dữ liệu điểm danh (Đón/trả, vắng có phép/không phép, y tế, nửa ngày) của tháng đó chuyển sang trạng thái `FROZEN_LOCKED` (Chỉ đọc).
     - Hệ thống khóa cứng giao diện chỉnh sửa trên portal và mobile app, cấm mọi thao tác thêm, sửa, xóa dữ liệu điểm danh của tháng đã đóng băng.
     - Thông báo trạng thái hiển thị rõ trên màn hình điểm danh: *"Dữ liệu điểm danh tháng [MM/YYYY] đã tự động đóng băng phục vụ quyết toán tài chính kỳ tiếp theo"*.
  3. **Cơ chế mở khóa ngoại lệ có thẩm quyền (Emergency Unfreeze Protocol):**
     - Trường hợp phát hiện sai sót điểm danh sau khi đã đóng băng: Chỉ duy nhất Ban Giám Hiệu (Hiệu trưởng / Hiệu phó) có thẩm quyền ký duyệt "Phiếu đề nghị điều chỉnh điểm danh tháng cũ" (`AttendanceCorrectionRequest`).
     - Khi duyệt, hệ thống mở khóa có phạm vi (Scoped Unlock) chỉ trong 60 phút và ghi nhật ký kiểm toán bất biến `AttendanceAuditTrail` phục vụ đối soát tài chính.
- **Phân tích:** Phương án C tự động hóa hoàn toàn quy trình đóng sổ điểm danh, triệt tiêu sự chậm trễ do yếu tố con người, và bảo vệ tính toàn vẹn 100% của dữ liệu làm căn cứ khấu trừ học phí.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `attendance-daily`, `meal-refund-engine`, `tuition-invoice`, `m2-sm1-diem-danh` và `m4-sm1-hoc-phi`.

---

### OQ-22: Học Sinh Nhập Học Giữa Tháng (Prorated Invoice) & Quy Định Hóa Đơn Độc Lập Cho Từng Học Sinh (Không Gộp Gia Đình)
- **Vấn đề:** 
  1. *Nhập học giữa tháng:* Học sinh mới chuyển đến nhập học vào giữa tháng (ví dụ ngày 12 hoặc ngày 20 của tháng): Cách thức lập hóa đơn học phí và tiền ăn tháng đầu tiên thế nào để đảm bảo tính công bằng và chính xác?
  2. *Thanh toán gộp cho gia đình có nhiều con:* Một phụ huynh có 2 hoặc 3 con cùng học tại trường (ví dụ 1 bé nhà trẻ, 1 bé mầm non). Có nên gộp chung tất cả các khoản thu của các con vào 1 hóa đơn tổng duy nhất hay tạo hóa đơn riêng lẻ cho từng học sinh?
- **Phương án A:** Thu trọn gói 100% học phí cả tháng không hoàn lại; Gộp chung tất cả con vào 1 hóa đơn tổng.
- **Phương án B:** Kế toán tự tính nhẩm ngoài giấy số tiền lẻ rồi gõ vào ô số tiền; Cho phụ huynh tự chuyển 1 cục tiền không có cú pháp.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Tính học phí lẻ ngày tự động (Prorated Invoice Engine):**
     - Khi tiếp nhận học sinh nhập học giữa tháng, quản trị viên/kế toán chọn "Ngày bắt đầu học chính thức" (`enrollment_date`).
     - Hệ thống tự động kích hoạt công thức phân bổ Prorated cho hóa đơn đầu tiên:
       - *(a) Tiền ăn bán trú:* Tính chính xác theo **số ngày ăn thực tế còn lại** từ ngày bắt đầu học đến ngày làm việc cuối cùng của tháng:
         $$\text{Tiền ăn tháng đầu} = \text{Số ngày ăn thực tế còn lại} \times \text{Đơn giá suất ăn/ngày}.$$
       - *(b) Học phí chính khóa & Dịch vụ tháng:* Chia theo tỷ lệ số ngày học thực tế còn lại so với tổng số ngày làm việc tiêu chuẩn của tháng đó:
         $$\text{Học phí lẻ ngày} = \text{Học phí chuẩn tháng} \times \frac{\text{Số ngày học còn lại trong tháng}}{\text{Tổng số ngày làm việc chuẩn trong tháng}}.$$
       - *(c) Các khoản thu trọn gói ban đầu (nếu có):* Phí nhập học, đồng phục, bảo hiểm, học phẩm được tính nguyên giá theo quy định.
       - *(d) Xử lý biên ngày nghỉ/lễ khi nhập học giữa tháng:* Nếu ngày bắt đầu học (`enrollment_date`) rơi vào ngày thứ Bảy, Chủ nhật hoặc ngày nghỉ lễ theo quy định: Ngày tính tiền ăn và học phí bắt đầu tính từ ngày làm việc và ăn bán trú thực tế đầu tiên. "Số ngày ăn thực tế còn lại" chỉ đếm các ngày bếp hoạt động thực tế đến hết tháng (loại trừ cuối tuần và ngày lễ).
  2. **Quy định dứt điểm: Hóa đơn riêng lẻ độc lập cho từng học sinh (Không gộp hóa đơn gia đình):**
     - **Hệ thống chỉ tạo hóa đơn riêng lẻ cho từng học sinh.** Tuyệt đối không gộp chung nghĩa vụ tài chính của nhiều học sinh vào một hóa đơn tổng duy nhất.
     - **Mỗi học sinh có:**
       - Một mã hóa đơn riêng biệt duy nhất (`INV-{studentCode}-{YYYYMM}`).
       - Một mã VietQR động độc lập chứa đúng số tiền của hóa đơn đó và cú pháp chuyển khoản định danh riêng cho từng học sinh.
       - Cơ chế gạch nợ tự động khớp lệnh riêng lẻ theo từng mã giao dịch.
     - *Lý do:* Mỗi học sinh có thể học các khối lớp khác nhau, áp dụng chính sách miễn giảm khác nhau, phát sinh ngày vắng hoàn tiền ăn độc lập, và khi xuất Hóa đơn điện tử VAT / Biên lai thu phí theo quy định kế toán nhà nước thì bắt buộc phải gắn với đúng mã định danh của từng người học.
- **Phân tích:** Phương án C chuẩn hóa kế toán trường học, giúp việc đối soát ngân hàng qua VietQR không bị nhập nhằng công nợ giữa các anh chị em, và tạo sự minh bạch tuyệt đối cho phụ huynh khi thanh toán.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `tuition-invoice`, `meal-refund-engine`, `vietqr-dynamic-reconciliation`, `fl-lap-phat-hanh-hoa-don`, `m4-sm1-hoc-phi` và `m5-sm1-hoc-sinh`.

---

### OQ-23: Chính Sách Miễn Giảm Học Phí Anh Chị Em Ruột (Sibling Discount) Tự Động Theo Số Điện Thoại Phụ Huynh
- **Vấn đề:** 
  - Nhiều trường áp dụng chính sách khuyến khích gia đình: Con thứ 2 được giảm 10%, con thứ 3 trở đi được giảm 15% - 20% học phí chính khóa.
  - Làm thế nào để hệ thống tự động nhận diện các anh chị em ruột mà không phụ thuộc vào việc kế toán phải nhớ hoặc dò tìm thủ công?
  - Xử lý thế nào khi người con lớn tốt nghiệp ra trường, chuyển trường hoặc thôi học: Mức giảm của người con thứ 2/thứ 3 có tự động được điều chỉnh lại để tránh thất thoát học phí của nhà trường hay không?
- **Phương án A:** Kế toán tự tìm học sinh trùng họ tên phụ huynh và gán mã giảm giá thủ công từng em; Khi con lớn ra trường thì kế toán tự nhớ để xóa mã giảm.
- **Phương án B:** Bắt phụ huynh mỗi kỳ phải nộp đơn xin miễn giảm kèm bản sao công chứng sổ hộ khẩu.
- **Phương án C (Giải pháp Red-Team toàn diện):**
  1. **Bổ sung Sibling Discount vào Sub-module "Miễn giảm" (`m4-sm8-mien-giam.md` & `discount-policy.md`):**
     - Tạo loại chính sách ưu đãi hệ thống: `SIBLING_DISCOUNT` (Giảm trừ học phí anh chị em ruột).
     - Cấu hình linh hoạt theo trường: Bậc 1 (Con thứ 1: 0%), Bậc 2 (Con thứ 2: giảm $X\%$), Bậc 3+ (Con thứ 3 trở đi: giảm $Y\%$).
  2. **Cơ chế tự động liên kết Anh/Chị/Em qua Định danh Phụ huynh (Parent Contact Linkage):**
     - Hệ thống tự động nhóm các học sinh thành một "Nhóm gia đình" (Family Group) dựa trên **Số điện thoại chính của phụ huynh (`primary_phone`)** kết hợp số định danh CCCD/CMND của Bố/Mẹ trong Hồ sơ học sinh 360 (`student-profile`).
     - Sắp xếp thứ tự con theo ngày sinh (`dob`): Con sinh trước là Con thứ 1, các con sinh sau lần lượt là Con thứ 2, Con thứ 3.
  3. **Tự động áp dụng và tự động ngừng chính sách theo trạng thái học tập thực tế (Dynamic Sibling Lifecycle):**
     - **Điều kiện hưởng ưu đãi:** Con thứ 2/thứ 3 chỉ được tự động áp dụng mức giảm khi và chỉ khi người anh/chị lớn hơn đang có trạng thái học tập **`ACTIVE`** (Đang theo học) tại trường trong cùng kỳ tính phí.
     - **Tự động cập nhật khi thay đổi trạng thái:** Khi người con lớn chuyển cấp ra trường, tốt nghiệp, rút hồ sơ hoặc lưu trữ (`GRADUATED`, `TRANSFERRED_OUT`, `WITHDRAWN`, `ARCHIVED`):
       - Hệ thống tự động đánh giá lại số lượng con đang có trạng thái `ACTIVE`.
       - Ở kỳ lập hóa đơn tiếp theo, mức miễn giảm của các con nhỏ hơn tự động được cập nhật lại (ví dụ gia đình có 3 con: khi con 1 ra trường, con 2 trước đây được giảm 10% nay trở thành người con lớn nhất đang học nên giảm 0%; con thứ 3 trước đây giảm 20% nay chuyển thành con thứ 2 giảm 10%). Việc điều chỉnh diễn ra tự động ở kỳ tính phí tiếp theo (M+1), không hồi tố kỳ cũ đã thanh toán.
       - Mọi thay đổi đều được ghi log kiểm toán tại `DiscountAuditTrail` và hiển thị ghi chú minh bạch trên dòng hóa đơn học phí.
- **Phân tích:** Phương án C hoàn thiện trọn vẹn sub-module Miễn giảm, tự động hóa 100% khâu nhận diện và tính toán ưu đãi gia đình, vừa loại bỏ sai sót thủ công vừa bảo toàn doanh thu cho nhà trường.
- **Quyết định chốt:** **Chọn Phương án C**. Triển khai trong `discount-policy`, `discount-deduplication`, `student-profile`, `tuition-invoice`, `m4-sm8-mien-giam` và `fl-thiet-lap-mien-giam`.

---

## 3. KẾT LUẬN & CAM KẾT CHẤT LƯỢNG

Tất cả 23 câu hỏi mở cốt lõi trên đã được phân tích và chốt phương án dứt điểm. Trong toàn bộ tài liệu LLM Wiki (các trang `overview`, `sources`, `entities`, `concepts`, `flows`, `screens`), **tuyệt đối không xuất hiện bất kỳ thẻ `[CẦN LÀM RÕ]` nào**. Mọi đặc tả nghiệp vụ đều tuân thủ các quyết định đã được phê duyệt ở tài liệu này.
