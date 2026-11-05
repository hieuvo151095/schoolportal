/**
 * Mock Subject Data for School Subject Management (Môn Học)
 * Standardized across 4 Educational Stages: Tiểu học (TH), THCS, THPT, GDTX
 * Aligned with MoET Circular 32/2018/TT-BGDĐT
 */

import type { SchoolSubject, EducationStage } from '../types/subject.ts';

export const INITIAL_SCHOOL_SUBJECTS: SchoolSubject[] = [
  // =========================================================================
  // 1. TIỂU HỌC (TH) — Grades 1 to 5
  // =========================================================================
  {
    id: 'sub-th-001',
    code: 'TH-TOAN',
    name: 'Toán học',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Chương trình Toán Tiểu học phát triển tư duy logic, hình học không gian cơ bản và giải toán có lời văn.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-001',
        teacherName: 'Nguyễn Thị Mai',
        teacherCode: 'GV-2024-001',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '0912345678',
        email: 'mai.nguyen@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-1a1', 'lop-1a2'],
        assignedAt: '2025-08-20T08:00:00Z'
      },
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-2a1', 'lop-2a2'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-002',
    code: 'TH-TV',
    name: 'Tiếng Việt',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Rèn luyện 4 kỹ năng Nghe - Nói - Đọc - Viết và bồi dưỡng tình yêu tiếng mẹ đẻ.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-001',
        teacherName: 'Nguyễn Thị Mai',
        teacherCode: 'GV-2024-001',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '0912345678',
        email: 'mai.nguyen@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-1a1', 'lop-1a2'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-003',
    code: 'TH-TA',
    name: 'Tiếng Anh',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Chương trình Tiếng Anh 10 năm theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-003',
        teacherName: 'Lê Hoàng Yến',
        teacherCode: 'GV-2025-003',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '0908123456',
        email: 'yen.le@finviet.edu.vn',
        assignedClassesCount: 3,
        assignedClasses: ['lop-3a1', 'lop-4a1', 'lop-5a1'],
        assignedAt: '2025-08-22T09:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-004',
    code: 'TH-DD',
    name: 'Đạo đức',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Giáo dục chuẩn mực hành vi đạo đức, pháp luật và kỹ năng sống cơ bản cho học sinh.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-001',
        teacherName: 'Nguyễn Thị Mai',
        teacherCode: 'GV-2024-001',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '0912345678',
        email: 'mai.nguyen@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-1a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-005',
    code: 'TH-TNXH',
    name: 'Tự nhiên và Xã hội',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Khám phá thế giới tự nhiên, môi trường xung quanh và các mối quan hệ xã hội gia đình, nhà trường.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-007',
        teacherName: 'Đặng Hoài An',
        teacherCode: 'GV-2024-007',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0915998877',
        email: 'an.dang@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-1a1', 'lop-2a1'],
        assignedAt: '2025-08-25T10:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-006',
    code: 'TH-KH',
    name: 'Khoa học',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 4', 'Khối 5'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Nghiên cứu cơ bản về chất, năng lượng, thực vật, động vật, con người và sức khỏe.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-4a1', 'lop-5a1'],
        assignedAt: '2025-08-22T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-007',
    code: 'TH-LSDL',
    name: 'Lịch sử và Địa lí',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 4', 'Khối 5'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Cung cấp hiểu biết về lịch sử hào hùng dựng nước và giữ nước cùng đặc điểm địa lí các vùng miền Việt Nam.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-th-008',
    code: 'TH-THCN',
    name: 'Tin học và Công nghệ',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Làm quen máy tính, lập trình Scratch trực quan, an toàn mạng và thiết kế thủ công kỹ thuật.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 3,
        assignedClasses: ['lop-3a1', 'lop-4a1', 'lop-5a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-009',
    code: 'TH-GDTC',
    name: 'Giáo dục thể chất',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Rèn luyện thể lực, đội hình đội ngũ, các bài tập thể dục buổi sáng và trò chơi vận động.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-005',
        teacherName: 'Hoàng Minh Đức',
        teacherCode: 'GV-2023-005',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '0977889900',
        email: 'duc.hoang@finviet.edu.vn',
        assignedClassesCount: 4,
        assignedClasses: ['lop-1a1', 'lop-1a2', 'lop-2a1', 'lop-3a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-010',
    code: 'TH-AN',
    name: 'Âm nhạc',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Hát, đọc nhạc, nghe nhạc và gõ đệm nhạc cụ tiết tấu.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-003',
        teacherName: 'Lê Hoàng Yến',
        teacherCode: 'GV-2025-003',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '0908123456',
        email: 'yen.le@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-1a1', 'lop-2a1'],
        assignedAt: '2025-08-22T09:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-011',
    code: 'TH-MT',
    name: 'Mĩ thuật',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Vẽ tranh, nặn hình, xé dán sáng tạo theo chủ đề thiên nhiên và gia đình.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-004',
        teacherName: 'Phạm Quỳnh Nga',
        teacherCode: 'GV-2025-004',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0934567890',
        email: 'nga.pham@finviet.edu.vn',
        assignedClassesCount: 3,
        assignedClasses: ['lop-1a1', 'lop-1a2', 'lop-2a1'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-th-012',
    code: 'TH-HDTN',
    name: 'Hoạt động trải nghiệm',
    stage: 'TH',
    academicYear: '2025-2026',
    classification: 'hoat_dong_giao_duc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Sinh hoạt dưới cờ, sinh hoạt lớp và hoạt động giáo dục theo chủ đề trải nghiệm thực tế.',
    evaluationMatrix: {
      term1_mid: 'comment',
      term1_end: 'comment',
      term2_mid: 'comment',
      term2_end: 'comment'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-004',
        teacherName: 'Phạm Quỳnh Nga',
        teacherCode: 'GV-2025-004',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0934567890',
        email: 'nga.pham@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-1a1', 'lop-1a2'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },

  // =========================================================================
  // 2. TRUNG HỌC CƠ SỞ (THCS) — Grades 6 to 9
  // =========================================================================
  {
    id: 'sub-thcs-001',
    code: 'THCS-VAN',
    name: 'Ngữ văn',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Đọc hiểu văn bản văn học, nghị luận, thông tin và rèn luyện kỹ năng viết bài văn hoàn chỉnh.',
    evaluationMatrix: {
      term1_mid: 'score_comment',
      term1_end: 'score_comment',
      term2_mid: 'score_comment',
      term2_end: 'score_comment'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-001',
        teacherName: 'Nguyễn Thị Mai',
        teacherCode: 'GV-2024-001',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '0912345678',
        email: 'mai.nguyen@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-6a1', 'lop-6a2'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-002',
    code: 'THCS-TOAN',
    name: 'Toán học',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Đại số, Hình học phẳng và Xác suất - Thống kê thực hành.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 3,
        assignedClasses: ['lop-6a1', 'lop-7a1', 'lop-8a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-003',
    code: 'THCS-TA',
    name: 'Ngoại ngữ 1 (Tiếng Anh)',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Phát triển năng lực giao tiếp tiếng Anh tương đương bậc 2 của Khung năng lực ngoại ngữ Việt Nam.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-003',
        teacherName: 'Lê Hoàng Yến',
        teacherCode: 'GV-2025-003',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '0908123456',
        email: 'yen.le@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-6a1', 'lop-7a1'],
        assignedAt: '2025-08-22T09:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-004',
    code: 'THCS-GDCD',
    name: 'Giáo dục công dân',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Giáo dục pháp luật, đạo đức công dân và trách nhiệm đối với cộng đồng.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thcs-005',
    code: 'THCS-LSDL',
    name: 'Lịch sử và Địa lí',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Tích hợp phân môn Lịch sử thế giới, Lịch sử Việt Nam và Địa lí các châu lục.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thcs-006',
    code: 'THCS-KHTN',
    name: 'Khoa học tự nhiên',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Tích hợp các nguyên lí Vật lí, Hóa học và Sinh học trong nghiên cứu thế giới tự nhiên.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-6a1', 'lop-6a2'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-007',
    code: 'THCS-CN',
    name: 'Công nghệ',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Công nghệ trong gia đình, trồng trọt, chăn nuôi và thiết kế kỹ thuật cơ bản.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thcs-008',
    code: 'THCS-TH',
    name: 'Tin học',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Tư duy máy tính, biểu diễn dữ liệu, thuật toán và giải quyết vấn đề với sự trợ giúp của máy tính.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-6a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-009',
    code: 'THCS-GDTC',
    name: 'Giáo dục thể chất',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Chạy cự li ngắn, nhảy cao, bóng rổ, bóng đá và rèn luyện thể lực theo chuẩn kiểm tra.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-005',
        teacherName: 'Hoàng Minh Đức',
        teacherCode: 'GV-2023-005',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '0977889900',
        email: 'duc.hoang@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-6a1', 'lop-7a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-010',
    code: 'THCS-NT',
    name: 'Nghệ thuật (Âm nhạc, Mĩ thuật)',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Tích hợp 2 mạch nội dung Âm nhạc và Mĩ thuật, đánh giá mức độ đạt yêu cầu thẩm mĩ.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-003',
        teacherName: 'Lê Hoàng Yến',
        teacherCode: 'GV-2025-003',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '0908123456',
        email: 'yen.le@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-6a1', 'lop-7a1'],
        assignedAt: '2025-08-22T09:00:00Z'
      },
      {
        teacherId: 'gv-004',
        teacherName: 'Phạm Quỳnh Nga',
        teacherCode: 'GV-2025-004',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0934567890',
        email: 'nga.pham@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-6a1', 'lop-7a1'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-011',
    code: 'THCS-HDTN',
    name: 'Hoạt động trải nghiệm, hướng nghiệp',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'hoat_dong_giao_duc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Khám phá bản thân, rèn luyện phẩm chất và bước đầu định hướng nghề nghiệp.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-004',
        teacherName: 'Phạm Quỳnh Nga',
        teacherCode: 'GV-2025-004',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0934567890',
        email: 'nga.pham@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-6a1'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thcs-012',
    code: 'THCS-GDDP',
    name: 'Nội dung giáo dục địa phương',
    stage: 'THCS',
    academicYear: '2025-2026',
    classification: 'hoat_dong_giao_duc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Tìm hiểu về văn hóa truyền thống, lịch sử, địa lí và kinh tế - xã hội địa phương.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: []
  },

  // =========================================================================
  // 3. TRUNG HỌC PHỔ THÔNG (THPT) — Grades 10 to 12
  // =========================================================================
  {
    id: 'sub-thpt-001',
    code: 'THPT-VAN',
    name: 'Ngữ văn',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Văn học trung đại và hiện đại Việt Nam, lí luận văn học và nghị luận xã hội nâng cao.',
    evaluationMatrix: {
      term1_mid: 'score_comment',
      term1_end: 'score_comment',
      term2_mid: 'score_comment',
      term2_end: 'score_comment'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-001',
        teacherName: 'Nguyễn Thị Mai',
        teacherCode: 'GV-2024-001',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '0912345678',
        email: 'mai.nguyen@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-10a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thpt-002',
    code: 'THPT-TOAN',
    name: 'Toán học',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Giải tích, Hình học giải tích Oxyz, Vectơ và Thống kê ứng dụng theo định hướng hướng nghiệp.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-10a1', 'lop-11a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thpt-003',
    code: 'THPT-TA',
    name: 'Ngoại ngữ 1 (Tiếng Anh)',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Nâng cao kỹ năng thuyết trình, học thuật và giao tiếp theo chuẩn Bậc 3 Khung ngoại ngữ Việt Nam.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-003',
        teacherName: 'Lê Hoàng Yến',
        teacherCode: 'GV-2025-003',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        phone: '0908123456',
        email: 'yen.le@finviet.edu.vn',
        assignedClassesCount: 2,
        assignedClasses: ['lop-10a1', 'lop-12a1'],
        assignedAt: '2025-08-22T09:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thpt-004',
    code: 'THPT-LS',
    name: 'Lịch sử',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn học bắt buộc theo Thông tư 13/2022/TT-BGDĐT sửa đổi CT GDPT 2018.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thpt-005',
    code: 'THPT-GDTC',
    name: 'Giáo dục thể chất',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Tập luyện thể thao chuyên sâu tự chọn: Cầu lông, Bóng đá, Bóng rổ, Bóng chuyền.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-005',
        teacherName: 'Hoàng Minh Đức',
        teacherCode: 'GV-2023-005',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        phone: '0977889900',
        email: 'duc.hoang@finviet.edu.vn',
        assignedClassesCount: 3,
        assignedClasses: ['lop-10a1', 'lop-11a1', 'lop-12a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thpt-006',
    code: 'THPT-GDQP',
    name: 'Giáo dục quốc phòng và an ninh',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Xây dựng lòng yêu nước, ý thức bảo vệ Tổ quốc, kiến thức quốc phòng và điều lệnh cơ bản.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thpt-007',
    code: 'THPT-HDTN',
    name: 'Hoạt động trải nghiệm, hướng nghiệp',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'hoat_dong_giao_duc',
    type: 'bat_buoc',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Xây dựng kế hoạch phát triển cá nhân, định hướng nghề nghiệp và tham gia dự án cộng đồng.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-004',
        teacherName: 'Phạm Quỳnh Nga',
        teacherCode: 'GV-2025-004',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0934567890',
        email: 'nga.pham@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-10a1'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-thpt-008',
    code: 'THPT-VL',
    name: 'Vật lí',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn lựa chọn nhóm Khoa học tự nhiên: Cơ học, Nhiệt học, Điện từ học và Vật lí hạt nhân.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thpt-009',
    code: 'THPT-HH',
    name: 'Hóa học',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn lựa chọn nhóm Khoa học tự nhiên: Cấu tạo nguyên tử, Phản ứng oxi hóa khử và Hóa hữu cơ.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thpt-010',
    code: 'THPT-SH',
    name: 'Sinh học',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn lựa chọn nhóm Khoa học tự nhiên: Sinh học phân tử, Di truyền học và Tiến hóa sinh thái.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thpt-011',
    code: 'THPT-DL',
    name: 'Địa lí',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn lựa chọn nhóm Khoa học xã hội: Địa lí tự nhiên đại cương và Địa lí kinh tế - xã hội thế giới.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thpt-012',
    code: 'THPT-GDKTPL',
    name: 'Giáo dục kinh tế và pháp luật',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn lựa chọn nhóm Khoa học xã hội: Nền kinh tế thị trường, tài chính cá nhân và hệ thống pháp luật.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-thpt-013',
    code: 'THPT-TH',
    name: 'Tin học',
    stage: 'THPT',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Khối 10', 'Khối 11', 'Khối 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn lựa chọn nhóm Công nghệ và Nghệ thuật: Lập trình Python, Khoa học máy tính hoặc Tin học ứng dụng.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-10a1'],
        assignedAt: '2025-08-20T08:00:00Z'
      }
    ]
  },

  // =========================================================================
  // 4. GIÁO DỤC THƯỜNG XUYÊN (GDTX)
  // =========================================================================
  {
    id: 'sub-gdtx-001',
    code: 'GDTX-VAN',
    name: 'Ngữ văn',
    stage: 'GDTX',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Chương trình Giáo dục thường xuyên cấp THPT môn Ngữ văn theo chuẩn giảm tải phù hợp vừa học vừa làm.',
    evaluationMatrix: {
      term1_mid: 'score_comment',
      term1_end: 'score_comment',
      term2_mid: 'score_comment',
      term2_end: 'score_comment'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-001',
        teacherName: 'Nguyễn Thị Mai',
        teacherCode: 'GV-2024-001',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        phone: '0912345678',
        email: 'mai.nguyen@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-gdtx-10'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-gdtx-002',
    code: 'GDTX-TOAN',
    name: 'Toán học',
    stage: 'GDTX',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Chương trình Toán học hệ GDTX tập trung vào ứng dụng tính toán thực tế và chuẩn tốt nghiệp THPT.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-gdtx-10'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-gdtx-003',
    code: 'GDTX-LS',
    name: 'Lịch sử',
    stage: 'GDTX',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'bat_buoc',
    applicableGrades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Môn bắt buộc trong chương trình GDTX cấp THPT theo Thông tư ban hành của Bộ GD&ĐT.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-gdtx-004',
    code: 'GDTX-DL',
    name: 'Địa lí',
    stage: 'GDTX',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Địa lí kinh tế - xã hội Việt Nam và địa lí các ngành sản xuất trong nước.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: []
  },
  {
    id: 'sub-gdtx-005',
    code: 'GDTX-TH',
    name: 'Tin học',
    stage: 'GDTX',
    academicYear: '2025-2026',
    classification: 'mon_hoc',
    type: 'lua_chon',
    applicableGrades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    isCountedForGPA: true,
    isStandardMoET: true,
    status: 'active',
    description: 'Tin học văn phòng cơ bản: Word, Excel, PowerPoint và khai thác Internet phục vụ công việc.',
    evaluationMatrix: {
      term1_mid: 'score',
      term1_end: 'score',
      term2_mid: 'score',
      term2_end: 'score'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-002',
        teacherName: 'Trần Văn Dũng',
        teacherCode: 'GV-2024-002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '0987654321',
        email: 'dung.tran@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-gdtx-10'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  },
  {
    id: 'sub-gdtx-006',
    code: 'GDTX-HDTN',
    name: 'Hoạt động trải nghiệm, hướng nghiệp',
    stage: 'GDTX',
    academicYear: '2025-2026',
    classification: 'hoat_dong_giao_duc',
    type: 'bat_buoc',
    applicableGrades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    isCountedForGPA: false,
    isStandardMoET: true,
    status: 'active',
    description: 'Hoạt động gắn với định hướng nghề nghiệp, kỹ năng lao động và an toàn vệ sinh lao động.',
    evaluationMatrix: {
      term1_mid: 'level',
      term1_end: 'level',
      term2_mid: 'level',
      term2_end: 'level'
    },
    assignedTeachers: [
      {
        teacherId: 'gv-004',
        teacherName: 'Phạm Quỳnh Nga',
        teacherCode: 'GV-2025-004',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0934567890',
        email: 'nga.pham@finviet.edu.vn',
        assignedClassesCount: 1,
        assignedClasses: ['lop-gdtx-10'],
        assignedAt: '2025-08-25T08:00:00Z'
      }
    ]
  }
];

export const ACADEMIC_YEARS = [
  '2025-2026',
  '2024-2025',
  '2023-2024'
];

export const STAGE_CONFIGS: Array<{
  id: EducationStage;
  name: string;
  shortName: string;
  grades: string[];
}> = [
  {
    id: 'TH',
    name: 'Tiểu học',
    shortName: 'TH',
    grades: ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5']
  },
  {
    id: 'THCS',
    name: 'Trung học cơ sở',
    shortName: 'THCS',
    grades: ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9']
  },
  {
    id: 'THPT',
    name: 'Trung học phổ thông',
    shortName: 'THPT',
    grades: ['Khối 10', 'Khối 11', 'Khối 12']
  },
  {
    id: 'GDTX',
    name: 'Giáo dục thường xuyên',
    shortName: 'GDTX',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12']
  }
];
