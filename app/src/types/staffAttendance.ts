/**
 * Domain Data Contracts for School Staff Attendance (Điểm Danh NV)
 * Module: M5 - Nhà Trường / Điểm Danh NV
 * Standards: Labor Code 45/2019/QH14, MoET Circulars 28/2020 & 32/2020, ECO Design System 1.0
 */

export type StaffRole = 'admin' | 'quan_ly' | 'giao_vien' | 'nhan_vien';

export type AbsenceType = 'co_phep' | 'khong_phep';

export interface AssignedClassInfo {
  classId: string;
  className: string;
  isHomeroom?: boolean;
}

export interface StaffProfile {
  id: string;
  schoolCode: string;
  name: string; // Full name (Họ và tên)
  nickname: string; // Display name (Tên gọi / Nickname)
  code?: string; // Employee code (Mã NV) e.g. "NV001" or empty
  avatar?: string;
  email?: string;
  phone?: string;
  dob?: string; // Date of birth YYYY-MM-DD
  address?: string;
  roles: StaffRole[]; // Multi-role support (BR08)
  assignedClasses: AssignedClassInfo[]; // Classes managed or taught (BR09, BR11)
  isVerified: boolean; // "Đã xác thực" status badge
  createdAt: string;
  updatedAt: string;
}

export interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  date: string; // ISO date YYYY-MM-DD
  checkInTime?: string; // Time format HH:mm e.g. "07:45"
  checkOutTime?: string; // Time format HH:mm e.g. "17:15"
  isAbsent: boolean; // Independent toggle for absence (BR05)
  absenceType?: AbsenceType; // "co_phep" or "khong_phep"
  absenceNote?: string; // Explanatory text in absence modal
  generalNote?: string; // Freeform inline note in attendance roster (BR07)
  recordedBy?: string; // Admin user ID who performed timekeeping
  updatedAt: string;
}

export interface StaffAttendanceRosterItem {
  staff: StaffProfile;
  attendance: StaffAttendanceRecord;
}

export interface StaffAttendanceKPI {
  attendingCount: number; // Tham dự (has checkInTime or marked present)
  excusedAbsenceCount: number; // Vắng có phép
  unexcusedAbsenceCount: number; // Vắng không phép
  totalCount: number; // Tổng số nhân viên theo bộ lọc
}

export interface StaffAttendanceFilterState {
  date: string; // Selected date YYYY-MM-DD (BR01, BR02)
  classId: string | 'all'; // Assigned class filter (BR09, K047)
  role: StaffRole | 'all'; // Staff role filter (BR08)
  searchQuery: string; // Instant client-side search (BR10)
  sortDirection: 'asc' | 'desc'; // Nickname sorting toggle A<->Z (BR12)
}

export interface RecordCheckInPayload {
  staffId: string;
  date: string;
  time?: string; // If omitted, defaults to current system time HH:mm
}

export interface RecordCheckOutPayload {
  staffId: string;
  date: string;
  time?: string; // If omitted, defaults to current system time HH:mm
}

export interface UpdateTimeBadgePayload {
  staffId: string;
  date: string;
  type: 'checkIn' | 'checkOut';
  time: string; // HH:mm
}

export interface RecordAbsencePayload {
  staffId: string;
  date: string;
  absenceType: AbsenceType;
  absenceNote?: string;
}

export interface CancelAbsencePayload {
  staffId: string;
  date: string;
}

export interface UpdateGeneralNotePayload {
  staffId: string;
  date: string;
  note: string;
}
