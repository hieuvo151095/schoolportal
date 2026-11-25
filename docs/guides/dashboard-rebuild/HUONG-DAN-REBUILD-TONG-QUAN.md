# Hướng Dẫn Rebuild Y Chang Module "Tổng Quan" (Executive Overview Dashboard)

> Tài liệu này kèm theo bộ mã nguồn nguyên văn giúp bạn (hoặc một AI coding agent khác) **tái tạo chính xác 100%** module **Tổng quan** (`/[schoolCode]/dashboard`) và toàn bộ luồng liên kết chéo sang **Hoạt động -> Chờ duyệt**, **Điểm danh**, **Chăm sóc trẻ**, **Phiếu bé ngoan**, **Bảng thông tin**, **Học phí** trên ECO School Operating Portal.

---

## 1. Thành Phần Bộ Gói Rebuild

Thư mục [`docs/guides/dashboard-rebuild/`](file:///Users/hieuvo/Documents/Projects/eco-school-portal/docs/guides/dashboard-rebuild/) gồm 3 file:

| STT | File | Vai trò |
|---|---|---|
| 1 | [`HUONG-DAN-REBUILD-TONG-QUAN.md`](./HUONG-DAN-REBUILD-TONG-QUAN.md) | Tài liệu kiến trúc, quy chuẩn bất biến, prompt giao việc cho agent và các bước kiểm thử. |
| 2 | [`TONG-QUAN-SOURCE-CODE.md`](./TONG-QUAN-SOURCE-CODE.md) | Chứa **100% nguyên văn (verbatim)** 17 file mới (3.621 dòng) và git diff của 11 file chỉnh sửa từ commit `7d05677`. |
| 3 | [`tong-quan-source.tar.gz`](./tong-quan-source.tar.gz) | File nén chứa nguyên vẹn cấu trúc thư mục 17 file mới (`app/src/...` và `app/tests/...`) để giải nén nhanh. |

---

## 2. Prompt Chuẩn Để Giao Cho Agent Khác Rebuild

Nếu bạn muốn một AI agent khác (trên branch sạch hoặc repo chưa có module Tổng quan) tự động rebuild lại y chang, copy nguyên đoạn prompt sau:

```markdown
Hãy triển khai lại chính xác module "Tổng quan" (Executive Overview Dashboard) cho dự án ECO School Operating Portal dựa trên bộ tài liệu & mã nguồn tham chiếu tại:
- docs/guides/dashboard-rebuild/HUONG-DAN-REBUILD-TONG-QUAN.md
- docs/guides/dashboard-rebuild/TONG-QUAN-SOURCE-CODE.md
(hoặc giải nén docs/guides/dashboard-rebuild/tong-quan-source.tar.gz nếu muốn lấy nguyên 17 file mới).

Yêu cầu bắt buộc:
1. Tạo đầy đủ 17 file mới trong Phần A của TONG-QUAN-SOURCE-CODE.md đúng đường dẫn và nội dung (types, analytics pure functions, mock data, redux slice, 10 UI components, Next.js page /[schoolCode]/dashboard, và 2 bộ unit tests).
2. Áp dụng đầy đủ các patch tích hợp trong Phần B của TONG-QUAN-SOURCE-CODE.md vào các file hiện có:
   - ds/index.tsx (SidebarNav hỗ trợ group không label cho mục Tổng quan)
   - PortalLayout.tsx (thêm item "Tổng quan" trên cùng, phía trên "Vận hành")
   - store/index.ts (mount dashboardReducer)
   - pages/index.tsx & pages/[schoolCode]/index.tsx (redirect về /dashboard)
   - ActivityToolbar.tsx, class/[classId]/activity/index.tsx, mockActivityData.ts (đồng bộ deep-link ?tab=cho_duyet & SelectField chọn lớp)
   - Xóa import thừa nếu cần theo B.9–B.11.
3. Tuân thủ nghiêm Design System v2.6.0 và Node 22 `--experimental-strip-types` (dùng `import type`, không dùng HTML raw `<button>/<select>/<input>`, không cài thêm chart library ngoài).
4. Chạy `cd app && npx tsc --noEmit` (0 lỗi) và `./verify.sh` (pass 100% unit tests) rồi báo cáo kết quả.
```

---

## 3. Kiến Trúc & Bố Cục Giao Diện `/[schoolCode]/dashboard`

Trang [`app/src/pages/[schoolCode]/dashboard/index.tsx`](../../../app/src/pages/%5BschoolCode%5D/dashboard/index.tsx) kết nối Redux `state.dashboard` qua [`dashboardSlice.ts`](../../../app/src/store/slices/dashboardSlice.ts) và các hàm tính thuần túy trong [`dashboardAnalytics.ts`](../../../app/src/utils/dashboardAnalytics.ts), tổ chức thành **6 tầng theo chiều dọc**:

1. **PageHeader + Export / Print Actions**:
   - Tiêu đề `"Tổng quan điều hành"`, subtitle hiển thị mốc đồng bộ (`lastRefreshedAt`), nút làm mới kích hoạt DS Toast (`Đã đồng bộ dữ liệu...`).
2. **Thanh lọc `DashboardToolbar`** ([`DashboardToolbar.tsx`](../../../app/src/modules/dashboard/DashboardToolbar.tsx)):
   - `SegmentedControl` chọn khung thời gian (`Hôm nay`, `Tuần này`, `Tháng này`, `Học kỳ I`, `Năm học`), kết hợp `SelectField` lọc theo khối lớp (`gradeScope`: `all` hoặc `khoi-mam`, `khoi-1`, `khoi-2`, `khoi-6`, `khoi-12`) và nút `Reset`.
3. **Hàng KPI Điều Hành `ExecutiveKpiCards`** ([`ExecutiveKpiCards.tsx`](../../../app/src/modules/dashboard/ExecutiveKpiCards.tsx)):
   - 4 `StatCard` (Sĩ số & Điểm danh, Thực thu Học phí, Chăm sóc & Sức khỏe, Hoạt động & Tương tác) tự động tính lại theo `timeRange` + `gradeScope`.
4. **Hàng Biểu Đồ 1 (2 cột trên desktop)**:
   - Trái (7/12): **Dòng tiền & Học phí (`FinanceCashflowChart`)** — SVG bar + line chart 6 tháng (`Thực thu`, `Công nợ`, `Chi phí`).
   - Phải (5/12): **Cơ cấu học sinh & Lấp đầy (`StudentCensusDonut`)** — SVG Donut chart tương tác: click vào từng khối trên biểu đồ/legend để filter trực tiếp `gradeScope` toàn dashboard; bấm `"Xem tất cả"` để bỏ lọc.
5. **Hàng Biểu Đồ 2 (2 cột bằng nhau)**:
   - Trái: **Xu hướng chuyên cần & Chăm sóc (`CareWellnessTrendChart`)** — SVG multi-line chart theo dõi % chuyên cần & chăm sóc.
   - Phải: **Hoạt động trong tuần (`WeeklyActivityChart`)** — SVG bar chart số bài đăng / album và đường tim phụ huynh (`Lượt tim`) theo từng ngày trong tuần, link sang `/${schoolCode}/class/lop-1a1/activity`.
6. **Hàng Vận Hành Nhanh 3 Cột (`BulletinBoardCard`, `ApprovalCenterCard`, `FrequentAbsenceCard`)**:
   - **Bảng thông tin (`BulletinBoardCard`)**: Hiển thị thông báo/thực đơn/TKB mới nhất, link sang `/${schoolCode}/school/announcements`.
   - **Trung tâm kiểm duyệt (`ApprovalCenterCard`)**: Đếm số bài `"Hoạt động chờ duyệt"` theo lớp (`Lớp 1A1`: `2 bài`, `Lớp Lá 1`: `1 bài`, `Lớp 2A1`: `3 bài`), click trực tiếp mở `/${schoolCode}/class/${item.classId}/activity?tab=cho_duyet`.
   - **Học sinh vắng nhiều trong tháng (`FrequentAbsenceCard`)**: Liệt kê học sinh vắng nhiều cần lưu ý, link sang `/${schoolCode}/reports/attendance` và `/${schoolCode}/class/lop-1a1/attendance`.
7. **Bảng Ma Trận Hiệu Suất Lớp Học `ClassComparisonTable`** ([`ClassComparisonTable.tsx`](../../../app/src/modules/dashboard/ClassComparisonTable.tsx)):
   - Tìm kiếm không phân biệt dấu tiếng Việt (`removeVietnameseTones`), lọc trạng thái (`stable` / `warning` / `critical`), và cột `DropdownMenu` 3 chấm điều hướng thẳng tới `Điểm danh`, `Chăm sóc trẻ`, `Phiếu bé ngoan`, `Học phí`.

---

## 4. Danh Sách Kiểm Kê Toàn Bộ File

### 4.1. 17 File Mới (3.621 dòng)

| Nhóm | File Path | Số dòng | Mô tả chức năng |
|---|---|---|---|
| **Types** | `app/src/types/dashboard.ts` | 130 | Định nghĩa `DashboardTimeRange`, `ClassMatrixStatus`, `GradeCensusSummary`, `DashboardFilterState`... |
| **Analytics** | `app/src/utils/dashboardAnalytics.ts` | 297 | Toàn bộ pure functions tính KPI, filter cashflow, wellness, weekly activity, ma trận lớp, bỏ dấu tiếng Việt. |
| **Mock Data** | `app/src/services/mockDashboardData.ts` | 562 | Dữ liệu chuẩn `DASHBOARD_GRADE_OPTIONS`, `MOCK_GRADE_CENSUS`, `MOCK_MONTHLY_CASHFLOW`, `MOCK_CARE_WELLNESS_TREND`, `MOCK_CLASS_PERFORMANCE_MATRIX`, `MOCK_WEEKLY_ACTIVITY_POSTS`, `MOCK_BULLETIN_BOARD_ITEMS`, `MOCK_APPROVAL_CENTER_ITEMS`, `MOCK_FREQUENT_ABSENCE_STUDENTS`. |
| **Redux Store** | `app/src/store/slices/dashboardSlice.ts` | 56 | State filter toàn dashboard + actions (`setTimeRange`, `setGradeScope`, `setDashboardSearchQuery`, `setDashboardStatusFilter`, `refreshDashboardData`, `resetDashboardFilters`). |
| **Components** | `app/src/modules/dashboard/DashboardToolbar.tsx` | 83 | `SegmentedControl` khung thời gian + `SelectField` chọn khối lớp + nút Reset. |
| | `app/src/modules/dashboard/ExecutiveKpiCards.tsx` | 54 | Grid 4 thẻ `StatCard` (`data-testid="executive-kpi-cards"`). |
| | `app/src/modules/dashboard/FinanceCashflowChart.tsx` | 219 | Biểu đồ cột + đường SVG tài chính (`data-testid="finance-cashflow-chart"`). |
| | `app/src/modules/dashboard/StudentCensusDonut.tsx` | 225 | Donut SVG cơ cấu học sinh (`data-testid="student-census-donut"`). |
| | `app/src/modules/dashboard/CareWellnessTrendChart.tsx` | 258 | Line chart SVG chuyên cần & chăm sóc (`data-testid="care-wellness-trend-chart"`). |
| | `app/src/modules/dashboard/WeeklyActivityChart.tsx` | 249 | Biểu đồ hoạt động & lượt tim (`data-testid="weekly-activity-chart"`). |
| | `app/src/modules/dashboard/BulletinBoardCard.tsx` | 100 | Thẻ Bảng thông tin (`data-testid="bulletin-board-card"`). |
| | `app/src/modules/dashboard/ApprovalCenterCard.tsx` | 128 | Thẻ Trung tâm kiểm duyệt (`data-testid="approval-center-card"`). |
| | `app/src/modules/dashboard/FrequentAbsenceCard.tsx` | 108 | Thẻ Học sinh vắng nhiều (`data-testid="frequent-absence-card"`). |
| | `app/src/modules/dashboard/ClassComparisonTable.tsx` | 324 | Bảng ma trận các lớp (`data-testid="class-comparison-table"`). |
| **Page Route** | `app/src/pages/[schoolCode]/dashboard/index.tsx` | 242 | Trang chính tích hợp `PortalLayout`, toolbar, 4 hàng widget và `Toast`. |
| **Unit Tests** | `app/tests/unit/dashboard.test.mjs` | 243 | Unit test pure analytics, format tiền VND, filter scope, boundary edge cases. |
| | `app/tests/unit/dashboardScenarios.test.mjs` | 343 | Test role-play (Chủ trường, Giáo vụ, Kế toán), đối kháng, đồng bộ số liệu với `INITIAL_ACTIVITY_POSTS` và cross-module deep-links. |

### 4.2. 8 File Chỉnh Sửa Tích Hợp + 3 File Dọn Dẹp

1. `app/src/components/ds/index.tsx`: Sửa điều kiện render `SidebarNav` thành `{(isExpanded || !g.label || p.collapsed) && (` để nhóm menu `overview` không cần `label` vẫn luôn hiển thị.
2. `app/src/components/layout/PortalLayout.tsx`: Thêm nav group `key: 'overview'` với item `"Tổng quan"` (`icon: 'chart-pie'`, `href: '/${schoolCode}/dashboard'`) lên trên cùng trước `"Vận hành"`.
3. `app/src/store/index.ts`: Import và đăng ký `dashboard: dashboardReducer`.
4. `app/src/pages/index.tsx`: Chuyển hướng `/` mặc định về `/demo/dashboard`.
5. `app/src/pages/[schoolCode]/index.tsx`: Chuyển hướng `/${code}` mặc định về `/${code}/dashboard`.
6. `app/src/modules/operations/activity/ActivityToolbar.tsx`: Bổ sung `<SelectField>` chọn lớp học (`selectedClassId`, `onClassChange`) trên hàng Single Frame Line 38px.
7. `app/src/pages/[schoolCode]/class/[classId]/activity/index.tsx`: Đọc query URL `?tab=cho_duyet` (`all` / `approved` / `cho_duyet` / `pinned`) khi router ready để tự động bật tab `"Chờ duyệt"` khi click từ Trung tâm kiểm duyệt; hỗ trợ đổi lớp giữ nguyên filter tab.
8. `app/src/services/mockActivityData.ts`: Đổi sang `import type { ActivityPost, LessonRef }` (bắt buộc cho Node `--experimental-strip-types`) và thêm 5 bài chờ duyệt `post-10`..`post-14` (`lop-1a1`: 2, `lop-la-1`: 1, `lop-2a1`: 3) khớp 100% số liệu trên `ApprovalCenterCard`.
9. *(Cleanup 3 file trong `7d05677`)*: `nutrition.tsx`, `reward.tsx`, `reports/reward.tsx` (xóa 2 dòng re-export/comment dư). Xem chi tiết `Phần B.9–B.11` trong `TONG-QUAN-SOURCE-CODE.md`.

---

## 5. Quy Trình Rebuild Từng Bước

### Cách 1 — Giải nén trực tiếp từ Archive (Nhanh & Không sai sót chính tả)

Từ thư mục gốc repository (`eco-school-portal`):

```bash
# Bước 1: Giải nén toàn bộ 17 file mới vào đúng vị trí app/src và app/tests
tar -xzvf docs/guides/dashboard-rebuild/tong-quan-source.tar.gz

# Bước 2: Áp dụng 8 patch tích hợp từ Phần B của TONG-QUAN-SOURCE-CODE.md
# (Hoặc xem git diff từng mục B.1 -> B.11 trong TONG-QUAN-SOURCE-CODE.md và apply thủ công / git apply)
```

### Cách 2 — Dựng lại từng file từ Markdown (`TONG-QUAN-SOURCE-CODE.md`)

1. Tạo lần lượt 17 file trong **Phần A** theo thứ tự phụ thuộc:
   - Tầng 1 (Data & Logic): `A.1 types/dashboard.ts` → `A.2 utils/dashboardAnalytics.ts` → `A.3 services/mockDashboardData.ts` → `A.4 store/slices/dashboardSlice.ts`.
   - Tầng 2 (UI Widgets): `A.5 DashboardToolbar.tsx` → `A.6 ExecutiveKpiCards.tsx` → `A.7 FinanceCashflowChart.tsx` → `A.8 StudentCensusDonut.tsx` → `A.9 CareWellnessTrendChart.tsx` → `A.10 WeeklyActivityChart.tsx` → `A.11 BulletinBoardCard.tsx` → `A.12 ApprovalCenterCard.tsx` → `A.13 FrequentAbsenceCard.tsx` → `A.14 ClassComparisonTable.tsx`.
   - Tầng 3 (Page & Tests): `A.15 pages/[schoolCode]/dashboard/index.tsx` → `A.16 tests/unit/dashboard.test.mjs` → `A.17 tests/unit/dashboardScenarios.test.mjs`.
2. Áp dụng tuần tự các patch trong **Phần B** (`B.1` → `B.11`).

---

## 6. 7 Quy Tắc Bất Biến Khi Rebuild (Tránh Lỗi Build & Sai Thiết Kế)

Nếu agent chỉnh sửa hoặc refactor lại code trong lúc rebuild, **tuyệt đối không vi phạm** 7 ràng buộc sau:

1. **Node 22 `--experimental-strip-types` yêu cầu `import type`**:
   - Mọi file `.ts` được unit test `.mjs` import trực tiếp (như `dashboardSlice.ts`, `dashboardAnalytics.ts`, `mockActivityData.ts`) **BẮT BUỘC** dùng `import type` cho interface/type (ví dụ `import type { PayloadAction } from '@reduxjs/toolkit'`, `import type { ActivityPost, LessonRef } from '../types/activity'`). Nếu viết `import { PayloadAction }` không có `type`, Node 22 sẽ báo lỗi `SyntaxError` khi chạy test.
2. **100% Biểu đồ là SVG thuần (Zero External Chart Libraries)**:
   - Project không cài `recharts`, `chart.js` hay `echarts`. Tất cả 4 biểu đồ dùng thẻ `<svg>` responsive kết hợp semantic CSS tokens (`var(--eco-blue)`, `var(--color-semantic-green)`, `var(--color-semantic-orange)`, `var(--color-danger)`, `#ec4899`).
3. **Tuân thủ tuyệt đối Design System v2.6.0 (`@/components/ds`)**:
   - CẤM dùng `<button>`, `<select>`, `<input>` HTML nguyên bản tự chế CSS; dùng `<Button>`, `<IconButton>`, `<SelectField>`, `<SearchField>`, `<SegmentedControl>`, `<DropdownMenu>`, `<DataTable>`, `<StatCard>`, `<StatusTag>`, `<Tag>`.
   - **`Tag` vs `StatusTag`**: Component `<Tag>` chỉ nhận `'default' | 'code' | 'success' | 'warning'`. Khi cần biến thể `'danger'` hoặc `'info'`, dùng `<StatusTag>`.
   - **Icon registry (`icons.ts`)**: Tên `'heart'` không nằm trong `icons.ts`, do đó `WeeklyActivityChart` vẽ inline SVG icon trái tim cho chuỗi `"Lượt tim"`.
   - **Responsive Card View (`.ecomd-cell__value`)**: Khi xếp nhiều dòng text bên trong cell bảng (ví dụ tên lớp + GVCN), phải bọc bằng `<div className="flex flex-col ...">` để không bị `.ecomd-cell__value` dàn ngang sai layout trên Mobile.
4. **Giữ nguyên `CLASSES_LIST` đúng 7 lớp trong `mockAttendanceData.ts`**:
   - Test `attendance.test.mjs` kiểm tra cứng `CLASSES_LIST.length === 7` (`lop-1a1`, `lop-1a2`, `lop-2a1`, `lop-6a1`, `lop-6a2`, `lop-12a1`, `lop-la-1`). Vì vậy `MOCK_APPROVAL_CENTER_ITEMS` và `post-10..14` chỉ dùng các `classId` hợp lệ này (`lop-1a1`, `lop-la-1`, `lop-2a1`).
5. **Giữ nguyên `DEFAULT_LANDING_PATH` trong `authValidation.ts`**:
   - Test `auth.test.mjs` (`DN-13`) yêu cầu `DEFAULT_LANDING_PATH` vẫn trỏ `/[schoolCode]/class/lop-1a1/attendance`. Điều hướng mặc định của cổng sang Tổng quan được xử lý ở `pages/index.tsx` và `pages/[schoolCode]/index.tsx`.
6. **Xử lý chia cho 0 ở roster lớp rỗng**:
   - Trong `computeExecutiveKPIs` của `dashboardAnalytics.ts`, khi scope không có học sinh (`totalStudents === 0`), `attendanceRate` phải trả về `0` (không trả `NaN`).
7. **Khớp số liệu giữa Trung tâm kiểm duyệt và Hoạt động**:
   - `MOCK_APPROVAL_CENTER_ITEMS` (`lop-1a1`: 2 bài, `lop-la-1`: 1 bài, `lop-2a1`: 3 bài) khớp 1-1 với `post-10..14` (`status: 'cho_duyet'`) trong `INITIAL_ACTIVITY_POSTS` của `mockActivityData.ts`. Test `dashboardScenarios.test.mjs` kiểm tra chéo điều này.

---

## 7. Checklist Kiểm Thử Sau Khi Rebuild

Chạy tuần tự các lệnh sau tại thư mục gốc repository:

```bash
# 1. Kiểm tra TypeScript Strict (bắt buộc 0 lỗi)
export PATH="$PWD/.tools/bin:$PATH"
cd app && npx tsc --noEmit && cd ..

# 2. Chạy toàn bộ bộ test (bao gồm dashboard.test.mjs & dashboardScenarios.test.mjs)
./verify.sh

# 3. Kiểm tra nhanh riêng 2 suite của Tổng quan (nếu cần debug nhanh)
node --experimental-strip-types --test app/tests/unit/dashboard.test.mjs app/tests/unit/dashboardScenarios.test.mjs
```

### Checklist E2E Trên Trình Duyệt (`http://localhost:3000/demo/dashboard`)
- [ ] Sidebar hiển thị mục **`Tổng quan`** ở trên cùng, đứng độc lập phía trên nhóm **`Vận hành`**.
- [ ] Truy cập `/` hoặc `/demo` tự động chuyển hướng sang `/demo/dashboard`.
- [ ] Đổi tab **`Hôm nay` / `Tuần này` / `Tháng này` / `Học kỳ I` / `Năm học`** trên `SegmentedControl` cập nhật số liệu 4 KPI cards.
- [ ] Click vào **`Khối 1`** trên Donut **`Cơ cấu học sinh & lấp đầy`** đồng bộ filter KPI, Trung tâm kiểm duyệt (`2 chờ duyệt`) và Bảng ma trận lớp (`4` lớp Khối 1); bấm **`Xem tất cả`** để reset.
- [ ] Nhập không dấu (ví dụ `"nguyen thi mai"`) vào ô tìm kiếm Bảng ma trận lọc đúng `Lớp 1A1`.
- [ ] Click **`2 bài →`** tại dòng `Lớp 1A1` trong **`Trung tâm kiểm duyệt`** điều hướng sang `/demo/class/lop-1a1/activity?tab=cho_duyet`, tự động mở tab **`Chờ duyệt`** và hiển thị đúng 2 bài (`post-05` / `post-10` hoặc các bài chờ duyệt của `lop-1a1`).
- [ ] Trên Mobile (`375x812`), trang không bị tràn ngang (`scrollWidth <= clientWidth`).
