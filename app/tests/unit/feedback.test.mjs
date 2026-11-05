/**
 * Unit Test Suite: School Parent Feedback (Góp Ý)
 * Testing Pure Business Rules, State Transitions, Redux Slice, and Navigation Invariants
 * Standards: VR-FDB-01 through VR-FDB-08, BR01 through BR10, K054 through K058
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  computeFeedbackKPIs,
  filterFeedbackItems,
  validateCommentSubmission,
  validateClosureEligibility,
  getNextTurnTakingStatus,
  formatFallbackField,
  FEEDBACK_CATEGORY_MAP,
  FEEDBACK_PRIORITY_MAP,
  FEEDBACK_STATUS_MAP,
} from '../../src/utils/feedbackValidation.ts';

import feedbackReducer, {
  setSchoolYearFilter,
  setStatusCardFilter,
  clearStatusCardFilter,
  setAdvancedFilters,
  setSearchQuery,
  updatePriority,
  updateAssignee,
  addComment,
  openClosureModal,
  closeClosureModal,
  confirmCloseFeedback,
  resetFilters,
} from '../../src/store/slices/feedbackSlice.ts';

import { INITIAL_FEEDBACK_ITEMS } from '../../src/services/mockFeedbackData.ts';

const mockFeedbackList = [
  {
    id: 'fb-001',
    code: '#GY-2026-001',
    schoolCode: 'demo',
    schoolYear: '2026 - 2027',
    title: 'Góp ý về khẩu phần ăn bán trú buổi trưa',
    description: 'Bé về nhà bảo cơm trưa hơi nguội và ít canh.',
    category: 'performance',
    categoryLabel: 'Hiệu suất/chất lượng',
    priority: 'medium',
    status: 'new',
    waitingFor: 'school',
    studentId: 'st-001',
    studentName: 'Nguyễn Hoàng Nam',
    studentClass: '6A1',
    parentId: 'pa-001',
    parentName: 'Nguyễn Văn Hùng',
    parentPhone: '0901234567',
    parentEmail: 'hung.nguyen@example.com',
    attachments: [],
    comments: [],
    createdAt: '2026-10-01T08:30:00Z',
    updatedAt: '2026-10-01T08:30:00Z',
  },
  {
    id: 'fb-002',
    code: '#GY-2026-002',
    schoolCode: 'demo',
    schoolYear: '2026 - 2027',
    title: 'Đề xuất bổ sung thêm sách khoa học cho thư viện',
    description: 'Các cháu rất thích đọc sách khoa học khám phá vũ trụ.',
    category: 'content',
    categoryLabel: 'Góp ý về nội dung',
    priority: 'low',
    status: 'processing',
    waitingFor: 'parent',
    studentId: 'st-002',
    studentName: 'Trần Bảo Anh',
    studentClass: '7A2',
    parentId: 'pa-002',
    parentName: 'Trần Thị Mai',
    assigneeId: 'gv-001',
    assigneeName: 'Cô Thu Hà',
    attachments: [],
    comments: [],
    createdAt: '2026-10-02T09:15:00Z',
    updatedAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'fb-003',
    code: '#GY-2026-003',
    schoolCode: 'demo',
    schoolYear: '2026 - 2027',
    title: 'Phản ánh thái độ lái xe buýt đưa đón tuyến số 3',
    description: 'Tài xế phanh gấp nhiều lần và bấm còi quá lớn.',
    category: 'attitude',
    categoryLabel: 'Thái độ/hành vi',
    priority: 'urgent',
    status: 'completed',
    waitingFor: 'school',
    studentId: 'st-003',
    studentName: 'Lê Minh Khôi',
    studentClass: '8A3',
    parentId: 'pa-003',
    parentName: 'Lê Tuấn Vũ',
    assigneeId: 'admin-001',
    assigneeName: 'Thầy Hiệu Phó',
    attachments: [],
    comments: [],
    createdAt: '2026-09-28T07:45:00Z',
    updatedAt: '2026-09-29T16:00:00Z',
    closedAt: '2026-09-29T16:00:00Z',
  },
  {
    id: 'fb-004',
    code: '#GY-2026-004',
    schoolCode: 'demo',
    schoolYear: '2026 - 2027',
    title: 'Hỏi lại về lịch thi học kỳ 1',
    description: 'Phụ huynh thắc mắc thêm về môn Giáo dục công dân.',
    category: 'process',
    categoryLabel: 'Quy trình',
    priority: 'high',
    status: 'reopened',
    waitingFor: 'school',
    studentId: 'st-004',
    studentName: 'Phạm Quỳnh Chi',
    studentClass: '9A1',
    parentId: 'pa-004',
    parentName: 'Phạm Quốc Bảo',
    assigneeId: 'gv-002',
    assigneeName: 'Thầy Quang Huy',
    attachments: [],
    comments: [],
    createdAt: '2026-09-25T14:20:00Z',
    updatedAt: '2026-10-03T11:00:00Z',
  },
  {
    id: 'fb-005',
    code: '#GY-2025-099',
    schoolCode: 'demo',
    schoolYear: '2025 - 2026',
    title: 'Góp ý đồng phục năm ngoái',
    description: 'Đồng phục thể dục cũ.',
    category: 'presentation',
    categoryLabel: 'Hình thức/trình bày',
    priority: 'low',
    status: 'completed',
    waitingFor: 'school',
    studentId: 'st-005',
    studentName: 'Vũ Đức Anh',
    studentClass: '7A1',
    parentId: 'pa-005',
    parentName: 'Vũ Văn Thanh',
    attachments: [],
    comments: [],
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-12T10:00:00Z',
  },
];

describe('School Parent Feedback (Góp Ý) Validation Engine', () => {
  test('BR02 & K055: computeFeedbackKPIs calculates accurate global totals for active school year', () => {
    const kpis2026 = computeFeedbackKPIs(mockFeedbackList, '2026 - 2027');
    assert.strictEqual(kpis2026.newCount, 1);
    assert.strictEqual(kpis2026.processingCount, 1);
    assert.strictEqual(kpis2026.completedCount, 1);
    assert.strictEqual(kpis2026.reopenedCount, 1);
    assert.strictEqual(kpis2026.totalCount, 4);

    const kpis2025 = computeFeedbackKPIs(mockFeedbackList, '2025 - 2026');
    assert.strictEqual(kpis2025.totalCount, 1);
    assert.strictEqual(kpis2025.completedCount, 1);
  });

  test('BR02: filterFeedbackItems filters accurately by status without mutating counts', () => {
    const defaultFilters = {
      schoolYear: '2026 - 2027',
      status: 'all',
      category: 'all',
      priority: 'all',
      assigneeId: 'all',
      waitingFor: 'all',
      dateFrom: '',
      dateTo: '',
      searchQuery: '',
    };

    const processingOnly = filterFeedbackItems(mockFeedbackList, {
      ...defaultFilters,
      status: 'processing',
    });
    assert.strictEqual(processingOnly.length, 1);
    assert.strictEqual(processingOnly[0].id, 'fb-002');

    const completedOnly = filterFeedbackItems(mockFeedbackList, {
      ...defaultFilters,
      status: 'completed',
    });
    assert.strictEqual(completedOnly.length, 1);
    assert.strictEqual(completedOnly[0].id, 'fb-003');
  });

  test('BR03: 8 fixed categories are defined and accurately filtered', () => {
    assert.strictEqual(Object.keys(FEEDBACK_CATEGORY_MAP).length, 8);
    assert.strictEqual(FEEDBACK_CATEGORY_MAP.content, 'Góp ý về nội dung');
    assert.strictEqual(FEEDBACK_CATEGORY_MAP.strategic, 'Mang tính chiến lược');

    const contentItems = filterFeedbackItems(mockFeedbackList, {
      schoolYear: '2026 - 2027',
      status: 'all',
      category: 'content',
      priority: 'all',
      assigneeId: 'all',
      waitingFor: 'all',
      dateFrom: '',
      dateTo: '',
      searchQuery: '',
    });
    assert.strictEqual(contentItems.length, 1);
    assert.strictEqual(contentItems[0].code, '#GY-2026-002');
  });

  test('BR04 & K056: 4 priority tiers have standardized styling and allow filtering', () => {
    assert.strictEqual(Object.keys(FEEDBACK_PRIORITY_MAP).length, 4);
    assert.strictEqual(FEEDBACK_PRIORITY_MAP.urgent.label, 'Khẩn cấp');
    assert.strictEqual(FEEDBACK_PRIORITY_MAP.medium.label, 'Trung bình');

    const urgentItems = filterFeedbackItems(mockFeedbackList, {
      schoolYear: '2026 - 2027',
      status: 'all',
      category: 'all',
      priority: 'urgent',
      assigneeId: 'all',
      waitingFor: 'all',
      dateFrom: '',
      dateTo: '',
      searchQuery: '',
    });
    assert.strictEqual(urgentItems.length, 1);
    assert.strictEqual(urgentItems[0].id, 'fb-003');
  });

  test('BR05 & K057: getNextTurnTakingStatus executes reactive state machine correctly', () => {
    // 1. Admin replies to a new ticket -> waitingFor flips to 'parent', status moves to 'processing'
    const adminTurn = getNextTurnTakingStatus('school', 'admin', 'new');
    assert.strictEqual(adminTurn.waitingFor, 'parent');
    assert.strictEqual(adminTurn.nextStatus, 'processing');

    // 2. Teacher replies to processing ticket -> waitingFor flips to 'parent'
    const teacherTurn = getNextTurnTakingStatus('school', 'teacher', 'processing');
    assert.strictEqual(teacherTurn.waitingFor, 'parent');
    assert.strictEqual(teacherTurn.nextStatus, 'processing');

    // 3. Parent replies to ticket in progress -> waitingFor flips to 'school'
    const parentTurn = getNextTurnTakingStatus('parent', 'parent', 'processing');
    assert.strictEqual(parentTurn.waitingFor, 'school');
    assert.strictEqual(parentTurn.nextStatus, 'processing');

    // 4. Parent replies to completed ticket -> ticket automatically transitions to 'reopened' (K057)
    const reopenedTurn = getNextTurnTakingStatus('school', 'parent', 'completed');
    assert.strictEqual(reopenedTurn.waitingFor, 'school');
    assert.strictEqual(reopenedTurn.nextStatus, 'reopened');
  });

  test('BR06: validateCommentSubmission blocks empty and whitespace replies', () => {
    const emptyCheck = validateCommentSubmission('');
    assert.strictEqual(emptyCheck.isValid, false);
    assert.match(emptyCheck.error, /không được để trống/);

    const whitespaceCheck = validateCommentSubmission('    \n\t   ');
    assert.strictEqual(whitespaceCheck.isValid, false);

    const validCheck = validateCommentSubmission('Nhà trường đã tiếp nhận và đang xử lý.');
    assert.strictEqual(validCheck.isValid, true);
    assert.strictEqual(validCheck.error, undefined);
  });

  test('BR07: validateClosureEligibility prevents closing completed tickets', () => {
    const eligibleItem = mockFeedbackList[0]; // new
    assert.strictEqual(validateClosureEligibility(eligibleItem).canClose, true);

    const closedItem = mockFeedbackList[2]; // completed
    const closedCheck = validateClosureEligibility(closedItem);
    assert.strictEqual(closedCheck.canClose, false);
    assert.match(closedCheck.reason, /đã ở trạng thái Hoàn tất/);
  });

  test('BR08: formatFallbackField renders "Chưa có {trường}" for unpopulated attributes', () => {
    assert.strictEqual(formatFallbackField('0901234567', 'số điện thoại'), '0901234567');
    assert.strictEqual(formatFallbackField('', 'số điện thoại'), 'Chưa có số điện thoại');
    assert.strictEqual(formatFallbackField(null, 'email'), 'Chưa có email');
    assert.strictEqual(formatFallbackField(undefined, 'ghi chú'), 'Chưa có ghi chú');
  });

  test('Search filtering matches case-insensitively and accent-insensitively', () => {
    const queryResult = filterFeedbackItems(mockFeedbackList, {
      schoolYear: '2026 - 2027',
      status: 'all',
      category: 'all',
      priority: 'all',
      assigneeId: 'all',
      waitingFor: 'all',
      dateFrom: '',
      dateTo: '',
      searchQuery: 'hoang nam',
    });
    assert.strictEqual(queryResult.length, 1);
    assert.strictEqual(queryResult[0].studentName, 'Nguyễn Hoàng Nam');

    const classResult = filterFeedbackItems(mockFeedbackList, {
      schoolYear: '2026 - 2027',
      status: 'all',
      category: 'all',
      priority: 'all',
      assigneeId: 'all',
      waitingFor: 'all',
      dateFrom: '',
      dateTo: '',
      searchQuery: '8A3',
    });
    assert.strictEqual(classResult.length, 1);
    assert.strictEqual(classResult[0].code, '#GY-2026-003');
  });
});

describe('School Parent Feedback (Góp Ý) Redux State Machine', () => {
  test('setStatusCardFilter toggles active card filter and syncs filters.status', () => {
    let state = feedbackReducer(undefined, { type: '@@INIT' });
    assert.strictEqual(state.activeCardFilter, 'all');

    // Click 'new'
    state = feedbackReducer(state, setStatusCardFilter('new'));
    assert.strictEqual(state.activeCardFilter, 'new');
    assert.strictEqual(state.filters.status, 'new');

    // Click 'new' again -> toggles back to 'all'
    state = feedbackReducer(state, setStatusCardFilter('new'));
    assert.strictEqual(state.activeCardFilter, 'all');
    assert.strictEqual(state.filters.status, 'all');

    // Click 'completed' then clear
    state = feedbackReducer(state, setStatusCardFilter('completed'));
    assert.strictEqual(state.activeCardFilter, 'completed');
    state = feedbackReducer(state, clearStatusCardFilter());
    assert.strictEqual(state.activeCardFilter, 'all');
    assert.strictEqual(state.filters.status, 'all');
  });

  test('updatePriority: mutates ticket priority inline without confirmation (BR04, K056)', () => {
    let state = feedbackReducer(undefined, { type: '@@INIT' });
    const target = state.items[0];
    assert.strictEqual(target.priority, 'medium');

    state = feedbackReducer(
      state,
      updatePriority({ feedbackId: target.id, priority: 'urgent' })
    );

    const updated = state.items.find((i) => i.id === target.id);
    assert.strictEqual(updated.priority, 'urgent');
  });

  test('updateAssignee: assigns staff and auto-advances "new" status to "processing"', () => {
    let state = feedbackReducer(undefined, { type: '@@INIT' });
    const newTicket = state.items.find((i) => i.status === 'new');
    assert.ok(newTicket);

    state = feedbackReducer(
      state,
      updateAssignee({
        feedbackId: newTicket.id,
        assigneeId: 'staff-001',
        assigneeName: 'Thầy Nguyễn Văn An',
      })
    );

    const updated = state.items.find((i) => i.id === newTicket.id);
    assert.strictEqual(updated.assigneeId, 'staff-001');
    assert.strictEqual(updated.status, 'processing');
  });

  test('addComment: school reply sets waitingFor to "parent"', () => {
    let state = feedbackReducer(undefined, { type: '@@INIT' });
    const item = state.items[0];
    const initialCommentsCount = item.comments.length;

    state = feedbackReducer(
      state,
      addComment({
        feedbackId: item.id,
        content: 'Nhà trường đã kiểm tra và yêu cầu đổi thực đơn canh nóng.',
        authorRole: 'admin',
        authorName: 'Cô Thu Hà',
      })
    );

    const updated = state.items.find((i) => i.id === item.id);
    assert.strictEqual(updated.comments.length, initialCommentsCount + 1);
    assert.strictEqual(updated.waitingFor, 'parent');
  });

  test('openClosureModal, closeClosureModal, confirmCloseFeedback: closes ticket safely (BR07, GY-01)', () => {
    let state = feedbackReducer(undefined, { type: '@@INIT' });
    const openTicket = state.items.find((i) => i.status !== 'completed');
    assert.ok(openTicket);

    // Open modal
    state = feedbackReducer(state, openClosureModal(openTicket.id));
    assert.strictEqual(state.isClosureModalOpen, true);
    assert.strictEqual(state.targetFeedbackForClosure.id, openTicket.id);

    // Cancel modal
    state = feedbackReducer(state, closeClosureModal());
    assert.strictEqual(state.isClosureModalOpen, false);
    assert.strictEqual(state.targetFeedbackForClosure, null);

    // Reopen & Confirm closure
    state = feedbackReducer(state, openClosureModal(openTicket.id));
    state = feedbackReducer(state, confirmCloseFeedback(openTicket.id));
    assert.strictEqual(state.isClosureModalOpen, false);

    const closedItem = state.items.find((i) => i.id === openTicket.id);
    assert.strictEqual(closedItem.status, 'completed');
    assert.ok(closedItem.closedAt);
  });
});

describe('School Parent Feedback (Góp Ý) Canonical Navigation & Invariants', () => {
  test('PortalLayout.tsx mounts "Góp ý" strictly after "Sổ tay PH" and before "Lịch sự kiện" (K058)', () => {
    const layoutPath = path.resolve('src/components/layout/PortalLayout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // Verify icon import
    assert.ok(
      layoutContent.includes('faCommentDots'),
      'PortalLayout must import faCommentDots icon'
    );

    // Verify ordering
    const handbookPos = layoutContent.indexOf('/school/handbook');
    const feedbackPos = layoutContent.indexOf('/school/feedback');
    const calendarPos = layoutContent.indexOf('/school/calendar');

    assert.ok(handbookPos !== -1, 'Sổ tay PH must be present in layout');
    assert.ok(feedbackPos !== -1, 'Góp ý must be present in layout');
    assert.ok(calendarPos !== -1, 'Lịch sự kiện must be present in layout');

    assert.ok(
      handbookPos < feedbackPos,
      '"Sổ tay PH" must precede "Góp ý" in the sidebar navigation'
    );
    assert.ok(
      feedbackPos < calendarPos,
      '"Góp ý" must precede "Lịch sự kiện" in the sidebar navigation'
    );
  });

  test('Parent-Initiated Invariant (BR09, K054): Web Admin portal omits ticket creation buttons', () => {
    const toolbarPath = path.resolve('src/modules/school/feedback/FeedbackToolbar.tsx');
    const toolbarContent = fs.readFileSync(toolbarPath, 'utf8');
    const rosterPath = path.resolve('src/modules/school/feedback/FeedbackRoster.tsx');
    const rosterContent = fs.readFileSync(rosterPath, 'utf8');

    // Neither toolbar nor roster should render a create button
    assert.ok(
      !toolbarContent.includes('Tạo góp ý') && !toolbarContent.includes('Thêm góp ý'),
      'FeedbackToolbar must NOT have a create feedback button'
    );
    assert.ok(
      !rosterContent.includes('Tạo góp ý') && !rosterContent.includes('Thêm góp ý'),
      'FeedbackRoster must NOT have a create feedback button'
    );
  });
});
