/**
 * Discount Toolbar Component (Miễn Giảm)
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * CountedTabs, SearchField, SelectField, and Excel Export button.
 */

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setFilter, openCreateModal } from '../../../store/slices/discountSlice';
import { addToast } from '../../../store/slices/toastSlice';
import { AVAILABLE_FEE_ITEMS_FOR_DISCOUNT } from '../../../services/mockDiscountData';
import { exportDiscountPoliciesToCSV } from './discountExport';
import { CountedTabs, FilterBar, Button } from '../../../components/ds';

interface DiscountToolbarProps {
  filteredCount: number;
  totalCount: number;
}

export const DiscountToolbar: React.FC<DiscountToolbarProps> = ({
  filteredCount,
  totalCount,
}) => {
  const dispatch = useAppDispatch();
  const { policies, filters } = useAppSelector((state) => state.discount);

  const statusCounts = {
    all: policies.length,
    active: policies.filter((p) => p.status === 'active').length,
    paused: policies.filter((p) => p.status === 'paused').length,
    expired: policies.filter((p) => p.status === 'expired').length,
  };

  const handleExport = () => {
    if (policies.length === 0) {
      dispatch(
        addToast({
          type: 'warning',
          message: 'Không có dữ liệu chính sách miễn giảm để xuất!',
        })
      );
      return;
    }
    exportDiscountPoliciesToCSV(policies);
    dispatch(
      addToast({
        type: 'success',
        message: 'Xuất danh sách chính sách miễn giảm thành công!',
      })
    );
  };

  const feeOptions = [
    { value: 'all', label: 'Tất cả khoản phí' },
    ...AVAILABLE_FEE_ITEMS_FOR_DISCOUNT.map((fee) => ({
      value: fee.id,
      label: fee.name,
    })),
  ];

  return (
    <div>
      {/* 1. Top CountedTabs */}
      <CountedTabs
        tabs={[
          { id: 'all', label: 'Tất cả', count: statusCounts.all },
          { id: 'active', label: 'Đang hoạt động', count: statusCounts.active },
          { id: 'paused', label: 'Ngừng áp dụng', count: statusCounts.paused },
          { id: 'expired', label: 'Hết hạn', count: statusCounts.expired },
        ]}
        activeId={filters.statusFilter || 'all'}
        onChange={(id) => dispatch(setFilter({ statusFilter: id as any }))}
      />

      {/* 2. Standard DS FilterBar */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm theo tên chính sách, lý do...',
          value: filters.search,
          onChange: (val) => dispatch(setFilter({ search: val })),
        }}
        filters={[
          {
            options: feeOptions,
            value: filters.feeItemIdFilter || 'all',
            onChange: (val) => dispatch(setFilter({ feeItemIdFilter: val })),
          },
        ]}
        action={{
          label: 'Thêm chính sách miễn giảm',
          onClick: () => dispatch(openCreateModal()),
        }}
      >
        <Button
          variant="secondary"
          icon="download"
          onClick={handleExport}
          disabled={policies.length === 0}
        >
          Xuất Excel
        </Button>
      </FilterBar>
    </div>
  );
};
