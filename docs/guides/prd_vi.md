# Tài Liệu Yêu Cầu Sản Phẩm (PRD) — Cổng Vận Hành Trường Học (School Operating Portal)

> **Dự án:** School Operating Portal (Finviet / SOHA)  
> **Phiên bản mục tiêu:** Bản phát hành Doanh nghiệp Giai đoạn 1 (Phase 1 Enterprise Release)  
> **Trạng thái:** Đã phê duyệt cho Kế hoạch Thực thi (Approved for Execution Planning)  
> **Tài liệu nguồn:** `docs_legacy/operating-portal/` (PRD & Kịch bản kiểm thử)

---

## 1. Mục Tiêu Sản Phẩm & Tổng Quan Điều Hành

**School Operating Portal** là nền tảng quản trị và vận hành giáo dục đa trường (multi-tenant) cấp doanh nghiệp, được thiết kế chuyên biệt cho các cơ sở giáo dục Mầm non và Phổ thông liên cấp (K-12) tại Việt Nam. Nền tảng hợp nhất quản lý lớp học hằng ngày, quản trị học tập và tài chính trường học vào một trải nghiệm web liền mạch, hiệu năng cao và bảo mật.

Mục tiêu trọng tâm của giai đoạn này là tái cấu trúc và xây mới 4 trụ cột vận hành thiết yếu:
1. **Vận Hành (Operations):** Tối ưu hóa quy trình đón/trả học sinh hằng ngày, theo dõi sức khỏe và thân nhiệt, nhật ký hoạt động lớp học, thư viện media nhận diện khuôn mặt tự động bằng AI, kênh trao đổi đa chiều với phụ huynh và hệ thống báo cáo vận hành.
2. **Học Tập (Academics):** Tiêu chuẩn hóa thời khóa biểu tuần, giao và chấm bài tập về nhà, cùng sổ điểm đánh giá định kỳ theo quy chuẩn của Bộ GD&ĐT.
3. **Tài Chính (Finance):** Quản lý toàn diện hóa đơn học phí với mã VietQR động, danh mục khoản thu, cấu hình biểu phí từng lớp, phiếu chi nội bộ, đối soát giao dịch cổng thanh toán, báo cáo tỷ lệ thu học phí và **hệ thống chính sách miễn giảm học phí linh hoạt**.
4. **Nhà Trường (School Administration):** Quản trị dữ liệu gốc trường học (học sinh 360°, giáo viên & phân quyền kiểm duyệt, lớp học, môn học, khối lớp), truyền thông & vận hành (bảng thông tin, bình chọn, thực đơn tuần an toàn thực phẩm, điểm danh nhân viên, sổ tay phụ huynh), cùng hòm thư góp ý, lịch sự kiện, niên khóa và kho lưu trữ học sinh.

---

## 2. Người Dùng Mục Tiêu & Chân Dung Các Bên Liên Quan

- **Ban Giám Hiệu & Quản Trị Viên (School Admins):** Cần góc nhìn tổng quan toàn diện về mọi hoạt động của các lớp, thiết lập cấu hình hệ thống, phê duyệt chính sách học phí và phiếu chi, theo dõi tiến độ và báo cáo tổng hợp.
- **Giáo Viên Chủ Nhiệm & Bộ Môn (Teachers):** Cần thao tác 1 chạm siêu nhanh trên máy tính/máy tính bảng cho việc điểm danh đón/trả buổi sáng và chiều, ghi nhận thân nhiệt và dấu hiệu y tế bất thường, đăng bài hoạt động, giao bài tập, tải ảnh lớp học, trao đổi trực tiếp với phụ huynh và nhập điểm số.
- **Kế Toán Trường Học (School Accountants):** Cần các công cụ kiểm soát tài chính chuẩn mực, tạo hóa đơn học phí hàng loạt tự động đối soát khấu trừ ngày ăn theo dữ liệu điểm danh, gán biểu phí cho từng lớp, theo dõi vòng đời phiếu chi và đối soát số liệu ngân hàng.
- **Phụ Huynh Học Sinh (Parents — Bên liên quan gián tiếp):** Nhận thông báo tức thời (push notification), mã QR đóng học phí, nhật ký hoạt động, thực đơn và ảnh đón/trả của con thông qua ứng dụng di động liên kết.

---

## 3. Bài Toán Nghiệp Vụ & Cơ Hội

Hệ thống cũ gặp phải các vấn đề về phân mảnh kiến trúc, dữ liệu thiếu đồng bộ giữa các phân hệ và trải nghiệm người dùng chưa tối ưu. Giáo viên thường mất nhiều thời gian trong khung giờ cao điểm đón trẻ (7:30 - 8:30 sáng), trong khi kế toán phải đối soát thủ công giữa ngày nghỉ có phép trên bảng điểm danh với số tiền ăn cần trừ trên hóa đơn tháng sau.

Bằng việc tái phát triển toàn diện cổng vận hành trên nền tảng **Next.js (Pages Router)**, **Redux Toolkit**, **Tailwind CSS** kết hợp `styled-components`, cùng **Laravel Sanctum REST API**, hệ thống đạt được:
- Tốc độ tải và phản hồi bảng điểm danh dưới 800ms ngay cả trong giờ cao điểm đón trẻ toàn trường.
- Tự động hóa hoàn toàn luồng khấu trừ tiền ăn bán trú theo ngày nghỉ có phép từ phân hệ Điểm danh sang Hóa đơn học phí.
- Ứng dụng AI nhận diện khuôn mặt tự động gắn thẻ học sinh trong thư viện ảnh lớp, tiết kiệm hơn 80% thời gian lọc ảnh thủ công cho giáo viên.
- Kiến trúc đa trường (Multi-tenancy) cô lập dữ liệu tuyệt đối qua tiền tố `{schoolCode}` trên đường dẫn, kiểm soát định tuyến bởi OpenResty và Google Cloud Run.

---

## 4. Câu Chuyện Người Dùng (User Stories)

