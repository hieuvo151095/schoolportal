import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { EcoDialog } from '../../../components/eco';

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
  if (!isOpen) return null;

  return (
    <EcoDialog
      open={isOpen}
      onClose={onCancel}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title="Chưa lưu thay đổi"
      confirmLabel="Xác nhận rời khỏi"
      cancelLabel="Hủy bỏ"
      confirmVariant="danger"
    >
      <div className="flex items-start gap-4 py-2">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-lg" />
        </div>
        <div>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Các thông tin đã nhập trên biểu mẫu sẽ bị hủy bỏ nếu bạn rời khỏi màn hình này.
          </p>
        </div>
      </div>
    </EcoDialog>
  );
};
