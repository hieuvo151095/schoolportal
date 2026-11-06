---
title: Màn Hình Quản Lý Niên Khóa
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-14
apps:
  - web
route_ids:
  - /{schoolCode}/school/academic-year
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Lý Niên Khóa

## Mục đích
Quản lý niên khóa, phân kỳ các học kỳ (Học kỳ 1, 2, Hè) và kích hoạt năm học hiện hành.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/academic-year` | repo:app/src/pages/[schoolCode]/school/academic-year.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-14 | Quản lý niên khóa học, các kỳ học và kích hoạt niên khóa hiện hành | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-14 | Quản lý niên khóa học, các kỳ học và kích hoạt niên khóa hiện hành | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/academic-year.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Luồng liên quan](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md)
