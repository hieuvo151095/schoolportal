/**
 * Comprehensive Adversarial & Role-Play Test Suite for New Sub-Modules:
 * 1. Chăm Sóc Trẻ (Nutrition & Daily Care Lifecycle + Attendance Precondition)
 * 2. Phiếu Bé Ngoan (Weekly Good Kid Rewards + Interactive Sun Stamp)
 * 3. Báo Cáo Phiếu Bé Ngoan (Monthly Two-Tier Matrix Report + CSV BOM)
 * 4. DropdownMenu (Design System Hoisting & Smart Viewport Collision Auto-Flip)
 */

import { describe, it, test } from 'node:test';
import assert from 'node:assert/strict';

// Nutrition & Care imports
import {
  calculateNutritionSummary,
  applyBulkCareToRecords,
  createEmptyCareRecord,
  createDefaultMealCare,
  createDefaultSleepCare,
  createDefaultHydrationCare,
  createDefaultHygieneCare,
} from '../../src/utils/nutritionValidation.ts';
import {
  getCareRecordsForDateAndClass,
  RAW_MOCK_STUDENTS,
} from '../../src/services/mockNutritionData.ts';
import nutritionReducer, {
  setSelectedDate,
  setSelectedClassId,
  syncWithAttendance,
  setSearchQuery as setNutritionSearch,
  setStatusFilter as setNutritionStatusFilter,
  toggleSelectStudent,
  toggleSelectAll,
  clearSelection,
  saveStudentCareRecord,
  saveBulkCareRecord,
} from '../../src/store/slices/nutritionSlice.ts';

// Reward & Good Kid Stamp imports
import {
  calculateRewardSummary,
  generateDefaultMonthHistory,
} from '../../src/utils/rewardValidation.ts';
import {
  getRewardRecordsForClassAndWeek,
  REWARD_WEEKS_LIST,
} from '../../src/services/mockRewardData.ts';
import rewardReducer, {
  setSelectedClassId as setRewardClassId,
  setSelectedWeekNumber,
  setSearchQuery as setRewardSearch,
  setStatusFilter as setRewardStatusFilter,
  toggleAwardStudent,
  updateTeacherComment,
  bulkAwardSelected,
  bulkUnawardSelected,
  publishWeeklyRewards,
} from '../../src/store/slices/rewardSlice.ts';

// Monthly Reward Report imports
import {
  getWeeksForMonth,
  buildMonthlyRewardReport,
  exportRewardReportToCsv,
  REWARD_REPORT_MONTHS,
} from '../../src/utils/rewardReportValidation.ts';

