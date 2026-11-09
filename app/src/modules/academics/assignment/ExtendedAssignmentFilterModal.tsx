import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setFilterCriteria,
  setFilterDrawerOpen,
  resetFilterCriteria,
} from '../../../store/slices/assignmentSlice';
import {
  AudienceType,
  DueDateFilter,
  AssignmentLifecycleStatus,
} from '../../../types/assignment';
import { SlideOver, Dropdown } from '@/components/ds';

export const ExtendedAssignmentFilterModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(
    (state) => state.assignment.isFilterDrawerOpen
  );
  const filterCriteria = useAppSelector(
    (state) => state.assignment.filterCriteria
  );

  const [audience, setAudience] = useState<'all' | AudienceType>(
    filterCriteria.audienceType || 'all'
  );
  const [dueDate, setDueDate] = useState<DueDateFilter>(
    filterCriteria.dueDateFilter
  );
  const [status, setStatus] = useState<'all' | AssignmentLifecycleStatus>(
    filterCriteria.status
  );

  useEffect(() => {
    if (isOpen) {
      setAudience(filterCriteria.audienceType || 'all');
      setDueDate(filterCriteria.dueDateFilter);
      setStatus(filterCriteria.status);
    }
  }, [isOpen, filterCriteria]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(setFilterDrawerOpen(false));
  };

  const handleApply = () => {
    dispatch(
      setFilterCriteria({
        audienceType: audience,
        dueDateFilter: dueDate,
        status,
      })
    );
    handleClose();
  };

  const handleReset = () => {
    dispatch(resetFilterCriteria());
    setAudience('all');
    setDueDate('tat_ca');
    setStatus('all');
    handleClose();
  };

  const audienceOptions = [
    { value: 'all', label: 'Tất cả đối tượng' },
    { value: 'whole_class', label: 'Giao cho cả lớp' },
    { value: 'specific_students', label: 'Giao học sinh cụ thể' },
  ];

  const dueDateOptions = [
    { value: 'tat_ca', label: 'Tất cả thời hạn' },
    { value: 'dang_tien_hanh', label: 'Đang tiến hành (Chưa hết hạn)' },
    { value: 'sap_het_han', label: 'Sắp hết hạn (trong 24 giờ)' },
    { value: 'het_han', label: 'Đã hết hạn nộp bài' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'da_tao', label: 'Bản nháp' },
    { value: 'chua_gui', label: 'Chờ phát hành' },
    { value: 'da_gui', label: 'Đã gửi học sinh' },
  ];

  return (
    <SlideOver
      open={isOpen}
      onClose={handleClose}
      title="Bộ lọc nâng cao bài tập"
      description="Lọc danh sách bài tập theo đối tượng giao, thời hạn và trạng thái phát hành"
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
            Đối tượng nhận bài
          </label>
          <Dropdown
            fullWidth
            value={audience}
            onChange={(val) => setAudience(val as any)}
            options={audienceOptions}
            placeholder="-- Chọn đối tượng --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Thời hạn nộp bài
          </label>
          <Dropdown
            fullWidth
            value={dueDate}
            onChange={(val) => setDueDate(val as any)}
            options={dueDateOptions}
            placeholder="-- Chọn thời hạn --"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-heading)] mb-1.5">
            Trạng thái bài tập
          </label>
          <Dropdown
            fullWidth
            value={status}
            onChange={(val) => setStatus(val as any)}
            options={statusOptions}
            placeholder="-- Chọn trạng thái --"
          />
        </div>

        <div className="bg-[var(--bg-muted)] border border-[var(--border-default)] rounded-lg p-3 text-xs text-[var(--text-subtle)] space-y-1">
          <p className="font-semibold text-[var(--text-heading)]">Mẹo lọc nhanh:</p>
          <p>• Bạn có thể kết hợp nhanh với thanh CountedTabs ở đầu trang để lọc theo tiến độ.</p>
          <p>• Dùng ô tìm kiếm trên thanh công cụ để tra cứu theo từ khóa tiêu đề hoặc ghi chú.</p>
        </div>
      </div>
    </SlideOver>
  );
};

export default ExtendedAssignmentFilterModal;
