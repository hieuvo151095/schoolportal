import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Teacher,
  TeacherFilterState,
  TeacherPermissionTier,
  TeacherWorkingStatus,
  AssignedClassItem,
} from '../../types/teacher.ts';
import { mockTeachers } from '../../services/mockTeacherData.ts';

export interface TeacherState {
  teachers: Teacher[];
  filter: TeacherFilterState;
  selectedTeacherId: string | null;
  loading: boolean;
  activeModal: 'none' | 'changeEmail' | 'assignClass' | 'delete' | 'extendedFilter';
  modalTargetTeacherId: string | null;
}

const initialFilter: TeacherFilterState = {
  search: '',
  classId: 'all',
  permissionTier: 'all',
  status: 'all',
  csdlSoOnly: false,
};

const initialState: TeacherState = {
  teachers: mockTeachers,
  filter: initialFilter,
  selectedTeacherId: null,
  loading: false,
  activeModal: 'none',
  modalTargetTeacherId: null,
};

export const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    setTeachers: (state, action: PayloadAction<Teacher[]>) => {
      state.teachers = action.payload;
    },
    addTeacher: (
      state,
      action: PayloadAction<Omit<Teacher, 'id' | 'createdAt'>>
    ) => {
      const newId = `gv-${Date.now().toString().slice(-4)}`;
      const now = new Date().toISOString();
      state.teachers.unshift({
        ...action.payload,
        id: newId,
        createdAt: now,
      });
    },
    updateTeacher: (state, action: PayloadAction<Partial<Teacher> & { id: string }>) => {
      const idx = state.teachers.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.teachers[idx] = {
          ...state.teachers[idx],
          ...action.payload,
        };
      }
    },
    changeTeacherEmail: (
      state,
      action: PayloadAction<{ teacherId: string; newEmail: string }>
    ) => {
      const teacher = state.teachers.find((t) => t.id === action.payload.teacherId);
      if (teacher) {
        teacher.email = action.payload.newEmail.trim();
      }
    },
    assignClasses: (
      state,
      action: PayloadAction<{
        teacherId: string;
        homeroomClassId?: string;
        homeroomClassName?: string;
        assignedClasses: AssignedClassItem[];
      }>
    ) => {
      const { teacherId, homeroomClassId, homeroomClassName, assignedClasses } = action.payload;
      // If a new homeroom class is set, remove homeroom status from other teachers who had it
      if (homeroomClassId) {
        state.teachers.forEach((t) => {
          if (t.id !== teacherId && t.homeroomClassId === homeroomClassId) {
            t.homeroomClassId = undefined;
            t.homeroomClassName = undefined;
          }
        });
      }

      const teacher = state.teachers.find((t) => t.id === teacherId);
      if (teacher) {
        teacher.homeroomClassId = homeroomClassId;
        teacher.homeroomClassName = homeroomClassName;
        teacher.assignedClasses = assignedClasses;
      }
    },
    changeTeacherStatus: (
      state,
      action: PayloadAction<{ teacherId: string; status: TeacherWorkingStatus }>
    ) => {
      const teacher = state.teachers.find((t) => t.id === action.payload.teacherId);
      if (teacher) {
        teacher.status = action.payload.status;
      }
    },
    changePermissionTier: (
      state,
      action: PayloadAction<{ teacherId: string; permissionTier: TeacherPermissionTier }>
    ) => {
      const teacher = state.teachers.find((t) => t.id === action.payload.teacherId);
      if (teacher) {
        teacher.permissionTier = action.payload.permissionTier;
      }
    },
    deleteTeacher: (state, action: PayloadAction<string>) => {
      state.teachers = state.teachers.filter((t) => t.id !== action.payload);
      if (state.selectedTeacherId === action.payload) {
        state.selectedTeacherId = null;
      }
    },
    setFilter: (state, action: PayloadAction<Partial<TeacherFilterState>>) => {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    resetFilter: (state) => {
      state.filter = initialFilter;
    },
    selectTeacher: (state, action: PayloadAction<string | null>) => {
      state.selectedTeacherId = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{
        modal: 'changeEmail' | 'assignClass' | 'delete' | 'extendedFilter';
        teacherId?: string;
      }>
    ) => {
      state.activeModal = action.payload.modal;
      state.modalTargetTeacherId = action.payload.teacherId || null;
    },
    closeModal: (state) => {
      state.activeModal = 'none';
      state.modalTargetTeacherId = null;
    },
  },
});

export const {
  setTeachers,
  addTeacher,
  updateTeacher,
  changeTeacherEmail,
  assignClasses,
  changeTeacherStatus,
  changePermissionTier,
  deleteTeacher,
  setFilter,
  resetFilter,
  selectTeacher,
  openModal,
  closeModal,
} = teacherSlice.actions;

export default teacherSlice.reducer;
