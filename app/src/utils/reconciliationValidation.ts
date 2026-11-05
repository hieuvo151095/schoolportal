import type {
  PaymentChannel,
  ReconciliationSession,
  ReconciliationTransaction,
} from '../types/reconciliation.ts';

/**
 * Format currency with Vietnamese dot thousands separator and optional Đ unit suffix.
 * BR08: Formatted currency standard across finance modules.
 */
export function formatReconciliationAmount(amount: number, withSuffix: boolean = true): string {
  const safeAmount = Math.max(0, Math.round(amount || 0));
  const formatted = safeAmount.toLocaleString('vi-VN');
  return withSuffix ? `${formatted} Đ` : formatted;
}

/**
 * Validate free date-range interval and disallow dates in the future.
 * BR05: Free date-range picker; dates after maxDate (today) are invalid/disabled.
 */
export function isDateRangeValid(startDate: string, endDate: string, maxDate?: string): boolean {
  if (!startDate || !endDate) return false;
  if (startDate > endDate) return false;
  if (maxDate) {
    if (startDate > maxDate || endDate > maxDate) {
      return false;
    }
  }
  return true;
}

/**
 * Filter reconciliation sessions by sync date ("Ngày tạo phiên").
 * BR01: Sessions are grouped and queried by "Ngày tạo phiên" (sessionDate).
 */
export function filterSessions(
  sessions: ReconciliationSession[],
  startDate: string,
  endDate: string
): ReconciliationSession[] {
  if (!startDate || !endDate) return sessions;

  return sessions.filter((session) => {
    // Extract YYYY-MM-DD from session.sessionDate (e.g. "2026-09-10 01:00")
    const sessionDateOnly = session.sessionDate.slice(0, 10);
    return sessionDateOnly >= startDate && sessionDateOnly <= endDate;
  });
}

/**
 * Filter transactions inside a reconciliation session by keyword and payment channel.
 * BR03: Channel filtering (Ví FinViet vs QR Ecopay).
 * BR06: Multi-factor search by student code, student name, or transaction code.
 */
export function filterTransactions(
  transactions: ReconciliationTransaction[],
  searchKeyword: string,
  channel: 'all' | PaymentChannel
): ReconciliationTransaction[] {
  const query = (searchKeyword || '').trim().toLowerCase();

  return transactions.filter((tx) => {
    // Filter by channel
    if (channel !== 'all' && tx.channel !== channel) {
      return false;
    }

    // Filter by search query
    if (query) {
      const matchName = tx.studentName.toLowerCase().includes(query);
      const matchId = tx.studentId.toLowerCase().includes(query);
      const matchTxCode = tx.transactionCode.toLowerCase().includes(query);
      const matchClass = tx.className.toLowerCase().includes(query);
      return matchName || matchId || matchTxCode || matchClass;
    }

    return true;
  });
}

/**
 * Compute aggregate metrics across reconciliation sessions.
 */
export function calculateSessionAggregates(sessions: ReconciliationSession[]): {
  totalAmount: number;
  totalTransactions: number;
  totalSessions: number;
} {
  return sessions.reduce(
    (acc, session) => ({
      totalAmount: acc.totalAmount + (session.totalAmount || 0),
      totalTransactions: acc.totalTransactions + (session.transactionCount || 0),
      totalSessions: acc.totalSessions + 1,
    }),
    { totalAmount: 0, totalTransactions: 0, totalSessions: 0 }
  );
}

/**
 * Compute aggregate metrics across transactions inside a session.
 */
export function calculateTransactionAggregates(transactions: ReconciliationTransaction[]): {
  totalAmount: number;
  totalTransactions: number;
  uniqueInvoiceCount: number;
} {
  const uniqueInvoices = new Set<string>();

  const totalAmount = transactions.reduce((sum, tx) => {
    tx.linkedInvoices.forEach((inv) => uniqueInvoices.add(inv.invoiceCode));
    return sum + (tx.amount || 0);
  }, 0);

  return {
    totalAmount,
    totalTransactions: transactions.length,
    uniqueInvoiceCount: uniqueInvoices.size,
  };
}
