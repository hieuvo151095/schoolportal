import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getWeeksForMonth,
  buildMonthlyRewardReport,
  exportRewardReportToCsv,
  REWARD_REPORT_MONTHS,
} from '../../src/utils/rewardReportValidation.ts';

test('rewardReportValidation - REWARD_REPORT_MONTHS has valid list of months', () => {
  assert.ok(Array.isArray(REWARD_REPORT_MONTHS));
  assert.ok(REWARD_REPORT_MONTHS.length >= 3);
  const nov2026 = REWARD_REPORT_MONTHS.find((m) => m.value === '2026-11');
  assert.ok(nov2026);
  assert.equal(nov2026.label, 'Tháng 11/2026');
});

test('rewardReportValidation - getWeeksForMonth returns expected weeks for November 2026', () => {
  const weeks = getWeeksForMonth('2026-11');
  assert.ok(Array.isArray(weeks));
  assert.equal(weeks.length, 5);

  weeks.forEach((w) => {
    assert.ok(w.weekNumber > 0);
    assert.ok(w.weekLabel.startsWith('Tuần'));
    assert.ok(w.dateRange);
    assert.equal(typeof w.isFuture, 'boolean');
  });
});

test('rewardReportValidation - getWeeksForMonth handles October 2026', () => {
  const weeks = getWeeksForMonth('2026-10');
  assert.ok(Array.isArray(weeks));
  assert.equal(weeks.length, 5);
  assert.equal(weeks[0].weekNumber, 22);
});

test('rewardReportValidation - buildMonthlyRewardReport calculates totals correctly', () => {
  const report = buildMonthlyRewardReport('lop-1a1', '2026-11');
  assert.ok(report);
  assert.equal(report.classId, 'lop-1a1');
  assert.ok(report.className.includes('Lớp 1A1'));
  assert.equal(report.month, '2026-11');
  assert.ok(report.weeks.length > 0);
  assert.ok(report.rows.length > 0);

  // Check rows
  report.rows.forEach((r) => {
    assert.ok(r.studentId);
    assert.ok(r.fullName);
    assert.ok(r.studentCode);
    assert.equal(typeof r.totalAwarded, 'number');
    assert.equal(typeof r.totalExcused, 'number');
    assert.equal(typeof r.totalUnexcused, 'number');

    // Total rewards matches count of weeks with isAwarded === true
    const awardedCount = Object.values(r.weeklyStatus).filter((s) => s.isAwarded).length;
    assert.equal(r.totalAwarded, awardedCount);
  });

  // Check summary
  const summary = report.summary;
  assert.equal(summary.totalStudents, report.rows.length);
  const sumRewards = report.rows.reduce((acc, r) => acc + r.totalAwarded, 0);
  assert.equal(summary.grandTotalAwarded, sumRewards);
  const sumExcused = report.rows.reduce((acc, r) => acc + r.totalExcused, 0);
  assert.equal(summary.totalExcusedAbsences, sumExcused);
  const sumUnexcused = report.rows.reduce((acc, r) => acc + r.totalUnexcused, 0);
  assert.equal(summary.totalUnexcusedAbsences, sumUnexcused);
  assert.ok(summary.averageRate >= 0 && summary.averageRate <= 100);

  // Weekly breakdown
  report.weeks.forEach((w) => {
    const weeklyCount = summary.weeklyAwardedTotals[w.weekNumber];
    if (w.isFuture) {
      assert.equal(weeklyCount, 0);
    } else {
      assert.ok(typeof weeklyCount === 'number');
      assert.ok(weeklyCount >= 0 && weeklyCount <= summary.totalStudents);
    }
  });
});

test('rewardReportValidation - exportRewardReportToCsv generates valid CSV string with UTF-8 BOM', () => {
  const report = buildMonthlyRewardReport('lop-1a1', '2026-11');
  const csv = exportRewardReportToCsv(report);

  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('BÁO CÁO PHIẾU BÉ NGOAN'));
  assert.ok(csv.includes('Lớp 1A1'));
  assert.ok(csv.includes('11/2026'));
  assert.ok(csv.includes('Mã học sinh'));
  assert.ok(csv.includes('Họ và tên'));
  assert.ok(csv.includes('Tổng phiếu đạt'));
  assert.ok(csv.includes('TỔNG CỘNG'));

  report.rows.forEach((r) => {
    assert.ok(csv.includes(r.studentCode));
    assert.ok(csv.includes(r.fullName));
  });
});
