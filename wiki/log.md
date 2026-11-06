# Log — LLM Wiki School Operating Portal

> Append-only, mới nhất ở cuối. Định dạng: `## [YYYY-MM-DD] ingest|query|lint|decide | Tiêu đề` (SCHEMA §7).
> `grep "^## \[" log.md | tail -5`

## [2026-11-05] lint | Khởi tạo wiki (skill llm-wiki, chế độ new)

- Tạo SCHEMA.md, wiki.json, index.md, log.md, OBSIDIAN.md, tools/ (lint, graph, viewer), .obsidian/, khung raw/ và pages/.
- Tiền tố: TQ, VH, HT, TC, NT, CH, DN. Code: app. Tài liệu: docs.


## [2026-11-05] decide | Giải quyết dứt điểm 8 câu hỏi mở tại open-questions.md

- Giải quyết triệt để 8 câu hỏi mở OQ-01 đến OQ-08 về Multi-tenancy RLS, Hoàn tiền ăn M+1, Xung đột miễn giảm, AI Face Recognition, Chốt chặn an toàn khi xóa lớp, Quyền kiểm duyệt 2 cấp, Định dạng tiền tệ và Pessimistic Row Lock.
- Không để lại bất kỳ thẻ "cần làm rõ" nào trong toàn bộ tài liệu đặc tả.

## [2026-11-05] ingest | Nạp toàn bộ PRD, Architecture Blueprint và dựng 82 trang đặc tả

- Nạp các tài liệu nguồn: `prd-school-operating-portal.md`, `system-architecture-blueprint.md`, `open-questions-resolutions.md`.
- Dựng 8 trang tổng quan phân hệ (overview), 5 trang khái niệm cốt lõi (concepts), 16 trang thực thể nghiệp vụ (entities), 12 trang luồng nghiệp vụ (flows), 38 trang màn hình giao diện (screens).
- Toàn bộ bảng 'Khác biệt spec ↔ code' được khởi tạo ở trạng thái MISSING cho chế độ new.

## [2026-11-05] ingest | Rà soát toàn diện và phủ 100% tài liệu docs/ vào wiki (113 trang)

- Rà soát đối chiếu 100% tài liệu trong `docs/` (gồm `docs/prd/`, 35 Epics `E-001` đến `E-035` trong `docs/guides/development/`, `docs/tech-specs/system-architecture-blueprint.md`, `docs/init/open-questions.md`, `docs/guides/legacy/operating-portal/` và source code prototype frontend trong `app/`).
- Xác định nguyên nhân cốt lõi gây thiếu sót trước đó: 
  1. Chưa tạo trang nguồn (sources) cho 3 PRD chuyên sâu đã có trong raw (`prd-dang-nhap-xac-thuc.md`, `prd-co-che-hoan-tien.md`, `prd-mien-giam-hoc-phi.md`), thiếu trang nguồn cho 35 Epics phát triển và khảo sát legacy.
  2. Bỏ sót 2 màn hình quan trọng: `M4-SM7` (Danh mục thu CSDL Sở - Revenue Categories) và `M7-SM1` (Tài khoản cá nhân, thông báo 4 tab, đa ngôn ngữ, đăng xuất, thông báo hệ thống từ nhà cung cấp).
  3. Thiếu 13 thực thể nghiệp vụ cốt lõi phản ánh cấu trúc dữ liệu nhà trường và tài chính (`academic-year`, `school-announcement`, `school-poll`, `weekly-menu`, `calendar-event`, `school-subject`, `grade-level`, `parent-handbook`, `parent-feedback`, `staff-attendance`, `reconciliation-session`, `revenue-category`, `school-profile`).
  4. Thiếu 8 luồng nghiệp vụ chi tiết (`fl-doi-soat-giao-dich`, `fl-lap-duyet-phieu-chi`, `fl-giao-bai-tap-ve-nha`, `fl-khao-sat-binh-chon`, `fl-lap-thuc-don-dinh-duong`, `fl-tiep-nhan-xu-ly-gop-y`, `fl-diem-danh-cham-cong-nv`, `fl-dong-bo-danh-muc-thu`).
  5. Thiếu 3 khái niệm kiến trúc then chốt (`rbac-two-tier-moderation`, `vietqr-dynamic-reconciliation`, `csdl-so-integration`).
- Đã khắc phục triệt để: Bổ sung 31 trang đặc tả mới, nâng tổng số từ 82 lên 113 trang (8 overview, 8 sources, 29 entities, 8 concepts, 20 flows, 40 screens).
- Bổ sung 16 mã spec ID mới (chuẩn hóa tiền tố DN-03..06, TC-11..20, CH-07..08), nâng tổng số spec ID định nghĩa và được nhắc lên 63 mã.
- Cập nhật đồng bộ `wiki/index.md` và `wiki/pages/overview/`.
- Kiểm tra nghiêm ngặt bằng linter: 0 lỗi, 0 cảnh báo (`--strict`), 0 thẻ "cần làm rõ", đã tái tạo `viewer.html` hoàn chỉnh.

