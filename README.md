# ECO School Operating Portal (QLTH)

Hệ thống Quản Trị Vận Hành Giáo Dục Toàn Diện dành cho Nhà trường, Giáo viên và Phụ huynh.

---

## 📁 Cấu Trúc Dự Án

Dự án được tổ chức phân tách rõ ràng giữa **Mã nguồn**, **Tài liệu đặc tả**, **Thiết kế giao diện** và **Hệ thống Tri thức (LLM Wiki)**:

```text
eco-school-portal/
├── app/                        # 💻 MÃ NGUỒN (Next.js 14 + React 19 + TypeScript + Redux Toolkit)
│   ├── src/                    # Logic nghiệp vụ 7 phân hệ, routing, components, store
│   ├── public/                 # Static assets, fonts, icons
│   ├── tests/                  # 703 bài Unit Tests tự động (100% passing)
│   ├── package.json            # Node.js dependencies & scripts
│   └── tsconfig.json           # Cấu hình TypeScript & path aliases (@/* -> ./src/*)
│
├── docs/                       # 📚 TÀI LIỆU DỰ ÁN ĐỘC LẬP
│   ├── prd/                    # Toàn bộ PRD đặc tả nghiệp vụ (Hoàn tiền, Miễn giảm, SSO, Vận hành)
│   ├── ap/                     # Bộ 3 hồ sơ kỹ thuật SEPO: VOI, AP v1.0.0, ISP v1.0.0
│   └── guides/                 # Tài liệu hướng dẫn sử dụng và tài liệu kế thừa
│
├── design/                     # 🎨 HỆ THỐNG THIẾT KẾ ĐỘC LẬP
│   ├── system/                 # FINVIET ECO Design System v2.6.0 (Tokens, CSS/JS bundle, components)
│   ├── preferences/            # ~40 mẫu giao diện chuẩn Responsive HTML (Desktop, Tablet, Mobile)
│   └── portal-ds/              # Bộ token và linh kiện giao diện dashboard
│
├── wiki/                       # 🧠 LLM WIKI (Obsidian Vault - Single Source of Truth)
│   ├── pages/                  # Đặc tả 38 màn hình, phân hệ, quy tắc, thực thể
│   ├── raw/specs/              # Nguồn tài liệu gốc bất biến
│   ├── tools/                  # Bộ công cụ: wiki_viewer.py, lint_wiki.py, coverage_wiki.py
│   └── viewer.html             # Bản đồ đồ thị tri thức offline
│
├── .harness/                   # ⚙️ SYMLINK BỘ KIT PHÁT TRIỂN
│   ├── antigravity-kit         # Trỏ tới ../harness-loop-kit/antigravity-harness-loop-kit
│   └── claude-kit              # Trỏ tới ../harness-loop-kit/claude-harness-kit
│
└── .harness-state/             # Quản lý Backlog tính năng & trạng thái nghiệm thu
```

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Khởi chạy Web Application (Portal)
```bash
cd app
npm run dev
# Ứng dụng chạy tại: http://localhost:3000
```

### 2. Chạy Kiểm Thử (Unit Tests)
```bash
cd app
npm test
# Toàn bộ 703 tests (133 suites) sẽ chạy và kiểm chứng tự động
```

### 3. Kiểm Tra TypeScript
```bash
cd app
npx tsc --noEmit
```

### 4. Mở LLM Wiki Viewer
```bash
# Xem trực tiếp dạng đồ thị tương tác trên trình duyệt (mở cho cả mạng LAN):
python3 wiki/tools/wiki_viewer.py wiki --serve --host 0.0.0.0 --port 8777
# Truy cập: http://localhost:8777 hoặc http://<LOCAL_IP>:8777

# Hoặc kiểm tra cú pháp wiki:
python3 wiki/tools/lint_wiki.py wiki
```

### 5. Xem Bộ 3 Hồ Sơ Kỹ Thuật (VOI · AP · ISP)
Mở trực tiếp các tệp HTML trong thư mục `docs/ap/` trên trình duyệt:
* `docs/ap/VOI_SchoolOperatingPortal.html` (Bản đồ giá trị)
* `docs/ap/AP_SchoolOperatingPortal_v1.0.0.html` (Kế hoạch Kiến trúc)
* `docs/ap/ISP_SchoolOperatingPortal_v1.0.0.html` (Kế hoạch Thi công)
* `docs/ap/index.html` (Trang chỉ mục tổng hợp)
