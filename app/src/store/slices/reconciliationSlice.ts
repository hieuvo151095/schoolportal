import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PaymentChannel, ReconciliationSession } from '../../types/reconciliation.ts';
import { INITIAL_RECONCILIATION_SESSIONS } from '../../services/mockReconciliationData.ts';

export interface ReconciliationState {
  sessions: ReconciliationSession[];
  startDate: string; // YYYY-MM-DD (BR05: free date-range, defaults to 12 days before today)
  endDate: string; // YYYY-MM-DD
  selectedSessionId: string | null;
  searchKeyword: string;
  selectedChannel: 'all' | PaymentChannel;
  expandedTransactionIds: string[]; // BR04: inline accordion row toggles
}

const initialState: ReconciliationState = {
  sessions: INITIAL_RECONCILIATION_SESSIONS,
  startDate: '2026-08-30',
  endDate: '2026-09-11',
  selectedSessionId: null,
  searchKeyword: '',
  selectedChannel: 'all',
  expandedTransactionIds: [],
};

export const reconciliationSlice = createSlice({
  name: 'reconciliation',
  initialState,
  reducers: {
    setDateRange: (
      state,
      action: PayloadAction<{ startDate: string; endDate: string }>
    ) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setSelectedSessionId: (state, action: PayloadAction<string | null>) => {
      state.selectedSessionId = action.payload;
      state.searchKeyword = '';
      state.selectedChannel = 'all';
      state.expandedTransactionIds = [];
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    setSelectedChannel: (state, action: PayloadAction<'all' | PaymentChannel>) => {
      state.selectedChannel = action.payload;
    },
    toggleExpandTransaction: (state, action: PayloadAction<string>) => {
      const txId = action.payload;
      if (state.expandedTransactionIds.includes(txId)) {
        state.expandedTransactionIds = state.expandedTransactionIds.filter(
          (id) => id !== txId
        );
      } else {
        state.expandedTransactionIds.push(txId);
      }
    },
    resetDetailFilters: (state) => {
      state.searchKeyword = '';
      state.selectedChannel = 'all';
    },
  },
});

export const {
  setDateRange,
  setSelectedSessionId,
  setSearchKeyword,
  setSelectedChannel,
  toggleExpandTransaction,
  resetDetailFilters,
} = reconciliationSlice.actions;

export default reconciliationSlice.reducer;
