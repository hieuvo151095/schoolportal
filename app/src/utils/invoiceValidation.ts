/**
 * Business rules and validation engine for Finance - Tuition Invoices (Học Phí)
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * References:
 * - docs_legacy/operating-portal/tai-chinh/hoc-phi.md (BR01 - BR11)
 * - TASK-FIN-001 (Invoice tracking and payment history)
 * - TASK-FIN-002 (Attendance-linked meal fee deductions)
 */

import type {
  InvoiceLifecycleStatus,
  InvoiceLineItem,
  InvoiceRecord,
  InvoiceFilterCriteria,
  VietQRDetails,
} from '../types/invoice.ts';

/**
 * Format currency amount to Vietnamese Dong standard format (e.g. "1.850.000 đ")
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 đ';
  }
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted} đ`;
}

/**
 * Format currency number to Vietnamese dot-separated thousands without currency symbol (e.g. 2500000 -> "2.500.000")
 */
export function formatCurrencyNumber(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  const rounded = Math.round(amount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parse dot-formatted currency string back to integer (e.g. "2.500.000" -> 2500000)
 */
export function parseCurrencyNumber(formattedStr: string | number | null | undefined): number {
  if (formattedStr === null || formattedStr === undefined || formattedStr === '') return 0;
  if (typeof formattedStr === 'number') return Math.round(formattedStr);
  const raw = formattedStr.replace(/[^\d]/g, '');
  return raw ? parseInt(raw, 10) : 0;
}

/**
 * TASK-FIN-002: MoET meal fee deduction formula
 * Deducts excused absence days * daily meal rate from total meal days.
 * Strictly rounds to integer VND units to avoid decimal fractions.
 */
export function calculateMealDeduction(
  dailyMealRate: number,
  excusedAbsenceDays: number,
  schoolDays: number
): {
  deductedAmount: number;
  netMealDays: number;
  totalMealFee: number;
} {
  const safeAbsence = Math.max(0, Math.floor(excusedAbsenceDays || 0));
  const safeSchoolDays = Math.max(0, Math.floor(schoolDays || 0));
  const safeRate = Math.max(0, Math.round(dailyMealRate || 0));

  const actualAbsence = Math.min(safeAbsence, safeSchoolDays);
  const netMealDays = Math.max(0, safeSchoolDays - actualAbsence);
  const deductedAmount = actualAbsence * safeRate;
  const totalMealFee = netMealDays * safeRate;

  return {
    deductedAmount,
    netMealDays,
    totalMealFee,
  };
}

/**
 * Calculate amount and discount for a single invoice line item
 */
export function calculateLineItemTotal(
  unitPrice: number,
  quantity: number,
  discountPercent = 0,
  explicitDiscountAmount?: number
): {
  amount: number;
  discountAmount: number;
} {
  const safePrice = Math.max(0, Math.round(unitPrice || 0));
  const safeQty = Math.max(0, quantity || 0);
  const safePercent = Math.min(100, Math.max(0, discountPercent || 0));
  const gross = Math.round(safePrice * safeQty);

  const discountAmount =
    explicitDiscountAmount !== undefined
      ? Math.min(gross, Math.max(0, Math.round(explicitDiscountAmount)))
      : Math.round(gross * (safePercent / 100));

  const amount = Math.max(0, gross - discountAmount);

  return {
    amount,
    discountAmount,
  };
}

/**
 * Calculate invoice subtotal, total discount, and net payable amount
 */
export function calculateInvoiceTotals(items: InvoiceLineItem[]): {
  subtotal: number;
  discountTotal: number;
  totalAmount: number;
} {
  if (!items || items.length === 0) {
    return { subtotal: 0, discountTotal: 0, totalAmount: 0 };
  }

  let subtotal = 0;
  let discountTotal = 0;
  let totalAmount = 0;

  for (const item of items) {
    subtotal += Math.round(item.unitPrice * item.quantity);
    discountTotal += Math.round(item.discountAmount || 0);
    totalAmount += Math.round(item.amount);
  }

  return {
    subtotal,
    discountTotal,
    totalAmount,
  };
}

/**
 * Parse date string formatted as DD/MM/YYYY or YYYY-MM-DD
 */
export function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  } else if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * BR02: Resolve dynamic invoice lifecycle status based on payments and due date
 * Transitions to 'qua_han' if dispatched and >= 2 days past due date without full settlement.
 */
export function resolveInvoiceStatus(
  totalAmount: number,
  paidAmount: number,
  dueDate: string,
  currentStatus: InvoiceLifecycleStatus,
  referenceDate = new Date(2026, 8, 18) // Simulated date: 18 Sep 2026
): InvoiceLifecycleStatus {
  if (currentStatus === 'da_huy') {
    return 'da_huy';
  }

  if (paidAmount >= totalAmount && totalAmount > 0) {
    return 'da_thanh_toan';
  }

  if (paidAmount > 0 && paidAmount < totalAmount) {
    return 'thanh_toan_mot_phan';
  }

  // If unpaid (paidAmount === 0)
  const parsedDue = parseDateString(dueDate);
  let isOverdueBy2Days = false;
  if (parsedDue) {
    const diffTime = referenceDate.getTime() - parsedDue.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 2) {
      isOverdueBy2Days = true;
    }
  }

  if (currentStatus === 'da_tao') {
    return 'da_tao';
  }

  if (isOverdueBy2Days) {
    return 'qua_han';
  }

  return 'da_gui';
}

