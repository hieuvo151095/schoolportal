export type VoucherLifecycleStatus = 'da_tao' | 'da_duyet' | 'da_chi' | 'da_huy';
export type VoucherType = 'khac' | 'hoan_tien';
export type BeneficiaryType = 'hoc_sinh' | 'nhan_vien';

export interface ExpenseLineItem {
  id: string;
  content: string;
  note?: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  total: number;
}

export interface ExpenseVoucher {
  id: string;
  voucherCode: string;
  title: string;
  voucherType: VoucherType;
  categoryId: string;
  categoryName: string;
  targetType: BeneficiaryType;
  targetId: string;
  targetName: string;
  targetSubInfo?: string; // e.g. "Lớp Mầm 1" or "Tổ Tự Nhiên"
  recipientName: string; // BR03: for student, can be guardian name; for staff, same as target
  recipientPhone?: string;
  createdDate: string; // YYYY-MM-DD
  status: VoucherLifecycleStatus;
  lineItems: ExpenseLineItem[];
  totalAmount: number;
  createdBy: string;
  approvedBy?: string;
  approvedDate?: string;
  disbursedBy?: string;
  disbursedDate?: string;
  cancelledBy?: string;
  cancelledDate?: string;
  cancelReason?: string;
  notes?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string;
  isSystemDefault: boolean; // BR08: 'Mặc định' is locked from deletion
  appliedCount: number;
}

export interface ExpenseFilterCriteria {
  selectedMonth: string; // YYYY-MM (BR07: mandatory)
  searchKeyword: string;
  voucherType: 'all' | VoucherType;
  status: 'all' | VoucherLifecycleStatus;
}

export interface CreateVoucherFormData {
  title: string;
  voucherType: VoucherType;
  categoryId: string;
  targetType: BeneficiaryType;
  targetId: string;
  targetName: string;
  targetSubInfo?: string;
  recipientName: string;
  recipientPhone?: string;
  createdDate: string;
  notes?: string;
  lineItems: Array<Omit<ExpenseLineItem, 'id' | 'total'> & { id?: string; total?: number }>;
}

export interface BeneficiaryOption {
  id: string;
  name: string;
  type: BeneficiaryType;
  subInfo: string;
  defaultRecipientName: string;
  phone?: string;
}
