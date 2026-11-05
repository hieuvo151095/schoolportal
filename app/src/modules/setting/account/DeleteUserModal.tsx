import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { EcoDialog } from '../../../components/eco';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeDeleteUserModal,
  confirmDeleteUser,
} from '../../../store/slices/accountSlice';

export const DeleteUserModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDeleteUserOpen, targetDeleteUser } = useAppSelector((state) => state.account);

  if (!isDeleteUserOpen || !targetDeleteUser) return null;

  return (
    <EcoDialog
      open={isDeleteUserOpen}
      onClose={() => dispatch(closeDeleteUserModal())}
      onCancel={() => dispatch(closeDeleteUserModal())}
      onConfirm={() => dispatch(confirmDeleteUser())}
      confirmLabel="Xác nhận xóa"
      cancelLabel="Hủy bỏ"
      confirmVariant="danger"
      title="Xác nhận xóa tài khoản"
      maxWidth="440px"
    >
      <div className="flex flex-col items-center text-center py-4 space-y-3">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Vui lòng xác nhận xoá tài khoản {targetDeleteUser.fullName}!
          </p>
          <p className="text-xs text-red-600 mt-1">
            Hành động này không thể hoàn tác. Người dùng sẽ mất toàn bộ quyền truy cập vào cổng thông tin trường học.
          </p>
        </div>
      </div>
    </EcoDialog>
  );
};
