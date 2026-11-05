import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/index.ts';
import { setFilterCriteria, resetFilterCriteria, setFilterModalOpen } from '../../../store/slices/gradebookSlice.ts';
import { Dropdown } from '@/components/ds';

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const FilterCard = styled.div`
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 32rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(16px) scale(0.98); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
`;

const GRADE_LEVELS = [
  'Tất cả khối',
  'Mầm non',
  'Khối 1',
  'Khối 2',
  'Khối 6',
  'Khối 12'
];

const TEACHER_OPTIONS = [
  'Tất cả giáo viên',
  'Cô Hoàng Lan Anh',
  'Thầy Trần Minh Đức',
  'Cô Nguyễn Thu Hằng',
  'Cô Phạm Thanh Thảo',
  'Cô Lê Thị Thu Cúc'
];

export const ExtendedGradebookFilterModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isFilterModalOpen, filterCriteria } = useSelector((state: RootState) => state.gradebook);

  const [searchQuery, setSearchQuery] = useState(filterCriteria.searchQuery);
  const [gradeLevel, setGradeLevel] = useState(filterCriteria.gradeLevel);
  const [homeroomTeacher, setHomeroomTeacher] = useState(filterCriteria.homeroomTeacher);
  const [academicYear, setAcademicYear] = useState(filterCriteria.academicYear);

  if (!isFilterModalOpen) return null;

  const handleApply = () => {
    dispatch(
      setFilterCriteria({
        searchQuery,
        gradeLevel,
        homeroomTeacher,
        academicYear
      })
    );
    dispatch(setFilterModalOpen(false));
  };

  const handleReset = () => {
    dispatch(resetFilterCriteria());
    setSearchQuery('');
    setGradeLevel('Tất cả khối');
    setHomeroomTeacher('Tất cả giáo viên');
    setAcademicYear('Năm học 2025 - 2026');
    dispatch(setFilterModalOpen(false));
  };

  return (
    <ModalBackdrop onClick={() => dispatch(setFilterModalOpen(false))}>
      <FilterCard onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0070CE] font-bold text-sm">
              <i className="fa-solid fa-sliders"></i>
            </span>
            <h3 className="text-base font-bold text-slate-800">Bộ Lọc Nâng Cao</h3>
          </div>
          <button
            type="button"
            onClick={() => dispatch(setFilterModalOpen(false))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Keyword search */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Từ khóa tìm kiếm
            </label>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text"
                placeholder="Tên lớp, mã lớp hoặc tên giáo viên..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Grade Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Khối lớp
            </label>
            <Dropdown
              options={GRADE_LEVELS}
              value={gradeLevel}
              onChange={(val) => setGradeLevel(val)}
              placeholder="Chọn khối lớp..."
            />
          </div>

          {/* Homeroom Teacher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Giáo viên chủ nhiệm
            </label>
            <Dropdown
              options={TEACHER_OPTIONS}
              value={homeroomTeacher}
              onChange={(val) => setHomeroomTeacher(val)}
              placeholder="Chọn giáo viên..."
              searchable={TEACHER_OPTIONS.length > 5}
              searchPlaceholder="Tìm giáo viên..."
            />
          </div>

          {/* Academic Year (Clean canonical year - BR10) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Năm học
            </label>
            <Dropdown
              options={[
                { value: 'Năm học 2025 - 2026', label: 'Năm học 2025 - 2026', badge: 'Hiện tại' },
                { value: 'Năm học 2024 - 2025', label: 'Năm học 2024 - 2025' },
                { value: 'Năm học 2023 - 2024', label: 'Năm học 2023 - 2024' },
              ]}
              value={academicYear}
              onChange={(val) => setAcademicYear(val)}
              placeholder="Chọn năm học..."
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Hệ thống đã chuẩn hóa danh mục năm học chính quy, loại trừ các năm học thử nghiệm.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <i className="fa-solid fa-arrow-rotate-left mr-1"></i> Thiết lập lại
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(setFilterModalOpen(false))}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-bold text-white bg-[#0070CE] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      </FilterCard>
    </ModalBackdrop>
  );
};
