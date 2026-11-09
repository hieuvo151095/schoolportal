/**
 * School Profile & Operational Baseline Configuration Contracts
 * Feature: 046-settings-school-profile-truong
 * Standards: BR01-BR14, K069-K075, TR-01, TR-02
 */

export type NotificationLanguage = 'vi' | 'en';

export type SchoolEducationalType = 'mam_non' | 'k12';

export interface CameraTimeWindow {
  enabled: boolean;
  startTime: string; // 'HH:mm', step 5 or 15 mins
  endTime: string;   // 'HH:mm', step 5 or 15 mins
}

export interface CameraAttendanceRules {
  educationalType: SchoolEducationalType;
  // Preschool (Mầm non - 1 buổi: Sáng đón, Chiều trả)
  pickup: CameraTimeWindow; // Giờ đón
  dropoff: CameraTimeWindow; // Giờ trả
  // K12 (2 buổi: Sáng đón/trả, Chiều đón/trả)
  morningPickup: CameraTimeWindow;
  morningDropoff: CameraTimeWindow;
  afternoonPickup: CameraTimeWindow;
  afternoonDropoff: CameraTimeWindow;
}

export interface SchoolProfile {
  schoolCode: string;
  name: string; // Mandatory (*)
  shortName?: string;
  address: string; // Mandatory (*)
  website?: string;
  phone?: string;
  email: string; // Mandatory (*)
  slogan?: string;
  contactInfo?: string;
  defaultLanguage: NotificationLanguage;
  logoUrl?: string;
  educationStages: string[]; // Read-only (e.g. ['02-TH', '03-THCS'])
  educationalType?: SchoolEducationalType; // 'mam_non' | 'k12'
}

export interface DayOperatingHour {
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, ..., 6 = Saturday, 0 = Sunday
  dayLabel: string; // 'Thứ 2', 'Thứ 3', ..., 'Thứ 7', 'Chủ nhật'
  isOpen: boolean; // false for Sunday (static)
  openTime?: string; // 'HH:mm', step 5 minutes
  closeTime?: string; // 'HH:mm', step 5 minutes
}

export interface AttendanceRules {
  lateArrivalEnabled: boolean;
  lateArrivalThresholdMinutes: number; // 5 to 60, step 5
  lateDepartureEnabled: boolean;
  lateDepartureThresholdMinutes: number; // Read-only description threshold (e.g. 15 mins)
  lateDepartureNotice: string;
  attendanceMode: string; // Read-only: 'Điểm danh 2 buổi'
  attendanceModeNotice: string; // 'Liên hệ Eco School để thay đổi'
  morningSessionTime: string; // Read-only: '07:00 - 11:30'
  afternoonSessionTime: string; // Read-only: '13:30 - 17:00'
  sessionTimeNotice: string; // 'Hiện Eco School chưa hỗ trợ thay đổi thông tin này'
}

export interface SchoolInfoFormData {
  name: string;
  shortName: string;
  address: string;
  website: string;
  phone: string;
  email: string;
  slogan: string;
  contactInfo: string;
  defaultLanguage: NotificationLanguage;
  logoUrl?: string;
}

export interface SchoolInfoValidationErrors {
  name?: string;
  address?: string;
  email?: string;
}

export interface OperatingHoursFormData {
  weekdays: Record<number, { openTime: string; closeTime: string; isOpen: boolean }>;
}

export interface AttendanceRulesFormData {
  lateArrivalEnabled: boolean;
  lateArrivalThresholdMinutes: number;
  lateDepartureEnabled: boolean;
}

export interface SchoolProfileState {
  profile: SchoolProfile;
  operatingHours: DayOperatingHour[];
  attendanceRules: AttendanceRules;
  cameraAttendanceRules: CameraAttendanceRules;
  activeTab: 'info' | 'weekdays';
  isDirtyInfo: boolean;
  isDirtyHours: boolean;
  isDirtyRules: boolean;
  isDirtyCamera: boolean;
  showUnsavedLeaveModal: boolean;
  pendingNavigationUrl?: string;
  toastMessage?: string;
  toastType?: 'success' | 'error' | 'info';
}
