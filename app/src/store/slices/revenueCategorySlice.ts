import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RevenueCategory, RevenueCategoryState, RevenueCategoryFilter } from '../../types/revenueCategory.ts';
import { mockRevenueCategories } from '../../mock/mockRevenueCategories.ts';

const initialState: RevenueCategoryState = {
  list: mockRevenueCategories,
  dropdownList: mockRevenueCategories.filter((item) => item.active),
  pagination: {
    total: mockRevenueCategories.length,
    count: mockRevenueCategories.length,
    perPage: 20,
    currentPage: 1,
    lastPage: Math.ceil(mockRevenueCategories.length / 20) || 1,
  },
  filter: {
    search: '',
    status: '',
    page: 1,
    limit: 20,
  },
  loading: false,
  loadingDropdown: false,
  syncing: false,
  updatingSetting: false,
  error: null,
};

export const revenueCategorySlice = createSlice({
  name: 'revenueCategory',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<RevenueCategoryFilter>>) => {
      state.filter = { ...state.filter, ...action.payload };
      state.filter.page = action.payload.page ?? 1;
      state.pagination.currentPage = state.filter.page;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filter.page = action.payload;
      state.pagination.currentPage = action.payload;
    },
    syncStart: (state) => {
      state.syncing = true;
      state.error = null;
    },
    syncSuccess: (state, action: PayloadAction<RevenueCategory[]>) => {
      state.syncing = false;
      state.list = action.payload;
      state.dropdownList = action.payload.filter((item) => item.active);
      state.pagination.total = action.payload.length;
      state.pagination.count = action.payload.length;
      state.pagination.lastPage = Math.ceil(action.payload.length / state.pagination.perPage) || 1;
    },
    syncFailure: (state, action: PayloadAction<string>) => {
      state.syncing = false;
      state.error = action.payload;
    },
    toggleCategoryStatus: (state, action: PayloadAction<{ id: number; active: boolean }>) => {
      const item = state.list.find((cat) => cat.id === action.payload.id);
      if (item) {
        item.active = action.payload.active;
        item.usable = action.payload.active;
        state.dropdownList = state.list.filter((cat) => cat.active);
      }
    },
  },
});

export const {
  setFilter,
  setPage,
  syncStart,
  syncSuccess,
  syncFailure,
  toggleCategoryStatus,
} = revenueCategorySlice.actions;

export default revenueCategorySlice.reducer;