### 4.1 Phân hệ 1: Vận Hành (Operations)
- **US-OPS-01 (Điểm danh hằng ngày):** Là giáo viên chủ nhiệm, tôi muốn xem danh sách lớp hôm nay và ghi nhận giờ Đón và Trả chỉ với 1 click, để tình trạng có mặt của học sinh được cập nhật ngay lập tức cho phụ huynh và nhà trường.
- **US-OPS-02 (Theo dõi sức khỏe & thân nhiệt):** Là giáo viên, tôi muốn ghi nhận nhiệt độ và chọn các dấu hiệu sức khỏe (Cảm sốt, Sốt cao, Tay chân miệng...) để sớm phát hiện và ngăn ngừa nguy cơ lây nhiễm trong trường.
- **US-OPS-03 (Xác thực người đón hộ):** Là giáo viên trả trẻ, tôi muốn kiểm tra và chọn người đón trong danh sách người đưa đón hợp lệ đã đăng ký, đảm bảo chỉ giao trẻ cho người được ủy quyền.
- **US-OPS-04 (Báo vắng hàng loạt & Hoàn tiền):** Là giáo viên hoặc quản trị viên, tôi muốn chọn nhiều học sinh vắng cùng lúc và phân loại Có phép / Không phép cùng tùy chọn hoàn tiền học/tiền ăn, để hệ thống tự động khấu trừ vào kỳ thu tiếp theo.
- **US-OPS-05 (Bảng tin hoạt động lớp):** Là giáo viên, tôi muốn đăng bài hoạt động hằng ngày kèm hình ảnh, gắn thẻ bài học (`#`) và nhắc tên học sinh (`@`) để phụ huynh đồng hành cùng việc học của con.
- **US-OPS-06 (Thư viện ảnh & Nhận diện AI):** Là nhân viên nhà trường, tôi muốn ảnh lớp tải lên được AI tự động phân tích khuôn mặt và gom nhóm vào album từng học sinh, giúp phụ huynh dễ dàng tìm thấy ảnh con mình.
- **US-OPS-07 (Trao đổi tin nhắn phụ huynh):** Là giáo viên, tôi muốn duy trì các kênh trò chuyện trực tiếp 1:1 với từng phụ huynh, nhóm học sinh hoặc cả lớp kèm tệp đính kèm, giữ thông tin liên lạc luôn thông suốt và chuyên nghiệp.
- **US-OPS-08 (Báo cáo điểm danh & Báo cáo mở rộng):** Là cán bộ quản lý, tôi muốn xuất lưới điểm danh tháng của lớp và các mẫu báo cáo đánh giá định kỳ ra Excel để phục vụ thanh tra và lưu trữ hồ sơ.

### 4.2 Phân hệ 2: Học Tập (Academics)
- **US-ACAD-01 (Thời khóa biểu):** Là quản trị học vụ hoặc giáo viên, tôi muốn lập lịch học tuần theo tiết, môn, phòng học, giáo viên phụ trách và công bố đến phụ huynh kèm lịch sử phiên bản.
- **US-ACAD-02 (Bài tập về nhà):** Là giáo viên bộ môn, tôi muốn tạo bài tập kèm hạn nộp, hướng dẫn đính kèm và theo dõi trạng thái nộp bài của học sinh để củng cố việc tự học.
- **US-ACAD-03 (Sổ điểm & Đánh giá):** Là giáo viên, tôi muốn nhập điểm miệng, 15 phút, 1 tiết, giữa kỳ và cuối kỳ vào sổ điểm chuẩn hóa để ghi nhận chính xác kết quả học tập.

### 4.3 Phân hệ 3: Tài Chính (Finance)
- **US-FIN-01 (Lập hóa đơn & Thu phí):** Là kế toán, tôi muốn tạo hóa đơn thu tiền tháng cho học sinh gồm học phí, tiền ăn, xe đưa đón và ngoại khóa, tích hợp mã VietQR động để phụ huynh chuyển khoản chính xác tuyệt đối.
- **US-FIN-02 (Tự động trừ tiền ăn theo điểm danh):** Là kế toán, tôi muốn hệ thống tự động tính số tiền ăn cần giảm trừ dựa trên số ngày nghỉ có phép hợp lệ từ phân hệ Điểm danh của tháng trước.
- **US-FIN-03 (Danh mục khoản phí):** Là kế toán, tôi muốn quản lý danh mục toàn bộ các khoản thu, đơn giá chuẩn, kỳ thu và phân loại bắt buộc / tự chọn.
- **US-FIN-04 (Cấu hình học phí theo lớp):** Là kế toán, tôi muốn gán gói khoản thu và đơn giá tùy chỉnh phù hợp cho từng lớp học hoặc khối lớp.
- **US-FIN-05 (Quản lý khoản chi):** Là kế toán, tôi muốn lập, trình duyệt và theo dõi các phiếu chi nội bộ kèm chứng từ đính kèm và quản lý quy trình hủy phiếu chi.
- **US-FIN-07 (Báo cáo thu học phí):** Là hiệu trưởng hoặc kế toán trưởng, tôi muốn biểu đồ trực quan theo dõi tỷ lệ hoàn thành học phí toàn trường và từng lớp (Đã nộp, Nộp một phần, Chưa nộp).
- **US-FIN-08 (Chính sách Miễn giảm học phí & Khoản thu):** Là ban giám hiệu hoặc kế toán, tôi muốn thiết lập và quản lý các chính sách miễn giảm theo tỷ lệ % hoặc số tiền cố định (VNĐ) áp dụng cho khoản thu cụ thể (học phí, tiền ăn, xe đưa đón...) cho từng đối tượng học sinh hoặc danh sách lớp theo năm học hoặc khoảng tháng; khi học sinh có từ 2 chính sách hợp lệ cùng lúc (ví dụ học sinh đã có chính sách theo cả lớp, sau đó được tạo thêm chính sách riêng), hệ thống sẽ cảnh báo chương trình hiện hành khi thiết lập và tự động so sánh để áp dụng mức giảm cao nhất khi xuất hóa đơn, bảo đảm quyền lợi tối đa cho học sinh.

