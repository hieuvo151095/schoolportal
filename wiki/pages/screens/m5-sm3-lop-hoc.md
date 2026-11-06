---
title: Màn Hình Quản Lý Lớp Học
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-04
apps:
  - web
route_ids:
  - /{schoolCode}/school/classes
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Lý Lớp Học

## Mục đích
Phân chia lớp chính khóa/ngoại khóa, cấu hình mô hình tính phí ngoại khóa linh hoạt theo kỳ (`TERM_FIXED`) hoặc theo buổi thực tế (`PER_SESSION` - OQ-14), và thực thi chốt chặn an toàn khi xóa lớp: cấm xóa cứng lớp đang có học sinh hoặc còn học sinh nợ học phí (`balance_due > 0`), chuyển trạng thái lớp sang "Lưu trữ" (`Archived`) khi kết thúc niên khóa và bảo toàn chuyển giao công nợ sang năm học mới (`Carried-over Debt`).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/classes` | repo:app/src/pages/[schoolCode]/school/classes.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm biểu phí linh hoạt OQ-14 và chốt chặn an toàn khi xóa lớp | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm chốt chặn an toàn khi xóa lớp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/classes.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-05, OQ-12, OQ-14).

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Lớp học](../entities/classroom.md)
- [Khái niệm Chốt chặn an toàn khi xóa lớp](../concepts/class-deletion-guard.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Luồng chuyển lớp và chuyển năm học](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md)
