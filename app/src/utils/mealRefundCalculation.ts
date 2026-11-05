/**
 * Pure Calculation & Business Rules Engine for Meal Refund Mechanism (Cơ Chế Hoàn Tiền Ăn)
 * Feature ID: 034-settings-meal-refund-mechanism-and-next-month-invoice-deduction
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * 
 * Rules:
 * - Áp dụng duy nhất cho: Ngày học sinh tự nghỉ (Vắng có phép & Vắng không phép).
 * - Không áp dụng cho Ngày nghỉ lễ / Lịch sự kiện trường (đã loại bỏ khỏi cơ chế hoàn tiền).
 * - Quy tắc ưu tiên dữ liệu: Điểm danh của giáo viên > Đơn báo vắng của phụ huynh.
 *   Nếu phụ huynh báo vắng nhưng sau đó học sinh đến trường và giáo viên điểm danh,
 *   hệ thống ưu tiên ghi nhận học sinh ĐI HỌC (không phát sinh hoàn tiền).
 * - Formula:
 *   Refund_main = (D_excused * P_main * Rate_excused_main) + (D_unexcused * P_main * Rate_unexcused_main)
 *   Refund_bf = (D_excused * P_bf * Rate_excused_bf) + (D_unexcused * P_bf * Rate_unexcused_bf)
 *   Total = Refund_main + Refund_bf
 */

import type {
  MealRefundRates,
  StudentAbsenceBreakdown,
  MealFeeDailyRates,
  MealRefundCalculationItem,
  StudentMealRefundSummary,
  RefundableFeeConfigItem,
} from '../types/settingFee.ts';

/**
 * Calculates calendar days between two ISO date strings (inclusive).
 */
export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 1;
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Validates meal refund percentage rates (0% to 100%).
 */
export function validateMealRefundRates(rates: Partial<MealRefundRates>): {
  isValid: boolean;
  error?: string;
} {
  const { mainMealRatePercent, breakfastRatePercent } = rates;

  if (
    mainMealRatePercent === undefined ||
    isNaN(mainMealRatePercent) ||
    mainMealRatePercent < 0 ||
    mainMealRatePercent > 100
  ) {
    return {
      isValid: false,
      error: 'Tỷ lệ hoàn tiền ăn chính phải từ 0% đến 100%',
    };
  }

  if (
    breakfastRatePercent === undefined ||
    isNaN(breakfastRatePercent) ||
    breakfastRatePercent < 0 ||
    breakfastRatePercent > 100
  ) {
    return {
      isValid: false,
      error: 'Tỷ lệ hoàn tiền ăn sáng phải từ 0% đến 100%',
    };
  }

  return { isValid: true };
}

/**
 * Calculates previous month key (e.g., "2026-10" -> "2026-09", "2026-01" -> "2025-12").
 */
export function getPreviousMonthKey(currentMonthKey: string): string {
  if (!currentMonthKey || !currentMonthKey.includes('-')) {
    return '2026-09';
  }
  const parts = currentMonthKey.split('-');
  let year = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10);

  if (isNaN(year) || isNaN(month)) return '2026-09';

  month -= 1;
  if (month < 1) {
    month = 12;
    year -= 1;
  }

  return `${year}-${month.toString().padStart(2, '0')}`;
}

/**
 * Formats a currency amount in Vietnamese Dong (VND) notation.
 */
function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 đ';
  }
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
}

/**
 * Generates itemized description text for an invoice deduction line item.
 * Reflects solely student self-absence days.
 */
export function generateMealRefundDescription(
  category: 'tien_an' | 'tien_an_sang' | string,
  selfDays: number,
  selfRate: number,
  selfAmount: number,
  schoolDays: number = 0,
  schoolAmount: number = 0,
  reconciledMonthDisplay: string = '09/2026',
  holidayRate: number = 0,
  excusedDays?: number,
  excusedRate?: number,
  excusedAmount?: number,
  unexcusedDays?: number,
  unexcusedRate?: number,
  unexcusedAmount?: number,
  customFeeName?: string
): string {
  let categoryName = customFeeName;
  if (!categoryName) {
    if (category === 'tien_an') categoryName = 'tiền ăn';
    else if (category === 'tien_an_sang') categoryName = 'tiền ăn sáng';
    else categoryName = category;
  }
  const totalAmount = selfAmount;
  const parts: string[] = [];

  const actualExcusedDays = excusedDays !== undefined ? excusedDays : selfDays;
  const actualExcusedRate = excusedRate !== undefined ? excusedRate : selfRate;
  const actualExcusedAmount = excusedAmount !== undefined ? excusedAmount : selfAmount;

  if (actualExcusedDays > 0) {
    parts.push(`${actualExcusedDays} ngày nghỉ có phép [${actualExcusedRate}%]: -${formatVND(actualExcusedAmount)}`);
  }

  if (unexcusedDays !== undefined && unexcusedDays > 0) {
    parts.push(`${unexcusedDays} ngày nghỉ không phép [${unexcusedRate ?? 0}%]: -${formatVND(unexcusedAmount ?? 0)}`);
  }

  const breakdown = parts.length > 0 ? ` (${parts.join(', ')})` : '';
  return `Khấu trừ hoàn ${categoryName} T${reconciledMonthDisplay}: -${formatVND(totalAmount)}${breakdown}`;
}

