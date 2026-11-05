/**
 * Seed data for Tuition Exemption & Fee Discount Policies (Miễn Giảm)
 * Finance Domain - Finviet / SOHA School Operating Portal
 */

import type { DiscountPolicy, FeeItemDiscountOption, DiscountScopeType } from '../types/discount.ts';

export const ALL_24_SCHOOL_FEES: FeeItemDiscountOption[] = [
  { id: 'fee-sys-001', feeNumber: 1, code: 'HOC_PHI', name: 'Học phí chính khóa', defaultAmount: 2500000, type: 'system' },
  { id: 'fee-sys-002', feeNumber: 2, code: 'TIEN_AN', name: 'Tiền ăn bán trú', defaultAmount: 850000, type: 'system' },
  { id: 'fee-sys-003', feeNumber: 3, code: 'PHI_TRA_TRE', name: 'Phí trả học sinh trễ', defaultAmount: 40000, type: 'system' },
  { id: 'fee-cust-001', feeNumber: 4, code: 'HOC_STEAM', name: 'Học STEAM', defaultAmount: 500000, type: 'custom' },
  { id: 'fee-cust-002', feeNumber: 5, code: 'TIENG_ANH_TC', name: 'Tiếng Anh tăng cường', defaultAmount: 800000, type: 'custom' },
  { id: 'fee-cust-003', feeNumber: 6, code: 'XE_DUA_DON_THANG', name: 'Xe đưa đón', defaultAmount: 1200000, type: 'custom' },
  { id: 'fee-cust-004', feeNumber: 7, code: 'DONG_PHUC_HE', name: 'Đồng phục hè', defaultAmount: 450000, type: 'custom' },
  { id: 'fee-cust-005', feeNumber: 8, code: 'TEST_KHOAN_MOI', name: 'Test khoản mới', defaultAmount: 100000, type: 'custom' },
  { id: 'fee-cust-006', feeNumber: 9, code: 'DUA_DON_2A8', name: 'Phí đưa đón 2A8', defaultAmount: 20000, type: 'custom' },
  { id: 'fee-cust-007', feeNumber: 10, code: 'BAN_TRU_T7', name: 'Bán trú thứ 7', defaultAmount: 150000, type: 'custom' },
  { id: 'fee-cust-008', feeNumber: 11, code: 'HOC_BOI', name: 'Học bơi', defaultAmount: 600000, type: 'custom' },
  { id: 'fee-cust-009', feeNumber: 12, code: 'KY_NANG_SONG', name: 'Kỹ năng sống', defaultAmount: 350000, type: 'custom' },
  { id: 'fee-cust-010', feeNumber: 13, code: 'DONG_PHUC_THE_THAO', name: 'Đồng phục thể thao', defaultAmount: 320000, type: 'custom' },
  { id: 'fee-cust-011', feeNumber: 14, code: 'DA_NGOAI_HK1', name: 'Dã ngoại học kỳ 1', defaultAmount: 300000, type: 'custom' },
  { id: 'fee-cust-012', feeNumber: 15, code: 'CLB_CO_VUA', name: 'Câu lạc bộ Cờ vua', defaultAmount: 250000, type: 'custom' },
  { id: 'fee-cust-013', feeNumber: 16, code: 'CLB_AM_NHAC', name: 'Câu lạc bộ Âm nhạc', defaultAmount: 300000, type: 'custom' },
  { id: 'fee-cust-014', feeNumber: 17, code: 'BAO_HIEM_THAN_THE', name: 'Bảo hiểm thân thể', defaultAmount: 200000, type: 'custom' },
  { id: 'fee-cust-015', feeNumber: 18, code: 'SACH_GIAO_KHOA', name: 'Sách giáo khoa & Học liệu', defaultAmount: 550000, type: 'custom' },
  { id: 'fee-cust-016', feeNumber: 19, code: 'KHAM_SUC_KHOE', name: 'Khám sức khỏe định kỳ', defaultAmount: 120000, type: 'custom' },
  { id: 'fee-cust-017', feeNumber: 20, code: 'TRONG_TRE_SAU_GIO', name: 'Phí trông trễ sau giờ', defaultAmount: 40000, type: 'custom' },
  { id: 'fee-cust-018', feeNumber: 21, code: 'NUOC_UONG', name: 'Nước uống học đường', defaultAmount: 50000, type: 'custom' },
  { id: 'fee-cust-019', feeNumber: 22, code: 'QUY_DOAN_DOI', name: 'Quỹ hoạt động Đoàn Đội', defaultAmount: 80000, type: 'custom' },
  { id: 'fee-cust-020', feeNumber: 23, code: 'LE_PHI_CAMBRIDGE', name: 'Lệ phí thi Cambridge', defaultAmount: 1500000, type: 'custom' },
  { id: 'fee-cust-021', feeNumber: 24, code: 'THE_HOC_SINH', name: 'Phí thẻ học sinh thông minh', defaultAmount: 50000, type: 'custom' },
  { id: 'fee-cust-022', feeNumber: 25, code: 'TIEN_AN_SANG', name: 'Tiền ăn sáng', defaultAmount: 440000, type: 'custom' },
];

