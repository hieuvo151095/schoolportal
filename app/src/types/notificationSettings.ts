/**
 * TypeScript Domain Types and Data Contracts for Settings Notifications (Cấu Hình - Thông Báo)
 * Feature: 050-settings-notifications-thong-bao
 * Epic: E-035-settings-notifications
 * Source of Truth: docs_legacy/operating-portal/M6-cau-hinh/SM6-thong-bao.md
 */

export type ExtracurricularScope = 'all' | string; // 'all' or specific class ID
export type TuitionDueTiming = 'before' | 'after';

/**
 * Section 1: Attendance Notifications (Điểm danh)
 */
export interface AttendanceNotificationSettings {
  // Fixed readonly at '17:00' (BR06, K100)
  pickupReminderTime: string;
  pickupTeacherReminder: boolean;
  dropoffTeacherReminder: boolean;
  
  extracurricular: {
    scope: ExtracurricularScope; // 'all' or specific class id (BR07, K101)
    notifyParents: boolean;
    notifyTeachers: boolean;
  };
}

/**
 * Section 2: Birthday Notifications (Sinh nhật)
 */
export interface BirthdayNotificationSettings {
  // Shared parameter row without independent toggle (BR04, K098)
  broadcastSchedule: {
    dayOfMonth: number; // 1-31 (default 25)
    time: string; // HH:mm e.g. '09:00'
  };
  notifyTeachers: boolean;
  notifyAdmins: boolean;
}

/**
 * Section 3: Tuition Fee Notifications (Học phí)
 */
export interface TuitionNotificationSettings {
  tuitionChangeNotifyParents: boolean;
  tuitionChangeNotifyAdmins: boolean;
  
  gracePeriod: {
    dayOfMonth: number; // 1-31, default 16
    notifyParents: boolean;
  };
  
  dueReminder: {
    timing: TuitionDueTiming; // 'before' | 'after' (BR08, K102)
    days: number; // 1-31, default 3
    notifyParents: boolean;
  };
}

/**
 * Section 4: Other Operational Notifications (Khác)
 */
export interface OtherNotificationSettings {
  conversationsNotifyAdmins: boolean;
  
  // Dual-channel asymmetry (BR05, K099)
  pendingActivityApproval: {
    webApp: boolean;
    email: boolean;
  };
  
  // Fixed readonly time at '20:00' (BR06, K100)
  dailyActivityDiary: {
    time: string; // '20:00'
    webApp: boolean;
    email: boolean;
  };
  
  postFavoritedNotifyTeachers: boolean;
}

/**
 * Section 5: Parent Notifications (Phụ huynh nhận thông báo)
 */
export interface ParentNotificationSettings {
  onStudentAttendance: boolean;
  onStudentAddedToActivity: boolean;
  onStudentMediaAdded: boolean;
}

/**
 * Complete Aggregated Notification Settings for a School Tenant
 */
export interface SchoolNotificationSettings {
  attendance: AttendanceNotificationSettings;
  birthday: BirthdayNotificationSettings;
  tuition: TuitionNotificationSettings;
  other: OtherNotificationSettings;
  parent: ParentNotificationSettings;
  updatedAt?: string;
  updatedBy?: string;
}

/**
 * Extracurricular Class Option for Scope Dropdown
 */
export interface ExtracurricularClassOption {
  id: string;
  name: string;
}

/**
 * Redux State for Notification Settings Sub-Module
 */
export interface NotificationSettingsState {
  currentSettings: SchoolNotificationSettings;
  savedSettings: SchoolNotificationSettings;
  extracurricularClasses: ExtracurricularClassOption[];
  isConfirmModalOpen: boolean;
  toastMessage: string | null;
  error: string | null;
}
