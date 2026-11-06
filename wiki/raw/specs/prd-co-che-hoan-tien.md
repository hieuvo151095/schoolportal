# Tài Liệu Yêu Cầu Sản Phẩm (PRD) — Cơ Chế Hoàn Tiền Khi Nghỉ Học & Khấu Trừ Kỳ Hóa Đơn Tiếp Theo (M+1)

> **Dự án:** Cổng Vận Hành Trường Học (School Operating Portal — Finviet / SOHA)  
> **Phân hệ trung tâm:** Cấu Hình — Học Phí (`/setting/fee`) — Section *2. Thiết lập cơ chế hoàn tiền khi nghỉ học*  
> **Phân hệ nền tảng:**  
> 1. Tài Chính — Danh Mục Khoản Phí (`/school/school-fees`) *(Master Fee Catalog Foundation)*  
> 2. Tài Chính — Quản Lý Học Phí & Biểu Phí Lớp (`/school/tuition-management`) *(Class Fee Schedule Matrix)*  
> 3. Nhà Trường — Hồ Sơ Học Sinh & Thông Tin Học Phí (`/school/kid/detail/[id]`) *(Student Fee Profile & Dedicated Pop-up Modal)*  
> **Phân hệ liên thông:**  
> 1. Vận Hành — Điểm Danh Lớp Học (`/class/[classId]/attendance`)  
> 2. Vận Hành — Trao Đổi & Đơn Báo Vắng (`/conversations`)  
> 3. Tài Chính — Lập & Quản Lý Hóa Đơn (`/school/fee`)  
> **Phiên bản:** 2.0 (Bản Cập Nhật Toàn Diện — Tích Hợp Biểu Phí Học Sinh & Quy Tắc 3 Trường Hợp Hoàn Tiền Ăn Sáng)  
> **Ngày cập nhật:** 2026-11-03  
> **Tác giả:** hieu.vo1@finviet.com.vn  
> **Trạng thái:** Đã triển khai & Nghiệm thu hoàn tất 100% (Execution-Ready & Production-Verified, Pass 702/702 Tests)

---

## Lịch Sử Thay Đổi Tài Liệu (Revision History)

| Phiên bản | Ngày | Mục cập nhật | Nội dung chi tiết | Người thực hiện |
|---|---|---|---|---|
| **1.0** | 2026-09-29 | Khởi tạo tài liệu | Đặc tả ban đầu cơ chế hoàn tiền ăn khi báo vắng trước giờ cắt quy định (`Cut-off Time`). | hieu.vo1@finviet.com.vn |
| **1.1** | 2026-10-01 | Hoàn tiền đa khoản | Bổ sung Master Fee Catalog làm cội nguồn khởi tạo, mở rộng hoàn tiền theo ngày (Tiền ăn, Xe đưa đón 2A8). | hieu.vo1@finviet.com.vn |
| **1.2** | 2026-10-07 | Chuẩn hóa văn phong & Widget mô phỏng | Chuẩn hóa cú pháp hiển thị trên hóa đơn `"X ngày nghỉ có phép" / "Y ngày nghỉ không phép"`, nâng cấp widget mô phỏng 3 cột với công thức 2 dòng và tính phản ứng tức thì (reactivity). | hieu.vo1@finviet.com.vn |
| **2.0** | 2026-11-03 | Tích hợp biểu phí học sinh & Quy tắc hoàn tiền ăn sáng | **Đột phá phiên bản 2.0:**<br>1. Thiết lập biểu phí chi tiết cho từng học sinh (`StudentFeeItem`) kế thừa từ biểu phí lớp và danh mục Khoản phí.<br>2. Ban hành **Quy tắc 3 Trường hợp hoàn tiền ăn sáng** (`BR06`): Case 1 (Học sinh đóng tiền + Trường cấu hình $\rightarrow$ Hoàn), Case 2 (Học sinh đóng tiền + Trường KHÔNG cấu hình $\rightarrow$ Không hoàn), Case 3 (Học sinh KHÔNG đóng tiền $\rightarrow$ Chắc chắn không hoàn).<br>3. Chuyển đổi màn hình chỉnh sửa học phí học sinh thành **Pop-up Modal trực tiếp (`EditStudentFeeModal`)** khi click cây bút chì, loại bỏ chuyển trang.<br>4. Hiển thị **Contextual Insight Banner** tự động phân tích tính hợp lệ hoàn tiền ăn sáng trên Hồ sơ học sinh và trong Pop-up.<br>5. Động cơ lập hóa đơn kỳ $M+1$ bóc tách 2 dòng khấu trừ độc lập (Tiền ăn trưa và Tiền ăn sáng).<br>6. 702/702 kịch bản kiểm thử tự động vượt qua xuất sắc. | hieu.vo1@finviet.com.vn |

---

## 1. Tổng Quan & Bối Cảnh Nghiệp Vụ

### 1.1 Bối cảnh thực tế tại các trường học Việt Nam
Tại các cơ sở giáo dục mầm non, tiểu học và phổ thông liên cấp (K-12) tại Việt Nam, phụ huynh học sinh thường đóng trước các khoản phí sinh hoạt đầu tháng theo hình thức dự thu trọn gói (Học phí chính khóa, Tiền ăn cơ bản / bán trú trưa, Tiền ăn sáng, Nước uống, Xe đưa đón theo ngày, Ngoại khóa...).

Trong thực tế vận hành tháng học, học sinh phát sinh các ngày không sử dụng dịch vụ tại trường:
- **Ngày học sinh tự nghỉ cá nhân:** Nghỉ ốm đau, việc gia đình, đi du lịch... có gửi đơn xin phép đúng hạn hoặc tự ý nghỉ không báo trước.
- **Tính chất phân hóa dịch vụ ăn uống:** Không phải mọi học sinh đều đăng ký sử dụng dịch vụ ăn sáng tại trường. Có học sinh ăn sáng tại nhà và chỉ ăn trưa bán trú tại trường; có học sinh đăng ký trọn gói cả ăn sáng và ăn trưa; có trường tổ chức bếp ăn sáng nhưng có trường không phục vụ ăn sáng.

Trước khi hệ thống hoàn thiện, việc đối soát và hoàn tiền phát sinh nhiều bất cập nghiêm trọng:
- **Xung đột chính sách ăn sáng:** Kế toán hoàn tiền ăn đồng loạt theo một mức chung, dẫn đến trường hợp học sinh không hề đóng tiền ăn sáng đầu tháng vẫn được hoàn tiền ăn sáng, gây thất thoát ngân sách nhà trường; hoặc ngược lại, học sinh có đóng tiền ăn sáng nhưng trường chưa kích hoạt chính sách hoàn tiền ăn sáng gây bức xúc cho phụ huynh.
- **Rời rạc giữa Biểu phí học sinh và Động cơ hoàn tiền:** Danh sách khoản phí của từng học sinh không được quản lý tập trung và trực quan, mỗi lần muốn xem hoặc sửa khoản phí cho học sinh kế toán phải rời khỏi trang chi tiết học sinh sang một màn hình khác.
- **Thiếu giải thích minh bạch:** Phụ huynh và giáo viên không biết rõ tại sao con mình được hoàn hoặc không được hoàn tiền ăn sáng trong thông báo học phí.

