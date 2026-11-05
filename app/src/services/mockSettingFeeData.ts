import type {
  InvoiceNoteConfig,
  SepayConfig,
  SepayTransaction,
  SInvoiceConfig,
  LatePickupAndRefundConfig,
  ReconciliationEmailConfig,
  SchoolOperatingHour,
  SchoolGroupReconciliationConfig,
  NationalHolidayItem
} from '../types/settingFee.ts';

export const mockNationalHolidays: NationalHolidayItem[] = [
  {
    id: 'hol-01',
    name: 'Ngày Quốc Khánh (02/09)',
    lawBasis: 'Điều 112 Bộ luật Lao động 2019',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    dayCount: 2,
    isActive: true,
    isCustom: false,
    notes: '02 ngày (ngày 02/09 và 01 ngày liền kề trước)'
  },
  {
    id: 'hol-02',
    name: 'Tết Dương Lịch',
    lawBasis: 'Điều 112 Bộ luật Lao động 2019',
    startDate: '2027-01-01',
    endDate: '2027-01-01',
    dayCount: 1,
    isActive: true,
    isCustom: false,
    notes: '01 ngày (01/01 Dương lịch)'
  },
  {
    id: 'hol-03',
    name: 'Tết Nguyên Đán (Tết Âm Lịch)',
    lawBasis: 'Điều 112 Bộ luật Lao động 2019',
    startDate: '2027-02-06',
    endDate: '2027-02-14',
    dayCount: 9,
    isActive: true,
    isCustom: false,
    notes: 'Lịch nghỉ Tết Nguyên Đán năm học 2026-2027'
  },
  {
    id: 'hol-04',
    name: 'Giỗ Tổ Hùng Vương (10/03 ÂL)',
    lawBasis: 'Điều 112 Bộ luật Lao động 2019',
    startDate: '2027-04-16',
    endDate: '2027-04-16',
    dayCount: 1,
    isActive: true,
    isCustom: false,
    notes: '01 ngày (ngày 10 tháng 3 Âm lịch)'
  },
  {
    id: 'hol-05',
    name: 'Ngày Chiến Thắng 30/04 & Quốc Tế Lao Động 01/05',
    lawBasis: 'Điều 112 Bộ luật Lao động 2019',
    startDate: '2027-04-30',
    endDate: '2027-05-01',
    dayCount: 2,
    isActive: true,
    isCustom: false,
    notes: '02 ngày (30/04 và 01/05)'
  }
];

export const mockOperatingHours: SchoolOperatingHour[] = [
  {
    dayOfWeek: 1,
    dayName: 'Thứ 2',
    morningStart: '07:30',
    morningEnd: '11:30',
    afternoonStart: '13:30',
    afternoonEnd: '17:00',
    isOpen: true
  },
  {
    dayOfWeek: 2,
    dayName: 'Thứ 3',
    morningStart: '07:30',
    morningEnd: '11:30',
    afternoonStart: '13:30',
    afternoonEnd: '17:00',
    isOpen: true
  },
  {
    dayOfWeek: 3,
    dayName: 'Thứ 4',
    morningStart: '07:30',
    morningEnd: '11:30',
    afternoonStart: '13:30',
    afternoonEnd: '17:00',
    isOpen: true
  },
  {
    dayOfWeek: 4,
    dayName: 'Thứ 5',
    morningStart: '07:30',
    morningEnd: '11:30',
    afternoonStart: '13:30',
    afternoonEnd: '17:00',
    isOpen: true
  },
  {
    dayOfWeek: 5,
    dayName: 'Thứ 6',
    morningStart: '07:30',
    morningEnd: '11:30',
    afternoonStart: '13:30',
    afternoonEnd: '17:00',
    isOpen: true
  },
  {
    dayOfWeek: 6,
    dayName: 'Thứ 7',
    morningStart: '08:00',
    morningEnd: '11:30',
    afternoonStart: '13:30',
    afternoonEnd: '16:00',
    isOpen: true
  }
];

