# Tài Liệu Yêu Cầu Sản Phẩm (PRD) — Phân Hệ Miễn Giảm Học Phí & Liên Thông Học Sinh - Học Phí

> **Dự án:** Cổng Vận Hành Trường Học (School Operating Portal — Finviet / SOHA)  
> **Phân hệ trung tâm:** Tài Chính — Miễn Giảm (`/school/discount`)  
> **Phân hệ liên thông:** Nhà Trường — Học Sinh (`/school/kid`) & Tài Chính — Học Phí (`/school/fee`)  
> **Phiên bản:** 2.0 (Cập nhật quy tắc 01 chính sách duy nhất, tập giao 24 khoản phí, đơn vị giảm trừ linh hoạt `%` / `đ`)  
> **Trạng thái:** Đã phê duyệt & Đã nghiệm thu kiểm thử (Approved & Verified)

---

## 1. Tổng Quan Phân Hệ & Mục Tiêu Nghiệp Vụ

### 1.1 Bối cảnh thực tế tại các trường học
Trong công tác tài chính trường học (đặc biệt là khối Mầm non và Phổ thông liên cấp K-12), chính sách học bổng và miễn giảm học phí là nghiệp vụ phức tạp, đòi hỏi sự phối hợp chặt chẽ giữa:
1. **Ban Giám Hiệu / Quản trị viên:** Thiết lập các chương trình ưu đãi, học bổng theo diện chính sách (gia đình chính sách, con thương binh, gia đình có từ 2 con theo học) hoặc diện khuyến học (học sinh tài năng, giải thưởng quốc gia/quốc tế).
2. **Kế toán trường học:** Áp dụng chính xác các khoản giảm trừ vào từng dòng thu cụ thể trong kỳ lập hóa đơn hằng tháng mà không bị sai sót, không làm méo mó số liệu ngân hàng và đảm bảo quyền lợi cao nhất cho học sinh.
3. **Giáo viên & Cán bộ tuyển sinh:** Theo dõi trực tiếp hồ sơ học sinh, nắm rõ học sinh nào đang được hưởng chính sách để hỗ trợ phụ huynh giải đáp thắc mắc.

### 1.2 Mục tiêu của phân hệ Miễn Giảm
Xây dựng một phân hệ quản trị **Miễn Giảm Học Phí** chuyên sâu, tập trung và liên thông hai chiều với phân hệ **Hồ Sơ Học Sinh** và **Lập Hóa Đơn Thu Phí**:
- **Quản trị danh mục chính sách tập trung (`/school/discount`):** Định nghĩa linh hoạt mức giảm theo tỷ lệ phần trăm (`%`) hoặc số tiền mặt cố định (`VNĐ/đ`), ràng buộc vào khoản thu cụ thể, áp dụng theo lớp học hoặc học sinh cụ thể trong khoảng thời gian xác định.
- **Minh bạch trên hồ sơ học sinh (`/school/kid` & `/school/kid/detail/[id]`):** Tự động nhận diện học sinh có miễn giảm bằng huy hiệu trực quan trên danh bạ, cung cấp bộ lọc nhanh và bảng tổng hợp toàn bộ các chính sách đang thụ hưởng trong hồ sơ 360°.
- **Tự động hóa & Linh hoạt khi lập hóa đơn (`/school/fee/create`):** Động cơ tính phí tự động nhận diện chính sách ưu đãi, hỗ trợ giảm tiền mặt cố định, chuyển đổi đơn vị linh hoạt giữa `%` và `đ` ngay trên bảng dòng thu, và xuất hóa đơn chính xác kèm mã thanh toán VietQR động.

---

## 2. Kiến Trúc Liên Thông Tam Giác: Miễn Giảm ↔ Học Sinh ↔ Học Phí

Phân hệ Miễn Giảm đóng vai trò là "bộ não quy tắc" (Rule Engine), tương tác với hai phân hệ còn lại theo mô hình tam giác khép kín:

```
                      ┌─────────────────────────────────────────┐
                      │        PHÂN HỆ MIỄN GIẢM                │
                      │       (/school/discount)                │
                      │  • Danh mục chính sách ưu đãi           │
                      │  • Quy tắc 01 chính sách / khoản phí    │
                      │  • Tập giao 24 khoản phí theo nhóm      │
                      └──────────────────┬──────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
┌──────────────────────────────────┐            ┌──────────────────────────────────┐
│       PHÂN HỆ HỌC SINH           │            │        PHÂN HỆ HỌC PHÍ           │
│       (/school/kid)              │◄──────────►│        (/school/fee)             │
│ • Nhận diện icon thẻ (faTag)     │  Đồng bộ   │ • Tự động nạp danh mục thu lớp   │
│ • Bộ lọc "Có / Không miễn giảm"  │  dữ liệu   │ • Giảm tiền mặt cố định (Xe buýt)│
│ • Bảng chi tiết miễn giảm 360°   │  học sinh  │ • Chuyển đổi linh hoạt [%] / [đ] │
│ • Bảo toàn 01 chính sách duy nhất│  và lớp    │ • Áp dụng mức cao nhất (Math.max)│
└──────────────────────────────────┘            └──────────────────────────────────┘
```