### 1.2 Nguyên tắc nền tảng: Phân hệ "Khoản phí" (`/school/school-fees`) & "Quản lý học phí" (`/school/tuition-management`)
> [!IMPORTANT]
> **Nền Tảng Cốt Lõi (Master Fee Catalog & Class Schedule Foundation):**  
> 1. Sub-module **"Khoản phí" (`/school/school-fees`)** là danh mục gốc toàn trường, định nghĩa tên khoản thu, mã định danh (`code`), đơn vị tính (`unit`) và tính chất bắt buộc/tùy chọn.  
> 2. Sub-module **"Quản lý học phí" (`/school/tuition-management`)** cấu hình ma trận biểu phí áp dụng cho từng lớp học cụ thể.  
> 3. Danh sách khoản phí của từng học sinh (`StudentFeeItem`) được lấy từ danh sách khoản phí của lớp học mà học sinh đó theo học, kết hợp với các tùy chọn dịch vụ riêng biệt (Ăn sáng, Năng khiếu, Xe đưa đón).

### 1.3 Mục tiêu trọng tâm của phân hệ "Thiết lập cơ chế hoàn tiền khi nghỉ học"
Xây dựng một động cơ cấu hình và khấu trừ tài chính khép kín, minh bạch và tự động hóa 100%:
1. **Cấu hình tập trung tại `/setting/fee`:** Cho phép nhà trường thiết lập rõ ràng tỷ lệ % hoàn tiền theo từng diện nghỉ (Nghỉ có phép, Nghỉ không phép), phân định rõ Bữa chính (trưa/bán trú) và Bữa sáng, cùng các khoản phí dịch vụ theo ngày khác.
2. **Thiết lập mốc giờ giới hạn báo trước (`Cut-off Time`):** Xác định ranh giới phụ huynh báo vắng đúng giờ để nhà bếp kịp điều chỉnh suất ăn (mặc định trước 07:30 sáng).
3. **Quy tắc thứ bậc chân lý thực tế (`Ground-Truth Precedence`):** Điểm danh thực tế của Giáo viên tại lớp luôn có giá trị cao hơn Đơn báo vắng của phụ huynh (`Teacher Check-in > Parent Leave Request`).
4. **Quy tắc 3 Trường hợp hoàn tiền ăn sáng:** Xác định chính xác học sinh có đóng phí ăn sáng hay không kết hợp với cấu hình của trường để tính toán hoặc không tính toán hoàn tiền ăn sáng.
5. **Cửa sổ Pop-up chỉnh sửa học phí học sinh ngay tại chỗ:** Bấm biểu tượng cây bút chì mở `EditStudentFeeModal` với bộ chọn `Dropdown` tìm kiếm tiếng Việt và Insight Banner thông minh.
6. **Tự động khấu trừ đa khoản vào hóa đơn kỳ tiếp theo ($M+1$):** Số tiền hoàn của tháng $M$ tự động trừ vào hóa đơn thu phí tháng $M+1$, thể hiện bóc tách minh bạch từng dòng (Tiền ăn trưa, Tiền ăn sáng) kèm số ngày nghỉ trên thông báo học phí gửi phụ huynh và mã thanh toán VietQR động.

---

## 2. Kiến Trúc Liên Thông 6 Điểm (6-Node Financial & Operational Topology)

Cơ chế hoàn tiền khi nghỉ học là điểm hội tụ của 6 mắt xích trong hệ thống:

```
┌────────────────────────────────────────────────────────────────────────┐
│               0. MASTER FEE CATALOG (NỀN TẢNG CỐT LÕI)                 │
│                       (/school/school-fees)                            │
│ • Định nghĩa danh mục khoản thu: Học phí, Tiền ăn, Ăn sáng, Đưa đón... │
│ • Đơn vị tính: "ngày", "tháng", "năm", "lần"...                        │
│ • Cờ đánh dấu xuất HĐĐT (Viettel sInvoice)                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Kế thừa danh mục
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            1. QUẢN LÝ HỌC PHÍ LỚP (CLASS FEE MATRIX)                   │
│                   (/school/tuition-management)                         │
│ • Biểu phí chuẩn cho từng lớp học (10A1, 11A1...)                      │
│ • Khoản bắt buộc (Học phí, Tiền ăn) & Khoản tùy chọn (Ăn sáng, Bus)    │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    │ Cung cấp danh mục lớp          │ Cung cấp phí theo ngày
                    ▼                                ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────────────┐
│ 2. HỒ SƠ HỌC PHÍ TỪNG TRẺ            │   │ 3. CẤU HÌNH CƠ CHẾ HOÀN TIỀN        │
│    (/school/kid/detail/[id])         │   │    (/setting/fee - Section 2)       │
│ • Thông tin học phí học sinh         │   │ • Toggle Bật/Tắt Cơ chế hoàn tiền   │
│ • Khoản bắt buộc + Khoản khác        │   │ • Tỷ lệ hoàn có phép / không phép   │
│ • Nhận diện học sinh có trả "Ăn sáng"│   │ • Bữa chính (%) & Bữa sáng (%)      │
│ • Pop-up Modal sửa học phí trực tiếp │   │ • Cut-off Time báo trước (07:30)    │
│ • Contextual Insight Banner 3 Case   │   │ • Danh mục khoản hoàn tiền theo ngày│
└───────────────────┬──────────────────┘   └──────────────────┬──────────────────┘
                    │                                         │
                    │               ┌─────────────────────────┘
                    │               │ Ban hành quy tắc hoàn tiền
                    │               ▼
                    │      ┌──────────────────┐      ┌──────────────────┐
                    │      │ 4. ĐƠN BÁO VẮNG  │      │   5. ĐIỂM DANH   │
                    │      │ (/conversations) │  VS  │ (/class/.../att) │
                    │      │• PH gửi đơn vắng │      │• GV Check-in/Out │
                    │      │• So với Cut-off  │      │• Chân lý cao nhất│
                    │      └────────┬─────────┘      └────────┬─────────┘
                    │               │                         │
                    │               └────────────┬────────────┘
                    │                            │ Đối soát ngày vắng thực tế
                    ▼                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    6. ĐỘNG CƠ HÓA ĐƠN KỲ M+1                           │
│                          (/school/fee)                                 │
│ • Quét đối soát ngày vắng tháng M                                      │
│ • Đánh giá 3 Case hoàn tiền ăn sáng (`evaluateStudentBreakfastRefund`) │
│ • Tính toán số tiền hoàn bóc tách: Tiền ăn trưa + Tiền ăn sáng + Khác  │
│ • Hiển thị huy hiệu `Hoàn tiền: -X đ` & Banner xanh chi tiết           │
│ • Khấu trừ tổng thu hóa đơn tháng M+1 & Cập nhật mã VietQR             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Câu Chuyện Người Dùng (User Stories)

- **US-REF-00 (Nền tảng danh mục khoản phí):** Là kế toán, tôi muốn sub-module "Khoản phí" (`/school/school-fees`) và "Quản lý học phí" (`/school/tuition-management`) là nơi thiết lập biểu phí chuẩn cho từng lớp học, để mỗi học sinh khi vào lớp tự động được thừa hưởng danh sách khoản phí chính xác.
- **US-REF-01 (Cấu hình chính sách hoàn tiền ăn & ăn sáng):** Là Hiệu trưởng hoặc Kế toán trưởng, tôi muốn truy cập màn hình Cấu hình Học phí (`/setting/fee`) để thiết lập tỷ lệ hoàn tiền ăn (Bữa chính trưa/bán trú, Bữa sáng) và các khoản phí theo ngày cho học sinh tự nghỉ (theo % riêng cho diện Có phép và Không phép), để chính sách tài chính của trường minh bạch ngay từ đầu năm học.
- **US-REF-02 (Quy định mốc giờ cắt báo trước):** Là Kế toán hoặc Quản lý bếp ăn, tôi muốn thiết lập mốc giờ giới hạn phụ huynh phải gửi đơn báo vắng (mặc định trước 07:30 sáng), để nhà bếp kịp điều chỉnh định lượng thực phẩm tươi sống với nhà cung cấp.
- **US-REF-03 (Ưu tiên điểm danh của giáo viên):** Là Kế toán, khi phụ huynh đã gửi đơn báo vắng nhưng sau đó học sinh vẫn đến trường và được giáo viên điểm danh "Có mặt" (Check-in), tôi muốn hệ thống tự động ưu tiên dữ liệu của giáo viên để tính học sinh đi học bình thường và KHÔNG khấu trừ hoàn tiền ngày đó, tránh việc trường bị thất thoát chi phí nấu ăn.
- **US-REF-04 (Mở rộng khoản phí hoàn tiền theo ngày từ Master Catalog):** Là Kế toán, ngoài tiền ăn, tôi muốn có thể thêm bất kỳ khoản phí nào có đơn vị tính là `ngày` trong Master Catalog (như Phí đưa đón 2A8, Nước uống theo ngày, Sữa học đường) vào danh mục hoàn tiền khi nghỉ học, để linh hoạt theo mô hình dịch vụ của trường.
- **US-REF-05 (Mô phỏng tính toán trực quan 3 cột với công thức 2 dòng):** Là Kế toán, trên giao diện cấu hình, tôi muốn có widget mô phỏng hiển thị 3 cột: "Nghỉ có phép (3 ngày)", "Nghỉ không phép (2 ngày)", và "Tổng hoàn giảm trừ hóa đơn tháng sau". Mỗi khoản phí hiển thị 2 dòng (Tên khoản phí ở dòng trên, công thức ở dòng dưới) với tính năng phản ứng tức thì khi chỉnh % vắng không phép.
- **US-REF-06 (Quy tắc 3 Trường hợp hoàn tiền ăn sáng):** Là Kế toán, tôi muốn hệ thống tự động đối chiếu xem học sinh có đóng tiền ăn sáng và nhà trường có bật cấu hình hoàn tiền ăn sáng hay không để quyết định hoàn hay không hoàn tiền ăn sáng, đảm bảo tính công bằng và chính xác tuyệt đối.
- **US-REF-07 (Pop-up chỉnh sửa học phí học sinh ngay trên màn hình chi tiết):** Là Kế toán hoặc Giáo viên, khi xem hồ sơ học sinh (`/school/kid/detail/[id]`), tôi muốn click biểu tượng cây bút chì tại khối "Thông tin học phí" để mở trực tiếp Pop-up Modal chỉnh sửa các khoản thu (thêm/xóa khoản Ăn sáng, Ngoại khóa...) mà không bị chuyển trang.
- **US-REF-08 (Insight Banner ngữ cảnh trực tiếp):** Là Kế toán hoặc Giáo viên, tôi muốn nhìn thấy ngay một thông báo ngữ cảnh (Insight Banner) giải thích rõ ràng tại sao học sinh này được hoàn hoặc không được hoàn tiền ăn sáng theo 3 Case để giải thích nhanh chóng cho phụ huynh khi có thắc mắc.
- **US-REF-09 (Tự động khấu trừ đa khoản bóc tách vào hóa đơn kỳ M+1):** Là Kế toán, khi tạo hóa đơn học phí tháng mới (ví dụ Tháng 10), tôi muốn hệ thống tự động đối soát tháng 9, tự động tính tổng tiền hoàn cho tất cả các khoản phí đủ điều kiện (bóc tách rõ Tiền ăn trưa và Tiền ăn sáng), hiển thị huy hiệu xanh lá `Hoàn tiền: -X đ` trên từng dòng khoản thu và khấu trừ vào tổng hóa đơn.
- **US-REF-10 (Chuẩn hóa văn phong minh bạch cho Phụ huynh):** Là Phụ huynh học sinh, khi xem thông báo học phí tháng mới, tôi muốn nhìn thấy rõ từng dòng phân định rành mạch: *"3 ngày nghỉ có phép [50%]: -60.000 đ"* và *"3 ngày nghỉ có phép ăn sáng [70%]: -42.000 đ"*, giúp tôi hoàn toàn an tâm và tin tưởng vào tính công bằng của nhà trường.

---

## 4. Các Quy Tắc Nghiệp Vụ Cốt Lõi (Core Business Rules)

### BR01: Phạm Vi Áp Dụng Hoàn Tiền — Ngày Học Sinh Tự Nghỉ
Cơ chế hoàn tiền khi nghỉ học được giới hạn áp dụng **duy nhất cho Ngày học sinh tự nghỉ cá nhân**:
- **Định nghĩa:** Ngày trường vẫn hoạt động dạy học bình thường theo thời khóa biểu, nhưng học sinh không tham gia.
- **Phân loại 2 chế độ nghỉ:**
  1. **Nghỉ có phép (`Excused Absence`):** Được tính hoàn tiền theo tỷ lệ cấu hình của trường (ví dụ: Tiền ăn chính $50\%$, Tiền ăn sáng $70\%$, Phí đưa đón $50\%$).
  2. **Nghỉ không phép (`Unexcused Absence`):** Mặc định $0\%$ (trường vẫn phải chuẩn bị suất ăn và phương tiện đưa đón sẵn sàng cho học sinh). Tỷ lệ này có thể điều chỉnh từ $0\%$ đến $100\%$ tùy quy chế tài chính riêng của trường.

*(Lưu ý: Các ngày nghỉ lễ Quốc gia và sự kiện toàn trường được tự động hoàn 100% trong biểu phí hoặc khấu trừ trước theo lịch năm học).*

---

### BR02: Quy Tắc Thứ Bậc Chân Lý Thực Tế (Ground-Truth Precedence Rule)
> [!IMPORTANT]
> **Nguyên tắc vàng:** Sự hiện diện thực tế của học sinh tại lớp học dưới sự xác nhận của Giáo viên là **Chân lý vận hành cao nhất (Ground-Truth)**, phủ quyết (override) mọi đơn từ hoặc dự kiến vắng mặt được gửi trước đó.
> $$\mathbf{Teacher\ Attendance\ (Check\text{-}in)} \succ \mathbf{Parent\ Absence\ Request}$$

1. **Điều kiện để một ngày tự nghỉ được công nhận là "Nghỉ có phép":**
   - **Điều kiện 1 (Phụ huynh chủ động):** Phụ huynh gửi Đơn báo vắng thông qua Cổng trao đổi (`/conversations`) TRƯỚC mốc giờ quy định (`Cut-off Time`) và đơn được hệ thống ghi nhận hợp lệ.
   - **Điều kiện 2 (Nhà trường chủ động):** Giáo viên chủ nhiệm khi thực hiện điểm danh buổi sáng (`/class/[classId]/attendance`) đánh dấu trạng thái của học sinh là **"Vắng có phép"** (do phụ huynh gọi điện trực tiếp, có giấy bác sĩ hoặc lý do chính đáng).
2. **Quy tắc phủ quyết khi có xung đột (Conflict Resolution Protocol):**
   - Xung đột xảy ra khi: Phụ huynh **ĐÃ GỬI ĐƠN BÁO VẮNG** hợp lệ, nhưng sau đó **HỌC SINH VẪN ĐẾN TRƯỜNG** và được Giáo viên điểm danh "Có mặt" (Check-in).
   - **Hành vi hệ thống:**
     1. Hệ thống tự động đánh dấu cờ `isOverriddenByAttendance = true` cho đơn báo vắng của ngày hôm đó.
     2. Ngày hôm đó được tính là **01 ngày đi học thực tế**. Học sinh tham gia ăn bán trú, sử dụng xe đưa đón và sinh hoạt bình thường.
     3. **Không phát sinh bất kỳ khoản hoàn tiền nào** cho ngày này.
     4. Ghi nhật ký kiểm toán (Audit Trail) và gửi thông báo an tâm tới phụ huynh.

---

### BR03: Mốc Giờ Giới Hạn Báo Trước (`Cut-off Time`) & Xử Lý Báo Trễ
1. **Mốc giờ giới hạn (`Cut-off Time`):** Nhà trường cấu hình thời điểm chốt báo vắng buổi sáng trong ngày, mặc định là **`07:30`** (hỗ trợ cấu hình từ `06:00` đến `09:00` hoặc số giờ báo trước `advanceNoticeHours` từ 0 đến 100 giờ).
2. **Quy tắc phân loại thời điểm nộp đơn:**
   - **Gửi TRƯỚC Cut-off Time (Hợp lệ):** Nhà bếp chưa chia suất ăn $\rightarrow$ Đơn phân loại là **"Báo vắng đúng hạn"** $\rightarrow$ Đủ điều kiện xét hoàn tiền theo tỷ lệ Nghỉ có phép.
   - **Gửi SAU Cut-off Time (Báo trễ):** Nhà bếp đã tiếp nhận thực phẩm tươi sống $\rightarrow$ Đơn ghi nhận trạng thái **"Báo vắng trễ hạn"** $\rightarrow$ Tỷ lệ hoàn tiền ngày hôm đó áp dụng theo mức **Nghỉ không phép (0%)**.
3. **Ngoại lệ xét duyệt của Nhà trường:** Giáo viên chủ nhiệm hoặc Quản trị viên có quyền duyệt đặc cách có phép trên Cổng Trao đổi đối với các trường hợp khẩn cấp (tai nạn, cấp cứu đột xuất).

---

### BR04: Danh Mục Khoản Phí Là Nền Tảng Khởi Tạo & Tiêu Chuẩn Đơn Vị Tính "Ngày"
1. **Nguyên tắc Nền Tảng Cốt Lõi:** Mọi khoản phí muốn được áp dụng cơ chế hoàn tiền khi nghỉ học bắt buộc phải được khai báo trong `/school/school-fees` với đơn vị tính là **`ngày`** (hoặc `bữa`, `lượt`).
2. **Cơ chế thêm khoản phí bằng Pop-up chuyên dụng (`AddRefundableFeeModal`):**
   - Trong màn hình Cấu hình Học phí (`/setting/fee`), kế toán nhấn nút `+ Thêm khoản phí hoàn tiền` để mở modal `AddRefundableFeeModal`.
   - Modal tự động truy vấn từ Master Fee Catalog, chỉ lọc hiển thị các khoản phí có `unit === 'ngay'` hoặc `unit === 'ngày'` chưa nằm trong chính sách hoàn tiền hiện tại.
   - Thiết lập tỷ lệ hoàn Có phép (mặc định $50\%$) và Không phép (mặc định $0\%$) cho khoản phí mới thêm.

---

### BR05: Cơ Chế Thiết Lập Danh Sách Học Phí Từng Trẻ (Student Fee Profile Setup)
1. **Nguồn gốc dữ liệu:** Danh sách item học phí của từng học sinh (`student.feeItems`) được khởi tạo từ Biểu phí của lớp học (`/school/tuition-management`), kết hợp với các khoản thu từ Master Catalog (`/school/school-fees`).
2. **Cấu trúc nhóm khoản phí của học sinh:**
   - **Nhóm 1: Khoản phí bắt buộc cố định (Mandatory Fees):** Gồm *Học phí cơ bản* (đơn vị `tháng`) và *Tiền ăn cơ bản* (đơn vị `ngày`). Hai khoản này là cố định, có huy hiệu `Xuất HĐĐT` màu vàng và không thể xóa bỏ.
   - **Nhóm 2: Học phí lớp ngoại khóa:** Hiển thị trạng thái các lớp ngoại khóa học sinh đăng ký tham gia.
   - **Nhóm 3: Khoản phí khác (Optional / Supplementary Fees):** Các khoản thu linh hoạt như *Ăn sáng* (500.000 đ/tháng), *Học liệu Lịch sử* (280.000 đ/năm), *Tiếng Anh tăng cường* (1.000 đ/tháng), *Năng khiếu: Vẽ*, *Phí học bơi*, *Đồng phục*... Có thể thêm/xóa dòng tùy biến cho từng học sinh.
3. **Cửa sổ Pop-up chỉnh sửa học phí học sinh (`EditStudentFeeModal`):**
   - Click biểu tượng edit (cây bút chì) trong mục "Thông tin học phí" trên trang chi tiết học sinh (`/[schoolCode]/school/kid/detail/[id]`) sẽ **mở trực tiếp cửa sổ Pop-up Modal**, loại bỏ hoàn toàn việc chuyển trang sang `/edit/[id]/fee`.
   - Sử dụng universal `Dropdown` component hỗ trợ tìm kiếm có dấu / không dấu tiếng Việt.
   - Nút `+ Thêm` mở dòng nhập liệu mới với icon cây bút chì, ô chọn tên khoản phí từ danh mục trường, icon đồng xu nhập số tiền, hậu tố đơn vị tính (`Đ/tháng`, `Đ/năm`, `Đ/ngày`), và icon thùng rác xóa dòng.
   - Ô nhập Ghi chú riêng cho học sinh.
   - Nút `Cập nhật` mở hộp thoại xác nhận (Confirmation Dialog) với minh họa trực quan, ghi nhận thay đổi vào Redux store (`studentSlice`) và hiển thị toast thông báo thành công.

---

### BR06: QUY TẮC 3 TRƯỜNG HỢP HOÀN TIỀN ĂN SÁNG (3-Case Breakfast Fee & Meal Refund Rule)
> [!IMPORTANT]
> **Quy Tắc Vàng Hoàn Tiền Ăn Sáng:**  
> Hệ thống kết hợp giữa **Danh sách item khoản phí của từng học sinh** và **Section Hoàn tiền ăn trong Cấu hình Học phí** để xác định tính hợp lệ hoàn trả theo 3 trường hợp logic tuyệt đối:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│              MA TRẬN QUY TẮC 3 TRƯỜNG HỢP HOÀN TIỀN ĂN SÁNG                            │
├─────────┬──────────────────────┬────────────────────────┬──────────────────────────────┤
│ TRƯỜNG  │ HỌC SINH CÓ ĐÓNG PHÍ │ NHÀ TRƯỜNG CÓ THIẾT LẬP│ KẾT QUẢ XỬ LÝ                │
│ HỢP     │ ĂN SÁNG HAY KHÔNG?   │ HOÀN TIỀN ĂN SÁNG?     │ TIỀN HOÀN ĂN SÁNG            │
├─────────┼──────────────────────┼────────────────────────┼──────────────────────────────┤
│ CASE 1  │ CÓ ĐÓNG PHÍ ĂN SÁNG  │ CÓ THIẾT LẬP HOÀN TIỀN │ ✅ ĐƯỢC HOÀN TIỀN ĂN SÁNG    │
│         │ (Amount > 0 đ)       │ (Tỷ lệ hoàn sáng > 0%) │ Tính theo số ngày vắng mặt   │
├─────────┼──────────────────────┼────────────────────────┼──────────────────────────────┤
│ CASE 2  │ CÓ ĐÓNG PHÍ ĂN SÁNG  │ KHÔNG THIẾT LẬP HOÀN   │ ❌ KHÔNG HOÀN TIỀN ĂN SÁNG   │
│         │ (Amount > 0 đ)       │ (Tỷ lệ hoàn sáng = 0%) │ Tiền hoàn ăn sáng = 0 đ      │
├─────────┼──────────────────────┼────────────────────────┼──────────────────────────────┤
│ CASE 3  │ KHÔNG ĐÓNG PHÍ SÁNG  │ CÓ HOẶC KHÔNG THIẾT LẬP│ ❌ CHẮC CHẮN KHÔNG HOÀN TIỀN │
│         │ (Không có khoản này) │ (Bất kể cấu hình trường│ Tiền hoàn ăn sáng = 0 đ      │
└─────────┴──────────────────────┴────────────────────────┴──────────────────────────────┘
```

