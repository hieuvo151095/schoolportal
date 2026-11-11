/**
 * Grade Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (CountedTabs & FilterBar SSOT)
 */

import React from 'react';
import type { EducationStage } from '@/types/grade';
import { FilterBar, Button, CountedTabs, CountedTabItem, SelectFieldProps } from '@/components/ds';

interface GradeToolbarProps {
  selectedStage: 'ALL' | EducationStage;
  onSelectStage: (stage: 'ALL' | EducationStage) => void;
  stageCounts: Record<'ALL' | EducationStage, number>;
  selectedAcademicYear: string;
  onSelectAcademicYear: (year: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

const STAGE_OPTIONS: { id: 'ALL' | EducationStage; label: string }[] = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'TH', label: 'Tiểu học (TH)' },
  { id: 'THCS', label: 'THCS' },
  { id: 'THPT', label: 'THPT' },
  { id: 'GDTX', label: 'GDTX' },
];

const ACADEMIC_YEARS = ['2026-2027', '2025-2026', '2024-2025'];

export const GradeToolbar: React.FC<GradeToolbarProps> = ({
  selectedStage,
  onSelectStage,
  stageCounts,
  selectedAcademicYear,
  onSelectAcademicYear,
  searchQuery,
  onSearchChange,
  onClearSearch,
}) => {
  const isFilterActive = searchQuery !== '' || selectedStage !== 'ALL';

  const tabs: CountedTabItem[] = STAGE_OPTIONS.map((opt) => ({
    id: opt.id,
    label: opt.label,
    count: stageCounts[opt.id] || 0,
    icon: opt.id === 'ALL' ? 'layer-group' : 'graduation-cap',
  }));

  const filters: SelectFieldProps[] = [
    {
      placeholder: 'Chọn niên khóa',
      value: selectedAcademicYear,
      defaultValue: '2026-2027',
      onChange: (val) => onSelectAcademicYear(val),
      options: ACADEMIC_YEARS.map((yr) => ({
        label: yr,
        value: yr,
      })),
      className: 'min-w-[140px]',
    },
  ];

  return (
    <div>
      {/* 1. CountedTabs on top */}
      <CountedTabs
        tabs={tabs}
        activeId={selectedStage}
        onChange={(id) => onSelectStage(id as 'ALL' | EducationStage)}
      />

      {/* 2. FilterBar with Search and Select Filters */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm khối lớp (VD: Khối 1, K10, THCS)...',
          value: searchQuery,
          onChange: (val) => onSearchChange(val),
        }}
        filters={filters}
        actions={
          <div className="flex items-center gap-2">
            {isFilterActive && (
              <Button
                variant="ghost"
                size="sm"
                icon="rotate-right"
                onClick={() => {
                  onClearSearch();
                  onSelectStage('ALL');
                }}
              >
                Đặt lại
              </Button>
            )}
            <Button
              variant="secondary"
              icon="download"
              onClick={() => alert('Đang xuất danh sách khối lớp ra file Excel...')}
            >
              Xuất Excel
            </Button>
          </div>
        }
      />
    </div>
  );
};
