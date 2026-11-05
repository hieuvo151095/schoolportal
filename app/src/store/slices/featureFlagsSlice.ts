/**
 * Redux state machine for Settings Feature Flags & Academic Terms
 * Feature: 049-settings-feature-flags-tinh-nang
 * Legacy: docs_legacy/operating-portal/M6-cau-hinh/SM5-tinh-nang.md
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  FeatureFlagsState,
  InlineTermDraft,
  AcademicTerm,
} from '../../types/featureFlags.ts';
import {
  mockInitialActivitySettings,
  mockAcademicYears,
  mockInitialTerms,
} from '../../services/mockFeatureFlagsData.ts';

const initialYear =
  mockAcademicYears.find((y) => y.isCurrent)?.id || mockAcademicYears[0]?.id || '';

const initialState: FeatureFlagsState = {
  activitySettings: { ...mockInitialActivitySettings },
  savedActivitySettings: { ...mockInitialActivitySettings },
  academicYears: [...mockAcademicYears],
  selectedAcademicYearId: initialYear,
  terms: [...mockInitialTerms],
  inlineEdit: {
    editingTermId: null,
    draftTerm: null,
  },
  isLoading: false,
  error: null,
  toastMessage: null,
};

export const featureFlagsSlice = createSlice({
  name: 'featureFlags',
  initialState,
  reducers: {
    setActivityToggle: (
      state,
      action: PayloadAction<{
        key: 'allowComments' | 'requireCommentModeration';
        value: boolean;
      }>
    ) => {
      state.activitySettings[action.payload.key] = action.payload.value;
    },

    saveActivitySettings: (state) => {
      state.savedActivitySettings = {
        ...state.activitySettings,
        updatedAt: new Date().toISOString(),
      };
      state.toastMessage = 'Cập nhật cấu hình thành công';
    },

    selectAcademicYear: (state, action: PayloadAction<string>) => {
      state.selectedAcademicYearId = action.payload;
      // Cancel any ongoing inline edit when switching academic years
      state.inlineEdit.editingTermId = null;
      state.inlineEdit.draftTerm = null;
      state.error = null;
    },

    startEditTerm: (state, action: PayloadAction<string>) => {
      const term = state.terms.find((t) => t.id === action.payload);
      if (term) {
        state.inlineEdit.editingTermId = term.id;
        state.inlineEdit.draftTerm = {
          termName: term.termName,
          startDate: term.startDate,
          endDate: term.endDate,
          notes: term.notes || '',
        };
        state.error = null;
      }
    },

    startAddTerm: (state) => {
      const currentYearTerms = state.terms.filter(
        (t) => t.academicYearId === state.selectedAcademicYearId
      );
      if (currentYearTerms.length >= 2) {
        state.error = 'Mỗi năm học chỉ được phép khai báo tối đa 2 học kỳ';
        return;
      }
      state.inlineEdit.editingTermId = 'new';
      state.inlineEdit.draftTerm = {
        termName: currentYearTerms.length === 0 ? 'Học kì 1' : 'Học kì 2',
        startDate: '',
        endDate: '',
        notes: '',
      };
      state.error = null;
    },

    updateDraftTerm: (state, action: PayloadAction<Partial<InlineTermDraft>>) => {
      if (state.inlineEdit.draftTerm) {
        state.inlineEdit.draftTerm = {
          ...state.inlineEdit.draftTerm,
          ...action.payload,
        };
      }
    },

    cancelEditTerm: (state) => {
      state.inlineEdit.editingTermId = null;
      state.inlineEdit.draftTerm = null;
      state.error = null;
    },

    saveTerm: (state) => {
      const { editingTermId, draftTerm } = state.inlineEdit;
      if (!draftTerm) return;

      if (!draftTerm.termName.trim() || !draftTerm.startDate || !draftTerm.endDate) {
        state.error = 'Vui lòng nhập đầy đủ tên học kỳ, ngày bắt đầu và kết thúc';
        return;
      }

      if (editingTermId === 'new') {
        const newTerm: AcademicTerm = {
          id: `term-${Date.now()}`,
          academicYearId: state.selectedAcademicYearId,
          termName: draftTerm.termName.trim(),
          startDate: draftTerm.startDate,
          endDate: draftTerm.endDate,
          notes: draftTerm.notes ? draftTerm.notes.trim() : '',
        };
        state.terms.push(newTerm);
        state.toastMessage = 'Thêm học kỳ mới thành công';
      } else if (editingTermId) {
        const index = state.terms.findIndex((t) => t.id === editingTermId);
        if (index !== -1) {
          state.terms[index] = {
            ...state.terms[index],
            termName: draftTerm.termName.trim(),
            startDate: draftTerm.startDate,
            endDate: draftTerm.endDate,
            notes: draftTerm.notes ? draftTerm.notes.trim() : '',
          };
          state.toastMessage = 'Cập nhật học kỳ thành công';
        }
      }

      state.inlineEdit.editingTermId = null;
      state.inlineEdit.draftTerm = null;
      state.error = null;
    },

    clearToast: (state) => {
      state.toastMessage = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setActivityToggle,
  saveActivitySettings,
  selectAcademicYear,
  startEditTerm,
  startAddTerm,
  updateDraftTerm,
  cancelEditTerm,
  saveTerm,
  clearToast,
  clearError,
} = featureFlagsSlice.actions;

export default featureFlagsSlice.reducer;
