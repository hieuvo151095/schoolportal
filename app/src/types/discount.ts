/**
 * Data contracts for Tuition Exemption & Fee Discount Policy Management (Miễn Giảm)
 * Finance Domain - Finviet / SOHA School Operating Portal
 */

export type DiscountCalculationType = 'percent' | 'fixed_amount';

export type DiscountScopeType = 'class' | 'student';

export type DiscountValidityType = 'academic_year' | 'month_range';

export type DiscountPolicyStatus = 'active' | 'paused' | 'expired';

export interface DiscountTarget {
  id: string;
  discountPolicyId: string;
  targetType: DiscountScopeType;
  targetId: string;
  targetName: string;
  targetClass?: string;
}

export interface DiscountPolicy {
  id: string;
  schoolCode: string;
  code: string;
  name: string;
  discountType: DiscountCalculationType;
  discountValue: number;
  feeItemId: string;
  feeItemName: string;
  scopeType: DiscountScopeType;
  validityType: DiscountValidityType;
  academicYearId?: string;
  academicYearName?: string;
  fromMonth?: string; // YYYY-MM
  toMonth?: string;   // YYYY-MM
  reason: string;
  status: DiscountPolicyStatus;
  targets: DiscountTarget[];
  excludedStudentIds?: string[]; // Students excluded from class-level policy because a replacement policy was applied
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeItemDiscountOption {
  id: string;
  feeNumber: number;
  code: string;
  name: string;
  defaultAmount: number;
  type?: 'system' | 'custom';
  unit?: string;
}

export interface InvoiceDiscountLine {
  id: string;
  invoiceId?: string;
  discountPolicyId: string;
  feeItemId: string;
  policyCode: string;
  policyName: string;
  discountType: DiscountCalculationType;
  discountValue: number;
  deductionAmount: number; // Integer VND
  appliedAt: string;
}

export interface DiscountFilterState {
  search: string;
  statusFilter: 'all' | 'active' | 'paused' | 'expired';
  feeItemIdFilter?: string;
  scopeFilter?: 'all' | 'class' | 'student';
}

export interface CreateDiscountPolicyPayload {
  name: string;
  discountType: DiscountCalculationType;
  discountValue: number;
  feeItemId: string;
  scopeType: DiscountScopeType;
  targetIds: string[];
  validityType: DiscountValidityType;
  academicYearId?: string;
  fromMonth?: string;
  toMonth?: string;
  reason: string;
  confirmReplacement?: boolean; // User confirmed replacing existing policies for conflicting students
}

export interface EditDiscountPolicyPayload extends CreateDiscountPolicyPayload {
  id: string;
}
