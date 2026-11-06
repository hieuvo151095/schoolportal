---
title: Đặc Tả Bảng Đối Soát Mâu Thuẫn Nghiệp Vụ & Quyết Định Kỹ Thuật (K001–K057)
type: source
sources:
  - repo:docs/guides/research/contradictions.md
updated: 2026-11-05
---

# Đặc Tả Bảng Đối Soát Mâu Thuẫn Nghiệp Vụ & Quyết Định Kỹ Thuật (K001–K057)

## Thông tin nguồn
- **Tên tài liệu:** Planning Contradictions & Architecture Trade-offs Register
- **Đường dẫn gốc:** `repo:docs/guides/research/contradictions.md`
- **Phạm vi:** 57 điểm mâu thuẫn nghiệp vụ và thỏa hiệp kiến trúc (K001 đến K057) được phân tích và giải quyết triệt để giữa các tài liệu PRD, prototype cũ và yêu cầu kỹ thuật hiện đại.

## Nội dung chính
Bảng đối soát giải quyết toàn bộ các bất đồng nghiệp vụ trọng điểm:
1. **Mâu thuẫn Vận hành & Công nghệ (K001 - K005):**
   - K001: Nhận diện khuôn mặt xử lý bất đồng bộ qua hàng đợi Cloud Run thay vì chạy blocking trên HTTP server.
   - K002: Hoàn tiền ăn thực hiện qua dòng khấu trừ hóa đơn tháng tiếp theo $M+1$, phiếu chi tiền mặt chỉ đóng vai trò ghi nhận ngoại lệ.
   - K003: Phân định ranh giới giữa Tailwind CSS (layout) và styled-components (widgets).
   - K004: Gộp cấu trúc route `/{schoolCode}/...` cho mọi vai trò, lọc menu và nút bấm bằng NextAuth JWT claims.
   - K005: Thống nhất dùng NextPages Router với Redux Toolkit.
2. **Mâu thuẫn Phân hệ Nhà trường (K006 - K015, K025 - K036, K041 - K057):**
   - K006: Cho phép gán GVCN lớp khác nhưng hiển thị tag cảnh báo màu hổ phách nếu đã chủ nhiệm lớp khác.
   - K007: Khắc phục lỗi API tìm kiếm khối lớp bằng cách lọc tức thì in-memory trên client qua Redux.
   - K008: Mã học sinh và CCCD bắt buộc khi tạo mới; dữ liệu cũ bị thiếu hiển thị badge nghiêng thanh lịch `Chưa có mã học sinh`.
   - K009: Chấm công nhân viên hàng ngày 1-click không qua modal; chỉnh sửa giờ hoặc đổi trạng thái vắng bắt buộc modal xác nhận.
   - K010: Nút "Hủy bỏ" trên form chỉ mở modal cảnh báo khi form đã có chỉnh sửa (dirty).
   - K011: Thực đơn gắn thông báo qua `linkedAnnouncementId`, xóa bảng tin không ảnh hưởng thực đơn.
   - K012: Thẻ KPI trạng thái Góp ý giữ nguyên số tổng độc lập khi bấm chọn lọc.
   - K013: Học sinh lưu trữ khi phục hồi ưu tiên đưa về lớp cũ; nếu lớp đã giải tán thì chuyển sang "Chưa xếp lớp".
   - K014: Sự kiện lịch 1 ngày tự động điền "Đến ngày" bằng "Từ ngày".
   - K026: Cấm xóa lớp học khi có học sinh; bắt buộc chuyển hết học sinh trước khi xóa.
   - K027: Lớp chính khóa chỉ có 1 GVCN; lớp ngoại khóa hỗ trợ danh sách nhiều giáo viên hướng dẫn.
   - K038: Thông báo đã gửi không cho sửa thông tin nội dung nhằm bảo đảm tính trung thực so với email đã bắn ra.
   - K046: Khóa cứng chỉnh sửa bảng chấm công nhân viên quá 45 ngày về trước nhằm bảo vệ số liệu tính lương.
   - K049: Cây sổ tay phụ huynh giới hạn tối đa 2 cấp danh mục.
   - K054: Góp ý chỉ phát sinh từ phụ huynh qua mobile app; Admin web không được tạo phiếu góp ý giả lập.
   - K057: Máy trạng thái luân phiên tiếp nhận góp ý tự động đổi trạng thái "Chờ phản hồi" theo người gửi phản hồi gần nhất.
3. **Mâu thuẫn Tài chính & Cấu hình (K016 - K024):**
   - K016: Áp dụng mức giảm cao nhất (Highest rate priority) thay vì cộng dồn tỷ lệ phần trăm (additive stacking).
   - K017: Chính sách miễn giảm hết hạn chỉ áp dụng cho các kỳ hóa đơn tương lai; hóa đơn lịch sử bất biến.
   - K018: Toggle tắt miễn giảm khi tạo hóa đơn chỉ có hiệu lực cho đợt tạo đó, không thay đổi trạng thái master data.
   - K019: Mật khẩu kết nối hóa đơn điện tử SInvoice ẩn vĩnh viễn không có toggle con mắt.
   - K021: Kiểm tra tính duy nhất case-insensitive của email nhận báo cáo đối soát và giới hạn tối đa 3 email.
   - K024: Tách riêng tỷ lệ hoàn tiền ăn chính và tiền ăn sáng; nghỉ lễ nhà trường luôn hoàn 100%.

## Điểm đáng chú ý / mâu thuẫn
- 57 điểm mâu thuẫn đã được chủ sở hữu sản phẩm (Sophia Butler) và Kiến trúc sư trưởng (Alan, David) thống nhất giải quyết dứt điểm. Mọi trang đặc tả trong wiki phải tuân thủ nghiêm ngặt các kết luận này.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Khái niệm chốt chặn xóa lớp](../concepts/class-deletion-guard.md)
- [Khái niệm hoàn tiền ăn](../concepts/meal-refund-engine.md)
- [Khái niệm chính sách miễn giảm](../concepts/discount-deduplication.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
