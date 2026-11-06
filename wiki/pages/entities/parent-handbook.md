---
title: Thực Thể Sổ Tay Phụ Huynh
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-027-school-parent-handbook/epic.md
spec_ids:
  - NT-11
updated: 2026-11-05
---

# Thực Thể Sổ Tay Phụ Huynh

## Định nghĩa
Đại diện cho tập hợp các bài viết hướng dẫn, quy định nội quy nhà trường, cẩm nang chăm sóc trẻ, quy trình đưa đón, chính sách học phí và các câu hỏi thường gặp (FAQ) được công bố cho phụ huynh tra cứu trực tiếp.

## Thuộc tính & Quy tắc nghiệp vụ
- Phân nhóm chuyên mục: Nội quy học đường, Quy định đưa đón & an toàn, Dinh dưỡng & y tế, Chính sách tài chính, Hướng dẫn sử dụng phần mềm.
- Trạng thái bài viết: `DRAFT`, `PUBLISHED`, `PINNED` (ghim lên đầu danh mục).
- Nội dung giàu đa phương tiện (Rich Text): Hỗ trợ hình ảnh minh họa, định dạng văn bản và tệp đính kèm hướng dẫn.

## Quan hệ
- Thuộc quyền quản lý của Ban Giám Hiệu tại [Phân hệ Nhà trường](../overview/module-school-admin.md).
- Hiển thị trực tiếp cho phụ huynh đại diện của [Hồ sơ học sinh 360](student-profile.md) trên ứng dụng phụ huynh.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-11 | Sổ tay phụ huynh điện tử công bố quy định và hướng dẫn của nhà trường | Type `ParentHandbook`, bài viết và form soạn thảo | MISSING | repo:app/src/types/parentHandbook.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình sổ tay phụ huynh](../screens/m5-sm10-so-tay-ph.md)
