---
title: Màn Hình Báo Cáo Học Phí
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - TC-07
apps:
  - web
route_ids:
  - /{schoolCode}/finance/fee-reports
status: missing
updated: 2026-11-05
---

# Màn Hình Báo Cáo Học Phí

## Mục đích
Biểu đồ trực quan theo dõi tỷ lệ hoàn thành học phí toàn trường và từng lớp (Đã nộp, Nộp một phần, Chưa nộp).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/finance/fee-reports` | repo:app/src/pages/[schoolCode]/finance/fee-reports.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-07 | Báo cáo trực quan tỷ lệ hoàn thành thu học phí toàn trường và theo từng lớp | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-07 | Báo cáo trực quan tỷ lệ hoàn thành thu học phí toàn trường và theo từng lớp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/finance/fee-reports.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-finance.md)
- [Thực thể liên quan](../entities/tuition-invoice.md)
