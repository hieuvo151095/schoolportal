import React from 'react';
import { StaffAttendanceKPI } from '../../../types/staffAttendance';
import { StatCard } from '../../../components/ds';

interface StaffAttendanceSummaryCardsProps {
  kpis: StaffAttendanceKPI;
  searchQuery: string;
}

export const StaffAttendanceSummaryCards: React.FC<StaffAttendanceSummaryCardsProps> = ({
  kpis,
  searchQuery,
}) => {
  // BR10: Hide the 3 summary KPI counters when search query is active
  if (searchQuery.trim().length > 0) {
    return null;
  }

  return (
    <div
      data-testid="attendance-summary-cards"
      className="ecomd-stat-group grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4"
    >
      {/* 1. Tham dự */}
      <StatCard
        label="Tham dự"
        value={`${kpis.attendingCount}/${kpis.totalCount} NV`}
        icon="user-check"
        tone="info"
      />

      {/* 2. Nghỉ có phép */}
      <StatCard
        label="Nghỉ có phép"
        value={`${kpis.excusedAbsenceCount} NV`}
        icon="user-clock"
        tone="warning"
      />

      {/* 3. Nghỉ không phép */}
      <StatCard
        label="Nghỉ không phép"
        value={`${kpis.unexcusedAbsenceCount} NV`}
        icon="circle-xmark"
        tone="neutral"
      />
    </div>
  );
};
