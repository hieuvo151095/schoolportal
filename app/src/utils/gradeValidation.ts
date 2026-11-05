import type {
  EducationStage,
  GradeLevel,
  GradeLevelRollup,
  GradeSummaryKPI,
} from '../types/grade.ts';

/**
 * Normalizes Vietnamese string: removes diacritics, converts to lowercase, replaces đ/Đ.
 */
export function normalizeVietnameseText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
}

/**
 * Filters grade levels by educational stage or returns all.
 */
export function filterGradesByStage(
  grades: GradeLevel[],
  stage: 'ALL' | EducationStage
): GradeLevel[] {
  if (!grades) return [];
  if (stage === 'ALL') return [...grades];
  return grades.filter((g) => g.stage === stage);
}

/**
 * Searches grade levels by accent-insensitive name, code, or description.
 */
export function searchGrades(grades: GradeLevel[], query: string): GradeLevel[] {
  if (!grades) return [];
  const normalizedQuery = normalizeVietnameseText(query);
  if (!normalizedQuery) return [...grades];

  return grades.filter((g) => {
    const nameMatch = normalizeVietnameseText(g.name).includes(normalizedQuery);
    const codeMatch = normalizeVietnameseText(g.code).includes(normalizedQuery);
    const idMatch = normalizeVietnameseText(g.id).includes(normalizedQuery);
    const descMatch = g.description
      ? normalizeVietnameseText(g.description).includes(normalizedQuery)
      : false;
    return nameMatch || codeMatch || idMatch || descMatch;
  });
}

/**
 * Computes dynamic capacity rollups for a single grade level from active classes.
 */
export function computeGradeRollups(
  grade: GradeLevel,
  classes: any[],
  academicYear?: string
): GradeLevelRollup {
  const filteredClasses = (classes || []).filter((c) => {
    const gradeMatches =
      c.gradeLevelId === grade.id ||
      c.gradeLevelId === grade.code ||
      c.gradeName === grade.name;
    const yearMatches = academicYear ? c.academicYear === academicYear : true;
    return gradeMatches && yearMatches;
  });

  const classCount = filteredClasses.length;
  const studentCount = filteredClasses.reduce(
    (sum, c) => sum + (Number(c.studentCount) || 0),
    0
  );

  const homeroomAssignedCount = filteredClasses.filter(
    (c) =>
      Boolean(c.homeroomTeacherId) ||
      Boolean(c.homeroomTeacher?.id) ||
      Boolean(c.homeroomTeacherName)
  ).length;

  const homeroomRate =
    classCount > 0 ? Math.round((homeroomAssignedCount / classCount) * 100) : 0;

  // Gather unique teacher IDs
  const teacherIdSet = new Set<string>();
  filteredClasses.forEach((c) => {
    if (c.homeroomTeacherId) teacherIdSet.add(c.homeroomTeacherId);
    if (c.homeroomTeacher?.id) teacherIdSet.add(c.homeroomTeacher.id);
    if (Array.isArray(c.instructors)) {
      c.instructors.forEach((i: any) => {
        if (i.teacherId) teacherIdSet.add(i.teacherId);
      });
    }
  });

  // If no detailed instructors array, estimate teacherCount with at least homeroom + estimated subject teachers
  const teacherCount =
    teacherIdSet.size > 0
      ? teacherIdSet.size
      : classCount > 0
      ? homeroomAssignedCount + classCount * 3
      : 0;

  return {
    ...grade,
    classCount,
    studentCount,
    teacherCount,
    homeroomAssignedCount,
    homeroomRate,
  };
}

/**
 * Computes overall school KPI metrics across provided grade levels and classes.
 */
export function computeSchoolKPIs(
  grades: GradeLevel[],
  classes: any[],
  academicYear?: string
): GradeSummaryKPI {
  const gradeIds = new Set(grades.map((g) => g.id));
  const gradeCodes = new Set(grades.map((g) => g.code));
  const gradeNames = new Set(grades.map((g) => g.name));

  const matchingClasses = (classes || []).filter((c) => {
    const gradeMatches =
      gradeIds.has(c.gradeLevelId) ||
      gradeCodes.has(c.gradeLevelId) ||
      gradeNames.has(c.gradeName);
    const yearMatches = academicYear ? c.academicYear === academicYear : true;
    return gradeMatches && yearMatches;
  });

  const totalGrades = grades.length;
  const totalClasses = matchingClasses.length;
  const totalStudents = matchingClasses.reduce(
    (sum, c) => sum + (Number(c.studentCount) || 0),
    0
  );
  const averageStudentsPerClass =
    totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  return {
    totalGrades,
    totalClasses,
    totalStudents,
    averageStudentsPerClass,
  };
}

/**
 * Formats educational stage badges with ECO design system color styles.
 */
export function getStageBadgeStyle(stage: EducationStage): {
  label: string;
  badgeClass: string;
} {
  switch (stage) {
    case 'TH':
      return {
        label: 'Tiểu học (TH)',
        badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
      };
    case 'THCS':
      return {
        label: 'Trung học cơ sở (THCS)',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      };
    case 'THPT':
      return {
        label: 'Trung học phổ thông (THPT)',
        badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
      };
    case 'GDTX':
      return {
        label: 'Giáo dục thường xuyên (GDTX)',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
      };
    default:
      return {
        label: stage,
        badgeClass: 'bg-gray-50 text-gray-700 border border-gray-200',
      };
  }
}

/**
 * Calculates capacity percentage and returns progress bar color scheme.
 */
export function getCapacityColor(
  current: number,
  max: number
): {
  percent: number;
  colorClass: string;
  barColor: string;
} {
  const percent =
    max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  if (percent >= 100) {
    return {
      percent,
      colorClass: 'text-red-600',
      barColor: 'bg-red-500',
    };
  }
  if (percent >= 90) {
    return {
      percent,
      colorClass: 'text-amber-600',
      barColor: 'bg-amber-500',
    };
  }
  return {
    percent,
    colorClass: 'text-emerald-600',
    barColor: 'bg-emerald-500',
  };
}