export const initialInvoiceNote: InvoiceNoteConfig = {
  note: 'Phụ huynh vui lòng thanh toán học phí trước ngày 10 hàng tháng. Mọi thắc mắc xin liên hệ văn phòng kế toán qua hotline: 024.7300.6868.',
  updatedAt: '2026-09-15 08:30:00',
  updatedBy: 'Nguyễn Thu Trang (Kế toán trưởng)'
};

export const initialSepayConfig: SepayConfig = {
  apiSecretToken: 'sepay_sec_9938a1b2c3d4e5f6g7h8i9j0',
  webhookUrl: 'https://api.ecoschool.edu.vn/demo/api/1.0/webhook/sepay/pay-in',
  status: 'connected',
  lastSyncAt: '2026-09-29 10:15:00'
};

export const mockSepayTransactions: SepayTransaction[] = [
  {
    id: 'TX-SEP-001',
    paymentDate: '2026-09-29 09:42:15',
    invoiceNumber: 'HD-2026-09-0012',
    studentName: 'Nguyễn Gia Hân',
    className: 'Lớp 1A1',
    amount: 4500000,
    status: 'success',
    transactionCode: 'MB-9923841'
  },
  {
    id: 'TX-SEP-002',
    paymentDate: '2026-09-29 08:15:20',
    invoiceNumber: 'HD-2026-09-0045',
    studentName: 'Trần Bảo Nam',
    className: 'Lớp 1A1',
    amount: 5200000,
    status: 'success',
    transactionCode: 'VCB-8837192'
  },
  {
    id: 'TX-SEP-003',
    paymentDate: '2026-09-28 16:30:11',
    invoiceNumber: 'HD-2026-09-0089',
    studentName: 'Lê Hoàng Yến',
    className: 'Lớp 2A2',
    amount: 4800000,
    status: 'success',
    transactionCode: 'TCB-5542109'
  },
  {
    id: 'TX-SEP-004',
    paymentDate: '2026-09-28 14:05:44',
    invoiceNumber: 'HD-2026-09-0102',
    studentName: 'Phạm Minh Khang',
    className: 'Lớp 3A1',
    amount: 3900000,
    status: 'pending',
    transactionCode: 'ACB-1129384'
  },
  {
    id: 'TX-SEP-005',
    paymentDate: '2026-09-27 11:20:00',
    invoiceNumber: 'HD-2026-09-0034',
    studentName: 'Vũ Đức Duy',
    className: 'Lớp 1A2',
    amount: 5100000,
    status: 'failed',
    transactionCode: 'BIDV-7738291'
  },
  {
    id: 'TX-SEP-006',
    paymentDate: '2026-09-26 10:11:32',
    invoiceNumber: 'HD-2026-09-0056',
    studentName: 'Hoàng Thùy Linh',
    className: 'Lớp 4A1',
    amount: 4750000,
    status: 'success',
    transactionCode: 'MB-1029384'
  }
];

export const initialSInvoiceConfig: SInvoiceConfig = {
  isEnabled: true,
  taxCode: '0108998877',
  accountName: 'ECO_SCHOOL_HN',
  password: 'encrypted_sinvoice_key_2026',
  invoiceTemplate: '1/001',
  invoiceType: 'C26TAA',
  invoiceSerial: 'AA/26E',
  autoCreateInvoice: true,
  splitInvoice: false,
  updatedAt: '2026-09-15 09:00:00'
};

