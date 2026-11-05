// Mock Data for Module 1: Vận Hành - Báo Cáo
import type {
  DailyAttendanceRecord,
  DevelopmentalTemplate,
  ExtendedReport,
  StaffMonthlyAttendance,
  StudentMonthlyAttendance,
} from '../types/reports.ts';
import { computeDaysInMonth, computeStudentAttendanceTotals } from '../utils/reportsValidation.ts';

export const DEVELOPMENTAL_TEMPLATES: DevelopmentalTemplate[] = [
  {
    id: 'tieng_viet',
    name: 'Báo cáo lĩnh vực ngôn ngữ Tiếng Việt',
    category: 'Ngôn ngữ',
    description: 'Đánh giá khả năng phát âm, nhận diện chữ cái, và kỹ năng giao tiếp tiếng Việt.',
    sections: [
      {
        id: 'am_chu_cai',
        title: '1. Âm & Chữ Cái (Bảng chữ cái mẫu giáo)',
        levels: ['Nghe Được Âm', 'Gọi Tên Chữ Cái', 'Viết Chữ Cái'],
        items: [
          { id: 'chu_a', label: 'Chữ A - a (Con gà, Quả na)' },
          { id: 'chu_aw', label: 'Chữ Ă - ă (Mặt trăng, Khăn quàng)' },
          { id: 'chu_aa', label: 'Chữ Â - â (Cây nấm, Cái ấm)' },
          { id: 'chu_b', label: 'Chữ B - b (Búp bê, Bánh chưng)' },
          { id: 'chu_c', label: 'Chữ C - c (Con cá, Cầu vồng)' },
        ],
      },
      {
        id: 'nghe_noi',
        title: '2. Kỹ Năng Nghe Nói & Diễn Đạt',
        items: [
          { id: 'nghe_hieu', label: 'Hiểu và làm theo 2-3 chỉ dẫn liên tiếp của cô giáo' },
          { id: 'ke_chuyen', label: 'Biết kể lại câu chuyện ngắn quen thuộc theo tranh minh họa' },
          { id: 'dien_dat_ro_rang', label: 'Nói câu trọn vẹn, phát âm rõ ràng các phụ âm đầu' },
        ],
      },
    ],
  },
  {
    id: 'toan',
    name: 'Báo cáo lĩnh vực Toán & Tư duy logic',
    category: 'Tư duy',
    description: 'Đánh giá nhận biết số lượng, hình học và khả năng phân loại so sánh.',
    sections: [
      {
        id: 'so_luong',
        title: '1. Đếm & Nhận Biết Số Lượng (1 đến 10)',
        items: [
          { id: 'dem_1_5', label: 'Đếm xuôi và đếm đồ vật thành thạo trong phạm vi 5' },
          { id: 'dem_6_10', label: 'Nhận biết và gắn đúng chữ số tương ứng số lượng 1-10' },
          { id: 'so_sanh', label: 'Biết so sánh nhiều hơn - ít hơn giữa hai nhóm đồ chơi' },
        ],
      },
      {
        id: 'hinh_hoc',
        title: '2. Hình Học & Định Hướng Không Gian',
        items: [
          { id: 'nhan_biet_hinh', label: 'Phân biệt hình tròn, hình vuông, hình tam giác, hình chữ nhật' },
          { id: 'dinh_huong', label: 'Xác định phía trên/dưới, trước/sau, trái/phải của bản thân' },
        ],
      },
    ],
  },
  {
    id: 'english',
    name: 'ENGLISH LANGUAGE REPORT (Phonics & Communication)',
    category: 'Ngoại ngữ',
    description: 'Assessment of preschool English phonics, everyday vocabulary, and active responses.',
    sections: [
      {
        id: 'phonics',
        title: '1. Phonics & Letter Recognition',
        items: [
          { id: 'letters_abc', label: 'Can recognize and sound out letters A, B, C, D, E' },
          { id: 'sight_words', label: 'Can identify initial sound in words like Apple, Ball, Cat' },
        ],
      },
      {
        id: 'conversations',
        title: '2. Everyday Classroom Communication',
        items: [
          { id: 'greetings', label: 'Greets teacher and peers politely (Hello, Good morning, Bye-bye)' },
          { id: 'simple_requests', label: 'Responds correctly to action commands (Stand up, Sit down, Circle time)' },
        ],
      },
    ],
  },
  {
    id: 'thu_tuan',
    name: 'Thư tuần & Đánh giá định kỳ',
    category: 'Tổng hợp',
    description: 'Tóm tắt sự thích nghi, nề nếp sinh hoạt và rèn luyện kỹ năng sống hàng tuần.',
    sections: [
      {
        id: 'ne_nep',
        title: '1. Nề Nếp & Kỹ Năng Tự Phục Vụ',
        items: [
          { id: 'tu_xuc_an', label: 'Tự xúc ăn gọn gàng, uống nước đủ lượng trong ngày' },
          { id: 've_sinh', label: 'Biết rửa tay bằng xà phòng đúng quy trình trước khi ăn và sau vệ sinh' },
          { id: 'ngu_trua', label: 'Ngủ trưa đúng giờ, xếp gối gọn gàng sau khi ngủ dậy' },
        ],
      },
    ],
  },
];

