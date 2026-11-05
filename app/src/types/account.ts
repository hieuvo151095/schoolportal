/**
 * Account Management Contracts & Domain Types
 * Feature: 047-settings-account-management-tai-khoan
 * Standards: BR01-BR21, K076-K082, TK-01 to TK-07
 */

export type UserRole = 'admin' | 'quan_ly' | 'giao_vien' | 'nhan_vien' | 'phu_huynh';

export type StaffFunction = 'diem_danh' | 'ke_toan' | 'thong_bao' | 'cham_soc_y_te';

export type AccountStatus = 'active' | 'inactive';

export type StudentAccountStatusFilter = 'all' | 'has_account' | 'no_account';

export interface LinkedStudent {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
}

export interface StaffAdditionalInfo {
  cccd?: string;
  position?: string;
  startDate?: string;
  qualification?: string;
  otherSkills?: string;
  department?: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  roles: UserRole[];
  status: AccountStatus;
  isSyncedCsdlSo: boolean;
  staffFunctions?: StaffFunction[];
  staffCode?: string;
  managedClassIds?: string[];
  additionalInfo?: StaffAdditionalInfo;
  linkedStudents?: LinkedStudent[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentAccountItem {
  studentId: string;
  studentCode: string;
  studentName: string;
  birthDate: string;
  gender: 'nam' | 'nu';
  classId: string;
  className: string;
  hasAccount: boolean;
  username?: string;
  status: AccountStatus;
  isSyncedCsdlSo: boolean;
  lastLogin?: string;
}

export interface UserAccountFilterState {
  searchQuery: string;
  roleFilter: 'all' | UserRole;
  statusFilter: 'all' | AccountStatus;
  csdlSoFilter: 'all' | 'yes' | 'no';
}

export interface StudentAccountFilterState {
  searchQuery: string;
  classFilter: string;
  accountStatusFilter: StudentAccountStatusFilter;
}

export interface CreateUserAccountPayload {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  roles: UserRole[];
  staffFunctions?: StaffFunction[];
  staffCode?: string;
  managedClassIds?: string[];
  additionalInfo?: StaffAdditionalInfo;
}

export interface UpdateUserAccountPayload {
  id: string;
  fullName: string;
  phone?: string;
  status: AccountStatus;
  roles: UserRole[];
  staffFunctions?: StaffFunction[];
  staffCode?: string;
  managedClassIds?: string[];
  additionalInfo?: StaffAdditionalInfo;
}

export interface ChangeEmailPayload {
  userId: string;
  newEmail: string;
}

export interface ChangePasswordPayload {
  userId: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateStudentAccountPayload {
  studentId: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateStudentAccountPayload {
  studentId: string;
  username: string;
  password?: string;
  confirmPassword?: string;
}
