import React from 'react';
import { Icon, SlideOver } from '@/components/ds';
import { ClassItem } from '../../../types/class';
import { canDeleteClass, getDeletionBlockReason } from '../../../utils/classValidation';

interface DeleteClassModalProps {
  isOpen: boolean;
  classItem: ClassItem | null;
  onClose: () => void;
  onConfirm: (classId: string) => void;
}

export const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  isOpen,
  classItem,
  onClose,
  onConfirm,
}) => {
  if (!classItem) return null;

  const isDeletable = canDeleteClass(classItem);
  const blockReason = getDeletionBlockReason(classItem.studentCount);

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={isDeletable ? 'Xác nhận xóa lớp học' : 'Không thể xóa lớp học này'}
      description="Kiểm tra điều kiện ràng buộc học sinh và phân công trước khi xóa lớp"
      icon={isDeletable ? 'trash' : 'triangle-exclamation'}
      width={480}
      primaryAction={
        isDeletable
          ? {
              label: 'Xóa vĩnh viễn',
              icon: 'trash',
              onClick: () => {
                onConfirm(classItem.id);
                onClose();
              },
            }
          : undefined
      }
      secondaryAction={{
        label: isDeletable ? 'Hủy bỏ' : 'Đã hiểu',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div
          className={`flex flex-col items-center text-center p-6 border rounded-2xl ${
            isDeletable
              ? 'bg-rose-50 border-rose-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-2 ${
              isDeletable
                ? 'bg-rose-100 text-rose-600 border-rose-300'
                : 'bg-amber-100 text-amber-600 border-amber-300'
            }`}
          >
            <Icon name={isDeletable ? 'trash' : 'triangle-exclamation'} size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {isDeletable ? 'Xác nhận xóa lớp học?' : 'Lớp đang có dữ liệu ràng buộc'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            {isDeletable
              ? 'Lớp học hiện có sĩ số bằng 0. Bạn có thể xóa an toàn khỏi hệ thống.'
              : 'Không thể xóa lớp học khi vẫn còn học sinh đang ghi danh.'}
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Tên lớp:</span>
            <span className="font-bold text-slate-800">{classItem.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Mã định danh:</span>
            <span className="font-mono font-semibold text-slate-700">{classItem.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Phân loại:</span>
            <span className="font-semibold text-slate-700">
              {classItem.taxonomy === 'chinh_khoa' ? 'Chính khóa' : 'Ngoại khóa & CLB'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Sĩ số thực tế:</span>
            <span
              className={`font-bold ${
                classItem.studentCount > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {classItem.studentCount} học sinh
            </span>
          </div>
        </div>

        {!isDeletable && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 leading-relaxed flex items-start gap-2.5">
            <Icon name="circle-info" size={16} className="text-rose-600 mt-0.5 shrink-0" />
            <span>{blockReason}</span>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
