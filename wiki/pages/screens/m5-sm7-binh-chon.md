---
title: "Bình chọn & Khảo sát Ý kiến Phụ huynh (Polls)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Bình chọn & Khảo sát Ý kiến Phụ huynh (Polls) (`M5/SM7`)

## Mục đích

Tạo các cuộc khảo sát ý kiến nhiều lựa chọn, phân tách giữa soạn nháp và phát hành, theo dõi tiến độ bình chọn qua biểu đồ tròn thời gian thực.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F031`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/school/poll`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/poll.ts`
  - `docs/src/utils/pollValidation.ts`
  - `docs/tests/unit/poll.test.mjs`

## Yêu cầu spec

- **SPEC-F031-01**: Tạo câu hỏi khảo sát một hoặc nhiều lựa chọn, đặt hạn bình chọn.
- **SPEC-F031-02**: Phân tách rõ ràng trạng thái Soạn nháp và Đã phát hành.
- **SPEC-F031-03**: Biểu đồ tròn trực quan hiển thị tỷ lệ phản hồi và lịch sử sửa đổi phiếu bầu.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F031-01` | Tạo câu hỏi khảo sát một hoặc nhiều lựa chọn, đặt hạn bình c... | `MISSING` | repo:app/src/types/poll.ts:1 | Cần triển khai và verify |
| `SPEC-F031-02` | Phân tách rõ ràng trạng thái Soạn nháp và Đã phát hành.... | `MISSING` | repo:app/src/types/poll.ts:1 | Cần triển khai và verify |
| `SPEC-F031-03` | Biểu đồ tròn trực quan hiển thị tỷ lệ phản hồi và lịch sử sử... | `MISSING` | repo:app/src/types/poll.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
