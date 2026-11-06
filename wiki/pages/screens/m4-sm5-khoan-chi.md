---
title: Màn Hình Quản Lý Phiếu Chi
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-05
apps:
  - web
route_ids:
  - /{schoolCode}/finance/expenses
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Lý Phiếu Chi

## Mục đích
Lập, phê duyệt và theo dõi các khoản chi nội bộ của nhà trường kèm chứng từ gốc; hỗ trợ quản lý và giải ngân Phiếu chi hoàn tiền rút hồ sơ học sinh (`STUDENT_WITHDRAWAL_REFUND` - OQ-17) và Phiếu chi hoàn tiền thừa VietQR (`VIETQR_EXCESS_REFUND` - OQ-18) với quy trình duyệt 2 cấp Kế toán trưởng & Hiệu trưởng.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/finance/expenses` | repo:app/src/pages/[schoolCode]/finance/expenses.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-05 | Lập, trình duyệt và theo dõi vòng đời phiếu chi nội bộ kèm chứng từ đính kèm (bao gồm hoàn tiền rút hồ sơ OQ-17 và hoàn tiền thừa VietQR OQ-18) | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-05 | Lập, trình duyệt và theo dõi vòng đời phiếu chi nội bộ kèm chứng từ đính kèm | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/finance/expenses.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-17, OQ-18).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Kiến trúc thanh toán VietQR động](../concepts/vietqr-dynamic-reconciliation.md)
- [Luồng lập duyệt phiếu chi](../flows/fl-lap-duyet-phieu-chi.md)
