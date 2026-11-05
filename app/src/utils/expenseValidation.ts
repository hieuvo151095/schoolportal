import type {
  ExpenseVoucher,
  ExpenseLineItem,
  ExpenseCategory,
  ExpenseFilterCriteria,
  CreateVoucherFormData,
  VoucherLifecycleStatus,
} from '../types/expense.ts';

/**
 * Format numbers with Vietnamese thousand dot separators (e.g. 1.500.000 Đ)
 */
export function formatExpenseAmount(amount: number, includeSuffix = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return includeSuffix ? '0 Đ' : '0';
  }
  const formatted = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return includeSuffix ? `${formatted} Đ` : formatted;
}

/**
 * Calculate total for a single accounting line item: unitPrice * quantity
 */
export function calculateLineItemTotal(unitPrice: number, quantity: number): number {
  const price = Math.max(0, Number(unitPrice) || 0);
  const qty = Math.max(0, Number(quantity) || 0);
  return price * qty;
}

/**
 * Calculate aggregate voucher total from line items
 */
export function calculateVoucherTotal(
  lineItems: Array<{ unitPrice: number; quantity: number }>
): number {
  if (!lineItems || !Array.isArray(lineItems)) return 0;
  return lineItems.reduce((acc, item) => acc + calculateLineItemTotal(item.unitPrice, item.quantity), 0);
}

/**
 * BR05: Check whether a voucher can be cancelled.
 * Allowed in 'da_tao' and 'da_duyet'. Forbidden in 'da_chi' and 'da_huy'.
 */
export function canCancelVoucher(status: VoucherLifecycleStatus): boolean {
  return status === 'da_tao' || status === 'da_duyet';
}

/**
 * BR05: Check whether disbursement can be confirmed.
 * Allowed only when 'da_duyet'.
 */
export function canConfirmDisbursement(status: VoucherLifecycleStatus): boolean {
  return status === 'da_duyet';
}

/**
 * Check whether a voucher can be approved.
 * Allowed only when 'da_tao'.
 */
export function canApproveVoucher(status: VoucherLifecycleStatus): boolean {
  return status === 'da_tao';
}

/**
 * BR08: Check whether an expense category can be deleted.
 * The system default category ("Mặc định") is locked from deletion.
 */
export function canDeleteCategory(category: { isSystemDefault: boolean; name: string }): boolean {
  return !category.isSystemDefault && category.name.trim().toLowerCase() !== 'mặc định';
}

/**
 * BR07: Filter vouchers by mandatory single-month, search keyword, type, and status
 */
export function filterVouchers(
  vouchers: ExpenseVoucher[],
  filters: ExpenseFilterCriteria
): ExpenseVoucher[] {
  return vouchers.filter((v) => {
    // BR07: Mandatory single-month filter (matches YYYY-MM prefix)
    if (filters.selectedMonth && !v.createdDate.startsWith(filters.selectedMonth)) {
      return false;
    }

    // Voucher Type filter
    if (filters.voucherType !== 'all' && v.voucherType !== filters.voucherType) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && v.status !== filters.status) {
      return false;
    }

    // Search query filter
    if (filters.searchKeyword && filters.searchKeyword.trim() !== '') {
      const q = filters.searchKeyword.trim().toLowerCase();
      const matchCode = v.voucherCode.toLowerCase().includes(q);
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchTarget = v.targetName.toLowerCase().includes(q);
      const matchRecipient = v.recipientName.toLowerCase().includes(q);
      const matchCategory = v.categoryName.toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchTarget && !matchRecipient && !matchCategory) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validate new expense voucher form data
 */
export function validateCreateVoucher(data: CreateVoucherFormData): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Vui lòng nhập tên phiếu chi';
  }

  if (!data.createdDate || data.createdDate.trim() === '') {
    errors.createdDate = 'Vui lòng chọn ngày lập';
  }

  if (!data.categoryId || data.categoryId.trim() === '') {
    errors.categoryId = 'Vui lòng chọn danh mục chi phí';
  }

  if (!data.targetId || data.targetId.trim() === '') {
    errors.targetId = data.targetType === 'hoc_sinh' ? 'Vui lòng chọn học sinh' : 'Vui lòng chọn nhân viên';
  }

  if (data.targetType === 'hoc_sinh' && (!data.recipientName || data.recipientName.trim() === '')) {
    errors.recipientName = 'Vui lòng nhập người nhận tiền (phụ huynh)';
  }

  if (!data.lineItems || data.lineItems.length === 0) {
    errors.lineItems = 'Bảng hoạch toán phải có ít nhất 1 dòng chi phí';
  } else {
    data.lineItems.forEach((item, index) => {
      if (!item.content || item.content.trim() === '') {
        errors[`lineItem_${index}_content`] = `Vui lòng nhập nội dung dòng ${index + 1}`;
      }
      if (item.unitPrice === undefined || item.unitPrice === null || item.unitPrice < 0) {
        errors[`lineItem_${index}_unitPrice`] = `Đơn giá dòng ${index + 1} không hợp lệ`;
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`lineItem_${index}_quantity`] = `Số lượng dòng ${index + 1} phải lớn hơn 0`;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate cancellation reason note
 */
export function validateCancelVoucher(reason: string): { isValid: boolean; error?: string } {
  if (!reason || reason.trim() === '') {
    return {
      isValid: false,
      error: 'Vui lòng nhập ghi chú lý do hủy phiếu chi',
    };
  }
  return { isValid: true };
}

/**
 * Helper to get lifecycle status display metadata
 */
export function getLifecycleStatusMeta(status: VoucherLifecycleStatus): {
  label: string;
  badgeClass: string;
  dotColor: string;
} {
  switch (status) {
    case 'da_chi':
      return {
        label: 'Đã chi',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    case 'da_duyet':
      return {
        label: 'Đã duyệt',
        badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200',
        dotColor: 'bg-sky-500',
      };
    case 'da_tao':
      return {
        label: 'Đã tạo',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'da_huy':
      return {
        label: 'Đã hủy',
        badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
        dotColor: 'bg-rose-500',
      };
    default:
      return {
        label: status,
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
        dotColor: 'bg-slate-400',
      };
  }
}
