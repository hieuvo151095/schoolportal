import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AttendanceDayStatus,
  DailyAttendanceRecord,
  ExtendedReport,
  ReportFilterCriteria,
  ReportLifecycleStatus,
  StaffMonthlyAttendance,
  StudentMonthlyAttendance,
} from '../../types/reports.ts';
import {
  canDeleteReport,
  computeStudentAttendanceTotals,
  duplicateReport,
  getNextReportStatus,
} from '../../utils/reportsValidation.ts';
import {
  createInitialStudentRoster,
  INITIAL_EXTENDED_REPORTS,
  INITIAL_STAFF_ROSTER,
} from '../../services/mockReportsData.ts';

export interface ReportsState {
  activeTab: 'students' | 'staff';
  selectedYear: number;
  selectedMonth: number;
  selectedClassId: string;
  selectedRole: string;
  staffSearchQuery: string;
  studentRoster: StudentMonthlyAttendance[];
  staffRoster: StaffMonthlyAttendance[];
  extendedReports: ExtendedReport[];
  reportFilters: ReportFilterCriteria;
  selectedDayDetail: { studentName: string; record: DailyAttendanceRecord } | null;
  selectedAbsenceEdit: {
    studentId: string;
    studentName: string;
    record: DailyAttendanceRecord;
  } | null;
  selectedLateFeeReport: StudentMonthlyAttendance | null;
  selectedDuplicateReport: ExtendedReport | null;
  isExtendedFilterOpen: boolean;
}

const initialState: ReportsState = {
  activeTab: 'students',
  selectedYear: 2026,
  selectedMonth: 9,
  selectedClassId: 'lop-1a2',
  selectedRole: 'all',
  staffSearchQuery: '',
  studentRoster: createInitialStudentRoster(),
  staffRoster: INITIAL_STAFF_ROSTER,
  extendedReports: INITIAL_EXTENDED_REPORTS,
  reportFilters: {
    searchQuery: '',
    classId: 'all',
    templateId: 'all',
    status: 'all',
  },
  selectedDayDetail: null,
  selectedAbsenceEdit: null,
  selectedLateFeeReport: null,
  selectedDuplicateReport: null,
  isExtendedFilterOpen: false,
};

