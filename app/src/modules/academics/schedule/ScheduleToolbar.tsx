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
}

export const ScheduleToolbar: React.FC<ScheduleToolbarProps> = ({ schoolCode }) => {
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
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-12)',
          padding: 'var(--space-16) var(--space-20)',
          borderBottom: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-12)' }}>
          <div style={{ width: '170px' }}>
            <SelectField
              value={filterCriteria.classId}
              onChange={handleClassChange}
              options={[
                { value: 'all', label: 'Tất cả các lớp' },
                ...classes.map((cls) => ({ value: cls.id, label: cls.name })),
              ]}
            />
          </div>

          <div style={{ width: '250px' }}>
            <SearchField
              value={filterCriteria.searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm theo tên TKB, mã, học kỳ..."
            />
          </div>

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            icon="filter"
            active={isFiltered}
            indicator={isFiltered}
            onClick={() => dispatch(setFilterDrawerOpen(true))}
          >
            Bộ lọc
          </Button>

          <Button
            variant="secondary"
            icon="upload"
            onClick={() => dispatch(setUploadModalOpen(true))}
          >
            Tải lên file
          </Button>

          <Button
            variant="primary"
            icon="plus"
            href={`/${schoolCode}/school/schedule/create`}
          >
            Thêm thời khóa biểu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleToolbar;
