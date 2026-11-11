import React from 'react';
import { FilterBar, Button, SelectFieldProps } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setStudentFilters } from '../../../store/slices/accountSlice';
import { StudentAccountStatusFilter } from '../../../types/account';
import { MOCK_AVAILABLE_CLASSES } from '../../../services/mockAccountData';

export const StudentAccountsToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { studentFilters } = useAppSelector((state) => state.account);

  const classOptions = [
    { value: 'all', label: 'Tất cả lớp học' },
    ...MOCK_AVAILABLE_CLASSES.map((cls) => ({
      value: cls.id,
      label: cls.name,
    })),
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái tài khoản' },
    { value: 'has_account', label: 'Đã có tài khoản' },
    { value: 'no_account', label: 'Chưa có tài khoản' },
  ];

  const handleResetFilters = () => {
    dispatch(
      setStudentFilters({
        searchQuery: '',
        classFilter: 'all',
        accountStatusFilter: 'all',
      })
    );
  };

  const isFiltered =
    studentFilters.searchQuery !== '' ||
    studentFilters.classFilter !== 'all' ||
    studentFilters.accountStatusFilter !== 'all';

  const filters: SelectFieldProps[] = [
    {
      placeholder: 'Chọn lớp học',
      options: classOptions,
      value: studentFilters.classFilter,
      onChange: (val) => dispatch(setStudentFilters({ classFilter: val })),
    },
    {
      placeholder: 'Chọn trạng thái tài khoản',
      options: statusOptions,
      value: studentFilters.accountStatusFilter,
      onChange: (val) =>
        dispatch(
          setStudentFilters({
            accountStatusFilter: val as StudentAccountStatusFilter,
          })
        ),
    },
  ];

  return (
    <div className="mb-4">
      <FilterBar
        search={{
          placeholder: 'Tìm tên HS, mã HS, tài khoản...',
          value: studentFilters.searchQuery,
          onChange: (val) => dispatch(setStudentFilters({ searchQuery: val })),
        }}
        filters={filters}
        actions={
          isFiltered ? (
            <Button
              variant="ghost"
              size="sm"
              icon="rotate-right"
              onClick={handleResetFilters}
            >
              Đặt lại
            </Button>
          ) : undefined
        }
      />
    </div>
  );
};

export default StudentAccountsToolbar;
