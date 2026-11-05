/**
 * Pure Validation and Utility Engine for Settings Fee Configuration
 * Module: Cấu Hình (Module 6) | Sub-module: Học Phí (SM3)
 * Feature ID: 033-settings-fee-configuration
 */

import type {
  SInvoiceConfig,
  LatePickupTier,
  LatePickupConfig,
  ReconciliationEmailConfig,
  SchoolGroupReconciliationConfig,
  ReconciliationScheduleType,
  ReconciliationTermItem
} from '../types/settingFee.ts';

// RFC 5322 Compliant Email Regular Expression
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates whether a given string adheres to standard email formatting rules.
 */
export function validateEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates an email candidate before adding to the reconciliation recipient list.
 * Enforces RFC 5322 formatting (ERR-HP-01), case-insensitive uniqueness (ERR-HP-02), and maximum 3 emails cap.
 */
export function validateEmailCandidate(
  email: string,
  existingEmails: string[]
): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim();

  if (!trimmed) {
    return { isValid: false, error: 'Vui lòng nhập địa chỉ email' };
  }

  if (!validateEmailFormat(trimmed)) {
    return { isValid: false, error: 'Email không hợp lệ' };
  }

  const isDuplicate = existingEmails.some(
    (existing) => existing.trim().toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return { isValid: false, error: 'Email đã tồn tại trong danh sách' };
  }

  if (existingEmails.length >= 3) {
    return { isValid: false, error: 'Đã đạt số lượng tối đa 3 email đối soát' };
  }

  return { isValid: true };
}

/**
 * Validates whether a tiered bracket row can be deleted from the Late Pickup table.
 * Enforces BR13: Row 1 (baseline bracket) cannot be deleted. Deletion requires at least 2 rows.
 */
export function validateTierDeletion(
  tierIndex: number,
  currentTiers: LatePickupTier[]
): { canDelete: boolean; error?: string } {
  if (currentTiers.length <= 1) {
    return {
      canDelete: false,
      error: 'Không thể xóa khung giờ đầu tiên. Bảng phải có ít nhất 1 khung giờ.'
    };
  }

  if (tierIndex === 0 && currentTiers.length === 1) {
    return {
      canDelete: false,
      error: 'Không thể xóa khung giờ đầu tiên.'
    };
  }

  return { canDelete: true };
}

/**
 * Validates SInvoice electronic invoicing configuration payload.
 * When enabled (BR05), all 6 core fields are mandatory (*).
 */
export function validateSInvoiceConfig(
  config: SInvoiceConfig
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!config.isEnabled) {
    return { isValid: true, errors };
  }

  if (!config.taxCode || !config.taxCode.trim()) {
    errors.taxCode = 'Mã số thuế là bắt buộc';
  } else if (!/^[0-9]{10}(-[0-9]{3})?$/.test(config.taxCode.trim())) {
    errors.taxCode = 'Mã số thuế không đúng định dạng (10 hoặc 13 số)';
  }

  if (!config.accountName || !config.accountName.trim()) {
    errors.accountName = 'Tên tài khoản SInvoice là bắt buộc';
  }

  if (!config.password || !config.password.trim()) {
    errors.password = 'Mật khẩu là bắt buộc';
  } else if (config.password.trim().length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (!config.invoiceTemplate || !config.invoiceTemplate.trim()) {
    errors.invoiceTemplate = 'Mẫu hóa đơn là bắt buộc';
  }

  if (!config.invoiceType || !config.invoiceType.trim()) {
    errors.invoiceType = 'Loại hóa đơn là bắt buộc';
  }

  if (!config.invoiceSerial || !config.invoiceSerial.trim()) {
    errors.invoiceSerial = 'Ký hiệu hóa đơn là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates late pickup fixed interval rate settings.
 */
export function validateLatePickupFixed(
  intervalMinutes: number,
  amountPerHour: number
): { isValid: boolean; error?: string } {
  if (intervalMinutes < 5 || intervalMinutes > 60 || intervalMinutes % 5 !== 0) {
    return {
      isValid: false,
      error: 'Thời gian trả trễ phải từ 5 đến 60 phút và là bội số của 5'
    };
  }

  if (amountPerHour < 0 || isNaN(amountPerHour)) {
    return {
      isValid: false,
      error: 'Số tiền/học sinh/giờ phải lớn hơn hoặc bằng 0'
    };
  }

  return { isValid: true };
}

/**
 * Formats a currency number in Vietnamese Dong (VND) notation with dot separators.
 */
export function formatCurrencyVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 đ';
  }
  return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
}