1. **Từ Miễn Giảm $\rightarrow$ Học Sinh:** Khi một chính sách miễn giảm được ban hành hoặc cập nhật, hệ thống tự động gắn thẻ miễn giảm cho học sinh thụ hưởng. Tại trang chi tiết hồ sơ học sinh (`StudentDetailHub`), khu vực "Miễn giảm" lập tức phản ánh chính sách này.
2. **Từ Miễn Giảm $\rightarrow$ Học Phí:** Khi kế toán viên lập hóa đơn cho lớp hoặc từng cá nhân học sinh, hệ thống tự động quét các chính sách đang có hiệu lực, nạp các khoản phí liên quan (bao gồm cả các dịch vụ đăng ký như Xe đưa đón), tự động điền mức giảm và tính thành tiền.
3. **Từ Học Sinh $\rightarrow$ Học Phí:** Thông tin lớp học, khối học và danh sách học sinh được chia sẻ 100% đồng nhất giữa `studentSlice`, `discountSlice` và `invoiceSlice`.

---

## 3. Câu Chuyện Người Dùng (User Stories)

- **US-DISC-01 (Quản trị chính sách tập trung):** Là kế toán hoặc ban giám hiệu, tôi muốn quản lý danh sách toàn bộ các chính sách miễn giảm trên một giao diện bảng chuyên nghiệp (`/school/discount`), có thống kê số lượng chính sách đang chạy, tạm dừng, hết hạn, hỗ trợ tìm kiếm nhanh và xuất báo cáo ra Excel.
- **US-DISC-02 (Quy tắc 01 chính sách duy nhất & Xác nhận thay thế):** Là kế toán, tôi muốn mỗi học sinh chỉ áp dụng DUY NHẤT 01 chính sách miễn giảm cho cùng một khoản phí tại một thời điểm. Nếu tôi tạo một chính sách mới cho khoản phí mà học sinh đã có chính sách cũ, hệ thống phải cảnh báo rõ ràng ngay trên màn hình tạo để tôi xác nhận thay thế; nếu tôi đồng ý, chính sách cũ sẽ tự động ngừng hiệu lực đối với học sinh đó.
- **US-DISC-03 (Chọn nhóm áp dụng trước & Tập giao khoản phí):** Là kế toán, khi tạo chính sách mới, tôi muốn chọn "Nhóm áp dụng" trước, sau đó danh mục "Khoản phí áp dụng" tự động lọc theo tập giao các khoản phí thực tế của các lớp/học sinh được chọn (từ danh mục 24 khoản phí toàn trường), giúp tôi không bao giờ chọn nhầm khoản phí mà lớp đó không phải đóng.
- **US-DISC-04 (Trải nghiệm chọn lớp chuyên nghiệp):** Là kế toán, khi cấu hình áp dụng theo nhiều lớp học, tôi muốn nhấn nút `+ Chọn lớp học` để mở pop-up modal có tìm kiếm, lọc khối, chọn tất cả, tương tự như trải nghiệm chọn học sinh, thay vì phải kéo danh sách checkbox dài dòng trên form chính.
- **US-DISC-05 (Nhận diện miễn giảm trên Danh bạ học sinh):** Là giáo viên hoặc quản trị viên, trên danh bạ học sinh (`/school/kid`), tôi muốn nhìn thấy ngay icon thẻ miễn giảm bên cạnh tên học sinh đang có chính sách, và có bộ lọc "Có miễn giảm / Không miễn giảm" để lọc nhanh danh sách.
- **US-DISC-06 (Bảng chi tiết miễn giảm trong Hồ sơ học sinh):** Là phụ huynh hoặc cán bộ nhà trường, khi xem hồ sơ chi tiết học sinh (`/school/kid/detail/[id]`), tôi muốn có bảng "Miễn giảm" liệt kê rõ ràng từng chính sách đang hưởng, khoản phí áp dụng, mức giảm, thời hạn và căn cứ pháp lý/lý do xét duyệt.
- **US-DISC-07 (Đồng bộ danh mục khoản thu khả dụng của lớp khi lập hóa đơn):** Là kế toán, khi tạo hóa đơn cho lớp (ví dụ 10A1, 10A2), tôi muốn bảng dòng thu tự động hiển thị đầy đủ các khoản phí mà lớp phải đóng (bao gồm cả Xe đưa đón, Đồng phục hè...), để các chính sách miễn giảm đã tạo cho lớp được hiển thị sẵn sàng và khấu trừ chính xác.
- **US-DISC-08 (Giảm tiền mặt cố định & Chuyển đổi linh hoạt `%` sang `đ` trên hóa đơn):** Là kế toán, trên bảng chi tiết dòng thu của hóa đơn, tôi muốn:
  - Cột giảm trừ hiển thị tên là **"Giảm trừ"** (không có chữ `%`).
  - Đơn giá hiển thị có dấu chấm phân cách hàng nghìn (ví dụ `2.500.000 đ`).
  - Khoản Xe đưa đón giảm cố định `200.000 đ` (đơn vị `đ`, thành tiền `1.000.000 đ`).
  - Khoản chưa có chính sách (ví dụ Đồng phục hè) mặc định là `0 %`, nhưng tôi có thể click chuyển đổi đơn vị sang `[đ]` và nhập trực tiếp số tiền giảm tùy ý ngay trên màn hình lập hóa đơn.

