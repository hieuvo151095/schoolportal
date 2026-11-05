# Technical Knowledge Base & Architectural Standards

> **Project:** School Operating Portal (Finviet / SOHA)  
> **Governance:** Marcus Fleet V34 Enterprise Standard  
> **Authority:** Source-Backed Architectural Ledger

---

## 1. Core Technology Stack Assumptions

The School Operating Portal is constructed upon an enterprise multi-tier architecture partitioned into frontend, backend, infrastructure, and observability layers:

1. **Frontend Architecture:**
   - **Framework:** Next.js utilizing the **Pages Router** (`pages/` directory architecture) for predictable SSR/SSG lifecycle and dynamic tenant routing `pages/[schoolCode]/...`.
   - **State Management:** Centralized **Redux Toolkit** store with feature slices (`attendanceSlice`, `activitiesSlice`, `billingSlice`, etc.) and typed hooks.
   - **Styling Paradigm:** A controlled hybrid strategy:
     - **Tailwind CSS:** Restricted to layout geometry, responsive flex/grid layouts, flex alignment, and standard linear spacing tokens.
     - **`styled-components`:** Strictly used for atomic component encapsulation, interactive state animations, pseudo-element states, and design token variable consumption.
   - **Iconography:** Font Awesome 6 Pro (SVG with JS/React icons).
   - **Authentication:** NextAuth.js configured with JWT session strategy, encrypted using JWE session cookies stored in secure HTTP-only cookies.
   - **Typography:** Google Fonts loaded in `_document.tsx`: `Baloo Chettan 2` (headings, display numbers), `Quicksand` (body copy, navigational labels), with `Inter` and system sans-serif fallbacks.

2. **Backend Architecture & APIs:**
   - **Engine:** PHP 8.2+ / Laravel 11 framework running in headless API mode.
   - **Authentication:** Laravel Sanctum using personal access bearer tokens formatted as `id|token`.
   - **API Protocol:** RESTful versioned and tenant-scoped endpoints: `/{schoolCode}/api/1.0/...`. All requests enforce the `X-School-Code` header to ensure database schema/tenant isolation.

3. **Infrastructure & Hosting:**
   - **Compute:** Google Cloud Run running stateless Docker containers (separate containerized services for the web frontend and API backend).
   - **Reverse Proxy / Gateway:** OpenResty (Nginx + Lua) providing unified edge routing, SSL termination, rate limiting, and custom domain mapping (`app-*.domain` and `api-*.domain`).
   - **Multi-Tenancy:** Single codebase servicing all schools. Tenant identification is derived from the URL path `{schoolCode}` and mapped to tenant configuration records. White-label customization is driven dynamically via `APP_PARTNER` configurations.

4. **Observability & Analytics:**
   - **Error Tracking:** Sentry SDK initialized on both client and server with ~10% trace sampling rate.
   - **Product Telemetry:** Google Analytics 4 (`gtag`) tracking page transitions and conversion actions.
   - **Session Replay:** Microsoft Clarity capturing anonymized heatmaps and session interaction streams.

---

## 2. Design System Tokens & Foundations (ECO Design System 1.0)

All UI development must adhere to the `ECO Design System 1.0` tokens registered in the workspace:
- **Brand Colors:**
  - Yellow Brand Accent: `#FEC020` (hover: `#FECD4D`, active: `#E6AC19`)
  - Primary Blue: `#0070CE` (semantic link / action: `#1A94FF`)
  - Success Green: `#00AB56` (attendance present, paid invoices)
  - Negative / Error Red: `#FF424E` / `#F53743` (unexcused absences, rejected vouchers, overdue fees)
  - Warning Orange: `#FF9F41` (excused absences, in-review approval)
  - Neutrals: Dedicated Ink ramp (`#0E0F10` to `#F4F5F6`) and legacy gray surface ramp (`#27272A` to `#F5F5FA`).
- **Spacing Scale:** Standard linear scale: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`, `64px`.
- **Border Radii:** `4px` (checkboxes, badges), `8px` (buttons, input fields), `16px` (chips, cards), `30px` (pill action buttons).

---

## 3. Mandatory Naming & Coding Standards

1. **File & Directory Conventions:**
   - React components: PascalCase (e.g., `AttendanceRoster.tsx`, `InvoiceDetailModal.tsx`).
   - Hooks & Utilities: camelCase (e.g., `useAttendance.ts`, `formatCurrency.ts`).
   - Redux slices: camelCase with `.slice.ts` suffix (e.g., `attendance.slice.ts`).
   - API endpoints: kebab-case with plural nouns (e.g., `/{schoolCode}/api/1.0/fee-schedules`).

2. **State & Mutation Integrity:**
   - Always perform optimistic client updates for high-frequency classroom actions (e.g., clicking Đón/Trả).
   - In case of network failure, roll back optimistic state and present a non-intrusive toast warning.
   - Never mutate Redux state directly; rely exclusively on Immer within Redux Toolkit reducers.

3. **Multi-Tenant State Hygiene:**
   - When switching active schools or logging in under a different tenant, Redux store state must be completely cleared using the root `RESET_TENANT_STATE` action.
   - API cache keys in RTK Query or TanStack Query must always be prefixed with the active `schoolCode`.

---

## 4. "Never Do" List (Anti-Patterns Forbidden by Fleet Governance)

- **NEVER** hardcode school codes, database schemas, or partner brand logos into application code. All tenant customizations must flow through tenant configuration objects.
- **NEVER** use generic Tailwind blue (`blue-500`) or red (`red-500`). Always reference theme CSS custom variables or configured ECO Design System aliases.
- **NEVER** write arbitrary inline CSS strings inside components. Use `styled-components` definitions or Tailwind utility classes.
- **NEVER** store unencrypted authorization tokens or sensitive student medical records in `localStorage`. Authentication tokens must remain encapsulated within HTTP-only JWE session cookies.
- **NEVER** allow check-out timestamp (Trả) to be saved when it is less than or equal to arrival timestamp (Đón). The frontend and backend must strictly reject this condition with message MSG01.
- **NEVER** run blocking facial recognition inference directly on the web server thread. Image processing must dispatch an asynchronous Cloud Run task.
- **NEVER** permit timetable deletion on published schedules, and never permit cloning on file-based timetable attachments (BR10).
- **NEVER** render semester titles without defensive fallback, preventing the legacy "undefined" title regression (BR11).
- **NEVER** permit homework assignment deletion on dispatched assignments with existing student submissions (BR06).
- **NEVER** allow modification of the assignment title during edit operations to prevent title drift across parent notifications (BR11).
- **NEVER** allow teacher grading evaluations to be saved without both a numeric score and a mandatory feedback comment (BR09).
- **NEVER** render empty subject dropdowns that permanently lock homework dispatching (BR02).
- **NEVER** compute preliminary semester GPA (TBHK) when midterm (GK) or final term (CK) milestone examinations are missing (BR03).
- **NEVER** allow early childhood developmental rubric tallies to exceed domain totals (e.g. 6/5 defect) without strict clamping (BR07).
- **NEVER** expose dirty test years in production academic year selectors (BR10).
- **NEVER** create duplicate tuition invoices for students who already possess an invoice in the selected billing month (BR05).
- **NEVER** overwrite previous payment history entries upon new payments; payment records must be strictly append-only and cumulative (BR08, TASK-FIN-001).
- **NEVER** render misleading static "Chưa có thông tin thanh toán" text on fully settled bills (BR09 / ISSUE-INV-002).

---

## 5. Academics Gradebook & Evaluation Architectural Patterns

1. **Dual Evaluation Paradigms (BR01):**
   - **Numeric Gradebook (`numeric_gradebook`):** Used for K-12 primary and secondary classes. Tracks continuous regular scores (ĐĐGTX 1–4), midterm exams (ĐĐGGK), final exams (ĐĐGCK), and automated semester GPA (TBHK).
   - **Developmental Rubric (`developmental_rubric`):** Used for Early Childhood / Kindergarten following MoET Circular 51/27. Evaluates 3 Core Competencies, 7 Specific Competencies, and 5 Primary Qualities on a 3-tier rubric scale (Tốt / Đạt / Cần cố gắng).
2. **MoET Weighted GPA Formula (BR03):**
   - $\text{TBHK} = \frac{\sum \text{TX} + 2 \times \text{GK} + 3 \times \text{CK}}{k + 5}$, rounded to 1 decimal place.
   - Missing GK or CK returns `null` (`"—"`), preventing inaccurate preliminary evaluations.
3. **Clamped Domain Tallies (BR07):**
   - Clamps evaluated counts to `Math.min(evaluatedCount, totalExpected)`, preventing UI tally overflow.

---

## 6. Finance Invoices & Tuition Billing Architectural Patterns

1. **Student-Centric Roster Paradigm (BR01):**
   - Roster lists every enrolled student in the active class. Students without an invoice for the selected month display "Không có hóa đơn" with an inline creation shortcut, rather than disappearing from the view.
2. **MoET Attendance-Linked Meal Fee Deductions (TASK-FIN-002):**
   - $\text{deductedAmount} = \text{excusedAbsenceDays} \times \text{dailyMealRate}$
   - $\text{netMealDays} = \max(0, \text{schoolDays} - \text{excusedAbsenceDays})$
   - $\text{totalMealFee} = \text{netMealDays} \times \text{dailyMealRate}$
   - Strictly rounded to exact integer VND units (no fractional cents).
3. **Cumulative Payment History & Audit Ledger (BR08, TASK-FIN-001):**
   - Payment history maintains an append-only transaction ledger logging date, amount, payment method (VietQR, Sepay, cash, POS), confirming staff or "Xác nhận tự động", and reference codes.
   - Dynamic lifecycle resolver transitions status between `da_tao`, `da_gui`, `da_thanh_toan`, `thanh_toan_mot_phan`, `qua_han`, and `da_huy`.
4. **VietQR Standard Syntax:**
   - Transfer reference follows the standard format: `HOCPHI {invoiceNo}`.

---

## 7. Finance Fee Catalog (Khoản Phí) Architectural Patterns

1. **System Fees vs. Custom Fees Isolation (BR01):**
   - **System Fees (3 fixed items: Học phí, Tiền ăn, Phí trả học sinh trễ):** Omit default amount, unit, and action icons (view, edit, delete). Only name and inline electronic invoice toggle are rendered.
   - **Custom Fees (21 items):** Possess default amount, unit, inline electronic invoice toggle, and full action set (view assignments, edit, delete).
2. **8 Standardized Fee Units (BR02):**
   - Strictly bounded to: `ngay` (Ngày), `thang` (Tháng), `nam` (Năm), `lan` (Lần), `chuyen` (Chuyến), `bo` (Bộ), `khac` (Khác), `gio` (Giờ).
3. **Inline Electronic Invoice (Xuất HĐĐT) Architecture (BR03, BR04):**
   - Electronic invoice issuance status can be toggled immediately inline from the catalog table row without opening an edit form.
   - Form Sửa (Edit) exclusively modifies Name, Default Amount, and Unit; it intentionally excludes the Xuất HĐĐT input to prevent conflicting mutation paths.
4. **Custom-Only Tally Arithmetic (BR07, BR08):**
   - The table footer counter `Tổng: N` strictly counts matching custom fee items, excluding the 3 system fees even when filters are active.

---

## 8. Nhà Trường (School Administration) Architectural Patterns

1. **Student 360° Profile Hub & Entity Topology:**
   - **Student Identity & Class Cardinality:** A student belongs to exactly one regular homeroom class (`classId`). If enrolled in an extracurricular class, the relationship is rendered as an auxiliary badge/subline: `"Ngoại khóa: {tên lớp}"`.
   - **Multi-Parent Relationship Model:** A single student can link to multiple guardian contact cards (`mother`, `father`, `guardian`, `other`), each containing full contact fields. Conversely, a parent account can link across multiple enrolled siblings (`PH của Em A, Em B`).
   - **Student Profile Hub Tabs:** Contextual tabs ("Hoạt Động", "Thư Viện", "Điểm Danh", "Học Phí") reuse parent module component trees while injecting a student-specific filter context (`kidId`), avoiding duplicated view logic.

2. **Student Lifecycle Transitions & Data Cascade Integrity:**
   - **Class Transfer & Academic Year Promotion ("Chuyển năm học"):** Transitions require explicit source class and target class selection, and enforce 3 automated data cascades:
     1. *Fee Schedule Alignment:* The student is immediately mapped to the target class's fee schedule, overriding prior class fees.
     2. *Communication Access Revocation:* Parent accounts are automatically deregistered from the source class's group chat channels and enrolled into the target class's channel.
     3. *Evaluation Pruning:* Gradebook and evaluation records are preserved only for subjects present in the target class's curriculum.

3. **Physical Development Growth Tracking & BMI Arithmetic:**
   - **Formula:** $\text{BMI} = \frac{\text{weight (kg)}}{(\text{height (cm)} / 100)^2}$, rounded to 1 decimal place.
   - **Audit Trail:** Growth entries log measurement date, height, weight, calculated BMI, recorder name, and qualitative notes in an append-only timeline.

4. **Faculty Directory & Two-Tier Content Moderation:**
   - **Role Segmentation:** Faculty roles are partitioned into "Giáo viên chính" and "Giáo viên hỗ trợ".
   - **Moderation Hook:** When a teacher posts classroom activities (`/class/{id}/activity`), the backend checks the teacher's permission tier:
     - `Giáo viên chính` $\rightarrow$ Post status immediately marked `da_duyet` (published).
     - `Giáo viên hỗ trợ` $\rightarrow$ Post status set to `cho_duyet` (queued for admin/head teacher approval in the moderation queue).

5. **Class Taxonomy & Extracurricular Feature Degeneration:**
   - **Dual Taxonomy:** Classes are strictly split into `chinh_khoa` (Curricular) and `ngoai_khoa` (Extracurricular).
   - **Feature Degeneration Invariant:** Extracurricular classes operate with a deliberately degraded capability matrix:
     - Enabled: Daily attendance roster (`/attendance`), daily activities feed (`/activity`), photo album library (`/media`).
     - Disabled: Tuition fee schedules (`/tuition-management`), gradebook evaluations (`/scoreboard`), and curriculum subject assignments (`/subject`).

6. **Class Deletion Safety Invariant:**
   - A class record can be deleted if and only if its active enrolled student headcount is zero:
     $$\text{canDelete} = (\text{studentCount} === 0)$$
   - If $\text{studentCount} \ge 1$, the delete action is omitted from the UI and rejected at the API layer to prevent orphaned student records.

7. **Subject Catalog across 4 Educational Tiers & Teaching Assignments:**
   - **Tier Separation:** Subjects are partitioned across 4 distinct educational levels (Tiểu học - `TH`, Trung học cơ sở - `THCS`, Trung học phổ thông - `THPT`, Giáo dục thường xuyên - `GDTX`). Identically named subjects (e.g. "Toán") carry level-specific codes and curriculum configurations.
   - **Teaching Assignment Deduplication:** The subject assignment modal displays a dropdown of school teachers that dynamically filters out faculty members already assigned to that specific subject.

8. **Grade Level Hierarchy & Reactive Client-Side Search Resolution:**
   - **Legacy Search Defect Mitigation:** To resolve the legacy server defect where `GET /grades?q=...` returns empty results and input clearing fails to reload, search filtering is executed client-side over the in-memory grade level store.
   - **Instant Clear Restoration:** Clearing the search input immediately restores the complete 26-grade listing without requiring a page reload (F5).

---

## 9. Nhà Trường Phase 2: Operations, Communication & Knowledge Patterns

1. **Bảng Thông Tin (Announcement Board) Architectural Patterns:**
   - **Life-cycle State Machine:** Enforces 3 distinct states: `ban_nhap` (editable, deletable), `chua_gui` (scheduled, editable, cancelable), and `da_gui` (published, read-only, trackable).
   - **Multi-Channel Dispatch Engine:** Supports targeting via Ứng dụng (App push), Email, or both. Audience cohorts support whole school, teachers, parents, specific classes (with teacher/parent sub-filtering), or individual accounts.
   - **Email Permanence & Deletion Audit:** Deleting single or multiple announcements removes records from the Web portal and mobile app, but displays an explicit confirmation warning that dispatched emails cannot be recalled from recipient inboxes.

2. **Bình Chọn (Polls & Surveys) Architectural Patterns:**
   - **Decoupled Formulation vs Audience Allocation:** The poll creation form defines topic, description, options ($\ge 2$), deadline, multi-choice allowance, and parent visibility. Target audience (`Toàn trường` vs `Lớp học`) is selected during a subsequent dispatch step.
   - **Conditional Dynamic Analytics:** Progress bars display vote counts and percentages for all options. An interactive SVG pie chart dynamically renders if and only if total votes $> 0$.
   - **Voter Revision Audit Trail:** Each respondent record maintains an append-only revision log tracking previous option selections with historical timestamps.

3. **Thực Đơn (Weekly Meal Menus & Food Safety) Architectural Patterns:**
   - **Nutritional Horizon Boundary:** Menus can be authored up to 8 calendar weeks ahead of the current date.
   - **Class Fallback Inheritance Invariant:** If a class lacks a custom weekly menu override, the application automatically resolves and renders the school-wide (`Toàn trường`) menu for that week.
   - **Dual Food Safety Traceability:** Dishes support ingredient provenance via GS1 GTIN barcodes + lot numbers (resolving supplier credentials) or internal kitchen stamp codes.
   - **Asymmetric Cloning Invariant:** Cloning is strictly permitted for structured Grid menus (Mon–Sat $\times$ 3 meals) and disabled for unstructured File uploads.
   - **Dual Publish Modes:** Menus support silent publishing or integrated dispatch that automatically authors a broadcast announcement in Bảng Thông Tin.

4. **Điểm Danh NV (Staff Attendance) Architectural Patterns:**
   - **Rapid Single-Click Clock-In:** Routine Check-in and Check-out record current timestamps optimistically in $< 50\text{ms}$ with immediate toast confirmation, eliminating modal friction during morning staff arrivals.
   - **Modal Guardrails for Absences & Overrides:** Marking staff Absent (`Có phép` vs `Không phép`) requires modal confirmation with mutual exclusivity disabling clock-in/out buttons. Modifying recorded hours enforces strict `HH:mm` format validation.
   - **45-Day Retroactive Window:** Attendance logs can be reviewed and edited for dates up to 45 days in the past. Future calendar dates are strictly locked.
   - **Search-Time Metric Suppression:** Substring text searching by staff name automatically hides the 3 aggregate school-wide KPI summary counters (Tham dự, Vắng có phép, Vắng không phép) to prevent misinterpretation of subset counts.

5. **Sổ Tay PH (Parent Handbook) Architectural Patterns:**
   - **Strict 2-Tier Knowledge Depth:** The category taxonomy is bounded to Root Categories and Sub-Categories, with Articles as leaf nodes. Nested sub-category creation beyond tier 2 is disabled.
   - **Single-Sibling Accordion Expansion:** Expanding a category node automatically collapses open sibling nodes within the same parent group.
   - **Cascading Deletion Safeguards:** Deleting a category prompts an explicit modal warning confirming the cascading removal of all nested sub-categories and articles.

---

## 10. Nhà Trường Phase 3: Governance, Temporal Terms & Learner Archive Patterns

1. **Góp Ý (Parent Feedback & Inquiries) Architectural Patterns:**
   - **Status Card Filter Isolation & Counter Persistence (`K012`):** The 4 status cards (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`) act as clickable filters that highlight when active and toggle back to unfiltered on re-click or "Xóa bộ lọc". Crucially, all 4 cards persistently display global school-wide counts for each status regardless of which card is selected, resolving the legacy defect where counts dropped to 0.
   - **Inline Priority Modification:** Priority tiers (`Thấp`, `Trung bình`, `Cao`, `Khẩn cấp`) can be changed directly from table row dropdowns or the detail view header, immediately triggering an optimistic Redux state update and toast feedback.
   - **Two-Way Discussion Protocol:** The discussion timeline supports messages with image attachments. Submitting a school message automatically flips the ticket's `waitingOn` state to `parent` ("Chờ phản hồi từ phụ huynh"), while parent replies toggle it to `school` ("Chờ phản hồi từ nhà trường").
   - **Ticket Closure Verification (`GY-01`):** Transitioning a ticket to `Hoàn tất` requires explicit modal confirmation mentioning the ticket title, preventing accidental ticket termination.

