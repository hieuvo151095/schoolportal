/**
 * Grade Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, SelectField, DS Tokens)
 */

import React from 'react';
import type { EducationStage } from '@/types/grade';
import { FilterBar } from '@/components/ds';

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
}) => {
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
      {/* Stage Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {STAGE_OPTIONS.map((opt) => {
          const isActive = selectedStage === opt.id;
          const count = stageCounts[opt.id] || 0;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectStage(opt.id)}
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
              }}
            >
              <span>{opt.label}</span>
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

      {/* FilterBar with Search and Academic Year */}
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm khối lớp (VD: Khối 1, K10, THCS)...',
          value: searchQuery,
          onChange: (val) => onSearchChange(val),
        }}
        filters={[
          {
            label: 'Niên khóa',
            value: selectedAcademicYear,
            onChange: (val) => onSelectAcademicYear(val),
            options: ACADEMIC_YEARS.map((yr) => ({
              label: `Niên khóa: ${yr}`,
              value: yr,
            })),
          },
        ]}
      />
    </div>
  );
};
