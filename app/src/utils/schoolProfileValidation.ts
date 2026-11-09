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
  CameraAttendanceRules,
  CameraTimeWindow,
  SchoolEducationalType,
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

/**
 * Returns default Camera Attendance Rules baseline.
 * - Preschool (Mầm non): 1 buổi (pickup 06:30-11:45, dropoff 14:15-17:30).
 * - K12: 2 buổi (morning pickup 06:30-08:30, morning dropoff 11:15-12:30,
 *   afternoon pickup 12:45-14:00, afternoon dropoff 16:00-17:45).
 */
export function getDefaultCameraAttendanceRules(
  educationalType: SchoolEducationalType = 'mam_non'
): CameraAttendanceRules {
  return {
    educationalType,
    pickup: {
      enabled: true,
      startTime: '06:30',
      endTime: '11:45',
    },
    dropoff: {
      enabled: true,
      startTime: '14:15',
      endTime: '17:30',
    },
    morningPickup: {
      enabled: true,
      startTime: '06:30',
      endTime: '08:30',
    },
    morningDropoff: {
      enabled: true,
      startTime: '11:15',
      endTime: '12:30',
    },
    afternoonPickup: {
      enabled: true,
      startTime: '12:45',
      endTime: '14:00',
    },
    afternoonDropoff: {
      enabled: true,
      startTime: '16:00',
      endTime: '17:45',
    },
  };
}

/**
 * Helper to validate a single time window (startTime < endTime).
 */
export function validateCameraWindow(
  window: CameraTimeWindow,
  windowLabel: string
): { isValid: boolean; error?: string } {
  if (!window.enabled) return { isValid: true };
  if (!window.startTime || !window.endTime) {
    return {
      isValid: false,
      error: `Vui lòng chọn đầy đủ giờ bắt đầu và kết thúc cho ${windowLabel}.`,
    };
  }
  if (window.startTime >= window.endTime) {
    return {
      isValid: false,
      error: `Giờ bắt đầu phải trước giờ kết thúc (${windowLabel}: ${window.startTime} ≥ ${window.endTime}).`,
    };
  }
  return { isValid: true };
}

/**
 * Validates Camera Attendance Rules ensuring non-overlapping windows and chronological integrity.
 * - For Preschool (1 buổi): pickup.endTime <= dropoff.startTime (when both enabled).
 * - For K12 (2 buổi): morningPickup <= morningDropoff <= afternoonPickup <= afternoonDropoff.
 */
export function validateCameraAttendanceRules(
  rules: CameraAttendanceRules
): { isValid: boolean; error?: string } {
  if (rules.educationalType === 'mam_non') {
    const pickupVal = validateCameraWindow(rules.pickup, 'Giờ đón học sinh');
    if (!pickupVal.isValid) return pickupVal;

    const dropoffVal = validateCameraWindow(rules.dropoff, 'Giờ trả học sinh');
    if (!dropoffVal.isValid) return dropoffVal;

    if (rules.pickup.enabled && rules.dropoff.enabled) {
      if (rules.pickup.endTime > rules.dropoff.startTime) {
        return {
          isValid: false,
          error: `Khung giờ đón và khung giờ trả không được trùng nhau (Giờ đón kết thúc lúc ${rules.pickup.endTime}, sau giờ bắt đầu trả ${rules.dropoff.startTime}).`,
        };
      }
    }
  } else {
    // K12 (2 buổi)
    const mPick = validateCameraWindow(rules.morningPickup, 'Giờ đón sáng');
    if (!mPick.isValid) return mPick;

    const mDrop = validateCameraWindow(rules.morningDropoff, 'Giờ trả sáng');
    if (!mDrop.isValid) return mDrop;

    const aPick = validateCameraWindow(rules.afternoonPickup, 'Giờ đón chiều');
    if (!aPick.isValid) return aPick;

    const aDrop = validateCameraWindow(rules.afternoonDropoff, 'Giờ trả chiều');
    if (!aDrop.isValid) return aDrop;

    if (rules.morningPickup.enabled && rules.morningDropoff.enabled) {
      if (rules.morningPickup.endTime > rules.morningDropoff.startTime) {
        return {
          isValid: false,
          error: `Khung giờ đón sáng và trả sáng không được trùng nhau (${rules.morningPickup.endTime} > ${rules.morningDropoff.startTime}).`,
        };
      }
    }

    if (rules.morningDropoff.enabled && rules.afternoonPickup.enabled) {
      if (rules.morningDropoff.endTime > rules.afternoonPickup.startTime) {
        return {
          isValid: false,
          error: `Khung giờ trả sáng và đón chiều không được trùng nhau (${rules.morningDropoff.endTime} > ${rules.afternoonPickup.startTime}).`,
        };
      }
    }

    if (rules.afternoonPickup.enabled && rules.afternoonDropoff.enabled) {
      if (rules.afternoonPickup.endTime > rules.afternoonDropoff.startTime) {
        return {
          isValid: false,
          error: `Khung giờ đón chiều và trả chiều không được trùng nhau (${rules.afternoonPickup.endTime} > ${rules.afternoonDropoff.startTime}).`,
        };
      }
    }
  }

  return { isValid: true };
}

export interface CameraNotificationRuleInfo {
  eventCapture: 'first' | 'last';
  dispatchTiming: 'immediate' | 'cutoff';
  label: string;
  badgeText: string;
}

/**
 * Returns exact event capture and notification timing rule for a given window:
 * - Preschool:
 *   - Check-in: captures first event -> immediate notification.
 *   - Check-out: captures last event -> notification at cutoff (endTime).
 * - K12:
 *   - All sessions (Morning pickup/dropoff, Afternoon pickup/dropoff):
 *     captures first event -> immediate notification.
 */
export function getCameraNotificationRule(
  educationalType: SchoolEducationalType,
  windowKey: 'pickup' | 'dropoff' | 'morningPickup' | 'morningDropoff' | 'afternoonPickup' | 'afternoonDropoff',
  endTime = ''
): CameraNotificationRuleInfo {
  if (educationalType === 'mam_non') {
    if (windowKey === 'dropoff') {
      return {
        eventCapture: 'last',
        dispatchTiming: 'cutoff',
        label: `Lấy sự kiện nhận diện cuối cùng; hệ thống tự động bắn thông báo đến phụ huynh tại mốc kết thúc (${endTime || 'hết giờ'}).`,
        badgeText: 'Sự kiện cuối · Bắn thông báo mốc cuối',
      };
    }
    return {
      eventCapture: 'first',
      dispatchTiming: 'immediate',
      label: 'Lấy sự kiện nhận diện đầu tiên; hệ thống tự động bắn thông báo đến phụ huynh ngay lập tức.',
      badgeText: 'Sự kiện đầu · Bắn thông báo ngay',
    };
  }

  // K12
  return {
    eventCapture: 'first',
    dispatchTiming: 'immediate',
    label: 'Lấy sự kiện nhận diện đầu tiên; hệ thống tự động bắn thông báo đến phụ huynh ngay lập tức.',
    badgeText: 'Sự kiện đầu · Bắn thông báo ngay',
  };
}