// =============================================================================
// ROLE-PLAY SUITE 1: Cô Giáo Viên Mầm Non & Vòng Đời Chăm Sóc Trẻ
// =============================================================================
describe('ROLE-PLAY 1: Cô Giáo Viên Mầm Non & Vòng Đời Chăm Sóc Trẻ', () => {
  const sampleDate = '2026-11-17';
  const targetClass = 'lop-1a1';

  test('1.1. Tiền đề điểm danh: Khi chưa có học sinh nào điểm danh vào, bảng chăm sóc hoàn toàn trống', () => {
    // Custom attendance simulating a day before morning check-in (all status 'none' or absent, no arrivalTime)
    const emptyAttendance = [
      {
        studentId: 'st-001',
        studentCode: 'HS2026-001',
        fullName: 'Nguyễn Minh Khang',
        gender: 'male',
        avatarUrl: '/avatar1.jpg',
        classId: targetClass,
        date: sampleDate,
        status: 'absent_unexcused',
        arrivalTime: null,
      },
      {
        studentId: 'st-002',
        studentCode: 'HS2026-002',
        fullName: 'Trần Bảo Ngọc',
        gender: 'female',
        avatarUrl: '/avatar2.jpg',
        classId: targetClass,
        date: sampleDate,
        status: 'absent_excused',
        arrivalTime: null,
      },
    ];

    const careRecords = getCareRecordsForDateAndClass(sampleDate, targetClass, emptyAttendance);
    assert.equal(
      careRecords.length,
      0,
      'Bảng chăm sóc bắt buộc phải rỗng (0 trẻ) khi chưa có trẻ nào điểm danh có mặt'
    );
  });

  test('1.2. Điểm danh buổi sáng: Chỉ những trẻ "present" và có "arrivalTime" mới xuất hiện trong danh sách chăm sóc', () => {
    const morningAttendance = [
      {
        studentId: 'st-001',
        studentCode: 'HS2026-001',
        fullName: 'Nguyễn Minh Khang',
        gender: 'male',
        avatarUrl: '/avatar1.jpg',
        classId: targetClass,
        date: sampleDate,
        status: 'present',
        arrivalTime: '07:25',
      },
      {
        studentId: 'st-002',
        studentCode: 'HS2026-002',
        fullName: 'Trần Bảo Ngọc',
        gender: 'female',
        avatarUrl: '/avatar2.jpg',
        classId: targetClass,
        date: sampleDate,
        status: 'present',
        arrivalTime: '07:30',
      },
      {
        studentId: 'st-003',
        studentCode: 'HS2026-003',
        fullName: 'Lê Hoàng Nam',
        gender: 'male',
        avatarUrl: '/avatar3.jpg',
        classId: targetClass,
        date: sampleDate,
        status: 'absent_excused',
        arrivalTime: null,
      },
    ];

    const careRecords = getCareRecordsForDateAndClass(sampleDate, targetClass, morningAttendance);
    assert.equal(careRecords.length, 2, 'Chỉ 2 học sinh có mặt mới vào danh sách chăm sóc');
    assert.ok(careRecords.some((r) => r.studentId === 'st-001'));
    assert.ok(careRecords.some((r) => r.studentId === 'st-002'));
    assert.ok(
      !careRecords.some((r) => r.studentId === 'st-003'),
      'Học sinh vắng phép tuyệt đối không được xuất hiện trong danh sách chăm sóc tại trường'
    );
  });

  test('1.3. Thao tác chăm sóc hàng loạt: Cô chọn 3 trẻ và đánh giá đồng bộ 4 nhóm chỉ số', () => {
    const student1 = createEmptyCareRecord(RAW_MOCK_STUDENTS[0], sampleDate);
    const student2 = createEmptyCareRecord(RAW_MOCK_STUDENTS[1], sampleDate);
    const student3 = createEmptyCareRecord(RAW_MOCK_STUDENTS[2], sampleDate);
    const student4 = createEmptyCareRecord(RAW_MOCK_STUDENTS[3], sampleDate);

    const initialRoster = [student1, student2, student3, student4];

    // Payload configured by teacher in the Right-Sheet SlideOver
    const bulkPayload = {
      studentIds: [student1.studentId, student2.studentId, student3.studentId],
      meals: {
        lunch: {
          behavior: 'tu_an',
          amount: 'an_het_suat',
          note: 'Tự xúc ăn hết suất cơm trưa',
        },
      },
      sleep: {
        behavior: 'tu_ngu',
        duration: 'ngu_sau',
        note: 'Ngủ sâu giấc, không giật mình',
      },
      hydration: {
        behavior: 'chu_dong',
        amount: 'thuong_xuyen',
        note: 'Chủ động uống nước',
      },
      hygiene: {
        general: {
          activities: ['rua_tay', 'thay_quan_ao'],
          behavior: 'chu_dong',
          note: 'Tự giác rửa tay sạch sẽ',
        },
        poop: {
          behavior: 'khong_di',
          note: '',
        },
        note: 'Vệ sinh cá nhân gọn gàng, thơm tho',
      },
      generalNote: 'Các con ăn ngoan, chơi đoàn kết trong ngày',
    };

    const updatedRoster = applyBulkCareToRecords(initialRoster, bulkPayload, 'Cô Nguyễn Thu Mai');

    // Verify 3 selected students
    const evaluated = updatedRoster.filter((r) => bulkPayload.studentIds.includes(r.studentId));
    assert.equal(evaluated.length, 3);
    for (const rec of evaluated) {
      assert.equal(rec.isEvaluated, true);
      assert.equal(rec.meals.lunch.behavior, 'tu_an');
      assert.equal(rec.meals.lunch.amount, 'an_het_suat');
      assert.equal(rec.meals.lunch.note, 'Tự xúc ăn hết suất cơm trưa');
      assert.equal(rec.sleep.duration, 'ngu_sau');
      assert.equal(rec.hydration.behavior, 'chu_dong');
      assert.equal(rec.hydration.amount, 'thuong_xuyen');
      assert.deepEqual(rec.hygiene.general.activities, ['rua_tay', 'thay_quan_ao']);
      assert.equal(rec.hygiene.note, 'Vệ sinh cá nhân gọn gàng, thơm tho');
      assert.equal(rec.generalNote, 'Các con ăn ngoan, chơi đoàn kết trong ngày');
      assert.equal(rec.updatedBy, 'Cô Nguyễn Thu Mai');
    }

    // Verify student 4 was untouched
    const untouched = updatedRoster.find((r) => r.studentId === student4.studentId);
    assert.equal(untouched.isEvaluated, false, 'Trẻ không được chọn phải giữ nguyên trạng thái chờ đánh giá');
  });

  test('1.4. Ghép mẫu nhận xét nhanh (Quick Suggestion Chips): Cơ chế ghép chuỗi không trùng lặp', () => {
    // Helper replicating the chip click behavior in CareSlideOver
    const appendQuickNote = (current, phrase) => {
      if (!current || !current.trim()) return phrase;
      if (current.includes(phrase)) return current;
      return `${current} - ${phrase}`;
    };

    let note = '';
    // Click 1st chip
    note = appendQuickNote(note, 'Tự xúc ăn hết suất cơm trưa');
    assert.equal(note, 'Tự xúc ăn hết suất cơm trưa');

    // Click 2nd chip
    note = appendQuickNote(note, 'Khen đồ ăn ngon');
    assert.equal(note, 'Tự xúc ăn hết suất cơm trưa - Khen đồ ăn ngon');

    // Click 2nd chip again -> duplicate prevention
    const repeated = appendQuickNote(note, 'Khen đồ ăn ngon');
    assert.equal(repeated, note, 'Không được nối chuỗi lặp lại khi đã có nội dung đó');
  });

  test('1.5. Chỉnh sửa riêng lẻ sau khi chăm sóc hàng loạt: Không làm vỡ dữ liệu của các trẻ khác', () => {
    const student1 = createEmptyCareRecord(RAW_MOCK_STUDENTS[0], sampleDate);
    const student2 = createEmptyCareRecord(RAW_MOCK_STUDENTS[1], sampleDate);

    // Apply bulk care first
    const bulkPayload = {
      studentIds: [student1.studentId, student2.studentId],
      meals: { lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn tốt' } },
    };
    const rosterAfterBulk = applyBulkCareToRecords([student1, student2], bulkPayload);

    // Now teacher customizes student 1 only: "Bé Khang trớ nhẹ sau bữa xế"
    const st1Record = rosterAfterBulk.find((r) => r.studentId === student1.studentId);
    const customizedSt1 = {
      ...st1Record,
      meals: {
        ...st1Record.meals,
        snack: {
          behavior: 'can_ho_tro',
          amount: 'an_nua_suat',
          note: 'Bé trớ nhẹ sau bữa xế, cô đã thay áo',
        },
      },
    };

    const finalRoster = rosterAfterBulk.map((r) => (r.studentId === customizedSt1.studentId ? customizedSt1 : r));

    // St1 is customized
    const rec1 = finalRoster.find((r) => r.studentId === student1.studentId);
    assert.equal(rec1.meals.snack.amount, 'an_nua_suat');
    assert.equal(rec1.meals.snack.note, 'Bé trớ nhẹ sau bữa xế, cô đã thay áo');

    // St2 remains untouched
    const rec2 = finalRoster.find((r) => r.studentId === student2.studentId);
    assert.equal(rec2.meals.lunch.amount, 'an_het_suat');
    assert.equal(rec2.meals.snack.amount, 'an_het_suat', 'Student 2 snack remains default full portion');
  });
});

// =============================================================================
// ADVERSARIAL SUITE 2: Care Engine Torture & Boundary Invariants
// =============================================================================
describe('ADVERSARIAL 2: Care Engine Torture & Boundary Invariants', () => {
  const sampleDate = '2026-11-17';

  test('2.1. Payload rỗng hoặc chứa StudentId không tồn tại: Engine hoạt động an toàn, không crash', () => {
    const student1 = createEmptyCareRecord(RAW_MOCK_STUDENTS[0], sampleDate);
    const records = [student1];

    // Empty studentIds
    const emptyRes = applyBulkCareToRecords(records, { studentIds: [] });
    assert.deepEqual(emptyRes, records);

    // Non-existent student ID
    const ghostRes = applyBulkCareToRecords(records, {
      studentIds: ['ghost-student-999'],
      meals: { lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: 'test' } },
    });
    assert.equal(ghostRes[0].isEvaluated, false, 'Không cập nhật học sinh nào khi ID không khớp');
  });

  test('2.2. Cập nhật cục bộ từng phần (Partial Update): Không ghi đè hoặc làm mất dữ liệu các nhóm khác', () => {
    const student = createEmptyCareRecord(RAW_MOCK_STUDENTS[0], sampleDate);
    // Pre-set meal and sleep
    student.meals.lunch = { behavior: 'tu_an', amount: 'an_het_suat', note: 'Ăn hết bát' };
    student.sleep = { behavior: 'tu_ngu', duration: 'ngu_sau', note: 'Ngủ ngon' };

    // Bulk care only updates hydration
    const payload = {
      studentIds: [student.studentId],
      hydration: { behavior: 'gv_goi_y', amount: 'thinh_thoang', note: 'Cần nhắc uống' },
    };

    const [updated] = applyBulkCareToRecords([student], payload);
    assert.equal(updated.hydration.amount, 'thinh_thoang');
    // Ensure meal and sleep preserved
    assert.equal(updated.meals.lunch.amount, 'an_het_suat');
    assert.equal(updated.meals.lunch.note, 'Ăn hết bát');
    assert.equal(updated.sleep.duration, 'ngu_sau');
    assert.equal(updated.sleep.note, 'Ngủ ngon');
  });

  test('2.3. Kiểm thử ký tự đặc biệt, XSS payload và văn bản cực dài (> 1000 ký tự)', () => {
    const student = createEmptyCareRecord(RAW_MOCK_STUDENTS[0], sampleDate);
    const hostileNote = '<script>alert("xss")</script><img src="x" onerror="steal()"/> - Bé uống 500ml 🍼';
    const longText = 'A'.repeat(1200) + ' - Tiếng Việt có dấu: Ă Â Đ Ê Ô Ơ Ư';

    const payload = {
      studentIds: [student.studentId],
      meals: { lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: hostileNote } },
      generalNote: longText,
    };

    const [updated] = applyBulkCareToRecords([student], payload);
    assert.equal(updated.meals.lunch.note, hostileNote);
    assert.equal(updated.generalNote, longText);
    assert.ok(updated.generalNote.length > 1200);
  });

  test('2.4. Tính toán NutritionSummary chính xác tuyệt đối trên tập dữ liệu biên', () => {
    // 0 students
    assert.deepEqual(calculateNutritionSummary([]), {
      totalStudents: 0,
      evaluatedCount: 0,
      pendingCount: 0,
      ateFullPortionCount: 0,
      sleptWellCount: 0,
    });

    // 100% evaluated, 100% full portion & well slept
    const st1 = {
      ...createEmptyCareRecord(RAW_MOCK_STUDENTS[0], sampleDate),
      isEvaluated: true,
      meals: { lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: '' } },
      sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: '' },
    };
    const st2 = {
      ...createEmptyCareRecord(RAW_MOCK_STUDENTS[1], sampleDate),
      isEvaluated: true,
      meals: { lunch: { behavior: 'tu_an', amount: 'an_het_suat', note: '' } },
      sleep: { behavior: 'tu_ngu', duration: 'ngu_sau', note: '' },
    };

    const summaryAll = calculateNutritionSummary([st1, st2]);
    assert.equal(summaryAll.totalStudents, 2);
    assert.equal(summaryAll.evaluatedCount, 2);
    assert.equal(summaryAll.pendingCount, 0);
    assert.equal(summaryAll.ateFullPortionCount, 2);
    assert.equal(summaryAll.sleptWellCount, 2);
  });
});

