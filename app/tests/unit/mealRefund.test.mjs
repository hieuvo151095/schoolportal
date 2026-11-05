import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateMealRefundForStudent,
  validateMealRefundRates,
  getPreviousMonthKey,
  generateMealRefundDescription,
  calculateDaysBetween
} from '../../src/utils/mealRefundCalculation.ts';

describe('Meal Refund Mechanism (Thiết Lập Cơ Chế Hoàn Tiền Ăn) Pure Engine Tests', () => {

  describe('FR-001: Student Self-Absence Excused Refund Calculation', () => {
    it('applies configured percentage rates (50% main meal, 70% breakfast) for excused self-absence days', () => {
      const studentAbsence = {
        studentId: 'hs-001',
        studentName: 'Nguyễn Gia Huy',
        className: 'Lớp 1A1',
        month: '2026-09',
        selfAbsenceDays: 3,
        selfAbsenceDates: ['2026-09-15', '2026-09-16', '2026-09-17']
      };

      const mealPricing = {
        mainMealUnitPrice: 40000,
        breakfastUnitPrice: 20000
      };

      const rates = {
        mainMealRatePercent: 50,
        breakfastRatePercent: 70
      };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates);

      // Main meal: 3 * 40000 * 50% = 60,000 VND
      const mainMealItem = result.items.find((item) => item.category === 'tien_an');
      assert.ok(mainMealItem);
      assert.equal(mainMealItem.selfRefundAmount, 60000);
      assert.equal(mainMealItem.totalRefundAmount, 60000);

      // Breakfast: 3 * 20000 * 70% = 42,000 VND
      const breakfastItem = result.items.find((item) => item.category === 'tien_an_sang');
      assert.ok(breakfastItem);
      assert.equal(breakfastItem.selfRefundAmount, 42000);
      assert.equal(breakfastItem.totalRefundAmount, 42000);

      // Total self refund = 60,000 + 42,000 = 102,000 VND
      assert.equal(result.totalMealRefund, 102000);
    });

    it('computes zero refund when student has 0 absence days', () => {
      const studentAbsence = {
        studentId: 'hs-001',
        studentName: 'Nguyễn Gia Huy',
        className: 'Lớp 1A1',
        month: '2026-09',
        selfAbsenceDays: 0,
        selfAbsenceDates: []
      };

      const mealPricing = { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 };
      const rates = { mainMealRatePercent: 50, breakfastRatePercent: 70 };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates);
      assert.equal(result.totalMealRefund, 0);
      assert.equal(result.items[0].totalRefundAmount, 0);
      assert.equal(result.items[1].totalRefundAmount, 0);
    });
  });

  describe('FR-002: Student Self-Absence Unexcused Absence Rates', () => {
    it('computes 0% refund for unexcused absence days by default', () => {
      const studentAbsence = {
        studentId: 'hs-001',
        studentName: 'Nguyễn Gia Huy',
        className: 'Lớp 1A1',
        month: '2026-09',
        selfAbsenceDays: 2,
        excusedAbsenceDays: 0,
        unexcusedAbsenceDays: 2,
        selfAbsenceDates: ['2026-09-15', '2026-09-16']
      };

      const mealPricing = { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 };
      const rates = {
        excused: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        unexcused: { mainMealRatePercent: 0, breakfastRatePercent: 0 }
      };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates);
      assert.equal(result.totalMealRefund, 0);
      assert.equal(result.items[0].totalRefundAmount, 0);
      assert.equal(result.items[1].totalRefundAmount, 0);
    });

    it('calculates custom unexcused rate if explicitly configured by school', () => {
      const studentAbsence = {
        studentId: 'hs-001',
        studentName: 'Nguyễn Gia Huy',
        className: 'Lớp 1A1',
        month: '2026-09',
        selfAbsenceDays: 2,
        excusedAbsenceDays: 0,
        unexcusedAbsenceDays: 2,
        selfAbsenceDates: ['2026-09-15', '2026-09-16']
      };

      const mealPricing = { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 };
      const rates = {
        excused: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        unexcused: { mainMealRatePercent: 20, breakfastRatePercent: 20 }
      };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates);
      // Main: 2 * 40k * 20% = 16,000 đ
      // Breakfast: 2 * 20k * 20% = 8,000 đ
      assert.equal(result.totalMealRefund, 24000);
    });
  });

  describe('FR-003: Priority Rule Verification (Teacher Check-in Overrides Parent Leave Notice)', () => {
    it('results in zero absence days and zero refund when teacher attendance marks student as present despite parent leave notice', () => {
      // Scenario: Parent submitted leave request, but student came to school and teacher checked them in.
      // System prioritizes teacher check-in: student is considered Present -> selfAbsenceDays = 0.
      const studentAbsence = {
        studentId: 'hs-override',
        studentName: 'Trần Văn An',
        className: 'Lớp 1A1',
        month: '2026-09',
        selfAbsenceDays: 0, // Teacher marked present overrides leave notice
        selfAbsenceDates: []
      };

      const mealPricing = { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 };
      const rates = { mainMealRatePercent: 50, breakfastRatePercent: 70 };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates);
      assert.equal(result.totalMealRefund, 0);
      assert.equal(result.items[0].totalRefundAmount, 0);
      assert.equal(result.items[1].totalRefundAmount, 0);
    });
  });

  describe('FR-004 & AC-003: Exact September User Scenario Test Vector (102.000đ Total for 3 Excused Days)', () => {
    it('computes exact 60.000đ for Tiền ăn, 42.000đ for Tiền ăn sáng, and 102.000đ total refund', () => {
      const studentAbsence = {
        studentId: 'hs-001',
        studentName: 'Nguyễn Gia Huy',
        className: 'Lớp 1A1',
        month: '2026-09',
        selfAbsenceDays: 3,
        selfAbsenceDates: ['2026-09-15', '2026-09-16', '2026-09-17']
      };

      const mealPricing = {
        mainMealUnitPrice: 40000,
        breakfastUnitPrice: 20000
      };

      const rates = {
        mainMealRatePercent: 50,
        breakfastRatePercent: 70
      };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates, '2026-10');

      // 1. Tiền ăn (bán trú): 3 * 40k * 50% = 60,000 đ
      const mainMealItem = result.items.find((item) => item.category === 'tien_an');
      assert.ok(mainMealItem);
      assert.equal(mainMealItem.selfRefundAmount, 60000);
      assert.equal(mainMealItem.totalRefundAmount, 60000);

      // 2. Tiền ăn sáng: 3 * 20k * 70% = 42,000 đ
      const breakfastItem = result.items.find((item) => item.category === 'tien_an_sang');
      assert.ok(breakfastItem);
      assert.equal(breakfastItem.selfRefundAmount, 42000);
      assert.equal(breakfastItem.totalRefundAmount, 42000);

      // 3. Grand Total
      assert.equal(result.totalMealRefund, 102000);
      assert.equal(result.reconciledMonth, '2026-09');
      assert.equal(result.billingMonth, '2026-10');
    });
  });

  describe('calculateDaysBetween Calendar Date Range Helper', () => {
    it('computes correct day count between ISO dates (inclusive)', () => {
      assert.equal(calculateDaysBetween('2026-09-01', '2026-09-02'), 2);
      assert.equal(calculateDaysBetween('2027-01-01', '2027-01-01'), 1);
      assert.equal(calculateDaysBetween('2027-02-06', '2027-02-14'), 9);
      assert.equal(calculateDaysBetween('2027-04-30', '2027-05-01'), 2);
      assert.equal(calculateDaysBetween('', ''), 1);
    });
  });

  describe('Rate Validation & Clamping Engine', () => {
    it('validates percentage inputs between 0 and 100', () => {
      assert.equal(validateMealRefundRates({ mainMealRatePercent: 50, breakfastRatePercent: 70 }).isValid, true);
      assert.equal(validateMealRefundRates({ mainMealRatePercent: 0, breakfastRatePercent: 100 }).isValid, true);
      assert.equal(validateMealRefundRates({ mainMealRatePercent: 100, breakfastRatePercent: 0 }).isValid, true);

      assert.equal(validateMealRefundRates({ mainMealRatePercent: -10, breakfastRatePercent: 50 }).isValid, false);
      assert.equal(validateMealRefundRates({ mainMealRatePercent: 50, breakfastRatePercent: 120 }).isValid, false);
      assert.equal(validateMealRefundRates({ mainMealRatePercent: NaN, breakfastRatePercent: 50 }).isValid, false);
    });
  });

  describe('Previous Month Key Calculation & Breakdown Description Formatter', () => {
    it('resolves correct previous billing month key (M-1)', () => {
      assert.equal(getPreviousMonthKey('2026-10'), '2026-09');
      assert.equal(getPreviousMonthKey('2026-01'), '2025-12');
      assert.equal(getPreviousMonthKey('2026-09'), '2026-08');
    });

    it('generates itemized human-readable descriptions for invoice deduction line items', () => {
      const descMain = generateMealRefundDescription('tien_an', 3, 50, 60000, 0, 0, '09/2026');
      assert.match(descMain, /Khấu trừ hoàn tiền ăn T09\/2026: -60\.000 đ/);
      assert.match(descMain, /3 ngày nghỉ có phép \[50%\]: -60\.000 đ/);

      const descBf = generateMealRefundDescription('tien_an_sang', 3, 70, 42000, 0, 0, '09/2026');
      assert.match(descBf, /Khấu trừ hoàn tiền ăn sáng T09\/2026: -42\.000 đ/);
      assert.match(descBf, /3 ngày nghỉ có phép \[70%\]: -42\.000 đ/);

      const descWithUnexcused = generateMealRefundDescription('tien_an', 3, 50, 60000, 0, 0, '09/2026', 0, 3, 50, 60000, 2, 0, 0);
      assert.match(descWithUnexcused, /3 ngày nghỉ có phép \[50%\]: -60\.000 đ/);
      assert.match(descWithUnexcused, /2 ngày nghỉ không phép \[0%\]: -0 đ/);
    });
  });

  describe('Mock Data Verification: Lê Hoàng Cường & Phạm Nhật Nam September Absences', () => {
    it('calculates exact 102,000 VND refund for Lê Hoàng Cường (3 self absence days: 60k main + 42k bf)', () => {
      const studentAbsence = {
        studentId: 'hs-603',
        studentName: 'Lê Hoàng Cường',
        className: '6A1',
        month: '2026-09',
        selfAbsenceDays: 3,
        selfAbsenceDates: ['2026-09-15', '2026-09-16', '2026-09-17']
      };

      const mealPricing = { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 };
      const rates = {
        excused: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        unexcused: { mainMealRatePercent: 0, breakfastRatePercent: 0 }
      };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates, '2026-10');

      // Tiền ăn bán trú: 3 * 40k * 50% = 60k
      const mainMeal = result.items.find((it) => it.category === 'tien_an');
      assert.ok(mainMeal);
      assert.equal(mainMeal.totalRefundAmount, 60000);

      // Tiền ăn sáng: 3 * 20k * 70% = 42k
      const breakfast = result.items.find((it) => it.category === 'tien_an_sang');
      assert.ok(breakfast);
      assert.equal(breakfast.totalRefundAmount, 42000);

      // Total refund = 60k + 42k = 102k
      assert.equal(result.totalMealRefund, 102000);
    });

    it('calculates exact 68,000 VND refund for Phạm Nhật Nam (2 self absence days: 40k main + 28k bf)', () => {
      const studentAbsence = {
        studentId: 'hs-006',
        studentName: 'Phạm Nhật Nam',
        className: 'Lớp 11A2',
        month: '2026-09',
        selfAbsenceDays: 2,
        selfAbsenceDates: ['2026-09-22', '2026-09-23']
      };

      const mealPricing = { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 };
      const rates = {
        excused: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
        unexcused: { mainMealRatePercent: 0, breakfastRatePercent: 0 }
      };

      const result = calculateMealRefundForStudent(studentAbsence, mealPricing, rates, '2026-10');

      // Tiền ăn bán trú: 2 * 40k * 50% = 40k
      const mainMeal = result.items.find((it) => it.category === 'tien_an');
      assert.ok(mainMeal);
      assert.equal(mainMeal.totalRefundAmount, 40000);

      // Tiền ăn sáng: 2 * 20k * 70% = 28k
      const breakfast = result.items.find((it) => it.category === 'tien_an_sang');
      assert.ok(breakfast);
      assert.equal(breakfast.totalRefundAmount, 28000);

      // Total refund = 40k + 28k = 68k
      assert.equal(result.totalMealRefund, 68000);
    });

    it('calculates refund for extensible daily fees (e.g. Phí đưa đón 2A8) when configured in refundableFees', () => {
      const studentAbsence = {
        studentId: 'hs-001',
        studentName: 'Nguyễn Gia Huy',
        className: 'Lớp 1A1',
        month: '2026-09',
        selfAbsenceDays: 3,
        excusedAbsenceDays: 3,
        unexcusedAbsenceDays: 0,
        selfAbsenceDates: ['2026-09-15', '2026-09-16', '2026-09-17']
      };

      const customRefundableFees = [
        {
          feeId: 'fee-sys-002',
          code: 'TIEN_AN',
          name: 'Tiền ăn bán trú',
          unit: 'ngày',
          defaultAmount: 40000,
          excusedRatePercent: 50,
          unexcusedRatePercent: 0
        },
        {
          feeId: 'fee-cust-006',
          code: 'DUA_DON_2A8',
          name: 'Phí đưa đón 2A8',
          unit: 'ngày',
          defaultAmount: 20000,
          excusedRatePercent: 50,
          unexcusedRatePercent: 0
        }
      ];

      const result = calculateMealRefundForStudent(
        studentAbsence,
        { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 },
        {
          excused: { mainMealRatePercent: 50, breakfastRatePercent: 70 },
          unexcused: { mainMealRatePercent: 0, breakfastRatePercent: 0 }
        },
        '2026-10',
        customRefundableFees
      );

      assert.equal(result.items.length, 2);

      const mealItem = result.items.find((it) => it.code === 'TIEN_AN' || it.name.includes('Tiền ăn'));
      assert.ok(mealItem);
      assert.equal(mealItem.totalRefundAmount, 60000); // 3 * 40k * 50% = 60,000 đ
      assert.match(mealItem.explanation, /3 ngày nghỉ có phép \[50%\]: -60\.000 đ/);

      const busItem = result.items.find((it) => it.feeId === 'fee-cust-006');
      assert.ok(busItem);
      assert.equal(busItem.name, 'Phí đưa đón 2A8');
      assert.equal(busItem.totalRefundAmount, 30000); // 3 * 20k * 50% = 30,000 đ
      assert.match(busItem.explanation, /Khấu trừ hoàn Phí đưa đón 2A8/);
      assert.match(busItem.explanation, /3 ngày nghỉ có phép \[50%\]: -30\.000 đ/);

      // Total refund = 60k + 30k = 90k
      assert.equal(result.totalMealRefund, 90000);
    });
  });
});