#### 1. Định nghĩa kỹ thuật kiểm tra điều kiện:
- **Điều kiện Học sinh đóng tiền ăn sáng (`isStudentPayingBreakfastFee`):**  
  Học sinh được xác định là CÓ trả phí ăn sáng khi và chỉ khi trong danh sách `student.feeItems` tồn tại ít nhất 01 khoản phí có tên hoặc mã liên quan đến "Ăn sáng" (ví dụ: `code === 'AN_SANG'`, `name === 'Ăn sáng'`, `feeId === 'fee-25'`) VÀ số tiền áp dụng `amount > 0`.
- **Điều kiện Nhà trường thiết lập hoàn tiền ăn sáng (`isSchoolRefundingBreakfast`):**  
  Nhà trường được xác định là CÓ thiết lập hoàn tiền ăn sáng khi và chỉ khi:
  1. Tính năng hoàn tiền đang BẬT (`mealRefund.isEnabled === true`).
  2. VÀ tỷ lệ hoàn tiền ăn sáng lớn hơn 0 (`breakfastRatePercent > 0` trong `excusedRates` hoặc `refundableFees`).

#### 2. Chi tiết 3 trường hợp và Thông điệp ngữ cảnh (Insight Banner Message):
- **CASE 1: Học sinh có đóng tiền ăn sáng + Nhà trường CÓ thiết lập hoàn tiền ăn sáng**
  - **Trạng thái:** `eligible`
  - **Số tiền hoàn ăn sáng:** Tính toán theo công thức: $\text{Refund}_{breakfast} = D_{vắng} \times P_{sáng} \times \text{Rate}_{sáng}$
  - **Thông điệp Insight Banner:**  
    *"Học sinh có đóng phí ăn sáng và Nhà trường có thiết lập hoàn tiền ăn sáng: Hoàn tiền ăn sáng cho học sinh theo quy định."*
