/**
 * Reconciliation Filter Toolbar
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (FilterBar SSOT)
 * Single frame line, 38px standard height, consistent 13px font size
 */

import React from 'react';
import { FilterBar, Button, Tag, Icon } from '../../../components/ds';

interface ReconciliationToolbarProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  sessionCount: number;
  onExport: () => void;
  maxDate?: string;
}

export const ReconciliationToolbar: React.FC<ReconciliationToolbarProps> = ({
  startDate,
  endDate,
  onDateChange,
  sessionCount,
  onExport,
  maxDate = '2026-09-12',
}) => {
  const isExportDisabled = sessionCount === 0;

  // Preset: 12 days before today (BR05 default)
  const handlePreset12Days = () => {
    onDateChange('2026-08-30', '2026-09-11');
  };

  // Preset: Month to date
  const handlePresetThisMonth = () => {
    onDateChange('2026-09-01', '2026-09-12');
  };

  return (
    <FilterBar
      search={false}
      actions={
        <div className="flex items-center gap-2">
          <Tag variant="code">{sessionCount} phiên tìm thấy</Tag>
          <Button
            variant="secondary"
            icon="download"
            onClick={onExport}
            disabled={isExportDisabled}
          >
            Xuất Excel
          </Button>
        </div>
      }
    >
      {/* Date Range Picker with uniform Design System height (38px) & font (13px) */}
      <div className="inline-flex items-center gap-2 h-[38px] px-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-[13px] flex-none">
        <Icon name="calendar" size={14} color="var(--text-subtle)" />
        <span className="text-[13px] font-medium text-[var(--text-subtle)] whitespace-nowrap">
          Khoảng thời gian:
        </span>
        <input
          type="date"
          value={startDate}
          max={endDate || maxDate}
          onChange={(e) => onDateChange(e.target.value, endDate)}
          className="h-[28px] bg-transparent border-0 text-[13px] font-semibold text-[var(--text-heading)] focus:outline-none cursor-pointer p-0"
          title="Từ ngày"
        />
        <span className="text-[var(--text-subtle)] text-[13px]">—</span>
        <input
          type="date"
          value={endDate}
          min={startDate}
          max={maxDate}
          onChange={(e) => onDateChange(startDate, e.target.value)}
          className="h-[28px] bg-transparent border-0 text-[13px] font-semibold text-[var(--text-heading)] focus:outline-none cursor-pointer p-0"
          title="Đến ngày"
        />
      </div>

      {/* Quick Presets matching standard height and typography */}
      <div className="flex items-center gap-2 flex-none">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePreset12Days}
        >
          12 ngày gần nhất
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePresetThisMonth}
        >
          Tháng này
        </Button>
      </div>
    </FilterBar>
  );
};

export default ReconciliationToolbar;
