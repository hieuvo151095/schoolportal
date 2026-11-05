import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faRotateRight,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFilterState } from '@/store/slices/faceRecognitionSlice';
import type { FaceRegistrationStatus } from '@/types/faceRecognition';
import { MOCK_CLASSES } from '@/services/mockFaceRecognitionData';

export const FaceRecognitionToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state) => state.faceRecognition.filterState);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilterState({ searchQuery: e.target.value, page: 1 }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilterState({ classId: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      setFilterState({
        registrationStatus: e.target.value as FaceRegistrationStatus,
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
            value={filterState.searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm theo tên học sinh, mã HS..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => dispatch(setFilterState({ searchQuery: '', page: 1 }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1.5 py-0.5 rounded bg-gray-200/60"
              title="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Class Filter */}
          <div className="relative min-w-[170px]">
            <select
              value={filterState.classId}
              onChange={handleClassChange}
              className="w-full text-xs py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 font-medium cursor-pointer"
            >
              <option value="all">Tất cả các lớp</option>
              {MOCK_CLASSES.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Registration Status Filter */}
          <div className="relative min-w-[190px]">
            <select
              value={filterState.registrationStatus}
              onChange={handleStatusChange}
              className="w-full text-xs py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 font-medium cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="registered">Đã đăng ký nhận diện</option>
              <option value="unregistered">Chưa đăng ký nhận diện</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium flex items-center gap-1.5 shrink-0"
              title="Đặt lại bộ lọc"
            >
              <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
