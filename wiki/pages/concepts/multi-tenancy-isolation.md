---
title: Cơ Chế Cô Lập Đa Trường Học (Multi-Tenancy Isolation)
type: concept
sources:
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - DN-01
updated: 2026-11-05
---

# Cơ Chế Cô Lập Đa Trường Học (Multi-Tenancy Isolation)

## Định nghĩa
Cơ chế cô lập đa trường học (Multi-Tenancy) là kiến trúc bảo đảm an toàn dữ liệu tuyệt đối giữa các cơ sở giáo dục trên cùng một hạ tầng phần mềm. Hệ thống áp dụng mô hình **Shared Database, Isolated Rows**: CSDL dùng chung duy nhất, nhưng mỗi dòng dữ liệu của mọi bảng đều gắn với định danh trường học (`school_code` / `tenant_id`).

## Quy tắc
1. **Định tuyến URL:** Mọi yêu cầu truy cập nghiệp vụ bắt buộc có tiền tố `/{schoolCode}/...` trên URL (ví dụ: `/TH-ECO01/attendance`).
2. **PostgreSQL Row Level Security (RLS):** Mọi bảng dữ liệu người thuê đều kích hoạt RLS. Khi kết nối CSDL, backend bắt buộc thiết lập biến phiên `SET LOCAL app.current_tenant_id = 'TH-ECO01'`. Mọi câu lệnh SQL dù vô tình thiếu điều kiện WHERE cũng không bao giờ truy vấn được dữ liệu của trường khác.
3. **Chuyển trường & Dọn dẹp Redux State (`RESET_TENANT_STATE` - OQ-13):**
   - Khi người dùng chuyển đổi ngữ cảnh trường học trên cùng một tab (URL chuyển từ `/[schoolCode1]/` sang `/[schoolCode2]/`): Next.js Router hook / Redux middleware lập tức dispatch action `RESET_TENANT_STATE`.
   - Action này lập tức dọn sạch (purge) toàn bộ state trong Redux Store của các slice dữ liệu nhạy cảm (học sinh, lớp học, điểm danh, hóa đơn, thông báo, sổ điểm) về initial state rỗng, ngăn ngừa tuyệt đối việc hiển thị dữ liệu "bóng ma" (stale/ghost data) của trường cũ sang trường mới trước khi dữ liệu mới được tải về.
4. **Cô lập phiên đa tab & Phân vùng LocalStorage (Tab Isolation - OQ-13):**
   - Khi giáo viên kiêm nhiệm mở đồng thời 2 tab trình duyệt cho 2 trường khác nhau (ví dụ: Tab 1 mở `TH-ECO01` và Tab 2 mở `TH-ECO02`): Token xác thực và trạng thái session được phân vùng độc lập theo tiền tố mã trường (`eco_token_{schoolCode}` và `eco_session_{schoolCode}`).
   - Mỗi tab hoạt động hoàn toàn độc lập dựa trên route `/{schoolCode}/...` của URL tab đó, gửi request API với đúng access token của trường đó, loại bỏ hoàn toàn hiện tượng race condition ghi đè token giữa các tab.
5. **Cô lập kênh WebSocket theo Tenant (WebSocket Isolation - OQ-13):**
   - Kết nối WebSocket bắt buộc gắn tiền tố trường: `wss://socket.eco-portal.vn/{schoolCode}/ws?token=...`.
   - Topic subscription trên message broker (Redis Pub/Sub) tuân thủ định dạng phân tầng: `{schoolCode}:user:{userId}:{channel}` (ví dụ: `TH-ECO01:user:123:attendance`).
   - WebSocket Gateway kiểm tra nghiêm ngặt quyền của `userId` đối với `schoolCode` trong handshake token trước khi cho phép subscribe. Ngăn chặn tuyệt đối việc tab mở trường A nhận sự kiện, thông báo điểm danh hoặc tin nhắn của trường B.
6. **Đối chiếu chéo Tenant Context và Token Claim (Cross-Tenant Defense Guard - OQ-13):**
   - Mọi request API bắt buộc gửi kèm Header `X-School-Code: {schoolCode}` và Bearer Token `eco_token_{schoolCode}`.
   - Backend Gateway đối chiếu nghiêm ngặt 3 nhân tố: `URL param {schoolCode}` $\equiv$ `Header X-School-Code` $\equiv$ `JWT payload tenant_id`. Bất kỳ sự sai lệch nào lập tức bị từ chối với HTTP `403 Forbidden` (`INVALID_TENANT_CONTEXT`), ngăn ngừa triệt để lỗi vô tình dùng nhầm token trường này thao tác trên trường khác.

## Áp dụng ở đâu
- Áp dụng trên toàn bộ 7 phân hệ: Tổng quan (M1), Vận hành (M2), Học tập (M3), Tài chính (M4), Nhà trường (M5), Cấu hình (M6), Đăng nhập (M7).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| DN-01 | Đăng nhập hệ thống theo tiền tố mã trường `{schoolCode}` và cấp cặp JWT Access/Refresh Token | Prototype frontend điều hướng mock, chưa có PostgreSQL RLS backend | MISSING | repo:app/src/pages/[schoolCode]/index.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-01).

## Liên quan
- [Phân hệ Đăng nhập](../overview/module-auth.md)
- [Phiên đăng nhập](../entities/auth-session.md)
- [Luồng đăng nhập đa trường](../flows/fl-dang-nhap-da-truong.md)