---

## 4. Các Quy Tắc Nghiệp Vụ Cốt Lõi (Core Business Rules)

### BR01: Quy tắc 01 chương trình miễn giảm duy nhất cho mỗi khoản phí & Cơ chế xác nhận thay thế
1. **Nguyên tắc bất biến:** Một học sinh chỉ được thụ hưởng DUY NHẤT 01 chính sách miễn giảm có hiệu lực cho cùng một khoản phí (ví dụ: Học phí chính khóa) tại bất kỳ thời điểm nào.
2. **Cơ chế phát hiện xung đột (`findStudentDiscountConflicts`):**
   - Khi người dùng mở form tạo mới hoặc chỉnh sửa chính sách miễn giảm (`CreateDiscountPolicyModal`), hệ thống theo dõi cặp giá trị `(Nhóm đối tượng, Khoản phí)`.
   - Nếu trong danh sách học sinh được chọn (hoặc học sinh thuộc các lớp được chọn) đã có học sinh đang áp dụng một chính sách khác cho cùng loại khoản phí này:
     - Hệ thống kích hoạt **Khung cảnh báo màu vàng nổi bật** ngay trên form:
       - Tiêu đề: *Cảnh báo: Phát hiện N học sinh đã có chính sách miễn giảm cho khoản phí này*.
       - Thẻ so sánh chi tiết từng học sinh: Tên học sinh, Lớp, [Chính sách hiện tại: Mức giảm cũ] $\leftrightarrow$ [Chính sách mới: Mức giảm mới].
       - Ghi chú nghiệp vụ: *Theo quy định hệ thống, mỗi học sinh chỉ áp dụng DUY NHẤT 01 chính sách miễn giảm cho cùng một khoản phí.*
3. **Hộp kiểm xác nhận bắt buộc (`confirmReplacement`):**
   - Người dùng bắt buộc phải tích chọn: `[ ] Tôi xác nhận thay thế chính sách cũ bằng chính sách mới này cho các học sinh bị trùng lặp nêu trên.`
   - Nếu người dùng nhấn "Tạo chính sách" mà chưa tích chọn, hệ thống chặn gửi và báo lỗi đỏ.
4. **Cơ chế loại trừ tự động trong cơ sở dữ liệu / Redux State:**
   - Khi chính sách mới được lưu thành công với cờ xác nhận thay thế:
     - Đối với chính sách cũ theo lớp: Thêm `studentId` của học sinh trùng lặp vào mảng `excludedStudentIds` của chính sách cũ.
     - Đối với chính sách cũ theo cá nhân: Gỡ `studentId` khỏi danh sách `targets` hoặc chuyển trạng thái chính sách cũ sang `expired`.
   - Kết quả: Học sinh chỉ còn thụ hưởng DUY NHẤT chính sách mới trong cả phân hệ Hồ sơ học sinh và Hóa đơn học phí.

---

### BR02: Thứ tự chọn Nhóm áp dụng trước & Thuật toán tập giao danh mục 24 khoản phí
1. **Trật tự trường nhập liệu bắt buộc trên Form:**
   - Trường 1: **Tên chính sách miễn giảm**.
   - Trường 2: **Nhóm áp dụng** (Lớp học hoặc Học sinh cụ thể) — Đặt LÊN TRƯỚC trường Khoản phí.
   - Trường 3: **Khoản phí áp dụng** — Phụ thuộc trực tiếp vào kết quả chọn của Trường 2.