## [2026-11-05] ingest | Rà soát toàn diện phủ 100% tài liệu guides, decisions, knowledge và SEPO (130 trang)

- Thực hiện kiểm tra độc lập và rà soát triệt để toàn bộ thư mục `docs/`. Phát hiện người tiền nhiệm vẫn bỏ sót 6 tài liệu nguồn chiến lược và màn hình `payment-history` trong prototype:
  1. `docs/guides/decisions.md` (33 ADR ghi nhận toàn bộ quyết định kiến trúc, chốt chặn an toàn và công thức tài chính).
  2. `docs/guides/knowledge.md` (1026 dòng tài liệu kiến thức kỹ thuật, danh mục cấm kỵ Never Do, công thức Bộ GD&ĐT).
  3. `docs/guides/research/contradictions.md` (Bảng đối soát 57 điểm mâu thuẫn nghiệp vụ K001..K057).
  4. `docs/guides/planning/` (`screens.md`, `flows.md`, `diagrams.md` đặc tả màn hình và luồng tương tác chi tiết).
  5. `docs/design/portal-ds/` (Hệ thống thiết kế ECO Design System v2.6.0, token semantic và chuẩn giao diện).
  6. `docs/ap/` (`AP_SchoolOperatingPortal_v1.0.0.html`, `ISP_SchoolOperatingPortal_v1.0.0.html`, `VOI_SchoolOperatingPortal.html` bộ hồ sơ SEPO).
  7. Bỏ sót màn hình `M6-SM7: Lịch Sử Giao Dịch Sepay` (`SCR-SET-02`, route `/[schoolCode]/setting/fee/payment-history/` với 316 dòng code trong `app/src/pages/`).
- Khắc phục triệt để bằng việc tạo mới và chuẩn hóa 17 trang đặc tả mới, nâng tổng số trang wiki từ 113 lên 130 trang:
  - **Tạo mới 6 trang nguồn:** `src-adr-architectural-decisions.md`, `src-knowledge-base-standards.md`, `src-planning-contradictions-matrix.md`, `src-planning-blueprints-flows-screens.md`, `src-portal-design-system.md`, `src-sepo-architecture-implementation-plan.md`.
  - **Tạo mới 1 màn hình:** `m6-sm7-lich-su-thanh-toan.md` (`SCR-SET-02`).
  - **Tạo mới 3 thực thể:** `student-absence-request.md` (Đơn xin nghỉ học / báo vắng), `face-biometric-registration.md` (Hồ sơ nhận diện khuôn mặt AI), `student-archive-record.md` (Hồ sơ lưu trữ học sinh kho lạnh).
  - **Tạo mới 3 khái niệm kiến trúc:** `curriculum-assessment-standard.md` (Chuẩn đánh giá học sinh Thông tư 22/27/51 Bộ GD&ĐT), `student-lifecycle-transitions.md` (Vòng đời chuyển tiếp học sinh), `design-system-tokens-principles.md` (Kiến trúc Hybrid Styling và Token Semantic v2.6.0).
  - **Tạo mới 4 luồng nghiệp vụ:** `fl-don-xin-nghi-hoc.md` (Nộp đơn nghỉ học & duyệt báo vắng), `fl-kho-luu-tru-hoc-sinh.md` (Lưu trữ kho lạnh, phục hồi và xóa vĩnh viễn), `fl-dang-ky-sinh-trac-khuon-mat.md` (Đăng ký sinh trắc học khuôn mặt AI), `fl-quan-tri-tai-khoan-phan-quyen.md` (Quản trị tài khoản đa vai trò & bảo vệ Super-Admin).
  - **Định nghĩa bổ sung 13 spec ID mới:** `HT-04`, `HT-05`, `HT-06`, `VH-09`, `VH-10`, `TC-21`, `TC-22`, `NT-16`, `NT-17`, `CH-09`, `CH-10`, `CH-11`, `CH-12` (nâng tổng số spec ID định nghĩa và được nhắc từ 63 lên 76 mã).
  - **Cập nhật đồng bộ:** `wiki/index.md` và các trang hub `pages/overview/`.
- Chạy kiểm tra linter `python3 wiki/tools/lint_wiki.py wiki --strict --viewer` bảo đảm 0 lỗi, 0 cảnh báo, 0 thẻ "cần làm rõ".

## [2026-11-05] decide | Thực hiện đối kháng toàn diện 5 kịch bản rủi ro cao (Red-Team Review)

