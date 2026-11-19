import React from 'react';
import { ModerationStatus } from '../../../types/activity';
import { CLASSES_LIST } from '@/services/mockAttendanceData';
import { CountedTabs, SearchField, SelectField } from '@/components/ds';

interface ActivityToolbarProps {
  selectedClassId?: string;
  onClassChange?: (classId: string) => void;
  statusFilter: 'all' | ModerationStatus;
  onStatusFilterChange: (status: 'all' | ModerationStatus) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  pinnedCount: number;
}

export const ActivityToolbar: React.FC<ActivityToolbarProps> = ({
  selectedClassId = 'lop-1a1',
  onClassChange,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  totalCount,
  approvedCount,
  pendingCount,
  pinnedCount,
}) => {
  const tabs = [
    { id: 'all', label: 'Tất cả hoạt động', count: totalCount, icon: 'layer-group' as const },
    { id: 'approved', label: 'Đã duyệt', count: approvedCount, icon: 'circle-check' as const },
    { id: 'cho_duyet', label: 'Chờ duyệt', count: pendingCount, icon: 'clock' as const },
    { id: 'pinned', label: 'Đã ghim', count: pinnedCount, icon: 'book-bookmark' as const },
  ];

  return (
    <div className="ecomd-table-card" style={{ marginBottom: 'var(--space-16)' }}>
      {/* 1. Counted Tabs */}
      <CountedTabs
        tabs={tabs}
        activeId={statusFilter}
        onChange={(id) => onStatusFilterChange(id as 'all' | ModerationStatus)}
      />

      {/* 2. Integrated Class Filter & Search Toolbar (Single Frame Line 38px) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-5 sm:py-3 bg-[var(--bg-surface)] w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto flex-1 min-w-0">
          <div className="w-full sm:w-64 min-w-0">
            <SearchField
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="Tìm kiếm hoạt động, tên bé, môn học..."
              block
              className="w-full"
            />
          </div>

          {onClassChange && (
            <div className="w-full sm:w-48 flex-shrink-0 min-w-0">
              <SelectField
                placeholder="Chọn lớp học"
                defaultValue="lop-1a1"
                value={selectedClassId}
                onChange={onClassChange}
                options={CLASSES_LIST.map((c) => ({ value: c.id, label: c.name }))}
              />
            </div>
          )}
        </div>

        <div className="body-xs hidden lg:block text-[var(--text-subtle)] whitespace-nowrap">
          Hiển thị nhật ký học tập và sinh hoạt hàng ngày của học sinh
        </div>
      </div>
    </div>
  );
};

export default ActivityToolbar;
