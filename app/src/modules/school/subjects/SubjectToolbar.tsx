/**
 * Subject Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, SelectField, DS Tokens)
 */

import React, { useMemo } from 'react';
import type { EducationStage, SubjectFilterState } from '@/types/subject';
import { STAGE_CONFIGS, ACADEMIC_YEARS } from '@/services/mockSubjectData';
import { FilterBar, Button, Icon, Dropdown, DropdownOption } from '@/components/ds';

interface SubjectToolbarProps {
  activeStage: EducationStage;
  onSelectStage: (stage: EducationStage) => void;
  stageCounts: Record<EducationStage, number>;
  selectedAcademicYear: string;
  onSelectAcademicYear: (year: string) => void;
  filterCriteria: SubjectFilterState;
  onUpdateFilter: (filter: Partial<SubjectFilterState>) => void;
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
    Boolean(filterCriteria.searchQuery) ||
    filterCriteria.gradeLevel !== 'all' ||
    filterCriteria.classification !== 'all' ||
    filterCriteria.type !== 'all';

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-neutral)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-xs)',
        marginBottom: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      {/* Top Row: 4 Educational Stage Tabs & Academic Year Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          paddingBottom: 'var(--space-2)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {/* 4 Segmented Stage Controls */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {STAGE_CONFIGS.map((stage) => {
            const isActive = activeStage === stage.id;
            const count = stageCounts[stage.id] || 0;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isActive ? 'var(--font-bold)' : 'var(--font-medium)',
                  background: isActive ? 'var(--color-primary-50)' : 'transparent',
                  color: isActive ? 'var(--eco-blue-strong)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--eco-blue-border, #bfdbfe)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <Icon name="graduation-cap" size={13} />
                <span>{stage.name}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 'var(--font-bold)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--eco-blue-strong)' : 'var(--bg-secondary)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Academic Year Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[var(--text-secondary)] font-medium whitespace-nowrap">
            Năm học:
          </span>
          <div className="w-44">
            <Dropdown
              value={selectedAcademicYear}
              onChange={(val) => onSelectAcademicYear(val)}
              options={ACADEMIC_YEARS.map((y) => ({ value: y, label: `Năm học ${y}` }))}
              size="sm"
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* FilterBar with Search and Select Filters */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm môn học theo tên, mã môn (không dấu)...',
          value: filterCriteria.searchQuery,
          onChange: (val) => onUpdateFilter({ searchQuery: val }),
        }}
        filters={[
          {
            label: 'Khối lớp',
            value: filterCriteria.gradeLevel,
            onChange: (val) => onUpdateFilter({ gradeLevel: val }),
            options: [
              { value: 'all', label: 'Tất cả khối lớp' },
              ...availableGrades.map((g) => ({ value: g, label: g })),
            ],
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
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {isFilterActive && (
              <Button
                variant="secondary"
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