export const AVAILABLE_FEE_ITEMS_FOR_DISCOUNT = ALL_24_SCHOOL_FEES;

export const normalizeFeeId = (feeId: string): string => {
  if (feeId === 'fee-01') return 'fee-sys-001';
  if (feeId === 'fee-02') return 'fee-sys-002';
  if (feeId === 'fee-03') return 'fee-sys-003';
  if (feeId === 'fee-04') return 'fee-cust-003';
  if (feeId === 'fee-05') return 'fee-cust-011';
  if (feeId === 'fee-06') return 'fee-cust-002';
  if (feeId === 'fee-25' || feeId === 'fee-cust-022') return 'fee-cust-022';
  return feeId;
};

export const feeIdsMatch = (feeIdA: string, feeIdB: string): boolean => {
  if (feeIdA === feeIdB) return true;
  return normalizeFeeId(feeIdA) === normalizeFeeId(feeIdB);
};

export const CLASS_FEE_NUMBERS_MAP: Record<string, number[]> = {
  'class-10a1': [1, 2, 5, 6, 7],     // 10A1: Học phí, Tiền ăn, Tiếng Anh tăng cường, Xe đưa đón, Đồng phục hè
  'class-11a1': [1, 2, 10, 11, 15],  // 11A1: Học phí, Tiền ăn, Bán trú thứ 7, Học bơi, CLB Cờ vua
  'class-10a2': [1, 2, 4, 6, 7, 14], // 10A2: Học phí, Tiền ăn, Học STEAM, Xe đưa đón, Đồng phục hè, Dã ngoại
  'class-10a3': [1, 2, 6, 12, 14],   // 10A3: Học phí, Tiền ăn, Xe đưa đón, Kỹ năng sống, Dã ngoại
  'class-11a2': [1, 2, 25, 4, 11, 16], // 11A2: Học phí, Tiền ăn, Tiền ăn sáng, Học STEAM, Học bơi, CLB Âm nhạc
  'class-12a1': [1, 2, 4, 6, 17, 23],// 12A1: Học phí, Tiền ăn, Học STEAM, Xe đưa đón, Bảo hiểm, Lệ phí thi Cambridge
  'lop-6a1': [1, 2, 25, 6, 7],       // 6A1: Học phí, Tiền ăn, Tiền ăn sáng, Xe đưa đón, Đồng phục hè
  'lop-1a1': [1, 2, 25, 6, 7],       // 1A1: Học phí, Tiền ăn, Tiền ăn sáng, Xe đưa đón, Đồng phục hè
};

