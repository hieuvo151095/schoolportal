/**
 * Business rules and calculation engine for Fee Collection Reports & Analytics
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/bao-cao-hoc-phi.md
 */

import type { InvoiceRecord, PaymentMethod } from '../types/invoice.ts';
import type {
  ClassFeeOverviewRow,
  FeeReportFilterCriteria,
  FeeReportSummaryKPIs,
} from '../types/feeReport.ts';

/**
 * Format currency to Vietnamese standard with dot separators and Đ suffix (BR09, NFR03)
 * e.g. 1199407125 -> "1.199.407.125 Đ"
 */
export function formatFeeReportCurrency(amount: number): string {
  if (isNaN(amount)) return '0 Đ';
  const parts = Math.round(amount).toString().split('');
  let formatted = '';
  for (let i = parts.length - 1, count = 1; i >= 0; i--, count++) {
    formatted = parts[i] + formatted;
    if (count % 3 === 0 && i !== 0) {
      formatted = '.' + formatted;
    }
  }
  return `${formatted} Đ`;
}

/**
 * Compute collection rate as percentage rounded to 1 decimal place
 */
export function calculateCollectionRate(collected: number, total: number): number {
  if (total <= 0 || collected <= 0) return 0;
  const rate = (collected / total) * 100;
  return Math.min(100, Math.round(rate * 10) / 10);
}

/**
 * Helper to parse Vietnamese DD/MM/YYYY date or YYYY-MM-DD into a Date object
 */
export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  }
  if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  }
  const timestamp = Date.parse(dateStr);
  return isNaN(timestamp) ? null : new Date(timestamp);
}

/**
 * Check if invoice due date is overdue relative to reference date (BR05)
 */
export function isInvoiceOverdue(invoice: InvoiceRecord, referenceDate: string = '2026-09-22'): boolean {
  if (invoice.status === 'da_thanh_toan' || invoice.status === 'da_huy') {
    return false;
  }
  if (invoice.status === 'qua_han') {
    return true;
  }
  const dueDate = parseDate(invoice.dueDate);
  const refDate = parseDate(referenceDate);
  if (!dueDate || !refDate) return false;
  return dueDate.getTime() < refDate.getTime();
}

/**
 * Calculate Overview table breakdown grouped by class and archived students (BR02)
 */
export function calculateClassOverviewRows(
  invoices: InvoiceRecord[],
  selectedClassId: string = 'all'
): {
  rows: ClassFeeOverviewRow[];
  totals: ClassFeeOverviewRow;
  kpis: FeeReportSummaryKPIs;
} {
  // Map of classId -> ClassFeeOverviewRow
  const classMap = new Map<string, ClassFeeOverviewRow>();
  
  // Dedicated row for archived / deleted students (BR02)
  const archivedRow: ClassFeeOverviewRow = {
    classId: 'archived',
    className: 'Học sinh lưu trữ / đã xoá',
    isArchivedGroup: true,
    totalInvoices: 0,
    totalAmount: 0,
    paidCount: 0,
    paidAmount: 0,
    partialCount: 0,
    partialAmount: 0,
    unpaidCount: 0,
    unpaidAmount: 0,
    remainingAmount: 0,
    collectionRate: 0,
  };

  invoices.forEach((inv) => {
    // Ignore cancelled invoices in financial collection overview
    if (inv.status === 'da_huy') return;

    const isArchivedStudent =
      inv.classId === 'archived' ||
      inv.className.toLowerCase().includes('lưu trữ') ||
      inv.studentId.startsWith('hs-archived');

    const targetRow: ClassFeeOverviewRow = isArchivedStudent
      ? archivedRow
      : classMap.get(inv.classId) || {
          classId: inv.classId,
          className: inv.className,
          isArchivedGroup: false,
          totalInvoices: 0,
          totalAmount: 0,
          paidCount: 0,
          paidAmount: 0,
          partialCount: 0,
          partialAmount: 0,
          unpaidCount: 0,
          unpaidAmount: 0,
          remainingAmount: 0,
          collectionRate: 0,
        };

    targetRow.totalInvoices += 1;
    targetRow.totalAmount += inv.totalAmount;
    targetRow.remainingAmount += inv.remainingAmount;

    if (inv.status === 'da_thanh_toan') {
      targetRow.paidCount += 1;
      targetRow.paidAmount += inv.paidAmount;
    } else if (inv.status === 'thanh_toan_mot_phan') {
      targetRow.partialCount += 1;
      targetRow.partialAmount += inv.paidAmount;
    } else {
      // da_gui, da_tao, qua_han
      targetRow.unpaidCount += 1;
      targetRow.unpaidAmount += inv.remainingAmount;
    }

    if (!isArchivedStudent) {
      classMap.set(inv.classId, targetRow);
    }
  });

  // Calculate collection rate for each class row
  const activeClassRows: ClassFeeOverviewRow[] = Array.from(classMap.values()).map((row) => ({
    ...row,
    collectionRate: calculateCollectionRate(row.paidAmount + row.partialAmount, row.totalAmount),
  }));

  // Calculate collection rate for archived row
  archivedRow.collectionRate = calculateCollectionRate(
    archivedRow.paidAmount + archivedRow.partialAmount,
    archivedRow.totalAmount
  );

  // Filter by selectedClassId if specified
  let filteredRows = activeClassRows;
  if (selectedClassId && selectedClassId !== 'all') {
    filteredRows = activeClassRows.filter((r) => r.classId === selectedClassId);
  }

  // Append archived row if it has invoices and filter allows (BR02)
  const finalRows = [...filteredRows];
  if (selectedClassId === 'all' && archivedRow.totalInvoices > 0) {
    finalRows.push(archivedRow);
  }

  // Calculate totals footer row (BR02)
  const totals: ClassFeeOverviewRow = {
    classId: 'total',
    className: 'Tổng cộng',
    totalInvoices: 0,
    totalAmount: 0,
    paidCount: 0,
    paidAmount: 0,
    partialCount: 0,
    partialAmount: 0,
    unpaidCount: 0,
    unpaidAmount: 0,
    remainingAmount: 0,
    collectionRate: 0,
  };

  finalRows.forEach((r) => {
    totals.totalInvoices += r.totalInvoices;
    totals.totalAmount += r.totalAmount;
    totals.paidCount += r.paidCount;
    totals.paidAmount += r.paidAmount;
    totals.partialCount += r.partialCount;
    totals.partialAmount += r.partialAmount;
    totals.unpaidCount += r.unpaidCount;
    totals.unpaidAmount += r.unpaidAmount;
    totals.remainingAmount += r.remainingAmount;
  });

  totals.collectionRate = calculateCollectionRate(
    totals.paidAmount + totals.partialAmount,
    totals.totalAmount
  );

  // Overall KPIs
  const kpis: FeeReportSummaryKPIs = {
    totalInvoices: totals.totalInvoices,
    totalAmount: totals.totalAmount,
    totalCollected: totals.paidAmount + totals.partialAmount,
    totalRemaining: totals.remainingAmount,
    collectionRate: totals.collectionRate,
    paidInvoicesCount: totals.paidCount,
    partialInvoicesCount: totals.partialCount,
    unpaidInvoicesCount: totals.unpaidCount,
  };

  return { rows: finalRows, totals, kpis };
}