- Thực hiện rà soát đối kháng (Red-Team Adversarial Review) toàn diện 5 kịch bản rủi ro cao trên toàn bộ 130 trang Wiki:
  1. **Kịch bản 1 (Tài chính & Hoàn tiền):** Thiết lập cơ chế `credit_balance` (Số dư tín dụng) giải quyết triệt để trường hợp học sinh nghỉ trọn tháng dẫn đến tiền hoàn lớn hơn học phí tháng M+1, cấn trừ lũy kế tháng M+2 hoặc xuất phiếu chi hoàn tiền khi thôi học/tốt nghiệp; áp dụng snapshot đơn giá suất ăn theo từng lớp cũ/mới khi học sinh chuyển lớp giữa tháng; kiểm soát xung đột đồng thời (Race condition) giữa thanh toán VietQR và hủy/sửa hóa đơn qua khóa bi quan `SELECT ... FOR UPDATE`, vô hiệu hóa QR payload tức thì và gom tiền giao dịch trên hóa đơn đã hủy vào Quỹ treo chờ xử lý (`UNMATCHED_SUSPENSE_POOL`) với nút xử lý 1-chạm.
  2. **Kịch bản 2 (Vận hành & Điểm danh):** Thiết lập chốt chặn an toàn đón trẻ: Cấm tuyệt đối giao trẻ cho người không trong danh bạ ủy quyền nếu chưa có xác thực trực tiếp của phụ huynh (OTP/video call); quy trình bảo vệ pháp lý lưu giữ trẻ ngoài giờ khẩn cấp sau 17:30 gồm 4 cấp (phòng lưu giữ có camera + 2 nhân sự, liên lạc khẩn cấp 3 số gia đình, biên bản lưu trẻ 3 bên ký GV + BGH + Bảo vệ, báo cáo Công an Phường & Tổng đài 111 sau 19:30); quy tắc hoàn 50% tiền ăn bán trú ngày đón về trước 10:30 do sốt cao $\ge 38.5^\circ\text{C}$ hoặc có chỉ định y tế học đường (`half_day_leave`).
  3. **Kịch bản 3 (Học vụ & Đánh giá):** Thiết lập cơ chế bảo toàn điểm số khi chuyển trường giữa học kỳ: trích xuất bảng điểm ký số BGH, map mã môn học tương đương tại trường đích, kế thừa 100% các cột điểm TX, GK vào công thức TBHK MoET Thông tư 22/27 mà không bắt học sinh làm bài thi lại; cơ chế mở khóa sổ điểm đã khóa đặc biệt: Phiếu đề nghị đính kèm ảnh bài thi gốc + BGH phê duyệt $\rightarrow$ Mở khóa cục bộ có phạm vi (Scoped Temporary Unlock) duy nhất 1 ô điểm trong thời hạn tối đa 60 phút (TTL 3600s) $\rightarrow$ Ghi nhận bản ghi bất biến `GradeAuditTrail` (chống xóa/sửa cả ở tầng CSDL) và tính lại TBHK.
  4. **Kịch bản 4 (Vòng đời dữ liệu):** Thiết lập chốt chặn bảo toàn công nợ (Debt Preservation Guard): Cấm tuyệt đối xóa vật lý lớp học khi còn học sinh nợ học phí (`balance_due > 0`), lưu trữ lớp cũ khi hết niên khóa và tự động kết chuyển công nợ (Carried-over Debt) sang hóa đơn niên khóa mới; chốt chặn khôi phục học sinh từ kho lưu trữ Archive: Khi lớp cũ đã giải tán/bị xóa, cấm phục hồi mồ côi mà BẮT BUỘC chỉ định một lớp đích đang hoạt động thuộc niên khóa hiện hành, kiểm tra sĩ số an toàn trước khi hoàn tất.
  5. **Kịch bản 5 (Bảo mật đa trường):** Thiết lập mô hình bảo mật cô lập đa trường học khi giáo viên kiêm nhiệm mở đồng thời 2 tab trình duyệt cho 2 trường khác nhau: Phân vùng LocalStorage theo tiền tố mã trường (`eco_token_{schoolCode}`, `eco_session_{schoolCode}`); phân kênh WebSocket theo topic phân tầng `{schoolCode}:user:{userId}:{channel}` có kiểm tra quyền handshake; kích hoạt Redux State Lifecycle Hook `RESET_TENANT_STATE` dọn sạch toàn bộ dữ liệu nhạy cảm khỏi store khi chuyển đổi ngữ cảnh trường trên cùng một tab, triệt tiêu nguy cơ rò rỉ dữ liệu "bóng ma" (stale data).
