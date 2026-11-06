---
title: Luồng Khởi Tạo & Lấy Ý Kiến Khảo Sát Bình Chọn
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-025-school-polls/epic.md
spec_ids:
  - NT-08
updated: 2026-11-05
---

# Luồng Khởi Tạo & Lấy Ý Kiến Khảo Sát Bình Chọn

## Mục tiêu
Cho phép Ban Giám Hiệu và giáo viên tạo các cuộc khảo sát, lấy ý kiến tập thể phụ huynh học sinh một cách minh bạch, tiện lợi, tự động tổng hợp tỷ lệ phần trăm biểu quyết.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Người quản trị | Web Admin | Vào màn hình Bình chọn, nhấn "Tạo cuộc bình chọn mới" | Mở giao diện thiết lập khảo sát |
| 2 | Người tạo | Web Admin | Điền câu hỏi, danh sách tùy chọn trả lời, đối tượng tham gia (toàn trường / theo lớp), hạn kết thúc | Thiết lập hoàn tất |
| 3 | Người tạo | Web Admin | Nhấn "Phát hành khảo sát" | Gửi thông báo khảo sát tới ứng dụng phụ huynh |
| 4 | Phụ huynh | App Mobile | Mở thông báo, chọn phương án biểu quyết và bấm "Xác nhận gửi" | Ghi nhận 01 phiếu biểu quyết |
| 5 | Người quản trị | Web Admin | Theo dõi biểu đồ tròn kết quả theo thời gian thực và kết xuất file báo cáo | Xuất báo cáo tỷ lệ đồng thuận |

## Quy tắc chặn / validation
- Bắt buộc phải có ít nhất 2 phương án lựa chọn trong một câu hỏi bình chọn.
- Khi thời gian khảo sát kết thúc (`now > end_time`), hệ thống tự động khóa tính năng bỏ phiếu, không phụ huynh nào có thể gửi thêm đáp án.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-08 | Khởi tạo bình chọn và khảo sát ý kiến trực tuyến của phụ huynh và giáo viên | Giao diện tạo bình chọn, danh sách và Redux slice | MISSING | repo:app/src/pages/[schoolCode]/school/poll/create.tsx:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Khảo sát & Bình chọn](../entities/school-poll.md)
- [Màn hình bình chọn](../screens/m5-sm7-binh-chon.md)