2. **Danh mục 24 khoản phí toàn trường:**
   - Trường học có tổng cộng 24 khoản phí (3 khoản hệ thống: Học phí chính khóa, Tiền ăn bán trú, Phí nước uống; cùng 21 khoản dịch vụ và ngoại khóa tùy chỉnh).
   - Mỗi lớp học hoặc học sinh chỉ tham gia đóng một danh mục con (Sub-set) của 24 khoản phí này:
     - Lớp 10A1 đóng các khoản: `[1, 2, 5, 6, 7]` (Học phí, Tiền ăn, Tiếng Anh tăng cường, Xe đưa đón, Đồng phục hè).
     - Lớp 11A1 đóng các khoản: `[1, 2, 10, 11, 15]` (Học phí, Tiền ăn, Bán trú thứ 7, Học bơi, CLB Cờ vua).
3. **Thuật toán tập giao toán học (`getApplicableFeeItemsForTargets`):**
   $$\text{CommonFees} = \bigcap_{c \in \text{SelectedClasses}} \text{Fees}(c)$$
   - Khi chưa chọn nhóm áp dụng: Trường Khoản phí hiển thị thông báo hướng dẫn người dùng chọn lớp/học sinh trước.
   - Khi chỉ chọn Lớp 10A1: Dropdown hiển thị đầy đủ 5 khoản phí `[1, 2, 5, 6, 7]`.
   - Khi chọn đồng thời cả Lớp 10A1 và Lớp 11A1: Dropdown tự động tính tập giao $\{1, 2, 5, 6, 7\} \cap \{1, 2, 10, 11, 15\} = \{1, 2\}$, chỉ hiển thị 2 khoản phí chung là `[Khoản 1] Học phí chính khóa` và `[Khoản 2] Tiền ăn bán trú`, kèm huy hiệu *"2 khoản phí chung hợp lệ"*. Mọi khoản riêng của từng lớp bị loại bỏ hoàn toàn khỏi danh sách.

---

### BR03: Đồng bộ trải nghiệm UI/UX chọn lớp học (`ClassPickerModal`)
1. Thay vì liệt kê danh sách checkbox dài dòng trực tiếp trên form chính, giao diện mục "Theo lớp học (Nhiều lớp)" được chuẩn hóa đồng bộ với mục "Theo học sinh cụ thể":
   - Hiển thị thẻ tóm tắt các lớp đã chọn (kèm số lượng lớp và tổng sĩ số học sinh).
   - Nút `+ Chọn lớp học` mở pop-up modal chuyên dụng `ClassPickerModal`.
2. **Tính năng của `ClassPickerModal`:**
   - Ô tìm kiếm theo tên lớp và khối học.
   - Dropdown lọc theo khối (Tất cả, Khối 10, Khối 11, Khối 12).
   - Hai nút thao tác nhanh: `Chọn tất cả` và `Bỏ chọn tất cả`.
   - Danh sách lớp học hiển thị dạng thẻ tương tác có checkbox: Tên lớp, Khối, Huy hiệu sĩ số (ví dụ: `32 HS`).
   - Các lớp đã chọn trên form chính hiển thị dạng thẻ tag có nút `[x]` để xóa nhanh từng lớp mà không cần mở lại modal.

---

### BR04: Động cơ giải quyết xung đột & Tự động áp dụng mức ưu đãi cao nhất khi lập hóa đơn
1. Trong trường hợp dữ liệu lịch sử hoặc trường hợp chuyển tiếp mà học sinh tạm thời có nhiều chính sách ứng cử viên:
   - Khi lập hóa đơn, hệ thống tính toán giá trị tiền mặt thực tế được giảm của tất cả chính sách và **tự động áp dụng chính sách có giá trị giảm trừ cao nhất (`Math.max`)**.
   - Nếu hai chính sách có giá trị giảm bằng nhau, chính sách dành riêng cho cá nhân học sinh được ưu tiên làm tie-breaker.
2. Tại màn hình lập hóa đơn, bên cạnh mức giảm tự động, kế toán có thể mở pop-up `SelectDiscountProgramModal` để xem danh sách mọi chính sách hợp lệ và linh hoạt chọn áp dụng chính sách khác hoặc chọn 0% nếu phụ huynh từ chối nhận ưu đãi.

---

### BR05: Đồng bộ liên thông danh mục khoản phí của lớp khi lập Hóa Đơn & Lập hóa đơn nhiều lớp
1. Khi kế toán tạo hóa đơn theo phạm vi "Lớp học" (`scope: 'lop_hoc'`), hệ thống cho phép chọn **nhiều lớp học cùng lúc** (`classIds: string[]`), tự động tổng hợp học sinh của tất cả các lớp được chọn.
2. Bảng các dòng khoản thu của hóa đơn PHẢI tự động nạp đầy đủ các khoản phí mà lớp đó phải nộp (theo cấu hình của trường), bao gồm các khoản dịch vụ đăng ký như **Xe đưa đón**, Đồng phục hè, Tiếng Anh tăng cường...
3. Đảm bảo luồng vận hành thực tế nhất quán: Khi đã tạo chính sách miễn giảm cho khoản "Xe đưa đón" của lớp 10A1, thì khi lập hóa đơn cho lớp 10A1, dòng khoản thu "Xe đưa đón" bắt buộc phải có sẵn trong bảng để chính sách được khấu trừ ngay lập tức.