// Helper to generate realistic September 2026 records for a student
function generateStudentMonthRecords(
  studentName: string,
  overtimeDays: number[], // Day numbers with late departures
  absentExcusedDays: number[],
  absentUnexcusedDays: number[]
): { [date: string]: DailyAttendanceRecord } {
  const days = computeDaysInMonth(2026, 9);
  const records: { [date: string]: DailyAttendanceRecord } = {};

  days.forEach(({ date, dayNumber, weekday }) => {
    // Weekends (T7, CN) are unmarked by default
    if (weekday === 'T7' || weekday === 'CN') {
      records[date] = {
        date,
        dayNumber,
        weekday,
        status: 'unmarked',
        checkInTime: null,
        checkInStaff: null,
        checkOutTime: null,
        checkOutStaff: null,
        temperature: null,
        healthStatus: null,
        isLateArrival: false,
        isLateDeparture: false,
        lateArrivalMinutes: 0,
        lateDepartureMinutes: 0,
      };
      return;
    }

    if (absentExcusedDays.includes(dayNumber)) {
      records[date] = {
        date,
        dayNumber,
        weekday,
        status: 'absent_excused',
        checkInTime: null,
        checkInStaff: null,
        checkOutTime: null,
        checkOutStaff: null,
        temperature: null,
        healthStatus: 'Báo vắng có phép: Gia đình có việc bận / Sốt nhẹ',
        isLateArrival: false,
        isLateDeparture: false,
        lateArrivalMinutes: 0,
        lateDepartureMinutes: 0,
        notes: 'Phụ huynh xin phép qua kênh Trao Đổi.',
      };
      return;
    }

    if (absentUnexcusedDays.includes(dayNumber)) {
      records[date] = {
        date,
        dayNumber,
        weekday,
        status: 'absent_unexcused',
        checkInTime: null,
        checkInStaff: null,
        checkOutTime: null,
        checkOutStaff: null,
        temperature: null,
        healthStatus: 'Vắng không phép (chưa liên hệ được)',
        isLateArrival: false,
        isLateDeparture: false,
        lateArrivalMinutes: 0,
        lateDepartureMinutes: 0,
        notes: 'Giáo viên đã gọi điện nhưng chưa bắt máy.',
      };
      return;
    }

    // Present day
    const isLateDep = overtimeDays.includes(dayNumber);
    const lateDepMins = isLateDep ? 45 : 0; // 45 mins overtime -> 100,000 VND
    const checkOut = isLateDep ? '18:15' : '17:00';

    records[date] = {
      date,
      dayNumber,
      weekday,
      status: 'present',
      checkInTime: dayNumber === 4 ? '08:20' : '07:45',
      checkInStaff: 'Cô Nguyễn Mai',
      checkOutTime: checkOut,
      checkOutStaff: 'Cô Thu Thủy',
      temperature: 36.6,
      healthStatus: 'Bình thường, vui vẻ tham gia hoạt động',
      isLateArrival: dayNumber === 4,
      isLateDeparture: isLateDep,
      lateArrivalMinutes: dayNumber === 4 ? 20 : 0,
      lateDepartureMinutes: lateDepMins,
      notes: isLateDep ? 'Phụ huynh báo kẹt xe, nhờ trường trông muộn.' : '',
    };
  });

  return records;
}

