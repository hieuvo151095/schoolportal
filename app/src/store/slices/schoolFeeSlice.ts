/**
 * Redux Toolkit slice for Fee Catalog (Khoản Phí) sub-module
 * Operating Portal - Finviet / SOHA
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  FeeItem,
  FeeFilterCriteria,
  CreateFeeFormData,
  EditFeeFormData,
  StudentFeeAssignment,
} from '../../types/schoolFee.ts';
import {
  INITIAL_SCHOOL_FEES,
  INITIAL_STUDENT_FEE_ASSIGNMENTS,
} from '../../services/mockSchoolFeeData.ts';

export interface SchoolFeeState {
  items: FeeItem[];
  assignments: StudentFeeAssignment[];
  filterCriteria: FeeFilterCriteria;
  isCreateModalOpen: boolean;
  editingFee: FeeItem | null;
  viewingAssignmentFee: FeeItem | null;
  deletingFee: FeeItem | null;
}

const initialState: SchoolFeeState = {
  items: INITIAL_SCHOOL_FEES,
  assignments: INITIAL_STUDENT_FEE_ASSIGNMENTS,
  filterCriteria: {
    search: '',
    exportElectronicInvoiceFilter: 'all',
    unitFilter: 'all',
    sortUnit: 'none',
  },
  isCreateModalOpen: false,
  editingFee: null,
  viewingAssignmentFee: null,
  deletingFee: null,
};

export const schoolFeeSlice = createSlice({
  name: 'schoolFee',
  initialState,
  reducers: {
    setFilterCriteria: (
      state,
      action: PayloadAction<Partial<FeeFilterCriteria>>
    ) => {
      state.filterCriteria = {
        ...state.filterCriteria,
        ...action.payload,
      };
    },

    // BR03: Inline toggle for electronic invoice directly from list row
    toggleExportElectronicInvoiceInline: (
      state,
      action: PayloadAction<{ feeId: string; exportInvoice?: boolean }>
    ) => {
      const { feeId, exportInvoice } = action.payload;
      const target = state.items.find((item) => item.id === feeId);
      if (target) {
        if (exportInvoice !== undefined) {
          target.exportElectronicInvoice = exportInvoice;
        } else {
          target.exportElectronicInvoice = !target.exportElectronicInvoice;
        }
        target.updatedAt = new Date().toISOString();
      }
    },

    // BR09: Create custom fee item
    createFeeItem: (state, action: PayloadAction<CreateFeeFormData>) => {
      const data = action.payload;
      const id = `fee-cust-${Date.now()}`;
      const code = data.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_');

      const newItem: FeeItem = {
        id,
        code,
        name: data.name.trim(),
        type: 'custom',
        defaultAmount: data.defaultAmount,
        unit: data.unit,
        exportElectronicInvoice: data.exportElectronicInvoice ?? false,
        revenue_category_id: data.revenue_category_id ?? null,
        description: data.description?.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.items.push(newItem);
      state.isCreateModalOpen = false;
    },

    // BR04: Update custom fee item (Name, Amount, Unit only; no HĐĐT)
    updateFeeItem: (
      state,
      action: PayloadAction<{ id: string; data: EditFeeFormData }>
    ) => {
      const { id, data } = action.payload;
      const target = state.items.find(
        (item) => item.id === id && item.type === 'custom'
      );
      if (target) {
        target.name = data.name.trim();
        target.defaultAmount = data.defaultAmount;
        target.unit = data.unit;
        if (data.revenue_category_id !== undefined) {
          target.revenue_category_id = data.revenue_category_id;
        }
        if (data.exportElectronicInvoice !== undefined) {
          target.exportElectronicInvoice = data.exportElectronicInvoice;
        }
        if (data.description !== undefined) {
          target.description = data.description.trim();
        }
        target.updatedAt = new Date().toISOString();
      }
      state.editingFee = null;
    },

    // Delete custom fee item
    deleteFeeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      // Guard: do not delete system fee
      const target = state.items.find((item) => item.id === id);
      if (target && target.type === 'custom') {
        state.items = state.items.filter((item) => item.id !== id);
        // Also clean up any mock assignments
        state.assignments = state.assignments.filter(
          (assign) => assign.feeId !== id
        );
      }
      state.deletingFee = null;
    },

    // Modal controls
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },

    openEditModal: (state, action: PayloadAction<FeeItem>) => {
      if (action.payload.type === 'custom') {
        state.editingFee = action.payload;
      }
    },
    closeEditModal: (state) => {
      state.editingFee = null;
    },

    openAssignmentModal: (state, action: PayloadAction<FeeItem>) => {
      state.viewingAssignmentFee = action.payload;
    },
    closeAssignmentModal: (state) => {
      state.viewingAssignmentFee = null;
    },

    openDeleteModal: (state, action: PayloadAction<FeeItem>) => {
      if (action.payload.type === 'custom') {
        state.deletingFee = action.payload;
      }
    },
    closeDeleteModal: (state) => {
      state.deletingFee = null;
    },
  },
});

export const {
  setFilterCriteria,
  toggleExportElectronicInvoiceInline,
  createFeeItem,
  updateFeeItem,
  deleteFeeItem,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openAssignmentModal,
  closeAssignmentModal,
  openDeleteModal,
  closeDeleteModal,
} = schoolFeeSlice.actions;

export default schoolFeeSlice.reducer;
