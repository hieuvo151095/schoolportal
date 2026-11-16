/**
 * Calendar Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (CountedTabs & FilterBar SSOT)
 */

import React from 'react';
import { CalendarViewMode, EventScopeFilter } from '../../../types/calendar';
import { Button, IconButton, Dropdown, CountedTabs, CountedTabItem, FilterBar, Icon } from '../../../components/ds';

interface CalendarToolbarProps {
  schoolCode: string;
  selectedYear: number;
  selectedMonth: number;
  activeViewMode: CalendarViewMode;
  eventScopeFilter: EventScopeFilter;
  searchQuery: string;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onNextMonth: () => void;
  onPrevMonth: () => void;
  onTodayClick: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  onScopeFilterChange: (filter: EventScopeFilter) => void;
  onSearchChange: (query: string) => void;
  onOpenCreate?: () => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  schoolCode,
  selectedYear,
  selectedMonth,
  activeViewMode,
  eventScopeFilter,
  searchQuery,
  onYearChange,
  onMonthChange,
  onNextMonth,
  onPrevMonth,
  onTodayClick,
  onViewModeChange,
  onScopeFilterChange,
  onSearchChange,
  onOpenCreate,
}) => {
  const availableYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  const monthNames = [
    'Tháng 01',
    'Tháng 02',
    'Tháng 03',
    'Tháng 04',
    'Tháng 05',
    'Tháng 06',
    'Tháng 07',
    'Tháng 08',
    'Tháng 09',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const tabs: CountedTabItem[] = [
    { id: 'nam', label: 'Xem theo năm', icon: 'calendar' },
    { id: 'thang', label: 'Xem theo tháng', icon: 'calendar-days' },
    { id: 'su_kien', label: 'Danh sách sự kiện', icon: 'clipboard-list' },
  ];

  return (
    <div className="bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-6 py-4 shadow-xs sticky top-0 z-20 space-y-3">
      {/* 1. Header with Breadcrumb and CountedTabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] mb-1">
            <span>Nhà trường</span>
            <span>/</span>
            <span className="text-[var(--eco-blue-strong)] font-semibold">Lịch sự kiện</span>
          </div>
          <h1 className="text-lg font-bold text-[var(--text-heading)] flex items-center gap-2">
            <span className="text-[var(--eco-blue-strong)]">
              <Icon name="calendar-days" size={20} />
            </span>
            <span>Lịch sự kiện nhà trường</span>
          </h1>
        </div>

        {/* View Mode Switcher */}
        <CountedTabs
          tabs={tabs}
          activeId={activeViewMode}
          onChange={(id) => onViewModeChange(id as CalendarViewMode)}
        />
      </div>

      {/* 2. FilterBar with Year/Month Nav & Right-aligned Create Action */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm sự kiện...',
          value: searchQuery,
          onChange: onSearchChange,
        }}
        actions={
          onOpenCreate ? (
            <Button
              variant="primary"
              icon="plus"
              onClick={onOpenCreate}
            >
              Thêm sự kiện
            </Button>
          ) : undefined
        }
      >
        {/* Year Controller */}
        <div className="inline-flex items-center gap-1 flex-none">
          <IconButton
            icon="chevron-left"
            size="sm"
            label="Năm trước"
            onClick={() => onYearChange(selectedYear - 1)}
          />
          <div className="w-[125px]">
            <Dropdown
              size="md"
              value={String(selectedYear)}
              onChange={(val) => onYearChange(Number(val))}
              options={availableYears.map((yr) => ({ value: String(yr), label: `Năm ${yr}` }))}
            />
          </div>
          <IconButton
            icon="chevron-right"
            size="sm"
            label="Năm sau"
            onClick={() => onYearChange(selectedYear + 1)}
          />
        </div>

        {/* Month Controller (shown when activeViewMode === 'thang') */}
        {activeViewMode === 'thang' && (
          <div className="inline-flex items-center gap-1 flex-none">
            <IconButton
              icon="chevron-left"
              size="sm"
              label="Tháng trước"
              onClick={onPrevMonth}
            />
            <div className="w-[130px]">
              <Dropdown
                size="md"
                value={String(selectedMonth)}
                onChange={(val) => onMonthChange(Number(val))}
                options={monthNames.map((name, idx) => ({ value: String(idx + 1), label: name }))}
              />
            </div>
            <IconButton
              icon="chevron-right"
              size="sm"
              label="Tháng sau"
              onClick={onNextMonth}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={onTodayClick}
              className="ml-1"
            >
              Hôm nay
            </Button>
          </div>
        )}

        {/* Agenda Scope Filter (shown when activeViewMode === 'su_kien') */}
        {activeViewMode === 'su_kien' && (
          <div className="w-[170px] flex-none">
            <Dropdown
              size="md"
              value={eventScopeFilter}
              onChange={(val) => onScopeFilterChange(val as EventScopeFilter)}
              options={[
                { value: 'sap_toi', label: 'Sự kiện sắp tới' },
                { value: 'tat_ca', label: 'Tất cả sự kiện' },
              ]}
            />
          </div>
        )}
      </FilterBar>
    </div>
  );
};

export default CalendarToolbar;
