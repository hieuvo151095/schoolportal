---
title: Tổng Quan Hệ Thống School Operating Portal
type: overview
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-open-questions-resolutions.md
  - pages/sources/src-prd-dang-nhap-xac-thuc.md
  - pages/sources/src-prd-co-che-hoan-tien.md
  - pages/sources/src-prd-mien-giam-hoc-phi.md
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-legacy-operating-portal-guide.md
updated: 2026-11-05
---

# Tổng Quan Hệ Thống School Operating Portal

## Tóm tắt
School Operating Portal là nền tảng quản trị và vận hành giáo dục đa trường (Multi-tenant) chuẩn doanh nghiệp, phục vụ các cơ sở Mầm non và Phổ thông liên cấp (K-12). Hệ thống hợp nhất 4 trụ cột nghiệp vụ cốt lõi: Vận hành trường học hằng ngày (điểm danh, y tế, ảnh AI, trò chuyện), Học tập & Học vụ (thời khóa biểu, bài tập, sổ điểm), Tài chính kế toán (hóa đơn VietQR, khấu trừ hoàn tiền ăn tự động, miễn giảm, đối soát ngân hàng, danh mục thu CSDL Sở) và Quản trị nhà trường (hồ sơ học sinh 360°, giáo viên, lớp học, niên khóa, bình chọn, thực đơn, hòm thư góp ý, chấm công nhân viên).

## Bản đồ
| Tiền tố | Phân hệ nghiệp vụ | Trang đầu mối (Hub) |
|---|---|---|
| `TQ` | Tổng quan điều hành | [Phân hệ Tổng quan](module-overview.md) |
| `VH` | Vận hành trường học | [Phân hệ Vận hành](module-operations.md) |
| `HT` | Học tập & Học vụ | [Phân hệ Học tập](module-academics.md) |
| `TC` | Tài chính & Học phí | [Phân hệ Tài chính](module-finance.md) |
| `NT` | Quản trị nhà trường | [Phân hệ Nhà trường](module-school-admin.md) |
| `CH` | Cấu hình hệ thống | [Phân hệ Cấu hình](module-settings.md) |
| `DN` | Đăng nhập & Phân quyền | [Phân hệ Đăng nhập & Xác thực](module-auth.md) |

### Tài liệu nguồn cốt lõi
- [PRD Cổng Vận Hành Trường Học](../sources/src-prd-school-operating-portal.md)
- [Khung Kiến Trúc Kỹ Thuật Nền Tảng](../sources/src-tech-architecture-blueprint.md)
- [Bảng Câu Hỏi Mở & Quyết Định](../sources/src-open-questions-resolutions.md)
- [Đặc Tả Đăng Nhập & Xác Thực](../sources/src-prd-dang-nhap-xac-thuc.md)
- [Đặc Tả Cơ Chế Hoàn Tiền Khi Nghỉ Học](../sources/src-prd-co-che-hoan-tien.md)
- [Đặc Tả Cơ Chế Miễn Giảm Học Phí](../sources/src-prd-mien-giam-hoc-phi.md)
- [Đặc Tả Bộ Hồ Sơ Kỹ Thuật 35 Epics & Prototype](../sources/src-development-epics-manifest.md)
- [Đặc Tả Khảo Sát Hệ Thống Cũ (Legacy Portal QLTH)](../sources/src-legacy-operating-portal-guide.md)
- [Đặc Tả 33 Quyết Định Kiến Trúc (ADR)](../sources/src-adr-architectural-decisions.md)
- [Đặc Tả Kho Tri Thức Kỹ Thuật & Danh Mục Anti-Pattern](../sources/src-knowledge-base-standards.md)
- [Đặc Tả Bảng Đối Soát Mâu Thuẫn Nghiệp Vụ (K001–K057)](../sources/src-planning-contradictions-matrix.md)
- [Đặc Tả Bộ Hồ Sơ Thiết Kế Kế Hoạch (Screens, Flows, Diagrams)](../sources/src-planning-blueprints-flows-screens.md)
- [Đặc Tả Hệ Thống Thiết Kế Giao Diện (ECO Design System)](../sources/src-portal-design-system.md)
- [Đặc Tả Bộ Hồ Sơ Kế Hoạch SEPO (VOI, AP, ISP)](../sources/src-sepo-architecture-implementation-plan.md)

### Khái niệm kiến trúc then chốt
- [Cơ chế cô lập đa trường học (Multi-Tenancy)](../concepts/multi-tenancy-isolation.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Chốt chặn an toàn khi xóa lớp](../concepts/class-deletion-guard.md)
- [Cơ chế kiểm duyệt bài viết 2 cấp & Phân quyền RBAC](../concepts/rbac-two-tier-moderation.md)
- [Kiến trúc thanh toán VietQR động & Đối soát tự động](../concepts/vietqr-dynamic-reconciliation.md)
- [Kiến trúc tích hợp Cơ sở dữ liệu Bộ/Sở GD&ĐT (CSDL Sở)](../concepts/csdl-so-integration.md)
- [Chuẩn đánh giá & Xếp loại học sinh Bộ GD&ĐT](../concepts/curriculum-assessment-standard.md)
- [Vòng đời chuyển tiếp học sinh](../concepts/student-lifecycle-transitions.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Kiến trúc giao diện & Hệ thống Token](../concepts/design-system-tokens-principles.md)

## Liên quan
- [Mục lục toàn bộ tài liệu](../../index.md)
- [Hợp đồng tài liệu SCHEMA](../../SCHEMA.md)
- [Nhật ký thay đổi](../../log.md)
