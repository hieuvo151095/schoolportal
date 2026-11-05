import type { StudentAttendance, AttendanceSummary } from '../types/attendance';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * BR01: Check if an arrival time constitutes late arrival.
 * Default cutoff is 08:00 AM.
 */
export function checkIsLate(arrivalTime: string, cutoffTime: string = '08:00'): boolean {
  if (!arrivalTime) return false;
  return arrivalTime > cutoffTime;
}

/**
 * BR02: Validate student check-out time against arrival time.
 * - MSG02: Rejects if arrivalTime is missing.
 * - MSG01: Rejects if departureTime <= arrivalTime.
 */
export function validateCheckOut(
  arrivalTime: string | null | undefined,
  departureTime: string
): ValidationResult {
  if (!arrivalTime) {
    return {
      valid: false,
      error: 'Chưa nhập thời gian đón học sinh.',
    };
  }

  if (departureTime <= arrivalTime) {
    return {
      valid: false,
      error: 'Giờ trả học sinh phải lớn hơn giờ đón học sinh',
    };
  }

  return { valid: true };
}

/**
 * BR03: Compute attendance breakdown summary for the class roster.
 */
export function calculateAttendanceSummary(
  students: Array<Pick<StudentAttendance, 'status'>>
): AttendanceSummary {
  let presentCount = 0;
  let absentExcusedCount = 0;
  let absentUnexcusedCount = 0;
  let unmarkedCount = 0;

  for (const s of students) {
    switch (s.status) {
      case 'present':
        presentCount++;
        break;
      case 'excused_absent':
        absentExcusedCount++;
        break;
      case 'unexcused_absent':
        absentUnexcusedCount++;
        break;
      case 'unmarked':
      default:
        unmarkedCount++;
        break;
    }
  }

  return {
    totalStudents: students.length,
    presentCount,
    absentExcusedCount,
    absentUnexcusedCount,
    unmarkedCount,
  };
}

/**
 * Format current time as HH:mm
 */
export function getCurrentTimeHHmm(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
