import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  resolveLastDayOfMonth,
  adjustDayForMonth,
  formatTuitionDueSummary,
  isNotificationSettingsDirty,
  validateNotificationSettings,
} from '../../src/utils/notificationSettingsValidation.ts';
import notificationSettingsReducer, {
  updateAttendanceToggle,
  updateExtracurricularScope,
  updateExtracurricularToggle,
  updateBirthdaySchedule,
  updateBirthdayToggle,
  updateTuitionChangeToggle,
  updateTuitionGracePeriod,
  updateTuitionDueReminder,
  updateOtherToggle,
  updateOtherPendingApproval,
  updateOtherDailyDiary,
  updateParentToggle,
  openConfirmModal,
  closeConfirmModal,
  saveNotificationSettings,
  resetWorkingSettings,
  clearToastMessage,
} from '../../src/store/slices/notificationSettingsSlice.ts';
import {
  MOCK_INITIAL_NOTIFICATION_SETTINGS,
  MOCK_EXTRACURRICULAR_CLASSES,
} from '../../src/services/mockNotificationSettingsData.ts';

test('Settings Notifications (Cấu Hình - Thông Báo) Test Suite - Feature 050 / Epic 35', async (t) => {
  // -------------------------------------------------------------------
  // Suite 1: Pure Calendar Calculation & Overflow Fallback (BR03, K097)
  // -------------------------------------------------------------------
  await t.test('BR03 & K097: resolveLastDayOfMonth correctly computes month days across leap & non-leap years', () => {
    // 31-day months
    assert.equal(resolveLastDayOfMonth(2026, 1), 31);
    assert.equal(resolveLastDayOfMonth(2026, 3), 31);
    assert.equal(resolveLastDayOfMonth(2026, 5), 31);
    assert.equal(resolveLastDayOfMonth(2026, 7), 31);
    assert.equal(resolveLastDayOfMonth(2026, 8), 31);
    assert.equal(resolveLastDayOfMonth(2026, 10), 31);
    assert.equal(resolveLastDayOfMonth(2026, 12), 31);

    // 30-day months
    assert.equal(resolveLastDayOfMonth(2026, 4), 30);
    assert.equal(resolveLastDayOfMonth(2026, 6), 30);
    assert.equal(resolveLastDayOfMonth(2026, 9), 30);
    assert.equal(resolveLastDayOfMonth(2026, 11), 30);

    // February non-leap (2026) vs leap year (2024, 2028)
    assert.equal(resolveLastDayOfMonth(2026, 2), 28);
    assert.equal(resolveLastDayOfMonth(2025, 2), 28);
    assert.equal(resolveLastDayOfMonth(2024, 2), 29);
    assert.equal(resolveLastDayOfMonth(2028, 2), 29);
  });

  await t.test('BR03 & K097: adjustDayForMonth applies 31st-day calendar overflow fallback rule', () => {
    // Scheduled day 31 in February 2026 falls back to 28
    assert.equal(adjustDayForMonth(31, 2026, 2), 28);

    // Scheduled day 31 in February 2024 (leap year) falls back to 29
    assert.equal(adjustDayForMonth(31, 2024, 2), 29);

    // Scheduled day 31 in April 2026 (30 days) falls back to 30
    assert.equal(adjustDayForMonth(31, 2026, 4), 30);

    // Scheduled day 30 in February 2026 falls back to 28
    assert.equal(adjustDayForMonth(30, 2026, 2), 28);

    // Scheduled day 15 in February 2026 is unaffected
    assert.equal(adjustDayForMonth(15, 2026, 2), 15);

    // Scheduled day 31 in January 2026 is unaffected
    assert.equal(adjustDayForMonth(31, 2026, 1), 31);
  });

  // -------------------------------------------------------------------
  // Suite 2: Tuition Due Summary & Validation Rules (BR06, BR08, K100, K102)
  // -------------------------------------------------------------------
  await t.test('BR08 & K102: formatTuitionDueSummary produces localized directional labels', () => {
    assert.equal(
      formatTuitionDueSummary('before', 3),
      'Trước hạn đóng học phí 3 ngày'
    );
    assert.equal(
      formatTuitionDueSummary('after', 5),
      'Sau hạn đóng học phí 5 ngày'
    );
  });

  await t.test('BR06, K100: validateNotificationSettings asserts invariant bounds', () => {
    const valid = validateNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
    assert.equal(valid.isValid, true);
    assert.equal(valid.errors.length, 0);

    // Invalid fixed pickup time
    const invalidPickup = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    invalidPickup.attendance.pickupReminderTime = '18:00';
    const resPickup = validateNotificationSettings(invalidPickup);
    assert.equal(resPickup.isValid, false);
    assert.ok(resPickup.errors.some((e) => e.includes('17:00')));

    // Invalid birthday day
    const invalidBday = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    invalidBday.birthday.broadcastSchedule.dayOfMonth = 35;
    const resBday = validateNotificationSettings(invalidBday);
    assert.equal(resBday.isValid, false);

    // Invalid diary time
    const invalidDiary = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    invalidDiary.other.dailyActivityDiary.time = '21:00';
    const resDiary = validateNotificationSettings(invalidDiary);
    assert.equal(resDiary.isValid, false);
    assert.ok(resDiary.errors.some((e) => e.includes('20:00')));
  });

  // -------------------------------------------------------------------
  // Suite 3: Monolithic Dirty-State Detection Engine (BR01, K095)
  // -------------------------------------------------------------------
  await t.test('BR01 & K095: isNotificationSettingsDirty returns false when current matches saved', () => {
    const saved = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    const current = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    assert.equal(isNotificationSettingsDirty(current, saved), false);
  });

  await t.test('BR01 & K095: isNotificationSettingsDirty detects attendance divergence', () => {
    const saved = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    const current = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    current.attendance.pickupTeacherReminder = false;
    assert.equal(isNotificationSettingsDirty(current, saved), true);
  });

  await t.test('BR07 & K101: isNotificationSettingsDirty detects extracurricular scope divergence', () => {
    const saved = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    const current = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    current.attendance.extracurricular.scope = 'ext-01';
    assert.equal(isNotificationSettingsDirty(current, saved), true);
  });

  await t.test('BR04 & K098: isNotificationSettingsDirty detects birthday schedule divergence', () => {
    const saved = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    const current = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    current.birthday.broadcastSchedule.dayOfMonth = 20;
    assert.equal(isNotificationSettingsDirty(current, saved), true);
  });

  await t.test('BR08 & K102: isNotificationSettingsDirty detects tuition due reminder divergence', () => {
    const saved = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    const current = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    current.tuition.dueReminder.timing = 'after';
    assert.equal(isNotificationSettingsDirty(current, saved), true);
  });

  await t.test('BR05 & K099: isNotificationSettingsDirty detects dual-channel email toggle divergence', () => {
    const saved = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    const current = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    current.other.pendingActivityApproval.email = false;
    assert.equal(isNotificationSettingsDirty(current, saved), true);
  });

  await t.test('BR10 & K103: isNotificationSettingsDirty detects parent toggle divergence', () => {
    const saved = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    const current = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS));
    current.parent.onStudentAttendance = false;
    assert.equal(isNotificationSettingsDirty(current, saved), true);
  });

  // -------------------------------------------------------------------
  // Suite 4: Redux State Machine & Modal Confirmation Lifecycle (BR02, K096)
  // -------------------------------------------------------------------
  await t.test('Redux: initial state matches default mock fixtures', () => {
    const state = notificationSettingsReducer(undefined, { type: '@@INIT' });
    assert.deepEqual(state.currentSettings.attendance.pickupReminderTime, '17:00');
    assert.equal(state.isConfirmModalOpen, false);
    assert.equal(state.toastMessage, null);
    assert.equal(state.extracurricularClasses.length, 5);
  });

  await t.test('Redux: updating attendance toggles and scope updates currentSettings', () => {
    let state = notificationSettingsReducer(undefined, { type: '@@INIT' });
    state = notificationSettingsReducer(
      state,
      updateAttendanceToggle({ field: 'dropoffTeacherReminder', value: false })
    );
    assert.equal(state.currentSettings.attendance.dropoffTeacherReminder, false);

    state = notificationSettingsReducer(
      state,
      updateExtracurricularScope('ext-02')
    );
    assert.equal(state.currentSettings.attendance.extracurricular.scope, 'ext-02');

    state = notificationSettingsReducer(
      state,
      updateExtracurricularToggle({ target: 'notifyParents', value: false })
    );
    assert.equal(state.currentSettings.attendance.extracurricular.notifyParents, false);
  });

  await t.test('Redux: updating birthday schedule and recipient toggles', () => {
    let state = notificationSettingsReducer(undefined, { type: '@@INIT' });
    state = notificationSettingsReducer(
      state,
      updateBirthdaySchedule({ dayOfMonth: 28, time: '08:30' })
    );
    assert.equal(state.currentSettings.birthday.broadcastSchedule.dayOfMonth, 28);
    assert.equal(state.currentSettings.birthday.broadcastSchedule.time, '08:30');

    state = notificationSettingsReducer(
      state,
      updateBirthdayToggle({ target: 'notifyAdmins', value: false })
    );
    assert.equal(state.currentSettings.birthday.notifyAdmins, false);
  });

  await t.test('Redux: updating tuition schedule parameters', () => {
    let state = notificationSettingsReducer(undefined, { type: '@@INIT' });
    state = notificationSettingsReducer(
      state,
      updateTuitionChangeToggle({ target: 'tuitionChangeNotifyParents', value: false })
    );
    assert.equal(state.currentSettings.tuition.tuitionChangeNotifyParents, false);

    state = notificationSettingsReducer(
      state,
      updateTuitionGracePeriod({ dayOfMonth: 18, notifyParents: false })
    );
    assert.equal(state.currentSettings.tuition.gracePeriod.dayOfMonth, 18);
    assert.equal(state.currentSettings.tuition.gracePeriod.notifyParents, false);

    state = notificationSettingsReducer(
      state,
      updateTuitionDueReminder({ timing: 'after', days: 7, notifyParents: true })
    );
    assert.equal(state.currentSettings.tuition.dueReminder.timing, 'after');
    assert.equal(state.currentSettings.tuition.dueReminder.days, 7);
  });

  await t.test('Redux: updating other section dual-channel options', () => {
    let state = notificationSettingsReducer(undefined, { type: '@@INIT' });
    state = notificationSettingsReducer(
      state,
      updateOtherPendingApproval({ channel: 'email', value: false })
    );
    assert.equal(state.currentSettings.other.pendingActivityApproval.email, false);

    state = notificationSettingsReducer(
      state,
      updateOtherDailyDiary({ channel: 'webApp', value: false })
    );
    assert.equal(state.currentSettings.other.dailyActivityDiary.webApp, false);
  });

  await t.test('Redux: updating parent section toggles', () => {
    let state = notificationSettingsReducer(undefined, { type: '@@INIT' });
    state = notificationSettingsReducer(
      state,
      updateParentToggle({ field: 'onStudentMediaAdded', value: false })
    );
    assert.equal(state.currentSettings.parent.onStudentMediaAdded, false);
  });

  await t.test('BR02 & K096: Modal confirmation lifecycle and working state retention', () => {
    let state = notificationSettingsReducer(undefined, { type: '@@INIT' });

    // Mutate field
    state = notificationSettingsReducer(
      state,
      updateParentToggle({ field: 'onStudentAttendance', value: false })
    );

    // Open modal
    state = notificationSettingsReducer(state, openConfirmModal());
    assert.equal(state.isConfirmModalOpen, true);

    // Cancel modal - preserves working edit (BR02, K096)
    state = notificationSettingsReducer(state, closeConfirmModal());
    assert.equal(state.isConfirmModalOpen, false);
    assert.equal(state.currentSettings.parent.onStudentAttendance, false);
    assert.equal(state.savedSettings.parent.onStudentAttendance, true);
    assert.equal(isNotificationSettingsDirty(state.currentSettings, state.savedSettings), true);

    // Reset working settings reverts to saved
    state = notificationSettingsReducer(state, resetWorkingSettings());
    assert.equal(state.currentSettings.parent.onStudentAttendance, true);
    assert.equal(isNotificationSettingsDirty(state.currentSettings, state.savedSettings), false);

    // Mutate again, open modal, and confirm save
    state = notificationSettingsReducer(
      state,
      updateAttendanceToggle({ field: 'pickupTeacherReminder', value: false })
    );
    state = notificationSettingsReducer(state, openConfirmModal());
    state = notificationSettingsReducer(state, saveNotificationSettings());

    assert.equal(state.isConfirmModalOpen, false);
    assert.equal(state.savedSettings.attendance.pickupTeacherReminder, false);
    assert.equal(state.currentSettings.attendance.pickupTeacherReminder, false);
    assert.equal(isNotificationSettingsDirty(state.currentSettings, state.savedSettings), false);
    assert.equal(state.toastMessage, 'Cập nhật cấu hình thông báo thành công!');

    // Clear toast
    state = notificationSettingsReducer(state, clearToastMessage());
    assert.equal(state.toastMessage, null);
  });
});