export const getApplicableFeeItemsForTargets = (
  scopeType: DiscountScopeType,
  targetIds: string[],
  allStudents = AVAILABLE_STUDENTS_FOR_DISCOUNT
): FeeItemDiscountOption[] => {
  if (!targetIds || targetIds.length === 0) {
    return [];
  }

  let classIdsToIntersect: string[] = [];
  if (scopeType === 'class') {
    classIdsToIntersect = targetIds;
  } else {
    classIdsToIntersect = targetIds
      .map((studentId) => {
        const student = allStudents.find((s) => s.id === studentId);
        return student ? student.classId : null;
      })
      .filter((cid): cid is string => Boolean(cid));
  }

  if (classIdsToIntersect.length === 0) {
    return [];
  }

  const feeSets = classIdsToIntersect.map(
    (cid) => new Set(CLASS_FEE_NUMBERS_MAP[cid] || [1, 2])
  );

  const commonFeeNumbers = Array.from(feeSets[0]).filter((num) =>
    feeSets.every((set) => set.has(num))
  );

  commonFeeNumbers.sort((a, b) => a - b);

  return ALL_24_SCHOOL_FEES.filter((fee) =>
    commonFeeNumbers.includes(fee.feeNumber)
  );
};

export const AVAILABLE_CLASSES_FOR_DISCOUNT = [
  { id: 'class-10a1', name: 'Lớp 10A1', grade: 'Khối 10', studentCount: 32 },
  { id: 'class-10a2', name: 'Lớp 10A2', grade: 'Khối 10', studentCount: 30 },
  { id: 'class-10a3', name: 'Lớp 10A3', grade: 'Khối 10', studentCount: 31 },
  { id: 'class-11a1', name: 'Lớp 11A1', grade: 'Khối 11', studentCount: 28 },
  { id: 'class-11a2', name: 'Lớp 11A2', grade: 'Khối 11', studentCount: 29 },
  { id: 'class-12a1', name: 'Lớp 12A1', grade: 'Khối 12', studentCount: 27 },
];

export const AVAILABLE_STUDENTS_FOR_DISCOUNT = [
  { id: '83', code: '9192930044', name: 'Nguyễn Trí Bình An', classId: 'class-11a1', className: 'Lớp 11A1' },
  { id: 'hs-001', code: 'HS-2026-001', name: 'Nguyễn Gia Huy', classId: 'class-10a1', className: 'Lớp 10A1' },
  { id: 'hs-002', code: 'HS-2026-002', name: 'Lê Bảo Anh', classId: 'class-10a1', className: 'Lớp 10A1' },
  { id: 'hs-003', code: 'HS-2026-003', name: 'Trần Minh Trí', classId: 'class-10a2', className: 'Lớp 10A2' },
  { id: 'hs-004', code: 'HS-2026-004', name: 'Hoàng Kim Ngân', classId: 'class-10a3', className: 'Lớp 10A3' },
  { id: 'hs-005', code: 'HS-2026-005', name: 'Đặng Thu Thảo', classId: 'class-11a1', className: 'Lớp 11A1' },
  { id: 'hs-006', code: 'HS-2026-006', name: 'Phạm Nhật Nam', classId: 'class-11a2', className: 'Lớp 11A2' },
  { id: 'hs-007', code: 'HS-2026-007', name: 'Vũ Quốc Khánh', classId: 'class-12a1', className: 'Lớp 12A1' },
  { id: 'hs-008', code: 'HS-2026-008', name: 'Đỗ Quỳnh Chi', classId: 'class-12a1', className: 'Lớp 12A1' },
];

