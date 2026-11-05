import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import attendanceReducer from './slices/attendanceSlice';
import activityReducer from './slices/activitySlice';
import mediaReducer from './slices/mediaSlice';
import conversationReducer from './slices/conversationSlice';
import reportsReducer from './slices/reportsSlice';
import scheduleReducer from './slices/scheduleSlice';
import assignmentReducer from './slices/assignmentSlice';
import gradebookReducer from './slices/gradebookSlice';
import invoiceReducer from './slices/invoiceSlice';
import schoolFeeReducer from './slices/schoolFeeSlice';
import tuitionManagementReducer from './slices/tuitionManagementSlice';
import expenseReducer from './slices/expenseSlice';
import reconciliationReducer from './slices/reconciliationSlice';
import feeReportReducer from './slices/feeReportSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';
import discountReducer from './slices/discountSlice';
import menuReducer from './slices/menuSlice';
import settingFeeReducer from './slices/settingFeeSlice';
import calendarReducer from './slices/calendarSlice';
import classReducer from './slices/classSlice';
import subjectReducer from './slices/subjectSlice';
import gradeReducer from './slices/gradeSlice';
import announcementReducer from './slices/announcementSlice';
import pollReducer from './slices/pollSlice';
import staffAttendanceReducer from './slices/staffAttendanceSlice';
import parentHandbookReducer from './slices/parentHandbookSlice';
import feedbackReducer from './slices/feedbackSlice';
import academicYearReducer from './slices/academicYearSlice';
import archiveReducer from './slices/archiveSlice';
import schoolProfileReducer from './slices/schoolProfileSlice';
import accountReducer from './slices/accountSlice';
import faceRecognitionReducer from './slices/faceRecognitionSlice';
import featureFlagsReducer from './slices/featureFlagsSlice';
import notificationSettingsReducer from './slices/notificationSettingsSlice';
import revenueCategoryReducer from './slices/revenueCategorySlice';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    attendance: attendanceReducer,
    activity: activityReducer,
    media: mediaReducer,
    conversation: conversationReducer,
    reports: reportsReducer,
    schedule: scheduleReducer,
    assignment: assignmentReducer,
    gradebook: gradebookReducer,
    invoice: invoiceReducer,
    schoolFee: schoolFeeReducer,
    revenueCategory: revenueCategoryReducer,
    tuitionManagement: tuitionManagementReducer,
    discount: discountReducer,
    expense: expenseReducer,
    reconciliation: reconciliationReducer,
    feeReport: feeReportReducer,
    student: studentReducer,
    teacher: teacherReducer,
    class: classReducer,
    menu: menuReducer,
    settingFee: settingFeeReducer,
    calendar: calendarReducer,
    subject: subjectReducer,
    grade: gradeReducer,
    announcement: announcementReducer,
    poll: pollReducer,
    staffAttendance: staffAttendanceReducer,
    parentHandbook: parentHandbookReducer,
    feedback: feedbackReducer,
    academicYear: academicYearReducer,
    archive: archiveReducer,
    schoolProfile: schoolProfileReducer,
    account: accountReducer,
    faceRecognition: faceRecognitionReducer,
    featureFlags: featureFlagsReducer,
    notificationSettings: notificationSettingsReducer,
    toast: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