- Bổ sung 5 quyết định giải quyết dứt điểm OQ-09 đến OQ-13 vào `docs/init/open-questions.md` và `wiki/raw/specs/open-questions-resolutions.md` (giữ nguyên tắc 0 thẻ "cần làm rõ").
- Cập nhật 11 trang đặc tả trong `concepts/`, `entities/`, `flows/`, `sources/` và `wiki/index.md`.
- Hậu kiểm bằng lệnh `python3 wiki/tools/lint_wiki.py wiki --strict --viewer` đạt 100% với 0 lỗi và 0 cảnh báo.


## [2026-11-05] decide | Đóng kín toàn bộ khe hở đối kháng Red-Team trên flows, entities và screens

- Rà soát đối kháng độc lập phát hiện và khắc phục các điểm thiếu sót, mâu thuẫn giữa concepts và flows/entities/screens:
  1. `fl-bao-vang-hoan-tien.md`: Bổ sung cơ chế xử lý thặng dư Credit Balance khi tiền hoàn lớn hơn học phí tháng M+1, snapshot đơn giá suất ăn theo lớp cũ khi chuyển lớp giữa tháng, và hoàn tiền 50% suất ăn khi đón về nửa ngày do y tế (`half_day_leave`).
  2. `fl-don-xin-nghi-hoc.md`: Chuẩn hóa giờ chốt báo vắng 08:30 sáng (khắc phục mốc 08:00 không nhất quán), bổ sung đơn đón về sớm y tế đột xuất và quy tắc cấn trừ thặng dư Credit Balance.
  3. `fl-chuyen-lop-va-chuyen-nam-hoc.md`: Bổ sung bước chụp snapshot đơn giá tiền ăn khi chuyển lớp giữa tháng; quy trình bảo toàn điểm số MoET khi chuyển trường giữa kỳ; và thực thi chốt chặn Debt Preservation Guard chuyển giao công nợ (Carried-over Debt) sang niên khóa mới.
  4. `student-profile.md`: Khai báo và đặc tả quy tắc nghiệp vụ cho thuộc tính `credit_balance` (Số dư tín dụng), `carried_over_debt` (Công nợ kỳ trước gắn theo học sinh) và bảo toàn kết quả học bạ khi chuyển trường.
  5. `m4-sm1-hoc-phi.md` & `m4-sm2-doi-soat.md`: Bổ sung hiển thị và xử lý Credit Balance, Carried-over Debt, và nút xử lý 1-chạm đối với Quỹ treo đối soát `UNMATCHED_SUSPENSE_POOL` khi webhook bắn về hóa đơn đã hủy.
  6. `m2-sm1-diem-danh.md`: Bổ sung chốt chặn giữ trẻ ngoài giờ khẩn cấp `unclaimed_child_flag` và hành động đón về nửa ngày do y tế `half_day_leave` hoàn 50% tiền ăn.
  7. `m3-sm3-diem-danh-gia.md`: Bổ sung giao diện Scoped Temporary Unlock mở cục bộ 1 ô điểm TTL 60 phút có duyệt BGH, kiểm tra Audit Trail bất biến và tiếp nhận bảo toàn điểm chuyển trường.
  8. `m5-sm3-lop-hoc.md` & `m5-sm14-luu-tru.md`: Bổ sung Debt Preservation Guard cấm xóa lớp còn nợ, modal bắt buộc chọn lớp đích đang hoạt động khi khôi phục học sinh từ kho lưu trữ và cảnh báo đỏ chặn xóa vĩnh viễn khi còn công nợ.
  9. `m7-sm2-dang-nhap.md` & `multi-tenancy-isolation.md`: Bổ sung Cross-Tenant Defense Guard (đối chiếu URL param, Header `X-School-Code` và JWT claim, trả về 403 Forbidden nếu không khớp) và cơ chế dọn Redux store `RESET_TENANT_STATE`.
  10. `src-open-questions-resolutions.md`: Đồng bộ danh sách đầy đủ tất cả các trang flows, entities và screens chịu ảnh hưởng của 5 kịch bản đối kháng OQ-09..13.
- Hậu kiểm nghiêm ngặt: Chạy `python3 wiki/tools/lint_wiki.py wiki --strict --viewer` đạt 100% — 130 trang, 0 lỗi, 0 cảnh báo, 0 thẻ "cần làm rõ".

## [2026-11-05] decide | Giải quyết dứt điểm 5 kịch bản đối kháng đợt 2 (OQ-14..OQ-18)

