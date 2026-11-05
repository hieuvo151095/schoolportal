import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { EcoDialog, EcoInput } from '../../../components/eco';
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
    <EcoDialog
      open={isChangeEmailOpen}
      onClose={() => dispatch(closeChangeEmailModal())}
      onCancel={() => dispatch(closeChangeEmailModal())}
      onConfirm={handleSubmit}
      confirmLabel="Xác nhận thay đổi"
      cancelLabel="Hủy bỏ"
      title="Thay đổi email tài khoản"
      maxWidth="480px"
    >
      <div className="space-y-4 py-2">
        <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2.5">
          <FontAwesomeIcon icon={faEnvelope} className="text-sm mt-0.5 text-blue-600 shrink-0" />
          <p>
            Email này sẽ được sử dụng làm tên đăng nhập và nhận các thông báo điều hành từ cổng thông tin trường học.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email hiện tại
          </label>
          <input
            type="text"
            readOnly
            value={targetEmailUser.email}
            className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-600 border border-gray-200 rounded-lg cursor-not-allowed select-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email mới <span className="text-red-500">*</span>
          </label>
          <EcoInput
            type="email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="vd: ten.nguyen@ecoschool.edu.vn"
            error={error || undefined}
            autoFocus
          />
        </div>
      </div>
    </EcoDialog>
  );
};
