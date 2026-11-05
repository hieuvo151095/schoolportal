/**
 * Pure Validation Engine and Calendar Calculation Rules for Notification Settings
 * Feature: 050-settings-notifications-thong-bao
 * Epic: E-035-settings-notifications
 * Business Rules: BR01 - BR10, Decisions: K095 - K104
 */

import type {
  SchoolNotificationSettings,
  TuitionDueTiming,
} from '../types/notificationSettings.ts';

/**
 * Baseline Default Notification Settings matching canonical legacy spec SM6-thong-bao.md
 */
export const DEFAULT_NOTIFICATION_SETTINGS: SchoolNotificationSettings = {
  attendance: {
    pickupReminderTime: '17:00', // Fixed readonly (BR06, K100)
    pickupTeacherReminder: true,
    dropoffTeacherReminder: true,
    extracurricular: {
      scope: 'all', // 'all' or specific class id (BR07, K101)
      notifyParents: true,
      notifyTeachers: true,
    },
  },
  birthday: {
    broadcastSchedule: {
      dayOfMonth: 25, // 1-31 (BR04, K098)
      time: '09:00',
    },
    notifyTeachers: true,
    notifyAdmins: true,
  },
  tuition: {
    tuitionChangeNotifyParents: true,
    tuitionChangeNotifyAdmins: true,
    gracePeriod: {
      dayOfMonth: 16, // Default day 16 (BR08)
      notifyParents: true,
    },
    dueReminder: {
      timing: 'before', // 'before' | 'after' (BR08, K102)
      days: 3, // Default 3 days
      notifyParents: true,
    },
  },
  other: {
    conversationsNotifyAdmins: true,
    pendingActivityApproval: {
      webApp: true, // Dual channel toggle (BR05, K099)
      email: true,
    },
    dailyActivityDiary: {
      time: '20:00', // Fixed readonly (BR06, K100)
      webApp: true,
      email: true,
    },
    postFavoritedNotifyTeachers: true,
  },
  parent: {
    onStudentAttendance: true, // BR10: Keywords rendered with #EA580C orange styling
    onStudentAddedToActivity: true,
    onStudentMediaAdded: true,
  },
  updatedAt: '2026-10-14T08:00:00.000Z',
  updatedBy: 'Admin Finviet',
};

/**
 * Returns the exact number of days in a given month and year
 * Month is 1-indexed (1 = January, 12 = December)
 */
