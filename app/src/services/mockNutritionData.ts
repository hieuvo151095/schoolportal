import type { StudentCareRecord } from '../types/nutrition.ts';
import type { StudentAttendance } from '../types/attendance.ts';
import { createEmptyCareRecord } from '../utils/nutritionValidation.ts';
import { getAttendanceForDateAndClass } from './mockAttendanceData.ts';

export interface ClassCareInfo {
  id: string;
  name: string;
  gradeLevel: string;
  homeroomTeacher: string;
}

export const NUTRITION_CLASSES_LIST: ClassCareInfo[] = [
  { id: 'lop-1a1', name: 'Lớp 1A1 (Khối 1)', gradeLevel: 'Khối 1', homeroomTeacher: 'Cô Nguyễn Thu Mai' },
  { id: 'lop-1a2', name: 'Lớp 1A2 (Khối 1)', gradeLevel: 'Khối 1', homeroomTeacher: 'Cô Lê Thanh Thảo' },
  { id: 'lop-2a1', name: 'Lớp 2A1 (Khối 2)', gradeLevel: 'Khối 2', homeroomTeacher: 'Thầy Trần Quốc Tuấn' },
  { id: 'lop-la-1', name: 'Lớp Lá 1 (Mầm non)', gradeLevel: 'Mầm non', homeroomTeacher: 'Cô Nguyễn Thu Hà' },
  { id: '4', name: 'Lớp Lá (Mầm non)', gradeLevel: 'Mầm non', homeroomTeacher: 'Cô Phạm Thúy Nga' },
  { id: '3', name: 'Lớp Chồi (Mầm non)', gradeLevel: 'Mầm non', homeroomTeacher: 'Cô Trần Thị Thu Hường' },
];

export const RAW_MOCK_STUDENTS: Array<{
  studentId: string;
  studentCode: string;
  fullName: string;
  nickname?: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  parentName: string;
  parentPhone: string;
  classId: string;
}> = [
  {
    studentId: 'st-001',
    studentCode: 'HS2026-001',
    fullName: 'Nguyễn Minh Khang',
    nickname: 'Bé Khang',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&h=120&fit=crop&crop=face',
    gender: 'male',
    parentName: 'Nguyễn Văn Hùng',
    parentPhone: '0912345678',
    classId: 'lop-1a1',
  },
  {
    studentId: 'st-002',
    studentCode: 'HS2026-002',
    fullName: 'Trần Bảo Ngọc',
    nickname: 'Bảo Bảo',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
    gender: 'female',
    parentName: 'Trần Đình Trọng',
    parentPhone: '0912345680',
    classId: 'lop-1a1',
  },
  {
    studentId: 'st-003',
    studentCode: 'HS2026-003',
    fullName: 'Lê Hoàng Nam',
    nickname: 'Nam Nam',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=face',
    gender: 'male',
    parentName: 'Lê Hoàng Đức',
    parentPhone: '0912345682',
    classId: 'lop-1a1',
  },
  {
    studentId: 'st-004',
    studentCode: 'HS2026-004',
    fullName: 'Phạm Quỳnh Anh',
    nickname: 'Dâu Tây',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    gender: 'female',
    parentName: 'Phạm Văn Lâm',
    parentPhone: '0912345684',
    classId: 'lop-1a1',
  },
  {
    studentId: 'st-005',
    studentCode: 'HS2026-005',
    fullName: 'Hoàng Gia Huy',
    nickname: 'Huy Huy',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    gender: 'male',
    parentName: 'Hoàng Văn Thái',
    parentPhone: '0912345686',
    classId: 'lop-1a1',
  },
  {
    studentId: 'st-006',
    studentCode: 'HS2026-006',
    fullName: 'Vũ Thảo Nguyên',
    nickname: 'Bơ',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&h=120&fit=crop&crop=face',
    gender: 'female',
    parentName: 'Vũ Đức Đam',
    parentPhone: '0912345688',
    classId: 'lop-1a1',
  },
  // Class 4 / 3 (Mầm non)
  {
    studentId: 'st-c3-001',
    studentCode: '79094019938',
    fullName: 'Phạm Ngọc Bích Khuê',
    nickname: 'Khuê',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&h=120&fit=crop&crop=face',
    gender: 'female',
    parentName: 'Phạm Tuấn Vũ',
    parentPhone: '0903123456',
    classId: '3',
  },
  {
    studentId: 'st-c3-002',
    studentCode: '79094019940',
    fullName: 'Nguyễn Huỳnh Kim',
    nickname: 'Kim',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
    gender: 'female',
    parentName: 'Nguyễn Huỳnh Hải',
    parentPhone: '0903123457',
    classId: '3',
  },
  {
    studentId: 'st-c3-003',
    studentCode: '79094019942',
    fullName: 'Nguyễn Huỳnh Nhật Linh',
    nickname: 'Ớt',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=face',
    gender: 'female',
    parentName: 'Nguyễn Nhật Nam',
    parentPhone: '0903123458',
    classId: '3',
  },
  {
    studentId: 'st-c4-001',
    studentCode: '79094018801',
    fullName: 'Đỗ Tuấn Kiệt',
    nickname: 'Kiệt Bo',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
    gender: 'male',
    parentName: 'Đỗ Tuấn Minh',
    parentPhone: '0908889991',
    classId: '4',
  },
  {
    studentId: 'st-c4-002',
    studentCode: '79094018802',
    fullName: 'Trương Hoàng Vân',
    nickname: 'Vân Vân',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    gender: 'female',
    parentName: 'Trương Quốc Bảo',
    parentPhone: '0908889992',
    classId: '4',
  },
];

