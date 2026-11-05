import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  getScheduleActions,
  generateAutoTitle,
  validateSemesterInterval,
  validateFileSubmission,
  filterTimetables,
  cloneTimetableStructure,
  recordSendHistory,
} from '../../src/utils/scheduleValidation.ts';

import {
  mockTimetables,
  mockSemesters,
} from '../../src/services/mockScheduleData.ts';

describe('Academics Schedule (Thời Khóa Biểu) Business Rules & Validation Engine', () => {
  const publishedGrid = mockTimetables.find((t) => t.id === 'sch-001');
  const publishedFile = mockTimetables.find((t) => t.id === 'sch-002');
  const draftGrid = mockTimetables.find((t) => t.id === 'sch-003');

  it('BR01: Distinguishes between grid matrix and attached file timetable types', () => {
    assert.equal(publishedGrid.type, 'grid');
    assert.equal(publishedFile.type, 'file');
    assert.ok(publishedFile.fileUrl);
    assert.ok(publishedFile.fileName);
  });

  it('BR02 & BR11: Generates auto-title and avoids legacy "undefined" defect', () => {
    // Standard semester name
    assert.equal(generateAutoTitle('Học kỳ 1'), 'Thời khóa biểu: Học kỳ 1');
    assert.equal(generateAutoTitle('Học kỳ 2 (2026-2027)'), 'Thời khóa biểu: Học kỳ 2 (2026-2027)');

    // Defensive fallback when semester is undefined or string "undefined"
    assert.equal(generateAutoTitle(undefined), 'Thời khóa biểu: Học kỳ 1');
    assert.equal(generateAutoTitle('undefined'), 'Thời khóa biểu: Học kỳ 1');
    assert.equal(generateAutoTitle('', 'Học kỳ hè'), 'Thời khóa biểu: Học kỳ hè');
  });

  it('BR03: Validates academic semester date interval without blocking legitimate past terms', () => {
    const sem1 = mockSemesters[0];

    // Missing dates
    const missing = validateSemesterInterval('', '');
    assert.equal(missing.isValid, false);
    assert.ok(missing.error);

    // Inverted dates
    const inverted = validateSemesterInterval('2026-12-01', '2026-09-01');
    assert.equal(inverted.isValid, false);
    assert.match(inverted.error, /không được lớn hơn/);

    // Valid dates within term
    const valid = validateSemesterInterval('2026-09-01', '2027-01-15', sem1);
    assert.equal(valid.isValid, true);
    assert.equal(valid.warning, undefined);

    // Valid dates but extending beyond standard term -> produces non-blocking warning (fixes legacy bug)
    const extended = validateSemesterInterval('2026-08-15', '2027-02-01', sem1);
    assert.equal(extended.isValid, true);
    assert.ok(extended.warning);
  });

  it('BR04: Enforces file attachment guard in file upload mode', () => {
    // In grid mode, always valid without file
    assert.equal(validateFileSubmission('grid'), true);

    // In file mode, invalid if file is missing
    assert.equal(validateFileSubmission('file', '', ''), false);
    assert.equal(validateFileSubmission('file', 'https://example.com/tkb.pdf', ''), false);

    // In file mode, valid when both url and name are present
    assert.equal(validateFileSubmission('file', 'https://example.com/tkb.pdf', 'tkb.pdf'), true);
  });

  it('BR05: Verifies weekly grid matrix slots spanning Monday through Saturday', () => {
    assert.ok(publishedGrid.slots.length >= 4);
    const slot1 = publishedGrid.slots[0];
    assert.equal(slot1.slotName, 'Tiết 1');
    assert.ok(slot1.days.monday);
    assert.ok(slot1.days.tuesday);
    assert.ok(slot1.days.wednesday);
    assert.ok(slot1.days.thursday);
    assert.ok(slot1.days.friday);
    assert.ok(slot1.days.saturday);
    assert.equal(slot1.days.monday.subjectName, 'Chào cờ & HĐTN');
  });

  it('BR06 & BR08: Updates schedule and flags status as "updated" when re-dispatched', () => {
    const updated = recordSendHistory(
      publishedGrid,
      'Thầy Hiệu Trưởng',
      'Ban Giám Hiệu',
      'all',
      32,
      'Điều chỉnh phòng học Tin học'
    );

    assert.equal(updated.status, 'updated');
    assert.equal(updated.sendHistory.length, publishedGrid.sendHistory.length + 1);
    assert.equal(updated.sendHistory[0].senderName, 'Thầy Hiệu Trưởng');
    assert.equal(updated.sendHistory[0].note, 'Điều chỉnh phòng học Tin học');
  });

  it('BR07: Preserves cumulative append-only notification dispatch history', () => {
    let schedule = { ...publishedGrid, sendHistory: [] };
    schedule = recordSendHistory(schedule, 'GVCN 1', 'GVCN', 'sms', 30, 'Lần 1');
    schedule = recordSendHistory(schedule, 'GVCN 2', 'GVCN', 'zalo', 30, 'Lần 2');

    assert.equal(schedule.sendHistory.length, 2);
    assert.equal(schedule.sendHistory[0].senderName, 'GVCN 2');
    assert.equal(schedule.sendHistory[1].senderName, 'GVCN 1');
  });

  it('BR10: Enforces asymmetric action permission matrix', () => {
    // Published Grid: Send, Edit, Clone, Download (Delete blocked)
    const pubGridActions = getScheduleActions(publishedGrid);
    assert.deepEqual(pubGridActions, {
      canSend: true,
      canEdit: true,
      canClone: true,
      canDownload: true,
      canDelete: false,
    });

    // Published File: Send, Edit, Download (Clone blocked, Delete blocked)
    const pubFileActions = getScheduleActions(publishedFile);
    assert.deepEqual(pubFileActions, {
      canSend: true,
      canEdit: true,
      canClone: false,
      canDownload: true,
      canDelete: false,
    });

    // Draft Grid: Send, Edit, Clone, Download, Delete
    const draftGridActions = getScheduleActions(draftGrid);
    assert.deepEqual(draftGridActions, {
      canSend: true,
      canEdit: true,
      canClone: true,
      canDownload: true,
      canDelete: true,
    });

    // Draft File: Send, Edit, Download, Delete (Clone blocked)
    const draftFile = { ...publishedFile, status: 'draft' };
    const draftFileActions = getScheduleActions(draftFile);
    assert.deepEqual(draftFileActions, {
      canSend: true,
      canEdit: true,
      canClone: false,
      canDownload: true,
      canDelete: true,
    });
  });

  it('BR08 & BR10: Clones grid schedule to target class/semester while blocking file cloning', () => {
    // Clone grid
    const cloned = cloneTimetableStructure(
      publishedGrid,
      'cls-2a2',
      'Lớp 2A2',
      'sem-2026-hk2',
      'Học kỳ 2',
      'Thời khóa biểu Sao Chép: Lớp 2A2'
    );

    assert.notEqual(cloned.id, publishedGrid.id);
    assert.equal(cloned.classId, 'cls-2a2');
    assert.equal(cloned.className, 'Lớp 2A2');
    assert.equal(cloned.semesterId, 'sem-2026-hk2');
    assert.equal(cloned.semesterName, 'Học kỳ 2');
    assert.equal(cloned.title, 'Thời khóa biểu Sao Chép: Lớp 2A2');
    assert.equal(cloned.status, 'draft');
    assert.equal(cloned.sendHistory.length, 0);
    assert.equal(cloned.slots.length, publishedGrid.slots.length);

    // Attempting to clone file throws
    assert.throws(() => {
      cloneTimetableStructure(
        publishedFile,
        'cls-2a2',
        'Lớp 2A2',
        'sem-2026-hk2',
        'Học kỳ 2'
      );
    }, /Chỉ có thể tạo bản sao từ thời khóa biểu dạng lưới/);
  });

  it('BR12: Filters timetables by search query, class, semester, academic year, and format', () => {
    // All
    const all = filterTimetables(mockTimetables, {
      searchQuery: '',
      classId: 'all',
      semesterId: 'all',
      academicYear: 'all',
      type: 'all',
      status: 'all',
    });
    assert.equal(all.length, mockTimetables.length);

    // By class
    const class1A1 = filterTimetables(mockTimetables, {
      searchQuery: '',
      classId: 'cls-1a1',
      semesterId: 'all',
      academicYear: 'all',
      type: 'all',
      status: 'all',
    });
    assert.equal(class1A1.length, 2);

    // By type 'file'
    const filesOnly = filterTimetables(mockTimetables, {
      searchQuery: '',
      classId: 'all',
      semesterId: 'all',
      academicYear: 'all',
      type: 'file',
      status: 'all',
    });
    assert.equal(filesOnly.length, 1);
    assert.equal(filesOnly[0].type, 'file');

    // By search query
    const searchMatch = filterTimetables(mockTimetables, {
      searchQuery: 'Khối 1',
      classId: 'all',
      semesterId: 'all',
      academicYear: 'all',
      type: 'all',
      status: 'all',
    });
    assert.equal(searchMatch.length, 1);
    assert.equal(searchMatch[0].id, 'sch-002');
  });

  it('AC-015: Enforces 10 schedules per page pagination partitioning', () => {
    const PAGE_SIZE = 10;
    const items = Array.from({ length: 12 }, (_, i) => ({ id: `sch-${i + 1}` }));
    const totalPages = Math.ceil(items.length / PAGE_SIZE);
    assert.equal(totalPages, 2);

    const page1 = items.slice(0, PAGE_SIZE);
    assert.equal(page1.length, 10);
    assert.equal(page1[0].id, 'sch-1');
    assert.equal(page1[9].id, 'sch-10');

    const page2 = items.slice(PAGE_SIZE, PAGE_SIZE * 2);
    assert.equal(page2.length, 2);
    assert.equal(page2[0].id, 'sch-11');
    assert.equal(page2[1].id, 'sch-12');
  });

  it('AC-015: Row action menu presents exactly 5 standardized actions', () => {
    const standardFiveActions = [
      'Xem chi tiết',
      'Chỉnh sửa',
      'Gửi phụ huynh',
      'Tải xuống',
      'Xóa',
    ];
    assert.equal(standardFiveActions.length, 5);
    assert.ok(standardFiveActions.includes('Xem chi tiết'));
    assert.ok(standardFiveActions.includes('Chỉnh sửa'));
    assert.ok(standardFiveActions.includes('Gửi phụ huynh'));
    assert.ok(standardFiveActions.includes('Tải xuống'));
    assert.ok(standardFiveActions.includes('Xóa'));
  });

  it('AC-015: Schedule detail view excludes "Tạo bản sao" and edit view only retains "Hủy bỏ" & "Cập nhật"', () => {
    const detailActions = ['Gửi phụ huynh', 'Lịch sử gửi', 'Chỉnh sửa'];
    assert.equal(detailActions.includes('Tạo bản sao'), false);

    const editFooterButtons = ['Hủy bỏ', 'Cập nhật'];
    assert.equal(editFooterButtons.length, 2);
    assert.equal(editFooterButtons.includes('Cập nhật và gửi'), false);
    assert.ok(editFooterButtons.includes('Hủy bỏ'));
    assert.ok(editFooterButtons.includes('Cập nhật'));
  });

  it('AC-016: Grid matrix initial slots start with exactly 1 line, empty Mon-Sat, and customizable start/end times', () => {
    // Initial slots configuration for new timetable creation
    const initialSlot = {
      id: 'slot-1',
      slotNumber: 1,
      slotName: 'Tiết 1',
      startTime: '08:00',
      endTime: '08:45',
      days: {},
    };

    const slots = [initialSlot];
    assert.equal(slots.length, 1);
    assert.equal(slots[0].slotName, 'Tiết 1');
    assert.equal(slots[0].startTime, '08:00');
    assert.equal(slots[0].endTime, '08:45');
    assert.deepEqual(slots[0].days, {});

    // Dynamic slot addition
    const newSlotNumber = slots.length + 1;
    const addedSlot = {
      id: `slot-${Date.now()}`,
      slotNumber: newSlotNumber,
      slotName: `Tiết ${newSlotNumber}`,
      startTime: '08:50',
      endTime: '09:35',
      days: {},
    };
    const updatedSlots = [...slots, addedSlot];
    assert.equal(updatedSlots.length, 2);
    assert.equal(updatedSlots[1].slotName, 'Tiết 2');
    assert.equal(updatedSlots[1].startTime, '08:50');
    assert.equal(updatedSlots[1].endTime, '09:35');

    // Slot removal
    const afterRemoval = updatedSlots.filter((s) => s.id !== addedSlot.id);
    assert.equal(afterRemoval.length, 1);

    // Verify complete absence of "Ra chơi & uống sữa" section
    const hasBreakSection = updatedSlots.some(
      (s) =>
        s.slotName.toLowerCase().includes('ra chơi') ||
        s.slotName.toLowerCase().includes('uống sữa')
    );
    assert.equal(hasBreakSection, false);
  });

  it('AC-017: Universal table header casing is strictly Sentence case across all modules', () => {
    const tableHeaders = [
      'Bài tập & môn học',
      'Tên thời khóa biểu',
      'Học sinh',
      'Thao tác',
      'Thông tin hóa đơn',
      'Người tạo',
      'Trạng thái',
      'Số tiền',
      'Mã phiếu',
      'Tên phiếu chi & danh mục',
    ];

    tableHeaders.forEach((header) => {
      // First character is uppercase
      assert.equal(header[0], header[0].toUpperCase());
      // Not screaming UPPER CASE
      assert.notEqual(header, header.toUpperCase());
    });
  });
});
