import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ArchivedStudent,
  ArchiveStaffOperator,
  ArchiveState,
  ArchiveSortField,
  ArchiveModalType,
} from '../../types/archive.ts';
import { mockArchivedStudents, mockActiveClasses } from '../../services/mockArchiveData.ts';
import { evaluateRestorationClass } from '../../utils/archiveValidation.ts';

const initialState: ArchiveState = {
  students: mockArchivedStudents,
  activeClasses: mockActiveClasses,
  filter: {
    searchQuery: '',
    archivePeriodMonth: undefined,
  },
  sort: {
    field: 'fullName',
    direction: 'asc',
  },
  selectedStudent: null,
  selectedStaff: null,
  activeModal: 'none',
  isLoading: false,
  error: null,
  notification: null,
};

export const archiveSlice = createSlice({
  name: 'archive',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },
    setArchivePeriodMonth: (state, action: PayloadAction<string | undefined>) => {
      state.filter.archivePeriodMonth = action.payload;
    },
    clearFilters: (state) => {
      state.filter.searchQuery = '';
      state.filter.archivePeriodMonth = undefined;
    },
    setSort: (
      state,
      action: PayloadAction<{ field: ArchiveSortField; direction: 'asc' | 'desc' }>
    ) => {
      state.sort = action.payload;
    },
    toggleSort: (state, action: PayloadAction<ArchiveSortField>) => {
      if (state.sort.field === action.payload) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.field = action.payload;
        state.sort.direction = 'asc';
      }
    },
    openStudentDetailModal: (state, action: PayloadAction<ArchivedStudent>) => {
      state.selectedStudent = action.payload;
      state.activeModal = 'detail';
    },
    openStaffModal: (state, action: PayloadAction<ArchiveStaffOperator>) => {
      state.selectedStaff = action.payload;
      state.activeModal = 'staff';
    },
    openRestoreModal: (state, action: PayloadAction<ArchivedStudent>) => {
      state.selectedStudent = action.payload;
      state.activeModal = 'restore';
    },
    openPurgeModal: (state, action: PayloadAction<ArchivedStudent>) => {
      state.selectedStudent = action.payload;
      state.activeModal = 'purge';
    },
    closeModal: (state) => {
      state.activeModal = 'none';
      state.selectedStudent = null;
      state.selectedStaff = null;
    },
    restoreStudent: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      const studentIndex = state.students.findIndex((s) => s.id === studentId);

      if (studentIndex !== -1) {
        const student = state.students[studentIndex];
        const restoration = evaluateRestorationClass(student, state.activeClasses);

        // Remove from archive roster
        state.students.splice(studentIndex, 1);
        state.activeModal = 'none';
        state.selectedStudent = null;

        if (restoration.isClassActive) {
          state.notification = {
            type: 'success',
            message: `Đã phục hồi học sinh ${student.fullName} về lớp ${restoration.restoredClassName} thành công!`,
          };
        } else {
          state.notification = {
            type: 'warning',
            message: `Đã phục hồi học sinh ${student.fullName} ở trạng thái Chưa xếp lớp (lớp cũ không còn hoạt động).`,
          };
        }
      }
    },
    purgeStudent: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      const studentIndex = state.students.findIndex((s) => s.id === studentId);

      if (studentIndex !== -1) {
        const student = state.students[studentIndex];
        // Permanently remove from archive roster
        state.students.splice(studentIndex, 1);
        state.activeModal = 'none';
        state.selectedStudent = null;

        state.notification = {
          type: 'success',
          message: `Đã xoá vĩnh viễn hồ sơ lưu trữ của học sinh ${student.fullName}!`,
        };
      }
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  setSearchQuery,
  setArchivePeriodMonth,
  clearFilters,
  setSort,
  toggleSort,
  openStudentDetailModal,
  openStaffModal,
  openRestoreModal,
  openPurgeModal,
  closeModal,
  restoreStudent,
  purgeStudent,
  clearNotification,
} = archiveSlice.actions;

export default archiveSlice.reducer;
