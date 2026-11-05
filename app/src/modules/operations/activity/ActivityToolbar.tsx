import React from 'react';
import { ModerationStatus } from '../../../types/activity';
import { CountedTabs, SearchField } from '@/components/ds';

interface ActivityToolbarProps {
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

      {/* 2. Search Toolbar */}
      <div
        style={{
          padding: 'var(--space-12) var(--space-20)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-12)',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ width: '360px', maxWidth: '100%' }}>
          <SearchField
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Tìm kiếm hoạt động, tên bé, môn học..."
          />
        </div>

        <div className="body-xs" style={{ color: 'var(--text-subtle)' }}>
          Hiển thị nhật ký học tập và sinh hoạt hàng ngày của học sinh
        </div>
      </div>
    </div>
  );
};

export default ActivityToolbar;