export const INITIAL_NUTRITION_RECORDS: StudentCareRecord[] = [
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[0], '2026-11-17'),
    isEvaluated: true,
    updatedAt: '2026-11-17T11:45:00.000Z',
    updatedBy: 'Cô Nguyễn Thu Mai',
    meals: {
      breakfast: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Bé ăn nhanh nhẹn, tự xúc hết tô bún riêu.' },
      lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết cơm và canh, khen sườn ngon.' },
      snack: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Uống hết sữa tươi và ăn bánh flan.' },
    },
    sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ từ 11:45 đến 13:50, không giật mình.' },
    hydration: { behavior: 'chu_dong', amount: 'thuong_xuyen', note: 'Uống đủ nước sau giờ hoạt động ngoài trời.' },
    hygiene: {
      general: { activities: ['rua_tay', 'thay_quan_ao'], behavior: 'chu_dong', note: 'Tự rửa tay bằng xà phòng sạch sẽ.' },
      poop: { behavior: 'chu_dong_tu_di', note: 'Đi tiêu lúc 09:30, phân tốt bình thường.' },
    },
    generalNote: 'Hôm nay con rất ngoan và tích cực giúp đỡ cô chia khay ăn cho các bạn.',
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[1], '2026-11-17'),
    isEvaluated: true,
    updatedAt: '2026-11-17T11:50:00.000Z',
    updatedBy: 'Cô Nguyễn Thu Mai',
    meals: {
      breakfast: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết phần ăn sáng.' },
      lunch: { behavior: 'can_ho_tro', amount: 'an_nua_suat', note: 'Hôm nay hơi ngậm cơm, cô phải nhắc nhở.' },
      snack: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn tốt bữa xế.' },
    },
    sleep: { behavior: 'gv_ho_tro', duration: 'tam_60_phut', note: 'Cô phải vỗ lưng một lúc mới chịu ngủ.' },
    hydration: { behavior: 'gv_goi_y', amount: 'thinh_thoang', note: 'Cô cần nhắc bé uống nước.' },
    hygiene: {
      general: { activities: ['rua_tay'], behavior: 'chu_dong', note: 'Chủ động rửa tay trước khi ăn.' },
      poop: { behavior: 'khong_di', note: 'Chưa đi tiêu tại trường hôm nay.' },
    },
    generalNote: 'Bé hơi buồn ngủ buổi trưa nên ăn hơi chậm, chiều tươi tỉnh hơn.',
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[2], '2026-11-17'),
    isEvaluated: false,
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[3], '2026-11-17'),
    isEvaluated: false,
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[4], '2026-11-17'),
    isEvaluated: false,
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[5], '2026-11-17'),
    isEvaluated: false,
  },
  // Class 3 records
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[6], '2026-11-17'),
    isEvaluated: true,
    updatedAt: '2026-11-17T11:30:00.000Z',
    updatedBy: 'Trường Mầm non Demo Admin',
    meals: {
      breakfast: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Tự xúc ăn hết bát súp.' },
      lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Thích ăn rau và thịt viên sốt cà.' },
      snack: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Uống sữa tươi và ăn chuối.' },
    },
    sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ ngoan, đúng giờ.' },
    hydration: { behavior: 'chu_dong', amount: 'thuong_xuyen', note: 'Tự lấy bình nước uống.' },
    hygiene: {
      general: { activities: ['rua_tay', 'lau_don'], behavior: 'chu_dong', note: 'Rửa tay sạch trước ăn.' },
      poop: { behavior: 'chu_dong_tu_di', note: 'Đi tiêu lúc 10:15.' },
    },
    generalNote: 'Bé Khuê rất chủ động trong mọi hoạt động nề nếp của lớp.',
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[7], '2026-11-17'),
    isEvaluated: false,
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[8], '2026-11-17'),
    isEvaluated: false,
  },
  // Class 4 records
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[9], '2026-11-17'),
    isEvaluated: true,
    meals: {
      breakfast: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết bát phở gà.' },
      lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết cơm và thịt bò.' },
      snack: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn yaourt và hoa quả.' },
    },
    sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ sâu giấc.' },
    hydration: { behavior: 'chu_dong', amount: 'thuong_xuyen', note: 'Uống nhiều nước ấm.' },
    hygiene: {
      general: { activities: ['rua_tay', 'thay_quan_ao'], behavior: 'chu_dong', note: 'Tự giác rửa tay.' },
      poop: { behavior: 'khong_di', note: '' },
    },
    generalNote: 'Bé Kiệt rất hợp tác với cô giáo.',
  },
  {
    ...createEmptyCareRecord(RAW_MOCK_STUDENTS[10], '2026-11-17'),
    isEvaluated: false,
  },
];

