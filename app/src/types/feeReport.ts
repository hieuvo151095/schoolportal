/**
 * Data contracts for Finance - Fee Collection Reports & Analytics (Báo Cáo Học Phí)
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/bao-cao-hoc-phi.md
 */

import type { InvoiceRecord, PaymentHistoryEntry, PaymentMethod } from './invoice.ts';

export type FeeReportTab = 'overview' | 'paid' | 'partial' | 'unpaid';

export interface ClassFeeOverviewRow {
  classId: string;
  className: string;
  isArchivedGroup?: boolean;
  totalInvoices: number;
  totalAmount: number;
  paidCount: number;
  paidAmount: number;
  partialCount: number;
  partialAmount: number;
  unpaidCount: number;
  unpaidAmount: number;
  remainingAmount: number;
  collectionRate: number; // 0 - 100 percentage
}

export interface FeeReportSummaryKPIs {
  totalInvoices: number;
  totalAmount: number;
  totalCollected: number;
  totalRemaining: number;
  collectionRate: number;
  paidInvoicesCount: number;
  partialInvoicesCount: number;
  unpaidInvoicesCount: number;
}

export interface FeeReportFilterCriteria {
  tab: FeeReportTab;
  dateFrom: string;           // "YYYY-MM-DD"
  dateTo: string;             // "YYYY-MM-DD"
  classId: string;            // 'all' or class ID
  studentSearch: string;
  paymentMethod: string;      // 'all' or PaymentMethod
  unpaidStatus: 'all' | 'da_tao' | 'da_gui'; // BR05: strictly da_tao and da_gui
  isOverdueOnly: boolean;     // BR05: separate overdue toggle
  includeArchived: boolean;
}

export interface FeeClassOption {
  id: string;
  name: string;
  gradeLevel: string;
}