export function createInitialStudentRoster(): StudentMonthlyAttendance[] {
  const students = [
    {
      studentId: 'hs-001',
      studentName: 'An (Bé 25)',
      studentCode: 'HS-1A1-001',
      parentName: 'Nguyễn Hoàng Huyền My',
      phone: '012067164112',
      avatarUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&h=120&fit=crop',
      overtimeDays: [5, 18], // 2 overtime pickups (45 min each)
      absentExcusedDays: [12], // Sốt ngày 12
      absentUnexcusedDays: [],
    },
    {
      studentId: 'hs-002',
      studentName: 'Anh (Út)',
      studentCode: 'HS-1A1-002',
      parentName: 'Trần Mỹ Anh',
      phone: '112233445501',
      avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&h=120&fit=crop',
      overtimeDays: [11], // 1 overtime pickup
      absentExcusedDays: [22],
      absentUnexcusedDays: [],
    },
    {
      studentId: 'hs-003',
      studentName: 'Anh (Bé 03)',
      studentCode: 'HS-1A1-003',
      parentName: 'Trần Mỹ Anh',
      phone: '112233445505',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
      overtimeDays: [],
      absentExcusedDays: [8, 9],
      absentUnexcusedDays: [],
    },
    {
      studentId: 'hs-004',
      studentName: 'Minh Anh',
      studentCode: 'HS-1A1-004',
      parentName: 'Đỗ Tuấn',
      phone: '09192931188',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
      overtimeDays: [2, 16, 25],
      absentExcusedDays: [],
      absentUnexcusedDays: [15],
    },
    {
      studentId: 'hs-005',
      studentName: 'Anh (Bé 31)',
      studentCode: 'HS-1A1-005',
      parentName: 'Trần Hoàng Anh',
      phone: '0988776655',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop',
      overtimeDays: [9],
      absentExcusedDays: [19],
      absentUnexcusedDays: [],
    },
  ];

  return students.map((s) => {
    const records = generateStudentMonthRecords(
      s.studentName,
      s.overtimeDays,
      s.absentExcusedDays,
      s.absentUnexcusedDays
    );
    const totals = computeStudentAttendanceTotals(records);
    return {
      studentId: s.studentId,
      studentName: s.studentName,
      studentCode: s.studentCode,
      avatarUrl: s.avatarUrl,
      parentName: s.parentName,
      phone: s.phone,
      records,
      ...totals,
    };
  });
}

export const INITIAL_STAFF_ROSTER: StaffMonthlyAttendance[] = [
  {
    staffId: 'gv-001',
    staffName: 'Cô Nguyễn Mai',
    staffCode: 'GV-001',
    phone: '0901234567',
    role: 'giao_vien',
    roleName: 'Giáo Viên Chủ Nhiệm',
    department: 'Khối Lớp 1',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop',
    records: {},
    totalPresent: 22,
    totalAbsentExcused: 0,
    totalAbsentUnexcused: 0,
    totalLate: 0,
  },
  {
    staffId: 'gv-002',
    staffName: 'Cô Thu Thủy',
    staffCode: 'GV-002',
    phone: '0912345678',
    role: 'giao_vien',
    roleName: 'Giáo Viên Bộ Môn',
    department: 'Khối Lớp 1',
    avatarUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=120&h=120&fit=crop',
    records: {},
    totalPresent: 21,
    totalAbsentExcused: 1,
    totalAbsentUnexcused: 0,
    totalLate: 1,
  },
  {
    staffId: 'nv-001',
    staffName: 'Bác Lê Văn Hùng',
    staffCode: 'NV-001',
    phone: '0987654321',
    role: 'nhan_vien',
    roleName: 'Bảo Vệ / Quản Lý Xe Bus',
    department: 'Hậu Cần & Đưa Đón',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    records: {},
    totalPresent: 22,
    totalAbsentExcused: 0,
    totalAbsentUnexcused: 0,
    totalLate: 0,
  },
  {
    staffId: 'ad-001',
    staffName: 'Cô Trần Bảo Ngọc',
    staffCode: 'AD-001',
    phone: '0933889911',
    role: 'admin',
    roleName: 'Quản Trị Viên (Admin)',
    department: 'Văn Phòng Nhà Trường',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
    records: {},
    totalPresent: 22,
    totalAbsentExcused: 0,
    totalAbsentUnexcused: 0,
    totalLate: 0,
  },
];

