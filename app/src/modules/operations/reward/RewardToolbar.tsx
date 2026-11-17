import React from 'react';
import { Button, CountedTabs, Dropdown, type DropdownOption } from '@/components/ds';
import { REWARD_CLASSES_LIST, REWARD_WEEKS_LIST } from '@/services/mockRewardData';
import type { RewardStatusFilter } from '@/types/reward';

interface RewardToolbarProps {
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  selectedWeekNumber: number;
  onWeekChange: (weekNumber: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: RewardStatusFilter;
  onStatusFilterChange: (status: RewardStatusFilter) => void;
  selectedCount: number;
  hasUnsavedChanges: boolean;
  isCurrentWeekPublished: boolean;
  onBulkAward: () => void;
  onBulkUnaward: () => void;
  onSaveChanges: () => void;
  onPublish: () => void;
  statusCounts?: {
    all: number;
    awarded: number;
    unawarded: number;
  };
}

export default function RewardToolbar({
  selectedClassId,
  onClassChange,
  selectedWeekNumber,
  onWeekChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedCount,
  hasUnsavedChanges,
  isCurrentWeekPublished,
  onBulkAward,
  onBulkUnaward,
  onSaveChanges,
  onPublish,
  statusCounts = { all: 0, awarded: 0, unawarded: 0 },
}: RewardToolbarProps) {
  const classOptions: DropdownOption[] = REWARD_CLASSES_LIST.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Clean, concise week labels preventing field overflow and text collision
  const weekOptions: DropdownOption[] = REWARD_WEEKS_LIST.map((w) => ({
    value: String(w.weekNumber),
    label: `Tuần ${w.weekNumber} (${w.weekRange.split('/2026')[0]})`,
  }));

  const tabItems = [
    { id: 'all', label: 'Tất cả', count: statusCounts.all },
    { id: 'awarded', label: 'Đã nhận phiếu', count: statusCounts.awarded },
    { id: 'unawarded', label: 'Chưa nhận phiếu', count: statusCounts.unawarded },
  ];

  return (
    <div>
      {/* 1. CountedTabs on top of card */}
      <CountedTabs
        tabs={tabItems}
        activeId={statusFilter}
        onChange={(id) => onStatusFilterChange(id as RewardStatusFilter)}
      />

      {/* 2. Single Frame Line 38px Filter Controls */}
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

          {/* Week Selector Dropdown */}
          <div className="w-full sm:w-56 flex-shrink-0 min-w-0">
            <Dropdown
              options={weekOptions}
              value={String(selectedWeekNumber)}
              onChange={(val) => onWeekChange(Number(val))}
              placeholder="Chọn tuần học"
              fullWidth
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>

          {/* Search Field */}
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

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pt-1 lg:pt-0 min-w-0 flex-nowrap shrink-0">
          {selectedCount > 0 ? (
            <>
              <Button
                variant="primary"
                icon="circle-check"
                onClick={onBulkAward}
                className="h-[38px] whitespace-nowrap !bg-teal-600 hover:!bg-teal-700 !border-teal-600"
              >
                Cấp phiếu ({selectedCount})
              </Button>
              <Button
                variant="ghost"
                icon="xmark"
                onClick={onBulkUnaward}
                className="h-[38px] whitespace-nowrap text-slate-600 hover:text-red-600"
              >
                Bỏ cấp
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={onSaveChanges}
                disabled={!hasUnsavedChanges}
                className={`h-[38px] whitespace-nowrap ${
                  hasUnsavedChanges ? '!border-amber-400 !text-amber-800 bg-amber-50' : ''
                }`}
              >
                {hasUnsavedChanges ? 'Lưu thay đổi *' : 'Đã lưu'}
              </Button>
              <Button
                variant="primary"
                icon="paper-plane"
                onClick={onPublish}
                className="h-[38px] whitespace-nowrap !bg-teal-600 hover:!bg-teal-700 !border-teal-600"
              >
                {isCurrentWeekPublished && !hasUnsavedChanges ? 'Đã công bố PH' : 'Công bố cho PH'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
