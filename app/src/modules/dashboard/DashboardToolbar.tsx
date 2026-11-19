import React from 'react';
import {
  Button,
  FilterBar,
  SegmentedControl,
} from '@/components/ds';
import { DASHBOARD_GRADE_OPTIONS } from '@/services/mockDashboardData';
import type { DashboardTimeRange } from '@/types/dashboard';

interface DashboardToolbarProps {
  timeRange: DashboardTimeRange;
  gradeScope: string;
  lastRefreshedAt: string;
  onTimeRangeChange: (range: DashboardTimeRange) => void;
  onGradeScopeChange: (scope: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  timeRange,
  gradeScope,
  lastRefreshedAt,
  onTimeRangeChange,
  onGradeScopeChange,
  onRefresh,
  onExport,
}) => {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-12)] overflow-visible shadow-2xs">
      <FilterBar
        className="border-0 rounded-[var(--radius-12)]"
        search={false}
        filters={[
          {
            placeholder: 'Chọn khối lớp',
            value: gradeScope,
            defaultValue: 'all',
            onChange: onGradeScopeChange,
            options: DASHBOARD_GRADE_OPTIONS,
          },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <span className="hidden xl:inline-flex items-center text-xs text-[var(--text-subtle)] mr-1 tabular-nums">
              Cập nhật: {lastRefreshedAt}
            </span>
            <Button
              variant="secondary"
              icon="arrow-rotate-right"
              onClick={onRefresh}
            >
              Làm mới
            </Button>
            <Button
              variant="secondary"
              icon="download"
              onClick={onExport}
            >
              Xuất báo cáo
            </Button>
          </div>
        }
      >
        <div className="w-full sm:w-auto overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
          <SegmentedControl<DashboardTimeRange>
            size="sm"
            className="w-max"
            value={timeRange}
            onChange={onTimeRangeChange}
            items={[
              { key: 'today', label: 'Hôm nay' },
              { key: 'week', label: 'Tuần này' },
              { key: 'month', label: 'Tháng này' },
              { key: 'term', label: 'Học kỳ I' },
              { key: 'year', label: 'Cả năm' },
            ]}
          />
        </div>
      </FilterBar>
    </div>
  );
};