---

### BR06: Chuẩn hóa Bảng Chi tiết các dòng khoản thu trên Hóa Đơn
1. **Tiêu đề cột:** Chuẩn hóa thành duy nhất từ **"Giảm trừ"** (xóa bỏ hoàn toàn ký tự `%`).
2. **Định dạng đơn giá:** Cột "Đơn giá" và các trường tiền tệ hiển thị định dạng số có dấu chấm phân cách hàng nghìn (ví dụ: `2.500.000`, `1.200.000`, `450.000`).
3. **Trải nghiệm hiển thị tinh gọn:** Lược bỏ biểu tượng cây bút `[edit]` gây rối mắt; hiển thị giá trị giảm trực tiếp trong ô nhập liệu; hiển thị dòng chữ màu xanh lá ghi rõ số tiền được trừ bên dưới (ví dụ: `-200.000 đ` hoặc `-1.250.000 đ`).
4. **Hỗ trợ Giảm tiền mặt cố định (`đ`) & Chuyển đổi linh hoạt giữa `[%]` và `[đ]`:**
   - **Khoản Xe đưa đón:** Giảm trực tiếp `200.000 đ` cho học sinh (không theo tỷ lệ %), nhãn đơn vị hiển thị là `[đ]`, ô nhập giá trị hiển thị `200.000`, bên dưới hiển thị số tiền trừ `-200.000 đ`, và thành tiền dòng tính chính xác:
     $$\text{Thành tiền} = 1.200.000\text{ đ} - 200.000\text{ đ} = \mathbf{1.000.000\text{ đ}}$$
   - **Khoản chưa có chính sách (ví dụ Đồng phục hè):** Giá trị mặc định là `0` với đơn vị `[%]`. Người dùng có thể nhấp chọn dropdown đơn vị để chuyển ngay sang `[đ]` và nhập trực tiếp số tiền giảm cụ thể ngay trên màn hình lập hóa đơn (ví dụ nhập giảm `50.000 đ` thì thành tiền tự động tính còn `400.000 đ`).
   - Hệ thống tự động tính lại thành tiền dòng, tổng giảm trừ `discountTotal`, tổng thanh toán `totalAmount` trong thời gian thực và đồng bộ vào Redux state với thuộc tính `discountType: 'percent' | 'fixed_amount'`.

---

## 5. Yêu Cầu Chức Năng Chi Tiết (Functional Requirements)

### Nhóm A: Quản Lý Chính Sách Miễn Giảm (`/school/discount`)
- `FR-DISC-001`: Cung cấp trang quản trị chính sách tại route `/[schoolCode]/school/discount` với 4 thẻ thống kê: Tổng số chính sách, Đang áp dụng, Tạm dừng, Đã hết hạn.
- `FR-DISC-002`: Bảng danh sách hiển thị các cột: Mã chính sách, Tên chính sách, Khoản thu áp dụng, Mức miễn giảm (kèm đơn vị % hoặc đ), Nhóm áp dụng, Thời gian áp dụng, Trạng thái, và Thao tác `•••`.
- `FR-DISC-003`: Cột "Nhóm áp dụng" hiển thị số lượng đối tượng; click vào mở popover xem danh sách lớp hoặc học sinh kèm mức giảm chi tiết.
- `FR-DISC-004`: Nút `+ Thêm chính sách miễn giảm` mở modal tạo mới với thứ tự: Tên chính sách $\rightarrow$ Nhóm áp dụng $\rightarrow$ Khoản thu áp dụng $\rightarrow$ Mức giảm & Loại $\rightarrow$ Thời hạn $\rightarrow$ Căn cứ pháp lý/Lý do.
- `FR-DISC-005`: Áp dụng quy tắc BR01 (cảnh báo trùng lặp màu vàng + checkbox xác nhận thay thế bắt buộc khi phát hiện học sinh đã có chính sách cũ cùng khoản thu).
- `FR-DISC-006`: Áp dụng quy tắc BR02 (tính tập giao toán học từ 24 khoản thu khi chọn nhiều lớp).
- `FR-DISC-007`: Áp dụng quy tắc BR03 (`ClassPickerModal` chọn nhiều lớp với tìm kiếm, lọc khối, chọn tất cả).
- `FR-DISC-008`: Hỗ trợ thao tác hàng trong menu `•••`: Xem chi tiết, Chỉnh sửa, Tạm dừng / Kích hoạt lại, Xóa chính sách (có modal xác nhận an toàn).
- `FR-DISC-009`: Hỗ trợ nút `Xuất Excel` xuất toàn bộ danh mục chính sách và danh sách học sinh thụ hưởng ra file `.xlsx` chuẩn UTF-8 tiếng Việt.

