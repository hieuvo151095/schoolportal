/**
 * Mock data fixtures for Settings Feature Flags & Academic Terms
 * Feature: 049-settings-feature-flags-tinh-nang
 * Legacy: docs_legacy/operating-portal/M6-cau-hinh/SM5-tinh-nang.md
 */

import type {
  ActivityFeatureSettings,
  AcademicYearOption,
  AcademicTerm,
} from '../types/featureFlags.ts';

export const mockInitialActivitySettings: ActivityFeatureSettings = {
  allowComments: true,
  requireCommentModeration: true,
  updatedAt: '2026-09-15T08:00:00Z',
};

export const mockAcademicYears: AcademicYearOption[] = [
  {
    id: 'year-2026-2027',
    name: 'Năm học 2026 - 2027',
    startDate: '2026-09-01',
    endDate: '2027-05-31',
    isCurrent: true,
  },
  {
    id: 'year-2025-2026',
    name: 'Năm học 2025 - 2026',
    startDate: '2025-09-01',
    endDate: '2026-05-31',
    isCurrent: false,
  },
  {
    id: 'year-2024-2025',
    name: 'Năm học 2024 - 2025',
    startDate: '2024-09-01',
    endDate: '2025-05-31',
    isCurrent: false,
  },
  {
    id: 'year-2027-2028',
    name: 'Năm học 2027 - 2028',
    startDate: '2027-09-01',
    endDate: '2028-05-31',
    isCurrent: false,
  },
];

export const mockInitialTerms: AcademicTerm[] = [
  // Year 2026-2027 has 2 terms (cap reached, add term disabled)
  {
    id: 'term-2026-1',
    academicYearId: 'year-2026-2027',
    termName: 'Học kì 1',
    startDate: '2026-09-01',
    endDate: '2027-01-15',
    notes: 'Học kỳ 1 năm học 2026 - 2027',
  },
  {
    id: 'term-2026-2',
    academicYearId: 'year-2026-2027',
    termName: 'Học kì 2',
    startDate: '2027-01-16',
    endDate: '2027-05-31',
    notes: 'Học kỳ 2 năm học 2026 - 2027',
  },
  // Year 2025-2026 has 2 terms
  {
    id: 'term-2025-1',
    academicYearId: 'year-2025-2026',
    termName: 'Học kì 1',
    startDate: '2025-09-01',
    endDate: '2026-01-15',
    notes: '',
  },
  {
    id: 'term-2025-2',
    academicYearId: 'year-2025-2026',
    termName: 'Học kì 2',
    startDate: '2026-01-16',
    endDate: '2026-05-31',
    notes: '',
  },
  // Year 2024-2025 has 1 term (add term enabled)
  {
    id: 'term-2024-1',
    academicYearId: 'year-2024-2025',
    termName: 'Học kì 1',
    startDate: '2024-09-01',
    endDate: '2025-01-15',
    notes: 'Học kỳ 1 năm học 2024 - 2025',
  },
  // Year 2027-2028 has 0 terms (empty state: "Chưa có học kỳ")
];
