/**
 * Mock Data Seed for Academics Gradebook & Evaluation Sheets (Điểm & Đánh Giá)
 * Pre-populates curriculum-bound subjects, class gradebook records, and student marks.
 */

import type {
  ClassGradebookRecord,
  GradebookSubject,
  SubjectScoreRecord,
  TermSummaryRecord,
  DevelopmentalRubricRecord
} from '../types/gradebook.ts';
import { calculateTBHK } from '../utils/gradebookValidation.ts';

export const mockGradebookSubjects: GradebookSubject[] = [
  // Khối 1 & 2
  { id: 'sub-toan-1', name: 'Toán học', code: 'TOAN_1', gradeLevel: 'Khối 1' },
  { id: 'sub-tv-1', name: 'Tiếng Việt', code: 'TV_1', gradeLevel: 'Khối 1' },
  { id: 'sub-ta-1', name: 'Tiếng Anh', code: 'TA_1', gradeLevel: 'Khối 1' },
  { id: 'sub-tnxh-1', name: 'Tự nhiên và Xã hội', code: 'TNXH_1', gradeLevel: 'Khối 1' },
  { id: 'sub-dd-1', name: 'Đạo đức', code: 'DD_1', gradeLevel: 'Khối 1' },

  // Khối 6
  { id: 'sub-toan-6', name: 'Toán học', code: 'TOAN_6', gradeLevel: 'Khối 6' },
  { id: 'sub-van-6', name: 'Ngữ văn', code: 'VAN_6', gradeLevel: 'Khối 6' },
  { id: 'sub-ta-6', name: 'Tiếng Anh', code: 'TA_6', gradeLevel: 'Khối 6' },
  { id: 'sub-khtn-6', name: 'Khoa học tự nhiên', code: 'KHTN_6', gradeLevel: 'Khối 6' },
  { id: 'sub-lsdl-6', name: 'Lịch sử và Địa lý', code: 'LSDL_6', gradeLevel: 'Khối 6' },
  { id: 'sub-gdcd-6', name: 'Giáo dục công dân', code: 'GDCD_6', gradeLevel: 'Khối 6' },

  // Khối 12
  { id: 'sub-toan-12', name: 'Toán học', code: 'TOAN_12', gradeLevel: 'Khối 12' },
  { id: 'sub-van-12', name: 'Ngữ văn', code: 'VAN_12', gradeLevel: 'Khối 12' },
  { id: 'sub-ta-12', name: 'Tiếng Anh', code: 'TA_12', gradeLevel: 'Khối 12' },
  { id: 'sub-vatli-12', name: 'Vật lí', code: 'VATLI_12', gradeLevel: 'Khối 12' },
  { id: 'sub-hoa-12', name: 'Hóa học', code: 'HOA_12', gradeLevel: 'Khối 12' },

  // Mầm non
  { id: 'sub-mn-chu', name: 'Làm quen chữ cái', code: 'MN_CHU', gradeLevel: 'Mầm non' },
  { id: 'sub-mn-toan', name: 'Làm quen với toán', code: 'MN_TOAN', gradeLevel: 'Mầm non' },
  { id: 'sub-mn-khampha', name: 'Khám phá khoa học', code: 'MN_KHAMPHA', gradeLevel: 'Mầm non' },
  { id: 'sub-mn-taohinh', name: 'Hoạt động tạo hình', code: 'MN_TAOHINH', gradeLevel: 'Mầm non' },
  { id: 'sub-mn-thechat', name: 'Phát triển thể chất', code: 'MN_THECHAT', gradeLevel: 'Mầm non' }
];

