---
title: Đặc Tả 33 Quyết Định Kiến Trúc (Architecture Decision Records)
type: source
sources:
  - repo:docs/guides/decisions.md
updated: 2026-11-05
---

# Đặc Tả 33 Quyết Định Kiến Trúc (Architecture Decision Records)

## Thông tin nguồn
- **Tên tài liệu:** Architecture Decision Records (ADR) — School Operating Portal
- **Đường dẫn gốc:** `repo:docs/guides/decisions.md`
- **Tiêu chuẩn quản trị:** Marcus Fleet Architecture Decision Matrix (ADR-001 đến ADR-033)
- **Phạm vi:** 33 quyết định kiến trúc cốt lõi chi phối toàn bộ hệ thống từ định tuyến multi-tenant, thiết kế giao diện, luồng phê duyệt, công thức tài chính, sổ điểm Bộ GD&ĐT đến bảo mật dữ liệu.

## Nội dung chính
Tài liệu định nghĩa các quyết định kiến trúc bất biến đã được phê duyệt chính thức bởi Ban Giám đốc và Kiến trúc sư trưởng:
1. **Kiến trúc hạ tầng & giao diện nền tảng (ADR-001 -> ADR-008):**
   - Áp dụng Next.js Pages Router với tiền tố `/[schoolCode]/...` kết hợp Redux Toolkit và NextAuth.js (ADR-001).
   - Kiến trúc Hybrid Tailwind CSS (hình học, responsive grid) và styled-components (atomic UI widgets, token màu sắc) (ADR-002).
   - Pipeline nhận diện khuôn mặt bất đồng bộ qua Google Cloud Run worker (ADR-003).
   - Đóng gói cổng OpenResty (Nginx + Lua) điều phối multi-tenant edge routing (ADR-005).
   - Chuẩn hóa modal trung tâm cho bộ lọc nâng cao (ADR-006) và menu hành động `•••` bật ngược chống tràn mép bảng (ADR-007).
   - Nguyên tắc xác nhận pop-up bắt buộc trước mọi thay đổi logic nghiệp vụ, và thông báo kết quả qua global toast (ADR-008).
2. **Quy tắc Nhà trường & Vận hành (ADR-009 -> ADR-011, ADR-021 -> ADR-030):**
   - Phân cấp lớp học kép: Chính khóa (đầy đủ học phí, sổ điểm) vs Ngoại khóa (chỉ điểm danh, hoạt động, ảnh) (ADR-009, ADR-021).
   - Chốt chặn an toàn xóa lớp học: Chỉ cho phép xóa khi sĩ số học sinh bằng 0 (ADR-009, ADR-021).
   - Cơ chế kiểm duyệt bài viết 2 cấp (Giáo viên chính vs Giáo viên hỗ trợ) (ADR-009).
   - Chuẩn môn học Bộ GD&ĐT bất biến và ma trận đánh giá 4 kỳ (ADR-022).
   - Danh mục khối lớp bất biến (Khối 1-12) với chỉ số thống kê rollup phản ứng nhanh (ADR-023).
   - Tính bất biến của bảng thông tin đã phát hành: chỉ cho phép sửa bản nháp (ADR-024).
   - Tách rời luồng tạo bình chọn và luồng gán đối tượng gửi (ADR-025).
   - Khóa cứng sổ chấm công nhân viên 45 ngày về trước (ADR-026).
   - Cây phân cấp sổ tay phụ huynh tối đa 2 cấp (ADR-027).
   - Máy trạng thái luân phiên tiếp nhận & xử lý góp ý phụ huynh với chốt chặn đóng phiếu `GY-01` (ADR-028).
   - Cấm xóa niên khóa học trong giao diện để bảo vệ liên kết dữ liệu lịch sử (ADR-029).
   - Kho lưu trữ lạnh học sinh: cách ly khỏi danh sách hoạt động, kiểm tra lớp khi phục hồi và xóa vĩnh viễn 2 bước (ADR-030).
3. **Quy tắc Tài chính & Cấu hình (ADR-012 -> ADR-016, ADR-031 -> ADR-033):**
   - Động cơ giải quyết xung đột chính sách miễn giảm: Ưu tiên phạm vi cá nhân học sinh trước, sau đó chọn tỷ lệ cao nhất (ADR-012).
   - Độc lập dirty state và lưu riêng từng khối cấu hình học phí (ADR-013).
   - Kết chuyển khấu trừ tiền ăn vào kỳ hóa đơn tháng kế tiếp $M+1$ (ADR-014).
   - Phân rã khấu trừ tiền ăn chi tiết (Tiền ăn chính & Tiền ăn sáng) và cam kết hoàn 100% ngày nghỉ lễ của trường (ADR-015).
   - Đồng bộ ngày nghỉ trên Lịch sự kiện sang công cụ tính hoàn tiền ăn (ADR-016).
   - Khóa tài khoản Super-Admin và chốt chặn an toàn tài khoản đồng bộ CSDL Sở (ADR-032).
   - Bảo mật sinh trắc học khuôn mặt học sinh và bất biến thông tin nhân khẩu học (ADR-033).

