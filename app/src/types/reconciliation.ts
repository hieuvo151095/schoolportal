export type PaymentChannel = 'finviet' | 'ecopay';

export interface LinkedInvoiceItem {
  id: string;
  invoiceCode: string;
  invoiceTitle: string;
  totalAmount: number;
  status: 'da_thanh_toan' | 'thanh_toan_mot_phan';
}

export interface ReconciliationTransaction {
  id: string;
  transactionCode: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  transactionTime: string; // YYYY-MM-DD HH:mm
  channel: PaymentChannel;
  channelLabel: string;
  linkedInvoices: LinkedInvoiceItem[];
}

export interface ReconciliationSession {
  id: string;
  sessionCode: string; // e.g. DS-20260910-01
  sessionDate: string; // e.g. 2026-09-10 01:00 (Sync date / BR01)
  transactionPeriod: string; // e.g. 09/09/2026 14:18 - 14:21 (BR01)
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalAmount: number;
  transactionCount: number;
  invoiceCount: number;
  transactions: ReconciliationTransaction[];
}

export interface ReconciliationFilterCriteria {
  startDate: string; // YYYY-MM-DD (BR05: free date-range)
  endDate: string; // YYYY-MM-DD (BR05: free date-range)
  searchKeyword?: string;
  channel?: 'all' | PaymentChannel;
}
