import React from 'react';
import { FilterBar, Button, SelectFieldProps } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setUserFilters,
  openCreateUserModal,
} from '../../../store/slices/accountSlice';
import { UserRole, AccountStatus } from '../../../types/account';

export const UserAccountsToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userFilters } = useAppSelector((state) => state.account);

  const roleOptions = [
    { value: 'all', label: 'Tất cả vai trò' },
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'quan_ly', label: 'Quản lý' },
    { value: 'giao_vien', label: 'Giáo viên' },
    { value: 'nhan_vien', label: 'Nhân viên' },
    { value: 'phu_huynh', label: 'Phụ huynh' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Ngừng hoạt động' },
  ];

  const csdlSoOptions = [
    { value: 'all', label: 'Tất cả nguồn dữ liệu' },
    { value: 'yes', label: 'Đồng bộ CSDL Sở' },
    { value: 'no', label: 'Tạo nội bộ' },
  ];

  const handleResetFilters = () => {
    dispatch(
      setUserFilters({
        searchQuery: '',
        roleFilter: 'all',
        statusFilter: 'active',
        csdlSoFilter: 'all',
      })
    );
  };

  const isFiltered =
    userFilters.searchQuery !== '' ||
    userFilters.roleFilter !== 'all' ||
    userFilters.statusFilter !== 'active' ||
    userFilters.csdlSoFilter !== 'all';

  const filters: SelectFieldProps[] = [
    {
      placeholder: 'Chọn vai trò',
      options: roleOptions,
      value: userFilters.roleFilter,
      onChange: (val) => dispatch(setUserFilters({ roleFilter: val as 'all' | UserRole })),
    },
    {
      placeholder: 'Chọn trạng thái',
      defaultValue: 'active',
      options: statusOptions,
      value: userFilters.statusFilter,
      onChange: (val) => dispatch(setUserFilters({ statusFilter: val as 'all' | AccountStatus })),
    },
    {
      placeholder: 'Chọn nguồn dữ liệu',
      options: csdlSoOptions,
      value: userFilters.csdlSoFilter,
      onChange: (val) => dispatch(setUserFilters({ csdlSoFilter: val as 'all' | 'yes' | 'no' })),
    },
  ];

  return (
    <div className="mb-4">
      <FilterBar
        search={{
          placeholder: 'Tìm theo tên, email, SĐT...',
          value: userFilters.searchQuery,
          onChange: (val) => dispatch(setUserFilters({ searchQuery: val })),
        }}
        filters={filters}
        actions={
          <div className="flex items-center gap-2">
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                icon="rotate-right"
                onClick={handleResetFilters}
              >
                Đặt lại
              </Button>
            )}
            <Button
              variant="primary"
              icon="plus"
              onClick={() => dispatch(openCreateUserModal())}
            >
              Thêm người dùng
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default UserAccountsToolbar;