export const mockClassGradebooks: ClassGradebookRecord[] = [
  {
    classId: 'c-12a1',
    className: '12A1',
    gradeLevel: 'Khối 12',
    homeroomTeacher: 'Thầy Trần Minh Đức',
    studentCount: 34,
    paradigm: 'numeric_gradebook',
    terms: [
      { termId: 't-12a1-hk1-mid', termName: 'Giữa học kỳ I', termKey: 'hk1_mid', status: 'tien_hanh', completedStudents: 22, totalStudents: 34 },
      { termId: 't-12a1-hk1-final', termName: 'Cuối học kỳ I', termKey: 'hk1_final', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 34 },
      { termId: 't-12a1-hk2-mid', termName: 'Giữa học kỳ II', termKey: 'hk2_mid', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 34 },
      { termId: 't-12a1-hk2-final', termName: 'Cuối học kỳ II', termKey: 'hk2_final', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 34 },
      { termId: 't-12a1-year', termName: 'Cả năm', termKey: 'full_year', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 34 }
    ]
  },
  {
    classId: 'c-6a1',
    className: '6A1',
    gradeLevel: 'Khối 6',
    homeroomTeacher: 'Cô Hoàng Lan Anh',
    studentCount: 32,
    paradigm: 'numeric_gradebook',
    terms: [
      { termId: 't-6a1-hk1-mid', termName: 'Giữa học kỳ I', termKey: 'hk1_mid', status: 'da_cong_bo', publishedAt: '16/04/2026', completedStudents: 32, totalStudents: 32 },
      { termId: 't-6a1-hk1-final', termName: 'Cuối học kỳ I', termKey: 'hk1_final', status: 'da_cong_bo', publishedAt: '18/06/2026', completedStudents: 32, totalStudents: 32 },
      { termId: 't-6a1-hk2-mid', termName: 'Giữa học kỳ II', termKey: 'hk2_mid', status: 'tien_hanh', completedStudents: 21, totalStudents: 32 },
      { termId: 't-6a1-hk2-final', termName: 'Cuối học kỳ II', termKey: 'hk2_final', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 32 },
      { termId: 't-6a1-year', termName: 'Cả năm', termKey: 'full_year', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 32 }
    ]
  },
  {
    classId: 'c-la',
    className: 'Lá',
    gradeLevel: 'Mầm non',
    homeroomTeacher: 'Cô Nguyễn Thu Hằng',
    studentCount: 28,
    paradigm: 'numeric_gradebook',
    terms: [
      { termId: 't-la-hk1-mid', termName: 'Giữa học kỳ I', termKey: 'hk1_mid', status: 'da_cong_bo', publishedAt: '12/11/2025', completedStudents: 28, totalStudents: 28 },
      { termId: 't-la-hk1-final', termName: 'Cuối học kỳ I', termKey: 'hk1_final', status: 'tien_hanh', completedStudents: 18, totalStudents: 28 },
      { termId: 't-la-hk2-mid', termName: 'Giữa học kỳ II', termKey: 'hk2_mid', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 28 },
      { termId: 't-la-hk2-final', termName: 'Cuối học kỳ II', termKey: 'hk2_final', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 28 },
      { termId: 't-la-year', termName: 'Cả năm', termKey: 'full_year', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 28 }
    ]
  },
  {
    classId: 'c-1a7',
    className: 'Lớp 1A7',
    gradeLevel: 'Khối 1',
    homeroomTeacher: 'Cô Phạm Thanh Thảo',
    studentCount: 30,
    paradigm: 'numeric_gradebook',
    terms: [
      { termId: 't-1a7-hk1-mid', termName: 'Giữa học kỳ I', termKey: 'hk1_mid', status: 'tien_hanh', completedStudents: 15, totalStudents: 30 },
      { termId: 't-1a7-hk1-final', termName: 'Cuối học kỳ I', termKey: 'hk1_final', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 30 },
      { termId: 't-1a7-hk2-mid', termName: 'Giữa học kỳ II', termKey: 'hk2_mid', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 30 },
      { termId: 't-1a7-hk2-final', termName: 'Cuối học kỳ II', termKey: 'hk2_final', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 30 },
      { termId: 't-1a7-year', termName: 'Cả năm', termKey: 'full_year', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 30 }
    ]
  },
  {
    classId: 'c-mam',
    className: 'Lớp Mầm',
    gradeLevel: 'Mầm non',
    homeroomTeacher: 'Cô Lê Thị Thu Cúc',
    studentCount: 24,
    paradigm: 'developmental_rubric',
    terms: [
      { termId: 't-mam-p1', termName: 'Giữa học kỳ I', termKey: 'p_term1', status: 'da_cong_bo', publishedAt: '10/11/2025', completedStudents: 24, totalStudents: 24 },
      { termId: 't-mam-p2', termName: 'Học kỳ I', termKey: 'p_term2', status: 'da_cong_bo', publishedAt: '15/01/2026', completedStudents: 24, totalStudents: 24 },
      { termId: 't-mam-p3', termName: 'Giữa học kỳ II', termKey: 'p_term3', status: 'tien_hanh', completedStudents: 18, totalStudents: 24 },
      { termId: 't-mam-p4', termName: 'Cuối năm', termKey: 'p_term4', status: 'chua_thuc_hien', completedStudents: 0, totalStudents: 24 }
    ]
  }
];

