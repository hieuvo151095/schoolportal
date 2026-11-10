import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setFilterCriteria,
  setFilterDrawerOpen,
  setUploadModalOpen,
} from '../../../store/slices/scheduleSlice';
import {
  Button,
  SearchField,
  SelectField,
  CountedTabs,
  FilterBar,
} from '@/components/ds';

interface ScheduleToolbarProps {
  schoolCode: string;
  onOpenCreate?: () => void;
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({ schoolCode, onOpenCreate }) => {
  const dispatch = useAppDispatch();
  const { timetables, classes, filterCriteria } = useAppSelector((state) => state.schedule);

  const handleClassChange = (value: string) => {
    dispatch(setFilterCriteria({ classId: value }));
  };

  const handleSearchChange = (query: string) => {
    dispatch(setFilterCriteria({ searchQuery: query }));
  };

  const isFiltered =
    filterCriteria.classId !== 'all' ||
    filterCriteria.searchQuery !== '' ||
    filterCriteria.type !== 'all' ||
    filterCriteria.status !== 'all';

  const tabItems = [
    { id: 'all', label: 'Tất cả', count: timetables.length },
    {
      id: 'published',
      label: 'Đã phát hành',
      count: timetables.filter((t) => t.status === 'published').length,
    },
    {
      id: 'updated',
      label: 'Chờ phát hành lại',
      count: timetables.filter((t) => t.status === 'updated').length,
    },
    {
      id: 'draft',
      label: 'Bản nháp',
      count: timetables.filter((t) => t.status === 'draft').length,
    },
  ];

  return (
    <div>
      {/* 1. CountedTabs on top of card */}
      <CountedTabs
        tabs={tabItems}
        activeId={filterCriteria.status || 'all'}
        onChange={(id) =>
          dispatch(setFilterCriteria({ status: id as 'all' | 'published' | 'draft' | 'updated' }))
        }
      />

      {/* 2. Unified FilterBar Toolbar SSOT */}
      <FilterBar
        search={{
          placeholder: 'Tìm theo tên TKB, mã, học kỳ...',
          value: filterCriteria.searchQuery,
          onChange: handleSearchChange,
        }}
        filters={[
          {
            options: [
              { value: 'all', label: 'Tất cả các lớp' },
              ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
            ],
            value: filterCriteria.classId,
            onChange: handleClassChange,
          },
        ]}
        advanced={{
          label: 'Bộ lọc',
          active: isFiltered,
          onClick: () => dispatch(setFilterDrawerOpen(true)),
        }}
        actions={
          <Button
            variant="secondary"
            icon="upload"
            className="flex-none whitespace-nowrap"
            onClick={() => dispatch(setUploadModalOpen(true))}
          >
            Tải lên file
          </Button>
        }
        action={{
          label: 'Thêm thời khóa biểu',
          onClick: onOpenCreate,
        }}
      />
    </div>
  );
};

export default ScheduleToolbar;
