# Architecture Decision Records (ADR) — School Operating Portal

> **Project:** School Operating Portal (Finviet / SOHA)  
> **Governance:** Marcus Fleet Architecture Decision Matrix  
> **Standard:** ADR-001 through ADR-005

---

## ADR-001: Next.js Pages Router for Multi-Tenant Routing

- **Context:** The application requires reliable multi-tenant routing where every path begins with `/{schoolCode}/...` alongside static/server-rendered dashboards, Redux global hydration, and NextAuth.js session management across thousands of school users.
- **Decision:** Adopt Next.js Pages Router with dynamic top-level route grouping `pages/[schoolCode]/...` and a root `_app.tsx` managing Redux, theme injection, and session state.
- **Alternatives Rejected:**
  - *Next.js App Router (`app/` directory):* Rejected due to complex server component serialization friction with Redux store synchronization and established user stack requirements.
  - *Client-only SPA (Vite + React Router):* Rejected due to lack of initial server-rendered HTML for institutional SEO and multi-tenant sub-domain edge rewrite compatibility.
- **Evidence Reference:** Claim `C017`, Evidence `E018`, Source `S018`.
- **Consequences:** Provides rock-solid routing, straightforward Redux hydration, and zero friction with established React component libraries. Requires custom middleware for edge tenant rewrites.
- **Rollback Trigger:** If Pages Router reaches end-of-life in Next.js or performance benchmarks show unacceptable bundle sizes compared to standalone microfrontends.

---

## ADR-002: Hybrid Tailwind CSS and Styled-Components Architecture

- **Context:** The system needs rapid layout prototyping and consistent responsive grids, while simultaneously needing pixel-perfect adherence to the atomic `ECO Design System 1.0` component library.
- **Decision:** Enforce a strict partition: Tailwind CSS is used exclusively for outer container geometry, grid layouts, flex alignment, and standard spacing utility classes; `styled-components` is used exclusively for atomic UI widgets, interactive states, custom pseudo-elements, and theme-injected CSS variables.
- **Alternatives Rejected:**
  - *Pure Tailwind CSS:* Rejected because complex component variant matrices in ECO Design System (such as 68-button variant frames and animated input states) become unreadable and brittle when expressed entirely as long utility string class lists.
  - *Pure styled-components:* Rejected because structural page scaffolding (flex grids, padding adjustments across screens) causes stylesheet explosion and slower developer ergonomics.
- **Evidence Reference:** Claim `C020`, Evidence `E021`, Source `S017`.
- **Consequences:** Combines rapid scaffolding speed with deep atomic component encapsulation. Requires linting rules to prevent inline CSS misuse.
- **Rollback Trigger:** If bundle size exceeds 250KB CSS or CSS-in-JS runtime performance causes noticeable frame drops on low-end mobile teacher tablets.

---

## ADR-003: Asynchronous Facial Recognition Pipeline

- **Context:** The media library and attendance modules require student facial recognition tagging across albums containing up to 100 high-resolution photos per upload. Processing this synchronously in an HTTP request causes gateway timeouts.
- **Decision:** Upload photos to Google Cloud Storage immediately, issue an asynchronous processing job to a dedicated Cloud Run background worker, and update student tag portfolios via background database writes. The UI displays an optimistic "Đang nhận diện..." badge until completion.
- **Alternatives Rejected:**
  - *Synchronous HTTP inference:* Rejected because processing multiple 5MB photos exceeds Cloud Run 60s request limits and degrades teacher user experience.
  - *Client-side WebAssembly face detection:* Rejected due to high memory footprint and CPU throttling on budget school tablets and mobile browsers.
- **Evidence Reference:** Claim `C005`, Evidence `E006`, Source `S004`, Contradiction `K001`.
- **Consequences:** Ensures zero upload blocking and resilience under burst classroom uploads. Requires background job queue management and polling or WebSocket notifications for client updates.
- **Rollback Trigger:** If Cloud Run worker execution costs exceed budgeted operational quotas or latency exceeds 30 seconds per photo batch.

---

## ADR-004: Unified Invoicing with Automated Attendance Meal Credits

- **Context:** Students who have excused absences (vắng có phép) during the month are eligible for meal fee refunds. Manual accountant calculation of these refunds is error-prone and labor-intensive.
- **Decision:** Connect the invoicing engine directly to attendance records. During monthly invoice generation, the backend calculates verified excused absence days from Module 1 and generates automated deduction line items (`Giảm trừ tiền ăn`) on the student's next invoice.
- **Alternatives Rejected:**
  - *Separate cash refund vouchers (Khoản Chi):* Rejected because issuing thousands of individual cash disbursement vouchers creates massive administrative overhead for accounting staff.
  - *Manual accountant adjustments:* Rejected due to high error rates and parent billing complaints.
- **Evidence Reference:** Claim `C012`, Evidence `E013`, Source `S011`, Contradiction `K002`.
- **Consequences:** Eliminates manual calculation errors and provides transparent audit trails on parent invoices. Requires cross-module data consistency between attendance and billing.
- **Rollback Trigger:** If school policy demands immediate cash payouts rather than invoice credits, an administrative override switch in school settings will allow manual cash voucher generation.

---

## ADR-005: OpenResty Gateway and Cloud Run Multi-Tenant Edge Routing

- **Context:** The portal serves multiple school tenants with custom domains (`app-*.domain` and `api-*.domain`) and multi-tenant URL prefixes (`/{schoolCode}/...`), requiring SSL termination, rate limiting, and seamless routing to serverless Cloud Run containers.
- **Decision:** Deploy OpenResty (Nginx + Lua) as a unified reverse proxy in front of Google Cloud Run web and API containers. OpenResty inspects incoming domain headers and URL path segments, rewrites requests with tenant identifiers, and applies rate limiting.
- **Alternatives Rejected:**
  - *Direct Cloud Run custom domain mapping:* Rejected because native Cloud Run domain mapping lacks flexible Lua request rewrites and dynamic multi-tenant header injection.
  - *Google Cloud Load Balancer with Cloud Armor:* Kept as an upstream optional layer, but OpenResty is necessary for custom URL prefix normalization and white-label tenant resolution.
- **Evidence Reference:** Claim `C019`, Evidence `E020`, Source `S018`.
- **Consequences:** Provides ultra-fast edge routing, centralized SSL management, and flexible tenant URL mapping. Requires maintaining OpenResty Docker configuration.
- **Rollback Trigger:** If serverless edge networks (e.g., Cloudflare Workers or Google Cloud Serverless VPC Access) provide equivalent Lua-free routing with lower maintenance overhead.

---

## ADR-008: Universal Logic Change Confirmation Pop-ups, Standard Toast Feedback, and Quản Lý Học Phí Table Streamlining

- **Context:** User testing and product governance established two critical platform-wide interaction standards and financial table refinements:
  1. **Interaction Standard:** Any user action that modifies underlying business logic or catalog configuration (such as changing "Xuất HĐĐT" for a fee item) must require an explicit confirmation pop-up modal before applying changes. Conversely, displaying information or confirming successful actions must always be rendered via the standard top-right global toast notification (`addToast`).
  2. **Fee Catalog (Khoản phí) Filtering & Sorting:** Users required the ability to both filter by specific fee units via a toolbar dropdown and sort ascending/descending directly by clicking the "Đơn vị" column header.
  3. **Tuition Management (Quản lý học phí) Column Simplification:** The class fee schedule table had column bloat with redundant individual fee columns (`Học phí (đ/tháng)`, `Tiền ăn (đ/ngày)`) and `Xuất HĐĐT`. Stakeholders required removing these three columns, renaming `Các khoản khác` to `Các khoản phí`, and displaying only the fee count along with a clickable icon opening a 3-column modal pop-up (`Tên khoản phí`, `Số tiền`, `Xuất HĐĐT`).
- **Decision:**
  1. **Enforce Modal-for-Logic & Toast-for-Feedback:** In `FeeCatalogTable.tsx`, toggling "Xuất HĐĐT" triggers `pendingInvoiceToggle` modal with fee details and impact explanation; upon confirmation, changes are applied and standard `addToast` is dispatched. All creation, edition, deletion, and batch updates across financial modules dispatch standard toasts.
  2. **Unit Filter & Header Sorting:** Added `unitFilter` select to the toolbar and interactive sort toggle (`sortUnit`) to the "Đơn vị" column header in `FeeCatalogTable.tsx`.
  3. **Streamline Class Fee Schedules Table:** Reduced columns from 9 to 6 in `ClassFeeScheduleTable.tsx` (STT, Tên lớp, Khối, Sĩ số, Các khoản phí, Thao tác). In `Các khoản phí`, rendered `{count} khoản phí` badge with an eye icon button opening `ClassFeeListModal` showing `Tên khoản phí`, `Số tiền`, and `Xuất HĐĐT (Có/Không)`.
- **Alternatives Rejected:**
  - *Direct unconfirmed toggle for Xuất HĐĐT:* Rejected due to high risk of accidental configuration drift affecting future invoice runs.
  - *Inline accordion expansion for class fees:* Rejected in favor of a clean centered modal pop-up to preserve table compactness and avoid vertical layout shift.
- **Consequences:** Eliminates accidental financial configuration changes, reinforces predictable enterprise feedback patterns, and provides a clean, focused overview for class tuition schedules.
- **Rollback Trigger:** None. Patterns strictly improve data safety, UI consistency, and operational usability.

---

## ADR-007: Universal Table Action Dropdown Standardization and Invoicing UX Enhancements


- **Context:** User testing and product governance revealed two UX inconsistencies:
  1. Action columns ("Thao tác") in tables varied across modules: some displayed raw inline icons (e.g., Eye, Edit, Trash in Khoản phí; Eye, Check, Ban in Khoản chi; $, Doc in Quản lý học phí; Excel, Detail in Đối soát; Trash in Media list view), whereas "Thời Khóa Biểu" established the benchmark with a single `•••` (`[...]`) button toggling a contextual dropdown menu.
  2. The "Học Phí" module needed time filter parity with legacy design (Image 1): a prefix titled `"Lọc theo:"` with selectable `"Thời gian tạo HĐ"` or `"Hạn đóng HĐ"` and a single date range picker; manual payment confirmation needed restriction strictly to 3 methods (`Tiền mặt`, `QR ECOPay`, `Ví Finviet`) with standard toast feedback; and detailed invoice bills needed explicit payment status badges under line-item amounts (`Đã thanh toán` in green vs `Chưa thanh toán` in red, per Image 2).
- **Decision:**
  1. **Standardize Action Column across all tables:** Adopt the "Thời Khóa Biểu" pattern as the universal standard. Every table row's "Thao tác" column features a standardized `•••` (three dots) action button opening an upward-flipping top-layer dropdown menu (`z-index: 9999`) when near the bottom of the table, closing on outside click or item selection.
  2. **Invoice Time Filter Composite:** Implement a composite date filter widget on `InvoiceRosterTable` featuring `"Lọc theo:"` selector (`createdAt` vs `dueDate`) paired with a date range popover (`DD/MM/YYYY - DD/MM/YYYY ▾`).
  3. **Strict Manual Payment Options & Standard Toast:** Restrict `ManualPaymentModal` to `tien_mat` (Tiền mặt - *Updated per ADR-036 to strictly single cash option; digital methods QR ECOPay and Ví Finviet are handled exclusively by automated gateway reconciliation*). Replace browser `alert()` with the global Redux toast notification (`addToast`) upon clicking `"Lưu xác nhận"`.
  4. **Detailed Invoice Line-Item Payment Status Badges:** Render `"Đã thanh toán"` in green (`#059669`) and `"Chưa thanh toán"` in red (`#F43F5E`) beneath `Thành tiền` for billable items.
- **Alternatives Rejected:**
  - *Keep inline icons on tables with 2 or fewer actions:* Rejected to maintain 100% visual and behavioral consistency across every table in the portal.
  - *Add fourth payment method (Ngân hàng chuyển khoản):* Rejected per explicit stakeholder requirement restricting manual payment options to Tiền mặt, QR ECOPay, and Ví Finviet.
- **Consequences:** Creates a unified, polished enterprise UI standard across all modules. Streamlines table horizontal real estate and ensures zero visual clipping.
- **Rollback Trigger:** None. Changes strictly elevate visual coherence, user feedback quality, and stakeholder alignment.


---

## ADR-006: Platform Filter Modal Harmonization and Invoice Creation Date Range Filtering

- **Context:** User testing revealed inconsistencies across modules:
  1. The "Báo Cáo Mở Rộng" module used a clean centered popup modal when clicking "Bộ lọc", whereas "Thời Khóa Biểu" and "Bài Tập" opened full-height slide-over drawers from the right.
  2. The "Trao Đổi" chat header contained an unnecessary "Chọn thời gian" button that cluttered the interface.
  3. The "Học Phí" module restricted invoice listing to a single month dropdown ("Tháng hóa đơn"), preventing accountants from filtering invoices across flexible date spans according to their actual creation date (`createdAt`).
- **Decision:**
  1. **Adopt Centered Modal Standard:** Standardize all advanced filter dialogs (including Thời Khóa Biểu and Bài Tập) into centered popup modal dialogs with semi-transparent backdrop (`rgba(15, 23, 42, 0.5)`), max-width 480px, scrollable body, and standardized "Thiết lập lại" / "Áp dụng bộ lọc" footers, matching the Báo Cáo Mở Rộng (`ExtendedFilterModal`) benchmark.
  2. **Streamline Chat Header:** Remove the redundant "Chọn thời gian" button from the Trao Đổi chat header, focusing the header actions strictly on group details and conversation settings.
  3. **Invoice Date Range Filter:** Replace the single billing month selector in Học Phí with a date range filter ("Từ ngày tạo HĐ" and "Đến ngày tạo HĐ") that evaluates against `inv.createdAt`.
- **Alternatives Rejected:**
  - *Right-side slide-over drawers:* Rejected because drawers created visual inconsistency, occupied full vertical screen height unnecessarily, and were disorienting on compact tablet screens.
  - *Keep single month dropdown alongside date range:* Rejected to avoid UI clutter; the date range picker intuitively covers both single-month and custom cross-month ranges.
- **Consequences:** Provides uniform, predictable UI behavior across all operating portal modules. Enhances accounting flexibility in invoice reconciliation.
- **Rollback Trigger:** None anticipated; pattern strictly elevates UI coherence and functional utility.

---