- **CASE 2: Học sinh có đóng tiền ăn sáng + Nhà trường KHÔNG thiết lập hoàn tiền ăn sáng**
  - **Trạng thái:** `school_disabled`
  - **Số tiền hoàn ăn sáng:** Bằng đúng **`0 đ`** (dù học sinh có nghỉ bao nhiêu ngày).
  - **Thông điệp Insight Banner:**  
    *"Học sinh có đóng phí ăn sáng nhưng Nhà trường không thiết lập hoàn tiền ăn sáng: Không hoàn tiền mặc dù học sinh có trả tiền ăn sáng."*
- **CASE 3: Học sinh KHÔNG đóng tiền ăn sáng**
  - **Trạng thái:** `student_not_paying`
  - **Số tiền hoàn ăn sáng:** Bằng đúng **`0 đ`** (chắc chắn không phát sinh hoàn tiền ăn sáng dưới mọi hình thức).
  - **Thông điệp Insight Banner:**  
    *"Học sinh không đóng phí ăn sáng. Chắc chắn không hoàn tiền dù nhà trường có thiết lập hay không."*

---

### BR07: Công Thức Toán Học Tổng Quát & Chu Kỳ Khấu Trừ Hóa Đơn Kỳ $M+1$
1. **Chu kỳ khấu trừ lùi $M+1$ (Lagged Billing Cycle):**
   - **Tháng $M$:** Học sinh đi học, phát sinh các ngày tự nghỉ thực tế được ghi nhận trên sổ điểm danh và đơn báo vắng.
   - **Đầu Tháng $M+1$:** Lập hóa đơn thu tiền tháng mới $\rightarrow$ Tự động quét đối soát tháng $M$, tính toán các khoản hoàn tiền và trừ trực tiếp vào hóa đơn Tháng $M+1$.
2. **Công thức toán học tổng quát (bóc tách đa khoản):**
   $$\text{Total Refund}(s, M) = \text{Refund}_{trưa}(s, M) + \text{Refund}_{sáng}(s, M) + \sum_{k \in \text{Khác}} \text{Refund}_k(s, M)$$
   Trong đó:
   - **Khoản 1: Tiền ăn trưa bán trú:**
     $$\text{Refund}_{trưa} = \big( D_{excused} \times P_{trưa} \times \text{Rate}_{trưa\_excused} \big) + \big( D_{unexcused} \times P_{trưa} \times \text{Rate}_{trưa\_unexcused} \big)$$
   - **Khoản 2: Tiền ăn sáng (Áp dụng BR06):**
     $$\text{Refund}_{sáng} = \begin{cases} \big( D_{excused} \times P_{sáng} \times \text{Rate}_{sáng\_excused} \big) + \big( D_{unexcused} \times P_{sáng} \times \text{Rate}_{sáng\_unexcused} \big) & \text{nếu thỏa mãn Case 1} \\ 0 & \text{nếu rơi vào Case 2 hoặc Case 3} \end{cases}$$
   - **Khoản 3: Các khoản dịch vụ theo ngày khác (Phí đưa đón 2A8...):**
     $$\text{Refund}_k = \big( D_{excused} \times P_k \times \text{Rate}_{k\_excused} \big) + \big( D_{unexcused} \times P_k \times \text{Rate}_{k\_unexcused} \big)$$

