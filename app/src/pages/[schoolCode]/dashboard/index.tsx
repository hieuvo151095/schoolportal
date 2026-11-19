/**
 * Executive Overview Dashboard Page (Tổng Quan Điều Hành)
 * Design System: [DS] ECO ME DASHBOARD v2.6.0
 */

import React, { useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { PageHeader } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  refreshDashboardData,
  setDashboardSearchQuery,
  setDashboardStatusFilter,
  setGradeScope,
  setTimeRange,
} from '@/store/slices/dashboardSlice';
import { addToast } from '@/store/slices/toastSlice';
import {
  MOCK_APPROVAL_CENTER_ITEMS,
  MOCK_BULLETIN_BOARD_ITEMS,
  MOCK_CARE_WELLNESS_TREND,
  MOCK_CLASS_PERFORMANCE_MATRIX,
  MOCK_FREQUENT_ABSENCE_STUDENTS,
  MOCK_GRADE_CENSUS,
  MOCK_MONTHLY_CASHFLOW,
  MOCK_WEEKLY_ACTIVITY_POSTS,
} from '@/services/mockDashboardData';
import {
  computeExecutiveKPIs,
  filterApprovalCenter,
  filterBulletinBoard,
  filterCashflowSeries,
  filterClassPerformanceMatrix,
  filterFrequentAbsences,
  filterWeeklyActivityPosts,
  filterWellnessTrend,
} from '@/utils/dashboardAnalytics';
import { DashboardToolbar } from '@/modules/dashboard/DashboardToolbar';
import { ExecutiveKpiCards } from '@/modules/dashboard/ExecutiveKpiCards';
import { FinanceCashflowChart } from '@/modules/dashboard/FinanceCashflowChart';
import { StudentCensusDonut } from '@/modules/dashboard/StudentCensusDonut';
import { CareWellnessTrendChart } from '@/modules/dashboard/CareWellnessTrendChart';
import { WeeklyActivityChart } from '@/modules/dashboard/WeeklyActivityChart';
import { BulletinBoardCard } from '@/modules/dashboard/BulletinBoardCard';
import { ApprovalCenterCard } from '@/modules/dashboard/ApprovalCenterCard';
import { FrequentAbsenceCard } from '@/modules/dashboard/FrequentAbsenceCard';
import { ClassComparisonTable } from '@/modules/dashboard/ClassComparisonTable';

