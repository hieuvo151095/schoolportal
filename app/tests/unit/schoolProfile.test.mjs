import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateSchoolInfoField,
  validateSchoolInfo,
  generateTimeOptions,
  generateLateArrivalOptions,
  validateOperatingHours,
  validateAttendanceRules,
  getDefaultOperatingHours,
  getDefaultAttendanceRules,
} from '../../src/utils/schoolProfileValidation.ts';
import schoolProfileReducer, {
  setActiveTab,
  updateSchoolProfile,
  updateOperatingHours,
  updateAttendanceRules,
  setDirtyInfo,
  setDirtyHours,
  setDirtyRules,
  openUnsavedLeaveModal,
  closeUnsavedLeaveModal,
  discardChanges,
} from '../../src/store/slices/schoolProfileSlice.ts';
import { mockSchoolProfile } from '../../src/services/mockSchoolProfileData.ts';

test('School Profile & Operational Configuration Suite', async (t) => {
  await t.test('TR-01 & BR02: Inline Field Validation on Blur', () => {
    // Name validation
    assert.equal(validateSchoolInfoField('name', ''), 'Vui lòng nhập tên trường');
    assert.equal(validateSchoolInfoField('name', '   '), 'Vui lòng nhập tên trường');
    assert.equal(validateSchoolInfoField('name', 'Trường Mầm Non Ban Mai'), undefined);

    // Address validation
    assert.equal(validateSchoolInfoField('address', ''), 'Vui lòng nhập địa chỉ trường');
    assert.equal(validateSchoolInfoField('address', '123 Nguyễn Huệ'), undefined);

    // Email validation
    assert.equal(validateSchoolInfoField('email', ''), 'Vui lòng nhập email trường');
    assert.equal(validateSchoolInfoField('email', 'invalid-email'), 'Email không đúng định dạng');
    assert.equal(validateSchoolInfoField('email', 'admin@banmai.edu.vn'), undefined);

    // Optional fields return undefined
    assert.equal(validateSchoolInfoField('phone', ''), undefined);
    assert.equal(validateSchoolInfoField('website', ''), undefined);
  });

  await t.test('BR03: Form-wide Basic Info Validation & Submit Gating', () => {
    const invalidForm = {
      name: '',
      shortName: 'Ban Mai',
      address: '',
      website: '',
      phone: '',
      email: 'not-an-email',
      slogan: '',
      contactInfo: '',
      defaultLanguage: 'vi',
    };
    const invalidResult = validateSchoolInfo(invalidForm);
    assert.equal(invalidResult.isValid, false);
    assert.equal(invalidResult.errors.name, 'Vui lòng nhập tên trường');
    assert.equal(invalidResult.errors.address, 'Vui lòng nhập địa chỉ trường');
    assert.equal(invalidResult.errors.email, 'Email không đúng định dạng');

    const validForm = {
      name: 'Trường Mầm Non Ban Mai',
      shortName: 'Ban Mai',
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      website: 'https://banmai.edu.vn',
      phone: '028 3822 9999',
      email: 'info@banmai.edu.vn',
      slogan: 'Nơi ươm mầm tương lai',
      contactInfo: 'Hotline 0909 123 456',
      defaultLanguage: 'vi',
    };
    const validResult = validateSchoolInfo(validForm);
    assert.equal(validResult.isValid, true);
    assert.deepEqual(validResult.errors, {});
  });

  await t.test('BR08 & K072: 5-Minute Stepped Time Increments', () => {
    const options = generateTimeOptions(6, 18, 5);
    assert.ok(options.length > 0);
    assert.equal(options[0], '06:00');
    assert.equal(options[options.length - 1], '18:00');
    assert.ok(options.includes('06:05'));
    assert.ok(options.includes('07:00'));
    assert.ok(options.includes('17:30'));
    assert.ok(options.includes('17:55'));
    assert.equal(options.includes('07:03'), false); // Arbitrary 1-minute rejected
  });

  await t.test('BR10: Late Arrival Threshold Dropdown Options', () => {
    const options = generateLateArrivalOptions(5, 60, 5);
    assert.deepEqual(options, [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
  });

  await t.test('VR-SCH-05: Operating Hours Opening Before Closing Validation', () => {
    const validHours = [
      { dayOfWeek: 1, dayLabel: 'Thứ 2', isOpen: true, openTime: '07:00', closeTime: '17:30' },
      { dayOfWeek: 2, dayLabel: 'Thứ 3', isOpen: true, openTime: '07:30', closeTime: '17:00' },
    ];
    assert.equal(validateOperatingHours(validHours).isValid, true);

    const invalidHours = [
      { dayOfWeek: 1, dayLabel: 'Thứ 2', isOpen: true, openTime: '18:00', closeTime: '07:00' },
    ];
    const invalidResult = validateOperatingHours(invalidHours);
    assert.equal(invalidResult.isValid, false);
    assert.ok(invalidResult.error?.includes('Giờ mở cửa phải trước giờ đóng cửa'));
  });

  await t.test('BR09 & K073: Sunday Static Non-Operational Default', () => {
    const defaultHours = getDefaultOperatingHours();
    assert.equal(defaultHours.length, 7);

    // Monday through Saturday are open
    for (let i = 0; i < 6; i++) {
      assert.equal(defaultHours[i].isOpen, true);
      assert.ok(defaultHours[i].openTime);
      assert.ok(defaultHours[i].closeTime);
    }

    // Sunday (index 6, dayOfWeek 0) is closed
    const sunday = defaultHours[6];
    assert.equal(sunday.dayLabel, 'Chủ nhật');
    assert.equal(sunday.isOpen, false);
    assert.equal(sunday.openTime, undefined);
    assert.equal(sunday.closeTime, undefined);
  });

  await t.test('BR14: Attendance Rules Default Baseline', () => {
    const rules = getDefaultAttendanceRules();
    assert.equal(rules.attendanceMode, 'Điểm danh 2 buổi');
    assert.equal(rules.morningSessionTime, '07:00 - 11:30');
    assert.equal(rules.afternoonSessionTime, '13:30 - 17:00');
    assert.equal(rules.lateArrivalEnabled, true);
    assert.equal(rules.lateArrivalThresholdMinutes, 15);
    assert.equal(rules.lateDepartureEnabled, true);
  });

  await t.test('Redux: Initial State & Tab Switching', () => {
    const state = schoolProfileReducer(undefined, { type: '@@INIT' });
    assert.equal(state.profile.name, mockSchoolProfile.name);
    assert.equal(state.activeTab, 'info');
    assert.equal(state.isDirtyInfo, false);

    const updatedState = schoolProfileReducer(state, setActiveTab('weekdays'));
    assert.equal(updatedState.activeTab, 'weekdays');
  });

  await t.test('K071: Independent Sub-Form Save Autonomy in Redux', () => {
    const state = schoolProfileReducer(undefined, { type: '@@INIT' });

    // Update Profile only
    const updatedProfileState = schoolProfileReducer(
      state,
      updateSchoolProfile({ name: 'Trường Song Ngữ Ban Mai' })
    );
    assert.equal(updatedProfileState.profile.name, 'Trường Song Ngữ Ban Mai');
    assert.equal(updatedProfileState.isDirtyInfo, false);
    assert.equal(updatedProfileState.toastType, 'success');

    // Update Operating Hours only (attendance rules untouched)
    const newHours = getDefaultOperatingHours().map((h) =>
      h.dayOfWeek === 1 ? { ...h, openTime: '06:30' } : h
    );
    const updatedHoursState = schoolProfileReducer(state, updateOperatingHours(newHours));
    assert.equal(updatedHoursState.operatingHours[0].openTime, '06:30');
    assert.equal(updatedHoursState.attendanceRules.lateArrivalThresholdMinutes, 15); // Untouched
    assert.equal(updatedHoursState.isDirtyHours, false);

    // Update Attendance Rules only (operating hours untouched)
    const updatedRulesState = schoolProfileReducer(
      state,
      updateAttendanceRules({ lateArrivalThresholdMinutes: 30 })
    );
    assert.equal(updatedRulesState.attendanceRules.lateArrivalThresholdMinutes, 30);
    assert.equal(updatedRulesState.operatingHours[0].openTime, '07:00'); // Untouched
    assert.equal(updatedRulesState.isDirtyRules, false);
  });

  await t.test('TR-02 & BR12: Dirty State Tracking & Unsaved Leave Modal', () => {
    let state = schoolProfileReducer(undefined, { type: '@@INIT' });

    state = schoolProfileReducer(state, setDirtyInfo(true));
    assert.equal(state.isDirtyInfo, true);

    state = schoolProfileReducer(state, openUnsavedLeaveModal('/demo/setting/fee'));
    assert.equal(state.showUnsavedLeaveModal, true);
    assert.equal(state.pendingNavigationUrl, '/demo/setting/fee');

    // Close modal cancels departure
    state = schoolProfileReducer(state, closeUnsavedLeaveModal());
    assert.equal(state.showUnsavedLeaveModal, false);
    assert.equal(state.pendingNavigationUrl, undefined);
    assert.equal(state.isDirtyInfo, true); // Still dirty

    // Discard changes
    state = schoolProfileReducer(state, discardChanges());
    assert.equal(state.isDirtyInfo, false);
    assert.equal(state.showUnsavedLeaveModal, false);
  });
});
