---
id: sync-20261009-162105-accounts-implementation
type: development-sync
parent_epic: E-032-settings-accounts
status: complete
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - .agents/specs/047-settings-account-management-tai-khoan/spec.md
  - docs_legacy/operating-portal/M6-cau-hinh/SM2-tai-khoan.md
verification:
  - node --experimental-strip-types --test tests/unit/account.test.mjs
  - npm test
  - npm run build
---

# Development Doc Sync: accounts-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains the changed files, why docs changed or stayed unchanged, evidence, and remaining risk.

## Source Changes

- `src/types/account.ts`
  - Reason: Declare TypeScript domain contracts for institutional user accounts, student accounts, roles, staff functions, filter criteria, and mutation payloads.
  - Impacted behavior: Enforces strict type safety across pure validation engine, Redux state machine, and React UI components.
- `src/utils/accountValidation.ts`
  - Reason: Implement pure business logic functions for diacritic-free search matching, role badge styling, permission invariants (Admin immutability, CSDL Sở name lock, row toggle rejection `TK-03`), and payload validations.
  - Impacted behavior: Provides deterministic form validation and testable business rule assertions.
- `src/services/mockAccountData.ts`
  - Reason: Provide realistic Vietnamese institutional accounts fixture data for "Trường Tiểu học & THCS Eco School Tân Bình".
  - Impacted behavior: Powers the client-side state machine with diverse roles, CSDL Sở synced accounts, and student accounts.
- `src/store/slices/accountSlice.ts`
  - Reason: Manage Redux state for user and student account lists, query filters, modal view models, status toggles, and notification banners.
  - Impacted behavior: Drives reactive updates, affirmative modal gating `TK-05`, toast messages `TK-06`/`TK-04`, and rejection banner `TK-03`.
- `src/store/index.ts`
  - Reason: Register `accountReducer` in the root Redux store.
  - Impacted behavior: Exposes the `account` state slice to the application.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Mount "Tài khoản" third under `CẤU HÌNH` strictly after "Học phí" (`K076`).
  - Impacted behavior: Ensures canonical sidebar navigation order for school administrators.
- `src/modules/setting/account/AccountTabsShell.tsx`
  - Reason: Provide the top-level dual-tab container with URL routing sync, toast notifications, and `TK-03` error banner.
  - Impacted behavior: Unifies "Người Dùng" and "Học Sinh" administrative experiences.
- `src/modules/setting/account/UserAccountsToolbar.tsx`
  - Reason: Toolbar with multi-factor search, role filter, active status default filter (`BR16`), CSDL Sở filter, and "+ Thêm người dùng" launcher.
  - Impacted behavior: Enables rapid administrative filtering of institutional accounts.
- `src/modules/setting/account/UserAccountsTable.tsx`
  - Reason: Render user account rows with STT, CSDL Sở badges, role pills, status switch, and Admin view-only protection (`BR03`).
  - Impacted behavior: Safeguards Super-Admin accounts and displays real-time user records.
- `src/modules/setting/account/UserAccountForm.tsx`
  - Reason: Dialog form for creating and editing user accounts with locked Admin checkbox (`BR04`), dynamic staff functions (`TK-02`), and locked CSDL Sở name (`BR05`).
  - Impacted behavior: Intercepts updates to trigger affirmative modal `TK-05` when status changes.
- `src/modules/setting/account/AccountActionConfirmModal.tsx`
  - Reason: Affirmative confirmation modal dialog for in-form account status mutations (`TK-05`).
  - Impacted behavior: Prevents inadvertent deactivation of institutional personnel.
- `src/modules/setting/account/DeleteUserModal.tsx`
  - Reason: Confirmation dialog for account deletion with danger styling (`TK-04`).
  - Impacted behavior: Permanently protects Admin accounts while allowing deletion of standard staff/teachers.
- `src/modules/setting/account/ChangeEmailModal.tsx`
  - Reason: Decoupled dialog for updating user email addresses.
  - Impacted behavior: Keeps email updates isolated from general profile attribute modifications.
- `src/modules/setting/account/StudentAccountsToolbar.tsx`
  - Reason: Toolbar with search, class filter, and account status filter (`all`, `has_account`, `no_account`).
  - Impacted behavior: Filters student records for fast credential allocation.
- `src/modules/setting/account/StudentAccountsTable.tsx`
  - Reason: Table showing 1-to-1 mapped enrolled students with account status badges and action buttons (`+` create vs pencil edit).
  - Impacted behavior: Facilitates managing student portal access.