/**
 * Checks if any configuration form block has unsaved changes (is dirty).
 */
export function isAnyBlockDirty(dirtyFlags: {
  invoiceNote: boolean;
  sinvoice: boolean;
  latePickupAndRefund: boolean;
  reconciliation: boolean;
  schoolGroups?: boolean;
}): boolean {
  return Boolean(
    dirtyFlags.invoiceNote ||
    dirtyFlags.sinvoice ||
    dirtyFlags.latePickupAndRefund ||
    dirtyFlags.reconciliation ||
    dirtyFlags.schoolGroups
  );
}

/**
 * Generates term items for school group reconciliation schedule.
 * CRITICAL RULE: When scheduleType is 'year' (Đối soát theo năm), returns an empty array []
 * because annual reconciliation is a single bundled package without sub-periods.
 */
export function generateTermsForSchedule(
  startDate: string,
  endDate: string,
  termCount: number,
  scheduleType: ReconciliationScheduleType
): ReconciliationTermItem[] {
  if (scheduleType === 'year' || termCount <= 1) {
    return []; // For "Đối soát theo năm", no sub-period breakdown exists!
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return [];
  }

  const totalTime = end.getTime() - start.getTime();
  const stepTime = Math.floor(totalTime / termCount);
  const terms: ReconciliationTermItem[] = [];

  for (let i = 0; i < termCount; i++) {
    const termStart = new Date(start.getTime() + i * stepTime);
    // If not first term, add 1 day to prevent overlap
    if (i > 0) {
      termStart.setDate(termStart.getDate() + 1);
    }
    const termEnd =
      i === termCount - 1
        ? new Date(end.getTime())
        : new Date(start.getTime() + (i + 1) * stepTime);

    const formatYMD = (d: Date) => d.toISOString().split('T')[0];
    const formatMonthYear = (d: Date) => `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;

    terms.push({
      id: `term-${i + 1}-${Date.now()}`,
      termName: `Kỳ ${i + 1} - ${formatMonthYear(termStart)}`,
      startDate: formatYMD(termStart),
      endDate: formatYMD(termEnd),
      isChargeable: true
    });
  }

  return terms;
}

/**
 * Validates School Group Reconciliation configuration.
 * Enforces:
 * 1. scheduleType === 'year' -> termCount === 1 and terms MUST be empty [].
 * 2. scheduleType === 'term' -> termCount >= 1.
 * 3. Valid date interval.
 * 4. Up to 3 valid emails.
 */
export function validateSchoolGroupConfig(
  config: SchoolGroupReconciliationConfig
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!config.groupName || !config.groupName.trim()) {
    errors.groupName = 'Tên nhóm trường là bắt buộc';
  }

  if (!config.serviceStartDate) {
    errors.serviceStartDate = 'Từ ngày là bắt buộc';
  }

  if (!config.serviceEndDate) {
    errors.serviceEndDate = 'Đến ngày là bắt buộc';
  }

  if (config.serviceStartDate && config.serviceEndDate) {
    const start = new Date(config.serviceStartDate);
    const end = new Date(config.serviceEndDate);
    if (start > end) {
      errors.serviceEndDate = 'Đến ngày phải sau hoặc cùng Từ ngày';
    }
  }

  if (config.scheduleType === 'year') {
    if (config.termCount !== 1) {
      errors.termCount = 'Đối soát theo năm phải có số kỳ cố định là 1';
    }
    if (config.terms && config.terms.length > 0) {
      errors.terms = 'Đối soát theo năm không có danh sách kỳ con';
    }
  } else if (config.scheduleType === 'term') {
    if (!config.termCount || config.termCount < 1) {
      errors.termCount = 'Số kỳ phải từ 1 trở lên';
    }
  }

  if (config.emails && config.emails.length > 3) {
    errors.emails = 'Tối đa 3 email nhận biên bản đối soát';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
