/**
 * Pure Validation & Business Logic Engine for Academics Homework Assignment (Bài Tập)
 * Enforces BR01 through BR13 rules from docs_legacy/operating-portal/hoc-tap/bai-tap.md
 */

import type {
  AssignmentFormData,
  AssignmentFilterCriteria,
  AssignmentSubmission,
  AssignmentActionPermission,
  HomeworkAssignment,
  SubmissionTally,
  SubmitGradingFormData,
  AssignmentLifecycleStatus,
} from '../types/assignment.ts';

/**
 * BR01 & BR02: Form Validation
 * Form requires 4 mandatory fields: Lớp (classId), Môn học (subjectId), Tên bài tập (title), Hạn nộp bài (dueDate).
 * Resolves legacy defect by ensuring subjectId is non-empty and not "Chưa có môn học".
 */
export function validateAssignmentForm(
  data: Partial<AssignmentFormData>,
  isEdit = false
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.classId || data.classId.trim() === '') {
    errors.classId = 'Vui lòng chọn lớp học';
  }

  if (!data.subjectId || data.subjectId.trim() === '' || data.subjectId === 'Chưa có môn học') {
    errors.subjectId = 'Vui lòng chọn môn học';
  }

  if (!isEdit && (!data.title || data.title.trim() === '')) {
    errors.title = 'Vui lòng nhập tên bài tập';
  }

  if (!data.dueDate || data.dueDate.trim() === '') {
    errors.dueDate = 'Vui lòng chọn hạn nộp bài';
  } else {
    const dueTime = new Date(data.dueDate).getTime();
    if (isNaN(dueTime)) {
      errors.dueDate = 'Hạn nộp bài không hợp lệ';
    }
  }

  if (data.scheduledSendDate && data.scheduledSendDate.trim() !== '') {
    const sendTime = new Date(data.scheduledSendDate).getTime();
    if (isNaN(sendTime)) {
      errors.scheduledSendDate = 'Ngày gửi không hợp lệ';
    } else if (data.dueDate) {
      const dueTime = new Date(data.dueDate).getTime();
      if (!isNaN(dueTime) && sendTime >= dueTime) {
        errors.scheduledSendDate = 'Ngày gửi phải trước hạn nộp bài';
      }
    }
  }

  if (data.audienceType === 'specific_students') {
    if (!data.targetStudentIds || data.targetStudentIds.length === 0) {
      errors.targetStudentIds = 'Vui lòng chọn ít nhất một học sinh';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * BR09: Late submission detection
 * Compares submission timestamp with assignment due date.
 * If submitted after due date, returns true (triggers red "Bài nộp này được ghi nhận là trễ hạn" alert).
 */
export function isLateSubmission(submittedAt: string, dueDate: string): boolean {
  const submitTime = new Date(submittedAt).getTime();
  const dueTime = new Date(dueDate).getTime();

  if (isNaN(submitTime) || isNaN(dueTime)) {
    return false;
  }

  return submitTime > dueTime;
}

/**
 * BR09: Validation for Submit-on-behalf & Grading Modal
 * When "Đánh giá" toggle is enabled, Score (0-10) and Teacher Comment are mandatory (*).
 */
export function validateGradingSubmission(
  data: SubmitGradingFormData,
  dueDate: string
): { isValid: boolean; errors: Record<string, string>; isLate: boolean } {
  const errors: Record<string, string> = {};

  if (!data.submittedAt || data.submittedAt.trim() === '') {
    errors.submittedAt = 'Vui lòng chọn thời gian nộp bài';
  }

  const isLate = isLateSubmission(data.submittedAt, dueDate);

  if (data.isGraded) {
    if (data.score === undefined || data.score === null || isNaN(data.score)) {
      errors.score = 'Vui lòng nhập điểm số';
    } else if (data.score < 0 || data.score > 10) {
      errors.score = 'Điểm số phải từ 0.0 đến 10.0';
    }

    if (!data.teacherComment || data.teacherComment.trim() === '') {
      errors.teacherComment = 'Vui lòng nhập nhận xét khi đánh giá học sinh';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isLate,
  };
}

/**
 * BR04: Determine assignment status on creation/save
 * - "Lưu nháp" -> 'da_tao'
 * - "Lưu và gửi" with future scheduledSendDate -> 'chua_gui'
 * - "Lưu và gửi" without future date -> 'da_gui'
 */
export function determineInitialStatusOnSave(
  scheduledSendDate?: string,
  isDraft = false
): AssignmentLifecycleStatus {
  if (isDraft) {
    return 'da_tao';
  }

  if (scheduledSendDate && scheduledSendDate.trim() !== '') {
    const sendTime = new Date(scheduledSendDate).getTime();
    const now = Date.now();
    if (!isNaN(sendTime) && sendTime > now) {
      return 'chua_gui';
    }
  }

  return 'da_gui';
}

/**
 * Calculate submission metrics for an assignment
 */
export function calculateSubmissionTally(submissions: AssignmentSubmission[]): SubmissionTally {
  const total = submissions.length;
  let submittedCount = 0;
  let evaluatedCount = 0;
  let lateCount = 0;

  for (const s of submissions) {
    if (s.status === 'da_nop' || s.status === 'cham_diem') {
      submittedCount++;
    }
    if (s.status === 'cham_diem' || s.score !== undefined) {
      evaluatedCount++;
    }
    if (s.isLate) {
      lateCount++;
    }
  }

  const submissionRate = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

  return {
    total,
    submittedCount,
    evaluatedCount,
    lateCount,
    submissionRate,
  };
}

/**
 * BR06: Action Permissions Matrix
 * - "Đã tạo" / "Chưa gửi": Edit, Send, Delete
 * - "Đã gửi" with 0 submissions: Edit, Send, Delete
 * - "Đã gửi" with submissions > 0: Edit, Send (no Delete)
 * - Unassigned (no students): Edit, Delete (no Send)
 * - "Đã thu hồi": Delete only
 */
export function getAssignmentActions(assignment: HomeworkAssignment): AssignmentActionPermission {
  const tally = calculateSubmissionTally(assignment.submissions);
  const hasSubmissions = tally.submittedCount > 0;
  const hasAudience =
    assignment.audienceType === 'whole_class' || assignment.targetStudentIds.length > 0;

  switch (assignment.status) {
    case 'da_tao':
    case 'chua_gui':
      return {
        canView: true,
        canEdit: true,
        canSend: hasAudience,
        canDelete: true,
      };

    case 'da_gui':
      return {
        canView: true,
        canEdit: true,
        canSend: hasAudience,
        // Cannot delete dispatched assignment that already has student submissions
        canDelete: !hasSubmissions,
      };

    case 'da_thu_hoi':
      return {
        canView: true,
        canEdit: false,
        canSend: false,
        canDelete: true,
      };

    default:
      return {
        canView: true,
        canEdit: true,
        canSend: false,
        canDelete: false,
      };
  }
}

/**
 * BR12 & BR13: Multi-criteria filtering for assignment catalog
 */
export function filterAssignments(
  assignments: HomeworkAssignment[],
  criteria: AssignmentFilterCriteria,
  currentTimeMs: number = Date.now()
): HomeworkAssignment[] {
  return assignments.filter((item) => {
    // Class filter
    if (criteria.classId && criteria.classId !== 'all' && item.classId !== criteria.classId) {
      return false;
    }

    // Subject filter
    if (criteria.subjectId && criteria.subjectId !== 'all' && item.subjectId !== criteria.subjectId) {
      return false;
    }

    // Status filter
    if (criteria.status && criteria.status !== 'all' && item.status !== criteria.status) {
      return false;
    }

    // Audience type filter
    if (criteria.audienceType && criteria.audienceType !== 'all') {
      if (item.audienceType !== criteria.audienceType) {
        return false;
      }
    }

    // Due date filter (BR12, BR13)
    if (criteria.dueDateFilter && criteria.dueDateFilter !== 'tat_ca') {
      const dueTime = new Date(item.dueDate).getTime();
      if (criteria.dueDateFilter === 'dang_tien_hanh' && dueTime < currentTimeMs) {
        return false;
      }
      if (criteria.dueDateFilter === 'het_han' && dueTime >= currentTimeMs) {
        return false;
      }
    }

    // Keyword search
    if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
      const query = criteria.searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchSubject = item.subjectName.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchStudent = item.submissions.some((s) => s.studentName.toLowerCase().includes(query));

      if (!matchTitle && !matchSubject && !matchDesc && !matchStudent) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Format date string for Vietnamese UI display
 */
export function formatAssignmentDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}
