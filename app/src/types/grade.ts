export type EducationStage = 'TH' | 'THCS' | 'THPT' | 'GDTX';

export interface GradeLevel {
  id: string;
  code: string;
  name: string;
  stage: EducationStage;
  orderIndex: number;
  academicYear: string;
  description?: string;
}

export interface GradeLevelRollup extends GradeLevel {
  classCount: number;
  studentCount: number;
  teacherCount: number;
  homeroomAssignedCount: number;
  homeroomRate: number;
}

export interface GradeClassHomeroom {
  id: string;
  fullName: string;
  phone: string;
  avatar?: string;
}

export interface GradeClassItem {
  id: string;
  code: string;
  name: string;
  gradeLevelId: string;
  academicYear: string;
  room?: string;
  homeroomTeacher?: GradeClassHomeroom;
  studentCount: number;
  maxCapacity: number;
  subjectTeacherCount: number;
  status: 'dang_hoc' | 'tam_dung';
}

export interface GradeSummaryKPI {
  totalGrades: number;
  totalClasses: number;
  totalStudents: number;
  averageStudentsPerClass: number;
}

export interface GradeFilterState {
  stage: 'ALL' | EducationStage;
  academicYear: string;
  searchQuery: string;
}
