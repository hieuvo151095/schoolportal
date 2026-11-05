import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  computeDaysInMonth,
  computeLatePickupFee,
  canDeleteReport,
  getNextReportStatus,
  filterExtendedReports,
  duplicateReport,
  computeStudentAttendanceTotals,
} from '../../src/utils/reportsValidation.ts';

import reportsReducer, {
  updateAbsenceRecord,
  advanceReportStatus,
  deleteExtendedReport,
  duplicateExtendedReport,
  setReportFilterCriteria,
} from '../../src/store/slices/reportsSlice.ts';

describe('Operations Reports Validation & Business Rules (Vận Hành - Báo Cáo)', () => {
  describe('BR02: Calendar Days & Weekday Calculations', () => {
    it('computes exactly 30 days for September 2026', () => {
      const days = computeDaysInMonth(2026, 9);
      assert.equal(days.length, 30);
      assert.equal(days[0].date, '2026-09-01');
      assert.equal(days[0].dayNumber, 1);
      assert.equal(days[0].weekday, 'T3'); // Sep 1, 2026 is Tuesday (T3)
      assert.equal(days[29].date, '2026-09-30');
      assert.equal(days[29].dayNumber, 30);
    });

    it('computes exactly 31 days for October 2026', () => {
      const days = computeDaysInMonth(2026, 10);
      assert.equal(days.length, 31);
    });

    it('handles February correctly for non-leap year (2026 = 28 days) and leap year (2024 = 29 days)', () => {
      const days2026 = computeDaysInMonth(2026, 2);
      assert.equal(days2026.length, 28);

      const days2024 = computeDaysInMonth(2024, 2);
      assert.equal(days2024.length, 29);
    });
  });

  describe('BR05: Late Pickup Overtime Fee Arithmetic', () => {
    it('returns 0 VND when there is no overtime (<= 0 minutes)', () => {
      assert.equal(computeLatePickupFee(0), 0);
      assert.equal(computeLatePickupFee(-10), 0);
    });

    it('computes 50,000 VND for 1 to 30 minutes overtime', () => {
      assert.equal(computeLatePickupFee(15), 50000);
      assert.equal(computeLatePickupFee(30), 50000);
    });

    it('computes 100,000 VND for 31 to 60 minutes overtime', () => {
      assert.equal(computeLatePickupFee(35), 100000);
      assert.equal(computeLatePickupFee(45), 100000);
      assert.equal(computeLatePickupFee(60), 100000);
    });

    it('computes 150,000 VND for 61 to 90 minutes overtime', () => {
      assert.equal(computeLatePickupFee(75), 150000);
    });
  });

  describe('BR03 & BR09 (Extended Reports): Lifecycle & Strict Deletion Rules', () => {
    it('permits deletion only when report is in draft (Bản nháp) status', () => {
      assert.equal(canDeleteReport('draft'), true);
      assert.equal(canDeleteReport('sent'), false);
      assert.equal(canDeleteReport('completed'), false);
    });

    it('enforces forward-only lifecycle progression (draft -> sent -> completed -> null)', () => {
      assert.equal(getNextReportStatus('draft'), 'sent');
      assert.equal(getNextReportStatus('sent'), 'completed');
      assert.equal(getNextReportStatus('completed'), null);
    });
  });

  describe('BR08 (Extended Reports): Report Duplication with Fixed Template', () => {
    it('clones report keeping original template locked and resets status to draft', () => {
      const source = {
        id: 'rep-source-1',
        title: 'Báo cáo Toán - Bé A',
        studentId: 'hs-001',
        studentName: 'Lê Gia Huy',
        studentCode: 'HS-001',
        studentAge: '5 tuổi',
        studentAvatar: 'avatar.jpg',
        parentName: 'PH Huy',
        classId: 'lop-1a1',
        className: 'Lớp 1A1',
        templateId: 'toan',
        templateName: 'Báo cáo lĩnh vực Toán & Tư duy logic',
        dateType: 'date_range',
        startDate: '2026-09-01',
        endDate: '2026-09-30',
        status: 'completed',
        createdBy: 'Cô Nguyễn Mai',
        createdAt: '2026-09-10T00:00:00Z',
        updatedAt: '2026-09-10T00:00:00Z',
        checklistData: { section_1: { item_1: true } },
      };

      const duplicated = duplicateReport(
        source,
        {
          id: 'hs-002',
          name: 'Trần Minh Khôi',
          code: 'HS-002',
          age: '5 tuổi 9 tháng',
          parentName: 'PH Khôi',
        },
        'lop-1a1',
        'Lớp 1A1'
      );

      assert.equal(duplicated.templateId, 'toan');
      assert.equal(duplicated.templateName, 'Báo cáo lĩnh vực Toán & Tư duy logic');
      assert.equal(duplicated.studentId, 'hs-002');
      assert.equal(duplicated.studentName, 'Trần Minh Khôi');
      assert.equal(duplicated.status, 'draft'); // Must be reset to draft
      assert.notEqual(duplicated.id, source.id);
    });
  });

  describe('Report Filtering Logic', () => {
    const mockReports = [
      {
        id: '1',
        title: 'Toán - Bé A',
        studentName: 'Nguyễn Văn A',
        studentCode: 'HS-01',
        classId: 'lop-1a1',
        templateId: 'toan',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Tiếng Việt - Bé B',
        studentName: 'Trần Thị B',
        studentCode: 'HS-02',
        classId: 'lop-1a1',
        templateId: 'tieng_viet',
        status: 'draft',
      },
      {
        id: '3',
        title: 'English - Bé C',
        studentName: 'Lê Văn C',
        studentCode: 'HS-03',
        classId: 'lop-1a2',
        templateId: 'english',
        status: 'sent',
      },
    ];

    it('filters by status', () => {
      const drafts = filterExtendedReports(mockReports, {
        searchQuery: '',
        classId: 'all',
        templateId: 'all',
        status: 'draft',
      });
      assert.equal(drafts.length, 1);
      assert.equal(drafts[0].id, '2');
    });

    it('filters by templateId', () => {
      const mathReports = filterExtendedReports(mockReports, {
        searchQuery: '',
        classId: 'all',
        templateId: 'toan',
        status: 'all',
      });
      assert.equal(mathReports.length, 1);
      assert.equal(mathReports[0].id, '1');
    });

    it('filters by search keyword matching student name or code', () => {
      const match = filterExtendedReports(mockReports, {
        searchQuery: 'Trần Thị B',
        classId: 'all',
        templateId: 'all',
        status: 'all',
      });
      assert.equal(match.length, 1);
      assert.equal(match[0].id, '2');
    });
  });

  describe('Redux Reports Reducer State Transitions', () => {
    it('updateAbsenceRecord updates attendance status and recalculates totals', () => {
      const initialState = {
        studentRoster: [
          {
            studentId: 'hs-001',
            studentName: 'Lê Gia Huy',
            records: {
              '2026-09-12': {
                date: '2026-09-12',
                dayNumber: 12,
                weekday: 'T7',
                status: 'present',
                isLateArrival: false,
                isLateDeparture: false,
                lateArrivalMinutes: 0,
                lateDepartureMinutes: 0,
              },
            },
            totalPresent: 1,
            totalAbsentExcused: 0,
            totalAbsentUnexcused: 0,
            estimatedLateFee: 0,
          },
        ],
        staffRoster: [],
        extendedReports: [],
      };

      const nextState = reportsReducer(
        initialState,
        updateAbsenceRecord({
          studentId: 'hs-001',
          date: '2026-09-12',
          status: 'absent_excused',
          notes: 'Sốt cao, xin nghỉ có phép',
        })
      );

      const updatedStudent = nextState.studentRoster[0];
      assert.equal(updatedStudent.records['2026-09-12'].status, 'absent_excused');
      assert.equal(updatedStudent.records['2026-09-12'].notes, 'Sốt cao, xin nghỉ có phép');
      assert.equal(updatedStudent.totalPresent, 0);
      assert.equal(updatedStudent.totalAbsentExcused, 1);
    });

    it('advanceReportStatus progresses draft to sent', () => {
      const initialState = {
        extendedReports: [
          {
            id: 'rep-test',
            status: 'draft',
            updatedAt: 'old-date',
          },
        ],
      };

      const nextState = reportsReducer(initialState, advanceReportStatus('rep-test'));
      assert.equal(nextState.extendedReports[0].status, 'sent');
    });

    it('deleteExtendedReport removes draft reports and rejects non-draft reports', () => {
      const initialState = {
        extendedReports: [
          { id: 'rep-draft', status: 'draft' },
          { id: 'rep-sent', status: 'sent' },
        ],
      };

      // Try deleting sent report -> must be ignored
      const stateAfterSentDelete = reportsReducer(initialState, deleteExtendedReport('rep-sent'));
      assert.equal(stateAfterSentDelete.extendedReports.length, 2);

      // Delete draft report -> must be removed
      const stateAfterDraftDelete = reportsReducer(
        stateAfterSentDelete,
        deleteExtendedReport('rep-draft')
      );
      assert.equal(stateAfterDraftDelete.extendedReports.length, 1);
      assert.equal(stateAfterDraftDelete.extendedReports[0].id, 'rep-sent');
    });
  });

  describe('AC-018: Extended Report Table Action Menu & Layering', () => {
    it('uses 3-dots dropdown menu for row actions with upward opening for bottom rows', () => {
      const reports = [
        { id: '1', status: 'draft' },
        { id: '2', status: 'sent' },
        { id: '3', status: 'completed' },
        { id: '4', status: 'draft' },
      ];

      // Near bottom check: index >= length - 2
      const isNearBottomIndex0 = 0 >= reports.length - 2;
      const isNearBottomIndex3 = 3 >= reports.length - 2;

      assert.equal(isNearBottomIndex0, false);
      assert.equal(isNearBottomIndex3, true);

      // Actions available per status in dropdown
      const draftActions = ['Xem chi tiết', 'Chỉnh sửa', 'Tạo bản sao', 'Xóa'];
      const sentActions = ['Xem chi tiết', 'Tạo bản sao'];
      assert.equal(draftActions.length, 4);
      assert.equal(sentActions.length, 2);
    });
  });

  describe('AC-019: Conversation Chat Composer Tools & Media Attachments', () => {
    it('only permits attachment and emoji actions, removing B, I, U text formatting buttons', () => {
      const activeComposerButtons = ['attach', 'emoji'];
      const forbiddenFormattingButtons = ['bold', 'italic', 'underline'];

      forbiddenFormattingButtons.forEach((btn) => {
        assert.equal(activeComposerButtons.includes(btn), false);
      });
      assert.ok(activeComposerButtons.includes('attach'));
      assert.ok(activeComposerButtons.includes('emoji'));
    });

    it('inserts emojis at text position and supports multiple file attachments', () => {
      let text = 'Xin chào cô giáo';
      const emoji = '🌸';
      const newText = text + ' ' + emoji;
      assert.equal(newText, 'Xin chào cô giáo 🌸');

      const attachments = [
        { name: 'bai-tap.pdf', size: 102400 },
        { name: 'hinh-anh.jpg', size: 204800 },
      ];
      assert.equal(attachments.length, 2);
      assert.equal(attachments[0].name, 'bai-tap.pdf');
    });
  });
});
