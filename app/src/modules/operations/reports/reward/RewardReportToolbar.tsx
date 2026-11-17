import React from 'react';
import { Button, Dropdown, type DropdownOption } from '@/components/ds';
import { REWARD_CLASSES_LIST } from '@/services/mockRewardData';
import { REWARD_REPORT_MONTHS } from '@/utils/rewardReportValidation';

interface RewardReportToolbarProps {
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport: () => void;
}

export default function RewardReportToolbar({
  selectedClassId,
  onClassChange,
  selectedMonth,
  onMonthChange,
  searchQuery,
  onSearchChange,
  onExport,
}: RewardReportToolbarProps) {
  const classOptions: DropdownOption[] = REWARD_CLASSES_LIST.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const monthOptions: DropdownOption[] = REWARD_REPORT_MONTHS.map((m) => ({
    value: m.value,
    label: m.label,
  }));

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 sm:p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2.5 sm:gap-3 w-full lg:w-auto min-w-0">
        {/* Class Selector Dropdown */}
        <div className="w-full sm:w-44 flex-shrink-0 min-w-0">
          <Dropdown
            options={classOptions}
            value={selectedClassId}
            onChange={(val) => onClassChange(val as string)}
            placeholder="Chọn lớp học"
            fullWidth
            triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
          />
        </div>

        {/* Month Selector Dropdown */}
        <div className="w-full sm:w-44 flex-shrink-0 min-w-0">
          <Dropdown
            options={monthOptions}
            value={selectedMonth}
            onChange={(val) => onMonthChange(val as string)}
            placeholder="Chọn tháng báo cáo"
            fullWidth
            triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
          />
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-60 md:w-72 flex-1 min-w-0">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm trẻ, mã..."
              className="w-full h-[38px] pl-9 pr-3 text-[13px] bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] text-[var(--text-heading)] placeholder:text-slate-400 focus:outline-none focus:border-[var(--eco-blue-strong)] focus:ring-1 focus:ring-[var(--eco-blue-strong)] transition-all"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Action Button - Export Excel */}
      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
        <Button
          variant="secondary"
          icon="download"
          onClick={onExport}
          className="h-[38px] whitespace-nowrap text-slate-700 hover:text-slate-900 border-[var(--border-default)] hover:bg-slate-50"
        >
          Xuất báo cáo
        </Button>
      </div>
    </div>
  );
}
