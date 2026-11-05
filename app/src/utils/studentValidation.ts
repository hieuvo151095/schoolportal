import type { Student, ClassTransferPayload, StudentFilterState, BmiClassification } from '../types/student';
import type { DiscountPolicy } from '../types/discount';

export interface ActiveStudentDiscountItem {
  id: string;
  code: string;
  name: string;
  feeItemName: string;
  discountType: 'percent' | 'fixed_amount';
  discountValue: number;
  discountDisplay: string;
  scopeType: 'student' | 'class';
  scopeText: string;
  validityText: string;
  reason: string;
  status: string;
}

/**
 * Checks whether a student is currently covered by at least one valid discount program
 */
export function hasStudentDiscount(
  student: Student,
  policies: DiscountPolicy[] = []
): boolean {
  const { hasDiscount } = getStudentActiveDiscounts(student, policies);
  return hasDiscount;
}

/**
 * Returns all currently valid discount programs applied to a specific student.
 * Enforces rule: each student has AT MOST ONE valid program per fee item.
 */
export function getStudentActiveDiscounts(
  student: Student,
  policies: DiscountPolicy[] = []
): {
  hasDiscount: boolean;
  activeDiscounts: ActiveStudentDiscountItem[];
} {
  const rawList: ActiveStudentDiscountItem[] = [];

  // Match policies from Redux discount state
  policies.forEach((policy) => {
    if (policy.status !== 'active') return;
    if (policy.excludedStudentIds?.includes(student.id)) return;

    const matchedStudentTarget = policy.targets.find(
      (t) => t.targetType === 'student' && t.targetId === student.id
    );
    const matchedClassTarget = policy.targets.find(
      (t) => t.targetType === 'class' && t.targetId === student.classId
    );

    if (matchedStudentTarget || matchedClassTarget) {
      const isStudentScope = Boolean(matchedStudentTarget);
      const validityText =
        policy.validityType === 'academic_year'
          ? policy.academicYearName || 'Cả năm học'
          : policy.fromMonth && policy.toMonth
          ? `${policy.fromMonth} → ${policy.toMonth}`
          : 'Có thời hạn';

      const discountDisplay =
        policy.discountType === 'percent'
          ? `${policy.discountValue}%`
          : `${(policy.discountValue ?? 0).toLocaleString('vi-VN')} đ`;

      rawList.push({
        id: policy.id,
        code: policy.code,
        name: policy.name,
        feeItemName: policy.feeItemName,
        discountType: policy.discountType,
        discountValue: policy.discountValue,
        discountDisplay,
        scopeType: isStudentScope ? 'student' : 'class',
        scopeText: isStudentScope
          ? `Cá nhân (${student.fullName})`
          : `Theo lớp (${student.className || 'Lớp học'})`,
        validityText,
        reason: policy.reason || 'Chính sách ưu đãi của trường',
        status: 'Đang áp dụng',
      });
    }
  });

  // Single valid program per fee item rule:
  // For each distinct fee category, only ONE program is allowed.
  // Student-scoped policy takes precedence over class-scoped policy.
  // If multiple exist with same scope, the latest/first one takes precedence.
  const feeMap = new Map<string, ActiveStudentDiscountItem>();
  for (const item of rawList) {
    const key = (item.feeItemName || '').trim().toLowerCase();
    const existing = feeMap.get(key);
    if (!existing) {
      feeMap.set(key, item);
    } else {
      // If the current item is student-scoped and existing is class-scoped, replace it!
      if (item.scopeType === 'student' && existing.scopeType !== 'student') {
        feeMap.set(key, item);
      }
    }
  }

  const result = Array.from(feeMap.values());

  // Check if student has tuitionDiscountPercent not yet represented in policies
  if (student.tuitionDiscountPercent && student.tuitionDiscountPercent > 0) {
    const hasTuitionPolicy = result.some((item) =>
      item.feeItemName.toLowerCase().includes('học phí')
    );
    if (!hasTuitionPolicy) {
      result.unshift({
        id: `override-${student.id}`,
        code: 'MG-HS',
        name: 'Ưu đãi học phí theo hồ sơ học sinh',
        feeItemName: 'Học phí chính khóa',
        discountType: 'percent',
        discountValue: student.tuitionDiscountPercent,
        discountDisplay: `${student.tuitionDiscountPercent}%`,
        scopeType: 'student',
        scopeText: `Cá nhân (${student.fullName})`,
        validityText: 'Năm học 2026 - 2027',
        reason: student.notes || 'Miễn giảm trực tiếp theo quyết định hồ sơ',
        status: 'Đang áp dụng',
      });
    }
  }

  return {
    hasDiscount: result.length > 0,
    activeDiscounts: result,
  };
}

/**
 * Calculates BMI given height in cm and weight in kg
 * Formula: weight (kg) / (height (m) ^ 2)
 */
export function calculateBmi(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Classifies BMI into standard pediatric / WHO nutritional categories
 */
export function classifyBmi(bmi: number): BmiClassification {
  if (bmi <= 0) return 'normal';
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25.0) return 'normal';
  if (bmi < 30.0) return 'overweight';
  return 'obese';
}

/**
 * Vietnamese human-readable label for BMI classification
 */