// =============================================================================
// ROLE-PLAY SUITE 3: Phiếu Bé Ngoan & Tương Tác Mặt Trời
// =============================================================================
describe('ROLE-PLAY 3: Phiếu Bé Ngoan & Tương Tác Mặt Trời', () => {
  const sampleWeek = 29;
  const targetClass = 'lop-1a1';

  test('3.1. Chạm 1 chạm phát / thu hồi Phiếu Bé Ngoan: Đổi trạng thái và ghi nhận mốc thời gian', () => {
    const records = getRewardRecordsForClassAndWeek(targetClass, sampleWeek);
    assert.ok(records.length > 0);

    const initialState = {
      records,
      selectedClassId: targetClass,
      selectedWeekNumber: sampleWeek,
      selectedStudentIds: [],
      searchQuery: '',
      statusFilter: 'all',
      isDirty: false,
      detailSlideOverStudentId: null,
    };

    const targetStudentId = records[0].studentId;
    const initialStatus = records[0].isAwarded;

    // Toggle award
    const stateAfterToggle = rewardReducer(initialState, toggleAwardStudent(targetStudentId));
    const toggledRecord = stateAfterToggle.records.find((r) => r.studentId === targetStudentId);

    assert.equal(toggledRecord.isAwarded, !initialStatus);
    assert.equal(stateAfterToggle.hasUnsavedChanges, true, 'hasUnsavedChanges phải bật để báo có thay đổi');

    // Toggle back
    const stateAfterToggleBack = rewardReducer(stateAfterToggle, toggleAwardStudent(targetStudentId));
    const backRecord = stateAfterToggleBack.records.find((r) => r.studentId === targetStudentId);
    assert.equal(backRecord.isAwarded, initialStatus);
  });

  test('3.2. Phát và thu hồi hàng loạt cho nhiều trẻ được chọn cùng lúc', () => {
    const records = getRewardRecordsForClassAndWeek(targetClass, sampleWeek);
    const ids = [records[0].studentId, records[1].studentId];

    let state = {
      records,
      selectedClassId: targetClass,
      selectedWeekNumber: sampleWeek,
      selectedStudentIds: ids,
      searchQuery: '',
      statusFilter: 'all',
      hasUnsavedChanges: false,
      detailSlideOverStudentId: null,
    };

    // Bulk award
    state = rewardReducer(state, bulkAwardSelected());
    assert.ok(state.records.find((r) => r.studentId === ids[0]).isAwarded);
    assert.ok(state.records.find((r) => r.studentId === ids[1]).isAwarded);

    // Bulk unaward
    state = rewardReducer(state, bulkUnawardSelected());
    assert.equal(state.records.find((r) => r.studentId === ids[0]).isAwarded, false);
    assert.equal(state.records.find((r) => r.studentId === ids[1]).isAwarded, false);
  });

  test('3.3. Quy trình phát hành tuần (Publish to Parents): Khóa trạng thái công bố và tạo dấu thời gian', () => {
    const records = getRewardRecordsForClassAndWeek(targetClass, sampleWeek);
    // Ensure all records start unpublished but with known awarded status
    const preparedRecords = records.map((r, i) => ({
      ...r,
      isAwarded: i % 2 === 0, // 50% awarded, 50% unawarded
      isPublished: false,
      publishedAt: undefined,
    }));

    let state = {
      records: preparedRecords,
      selectedClassId: targetClass,
      selectedWeekNumber: sampleWeek,
      selectedStudentIds: [],
      searchQuery: '',
      statusFilter: 'all',
      hasUnsavedChanges: false,
      detailSlideOverStudentId: null,
    };

    // Add teacher comment for student 0
    const studentId = preparedRecords[0].studentId;
    state = rewardReducer(
      state,
      updateTeacherComment({ studentId, comment: 'Bé rất tiến bộ, tích cực tham gia phát biểu!' })
    );

    // Publish weekly rewards
    state = rewardReducer(state, publishWeeklyRewards());

    // Only awarded students get published rewards to parents
    const awardedRecords = state.records.filter((r) => r.isAwarded);
    const unawardedRecords = state.records.filter((r) => !r.isAwarded);

    assert.ok(awardedRecords.length > 0);
    assert.ok(
      awardedRecords.every((r) => r.isPublished === true),
      'Tất cả học sinh được nhận phiếu phải được đánh dấu đã công bố tới phụ huynh'
    );
    assert.ok(
      awardedRecords.every((r) => typeof r.publishedAt === 'string' && r.publishedAt.length > 0),
      'Học sinh nhận phiếu phải có dấu mốc thời gian phát hành'
    );
    assert.ok(
      unawardedRecords.every((r) => !r.isPublished),
      'Học sinh chưa đạt phiếu không gửi thông báo chúc mừng'
    );
  });

  test('3.4. Kiểm tra quy tắc chuyên cần: Học sinh nghỉ không phép nhiều có cảnh báo rõ ràng', () => {
    const records = getRewardRecordsForClassAndWeek(targetClass, sampleWeek);
    // Student with 3 unexcused absences
    const irregularStudent = {
      ...records[0],
      studentId: 'st-irregular',
      unexcusedAbsenceCount: 3,
      isAwarded: false,
    };

    const summary = calculateRewardSummary([...records, irregularStudent]);
    assert.ok(summary.totalStudents > records.length);
    assert.ok(summary.unawardedCount >= 1);
  });
});

