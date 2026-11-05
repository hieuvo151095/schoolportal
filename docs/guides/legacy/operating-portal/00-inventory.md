# Operating Portal — Module Inventory (Phase 1)

**Portal:** Eco School Operating Portal (Finviet / SOHA)
**URL:** https://soha-web-xzs5b3ra6a-as.a.run.app
**Logged in as:** Admin SOHA (`adminsoha@demo.com`), school code `demo` — Trường THCS Demo Soha
**Role tested:** School Admin only. Teacher/Parent-facing views were not accessible from this account (see Open Questions).

This is a first-pass inventory: every menu item found in the left sidebar, with a one-line purpose. Deep dives (wireframes, screenshots, business rules) come in Phase 2.

---

## Tổng Quan (Overview)
| Module | URL | Purpose |
|---|---|---|
| Tổng quan | `/demo/overview/` | Landing dashboard: school-wide KPIs (student/class/staff/active-parent counts), fee collection summary, today's attendance/absence/pickup/medicine/feedback activity, photo & video storage quota, activity-moderation queue, announcement feed, top-teacher "likes" leaderboard, frequently-absent students, and birthdays this month. |

## Vận Hành (Operations)
| Module | URL | Purpose |
|---|---|---|
| Điểm Danh | `/demo/class/{classId}/attendance/` | Daily per-class check-in/check-out roster — temperature, health notes, pickup confirmation. |
| Hoạt Động | `/demo/class/{classId}/activity/` | Per-class log of daily activities/lessons posted to parents. |
| Thư Viện | `/demo/class/{classId}/media/` | Class photo/video albums; includes AI face-recognition tagging of students in uploaded images. |
| Trao Đổi | `/demo/conversations/group/` | Direct-message threads with individual parents, custom groups, or whole classes. |
| Báo Cáo → Điểm Danh | `/demo/reports/attendance/` | Monthly attendance calendar per class; edit excused/unexcused absences; late-pickup fee tracking. |
| Báo Cáo → Mở Rộng | `/demo/reports/extended/` | Generates reports from configurable templates, filtered by class/status/date range. |

## Học Tập (Academics)
| Module | URL | Purpose |
|---|---|---|
| Thời Khóa Biểu | `/demo/school/schedule/` | Build/upload weekly or term class timetables; tracks send history to parents. |
| Bài Tập | `/demo/school/assignment/` | Homework assignments by class/subject with due dates and submission status. |
| Điểm & Đánh Giá | `/demo/school/scoreboard/` | Gradebook / evaluation sheets, browsable by grade level and class. |

## Tài Chính (Finance)
| Module | URL | Purpose |
|---|---|---|
| Học Phí | `/demo/school/fee/` | Per-student invoice list (tuition, meals, bus, activities, etc.) with payment status and history. |
| Đối Soát | `/demo/school/reconciliation/` | Reconciliation of payment sessions/transactions (totals, transaction counts). |
| Khoản Phí | `/demo/school/school-fees/` | Master catalog of fee line-items that can be assigned to students. |
| Quản Lý Học Phí | `/demo/school/tuition-management/` | Per-class fee schedule — which fee items and amounts apply to each class. |
| Khoản Chi | `/demo/school/expenses/` | Expense/disbursement vouchers, categorized, with a cancel-voucher flow. |
| Báo Cáo → Học Phí | `/demo/reports/fee/overview/` | Fee-collection-rate overview by class (paid / partial / unpaid). |

## Nhà Trường (School Administration)
| Module | URL | Purpose |
|---|---|---|
| Học Sinh | `/demo/school/kid/` | Student roster; also handles year-transfer and class-transfer of a student, and per-student notes. |
| Giáo Viên | `/demo/school/teacher/` | Teacher/staff roster with staff codes and contact info. |
| Lớp Học | `/demo/school/class/` | Class list (curricular vs. extracurricular), assigned teacher, activity counts, lesson-set detail. |
| Môn Học | `/demo/school/subject/` | Subject catalog, scoped by education level (TH/THCS/THPT/GDTX) and school year. |
| Khối Lớp | `/demo/school/grades/` | Grade-level definitions (code, education level, linked classes, student counts). |
| Bảng Thông Tin | `/demo/announcement/` | School/class announcement board — create and send notices to parents. |
| Bình Chọn | `/demo/school/poll/` | Poll/voting campaigns sent to parents, filterable by status and class. |
| Thực Đơn | `/demo/school/menu/` | Weekly meal-menu builder per class (max 8 weeks ahead), upload via file, send history. |
| Điểm Danh NV | `/demo/school/staff-attendance/` | Staff check-in/check-out log, filterable by role. |
| Sổ Tay PH | `/demo/school/handbook/` | Categorized handbook/FAQ content published to parents. |
| Góp Ý | `/demo/school/feedback/` | Parent feedback/complaint inbox with type, priority, and assignee filters. |
| Lịch Sự Kiện | `/demo/setting/holidays/` | Year calendar of holidays and school events. |
| Năm Học | `/demo/setting/season/` | School-year (term) definitions with date ranges; one marked "current". |
| Lưu Trữ | `/demo/setting/kid/archived/` | Archived (withdrawn) students list. |

## Cấu Hình (Configuration)
| Module | URL | Purpose |
|---|---|---|
| Trường | `/demo/school/info/` | School master profile — name, address, contact, default notification language, attendance mode. |
| Tài Khoản | `/demo/setting/users/` | Staff/admin user accounts and roles; includes a "CSDL Sở" (provincial database) filter. |
| Học Phí | `/demo/setting/fee/` | Invoice config: QR payment code, Sepay auto-payment integration, e-invoice/tax settings. |
| Nhận Diện | `/demo/setting/face-recognition/` | Register/manage student face-ID photos used for recognition-based attendance. |
| Tính Năng | `/demo/setting/activity/` | Feature-module on/off toggles for the school. |
| Thông Báo | `/demo/setting/notification/` | School-wide notification schedule/rules (applies to all accounts, all platforms). |

## Other
| Module | URL | Purpose |
|---|---|---|
| Thông báo hệ thống | `/demo/system/announcement/` | Platform-level announcements from Finviet/SOHA to the school admin (separate from the school's own "Bảng Thông Tin"). |

---

## Flagged as ambiguous (not guessing — will note as Open Questions in Phase 2)

- **Đăng nhập SSO** (SSO login tab on the sign-in page) — not tested; unclear how this differs from the account-login flow, and whether it's how the Managing portal cross-authenticates into this one.
- **Đối soát (Reconciliation)** — unclear what system it reconciles against (a payment gateway? bank statement upload? Managing portal?).
- **Báo cáo → Mở rộng (Extended reports)** — "report templates" are referenced but where templates are authored/managed isn't visible from this menu.
- **"CSDL Sở" filter** on Tài Khoản (user accounts) — likely a link to a provincial Department of Education database, purpose unconfirmed.
- **Sepay integration / e-invoice (hóa đơn điện tử)** config in Học Phí settings — third-party payment/tax integration, fields present but not populated in the demo account, so real behavior unverified.
- **Role-based views** — only the Admin role was accessible with the provided credentials. Teacher and Parent views (referenced throughout, e.g. who can see "Trao Đổi" threads) could not be inventoried from this account.
- **Cấu hình → Tính Năng** — page showed an "unsaved changes" warning immediately on load with no interaction, which may be a quirk of demo data rather than real behavior; needs a second look in Phase 2.

---

**Total: 30 modules** across 5 top-level sections + system announcements, plus the sign-in flow itself.

Stopping here per Phase 1 — ready for review before Phase 2 deep dives.
