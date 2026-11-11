import React from 'react';
import { FilterBar, Button, SelectFieldProps } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFilterState } from '@/store/slices/faceRecognitionSlice';
import type { FaceRegistrationStatus } from '@/types/faceRecognition';
import { MOCK_CLASSES } from '@/services/mockFaceRecognitionData';

export const FaceRecognitionToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state) => state.faceRecognition.filterState);

  const handleSearchChange = (query: string) => {
    dispatch(setFilterState({ searchQuery: query, page: 1 }));
  };

  const handleClassChange = (value: string) => {
    dispatch(setFilterState({ classId: value, page: 1 }));
  };

  const handleStatusChange = (value: string) => {
    dispatch(
      setFilterState({
        registrationStatus: value as FaceRegistrationStatus,
        page: 1,
      })
    );
  };

  const handleResetFilters = () => {
    dispatch(
      setFilterState({
        searchQuery: '',
        classId: 'all',
        registrationStatus: 'all',
        page: 1,
      })
    );
  };

  const hasActiveFilters =
    filterState.searchQuery.trim() !== '' ||
    filterState.classId !== 'all' ||
    filterState.registrationStatus !== 'all';

  const classOptions = [
    { value: 'all', label: 'Tất cả các lớp' },
    ...MOCK_CLASSES.map((cls) => ({ value: cls.id, label: cls.name })),
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái nhận diện' },
    { value: 'registered', label: 'Đã đăng ký' },
    { value: 'unregistered', label: 'Chưa đăng ký' },
  ];

  const filters: SelectFieldProps[] = [
    {
      placeholder: 'Chọn lớp học',
      options: classOptions,
      value: filterState.classId,
      onChange: handleClassChange,
    },
    {
      placeholder: 'Chọn trạng thái nhận diện',
      options: statusOptions,
      value: filterState.registrationStatus,
      onChange: handleStatusChange,
    },
  ];

  return (
    <div className="mb-4">
      <FilterBar
        search={{
          placeholder: 'Tìm theo tên học sinh, mã HS...',
          value: filterState.searchQuery,
          onChange: handleSearchChange,
        }}
        filters={filters}
        actions={
          hasActiveFilters ? (
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

export default FaceRecognitionToolbar;
