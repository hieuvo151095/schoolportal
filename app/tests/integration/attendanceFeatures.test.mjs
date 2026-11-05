import http from 'node:http';
import assert from 'node:assert/strict';
import {
  CLASSES_LIST,
  CLASS_STUDENTS_REGISTRY,
  getAttendanceForDateAndClass,
  isFutureDate,
} from '../../src/services/mockAttendanceData.ts';
import attendanceReducer, {
  setSelectedClassId,
  setSelectedDate,
  updateHealthRecord,
} from '../../src/store/slices/attendanceSlice.ts';
import toastReducer, {
  addToast,
  removeToast,
  clearAllToasts,
} from '../../src/store/slices/toastSlice.ts';

async function fetchPage(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('--- STARTING VERIFICATION OF ALL 4 ATTENDANCE ENHANCEMENTS ---');

  // 1. Verify Page Returns HTTP 200
  const res = await fetchPage('/demo/class/lop-1a1/attendance');
  assert.equal(res.statusCode, 200, 'Page must return HTTP 200');
  assert.ok(res.body.includes('Điểm danh'), 'Page title or content must mention Điểm danh');
  console.log('✓ 1. HTTP 200 OK for /demo/class/lop-1a1/attendance');

  // 2. Requirement 1: Mock data for all classes
  assert.equal(CLASSES_LIST.length, 7, 'Must have exactly 7 standardized classes');
  const expectedClasses = ['lop-1a1', 'lop-1a2', 'lop-2a1', 'lop-6a1', 'lop-6a2', 'lop-12a1', 'lop-la-1'];
  for (const cid of expectedClasses) {
    const classInfo = CLASSES_LIST.find((c) => c.id === cid);
    assert.ok(classInfo, `Class ${cid} must exist in CLASSES_LIST`);
    const roster = CLASS_STUDENTS_REGISTRY[cid];
    assert.ok(roster && roster.length >= 8, `Class ${cid} must have at least 8 students in registry`);
  }
  console.log('✓ 2. Verified mock data for all 7 classes (Primary, Secondary, High School, Kindergarten)');

  // 3. Requirement 1: Roster switching in Redux
  let state = attendanceReducer(undefined, setSelectedClassId('lop-6a1'));
  assert.equal(state.selectedClassId, 'lop-6a1');
  assert.equal(state.students[0].fullName, 'Nguyễn Việt Hoàng');
  assert.ok(state.students.some((s) => s.studentCode.includes('6A1')));

  state = attendanceReducer(state, setSelectedClassId('lop-la-1'));
  assert.equal(state.selectedClassId, 'lop-la-1');
  assert.ok(state.students.some((s) => s.fullName.includes('Bé Bông')));
  console.log('✓ 3. Verified Redux state dynamically switches student rosters when selecting classes');

  // 4. Requirement 2: Calendar past vs. future dates
  assert.equal(isFutureDate('2099-01-01'), true, '2099-01-01 must be recognized as future');
  assert.equal(isFutureDate('2020-01-01'), false, '2020-01-01 must be recognized as past');

  // Past date: populated historical records
  const pastDate = '2026-09-01';
  state = attendanceReducer(undefined, setSelectedDate(pastDate));
  assert.equal(state.selectedDate, pastDate);
  const presentCount = state.students.filter((s) => s.status === 'present').length;
  assert.ok(presentCount > 0, 'Past date must have students marked present');
  const hasTimes = state.students.some((s) => s.arrivalTime !== null && s.departureTime !== null);
  assert.ok(hasTimes, 'Past date must have arrival & departure times');
  console.log(`✓ 4. Past date (${pastDate}) has ${presentCount}/${state.students.length} present with arrival & departure times`);

  // Future date: empty / no data yet
  const futureDate = '2099-01-01';
  state = attendanceReducer(undefined, setSelectedDate(futureDate));
  assert.equal(state.selectedDate, futureDate);
  for (const s of state.students) {
    assert.equal(s.status, 'unmarked', 'Future date student must be unmarked');
    assert.equal(s.arrivalTime, null, 'Future date student arrivalTime must be null');
    assert.equal(s.departureTime, null, 'Future date student departureTime must be null');
  }
  assert.equal(state.summary.presentCount, 0, 'Future date present count must be 0');
  assert.equal(state.summary.unmarkedCount, state.students.length, 'All students unmarked in future');
  console.log(`✓ 5. Future date (${futureDate}) has 0 present, 0 arrival times, and all ${state.students.length} unmarked`);

  // 5. Requirement 3: Temperature inline editing & adjustment
  const initialTemp = state.students[0].temperature;
  state = attendanceReducer(state, updateHealthRecord({
    studentId: state.students[0].studentId,
    temperature: 37.4,
    healthCondition: 'Bình thường',
  }));
  assert.equal(state.students[0].temperature, 37.4);
  assert.ok(state.successMessage?.includes('37.4°C'));
  console.log('✓ 6. Verified temperature adjustment immediately updates student health record and state');

  // 6. Requirement 4: Global Top-Right Toast Notifications
  let toastState = toastReducer(undefined, addToast({
    type: 'success',
    title: 'Điểm danh',
    message: 'Đã điểm danh đón học sinh thành công',
  }));
  assert.equal(toastState.toasts.length, 1);
  assert.equal(toastState.toasts[0].type, 'success');
  assert.equal(toastState.toasts[0].message, 'Đã điểm danh đón học sinh thành công');

  toastState = toastReducer(toastState, removeToast(toastState.toasts[0].id));
  assert.equal(toastState.toasts.length, 0);
  console.log('✓ 7. Verified Global Toast Slice handles toast additions, types, and dismissals');

  console.log('\nALL 4 ATTENDANCE REQUIREMENTS VALIDATED AND CONFIRMED!');
}

runVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
