---
title: Màn Hình Báo Cáo Phiếu Bé Ngoan
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-07
apps:
  - web
route_ids:
  - /{schoolCode}/reports/reward
status: implemented
updated: 2026-11-17
---

# Màn Hình Báo Cáo Phiếu Bé Ngoan

## Mục đích
Tổng hợp và thống kê bức tranh tổng thể về kết quả rèn luyện, cấp phát phiếu bé ngoan của toàn bộ học sinh theo từng tháng và tuần học:
- **Ma trận 2 tầng (Two-Tier Multi-Level Matrix Table)**:
  - Hàng tiêu đề 1: Cột thông tin học sinh (Trẻ) được ghim cố định bên trái (sticky left), khối Tháng (ví dụ: `Tháng 11/2026`, bao quát các tuần trong tháng), và khối Tổng kết (bao quát 3 cột: Phiếu bé ngoan, Vắng có phép, Vắng không phép).
  - Hàng tiêu đề 2: Chi tiết từng cột tuần học (`Tuần 27`, `Tuần 28`... kèm dải ngày) và từng cột tổng kết.
- **Biểu tượng Mặt Trời chuẩn hóa (Sun Character)**:
  - Học sinh đạt phiếu hiển thị nhân vật Mặt Trời màu rực rỡ (`/images/reward/sun_awarded.png`).
  - Học sinh chưa đạt phiếu hiển thị nhân vật Mặt Trời tông màu xám (`/images/reward/sun_unawarded.png`).
  - Tuần tương lai hiển thị dấu gạch ngang (`—`).
- **Thanh tổng kết chân bảng (Sticky Summary Footer)**: Thống kê số lượng đạt trên từng tuần và tổng số phiếu đạt toàn tháng.
- **Thẻ thống kê tổng quan (StatCards)**: 4 thẻ thống kê đầu trang:
  - Sĩ số lớp
  - Tổng phiếu đạt
  - Tỷ lệ đạt chuẩn (%)
  - Tổng ngày vắng (có phép + không phép)
- **Thanh công cụ FilterBar chuẩn SSOT 38px**:
  - Ô tìm kiếm theo tên hoặc mã học sinh (260px).
  - Dropdown chọn lớp học (220px).
  - Dropdown chọn tháng báo cáo (180px).
  - Nút tác vụ "Xuất Excel" định dạng CSV hỗ trợ đầy đủ tiếng Việt có dấu (UTF-8 BOM).
- **Tương tác dòng bảng (Right-Sheet SlideOver)**: Bấm vào dòng học sinh mở ngăn kéo xem trước thẻ phiếu bé ngoan chi tiết qua các tuần của tháng.
- **Cấu trúc nhóm menu Báo cáo**: Nằm trong cụm sub-module `Báo cáo` của phân hệ `Vận hành` (`BC Điểm danh`, `BC Mở rộng`, `BC Phiếu bé ngoan`).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/reports/reward` | repo:app/src/pages/[schoolCode]/reports/reward/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-07 | Thống kê ma trận phiếu bé ngoan theo tuần và tháng, hiển thị tỷ lệ đạt chuẩn và xuất báo cáo CSV | DONE |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-07 | Báo cáo ma trận phiếu bé ngoan toàn diện theo tháng | Đã triển khai đầy đủ ma trận 2 tầng, StatCards, FilterBar 38px, xuất CSV và tích hợp vào cụm Báo cáo | MATCH | repo:app/src/pages/[schoolCode]/reports/reward/index.tsx |

## Kiểm thử & Phê duyệt
- Unit tests: `repo:app/tests/unit/rewardReport.test.mjs` kiểm tra 100% logic tạo bảng ma trận, tính toán tỷ lệ đạt chuẩn, các tuần trong tháng và xuất file CSV có UTF-8 BOM.

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Màn hình phiếu bé ngoan](m2-sm8-phieu-be-ngoan.md)
- [Màn hình báo cáo điểm danh](m2-sm5-bao-cao-diem-danh.md)
- [Màn hình báo cáo mở rộng](m2-sm6-bao-cao-mo-rong.md)