---

### BR08: Chuẩn Hóa Văn Phong Minh Bạch Trên Hóa Đơn & Thông Báo Phụ Huynh
> [!IMPORTANT]
> **Chuẩn Mực Văn Phong:** Hệ thống tuyệt đối không dùng từ viết tắt mơ hồ như "3 ngày tự nghỉ...". Phải luôn phân định rành mạch từng khoản và từng diện nghỉ kèm tỷ lệ % và số tiền tương ứng.

#### Cú pháp hiển thị chuẩn hóa trên Hóa đơn học sinh:
- **Dòng hoàn tiền ăn trưa:**  
  `"{N} ngày nghỉ có phép [{rate}%]: -{amount} đ"`  
  *(Ví dụ: `3 ngày nghỉ có phép [50%]: -60.000 đ`)*
- **Dòng hoàn tiền ăn sáng (khi thỏa mãn Case 1):**  
  `"{N} ngày nghỉ có phép ăn sáng [{rate}%]: -{amount} đ"`  
  *(Ví dụ: `3 ngày nghỉ có phép [70%]: -42.000 đ`)*
- **Dòng hoàn tiền xe đưa đón / dịch vụ theo ngày:**  
  `"{N} ngày nghỉ có phép [{rate}%]: -{amount} đ"`  
  *(Ví dụ: `3 ngày nghỉ có phép [50%]: -30.000 đ`)*
- **Hiển thị tổng thể:**  
  Banner màu xanh lá trên hóa đơn liệt kê chi tiết từng dòng; bảng chi tiết khoản thu gắn huy hiệu `Hoàn tiền: -X đ` trên từng dòng tương ứng; tổng tiền hóa đơn trừ đi tổng số tiền hoàn và mã VietQR mã hóa đúng số tiền thực thu.

---

### BR09: Cơ Chế Mô Phỏng Trực Quan 3 Cột (Live Simulation Sandbox)
1. Tại giao diện Cấu hình Học phí (`/setting/fee`), tích hợp widget **"Ví dụ tính toán thực tế & Giảm trừ hóa đơn tháng sau"** dạng 3 cột trực quan.
2. **Quy cách định dạng 2 dòng cho từng khoản phí trong thẻ:**
   - **Dòng 1:** Tên khoản phí (ví dụ: `Tiền ăn bán trú`, `Ăn sáng`, `Phí đưa đón 2A8`).
   - **Dòng 2:** Công thức tính toán đặt trong ngoặc đơn ở dòng riêng biệt bên dưới (ví dụ: `(40k × 50% × 3 ngày)`), số tiền hoàn tương ứng hiển thị nổi bật ở bên phải.
3. **Cấu trúc 3 thẻ mô phỏng:**
   - **Thẻ 1: Nghỉ có phép (3 ngày)** — Liệt kê chi tiết từng khoản phí và tổng tiền hoàn có phép.
   - **Thẻ 2: Nghỉ không phép (2 ngày)** — Mặc định 0 đ, tự động tính lại ngay lập tức khi người dùng chuyển sang tab "Nghỉ không phép" và điều chỉnh tỷ lệ %.
   - **Thẻ 3: Tổng hoàn giảm trừ hóa đơn tháng sau** — Tổng cộng số tiền sẽ trừ vào hóa đơn kỳ tiếp theo.

---

## 5. Yêu Cầu Chức Năng Chi Tiết (Functional Requirements)

### Phân Hệ 1: Cấu Hình Học Phí (`/setting/fee`)
- `FR-REF-001`: Cung cấp section *"2. Thiết lập cơ chế hoàn tiền khi nghỉ học"* trong trang Cấu hình Học phí, hiển thị công tắc chuyển mạch Bật/Tắt tính năng.
- `FR-REF-002`: Cung cấp giao diện 2 tab cấu hình tỷ lệ hoàn tiền: **Nghỉ có phép** và **Nghỉ không phép**, phân chia rõ trường nhập % cho Bữa chính và Bữa sáng.
- `FR-REF-003`: Nút `+ Thêm khoản phí hoàn tiền` mở modal `AddRefundableFeeModal`, nạp danh sách từ Master Fee Catalog, chỉ lọc các khoản phí có đơn vị `ngày`.
- `FR-REF-004`: Cho phép cấu hình mốc giờ giới hạn phụ huynh cần báo trước (`Cut-off Time`, mặc định `07:30` sáng hoặc số giờ 0-100h).
- `FR-REF-005`: Tích hợp widget mô phỏng 3 cột với công thức 2 dòng và tính phản ứng tức thì (reactive calculation).
- `FR-REF-006`: Quản lý trạng thái lưu tạm (draft), gắn cờ thay đổi (dirty flag), hỗ trợ nút `Lưu` và `Hủy` kèm thông báo toast xác nhận thành công.

### Phân Hệ 2: Hồ Sơ Học Sinh & Pop-up Chỉnh Sửa Học Phí (`/school/kid/detail/[id]`)
- `FR-REF-007`: Trong tab Hồ sơ học sinh, render khối "Thông tin học phí" hiển thị các khoản phí áp dụng cho học sinh kèm badge `Xuất HĐĐT`.
- `FR-REF-008`: Tích hợp Contextual Insight Banner tự động đánh giá và hiển thị thông điệp theo đúng **Quy tắc 3 Trường hợp hoàn tiền ăn sáng (`BR06`)**.
- `FR-REF-009`: Biểu tượng cây bút chì (Edit) kích hoạt mở trực tiếp **Pop-up Modal `EditStudentFeeModal`** ngay trên trang hiện tại, không chuyển trang.
- `FR-REF-010`: Trong `EditStudentFeeModal`, hiển thị 2 thẻ bắt buộc chỉ đọc (*Học phí cơ bản*, *Tiền ăn cơ bản*), khu vực thêm/xóa *Khoản phí khác* linh hoạt với universal `Dropdown` tìm kiếm tiếng Việt, ô nhập đơn giá và đơn vị tính.
- `FR-REF-011`: Trong `EditStudentFeeModal`, tự động cập nhật Insight Banner hoàn tiền ăn sáng theo thời gian thực khi người dùng thêm hoặc xóa mục "Ăn sáng".
- `FR-REF-012`: Nút `Cập nhật` mở Confirmation Dialog với minh họa đồ họa, khi người dùng bấm xác nhận sẽ cập nhật vào Redux `studentSlice`, hiển thị toast thành công và đóng modal.

### Phân Hệ 3: Điểm Danh & Đơn Báo Vắng (Attendance & Leave Request)
- `FR-REF-013`: Kiểm tra thời điểm nộp đơn báo vắng so với mốc giờ Cut-off Time để phân loại Báo vắng đúng hạn (Có phép) hay Báo vắng trễ hạn (Không phép).
- `FR-REF-014`: Thực thi quy tắc thứ bậc chân lý thực tế BR02: Điểm danh của giáo viên tại lớp luôn phủ quyết đơn báo vắng nếu có xung đột, không phát sinh hoàn tiền ngày đó.

