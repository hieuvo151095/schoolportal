---
title: "Kênh Trao đổi Tin nhắn Phụ huynh"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Kênh Trao đổi Tin nhắn Phụ huynh (`M2/SM4`)

## Mục đích

Kênh trao đổi thời gian thực giữa giáo viên và phụ huynh (chat 1:1, nhóm học sinh, thông báo lớp), hỗ trợ đính kèm tệp, ghim tin nhắn và lưu trữ hội thoại.

Thuộc phân hệ **[Vận hành](../overview/module-m2-van-hanh.md)**. Mã định danh tính năng Harness Loop: **`F023`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/conversations`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/conversation.ts`
  - `docs/src/utils/conversationValidation.ts`
  - `docs/tests/unit/conversations.test.mjs`

## Yêu cầu spec

- **SPEC-F023-01**: Danh sách hội thoại và khung chat cuộn độc lập mượt mà.
- **SPEC-F023-02**: Khung soạn tin tinh gọn hỗ trợ đính kèm tệp và biểu tượng cảm xúc.
- **SPEC-F023-03**: Hỗ trợ ghim tối đa 3 tin nhắn quan trọng và tính năng khóa gửi tin nhắn khi cần thiết.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F023-01` | Danh sách hội thoại và khung chat cuộn độc lập mượt mà.... | `OK` | repo:app/src/utils/conversationValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/conversations.test.mjs |
| `SPEC-F023-02` | Khung soạn tin tinh gọn hỗ trợ đính kèm tệp và biểu tượng cả... | `OK` | repo:app/src/utils/conversationValidation.ts:35 | Đã hoàn thành và verify qua tests/unit/conversations.test.mjs |
| `SPEC-F023-03` | Hỗ trợ ghim tối đa 3 tin nhắn quan trọng và tính năng khóa g... | `OK` | repo:app/src/utils/conversationValidation.ts:75 | Đã hoàn thành và verify qua tests/unit/conversations.test.mjs |

## Liên quan

- Phân hệ cha: [Vận hành](../overview/module-m2-van-hanh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
