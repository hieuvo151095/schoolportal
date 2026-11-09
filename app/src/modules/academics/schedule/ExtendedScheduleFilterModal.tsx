import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  resetFilters,
  setFilterCriteria,
  setFilterDrawerOpen,
} from '../../../store/slices/scheduleSlice';
import { SlideOver, Dropdown } from '@/components/ds';

export const ExtendedScheduleFilterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isFilterDrawerOpen, filterCriteria, semesters } = useAppSelector(
    (state) => state.schedule
  );

  const [semesterId, setSemesterId] = useState(filterCriteria.semesterId);
  const [academicYear, setAcademicYear] = useState(filterCriteria.academicYear);
  const [type, setType] = useState(filterCriteria.type);
  const [status, setStatus] = useState(filterCriteria.status);

  // Sync state when drawer opens
  useEffect(() => {
    if (isFilterDrawerOpen) {
      setSemesterId(filterCriteria.semesterId);
      setAcademicYear(filterCriteria.academicYear);
      setType(filterCriteria.type);
      setStatus(filterCriteria.status);
    }
  }, [isFilterDrawerOpen, filterCriteria]);

  if (!isFilterDrawerOpen) return null;

  const handleClose = () => {
    dispatch(setFilterDrawerOpen(false));
  };

  const handleApply = () => {
    dispatch(
      setFilterCriteria({
        semesterId,
        academicYear,
        type,
        status,
      })
    );
    handleClose();
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSemesterId('all');
    setAcademicYear('all');
    setType('all');
    setStatus('all');
    handleClose();
  };

  const semesterOptions = [
    { value: 'all', label: 'Tất cả các học kỳ' },
    ...semesters.map((sem) => ({
      value: sem.id,
      label: `${sem.name} (${sem.academicYear})`,
    })),
  ];

  const yearOptions = [
    { value: 'all', label: 'Tất cả năm học' },
    { value: '2026-2027', label: '2026 - 2027 (Hiện hành)' },
    { value: '2025-2026', label: '2025 - 2026' },
  ];

  const typeOptions = [
    { value: 'all', label: 'Tất cả định dạng' },
    { value: 'grid', label: '📊 Dạng lưới (Grid Matrix)' },
    { value: 'file', label: '📄 Dạng file đính kèm (PDF / Image)' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'published', label: '● Đã phát hành' },
    { value: 'updated', label: '★ Cập nhật (Đã gửi điều chỉnh)' },
    { value: 'draft', label: '○ Bản nháp' },
  ];

  return (
    <SlideOver
      open={isFilterDrawerOpen}
      onClose={handleClose}
      title="Bộ lọc nâng cao thời khóa biểu"
      description="Lọc danh sách thời khóa biểu theo học kỳ, năm học, định dạng và trạng thái"
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
            Học kỳ
          </label>
          <Dropdown
            searchable
            fullWidth
            value={semesterId}
            onChange={(val) => setSemesterId(val)}
            options={semesterOptions}
            placeholder="-- Chọn học kỳ --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Niên khóa / Năm học
          </label>
          <Dropdown
            searchable
            fullWidth
            value={academicYear}
            onChange={(val) => setAcademicYear(val)}
            options={yearOptions}
            placeholder="-- Chọn năm học --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Định dạng thời khóa biểu
          </label>
          <Dropdown
            fullWidth
            value={type}
            onChange={(val) => setType(val as any)}
            options={typeOptions}
            placeholder="-- Chọn định dạng --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Trạng thái phát hành
          </label>
          <Dropdown
            fullWidth
            value={status}
            onChange={(val) => setStatus(val as any)}
            options={statusOptions}
            placeholder="-- Chọn trạng thái --"
          />
        </div>
      </div>
    </SlideOver>
  );
};

export default ExtendedScheduleFilterModal;
