/**
 * Automated Unit Test Suite for Academics Gradebook & Evaluation Sheets (Điểm & Đánh Giá)
 * Tests BR01–BR10, MoET GPA weighting, tally clamping, and Redux state transitions.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateTBHK,
  calculateEvaluationTally,
  determineRubricCompletion,
  getTermActionInfo,
  calculateClassSummaryRate,
  filterGradebooks,
  validateScoreInput
} from '../../src/utils/gradebookValidation.ts';

import gradebookReducer, {
  setActiveParadigm,
  setSelectedClassId,
  updateStudentScore,
  updateTermSummaryRecord,
  updateDevelopmentalRubric,
  publishTermSession
} from '../../src/store/slices/gradebookSlice.ts';

import { mockClassGradebooks } from '../../src/services/mockGradebookData.ts';

describe('Academics Gradebook & Evaluation Business Rules Engine', () => {

  test('BR01: Distinguishes between numeric gradebook and developmental rubric paradigms', () => {
    const k12Class = mockClassGradebooks.find(c => c.classId === 'c-12a1');
    const preschoolClass = mockClassGradebooks.find(c => c.classId === 'c-mam');

    assert.equal(k12Class?.paradigm, 'numeric_gradebook');
    assert.equal(preschoolClass?.paradigm, 'developmental_rubric');
    assert.equal(k12Class?.terms.length, 5); // hk1_mid, hk1_final, hk2_mid, hk2_final, full_year
    assert.equal(preschoolClass?.terms.length, 4); // p_term1, p_term2, p_term3, p_term4
  });

  test('BR03: Computes weighted TBHK GPA per MoET circular standards', () => {
    // Standard student: TX = [8.5, 9.0, 8.0, 9.5], GK = 8.5, CK = 9.0
    // Sum(TX) = 35, Weight(TX) = 4
    // 2 * GK = 17, 3 * CK = 27
    // Total = 35 + 17 + 27 = 79
    // Total weight = 4 + 2 + 3 = 9
    // TBHK = 79 / 9 = 8.777... -> 8.8
    const tbhk = calculateTBHK([8.5, 9.0, 8.0, 9.5], 8.5, 9.0);
    assert.equal(tbhk, 8.8);

    // Perfect student: TX = [10, 10], GK = 10, CK = 10
    // Total = 20 + 20 + 30 = 70, weight = 2 + 5 = 7 -> 10.0
    const perfectTBHK = calculateTBHK([10, 10], 10, 10);
    assert.equal(perfectTBHK, 10.0);

    // Student with only 1 TX score: TX = [7.0], GK = 8.0, CK = 8.0
    // Total = 7.0 + 16.0 + 24.0 = 47.0, weight = 1 + 5 = 6 -> 47 / 6 = 7.833... -> 7.8
    const singleTxTBHK = calculateTBHK([7.0], 8.0, 8.0);
    assert.equal(singleTxTBHK, 7.8);
  });

  test('BR03: Returns null if milestone examinations (GK or CK) are missing', () => {
    // Missing CK
    const missingCK = calculateTBHK([8.0, 8.5], 8.0, null);
    assert.equal(missingCK, null);

    // Missing GK
    const missingGK = calculateTBHK([8.0, 8.5], null, 9.0);
    assert.equal(missingGK, null);

    // Both missing
    const missingBoth = calculateTBHK([8.0, 8.5], null, null);
    assert.equal(missingBoth, null);
  });

  test('BR03: Rejects out of bounds scores in TBHK math', () => {
    const invalidGK = calculateTBHK([8.0], 11.0, 9.0);
    assert.equal(invalidGK, null);

    const negativeCK = calculateTBHK([8.0], 8.0, -1.0);
    assert.equal(negativeCK, null);
  });

  test('BR07: Enforces bounded tally calculation and fixes legacy 6/5 display defect', () => {
    // 5 primary qualities where user selected all 5
    const fiveQualities = {
      yeu_nuoc: 'tot',
      nhan_ai: 'tot',
      cham_chi: 'tot',
      trung_thuc: 'tot',
      trach_nhiem: 'tot'
    };
    const tally = calculateEvaluationTally(fiveQualities, 5);
    assert.equal(tally.count, 5);
    assert.equal(tally.total, 5);
    assert.equal(tally.label, '5/5 Đã đánh giá');

    // Edge case: if object somehow contained extra unexpected key, clamping prevents > 5
    const overflowMap = {
      ...fiveQualities,
      extra_key: 'tot'
    };
    const clampedTally = calculateEvaluationTally(overflowMap, 5);
    assert.equal(clampedTally.count, 5); // Strictly clamped to 5
    assert.equal(clampedTally.label, '5/5 Đã đánh giá');

    // Partial evaluation (3 of 7 specific competencies)
    const partialSpecific = {
      ngon_ngu: 'tot',
      toan_hoc: 'dat',
      khoa_hoc: 'can_co_gang'
    };
    const partialTally = calculateEvaluationTally(partialSpecific, 7);
    assert.equal(partialTally.count, 3);
    assert.equal(partialTally.total, 7);
    assert.equal(partialTally.label, '3/7 Đã đánh giá');
  });

  test('BR07: Determines developmental rubric completion status', () => {
    // Core = 3/3, Specific = 5/7, Qualities = 5/5 -> Completed (per legacy acceptance criteria)
    assert.equal(determineRubricCompletion(3, 5, 5), true);

    // Specific = 7/7, Core = 3/3, Qualities = 5/5 -> Completed
    assert.equal(determineRubricCompletion(3, 7, 5), true);

    // Missing core (only 2/3) -> Incomplete
    assert.equal(determineRubricCompletion(2, 7, 5), false);

    // Missing qualities (only 4/5) -> Incomplete
    assert.equal(determineRubricCompletion(3, 5, 4), false);

    // Specific too low (< 5/7) -> Incomplete
    assert.equal(determineRubricCompletion(3, 4, 5), false);
  });

  test('BR02 & BR08: Verifies publication lifecycle and switch to "Cập nhật" action', () => {
    const notStarted = getTermActionInfo('chua_thuc_hien');
    assert.equal(notStarted.buttonLabel, 'Bắt đầu');
    assert.equal(notStarted.isPublished, false);

    const inProgress = getTermActionInfo('tien_hanh');
    assert.equal(inProgress.buttonLabel, 'Công bố');
    assert.equal(inProgress.isPublished, false);

    const published = getTermActionInfo('da_cong_bo');
    assert.equal(published.buttonLabel, 'Cập nhật');
    assert.equal(published.isPublished, true);
  });

  test('BR04: Calculates homeroom summary completion rates', () => {
    const sampleRecords = [
      { studentId: '1', studentCode: 'H1', studentName: 'A', academicResult: 'hoan_thanh_tot', conductResult: 'tot', excusedAbsence: 0, unexcusedAbsence: 0, homeroomComment: '' },
      { studentId: '2', studentCode: 'H2', studentName: 'B', academicResult: 'hoan_thanh', conductResult: 'tot', excusedAbsence: 0, unexcusedAbsence: 0, homeroomComment: '' },
      { studentId: '3', studentCode: 'H3', studentName: 'C', academicResult: 'chua_hoan_thanh', conductResult: 'kha', excusedAbsence: 0, unexcusedAbsence: 0, homeroomComment: '' }
    ];

    const rate = calculateClassSummaryRate(sampleRecords);
    assert.equal(rate.total, 3);
    assert.equal(rate.completedCount, 2);
    assert.equal(rate.uncompletedCount, 1);
    assert.equal(rate.completedPercent, 67); // 2/3 = 66.66% -> 67%
  });

  test('BR09: Filters class gradebooks by search query, grade, and teacher', () => {
    // Search by class name "12A1"
    const match12 = filterGradebooks(mockClassGradebooks, {
      searchQuery: '12A1',
      gradeLevel: 'Tất cả khối',
      homeroomTeacher: 'Tất cả giáo viên',
      academicYear: 'Năm học 2025 - 2026'
    });
    assert.equal(match12.length, 1);
    assert.equal(match12[0].className, '12A1');

    // Filter by grade level "Mầm non"
    const matchMamNon = filterGradebooks(mockClassGradebooks, {
      searchQuery: '',
      gradeLevel: 'Mầm non',
      homeroomTeacher: 'Tất cả giáo viên',
      academicYear: 'Năm học 2025 - 2026'
    });
    assert.equal(matchMamNon.length, 2); // Lá and Lớp Mầm

    // Filter by homeroom teacher "Lan Anh"
    const matchTeacher = filterGradebooks(mockClassGradebooks, {
      searchQuery: '',
      gradeLevel: 'Tất cả khối',
      homeroomTeacher: 'Lan Anh',
      academicYear: 'Năm học 2025 - 2026'
    });
    assert.equal(matchTeacher.length, 1);
    assert.equal(matchTeacher[0].className, '6A1');
  });

  test('Score Input Validation parses numbers and supports comma decimals', () => {
    assert.deepEqual(validateScoreInput('8.5'), { isValid: true, score: 8.5 });
    assert.deepEqual(validateScoreInput('9,5'), { isValid: true, score: 9.5 });
    assert.deepEqual(validateScoreInput('10'), { isValid: true, score: 10 });
    assert.deepEqual(validateScoreInput('0'), { isValid: true, score: 0 });
    assert.deepEqual(validateScoreInput('—'), { isValid: true, score: null });
    assert.deepEqual(validateScoreInput(''), { isValid: true, score: null });

    const tooHigh = validateScoreInput('10.5');
    assert.equal(tooHigh.isValid, false);

    const negative = validateScoreInput('-1');
    assert.equal(negative.isValid, false);

    const invalid = validateScoreInput('abc');
    assert.equal(invalid.isValid, false);
  });

  describe('Redux Gradebook Reducer State Transitions', () => {
    const initialState = gradebookReducer(undefined, { type: '@@INIT' });

    test('updates student subject scores and automatically recalculates TBHK', () => {
      // Update TX0 and Final Exam for student hs-601 in 6A1
      const state = gradebookReducer(
        initialState,
        updateStudentScore({
          classId: 'c-6a1',
          termId: 't-6a1-hk1-mid',
          subjectId: 'sub-toan-6',
          studentId: 'hs-601',
          txIndex: 0,
          txScore: 10.0,
          gkScore: 9.0,
          ckScore: 9.0
        })
      );

      const roster = state.subjectScores['c-6a1_t-6a1-hk1-mid_sub-toan-6'];
      const student = roster.find(s => s.studentId === 'hs-601');

      assert.equal(student?.txScores[0], 10.0);
      assert.equal(student?.gkScore, 9.0);
      assert.equal(student?.ckScore, 9.0);
      // Auto-recalculated TBHK:
      // TX = [10.0, 9.0, 8.0, 9.5] = 36.5
      // GK = 9.0 * 2 = 18.0
      // CK = 9.0 * 3 = 27.0
      // Total = 81.5 / 9 = 9.055... -> 9.1
      assert.equal(student?.tbhk, 9.1);
    });

    test('updates term summary record for homeroom evaluation', () => {
      const state = gradebookReducer(
        initialState,
        updateTermSummaryRecord({
          classId: 'c-6a1',
          termId: 't-6a1-hk1-mid',
          studentId: 'hs-604',
          academicResult: 'hoan_thanh_tot',
          conductResult: 'tot',
          homeroomComment: 'Đã có tiến bộ vượt bậc cuối học kỳ.'
        })
      );

      const roster = state.termSummaries['c-6a1_t-6a1-hk1-mid'];
      const student = roster.find(s => s.studentId === 'hs-604');

      assert.equal(student?.academicResult, 'hoan_thanh_tot');
      assert.equal(student?.conductResult, 'tot');
      assert.equal(student?.homeroomComment, 'Đã có tiến bộ vượt bậc cuối học kỳ.');
    });

    test('updates developmental rubric ratings and evaluates completion', () => {
      const state = gradebookReducer(
        initialState,
        updateDevelopmentalRubric({
          classId: 'c-mam',
          termId: 't-mam-p3',
          studentId: 'hs-m03',
          coreCompetencies: {
            tu_chu_tu_hoc: 'tot',
            giao_tiep_hop_tac: 'tot',
            giai_quyet_van_de: 'tot'
          },
          primaryQualities: {
            yeu_nuoc: 'tot',
            nhan_ai: 'tot',
            cham_chi: 'tot',
            trung_thuc: 'tot',
            trach_nhiem: 'tot'
          }
        })
      );

      const roster = state.developmentalRubrics['c-mam_t-mam-p3'];
      const student = roster.find(s => s.studentId === 'hs-m03');

      assert.equal(student?.coreCompetencies['tu_chu_tu_hoc'], 'tot');
      assert.equal(student?.primaryQualities['trach_nhiem'], 'tot');
      // Core = 3, Qualities = 5, Specific = 5 (from initial seed) -> Now Completed!
      assert.equal(student?.isCompleted, true);
    });

    test('publishes term session transitioning status to da_cong_bo', () => {
      const state = gradebookReducer(
        initialState,
        publishTermSession({
          classId: 'c-12a1',
          termId: 't-12a1-hk1-mid',
          publishedAt: '20/09/2026'
        })
      );

      const cls = state.classes.find(c => c.classId === 'c-12a1');
      const term = cls?.terms.find(t => t.termId === 't-12a1-hk1-mid');

      assert.equal(term?.status, 'da_cong_bo');
      assert.equal(term?.publishedAt, '20/09/2026');
      assert.equal(term?.completedStudents, 34);
    });
  });
});
