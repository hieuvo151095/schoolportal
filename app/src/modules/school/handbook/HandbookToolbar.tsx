/**
 * Handbook Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, Button, DS Tokens)
 */

import React from 'react';
import { ArticleStatus } from '../../../types/parentHandbook';
import { FilterBar, Button } from '../../../components/ds';

interface HandbookToolbarProps {
  statusFilter: 'all' | ArticleStatus;
  searchQuery: string;
  totalCategories: number;
  totalArticles: number;
  onStatusChange: (status: 'all' | ArticleStatus) => void;
  onSearchChange: (query: string) => void;
  onOpenCreateCategoryModal: () => void;
}

export const HandbookToolbar: React.FC<HandbookToolbarProps> = ({
  statusFilter,
  searchQuery,
  onStatusChange,
  onSearchChange,
  onOpenCreateCategoryModal,
}) => {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm theo tiêu đề bài viết...',
          value: searchQuery,
          onChange: (val) => onSearchChange(val),
        }}
        filters={[
          {
            label: 'Trạng thái',
            value: statusFilter,
            onChange: (val) => onStatusChange(val as any),
            options: [
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'published', label: 'Đã phát hành' },
              { value: 'draft', label: 'Bản nháp' },
            ],
          },
        ]}
        action={{
          label: 'Thêm danh mục',
          icon: 'plus',
          onClick: onOpenCreateCategoryModal,
        }}
      />
    </div>
  );
};
