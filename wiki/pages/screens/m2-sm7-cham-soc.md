---
title: Màn Hình Chăm Sóc Trẻ Hằng Ngày
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-05
apps:
  - web
route_ids:
  - /{schoolCode}/class/{classId}/nutrition
status: implemented
updated: 2026-11-17
---

# Màn Hình Chăm Sóc Trẻ Hằng Ngày

## Mục đích
Cho phép giáo viên theo dõi, đánh giá và ghi nhận toàn diện việc chăm sóc sinh hoạt của từng trẻ hoặc chăm sóc hàng loạt nhiều học sinh (multi-student care) trong ngày:
- **Bữa ăn trong ngày**: Đánh giá chi tiết 3 bữa (Ăn sáng, Ăn trưa, Ăn xế/lỡ) với hành vi (Tự ăn, Cần GV hỗ trợ, Bỏ bữa), định lượng (Ăn sơ sài, Ăn nửa suất, Ăn hết suất) và nhận xét riêng.
- **Giấc ngủ trưa**: Hành vi ngủ (Tự ngủ, GV hỗ trợ, Không ngủ), thời lượng & chất lượng (Ngủ sâu, Ngủ ~60 phút, Ngủ ~30 phút) và ghi chú giấc ngủ.
- **Uống nước trong ngày**: Hành vi (Chủ động, GV gợi ý, Không uống) và tần suất định lượng (Thường xuyên, Thỉnh thoảng, Hiếm khi).
- **Vệ sinh cá nhân & Đại tiện**: Vệ sinh chung (Rửa tay, Thay quần áo, Lau dọn; Hành vi: Chủ động, GV gợi ý, GV hỗ trợ) và Đại tiện tại trường (Chủ động & Tự đi, Chủ động & GV hỗ trợ, GV khuyến khích, Không đi).
- **Ghi chú chung gửi phụ huynh**: Dặn dò tổng quan và phản hồi tương tác tới phụ huynh.
- **Chăm sóc hàng loạt (Bulk Care)**: Cho phép giáo viên chọn nhiều trẻ cùng lúc (qua checkbox) và cập nhật đồng loạt các chỉ số hoặc áp dụng nhanh mẫu chuẩn 1-chạm.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/class/{classId}/nutrition` | repo:app/src/pages/[schoolCode]/class/[classId]/nutrition/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-05 | Quản lý chăm sóc sinh hoạt, dinh dưỡng bữa ăn, giấc ngủ, uống nước và vệ sinh cá nhân hàng ngày cho học sinh kèm hỗ trợ chăm sóc hàng loạt | DONE |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-05 | Chăm sóc sinh hoạt trẻ hàng ngày và cập nhật hàng loạt | Hoàn thiện 100% với Redux nutritionSlice, FilterBar 38px, SlideOver chuẩn Design System | MATCH | repo:app/src/pages/[schoolCode]/class/[classId]/nutrition/index.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng.

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Điểm danh học sinh](../screens/m2-sm1-diem-danh.md)
- [Bảng tin hoạt động lớp](../screens/m2-sm2-hoat-dong.md)
