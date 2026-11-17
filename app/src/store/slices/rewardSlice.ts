import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  StudentRewardRecord,
  RewardSummary,
  RewardStatusFilter,
} from '../../types/reward.ts';
import {
  REWARD_WEEKS_LIST,
  getRewardRecordsForClassAndWeek,
} from '../../services/mockRewardData.ts';
import { calculateRewardSummary } from '../../utils/rewardValidation.ts';

export interface RewardState {
  records: StudentRewardRecord[];
  selectedClassId: string;
  selectedWeekNumber: number;
  searchQuery: string;
  statusFilter: RewardStatusFilter;
  selectedStudentIds: string[];
  summary: RewardSummary;
  isDetailSlideOverOpen: boolean;
  activeStudentId: string | null;
  hasUnsavedChanges: boolean;
  recordsCache: Record<string, StudentRewardRecord[]>;
}

const defaultClassId = 'lop-1a1';
const defaultWeekNumber = 29;
const initialRecords = getRewardRecordsForClassAndWeek(defaultClassId, defaultWeekNumber);

const initialState: RewardState = {
  records: initialRecords,
  selectedClassId: defaultClassId,
  selectedWeekNumber: defaultWeekNumber,
  searchQuery: '',
  statusFilter: 'all',
  selectedStudentIds: [],
  summary: calculateRewardSummary(initialRecords),
  isDetailSlideOverOpen: false,
  activeStudentId: null,
  hasUnsavedChanges: false,
  recordsCache: {
    [`${defaultClassId}_${defaultWeekNumber}`]: initialRecords,
  },
};

export const rewardSlice = createSlice({
  name: 'reward',
  initialState,
  reducers: {
    setSelectedClassId: (state, action: PayloadAction<string>) => {
      const newClassId = action.payload;
      state.selectedClassId = newClassId;
      const key = `${newClassId}_${state.selectedWeekNumber}`;
      if (state.recordsCache && state.recordsCache[key]) {
        state.records = state.recordsCache[key];
      } else {
        const loaded = getRewardRecordsForClassAndWeek(newClassId, state.selectedWeekNumber);
        state.records = loaded;
        if (!state.recordsCache) state.recordsCache = {};
        state.recordsCache[key] = loaded;
      }
      state.summary = calculateRewardSummary(state.records);
      state.selectedStudentIds = [];
      state.hasUnsavedChanges = false;
    },

    setSelectedWeekNumber: (state, action: PayloadAction<number>) => {
      const newWeek = action.payload;
      state.selectedWeekNumber = newWeek;
      const key = `${state.selectedClassId}_${newWeek}`;
      if (state.recordsCache && state.recordsCache[key]) {
        state.records = state.recordsCache[key];
      } else {
        const loaded = getRewardRecordsForClassAndWeek(state.selectedClassId, newWeek);
        state.records = loaded;
        if (!state.recordsCache) state.recordsCache = {};
        state.recordsCache[key] = loaded;
      }
      state.summary = calculateRewardSummary(state.records);
      state.selectedStudentIds = [];
      state.hasUnsavedChanges = false;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<RewardStatusFilter>) => {
      state.statusFilter = action.payload;
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

    toggleAwardStudent: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      state.records = state.records.map((r) => {
        if (r.studentId !== studentId) return r;
        const nextAwarded = !r.isAwarded;
        // Update monthHistory current week item
        const updatedMonthHistory = r.monthHistory.map((m) =>
          m.week === r.monthWeek ? { ...m, isAwarded: nextAwarded } : m
        );
        return {
          ...r,
          isAwarded: nextAwarded,
          updatedAt: new Date().toISOString(),
          monthHistory: updatedMonthHistory,
        };
      });
      state.hasUnsavedChanges = true;
      state.summary = calculateRewardSummary(state.records);
    },

    updateTeacherComment: (
      state,
      action: PayloadAction<{ studentId: string; comment: string }>
    ) => {
      const { studentId, comment } = action.payload;
      state.records = state.records.map((r) => {
        if (r.studentId !== studentId) return r;
        const updatedMonthHistory = r.monthHistory.map((m) =>
          m.week === r.monthWeek ? { ...m, teacherComment: comment } : m
        );
        return {
          ...r,
          teacherComment: comment,
          updatedAt: new Date().toISOString(),
          monthHistory: updatedMonthHistory,
        };
      });
      state.hasUnsavedChanges = true;
    },

    bulkAwardSelected: (state, action: PayloadAction<string[] | undefined>) => {
      const targetIds = action.payload || state.selectedStudentIds;
      if (targetIds.length === 0) return;
      const idSet = new Set(targetIds);
      state.records = state.records.map((r) => {
        if (!idSet.has(r.studentId)) return r;
        const updatedMonthHistory = r.monthHistory.map((m) =>
          m.week === r.monthWeek ? { ...m, isAwarded: true } : m
        );
        return {
          ...r,
          isAwarded: true,
          updatedAt: new Date().toISOString(),
          monthHistory: updatedMonthHistory,
        };
      });
      state.hasUnsavedChanges = true;
      state.summary = calculateRewardSummary(state.records);
    },

    bulkUnawardSelected: (state, action: PayloadAction<string[] | undefined>) => {
      const targetIds = action.payload || state.selectedStudentIds;
      if (targetIds.length === 0) return;
      const idSet = new Set(targetIds);
      state.records = state.records.map((r) => {
        if (!idSet.has(r.studentId)) return r;
        const updatedMonthHistory = r.monthHistory.map((m) =>
          m.week === r.monthWeek ? { ...m, isAwarded: false } : m
        );
        return {
          ...r,
          isAwarded: false,
          updatedAt: new Date().toISOString(),
          monthHistory: updatedMonthHistory,
        };
      });
      state.hasUnsavedChanges = true;
      state.summary = calculateRewardSummary(state.records);
    },

    saveRewardChanges: (state) => {
      const key = `${state.selectedClassId}_${state.selectedWeekNumber}`;
      if (!state.recordsCache) state.recordsCache = {};
      state.recordsCache[key] = state.records;
      state.hasUnsavedChanges = false;
    },

    publishWeeklyRewards: (state) => {
      const nowStr = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) + ' ' + new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      state.records = state.records.map((r) => {
        if (!r.isAwarded) return r;
        const updatedMonthHistory = r.monthHistory.map((m) =>
          m.week === r.monthWeek ? { ...m, publishedAt: nowStr } : m
        );
        return {
          ...r,
          isPublished: true,
          publishedAt: nowStr,
          monthHistory: updatedMonthHistory,
        };
      });

      const key = `${state.selectedClassId}_${state.selectedWeekNumber}`;
      if (!state.recordsCache) state.recordsCache = {};
      state.recordsCache[key] = state.records;
      state.hasUnsavedChanges = false;
      state.summary = calculateRewardSummary(state.records);
    },

    openDetailSlideOver: (state, action: PayloadAction<string>) => {
      state.activeStudentId = action.payload;
      state.isDetailSlideOverOpen = true;
    },

    closeDetailSlideOver: (state) => {
      state.isDetailSlideOverOpen = false;
      state.activeStudentId = null;
    },
  },
});

export const {
  setSelectedClassId,
  setSelectedWeekNumber,
  setSearchQuery,
  setStatusFilter,
  toggleSelectStudent,
  toggleSelectAll,
  clearSelection,
  toggleAwardStudent,
  updateTeacherComment,
  bulkAwardSelected,
  bulkUnawardSelected,
  saveRewardChanges,
  publishWeeklyRewards,
  openDetailSlideOver,
  closeDetailSlideOver,
} = rewardSlice.actions;

export default rewardSlice.reducer;