export interface MealRefundCalculationRateOptions {
  excused?: MealRefundRates;
  unexcused?: MealRefundRates;
  holiday?: MealRefundRates;
  mainMealRatePercent?: number;
  breakfastRatePercent?: number;
}

/**
 * Core calculation function computing meal refunds for a student based on absence breakdown and school fee settings.
 * Computes strictly based on student self-absence days (Excused and Unexcused).
 */
export function calculateMealRefundForStudent(
  absence: StudentAbsenceBreakdown,
  pricing: MealFeeDailyRates = { mainMealUnitPrice: 40000, breakfastUnitPrice: 20000 },
  rates: MealRefundRates | MealRefundCalculationRateOptions = { mainMealRatePercent: 50, breakfastRatePercent: 70 },
  targetBillingMonth = '2026-10',
  refundableFees?: RefundableFeeConfigItem[],
  studentFeeContext?: { isPayingBreakfast?: boolean; studentFeeItems?: Array<{ name?: string; code?: string; amount: number }> }
): StudentMealRefundSummary {
  // Determine if student pays for breakfast
  let studentPaysBreakfast = true; // Default true for legacy tests
  if (studentFeeContext) {
    if (studentFeeContext.isPayingBreakfast !== undefined) {
      studentPaysBreakfast = studentFeeContext.isPayingBreakfast;
    } else if (studentFeeContext.studentFeeItems) {
      studentPaysBreakfast = studentFeeContext.studentFeeItems.some((it) => {
        const n = (it.name || '').toLowerCase();
        const c = (it.code || '').toUpperCase();
        return (n.includes('ăn sáng') || n.includes('an sang') || c === 'TIEN_AN_SANG' || c === 'AN_SANG') && it.amount > 0;
      });
    }
  }
  // Extract Excused & Unexcused absence days
  const hasGranularAbsence =
    (absence as any).excusedAbsenceDays !== undefined ||
    (absence as any).unexcusedAbsenceDays !== undefined;

  const excusedDays = hasGranularAbsence
    ? Math.max(0, (absence as any).excusedAbsenceDays || 0)
    : Math.max(0, absence.selfAbsenceDays || 0);

  const unexcusedDays = hasGranularAbsence
    ? Math.max(0, (absence as any).unexcusedAbsenceDays || 0)
    : 0;

  const totalSelfDays = excusedDays + unexcusedDays;

  const mainPrice = Math.max(0, pricing.mainMealUnitPrice || 0);
  const bfPrice = Math.max(0, pricing.breakfastUnitPrice || 0);

  // Extract Rates
  const rateObj = rates as MealRefundCalculationRateOptions;
  const excusedRateMain =
    rateObj.excused?.mainMealRatePercent ??
    rateObj.mainMealRatePercent ??
    50;
  const excusedRateBf =
    rateObj.excused?.breakfastRatePercent ??
    rateObj.breakfastRatePercent ??
    70;

  const unexcusedRateMain = rateObj.unexcused?.mainMealRatePercent ?? 0;
  const unexcusedRateBf = rateObj.unexcused?.breakfastRatePercent ?? 0;

  let monthDisplay = '09/2026';
  if (absence.month && absence.month.includes('-')) {
    const parts = absence.month.split('-');
    monthDisplay = `${parts[1]}/${parts[0]}`;
  } else if (absence.month) {
    monthDisplay = absence.month;
  }

  // If dynamic refundableFees are configured and provided:
  if (refundableFees && refundableFees.length > 0) {
    const items: MealRefundCalculationItem[] = refundableFees.map((fee) => {
      const isBf =
        fee.code === 'TIEN_AN_SANG' ||
        fee.code === 'AN_SANG' ||
        fee.name.toLowerCase().includes('ăn sáng');

      let unitPrice = fee.defaultAmount || 0;
      if (unitPrice === 0) {
        if (fee.code === 'TIEN_AN') unitPrice = mainPrice;
        else if (isBf) unitPrice = bfPrice;
        else unitPrice = 20000;
      }

      let feeExcusedRate = fee.excusedRatePercent;
      if (feeExcusedRate === undefined || feeExcusedRate === null) {
        if (fee.code === 'TIEN_AN') feeExcusedRate = excusedRateMain;
        else if (isBf) feeExcusedRate = excusedRateBf;
        else feeExcusedRate = 50;
      }

      let feeUnexcusedRate = fee.unexcusedRatePercent;
      if (feeUnexcusedRate === undefined || feeUnexcusedRate === null) {
        if (fee.code === 'TIEN_AN') feeUnexcusedRate = unexcusedRateMain;
        else if (isBf) feeUnexcusedRate = unexcusedRateBf;
        else feeUnexcusedRate = 0;
      }

      let excusedAmount = Math.round(excusedDays * unitPrice * (Math.min(100, Math.max(0, feeExcusedRate)) / 100));
      let unexcusedAmount = Math.round(unexcusedDays * unitPrice * (Math.min(100, Math.max(0, feeUnexcusedRate)) / 100));

      const category = fee.code === 'TIEN_AN' ? 'tien_an' : isBf ? 'tien_an_sang' : fee.code.toLowerCase();

      // Check user business rules for breakfast:
      // Case 3: Student does not pay breakfast -> 0 refund
      // Case 2: Student pays breakfast but school does not configure breakfast refund -> 0 refund
      // Case 1: Student pays breakfast and school configures breakfast refund -> Refunded
      let explanation = '';
      if (isBf && !studentPaysBreakfast) {
        excusedAmount = 0;
        unexcusedAmount = 0;
        explanation = `Khấu trừ hoàn tiền ăn sáng T${monthDisplay}: 0 đ (Học sinh không trả tiền ăn sáng)`;
      } else if (isBf && (feeExcusedRate <= 0 && feeUnexcusedRate <= 0)) {
        excusedAmount = 0;
        unexcusedAmount = 0;
        explanation = `Khấu trừ hoàn tiền ăn sáng T${monthDisplay}: 0 đ (Nhà trường không thiết lập hoàn tiền ăn sáng)`;
      } else {
        explanation = generateMealRefundDescription(
          category,
          totalSelfDays,
          feeExcusedRate,
          excusedAmount + unexcusedAmount,
          0,
          0,
          monthDisplay,
          0,
          excusedDays,
          feeExcusedRate,
          excusedAmount,
          unexcusedDays,
          feeUnexcusedRate,
          unexcusedAmount,
          fee.name
        );
      }

      const totalAmount = excusedAmount + unexcusedAmount;

      return {
        category,
        feeId: fee.feeId,
        feeCode: fee.code,
        name: fee.name,
        dailyUnitPrice: unitPrice,
        selfAbsenceDays: totalSelfDays,
        selfAbsenceRatePercent: feeExcusedRate,
        selfRefundAmount: totalAmount,
        excusedDays,
        excusedRatePercent: feeExcusedRate,
        excusedRefundAmount: excusedAmount,
        unexcusedDays,
        unexcusedRatePercent: feeUnexcusedRate,
        unexcusedRefundAmount: unexcusedAmount,
        schoolHolidayDays: 0,
        schoolHolidayRatePercent: 0,
        schoolRefundAmount: 0,
        totalRefundAmount: totalAmount,
        explanation,
      };
    });

    const totalMealRefund = items.reduce((sum, it) => sum + it.totalRefundAmount, 0);
    const breakdownDescription = `Hoàn tiền khi nghỉ học tháng ${absence.month}: ${formatVND(totalMealRefund)} (${items.map((it) => `${it.name}: ${formatVND(it.totalRefundAmount)}`).join(', ')})`;

    return {
      studentId: absence.studentId,
      studentName: absence.studentName,
      className: absence.className,
      billingMonth: targetBillingMonth,
      reconciledMonth: absence.month,
      items,
      totalMealRefund,
      breakdownDescription,
    };
  }

  // 1. Tiền ăn (bán trú / trưa) - Strictly student self-absence
  const mainExcusedAmount = Math.round(excusedDays * mainPrice * (Math.min(100, Math.max(0, excusedRateMain)) / 100));
  const mainUnexcusedAmount = Math.round(unexcusedDays * mainPrice * (Math.min(100, Math.max(0, unexcusedRateMain)) / 100));
  const mainSelfAmount = mainExcusedAmount + mainUnexcusedAmount;
  const mainTotalAmount = mainSelfAmount;

  // 2. Tiền ăn sáng - Strictly student self-absence
  let bfExcusedAmount = Math.round(excusedDays * bfPrice * (Math.min(100, Math.max(0, excusedRateBf)) / 100));
  let bfUnexcusedAmount = Math.round(unexcusedDays * bfPrice * (Math.min(100, Math.max(0, unexcusedRateBf)) / 100));
  let bfExplanation = '';

  if (!studentPaysBreakfast) {
    bfExcusedAmount = 0;
    bfUnexcusedAmount = 0;
    bfExplanation = `Khấu trừ hoàn tiền ăn sáng T${monthDisplay}: 0 đ (Học sinh không trả tiền ăn sáng)`;
  } else if (excusedRateBf <= 0 && unexcusedRateBf <= 0) {
    bfExcusedAmount = 0;
    bfUnexcusedAmount = 0;
    bfExplanation = `Khấu trừ hoàn tiền ăn sáng T${monthDisplay}: 0 đ (Nhà trường không thiết lập hoàn tiền ăn sáng)`;
  } else {
    bfExplanation = generateMealRefundDescription(
      'tien_an_sang',
      totalSelfDays,
      excusedRateBf,
      bfExcusedAmount + bfUnexcusedAmount,
      0,
      0,
      monthDisplay,
      0,
      excusedDays,
      excusedRateBf,
      bfExcusedAmount,
      unexcusedDays,
      unexcusedRateBf,
      bfUnexcusedAmount
    );
  }

  const bfSelfAmount = bfExcusedAmount + bfUnexcusedAmount;
  const bfTotalAmount = bfSelfAmount;

  const totalMealRefund = mainTotalAmount + bfTotalAmount;

  const mainExplanation = generateMealRefundDescription(
    'tien_an',
    totalSelfDays,
    excusedRateMain,
    mainSelfAmount,
    0,
    0,
    monthDisplay,
    0,
    excusedDays,
    excusedRateMain,
    mainExcusedAmount,
    unexcusedDays,
    unexcusedRateMain,
    mainUnexcusedAmount
  );

  const items: MealRefundCalculationItem[] = [
    {
      category: 'tien_an',
      name: 'Tiền ăn bán trú',
      dailyUnitPrice: mainPrice,
      selfAbsenceDays: totalSelfDays,
      selfAbsenceRatePercent: excusedRateMain,
      selfRefundAmount: mainSelfAmount,
      excusedDays,
      excusedRatePercent: excusedRateMain,
      excusedRefundAmount: mainExcusedAmount,
      unexcusedDays,
      unexcusedRatePercent: unexcusedRateMain,
      unexcusedRefundAmount: mainUnexcusedAmount,
      schoolHolidayDays: 0,
      schoolHolidayRatePercent: 0,
      schoolRefundAmount: 0,
      totalRefundAmount: mainTotalAmount,
      explanation: mainExplanation,
    },
    {
      category: 'tien_an_sang',
      name: 'Tiền ăn sáng',
      dailyUnitPrice: bfPrice,
      selfAbsenceDays: totalSelfDays,
      selfAbsenceRatePercent: excusedRateBf,
      selfRefundAmount: bfSelfAmount,
      excusedDays,
      excusedRatePercent: excusedRateBf,
      excusedRefundAmount: bfExcusedAmount,
      unexcusedDays,
      unexcusedRatePercent: unexcusedRateBf,
      unexcusedRefundAmount: bfUnexcusedAmount,
      schoolHolidayDays: 0,
      schoolHolidayRatePercent: 0,
      schoolRefundAmount: 0,
      totalRefundAmount: bfTotalAmount,
      explanation: bfExplanation,
    },
  ];

  const breakdownDescription = `Hoàn tiền ăn tháng ${absence.month}: ${formatVND(totalMealRefund)} (Tiền ăn: ${formatVND(mainTotalAmount)}, Ăn sáng: ${formatVND(bfTotalAmount)})`;

  return {
    studentId: absence.studentId,
    studentName: absence.studentName,
    className: absence.className,
    billingMonth: targetBillingMonth,
    reconciledMonth: absence.month,
    items,
    totalMealRefund,
    breakdownDescription,
  };
}
