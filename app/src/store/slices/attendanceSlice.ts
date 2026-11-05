import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  StudentAttendance,
  AttendanceSummary,
  AttendanceStatus,
  HealthCondition,
} from '../../types/attendance.ts';
import {
  INITIAL_STUDENTS,
  getAttendanceForDateAndClass,
} from '../../services/mockAttendanceData.ts';
import {
  validateCheckOut,
  checkIsLate,
  calculateAttendanceSummary,
  getCurrentTimeHHmm,
} from '../../utils/attendanceValidation.ts';

export interface AttendanceState {
  students: StudentAttendance[];
  selectedDate: string;
  selectedClassId: string;
  searchQuery: string;
  statusFilter: 'all' | AttendanceStatus;
  selectedStudentIds: string[];
  summary: AttendanceSummary;
  errorMessage: string | null;
  successMessage: string | null;
  isPickupModalOpen: boolean;
  activeStudentForPickup: StudentAttendance | null;
  isBulkAbsentModalOpen: boolean;
  recordsCache: Record<string, StudentAttendance[]>;
}

const defaultDate = '2026-09-12';
const defaultClassId = 'lop-1a1';
const initialStudents = INITIAL_STUDENTS;

const initialState: AttendanceState = {
  students: initialStudents,
  selectedDate: defaultDate,
  selectedClassId: defaultClassId,
  searchQuery: '',
  statusFilter: 'all',
  selectedStudentIds: [],
  summary: calculateAttendanceSummary(initialStudents),
  errorMessage: null,
  successMessage: null,
  isPickupModalOpen: false,
  activeStudentForPickup: null,
  isBulkAbsentModalOpen: false,
  recordsCache: {
    [`${defaultClassId}_${defaultDate}`]: initialStudents,
  },
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      const newDate = action.payload;
      state.selectedDate = newDate;
      const key = `${state.selectedClassId}_${newDate}`;
      if (state.recordsCache && state.recordsCache[key]) {
        state.students = state.recordsCache[key];
      } else {
        const loaded = getAttendanceForDateAndClass(newDate, state.selectedClassId);
        state.students = loaded;
        if (!state.recordsCache) state.recordsCache = {};
        state.recordsCache[key] = loaded;
      }
      state.summary = calculateAttendanceSummary(state.students);
      state.selectedStudentIds = [];
      state.errorMessage = null;
    },
    setSelectedClassId: (state, action: PayloadAction<string>) => {
      const newClassId = action.payload;
      state.selectedClassId = newClassId;
      const key = `${newClassId}_${state.selectedDate}`;
      if (state.recordsCache && state.recordsCache[key]) {
        state.students = state.recordsCache[key];
      } else {
        const loaded = getAttendanceForDateAndClass(state.selectedDate, newClassId);
        state.students = loaded;
        if (!state.recordsCache) state.recordsCache = {};
        state.recordsCache[key] = loaded;
      }
      state.summary = calculateAttendanceSummary(state.students);
      state.selectedStudentIds = [];
      state.errorMessage = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<'all' | AttendanceStatus>) => {
      state.statusFilter = action.payload;
    },
    toggleSelectStudent: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedStudentIds.includes(id)) {
        state.selectedStudentIds = state.selectedStudentIds.filter((item) => item !== id);
      } else {
        state.selectedStudentIds.push(id);
      }
    },
    toggleSelectAll: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.selectedStudentIds = state.students.map((s) => s.studentId);
      } else {
        state.selectedStudentIds = [];
      }
    },
    clearSelectedStudents: (state) => {
      state.selectedStudentIds = [];
    },

    // Check-in single student
    checkInStudent: (
      state,
      action: PayloadAction<{ studentId: string; arrivalTime?: string }>
    ) => {
      const { studentId, arrivalTime } = action.payload;
      const student = state.students.find((s) => s.studentId === studentId);
      if (!student) return;

      const time = arrivalTime || getCurrentTimeHHmm();
      student.arrivalTime = time;
      student.isLate = checkIsLate(time);
      student.status = 'present';
      student.refundEligible = false;

      state.summary = calculateAttendanceSummary(state.students);
      state.successMessage = `Đã điểm danh đón bé ${student.fullName} lúc ${time}${
        student.isLate ? ' (Đến muộn)' : ''
      }`;
      state.errorMessage = null;
    },

    // Quick check-out single student
    checkOutStudent: (
      state,
      action: PayloadAction<{ studentId: string; departureTime?: string }>
    ) => {
      const { studentId, departureTime } = action.payload;
      const student = state.students.find((s) => s.studentId === studentId);
      if (!student) return;

      const time = departureTime || getCurrentTimeHHmm();
      const validation = validateCheckOut(student.arrivalTime, time);

      if (!validation.valid) {
        state.errorMessage = validation.error || 'Lỗi giờ trả học sinh';
        return;
      }

      student.departureTime = time;
      state.summary = calculateAttendanceSummary(state.students);
      state.successMessage = `Đã xác nhận trả bé ${student.fullName} lúc ${time}`;
      state.errorMessage = null;
    },

    // Check-out with authorized guardian selection (Modal BR09)
    checkOutWithGuardian: (
      state,
      action: PayloadAction<{
        studentId: string;
        departureTime: string;
        guardianId: string;
        guardianName: string;
      }>
    ) => {
      const { studentId, departureTime, guardianId, guardianName } = action.payload;
      const student = state.students.find((s) => s.studentId === studentId);
      if (!student) return;

      // Validate checkout time against arrival time (requires student to have arrived)
      const validation = validateCheckOut(student.arrivalTime, departureTime);
      if (!validation.valid) {
        state.errorMessage = validation.error || 'Lỗi giờ trả học sinh';
        return;
      }

      student.departureTime = departureTime;
      student.pickupGuardianId = guardianId;
      student.pickupGuardianName = guardianName;
      student.status = 'present';

      state.summary = calculateAttendanceSummary(state.students);
      state.successMessage = `Đã xác nhận trả bé ${student.fullName} cho ${guardianName} lúc ${departureTime}`;
      state.errorMessage = null;
      state.isPickupModalOpen = false;
      state.activeStudentForPickup = null;
    },

    // Bulk check-in for selected students
    bulkCheckInSelected: (
      state,
      action: PayloadAction<{ arrivalTime?: string; studentIds?: string[] } | undefined>
    ) => {
      const time = action.payload?.arrivalTime || getCurrentTimeHHmm();
      const targetIds = action.payload?.studentIds || state.selectedStudentIds;
      let updatedCount = 0;

      for (const student of state.students) {
        if (targetIds.includes(student.studentId)) {
          student.arrivalTime = time;
          student.isLate = checkIsLate(time);
          student.status = 'present';
          student.refundEligible = false;
          updatedCount++;
        }
      }

      state.summary = calculateAttendanceSummary(state.students);
      state.successMessage = `Đã điểm danh đón ${updatedCount} học sinh được chọn lúc ${time}`;
      state.errorMessage = null;
      state.selectedStudentIds = [];
    },

    // Bulk check-out for selected students
    bulkCheckOutSelected: (
      state,
      action: PayloadAction<{ departureTime?: string; studentIds?: string[] } | undefined>
    ) => {
      const time = action.payload?.departureTime || getCurrentTimeHHmm();
      const targetIds = action.payload?.studentIds || state.selectedStudentIds;
      let updatedCount = 0;
      let skippedCount = 0;

      for (const student of state.students) {
        if (targetIds.includes(student.studentId)) {
          // If student has not been checked in yet (no arrivalTime or not present), skip
          if (!student.arrivalTime || student.status !== 'present') {
            skippedCount++;
            continue;
          }
          if (time <= student.arrivalTime) {
            skippedCount++;
            continue;
          }
          student.departureTime = time;
          student.status = 'present';
          updatedCount++;
        }
      }

      state.summary = calculateAttendanceSummary(state.students);
      if (updatedCount > 0) {
        state.successMessage = `Đã trả ${updatedCount} học sinh được chọn lúc ${time}${
          skippedCount > 0 ? ` (${skippedCount} học sinh bỏ qua do chưa đón hoặc giờ trả không hợp lệ)` : ''
        }`;
      } else if (skippedCount > 0) {
        state.errorMessage =
          'Không thể trả học sinh: Các học sinh được chọn chưa được điểm danh đón hoặc giờ trả không hợp lệ.';
      }
      state.selectedStudentIds = [];
    },

    // Bulk absent modal submit (BR04 & BR04b)
    bulkRecordAbsence: (
      state,
      action: PayloadAction<{
        absentType: 'excused_absent' | 'unexcused_absent';
        refundEligible: boolean;
        notes?: string;
      }>
    ) => {
      const { absentType, refundEligible, notes } = action.payload;
      let count = 0;

      for (const student of state.students) {
        if (state.selectedStudentIds.includes(student.studentId)) {
          student.status = absentType;
          student.arrivalTime = null;
          student.departureTime = null;
          student.isLate = false;
          student.refundEligible = refundEligible;
          if (notes) {
            student.notes = notes;
          }
          count++;
        }
      }

      state.summary = calculateAttendanceSummary(state.students);
      const typeLabel = absentType === 'excused_absent' ? 'Có phép' : 'Không phép';
      state.successMessage = `Đã cập nhật báo vắng (${typeLabel}) cho ${count} học sinh.`;
      state.errorMessage = null;
      state.isBulkAbsentModalOpen = false;
      state.selectedStudentIds = [];
    },

    // Update individual health record
    updateHealthRecord: (
      state,
      action: PayloadAction<{
        studentId: string;
        temperature: number;
        healthCondition: HealthCondition;
      }>
    ) => {
      const { studentId, temperature, healthCondition } = action.payload;
      const student = state.students.find((s) => s.studentId === studentId);
      if (!student) return;

      student.temperature = temperature;
      student.healthCondition = healthCondition;
      if (state.recordsCache) {
        state.recordsCache[`${state.selectedClassId}_${state.selectedDate}`] = state.students;
      }
      state.successMessage = `Đã cập nhật sức khỏe cho bé ${student.fullName}: ${temperature}°C - ${healthCondition}`;
      state.errorMessage = null;
    },

    // Update notes
    updateStudentNotes: (
      state,
      action: PayloadAction<{ studentId: string; notes: string }>
    ) => {
      const { studentId, notes } = action.payload;
      const student = state.students.find((s) => s.studentId === studentId);
      if (!student) return;

      student.notes = notes;
      if (state.recordsCache) {
        state.recordsCache[`${state.selectedClassId}_${state.selectedDate}`] = state.students;
      }
    },

    // Edit arrival or departure time after attendance
    updateStudentAttendanceTime: (
      state,
      action: PayloadAction<{
        studentId: string;
        type: 'arrivalTime' | 'departureTime';
        time: string;
      }>
    ) => {
      const { studentId, type, time } = action.payload;
      const student = state.students.find((s) => s.studentId === studentId);
      if (!student) return;

      if (type === 'arrivalTime') {
        student.arrivalTime = time;
        student.isLate = checkIsLate(time);
        if (student.departureTime && student.departureTime <= time) {
          student.departureTime = null;
        }
      } else {
        if (student.arrivalTime && time <= student.arrivalTime) {
          state.errorMessage = `Giờ trả (${time}) phải sau giờ đón (${student.arrivalTime})`;
          return;
        }
        student.departureTime = time;
      }

      if (state.recordsCache) {
        state.recordsCache[`${state.selectedClassId}_${state.selectedDate}`] = state.students;
      }
      state.summary = calculateAttendanceSummary(state.students);
      state.successMessage = `Đã cập nhật ${type === 'arrivalTime' ? 'giờ đón' : 'giờ trả'} của bé ${student.fullName} thành ${time}`;
      state.errorMessage = null;
    },

    // Modal UI state controls
    openPickupModal: (state, action: PayloadAction<StudentAttendance>) => {
      state.activeStudentForPickup = action.payload;
      state.isPickupModalOpen = true;
      state.errorMessage = null;
    },
    closePickupModal: (state) => {
      state.activeStudentForPickup = null;
      state.isPickupModalOpen = false;
    },
    openBulkAbsentModal: (state) => {
      state.isBulkAbsentModalOpen = true;
      state.errorMessage = null;
    },
    closeBulkAbsentModal: (state) => {
      state.isBulkAbsentModalOpen = false;
    },

    clearNotification: (state) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
});

export const {
  setSelectedDate,
  setSelectedClassId,
  setSearchQuery,
  setStatusFilter,
  toggleSelectStudent,
  toggleSelectAll,
  clearSelectedStudents,
  checkInStudent,
  checkOutStudent,
  checkOutWithGuardian,
  bulkCheckInSelected,
  bulkCheckOutSelected,
  bulkRecordAbsence,
  updateHealthRecord,
  updateStudentNotes,
  updateStudentAttendanceTime,
  openPickupModal,
  closePickupModal,
  openBulkAbsentModal,
  closeBulkAbsentModal,
  clearNotification,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
