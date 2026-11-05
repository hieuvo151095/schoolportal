/**
 * Mock Student Absence & Meal Refund Data
 * Feature ID: 034-settings-meal-refund-mechanism-and-next-month-invoice-deduction
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 */

import type { StudentAbsenceBreakdown, MealFeeDailyRates } from '../types/settingFee.ts';

export const mockDefaultMealDailyRates: MealFeeDailyRates = {
  mainMealUnitPrice: 40000,
  breakfastUnitPrice: 20000,
};

export const mockStudentAbsenceBreakdowns: StudentAbsenceBreakdown[] = [
  // 0. Nguyễn Trí Bình An (Lớp 11A1 - ID: 83)
  // - Nghỉ có phép: 2 ngày (10/09, 11/09)
  {
    studentId: '83',
    studentName: 'Nguyễn Trí Bình An',
    className: 'Lớp 11A1',
    month: '2026-09',
    selfAbsenceDays: 2,
    excusedAbsenceDays: 2,
    unexcusedAbsenceDays: 0,
    schoolHolidayDays: 1,
    selfAbsenceDates: ['2026-09-10', '2026-09-11'],
    schoolHolidayDates: ['2026-09-02'],
  },
  // 1. Lê Hoàng Cường (Lớp 6A1 - ID: hs-603)
  // - Nghỉ có phép: 3 ngày (15/09, 16/09, 17/09)
  {
    studentId: 'hs-603',
    studentName: 'Lê Hoàng Cường',
    className: '6A1',
    month: '2026-09',
    selfAbsenceDays: 3,
    excusedAbsenceDays: 3,
    unexcusedAbsenceDays: 0,
    schoolHolidayDays: 2,
    selfAbsenceDates: ['2026-09-15', '2026-09-16', '2026-09-17'],
    schoolHolidayDates: ['2026-09-01', '2026-09-02'],
  },
  // 2. Phạm Nhật Nam (Lớp 11A2 - ID: hs-006)
  // - Nghỉ có phép: 2 ngày (22/09, 23/09)
  {
    studentId: 'hs-006',
    studentName: 'Phạm Nhật Nam',
    className: 'Lớp 11A2',
    month: '2026-09',
    selfAbsenceDays: 2,
    excusedAbsenceDays: 2,
    unexcusedAbsenceDays: 0,
    schoolHolidayDays: 2,
    selfAbsenceDates: ['2026-09-22', '2026-09-23'],
    schoolHolidayDates: ['2026-09-01', '2026-09-02'],
  },
  // 3. Nguyễn Gia Huy (Lớp 1A1)
  // - Nghỉ có phép: 3 ngày (15/09, 16/09, 17/09)
  {
    studentId: 'hs-001',
    studentName: 'Nguyễn Gia Huy',
    className: 'Lớp 1A1',
    month: '2026-09',
    selfAbsenceDays: 3,
    excusedAbsenceDays: 3,
    unexcusedAbsenceDays: 0,
    schoolHolidayDays: 1,
    selfAbsenceDates: ['2026-09-15', '2026-09-16', '2026-09-17'],
    schoolHolidayDates: ['2026-09-02'],
  },
  // 4. Trần Bảo Nam (Lớp 1A1)
  {
    studentId: 'hs-002',
    studentName: 'Trần Bảo Nam',
    className: 'Lớp 1A1',
    month: '2026-09',
    selfAbsenceDays: 1,
    excusedAbsenceDays: 1,
    unexcusedAbsenceDays: 0,
    schoolHolidayDays: 1,
    selfAbsenceDates: ['2026-09-10'],
    schoolHolidayDates: ['2026-09-02'],
  },
  // 5. Lê Hoàng Yến (Lớp 2A2)
  {
    studentId: 'hs-003',
    studentName: 'Lê Hoàng Yến',
    className: 'Lớp 2A2',
    month: '2026-09',
    selfAbsenceDays: 2,
    excusedAbsenceDays: 2,
    unexcusedAbsenceDays: 0,
    schoolHolidayDays: 1,
    selfAbsenceDates: ['2026-09-08', '2026-09-09'],
    schoolHolidayDates: ['2026-09-02'],
  },
  // 6. Phạm Minh Khang (Lớp 3A1)
  {
    studentId: 'hs-004',
    studentName: 'Phạm Minh Khang',
    className: 'Lớp 3A1',
    month: '2026-09',
    selfAbsenceDays: 0,
    excusedAbsenceDays: 0,
    unexcusedAbsenceDays: 0,
    schoolHolidayDays: 1,
    selfAbsenceDates: [],
    schoolHolidayDates: ['2026-09-02'],
  },
  // 7. Vũ Đức Duy (Lớp 1A2)
  // - 2 ngày nghỉ có phép, 2 ngày nghỉ không phép
  {
    studentId: 'hs-005',
    studentName: 'Vũ Đức Duy',
    className: 'Lớp 1A2',
    month: '2026-09',
    selfAbsenceDays: 4,
    excusedAbsenceDays: 2,
    unexcusedAbsenceDays: 2,
    schoolHolidayDays: 1,
    selfAbsenceDates: ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17'],
    schoolHolidayDates: ['2026-09-02'],
  },
];

/**
 * Lookup absence breakdown for a specific student and month.
 * Supports exact student ID match or fallback normalized key match.
 */
export function getStudentAbsenceBreakdown(
  studentId: string,
  month = '2026-09'
): StudentAbsenceBreakdown | undefined {
  if (!studentId) return undefined;

  const targetId = studentId.toLowerCase().trim();

  // Exact ID match
  const exact = mockStudentAbsenceBreakdowns.find(
    (b) => b.studentId.toLowerCase() === targetId && b.month === month
  );
  if (exact) return exact;

  // Specific alias matching for flexible lookup in tests
  if (targetId.includes('603') || targetId.includes('cuong') || targetId.includes('cường')) {
    return mockStudentAbsenceBreakdowns.find((b) => b.studentId === 'hs-603' && b.month === month);
  }

  if (targetId.includes('006') || targetId.includes('nhat-nam') || targetId.includes('nhật nam')) {
    return mockStudentAbsenceBreakdowns.find((b) => b.studentId === 'hs-006' && b.month === month);
  }

  return undefined;
}
