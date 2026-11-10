/**
 * Delete Fee Modal Component
 * Confirmation dialog for removing a custom fee item from the master catalog
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PopupModal)
 */

import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import {
  deleteFeeItem,
  closeDeleteModal,
} from '../../../store/slices/schoolFeeSlice';
import { PopupModal, Icon } from '@/components/ds';

export const DeleteFeeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const deletingFee = useAppSelector((state) => state.schoolFee.deletingFee);

  if (!deletingFee) {
    return null;
  }

  const handleConfirm = () => {
    const feeName = deletingFee.name;
    dispatch(deleteFeeItem(deletingFee.id));
    dispatch(
      addToast({
        type: 'success',
        message: `Đã xóa khoản phí "${feeName}" thành công!`,
      })
    );
  };

  const handleClose = () => {
    dispatch(closeDeleteModal());
  };

  return (
    <PopupModal
      open={Boolean(deletingFee)}
      onClose={handleClose}
      title="Xác nhận xóa khoản phí"
      description={`Khoản phí: ${deletingFee.name}`}
      icon="trash"
      width={460}
      primaryAction={{
        label: 'Xác nhận xóa',
        icon: 'trash',
        tone: 'danger',
        onClick: handleConfirm,
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <div className="space-y-3 text-sm text-slate-600">
        <p>
          Bạn có chắc chắn muốn xóa khoản phí{' '}
          <strong className="text-slate-900 font-bold">{deletingFee.name}</strong>{' '}
          khỏi danh mục của trường?
        </p>
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
          <Icon name="triangle-exclamation" size={14} className="text-rose-500 mt-0.5 shrink-0" />
          <p>
            Lưu ý: Hành động này sẽ loại bỏ khoản phí khỏi các mẫu cấu hình thu tiền của toàn trường.
          </p>
        </div>
      </div>
    </PopupModal>
  );
};
