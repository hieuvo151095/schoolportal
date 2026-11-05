/**
 * Automated Unit Test Suite for Finance - Tuition Exemption & Discount Policies (Miễn Giảm)
 * Tests ADR-012, Resolution K016, Resolution K017, Resolution K018, and Redux state machine.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  formatCurrency,
  formatDiscountValue,
  calculateDiscountDeduction,
  isPolicyActiveForMonth,
  evaluatePolicyStatus,
  resolveStudentDiscounts,
  matchesDiscountFilter,
  validateDiscountPolicyForm,
  findStudentDiscountConflicts,
} from '../../src/utils/discountValidation.ts';

import discountReducer, {
  setFilter,
  resetFilter,
  createDiscountPolicy,
  updateDiscountPolicy,
  togglePolicyStatus,
  deleteDiscountPolicy,
} from '../../src/store/slices/discountSlice.ts';

import {
  INITIAL_DISCOUNT_POLICIES,
  AVAILABLE_FEE_ITEMS_FOR_DISCOUNT,
  AVAILABLE_STUDENTS_FOR_DISCOUNT,
  getApplicableFeeItemsForTargets,
  ALL_24_SCHOOL_FEES,
  CLASS_FEE_NUMBERS_MAP,
} from '../../src/services/mockDiscountData.ts';

describe('Finance Discount (Miễn Giảm) Business Rules & Calculation Engine', () => {

  test('formatCurrency and formatDiscountValue display Vietnamese formatting correctly', () => {
    assert.equal(formatCurrency(1500000), '1.500.000');
    assert.equal(formatCurrency(250000), '250.000');
    assert.equal(formatCurrency(0), '0');

    assert.equal(formatDiscountValue('percent', 50), '50%');
    assert.equal(formatDiscountValue('percent', 100), '100%');
    assert.equal(formatDiscountValue('fixed_amount', 200000), '200.000 đ');
  });

  test('calculateDiscountDeduction: percentage rate deduction arithmetic', () => {
    // 50% of 2.500.000 = 1.250.000
    const deduction50 = calculateDiscountDeduction(2500000, {
      discountType: 'percent',
      discountValue: 50,
    });
    assert.equal(deduction50, 1250000);

    // 20% of 2.500.000 = 500.000
    const deduction20 = calculateDiscountDeduction(2500000, {
      discountType: 'percent',
      discountValue: 20,
    });
    assert.equal(deduction20, 500000);

    // 100% of 850.000 = 850.000 (Full waiver)
    const deduction100 = calculateDiscountDeduction(850000, {
      discountType: 'percent',
      discountValue: 100,
    });
    assert.equal(deduction100, 850000);
  });

  test('calculateDiscountDeduction: fixed amount deduction and non-negative clamping (BR05)', () => {
    // Fixed 200.000 on 600.000 gross fee
    const deductionFixed = calculateDiscountDeduction(600000, {
      discountType: 'fixed_amount',
      discountValue: 200000,
    });
    assert.equal(deductionFixed, 200000);

    // Clamping test: Fixed 500.000 on 300.000 gross fee is clamped to 300.000 (cannot exceed gross)
    const clampedDeduction = calculateDiscountDeduction(300000, {
      discountType: 'fixed_amount',
      discountValue: 500000,
    });
    assert.equal(clampedDeduction, 300000);

    // Zero or negative input handling
    assert.equal(
      calculateDiscountDeduction(0, { discountType: 'percent', discountValue: 50 }),
      0
    );
    assert.equal(
      calculateDiscountDeduction(500000, { discountType: 'fixed_amount', discountValue: 0 }),
      0
    );
  });

  test('Temporal State Machine & Expiration (Resolution K017)', () => {
    const activePolicy = INITIAL_DISCOUNT_POLICIES.find((p) => p.id === 'disc-001');
    assert.ok(activePolicy);
    assert.equal(isPolicyActiveForMonth(activePolicy, '2026-10'), true);

    const expiredPolicy = INITIAL_DISCOUNT_POLICIES.find((p) => p.id === 'disc-005');
    assert.ok(expiredPolicy);
    assert.equal(isPolicyActiveForMonth(expiredPolicy, '2026-10'), false);

    // Dynamic status evaluation with future date
    const testPolicy = {
      ...activePolicy,
      validityType: 'month_range',
      fromMonth: '2025-01',
      toMonth: '2025-12',
    };
    const statusAt2026 = evaluatePolicyStatus(testPolicy, new Date('2026-09-01'));
    assert.equal(statusAt2026, 'expired');
  });

  test('Resolution K016: Scope Specificity - Student discount overrides class discount for same fee item', () => {
    // Student HS-001 (Huy) in Class 10A1:
    // Has individual 50% discount on Học phí (disc-001)
    // AND Class 10A1 has 20% discount on Học phí (disc-002)
    const studentHuy = { id: 'hs-001', fullName: 'Nguyễn Gia Huy', classId: 'class-10a1' };
    const feeItems = [
      { id: 'fee-01', name: 'Học phí chính khóa', amount: 2500000 },
    ];

    const result = resolveStudentDiscounts(
      studentHuy,
      feeItems,
      INITIAL_DISCOUNT_POLICIES,
      '2026-10'
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].policyCode, 'MG-2026-001');
    assert.equal(result[0].discountValue, 50);
    // 50% of 2.500.000 = 1.250.000 (Student policy Y 50% > Class policy X 20%, highest value is automatically applied)
    assert.equal(result[0].deductionAmount, 1250000);
  });

  test('Highest Discount Priority: When student has lower personal discount than class discount, highest (class) is applied', () => {
    // Scenario: Student has Class policy X (20% on fee-01) AND individual policy Y with only 10% on fee-01.
    // The system MUST automatically apply the higher value (20% from class policy X = 500.000 đ)
    // to preserve maximum benefit for the student.
    const studentWithSmallPersonal = { id: 'hs-test-low', fullName: 'Học sinh Ưu đãi thấp', classId: 'class-10a1' };
    const feeItems = [
      { id: 'fee-01', name: 'Học phí chính khóa', amount: 2500000 },
    ];

    const testPolicies = [
      // Program X: Class 10A1 (20% = 500.000)
      {
        id: 'policy-class-x',
        code: 'MG-CLASS-X',
        name: 'Chính sách lớp 10A1 (20%)',
        discountType: 'percent',
        discountValue: 20,
        feeItemId: 'fee-01',
        scopeType: 'class',
        status: 'active',
        targets: [{ targetType: 'class', targetId: 'class-10a1' }],
      },
      // Program Y: Individual Student (10% = 250.000)
      {
        id: 'policy-student-y',
        code: 'MG-STUDENT-Y',
        name: 'Chính sách cá nhân (10%)',
        discountType: 'percent',
        discountValue: 10,
        feeItemId: 'fee-01',
        scopeType: 'student',
        status: 'active',
        targets: [{ targetType: 'student', targetId: 'hs-test-low' }],
      },
    ];

    const result = resolveStudentDiscounts(
      studentWithSmallPersonal,
      feeItems,
      testPolicies,
      '2026-10'
    );

    assert.equal(result.length, 1);
    // Program X (20%) MUST be applied because 500.000 > 250.000
    assert.equal(result[0].policyCode, 'MG-CLASS-X');
    assert.equal(result[0].discountValue, 20);
    assert.equal(result[0].deductionAmount, 500000);
  });

  test('Highest Discount Priority: Tie-breaker prefers student-specific policy when deductions are equal', () => {
    const student = { id: 'hs-tie', fullName: 'Học sinh Cân Bằng', classId: 'class-10a1' };
    const feeItems = [
      { id: 'fee-01', name: 'Học phí chính khóa', amount: 2500000 },
    ];

    const tiePolicies = [
      {
        id: 'policy-class-tie',
        code: 'MG-CLASS-TIE',
        name: 'Chính sách lớp (20%)',
        discountType: 'percent',
        discountValue: 20,
        feeItemId: 'fee-01',
        scopeType: 'class',
        status: 'active',
        targets: [{ targetType: 'class', targetId: 'class-10a1' }],
      },
      {
        id: 'policy-student-tie',
        code: 'MG-STUDENT-TIE',
        name: 'Chính sách cá nhân (cố định 500.000 đ)',
        discountType: 'fixed_amount',
        discountValue: 500000,
        feeItemId: 'fee-01',
        scopeType: 'student',
        status: 'active',
        targets: [{ targetType: 'student', targetId: 'hs-tie' }],
      },
    ];

    const result = resolveStudentDiscounts(student, feeItems, tiePolicies, '2026-10');
    assert.equal(result.length, 1);
    assert.equal(result[0].policyCode, 'MG-STUDENT-TIE');
    assert.equal(result[0].deductionAmount, 500000);
  });

  test('findStudentDiscountConflicts detects existing class policy X when creating student policy Y (Y > X) and generates alert message', () => {
    // Student HS-003 (Trần Minh Trí) in Class 10A2 has existing active class policy disc-002 (20% on fee-01).
    // Now creating a new individual policy for HS-003 with 50% on fee-01 (Y > X).
    const conflicts = findStudentDiscountConflicts(
      ['hs-003'],
      'fee-01',
      'percent',
      50,
      INITIAL_DISCOUNT_POLICIES,
      AVAILABLE_STUDENTS_FOR_DISCOUNT,
      AVAILABLE_FEE_ITEMS_FOR_DISCOUNT
    );

    assert.equal(conflicts.length, 1);
    const conflict = conflicts[0];
    assert.equal(conflict.studentId, 'hs-003');
    assert.equal(conflict.studentName, 'Trần Minh Trí');
    assert.equal(conflict.className, 'Lớp 10A2');
    assert.equal(conflict.existingPolicy.code, 'MG-2026-002');
    assert.equal(conflict.existingDeductionFormatted, '20%');
    assert.equal(conflict.newDeductionFormatted, '50%');
    assert.equal(conflict.isNewHigher, true);
    assert.equal(conflict.isExistingHigher, false);
    assert.ok(conflict.resolutionMessage.includes('chính sách cũ sẽ không còn áp dụng cho học sinh này'));
  });

  test('Resolution K016: Class-wide discount applies when student has no individual policy', () => {
    // Student HS-999 in Class 10A1 with no personal discount
    const standardStudent = { id: 'hs-999', fullName: 'Học sinh chuẩn', classId: 'class-10a1' };
    const feeItems = [
      { id: 'fee-01', name: 'Học phí chính khóa', amount: 2500000 },
    ];

    const result = resolveStudentDiscounts(
      standardStudent,
      feeItems,
      INITIAL_DISCOUNT_POLICIES,
      '2026-10'
    );

    assert.equal(result.length, 1);
    assert.equal(result[0].policyCode, 'MG-2026-002');
    assert.equal(result[0].discountValue, 20);
    // 20% of 2.500.000 = 500.000
    assert.equal(result[0].deductionAmount, 500000);
  });

  test('Resolution K016: Disjoint line-item independence across fee categories', () => {
    // Student HS-003 (Trần Minh Trí) in Class 10A2:
    // Class 10A2 has 20% discount on Học phí (fee-01)
    // AND Student has 100% discount on Tiền ăn (fee-02)
    const studentTri = { id: 'hs-003', fullName: 'Trần Minh Trí', classId: 'class-10a2' };
    const feeItems = [
      { id: 'fee-01', name: 'Học phí chính khóa', amount: 2500000 },
      { id: 'fee-02', name: 'Tiền ăn bán trú', amount: 850000 },
    ];

    const result = resolveStudentDiscounts(
      studentTri,
      feeItems,
      INITIAL_DISCOUNT_POLICIES,
      '2026-10'
    );

    assert.equal(result.length, 2);

    const tuitionDisc = result.find((d) => d.feeItemId === 'fee-01');
    const mealDisc = result.find((d) => d.feeItemId === 'fee-02');

    assert.ok(tuitionDisc);
    assert.ok(mealDisc);
    assert.equal(tuitionDisc.deductionAmount, 500000); // 20% of 2.500.000
    assert.equal(mealDisc.deductionAmount, 850000);   // 100% of 850.000
  });

  test('validateDiscountPolicyForm rejects incomplete or invalid payloads', () => {
    const emptyErrors = validateDiscountPolicyForm({});
    assert.ok(emptyErrors.name);
    assert.ok(emptyErrors.discountType);
    assert.ok(emptyErrors.discountValue);
    assert.ok(emptyErrors.feeItemId);
    assert.ok(emptyErrors.targetIds);

    const invalidPercent = validateDiscountPolicyForm({
      name: 'Chính sách test',
      discountType: 'percent',
      discountValue: 150, // Invalid >100%
      feeItemId: 'fee-01',
      scopeType: 'class',
      targetIds: ['class-10a1'],
      validityType: 'month_range',
      fromMonth: '2026-10',
      toMonth: '2026-09', // Inverted
    });

    assert.equal(invalidPercent.discountValue, 'Mức giảm phần trăm phải từ 1% đến 100%');
    assert.equal(invalidPercent.toMonth, 'Tháng kết thúc phải sau hoặc bằng tháng bắt đầu');

    const validPayload = validateDiscountPolicyForm({
      name: 'Chính sách hợp lệ',
      discountType: 'percent',
      discountValue: 30,
      feeItemId: 'fee-01',
      scopeType: 'class',
      targetIds: ['class-10a1'],
      validityType: 'academic_year',
      academicYearId: 'ay-2026-2027',
    });
    assert.equal(Object.keys(validPayload).length, 0);
  });

  test('matchesDiscountFilter: substring search and status filter', () => {
    const policy = INITIAL_DISCOUNT_POLICIES[0]; // Học bổng tài năng 50%

    // Text search
    assert.equal(
      matchesDiscountFilter(policy, { search: 'tài năng', statusFilter: 'all' }),
      true
    );
    assert.equal(
      matchesDiscountFilter(policy, { search: 'MG-2026-001', statusFilter: 'all' }),
      true
    );
    assert.equal(
      matchesDiscountFilter(policy, { search: 'Nguyễn Gia Huy', statusFilter: 'all' }),
      true
    );
    assert.equal(
      matchesDiscountFilter(policy, { search: 'không có trong đây', statusFilter: 'all' }),
      false
    );

    // Status filter
    assert.equal(
      matchesDiscountFilter(policy, { search: '', statusFilter: 'active' }),
      true
    );
    assert.equal(
      matchesDiscountFilter(policy, { search: '', statusFilter: 'expired' }),
      false
    );
  });

  test('Redux State Machine: create, pause, resume, update, and delete', () => {
    let state = discountReducer(undefined, { type: '@@INIT' });
    const initialCount = state.policies.length;

    // 1. Create Policy
    state = discountReducer(
      state,
      createDiscountPolicy({
        name: 'Học bổng tân sinh viên',
        discountType: 'fixed_amount',
        discountValue: 1000000,
        feeItemId: 'fee-01',
        scopeType: 'class',
        targetIds: ['class-10a1'],
        validityType: 'month_range',
        fromMonth: '2026-09',
        toMonth: '2026-12',
        reason: 'Khuyến khích thủ khoa',
      })
    );
    assert.equal(state.policies.length, initialCount + 1);
    const createdPolicy = state.policies[0];
    assert.equal(createdPolicy.name, 'Học bổng tân sinh viên');
    assert.equal(createdPolicy.status, 'active');

    // 2. Pause Policy
    state = discountReducer(state, togglePolicyStatus(createdPolicy.id));
    assert.equal(state.policies[0].status, 'paused');

    // 3. Resume Policy
    state = discountReducer(state, togglePolicyStatus(createdPolicy.id));
    assert.equal(state.policies[0].status, 'active');

    // 4. Update Policy
    state = discountReducer(
      state,
      updateDiscountPolicy({
        id: createdPolicy.id,
        name: 'Học bổng tân sinh viên (Cập nhật)',
        discountType: 'fixed_amount',
        discountValue: 1500000,
        feeItemId: 'fee-01',
        scopeType: 'class',
        targetIds: ['class-10a1'],
        validityType: 'month_range',
        fromMonth: '2026-09',
        toMonth: '2026-12',
        reason: 'Tăng mức thưởng',
      })
    );
    assert.equal(state.policies[0].name, 'Học bổng tân sinh viên (Cập nhật)');
    assert.equal(state.policies[0].discountValue, 1500000);

    // 5. Delete Policy
    state = discountReducer(state, deleteDiscountPolicy(createdPolicy.id));
    assert.equal(state.policies.length, initialCount);

    // 6. Filter actions
    state = discountReducer(state, setFilter({ search: 'MG-2026', statusFilter: 'active' }));
    assert.equal(state.filters.search, 'MG-2026');
    assert.equal(state.filters.statusFilter, 'active');
    state = discountReducer(state, resetFilter());
    assert.equal(state.filters.search, '');
    assert.equal(state.filters.statusFilter, 'all');
  });

  test('getApplicableFeeItemsForTargets: intersection across multiple classes', () => {
    // Class 10A1: [1, 2, 5, 6, 7]
    const fees10A1 = getApplicableFeeItemsForTargets('class', ['class-10a1']);
    assert.equal(fees10A1.length, 5);
    const feeNums10A1 = fees10A1.map((f) => f.feeNumber);
    assert.deepEqual(feeNums10A1, [1, 2, 5, 6, 7]);

    // Class 11A1: [1, 2, 10, 11, 15]
    const fees11A1 = getApplicableFeeItemsForTargets('class', ['class-11a1']);
    assert.equal(fees11A1.length, 5);
    const feeNums11A1 = fees11A1.map((f) => f.feeNumber);
    assert.deepEqual(feeNums11A1, [1, 2, 10, 11, 15]);

    // Intersection when both 10A1 and 11A1 are selected: only [1, 2]
    const intersectionFees = getApplicableFeeItemsForTargets('class', ['class-10a1', 'class-11a1']);
    assert.equal(intersectionFees.length, 2);
    const intersectionFeeNums = intersectionFees.map((f) => f.feeNumber);
    assert.deepEqual(intersectionFeeNums, [1, 2]);
    assert.equal(intersectionFees[0].name, 'Học phí chính khóa');
    assert.equal(intersectionFees[1].name, 'Tiền ăn bán trú');
  });

  test('Single Policy per Fee Item: creating new policy excludes student from old class policy', () => {
    let state = discountReducer(undefined, { type: '@@INIT' });

    // In initial mock data, Class 10A1 has disc-002 (20% on fee-01).
    // Now create a new policy for student hs-001 with 70% on fee-01 (fee-sys-001).
    state = discountReducer(
      state,
      createDiscountPolicy({
        name: 'Học bổng đặc biệt 70%',
        discountType: 'percent',
        discountValue: 70,
        feeItemId: 'fee-sys-001',
        scopeType: 'student',
        targetIds: ['hs-001'],
        validityType: 'academic_year',
        academicYearId: 'ay-2026-2027',
        reason: 'Học sinh xuất sắc',
        confirmReplacement: true,
      })
    );

    // Verify disc-002 has hs-001 in excludedStudentIds
    const oldClassPolicy = state.policies.find((p) => p.id === 'disc-002');
    assert.ok(oldClassPolicy);
    assert.ok(oldClassPolicy.excludedStudentIds?.includes('hs-001'));

    // Verify old student policy disc-001 (which also targeted hs-001 for tuition) had hs-001 removed
    const oldStudentPolicy = state.policies.find((p) => p.id === 'disc-001');
    assert.ok(oldStudentPolicy);
    assert.equal(
      oldStudentPolicy.targets.some((t) => t.targetId === 'hs-001'),
      false
    );

    // Verify resolveStudentDiscounts for hs-001 returns ONLY the new 70% policy
    const studentHuy = { id: 'hs-001', fullName: 'Nguyễn Gia Huy', classId: 'class-10a1' };
    const feeItems = [{ id: 'fee-sys-001', name: 'Học phí chính khóa', amount: 2500000 }];
    const resolved = resolveStudentDiscounts(studentHuy, feeItems, state.policies, '2026-10');
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].discountValue, 70);
    assert.equal(resolved[0].deductionAmount, 1750000); // 70% of 2.500.000
  });

});
