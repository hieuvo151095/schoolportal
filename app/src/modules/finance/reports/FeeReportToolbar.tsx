/**
 * Fee Report Filter Toolbar
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (FilterBar SSOT)
 * Single frame line, 38px standard height, consistent 13px font size
 */

import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setDateRange,
  setClassFilter,
  setStudentSearch,
  setPaymentMethodFilter,
  setUnpaidStatusFilter,
  setOverdueOnly,
  resetFilters,
} from '../../../store/slices/feeReportSlice';
import { mockFeeReportClasses } from '../../../services/mockFeeReportData';
import type { FeeReportTab } from '../../../types/feeReport';
import { FilterBar, Button, IconButton, Tag, Icon, SelectFieldProps } from '../../../components/ds';

interface FeeReportToolbarProps {
  currentTab: FeeReportTab;
  recordCount: number;
  onExportExcel?: () => void;
}

export const FeeReportToolbar: React.FC<FeeReportToolbarProps> = ({
  currentTab,
  recordCount,
  onExportExcel,
}) => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.feeReport);

  const isPaidTab = currentTab === 'paid';
  const isUnpaidTab = currentTab === 'unpaid';
  const isOverviewTab = currentTab === 'overview';

  const classOptions = useMemo(() => [
    { value: 'tat_ca', label: 'Tất cả lớp học' },
    ...mockFeeReportClasses.map((cls) => ({
      value: cls.id,
      label: cls.name,
    })),
  ], []);

  // Construct filters array for FilterBar
  const selectFilters: SelectFieldProps[] = [
    {
      options: classOptions,
      value: filters.classId,
      onChange: (val) => dispatch(setClassFilter(val)),
      placeholder: 'Chọn lớp học',
    },
  ];

  if (isPaidTab) {
    selectFilters.push({
      options: [
        { value: 'all', label: 'Tất cả phương thức' },
        { value: 'cong_sepay', label: 'Ví FinViet / QR' },
        { value: 'chuyen_khoan', label: 'Chuyển khoản' },
        { value: 'tien_mat', label: 'Tiền mặt' },
        { value: 'the_pos', label: 'Thẻ POS' },
      ],
      value: filters.paymentMethod || 'all',
      placeholder: 'Chọn phương thức',
      onChange: (val) => dispatch(setPaymentMethodFilter(val)),
    });
  }

  if (isUnpaidTab) {
    selectFilters.push({
      options: [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'da_tao', label: 'Bản nháp' },
        { value: 'da_gui', label: 'Đã phát hành' },
      ],
      value: filters.unpaidStatus || 'all',
      placeholder: 'Chọn trạng thái',
      onChange: (val) => dispatch(setUnpaidStatusFilter(val as any)),
    });
  }

  return (
    <FilterBar
      search={
        isOverviewTab
          ? false
          : {
              placeholder: 'Tìm tên, mã HS, số HĐ...',
              value: filters.studentSearch || '',
              onChange: (val) => dispatch(setStudentSearch(val)),
            }
      }
      filters={selectFilters}
      actions={
        <div className="flex items-center gap-2">
          <Tag variant="code">
            {recordCount} {isOverviewTab ? 'lớp ghi nhận' : 'hóa đơn'}
          </Tag>
          {onExportExcel && (
            <Button
              variant="secondary"
              icon="download"
              onClick={onExportExcel}
            >
              Xuất Excel
            </Button>
          )}
        </div>
      }
    >
      {/* Date Range Picker with uniform Design System height (38px) & font (12-13px) */}
      <div className="inline-flex items-center gap-1.5 h-[38px] px-2.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-8)] text-[13px] flex-none">
        <Icon name="calendar" size={14} color="var(--text-subtle)" />
        <span className="text-[12px] font-medium text-[var(--text-subtle)] whitespace-nowrap">
          {isPaidTab ? 'Ngày TT:' : 'Kỳ:'}
        </span>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) =>
            dispatch(setDateRange({ dateFrom: e.target.value, dateTo: filters.dateTo }))
          }
          className="h-[28px] w-[110px] bg-transparent border-0 text-[12px] font-semibold text-[var(--text-heading)] focus:outline-none cursor-pointer p-0"
          title="Từ ngày"
        />
        <span className="text-[var(--text-subtle)] text-[12px]">—</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) =>
            dispatch(setDateRange({ dateFrom: filters.dateFrom, dateTo: e.target.value }))
          }
          className="h-[28px] w-[110px] bg-transparent border-0 text-[12px] font-semibold text-[var(--text-heading)] focus:outline-none cursor-pointer p-0"
          title="Đến ngày"
        />
      </div>

      {/* Unpaid-specific Overdue Toggle */}
      {isUnpaidTab && (
        <label className="inline-flex items-center gap-1.5 h-[38px] px-2 text-[13px] font-medium text-[var(--text-heading)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!filters.isOverdueOnly}
            onChange={(e) => dispatch(setOverdueOnly(e.target.checked))}
            className="w-4 h-4 rounded text-[var(--eco-blue-strong)] border-[var(--border-default)] focus:ring-0"
          />
          <span className="whitespace-nowrap">Chỉ quá hạn</span>
        </label>
      )}

      {/* Reset Filter Button */}
      <IconButton
        icon="rotate-right"
        label="Đặt lại bộ lọc"
        size="sm"
        onClick={() => dispatch(resetFilters())}
      />
    </FilterBar>
  );
};

export default FeeReportToolbar;
