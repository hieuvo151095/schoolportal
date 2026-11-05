---
id: sync-20261007-095122-school-announcements-implementation
type: development-sync
parent_epic: E-024-school-announcements
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - verified
---

# Development Doc Sync: school-announcements-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It must
> explain the changed files, why docs changed or stayed unchanged, evidence, and
> remaining risk. Do not leave placeholders, generic decisions, or unchecked
> policy items.

## Source Changes

- `src/types/announcement.ts`
  - Reason: Created canonical TypeScript data contracts for School Announcement Board.
  - Impacted behavior: Establishes type definitions for Announcement, AnnouncementStatus, AnnouncementCategory, AnnouncementChannel, AnnouncementAudienceScope, AnnouncementSubAudience, AnnouncementAttachment, AnnouncementSummaryKPI, AnnouncementFilterState.
- `src/services/mockAnnouncementData.ts`
  - Reason: Provided realistic seed data for announcements across all statuses, categories, priorities, and channels.
  - Impacted behavior: Powers announcement directory, summary KPI cards, audience resolution, and detail views.
- `src/utils/announcementValidation.ts`
  - Reason: Pure validation engine enforcing business rules BR01-BR10 and validation rules VR-ANN-01 to VR-ANN-06.
  - Impacted behavior: Pure functions normalizeVietnameseText, searchAnnouncements, filterAnnouncements, calculateAnnouncementKPIs, validateChannels, validateAudienceTargets, validateDraftMutability, validateScheduleTime, validateAttachment, validateAnnouncementPayload, resolveRecipientBreakdown.
- `src/store/slices/announcementSlice.ts`
  - Reason: Redux Toolkit state machine for announcement lifecycle mutations.
  - Impacted behavior: Handles createAnnouncement, updateDraftAnnouncement, publishAnnouncement, scheduleAnnouncement, cancelScheduledAnnouncement, deleteAnnouncement, deleteMultipleAnnouncements, togglePinAnnouncement, and filter actions.
- `src/store/index.ts`
  - Reason: Registered announcement reducer into the root Redux store.
  - Impacted behavior: Makes announcement state available to the entire portal application.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Added Bảng thông tin navigation link with faBullhorn icon under NHÀ TRƯỜNG section.
  - Impacted behavior: Provides sidebar navigation to /[schoolCode]/school/announcements.
- `src/modules/school/announcements/AnnouncementToolbar.tsx`
  - Reason: Top control bar for status tabs with counter pills, category dropdown, channel dropdown, search input, and bulk delete.
  - Impacted behavior: Allows filtering announcements by status, category, channel, and keyword search.
- `src/modules/school/announcements/AnnouncementSummaryCards.tsx`
  - Reason: Render 4 summary KPI cards for school administrators.
  - Impacted behavior: Displays total announcements, published count, scheduled count, and draft count.
- `src/modules/school/announcements/AnnouncementTable.tsx`
  - Reason: Main announcement roster table with status badges, channel icons, audience pills, and row actions.
  - Impacted behavior: Displays checkboxes, STT, title, excerpt, author, category, channels, audience scope, date, and actions with draft-only edit enforcement.
- `src/modules/school/announcements/AnnouncementComposer.tsx`
  - Reason: Comprehensive composer form for authoring, scheduling, and publishing announcements.
  - Impacted behavior: Supports general info, channel selection, audience targeting, attachments, future scheduling, and draft saving.
- `src/modules/school/announcements/AnnouncementDetailView.tsx`
  - Reason: Detailed announcement view displaying metadata, channel tags, rendered HTML content, attachments, and delivery statistics.
  - Impacted behavior: Provides inspection hub and access stats with download links.
- `src/modules/school/announcements/RecipientPreviewModal.tsx`
  - Reason: Recipient preview dialog calculating estimated headcount by group and class cohort.
  - Impacted behavior: Resolves audience recipients before transmission.
