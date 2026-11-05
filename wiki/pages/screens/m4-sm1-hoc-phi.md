---
title: "Lập Hóa đơn Học phí & Thu phí VietQR Động"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Lập Hóa đơn Học phí & Thu phí VietQR Động (`M4/SM1`)

## Mục đích

Phát hành hóa đơn thu phí học sinh (toàn trường, khối, lớp, cá nhân), tự động khấu trừ ngày ăn tháng trước (M+1), tự động áp dụng chính sách miễn giảm, hỗ trợ giảm tiền mặt cố định và tích hợp mã VietQR động.

Thuộc phân hệ **[Tài chính](../overview/module-m4-tai-chinh.md)**. Mã định danh tính năng Harness Loop: **`F015`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/fee`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/invoice.ts`
  - `docs/src/utils/invoiceValidation.ts`
  - `docs/tests/unit/invoices.test.mjs`

## Yêu cầu spec

- **SPEC-F015-01**: Tự động nhận diện số ngày nghỉ có phép tháng trước từ phân hệ Điểm danh để tính khấu trừ tiền ăn trên dòng hóa đơn.
- **SPEC-F015-02**: Bảng chi tiết dòng khoản thu chuẩn hóa: cột 'Giảm trừ', định dạng đơn giá dấu chấm, chuyển đổi linh hoạt giữa [%] và [đ].
- **SPEC-F015-03**: Tự động áp dụng chính sách miễn giảm cao nhất và sinh mã VietQR động chuẩn ngân hàng theo số tiền thực thu.
- **SPEC-F015-04**: Quản lý vòng đời hóa đơn: Đã tạo, Đã gửi, Nộp một phần, Đã hoàn thành, Quá hạn, Đã hủy.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F015-01` | Tự động nhận diện số ngày nghỉ có phép tháng trước từ phân h... | `OK` | repo:app/tests/unit/invoices.test.mjs:1 | Đã kiểm chứng 25/25 unit tests |
| `SPEC-F015-02` | Bảng chi tiết dòng khoản thu chuẩn hóa: cột 'Giảm trừ', định... | `OK` | repo:app/tests/unit/invoices.test.mjs:1 | Đã kiểm chứng 25/25 unit tests |
| `SPEC-F015-03` | Tự động áp dụng chính sách miễn giảm cao nhất và sinh mã Vie... | `OK` | repo:app/tests/unit/invoices.test.mjs:1 | Đã kiểm chứng 25/25 unit tests |
| `SPEC-F015-04` | Quản lý vòng đời hóa đơn: Đã tạo, Đã gửi, Nộp một phần, Đã h... | `OK` | repo:app/tests/unit/invoices.test.mjs:1 | Đã kiểm chứng 25/25 unit tests |

## Liên quan

- Phân hệ cha: [Tài chính](../overview/module-m4-tai-chinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
