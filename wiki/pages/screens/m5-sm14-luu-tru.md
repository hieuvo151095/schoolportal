---
title: Màn Hình Kho Lưu Trữ
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-15
apps:
  - web
route_ids:
  - /{schoolCode}/school/archive
status: missing
updated: 2026-11-05
---

# Màn Hình Kho Lưu Trữ

## Mục đích
Lưu trữ hồ sơ học sinh đã thôi học, chuyển trường hoặc tốt nghiệp trong kho lạnh; quản lý hồ sơ thanh lý rút học phí giữa kỳ Pro-rata và phiếu chi hoàn tiền (OQ-17); thực thi chốt chặn khôi phục học sinh (bắt buộc chỉ định một lớp học đích đang hoạt động thuộc niên khóa hiện hành nếu lớp cũ đã bị xóa/giải tán, kiểm tra sĩ số an toàn); và thực thi chốt chặn bảo toàn công nợ khi xóa vĩnh viễn (cấm xóa nếu `balance_due > 0`, yêu cầu xác nhận 2 bước cảnh báo đỏ).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/archive` | repo:app/src/pages/[schoolCode]/school/archive.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-15 | Kho lưu trữ học sinh chuyển trường, hoàn thành chương trình, tốt nghiệp và rút hồ sơ Pro-rata OQ-17 | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-15 | Kho lưu trữ học sinh chuyển trường, hoàn thành chương trình hoặc tốt nghiệp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/archive.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-12, OQ-17).

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Hồ sơ học sinh 360](../entities/student-profile.md)
- [Thực thể hồ sơ lưu trữ học sinh](../entities/student-archive-record.md)
- [Thực thể Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Luồng kho lưu trữ học sinh](../flows/fl-kho-luu-tru-hoc-sinh.md)