2. **Lịch Sự Kiện (Event & Holiday Calendar) Architectural Patterns:**
   - **3-View Topology Synchronization:** The calendar maintains identical state across 3 distinct presentation modes:
     - `Năm`: 12-month mini-grid overview showing color dots/stripes on dates with events, plus a bottom color legend.
     - `Tháng`: Full-month calendar view with continuous horizontal spanning event bars across multi-day events.
     - `Sự kiện`: Chronological list mode featuring tear-away calendar date cards with large day numbers and month labels, and direct inline edit and delete actions.
   - **Semantic Category Color Tokens:** Events are strictly partitioned into 3 colors: `Ngày nghỉ` (Rose `#E11D48`), `Sự kiện nội bộ` (Teal `#0D9488`), and `Sự kiện có mời phụ huynh` (Amber `#EA580C`).
   - **Single-Day End Date Auto-Defaulting (`K014`):** When creating or editing an event, selecting a start date (`Từ ngày`) automatically fills the end date (`Đến ngày`) with the identical value if the end date is currently empty, saving repetitive input while satisfying the requirement that 1-day events have identical boundaries.
   - **Granular Time Resolution ("Thêm thời gian"):** Form supports an optional toggle revealing `Giờ bắt đầu` and `Giờ kết thúc` (`HH:mm`), enabling precise scheduling for assemblies and ceremonies.
   - **Confirmation Dialogs & Dirty Protection:** Event deletion enforces confirmation modal `LS-01` ("Vui lòng xác nhận xóa sự kiện {tên sự kiện}"), and uncommitted form changes trigger modal `LS-02` on route transitions.
   - **Cross-Module Meal Refund Interoperability:** School holidays (`ngay_nghi`) automatically cross-link with the Tuition Meal Refund mechanism (`TASK-FIN-034` in `settingFeeSlice.ts`), ensuring 100% meal reimbursement for statutory school closures.
   - **Temporal Scope Filtering:** The Event list mode features a scope filter toggle between `Sự kiện sắp tới` (events on or after current system date) and `Tất cả sự kiện` (all events in the selected calendar year).

3. **Năm Học (Academic Years & Terms Configuration) Architectural Patterns:**
   - **Automated Current Year Derivation (`BR01`):** The system dynamically evaluates current system date (`new Date()`) against `startDate` and `endDate` intervals across all records. The matching academic year is automatically tagged with the bold blue styling and green `Hiện tại` badge.
   - **Minimal 3-Field Governance:** Form is strictly constrained to `Tên năm học`, `Ngày bắt đầu`, and `Ngày kết thúc` with no extraneous entity coupling.
   - **Date Overlap Prevention (`K015`):** Academic years enforce date validation ensuring full school year intervals do not overlap, protecting cross-module calendar year filters (such as in Góp Ý, Môn Học, and Lớp Học) from ambiguous interval queries.
   - **Deletion Invariant (`BR03`):** Academic years cannot be deleted from the UI to protect relational integrity across dependent student enrollments, fee schedules, and subject syllabi.

4. **Lưu Trữ (Archived Students Roster) Architectural Patterns:**
   - **Learner Historical Continuity (`K013`):** Withdrawing a student in the Học Sinh module moves their record to the Lưu Trữ repository while preserving their entire historical profile, past invoices, attendance records, and growth logs.
   - **Withdrawal Context Metadata (`BR02`):** Each row preserves withdrawal date, staff operator link (opening staff profile modal), and withdrawal reason.
   - **Student Profile Warning Banner (`BR03`):** Opening an archived student's profile renders a prominent warning banner (`🔒 Học sinh đã được lưu trữ`) and presents fields in read-only mode.
   - **Restoration with Class Continuity Guard (`K013`):** Restoring a student prompts a confirmation dialog. If the student's former class is active in the current academic year, the student is re-enrolled into that class. If the former class is inactive or archived, enrollment defaults to unassigned ("Chưa xếp lớp") with an informative alert.
   - **Two-Step Permanent Purge Safeguard (`BR06`):** The delete action in Lưu Trữ executes permanent, irreversible removal from the database. It enforces a two-step confirmation modal with red warning graphics and explicit student name confirmation.

---

## 11. Tài Chính: Miễn Giảm (Tuition Exemption & Fee Discount Policy Management)

1. **Discount Stacking & Conflict Resolution Pipeline (`K016`):**
   - **Highest Discount Priority Rule:** When multiple discount policies target the same student and the same fee line item (e.g., a 20% sibling discount and a 30% merit scholarship both applying to Tuition), the engine selects the highest discount percentage or value (`Math.max(rate_1, rate_2)`). Discount percentages for the same line item are never additive beyond the highest rate unless explicitly structured as distinct line items.
   - **Scope Specificity Precedence:** An individual student-targeted discount policy strictly takes precedence over a broader class-wide discount policy targeting the same fee line item, allowing targeted administrative adjustments without altering cohort policies.
   - **Disjoint Line-Item Independence:** Policies targeting distinct fee items (e.g., 50% discount on Tuition and 200,000 VND fixed deduction on Bus Transportation) evaluate and apply independently to their respective line items without interference or cross-item balance spillover.
   - **Non-Negative Line-Item Clamping:** Total discount deduction for any given fee item is mathematically clamped to $[0, \text{grossLineItemAmount}]$, ensuring that line-item totals and net payable balances cannot become negative.