- `src/modules/setting/account/StudentAccountModal.tsx`
  - Reason: Dialog for creating or modifying student login credentials with alphanumeric username validation (`BR20`).
  - Impacted behavior: Enforces username pattern `/^[a-zA-Z0-9_\-\.]+$/` with green helper guidance hint.
- `src/pages/[schoolCode]/setting/users/index.tsx`
  - Reason: Next.js page route for the primary "Người Dùng" tab.
  - Impacted behavior: Renders the account management workspace at `/[schoolCode]/setting/users`.
- `src/pages/[schoolCode]/setting/users/[id]/password.tsx`
  - Reason: Dedicated sub-page under `BẢO MẬT` for resetting passwords with Decree 13/2023/NĐ-CP session revocation advisory.
  - Impacted behavior: Complies with personal data protection laws by isolating password changes and warning about cross-device session termination.
- `src/pages/[schoolCode]/school/kid/accounts/index.tsx`
  - Reason: Compatibility alias page route for the "Học Sinh" tab.
  - Impacted behavior: Allows navigating directly to student credentials.
- `tests/unit/account.test.mjs`
  - Reason: Comprehensive automated test suite for Feature 047.
  - Impacted behavior: Verifies helpers, permission gates, validations, filters, and Redux state transitions (22/22 tests passing).

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M6-cau-hinh/SM2-tai-khoan.md`, `.agents/specs/047-settings-account-management-tai-khoan/spec.md`, `docs/prd.md`, `docs/tasks.md`
- Pre-code docs updated: Scaffolded Epic 32 development ledger `docs/development/E-032-settings-accounts/`
- Relationship map reviewed: Linked under M6 Cấu Hình, referencing M3 Quản lý học sinh for class rosters.
- Related features checked: `046-settings-school-profile-truong`

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD Section 5 defines feature scope and Section 7 defines acceptance criteria.
- `docs/tasks.md`: updated because marked TASK-ACC-001 through TASK-ACC-008 as completed with verification evidence and test results.
- `docs/knowledge.md`: no change needed / Section 26 records decisions K076 through K082 regarding Super-Admin protection, CSDL Sở safeguarding, asymmetric confirmation, and Decree 13 compliance.
- `docs/decisions.md`: no change needed / ADR-032 records decision on Super-Admin immutability and decoupled password route.
- `docs/memory.md`: no change needed / Session memory tracks active feature progress and verification facts.
- `docs/planning/flows.md`: no change needed / Account management interaction flows match implemented workflows.
- `docs/planning/screens.md`: no change needed / Screen catalog matches implemented views at setting/users and setting/users/[id]/password.
- `docs/planning/diagrams.md`: no change needed / Architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: `docs/development/E-032-settings-accounts/epic.md` updated with full PM notes, scope, and Jira story.
- Module notes: `docs/development/E-032-settings-accounts/modules/M-032-001-settings-accounts.md` updated with boundaries and relationship map.
- Feature notes: `docs/development/E-032-settings-accounts/features/F-032-001-settings-accounts.md` updated with user value and requirements trace.
- Page notes: `docs/development/E-032-settings-accounts/pages/P-032-001-settings-accounts.md` updated with interaction and visual specifications.
- Task notes: `docs/development/E-032-settings-accounts/tasks/T-032-001-001-settings-accounts.md` updated with implementation evidence and verification steps.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --experimental-strip-types --test tests/unit/account.test.mjs && npm test && npm run build`
- Result: 22/22 unit tests passed (5.8ms), 610/610 repo-wide tests passed (0 regressions), Next.js production build succeeded with 0 errors.
- Residual documentation risk: None; all specifications and ledger documents match production behavior.

## PM Summary

- What changed for the POC: Delivered complete User and Student Account Management under CẤU HÌNH with full RBAC protection and Decree 13 compliance.
- What the PM can demo now:
  - Browse user roster with active status default filter (`BR16`).
  - View Super-Admin accounts protected from editing and deletion (`BR03`, `K077`).
  - Trigger and verify CSDL Sở row status rejection banner `TK-03` (`BR06`, `K078`).
  - Edit a manual user and verify affirmative confirmation modal `TK-05` (`BR07`, `K079`).
  - Reset a password on the dedicated sub-page and review Decree 13 advisory (`BR09`, `K080`).
  - Switch to the "Học sinh" tab, filter by class, and assign login credentials with regex validation (`BR17`–`BR21`, `K082`).
- What remains uncertain: None for Phase 1 POC; backend database mutation and external OAuth SSO providers can be connected in future releases.
