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
  SegmentedControl,
  CountedTabs,
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

      {/* 2. Unified Filterbar Toolbar */}
      <div
        className="ecomd-table-card__toolbar flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-5 border-b border-[var(--border-default)] bg-[var(--bg-surface)]"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center flex-wrap gap-3 flex-1 w-full">
          <div className="w-full sm:w-[180px]">
            <SelectField
              value={filterCriteria.classId}
              onChange={handleClassChange}
              options={[
                { value: 'all', label: 'Tất cả các lớp' },
                ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
              ]}
            />
          </div>

          <div className="w-full sm:w-[260px] sm:flex-1">
            <SearchField
              value={filterCriteria.searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm theo tên TKB, mã, học kỳ..."
            />
          </div>

          <div className="w-full sm:w-auto">
            <SegmentedControl
              value={filterCriteria.type}
              onChange={(type) => dispatch(setFilterCriteria({ type: type as 'all' | 'grid' | 'file' }))}
              items={[
                { key: 'all', label: 'Tất cả' },
                { key: 'grid', label: 'Dạng lưới', icon: 'layer-group' },
                { key: 'file', label: 'Dạng file', icon: 'file-lines' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
          <Button
            variant="secondary"
            icon="filter"
            active={isFiltered}
            indicator={isFiltered}
            className="flex-none whitespace-nowrap"
            onClick={() => dispatch(setFilterDrawerOpen(true))}
          >
            Bộ lọc
          </Button>

          <Button
            variant="secondary"
            icon="upload"
            className="flex-none whitespace-nowrap"
            onClick={() => dispatch(setUploadModalOpen(true))}
          >
            Tải lên file
          </Button>

          <Button
            variant="primary"
            icon="plus"
            className="flex-none whitespace-nowrap"
            onClick={onOpenCreate}
          >
            Thêm thời khóa biểu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleToolbar;