2. **Temporal State Machine & Historical Immutability (`K017`):**
   - **Automated Lifecycle Transitions:** A discount policy's lifecycle status (`Hoạt động`, `Ngừng áp dụng`, `Hết hạn`) is dynamically evaluated against the current system date and billing period:
     - Active (`Hoạt động`): Within the configured validity window (`academic_year` or `fromMonth` $\le \text{currentDate} \le$ `toMonth`) and not administratively paused.
     - Expired (`Hết hạn`): When the current date strictly exceeds `toMonth` or the academic year end date. Expired policies are excluded from billing runs.
     - Paused (`Ngừng áp dụng`): Manually paused by school accountant/admin, temporarily suppressing auto-application during invoice generation while preserving policy metadata.
   - **Historical Invoice Immutability:** Updating, pausing, or expiring a discount policy strictly governs future invoice generation batches. Invoices already generated, distributed, or settled (`da_tao`, `da_gui`, `da_thanh_toan`) permanently preserve their historical discount deductions and audit references.

3. **Dual Scope Topology & Target Resolution:**
   - **Cohort vs Individual Beneficiaries:**
     - `class`: Targets all active students enrolled in one or more selected classes (or "Tất cả các lớp").
     - `student`: Targets specific individual students selected across any active class in the school.
   - **Resolution Algorithm:** During tuition invoice generation for month $M$ and student $S \in \text{Class } C$:
     $$\text{ApplicablePolicies}(S, F, M) = \Big\{ P \in \text{ActivePolicies} \;\Big|\; P.\text{feeItemId} = F \;\wedge\; M \in P.\text{validityInterval} \;\wedge\; (S \in P.\text{students} \;\vee\; C \in P.\text{classes}) \Big\}$$
     The winning policy is chosen via Scope Specificity followed by Highest Discount Priority.

4. **Invoicing Creation Wizard Integration & Admin Override (`K018`):**
   - **Creation Wizard Toggle:** During tuition invoice generation (`/school/fee/create`), Step 1 presents a dedicated toggle: "Tự động áp dụng chính sách miễn giảm" (default ON).
   - **Deduction Rendering:** When enabled, invoice preview and bill line items render itemized discount deductions labeled `Miễn giảm: {policyName}` with negative amounts (`-X VND`), adjusting total payable.
   - **Single-Batch Override:** Disabling the toggle bypasses discount calculations for that specific generation run only, generating gross invoices without altering the active status of policies in the catalog.

5. **Catalog Roster & Beneficiary Export:**
   - **Data Roster:** Renders policy code, name, fee item, scope summary (e.g., "3 Lớp" or "5 Học sinh"), discount rate/value, validity period, and status.
   - **Excel Export:** Generates standardized `.xlsx` reports containing full policy definitions and expanded student beneficiary rosters with audit timestamps.

---

## 12. Cấu Hình: Học Phí (Settings Fee Configuration Architecture & Policy Engines)

1. **Childcare Surcharge & Meal Refund Policies (`C046`, `K020`, `K022`):**
   - The Late Pickup & Absence Refund block supports fixed vs tiered childcare surcharges with permanent row 1, and 0-100 hour meal refund advance thresholds linked to school operating hours.
   - **Late Pickup Dual Modalities:**
     - *Fixed Interval Rate (`Theo giờ cố định`):* Combobox with 13 choices (5–60 minutes in 5-minute increments) paired with an integer VND unit rate per student per hour.
     - *Tiered Time Brackets (`Theo khung giờ`):* Dynamic table configuring Start Time, End Time, and VND Surcharge. Row 1 represents the baseline late bracket and is strictly non-deletable (no trash icon). Trash delete icons appear on row items strictly when $\ge 2$ rows exist in the bracket roster (`BR13`).
     - *Mode Switching & Draft Preservation (`K020`):* Switching between fixed and tiered calculation modes maintains both parameter sets in draft memory, ensuring administrators do not lose bracket definitions during form experimentation before clicking "Lưu".
   - **Absence Meal Refund Threshold & School Operating Hours (`K022`):**
     - Searchable combobox featuring 101 choices (0 to 100 hours in 1-hour increments).
     - *Toggle ON:* Dynamically displays the school's read-only Operating Hours schedule (Monday through Saturday, referenced from School Information SM1) and enforces that meal fees are only refunded for absences reported prior to the advance threshold.
     - *Toggle OFF:* Hides the operating hours table completely and switches the billing policy to automatically refund all absent days unconditionally (`BR10`).

2. **Independent Form Block State Partitioning (`C043`, `BR01`, `BR03`):**
   - Main settings dashboard (`/setting/fee/`) hosts five distinct functional blocks: Invoice Notes, Sepay Integration, SInvoice e-Invoice, Late Pickup & Absent Refund, and Reconciliation Emails.
   - Each block maintains an isolated dirty flag in the Redux store. Modifying an input in one block enables only that block's "Lưu" button; neighboring save buttons remain disabled.
   - Attempting to leave the page or reload while any block is dirty triggers the system confirmation modal: *"Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!"*.

3. **Electronic Invoicing & Payment Credential Security (`C044`, `C045`, `K019`):**
   - *Viettel SInvoice Credentials:* When SInvoice toggle is ON, all 6 core fields (Tax Code, Account Name, Password, Template, Type, Serial) are mandatory (*). To prevent shoulder-surfing in open school administration offices, the password field is permanently masked (`type="password"`) without an unmask toggle. Toggling SInvoice OFF collapses the card body completely (`BR04`).
   - *Sepay Integration Parameters:* Read-only inspection of API Secret Token and Webhook URL with eye toggle icons for developer and accountant verification, paired with a direct link to the monthly Sepay Transaction History view (`/setting/fee/payment-history/`).

4. **Reconciliation Distribution Roster (`C047`, `K021`):**
   - Enforces standard RFC 5322 regex email validation, rejecting invalid syntax with inline error *"Email không hợp lệ"* (`ERR-HP-01`).
   - Prevents duplicate email entries case-insensitively with error *"Email đã tồn tại trong danh sách"* (`ERR-HP-02`).
   - Imposes a strict hard limit of 3 email recipients, disabling the input field and Add button once the cap is reached.

---

## 13. Cấu Hình: Cơ Chế Hoàn Tiền Ăn & Khấu Trừ Hóa Đơn Kỳ Sau (Meal Refund Architecture & Billing Engine)

1. **Dual-Category Absence Classification (`C048`, `K024`):**
   - Non-attendance school days are categorized into two functional groups:
     - **Group A (Ngày nghỉ lễ / Sự kiện của trường):** National statutory holidays (e.g., 02/09) and school calendar event closure dates. Enforces an automated **100% refund guarantee** across all meal categories (**Tiền ăn**: 100%, **Tiền ăn sáng**: 100%) as a read-only system policy without requiring manual percentage input.
     - **Group B (Ngày học sinh tự nghỉ):** Student absences identified via Parent Leave Requests (Đơn báo vắng) or homeroom teacher attendance marks. Schools configure independent refund percentages for **Tiền ăn (bán trú / trưa)** (0–100%, default 50%) and **Tiền ăn sáng** (0–100%, default 70%).

2. **Multi-Component Meal Refund Arithmetic (`C049`):**
   - Total accumulated refund in month $M$ is computed via:
     $$\text{Refund}_{main} = (D_{self} \times P_{main} \times \text{Rate}_{main}) + (D_{school} \times P_{main} \times 100\%)$$
     $$\text{Refund}_{bf} = (D_{self} \times P_{bf} \times \text{Rate}_{bf}) + (D_{school} \times P_{bf} \times 100\%)$$
     $$\text{Total Refund} = \text{Refund}_{main} + \text{Refund}_{bf}$$
   - *Verified Arithmetic Scenario (September):* For $D_{self}=3$ self-absence days, $D_{school}=1$ holiday day (02/09), daily rates $P_{main}=40,000\text{đ}$ and $P_{bf}=20,000\text{đ}$, with rates $50\%$ and $70\%$:
     - Tiền ăn: $(3 \times 40,000 \times 50\%) + (1 \times 40,000 \times 100\%) = 60,000 + 40,000 = 100,000\text{đ}$.
     - Tiền ăn sáng: $(3 \times 20,000 \times 70\%) + (1 \times 20,000 \times 100\%) = 42,000 + 20,000 = 62,000\text{đ}$.
     - Total September Meal Refund $= 162,000\text{đ}$.

3. **Next-Month Billing Cycle Ingestion ($M+1$) (`C049b`, `K023`, `ADR-014`):**
   - In accordance with standard Vietnamese educational accounting practice, tuition and meal fees for month $M+1$ (e.g. October) are billed in advance, while attendance is reconciled at the end of month $M$ (September).
   - The invoice creation wizard (`CreateInvoiceWizardModal.tsx`) automatically ingests the accumulated $M$ refund, displaying itemized deduction rows in Step 3 review.

4. **Invoice Itemized Breakdown & VietQR Synchronization (`C050`):**
   - Generated invoice line items explicitly record itemized descriptions (e.g., `Khấu trừ hoàn tiền ăn T9: -100.000đ (3 ngày tự nghỉ [50%]: -60.000đ, 1 ngày nghỉ lễ [100%]: -40.000đ)`).
   - Net total payable and generated VietQR payment strings synchronize with 100% precision, preventing discrepancies between invoice displays and bank transfer requests.

---

## 14. Cấu Hình: Đối Soát Nhóm Trường & Quy Tắc Gói Năm (School Group Reconciliation & Annual Invariant)

1. **Reconciliation Unit Classification (Đơn vị đối soát - BR02):**
   - **Theo nhóm trường:** Creates aggregated reconciliation sessions and a unified reconciliation voucher for the entire legal corporate entity (`group`).
   - **Theo từng trường:** Creates separate reconciliation sessions and vouchers for each individual school branch (`school`).
   - Maximum 3 email recipients for automated periodic statement delivery (BR03).

2. **Annual Single-Package Invariant ("1. Đối soát theo năm" vs "2. Đối soát theo kỳ" - ADR-016):**
   - **1. Đối soát theo năm:** Configures an annual bundled service period (`cố định 1 kỳ`, e.g., `05/09/2026 - 25/05/2027`). **Crucial Rule:** In this mode, no sub-period breakdown table is rendered (the sub-periods table in the red frame is completely removed/omitted) and `terms: []` is strictly empty across all mock data (`UATTEST2`, `nhomtruonghethong`, `Tuantest1`, `truongthuanthoi`).
   - **2. Đối soát theo kỳ:** Enables custom semester/term partitioning (`Số kỳ >= 2`). When the operator clicks "Sinh lịch kỳ", the system auto-calculates and renders the sub-periods table (`Tên kỳ`, `Từ ngày`, `Đến ngày`, `Thu phí (BR05)`, `Thao tác`).
   - Switching between modes automatically resets `terms: []` and fixes `termCount: 1` when returning to "Đối soát theo năm".

3. **Billing Threshold Rules (Ngưỡng thu phí - BR06 & BR07):**
   - Minimum active months threshold (e.g. 1 month) to charge fees in the term.
   - Day-rounding threshold (e.g. >= 15 days rounded up to 1 month).




---

## 15. Nhà Trường: Quản Lý Lớp Học (School Class Management Knowledge & Invariants)

1. **Dual-Taxonomy Class Architecture (`C055`, `BR01`):**
   - **Lớp chính khóa (Curricular Classes):** Formal academic cohorts following the official Ministry of Education curriculum. Contains Grade level, single designated Homeroom Teacher (`GVCN`), student roster, 6-item tuition fee schedule breakdown, gradebook evaluations, subject assignments, daily attendance, activities, and photo albums.
   - **Lớp ngoại khóa (Extracurricular Classes / Clubs):** Supplementary after-school clubs (e.g., CLB Bóng rổ, Mỹ thuật, STEM Robotics, Tiếng Anh giao tiếp). Operates with multi-instructor staffing (`instructorIds`), club categories, flexible meeting schedules, and standalone course fee structures without formal grade evaluation sheets.

2. **Empty-Class Deletion Guardrail (`C056`, `K026`, `BR02`):**
   - Under no circumstances may a class containing one or more enrolled students (`studentCount > 0`) be deleted.
   - The UI disables/hides the delete icon and presents an informative tooltip: *"Không thể xóa lớp đang có {N} học sinh. Vui lòng chuyển học sinh sang lớp khác trước khi xóa."*
   - Only when `studentCount === 0` is the delete action active, requiring explicit confirmation through `MODAL-DELETE-CLASS` before mutating Redux state.

