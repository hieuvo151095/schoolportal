/**
 * Mock Data for Finance Tuition Management (Quản Lý Học Phí)
 * Module: E-011-finance-tuition-management
 */

import type {
  ClassFeeOverview,
  ClassAssignedFee,
  StudentFeeMatrixRow,
} from "../types/tuitionManagement.ts";

export const mockClassFeeOverviews: ClassFeeOverview[] = [
  {
    classId: "12A1",
    className: "12A1",
    gradeLevel: "Khối 12",
    totalStudents: 4,
    mandatoryFeesSummary: {
      hocPhi: 5000000,
      tienAn: 50000,
    },
    optionalFeesSummary: [
      { feeId: "fee_steam", feeName: "Học STEAM", amount: 500000, unit: "Tháng" },
      { feeId: "fee_an_sang", feeName: "Ăn sáng", amount: 25000, unit: "Ngày" },
      { feeId: "fee_xe_buyt", feeName: "Xe buýt", amount: 1200000, unit: "Tháng" },
      { feeId: "fee_boi_loi", feeName: "Hoạt động bơi lội", amount: 300000, unit: "Tháng" },
      { feeId: "fee_dong_phuc", feeName: "Đồng phục", amount: 450000, unit: "Bộ" },
      { feeId: "fee_ngoai_khoa", feeName: "Ngoại khóa", amount: 200000, unit: "Lần" },
      { feeId: "fee_kham_sk", feeName: "Khám sức khỏe", amount: 150000, unit: "Năm" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "12A2",
    className: "12A2",
    gradeLevel: "Khối 12",
    totalStudents: 32,
    mandatoryFeesSummary: {
      hocPhi: 5000000,
      tienAn: 50000,
    },
    optionalFeesSummary: [
      { feeId: "fee_an_sang", feeName: "Ăn sáng", amount: 25000, unit: "Ngày" },
      { feeId: "fee_dong_phuc", feeName: "Đồng phục", amount: 450000, unit: "Bộ" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "11A1",
    className: "11A1",
    gradeLevel: "Khối 11",
    totalStudents: 30,
    mandatoryFeesSummary: {
      hocPhi: 4800000,
      tienAn: 50000,
    },
    optionalFeesSummary: [
      { feeId: "fee_steam", feeName: "Học STEAM", amount: 500000, unit: "Tháng" },
      { feeId: "fee_xe_buyt", feeName: "Xe buýt", amount: 1200000, unit: "Tháng" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "11A2",
    className: "11A2",
    gradeLevel: "Khối 11",
    totalStudents: 28,
    mandatoryFeesSummary: {
      hocPhi: 4800000,
      tienAn: 50000,
    },
    optionalFeesSummary: [
      { feeId: "fee_dong_phuc", feeName: "Đồng phục", amount: 450000, unit: "Bộ" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "10A1",
    className: "10A1",
    gradeLevel: "Khối 10",
    totalStudents: 35,
    mandatoryFeesSummary: {
      hocPhi: 4500000,
      tienAn: 45000,
    },
    optionalFeesSummary: [
      { feeId: "fee_steam", feeName: "Học STEAM", amount: 500000, unit: "Tháng" },
      { feeId: "fee_boi_loi", feeName: "Hoạt động bơi lội", amount: 300000, unit: "Tháng" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "9A1",
    className: "9A1",
    gradeLevel: "Khối 9",
    totalStudents: 31,
    mandatoryFeesSummary: {
      hocPhi: 4200000,
      tienAn: 45000,
    },
    optionalFeesSummary: [
      { feeId: "fee_an_sang", feeName: "Ăn sáng", amount: 25000, unit: "Ngày" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "8A1",
    className: "8A1",
    gradeLevel: "Khối 8",
    totalStudents: 29,
    mandatoryFeesSummary: {
      hocPhi: 4000000,
      tienAn: 45000,
    },
    optionalFeesSummary: [
      { feeId: "fee_dong_phuc", feeName: "Đồng phục", amount: 450000, unit: "Bộ" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "7A1",
    className: "7A1",
    gradeLevel: "Khối 7",
    totalStudents: 33,
    mandatoryFeesSummary: {
      hocPhi: 3800000,
      tienAn: 40000,
    },
    optionalFeesSummary: [
      { feeId: "fee_steam", feeName: "Học STEAM", amount: 500000, unit: "Tháng" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "6A1",
    className: "6A1",
    gradeLevel: "Khối 6",
    totalStudents: 34,
    mandatoryFeesSummary: {
      hocPhi: 3500000,
      tienAn: 40000,
    },
    optionalFeesSummary: [
      { feeId: "fee_boi_loi", feeName: "Hoạt động bơi lội", amount: 300000, unit: "Tháng" },
      { feeId: "fee_dong_phuc", feeName: "Đồng phục", amount: 450000, unit: "Bộ" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "5A1",
    className: "5A1",
    gradeLevel: "Khối 5",
    totalStudents: 30,
    mandatoryFeesSummary: {
      hocPhi: 3200000,
      tienAn: 35000,
    },
    optionalFeesSummary: [
      { feeId: "fee_an_sang", feeName: "Ăn sáng", amount: 25000, unit: "Ngày" },
    ],
    exportElectronicInvoice: true,
  },
  {
    classId: "2A1",
    className: "2A1",
    gradeLevel: "Khối 2",
    totalStudents: 26,
    mandatoryFeesSummary: {
      hocPhi: 3000000,
      tienAn: 35000,
    },
    optionalFeesSummary: [],
    exportElectronicInvoice: false,
  },
  {
    classId: "1A1",
    className: "1A1",
    gradeLevel: "Khối 1",
    totalStudents: 25,
    mandatoryFeesSummary: {
      hocPhi: null, // Demonstration of BR07 "Chưa có học phí"
      tienAn: null, // Demonstration of BR07 "Chưa có tiền ăn"
    },
    optionalFeesSummary: [],
    exportElectronicInvoice: false,
  },
];

export const mock12A1AssignedFees: ClassAssignedFee[] = [
  {
    feeId: "fee_hoc_phi",
    feeName: "Học phí",
    unit: "Tháng",
    defaultAmount: 5000000,
    isMandatory: true,
    activeStudentCount: 4,
    exportElectronicInvoice: true,
  },
  {
    feeId: "fee_tien_an",
    feeName: "Tiền ăn",
    unit: "Ngày",
    defaultAmount: 50000,
    isMandatory: true,
    activeStudentCount: 4,
    exportElectronicInvoice: false,
  },
  {
    feeId: "fee_steam",
    feeName: "Học STEAM",
    unit: "Tháng",
    defaultAmount: 500000,
    isMandatory: false,
    activeStudentCount: 1, // Matches Fee Catalog student assignment
    exportElectronicInvoice: true,
  },
  {
    feeId: "fee_an_sang",
    feeName: "Ăn sáng",
    unit: "Ngày",
    defaultAmount: 25000,
    isMandatory: false,
    activeStudentCount: 2,
    exportElectronicInvoice: false,
  },
  {
    feeId: "fee_xe_buyt",
    feeName: "Xe buýt",
    unit: "Tháng",
    defaultAmount: 1200000,
    isMandatory: false,
    activeStudentCount: 1,
    exportElectronicInvoice: true,
  },
  {
    feeId: "fee_boi_loi",
    feeName: "Hoạt động bơi lội",
    unit: "Tháng",
    defaultAmount: 300000,
    isMandatory: false,
    activeStudentCount: 2,
    exportElectronicInvoice: false,
  },
  {
    feeId: "fee_dong_phuc",
    feeName: "Đồng phục",
    unit: "Bộ",
    defaultAmount: 450000,
    isMandatory: false,
    activeStudentCount: 3,
    exportElectronicInvoice: true,
  },
  {
    feeId: "fee_ngoai_khoa",
    feeName: "Ngoại khóa",
    unit: "Lần",
    defaultAmount: 200000,
    isMandatory: false,
    activeStudentCount: 1,
    exportElectronicInvoice: false,
  },
  {
    feeId: "fee_kham_sk",
    feeName: "Phí khám sức khỏe định kỳ",
    unit: "Năm",
    defaultAmount: 150000,
    isMandatory: false,
    activeStudentCount: 4,
    exportElectronicInvoice: true,
  },
];

export const mock12A1Students: StudentFeeMatrixRow[] = [
  {
    studentId: "STU-12A1-001",
    studentCode: "HS-2026-001",
    fullName: "Nguyễn Nguyên Thư",
    dateOfBirth: "15/05/2008",
    gender: "Nu",
    feeCells: {
      fee_hoc_phi: {
        feeId: "fee_hoc_phi",
        isEnabled: true,
        amount: 4500000, // BR04: Divergence from 5,000,000 default -> hasOverride: true
        hasOverride: true,
      },
      fee_tien_an: {
        feeId: "fee_tien_an",
        isEnabled: true,
        amount: 50000,
        hasOverride: false,
      },
      fee_steam: {
        feeId: "fee_steam",
        isEnabled: true, // Active student from Fee Catalog
        amount: 500000,
        hasOverride: false,
      },
      fee_an_sang: {
        feeId: "fee_an_sang",
        isEnabled: true,
        amount: 25000,
        hasOverride: false,
      },
      fee_xe_buyt: {
        feeId: "fee_xe_buyt",
        isEnabled: false,
        amount: 1200000,
        hasOverride: false,
      },
      fee_boi_loi: {
        feeId: "fee_boi_loi",
        isEnabled: true,
        amount: 300000,
        hasOverride: false,
      },
      fee_dong_phuc: {
        feeId: "fee_dong_phuc",
        isEnabled: true,
        amount: 450000,
        hasOverride: false,
      },
      fee_ngoai_khoa: {
        feeId: "fee_ngoai_khoa",
        isEnabled: false,
        amount: 200000,
        hasOverride: false,
      },
      fee_kham_sk: {
        feeId: "fee_kham_sk",
        isEnabled: true,
        amount: 150000,
        hasOverride: false,
      },
    },
  },
  {
    studentId: "STU-12A1-002",
    studentCode: "HS-2026-002",
    fullName: "Trần Minh Anh",
    dateOfBirth: "20/08/2008",
    gender: "Nam",
    feeCells: {
      fee_hoc_phi: {
        feeId: "fee_hoc_phi",
        isEnabled: true,
        amount: 5000000,
        hasOverride: false,
      },
      fee_tien_an: {
        feeId: "fee_tien_an",
        isEnabled: true,
        amount: 50000,
        hasOverride: false,
      },
      fee_steam: {
        feeId: "fee_steam",
        isEnabled: false,
        amount: 500000,
        hasOverride: false,
      },
      fee_an_sang: {
        feeId: "fee_an_sang",
        isEnabled: false,
        amount: 25000,
        hasOverride: false,
      },
      fee_xe_buyt: {
        feeId: "fee_xe_buyt",
        isEnabled: true,
        amount: 1200000,
        hasOverride: false,
      },
      fee_boi_loi: {
        feeId: "fee_boi_loi",
        isEnabled: false,
        amount: 300000,
        hasOverride: false,
      },
      fee_dong_phuc: {
        feeId: "fee_dong_phuc",
        isEnabled: true,
        amount: 450000,
        hasOverride: false,
      },
      fee_ngoai_khoa: {
        feeId: "fee_ngoai_khoa",
        isEnabled: true,
        amount: 200000,
        hasOverride: false,
      },
      fee_kham_sk: {
        feeId: "fee_kham_sk",
        isEnabled: true,
        amount: 150000,
        hasOverride: false,
      },
    },
  },
  {
    studentId: "STU-12A1-003",
    studentCode: "HS-2026-003",
    fullName: "Lê Hoàng Nam",
    dateOfBirth: "10/11/2008",
    gender: "Nam",
    feeCells: {
      fee_hoc_phi: {
        feeId: "fee_hoc_phi",
        isEnabled: true,
        amount: 5000000,
        hasOverride: false,
      },
      fee_tien_an: {
        feeId: "fee_tien_an",
        isEnabled: true,
        amount: 50000,
        hasOverride: false,
      },
      fee_steam: {
        feeId: "fee_steam",
        isEnabled: false,
        amount: 500000,
        hasOverride: false,
      },
      fee_an_sang: {
        feeId: "fee_an_sang",
        isEnabled: true,
        amount: 25000,
        hasOverride: false,
      },
      fee_xe_buyt: {
        feeId: "fee_xe_buyt",
        isEnabled: false,
        amount: 1200000,
        hasOverride: false,
      },
      fee_boi_loi: {
        feeId: "fee_boi_loi",
        isEnabled: true,
        amount: 300000,
        hasOverride: false,
      },
      fee_dong_phuc: {
        feeId: "fee_dong_phuc",
        isEnabled: true,
        amount: 450000,
        hasOverride: false,
      },
      fee_ngoai_khoa: {
        feeId: "fee_ngoai_khoa",
        isEnabled: false,
        amount: 200000,
        hasOverride: false,
      },
      fee_kham_sk: {
        feeId: "fee_kham_sk",
        isEnabled: true,
        amount: 150000,
        hasOverride: false,
      },
    },
  },
  {
    studentId: "STU-12A1-004",
    studentCode: "HS-2026-004",
    fullName: "Phạm Gia Bảo",
    dateOfBirth: "02/03/2008",
    gender: "Nam",
    feeCells: {
      fee_hoc_phi: {
        feeId: "fee_hoc_phi",
        isEnabled: true,
        amount: 5000000,
        hasOverride: false,
      },
      fee_tien_an: {
        feeId: "fee_tien_an",
        isEnabled: true,
        amount: 50000,
        hasOverride: false,
      },
      fee_steam: {
        feeId: "fee_steam",
        isEnabled: false,
        amount: 500000,
        hasOverride: false,
      },
      fee_an_sang: {
        feeId: "fee_an_sang",
        isEnabled: false,
        amount: 25000,
        hasOverride: false,
      },
      fee_xe_buyt: {
        feeId: "fee_xe_buyt",
        isEnabled: false,
        amount: 1200000,
        hasOverride: false,
      },
      fee_boi_loi: {
        feeId: "fee_boi_loi",
        isEnabled: false,
        amount: 300000,
        hasOverride: false,
      },
      fee_dong_phuc: {
        feeId: "fee_dong_phuc",
        isEnabled: false,
        amount: 450000,
        hasOverride: false,
      },
      fee_ngoai_khoa: {
        feeId: "fee_ngoai_khoa",
        isEnabled: false,
        amount: 200000,
        hasOverride: false,
      },
      fee_kham_sk: {
        feeId: "fee_kham_sk",
        isEnabled: true,
        amount: 150000,
        hasOverride: false,
      },
    },
  },
];

/**
 * 17 remaining fees from master catalog that are NOT yet assigned to Class 12A1 (BR06).
 */
export const mockUnassignedCatalogFees = [
  { id: "fee_ky_nang_song", name: "Kỹ năng sống", unit: "Tháng", defaultAmount: 250000, exportElectronicInvoice: false },
  { id: "fee_tieng_anh_tc", name: "Tiếng Anh tăng cường", unit: "Tháng", defaultAmount: 600000, exportElectronicInvoice: true },
  { id: "fee_ban_tru", name: "Lớp bán trú", unit: "Tháng", defaultAmount: 800000, exportElectronicInvoice: true },
  { id: "fee_hoc_pham", name: "Phí học phẩm", unit: "Năm", defaultAmount: 350000, exportElectronicInvoice: false },
  { id: "fee_robotics", name: "Khóa học Robotics", unit: "Tháng", defaultAmount: 450000, exportElectronicInvoice: true },
  { id: "fee_am_nhac", name: "Câu lạc bộ âm nhạc", unit: "Tháng", defaultAmount: 200000, exportElectronicInvoice: false },
  { id: "fee_my_thuat", name: "Câu lạc bộ mỹ thuật", unit: "Tháng", defaultAmount: 200000, exportElectronicInvoice: false },
  { id: "fee_vo_thuat", name: "Câu lạc bộ võ thuật", unit: "Tháng", defaultAmount: 250000, exportElectronicInvoice: false },
  { id: "fee_bong_ro", name: "Câu lạc bộ bóng rổ", unit: "Tháng", defaultAmount: 300000, exportElectronicInvoice: false },
  { id: "fee_bong_da", name: "Câu lạc bộ bóng đá", unit: "Tháng", defaultAmount: 300000, exportElectronicInvoice: false },
  { id: "fee_da_ngoai", name: "Chuyến dã ngoại học kỳ", unit: "Chuyến", defaultAmount: 500000, exportElectronicInvoice: true },
  { id: "fee_trai_nghiem", name: "Hoạt động trải nghiệm sáng tạo", unit: "Lần", defaultAmount: 150000, exportElectronicInvoice: false },
  { id: "fee_sua_hoc_duong", name: "Sữa học đường", unit: "Tháng", defaultAmount: 180000, exportElectronicInvoice: true },
  { id: "fee_bao_hiem_yt", name: "Bảo hiểm y tế học sinh", unit: "Năm", defaultAmount: 680000, exportElectronicInvoice: true },
  { id: "fee_tai_lieu", name: "Tài liệu học tập chuyên đề", unit: "Bộ", defaultAmount: 220000, exportElectronicInvoice: false },
  { id: "fee_co_vua", name: "Câu lạc bộ cờ vua", unit: "Tháng", defaultAmount: 200000, exportElectronicInvoice: false },
  { id: "fee_tin_hoc", name: "Tin học quốc tế MOS", unit: "Tháng", defaultAmount: 400000, exportElectronicInvoice: true },
];
