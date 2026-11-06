---
title: Thực Thể Hồ Sơ Lưu Trữ Học Sinh (Student Archive Record)
type: entity
sources:
  - repo:docs/guides/development/E-030-school-archive/epic.md
  - repo:docs/guides/decisions.md
  - pages/sources/src-open-questions-resolutions.md
updated: 2026-11-05
spec_ids:
  - NT-17
  - NT-10
---

# Thực Thể Hồ Sơ Lưu Trữ Học Sinh (Student Archive Record)

## Định nghĩa
Hồ sơ lưu trữ học sinh là thực thể đại diện cho trạng thái lưu trữ kho lạnh (cold storage) của học sinh đã thôi học, chuyển trường hoặc tốt nghiệp ra trường. Khi học sinh được đưa vào kho lưu trữ, toàn bộ thông tin cá nhân và lịch sử học tập được đóng băng và cô lập hoàn toàn khỏi danh sách vận hành hàng ngày và danh sách tính phí học phí, nhưng vẫn được lưu giữ vĩnh viễn để phục vụ tra cứu học bạ, quyết toán tài chính và phục hồi khi cần thiết.

## Thuộc tính / quy tắc nghiệp vụ
- **Mã định danh:** `id` (UUIDv4).
- **Học sinh liên kết:** `studentId` (trỏ tới `student-profile`).
- **Lý do lưu trữ:** `archiveReason`: Thôi học (`withdrawn`), Chuyển trường (`transferred`), Tốt nghiệp ra trường (`graduated`), Khác (`other`).
- **Ngày chuyển lưu trữ:** `archivedAt` (ngày thực hiện đóng băng).
- **Người thực hiện:** `archivedBy` (mã nhân viên hoặc admin thao tác).
- **Lớp học cuối cùng:** `formerClassId` (mã lớp trước khi đưa vào kho lưu trữ).
- **Niên khóa lưu trữ:** `academicYearId` (niên khóa phát sinh việc chuyển kho).
- **Trạng thái lưu trữ:** `status`:
  - `archived`: Đang nằm trong kho lưu trữ, không xuất hiện ở danh sách điểm danh, hoạt động hay thu phí.
  - `restored`: Đã được phục hồi trở lại danh sách học sinh hoạt động.
  - `purged`: Đã bị xóa vĩnh viễn sau quy trình xác nhận 2 bước có cảnh báo màu đỏ (LT-02).
- **Quy tắc cách ly hoàn toàn (NT-17):** Học sinh trong kho lưu trữ bị loại trừ 100% khỏi các bộ đếm sĩ số lớp, bộ đếm KPI trường, danh sách sinh hóa đơn tự động và danh sách điểm danh đón trả.
- **Quy tắc phục hồi bắt buộc chọn lớp đích (NT-17, OQ-12):** Khi phục hồi học sinh (`LT-01`), hệ thống kiểm tra xem lớp học cũ (`formerClassId`) có còn đang hoạt động trong niên khóa hiện tại không. Nếu lớp còn hoạt động, cho phép phục hồi về lớp cũ (kiểm tra sĩ số). Nếu lớp cũ đã kết thúc, giải tán hoặc đã bị xóa, hệ thống CHẶN không cho phục hồi mồ côi mà BẮT BUỘC Admin phải chọn một **Lớp học đích đang hoạt động (`target_class_id`)** thuộc niên khóa hiện hành, đồng thời kiểm tra sĩ số an toàn trước khi kích hoạt phục hồi.
- **Chốt chặn công nợ khi xóa vĩnh viễn (LT-02, OQ-12):** Tuyệt đối cấm xóa vĩnh viễn (`purged`) học sinh trong kho lưu trữ nếu vẫn còn bất kỳ hóa đơn công nợ nào chưa thanh toán (`balance_due > 0`). Chỉ cho phép xóa khi đã tất toán 100% công nợ và hoàn thành xác thực 2 bước nền đỏ.
- **Hồ sơ thanh lý rút học phí giữa kỳ (OQ-17):** Đối với học sinh thôi học giữa kỳ (`withdrawn`), hồ sơ lưu trữ liên kết với Biên bản thanh lý học phí Pro-rata (`settlementStatementId`) và Phiếu chi hoàn tiền (`refundVoucherId`). Toàn bộ hóa đơn tương lai bị hủy vĩnh viễn, tài khoản Mobile App chuyển sang chế độ `READ_ONLY_ARCHIVE` chỉ đọc lịch sử.

## Quan hệ
- Đóng băng dữ liệu của một [Học sinh](student-profile.md).
- Ghi nhận thông tin lớp học cũ với [Lớp học](classroom.md).
- Gắn với một [Niên khóa](academic-year.md).
- Liên kết với [Phiếu chi nội bộ](expense-voucher.md) khi hoàn tiền thanh lý rút hồ sơ.
- Quản lý tại [Màn hình kho lưu trữ](../screens/m5-sm14-luu-tru.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-17 | Cách ly kho lạnh, kiểm tra lớp khi phục hồi và bảo vệ 2 bước khi xóa | Đã có màn hình `/school/archive` với modal xác nhận | MISSING | repo:app/src/pages/[schoolCode]/school/archive/index.tsx:1 |
| NT-10 | Quản lý kho lưu trữ học sinh chuyển trường, thôi học | Mockup danh sách và bộ lọc tháng lưu trữ hoàn tất | MISSING | repo:app/src/features/students/ |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Thực thể Phiếu chi nội bộ](expense-voucher.md)
- [Luồng kho lưu trữ học sinh](../flows/fl-kho-luu-tru-hoc-sinh.md)
- [Màn hình kho lưu trữ](../screens/m5-sm14-luu-tru.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
