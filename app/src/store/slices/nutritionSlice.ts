import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  StudentCareRecord,
  NutritionSummary,
  BulkCarePayload,
} from '../../types/nutrition.ts';
import type { StudentAttendance } from '../../types/attendance.ts';
import {
  INITIAL_NUTRITION_RECORDS,
  getCareRecordsForDateAndClass,
} from '../../services/mockNutritionData.ts';
import {
  calculateNutritionSummary,
  applyBulkCareToRecords,
} from '../../utils/nutritionValidation.ts';

export interface NutritionState {
  records: StudentCareRecord[];
  selectedDate: string;
  selectedClassId: string;
  searchQuery: string;
  statusFilter: 'all' | 'evaluated' | 'pending';
  mealFilter: 'all' | 'an_het_suat' | 'can_ho_tro' | 'bo_bua';
  selectedStudentIds: string[];
  summary: NutritionSummary;
  isSlideOverOpen: boolean;
  activeStudentId: string | null;
  isBulkMode: boolean;
  recordsCache: Record<string, StudentCareRecord[]>;
}

const defaultDate = '2026-11-17';
const defaultClassId = 'lop-1a1';
const initialRecords = getCareRecordsForDateAndClass(defaultDate, defaultClassId);

const initialState: NutritionState = {
  records: initialRecords,
  selectedDate: defaultDate,
  selectedClassId: defaultClassId,
  searchQuery: '',
  statusFilter: 'all',
  mealFilter: 'all',
  selectedStudentIds: [],
  summary: calculateNutritionSummary(initialRecords),
  isSlideOverOpen: false,
  activeStudentId: null,
  isBulkMode: false,
  recordsCache: {
    [`${defaultClassId}_${defaultDate}`]: initialRecords,
  },
};

export const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      const newDate = action.payload;
      state.selectedDate = newDate;
      const key = `${state.selectedClassId}_${newDate}`;
      if (state.recordsCache && state.recordsCache[key]) {
        state.records = state.recordsCache[key];
      } else {
        const loaded = getCareRecordsForDateAndClass(newDate, state.selectedClassId);
        state.records = loaded;
        if (!state.recordsCache) state.recordsCache = {};
        state.recordsCache[key] = loaded;
      }
      state.summary = calculateNutritionSummary(state.records);
      state.selectedStudentIds = [];
    },

    setSelectedClassId: (state, action: PayloadAction<string>) => {
      const newClassId = action.payload;
      state.selectedClassId = newClassId;
      const key = `${newClassId}_${state.selectedDate}`;
      if (state.recordsCache && state.recordsCache[key]) {
        state.records = state.recordsCache[key];
      } else {
        const loaded = getCareRecordsForDateAndClass(state.selectedDate, newClassId);
        state.records = loaded;
        if (!state.recordsCache) state.recordsCache = {};
        state.recordsCache[key] = loaded;
      }
      state.summary = calculateNutritionSummary(state.records);
      state.selectedStudentIds = [];
    },

    syncWithAttendance: (
      state,
      action: PayloadAction<{ attendanceList: StudentAttendance[]; date?: string; classId?: string }>
    ) => {
      const { attendanceList, date, classId } = action.payload;
      const targetDate = date || state.selectedDate;
      const targetClassId = classId || state.selectedClassId;
      const loaded = getCareRecordsForDateAndClass(targetDate, targetClassId, attendanceList);
      state.records = loaded;
      state.summary = calculateNutritionSummary(loaded);
      state.selectedStudentIds = [];
      const key = `${targetClassId}_${targetDate}`;
      if (!state.recordsCache) state.recordsCache = {};
      state.recordsCache[key] = loaded;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<'all' | 'evaluated' | 'pending'>) => {
      state.statusFilter = action.payload;
    },

    setMealFilter: (state, action: PayloadAction<'all' | 'an_het_suat' | 'can_ho_tro' | 'bo_bua'>) => {
      state.mealFilter = action.payload;
    },

    toggleSelectStudent: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedStudentIds.includes(id)) {
        state.selectedStudentIds = state.selectedStudentIds.filter((item) => item !== id);
      } else {
        state.selectedStudentIds.push(id);
      }
    },

    toggleSelectAll: (state, action: PayloadAction<string[]>) => {
      const visibleIds = action.payload;
      const allSelected = visibleIds.length > 0 && visibleIds.every((id) => state.selectedStudentIds.includes(id));
      if (allSelected) {
        state.selectedStudentIds = state.selectedStudentIds.filter((id) => !visibleIds.includes(id));
      } else {
        const set = new Set([...state.selectedStudentIds, ...visibleIds]);
        state.selectedStudentIds = Array.from(set);
      }
    },

    clearSelection: (state) => {
      state.selectedStudentIds = [];
    },

    openSingleStudentCare: (state, action: PayloadAction<string>) => {
      state.activeStudentId = action.payload;
      state.isBulkMode = false;
      state.isSlideOverOpen = true;
    },

    openBulkCare: (state) => {
      if (state.selectedStudentIds.length === 0) return;
      state.isBulkMode = true;
      state.activeStudentId = null;
      state.isSlideOverOpen = true;
    },

    closeSlideOver: (state) => {
      state.isSlideOverOpen = false;
      state.activeStudentId = null;
      state.isBulkMode = false;
    },

    saveStudentCareRecord: (state, action: PayloadAction<StudentCareRecord>) => {
      const updated = action.payload;
      state.records = state.records.map((r) => (r.studentId === updated.studentId ? updated : r));
      const key = `${state.selectedClassId}_${state.selectedDate}`;
      if (!state.recordsCache) state.recordsCache = {};
      state.recordsCache[key] = state.records;
      state.summary = calculateNutritionSummary(state.records);
      state.isSlideOverOpen = false;
      state.activeStudentId = null;
    },

    saveBulkCareRecord: (state, action: PayloadAction<BulkCarePayload>) => {
      const payload = action.payload;
      state.records = applyBulkCareToRecords(state.records, payload);
      const key = `${state.selectedClassId}_${state.selectedDate}`;
      if (!state.recordsCache) state.recordsCache = {};
      state.recordsCache[key] = state.records;
      state.summary = calculateNutritionSummary(state.records);
      state.isSlideOverOpen = false;
      state.isBulkMode = false;
    },

    resetStudentCare: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      state.records = state.records.map((r) => {
        if (r.studentId !== studentId) return r;
        return {
          ...r,
          isEvaluated: false,
          updatedAt: undefined,
          updatedBy: undefined,
        };
      });
      const key = `${state.selectedClassId}_${state.selectedDate}`;
      if (!state.recordsCache) state.recordsCache = {};
      state.recordsCache[key] = state.records;
      state.summary = calculateNutritionSummary(state.records);
    },
  },
});

export const {
  setSelectedDate,
  setSelectedClassId,
  syncWithAttendance,
  setSearchQuery,
  setStatusFilter,
  setMealFilter,
  toggleSelectStudent,
  toggleSelectAll,
  clearSelection,
  openSingleStudentCare,
  openBulkCare,
  closeSlideOver,
  saveStudentCareRecord,
  saveBulkCareRecord,
  resetStudentCare,
} = nutritionSlice.actions;

export default nutritionSlice.reducer;
