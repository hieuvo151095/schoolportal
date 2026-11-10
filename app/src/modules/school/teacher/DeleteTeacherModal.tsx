import React from 'react';
import { Icon } from '@/components/ds';
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

  if (!isOpen || !teacher) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-red-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <Icon name="trash" size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-900">Xác nhận xóa giáo viên</h3>
              <p className="text-xs text-red-600 font-medium">{teacher.fullName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <Icon name="xmark" size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <Icon
              name="triangle-exclamation"
              size={16}
              className="text-amber-600 mt-0.5 shrink-0"
            />
            <div className="leading-relaxed">
              Hành động này sẽ xóa tài khoản đăng nhập của giáo viên và hủy toàn bộ các phân công
              chủ nhiệm cũng như lớp giảng dạy phụ trách. Dữ liệu lịch sử điểm danh và đánh giá đã
              nhập trước đó vẫn được lưu trữ.
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Mã nhân viên:</span>
              <span className="font-semibold text-slate-800">{teacher.staffCode || 'Chưa có'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email đăng nhập:</span>
              <span className="font-mono text-slate-700">{teacher.email}</span>
            </div>
            {teacher.homeroomClassName && (
              <div className="flex justify-between">
                <span className="text-slate-500">Lớp đang chủ nhiệm:</span>
                <span className="font-semibold text-emerald-700">{teacher.homeroomClassName}</span>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-xs"
            >
              <Icon name="trash" size={14} />
              <span>Xóa giáo viên</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