## ADR-009: School Administration Core Architecture, Entity Integrity Guardrails, and Search Rectification

- **Context:** The Phase 1 expansion to "Nhà Trường" (School Administration) encompasses the foundational institutional master data entities across 5 sub-modules: Học Sinh (Students), Giáo Viên (Teachers), Lớp Học (Classes), Môn Học (Subjects), and Khối Lớp (Grade Levels). Several core architectural questions and legacy defects were identified:
  1. *Class Taxonomy & Extracurricular Scoping:* Extracurricular classes require distinct operational treatment compared to regular curricular classes.
  2. *Class Deletion Safety Invariant:* Deleting an active class could orphan student profiles and billing records.
  3. *Teacher Moderation Permissions:* Activity posting permissions must enforce role-based moderation between head and assistant teachers.
  4. *Student Transitions Cascading:* Class transfers and annual promotions must cascade across fees, communications, and evaluations without orphaned data.
  5. *Legacy Grade Level Search Bug:* The legacy API endpoint for grade level search (`GET /grades?q=...`) returns zero results for any query and fails to reload when cleared.
- **Decision:**
  1. **Dual Class Taxonomy with Feature Degeneration:** Partition classes into `chinh_khoa` (Curricular) and `ngoai_khoa` (Extracurricular). Curricular classes provide full operational, financial, and evaluation tabs. Extracurricular classes enforce intentional feature degeneration: supporting only attendance, activities, and photo albums, while omitting tuition schedules, gradebook rubrics, and subject teacher allocations.
  2. **Strict Class Deletion Invariant:** Enforce that a class is deletable if and only if `studentCount === 0`. If `studentCount >= 1`, the delete action is completely omitted from the row action menu and blocked at the API level.
  3. **Two-Tier Teacher Moderation Pipeline:** Assign every teacher a moderation permission: `Giáo viên chính` (posts to Activity feed are auto-published as `da_duyet`) vs `Giáo viên hỗ trợ` (posts default to `cho_duyet` and route to the moderation queue).
  4. **Tripartite Student Transition Cascade:** Enforce that class transfer and bulk academic year promotion modals require selecting source and destination classes, explicitly prompting acknowledgement of 3 automated rules: fee schedule remapping, chat room re-enrollment, and evaluation record pruning.
  5. **Client-Side Reactive Search Rectification:** In the Khối Lớp (Grade Levels) module, implement client-side reactive substring filtering on the in-memory Redux store for name and code searches, bypassing defective server query parameters and instantly restoring full listings upon clearing the search term.
- **Alternatives Rejected:**
  - *Unified class schema without feature degeneration:* Rejected because extracurricular classes do not follow national MOET curriculum rubrics or standard tuition fee schedules; attempting to force them into regular gradebook and fee schemas introduces data contamination.
  - *Soft delete for classes with active students:* Rejected to preserve data integrity; classes must be explicitly emptied via student transfers before deletion can occur.
  - *Server-side search fix dependency for Khối Lớp:* Rejected because client-side filtering over the fixed 26-grade master dataset is faster, zero-latency, and immune to legacy backend query bugs.
- **Evidence Reference:** Claims `C021`-`C026`, Evidence `E022`-`E027`, Sources `S019`-`S023`, Contradictions `K006`-`K008`.
- **Consequences:** Guarantees institutional master data integrity across student lifecycles, clarifies faculty responsibilities, prevents accidental loss of class data, and delivers instant, reliable search across grade levels.
- **Rollback Trigger:** None. Principles enforce strict data hygiene and resilience.

---

## ADR-010: School Administration Phase 2 — Communication, Nutrition, Staff Attendance, and Knowledge Architecture

- **Context:** Phase 2 expands School Administration into day-to-day operations, nutrition, staff timesheets, and institutional guidelines across 5 sub-modules: Bảng Thông Tin (Announcements), Bình Chọn (Surveys), Thực Đơn (Meal Menus), Điểm Danh NV (Staff Attendance), and Sổ Tay PH (Parent Handbook). Key architectural and UX decisions were identified:
  1. *Dual Publish Pipeline for Menus & Announcements:* Weekly menus often require school-wide parent notifications, creating a cross-module publishing dependency between Thực Đơn and Bảng Thông Tin.
  2. *Menu Default Hierarchy & Food Traceability:* Classes without specialized dietary plans need seamless menu inheritance. Ingredient provenance requires compliant tracking across packaged commercial goods and fresh produce.
  3. *Staff Attendance Rapid Clock-In vs Modal Guardrails:* High-throughput morning staff arrivals require zero-friction clock-in, while destructive status adjustments require confirmation.
  4. *Search-Time Metric Suppression:* Active text search on staff rosters can cause users to misinterpret subset counts as school-wide totals if summary counters remain visible.
  5. *Two-Tier Knowledge Base Taxonomy:* Multi-level documentation trees risk visual clutter and navigation breakdown if category nesting depth is unconstrained.
- **Decision:**
  1. **Dual Announcement Dispatch Path for Menus:** Menus support silent publishing (`chi_xuat_ban`) or integrated broadcast (`gui_thong_bao`) which automatically authors an announcement entity in Bảng Thông Tin (`category: 'thuc_don'`). Synchronization is maintained via a loose `linkedAnnouncementId` foreign reference rather than rigid database triggers.
  2. **Automatic Class Menu Fallback & Dual Traceability:** Classes without custom menu overrides automatically inherit and display the school-wide (`Toàn trường`) weekly menu. Ingredient provenance supports dual schemas: GS1 GTIN barcodes + lot numbers (with automated supplier lookup) for commercial items, and internal kitchen stamp codes for farm-direct ingredients. Cloning is permitted exclusively for structured Grid menus.
  3. **High-Throughput Staff Clock-In Exception:** Check-in and Check-out actions execute as optimistic single-click transactions with immediate toast feedback (`addToast`), bypassing confirmation modal friction. Destructive and evaluative actions (marking staff Absent with permission or retroactively overriding recorded hours) strictly enforce modal confirmations.
  4. **Staff Search KPI Counter Suppression:** When filtering staff by text query, the 3 top aggregate KPI summary counters (Tham dự, Vắng có phép, Vắng không phép) are automatically hidden, leaving only the contextual `Tổng: N` footer to prevent data misinterpretation.
  5. **Strict 2-Tier Knowledge Tree & Cascading Deletion:** Sổ Tay PH enforces a hard limit of 2 category levels (Root $\rightarrow$ Sub-category $\rightarrow$ Articles) with single-sibling accordion expansion. Category deletion strictly prompts an explicit cascading warning detailing all child sub-categories and articles to be removed.
  6. **Universal Standards Alignment:** All 5 sub-modules enforce sentence case headers, `•••` action dropdowns, modal pop-ups on destructive changes, and standard global toasts for successful state changes.
- **Alternatives Rejected:**
  - *Require confirmation modal for daily staff check-in:* Rejected because morning rush clock-in requires rapid sequential interactions where modal dialogs create unacceptable operational bottlenecks.
  - *Unlimited category nesting in handbook:* Rejected because deep hierarchical trees create usability collapse and visual overflow on mobile and tablet viewport widths.
  - *Hard deletion of menus with linked announcements:* Rejected to prevent orphaned or broken communication records; linked announcements remain intact as historical records when menus are unmounted.
- **Evidence Reference:** Claims `C027`-`C032`, Evidence `E028`-`E033`, Sources `S024`-`S028`, Contradictions `K009`-`K011`.
- **Consequences:** Provides streamlined morning staff clock-in, transparent food safety compliance, clear parent FAQ navigation, and reliable cross-module notification dispatch while upholding universal design system standards.
- **Rollback Trigger:** None. Architecture adheres strictly to enterprise boundaries and defensive invariants.

---

## ADR-011: School Administration Phase 3 — Feedback Lifecycle, Academic Continuity, Event Topology, and Archive Isolation

- **Context:** Phase 3 completes the School Administration domain across the final 4 sub-modules: Góp Ý (Feedback & Tickets), Lịch Sự Kiện (Event Calendar), Năm Học (Academic Years), and Lưu Trữ (Student Archive). Critical cross-cutting architectural choices, lifecycle guards, and UX invariants were identified:
  1. *Feedback Ticket Lifecycle & Persistent Global Status Counters:* Status cards at the top of the feedback inbox act as clickable filters (`yeu_cau_moi`, `dang_xu_ly`, `hoan_tat`, `mo_lai`), but legacy implementations exhibited a defect where filtering dropped all 4 KPI counters to 0 instead of maintaining independent totals.
  2. *Two-Way Threaded Discussion & Waiting-On State Machine:* Support ticket resolution requires a bidirectional discussion stream between parents and school administrators with dynamic `waitingOn: 'parent' | 'school'` tracking, inline priority chips (`thap`, `trung_binh`, `cao`, `khan_cap`), and handler assignments without full page reload.
  3. *Synchronized 3-View Event Calendar Topology:* Event data must remain fully synchronized across Year (12 mini-grids), Month (7x5/6 detailed matrix), and Event List (chronological feed with tear-away date cards) views, with category color coding and auto-populating single-day end dates.
  4. *Academic Year Temporal Invariants & Active Term Auto-Resolution:* Academic years govern system-wide tuition schedules and class rosters. Overlapping dates between full academic years must be rejected, UI deletion must be permanently disabled, and active year resolution must be dynamically evaluated against system time.
  5. *Archive Isolation, Historical Audit Preservation & Class Re-Enrollment:* Withdrawn or graduated students in cold storage must be completely isolated from active class rosters and fee generation. Restoring a student must preserve full academic audit history, validating whether their former class is currently active or routing them to "Chưa xếp lớp" with an amber warning. Permanent deletion requires a 2-step confirmation modal with red warning graphics.
- **Decision:**
  1. **Feedback Status Counter Decoupling (Resolution K012):** Filter selection updates the table roster via an active filter predicate while summary status cards compute counts from the unfiltered master feedback collection. The active card displays a highlighted border and an active badge, with a persistent "Xóa bộ lọc" reset link.
  2. **Threaded Discussion & Modal Closing Guard:** Two-way feedback discussion threads update `waitingOn` on each submission. Changing ticket priority and handler is executed inline with immediate toast feedback (`addToast`). Closing a ticket (`hoan_tat`) strictly prompts a confirmation modal (`GY-01: "Vui lòng xác nhận Đóng góp ý {tên góp ý}"`).
  3. **Event 3-View Single Data Store & End Date Auto-Population (Resolution K014):** All 3 calendar views bind to a unified Redux event collection. During event creation, choosing `Từ ngày` automatically sets `Đến ngày` to the same date if empty, eliminating repetitive input for single-day events.
  4. **Strict Academic Year Overlap Validation & Deletion Guard (Resolution K015):** Overlapping date intervals between full academic years are strictly blocked with validation error `NH-03`. Sub-terms/semesters are validated to lie strictly within their parent year's boundaries. Deleting academic years from the UI is disabled; past years are designated read-only archives.
  5. **Archive Isolation & Class Availability Fallback (Resolution K013):** Archived students are excluded from daily operational rosters. Restoring a student checks whether `formerClassId` exists in the active academic year: if active, the student is re-enrolled; if closed/inactive, the student status becomes `chua_xep_lop` with an amber warning. Permanent deletion executes a two-step confirmation modal with red alert styling.
  6. **Universal UX Alignment:** All 4 sub-modules strictly enforce sentence-case table headers, `•••` action dropdowns, modal pop-ups on destructive actions, and standard top-right toasts for success notifications.
- **Alternatives Rejected:**
  - *Coupling feedback KPI counters to the active filtered subset:* Rejected because losing visibility of other status categories disorients operators and creates a false sense of empty queues.
  - *Hard deleting academic years:* Rejected because deleting an academic year would trigger catastrophic cascading data loss across class rosters, fee schedules, and attendance histories.
  - *Directly restoring archived students to non-existent classes:* Rejected because restoring a student to an inactive or archived class corrupts current-year class rosters and student count summaries.
- **Evidence Reference:** Claims `C033`-`C037`, Evidence `E034`-`E038`, Sources `S029`-`S032`, Contradictions `K012`-`K015`.
- **Consequences:** Guarantees complete operational data integrity across student transitions, provides high-clarity ticket tracking for parent feedback, enables versatile event scheduling, and protects institutional historical records.
- **Rollback Trigger:** None. Architecture strictly enforces enterprise invariants and defensive boundaries.

---

## ADR-012: Finance — Tuition Exemption & Discount Policy Architecture, Temporal State Machine, and Invoice Auto-Application Engine

- **Context:** The Finance domain requires a dedicated Tuition Exemption & Discount Policy Management sub-module (`Miễn Giảm` at `/school/discount`) to configure, track, and automate tuition fee reductions, social policy exemptions, merit scholarships, and promotional discounts across classes and individual learners. Core architectural challenges and invariants identified during planning include:
  1. *Dual Calculation Types & Fee Item Binding:* Policies must support both percentage discounts (`percent`, 0%–100%) and fixed cash deductions (`fixed_amount` in integer VND), bound to specific line items from the master fee catalog (`/school/school-fees`).
  2. *Dual Beneficiary Scope Topology:* Policies must apply either cohort-wide to designated classes (`class`, with multi-select class dropdown) or to individual learners (`student`, with a searchable cross-class student picker).
  3. *Discount Stacking & Conflict Resolution:* How the billing engine reconciles multiple overlapping discount policies targeting the same student and fee item (`K016`).
  4. *Temporal State Machine & Historical Immutability:* How policies automatically transition through lifecycle states (`Hoạt động`, `Ngừng áp dụng`, `Hết hạn`) and guarantee that past issued invoices remain immutable (`K017`).
  5. *Invoice Creation Wizard Integration & Admin Override:* How accountants control automatic discount application during batch tuition invoice generation without mutating master policy configurations (`K018`).