export const INITIAL_EXTENDED_REPORTS: ExtendedReport[] = [
  {
    id: 'rep-001',
    title: 'Báo cáo ngôn ngữ Tiếng Việt - Lê Gia Huy',
    studentId: 'hs-001',
    studentName: 'Lê Gia Huy',
    studentCode: 'HS-1A1-001',
    studentAge: '5 tuổi 8 tháng',
    studentAvatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=120&h=120&fit=crop',
    parentName: 'Anh Lê Văn Thành',
    classId: 'lop-1a1',
    className: 'Lớp 1A1 (Chồi)',
    templateId: 'tieng_viet',
    templateName: 'Báo cáo lĩnh vực ngôn ngữ Tiếng Việt',
    dateType: 'date_range',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'completed',
    createdBy: 'Cô Nguyễn Mai',
    createdAt: '2026-09-10T08:30:00Z',
    updatedAt: '2026-09-12T09:00:00Z',
    checklistData: {
      am_chu_cai: {
        chu_a: true,
        chu_aw: true,
        chu_aa: true,
        chu_b: true,
        chu_c: false,
      },
      nghe_noi: {
        nghe_hieu: true,
        ke_chuyen: true,
        dien_dat_ro_rang: false,
      },
    },
    generalNotes: 'Bé Gia Huy nhận biết chữ cái rất nhanh. Cần khuyến khích thêm khi phát âm âm C và phát biểu trước nhóm đông.',
  },
  {
    id: 'rep-002',
    title: 'Báo cáo lĩnh vực Toán - Trần Minh Khôi',
    studentId: 'hs-002',
    studentName: 'Trần Minh Khôi',
    studentCode: 'HS-1A1-002',
    studentAge: '5 tuổi 9 tháng',
    studentAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&h=120&fit=crop',
    parentName: 'Chị Phạm Thị Hằng',
    classId: 'lop-1a1',
    className: 'Lớp 1A1 (Chồi)',
    templateId: 'toan',
    templateName: 'Báo cáo lĩnh vực Toán & Tư duy logic',
    dateType: 'date_range',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'sent',
    createdBy: 'Cô Thu Thủy',
    createdAt: '2026-09-11T14:15:00Z',
    updatedAt: '2026-09-12T10:00:00Z',
    checklistData: {
      so_luong: {
        dem_1_5: true,
        dem_6_10: true,
        so_sanh: true,
      },
      hinh_hoc: {
        nhan_biet_hinh: true,
        dinh_huong: false,
      },
    },
    generalNotes: 'Bé Minh Khôi say mê học các con số, đếm rất chuẩn. Kỹ năng định hướng trái phải cần rèn luyện thêm qua trò chơi thể chất.',
  },
  {
    id: 'rep-003',
    title: 'ENGLISH LANGUAGE REPORT - Nguyễn Minh Anh',
    studentId: 'hs-003',
    studentName: 'Nguyễn Minh Anh',
    studentCode: 'HS-1A1-003',
    studentAge: '5 tuổi 6 tháng',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    parentName: 'Chị Đặng Thúy Nga',
    classId: 'lop-1a1',
    className: 'Lớp 1A1 (Chồi)',
    templateId: 'english',
    templateName: 'ENGLISH LANGUAGE REPORT',
    dateType: 'date_range',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'draft',
    createdBy: 'Cô Nguyễn Mai',
    createdAt: '2026-09-12T07:45:00Z',
    updatedAt: '2026-09-12T07:45:00Z',
    checklistData: {
      phonics: {
        letters_abc: true,
        sight_words: false,
      },
      conversations: {
        greetings: true,
        simple_requests: true,
      },
    },
    generalNotes: 'Đang soạn thảo phần nhận xét phát âm phonics cho bé Minh Anh.',
  },
  {
    id: 'rep-004',
    title: 'Báo cáo năng lực Toán - Hoàng Đức Minh',
    studentId: 'st-1a2-001',
    studentName: 'Hoàng Đức Minh',
    studentCode: 'HS2026-1A2-01',
    studentAge: '6 tuổi 2 tháng',
    studentAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop',
    parentName: 'Anh Hoàng Văn Thắng',
    classId: 'lop-1a2',
    className: 'Lớp 1A2 (Khối 1)',
    templateId: 'toan',
    templateName: 'Báo cáo lĩnh vực Toán & Tư duy logic',
    dateType: 'date_range',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'completed',
    createdBy: 'Cô Lê Thanh Thảo',
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-09-12T11:00:00Z',
    checklistData: {
      so_luong: { dem_1_5: true, dem_6_10: true, so_sanh: true },
      hinh_hoc: { nhan_biet_hinh: true, dinh_huong: true },
    },
    generalNotes: 'Bé Đức Minh tư duy hình học và làm phép cộng trừ trong phạm vi 10 rất xuất sắc.',
  },
  {
    id: 'rep-005',
    title: 'Báo cáo rèn luyện thể chất - Lê Quốc Bảo',
    studentId: 'st-2a1-001',
    studentName: 'Lê Quốc Bảo',
    studentCode: 'HS2026-2A1-01',
    studentAge: '7 tuổi 1 tháng',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    parentName: 'Anh Lê Quốc Anh',
    classId: 'lop-2a1',
    className: 'Lớp 2A1 (Khối 2)',
    templateId: 'thu_tuan',
    templateName: 'Thư tuần & Rèn luyện kỹ năng sống',
    dateType: 'date_range',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'sent',
    createdBy: 'Thầy Trần Quốc Tuấn',
    createdAt: '2026-09-11T15:30:00Z',
    updatedAt: '2026-09-12T16:00:00Z',
    checklistData: {
      the_luc: { chay_tiep_suc: true, nhay_day: true },
      ky_nang: { lam_viec_nhom: true, tu_phuc_vu: true },
    },
    generalNotes: 'Bảo rất năng động, có tinh thần đồng đội cao và luôn gương mẫu trong giờ thể dục.',
  },
  {
    id: 'rep-006',
    title: 'Báo cáo môn Khoa học Tự nhiên - Nguyễn Việt Hoàng',
    studentId: 'st-6a1-001',
    studentName: 'Nguyễn Việt Hoàng',
    studentCode: 'HS2026-6A1-01',
    studentAge: '11 tuổi 5 tháng',
    studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop',
    parentName: 'Anh Nguyễn Văn Tuấn',
    classId: 'lop-6a1',
    className: 'Lớp 6A1 (Khối 6)',
    templateId: 'toan',
    templateName: 'Báo cáo năng lực Toán & Tư duy logic',
    dateType: 'date_range',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'completed',
    createdBy: 'Cô Trần Mai Linh',
    createdAt: '2026-09-12T08:00:00Z',
    updatedAt: '2026-09-12T09:30:00Z',
    checklistData: {
      ly_thuyet: { nam_vung_kien_thuc: true, van_dung_thuc_te: true },
      thuc_hanh: { su_dung_kinh_hien_vi: true, an_toan_phong_thi_nghiem: true },
    },
    generalNotes: 'Hoàng nắm rất chắc kỹ năng thí nghiệm và có nhiều câu hỏi sáng tạo trong giờ học.',
  },
  {
    id: 'rep-007',
    title: 'Báo cáo phát triển kỹ năng Mầm non - Bé Bông',
    studentId: 'st-la1-001',
    studentName: 'Bé Bông (Nguyễn Ngọc Mai)',
    studentCode: 'HS2026-MN-01',
    studentAge: '4 tuổi 8 tháng',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop',
    parentName: 'Anh Nguyễn Văn Minh',
    classId: 'lop-la-1',
    className: 'Lớp Lá 1 (Mầm non)',
    templateId: 'tieng_viet',
    templateName: 'Báo cáo lĩnh vực ngôn ngữ Tiếng Việt Mầm non',
    dateType: 'date_range',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'sent',
    createdBy: 'Cô Nguyễn Thu Hà',
    createdAt: '2026-09-10T14:00:00Z',
    updatedAt: '2026-09-11T09:00:00Z',
    checklistData: {
      nhan_thuc: { phan_biet_mau_sac: true, dem_vat_the: true },
      ngon_ngu: { hat_theo_co: true, ke_lai_cau_chuyen: true },
    },
    generalNotes: 'Bé Bông rất ngoan, tự giác cất đồ chơi sau khi chơi xong và biết quan tâm bạn bè.',
  },
];
