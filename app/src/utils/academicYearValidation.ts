/**
 * Pure Validation & Date Calculation Engine for School Academic Year (Năm Học)
 * Module: M5 - Nhà Trường / Năm Học
 * Business Rules: BR01 - BR07, K059 - K063
 */

import type { AcademicYear, AcademicYearFormData, AcademicYearValidationResult } from '../types/academicYear.ts';

/**
 * Normalizes a date into YYYY-MM-DD string for boundary comparison.
 */
export function normalizeDateToYMD(date?: Date | string): string {
  if (!date) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (typeof date === 'string') {
    return date.slice(0, 10);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Evaluates whether an academic year is active (BR01, K059).
 * Dynamic calendar evaluation: isCurrent = today >= startDate && today <= endDate.
 */
export function isCurrentAcademicYear(year: Pick<AcademicYear, 'startDate' | 'endDate'>, referenceDate?: Date | string): boolean {
  if (!year.startDate || !year.endDate) return false;
  const currentYMD = normalizeDateToYMD(referenceDate);
  const startYMD = normalizeDateToYMD(year.startDate);
  const endYMD = normalizeDateToYMD(year.endDate);

  return currentYMD >= startYMD && currentYMD <= endYMD;
}

/**
 * Validates the minimalist 3-field Academic Year Form (BR04, NH-01, VR-AY-01, VR-AY-02).
 */
export function validateAcademicYearForm(formData: AcademicYearFormData): AcademicYearValidationResult {
  const errors: AcademicYearValidationResult['errors'] = {};

  const trimmedName = (formData.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Vui lòng nhập tên năm học';
  }

  if (!formData.startDate) {
    errors.startDate = 'Vui lòng chọn ngày bắt đầu';
  }

  if (!formData.endDate) {
    errors.endDate = 'Vui lòng chọn ngày kết thúc';
  }

  if (formData.startDate && formData.endDate) {
    const startYMD = normalizeDateToYMD(formData.startDate);
    const endYMD = normalizeDateToYMD(formData.endDate);

    if (endYMD < startYMD) {
      errors.endDate = 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu';
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
  };
}

/**
 * Strips Vietnamese diacritics for insensitive keyword search.
 */
export function stripVietnameseDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Filters academic years by name case-insensitively and diacritic-insensitively (BR05).
 */
export function filterAcademicYears(items: AcademicYear[], query: string): AcademicYear[] {
  if (!query || !query.trim()) {
    return items;
  }
  const cleanQuery = stripVietnameseDiacritics(query.trim());

  return items.filter((item) => {
    const cleanName = stripVietnameseDiacritics(item.name || '');
    return cleanName.includes(cleanQuery);
  });
}

/**
 * Formats YYYY-MM-DD date string to Vietnamese standard DD/MM/YYYY.
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const ymd = dateStr.slice(0, 10);
  const parts = ymd.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
}

/**
 * Sorts academic years: active current year first, then descending by startDate.
 */
export function sortAcademicYears(items: AcademicYear[], referenceDate?: Date | string): AcademicYear[] {
  return [...items].sort((a, b) => {
    const isACurrent = isCurrentAcademicYear(a, referenceDate);
    const isBCurrent = isCurrentAcademicYear(b, referenceDate);

    if (isACurrent && !isBCurrent) return -1;
    if (!isACurrent && isBCurrent) return 1;

    // Both current or both not current: sort by startDate descending
    return (b.startDate || '').localeCompare(a.startDate || '');
  });
}