### 4.4 Phân hệ 4: Nhà Trường (School Administration) — Dữ Liệu Gốc
- **US-SCH-01 (Danh bạ & Hồ sơ học sinh 360°):** Là quản trị viên, tôi muốn quản lý hồ sơ gốc học sinh qua các năm học (mã học sinh, CCCD, ngày sinh), lớp chính khóa/ngoại khóa, thông tin liên hệ đa phụ huynh, miễn giảm đặc thù, biểu đồ tăng trưởng thể lực (BMI), và 5 tab ngữ cảnh (Hồ sơ, Hoạt động, Thư viện, Điểm danh, Học phí).
- **US-SCH-02 (Chuyển lớp & Chuyển năm học):** Là quản trị viên, tôi muốn chuyển lớp từng học sinh hoặc chuyển năm học hàng loạt với cơ chế tự động chuyển biểu phí sang lớp mới, thu hồi quyền chat lớp cũ và bảo toàn kết quả học tập.
- **US-SCH-03 (Danh bạ giáo viên & Phân quyền kiểm duyệt):** Là quản trị viên, tôi muốn quản lý danh sách giáo viên, phân công chủ nhiệm/bộ môn, cấp tài khoản và áp dụng cơ chế kiểm duyệt nội dung 2 cấp (Giáo viên chính tự động đăng bài, Giáo viên hỗ trợ chuyển bài chờ duyệt).
- **US-SCH-04 (Phân loại lớp học & Chốt chặn xóa lớp):** Là quản trị viên, tôi muốn phân tách rõ ràng lớp chính khóa và lớp ngoại khóa (chỉ bật tính năng điểm danh/hoạt động/ảnh), đồng thời hệ thống phải chặn tuyệt đối việc xóa lớp nếu lớp vẫn còn học sinh.
- **US-SCH-05 (Môn học & Phân công giảng dạy):** Là quản trị học vụ, tôi muốn tra cứu danh mục môn học chuẩn theo 4 cấp học (Tiểu học, THCS, THPT, GDTX) và phân công giáo viên giảng dạy nhanh chóng.
- **US-SCH-06 (Phân cấp khối lớp):** Là quản trị viên, tôi muốn theo dõi tổng số lớp, số học sinh theo từng khối lớp với thanh tìm kiếm nhanh nhạy bén.

### 4.5 Phân hệ 4: Nhà Trường — Vận Hành & Tri Thức
- **US-SCH-07 (Bảng thông tin & Lên lịch gửi thông báo):** Là ban giám hiệu, tôi muốn soạn thảo, xem trước giao diện mobile, hẹn giờ phát thông báo tới toàn trường, giáo viên, phụ huynh hoặc lớp học qua push app và email.
- **US-SCH-08 (Bình chọn & Khảo sát ý kiến):** Là nhà trường, tôi muốn tạo các cuộc khảo sát nhiều lựa chọn, phân tách giữa tạo nháp và phát hành, theo dõi tiến độ bình chọn qua biểu đồ tròn thời gian thực.
- **US-SCH-09 (Kế hoạch thực đơn & An toàn thực phẩm):** Là quản lý bán trú, tôi muốn lập thực đơn tuần trước tối đa 8 tuần theo dạng lưới hoặc tệp tải lên, tự động kế thừa thực đơn trường cho các lớp, đồng thời truy xuất nguồn gốc thực phẩm theo mã GTIN/lô.
- **US-SCH-10 (Điểm danh nhân viên 1 chạm):** Là quản lý nhân sự, tôi muốn chấm công đến/về cho nhân viên tức thì bằng 1 click, phê duyệt nghỉ phép có/không phép và hỗ trợ điều chỉnh trong vòng 45 ngày quá khứ.
- **US-SCH-11 (Sổ tay phụ huynh & Cây tri thức 2 cấp):** Là nhà trường, tôi muốn tổ chức các quy định, hướng dẫn và câu hỏi thường gặp theo cấu trúc danh mục 2 cấp rõ ràng, dễ tra cứu.

### 4.6 Phân hệ 4: Nhà Trường — Ý Kiến, Lịch, Niên Khóa & Lưu Trữ
- **US-SCH-12 (Tiếp nhận & Xử lý góp ý phụ huynh):** Là ban giám hiệu, tôi muốn tiếp nhận phiếu góp ý theo 8 lĩnh vực, phân công cán bộ xử lý, đặt mức độ ưu tiên và trao đổi 2 chiều minh bạch với phụ huynh.
- **US-SCH-13 (Lịch sự kiện & Ngày nghỉ):** Là nhà trường, tôi muốn quản lý lịch sự kiện trên 3 chế độ xem (Năm, Tháng, Danh sách sự kiện) có mã màu phân loại rõ ràng (Ngày nghỉ, Sự kiện nội bộ, Sự kiện mời phụ huynh).
- **US-SCH-14 (Cấu hình niên khóa & Học kỳ):** Là quản trị viên, tôi muốn cấu hình các năm học và kỳ học với thuật toán tự động nhận diện năm học hiện tại và chặn trùng lặp thời gian.
- **US-SCH-15 (Kho lưu trữ học sinh rút hồ sơ):** Là quản trị viên, tôi muốn lưu trữ độc lập học sinh đã thôi học/chuyển trường, hỗ trợ phục hồi nguyên trạng vào lớp học hoặc xóa vĩnh viễn với quy trình xác nhận 2 bước an toàn.

---

## 5. Yêu Cầu Chức Năng (Functional Requirements)

### Phân hệ 1: Vận Hành (Operations)
- `FR-OPS-001`: Hệ thống PHẢI cung cấp danh sách điểm danh lớp theo ngày, mặc định hiển thị ngày hiện tại.
- `FR-OPS-002`: Hệ thống PHẢI hỗ trợ đón trẻ 1 click (Đón), ghi nhận mốc thời gian chính xác và tự động gắn huy hiệu "Đến muộn" nếu sau giờ quy định của trường.
- `FR-OPS-003`: Hệ thống PHẢI ràng buộc giờ Trả phải lớn hơn giờ Đón. Nếu nhập giờ Trả $\le$ giờ Đón, hệ thống PHẢI chặn lại với thông báo: `Giờ trả học sinh phải lớn hơn giờ đón học sinh` (MSG01).
- `FR-OPS-004`: Nếu nhấn Trả nhanh cho học sinh chưa có giờ Đón, hệ thống PHẢI cảnh báo `Chưa nhập thời gian đón học sinh` (MSG02) và chặn thao tác.
- `FR-OPS-005`: Hệ thống PHẢI cung cấp hộp thoại đón/trả nâng cao (nút bánh răng) cho phép giáo viên chọn chính xác người đón hộ trong danh sách người giám hộ hợp lệ.
- `FR-OPS-006`: Hệ thống PHẢI cung cấp tính năng báo vắng hàng loạt, bắt buộc chọn lý do Có phép / Không phép và cờ Được hoàn tiền / Không hoàn tiền.
- `FR-OPS-007`: Hệ thống PHẢI duy trì danh mục sức khỏe đóng chuẩn: Bình thường, Cảm sốt, Sốt cao, Đỏ mắt, Mụn rộp, Đau bụng, Thủy đậu, Sốt xuất huyết, Tay chân miệng.
- `FR-OPS-008`: Bảng tin hoạt động lớp PHẢI hỗ trợ văn bản định dạng, đính kèm ảnh/video, hashtag bài học (`#`), nhắc tên học sinh (`@`) và trạng thái duyệt (Chờ duyệt / Đã duyệt).
- `FR-OPS-009`: Hệ thống PHẢI tự động duy trì 2 album hệ thống ("Hoạt động" và "Điểm danh") bên cạnh các album ảnh/video tùy tạo của giáo viên.
- `FR-OPS-010`: Hệ thống PHẢI tích hợp xử lý nhận diện khuôn mặt tự động bằng AI, phân tích ảnh tải lên và gắn thẻ học sinh tương ứng.
- `FR-OPS-011`: Hệ thống PHẢI cung cấp kênh nhắn tin thời gian thực gồm chat 1:1 với phụ huynh, nhóm học sinh tùy chọn và thông báo toàn lớp.
- `FR-OPS-012`: Hệ thống PHẢI xuất được bảng điểm danh tháng kèm số buổi đi học, nghỉ có phép, không phép và tiền phạt đón muộn (nếu có).