export default function ExecutiveDashboardPage() {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();

  const {
    timeRange,
    gradeScope,
    searchQuery,
    statusFilter,
    lastRefreshedAt,
  } = useAppSelector((state) => state.dashboard);

  const kpis = useMemo(
    () =>
      computeExecutiveKPIs(
        gradeScope,
        timeRange,
        MOCK_GRADE_CENSUS,
        MOCK_CLASS_PERFORMANCE_MATRIX,
        MOCK_MONTHLY_CASHFLOW
      ),
    [gradeScope, timeRange]
  );

  const cashflowSeries = useMemo(
    () =>
      filterCashflowSeries(
        timeRange,
        gradeScope,
        MOCK_MONTHLY_CASHFLOW,
        MOCK_GRADE_CENSUS
      ),
    [timeRange, gradeScope]
  );

  const wellnessTrend = useMemo(
    () =>
      filterWellnessTrend(
        gradeScope,
        MOCK_CARE_WELLNESS_TREND,
        MOCK_CLASS_PERFORMANCE_MATRIX
      ),
    [gradeScope]
  );

  const weeklyActivities = useMemo(
    () =>
      filterWeeklyActivityPosts(
        gradeScope,
        MOCK_WEEKLY_ACTIVITY_POSTS,
        MOCK_GRADE_CENSUS
      ),
    [gradeScope]
  );

  const bulletinItems = useMemo(
    () => filterBulletinBoard(gradeScope, MOCK_BULLETIN_BOARD_ITEMS),
    [gradeScope]
  );

  const approvalItems = useMemo(
    () => filterApprovalCenter(gradeScope, MOCK_APPROVAL_CENTER_ITEMS),
    [gradeScope]
  );

  const frequentAbsenceItems = useMemo(
    () => filterFrequentAbsences(gradeScope, MOCK_FREQUENT_ABSENCE_STUDENTS),
    [gradeScope]
  );

  const allGradeFilteredClasses = useMemo(
    () =>
      filterClassPerformanceMatrix(
        MOCK_CLASS_PERFORMANCE_MATRIX,
        gradeScope,
        '',
        'all'
      ),
    [gradeScope]
  );

  const filteredClasses = useMemo(
    () =>
      filterClassPerformanceMatrix(
        MOCK_CLASS_PERFORMANCE_MATRIX,
        gradeScope,
        searchQuery,
        statusFilter
      ),
    [gradeScope, searchQuery, statusFilter]
  );

  const handleRefresh = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    dispatch(refreshDashboardData(`Hôm nay ${hh}:${mm}:${ss}`));
    dispatch(
      addToast({
        type: 'success',
        title: 'Đã đồng bộ dữ liệu',
        message: 'Số liệu điều hành mới nhất từ toàn bộ các phân hệ đã được cập nhật.',
      })
    );
  };

  const handleExport = () => {
    dispatch(
      addToast({
        type: 'info',
        title: 'Đang xuất báo cáo Tổng quan',
        message: 'Hệ thống đang tổng hợp file Excel báo cáo điều hành toàn trường...',
      })
    );
  };

  return (
    <PortalLayout schoolCode={schoolCode}>
      <Head>
        <title>Tổng Quan Điều Hành | ECO School Portal</title>
      </Head>

      <div className="space-y-5">
        {/* 1. Page Header */}
        <PageHeader
          title="Tổng Quan Điều Hành"
          description="Toàn cảnh quy mô sĩ số, chuyên cần, dòng tiền học phí, hoạt động lớp học và phản hồi phụ huynh"
        />

        {/* 2. Global Dashboard Scope & Time Range Controls */}
        <DashboardToolbar
          timeRange={timeRange}
          gradeScope={gradeScope}
          lastRefreshedAt={lastRefreshedAt}
          onTimeRangeChange={(range) => dispatch(setTimeRange(range))}
          onGradeScopeChange={(scope) => dispatch(setGradeScope(scope))}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* 3. 4 North Star Executive KPI Cards */}
        <ExecutiveKpiCards kpis={kpis} />

        {/* 4. Row 1 Charts: Finance Cashflow + Student Census & Capacity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">
          <FinanceCashflowChart data={cashflowSeries} />
          <StudentCensusDonut
            grades={MOCK_GRADE_CENSUS}
            activeGradeScope={gradeScope}
            onSelectGrade={(id) => dispatch(setGradeScope(id))}
          />
        </div>

        {/* 5. Row 2 Charts: Care & Attendance Trend + Weekly Activity & Parent Hearts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">
          <CareWellnessTrendChart data={wellnessTrend} />
          <WeeklyActivityChart data={weeklyActivities} schoolCode={schoolCode} />
        </div>

        {/* 6. Row 3 Operational Widgets: Bảng thông tin, Trung tâm kiểm duyệt, Học sinh vắng nhiều */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <BulletinBoardCard items={bulletinItems} schoolCode={schoolCode} />
          <ApprovalCenterCard
            items={approvalItems}
            schoolCode={schoolCode}
            onRefresh={handleRefresh}
          />
          <FrequentAbsenceCard
            items={frequentAbsenceItems}
            schoolCode={schoolCode}
            monthLabel="T11"
          />
        </div>

        {/* 7. Class Performance Matrix Table */}
        <ClassComparisonTable
          rows={filteredClasses}
          allGradeFilteredRows={allGradeFilteredClasses}
          schoolCode={schoolCode}
          searchQuery={searchQuery}
          gradeScope={gradeScope}
          statusFilter={statusFilter}
          onSearchChange={(q) => dispatch(setDashboardSearchQuery(q))}
          onGradeScopeChange={(scope) => dispatch(setGradeScope(scope))}
          onStatusFilterChange={(st) => dispatch(setDashboardStatusFilter(st))}
        />
      </div>
    </PortalLayout>
  );
}
