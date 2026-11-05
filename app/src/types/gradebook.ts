/**
 * TypeScript Data Contracts for Academics Gradebook & Evaluation Sheets (Điểm & Đánh Giá)
 * Module: Học Tập (Academics)
 * Reference: docs_legacy/operating-portal/hoc-tap/diem-danh-gia.md
 */

export type EvaluationParadigm = 'numeric_gradebook' | 'developmental_rubric';

export type TermEvaluationStatus = 'chua_thuc_hien' | 'tien_hanh' | 'da_cong_bo';

export type RubricRating = 'tot' | 'dat' | 'can_co_gang'; // Tốt (T), Đạt (Đ), Cần cố gắng (C)

export type AcademicResultLevel = 'hoan_thanh_tot' | 'hoan_thanh' | 'chua_hoan_thanh';

export type ConductResultLevel = 'tot' | 'kha' | 'dat' | 'can_co_gang';

export interface SubjectScoreRecord {
  studentId: string;
  studentCode: string;
  studentName: string;
  avatar?: string;
  txScores: (number | null)[]; // Up to 4 continuous regular evaluations (TX1 - TX4)
  gkScore: number | null;      // Midterm evaluation
  ckScore: number | null;      // Final term evaluation
  tbhk: number | null;         // Auto-calculated semester GPA
  note?: string;
}

export interface TermSummaryRecord {
  studentId: string;
  studentCode: string;
  studentName: string;
  avatar?: string;
  academicResult: AcademicResultLevel;
  conductResult: ConductResultLevel;
  excusedAbsence: number;
  unexcusedAbsence: number;
  homeroomComment: string;
}

export interface DevelopmentalRubricRecord {
  studentId: string;
  studentCode: string;
  studentName: string;
  avatar?: string;
  coreCompetencies: Record<string, RubricRating>;    // 3 items: Tự chủ & tự học, Giao tiếp & hợp tác, Giải quyết vấn đề & sáng tạo
  specificCompetencies: Record<string, RubricRating>; // 7 items: Ngôn ngữ, Toán học, Khoa học, Thẩm mỹ, Thể chất, Công nghệ, Tin học
  primaryQualities: Record<string, RubricRating>;     // 5 items: Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm
  excusedAbsence: number;
  unexcusedAbsence: number;
  healthStatus: string;
  generalComment: string;
  isCompleted: boolean;
}

export interface TermEvaluationCell {
  termId: string;
  termName: string;
  termKey: string; // 'hk1_mid' | 'hk1_final' | 'hk2_mid' | 'hk2_final' | 'full_year' or 'p_term1' | 'p_term2' | 'p_term3' | 'p_term4'
  status: TermEvaluationStatus;
  publishedAt?: string;
  completedStudents: number;
  totalStudents: number;
}

export interface ClassGradebookRecord {
  classId: string;
  className: string;
  gradeLevel: string; // 'Khối 1' | 'Khối 2' | 'Khối 6' | 'Khối 12' | 'Mầm non'
  homeroomTeacher: string;
  studentCount: number;
  paradigm: EvaluationParadigm;
  terms: TermEvaluationCell[];
}

export interface GradebookFilterCriteria {
  searchQuery: string;
  gradeLevel: string;
  homeroomTeacher: string;
  academicYear: string;
  status?: string;
}

export interface GradebookSubject {
  id: string;
  name: string;
  code: string;
  gradeLevel: string;
}
