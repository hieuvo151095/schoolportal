/**
 * Business Rules & Calculation Engine for Academics Gradebook (Điểm & Đánh Giá)
 * Enforces BR01–BR10, MoET GPA weighting, and legacy defect mitigations.
 */

import type {
  ClassGradebookRecord,
  GradebookFilterCriteria,
  TermEvaluationStatus,
  TermSummaryRecord,
  RubricRating
} from '../types/gradebook.ts';

/**
 * BR03: Computes semester weighted GPA (TBHK) according to Vietnam Ministry of Education weighting.
 * Formula: TBHK = (Sum(TX) + 2 * GK + 3 * CK) / (Count(TX) + 5)
 * Returns rounded to 1 decimal place, or null if milestone exams (GK or CK) are not yet entered.
 */
export function calculateTBHK(
  txScores: (number | null)[],
  gkScore: number | null,
  ckScore: number | null
): number | null {
  // If either Midterm (GK) or Final (CK) exam is missing, semester TBHK cannot be finalized
  if (gkScore === null || ckScore === null) {
    return null;
  }

  // Validate range: 0.0 - 10.0
  if (gkScore < 0 || gkScore > 10 || ckScore < 0 || ckScore > 10) {
    return null;
  }

  const validTxScores = txScores.filter((s): s is number => s !== null && s >= 0 && s <= 10);
  const txSum = validTxScores.reduce((sum, score) => sum + score, 0);
  const txWeight = validTxScores.length;

  const totalScore = txSum + 2 * gkScore + 3 * ckScore;
  const totalWeight = txWeight + 5; // 2 for GK, 3 for CK

  const rawTBHK = totalScore / totalWeight;
  return Math.round(rawTBHK * 10) / 10;
}

/**
 * BR07: Computes bounded evaluation tally for early childhood developmental rubrics.
 * Fixes the legacy bug where evaluation count exceeded domain total (e.g. "6/5 Đã đánh giá").
 */
export function calculateEvaluationTally(
  ratings: Record<string, RubricRating | string> | undefined,
  totalExpected: number
): { count: number; total: number; label: string } {
  if (!ratings || typeof ratings !== 'object') {
    return { count: 0, total: totalExpected, label: `0/${totalExpected} Đã đánh giá` };
  }

  const validRatings = ['tot', 'dat', 'can_co_gang'];
  const evaluatedKeys = Object.keys(ratings).filter(k => validRatings.includes(ratings[k]));

  // Strict clamping: count can NEVER exceed totalExpected
  const clampedCount = Math.min(evaluatedKeys.length, totalExpected);

  return {
    count: clampedCount,
    total: totalExpected,
    label: `${clampedCount}/${totalExpected} Đã đánh giá`
  };
}

/**
 * BR07: Determines developmental rubric completion.
 * Follows legacy business rule where completion is granted when core competencies and primary
 * qualities are complete and specific competencies reach minimum threshold (>= 5/7).
 */
export function determineRubricCompletion(
  coreCount: number,
  specificCount: number,
  qualitiesCount: number
): boolean {
  // Core (3/3), Qualities (5/5), and Specific (>= 5/7)
  return coreCount >= 3 && qualitiesCount >= 5 && specificCount >= 5;
}

/**
 * BR02 & BR08: Determines publication action label and permission.
 * When status is 'da_cong_bo', the action switches to 'Cập nhật' to allow non-destructive edits.
 */
export function getTermActionInfo(status: TermEvaluationStatus): {
  buttonLabel: string;
  isPublished: boolean;
  statusText: string;
  badgeClass: string;
} {
  switch (status) {
    case 'da_cong_bo':
      return {
        buttonLabel: 'Cập nhật',
        isPublished: true,
        statusText: 'Đã công bố',
        badgeClass: 'badge-published'
      };
    case 'tien_hanh':
      return {
        buttonLabel: 'Công bố',
        isPublished: false,
        statusText: 'Tiến hành',
        badgeClass: 'badge-progress'
      };
    case 'chua_thuc_hien':
    default:
      return {
        buttonLabel: 'Bắt đầu',
        isPublished: false,
        statusText: 'Chưa thực hiện',
        badgeClass: 'badge-not-started'
      };
  }
}

/**
 * BR04: Computes class completion rates for term summary evaluations.
 */
export function calculateClassSummaryRate(records: TermSummaryRecord[]): {
  total: number;
  completedCount: number;
  uncompletedCount: number;
  completedPercent: number;
} {
  if (!records || records.length === 0) {
    return { total: 0, completedCount: 0, uncompletedCount: 0, completedPercent: 0 };
  }

  const total = records.length;
  const completedCount = records.filter(
    r => r.academicResult === 'hoan_thanh_tot' || r.academicResult === 'hoan_thanh'
  ).length;

  const uncompletedCount = total - completedCount;
  const completedPercent = Math.round((completedCount / total) * 100);

  return {
    total,
    completedCount,
    uncompletedCount,
    completedPercent
  };
}

/**
 * BR09: Multi-criteria filtering for class gradebooks.
 */
export function filterGradebooks(
  classes: ClassGradebookRecord[],
  criteria: GradebookFilterCriteria
): ClassGradebookRecord[] {
  return classes.filter(cls => {
    // 1. Search Query (matching class name)
    if (criteria.searchQuery && criteria.searchQuery.trim()) {
      const q = criteria.searchQuery.toLowerCase().trim();
      const matchName = cls.className.toLowerCase().includes(q);
      const matchTeacher = cls.homeroomTeacher.toLowerCase().includes(q);
      if (!matchName && !matchTeacher) return false;
    }

    // 2. Grade Level Filter
    if (criteria.gradeLevel && criteria.gradeLevel !== 'Tất cả khối' && criteria.gradeLevel !== '') {
      if (cls.gradeLevel !== criteria.gradeLevel) return false;
    }

    // 3. Homeroom Teacher Filter
    if (criteria.homeroomTeacher && criteria.homeroomTeacher !== 'Tất cả giáo viên' && criteria.homeroomTeacher !== '') {
      if (!cls.homeroomTeacher.toLowerCase().includes(criteria.homeroomTeacher.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validates numeric score inputs within valid 0.0 - 10.0 bounds.
 */
export function validateScoreInput(scoreText: string): {
  isValid: boolean;
  score: number | null;
  error?: string;
} {
  const trimmed = scoreText.trim();
  if (trimmed === '' || trimmed === '—') {
    return { isValid: true, score: null };
  }

  const num = parseFloat(trimmed.replace(',', '.'));
  if (isNaN(num)) {
    return { isValid: false, score: null, error: 'Điểm phải là chữ số hợp lệ' };
  }

  if (num < 0 || num > 10) {
    return { isValid: false, score: null, error: 'Điểm phải từ 0.0 đến 10.0' };
  }

  // Round to 1 decimal place
  return { isValid: true, score: Math.round(num * 10) / 10 };
}
