export type ClassTaxonomy = 'chinh_khoa' | 'ngoai_khoa';
export type ClassStatus = 'dang_hoat_dong' | 'tam_dung' | 'da_ket_thuc';

export interface GradeLevel {
  id: string;
  code: string;
  name: string;
  orderNumber: number;
}

export interface ClassInstructorAssignment {
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  teacherPhone?: string;
  role: 'giao_vien_chinh' | 'tro_giang' | 'huan_luyen_vien';
  isPrimary?: boolean;
}

export interface ClassItem {
  id: string;
  schoolCode: string;
  name: string;
  code: string;
  taxonomy: ClassTaxonomy;
  gradeLevelId?: string;
  gradeName?: string;
  academicYear: string;
  roomNumber?: string;
  maxCapacity: number;
  studentCount: number;
  homeroomTeacherId?: string;
  homeroomTeacherName?: string;
  homeroomTeacherPhone?: string;
  homeroomTeacherAvatar?: string;
  instructors?: ClassInstructorAssignment[];
  clubCategory?: string;
  meetingSchedule?: string;
  status: ClassStatus;
  csdlStatus?: 'da_lien_ket' | 'chua_lien_ket';
  tuitionFeeScheduleId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFormData {
  name: string;
  code: string;
  taxonomy: ClassTaxonomy;
  gradeLevelId?: string;
  academicYear: string;
  roomNumber?: string;
  maxCapacity: number;
  homeroomTeacherId?: string;
  instructors?: ClassInstructorAssignment[];
  clubCategory?: string;
  meetingSchedule?: string;
  status: ClassStatus;
  notes?: string;
}

export interface ClassFilterState {
  searchQuery: string;
  taxonomy?: ClassTaxonomy;
  gradeLevelId?: string;
  academicYear: string;
  status?: ClassStatus;
  teacherRole?: 'co_gvcn' | 'chua_co_gvcn' | 'tat_ca';
  teacherId?: string;
  csdlStatus?: 'da_lien_ket' | 'chua_lien_ket';
  capacityMin?: number;
  capacityMax?: number;
}

export interface StudentClassEnrollment {
  studentId: string;
  studentCode: string;
  fullName: string;
  avatar?: string;
  gender: 'nam' | 'nu';
  dob: string;
  guardianName: string;
  guardianPhone: string;
  status: 'active' | 'leave' | 'transferred';
  enrollmentDate: string;
}
