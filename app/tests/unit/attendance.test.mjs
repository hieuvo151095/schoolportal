import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCheckOut,
  checkIsLate,
  calculateAttendanceSummary,
} from '../../src/utils/attendanceValidation.ts';
import attendanceReducer, {
  checkInStudent,
  checkOutStudent,
  checkOutWithGuardian,
  bulkRecordAbsence,
  updateHealthRecord,
  toggleSelectStudent,
} from '../../src/store/slices/attendanceSlice.ts';

describe('Attendance Validation & Business Rules (Vận Hành - Điểm danh)', () => {
  describe('BR01: Check-in & Late Arrival Rule', () => {
    test('marks student as NOT late when arrival time <= 08:00', () => {
      assert.equal(checkIsLate('07:30', '08:00'), false);
      assert.equal(checkIsLate('08:00', '08:00'), false);
    });

    test('marks student as late (Đến muộn) when arrival time > 08:00', () => {
      assert.equal(checkIsLate('08:01', '08:00'), true);
      assert.equal(checkIsLate('08:25', '08:00'), true);
    });
  });

  describe('BR02: Check-out Validation Rule (MSG01 & MSG02)', () => {
    test('rejects checkout with MSG02 if student has not been checked in (arrivalTime is null)', () => {
      const result = validateCheckOut(null, '16:30');
      assert.equal(result.valid, false);
      assert.equal(result.error, 'Chưa nhập thời gian đón học sinh.');
    });

    test('rejects checkout with MSG01 if departure time <= arrival time', () => {
      const equalResult = validateCheckOut('08:00', '08:00');
      assert.equal(equalResult.valid, false);
      assert.equal(equalResult.error, 'Giờ trả học sinh phải lớn hơn giờ đón học sinh');

      const earlierResult = validateCheckOut('08:30', '07:45');
      assert.equal(earlierResult.valid, false);
      assert.equal(earlierResult.error, 'Giờ trả học sinh phải lớn hơn giờ đón học sinh');
    });

    test('accepts checkout when departure time > arrival time', () => {
      const validResult = validateCheckOut('07:45', '16:30');
      assert.equal(validResult.valid, true);
      assert.equal(validResult.error, undefined);
    });
  });

  describe('BR03: Attendance Summary Calculation', () => {
    test('computes correct roster counts across all statuses', () => {
      const mockList = [
        { status: 'present' },
        { status: 'present' },
        { status: 'excused_absent' },
        { status: 'unexcused_absent' },
        { status: 'unmarked' },
        { status: 'unmarked' },
      ];

      const summary = calculateAttendanceSummary(mockList);
      assert.deepEqual(summary, {
        totalStudents: 6,
        presentCount: 2,
        absentExcusedCount: 1,
        absentUnexcusedCount: 1,
        unmarkedCount: 2,
      });
    });
  });

  describe('Redux Attendance Reducer State Transitions', () => {
    test('checkInStudent updates student status and checks late status correctly', () => {
      const state = attendanceReducer(undefined, checkInStudent({
        studentId: 'st-005', // unmarked student in mock data
        arrivalTime: '08:15',
      }));

      const student = state.students.find((s) => s.studentId === 'st-005');
      assert.ok(student);
      assert.equal(student.status, 'present');
      assert.equal(student.arrivalTime, '08:15');
      assert.equal(student.isLate, true);
      assert.ok(state.successMessage?.includes('Đến muộn'));
    });

    test('checkOutStudent sets error MSG02 when checking out an unmarked student with no arrival', () => {
      const state = attendanceReducer(undefined, checkOutStudent({
        studentId: 'st-005', // unmarked student
        departureTime: '16:30',
      }));

      assert.equal(state.errorMessage, 'Chưa nhập thời gian đón học sinh.');
      const student = state.students.find((s) => s.studentId === 'st-005');
      assert.equal(student.departureTime, null);
    });

    test('checkOutStudent sets error MSG01 when departure time <= arrival time', () => {
      const state = attendanceReducer(undefined, checkOutStudent({
        studentId: 'st-001', // arrivalTime is 07:35
        departureTime: '07:30',
      }));

      assert.equal(state.errorMessage, 'Giờ trả học sinh phải lớn hơn giờ đón học sinh');
      const student = state.students.find((s) => s.studentId === 'st-001');
      assert.equal(student.departureTime, null);
    });

    test('checkOutStudent records valid departure time', () => {
      const state = attendanceReducer(undefined, checkOutStudent({
        studentId: 'st-001', // arrivalTime is 07:35
        departureTime: '16:45',
      }));

      assert.equal(state.errorMessage, null);
      assert.ok(state.successMessage?.includes('16:45'));
      const student = state.students.find((s) => s.studentId === 'st-001');
      assert.equal(student.departureTime, '16:45');
    });

    test('checkOutWithGuardian assigns authorized guardian and records departure (BR09)', () => {
      const state = attendanceReducer(undefined, checkOutWithGuardian({
        studentId: 'st-001',
        departureTime: '17:00',
        guardianId: 'g-001',
        guardianName: 'Nguyễn Văn Hùng (Bố)',
      }));

      const student = state.students.find((s) => s.studentId === 'st-001');
      assert.equal(student.departureTime, '17:00');
      assert.equal(student.pickupGuardianId, 'g-001');
      assert.equal(student.pickupGuardianName, 'Nguyễn Văn Hùng (Bố)');
      assert.equal(state.isPickupModalOpen, false);
    });

    test('bulkRecordAbsence updates selected students to excused absence with refund (BR04)', () => {
      let state = attendanceReducer(undefined, toggleSelectStudent('st-005'));
      state = attendanceReducer(state, toggleSelectStudent('st-007'));
      assert.deepEqual(state.selectedStudentIds, ['st-005', 'st-007']);

      state = attendanceReducer(state, bulkRecordAbsence({
        absentType: 'excused_absent',
        refundEligible: true,
        notes: 'Phụ huynh xin nghỉ có phép qua hotline',
      }));

      const st5 = state.students.find((s) => s.studentId === 'st-005');
      const st7 = state.students.find((s) => s.studentId === 'st-007');

      assert.equal(st5.status, 'excused_absent');
      assert.equal(st5.refundEligible, true);
      assert.equal(st5.notes, 'Phụ huynh xin nghỉ có phép qua hotline');

      assert.equal(st7.status, 'excused_absent');
      assert.equal(st7.refundEligible, true);
      assert.equal(st7.notes, 'Phụ huynh xin nghỉ có phép qua hotline');

      assert.equal(state.selectedStudentIds.length, 0);
      assert.equal(state.isBulkAbsentModalOpen, false);
    });

    test('updateHealthRecord updates temperature and health condition', () => {
      const state = attendanceReducer(undefined, updateHealthRecord({
        studentId: 'st-001',
        temperature: 37.8,
        healthCondition: 'Cảm sốt',
      }));

      const student = state.students.find((s) => s.studentId === 'st-001');
      assert.equal(student.temperature, 37.8);
      assert.equal(student.healthCondition, 'Cảm sốt');
      assert.ok(state.successMessage?.includes('37.8°C'));
    });

    test('setSelectedClassId switches roster to selected class', () => {
      let state = attendanceReducer(undefined, { type: 'attendance/setSelectedClassId', payload: 'lop-6a1' });
      assert.equal(state.selectedClassId, 'lop-6a1');
      assert.ok(state.students.length > 0);
      assert.ok(state.students.some((s) => s.fullName === 'Nguyễn Việt Hoàng'));

      state = attendanceReducer(state, { type: 'attendance/setSelectedClassId', payload: 'lop-la-1' });
      assert.equal(state.selectedClassId, 'lop-la-1');
      assert.ok(state.students.some((s) => s.fullName.includes('Bé Bông')));
    });

    test('setSelectedDate for past date loads historical records', () => {
      const state = attendanceReducer(undefined, { type: 'attendance/setSelectedDate', payload: '2026-09-01' });
      assert.equal(state.selectedDate, '2026-09-01');
      // In past date, some students are present and have arrival times
      const hasPresent = state.students.some((s) => s.status === 'present' && s.arrivalTime !== null);
      assert.ok(hasPresent, 'Past date must have present students with arrival times');
      assert.ok(state.summary.totalStudents > 0);
    });

    test('setSelectedDate for future date returns all unmarked students with no data yet', () => {
      const futureDate = '2099-12-31';
      const state = attendanceReducer(undefined, { type: 'attendance/setSelectedDate', payload: futureDate });
      assert.equal(state.selectedDate, futureDate);
      // In future date, all students must be unmarked
      for (const student of state.students) {
        assert.equal(student.status, 'unmarked', `Student ${student.fullName} should be unmarked in future`);
        assert.equal(student.arrivalTime, null);
        assert.equal(student.departureTime, null);
      }
      assert.equal(state.summary.presentCount, 0);
      assert.equal(state.summary.unmarkedCount, state.students.length);
    });
  });

  describe('Multi-Class Mock Registry & Calendar Engine', () => {
    test('CLASSES_LIST contains all 7 standardized classes across primary, secondary, high school, and kindergarten', async () => {
      const { CLASSES_LIST } = await import('../../src/services/mockAttendanceData.ts');
      assert.equal(CLASSES_LIST.length, 7);
      const ids = CLASSES_LIST.map((c) => c.id);
      assert.ok(ids.includes('lop-1a1'));
      assert.ok(ids.includes('lop-1a2'));
      assert.ok(ids.includes('lop-2a1'));
      assert.ok(ids.includes('lop-6a1'));
      assert.ok(ids.includes('lop-6a2'));
      assert.ok(ids.includes('lop-12a1'));
      assert.ok(ids.includes('lop-la-1'));
    });

    test('getAttendanceForDateAndClass produces empty unmarked roster for future date', async () => {
      const { getAttendanceForDateAndClass, isFutureDate } = await import('../../src/services/mockAttendanceData.ts');
      assert.equal(isFutureDate('2099-01-01'), true);
      assert.equal(isFutureDate('2020-01-01'), false);

      const futureRoster = getAttendanceForDateAndClass('2099-01-01', 'lop-1a1');
      assert.ok(futureRoster.length > 0);
      assert.ok(futureRoster.every((s) => s.status === 'unmarked' && s.arrivalTime === null && s.departureTime === null));
    });
  });

  describe('Global Top-Right Toast Redux Slice', () => {
    test('manages toast notifications lifecycle', async () => {
      const { default: toastReducer, addToast, removeToast, clearAllToasts } = await import('../../src/store/slices/toastSlice.ts');
      let state = toastReducer(undefined, addToast({
        id: 'toast-1',
        type: 'success',
        message: 'Thao tác thành công',
      }));

      assert.equal(state.toasts.length, 1);
      assert.equal(state.toasts[0].message, 'Thao tác thành công');
      assert.equal(state.toasts[0].type, 'success');

      state = toastReducer(state, removeToast('toast-1'));
      assert.equal(state.toasts.length, 0);

      state = toastReducer(state, addToast({ message: 'Thông báo 1' }));
      state = toastReducer(state, addToast({ message: 'Thông báo 2' }));
      assert.equal(state.toasts.length, 2);

      state = toastReducer(state, clearAllToasts());
      assert.equal(state.toasts.length, 0);
    });
  });

  describe('Class Switching & Bulk Timer Confirmations', () => {
    test('setSelectedClassId dynamically changes student roster to the new class', () => {
      // Initially in lop-1a1
      let state = attendanceReducer(undefined, { type: 'attendance/setSelectedClassId', payload: 'lop-1a2' });
      assert.equal(state.selectedClassId, 'lop-1a2');
      assert.ok(state.students.length > 0);
      assert.equal(state.students[0].fullName, 'Hoàng Đức Minh');

      // Switch to lop-2a1
      state = attendanceReducer(state, { type: 'attendance/setSelectedClassId', payload: 'lop-2a1' });
      assert.equal(state.selectedClassId, 'lop-2a1');
      assert.equal(state.students[0].fullName, 'Lê Quốc Bảo');
    });

    test('bulkCheckInSelected applies adjusted timer to all selected students', () => {
      // Select two students
      let state = attendanceReducer(undefined, toggleSelectStudent('st-001'));
      state = attendanceReducer(state, toggleSelectStudent('st-002'));
      assert.equal(state.selectedStudentIds.length, 2);

      // Confirm bulk check in with adjusted time 07:15
      state = attendanceReducer(state, {
        type: 'attendance/bulkCheckInSelected',
        payload: { arrivalTime: '07:15' },
      });

      const st1 = state.students.find((s) => s.studentId === 'st-001');
      const st2 = state.students.find((s) => s.studentId === 'st-002');
      assert.equal(st1.arrivalTime, '07:15');
      assert.equal(st1.status, 'present');
      assert.equal(st1.isLate, false);
      assert.equal(st2.arrivalTime, '07:15');
      assert.equal(st2.status, 'present');
      assert.equal(st2.isLate, false);
      assert.equal(state.selectedStudentIds.length, 0);
    });

    test('bulkCheckOutSelected skips students who have not been checked in yet', () => {
      // Select checked-in student st-001 (arrivalTime: 07:35) and unmarked student st-005 (arrivalTime: null)
      let state = attendanceReducer(undefined, toggleSelectStudent('st-001'));
      state = attendanceReducer(state, toggleSelectStudent('st-005'));
      assert.equal(state.selectedStudentIds.length, 2);

      // Confirm bulk check out with adjusted time 16:45
      state = attendanceReducer(state, {
        type: 'attendance/bulkCheckOutSelected',
        payload: { departureTime: '16:45' },
      });

      const st1 = state.students.find((s) => s.studentId === 'st-001');
      const st5 = state.students.find((s) => s.studentId === 'st-005');

      // st-001 was checked in, so departure time is updated
      assert.equal(st1.departureTime, '16:45');
      assert.equal(st1.status, 'present');

      // st-005 was not checked in, so st-005 is skipped
      assert.equal(st5.departureTime, null);
      assert.equal(st5.status, 'unmarked');

      // Success message indicates 1 student checked out and 1 skipped
      assert.ok(state.successMessage?.includes('Đã trả 1 học sinh'));
      assert.ok(state.successMessage?.includes('1 học sinh bỏ qua'));
      assert.equal(state.selectedStudentIds.length, 0);
    });

    test('bulkCheckOutSelected sets error if all selected students are not checked in', () => {
      // Select only unmarked student st-005
      let state = attendanceReducer(undefined, toggleSelectStudent('st-005'));
      assert.equal(state.selectedStudentIds.length, 1);

      // Confirm bulk check out
      state = attendanceReducer(state, {
        type: 'attendance/bulkCheckOutSelected',
        payload: { departureTime: '16:45' },
      });

      const st5 = state.students.find((s) => s.studentId === 'st-005');
      assert.equal(st5.departureTime, null);
      assert.ok(state.errorMessage?.includes('chưa được điểm danh đón'));
    });

    test('updateStudentAttendanceTime updates arrival and departure times after attendance', () => {
      // 1. Edit arrival time
      let state = attendanceReducer(undefined, {
        type: 'attendance/updateStudentAttendanceTime',
        payload: { studentId: 'st-001', type: 'arrivalTime', time: '08:15' },
      });
      let st1 = state.students.find((s) => s.studentId === 'st-001');
      assert.equal(st1.arrivalTime, '08:15');
      assert.equal(st1.isLate, true);
      assert.ok(state.successMessage?.includes('08:15'));

      // 2. Edit departure time
      state = attendanceReducer(state, {
        type: 'attendance/updateStudentAttendanceTime',
        payload: { studentId: 'st-001', type: 'departureTime', time: '17:00' },
      });
      st1 = state.students.find((s) => s.studentId === 'st-001');
      assert.equal(st1.departureTime, '17:00');

      // 3. Rejects invalid departure time <= arrival time
      state = attendanceReducer(state, {
        type: 'attendance/updateStudentAttendanceTime',
        payload: { studentId: 'st-001', type: 'departureTime', time: '08:00' },
      });
      st1 = state.students.find((s) => s.studentId === 'st-001');
      assert.equal(st1.departureTime, '17:00');
      assert.ok(state.errorMessage?.includes('phải sau giờ đón'));
    });
  });
});