### Phân hệ 2: Học Tập (Academics)
- `FR-ACAD-001`: Cho phép cấu hình thời khóa biểu tuần theo các tiết học sáng và chiều, gán môn học, phòng học và giáo viên.
- `FR-ACAD-002`: Hỗ trợ lưu vết lịch sử phiên bản thời khóa biểu khi gửi cập nhật cho phụ huynh.
- `FR-ACAD-003`: Cho phép tạo bài tập về nhà theo lớp và môn học kèm tiêu đề, hướng dẫn chi tiết, tệp đính kèm và hạn nộp.
- `FR-ACAD-004`: Hiển thị bảng theo dõi trạng thái nộp bài (Đã nộp, Đã chấm, Nộp trễ, Chưa nộp) của từng học sinh.
- `FR-ACAD-005`: Bảng điểm đánh giá học sinh hỗ trợ linh hoạt các cột điểm thường xuyên, kiểm tra 15 phút, 1 tiết, giữa kỳ và cuối kỳ.

### Phân hệ 3: Tài Chính (Finance)
- `FR-FIN-001`: Hỗ trợ lập hóa đơn thu phí theo phạm vi Toàn trường, Khối lớp, Lớp học hoặc từng Học sinh cho tháng bất kỳ.
- `FR-FIN-002`: Động cơ tính học phí PHẢI tự động khấu trừ tiền ăn bán trú theo số ngày nghỉ có phép hợp lệ của tháng trước.
- `FR-FIN-003`: Mỗi hóa đơn phát hành PHẢI có mã hóa đơn duy nhất, bảng chi tiết từng dòng khoản thu, hạn nộp và mã VietQR động chuẩn ngân hàng.
- `FR-FIN-004`: Quản lý chặt chẽ trạng thái hóa đơn: Đã tạo, Đã gửi, Nộp một phần, Đã hoàn thành, Quá hạn, và Đã hủy.
- `FR-FIN-005`: Duy trì danh mục khoản thu với tên khoản, đơn vị tính (tháng, kỳ, năm, lần...), đơn giá và cờ Bắt buộc / Tự chọn.
- `FR-FIN-006`: Cấu hình học phí theo lớp cho phép gán danh mục thu và ghi đè mức tiền riêng biệt cho từng lớp học.
- `FR-FIN-007`: Quản lý phiếu chi nội bộ với phân loại mục chi, người nhận tiền, chứng từ đính kèm và lý do hủy phiếu.
- `FR-FIN-009`: Biểu đồ phân tích tỷ lệ thu học phí toàn trường và từng lớp (tiến độ thu, số tiền còn nợ).
- `FR-FIN-010`: Cung cấp phân hệ Quản lý chính sách Miễn Giảm (`/school/discount`) hiển thị mã chính sách, tên chính sách, khoản phí áp dụng, loại miễn giảm, mức miễn giảm, phạm vi đối tượng, thời hạn hiệu lực và trạng thái.
- `FR-FIN-011`: Hỗ trợ 2 phương thức tính miễn giảm: Theo phần trăm (`percent`, 1% - 100%) hoặc Theo số tiền cố định (`fixed_amount`, VNĐ), ràng buộc vào một khoản thu cụ thể trong danh mục trường.
- `FR-FIN-012`: Hỗ trợ 2 phạm vi áp dụng: Theo danh sách lớp học (chọn nhiều lớp) hoặc Theo học sinh cụ thể (hộp thoại chọn học sinh đa lớp).
- `FR-FIN-013`: Quản lý thời hạn theo Năm học hoặc Khoảng tháng (`từ tháng` đến `đến tháng`). Hệ thống PHẢI tự động chuyển trạng thái `Hết hạn` khi qua thời gian áp dụng, và hỗ trợ nút Tạm dừng / Kích hoạt lại thủ công.
- `FR-FIN-014`: Khi tạo hóa đơn học phí (`/school/fee/create`), hệ thống PHẢI tự động rà soát các chính sách miễn giảm hợp lệ và đưa vào hóa đơn dưới dạng dòng giảm trừ (`Giảm trừ miễn giảm: -X đ`).
- `FR-FIN-015`: Trong bước tạo hóa đơn, cung cấp công tắc hành chính **"Tự động áp dụng chính sách miễn giảm"** (mặc định BẬT) để kế toán linh hoạt quyết định cho từng đợt tạo mà không ảnh hưởng cấu hình chính sách gốc.
- `FR-FIN-016`: Cung cấp tính năng xuất Excel danh sách chính sách miễn giảm và danh sách học sinh thụ hưởng với chuẩn mã hóa UTF-8 tiếng Việt.
- `FR-FIN-017`: Khi học sinh thỏa mãn đồng thời từ 2 chương trình miễn giảm hợp lệ trở lên cho cùng một khoản thu (ví dụ: học sinh A đã có chương trình X áp dụng cho cả lớp, và được thiết lập thêm chương trình Y cho riêng cá nhân):
  1. Trong giao diện thiết lập/chỉnh sửa chính sách (`CreateDiscountPolicyModal`), hệ thống PHẢI phát hiện và hiển thị hộp thông báo cảnh báo về chương trình hiện hành của học sinh, so sánh mức ưu đãi giữa chương trình cũ và mới, và khẳng định cơ chế tự động áp dụng mức cao nhất.
  2. Khi tạo hóa đơn thu phí, động cơ giải quyết xung đột PHẢI tự động áp dụng chương trình có **giá trị giảm trừ thực tế CAO NHẤT** (`Math.max`) để bảo toàn quyền lợi tối đa cho học sinh. Nếu hai chương trình có giá trị giảm bằng nhau, chính sách dành riêng cho cá nhân học sinh được ưu tiên áp dụng.