- **Decision:**
  1. **Highest Discount Priority & Scope Specificity Engine (Resolution K016):** When multiple discount policies target the same student and fee line item, the engine resolves conflicts via:
     - *Scope Specificity:* An individual student-targeted policy strictly takes precedence over a class-wide policy targeting the same fee item.
     - *Highest Rate Priority:* For multiple policies of equal scope specificity, the engine selects the highest discount percentage or cash value (`Math.max(rate_1, rate_2)`).
     - *Disjoint Line-Item Independence:* Policies targeting distinct fee items (e.g., Tuition vs Meal Fees vs Bus Transportation) evaluate independently.
     - *Non-Negative Balance Clamping:* Total discount deductions on any line item are clamped to $[0, \text{grossLineItemAmount}]$, preventing negative invoice balances.
  2. **Automated Temporal State Transitions & Historical Invariant (Resolution K017):**
     - Policy lifecycle states are dynamically evaluated against current system date: policies past their `toMonth` or academic year end date automatically transition to `Hết hạn` (Expired) and are excluded from future billing. Active policies can be manually paused (`Ngừng áp dụng`) or terminated.
     - Updating, pausing, or expiring a policy strictly governs *future* invoice generation runs. Previously generated, issued, or settled invoices (`da_tao`, `da_gui`, `da_thanh_toan`) permanently preserve their historical discount records and audit references.
  3. **Invoicing Creation Wizard Integration & Admin Override (Resolution K018):**
     - Step 1 of the tuition invoice creation wizard (`/school/fee/create`) incorporates an administrative toggle: "Tự động áp dụng chính sách miễn giảm" (default ON).
     - When ON, eligible student invoices display an itemized discount line per fee item (`-X VND`), adjusting the net payable balance.
     - When toggled OFF, invoice calculations proceed with gross fee catalog amounts for that specific generation run only, preserving master policy definitions intact.
  4. **Full-Width Responsive Roster & Export:** The `/school/discount` screen enforces the standard full-width layout (`w-full space-y-6`), unit-sorted columns, status filter tabs, search filter, action dropdowns (`•••`), and an Excel export pipeline (`.xlsx`) outputting policy metadata and expanded beneficiary rosters.
- **Alternatives Rejected:**
  - *Additive discount stacking:* Rejected because summing discounts (e.g., 50% + 70% = 120%) leads to negative billing balances and unintended over-subsidization.
  - *Retroactively recalculating past invoices on policy mutation:* Rejected because issued and settled financial documents are legal/accounting records requiring immutable audit integrity.
  - *Mutating master policy status on wizard bypass:* Rejected because an accountant generating an ad-hoc gross billing run must not disrupt continuous active policies for standard billing cycles.
- **Evidence Reference:** Claims `C038`–`C042`, Evidence `E039`–`E043`, Sources `S033`–`S035`, Contradictions `K016`–`K018`.
- **Consequences:** Provides automated, auditable, and transparent fee concession governance, accelerates monthly tuition billing workflows, prevents accounting discrepancies, and upholds institutional compliance.
- **Rollback Trigger:** None. Architecture adheres strictly to enterprise boundaries and defensive invariants.

---

## ADR-013: Settings — Fee Configuration Architecture, Independent Dirty State Tracking, and Security Guardrails

- **Context:** Sub-module 3 ("Học Phí") under Module 6 ("Cấu Hình") at entry point `/setting/fee/` provides institutional configuration for tuition invoice notes, Sepay automated payments, Viettel SInvoice electronic invoicing, late pickup surcharges, absence meal refund thresholds, and periodic financial reconciliation distribution emails. Key architectural constraints and invariants include:
  1. *Independent Block State Partitioning & Dirty Tracking (`BR01`, `BR03`):* The page hosts 5 independent configuration blocks. Each block must manage an isolated dirty state and independent Save button; saving one block must not touch unsaved edits in other blocks. Departing with unsaved edits in any block triggers the system confirmation modal dialog.
  2. *Sepay Automated Payment & Monthly Transaction Audit (`BR02`, `BR16`):* Sepay credentials must be read-only with no Save button, displaying masked API Secret Tokens and Webhook URLs with eye reveal toggles, and linking to `/setting/fee/payment-history/` with monthly filtering and graceful empty state handling.
  3. *SInvoice Electronic Invoicing & Credential Security (`BR04`-`BR06`, `K019`):* Master toggle collapses the card when OFF. When ON, all 6 core fields (Tax Code, Account Name, Password, Template, Type, Serial) are mandatory (*). To prevent shoulder-surfing in open administrative offices, password remains permanently masked (`type="password"`) without an unmask toggle.
  4. *Late Childcare Surcharge Modalities & Absence Meal Refund (`BR07`-`BR13`, `K020`, `K022`):* Late pickup toggle disables (without hiding) inner controls. Supports Fixed Rate (5–60 mins step 5 combobox + hourly rate) or Tiered Brackets (table where row 1 is permanent; delete icon requires $\ge 2$ rows). Absence refund features 0–100 hours combobox; toggling ON renders school operating hours (SM1 reference) and conditional refunds; toggling OFF hides hours and triggers unconditional refunds.
  5. *Reconciliation Email Distribution Roster (`C047`, `BR14`, `K021`):* The Reconciliation Email distribution roster enforces strict regex validation, duplicate prevention, and a 3-recipient hard ceiling with input locking upon capacity.
- **Decision:**
  1. **Segmented Redux Architecture:** Implement `settingFeeSlice.ts` managing independent sub-states (`invoiceNote`, `sepay`, `sinvoice`, `latePickupAndRefund`, `reconciliation`) with discrete per-block dirty flags (`dirtyFlags: { invoiceNote: boolean, sinvoice: boolean, ... }`).
  2. **Page-Level Navigation Guard:** Mount `UnsavedChangesModal` triggered by Next.js router route changes (`beforeHistoryChange` or router events) and browser `beforeunload` event when `hasUnsavedChanges` is true.
  3. **Strict Credential Masking:** Enforce `type="password"` permanently for SInvoice password (Resolution K019) while providing eye reveal toggles for Sepay integration parameters.
  4. **Tier Table Row Invariant & Mode Draft Preservation:** Pure validation in `settingFeeValidation.ts` enforces non-deletable Row 1 when `mode === 'tiered'` and preserves both calculation configurations in Redux draft state across mode transitions (Resolution K020).
  5. **Reconciliation Email Guardrails:** Pure validator enforces RFC 5322 regex syntax, checks case-insensitive uniqueness against existing emails (`ERR-HP-02`, Resolution K021), and locks the input field when `emails.length >= 3`.
- **Alternatives Rejected:**
  - *Single global Save button for entire page:* Rejected because failing validation in one obscure block (e.g., SInvoice serial code) would block saving unrelated edits in the invoice note or late pickup policy.
  - *Discarding tiered rows immediately upon switching to fixed mode:* Rejected because accidental mode toggles would destroy carefully entered time brackets before clicking Save.
  - *Permitting unmasked SInvoice passwords:* Rejected due to high security risk in shared administrative workspaces.
- **Evidence Reference:** Claims `C043`–`C047`, Evidence `E044`–`E048`, Sources `S036`–`S038`, Contradictions `K019`–`K022`.
- **Consequences:** Guarantees isolated and predictable configuration saves, protects critical accounting and tax credentials, prevents data loss during form experimentation, and ensures reliable automated reconciliation reports.
- **Rollback Trigger:** None. Architecture adheres strictly to enterprise boundaries and defensive invariants.

---

## ADR-014: Next-Month Billing Cycle Settlement ($M+1$) for Meal Fee Refunds

- **Context:** In Vietnamese K-12 and pre-K educational accounting, tuition and boarding meal fees are collected in advance at the beginning of each billing month (e.g. September). During the month, students may accumulate absent days (both student-initiated and school closures/holidays). We had to choose between two settlement architectures:
  1. *Real-time Retroactive Mutation:* Modifying and re-issuing the current month's invoice whenever a student is absent.
  2. *Next-Month Billing Cycle Settlement ($M+1$):* Aggregating verified absences at month-end and automatically deducting the accumulated refund as an itemized line item in the subsequent month's invoice (e.g. October).
- **Decision:** Adopt **Next-Month Billing Cycle Settlement ($M+1$)**. At the end of billing month $M$ (e.g. September), student non-attendance logs are reconciled. When accountants generate invoices for month $M+1$ (e.g. October) in `Tài chính > Học phí` (`CreateInvoiceWizardModal`), the billing engine automatically calculates the total refund and applies itemized deduction lines to the new bill.
- **Alternatives Rejected:**
  - *Real-time invoice recalculation:* Rejected because mutating already-paid or issued invoices creates accounting chaos, violates invoice immutability principles, and invalidates previously generated tax electronic invoices (SInvoice).
  - *Cash refund vouchers for every absence:* Rejected as standard policy because processing dozens of small cash vouchers per class creates excessive overhead for school accountants (though cash vouchers remain an ad-hoc override).
- **Evidence Reference:** Claims `C049b`, `C050`, Evidence `E051`, Sources `S039`, `S040`, Contradiction `K023`.
- **Consequences:** Preserves the immutability of settled financial records, automates parent refund distribution, and provides complete traceability on monthly tuition bills.
- **Rollback Trigger:** None. Conforms strictly to Vietnamese educational billing standards.

---

## ADR-015: Granular Multi-Meal Category Breakdown (Tiền ăn & Tiền ăn sáng) and 100% School Holiday Guarantee

- **Context:** Different meal categories involve different kitchen food preparation and procurement dynamics. School administrators need flexibility in setting meal refund rates for student-initiated absences while ensuring fairness and transparency for statutory school holidays.
- **Decision:**
  1. **Dual-Group Partitioning:** Categorize non-attendance into:
     - *Group A (Ngày nghỉ lễ / Sự kiện của trường):* Statutory national holidays (e.g. 02/09) and school calendar closures automatically enforce a **100% refund guarantee** for all meals without requiring user percentage inputs.
     - *Group B (Ngày học sinh tự nghỉ):* Sourced from approved parent leave requests or attendance marks; schools independently configure refund percentages for **Tiền ăn (bán trú / trưa)** and **Tiền ăn sáng**.
  2. **Multi-Component Arithmetic Formula:**
     $$\text{Refund}_{main} = (D_{self} \times P_{main} \times \text{Rate}_{main}) + (D_{school} \times P_{main} \times 100\%)$$
     $$\text{Refund}_{bf} = (D_{self} \times P_{bf} \times \text{Rate}_{bf}) + (D_{school} \times P_{bf} \times 100\%)$$
     $$\text{Total Refund} = \text{Refund}_{main} + \text{Refund}_{bf}$$
- **Alternatives Rejected:**
  - *Single flat refund percentage for all meals:* Rejected because grocery procurement dynamics differ between breakfast and lunch; schools requested independent percentage controls.
  - *Allowing schools to reduce holiday refunds below 100%:* Rejected because statutory school closures where the kitchen does not operate must legally and ethically return 100% of meal fees to parents.
- **Evidence Reference:** Claims `C048`, `C049`, Evidence `E049`, `E050`, Sources `S039`, `S041`, Contradiction `K024`.
- **Consequences:** Transparent and mathematically rigorous meal refund reconciliation, eliminating parent billing disputes.
- **Rollback Trigger:** None.

---

## ADR-016: School Event Calendar Architecture, 3-View Single Data Store, and Cross-Module Meal Refund Interoperability

- **Context:** Sub-module "Lịch Sự Kiện" under Module 5 ("Nhà Trường") provides annual operational planning for school holidays, academic milestones, and parent-invited gatherings. Architectural choices identified during planning:
  1. *Route Hierarchy & Placement (K025):* Legacy audit placed holidays under `/demo/setting/holidays/`. In the modern portal, it logically belongs under `NHÀ TRƯỜNG` alongside `/school/kid`, `/school/teacher`, and `/school/menu`.
  2. *Single Data Store across 3 View Modes (BR01, BR04, BR05):* Whether viewing the 12-month year matrix, the single-month day cell grid, or the chronological agenda stream, all views must stay synchronized with zero data discrepancies.
  3. *Three Fixed Semantic Categories (BR02):* Consistent color tokens: `ngay_nghi` (Rose `#E11D48`), `noi_bo` (Teal `#0D9488`), `moi_phu_huynh` (Amber `#EA580C`).
  4. *Multi-day Horizontal Bars vs Tear-off Badges:* Year and Month views render continuous colored horizontal pills across spanning days, with click-to-inspect read-only modals. The Agenda view renders "lịch xé" tear-off date blocks with direct inline edit and delete actions.
  5. *Cross-Module Interoperability with Tuition Meal Refunds (TASK-FIN-034):* School holidays (`ngay_nghi`) declared on the calendar must feed directly into the school holiday schedule used for automated tuition meal refund reconciliation.
- **Decision:**
  1. **Route Standardization:** Adopt `/[schoolCode]/school/calendar` as the primary dashboard hub, with dedicated authoring pages `/[schoolCode]/school/calendar/create` and `/[schoolCode]/school/calendar/edit/[eventId]`.
  2. **Isolated Redux State:** Implement `calendarSlice.ts` managing `selectedYear`, `selectedMonth`, `activeViewMode`, `eventScopeFilter`, and `events` with pure immutable mutations.
  3. **Pure Date & Grid Arithmetic:** Encapsulate calendar cell index calculations, multi-day span clipping, and agenda filtering in `src/utils/calendarValidation.ts`.
  4. **Meal Refund Interoperability:** Export calendar holidays to `settingFeeSlice.ts` to guarantee that days declared as `ngay_nghi` automatically qualify for 100% meal fee refunds in the billing engine.
- **Alternatives Rejected:**
  - *Third-party calendar library (FullCalendar/BigCalendar):* Rejected due to large bundle size (200KB+) and styling friction with ECO Design System 1.0. Custom CSS Grid and Flexbox components provide sub-50ms render performance.
  - *Treating single-day events as separate schemas:* Rejected; single-day events simply store `endDate === startDate`.
- **Evidence Reference:** Claims `C051`–`C054`, Evidence `E052`–`E054`, Sources `S042`–`S044`, Contradictions `K014`, `K025`.
- **Consequences:** Delivers a responsive, lightweight, and cohesive school calendar experience that seamlessly bridges administrative planning and automated tuition accounting.
- **Rollback Trigger:** None.


