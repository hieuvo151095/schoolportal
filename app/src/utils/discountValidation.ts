/**
 * Business Rules & Calculation Engine for Tuition Exemption & Fee Discount Policies
 * Finance Domain - Finviet / SOHA School Operating Portal
 * Governed by ADR-012, Resolution K016, Resolution K017, Resolution K018
 */

import type {
  DiscountPolicy,
  DiscountCalculationType,
  DiscountPolicyStatus,
  InvoiceDiscountLine,
  DiscountFilterState,
  CreateDiscountPolicyPayload,
} from '../types/discount.ts';
import { feeIdsMatch } from '../services/mockDiscountData.ts';

export interface FeeItemRef {
  id: string;
  name: string;
  amount: number;
}

export interface StudentRef {
  id: string;
  fullName?: string;
  classId: string;
}

/**
 * Format currency with Vietnamese thousands dot separators (e.g. 1.500.000)
 */
export const formatCurrency = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Format discount value with dynamic unit indicator (% or đ)
 */
export const formatDiscountValue = (
  type: DiscountCalculationType,
  value: number
): string => {
  if (type === 'percent') {
    return `${value}%`;
  }
  return `${formatCurrency(value)} đ`;
};

/**
 * Calculate raw deduction amount for a single policy against a fee item gross amount.
 * Clamps deduction strictly between 0 and feeItemGross (preventing negative balances).
 */
export const calculateDiscountDeduction = (
  feeItemGross: number,
  policy: { discountType: DiscountCalculationType; discountValue: number }
): number => {
  if (!feeItemGross || feeItemGross <= 0 || !policy || !policy.discountValue || policy.discountValue <= 0) {
    return 0;
  }

  let deduction = 0;
  if (policy.discountType === 'percent') {
    const rate = Math.min(100, Math.max(0, policy.discountValue));
    deduction = Math.round(feeItemGross * (rate / 100));
  } else if (policy.discountType === 'fixed_amount') {
    deduction = Math.round(policy.discountValue);
  }

  // Non-negative clamping: deduction cannot exceed gross fee
  return Math.max(0, Math.min(deduction, feeItemGross));
};

/**
 * Check if a policy is temporally active for a given billing month (YYYY-MM).
 */
export const isPolicyActiveForMonth = (
  policy: DiscountPolicy,
  billingMonth: string // YYYY-MM
): boolean => {
  if (policy.status === 'paused') {
    return false;
  }

  if (policy.validityType === 'month_range') {
    if (policy.fromMonth && billingMonth < policy.fromMonth) {
      return false;
    }
    if (policy.toMonth && billingMonth > policy.toMonth) {
      return false;
    }
  }

  return true;
};

/**
 * Dynamically evaluates policy lifecycle status based on current date (Resolution K017).
 */
export const evaluatePolicyStatus = (
  policy: DiscountPolicy,
  currentDate: Date = new Date()
): DiscountPolicyStatus => {
  if (policy.status === 'paused') {
    return 'paused';
  }

  const currentYear = currentDate.getFullYear();
  const currentMonthNum = currentDate.getMonth() + 1;
  const currentMonthStr = `${currentYear}-${currentMonthNum.toString().padStart(2, '0')}`;

  if (policy.validityType === 'month_range' && policy.toMonth) {
    if (currentMonthStr > policy.toMonth) {
      return 'expired';
    }
  }

  return 'active';
};

/**
 * Resolution K016 & K018:
 * Automated fee discount deduction resolver for student invoice generation.
 * Evaluates active policies applicable to each fee line item for the student.
 * Disjoint line-item independence: evaluated separately for each fee item.
 */