export const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'students' | 'staff'>) => {
      state.activeTab = action.payload;
    },

    setAttendanceFilters: (
      state,
      action: PayloadAction<Partial<{
        year: number;
        month: number;
        classId: string;
        role: string;
        staffSearchQuery: string;
      }>>
    ) => {
      if (action.payload.year !== undefined) state.selectedYear = action.payload.year;
      if (action.payload.month !== undefined) state.selectedMonth = action.payload.month;
      if (action.payload.classId !== undefined) state.selectedClassId = action.payload.classId;
      if (action.payload.role !== undefined) state.selectedRole = action.payload.role;
      if (action.payload.staffSearchQuery !== undefined)
        state.staffSearchQuery = action.payload.staffSearchQuery;
    },

    openDayDetailModal: (
      state,
      action: PayloadAction<{ studentName: string; record: DailyAttendanceRecord }>
    ) => {
      state.selectedDayDetail = action.payload;
    },

    closeDayDetailModal: (state) => {
      state.selectedDayDetail = null;
    },

    openAbsenceEditModal: (
      state,
      action: PayloadAction<{
        studentId: string;
        studentName: string;
        record: DailyAttendanceRecord;
      }>
    ) => {
      state.selectedAbsenceEdit = action.payload;
    },

    closeAbsenceEditModal: (state) => {
      state.selectedAbsenceEdit = null;
    },

    updateAbsenceRecord: (
      state,
      action: PayloadAction<{
        studentId: string;
        date: string;
        status: AttendanceDayStatus;
        notes?: string;
      }>
    ) => {
      const student = state.studentRoster.find((s) => s.studentId === action.payload.studentId);
      if (student && student.records[action.payload.date]) {
        student.records[action.payload.date].status = action.payload.status;
        student.records[action.payload.date].notes = action.payload.notes || '';
        if (action.payload.status === 'present') {
          student.records[action.payload.date].checkInTime = '07:45';
          student.records[action.payload.date].checkInStaff = 'Cô Nguyễn Mai';
          student.records[action.payload.date].checkOutTime = '17:00';
          student.records[action.payload.date].checkOutStaff = 'Cô Thu Thủy';
          student.records[action.payload.date].temperature = 36.6;
        } else {
          student.records[action.payload.date].checkInTime = null;
          student.records[action.payload.date].checkOutTime = null;
          student.records[action.payload.date].temperature = null;
        }

        // Recalculate totals
        const totals = computeStudentAttendanceTotals(student.records);
        Object.assign(student, totals);
      }
      state.selectedAbsenceEdit = null;
    },

    openLateFeeModal: (state, action: PayloadAction<StudentMonthlyAttendance>) => {
      state.selectedLateFeeReport = action.payload;
    },

    closeLateFeeModal: (state) => {
      state.selectedLateFeeReport = null;
    },

    openDuplicateModal: (state, action: PayloadAction<ExtendedReport>) => {
      state.selectedDuplicateReport = action.payload;
    },

    closeDuplicateModal: (state) => {
      state.selectedDuplicateReport = null;
    },

    toggleExtendedFilter: (state, action: PayloadAction<boolean | undefined>) => {
      state.isExtendedFilterOpen =
        action.payload !== undefined ? action.payload : !state.isExtendedFilterOpen;
    },

    setReportFilterCriteria: (state, action: PayloadAction<Partial<ReportFilterCriteria>>) => {
      state.reportFilters = { ...state.reportFilters, ...action.payload };
    },

    createExtendedReport: (state, action: PayloadAction<ExtendedReport>) => {
      state.extendedReports.unshift(action.payload);
    },

    duplicateExtendedReport: (
      state,
      action: PayloadAction<{
        sourceReportId: string;
        newStudent: {
          id: string;
          name: string;
          code: string;
          age: string;
          parentName: string;
          avatarUrl?: string;
        };
        newClassId: string;
        newClassName: string;
        newStartDate?: string;
        newEndDate?: string;
      }>
    ) => {
      const source = state.extendedReports.find((r) => r.id === action.payload.sourceReportId);
      if (source) {
        const cloned = duplicateReport(
          source,
          action.payload.newStudent,
          action.payload.newClassId,
          action.payload.newClassName,
          action.payload.newStartDate,
          action.payload.newEndDate
        );
        state.extendedReports.unshift(cloned);
      }
      state.selectedDuplicateReport = null;
    },

    deleteExtendedReport: (state, action: PayloadAction<string>) => {
      const report = state.extendedReports.find((r) => r.id === action.payload);
      if (report && canDeleteReport(report.status)) {
        state.extendedReports = state.extendedReports.filter((r) => r.id !== action.payload);
      }
    },

    advanceReportStatus: (state, action: PayloadAction<string>) => {
      const report = state.extendedReports.find((r) => r.id === action.payload);
      if (report) {
        const next = getNextReportStatus(report.status);
        if (next) {
          report.status = next;
          report.updatedAt = new Date().toISOString();
        }
      }
    },

    updateReportChecklist: (
      state,
      action: PayloadAction<{
        reportId: string;
        sectionId: string;
        itemId: string;
        value: boolean;
      }>
    ) => {
      const report = state.extendedReports.find((r) => r.id === action.payload.reportId);
      if (report) {
        if (!report.checklistData[action.payload.sectionId]) {
          report.checklistData[action.payload.sectionId] = {};
        }
        report.checklistData[action.payload.sectionId][action.payload.itemId] = action.payload.value;
        report.updatedAt = new Date().toISOString();
      }
    },

    updateReportNotes: (
      state,
      action: PayloadAction<{ reportId: string; generalNotes: string }>
    ) => {
      const report = state.extendedReports.find((r) => r.id === action.payload.reportId);
      if (report) {
        report.generalNotes = action.payload.generalNotes;
        report.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  setActiveTab,
  setAttendanceFilters,
  openDayDetailModal,
  closeDayDetailModal,
  openAbsenceEditModal,
  closeAbsenceEditModal,
  updateAbsenceRecord,
  openLateFeeModal,
  closeLateFeeModal,
  openDuplicateModal,
  closeDuplicateModal,
  toggleExtendedFilter,
  setReportFilterCriteria,
  createExtendedReport,
  duplicateExtendedReport,
  deleteExtendedReport,
  advanceReportStatus,
  updateReportChecklist,
  updateReportNotes,
} = reportsSlice.actions;

export default reportsSlice.reducer;
