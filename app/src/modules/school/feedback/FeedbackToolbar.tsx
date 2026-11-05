import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faRotateRight,
  faFilter,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
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
            <select
              value={filters.schoolYear}
              onChange={(e) => dispatch(setSchoolYearFilter(e.target.value))}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {schoolYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-[260px] md:min-w-[320px]">
            <input
              type="text"
              placeholder="Tìm kiếm mã, tiêu đề, học sinh, phụ huynh..."
              value={filters.searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-2.5 text-slate-400 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faRotateRight} className="mr-1.5 text-slate-500" />
            Đặt lại bộ lọc
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
          <select
            value={filters.category}
            onChange={(e) =>
              dispatch(
                setAdvancedFilters({
                  category: e.target.value as FeedbackType | 'all',
                })
              )
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả loại ({Object.keys(FEEDBACK_CATEGORY_MAP).length})</option>
            {Object.entries(FEEDBACK_CATEGORY_MAP).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Độ ưu tiên
          </label>
          <select
            value={filters.priority}
            onChange={(e) =>
              dispatch(
                setAdvancedFilters({
                  priority: e.target.value as FeedbackPriority | 'all',
                })
              )
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả độ ưu tiên</option>
            {Object.entries(FEEDBACK_PRIORITY_MAP).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Người xử lý
          </label>
          <select
            value={filters.assigneeId}
            onChange={(e) =>
              dispatch(setAdvancedFilters({ assigneeId: e.target.value }))
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả người xử lý</option>
            <option value="unassigned">Chưa phân công</option>
            {MOCK_STAFF_LIST.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>

        {/* Waiting For Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">
            Chờ phản hồi
          </label>
          <select
            value={filters.waitingFor}
            onChange={(e) =>
              dispatch(
                setAdvancedFilters({
                  waitingFor: e.target.value as FeedbackWaitingFor | 'all',
                })
              )
            }
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Tất cả</option>
            <option value="school">Từ nhà trường</option>
            <option value="parent">Từ phụ huynh</option>
          </select>
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