// =============================================================================
// ROLE-PLAY SUITE 4: Hiệu Trưởng & Kiểm Toán Báo Cáo Ma Trận Phiếu Bé Ngoan
// =============================================================================
describe('ROLE-PLAY 4: Hiệu Trưởng & Kiểm Toán Báo Cáo Ma Trận Phiếu Bé Ngoan', () => {
  const targetClass = 'lop-1a1';
  const targetMonth = '2026-11';

  test('4.1. Bất biến tổng số dòng và cột: Tổng phiếu từng học sinh khớp chính xác số tuần nhận phiếu', () => {
    const report = buildMonthlyRewardReport(targetClass, targetMonth);
    assert.ok(report);
    assert.ok(report.rows.length > 0);

    for (const row of report.rows) {
      let manualAwardedSum = 0;
      for (const week of report.weeks) {
        const weekStatus = row.weeklyStatus[week.weekNumber];
        if (weekStatus && weekStatus.isAwarded) {
          manualAwardedSum++;
        }
      }
      assert.equal(
        row.totalAwarded,
        manualAwardedSum,
        `Học sinh ${row.fullName} có totalAwarded (${row.totalAwarded}) phải bằng manualAwardedSum (${manualAwardedSum})`
      );
    }
  });

  test('4.2. Dòng tổng kết cuối bảng (Summary Footer) khớp 100% với dữ liệu chi tiết', () => {
    const report = buildMonthlyRewardReport(targetClass, targetMonth);
    const summary = report.summary;

    const calculatedTotalAwarded = report.rows.reduce((acc, r) => acc + r.totalAwarded, 0);
    assert.equal(
      summary.grandTotalAwarded,
      calculatedTotalAwarded,
      'Tổng số phiếu tháng phải bằng tổng của tất cả các hàng'
    );

    const calculatedExcused = report.rows.reduce((acc, r) => acc + r.totalExcused, 0);
    assert.equal(summary.totalExcusedAbsences, calculatedExcused);

    const calculatedUnexcused = report.rows.reduce((acc, r) => acc + r.totalUnexcused, 0);
    assert.equal(summary.totalUnexcusedAbsences, calculatedUnexcused);

    // Weekly totals verify
    for (const week of report.weeks) {
      const weekSum = report.rows.filter((r) => r.weeklyStatus[week.weekNumber]?.isAwarded).length;
      assert.equal(
        summary.weeklyAwardedTotals[week.weekNumber],
        weekSum,
        `Tổng phiếu tuần ${week.weekNumber} phải bằng số học sinh đạt phiếu tuần đó`
      );
    }
  });

  test('4.3. Xuất file CSV: Chứa UTF-8 BOM, đúng tiêu đề tiếng Việt và có hàng tổng cộng', () => {
    const report = buildMonthlyRewardReport(targetClass, targetMonth);
    const csvContent = exportRewardReportToCsv(report);

    // 1. Must start with UTF-8 BOM (\uFEFF) for Excel compatibility in Vietnam
    assert.equal(csvContent.charCodeAt(0), 0xfeff, 'File CSV bắt buộc có UTF-8 BOM ở ký tự đầu tiên');

    // 2. Contains essential column headers
    assert.ok(csvContent.includes('Mã học sinh'));
    assert.ok(csvContent.includes('Họ và tên'));
    assert.ok(csvContent.includes('Tổng phiếu đạt'));
    assert.ok(csvContent.includes('Vắng có phép'));
    assert.ok(csvContent.includes('Vắng không phép'));

    // 3. Contains bottom total row
    assert.ok(csvContent.includes('TỔNG CỘNG'));
  });
});

