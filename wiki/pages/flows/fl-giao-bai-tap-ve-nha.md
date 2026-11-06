---
title: Luồng Giao Bài Tập, Theo Dõi Nộp Bài & Đánh Giá
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-007-academics-assignment/epic.md
spec_ids:
  - HT-02
updated: 2026-11-05
---

# Luồng Giao Bài Tập, Theo Dõi Nộp Bài & Đánh Giá

## Mục tiêu
Chuẩn hóa quy trình giao nhiệm vụ học tập về nhà của giáo viên bộ môn, thông báo tức thì đến phụ huynh học sinh và hỗ trợ theo dõi tiến độ nộp bài, chấm chữa nhận xét.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Giáo viên bộ môn | Web Admin | Vào màn hình Bài tập, chọn Lớp và Môn học, nhấn "Tạo bài tập mới" | Mở form giao bài tập |
| 2 | Giáo viên | Web Admin | Nhập tiêu đề, hướng dẫn làm bài, hạn nộp (`due_date`), đính kèm tệp đề bài | Dữ liệu nhiệm vụ hoàn thiện |
| 3 | Giáo viên | Web Admin | Nhấn "Giao bài" | Hệ thống gửi thông báo Push tới phụ huynh các học sinh trong lớp |
| 4 | Phụ huynh / Học sinh | App Mobile | Nhận thông báo, xem hướng dẫn và tải tệp bài làm lên ứng dụng | Trạng thái nộp chuyển sang `SUBMITTED` |
| 5 | Giáo viên | Web Admin | Mở danh sách bài nộp, chấm điểm/nhận xét và trả kết quả | Học sinh và phụ huynh xem được lời phê của giáo viên |

## Quy tắc chặn / validation
- Hạn nộp bài (`due_date`) phải lớn hơn thời điểm giao bài hiện tại.
- Học sinh nộp sau thời hạn bị đánh dấu trạng thái `LATE_SUBMISSION` (nộp muộn).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-02 | Tạo bài tập về nhà kèm hạn nộp và theo dõi trạng thái nộp bài của học sinh | Giao diện danh mục bài tập, form tạo mới và Redux slice | MISSING | repo:app/src/pages/[schoolCode]/school/assignment/index.tsx:1 |

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Thực thể Bài tập về nhà](../entities/homework-assignment.md)
- [Thực thể Môn học](../entities/school-subject.md)
- [Màn hình bài tập về nhà](../screens/m3-sm2-bai-tap.md)
