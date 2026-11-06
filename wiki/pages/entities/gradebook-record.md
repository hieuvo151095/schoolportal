---
title: Sổ Điểm Đánh Giá (Gradebook Record)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - HT-03
updated: 2026-11-05
---

# Sổ Điểm Đánh Giá (Gradebook Record)

## Định nghĩa
Thực thể Sổ điểm đánh giá quản lý điểm số thường xuyên, điểm định kỳ (giữa kỳ, cuối kỳ) và nhận xét học lực, hạnh kiểm của học sinh theo đúng chuẩn quy định của Bộ Giáo dục & Đào tạo.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| HT-03 | Quản lý các cột điểm: Điểm miệng, 15 phút, 1 tiết, Giữa kỳ, Cuối kỳ và Điểm trung bình môn học | Công thức tính trung bình theo trọng số hệ số 1, 2, 3 |
| HT-03 | Trạng thái sổ điểm: `draft` (Đang nhập), `submitted` (Chờ duyệt), `locked` (Đã khóa) | Khóa vĩnh viễn sau khi BGH phê duyệt |
| HT-03 | Sửa sổ điểm đã khóa: Phải có Phiếu đề nghị đính kèm ảnh bài thi và phê duyệt từ BGH | Mở khóa cục bộ phạm vi 1 ô điểm trong tối đa 60 phút |
| HT-03 | Lưu vết Audit Trail bất biến (`GradeAuditTrail`): Lưu vết người yêu cầu, người duyệt, điểm cũ/mới, lý do, ảnh bằng chứng | Chống sửa/xóa cả ở DB, tự động gửi thông báo phụ huynh |
| HT-03 | Bảo toàn điểm khi chuyển trường: Kết xuất bảng điểm điện tử có ký số, map môn tương đương tại trường mới | Kế thừa điểm TX, GK vào công thức TBHK MoET |

## Quan hệ
- Thuộc về một [Hồ sơ học sinh 360](student-profile.md).
- Gắn với [Lớp học](classroom.md) và môn học tương ứng.
- Nhập bởi [Giáo viên & Nhân viên](teacher-staff.md).
- Hiển thị trên [Màn hình sổ điểm](../screens/m3-sm3-diem-danh-gia.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-03 | Nhập sổ điểm và đánh giá định kỳ theo quy chuẩn chuẩn hóa của Bộ GD&ĐT | Giao diện sổ điểm mới chỉ có bảng mockup, chưa có công thức tính điểm TB | MISSING | repo:app/src/features/academics/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Màn hình sổ điểm](../screens/m3-sm3-diem-danh-gia.md)
- [Luồng nhập sổ điểm](../flows/fl-nhap-so-diem.md)
