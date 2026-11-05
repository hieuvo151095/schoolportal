/**
 * Mock Data Fixtures for School Academic Year (Năm Học)
 * Module: M5 - Nhà Trường / Năm Học
 */

import type { AcademicYear } from '../types/academicYear.ts';

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2026-2027',
    schoolCode: 'demo',
    name: 'Năm học 2026 - 2027',
    startDate: '2026-08-15',
    endDate: '2027-05-31',
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'ay-2026-k1',
    schoolCode: 'demo',
    name: 'Kỳ 1 năm học 2026 - 2027',
    startDate: '2026-08-15',
    endDate: '2027-01-15',
    createdAt: '2026-06-01T08:30:00Z',
    updatedAt: '2026-06-01T08:30:00Z',
  },
  {
    id: 'ay-2026-k2',
    schoolCode: 'demo',
    name: 'Kỳ 2 năm học 2026 - 2027',
    startDate: '2027-01-16',
    endDate: '2027-05-31',
    createdAt: '2026-06-01T08:35:00Z',
    updatedAt: '2026-06-01T08:35:00Z',
  },
  {
    id: 'ay-2025-2026',
    schoolCode: 'demo',
    name: 'Năm học 2025 - 2026',
    startDate: '2025-08-15',
    endDate: '2026-05-31',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z',
  },
  {
    id: 'ay-2024-2025',
    schoolCode: 'demo',
    name: 'Năm học 2024 - 2025',
    startDate: '2024-08-15',
    endDate: '2025-05-31',
    createdAt: '2024-06-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
  },
  {
    id: 'ay-2027-2028',
    schoolCode: 'demo',
    name: 'Năm học 2027 - 2028',
    startDate: '2027-08-15',
    endDate: '2028-05-31',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },
];