### Nhóm B: Liên Thông Phân Hệ Học Sinh (`/school/kid`)
- `FR-DISC-010`: Trên bảng danh sách học sinh (`StudentTable`), hiển thị icon thẻ miễn giảm (`faTag`) màu xanh ngọc bên cạnh tên học sinh nếu học sinh đang được hưởng ít nhất một chính sách miễn giảm hợp lệ. Lược bỏ các nhãn phần trăm cứng nhắc để tránh gây nhầm lẫn khi học sinh hưởng nhiều mức giảm cho các khoản phí khác nhau.
- `FR-DISC-011`: Trên thanh công cụ danh bạ học sinh (`StudentToolbar`), cung cấp trường lọc "Áp dụng miễn giảm" gồm 3 tùy chọn: "Tất cả" (`all`), "Có miễn giảm" (`co_mien_giam`), "Không miễn giảm" (`khong_mien_giam`).
- `FR-DISC-012`: Trong trang chi tiết hồ sơ học sinh 360° (`/school/kid/detail/[id]`), bổ sung bảng danh mục "Miễn giảm" hiển thị toàn bộ các chương trình đang áp dụng cho học sinh đó: Mã, Tên chương trình, Khoản thu, Mức giảm, Phạm vi, Thời hạn, Căn cứ và Trạng thái.
- `FR-DISC-013`: Khi một chính sách mới được tạo với cờ xác nhận thay thế (BR01), bảng Miễn giảm của học sinh trong hồ sơ 360° chỉ hiển thị DUY NHẤT chính sách mới cho khoản thu đó, chính sách cũ bị loại bỏ hoàn toàn.

### Nhóm C: Liên Thông Phân Hệ Hóa Đơn Học Phí (`/school/fee`)
- `FR-DISC-014`: Khi lập hóa đơn theo diện Lớp học (`scope === 'lop_hoc'`), wizard hỗ trợ chọn một hoặc nhiều lớp học đồng thời (`classIds: string[]`), tự động tổng hợp danh sách học sinh.
- `FR-DISC-015`: Danh mục dòng thu trong wizard tự động nạp các khoản phí của lớp (bao gồm cả Xe đưa đón, Đồng phục hè theo BR05).
- `FR-DISC-016`: Tự động quét và áp dụng chính sách miễn giảm hợp lệ cho từng học sinh; hiển thị thẻ tag chương trình trên mô tả dòng thu (ví dụ: `[Đã áp dụng Hỗ trợ xe đưa đón tuyến xa 200.000 đ]`).
- `FR-DISC-017`: Thực thi quy tắc BR06 trên bảng "Chi tiết các dòng khoản thu":
  - Tiêu đề cột chuẩn hóa thành **"Giảm trừ"**.
  - Đơn giá hiển thị có dấu chấm hàng nghìn (`2.500.000`, `1.200.000`, `450.000`).
  - Dòng Xe đưa đón: Giảm cố định `200.000 đ`, nhãn `[đ]`, thành tiền `1.000.000 đ`.
  - Dòng Đồng phục hè: Mặc định `0 %`, hỗ trợ chuyển đổi sang `[đ]` và nhập giá trị giảm tùy ý.
- `FR-DISC-018`: Khi tạo hoặc chỉnh sửa hóa đơn, Redux state lưu vết đầy đủ `discountType: 'percent' | 'fixed_amount'`, `discountPercent`, `discountAmount`, tính đúng `subtotal`, `discountTotal`, `totalAmount` và tạo mã VietQR tương ứng.

---

## 6. Mô Hình Dữ Liệu & Hợp Đồng Giao Tiếp (Data Contracts)

