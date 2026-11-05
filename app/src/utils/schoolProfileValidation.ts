/**
 * School Profile Validation and Calculation Engine
 * Feature: 046-settings-school-profile-truong
 * Standards: BR01-BR14, K069-K075, TR-01, TR-02
 */

import type {
  DayOperatingHour,
  AttendanceRules,
  SchoolInfoFormData,
  SchoolInfoValidationErrors,
} from '../types/schoolProfile.ts';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates a single field on blur for real-time inline feedback (TR-01, BR02).
 */
export function validateSchoolInfoField(
  field: keyof SchoolInfoFormData,
  value: string | undefined
): string | undefined {
  const trimmed = (value || '').trim();

  switch (field) {
    case 'name':
      if (!trimmed) {
        return 'Vui lòng nhập tên trường'; // TR-01
      }
      return undefined;

    case 'address':
      if (!trimmed) {
        return 'Vui lòng nhập địa chỉ trường'; // TR-01
      }
      return undefined;

    case 'email':
      if (!trimmed) {
        return 'Vui lòng nhập email trường'; // TR-01
      }
      if (!EMAIL_REGEX.test(trimmed)) {
        return 'Email không đúng định dạng';
      }
      return undefined;

    default:
      return undefined;
  }
}

/**
 * Validates the entire basic info form payload upon submission.
 */
export function validateSchoolInfo(formData: SchoolInfoFormData): {
  isValid: boolean;
  errors: SchoolInfoValidationErrors;
} {
  const errors: SchoolInfoValidationErrors = {};

  const nameError = validateSchoolInfoField('name', formData.name);
  if (nameError) errors.name = nameError;

  const addressError = validateSchoolInfoField('address', formData.address);
  if (addressError) errors.address = addressError;

  const emailError = validateSchoolInfoField('email', formData.email);
  if (emailError) errors.email = emailError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates time selection intervals constrained strictly to 5-minute fixed increments
 * from startHour (default 06:00) to endHour (default 18:00) (BR08, K072).
 */
export function generateTimeOptions(startHour = 6, endHour = 18, stepMinutes = 5): string[] {
  const options: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    const maxM = h === endHour ? 0 : 55;
    for (let m = 0; m <= maxM; m += stepMinutes) {
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
}

/**
 * Generates late arrival grace period minute increments from 5 to 60 (step 5) (BR10).
 */
export function generateLateArrivalOptions(min = 5, max = 60, step = 5): number[] {
  const options: number[] = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }
  return options;
}

/**
 * Validates operating hours ensuring openTime < closeTime for active days (VR-SCH-05).
 */
export function validateOperatingHours(
  hours: DayOperatingHour[] | Record<number, { openTime: string; closeTime: string; isOpen: boolean }>
): { isValid: boolean; error?: string } {
  const list: { dayLabel?: string; isOpen: boolean; openTime?: string; closeTime?: string }[] = Array.isArray(
    hours
  )
    ? hours
    : Object.values(hours);

  for (const day of list) {
    if (day.isOpen && day.openTime && day.closeTime) {
      if (day.openTime >= day.closeTime) {
        return {
          isValid: false,
          error: `Giờ mở cửa phải trước giờ đóng cửa (${day.dayLabel || 'ngày hoạt động'})`,
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Validates attendance calculation rules.
 */
export function validateAttendanceRules(rules: {
  lateArrivalThresholdMinutes: number;
}): { isValid: boolean; error?: string } {
  if (
    rules.lateArrivalThresholdMinutes < 5 ||
    rules.lateArrivalThresholdMinutes > 60 ||
    rules.lateArrivalThresholdMinutes % 5 !== 0
  ) {
    return {
      isValid: false,
      error: 'Mốc thời gian đến muộn phải từ 5 đến 60 phút và chia hết cho 5.',
    };
  }

  return { isValid: true };
}

/**
 * Returns default institutional weekly operating hours (Monday to Sunday).
 * Sunday is strictly non-operational (isOpen: false) (BR09, K073).
 */
export function getDefaultOperatingHours(): DayOperatingHour[] {
  return [
    { dayOfWeek: 1, dayLabel: 'Thứ 2', isOpen: true, openTime: '07:00', closeTime: '17:30' },
    { dayOfWeek: 2, dayLabel: 'Thứ 3', isOpen: true, openTime: '07:00', closeTime: '17:30' },
    { dayOfWeek: 3, dayLabel: 'Thứ 4', isOpen: true, openTime: '07:00', closeTime: '17:30' },
    { dayOfWeek: 4, dayLabel: 'Thứ 5', isOpen: true, openTime: '07:00', closeTime: '17:30' },
    { dayOfWeek: 5, dayLabel: 'Thứ 6', isOpen: true, openTime: '07:00', closeTime: '17:30' },
    { dayOfWeek: 6, dayLabel: 'Thứ 7', isOpen: true, openTime: '07:30', closeTime: '11:30' },
    { dayOfWeek: 0, dayLabel: 'Chủ nhật', isOpen: false, openTime: undefined, closeTime: undefined },
  ];
}

/**
 * Returns default attendance rules baseline.
 */
export function getDefaultAttendanceRules(): AttendanceRules {
  return {
    lateArrivalEnabled: true,
    lateArrivalThresholdMinutes: 15,
    lateDepartureEnabled: true,
    lateDepartureThresholdMinutes: 15,
    lateDepartureNotice:
      'Học sinh ra về sau 15 phút so với giờ hoạt động sẽ tính là về muộn.',
    attendanceMode: 'Điểm danh 2 buổi',
    attendanceModeNotice: 'Liên hệ Eco School để thay đổi',
    morningSessionTime: '07:00 - 11:30',
    afternoonSessionTime: '13:30 - 17:00',
    sessionTimeNotice: 'Hiện Eco School chưa hỗ trợ thay đổi thông tin này',
  };
}