export const mockSubjectScores6A1: SubjectScoreRecord[] = [
  {
    studentId: 'hs-601',
    studentCode: 'HS-601',
    studentName: 'Nguyễn Văn An',
    txScores: [8.5, 9.0, 8.0, 9.5],
    gkScore: 8.5,
    ckScore: 9.0,
    tbhk: calculateTBHK([8.5, 9.0, 8.0, 9.5], 8.5, 9.0),
    note: 'Làm bài nhanh, tư duy toán tốt'
  },
  {
    studentId: 'hs-602',
    studentCode: 'HS-602',
    studentName: 'Trần Thị Bích',
    txScores: [7.0, 7.5, 8.0, 7.0],
    gkScore: 7.5,
    ckScore: 8.0,
    tbhk: calculateTBHK([7.0, 7.5, 8.0, 7.0], 7.5, 8.0),
    note: 'Cần chú ý trình bày các bước giải hình học'
  },
  {
    studentId: 'hs-603',
    studentCode: 'HS-603',
    studentName: 'Lê Hoàng Cường',
    txScores: [9.0, 9.5, 10.0, 9.0],
    gkScore: 9.5,
    ckScore: 10.0,
    tbhk: calculateTBHK([9.0, 9.5, 10.0, 9.0], 9.5, 10.0),
    note: 'Xuất sắc, giải quyết bài toán nâng cao nhanh'
  },
  {
    studentId: 'hs-604',
    studentCode: 'HS-604',
    studentName: 'Phạm Minh Đức',
    txScores: [6.5, 7.0, 6.0, null],
    gkScore: 6.5,
    ckScore: 7.0,
    tbhk: calculateTBHK([6.5, 7.0, 6.0], 6.5, 7.0),
    note: 'Cần ôn tập kỹ các phép tính phân số'
  },
  {
    studentId: 'hs-605',
    studentCode: 'HS-605',
    studentName: 'Vũ Hải Yến',
    txScores: [8.0, 8.5, 9.0, 8.5],
    gkScore: 8.0,
    ckScore: 8.5,
    tbhk: calculateTBHK([8.0, 8.5, 9.0, 8.5], 8.0, 8.5),
    note: 'Chăm chỉ, tích cực phát biểu xây dựng bài'
  }
];

export const mockTermSummary6A1: TermSummaryRecord[] = [
  {
    studentId: 'hs-601',
    studentCode: 'HS-601',
    studentName: 'Nguyễn Văn An',
    academicResult: 'hoan_thanh_tot',
    conductResult: 'tot',
    excusedAbsence: 1,
    unexcusedAbsence: 0,
    homeroomComment: 'Em có ý thức học tập tốt, năng nổ trong các phong trào của lớp.'
  },
  {
    studentId: 'hs-602',
    studentCode: 'HS-602',
    studentName: 'Trần Thị Bích',
    academicResult: 'hoan_thanh',
    conductResult: 'tot',
    excusedAbsence: 2,
    unexcusedAbsence: 0,
    homeroomComment: 'Chăm ngoan, hòa đồng với bạn bè, cần rèn luyện thêm kỹ năng tự tin.'
  },
  {
    studentId: 'hs-603',
    studentCode: 'HS-603',
    studentName: 'Lê Hoàng Cường',
    academicResult: 'hoan_thanh_tot',
    conductResult: 'tot',
    excusedAbsence: 0,
    unexcusedAbsence: 0,
    homeroomComment: 'Học sinh gương mẫu, đạt thành tích nổi bật môn Toán và Tin học.'
  },
  {
    studentId: 'hs-604',
    studentCode: 'HS-604',
    studentName: 'Phạm Minh Đức',
    academicResult: 'hoan_thanh',
    conductResult: 'kha',
    excusedAbsence: 3,
    unexcusedAbsence: 1,
    homeroomComment: 'Cần rèn luyện tính tập trung trong giờ học và đi học đúng giờ hơn.'
  },
  {
    studentId: 'hs-605',
    studentCode: 'HS-605',
    studentName: 'Vũ Hải Yến',
    academicResult: 'hoan_thanh_tot',
    conductResult: 'tot',
    excusedAbsence: 0,
    unexcusedAbsence: 0,
    homeroomComment: 'Cán sự lớp trách nhiệm, hoàn thành xuất sắc nhiệm vụ được giao.'
  }
];

