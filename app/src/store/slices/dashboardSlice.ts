import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ClassMatrixStatus,
  DashboardFilterState,
  DashboardTimeRange,
} from '../../types/dashboard.ts';

const initialState: DashboardFilterState = {
  timeRange: 'month',
  gradeScope: 'all',
  searchQuery: '',
  statusFilter: 'all',
  lastRefreshedAt: '19/11/2026 15:00',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<DashboardTimeRange>) => {
      state.timeRange = action.payload;
    },
    setGradeScope: (state, action: PayloadAction<string>) => {
      state.gradeScope = action.payload;
    },
    setDashboardSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDashboardStatusFilter: (
      state,
      action: PayloadAction<'all' | ClassMatrixStatus>
    ) => {
      state.statusFilter = action.payload;
    },
    refreshDashboardData: (state, action: PayloadAction<string | undefined>) => {
      state.lastRefreshedAt = action.payload || 'Vừa xong';
    },
    resetDashboardFilters: (state) => {
      state.timeRange = 'month';
      state.gradeScope = 'all';
      state.searchQuery = '';
      state.statusFilter = 'all';
    },
  },
});

export const {
  setTimeRange,
  setGradeScope,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  refreshDashboardData,
  resetDashboardFilters,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
