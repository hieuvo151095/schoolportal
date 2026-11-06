---
title: Luồng Tiếp Nhận, Phân Luồng & Xử Lý Góp Ý Khiếu Nại
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-028-school-parent-feedback/epic.md
spec_ids:
  - NT-12
updated: 2026-11-05
---

# Luồng Tiếp Nhận, Phân Luồng & Xử Lý Góp Ý Khiếu Nại

## Mục tiêu
Thiết lập kênh giao tiếp chính quy, bảo mật và văn minh giữa phụ huynh với Ban Giám Hiệu, đảm bảo mọi thắc mắc, phản ánh dịch vụ hoặc sự cố học đường đều được xử lý đúng người, đúng thời hạn.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Phụ huynh | App Mobile | Soạn ý kiến phản hồi, chọn phân loại (Ăn uống, Giáo viên, Xe buýt...), đính kèm ảnh bằng chứng | Gửi góp ý vào hòm thư điện tử |
| 2 | Cán bộ tiếp nhận (BGH) | Web Admin | Mở hòm thư Góp ý, đọc nội dung và đánh giá mức độ ưu tiên (Khẩn cấp / Cao / Thường) | Phân loại khiếu nại |
| 3 | Cán bộ tiếp nhận | Web Admin | Phân công nhân sự phụ trách (`assignee`) kèm thời hạn chót giải quyết | Nhân sự phụ trách nhận được việc |
| 4 | Nhân sự xử lý | Web Admin / Trực tiếp | Kiểm tra xác minh sự việc, liên hệ phụ huynh giải quyết và nhập nội dung giải trình | Cập nhật tiến độ xử lý |
| 5 | Ban Giám Hiệu | Web Admin | Đóng góp ý và gửi thông báo phản hồi kết quả giải quyết chính thức tới phụ huynh | Đóng hồ sơ góp ý thành công |

## Quy tắc chặn / validation
- Các khiếu nại được đánh dấu `URGENT` (Khẩn cấp liên quan đến sức khỏe y tế hoặc an toàn bạo lực học đường) phải được phản hồi bước đầu trong vòng tối đa 2 giờ làm việc.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-12 | Hòm thư tiếp nhận và xử lý góp ý, phản hồi khiếu nại của phụ huynh học sinh | Hòm thư phản hồi phụ huynh, phân loại độ ưu tiên và modal phản hồi | MISSING | repo:app/src/pages/[schoolCode]/school/feedback/index.tsx:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Góp ý & Khiếu nại Phụ huynh](../entities/parent-feedback.md)
- [Màn hình hòm thư góp ý](../screens/m5-sm11-gop-y.md)
