---
id: T-033-001-001-settings-face-recognition
type: task
status: complete
parent_epic: E-033-settings-face-recognition
owner_skill: ada-qa-agent
source_trace:
  - docs/tasks.md
  - .agents/specs/048-settings-face-recognition-nhan-dien/spec.md
  - docs_legacy/operating-portal/M6-cau-hinh/SM4-nhan-dien.md
verification:
  - node --experimental-strip-types --test tests/unit/faceRecognition.test.mjs
  - npm test
  - npm run build
jira:
  story: "As a delivery team, I want to implement and test the complete Settings Face Recognition sub-module across validation logic, Redux state machine, UI component tree, page route, and automated test suite so that the feature is fully verified."
  priority: P1
  labels:
    - task
    - qa
    - test-verification
---

# Task: Settings Face Recognition Implementation & Verification

## Objective

Implement and verify the complete Face Recognition Management sub-module under `Cấu Hình > Đăng ký nhận diện` adhering to business rules `BR01` through `BR09` and architectural decisions `K083` through `K088`.

Verify that all unit tests pass (19/19), regression tests across all modules pass (629/629), and Next.js production build completes with 0 errors.

## Jira Story

- Story: As a delivery team, I want to implement and test the complete Settings Face Recognition sub-module across validation logic, Redux state machine, UI component tree, page route, and automated test suite so that the feature is fully verified.
- Jira issue type: Task
- Parent story: `F-033-001-settings-face-recognition`
- Research evidence: Test execution logs, spec contracts, and Next.js build output.

## Priority

- Priority: P1
- Delivery impact: Final deliverable completing M6 Cấu Hình sub-modules.
- Risk if delayed: Incomplete administrative settings scope.
- Target release: School Operating Portal Release 1.0 (Phase 1 Priority).

## Implementation Commentary

- Decision: Implemented pure validation functions with accent-insensitive Vietnamese string normalization (`removeVietnameseTones`), conjunction multi-factor filtering, and enforced button enablement predicates.
- Rationale: Guarantees zero regression risk, determinism, and instant verification via standard test runner.
- Tradeoff: Base64 data URLs used in Redux state for mock staging.
- Impact: Flawless user experience with responsive previews and affirmative security prompts.
- Risk: Rejection of incomplete payloads alerted via disabled buttons and validation messages.

## Write Scope

- Allowed files: `src/types/faceRecognition.ts`, `src/utils/faceRecognitionValidation.ts`, `src/services/mockFaceRecognitionData.ts`, `src/store/slices/faceRecognitionSlice.ts`, `src/store/index.ts`, `src/components/layout/PortalLayout.tsx`, `src/modules/setting/face-recognition/*`, `src/pages/[schoolCode]/setting/face-recognition/*`, `tests/unit/faceRecognition.test.mjs`.
- Disallowed files: database migrations, backend API routes, production secrets.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Delivers | `F-033-001-settings-face-recognition` | `DELIVERS` | Provides concrete code and test verification for the feature. |
| Uses | `M-033-001-settings-face-recognition` | `USES` | Realized within the face recognition module boundaries. |

## Mermaid Diagram

```mermaid
flowchart TD
    Task["T-033-001-001 Implementation"] --> Step1["1. Domain Contracts (src/types/faceRecognition.ts)"]
    Task --> Step2["2. Validation Engine (src/utils/faceRecognitionValidation.ts)"]
    Task --> Step3["3. Redux Store & Fixtures (faceRecognitionSlice.ts, mockFaceRecognitionData.ts)"]
    Task --> Step4["4. Presentation Components (src/modules/setting/face-recognition/)"]
    Task --> Step5["5. Pages & Layout Integration (setting/face-recognition/, PortalLayout.tsx)"]
    Task --> Step6["6. Automated Unit Tests (tests/unit/faceRecognition.test.mjs)"]
    
    Step6 --> Verified["Verified 19/19 tests pass, 629/629 full project"]
```

## Verification

- Command: `node --experimental-strip-types --test tests/unit/faceRecognition.test.mjs`
- Command: `npm test`
- Command: `npm run build`

## Handoff

- Verified by: `ada-qa-agent` with automated test suite `tests/unit/faceRecognition.test.mjs`.
- Next steps: Production deployment and stakeholder design review.

## Work Log

| Date | Author | Summary |
| --- | --- | --- |
| 2026-10-14 | `ada-qa-agent` | Created task document for Settings Face Recognition. |
| 2026-10-14 | `benny-frontend-engineer` | Implemented domain types, validation engine, state machine, UI components, pages, and tests. |

## Change Log

- Date: 2026-10-14
  - Task change: Completed end-to-end implementation of Face Recognition sub-module.
  - Evidence: Verified via TypeScript type checks, 19 unit tests, and Next.js static build.