## ADR-021: School Class Management Taxonomy & Deletion Guardrails

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Benny (Frontend Engineer)
- **Date:** 2026-10-06
- **Context:**
  School Class Management is the central organizational backbone of the school operating portal. The legacy analysis (`lop-hoc.md`) and operational requirements identified three critical design challenges:
  1. *Class Classification Disjointedness (BR01):* Curricular classes (Chính khóa) require formal Grade Levels, designated Homeroom Teachers, 6-item tuition fee breakdowns, grade evaluations, and subject allocations. Extracurricular classes (Ngoại khóa) operate as clubs with multi-instructor staffing, club categories, and flexible meeting schedules.
  2. *Data Integrity & Deletion Safety (BR02, K026):* Allowing an administrator to delete a class containing active students causes severe cascading failures: orphaned student enrollment records, broken invoice references in Tuition Management, and lost attendance logs.
  3. *Staffing Asymmetry (BR03, BR09, K027):* Curricular classes mandate a single primary Homeroom Teacher (`GVCN`), while extracurricular clubs require team-teaching or multi-instructor arrays (`instructorIds: string[]`).
  4. *Multi-Module Convergence (BR07, BR08):* Administrators need a single hub to inspect student rosters, fee schedule previews, subject allocations, and jump directly into daily operational tools (Attendance, Activities, Media albums, Timetables).
- **Decision:**
  1. **Dual-Taxonomy Class Directory:** Implement `/[schoolCode]/school/classes` with two dedicated tabs: "Lớp chính khóa" and "Lớp ngoại khóa".
  2. **Strict Empty-Class Deletion Guardrail:** Deletion is strictly prohibited whenever `studentCount > 0`. The UI disables the delete button with an explanatory tooltip, and the Redux reducer asserts `studentCount === 0`. Administrators must transfer all students in `/school/kid` before deleting.
  3. **Asymmetric Teacher Assignment Schema:** Curricular classes enforce a single `homeroomTeacherId` with conflict detection warnings; extracurricular classes enforce `instructorIds: string[]`.
  4. **Centralized Class Detail Hub:** Route `/[schoolCode]/school/classes/[classId]` consolidates student rosters, fee matrix previews, subject assignments, and direct operational shortcuts.
- **Alternatives Rejected:**
  - *Unified single-table without tabs:* Rejected because curricular and extracurricular classes have disjoint fields, creating awkward empty table cells and confusing filters.
  - *Permitting soft deletion of populated classes:* Rejected because hiding classes while students remain enrolled creates accounting discrepancies and phantom attendance rosters.
- **Evidence Reference:** Claims `C055`–`C058`, Evidence `E055`–`E060`, Sources `S045`–`S048`, Contradictions `K026`–`K028`.
- **Consequences:** Ensures 100% data integrity for student enrollments and tuition invoices while providing an intuitive, responsive management experience for school administrators.
- **Rollback Trigger:** None.

---

## ADR-022: School Subject Catalog Architecture, Assessment Matrix Schema, and Teacher Assignment Governance

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-06
- **Context:**
  School Subject Management ("Môn Học") under Module 5 ("Nhà Trường") governs the academic subject catalog and teaching assignments across K-12 educational tiers. Key design decisions identified during analysis:
  1. *Catalog Authority & MoET Immutability (BR06, K029):* The statutory General Education Program 2018 (Circular 32/2018) specifies national curricula. Allowing school administrators to rename, mutate, or delete core standard subjects causes serious grading discrepancies in Academic Scoreboard (`/school/scoreboard`) and student transcript reports.
  2. *Educational Stage Partitioning (BR01, BR02, K030):* The 4 stages (TH, THCS, THPT, GDTX) have completely different subject rosters, codes, and credit hours. Single-level schools operate in one stage, whereas multi-level schools operate across all four.
  3. *Assessment Matrix & GPA Structure (BR08, K031):* MoET Circulars 27/2020 and 22/2021 govern student assessment. Evaluation methods vary by subject (numerical score vs qualitative comments) across 4 milestone terms (Giữa K1, Cuối K1, Giữa K2, Cuối K2) and whether they factor into GPA.
  4. *Teacher Assignment Safety (BR09, BR10, K032):* Administrators allocate teachers to subjects. Deduplication is required during assignment, and unassignment requires confirmation to prevent accidental detachment of active instructors.
- **Decision:**
  1. **Segmented 4-Stage Directory:** Deploy `/[schoolCode]/school/subjects` with 4 dedicated stage tabs ("Tiểu học (TH)", "THCS", "THPT", "GDTX"), isolating subject records per educational tier.
  2. **MoET Protected Catalog:** Core standard subjects (`isStandardMoET === true`) have immutable codes, classifications, and assessment schemas. Admins can view these configurations but cannot delete the subjects.
  3. **Structured 4-Term Assessment Matrix:** Model evaluation modalities per term (`score`, `level`, `comment`, `score_comment`) alongside `isCountedForGPA`, rendered as a clean 4-column read-only matrix in `SubjectDetailDrawer`.
  4. **Deduplicated Assignment & Protected Unassignment:**
     - Modal `MODAL-ASSIGN-TEACHER` dropdown strictly filters out already-assigned teachers.
     - Modal `MODAL-UNASSIGN-TEACHER` mandates explicit confirmation stating teacher name, subject, and assigned class count before unassigning, while preserving historical gradebook and attendance entries.
- **Alternatives Rejected:**
  - *Allowing School Admins to arbitrarily edit MoET subject codes:* Rejected because changing standardized subject codes breaks integration with Ministry database exports and student transcript generation.
  - *Unified single table mixing all 4 educational stages:* Rejected because subjects like "Toán học" exist in all tiers with distinct curriculum requirements, creating confusing duplicate names.
  - *Unassigning teachers without confirmation:* Rejected because accidental unassignment severs teacher permissions to grade active classes.
- **Evidence Reference:** Claims `C059`–`C063`, Evidence `E061`–`E066`, Sources `S049`–`S052`, Contradictions `K029`–`K032`.
- **Consequences:** Ensures full compliance with MoET Circulars 32/2018, 27/2020, and 22/2021, guarantees seamless scoreboard interoperability, and provides an intuitive teacher allocation interface.
- **Rollback Trigger:** None.

---

## ADR-023: School Grade Level Hierarchy and Dynamic Class Rollup Architecture

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-07
- **Context:**
  School Grade Level Management ("Khối Lớp") under Module 5 ("Nhà Trường") defines educational cohorts and capacity rollups across Vietnamese K-12 stages. Key design decisions identified during analysis:
  1. *Statutory Catalog Immutability (BR06, K033):* Educational grade levels (Khối 1 đến 12) are statutory cohorts defined by MoET Circulars 28/2020 and 32/2020. Allowing school administrators to create non-standard cohorts (e.g. "Khối 13") or delete statutory grades causes severe relational integrity failures across downstream class rosters, academic transcripts, and scoreboards.
  2. *Dynamic Reactive Rollups vs Static Counters (BR02, K034):* Storing static counters (`totalClasses`, `totalStudents`) on grade records creates state desynchronization whenever classes are added/removed or students are transferred in other modules.
  3. *Client-Side Search Responsiveness (BR04, BR05, K035):* Legacy server-side pagination with query round-trips introduced unacceptable latency for small datasets (< 20 grade records) and caused empty state confusion when clearing search inputs.
  4. *Grade Detail Surface & Operational Shortcuts (BR07, BR08, K036):* School administrators need a consolidated view of each grade's assigned classes, homeroom teachers, enrollment capacity, and quick access to Attendance, Timetables, and Class Details.
- **Decision:**
  1. **Statutory Read-Only Master Catalog:** Grade cohorts are pre-initialized according to Vietnamese national standards across 4 educational stages (TH: Khối 1-5, THCS: Khối 6-9, THPT: Khối 10-12, GDTX: Khối 10-12). Creation and deletion buttons are strictly omitted from the UI and state reducers.
  2. **Dynamic Reactive Rollups:** Class counts, enrolled student tallies, total faculty, and homeroom staffing completion percentages are computed reactively in Redux selectors by matching active class records in `classSlice.ts` to `grade.id` within the selected `academicYear`.
  3. **Client-Side Accent-Insensitive Search:** Instant client-side substring matching using `normalizeVietnameseText` matches grade names and codes (e.g. "khoi 1" -> "Khối 1" / "K01"), immediately restoring the complete list upon clearing the input without page reloads.
  4. **Dedicated Grade Detail Cockpit:** Deployed at `/[schoolCode]/school/grades/[gradeId]` with 4 metric KPI summary cards and an 8-column class roster table offering direct operational shortcuts to Class Detail (`/school/classes/[classId]`), Attendance (`/attendance`), and Timetable (`/schedule`).
- **Alternatives Rejected:**
  - *Allowing custom grade cohort creation:* Rejected because custom tiers (e.g. "Khối Cambridge") distort national curriculum reporting and MoET regulatory compliance; specialized programs should be categorized at the Class level, not the Grade level.
  - *Storing pre-computed student/class counts on grade entities in DB:* Rejected because maintaining denormalized counters introduces synchronization bugs during student class transfers.
  - *Side drawer layout for Grade Detail:* Rejected because displaying an 8-column class roster with capacity progress bars and operational links requires full desktop viewport width.
- **Evidence Reference:** Claims `C064`–`C068`, Evidence `E067`–`E072`, Sources `S053`–`S055`, Contradictions `K033`–`K036`.
- **Consequences:** Guarantees 100% relational integrity for academic cohorts, eliminates stale enrollment statistics, and provides school administrators with an efficient overview of school-wide grade capacity.
- **Rollback Trigger:** None.

---

## ADR-024: School Announcement Board Architecture, Multi-Channel Dispatch, and Draft-Only Mutability Policy

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-07
- **Context:**
  School Announcement Board ("Bảng Thông Tin") under Module 5 ("Nhà Trường") serves as the centralized broadcast notification hub across mobile app push and email channels. Key design challenges:
  1. *Route Hierarchy & Portal Consistency (K037):* Legacy systems utilized root `/demo/announcement/`. Under the unified Next.js portal architecture, all administrative modules under "NHÀ TRƯỜNG" reside under `/[schoolCode]/school/...`.
  2. *Notification Mutability & Audit Discrepancy (BR02, K038):* Once an announcement is dispatched, emails and push notifications have already been distributed out-of-band to user mailboxes and mobile devices. Modifying a sent record introduces untraceable discrepancies between the notification payload received by recipients and the portal record.
  3. *Audience Targeting & Multi-Class Cohorts (BR03, K039):* School operations frequently require broadcasting identical notices to several classes within a grade level without having to re-author the announcement multiple times.
  4. *Irrevocable Email Delivery Safeguard (BR10, BR11, K040):* Deleting an announcement from the web portal cannot retract or recall emails already delivered to third-party mail servers (Gmail, Outlook). Operators need clear warnings to prevent misconceptions about email deletion.
  5. *Cross-Module Notice Authoring (BR06, K011):* Modules like Thực Đơn (Menus), Thời Khóa Biểu (Schedules), and Lịch Sự Kiện (Events) require automated notice broadcasting upon publication.
- **Decision:**
  1. **Canonical Route Namespace:** Standardize primary routes at `/[schoolCode]/school/announcements` (with sub-routes for `/create`, `/[announcementId]`, and `/edit/[announcementId]`), while maintaining a backwards-compatible redirect alias from `/[schoolCode]/announcements`.
  2. **Strict Draft-Only Mutability Policy:** Editing is strictly permitted only for announcements in `ban_nhap` status. For published notices (`da_gui`) and scheduled notices (`chua_gui`), the "Chỉnh sửa" action is completely hidden; administrators can only view or delete the notice.
  3. **Multi-Channel & Multi-Class Targeting:** The composer supports 3 transmission channels (`app`, `email`, `both`) and 5 audience scopes. Selecting "Lớp học" dynamically opens sub-audience filtering (`all`, `teachers`, `parents`) and multi-class selection (`targetClassIds: string[]`), dispatching to all selected classes in a single batch.
  4. **Irrevocable Email Deletion Warning:** Both single and bulk deletion flows mandate an explicit audit confirmation modal stating: *"Lưu ý: Người dùng sẽ không thể xem các thông tin liên quan đến thông báo này trên cả Web và App, trừ những email đã được gửi ra"*. In Redux, records transition to `isDeleted: true` for audit preservation.
  5. **Interactive WYSIWYG Preview Modal:** An interactive modal replicates the recipient card layout before dispatch without requiring premature completion of non-essential form fields.
  6. **Cross-Module Loose Coupling:** Operational modules author announcements via foreign references (`linkedAnnouncementId`) rather than tight database cascade constraints.
- **Alternatives Rejected:**
  - *Permitting edits on published announcements:* Rejected because mutating published notices invalidates delivery audit trails and creates confusion when parents compare received push notifications against web portal content.
  - *Hard-purging deleted announcements from database/Redux:* Rejected because permanently purging records destroys audit trails and causes broken foreign references in linked Menu and Schedule modules.
  - *Single-class targeting constraint:* Rejected because requiring administrators to re-type identical notices for multiple classes in the same grade creates unacceptable administrative friction.
- **Evidence Reference:** Claims `C069`–`C073`, Evidence `E073`–`E077`, Sources `S056`–`S058`, Contradictions `K037`–`K040`.
- **Consequences:** Ensures full delivery audit integrity, prevents notification discrepancies, and provides school administrators with a flexible multi-channel communication engine.
- **Rollback Trigger:** None.

---

## ADR-025: School Polls & Surveys Architecture, Decoupled Dispatch, Choice Revision Auditing, and Result Disclosure Governance

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-07
- **Context:**
  School Polls & Surveys ("Bình Chọn") under Module 5 ("Nhà Trường") provides democratic consultative feedback mechanisms for parents, teachers, and school leadership. Key design challenges:
  1. *Decoupled Authoring vs Dispatch (BR03, UC-03/UC-04, K041):* Survey question formulation (Title, Description, Deadline, Image, Options, Configuration Toggles) needs to be prepared without immediately forcing audience assignment or committing to distribution.
  2. *Ballot Mutability & Choice Revision Auditing (BR08, K042):* In school surveys (such as meal preferences, uniform sizes, or field trip registrations), parents frequently change their minds before the deadline. While immutable ballots are standard in elections, consultative school surveys require revision flexibility backed by complete audit logs to resolve parent disputes.
  3. *Result Transparency & Conditional Chart Rendering (BR04, BR06, NFR01, K043):* Competitive or sensitive voting can introduce bandwagon effects if live percentages are public. Parental visibility must be configurable, while administrators need real-time analytics. Furthermore, rendering a pie chart when zero votes exist produces confusing or broken UI layouts.
  4. *State-Driven Action Visibility & Lifecycle Guardrails (BR01, BR02, K044):* Active and closed polls must be protected against accidental deletion or structural modifications (e.g. changing options after votes have been cast).
  5. *Voter Roster & Data Hygiene Isolation (BR11, K045):* Legacy student profile strings may contain data anomalies (e.g. string concatenation). The voter roster must isolate display logic without mutating master student records.
