---
title: "Tổng quan School Operating Portal"
type: overview
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Tổng quan School Operating Portal

## Tóm tắt

**School Operating Portal** là nền tảng quản trị và vận hành giáo dục đa trường (multi-tenant) cấp doanh nghiệp, được thiết kế chuyên biệt cho các cơ sở giáo dục Mầm non và Phổ thông liên cấp (K-12) tại Việt Nam.

Hệ thống bao gồm đầy đủ **7 phân hệ lớn** và **38 sub-modules nghiệp vụ**, được quản lý và thi công theo chuẩn **Antigravity Harness Loop Kit v0.5.0** với kỷ luật bất biến **WIP = 1**, Nguồn sự thật duy nhất (**LLM Wiki SSOT**), và Cổng kiểm chứng nhị phân toàn phổ (**Verify Gate**).

## Bản đồ

### 1. Danh sách 7 Phân hệ Lớn

| Mã | Phân hệ | Quy mô | Mô tả trọng tâm |
|---|---|---|---|
| `M7` | [Phân hệ M7: Cổng Xác Thực & Đăng Nhập](module-m7-dang-nhap.md) | 1 sub-modules | Cổng vào hệ thống duy nhất, hỗ trợ 2 phương thức xác thực độc lập: SSO... |
| `M1` | [Phân hệ M1: Tổng Quan Điều Hành](module-m1-tong-quan.md) | 1 sub-modules | Bảng điều khiển trung tâm hiển thị các chỉ số KPI vận hành, tỷ lệ hoàn... |
| `M2` | [Phân hệ M2: Vận Hành Lớp Học](module-m2-van-hanh.md) | 6 sub-modules | Tập trung các nghiệp vụ hàng ngày của giáo viên và học sinh: điểm danh... |
| `M3` | [Phân hệ M3: Quản Lý Học Tập](module-m3-hoc-tap.md) | 3 sub-modules | Tiêu chuẩn hóa thời khóa biểu tuần, giao và chấm bài tập về nhà, cùng ... |
| `M4` | [Phân hệ M4: Quản Trị Tài Chính & Học Phí](module-m4-tai-chinh.md) | 7 sub-modules | Quản lý toàn diện hóa đơn học phí VietQR động, 24 khoản phí Master, bi... |
| `M5` | [Phân hệ M5: Quản Trị Nhà Trường](module-m5-nha-truong.md) | 14 sub-modules | Quản trị dữ liệu gốc trường học (học sinh 360°, giáo viên, lớp, môn, k... |
| `M6` | [Phân hệ M6: Cấu Hình Hệ Thống](module-m6-cau-hinh.md) | 6 sub-modules | Thiết lập cấu hình vận hành cơ sở trường học: hồ sơ trường, tài khoản ... |

### 2. Danh mục Toàn bộ 38 Sub-modules Nghiệp vụ

| Mã FID | Mã Cũ | Tên Sub-module | Mức ưu tiên | Phân loại | Route |
|---|---|---|---|---|---|
| `F001` | `M7/SM2` | [Cổng Đăng nhập (SSO Sở GD&ĐT & Tài khoản Finviet)](../screens/m7-sm2-dang-nhap.md) | `P0` | `Authentication` | `/signin, /sso/login` |
| `F002` | `M6/SM1` | [Hồ sơ Trường học & Thiết lập Vận hành](../screens/m6-sm1-truong.md) | `P0` | `Settings` | `/school/info` |
| `F003` | `M6/SM2` | [Quản lý Tài khoản & Phân quyền Quản trị](../screens/m6-sm2-tai-khoan.md) | `P0` | `Settings` | `/setting/users` |
| `F004` | `M5/SM13` | [Cấu hình Niên khóa & Học kỳ](../screens/m5-sm13-nam-hoc.md) | `P0` | `School Admin` | `/setting/season` |
| `F005` | `M5/SM5` | [Quản lý Cây Khối Lớp](../screens/m5-sm5-khoi-lop.md) | `P0` | `School Admin` | `/school/grades` |
| `F006` | `M5/SM3` | [Quản lý Lớp học (Chính khóa & Ngoại khóa)](../screens/m5-sm3-lop-hoc.md) | `P0` | `School Admin` | `/school/class` |
| `F007` | `M5/SM1` | [Hồ sơ Học sinh 360° & Chuyển lớp](../screens/m5-sm1-hoc-sinh.md) | `P0` | `School Admin` | `/school/kid` |
| `F008` | `M5/SM2` | [Danh bạ Giáo viên & Phân quyền Kiểm duyệt](../screens/m5-sm2-giao-vien.md) | `P0` | `School Admin` | `/school/teacher` |
| `F009` | `M2/SM1` | [Điểm danh Học sinh Hằng ngày (Đón / Trả / Sức khỏe)](../screens/m2-sm1-diem-danh.md) | `P0` | `Operations` | `/class/[classId]/attendance` |
| `F010` | `M2/SM2` | [Bảng tin Hoạt động Lớp học](../screens/m2-sm2-hoat-dong.md) | `P0` | `Operations` | `/class/[classId]/activity` |
| `F011` | `M4/SM3` | [Danh mục Khoản phí Master (24 khoản thu)](../screens/m4-sm3-khoan-phi.md) | `P1` | `Finance` | `/school/school-fees` |
| `F012` | `M4/SM4` | [Quản lý Biểu phí theo Lớp học (Tuition Management)](../screens/m4-sm4-quan-ly-hoc-phi.md) | `P1` | `Finance` | `/school/tuition-management` |
| `F013` | `M6/SM3` | [Cấu hình Hoàn tiền Nghỉ học & Cổng Thanh toán](../screens/m6-sm3-hoc-phi.md) | `P1` | `Finance` | `/setting/fee` |
| `F014` | `M4/SM8` | [Chính sách Miễn giảm & Động cơ Tự động Áp dụng Mức cao nhất](../screens/m4-sm8-mien-giam.md) | `P1` | `Finance` | `/school/discount` |
| `F015` | `M4/SM1` | [Lập Hóa đơn Học phí & Thu phí VietQR Động](../screens/m4-sm1-hoc-phi.md) | `P1` | `Finance` | `/school/fee` |
| `F016` | `M4/SM5` | [Quản lý Phiếu chi Nội bộ (Expenses)](../screens/m4-sm5-khoan-chi.md) | `P1` | `Finance` | `/school/expenses` |
| `F017` | `M4/SM2` | [Đối soát Giao dịch Ngân hàng & Cổng Thanh toán](../screens/m4-sm2-doi-soat.md) | `P1` | `Finance` | `/school/reconciliation` |
| `F018` | `M4/SM6` | [Báo cáo Thu Học phí & Tỷ lệ Hoàn thành](../screens/m4-sm6-bao-cao-hoc-phi.md) | `P1` | `Finance` | `/reports/fee/overview` |
| `F019` | `M3/SM1` | [Thời khóa biểu Tuần & Lịch sử Phiên bản](../screens/m3-sm1-thoi-khoa-bieu.md) | `P1` | `Academics` | `/school/schedule` |
| `F020` | `M3/SM2` | [Giao Bài tập về nhà & Theo dõi Nộp bài](../screens/m3-sm2-bai-tap.md) | `P1` | `Academics` | `/school/assignment` |
| `F021` | `M3/SM3` | [Sổ điểm & Đánh giá Học tập Định kỳ](../screens/m3-sm3-diem-danh-gia.md) | `P1` | `Academics` | `/school/scoreboard` |
| `F022` | `M2/SM3` | [Thư viện Media & Nhận diện Khuôn mặt AI](../screens/m2-sm3-thu-vien.md) | `P1` | `Operations` | `/class/[classId]/media` |
| `F023` | `M2/SM4` | [Kênh Trao đổi Tin nhắn Phụ huynh](../screens/m2-sm4-trao-doi.md) | `P1` | `Operations` | `/conversations` |
| `F024` | `M5/SM4` | [Danh mục Môn học & Phân công Giảng dạy](../screens/m5-sm4-mon-hoc.md) | `P1` | `School Admin` | `/school/subject` |
| `F025` | `M5/SM8` | [Kế hoạch Thực đơn Tuần & Nguồn gốc Thực phẩm GTIN](../screens/m5-sm8-thuc-don.md) | `P1` | `School Admin` | `/school/menu` |
| `F026` | `M5/SM9` | [Điểm danh Nhân viên 1 chạm & Phê duyệt Nghỉ phép](../screens/m5-sm9-diem-danh-nv.md) | `P1` | `School Admin` | `/school/staff-attendance` |
| `F027` | `M1/SM1` | [Dashboard Tổng quan Toàn trường (Overview)](../screens/m1-sm1-tong-quan.md) | `P2` | `Overview` | `/overview` |
| `F028` | `M2/SM5` | [Báo cáo Điểm danh Tháng Học sinh & Nhân viên](../screens/m2-sm5-bao-cao-diem-danh.md) | `P2` | `Operations` | `/reports/attendance` |
| `F029` | `M2/SM6` | [Báo cáo Mở rộng theo Mẫu Động](../screens/m2-sm6-bao-cao-mo-rong.md) | `P2` | `Operations` | `/reports/extended` |
| `F030` | `M5/SM6` | [Bảng thông tin & Lên lịch Gửi Thông báo](../screens/m5-sm6-bang-thong-tin.md) | `P2` | `School Admin` | `/announcement` |
| `F031` | `M5/SM7` | [Bình chọn & Khảo sát Ý kiến Phụ huynh (Polls)](../screens/m5-sm7-binh-chon.md) | `P2` | `School Admin` | `/school/poll` |
| `F032` | `M5/SM10` | [Sổ tay Phụ huynh Cây Tri thức 2 cấp (Handbook)](../screens/m5-sm10-so-tay-ph.md) | `P2` | `School Admin` | `/school/handbook` |
| `F033` | `M5/SM11` | [Hòm thư Góp ý Phụ huynh & Thảo luận 2 chiều](../screens/m5-sm11-gop-y.md) | `P2` | `School Admin` | `/school/feedback` |
| `F034` | `M5/SM12` | [Lịch Sự kiện & Ngày nghỉ Trường học (Calendar)](../screens/m5-sm12-lich-su-kien.md) | `P2` | `School Admin` | `/setting/holidays` |
| `F035` | `M5/SM14` | [Kho Lưu trữ Học sinh Thôi học / Rút hồ sơ (Archive)](../screens/m5-sm14-luu-tru.md) | `P2` | `School Admin` | `/setting/kid/archived` |
| `F036` | `M6/SM4` | [Quản lý Dữ liệu Khuôn mặt Học sinh (Face ID)](../screens/m6-sm4-nhan-dien.md) | `P2` | `Settings` | `/setting/face-recognition` |
| `F037` | `M6/SM5` | [Quản lý Bật/Tắt Tính năng Trường học (Feature Flags)](../screens/m6-sm5-tinh-nang.md) | `P2` | `Settings` | `/setting/activity` |
| `F038` | `M6/SM6` | [Cấu hình Lịch & Quy tắc Thông báo Toàn trường](../screens/m6-sm6-thong-bao.md) | `P2` | `Settings` | `/setting/notification` |

## Liên quan

- [Mục lục LLM Wiki](../../index.md)
- [Quy chuẩn SCHEMA](../../SCHEMA.md)
- [Hồ sơ thiết kế Design System](../../SCHEMA.md)
