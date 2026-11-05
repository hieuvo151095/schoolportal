import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ClassItem,
  GradeLevel,
  ClassTaxonomy,
  ClassFilterState,
  ClassFormData,
  ClassStatus,
} from '../../types/class.ts';
import {
  MOCK_CLASSES,
  MOCK_GRADE_LEVELS,
  MOCK_AVAILABLE_TEACHERS,
} from '../../services/mockClassData.ts';

interface ClassState {
  classes: ClassItem[];
  gradeLevels: GradeLevel[];
  activeTaxonomy: ClassTaxonomy;
  filterCriteria: ClassFilterState;
  selectedClassId: string | null;
  isFormModalOpen: boolean;
  isDeleteModalOpen: boolean;
  formMode: 'create' | 'edit';
  editingClassId: string | null;
  classToDelete: ClassItem | null;
}

const initialFilter: ClassFilterState = {
  searchQuery: '',
  taxonomy: 'chinh_khoa',
  academicYear: '2025-2026',
};

const initialState: ClassState = {
  classes: MOCK_CLASSES,
  gradeLevels: MOCK_GRADE_LEVELS,
  activeTaxonomy: 'chinh_khoa',
  filterCriteria: initialFilter,
  selectedClassId: null,
  isFormModalOpen: false,
  isDeleteModalOpen: false,
  formMode: 'create',
  editingClassId: null,
  classToDelete: null,
};

