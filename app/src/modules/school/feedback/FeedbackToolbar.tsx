/**
 * Feedback Toolbar Component (Góp Ý Phụ Huynh)
 * Design System: [DS] ECO ME DASHBOARD v2.6.0 (FilterBar SSOT)
 * Single frame line, 38px standard height, consistent 13px font size
 */

import React, { useState } from 'react';
import { FilterBar, Button, Dropdown, SlideOver, SelectFieldProps } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSchoolYearFilter,
  setSearchQuery,
  setAdvancedFilters,
  resetFilters,
} from '@/store/slices/feedbackSlice';
import {
  FEEDBACK_CATEGORY_MAP,
  FEEDBACK_PRIORITY_MAP,
} from '@/utils/feedbackValidation';
import { MOCK_STAFF_LIST } from '@/services/mockFeedbackData';
import { FeedbackPriority, FeedbackType, FeedbackWaitingFor } from '@/types/feedback';

export default function FeedbackToolbar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.feedback);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const schoolYears = ['2026 - 2027', '2025 - 2026', '2024 - 2025'];

  const selectFilters: SelectFieldProps[] = [
    {
      placeholder: 'Chọn năm học',
      value: filters.schoolYear,
      defaultValue: '2026 - 2027',
      onChange: (val) => dispatch(setSchoolYearFilter(String(val))),
      options: schoolYears.map((year) => ({ value: year, label: year })),
      className: 'min-w-[130px]',
    },
    {
      placeholder: 'Chọn loại góp ý',
      value: filters.category,
      defaultValue: 'all',
      onChange: (val) =>
        dispatch(
          setAdvancedFilters({
            category: val as FeedbackType | 'all',
          })
        ),
      options: [
        { value: 'all', label: 'Tất cả loại' },
        ...Object.entries(FEEDBACK_CATEGORY_MAP).map(([key, label]) => ({
          value: key,
          label,
        })),
      ],
      className: 'min-w-[130px]',
    },
    {
      placeholder: 'Chọn độ ưu tiên',
      value: filters.priority,
      defaultValue: 'all',
      onChange: (val) =>
        dispatch(
          setAdvancedFilters({
            priority: val as FeedbackPriority | 'all',
          })
        ),
      options: [
        { value: 'all', label: 'Tất cả ưu tiên' },
        ...Object.entries(FEEDBACK_PRIORITY_MAP).map(([key, item]) => ({
          value: key,
          label: item.label,
        })),
      ],
      className: 'min-w-[130px]',
    },
  ];

  const isAdvancedActive =
    filters.assigneeId !== 'all' ||
    filters.waitingFor !== 'all' ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  const hasActiveFilters =
    !!filters.searchQuery ||
    filters.category !== 'all' ||
    filters.priority !== 'all' ||
    isAdvancedActive;

  return (
    <>
      <FilterBar
        search={{
          placeholder: 'Tìm kiếm mã, tiêu đề, học sinh, phụ huynh...',
          value: filters.searchQuery,
          onChange: (val) => dispatch(setSearchQuery(val)),
        }}
        filters={selectFilters}
        advanced={{
          label: isAdvancedActive ? 'Lọc nâng cao (Bật)' : 'Lọc nâng cao',
          active: isAdvancedActive,
          onClick: () => setIsAdvancedOpen(true),
        }}
        actions={
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                icon="rotate-right"
                onClick={() => dispatch(resetFilters())}
              >
                Đặt lại
              </Button>
            )}
            <Button
              variant="secondary"
              icon="download"
              onClick={() => alert('Đang xuất danh sách góp ý ra file Excel...')}
            >
              Xuất Excel
            </Button>
          </div>
        }
      />

      {/* Advanced Filter SlideOver */}
      <SlideOver
        open={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        title="Bộ Lọc Góp Ý Nâng Cao"
        description="Lọc chi tiết theo cán bộ phụ trách, trạng thái chờ phản hồi và khoảng thời gian gửi"
        icon="filter"
        width={480}
        primaryAction={{
          label: 'Áp dụng',
          onClick: () => setIsAdvancedOpen(false),
          icon: 'check',
        }}
        secondaryAction={{
          label: 'Đặt lại lọc nâng cao',
          onClick: () => {
            dispatch(
              setAdvancedFilters({
                assigneeId: 'all',
                waitingFor: 'all',
                dateFrom: undefined,
                dateTo: undefined,
              })
            );
          },
        }}
      >
        <div className="space-y-4 text-left">
          {/* Assignee Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Cán bộ xử lý
            </label>
            <Dropdown
              value={filters.assigneeId}
              onChange={(val) =>
                dispatch(setAdvancedFilters({ assigneeId: String(val) }))
              }
              options={[
                { value: 'all', label: 'Tất cả người xử lý' },
                { value: 'unassigned', label: 'Chưa phân công' },
                ...MOCK_STAFF_LIST.map((staff) => ({
                  value: staff.id,
                  label: staff.name,
                })),
              ]}
              fullWidth
            />
          </div>

          {/* Waiting For Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Chờ phản hồi từ
            </label>
            <Dropdown
              value={filters.waitingFor}
              onChange={(val) =>
                dispatch(
                  setAdvancedFilters({
                    waitingFor: val as FeedbackWaitingFor | 'all',
                  })
                )
              }
              options={[
                { value: 'all', label: 'Tất cả đối tượng' },
                { value: 'school', label: 'Từ nhà trường' },
                { value: 'parent', label: 'Từ phụ huynh' },
              ]}
              fullWidth
            />
          </div>

          {/* Date Range Controls */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Khoảng thời gian gửi góp ý
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-xs text-slate-500 mb-1">Từ ngày</span>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) =>
                    dispatch(setAdvancedFilters({ dateFrom: e.target.value || undefined }))
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>
              <div>
                <span className="block text-xs text-slate-500 mb-1">Đến ngày</span>
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) =>
                    dispatch(setAdvancedFilters({ dateTo: e.target.value || undefined }))
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0070CE]"
                />
              </div>
            </div>
          </div>
        </div>
      </SlideOver>
    </>
  );
}
