/**
 * Poll Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * CountedTabs, SearchField, and SelectField inside Unified Table Card.
 */

import React from 'react';
import { PollFilterState } from '@/types/poll';
import { CountedTabs, SearchField, SelectField } from '@/components/ds';

interface PollToolbarProps {
  filterState: PollFilterState;
  statusCounts: {
    all: number;
    da_tao: number;
    da_gui: number;
    da_dong: number;
  };
  availableClasses: Array<{ id: string; name: string }>;
  onStatusChange: (status: PollFilterState['status']) => void;
  onClassChange: (classId: string) => void;
  onSearchChange: (query: string) => void;
  onResetFilter: () => void;
}

export const PollToolbar: React.FC<PollToolbarProps> = ({
  filterState,
  statusCounts,
  availableClasses,
  onStatusChange,
  onClassChange,
  onSearchChange,
}) => {
  const statusTabs = [
    { id: 'all', label: 'Tất cả', count: statusCounts.all },
    { id: 'da_gui', label: 'Đang diễn ra', count: statusCounts.da_gui },
    { id: 'da_tao', label: 'Bản nháp', count: statusCounts.da_tao },
    { id: 'da_dong', label: 'Đã đóng', count: statusCounts.da_dong },
  ];

  const classOptions = [
    { value: 'all', label: 'Tất cả lớp học' },
    ...availableClasses.map((cls) => ({ value: cls.id, label: cls.name })),
  ];

  return (
    <div>
      {/* 1. Top CountedTabs */}
      <CountedTabs
        tabs={statusTabs}
        activeId={filterState.status}
        onChange={(id) => onStatusChange(id as PollFilterState['status'])}
      />

      {/* 2. Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-16)',
          padding: 'var(--space-16) var(--space-20)',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-default)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
          <SearchField
            placeholder="Tìm kiếm theo chủ đề bình chọn (không dấu)..."
            value={filterState.searchQuery}
            onChange={(val) => onSearchChange(val)}
            style={{ width: '380px', maxWidth: '100%' }}
          />

          <SelectField
            options={classOptions}
            value={filterState.classId}
            onChange={(val) => onClassChange(val)}
          />
        </div>
      </div>
    </div>
  );
};
export default PollToolbar;
