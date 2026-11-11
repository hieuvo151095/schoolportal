import React, { useMemo } from 'react';
import { CountedTabs, FilterBar, Button, CountedTabItem, SelectFieldProps } from '@/components/ds';
import { ClassTaxonomy, GradeLevel, ClassFilterState } from '../../../types/class';

interface ClassToolbarProps {
  activeTaxonomy: ClassTaxonomy;
  onSelectTaxonomy: (taxonomy: ClassTaxonomy) => void;
  curricularCount: number;
  extracurricularCount: number;
  gradeLevels: GradeLevel[];
  filterCriteria: ClassFilterState;
  onUpdateFilter: (filter: Partial<ClassFilterState>) => void;
  onResetFilter: () => void;
  onOpenCreate: () => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
}

export const ClassToolbar: React.FC<ClassToolbarProps> = ({
  activeTaxonomy,
  onSelectTaxonomy,
  curricularCount,
  extracurricularCount,
  gradeLevels,
  filterCriteria,
  onUpdateFilter,
  onResetFilter,
  onOpenCreate,
  onOpenFilterDrawer,
  activeFilterCount,
}) => {
  const tabs: CountedTabItem[] = [
    {
      id: 'chinh_khoa',
      label: 'Lớp chính khóa',
      count: curricularCount,
      icon: 'school',
    },
    {
      id: 'ngoai_khoa',
      label: 'Lớp ngoại khóa & CLB',
      count: extracurricularCount,
      icon: 'users',
    },
  ];

  const gradeOptions = useMemo(() => [
    { value: '', label: 'Tất cả các khối' },
    ...gradeLevels.map((gl) => ({
      value: gl.id,
      label: gl.name,
    })),
  ], [gradeLevels]);

  const filters: SelectFieldProps[] = [];
  if (activeTaxonomy === 'chinh_khoa') {
    filters.push({
      options: gradeOptions,
      value: filterCriteria.gradeLevelId || '',
      onChange: (val) => onUpdateFilter({ gradeLevelId: val || undefined }),
      placeholder: 'Chọn khối lớp',
    });
  }

  const hasActiveFilters =
    !!filterCriteria.searchQuery ||
    !!filterCriteria.gradeLevelId ||
    !!filterCriteria.status ||
    !!filterCriteria.teacherRole ||
    !!filterCriteria.teacherId ||
    !!filterCriteria.csdlStatus;

  return (
    <div>
      {/* 1. CountedTabs on top */}
      <CountedTabs
        tabs={tabs}
        activeId={activeTaxonomy}
        onChange={(id) => onSelectTaxonomy(id as ClassTaxonomy)}
      />

      {/* 2. Canonical FilterBar */}
      <FilterBar
        search={{
          placeholder:
            activeTaxonomy === 'chinh_khoa'
              ? 'Tìm theo tên lớp, GVCN...'
              : 'Tìm theo tên CLB, phụ trách...',
          value: filterCriteria.searchQuery || '',
          onChange: (val) => onUpdateFilter({ searchQuery: val }),
        }}
        filters={filters}
        advanced={{
          label: activeFilterCount > 0 ? `Bộ lọc (${activeFilterCount})` : 'Bộ lọc mở rộng',
          active: activeFilterCount > 0,
          onClick: onOpenFilterDrawer,
        }}
        actions={
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                icon="rotate-right"
                onClick={onResetFilter}
              >
                Đặt lại
              </Button>
            )}
            <Button
              variant="secondary"
              icon="download"
              onClick={() => alert('Đang xuất danh sách lớp học ra file Excel...')}
            >
              Xuất Excel
            </Button>
            <Button
              variant="primary"
              icon="plus"
              onClick={onOpenCreate}
            >
              Thêm lớp mới
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default ClassToolbar;