3. **Asymmetric Teacher Staffing Models (`C057`, `K027`, `BR03`):**
   - Curricular classes mandate exactly one primary Homeroom Teacher (`homeroomTeacherId`). The selector provides conflict detection warnings if the chosen teacher is already assigned to another active class in the school year.
   - Extracurricular classes support multi-instructor assignments (`instructorIds: string[]`), enabling team-teaching and rotational coaching.

4. **Centralized Class Convergence Hub (`C058`, `BR07`, `BR08`):**
   - Class Detail (`/school/classes/[classId]`) converges multi-module data into a single administrative cockpit:
     - Tab 1: **Học sinh:** Full enrolled student roster with links to student profiles (`/school/kid/detail/[id]`).
     - Tab 2: **Thông tin học phí:** Class fee schedule matrix preview and collection progress.
     - Tab 3: **Phân công bộ môn:** Subject allocations and assigned subject teachers.
     - Tab 4: **Lối tắt vận hành:** One-click shortcuts to daily Attendance (`/class/[classId]/attendance`), Activity feeds (`/class/[classId]/activity`), Media albums (`/class/[classId]/media`), and Timetables (`/school/schedule`).

5. **"Never Do" List for Class Management:**
   - **NEVER** permit class deletion when `studentCount > 0`.
   - **NEVER** display the "Khối lớp" filter dropdown on the Extracurricular tab.
   - **NEVER** allow duplicate class codes within the same academic year.
   - **NEVER** hardcode class sizes beyond statutory MoET limits (max 35 for primary, 45 for secondary/high school).

---

## 16. Nhà Trường: Quản Lý Môn Học (School Subject Management Knowledge & Invariants)

1. **Four-Stage Educational Partitioning (`C059`, `BR01`, `K030`):**
   - The subject directory is strictly partitioned into 4 educational tiers:
     - **Tiểu học (TH):** Grades 1–5 following MoET Circular 27/2020/TT-BGDĐT. Subjects: Tiếng Việt, Toán, Đạo đức, Tự nhiên và Xã hội, Lịch sử và Địa lí, Khoa học, Tin học và Công nghệ, Giáo dục thể chất, Nghệ thuật (Âm nhạc, Mĩ thuật), Hoạt động trải nghiệm.
     - **Trung học cơ sở (THCS):** Grades 6–9 following MoET Circular 22/2021/TT-BGDĐT. Subjects: Ngữ văn, Toán, Ngoại ngữ 1, Giáo dục công dân, Lịch sử và Địa lí, Khoa học tự nhiên, Công nghệ, Tin học, Giáo dục thể chất, Nghệ thuật, Hoạt động trải nghiệm hướng nghiệp.
     - **Trung học phổ thông (THPT):** Grades 10–12 following MoET Circular 22/2021/TT-BGDĐT. Core compulsory subjects + career-oriented elective subject groups (Khoa học xã hội, Khoa học tự nhiên, Công nghệ và Nghệ thuật).
     - **Giáo dục thường xuyên (GDTX):** Continuing education curriculum variants.
   - Each stage maintains an isolated catalog where subject codes are stage-scoped (e.g., `TH-TOAN`, `THCS-TOAN`, `THPT-TOAN`).

2. **Standard MoET Subject Catalog Protection (`C060`, `BR06`, `K029`):**
   - Core statutory subjects (`isStandardMoET === true`) cannot be deleted or have their subject codes, classification, or assessment methods altered by School Admins.
   - The administrative scope for standard subjects is strictly restricted to managing teacher assignments (`assignedTeachers`).

3. **Structured Term Evaluation Matrix (`C061`, `BR08`, `K031`):**
   - Every subject maintains a 4-term evaluation schema across Giữa Kỳ 1, Cuối Kỳ 1, Giữa Kỳ 2, and Cuối Kỳ 2.
   - Permissible evaluation modalities:
     - `score`: Numerical grading (0–10).
     - `level`: Qualitative tiers (`Hoàn thành tốt`, `Hoàn thành`, `Chưa hoàn thành` per Circular 27/2020).
     - `comment`: Descriptive formative feedback (Đánh giá bằng nhận xét per Circular 22/2021 for Âm nhạc, Mỹ thuật, GDTC, HĐTN-HN).
     - `score_comment`: Combined score and qualitative feedback.
   - GPA status flag `isCountedForGPA` (`tinh_tong_ket`) indicates whether the subject contributes to semester and yearly GPA rankings.

4. **Governed Teacher Assignment & Unassignment Safeguards (`C062`, `BR09`, `BR10`, `K032`):**
   - **Assignment (`MODAL-ASSIGN-TEACHER`):** The teacher dropdown strictly filters out faculty already assigned to the subject for that academic year, preventing duplicate records.
   - **Unassignment (`MODAL-UNASSIGN-TEACHER`):** Removing a teacher from a subject requires explicit confirmation via a warning dialog indicating the teacher's name, the subject, and the number of assigned classes.
   - **Scoreboard Integrity:** Unassigning a teacher removes future assignment links but strictly preserves past grade evaluations and audit logs in `/school/scoreboard`.

5. **"Never Do" List for Subject Management:**
   - **NEVER** allow School Admins to delete or rename core MoET standard subjects (`isStandardMoET === true`).
   - **NEVER** permit assigning a teacher twice to the same subject in the same academic year.
   - **NEVER** unassign a teacher without explicit modal confirmation (`MODAL-UNASSIGN-TEACHER`).
   - **NEVER** hardcode evaluation matrix columns without adhering to the 4 statutory milestone terms.

---

## 17. Nhà Trường: Quản Lý Khối Lớp (School Grade Level Management Knowledge & Invariants)

1. **Four-Stage Statutory Cohort Partitioning (`C064`, `BR01`, `BR03`, `K033`):**
   - Grade levels are national statutory educational cohorts organized across 4 stages per MoET Circulars 28/2020 and 32/2020:
     - **Tiểu học (TH):** Grades 1 to 5 (`K01`, `K02`, `K03`, `K04`, `K05`).
     - **Trung học cơ sở (THCS):** Grades 6 to 9 (`K06`, `K07`, `K08`, `K09`).
     - **Trung học phổ thông (THPT):** Grades 10 to 12 (`K10`, `K11`, `K12`).
     - **Giáo dục thường xuyên (GDTX):** Continuing Education grades 10 to 12 (`K10-GDTX`, `K11-GDTX`, `K12-GDTX`).
   - Grade catalog dashboard at `/[schoolCode]/school/grades` provides 5 filter pills: "Tất cả", "Tiểu học (TH)", "THCS", "THPT", "GDTX".

2. **Statutory Master Catalog Immutability (`C065`, `BR06`, `K033`):**
   - Grade levels represent national educational cohorts defined by Vietnamese statutory standards.
   - The catalog is strictly read-only for School Administrators: creating non-standard grade levels (e.g. "Khối 13") or deleting standard grades is strictly disabled in both the UI and Redux reducers.
   - Preserves structural cohort integrity across downstream class rosters, academic transcripts, and scoreboards.

3. **Dynamic Reactive Rollups (`C066`, `BR02`, `K034`):**
   - Grade-level statistics (total classes, enrolled students, faculty count, and homeroom staffing rates) are computed dynamically from active class rosters matching `gradeLevelId === grade.id` within the selected `academicYear`.
   - Avoids stale denormalized counters when classes are created, updated, or students are transferred in `/school/classes` and `/school/kid`.

4. **Instant Client-Side Accent-Insensitive Search (`C067`, `BR04`, `BR05`, `K035`):**
   - Implemented via pure helper `normalizeVietnameseText`.
   - Matches both grade names and codes without diacritic sensitivity (e.g., "khoi 1" matches "Khối 1" and "K01").
   - Erasing the search input restores the complete listing instantaneously without page reloads or API round-trips (< 10ms).

5. **Grade Detail Cockpit & Cross-Module Shortcuts (`C068`, `BR07`, `BR08`, `K036`):**
   - Dedicated full-page route at `/[schoolCode]/school/grades/[gradeId]` hosts 4 metric KPI summary cards and a comprehensive 8-column class roster table.
   - Class rows provide direct operational shortcuts linking to Class Detail (`/school/classes/[classId]`), Daily Attendance (`/attendance`), and Timetables (`/schedule`).

6. **"Never Do" List for Grade Management:**
   - **NEVER** expose "Thêm mới" or "Xóa khối lớp" buttons; grade levels are statutory master data.
   - **NEVER** store hardcoded static class or student counters on grade records.
   - **NEVER** use server-side round-trips for grade search when the catalog is under 50 items.
   - **NEVER** navigate to dead or unlinked operational paths from the class roster table.

---

## 18. Nhà Trường: Bảng Thông Tin (School Announcement Board Knowledge & Invariants)

1. **Multi-Channel Transmission & Recipient Scoping (`C069`, `BR03`, `BR05`):**
   - **Transmission Channels:** Supports 3 delivery modalities:
     - `app`: Mobile app push notification only.
     - `email`: Direct electronic mail delivery to registered recipient mailboxes.
     - `both`: Dual-channel broadcast transmitting both mobile push and email notifications.
   - **Target Audience Hierarchy:** 5 recipient tiers:
     - `toan_truong`: School-wide broadcast to all enrolled families and staff.
     - `toan_bo_giao_vien`: Faculty broadcast restricted to teachers and administrators.
     - `toan_bo_phu_huynh`: Parent community broadcast across all grades.
     - `lop_hoc`: Class-scoped broadcast with dynamic sub-audience (`all` | `teachers` | `parents`) and multi-class selection (`targetClassIds: string[]`).
     - `ca_nhan`: Individual-level targeted notifications to specific teachers, parents, or students.

2. **Draft-Only Mutability Safeguard (`C070`, `BR02`, `K038`):**
   - Announcements enforce a strict 3-state lifecycle: `ban_nhap` (Bản nháp), `chua_gui` (Chưa gửi - Scheduled), and `da_gui` (Đã gửi - Published).
   - Only announcements in `ban_nhap` status display the "Chỉnh sửa" action.
   - Published announcements (`da_gui`) are strictly immutable: once dispatched, emails and push notifications have already landed in recipient mailboxes and mobile devices. Modifying a sent record introduces untraceable discrepancies between the received push payload and the portal archive. If corrections are needed, administrators must publish a clarifying announcement or delete the record.

3. **Scheduled Dispatch & Cross-Module Notice Generation (`C071`, `BR06`, `K011`):**
   - Populating `sendDate` with a future date schedules the notice in `chua_gui` status; the system background worker automatically dispatches notifications on that date.
   - Leaving `sendDate` empty dispatches immediately upon clicking "Gửi", timestamping `sentAt = now()`.
   - Cross-module operations (such as publishing a weekly meal menu in `/school/menu` with "Gửi thông báo") automatically author a linked announcement (`category: 'thuc_don'`) linked via `linkedAnnouncementId`.

4. **Irrevocable Email Notification Warning & Audit Retention (`C072`, `BR10`, `BR11`, `K040`):**
   - Deleting single or multiple selected announcements removes them from portal views and mobile feeds, but previously dispatched emails cannot be retracted from external mail servers.
   - Single (`BT-01`) and bulk (`BT-02`) deletion flows mandate a prominent confirmation modal warning: *"Lưu ý: Người dùng sẽ không thể xem các thông tin liên quan đến thông báo này trên cả Web và App, trừ những email đã được gửi ra"*.
   - In Redux, deleted records transition to `isDeleted: true` to preserve audit history and prevent broken cross-module foreign links.

5. **Interactive WYSIWYG Preview Modal (`C073`, `BR08`, `NFR01`):**
   - Clicking "Xem trước" in the composer renders an interactive modal reproducing the exact card layout recipients see on mobile apps and the web portal (title, author avatar, category pill, transmission channels, formatted body, and attachment chips).
   - Preview generation validates only `title` and `content`, permitting operators to inspect visual layout without requiring premature selection of target classes.

6. **"Never Do" List for Announcement Board:**
   - **NEVER** expose the "Chỉnh sửa" button on announcements in `da_gui` status.
   - **NEVER** delete an announcement without presenting the explicit irrevocable email warning dialog.
   - **NEVER** permit publishing a notice with `audienceScope === 'lop_hoc'` if no target classes are selected.
   - **NEVER** block the WYSIWYG preview modal from opening when optional form fields are empty.
   - **NEVER** hard-purge announcement records from memory, breaking foreign links in linked modules.



### 19. School Polls, Voting & Surveys Invariants (Bình Chọn — Module 25)