### Phân Hệ 4: Lập Hóa Đơn & Khấu Trừ Kỳ $M+1$ (`/school/fee`)
- `FR-REF-015`: Khi lập hóa đơn kỳ $M+1$, billing engine tự động quét dữ liệu vắng tháng $M$ và danh sách biểu phí của học sinh.
- `FR-REF-016`: Gọi hàm `evaluateStudentBreakfastRefundEligibility` để áp dụng chính xác Quy tắc 3 Trường hợp hoàn tiền ăn sáng.
- `FR-REF-017`: Bóc tách riêng biệt dòng hoàn tiền ăn trưa, dòng hoàn tiền ăn sáng (nếu thỏa mãn Case 1) và các khoản phí theo ngày khác trên Banner tóm tắt màu xanh lá và bảng chi tiết dòng thu.
- `FR-REF-018`: Đồng bộ chuỗi thanh toán mã VietQR động với số tiền thực thu sau khi đã trừ toàn bộ các khoản hoàn tiền.

---

## 6. Mô Hình Dữ Liệu & Hợp Đồng Giao Tiếp (Data Contracts)

### 6.1 Cấu Hình Hoàn Tiền (`MealRefundConfig` & `RefundableFeeConfigItem`)
```typescript
export interface RefundableFeeConfigItem {
  feeId: string;                   // ID khoản thu từ Master Catalog (e.g. 'fee-sys-002', 'fee-25')
  code: string;                    // Mã code (e.g. 'TIEN_AN', 'AN_SANG', 'XE_DUA_DON_2A8')
  name: string;                    // Tên khoản thu hiển thị
  unit: 'ngày' | 'bữa' | 'lượt';   // Đơn vị tính bắt buộc là ngày/bữa/lượt
  defaultAmount?: number;          // Đơn giá ngày chuẩn (VND)
  isDefault?: boolean;             // Khoản hệ thống mặc định (không được xóa)
  excusedRatePercent: number;      // Tỷ lệ hoàn có phép (0 - 100%)
  unexcusedRatePercent: number;    // Tỷ lệ hoàn không phép (0 - 100%)
}

export interface MealRefundRates {
  mainMealRatePercent: number;     // Tỷ lệ hoàn tiền ăn trưa/bán trú (%)
  breakfastRatePercent: number;    // Tỷ lệ hoàn tiền ăn sáng (%)
}

export interface MealRefundConfig {
  isEnabled: boolean;              // Bật/tắt cơ chế hoàn tiền
  refundableFees?: RefundableFeeConfigItem[]; // Danh mục các khoản phí hoàn tiền theo ngày
  advanceNoticeHours: number;      // Mốc giờ báo trước (Cut-off Time: 0 - 100h)
  rates: MealRefundRates;          // Tỷ lệ mặc định
  excusedRates?: MealRefundRates;  // Tỷ lệ chi tiết có phép
  unexcusedRates?: MealRefundRates;// Tỷ lệ chi tiết không phép
}
```

### 6.2 Biểu Phí Học Sinh & Đánh Giá Hoàn Tiền Ăn Sáng (`StudentFeeItem` & `BreakfastRefundEvaluationResult`)
```typescript
export interface StudentFeeItem {
  id: string;                      // ID dòng phí học sinh
  feeId: string;                   // ID liên kết Master Fee Catalog
  code: string;                    // Mã khoản phí (e.g. 'HOC_PHI', 'TIEN_AN', 'AN_SANG')
  name: string;                    // Tên khoản phí
  amount: number;                  // Số tiền áp dụng (VND)
  unit: string;                    // Đơn vị tính ('thang', 'ngay', 'nam', 'lan')
  unitDisplay: string;             // Chuỗi hiển thị ('Đ/tháng', 'Đ/ngày', 'Đ/năm')
  exportElectronicInvoice: boolean;// Cờ xuất HĐĐT Viettel sInvoice
  category: 'hoc_phi' | 'tien_an' | 'ngoai_khoa' | 'khac';
  isMandatory?: boolean;           // Khoản bắt buộc (Học phí, Tiền ăn cơ bản)
}

export type BreakfastRefundEvaluationStatus =
  | 'eligible'            // Case 1: Học sinh đóng tiền ăn sáng + Trường cấu hình hoàn tiền ăn sáng
  | 'school_disabled'     // Case 2: Học sinh đóng tiền ăn sáng + Trường KHÔNG cấu hình hoàn tiền ăn sáng
  | 'student_not_paying'; // Case 3: Học sinh KHÔNG đóng tiền ăn sáng

export interface BreakfastRefundEvaluationResult {
  status: BreakfastRefundEvaluationStatus;
  isRefunded: boolean;             // Kết luận có được hoàn tiền ăn sáng hay không
  studentPaysBreakfast: boolean;   // Học sinh có đóng phí ăn sáng không
  schoolRefundsBreakfast: boolean; // Nhà trường có thiết lập hoàn tiền ăn sáng không
  breakfastAmount: number;         // Đơn giá/mức phí ăn sáng của học sinh
  reason: string;                  // Thông điệp văn phong chuẩn hóa cho Insight Banner
}
```

### 6.3 Kết Quả Khấu Trừ Khi Lập Hóa Đơn (`MealRefundCalculationResult`)
```typescript
export interface MealRefundCalculationItem {
  category: string;                // Tên khoản phí (e.g. 'Tiền ăn bán trú', 'Ăn sáng')
  feeId?: string;                  // ID khoản phí đối soát
  feeCode?: string;                // Code khoản phí đối soát
  amount: number;                  // Số tiền hoàn (VND)
  description: string;             // Văn phong chuẩn hóa: "3 ngày nghỉ có phép [50%]: -60.000 đ"
  days?: number;                   // Số ngày vắng mặt
  excusedDays?: number;            // Số ngày nghỉ có phép
  unexcusedDays?: number;          // Số ngày nghỉ không phép
  unitPrice?: number;              // Đơn giá áp dụng
  refundRate?: number;             // Tỷ lệ % áp dụng
}

export interface MealRefundCalculationResult {
  studentId: string;
  studentName: string;
  className: string;
  month: string;                   // Tháng đối soát (e.g. "2026-09")
  selfAbsenceDays: number;         // Tổng ngày tự nghỉ
  excusedAbsenceDays?: number;     // Số ngày nghỉ có phép
  unexcusedAbsenceDays?: number;   // Số ngày nghỉ không phép
  items: MealRefundCalculationItem[]; // Chi tiết từng khoản phí (bóc tách riêng Bữa chính & Ăn sáng)
  totalRefundAmount: number;       // Tổng số tiền hoàn được trừ vào hóa đơn
}
```

---

## 7. Tiêu Chí Nghiệm Thu (Acceptance Criteria)