- Thực hiện kiểm thử đối kháng đợt 2 cho 5 kịch bản nghiệp vụ phức tạp (Kịch bản 6 đến 10):
  1. **OQ-14 (Lớp Ngoại Khóa — Đóng Trùng Biểu Phí, Xếp Trùng Lịch & Phân Rã Hóa Đơn):** Thiết lập Bộ điều phối lịch học 4 chiều (học sinh, giáo viên, phòng/sân bãi, sĩ số) chặn xếp trùng lịch; mô hình tính phí linh hoạt `TERM_FIXED` (cố định) và `PER_SESSION` (theo buổi điểm danh thực tế); cơ chế phân rã Sub-invoice (`is_separable = true`) và Partial payment cho phép đóng riêng hoặc tách hóa đơn ngoại khóa khi phụ huynh từ chối tham gia.
  2. **OQ-15 (Đồng Bộ CSDL Ngành & Đóng Băng Dữ Liệu Kỳ Thi):** Cơ chế khóa đồng bộ kỳ thi `is_sync_locked = true` khóa cứng trường định danh học sinh khi Sở GD&ĐT chốt thi; hòa giải sai lệch dữ liệu 2 chiều (Bidirectional Data Drift Reconciliation) giữa Portal và CSDL ngành; cô lập lỗi ngắt quãng từng học sinh qua Retry Queue (3 lần Exponential Backoff) và Dead Letter Queue (DLQ) không làm hỏng tiến trình đồng bộ lô.
  3. **OQ-16 (Quyền Riêng Tư Khuôn Mặt AI & Tranh Chấp Quyền Giám Hộ Trẻ):** Cung cấp cờ `opt_out_face_ai` tuân thủ Nghị định 13/2023/NĐ-CP (bỏ qua trích xuất vector khuôn mặt, xóa vector đã lưu, không gán thẻ tên, áp dụng làm mờ mặt `AUTO_BLUR_FACE`); cơ chế bảo vệ tranh chấp quyền nuôi con/giám hộ với danh sách `restricted_guardians` (phán quyết Tòa án) và kích hoạt Cảnh báo đỏ toàn màn hình (Red Modal Alert) kèm chuông báo động, khóa nút trả trẻ tại màn hình điểm danh.
  4. **OQ-17 (Rút Hồ Sơ / Thôi Học Giữa Kỳ & Thanh Lý Quyết Toán Học Phí):** Quy tắc quyết toán Pro-rata minh bạch phân tách khoản không hoàn lại (phí nhập học, CSVC) và khoản hoàn lại theo tỷ lệ thời gian học thực tế (học phí theo tuần còn lại, tiền ăn 100% ngày chưa học, dịch vụ chưa dùng); lập Phiếu chi hoàn tiền rút hồ sơ `STUDENT_WITHDRAWAL_REFUND` duyệt 2 cấp; quét và hủy vĩnh viễn các hóa đơn tương lai; thu hồi tức thời quyền tương tác trên Mobile App, chuyển tài khoản sang chế độ chỉ đọc lịch sử `READ_ONLY_ARCHIVE`.
  5. **OQ-18 (Giao Dịch VietQR Bất Thường — Chuyển Tiền Thừa, Thiếu & Tra Soát Ngân Hàng):** Chuyển thừa/chuyển 2 lần tự động gạch nợ `PAID` hóa đơn, kết chuyển phần tiền dôi dư vào `credit_balance` hoặc bấm nút hoàn tiền thừa; chuyển thiếu chuyển trạng thái `PARTIAL_PAID` và tự động sinh lại mã VietQR động mới với số tiền nợ còn lại; tra soát chargeback/nghi vấn gian lận kích hoạt trạng thái đóng băng `FROZEN_UNDER_REVIEW`, khóa cứng cấm tuyệt đối xuất hóa đơn điện tử VAT.
- Bổ sung 5 quyết định dứt điểm OQ-14..OQ-18 vào `docs/init/open-questions.md` và `wiki/raw/specs/open-questions-resolutions.md`.
- Tạo mới 1 trang concept: `extracurricular-billing-scheduling.md`.
- Cập nhật 1 trang nguồn: `src-open-questions-resolutions.md`.
- Cập nhật 4 trang concept: `csdl-so-integration.md`, `ai-face-recognition.md`, `student-lifecycle-transitions.md`, `vietqr-dynamic-reconciliation.md`.
- Cập nhật 10 trang thực thể: `classroom.md`, `timetable-weekly.md`, `tuition-invoice.md`, `student-profile.md`, `attendance-daily.md`, `face-biometric-registration.md`, `student-archive-record.md`, `expense-voucher.md`, `reconciliation-session.md`, `revenue-category.md`.
- Cập nhật 7 trang luồng: `fl-lap-thoi-khoa-bieu.md`, `fl-lap-phat-hanh-hoa-don.md`, `fl-dong-bo-danh-muc-thu.md`, `fl-diem-danh-don-tra.md`, `fl-nhan-dien-album-anh.md`, `fl-kho-luu-tru-hoc-sinh.md`, `fl-doi-soat-giao-dich.md`.
- Cập nhật 11 trang màn hình: `m2-sm1-diem-danh.md`, `m2-sm3-thu-vien.md`, `m3-sm1-thoi-khoa-bieu.md`, `m4-sm1-hoc-phi.md`, `m4-sm2-doi-soat.md`, `m4-sm5-khoan-chi.md`, `m4-sm7-danh-muc-thu.md`, `m5-sm1-hoc-sinh.md`, `m5-sm3-lop-hoc.md`, `m5-sm14-luu-tru.md`, `m6-sm7-lich-su-thanh-toan.md`.
- Đồng bộ danh mục `wiki/index.md`.