### 6.1 Đối tượng Chính sách Miễn Giảm (`DiscountPolicy`)
```typescript
export type DiscountType = 'percent' | 'fixed_amount';
export type DiscountScopeType = 'class' | 'student';
export type DiscountPeriodType = 'academic_year' | 'date_range';
export type DiscountPolicyStatus = 'active' | 'paused' | 'expired';

export interface DiscountPolicy {
  id: string;
  code: string;                          // ví dụ: "MG-2026-001"
  name: string;                          // ví dụ: "Học bổng tài năng học thuật"
  discountType: DiscountType;            // 'percent' | 'fixed_amount'
  discountValue: number;                 // 50 (nếu %) hoặc 200000 (nếu đ)
  feeItemId: string;                     // ví dụ: 'fee-sys-001' hoặc 'fee-cust-003'
  feeItemName: string;                   // ví dụ: "Học phí chính khóa" hoặc "Xe đưa đón"
  scopeType: DiscountScopeType;          // 'class' | 'student'
  classIds?: string[];                   // Danh sách mã lớp áp dụng
  classNames?: string[];                 // Danh sách tên lớp
  targets?: Array<{                      // Danh sách học sinh cụ thể
    studentId: string;
    studentName: string;
    studentCode: string;
    classId: string;
    className: string;
  }>;
  excludedStudentIds?: string[];         // Học sinh bị loại trừ do đã áp dụng chính sách mới thay thế (BR01)
  periodType: DiscountPeriodType;
  academicYear?: string;                 // ví dụ: "2026-2027"
  fromMonth?: string;                    // "2026-09"
  toMonth?: string;                      // "2027-05"
  reason?: string;                       // Căn cứ pháp lý / Quyết định miễn giảm
  status: DiscountPolicyStatus;
  createdAt: string;
  createdBy: string;
}
```

### 6.2 Dòng khoản thu trong Hóa Đơn (`InvoiceLineItem`)
```typescript
export interface InvoiceLineItem {
  id: string;
  feeItemId?: string;
  category: InvoiceLineItemCategory;
  name: string;                          // "Xe đưa đón", "Học phí chính khóa"...
  description?: string;                  // Gắn tag "[Đã áp dụng ...]"
  unitPrice: number;                     // Đơn giá chuẩn (ví dụ 1.200.000)
  quantity: number;
  discountType?: 'percent' | 'fixed_amount'; // Đơn vị giảm trừ linh hoạt
  discountPercent: number;               // Tỷ lệ % (0 - 100)
  discountAmount: number;                // Số tiền giảm thực tế (VNĐ)
  amount: number;                        // Thành tiền sau giảm (net amount)
  isRequired?: boolean;
  isMealFee?: boolean;
}
```

---

## 7. Tiêu Chí Nghiệm Thu Chi Tiết (Acceptance Criteria - AC)

| Mã AC | Nghiệp vụ kiểm tra | Điều kiện tiên quyết | Hành động kiểm thử | Kết quả kỳ vọng đạt chuẩn |
|---|---|---|---|---|
| **AC-DISC-01** | Bảng danh mục chính sách tập trung | Đăng nhập tài khoản kế toán, vào `/school/discount` | Xem giao diện tổng quan | Hiển thị 4 thẻ KPI thống kê; bảng dữ liệu đầy đủ các cột; chính sách quá hạn tự động hiển thị `Hết hạn`. |
| **AC-DISC-02** | Quy tắc 01 chính sách duy nhất & Hộp thoại cảnh báo | Nguyễn Gia Huy (10A1) đã có chính sách 20% Học phí chính khóa | Tạo chính sách mới cho "Học phí chính khóa" chọn Nguyễn Gia Huy | Form xuất hiện khung cảnh báo màu vàng nêu rõ chính sách cũ vs chính sách mới; nút "Tạo" bị chặn nếu chưa tích checkbox xác nhận thay thế. |
| **AC-DISC-03** | Thực thi thay thế và loại trừ chính sách cũ | Đã tích chọn checkbox xác nhận thay thế ở AC-DISC-02 | Nhấn nút "Tạo chính sách" | Chính sách mới được lưu; chính sách cũ tự động thêm `hs-001` vào `excludedStudentIds`; xem hồ sơ học sinh chỉ còn duy nhất chính sách mới. |
| **AC-DISC-04** | Thứ tự chọn Nhóm áp dụng trước | Mở modal tạo chính sách mới | Quan sát thứ tự form | Trường "Nhóm áp dụng" nằm TRƯỚC trường "Khoản phí áp dụng"; ô Khoản phí hiển thị thông báo yêu cầu chọn nhóm trước. |
| **AC-DISC-05** | Thuật toán tập giao 24 khoản phí | Modal tạo chính sách mới đang mở | Chọn Lớp 10A1 và Lớp 11A1 | Dropdown Khoản phí chỉ hiển thị đúng 2 khoản chung là `[Khoản 1] Học phí` và `[Khoản 2] Tiền ăn bán trú`, kèm huy hiệu "2 khoản phí chung hợp lệ". |
| **AC-DISC-06** | Trải nghiệm chọn lớp bằng `ClassPickerModal` | Đang ở mục "Theo lớp học" | Nhấn nút `+ Chọn lớp học` | Mở modal pop-up có tìm kiếm, lọc khối, chọn/bỏ chọn tất cả; các lớp đã chọn hiển thị thẻ tag có nút `[x]` xóa nhanh trên form chính. |
| **AC-DISC-07** | Nhận diện icon thẻ trên danh bạ học sinh | Truy cập `/school/kid` | Xem cột Tên học sinh | Học sinh có chính sách xuất hiện icon thẻ xanh ngọc (`faTag`); không hiển thị nhãn số % cứng nhắc. |
| **AC-DISC-08** | Bộ lọc miễn giảm học sinh | Đang ở `/school/kid` | Chọn lọc "Có miễn giảm" / "Không miễn giảm" | Bảng học sinh lọc chính xác 100% học sinh có hoặc không có chính sách miễn giảm. |
| **AC-DISC-09** | Nạp danh mục khoản thu lớp khi lập hóa đơn | Vào `/school/fee/create`, chọn phạm vi Lớp 10A1 | Xem bảng "Chi tiết các dòng khoản thu" | Khoản **"Xe đưa đón"** tự động xuất hiện trong danh sách khoản thu của lớp. |
| **AC-DISC-10** | Chuẩn hóa bảng dòng thu hóa đơn | Màn hình tạo hóa đơn cho Nguyễn Gia Huy | Quan sát bảng dòng thu | Tiêu đề cột là **"Giảm trừ"** (không có `%`); Đơn giá có dấu chấm (`2.500.000`, `1.200.000`); không có icon cây bút edit. |
| **AC-DISC-11** | Giảm tiền mặt cố định 200.000 đ cho Xe đưa đón | Dòng khoản thu "Xe đưa đón" trong hóa đơn | Xem giá trị giảm | Đơn vị hiển thị là `[đ]`, giá trị `200.000`, dòng subtext `-200.000 đ`, thành tiền tính đúng `1.000.000 đ`. |
| **AC-DISC-12** | Chuyển đổi linh hoạt đơn vị giữa `%` và `đ` | Dòng khoản thu "Đồng phục hè" (đơn giá 450.000 đ) | Chuyển đơn vị từ `%` sang `đ`, nhập `50.000` | Hệ thống cập nhật subtext thành `-50.000 đ`, thành tiền tự động tính thành `400.000 đ`, tổng hóa đơn cập nhật tức thì. |

