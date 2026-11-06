---
title: Luồng Chuyển Lớp & Chuyển Giao Niên Khóa
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-02
  - NT-04
updated: 2026-11-05
---

# Luồng Chuyển Lớp & Chuyển Giao Niên Khóa

## Mục tiêu
Thực hiện điều chuyển học sinh giữa các lớp trong năm học hoặc chuyển giao toàn bộ học sinh lên lớp mới khi bắt đầu niên khóa mới; chụp snapshot đơn giá tiền ăn phục vụ hoàn tiền khi chuyển lớp giữa tháng; bảo toàn điểm số học vụ khi chuyển trường; và thực thi chốt chặn bảo toàn công nợ độc lập với vòng đời lớp học cũ.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Quản trị viên | [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md) | Chọn một hoặc nhiều học sinh, chọn chức năng "Chuyển lớp", chọn lớp đích mới | Học sinh được điều chuyển sang lớp đích | NT-02 |
| 2 | Hệ thống | Academic Service | Thu hồi quyền truy cập kênh chat lớp cũ, cấp quyền lớp mới, cập nhật biểu phí học phí theo lớp mới | Hồ sơ 360 bảo toàn kết quả cũ và nạp biểu phí mới | NT-02 |
| 2b | Hệ thống | Meal Refund Engine | Chuyển lớp giữa tháng: chụp snapshot lớp học và đơn giá suất ăn tại từng ngày điểm danh | Đơn giá hoàn tiền ăn tháng trước tính theo lớp cũ lúc vắng | TC-08 |
| 3 | Quản trị viên | [Màn hình lớp học](../screens/m5-sm3-lop-hoc.md) | Kết thúc niên khóa: đóng lớp cũ, chuyển trạng thái sang "Lưu trữ" (`Archived`) | Toàn bộ công nợ tự động mang sang niên khóa mới (`Carried-over Debt`) | NT-04 |
| 4 | BGH / GV vụ | [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md) | Học sinh chuyển trường giữa kỳ: trích xuất bảng điểm ký số BGH, map môn tương đương | Kế thừa 100% cột điểm TX, GK vào sổ điểm mới theo MoET | HT-03 |

## Quy tắc chặn / validation
- Chỉ được chuyển học sinh sang lớp học thuộc cùng niên khóa hoặc niên khóa kế tiếp đang kích hoạt (NT-02).
- **Snapshot tiền ăn khi chuyển lớp giữa tháng (OQ-09):** Học sinh chuyển lớp giữa tháng thì ngày nghỉ có phép tại lớp cũ tính hoàn theo đơn giá lớp cũ, ngày nghỉ tại lớp mới tính theo đơn giá lớp mới; không cào bằng đơn giá (TC-08).
- **Bảo toàn điểm số khi chuyển trường (OQ-11):** Học sinh chuyển trường giữa học kỳ được bảo lưu toàn bộ điểm số đánh giá thường xuyên ($TX$) và giữa kỳ ($GK$), hệ thống tự động map môn tương đương và kế thừa vào sổ điểm trường mới tính TBHK mà không phải thi lại.
- **Chốt chặn bảo toàn công nợ (Debt Preservation Guard - OQ-12):** Tuyệt đối cấm xóa vật lý (Hard Delete) bất kỳ lớp học nào còn học sinh nợ học phí (`balance_due > 0`). Khi hết niên khóa, lớp học chuyển sang `Archived`; công nợ gắn chặt với `student_id` và tự động mang sang niên khóa mới (`Carried-over Debt`) trên hóa đơn của lớp mới. Kế toán vẫn truy thu được công nợ của lớp đã lưu trữ.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-02 | Chuyển lớp học sinh và chuyển năm học hàng loạt với bảo toàn kết quả học tập | Frontend chưa có chức năng chuyển lớp hàng loạt và đổi biểu phí | MISSING | repo:app/src/features/students/ |
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm chốt chặn an toàn khi xóa lớp | Chốt chặn an toàn khi xóa lớp chưa có backend validation | MISSING | repo:app/src/features/classes/ |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Chốt chặn an toàn khi xóa lớp](../concepts/class-deletion-guard.md)
- [Vòng đời chuyển tiếp học sinh](../concepts/student-lifecycle-transitions.md)
- [Chuẩn đánh giá học sinh MoET](../concepts/curriculum-assessment-standard.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Hồ sơ học sinh 360](../entities/student-profile.md)
- [Lớp học](../entities/classroom.md)
- [Màn hình lớp học](../screens/m5-sm3-lop-hoc.md)
