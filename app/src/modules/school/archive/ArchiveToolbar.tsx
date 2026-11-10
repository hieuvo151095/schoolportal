/**
 * Archive Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, Button)
 */

import React from 'react';
import { FilterBar, Button } from '@/components/ds';

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
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
            <span>Tổng số:</span>
            <span className="text-[#0070CE] font-bold">{totalCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="month"
              value={archivePeriodMonth || ''}
              onChange={(e) => onMonthChange(e.target.value || undefined)}
              aria-label="Lọc theo tháng lưu trữ"
              title="Lọc theo tháng lưu trữ"
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-[#0070CE] focus:outline-hidden"
            />
            {archivePeriodMonth && (
              <Button
                variant="secondary"
                size="sm"
                icon="xmark"
                onClick={() => onMonthChange(undefined)}
              >
                Xóa lọc tháng
              </Button>
            )}
          </div>

          <Button
            variant="secondary"
            icon="download"
            onClick={onExportExcel}
          >
            Xuất Excel
          </Button>
        </div>
      }
    />
  );
};
