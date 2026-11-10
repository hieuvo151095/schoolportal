import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';
import { WeeklyMenu } from '../../../types/menu';

interface DeleteMenuModalProps {
  isOpen: boolean;
  menu: WeeklyMenu | null;
  onClose: () => void;
  onConfirmDelete: (menuId: string) => void;
}

export const DeleteMenuModal: React.FC<DeleteMenuModalProps> = ({
  isOpen,
  menu,
  onClose,
  onConfirmDelete,
}) => {
  if (!menu) return null;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Xóa thực đơn"
      description="Xác nhận hủy và loại bỏ thực đơn khỏi hệ thống"
      icon="trash"
      width={480}
      primaryAction={{
        label: 'Xác nhận xóa',
        icon: 'trash',
        onClick: () => {
          onConfirmDelete(menu.id);
          onClose();
        },
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
            Xác nhận xóa thực đơn?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Hành động này sẽ xóa hoàn toàn bản nháp thực đơn khỏi hệ thống và không thể hoàn tác.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Tên thực đơn:</span>
            <span className="font-bold text-slate-800">{menu.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Thời gian:</span>
            <span className="font-semibold text-slate-700">{menu.startDate} đến {menu.endDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Đối tượng:</span>
            <span className="font-semibold text-slate-700">
              {menu.scope === 'all' ? 'Toàn trường' : menu.className || 'Lớp cụ thể'}
            </span>
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
