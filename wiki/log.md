# Log — LLM Wiki School Operating Portal

> Append-only, mới nhất ở cuối. Định dạng: `## [YYYY-MM-DD] ingest|query|lint|decide | Tiêu đề` (SCHEMA §7).
> `grep "^## \[" log.md | tail -5`

## [2026-11-04] lint | Khởi tạo wiki (skill llm-wiki, chế độ new)

- Tạo SCHEMA.md, wiki.json, index.md, log.md, OBSIDIAN.md, tools/ (lint, graph, viewer), .obsidian/, khung raw/ và pages/.
- Tiền tố: chưa có. Code: —. Tài liệu: docs, README.md.

## 2026-11-04 · ingest · Nạp 38 sub-modules từ PRD vào Wiki và Backlog

- **Nguồn**: `docs/PRD_School_Operating_Portal_VI.md`, `docs/PRD_Dang_Nhap_VI.md`, `docs/tools/confluence/published_prds_manifest.json`
- **Quy mô**: 7 phân hệ lớn (M1 - M7) với đúng 38 sub-modules nghiệp vụ (bao gồm Cổng Đăng nhập M7/SM2 với SSO Sở và Tài khoản Finviet).
- **Thực hiện**:
  - Dựng 38 trang màn hình `pages/screens/m*-sm*-*.md` với bảng theo dõi gap spec ↔ code.
  - Dựng 7 trang hub phân hệ `pages/overview/module-m*-*.md`.
  - Cập nhật trang tổng quan `pages/overview/project-overview.md`.
  - Đồng bộ `index.md` và sinh backlog `feature_list.json` với 38 tính năng F001 -> F038.
