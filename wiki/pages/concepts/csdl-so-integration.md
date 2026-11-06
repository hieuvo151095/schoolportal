---
title: Kiến Trúc Tích Hợp Cơ Sở Dữ Liệu Bộ/Sở GD&ĐT (CSDL Sở)
type: concept
sources:
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-010-finance-fee-catalog/epic.md
spec_ids:
  - TC-19
  - TC-20
updated: 2026-11-05
---

# Kiến Trúc Tích Hợp Cơ Sở Dữ Liệu Bộ/Sở GD&ĐT (CSDL Sở)

## Định nghĩa
Kiến trúc liên thông và chuẩn hóa dữ liệu giữa School Operating Portal với hệ thống quản trị trung tâm Managing Portal và Cơ sở dữ liệu của Bộ/Sở Giáo Dục & Đào Tạo, bảo đảm toàn bộ danh mục tài chính và thông tin định danh học sinh tuân thủ nghiêm ngặt quy định quản lý nhà nước.

## Quy tắc
1. **Chuẩn hóa danh mục nguồn thu:**
   - Các khoản thu học phí, tiền ăn, bảo hiểm y tế bắt buộc phải được ánh xạ với mã danh mục chuẩn của CSDL Sở (`RevenueCategory`).
   - Trường học không được tự ý sửa mã hoặc định dạng báo cáo khi khoản thu đã được gán nhãn bắt buộc theo luật định.
2. **Cơ chế đồng bộ dữ liệu (Data Sync Engine):**
   - Khi Ban Giám Hiệu nhấn "Đồng bộ từ CSDL Sở", hệ thống gọi API sang Managing Portal để cập nhật phiên bản mới nhất của danh mục thu.
   - Các khoản thu đã ngừng áp dụng trên CSDL Sở (`ARCHIVED`) sẽ tự động bị vô hiệu hóa tạo mới trên đợt thu học phí tiếp theo của trường.
3. **Báo cáo định kỳ:**
   - Dữ liệu thu học phí và tỷ lệ hoàn thành được kết xuất tự động theo biểu mẫu chuẩn để nộp báo cáo cho Phòng/Sở GD&ĐT mà không cần kế toán nhập tay lại.
4. **Cơ chế đóng băng dữ liệu kỳ thi (Sync Locked / Exam Freeze - OQ-15):**
   - Khi Sở GD&ĐT ban hành mốc chốt dữ liệu phục vụ kỳ thi học kỳ hoặc xét chuyển cấp, Quản trị viên kích hoạt trạng thái `is_sync_locked = true` cho khối lớp/kỳ thi tương ứng.
   - Khi cờ này kích hoạt, toàn bộ thông tin định danh học sinh (`full_name`, `dob`, `gender`, `national_id_number`, `moet_student_code`, `class_id`) bị khóa cứng ở trạng thái chỉ đọc (Read-Only).
   - Mọi đề nghị điều chỉnh bắt buộc phải lập phiếu yêu cầu có chữ ký số của Ban Giám Hiệu và ghi vết bất biến vào `SyncLockAuditTrail`.
5. **Hòa giải sai lệch dữ liệu hai chiều (Bidirectional Data Drift Reconciliation - OQ-15):**
   - Hệ thống chạy quét định kỳ đối soát giữa CSDL Portal và CSDL ngành của Sở. CSDL ngành được coi là căn cứ pháp lý số danh bộ (Legal Ground Truth).
   - Khi phát hiện sai lệch (Data Drift), hệ thống hiển thị bảng đối chiếu 2 cột (`Giá trị CSDL Sở` vs `Giá trị Portal`) tại màn hình quản lý, cho phép Ban Giám Hiệu chọn: (a) *Cập nhật theo Sở* (Pull to Portal) hoặc (b) *Lập biên bản giải trình sai lệch*.
6. **Cô lập lỗi ngắt quãng từng học sinh (Per-Student Partial Failure Isolation & DLQ - OQ-15):**
   - Tiến trình đồng bộ dữ liệu theo lô (Batch Sync) xử lý mỗi học sinh như một giao dịch con (Sub-transaction) độc lập.
   - Nếu học sinh bị lỗi (sai định dạng, trùng mã số định danh), hệ thống chỉ đánh dấu học sinh đó là `SYNC_FAILED`, đẩy vào Hàng đợi thử lại (Retry Queue với Exponential Backoff 3 lần) hoặc Dead Letter Queue (DLQ).
   - Toàn bộ các học sinh hợp lệ khác trong lô vẫn được đồng bộ thành công (`SYNC_SUCCESS`), không bao giờ rollback toàn bộ lô.

## Áp dụng ở đâu
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Danh mục thu CSDL Sở](../entities/revenue-category.md)
- [Thực thể Danh mục khoản phí](../entities/fee-catalog-item.md)
- [Thực thể Hồ sơ học sinh 360](../entities/student-profile.md)
- [Màn hình danh mục thu](../screens/m4-sm7-danh-muc-thu.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
- [Luồng đồng bộ danh mục thu](../flows/fl-dong-bo-danh-muc-thu.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-19 | Quản lý danh mục thu chuẩn hóa kết nối cơ sở dữ liệu Bộ/Sở GD&ĐT (CSDL Sở) | Giao diện bảng danh mục thu và nút kích hoạt đồng bộ | MISSING | repo:app/src/pages/[schoolCode]/school/revenue-categories/index.tsx:1 |
| TC-20 | Ánh xạ mã tiểu mục tài chính và đồng bộ trạng thái danh mục thu với hệ thống Managing Portal | Slice xử lý trạng thái syncing và cập nhật danh sách | MISSING | repo:app/src/store/slices/revenueCategorySlice.ts:1 |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Danh mục thu CSDL Sở](../entities/revenue-category.md)
- [Thực thể Danh mục khoản phí](../entities/fee-catalog-item.md)
- [Thực thể Hồ sơ học sinh 360](../entities/student-profile.md)
- [Màn hình danh mục thu](../screens/m4-sm7-danh-muc-thu.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
- [Luồng đồng bộ danh mục thu](../flows/fl-dong-bo-danh-muc-thu.md)
