---
id: development-index
type: development-index
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/prd.md
  - docs/tasks.md
---

# Development Knowledge Index — School Operating Portal

This index provides product managers and engineering agents with an immediate technical and delivery overview of the active School Operating Portal implementation, centered on Epic E-001 (Operations Attendance).

## Execution Scope

- Feature/spec id: `026-project-planning-school-operating-portal`
- Implementation branch: `main`
- Approved planning package: `docs/prd.md`, `docs/tasks.md`, `docs/knowledge.md`, `docs/decisions.md`
- Active owner skills: `alan-tech-lead`, `benny-frontend-engineer`, `david-systems-architect`, `ada-qa-agent`

## Artifact Map

| Artifact | Path | Purpose |
| --- | --- | --- |
| Manifest | `docs/development/development_manifest.json` | Canonical registry for topology, IDs, quality gates, and epic children |
| Epic Root | `docs/development/E-001-operations-attendance/` | Parent directory for Daily Per-Class Attendance delivery outcome |
| Epic Note | `docs/development/E-001-operations-attendance/epic.md` | Major delivery outcome and acceptance boundary for attendance |
| Issues | `docs/development/E-001-operations-attendance/issues.md` | QA and product risk register for attendance |
| Features | `docs/development/E-001-operations-attendance/features/F-001-001-operations-attendance.md` | User-visible behavior and implementation slices for attendance roster |
| Modules | `docs/development/E-001-operations-attendance/modules/M-001-001-operations-attendance.md` | Code ownership, APIs, Redux store, and components |
| Pages | `docs/development/E-001-operations-attendance/pages/P-001-001-operations-attendance.md` | UI route `/class/[classId]/attendance`, state transitions, and responsive behavior |
| Tasks | `docs/development/E-001-operations-attendance/tasks/T-001-001-001-operations-attendance.md` | Execution notes, verification commands, and residual risks |
| Sync | `docs/development/E-001-operations-attendance/sync/` | Epic-local code and docs sync notes |
| Epic Root (Activity) | `docs/development/E-002-operations-activity/` | Parent directory for Class Activity Feed delivery outcome |
| Epic Note (Activity) | `docs/development/E-002-operations-activity/epic.md` | Major delivery outcome and acceptance boundary for activity |
| Issues (Activity) | `docs/development/E-002-operations-activity/issues.md` | QA and product risk register for activity |
| Features (Activity) | `docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md` | User-visible behavior and composer for activity |
| Modules (Activity) | `docs/development/E-002-operations-activity/modules/M-002-001-operations-activity.md` | Code ownership, APIs, Redux store, and components |
| Pages (Activity) | `docs/development/E-002-operations-activity/pages/P-002-001-operations-activity.md` | UI route `/class/[classId]/activity`, state transitions, and responsive behavior |
| Tasks (Activity) | `docs/development/E-002-operations-activity/tasks/T-002-001-001-operations-activity.md` | Execution notes, verification commands, and residual risks |
| Epic Root (Media) | `docs/development/E-003-operations-media/` | Parent directory for Class Photo Albums with Face Recognition delivery outcome |
| Epic Note (Media) | `docs/development/E-003-operations-media/epic.md` | Major delivery outcome and acceptance boundary for media albums |
| Issues (Media) | `docs/development/E-003-operations-media/issues.md` | QA and product risk register for media albums |
| Features (Media) | `docs/development/E-003-operations-media/features/F-003-001-operations-media.md` | User-visible album gallery and face tagging |
| Modules (Media) | `docs/development/E-003-operations-media/modules/M-003-001-operations-media.md` | Code ownership, APIs, Redux store, and media components |
| Pages (Media) | `docs/development/E-003-operations-media/pages/P-003-001-operations-media.md` | UI route `/class/[classId]/media`, album views, and AI modal |
| Epic Root (Conversations) | `docs/development/E-004-operations-conversations/` | Parent directory for Parent Messaging delivery outcome |
| Epic Note (Conversations) | `docs/development/E-004-operations-conversations/epic.md` | Major delivery outcome and acceptance boundary for parent messaging |
| Issues (Conversations) | `docs/development/E-004-operations-conversations/issues.md` | QA and product risk register for parent messaging |
| Features (Conversations) | `docs/development/E-004-operations-conversations/features/F-004-001-operations-conversations.md` | User-visible parent messaging and absence management |
| Modules (Conversations) | `docs/development/E-004-operations-conversations/modules/M-004-001-operations-conversations.md` | Code ownership, APIs, Redux store, and components |
| Pages (Conversations) | `docs/development/E-004-operations-conversations/pages/P-004-001-operations-conversations.md` | UI route `/conversations`, state transitions, and responsive behavior |
| Tasks (Conversations) | `docs/development/E-004-operations-conversations/tasks/T-004-001-001-operations-conversations.md` | Execution notes, verification commands, and residual risks |
| Epic Root (Reports) | `docs/development/E-005-operations-reports/` | Parent directory for Attendance & Extended Reports delivery outcome |
| Epic Note (Reports) | `docs/development/E-005-operations-reports/epic.md` | Major delivery outcome and acceptance boundary for reports |
| Issues (Reports) | `docs/development/E-005-operations-reports/issues.md` | QA and product risk register for reports |
| Features (Reports) | `docs/development/E-005-operations-reports/features/F-005-001-operations-reports.md` | User-visible monthly attendance and template evaluation reports |
| Modules (Reports) | `docs/development/E-005-operations-reports/modules/M-005-001-operations-reports.md` | Code ownership, APIs, Redux store, and reporting components |
| Pages (Reports) | `docs/development/E-005-operations-reports/pages/P-005-001-operations-reports.md` | UI routes `/reports/attendance` and `/reports/extended` |
| Tasks (Reports) | `docs/development/E-005-operations-reports/tasks/T-005-001-001-operations-reports.md` | Execution notes, verification commands, and residual risks |
| Epic Root (Schedule) | `docs/development/E-006-academics-schedule/` | Parent directory for Timetable & Schedule delivery outcome |
| Epic Note (Schedule) | `docs/development/E-006-academics-schedule/epic.md` | Major delivery outcome and acceptance boundary for timetable |
| Issues (Schedule) | `docs/development/E-006-academics-schedule/issues.md` | QA and product risk register for timetable |
| Features (Schedule) | `docs/development/E-006-academics-schedule/features/F-006-001-academics-schedule.md` | User-visible timetable grid builder and file upload |
| Modules (Schedule) | `docs/development/E-006-academics-schedule/modules/M-006-001-academics-schedule.md` | Code ownership, APIs, Redux store, and timetable components |
| Pages (Schedule) | `docs/development/E-006-academics-schedule/pages/P-006-001-academics-schedule.md` | UI routes `/school/schedule`, `/schedule/[scheduleId]`, `/schedule/create`, `/schedule/edit/[scheduleId]` |
| Tasks (Schedule) | `docs/development/E-006-academics-schedule/tasks/T-006-001-001-academics-schedule.md` | Execution notes, verification commands, and residual risks |
| Epic Root (Assignment) | `docs/development/E-007-academics-assignment/` | Parent directory for Homework Assignment delivery outcome |
| Epic Note (Assignment) | `docs/development/E-007-academics-assignment/epic.md` | Major delivery outcome and acceptance boundary for homework assignment |
| Issues (Assignment) | `docs/development/E-007-academics-assignment/issues.md` | QA and product risk register for homework assignment |
| Features (Assignment) | `docs/development/E-007-academics-assignment/features/F-007-001-academics-assignment.md` | User-visible homework assignment catalog, create form, and grading |
| Modules (Assignment) | `docs/development/E-007-academics-assignment/modules/M-007-001-academics-assignment.md` | Code ownership, APIs, Redux store, and assignment components |
| Pages (Assignment) | `docs/development/E-007-academics-assignment/pages/P-007-001-academics-assignment.md` | UI routes `/school/assignment`, `/assignment/[assignmentId]`, `/assignment/create`, `/assignment/edit/[assignmentId]` |
| Tasks (Assignment) | `docs/development/E-007-academics-assignment/tasks/T-007-001-001-academics-assignment.md` | Execution notes, verification commands, and residual risks |
| Epic Root (Gradebook) | `docs/development/E-008-academics-gradebook/` | Parent directory for Gradebook & Evaluations delivery outcome |
| Epic Note (Gradebook) | `docs/development/E-008-academics-gradebook/epic.md` | Major delivery outcome and acceptance boundary for gradebook & evaluations |
| Issues (Gradebook) | `docs/development/E-008-academics-gradebook/issues.md` | QA and product risk register for gradebook |
| Features (Gradebook) | `docs/development/E-008-academics-gradebook/features/F-008-001-academics-gradebook.md` | User-visible numeric gradebook matrix and preschool rubric evaluation |
| Modules (Gradebook) | `docs/development/E-008-academics-gradebook/modules/M-008-001-academics-gradebook.md` | Code ownership, APIs, Redux store, evaluation engine, and components |
| Pages (Gradebook) | `docs/development/E-008-academics-gradebook/pages/P-008-001-academics-gradebook.md` | UI routes `/school/scoreboard`, `/grade/[classId]/[termId]`, `/summary/[classId]/[termId]` |
| Tasks (Gradebook) | `docs/development/E-008-academics-gradebook/tasks/T-008-001-001-academics-gradebook.md` | Execution notes, verification commands, and residual risks |

