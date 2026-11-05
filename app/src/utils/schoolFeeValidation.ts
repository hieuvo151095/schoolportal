/**
 * Business rules and validation engine for Fee Catalog (Khoản Phí)
 * Enforces BR01 through BR10 from docs_legacy/operating-portal/tai-chinh/khoan-phi.md
 */

import type {
  FeeItem,
  FeeItemType,
  FeeUnit,
  FeeFilterCriteria,
  CreateFeeFormData,
  EditFeeFormData,
  StudentFeeAssignment,
} from '../types/schoolFee.ts';

/**
 * BR02: Mapping of 8 standardized educational fee units to Vietnamese labels
 */
export const FEE_UNIT_LABELS: Record<FeeUnit, string> = {
  ngay: 'Ngày',
  thang: 'Tháng',
  nam: 'Năm',
  lan: 'Lần',
  chuyen: 'Chuyến',
  bo: 'Bộ',
  khac: 'Khác',
  gio: 'Giờ',
  day: 'Ngày',
  month: 'Tháng',
  year: 'Năm',
  time: 'Lần',
};

export const FEE_UNIT_OPTIONS: { value: FeeUnit; label: string }[] = [
  { value: 'ngay', label: 'Ngày' },
  { value: 'thang', label: 'Tháng' },
  { value: 'nam', label: 'Năm' },
  { value: 'lan', label: 'Lần' },
  { value: 'chuyen', label: 'Chuyến' },
  { value: 'bo', label: 'Bộ' },
  { value: 'khac', label: 'Khác' },
  { value: 'gio', label: 'Giờ' },
];

/**
 * Format currency with dot thousands separator and currency suffix
 */
export function formatFeeAmount(amount: number | undefined): string {
  if (amount === undefined || amount === null) {
    return '—';
  }
  return `${amount.toLocaleString('vi-VN')} đ`;
}

/**
 * Format fee unit label
 */
export function formatFeeUnit(unit: FeeUnit | undefined): string {
  if (!unit) {
    return '—';
  }
  return FEE_UNIT_LABELS[unit] || unit;
}

/**
 * BR01: Check if fee item is a protected system fee
 * System fees (Học phí, Tiền ăn, Phí trả học sinh trễ) cannot have their amount/unit edited
 * and cannot be deleted.
 */
export function isSystemFee(item: FeeItem): boolean {
  return item.type === 'system';
}

/**
 * BR06 & BR07: Filter fee items by search keyword and electronic invoice status
 */
export function filterFeeItems(
  items: FeeItem[],
  criteria: FeeFilterCriteria
): FeeItem[] {
  const filtered = items.filter((item) => {
    // Search keyword filter (case-insensitive substring)
    if (criteria.search && criteria.search.trim()) {
      const keyword = criteria.search.trim().toLowerCase();
      const matchName = item.name.toLowerCase().includes(keyword);
      const matchCode = item.code.toLowerCase().includes(keyword);
      if (!matchName && !matchCode) {
        return false;
      }
    }

    // Electronic invoice filter
    if (criteria.exportElectronicInvoiceFilter === 'yes') {
      if (!item.exportElectronicInvoice) {
        return false;
      }
    } else if (criteria.exportElectronicInvoiceFilter === 'no') {
      if (item.exportElectronicInvoice) {
        return false;
      }
    }

    // Unit filter
    if (criteria.unitFilter && criteria.unitFilter !== 'all') {
      if (item.unit !== criteria.unitFilter) {
        return false;
      }
    }

    // Revenue category filter
    if (criteria.revenueCategoryFilter && criteria.revenueCategoryFilter !== 'all') {
      if (item.revenue_category_id !== criteria.revenueCategoryFilter) {
        return false;
      }
    }

    return true;
  });

  // Sort by unit if requested
  if (criteria.sortUnit && criteria.sortUnit !== 'none') {
    return [...filtered].sort((a, b) => {
      const unitA = a.unit ? (FEE_UNIT_LABELS[a.unit] || a.unit) : '';
      const unitB = b.unit ? (FEE_UNIT_LABELS[b.unit] || b.unit) : '';
      if (!unitA && !unitB) return 0;
      if (!unitA) return 1;
      if (!unitB) return -1;
      const comp = unitA.localeCompare(unitB, 'vi');
      return criteria.sortUnit === 'desc' ? -comp : comp;
    });
  }

  return filtered;
}

/**
 * BR07 & BR08: Calculate custom fee count
 * The footer total strictly counts ONLY custom fee items, excluding the 3 system fees,
 * regardless of whether a filter is applied.
 */
export function calculateCustomFeeCount(items: FeeItem[]): number {
  return items.filter((item) => item.type === 'custom').length;
}

/**
 * BR09: Validate Create Fee Item Form input
 */
export function validateCreateFeeItemInput(data: CreateFeeFormData): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Tên khoản phí không được để trống';
  }

  if (data.defaultAmount === undefined || data.defaultAmount === null) {
    errors.defaultAmount = 'Số tiền mặc định không được để trống';
  } else if (isNaN(data.defaultAmount) || data.defaultAmount < 0) {
    errors.defaultAmount = 'Số tiền mặc định phải là số không âm';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * BR04: Validate Edit Fee Item Form input
 * (Note: Form Sửa only has Name and Default Amount + Unit. No HĐĐT field)
 */
export function validateEditFeeItemInput(data: EditFeeFormData): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Tên khoản phí không được để trống';
  }

  if (data.defaultAmount === undefined || data.defaultAmount === null) {
    errors.defaultAmount = 'Số tiền mặc định không được để trống';
  } else if (isNaN(data.defaultAmount) || data.defaultAmount < 0) {
    errors.defaultAmount = 'Số tiền mặc định phải là số không âm';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * BR05: Filter student assignments by search student name and class ID
 */
export function filterStudentAssignments(
  assignments: StudentFeeAssignment[],
  feeId: string,
  search: string,
  classIdFilter: string
): StudentFeeAssignment[] {
  return assignments.filter((assign) => {
    if (assign.feeId !== feeId) {
      return false;
    }

    if (classIdFilter && classIdFilter !== 'all') {
      if (assign.classId !== classIdFilter) {
        return false;
      }
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      const matchName = assign.studentName.toLowerCase().includes(keyword);
      const matchClass = assign.className.toLowerCase().includes(keyword);
      if (!matchName && !matchClass) {
        return false;
      }
    }

    return true;
  });
}
