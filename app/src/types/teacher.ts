export type TeacherPermissionTier = 'chinh' | 'ho_tro';

export type TeacherWorkingStatus = 'dang_lam_viec' | 'tam_nghi' | 'da_nghi_viec';

export type TeacherGender = 'nam' | 'nu' | 'khac';

export interface AssignedClassItem {
  classId: string;
  className: string;
}

export interface Teacher {
  id: string;
  schoolCode: string;
  staffCode?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  gender: TeacherGender;
  dob?: string;
  cccd?: string;
  homeroomClassId?: string;
  homeroomClassName?: string;
  assignedClasses: AssignedClassItem[];
  subjects: string[];
  permissionTier: TeacherPermissionTier;
  status: TeacherWorkingStatus;
  educationLevel?: string;
  major?: string;
  certificates?: string[];
  notes?: string;
  csdlSoCode?: string;
  joinedDate?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface TeacherFilterState {
  search: string;
  classId: string;
  permissionTier: string;
  status: string;
  csdlSoOnly: boolean;
}

export interface CreateTeacherPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  staffCode?: string;
  gender: TeacherGender;
  dob?: string;
  cccd?: string;
  homeroomClassId?: string;
  assignedClassIds: string[];
  subjects: string[];
  permissionTier: TeacherPermissionTier;
}

export interface ChangeEmailPayload {
  teacherId: string;
  newEmail: string;
}

export interface AssignClassPayload {
  teacherId: string;
  homeroomClassId?: string;
  homeroomClassName?: string;
  assignedClasses: AssignedClassItem[];
}