## Canonical ID Registry

| ID | Type | Parent | Status | File |
| --- | --- | --- | --- | --- |
| `E-001-operations-attendance` | epic | root | active | `docs/development/E-001-operations-attendance/epic.md` |
| `ISSUES-E-001-operations-attendance` | epic-issues | `E-001-operations-attendance` | active | `docs/development/E-001-operations-attendance/issues.md` |
| `F-001-001-operations-attendance` | feature | `E-001-operations-attendance` | active | `docs/development/E-001-operations-attendance/features/F-001-001-operations-attendance.md` |
| `M-001-001-operations-attendance` | module | `E-001-operations-attendance` | active | `docs/development/E-001-operations-attendance/modules/M-001-001-operations-attendance.md` |
| `P-001-001-operations-attendance` | page | `E-001-operations-attendance` | active | `docs/development/E-001-operations-attendance/pages/P-001-001-operations-attendance.md` |
| `T-001-001-001-operations-attendance` | task | `E-001-operations-attendance` | active | `docs/development/E-001-operations-attendance/tasks/T-001-001-001-operations-attendance.md` |
| `E-002-operations-activity` | epic | root | active | `docs/development/E-002-operations-activity/epic.md` |
| `ISSUES-E-002-operations-activity` | epic-issues | `E-002-operations-activity` | active | `docs/development/E-002-operations-activity/issues.md` |
| `F-002-001-operations-activity` | feature | `E-002-operations-activity` | active | `docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md` |
| `M-002-001-operations-activity` | module | `E-002-operations-activity` | active | `docs/development/E-002-operations-activity/modules/M-002-001-operations-activity.md` |
| `P-002-001-operations-activity` | page | `E-002-operations-activity` | active | `docs/development/E-002-operations-activity/pages/P-002-001-operations-activity.md` |
| `T-002-001-001-operations-activity` | task | `E-002-operations-activity` | active | `docs/development/E-002-operations-activity/tasks/T-002-001-001-operations-activity.md` |
| `E-003-operations-media` | epic | root | active | `docs/development/E-003-operations-media/epic.md` |
| `ISSUES-E-003-operations-media` | epic-issues | `E-003-operations-media` | active | `docs/development/E-003-operations-media/issues.md` |
| `F-003-001-operations-media` | feature | `E-003-operations-media` | active | `docs/development/E-003-operations-media/features/F-003-001-operations-media.md` |
| `M-003-001-operations-media` | module | `E-003-operations-media` | active | `docs/development/E-003-operations-media/modules/M-003-001-operations-media.md` |
| `P-003-001-operations-media` | page | `E-003-operations-media` | active | `docs/development/E-003-operations-media/pages/P-003-001-operations-media.md` |
| `T-003-001-001-operations-media` | task | `E-003-operations-media` | active | `docs/development/E-003-operations-media/tasks/T-003-001-001-operations-media.md` |
| `E-004-operations-conversations` | epic | root | active | `docs/development/E-004-operations-conversations/epic.md` |
| `ISSUES-E-004-operations-conversations` | epic-issues | `E-004-operations-conversations` | active | `docs/development/E-004-operations-conversations/issues.md` |
| `F-004-001-operations-conversations` | feature | `E-004-operations-conversations` | active | `docs/development/E-004-operations-conversations/features/F-004-001-operations-conversations.md` |
| `M-004-001-operations-conversations` | module | `E-004-operations-conversations` | active | `docs/development/E-004-operations-conversations/modules/M-004-001-operations-conversations.md` |
| `P-004-001-operations-conversations` | page | `E-004-operations-conversations` | active | `docs/development/E-004-operations-conversations/pages/P-004-001-operations-conversations.md` |
| `T-004-001-001-operations-conversations` | task | `E-004-operations-conversations` | active | `docs/development/E-004-operations-conversations/tasks/T-004-001-001-operations-conversations.md` |
| `E-005-operations-reports` | epic | root | active | `docs/development/E-005-operations-reports/epic.md` |
| `ISSUES-E-005-operations-reports` | epic-issues | `E-005-operations-reports` | active | `docs/development/E-005-operations-reports/issues.md` |
| `F-005-001-operations-reports` | feature | `E-005-operations-reports` | active | `docs/development/E-005-operations-reports/features/F-005-001-operations-reports.md` |
| `M-005-001-operations-reports` | module | `E-005-operations-reports` | active | `docs/development/E-005-operations-reports/modules/M-005-001-operations-reports.md` |
| `P-005-001-operations-reports` | page | `E-005-operations-reports` | active | `docs/development/E-005-operations-reports/pages/P-005-001-operations-reports.md` |
| `T-005-001-001-operations-reports` | task | `E-005-operations-reports` | active | `docs/development/E-005-operations-reports/tasks/T-005-001-001-operations-reports.md` |
| `E-006-academics-schedule` | epic | root | active | `docs/development/E-006-academics-schedule/epic.md` |
| `ISSUES-E-006-academics-schedule` | epic-issues | `E-006-academics-schedule` | active | `docs/development/E-006-academics-schedule/issues.md` |
| `F-006-001-academics-schedule` | feature | `E-006-academics-schedule` | active | `docs/development/E-006-academics-schedule/features/F-006-001-academics-schedule.md` |
| `M-006-001-academics-schedule` | module | `E-006-academics-schedule` | active | `docs/development/E-006-academics-schedule/modules/M-006-001-academics-schedule.md` |
| `P-006-001-academics-schedule` | page | `E-006-academics-schedule` | active | `docs/development/E-006-academics-schedule/pages/P-006-001-academics-schedule.md` |
| `T-006-001-001-academics-schedule` | task | `E-006-academics-schedule` | active | `docs/development/E-006-academics-schedule/tasks/T-006-001-001-academics-schedule.md` |
| `E-007-academics-assignment` | epic | root | active | `docs/development/E-007-academics-assignment/epic.md` |
| `ISSUES-E-007-academics-assignment` | epic-issues | `E-007-academics-assignment` | active | `docs/development/E-007-academics-assignment/issues.md` |
| `F-007-001-academics-assignment` | feature | `E-007-academics-assignment` | active | `docs/development/E-007-academics-assignment/features/F-007-001-academics-assignment.md` |
| `M-007-001-academics-assignment` | module | `E-007-academics-assignment` | active | `docs/development/E-007-academics-assignment/modules/M-007-001-academics-assignment.md` |
| `P-007-001-academics-assignment` | page | `E-007-academics-assignment` | active | `docs/development/E-007-academics-assignment/pages/P-007-001-academics-assignment.md` |
| `T-007-001-001-academics-assignment` | task | `E-007-academics-assignment` | active | `docs/development/E-007-academics-assignment/tasks/T-007-001-001-academics-assignment.md` |
| `E-008-academics-gradebook` | epic | root | active | `docs/development/E-008-academics-gradebook/epic.md` |
| `ISSUES-E-008-academics-gradebook` | epic-issues | `E-008-academics-gradebook` | active | `docs/development/E-008-academics-gradebook/issues.md` |
| `F-008-001-academics-gradebook` | feature | `E-008-academics-gradebook` | active | `docs/development/E-008-academics-gradebook/features/F-008-001-academics-gradebook.md` |
| `M-008-001-academics-gradebook` | module | `E-008-academics-gradebook` | active | `docs/development/E-008-academics-gradebook/modules/M-008-001-academics-gradebook.md` |
| `P-008-001-academics-gradebook` | page | `E-008-academics-gradebook` | active | `docs/development/E-008-academics-gradebook/pages/P-008-001-academics-gradebook.md` |
| `T-008-001-001-academics-gradebook` | task | `E-008-academics-gradebook` | active | `docs/development/E-008-academics-gradebook/tasks/T-008-001-001-academics-gradebook.md` |
| `E-009-finance-invoices` | epic | root | active | `docs/development/E-009-finance-invoices/epic.md` |
| `ISSUES-E-009-finance-invoices` | epic-issues | `E-009-finance-invoices` | active | `docs/development/E-009-finance-invoices/issues.md` |
| `F-009-001-finance-invoices` | feature | `E-009-finance-invoices` | active | `docs/development/E-009-finance-invoices/features/F-009-001-finance-invoices.md` |
| `M-009-001-finance-invoices` | module | `E-009-finance-invoices` | active | `docs/development/E-009-finance-invoices/modules/M-009-001-finance-invoices.md` |
| `P-009-001-finance-invoices` | page | `E-009-finance-invoices` | active | `docs/development/E-009-finance-invoices/pages/P-009-001-finance-invoices.md` |
| `T-009-001-001-finance-invoices` | task | `E-009-finance-invoices` | active | `docs/development/E-009-finance-invoices/tasks/T-009-001-001-finance-invoices.md` |
| `E-010-finance-fee-catalog` | epic | root | active | `docs/development/E-010-finance-fee-catalog/epic.md` |
| `ISSUES-E-010-finance-fee-catalog` | epic-issues | `E-010-finance-fee-catalog` | active | `docs/development/E-010-finance-fee-catalog/issues.md` |
| `F-010-001-finance-fee-catalog` | feature | `E-010-finance-fee-catalog` | active | `docs/development/E-010-finance-fee-catalog/features/F-010-001-finance-fee-catalog.md` |
| `M-010-001-finance-fee-catalog` | module | `E-010-finance-fee-catalog` | active | `docs/development/E-010-finance-fee-catalog/modules/M-010-001-finance-fee-catalog.md` |
| `P-010-001-finance-fee-catalog` | page | `E-010-finance-fee-catalog` | active | `docs/development/E-010-finance-fee-catalog/pages/P-010-001-finance-fee-catalog.md` |
| `T-010-001-001-finance-fee-catalog` | task | `E-010-finance-fee-catalog` | active | `docs/development/E-010-finance-fee-catalog/tasks/T-010-001-001-finance-fee-catalog.md` |
| `E-011-finance-tuition-management` | epic | root | active | `docs/development/E-011-finance-tuition-management/epic.md` |
| `ISSUES-E-011-finance-tuition-management` | epic-issues | `E-011-finance-tuition-management` | active | `docs/development/E-011-finance-tuition-management/issues.md` |
| `F-011-001-finance-tuition-management` | feature | `E-011-finance-tuition-management` | active | `docs/development/E-011-finance-tuition-management/features/F-011-001-finance-tuition-management.md` |
| `M-011-001-finance-tuition-management` | module | `E-011-finance-tuition-management` | active | `docs/development/E-011-finance-tuition-management/modules/M-011-001-finance-tuition-management.md` |
| `P-011-001-finance-tuition-management` | page | `E-011-finance-tuition-management` | active | `docs/development/E-011-finance-tuition-management/pages/P-011-001-finance-tuition-management.md` |
| `T-011-001-001-finance-tuition-management` | task | `E-011-finance-tuition-management` | active | `docs/development/E-011-finance-tuition-management/tasks/T-011-001-001-finance-tuition-management.md` |
| `E-012-finance-expenses` | epic | root | active | `docs/development/E-012-finance-expenses/epic.md` |
| `ISSUES-E-012-finance-expenses` | epic-issues | `E-012-finance-expenses` | active | `docs/development/E-012-finance-expenses/issues.md` |
| `F-012-001-finance-expenses` | feature | `E-012-finance-expenses` | active | `docs/development/E-012-finance-expenses/features/F-012-001-finance-expenses.md` |
| `M-012-001-finance-expenses` | module | `E-012-finance-expenses` | active | `docs/development/E-012-finance-expenses/modules/M-012-001-finance-expenses.md` |
| `P-012-001-finance-expenses` | page | `E-012-finance-expenses` | active | `docs/development/E-012-finance-expenses/pages/P-012-001-finance-expenses.md` |
| `T-012-001-001-finance-expenses` | task | `E-012-finance-expenses` | active | `docs/development/E-012-finance-expenses/tasks/T-012-001-001-finance-expenses.md` |
| `E-025-school-polls` | epic | root | active | `docs/development/E-025-school-polls/epic.md` |
| `ISSUES-E-025-school-polls` | epic-issues | `E-025-school-polls` | active | `docs/development/E-025-school-polls/issues.md` |
| `F-025-001-school-polls` | feature | `E-025-school-polls` | active | `docs/development/E-025-school-polls/features/F-025-001-school-polls.md` |
| `M-025-001-school-polls` | module | `E-025-school-polls` | active | `docs/development/E-025-school-polls/modules/M-025-001-school-polls.md` |
| `P-025-001-school-polls` | page | `E-025-school-polls` | active | `docs/development/E-025-school-polls/pages/P-025-001-school-polls.md` |
| `T-025-001-001-school-polls` | task | `E-025-school-polls` | active | `docs/development/E-025-school-polls/tasks/T-025-001-001-school-polls.md` |
| `E-026-school-staff-attendance` | epic | root | active | `docs/development/E-026-school-staff-attendance/epic.md` |
| `ISSUES-E-026-school-staff-attendance` | epic-issues | `E-026-school-staff-attendance` | active | `docs/development/E-026-school-staff-attendance/issues.md` |
| `F-026-001-school-staff-attendance` | feature | `E-026-school-staff-attendance` | active | `docs/development/E-026-school-staff-attendance/features/F-026-001-school-staff-attendance.md` |
| `M-026-001-school-staff-attendance` | module | `E-026-school-staff-attendance` | active | `docs/development/E-026-school-staff-attendance/modules/M-026-001-school-staff-attendance.md` |
| `P-026-001-school-staff-attendance` | page | `E-026-school-staff-attendance` | active | `docs/development/E-026-school-staff-attendance/pages/P-026-001-school-staff-attendance.md` |
| `T-026-001-001-school-staff-attendance` | task | `E-026-school-staff-attendance` | active | `docs/development/E-026-school-staff-attendance/tasks/T-026-001-001-school-staff-attendance.md` |
| `E-027-school-parent-handbook` | epic | root | active | `docs/development/E-027-school-parent-handbook/epic.md` |
| `ISSUES-E-027-school-parent-handbook` | epic-issues | `E-027-school-parent-handbook` | active | `docs/development/E-027-school-parent-handbook/issues.md` |
| `F-027-001-school-parent-handbook` | feature | `E-027-school-parent-handbook` | active | `docs/development/E-027-school-parent-handbook/features/F-027-001-school-parent-handbook.md` |
| `M-027-001-school-parent-handbook` | module | `E-027-school-parent-handbook` | active | `docs/development/E-027-school-parent-handbook/modules/M-027-001-school-parent-handbook.md` |
| `P-027-001-school-parent-handbook` | page | `E-027-school-parent-handbook` | active | `docs/development/E-027-school-parent-handbook/pages/P-027-001-school-parent-handbook.md` |
| `T-027-001-001-school-parent-handbook` | task | `E-027-school-parent-handbook` | active | `docs/development/E-027-school-parent-handbook/tasks/T-027-001-001-school-parent-handbook.md` |

## Relationship Label Taxonomy

| Label | Meaning | Use When |
| --- | --- | --- |
| `DEPENDS_ON` | Source artifact cannot work without target | Feature needs module, page needs data contract |
| `BLOCKS` | Source must finish before target can proceed | Task sequencing or unresolved issue blocks release |
| `ENABLES` | Source unlocks target capability | Module/epic enables feature or demo |
| `IMPLEMENTS` | Source realizes target requirement | Feature implements epic, task implements story |
| `USES` | Source consumes target behavior/data | Page uses module, task edits module |
| `EXTENDS` | Source adds behavior on top of target | Feature extends an existing feature |
| `CONFLICTS_WITH` | Source may overlap or break target | Competing UX/state/data choices |
| `SUPERSEDES` | Source replaces an older behavior/doc decision | Updated design or implementation decision |
