---
title: "Cấu hình Lịch & Quy tắc Thông báo Toàn trường"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Cấu hình Lịch & Quy tắc Thông báo Toàn trường (`M6/SM6`)

## Mục đích

Thiết lập lịch phát thông báo tự động (thông báo điểm danh, nhắc nộp học phí, thực đơn ngày mai) áp dụng cho mọi tài khoản trên toàn bộ nền tảng.

Thuộc phân hệ **[Cấu hình](../overview/module-m6-cau-hinh.md)**. Mã định danh tính năng Harness Loop: **`F038`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/setting/notification`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/notificationSettings.ts`
  - `docs/src/utils/notificationSettingsValidation.ts`
  - `docs/tests/unit/notificationSettings.test.mjs`

## Yêu cầu spec

- **SPEC-F038-01**: Cấu hình khung giờ gửi thông báo đẩy (Push notification) tự động.
- **SPEC-F038-02**: Bật / tắt các sự kiện kích hoạt thông báo (điểm danh đón/trả, phát hành hóa đơn).
- **SPEC-F038-03**: Đảm bảo không gửi thông báo làm phiền ngoài giờ quy định của trường.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F038-01` | Cấu hình khung giờ gửi thông báo đẩy (Push notification) tự ... | `OK` | repo:app/src/utils/notificationSettingsValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/notificationSettings.test.mjs |
| `SPEC-F038-02` | Bật / tắt các sự kiện kích hoạt thông báo (điểm danh đón/trả... | `OK` | repo:app/src/utils/notificationSettingsValidation.ts:35 | Đã hoàn thành và verify qua tests/unit/notificationSettings.test.mjs |
| `SPEC-F038-03` | Đảm bảo không gửi thông báo làm phiền ngoài giờ quy định của... | `OK` | repo:app/src/utils/notificationSettingsValidation.ts:70 | Đã hoàn thành và verify qua tests/unit/notificationSettings.test.mjs |

## Liên quan

- Phân hệ cha: [Cấu hình](../overview/module-m6-cau-hinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
