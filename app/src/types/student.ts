export type StudentGender = 'nam' | 'nu';

export type StudentStatus = 'active' | 'chua_xep_lop' | 'thoi_hoc' | 'chuyen_truong' | 'tot_nghiep';

export type GuardianRelationship = 'bo' | 'me' | 'ong' | 'ba' | 'nguoi_giam_ho';

export type BmiClassification = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface Guardian {
  id: string;
  fullName: string;
  relationship: GuardianRelationship;
  phone: string;
  email?: string;
  occupation?: string;
  isEmergencyContact: boolean;
  isPrimaryPickup: boolean;
}

export interface GrowthRecord {
  id: string;
  measuredAt: string; // YYYY-MM-DD
  heightCm: number;
  weightKg: number;
  bmi: number;
  bmiClassification: BmiClassification;
  measuredBy: string;
  notes?: string;
}

export interface StudentFeeItem {
  id: string; // unique item id
  feeId: string; // references FeeItem id from Khoản phí / Class
  code?: string;
  name: string;
  amount: number;
  unit: string; // 'thang' | 'ngay' | 'nam' | 'lan' | etc.
  unitDisplay?: string; // 'Đ/tháng' | 'Đ/ngày' | 'Đ/năm'
  exportElectronicInvoice: boolean;
  category?: 'hoc_phi' | 'tien_an' | 'ngoai_khoa' | 'khac';
  isMandatory?: boolean; // true for Học phí & Tiền ăn cơ bản
  notes?: string;
}

export interface Student {
  id: string;
  schoolCode: string;
  studentCode?: string; // Optional to accommodate legacy nulls (K008)
  fullName: string;
  nickName?: string;
  avatar?: string;
  dob: string; // YYYY-MM-DD
  gender: StudentGender;
  cccd?: string;
  status: StudentStatus;
  classId: string;
  className: string;
  extracurricularClassIds?: string[];
  extracurricularClassNames?: string[];
  admissionDate: string; // YYYY-MM-DD
  address?: string;
  ethnicity?: string;
  religion?: string;
  notes?: string;
  tuitionDiscountPercent?: number; // 0 - 100
  tuitionFixedOverride?: number; // Fixed monthly VND
  guardians: Guardian[];
  growthRecords: GrowthRecord[];
  feeItems?: StudentFeeItem[];
  feeNotes?: string;
}

export interface ClassTransferPayload {
  studentIds: string[];
  sourceClassId: string;
  targetClassId: string;
  effectiveDate: string;
  remapFees: boolean;
  updateChat: boolean;
  pruneEvaluations: boolean;
}

export interface StudentFilterState {
  search: string;
  classId: string;
  status: string;
  gender: string;
  discountFilter?: 'all' | 'co_mien_giam' | 'khong_mien_giam';
}

