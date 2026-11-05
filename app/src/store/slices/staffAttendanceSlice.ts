import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  StaffProfile,
  StaffAttendanceRecord,
  StaffAttendanceFilterState,
  StaffRole,
  RecordCheckInPayload,
  RecordCheckOutPayload,
  UpdateTimeBadgePayload,
  RecordAbsencePayload,
  CancelAbsencePayload,
  UpdateGeneralNotePayload,
} from '../../types/staffAttendance.ts';
import {
  MOCK_STAFF_LIST,
  generateInitialAttendanceRecords,
} from '../../services/mockStaffAttendanceData.ts';
import {
  getTodayISODate,
  getCurrentTimeHHmm,
  validateTimeFormat,
  isDateLockedForEdit,
} from '../../utils/staffAttendanceValidation.ts';

export interface StaffAttendanceState {
  staffList: StaffProfile[];
  records: Record<string, Record<string, StaffAttendanceRecord>>; // date -> staffId -> record
  filterState: StaffAttendanceFilterState;
  activeAbsenceStaffId: string | null; // Staff member currently in absence modal (BR06)
  selectedProfileStaffId: string | null; // Staff member profile modal (BR11)
  toastMessage: string | null; // Toast alert text e.g. DD-01
}

const todayStr = getTodayISODate();

const initialState: StaffAttendanceState = {
  staffList: MOCK_STAFF_LIST,
  records: generateInitialAttendanceRecords(),
  filterState: {
    date: todayStr,
    classId: 'all',
    role: 'all',
    searchQuery: '',
    sortDirection: 'asc',
  },
  activeAbsenceStaffId: null,
  selectedProfileStaffId: null,
  toastMessage: null,
};

function ensureRecordExists(
  records: Record<string, Record<string, StaffAttendanceRecord>>,
  date: string,
  staffId: string
): StaffAttendanceRecord {
  if (!records[date]) {
    records[date] = {};
  }
  if (!records[date][staffId]) {
    records[date][staffId] = {
      id: `att-${staffId}-${date}`,
      staffId,
      date,
      isAbsent: false,
      updatedAt: new Date().toISOString(),
    };
  }
  return records[date][staffId];
}

export const staffAttendanceSlice = createSlice({
  name: 'staffAttendance',
  initialState,
  reducers: {
    setFilterDate: (state, action: PayloadAction<string>) => {
      state.filterState.date = action.payload;
    },
    setFilterClass: (state, action: PayloadAction<string>) => {
      state.filterState.classId = action.payload;
    },
    setFilterRole: (state, action: PayloadAction<StaffRole | 'all'>) => {
      state.filterState.role = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filterState.searchQuery = action.payload;
    },
    toggleSortDirection: (state) => {
      state.filterState.sortDirection =
        state.filterState.sortDirection === 'asc' ? 'desc' : 'asc';
    },

    // 1-Click Check-In (BR03, K048)
    checkInStaff: (state, action: PayloadAction<RecordCheckInPayload>) => {
      const { staffId, date, time } = action.payload;
      if (isDateLockedForEdit(date)) {
        return;
      }
      const record = ensureRecordExists(state.records, date, staffId);
      record.checkInTime = time || getCurrentTimeHHmm();
      record.isAbsent = false;
      record.absenceType = undefined;
      record.absenceNote = undefined;
      record.updatedAt = new Date().toISOString();
    },

    // 1-Click Check-Out (BR03, K048)
    checkOutStaff: (state, action: PayloadAction<RecordCheckOutPayload>) => {
      const { staffId, date, time } = action.payload;
      if (isDateLockedForEdit(date)) {
        return;
      }
      const record = ensureRecordExists(state.records, date, staffId);
      record.checkOutTime = time || getCurrentTimeHHmm();
      record.isAbsent = false;
      record.absenceType = undefined;
      record.absenceNote = undefined;
      record.updatedAt = new Date().toISOString();
    },

    // Inline Time Badge Editing with Format Validation (BR04, DD-01)
    updateTimeBadge: (state, action: PayloadAction<UpdateTimeBadgePayload>) => {
      const { staffId, date, type, time } = action.payload;
      if (isDateLockedForEdit(date)) {
        return;
      }
      // If time format is invalid or empty, reject and trigger toast DD-01
      if (!validateTimeFormat(time)) {
        state.toastMessage = 'Thời gian không đúng định dạng.';
        return;
      }

      const record = ensureRecordExists(state.records, date, staffId);
      if (type === 'checkIn') {
        record.checkInTime = time;
      } else {
        record.checkOutTime = time;
      }
      record.updatedAt = new Date().toISOString();
    },

    // Absence Modal Open / Close (BR05, BR06)
    openAbsenceModal: (state, action: PayloadAction<string>) => {
      state.activeAbsenceStaffId = action.payload;
    },
    closeAbsenceModal: (state) => {
      state.activeAbsenceStaffId = null;
    },

    // Record Absence (BR05)
    recordStaffAbsence: (state, action: PayloadAction<RecordAbsencePayload>) => {
      const { staffId, date, absenceType, absenceNote } = action.payload;
      if (isDateLockedForEdit(date)) {
        return;
      }
      const record = ensureRecordExists(state.records, date, staffId);
      record.isAbsent = true;
      record.absenceType = absenceType;
      record.absenceNote = absenceNote;
      record.updatedAt = new Date().toISOString();
      state.activeAbsenceStaffId = null;
    },

    // Cancel Absence
    cancelStaffAbsence: (state, action: PayloadAction<CancelAbsencePayload>) => {
      const { staffId, date } = action.payload;
      if (isDateLockedForEdit(date)) {
        return;
      }
      const record = ensureRecordExists(state.records, date, staffId);
      record.isAbsent = false;
      record.absenceType = undefined;
      record.absenceNote = undefined;
      record.updatedAt = new Date().toISOString();
      state.activeAbsenceStaffId = null;
    },

    // Inline General Note Update (BR07)
    updateStaffNote: (state, action: PayloadAction<UpdateGeneralNotePayload>) => {
      const { staffId, date, note } = action.payload;
      if (isDateLockedForEdit(date)) {
        return;
      }
      const record = ensureRecordExists(state.records, date, staffId);
      record.generalNote = note;
      record.updatedAt = new Date().toISOString();
    },

    // Profile Modal Open / Close (BR11)
    openStaffProfileModal: (state, action: PayloadAction<string>) => {
      state.selectedProfileStaffId = action.payload;
    },
    closeStaffProfileModal: (state) => {
      state.selectedProfileStaffId = null;
    },

    // Toast Management
    setToastMessage: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
    clearToastMessage: (state) => {
      state.toastMessage = null;
    },
  },
});

export const {
  setFilterDate,
  setFilterClass,
  setFilterRole,
  setSearchQuery,
  toggleSortDirection,
  checkInStaff,
  checkOutStaff,
  updateTimeBadge,
  openAbsenceModal,
  closeAbsenceModal,
  recordStaffAbsence,
  cancelStaffAbsence,
  updateStaffNote,
  openStaffProfileModal,
  closeStaffProfileModal,
  setToastMessage,
  clearToastMessage,
} = staffAttendanceSlice.actions;

export default staffAttendanceSlice.reducer;