## [2026-11-05] decide | Khắc phục triệt để các khoảng trống liên kết đối kháng đợt 2 (Red-Team Review #2)

- Rà soát đối kháng độc lập lần 2 phát hiện và đóng kín toàn bộ các điểm thiếu sót liên kết và đặc tả nghiệp vụ:
  1. `project-overview.md` & các trang hub phân hệ (`module-school-admin.md`, `module-finance.md`, `module-academics.md`): Bổ sung liên kết và bản đồ phân hệ cho khái niệm mới `extracurricular-billing-scheduling.md` (Điều phối lịch học, biểu phí & phân rã ngoại khóa OQ-14).
  2. `media-album.md`: Bổ sung quy tắc tôn trọng cờ quyền riêng tư `opt_out_face_ai`, không gắn thẻ tên học sinh và tự động làm mờ mặt `AUTO_BLUR_FACE` hoặc loại khỏi album công khai theo Nghị định 13/2023/NĐ-CP (OQ-16).
  3. `fee-catalog-item.md` & `m4-sm3-khoan-phi.md`: Bổ sung cấu hình khoản thu ngoại khóa linh hoạt theo kỳ `TERM_FIXED` hoặc theo buổi `PER_SESSION`, gắn cờ phân rã Sub-invoice `is_separable` và liên kết khái niệm OQ-14.
  4. `m6-sm4-nhan-dien.md` & `fl-dang-ky-sinh-trac-khuon-mat.md`: Bổ sung kiểm tra cờ `opt_out_face_ai = true`, vô hiệu hóa nút quét ảnh và thu hồi/xóa vector nhận diện đã lưu (OQ-16).
  5. `fl-quan-ly-ho-so-hoc-sinh-360.md`: Bổ sung bước kiểm tra và quy tắc chặn khóa đồng bộ kỳ thi `is_sync_locked` (OQ-15), cờ opt-out AI và danh sách hạn chế tiếp cận tranh chấp giám hộ `restricted_guardians` (OQ-16).
  6. `fl-lap-duyet-phieu-chi.md`: Bổ sung đặc tả chi tiết và quy tắc phê duyệt 2 cấp cho 2 loại phiếu chi nghiệp vụ: `STUDENT_WITHDRAWAL_REFUND` (hoàn tiền rút hồ sơ thôi học giữa kỳ Pro-rata - OQ-17) và `VIETQR_EXCESS_REFUND` (hoàn tiền thừa chuyển khoản VietQR - OQ-18).
  7. `m6-sm7-lich-su-thanh-toan.md`: Bổ sung mục Câu hỏi mở xác nhận giải quyết dứt điểm OQ-18 đồng nhất với toàn bộ các màn hình khác.
- Kết quả kiểm chứng linter `python3 wiki/tools/lint_wiki.py wiki --strict --viewer`: 131 trang, 0 lỗi, 0 cảnh báo, 0 câu hỏi mở, đồ thị kiến thức tăng từ 1094 lên 1109 cạnh liên kết chặt chẽ.

## [2026-11-05] decide | Giải quyết dứt điểm 5 kịch bản nghiệp vụ thực tế Giáo viên & Kế toán (OQ-19..OQ-23)