- **Decision:**
  1. **Canonical Route Hierarchy:** Mount at `/[schoolCode]/school/poll/` (with sub-routes for `/create`, `/[pollId]`, and `/edit/[pollId]`), providing a backwards-compatible redirect alias from `/[schoolCode]/school/polls`.
  2. **Decoupled Two-Step Workflow:** Poll creation (`/create`) focuses purely on question content and configuration, creating the poll in `da_tao` (Created / Draft) status without audience. Audience scoping ("Toàn trường" vs "Lớp học" with multi-class selection) is executed via a subsequent dispatch modal (`UC-04`).
  3. **Permissible Vote Revision with Chronological Audit Log:** Voters may revise their selected option(s) until the poll deadline. Active tallies update dynamically, while each revision appends an immutable entry to `voteHistory` with an ISO timestamp, accessible via a history modal in the voter roster.
  4. **State-Driven Action Visibility:** In the directory table, the 3 action icons (Edit, Send, Delete) appear strictly for `da_tao` polls. For `da_gui` and `da_dong` polls, row action icons are completely hidden; users can only click the poll title to view results.
  5. **Conditional Chart Rendering:** Option progress bars render for all polls. The interactive pie chart renders dynamically if and only if total recorded votes $> 0$.
  6. **Class-Level Voter Roster & Profile Isolation:** The detail cockpit displays enrolled students filterable by class and vote status, binding to `studentId` foreign keys and rendering student profiles safely.
- **Alternatives Rejected:**
  - *Combining creation and audience selection into a single monolithic form:* Rejected because administrators need to prepare and review survey questionnaires well before scheduling distribution dates.
  - *Immutable one-time ballot submission:* Rejected because school surveys often require parents to update practical choices (meal options, sizes) prior to deadlines; an audit trail preserves transparency without rigid lock-in.
  - *Rendering empty pie chart graphic when zero votes exist:* Rejected because empty circular charts create user confusion and visual clutter.
  - *Showing disabled action icons with tooltips for active/closed polls:* Rejected in favor of complete icon omission (BR02) to maintain clean directory table aesthetics.
- **Evidence Reference:** Claims `C074`–`C078`, Evidence `E078`–`E082`, Sources `S059`–`S062`, Contradictions `K041`–`K045`.
- **Consequences:** Ensures 100% ballot integrity, provides transparent voter revision tracking, and eliminates premature distribution risks.
- **Rollback Trigger:** None.





---

## ADR-026: Staff Attendance Timekeeping Architecture, 45-Day Retrospective Lock, and Inline Editing

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-07
- **Context:**
  School Staff Attendance ("Điểm Danh NV") under Module 5 ("Nhà Trường") provides daily timekeeping and presence verification for all school personnel (Administrators, Managers, Teachers, and Operations Staff). Key architectural challenges:
  1. *45-Day Retrospective Audit Boundary (BR02, K046):* In Vietnamese educational institutions, payroll accounting functions on 30-day monthly cycles accompanied by a 15-day reconciliation and social insurance declaration window. Modifying attendance records older than 45 days invalidates closed accounting books and violates labor compliance under Labor Code 45/2019/QH14. The system must establish a clear operational boundary between editable recent records and immutable historical archives.
  2. *Canonical Routing & Client-Side Cohort Scoping (BR09, K047):* Legacy documentation referenced separate routed URLs per class (`/demo/school/{id}/staff-attendance/`). Routing each class to separate server endpoints triggers expensive page unmounting, full reloads, and state resets. A unified single-page route with URL query parameters preserves navigation speed and enables direct bookmarking.
  3. *High-Velocity 1-Click Timekeeping vs Confirmation Dialogs (BR03, BR04, K048):* Teachers and staff arrive in large cohorts during a compressed 15-minute morning arrival window. Requiring modal confirmation dialogs for every Check-in or Check-out creates severe operational friction. Timekeeping requires single-click execution combined with inline badge editing for rapid manual corrections.
  4. *Time Badge Validation & Rollback Safeguard (BR04, DD-01):* Allowing administrators to edit recorded timestamps inline introduces the risk of accidentally deleting values or submitting malformed strings. An automated rollback safeguard is needed to prevent data corruption.
  5. *Absence Conflict Detection & Modal Mutual Exclusion (BR05, BR06, DD-03):* Unlike Check-in/out, logging an employee absence requires differentiating excused (Có phép) from unexcused (Không phép) leave. If an employee already checked in/out earlier that day, the system must issue warning `DD-03` and prevent concurrent button presses.
  6. *Multi-Role Badges & Read-Only Profile Inspection (BR08, BR11):* Faculty members frequently hold multiple concurrent roles (e.g. Quản Lý and Giáo Viên). Table rows must render all applicable badges without truncation, and clicking an employee's nickname must display a role-tailored profile modal.
  7. *Search KPI Dynamics & Nickname Sorting (BR10, BR12):* Partial keyword search matches should not be confused with school-wide presence totals; top KPI counters must hide during active search. Roster must support nickname sorting.
- **Decision:**
  1. **Strict 45-Day Retrospective Read-Only Lock:** Date selection is constrained to $\le$ today (future dates locked). Selecting past dates within 45 days displays static warning `DD-02` (*"*Chỉ được cập nhật thông tin điểm danh trong vòng 45 ngày kể từ hôm nay"*). Selecting dates $> 45$ days in the past strictly locks all table mutation controls (Check-in, Check-out, Vắng toggle, inline note edit) in read-only mode to safeguard payroll and audit integrity.
  2. **Canonical Route with URL Query Parameters:** Standardize route at `/[schoolCode]/school/staff-attendance` with query param `?classId=...` and legacy redirect from `/[schoolCode]/staff-attendance`. Selecting a class narrows the roster instantaneously via client-side Redux filtering without full page reloads.
  3. **High-Velocity 1-Click Check-In/Check-Out:** Clicking "Check-In" or "Check-Out" records current system time (`HH:mm`) immediately without confirmation dialogs, converting the button to a colored badge (Blue `#0070CE` for Check-in, Amber `#FEC020` for Check-out) with a pencil icon.
  4. **Inline Time Badge Editing with Automatic Rollback:** Clicking a recorded time badge toggles inline editing. On input blur, empty values or invalid formats trigger error toast `DD-01` (*"Thời gian không đúng định dạng."*) and automatically revert to the prior valid timestamp without data loss.
  5. **Independent Absence Confirmation Modal:** Toggling "Vắng" opens a modal requiring selection of "Có phép" or "Không phép" with an optional note. If check-in/out already exists, warning `DD-03` (*"Lưu ý: Nhân viên đã check-in/check-out lúc {giờ}"*) is displayed. Row action buttons are disabled while the modal is open.
  6. **Multi-Role Display & Read-Only Profile Modal:** Display all active role badges per employee. Clicking nickname opens a read-only modal displaying "Thông tin Quản Trị" for Admin or "Thông tin người dùng" with assigned class links for Managers/Teachers; empty fields render as `"Chưa có {trường}"`.
  7. **Search-Responsive KPI Hiding & Nickname Sorting:** When a search query is active, the top 3 KPI cards are hidden, leaving only the footer `"Tổng: N"`. The roster is sortable by nickname (A $\leftrightarrow$ Z toggle).
- **Alternatives Rejected:**
  - *Allowing retroactive attendance edits indefinitely with audit logs:* Rejected because modifying attendance after monthly payroll settlement disrupts accounting audits and violates Labor Code compliance.
  - *Separate page routes for each class cohort (`/school/6a1/staff-attendance`):* Rejected due to redundant route overhead and state reset; query parameters provide instantaneous client-side filtering while preserving URL bookmarking.
  - *Confirmation modals for every Check-in and Check-out action:* Rejected because morning roll calls require high velocity for dozens of arriving staff members.
  - *Allowing empty strings to clear recorded time badges:* Rejected to prevent accidental deletion of employee arrival/departure records; clearing input reverts to previous valid timestamp (BR04).
- **Evidence Reference:** Claims `C079`–`C083`, Evidence `E083`–`E088`, Sources `S063`–`S066`, Contradictions `K046`–`K048`.
- **Consequences:** Provides school administrators with a rapid, error-resilient daily timekeeping tool while guaranteeing timekeeping audit safety for closed payroll periods.
- **Rollback Trigger:** None.


---

## ADR-027: School Parent Handbook Architecture, 2-Tier Hierarchy, and Pruning Filter Engine

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-07
- **Context:**
  School Parent Handbook ("Sổ Tay PH") under Module 5 ("Nhà Trường") provides an institutional knowledge base and self-service FAQ repository for parents and school stakeholders. Key architectural challenges:
  1. *2-Tier Category Depth Constraint (BR01, K049):* In mobile environments, multi-tier nested folders (e.g. 4–5 levels deep) cause severe UI layout compression, horizontal overflow, and user disorientation. A strict 2-tier limit (Root Category $\rightarrow$ Sub-Category $\rightarrow$ Leaf Article) keeps institutional guidelines organized without navigation complexity.
  2. *Accordion Single-Active Expansion (BR02, K050):* Allowing multiple categories to expand simultaneously creates excessively tall pages, requiring excessive scrolling when reading policy manuals. A single-active accordion rule per sibling tier keeps the interface clean and focused.
  3. *Article-Centric Search Pruning (BR10, K051):* Parents search for specific answers (e.g., "học phí", "xe buýt", "nghỉ học"). Standard tree filtering that matches folder titles often displays empty category shells with zero relevant articles. The search engine must evaluate article titles exclusively, prune empty branches, and auto-expand matching paths.
  4. *Sibling-Only Drag-and-Drop Reordering (BR04, K053):* Unrestricted drag-and-drop across hierarchy levels creates accidental reparenting and broken category associations. Drag handles (☰) must be constrained to sub-categories and articles within their current parent container.
  5. *Article Lifecycle & Frictionless 1-Click Status Toggling (BR05, BR12, K052):* Moving an article between `draft` and `published` is a reversible administrative state change. Intrusive confirmation modals slow down editorial workflows without adding safety.
  6. *Cascading Deletion Guardrails (BR09, ST-01, ST-02):* Deleting a parent category recursively deletes all nested sub-categories and articles. An explicit warning modal explaining the recursive loss is required to prevent catastrophic content wiping.
- **Decision:**
  1. **Strict 2-Tier Category Taxonomy:** Constrain categories to Root Categories (`parentCategoryId: null`) and Sub-Categories (`parentCategoryId: rootId`). Articles are leaf nodes belonging to root or sub-categories. Inside sub-categories, only "+ Thêm bài viết" is rendered; "+ Thêm danh mục" is omitted.
  2. **Accordion Single-Active Expansion:** Within any sibling group sharing the same parent, expanding one category automatically collapses the previously open sibling category.
  3. **Article-Centric Pruning & Auto-Expansion:** Search and status filtering evaluate article titles exclusively. Branches containing no matching articles are pruned from the view; matching branches auto-expand down to the matching articles. If no articles match, the tree renders empty state `ST-03` (*"Hiện chưa có danh mục hoặc bài viết nào. Hãy bắt đầu bằng cách tạo danh mục mới"*).
  4. **Sibling-Only Drag-and-Drop:** Drag handles (☰) appear strictly on sub-categories and articles to adjust sequence within their parent container. Root categories maintain fixed administrative ordering.
  5. **1-Click Status Transitions:** Contextual `•••` action menus offer instant "Xuất bản bài viết" on drafts and "Ẩn bài viết" on published articles with immediate affirmative toast notifications.
  6. **Cascading Category Deletion Warning:** Deleting a category triggers modal `ST-01` with explicit warning: *"Lưu ý: Tất cả danh mục con và bài viết trong danh mục sẽ bị xóa"*. Deleting an individual article triggers simple confirmation modal `ST-02`.
- **Alternatives Rejected:**
  - *Arbitrary N-tier nested folder structures:* Rejected to prevent deep navigation fatigue and responsive layout degradation on mobile devices.
  - *Allowing all categories to remain open simultaneously:* Rejected because it creates excessive scrolling across dozens of policy sections.
  - *Search matching category names alone:* Rejected because it produces false-positive category nodes containing no relevant articles.
  - *Confirmation modals for every status shift:* Rejected because transitioning between draft and published is non-destructive and fully reversible.
  - *Unrestricted cross-category drag-and-drop:* Rejected to prevent accidental reparenting and structural displacement.
- **Evidence Reference:** Claims `C084`–`C088`, Evidence `E089`–`E093`, Sources `S067`–`S069`, Contradictions `K049`–`K053`.
- **Consequences:** Provides school administrators with an ergonomic, structured reference library for parent communication while guaranteeing structural stability and content protection.
- **Rollback Trigger:** None.


---

## ADR-028: School Parent Feedback Inbox Architecture, Turn-Taking State Machine, and Closure Guardrails

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-08
- **Context:**
  School Parent Feedback ("Góp Ý") under Module 5 ("Nhà Trường") provides an administrative triage, communication, and resolution cockpit for parent feedback and inquiries submitted across 8 standard school operational domains. Key architectural challenges:
  1. *Parent-Only Ticket Inception (BR09, K054):* Feedback tickets represent authentic voices and grievances from parents submitted via the mobile application. Allowing school administrators to create tickets on the web portal introduces the risk of phantom feedback and administrative falsification. The web portal must act purely as an inbox for triaging, responding, and resolving tickets.
  2. *Dual-Function Status Cards with School Year Scope (BR02, K055):* Administrators require high-level visibility into total ticket volume across the 4 statuses (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`) while needing quick single-click filtering. The cards must display global counts for the active school year while acting as filter toggles with a "Xóa bộ lọc" reset action.
  3. *Asymmetric Friction: Inline Priority vs Modal Closure (BR04, BR07, K056):* Triaging priority across dozens of items daily requires zero-click friction (inline select dropdowns). In contrast, ticket closure is a formal operational termination affecting parent SLA, necessitating explicit confirmation modal `GY-01`.
  4. *Reactive Turn-Taking State Machine (BR05, BR06, K057):* Response ownership (`waitingFor`) must alternate reliably between `school` and `parent`. Posting an admin comment sets `waitingFor` to `parent`; parent replies set it to `school`. Parent replies on closed tickets automatically reopen them (`Mở lại`).
  5. *Canonical Sidebar Navigation (K058):* In `PortalLayout.tsx`, "Góp ý" (`/school/feedback`) is positioned strictly after "Sổ tay PH" (`/school/handbook`) and before "Lịch sự kiện" (`/school/calendar`).
- **Decision:**
  1. **Strictly Parent-Only Inception:** The web admin portal provides triage, communication, and resolution controls only. Creation buttons are omitted completely; the `+` icon on `Yêu cầu mới` is strictly a visual status indicator and filter toggle.
  2. **Dual-Function KPI Status Cards:** 4 top cards display aggregate school-year totals across all 4 statuses (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`). Clicking any card filters the table roster to that status and reveals "Xóa bộ lọc"; clicking "Xóa bộ lọc" clears the filter while preserving global counts.
  3. **Asymmetric Mutation Friction:** Priority levels (`Thấp`, `Trung bình`, `Cao`, `Khẩn cấp`) and handler assignments update immediately via inline select dropdowns without confirmation dialogs. Terminal closure strictly mandates confirmation modal `GY-01` (*"Vui lòng xác nhận Đóng góp ý {tên góp ý}"*).
  4. **Reactive Turn-Taking State Machine:** Submitting a school comment automatically sets `waitingFor: parent`. Inbound parent comments set `waitingFor: school`. If a parent submits a comment on a `completed` ticket, the ticket automatically transitions to `reopened` (`Mở lại`).
  5. **Read-Only Profile Modals:** Clicking student or parent names displays read-only profile modals. Missing fields render `"Chưa có {trường}"` (e.g. `"Chưa có số điện thoại"`).
  6. **Canonical Navigation Placement:** Positioned in `PortalLayout.tsx` under NHÀ TRƯỜNG strictly after "Sổ tay PH" and before "Lịch sự kiện".
