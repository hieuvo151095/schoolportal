/**
 * Automated Unit Test Suite for School Subject Management (Môn Học)
 * Feature ID: 037-school-subject-management-mon-hoc
 * Standard Reference: MoET Circulars 32/2018, 27/2020, 22/2021
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeVietnameseText,
  filterSubjects,
  getUnassignedTeachers,
  calculateSubjectKPIs,
  canDeleteSubject,
  formatEvaluationType,
  formatClassification,
  formatSubjectType,
  getStageName
} from '../../src/utils/subjectValidation.ts';

import {
  INITIAL_SCHOOL_SUBJECTS,
  STAGE_CONFIGS,
  ACADEMIC_YEARS
} from '../../src/services/mockSubjectData.ts';

import subjectReducer, {
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
} from '../../src/store/slices/subjectSlice.ts';

describe('School Subject Management (Nhà Trường — Môn Học) Business Rules & Engine', () => {
  // =========================================================================
  // 1. Accent-Insensitive Vietnamese Search (BR05)
  // =========================================================================
  describe('BR05: Accent-Insensitive Vietnamese Search', () => {
    it('normalizes diacritics, accents, and the letter đ/Đ correctly', () => {
      assert.equal(normalizeVietnameseText('Toán học'), 'toan hoc');
      assert.equal(normalizeVietnameseText('Đạo đức'), 'dao duc');
      assert.equal(normalizeVietnameseText('Lịch sử và Địa lí'), 'lich su va dia li');
      assert.equal(normalizeVietnameseText('Ngữ văn 10'), 'ngu van 10');
      assert.equal(normalizeVietnameseText('  Mĩ thuật  '), 'mi thuat');
      assert.equal(normalizeVietnameseText(''), '');
    });

    it('matches subject names and codes without diacritic friction', () => {
      const filter = {
        searchQuery: 'toan',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      };
      const results = filterSubjects(INITIAL_SCHOOL_SUBJECTS, filter);
      assert.ok(results.length > 0);
      assert.ok(results.some((s) => s.name === 'Toán học'));
    });

    it('matches subject by code substring (case and accent insensitive)', () => {
      const filter = {
        searchQuery: 'th-tv',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      };
      const results = filterSubjects(INITIAL_SCHOOL_SUBJECTS, filter);
      assert.equal(results.length, 1);
      assert.equal(results[0].code, 'TH-TV');
    });

    it('returns empty array when search query matches no subjects', () => {
      const filter = {
        searchQuery: 'mon_hoc_khong_ton_tai_xyz',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      };
      const results = filterSubjects(INITIAL_SCHOOL_SUBJECTS, filter);
      assert.equal(results.length, 0);
    });
  });

  // =========================================================================
  // 2. 4-Stage Partitioning and Grade Filtering (BR01, BR02, BR11)
  // =========================================================================
  describe('BR01, BR02, BR11: Educational Stage Partitioning and Filtering', () => {
    it('strictly partitions subjects across 4 educational stages without cross-contamination', () => {
      const thSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      });
      const thcsSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'THCS',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      });
      const thptSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'THPT',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      });
      const gdtxSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'GDTX',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      });

      assert.ok(thSubjects.length > 0);
      assert.ok(thcsSubjects.length > 0);
      assert.ok(thptSubjects.length > 0);
      assert.ok(gdtxSubjects.length > 0);

      // Verify no TH subject has stage other than TH
      assert.ok(thSubjects.every((s) => s.stage === 'TH'));
      assert.ok(thcsSubjects.every((s) => s.stage === 'THCS'));
      assert.ok(thptSubjects.every((s) => s.stage === 'THPT'));
      assert.ok(gdtxSubjects.every((s) => s.stage === 'GDTX'));
    });

    it('filters subjects by applicable grade level within the active stage', () => {
      const grade1Subjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'Khối 1',
        classification: 'all',
        type: 'all'
      });

      // Khoa học is only for grades 4 & 5, so it should not appear for Khối 1
      assert.ok(!grade1Subjects.some((s) => s.code === 'TH-KH'));
      // Toán and Tiếng Việt must appear for Khối 1
      assert.ok(grade1Subjects.some((s) => s.code === 'TH-TOAN'));
      assert.ok(grade1Subjects.some((s) => s.code === 'TH-TV'));
    });

    it('filters subjects by academic year', () => {
      const yearSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      });
      assert.ok(yearSubjects.every((s) => s.academicYear === '2025-2026'));

      const emptyYearSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'TH',
        academicYear: '1999-2000',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      });
      assert.equal(emptyYearSubjects.length, 0);
    });

    it('filters subjects by classification and type', () => {
      const activitySubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'hoat_dong_giao_duc',
        type: 'all'
      });
      assert.ok(activitySubjects.every((s) => s.classification === 'hoat_dong_giao_duc'));
      assert.ok(activitySubjects.some((s) => s.code === 'TH-HDTN'));

      const electiveSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'THPT',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'lua_chon'
      });
      assert.ok(electiveSubjects.every((s) => s.type === 'lua_chon'));
      assert.ok(electiveSubjects.some((s) => s.code === 'THPT-VL'));
    });
  });

  // =========================================================================
  // 3. Summary KPIs Calculation (FR-002)
  // =========================================================================
  describe('FR-002: Subject Summary KPIs Calculation', () => {
    it('calculates total subjects, graded subjects, comment subjects, and unique teachers', () => {
      const thSubjects = filterSubjects(INITIAL_SCHOOL_SUBJECTS, {
        searchQuery: '',
        stage: 'TH',
        academicYear: '2025-2026',
        gradeLevel: 'all',
        classification: 'all',
        type: 'all'
      });

      const kpis = calculateSubjectKPIs(thSubjects);
      assert.equal(kpis.totalSubjects, thSubjects.length);
      assert.equal(
        kpis.gradedSubjectsCount,
        thSubjects.filter((s) => s.isCountedForGPA).length
      );
      assert.equal(
        kpis.commentSubjectsCount,
        thSubjects.filter((s) => !s.isCountedForGPA).length
      );
      assert.equal(
        kpis.totalSubjects,
        kpis.gradedSubjectsCount + kpis.commentSubjectsCount
      );
      assert.ok(kpis.assignedTeachersCount > 0);
    });
  });

  // =========================================================================
  // 4. MoET Subject Catalog Protection Invariant (BR06, K029)
  // =========================================================================
  describe('BR06, K029: Standard MoET Subject Catalog Protection', () => {
    it('forbids deleting standard MoET curriculum subjects', () => {
      const standardSubject = INITIAL_SCHOOL_SUBJECTS.find((s) => s.isStandardMoET);
      assert.ok(standardSubject);

      const check = canDeleteSubject(standardSubject);
      assert.equal(check.canDelete, false);
      assert.match(check.reason, /Bộ GD&ĐT/);
    });

    it('permits deleting custom elective subjects created by school', () => {
      const customSubject = {
        ...INITIAL_SCHOOL_SUBJECTS[0],
        id: 'sub-cust-001',
        isStandardMoET: false,
        isCustom: true
      };

      const check = canDeleteSubject(customSubject);
      assert.equal(check.canDelete, true);
    });
  });

  // =========================================================================
  // 5. 4-Term Assessment Matrix Completeness (BR08, K031)
  // =========================================================================
  describe('BR08, K031: 4-Term Assessment Matrix Completeness', () => {
    it('asserts every subject has complete 4-milestone assessment evaluation matrix', () => {
      INITIAL_SCHOOL_SUBJECTS.forEach((subject) => {
        assert.ok(subject.evaluationMatrix, `Subject ${subject.code} must have evaluationMatrix`);
        assert.ok(subject.evaluationMatrix.term1_mid, `Missing term1_mid for ${subject.code}`);
        assert.ok(subject.evaluationMatrix.term1_end, `Missing term1_end for ${subject.code}`);
        assert.ok(subject.evaluationMatrix.term2_mid, `Missing term2_mid for ${subject.code}`);
        assert.ok(subject.evaluationMatrix.term2_end, `Missing term2_end for ${subject.code}`);
      });
    });

    it('formats evaluation types into human-readable Vietnamese labels', () => {
      assert.equal(formatEvaluationType('score'), 'Điểm số (0-10)');
      assert.equal(formatEvaluationType('level'), 'Mức đánh giá (HTT/HT/CHT)');
      assert.equal(formatEvaluationType('comment'), 'Nhận xét');
      assert.equal(formatEvaluationType('score_comment'), 'Điểm số & Nhận xét');
    });
  });

  // =========================================================================
  // 6. Teacher Assignment Governance & Unassigned Filter (BR07, BR09, BR10)
  // =========================================================================
  describe('BR07, BR09, BR10: Teacher Assignment Governance', () => {
    const sampleTeachers = [
      { id: 'gv-001', name: 'Nguyễn Thị Mai' },
      { id: 'gv-002', name: 'Trần Văn Dũng' },
      { id: 'gv-003', name: 'Lê Hoàng Yến' },
      { id: 'gv-004', name: 'Phạm Quỳnh Nga' }
    ];

    it('excludes teachers already assigned to the target subject (BR09)', () => {
      const assignedToMath = [
        {
          teacherId: 'gv-001',
          teacherName: 'Nguyễn Thị Mai',
          teacherCode: 'GV-001',
          assignedClassesCount: 2,
          assignedClasses: ['lop-1a1'],
          assignedAt: '2025-08-20'
        },
        {
          teacherId: 'gv-002',
          teacherName: 'Trần Văn Dũng',
          teacherCode: 'GV-002',
          assignedClassesCount: 1,
          assignedClasses: ['lop-2a1'],
          assignedAt: '2025-08-20'
        }
      ];

      const available = getUnassignedTeachers(sampleTeachers, assignedToMath);
      assert.equal(available.length, 2);
      assert.ok(!available.some((t) => t.id === 'gv-001'));
      assert.ok(!available.some((t) => t.id === 'gv-002'));
      assert.ok(available.some((t) => t.id === 'gv-003'));
      assert.ok(available.some((t) => t.id === 'gv-004'));
    });

    it('returns all teachers if none are assigned yet', () => {
      const available = getUnassignedTeachers(sampleTeachers, []);
      assert.equal(available.length, 4);
    });
  });

  // =========================================================================
  // 7. Redux State Machine Mutations & Isolation
  // =========================================================================
  describe('Redux State Machine Mutations & Invariants', () => {
    it('initializes with default mock subjects and active stage "TH"', () => {
      const state = subjectReducer(undefined, { type: '@@INIT' });
      assert.ok(Array.isArray(state.subjects));
      assert.ok(state.subjects.length > 0);
      assert.equal(state.activeStage, 'TH');
      assert.equal(state.selectedAcademicYear, '2025-2026');
      assert.equal(state.isDetailDrawerOpen, false);
      assert.equal(state.isAssignTeacherModalOpen, false);
      assert.equal(state.isUnassignTeacherModalOpen, false);
    });

    it('switches active educational stage and resets grade filter', () => {
      const initialState = subjectReducer(undefined, { type: '@@INIT' });
      const stateWithGrade = subjectReducer(
        initialState,
        setGradeLevelFilter('Khối 1')
      );
      assert.equal(stateWithGrade.filter.gradeLevel, 'Khối 1');

      const switchedState = subjectReducer(stateWithGrade, setActiveStage('THCS'));
      assert.equal(switchedState.activeStage, 'THCS');
      assert.equal(switchedState.filter.stage, 'THCS');
      assert.equal(switchedState.filter.gradeLevel, 'all');
    });

    it('updates search query and resets all filters', () => {
      const initialState = subjectReducer(undefined, { type: '@@INIT' });
      const searchedState = subjectReducer(
        initialState,
        setSearchQuery('Ngữ văn')
      );
      assert.equal(searchedState.filter.searchQuery, 'Ngữ văn');

      const resetState = subjectReducer(searchedState, resetFilters());
      assert.equal(resetState.filter.searchQuery, '');
      assert.equal(resetState.filter.gradeLevel, 'all');
      assert.equal(resetState.filter.classification, 'all');
    });

    it('assigns teacher to subject, avoiding duplicate assignments', () => {
      const initialState = subjectReducer(undefined, { type: '@@INIT' });
      const targetSubjectId = 'sub-th-001'; // Toán học
      const initialCount = initialState.subjects.find((s) => s.id === targetSubjectId).assignedTeachers.length;

      // Assign gv-003 (Lê Hoàng Yến) to Toán học
      const assignedState = subjectReducer(
        initialState,
        assignTeacherToSubject({
          subjectId: targetSubjectId,
          teacherId: 'gv-003',
          teacherName: 'Lê Hoàng Yến',
          teacherCode: 'GV-2025-003',
          phone: '0908123456',
          email: 'yen.le@finviet.edu.vn',
          assignedClasses: ['lop-1a1', 'lop-1a2']
        })
      );

      const updatedSubject = assignedState.subjects.find((s) => s.id === targetSubjectId);
      assert.equal(updatedSubject.assignedTeachers.length, initialCount + 1);
      assert.ok(updatedSubject.assignedTeachers.some((t) => t.teacherId === 'gv-003'));

      // Try assigning the same teacher again -> should be ignored (idempotent)
      const duplicateState = subjectReducer(
        assignedState,
        assignTeacherToSubject({
          subjectId: targetSubjectId,
          teacherId: 'gv-003',
          teacherName: 'Lê Hoàng Yến',
          teacherCode: 'GV-2025-003'
        })
      );
      const unchangedSubject = duplicateState.subjects.find((s) => s.id === targetSubjectId);
      assert.equal(unchangedSubject.assignedTeachers.length, initialCount + 1);
    });

    it('unassigns teacher from subject and preserves other assigned teachers', () => {
      const initialState = subjectReducer(undefined, { type: '@@INIT' });
      const targetSubjectId = 'sub-th-001'; // Has gv-001 and gv-002
      const subjectBefore = initialState.subjects.find((s) => s.id === targetSubjectId);
      const countBefore = subjectBefore.assignedTeachers.length;
      assert.ok(countBefore >= 2);

      // Unassign gv-001
      const unassignedState = subjectReducer(
        initialState,
        unassignTeacherFromSubject({
          subjectId: targetSubjectId,
          teacherId: 'gv-001'
        })
      );

      const subjectAfter = unassignedState.subjects.find((s) => s.id === targetSubjectId);
      assert.equal(subjectAfter.assignedTeachers.length, countBefore - 1);
      assert.ok(!subjectAfter.assignedTeachers.some((t) => t.teacherId === 'gv-001'));
      assert.ok(subjectAfter.assignedTeachers.some((t) => t.teacherId === 'gv-002'));
    });

    it('controls Detail Drawer and Modal open/close lifecycle', () => {
      const initialState = subjectReducer(undefined, { type: '@@INIT' });

      // Detail Drawer
      const openDrawer = subjectReducer(initialState, openDetailDrawer('sub-th-001'));
      assert.equal(openDrawer.isDetailDrawerOpen, true);
      assert.equal(openDrawer.selectedSubjectId, 'sub-th-001');

      const closeDrawer = subjectReducer(openDrawer, closeDetailDrawer());
      assert.equal(closeDrawer.isDetailDrawerOpen, false);

      // Assign Teacher Modal
      const openAssign = subjectReducer(closeDrawer, openAssignTeacherModal('sub-th-002'));
      assert.equal(openAssign.isAssignTeacherModalOpen, true);
      assert.equal(openAssign.selectedSubjectId, 'sub-th-002');

      const closeAssign = subjectReducer(openAssign, closeAssignTeacherModal());
      assert.equal(closeAssign.isAssignTeacherModalOpen, false);

      // Unassign Teacher Modal
      const openUnassign = subjectReducer(
        closeAssign,
        openUnassignTeacherModal({
          subjectId: 'sub-th-001',
          subjectName: 'Toán học',
          teacher: {
            teacherId: 'gv-001',
            teacherName: 'Nguyễn Thị Mai',
            teacherCode: 'GV-001',
            assignedClassesCount: 2,
            assignedClasses: ['lop-1a1'],
            assignedAt: '2025-08-20'
          }
        })
      );
      assert.equal(openUnassign.isUnassignTeacherModalOpen, true);
      assert.equal(openUnassign.teacherToUnassign.teacher.teacherId, 'gv-001');

      const closeUnassign = subjectReducer(openUnassign, closeUnassignTeacherModal());
      assert.equal(closeUnassign.isUnassignTeacherModalOpen, false);
      assert.equal(closeUnassign.teacherToUnassign, null);
    });
  });
});
