---
title: "Chính sách Miễn giảm & Động cơ Tự động Áp dụng Mức cao nhất"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Chính sách Miễn giảm & Động cơ Tự động Áp dụng Mức cao nhất (`M4/SM8`)

## Mục đích

Quản lý các chính sách miễn giảm học phí (% hoặc VNĐ) theo lớp hoặc học sinh cụ thể; thực thi thuật toán tập giao 24 khoản phí và động cơ giải quyết xung đột tự động áp dụng mức ưu đãi cao nhất khi học sinh có từ 2 chính sách hợp lệ.

Thuộc phân hệ **[Tài chính](../overview/module-m4-tai-chinh.md)**. Mã định danh tính năng Harness Loop: **`F014`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/discount`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/discount.ts`
  - `docs/src/utils/discountValidation.ts`
  - `docs/tests/unit/discount.test.mjs`

## Yêu cầu spec

- **SPEC-F014-01**: Thuật toán tập giao toán học: Trường 'Khoản phí áp dụng' tự động lọc tập giao các khoản phí giữa các lớp/học sinh được chọn.
- **SPEC-F014-02**: Quy tắc 01 chính sách duy nhất cho mỗi khoản thu: Cảnh báo trùng lặp và checkbox xác nhận thay thế bắt buộc.
- **SPEC-F014-03**: Động cơ giải quyết xung đột khi lập hóa đơn: Tự động so sánh và áp dụng mức giảm có giá trị thực tế cao nhất (Math.max).
- **SPEC-F014-04**: Tự động chuyển trạng thái Hết hạn khi qua kỳ áp dụng, hỗ trợ tạm dừng/kích hoạt lại và xuất Excel UTF-8 tiếng Việt.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F014-01` | Thuật toán tập giao toán học: Trường 'Khoản phí áp dụng' tự ... | `OK` | repo:app/tests/unit/discount.test.mjs:1 | Đã kiểm chứng 15/15 unit tests |
| `SPEC-F014-02` | Quy tắc 01 chính sách duy nhất cho mỗi khoản thu: Cảnh báo t... | `OK` | repo:app/tests/unit/discount.test.mjs:1 | Đã kiểm chứng 15/15 unit tests |
| `SPEC-F014-03` | Động cơ giải quyết xung đột khi lập hóa đơn: Tự động so sánh... | `OK` | repo:app/tests/unit/discount.test.mjs:1 | Đã kiểm chứng 15/15 unit tests |
| `SPEC-F014-04` | Tự động chuyển trạng thái Hết hạn khi qua kỳ áp dụng, hỗ trợ... | `OK` | repo:app/tests/unit/discount.test.mjs:1 | Đã kiểm chứng 15/15 unit tests |

## Liên quan

- Phân hệ cha: [Tài chính](../overview/module-m4-tai-chinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