export function getCareRecordsForDateAndClass(
  date: string,
  classId: string,
  customAttendance?: StudentAttendance[]
): StudentCareRecord[] {
  // 1. Get attendance records for this date and class
  const attendanceList = customAttendance || getAttendanceForDateAndClass(date, classId);

  // 2. CRITICAL BUSINESS RULE: Only students who have been checked in (status === 'present' and arrivalTime exists)
  // are eligible for daily child care (meals, sleep, hydration, hygiene) at school!
  const presentAttendance = attendanceList.filter(
    (att) => att.status === 'present' && Boolean(att.arrivalTime)
  );

  // If no students are checked in on this date, the care roster is empty
  if (presentAttendance.length === 0) {
    return [];
  }

  // 3. Map present attendance to care records
  return presentAttendance.map((att) => {
    const raw = RAW_MOCK_STUDENTS.find((s) => s.studentId === att.studentId);
    const parent = att.guardians && att.guardians[0];
    const studentInfo = {
      studentId: att.studentId,
      studentCode: att.studentCode,
      fullName: att.fullName,
      nickname: raw?.nickname,
      avatarUrl: att.avatarUrl,
      gender: att.gender,
      parentName: raw?.parentName || parent?.fullName || 'Phụ huynh',
      parentPhone: raw?.parentPhone || parent?.phoneNumber || '0901234567',
      classId,
    };

    const existing = INITIAL_NUTRITION_RECORDS.find(
      (r) => r.studentId === att.studentId && r.date === date
    );

    if (existing) {
      return {
        ...existing,
        classId,
        arrivalTime: att.arrivalTime,
        attendanceStatus: att.status,
      };
    }

    const created = createEmptyCareRecord(studentInfo, date);
    return {
      ...created,
      arrivalTime: att.arrivalTime,
      attendanceStatus: att.status,
    };
  });
}
