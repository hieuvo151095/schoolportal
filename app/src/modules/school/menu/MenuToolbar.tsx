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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
      {/* 2 Sticky Business Rules Notice Banners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
            fontSize: 'var(--text-xs)',
            color: '#92400e',
          }}
        >
          <div style={{ color: '#d97706', marginTop: '2px', flexShrink: 0 }}>
            <Icon name="circle-info" size={14} />
          </div>
          <div>
            <strong style={{ fontWeight: 'var(--font-bold)' }}>Giới hạn thời gian:</strong> Hệ thống chỉ cho tạo
            trước thực đơn tối đa <b>8 tuần</b> kể từ tuần hiện tại.
          </div>
        </div>

        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
            fontSize: 'var(--text-xs)',
            color: '#1e40af',
          }}
        >
          <div style={{ color: 'var(--eco-blue-strong)', marginTop: '2px', flexShrink: 0 }}>
            <Icon name="school" size={14} />
          </div>
          <div>
            <strong style={{ fontWeight: 'var(--font-bold)' }}>Quy tắc mặc định:</strong> Toàn trường chỉ có 1 thực
            đơn/tuần. Lớp không có thực đơn riêng sẽ <b>tự động dùng thực đơn toàn trường</b>.
          </div>
        </div>
      </div>

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
              style={{
                color: '#7e22ce',
                background: '#faf5ff',
                borderColor: '#e9d5ff',
              }}
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
    </div>
  );
};
