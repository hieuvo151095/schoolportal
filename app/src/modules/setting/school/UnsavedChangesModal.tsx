import React from 'react';
import { SlideOver, Icon } from '@/components/ds';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onCancel}
      title="Chưa lưu thay đổi"
      description="Cảnh báo rời khỏi màn hình khi có chỉnh sửa chưa được lưu"
      icon="triangle-exclamation"
      width={460}
      primaryAction={{
        label: 'Xác nhận rời khỏi',
        icon: 'arrow-right-from-bracket',
        tone: 'danger',
        onClick: onConfirm,
      }}
      secondaryAction={{
        label: 'Ở lại chỉnh sửa',
        onClick: onCancel,
      }}
    >
      <div className="space-y-4 py-2">
        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <Icon name="triangle-exclamation" size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!
          </p>
        </div>

        <p className="text-xs text-slate-500">
          Các thông tin đã nhập trên biểu mẫu sẽ bị hủy bỏ nếu bạn rời khỏi màn hình này.
        </p>
      </div>
    </SlideOver>
  );
};

export default UnsavedChangesModal;
