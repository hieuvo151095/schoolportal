/**
 * TypeScript Data Contracts for Settings Fee Configuration (Cấu Hình — Học Phí)
 * Module: Cấu Hình (Module 6) | Sub-module: Học Phí (SM3)
 * Feature ID: 033-settings-fee-configuration
 */

export interface InvoiceNoteConfig {
  note: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface SepayConfig {
  apiSecretToken: string;
  webhookUrl: string;
  status: 'connected' | 'disconnected' | 'demo';
  lastSyncAt: string;
}

export interface SepayTransaction {
  id: string;
  paymentDate: string;
  invoiceNumber: string;
  studentName: string;
  className: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  transactionCode: string;
}

export interface SInvoiceConfig {
  isEnabled: boolean;
  taxCode: string;
  accountName: string;
  password: string; // Strictly masked in UI (type="password")
  invoiceTemplate: string;
  invoiceType: string;
  invoiceSerial: string;
  autoCreateInvoice: boolean;
  splitInvoice: boolean;
  updatedAt: string;
}

export interface LatePickupTier {
  id: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  amount: number;    // Integer VND
}

export type LatePickupCalculationMode = 'fixed' | 'tiered';

export interface LatePickupConfig {
  isEnabled: boolean;
  calculationMode: LatePickupCalculationMode;
  fixedIntervalMinutes: number; // 5 to 60, step 5 (13 choices)
  fixedAmountPerHour: number;   // Integer VND
  tiers: LatePickupTier[];      // List of tiers; row 1 non-deletable, trash shown when >= 2 rows
}

export interface SchoolOperatingHour {
  dayOfWeek: number;    // 1: Thứ 2, ..., 6: Thứ 7
  dayName: string;      // Thứ 2, Thứ 3, ..., Thứ 7
  morningStart: string; // HH:mm
  morningEnd: string;   // HH:mm
  afternoonStart: string; // HH:mm
  afternoonEnd: string;   // HH:mm
  isOpen: boolean;
}

export interface NationalHolidayItem {
  id: string;
  name: string;
  lawBasis: string;
  startDate: string;
  endDate: string;
  dayCount: number;
  isActive: boolean;
  isCustom?: boolean;
  notes?: string;
}

export interface RefundableFeeConfigItem {
  feeId: string;
  code: string;
  name: string;
  unit: string; // Must be 'ngày' or 'ngay'
  defaultAmount?: number;
  isDefault?: boolean; // true for default 'Tiền ăn' (cannot be deleted)
  holidayRatePercent?: number; // Legacy/optional
  excusedRatePercent: number; // Tỷ lệ hoàn khi nghỉ có phép (%)
  unexcusedRatePercent: number; // Tỷ lệ hoàn khi nghỉ không phép (%)
}

export interface MealRefundRates {
  mainMealRatePercent: number;    // % hoàn Tiền ăn (bán trú / trưa), e.g., 50
  breakfastRatePercent: number;   // % hoàn Tiền ăn sáng, e.g., 70
}

export interface MealRefundConfig {
  isEnabled: boolean;
  refundableFees?: RefundableFeeConfigItem[]; // Dynamic list of refundable fee items with unit 'ngày'
  rates: MealRefundRates; // Excused rates (alias / backward-compatibility)
  excusedRates?: MealRefundRates; // Nghỉ có phép (default 50% / 70%)
  unexcusedRates?: MealRefundRates; // Nghỉ không phép (default 0% / 0%)
  holidayRates?: MealRefundRates; // Legacy/optional
  holidays?: NationalHolidayItem[]; // List of Vietnam statutory & school holidays
  advanceNoticeHours: number; // 0 to 100 hours combobox
  operatingHoursReference: SchoolOperatingHour[]; // Read-only reference from SM1-truong
  holidayRefundRatePercent?: number; // Legacy compat
}

export interface StudentAbsenceBreakdown {
  studentId: string;
  studentName: string;
  className: string;
  month: string; // e.g. "2026-09"
  selfAbsenceDays: number; // Days absent due to parent leave request or attendance mark
  excusedAbsenceDays?: number; // Days of excused absence (nghỉ có phép)
  unexcusedAbsenceDays?: number; // Days of unexcused absence (nghỉ không phép)
  schoolHolidayDays?: number; // Legacy/optional
  selfAbsenceDates: string[];
  excusedDates?: string[];
  unexcusedDates?: string[];
  schoolHolidayDates?: string[];
}

export interface MealFeeDailyRates {
  mainMealUnitPrice: number;  // e.g. 40,000 VND / day
  breakfastUnitPrice: number; // e.g. 20,000 VND / day
}

export interface MealRefundCalculationItem {
  category: 'tien_an' | 'tien_an_sang' | string;
  feeId?: string;
  feeCode?: string;
  name: string;
  dailyUnitPrice: number;
  selfAbsenceDays: number;
  selfAbsenceRatePercent: number;
  selfRefundAmount: number; // selfAbsenceDays * dailyUnitPrice * (selfAbsenceRatePercent / 100)
  excusedDays?: number;
  excusedRatePercent?: number;
  excusedRefundAmount?: number;
  unexcusedDays?: number;
  unexcusedRatePercent?: number;
  unexcusedRefundAmount?: number;
  schoolHolidayDays?: number;
  schoolHolidayRatePercent?: number;
  schoolRefundAmount?: number;
  totalRefundAmount: number; // Equals selfRefundAmount (strictly student self-absences)
  explanation: string;
}

export interface StudentMealRefundSummary {
  studentId: string;
  studentName: string;
  className: string;
  billingMonth: string; // Target billing month e.g. "2026-10"
  reconciledMonth: string; // Month whose absences were calculated e.g. "2026-09"
  items: MealRefundCalculationItem[];
  totalMealRefund: number;
  breakdownDescription: string;
}

export interface LatePickupAndRefundConfig {
  latePickup: LatePickupConfig;
  mealRefund: MealRefundConfig;
  updatedAt: string;
}

export interface ReconciliationEmailConfig {
  emails: string[]; // Maximum 3 emails
  updatedAt: string;
}

export type ReconciliationUnit = 'group' | 'school'; // Theo nhóm trường (cả pháp nhân) vs Theo từng trường (mỗi chi nhánh)
export type ReconciliationScheduleType = 'year' | 'term'; // 1. Đối soát theo năm vs 2. Đối soát theo kỳ

export interface ReconciliationTermItem {
  id: string;
  termName: string; // e.g. "Kỳ 1 - Tháng 9/2026"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isChargeable: boolean; // Thu phí (BR05)
}

export interface ReconciliationThresholdConfig {
  minActiveMonths: number; // Ngưỡng thu (tháng) - default 1
  roundingDaysThreshold: number; // Ngày dư làm tròn lên 1 tháng (lần đầu) - default 15
}

export interface SchoolGroupReconciliationConfig {
  id: string;
  groupCode: string; // e.g. "UATTEST2"
  groupName: string; // e.g. "UATTest2"
  branchCount: number; // e.g. 0
  reconciliationUnit: ReconciliationUnit; // 'group' | 'school'
  emails: string[]; // max 3 emails
  scheduleType: ReconciliationScheduleType; // 'year' | 'term'
  serviceStartDate: string; // e.g. "2026-09-05"
  serviceEndDate: string; // e.g. "2027-05-25"
  termCount: number; // e.g. 1
  terms: ReconciliationTermItem[]; // MUST be empty [] when scheduleType === 'year'
  threshold: ReconciliationThresholdConfig;
  updatedAt?: string;
  updatedBy?: string;
}

export interface SettingFeeState {
  invoiceNote: InvoiceNoteConfig;
  sepay: SepayConfig;
  sinvoice: SInvoiceConfig;
  latePickupAndRefund: LatePickupAndRefundConfig;
  reconciliation: ReconciliationEmailConfig;
  schoolGroups: SchoolGroupReconciliationConfig[];
  selectedGroup: SchoolGroupReconciliationConfig | null;
  isGroupModalOpen: boolean;
  draft: {
    invoiceNote: InvoiceNoteConfig;
    sinvoice: SInvoiceConfig;
    latePickupAndRefund: LatePickupAndRefundConfig;
    reconciliation: ReconciliationEmailConfig;
    schoolGroups: SchoolGroupReconciliationConfig[];
    activeGroupDraft: SchoolGroupReconciliationConfig | null;
  };
  dirtyFlags: {
    invoiceNote: boolean;
    sinvoice: boolean;
    latePickupAndRefund: boolean;
    reconciliation: boolean;
    schoolGroups: boolean;
  };
  transactions: SepayTransaction[];
  isSaving: boolean;
  saveError: string | null;
}

export interface SettingFeeFormDirtyState {
  hasUnsavedChanges: boolean;
  dirtyBlocks: Array<'invoiceNote' | 'sinvoice' | 'latePickupAndRefund' | 'reconciliation' | 'schoolGroups'>;
}
