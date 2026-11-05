/**
 * Data contracts for Finance - Tuition Invoices (Học Phí) module
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Reference: docs_legacy/operating-portal/tai-chinh/hoc-phi.md
 */

export type InvoiceLifecycleStatus =
  | 'da_tao'               // Draft / Created (Bản nháp / Đã tạo)
  | 'da_gui'               // Dispatched / Sent to parents (Đã gửi)
  | 'da_thanh_toan'        // Fully paid (Đã thanh toán)
  | 'thanh_toan_mot_phan'  // Partially paid (Thanh toán một phần)
  | 'qua_han'              // Overdue (Quá hạn)
  | 'da_huy';              // Cancelled (Đã hủy)

export type InvoiceLineItemCategory =
  | 'hoc_phi'              // Học phí chính khóa
  | 'tien_an'              // Tiền ăn (bán trú)
  | 'phi_tra_tre'          // Phí trả học sinh trễ (từ báo cáo điểm danh)
  | 'ngoai_khoa'           // Hoạt động ngoại khóa / CLB
  | 'co_so_vat_chat'       // Quỹ cơ sở vật chất
  | 'khac';                // Khoản thu khác

export type InvoiceCreationScope =
  | 'toan_truong'          // Toàn trường
  | 'khoi_lop'             // Khối lớp
  | 'lop_hoc'              // Lớp học
  | 'hoc_sinh';            // Học sinh cụ thể

export type PaymentMethod =
  | 'chuyen_khoan'         // Chuyển khoản ngân hàng (VietQR)
  | 'tien_mat'             // Tiền mặt tại văn phòng
  | 'qr_ecopay'            // QR ECOPay
  | 'vi_finviet'           // Ví Finviet
  | 'the_pos'              // Thẻ POS / Thẻ tín dụng
  | 'cong_sepay'           // Cổng thanh toán trực tuyến / Sepay
  | 'khac';                // Phương thức khác

export interface InvoiceLineItem {
  id: string;
  feeItemId?: string;
  category: InvoiceLineItemCategory;
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  discountType?: 'percent' | 'fixed_amount';
  discountPercent: number;
  discountAmount: number;
  amount: number;
  isRequired?: boolean;
  isMealFee?: boolean;
  excusedAbsenceDays?: number;
  baseSchoolDays?: number;
  isPaid?: boolean;
}

export interface PaymentHistoryEntry {
  id: string;
  paidAt: string;          // ISO string or formatted date
  amount: number;
  paymentMethod: PaymentMethod;
  confirmedBy: string;     // e.g. "Xác nhận tự động" or staff name
  note?: string;
  transactionRef?: string;
}

export interface VietQRDetails {
  bankName: string;
  bankCode: string;
  accountNo: string;
  accountHolder: string;
  transferContent: string; // e.g. "HOCPHI HD2609-001"
  qrImageUrl: string;
}

export interface InvoiceRecord {
  id: string;
  invoiceNo: string;       // e.g. "HD2609-001"
  title: string;           // e.g. "Hóa đơn tháng 09/2026"
  billingMonth: string;    // "2026-09"
  studentId: string;
  studentName: string;
  studentCode: string;
  classId: string;
  className: string;
  gradeLevel: string;
  parentName: string;
  parentPhone: string;
  status: InvoiceLifecycleStatus;
  issueDate: string;       // "01/09/2026"
  sendDate?: string;       // "05/09/2026"
  dueDate: string;         // "15/09/2026"
  exportElectronicInvoice: boolean;
  createdBy: string;
  createdAt: string;
  items: InvoiceLineItem[];
  subtotal: number;
  discountTotal: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentHistory: PaymentHistoryEntry[];
  vietQRData: VietQRDetails;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface StudentBillingRosterItem {
  studentId: string;
  studentName: string;
  studentCode: string;
  avatar: string;
  gender: 'Nam' | 'Nữ';
  classId: string;
  className: string;
  gradeLevel: string;
  parentName: string;
  parentPhone: string;
  invoice?: InvoiceRecord | null;
}

export interface InvoiceFilterCriteria {
  searchKeyword: string;
  classId: string;
  billingMonth: string;
  dateFilterType?: 'createdAt' | 'dueDate';
  createdDateFrom?: string; // YYYY-MM-DD
  createdDateTo?: string;   // YYYY-MM-DD
  status: InvoiceLifecycleStatus | 'tat_ca';
  gradeLevel: string;
  hasDeduction: boolean | null;
  hasElectronicInvoice: boolean | null;
  paymentMethod: PaymentMethod | 'tat_ca';
}

export interface CreateInvoiceFormData {
  scope: InvoiceCreationScope;
  gradeLevel?: string;
  classId?: string;
  classIds?: string[];
  studentId?: string;
  billingMonth: string;
  title: string;
  issueDate: string;
  sendDate?: string;
  dueDate: string;
  exportElectronicInvoice: boolean;
  autoApplyDiscount?: boolean;
  discountPolicies?: any[];
  autoApplyMealRefund?: boolean;
  mealRefundRates?: any;
  refundableFees?: any[];
  items: Array<{
    feeItemId?: string;
    category: InvoiceLineItemCategory;
    name: string;
    description?: string;
    unitPrice: number;
    quantity: number;
    discountType?: 'percent' | 'fixed_amount';
    discountPercent: number;
    discountAmount?: number;
    isRequired?: boolean;
    isMealFee?: boolean;
  }>;
}
