/**
 * TypeScript Data Contracts for School Subject Management (Môn Học)
 * Feature ID: 037-school-subject-management-mon-hoc
 * Standard Reference: MoET Circular 32/2018/TT-BGDĐT, Circular 27/2020/TT-BGDĐT, Circular 22/2021/TT-BGDĐT
 */

export type EducationStage = 'TH' | 'THCS' | 'THPT' | 'GDTX';

export type SubjectClassification = 
  | 'mon_hoc'               // Standard academic subject (Môn học)
  | 'hoat_dong_giao_duc'    // Educational activity (Hoạt động giáo dục)
  | 'mon_tinh_diem'         // Graded subject (Môn tính điểm)
  | 'mon_nhan_xet';         // Evaluated by comments (Môn nhận xét)

export type SubjectType = 
  | 'bat_buoc'              // Mandatory (Bắt buộc)
  | 'tu_chon'               // Elective (Tự chọn)
  | 'lua_chon';             // Track-based choice (Lựa chọn - Grades 10-12)

export type EvaluationType = 
  | 'score'                 // Numerical score (Điểm số 0-10)
  | 'level'                 // Evaluation level (Hoàn thành tốt, Hoàn thành, Chưa hoàn thành)
  | 'comment'               // Qualitative feedback comments (Nhận xét)
  | 'score_comment';        // Combined numerical score with descriptive remarks

export interface TermEvaluationMatrix {
  term1_mid: EvaluationType;  // Giữa Kỳ 1
  term1_end: EvaluationType;  // Cuối Kỳ 1
  term2_mid: EvaluationType;  // Giữa Kỳ 2
  term2_end: EvaluationType;  // Cuối Kỳ 2
}

export interface SubjectTeacherAssignment {
  teacherId: string;
  teacherName: string;
  teacherCode: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  assignedClassesCount: number; // Number of classes this teacher teaches for this subject
  assignedClasses: string[];    // Array of class IDs, e.g. ['cls-10a1', 'cls-10a2']
  assignedAt: string;           // ISO date string
}

export interface SchoolSubject {
  id: string;
  code: string;                 // Subject code, e.g. 'TH-TOAN', 'THPT-TOAN', 'THCS-VAN'
  name: string;                 // Subject name in Vietnamese, e.g. 'Toán học', 'Ngữ văn'
  stage: EducationStage;        // 'TH' | 'THCS' | 'THPT' | 'GDTX'
  academicYear: string;         // e.g. '2025-2026', '2026-2027'
  classification: SubjectClassification;
  type: SubjectType;
  applicableGrades: string[];   // e.g. ['Khối 1', 'Khối 2', 'Khối 3'] or ['Khối 10', 'Khối 11', 'Khối 12']
  isCountedForGPA: boolean;     // Có tính điểm trung bình tổng kết hay không
  evaluationMatrix: TermEvaluationMatrix;
  description?: string;
  assignedTeachers: SubjectTeacherAssignment[];
  isStandardMoET: boolean;      // True for national curriculum subjects (read-only configuration)
  isCustom?: boolean;           // True for bespoke school-specific electives/workshops
  status: 'active' | 'inactive';
}

export interface SubjectFilterState {
  searchQuery: string;          // Name or code (accent-insensitive)
  stage: EducationStage;        // Active educational stage tab
  academicYear: string;         // Filter by academic year
  gradeLevel: string;           // 'all' or specific grade level
  classification: string;       // 'all' or specific classification
  type: string;                 // 'all' or specific subject type
}

export interface SubjectSummaryKPI {
  totalSubjects: number;
  gradedSubjectsCount: number;
  commentSubjectsCount: number;
  assignedTeachersCount: number;
}

export interface AssignTeacherPayload {
  subjectId: string;
  teacherId: string;
  teacherName: string;
  teacherCode: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
  assignedClasses?: string[];
}

export interface UnassignTeacherPayload {
  subjectId: string;
  teacherId: string;
}

export interface SubjectState {
  subjects: SchoolSubject[];
  activeStage: EducationStage;
  selectedAcademicYear: string;
  filter: SubjectFilterState;
  selectedSubjectId: string | null;
  isDetailDrawerOpen: boolean;
  isAssignTeacherModalOpen: boolean;
  isUnassignTeacherModalOpen: boolean;
  teacherToUnassign: {
    subjectId: string;
    subjectName: string;
    teacher: SubjectTeacherAssignment;
  } | null;
  loading: boolean;
  error: string | null;
}
