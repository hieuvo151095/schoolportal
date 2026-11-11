/**
 * Subject Directory Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (CountedTabs & FilterBar SSOT)
 */

import React from 'react';
import type { EducationStage, SubjectFilterState } from '@/types/subject';
import { STAGE_CONFIGS, ACADEMIC_YEARS } from '@/services/mockSubjectData';
import { CountedTabs, FilterBar, Button, CountedTabItem, SelectFieldProps } from '@/components/ds';

interface SubjectToolbarProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  stageCounts: Record<EducationStage, number>;
  selectedAcademicYear: string;
  onSelectAcademicYear: (year: string) => void;
  filterCriteria: SubjectFilterState;
  onUpdateFilter: (updates: Partial<SubjectFilterState>) => void;
  onResetFilter: () => void;
}

export const SubjectToolbar: React.FC<SubjectToolbarProps> = ({
  activeStage,
  onSelectStage,
  stageCounts,
  selectedAcademicYear,
  onSelectAcademicYear,
  filterCriteria,
  onUpdateFilter,
  onResetFilter,
}) => {
  const currentStageConfig = STAGE_CONFIGS.find((s) => s.id === activeStage);
  const availableGrades = currentStageConfig ? currentStageConfig.grades : [];

  const isFilterActive =
    filterCriteria.searchQuery !== '' ||
    filterCriteria.gradeLevel !== 'all' ||
    filterCriteria.classification !== 'all' ||
    filterCriteria.type !== 'all';

  const tabs: CountedTabItem[] = STAGE_CONFIGS.map((stage) => ({
    id: stage.id,
    label: stage.name,
    count: stageCounts[stage.id] || 0,
    icon: 'graduation-cap',
  }));

  const filters: SelectFieldProps[] = [
    {
      label: 'Năm học',
      value: selectedAcademicYear,
      onChange: (val) => onSelectAcademicYear(val),
      options: ACADEMIC_YEARS.map((y) => ({ value: y, label: `Năm học ${y}` })),
      className: 'min-w-[130px]',
    },
    {
      label: 'Khối lớp',
      value: filterCriteria.gradeLevel,
      onChange: (val) => onUpdateFilter({ gradeLevel: val }),
      options: [
        { value: 'all', label: 'Tất cả khối lớp' },
        ...availableGrades.map((g) => ({ value: g, label: g })),
      ],
      className: 'min-w-[130px]',
    },
    {
      label: 'Phân loại',
      value: filterCriteria.classification,
      onChange: (val) => onUpdateFilter({ classification: val as any }),
      options: [
        { value: 'all', label: 'Tất cả phân loại' },
        { value: 'bat_buoc', label: 'Bắt buộc' },
        { value: 'tu_chon', label: 'Tự chọn' },
        { value: 'chuyen_de', label: 'Chuyên đề học tập' },
        { value: 'hoat_dong_gd', label: 'Hoạt động trải nghiệm' },
      ],
      className: 'min-w-[130px]',
    },
    {
      label: 'Loại môn',
      value: filterCriteria.type,
      onChange: (val) => onUpdateFilter({ type: val as any }),
      options: [
        { value: 'all', label: 'Tất cả hình thức' },
        { value: 'tinh_diem', label: 'Tính điểm số' },
        { value: 'nhan_xet', label: 'Đánh giá nhận xét' },
        { value: 'ket_hop', label: 'Kết hợp điểm & nhận xét' },
      ],
      className: 'min-w-[130px]',
    },
  ];

  return (
    <div>
      {/* 1. CountedTabs on top */}
      <CountedTabs
        tabs={tabs}
        activeId={activeStage}
        onChange={(id) => onSelectStage(id as EducationStage)}
      />

      {/* 2. FilterBar with Search and Select Filters */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm môn học theo tên, mã môn (không dấu)...',
          value: filterCriteria.searchQuery,
          onChange: (val) => onUpdateFilter({ searchQuery: val }),
        }}
        filters={filters}
        actions={
          <div className="flex items-center gap-2">
            {isFilterActive && (
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
              onClick={() => alert('Đang xuất danh mục môn học ra file Excel...')}
            >
              Xuất Excel
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SubjectToolbar;
