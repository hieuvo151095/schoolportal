import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNutritionSummary,
  applyBulkCareToRecords,
  createEmptyCareRecord,
  createDefaultMealCare,
  createDefaultSleepCare,
} from '../../src/utils/nutritionValidation.ts';
import { getCareRecordsForDateAndClass } from '../../src/services/mockNutritionData.ts';
import nutritionReducer, {
  setSelectedDate,
  setSelectedClassId,
  syncWithAttendance,
  setSearchQuery,
  setStatusFilter,
  setMealFilter,
  toggleSelectStudent,
  toggleSelectAll,
  clearSelection,
  openSingleStudentCare,
  openBulkCare,
  closeSlideOver,
  saveStudentCareRecord,
  saveBulkCareRecord,
  resetStudentCare,
} from '../../src/store/slices/nutritionSlice.ts';

describe('Vận Hành - Chăm Sóc Trẻ (Nutrition & Daily Care Unit Tests)', () => {
  const mockStudent1 = {
    studentId: 'st-001',
    studentCode: 'HS-001',
    fullName: 'Nguyễn Minh Khang',
    nickname: 'Bé Khang',
    avatarUrl: '/avatar1.jpg',
    gender: 'male',
    parentName: 'Nguyễn Văn Hùng',
    parentPhone: '0912345678',
    classId: 'lop-1a1',
  };

  const mockStudent2 = {
    studentId: 'st-002',
    studentCode: 'HS-002',
    fullName: 'Trần Bảo Ngọc',
    nickname: 'Bảo Bảo',
    avatarUrl: '/avatar2.jpg',
    gender: 'female',
    parentName: 'Trần Đình Trọng',
    parentPhone: '0912345680',
    classId: 'lop-1a1',
  };

  describe('Nutrition Validation & Calculations', () => {
    test('calculateNutritionSummary calculates counts correctly', () => {
      const rec1 = {
        ...createEmptyCareRecord(mockStudent1, '2026-11-17'),
        isEvaluated: true,
        meals: {
          breakfast: createDefaultMealCare(),
          lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: '' },
          snack: createDefaultMealCare(),
        },
        sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: '' },
      };

      const rec2 = {
        ...createEmptyCareRecord(mockStudent2, '2026-11-17'),
        isEvaluated: false,
      };

      const summary = calculateNutritionSummary([rec1, rec2]);
      assert.equal(summary.totalStudents, 2);
      assert.equal(summary.evaluatedCount, 1);
      assert.equal(summary.pendingCount, 1);
      assert.equal(summary.ateFullPortionCount, 1);
      assert.equal(summary.sleptWellCount, 1);
    });

    test('applyBulkCareToRecords applies updates to selected students and leaves others untouched', () => {
      const rec1 = createEmptyCareRecord(mockStudent1, '2026-11-17');
      const rec2 = createEmptyCareRecord(mockStudent2, '2026-11-17');

      const bulkPayload = {
        studentIds: ['st-001'],
        meals: {
          lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn nhanh nhẹn' },
        },
        sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ sâu' },
        generalNote: 'Bé rất ngoan',
      };

      const results = applyBulkCareToRecords([rec1, rec2], bulkPayload, 'Cô Giáo Viên');

      // rec1 was updated
      const updatedRec1 = results.find((r) => r.studentId === 'st-001');
      assert.equal(updatedRec1.isEvaluated, true);
      assert.equal(updatedRec1.meals.lunch.amount, 'an_het_suat');
      assert.equal(updatedRec1.meals.lunch.note, 'Ăn nhanh nhẹn');
      assert.equal(updatedRec1.sleep.duration, 'ngu_sau');
      assert.equal(updatedRec1.generalNote, 'Bé rất ngoan');
      assert.equal(updatedRec1.updatedBy, 'Cô Giáo Viên');

      // rec2 remains untouched
      const updatedRec2 = results.find((r) => r.studentId === 'st-002');
      assert.equal(updatedRec2.isEvaluated, false);
    });
  });

  describe('Nutrition Redux Slice State & Actions', () => {
    test('initial state loads records and summary', () => {
      const state = nutritionReducer(undefined, { type: 'unknown' });
      assert.ok(state.records.length > 0);
      assert.equal(state.selectedDate, '2026-11-17');
      assert.equal(state.selectedClassId, 'lop-1a1');
      assert.ok(state.summary.totalStudents > 0);
    });

    test('setSelectedDate changes date and clears selection', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });
      state = nutritionReducer(state, toggleSelectStudent('st-001'));
      assert.equal(state.selectedStudentIds.length, 1);

      state = nutritionReducer(state, setSelectedDate('2026-11-18'));
      assert.equal(state.selectedDate, '2026-11-18');
      assert.equal(state.selectedStudentIds.length, 0);
    });

    test('setSelectedClassId switches class', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });
      state = nutritionReducer(state, setSelectedClassId('3'));
      assert.equal(state.selectedClassId, '3');
      assert.ok(state.records.some((r) => r.classId === '3'));
    });

    test('toggleSelectStudent adds and removes student id', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });
      state = nutritionReducer(state, toggleSelectStudent('st-001'));
      assert.deepEqual(state.selectedStudentIds, ['st-001']);

      state = nutritionReducer(state, toggleSelectStudent('st-002'));
      assert.deepEqual(state.selectedStudentIds, ['st-001', 'st-002']);

      state = nutritionReducer(state, toggleSelectStudent('st-001'));
      assert.deepEqual(state.selectedStudentIds, ['st-002']);
    });

    test('toggleSelectAll toggles all visible ids', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });
      state = nutritionReducer(state, toggleSelectAll(['st-001', 'st-002']));
      assert.deepEqual(state.selectedStudentIds, ['st-001', 'st-002']);

      state = nutritionReducer(state, toggleSelectAll(['st-001', 'st-002']));
      assert.deepEqual(state.selectedStudentIds, []);
    });

    test('openBulkCare sets isBulkMode and opens slideover', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });
      // Cannot open bulk care with 0 students selected
      state = nutritionReducer(state, openBulkCare());
      assert.equal(state.isSlideOverOpen, false);

      // Select 2 students and open bulk care
      state = nutritionReducer(state, toggleSelectStudent('st-001'));
      state = nutritionReducer(state, toggleSelectStudent('st-002'));
      state = nutritionReducer(state, openBulkCare());
      assert.equal(state.isSlideOverOpen, true);
      assert.equal(state.isBulkMode, true);
      assert.equal(state.activeStudentId, null);
    });

    test('saveBulkCareRecord applies changes to multiple students simultaneously', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });
      state = nutritionReducer(state, toggleSelectStudent('st-001'));
      state = nutritionReducer(state, toggleSelectStudent('st-002'));
      state = nutritionReducer(state, openBulkCare());

      state = nutritionReducer(
        state,
        saveBulkCareRecord({
          studentIds: ['st-001', 'st-002'],
          meals: {
            lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết trưa' },
          },
          sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ ngon' },
          generalNote: 'Cả nhóm học sinh ăn ngủ rất đúng giờ.',
        })
      );

      assert.equal(state.isSlideOverOpen, false);
      assert.equal(state.isBulkMode, false);

      const s1 = state.records.find((r) => r.studentId === 'st-001');
      const s2 = state.records.find((r) => r.studentId === 'st-002');
      assert.equal(s1.isEvaluated, true);
      assert.equal(s1.meals.lunch.amount, 'an_het_suat');
      assert.equal(s2.isEvaluated, true);
      assert.equal(s2.meals.lunch.amount, 'an_het_suat');
    });

    test('resetStudentCare sets student isEvaluated back to false', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });
      const firstStudent = state.records[0];

      state = nutritionReducer(state, resetStudentCare(firstStudent.studentId));
      const found = state.records.find((r) => r.studentId === firstStudent.studentId);
      assert.equal(found.isEvaluated, false);
    });
  });

  describe('Business Rule: Điểm danh đón vào lớp là điều kiện tiên quyết cho Chăm sóc (Attendance Prerequisite)', () => {
    test('returns empty array when NO students have checked in for the day (all unmarked or absent)', () => {
      const emptyAttendance = [
        {
          studentId: 'st-001',
          studentCode: 'HS-001',
          fullName: 'Nguyễn Minh Khang',
          avatarUrl: '',
          gender: 'male',
          arrivalTime: null,
          departureTime: null,
          status: 'unmarked',
          isLate: false,
          temperature: 37,
          healthCondition: 'Bình thường',
          notes: '',
          pickupGuardianId: null,
          pickupGuardianName: null,
          refundEligible: false,
          guardians: [],
        },
        {
          studentId: 'st-002',
          studentCode: 'HS-002',
          fullName: 'Trần Bảo Ngọc',
          avatarUrl: '',
          gender: 'female',
          arrivalTime: null,
          departureTime: null,
          status: 'excused_absent',
          isLate: false,
          temperature: 37,
          healthCondition: 'Cảm sốt',
          notes: '',
          pickupGuardianId: null,
          pickupGuardianName: null,
          refundEligible: true,
          guardians: [],
        },
      ];

      const careRecords = getCareRecordsForDateAndClass('2026-11-20', 'lop-1a1', emptyAttendance);
      assert.equal(careRecords.length, 0, 'Care roster must be empty when no student is present/checked-in');
    });

    test('strictly filters care roster to ONLY include students with status=present and arrivalTime', () => {
      const mixedAttendance = [
        {
          studentId: 'st-001',
          studentCode: 'HS-001',
          fullName: 'Nguyễn Minh Khang',
          avatarUrl: '',
          gender: 'male',
          arrivalTime: '07:45',
          departureTime: null,
          status: 'present',
          isLate: false,
          temperature: 36.8,
          healthCondition: 'Bình thường',
          notes: '',
          pickupGuardianId: null,
          pickupGuardianName: null,
          refundEligible: false,
          guardians: [],
        },
        {
          studentId: 'st-002',
          studentCode: 'HS-002',
          fullName: 'Trần Bảo Ngọc',
          avatarUrl: '',
          gender: 'female',
          arrivalTime: null,
          departureTime: null,
          status: 'excused_absent',
          isLate: false,
          temperature: 37,
          healthCondition: 'Bình thường',
          notes: '',
          pickupGuardianId: null,
          pickupGuardianName: null,
          refundEligible: true,
          guardians: [],
        },
      ];

      const careRecords = getCareRecordsForDateAndClass('2026-11-17', 'lop-1a1', mixedAttendance);
      assert.equal(careRecords.length, 1);
      assert.equal(careRecords[0].studentId, 'st-001');
      assert.equal(careRecords[0].arrivalTime, '07:45');
      assert.equal(careRecords[0].attendanceStatus, 'present');
    });

    test('syncWithAttendance updates the care records when attendance changes dynamically', () => {
      let state = nutritionReducer(undefined, { type: 'unknown' });

      // Simulate student 2 arriving late and getting checked in
      const updatedAttendance = [
        {
          studentId: 'st-001',
          studentCode: 'HS-001',
          fullName: 'Nguyễn Minh Khang',
          avatarUrl: '',
          gender: 'male',
          arrivalTime: '07:35',
          departureTime: null,
          status: 'present',
          isLate: false,
          temperature: 36.8,
          healthCondition: 'Bình thường',
          notes: '',
          pickupGuardianId: null,
          pickupGuardianName: null,
          refundEligible: false,
          guardians: [],
        },
        {
          studentId: 'st-002',
          studentCode: 'HS-002',
          fullName: 'Trần Bảo Ngọc',
          avatarUrl: '',
          gender: 'female',
          arrivalTime: '08:30',
          departureTime: null,
          status: 'present',
          isLate: true,
          temperature: 37,
          healthCondition: 'Bình thường',
          notes: '',
          pickupGuardianId: null,
          pickupGuardianName: null,
          refundEligible: false,
          guardians: [],
        },
      ];

      state = nutritionReducer(
        state,
        syncWithAttendance({
          attendanceList: updatedAttendance,
          date: '2026-11-17',
          classId: 'lop-1a1',
        })
      );

      assert.equal(state.records.length, 2);
      assert.ok(state.records.some((r) => r.studentId === 'st-001'));
      assert.ok(state.records.some((r) => r.studentId === 'st-002' && r.arrivalTime === '08:30'));
    });
  });
});
