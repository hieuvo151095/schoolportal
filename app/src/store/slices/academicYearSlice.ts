/**
 * Redux Toolkit Slice: School Academic Year (Năm Học)
 * Module: M5 - Nhà Trường / Năm Học
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AcademicYear, CreateAcademicYearPayload, UpdateAcademicYearPayload } from '../../types/academicYear.ts';
import { INITIAL_ACADEMIC_YEARS } from '../../services/mockAcademicYearData.ts';

export interface AcademicYearState {
  items: AcademicYear[];
  searchQuery: string;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit';
  editingItem: AcademicYear | null;
  toastMessage: string | null;
}

const initialState: AcademicYearState = {
  items: INITIAL_ACADEMIC_YEARS,
  searchQuery: '',
  isModalOpen: false,
  modalMode: 'create',
  editingItem: null,
  toastMessage: null,
};

export const academicYearSlice = createSlice({
  name: 'academicYear',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    openCreateModal: (state) => {
      state.modalMode = 'create';
      state.editingItem = null;
      state.isModalOpen = true;
    },
    openEditModal: (state, action: PayloadAction<AcademicYear>) => {
      state.modalMode = 'edit';
      state.editingItem = action.payload;
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingItem = null;
    },
    addAcademicYear: (state, action: PayloadAction<CreateAcademicYearPayload>) => {
      const nowIso = new Date().toISOString();
      const newYear: AcademicYear = {
        id: `ay-${Date.now()}`,
        schoolCode: action.payload.schoolCode || 'demo',
        name: action.payload.name.trim(),
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      state.items.unshift(newYear);
      state.isModalOpen = false;
      state.editingItem = null;
      state.toastMessage = `Thêm năm học "${newYear.name}" thành công`;
    },
    updateAcademicYear: (state, action: PayloadAction<UpdateAcademicYearPayload>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          name: action.payload.name.trim(),
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          updatedAt: new Date().toISOString(),
        };
        state.toastMessage = `Cập nhật năm học "${state.items[index].name}" thành công`;
      }
      state.isModalOpen = false;
      state.editingItem = null;
    },
    clearToast: (state) => {
      state.toastMessage = null;
    },
  },
});

export const {
  setSearchQuery,
  openCreateModal,
  openEditModal,
  closeModal,
  addAcademicYear,
  updateAcademicYear,
  clearToast,
} = academicYearSlice.actions;

export default academicYearSlice.reducer;
