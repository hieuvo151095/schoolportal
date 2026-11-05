/**
 * Unit Test Suite: School Archive (Lưu Trữ)
 * Module: M5 - Nhà Trường / Lưu Trữ
 * Standards: BR01 - BR07, K064 - K068
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  stripVietnameseDiacritics,
  filterArchivedStudents,
  sortArchivedStudents,
  evaluateRestorationClass,
  formatArchiveDate,
  formatGender,
} from '../../src/utils/archiveValidation.ts';

import archiveReducer, {
  setSearchQuery,
  setArchivePeriodMonth,
  clearFilters,
  setSort,
  toggleSort,
  openStudentDetailModal,
  openStaffModal,
  openRestoreModal,
  openPurgeModal,
  closeModal,
  restoreStudent,
  purgeStudent,
  clearNotification,
} from '../../src/store/slices/archiveSlice.ts';

import {
  mockArchivedStudents,
  mockActiveClasses,
  mockStaffOperators,
} from '../../src/services/mockArchiveData.ts';

describe('School Archive (Lưu Trữ) - Pure Validation & Search Logic', () => {
  test('stripVietnameseDiacritics removes accents and normalizes case', () => {
    assert.strictEqual(stripVietnameseDiacritics('Nguyễn Hoàng Long'), 'nguyen hoang long');
    assert.strictEqual(stripVietnameseDiacritics('Đỗ Minh Thương'), 'do minh thuong');
    assert.strictEqual(stripVietnameseDiacritics('ĐẶNG QUỐC THÁI'), 'dang quoc thai');
    assert.strictEqual(stripVietnameseDiacritics(''), '');
  });

  test('filterArchivedStudents filters case-insensitively by full name', () => {
    const results = filterArchivedStudents(mockArchivedStudents, 'hoang long');
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].fullName, 'Nguyễn Hoàng Long');
  });

  test('filterArchivedStudents filters by studentCode and nickname', () => {
    const byCode = filterArchivedStudents(mockArchivedStudents, 'HS-2023-0215');
    assert.strictEqual(byCode.length, 1);
    assert.strictEqual(byCode[0].fullName, 'Trần Thị Thanh Trúc');

    const byNick = filterArchivedStudents(mockArchivedStudents, 'Bống');
    assert.strictEqual(byNick.length, 1);
    assert.strictEqual(byNick[0].fullName, 'Trần Thị Thanh Trúc');
  });

  test('filterArchivedStudents filters by archive reason and former class', () => {
    const byReason = filterArchivedStudents(mockArchivedStudents, 'quoc te');
    assert.strictEqual(byReason.length, 1);
    assert.strictEqual(byReason[0].fullName, 'Trần Thị Thanh Trúc');

    const byClass = filterArchivedStudents(mockArchivedStudents, 'Mẫu Giáo Bé 2');
    assert.strictEqual(byClass.length, 1);
    assert.strictEqual(byClass[0].fullName, 'Hoàng Khánh An');
  });

  test('filterArchivedStudents filters by archive month YYYY-MM and tolerates null dates (BR02, K067)', () => {
    const marchResults = filterArchivedStudents(mockArchivedStudents, '', '2024-03');
    assert.strictEqual(marchResults.length, 2);
    const names = marchResults.map((s) => s.fullName);
    assert.ok(names.includes('Nguyễn Hoàng Long'));
    assert.ok(names.includes('Trần Thị Thanh Trúc'));

    // Records with undefined archiveDate are gracefully omitted from specific month filter
    const aprilResults = filterArchivedStudents(mockArchivedStudents, '', '2024-04');
    assert.strictEqual(aprilResults.length, 2);
    const aprilNames = aprilResults.map((s) => s.fullName);
    assert.ok(aprilNames.includes('Hoàng Khánh An'));
    assert.ok(aprilNames.includes('Đặng Quốc Thái'));
  });

  test('sortArchivedStudents sorts by fullName in Vietnamese collation', () => {
    const ascSorted = sortArchivedStudents(mockArchivedStudents, 'fullName', 'asc');
    assert.ok(ascSorted.length > 0);
    // In Vietnamese collation, "Đặng..." or "Đỗ..." comes before "Hoàng..." or "Vũ..."
    assert.strictEqual(ascSorted[0].fullName, 'Đặng Quốc Thái');

    const descSorted = sortArchivedStudents(mockArchivedStudents, 'fullName', 'desc');
    assert.strictEqual(descSorted[0].fullName, 'Vũ Bảo Ngọc');
  });

  test('sortArchivedStudents sorts by archiveDate and sinks null/undefined dates to bottom', () => {
    const ascSorted = sortArchivedStudents(mockArchivedStudents, 'archiveDate', 'asc');
    // First element should have the oldest valid archive date
    assert.strictEqual(ascSorted[0].archiveDate, '2023-08-30');
    // Last elements should be the ones with undefined archiveDate
    const lastStudent = ascSorted[ascSorted.length - 1];
    assert.strictEqual(lastStudent.archiveDate, undefined);
  });

  test('evaluateRestorationClass maintains class continuity when class is active (K066, BR05)', () => {
    const student = mockArchivedStudents.find((s) => s.id === 'arc-001'); // formerClassId: class-mgl-1
    assert.ok(student);

    const result = evaluateRestorationClass(student, mockActiveClasses);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isClassActive, true);
    assert.strictEqual(result.restoredClassId, 'class-mgl-1');
    assert.strictEqual(result.restoredClassName, 'Mẫu Giáo Lớn 1');
    assert.strictEqual(result.warningMessage, undefined);
  });

  test('evaluateRestorationClass handles dissolved/closed classes gracefully (K066, BR05)', () => {
    const student = mockArchivedStudents.find((s) => s.id === 'arc-003'); // formerClassId: class-closed-2023
    assert.ok(student);

    const result = evaluateRestorationClass(student, mockActiveClasses);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.isClassActive, false);
    assert.strictEqual(result.restoredClassId, null);
    assert.strictEqual(result.restoredClassName, 'Chưa xếp lớp');
    assert.ok(result.warningMessage?.includes('không còn hoạt động'));
  });

  test('formatArchiveDate formats YYYY-MM-DD to DD/MM/YYYY and tolerates null/empty values', () => {
    assert.strictEqual(formatArchiveDate('2024-03-15'), '15/03/2024');
    assert.strictEqual(formatArchiveDate('2023-08-30'), '30/08/2023');
    assert.strictEqual(formatArchiveDate('15/03/2024'), '15/03/2024');
    assert.strictEqual(formatArchiveDate(undefined), '—');
    assert.strictEqual(formatArchiveDate(''), '—');
    assert.strictEqual(formatArchiveDate('   '), '—');
  });

  test('formatGender formats gender identifiers to Vietnamese strings', () => {
    assert.strictEqual(formatGender('male'), 'Nam');
    assert.strictEqual(formatGender('female'), 'Nữ');
    assert.strictEqual(formatGender('other'), 'Khác');
    assert.strictEqual(formatGender(undefined), '—');
  });
});

describe('School Archive (Lưu Trữ) - Redux Slice State Machine', () => {
  const getInitialState = () =>
    archiveReducer(undefined, { type: '@@INIT' });

  test('initial state loads mock archived students and active classes', () => {
    const state = getInitialState();
    assert.strictEqual(state.students.length, mockArchivedStudents.length);
    assert.strictEqual(state.activeClasses.length, mockActiveClasses.length);
    assert.strictEqual(state.filter.searchQuery, '');
    assert.strictEqual(state.filter.archivePeriodMonth, undefined);
    assert.strictEqual(state.activeModal, 'none');
  });

  test('search filter and month filter state mutations', () => {
    let state = getInitialState();
    state = archiveReducer(state, setSearchQuery('Bách'));
    assert.strictEqual(state.filter.searchQuery, 'Bách');

    state = archiveReducer(state, setArchivePeriodMonth('2024-03'));
    assert.strictEqual(state.filter.archivePeriodMonth, '2024-03');

    state = archiveReducer(state, clearFilters());
    assert.strictEqual(state.filter.searchQuery, '');
    assert.strictEqual(state.filter.archivePeriodMonth, undefined);
  });

  test('toggleSort switches sort direction and changes sort field', () => {
    let state = getInitialState();
    assert.strictEqual(state.sort.field, 'fullName');
    assert.strictEqual(state.sort.direction, 'asc');

    // Toggle same field -> switches direction
    state = archiveReducer(state, toggleSort('fullName'));
    assert.strictEqual(state.sort.direction, 'desc');

    // Toggle different field -> switches to new field with asc
    state = archiveReducer(state, toggleSort('archiveDate'));
    assert.strictEqual(state.sort.field, 'archiveDate');
    assert.strictEqual(state.sort.direction, 'asc');
  });

  test('modal lifecycle transitions for detail, staff, restore, and purge', () => {
    let state = getInitialState();
    const student = mockArchivedStudents[0];
    const staff = mockStaffOperators.mai;

    state = archiveReducer(state, openStudentDetailModal(student));
    assert.strictEqual(state.activeModal, 'detail');
    assert.strictEqual(state.selectedStudent?.id, student.id);

    state = archiveReducer(state, closeModal());
    assert.strictEqual(state.activeModal, 'none');
    assert.strictEqual(state.selectedStudent, null);

    state = archiveReducer(state, openStaffModal(staff));
    assert.strictEqual(state.activeModal, 'staff');
    assert.strictEqual(state.selectedStaff?.id, staff.id);

    state = archiveReducer(state, openRestoreModal(student));
    assert.strictEqual(state.activeModal, 'restore');
    assert.strictEqual(state.selectedStudent?.id, student.id);

    state = archiveReducer(state, openPurgeModal(student));
    assert.strictEqual(state.activeModal, 'purge');
    assert.strictEqual(state.selectedStudent?.id, student.id);
  });

  test('restoreStudent restores student with active class continuity and sets success notification (K066, BR05)', () => {
    let state = getInitialState();
    const initialCount = state.students.length;
    const targetStudentId = 'arc-001'; // Nguyễn Hoàng Long (active class: class-mgl-1)

    state = archiveReducer(state, restoreStudent(targetStudentId));

    assert.strictEqual(state.students.length, initialCount - 1);
    assert.strictEqual(state.students.some((s) => s.id === targetStudentId), false);
    assert.strictEqual(state.notification?.type, 'success');
    assert.ok(state.notification?.message.includes('Mẫu Giáo Lớn 1'));
  });

  test('restoreStudent restores student with inactive class as Chưa xếp lớp and sets warning notification (K066)', () => {
    let state = getInitialState();
    const initialCount = state.students.length;
    const targetStudentId = 'arc-003'; // Lê Hoàng Bách (dissolved class: class-closed-2023)

    state = archiveReducer(state, restoreStudent(targetStudentId));

    assert.strictEqual(state.students.length, initialCount - 1);
    assert.strictEqual(state.students.some((s) => s.id === targetStudentId), false);
    assert.strictEqual(state.notification?.type, 'warning');
    assert.ok(state.notification?.message.includes('Chưa xếp lớp'));
  });

  test('purgeStudent permanently purges student from archive roster (K065, BR06)', () => {
    let state = getInitialState();
    const initialCount = state.students.length;
    const targetStudentId = 'arc-002'; // Trần Thị Thanh Trúc

    state = archiveReducer(state, purgeStudent(targetStudentId));

    assert.strictEqual(state.students.length, initialCount - 1);
    assert.strictEqual(state.students.some((s) => s.id === targetStudentId), false);
    assert.strictEqual(state.notification?.type, 'success');
    assert.ok(state.notification?.message.includes('Đã xoá vĩnh viễn'));

    state = archiveReducer(state, clearNotification());
    assert.strictEqual(state.notification, null);
  });

  test('legacy records with null metadata operate flawlessly without crashing (BR02, K067)', () => {
    let state = getInitialState();
    // 'arc-004' is Pham Gia Huy (legacy record with undefined archiveDate, staff, reason, note)
    const legacyStudent = state.students.find((s) => s.id === 'arc-004');
    assert.ok(legacyStudent);
    assert.strictEqual(legacyStudent.archiveDate, undefined);
    assert.strictEqual(legacyStudent.archivedBy, undefined);
    assert.strictEqual(legacyStudent.archiveReason, undefined);

    // Detail modal open
    state = archiveReducer(state, openStudentDetailModal(legacyStudent));
    assert.strictEqual(state.activeModal, 'detail');
    assert.strictEqual(state.selectedStudent?.fullName, 'Phạm Gia Huy');

    // Purge action on legacy student
    state = archiveReducer(state, purgeStudent('arc-004'));
    assert.strictEqual(state.students.some((s) => s.id === 'arc-004'), false);
    assert.ok(state.notification?.message.includes('Phạm Gia Huy'));
  });
});

describe('School Archive (Lưu Trữ) - Sidebar Navigation & Route Verification', () => {
  test('PortalLayout.tsx mounts Lưu Trữ strictly after Năm Học (K068)', () => {
    const layoutPath = path.resolve('src/components/layout/PortalLayout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // Verify faArchive is imported
    assert.ok(layoutContent.includes('faArchive'), 'PortalLayout must import faArchive');

    // Verify ordering: academic-year appears before archive
    const academicYearIndex = layoutContent.indexOf("href: `/${schoolCode}/school/academic-year`");
    const archiveIndex = layoutContent.indexOf("href: `/${schoolCode}/school/archive`");

    assert.ok(academicYearIndex !== -1, 'PortalLayout must contain academic-year link');
    assert.ok(archiveIndex !== -1, 'PortalLayout must contain school/archive link');
    assert.ok(
      academicYearIndex < archiveIndex,
      'Lưu Trữ navigation item must be positioned strictly after Năm Học'
    );
  });

  test('Canonical page and legacy alias files exist', () => {
    const canonicalPath = path.resolve('src/pages/[schoolCode]/school/archive/index.tsx');
    const aliasPath = path.resolve('src/pages/[schoolCode]/setting/kid/archived/index.tsx');

    assert.ok(fs.existsSync(canonicalPath), 'Canonical page must exist');
    assert.ok(fs.existsSync(aliasPath), 'Legacy alias page must exist');
  });
});
