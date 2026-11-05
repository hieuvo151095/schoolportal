# Tên: [Tên module]

## Mục lục
- [1. Thông tin tổng quan](#1-thông-tin-tổng-quan)
  - [1.1 Giới thiệu chung](#11-giới-thiệu-chung)
  - [1.2 Mục tiêu](#12-mục-tiêu)
  - [1.3 Phạm vi](#13-phạm-vi)
  - [1.4 Tài liệu tham khảo](#14-tài-liệu-tham-khảo)
- [2. Tổng quan nghiệp vụ](#2-tổng-quan-nghiệp-vụ)
  - [2.1 Đối tượng](#21-đối-tượng)
  - [2.2 Luồng nghiệp vụ](#22-luồng-nghiệp-vụ)
  - [2.3 Nguyên tắc nghiệp vụ](#23-nguyên-tắc-nghiệp-vụ)
- [3. Đặc tả tính năng](#3-đặc-tả-tính-năng)
  - [3.1 Phân rã chức năng](#31-phân-rã-chức-năng)
  - [3.2 Acceptance Criteria](#32-acceptance-criteria)
  - [3.3 Use case](#33-use-case)
  - [3.4 Edge Cases & Error Handling](#34-edge-cases--error-handling)
  - [3.5 Non-functional Requirements](#35-non-functional-requirements)
  - [3.6 Quy ước UI chung](#36-quy-ước-ui-chung)

> Quy ước: Mục lục dùng link Markdown chuẩn trỏ tới heading bên dưới (không dùng thẻ HTML `<a id>` — trình xem nội bộ của dự án này hiển thị HTML thô dưới dạng văn bản thay vì diễn giải, nên thẻ `<a>` chỉ tạo ra rác nhìn thấy được mà không giúp điều hướng). Anchor suy ra từ tiêu đề theo quy tắc GitHub-flavored Markdown: viết thường, bỏ dấu chấm/câu, khoảng trắng thành dấu gạch ngang — ví dụ "3.4 Edge Cases & Error Handling" thành `#34-edge-cases--error-handling` (dấu `&` bị xóa nên có 2 gạch ngang liền nhau). Việc điều hướng bằng anchor có thể vẫn không hoạt động trong trình xem nội bộ này; giữ cấu trúc Mục lục chuẩn vẫn có giá trị khi doc được mở ở nơi khác (GitHub, VS Code preview, v.v.).

## 1. Thông tin tổng quan

### 1.1 Giới thiệu chung
[2–4 câu: module này dùng để làm gì, dành cho actor nào]

### 1.2 Mục tiêu
[Bullet list mục tiêu nghiệp vụ quan sát được qua hành vi/label trên UI]

### 1.3 Phạm vi
| In scope | Out of scope |
|---|---|
[Chỉ liệt kê những gì quan sát được qua UI — không suy đoán những gì
"chắc có" nhưng không thấy]

### 1.4 Tài liệu tham khảo
[Link tới module/màn hình liên quan trong cùng portal, hoặc "Không có"]

## 2. Tổng quan nghiệp vụ

### 2.1 Đối tượng
| Actor | Vai trò | Trách nhiệm chính |
|---|---|---|
[Liệt kê mọi actor quan sát được, kể cả hệ thống khác module này gọi
tới — vd. portal còn lại, SSO]

### 2.2 Luồng nghiệp vụ

#### 2.2.1 Mô hình hóa nghiệp vụ
```mermaid
sequenceDiagram
[Sequence diagram thể hiện luồng chính giữa các actor ở 2.1 — dùng
Mermaid, không cần vẽ ảnh]
```

#### 2.2.2 Mô tả các bước nghiệp vụ
| Bước | Người thực hiện | Mô tả | Kết quả |
|---|---|---|---|

### 2.3 Nguyên tắc nghiệp vụ
| ID | Nguyên tắc nghiệp vụ |
|---|---|
[BR01, BR02... — đánh dấu [Cần xác nhận] nếu chỉ là suy luận chứ
không quan sát trực tiếp được]

## 3. Đặc tả tính năng

### 3.1 Phân rã chức năng
| Feature | Platform | Priority | User Story |
|---|---|---|---|

### 3.2 Acceptance Criteria
| User Story | Chức năng | Acceptance Criteria |
|---|---|---|

### 3.3 Use case
```mermaid
graph LR
[Use case diagram: actor nối tới từng use case của module]
```
Với MỖI use case, một block đầy đủ dạng bảng:
| Trường | Nội dung |
|---|---|
| Use case ID | UC-xx |
| Use case name | ... |
| Use case description | ... |
| Actor | ... |
| Happy path | 1. ... 2. ... (chèn screenshot ngay dưới bước nào có
UI đáng chú ý) |
| Exception | ... |
| Trigger | ... |
| Pre-condition | ... |
| Post-condition | ... |
| Business Rules | ... |

### 3.4 Edge Cases & Error Handling

#### 3.4.1 Tổng quan
| Nhóm | Tình huống | Xử lý mong đợi |
|---|---|---|

#### 3.4.2 Danh sách Thông báo (lỗi/thành công)
| Message ID | Trường hợp lỗi | Rule kiểm tra | Message đề xuất |
Hình thức báo | Hành vi hệ thống |
|---|---|---|---|---|---|
[Chỉ ghi message thực sự quan sát được từ dữ liệu/hành vi có sẵn —
không tạo lỗi giả để xem message xuất hiện]

### 3.5 Non-functional Requirements
| ID | Nhóm | Yêu cầu |
|---|---|---|

### 3.6 Quy ước UI chung
[Bullet list quy ước lặp lại xuyên suốt module: bộ lọc, trạng thái,
ngày giờ, thông báo lỗi...]
