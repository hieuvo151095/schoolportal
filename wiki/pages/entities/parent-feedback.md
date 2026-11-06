---
title: Thực Thể Góp Ý & Khiếu Nại Phụ Huynh
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-028-school-parent-feedback/epic.md
spec_ids:
  - NT-12
updated: 2026-11-05
---

# Thực Thể Góp Ý & Khiếu Nại Phụ Huynh

## Định nghĩa
Đại diện cho các ý kiến đóng góp, phản hồi chất lượng đào tạo, khiếu nại dịch vụ bán trú hoặc yêu cầu hỗ trợ từ phụ huynh học sinh gửi tới Ban Giám Hiệu nhà trường.

## Thuộc tính & Quy tắc nghiệp vụ
- Phân loại: Dinh dưỡng bán trú, Cơ sở vật chất, Giảng dạy đào tạo, Xe buýt đưa đón, Tài chính học phí, Khác.
- Mức độ ưu tiên: Khẩn cấp (`URGENT`), Cao (`HIGH`), Bình thường (`NORMAL`), Thấp (`LOW`).
- Trạng thái xử lý: `PENDING` (chờ tiếp nhận), `PROCESSING` (đang xử lý), `RESOLVED` (đã giải quyết), `CLOSED` (đóng phản ánh).
- Phân công xử lý: Gán nhân sự chịu trách nhiệm giải quyết (`assignee_id`) kèm hạn hoàn thành (`deadline`).

## Quan hệ
- Gửi bởi phụ huynh gắn liền với [Hồ sơ học sinh 360](student-profile.md).
- Tiếp nhận và xử lý bởi [Giáo viên & Nhân viên](teacher-staff.md) có thẩm quyền quản trị.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-12 | Hòm thư tiếp nhận và xử lý góp ý, phản hồi khiếu nại của phụ huynh học sinh | Type `Feedback`, danh sách inbox và modal phản hồi | MISSING | repo:app/src/types/feedback.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình hòm thư góp ý](../screens/m5-sm11-gop-y.md)
- [Luồng tiếp nhận và xử lý góp ý](../flows/fl-tiep-nhan-xu-ly-gop-y.md)
