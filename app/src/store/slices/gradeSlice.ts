import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  EducationStage,
  GradeLevel,
  GradeClassItem,
  GradeFilterState,
} from '../../types/grade.ts';
import {
  STATUTORY_GRADE_LEVELS,
  MOCK_GRADE_CLASSES,
} from '../../services/mockGradeData.ts';

export interface GradeState {
  grades: GradeLevel[];
  classes: Record<string, GradeClassItem[]>;
  selectedStage: 'ALL' | EducationStage;
  selectedAcademicYear: string;
  searchQuery: string;
  activeGradeId: string | null;
}

const initialState: GradeState = {
  grades: STATUTORY_GRADE_LEVELS,
  classes: MOCK_GRADE_CLASSES,
  selectedStage: 'ALL',
  selectedAcademicYear: '2026-2027',
  searchQuery: '',
  activeGradeId: null,
};

export const gradeSlice = createSlice({
  name: 'grade',
  initialState,
  reducers: {
    setSelectedStage: (
      state,
      action: PayloadAction<'ALL' | EducationStage>
    ) => {
      state.selectedStage = action.payload;
    },
    setSelectedAcademicYear: (state, action: PayloadAction<string>) => {
      state.selectedAcademicYear = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    setActiveGradeId: (state, action: PayloadAction<string | null>) => {
      state.activeGradeId = action.payload;
    },
    updateGradeClass: (state, action: PayloadAction<GradeClassItem>) => {
      const updated = action.payload;
      const gradeClasses = state.classes[updated.gradeLevelId];
      if (gradeClasses) {
        const index = gradeClasses.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          gradeClasses[index] = updated;
        } else {
          gradeClasses.push(updated);
        }
      } else {
        state.classes[updated.gradeLevelId] = [updated];
      }
    },
    resetFilters: (state) => {
      state.selectedStage = 'ALL';
      state.searchQuery = '';
      state.selectedAcademicYear = '2026-2027';
    },
  },
});

export const {
  setSelectedStage,
  setSelectedAcademicYear,
  setSearchQuery,
  clearSearchQuery,
  setActiveGradeId,
  updateGradeClass,
  resetFilters,
} = gradeSlice.actions;

export default gradeSlice.reducer;
