import React from 'react';
import { Button, Dropdown, type DropdownOption } from '@/components/ds';
import { NUTRITION_CLASSES_LIST } from '@/services/mockNutritionData';

interface NutritionToolbarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedClassId: string;
  onClassChange: (classId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: 'all' | 'evaluated' | 'pending';
  onStatusFilterChange: (status: 'all' | 'evaluated' | 'pending') => void;
  mealFilter: 'all' | 'an_het_suat' | 'can_ho_tro' | 'bo_bua';
  onMealFilterChange: (meal: 'all' | 'an_het_suat' | 'can_ho_tro' | 'bo_bua') => void;
  selectedCount: number;
  onOpenBulkCare: () => void;
  onQuickEvaluateAll: () => void;
}

export default function NutritionToolbar({
  selectedDate,
  onDateChange,
  selectedClassId,
  onClassChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  mealFilter,
  onMealFilterChange,
  selectedCount,
  onOpenBulkCare,
  onQuickEvaluateAll,
}: NutritionToolbarProps) {
  const classOptions: DropdownOption[] = NUTRITION_CLASSES_LIST.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const statusOptions: DropdownOption[] = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'evaluated', label: 'Đã đánh giá' },
    { value: 'pending', label: 'Chưa đánh giá' },
  ];

  const mealOptions: DropdownOption[] = [
    { value: 'all', label: 'Tất cả khẩu phần' },
    { value: 'an_het_suat', label: 'Ăn hết suất' },
    { value: 'can_ho_tro', label: 'Cần hỗ trợ' },
    { value: 'bo_bua', label: 'Bỏ bữa' },
  ];

  return (
    <div className="bg-white rounded-[var(--radius-8)] border border-[var(--border-default)] p-3 mb-5 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left & Middle Filters - Single Frame Line 38px */}
        <div className="flex flex-wrap items-center gap-2.5 flex-grow">
          {/* Search Field */}
          <div className="relative w-full sm:w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm tên, mã trẻ..."
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

          {/* Date Picker */}
          <div className="w-full sm:w-[150px]">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full h-[38px] px-3 text-[13px] bg-white border border-[var(--border-default)] rounded-[var(--radius-8)] text-[var(--text-heading)] focus:outline-none focus:border-[var(--eco-blue-strong)] transition-all"
            />
          </div>

          {/* Class Dropdown */}
          <div className="w-full sm:w-[190px]">
            <Dropdown
              options={classOptions}
              value={selectedClassId}
              onChange={(val) => onClassChange(val as string)}
              placeholder="Chọn lớp học"
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-[160px]">
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => onStatusFilterChange(val as any)}
              placeholder="Chọn trạng thái"
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>

          {/* Meal Filter Dropdown */}
          <div className="w-full sm:w-[160px]">
            <Dropdown
              options={mealOptions}
              value={mealFilter}
              onChange={(val) => onMealFilterChange(val as any)}
              placeholder="Chọn khẩu phần"
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
          {selectedCount > 0 ? (
            <Button
              variant="primary"
              icon="heart-pulse"
              onClick={onOpenBulkCare}
              className="h-[38px] whitespace-nowrap !bg-teal-600 hover:!bg-teal-700 !border-teal-600"
            >
              Chăm sóc hàng loạt ({selectedCount} trẻ)
            </Button>
          ) : (
            <Button
              variant="secondary"
              icon="circle-check"
              onClick={onQuickEvaluateAll}
              className="h-[38px] whitespace-nowrap"
            >
              Đánh giá nhanh cả lớp
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
