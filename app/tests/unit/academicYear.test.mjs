/**
 * Unit Test Suite: School Academic Year (Năm Học)
 * Module: M5 - Nhà Trường / Năm Học
 * Standards: BR01 - BR07, K059 - K063, VR-AY-01 - VR-AY-06
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  isCurrentAcademicYear,
  validateAcademicYearForm,
  filterAcademicYears,
  sortAcademicYears,
  formatDateDisplay,
  stripVietnameseDiacritics,
  normalizeDateToYMD,
} from '../../src/utils/academicYearValidation.ts';

import academicYearReducer, {
  setSearchQuery,
  openCreateModal,
  openEditModal,
  closeModal,
  addAcademicYear,
  updateAcademicYear,
  clearToast,
} from '../../src/store/slices/academicYearSlice.ts';

import { INITIAL_ACADEMIC_YEARS } from '../../src/services/mockAcademicYearData.ts';

const mockYears = [
  {
    id: 'ay-current',
    schoolCode: 'demo',
    name: 'Năm học 2026 - 2027',
    startDate: '2026-08-15',
    endDate: '2027-05-31',
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'ay-semester-1',
    schoolCode: 'demo',
    name: 'Kỳ 1 năm học 2026 - 2027',
    startDate: '2026-08-15',
    endDate: '2027-01-15',
    createdAt: '2026-06-01T08:30:00Z',
    updatedAt: '2026-06-01T08:30:00Z',
  },
  {
    id: 'ay-past',
    schoolCode: 'demo',
    name: 'Năm học 2025 - 2026',
    startDate: '2025-08-15',
    endDate: '2026-05-31',
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2025-06-01T08:00:00Z',
  },
  {
    id: 'ay-future',
    schoolCode: 'demo',
    name: 'Năm học 2027 - 2028',
    startDate: '2027-08-15',
    endDate: '2028-05-31',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
  },
];

describe('School Academic Year (Năm Học) Test Suite', () => {

  describe('1. Automated Current Year Evaluation (BR01, K059)', () => {
    const year = { startDate: '2026-08-15', endDate: '2027-05-31' };

    test('evaluates to true when reference date is within the range', () => {
      assert.strictEqual(isCurrentAcademicYear(year, '2026-10-09'), true);
      assert.strictEqual(isCurrentAcademicYear(year, '2027-01-01'), true);
    });

    test('evaluates to true on exact boundary dates (inclusive)', () => {
      assert.strictEqual(isCurrentAcademicYear(year, '2026-08-15'), true);
      assert.strictEqual(isCurrentAcademicYear(year, '2027-05-31'), true);
    });

    test('evaluates to false when reference date is outside the range', () => {
      assert.strictEqual(isCurrentAcademicYear(year, '2026-08-14'), false);
      assert.strictEqual(isCurrentAcademicYear(year, '2027-06-01'), false);
      assert.strictEqual(isCurrentAcademicYear(year, '2025-10-09'), false);
    });

    test('handles missing or malformed dates gracefully', () => {
      assert.strictEqual(isCurrentAcademicYear({ startDate: '', endDate: '2027-05-31' }), false);
      assert.strictEqual(isCurrentAcademicYear({ startDate: '2026-08-15', endDate: '' }), false);
    });
  });

  describe('2. Minimalist 3-Field Form Validation (BR04, NH-01, VR-AY-01, VR-AY-02)', () => {
    test('rejects form when name is empty or whitespace only', () => {
      const result = validateAcademicYearForm({
        name: '   ',
        startDate: '2026-08-15',
        endDate: '2027-05-31',
      });
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.errors.name, 'Vui lòng nhập tên năm học');
    });

    test('rejects form when startDate or endDate is missing', () => {
      const resultNoStart = validateAcademicYearForm({
        name: 'Năm học 2026 - 2027',
        startDate: '',
        endDate: '2027-05-31',
      });
      assert.strictEqual(resultNoStart.isValid, false);
      assert.strictEqual(resultNoStart.errors.startDate, 'Vui lòng chọn ngày bắt đầu');

      const resultNoEnd = validateAcademicYearForm({
        name: 'Năm học 2026 - 2027',
        startDate: '2026-08-15',
        endDate: '',
      });
      assert.strictEqual(resultNoEnd.isValid, false);
      assert.strictEqual(resultNoEnd.errors.endDate, 'Vui lòng chọn ngày kết thúc');
    });

    test('rejects inverted date intervals (endDate < startDate)', () => {
      const result = validateAcademicYearForm({
        name: 'Năm học 2026 - 2027',
        startDate: '2027-05-31',
        endDate: '2026-08-15',
      });
      assert.strictEqual(result.isValid, false);
      assert.strictEqual(result.errors.endDate, 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu');
    });

    test('accepts valid 3-field submission with endDate >= startDate', () => {
      const result = validateAcademicYearForm({
        name: 'Năm học 2026 - 2027',
        startDate: '2026-08-15',
        endDate: '2027-05-31',
      });
      assert.strictEqual(result.isValid, true);
      assert.deepStrictEqual(result.errors, {});
    });

    test('accepts single-day academic milestone (endDate === startDate)', () => {
      const result = validateAcademicYearForm({
        name: 'Kỳ thi tuyển sinh đầu cấp',
        startDate: '2026-06-15',
        endDate: '2026-06-15',
      });
      assert.strictEqual(result.isValid, true);
      assert.deepStrictEqual(result.errors, {});
    });
  });

  describe('3. Flexible Free-Text Naming & Diacritic Search Filtering (BR02, BR05, K061)', () => {
    test('matches annual school years by number', () => {
      const filtered = filterAcademicYears(mockYears, '2025');
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0].id, 'ay-past');
    });

    test('matches semester sub-periods by keyword', () => {
      const filtered = filterAcademicYears(mockYears, 'Kỳ 1');
      assert.strictEqual(filtered.length, 1);
      assert.strictEqual(filtered[0].id, 'ay-semester-1');
    });

    test('filters case-insensitively and diacritic-insensitively', () => {
      const filtered = filterAcademicYears(mockYears, 'nam hoc');
      assert.strictEqual(filtered.length, 4); // All mock items match "nam hoc"
    });

    test('returns empty array when query does not match any item', () => {
      const filtered = filterAcademicYears(mockYears, '1999');
      assert.strictEqual(filtered.length, 0);
    });

    test('returns all items when query is empty or whitespace', () => {
      const filtered = filterAcademicYears(mockYears, '   ');
      assert.strictEqual(filtered.length, mockYears.length);
    });
  });

  describe('4. Display Formatting & Sorting Logic', () => {
    test('formats ISO date to DD/MM/YYYY', () => {
      assert.strictEqual(formatDateDisplay('2026-08-15'), '15/08/2026');
      assert.strictEqual(formatDateDisplay('2027-05-31'), '31/05/2027');
    });

    test('sorts current active year to the top', () => {
      const sorted = sortAcademicYears(mockYears, '2026-10-09');
      // The current years ('ay-current' and 'ay-semester-1') should be at the top
      assert.strictEqual(isCurrentAcademicYear(sorted[0], '2026-10-09'), true);
      assert.strictEqual(isCurrentAcademicYear(sorted[1], '2026-10-09'), true);
    });
  });

  describe('5. Redux State Machine (academicYearSlice)', () => {
    const initialState = {
      items: mockYears,
      searchQuery: '',
      isModalOpen: false,
      modalMode: 'create',
      editingItem: null,
      toastMessage: null,
    };

    test('setSearchQuery updates query in state', () => {
      const nextState = academicYearReducer(initialState, setSearchQuery('2026'));
      assert.strictEqual(nextState.searchQuery, '2026');
    });

    test('openCreateModal sets mode to create and opens modal', () => {
      const nextState = academicYearReducer(initialState, openCreateModal());
      assert.strictEqual(nextState.isModalOpen, true);
      assert.strictEqual(nextState.modalMode, 'create');
      assert.strictEqual(nextState.editingItem, null);
    });

    test('openEditModal sets mode to edit, assigns item, and opens modal', () => {
      const target = mockYears[0];
      const nextState = academicYearReducer(initialState, openEditModal(target));
      assert.strictEqual(nextState.isModalOpen, true);
      assert.strictEqual(nextState.modalMode, 'edit');
      assert.strictEqual(nextState.editingItem?.id, target.id);
    });

    test('closeModal resets open flag and editingItem', () => {
      const openState = { ...initialState, isModalOpen: true, editingItem: mockYears[0] };
      const nextState = academicYearReducer(openState, closeModal());
      assert.strictEqual(nextState.isModalOpen, false);
      assert.strictEqual(nextState.editingItem, null);
    });

    test('addAcademicYear inserts new item at top and closes modal', () => {
      const payload = {
        schoolCode: 'demo',
        name: 'Năm học 2028 - 2029',
        startDate: '2028-08-15',
        endDate: '2029-05-31',
      };
      const nextState = academicYearReducer(initialState, addAcademicYear(payload));
      assert.strictEqual(nextState.items.length, mockYears.length + 1);
      assert.strictEqual(nextState.items[0].name, 'Năm học 2028 - 2029');
      assert.strictEqual(nextState.isModalOpen, false);
      assert.ok(nextState.toastMessage?.includes('thành công'));
    });

    test('updateAcademicYear updates existing item in-place preserving ID', () => {
      const targetId = 'ay-past';
      const payload = {
        id: targetId,
        name: 'Năm học 2025 - 2026 (Đã hiệu chỉnh)',
        startDate: '2025-08-10',
        endDate: '2026-05-30',
      };
      const nextState = academicYearReducer(initialState, updateAcademicYear(payload));
      const updated = nextState.items.find((item) => item.id === targetId);
      assert.ok(updated);
      assert.strictEqual(updated.name, 'Năm học 2025 - 2026 (Đã hiệu chỉnh)');
      assert.strictEqual(updated.startDate, '2025-08-10');
      assert.strictEqual(nextState.isModalOpen, false);
    });
  });

  describe('6. Architectural Invariants & Permanent Delete Omission (BR03, K060, K063)', () => {
    test('AcademicYearTable component strictly omits delete buttons and trash icons', () => {
      const tableFilePath = path.resolve('src/modules/school/academic-year/AcademicYearTable.tsx');
      const tableSource = fs.readFileSync(tableFilePath, 'utf8');

      // Assert faTrash / faTrashAlt is not imported or rendered
      assert.strictEqual(tableSource.includes('faTrash'), false, 'faTrash must not be present in AcademicYearTable');
      assert.strictEqual(tableSource.includes('onDelete'), false, 'onDelete handler must not be present in AcademicYearTable');
      assert.strictEqual(tableSource.includes('delete'), false, 'delete keyword should not be used as action in AcademicYearTable');

      // Assert faEdit is present
      assert.strictEqual(tableSource.includes('faEdit'), true, 'faEdit must be present for in-place editing');
    });

    test('PortalLayout mounts Năm học in NHÀ TRƯỜNG strictly after Lịch sự kiện', () => {
      const layoutFilePath = path.resolve('src/components/layout/PortalLayout.tsx');
      const layoutSource = fs.readFileSync(layoutFilePath, 'utf8');

      const calendarIndex = layoutSource.indexOf("label: 'Lịch sự kiện'");
      const academicYearIndex = layoutSource.indexOf("label: 'Năm học'");

      assert.ok(calendarIndex !== -1, "Lịch sự kiện must exist in PortalLayout");
      assert.ok(academicYearIndex !== -1, "Năm học must exist in PortalLayout");
      assert.ok(academicYearIndex > calendarIndex, "Năm học must be placed strictly after Lịch sự kiện");
    });
  });
});
