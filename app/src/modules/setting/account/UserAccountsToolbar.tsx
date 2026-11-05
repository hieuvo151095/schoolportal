import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faFilter,
  faRotateRight,
  faCloudArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { EcoButton, EcoInput } from '../../../components/eco';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setUserFilters,
  openCreateUserModal,
} from '../../../store/slices/accountSlice';
import { UserRole, AccountStatus } from '../../../types/account';

export const UserAccountsToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userFilters } = useAppSelector((state) => state.account);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUserFilters({ searchQuery: e.target.value }));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setUserFilters({ roleFilter: e.target.value as 'all' | UserRole }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setUserFilters({ statusFilter: e.target.value as 'all' | AccountStatus }));
  };

  const handleCsldSoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setUserFilters({ csdlSoFilter: e.target.value as 'all' | 'yes' | 'no' }));
  };

  const handleResetFilters = () => {
    dispatch(
      setUserFilters({
        searchQuery: '',
        roleFilter: 'all',
        statusFilter: 'active', // Reset back to default BR16
        csdlSoFilter: 'all',
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
            value={userFilters.searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
          {userFilters.searchQuery && (
            <button
              onClick={() => dispatch(setUserFilters({ searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={userFilters.roleFilter}
              onChange={handleRoleChange}
              className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="quan_ly">Quản lý</option>
              <option value="giao_vien">Giáo viên</option>
              <option value="nhan_vien">Nhân viên</option>
              <option value="phu_huynh">Phụ huynh</option>
            </select>
          </div>

          {/* Status Filter (Default active BR16) */}
          <div className="relative">
            <select
              value={userFilters.statusFilter}
              onChange={handleStatusChange}
              className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          {/* CSDL Sở Sync Filter */}
          <div className="relative">
            <select
              value={userFilters.csdlSoFilter}
              onChange={handleCsldSoChange}
              className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Nguồn dữ liệu: Tất cả</option>
              <option value="yes">Đồng bộ CSDL Sở</option>
              <option value="no">Tạo nội bộ</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(userFilters.searchQuery ||
            userFilters.roleFilter !== 'all' ||
            userFilters.statusFilter !== 'active' ||
            userFilters.csdlSoFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              title="Đặt lại bộ lọc"
              className="px-2.5 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faRotateRight} />
              <span>Đặt lại</span>
            </button>
          )}

          {/* Add User CTA Button */}
          <EcoButton
            variant="primary"
            onClick={() => dispatch(openCreateUserModal())}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Thêm người dùng</span>
          </EcoButton>
        </div>
      </div>
    </div>
  );
};