1. **Decoupled Authoring and Audience Dispatch Workflow (`C074`, `BR03`, `BR05`, `K041`):**
   - Poll creation at `/[schoolCode]/school/poll/create` focuses strictly on survey content: Title (Chủ đề), Description (Mô tả), Expiration Deadline (Thời hạn bình chọn), Cover Image, Choices (Các lựa chọn $\ge 2$), and Configuration Toggles. Saving creates the record in `da_tao` (Created / Draft) status without audience bindings.
   - Decoupled dispatch modal (`UC-04`): Triggered via the Send paper-plane icon on `da_tao` polls. Administrators specify "Gửi đến" between "Toàn trường" (default) or "Lớp học" (with multi-class selection). Confirming updates `audienceScope`, stamps `sentAt`, and transitions the poll to `da_gui`. This allows teachers and administrators to formulate survey instruments well in advance of live distribution.

2. **State-Driven Action Visibility & Ballot Integrity (`C075`, `BR01`, `BR02`, `K044`):**
   - Polls enforce a 3-state lifecycle: `da_tao` (Đã tạo / Draft), `da_gui` (Đã gửi / Active), and `da_dong` (Đã đóng / Closed / Expired).
   - In the directory table, only rows with `status === 'da_tao'` display the 3 action icons (Edit pencil, Send paper plane, Delete trash bin).
   - Once dispatched (`da_gui`) or closed (`da_dong`), all row action icons are completely hidden. Users can only click the poll title to enter the detail results cockpit. This invariant guarantees that open ballots and historical voting records cannot be accidentally deleted or structurally mutated while voting is underway.

3. **Configurable Multi-Choice & Parental Transparency Rules (`C076`, `BR04`, `K043`):**
   - "Chọn nhiều phương án" (`allowMultipleChoices`): When disabled (default), voters may select exactly 1 option (radio behavior). When enabled, voters may select 1 or more options (checkbox behavior).
   - "PH được xem kết quả bình chọn" (`allowParentViewResults`): When disabled (default), parents on mobile apps cannot see percentage distributions, preventing bandwagon effects in sensitive consultative votes. Administrators always have access to real-time analytics on the web portal.

4. **Dynamic Visual Chart & Progress Bar Representation (`C077`, `BR06`, `NFR01`):**
   - The poll detail cockpit displays horizontal progress bars for all options showing vote count and percentage.
   - Conditional Chart Rendering: If total recorded votes $> 0$, the cockpit dynamically renders an interactive pie/donut chart visualizing proportional distributions. If total recorded votes equal zero, the pie chart is completely omitted to avoid rendering empty or broken circular frames.

5. **Voter Choice Revision & Chronological Auditing (`C078`, `BR07`, `BR08`, `K042`):**
   - Voters may update their selected option(s) multiple times prior to the poll deadline.
   - The latest selection immediately updates active option totals and percentages.
   - Every selection change appends an immutable entry to `voteHistory` with an ISO timestamp.
   - Beside each voter in the student roster, a history icon ("Lịch sử thay đổi") opens an audit modal displaying the complete chronological sequence of revisions, ensuring complete transparency and dispute resolution.

6. **"Never Do" List for School Polls:**
   - **NEVER** display Edit, Send, or Delete action icons for polls in `da_gui` or `da_dong` status.
   - **NEVER** render a pie chart when total recorded votes equal zero.
   - **NEVER** force audience selection inside the initial poll creation form (must remain decoupled per BR03).
   - **NEVER** allow ballot submission with multiple options when `allowMultipleChoices` is false.
   - **NEVER** overwrite previous voter choices destructively without appending to `voteHistory`.





### 20. School Staff Attendance Invariants (Điểm Danh NV — Module 26)

1. **Date Navigation & Strict 45-Day Retrospective Lock (`C079`, `BR01`, `BR02`, `K046`):**
   - Future dates are strictly locked ($\le$ today) on the calendar picker; attendance cannot be pre-recorded for dates that have not yet occurred.
   - Selecting any date different from today displays static warning text `DD-02` (*"*Chỉ được cập nhật thông tin điểm danh trong vòng 45 ngày kể từ hôm nay"*).
   - Strict 45-Day Read-Only Hard Lock: If a selected date is older than 45 days in the past (`today - date > 45 days`), all mutation controls (Check-in, Check-out, Vắng toggle, inline note edit) are strictly disabled in read-only mode. This invariant safeguards closed monthly payroll cycles, tax filings, and social insurance audits from unauthorized retroactive alterations.

2. **1-Click Check-In/Check-Out & Inline Time Badge Rollback Safeguard (`C080`, `BR03`, `BR04`, `K048`, `DD-01`):**
   - High-velocity roll calls: Clicking "Check-In" or "Check-Out" records the current system time (`HH:mm`) immediately without any confirmation modal, converting the button into a colored time badge with a pencil icon.
   - Distinct color semantics: Check-in elements use Primary Blue `#0070CE`; Check-out elements use Amber Accent `#FEC020`.
   - Inline badge editing: Clicking a recorded time badge enables inline editing for hours and minutes.
   - Blur validation & rollback: On input blur, if the value is empty or formatted incorrectly, the system displays error toast `DD-01` (*"Thời gian không đúng định dạng."*) and automatically restores the prior valid time value. A recorded time badge can never be cleared to null through this interface.

3. **Independent Absence Confirmation Modal & Action Mutual Exclusion (`C081`, `BR05`, `BR06`, `DD-03`):**
   - Unlike Check-in/out, the "Vắng" toggle requires explicit modal confirmation choosing `absenceType` ("Có phép" vs "Không phép") with an optional reason note.
   - Conflict warning: If the staff member already has Check-in or Check-out recorded for that date, the modal prominently displays warning `DD-03` (*"Lưu ý: Nhân viên đã check-in/check-out lúc {giờ}"*).
   - Row action disablement: While the absence modal is active for a row, that specific row's Check-in and Check-out buttons are disabled to prevent concurrent contradictory operations.
   - Cancelling reverts the toggle to off without modifying state; confirming saves absence status and increments the appropriate presence KPI counter.

4. **Multi-Role Personnel Architecture & Read-Only Profile Inspection (`C082`, `BR08`, `BR11`):**
   - Faculty members frequently hold multiple concurrent roles (e.g. Quản Lý and Giáo Viên). The table row renders all applicable role badges simultaneously without truncation.
   - Read-only profile modal: Clicking an employee's nickname opens a modal with role-tailored attributes: Admin displays "Thông tin Quản Trị"; other roles display "Thông tin người dùng" with role-specific fields (e.g. Quản Lý lists assigned classes with direct hyperlinks, plus "Đã xác thực" status).
   - Consistent empty state: Unpopulated profile attributes always render verbatim as `"Chưa có {trường}"` (e.g. `"Chưa có mã NV"`, `"Chưa có số điện thoại"`).

5. **Cohort Filtering, Search KPI Dynamics & Nickname Sorting (`C083`, `BR09`, `BR10`, `BR12`, `K047`):**
   - Standardized single-page routing: The canonical route `/[schoolCode]/school/staff-attendance` uses URL query parameter `?classId=...` for bookmarkable yet instant client-side filtering without page reloads.
   - Search KPI Dynamics: When `searchQuery.trim().length > 0`, the top 3 KPI summary counters (*Tham dự*, *Vắng có phép*, *Vắng không phép*) are dynamically hidden to prevent misinterpretation of partial search counts against school-wide totals. The bottom footer counter (*"Tổng: N"*) remains visible and reflects the exact filtered search count.
   - Nickname Sorting: The staff roster is sortable by nickname in ascending (A $\rightarrow$ Z) and descending (Z $\rightarrow$ A) order via the header sort icon.

6. **"Never Do" List for School Staff Attendance:**
   - **NEVER** allow editing attendance records for dates older than 45 days in the past.
   - **NEVER** display a confirmation modal for 1-click Check-in or Check-out actions.
   - **NEVER** permit an invalid or empty time badge edit to overwrite or nullify an existing timestamp.
   - **NEVER** allow opening an absence modal without disabling that row's Check-in/Check-out buttons.
   - **NEVER** truncate multi-role badges to display only a single primary role.
   - **NEVER** trigger full page reloads when filtering by class cohort.
### 21. School Parent Handbook Invariants (Sổ Tay PH — Module 27)

1. **2-Tier Category Tree Governance (`C084`, `BR01`, `K049`):**
   - The knowledge base tree is strictly capped at a maximum depth of 2 category levels: Root Category (`parentCategoryId: null`) $\rightarrow$ Sub-Category (`parentCategoryId: rootId`).
   - Articles (`HandbookArticle`) are leaf nodes that may reside directly within a root category or within a sub-category.
   - At the sub-category level, the interface renders strictly "+ Thêm bài viết"; rendering "+ Thêm danh mục" is strictly forbidden, preventing convoluted folder structures that degrade mobile reading.

2. **Accordion Single-Active Expansion Rule (`C084`, `BR02`, `K050`):**
   - Sibling categories (categories sharing the identical `parentCategoryId`) operate in a single-active accordion mode: opening one sibling category automatically collapses the active sibling.
   - When open, the category description ("Ghi chú") renders in a dashed callout box; when collapsed, it renders as a concise subtitle below the category title (`BR03`).

3. **Sibling-Only Drag-and-Drop Reordering (`C085`, `BR04`, `K053`):**
   - Sub-categories and articles render a drag handle icon (`☰` / `faGripVertical`) allowing manual positional reordering within their immediate parent container.
   - Root categories maintain fixed administrative ordering and do not render drag handles. Cross-tier reparenting via drag-and-drop is prohibited to prevent accidental structural displacements.

4. **Article Status Lifecycle & 1-Click Transitions (`C086`, `BR05`, `BR12`, `K052`):**
   - Articles manage two distinct lifecycle states: `Bản nháp` (`draft`) and `Đã phát hành` (`published`).
   - `Bản nháp`: Rendered with muted slate title text and a gray "Bản nháp" badge. Action menu (`•••`) offers *Chỉnh sửa bài viết*, *Xuất bản bài viết*, and *Xóa bài viết*.
   - `Đã phát hành`: Rendered with vibrant brand amber title text (`#C85A17`) and no badge. Action menu offers *Chỉnh sửa bài viết*, *Ẩn bài viết*, and *Xóa bài viết*.
   - Instant Transitions: "Xuất bản bài viết" and "Ẩn bài viết" execute as 1-click status transitions with immediate toast confirmation, bypassing redundant confirmation prompts.

5. **Article-Centric Pruning Filter & Search (`C088`, `BR10`, `K051`):**
   - The status dropdown filter and search input match strictly against article titles (never against category names).
   - If a category contains no articles matching the criteria, it is pruned completely from the view. Matching branches auto-expand down to their matching article leaves.
   - When no articles match the active query, the tree renders empty state `ST-03`: *"Hiện chưa có danh mục hoặc bài viết nào. Hãy bắt đầu bằng cách tạo danh mục mới"*.

6. **Cascading Deletion Safeguards (`C087`, `BR09`, `ST-01`, `ST-02`):**
   - Deleting a category prompts high-severity modal `ST-01`: *"Vui lòng xác nhận xóa danh mục {tên danh mục}. Lưu ý: Tất cả danh mục con và bài viết trong danh mục sẽ bị xóa"*.
   - Deleting an article prompts simple confirmation modal `ST-02`: *"Vui lòng xác nhận xóa bài viết {tiêu đề bài viết}"*.

7. **"Never Do" List for School Parent Handbook:**
   - **NEVER** permit nesting sub-categories deeper than 2 levels.
   - **NEVER** render "+ Thêm danh mục" inside a sub-category.
   - **NEVER** allow multiple sibling categories to remain expanded simultaneously.
   - **NEVER** match search queries against category names while retaining empty article containers.
   - **NEVER** delete a category without displaying cascading warning modal `ST-01`.
   - **NEVER** allow reparenting articles or sub-categories across different root categories via drag handle.


### 22. School Parent Feedback Invariants (Góp Ý — Module 28)

1. **Parent-Only Ticket Inception (`C089`, `BR09`, `K054`):**
   - The web operating portal functions strictly as an administrative triaging and resolution inbox.
   - School administrators and teachers CANNOT create new feedback tickets on the web portal. There is NO "Tạo góp ý", "Thêm góp ý", or creation modal.
   - The plus icon (`+`) located on the `Yêu cầu mới` top card is purely a visual design element and filter toggle, NOT a creation button. All feedback tickets originate authenticated from parents via the mobile application.

2. **Dual-Function KPI Cards & Filter Reset (`C090`, `BR02`, `K055`):**
   - The top 4 cards (`Yêu cầu mới` Blue `#0070CE`, `Đang xử lý` Purple `#8B5CF6`, `Hoàn tất` Green `#10B981`, `Mở lại` Amber `#F59E0B`) display aggregate ticket counts for the selected academic year.
   - Clicking a card filters the table roster to that exact status and renders an explicit "Xóa bộ lọc" reset link. Clicking the card again or clicking "Xóa bộ lọc" clears the filter while preserving global counts across all 4 cards.

