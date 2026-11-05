/**
 * Redux Toolkit State Machine for Academics Gradebook & Evaluation Sheets (Điểm & Đánh Giá)
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ClassGradebookRecord,
  GradebookFilterCriteria,
  EvaluationParadigm,
  SubjectScoreRecord,
  TermSummaryRecord,
  DevelopmentalRubricRecord,
  RubricRating,
  AcademicResultLevel,
  ConductResultLevel
} from '../../types/gradebook.ts';
import {
  mockClassGradebooks,
  mockSubjectScores6A1,
  mockTermSummary6A1,
  mockDevelopmentalRubricsMam
} from '../../services/mockGradebookData.ts';
import { calculateTBHK, determineRubricCompletion } from '../../utils/gradebookValidation.ts';

interface GradebookState {
  classes: ClassGradebookRecord[];
  activeParadigm: EvaluationParadigm;
  selectedClassId: string;
  selectedTermId: string;
  selectedSubjectId: string;
  filterCriteria: GradebookFilterCriteria;
  subjectScores: Record<string, SubjectScoreRecord[]>;
  termSummaries: Record<string, TermSummaryRecord[]>;
  developmentalRubrics: Record<string, DevelopmentalRubricRecord[]>;
  isFilterModalOpen: boolean;
  isRubricModalOpen: boolean;
  activeRubricStudentId: string | null;
  hideNotes: boolean;
}

const initialScoresMap: Record<string, SubjectScoreRecord[]> = {
  'c-6a1_t-6a1-hk1-mid_sub-toan-6': mockSubjectScores6A1,
  'c-6a1_t-6a1-hk1-final_sub-toan-6': mockSubjectScores6A1,
  'c-12a1_t-12a1-hk1-mid_sub-toan-12': mockSubjectScores6A1.map(s => ({
    ...s,
    studentCode: s.studentCode.replace('6', '12')
  }))
};

const initialSummariesMap: Record<string, TermSummaryRecord[]> = {
  'c-6a1_t-6a1-hk1-mid': mockTermSummary6A1,
  'c-6a1_t-6a1-hk1-final': mockTermSummary6A1,
  'c-12a1_t-12a1-hk1-mid': mockTermSummary6A1.map(s => ({
    ...s,
    studentCode: s.studentCode.replace('6', '12')
  }))
};

const initialRubricsMap: Record<string, DevelopmentalRubricRecord[]> = {
  'c-mam_t-mam-p1': mockDevelopmentalRubricsMam,
  'c-mam_t-mam-p2': mockDevelopmentalRubricsMam,
  'c-mam_t-mam-p3': mockDevelopmentalRubricsMam
};

const initialCriteria: GradebookFilterCriteria = {
  searchQuery: '',
  gradeLevel: 'Tất cả khối',
  homeroomTeacher: 'Tất cả giáo viên',
  academicYear: 'Năm học 2025 - 2026'
};

const initialState: GradebookState = {
  classes: mockClassGradebooks,
  activeParadigm: 'numeric_gradebook',
  selectedClassId: 'c-6a1',
  selectedTermId: 't-6a1-hk1-mid',
  selectedSubjectId: 'sub-toan-6',
  filterCriteria: initialCriteria,
  subjectScores: initialScoresMap,
  termSummaries: initialSummariesMap,
  developmentalRubrics: initialRubricsMap,
  isFilterModalOpen: false,
  isRubricModalOpen: false,
  activeRubricStudentId: null,
  hideNotes: false
};

const gradebookSlice = createSlice({
  name: 'gradebook',
  initialState,
  reducers: {
    setActiveParadigm(state, action: PayloadAction<EvaluationParadigm>) {
      state.activeParadigm = action.payload;
    },
    setSelectedClassId(state, action: PayloadAction<string>) {
      state.selectedClassId = action.payload;
    },
    setSelectedTermId(state, action: PayloadAction<string>) {
      state.selectedTermId = action.payload;
    },
    setSelectedSubjectId(state, action: PayloadAction<string>) {
      state.selectedSubjectId = action.payload;
    },
    setFilterCriteria(state, action: PayloadAction<Partial<GradebookFilterCriteria>>) {
      state.filterCriteria = { ...state.filterCriteria, ...action.payload };
    },
    resetFilterCriteria(state) {
      state.filterCriteria = initialCriteria;
    },
    setFilterModalOpen(state, action: PayloadAction<boolean>) {
      state.isFilterModalOpen = action.payload;
    },
    toggleHideNotes(state) {
      state.hideNotes = !state.hideNotes;
    },
    openRubricModal(state, action: PayloadAction<string>) {
      state.activeRubricStudentId = action.payload;
      state.isRubricModalOpen = true;
    },
    closeRubricModal(state) {
      state.isRubricModalOpen = false;
      state.activeRubricStudentId = null;
    },

    /**
     * Updates an individual student's subject score and recalculates TBHK.
     */
    updateStudentScore(
      state,
      action: PayloadAction<{
        classId: string;
        termId: string;
        subjectId: string;
        studentId: string;
        txIndex?: number;
        txScore?: number | null;
        gkScore?: number | null;
        ckScore?: number | null;
        note?: string;
      }>
    ) {
      const key = `${action.payload.classId}_${action.payload.termId}_${action.payload.subjectId}`;
      let roster = state.subjectScores[key];

      // Auto-hydrate fallback roster if not initialized
      if (!roster) {
        roster = JSON.parse(JSON.stringify(mockSubjectScores6A1));
        state.subjectScores[key] = roster;
      }

      const studentIndex = roster.findIndex(s => s.studentId === action.payload.studentId);
      if (studentIndex !== -1) {
        const student = roster[studentIndex];

        if (action.payload.txIndex !== undefined && action.payload.txScore !== undefined) {
          student.txScores[action.payload.txIndex] = action.payload.txScore;
        }
        if (action.payload.gkScore !== undefined) {
          student.gkScore = action.payload.gkScore;
        }
        if (action.payload.ckScore !== undefined) {
          student.ckScore = action.payload.ckScore;
        }
        if (action.payload.note !== undefined) {
          student.note = action.payload.note;
        }

        // Real-time automatic recalculation of semester TBHK
        student.tbhk = calculateTBHK(student.txScores, student.gkScore, student.ckScore);
      }
    },

    /**
     * Updates student homeroom summary record.
     */
    updateTermSummaryRecord(
      state,
      action: PayloadAction<{
        classId: string;
        termId: string;
        studentId: string;
        academicResult?: AcademicResultLevel;
        conductResult?: ConductResultLevel;
        excusedAbsence?: number;
        unexcusedAbsence?: number;
        homeroomComment?: string;
      }>
    ) {
      const key = `${action.payload.classId}_${action.payload.termId}`;
      let roster = state.termSummaries[key];

      if (!roster) {
        roster = JSON.parse(JSON.stringify(mockTermSummary6A1));
        state.termSummaries[key] = roster;
      }

      const studentIndex = roster.findIndex(s => s.studentId === action.payload.studentId);
      if (studentIndex !== -1) {
        const student = roster[studentIndex];
        if (action.payload.academicResult) student.academicResult = action.payload.academicResult;
        if (action.payload.conductResult) student.conductResult = action.payload.conductResult;
        if (action.payload.excusedAbsence !== undefined) student.excusedAbsence = action.payload.excusedAbsence;
        if (action.payload.unexcusedAbsence !== undefined) student.unexcusedAbsence = action.payload.unexcusedAbsence;
        if (action.payload.homeroomComment !== undefined) student.homeroomComment = action.payload.homeroomComment;
      }
    },

    /**
     * Updates early childhood developmental rubrics for an individual student.
     */
    updateDevelopmentalRubric(
      state,
      action: PayloadAction<{
        classId: string;
        termId: string;
        studentId: string;
        coreCompetencies?: Record<string, RubricRating>;
        specificCompetencies?: Record<string, RubricRating>;
        primaryQualities?: Record<string, RubricRating>;
        excusedAbsence?: number;
        unexcusedAbsence?: number;
        healthStatus?: string;
        generalComment?: string;
      }>
    ) {
      const key = `${action.payload.classId}_${action.payload.termId}`;
      let roster = state.developmentalRubrics[key];

      if (!roster) {
        roster = JSON.parse(JSON.stringify(mockDevelopmentalRubricsMam));
        state.developmentalRubrics[key] = roster;
      }

      const studentIndex = roster.findIndex(s => s.studentId === action.payload.studentId);
      if (studentIndex !== -1) {
        const student = roster[studentIndex];
        if (action.payload.coreCompetencies) {
          student.coreCompetencies = { ...student.coreCompetencies, ...action.payload.coreCompetencies };
        }
        if (action.payload.specificCompetencies) {
          student.specificCompetencies = { ...student.specificCompetencies, ...action.payload.specificCompetencies };
        }
        if (action.payload.primaryQualities) {
          student.primaryQualities = { ...student.primaryQualities, ...action.payload.primaryQualities };
        }
        if (action.payload.excusedAbsence !== undefined) student.excusedAbsence = action.payload.excusedAbsence;
        if (action.payload.unexcusedAbsence !== undefined) student.unexcusedAbsence = action.payload.unexcusedAbsence;
        if (action.payload.healthStatus !== undefined) student.healthStatus = action.payload.healthStatus;
        if (action.payload.generalComment !== undefined) student.generalComment = action.payload.generalComment;

        // Auto-check completion
        const coreCount = Object.keys(student.coreCompetencies).length;
        const specCount = Object.keys(student.specificCompetencies).length;
        const qualCount = Object.keys(student.primaryQualities).length;
        student.isCompleted = determineRubricCompletion(coreCount, specCount, qualCount);
      }
    },

    /**
     * Publishes evaluation term session.
     */
    publishTermSession(
      state,
      action: PayloadAction<{
        classId: string;
        termId: string;
        publishedAt?: string;
      }>
    ) {
      const cls = state.classes.find(c => c.classId === action.payload.classId);
      if (cls) {
        const term = cls.terms.find(t => t.termId === action.payload.termId);
        if (term) {
          term.status = 'da_cong_bo';
          term.publishedAt = action.payload.publishedAt || new Date().toLocaleDateString('vi-VN');
          term.completedStudents = term.totalStudents;
        }
      }
    }
  }
});

export const {
  setActiveParadigm,
  setSelectedClassId,
  setSelectedTermId,
  setSelectedSubjectId,
  setFilterCriteria,
  resetFilterCriteria,
  setFilterModalOpen,
  toggleHideNotes,
  openRubricModal,
  closeRubricModal,
  updateStudentScore,
  updateTermSummaryRecord,
  updateDevelopmentalRubric,
  publishTermSession
} = gradebookSlice.actions;

export default gradebookSlice.reducer;
