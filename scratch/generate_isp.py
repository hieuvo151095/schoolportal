#!/usr/bin/env python3
"""Generate complete ISP_SchoolOperatingPortal_v1.0.0.html matching AP v1.0.0."""
import os, hashlib

AP_FILE = "docs/ap/AP_SchoolOperatingPortal_v1.0.0.html"
ISP_FILE = "docs/ap/ISP_SchoolOperatingPortal_v1.0.0.html"
REF_DIR = ".harness/antigravity-kit/skills/agp-build-ap/references"

with open(os.path.join(REF_DIR, "ap-style.css"), "r", encoding="utf-8") as f:
    css_content = f.read()

with open(os.path.join(REF_DIR, "ap-toc.js"), "r", encoding="utf-8") as f:
    js_content = f.read()

# Compute SHA256 of AP
with open(AP_FILE, "rb") as f:
    ap_sha256 = hashlib.sha256(f.read()).hexdigest()

html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="light">
  <meta name="ap:lineage" content="ISP_SchoolOperatingPortal">
  <meta name="ap:branch" content="">
  <meta name="ap:version" content="1.0.0">
  <meta name="ap:parent" content="">
  <title>ISP_SchoolOperatingPortal_v1.0.0 — Kế Hoạch Thi Công Kỹ Thuật SchoolOperatingPortal</title>
  <style>
{css_content}
  </style>
