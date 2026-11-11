/**
 * Archive Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (FilterBar SSOT)
 * Single frame line, 38px standard height, consistent 13px font size
 */

import React from 'react';
import { FilterBar, Button, Tag, Icon } from '@/components/ds';

interface ArchiveToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  archivePeriodMonth?: string;
  onMonthChange: (month?: string) => void;
  onExportExcel: () => void;
  totalCount: number;
}

export const ArchiveToolbar: React.FC<ArchiveToolbarProps> = ({
  searchQuery,
  onSearchChange,
  archivePeriodMonth,
  onMonthChange,
  onExportExcel,
  totalCount,
}) => {
  return (
    <FilterBar
      search={{
        placeholder: 'Tìm kiếm theo tên, mã HS, lớp cũ, lý do...',
        value: searchQuery,
        onChange: onSearchChange,
      }}
      actions={
        <div className="flex items-center gap-2">
          <Tag variant="code">{totalCount} học sinh</Tag>
          <Button
            variant="secondary"
            icon="download"
            onClick={onExportExcel}
          >
            Xuất Excel
          </Button>
        </div>
      }
    >
      {/* Month filter on the left with uniform Design System height (38px) & font (13px) */}
      <div className="inline-flex items-center gap-2 h-[38px] px-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-[13px] flex-none">
        <Icon name="calendar" size={14} color="var(--text-subtle)" />
        <span className="text-[13px] font-medium text-[var(--text-subtle)] whitespace-nowrap">
          Tháng lưu trữ:
        </span>
        <input
          type="month"
          value={archivePeriodMonth || ''}
          onChange={(e) => onMonthChange(e.target.value || undefined)}
          aria-label="Lọc theo tháng lưu trữ"
          title="Lọc theo tháng lưu trữ"
          className="h-[28px] bg-transparent border-0 text-[13px] font-semibold text-[var(--text-heading)] focus:outline-none cursor-pointer p-0"
        />
        {archivePeriodMonth && (
          <button
            type="button"
            onClick={() => onMonthChange(undefined)}
            className="text-[var(--text-subtle)] hover:text-[var(--text-primary)] cursor-pointer text-xs ml-1"
            title="Xóa lọc tháng"
          >
            <Icon name="xmark" size={12} />
          </button>
        )}
      </div>
    </FilterBar>
  );
};

export default ArchiveToolbar;