export const resolveStudentDiscounts = (
  student: StudentRef,
  feeItems: FeeItemRef[],
  activePolicies: DiscountPolicy[],
  billingMonth: string // Format: 'YYYY-MM'
): InvoiceDiscountLine[] => {
  if (!student || !feeItems || feeItems.length === 0 || !activePolicies) {
    return [];
  }

  const discountLines: InvoiceDiscountLine[] = [];

  for (const feeItem of feeItems) {
    const grossAmount = feeItem.amount || 0;
    if (grossAmount <= 0) continue;

    // 1. Find all active policies targeting this fee item for the given billing month
    const candidatePolicies = activePolicies.filter((policy) => {
      if (policy.excludedStudentIds?.includes(student.id)) return false;

      const matchFeeItem =
        feeIdsMatch(policy.feeItemId, feeItem.id) ||
        policy.feeItemId === feeItem.id ||
        (Boolean(policy.feeItemName && feeItem.name) && policy.feeItemName.trim().toLowerCase() === feeItem.name.trim().toLowerCase()) ||
        (Boolean(policy.feeItemName && feeItem.name) && policy.feeItemName.toLowerCase().includes('xe đưa đón') && feeItem.name.toLowerCase().includes('xe đưa đón')) ||
        (policy.feeItemId === 'fee-01' && (feeItem.id === 'fee-hoc_phi' || (feeItem.name && feeItem.name.toLowerCase().includes('học phí')))) ||
        (policy.feeItemId === 'fee-02' && (feeItem.id === 'fee-tien_an' || (feeItem.name && feeItem.name.toLowerCase().includes('tiền ăn'))));
      if (!matchFeeItem) return false;
      if (!isPolicyActiveForMonth(policy, billingMonth)) return false;

      // Match targets by class or student
      return policy.targets.some((target) => {
        if (target.targetType === 'student' && target.targetId === student.id) {
          return true;
        }
        if (
          target.targetType === 'class' &&
          (target.targetId === student.classId || target.targetId === 'all')
        ) {
          return true;
        }
        return false;
      });
    });

    if (candidatePolicies.length === 0) continue;

    // 2. Conflict Resolution & Precedence:
    // If student has an individual policy specifically targeting them for this fee item, it takes precedence.
    // Otherwise, highest value (Math.max) applies.
    let bestPolicy: DiscountPolicy | null = null;
    let maxDeduction = 0;

    for (const policy of candidatePolicies) {
      const deduction = calculateDiscountDeduction(grossAmount, policy);
      if (deduction > maxDeduction) {
        maxDeduction = deduction;
        bestPolicy = policy;
      } else if (deduction === maxDeduction && deduction > 0) {
        if (policy.scopeType === 'student' && bestPolicy?.scopeType !== 'student') {
          bestPolicy = policy;
        }
      }
    }

    // 4. If a winning discount is found and deduction > 0, generate immutable discount line
    if (bestPolicy && maxDeduction > 0) {
      discountLines.push({
        id: `disc-line-${bestPolicy.id}-${student.id}-${feeItem.id}`,
        discountPolicyId: bestPolicy.id,
        feeItemId: feeItem.id,
        policyCode: bestPolicy.code,
        policyName: bestPolicy.name,
        discountType: bestPolicy.discountType,
        discountValue: bestPolicy.discountValue,
        deductionAmount: maxDeduction,
        appliedAt: new Date().toISOString(),
      });
    }
  }

  return discountLines;
};

export interface StudentCandidateDiscountOption {
  policy: DiscountPolicy;
  deductionAmount: number;
  discountPercentEquivalent: number;
  isHighest: boolean;
}

/**
 * Returns all active discount programs for a student and fee item,
 * sorted descending by deduction amount (highest first).
 */
export const getStudentCandidateDiscountPolicies = (
  student: { id: string; classId: string; fullName: string },
  feeItem: { id: string; name: string; amount: number },
  activePolicies: DiscountPolicy[],
  billingMonth: string
): StudentCandidateDiscountOption[] => {
  if (!student || !feeItem || !activePolicies || activePolicies.length === 0) {
    return [];
  }

  const grossAmount = feeItem.amount || 0;
  if (grossAmount <= 0) return [];

  const candidates = activePolicies.filter((policy) => {
    if (policy.excludedStudentIds?.includes(student.id)) return false;

    const matchFeeItem =
      feeIdsMatch(policy.feeItemId, feeItem.id) ||
      policy.feeItemId === feeItem.id ||
      (Boolean(policy.feeItemName && feeItem.name) && policy.feeItemName.trim().toLowerCase() === feeItem.name.trim().toLowerCase()) ||
      (Boolean(policy.feeItemName && feeItem.name) && policy.feeItemName.toLowerCase().includes('xe đưa đón') && feeItem.name.toLowerCase().includes('xe đưa đón')) ||
      (policy.feeItemId === 'fee-01' && (feeItem.id === 'fee-hoc_phi' || (feeItem.name && feeItem.name.toLowerCase().includes('học phí')))) ||
      (policy.feeItemId === 'fee-02' && (feeItem.id === 'fee-tien_an' || (feeItem.name && feeItem.name.toLowerCase().includes('tiền ăn'))));
    if (!matchFeeItem) return false;
    if (!isPolicyActiveForMonth(policy, billingMonth)) return false;

    return policy.targets.some((target) => {
      if (target.targetType === 'student' && target.targetId === student.id) {
        return true;
      }
      if (
        target.targetType === 'class' &&
        (target.targetId === student.classId || target.targetId === 'all')
      ) {
        return true;
      }
      return false;
    });
  });

  if (candidates.length === 0) return [];

  const options: StudentCandidateDiscountOption[] = candidates.map((policy) => {
    const deduction = calculateDiscountDeduction(grossAmount, policy);
    const percentEq =
      policy.discountType === 'percent'
        ? policy.discountValue
        : Math.min(100, Math.round((deduction / grossAmount) * 100));
    return {
      policy,
      deductionAmount: deduction,
      discountPercentEquivalent: percentEq,
      isHighest: false,
    };
  });

  // Sort descending by deduction amount; tie-breaker prefers student-specific
  options.sort((a, b) => {
    if (b.deductionAmount !== a.deductionAmount) {
      return b.deductionAmount - a.deductionAmount;
    }
    if (a.policy.scopeType === 'student' && b.policy.scopeType !== 'student') return -1;
    if (b.policy.scopeType === 'student' && a.policy.scopeType !== 'student') return 1;
    return 0;
  });

  if (options.length > 0 && options[0].deductionAmount > 0) {
    options[0].isHighest = true;
  }

  return options;
};

