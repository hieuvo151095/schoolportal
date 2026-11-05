import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  isBreakfastFeeItem,
  isStudentPayingBreakfastFee,
  isSchoolRefundingBreakfast,
  evaluateStudentBreakfastRefundEligibility,
  formatCurrencyVND,
  formatFeeUnitDisplay,
} from '../../src/utils/studentFeeCalculation.ts';
import { calculateMealRefundForStudent } from '../../src/utils/mealRefundCalculation.ts';
import studentReducer, {
  updateStudentFees,
} from '../../src/store/slices/studentSlice.ts';

describe('Student Fee Items & Breakfast Meal Refund Integration (Thiết Lập Học Phí Từng Trẻ & Hoàn Tiền Ăn Sáng)', () => {
  const mockStudentWithoutBreakfast = {
    id: '83',
    schoolCode: 'demo',
    studentCode: '9192930044',
    fullName: 'Nguyễn Trí Bình An',
    className: 'Lớp 11A1',
    status: 'active',
    feeItems: [
      {
        id: 'sfee-83-1',
        feeId: 'fee-sys-001',
        code: 'HOC_PHI',
        name: 'Học phí',
        amount: 200000,
        unit: 'thang',
        exportElectronicInvoice: true,
        isMandatory: true,
      },
      {
        id: 'sfee-83-2',
        feeId: 'fee-sys-002',
        code: 'TIEN_AN',
        name: 'Tiền ăn',
        amount: 35000,
        unit: 'ngay',
        exportElectronicInvoice: true,
        isMandatory: true,
      },
      {
        id: 'sfee-83-3',
        feeId: 'fee-cust-011',
        code: 'HOC_LIEU_LS',
        name: 'Học liệu Lịch sử',
        amount: 280000,
        unit: 'nam',
        exportElectronicInvoice: false,
      },
      {
        id: 'sfee-83-4',
        feeId: 'fee-cust-012',
        code: 'NGOAI_KHOA',
        name: 'Ngoại khóa',
        amount: 0,
        unit: 'thang',
        exportElectronicInvoice: false,
      },
      {
        id: 'sfee-83-5',
        feeId: 'fee-cust-013',
        code: 'TIENG_ANH',
        name: 'Tiếng Anh',
        amount: 1000,
        unit: 'thang',
        exportElectronicInvoice: false,
      },
    ],
  };

  const mockStudentWithBreakfast = {
    ...mockStudentWithoutBreakfast,
    feeItems: [
      ...mockStudentWithoutBreakfast.feeItems,
      {
        id: 'sfee-83-6',
        feeId: 'fee-cust-022',
        code: 'TIEN_AN_SANG',
        name: 'Ăn sáng',
        amount: 500000,
        unit: 'thang',
        exportElectronicInvoice: true,
      },
    ],
  };

  const mockAbsenceBreakdown = {
    studentId: '83',
    studentName: 'Nguyễn Trí Bình An',
    className: 'Lớp 11A1',
    month: '2026-09',
    selfAbsenceDays: 3,
    selfAbsenceDates: ['2026-09-10', '2026-09-11', '2026-09-12'],
  };

  const mockMealPricing = {
    mainMealUnitPrice: 35000,
    breakfastUnitPrice: 25000,
  };

  describe('1. Breakfast Fee Item Detection & Student Payment Status', () => {
    test('isBreakfastFeeItem correctly matches various naming and coding variants', () => {
      assert.equal(isBreakfastFeeItem({ name: 'Ăn sáng' }), true);
      assert.equal(isBreakfastFeeItem({ name: 'Tiền ăn sáng' }), true);
      assert.equal(isBreakfastFeeItem({ code: 'TIEN_AN_SANG' }), true);
      assert.equal(isBreakfastFeeItem({ code: 'AN_SANG' }), true);
      assert.equal(isBreakfastFeeItem({ feeId: 'fee-cust-022' }), true);

      assert.equal(isBreakfastFeeItem({ name: 'Học phí' }), false);
      assert.equal(isBreakfastFeeItem({ name: 'Tiền ăn bán trú' }), false);
      assert.equal(isBreakfastFeeItem({ name: 'Tiếng Anh' }), false);
    });

    test('isStudentPayingBreakfastFee returns false when student has no breakfast fee item', () => {
      assert.equal(isStudentPayingBreakfastFee(mockStudentWithoutBreakfast), false);
    });

    test('isStudentPayingBreakfastFee returns true when student has breakfast fee item with amount > 0', () => {
      assert.equal(isStudentPayingBreakfastFee(mockStudentWithBreakfast), true);
    });

    test('isStudentPayingBreakfastFee returns false when breakfast amount is 0', () => {
      const studentWithZeroBf = {
        ...mockStudentWithoutBreakfast,
        feeItems: [
          ...mockStudentWithoutBreakfast.feeItems,
          {
            id: 'sfee-0',
            name: 'Ăn sáng',
            amount: 0,
            unit: 'thang',
            exportElectronicInvoice: false,
          },
        ],
      };
      assert.equal(isStudentPayingBreakfastFee(studentWithZeroBf), false);
    });
  });

  describe('2. School Breakfast Refund Configuration Check', () => {
    test('isSchoolRefundingBreakfast returns true when enabled and breakfast rate > 0', () => {
      const config = {
        isEnabled: true,
        excusedRates: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        unexcusedRates: { mainMealRatePercent: 0, breakfastRatePercent: 0 },
      };
      assert.equal(isSchoolRefundingBreakfast(config), true);
    });

    test('isSchoolRefundingBreakfast returns false when meal refund is disabled', () => {
      const config = {
        isEnabled: false,
        excusedRates: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
      };
      assert.equal(isSchoolRefundingBreakfast(config), false);
    });

    test('isSchoolRefundingBreakfast returns false when breakfast rate is 0', () => {
      const config = {
        isEnabled: true,
        excusedRates: { mainMealRatePercent: 50, breakfastRatePercent: 0 },
        rates: { mainMealRatePercent: 50, breakfastRatePercent: 0 },
      };
      assert.equal(isSchoolRefundingBreakfast(config), false);
    });
  });

  describe('3. Core Cross-Module Refund Scenarios (User Requirements)', () => {
    // Case 1: Student pays breakfast + School configures breakfast refund -> REFUND
    test('Case 1: Student pays breakfast and school configures refund -> Breakfast is refunded', () => {
      const schoolConfig = {
        isEnabled: true,
        excusedRates: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        unexcusedRates: { mainMealRatePercent: 0, breakfastRatePercent: 0 },
      };

      const evalResult = evaluateStudentBreakfastRefundEligibility(mockStudentWithBreakfast, schoolConfig);
      assert.equal(evalResult.status, 'eligible');
      assert.equal(evalResult.isRefunded, true);
      assert.equal(evalResult.studentPaysBreakfast, true);
      assert.equal(evalResult.schoolRefundsBreakfast, true);

      // Verify calculation output
      const refundResult = calculateMealRefundForStudent(
        mockAbsenceBreakdown,
        mockMealPricing,
        schoolConfig.excusedRates,
        '2026-10',
        undefined,
        { isPayingBreakfast: true }
      );

      const bfItem = refundResult.items.find((it) => it.category === 'tien_an_sang');
      assert.ok(bfItem);
      // 3 days * 25,000 * 70% = 52,500 VND
      assert.equal(bfItem.totalRefundAmount, 52500);
      assert.ok(refundResult.totalMealRefund > 0);
    });

    // Case 2: Student pays breakfast + School does NOT configure refund -> NO REFUND
    test('Case 2: Student pays breakfast but school does NOT configure refund -> No refund for breakfast', () => {
      const schoolConfigWithoutBfRefund = {
        isEnabled: true,
        excusedRates: { mainMealRatePercent: 50, breakfastRatePercent: 0 },
        unexcusedRates: { mainMealRatePercent: 0, breakfastRatePercent: 0 },
      };

      const evalResult = evaluateStudentBreakfastRefundEligibility(mockStudentWithBreakfast, schoolConfigWithoutBfRefund);
      assert.equal(evalResult.status, 'school_disabled');
      assert.equal(evalResult.isRefunded, false);
      assert.equal(evalResult.studentPaysBreakfast, true);
      assert.equal(evalResult.schoolRefundsBreakfast, false);

      // Verify calculation output: breakfast refund must be 0 VND
      const refundResult = calculateMealRefundForStudent(
        mockAbsenceBreakdown,
        mockMealPricing,
        schoolConfigWithoutBfRefund.excusedRates,
        '2026-10',
        undefined,
        { isPayingBreakfast: true }
      );

      const bfItem = refundResult.items.find((it) => it.category === 'tien_an_sang');
      assert.ok(bfItem);
      assert.equal(bfItem.totalRefundAmount, 0);
      assert.ok(bfItem.explanation.includes('Nhà trường không thiết lập hoàn tiền ăn sáng'));
    });

    // Case 3: Student does NOT pay breakfast -> DEFINITELY NO REFUND (regardless of school setting)
    test('Case 3A: Student does not pay breakfast (school configures refund) -> Definitely no refund', () => {
      const schoolConfigWithBfRefund = {
        isEnabled: true,
        excusedRates: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
      };

      const evalResult = evaluateStudentBreakfastRefundEligibility(mockStudentWithoutBreakfast, schoolConfigWithBfRefund);
      assert.equal(evalResult.status, 'student_not_paying');
      assert.equal(evalResult.isRefunded, false);
      assert.equal(evalResult.studentPaysBreakfast, false);

      // Verify calculation output: breakfast refund is 0 VND
      const refundResult = calculateMealRefundForStudent(
        mockAbsenceBreakdown,
        mockMealPricing,
        schoolConfigWithBfRefund.excusedRates,
        '2026-10',
        undefined,
        { isPayingBreakfast: false }
      );

      const bfItem = refundResult.items.find((it) => it.category === 'tien_an_sang');
      assert.ok(bfItem);
      assert.equal(bfItem.totalRefundAmount, 0);
      assert.ok(bfItem.explanation.includes('Học sinh không trả tiền ăn sáng'));
    });

    test('Case 3B: Student does not pay breakfast (school does not configure refund) -> Definitely no refund', () => {
      const schoolConfigWithoutBfRefund = {
        isEnabled: false,
        excusedRates: { mainMealRatePercent: 0, breakfastRatePercent: 0 },
      };

      const evalResult = evaluateStudentBreakfastRefundEligibility(mockStudentWithoutBreakfast, schoolConfigWithoutBfRefund);
      assert.equal(evalResult.status, 'student_not_paying');
      assert.equal(evalResult.isRefunded, false);
      assert.equal(evalResult.studentPaysBreakfast, false);
    });
  });

  describe('4. Redux State Mutation & Student Fee Updating', () => {
    test('updateStudentFees successfully updates student feeItems and feeNotes', () => {
      const initialState = {
        students: [mockStudentWithoutBreakfast],
        selectedStudentId: null,
        filter: { search: '', classId: 'all', status: 'all', gender: 'all' },
        loading: false,
      };

      const newFees = [
        ...mockStudentWithoutBreakfast.feeItems,
        {
          id: 'sfee-83-6',
          feeId: 'fee-cust-022',
          code: 'TIEN_AN_SANG',
          name: 'Ăn sáng',
          amount: 500000,
          unit: 'thang',
          exportElectronicInvoice: true,
        },
      ];

      const nextState = studentReducer(
        initialState,
        updateStudentFees({
          studentId: '83',
          feeItems: newFees,
          feeNotes: 'Ghi chú cập nhật ăn sáng',
        })
      );

      const updated = nextState.students.find((s) => s.id === '83');
      assert.ok(updated);
      assert.equal(updated.feeItems.length, 6);
      assert.equal(updated.feeNotes, 'Ghi chú cập nhật ăn sáng');
      assert.equal(isStudentPayingBreakfastFee(updated), true);
    });
  });

  describe('5. Formatting & Presentation Helpers', () => {
    test('formatCurrencyVND formats numbers with dot separators', () => {
      assert.equal(formatCurrencyVND(200000), '200.000');
      assert.equal(formatCurrencyVND(35000), '35.000');
      assert.equal(formatCurrencyVND(0), '0');
      assert.equal(formatCurrencyVND(null), '0');
    });

    test('formatFeeUnitDisplay handles all Vietnamese time intervals', () => {
      assert.equal(formatFeeUnitDisplay('thang'), 'Đ/tháng');
      assert.equal(formatFeeUnitDisplay('ngay'), 'Đ/ngày');
      assert.equal(formatFeeUnitDisplay('nam'), 'Đ/năm');
      assert.equal(formatFeeUnitDisplay('lan'), 'Đ/lần');
    });
  });
});