/**
 * Generate standard VietQR payload with syntax: "HOCPHI {invoiceNo}"
 */
export function generateVietQRPayload(
  invoiceNo: string,
  amount: number,
  bankName = 'MB Bank (NHTM Cổ phần Quân đội)',
  accountNo = '0987654321',
  accountHolder = 'TRUONG LIEN CAP FINVIET'
): VietQRDetails {
  const safeInvoiceNo = invoiceNo.trim().toUpperCase();
  const transferContent = `HOCPHI ${safeInvoiceNo}`;
  // SVG encoded QR placeholder for clean, deterministic display
  const qrSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="white"/><rect x="20" y="20" width="45" height="45" fill="%230070CE"/><rect x="30" y="30" width="25" height="25" fill="white"/><rect x="35" y="35" width="15" height="15" fill="%230070CE"/><rect x="135" y="20" width="45" height="45" fill="%230070CE"/><rect x="145" y="30" width="25" height="25" fill="white"/><rect x="150" y="35" width="15" height="15" fill="%230070CE"/><rect x="20" y="135" width="45" height="45" fill="%230070CE"/><rect x="30" y="145" width="25" height="25" fill="white"/><rect x="35" y="150" width="15" height="15" fill="%230070CE"/><rect x="80" y="25" width="15" height="30" fill="%230070CE"/><rect x="105" y="45" width="20" height="15" fill="%230070CE"/><rect x="25" y="80" width="30" height="15" fill="%230070CE"/><rect x="80" y="80" width="40" height="40" fill="%23FEC020"/><rect x="135" y="90" width="15" height="30" fill="%230070CE"/><rect x="90" y="140" width="30" height="15" fill="%230070CE"/><rect x="135" y="145" width="40" height="40" fill="%230070CE"/><text x="100" y="105" font-family="sans-serif" font-size="9" font-weight="bold" fill="%23000" text-anchor="middle">VIETQR</text></svg>`;

  return {
    bankName,
    bankCode: 'MB',
    accountNo,
    accountHolder,
    transferContent,
    qrImageUrl: qrSvg,
  };
}

/**
 * BR03: Asymmetric action permissions matrix
 */
export function getPermittedActions(status: InvoiceLifecycleStatus): string[] {
  switch (status) {
    case 'da_tao':
      return ['edit', 'send', 'delete', 'cancel'];
    case 'da_gui':
      return ['pay', 'print', 'cancel'];
    case 'da_thanh_toan':
      return ['print', 'history'];
    case 'thanh_toan_mot_phan':
      return ['pay', 'print', 'history', 'cancel'];
    case 'qua_han':
      return ['pay', 'print', 'cancel', 'remind'];
    case 'da_huy':
      return ['print'];
    default:
      return ['print'];
  }
}

/**
 * BR04: Dynamic batch actions intersection
 * If all selected are 'da_tao' -> ['send', 'delete']
 * If all selected are unpaid ('da_gui', 'thanh_toan_mot_phan', 'qua_han') -> ['pay']
 * Otherwise empty array.
 */
export function getPermittedBatchActions(selectedInvoices: InvoiceRecord[]): string[] {
  if (!selectedInvoices || selectedInvoices.length === 0) {
    return [];
  }

  const allDraft = selectedInvoices.every((inv) => inv.status === 'da_tao');
  if (allDraft) {
    return ['send', 'delete'];
  }

  const allPayable = selectedInvoices.every(
    (inv) =>
      inv.status === 'da_gui' ||
      inv.status === 'thanh_toan_mot_phan' ||
      inv.status === 'qua_han'
  );
  if (allPayable) {
    return ['pay'];
  }

  return [];
}

/**
 * BR11: Multi-criteria filtering engine
 */
export function filterInvoices(
  invoices: InvoiceRecord[],
  criteria: InvoiceFilterCriteria
): InvoiceRecord[] {
  if (!invoices) return [];

  return invoices.filter((inv) => {
    // 1. Keyword search
    if (criteria.searchKeyword && criteria.searchKeyword.trim()) {
      const q = criteria.searchKeyword.trim().toLowerCase();
      const matchName = inv.studentName.toLowerCase().includes(q);
      const matchCode = inv.studentCode.toLowerCase().includes(q);
      const matchInvoiceNo = inv.invoiceNo.toLowerCase().includes(q);
      const matchTitle = inv.title.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchInvoiceNo && !matchTitle) {
        return false;
      }
    }

    // 2. Class ID
    if (criteria.classId && criteria.classId !== 'tat_ca') {
      if (inv.classId !== criteria.classId) {
        return false;
      }
    }

    // 3. Billing Month (e.g. "2026-09")
    if (criteria.billingMonth && criteria.billingMonth !== 'tat_ca') {
      if (inv.billingMonth !== criteria.billingMonth) {
        return false;
      }
    }

    // 3b. Invoice Date Range (Lọc theo Thời gian tạo HĐ hoặc Hạn đóng HĐ)
    const isDueDateFilter = criteria.dateFilterType === 'dueDate';

    if (criteria.createdDateFrom) {
      const fromDate = new Date(criteria.createdDateFrom + 'T00:00:00');
      if (!isNaN(fromDate.getTime())) {
        if (isDueDateFilter) {
          const invDue = parseDateString(inv.dueDate);
          if (invDue && invDue < fromDate) {
            return false;
          }
        } else {
          const invCreated = new Date(inv.createdAt);
          if (!isNaN(invCreated.getTime()) && invCreated < fromDate) {
            return false;
          }
        }
      }
    }

    if (criteria.createdDateTo) {
      const toDate = new Date(criteria.createdDateTo + 'T23:59:59.999');
      if (!isNaN(toDate.getTime())) {
        if (isDueDateFilter) {
          const invDue = parseDateString(inv.dueDate);
          if (invDue && invDue > toDate) {
            return false;
          }
        } else {
          const invCreated = new Date(inv.createdAt);
          if (!isNaN(invCreated.getTime()) && invCreated > toDate) {
            return false;
          }
        }
      }
    }

    // 4. Status
    if (criteria.status && criteria.status !== 'tat_ca') {
      if (inv.status !== criteria.status) {
        return false;
      }
    }

    // 5. Grade level
    if (criteria.gradeLevel && criteria.gradeLevel !== 'tat_ca') {
      if (inv.gradeLevel !== criteria.gradeLevel) {
        return false;
      }
    }

    // 6. Has Deduction / Refund
    if (criteria.hasDeduction !== null) {
      const hasDiscount = inv.discountTotal > 0;
      if (criteria.hasDeduction && !hasDiscount) return false;
      if (!criteria.hasDeduction && hasDiscount) return false;
    }

    // 7. Has Electronic Invoice
    if (criteria.hasElectronicInvoice !== null) {
      if (inv.exportElectronicInvoice !== criteria.hasElectronicInvoice) {
        return false;
      }
    }

    // 8. Payment Method
    if (criteria.paymentMethod && criteria.paymentMethod !== 'tat_ca') {
      const hasMethod = inv.paymentHistory.some(
        (p) => p.paymentMethod === criteria.paymentMethod
      );
      if (!hasMethod) return false;
    }

    return true;
  });
}
