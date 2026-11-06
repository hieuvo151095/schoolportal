---
title: Khái Niệm Chuẩn Đánh Giá & Xếp Loại Học Sinh (MoET Assessment Standard)
type: concept
sources:
  - repo:docs/guides/knowledge.md
  - repo:docs/guides/decisions.md
updated: 2026-11-05
spec_ids:
  - HT-04
  - HT-05
  - HT-03
---

# Khái Niệm Chuẩn Đánh Giá & Xếp Loại Học Sinh (MoET Assessment Standard)

## Định nghĩa
Chuẩn đánh giá và xếp loại học sinh là tập hợp các nguyên tắc, công thức toán học và biểu mẫu đánh giá tuân thủ nghiêm ngặt các quy định hiện hành của Bộ Giáo Dục và Đào Tạo Việt Nam:
- Thông tư 27/2020/TT-BGDĐT: Đánh giá học sinh tiểu học (kết hợp nhận xét tiến bộ và điểm kiểm tra định kỳ).
- Thông tư 22/2021/TT-BGDĐT: Đánh giá học sinh trung học cơ sở và trung học phổ thông (tính điểm trung bình môn học kỳ có trọng số).
- Thông tư 51/2020/TT-BGDĐT: Đánh giá sự phát triển của trẻ em mầm non theo thang chuẩn năng lực - phẩm chất 3 mức.

## Quy tắc
1. **Công thức điểm trung bình môn học kỳ (HT-04):**
   - Áp dụng cho các môn đánh giá bằng điểm số:
     $$\text{TBHK} = \frac{\sum_{i=1}^{k} \text{ĐĐG}_{TX, i} + 2 \times \text{ĐĐG}_{GK} + 3 \times \text{ĐĐG}_{CK}}{k + 5}$$
   - Trong đó:
     - $\text{ĐĐG}_{TX}$: Điểm đánh giá thường xuyên (hệ số 1).
     - $\text{ĐĐG}_{GK}$: Điểm đánh giá giữa kỳ (hệ số 2).
     - $\text{ĐĐG}_{CK}$: Điểm đánh giá cuối kỳ (hệ số 3).
     - $k$: Số lượng đầu điểm đánh giá thường xuyên được nhập.
   - **Chốt chặn bảo vệ (Defensive Guard):** Nếu học sinh thiếu điểm giữa kỳ ($\text{ĐĐG}_{GK}$) hoặc cuối kỳ ($\text{ĐĐG}_{CK}$), hệ thống cấm tính điểm $\text{TBHK}$ sơ bộ (trả về dấu `"—"`), tránh việc báo cáo sai lệch kết quả học tập khi kỳ thi chưa kết thúc.
   - Điểm $\text{TBHK}$ làm tròn đến đúng 1 chữ số thập phân.
2. **Đánh giá mầm non theo Rubric năng lực (HT-05):**
   - Đánh giá theo 3 thang mức chuẩn: "Tốt", "Đạt", "Cần cố gắng".
   - Phân loại theo 3 năng lực chung, 7 năng lực đặc thù và 5 phẩm chất chủ yếu.
   - **Chốt chặn đếm tiêu chí (Domain Clamping):** Hệ thống kiểm soát số tiêu chí đạt không vượt quá tổng số tiêu chí quy định của từng lĩnh vực (ví dụ: cấm lỗi vượt ngưỡng 6/5).
3. **Quy tắc phân công giáo viên chấm điểm:**
   - Chỉ giáo viên được phân công bộ môn tại lớp học mới có quyền nhập điểm và lời nhận xét.
   - Mọi thay đổi điểm số sau khi sổ điểm đã khóa kỳ đánh giá phải tuân thủ cơ chế mở khóa đặc biệt có phê duyệt.