- **Alternatives Rejected:**
  - *Admin ticket creation on web:* Rejected to preserve data authenticity and statutory compliance with parent consultation mechanisms.
  - *Dynamic counter recalculation during table filtering:* Rejected because zeroing out other status cards harms administrator situational awareness.
  - *Modal confirmations for priority adjustments:* Rejected due to severe administrative friction during mass ticket triaging.
  - *Manual response state dropdown:* Rejected because human error leads to stale response tracking and neglected parent inquiries.
- **Evidence Reference:** Claims `C089`–`C093`, Evidence `E094`–`E098`, Sources `S070`–`S072`, Contradictions `K054`–`K058`.
- **Consequences:** Provides school leadership with an auditable, responsive parent communication hub with automated SLA state tracking and zero data loss.
- **Rollback Trigger:** None.


---

## ADR-029: School Academic Year Architecture, Dynamic Calendar Scoping, and Referential Deletion Omission

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-09
- **Context:**
  School Academic Year ("Năm Học") under Module 5 ("Nhà Trường") serves as the master temporal milestone repository for Vietnamese K-12 and pre-K educational institutions. It underpins time-scoping across the entire School Operating Portal, including Class Rosters, Timetables, Fee Catalogues, Billing Invoices, Meal Planning, Gradebooks, and Parent Feedback. Key architectural considerations:
  1. *Automated Current Year Evaluation (`BR01`, `K059`):* Educational institutions frequently transition between terms. Requiring operators to manually select a "Current Year" radio toggle creates operational failure when administrators forget to update flags. The system must evaluate active status dynamically based on system calendar date: `isCurrent = today >= startDate && today <= endDate`. Rows matching this condition render in bold blue typography (`#0070CE`) with a "Hiện tại" badge chip. The modal form must strictly omit any manual toggle.
  2. *Permanent Omission of Delete Functionality (`BR03`, `K060`):* Academic years function as foundational foreign keys across dozens of relational database tables. Deleting an academic year record (even via soft delete) risks corrupting historic fee invoices, attendance audit trails, and student transcript records. The table row actions column must contain strictly only the Edit button (`faEdit`); delete functionality is permanently omitted from all UI surfaces.
  3. *Flexible Free-Text Naming & Semester Sub-Periods (`BR02`, `K061`):* Schools operate on diverse annual and semester timetables. Rigid regex formats (e.g. `YYYY - YYYY`) prevent schools from declaring semester sub-terms (e.g., "Kỳ 1 năm học 2026 - 2027", "Kỳ 2 năm học 2026 - 2027"). Free-text naming accommodates flexible term semantics while pure validation prevents inverted date intervals (`endDate >= startDate`).
  4. *Minimalist 3-Field Create/Edit Form (`BR04`, `NH-01`, `K062`):* Creating an academic year must remain focused and frictionless. The form is constrained to exactly 3 required inputs: `Tên năm học` (text), `Ngày bắt đầu` (date), and `Ngày kết thúc` (date). The submit button remains disabled until all 3 fields are valid. Attaching cohorts, default fees, or holiday calendars is decoupled to their respective specialized modules.
  5. *Canonical Navigation Topology (`K063`):* Positioned in `PortalLayout.tsx` under NHÀ TRƯỜNG at canonical route `/[schoolCode]/school/academic-year` (with backward compatibility alias `/school/season`), placed strictly after "Lịch sự kiện" (`/school/calendar`), using FontAwesome icon `faCalendarCheck`.
- **Decision:**
  1. **Dynamic Calendar Evaluation:** Determine active status dynamically without user configuration. If today's date falls between start and end dates inclusive, mark the row with bold blue styling and a "Hiện tại" badge chip. Form modals strictly omit any "Hiện tại" checkbox/toggle.
  2. **Zero-Deletion Policy:** Delete controls are permanently omitted across the entire Academic Year module to guarantee relational and financial audit integrity.
  3. **Minimalist 3-Field Modal:** Limit form inputs strictly to name, start date, and end date with submit gating (`endDate >= startDate`).
  4. **Instant Client-Side Search:** Provide instant case- and diacritic-insensitive name filtering updating table rows and the footer counter `"Tổng: N"` in real time.
  5. **Canonical Sidebar Placement:** Mount at `/[schoolCode]/school/academic-year` strictly after "Lịch sự kiện" under the NHÀ TRƯỜNG sidebar group.
- **Alternatives Rejected:**
  - *Manual "Hiện tại" radio button in form modal:* Rejected due to high risk of stale current-year flags and administrative oversight during school year turnover.
  - *Soft-delete with trash recovery:* Rejected because allowing users to delete time intervals that anchor historic financial invoices and student attendance violates accounting compliance and breaks referential consistency.
  - *Complex modal with fee structures and grade cohorts:* Rejected to avoid monolithic coupling and UX bloat; fees and classes belong in their dedicated operational modules.
  - *Rigid "YYYY - YYYY" regex validation:* Rejected because it precludes semester sub-periods, summer terms, and trimesters widely used in Vietnamese schools.
- **Evidence Reference:** Claims `C094`–`C098`, Evidence `E099`–`E103`, Sources `S073`–`S075`, Contradictions `K059`–`K063`.
- **Consequences:** Provides school administrators with a lightweight, robust institutional calendar directory while safeguarding data integrity across all dependent academic and financial modules.
- **Rollback Trigger:** None.

---

## ADR-030: School Archive (Lưu Trữ) Architecture, Cold Storage Lifecycle, and Permanent Purge Safeguards

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-09
- **Context:**
  School Archive ("Lưu Trữ") under Module 5 ("Nhà Trường") functions as the centralized cold-storage directory for students who have withdrawn, transferred, or graduated. Unlike active school directories, this module governs post-enrollment lifecycle states, student profile retention, and administrative record purging. Key architectural considerations:
  1. *Unidirectional Cold-Storage Inflow (`BR01`, `K064`):* The module strictly receives records from the Học Sinh module upon student withdrawal. Enabling direct creation or manual record addition within Lưu Trữ introduces phantom student profiles and disjoint identifier sequences. Student identity generation must remain strictly centralized in the Học Sinh module.
  2. *Guarded Permanent Purge Safeguard (`BR06`, `K065`):* Deleting an archived student completely and permanently purges their records across all dependent tables (attendance history, tuition invoices, health measurements, and evaluation reports). To prevent accidental loss, the confirmation flow mandates a dedicated confirmation modal (`LT-02`) featuring distinct red hazard styling, explicit student name confirmation, and affirmative button gating, clearly distinguishing it from the friendly, non-destructive restoration dialog (`LT-01`).
  3. *Context-Aware Class Continuity on Restoration (`BR05`, `K013`, `K066`):* Restoring a student evaluates their former class: if `formerClassId` is currently active within the ongoing academic year, the student is automatically re-enrolled into that class with a success toast. If the former class has graduated, dissolved, or belongs to a past academic year, the student is restored with `classId = null` ("Chưa xếp lớp") accompanied by an amber system alert prompting administrative reassignment.
  4. *Tolerant Context Metadata Nullability (`BR02`, `K067`):* Historical migration records frequently lack archive date, archiving staff, or withdrawal reasons. The data schema models `archiveDate`, `archivedBy`, and `archiveReason` as optional (`string | undefined`). In the roster table, missing values render as clean empty cells (`—` or blank) without text errors. In the profile modal, missing notes render as "Chưa có ghi chú".
  5. *Canonical Navigation Topology (`K068`):* Positioned in `PortalLayout.tsx` under NHÀ TRƯỜNG at canonical route `/[schoolCode]/school/archive` (with legacy compatibility alias `/[schoolCode]/setting/kid/archived`), placed strictly after "Năm học" (`/school/academic-year`), using FontAwesome icon `faArchive`.
- **Decision:**
  1. **Unidirectional Inflow:** Direct student creation or addition within Lưu Trữ is prohibited; records enter exclusively via withdrawal from the Học Sinh module.
  2. **Guarded Permanent Deletion:** Enforce dedicated red hazard confirmation modal `LT-02` with explicit student name confirmation for permanent purge.
  3. **Context-Aware Class Continuity:** Inspect active status of `formerClassId` upon restoration; re-enroll if active, or default to "Chưa xếp lớp" with an alert if inactive.
  4. **Tolerant Metadata Nullability:** Model archive context attributes as optional, rendering clean empty cells for missing legacy data.
  5. **Canonical Sidebar Placement:** Mount at `/[schoolCode]/school/archive` strictly after "Năm học" under the NHÀ TRƯỜNG sidebar group.
- **Alternatives Rejected:**
  - *Direct student creation in Lưu Trữ:* Rejected to prevent split student ID sequences and bypass of standard enrollment validation in the Học Sinh module.
  - *Casual single-click delete or generic alert dialog:* Rejected due to high risk of irreversible data destruction across attendance, billing, and evaluation records.
  - *Naive re-enrollment into former class without active check:* Rejected because assigning students to closed, graduated, or past-year classes corrupts class roster consistency.
  - *Strict mandatory archive context validation:* Rejected because it would cause schema validation errors and crashes on legacy imported withdrawal records.
- **Evidence Reference:** Claims `C099`–`C103`, Evidence `E104`–`E108`, Sources `S076`–`S078`, Contradictions `K064`–`K068`.
- **Consequences:** Provides school leadership with a dedicated, safe, and auditable archive directory for withdrawn students with full historical continuity.
- **Rollback Trigger:** None.

---

## ADR-031: School Master Profile Architecture, Independent Form Submissions, and Operating Hour Guardrails

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-09
- **Context:**
  School Profile ("Trường") under Module 6 ("Cấu Hình") serves as the institutional single source of truth for an educational entity's identity, operating hours, and attendance baseline rules across the School Operating Portal. Key architectural challenges:
  1. *Read-Only Overview Dashboard vs In-Place Edit Mutation (`BR01`, `K069`):* Educational master data (name, code, educational stages, address, logo, attendance mode) affects all portal modules. Directly editable fields on the main overview screen cause accidental alterations during routine inspection. The master overview must be strictly read-only, gating mutations behind an explicit Edit icon button (`icon_edit_square`).
  2. *Two-Tab Edit Architecture & Route Synchronization (`BR06`, `K070`):* Institutional identity attributes (name, address, email, phone, logo) and operational parameters (weekly bell schedule, late arrival/departure thresholds) have different cognitive scopes and update cadences. Organizing the edit interface into two routed tabs ("Thông tin trường" `?tab=info` and "Giờ hoạt động" `?tab=weekdays`) cleanly isolates these concerns while supporting browser history, bookmarks, and deep links.
  3. *Independent Sub-Form Submissions (`BR07`, `BR10`, `BR11`, `K071`):* On the "Giờ hoạt động" tab, operating hours (Monday–Saturday opening/closing intervals) and attendance calculation rules (late arrival threshold, late departure toggle) serve distinct operational workflows. Daily bell hours are managed by operations/facilities staff, while attendance thresholds and fee surcharge links impact academic and billing policies. Coupling these into a single monolithic submit action causes accidental overwrite of unrelated settings. Each sub-form must have its own independent "Cập nhật" action.
  4. *Fixed 5-Minute Stepped Intervals (`BR08`, `K072`):* Free-text time input or arbitrary 1-minute pickers cause timing desynchronization and validation parsing errors across bell schedules. Opening and closing times for Monday through Saturday are strictly constrained to 5-minute fixed increments (`06:00` to `18:00`).
  5. *Static Non-Operational Sunday Rest Designation (`BR09`, `K073`):* Under Vietnamese education norms and labor standards, Sunday is a universal day of rest. Enabling time pickers for Sunday invites accidental misconfigurations and phantom weekend attendance alerts. Sunday is rendered as a static grey non-operational tag without input controls; extracurricular weekend clubs are managed separately under Class Management.
  6. *Decoupled Late Departure Fee Linkage (`BR11`, `K074`):* Late departure overtime fees belong strictly to Fee Settings (`/setting/fee`). Duplicating monetary surcharge configurations inside the School Profile creates split-brain pricing records. The profile module provides an on/off toggle and a direct contextual link ("tại đây") to Tuition Fee Settings.
  7. *Canonical Navigation Topology (`K075`):* In `PortalLayout.tsx`, "Trường" (`/setting/school`) is positioned first under the `CẤU HÌNH` sidebar menu group before "Học phí" (`/setting/fee`), using FontAwesome icon `faSchool`. Legacy alias `/school/info` redirects cleanly.