export const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    setActiveTaxonomy: (state, action: PayloadAction<ClassTaxonomy>) => {
      state.activeTaxonomy = action.payload;
      state.filterCriteria.taxonomy = action.payload;
      // If switching to extracurricular, reset grade level filter
      if (action.payload === 'ngoai_khoa') {
        state.filterCriteria.gradeLevelId = undefined;
      }
    },

    setFilterCriteria: (state, action: PayloadAction<Partial<ClassFilterState>>) => {
      state.filterCriteria = {
        ...state.filterCriteria,
        ...action.payload,
      };
    },

    resetFilterCriteria: (state) => {
      state.filterCriteria = {
        searchQuery: '',
        taxonomy: state.activeTaxonomy,
        academicYear: '2025-2026',
      };
    },

    selectClass: (state, action: PayloadAction<string | null>) => {
      state.selectedClassId = action.payload;
    },

    openCreateModal: (state) => {
      state.formMode = 'create';
      state.editingClassId = null;
      state.isFormModalOpen = true;
    },

    openEditModal: (state, action: PayloadAction<string>) => {
      state.formMode = 'edit';
      state.editingClassId = action.payload;
      state.isFormModalOpen = true;
    },

    closeFormModal: (state) => {
      state.isFormModalOpen = false;
      state.editingClassId = null;
    },

    openDeleteModal: (state, action: PayloadAction<string>) => {
      const targetClass = state.classes.find((c) => c.id === action.payload);
      if (targetClass) {
        state.classToDelete = targetClass;
        state.isDeleteModalOpen = true;
      }
    },

    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
      state.classToDelete = null;
    },

    addClass: (state, action: PayloadAction<ClassFormData>) => {
      const payload = action.payload;
      const newId = `cls-${Date.now()}`;
      const now = new Date().toISOString();

      let homeroomTeacherName: string | undefined;
      let homeroomTeacherPhone: string | undefined;
      let homeroomTeacherAvatar: string | undefined;

      if (payload.homeroomTeacherId) {
        const teacher = MOCK_AVAILABLE_TEACHERS.find((t) => t.id === payload.homeroomTeacherId);
        if (teacher) {
          homeroomTeacherName = teacher.name;
          homeroomTeacherPhone = teacher.phone;
          homeroomTeacherAvatar = teacher.avatar;
        }
      }

      let gradeName: string | undefined;
      if (payload.gradeLevelId) {
        const grade = state.gradeLevels.find((g) => g.id === payload.gradeLevelId);
        if (grade) {
          gradeName = grade.name;
        }
      }

      const newClass: ClassItem = {
        id: newId,
        schoolCode: 'demo',
        name: payload.name.trim(),
        code: payload.code.trim().toUpperCase(),
        taxonomy: payload.taxonomy,
        gradeLevelId: payload.gradeLevelId,
        gradeName,
        academicYear: payload.academicYear || '2025-2026',
        roomNumber: payload.roomNumber?.trim(),
        maxCapacity: Number(payload.maxCapacity) || 30,
        studentCount: 0,
        homeroomTeacherId: payload.homeroomTeacherId,
        homeroomTeacherName,
        homeroomTeacherPhone,
        homeroomTeacherAvatar,
        instructors: payload.instructors,
        clubCategory: payload.clubCategory,
        meetingSchedule: payload.meetingSchedule,
        status: payload.status || 'dang_hoat_dong',
        csdlStatus: 'chua_lien_ket',
        notes: payload.notes?.trim(),
        createdAt: now,
        updatedAt: now,
      };

      state.classes.unshift(newClass);
      state.isFormModalOpen = false;
    },

    updateClass: (
      state,
      action: PayloadAction<{ id: string; data: Partial<ClassFormData> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.classes.findIndex((c) => c.id === id);
      if (index !== -1) {
        const current = state.classes[index];
        const now = new Date().toISOString();

        let homeroomTeacherName = current.homeroomTeacherName;
        let homeroomTeacherPhone = current.homeroomTeacherPhone;
        let homeroomTeacherAvatar = current.homeroomTeacherAvatar;

        if (data.homeroomTeacherId !== undefined) {
          if (data.homeroomTeacherId) {
            const teacher = MOCK_AVAILABLE_TEACHERS.find((t) => t.id === data.homeroomTeacherId);
            if (teacher) {
              homeroomTeacherName = teacher.name;
              homeroomTeacherPhone = teacher.phone;
              homeroomTeacherAvatar = teacher.avatar;
            }
          } else {
            homeroomTeacherName = undefined;
            homeroomTeacherPhone = undefined;
            homeroomTeacherAvatar = undefined;
          }
        }

        let gradeName = current.gradeName;
        if (data.gradeLevelId !== undefined) {
          if (data.gradeLevelId) {
            const grade = state.gradeLevels.find((g) => g.id === data.gradeLevelId);
            if (grade) {
              gradeName = grade.name;
            }
          } else {
            gradeName = undefined;
          }
        }

        state.classes[index] = {
          ...current,
          ...data,
          code: data.code ? data.code.trim().toUpperCase() : current.code,
          name: data.name ? data.name.trim() : current.name,
          maxCapacity: data.maxCapacity !== undefined ? Number(data.maxCapacity) : current.maxCapacity,
          gradeName,
          homeroomTeacherName,
          homeroomTeacherPhone,
          homeroomTeacherAvatar,
          updatedAt: now,
        };
      }
      state.isFormModalOpen = false;
    },

    deleteClass: (state, action: PayloadAction<string>) => {
      const classId = action.payload;
      const targetClass = state.classes.find((c) => c.id === classId);
      // STRICT INVARIANT: Only delete if studentCount === 0 (BR02 / Resolution K026)
      if (targetClass && targetClass.studentCount === 0) {
        state.classes = state.classes.filter((c) => c.id !== classId);
        if (state.selectedClassId === classId) {
          state.selectedClassId = null;
        }
      }
      state.isDeleteModalOpen = false;
      state.classToDelete = null;
    },

    changeClassStatus: (
      state,
      action: PayloadAction<{ id: string; status: ClassStatus }>
    ) => {
      const { id, status } = action.payload;
      const targetClass = state.classes.find((c) => c.id === id);
      if (targetClass) {
        targetClass.status = status;
        targetClass.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  setActiveTaxonomy,
  setFilterCriteria,
  resetFilterCriteria,
  selectClass,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteModal,
  closeDeleteModal,
  addClass,
  updateClass,
  deleteClass,
  changeClassStatus,
} = classSlice.actions;

export default classSlice.reducer;
