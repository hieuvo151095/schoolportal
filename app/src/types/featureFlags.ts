/**
 * Domain types for Settings Feature Flags & Academic Terms (Cấu hình - Tính năng)
 * Feature: 049-settings-feature-flags-tinh-nang
 * Legacy: docs_legacy/operating-portal/M6-cau-hinh/SM5-tinh-nang.md
 */

export interface ActivityFeatureSettings {
  allowComments: boolean;
  requireCommentModeration: boolean;
  updatedAt?: string;
}

export interface AcademicTerm {
  id: string;
  academicYearId: string;
  termName: string;
  startDate: string; // YYYY-MM-DD or DD/MM/YYYY
  endDate: string;   // YYYY-MM-DD or DD/MM/YYYY
  notes?: string;
  isDraft?: boolean;
}

export interface AcademicYearOption {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface InlineTermDraft {
  termName: string;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface InlineTermEditState {
  editingTermId: string | null; // ID of term being edited, 'new' for adding new row, null if none
  draftTerm: InlineTermDraft | null;
}

export interface FeatureFlagsState {
  activitySettings: ActivityFeatureSettings;
  savedActivitySettings: ActivityFeatureSettings;
  academicYears: AcademicYearOption[];
  selectedAcademicYearId: string;
  terms: AcademicTerm[];
  inlineEdit: InlineTermEditState;
  isLoading: boolean;
  error: string | null;
  toastMessage: string | null;
}

export interface UpdateActivitySettingsPayload {
  allowComments: boolean;
  requireCommentModeration: boolean;
}

export interface SaveTermPayload {
  academicYearId: string;
  termId?: string; // present when updating existing, undefined when creating new
  termName: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface TermValidationResult {
  isValid: boolean;
  errors: {
    termName?: string;
    startDate?: string;
    endDate?: string;
    dateRange?: string;
  };
}
