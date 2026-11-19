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
  getScopeShareRatio,
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
import { INITIAL_ACTIVITY_POSTS } from '../../src/services/mockActivityData.ts';
import { CLASSES_LIST } from '../../src/services/mockAttendanceData.ts';
import { filterActivityPosts } from '../../src/utils/activityValidation.ts';
import dashboardReducer, {
  refreshDashboardData,
  resetDashboardFilters,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  setGradeScope,
  setTimeRange,
} from '../../src/store/slices/dashboardSlice.ts';

describe('Tổng Quan Module: Role-Play, Adversarial & Cross-Module Scenario Tests', () => {
  // =========================================================================
  // ROLE-PLAY SCENARIOS
  // =========================================================================

  test('Role-Play 1 (School Owner / Chủ trường): Reviews full-school cashflow & scales across Month/Term/Year', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });

    // Owner compares Monthly -> Term (3-month) -> Full Year (6-month) financial totals
    const kpiMonth = computeExecutiveKPIs(
      state.gradeScope,
      'month',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    const kpiTerm = computeExecutiveKPIs(
      state.gradeScope,
      'term',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    const kpiYear = computeExecutiveKPIs(
      state.gradeScope,
      'year',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );

    assert.ok(kpiYear.tuitionCollectedVnd > kpiTerm.tuitionCollectedVnd);
    assert.ok(kpiTerm.tuitionCollectedVnd > kpiMonth.tuitionCollectedVnd);
    assert.equal(
      kpiYear.tuitionTotalIssuedVnd,
      kpiYear.tuitionCollectedVnd + kpiYear.tuitionRemainingVnd
    );

    // Owner drills into Lớp 1A2 which has high remaining fee debt
    state = dashboardReducer(state, setDashboardSearchQuery('1A2'));
    const filtered = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      state.gradeScope,
      state.searchQuery,
      state.statusFilter
    );
    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].classId, 'lop-1a2');
    assert.ok(filtered[0].tuitionRemainingVnd > 30_000_000);
  });

  test('Role-Play 2 (School Principal / Hiệu trưởng): Drills into Khối Mầm non and validates synchronized widgets', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });
    state = dashboardReducer(state, setGradeScope('khoi-mam'));

    // 1. Census Donut & KPI
    const census = filterGradeCensus(state.gradeScope, MOCK_GRADE_CENSUS);
    assert.equal(census.length, 1);
    assert.equal(census[0].studentCount, 72);

    const kpi = computeExecutiveKPIs(
      state.gradeScope,
      state.timeRange,
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    assert.equal(kpi.totalStudents, 72);
    assert.equal(kpi.totalCapacity, 75);
    assert.equal(kpi.fillRate, 96.0);
    assert.equal(kpi.csatScore, 4.92);

    // 2. Bulletin Board shows only global + Khối Mầm non announcements
    const bulletins = filterBulletinBoard(state.gradeScope, MOCK_BULLETIN_BOARD_ITEMS);
    assert.ok(bulletins.some((b) => b.id === 'bb-5')); // Mầm non picnic
    assert.ok(!bulletins.some((b) => b.id === 'bb-2')); // Khối 1 schedule excluded

    // 3. Approval Center isolates Lớp Lá 1 pending activity
    const approvals = filterApprovalCenter(state.gradeScope, MOCK_APPROVAL_CENTER_ITEMS);
    assert.equal(approvals.length, 1);
    assert.equal(approvals[0].classId, 'lop-la-1');

    // 4. Frequent Absence isolates Mầm non students
    const absences = filterFrequentAbsences(state.gradeScope, MOCK_FREQUENT_ABSENCE_STUDENTS);
    assert.equal(absences.length, 1);
    assert.equal(absences[0].classId, 'lop-choi-1');

    // 5. Matrix narrows strictly to 3 Mầm non classes
    const matrix = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      state.gradeScope,
      '',
      'all'
    );
    assert.equal(matrix.length, 3);
  });

  test('Role-Play 3 (Homeroom Coordinator): Monitors Weekly Activity Engagement & Frequent Absences', () => {
    const activities = filterWeeklyActivityPosts(
      'all',
      MOCK_WEEKLY_ACTIVITY_POSTS,
      MOCK_GRADE_CENSUS
    );
    const totalPosts = activities.reduce((s, a) => s + a.postCount, 0);
    const totalHearts = activities.reduce((s, a) => s + a.heartCount, 0);
    assert.ok(totalPosts > 0);
    assert.ok(totalHearts > totalPosts); // Parents react with multiple hearts per post

    // Frequent absences sorted strictly descending for immediate outreach
    const absences = filterFrequentAbsences('all', MOCK_FREQUENT_ABSENCE_STUDENTS);
    assert.equal(absences[0].studentName, 'Nguyễn Đức Huy');
    assert.equal(absences[0].absentDays, 4);
    assert.ok(absences[0].absentDays >= absences[absences.length - 1].absentDays);

    // Search teacher without Vietnamese diacritics
    const teacherLookup = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      'vu thi ngoc lan',
      'all'
    );
    assert.equal(teacherLookup.length, 1);
    assert.equal(teacherLookup[0].classId, 'lop-choi-1');
  });

  // =========================================================================
  // ADVERSARIAL ("FACING") BOUNDARY & DEGRADATION TESTS
  // =========================================================================

  test('Adversarial 1: Zero / Empty datasets never produce NaN, Infinity, or throw exceptions', () => {
    const emptyKpi = computeExecutiveKPIs('all', 'month', [], [], []);
    assert.equal(emptyKpi.totalStudents, 0);
    assert.equal(emptyKpi.fillRate, 0);
    assert.equal(emptyKpi.attendanceRate, 0);
    assert.equal(emptyKpi.tuitionCollectionRate, 0);
    assert.equal(Number.isNaN(emptyKpi.fillRate), false);
    assert.equal(Number.isNaN(emptyKpi.attendanceRate), false);
    assert.equal(Number.isNaN(emptyKpi.tuitionCollectionRate), false);

    assert.equal(getScopeShareRatio('khoi-1', []), 0);
    assert.deepEqual(filterWeeklyActivityPosts('khoi-1', MOCK_WEEKLY_ACTIVITY_POSTS, []), MOCK_WEEKLY_ACTIVITY_POSTS.map((p) => ({ ...p, postCount: 0, heartCount: 0 })));
    assert.deepEqual(filterWellnessTrend('khoi-99', MOCK_CARE_WELLNESS_TREND, MOCK_CLASS_PERFORMANCE_MATRIX), MOCK_CARE_WELLNESS_TREND);
  });

  test('Adversarial 2: Invalid gradeScope & malicious/whitespace search strings degrade cleanly', () => {
    const unknownScopeKpi = computeExecutiveKPIs(
      'invalid-grade-id',
      'today',
      MOCK_GRADE_CENSUS,
      MOCK_CLASS_PERFORMANCE_MATRIX,
      MOCK_MONTHLY_CASHFLOW
    );
    assert.equal(unknownScopeKpi.totalStudents, 0);
    assert.equal(unknownScopeKpi.fillRate, 0);

    const xssSearch = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      '   <script>alert(1)</script>   ',
      'all'
    );
    assert.equal(xssSearch.length, 0);

    const blankSearch = filterClassPerformanceMatrix(
      MOCK_CLASS_PERFORMANCE_MATRIX,
      'all',
      '    ',
      'all'
    );
    assert.equal(blankSearch.length, MOCK_CLASS_PERFORMANCE_MATRIX.length);
  });

  test('Adversarial 3: Status threshold boundary transitions are exact and deterministic', () => {
    // Critical threshold: attendance < 88 OR tuition < 70
    assert.equal(
      evaluateClassStatus({ attendanceRate: 87.9, mealCompletionRate: 95, tuitionCollectionRate: 95 }),
      'critical'
    );
    assert.equal(
      evaluateClassStatus({ attendanceRate: 88.0, mealCompletionRate: 95, tuitionCollectionRate: 95 }),
      'warning' // attendance < 92 triggers warning
    );
    assert.equal(
      evaluateClassStatus({ attendanceRate: 95.0, mealCompletionRate: 95, tuitionCollectionRate: 69.9 }),
      'critical'
    );
    // Warning thresholds: attendance < 92 OR meal < 82 OR tuition < 82
    assert.equal(
      evaluateClassStatus({ attendanceRate: 92.0, mealCompletionRate: 81.9, tuitionCollectionRate: 82.0 }),
      'warning'
    );
    assert.equal(
      evaluateClassStatus({ attendanceRate: 92.0, mealCompletionRate: 82.0, tuitionCollectionRate: 81.9 }),
      'warning'
    );
    // Stable threshold exact boundary
    assert.equal(
      evaluateClassStatus({ attendanceRate: 92.0, mealCompletionRate: 82.0, tuitionCollectionRate: 82.0 }),
      'stable'
    );
  });

  test('Adversarial 4: Full state reset clears search, status & grade scope simultaneously', () => {
    let state = dashboardReducer(undefined, { type: '@@INIT' });
    state = dashboardReducer(state, setTimeRange('year'));
    state = dashboardReducer(state, setGradeScope('khoi-3'));
    state = dashboardReducer(state, setDashboardSearchQuery('Hưng'));
    state = dashboardReducer(state, setDashboardStatusFilter('warning'));
    state = dashboardReducer(state, refreshDashboardData('15:25:00'));

    state = dashboardReducer(state, resetDashboardFilters());
    assert.equal(state.timeRange, 'month');
    assert.equal(state.gradeScope, 'all');
    assert.equal(state.searchQuery, '');
    assert.equal(state.statusFilter, 'all');
    assert.equal(state.lastRefreshedAt, '15:25:00');
  });

  // =========================================================================
  // CROSS-MODULE INTEGRITY AUDIT (ZERO BROKEN ROUTES / NO BLOCKERS)
  // =========================================================================

  test('Cross-Module Connectivity Audit: Every dashboard link & router.push resolves to a real Next.js page', () => {
    const dashboardFiles = [
      'src/modules/dashboard/WeeklyActivityChart.tsx',
      'src/modules/dashboard/BulletinBoardCard.tsx',
      'src/modules/dashboard/ApprovalCenterCard.tsx',
      'src/modules/dashboard/FrequentAbsenceCard.tsx',
      'src/modules/dashboard/ClassComparisonTable.tsx',
    ];

    const collectedPaths = new Set();
    const routePattern = /\$\{schoolCode\}(\/[a-zA-Z0-9_${}.-]+(?:\/[a-zA-Z0-9_${}.-]+)*)/g;

    for (const rel of dashboardFiles) {
      const content = fs.readFileSync(path.resolve(rel), 'utf8');
      let match;
      while ((match = routePattern.exec(content)) !== null) {
        // Normalize ${targetClassId} and ${item.classId} placeholders to [classId] dynamic segment
        const normalized = match[1].replace(/\$\{(?:targetClassId|item\.classId)\}/g, '[classId]');
        collectedPaths.add(normalized);
      }
    }

    // Also include the PortalLayout Tổng quan entry route itself
    collectedPaths.add('/dashboard');

    assert.ok(collectedPaths.size >= 6, 'Should audit at least 6 distinct target routes');

    for (const route of collectedPaths) {
      // Convert concrete class id e.g. /class/lop-1a1/attendance -> /class/[classId]/attendance
      const dynamicRoute = route.replace(/\/class\/[^/]+\//, '/class/[classId]/');
      const pagesRoot = path.resolve('src/pages/[schoolCode]');
      const candidateIndex = path.join(pagesRoot, dynamicRoute, 'index.tsx');
      const candidateFile = path.join(pagesRoot, `${dynamicRoute}.tsx`);

      const exists = fs.existsSync(candidateIndex) || fs.existsSync(candidateFile);
      assert.ok(
        exists,
        `Cross-module link target "${route}" (mapped to ${dynamicRoute}) has no Next.js page at ${candidateIndex} or ${candidateFile}`
      );
    }
  });

  test('Deep-Link Moderation Queue: Approval Center counts match Hoạt động pending posts & ?tab=cho_duyet routing', () => {
    const classIds = new Set(CLASSES_LIST.map((c) => c.id));

    for (const item of MOCK_APPROVAL_CENTER_ITEMS) {
      assert.ok(
        classIds.has(item.classId),
        `Approval Center classId "${item.classId}" must exist in standardized CLASSES_LIST`
      );
      const pendingPosts = filterActivityPosts(
        INITIAL_ACTIVITY_POSTS,
        item.classId,
        'cho_duyet',
        ''
      );
      assert.equal(
        pendingPosts.length,
        item.pendingCount,
        `Approval Center pendingCount (${item.pendingCount}) for ${item.classId} must equal actual cho_duyet posts (${pendingPosts.length})`
      );
    }

    const approvalSrc = fs.readFileSync(
      path.resolve('src/modules/dashboard/ApprovalCenterCard.tsx'),
      'utf8'
    );
    assert.ok(
      approvalSrc.includes('/class/${item.classId}/activity?tab=cho_duyet'),
      'ApprovalCenterCard links must navigate to /class/${item.classId}/activity?tab=cho_duyet'
    );

    const activityPageSrc = fs.readFileSync(
      path.resolve('src/pages/[schoolCode]/class/[classId]/activity/index.tsx'),
      'utf8'
    );
    assert.ok(activityPageSrc.includes('router.query.tab'), 'ActivityPage must read ?tab= query param');
    assert.ok(activityPageSrc.includes('setStatusFilter'), 'ActivityPage must auto-activate status filter tab');
    assert.ok(activityPageSrc.includes('onClassChange'), 'ActivityPage must wire class selector filter');
  });
});
