import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Student, GrowthRecord, StudentFilterState, ClassTransferPayload, StudentFeeItem } from '../../types/student';
import { calculateBmi, classifyBmi } from '../../utils/studentValidation.ts';

export interface StudentState {
  students: Student[];
  selectedStudentId: string | null;
  filter: StudentFilterState;
  loading: boolean;
}

const mockStudents: Student[] = [
  {
    id: '83',
    schoolCode: 'demo',
    studentCode: '9192930044',
    fullName: 'Nguyễn Trí Bình An',
    nickName: '',
    avatar: '',
    dob: '2010-01-01',
    gender: 'nam',
    cccd: '079190001154',
    status: 'active',
    classId: 'class-11a1',
    className: 'Lớp 11A1',
    admissionDate: '2025-09-05',
    address: '34 Hoàng Việt, Phường Tân Sơn Nhất, TP.HCM',
    ethnicity: 'Kinh',
    religion: 'Không',
    notes: '',
    guardians: [
      {
        id: 'ph-83a',
        fullName: 'Nguyễn Trí Đức',
        relationship: 'bo',
        phone: '0901234567',
        email: 'duc.nguyen@example.com',
        occupation: 'Doanh nhân',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
      {
        id: 'ph-83b',
        fullName: 'Trần Thị Thu An',
        relationship: 'me',
        phone: '0907654321',
        email: 'an.tran@example.com',
        occupation: 'Bác sĩ',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [],
    feeItems: [
      {
        id: 'sfee-83-1',
        feeId: 'fee-sys-001',
        code: 'HOC_PHI',
        name: 'Học phí',
        amount: 200000,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: true,
        category: 'hoc_phi',
        isMandatory: true,
      },
      {
        id: 'sfee-83-2',
        feeId: 'fee-sys-002',
        code: 'TIEN_AN',
        name: 'Tiền ăn',
        amount: 35000,
        unit: 'ngay',
        unitDisplay: 'Đ/ngày',
        exportElectronicInvoice: true,
        category: 'tien_an',
        isMandatory: true,
      },
      {
        id: 'sfee-83-3',
        feeId: 'fee-cust-011',
        code: 'HOC_LIEU_LS',
        name: 'Học liệu Lịch sử',
        amount: 280000,
        unit: 'nam',
        unitDisplay: 'Đ/năm',
        exportElectronicInvoice: false,
        category: 'khac',
      },
      {
        id: 'sfee-83-4',
        feeId: 'fee-cust-012',
        code: 'NGOAI_KHOA',
        name: 'Ngoại khóa',
        amount: 0,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: false,
        category: 'khac',
      },
      {
        id: 'sfee-83-5',
        feeId: 'fee-cust-013',
        code: 'TIENG_ANH',
        name: 'Tiếng Anh',
        amount: 1000,
        unit: 'thang',
        unitDisplay: 'Đ/tháng',
        exportElectronicInvoice: false,
        category: 'khac',
      },
    ],
  },
  {
    id: 'hs-001',
    schoolCode: 'demo',
    studentCode: 'HS-2026-001',
    fullName: 'Nguyễn Gia Huy',
    nickName: 'Bơ',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80',
    dob: '2010-04-12',
    gender: 'nam',
    cccd: '001201004567',
    status: 'active',
    classId: 'class-10a1',
    className: 'Lớp 10A1',
    admissionDate: '2026-09-05',
    address: 'Số 45, Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    ethnicity: 'Kinh',
    religion: 'Không',
    notes: 'Học sinh đạt giải Nhất học sinh giỏi cấp Tỉnh. Hưởng học bổng tài năng 50%.',
    tuitionDiscountPercent: 50,
    guardians: [
      {
        id: 'ph-001a',
        fullName: 'Nguyễn Văn Hùng',
        relationship: 'bo',
        phone: '0903123456',
        email: 'hung.nguyen@example.com',
        occupation: 'Kỹ sư phần mềm',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
      {
        id: 'ph-001b',
        fullName: 'Lê Thị Thu',
        relationship: 'me',
        phone: '0918654321',
        email: 'thu.le@example.com',
        occupation: 'Kế toán viên',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [
      {
        id: 'gr-001-1',
        measuredAt: '2026-09-06',
        heightCm: 165,
        weightKg: 52.5,
        bmi: 19.3,
        bmiClassification: 'normal',
        measuredBy: 'Y tế học đường - Cô Mai',
        notes: 'Thể trạng tốt, thị lực 10/10',
      },
    ],
  },
  {
    id: 'hs-002',
    schoolCode: 'demo',
    studentCode: 'HS-2026-002',
    fullName: 'Lê Bảo Anh',
    nickName: 'Miu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    dob: '2010-07-28',
    gender: 'nu',
    cccd: '079201009876',
    status: 'active',
    classId: 'class-10a1',
    className: 'Lớp 10A1',
    admissionDate: '2026-09-05',
    address: 'Chung cư Masteri Thảo Điền, TP. Thủ Đức',
    ethnicity: 'Kinh',
    religion: 'Không',
    notes: 'Học sinh đạt học bổng khuyến khích học tập 20%.',
    tuitionDiscountPercent: 20,
    guardians: [
      {
        id: 'ph-002',
        fullName: 'Lê Thanh Nam',
        relationship: 'bo',
        phone: '0918654321',
        email: 'nam.le@example.com',
        occupation: 'Kiến trúc sư',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [
      {
        id: 'gr-002-1',
        measuredAt: '2026-09-06',
        heightCm: 158,
        weightKg: 46.8,
        bmi: 18.7,
        bmiClassification: 'normal',
        measuredBy: 'Y tế học đường - Cô Mai',
      },
    ],
  },
  {
    id: 'hs-003',
    schoolCode: 'demo',
    studentCode: 'HS-2026-003',
    fullName: 'Trần Minh Trí',
    nickName: 'Bin',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    dob: '2010-02-18',
    gender: 'nam',
    cccd: '080201001122',
    status: 'active',
    classId: 'class-10a2',
    className: 'Lớp 10A2',
    admissionDate: '2026-09-05',
    address: '128 Điện Biên Phủ, Quận Bình Thạnh',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [
      {
        id: 'ph-003',
        fullName: 'Trần Văn Hòa',
        relationship: 'bo',
        phone: '0983456789',
        email: 'hoa.tran@example.com',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [],
  },
  {
    id: 'hs-004',
    schoolCode: 'demo',
    studentCode: 'HS-2026-004',
    fullName: 'Hoàng Kim Ngân',
    dob: '2010-10-09',
    gender: 'nu',
    cccd: '079201004455',
    status: 'active',
    classId: 'class-10a3',
    className: 'Lớp 10A3',
    admissionDate: '2026-09-05',
    address: 'Khu dân cư Him Lam, Quận 7',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [
      {
        id: 'ph-004',
        fullName: 'Hoàng Thị Lan',
        relationship: 'me',
        phone: '0978901234',
        email: 'lan.hoang@example.com',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [],
  },
  {
    id: 'hs-005',
    schoolCode: 'demo',
    studentCode: 'HS-2026-005',
    fullName: 'Đặng Thu Thảo',
    dob: '2009-05-14',
    gender: 'nu',
    cccd: '079200907788',
    status: 'active',
    classId: 'class-11a1',
    className: 'Lớp 11A1',
    admissionDate: '2025-09-05',
    address: 'Phường Đa Kao, Quận 1',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [
      {
        id: 'ph-005',
        fullName: 'Đặng Thị Mai',
        relationship: 'me',
        phone: '0934567890',
        email: 'mai.dang@example.com',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [],
  },
  {
    id: 'hs-006',
    schoolCode: 'demo',
    studentCode: 'HS-2026-006',
    fullName: 'Phạm Nhật Nam',
    dob: '2009-11-20',
    gender: 'nam',
    cccd: '079200909988',
    status: 'active',
    classId: 'class-11a2',
    className: 'Lớp 11A2',
    admissionDate: '2025-09-05',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [
      {
        id: 'ph-006',
        fullName: 'Phạm Văn Đức',
        relationship: 'bo',
        phone: '0908112233',
        email: 'duc.pham@example.com',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [],
  },
  {
    id: 'hs-007',
    schoolCode: 'demo',
    studentCode: 'HS-2026-007',
    fullName: 'Vũ Quốc Khánh',
    dob: '2008-08-15',
    gender: 'nam',
    cccd: '079200803322',
    status: 'active',
    classId: 'class-12a1',
    className: 'Lớp 12A1',
    admissionDate: '2024-09-05',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [
      {
        id: 'ph-007',
        fullName: 'Vũ Đình Tuấn',
        relationship: 'bo',
        phone: '0912445566',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [],
  },
  {
    id: 'hs-008',
    schoolCode: 'demo',
    studentCode: 'HS-2026-008',
    fullName: 'Đỗ Quỳnh Chi',
    dob: '2008-12-03',
    gender: 'nu',
    cccd: '079200806655',
    status: 'active',
    classId: 'class-12a1',
    className: 'Lớp 12A1',
    admissionDate: '2024-09-05',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [
      {
        id: 'ph-008',
        fullName: 'Đỗ Thị Hà',
        relationship: 'me',
        phone: '0919445566',
        isEmergencyContact: true,
        isPrimaryPickup: true,
      },
    ],
    growthRecords: [],
  },
  {
    id: 'hs-101',
    schoolCode: 'demo',
    studentCode: 'HS-2026-101',
    fullName: 'Nguyễn Hoàng Nam',
    nickName: 'Bơ Nhỏ',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&h=120&fit=crop&crop=face',
    dob: '2020-04-12',
    gender: 'nam',
    cccd: '001202004567',
    status: 'active',
    classId: 'lop-1a1',
    className: 'Lớp 1A1',
    admissionDate: '2026-09-05',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [],
    growthRecords: [],
  },
  {
    id: 'hs-102',
    schoolCode: 'demo',
    studentCode: 'HS-2026-102',
    fullName: 'Trần Lê Thảo My',
    nickName: 'Miu Miu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    dob: '2020-07-28',
    gender: 'nu',
    cccd: '079202009876',
    status: 'active',
    classId: 'lop-1a1',
    className: 'Lớp 1A1',
    admissionDate: '2026-09-05',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [],
    growthRecords: [],
  },
  {
    id: 'hs-105',
    schoolCode: 'demo',
    studentCode: 'HS-2026-105',
    fullName: 'Đỗ Ngọc Anh',
    dob: '2020-05-14',
    gender: 'nu',
    cccd: '079202007788',
    status: 'chua_xep_lop',
    classId: '',
    className: 'Chưa xếp lớp',
    admissionDate: '2026-09-10',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [],
    growthRecords: [],
  },
  {
    // Legacy record intentionally missing studentCode & cccd to demonstrate graceful resolution K008
    id: 'hs-106',
    schoolCode: 'demo',
    studentCode: '',
    fullName: 'Hoàng Minh Khang',
    dob: '2020-11-20',
    gender: 'nam',
    cccd: '',
    status: 'active',
    classId: 'lop-1a1',
    className: 'Lớp 1A1',
    admissionDate: '2026-09-05',
    ethnicity: 'Kinh',
    religion: 'Không',
    guardians: [],
    growthRecords: [],
  },
];

const initialState: StudentState = {
  students: mockStudents,
  selectedStudentId: null,
  filter: {
    search: '',
    classId: 'all',
    status: 'all',
    gender: 'all',
    discountFilter: 'all',
  },
  loading: false,
};

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    addStudent: (state, action: PayloadAction<Omit<Student, 'id'>>) => {
      const id = `hs-${Date.now().toString().slice(-4)}`;
      state.students.unshift({
        ...action.payload,
        id,
      });
    },
    updateStudent: (state, action: PayloadAction<Partial<Student> & { id: string }>) => {
      const idx = state.students.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.students[idx] = {
          ...state.students[idx],
          ...action.payload,
        };
      }
    },
    transferStudents: (
      state,
      action: PayloadAction<ClassTransferPayload & { targetClassName: string }>
    ) => {
      const { studentIds, targetClassId, targetClassName } = action.payload;
      state.students.forEach((student) => {
        if (studentIds.includes(student.id)) {
          student.classId = targetClassId;
          student.className = targetClassName;
          student.status = 'active';
        }
      });
    },
    addGrowthRecord: (
      state,
      action: PayloadAction<{
        studentId: string;
        record: Omit<GrowthRecord, 'id' | 'bmi' | 'bmiClassification'>;
      }>
    ) => {
      const student = state.students.find((s) => s.id === action.payload.studentId);
      if (student) {
        const { heightCm, weightKg, measuredAt, measuredBy, notes } = action.payload.record;
        const bmi = calculateBmi(heightCm, weightKg);
        const bmiClassification = classifyBmi(bmi);
        const newRecord: GrowthRecord = {
          id: `gr-${Date.now().toString().slice(-5)}`,
          measuredAt,
          heightCm,
          weightKg,
          bmi,
          bmiClassification,
          measuredBy,
          notes,
        };
        student.growthRecords.unshift(newRecord);
      }
    },
    updateStudentNotes: (
      state,
      action: PayloadAction<{ studentId: string; notes: string }>
    ) => {
      const student = state.students.find((s) => s.id === action.payload.studentId);
      if (student) {
        student.notes = action.payload.notes;
      }
    },
    updateTuitionOverride: (
      state,
      action: PayloadAction<{
        studentId: string;
        tuitionDiscountPercent?: number;
        tuitionFixedOverride?: number;
      }>
    ) => {
      const student = state.students.find((s) => s.id === action.payload.studentId);
      if (student) {
        student.tuitionDiscountPercent = action.payload.tuitionDiscountPercent;
        student.tuitionFixedOverride = action.payload.tuitionFixedOverride;
      }
    },
    updateStudentFees: (
      state,
      action: PayloadAction<{
        studentId: string;
        feeItems: StudentFeeItem[];
        feeNotes?: string;
      }>
    ) => {
      const student = state.students.find((s) => s.id === action.payload.studentId);
      if (student) {
        student.feeItems = action.payload.feeItems;
        if (action.payload.feeNotes !== undefined) {
          student.feeNotes = action.payload.feeNotes;
        }
      }
    },
    setFilter: (state, action: PayloadAction<Partial<StudentFilterState>>) => {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    selectStudent: (state, action: PayloadAction<string | null>) => {
      state.selectedStudentId = action.payload;
    },
  },
});

export const {
  setStudents,
  addStudent,
  updateStudent,
  transferStudents,
  addGrowthRecord,
  updateStudentNotes,
  updateTuitionOverride,
  updateStudentFees,
  setFilter,
  selectStudent,
} = studentSlice.actions;

export default studentSlice.reducer;
