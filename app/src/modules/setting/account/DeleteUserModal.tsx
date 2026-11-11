import React from 'react';
import { SlideOver, Icon } from '@/components/ds';
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
    <SlideOver
      open={isDeleteUserOpen}
      onClose={() => dispatch(closeDeleteUserModal())}
      title="Xác nhận xóa tài khoản"
      description={`Vui lòng xác nhận xoá tài khoản ${targetDeleteUser.fullName}`}
      icon="trash"
      width={460}
      primaryAction={{
        label: 'Xác nhận xóa',
        icon: 'trash',
        tone: 'danger',
        onClick: () => dispatch(confirmDeleteUser()),
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(closeDeleteUserModal()),
      }}
    >
      <div className="space-y-4 py-2">
        <p className="text-sm font-semibold text-gray-800">
          Vui lòng xác nhận xoá tài khoản <span className="font-bold text-gray-900">{targetDeleteUser.fullName}</span> ({targetDeleteUser.email})!
        </p>
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
          <Icon name="triangle-exclamation" size={14} className="text-rose-600 shrink-0 mt-0.5" />
          <span>
            Hành động này không thể hoàn tác. Người dùng sẽ mất toàn bộ quyền truy cập vào cổng thông tin trường học.
          </span>
        </div>
      </div>
    </SlideOver>
  );
};

export default DeleteUserModal;