export function formatBmiClassification(classification: BmiClassification): string {
  switch (classification) {
    case 'underweight':
      return 'Thiếu cân';
    case 'normal':
      return 'Bình thường';
    case 'overweight':
      return 'Thừa cân';
    case 'obese':
      return 'Béo phì';
    default:
      return 'Bình thường';
  }
}

/**
 * Visual badge color styles for BMI
 */
export function getBmiBadgeStyle(classification: BmiClassification): { bg: string; text: string } {
  switch (classification) {
    case 'underweight':
      return { bg: '#FEF3C7', text: '#92400E' }; // Amber
    case 'normal':
      return { bg: '#D1FAE5', text: '#065F46' }; // Emerald
    case 'overweight':
      return { bg: '#FFEDD5', text: '#9A3412' }; // Orange
    case 'obese':
      return { bg: '#FEE2E2', text: '#991B1B' }; // Red
    default:
      return { bg: '#F3F4F6', text: '#374151' };
  }
}

/**
 * Validates student creation input
 * Enforces BR-KID-01: Full name, DOB, gender, class, student code, CCCD, and at least 1 guardian
 */
export function validateStudentCreation(student: Partial<Student>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!student.fullName || !student.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên học sinh';
  }

  if (!student.dob || !student.dob.trim()) {
    errors.dob = 'Vui lòng chọn ngày sinh';
  }

  if (!student.gender) {
    errors.gender = 'Vui lòng chọn giới tính';
  }

  if (!student.classId || !student.classId.trim()) {
    errors.classId = 'Vui lòng chọn lớp học';
  }

  if (!student.studentCode || !student.studentCode.trim()) {
    errors.studentCode = 'Vui lòng nhập mã học sinh';
  }

  if (!student.cccd || !student.cccd.trim()) {
    errors.cccd = 'Vui lòng nhập số định danh cá nhân / CCCD';
  }

  if (!student.guardians || student.guardians.length === 0) {
    errors.guardians = 'Vui lòng thêm ít nhất một người giám hộ';
  } else {
    const primary = student.guardians[0];
    if (!primary.fullName || !primary.fullName.trim()) {
      errors.guardianName = 'Vui lòng nhập họ tên người giám hộ';
    }
    if (!primary.phone || !primary.phone.trim()) {
      errors.guardianPhone = 'Vui lòng nhập số điện thoại người giám hộ';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Gracefully formats legacy fields that may be null or undefined (Resolution K008)
 */
export function formatLegacyField(value?: string | null, placeholder = 'Chưa có thông tin'): string {
  if (!value || !value.trim()) {
    return placeholder;
  }
  return value.trim();
}

/**
 * Validates single student transfer or bulk academic year class promotion
 * Enforces BR-KID-03: Source !== Target, non-empty selection, valid effective date
 */
export function validateClassTransfer(payload: ClassTransferPayload): {
  isValid: boolean;
  error?: string;
} {
  if (!payload.studentIds || payload.studentIds.length === 0) {
    return { isValid: false, error: 'Vui lòng chọn ít nhất một học sinh để chuyển lớp' };
  }

  if (!payload.targetClassId || !payload.targetClassId.trim()) {
    return { isValid: false, error: 'Vui lòng chọn lớp chuyển đến' };
  }

  if (payload.sourceClassId === payload.targetClassId) {
    return { isValid: false, error: 'Lớp chuyển đến phải khác lớp hiện tại của học sinh' };
  }

  if (!payload.effectiveDate || !payload.effectiveDate.trim()) {
    return { isValid: false, error: 'Vui lòng chọn ngày có hiệu lực chuyển lớp' };
  }

  return { isValid: true };
}

/**
 * Filters a student record against active search keywords, class, status, gender, and discount criteria
 */
export function matchesStudentFilter(
  student: Student,
  filter: StudentFilterState,
  policies: DiscountPolicy[] = []
): boolean {
  if (filter.classId && filter.classId !== 'all' && student.classId !== filter.classId) {
    return false;
  }

  if (filter.status && filter.status !== 'all' && student.status !== filter.status) {
    return false;
  }

  if (filter.gender && filter.gender !== 'all' && student.gender !== filter.gender) {
    return false;
  }

  if (filter.discountFilter && filter.discountFilter !== 'all') {
    const hasDiscount = hasStudentDiscount(student, policies);
    if (filter.discountFilter === 'co_mien_giam' && !hasDiscount) {
      return false;
    }
    if (filter.discountFilter === 'khong_mien_giam' && hasDiscount) {
      return false;
    }
  }

  if (filter.search && filter.search.trim()) {
    const q = filter.search.trim().toLowerCase();
    const matchName = student.fullName.toLowerCase().includes(q);
    const matchNick = student.nickName ? student.nickName.toLowerCase().includes(q) : false;
    const matchCode = student.studentCode ? student.studentCode.toLowerCase().includes(q) : false;
    const matchCccd = student.cccd ? student.cccd.toLowerCase().includes(q) : false;
    const matchClass = student.className.toLowerCase().includes(q);
    const matchGuardian = student.guardians.some(
      (g) => g.fullName.toLowerCase().includes(q) || g.phone.includes(q)
    );

    return matchName || matchNick || matchCode || matchCccd || matchClass || matchGuardian;
  }

  return true;
}

