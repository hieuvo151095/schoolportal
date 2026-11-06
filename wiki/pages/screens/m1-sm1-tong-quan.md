---
title: Màn Hình Tổng Quan Điều Hành
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - TQ-01
  - TQ-02
  - TQ-03
apps:
  - web
route_ids:
  - /{schoolCode}/
status: missing
updated: 2026-11-05
---

# Màn Hình Tổng Quan Điều Hành

## Mục đích
Cung cấp bảng điều khiển trung tâm (Dashboard) cho Ban Giám Hiệu và Quản trị viên, hiển thị tổng hợp chỉ số học sinh, giáo viên, tỷ lệ điểm danh hôm nay và biểu đồ thu nộp học phí toàn trường.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/` | repo:app/src/pages/[schoolCode]/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TQ-01 | Dashboard hiển thị tổng quan số liệu sĩ số học sinh, giáo viên, lớp học theo thời gian thực | MISSING |
| TQ-02 | Thống kê tỷ lệ điểm danh học sinh trong ngày (có mặt, vắng có phép, vắng không phép) | MISSING |
| TQ-03 | Biểu đồ thu nộp học phí và tiến độ nộp theo tháng/học kỳ toàn trường | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TQ-01 | Dashboard hiển thị tổng quan số liệu sĩ số học sinh, giáo viên, lớp học theo thời gian thực | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/index.tsx |
| TQ-02 | Thống kê tỷ lệ điểm danh học sinh trong ngày (có mặt, vắng có phép, vắng không phép) | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/index.tsx |
| TQ-03 | Biểu đồ thu nộp học phí và tiến độ nộp theo tháng/học kỳ toàn trường | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/index.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-overview.md)
- [Thực thể liên quan](../entities/student-profile.md)
- [Thực thể liên quan](../entities/attendance-daily.md)
- [Thực thể liên quan](../entities/tuition-invoice.md)
