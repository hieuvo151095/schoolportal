import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setFilterCriteria,
  setFilterDrawerOpen,
  resetFilterCriteria,
} from '../../../store/slices/assignmentSlice';
import { Button, SearchField, SelectField, CountedTabs } from '@/components/ds';

interface AssignmentToolbarProps {
  schoolCode: string;
}

export const AssignmentToolbar: React.FC<AssignmentToolbarProps> = ({ schoolCode }) => {
  const dispatch = useAppDispatch();
  const assignments = useAppSelector((state) => state.assignment.assignments);
  const filterCriteria = useAppSelector(
    (state) => state.assignment.filterCriteria
  );
  const subjects = useAppSelector((state) => state.assignment.subjects);

  const now = Date.now();

  const isFiltered =
    filterCriteria.classId !== 'all' ||
    filterCriteria.subjectId !== 'all' ||
    filterCriteria.searchQuery !== '' ||
    filterCriteria.status !== 'all' ||
    filterCriteria.dueDateFilter !== 'tat_ca';

  const tabItems = [
    { id: 'all', label: 'Tất cả', count: assignments.length },
    {
      id: 'active',
      label: 'Đang tiến hành',
      count: assignments.filter(
        (a) => a.status === 'da_gui' && new Date(a.dueDate).getTime() >= now
      ).length,
    },
    {
      id: 'overdue',
      label: 'Đã hết hạn',
      count: assignments.filter((a) => new Date(a.dueDate).getTime() < now).length,
    },
    {
      id: 'draft',
      label: 'Bản nháp',
      count: assignments.filter((a) => a.status === 'da_tao' || a.status === 'chua_gui').length,
    },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === 'all') {
      dispatch(setFilterCriteria({ status: 'all', dueDateFilter: 'tat_ca' }));
    } else if (tabId === 'active') {
      dispatch(setFilterCriteria({ status: 'da_gui', dueDateFilter: 'dang_tien_hanh' }));
    } else if (tabId === 'overdue') {
      dispatch(setFilterCriteria({ dueDateFilter: 'het_han' }));
    } else if (tabId === 'draft') {
      dispatch(setFilterCriteria({ status: 'da_tao' }));
    }
  };

  const activeTabId =
    filterCriteria.dueDateFilter === 'het_han'
      ? 'overdue'
      : filterCriteria.dueDateFilter === 'dang_tien_hanh'
      ? 'active'
      : filterCriteria.status === 'da_tao'
      ? 'draft'
      : 'all';

  return (
    <div>
      {/* 1. CountedTabs on top of card */}
      <CountedTabs
        tabs={tabItems}
        activeId={activeTabId}
        onChange={handleTabChange}
      />

      {/* 2. Integrated Filterbar Toolbar */}
      <div
        className="ecomd-table-card__toolbar"
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
          {/* Class Filter */}
          <div style={{ width: '170px' }}>
            <SelectField
              value={filterCriteria.classId}
              onChange={(val) => dispatch(setFilterCriteria({ classId: val }))}
              options={[
                { value: 'all', label: 'Tất cả lớp học' },
                { value: '1a1', label: 'Lớp 1A1' },
                { value: '2a2', label: 'Lớp 2A2' },
              ]}
            />
          </div>

          {/* Subject Filter */}
          <div style={{ width: '170px' }}>
            <SelectField
              value={filterCriteria.subjectId}
              onChange={(val) => dispatch(setFilterCriteria({ subjectId: val }))}
              options={[
                { value: 'all', label: 'Tất cả môn học' },
                ...subjects.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          </div>

          {/* Search Box */}
          <div style={{ width: '250px' }}>
            <SearchField
              value={filterCriteria.searchQuery}
              onChange={(q) => dispatch(setFilterCriteria({ searchQuery: q }))}
              placeholder="Tìm theo tiêu đề, ghi chú..."
            />
          </div>

          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={() => dispatch(resetFilterCriteria())}>
              Đặt lại bộ lọc
            </Button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            icon="filter"
            active={isFiltered}
            indicator={isFiltered}
            onClick={() => dispatch(setFilterDrawerOpen(true))}
          >
            Bộ lọc nâng cao
          </Button>

          <Button
            variant="primary"
            icon="plus"
            href={`/${schoolCode}/school/assignment/create/`}
          >
            Tạo bài tập
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentToolbar;