- `src/modules/school/announcements/DeleteAnnouncementModal.tsx`
  - Reason: Confirmation dialog displaying mandatory legal warning regarding irrevocable email delivery.
  - Impacted behavior: Prevents accidental deletions and informs users of email outbox permanence.
- `src/pages/[schoolCode]/school/announcements/index.tsx`
  - Reason: Main announcement directory page route.
  - Impacted behavior: Prerendered static page connecting Redux store with toolbar, summary cards, and table.
- `src/pages/[schoolCode]/school/announcements/create.tsx`
  - Reason: Announcement creation page route.
  - Impacted behavior: Prerendered static page hosting AnnouncementComposer in create mode.
- `src/pages/[schoolCode]/school/announcements/[id].tsx`
  - Reason: Announcement detail view page route.
  - Impacted behavior: Prerendered static page hosting AnnouncementDetailView.
- `src/pages/[schoolCode]/school/announcements/edit/[id].tsx`
  - Reason: Announcement draft editor page route.
  - Impacted behavior: Prerendered static page hosting AnnouncementComposer in edit mode with draft-only mutability check.
- `tests/unit/announcements.test.mjs`
  - Reason: Automated test suite validating BR01-BR10 business rules.
  - Impacted behavior: 24 unit tests verifying filtering, search, mutability guardrails, file size checks, and Redux state transitions.

## Docs Before Code

- Pre-code docs read: .agents/specs/039-school-announcement-board-bang-thong-tin/execution-brief.md, docs/prd.md, docs_legacy/operating-portal/M5-nha-truong/6. bang-thong-tin.md
- Pre-code docs updated: docs/tasks.md, docs/development/E-024-school-announcements/ (epic.md, issues.md, F-024-001, M-024-001, P-024-001, T-024-001-001)
- Relationship map reviewed: Verified integration with classSlice.ts, gradeSlice.ts, and PortalLayout.tsx.
- Related features checked: 021-school-class-management, 023-school-grade-management.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD already defines Bảng Thông Tin requirements under M5 Nhà Trường.
- `docs/tasks.md`: updated because marked TASK-ANN-001..007 as completed with full implementation evidence.
- `docs/knowledge.md`: no change needed / Section 18 covers announcement invariants and multi-channel rules.
- `docs/decisions.md`: no change needed / ADR-024 records announcement architecture and draft-only mutability policy.
- `docs/memory.md`: no change needed / Section 14 records contradiction resolutions K037 to K040.
- `docs/planning/flows.md`: no change needed / Section 14 sequence diagrams match implemented UI flows.
- `docs/planning/screens.md`: no change needed / Section 2.10 screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Section 20 architectural diagrams and state machines are accurate.

### Development Ledger Docs

- Epic notes: docs/development/E-024-school-announcements/epic.md completed with scope, architecture, and verification records.
- Module notes: docs/development/E-024-school-announcements/modules/M-024-001-school-announcements.md completed with module boundaries and contracts.
- Feature notes: docs/development/E-024-school-announcements/features/F-024-001-school-announcements.md completed with user value and requirements trace.
- Page notes: docs/development/E-024-school-announcements/pages/P-024-001-school-announcements.md completed with page structures and interaction states.
- Task notes: docs/development/E-024-school-announcements/tasks/T-024-001-001-school-announcements.md completed with write scope and execution log.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: npm test && npm run build
- Result: 432/432 tests passed in 103 test suites; static build completed with 65/65 pages prerendered cleanly.
- Residual documentation risk: None. All types, pure utilities, Redux slice, UI components, and pages are fully covered.

## PM Summary

- What changed for the POC: Added complete School Announcement Board (Bảng Thông Tin) with multi-channel dispatch, draft-only mutability protection, audience preview modal, future scheduling, and irrevocable email warning modals.
- What the PM can demo now: Admins can filter announcements by status, category, or channel, search with Vietnamese diacritic support, compose and schedule announcements, resolve audience recipient breakdowns before sending, and test deletion with the statutory email notice.
- What remains uncertain: Production SMTP/SES server infrastructure provisioning and live credentials.
