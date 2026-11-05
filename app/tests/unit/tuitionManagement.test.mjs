import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatFeeAmount,
  hasPriceDivergence,
  getDefaultFeeHint,
  getAvailableFeesForClass,
  computeActiveStudentsCount,
  validateBatchUpdate,
  filterClassOverviews,
} from '../../src/utils/tuitionManagementValidation.ts';

import tuitionManagementReducer, {
  updateStudentFeeAmount,
  toggleStudentFeeOption,
  batchUpdateClassFee,
  addClassFeeToMatrix,
  removeClassFee,
  saveChanges,
  discardChanges,
  setFilterCriteria,
} from '../../src/store/slices/tuitionManagementSlice.ts';

import {
  mockClassFeeOverviews,
  mock12A1AssignedFees,
  mock12A1Students,
  mockUnassignedCatalogFees,
} from '../../src/services/mockTuitionManagementData.ts';

test('Finance Tuition Management (Quản Lý Học Phí) Business Rules & Engine', async (t) => {

  await t.test('formatFeeAmount formats numbers with Vietnamese thousands dot separators', () => {
    assert.equal(formatFeeAmount(5000000), '5.000.000');
    assert.equal(formatFeeAmount(50000), '50.000');
    assert.equal(formatFeeAmount(0), '0');
    assert.equal(formatFeeAmount(null), '—');
    assert.equal(formatFeeAmount(undefined), '—');
  });

  await t.test('BR01: Filters class overviews by class name and grade level', () => {
    // 12 classes in total
    assert.equal(mockClassFeeOverviews.length, 12);

    // Search query
    const search12 = filterClassOverviews(mockClassFeeOverviews, '12', 'all');
    assert.equal(search12.length, 2);
    assert.deepEqual(search12.map(c => c.className), ['12A1', '12A2']);

    // Grade filter
    const grade11 = filterClassOverviews(mockClassFeeOverviews, '', 'Khối 11');
    assert.equal(grade11.length, 2);
    assert.deepEqual(grade11.map(c => c.className), ['11A1', '11A2']);

    // Non-existent class
    const emptyResult = filterClassOverviews(mockClassFeeOverviews, 'NonExistent', 'all');
    assert.equal(emptyResult.length, 0);
  });

  await t.test('BR02: Class always has mandatory Học phí and Tiền ăn', () => {
    const mandatoryFees = mock12A1AssignedFees.filter(f => f.isMandatory);
    assert.equal(mandatoryFees.length, 2);
    assert.equal(mandatoryFees[0].feeId, 'fee_hoc_phi');
    assert.equal(mandatoryFees[0].feeName, 'Học phí');
    assert.equal(mandatoryFees[1].feeId, 'fee_tien_an');
    assert.equal(mandatoryFees[1].feeName, 'Tiền ăn');
  });

  await t.test('BR03: Optional fees compute active student count (N Học sinh)', () => {
    // In mock data:
    // STEAM is active for 1 student (Nguyen Nguyen Thu)
    const steamCount = computeActiveStudentsCount(mock12A1Students, 'fee_steam');
    assert.equal(steamCount, 1);

    // Ăn sáng is active for 2 students
    const breakfastCount = computeActiveStudentsCount(mock12A1Students, 'fee_an_sang');
    assert.equal(breakfastCount, 2);

    // Non-existent fee has 0 active students
    assert.equal(computeActiveStudentsCount(mock12A1Students, 'non_existent_fee'), 0);
  });

  await t.test('BR04: In-cell price divergence detects override and generates green hint', () => {
    // Default fee for 12A1 Học phí is 5,000,000
    const defaultAmount = 5000000;

    // Nguyen Nguyen Thu has 4,500,000 -> has divergence
    assert.equal(hasPriceDivergence(4500000, defaultAmount), true);
    assert.equal(
      getDefaultFeeHint(defaultAmount, 'Tháng'),
      'Phí mặc định: 5.000.000 Đ/Tháng'
    );

    // Tran Minh Anh has 5,000,000 -> matches default, no divergence
    assert.equal(hasPriceDivergence(5000000, defaultAmount), false);

    // Null amount does not produce divergence
    assert.equal(hasPriceDivergence(null, defaultAmount), false);
  });

  await t.test('BR05: Batch fee update validation enforces positive amount and tagged student restriction', () => {
    // Invalid amount
    const negative = validateBatchUpdate({
      classId: '12A1',
      feeId: 'fee_hoc_phi',
      newAmount: -1000,
      applyToAll: true,
      selectedStudentIds: [],
    });
    assert.equal(negative.isValid, false);

    // Valid applyToAll
    const validAll = validateBatchUpdate({
      classId: '12A1',
      feeId: 'fee_hoc_phi',
      newAmount: 5200000,
      applyToAll: true,
      selectedStudentIds: [],
    });
    assert.equal(validAll.isValid, true);

    // Missing tagged students when applyToAll is false
    const missingTagged = validateBatchUpdate({
      classId: '12A1',
      feeId: 'fee_hoc_phi',
      newAmount: 5200000,
      applyToAll: false,
      selectedStudentIds: [],
    });
    assert.equal(missingTagged.isValid, false);
    assert.equal(
      missingTagged.error,
      'Vui lòng chọn ít nhất một học sinh để áp dụng số tiền mới.'
    );

    // Valid with tagged students
    const validTagged = validateBatchUpdate({
      classId: '12A1',
      feeId: 'fee_hoc_phi',
      newAmount: 5200000,
      applyToAll: false,
      selectedStudentIds: ['STU-12A1-001', 'STU-12A1-002'],
    });
    assert.equal(validTagged.isValid, true);
  });

  await t.test('BR06: Add fee modal strictly filters out already assigned fee items', () => {
    const allCatalog = [
      { id: 'fee_hoc_phi', name: 'Học phí' },
      { id: 'fee_tien_an', name: 'Tiền ăn' },
      { id: 'fee_steam', name: 'Học STEAM' },
      { id: 'fee_robotics', name: 'Khóa học Robotics' },
      { id: 'fee_am_nhac', name: 'Câu lạc bộ âm nhạc' },
    ];
    const assignedIds = ['fee_hoc_phi', 'fee_tien_an', 'fee_steam'];

    const available = getAvailableFeesForClass(allCatalog, assignedIds);
    assert.equal(available.length, 2);
    assert.deepEqual(available.map(a => a.id), ['fee_robotics', 'fee_am_nhac']);

    // If no fees assigned yet, returns all
    assert.equal(getAvailableFeesForClass(allCatalog, []).length, 5);
  });

  await t.test('BR07: Distinguishes unset fee status from explicit zero amounts', () => {
    const unsetClass = mockClassFeeOverviews.find(c => c.classId === '1A1');
    assert.equal(unsetClass.mandatoryFeesSummary.hocPhi, null);
    assert.equal(unsetClass.mandatoryFeesSummary.tienAn, null);

    // Formatted output for unset should be '—' rather than '0'
    assert.equal(formatFeeAmount(unsetClass.mandatoryFeesSummary.hocPhi), '—');
    assert.equal(formatFeeAmount(0), '0');
  });

  await t.test('BR08: Electronic invoice flag is strictly readonly in tuition management', () => {
    const overview12A1 = mockClassFeeOverviews.find(c => c.classId === '12A1');
    assert.equal(overview12A1.exportElectronicInvoice, true);

    const assignedHocPhi = mock12A1AssignedFees.find(f => f.feeId === 'fee_hoc_phi');
    assert.equal(assignedHocPhi.exportElectronicInvoice, true);
  });

  await t.test('Redux State: Single cell amount update recalculates override and flags unsaved changes', () => {
    const state0 = tuitionManagementReducer(undefined, { type: 'INIT' });
    assert.equal(state0.hasUnsavedChanges, false);

    // Update Nguyen Nguyen Thu's tuition from 4,500,000 back to default 5,000,000
    const state1 = tuitionManagementReducer(
      state0,
      updateStudentFeeAmount({
        studentId: 'STU-12A1-001',
        feeId: 'fee_hoc_phi',
        amount: 5000000,
      })
    );

    const student1 = state1.matrixRows.find(s => s.studentId === 'STU-12A1-001');
    assert.equal(student1.feeCells.fee_hoc_phi.amount, 5000000);
    assert.equal(student1.feeCells.fee_hoc_phi.hasOverride, false);
    assert.equal(state1.hasUnsavedChanges, true);
  });

  await t.test('Redux State: Toggle optional fee updates active count and flags unsaved changes', () => {
    const state0 = tuitionManagementReducer(undefined, { type: 'INIT' });

    // Enable STEAM for Tran Minh Anh (STU-12A1-002)
    const state1 = tuitionManagementReducer(
      state0,
      toggleStudentFeeOption({
        studentId: 'STU-12A1-002',
        feeId: 'fee_steam',
        isEnabled: true,
      })
    );

    const student2 = state1.matrixRows.find(s => s.studentId === 'STU-12A1-002');
    assert.equal(student2.feeCells.fee_steam.isEnabled, true);

    // Active count for STEAM in assignedFees increments from 1 to 2
    const steamFee = state1.assignedFees.find(f => f.feeId === 'fee_steam');
    assert.equal(steamFee.activeStudentCount, 2);
    assert.equal(state1.hasUnsavedChanges, true);
  });

  await t.test('Redux State: Batch update mutates only tagged students when applyToAll is false', () => {
    const state0 = tuitionManagementReducer(undefined, { type: 'INIT' });

    // Batch update tuition to 5,500,000 for only STU-12A1-001 and STU-12A1-003
    const state1 = tuitionManagementReducer(
      state0,
      batchUpdateClassFee({
        classId: '12A1',
        feeId: 'fee_hoc_phi',
        newAmount: 5500000,
        applyToAll: false,
        selectedStudentIds: ['STU-12A1-001', 'STU-12A1-003'],
      })
    );

    const s1 = state1.matrixRows.find(s => s.studentId === 'STU-12A1-001');
    const s2 = state1.matrixRows.find(s => s.studentId === 'STU-12A1-002');
    const s3 = state1.matrixRows.find(s => s.studentId === 'STU-12A1-003');

    assert.equal(s1.feeCells.fee_hoc_phi.amount, 5500000);
    assert.equal(s1.feeCells.fee_hoc_phi.hasOverride, true);

    // STU-12A1-002 was NOT selected -> remains 5,000,000
    assert.equal(s2.feeCells.fee_hoc_phi.amount, 5000000);

    assert.equal(s3.feeCells.fee_hoc_phi.amount, 5500000);
    assert.equal(s3.feeCells.fee_hoc_phi.hasOverride, true);
  });

  await t.test('Redux State: Add and remove fee item from matrix', () => {
    const state0 = tuitionManagementReducer(undefined, { type: 'INIT' });
    const initialFeeCount = state0.assignedFees.length;

    // Add Robotics fee to Class 12A1 for STU-12A1-001
    const state1 = tuitionManagementReducer(
      state0,
      addClassFeeToMatrix({
        classId: '12A1',
        feeId: 'fee_robotics',
        feeName: 'Khóa học Robotics',
        unit: 'Tháng',
        defaultAmount: 450000,
        exportElectronicInvoice: true,
        applyToAll: false,
        selectedStudentIds: ['STU-12A1-001'],
      })
    );

    assert.equal(state1.assignedFees.length, initialFeeCount + 1);
    const robotics = state1.assignedFees.find(f => f.feeId === 'fee_robotics');
    assert.ok(robotics);
    assert.equal(robotics.activeStudentCount, 1);

    // Student 1 has it enabled
    const s1 = state1.matrixRows.find(s => s.studentId === 'STU-12A1-001');
    assert.equal(s1.feeCells.fee_robotics.isEnabled, true);

    // Student 2 has it disabled
    const s2 = state1.matrixRows.find(s => s.studentId === 'STU-12A1-002');
    assert.equal(s2.feeCells.fee_robotics.isEnabled, false);

    // Remove the added fee
    const state2 = tuitionManagementReducer(state1, removeClassFee('fee_robotics'));
    assert.equal(state2.assignedFees.length, initialFeeCount);
    const s1Removed = state2.matrixRows.find(s => s.studentId === 'STU-12A1-001');
    assert.equal(s1Removed.feeCells.fee_robotics, undefined);
  });

  await t.test('Redux State: Save and discard changes resets dirty flag', () => {
    const state0 = tuitionManagementReducer(undefined, { type: 'INIT' });

    // Modify a cell
    const state1 = tuitionManagementReducer(
      state0,
      updateStudentFeeAmount({
        studentId: 'STU-12A1-001',
        feeId: 'fee_hoc_phi',
        amount: 3000000,
      })
    );
    assert.equal(state1.hasUnsavedChanges, true);

    // Discard
    const stateDiscarded = tuitionManagementReducer(state1, discardChanges());
    assert.equal(stateDiscarded.hasUnsavedChanges, false);
    const s1Discarded = stateDiscarded.matrixRows.find(s => s.studentId === 'STU-12A1-001');
    assert.equal(s1Discarded.feeCells.fee_hoc_phi.amount, 4500000); // Reverted!

    // Modify and Save
    const stateModified = tuitionManagementReducer(
      stateDiscarded,
      updateStudentFeeAmount({
        studentId: 'STU-12A1-001',
        feeId: 'fee_hoc_phi',
        amount: 3000000,
      })
    );
    const stateSaved = tuitionManagementReducer(stateModified, saveChanges());
    assert.equal(stateSaved.hasUnsavedChanges, false);
    const s1Saved = stateSaved.matrixRows.find(s => s.studentId === 'STU-12A1-001');
    assert.equal(s1Saved.feeCells.fee_hoc_phi.amount, 3000000); // Saved!
  });

});
