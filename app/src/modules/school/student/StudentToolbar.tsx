/**
 * Student Directory Toolbar
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, SelectField, Button)
 */

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setFilter } from '../../../store/slices/studentSlice';
import { FilterBar, Button } from '../../../components/ds';

interface StudentToolbarProps {
  schoolCode: string;
  selectedCount: number;
  onOpenBatchTransfer: () => void;
  onOpenPromotion: () => void;
}

export const StudentToolbar: React.FC<StudentToolbarProps> = ({
  selectedCount,
  onOpenBatchTransfer,
  onOpenPromotion,
}) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.student.filter);

  return (
    <FilterBar
      search={{
        placeholder: 'Tìm theo tên, mã HS, CCCD, PH...',
        value: filter.search || '',
        onChange: (val) => dispatch(setFilter({ search: val })),
      }}
      filters={[
        {
          options: [
            { label: 'Tất cả lớp học', value: 'all' },
            { label: 'Lớp 10A1', value: 'class-10a1' },
            { label: 'Lớp 10A2', value: 'class-10a2' },
            { label: 'Lớp 10A3', value: 'class-10a3' },
          ],
          value: filter.classId || 'all',
          onChange: (val) => dispatch(setFilter({ classId: val })),
        },
        {
          options: [
            { label: 'Tất cả trạng thái', value: 'all' },
            { label: 'Đang học', value: 'active' },
            { label: 'Tạm nghỉ / Bảo lưu', value: 'reserved' },
            { label: 'Đã chuyển trường', value: 'transferred' },
            { label: 'Đã tốt nghiệp', value: 'graduated' },
          ],
          value: filter.status || 'all',
          onChange: (val) => dispatch(setFilter({ status: val })),
        },
        {
          options: [
            { label: 'Tất cả giới tính', value: 'all' },
            { label: 'Nam', value: 'Nam' },
            { label: 'Nữ', value: 'Nữ' },
          ],
          value: filter.gender || 'all',
          onChange: (val) => dispatch(setFilter({ gender: val })),
        },
      ]}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <Button
          variant="secondary"
          icon="arrow-right"
          onClick={onOpenBatchTransfer}
          disabled={selectedCount === 0}
        >
          Chuyển lớp ({selectedCount})
        </Button>
        <Button
          variant="secondary"
          icon="graduation-cap"
          onClick={onOpenPromotion}
        >
          Lên lớp niên khóa
        </Button>
      </div>
    </FilterBar>
  );
};
