/**
 * Handbook Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, Button, DS Tokens)
 */

import React from 'react';
import { useRouter } from 'next/router';
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
  onOpenCreateArticle?: () => void;
}

export const HandbookToolbar: React.FC<HandbookToolbarProps> = ({
  statusFilter,
  searchQuery,
  onStatusChange,
  onSearchChange,
  onOpenCreateCategoryModal,
  onOpenCreateArticle,
}) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';

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
            placeholder: 'Chọn trạng thái',
            value: statusFilter,
            defaultValue: 'all',
            onChange: (val) => onStatusChange(val as any),
            options: [
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'published', label: 'Đã phát hành' },
              { value: 'draft', label: 'Bản nháp' },
            ],
          },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon="folder-plus"
              onClick={onOpenCreateCategoryModal}
            >
              Thêm danh mục
            </Button>
            <Button
              variant="primary"
              icon="plus"
              onClick={onOpenCreateArticle || (() => router.push(`/${schoolCode}/school/handbook/create`))}
            >
              Soạn bài viết
            </Button>
          </div>
        }
      />
    </div>
  );
};
