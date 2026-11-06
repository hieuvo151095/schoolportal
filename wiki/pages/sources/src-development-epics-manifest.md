---
title: Đặc Tả Bộ Hồ Sơ Kỹ Thuật 35 Epics & Prototype
type: source
sources:
  - repo:docs/guides/development/index.md
  - repo:docs/guides/development/development_manifest.json
  - repo:docs/guides/prd.md
updated: 2026-11-05
---

# Đặc Tả Bộ Hồ Sơ Kỹ Thuật 35 Epics & Prototype

## Thông tin nguồn
- **Tên tài liệu:** Danh mục đăng ký kỹ thuật 35 Epics phát triển & Bản vẽ thực thi Prototype
- **Đường dẫn gốc:** `repo:docs/guides/development/index.md` / `repo:docs/guides/development/development_manifest.json` / `repo:docs/guides/prd.md`
- **Phiên bản:** v32.0 (Topology: epic_first)
- **Phạm vi:** 35 Epics (`E-001` đến `E-035`) bao phủ toàn bộ 7 phân hệ của School Operating Portal

## Nội dung chính
Tài liệu định hình bản đồ kỹ thuật chi tiết nhất của dự án, bao gồm cấu trúc phân rã công việc (WBS) từ Epic -> Feature -> Module -> Page -> Task -> Test:
1. **Phân hệ Vận hành (`E-001` đến `E-005`):** Điểm danh đón trả (`E-001`), Hoạt động lớp (`E-002`), Thư viện ảnh AI (`E-003`), Trao đổi phụ huynh (`E-004`), Báo cáo điểm danh & Báo cáo mở rộng (`E-005`).
2. **Phân hệ Học tập (`E-006` đến `E-008`):** Thời khóa biểu tuần (`E-006`), Giao bài tập về nhà (`E-007`), Sổ điểm đánh giá theo quy định Bộ GD&ĐT (`E-008`).
3. **Phân hệ Tài chính (`E-009` đến `E-014`, `E-017`):** Hóa đơn học phí VietQR (`E-009`), Danh mục 24 khoản phí (`E-010`), Quản lý định mức học phí theo lớp (`E-011`), Phiếu chi nội bộ (`E-012`), Đối soát thanh toán (`E-013`), Báo cáo tiến độ thu phí (`E-014`), Chính sách miễn giảm (`E-017`), và Danh mục thu CSDL Sở (Revenue Categories).
4. **Phân hệ Nhà trường (`E-015`, `E-016`, `E-018`, `E-020` đến `E-030`):** Hồ sơ học sinh 360° (`E-015`), Danh bạ giáo viên (`E-016`), Thực đơn dinh dưỡng (`E-018`), Lịch sự kiện (`E-020`), Quản lý lớp học & chốt chặn xóa (`E-021`), Môn học (`E-022`), Khối lớp (`E-023`), Bảng thông tin (`E-024`), Bình chọn trực tuyến (`E-025`), Điểm danh nhân viên (`E-026`), Sổ tay phụ huynh (`E-027`), Góp ý khiếu nại (`E-028`), Niên khóa học (`E-029`), Kho lưu trữ (`E-030`).
5. **Phân hệ Cấu hình (`E-019`, `E-031` đến `E-035`):** Tham số học phí (`E-019`), Hồ sơ trường học (`E-031`), Quản trị tài khoản người dùng (`E-032`), Nhận diện khuôn mặt AI (`E-033`), Bật tắt tính năng (`E-034`), Quản trị thông báo (`E-035`).
6. **Các tính năng tài khoản cá nhân & CSDL Sở:** Quản trị hồ sơ cá nhân Admin, đổi mật khẩu, trung tâm thông báo cá nhân 4 nhóm, và tích hợp chuẩn hóa Danh mục thu kết nối CSDL Sở Giáo Dục.

## Mã yêu cầu được định nghĩa
| Mã | Tóm tắt quy tắc | Đoạn trong nguồn |
|---|---|---|
| TC-19 | Quản lý danh mục thu chuẩn hóa kết nối cơ sở dữ liệu Bộ/Sở GD&ĐT (CSDL Sở) | repo:docs/guides/development/E-010-finance-fee-catalog/epic.md |
| TC-20 | Ánh xạ mã tiểu mục tài chính và đồng bộ trạng thái danh mục thu với hệ thống Managing Portal | repo:docs/guides/development/E-010-finance-fee-catalog/features/F-010-001-finance-fee-catalog.md |
| CH-07 | Quản lý hồ sơ cá nhân của người dùng, đổi mật khẩu và lưu cấu hình ngôn ngữ giao diện theo tài khoản | repo:docs/guides/development/E-032-settings-accounts/epic.md |
| CH-08 | Trung tâm tiếp nhận và phân loại thông báo cá nhân theo 4 luồng sự kiện chuyên biệt | repo:docs/guides/development/E-035-settings-notifications/epic.md |

## Điểm đáng chú ý / mâu thuẫn
- Toàn bộ 35 Epics đã được kiểm chứng tương thích 100% với kiến trúc Next.js / Redux Toolkit / TypeScript trong thư mục `app/src/`.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Màn hình danh mục thu](../screens/m4-sm7-danh-muc-thu.md)
- [Màn hình quản trị tài khoản cá nhân](../screens/m7-sm1-khac.md)
- [Thực thể Danh mục thu CSDL Sở](../entities/revenue-category.md)
- [Khái niệm Tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Luồng đồng bộ danh mục thu](../flows/fl-dong-bo-danh-muc-thu.md)
