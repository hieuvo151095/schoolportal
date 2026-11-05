/**
 * Domain Data Contracts for School Academic Year (Năm Học)
 * Module: M5 - Nhà Trường / Năm Học
 * Standards: Decision 2045/QĐ-BGDĐT, Circular 32/2020/TT-BGDĐT, ECO Design System 1.0
 */

export interface AcademicYear {
  id: string;
  schoolCode: string;
  name: string; // Tên năm học / kỳ học, e.g. "Năm học 2026 - 2027", "Kỳ 1 năm học 2026 - 2027"
  startDate: string; // Ngày bắt đầu (ISO date string YYYY-MM-DD)
  endDate: string; // Ngày kết thúc (ISO date string YYYY-MM-DD)
  isCurrent?: boolean; // Tự động xác định: ngày hiện tại nằm trong khoảng [startDate, endDate] (BR01)
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYearFormData {
  name: string;
  startDate: string;
  endDate: string;
}

export interface AcademicYearFilterState {
  searchQuery: string;
}

export interface CreateAcademicYearPayload {
  schoolCode?: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateAcademicYearPayload {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface AcademicYearValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    startDate?: string;
    endDate?: string;
    general?: string;
  };
}
