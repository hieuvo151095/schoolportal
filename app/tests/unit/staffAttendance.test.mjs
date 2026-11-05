import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeVietnameseText,
  isDateInFuture,
  isDateLockedForEdit,
  shouldShowPastDateWarning,
  getDayDifference,
  validateTimeFormat,
  getCurrentTimeHHmm,
  formatMissingField,
  filterStaffRoster,
  sortStaffByNickname,
  computeStaffKPIs,
  getRoleBadgeConfig,
} from '../../src/utils/staffAttendanceValidation.ts';

import staffAttendanceReducer, {
  setFilterDate,
  setFilterClass,
  setFilterRole,
  setSearchQuery,
  toggleSortDirection,
  checkInStaff,
  checkOutStaff,
  updateTimeBadge,
  openAbsenceModal,
  closeAbsenceModal,
  recordStaffAbsence,
  cancelStaffAbsence,
  updateStaffNote,
  openStaffProfileModal,
  closeStaffProfileModal,
  setToastMessage,
  clearToastMessage,
} from '../../src/store/slices/staffAttendanceSlice.ts';

import {
  MOCK_STAFF_LIST,
  generateInitialAttendanceRecords,
} from '../../src/services/mockStaffAttendanceData.ts';

test('School Staff Attendance (Điểm Danh NV - E-026-school-staff-attendance) Suite', async (t) => {
  const referenceToday = '2026-10-07';

  await t.test('BR01 & BR02 & K046: Date Boundaries, 45-Day Retrospective Lock & Warnings', async (t) => {
    await t.test('detects future dates correctly', () => {
      assert.equal(isDateInFuture('2026-10-08', referenceToday), true);
      assert.equal(isDateInFuture('2026-10-07', referenceToday), false);
      assert.equal(isDateInFuture('2026-10-06', referenceToday), false);
      assert.equal(isDateInFuture('', referenceToday), false);
    });

    await t.test('calculates day difference between dates correctly', () => {
      assert.equal(getDayDifference('2026-10-07', referenceToday), 0);
      assert.equal(getDayDifference('2026-10-02', referenceToday), 5);
      assert.equal(getDayDifference('2026-08-23', referenceToday), 45);
      assert.equal(getDayDifference('2026-08-22', referenceToday), 46);
    });

    await t.test('enforces 45-day retrospective edit boundary (K046, BR02)', () => {
      // 0 days ago (today) -> not locked
      assert.equal(isDateLockedForEdit('2026-10-07', referenceToday), false);
      // 45 days ago -> not locked (within 45 days)
      assert.equal(isDateLockedForEdit('2026-08-23', referenceToday), false);
      // 46 days ago -> strictly locked
      assert.equal(isDateLockedForEdit('2026-08-22', referenceToday), true);
      // 60 days ago -> strictly locked
      assert.equal(isDateLockedForEdit('2026-08-08', referenceToday), true);
    });

    await t.test('displays warning DD-02 for any date different from today', () => {
      assert.equal(shouldShowPastDateWarning('2026-10-07', referenceToday), false);
      assert.equal(shouldShowPastDateWarning('2026-10-06', referenceToday), true);
      assert.equal(shouldShowPastDateWarning('2026-08-22', referenceToday), true);
    });
  });

  await t.test('BR03 & BR04 & K048: 1-Click Check-In/Out & Time Badge Format Validation', async (t) => {
    await t.test('validates 24-hour time format (HH:mm) strictly', () => {
      assert.equal(validateTimeFormat('07:45'), true);
      assert.equal(validateTimeFormat('17:15'), true);
      assert.equal(validateTimeFormat('00:00'), true);
      assert.equal(validateTimeFormat('23:59'), true);

      // Invalid formats
      assert.equal(validateTimeFormat('24:00'), false);
      assert.equal(validateTimeFormat('7:45'), false);
      assert.equal(validateTimeFormat('12:60'), false);
      assert.equal(validateTimeFormat('abc'), false);
      assert.equal(validateTimeFormat(''), false);
      assert.equal(validateTimeFormat('   '), false);
    });

    await t.test('generates valid system time format HH:mm', () => {
      const time = getCurrentTimeHHmm();
      assert.match(time, /^([01]\d|2[0-3]):([0-5]\d)$/);
    });
  });

  await t.test('BR08 & BR11: Multi-role Badges & Fallback Formatting', async (t) => {
    await t.test('provides correct badge styles for all staff roles', () => {
      const adminBadge = getRoleBadgeConfig('admin');
      assert.equal(adminBadge.label, 'Admin');

      const quanLyBadge = getRoleBadgeConfig('quan_ly');
      assert.equal(quanLyBadge.label, 'Quản Lý');

      const gvBadge = getRoleBadgeConfig('giao_vien');
      assert.equal(gvBadge.label, 'Giáo Viên');

      const nvBadge = getRoleBadgeConfig('nhan_vien');
      assert.equal(nvBadge.label, 'Nhân Viên');
    });

    await t.test('formats missing profile fields with "Chưa có {field}" (BR11)', () => {
      assert.equal(formatMissingField('NV001', 'mã NV'), 'NV001');
      assert.equal(formatMissingField('', 'mã NV'), 'Chưa có mã NV');
      assert.equal(formatMissingField(null, 'email'), 'Chưa có email');
      assert.equal(formatMissingField(undefined, 'số điện thoại'), 'Chưa có số điện thoại');
      assert.equal(formatMissingField('   ', 'địa chỉ'), 'Chưa có địa chỉ');
    });
  });

  await t.test('BR08, BR09 & BR10: Roster Filtering, Diacritic-Free Search & Class Scoping', async (t) => {
    const records = generateInitialAttendanceRecords();
    const todayRecords = records[referenceToday] || {};

    await t.test('filters roster by class cohort (BR09, K047)', () => {
      const allRoster = filterStaffRoster(MOCK_STAFF_LIST, todayRecords, {
        date: referenceToday,
        classId: 'all',
        role: 'all',
        searchQuery: '',
        sortDirection: 'asc',
      });
      assert.equal(allRoster.length, MOCK_STAFF_LIST.length);

      const class6A1Roster = filterStaffRoster(MOCK_STAFF_LIST, todayRecords, {
        date: referenceToday,
        classId: '6A1',
        role: 'all',
        searchQuery: '',
        sortDirection: 'asc',
      });
      // Verify all returned staff have 6A1 assigned
      assert.ok(class6A1Roster.length > 0);
      assert.ok(class6A1Roster.every((item) =>
        item.staff.assignedClasses.some((c) => c.classId === '6A1')
      ));
    });

    await t.test('filters roster by staff role (BR08)', () => {
      const adminRoster = filterStaffRoster(MOCK_STAFF_LIST, todayRecords, {
        date: referenceToday,
        classId: 'all',
        role: 'admin',
        searchQuery: '',
        sortDirection: 'asc',
      });
      assert.ok(adminRoster.length > 0);
      assert.ok(adminRoster.every((item) => item.staff.roles.includes('admin')));
    });

    await t.test('searches staff by accent-free query across name, nickname, and code (BR10)', () => {
      // "huong" matches "Cô Hường"
      const huongRoster = filterStaffRoster(MOCK_STAFF_LIST, todayRecords, {
        date: referenceToday,
        classId: 'all',
        role: 'all',
        searchQuery: 'huong',
        sortDirection: 'asc',
      });
      assert.ok(huongRoster.length >= 1);
      assert.ok(huongRoster.some((item) => item.staff.nickname.includes('Hường')));

      // Code search "GV001"
      const codeRoster = filterStaffRoster(MOCK_STAFF_LIST, todayRecords, {
        date: referenceToday,
        classId: 'all',
        role: 'all',
        searchQuery: 'GV001',
        sortDirection: 'asc',
      });
      assert.equal(codeRoster.length, 1);
      assert.equal(codeRoster[0].staff.code, 'GV001');
    });
  });

  await t.test('BR12: Roster Sorting by Nickname A <-> Z', async (t) => {
    const records = generateInitialAttendanceRecords()[referenceToday] || {};
    const roster = filterStaffRoster(MOCK_STAFF_LIST, records, {
      date: referenceToday,
      classId: 'all',
      role: 'all',
      searchQuery: '',
      sortDirection: 'asc',
    });

    const ascRoster = sortStaffByNickname(roster, 'asc');
    const descRoster = sortStaffByNickname(roster, 'desc');

    assert.equal(ascRoster.length, roster.length);
    assert.equal(descRoster.length, roster.length);

    // Verify first element in asc is less than or equal to last
    const firstNicknameAsc = ascRoster[0].staff.nickname;
    const lastNicknameAsc = ascRoster[ascRoster.length - 1].staff.nickname;
    assert.ok(firstNicknameAsc.localeCompare(lastNicknameAsc, 'vi') <= 0);

    // Verify desc inverse
    assert.equal(descRoster[0].staff.nickname, lastNicknameAsc);
    assert.equal(descRoster[descRoster.length - 1].staff.nickname, firstNicknameAsc);
  });

  await t.test('BR10: KPI Counters Aggregation', async (t) => {
    const mockRoster = [
      {
        staff: MOCK_STAFF_LIST[0],
        attendance: {
          id: '1',
          staffId: 'staff-001',
          date: referenceToday,
          checkInTime: '07:45',
          isAbsent: false,
          updatedAt: '2026-10-07T08:00:00Z',
        },
      },
      {
        staff: MOCK_STAFF_LIST[1],
        attendance: {
          id: '2',
          staffId: 'staff-002',
          date: referenceToday,
          checkInTime: '07:30',
          isAbsent: false,
          updatedAt: '2026-10-07T08:00:00Z',
        },
      },
      {
        staff: MOCK_STAFF_LIST[2],
        attendance: {
          id: '3',
          staffId: 'staff-003',
          date: referenceToday,
          isAbsent: true,
          absenceType: 'co_phep',
          updatedAt: '2026-10-07T08:00:00Z',
        },
      },
      {
        staff: MOCK_STAFF_LIST[3],
        attendance: {
          id: '4',
          staffId: 'staff-004',
          date: referenceToday,
          isAbsent: true,
          absenceType: 'khong_phep',
          updatedAt: '2026-10-07T08:00:00Z',
        },
      },
      {
        staff: MOCK_STAFF_LIST[4],
        attendance: {
          id: '5',
          staffId: 'staff-005',
          date: referenceToday,
          isAbsent: false,
          updatedAt: '2026-10-07T08:00:00Z',
        },
      },
    ];

    const kpis = computeStaffKPIs(mockRoster);
    assert.equal(kpis.attendingCount, 2);
    assert.equal(kpis.excusedAbsenceCount, 1);
    assert.equal(kpis.unexcusedAbsenceCount, 1);
    assert.equal(kpis.totalCount, 5);
  });

  await t.test('Redux State Machine Mutations (staffAttendanceSlice)', async (t) => {
    let state = staffAttendanceReducer(undefined, { type: '@@INIT' });

    await t.test('updates filter parameters correctly', () => {
      state = staffAttendanceReducer(state, setFilterDate('2026-10-05'));
      assert.equal(state.filterState.date, '2026-10-05');

      state = staffAttendanceReducer(state, setFilterClass('6A1'));
      assert.equal(state.filterState.classId, '6A1');

      state = staffAttendanceReducer(state, setFilterRole('giao_vien'));
      assert.equal(state.filterState.role, 'giao_vien');

      state = staffAttendanceReducer(state, setSearchQuery('minh'));
      assert.equal(state.filterState.searchQuery, 'minh');

      state = staffAttendanceReducer(state, toggleSortDirection());
      assert.equal(state.filterState.sortDirection, 'desc');
    });

    await t.test('records 1-click Check-In and Check-Out instantly (BR03, K048)', () => {
      const targetDate = referenceToday;
      const targetStaffId = 'staff-010';

      state = staffAttendanceReducer(
        state,
        checkInStaff({ staffId: targetStaffId, date: targetDate, time: '07:45' })
      );
      assert.equal(state.records[targetDate][targetStaffId].checkInTime, '07:45');
      assert.equal(state.records[targetDate][targetStaffId].isAbsent, false);

      state = staffAttendanceReducer(
        state,
        checkOutStaff({ staffId: targetStaffId, date: targetDate, time: '17:30' })
      );
      assert.equal(state.records[targetDate][targetStaffId].checkOutTime, '17:30');
    });

    await t.test('validates inline time badge editing and reverts with toast DD-01 on invalid blur (BR04, DD-01)', () => {
      const targetDate = referenceToday;
      const targetStaffId = 'staff-010';

      // Valid update
      state = staffAttendanceReducer(
        state,
        updateTimeBadge({
          staffId: targetStaffId,
          date: targetDate,
          type: 'checkIn',
          time: '08:00',
        })
      );
      assert.equal(state.records[targetDate][targetStaffId].checkInTime, '08:00');
      assert.equal(state.toastMessage, null);

      // Invalid update (e.g. "99:99")
      state = staffAttendanceReducer(
        state,
        updateTimeBadge({
          staffId: targetStaffId,
          date: targetDate,
          type: 'checkIn',
          time: '99:99',
        })
      );
      // Value not updated
      assert.equal(state.records[targetDate][targetStaffId].checkInTime, '08:00');
      // Toast DD-01 triggered
      assert.equal(state.toastMessage, 'Thời gian không đúng định dạng.');

      // Clear toast
      state = staffAttendanceReducer(state, clearToastMessage());
      assert.equal(state.toastMessage, null);
    });

    await t.test('handles absence modal lifecycle and recording (BR05, BR06)', () => {
      const targetDate = referenceToday;
      const targetStaffId = 'staff-012';

      // Open modal disables row buttons
      state = staffAttendanceReducer(state, openAbsenceModal(targetStaffId));
      assert.equal(state.activeAbsenceStaffId, targetStaffId);

      // Record excused absence
      state = staffAttendanceReducer(
        state,
        recordStaffAbsence({
          staffId: targetStaffId,
          date: targetDate,
          absenceType: 'co_phep',
          absenceNote: 'Nghỉ đám cưới người thân',
        })
      );
      assert.equal(state.activeAbsenceStaffId, null);
      assert.equal(state.records[targetDate][targetStaffId].isAbsent, true);
      assert.equal(state.records[targetDate][targetStaffId].absenceType, 'co_phep');
      assert.equal(state.records[targetDate][targetStaffId].absenceNote, 'Nghỉ đám cưới người thân');

      // Cancel absence
      state = staffAttendanceReducer(
        state,
        cancelStaffAbsence({ staffId: targetStaffId, date: targetDate })
      );
      assert.equal(state.records[targetDate][targetStaffId].isAbsent, false);
      assert.equal(state.records[targetDate][targetStaffId].absenceType, undefined);
    });

    await t.test('updates inline notes auto-saving on blur (BR07)', () => {
      const targetDate = referenceToday;
      const targetStaffId = 'staff-014';

      state = staffAttendanceReducer(
        state,
        updateStaffNote({
          staffId: targetStaffId,
          date: targetDate,
          note: 'Dạy thay tiết sinh hoạt',
        })
      );
      assert.equal(state.records[targetDate][targetStaffId].generalNote, 'Dạy thay tiết sinh hoạt');

      // Accepts empty string
      state = staffAttendanceReducer(
        state,
        updateStaffNote({
          staffId: targetStaffId,
          date: targetDate,
          note: '',
        })
      );
      assert.equal(state.records[targetDate][targetStaffId].generalNote, '');
    });

    await t.test('strictly blocks modifications for dates older than 45 days (K046, BR02)', () => {
      // 50 days in the past
      const lockedDate = '2026-08-01';
      const staffId = 'staff-001';

      // Attempt check-in on locked date
      state = staffAttendanceReducer(
        state,
        checkInStaff({ staffId, date: lockedDate, time: '08:00' })
      );
      // Record not created or modified
      assert.equal(state.records[lockedDate]?.[staffId]?.checkInTime, undefined);

      // Attempt check-out on locked date
      state = staffAttendanceReducer(
        state,
        checkOutStaff({ staffId, date: lockedDate, time: '17:00' })
      );
      assert.equal(state.records[lockedDate]?.[staffId]?.checkOutTime, undefined);

      // Attempt absence record on locked date
      state = staffAttendanceReducer(
        state,
        recordStaffAbsence({ staffId, date: lockedDate, absenceType: 'co_phep' })
      );
      assert.equal(state.records[lockedDate]?.[staffId]?.isAbsent, undefined);
    });

    await t.test('manages staff profile modal state (BR11)', () => {
      state = staffAttendanceReducer(state, openStaffProfileModal('staff-004'));
      assert.equal(state.selectedProfileStaffId, 'staff-004');

      state = staffAttendanceReducer(state, closeStaffProfileModal());
      assert.equal(state.selectedProfileStaffId, null);
    });
  });
});