- `FR-FIN-018 (Chuẩn hóa dữ liệu Học sinh & Liên thông Miễn giảm - Học phí)`:
  1. Toàn bộ danh mục Học sinh và Lớp học (đặc biệt là khối THPT như Lớp 10A1, 10A2, 10A3, 11A1, 12A1) PHẢI đồng bộ và nhất quán 100% giữa phân hệ Học sinh (`studentSlice`), Miễn giảm (`discountSlice`) và Học phí (`invoiceSlice`).
  2. Khi lập hóa đơn theo diện cá nhân (`scope === 'hoc_sinh'`), wizard lập hóa đơn cung cấp bộ lọc Lớp học giúp tìm kiếm nhanh học sinh; tự động nhận diện và hiển thị thông báo chính sách miễn giảm đang thụ hưởng.
  3. Minh chứng áp dụng thực tế: Đối với học sinh **Nguyễn Gia Huy (Lớp 10A1)** có 2 chính sách hợp lệ cho "Học phí chính khóa" (50% cá nhân tài năng vs 20% chính sách lớp), khi lập hóa đơn Học phí chính khóa (2.500.000 đ), hệ thống PHẢI áp dụng chính sách 50% (-1.250.000 đ), ghi nhận thẻ tag `[Đã áp dụng Học bổng tài năng học thuật 50%]` trên dòng khoản thu và đồng bộ tổng thu 1.250.000 đ kèm mã thanh toán VietQR.

### Phân hệ 4: Nhà Trường (School Administration)
- `FR-SCH-001` - `FR-SCH-005`: Quản lý danh bạ học sinh, hub chi tiết 360° (5 tab ngữ cảnh), nhập học mới, chuyển lớp / chuyển năm học (tuân thủ 3 nguyên tắc cascade: gán biểu phí mới, thu hồi chat cũ, bảo toàn điểm số), và ghi chú nội bộ.
- `FR-SCH-006` - `FR-SCH-008`: Quản lý danh bạ giáo viên, phân quyền kiểm duyệt 2 cấp (Giáo viên chính vs Giáo viên hỗ trợ), mời giáo viên nhận việc và đổi email đăng nhập.
- `FR-SCH-009` - `FR-SCH-012`: Quản lý lớp chính khóa và lớp ngoại khóa (chỉ bật điểm danh/hoạt động/ảnh), cấm xóa lớp nếu sĩ số $> 0$.
- `FR-SCH-013` - `FR-SCH-015`: Danh mục môn học 4 cấp học, phân công giáo viên bộ môn, và phân cấp khối lớp với tìm kiếm nhạy bén.
- `FR-SCH-016` - `FR-SCH-021`: Bảng thông tin lên lịch thông báo, xem trước giao diện mobile, và khảo sát bình chọn kèm biểu đồ kết quả.
- `FR-SCH-022` - `FR-SCH-025`: Thực đơn tuần (lưới hoặc file), tự động kế thừa thực đơn trường cho lớp thiếu thực đơn, và truy xuất nguồn gốc thực phẩm theo mã GTIN/lô.
- `FR-SCH-026` - `FR-SCH-028`: Điểm danh nhân viên 1 chạm, duyệt nghỉ phép bằng modal, và giới hạn xem/sửa công 45 ngày quá khứ.
- `FR-SCH-029` - `FR-SCH-030`: Sổ tay phụ huynh cấu trúc cây tri thức 2 cấp, soạn thảo bài viết và xuất bản.
- `FR-SCH-031` - `FR-SCH-036`: Hòm thư góp ý 8 lĩnh vực, 4 thẻ trạng thái giữ số liệu độc lập, luồng thảo luận 2 chiều và đóng phiếu góp ý.
- `FR-SCH-037` - `FR-SCH-040`: Lịch sự kiện 3 chế độ xem (Năm, Tháng, Danh sách), mã màu phân loại và tự động điền ngày kết thúc cho sự kiện 1 ngày.
- `FR-SCH-041` - `FR-SCH-044`: Quản lý niên khóa, tự động gắn huy hiệu `Hiện tại`, kiểm soát không chồng chéo ngày và khóa nút xóa niên khóa.
- `FR-SCH-045` - `FR-SCH-048`: Kho lưu trữ học sinh thôi học, banner cảnh báo vàng, tính năng phục hồi nguyên trạng và quy trình xóa vĩnh viễn 2 bước.

---

## 6. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

- `NFR-001 (Hiệu năng)`: Thời gian tải ban đầu danh sách điểm danh phải $< 800$ms ở mức tải phân vị 95. Phản hồi điểm danh 1 click phải cập nhật giao diện lạc quan (optimistic) trong vòng 100ms.
- `NFR-002 (Khả năng mở rộng & Đa trường)`: Cô lập tuyệt đối dữ liệu giữa các trường học thông qua tiền tố `{schoolCode}` trên đường dẫn trong một codebase duy nhất. Ngăn chặn triệt để rò rỉ dữ liệu chéo trường ở cả tầng Router và API Gateway.
- `NFR-003 (Bảo mật & Xác thực)`: Xác thực phiên bằng NextAuth.js mã hóa cookie JWE. Các lệnh gọi API backend phải mang Bearer Token Laravel Sanctum scoped theo từng tenant.
- `NFR-004 (Chuẩn thiết kế ECO Design System 1.0)`: Giao diện phải tuân thủ nghiêm ngặt token thiết kế: Vàng `#FEC020`, Xanh dương `#0070CE`, thang đo khoảng cách 4-64px, và font chữ chuẩn Google Fonts (`Inter`, `Be Vietnam Pro`).
- `NFR-005 (Giám sát & Đo lường)`: Tích hợp Sentry giám sát lỗi với tỷ lệ lấy mẫu trace ~10%. Theo dõi hành vi người dùng qua Google Analytics 4 và Microsoft Clarity.
- `NFR-006 (Toàn vẹn dữ liệu)`: Điểm danh và thanh toán hóa đơn phải đảm bảo tính lũy thừa (idempotency) và chống xung đột ghi đồng thời (race condition).

---

## 7. Tiêu Chí Nghiệm Thu Chi Tiết (Acceptance Criteria - AC)

