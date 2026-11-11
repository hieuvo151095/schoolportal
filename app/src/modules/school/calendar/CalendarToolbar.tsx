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
          <div className="flex items-center gap-2">
            {onOpenCreate && (
              <Button
                variant="primary"
                icon="plus"
                onClick={onOpenCreate}
              >
                Thêm sự kiện
              </Button>
            )}
          </div>
        }
      >
        {/* Year Controller */}
        <div className="inline-flex items-center gap-1 h-[38px] px-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-[13px] flex-none">
          <span className="text-xs font-medium text-[var(--text-subtle)] uppercase px-1">
            Năm:
          </span>
          <IconButton
            icon="chevron-left"
            size="sm"
            label="Năm trước"
            onClick={() => onYearChange(selectedYear - 1)}
          />
          <div className="w-[84px]">
            <Dropdown
              size="sm"
              value={String(selectedYear)}
              onChange={(val) => onYearChange(Number(val))}
              options={availableYears.map((yr) => ({ value: String(yr), label: `${yr}` }))}
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
          <div className="inline-flex items-center gap-2 flex-none">
            <div className="inline-flex items-center gap-1 h-[38px] px-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-[13px]">
              <span className="text-xs font-medium text-[var(--text-subtle)] uppercase px-1">
                Tháng:
              </span>
              <IconButton
                icon="chevron-left"
                size="sm"
                label="Tháng trước"
                onClick={onPrevMonth}
              />
              <div className="w-[110px]">
                <Dropdown
                  size="sm"
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
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={onTodayClick}
            >
              Hôm nay
            </Button>
          </div>
        )}

        {/* Agenda Scope Filter (shown when activeViewMode === 'su_kien') */}
        {activeViewMode === 'su_kien' && (
          <div className="inline-flex items-center gap-2 flex-none">
            <Button
              variant={eventScopeFilter === 'sap_toi' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onScopeFilterChange('sap_toi')}
            >
              Sự kiện sắp tới
            </Button>
            <Button
              variant={eventScopeFilter === 'tat_ca' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onScopeFilterChange('tat_ca')}
            >
              Tất cả sự kiện
            </Button>
          </div>
        )}
      </FilterBar>
    </div>
  );
};

export default CalendarToolbar;
