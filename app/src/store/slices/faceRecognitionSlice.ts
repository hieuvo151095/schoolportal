/**
 * Redux state machine for Settings Face Recognition (Cấu hình - Nhận diện)
 * Feature: 048-settings-face-recognition-nhan-dien
 * Specification: docs_legacy/operating-portal/M6-cau-hinh/SM4-nhan-dien.md
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  StudentFaceRecord,
  FaceRecognitionFilterState,
  FaceRecognitionModalType,
  FaceRegistrationStatus,
  RegisterFacePayload,
  UpdateFacePayload,
  DeleteFacePayload,
} from '../../types/faceRecognition.ts';
import { INITIAL_STUDENT_FACE_RECORDS } from '../../services/mockFaceRecognitionData.ts';

export interface FaceRecognitionState {
  records: StudentFaceRecord[];
  filterState: FaceRecognitionFilterState;
  activeModal: FaceRecognitionModalType;
  selectedStudent: StudentFaceRecord | null;
  toastMessage: string | null;
}

const initialFilterState: FaceRecognitionFilterState = {
  searchQuery: '',
  classId: 'all',
  registrationStatus: 'all',
  page: 1,
  pageSize: 10,
};

const initialState: FaceRecognitionState = {
  records: INITIAL_STUDENT_FACE_RECORDS,
  filterState: initialFilterState,
  activeModal: null,
  selectedStudent: null,
  toastMessage: null,
};

export const faceRecognitionSlice = createSlice({
  name: 'faceRecognition',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filterState.searchQuery = action.payload;
      state.filterState.page = 1;
    },
    setClassFilter: (state, action: PayloadAction<string>) => {
      state.filterState.classId = action.payload;
      state.filterState.page = 1;
    },
    setStatusFilter: (state, action: PayloadAction<FaceRegistrationStatus>) => {
      state.filterState.registrationStatus = action.payload;
      state.filterState.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filterState.page = action.payload;
    },
    resetFilters: (state) => {
      state.filterState = { ...initialFilterState };
    },
    setFilterState: (
      state,
      action: PayloadAction<Partial<FaceRecognitionFilterState>>
    ) => {
      state.filterState = { ...state.filterState, ...action.payload };
    },
    openRegisterModal: (state, action: PayloadAction<StudentFaceRecord>) => {
      state.activeModal = 'register';
      state.selectedStudent = action.payload;
    },
    openEditModal: (state, action: PayloadAction<StudentFaceRecord>) => {
      state.activeModal = 'edit';
      state.selectedStudent = action.payload;
    },
    openDeleteModal: (state, action: PayloadAction<StudentFaceRecord>) => {
      state.activeModal = 'delete';
      state.selectedStudent = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.selectedStudent = null;
    },
    registerFacePhoto: (state, action: PayloadAction<RegisterFacePayload>) => {
      const { studentId, facePhotoUrl, registeredDate } = action.payload;
      const index = state.records.findIndex((r) => r.studentId === studentId);
      if (index !== -1) {
        const currentDate =
          registeredDate ||
          new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        state.records[index] = {
          ...state.records[index],
          isRegistered: true,
          facePhotoUrl,
          registeredDate: currentDate,
        };
        state.toastMessage = `Đăng ký ảnh nhận diện thành công cho học sinh ${state.records[index].fullName}`;
      }
      state.activeModal = null;
      state.selectedStudent = null;
    },
    updateFacePhoto: (state, action: PayloadAction<UpdateFacePayload>) => {
      const { studentId, facePhotoUrl, registeredDate } = action.payload;
      const index = state.records.findIndex((r) => r.studentId === studentId);
      if (index !== -1) {
        const currentDate =
          registeredDate ||
          new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        state.records[index] = {
          ...state.records[index],
          isRegistered: true,
          facePhotoUrl,
          registeredDate: currentDate,
        };
        state.toastMessage = `Cập nhật ảnh nhận diện thành công cho học sinh ${state.records[index].fullName}`;
      }
      state.activeModal = null;
      state.selectedStudent = null;
    },
    deleteFacePhoto: (state, action: PayloadAction<DeleteFacePayload>) => {
      const { studentId } = action.payload;
      const index = state.records.findIndex((r) => r.studentId === studentId);
      if (index !== -1) {
        const studentName = state.records[index].fullName;
        state.records[index] = {
          ...state.records[index],
          isRegistered: false,
          facePhotoUrl: undefined,
          registeredDate: undefined,
        };
        state.toastMessage = `Đã xóa thông tin nhận diện của học sinh ${studentName}`;
      }
      state.activeModal = null;
      state.selectedStudent = null;
    },
    clearToast: (state) => {
      state.toastMessage = null;
    },
  },
});

export const {
  setSearchQuery,
  setClassFilter,
  setStatusFilter,
  setPage,
  resetFilters,
  setFilterState,
  openRegisterModal,
  openEditModal,
  openDeleteModal,
  closeModal,
  registerFacePhoto,
  updateFacePhoto,
  deleteFacePhoto,
  clearToast,
} = faceRecognitionSlice.actions;

export default faceRecognitionSlice.reducer;