- `AC-001`: Giáo viên chủ nhiệm nhấn "Đón" trên học sinh chưa điểm danh: lưu mốc thời gian, tăng đếm "Tham dự", gắn huy hiệu "Đến muộn" nếu qua giờ quy định.
- `AC-002`: Học sinh đón lúc 08:15, giáo viên nhập trả 08:10: hiện toast lỗi `Giờ trả học sinh phải lớn hơn giờ đón học sinh` và không lưu.
- `AC-003`: Học sinh chưa có giờ đón, giáo viên nhấn "Trả" nhanh: hiện cảnh báo inline `Chưa nhập thời gian đón học sinh.` và chặn gửi.
- `AC-004`: Nhấn nút bánh răng bên cạnh Trả: mở modal chọn người đón hộ trong danh sách giám hộ hợp lệ, lưu được kể cả khi chưa có giờ đón trước đó.
- `AC-005`: Chọn nhiều học sinh rồi nhấn "Vắng": modal bắt buộc chọn Có phép / Không phép và cờ Hoàn tiền trước khi lưu.
- `AC-005b`: Chọn nhiều học sinh nhấn "Đón hàng loạt" hoặc "Trả hàng loạt": modal xác nhận cho phép tinh chỉnh mốc thời gian (-15p, -5p, Hiện tại, +5p, +15p) trước khi áp dụng.
- `AC-005c`: Ô nhập thân nhiệt chỉ nhận số, không có nút tăng giảm hay biểu tượng độ C; trong modal xác nhận hàng loạt, mỗi thẻ học sinh có nút `[x]` để loại trừ em đó ra trước khi duyệt.
- `AC-006`: Soạn bài hoạt động gõ `@`: popup gợi ý tên học sinh; chọn xong tên học sinh hiển thị dạng pill màu xanh nổi bật; thẻ bài đăng hiển thị lượt xem và lượt thích, lược bỏ icon bình luận/chia sẻ lỗi thời.
- `AC-006b`: Bảng tin hoạt động cô lập bài chưa duyệt vào tab "Chờ duyệt"; chỉ được ghim tối đa 1 bài viết tại một thời điểm (yêu cầu xác nhận gỡ bài cũ trước khi ghim bài mới).
- `AC-007`: Tải lên album 20 ảnh: AI nhận diện khuôn mặt tự động gắn khung nhận diện và liên kết vào hồ sơ học sinh tương ứng.
- `AC-007b`: Album ảnh tuân thủ tỷ lệ chuẩn 16:9; xóa album phải có modal xác nhận; chọn nhiều ảnh xuất hiện thanh công cụ nổi có nút `[Xóa ảnh]` bên cạnh `Tải xuống ZIP`.
- `AC-008`: Lập hóa đơn học phí tháng cho lớp: hệ thống tự động trừ tiền ăn tương ứng với số ngày nghỉ có phép của tháng trước.
- `AC-009`: Phụ huynh quét mã VietQR thanh toán thành công: hóa đơn tự động chuyển sang trạng thái "Đã hoàn thành" và ghi nhận lịch sử thanh toán.
- `AC-010`: Phân hệ đối soát: đối chiếu phiên ngân hàng với hóa đơn trường, làm nổi bật các giao dịch khớp và giao dịch chênh lệch.
- `AC-011`: Thanh menu bên trái (Sidebar) và vùng nội dung chính cuộn độc lập, không bị giật trang; thông tin "Niên khóa - Học kỳ" được ghim cố định ở đáy sidebar.
- `AC-012`: Phân hệ Trao đổi: danh sách hội thoại cuộn độc lập; hỗ trợ khóa phụ huynh gửi tin nhắn và lưu trữ hội thoại; tin nhắn ghim tối đa 3 tin (có modal giải quyết xung đột gỡ tin cũ).
- `AC-013` & `AC-014`: Báo cáo điểm danh (tab Học sinh và Nhân viên) hiển thị 2 dòng mỗi người (Sáng và Chiều), các cột ngày xếp dưới tiêu đề tháng; tổng kết công/vắng/muộn được nhúng trực tiếp trong khung cố định tên người ở đầu dòng; lược bỏ các cột tổng kết thừa ở cuối bảng.
- `AC-015`: Phân hệ Thời khóa biểu: danh sách tối đa 10 dòng/trang kèm phân trang; menu `•••` cung cấp đủ 5 hành động (`Xem chi tiết`, `Chỉnh sửa`, `Gửi phụ huynh`, `Tải xuống`, `Xóa`); nút "Gửi phụ huynh" có modal xác nhận trước khi phát thông báo.
- `AC-016`: Tiêu chuẩn hóa chữ viết hoa tiêu đề bảng (Sentence case) trên toàn bộ hệ thống; menu thao tác `•••` ở các dòng cuối bảng luôn nổi lên lớp trên cùng (`z-index: 9999`) và tự động bật lên trên (`upward flip`) tránh bị che khuất.
- `AC-017`: Báo cáo mở rộng chuyển đổi các nút hành động thành menu `•••` đồng bộ với Thời khóa biểu.
- `AC-018`: Khung soạn tin nhắn Trao đổi lược bỏ các nút B, I, U; chỉ giữ lại nút đính kèm tệp (`📎`) và chọn biểu tượng cảm xúc (`😊`).
- `AC-019`: Thời khóa biểu ma trận khởi tạo với 1 tiết đầu tiên; nhấn `[+]` để thêm tiết linh hoạt; các cột Thứ 2 đến Thứ 7 để trống chờ nhập; loại bỏ hoàn toàn dòng "Ra chơi & uống sữa".
- `AC-020`: Chuẩn hóa cột "Thao tác" trên mọi bảng dữ liệu (Bài tập, Học phí, Khoản phí, Quản lý học phí, Khoản chi, Đối soát, Thư viện...) sử dụng duy nhất nút 3 chấm `•••`.
- `AC-021`: Học phí: bộ lọc thời gian có tiền tố `"Lọc theo:"` chọn giữa `Thời gian tạo HĐ` và `Hạn đóng HĐ`; xác nhận thanh toán thủ công (`ManualPaymentModal`) chỉ có đúng 1 tùy chọn là `Tiền mặt` (các phương thức thanh toán điện tử như QR ECOPay, Ví Finviet được xử lý tự động qua cổng thanh toán/đối soát) kèm toast thông báo; chi tiết hóa đơn hiển thị rõ huy hiệu "Đã thanh toán" (xanh) hoặc "Chưa thanh toán" (đỏ) dưới từng dòng tiền.
- `AC-022`: Mọi thao tác thay đổi logic cấu hình (bật/tắt Xuất HĐĐT, xóa dữ liệu...) PHẢI có modal popup xác nhận trước khi thực hiện; phản hồi kết quả luôn dùng thông báo Toast góc trên bên phải (`addToast`).
- `AC-023`: Bảng Quản lý học phí tinh gọn từ 9 xuống 6 cột; cột "Các khoản phí" hiển thị số lượng khoản thu kèm icon con mắt; nhấn vào mở modal bảng đúng 3 cột: `Tên khoản phí`, `Số tiền`, `Xuất HĐĐT`.
- `AC-024`: Danh bạ học sinh hiển thị ảnh đại diện, mã, lớp, trạng thái; icon văn bản (📄) xuất hiện khi có ghi chú nội bộ; hub 360° gồm 5 tab chi tiết; modal chuyển lớp và chuyển năm học ràng buộc chọn lớp và xác nhận 3 nguyên tắc cascade.
- `AC-025`: Danh bạ giáo viên phân tách lớp chủ nhiệm và lớp phụ trách; hiển thị rõ phân quyền kiểm duyệt (Giáo viên chính vs Giáo viên hỗ trợ); đổi email qua modal riêng và tạo giáo viên qua luồng gửi lời mời.
- `AC-026`: Phân loại Lớp chính khóa và Lớp ngoại khóa (chỉ bật điểm danh/hoạt động/ảnh); cấm xóa lớp nếu sĩ số học sinh lớn hơn 0.
- `AC-027`: Danh mục môn học phân chia theo 4 cấp học; chi tiết môn hiển thị ma trận đánh giá 4 kỳ; gán giáo viên tự động lọc bỏ giáo viên đã phụ trách.
- `AC-028`: Cây khối lớp theo 4 cấp học; tìm kiếm thực thi ngay trên client và tự phục hồi danh sách đầy đủ khi xóa từ khóa.
- `AC-029`: Bảng thông tin có xem trước giao diện mobile; xóa hàng loạt cảnh báo rõ email đã gửi không thể thu hồi.
- `AC-030`: Khảo sát bình chọn phân tách giữa soạn nháp và gửi bình chọn; biểu đồ tròn tự động vẽ khi có lượt bình chọn; có lịch sử sửa đổi phiếu bầu.
- `AC-031`: Thực đơn tuần hỗ trợ lập trước 8 tuần; lớp không có thực đơn riêng tự động kế thừa thực đơn toàn trường; hỗ trợ quét mã GTIN/lô kiểm tra nguồn gốc thực phẩm.
- `AC-032`: Điểm danh nhân viên 1 chạm không cần modal xác nhận; báo vắng nhân viên bắt buộc qua modal; khóa chọn ngày tương lai và giới hạn xem 45 ngày quá khứ.
- `AC-033`: Sổ tay phụ huynh giới hạn đúng 2 cấp danh mục (Danh mục gốc $\rightarrow$ Danh mục con $\rightarrow$ Bài viết); xóa danh mục cảnh báo xóa toàn bộ bài viết con.
- `AC-034`: Hòm thư góp ý: nhấn vào 4 thẻ trạng thái sẽ lọc danh sách tương ứng nhưng số lượng trên cả 4 thẻ vẫn giữ nguyên số liệu toàn cục độc lập (`K012`).
- `AC-035`: Chi tiết phiếu góp ý tách riêng luồng thảo luận 2 chiều; đóng góp ý chuyển trạng thái sang Hoàn tất kèm thông báo toast.
- `AC-036` & `AC-037`: Lịch sự kiện đồng bộ 3 chế độ xem (Năm, Tháng, Danh sách); có mã màu theo loại sự kiện; tự động điền ngày kết thúc trùng ngày bắt đầu cho sự kiện 1 ngày (`K014`).
- `AC-038`: Niên khóa tự động gắn huy hiệu xanh `Hiện tại` cho năm học chứa ngày hệ thống; chặn khoảng ngày chồng lấn và khóa nút xóa niên khóa trên UI.
- `AC-039` & `AC-040`: Kho lưu trữ học sinh thôi học có banner vàng cảnh báo; hỗ trợ sắp xếp A-Z; phục hồi học sinh có kiểm tra lớp cũ; xóa vĩnh viễn bắt buộc qua modal cảnh báo đỏ 2 bước.
- `AC-041`: Truy cập `/school/discount` hiển thị bảng danh sách chính sách miễn giảm đầy đủ các cột thông tin; chính sách quá hạn tự động chuyển trạng thái `Hết hạn` (`K017`); hỗ trợ nút Tạm dừng và Kích hoạt lại.
- `AC-042`: Form tạo/sửa chính sách miễn giảm kiểm tra hợp lệ: Tên ($\ge 3$ ký tự), Khoản thu áp dụng, Loại miễn giảm (% hoặc VNĐ), Nhóm áp dụng (Lớp học hoặc Học sinh), Thời gian áp dụng, và Lý do miễn giảm.
- `AC-043`: Miễn Giảm (Động cơ giải quyết xung đột & Tự động áp dụng mức cao nhất):
  1. Khi một học sinh thỏa mãn đồng thời từ 2 chương trình miễn giảm hợp lệ trở lên cho cùng một khoản thu (ví dụ: học sinh A đã có chương trình X áp dụng cho cả lớp, và sau đó được thiết lập thêm chương trình Y cho riêng cá nhân):
     - Hệ thống PHẢI tự động tính toán số tiền giảm trừ thực tế của tất cả các chương trình ứng cử viên và **tự động áp dụng chương trình có giá trị giảm trừ cao nhất (`Math.max`)** khi lập hóa đơn thu phí.
     - Nếu chương trình cá nhân Y có giá trị ưu đãi cao hơn chương trình lớp X (ví dụ 50% > 20%), hệ thống tự động áp dụng chương trình Y (50%).
     - Nếu chương trình lớp X có giá trị cao hơn chương trình cá nhân Y (ví dụ 30% > 10%), hệ thống tự động giữ chương trình X (30%) để bảo đảm không làm suy giảm quyền lợi của học sinh.
     - Trong trường hợp giá trị giảm trừ ngang bằng nhau, chính sách dành riêng cho cá nhân học sinh được ưu tiên áp dụng làm tie-breaker.
  2. Trong hộp thoại tạo/sửa chính sách (`CreateDiscountPolicyModal`), khi chọn học sinh đã có chính sách hiệu lực trên khoản thu tương ứng, hệ thống PHẢI hiển thị banner cảnh báo nêu rõ: tên chính sách hiện tại, mức giảm hiện tại vs mức giảm mới, và khẳng định hệ thống sẽ tự động áp dụng mức cao nhất khi lập hóa đơn.
  3. Các khoản thu độc lập (ví dụ học phí và tiền ăn) được áp dụng giảm trừ song song không ảnh hưởng lẫn nhau. Tổng mức giảm của từng khoản thu được chặn tối đa bằng 100% đơn giá gốc của khoản thu đó.
