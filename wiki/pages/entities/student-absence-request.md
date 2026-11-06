---
title: Thực Thể Đơn Xin Nghỉ Học / Báo Vắng (Student Absence Request)
type: entity
sources:
  - repo:docs/guides/development/E-004-operations-conversations/epic.md
  - repo:docs/guides/legacy/operating-portal/M2-van-hanh/trao-doi.md
  - repo:docs/guides/decisions.md
updated: 2026-11-05
spec_ids:
  - VH-09
  - TC-11
---

# Thực Thể Đơn Xin Nghỉ Học / Báo Vắng (Student Absence Request)

## Định nghĩa
Đơn xin nghỉ học (Báo vắng) là thực thể nghiệp vụ phản ánh yêu cầu nghỉ học chính thức do phụ huynh học sinh khởi tạo thông qua ứng dụng di động Eco School Parent, gửi tới giáo viên chủ nhiệm và ban giám hiệu nhà trường. Thực thể này là chứng từ căn cứ pháp lý để xác định trạng thái "Vắng có phép" (CP) trong sổ điểm danh và kích hoạt luồng khấu trừ hoàn tiền ăn tự động ($M+1$).

## Thuộc tính / quy tắc nghiệp vụ
- **Mã định danh:** `id` (UUIDv4).
- **Học sinh:** `studentId` (liên kết tới `student-profile`).
- **Lớp học:** `classId` (liên kết tới `classroom`).
- **Thời gian xin nghỉ:** `startDate` và `endDate` (ngày bắt đầu và kết thúc kỳ nghỉ, định dạng `YYYY-MM-DD`).
- **Loại ngày nghỉ:** `session`: Cả ngày (`full_day`), Buổi sáng (`morning`), Buổi chiều (`afternoon`).
- **Lý do nghỉ học:** `reason`: Nghỉ ốm / điều trị y tế (`medical`), Việc gia đình (`family`), Lý do khác (`other`), kèm văn bản giải trình chi tiết.
- **Trạng thái xử lý:** `status`:
  - `pending` (Chờ duyệt): Phụ huynh vừa gửi, giáo viên nhận được thông báo đẩy.
  - `approved` (Đã duyệt): Giáo viên chủ nhiệm xác nhận, tự động đồng bộ sang bảng điểm danh thành trạng thái "Vắng có phép" (CP).
  - `rejected` (Từ chối): Giáo viên từ chối đơn kèm lý do phản hồi cho phụ huynh.
- **Quy tắc thời gian báo vắng (VH-09):** Đơn xin nghỉ nộp trước mốc thời gian quy định của nhà trường (cấu hình tại Cấu hình học phí, mặc định 08:30 sáng cùng ngày) mới được công nhận là hợp lệ để xét hoàn tiền suất ăn bán trú 100%.
- **Đón về sớm khẩn cấp do y tế (OQ-10):** Đối với trường hợp học sinh đã check-in buổi sáng nhưng phát sinh sốt cao $\ge 38.5^\circ\text{C}$ hoặc bệnh đột xuất và được phụ huynh đón về trước 10:30 sáng (có xác nhận của Y tế trường), hệ thống tự động sinh đơn nghỉ nửa ngày do y tế (`emergency_medical_half_day`) và áp dụng mức hoàn 50% tiền ăn ngày đó.
- **Liên kết hoàn tiền ăn (TC-11):** Mỗi ngày nghỉ có phép hợp lệ sẽ tạo ra một bản ghi tín chỉ hoàn tiền ăn (`meal-refund-credit`) để khấu trừ vào kỳ hóa đơn tháng tiếp theo. Nếu hoàn tiền vượt học phí, tự động kết chuyển thành số dư tín dụng `credit_balance`.

## Quan hệ
- Thuộc về một [Học sinh](student-profile.md) (`studentId`).
- Gắn với một [Lớp học](classroom.md) (`classId`).
- Liên thông với sổ [Điểm danh hàng ngày](attendance-daily.md) để đánh dấu vắng có phép.
- Kích hoạt việc sinh ra [Tín chỉ hoàn tiền ăn](meal-refund-credit.md) cho hóa đơn học phí tiếp theo.
- Được trao đổi qua kênh [Hội thoại phụ huynh](conversation-thread.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-09 | Duyệt đơn báo vắng tự động đồng bộ sang điểm danh và hoàn tiền ăn | Prototype xử lý logic điểm danh và trao đổi | MISSING | — |
| TC-11 | Tính toán khấu trừ suất ăn theo đơn báo vắng hợp lệ | Logic tính toán quy định trong Redux store | MISSING | — |

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Luồng nộp đơn xin nghỉ học](../flows/fl-don-xin-nghi-hoc.md)
- [Luồng báo vắng hoàn tiền](../flows/fl-bao-vang-hoan-tien.md)
- [Màn hình trao đổi](../screens/m2-sm4-trao-doi.md)
- [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md)
