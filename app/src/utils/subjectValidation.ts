/**
 * Business Rules and Validation Utilities for School Subject Management (Môn Học)
 * Feature ID: 037-school-subject-management-mon-hoc
 */

import type {
  SchoolSubject,
  SubjectFilterState,
  SubjectSummaryKPI,
  SubjectTeacherAssignment,
  EvaluationType,
  EducationStage
} from '../types/subject.ts';

/**
 * Normalizes Vietnamese text by stripping diacritics and converting to lowercase
 * Enables seamless accent-insensitive search (BR05)
 */
export function normalizeVietnameseText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .trim();
}

/**
 * Filter subjects by multi-factor criteria:
 * - Educational Stage (BR01, BR02)
 * - Academic Year (BR11)
 * - Grade Level
 * - Classification
 * - Type
 * - Accent-insensitive search on name or code (BR05)
 */
export function filterSubjects(
  subjects: SchoolSubject[],
  filter: SubjectFilterState
): SchoolSubject[] {
  const normalizedQuery = normalizeVietnameseText(filter.searchQuery);

  return subjects.filter((subject) => {
    // 1. Stage filter
    if (filter.stage && subject.stage !== filter.stage) {
      return false;
    }

    // 2. Academic year filter
    if (filter.academicYear && filter.academicYear !== 'all') {
      if (subject.academicYear !== filter.academicYear) {
        return false;
      }
    }

    // 3. Grade level filter
    if (filter.gradeLevel && filter.gradeLevel !== 'all') {
      const matchesGrade = subject.applicableGrades.some((g) =>
        g.toLowerCase().includes(filter.gradeLevel.toLowerCase())
      );
      if (!matchesGrade) return false;
    }

    // 4. Classification filter
    if (filter.classification && filter.classification !== 'all') {
      if (subject.classification !== filter.classification) {
        return false;
      }
    }

    // 5. Subject type filter
    if (filter.type && filter.type !== 'all') {
      if (subject.type !== filter.type) {
        return false;
      }
    }

    // 6. Accent-insensitive search query
    if (normalizedQuery) {
      const normalizedName = normalizeVietnameseText(subject.name);
      const normalizedCode = normalizeVietnameseText(subject.code);
      const matchesName = normalizedName.includes(normalizedQuery);
      const matchesCode = normalizedCode.includes(normalizedQuery);
      if (!matchesName && !matchesCode) return false;
    }

    return true;
  });
}

/**
 * Filters master teacher directory to exclude teachers already assigned to the subject (BR09)
 */
export function getUnassignedTeachers<T extends { id: string; fullName?: string; name?: string }>(
  allTeachers: T[],
  assignedTeachers: SubjectTeacherAssignment[]
): T[] {
  const assignedIds = new Set(assignedTeachers.map((a) => a.teacherId));
  return allTeachers.filter((t) => !assignedIds.has(t.id));
}

/**
 * Computes high-level summary KPIs for a list of subjects (FR-002)
 */
export function calculateSubjectKPIs(subjects: SchoolSubject[]): SubjectSummaryKPI {
  const totalSubjects = subjects.length;
  const gradedSubjectsCount = subjects.filter((s) => s.isCountedForGPA).length;
  const commentSubjectsCount = subjects.filter((s) => !s.isCountedForGPA).length;

  // Set of unique assigned teacher IDs across the filtered subjects
  const teacherIdSet = new Set<string>();
  subjects.forEach((s) => {
    s.assignedTeachers.forEach((t) => teacherIdSet.add(t.teacherId));
  });

  return {
    totalSubjects,
    gradedSubjectsCount,
    commentSubjectsCount,
    assignedTeachersCount: teacherIdSet.size
  };
}

/**
 * Invariant check: Standard MoET curriculum subjects cannot be deleted (BR06)
 */
export function canDeleteSubject(subject: SchoolSubject): {
  canDelete: boolean;
  reason?: string;
} {
  if (subject.isStandardMoET) {
    return {
      canDelete: false,
      reason: 'Môn học thuộc chương trình chuẩn của Bộ GD&ĐT không được phép xóa.'
    };
  }
  return { canDelete: true };
}

/**
 * Formats evaluation type to human-readable Vietnamese label
 */
export function formatEvaluationType(type: EvaluationType): string {
  switch (type) {
    case 'score':
      return 'Điểm số (0-10)';
    case 'level':
      return 'Mức đánh giá (HTT/HT/CHT)';
    case 'comment':
      return 'Nhận xét';
    case 'score_comment':
      return 'Điểm số & Nhận xét';
    default:
      return 'Không xác định';
  }
}

/**
 * Returns badge styling and label for subject classification
 */
export function formatClassification(classification: string): {
  label: string;
  badgeClass: string;
} {
  switch (classification) {
    case 'mon_hoc':
      return {
        label: 'Môn học',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    case 'hoat_dong_giao_duc':
      return {
        label: 'Hoạt động GD',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    case 'mon_tinh_diem':
      return {
        label: 'Môn tính điểm',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
      };
    case 'mon_nhan_xet':
      return {
        label: 'Môn nhận xét',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    default:
      return {
        label: 'Khác',
        badgeClass: 'bg-slate-50 text-slate-700 border-slate-200'
      };
  }
}

/**
 * Returns badge styling and label for subject type
 */
export function formatSubjectType(type: string): {
  label: string;
  badgeClass: string;
} {
  switch (type) {
    case 'bat_buoc':
      return {
        label: 'Bắt buộc',
        badgeClass: 'bg-red-50 text-red-700 border-red-200'
      };
    case 'tu_chon':
      return {
        label: 'Tự chọn',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
      };
    case 'lua_chon':
      return {
        label: 'Lựa chọn',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200'
      };
    default:
      return {
        label: 'Khác',
        badgeClass: 'bg-slate-50 text-slate-700 border-slate-200'
      };
  }
}

/**
 * Returns readable Vietnamese name for educational stages
 */
export function getStageName(stage: EducationStage): string {
  switch (stage) {
    case 'TH':
      return 'Tiểu học';
    case 'THCS':
      return 'Trung học cơ sở';
    case 'THPT':
      return 'Trung học phổ thông';
    case 'GDTX':
      return 'Giáo dục thường xuyên';
  }
}
