---
title: Màn Hình Phiếu Bé Ngoan Hằng Tuần
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-06
apps:
  - web
route_ids:
  - /{schoolCode}/class/{classId}/reward
status: implemented
updated: 2026-11-17
---

# Màn Hình Phiếu Bé Ngoan Hằng Tuần

## Mục đích
Cho phép giáo viên theo dõi nề nếp rèn luyện, chuyên cần trong tuần, cấp phát phiếu bé ngoan và công bố kết quả rèn luyện tới phụ huynh học sinh mầm non:
- **Đóng dấu phiếu bé ngoan tương tác 1-chạm**: Giáo viên có thể bấm trực tiếp vào biểu tượng Mặt Trời trên từng dòng danh sách học sinh để cấp hoặc hủy cấp phiếu ngay lập tức mà không cần chuyển trang.
- **Biểu tượng Mặt Trời chuẩn hóa (Sun Character)**:
  - **Đã đạt phiếu**: Nhân vật Mặt Trời tươi cười rực rỡ với các tia nắng vàng cam và dải ruy băng xanh mang chữ "BÉ NGOAN" (`/images/reward/sun_awarded.png`).
  - **Chưa đạt phiếu**: Nhân vật Mặt Trời tông màu xám/đen trắng (grayscale) kèm ruy băng xám (`/images/reward/sun_unawarded.png`).
- **Thao tác hàng loạt (Bulk Operations)**: Chọn nhiều học sinh qua checkbox để "Cấp phiếu hàng loạt" hoặc "Hủy cấp phiếu hàng loạt" nhanh chóng.
- **Thanh công cụ FilterBar SSOT 38px**: Chọn tuần học (Tuần 29, Tuần 28, Tuần 27, Tuần 26...), chọn lớp học, lọc theo trạng thái (Tất cả, Đã nhận phiếu, Chưa nhận phiếu), tìm kiếm theo tên/mã học sinh, nút Lưu thay đổi và nút Công bố phụ huynh.
- **Ngăn kéo SlideOver xem trước Thẻ Phiếu Bé Ngoan (Right-Sheet Preview)**:
  - Bộ chọn 4 tuần của tháng `[1]`, `[2]`, `[3]`, `[4]` hiển thị chấm xanh (green dot) trên đầu tuần đã đạt phiếu.
  - Minh họa lớn nhân vật Mặt Trời (màu rực rỡ khi đạt hoặc xám khi chưa đạt).
  - Tiêu đề thông báo kết quả: "Chúc mừng bé đã nhận Phiếu Bé Ngoan" hoặc "Chưa có Phiếu Bé Ngoan".
  - Thẻ pill cam bo tròn thể hiện tuần học (ví dụ: `Tuần 1 • 05/10 - 11/10` hoặc `Tuần này • 12/10 - 18/10`).
  - Thời gian gửi phụ huynh qua ứng dụng (ví dụ: `Gửi vào 18:11 05/10/2026`).
  - Tình hình chuyên cần tuần học (Nghỉ có phép, Nghỉ không phép).
  - Soạn thảo và chỉnh sửa nhận xét của cô giáo kèm các mẫu câu nhận xét nhanh 1-chạm.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/class/{classId}/reward` | repo:app/src/pages/[schoolCode]/class/[classId]/reward/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-06 | Quản lý đánh giá rèn luyện học sinh, cấp phát phiếu bé ngoan hàng tuần kèm nhân vật Mặt Trời và công bố phụ huynh qua ứng dụng | DONE |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-06 | Quản lý và cấp phiếu bé ngoan theo tuần với hình tượng Mặt Trời | Hoàn thiện 100% với Redux rewardSlice, FilterBar 38px, Thẻ Mặt Trời và SlideOver chuẩn Design System | MATCH | repo:app/src/pages/[schoolCode]/class/[classId]/reward/index.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng.

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Điểm danh học sinh](../screens/m2-sm1-diem-danh.md)
- [Chăm sóc trẻ hằng ngày](../screens/m2-sm7-cham-soc.md)
- [Bảng tin hoạt động lớp](../screens/m2-sm2-hoat-dong.md)
