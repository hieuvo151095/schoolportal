---
title: Màn Hình Bài Tập Về Nhà
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - HT-02
  - HT-06
apps:
  - web
route_ids:
  - /{schoolCode}/academics/assignment
status: missing
updated: 2026-11-05
---

# Màn Hình Bài Tập Về Nhà

## Mục đích
Cho phép giáo viên tạo bài tập về nhà, đính kèm tài liệu và theo dõi tiến độ nộp bài của học sinh.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/academics/assignment` | repo:app/src/pages/[schoolCode]/academics/assignment.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| HT-02 | Tạo bài tập về nhà kèm hạn nộp và theo dõi trạng thái nộp bài của học sinh | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-02 | Tạo bài tập về nhà kèm hạn nộp và theo dõi trạng thái nộp bài của học sinh | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/academics/assignment.tsx |
| HT-06 | Quy tắc bảo toàn tiêu đề bài tập khi chỉnh sửa và cấm xóa bài tập đã có học sinh nộp bài | Prototype frontend mockup, chưa có ràng buộc nghiệp vụ xóa bài tập | MISSING | repo:app/src/pages/[schoolCode]/academics/assignment.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-academics.md)
- [Thực thể liên quan](../entities/homework-assignment.md)
- [Thực thể liên quan](../entities/student-profile.md)
