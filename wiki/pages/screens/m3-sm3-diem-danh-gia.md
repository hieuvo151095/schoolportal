---
title: Màn Hình Sổ Điểm Đánh Giá
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - HT-03
apps:
  - web
route_ids:
  - /{schoolCode}/academics/gradebook
status: missing
updated: 2026-11-05
---

# Màn Hình Sổ Điểm Đánh Giá

## Mục đích
Nhập và tính toán điểm kiểm tra thường xuyên, giữa kỳ, cuối kỳ và điểm trung bình theo chuẩn Bộ GD&ĐT; quản lý khóa sổ điểm (`locked`), cơ chế Scoped Temporary Unlock mở cục bộ 1 ô điểm trong tối đa 60 phút có phê duyệt BGH và lưu vết `GradeAuditTrail` bất biến; cùng tính năng ánh xạ bảo toàn điểm số khi tiếp nhận học sinh chuyển trường giữa kỳ.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/academics/gradebook` | repo:app/src/pages/[schoolCode]/academics/gradebook.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| HT-03 | Nhập sổ điểm và đánh giá định kỳ theo quy chuẩn chuẩn hóa của Bộ GD&ĐT | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-03 | Nhập sổ điểm và đánh giá định kỳ theo quy chuẩn chuẩn hóa của Bộ GD&ĐT | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/academics/gradebook.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-academics.md)
- [Chuẩn đánh giá học sinh MoET](../concepts/curriculum-assessment-standard.md)
- [Thực thể liên quan](../entities/gradebook-record.md)
- [Luồng liên quan](../flows/fl-nhap-so-diem.md)
