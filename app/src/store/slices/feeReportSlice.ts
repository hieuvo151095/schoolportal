/**
 * Redux Toolkit Slice for Fee Collection Reports & Analytics
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/bao-cao-hoc-phi.md
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { InvoiceRecord } from '../../types/invoice.ts';
import type { FeeReportFilterCriteria, FeeReportTab } from '../../types/feeReport.ts';
import { defaultFeeReportFilter, mockFeeReportInvoices } from '../../services/mockFeeReportData.ts';

export interface FeeReportState {
  invoices: InvoiceRecord[];
  activeTab: FeeReportTab;
  filters: FeeReportFilterCriteria;
  selectedInvoiceForHistory: InvoiceRecord | null;
  isHistoryModalOpen: boolean;
}

const initialState: FeeReportState = {
  invoices: mockFeeReportInvoices,
  activeTab: 'overview',
  filters: { ...defaultFeeReportFilter },
  selectedInvoiceForHistory: null,
  isHistoryModalOpen: false,
};

export const feeReportSlice = createSlice({
  name: 'feeReport',
  initialState,
  reducers: {
    // BR01: Switching tabs always resets the date filter to default current month
    setActiveTab: (state, action: PayloadAction<FeeReportTab>) => {
      state.activeTab = action.payload;
      state.filters.tab = action.payload;
      state.filters.dateFrom = '2026-09-01';
      state.filters.dateTo = '2026-09-30';
      state.filters.studentSearch = '';
    },
    setDateRange: (state, action: PayloadAction<{ dateFrom: string; dateTo: string }>) => {
      state.filters.dateFrom = action.payload.dateFrom;
      state.filters.dateTo = action.payload.dateTo;
    },
    setClassFilter: (state, action: PayloadAction<string>) => {
      state.filters.classId = action.payload;
    },
    setStudentSearch: (state, action: PayloadAction<string>) => {
      state.filters.studentSearch = action.payload;
    },
    setPaymentMethodFilter: (state, action: PayloadAction<string>) => {
      state.filters.paymentMethod = action.payload;
    },
    setUnpaidStatusFilter: (state, action: PayloadAction<'all' | 'da_tao' | 'da_gui'>) => {
      state.filters.unpaidStatus = action.payload;
    },
    toggleOverdueOnly: (state) => {
      state.filters.isOverdueOnly = !state.filters.isOverdueOnly;
    },
    setOverdueOnly: (state, action: PayloadAction<boolean>) => {
      state.filters.isOverdueOnly = action.payload;
    },
    // BR06: Open payment history modal
    openPaymentHistoryModal: (state, action: PayloadAction<InvoiceRecord>) => {
      state.selectedInvoiceForHistory = action.payload;
      state.isHistoryModalOpen = true;
    },
    closePaymentHistoryModal: (state) => {
      state.selectedInvoiceForHistory = null;
      state.isHistoryModalOpen = false;
    },
    resetFilters: (state) => {
      state.filters = {
        ...defaultFeeReportFilter,
        tab: state.activeTab,
      };
    },
  },
});

export const {
  setActiveTab,
  setDateRange,
  setClassFilter,
  setStudentSearch,
  setPaymentMethodFilter,
  setUnpaidStatusFilter,
  toggleOverdueOnly,
  setOverdueOnly,
  openPaymentHistoryModal,
  closePaymentHistoryModal,
  resetFilters,
} = feeReportSlice.actions;

export default feeReportSlice.reducer;
