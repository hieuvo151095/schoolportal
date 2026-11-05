/**
 * Automated Unit Test Suite for School Grade Level Management (Khối Lớp)
 * Feature ID: 038-school-grade-management-khoi-lop
 * Standard Reference: MoET Circular 28/2020/TT-BGDĐT, Circular 32/2020/TT-BGDĐT, Law on Education 2019
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeVietnameseText,
  filterGradesByStage,
  searchGrades,
  computeGradeRollups,
  computeSchoolKPIs,
  getStageBadgeStyle,
  getCapacityColor,
} from '../../src/utils/gradeValidation.ts';

import {
  STATUTORY_GRADE_LEVELS,
  MOCK_GRADE_CLASSES,
} from '../../src/services/mockGradeData.ts';

import gradeReducer, {
  setSelectedStage,
  setSelectedAcademicYear,
  setSearchQuery,
  clearSearchQuery,
  setActiveGradeId,
  updateGradeClass,
  resetFilters,
} from '../../src/store/slices/gradeSlice.ts';

describe('School Grade Level Management (Nhà Trường — Khối Lớp) Business Rules & Engine', () => {
  // =========================================================================
  // 1. Accent-Insensitive Vietnamese Search & Instant Reset (BR04, BR05, K035)
  // =========================================================================
  describe('BR04, BR05: Accent-Insensitive Vietnamese Search & Reset', () => {
    it('normalizes diacritics, accents, and letter đ/Đ correctly', () => {
      assert.equal(normalizeVietnameseText('Khối 1'), 'khoi 1');
      assert.equal(normalizeVietnameseText('Đạo đức'), 'dao duc');
      assert.equal(normalizeVietnameseText('Trung học cơ sở'), 'trung hoc co so');
      assert.equal(normalizeVietnameseText('  Khối 10 (GDTX)  '), 'khoi 10 (gdtx)');
      assert.equal(normalizeVietnameseText(''), '');
    });

    it('matches grade names and codes without diacritic friction', () => {
      const results1 = searchGrades(STATUTORY_GRADE_LEVELS, 'khoi 1');
      const codes1 = results1.map((g) => g.code);
      assert.ok(codes1.includes('K01'), 'Must match Khối 1');
      assert.ok(codes1.includes('K10'), 'Must match Khối 10');
      assert.ok(codes1.includes('K11'), 'Must match Khối 11');
      assert.ok(codes1.includes('K12'), 'Must match Khối 12');

      const results10 = searchGrades(STATUTORY_GRADE_LEVELS, 'k10');
      const codes10 = results10.map((g) => g.code);
      assert.ok(codes10.includes('K10'), 'Must match K10');
      assert.ok(codes10.includes('K10-GDTX'), 'Must match K10-GDTX');
    });

    it('immediately restores full grade listing when search query is cleared or empty (BR05)', () => {
      const emptyResults = searchGrades(STATUTORY_GRADE_LEVELS, '');
      assert.equal(emptyResults.length, STATUTORY_GRADE_LEVELS.length);

      const whitespaceResults = searchGrades(STATUTORY_GRADE_LEVELS, '   ');
      assert.equal(whitespaceResults.length, STATUTORY_GRADE_LEVELS.length);
    });

    it('returns empty array when search query matches no records', () => {
      const noResults = searchGrades(STATUTORY_GRADE_LEVELS, 'khoi 99');
      assert.equal(noResults.length, 0);
    });
  });

  // =========================================================================
  // 2. Four-Stage Educational Cohort Partitioning (BR01, BR03)
  // =========================================================================
  describe('BR01, BR03: Four-Stage Educational Cohort Partitioning', () => {
    it('returns all grades when stage filter is ALL', () => {
      const allGrades = filterGradesByStage(STATUTORY_GRADE_LEVELS, 'ALL');
      assert.equal(allGrades.length, STATUTORY_GRADE_LEVELS.length);
    });

    it('partitions exactly Grades 1 to 5 for Primary (TH) per Circular 28/2020', () => {
      const thGrades = filterGradesByStage(STATUTORY_GRADE_LEVELS, 'TH');
      assert.equal(thGrades.length, 5);
      const codes = thGrades.map((g) => g.code);
      assert.deepEqual(codes, ['K01', 'K02', 'K03', 'K04', 'K05']);
    });

    it('partitions exactly Grades 6 to 9 for Lower Secondary (THCS) per Circular 32/2020', () => {
      const thcsGrades = filterGradesByStage(STATUTORY_GRADE_LEVELS, 'THCS');
      assert.equal(thcsGrades.length, 4);
      const codes = thcsGrades.map((g) => g.code);
      assert.deepEqual(codes, ['K06', 'K07', 'K08', 'K09']);
    });

    it('partitions exactly Grades 10 to 12 for Upper Secondary (THPT) per Circular 32/2020', () => {
      const thptGrades = filterGradesByStage(STATUTORY_GRADE_LEVELS, 'THPT');
      assert.equal(thptGrades.length, 3);
      const codes = thptGrades.map((g) => g.code);
      assert.deepEqual(codes, ['K10', 'K11', 'K12']);
    });

    it('partitions Continuing Education (GDTX) grades separately', () => {
      const gdtxGrades = filterGradesByStage(STATUTORY_GRADE_LEVELS, 'GDTX');
      assert.equal(gdtxGrades.length, 3);
      const codes = gdtxGrades.map((g) => g.code);
      assert.deepEqual(codes, ['K10-GDTX', 'K11-GDTX', 'K12-GDTX']);
    });
  });

  // =========================================================================
  // 3. Statutory Master Catalog Immutability (BR06, K033)
  // =========================================================================
  describe('BR06, K033: Statutory Master Catalog Immutability', () => {
    it('pre-initializes statutory cohorts without allowing arbitrary cohorts or deletion', () => {
      assert.ok(STATUTORY_GRADE_LEVELS.length >= 12, 'Must contain national cohorts K01 to K12');
      const orderIndices = STATUTORY_GRADE_LEVELS.map((g) => g.orderIndex);
      for (let i = 0; i < orderIndices.length - 1; i++) {
        assert.ok(orderIndices[i] < orderIndices[i + 1], 'Cohorts must be ordered ascendingly');
      }
    });

    it('formats stage badges correctly adhering to ECO Design System tokens', () => {
      const thStyle = getStageBadgeStyle('TH');
      assert.ok(thStyle.badgeClass.includes('blue'), 'TH badge must use blue accent');

      const thcsStyle = getStageBadgeStyle('THCS');
      assert.ok(thcsStyle.badgeClass.includes('emerald'), 'THCS badge must use emerald accent');

      const thptStyle = getStageBadgeStyle('THPT');
      assert.ok(thptStyle.badgeClass.includes('purple'), 'THPT badge must use purple accent');

      const gdtxStyle = getStageBadgeStyle('GDTX');
      assert.ok(gdtxStyle.badgeClass.includes('amber'), 'GDTX badge must use amber accent');
    });
  });

  // =========================================================================
  // 4. Dynamic Reactive Rollups across Class Rosters (BR02, K034)
  // =========================================================================
  describe('BR02, K034: Dynamic Reactive Rollups across Class Rosters', () => {
    const mockGrade10 = STATUTORY_GRADE_LEVELS.find((g) => g.id === 'k10');
    const mockClasses = MOCK_GRADE_CLASSES.k10;

    it('computes total class count, enrolled students, and homeroom rate dynamically', () => {
      const rollup = computeGradeRollups(mockGrade10, mockClasses, '2026-2027');
      assert.equal(rollup.classCount, 4, 'Must have 4 classes for K10');
      assert.equal(rollup.studentCount, 35 + 34 + 32 + 30, 'Total students must equal sum of class studentCount');
      assert.equal(rollup.homeroomAssignedCount, 4, 'All 4 classes have homeroom teachers');
      assert.equal(rollup.homeroomRate, 100, 'Homeroom rate must be 100%');
    });

    it('correctly handles grades with unassigned homeroom teachers', () => {
      const partialClasses = [
        {
          id: 'c-test-1',
          code: '10T1',
          name: 'Lớp 10T1',
          gradeLevelId: 'k10',
          academicYear: '2026-2027',
          homeroomTeacherId: 'tch-01',
          studentCount: 30,
        },
        {
          id: 'c-test-2',
          code: '10T2',
          name: 'Lớp 10T2',
          gradeLevelId: 'k10',
          academicYear: '2026-2027',
          homeroomTeacherId: undefined,
          studentCount: 25,
        },
      ];
      const rollup = computeGradeRollups(mockGrade10, partialClasses, '2026-2027');
      assert.equal(rollup.classCount, 2);
      assert.equal(rollup.studentCount, 55);
      assert.equal(rollup.homeroomAssignedCount, 1);
      assert.equal(rollup.homeroomRate, 50);
    });

    it('returns zero metrics for grades with no active classes', () => {
      const emptyGrade = STATUTORY_GRADE_LEVELS.find((g) => g.id === 'k05');
      const rollup = computeGradeRollups(emptyGrade, [], '2026-2027');
      assert.equal(rollup.classCount, 0);
      assert.equal(rollup.studentCount, 0);
      assert.equal(rollup.homeroomAssignedCount, 0);
      assert.equal(rollup.homeroomRate, 0);
    });

    it('evaluates classroom capacity progress bar color brackets properly', () => {
      const normalCap = getCapacityColor(28, 35); // 80%
      assert.equal(normalCap.percent, 80);
      assert.equal(normalCap.colorClass, 'text-emerald-600');

      const warningCap = getCapacityColor(33, 35); // 94%
      assert.equal(warningCap.percent, 94);
      assert.equal(warningCap.colorClass, 'text-amber-600');

      const fullCap = getCapacityColor(35, 35); // 100%
      assert.equal(fullCap.percent, 100);
      assert.equal(fullCap.colorClass, 'text-red-600');
    });
  });

  // =========================================================================
  // 5. School-Wide KPI Calculation (FR-GRD-002)
  // =========================================================================
  describe('FR-GRD-002: School-Wide KPI Calculation', () => {
    it('computes total grades, classes, students, and average class size across school', () => {
      const thGrades = filterGradesByStage(STATUTORY_GRADE_LEVELS, 'TH');
      const thClasses = MOCK_GRADE_CLASSES.k01 || [];

      const kpis = computeSchoolKPIs(thGrades, thClasses, '2026-2027');
      assert.equal(kpis.totalGrades, 5);
      assert.equal(kpis.totalClasses, 2);
      assert.equal(kpis.totalStudents, 28 + 29);
      assert.equal(kpis.averageStudentsPerClass, Math.round((28 + 29) / 2));
    });

    it('handles zero classes gracefully without division by zero', () => {
      const kpis = computeSchoolKPIs(STATUTORY_GRADE_LEVELS, [], '2026-2027');
      assert.equal(kpis.totalClasses, 0);
      assert.equal(kpis.totalStudents, 0);
      assert.equal(kpis.averageStudentsPerClass, 0);
    });
  });

  // =========================================================================
  // 6. Redux State Machine Mutations & Filter Invariants
  // =========================================================================
  describe('Redux State Machine Mutations & Filter Invariants', () => {
    const initialState = {
      grades: STATUTORY_GRADE_LEVELS,
      classes: MOCK_GRADE_CLASSES,
      selectedStage: 'ALL',
      selectedAcademicYear: '2026-2027',
      searchQuery: '',
      activeGradeId: null,
    };

    it('switches active educational stage properly', () => {
      const nextState = gradeReducer(initialState, setSelectedStage('THCS'));
      assert.equal(nextState.selectedStage, 'THCS');
    });

    it('updates academic year selection', () => {
      const nextState = gradeReducer(initialState, setSelectedAcademicYear('2025-2026'));
      assert.equal(nextState.selectedAcademicYear, '2025-2026');
    });

    it('updates search query and clears search query', () => {
      const stateWithSearch = gradeReducer(initialState, setSearchQuery('khoi 10'));
      assert.equal(stateWithSearch.searchQuery, 'khoi 10');

      const clearedState = gradeReducer(stateWithSearch, clearSearchQuery());
      assert.equal(clearedState.searchQuery, '');
    });

    it('sets and clears active grade ID for navigation', () => {
      const stateWithActive = gradeReducer(initialState, setActiveGradeId('k10'));
      assert.equal(stateWithActive.activeGradeId, 'k10');

      const stateCleared = gradeReducer(stateWithActive, setActiveGradeId(null));
      assert.equal(stateCleared.activeGradeId, null);
    });

    it('resets all filters to default values', () => {
      const modifiedState = {
        ...initialState,
        selectedStage: 'THPT',
        searchQuery: 'khoi 12',
        selectedAcademicYear: '2024-2025',
      };
      const reset = gradeReducer(modifiedState, resetFilters());
      assert.equal(reset.selectedStage, 'ALL');
      assert.equal(reset.searchQuery, '');
      assert.equal(reset.selectedAcademicYear, '2026-2027');
    });

    it('updates class record within grade classes list', () => {
      const updatedClass = {
        id: 'c10a1',
        code: '10A1',
        name: 'Lớp 10A1 (Chuyên Toán Cập Nhật)',
        gradeLevelId: 'k10',
        academicYear: '2026-2027',
        studentCount: 35,
        maxCapacity: 35,
        subjectTeacherCount: 12,
        status: 'dang_hoc',
      };

      const nextState = gradeReducer(initialState, updateGradeClass(updatedClass));
      const k10Classes = nextState.classes.k10;
      const found = k10Classes.find((c) => c.id === 'c10a1');
      assert.ok(found);
      assert.equal(found.name, 'Lớp 10A1 (Chuyên Toán Cập Nhật)');
    });
  });
});
