/**
 * Data contracts for Fee Catalog (Khoản Phí) sub-module
 * Operating Portal - Finviet / SOHA
 * Connected with Revenue Category (Danh mục thu)
 */

export type FeeItemType = 'system' | 'custom' | 'tuition' | 'meal';

export type FeeUnit =
  | 'ngay'
  | 'thang'
  | 'nam'
  | 'lan'
  | 'chuyen'
  | 'bo'
  | 'khac'
  | 'gio'
  | 'day'
  | 'month'
  | 'year'
  | 'time';

export interface FeeItemRevenueCategoryRef {
  id: number;
  code: string;
  name: string;
  unit?: string;
  usable?: boolean;
}

export interface FeeItem {
  id: string;
  code: string;
  name: string;
  type: FeeItemType;
  defaultAmount?: number;
  unit?: FeeUnit;
  exportElectronicInvoice: boolean;
  revenue_category_id?: number | null;
  revenue_category?: FeeItemRevenueCategoryRef | null;
  description?: string;
  classes?: Array<{ id: number | string; name: string; extended?: any }>;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFeeAssignment {
  id: string;
  feeId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  appliedAmount: number;
  assignedDate?: string;
  note?: string;
}

export interface FeeFilterCriteria {
  search: string;
  exportElectronicInvoiceFilter: 'all' | 'yes' | 'no';
  revenueCategoryFilter?: number | 'all';
  unitFilter?: 'all' | FeeUnit;
  sortUnit?: 'none' | 'asc' | 'desc';
}

export interface CreateFeeFormData {
  name: string;
  defaultAmount: number;
  unit?: FeeUnit;
  exportElectronicInvoice: boolean;
  revenue_category_id?: number | null;
  description?: string;
}

export interface EditFeeFormData {
  name: string;
  defaultAmount: number;
  unit?: FeeUnit;
  exportElectronicInvoice?: boolean;
  revenue_category_id?: number | null;
  description?: string;
}
