---
title: Luồng Nhập & Phê Duyệt Sổ Điểm Học Tập
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - HT-03
updated: 2026-11-05
---

# Luồng Nhập & Phê Duyệt Sổ Điểm Học Tập

## Mục tiêu
Cho phép giáo viên bộ môn nhập các cột điểm kiểm tra thường xuyên và định kỳ, tự động tính điểm trung bình môn theo trọng số, và thực hiện quy trình khóa sổ điểm sau khi ban giám hiệu phê duyệt.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | GV bộ môn | [Màn hình sổ điểm](../screens/m3-sm3-diem-danh-gia.md) | Chọn lớp, môn học, học kỳ và nhập điểm số theo từng cột điểm kiểm tra | Điểm số được lưu tạm và tự động tính điểm trung bình | HT-03 |
| 2 | GV bộ môn | [Màn hình sổ điểm](../screens/m3-sm3-diem-danh-gia.md) | Kiểm tra điểm tổng kết, bấm "Gửi phê duyệt sổ điểm" | Sổ điểm chuyển trạng thái Chờ duyệt | HT-03 |
| 3 | BGH / Trưởng BM | [Màn hình sổ điểm](../screens/m3-sm3-diem-danh-gia.md) | Rà soát bảng điểm toàn lớp và bấm "Khóa sổ điểm" | Sổ điểm được khóa vĩnh viễn, công bố kết quả cho phụ huynh | HT-03 |
| 4 | GV & BGH | [Màn hình sổ điểm](../screens/m3-sm3-diem-danh-gia.md) | Sổ đã khóa phát hiện nhập nhầm: GV tạo Phiếu đề nghị đính kèm ảnh bài thi; BGH duyệt | Mở khóa cục bộ 1 ô điểm (TTL 60 phút), lưu Audit Trail bất biến và tính lại TBHK | HT-03 |

## Quy tắc chặn / validation
- Điểm số nhập vào phải nằm trong thang điểm từ 0.0 đến 10.0; chấp nhận tối đa 1 chữ số thập phân (HT-03).
- **Cơ chế mở khóa sổ điểm đặc biệt (OQ-11):** Sau khi sổ điểm đã bị khóa (`locked`), cấm mọi hành vi sửa điểm trực tiếp; bắt buộc phải có Phiếu đề nghị kèm ảnh bằng chứng và phê duyệt của Ban Giám Hiệu.
- **Giới hạn thời gian mở khóa (TTL 60 phút):** Ô điểm được mở khóa tạm thời sẽ tự động đóng băng trở lại ngay khi giáo viên bấm Lưu hoặc sau 60 phút kể từ lúc duyệt (HT-03).
- **Audit Trail bất biến (OQ-11):** Mọi thao tác sửa điểm sau khi khóa bắt buộc ghi nhận vào `GradeAuditTrail` (chống xóa/sửa) và gửi thông báo giải trình minh bạch tới phụ huynh (HT-03).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-03 | Nhập sổ điểm và đánh giá định kỳ theo quy chuẩn chuẩn hóa của Bộ GD&ĐT | Giao diện sổ điểm mới chỉ có bảng mockup, chưa có công thức tính điểm TB | MISSING | repo:app/src/features/academics/ |

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Sổ điểm đánh giá](../entities/gradebook-record.md)
- [Màn hình sổ điểm](../screens/m3-sm3-diem-danh-gia.md)
