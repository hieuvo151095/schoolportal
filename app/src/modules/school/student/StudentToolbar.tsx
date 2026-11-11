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
  onOpenCreate: () => void;
  onExportExcel?: () => void;
}

export const StudentToolbar: React.FC<StudentToolbarProps> = ({
  selectedCount,
  onOpenBatchTransfer,
  onOpenPromotion,
  onOpenCreate,
  onExportExcel,
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
          placeholder: 'Chọn lớp học',
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
          placeholder: 'Chọn trạng thái',
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
      ]}
      actions={
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button
              variant="secondary"
              icon="arrow-right"
              onClick={onOpenBatchTransfer}
            >
              Chuyển lớp ({selectedCount})
            </Button>
          )}
          <Button
            variant="secondary"
            icon="graduation-cap"
            onClick={onOpenPromotion}
          >
            Lên lớp
          </Button>
          <Button
            variant="secondary"
            icon="download"
            onClick={
              onExportExcel ||
              (() => alert('Đang xuất danh sách học sinh ra file Excel...'))
            }
          >
            Xuất Excel
          </Button>
          <Button
            variant="primary"
            icon="plus"
            onClick={onOpenCreate}
          >
            Thêm học sinh
          </Button>
        </div>
      }
    />
  );
};