export const initialLatePickupAndRefund: LatePickupAndRefundConfig = {
  latePickup: {
    isEnabled: true,
    calculationMode: 'fixed',
    fixedIntervalMinutes: 30,
    fixedAmountPerHour: 50000,
    tiers: [
      {
        id: 'tier-1',
        startTime: '17:00',
        endTime: '17:30',
        amount: 30000
      },
      {
        id: 'tier-2',
        startTime: '17:30',
        endTime: '18:00',
        amount: 50000
      },
      {
        id: 'tier-3',
        startTime: '18:00',
        endTime: '19:00',
        amount: 80000
      }
    ]
  },
  mealRefund: {
    isEnabled: true,
    refundableFees: [
      {
        feeId: 'fee-sys-002',
        code: 'TIEN_AN',
        name: 'Tiền ăn (bán trú / trưa)',
        unit: 'ngày',
        defaultAmount: 40000,
        isDefault: true,
        excusedRatePercent: 50,
        unexcusedRatePercent: 0
      },
      {
        feeId: 'fee-cust-006',
        code: 'DUA_DON_2A8',
        name: 'Phí đưa đón 2A8',
        unit: 'ngày',
        defaultAmount: 20000,
        isDefault: false,
        excusedRatePercent: 50,
        unexcusedRatePercent: 0
      }
    ],
    rates: {
      mainMealRatePercent: 50,
      breakfastRatePercent: 70
    },
    excusedRates: {
      mainMealRatePercent: 50,
      breakfastRatePercent: 70
    },
    unexcusedRates: {
      mainMealRatePercent: 0,
      breakfastRatePercent: 0
    },
    holidays: mockNationalHolidays,
    advanceNoticeHours: 24,
    operatingHoursReference: mockOperatingHours
  },
  updatedAt: '2026-09-18 10:00:00'
};

export const initialReconciliation: ReconciliationEmailConfig = {
  emails: ['ketoan.ecoschool@gmail.com', 'hieutruong.ecoschool@edu.vn'],
  updatedAt: '2026-09-18 14:00:00'
};

export const mockSchoolGroupReconciliations: SchoolGroupReconciliationConfig[] = [
  {
    id: 'group-uattest2',
    groupCode: 'UATTEST2',
    groupName: 'UATTest2',
    branchCount: 0,
    reconciliationUnit: 'group',
    emails: ['hieu.vo1@finviet.com.vn'],
    scheduleType: 'year', // 1. Đối soát theo năm
    serviceStartDate: '2026-09-05',
    serviceEndDate: '2027-05-25',
    termCount: 1,
    terms: [], // EMPTY: No sub-periods in red frame for "Đối soát theo năm"
    threshold: {
      minActiveMonths: 1,
      roundingDaysThreshold: 15
    },
    updatedAt: '2026-09-29 15:30:00',
    updatedBy: 'Võ Trung Hiếu (Quản trị hệ thống)'
  },
  {
    id: 'group-hethong',
    groupCode: 'nhomtruonghethong',
    groupName: 'Hệ thống Trường Newton',
    branchCount: 3,
    reconciliationUnit: 'group',
    emails: ['admin@newton.edu.vn', 'ketoan@newton.edu.vn'],
    scheduleType: 'year',
    serviceStartDate: '2026-08-01',
    serviceEndDate: '2027-05-31',
    termCount: 1,
    terms: [], // EMPTY
    threshold: {
      minActiveMonths: 1,
      roundingDaysThreshold: 15
    },
    updatedAt: '2026-09-20 11:00:00',
    updatedBy: 'Ban Giám Hiệu Newton'
  },
  {
    id: 'group-tuantest1',
    groupCode: 'Tuantest1',
    groupName: 'Tuantest1',
    branchCount: 0,
    reconciliationUnit: 'group',
    emails: ['tuan.test@ecoschool.edu.vn'],
    scheduleType: 'year',
    serviceStartDate: '2026-08-01',
    serviceEndDate: '2027-05-31',
    termCount: 1,
    terms: [], // EMPTY
    threshold: {
      minActiveMonths: 1,
      roundingDaysThreshold: 15
    },
    updatedAt: '2026-09-18 10:20:00'
  },
  {
    id: 'group-thuanthoi',
    groupCode: 'truongthuanthoi',
    groupName: 'Trường liên cấp Thuận Thời',
    branchCount: 0,
    reconciliationUnit: 'group',
    emails: ['banquantri@thuanthoi.edu.vn'],
    scheduleType: 'year',
    serviceStartDate: '2026-08-01',
    serviceEndDate: '2027-05-31',
    termCount: 1,
    terms: [], // EMPTY
    threshold: {
      minActiveMonths: 1,
      roundingDaysThreshold: 15
    },
    updatedAt: '2026-09-15 08:45:00'
  }
];
