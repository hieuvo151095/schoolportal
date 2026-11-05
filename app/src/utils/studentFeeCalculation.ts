/**
 * Business Rules & Calculation Engine for Student Fee Items & Meal Refund Integration
 * Feature: Thiết lập danh sách học phí từng trẻ & Liên kết cơ chế Hoàn tiền ăn sáng
 * 
 * Rules:
 * 1. Danh sách item học phí của từng trẻ lấy từ danh sách item học phí của lớp (tạo/truy xuất từ sub-module "Khoản phí").
 * 2. Xác định học sinh có trả phí "Ăn sáng" hay không từ danh sách item khoản phí của học sinh.
 * 3. Kết hợp với section "Hoàn tiền ăn" trong sub-module "Học phí" (Cấu hình):
 *    - Case 1: Nhà trường thiết lập hoàn tiền ăn sáng -> Hoàn tiền cho học sinh trả tiền ăn sáng.
 *    - Case 2: Nhà trường không thiết lập hoàn tiền ăn sáng -> Không hoàn tiền mặc dù học sinh trả tiền ăn sáng.
 *    - Case 3: Học sinh không trả tiền ăn sáng -> Chắc chắn không hoàn tiền dù nhà trường có thiết lập hay không.
 */

import type { Student, StudentFeeItem } from '../types/student';
import type { MealRefundConfig } from '../types/settingFee';
import type { FeeItem } from '../types/schoolFee';

/**
 * Checks if a fee item represents "Ăn sáng" (Breakfast fee).
 */
export function isBreakfastFeeItem(fee: { name?: string; code?: string; feeId?: string }): boolean {
  if (!fee) return false;
  const name = (fee.name || '').toLowerCase().trim();
  const code = (fee.code || '').toUpperCase().trim();
  return (
    name === 'ăn sáng' ||
    name.includes('ăn sáng') ||
    name.includes('an sang') ||
    code === 'TIEN_AN_SANG' ||
    code === 'AN_SANG' ||
    fee.feeId === 'fee-cust-022'
  );
}

/**
 * Determines whether a student actually pays for breakfast ("Ăn sáng").
 * A student pays for breakfast IF AND ONLY IF:
 * 1. Their fee items list contains a fee item matching "Ăn sáng".
 * 2. The applied amount is greater than 0.
 */
export function isStudentPayingBreakfastFee(student: Student | null | undefined): boolean {
  if (!student || !student.feeItems || student.feeItems.length === 0) {
    return false;
  }
  return student.feeItems.some((item) => isBreakfastFeeItem(item) && item.amount > 0);
}

/**
 * Determines whether the school has configured breakfast refund ("Hoàn tiền ăn sáng").
 * School configures breakfast refund when:
 * 1. Meal refund feature is enabled (`isEnabled === true`).
 * 2. AND either:
 *    a) Breakfast rate percent is > 0 in excusedRates or rates.
 *    b) OR refundableFees contains a breakfast item with excused/unexcused rate > 0.
 */
export function isSchoolRefundingBreakfast(mealRefundConfig: MealRefundConfig | null | undefined): boolean {
  if (!mealRefundConfig || !mealRefundConfig.isEnabled) {
    return false;
  }

  // Check rate in excusedRates or rates
  const excusedBfRate =
    mealRefundConfig.excusedRates?.breakfastRatePercent ??
    mealRefundConfig.rates?.breakfastRatePercent ??
    0;

  if (excusedBfRate > 0) {
    return true;
  }

  // Check refundableFees array if configured
  if (mealRefundConfig.refundableFees && mealRefundConfig.refundableFees.length > 0) {
    const bfFee = mealRefundConfig.refundableFees.find((f) => isBreakfastFeeItem(f));
    if (bfFee) {
      const excRate = bfFee.excusedRatePercent ?? 0;
      const unexcRate = bfFee.unexcusedRatePercent ?? 0;
      if (excRate > 0 || unexcRate > 0) {
        return true;
      }
    }
  }

  return false;
}

export type BreakfastRefundEvaluationStatus =
  | 'eligible' // Case 1: Student pays breakfast + School configures breakfast refund
  | 'school_disabled' // Case 2: Student pays breakfast + School does NOT configure breakfast refund
  | 'student_not_paying'; // Case 3: Student does NOT pay breakfast

export interface BreakfastRefundEvaluationResult {
  status: BreakfastRefundEvaluationStatus;
  isRefunded: boolean;
  studentPaysBreakfast: boolean;
  schoolRefundsBreakfast: boolean;
  breakfastAmount: number;
  reason: string;
}

/**
 * Evaluates the breakfast refund eligibility for a student combining the student fee profile
 * and the school meal refund configuration.
 */
export function evaluateStudentBreakfastRefundEligibility(
  student: Student | null | undefined,
  mealRefundConfig: MealRefundConfig | null | undefined
): BreakfastRefundEvaluationResult {
  const studentPaysBreakfast = isStudentPayingBreakfastFee(student);
  const schoolRefundsBreakfast = isSchoolRefundingBreakfast(mealRefundConfig);

  const bfItem = student?.feeItems?.find((it) => isBreakfastFeeItem(it));
  const breakfastAmount = bfItem?.amount || 0;

  // Case 3: Student does NOT pay breakfast fee -> Absolutely no refund
  if (!studentPaysBreakfast) {
    return {
      status: 'student_not_paying',
      isRefunded: false,
      studentPaysBreakfast: false,
      schoolRefundsBreakfast,
      breakfastAmount: 0,
      reason: 'Học sinh không đóng phí ăn sáng. Chắc chắn không hoàn tiền dù nhà trường có thiết lập hay không.',
    };
  }

  // Case 1: Student pays breakfast AND school configures breakfast refund
  if (schoolRefundsBreakfast) {
    return {
      status: 'eligible',
      isRefunded: true,
      studentPaysBreakfast: true,
      schoolRefundsBreakfast: true,
      breakfastAmount,
      reason: 'Học sinh có đóng phí ăn sáng và Nhà trường có thiết lập hoàn tiền ăn sáng: Hoàn tiền ăn sáng cho học sinh theo quy định.',
    };
  }

  // Case 2: Student pays breakfast BUT school does NOT configure breakfast refund
  return {
    status: 'school_disabled',
    isRefunded: false,
    studentPaysBreakfast: true,
    schoolRefundsBreakfast: false,
    breakfastAmount,
    reason: 'Học sinh có đóng phí ăn sáng nhưng Nhà trường không thiết lập hoàn tiền ăn sáng: Không hoàn tiền mặc dù học sinh có trả tiền ăn sáng.',
  };
}

/**
 * Formats a fee unit into readable Vietnamese string.
 */
export function formatFeeUnitDisplay(unit: string | undefined): string {
  if (!unit) return 'Đ/tháng';
  const u = unit.toLowerCase();
  if (u === 'thang' || u === 'tháng' || u === 'month') return 'Đ/tháng';
  if (u === 'ngay' || u === 'ngày' || u === 'day') return 'Đ/ngày';
  if (u === 'nam' || u === 'năm' || u === 'year') return 'Đ/năm';
  if (u === 'lan' || u === 'lần' || u === 'time') return 'Đ/lần';
  if (u === 'chuyen' || u === 'chuyến') return 'Đ/chuyến';
  if (u === 'bo' || u === 'bộ') return 'Đ/bộ';
  if (u === 'gio' || u === 'giờ') return 'Đ/giờ';
  return `Đ/${unit}`;
}

/**
 * Formats integer VND amount with dot thousand separators.
 */
export function formatCurrencyVND(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