| Mã AC | Tình huống kiểm thử | Kết quả mong đợi (Given - When - Then) | Trạng thái |
|---|---|---|---|
| **AC-001** | Bật/Tắt tính năng hoàn tiền | **Given** tính năng hoàn tiền đang Tắt<br>**When** lập hóa đơn kỳ M+1<br>**Then** không phát sinh bất kỳ dòng khấu trừ hoàn tiền nào. | **ĐẠT** |
| **AC-002** | Quy tắc thứ bậc chân lý BR02 | **Given** PH đã gửi đơn báo vắng hợp lệ<br>**When** GV điểm danh học sinh "Có mặt" (Check-in)<br>**Then** đơn báo vắng bị hủy hiệu lực hoàn tiền và tính là 1 ngày đi học bình thường. | **ĐẠT** |
| **AC-003** | Khởi tạo từ Master Fee Catalog | **Given** mở modal `AddRefundableFeeModal`<br>**When** tìm kiếm khoản phí hoàn tiền<br>**Then** chỉ hiển thị các khoản phí có đơn vị `ngày` từ danh mục trường. | **ĐẠT** |
| **AC-004** | Widget mô phỏng 3 cột 2 dòng | **Given** giao diện cấu hình hoàn tiền<br>**When** thay đổi tỷ lệ % vắng không phép<br>**Then** Thẻ 2 (Không phép) và Thẻ 3 (Tổng hoàn) tự động nhảy số tức thì với công thức 2 dòng. | **ĐẠT** |
| **AC-005** | **Hoàn tiền ăn sáng — Case 1** | **Given** HS có khoản phí Ăn sáng (500k) và Trường cấu hình hoàn ăn sáng 70%<br>**When** đánh giá tính hợp lệ<br>**Then** trả về trạng thái `eligible`, `isRefunded = true` và hoàn tiền ăn sáng theo số ngày nghỉ. | **ĐẠT** |
| **AC-006** | **Hoàn tiền ăn sáng — Case 2** | **Given** HS có khoản phí Ăn sáng (500k) nhưng Trường cấu hình hoàn ăn sáng 0%<br>**When** đánh giá tính hợp lệ<br>**Then** trả về trạng thái `school_disabled`, `isRefunded = false`, tiền hoàn ăn sáng = 0 đ. | **ĐẠT** |
| **AC-007** | **Hoàn tiền ăn sáng — Case 3** | **Given** HS KHÔNG có khoản phí Ăn sáng trong biểu phí<br>**When** đánh giá tính hợp lệ<br>**Then** trả về trạng thái `student_not_paying`, `isRefunded = false`, chắc chắn tiền hoàn ăn sáng = 0 đ. | **ĐẠT** |
| **AC-008** | Insight Banner tại Hồ sơ học sinh | **Given** màn hình Chi tiết học sinh<br>**When** xem khối "Thông tin học phí"<br>**Then** Insight Banner hiển thị đúng thông điệp tương ứng với Case của học sinh đó. | **ĐẠT** |
| **AC-009** | Pop-up `EditStudentFeeModal` | **Given** mục Thông tin học phí trên Hồ sơ học sinh<br>**When** click biểu tượng cây bút chì<br>**Then** mở trực tiếp Pop-up Modal chỉnh sửa học phí ngay tại chỗ mà không chuyển trang. | **ĐẠT** |
| **AC-010** | Universal Dropdown trong Pop-up | **Given** Pop-up `EditStudentFeeModal`<br>**When** chọn thêm khoản phí khác<br>**Then** bộ chọn Dropdown hỗ trợ tìm kiếm không dấu tiếng Việt và hiển thị checkmark chọn. | **ĐẠT** |
| **AC-011** | Bóc tách dòng hoàn tiền trên Hóa đơn | **Given** HS thỏa mãn Case 1 có 3 ngày nghỉ có phép<br>**When** sinh hóa đơn Tháng 10<br>**Then** xuất hiện 2 dòng riêng: `"3 ngày nghỉ có phép [50%]: -60.000 đ"` và `"3 ngày nghỉ có phép [70%]: -42.000 đ"`. | **ĐẠT** |
| **AC-012** | Khấu trừ tổng và đồng bộ VietQR | **Given** hóa đơn có các khoản hoàn tiền<br>**When** hoàn tất lập hóa đơn<br>**Then** tổng tiền thanh toán được trừ sạch tiền hoàn và mã VietQR mã hóa chính xác số tiền thực nộp. | **ĐẠT** |

---

## 8. Bằng Chứng Thực Thi Mã Nguồn & Xác Minh Kỹ Thuật (Implementation Evidence)

Toàn bộ các quy tắc và tính năng trong PRD phiên bản 2.0 đã được xây dựng hoàn thiện, xác minh nhị phân qua Verify Gate và đồng bộ vào kho mã nguồn:

1. **Động cơ đánh giá hoàn tiền ăn sáng & tính toán biểu phí:**
   - [`src/utils/studentFeeCalculation.ts`](file:///Users/hieuvo/Desktop/Finviet/School%20Portal/src/utils/studentFeeCalculation.ts): Hiện thực hóa toàn bộ các hàm `isBreakfastFeeItem`, `isStudentPayingBreakfastFee`, `isSchoolRefundingBreakfast`, `evaluateStudentBreakfastRefundEligibility` theo đúng 3 Case nghiệp vụ.
2. **Cấu hình hoàn tiền đa tầng tại Cấu hình Học phí:**
   - [`src/modules/settings/fee/LatePickupAndRefundBlock.tsx`](file:///Users/hieuvo/Desktop/Finviet/School%20Portal/src/modules/settings/fee/LatePickupAndRefundBlock.tsx): Giao diện 2 tab Có phép / Không phép, cấu hình Bữa chính và Bữa sáng, bảng `RefundableFeeConfigItem` lọc theo đơn vị `ngày`, widget mô phỏng 3 cột 2 dòng với reactive engine.
   - [`src/modules/settings/fee/AddRefundableFeeModal.tsx`](file:///Users/hieuvo/Desktop/Finviet/School%20Portal/src/modules/settings/fee/AddRefundableFeeModal.tsx): Pop-up chọn khoản phí hoàn tiền lọc từ Master Fee Catalog.
3. **Giao diện Hồ sơ học sinh & Pop-up Modal trực tiếp:**
   - [`src/modules/school/student/StudentFeeSection.tsx`](file:///Users/hieuvo/Desktop/Finviet/School%20Portal/src/modules/school/student/StudentFeeSection.tsx): Khối Thông tin học phí với Insight Banner trực quan và nút edit mở Pop-up.
   - [`src/modules/school/student/EditStudentFeeModal.tsx`](file:///Users/hieuvo/Desktop/Finviet/School%20Portal/src/modules/school/student/EditStudentFeeModal.tsx): Pop-up chỉnh sửa biểu phí học sinh, tích hợp `Dropdown` tiếng Việt, cập nhật Insight Banner thời gian thực và Confirmation Dialog.
4. **Động cơ hóa đơn & Khấu trừ kỳ M+1:**
   - [`src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`](file:///Users/hieuvo/Desktop/Finviet/School%20Portal/src/modules/finance/invoices/CreateInvoiceWizardModal.tsx): Bóc tách độc lập dòng hoàn tiền ăn trưa và tiền ăn sáng, gắn badge xanh lá trên từng dòng thu và Banner tóm tắt.
5. **Kiểm chứng kỹ thuật tối thượng:**
   - **Biên dịch:** `npx tsc --noEmit` đạt **0 lỗi**.
   - **Kịch bản kiểm thử tự động:** Toàn bộ **702/702 unit tests** vượt qua thành công ($100\%$ PASS).
   - **Cổng Verify Gate:** Script `verify.sh` đạt mã thoát `0`.
   - **Git Repository:** Mã nguồn đã được commit và push lên nhánh chính `origin/main`.