/**
 * Filter paid invoices by payment confirmation date (BR03)
 */
export function filterPaidInvoices(
  invoices: InvoiceRecord[],
  criteria: FeeReportFilterCriteria
): InvoiceRecord[] {
  const fromDate = parseDate(criteria.dateFrom);
  const toDate = parseDate(criteria.dateTo);

  return invoices.filter((inv) => {
    if (inv.status !== 'da_thanh_toan') return false;

    // Filter class
    if (criteria.classId && criteria.classId !== 'all' && inv.classId !== criteria.classId) {
      return false;
    }

    // Filter student search
    if (criteria.studentSearch) {
      const q = criteria.studentSearch.toLowerCase().trim();
      const matchName = inv.studentName.toLowerCase().includes(q);
      const matchCode = inv.studentCode.toLowerCase().includes(q);
      const matchInvoice = inv.invoiceNo.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchInvoice) return false;
    }

    // Filter payment method
    if (criteria.paymentMethod && criteria.paymentMethod !== 'all') {
      const hasMethod = inv.paymentHistory.some(
        (p) => p.paymentMethod === criteria.paymentMethod
      );
      if (!hasMethod) return false;
    }

    // BR03: Filter by confirmation date (paidAt in paymentHistory)
    if (fromDate || toDate) {
      const latestPayment = inv.paymentHistory[inv.paymentHistory.length - 1];
      if (!latestPayment) return false;
      const paymentDate = parseDate(latestPayment.paidAt);
      if (!paymentDate) return false;

      if (fromDate && paymentDate.getTime() < fromDate.getTime()) return false;
      if (toDate && paymentDate.getTime() > toDate.getTime() + 24 * 60 * 60 * 1000 - 1) return false;
    }

    return true;
  });
}

/**
 * Filter partial invoices (BR04, BR06)
 */
export function filterPartialInvoices(
  invoices: InvoiceRecord[],
  criteria: FeeReportFilterCriteria
): InvoiceRecord[] {
  return invoices.filter((inv) => {
    if (inv.status !== 'thanh_toan_mot_phan') return false;

    if (criteria.classId && criteria.classId !== 'all' && inv.classId !== criteria.classId) {
      return false;
    }

    if (criteria.studentSearch) {
      const q = criteria.studentSearch.toLowerCase().trim();
      const matchName = inv.studentName.toLowerCase().includes(q);
      const matchCode = inv.studentCode.toLowerCase().includes(q);
      const matchInvoice = inv.invoiceNo.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchInvoice) return false;
    }

    return true;
  });
}

/**
 * Filter unpaid invoices (BR05)
 */
export function filterUnpaidInvoices(
  invoices: InvoiceRecord[],
  criteria: FeeReportFilterCriteria,
  referenceDate: string = '2026-09-22'
): InvoiceRecord[] {
  return invoices.filter((inv) => {
    // Only unpaid / sent / created / overdue
    const isUnpaidStatus =
      inv.status === 'da_tao' || inv.status === 'da_gui' || inv.status === 'qua_han';
    if (!isUnpaidStatus) return false;

    // BR05: Unpaid status dropdown (only 'da_tao' or 'da_gui')
    if (criteria.unpaidStatus && criteria.unpaidStatus !== 'all') {
      if (inv.status !== criteria.unpaidStatus) return false;
    }

    // BR05: Checkbox "Hóa đơn quá hạn"
    if (criteria.isOverdueOnly) {
      if (!isInvoiceOverdue(inv, referenceDate)) return false;
    }

    if (criteria.classId && criteria.classId !== 'all' && inv.classId !== criteria.classId) {
      return false;
    }

    if (criteria.studentSearch) {
      const q = criteria.studentSearch.toLowerCase().trim();
      const matchName = inv.studentName.toLowerCase().includes(q);
      const matchCode = inv.studentCode.toLowerCase().includes(q);
      const matchInvoice = inv.invoiceNo.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchInvoice) return false;
    }

    return true;
  });
}
