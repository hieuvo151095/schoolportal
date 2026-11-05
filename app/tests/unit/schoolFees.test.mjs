/**
 * Automated Unit Test Suite for Finance - Fee Catalog (Khoản Phí)
 * Tests BR01–BR10, TASK-FIN-003, validation rules, and Redux state machine.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  formatFeeAmount,
  formatFeeUnit,
  isSystemFee,
  filterFeeItems,
  calculateCustomFeeCount,
  validateCreateFeeItemInput,
  validateEditFeeItemInput,
  filterStudentAssignments,
  FEE_UNIT_LABELS,
  FEE_UNIT_OPTIONS,
} from '../../src/utils/schoolFeeValidation.ts';

import schoolFeeReducer, {
  setFilterCriteria,
  toggleExportElectronicInvoiceInline,
  createFeeItem,
  updateFeeItem,
  deleteFeeItem,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  openAssignmentModal,
  closeAssignmentModal,
} from '../../src/store/slices/schoolFeeSlice.ts';

import {
  INITIAL_SCHOOL_FEES,
  INITIAL_STUDENT_FEE_ASSIGNMENTS,
} from '../../src/services/mockSchoolFeeData.ts';

describe('Finance Fee Catalog (Khoản Phí) Business Rules & Engine', () => {

  test('formatFeeAmount formats numbers with Vietnamese thousands dot separators and đ suffix', () => {
    assert.equal(formatFeeAmount(500000), '500.000 đ');
    assert.equal(formatFeeAmount(1200000), '1.200.000 đ');
    assert.equal(formatFeeAmount(0), '0 đ');
    assert.equal(formatFeeAmount(undefined), '—');
  });

  test('BR02: Exactly 8 standardized educational fee units are supported', () => {
    assert.equal(FEE_UNIT_OPTIONS.length, 8);
    assert.equal(FEE_UNIT_LABELS['ngay'], 'Ngày');
    assert.equal(FEE_UNIT_LABELS['thang'], 'Tháng');
    assert.equal(FEE_UNIT_LABELS['nam'], 'Năm');
    assert.equal(FEE_UNIT_LABELS['lan'], 'Lần');
    assert.equal(FEE_UNIT_LABELS['chuyen'], 'Chuyến');
    assert.equal(FEE_UNIT_LABELS['bo'], 'Bộ');
    assert.equal(FEE_UNIT_LABELS['khac'], 'Khác');
    assert.equal(FEE_UNIT_LABELS['gio'], 'Giờ');
    assert.equal(formatFeeUnit('thang'), 'Tháng');
    assert.equal(formatFeeUnit(undefined), '—');
  });

  test('BR01: Distinguishes system fees from custom fees', () => {
    const systemFee = INITIAL_SCHOOL_FEES.find((f) => f.id === 'fee-sys-001');
    const customFee = INITIAL_SCHOOL_FEES.find((f) => f.id === 'fee-cust-001');

    assert.ok(systemFee);
    assert.ok(customFee);
    assert.equal(isSystemFee(systemFee), true);
    assert.equal(isSystemFee(customFee), false);
    assert.equal(systemFee.type, 'system');
    assert.equal(customFee.type, 'custom');
  });

  test('BR06: Filters fee items by search keyword case-insensitively', () => {
    const searchSteam = filterFeeItems(INITIAL_SCHOOL_FEES, {
      search: 'steam',
      exportElectronicInvoiceFilter: 'all',
    });
    assert.equal(searchSteam.length, 1);
    assert.equal(searchSteam[0].id, 'fee-cust-001');
    assert.equal(searchSteam[0].name, 'Học STEAM');

    const searchDongPhuc = filterFeeItems(INITIAL_SCHOOL_FEES, {
      search: 'đồng phục',
      exportElectronicInvoiceFilter: 'all',
    });
    assert.equal(searchDongPhuc.length, 2); // 'Đồng phục hè' & 'Đồng phục thể thao'
  });

  test('BR07 & BR08: Custom fee counter arithmetic strictly excludes system fees', () => {
    // Total unfiltered items: 3 system + 22 custom = 25 items
    assert.equal(INITIAL_SCHOOL_FEES.length, 25);

    // Unfiltered custom count is 22
    const totalCustom = calculateCustomFeeCount(INITIAL_SCHOOL_FEES);
    assert.equal(totalCustom, 22);

    // Filter by Xuat HDDT = 'yes':
    // Matches 2 system fees (Hoc phi, Tien an) + 5 custom fees (STEAM, Tieng Anh, Xe dua don, Dong phuc he, Tien an sang) = 7 rows
    const yesItems = filterFeeItems(INITIAL_SCHOOL_FEES, {
      search: '',
      exportElectronicInvoiceFilter: 'yes',
    });
    assert.equal(yesItems.length, 7);

    // But footer total counter strictly counts custom fee items = 5!
    const yesCustomCount = calculateCustomFeeCount(yesItems);
    assert.equal(yesCustomCount, 5);

    // Filter by Xuat HDDT = 'no':
    // Matches 1 system fee (Phi tra tre) + 17 custom fees = 18 rows
    const noItems = filterFeeItems(INITIAL_SCHOOL_FEES, {
      search: '',
      exportElectronicInvoiceFilter: 'no',
    });
    assert.equal(noItems.length, 18);
    const noCustomCount = calculateCustomFeeCount(noItems);
    assert.equal(noCustomCount, 17);
  });

  test('BR09: Validates Create Fee Item input', () => {
    // Valid input
    const valid = validateCreateFeeItemInput({
      name: 'Câu lạc bộ Robotics',
      defaultAmount: 750000,
      unit: 'thang',
      exportElectronicInvoice: false,
    });
    assert.equal(valid.valid, true);
    assert.equal(Object.keys(valid.errors).length, 0);

    // Missing name
    const missingName = validateCreateFeeItemInput({
      name: '  ',
      defaultAmount: 500000,
      unit: 'thang',
      exportElectronicInvoice: false,
    });
    assert.equal(missingName.valid, false);
    assert.ok(missingName.errors.name);

    // Negative or missing amount
    const invalidAmount = validateCreateFeeItemInput({
      name: 'Phí bảo trì',
      defaultAmount: -50000,
      unit: 'nam',
      exportElectronicInvoice: false,
    });
    assert.equal(invalidAmount.valid, false);
    assert.ok(invalidAmount.errors.defaultAmount);
  });

  test('BR04: Validates Edit Fee Item input omitting electronic invoice toggle', () => {
    const validEdit = validateEditFeeItemInput({
      name: 'Học STEAM Nâng Cao',
      defaultAmount: 600000,
      unit: 'thang',
    });
    assert.equal(validEdit.valid, true);

    const emptyName = validateEditFeeItemInput({
      name: '',
      defaultAmount: 500000,
      unit: 'thang',
    });
    assert.equal(emptyName.valid, false);
    assert.ok(emptyName.errors.name);
  });

  test('BR05: Filters student assignments by feeId, student search, and classId', () => {
    // Fee 'fee-cust-001' (Hoc STEAM) has 3 assignments in mock data
    const steamAssignments = filterStudentAssignments(
      INITIAL_STUDENT_FEE_ASSIGNMENTS,
      'fee-cust-001',
      '',
      'all'
    );
    assert.equal(steamAssignments.length, 3);

    // Filter by class 12A1
    const class12A1Only = filterStudentAssignments(
      INITIAL_STUDENT_FEE_ASSIGNMENTS,
      'fee-cust-001',
      '',
      'class-12a1'
    );
    assert.equal(class12A1Only.length, 1);
    assert.equal(class12A1Only[0].studentName, 'Nguyen Nguyen Thu');
    assert.equal(class12A1Only[0].appliedAmount, 500000);

    // Filter by student name keyword
    const searchNam = filterStudentAssignments(
      INITIAL_STUDENT_FEE_ASSIGNMENTS,
      'fee-cust-001',
      'Nam',
      'all'
    );
    assert.equal(searchNam.length, 1);
    assert.equal(searchNam[0].studentName, 'Trần Bảo Nam');

    // Fee with 0 assignments (Test khoan moi - fee-cust-005)
    const emptyFeeAssignments = filterStudentAssignments(
      INITIAL_STUDENT_FEE_ASSIGNMENTS,
      'fee-cust-005',
      '',
      'all'
    );
    assert.equal(emptyFeeAssignments.length, 0);
  });

  test('Redux State: toggleExportElectronicInvoiceInline mutates state immediately', () => {
    const initialState = schoolFeeReducer(undefined, { type: '@@INIT' });
    const targetFee = initialState.items.find((f) => f.id === 'fee-cust-001');
    assert.equal(targetFee.exportElectronicInvoice, true);

    // Toggle from true to false
    const state1 = schoolFeeReducer(
      initialState,
      toggleExportElectronicInvoiceInline({ feeId: 'fee-cust-001' })
    );
    const updated1 = state1.items.find((f) => f.id === 'fee-cust-001');
    assert.equal(updated1.exportElectronicInvoice, false);

    // Explicitly set to true
    const state2 = schoolFeeReducer(
      state1,
      toggleExportElectronicInvoiceInline({
        feeId: 'fee-cust-001',
        exportInvoice: true,
      })
    );
    const updated2 = state2.items.find((f) => f.id === 'fee-cust-001');
    assert.equal(updated2.exportElectronicInvoice, true);

    // Works on system fees as well (e.g. fee-sys-003 Phi tra tre from false to true)
    const sysFee = initialState.items.find((f) => f.id === 'fee-sys-003');
    assert.equal(sysFee.exportElectronicInvoice, false);
    const state3 = schoolFeeReducer(
      initialState,
      toggleExportElectronicInvoiceInline({
        feeId: 'fee-sys-003',
        exportInvoice: true,
      })
    );
    const updatedSys = state3.items.find((f) => f.id === 'fee-sys-003');
    assert.equal(updatedSys.exportElectronicInvoice, true);
  });

  test('Redux State: createFeeItem, updateFeeItem, and deleteFeeItem lifecycle', () => {
    let state = schoolFeeReducer(undefined, { type: '@@INIT' });
    const initialCustomCount = calculateCustomFeeCount(state.items);

    // 1. Create new custom fee
    state = schoolFeeReducer(
      state,
      createFeeItem({
        name: 'Câu lạc bộ Trí tuệ Nhân tạo',
        defaultAmount: 900000,
        unit: 'thang',
        exportElectronicInvoice: true,
        description: 'Lớp lập trình AI căn bản',
      })
    );
    assert.equal(calculateCustomFeeCount(state.items), initialCustomCount + 1);
    const created = state.items.find(
      (f) => f.name === 'Câu lạc bộ Trí tuệ Nhân tạo'
    );
    assert.ok(created);
    assert.equal(created.defaultAmount, 900000);
    assert.equal(created.unit, 'thang');
    assert.equal(created.type, 'custom');

    // 2. Update the custom fee
    state = schoolFeeReducer(
      state,
      updateFeeItem({
        id: created.id,
        data: {
          name: 'CLB Trí tuệ Nhân tạo & Robot',
          defaultAmount: 950000,
          unit: 'thang',
          description: 'Cập nhật giáo trình STEM AI',
        },
      })
    );
    const updated = state.items.find((f) => f.id === created.id);
    assert.equal(updated.name, 'CLB Trí tuệ Nhân tạo & Robot');
    assert.equal(updated.defaultAmount, 950000);

    // 3. Delete the custom fee
    state = schoolFeeReducer(state, deleteFeeItem(created.id));
    assert.equal(calculateCustomFeeCount(state.items), initialCustomCount);
    assert.equal(state.items.some((f) => f.id === created.id), false);

    // 4. Attempting to delete a system fee is guarded and blocked
    state = schoolFeeReducer(state, deleteFeeItem('fee-sys-001'));
    assert.ok(state.items.some((f) => f.id === 'fee-sys-001'));
  });

  test('Redux State: Modal dialog state toggles correctly', () => {
    let state = schoolFeeReducer(undefined, { type: '@@INIT' });
    assert.equal(state.isCreateModalOpen, false);
    assert.equal(state.editingFee, null);
    assert.equal(state.viewingAssignmentFee, null);

    state = schoolFeeReducer(state, openCreateModal());
    assert.equal(state.isCreateModalOpen, true);
    state = schoolFeeReducer(state, closeCreateModal());
    assert.equal(state.isCreateModalOpen, false);

    const customFee = state.items.find((f) => f.id === 'fee-cust-001');
    state = schoolFeeReducer(state, openEditModal(customFee));
    assert.equal(state.editingFee?.id, 'fee-cust-001');
    state = schoolFeeReducer(state, closeEditModal());
    assert.equal(state.editingFee, null);

    state = schoolFeeReducer(state, openAssignmentModal(customFee));
    assert.equal(state.viewingAssignmentFee?.id, 'fee-cust-001');
    state = schoolFeeReducer(state, closeAssignmentModal());
    assert.equal(state.viewingAssignmentFee, null);
  });

  test('Unit filter and sorting logic for Fee Catalog', () => {
    // 1. Filter by unit 'thang'
    const thangFees = filterFeeItems(INITIAL_SCHOOL_FEES, {
      search: '',
      exportElectronicInvoiceFilter: 'all',
      unitFilter: 'thang',
      sortUnit: 'none',
    });
    assert.ok(thangFees.length > 0);
    thangFees.forEach((fee) => {
      assert.equal(fee.unit, 'thang');
    });

    // 2. Sort by unit ascending
    const ascSorted = filterFeeItems(INITIAL_SCHOOL_FEES, {
      search: '',
      exportElectronicInvoiceFilter: 'all',
      unitFilter: 'all',
      sortUnit: 'asc',
    });
    assert.equal(ascSorted.length, INITIAL_SCHOOL_FEES.length);
    // Custom fees with defined units should come first and be sorted
    const customWithUnits = ascSorted.filter((f) => f.unit);
    for (let i = 0; i < customWithUnits.length - 1; i++) {
      const labelA = FEE_UNIT_LABELS[customWithUnits[i].unit] || customWithUnits[i].unit;
      const labelB = FEE_UNIT_LABELS[customWithUnits[i + 1].unit] || customWithUnits[i + 1].unit;
      assert.ok(labelA.localeCompare(labelB, 'vi') <= 0);
    }

    // 3. Sort by unit descending
    const descSorted = filterFeeItems(INITIAL_SCHOOL_FEES, {
      search: '',
      exportElectronicInvoiceFilter: 'all',
      unitFilter: 'all',
      sortUnit: 'desc',
    });
    const descCustomWithUnits = descSorted.filter((f) => f.unit);
    for (let i = 0; i < descCustomWithUnits.length - 1; i++) {
      const labelA = FEE_UNIT_LABELS[descCustomWithUnits[i].unit] || descCustomWithUnits[i].unit;
      const labelB = FEE_UNIT_LABELS[descCustomWithUnits[i + 1].unit] || descCustomWithUnits[i + 1].unit;
      assert.ok(labelA.localeCompare(labelB, 'vi') >= 0);
    }
  });
});

