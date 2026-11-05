// Domain Engine and Validation Rules for Module 1: Vận Hành - Báo Cáo
import type {
  DailyAttendanceRecord,
  ExtendedReport,
  ReportFilterCriteria,
  ReportLifecycleStatus,
} from '../types/reports.ts';

const VIETNAMESE_WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * BR02: Computes all calendar days for a specific year and month.
 * Handles 28, 29, 30, and 31-day months with Vietnamese weekday abbreviations.
 */
export function computeDaysInMonth(
  year: number,
  month: number // 1-indexed: 1 = Jan, 9 = Sep
): Array<{ date: string; dayNumber: number; weekday: string }> {
  const totalDays = new Date(year, month, 0).getDate();
  const days: Array<{ date: string; dayNumber: number; weekday: string }> = [];

  for (let day = 1; day <= totalDays; day++) {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    const dateObj = new Date(year, month - 1, day);
    const weekday = VIETNAMESE_WEEKDAYS[dateObj.getDay()];

    days.push({
      date: dateStr,
      dayNumber: day,
      weekday,
    });
  }

  return days;
}

/**
 * BR05: Computes estimated overtime late-pickup fees.
 * Rate: 50,000 VND per 30 minutes (or fraction thereof) overtime.
 */
export function computeLatePickupFee(
  minutesLate: number,
  baseRatePer30Min: number = 50000
): number {
  if (minutesLate <= 0) return 0;
  const blocks = Math.ceil(minutesLate / 30);
  return blocks * baseRatePer30Min;
}

/**
 * BR03 (Extended Reports): Deletion is strictly restricted to draft reports.
 */
export function canDeleteReport(status: ReportLifecycleStatus): boolean {
  return status === 'draft';
}

/**
 * BR02 / BR09 (Extended Reports): Forward-only lifecycle progression.
 * draft -> sent -> completed
 */
export function getNextReportStatus(
  currentStatus: ReportLifecycleStatus
): ReportLifecycleStatus | null {
  if (currentStatus === 'draft') return 'sent';
  if (currentStatus === 'sent') return 'completed';
  return null;
}

/**
 * Filters extended reports by search query, class, template, and lifecycle status.
 */
export function filterExtendedReports(
  reports: ExtendedReport[],
  filters: ReportFilterCriteria
): ExtendedReport[] {
  return reports.filter((report) => {
    // Class filter
    if (filters.classId && filters.classId !== 'all' && report.classId !== filters.classId) {
      return false;
    }

    // Template filter
    if (filters.templateId && filters.templateId !== 'all' && report.templateId !== filters.templateId) {
      return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && report.status !== filters.status) {
      return false;
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = report.title.toLowerCase().includes(q);
      const matchStudent = report.studentName.toLowerCase().includes(q);
      const matchCode = report.studentCode.toLowerCase().includes(q);
      if (!matchTitle && !matchStudent && !matchCode) {
        return false;
      }
    }

    return true;
  });
}

/**
 * BR08 (Extended Reports): Duplicates a report preserving the original template.
 */
export function duplicateReport(
  sourceReport: ExtendedReport,
  newStudent: {
    id: string;
    name: string;
    code: string;
    age: string;
    parentName: string;
    avatarUrl?: string;
  },
  newClassId: string,
  newClassName: string,
  newStartDate?: string,
  newEndDate?: string
): ExtendedReport {
  const newId = `rep-dup-${Date.now()}`;
  return {
    ...sourceReport,
    id: newId,
    title: `${sourceReport.templateName} - ${newStudent.name}`,
    studentId: newStudent.id,
    studentName: newStudent.name,
    studentCode: newStudent.code,
    studentAge: newStudent.age,
    studentAvatar: newStudent.avatarUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&h=120&fit=crop',
    parentName: newStudent.parentName,
    classId: newClassId,
    className: newClassName,
    startDate: newStartDate || sourceReport.startDate,
    endDate: newEndDate || sourceReport.endDate,
    status: 'draft', // Reset to draft
    createdBy: 'Cô Nguyễn Mai',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checklistData: JSON.parse(JSON.stringify(sourceReport.checklistData)),
  };
}

/**
 * Computes summary totals for a student's monthly attendance records.
 */
export function computeStudentAttendanceTotals(records: {
  [date: string]: DailyAttendanceRecord;
}) {
  let totalPresent = 0;
  let totalAbsentExcused = 0;
  let totalAbsentUnexcused = 0;
  let totalLateArrivals = 0;
  let totalLateArrivalMinutes = 0;
  let totalLateDepartures = 0;
  let totalLateDepartureMinutes = 0;
  let estimatedLateFee = 0;

  Object.values(records).forEach((r) => {
    if (r.status === 'present') {
      totalPresent++;
    } else if (r.status === 'absent_excused') {
      totalAbsentExcused++;
    } else if (r.status === 'absent_unexcused') {
      totalAbsentUnexcused++;
    }

    if (r.isLateArrival) {
      totalLateArrivals++;
      totalLateArrivalMinutes += r.lateArrivalMinutes;
    }

    if (r.isLateDeparture) {
      totalLateDepartures++;
      totalLateDepartureMinutes += r.lateDepartureMinutes;
      estimatedLateFee += computeLatePickupFee(r.lateDepartureMinutes);
    }
  });

  return {
    totalPresent,
    totalAbsentExcused,
    totalAbsentUnexcused,
    totalLateArrivals,
    totalLateArrivalMinutes,
    totalLateDepartures,
    totalLateDepartureMinutes,
    estimatedLateFee,
  };
}
