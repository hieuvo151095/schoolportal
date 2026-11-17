import React from 'react';
import { Button, Dropdown, type DropdownOption } from '@/components/ds';
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
}: RewardToolbarProps) {
  const classOptions: DropdownOption[] = REWARD_CLASSES_LIST.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const weekOptions: DropdownOption[] = REWARD_WEEKS_LIST.map((w) => ({
    value: String(w.weekNumber),
    label: w.label,
  }));

  const statusOptions: DropdownOption[] = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'awarded', label: 'Đã nhận phiếu' },
    { value: 'unawarded', label: 'Chưa nhận phiếu' },
  ];

  return (
    <div className="bg-white rounded-[var(--radius-8)] border border-[var(--border-default)] p-3 mb-5 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left & Middle Filters - Single Frame Line 38px */}
        <div className="flex flex-wrap items-center gap-2 flex-grow min-w-0">
          {/* Search Field */}
          <div className="relative w-full sm:w-[180px] lg:w-[200px]">
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

          {/* Week Selector Dropdown */}
          <div className="w-full sm:w-[210px]">
            <Dropdown
              options={weekOptions}
              value={String(selectedWeekNumber)}
              onChange={(val) => onWeekChange(Number(val))}
              placeholder="Chọn tuần học"
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>

          {/* Class Selector Dropdown */}
          <div className="w-full sm:w-[160px]">
            <Dropdown
              options={classOptions}
              value={selectedClassId}
              onChange={(val) => onClassChange(val as string)}
              placeholder="Chọn lớp học"
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-[150px]">
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => onStatusFilterChange(val as any)}
              placeholder="Chọn trạng thái"
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
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
