---
title: Tin Nhắn Trao Đổi Phụ Huynh (Conversation Thread)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - VH-07
updated: 2026-11-05
---

# Tin Nhắn Trao Đổi Phụ Huynh (Conversation Thread)

## Định nghĩa
Thực thể Tin nhắn trao đổi phụ huynh đại diện cho các luồng hội thoại trực tiếp giữa giáo viên nhà trường và phụ huynh học sinh (kênh 1:1, kênh nhóm hoặc thông báo toàn lớp).

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| VH-07 | Hỗ trợ kênh trò chuyện 1:1 bảo mật giữa giáo viên chủ nhiệm và phụ huynh của từng học sinh | Tin nhắn tức thời qua WebSocket |
| VH-07 | Hỗ trợ gửi tập tin đính kèm (hình ảnh đơn xin nghỉ học, đơn thuốc, tài liệu học tập) | Giới hạn dung lượng an toàn |
| VH-07 | Lưu trữ lịch sử tin nhắn vĩnh viễn phục vụ tra cứu thông tin khi cần thiết | Thu hồi quyền nhắn tin khi học sinh chuyển lớp/trường |

## Quan hệ
- Giữa [Giáo viên & Nhân viên](teacher-staff.md) và phụ huynh của [Hồ sơ học sinh 360](student-profile.md).
- Gắn với ngữ cảnh của [Lớp học](classroom.md).
- Hiển thị trên [Màn hình trao đổi](../screens/m2-sm4-trao-doi.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-07 | Kênh trò chuyện tin nhắn đa chiều 1:1 trực tiếp giữa giáo viên và phụ huynh | Giao diện chat mới hiển thị mockup tĩnh, chưa có WebSocket gateway | MISSING | repo:app/src/features/conversations/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Màn hình trao đổi](../screens/m2-sm4-trao-doi.md)
- [Hồ sơ học sinh 360](student-profile.md)