3. **8 Fixed Domain Categories & Inline Priority Triage (`C091`, `BR03`, `BR04`, `K056`):**
   - Tickets are classified across 8 canonical categories: 1. Nội dung, 2. Hình thức/trình bày, 3. Hiệu suất/chất lượng, 4. Kỹ năng, 5. Thái độ/hành vi, 6. Quy trình, 7. Trải nghiệm người dùng, 8. Mang tính chiến lược.
   - 4 standardized priority levels: `Thấp` (Blue), `Trung bình` (Green, default), `Cao` (Amber), `Khẩn cấp` (Red).
   - Priority and handler assignments can be modified inline directly within table rows and detail headers via select dropdowns, updating state immediately without intrusive confirmation modals.

4. **Reactive Turn-Taking State Machine (`C092`, `BR05`, `BR06`, `K057`):**
   - Turn-taking state (`waitingFor`) tracks who holds the next action: `Chờ phản hồi từ nhà trường` vs `Chờ phản hồi từ phụ huynh`.
   - Submitting an institutional comment from the web portal automatically flips `waitingFor` to `Chờ phản hồi từ phụ huynh`. Inbound parent replies flip `waitingFor` to `Chờ phản hồi từ nhà trường`.
   - Reopening rule: If a parent submits a comment on a ticket already marked `Hoàn tất` (`completed`), the state machine automatically transitions the ticket status to `Mở lại` (`reopened`) with `waitingFor: school`.

5. **Terminal Closure Modal GY-01 & Read-Only Profiles (`C093`, `BR07`, `BR08`):**
   - Closing a feedback ticket is a formal operational resolution. Clicking "Đóng góp ý" strictly mandates confirmation modal `GY-01`: *"Vui lòng xác nhận Đóng góp ý {tên góp ý}"*. Confirming transitions status to `Hoàn tất`.
   - Clicking student or parent names displays read-only profile modals. Missing contact or demographic fields must render `"Chưa có {trường}"` (e.g. `"Chưa có số điện thoại"`).

6. **Canonical Sidebar Navigation Placement (`K058`):**
   - In `PortalLayout.tsx`, under the NHÀ TRƯỜNG navigation section, "Góp ý" (`/school/feedback`, icon `faCommentDots`) is positioned strictly after "Sổ tay PH" (`/school/handbook`) and before "Lịch sự kiện" (`/school/calendar`).

7. **"Never Do" List for School Parent Feedback:**
   - **NEVER** render a "Tạo góp ý" or "Thêm góp ý" button on the web portal.
   - **NEVER** treat the `+` icon on the `Yêu cầu mới` card as a ticket creation trigger.
   - **NEVER** recalculate or wipe top KPI card totals when a table status filter is toggled.
   - **NEVER** trigger confirmation modals for routine inline priority or assignee changes.
   - **NEVER** close a feedback ticket without displaying confirmation modal `GY-01`.
   - **NEVER** allow sending discussion replies with empty or whitespace-only text.
   - **NEVER** leave missing profile attributes blank or as raw `null`/`undefined`; always render `"Chưa có {trường}"`.


### 23. School Academic Year Invariants (Năm Học — Module 29)

1. **Automated Current Year Determination (`C094`, `BR01`, `K059`):**
   - The system dynamically evaluates whether an academic year is active by checking whether today's calendar date falls within the inclusive interval `[startDate, endDate]`:
     $$\text{isCurrent} = (\text{today} \ge \text{startDate}) \land (\text{today} \le \text{endDate})$$
   - Active academic year rows render in bold typography, primary brand blue text (`#0070CE`), and a prominent "Hiện tại" badge chip.
   - The Create/Edit modal strictly omits any manual checkbox or radio toggle for "Hiện tại". Active status is an immutable function of calendar time, eliminating human error during term rollover.

2. **Permanent Omission of Delete Operations (`C095`, `BR03`, `K060`):**
   - Academic years serve as master temporal foreign keys referenced across classes, student attendance, tuition invoices, meal plans, scoreboards, and parent feedback.
   - Permitting deletion—even soft-deletion—destroys referential integrity and historical financial audits.
   - The table row actions column strictly contains only the Edit button (`faEdit`); delete is permanently omitted across all UI surfaces.

3. **Flexible Free-Text Naming & Semester Sub-Terms (`BR02`, `K061`):**
   - Academic year titles are stored as free-form strings rather than being restricted to rigid regex patterns.
   - The system accommodates full academic years (e.g., "Năm học 2026 - 2027") as well as semester sub-terms (e.g., "Kỳ 1 năm học 2026 - 2027", "Kỳ 2 năm học 2026 - 2027").
   - Overlapping timeframes are permitted to support nested semesters, but identical duplicate intervals are rejected (`VR-AY-03`).

4. **Minimalist 3-Field Create/Edit Modal (`C096`, `BR04`, `NH-01`, `K062`):**
   - The form modal contains exactly 3 fields:
     1. `Tên năm học` (text, required, trimmed non-empty)
     2. `Ngày bắt đầu` (date input, required)
     3. `Ngày kết thúc` (date input, required)
   - Submit action button ("Thêm" or "Cập nhật") remains strictly disabled until all 3 fields are non-empty and satisfy `endDate >= startDate` (`VR-AY-02`).
   - Attaching cohorts, default fees, and holiday schedules is decoupled to dedicated downstream modules.

5. **Instant Client-Side Search Filtering (`C097`, `BR05`):**
   - Search input evaluates against academic year names in real-time ($< 10\text{ms}$).
   - Matching is case-insensitive and diacritic-insensitive (supporting Vietnamese unaccented search).
   - The table footer counter `"Tổng: N"` updates synchronously to reflect the filtered count.

6. **Canonical Sidebar Navigation Placement (`C098`, `K063`):**
   - In `PortalLayout.tsx`, under the NHÀ TRƯỜNG navigation group, "Năm học" is mounted at canonical route `/[schoolCode]/school/academic-year` (with backward compatibility alias `/school/season`), placed strictly after "Lịch sự kiện" (`/school/calendar`), using FontAwesome icon `faCalendarCheck`.

7. **"Never Do" List for School Academic Year:**
   - **NEVER** render a Delete button, trash icon, or delete confirmation dialog for academic years.
   - **NEVER** add a manual "Hiện tại" checkbox or radio toggle to the academic year form modal.
   - **NEVER** allow submitting an academic year where `endDate < startDate`.
   - **NEVER** permit blank or whitespace-only academic year names.
   - **NEVER** force academic year names into a rigid "YYYY - YYYY" format that prohibits semester naming.
   - **NEVER** place "Năm học" before "Lịch sự kiện" in the NHÀ TRƯỜNG sidebar.

---

## 24. Nhà Trường: Lưu Trữ (School Archive & Cold Storage Invariants)

1. **Unidirectional Inflow & Cold Storage Isolation (`C099`, `BR01`, `K064`):**
   - The Lưu Trữ module is strictly an administrative cold-storage repository for withdrawn, transferred, and graduated students.
   - Students enter Lưu Trữ exclusively via withdrawal in the Học Sinh module. Direct creation or manual insertion within Lưu Trữ is strictly prohibited.
   - Preserves complete historical profile, past invoices, attendance records, health measurements, and growth evaluations.

2. **Tolerant Archive Metadata Nullability (`C100`, `BR02`, `K067`):**
   - Each row tracks `archiveDate`, `archivedBy` (staff operator link), and `archiveReason`.
   - In legacy records (such as "Huy", "Ngọc", "Thương"), these fields may be missing. The table renders clean empty cells without throwing errors or breaking table layout.

3. **Archived Student Detail Modal with Warning Banner (`C101`, `BR03`):**
   - Clicking a student's name opens their read-only profile modal.
   - The modal features an authoritative yellow warning banner `🔒 Học sinh đã được lưu trữ`.
   - Displays bottom archive metadata fields: `Lý do lưu trữ`, `Ngày lưu trữ`, `Ghi chú lưu trữ` (rendering "Chưa có ghi chú" if blank). "Lưu trữ bởi" is omitted from the modal per legacy specification.

4. **Staff Operator Quick View Modal (`BR02`):**
   - Clicking the name in the "Lưu trữ bởi" column opens the staff member's administrative contact modal showing name, role, email, and phone.

5. **Dual Action Modals: Restoration vs Guarded Permanent Purge (`C102`, `BR04`, `BR06`, `K065`):**
   - Action column has exactly 2 icons: Restore (`faBoxOpen` / `faTrashRestore`) and Delete (`faTrash`).
   - Restore triggers modal `LT-01` ("Vui lòng xác nhận phục hồi học sinh {tên học sinh}!") with friendly illustration.
   - Delete triggers modal `LT-02` ("Vui lòng xác nhận xoá học sinh {tên học sinh}!") with distinct red hazard illustration and affirmative confirmation gating.

6. **Class Continuity on Restoration (`C103`, `BR05`, `K013`, `K066`):**
   - When restoring a student, the system evaluates `formerClassId`:
     - If active in current academic year, re-enroll into that class with a success toast.
     - If inactive, dissolved, or from a past academic year, restore with `classId = null` ("Chưa xếp lớp") and emit an amber system alert.

7. **Canonical Sidebar Navigation Placement (`K068`):**
   - Canonical route `/[schoolCode]/school/archive` (with legacy compatibility alias `/setting/kid/archived`).
   - Placed in `PortalLayout.tsx` under `NHÀ TRƯỜNG` strictly after "Năm học" (`/school/academic-year`), with icon `faArchive`.

8. **"Never Do" List for School Archive:**
   - **NEVER** render a "Tạo học sinh" or "Thêm học sinh" button on the archive dashboard.
   - **NEVER** allow editing an archived student's demographic profile without first restoring them.
   - **NEVER** execute permanent deletion without explicit affirmative confirmation in modal `LT-02`.
   - **NEVER** re-assign a restored student to a non-existent, closed, or past-year class without checking active status.
   - **NEVER** crash or display "undefined" when legacy records have null/empty archive metadata.
   - **NEVER** place "Lưu trữ" before "Năm học" in the NHÀ TRƯỜNG sidebar.


### 25. Cấu Hình: Trường (School Master Profile & Operational Baseline Invariants)

1. **Read-Only Master Overview Integrity (`C104`, `BR14`, `K069`):**
   - The overview dashboard at `/[schoolCode]/setting/school` displays complete institutional master data (identity, educational stages, operating hours, attendance rules) in an immutable read-only view.
   - Inline clicking and direct text editing on the overview screen are strictly disabled to prevent accidental modifications during routine browsing.
   - Editing is gated behind an explicit top-right Edit button (`icon_edit_square`) that navigates cleanly to the edit screen (`/setting/school/edit`).

2. **Two-Tab Routed Navigation Architecture (`BR06`, `K070`):**
   - The edit interface organizes settings into two distinct tabs: "Thông tin trường" (`?tab=info`) and "Giờ hoạt động" (`?tab=weekdays`, aliasing `/setting/school/weekdays`).
   - Tab switching is bound to URL query parameters, preserving browser back/forward navigation and deep-linking capabilities.

3. **Mandatory Identity Fields & Real-Time Blur Validation TR-01 (`C104`, `BR01`, `BR02`, `BR03`):**
   - `Tên trường`, `Địa chỉ`, and `Email` are strictly mandatory (`*`).
   - When focus departs (blur) an empty mandatory field, the system immediately applies a red border and displays inline error message `TR-01` (e.g. *"Vui lòng nhập tên trường"*).
   - Form submission is gated and blocked until all mandatory fields are populated and valid.

4. **5-Minute Stepped Weekly Operating Hours & Static Sunday Rest (`C105`, `BR07`, `BR08`, `K072`, `K073`):**
   - Opening and closing times for Monday through Saturday are selected from discrete 5-minute stepped dropdowns (`06:00` to `18:00`), preventing free-text formatting errors.
   - For every operating day, closing time must be strictly after opening time (`closeTime > openTime`).
   - Sunday is statically designated as non-operational (`isOpen=false`), rendering as a clean grey tag ("Chủ nhật: Không hoạt động") without input controls. Weekend clubs are governed exclusively by extracurricular class schedules.

5. **Sub-Form Save Autonomy & Independent Mutability (`BR09`, `K071`):**
   - Within the "Giờ hoạt động" tab, operating hours and attendance threshold rules are segregated into two completely independent sub-forms.
   - Each sub-form features its own dedicated "Cập nhật" action button. Saving operating hours does not validate or submit attendance rules, and vice versa.