export const mockDevelopmentalRubricsMam: DevelopmentalRubricRecord[] = [
  {
    studentId: 'hs-m01',
    studentCode: 'MN-001',
    studentName: 'Đặng Tuấn Kiệt',
    coreCompetencies: {
      'tu_chu_tu_hoc': 'tot',
      'giao_tiep_hop_tac': 'tot',
      'giai_quyet_van_de': 'dat'
    },
    specificCompetencies: {
      'ngon_ngu': 'tot',
      'toan_hoc': 'tot',
      'khoa_hoc': 'dat',
      'tham_my': 'dat',
      'the_chat': 'tot',
      'cong_nghe': 'dat',
      'tin_hoc': 'dat'
    },
    primaryQualities: {
      'yeu_nuoc': 'tot',
      'nhan_ai': 'tot',
      'cham_chi': 'tot',
      'trung_thuc': 'tot',
      'trach_nhiem': 'dat'
    },
    excusedAbsence: 1,
    unexcusedAbsence: 0,
    healthStatus: 'Bình thường, Chiều cao: 104cm, Cân nặng: 16.2kg',
    generalComment: 'Con nhanh nhẹn, hòa đồng, biết giúp đỡ cô giáo và các bạn.',
    isCompleted: true
  },
  {
    studentId: 'hs-m02',
    studentCode: 'MN-002',
    studentName: 'Ngô Ngọc Mai',
    coreCompetencies: {
      'tu_chu_tu_hoc': 'tot',
      'giao_tiep_hop_tac': 'tot',
      'giai_quyet_van_de': 'tot'
    },
    specificCompetencies: {
      'ngon_ngu': 'tot',
      'toan_hoc': 'dat',
      'khoa_hoc': 'tot',
      'tham_my': 'tot',
      'the_chat': 'dat'
      // 5/7 evaluated
    },
    primaryQualities: {
      'yeu_nuoc': 'tot',
      'nhan_ai': 'tot',
      'cham_chi': 'tot',
      'trung_thuc': 'tot',
      'trach_nhiem': 'tot'
    },
    excusedAbsence: 0,
    unexcusedAbsence: 0,
    healthStatus: 'Bình thường, Chiều cao: 102cm, Cân nặng: 15.8kg',
    generalComment: 'Con múa hát hay, có năng khiếu thẩm mỹ, ăn uống ngoan.',
    isCompleted: true
  },
  {
    studentId: 'hs-m03',
    studentCode: 'MN-003',
    studentName: 'Bùi Gia Huy',
    coreCompetencies: {
      'tu_chu_tu_hoc': 'dat',
      'giao_tiep_hop_tac': 'can_co_gang',
      'giai_quyet_van_de': 'dat'
    },
    specificCompetencies: {
      'ngon_ngu': 'dat',
      'toan_hoc': 'dat',
      'khoa_hoc': 'can_co_gang',
      'tham_my': 'dat',
      'the_chat': 'tot'
    },
    primaryQualities: {
      'yeu_nuoc': 'dat',
      'nhan_ai': 'dat',
      'cham_chi': 'can_co_gang',
      'trung_thuc': 'dat',
      'trach_nhiem': 'can_co_gang'
    },
    excusedAbsence: 4,
    unexcusedAbsence: 0,
    healthStatus: 'Cần theo dõi cân nặng (hơi gầy: 14.5kg)',
    generalComment: 'Con còn rụt rè trong giờ giao tiếp, cần cô và mẹ động viên nhiều hơn.',
    isCompleted: false
  }
];
