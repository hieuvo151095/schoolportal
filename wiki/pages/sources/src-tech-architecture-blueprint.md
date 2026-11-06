---
title: Khung Kiến Trúc Kỹ Thuật Nền Tảng (System Architecture Blueprint)
type: source
sources:
  - raw/specs/system-architecture-blueprint.md
updated: 2026-11-05
---

# Khung Kiến Trúc Kỹ Thuật Nền Tảng (System Architecture Blueprint)

## Thông tin nguồn
| Trường | Giá trị |
|---|---|
| Đường dẫn | `raw/specs/system-architecture-blueprint.md` |
| Người cung cấp | Enterprise Architecture Office |
| Ngày | 2026-11-04 |
| Loại | Đặc tả kỹ thuật nền tảng (Pure Technical Specs) |

## Nội dung chính
Khung kiến trúc kỹ thuật tiêu chuẩn doanh nghiệp cho School Operating Portal:
1. **Mô hình tô-pô 5 tầng:** Client Tier (Next.js/React 19) $\rightarrow$ Reverse Proxy/Edge Gateway (SSL termination, rate limiting, routing) $\rightarrow$ Backend Core Tier (Modular Monolith, Ports & Adapters) $\rightarrow$ Primary Database (PostgreSQL 16 Enterprise với Row Level Security - RLS) $\rightarrow$ Distributed Cache & Queue (Redis 7 Native Cluster, BullMQ).
2. **Kiến trúc lục giác (Hexagonal Architecture):** 4 lớp Adapter In $\rightarrow$ Application Services $\rightarrow$ Domain Core $\rightarrow$ Adapter Out. Quy tắc Dependency Inversion một chiều, DTO camelCase 100%, file code $\le 250$ dòng.
3. **Kiểm soát đồng thời 3 cấp:** Optimistic Lock cho thực thể ít tranh chấp, Pessimistic Row Lock (`SELECT ... FOR UPDATE`) cho giao dịch tài chính, Redis Redlock cho Job/Cron đa node.
4. **Bảo mật đa người thuê (Multi-Tenancy):** Shared Database, Isolated Rows qua cột `tenant_id` / `school_code` và PostgreSQL RLS ép buộc session context.

## Mã yêu cầu được định nghĩa
| Mã | Quy tắc (kiểm được) | Nguồn (dòng/mục) |
|---|---|---|
| DN-01 | Đăng nhập hệ thống theo tiền tố mã trường `{schoolCode}` và cấp cặp JWT Access/Refresh Token | §4.2 |
| DN-02 | Phân quyền kiểm soát truy cập theo mô hình Role-Based Access Control (RBAC) 3 cấp | §4.2 |

## Điểm đáng chú ý / mâu thuẫn
- Nguyên tắc Zero-Mock Persistence: Không dùng mock data hay in-memory collection ở môi trường chạy thật. Mọi trạng thái phải được lưu vết bền vững vào PostgreSQL 16.
- Toàn bộ giao dịch tài chính liên quan đến lập hóa đơn, thu tiền, miễn giảm và phiếu chi bắt buộc nằm trong Transaction có Pessimistic Row Lock.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Cơ chế cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Phiên đăng nhập](../entities/auth-session.md)
- [Phân hệ Đăng nhập](../overview/module-auth.md)