6. **Attendance Grace Threshold & Fee Settings Linkage (`C106`, `BR10`, `BR11`, `K074`):**
   - "Đến muộn": Toggling off dims/disables the minutes dropdown while retaining its configured threshold value (5 to 60 minutes, step 5).
   - "Về muộn": Toggling on displays the descriptive notice and an active link "Cài đặt phí trông học sinh về muộn tại đây" navigating to `/setting/fee`. Overtime childcare rates are not duplicated in the school profile.

7. **Dirty Form Navigation Interception Guard TR-02 (`C108`, `BR12`):**
   - Modifying any field in either tab marks the form as dirty.
   - Attempting to switch tabs or click any external navigation link intercepts the route and presents modal `TR-02`: *"Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!"*.
   - Confirming departure discards edits; cancelling retains form state and cancels navigation.

8. **Canonical Sidebar Navigation Placement (`K075`):**
   - In `PortalLayout.tsx`, under the `CẤU HÌNH` section, "Trường" is mounted at canonical route `/[schoolCode]/setting/school` (with legacy compatibility aliases `/school/info` and `/school/weekdays`), positioned first before "Học phí" (`/setting/fee`), using FontAwesome icon `faSchool`.

9. **"Never Do" List for School Profile:**
   - **NEVER** allow direct inline editing on the read-only overview dashboard.
   - **NEVER** allow submitting the basic info form with empty Name, Address, or Email.
   - **NEVER** allow free-text input for operating hours (must use 5-minute stepped dropdowns).
   - **NEVER** permit setting opening hours for Sunday in the school master profile.
   - **NEVER** combine operating hours and attendance rules into a single monolithic save action.
   - **NEVER** duplicate after-school childcare fee amounts inside the school profile; always link to Fee Settings (`/setting/fee`).
   - **NEVER** allow navigating away with dirty form modifications without displaying confirmation modal `TR-02`.
   - **NEVER** place "Trường" after "Học phí" in the `CẤU HÌNH` sidebar menu group.


### 26. Cấu Hình: Tài Khoản (User & Student Account Management and Access Control)

1. **Dual-Tab Architecture & Routing Synchronization (`C109`, `BR01`, `K076`):**
   - User accounts and Student login accounts represent distinct domain personas and lifecycle models.
   - Hosted across two routed tabs: "Người Dùng" (`/[schoolCode]/setting/users`) and "Học Sinh" (`/[schoolCode]/school/kid/accounts` / `?tab=students`).
   - Query synchronization ensures deep linking, history retention, and state preservation.

2. **Multi-Role User Directory & Active Status Default (`C110`, `BR02`, `BR16`):**
   - User profiles support multiple concurrent roles (Admin, Management, Teacher, Staff, Parent).
   - Displayed as colored badge pills in the table roster.
   - For Parent accounts, linked children names are displayed directly beneath the parent name.
   - Default status filter is preset to "Đang hoạt động" (`active`) to prioritize active operational staff.

3. **Super-Admin Privilege Escalation Lock (`C111`, `BR03`, `BR04`, `K077`):**
   - On the user creation form, the "Admin" role checkbox is permanently disabled (`disabled={true}`) to prevent rogue privilege elevation from the school portal interface.
   - Accounts possessing the Admin role omit Edit (pencil) and Delete (trash) action icons completely; only View (eye) is rendered.

4. **CSDL Sở National Database Synchronization Safeguards (`C112`, `BR05`, `BR06`, `K078`):**
   - Accounts synchronized from the provincial/national education database ("CSDL Sở") carry an authoritative badge.
   - Edit form displays a yellow advisory banner and permanently disables the "Họ và tên" input.
   - Attempting to toggle activation status on a CSDL Sở account from the table roster is rejected by the system, displaying red error banner `TK-03`: *"Không thể cập nhật với đối tượng được đồng bộ từ CSDL ngành"*, leaving status unchanged.

5. **Asymmetric Status Confirmation Mechanics (`BR06`, `BR07`, `K079`):**
   - Row-level status toggle executes immediately without a modal, displaying auto-dismissing toast `TK-06` for frictionless deactivation of departing personnel.
   - In-form updates inside the full Edit modal require explicit confirmation modal `TK-05`: *"Vui lòng xác nhận cập nhật tài khoản này!"* before persisting changes.

6. **Decoupled Credential Management Workflows (`C113`, `BR08`, `BR09`, `K080`):**
   - In the Edit form, Email is rendered as read-only text with a "Thay đổi" button opening a dedicated email change modal with RFC 5322 regex validation.
   - Password reset is decoupled into a dedicated sub-view under `BẢO MẬT` (`/password`) displaying explicit session revocation advisories and dual password inputs with visibility toggles, complying with Decree 13/2023/NĐ-CP.

7. **Dynamic Role-Dependent Controls (`C114`, `BR10`, `BR11`, `BR12`, `BR13`, `K081`):**
   - Checking "Nhân viên" dynamically reveals Staff Functions (Điểm danh, Kế toán, Thông báo, Chăm sóc/Y tế) with tooltips and requires at least 1 selection (inline error `TK-02`), plus "Mã nhân viên".
   - Checking "Quản lý" dynamically reveals the Assigned Classes selector.
   - Checking "Nhân viên" or "Giáo viên" reveals collapsible "Thông tin bổ sung" (CCCD, Chức vụ, Ngày vào làm, Bằng cấp, Kỹ năng, Bộ phận).

8. **Student Login Account Management (`C115`, `BR19`, `BR20`, `BR21`, `K082`):**
   - Tab "Học Sinh" maintains a strict 1-to-1 mapping with enrolled students in the school directory.
   - Students without an account display a `+` create action; students with an account display their username and an edit pencil icon.
   - Username creation validates alphanumeric and email characters (`/^[a-zA-Z0-9_\-\.]+$/`), accompanied by a green helper hint.

9. **Canonical Sidebar Navigation Placement (`K076`):**
   - In `PortalLayout.tsx`, under `CẤU HÌNH`, "Tài khoản" is mounted at `/[schoolCode]/setting/users` (with legacy compatibility alias `/school/kid/accounts`), positioned third strictly after "Học phí" (`/setting/fee`) and before "Thông báo", using icon `faUserShield`.

10. **"Never Do" List for Account Management:**
    - **NEVER** merge User Accounts and Student Accounts into a single flat form or state model.
    - **NEVER** allow enabling or checking the "Admin" role on the user creation form.
    - **NEVER** render Edit or Delete action buttons for accounts with the Admin role.
    - **NEVER** allow editing the Full Name of accounts synchronized from CSDL Sở.
    - **NEVER** allow row-level status toggles for CSDL Sở accounts (must reject with error banner `TK-03`).
    - **NEVER** prompt a confirmation modal for row-level status toggles (must execute immediately with toast `TK-06`).
    - **NEVER** persist in-form account updates without displaying confirmation modal `TK-05`.
    - **NEVER** allow inline editing of email or password directly in the basic user form.
    - **NEVER** allow creating a staff account without selecting at least one staff function (must show error `TK-02`).
    - **NEVER** permit creating orphan floating student accounts disconnected from enrolled students.




### 27. Settings Face Recognition Invariants (Nhận Diện — Module 33 / SM4)

1. **Canonical Navigation & Route Placement (`K083`):**
   - Positioned fourth under `CẤU HÌNH` in `PortalLayout.tsx` at `/[schoolCode]/setting/face-recognition/`, strictly following "Trường" (`/setting/school`), "Học phí" (`/setting/fee`), and "Tài khoản" (`/setting/users`), using FontAwesome icon `faCamera`.
   - Access is restricted exclusively to School Administrators (`admin`).

2. **Centralized Biometric Authority & Downstream Consumers (`C121`, `K084`):**
   - Sub-module "Nhận diện" serves as the centralized single source of truth for enrolled student biometric facial reference images.
   - Master facial images registered here feed downstream operational consumers: automated gate and bus attendance verification (`Module 1: Điểm danh`) and AI photo tagging across class activity media albums (`Module 1: Thư viện`).

3. **Read-Only Demographic Binding & Immutability (`C117`, `BR03`, `K085`):**
   - Registration and edit modals display 4 core student demographic attributes: `Biệt danh` (Nickname), `Giới tính` (Gender: Nam / Nữ), `Ngày sinh` (Date of Birth: `DD/MM/YYYY`), and `Lớp học` (Class name, rendered as an active hyperlink to class detail view).
   - These attributes are strictly read-only and bound to the student's authoritative master profile in `school/kid`. Modifying student personal demographics inside the biometric enrollment modal is strictly prohibited to eliminate data divergence.

4. **Action Activation Friction: Mandatory New File Upload (`C118`, `BR04`, `BR05`, `K086`):**
   - The submit button ("Đăng ký") in both the Registration Modal and Edit Modal is disabled by default (`disabled: true`).
   - In Registration mode, empty submissions are rejected; selecting an image file via "UPLOAD FILE" immediately enables the submit button.
   - In Edit mode, the student's current registered photo is pre-rendered in the preview container (`BR05`). However, viewing the existing photo is explicitly insufficient to enable saving; an administrator MUST select a *new* image file before "Đăng ký" is enabled, preventing redundant no-op server re-indexing.

5. **State-Driven Action Column Duality & Roster Rendering (`C116`, `BR01`, `BR02`, `K087`):**
   - The table roster dynamically alters rendering based strictly on registration status:
     - **Unregistered Students:** `Ảnh nhận diện` displays `-`; `Ngày ghi nhận` displays `-`; `Hành động` displays a single circular primary button with `+` icon (tooltip: *"Đăng ký ảnh nhận diện"*).
     - **Registered Students:** `Ảnh nhận diện` displays a valid image thumbnail; `Ngày ghi nhận` displays formatted date `DD/MM/YYYY`; `Hành động` displays two circular action buttons: Edit (pencil icon, tooltip: *"Chỉnh sửa ảnh nhận diện"*) and Delete (`X` / trash icon, tooltip: *"Xóa ảnh nhận diện"*).

6. **Guarded Deletion with Explicit Student Name Affirmation (`C119`, `BR06`, `K088`, `NFR01`):**
   - In compliance with Decree No. 13/2023/NĐ-CP on sensitive personal data protection, purging student biometric facial data is an irreversible operation that disables automated attendance.
   - Clicking Delete triggers a dedicated confirmation dialog explicitly stating the target student's full name: *"Vui lòng xác nhận xóa thông tin nhận diện của học sinh {Họ tên}"*.
   - Dismissing on "Hủy bỏ" preserves biometric data intact; confirming on "Xác nhận" clears the photo and registration date, immediately reverting the row to unregistered status.

7. **Multi-Factor Conjunction Search & Dynamic Counters (`C120`, `BR07`, `BR08`, `BR09`):**
   - Toolbar filters evaluate concurrently with AND conjunction: text search (student name with accent-insensitivity via `removeVietnameseTones` or student code), class selection, and registration status dropdown exposing exactly two filter values: `"Đã đăng ký nhận diện"` and `"Chưa đăng ký nhận diện"` (plus default "Tất cả trạng thái").
   - The footer dynamically displays `Tổng: N` reflecting the active filtered student count alongside pagination controls.

8. **"Never Do" List for Face Recognition:**
   - **NEVER** permit ad-hoc biometric photo uploads directly inside daily attendance rosters.
   - **NEVER** allow editing student demographic attributes (name, gender, DOB, class) inside the biometric modal.
   - **NEVER** enable the "Đăng ký" submit button in edit mode when only viewing the current photo without selecting a new file.
   - **NEVER** enable the "Đăng ký" submit button in registration mode before an image file is chosen.
   - **NEVER** delete student biometric data with a generic confirmation modal that omits the target student's full name.
   - **NEVER** render Edit or Delete buttons on an unregistered student row (must render only single `+` icon).
   - **NEVER** render a single `+` icon on a registered student row (must render pencil and delete icons).

---

## Section 28: Cấu Hình — Tính Năng (Feature Flags & Academic Term Configuration)

### 1. Canonical Navigation Placement & Two-Route Architecture (`K089`, `BR01`, `C122`)
- The Feature Flags sub-module ("Cấu hình tính năng") is mounted fifth under the sidebar navigation group `CẤU HÌNH` in `PortalLayout.tsx`, positioned strictly after "Nhận diện" and before "Thông báo", using FontAwesome icon `faSlidersH` / `faToggleOn`.
- Unlike single-page client-side tab state machines, this module implements an **Independent Two-Route Architecture** matching the precedent of `setting/school`:
  - Tab 1: "Hoạt Động" mounted at canonical route `/[schoolCode]/setting/activity/` (default landing view).
  - Tab 2: "Học Kỳ" mounted at canonical route `/[schoolCode]/setting/period/`.
  - Alias Route: `/[schoolCode]/setting/features` redirecting automatically to `/setting/activity`.
- This ensures URLs update cleanly on tab switches, preserving browser back/forward navigation and enabling direct bookmarking without leaking dirty form state across tabs.

