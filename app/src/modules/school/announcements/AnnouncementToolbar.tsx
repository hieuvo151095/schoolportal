/**
 * Announcement Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (CountedTabs & FilterBar SSOT)
 */

import React from 'react';
import {
  AnnouncementCategory,
  AnnouncementChannel,
  AnnouncementFilterState,
  AnnouncementStatus,
  AnnouncementSummaryKPI
} from '../../../types/announcement';
import { FilterBar, Button, CountedTabs, CountedTabItem, SelectFieldProps } from '../../../components/ds';

interface AnnouncementToolbarProps {
  schoolCode: string;
  filters: AnnouncementFilterState;
  kpis: AnnouncementSummaryKPI;
  onFilterChange: (updates: Partial<AnnouncementFilterState>) => void;
  onResetFilters: () => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onOpenCreate?: () => void;
}

export const AnnouncementToolbar: React.FC<AnnouncementToolbarProps> = ({
  filters,
  kpis,
  onFilterChange,
  onResetFilters,
  selectedCount,
  onBulkDelete,
  onOpenCreate
}) => {
  const isFilterActive =
    Boolean(filters.searchQuery) ||
    filters.statusFilter !== 'all' ||
    filters.categoryFilter !== 'all' ||
    filters.channelFilter !== 'all';

  const tabs: CountedTabItem[] = [
    { id: 'all', label: 'Tất cả', count: kpis.totalAnnouncements, icon: 'bullhorn' },
    { id: 'da_gui', label: 'Đã gửi', count: kpis.publishedCount, icon: 'paper-plane' },
    { id: 'da_len_lich', label: 'Đã lên lịch', count: kpis.scheduledCount, icon: 'clock' },
    { id: 'nhap', label: 'Bản nháp', count: kpis.draftCount, icon: 'pen-to-square' },
  ];

  const selectFilters: SelectFieldProps[] = [
    {
      placeholder: 'Chọn danh mục',
      value: filters.categoryFilter,
      defaultValue: 'all',
      onChange: (val) => onFilterChange({ categoryFilter: val as any }),
      options: [
        { value: 'all', label: 'Tất cả danh mục' },
        { value: 'chung', label: 'Thông báo chung' },
        { value: 'hoc_phi', label: 'Học phí & Thu chi' },
        { value: 'su_kien', label: 'Sự kiện & Lễ hội' },
        { value: 'khan_cap', label: 'Khẩn cấp' },
        { value: 'hoc_tap', label: 'Học tập & Thi cử' },
        { value: 'nghi_le', label: 'Nghỉ lễ & Nghỉ hè' },
      ],
      className: 'min-w-[140px]',
    },
    {
      placeholder: 'Chọn kênh gửi',
      value: filters.channelFilter,
      defaultValue: 'all',
      onChange: (val) => onFilterChange({ channelFilter: val as any }),
      options: [
        { value: 'all', label: 'Tất cả kênh gửi' },
        { value: 'portal', label: 'Bảng tin Portal' },
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
        { value: 'push', label: 'Mobile Push' },
      ],
      className: 'min-w-[130px]',
    },
  ];

  return (
    <div>
      {/* 1. CountedTabs on top */}
      <CountedTabs
        tabs={tabs}
        activeId={filters.statusFilter}
        onChange={(id) => onFilterChange({ statusFilter: id as any })}
      />

      {/* 2. FilterBar with Search, Filters and Right Actions */}
      <FilterBar
        search={{
          placeholder: 'Tìm theo tiêu đề, người gửi...',
          value: filters.searchQuery,
          onChange: (val) => onFilterChange({ searchQuery: val }),
        }}
        filters={selectFilters}
        actions={
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                icon="trash"
                onClick={onBulkDelete}
              >
                Xóa đã chọn ({selectedCount})
              </Button>
            )}
            {isFilterActive && (
              <Button
                variant="ghost"
                size="sm"
                icon="rotate-right"
                onClick={onResetFilters}
              >
                Đặt lại
              </Button>
            )}
            <Button
              variant="secondary"
              icon="download"
              onClick={() => alert('Đang xuất danh sách thông báo ra file Excel...')}
            >
              Xuất Excel
            </Button>
            {onOpenCreate && (
              <Button
                variant="primary"
                icon="plus"
                onClick={onOpenCreate}
              >
                Soạn thông báo
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default AnnouncementToolbar;
