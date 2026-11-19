import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  computeExecutiveKPIs,
  evaluateClassStatus,
  filterApprovalCenter,
  filterBulletinBoard,
  filterCashflowSeries,
  filterClassPerformanceMatrix,
  filterFrequentAbsences,
  filterGradeCensus,
  filterWeeklyActivityPosts,
  filterWellnessTrend,
  formatVndCompact,
  formatVndCurrency,
  getScopeShareRatio,
  removeVietnameseTones,
} from '../../src/utils/dashboardAnalytics.ts';
import {
  MOCK_APPROVAL_CENTER_ITEMS,
  MOCK_BULLETIN_BOARD_ITEMS,
  MOCK_CARE_WELLNESS_TREND,
  MOCK_CLASS_PERFORMANCE_MATRIX,
  MOCK_FREQUENT_ABSENCE_STUDENTS,
  MOCK_GRADE_CENSUS,
  MOCK_MONTHLY_CASHFLOW,
  MOCK_WEEKLY_ACTIVITY_POSTS,
} from '../../src/services/mockDashboardData.ts';
import dashboardReducer, {
  refreshDashboardData,
  resetDashboardFilters,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  setGradeScope,
  setTimeRange,
} from '../../src/store/slices/dashboardSlice.ts';

describe('Executive Overview Dashboard (Tổng Quan Điều Hành)', () => {
  test('1. Format helpers render VND currencies and compact metrics accurately', () => {
    assert.equal(removeVietnameseTones('Khối Mầm Non - Lớp 1A1'), 'khoi mam non - lop 1a1');
    assert.ok(formatVndCurrency(1450000000).endsWith(' đ'));
    assert.equal(formatVndCompact(1450000000), '1,45 tỷ');
    assert.equal(formatVndCompact(142000000), '142 tr');
  });

  test('2. Executive KPIs compute coherent student scale, attendance, tuition, and CSAT', () => {
    const schoolKpis = computeExecutiveKPIs(
      'all',
      'month',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );

    assert.equal(schoolKpis.totalStudents, 342);
    assert.equal(schoolKpis.totalCapacity, 380);
    assert.equal(schoolKpis.fillRate, 90.0);
    assert.ok(schoolKpis.attendanceRate > 90 && schoolKpis.attendanceRate <= 100);
    assert.equal(
      schoolKpis.tuitionTotalIssuedVnd,
      schoolKpis.tuitionCollectedVnd + schoolKpis.tuitionRemainingVnd
    );
    assert.ok(schoolKpis.tuitionCollectionRate > 80);
    assert.equal(schoolKpis.csatScore, 4.85);
  });

  test('3. Grade scope filtering dynamically scales cashflow, census, and wellness trends', () => {
    const grade1Ratio = getScopeShareRatio('khoi-1', MOCK_GRADE_CENSUS);
    assert.ok(grade1Ratio > 0.3 && grade1Ratio < 0.35);

    const scopedCensus = filterGradeCensus('khoi-mam', MOCK_GRADE_CENSUS);
    assert.equal(scopedCensus.length, 1);
    assert.equal(scopedCensus[0].gradeId, 'khoi-mam');

    const termCashflow = filterCashflowSeries(
      'term',
      'khoi-1',
      MOCK_MONTHLY_CASHFLOW,
      MOCK_GRADE_CENSUS
    );
    assert.equal(termCashflow.length, 4);
    assert.ok(termCashflow[0].collected < MOCK_MONTHLY_CASHFLOW[2].collected);

    const grade2Trend = filterWellnessTrend(
      'khoi-2',
      MOCK_CARE_WELLNESS_TREND,
      MOCK_CLASS_PERFORMANCE_MATRIX
    );
    assert.equal(grade2Trend.length, MOCK_CARE_WELLNESS_TREND.length);
  });

  test('4. Weekly Activity, Bulletin Board, Approval Center & Frequent Absence filters work cleanly', () => {
    // Weekly Activity strictly tracks only postCount & heartCount (no album metrics)
    const allActivities = filterWeeklyActivityPosts(
      'all',
      MOCK_WEEKLY_ACTIVITY_POSTS,
      MOCK_GRADE_CENSUS
    );
    assert.equal(allActivities.length, MOCK_WEEKLY_ACTIVITY_POSTS.length);
    assert.ok(!('albumCount' in allActivities[0]));

    const scopedActivities = filterWeeklyActivityPosts(
      'khoi-mam',
      MOCK_WEEKLY_ACTIVITY_POSTS,
      MOCK_GRADE_CENSUS
    );
    assert.ok(scopedActivities[2].postCount <= allActivities[2].postCount);

    // Bulletin board keeps global (no gradeId) + matching gradeId
    const grade1Bulletins = filterBulletinBoard('khoi-1', MOCK_BULLETIN_BOARD_ITEMS);
    assert.ok(grade1Bulletins.every((b) => !b.gradeId || b.gradeId === 'khoi-1'));

    // Approval center filters strictly by grade
    const grade3Approvals = filterApprovalCenter('khoi-3', MOCK_APPROVAL_CENTER_ITEMS);
    assert.equal(grade3Approvals.length, 0);

    const grade1Approvals = filterApprovalCenter('khoi-1', MOCK_APPROVAL_CENTER_ITEMS);
    assert.equal(grade1Approvals.length, 1);
    assert.equal(grade1Approvals[0].classId, 'lop-1a1');

    // Frequent absence sorts descending by absentDays
    const absences = filterFrequentAbsences('all', MOCK_FREQUENT_ABSENCE_STUDENTS);
    for (let i = 1; i < absences.length; i++) {
      assert.ok(absences[i - 1].absentDays >= absences[i].absentDays);
    }
  });

  test('5. Class Performance Matrix supports diacritic search, status filter & threshold rules', () => {
    assert.equal(
      evaluateClassStatus({
        attendanceRate: 85.0,
        mealCompletionRate: 90,
        tuitionCollectionRate: 90,
      }),
      'critical'
    );
    assert.equal(
      evaluateClassStatus({
        attendanceRate: 92.0,
        mealCompletionRate: 78.3,
        tuitionCollectionRate: 95,
      }),
      'warning'
    );
    assert.equal(
      evaluateClassStatus({
        attendanceRate: 96.4,
        mealCompletionRate: 92.6,
        tuitionCollectionRate: 95,
      }),
      'stable'
    );

    const byTeacher = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      'nguyen thi mai',
      'all'
    );
    assert.equal(byTeacher.length, 1);
    assert.equal(byTeacher[0].classId, 'lop-1a1');
  });

  test('6. Redux state transitions operate reliably', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });
    assert.equal(state.timeRange, 'month');
    assert.equal(state.gradeScope, 'all');

    state = dashboardReducer(state, setTimeRange('week'));
    state = dashboardReducer(state, setGradeScope('khoi-2'));
    state = dashboardReducer(state, setDashboardSearchQuery('2A2'));
    state = dashboardReducer(state, setDashboardStatusFilter('critical'));
    state = dashboardReducer(state, refreshDashboardData('14:30:00'));

    assert.equal(state.timeRange, 'week');
    assert.equal(state.gradeScope, 'khoi-2');
    assert.equal(state.lastRefreshedAt, '14:30:00');

    state = dashboardReducer(state, resetDashboardFilters());
    assert.equal(state.timeRange, 'month');
    assert.equal(state.gradeScope, 'all');
  });

  test('7. Layout order & Design System invariants conform to specification', () => {
    const layoutPath = path.resolve('src/components/layout/PortalLayout.tsx');
    const layoutSrc = fs.readFileSync(layoutPath, 'utf8');
    const overviewIdx = layoutSrc.indexOf("label: 'Tổng quan'");
    const opsIdx = layoutSrc.indexOf("label: 'Vận hành'");
    assert.ok(overviewIdx !== -1 && overviewIdx < opsIdx);

    // Check Dashboard Page widget placement and deletion of ExecutiveAlertsCard
    const pageSrc = fs.readFileSync(
      path.resolve('src/pages/[schoolCode]/dashboard/index.tsx'),
      'utf8'
    );
    assert.equal(pageSrc.includes('ExecutiveAlertsCard'), false);

    const cashflowIdx = pageSrc.indexOf('<FinanceCashflowChart');
    const donutIdx = pageSrc.indexOf('<StudentCensusDonut');
    const wellnessIdx = pageSrc.indexOf('<CareWellnessTrendChart');
    const activityIdx = pageSrc.indexOf('<WeeklyActivityChart');
    const bulletinIdx = pageSrc.indexOf('<BulletinBoardCard');
    const approvalIdx = pageSrc.indexOf('<ApprovalCenterCard');
    const absenceIdx = pageSrc.indexOf('<FrequentAbsenceCard');

    assert.ok(cashflowIdx < donutIdx);
    assert.ok(donutIdx < wellnessIdx);
    assert.ok(wellnessIdx < activityIdx);
    assert.ok(activityIdx < bulletinIdx);
    assert.ok(bulletinIdx < approvalIdx);
    assert.ok(approvalIdx < absenceIdx);

    // Ensure WeeklyActivityChart tracks posts and hearts ONLY (no album legend/series)
    const activitySrc = fs.readFileSync(
      path.resolve('src/modules/dashboard/WeeklyActivityChart.tsx'),
      'utf8'
    );
    assert.equal(activitySrc.includes('Số album'), false);
    assert.ok(activitySrc.includes('Số bài hoạt động'));
    assert.ok(activitySrc.includes('Lượt tim phụ huynh'));

    // Design system conformance across all dashboard widgets
    const modulesToCheck = [
      'src/modules/dashboard/DashboardToolbar.tsx',
      'src/modules/dashboard/ClassComparisonTable.tsx',
      'src/modules/dashboard/ExecutiveKpiCards.tsx',
      'src/modules/dashboard/WeeklyActivityChart.tsx',
      'src/modules/dashboard/BulletinBoardCard.tsx',
      'src/modules/dashboard/ApprovalCenterCard.tsx',
      'src/modules/dashboard/FrequentAbsenceCard.tsx',
    ];

    for (const rel of modulesToCheck) {
      const src = fs.readFileSync(path.resolve(rel), 'utf8');
      assert.equal(/<button\b/.test(src), false, `${rel} must not use raw <button>`);
      assert.equal(/<select\b/.test(src), false, `${rel} must not use raw <select>`);
      assert.equal(/\balert\(/.test(src), false, `${rel} must not use native alert()`);
    }
  });
});
