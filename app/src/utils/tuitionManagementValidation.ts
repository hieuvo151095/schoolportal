/**
 * Business Rules and Validation Engine for Tuition Management (Quản Lý Học Phí)
 * Module: E-011-finance-tuition-management
 * Legacy Reference: docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md
 */

import type {
  ClassFeeOverview,
  StudentFeeMatrixRow,
  BatchUpdateFeeInput,
} from "../types/tuitionManagement.ts";
import type { FeeItem } from "../types/schoolFee.ts";

/**
 * Formats a currency number with Vietnamese thousands dot separators.
 */
export function formatFeeAmount(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "—";
  }
  return new Intl.NumberFormat("vi-VN").format(amount);
}

/**
 * BR04: In-Cell Override Divergence Detection
 * Checks if a student's assigned amount differs from the class default fee.
 * Only returns true if the student amount is non-null and strictly differs numerically.
 */
export function hasPriceDivergence(
  studentAmount: number | null | undefined,
  defaultAmount: number
): boolean {
  if (studentAmount === null || studentAmount === undefined) {
    return false;
  }
  return Number(studentAmount) !== Number(defaultAmount);
}

/**
 * BR04: Generates green default fee hint string
 * e.g. "Phí mặc định: 5.000.000 Đ" or "Phí mặc định: 50.000 Đ/Ngày"
 */
export function getDefaultFeeHint(defaultAmount: number, unit?: string): string {
  const formatted = formatFeeAmount(defaultAmount);
  const unitSuffix = unit ? ` Đ/${unit}` : " Đ";
  return `Phí mặc định: ${formatted}${unitSuffix}`;
}

/**
 * BR06: Deduplicates master catalog fees against class assigned fees.
 * Modal "Thêm khoản phí" strictly lists only fees from the master Fee Catalog
 * that are not yet assigned to the class.
 */
export function getAvailableFeesForClass<T extends { id: string }>(
  allCatalogFees: T[],
  assignedFeeIds: string[]
): T[] {
  if (!allCatalogFees) return [];
  if (!assignedFeeIds || assignedFeeIds.length === 0) return [...allCatalogFees];
  return allCatalogFees.filter((fee) => !assignedFeeIds.includes(fee.id));
}

/**
 * BR03: Computes the active student count for an optional fee column.
 * Returned count is displayed in column header: `(N Học sinh)`.
 */
export function computeActiveStudentsCount(
  rows: StudentFeeMatrixRow[],
  feeId: string
): number {
  if (!rows || rows.length === 0) return 0;
  return rows.filter((row) => row.feeCells[feeId]?.isEnabled === true).length;
}

/**
 * BR05: Validates batch fee update input.
 * Explicit note: "khoản phí sửa đổi chỉ được áp dụng cho những học sinh được gắn thẻ".
 * Action is disabled if not applyToAll and no students are selected.
 */
export function validateBatchUpdate(input: BatchUpdateFeeInput): {
  isValid: boolean;
  error?: string;
} {
  if (input.newAmount === null || input.newAmount === undefined || isNaN(input.newAmount)) {
    return { isValid: false, error: "Vui lòng nhập số tiền hợp lệ." };
  }
  if (input.newAmount < 0) {
    return { isValid: false, error: "Số tiền không được âm." };
  }
  if (!input.applyToAll && (!input.selectedStudentIds || input.selectedStudentIds.length === 0)) {
    return {
      isValid: false,
      error: "Vui lòng chọn ít nhất một học sinh để áp dụng số tiền mới.",
    };
  }
  return { isValid: true };
}

/**
 * BR01: Filters class fee overviews by search query and grade level.
 */
export function filterClassOverviews(
  classes: ClassFeeOverview[],
  query: string,
  gradeLevel: string
): ClassFeeOverview[] {
  if (!classes) return [];
  const normalizedQuery = (query || "").trim().toLowerCase();
  const normalizedGrade = (gradeLevel || "all").trim().toLowerCase();

  return classes.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      item.className.toLowerCase().includes(normalizedQuery) ||
      item.gradeLevel.toLowerCase().includes(normalizedQuery);

    const matchesGrade =
      normalizedGrade === "all" ||
      item.gradeLevel.toLowerCase() === normalizedGrade;

    return matchesQuery && matchesGrade;
  });
}
