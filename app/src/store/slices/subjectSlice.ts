/**
 * Redux Toolkit Slice for School Subject Management (Môn Học)
 * Feature ID: 037-school-subject-management-mon-hoc
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  SubjectState,
  EducationStage,
  AssignTeacherPayload,
  UnassignTeacherPayload,
  SubjectTeacherAssignment
} from '../../types/subject.ts';
import { INITIAL_SCHOOL_SUBJECTS } from '../../services/mockSubjectData.ts';

const initialState: SubjectState = {
  subjects: INITIAL_SCHOOL_SUBJECTS,
  activeStage: 'TH',
  selectedAcademicYear: '2025-2026',
  filter: {
    searchQuery: '',
    stage: 'TH',
    academicYear: '2025-2026',
    gradeLevel: 'all',
    classification: 'all',
    type: 'all'
  },
  selectedSubjectId: null,
  isDetailDrawerOpen: false,
  isAssignTeacherModalOpen: false,
  isUnassignTeacherModalOpen: false,
  teacherToUnassign: null,
  loading: false,
  error: null
};

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    setActiveStage: (state, action: PayloadAction<EducationStage>) => {
      state.activeStage = action.payload;
      state.filter.stage = action.payload;
      state.filter.gradeLevel = 'all'; // Reset grade filter when switching stage
    },

    setSelectedAcademicYear: (state, action: PayloadAction<string>) => {
      state.selectedAcademicYear = action.payload;
      state.filter.academicYear = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filter.searchQuery = action.payload;
    },

    setGradeLevelFilter: (state, action: PayloadAction<string>) => {
      state.filter.gradeLevel = action.payload;
    },

    setClassificationFilter: (state, action: PayloadAction<string>) => {
      state.filter.classification = action.payload;
    },

    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.filter.type = action.payload;
    },

    resetFilters: (state) => {
      state.filter = {
        searchQuery: '',
        stage: state.activeStage,
        academicYear: state.selectedAcademicYear,
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      };
    },

    openDetailDrawer: (state, action: PayloadAction<string>) => {
      state.selectedSubjectId = action.payload;
      state.isDetailDrawerOpen = true;
    },

    closeDetailDrawer: (state) => {
      state.isDetailDrawerOpen = false;
    },

    openAssignTeacherModal: (state, action: PayloadAction<string>) => {
      state.selectedSubjectId = action.payload;
      state.isAssignTeacherModalOpen = true;
    },

    closeAssignTeacherModal: (state) => {
      state.isAssignTeacherModalOpen = false;
    },

    openUnassignTeacherModal: (
      state,
      action: PayloadAction<{
        subjectId: string;
        subjectName: string;
        teacher: SubjectTeacherAssignment;
      }>
    ) => {
      state.teacherToUnassign = action.payload;
      state.isUnassignTeacherModalOpen = true;
    },

    closeUnassignTeacherModal: (state) => {
      state.teacherToUnassign = null;
      state.isUnassignTeacherModalOpen = false;
    },

    assignTeacherToSubject: (state, action: PayloadAction<AssignTeacherPayload>) => {
      const {
        subjectId,
        teacherId,
        teacherName,
        teacherCode,
        avatarUrl,
        phone,
        email,
        assignedClasses = []
      } = action.payload;

      const subject = state.subjects.find((s) => s.id === subjectId);
      if (subject) {
        const alreadyAssigned = subject.assignedTeachers.some(
          (t) => t.teacherId === teacherId
        );
        if (!alreadyAssigned) {
          subject.assignedTeachers.push({
            teacherId,
            teacherName,
            teacherCode,
            avatarUrl,
            phone,
            email,
            assignedClasses,
            assignedClassesCount: assignedClasses.length > 0 ? assignedClasses.length : 1,
            assignedAt: new Date().toISOString()
          });
        }
      }
      state.isAssignTeacherModalOpen = false;
    },

    unassignTeacherFromSubject: (state, action: PayloadAction<UnassignTeacherPayload>) => {
      const { subjectId, teacherId } = action.payload;
      const subject = state.subjects.find((s) => s.id === subjectId);
      if (subject) {
        subject.assignedTeachers = subject.assignedTeachers.filter(
          (t) => t.teacherId !== teacherId
        );
      }
      state.teacherToUnassign = null;
      state.isUnassignTeacherModalOpen = false;
    }
  }
});

export const {
  setActiveStage,
  setSelectedAcademicYear,
  setSearchQuery,
  setGradeLevelFilter,
  setClassificationFilter,
  setTypeFilter,
  resetFilters,
  openDetailDrawer,
  closeDetailDrawer,
  openAssignTeacherModal,
  closeAssignTeacherModal,
  openUnassignTeacherModal,
  closeUnassignTeacherModal,
  assignTeacherToSubject,
  unassignTeacherFromSubject
} = subjectSlice.actions;

export default subjectSlice.reducer;
