/**
 * TypeScript Data Contracts for Finance Tuition Management (Quản Lý Học Phí)
 * Module: E-011-finance-tuition-management
 */

export interface ClassFeeOverview {
  classId: string;
  className: string;
  gradeLevel: string; // e.g. "Khối 12", "Khối 10", "Khối 6"
  totalStudents: number;
  mandatoryFeesSummary: {
    hocPhi: number | null; // null if unset ("Chưa có học phí")
    tienAn: number | null; // null if unset ("Chưa có tiền ăn")
  };
  optionalFeesSummary: Array<{
    feeId: string;
    feeName: string;
    amount: number;
    unit: string;
  }>;
  exportElectronicInvoice: boolean; // Readonly badge (BR08)
}

export interface ClassAssignedFee {
  feeId: string;
  feeName: string;
  unit: string;
  defaultAmount: number;
  isMandatory: boolean; // true for Học phí & Tiền ăn (BR02, BR03)
  activeStudentCount: number; // (N Học sinh) for optional fees (BR03)
  exportElectronicInvoice: boolean; // Readonly (BR08)
}

export interface StudentFeeCell {
  feeId: string;
  isEnabled: boolean; // Always true for mandatory; toggleable for optional (BR03)
  amount: number | null; // null if unset
  hasOverride: boolean; // true if amount !== defaultAmount (BR04)
}

export interface StudentFeeMatrixRow {
  studentId: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: "Nam" | "Nu";
  feeCells: { [feeId: string]: StudentFeeCell };
}

export interface BatchUpdateFeeInput {
  classId: string;
  feeId: string;
  newAmount: number;
  applyToAll: boolean; // true: "Cả lớp", false: "Học sinh được chọn"
  selectedStudentIds: string[]; // required if applyToAll is false (BR05)
}

export interface AddClassFeeInput {
  classId: string;
  feeId: string;
  feeName: string;
  unit: string;
  defaultAmount: number;
  exportElectronicInvoice: boolean;
  applyToAll: boolean;
  selectedStudentIds: string[];
}

export interface TuitionManagementFilterCriteria {
  searchQuery: string;
  gradeLevelFilter: string; // "all" or specific grade level
}
