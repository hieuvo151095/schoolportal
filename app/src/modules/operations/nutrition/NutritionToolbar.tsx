import React, { useRef } from 'react';
import { Button, CountedTabs, Dropdown, type DropdownOption, Icon, IconButton } from '@/components/ds';
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
  statusCounts?: {
    all: number;
    evaluated: number;
    pending: number;
  };
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
  statusCounts = { all: 0, evaluated: 0, pending: 0 },
}: NutritionToolbarProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const classOptions: DropdownOption[] = NUTRITION_CLASSES_LIST.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const mealOptions: DropdownOption[] = [
    { value: 'all', label: 'Tất cả khẩu phần' },
    { value: 'an_het_suat', label: 'Ăn hết suất' },
    { value: 'can_ho_tro', label: 'Cần hỗ trợ' },
    { value: 'bo_bua', label: 'Bỏ bữa' },
  ];

  const tabItems = [
    { id: 'all', label: 'Tất cả', count: statusCounts.all },
    { id: 'evaluated', label: 'Đã đánh giá', count: statusCounts.evaluated },
    { id: 'pending', label: 'Chưa đánh giá', count: statusCounts.pending },
  ];

  // Helper to change date by offset days
  const changeDate = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onDateChange(`${yyyy}-${mm}-${dd}`);
  };

  // Format date to DD/MM/YYYY
  const formattedDate = (() => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return selectedDate;
    } catch {
      return selectedDate;
    }
  })();

  return (
    <div>
      {/* 1. CountedTabs on top of card */}
      <CountedTabs
        tabs={tabItems}
        activeId={statusFilter}
        onChange={(id) => onStatusFilterChange(id as 'all' | 'evaluated' | 'pending')}
      />

      {/* 2. Single Frame Line 38px Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 sm:p-4 border-b border-[var(--border-default)] bg-[var(--bg-surface)] w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2.5 sm:gap-3 w-full lg:w-auto min-w-0">
          {/* Class Select */}
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

          {/* Date Navigator */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[var(--radius-8)] px-2 py-1 flex-shrink-0 min-w-0">
            <IconButton
              icon="chevron-left"
              label="Hôm trước"
              onClick={() => changeDate(-1)}
            />

            <button
              type="button"
              onClick={() => (dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.focus())}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                background: 'transparent',
                border: 0,
                padding: 'var(--space-4) var(--space-8)',
                color: 'var(--text-heading)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <Icon name="calendar-days" size={14} color="var(--eco-blue-strong)" />
              <span>{formattedDate}</span>
            </button>

            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
            />

            <IconButton
              icon="chevron-right"
              label="Hôm sau"
              onClick={() => changeDate(1)}
            />
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-60 md:w-72 flex-1 min-w-0">
            <div className="relative w-full">
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
          </div>

          {/* Meal Filter */}
          <div className="w-full sm:w-40 flex-shrink-0 min-w-0">
            <Dropdown
              options={mealOptions}
              value={mealFilter}
              onChange={(val) => onMealFilterChange(val as any)}
              placeholder="Chọn khẩu phần"
              fullWidth
              triggerClassName="h-[38px] text-[13px] rounded-[var(--radius-8)]"
            />
          </div>
        </div>

        {/* Right Action Button */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pt-1 lg:pt-0 min-w-0 flex-nowrap shrink-0">
            <Button
              variant="primary"
              icon="utensils"
              onClick={onOpenBulkCare}
              className="h-[38px] whitespace-nowrap !bg-teal-600 hover:!bg-teal-700 !border-teal-600"
            >
              Chăm sóc hàng loạt ({selectedCount} trẻ)
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
