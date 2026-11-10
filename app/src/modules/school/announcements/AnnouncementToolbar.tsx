/**
 * Announcement Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React from 'react';
import Link from 'next/link';
import {
  AnnouncementCategory,
  AnnouncementChannel,
  AnnouncementFilterState,
  AnnouncementStatus,
  AnnouncementSummaryKPI
} from '../../../types/announcement';
import { FilterBar, Button, Icon } from '../../../components/ds';

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
  schoolCode,
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

  const statusTabs: { id: 'all' | AnnouncementStatus; label: string; count: number }[] = [
    { id: 'all', label: 'Tất cả', count: kpis.totalAnnouncements },
    { id: 'da_gui', label: 'Đã gửi', count: kpis.publishedCount },
    { id: 'da_len_lich', label: 'Đã lên lịch', count: kpis.scheduledCount },
    { id: 'nhap', label: 'Bản nháp', count: kpis.draftCount },
  ];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-neutral)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      {/* Top row: Status Tabs & Bulk / Create Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          paddingBottom: 'var(--space-2)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {/* Status segmented pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', overflowX: 'auto' }}>
          {statusTabs.map((tab) => {
            const isActive = filters.statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange({ statusFilter: tab.id })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isActive ? 'var(--font-bold)' : 'var(--font-medium)',
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  color: isActive ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--eco-blue-border, #bfdbfe)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 'var(--font-bold)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--eco-blue-strong)' : 'var(--bg-secondary)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Bulk actions or New announcement button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {selectedCount > 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                background: '#fee2e2',
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--semantic-red)' }}>
                Đã chọn {selectedCount} mục
              </span>
              <button
                type="button"
                onClick={onBulkDelete}
                style={{
                  padding: '4px 8px',
                  background: 'var(--semantic-red)',
                  color: '#ffffff',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-bold)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                Xóa đã chọn
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* FilterBar with Search and Select filters */}
      <FilterBar
        search={{
          placeholder: 'Tìm theo tiêu đề, người gửi...',
          value: filters.searchQuery,
          onChange: (val) => onFilterChange({ searchQuery: val }),
        }}
        filters={[
          {
            label: 'Danh mục',
            value: filters.categoryFilter,
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
          },
          {
            label: 'Kênh gửi',
            value: filters.channelFilter,
            onChange: (val) => onFilterChange({ channelFilter: val as any }),
            options: [
              { value: 'all', label: 'Tất cả kênh gửi' },
              { value: 'portal', label: 'Bảng tin Portal' },
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
              { value: 'push', label: 'Mobile Push' },
            ],
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {isFilterActive && (
              <Button
                variant="secondary"
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
            <Button
              variant="primary"
              icon="plus"
              onClick={onOpenCreate}
            >
              Soạn thông báo
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default AnnouncementToolbar;