/**
 * Filter policies by search text and status
 */
export const matchesDiscountFilter = (
  policy: DiscountPolicy,
  filter: DiscountFilterState
): boolean => {
  if (filter.statusFilter && filter.statusFilter !== 'all') {
    if (policy.status !== filter.statusFilter) {
      return false;
    }
  }

  if (filter.feeItemIdFilter && filter.feeItemIdFilter !== 'all') {
    if (policy.feeItemId !== filter.feeItemIdFilter) {
      return false;
    }
  }

  if (filter.scopeFilter && filter.scopeFilter !== 'all') {
    if (policy.scopeType !== filter.scopeFilter) {
      return false;
    }
  }

  if (filter.search && filter.search.trim()) {
    const query = filter.search.toLowerCase().trim();
    const matchCode = policy.code.toLowerCase().includes(query);
    const matchName = policy.name.toLowerCase().includes(query);
    const matchFee = policy.feeItemName.toLowerCase().includes(query);
    const matchReason = (policy.reason || '').toLowerCase().includes(query);
    const matchTarget = policy.targets.some((t) =>
      t.targetName.toLowerCase().includes(query)
    );

    return matchCode || matchName || matchFee || matchReason || matchTarget;
  }

  return true;
};

/**
 * Form validation for creating or editing a discount policy
 */
export const validateDiscountPolicyForm = (
  data: Partial<CreateDiscountPolicyPayload>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Tên chính sách phải có ít nhất 3 ký tự';
  }

  if (!data.discountType) {
    errors.discountType = 'Vui lòng chọn loại miễn giảm';
  }

  if (data.discountValue === undefined || data.discountValue === null || isNaN(data.discountValue)) {
    errors.discountValue = 'Vui lòng nhập mức miễn giảm';
  } else if (data.discountType === 'percent') {
    if (data.discountValue <= 0 || data.discountValue > 100) {
      errors.discountValue = 'Mức giảm phần trăm phải từ 1% đến 100%';
    }
  } else if (data.discountType === 'fixed_amount') {
    if (data.discountValue <= 0) {
      errors.discountValue = 'Số tiền miễn giảm phải lớn hơn 0 đ';
    }
  }

  if (!data.feeItemId) {
    errors.feeItemId = 'Vui lòng chọn khoản thu áp dụng';
  }

  if (!data.targetIds || data.targetIds.length === 0) {
    errors.targetIds =
      data.scopeType === 'class'
        ? 'Vui lòng chọn ít nhất một lớp học áp dụng'
        : 'Vui lòng chọn ít nhất một học sinh áp dụng';
  }

  if (data.validityType === 'month_range') {
    if (!data.fromMonth) {
      errors.fromMonth = 'Vui lòng chọn tháng bắt đầu';
    }
    if (!data.toMonth) {
      errors.toMonth = 'Vui lòng chọn tháng kết thúc';
    }
    if (data.fromMonth && data.toMonth && data.fromMonth > data.toMonth) {
      errors.toMonth = 'Tháng kết thúc phải sau hoặc bằng tháng bắt đầu';
    }
  } else if (data.validityType === 'academic_year') {
    if (!data.academicYearId) {
      errors.academicYearId = 'Vui lòng chọn năm học áp dụng';
    }
  }

  return errors;
};

