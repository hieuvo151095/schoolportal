/**
 * Redux State Machine for Notification Settings (Cấu Hình - Thông Báo)
 * Feature: 050-settings-notifications-thong-bao
 * Epic: E-035-settings-notifications
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AttendanceNotificationSettings,
  ExtracurricularScope,
  NotificationSettingsState,
  ParentNotificationSettings,
  TuitionDueTiming,
} from '../../types/notificationSettings.ts';
import {
  MOCK_EXTRACURRICULAR_CLASSES,
  MOCK_INITIAL_NOTIFICATION_SETTINGS,
} from '../../services/mockNotificationSettingsData.ts';

const initialState: NotificationSettingsState = {
  currentSettings: JSON.parse(JSON.stringify(MOCK_INITIAL_NOTIFICATION_SETTINGS)),
  savedSettings: JSON.parse(JSON.stringify(MOCK_INITIAL_NOTIFICATION_SETTINGS)),
  extracurricularClasses: MOCK_EXTRACURRICULAR_CLASSES,
  isConfirmModalOpen: false,
  toastMessage: null,
  error: null,
};

export const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {
    // 1. Attendance Reducers
    updateAttendanceToggle: (
      state,
      action: PayloadAction<{
        field: 'pickupTeacherReminder' | 'dropoffTeacherReminder';
        value: boolean;
      }>
    ) => {
      state.currentSettings.attendance[action.payload.field] = action.payload.value;
    },
    updateExtracurricularScope: (state, action: PayloadAction<ExtracurricularScope>) => {
      state.currentSettings.attendance.extracurricular.scope = action.payload;
    },
    updateExtracurricularToggle: (
      state,
      action: PayloadAction<{
        target: 'notifyParents' | 'notifyTeachers';
        value: boolean;
      }>
    ) => {
      state.currentSettings.attendance.extracurricular[action.payload.target] =
        action.payload.value;
    },

    // 2. Birthday Reducers
    updateBirthdaySchedule: (
      state,
      action: PayloadAction<{ dayOfMonth?: number; time?: string }>
    ) => {
      if (action.payload.dayOfMonth !== undefined) {
        state.currentSettings.birthday.broadcastSchedule.dayOfMonth =
          action.payload.dayOfMonth;
      }
      if (action.payload.time !== undefined) {
        state.currentSettings.birthday.broadcastSchedule.time = action.payload.time;
      }
    },
    updateBirthdayToggle: (
      state,
      action: PayloadAction<{
        target: 'notifyTeachers' | 'notifyAdmins';
        value: boolean;
      }>
    ) => {
      state.currentSettings.birthday[action.payload.target] = action.payload.value;
    },

    // 3. Tuition Reducers
    updateTuitionChangeToggle: (
      state,
      action: PayloadAction<{
        target: 'tuitionChangeNotifyParents' | 'tuitionChangeNotifyAdmins';
        value: boolean;
      }>
    ) => {
      state.currentSettings.tuition[action.payload.target] = action.payload.value;
    },
    updateTuitionGracePeriod: (
      state,
      action: PayloadAction<{ dayOfMonth?: number; notifyParents?: boolean }>
    ) => {
      if (action.payload.dayOfMonth !== undefined) {
        state.currentSettings.tuition.gracePeriod.dayOfMonth = action.payload.dayOfMonth;
      }
      if (action.payload.notifyParents !== undefined) {
        state.currentSettings.tuition.gracePeriod.notifyParents =
          action.payload.notifyParents;
      }
    },
    updateTuitionDueReminder: (
      state,
      action: PayloadAction<{
        timing?: TuitionDueTiming;
        days?: number;
        notifyParents?: boolean;
      }>
    ) => {
      if (action.payload.timing !== undefined) {
        state.currentSettings.tuition.dueReminder.timing = action.payload.timing;
      }
      if (action.payload.days !== undefined) {
        state.currentSettings.tuition.dueReminder.days = action.payload.days;
      }
      if (action.payload.notifyParents !== undefined) {
        state.currentSettings.tuition.dueReminder.notifyParents =
          action.payload.notifyParents;
      }
    },

    // 4. Other Operational Reducers
    updateOtherToggle: (
      state,
      action: PayloadAction<{
        field: 'conversationsNotifyAdmins' | 'postFavoritedNotifyTeachers';
        value: boolean;
      }>
    ) => {
      state.currentSettings.other[action.payload.field] = action.payload.value;
    },
    updateOtherPendingApproval: (
      state,
      action: PayloadAction<{ channel: 'webApp' | 'email'; value: boolean }>
    ) => {
      state.currentSettings.other.pendingActivityApproval[action.payload.channel] =
        action.payload.value;
    },
    updateOtherDailyDiary: (
      state,
      action: PayloadAction<{ channel: 'webApp' | 'email'; value: boolean }>
    ) => {
      state.currentSettings.other.dailyActivityDiary[action.payload.channel] =
        action.payload.value;
    },

    // 5. Parent Reducers
    updateParentToggle: (
      state,
      action: PayloadAction<{
        field: keyof ParentNotificationSettings;
        value: boolean;
      }>
    ) => {
      state.currentSettings.parent[action.payload.field] = action.payload.value;
    },

    // Dialog & Commit Lifecycle
    openConfirmModal: (state) => {
      state.isConfirmModalOpen = true;
    },
    closeConfirmModal: (state) => {
      state.isConfirmModalOpen = false;
      // Retains current working form edits in state (BR02, K096)
    },
    saveNotificationSettings: (state) => {
      state.currentSettings.updatedAt = new Date().toISOString();
      state.currentSettings.updatedBy = 'Admin Finviet';
      state.savedSettings = JSON.parse(JSON.stringify(state.currentSettings));
      state.isConfirmModalOpen = false;
      state.toastMessage = 'Cập nhật cấu hình thông báo thành công!';
    },
    resetWorkingSettings: (state) => {
      state.currentSettings = JSON.parse(JSON.stringify(state.savedSettings));
      state.isConfirmModalOpen = false;
    },
    clearToastMessage: (state) => {
      state.toastMessage = null;
    },
  },
});

export const {
  updateAttendanceToggle,
  updateExtracurricularScope,
  updateExtracurricularToggle,
  updateBirthdaySchedule,
  updateBirthdayToggle,
  updateTuitionChangeToggle,
  updateTuitionGracePeriod,
  updateTuitionDueReminder,
  updateOtherToggle,
  updateOtherPendingApproval,
  updateOtherDailyDiary,
  updateParentToggle,
  openConfirmModal,
  closeConfirmModal,
  saveNotificationSettings,
  resetWorkingSettings,
  clearToastMessage,
} = notificationSettingsSlice.actions;

export default notificationSettingsSlice.reducer;
