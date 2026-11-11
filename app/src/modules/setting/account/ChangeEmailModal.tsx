import React, { useState, useEffect } from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { EcoInput } from '../../../components/eco';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeChangeEmailModal, confirmChangeEmail } from '../../../store/slices/accountSlice';
import { validateEmailPayload } from '../../../utils/accountValidation';

export const ChangeEmailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isChangeEmailOpen, targetEmailUser } = useAppSelector((state) => state.account);

  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isChangeEmailOpen) {
      setNewEmail('');
      setError(null);
    }
  }, [isChangeEmailOpen]);

  if (!isChangeEmailOpen || !targetEmailUser) return null;

  const handleSubmit = () => {
    const validation = validateEmailPayload(newEmail, targetEmailUser.email);
    if (!validation.isValid) {
      setError(validation.error || 'Email không hợp lệ');
      return;
    }

    dispatch(
      confirmChangeEmail({
        userId: targetEmailUser.id,
        newEmail: newEmail.trim(),
      })
    );
  };

  return (
    <SlideOver
      open={isChangeEmailOpen}
      onClose={() => dispatch(closeChangeEmailModal())}
      title="Thay đổi email tài khoản"
      description={`Cập nhật email đăng nhập cho người dùng ${targetEmailUser.fullName}`}
      icon="envelope"
      width={480}
      primaryAction={{
        label: 'Xác nhận thay đổi',
        icon: 'check',
        onClick: handleSubmit,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(closeChangeEmailModal()),
      }}
    >
      <div className="space-y-4 py-2">
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
          <p>
            Email hiện tại:{' '}
            <span className="font-semibold text-gray-800">{targetEmailUser.email}</span>
          </p>
        </div>

        <div>
          <EcoInput
            label="Địa chỉ email mới"
            required
            type="email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="nhap.email.moi@domain.com"
            error={error || undefined}
          />
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <p className="font-semibold">Lưu ý quan trọng (BR06):</p>
          <p className="mt-0.5">
            Email mới sẽ được dùng để đăng nhập hệ thống. Đảm bảo người dùng có quyền truy cập hòm
            thư này.
          </p>
        </div>
      </div>
    </SlideOver>
  );
};

export default ChangeEmailModal;
