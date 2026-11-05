import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { EcoDialog } from '../../../components/eco';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeConfirmUpdateModal,
  confirmUserUpdate,
} from '../../../store/slices/accountSlice';

export const AccountActionConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isConfirmUpdateOpen } = useAppSelector((state) => state.account);

  if (!isConfirmUpdateOpen) return null;

  return (
    <EcoDialog
      open={isConfirmUpdateOpen}
      onClose={() => dispatch(closeConfirmUpdateModal())}
      onCancel={() => dispatch(closeConfirmUpdateModal())}
      onConfirm={() => dispatch(confirmUserUpdate())}
      confirmLabel="Xác nhận"
      cancelLabel="Hủy bỏ"
      title="Xác nhận cập nhật"
      maxWidth="440px"
    >
      <div className="flex flex-col items-center text-center py-4 space-y-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <FontAwesomeIcon icon={faCircleQuestion} className="text-2xl" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Vui lòng xác nhận cập nhật tài khoản này!
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Các thay đổi về vai trò và thông tin cá nhân sẽ được áp dụng ngay sau khi xác nhận.
          </p>
        </div>
      </div>
    </EcoDialog>
  );
};
