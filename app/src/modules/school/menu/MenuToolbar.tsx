/**
 * Menu Toolbar Component
 * Design System: [DS] ECO ME DASHBOARD v1.1.0
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuFilterState } from '../../../types/menu';
import { ExtendedMenuFilterModal } from './ExtendedMenuFilterModal';
import { AIMenuSuggestionModal } from './AIMenuSuggestionModal';
import { FilterBar, Button, Icon } from '../../../components/ds';

interface MenuToolbarProps {
  filters: MenuFilterState;
  onFilterChange: (filters: Partial<MenuFilterState>) => void;
  onResetFilters: () => void;
  schoolCode: string;
  onOpenCreate?: () => void;
  onOpenCreateFile?: () => void;
  onApplyAISchedule?: () => void;
}

export const MenuToolbar: React.FC<MenuToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  schoolCode,
  onOpenCreate,
  onOpenCreateFile,
  onApplyAISchedule,
}) => {
  const router = useRouter();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <>
      {/* Main FilterBar with Search, Class Selector, Advanced Filter, AI Suggestion & Create Actions */}
      <FilterBar
        search={{
          placeholder: 'Tìm theo tuần, món ăn...',
          value: filters.searchQuery,
          onChange: (val) => onFilterChange({ searchQuery: val }),
        }}
        filters={[
          {
            placeholder: 'Chọn đối tượng',
            value: filters.classId,
            defaultValue: 'all',
            onChange: (val) => onFilterChange({ classId: val }),
            options: [
              { value: 'all', label: 'Tất cả đối tượng' },
              { value: 'toan_truong', label: 'Chỉ toàn trường' },
              { value: '10A1', label: 'Lớp 10A1' },
              { value: '12A1', label: 'Lớp 12A1' },
              { value: 'MN-CHOI', label: 'Lớp Chồi 1 (Mầm non)' },
            ],
          },
        ]}
        advanced={{
          label: 'Lọc mở rộng',
          active: filters.useFileOnly !== 'all' || filters.status !== 'all' || !!filters.selectedMonth,
          onClick: () => setIsFilterModalOpen(true),
        }}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon="sliders"
              onClick={() => setIsAIModalOpen(true)}
            >
              Gợi ý AI
            </Button>
            <Button
              variant="secondary"
              icon="download"
              onClick={() => alert('Đang xuất danh sách thực đơn ra file Excel...')}
            >
              Xuất Excel
            </Button>
            <Button
              variant="secondary"
              icon="file-lines"
              onClick={onOpenCreateFile || (() => router.push(`/${schoolCode}/school/menu/create?mode=file`))}
            >
              Tạo bằng file
            </Button>
            <Button
              variant="primary"
              icon="plus"
              onClick={onOpenCreate || (() => router.push(`/${schoolCode}/school/menu/create`))}
            >
              Tạo thực đơn
            </Button>
          </div>
        }
      />

      {/* Modals */}
      <ExtendedMenuFilterModal
        isOpen={isFilterModalOpen}
        filters={filters}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={onFilterChange}
        onReset={onResetFilters}
      />

      <AIMenuSuggestionModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplySchedule={() => {
          if (onApplyAISchedule) {
            onApplyAISchedule();
          } else {
            router.push(`/${schoolCode}/school/menu/create?template=ai`);
          }
        }}
      />
    </>
  );
};
