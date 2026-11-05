/**
 * Expense Filter Toolbar
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, SelectField, Button)
 */

import React from 'react';
import { VoucherType, VoucherLifecycleStatus } from '../../../types/expense';
import { FilterBar, Button } from '../../../components/ds';

interface ExpenseToolbarProps {
  schoolCode: string;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  selectedType: 'all' | VoucherType;
  onTypeChange: (type: 'all' | VoucherType) => void;
  selectedStatus: 'all' | VoucherLifecycleStatus;
  onStatusChange: (status: 'all' | VoucherLifecycleStatus) => void;
  onOpenCategoryModal: () => void;
  totalVouchersInMonth: number;
}

export const ExpenseToolbar: React.FC<ExpenseToolbarProps> = ({
  selectedMonth,
  onMonthChange,
  searchKeyword,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
  totalVouchersInMonth,
}) => {
  const isExportDisabled = totalVouchersInMonth === 0;

  const handleExport = () => {
    if (isExportDisabled) return;
    alert(`Đang xuất danh sách phiếu chi tháng ${selectedMonth} ra file Excel...`);
  };

  return (
    <FilterBar
      search={{
        placeholder: 'Mã phiếu, tên, người nhận...',
        value: searchKeyword,
        onChange: (val) => onSearchChange(val),
      }}
      filters={[
        {
          options: [
            { label: 'Tháng 12/2025', value: '2025-12' },
            { label: 'Tháng 09/2026', value: '2026-09' },
            { label: 'Tháng 10/2026', value: '2026-10' },
            { label: 'Tháng 11/2026', value: '2026-11' },
          ],
          value: selectedMonth,
          onChange: (val) => onMonthChange(val),
        },
        {
          options: [
            { label: 'Tất cả loại phiếu', value: 'all' },
            { label: 'Hoàn tiền học sinh', value: 'hoan_tien' },
            { label: 'Chi khác', value: 'khac' },
          ],
          value: selectedType,
          onChange: (val) => onTypeChange(val as any),
        },
        {
          options: [
            { label: 'Tất cả trạng thái', value: 'all' },
            { label: 'Bản nháp', value: 'da_tao' },
            { label: 'Đã duyệt', value: 'da_duyet' },
            { label: 'Đã chi', value: 'da_chi' },
            { label: 'Đã hủy', value: 'da_huy' },
          ],
          value: selectedStatus,
          onChange: (val) => onStatusChange(val as any),
        },
      ]}
    >
      <Button
        variant="secondary"
        icon="download"
        onClick={handleExport}
        disabled={isExportDisabled}
      >
        Xuất Excel
      </Button>
    </FilterBar>
  );
};
