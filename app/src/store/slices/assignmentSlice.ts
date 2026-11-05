import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AssignmentFilterCriteria,
  AssignmentFormData,
  AssignmentSubmission,
  HomeworkAssignment,
  SubmitGradingFormData,
} from '../../types/assignment.ts';
import {
  mockAssignments,
  mockClassStudents,
  mockSubjects,
  type SubjectItem,
  type StudentEnrollment,
} from '../../services/mockAssignmentData.ts';
import {
  determineInitialStatusOnSave,
  isLateSubmission,
} from '../../utils/assignmentValidation.ts';

export interface AssignmentState {
  assignments: HomeworkAssignment[];
  subjects: SubjectItem[];
  students: StudentEnrollment[];
  selectedAssignmentId: string | null;
  filterCriteria: AssignmentFilterCriteria;
  isFilterDrawerOpen: boolean;
  isSubmitGradingModalOpen: boolean;
  activeStudentSubmission: { assignmentId: string; studentId: string } | null;
  isManageStudentsModalOpen: boolean;
  activeAssignmentIdForStudents: string | null;
}

const initialFilterCriteria: AssignmentFilterCriteria = {
  classId: 'all',
  subjectId: 'all',
  searchQuery: '',
  audienceType: 'all',
  dueDateFilter: 'tat_ca',
  status: 'all',
};

const initialState: AssignmentState = {
  assignments: mockAssignments,
  subjects: mockSubjects,
  students: mockClassStudents,
  selectedAssignmentId: 'asg-001',
  filterCriteria: initialFilterCriteria,
  isFilterDrawerOpen: false,
  isSubmitGradingModalOpen: false,
  activeStudentSubmission: null,
  isManageStudentsModalOpen: false,
  activeAssignmentIdForStudents: null,
};

