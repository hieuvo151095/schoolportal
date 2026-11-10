import React from 'react';
import { Icon, SlideOver } from '../../../components/ds';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onCancel}
      title="Thay đổi chưa được lưu"
      description="Cảnh báo mất dữ liệu khi rời khỏi trang mà chưa lưu biểu mẫu"
      icon="triangle-exclamation"
      width={460}
      primaryAction={{
        label: 'Rời khỏi trang',
        icon: 'arrow-right-from-bracket',
        onClick: onConfirm,
      }}
      secondaryAction={{
        label: 'Tiếp tục chỉnh sửa',
        onClick: onCancel,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-amber-300">
            <Icon name="triangle-exclamation" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Chưa lưu thay đổi?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn hủy và rời khỏi trang không? Các dữ liệu vừa nhập sẽ bị mất.
          </p>
        </div>
      </div>
    </SlideOver>
  );
};
