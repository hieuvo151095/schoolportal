import React from 'react';
import styled from 'styled-components';
import { Icon, Dropdown } from '@/components/ds';
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

const ToolbarContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export default function FeedbackToolbar() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.feedback);

  const schoolYears = ['2026 - 2027', '2025 - 2026', '2024 - 2025'];

  return (
    <ToolbarContainer>
      {/* Row 1: School Year, Search, and Reset */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Năm học:</span>
            <div className="w-36">
              <Dropdown
                value={filters.schoolYear}
                onChange={(val) => dispatch(setSchoolYearFilter(String(val)))}
                options={schoolYears.map((year) => ({ value: year, label: year }))}
                size="sm"
                fullWidth
              />
            </div>
          </div>

          <div className="relative min-w-[260px] md:min-w-[320px]">
            <input
              type="text"
              placeholder="Tìm kiếm mã, tiêu đề, học sinh, phụ huynh..."
              value={filters.searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <Icon
              name="magnifying-glass"
              className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Icon name="rotate-right" className="mr-1.5 w-3 h-3 text-slate-500" />
            Đặt lại bộ lọc
          </button>
          <button
            type="button"
            onClick={() => alert('Đang xuất danh sách góp ý ra file Excel...')}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            <Icon name="download" className="mr-1.5 w-3 h-3 text-emerald-600" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Row 2: Multi-Factor Dropdown Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Loại góp ý
          </label>
          <Dropdown
            value={filters.category}
            onChange={(val) =>
              dispatch(
                setAdvancedFilters({
                  category: val as FeedbackType | 'all',
                })
              )
            }
            options={[
              { value: 'all', label: `Tất cả loại (${Object.keys(FEEDBACK_CATEGORY_MAP).length})` },
              ...Object.entries(FEEDBACK_CATEGORY_MAP).map(([key, label]) => ({
                value: key,
                label,
              })),
            ]}
            size="sm"
            fullWidth
          />
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Độ ưu tiên
          </label>
          <Dropdown
            value={filters.priority}
            onChange={(val) =>
              dispatch(
                setAdvancedFilters({
                  priority: val as FeedbackPriority | 'all',
                })
              )
            }
            options={[
              { value: 'all', label: 'Tất cả độ ưu tiên' },
              ...Object.entries(FEEDBACK_PRIORITY_MAP).map(([key, item]) => ({
                value: key,
                label: item.label,
              })),
            ]}
            size="sm"
            fullWidth
          />
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Người xử lý
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
            size="sm"
            fullWidth
          />
        </div>

        {/* Waiting For Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Chờ phản hồi
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
              { value: 'all', label: 'Tất cả' },
              { value: 'school', label: 'Từ nhà trường' },
              { value: 'parent', label: 'Từ phụ huynh' },
            ]}
            size="sm"
            fullWidth
          />
        </div>

        {/* Date From */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              dispatch(setAdvancedFilters({ dateFrom: e.target.value }))
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              dispatch(setAdvancedFilters({ dateTo: e.target.value }))
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </ToolbarContainer>
  );
}
