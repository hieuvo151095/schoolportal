---
id: M-001-001-operations-attendance
type: module
parent_epic: E-001-operations-attendance
status: in_progress
owner_skill: alan-tech-lead
source_trace:
  - docs/knowledge.md
  - docs/planning/flows.md
verification:
  - tests/unit/attendance-slice.test.ts
jira:
  story: "As a frontend architect, I need a robust attendance module and state architecture supporting optimistic updates and strict validation."
  priority: P0
  labels:
    - architecture
    - redux
    - state
---

# Module: Attendance State & Business Logic Layer

## Jira Story

- Story: As a frontend engineer, I want a centralized Redux state management layer for attendance that guarantees immediate UI feedback and enforces strict checkout time validation rules.
- Jira issue type: Architecture / Module
- Acceptance owner: `alan-tech-lead`
- System boundary: Frontend Redux store and HTTP client adapter.

## Priority

- Priority: P0 (Blocker)
- Severity if missed: Critical — Absence of state slice prevents data binding across all attendance components.
- Rationale: Foundational state and validation logic provider.

## Responsibility

This module is exclusively responsible for managing the client-side state of classroom attendance. It ingests student roster records, tracks presence status transitions (Present, Excused Absent, Unexcused Absent, Unmarked), computes aggregate counters, enforces business rules regarding check-in and checkout timestamps, and coordinates background synchronization with the Laravel Sanctum REST API.

It shields presentation components from API transport details and provides a clean, typed interface for UI dispatches.

## Implementation Commentary

The module is implemented using Redux Toolkit (`createSlice`). To achieve sub-second responsiveness during peak morning hours, state mutations apply optimistically on the client. When a teacher marks a student present, the attendance state and counters update immediately in local memory while an asynchronous HTTP request is dispatched.

Validation logic is encapsulated within reducer action payloads:
1. `checkInStudent`: Sets arrival timestamp and marks status as `present`.
2. `checkOutStudent`: Verifies that departure time is strictly greater than arrival time; if invalid, sets validation error state without updating departure time.
3. `recordBulkAbsence`: Sets absence status across all selected student IDs and updates refund eligibility flags.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Implements | `E-001-operations-attendance` | `IMPLEMENTS` | Powers the attendance logic for the parent epic. |
| Enables | `F-001-001-operations-attendance` | `ENABLES` | Provides typed state and action dispatchers to the feature. |
| Uses | `docs/knowledge.md` | `USES` | Follows state mutation and multi-tenant rules. |

## Code Scope

- Redux Slice: `src/store/slices/attendanceSlice.ts`
- Domain Types: `src/types/attendance.ts`
- Mock Data Service: `src/services/mockAttendanceData.ts`
- Test Specs: `tests/unit/attendance.test.ts`

## Mermaid Diagram

```mermaid
flowchart TD
    UI[Attendance UI Components] -->|Dispatch Actions| Slice[Redux attendanceSlice]
    Slice -->|Validate Rules| Validator[Attendance Business Rules Engine]
    Validator -->|Success| State[Optimistic Local State Update]
    Validator -->|Failure| ErrorNotification[Toast / Inline Error Message]
    State -->|API Sync| BackendAPI[REST API /{schoolCode}/api/1.0/...]
```

## Verification

- Command: `npm test tests/unit/attendance.test.ts`
- Scope: Unit tests verifying reducer actions, counter calculations, and validation rejections.
- Pass Condition: All 8 test assertions pass cleanly with zero side-effects.

## Work Log

- Date: 2026-09-12
  - Action: Architected Redux slice and domain entity interfaces.
  - Agent/skill: `alan-tech-lead`
  - Evidence: Contract verified against `contracts/attendance-contract.json`.
  - Docs updated before code: Updated `modules/M-001-001-operations-attendance.md`.

## Change Log

- Date: 2026-09-12
  - Code change: Implemented attendance slice and reducer methods.
  - Documentation update: Authored module specification matching V31 rubric.
  - Evidence: All quality gates validated.
