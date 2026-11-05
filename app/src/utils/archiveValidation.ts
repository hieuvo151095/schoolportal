import type { ArchivedStudent, ArchiveStaffOperator, RestoreStudentResult, ArchiveSortField } from '../types/archive.ts';

/**
 * Strips Vietnamese diacritics for insensitive search
 */
export function stripVietnameseDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Filter archived students by text query and optional archive month (YYYY-MM)
 */
export function filterArchivedStudents(
  students: ArchivedStudent[],
  query: string,
  archivePeriodMonth?: string
): ArchivedStudent[] {
  let filtered = [...students];

  // Month filter (YYYY-MM)
  if (archivePeriodMonth && archivePeriodMonth.trim() !== '') {
    filtered = filtered.filter((s) => {
      if (!s.archiveDate) return false;
      return s.archiveDate.startsWith(archivePeriodMonth);
    });
  }

  // Text search query
  const cleanQuery = stripVietnameseDiacritics(query);
  if (cleanQuery) {
    filtered = filtered.filter((s) => {
      const matchName = stripVietnameseDiacritics(s.fullName || '').includes(cleanQuery);
      const matchCode = stripVietnameseDiacritics(s.studentCode || '').includes(cleanQuery);
      const matchNickname = stripVietnameseDiacritics(s.nickname || '').includes(cleanQuery);
      const matchClass = stripVietnameseDiacritics(s.formerClassName || '').includes(cleanQuery);
      const matchReason = stripVietnameseDiacritics(s.archiveReason || '').includes(cleanQuery);
      const matchStaff = s.archivedBy
        ? stripVietnameseDiacritics(s.archivedBy.name || '').includes(cleanQuery)
        : false;

      return matchName || matchCode || matchNickname || matchClass || matchReason || matchStaff;
    });
  }

  return filtered;
}

/**
 * Sort archived students by name or archive date
 */
export function sortArchivedStudents(
  students: ArchivedStudent[],
  field: ArchiveSortField = 'fullName',
  direction: 'asc' | 'desc' = 'asc'
): ArchivedStudent[] {
  return [...students].sort((a, b) => {
    let comparison = 0;

    if (field === 'fullName') {
      const nameA = a.fullName || '';
      const nameB = b.fullName || '';
      comparison = nameA.localeCompare(nameB, 'vi', { sensitivity: 'base' });
    } else if (field === 'archiveDate') {
      const dateA = a.archiveDate || '';
      const dateB = b.archiveDate || '';

      if (!dateA && !dateB) comparison = 0;
      else if (!dateA) comparison = 1; // null dates sink to bottom
      else if (!dateB) comparison = -1;
      else comparison = dateA.localeCompare(dateB);
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Evaluate class continuity when restoring a student
 * Enforces Invariant K066 / BR05
 */
export function evaluateRestorationClass(
  student: ArchivedStudent,
  activeClasses: { id: string; name: string }[]
): RestoreStudentResult {
  const formerId = student.formerClassId;
  const activeClassMatch = activeClasses.find((c) => c.id === formerId);

  if (formerId && activeClassMatch) {
    return {
      success: true,
      studentId: student.id,
      restoredClassId: activeClassMatch.id,
      restoredClassName: activeClassMatch.name,
      isClassActive: true,
    };
  }

  return {
    success: true,
    studentId: student.id,
    restoredClassId: null,
    restoredClassName: 'Chưa xếp lớp',
    isClassActive: false,
    warningMessage: `Lớp cũ (${student.formerClassName || 'Không rõ'}) không còn hoạt động trong năm học hiện tại. Học sinh sẽ được phục hồi với trạng thái 'Chưa xếp lớp'.`,
  };
}

/**
 * Format ISO date (YYYY-MM-DD) to Vietnamese standard DD/MM/YYYY
 * Handles null / empty gracefully with "—"
 */
export function formatArchiveDate(dateStr?: string): string {
  if (!dateStr || dateStr.trim() === '') {
    return '—';
  }

  // Already in DD/MM/YYYY format
  if (dateStr.includes('/')) {
    return dateStr;
  }

  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }

  return dateStr;
}

/**
 * Format gender for Vietnamese UI
 */
export function formatGender(gender?: 'male' | 'female' | 'other'): string {
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    case 'other':
      return 'Khác';
    default:
      return '—';
  }
}