export const assignmentSlice = createSlice({
  name: 'assignment',
  initialState,
  reducers: {
    setFilterCriteria: (
      state,
      action: PayloadAction<Partial<AssignmentFilterCriteria>>
    ) => {
      state.filterCriteria = {
        ...state.filterCriteria,
        ...action.payload,
      };
    },

    resetFilterCriteria: (state) => {
      state.filterCriteria = initialFilterCriteria;
    },

    setSelectedAssignmentId: (state, action: PayloadAction<string | null>) => {
      state.selectedAssignmentId = action.payload;
    },

    setFilterDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isFilterDrawerOpen = action.payload;
    },

    openSubmitGradingModal: (
      state,
      action: PayloadAction<{ assignmentId: string; studentId: string }>
    ) => {
      state.activeStudentSubmission = action.payload;
      state.isSubmitGradingModalOpen = true;
    },

    closeSubmitGradingModal: (state) => {
      state.activeStudentSubmission = null;
      state.isSubmitGradingModalOpen = false;
    },

    openManageStudentsModal: (state, action: PayloadAction<string>) => {
      state.activeAssignmentIdForStudents = action.payload;
      state.isManageStudentsModalOpen = true;
    },

    closeManageStudentsModal: (state) => {
      state.activeAssignmentIdForStudents = null;
      state.isManageStudentsModalOpen = false;
    },

    createAssignment: (
      state,
      action: PayloadAction<
        AssignmentFormData & { createdBy: string; isDraft?: boolean }
      >
    ) => {
      const payload = action.payload;
      const status = determineInitialStatusOnSave(
        payload.scheduledSendDate,
        payload.isDraft ?? false
      );

      const subject = state.subjects.find((s) => s.id === payload.subjectId);
      const subjectName = subject ? subject.name : 'Môn học';

      // Determine initial student roster
      let targetStudentIds: string[] = [];
      let submissions: AssignmentSubmission[] = [];

      if (payload.audienceType === 'whole_class') {
        const classStudents = state.students.filter(
          (s) => s.classId.toLowerCase() === payload.classId.toLowerCase()
        );
        targetStudentIds = classStudents.map((s) => s.id);
        submissions = classStudents.map((s) => ({
          id: `subm-${Date.now()}-${s.id}`,
          studentId: s.id,
          studentName: s.name,
          studentCode: s.studentCode,
          nickname: s.nickname,
          status: 'chua_nop',
        }));
      } else {
        targetStudentIds = payload.targetStudentIds;
        const selectedStudents = state.students.filter((s) =>
          targetStudentIds.includes(s.id)
        );
        submissions = selectedStudents.map((s) => ({
          id: `subm-${Date.now()}-${s.id}`,
          studentId: s.id,
          studentName: s.name,
          studentCode: s.studentCode,
          nickname: s.nickname,
          status: 'chua_nop',
        }));
      }

      const newAssignment: HomeworkAssignment = {
        id: `asg-${Date.now()}`,
        classId: payload.classId,
        className: `Lớp ${payload.classId.toUpperCase()}`,
        subjectId: payload.subjectId,
        subjectName,
        title: payload.title,
        description: payload.description || '',
        dueDate: payload.dueDate,
        scheduledSendDate: payload.scheduledSendDate,
        status,
        audienceType: payload.audienceType,
        targetStudentIds,
        attachments: payload.attachments || [],
        submissions,
        comments: [],
        createdBy: payload.createdBy || 'Giáo viên',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.assignments.unshift(newAssignment);
      state.selectedAssignmentId = newAssignment.id;
    },

    updateAssignment: (
      state,
      action: PayloadAction<{
        id: string;
        data: Partial<AssignmentFormData>;
        dispatchNow?: boolean;
      }>
    ) => {
      const { id, data, dispatchNow } = action.payload;
      const index = state.assignments.findIndex((a) => a.id === id);
      if (index === -1) return;

      const existing = state.assignments[index];
      let updatedStatus = existing.status;

      if (dispatchNow) {
        updatedStatus = 'da_gui';
      }

      const subject = state.subjects.find((s) => s.id === data.subjectId);

      state.assignments[index] = {
        ...existing,
        ...data,
        // BR11: Keep original title if not supplied or locked
        title: existing.title,
        subjectName: subject ? subject.name : existing.subjectName,
        status: updatedStatus,
        updatedAt: new Date().toISOString(),
      };
    },

    sendAssignment: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const item = state.assignments.find((a) => a.id === id);
      if (item) {
        item.status = 'da_gui';
        item.updatedAt = new Date().toISOString();
      }
    },

    deleteAssignment: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.assignments = state.assignments.filter((a) => a.id !== id);
      if (state.selectedAssignmentId === id) {
        state.selectedAssignmentId =
          state.assignments.length > 0 ? state.assignments[0].id : null;
      }
    },

    submitOnBehalfAndGrade: (
      state,
      action: PayloadAction<
        SubmitGradingFormData & { evaluatedBy?: string }
      >
    ) => {
      const {
        assignmentId,
        studentId,
        submittedAt,
        submissionFile,
        isGraded,
        score,
        teacherComment,
        evaluatedBy,
      } = action.payload;

      const asg = state.assignments.find((a) => a.id === assignmentId);
      if (!asg) return;

      const subIndex = asg.submissions.findIndex(
        (s) => s.studentId === studentId
      );
      if (subIndex === -1) return;

      const isLate = isLateSubmission(submittedAt, asg.dueDate);

      asg.submissions[subIndex] = {
        ...asg.submissions[subIndex],
        status: isGraded ? 'cham_diem' : 'da_nop',
        submittedAt,
        isLate,
        submissionFile: submissionFile || asg.submissions[subIndex].submissionFile,
        score: isGraded ? score : undefined,
        teacherComment: isGraded ? teacherComment : undefined,
        evaluatedAt: isGraded ? new Date().toISOString() : undefined,
        evaluatedBy: isGraded
          ? evaluatedBy || 'Giáo viên phụ trách'
          : undefined,
      };

      asg.updatedAt = new Date().toISOString();
    },

    addStudentToAssignment: (
      state,
      action: PayloadAction<{ assignmentId: string; studentId: string }>
    ) => {
      const { assignmentId, studentId } = action.payload;
      const asg = state.assignments.find((a) => a.id === assignmentId);
      if (!asg) return;

      if (!asg.targetStudentIds.includes(studentId)) {
        asg.targetStudentIds.push(studentId);
      }

      const existingSubmission = asg.submissions.find(
        (s) => s.studentId === studentId
      );
      if (!existingSubmission) {
        const student = state.students.find((s) => s.id === studentId);
        if (student) {
          asg.submissions.push({
            id: `subm-${Date.now()}-${student.id}`,
            studentId: student.id,
            studentName: student.name,
            studentCode: student.studentCode,
            nickname: student.nickname,
            status: 'chua_nop',
          });
        }
      }

      asg.updatedAt = new Date().toISOString();
    },

    removeStudentFromAssignment: (
      state,
      action: PayloadAction<{ assignmentId: string; studentId: string }>
    ) => {
      const { assignmentId, studentId } = action.payload;
      const asg = state.assignments.find((a) => a.id === assignmentId);
      if (!asg) return;

      asg.targetStudentIds = asg.targetStudentIds.filter(
        (id) => id !== studentId
      );
      asg.submissions = asg.submissions.filter(
        (s) => s.studentId !== studentId
      );
      asg.updatedAt = new Date().toISOString();
    },

    addAssignmentComment: (
      state,
      action: PayloadAction<{
        assignmentId: string;
        authorName: string;
        authorRole: 'teacher' | 'parent' | 'admin';
        content: string;
      }>
    ) => {
      const { assignmentId, authorName, authorRole, content } = action.payload;
      const asg = state.assignments.find((a) => a.id === assignmentId);
      if (!asg) return;

      asg.comments.push({
        id: `cmt-${Date.now()}`,
        assignmentId,
        authorId: `usr-${Date.now()}`,
        authorName,
        authorRole,
        content,
        createdAt: new Date().toISOString(),
      });

      asg.updatedAt = new Date().toISOString();
    },
  },
});

export const {
  setFilterCriteria,
  resetFilterCriteria,
  setSelectedAssignmentId,
  setFilterDrawerOpen,
  openSubmitGradingModal,
  closeSubmitGradingModal,
  openManageStudentsModal,
  closeManageStudentsModal,
  createAssignment,
  updateAssignment,
  sendAssignment,
  deleteAssignment,
  submitOnBehalfAndGrade,
  addStudentToAssignment,
  removeStudentFromAssignment,
  addAssignmentComment,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