- Bổ sung 5 quyết định giải quyết dứt điểm OQ-19 đến OQ-23 vào `docs/init/open-questions.md` và `wiki/raw/specs/open-questions-resolutions.md`:
  1. **OQ-19 (Sổ Dặn Thuốc Y Tế & Xác Nhận Cho Uống Thuốc Trưa):** Phụ huynh gửi đơn dặn thuốc trực tuyến qua app (tên thuốc, liều lượng, giờ uống, ảnh đơn thuốc). Màn hình điểm danh hiển thị Huy hiệu Viên thuốc; giáo viên bấm xác nhận 1-chạm "Đã cho uống thuốc lúc HH:mm" và hệ thống bắn Push Notification an tâm tức thời tới phụ huynh; lưu vết bất biến trong `student_medical_logs`.
  2. **OQ-20 (Đến Muộn, Đón Sớm Giữa Buổi & Quy Tắc Không Hoàn Tiền Ăn Khi Đón Sớm):** Ghi nhận Đến muộn (Late Arrival, kèm toggle báo bổ sung suất ăn với bếp nếu đến trước 09:00) và Đón sớm giữa buổi (Early Departure, ghi nhận giờ đón, người đón, lý do). Quy tắc dứt điểm: Phụ huynh chủ động đón sớm sau khi học sinh đã đến trường KHÔNG HOÀN TIỀN GÌ CẢ (hoàn 0%). Suất ăn chỉ hoàn khi rơi vào ngày lễ, nhà trường cho nghỉ, phụ huynh có đơn xin nghỉ học cả ngày hợp lệ được duyệt trước 08:30, hoặc y tế đón về trước 10:30 do sốt cao $\ge 38.5^\circ\text{C}$ (OQ-10).
  3. **OQ-21 (Cơ Chế Tự Động Khóa Sổ Điểm Danh Cuối Tháng - Monthly Attendance Auto-Freeze):** Bỏ nút nộp sổ thủ công. Vào 23:59:59 ngày cuối tháng, trước khi engine tính phí cho tháng tiếp theo (M+1) khởi chạy, hệ thống TỰ ĐỘNG KHÓA (Freeze / Read-Only), không cho cập nhật bất kỳ thông tin điểm danh nào trong tháng đó nữa; bảo đảm tính toàn vẹn 100% cho việc khấu trừ học phí.
  4. **OQ-22 (Học Sinh Nhập Học Giữa Tháng Prorated & Hóa Đơn Riêng Lẻ Độc Lập):** Học sinh nhập học giữa tháng tính tiền ăn theo số ngày ăn thực tế còn lại từ ngày bắt đầu học đến ngày cuối tháng và học phí chia theo tỷ lệ ngày làm việc còn lại; hệ thống chỉ tạo hóa đơn riêng lẻ cho từng học sinh, mỗi học sinh sở hữu mã hóa đơn riêng, mã VietQR động độc lập, gạch nợ riêng biệt (tuyệt đối không gộp gia đình).
  5. **OQ-23 (Chính Sách Miễn Giảm Anh/Chị/Em Ruột - Sibling Discount):** Bổ sung chính sách Sibling Discount vào sub-module "Miễn giảm"; tự động nhận diện và liên kết các anh chị em ruột qua số điện thoại chính của phụ huynh (`primary_phone`); tự động áp dụng mức giảm trừ cho con thứ 2/thứ 3 khi anh/chị đang có trạng thái học tập `ACTIVE`; tự động điều chỉnh hoặc ngừng áp dụng khi con lớn tốt nghiệp/chuyển trường.
- Cập nhật 7 trang đặc tả: `attendance-daily.md`, `meal-refund-engine.md`, `discount-policy.md`, `tuition-invoice.md`, `m2-sm1-diem-danh.md`, `m4-sm1-hoc-phi.md`, `m4-sm8-mien-giam.md`.
- Cập nhật trang nguồn `src-open-questions-resolutions.md` và `wiki/index.md`.
- Kiểm tra nghiêm ngặt bằng linter: 0 lỗi, 0 cảnh báo (`--strict`), 0 thẻ "cần làm rõ".

## [2026-11-05] decide | Đóng kín toàn diện các khoảng trống luồng và xử lý ca biên OQ-19..OQ-23

