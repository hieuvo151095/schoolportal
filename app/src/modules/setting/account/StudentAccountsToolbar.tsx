import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faRotateRight,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setStudentFilters } from '../../../store/slices/accountSlice';
import { StudentAccountStatusFilter } from '../../../types/account';
import { MOCK_AVAILABLE_CLASSES } from '../../../services/mockAccountData';

export const StudentAccountsToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { studentFilters } = useAppSelector((state) => state.account);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStudentFilters({ searchQuery: e.target.value }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStudentFilters({ classFilter: e.target.value }));
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      setStudentFilters({
        accountStatusFilter: e.target.value as StudentAccountStatusFilter,
      })
    );
  };

  const handleResetFilters = () => {
    dispatch(
      setStudentFilters({
        searchQuery: '',
        classFilter: 'all',
        accountStatusFilter: 'all',
      })
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 relative min-w-[280px]">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            type="text"
            value={studentFilters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm theo tên học sinh, mã học sinh, tên tài khoản..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
          {studentFilters.searchQuery && (
            <button
              onClick={() => dispatch(setStudentFilters({ searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Filter */}
          <div className="relative">
            <select
              value={studentFilters.classFilter}
              onChange={handleClassChange}
              className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả lớp học</option>
              {MOCK_AVAILABLE_CLASSES.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Provisioning Status Filter (BR21) */}
          <div className="relative">
            <select
              value={studentFilters.accountStatusFilter}
              onChange={handleStatusFilterChange}
              className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái tài khoản</option>
              <option value="has_account">Đã có tài khoản</option>
              <option value="no_account">Chưa có tài khoản</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(studentFilters.searchQuery ||
            studentFilters.classFilter !== 'all' ||
            studentFilters.accountStatusFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              className="px-2.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