## Mã yêu cầu được định nghĩa
| Mã | Tóm tắt quy tắc | Đoạn trong nguồn |
|---|---|---|
| HT-04 | Chuẩn tính điểm trung bình học kỳ theo Thông tư 22/27: $\text{TBHK} = \frac{\sum TX + 2GK + 3CK}{k+5}$, bắt buộc đủ GK và CK, làm tròn 1 chữ số thập phân | repo:docs/guides/decisions.md:103 |
| HT-05 | Tiêu chí đánh giá phát triển mầm non theo Thông tư 51/27: chuẩn 3 mức (Tốt/Đạt/Cần cố gắng), chốt chặn không vượt quá tổng số tiêu chí | repo:docs/guides/decisions.md:101 |
| HT-06 | Quy tắc bảo toàn tiêu đề bài tập khi chỉnh sửa và cấm xóa bài tập đã có học sinh nộp bài | repo:docs/guides/decisions.md:84 |
| VH-09 | Đơn xin nghỉ học / báo vắng phụ huynh gửi trước giờ quy định tự động chuyển thành vắng có phép và kích hoạt hoàn tiền ăn | repo:docs/guides/decisions.md:242 |
| VH-10 | Cơ chế cập nhật lạc quan (optimistic update) khi điểm danh và tự động hoàn tác thông báo lỗi khi mất mạng | repo:docs/guides/decisions.md:165 |
| TC-21 | Lịch sử giao dịch thanh toán tự động Sepay hiển thị dạng nhật ký append-only và bộ lọc đa chiều | repo:docs/guides/decisions.md:240 |
| TC-22 | Chốt chặn bảo toàn lịch sử thanh toán hóa đơn: cấm ghi đè lịch sử cũ khi có giao dịch thanh toán mới | repo:docs/guides/decisions.md:92 |
| TC-23 | Quy tắc phân bổ thanh toán dứt điểm theo dòng khoản thu và đồng bộ trạng thái Đã/Chưa thanh toán từng mục | repo:docs/guides/decisions.md:823 |
| TC-24 | Hệ thống phân tầng Z-Index tự động và chuẩn hóa dropdown Xuất HĐĐT dạng Có/Không kèm icon chọn 2 bước | repo:docs/guides/decisions.md:845 |
| NT-16 | Quy tắc chuyển lớp và chuyển năm học học sinh bảo toàn 3 luồng: định mức học phí, nhóm chat trao đổi và hồ sơ học tập | repo:docs/guides/decisions.md:142 |
| NT-17 | Cơ chế kho lưu trữ lạnh học sinh: cách ly khỏi danh sách hoạt động, kiểm tra lớp khi phục hồi và bảo vệ 2 bước khi xóa vĩnh viễn | repo:docs/guides/decisions.md:186 |
| CH-09 | Cấu hình học phí độc lập từng khối (dirty state isolation) và cảnh báo rời trang khi có thay đổi chưa lưu | repo:docs/guides/decisions.md:245 |
| CH-10 | Quy chuẩn bảo mật hóa đơn điện tử SInvoice: mật khẩu bắt buộc ẩn vĩnh viễn không có toggle hiển thị | repo:docs/guides/decisions.md:247 |
| CH-11 | Bảo vệ đặc quyền Super-Admin: cấm xóa hoặc vô hiệu hóa tài khoản quản trị tối cao và khóa toggle đối với tài khoản đồng bộ CSDL Sở | repo:docs/guides/decisions.md:134 |
| CH-12 | Quy chuẩn đăng ký sinh trắc học khuôn mặt học sinh: bảo vệ quyền riêng tư, cấm thay đổi thông tin nhân khẩu học tại màn hình quét ảnh | repo:docs/guides/decisions.md:136 |

## Điểm đáng chú ý / mâu thuẫn
- ADR-008 quy định bất kỳ thay đổi logic nghiệp vụ nào (như bật tắt xuất HĐĐT, đóng góp ý, chuyển trạng thái chấm công) đều bắt buộc phải có pop-up modal xác nhận, tránh việc click nhầm gây sai lệch dữ liệu kế toán và nhân sự.
- ADR-014 khẳng định rõ nguyên lý kết chuyển tiền ăn vào hóa đơn chu kỳ tiếp theo $M+1$, bác bỏ phương án chỉnh sửa hóa đơn đã xuất trong tháng nhằm bảo vệ tính toàn vẹn của chứng từ tài chính.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Phân hệ Học tập](../overview/module-academics.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Màn hình cấu hình học phí](../screens/m6-sm3-hoc-phi.md)
- [Màn hình lịch sử thanh toán Sepay](../screens/m6-sm7-lich-su-thanh-toan.md)
- [Khái niệm chuẩn đánh giá học sinh](../concepts/curriculum-assessment-standard.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Khái niệm thiết kế giao diện](../concepts/design-system-tokens-principles.md)
