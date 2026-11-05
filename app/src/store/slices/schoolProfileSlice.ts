/**
 * Redux State Machine for School Profile & Operational Configuration
 * Feature: 046-settings-school-profile-truong
 * Standards: K069-K075, TR-01, TR-02
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SchoolProfile,
  DayOperatingHour,
  AttendanceRules,
  SchoolProfileState,
} from '../../types/schoolProfile.ts';
import {
  mockSchoolProfile,
  mockDayOperatingHours,
  mockAttendanceRules,
} from '../../services/mockSchoolProfileData.ts';

const initialState: SchoolProfileState = {
  profile: mockSchoolProfile,
  operatingHours: mockDayOperatingHours,
  attendanceRules: mockAttendanceRules,
  activeTab: 'info',
  isDirtyInfo: false,
  isDirtyHours: false,
  isDirtyRules: false,
  showUnsavedLeaveModal: false,
  pendingNavigationUrl: undefined,
  toastMessage: undefined,
  toastType: undefined,
};

export const schoolProfileSlice = createSlice({
  name: 'schoolProfile',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'info' | 'weekdays'>) => {
      state.activeTab = action.payload;
    },
    updateSchoolProfile: (state, action: PayloadAction<Partial<SchoolProfile>>) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
      state.isDirtyInfo = false;
      state.toastMessage = 'Cập nhật thông tin trường học thành công!';
      state.toastType = 'success';
    },
    updateOperatingHours: (state, action: PayloadAction<DayOperatingHour[]>) => {
      state.operatingHours = action.payload;
      state.isDirtyHours = false;
      state.toastMessage = 'Cập nhật giờ hoạt động trường thành công!';
      state.toastType = 'success';
    },
    updateAttendanceRules: (state, action: PayloadAction<Partial<AttendanceRules>>) => {
      state.attendanceRules = {
        ...state.attendanceRules,
        ...action.payload,
      };
      state.isDirtyRules = false;
      state.toastMessage = 'Cập nhật quy định điểm danh thành công!';
      state.toastType = 'success';
    },
    setDirtyInfo: (state, action: PayloadAction<boolean>) => {
      state.isDirtyInfo = action.payload;
    },
    setDirtyHours: (state, action: PayloadAction<boolean>) => {
      state.isDirtyHours = action.payload;
    },
    setDirtyRules: (state, action: PayloadAction<boolean>) => {
      state.isDirtyRules = action.payload;
    },
    openUnsavedLeaveModal: (state, action: PayloadAction<string | undefined>) => {
      state.showUnsavedLeaveModal = true;
      state.pendingNavigationUrl = action.payload;
    },
    closeUnsavedLeaveModal: (state) => {
      state.showUnsavedLeaveModal = false;
      state.pendingNavigationUrl = undefined;
    },
    discardChanges: (state) => {
      state.isDirtyInfo = false;
      state.isDirtyHours = false;
      state.isDirtyRules = false;
      state.showUnsavedLeaveModal = false;
      state.pendingNavigationUrl = undefined;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>
    ) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    clearToast: (state) => {
      state.toastMessage = undefined;
      state.toastType = undefined;
    },
  },
});

export const {
  setActiveTab,
  updateSchoolProfile,
  updateOperatingHours,
  updateAttendanceRules,
  setDirtyInfo,
  setDirtyHours,
  setDirtyRules,
  openUnsavedLeaveModal,
  closeUnsavedLeaveModal,
  discardChanges,
  showToast,
  clearToast,
} = schoolProfileSlice.actions;

export default schoolProfileSlice.reducer;
