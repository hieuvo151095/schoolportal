import React from 'react';
import { SlideOver } from '@/components/ds';
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
    <SlideOver
      open={isConfirmUpdateOpen}
      onClose={() => dispatch(closeConfirmUpdateModal())}
      title="Xác nhận cập nhật tài khoản"
      description="Vui lòng xác nhận lưu các thay đổi cho tài khoản người dùng"
      icon="circle-question"
      width={460}
      primaryAction={{
        label: 'Xác nhận',
        icon: 'check',
        onClick: () => dispatch(confirmUserUpdate()),
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(closeConfirmUpdateModal()),
      }}
    >
      <div className="space-y-4 py-2">
        <p className="text-sm font-semibold text-gray-800">
          Vui lòng xác nhận cập nhật tài khoản này!
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          Các thay đổi về vai trò, thông tin cá nhân và quyền truy cập sẽ được áp dụng ngay sau khi xác nhận.
        </p>
      </div>
    </SlideOver>
  );
};

export default AccountActionConfirmModal;