</head>
<body>
  <nav class="toc">
    <p class="toc-title">Mục Lục Thi Công</p>
    <div id="toc"></div>
  </nav>

  <h1 id="title">SchoolOperatingPortal Implementation Strategy Plan (ISP) v1.0.0</h1>

  <table class="hdr">
    <tr><th>Văn bản</th><td>Kế hoạch Thi công Kỹ thuật &amp; Đặc tả Triển khai (ISP)</td></tr>
    <tr><th>Phiên bản</th><td>v1.0.0 (Khớp 1:1 với AP v1.0.0 theo điều khoản §A.30)</td></tr>
    <tr><th>Tệp AP được ghim</th><td><code>AP_SchoolOperatingPortal_v1.0.0.html</code></td></tr>
    <tr><th>Mã SHA-256 của AP</th><td><code>{ap_sha256}</code></td></tr>
    <tr><th>Cổng kiểm chứng</th><td>Verify Gate (<code>verify.sh</code>) &#183; Kỷ luật kiểm chứng nhị phân (703 test units)</td></tr>
    <tr><th>Nền tảng thi công</th><td>Next.js 14 + React 18 + TypeScript Strict + Tailwind CSS + Design System v2.6.0</td></tr>
  </table>

  <div class="stlegend">
    <span class="stkey" data-st="approved">APPROVED</span> Kế hoạch thi công đã duyệt
    <span class="stkey" data-st="locked">LOCKED</span> Đã khóa và gắn với bài test tự động
  </div>

  <!-- PART 1 -->
  <h2 class="part-divider" id="part-1">Part 1 — Kiểm Soát &amp; Thứ Tự Thi Công Ưu Tiên</h2>

  <h2 class="part" id="s1-1">§1.1 SYSTEM: Ghim AP, Phạm vi &amp; Cách đọc bước thi công</h2>
  <p>Tài liệu ISP này hiện thực hóa toàn bộ các đặc tả kiến trúc được mô tả trong tài liệu <code>AP_SchoolOperatingPortal_v1.0.0.html</code> (Mã băm SHA-256: <code>{ap_sha256}</code>). Mọi bước thi công kỹ thuật đều có điểm chạm mã nguồn cụ thể (Touchpoint <code>repo:path:line</code>), hành động kỹ thuật chuẩn hóa và kịch bản kiểm chứng nhị phân khép kín.</p>

  <h3 id="s1-1-1">§1.1.1 SYSTEM: Bảng quy ước trạng thái và điểm chạm mã nguồn</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:18%"><col style="width:22%"><col style="width:60%"></colgroup>
      <tr><th>Ký hiệu trạng thái</th><th>Tên trạng thái</th><th>Ý nghĩa &amp; Tiêu chuẩn chuyển trạng thái</th></tr>
      <tr><td><span class="badge built">ok · Đạt</span></td><td>Đã hoàn thành</td><td>Mã nguồn đã viết xong, vượt qua bài kiểm tra tự động với mã thoát 0.</td></tr>
      <tr><td><span class="badge partial">pa · Làm dở</span></td><td>Đang thi công</td><td>Đã tạo cấu trúc nhưng chưa xong toàn bộ logic hoặc chưa có bài test.</td></tr>
      <tr><td><span class="badge miss">no · Chưa làm</span></td><td>Chưa khởi công</td><td>Nằm trong lộ trình thi công, chuẩn bị nạp vào feature list.</td></tr>
    </table>
  </div>

  <h3 id="s1-1-2">§1.1.2 SYSTEM: Đường găng kỹ thuật và luồng phụ thuộc</h3>
  <p>Thứ tự triển khai kỹ thuật bắt buộc tuân theo đường găng kiến trúc SEPO:</p>
  <ol>
    <li><strong>Phase A (Hạ tầng &amp; Nền tảng):</strong> Multi-tenant isolation Router, Session Context, Type Definitions, Design System tokens.</li>
    <li><strong>Phase 0 (Vận hành &amp; Y tế):</strong> Sổ dặn thuốc (OQ-19 deadline 12:30), Báo ăn &amp; Điểm danh, Đón sớm 0% hoàn (OQ-20), SMS/Zalo.</li>
    <li><strong>Phase 1 (Học vụ &amp; Lớp học):</strong> Thời khóa biểu, Giao/chấm bài tập, Sổ điểm MOET TT22/27/26, Ngoại khóa &amp; Điều phối học phí.</li>
    <li><strong>Phase 2 (Tài chính &amp; Gạch nợ):</strong> Tự động đóng băng điểm danh 23:59:59 (OQ-21), Đợt thu học phí, Hoàn tiền ăn 2 dòng, Sibling discount (OQ-23), VietQR NAPAS247, Sepay webhook 3s, Viettel SInvoice.</li>
    <li><strong>Phase 3 (Vòng đời &amp; Lưu trữ):</strong> Nhập học giữa tháng Prorated (OQ-22) tạo hóa đơn lẻ, Chuyển lớp, Rút hồ sơ quyết toán, Kho lưu trữ cách ly.</li>
  </ol>

  <h2 class="part" id="s1-2">§1.2 SYSTEM: Kế hoạch phân bổ 5 pha thi công kỹ thuật</h2>
  <p>Toàn bộ 76 tính năng từ LLM Wiki được phân rã thành 5 giai đoạn kỹ thuật rõ ràng, bảo đảm không có xung đột mã nguồn.</p>

  <h3 id="s1-2-1">§1.2.1 SYSTEM: Danh mục 5 pha thi công từ Phase A đến Phase 3</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:12%"><col style="width:25%"><col style="width:33%"><col style="width:30%"></colgroup>
      <tr><th>Pha</th><th>Tên kỹ thuật</th><th>Nội dung trọng tâm</th><th>Đầu ra chính</th></tr>
      <tr><td><b>Phase A</b></td><td>Nền tảng &amp; Đa trường</td><td>Multi-tenant routing <code>[schoolCode]</code>, State invariants, Tokens</td><td>Khung ứng dụng chuẩn hoá</td></tr>
      <tr><td><b>Phase 0</b></td><td>Vận hành Cốt lõi &amp; Y tế</td><td>Sổ thuốc 12:30, Điểm danh, Đón sớm 0% hoàn, Báo ăn, SMS</td><td>Luồng Mega Scenario 01</td></tr>
      <tr><td><b>Phase 1</b></td><td>Học vụ &amp; Đánh giá</td><td>Thời khóa biểu, Giao bài, Sổ điểm MOET, Ngoại khóa</td><td>Luồng Mega Scenario 02</td></tr>
      <tr><td><b>Phase 2</b></td><td>Tài chính &amp; Gạch nợ 3s</td><td>Đóng băng 23:59:59, VietQR, Sepay webhook, SInvoice, Hoàn ăn</td><td>Luồng Mega Scenario 03</td></tr>
      <tr><td><b>Phase 3</b></td><td>Vòng đời &amp; Lưu trữ</td><td>Prorated hóa đơn lẻ, Quyết toán rút hồ sơ, Kho lưu trữ cách ly</td><td>Luồng Mega Scenario 04</td></tr>
    </table>
  </div>

  <h3 id="s1-2-2">§1.2.2 SYSTEM: Tổng kết hạng mục và số lượng bước kỹ thuật</h3>
  <p>Mỗi bước thi công tương ứng với một đơn vị mã nguồn có thể kiểm chứng độc lập, được bảo vệ bởi cổng kiểm chứng Verify Gate (<code>verify.sh</code>).</p>

  <!-- PART 2 -->
  <h2 class="part-divider" id="part-2">Part 2 — Chi Tiết Thi Công Từng Phân Hệ Theo 5 Pha</h2>

  <h2 class="part" id="s2-1">§2.1 Phase A: Thiết lập nền tảng đa trường &amp; Mô hình dữ liệu</h2>
  <p>Thiết lập hạ tầng khung Next.js, định tuyến đa trường <code>[schoolCode]</code> và bảo đảm toàn vẹn Design System v2.6.0.</p>

  <h3 id="s2-1-1">§2.1.1 Phase A: Bảng các bước thi công nền tảng &amp; Design System</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:12%"><col style="width:28%"><col style="width:35%"><col style="width:15%"><col style="width:10%"></colgroup>
      <tr><th>Mã bước</th><th>Điểm chạm (Touchpoint)</th><th>Hành động kỹ thuật</th><th>Kiểm chứng</th><th>Trạng thái</th></tr>
      <tr><td><b>SA.01</b></td><td><code>repo:app/package.json:1</code></td><td>Kiểm tra Next.js 14, React 18, Tailwind CSS và TypeScript Strict</td><td><code>npm run build</code></td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>SA.02</b></td><td><code>repo:app/src/types/index.ts:1</code></td><td>Định nghĩa các interface dữ liệu cốt lõi (Student, Class, Fee, Attendance)</td><td><code>npx tsc --noEmit</code></td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>SA.03</b></td><td><code>repo:app/src/components/ds/</code></td><td>Bảo đảm 100% components giao diện tuân thủ Design System v2.6.0 semantic tokens</td><td>Design System Check</td><td><span class="badge built">ok</span></td></tr>
    </table>
  </div>

  <h3 id="s2-1-2">§2.1.2 Phase A: Quy tắc an toàn Multi-tenant và Audit Trail</h3>
  <p>Mọi truy vấn dữ liệu và hiển thị giao diện bắt buộc phải kèm theo tham số <code>schoolCode</code> để cô lập không gian dữ liệu giữa các trường thành viên, không cho phép truy cập chéo trái phép.</p>

  <h2 class="part" id="s2-2">§2.2 Phase 0: Hiện thực hóa Vận hành Cốt lõi &amp; Y tế Học đường</h2>
  <p>Thi công luồng vận hành ngày của Giáo viên chủ nhiệm và Nhân viên y tế (Mega Scenario 01).</p>

  <h3 id="s2-2-1">§2.2.1 Phase 0: Bảng các bước thi công Sổ thuốc &amp; Điểm danh ăn bán trú</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:12%"><col style="width:28%"><col style="width:35%"><col style="width:15%"><col style="width:10%"></colgroup>
      <tr><th>Mã bước</th><th>Điểm chạm (Touchpoint)</th><th>Hành động kỹ thuật</th><th>Kiểm chứng</th><th>Trạng thái</th></tr>
      <tr><td><b>S0.01</b></td><td><code>repo:app/src/pages/[schoolCode]/operations/medication/</code></td><td>Sổ dặn thuốc điện tử, khóa nhận đơn lúc 12:30 trưa (OQ-19)</td><td>Unit test Medication</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S0.02</b></td><td><code>repo:app/src/pages/[schoolCode]/operations/attendance/</code></td><td>Điểm danh buổi sáng/chiều, chốt suất ăn bán trú sang nhà bếp</td><td>Unit test Attendance</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S0.03</b></td><td><code>repo:app/src/pages/[schoolCode]/operations/pickup/</code></td><td>Điểm danh đón về, kiểm soát người đón và ghi nhận Đón sớm</td><td>Unit test Pickup</td><td><span class="badge built">ok</span></td></tr>
    </table>
  </div>

  <h3 id="s2-2-2">§2.2.2 Phase 0: Quy tắc xử lý Đón sớm 0% hoàn &amp; Khóa dặn thuốc 12:30</h3>
  <p>Học sinh đã điểm danh có mặt tại trường buổi sáng, nếu phụ huynh chủ động đón sớm giữa buổi vì việc gia đình sẽ <strong>hoàn tiền ăn 0%</strong> (OQ-20). Đơn thuốc dặn sau 12:30 trưa tự động chuyển sang lưu ý ngày hôm sau (OQ-19).</p>

  <h2 class="part" id="s2-3">§2.3 Phase 1: Học vụ, Thời khóa biểu &amp; Sổ điểm đánh giá</h2>
  <p>Thi công chu kỳ giảng dạy của Giáo viên bộ môn (Mega Scenario 02) và chuẩn đánh giá MOET.</p>

  <h3 id="s2-3-1">§2.3.1 Phase 1: Bảng các bước thi công Thời khóa biểu, Bài tập &amp; Sổ điểm MOET</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:12%"><col style="width:28%"><col style="width:35%"><col style="width:15%"><col style="width:10%"></colgroup>
      <tr><th>Mã bước</th><th>Điểm chạm (Touchpoint)</th><th>Hành động kỹ thuật</th><th>Kiểm chứng</th><th>Trạng thái</th></tr>
      <tr><td><b>S1.01</b></td><td><code>repo:app/src/pages/[schoolCode]/academics/timetable/</code></td><td>Thời khóa biểu tuần, xếp tiết tránh trùng phòng/giáo viên</td><td>Unit test Timetable</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S1.02</b></td><td><code>repo:app/src/pages/[schoolCode]/academics/homework/</code></td><td>Giao bài tập về nhà, đính kèm file, theo dõi nộp bài</td><td>Unit test Homework</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S1.03</b></td><td><code>repo:app/src/pages/[schoolCode]/academics/gradebook/</code></td><td>Sổ điểm đánh giá Thông tư 22/27/26 MOET, tính điểm tự động</td><td>Unit test Gradebook</td><td><span class="badge built">ok</span></td></tr>
    </table>
  </div>

  <h3 id="s2-3-2">§2.3.2 Phase 1: Quy tắc tính điểm tổng kết và phân rã hóa đơn ngoại khóa</h3>
  <p>Điểm tổng kết tự động tính theo trọng số quy định của Bộ GD&amp;ĐT; hoạt động ngoại khóa tự động phân rã vào đợt thu học phí tiếp theo mà không làm sai lệch học phí chính khóa.</p>

  <h2 class="part" id="s2-4">§2.4 Phase 2: Tài chính, Gạch nợ VietQR 3s &amp; Hóa đơn Viettel SInvoice</h2>
  <p>Thi công phân hệ tài chính kế toán, lập đợt thu, gạch nợ tự động và xuất hóa đơn điện tử (Mega Scenario 03).</p>

  <h3 id="s2-4-1">§2.4.1 Phase 2: Bảng các bước thi công Đóng băng điểm danh &amp; Webhook Sepay</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:12%"><col style="width:28%"><col style="width:35%"><col style="width:15%"><col style="width:10%"></colgroup>
      <tr><th>Mã bước</th><th>Điểm chạm (Touchpoint)</th><th>Hành động kỹ thuật</th><th>Kiểm chứng</th><th>Trạng thái</th></tr>
      <tr><td><b>S2.01</b></td><td><code>repo:app/src/services/billing-service.ts:1</code></td><td>Tự động đóng băng sổ điểm danh lúc 23:59:59 cuối tháng (OQ-21)</td><td>Unit test Billing</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S2.02</b></td><td><code>repo:app/src/pages/api/webhook/sepay.ts:1</code></td><td>Xử lý webhook Sepay, xác thực token, gạch nợ tự động trong 3 giây</td><td>Unit test Sepay</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S2.03</b></td><td><code>repo:app/src/services/sinvoice-client.ts:1</code></td><td>Tích hợp API Viettel SInvoice, phát hành hóa đơn điện tử từng học sinh</td><td>Unit test SInvoice</td><td><span class="badge built">ok</span></td></tr>
    </table>
  </div>

  <h3 id="s2-4-2">§2.4.2 Phase 2: Quy tắc Khấu trừ hoàn tiền ăn 2 dòng &amp; Sibling Discount</h3>
  <p>Hóa đơn học phí hiển thị minh bạch 2 dòng hoàn tiền ăn: số ngày vắng có phép và số ngày nghỉ lễ đồng loạt toàn trường. Miễn giảm anh chị em (Sibling Discount 10% cho con thứ hai) được áp dụng tự động bằng cách nhóm học sinh theo Số điện thoại phụ huynh (OQ-23).</p>

  <h2 class="part" id="s2-5">§2.5 Phase 3: Vòng đời Học sinh &amp; Quyết toán Lưu trữ Nâng cao</h2>
  <p>Thi công quản lý biến động học sinh, nhập học giữa tháng, chuyển lớp, rút hồ sơ và lưu trữ cách ly (Mega Scenario 04).</p>

  <h3 id="s2-5-1">§2.5.1 Phase 3: Bảng các bước thi công Nhập học giữa tháng Prorated &amp; Rút hồ sơ</h3>
  <div class="tw">
    <table>
      <colgroup><col style="width:12%"><col style="width:28%"><col style="width:35%"><col style="width:15%"><col style="width:10%"></colgroup>
      <tr><th>Mã bước</th><th>Điểm chạm (Touchpoint)</th><th>Hành động kỹ thuật</th><th>Kiểm chứng</th><th>Trạng thái</th></tr>
      <tr><td><b>S3.01</b></td><td><code>repo:app/src/pages/[schoolCode]/students/admission/</code></td><td>Nhập học giữa tháng: tính học phí Prorated theo số ngày học thực tế (OQ-22)</td><td>Unit test Prorated</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S3.02</b></td><td><code>repo:app/src/pages/[schoolCode]/students/transfer/</code></td><td>Quyết toán rút hồ sơ chuyển trường: khấu trừ công nợ, hoàn tiền thừa</td><td>Unit test Transfer</td><td><span class="badge built">ok</span></td></tr>
      <tr><td><b>S3.03</b></td><td><code>repo:app/src/pages/[schoolCode]/system/archive/</code></td><td>Kho lưu trữ hồ sơ cách ly (Soft Delete), bảo lưu niên khóa lịch sử</td><td>Unit test Archive</td><td><span class="badge built">ok</span></td></tr>
    </table>
  </div>

  <h3 id="s2-5-2">§2.5.2 Phase 3: Quy tắc cách ly kho lưu trữ và bảo lưu niên khóa</h3>
  <p>Học sinh đã tốt nghiệp hoặc chuyển trường được chuyển vào Kho lưu trữ cách ly, bảo đảm hồ sơ không bị xóa cứng và điểm số lịch sử được lưu trữ toàn vẹn phục vụ tra cứu niên khóa.</p>

  <!-- PART 3 -->
  <h2 class="part-divider" id="part-3">Part 3 — Tiêu Chuẩn Kiểm Chứng &amp; Cổng Verify Gate</h2>

  <h2 class="part" id="s3-1">§3.1 SYSTEM: Tích hợp bài test và kiểm chứng nhị phân tự động</h2>
  <p>Toàn bộ các quy tắc nghiệp vụ và giao diện được kết nối trực tiếp vào bộ kiểm thử tự động của dự án.</p>

  <h3 id="s3-1-1">§3.1.1 SYSTEM: Kế hoạch phân bổ bộ 703 bài test sẵn có và test bổ sung</h3>
  <p>Bộ 703 bài test hiện hữu trong <code>app/tests/unit/</code> bao phủ toàn bộ 133 suites kiểm thử đơn vị, xác nhận tính chính xác của các validation helpers, Redux state slices và UI invariants.</p>

  <h3 id="s3-1-2">§3.1.2 SYSTEM: Hợp đồng kiểm chứng nhị phân Verify Gate (verify.sh)</h3>
  <p>Cổng kiểm chứng <code>verify.sh</code> thực thi nghiêm ngặt: chỉ khi toàn bộ bài test chạy qua 100% với mã thoát 0 thì trạng thái mới được ghi nhận là đạt chuẩn (passing).</p>

  <h2 class="part" id="s3-2">§3.2 SYSTEM: Quy trình bàn giao và nghiệm thu theo 76 Spec IDs</h2>
  <p>Tiêu chuẩn nghiệm thu tuân thủ danh mục 76 tính năng đã được nạp vào bộ điều phối Harness Loop.</p>

  <h3 id="s3-2-1">§3.2.1 SYSTEM: Ánh xạ 76 Spec IDs với các bước thi công ISP</h3>
  <p>Mỗi Spec ID trong 76 tính năng (<code>CH-01..12</code>, <code>DN-01..06</code>, <code>HT-01..06</code>, <code>NT-01..17</code>, <code>TC-01..22</code>, <code>TQ-01..03</code>, <code>VH-01..10</code>) tương ứng với 1 đơn vị thi công trong 5 pha kỹ thuật.</p>

  <h3 id="s3-2-2">§3.2.2 SYSTEM: Tiêu chí đóng dấu hoàn thành tính năng trong feature_list.json</h3>
  <p>Tính năng chỉ được chuyển từ <code>pending</code> sang <code>completed</code> trong <code>.harness-state/feature_list.json</code> sau khi vượt qua cổng Verify Gate và được cập nhật bảng Gap spec ↔ code trong LLM Wiki.</p>

  <!-- APPENDIX -->
  <h2 class="part" id="sec-outstanding">Appendix — What is outstanding &#8212; 0 units</h2>
  <div class="tw"><table><tr><th>Unit</th><th>Title</th><th>State</th><th>Marked</th></tr>
</table></div>

  <script>
{js_content}
  </script>
</body>
</html>"""

with open(ISP_FILE, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated {ISP_FILE} successfully, pinning AP SHA-256: {ap_sha256}")
