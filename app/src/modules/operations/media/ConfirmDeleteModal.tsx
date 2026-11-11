import React from 'react';
import { SlideOver, Icon } from '@/components/ds';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  isDestructive = true,
  onConfirm,
  onClose,
}) => {
  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      icon={isDestructive ? 'trash' : 'triangle-exclamation'}
      title={title}
      description="Vui lòng xác nhận trước khi tiếp tục thao tác"
      width={460}
      primaryAction={{
        label: confirmText,
        icon: isDestructive ? 'trash' : 'check',
        tone: isDestructive ? 'danger' : undefined,
        onClick: () => {
          onConfirm();
          onClose();
        },
      }}
      secondaryAction={{
        label: cancelText,
        onClick: onClose,
      }}
    >
      <div className="space-y-4">
        <div className="text-sm text-slate-700 leading-relaxed">
          {message}
        </div>

        <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
          <Icon name="triangle-exclamation" size={14} className="text-amber-600 shrink-0 mt-0.5" />
          <span>Lưu ý: Thao tác này không thể hoàn tác sau khi đã thực hiện.</span>
        </div>
      </div>
    </SlideOver>
  );
};

export default ConfirmDeleteModal;
