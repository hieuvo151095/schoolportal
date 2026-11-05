import type {
  Timetable,
  ScheduleActions,
  ScheduleFilterCriteria,
  AcademicSemester,
  ScheduleType,
  SendHistoryEntry,
} from '../types/schedule.ts';

/**
 * BR10: Asymmetric action permissions based on schedule status and format.
 * - Published Grid: Send, Edit, Clone, Download (Delete blocked)
 * - Published File: Send, Edit, Download (Clone blocked, Delete blocked)
 * - Draft Grid: Send, Edit, Clone, Download, Delete
 * - Draft File: Send, Edit, Download, Delete (Clone blocked)
 * Status 'updated' follows the same restrictions as 'published'.
 */
export function getScheduleActions(schedule: Timetable): ScheduleActions {
  const isDraft = schedule.status === 'draft';
  const isGrid = schedule.type === 'grid';

  return {
    canSend: true,
    canEdit: true,
    canClone: isGrid, // Cloning strictly restricted to Grid timetables
    canDownload: true,
    canDelete: isDraft, // Deletion strictly restricted to Draft timetables
  };
}

/**
 * BR02 & BR11: Auto-generate timetable title.
 * Defensively guards against legacy defect where missing semester produced "Học kỳ: undefined".
 */
export function generateAutoTitle(semesterName?: string, customSemester?: string): string {
  const cleanSemester = semesterName?.trim() || customSemester?.trim();
  if (!cleanSemester || cleanSemester.toLowerCase() === 'undefined') {
    return 'Thời khóa biểu: Học kỳ 1';
  }
  return `Thời khóa biểu: ${cleanSemester}`;
}

/**
 * BR03: Academic semester date interval validation.
 * Addresses legacy defect where selecting past academic terms triggered false blocking errors.
 */
export function validateSemesterInterval(
  startDate: string,
  endDate: string,
  semester?: AcademicSemester
): { isValid: boolean; warning?: string; error?: string } {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, error: 'Định dạng ngày không hợp lệ.' };
  }

  if (start > end) {
    return { isValid: false, error: 'Ngày bắt đầu không được lớn hơn ngày kết thúc.' };
  }

  // If standard semester bounds exist, perform non-blocking boundary check
  if (semester && semester.startDate && semester.endDate) {
    const semStart = new Date(semester.startDate);
    const semEnd = new Date(semester.endDate);

    if (start < semStart || end > semEnd) {
      return {
        isValid: true,
        warning: 'Khoảng thời gian nằm ngoài khung học kỳ chuẩn đã cấu hình.',
      };
    }
  }

  return { isValid: true };
}

/**
 * BR04: Guard ensuring submit action in file mode requires an attached file.
 */
export function validateFileSubmission(
  type: ScheduleType,
  fileUrl?: string,
  fileName?: string
): boolean {
  if (type === 'file') {
    return Boolean(fileUrl && fileUrl.trim() && fileName && fileName.trim());
  }
  return true;
}

/**
 * BR12: Multi-criteria schedule filtering.
 */
export function filterTimetables(
  timetables: Timetable[],
  criteria: ScheduleFilterCriteria
): Timetable[] {
  return timetables.filter((t) => {
    // Search query filter (title, className, semesterName, academicYear)
    if (criteria.searchQuery.trim()) {
      const q = criteria.searchQuery.toLowerCase().trim();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchClass = t.className.toLowerCase().includes(q);
      const matchSemester = t.semesterName.toLowerCase().includes(q);
      const matchYear = t.academicYear.toLowerCase().includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      if (!matchTitle && !matchClass && !matchSemester && !matchYear && !matchId) {
        return false;
      }
    }

    // Class filter
    if (criteria.classId && criteria.classId !== 'all') {
      if (t.classId !== criteria.classId) {
        return false;
      }
    }

    // Semester filter
    if (criteria.semesterId && criteria.semesterId !== 'all') {
      if (t.semesterId !== criteria.semesterId) {
        return false;
      }
    }

    // Academic Year filter
    if (criteria.academicYear && criteria.academicYear !== 'all') {
      if (t.academicYear !== criteria.academicYear) {
        return false;
      }
    }

    // Format type filter (grid vs file)
    if (criteria.type && criteria.type !== 'all') {
      if (t.type !== criteria.type) {
        return false;
      }
    }

    // Status filter
    if (criteria.status && criteria.status !== 'all') {
      if (t.status !== criteria.status) {
        return false;
      }
    }

    return true;
  });
}

/**
 * BR08 & BR10: Clone timetable grid structure to target class and semester.
 */
export function cloneTimetableStructure(
  source: Timetable,
  targetClassId: string,
  targetClassName: string,
  targetSemesterId: string,
  targetSemesterName: string,
  customTitle?: string
): Timetable {
  if (source.type !== 'grid') {
    throw new Error('Chỉ có thể tạo bản sao từ thời khóa biểu dạng lưới.');
  }

  const now = new Date().toISOString();
  const newId = `sch-${Date.now()}`;
  const title = customTitle?.trim() || generateAutoTitle(targetSemesterName);

  // Deep clone slots
  const clonedSlots = JSON.parse(JSON.stringify(source.slots));

  return {
    ...source,
    id: newId,
    title,
    classId: targetClassId,
    className: targetClassName,
    semesterId: targetSemesterId,
    semesterName: targetSemesterName,
    status: 'draft',
    sendHistory: [],
    slots: clonedSlots,
    createdAt: now,
    updatedAt: now,
    publishedAt: undefined,
  };
}

/**
 * BR07 & BR08: Add cumulative send history log and update republished status.
 */
export function recordSendHistory(
  schedule: Timetable,
  senderName: string,
  senderRole: string,
  channel: 'all' | 'app_notification' | 'zalo' | 'sms' = 'all',
  recipientsCount: number = 32,
  note?: string
): Timetable {
  const now = new Date().toISOString();
  const entry: SendHistoryEntry = {
    id: `send-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sentAt: now,
    senderName,
    senderRole,
    recipientsCount,
    channel,
    note,
  };

  // If already published or updated, flag status as 'updated' (BR08)
  const nextStatus = schedule.status === 'draft' ? 'published' : 'updated';

  return {
    ...schedule,
    status: nextStatus,
    sendHistory: [entry, ...schedule.sendHistory], // Prepend to cumulative log
    updatedAt: now,
    publishedAt: schedule.publishedAt || now,
  };
}
