/**
 * Teacher Directory Toolbar
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (FilterBar, SearchField, SelectField, Button)
 */

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setFilter } from '../../../store/slices/teacherSlice';
import { FilterBar, Button } from '../../../components/ds';

interface TeacherToolbarProps {
  schoolCode: string;
  onOpenExtendedFilter: () => void;
  onOpenCreate: () => void;
  onExportExcel?: () => void;
}

export const TeacherToolbar: React.FC<TeacherToolbarProps> = ({
  onOpenExtendedFilter,
  onOpenCreate,
  onExportExcel,
}) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.teacher.filter);

  return (
    <FilterBar
      search={{
        placeholder: 'Tìm theo họ tên, email, mã NV, CCCD...',
        value: filter.search || '',
        onChange: (val) => dispatch(setFilter({ search: val })),
      }}
      filters={[
        {
          placeholder: 'Chọn lớp học',
          options: [
            { label: 'Tất cả lớp học', value: 'all' },
            { label: 'Lớp 1A1', value: 'lop-1a1' },
            { label: 'Lớp 1A2', value: 'lop-1a2' },
            { label: 'Lớp 2A1', value: 'lop-2a1' },
            { label: 'Lớp Vẽ Sáng Tạo', value: 'lop-nk-ve' },
          ],
          value: filter.classId || 'all',
          defaultValue: 'all',
          onChange: (val) => dispatch(setFilter({ classId: val })),
        },
        {
          placeholder: 'Chọn phân quyền',
          options: [
            { label: 'Tất cả phân quyền', value: 'all' },
            { label: 'Giáo viên chính', value: 'chinh' },
            { label: 'Giáo viên hỗ trợ', value: 'ho_tro' },
          ],
          value: filter.permissionTier || 'all',
          defaultValue: 'all',
          onChange: (val) => dispatch(setFilter({ permissionTier: val })),
        },
        {
          placeholder: 'Chọn trạng thái',
          options: [
            { label: 'Tất cả trạng thái', value: 'all' },
            { label: 'Đang làm việc', value: 'dang_lam_viec' },
            { label: 'Tạm nghỉ', value: 'tam_nghi' },
            { label: 'Đã nghỉ việc', value: 'da_nghi_viec' },
          ],
          value: filter.status || 'all',
          defaultValue: 'all',
          onChange: (val) => dispatch(setFilter({ status: val })),
        },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon="download"
            onClick={
              onExportExcel ||
              (() => alert('Đang xuất danh sách giáo viên ra file Excel...'))
            }
          >
            Xuất Excel
          </Button>
          <Button
            variant="primary"
            icon="plus"
            onClick={onOpenCreate}
          >
            Thêm giáo viên
          </Button>
        </div>
      }
    />
  );
};
