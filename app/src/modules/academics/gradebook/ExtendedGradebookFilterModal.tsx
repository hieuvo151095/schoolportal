import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/index';
import {
  setFilterCriteria,
  resetFilterCriteria,
  setFilterModalOpen,
} from '../../../store/slices/gradebookSlice';
import { SlideOver, Dropdown } from '@/components/ds';

const GRADE_LEVELS = [
  'Tất cả khối',
  'Mầm non',
  'Khối 1',
  'Khối 2',
  'Khối 6',
  'Khối 12',
];

const TEACHER_OPTIONS = [
  'Tất cả giáo viên',
  'Cô Hoàng Lan Anh',
  'Thầy Trần Minh Đức',
  'Cô Nguyễn Thu Hằng',
  'Cô Phạm Thanh Thảo',
  'Cô Lê Thị Thu Cúc',
];

const ACADEMIC_YEARS = [
  'Năm học 2026 - 2027',
  'Năm học 2025 - 2026',
  'Năm học 2024 - 2025',
];

export const ExtendedGradebookFilterModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isFilterModalOpen, filterCriteria } = useSelector(
    (state: RootState) => state.gradebook
  );

  const [searchQuery, setSearchQuery] = useState(filterCriteria.searchQuery);
  const [gradeLevel, setGradeLevel] = useState(filterCriteria.gradeLevel);
  const [homeroomTeacher, setHomeroomTeacher] = useState(
    filterCriteria.homeroomTeacher
  );
  const [academicYear, setAcademicYear] = useState(filterCriteria.academicYear);

  useEffect(() => {
    if (isFilterModalOpen) {
      setSearchQuery(filterCriteria.searchQuery);
      setGradeLevel(filterCriteria.gradeLevel);
      setHomeroomTeacher(filterCriteria.homeroomTeacher);
      setAcademicYear(filterCriteria.academicYear);
    }
  }, [isFilterModalOpen, filterCriteria]);

  if (!isFilterModalOpen) return null;

  const handleClose = () => {
    dispatch(setFilterModalOpen(false));
  };

  const handleApply = () => {
    dispatch(
      setFilterCriteria({
        searchQuery,
        gradeLevel,
        homeroomTeacher,
        academicYear,
      })
    );
    handleClose();
  };

  const handleReset = () => {
    dispatch(resetFilterCriteria());
    setSearchQuery('');
    setGradeLevel('Tất cả khối');
    setHomeroomTeacher('Tất cả giáo viên');
    setAcademicYear('Năm học 2025 - 2026');
    handleClose();
  };

  return (
    <SlideOver
      open={isFilterModalOpen}
      onClose={handleClose}
      title="Bộ lọc nâng cao bảng điểm"
      description="Lọc danh sách bảng điểm theo khối lớp, giáo viên chủ nhiệm và năm học"
      icon="filter"
      width={460}
      primaryAction={{
        label: 'Áp dụng bộ lọc',
        icon: 'check',
        onClick: handleApply,
      }}
      secondaryAction={{
        label: 'Đặt lại',
        onClick: handleReset,
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Từ khóa tìm kiếm
          </label>
          <input
            type="text"
            placeholder="Tên lớp, mã lớp hoặc tên giáo viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 px-3 border border-[var(--border-default)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-body)] focus:border-[var(--primary)] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Khối lớp
          </label>
          <Dropdown
            searchable
            fullWidth
            options={GRADE_LEVELS}
            value={gradeLevel}
            onChange={(val) => setGradeLevel(val)}
            placeholder="Chọn khối lớp..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Giáo viên chủ nhiệm
          </label>
          <Dropdown
            searchable
            fullWidth
            options={TEACHER_OPTIONS}
            value={homeroomTeacher}
            onChange={(val) => setHomeroomTeacher(val)}
            placeholder="Chọn giáo viên..."
            searchPlaceholder="Tìm giáo viên..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Năm học
          </label>
          <Dropdown
            fullWidth
            options={ACADEMIC_YEARS}
            value={academicYear}
            onChange={(val) => setAcademicYear(val)}
            placeholder="Chọn năm học..."
          />
        </div>

        <div className="bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-subtle)] space-y-1">
          <p className="font-semibold text-[var(--text-heading)]">Lưu ý quản trị:</p>
          <p>• Dữ liệu bảng điểm và tiến độ nhập điểm sẽ tự động đồng bộ theo năm học được chọn.</p>
        </div>
      </div>
    </SlideOver>
  );
};

export default ExtendedGradebookFilterModal;
