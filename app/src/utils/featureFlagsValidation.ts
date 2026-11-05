/**
 * Pure validation engine and business rules for Settings Feature Flags & Academic Terms
 * Feature: 049-settings-feature-flags-tinh-nang
 * Legacy: docs_legacy/operating-portal/M6-cau-hinh/SM5-tinh-nang.md
 */

import type {
  ActivityFeatureSettings,
  AcademicTerm,
  InlineTermDraft,
  TermValidationResult,
} from '../types/featureFlags.ts';

/**
 * BR03 & K091: Dirty-State Submit Invariant
 * The "Cập nhật" button on Tab Hoạt Động is enabled IF AND ONLY IF at least one toggle
 * diverges from the saved state.
 */
export function isActivitySettingsDirty(
  active: ActivityFeatureSettings,
  saved: ActivityFeatureSettings
): boolean {
  if (!active || !saved) return false;
  return (
    active.allowComments !== saved.allowComments ||
    active.requireCommentModeration !== saved.requireCommentModeration
  );
}

/**
 * BR05 & K092: Statutory Two-Term Ceiling
 * Each academic year supports a maximum of 2 terms (Học kì 1, Học kì 2).
 * "+ Thêm học kỳ" button is disabled if the active academic year already has 2 terms.
 */
export function canAddTerm(terms: AcademicTerm[]): boolean {
  if (!Array.isArray(terms)) return true;
  return terms.length < 2;
}

/**
 * BR07, BR08 & K093: Single-Row Mutual Exclusion Lock
 * While any row is in edit or addition mode (editingTermId !== null),
 * all other row edit buttons and the "+ Thêm học kỳ" button are locked.
 */
export function isTermEditingLocked(
  currentTermId: string,
  editingTermId: string | null
): boolean {
  if (!editingTermId) return false;
  return editingTermId !== currentTermId;
}

/**
 * BR05, BR08: Check if adding new term button should be locked
 */
export function isAddTermLocked(
  editingTermId: string | null,
  termsCount: number
): boolean {
  return termsCount >= 2 || editingTermId !== null;
}

/**
 * Normalizes date string to YYYY-MM-DD format for HTML date inputs
 */
export function normalizeDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  // If DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('/');
    return `${year}-${month}-${day}`;
  }
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  return trimmed;
}

/**
 * Formats date string to DD/MM/YYYY display format
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-');
    return `${day}/${month}/${year}`;
  }
  // If already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    return trimmed;
  }
  return trimmed;
}

/**
 * Validates inline term draft values before save
 */
export function validateTermDraft(draft: InlineTermDraft): TermValidationResult {
  const errors: TermValidationResult['errors'] = {};

  if (!draft.termName || !draft.termName.trim()) {
    errors.termName = 'Học kỳ không được để trống';
  }

  if (!draft.startDate || !draft.startDate.trim()) {
    errors.startDate = 'Ngày bắt đầu không được để trống';
  }

  if (!draft.endDate || !draft.endDate.trim()) {
    errors.endDate = 'Ngày kết thúc không được để trống';
  }

  if (draft.startDate && draft.endDate) {
    const startNorm = normalizeDateForInput(draft.startDate);
    const endNorm = normalizeDateForInput(draft.endDate);

    if (startNorm && endNorm && startNorm > endNorm) {
      errors.dateRange = 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