4. **Bảo toàn điểm số khi chuyển trường giữa học kỳ (OQ-11):**
   - *Chuyển trường cùng hệ thống ECO:* Hệ thống trích xuất toàn bộ các đầu điểm kiểm tra thường xuyên ($\text{ĐĐG}_{TX}$) và điểm giữa kỳ ($\text{ĐĐG}_{GK}$) đã tích lũy tại trường cũ thành bản ghi học bạ điện tử có chữ ký số của Ban Giám Hiệu. Trường tiếp nhận sử dụng tính năng "Đối chiếu mã môn học tương đương", tự động kế thừa toàn bộ đầu điểm thành phần vào sổ điểm lớp mới để tính $\text{TBHK}$ theo Thông tư 22/27 Bộ GD&ĐT mà không bắt học sinh phải làm bài kiểm tra bù.
   - *Chuyển trường ngoài hệ thống:* Kết xuất Bảng điểm điện tử xác thực bằng mã QR truy xuất nguồn gốc và đóng băng hồ sơ học sinh ở trạng thái `TRANSFERRED_OUT`.
5. **Cơ chế mở khóa sổ điểm đặc biệt & Audit Trail bất biến (OQ-11):**
   - Sổ điểm đã ở trạng thái Khóa (`LOCKED`) thì ở chế độ chỉ đọc (Read-only) đối với toàn bộ giáo viên.
   - Khi phát hiện vào nhầm điểm (ví dụ chấm phúc khảo hoặc cộng nhầm điểm bài thi): Giáo viên lập "Phiếu đề nghị điều chỉnh điểm số" (`GradeCorrectionRequest`), đính kèm ảnh chụp bài thi làm bằng chứng và giải trình rõ lý do.
   - Ban Giám Hiệu (Hiệu trưởng / Hiệu phó chuyên môn) thẩm định hồ sơ và phê duyệt trực tiếp trên portal.
   - Ngay khi phê duyệt, hệ thống kích hoạt **Mở khóa cục bộ có phạm vi (Scoped Temporary Unlock):** CHỈ mở quyền ghi cho đúng ô điểm được phê duyệt của học sinh đó với thời hạn tự động khóa lại tối đa 60 phút (TTL: 3600s). Mọi ô điểm khác của lớp vẫn bị khóa chặt.
   - Hệ thống tự động ghi nhận bản ghi bất biến vào `GradeAuditTrail` (chứa `timestamp`, `teacher_id`, `approver_id`, `old_score`, `new_score`, `reason`, `evidence_url`, `ip_address`). Bản ghi này chỉ ghi thêm (Append-Only), không thể xóa sửa kể cả bởi DB Admin. Hệ thống lập tức tính lại $\text{TBHK}$ và gửi thông báo giải trình minh bạch tới phụ huynh.

## Áp dụng ở đâu
- [Phân hệ Học tập](../overview/module-academics.md)
- [Màn hình điểm đánh giá](../screens/m3-sm3-diem-danh-gia.md)
- [Màn hình môn học](../screens/m5-sm4-mon-hoc.md)
- [Thực thể bản ghi sổ điểm](../entities/gradebook-record.md)
- [Luồng nhập sổ điểm](../flows/fl-nhap-so-diem.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-04 | Công thức tính TBHK có trọng số $\frac{\sum TX + 2GK + 3CK}{k+5}$ | Logic tính toán trong `src/modules/academics/gradebook/` | MISSING | — |
| HT-05 | Khung rubric đánh giá mầm non và chốt chặn không vượt tổng tiêu chí | Giao diện rubric mầm non đã dựng sẵn tab và modal | MISSING | — |
| HT-03 | Quản lý sổ điểm theo quy định Bộ GD&ĐT | Giao diện bảng điểm phân kỳ và tổng kết học kỳ | MISSING | — |

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Thực thể bản ghi sổ điểm](../entities/gradebook-record.md)
- [Thực thể môn học](../entities/school-subject.md)
- [Luồng nhập sổ điểm](../flows/fl-nhap-so-diem.md)
