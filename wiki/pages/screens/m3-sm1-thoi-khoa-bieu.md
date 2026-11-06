---
title: Màn Hình Thời Khóa Biểu
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - HT-01
apps:
  - web
route_ids:
  - /{schoolCode}/academics/schedule
status: missing
updated: 2026-11-05
---

# Màn Hình Thời Khóa Biểu

## Mục đích
Lập ma trận lịch học tuần theo tiết, môn học, giáo viên và phòng học; tích hợp Bộ điều phối xung đột 4 chiều kiểm tra trùng lịch giữa chính khóa và ngoại khóa (học sinh, giáo viên, phòng học, sĩ số - OQ-14); công bố lịch học chính thức tới phụ huynh.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/academics/schedule` | repo:app/src/pages/[schoolCode]/academics/schedule.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| HT-01 | Thiết lập và công bố thời khóa biểu tuần theo tiết học, môn học, phòng học, giáo viên và điều phối xung đột 4 chiều OQ-14 | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-01 | Thiết lập và công bố thời khóa biểu tuần theo tiết học, môn học, phòng học và giáo viên | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/academics/schedule.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-14).

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Thời khóa biểu tuần](../entities/timetable-weekly.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Luồng lập thời khóa biểu](../flows/fl-lap-thoi-khoa-bieu.md)