---

## 8. Kết Quả Kiểm Thử & Nghiệm Thu Kỹ Thuật

- **Kiểm thử tự động (Unit Tests):** Toàn bộ **269 / 269 tests PASS 100%** trong các bộ test:
  - `tests/unit/discount.test.mjs`: Kiểm thử tập giao 24 khoản phí, quy tắc 01 chính sách duy nhất, loại trừ chính sách cũ.
  - `tests/unit/invoices.test.mjs`: Kiểm thử giảm tiền mặt cố định `đ` (Xe đưa đón 200.000 đ), chuyển đổi `%` $\leftrightarrow$ `đ` (Đồng phục hè), tạo hóa đơn nhiều lớp.
  - `tests/unit/students.test.mjs`: Kiểm thử bộ lọc "Có / Không miễn giảm", nhận diện học sinh thụ hưởng.
- **Biên dịch sản xuất (Production Build):** `npm run build` hoàn thành với **44 / 44 routes biên dịch sạch sẽ**, zero lỗi kiểu dữ liệu (TypeScript).

---

## 9. Hướng Dẫn Tải Về & Trải Nghiệm Trực Tiếp

### 9.1 Đường dẫn trải nghiệm trực tiếp trên Localhost
- **Phân hệ Miễn Giảm:** 👉 [http://localhost:3000/demo/school/discount](http://localhost:3000/demo/school/discount)
- **Tạo Hóa Đơn Học Phí:** 👉 [http://localhost:3000/demo/school/fee/create](http://localhost:3000/demo/school/fee/create)
- **Danh Bạ Học Sinh:** 👉 [http://localhost:3000/demo/school/kid](http://localhost:3000/demo/school/kid)
- **Chi Tiết Học Sinh Nguyễn Gia Huy:** 👉 [http://localhost:3000/demo/school/kid/detail/hs-001](http://localhost:3000/demo/school/kid/detail/hs-001)

### 9.2 Đường dẫn tải tài liệu PRD này
- **Xem trực tuyến & In / Lưu PDF:** 👉 [http://localhost:3000/docs/PRD_Mien_Giam_Hoc_Phi_VI.html](http://localhost:3000/docs/PRD_Mien_Giam_Hoc_Phi_VI.html)
- **Tải file Markdown (.md) nguyên bản:** 👉 [http://localhost:3000/docs/PRD_Mien_Giam_Hoc_Phi_VI.md](http://localhost:3000/docs/PRD_Mien_Giam_Hoc_Phi_VI.md)
