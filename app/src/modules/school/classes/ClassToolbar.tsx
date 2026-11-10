import React from 'react';
import { Icon, Dropdown, Button } from '@/components/ds';
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
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      {/* Top row: Tab Switcher & Action CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Dual Taxonomy Segmented Control */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => onSelectTaxonomy('chinh_khoa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              activeTaxonomy === 'chinh_khoa'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon name="school" size={14} />
            <span>Lớp chính khóa</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTaxonomy === 'chinh_khoa'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {curricularCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTaxonomy('ngoai_khoa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              activeTaxonomy === 'ngoai_khoa'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon name="users" size={14} />
            <span>Lớp ngoại khóa & CLB</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTaxonomy === 'ngoai_khoa'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {extracurricularCount}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom row: Filter Controls, Search & Actions on same line */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-[280px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon name="magnifying-glass" size={14} />
            </span>
            <input
              type="text"
              value={filterCriteria.searchQuery || ''}
              onChange={(e) => onUpdateFilter({ searchQuery: e.target.value })}
              placeholder={
                activeTaxonomy === 'chinh_khoa'
                  ? 'Tìm theo tên lớp, GVCN...'
                  : 'Tìm theo tên CLB, phụ trách...'
              }
              className="w-full h-9 pl-9 pr-8 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {filterCriteria.searchQuery && (
              <button
                type="button"
                onClick={() => onUpdateFilter({ searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Xoá tìm kiếm"
              >
                <Icon name="xmark" size={12} />
              </button>
            )}
          </div>

          {/* Reactive Grade Level dropdown (only for Curricular) */}
          {activeTaxonomy === 'chinh_khoa' && (
            <div className="w-full sm:w-44 shrink-0">
              <Dropdown
                value={filterCriteria.gradeLevelId || ''}
                onChange={(val) =>
                  onUpdateFilter({ gradeLevelId: val ? val : undefined })
                }
                options={[
                  { value: '', label: 'Tất cả khối lớp' },
                  ...gradeLevels.map((grd) => ({
                    value: grd.id,
                    label: grd.name,
                  })),
                ]}
                fullWidth
              />
            </div>
          )}

          {/* Filter Drawer Trigger & Clear Filters */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="secondary"
              icon="filter"
              active={activeFilterCount > 0}
              onClick={onOpenFilterDrawer}
            >
              Bộ lọc {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
            </Button>

            {(filterCriteria.searchQuery ||
              filterCriteria.gradeLevelId ||
              filterCriteria.status ||
              filterCriteria.teacherRole ||
              filterCriteria.teacherId ||
              filterCriteria.csdlStatus) && (
              <Button
                variant="text"
                onClick={onResetFilter}
                style={{ color: 'var(--color-danger, #e11d48)' }}
              >
                Đặt lại
              </Button>
            )}
          </div>
        </div>

        {/* Primary Action Buttons (Right Aligned on same frame line) */}
        <div className="flex items-center gap-2 shrink-0">
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
      </div>
    </div>
  );
};
