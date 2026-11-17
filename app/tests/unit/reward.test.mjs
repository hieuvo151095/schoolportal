import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRewardSummary,
  generateDefaultMonthHistory,
} from '../../src/utils/rewardValidation.ts';
import { getRewardRecordsForClassAndWeek } from '../../src/services/mockRewardData.ts';
import rewardReducer, {
  setSelectedClassId,
  setSelectedWeekNumber,
  setSearchQuery,
  setStatusFilter,
  toggleSelectStudent,
  toggleSelectAll,
  clearSelection,
  toggleAwardStudent,
  updateTeacherComment,
  bulkAwardSelected,
  bulkUnawardSelected,
  saveRewardChanges,
  publishWeeklyRewards,
  openDetailSlideOver,
  closeDetailSlideOver,
} from '../../src/store/slices/rewardSlice.ts';

describe('Vận Hành - Phiếu Bé Ngoan (Reward Certificate Unit Tests)', () => {
  const sampleRecords = [
    {
      studentId: 'st-001',
      studentCode: 'HS-001',
      fullName: 'Nguyễn Minh Khang',
      avatarUrl: '/avatar1.jpg',
      gender: 'male',
      parentName: 'Nguyễn Văn Hùng',
      parentPhone: '0912345678',
      classId: 'lop-1a1',
      weekNumber: 29,
      weekRange: '16/11 - 20/11/2026',
      monthWeek: 3,
      isAwarded: true,
      isPublished: true,
      publishedAt: '18:11 16/11/2026',
      excusedAbsenceCount: 0,
      unexcusedAbsenceCount: 0,
      teacherComment: 'Bé ngoan, ăn hết suất',
      monthHistory: generateDefaultMonthHistory(3, true),
    },
    {
      studentId: 'st-002',
      studentCode: 'HS-002',
      fullName: 'Trần Bảo Ngọc',
      avatarUrl: '/avatar2.jpg',
      gender: 'female',
      parentName: 'Trần Đình Trọng',
      parentPhone: '0912345680',
      classId: 'lop-1a1',
      weekNumber: 29,
      weekRange: '16/11 - 20/11/2026',
      monthWeek: 3,
      isAwarded: false,
      isPublished: false,
      excusedAbsenceCount: 1,
      unexcusedAbsenceCount: 0,
      teacherComment: 'Cần chú ý ăn nhanh hơn',
      monthHistory: generateDefaultMonthHistory(3, false),
    },
    {
      studentId: 'st-003',
      studentCode: 'HS-003',
      fullName: 'Lê Hoàng Long',
      avatarUrl: '/avatar3.jpg',
      gender: 'male',
      parentName: 'Lê Hải Đăng',
      parentPhone: '0912345682',
      classId: 'lop-1a1',
      weekNumber: 29,
      weekRange: '16/11 - 20/11/2026',
      monthWeek: 3,
      isAwarded: true,
      isPublished: false,
      excusedAbsenceCount: 0,
      unexcusedAbsenceCount: 2,
      teacherComment: 'Tích cực tham gia trò chơi',
      monthHistory: generateDefaultMonthHistory(3, true),
    },
  ];

  describe('Validation & Calculation Utilities', () => {
    test('calculateRewardSummary calculates statistics accurately', () => {
      const summary = calculateRewardSummary(sampleRecords);
      assert.equal(summary.totalStudents, 3);
      assert.equal(summary.awardedCount, 2);
      assert.equal(summary.unawardedCount, 1);
      assert.equal(summary.publishedCount, 1);
      assert.equal(summary.fullAttendanceCount, 1); // st-001 has 0 absences
    });

    test('generateDefaultMonthHistory builds 4 weeks correctly', () => {
      const history = generateDefaultMonthHistory(2, true);
      assert.equal(history.length, 4);
      assert.equal(history[0].week, 1);
      assert.equal(history[1].week, 2);
      assert.equal(history[1].isAwarded, true);
      assert.equal(history[2].week, 3);
      assert.equal(history[3].week, 4);
      assert.ok(history[0].weekLabel.includes('Tuần 1'));
    });

    test('getRewardRecordsForClassAndWeek returns records for mock classes', () => {
      const records1a1 = getRewardRecordsForClassAndWeek('lop-1a1', 29);
      assert.ok(records1a1.length > 0);
      assert.equal(records1a1[0].classId, 'lop-1a1');
      assert.equal(records1a1[0].weekNumber, 29);

      const recordsChổi = getRewardRecordsForClassAndWeek('3', 29);
      assert.ok(recordsChổi.length > 0);
      assert.equal(recordsChổi[0].classId, '3');
    });
  });

  describe('Reward Redux Reducer & Actions', () => {
    let initialState;

    test('Loads initial state correctly', () => {
      initialState = rewardReducer(undefined, { type: '@@INIT' });
      assert.equal(initialState.selectedClassId, 'lop-1a1');
      assert.equal(initialState.selectedWeekNumber, 29);
      assert.ok(initialState.records.length > 0);
      assert.equal(initialState.statusFilter, 'all');
      assert.equal(initialState.hasUnsavedChanges, false);
    });

    test('toggleAwardStudent flips award status and marks unsaved', () => {
      const firstStudent = initialState.records[0];
      const initialAwarded = firstStudent.isAwarded;

      const state = rewardReducer(initialState, toggleAwardStudent(firstStudent.studentId));
      const updatedStudent = state.records.find((r) => r.studentId === firstStudent.studentId);

      assert.equal(updatedStudent.isAwarded, !initialAwarded);
      assert.equal(state.hasUnsavedChanges, true);
      // History for current monthWeek should also be updated
      const historyItem = updatedStudent.monthHistory.find((m) => m.week === updatedStudent.monthWeek);
      assert.equal(historyItem.isAwarded, !initialAwarded);
    });

    test('updateTeacherComment updates comment and month history', () => {
      const firstStudent = initialState.records[0];
      const newComment = 'Bé hát rất hay trong giờ âm nhạc';

      const state = rewardReducer(
        initialState,
        updateTeacherComment({ studentId: firstStudent.studentId, comment: newComment })
      );
      const updatedStudent = state.records.find((r) => r.studentId === firstStudent.studentId);

      assert.equal(updatedStudent.teacherComment, newComment);
      assert.equal(state.hasUnsavedChanges, true);
    });

    test('bulkAwardSelected and bulkUnawardSelected operate on target IDs', () => {
      const targetIds = [initialState.records[0].studentId, initialState.records[1].studentId];

      // Bulk award
      const stateAwarded = rewardReducer(initialState, bulkAwardSelected(targetIds));
      for (const id of targetIds) {
        const student = stateAwarded.records.find((r) => r.studentId === id);
        assert.equal(student.isAwarded, true);
      }

      // Bulk unaward
      const stateUnawarded = rewardReducer(stateAwarded, bulkUnawardSelected(targetIds));
      for (const id of targetIds) {
        const student = stateUnawarded.records.find((r) => r.studentId === id);
        assert.equal(student.isAwarded, false);
      }
    });

    test('publishWeeklyRewards publishes all awarded students', () => {
      // First ensure student 0 is awarded
      let state = rewardReducer(initialState, bulkAwardSelected([initialState.records[0].studentId]));
      state = rewardReducer(state, publishWeeklyRewards());

      const awardedStudent = state.records.find((r) => r.studentId === initialState.records[0].studentId);
      assert.equal(awardedStudent.isPublished, true);
      assert.ok(awardedStudent.publishedAt);
      assert.equal(state.hasUnsavedChanges, false);
    });

    test('SlideOver open and close actions', () => {
      const studentId = initialState.records[0].studentId;
      let state = rewardReducer(initialState, openDetailSlideOver(studentId));
      assert.equal(state.isDetailSlideOverOpen, true);
      assert.equal(state.activeStudentId, studentId);

      state = rewardReducer(state, closeDetailSlideOver());
      assert.equal(state.isDetailSlideOverOpen, false);
      assert.equal(state.activeStudentId, null);
    });

    test('Class and Week selection changes records and resets selection', () => {
      let state = rewardReducer(initialState, toggleSelectStudent('st-001'));
      assert.equal(state.selectedStudentIds.length, 1);

      state = rewardReducer(state, setSelectedClassId('3'));
      assert.equal(state.selectedClassId, '3');
      assert.equal(state.selectedStudentIds.length, 0);

      state = rewardReducer(state, setSelectedWeekNumber(28));
      assert.equal(state.selectedWeekNumber, 28);
    });
  });
});
