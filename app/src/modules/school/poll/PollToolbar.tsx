/**
 * Poll Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 * CountedTabs, SearchField, and SelectField inside Unified Table Card.
 */

import React from 'react';
import { useRouter } from 'next/router';
import { PollFilterState } from '@/types/poll';
import { CountedTabs, FilterBar, Button } from '@/components/ds';

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
  onResetFilter?: () => void;
  onOpenCreate?: () => void;
}

export const PollToolbar: React.FC<PollToolbarProps> = ({
  filterState,
  statusCounts,
  availableClasses,
  onStatusChange,
  onClassChange,
  onSearchChange,
  onOpenCreate,
}) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

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

      {/* 2. Standard FilterBar */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm chủ đề bình chọn...',
          value: filterState.searchQuery,
          onChange: (val) => onSearchChange(val),
        }}
        filters={[
          {
            placeholder: 'Chọn lớp học',
            options: classOptions,
            value: filterState.classId,
            onChange: (val) => onClassChange(val),
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon="download"
              onClick={() => alert('Đang xuất danh sách bình chọn ra file Excel...')}
            >
              Xuất Excel
            </Button>
            <Button
              variant="primary"
              icon="plus"
              onClick={onOpenCreate || (() => router.push(`/${schoolCode}/school/poll/create`))}
            >
              Tạo bình chọn
            </Button>
          </div>
        }
      />
    </div>
  );
};
export default PollToolbar;