export interface ExistingStudentDiscountConflict {
  studentId: string;
  studentName: string;
  className: string;
  feeItemId: string;
  feeItemName: string;
  existingPolicy: DiscountPolicy;
  existingDeduction: number;
  existingDeductionFormatted: string;
  newDeduction: number;
  newDeductionFormatted: string;
  isNewHigher: boolean;
  isExistingHigher: boolean;
  isEqual: boolean;
  resolutionMessage: string;
}

/**
 * Detects if selected students already have an active discount program for the specified fee item.
 * Used by CreateDiscountPolicyModal to alert users about existing programs and explain how the system
 * will automatically apply the higher value.
 */
export const findStudentDiscountConflicts = (
  selectedStudentIds: string[],
  feeItemId: string,
  newDiscountType: DiscountCalculationType,
  newDiscountValue: number,
  allPolicies: DiscountPolicy[],
  allStudents: Array<{ id: string; name: string; classId: string; className: string }>,
  allFeeItems: Array<{ id: string; defaultAmount: number; name: string }>,
  excludePolicyId?: string
): ExistingStudentDiscountConflict[] => {
  if (!selectedStudentIds || selectedStudentIds.length === 0 || !feeItemId) {
    return [];
  }

  const feeItem = allFeeItems.find((item) => item.id === feeItemId);
  const grossAmount = feeItem?.defaultAmount || 2500000;
  const newDeduction = calculateDiscountDeduction(grossAmount, {
    discountType: newDiscountType,
    discountValue: newDiscountValue,
  } as DiscountPolicy);

  const conflicts: ExistingStudentDiscountConflict[] = [];

  for (const studentId of selectedStudentIds) {
    const student = allStudents.find((s) => s.id === studentId);
    if (!student) continue;

    // Find active policies targeting this fee item for this student or student's class
    const matchingPolicies = allPolicies.filter((policy) => {
      if (excludePolicyId && policy.id === excludePolicyId) return false;
      if (!feeIdsMatch(policy.feeItemId, feeItemId) && policy.feeItemId !== feeItemId) return false;
      if (policy.status !== 'active') return false;
      if (policy.excludedStudentIds?.includes(student.id)) return false;

      return policy.targets.some((target) => {
        if (target.targetType === 'student' && target.targetId === student.id) {
          return true;
        }
        if (
          target.targetType === 'class' &&
          (target.targetId === student.classId || target.targetId === 'all')
        ) {
          return true;
        }
        return false;
      });
    });

    if (matchingPolicies.length === 0) continue;

    // Determine the highest existing policy among them
    let bestExistingPolicy = matchingPolicies[0];
    let maxExistingDeduction = calculateDiscountDeduction(grossAmount, bestExistingPolicy);

    for (let i = 1; i < matchingPolicies.length; i++) {
      const deduction = calculateDiscountDeduction(grossAmount, matchingPolicies[i]);
      if (deduction > maxExistingDeduction) {
        maxExistingDeduction = deduction;
        bestExistingPolicy = matchingPolicies[i];
      }
    }

    const isNewHigher = newDeduction > maxExistingDeduction;
    const isExistingHigher = maxExistingDeduction > newDeduction;
    const isEqual = newDeduction === maxExistingDeduction;

    const existingDeductionFormatted = formatDiscountValue(
      bestExistingPolicy.discountType,
      bestExistingPolicy.discountValue
    );
    const newDeductionFormatted = formatDiscountValue(
      newDiscountType,
      newDiscountValue
    );

    const resolutionMessage = `Học sinh hiện đang áp dụng chính sách "${bestExistingPolicy.name}" (${existingDeductionFormatted}). Theo quy định, mỗi học sinh chỉ áp dụng duy nhất 01 chương trình cho mỗi khoản phí. Nếu xác nhận thay thế, chính sách mới (${newDeductionFormatted}) sẽ có hiệu lực và chính sách cũ sẽ không còn áp dụng cho học sinh này.`;

    conflicts.push({
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      feeItemId,
      feeItemName: feeItem?.name || 'Khoản thu',
      existingPolicy: bestExistingPolicy,
      existingDeduction: maxExistingDeduction,
      existingDeductionFormatted,
      newDeduction,
      newDeductionFormatted,
      isNewHigher,
      isExistingHigher,
      isEqual,
      resolutionMessage,
    });
  }

  return conflicts;
};

