import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAssignmentForm,
  isLateSubmission,
  validateGradingSubmission,
  determineInitialStatusOnSave,
  calculateSubmissionTally,
  getAssignmentActions,
  filterAssignments,
  formatAssignmentDate,
} from '../../src/utils/assignmentValidation.ts';

import {
  mockAssignments,
  mockSubjects,
} from '../../src/services/mockAssignmentData.ts';

import assignmentReducer, {
  createAssignment,
  submitOnBehalfAndGrade,
  addStudentToAssignment,
  removeStudentFromAssignment,
  addAssignmentComment,
} from '../../src/store/slices/assignmentSlice.ts';

describe('Academics Homework (Bài Tập) Business Rules & Validation Engine', () => {
  const asg1 = mockAssignments.find((a) => a.id === 'asg-001'); // Dispatched, has submissions
  const asg2 = mockAssignments.find((a) => a.id === 'asg-002'); // Dispatched, past due, has late submission
  const asg3 = mockAssignments.find((a) => a.id === 'asg-003'); // Scheduled (Chưa gửi), specific students
  const asg4 = mockAssignments.find((a) => a.id === 'asg-004'); // Draft (Đã tạo)

  it('BR01 & BR02: Form validation enforces 4 mandatory fields and rejects empty/unassigned subjects', () => {
    // 1. Completely empty form
    const emptyResult = validateAssignmentForm({});
    assert.equal(emptyResult.isValid, false);
    assert.ok(emptyResult.errors.classId, 'Requires class');
    assert.ok(emptyResult.errors.subjectId, 'Requires subject');
    assert.ok(emptyResult.errors.title, 'Requires title');
    assert.ok(emptyResult.errors.dueDate, 'Requires due date');

    // 2. Legacy Defect Test: "Chưa có môn học" must fail validation and not allow dispatching
    const legacyDefectResult = validateAssignmentForm({
      classId: '1a1',
      subjectId: 'Chưa có môn học',
      title: 'Bài tập Toán',
      dueDate: '2026-09-30T23:59:00Z',
    });
    assert.equal(legacyDefectResult.isValid, false);
    assert.equal(legacyDefectResult.errors.subjectId, 'Vui lòng chọn môn học');

    // 3. Valid form with all 4 mandatory fields
    const validResult = validateAssignmentForm({
      classId: '1a1',
      subjectId: 'sub-01',
      title: 'Bài tập Ôn tập phép nhân',
      dueDate: '2026-09-30T23:59:00Z',
    });
    assert.equal(validResult.isValid, true);
    assert.deepEqual(validResult.errors, {});
  });

  it('BR01: Validates scheduledSendDate is chronologically before dueDate', () => {
    // Scheduled send date is AFTER due date -> error
    const invalidDates = validateAssignmentForm({
      classId: '1a1',
      subjectId: 'sub-01',
      title: 'Test Assignment',
      dueDate: '2026-09-25T17:00:00Z',
      scheduledSendDate: '2026-09-26T08:00:00Z',
    });
    assert.equal(invalidDates.isValid, false);
    assert.ok(invalidDates.errors.scheduledSendDate);
    assert.match(invalidDates.errors.scheduledSendDate, /phải trước hạn nộp bài/);

    // Scheduled send date is BEFORE due date -> valid
    const validDates = validateAssignmentForm({
      classId: '1a1',
      subjectId: 'sub-01',
      title: 'Test Assignment',
      dueDate: '2026-09-25T17:00:00Z',
      scheduledSendDate: '2026-09-20T08:00:00Z',
    });
    assert.equal(validDates.isValid, true);
  });

  it('BR03: Validates audience scope (whole_class vs specific_students)', () => {
    // specific_students without target IDs -> invalid
    const emptyTargets = validateAssignmentForm({
      classId: '1a1',
      subjectId: 'sub-01',
      title: 'Targeted Assignment',
      dueDate: '2026-09-30T23:59:00Z',
      audienceType: 'specific_students',
      targetStudentIds: [],
    });
    assert.equal(emptyTargets.isValid, false);
    assert.ok(emptyTargets.errors.targetStudentIds);

    // specific_students with target IDs -> valid
    const validTargets = validateAssignmentForm({
      classId: '1a1',
      subjectId: 'sub-01',
      title: 'Targeted Assignment',
      dueDate: '2026-09-30T23:59:00Z',
      audienceType: 'specific_students',
      targetStudentIds: ['stu-001', 'stu-002'],
    });
    assert.equal(validTargets.isValid, true);
  });

  it('BR04: Determines initial status on save (da_tao, chua_gui, da_gui)', () => {
    // 1. "Lưu nháp" always creates 'da_tao'
    assert.equal(determineInitialStatusOnSave(undefined, true), 'da_tao');
    assert.equal(determineInitialStatusOnSave('2030-01-01T00:00:00Z', true), 'da_tao');

    // 2. Future send date creates 'chua_gui'
    const futureDate = new Date(Date.now() + 86400000 * 5).toISOString();
    assert.equal(determineInitialStatusOnSave(futureDate, false), 'chua_gui');

    // 3. No send date or past date dispatches immediately as 'da_gui'
    assert.equal(determineInitialStatusOnSave(undefined, false), 'da_gui');
    assert.equal(determineInitialStatusOnSave('', false), 'da_gui');
  });

  it('BR06: Enforces asymmetric action permissions matrix across lifecycle states and submissions', () => {
    // 1. Draft (da_tao) allows Edit, Delete
    const draftActions = getAssignmentActions(asg4);
    assert.equal(draftActions.canEdit, true);
    assert.equal(draftActions.canDelete, true);

    // 2. Scheduled (chua_gui) allows Edit, Send, Delete
    const scheduledActions = getAssignmentActions(asg3);
    assert.equal(scheduledActions.canEdit, true);
    assert.equal(scheduledActions.canSend, true);
    assert.equal(scheduledActions.canDelete, true);

    // 3. Dispatched (da_gui) with submissions > 0 forbids Delete
    const dispatchedWithSubmissions = getAssignmentActions(asg1);
    assert.equal(dispatchedWithSubmissions.canEdit, true);
    assert.equal(dispatchedWithSubmissions.canSend, true);
    assert.equal(dispatchedWithSubmissions.canDelete, false, 'Cannot delete dispatched homework with student submissions');

    // 4. Dispatched (da_gui) with 0 submissions allows Delete
    const freshDispatched = {
      ...asg1,
      submissions: [
        { id: 's1', studentId: 'stu-1', studentName: 'Test', studentCode: 'HS1', status: 'chua_nop' },
      ],
    };
    const freshActions = getAssignmentActions(freshDispatched);
    assert.equal(freshActions.canDelete, true, 'Allows deleting dispatched homework if no student has submitted yet');
  });

  it('BR08 & Metrics: Calculates submission tally accurately', () => {
    const tally = calculateSubmissionTally(asg1.submissions);
    assert.equal(tally.total, 8);
    assert.equal(tally.submittedCount, 3); // 2 cham_diem + 1 da_nop
    assert.equal(tally.evaluatedCount, 2); // 2 scored
    assert.equal(tally.lateCount, 0);
    assert.equal(tally.submissionRate, 38); // 3/8 = 37.5% rounded to 38%

    const tally2 = calculateSubmissionTally(asg2.submissions);
    assert.equal(tally2.total, 8);
    assert.equal(tally2.submittedCount, 3);
    assert.equal(tally2.lateCount, 1); // Student 3 submitted late
  });

  it('BR09: Detects late submissions past due date', () => {
    const dueDate = '2026-09-20T17:00:00Z';

    // On time (before due date)
    assert.equal(isLateSubmission('2026-09-20T16:59:00Z', dueDate), false);

    // Exactly at due date
    assert.equal(isLateSubmission('2026-09-20T17:00:00Z', dueDate), false);

    // Late (after due date)
    assert.equal(isLateSubmission('2026-09-20T17:01:00Z', dueDate), true);
    assert.equal(isLateSubmission('2026-09-21T08:00:00Z', dueDate), true);
  });

  it('BR09: Enforces mandatory feedback note and valid score when grading toggle is enabled', () => {
    const dueDate = '2026-09-20T17:00:00Z';

    // 1. Grading disabled -> score and comment not required
    const noGrading = validateGradingSubmission(
      {
        assignmentId: 'asg-001',
        studentId: 'stu-004',
        submittedAt: '2026-09-20T14:00:00Z',
        isGraded: false,
      },
      dueDate
    );
    assert.equal(noGrading.isValid, true);
    assert.equal(noGrading.isLate, false);

    // 2. Grading enabled but missing score and comment -> invalid
    const missingBoth = validateGradingSubmission(
      {
        assignmentId: 'asg-001',
        studentId: 'stu-004',
        submittedAt: '2026-09-20T14:00:00Z',
        isGraded: true,
      },
      dueDate
    );
    assert.equal(missingBoth.isValid, false);
    assert.ok(missingBoth.errors.score, 'Requires score when grading is on');
    assert.ok(missingBoth.errors.teacherComment, 'Requires comment when grading is on');

    // 3. Grading enabled with invalid score (> 10)
    const invalidScore = validateGradingSubmission(
      {
        assignmentId: 'asg-001',
        studentId: 'stu-004',
        submittedAt: '2026-09-20T14:00:00Z',
        isGraded: true,
        score: 11.5,
        teacherComment: 'Con làm bài tốt',
      },
      dueDate
    );
    assert.equal(invalidScore.isValid, false);
    assert.ok(invalidScore.errors.score);
    assert.match(invalidScore.errors.score, /0\.0 đến 10\.0/);

    // 4. Grading enabled with valid score and comment, submitted late -> valid with late flag
    const validLate = validateGradingSubmission(
      {
        assignmentId: 'asg-001',
        studentId: 'stu-004',
        submittedAt: '2026-09-21T10:00:00Z', // After due date
        isGraded: true,
        score: 8.5,
        teacherComment: 'Bài làm sạch sẽ, nộp muộn 1 ngày.',
      },
      dueDate
    );
    assert.equal(validLate.isValid, true);
    assert.equal(validLate.isLate, true, 'Flags late submission past due date');
  });

  it('BR11: In edit mode, title validation is bypassed for immutability', () => {
    // When isEdit is true, title is not required in validation if locked
    const editCheck = validateAssignmentForm(
      {
        classId: '1a1',
        subjectId: 'sub-01',
        dueDate: '2026-09-30T23:59:00Z',
      },
      true // isEdit
    );
    assert.equal(editCheck.isValid, true);
  });

  it('BR12 & BR13: Filters assignments across classes, subjects, due date status, and keywords', () => {
    const fixedNow = new Date('2026-09-15T12:00:00Z').getTime();

    // 1. Filter by Class 1A1
    const classFiltered = filterAssignments(
      mockAssignments,
      { classId: '1a1', subjectId: 'all', searchQuery: '', dueDateFilter: 'tat_ca', status: 'all' },
      fixedNow
    );
    assert.equal(classFiltered.length, 4);

    // 2. Filter by Subject Toán
    const subjectFiltered = filterAssignments(
      mockAssignments,
      { classId: 'all', subjectId: 'sub-01', searchQuery: '', dueDateFilter: 'tat_ca', status: 'all' },
      fixedNow
    );
    assert.equal(subjectFiltered.length, 2);

    // 3. Filter by "Hạn nộp bài: Hết hạn nộp" (het_han: due < fixedNow)
    const expiredFiltered = filterAssignments(
      mockAssignments,
      { classId: 'all', subjectId: 'all', searchQuery: '', dueDateFilter: 'het_han', status: 'all' },
      fixedNow
    );
    assert.equal(expiredFiltered.length, 1);
    assert.equal(expiredFiltered[0].id, 'asg-002'); // Due 2026-09-10

    // 4. Keyword search by student name inside submissions
    const studentSearch = filterAssignments(
      mockAssignments,
      { classId: 'all', subjectId: 'all', searchQuery: 'Thảo My', dueDateFilter: 'tat_ca', status: 'all' },
      fixedNow
    );
    assert.equal(studentSearch.length, 1);
    assert.equal(studentSearch[0].id, 'asg-005');
  });

  it('Formats Vietnamese date display cleanly', () => {
    const formatted = formatAssignmentDate('2026-09-25T14:30:00Z');
    assert.ok(formatted.includes('2026'));
    assert.ok(formatted.includes('25'));
    assert.equal(formatAssignmentDate(undefined), '—');
  });

  describe('Redux Assignment Reducer State Transitions', () => {
    it('creates a new assignment with whole_class audience and dispatches immediately', () => {
      const initialState = {
        assignments: mockAssignments,
        subjects: mockSubjects,
        students: [
          { id: 'stu-1', studentCode: 'HS1', name: 'Nguyen A', classId: '1a1', className: 'Lớp 1A1' },
          { id: 'stu-2', studentCode: 'HS2', name: 'Tran B', classId: '1a1', className: 'Lớp 1A1' },
        ],
        selectedAssignmentId: null,
        filterCriteria: { classId: 'all', subjectId: 'all', searchQuery: '', dueDateFilter: 'tat_ca', status: 'all' },
        isFilterDrawerOpen: false,
        isSubmitGradingModalOpen: false,
        activeStudentSubmission: null,
        isManageStudentsModalOpen: false,
        activeAssignmentIdForStudents: null,
      };

      const newState = assignmentReducer(
        initialState,
        createAssignment({
          classId: '1a1',
          subjectId: 'sub-01',
          title: 'Bài tập tuần mới',
          description: 'Làm bài 1, 2',
          dueDate: '2026-09-30T23:59:00Z',
          audienceType: 'whole_class',
          targetStudentIds: [],
          attachments: [],
          createdBy: 'Cô Mai',
          isDraft: false,
        })
      );

      assert.equal(newState.assignments.length, mockAssignments.length + 1);
      const created = newState.assignments[0];
      assert.equal(created.title, 'Bài tập tuần mới');
      assert.equal(created.status, 'da_gui');
      assert.equal(created.submissions.length, 2, 'Enrolled 2 students automatically');
    });

    it('submits on behalf and evaluates grade and comment', () => {
      const initialState = {
        assignments: [
          {
            id: 'asg-test-1',
            classId: '1a1',
            className: 'Lớp 1A1',
            subjectId: 'sub-01',
            subjectName: 'Toán',
            title: 'Test',
            description: '',
            dueDate: '2026-09-25T17:00:00Z',
            status: 'da_gui',
            audienceType: 'whole_class',
            targetStudentIds: ['stu-001'],
            attachments: [],
            submissions: [
              {
                id: 'sub-1',
                studentId: 'stu-001',
                studentName: 'Minh Quân',
                studentCode: 'HS001',
                status: 'chua_nop',
              },
            ],
            comments: [],
            createdBy: 'Admin',
            createdAt: '2026-09-20T00:00:00Z',
            updatedAt: '2026-09-20T00:00:00Z',
          },
        ],
        subjects: mockSubjects,
        students: [],
        selectedAssignmentId: 'asg-test-1',
        filterCriteria: { classId: 'all', subjectId: 'all', searchQuery: '', dueDateFilter: 'tat_ca', status: 'all' },
        isFilterDrawerOpen: false,
        isSubmitGradingModalOpen: false,
        activeStudentSubmission: null,
        isManageStudentsModalOpen: false,
        activeAssignmentIdForStudents: null,
      };

      const gradedState = assignmentReducer(
        initialState,
        submitOnBehalfAndGrade({
          assignmentId: 'asg-test-1',
          studentId: 'stu-001',
          submittedAt: '2026-09-24T10:00:00Z',
          isGraded: true,
          score: 9.0,
          teacherComment: 'Làm bài xuất sắc',
          evaluatedBy: 'Cô Mai',
        })
      );

      const updatedSub = gradedState.assignments[0].submissions[0];
      assert.equal(updatedSub.status, 'cham_diem');
      assert.equal(updatedSub.score, 9.0);
      assert.equal(updatedSub.teacherComment, 'Làm bài xuất sắc');
      assert.equal(updatedSub.isLate, false);
      assert.equal(updatedSub.evaluatedBy, 'Cô Mai');
    });

    it('adds and removes students from custom audience assignment', () => {
      const initialState = {
        assignments: [
          {
            id: 'asg-test-2',
            classId: '1a1',
            className: 'Lớp 1A1',
            subjectId: 'sub-01',
            subjectName: 'Toán',
            title: 'Targeted Test',
            description: '',
            dueDate: '2026-09-25T17:00:00Z',
            status: 'da_gui',
            audienceType: 'specific_students',
            targetStudentIds: ['stu-001'],
            attachments: [],
            submissions: [
              { id: 'sub-1', studentId: 'stu-001', studentName: 'Minh Quân', studentCode: 'HS001', status: 'chua_nop' },
            ],
            comments: [],
            createdBy: 'Admin',
            createdAt: '2026-09-20T00:00:00Z',
            updatedAt: '2026-09-20T00:00:00Z',
          },
        ],
        subjects: mockSubjects,
        students: [
          { id: 'stu-002', studentCode: 'HS002', name: 'Bảo Ngọc', classId: '1a1', className: 'Lớp 1A1' },
        ],
        selectedAssignmentId: 'asg-test-2',
        filterCriteria: { classId: 'all', subjectId: 'all', searchQuery: '', dueDateFilter: 'tat_ca', status: 'all' },
        isFilterDrawerOpen: false,
        isSubmitGradingModalOpen: false,
        activeStudentSubmission: null,
        isManageStudentsModalOpen: false,
        activeAssignmentIdForStudents: null,
      };

      // Add student 2
      const addedState = assignmentReducer(
        initialState,
        addStudentToAssignment({ assignmentId: 'asg-test-2', studentId: 'stu-002' })
      );
      assert.equal(addedState.assignments[0].targetStudentIds.length, 2);
      assert.equal(addedState.assignments[0].submissions.length, 2);

      // Remove student 1
      const removedState = assignmentReducer(
        addedState,
        removeStudentFromAssignment({ assignmentId: 'asg-test-2', studentId: 'stu-001' })
      );
      assert.equal(removedState.assignments[0].targetStudentIds.length, 1);
      assert.equal(removedState.assignments[0].targetStudentIds[0], 'stu-002');
      assert.equal(removedState.assignments[0].submissions.length, 1);
    });

    it('appends discussion comments to assignment', () => {
      const initialState = {
        assignments: [
          {
            id: 'asg-test-3',
            classId: '1a1',
            className: 'Lớp 1A1',
            subjectId: 'sub-01',
            subjectName: 'Toán',
            title: 'Discussion Test',
            description: '',
            dueDate: '2026-09-25T17:00:00Z',
            status: 'da_gui',
            audienceType: 'whole_class',
            targetStudentIds: [],
            attachments: [],
            submissions: [],
            comments: [],
            createdBy: 'Admin',
            createdAt: '2026-09-20T00:00:00Z',
            updatedAt: '2026-09-20T00:00:00Z',
          },
        ],
        subjects: mockSubjects,
        students: [],
        selectedAssignmentId: 'asg-test-3',
        filterCriteria: { classId: 'all', subjectId: 'all', searchQuery: '', dueDateFilter: 'tat_ca', status: 'all' },
        isFilterDrawerOpen: false,
        isSubmitGradingModalOpen: false,
        activeStudentSubmission: null,
        isManageStudentsModalOpen: false,
        activeAssignmentIdForStudents: null,
      };

      const commentedState = assignmentReducer(
        initialState,
        addAssignmentComment({
          assignmentId: 'asg-test-3',
          authorName: 'Phụ huynh em Nam',
          authorRole: 'parent',
          content: 'Thưa cô bài 2 có cần vẽ hình không ạ?',
        })
      );

      assert.equal(commentedState.assignments[0].comments.length, 1);
      assert.equal(commentedState.assignments[0].comments[0].content, 'Thưa cô bài 2 có cần vẽ hình không ạ?');
      assert.equal(commentedState.assignments[0].comments[0].authorRole, 'parent');
    });
  });
});