export const INITIAL_DISCOUNT_POLICIES: DiscountPolicy[] = [
  {
    id: 'disc-001',
    schoolCode: 'demo',
    code: 'MG-2026-001',
    name: 'Học bổng tài năng học thuật 50%',
    discountType: 'percent',
    discountValue: 50,
    feeItemId: 'fee-01',
    feeItemName: 'Học phí chính khóa',
    scopeType: 'student',
    validityType: 'academic_year',
    academicYearId: 'ay-2026-2027',
    academicYearName: 'Năm học 2026 - 2027',
    reason: 'Đạt giải Nhất kỳ thi Học sinh giỏi cấp Tỉnh',
    status: 'active',
    targets: [
      {
        id: 'tgt-001',
        discountPolicyId: 'disc-001',
        targetType: 'student',
        targetId: 'hs-001',
        targetName: 'Nguyễn Gia Huy',
        targetClass: 'Lớp 10A1',
      },
      {
        id: 'tgt-002',
        discountPolicyId: 'disc-001',
        targetType: 'student',
        targetId: 'hs-002',
        targetName: 'Lê Bảo Anh',
        targetClass: 'Lớp 10A1',
      },
    ],
    createdBy: 'Kế toán trưởng',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'disc-002',
    schoolCode: 'demo',
    code: 'MG-2026-002',
    name: 'Giảm học phí diện gia đình có 2 con (20%)',
    discountType: 'percent',
    discountValue: 20,
    feeItemId: 'fee-01',
    feeItemName: 'Học phí chính khóa',
    scopeType: 'class',
    validityType: 'month_range',
    fromMonth: '2026-09',
    toMonth: '2027-05',
    reason: 'Chính sách ưu đãi gia đình nhiều con theo học tại trường',
    status: 'active',
    targets: [
      {
        id: 'tgt-003',
        discountPolicyId: 'disc-002',
        targetType: 'class',
        targetId: 'class-10a1',
        targetName: 'Lớp 10A1',
      },
      {
        id: 'tgt-004',
        discountPolicyId: 'disc-002',
        targetType: 'class',
        targetId: 'class-10a2',
        targetName: 'Lớp 10A2',
      },
      {
        id: 'tgt-005',
        discountPolicyId: 'disc-002',
        targetType: 'class',
        targetId: 'class-10a3',
        targetName: 'Lớp 10A3',
      },
    ],
    createdBy: 'Ban Giám Hiệu',
    createdAt: '2026-09-02T09:30:00.000Z',
    updatedAt: '2026-09-02T09:30:00.000Z',
  },
  {
    id: 'disc-003',
    schoolCode: 'demo',
    code: 'MG-2026-003',
    name: 'Miễn 100% tiền ăn con em diện chính sách',
    discountType: 'percent',
    discountValue: 100,
    feeItemId: 'fee-02',
    feeItemName: 'Tiền ăn bán trú',
    scopeType: 'student',
    validityType: 'academic_year',
    academicYearId: 'ay-2026-2027',
    academicYearName: 'Năm học 2026 - 2027',
    reason: 'Học sinh thuộc diện hộ nghèo có xác nhận của địa phương (NĐ 81/2021)',
    status: 'active',
    targets: [
      {
        id: 'tgt-006',
        discountPolicyId: 'disc-003',
        targetType: 'student',
        targetId: 'hs-003',
        targetName: 'Trần Minh Trí',
        targetClass: 'Lớp 10A2',
      },
    ],
    createdBy: 'Kế toán trưởng',
    createdAt: '2026-09-03T10:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z',
  },
  {
    id: 'disc-004',
    schoolCode: 'demo',
    code: 'MG-2026-004',
    name: 'Hỗ trợ xe đưa đón tuyến xa 200.000 đ',
    discountType: 'fixed_amount',
    discountValue: 200000,
    feeItemId: 'fee-04',
    feeItemName: 'Xe đưa đón',
    scopeType: 'student',
    validityType: 'academic_year',
    academicYearId: 'ay-2026-2027',
    academicYearName: 'Năm học 2026 - 2027',
    reason: 'Học sinh khu vực ngoại thành cách trường trên 15km',
    status: 'active',
    targets: [
      {
        id: 'tgt-007',
        discountPolicyId: 'disc-004',
        targetType: 'student',
        targetId: 'hs-004',
        targetName: 'Hoàng Kim Ngân',
        targetClass: 'Lớp 10A3',
      },
      {
        id: 'tgt-008',
        discountPolicyId: 'disc-004',
        targetType: 'student',
        targetId: 'hs-005',
        targetName: 'Đặng Thu Thảo',
        targetClass: 'Lớp 11A1',
      },
      {
        id: 'tgt-008b',
        discountPolicyId: 'disc-004',
        targetType: 'student',
        targetId: 'hs-001',
        targetName: 'Nguyễn Gia Huy',
        targetClass: 'Lớp 10A1',
      },
    ],
    createdBy: 'Phòng Quản Trị',
    createdAt: '2026-09-05T14:15:00.000Z',
    updatedAt: '2026-09-05T14:15:00.000Z',
  },
  {
    id: 'disc-005',
    schoolCode: 'demo',
    code: 'MG-2025-010',
    name: 'Ưu đãi đóng sớm học kỳ 1 năm học 2025 (10%)',
    discountType: 'percent',
    discountValue: 10,
    feeItemId: 'fee-01',
    feeItemName: 'Học phí chính khóa',
    scopeType: 'class',
    validityType: 'month_range',
    fromMonth: '2025-08',
    toMonth: '2025-10',
    reason: 'Chính sách khuyến khích hoàn tất học phí sớm đợt tuyển sinh năm 2025',
    status: 'expired',
    targets: [
      {
        id: 'tgt-009',
        discountPolicyId: 'disc-005',
        targetType: 'class',
        targetId: 'class-10a1',
        targetName: 'Lớp 10A1',
      },
      {
        id: 'tgt-010',
        discountPolicyId: 'disc-005',
        targetType: 'class',
        targetId: 'class-10a2',
        targetName: 'Lớp 10A2',
      },
    ],
    createdBy: 'Hội đồng Quản trị',
    createdAt: '2025-08-10T09:00:00.000Z',
    updatedAt: '2025-10-31T23:59:59.000Z',
  },
  {
    id: 'disc-006',
    schoolCode: 'demo',
    code: 'MG-2026-006',
    name: 'Giảm phí hoạt động trải nghiệm 150.000 đ',
    discountType: 'fixed_amount',
    discountValue: 150000,
    feeItemId: 'fee-05',
    feeItemName: 'Hoạt động trải nghiệm ngoại khóa',
    scopeType: 'class',
    validityType: 'month_range',
    fromMonth: '2026-09',
    toMonth: '2026-11',
    reason: 'Hỗ trợ kinh phí từ quỹ khuyến học nhà trường',
    status: 'paused',
    targets: [
      {
        id: 'tgt-011',
        discountPolicyId: 'disc-006',
        targetType: 'class',
        targetId: 'class-10a1',
        targetName: 'Lớp 10A1',
      },
    ],
    createdBy: 'Ban Giám Hiệu',
    createdAt: '2026-09-08T11:20:00.000Z',
    updatedAt: '2026-09-12T16:00:00.000Z',
  },
  {
    id: 'disc-007',
    schoolCode: 'demo',
    code: 'MG-2026-007',
    name: 'Hỗ trợ 50% tiền ăn bán trú học sinh đạt giải cấp Tỉnh',
    discountType: 'percent',
    discountValue: 50,
    feeItemId: 'fee-02',
    feeItemName: 'Tiền ăn bán trú',
    scopeType: 'student',
    validityType: 'academic_year',
    academicYearId: 'ay-2026-2027',
    academicYearName: 'Năm học 2026 - 2027',
    reason: 'Chính sách bồi dưỡng học sinh năng khiếu tham gia đội tuyển Tỉnh',
    status: 'active',
    targets: [
      {
        id: 'tgt-012',
        discountPolicyId: 'disc-007',
        targetType: 'student',
        targetId: 'hs-001',
        targetName: 'Nguyễn Gia Huy',
        targetClass: 'Lớp 10A1',
      },
    ],
    createdBy: 'Ban Giám Hiệu',
    createdAt: '2026-09-09T08:30:00.000Z',
    updatedAt: '2026-09-09T08:30:00.000Z',
  },
];