- `AC-044`: Trong quy trình tạo hóa đơn (`/school/fee/create`), có công tắc "Tự động áp dụng chính sách miễn giảm" mặc định BẬT; khi bật sẽ tính toán và hiển thị các dòng giảm trừ chi tiết; khi tắt sẽ giữ nguyên mức thu gốc của trường.
- `AC-045`: Sửa hoặc tạm dừng chính sách chỉ tác động lên các đợt tạo hóa đơn tương lai; các hóa đơn đã tạo, đã gửi hoặc đã thanh toán trước đây được bảo toàn nguyên vẹn (`K017`); hỗ trợ nút "Xuất Excel" tải về file bảng tính đầy đủ danh sách và học sinh thụ hưởng.
- `AC-046 (Liên thông Miễn giảm & Học phí đồng bộ dữ liệu Học sinh)`: Toàn bộ danh mục học sinh và lớp học (bao gồm Khối 10 như Lớp 10A1 - Nguyễn Gia Huy) đồng nhất 100% giữa phân hệ Học sinh, Miễn giảm và Học phí. Khi tạo hóa đơn cho học sinh có 2 chính sách hợp lệ cùng lúc (50% cá nhân và 20% cả lớp), hệ thống bắt buộc tự động áp dụng mức cao nhất là 50% (-1.250.000 đ trên mức học phí gốc 2.500.000 đ), ghi nhận thẻ tag chương trình trên dòng khoản thu, tính tổng còn lại 1.250.000 đ và đồng bộ mã VietQR.
- `AC-047 (Quy trình chọn chương trình miễn giảm và tính thành tiền khi lập hóa đơn)`:
  - Tại Phần 1 ("Phạm vi áp dụng hóa đơn"), tinh gọn giao diện và loại bỏ chuỗi text thông báo thừa về tự động nhận diện chính sách.
  - Tại Phần 3 ("Chi tiết các dòng khoản thu"), dòng "Học phí" tự động nhận diện học sinh và hiển thị 50% trong ô "Giảm trừ %". Bên cạnh ô giá trị có icon cây bút `[faEdit]` mở pop-up `SelectDiscountProgramModal` liệt kê mọi chương trình miễn giảm hợp lệ hiện hành của học sinh. Mặc định áp dụng chương trình cao nhất (50%), đồng thời cho phép chọn chương trình khác (20%) hoặc không áp dụng (0%). Cột "Thành tiền" tự động tính toán lại tức thì: 1.250.000 đ (nếu 50%), 2.000.000 đ (nếu 20%), hoặc 2.500.000 đ (nếu 0%).