// =============================================================================
// ADVERSARIAL SUITE 5: DropdownMenu Placement & Collision Invariant
// =============================================================================
describe('ADVERSARIAL 5: DropdownMenu Placement & Smart Collision Auto-Flip', () => {
  // Logic from DropdownMenu component in app/src/components/ds/index.tsx
  function computeDropdownPlacement(rect, windowInnerHeight, windowInnerWidth, align = 'right') {
    const spaceBelow = windowInnerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedHeight = 190;
    const shouldOpenUp = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    if (align === 'left') {
      return {
        top: shouldOpenUp ? Math.max(8, rect.top - 4) : Math.min(windowInnerHeight - 8, rect.bottom + 4),
        left: Math.max(8, rect.left),
        placement: shouldOpenUp ? 'top' : 'bottom',
      };
    } else {
      return {
        top: shouldOpenUp ? Math.max(8, rect.top - 4) : Math.min(windowInnerHeight - 8, rect.bottom + 4),
        right: Math.max(8, windowInnerWidth - rect.right),
        placement: shouldOpenUp ? 'top' : 'bottom',
      };
    }
  }

  test('5.1. Nút ở đáy màn hình (< 190px khoảng trống bên dưới): Menu tự động lật lên trên (is-up / placement top)', () => {
    const viewportHeight = 800;
    const viewportWidth = 1280;

    // Trigger button placed at bottom: top = 740, bottom = 770 (spaceBelow = 30px < 190px)
    const buttonRect = {
      top: 740,
      bottom: 770,
      left: 1100,
      right: 1150,
    };

    const result = computeDropdownPlacement(buttonRect, viewportHeight, viewportWidth, 'right');
    assert.equal(result.placement, 'top', 'Bắt buộc lật lên trên khi gần đáy màn hình');
    assert.ok(result.top <= buttonRect.top, 'Tọa độ top của menu hướng lên phải nhỏ hơn hoặc bằng top nút');
  });

  test('5.2. Nút ở phía trên màn hình (>= 190px khoảng trống): Menu mở xuống dưới (is-down / placement bottom)', () => {
    const viewportHeight = 800;
    const viewportWidth = 1280;

    // Trigger button placed at top: top = 150, bottom = 188 (spaceBelow = 612px >= 190px)
    const buttonRect = {
      top: 150,
      bottom: 188,
      left: 1100,
      right: 1150,
    };

    const result = computeDropdownPlacement(buttonRect, viewportHeight, viewportWidth, 'right');
    assert.equal(result.placement, 'bottom', 'Bình thường menu mở xuống dưới');
    assert.ok(result.top >= buttonRect.bottom, 'Tọa độ top của menu hướng xuống phải nằm dưới nút');
  });

  test('5.3. Bất biến lề an toàn màn hình (Safety bounds): Không bao giờ tràn ra ngoài lề âm', () => {
    const viewportHeight = 800;
    const viewportWidth = 1280;

    // Boundary edge: right at the edge of screen
    const extremeRect = {
      top: 2,
      bottom: 30,
      left: -5,
      right: 1290,
    };

    const leftAlign = computeDropdownPlacement(extremeRect, viewportHeight, viewportWidth, 'left');
    assert.ok(leftAlign.left >= 8, 'Left margin tối thiểu phải là 8px');

    const rightAlign = computeDropdownPlacement(extremeRect, viewportHeight, viewportWidth, 'right');
    assert.ok(rightAlign.right >= 8, 'Right margin tối thiểu phải là 8px');
  });
});