- **Decision:**
  1. **Strictly Read-Only Overview:** The main dashboard at `/[schoolCode]/setting/school` displays complete institutional profile, hours, and attendance rules in read-only cards, requiring an explicit click on `icon_edit_square` to navigate to `/setting/school/edit`.
  2. **Two-Tab URL-Synchronized Edit Interface:** Provide tabbed navigation between `?tab=info` (school demographics, logo, contact, default notification language) and `?tab=weekdays` (operating hours & attendance thresholds).
  3. **Independent Sub-Form Mutations:** Isolate weekly operating hours and attendance rules into separate forms with autonomous submit buttons and separate Redux mutation actions (`updateOperatingHours`, `updateAttendanceRules`).
  4. **5-Minute Stepped Time Pickers:** Constrain all opening and closing time pickers strictly to 5-minute increments between `06:00` and `18:00`.
  5. **Static Sunday Non-Operational Indicator:** Sunday renders as an inactive grey badge without input pickers.
  6. **Decoupled Overtime Surcharge Navigation:** Late departure toggle reveals a direct hyperlink to `/setting/fee` for fee rate configuration.
  7. **Unsaved Changes Navigation Interception:** Enforce confirmation modal `TR-02` whenever an administrator attempts to navigate away with unsaved modifications in either tab.
  8. **Canonical Navigation Placement:** Mount at `/[schoolCode]/setting/school` positioned first under the `CẤU HÌNH` group in `PortalLayout.tsx`.
- **Alternatives Rejected:**
  - *In-place editable fields on the overview dashboard:* Rejected because accidental keystrokes by administrators during routine viewing can inadvertently corrupt critical institutional contact info or operating hours.
  - *Monolithic single-form submission for both operating hours and attendance thresholds:* Rejected because facilities adjustments to daily bell schedules should not require re-validating or risking accidental changes to attendance grace periods.
  - *Free-text time input strings:* Rejected to prevent syntax errors, invalid timestamps, and inconsistent time formats across school reports.
  - *Configurable Sunday operating hours:* Rejected to enforce statutory rest standards and prevent unwanted weekend attendance notifications.
  - *Configuring overtime monetary rates directly inside School Profile:* Rejected to prevent dual sources of truth and billing discrepancies with Tuition Fee Management.
- **Evidence Reference:** Claims `C104`–`C108`, Evidence `E109`–`E113`, Sources `S079`–`S081`, Contradictions `K069`–`K075`.
- **Consequences:** Establishes a rock-solid, auditable foundation for institutional identity, school-wide bell schedules, and attendance evaluation thresholds without risking accidental mutations or billing desynchronization.
- **Rollback Trigger:** None.

---

## ADR-032: Multi-Role Account Management, Super-Admin Privilege Locking, and CSDL Synchronization Safeguards

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-09
- **Context:**
  Account Management ("Tài khoản") under Module 6 ("Cấu hình") governs administrative, management, teaching, staff, and parent user accounts, as well as enrolled student login accounts across the School Operating Portal. Key architectural challenges:
  1. *Dual-Tab Navigation Architecture (`BR01`, `K076`):* User Accounts and Student Accounts have fundamentally different domain models, lifecycle workflows, and user personas. Conflating them into a single table or form causes cognitive overload and state coupling. They must be partitioned into two routed tabs: "Người Dùng" (`/[schoolCode]/setting/users`) and "Học Sinh" (`/[schoolCode]/school/kid/accounts` / `?tab=students`) with URL query synchronization.
  2. *Super-Admin Privilege Escalation Lock (`BR03`, `BR04`, `K077`):* Creating or modifying Super-Admin accounts from the tenant school portal introduces severe privilege escalation and multi-tenant security risks. The `Admin` role checkbox is permanently disabled on user creation forms (`BR04`), and existing Admin accounts omit Edit and Delete actions entirely, exposing only a read-only View (eye) action (`BR03`).
  3. *CSDL Sở National Database Synchronization Safeguards (`BR05`, `BR06`, `K078`):* Accounts imported or synchronized from the provincial Department of Education database ("CSDL Sở") must preserve upstream integrity. The Edit form presents a yellow warning banner and locks the "Họ và tên" input. Direct row-level status toggles are rejected with system error banner `TK-03`, preventing divergence from official educational records.
  4. *Asymmetric Status Confirmation Mechanics (`BR06`, `BR07`, `K079`):* Row-level status toggling on the table roster applies immediately with auto-dismissing toast `TK-06` for operational agility when deactivating departed personnel. In contrast, full form edits require confirmation modal `TK-05` before committing changes to prevent accidental role or credential modifications.
  5. *Decoupled Email & Password Security Workflows (`BR08`, `BR09`, `K080`):* Inline password and email edits in standard forms risk accidental exposure and typo-induced account lockouts. Complying with Decree 13/2023/NĐ-CP, email editing requires a dedicated affirmative modal, and password resets are decoupled to a dedicated security sub-page (`/password`) under `BẢO MẬT` with explicit session revocation warnings.
  6. *Dynamic Role-Dependent Disclosure (`BR10`, `BR12`, `BR13`, `K081`):* Staff role requires specific functional capabilities (Attendance, Accounting, Announcements, Care) with validation `TK-02`; Management role requires Assigned Classes; Staff/Teacher roles reveal collapsible Additional Info.
  7. *Student Account 1-to-1 Mapping & Validation (`BR19`, `BR20`, `BR21`, `K082`):* Student accounts map strictly 1-to-1 to enrolled students in the directory. Username creation enforces alphanumeric and email regex validation (`/^[a-zA-Z0-9_\-\.]+$/`) with green helper guidance.
  8. *Canonical Sidebar Placement (`K076`):* Positioned third under `CẤU HÌNH` in `PortalLayout.tsx` strictly after "Học phí" (`/setting/fee`) and before "Thông báo", using FontAwesome icon `faUserShield`.
- **Decision:**
  1. **Dual-Tab URL-Synchronized Interface:** Implement dedicated routed tabs for "Người Dùng" and "Học Sinh" with synchronized URL queries.
  2. **Super-Admin Protection:** Permanently disable the Admin role checkbox on create forms; render only View actions for existing Admin accounts.
  3. **CSDL Sở Immutability Safeguards:** Display warning banners and lock full name inputs on edit; reject row status toggles with error banner `TK-03`.
  4. **Asymmetric Status Confirmation:** Allow immediate row status toggling with toast `TK-06`; enforce confirmation modal `TK-05` on form submission.
  5. **Decoupled Security Sub-Views:** Isolate email change to a dedicated modal with RFC 5322 regex; isolate password resets to a dedicated sub-view under `BẢO MẬT`.
  6. **Conditional Dynamic Role Fields:** Mount role-specific fields dynamically upon checkbox selection (Staff Functions, Assigned Classes, Additional Info).
  7. **Strict Student 1-to-1 Mapping:** Manage student login accounts exclusively linked to active enrolled students, enforcing regex validation on usernames.
  8. **Canonical Navigation Placement:** Mount at `/[schoolCode]/setting/users` positioned third under `CẤU HÌNH` in `PortalLayout.tsx`.
- **Alternatives Rejected:**
  - *Unified single table for users and students:* Rejected due to divergent personas, attributes, and search filters.
  - *Allowing portal admins to provision Admin accounts:* Rejected to prevent multi-tenant privilege escalation and security breaches.
  - *Allowing local overrides of CSDL Sở full names and status:* Rejected to prevent data corruption and divergence from national ministry records.
  - *Mandatory modal confirmation for row-level status toggles:* Rejected to maintain administrative agility during bulk deactivation.
  - *Inline password input fields in basic user edit forms:* Rejected due to severe credential security risks under Decree 13/2023/NĐ-CP.
- **Evidence Reference:** Claims `C109`–`C115`, Evidence `E114`–`E120`, Sources `S082`–`S084`, Contradictions `K076`–`K082`.
- **Consequences:** Enforces multi-tenant security, prevents upstream sync conflicts, and provides a clear, compliant role-based account management interface.
- **Rollback Trigger:** None.





---

## ADR-033: Student Facial Recognition Biometric Registration, Demographic Immutability, and Privacy Safeguards

- **Status:** Approved
- **Deciders:** Sophia Butler (Product Owner), Alan (Tech Lead), David (Systems Architect), Ada (QA Approver)
- **Date:** 2026-10-09
- **Context:**
  Face Recognition Management ("Nhận Diện" / "Đăng ký nhận diện") under Module 6 ("Cấu hình") serves as the centralized master authority for registering, updating, and auditing student biometric facial reference images across the School Operating Portal. Biometric templates registered here provide foundational baseline vectors for automated gate attendance (`Module 1: Điểm danh`) and AI photo tagging in class albums (`Module 1: Thư viện`). Key architectural challenges:
  1. *Centralized Biometric Registration Authority (`BR01`, `K084`):* Ad-hoc photo uploading inside daily operational screens produces fragmented, duplicate, or non-compliant images. Centralizing biometric registration in `setting/face-recognition/` ensures systematic enrollment coverage tracking, standardized front-facing images, and dedicated regulatory oversight.
  2. *Canonical Navigation Topology (`K083`):* Positioned fourth under `CẤU HÌNH` in `PortalLayout.tsx` at canonical route `/[schoolCode]/setting/face-recognition`, strictly following "Trường" (`/setting/school`), "Học phí" (`/setting/fee`), and "Tài khoản" (`/setting/users`), using FontAwesome icon `faCamera`.
  3. *Demographic Attribute Immutability & Read-Only Binding (`BR03`, `K085`):* Registration and edit modals display 4 core student demographic attributes: Biệt danh, Giới tính, Ngày sinh, and Lớp học (with Lớp học rendered as a link to class details). These fields are strictly read-only and bound to master student records in `school/kid`. Mutating student personal demographics is prohibited inside the biometric module to prevent data divergence.
  4. *Mandatory New File Upload for Submit Activation (`BR04`, `BR05`, `K086`):* Both the Registration Modal and the Edit Modal enforce that the submit button ("Đăng ký") is disabled by default. In registration mode, empty submissions are rejected. In edit mode, the student's current photo is pre-rendered in the preview box (`BR05`), but viewing the existing photo is explicitly insufficient to enable saving; an administrator must select a *new* image file before the submit button enables, eliminating accidental no-op server requests.
  5. *State-Driven Action Column Duality (`BR01`, `BR02`, `K087`):* Roster rendering dynamically adapts based on registration status:
     - Unregistered: Photo and Date columns display `-`; Action column displays a single circular `+` button with tooltip "Đăng ký ảnh nhận diện".
     - Registered: Photo column displays a real thumbnail; Date displays `DD/MM/YYYY`; Action column displays Edit (pencil) and Delete (`X`) buttons.
  6. *Guarded Biometric Deletion with Explicit Student Name Affirmation (`BR06`, `K088`):* In compliance with Vietnam's Personal Data Protection Decree No. 13/2023/NĐ-CP, purging student biometric facial data is an irreversible operation that disables automated attendance. Deletion triggers a dedicated confirmation dialog that explicitly articulates the target student's full name: *"Vui lòng xác nhận xóa thông tin nhận diện của học sinh {Họ tên}"*. Confirming clears the photo and registration date, immediately reverting the row to unregistered status.
  7. *Multi-Factor Conjunction Search & Dynamic Counters (`BR07`, `BR08`, `BR09`):* The toolbar provides text search by student name/code, class selection, and registration status ("Đã đăng ký nhận diện" vs "Chưa đăng ký nhận diện"), evaluated concurrently with AND logic, while the footer dynamically updates `Tổng: N`.
- **Decision:**
  1. **Canonical Route & Placement:** Mount at `/[schoolCode]/setting/face-recognition`, positioned fourth in `CẤU HÌNH` with icon `faCamera`.
  2. **Centralized Biometric Authority:** Manage all student face templates centrally to feed downstream attendance and media tagging pipelines.
  3. **Strict Demographic Read-Only Binding:** Display Nickname, Gender, DOB, and Class link as read-only fields extracted from student master records.
  4. **Mandatory New File Activation:** Enforce disabled submit button state until a new image file is chosen in both create and edit modals.
  5. **State-Driven Action Column Duality:** Render `+` for unregistered and pencil + delete for registered students.
  6. **Guarded Deletion Dialog:** Explicitly state the target student's full name in the deletion modal before clearing biometric data.
  7. **Concurrent Multi-Factor Filtering:** Support concurrent filtering across name/code, class, and registration status with dynamic `Tổng: N` tallying.
- **Alternatives Rejected:**
  - *Fragmented ad-hoc photo uploads inside attendance rosters:* Rejected due to high risk of poor photo quality, duplicate storage, and lack of school-wide coverage auditing.
  - *Permitting student demographic edits inside the face modal:* Rejected to prevent data synchronization discrepancies with master student records in `school/kid`.
  - *Allowing save in edit mode without choosing a new photo:* Rejected because re-saving existing photos is a no-op that risks triggering redundant facial indexing pipelines.
  - *Generic deletion confirmation dialog without student name:* Rejected due to sensitive personal data protection requirements under Decree 13/2023/NĐ-CP.
- **Evidence Reference:** Claims `C116`–`C121`, Evidence `E121`–`E126`, Sources `S085`–`S087`, Contradictions `K083`–`K088`.
- **Consequences:** Provides school leadership with an ergonomic, secure, and compliant biometric facial enrollment console that safeguards data privacy while ensuring high-accuracy automated attendance.
- **Rollback Trigger:** None.

---

