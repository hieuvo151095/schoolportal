# AGENTS.md — Quy ước phát triển dự án ECO School Operating Portal

Tài liệu này định hình quy chuẩn cho các AI Coding Agents khi làm việc trong repository `eco-school-portal`.

---

## 1. Cấu Trúc Repository

- `app/`: Mã nguồn ứng dụng Next.js. Mọi thay đổi code frontend, logic nghiệp vụ, UI components và unit tests thực hiện tại đây.
- `docs/`: Tài liệu PRD đặc tả nghiệp vụ (`docs/prd/`), bộ hồ sơ kỹ thuật SEPO (`docs/ap/`) và tài liệu hướng dẫn (`docs/guides/`).
- `design/`: Hệ thống thiết kế (`design/system/`) và các mẫu giao diện chuẩn responsive (`design/preferences/`).
- `wiki/`: LLM Wiki lưu trữ SSOT về nghiệp vụ, quy tắc và ánh xạ spec ↔ code.
- `.harness/`: Chứa các symlink trỏ về bộ kit phát triển `harness-loop-kit`.

## 2. Quy Chuẩn Kỹ Thuật

- **Design System v2.6.0**: Mọi giao diện phải sử dụng các components trong `app/src/components/ds/` và tokens semantic (`var(--text-heading)`, `var(--border-default)`, `var(--bg-surface)`...).
- **Kiểm thử tiền định**: Khi sửa đổi hoặc bổ sung tính năng, phải đảm bảo toàn bộ 703 bài tests trong `app/tests/` chạy qua 100% (`npm test`).
- **TypeScript Strict**: Không được để xảy ra lỗi compile khi chạy `npx tsc --noEmit`.
- **Đồng bộ Wiki**: Khi cập nhật logic hoặc bổ sung màn hình mới, phải cập nhật tài liệu tương ứng trong `wiki/pages/` và kiểm tra bằng `python3 wiki/tools/lint_wiki.py wiki`.