- Rà soát đối kháng độc lập phát hiện và khắc phục triệt để các khoảng trống nghiệp vụ và ca biên (edge cases) chưa được triển khai đồng bộ ở các trang Flows, Entities, Concepts và Screens:
  1. `fl-diem-danh-don-tra.md`: Bổ sung bước kiểm tra Sổ dặn thuốc y tế & xác nhận uống thuốc trưa `student_medical_logs` (OQ-19), ghi nhận Đến muộn (Late Arrival, toggle báo ăn với bếp trước 09:00) và Đón sớm giữa buổi (Early Departure, OQ-20); bổ sung quy tắc cốt lõi: Phụ huynh chủ động đón sớm KHÔNG hoàn tiền ăn (hoàn 0%); và cơ chế tự động khóa sổ cuối tháng (Monthly Auto-Freeze - OQ-21).
  2. `fl-bao-vang-hoan-tien.md`: Bổ sung quy tắc đón sớm chủ động hoàn 0% tiền ăn (OQ-20); chốt tự động khóa sổ điểm danh trước khi engine quét hoàn tiền (OQ-21).
  3. `fl-lap-phat-hanh-hoa-don.md`: Bổ sung luồng tính học phí và tiền ăn lẻ ngày Prorated cho học sinh nhập học giữa tháng kèm xử lý ca biên ngày bắt đầu rơi vào cuối tuần/nghỉ lễ; quy định dứt điểm chỉ tạo hóa đơn riêng lẻ cho từng học sinh, mã VietQR riêng biệt, gạch nợ độc lập (không gộp gia đình - OQ-22); truy xuất số liệu hoàn tiền ăn sau khi đóng băng điểm danh cuối tháng (OQ-21).
  4. `fl-thiet-lap-mien-giam.md`: Bổ sung luồng cấu hình chính sách hệ thống Sibling Discount ưu đãi anh chị em ruột `SIBLING_DISCOUNT` theo bậc, liên kết tự động qua số điện thoại phụ huynh `primary_phone` và CCCD phụ huynh trong Hồ sơ 360, cơ chế tự động áp dụng khi anh/chị `ACTIVE`, và tự động hạ bậc/ngừng áp dụng khi con lớn ra trường (OQ-23).
  5. `discount-deduplication.md`: Bổ sung phân tích tương tác giữa chính sách Sibling Discount và các chính sách miễn giảm khác theo nguyên tắc Best-Rate (OQ-23); giải quyết dứt điểm ca biên gia đình 3 con khi con lớn ra trường thì con 2 và con 3 tự động chuyển bậc ở kỳ tiếp theo (M+1) không hồi tố.
  6. `student-profile.md` & `m5-sm1-hoc-sinh.md` & `fl-quan-ly-ho-so-hoc-sinh-360.md`: Bổ sung thuộc tính `enrollment_date` (OQ-22), `primary_phone` liên kết nhóm gia đình Sibling Discount (OQ-23), tab y tế theo dõi đơn dặn thuốc và nhật ký uống thuốc `student_medical_logs` (OQ-19); cập nhật mục Câu hỏi mở OQ-19, OQ-22, OQ-23.
  7. `meal-refund-credit.md` & `meal-refund-engine.md`: Bổ sung quy tắc đón sớm chủ động hoàn 0% tiền ăn (OQ-20); xử lý ca biên ngày bắt đầu học rơi vào cuối tuần/lễ (OQ-22); cập nhật câu hỏi mở OQ-09, OQ-10, OQ-20, OQ-21.
  8. `m2-sm5-bao-cao-diem-danh.md`: Bổ sung hiển thị trạng thái khóa đóng băng dữ liệu tháng cũ (OQ-21).
  9. `discount-policy.md`: Bổ sung làm rõ ca biên gia đình 3 con hạ bậc ở kỳ M+1 khi con lớn ra trường (OQ-23).
  10. `docs/init/open-questions.md` & `wiki/raw/specs/open-questions-resolutions.md`: Khắc phục lỗi cú pháp shell escape cho mã `enrollment_date`, làm rõ dứt điểm 2 ca biên về ngày nhập học rơi vào ngày nghỉ/lễ và quy tắc hạ bậc ưu đãi khi anh/chị ra trường.
- Hậu kiểm nghiêm ngặt: Chạy `python3 wiki/tools/lint_wiki.py wiki --strict --viewer` đạt 100% 0 lỗi, 0 cảnh báo.

## [2026-11-05] ingest | Đồng bộ đặc tả LLM Wiki vào Backlog Harness Loop (.harness-state/feature_list.json)

- Chạy công cụ đồng bộ đặc tả `agy-harness-ingest --clean` từ nguồn SSOT `llm-wiki/pages` vào `.harness-state/feature_list.json`.
- Quét qua toàn bộ 131 tệp Markdown, bóc tách chính xác 76 tính năng tương ứng 1:1 với 76 mã đặc tả quy tắc (spec IDs):
  - `CH`: 12 tính năng (Cấu hình hệ thống, AI, SInvoice, Feature Flags)
  - `DN`: 6 tính năng (Đăng nhập, RBAC, SSO, Session, Thu hồi phiên từ xa)
  - `HT`: 6 tính năng (Thời khóa biểu, Bài tập, Sổ điểm, Quy tắc cấm xóa bài nộp)
  - `NT`: 17 tính năng (Học sinh 360, Lớp học, Giáo viên, Thực đơn, Chuyển lớp, Lưu trữ)
  - `TC`: 22 tính năng (Học phí, VietQR động, Hoàn tiền ăn M+1, Miễn giảm, Đối soát Sepay, Bất biến lịch sử)
  - `TQ`: 3 tính năng (Dashboard KPI, Chuyên cần thời gian thực, Doanh thu)
  - `VH`: 10 tính năng (Điểm danh đón/trả, Thân nhiệt, Dặn thuốc OQ-19, Đón sớm 0% OQ-20, Khóa sổ 23:59:59 OQ-21, Cập nhật lạc quan)
- 100% backlog (76/76) được thiết lập ở trạng thái `pending`, sẵn sàng làm căn cứ phân rã WBS cho Kế hoạch Kiến trúc AP và Kế hoạch Thi công ISP.
- Xác thực lint wiki đạt 0 lỗi, 0 cảnh báo.