### ADR-034: Settings Feature Flags, Activity Moderation Toggles, and Inline Academic Term Management
- **Status:** Accepted
- **Context:**
  The School Operating Portal requires a centralized administrative cockpit within M6: Cấu hình to manage school-wide operational switches and instructional calendar milestones. Key architectural and UX considerations include:
  1. *Independent Two-Route Architecture (`BR01`, `K089`):* Rather than an in-memory client-side tab state machine with a shared URL, the module implements independent routed endpoints matching `setting/school`: Tab Hoạt Động at `/[schoolCode]/setting/activity/` and Tab Học Kỳ at `/[schoolCode]/setting/period/`, with an alias at `/[schoolCode]/setting/features` redirecting to `/setting/activity`. This ensures clean browser history, direct bookmarking, and zero dirty-state leakage between tabs.
  2. *Strict Toggle Decoupling (`BR02`, `K090`):* Tab Hoạt Động hosts two independent switches: "Bình luận" (`allowComments`) and "Duyệt bình luận" (`requireCommentModeration`). Verified directly from legacy system behavior, turning OFF "Bình luận" does NOT disable, hide, or reset "Duyệt bình luận". Both toggles remain completely interactive and persist independent boolean values in the school configuration.
  3. *Dirty-State Submit Invariant (`BR03`, `K091`):* The "Cập nhật" action button on Tab Hoạt Động remains disabled upon initial load and activates if and only if at least one toggle diverges from the saved state. Submitting persists changes, displays a toast notification, and resets the button to disabled, preventing redundant no-op requests.
  4. *Statutory Two-Term Ceiling (`BR04`, `BR05`, `K092`):* In accordance with Ministry of Education and Training (MoET GDPT 2018) regulations, Vietnamese schools operate on a 2-semester academic year model (Học kỳ 1 and Học kỳ 2). The dropdown defaults to the ongoing school year marked `(Hiện tại)`, and the "+ Thêm học kỳ" button automatically disables as soon as 2 terms exist.
  5. *Pure Inline Table Row Editing with Mutual Exclusion Locking (`BR06`, `BR07`, `BR08`, `K093`, `NFR01`, `NFR02`):* To eliminate modal clutter and accelerate date setup, term creation and editing execute directly inside table rows with green checkmark (Save) and gray X (Cancel) icon buttons. While any row is in edit or addition mode, all other row edit buttons and "+ Thêm học kỳ" are strictly disabled, preventing state collisions.
  6. *Permanent Saved Terms (No Deletion) & Clean Empty State (`BR09`, `BR10`, `K094`):* Saved academic terms serve as fundamental foreign key anchors across timetables, gradebooks, attendance, and fee schedules; therefore, deletion controls are completely omitted from saved rows. Academic years with zero registered terms display a dedicated `"Chưa có học kỳ"` empty state row.
- **Decision:**
  1. **Two-Route Topology:** Mount Tab Hoạt Động at `/[schoolCode]/setting/activity` and Tab Học Kỳ at `/[schoolCode]/setting/period`, positioned fifth under `CẤU HÌNH` with icon `faSlidersH`.
  2. **Decoupled Activity Switches:** Maintain independent toggles for comments and comment moderation without cascading disablement.
  3. **Dirty-State Submit Invariant:** Enforce disabled "Cập nhật" button state until toggles diverge from saved baseline.
  4. **Two-Term Statutory Cap:** Dynamically disable "+ Thêm học kỳ" when an academic year contains 2 terms.
  5. **Pure Inline Row Editing:** Implement in-table editing with green tick and gray X buttons, guarded by single-row mutual exclusion.
  6. **Deletion Omission for Saved Terms:** Provide only Edit controls for saved terms; render `"Chưa có học kỳ"` row for empty school years.
- **Alternatives Rejected:**
  - *Single-page client-side tab switcher with shared URL:* Rejected because it prevents deep-linking, breaks browser history, and risks leaking uncommitted dirty state between unrelated tabs.
  - *Cascading toggle disablement (turning OFF comments disables moderation):* Rejected because it contradicts verified legacy system behavior and prevents administrators from configuring moderation policies in advance of enabling comments.
  - *Modal popups for term creation and editing:* Rejected because in-place table row editing provides a significantly faster, more cohesive UX for simple 4-field records.
  - *Allowing deletion of saved academic terms:* Rejected to eliminate the risk of cascading foreign key orphans and data corruption across timetables, attendance, and gradebooks.
- **Evidence Reference:** Claims `C122`–`C127`, Evidence `E127`–`E132`, Sources `S088`–`S090`, Contradictions `K089`–`K094`.
- **Consequences:** Provides school administrators with a lightweight, ergonomic, and compliant configuration interface for activity interaction policies and academic calendar milestones, ensuring referential integrity across the operating portal.
- **Rollback Trigger:** None.

---

### ADR-035: Monolithic Institutional Notification Configuration, Multi-Channel Asymmetry, and Calendar Overflow Fallback
- **Status:** Accepted
- **Context:**
  The School Operating Portal requires a centralized administrative cockpit within M6: Cấu hình to manage school-wide notification dispatch policies across attendance, birthdays, tuition, review queues, and parent updates. Key architectural, operational, and UX requirements include:
  1. *Monolithic Institutional Configuration (`BR01`, `K095`):* Unlike the Fee Configuration module (`/setting/fee`) which subdivides into multiple independent child forms, Notification Settings governs 5 interconnected operational domains (Điểm danh, Sinh nhật, Học phí, Khác, Phụ huynh) via a single unified form with a single bottom "Cập nhật" action button.
  2. *Guarded Confirmation Modal Submission (`BR02`, `K096`):* Submitting notification configurations carries school-wide operational impact. Clicking "Cập nhật" triggers a mandatory confirmation modal dialog *"Vui lòng xác nhận thay đổi cấu hình thông báo của trường!"* (Hủy bỏ / Xác nhận). Confirming commits all 5 sections simultaneously; canceling dismisses the modal while preserving all working unsaved edits in the form.
  3. *Institutional Scope & 31st-Day Calendar Overflow Fallback (`BR03`, `K097`):* The top informational banner communicates school-wide applicability, multi-platform push (Web + Mobile App), and the non-negotiable calendar overflow fallback rule: reminders scheduled on the 29th, 30th, or 31st automatically roll to the final calendar day of shorter months (e.g. 28th/29th in February), preventing silent drop of monthly recurring alerts.
  4. *Birthday Reminder Schedule Inheritance (`BR04`, `K098`):* Section 2 (Sinh nhật) provides a shared schedule configuration row (Day 1-31, Time default 09:00) without an independent toggle switch; child switches for Teachers and School Admins inherit this exact schedule when toggled ON.
  5. *Multi-Channel Delivery Asymmetry (`BR05`, `K099`):* Dual channel delivery (Web/App and Email) is intentionally restricted to Section 4 administrative review items ("Hoạt động chờ duyệt" and "Nhật ký hằng ngày"). All other notification events deliver exclusively via Web and Mobile App push notifications to avoid email inbox exhaustion.
  6. *Read-Only Operational Hours & Extracurricular Class Scoping (`BR06`, `BR07`, `K100`, `K101`):* Fixed institutional times (17:00 evening pickup alert and 20:00 journal review) render in read-only inputs with muted backgrounds to prevent accidental disruptions. Section 1 extracurricular attendance alerts support scoping to "Tất cả các lớp" or specific classes.
  7. *Directional Tuition Reminders & Parent Action Highlighting (`BR08`, `BR10`, `K102`, `K103`):* Tuition overdue reminders combine directional timing ("Trước hạn" vs "Sau hạn") with integer days (1-31). Parent action trigger verbs ("điểm danh", "hoạt động", "album", "hình/video") are rendered in distinct bold orange typography (`#EA580C`) for rapid visual scanning.
  8. *Canonical Navigation Placement (`K104`):* Mounted sixth under sidebar group `CẤU HÌNH` in `PortalLayout.tsx` at `/[schoolCode]/setting/notification/`, strictly following "Tính năng" with icon `faBell`.
- **Decision:**
  1. **Monolithic Form Architecture:** Structure Notification Settings as a single composite form spanning all 5 sections, bound to a single "Cập nhật" action button.
  2. **Guarded Modal Confirmation:** Enforce modal dialog confirmation before persisting state, preserving working edits upon dismissal.
  3. **Calendar Overflow Fallback:** Guarantee recurring monthly reminders trigger on the final day of shorter months when set to dates 29–31.
  4. **Shared Birthday Schedule Inheritance:** Bind sub-options to a shared schedule row without an independent toggle.
  5. **Asymmetric Channel Delivery:** Confine dual Web/Email toggles strictly to Section 4 administrative queues; route all other events to Web/App push.
  6. **Read-Only Operational Constraints:** Protect 17:00 and 20:00 milestones with read-only styling; provide extracurricular class selector.
  7. **Directional Tuition Scheduling & Orange Styling:** Support before/after tuition due-date offsets; apply `#EA580C` orange styling to parent action verbs.
  8. **Canonical Route Placement:** Mount at `/[schoolCode]/setting/notification` sixth under `CẤU HÌNH` with icon `faBell`.
- **Alternatives Rejected:**
  - *Fragmenting into 5 decoupled route tabs or sub-pages:* Rejected because notification policies represent a unified institutional profile that administrators review and approve holistically.
  - *Direct mutation without confirmation modal:* Rejected due to high operational disruption risk when toggling school-wide push notifications.
  - *Discarding form state on confirmation cancel:* Rejected because administrators need the ability to inspect modal wording and return to fine-tuning without losing input progress.
  - *Independent toggle on Birthday schedule row:* Rejected because it introduces ambiguous configuration states where the schedule is toggled OFF while recipient sub-options remain ON.
  - *Enabling Email switches across all sections:* Rejected to avoid flooding parent and teacher email inboxes with high-volume operational events.
- **Evidence Reference:** Claims `C128`–`C137`, Evidence `E133`–`E142`, Sources `S091`–`S093`, Contradictions `K095`–`K104`.
- **Consequences:** Delivers a robust, predictable, and user-friendly institutional notification cockpit that prevents spam, protects operational milestones, and guarantees delivery integrity across calendar edge cases.
- **Rollback Trigger:** None.

---

### ADR-036: Strict Single Cash Option for Manual Tuition Payment Confirmation
- **Status:** Accepted
- **Context:**
  In the Tuition Billing (`/school/fee`) module, accountants and school staff can click "Xác nhận thanh toán" to record payments on outstanding invoices. Previously in ADR-007, `ManualPaymentModal` presented three payment options: `Tiền mặt` (Cash), `QR ECOPay`, and `Ví Finviet`.
  However, digital electronic payments (`QR ECOPay`, `Ví Finviet`, bank transfers) are processed and reconciled automatically via webhook and automated gateway reconciliation (`/reconciliation`), appending immutable automated payment records ("Xác nhận tự động").
  Allowing staff to manually select electronic payment methods in the manual payment modal created a significant accounting risk of double-counting, reconciliation mismatch with bank logs, and circumvention of automated audit trails.
- **Decision:**
  1. **Strict Single Cash Option:** When users click "Xác nhận thanh toán" (in `ManualPaymentModal` / SlideOver), the dropdown "Hình thức thanh toán" offers strictly and exclusively 1 option: `Tiền mặt` (`tien_mat`).
  2. **Automated Channel Protection:** Online digital payment methods (QR ECOPay, Ví Finviet, chuyển khoản ngân hàng) remain exclusive to automated payment gateways and webhook reconciliation.
  3. **Toast Notification Preservation:** Clicking "Lưu xác nhận" continues to dispatch standard success toast notification (`addToast`) and appends the manual payment record into `paymentHistory`.
- **Alternatives Rejected:**
  - *Keep multiple payment methods in manual modal:* Rejected because manual entry of digital methods bypasses the payment gateway and causes audit discrepancies with bank statements.
- **Consequences:** Eliminates manual misclassification of online payment flows, protects financial audit integrity, and streamlines user experience by removing redundant dropdown options.
- **Rollback Trigger:** None.

---

### ADR-037: Official Standard Invoice Print Template ("PHIẾU BÁO THU TIỀN") & Print Layout Isolation
- **Status:** Accepted
- **Context:**
  When school accountants or parents clicked "In phiếu" on an invoice (`/school/fee/[id]`), the legacy web view printed the entire portal shell (AppHeader, Sidebar navigation, action buttons, cancellation banners, interactive VietQR copy controls, and payment history). Furthermore, the invoice paper sheet lacked standard corporate branding, official terminology, required legal/accounting columns, and clear payment instructions.
  Production benchmark analysis (`ecoschool.com.vn/34FINVIET/school/invoice/info/1679/`) established the exact Single Source of Truth (SSOT) for the official printed invoice:
  1. *Title Standardization:* Standardized as **`PHIẾU BÁO THU TIỀN`** (replacing previous "PHIẾU BÁO HỌC PHÍ VÀ DỊCH VỤ") accompanied by `Mã hóa đơn: {invoiceNo}` centered prominently below the header.
  2. *Header Trio:* Left-aligned ECO Brand Logo (`EcoBrandLogo`), centered title + invoice number, and right-aligned VietQR payment code square with caption *"Quét mã QR để thanh toán"*.
  3. *Metadata Block:* Structured as clean single lines on the left: `Trường FINVIET`, `Địa chỉ: 34 Hoàng Việt, Phường Tân Sơn Nhất, TP.HCM`, `Tên học sinh`, `Mã học sinh`, `Lớp`, and `Kỳ phí: MM/YYYY`.
  4. *7-Column Standard Table:* Standardized columns: `STT` (index), `Nội dung` (line item name & note), `ĐVT` (Unit: Tháng, Ngày, Bộ, Năm...), `Số tiền (VNĐ)` (unit price), `Số lượng` (quantity), `Khấu trừ / Miễn giảm` (deductions), `Thành tiền (VNĐ)` (line amount), concluding with a bold `Tổng cộng` row spanning columns 1-6.
  5. *Official Notes (Ghi chú):* Explicit guidance for mobile banking / e-wallet QR scan, announcement of the **ECO Me app** for transaction fee waiver and deferred installment tuition payment ("thanh toán học phí trả sau"), and customer support hotline `1900 9005`.
  6. *Tripartite Signature Block:* Right-aligned date `Ngày ... tháng ... năm ...`, and 3 balanced signature columns: `Kế toán`, `Thủ quỹ`, `Hiệu trưởng` with dedicated signing space.
  7. *Print Isolation (@media print):* Dedicated CSS `@media print` rules enforcing A4 portrait sizing (`@page { size: A4 portrait; margin: 8mm 12mm; }`), completely hiding navigation chrome (`.ecomd-header`, `.ecomd-sidebar`, `.ecomd-rail`), breadcrumbs, interactive tools, and web-only settlement panels (`.no-print`, `.screen-only`). Exactly 1 sheet of paper is outputted without spilling over to page 2.
- **Decision:**
  Adopt the standardized 7-column layout, header trio, ECO Me credit guidelines, 3-signature block, and `@media print` stylesheet isolation across all invoice detail and print preview views (`InvoiceDetailView.tsx` & `globals.css`).
- **Alternatives Rejected:**
  - *Keep web layout in print mode:* Rejected because browser print preview was completely distorted, printing sidebar links and button chrome across multiple pages.
  - *6-column table without ĐVT (Unit):* Rejected because Vietnamese educational accounting standards require explicit measurement units (e.g. Tháng for tuition, Ngày for meals, Bộ for uniforms).
- **Consequences:** Provides school finance departments and parents with a professional, legally compliant, pixel-perfect A4 invoice printout matching official production systems.
- **Rollback Trigger:** None.

