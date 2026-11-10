import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import type { Teacher } from '../../../types/teacher';
import { useAppDispatch } from '../../../store';
import { deleteTeacher } from '../../../store/slices/teacherSlice';
import { addToast } from '../../../store/slices/toastSlice';

interface DeleteTeacherModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteTeacherModal: React.FC<DeleteTeacherModalProps> = ({
  teacher,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  if (!teacher) return null;

  const handleConfirmDelete = () => {
    dispatch(deleteTeacher(teacher.id));
    dispatch(
      addToast({
        type: 'success',
        title: 'Xóa giáo viên thành công',
        message: `Đã xóa giáo viên "${teacher.fullName}" khỏi hệ thống`,
      })
    );
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Xác nhận xóa giáo viên"
      description="Gỡ bỏ tài khoản và hồ sơ giáo viên khỏi hệ thống trường"
      icon="trash"
      width={480}
      primaryAction={{
        label: 'Xác nhận xóa',
        icon: 'trash',
        onClick: handleConfirmDelete,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-rose-50 border border-rose-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-rose-300">
            <Icon name="trash" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Xác nhận xóa giáo viên?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Thao tác này sẽ loại bỏ giáo viên khỏi hệ thống phân công giảng dạy.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Họ và tên:</span>
            <span className="font-bold text-slate-800">{teacher.fullName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Mã nhân sự:</span>
            <span className="font-semibold text-slate-700 font-mono">{teacher.staffCode || teacher.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Email:</span>
            <span className="font-semibold text-slate-700">{teacher.email}</span>
          </div>
        </div>

        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <Icon name="triangle-exclamation" size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 leading-relaxed">
            Nếu giáo viên đang làm chủ nhiệm hoặc giảng dạy lớp nào, vui lòng chuyển giao phân công trước để tránh gián đoạn dữ liệu học tập.
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
