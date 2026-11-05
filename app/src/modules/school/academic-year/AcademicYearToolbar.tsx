/**
 * Academic Year Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, Button)
 */

import React from 'react';
import { FilterBar } from '../../../components/ds';

interface AcademicYearToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
}

export const AcademicYearToolbar: React.FC<AcademicYearToolbarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <FilterBar
      search={{
        placeholder: 'Tìm kiếm theo tên năm học, niên khóa (VD: 2026-2027)...',
        value: searchQuery,
        onChange: (val) => onSearchChange(val),
      }}
    />
  );
};
