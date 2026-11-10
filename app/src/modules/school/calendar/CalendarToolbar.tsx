/**
 * Calendar Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import Link from 'next/link';
import { CalendarViewMode, EventScopeFilter } from '../../../types/calendar';
import { Button, Icon, Dropdown } from '../../../components/ds';

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

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-neutral)',
        padding: 'var(--space-4) var(--space-6)',
        boxShadow: 'var(--shadow-xs)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Top row: Title, View Switcher & Action CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span>Trang chủ</span>
            <span>/</span>
            <span>Nhà trường</span>
            <span>/</span>
            <span style={{ color: 'var(--eco-blue-strong)', fontWeight: 'var(--font-semibold)' }}>Lịch sự kiện</span>
          </div>
          <h1 className="h4" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ color: 'var(--eco-blue-strong)' }}>
              <Icon name="calendar-days" size={20} />
            </span>
            <span>Lịch sự kiện nhà trường</span>
          </h1>
        </div>

        {/* View Mode Switcher & Create Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {/* 3 View Tabs: Năm, Tháng, Sự kiện */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--bg-secondary)',
              padding: '2px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-neutral)',
            }}
          >
            <button
              type="button"
              onClick={() => onViewModeChange('nam')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: activeViewMode === 'nam' ? 'var(--font-bold)' : 'var(--font-medium)',
                background: activeViewMode === 'nam' ? 'var(--bg-surface)' : 'transparent',
                color: activeViewMode === 'nam' ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'nam' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon name="calendar" size={12} />
              <span>Năm</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('thang')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: activeViewMode === 'thang' ? 'var(--font-bold)' : 'var(--font-medium)',
                background: activeViewMode === 'thang' ? 'var(--bg-surface)' : 'transparent',
                color: activeViewMode === 'thang' ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'thang' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon name="calendar-days" size={12} />
              <span>Tháng</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('su_kien')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontWeight: activeViewMode === 'su_kien' ? 'var(--font-bold)' : 'var(--font-medium)',
                background: activeViewMode === 'su_kien' ? 'var(--bg-surface)' : 'transparent',
                color: activeViewMode === 'su_kien' ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeViewMode === 'su_kien' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon name="clipboard-list" size={12} />
              <span>Sự kiện</span>
            </button>
          </div>

          {/* CTA Create Button */}
          <Link
            href={`/${schoolCode}/school/calendar/create`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--eco-blue-strong)',
              color: '#ffffff',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-bold)',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Icon name="plus" size={13} />
            <span>Thêm sự kiện</span>
          </Link>
        </div>
      </div>

      {/* Bottom row: Time context selectors & Search */}
      <div
        style={{
          marginTop: 'var(--space-3)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
        }}
      >
        {/* Year & Month Controllers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {/* Year Combobox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--font-medium)', textTransform: 'uppercase' }}>
              Năm:
            </span>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <button
                type="button"
                onClick={() => onYearChange(selectedYear - 1)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid var(--border-neutral)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
                title="Năm trước"
              >
                <Icon name="chevron-left" size={11} />
              </button>
              <div style={{ width: '90px' }}>
                <Dropdown
                  size="sm"
                  value={String(selectedYear)}
                  onChange={(val) => onYearChange(Number(val))}
                  options={availableYears.map((yr) => ({ value: String(yr), label: `${yr}` }))}
                />
              </div>
              <button
                type="button"
                onClick={() => onYearChange(selectedYear + 1)}
                style={{
                  padding: '6px 8px',
                  border: '1px solid var(--border-neutral)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
                title="Năm sau"
              >
                <Icon name="chevron-right" size={11} />
              </button>
            </div>
          </div>

          {/* Month Controller (shown when activeViewMode === 'thang') */}
          {activeViewMode === 'thang' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ color: 'var(--border-neutral)' }}>|</span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={onPrevMonth}
                  style={{
                    padding: '6px 8px',
                    border: '1px solid var(--border-neutral)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                  title="Tháng trước"
                >
                  <Icon name="chevron-left" size={11} />
                </button>
                <div style={{ width: '120px' }}>
                  <Dropdown
                    size="sm"
                    value={String(selectedMonth)}
                    onChange={(val) => onMonthChange(Number(val))}
                    options={monthNames.map((name, idx) => ({ value: String(idx + 1), label: name }))}
                  />
                </div>
                <button
                  type="button"
                  onClick={onNextMonth}
                  style={{
                    padding: '6px 8px',
                    border: '1px solid var(--border-neutral)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                  title="Tháng sau"
                >
                  <Icon name="chevron-right" size={11} />
                </button>
              </div>

              {/* Quick Jump to Today */}
              <button
                type="button"
                onClick={onTodayClick}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-neutral)',
                  background: 'var(--bg-secondary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-semibold)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                }}
              >
                Hôm nay
              </button>
            </div>
          )}

          {/* Agenda Scope Filter (shown when activeViewMode === 'su_kien') */}
          {activeViewMode === 'su_kien' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ color: 'var(--border-neutral)' }}>|</span>
              <div
                style={{
                  display: 'inline-flex',
                  background: 'var(--bg-secondary)',
                  padding: '2px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-neutral)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onScopeFilterChange('sap_toi')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: eventScopeFilter === 'sap_toi' ? 'var(--font-bold)' : 'var(--font-medium)',
                    background: eventScopeFilter === 'sap_toi' ? 'var(--bg-surface)' : 'transparent',
                    color: eventScopeFilter === 'sap_toi' ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Sự kiện sắp tới
                </button>
                <button
                  type="button"
                  onClick={() => onScopeFilterChange('tat_ca')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: eventScopeFilter === 'tat_ca' ? 'var(--font-bold)' : 'var(--font-medium)',
                    background: eventScopeFilter === 'tat_ca' ? 'var(--bg-surface)' : 'transparent',
                    color: eventScopeFilter === 'tat_ca' ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Tất cả sự kiện
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Input Filter */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }}>
            <Icon name="search" size={12} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm sự kiện..."
            style={{
              width: '100%',
              paddingLeft: '32px',
              paddingRight: searchQuery ? '28px' : '10px',
              paddingTop: '6px',
              paddingBottom: '6px',
              border: '1px solid var(--border-neutral)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Xóa tìm kiếm"
            >
              <Icon name="xmark" size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
