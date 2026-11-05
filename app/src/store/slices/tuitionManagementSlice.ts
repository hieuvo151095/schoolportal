/**
 * Redux Toolkit Slice for Finance Tuition Management (Quản Lý Học Phí)
 * Module: E-011-finance-tuition-management
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ClassFeeOverview,
  ClassAssignedFee,
  StudentFeeMatrixRow,
  BatchUpdateFeeInput,
  AddClassFeeInput,
} from "../../types/tuitionManagement.ts";
import {
  mockClassFeeOverviews,
  mock12A1AssignedFees,
  mock12A1Students,
  mockUnassignedCatalogFees,
} from "../../services/mockTuitionManagementData.ts";
import {
  hasPriceDivergence,
  computeActiveStudentsCount,
} from "../../utils/tuitionManagementValidation.ts";
import { transferStudents } from "./studentSlice.ts";

export interface TuitionManagementState {
  classOverviews: ClassFeeOverview[];
  activeClassId: string;
  assignedFees: ClassAssignedFee[];
  matrixRows: StudentFeeMatrixRow[];
  savedMatrixRowsSnapshot: StudentFeeMatrixRow[];
  savedAssignedFeesSnapshot: ClassAssignedFee[];
  unassignedCatalogFees: typeof mockUnassignedCatalogFees;
  searchQuery: string;
  gradeLevelFilter: string;
  hasUnsavedChanges: boolean;
  isBatchModalOpen: boolean;
  batchFeeId: string | null;
  isAddFeeModalOpen: boolean;
  toastMessage: string | null;
}

const initialState: TuitionManagementState = {
  classOverviews: mockClassFeeOverviews,
  activeClassId: "12A1",
  assignedFees: mock12A1AssignedFees,
  matrixRows: mock12A1Students,
  savedMatrixRowsSnapshot: JSON.parse(JSON.stringify(mock12A1Students)),
  savedAssignedFeesSnapshot: JSON.parse(JSON.stringify(mock12A1AssignedFees)),
  unassignedCatalogFees: mockUnassignedCatalogFees,
  searchQuery: "",
  gradeLevelFilter: "all",
  hasUnsavedChanges: false,
  isBatchModalOpen: false,
  batchFeeId: null,
  isAddFeeModalOpen: false,
  toastMessage: null,
};

export const tuitionManagementSlice = createSlice({
  name: "tuitionManagement",
  initialState,
  reducers: {
    setActiveClass: (state, action: PayloadAction<string>) => {
      state.activeClassId = action.payload;
    },
    setFilterCriteria: (
      state,
      action: PayloadAction<{ searchQuery?: string; gradeLevelFilter?: string }>
    ) => {
      if (action.payload.searchQuery !== undefined) {
        state.searchQuery = action.payload.searchQuery;
      }
      if (action.payload.gradeLevelFilter !== undefined) {
        state.gradeLevelFilter = action.payload.gradeLevelFilter;
      }
    },
    updateStudentFeeAmount: (
      state,
      action: PayloadAction<{
        studentId: string;
        feeId: string;
        amount: number | null;
      }>
    ) => {
      const { studentId, feeId, amount } = action.payload;
      const student = state.matrixRows.find((s) => s.studentId === studentId);
      if (student && student.feeCells[feeId]) {
        const targetFee = state.assignedFees.find((f) => f.feeId === feeId);
        const defaultAmt = targetFee ? targetFee.defaultAmount : 0;
        student.feeCells[feeId].amount = amount;
        student.feeCells[feeId].hasOverride = hasPriceDivergence(amount, defaultAmt);
        state.hasUnsavedChanges = true;
      }
    },
    toggleStudentFeeOption: (
      state,
      action: PayloadAction<{
        studentId: string;
        feeId: string;
        isEnabled: boolean;
      }>
    ) => {
      const { studentId, feeId, isEnabled } = action.payload;
      const student = state.matrixRows.find((s) => s.studentId === studentId);
      if (student && student.feeCells[feeId]) {
        student.feeCells[feeId].isEnabled = isEnabled;
        const targetFee = state.assignedFees.find((f) => f.feeId === feeId);
        if (targetFee) {
          targetFee.activeStudentCount = computeActiveStudentsCount(
            state.matrixRows,
            feeId
          );
        }
        state.hasUnsavedChanges = true;
      }
    },
    batchUpdateClassFee: (state, action: PayloadAction<BatchUpdateFeeInput>) => {
      const { feeId, newAmount, applyToAll, selectedStudentIds } = action.payload;
      const targetFee = state.assignedFees.find((f) => f.feeId === feeId);
      const defaultAmt = targetFee ? targetFee.defaultAmount : newAmount;

      state.matrixRows.forEach((row) => {
        const shouldUpdate =
          applyToAll || (selectedStudentIds && selectedStudentIds.includes(row.studentId));

        if (shouldUpdate && row.feeCells[feeId]) {
          row.feeCells[feeId].amount = newAmount;
          row.feeCells[feeId].hasOverride = hasPriceDivergence(newAmount, defaultAmt);
        }
      });

      state.isBatchModalOpen = false;
      state.batchFeeId = null;
      state.hasUnsavedChanges = true;
      state.toastMessage = `Đã cập nhật số tiền mới cho khoản phí thành công!`;
    },
    addClassFeeToMatrix: (state, action: PayloadAction<AddClassFeeInput>) => {
      const {
        feeId,
        feeName,
        unit,
        defaultAmount,
        exportElectronicInvoice,
        applyToAll,
        selectedStudentIds,
      } = action.payload;

      // Add to assignedFees
      const newAssignedFee: ClassAssignedFee = {
        feeId,
        feeName,
        unit,
        defaultAmount,
        isMandatory: false,
        activeStudentCount: applyToAll
          ? state.matrixRows.length
          : selectedStudentIds.length,
        exportElectronicInvoice,
      };
      state.assignedFees.push(newAssignedFee);

      // Add cell to each student
      state.matrixRows.forEach((student) => {
        const isEnabled =
          applyToAll || selectedStudentIds.includes(student.studentId);
        student.feeCells[feeId] = {
          feeId,
          isEnabled,
          amount: defaultAmount,
          hasOverride: false,
        };
      });

      // Deduplicate unassigned catalog list
      state.unassignedCatalogFees = state.unassignedCatalogFees.filter(
        (f) => f.id !== feeId
      );

      state.isAddFeeModalOpen = false;
      state.hasUnsavedChanges = true;
      state.toastMessage = `Đã thêm khoản phí "${feeName}" vào lớp thành công!`;
    },
    removeClassFee: (state, action: PayloadAction<string>) => {
      const feeId = action.payload;
      const feeToRemove = state.assignedFees.find((f) => f.feeId === feeId);
      if (feeToRemove && !feeToRemove.isMandatory) {
        state.assignedFees = state.assignedFees.filter((f) => f.feeId !== feeId);
        state.matrixRows.forEach((row) => {
          delete row.feeCells[feeId];
        });
        state.unassignedCatalogFees.push({
          id: feeId,
          name: feeToRemove.feeName,
          unit: feeToRemove.unit,
          defaultAmount: feeToRemove.defaultAmount,
          exportElectronicInvoice: feeToRemove.exportElectronicInvoice,
        });
        state.hasUnsavedChanges = true;
        state.toastMessage = `Đã xóa khoản phí khỏi lớp học!`;
      }
    },
    openBatchModal: (state, action: PayloadAction<string>) => {
      state.batchFeeId = action.payload;
      state.isBatchModalOpen = true;
    },
    closeBatchModal: (state) => {
      state.isBatchModalOpen = false;
      state.batchFeeId = null;
    },
    openAddFeeModal: (state) => {
      state.isAddFeeModalOpen = true;
    },
    closeAddFeeModal: (state) => {
      state.isAddFeeModalOpen = false;
    },
    saveChanges: (state) => {
      state.savedMatrixRowsSnapshot = JSON.parse(JSON.stringify(state.matrixRows));
      state.savedAssignedFeesSnapshot = JSON.parse(JSON.stringify(state.assignedFees));
      state.hasUnsavedChanges = false;
      state.toastMessage = "Đã lưu tất cả thay đổi học phí thành công!";
    },
    discardChanges: (state) => {
      state.matrixRows = JSON.parse(JSON.stringify(state.savedMatrixRowsSnapshot));
      state.assignedFees = JSON.parse(JSON.stringify(state.savedAssignedFeesSnapshot));
      state.hasUnsavedChanges = false;
      state.toastMessage = "Đã hủy bỏ tất cả thay đổi chưa lưu!";
    },
    clearToast: (state) => {
      state.toastMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(transferStudents, (state, action) => {
      const { studentIds, sourceClassId, targetClassId, remapFees } = action.payload;
      if (!remapFees) return;

      // If active class is source class, remove transferred students
      if (state.activeClassId === sourceClassId) {
        state.matrixRows = state.matrixRows.filter(
          (row) => !studentIds.includes(row.studentId)
        );
      }
    });
  },
});

export const {
  setActiveClass,
  setFilterCriteria,
  updateStudentFeeAmount,
  toggleStudentFeeOption,
  batchUpdateClassFee,
  addClassFeeToMatrix,
  removeClassFee,
  openBatchModal,
  closeBatchModal,
  openAddFeeModal,
  closeAddFeeModal,
  saveChanges,
  discardChanges,
  clearToast,
} = tuitionManagementSlice.actions;

export default tuitionManagementSlice.reducer;
