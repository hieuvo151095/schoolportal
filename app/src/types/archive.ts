/**
 * Archive Sub-module Data Contracts (Lưu Trữ)
 * Feature: 045-school-archive-luu-tru
 * Module: M5 - Nhà Trường
 */

export interface ArchiveStaffOperator {
  id: string;
  name: string;
  code?: string;
  role?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ArchivedStudent {
  id: string;
  studentCode: string;
  fullName: string;
  nickname?: string;
  avatarUrl?: string;
  dateOfBirth?: string; // YYYY-MM-DD or DD/MM/YYYY
  gender?: 'male' | 'female' | 'other';
  formerClassId?: string;
  formerClassName?: string;
  archiveDate?: string; // YYYY-MM-DD format or undefined
  archivedBy?: ArchiveStaffOperator; // Staff info or undefined
  archiveReason?: string; // e.g. 'Chuyển trường', 'Tốt nghiệp', 'Thôi học'
  archiveNote?: string; // Detailed archive notes
  parentName?: string;
  parentPhone?: string;
  address?: string;
  status: 'archived';
}

export type ArchiveSortField = 'fullName' | 'archiveDate';

export interface ArchiveFilterState {
  searchQuery: string;
  archivePeriodMonth?: string; // Format 'YYYY-MM'
}

export interface ArchiveSortState {
  field: ArchiveSortField;
  direction: 'asc' | 'desc';
}

export interface RestoreStudentPayload {
  studentId: string;
}

export interface RestoreStudentResult {
  success: boolean;
  studentId: string;
  restoredClassId: string | null;
  restoredClassName: string | null;
  isClassActive: boolean;
  warningMessage?: string;
}

export interface PurgeStudentPayload {
  studentId: string;
}

export interface PurgeStudentResult {
  success: boolean;
  purgedStudentId: string;
  purgedStudentName: string;
}

export type ArchiveModalType = 'none' | 'detail' | 'staff' | 'restore' | 'purge';

export interface ArchiveState {
  students: ArchivedStudent[];
  activeClasses: { id: string; name: string }[];
  filter: ArchiveFilterState;
  sort: ArchiveSortState;
  selectedStudent: ArchivedStudent | null;
  selectedStaff: ArchiveStaffOperator | null;
  activeModal: ArchiveModalType;
  isLoading: boolean;
  error: string | null;
  notification: {
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  } | null;
}