### 2. Activity Comment Feature Flags & Toggle Decoupling (`K090`, `BR02`, `C127`)
- Tab Hoạt Động manages two school-level boolean switches governing interaction policies on class daily activities (`Module 1: Hoạt Động`):
  1. `Bình luận` (`allowComments`): Enables parents and teachers to post comments on published class activity logs.
  2. `Duyệt bình luận` (`requireCommentModeration`): Mandates that parent comments enter an administrative review queue before becoming publicly visible to other families.
- **Strict Decoupling Invariant (`K090`):** Turning OFF "Bình luận" does NOT disable, hide, or reset "Duyệt bình luận". Verified directly from legacy system behavior, both toggles remain completely interactive and persist independent boolean values in the school configuration.

### 3. Dirty-State Submit Invariant (`K091`, `BR03`, `C123`)
- The "Cập nhật" action button on Tab Hoạt Động renders in a disabled low-contrast state upon initial load.
- It enables if and only if at least one toggle diverges from its saved state:
  $$\text{isDirty} = (\text{activeComments} \neq \text{savedComments}) \lor (\text{activeModeration} \neq \text{savedModeration})$$
- Clicking "Cập nhật" commits the changes to the store, triggers an affirmative success toast, and resets the baseline, immediately returning the button to the disabled state.

### 4. Academic Year Selection & Statutory Two-Term Limit (`K092`, `BR04`, `BR05`, `C124`)
- Tab Học Kỳ features an Academic Year selector dropdown loading from the school's actual academic year records (`school/season`).
- The dropdown automatically defaults to the active ongoing academic year labeled with `(Hiện tại)`.
- **Statutory Two-Term Hard Ceiling (`K092`):** In accordance with Vietnamese Ministry of Education and Training (MoET GDPT 2018) regulations, general education schools operate on a strict two-semester structure (Học kỳ 1 and Học kỳ 2).
- The "+ Thêm học kỳ" button automatically becomes disabled (`disabled: true`) as soon as the selected academic year contains 2 terms (`terms.length >= 2`).

### 5. Pure Inline Table Row Editing with Mutual Exclusion Locking (`K093`, `BR06`, `BR07`, `BR08`, `C125`, `NFR01`, `NFR02`)
- All term management operations execute directly within table cells—zero popup modal dialogs are used.
- Clicking the Edit (pencil) icon on an existing term row or clicking "+ Thêm học kỳ" converts the row into inline input controls:
  - `Học kỳ`: Text input for semester title (e.g. `Học kì 1`).
  - `Ngày bắt đầu`: Date input (`YYYY-MM-DD` or `DD/MM/YYYY`).
  - `Ngày kết thúc`: Date input (`YYYY-MM-DD` or `DD/MM/YYYY`).
  - `Ghi chú`: Text input for optional notes.
  - `Hành động`: Green checkmark icon button (Save) and gray X icon button (Cancel).
- **Single-Row Mutual Exclusion Lock (`K093`, `NFR01`):** While any row is in inline edit or add mode, all other row edit buttons and "+ Thêm học kỳ" are strictly disabled, preventing concurrent edit collisions.
- Clicking Cancel (X) on an existing row reverts inputs to original values; clicking Cancel on a newly added draft row removes the blank row and re-enables "+ Thêm học kỳ".

### 6. Permanent Saved Terms (No Deletion) & Clean Empty State (`K094`, `BR09`, `BR10`, `C126`)
- **Deletion Omission Invariant (`K094`):** Saved academic terms omit deletion controls entirely; the Action column of saved rows displays only the Edit pencil icon. Academic terms serve as critical temporal anchors across timetables, attendance, homework, and gradebooks; deleting saved terms risks cascading orphan data across the system.
- Academic years with zero registered terms display a clean, dedicated full-width empty state row with italicized text `"Chưa có học kỳ"`.

### 7. Downstream Cross-Module Consumers
- **Class Activities (`Module 1: Hoạt Động`):** Reads `allowComments` to hide or show comment input boxes, and `requireCommentModeration` to tag new comments with `cho_duyet` status.
- **Timetable / Schedule (`Module 2: Thời Khóa Biểu`):** Uses semester start and end dates to bound weekly schedule distributions.
- **Gradebook (`Module 2: Điểm & Đánh Giá`):** Groups student scorecards and academic evaluations into Học kỳ 1 and Học kỳ 2 milestone periods.
- **Attendance Reports (`Module 1: Báo Cáo Điểm Danh`):** Aggregates attendance statistics across term date intervals.

### 8. "Never Do" List for Feature Flags
- **NEVER** use a client-side tab state machine with a shared URL for Hoạt Động and Học Kỳ (must use independent routes `/setting/activity` and `/setting/period`).
- **NEVER** disable or reset "Duyệt bình luận" when "Bình luận" is turned OFF (toggles must remain independent).
- **NEVER** leave the "Cập nhật" button enabled when no toggle values have changed (dirty-state invariant).
- **NEVER** allow adding more than 2 terms to an academic year (two-term statutory ceiling).
- **NEVER** open a modal popup for adding or editing terms (must be pure inline table row editing).
- **NEVER** permit multiple rows to undergo inline editing concurrently (must enforce single-row mutual exclusion lock).
- **NEVER** render a Delete button or trash icon for saved academic terms (saved terms are permanent).
- **NEVER** display an empty white table when an academic year has no terms (must display `"Chưa có học kỳ"` empty state row).

---

## Section 29: Cấu Hình — Thông Báo (Notification Configuration)

### 1. Canonical Navigation Placement & Monolithic Architecture (`K095`, `BR01`, `C128`, `K104`)
- The Notification Settings sub-module ("Cấu hình thông báo") is mounted sixth under the sidebar navigation group `CẤU HÌNH` in `PortalLayout.tsx`, positioned strictly after "Tính năng" and before any future sub-modules, using FontAwesome icon `faBell`.
- Canonical path is `/[schoolCode]/setting/notification/`.
- Unlike the Fee Configuration module (`/setting/fee`) which subdivides into multiple independent child forms, Notification Settings renders as a **Single Monolithic Configuration Form** encapsulating all 5 institutional domains:
  1. `Điểm danh` (Attendance alerts & evening pickup overtime).
  2. `Sinh nhật` (Birthday wishes for students, teachers, and admins).
  3. `Học phí` (Tuition invoice publication and due-date reminders).
  4. `Khác` (Class activities awaiting approval and daily journal logs).
  5. `Phụ huynh` (Parent push notifications for attendance, activities, albums, and media).
- All 5 sections are governed by a single, sticky bottom action bar containing a single "Cập nhật" action button.

### 2. Guarded Confirmation Modal Submission (`K096`, `BR02`, `C129`)
- Submitting the monolithic notification settings form triggers a mandatory confirmation modal dialog:
  - **Title:** "Xác nhận thay đổi cấu hình thông báo"
  - **Body Text:** *"Vui lòng xác nhận thay đổi cấu hình thông báo của trường!"*
  - **Action Buttons:** "Hủy bỏ" (gray cancel button) and "Xác nhận" (blue primary confirm button).
- Confirming writes all 5 sections to the persistent store atomically, updates the saved baseline, displays an affirmative toast notification, and resets the action button to disabled.
- Canceling closes the modal dialog immediately while preserving all working unsaved edits in the form, allowing administrators to resume editing without losing progress.

### 3. Institutional Scope & 31st-Day Calendar Overflow Fallback (`K097`, `BR03`, `C130`)
- A prominent informational policy banner at the top of the page communicates 3 non-negotiable operational principles:
  1. **School-Wide Scope:** Configuration applies globally across all classes, enrolled students, faculty members, and parent guardians.
  2. **Multi-Platform Delivery:** Notifications are dispatched seamlessly to both Web operating portal headers and parent/teacher mobile applications.
  3. **Calendar Overflow Fallback Rule:** For reminder rules scheduled on calendar days 29, 30, or 31, the notification dispatch daemon automatically falls back to the final calendar day of shorter months:
     - 31st day triggers on the 28th (or 29th during leap years) of February.
     - 31st day triggers on the 30th of April, June, September, and November.
     - This guarantees zero silent drop of monthly recurring reminder dispatches.

### 4. Birthday Reminder Schedule Inheritance (`K098`, `BR04`, `C131`)
- Section 2 (Sinh nhật) features a shared schedule configuration row defining the recurring reminder schedule:
  - `Ngày trong tháng`: Integer dropdown or input from 1 to 31.
  - `Thời gian`: Time picker (`HH:mm`, default `09:00`).
- **Inheritance Invariant (`K098`):** This schedule configuration row does NOT possess an independent toggle switch. Sub-options for "Giáo viên" and "Admin nhà trường" render independent boolean switches that inherit this exact schedule when toggled ON.

### 5. Multi-Channel Delivery Asymmetry (`K099`, `BR05`, `C132`)
- The system enforces intentional multi-channel delivery asymmetry across notification categories:
  - In Section 4 (Khác), both "Hoạt động chờ duyệt" and "Nhật ký hằng ngày" provide dual channel switches: `Web/App` toggle and `Email` toggle.
  - In all other sections (Điểm danh, Sinh nhật, Học phí, Phụ huynh), notification events deliver exclusively via Web and Mobile App push notifications.
  - This asymmetry prevents email inbox exhaustion while ensuring critical administrative review queues remain actionable via email alerts.

### 6. Read-Only Operational Hours & Extracurricular Class Scoping (`K100`, `K101`, `BR06`, `BR07`, `C133`, `C134`)
- **Read-Only Operational Hours (`K100`):** Fixed institutional operational times are rendered in disabled/read-only input fields with muted background styling to prevent administrative disruption:
  - Section 1 evening pickup overtime alert is fixed at `17:00`.
  - Section 4 daily journal log review alert is fixed at `20:00`.
- **Extracurricular Class Scoping (`K101`):** Section 1 includes a dedicated alert for "Thông báo điểm danh hoạt động ngoại khóa", providing an "Áp dụng cho" select dropdown allowing administrators to scope the alert to "Tất cả các lớp" or select specific registered classes.

### 7. Tuition Fee Schedule Directionality & Parent Action Highlighting (`K102`, `K103`, `BR08`, `BR10`, `C135`, `C136`)
- **Directional Tuition Scheduling (`K102`):** Section 3 (Học phí) overdue reminder pairs a directional timing selector ("Trước hạn đóng học phí" vs "Sau hạn đóng học phí") with an integer day counter (1 to 31 days), enabling flexible institutional billing policies.
- **Parent Action Highlighting (`K103`):** In Section 5 (Phụ huynh), action verbs trigger notifications to parents ("điểm danh", "hoạt động", "album", "hình/video") and are highlighted in distinct bold orange typography (`#EA580C`) within the Vietnamese descriptive labels, optimizing visual scanning for school staff.

### 8. Standardized Student Terminology (`BR09`, `C137`)
- All labels, descriptions, and helper hints throughout the Notification Settings interface standardize student references on the primary term "học sinh" (with parenthesized "học sinh / trẻ" where applicable), eliminating legacy terminological drift.

### 9. Downstream Cross-Module Notification Consumers
- **Attendance (`Module 1: Điểm Danh`):** Triggers evening pickup alerts (17:00) and parent arrival/departure push notifications.
- **Activities (`Module 1: Hoạt Động`):** Dispatches "Hoạt động chờ duyệt" alerts to teachers and school admins via Web/App and Email channels.
- **Media Albums (`Module 1: Thư Viện`):** Dispatches new photo/album upload push notifications to parents.
- **Tuition & Billing (`Module 3: Học Phí`):** Schedules invoice publication alerts and directional due-date payment reminders.
- **Parent Communication (`Module 1: Trao Đổi`):** Relies on notification settings to govern parent push alerts.

### 10. "Never Do" List for Notification Settings
- **NEVER** subdivide Notification Settings into multiple decoupled routes or tab sub-forms (must render as a single monolithic form).
- **NEVER** persist notification settings mutations without prompting confirmation modal `MODAL-NOTIF-01`.
- **NEVER** discard unsaved working form edits when the administrator clicks "Hủy bỏ" in the confirmation modal.
- **NEVER** attach an independent toggle switch to the Birthday schedule configuration row (sub-options inherit schedule).
- **NEVER** expose Email delivery toggles for attendance, birthday, tuition, or parent sections (email is reserved for Section 4 review queues).
- **NEVER** permit administrators to edit the fixed operational hours (17:00 pickup alert and 20:00 journal review must remain read-only).
- **NEVER** silently drop recurring reminders on the 29th, 30th, or 31st during shorter months (must apply calendar overflow fallback).
- **NEVER** leave the "Cập nhật" action button enabled when no settings diverge from the saved baseline.
- **NEVER** render parent action keywords in plain text without distinct orange highlighting (`#EA580C`).
