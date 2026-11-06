---
title: Thực Thể Khảo Sát & Bình Chọn
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-025-school-polls/epic.md
spec_ids:
  - NT-08
updated: 2026-11-05
---

# Thực Thể Khảo Sát & Bình Chọn

## Định nghĩa
Đại diện cho chiến dịch thu thập ý kiến phụ huynh hoặc giáo viên về các hoạt động ngoại khóa, đồng phục, thực đơn ăn bán trú hoặc các chính sách vận hành của nhà trường.

## Thuộc tính & Quy tắc nghiệp vụ
- Loại câu hỏi: Chọn một đáp án (Single choice), chọn nhiều đáp án (Multiple choice), câu hỏi đóng/mở.
- Thời gian hiệu lực: `start_time` đến `end_time`. Khi hết hạn, form bình chọn tự động khóa và tính toán tỷ lệ % kết quả.
- Tùy chọn ẩn danh (Anonymous) hoặc công khai danh tính người bình chọn.
- Mỗi phụ huynh đại diện cho một học sinh chỉ được bỏ phiếu một lần duy nhất cho mỗi câu hỏi.

## Quan hệ
- Khởi tạo bởi Ban Giám Hiệu hoặc [Giáo viên & Nhân viên](teacher-staff.md).
- Gắn với đối tượng học sinh thông qua [Hồ sơ học sinh 360](student-profile.md) để kiểm tra tính hợp lệ của người bỏ phiếu.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-08 | Khởi tạo bình chọn và khảo sát ý kiến trực tuyến của phụ huynh và giáo viên | Type `Poll`, Redux slice và validation form | MISSING | repo:app/src/types/poll.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình bình chọn](../screens/m5-sm7-binh-chon.md)
- [Luồng khảo sát bình chọn](../flows/fl-khao-sat-binh-chon.md)
