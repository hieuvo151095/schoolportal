import type {
  StaffRole,
  StaffProfile,
  StaffAttendanceRecord,
  StaffAttendanceRosterItem,
  StaffAttendanceKPI,
  StaffAttendanceFilterState,
} from '../types/staffAttendance.ts';

/**
 * Normalizes Vietnamese text by stripping diacritics and converting to lowercase
 * for accent-insensitive search queries.
 */
export function normalizeVietnameseText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * Returns the current ISO date string (YYYY-MM-DD) in local time.
 */
export function getTodayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks whether a given date string is strictly in the future compared to reference date.
 * (BR01: Date picker locks future dates)
 */
export function isDateInFuture(dateStr: string, referenceDateStr: string = getTodayISODate()): boolean {
  if (!dateStr) return false;
  return dateStr > referenceDateStr;
}

/**
 * Calculates day difference between reference date (default: today) and given date.
 */
export function getDayDifference(dateStr: string, referenceDateStr: string = getTodayISODate()): number {
  if (!dateStr) return 0;
  const targetDate = new Date(`${dateStr}T00:00:00`);
  const refDate = new Date(`${referenceDateStr}T00:00:00`);
  const diffMs = refDate.getTime() - targetDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a date is older than 45 days in the past, meaning attendance editing is locked (read-only).
 * (BR02, K046: 45-day retrospective edit boundary)
 */
export function isDateLockedForEdit(dateStr: string, referenceDateStr: string = getTodayISODate()): boolean {
  if (!dateStr) return false;
  const diffDays = getDayDifference(dateStr, referenceDateStr);
  return diffDays > 45;
}

/**
 * Checks if past date warning DD-02 should be shown.
 * Warning DD-02: "Chỉ được cập nhật thông tin điểm danh trong vòng 45 ngày kể từ hôm nay"
 * Displayed when user is viewing any date different from today.
 */
export function shouldShowPastDateWarning(dateStr: string, referenceDateStr: string = getTodayISODate()): boolean {
  if (!dateStr) return false;
  return dateStr !== referenceDateStr;
}

/**
 * Validates 24-hour time format string (HH:mm) from 00:00 to 23:59.
 * (BR04, DD-01)
 */
export const TIME_HHMM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateTimeFormat(timeStr: string): boolean {
  if (!timeStr || typeof timeStr !== 'string') return false;
  return TIME_HHMM_REGEX.test(timeStr.trim());
}

/**
 * Generates the current local system time formatted as HH:mm.
 * (BR03: 1-click check-in/out timestamp)
 */
export function getCurrentTimeHHmm(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formats missing profile fields with standard fallback label "Chưa có {field}".
 * (BR11)
 */
export function formatMissingField(value?: string | null, fieldName: string = 'thông tin'): string {
  if (value && value.trim().length > 0) {
    return value.trim();
  }
  return `Chưa có ${fieldName}`;
}

/**
 * Filters the staff roster based on date-indexed records, class cohort, role, and search query.
 * (BR08, BR09, BR10)
 */
export function filterStaffRoster(
  staffList: StaffProfile[],
  recordsByStaffId: Record<string, StaffAttendanceRecord>,
  filterState: StaffAttendanceFilterState
): StaffAttendanceRosterItem[] {
  const { classId, role, searchQuery } = filterState;
  const normalizedQuery = normalizeVietnameseText(searchQuery);

  return staffList
    .filter((staff) => {
      // Class filter (BR09, K047)
      if (classId && classId !== 'all') {
        const matchesClass = staff.assignedClasses?.some((c) => c.classId === classId);
        if (!matchesClass) return false;
      }

      // Role filter (BR08)
      if (role && role !== 'all') {
        const matchesRole = staff.roles?.includes(role as StaffRole);
        if (!matchesRole) return false;
      }

      // Search query filter (BR10)
      if (normalizedQuery) {
        const nameMatch = normalizeVietnameseText(staff.name).includes(normalizedQuery);
        const nicknameMatch = normalizeVietnameseText(staff.nickname).includes(normalizedQuery);
        const codeMatch = staff.code ? normalizeVietnameseText(staff.code).includes(normalizedQuery) : false;
        if (!nameMatch && !nicknameMatch && !codeMatch) return false;
      }

      return true;
    })
    .map((staff) => {
      const record = recordsByStaffId[staff.id] || {
        id: `att-${staff.id}-${filterState.date}`,
        staffId: staff.id,
        date: filterState.date,
        isAbsent: false,
        updatedAt: new Date().toISOString(),
      };
      return { staff, attendance: record };
    });
}

/**
 * Sorts staff roster items by nickname in ascending or descending alphabetical order.
 * (BR12)
 */
export function sortStaffByNickname(
  roster: StaffAttendanceRosterItem[],
  direction: 'asc' | 'desc'
): StaffAttendanceRosterItem[] {
  return [...roster].sort((a, b) => {
    const nameA = a.staff.nickname || a.staff.name;
    const nameB = b.staff.nickname || b.staff.name;
    const comparison = nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Computes summary KPI presence counters for the given roster items.
 * (BR10)
 */
export function computeStaffKPIs(roster: StaffAttendanceRosterItem[]): StaffAttendanceKPI {
  let attendingCount = 0;
  let excusedAbsenceCount = 0;
  let unexcusedAbsenceCount = 0;

  roster.forEach((item) => {
    const { attendance } = item;
    if (attendance.isAbsent) {
      if (attendance.absenceType === 'khong_phep') {
        unexcusedAbsenceCount++;
      } else {
        // Default to excused absence
        excusedAbsenceCount++;
      }
    } else if (attendance.checkInTime) {
      attendingCount++;
    }
  });

  return {
    attendingCount,
    excusedAbsenceCount,
    unexcusedAbsenceCount,
    totalCount: roster.length,
  };
}

/**
 * Returns badge styling configurations for staff roles.
 * (BR08)
 */
export function getRoleBadgeConfig(role: StaffRole): { label: string; bg: string; text: string; border: string } {
  switch (role) {
    case 'admin':
      return {
        label: 'Admin',
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200',
      };
    case 'quan_ly':
      return {
        label: 'Quản Lý',
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
      };
    case 'giao_vien':
      return {
        label: 'Giáo Viên',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'nhan_vien':
      return {
        label: 'Nhân Viên',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    default:
      return {
        label: role,
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
      };
  }
}