- `AC-048 (Trải nghiệm nhận diện miễn giảm và bộ lọc trong phân hệ Học Sinh)`:
  - Trong bảng danh sách học sinh (`StudentTable`), không hiển thị nhãn số phần trăm `[-50%]` hay `[-20%]`, chỉ hiển thị duy nhất một icon thẻ miễn giảm (`faTag`) màu xanh ngọc bên cạnh tên học sinh để biểu thị học sinh đang được áp dụng ít nhất một chương trình miễn giảm hợp lệ cho ít nhất một loại khoản thu.
  - Trên thanh công cụ (`StudentToolbar`), bổ sung trường lọc "Áp dụng miễn giảm" với lựa chọn mặc định là "Tất cả" (`all`), và các tùy chọn "Có miễn giảm" (`co_mien_giam`) và "Không miễn giảm" (`khong_mien_giam`). Bất kỳ học sinh nào có icon miễn giảm sẽ xuất hiện khi chọn "Có miễn giảm", và bị ẩn khi chọn "Không miễn giảm".
  - Trong trang xem chi tiết hồ sơ học sinh (`StudentDetailHub`), bổ sung khu vực "Miễn giảm" dạng bảng (`table`) liệt kê toàn bộ các chương trình miễn giảm đang có hiệu lực đối với học sinh đó (Mã & Tên chương trình, Khoản thu áp dụng, Mức miễn giảm, Phạm vi áp dụng Cá nhân/Theo lớp, Thời gian hiệu lực, Lý do/Căn cứ, Trạng thái), kèm thông báo quy tắc tự động áp dụng mức ưu đãi cao nhất khi có từ 2 chương trình cùng áp dụng cho một khoản thu.


---

## 8. Phạm Vi Ngoài Dự Án (Out-of-Scope - Giai Đoạn 1)

- Đồng bộ dữ liệu tự động hai chiều với Cơ sở dữ liệu ngành của Sở GD&ĐT ("CSDL Sở").
- Mã nguồn ứng dụng di động phía phụ huynh (phụ huynh dùng ứng dụng di động hiện có; PRD này quy định cổng web điều hành cho nhà trường).
- Tích hợp thiết bị định vị GPS tự động trên xe đưa đón học sinh (điểm danh xe đưa đón trong giai đoạn 1 dựa trên xác nhận thủ công của giáo viên phụ trách).
- Hệ thống chấm công tính lương chuyên sâu và bảo hiểm xã hội (sẽ thuộc phân hệ HR/Payroll phát triển ở giai đoạn sau).

---

## 9. Sổ Đăng Ký Rủi Ro & Giả Định (Risk Ledger)

| Mã Rủi Ro | Mô Tả | Mức Độ | Biện Pháp Giảm Thiểu |
|---|---|---|---|
| **R-001** | Độ trễ cao khi nhận diện khuôn mặt hàng loạt ảnh lớp tải lên | Cao | Đẩy tác vụ nhận diện sang tiến trình nền không đồng bộ (asynchronous worker) trên Cloud Run; hiển thị thanh tiến độ trên giao diện web. |
| **R-002** | Xung đột ghi đồng thời khi nhiều giáo viên cùng điểm danh đón/trả trẻ vào giờ cao điểm | Trung bình | Áp dụng cập nhật giao diện lạc quan (optimistic UI) kết hợp khóa giao dịch cơ sở dữ liệu (atomic transaction) ở tầng backend. |
| **R-003** | Khác biệt giữa phương thức hoàn tiền ăn bán trú (trừ vào hóa đơn tháng sau hay hoàn tiền mặt) | Trung bình | Mặc định tự động trừ vào dòng tiền ăn của hóa đơn kỳ tiếp theo; cung cấp tùy chọn lập phiếu chi tiền mặt trực tiếp cho kế toán nếu phụ huynh yêu cầu. |