export function resolveLastDayOfMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}. Month must be between 1 and 12.`);
  }
  // Date constructor with day 0 of month (1-indexed) yields the last day of the previous month
  return new Date(year, month, 0).getDate();
}

/**
 * Resolves calendar overflow fallback for recurring reminders set on days 29, 30, or 31 (BR03, K097)
 * In months with fewer days (e.g. Feb with 28/29 days, or Apr with 30 days),
 * the reminder automatically triggers on the final calendar day of that month.
 */
export function adjustDayForMonth(day: number, year: number, month: number): number {
  const lastDay = resolveLastDayOfMonth(year, month);
  if (day > lastDay) {
    return lastDay;
  }
  return day;
}

/**
 * Formats a localized Vietnamese summary for tuition due date reminders (BR08, K102)
 */
export function formatTuitionDueSummary(timing: TuitionDueTiming, days: number): string {
  const directionText = timing === 'before' ? 'Trước hạn đóng học phí' : 'Sau hạn đóng học phí';
  return `${directionText} ${days} ngày`;
}

/**
 * Deep equality check comparing working active notification settings with the persisted baseline (BR01, K095)
 * Returns true if ANY field diverges from the saved state.
 */
export function isNotificationSettingsDirty(
  current: SchoolNotificationSettings,
  saved: SchoolNotificationSettings
): boolean {
  if (!current || !saved) return false;

  // 1. Attendance checks
  if (
    current.attendance.pickupTeacherReminder !== saved.attendance.pickupTeacherReminder ||
    current.attendance.dropoffTeacherReminder !== saved.attendance.dropoffTeacherReminder ||
    current.attendance.extracurricular.scope !== saved.attendance.extracurricular.scope ||
    current.attendance.extracurricular.notifyParents !== saved.attendance.extracurricular.notifyParents ||
    current.attendance.extracurricular.notifyTeachers !== saved.attendance.extracurricular.notifyTeachers
  ) {
    return true;
  }

  // 2. Birthday checks
  if (
    current.birthday.broadcastSchedule.dayOfMonth !== saved.birthday.broadcastSchedule.dayOfMonth ||
    current.birthday.broadcastSchedule.time !== saved.birthday.broadcastSchedule.time ||
    current.birthday.notifyTeachers !== saved.birthday.notifyTeachers ||
    current.birthday.notifyAdmins !== saved.birthday.notifyAdmins
  ) {
    return true;
  }

  // 3. Tuition checks
  if (
    current.tuition.tuitionChangeNotifyParents !== saved.tuition.tuitionChangeNotifyParents ||
    current.tuition.tuitionChangeNotifyAdmins !== saved.tuition.tuitionChangeNotifyAdmins ||
    current.tuition.gracePeriod.dayOfMonth !== saved.tuition.gracePeriod.dayOfMonth ||
    current.tuition.gracePeriod.notifyParents !== saved.tuition.gracePeriod.notifyParents ||
    current.tuition.dueReminder.timing !== saved.tuition.dueReminder.timing ||
    current.tuition.dueReminder.days !== saved.tuition.dueReminder.days ||
    current.tuition.dueReminder.notifyParents !== saved.tuition.dueReminder.notifyParents
  ) {
    return true;
  }

  // 4. Other checks
  if (
    current.other.conversationsNotifyAdmins !== saved.other.conversationsNotifyAdmins ||
    current.other.pendingActivityApproval.webApp !== saved.other.pendingActivityApproval.webApp ||
    current.other.pendingActivityApproval.email !== saved.other.pendingActivityApproval.email ||
    current.other.dailyActivityDiary.webApp !== saved.other.dailyActivityDiary.webApp ||
    current.other.dailyActivityDiary.email !== saved.other.dailyActivityDiary.email ||
    current.other.postFavoritedNotifyTeachers !== saved.other.postFavoritedNotifyTeachers
  ) {
    return true;
  }

  // 5. Parent checks
  if (
    current.parent.onStudentAttendance !== saved.parent.onStudentAttendance ||
    current.parent.onStudentAddedToActivity !== saved.parent.onStudentAddedToActivity ||
    current.parent.onStudentMediaAdded !== saved.parent.onStudentMediaAdded
  ) {
    return true;
  }

  return false;
}

/**
 * Validates integrity of notification settings (range checks, time formats, invariants)
 */
export function validateNotificationSettings(
  settings: SchoolNotificationSettings
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Attendance invariants
  if (settings.attendance.pickupReminderTime !== '17:00') {
    errors.push('Giờ nhắc nhở điểm danh phải cố định ở mốc 17:00.');
  }

  // Birthday schedule invariants
  const bDay = settings.birthday.broadcastSchedule.dayOfMonth;
  if (bDay < 1 || bDay > 31 || !Number.isInteger(bDay)) {
    errors.push('Ngày nhắc sinh nhật phải nằm trong khoảng từ ngày 1 đến ngày 31.');
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(settings.birthday.broadcastSchedule.time)) {
    errors.push('Giờ nhắc sinh nhật không đúng định dạng HH:mm.');
  }

  // Tuition invariants
  const graceDay = settings.tuition.gracePeriod.dayOfMonth;
  if (graceDay < 1 || graceDay > 31 || !Number.isInteger(graceDay)) {
    errors.push('Ngày nhắc gia hạn học phí phải nằm trong khoảng từ ngày 1 đến ngày 31.');
  }

  const dueDays = settings.tuition.dueReminder.days;
  if (dueDays < 1 || dueDays > 31 || !Number.isInteger(dueDays)) {
    errors.push('Số ngày nhắc học phí đến hạn phải nằm trong khoảng từ 1 đến 31 ngày.');
  }

  // Other section invariants
  if (settings.other.dailyActivityDiary.time !== '20:00') {
    errors.push('Giờ nhắc nhật ký hàng ngày phải cố định ở mốc 20:00.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
