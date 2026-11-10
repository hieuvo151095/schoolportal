import React, { useState } from 'react';
import { Icon, SlideOver } from '@/components/ds';
import type { Teacher } from '../../../types/teacher';
import { validateEmailChange } from '../../../utils/teacherValidation';
import { useAppDispatch } from '../../../store';
import { changeTeacherEmail } from '../../../store/slices/teacherSlice';
import { addToast } from '../../../store/slices/toastSlice';

interface ChangeEmailModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  teacher,
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !teacher) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEmailChange(teacher.email, newEmail);
    if (!validation.isValid) {
      setError(validation.error || 'Email không hợp lệ');
      return;
    }

    dispatch(
      changeTeacherEmail({
        teacherId: teacher.id,
        newEmail: newEmail.trim(),
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Đổi email thành công',
        message: `Đã cập nhật email cho giáo viên "${teacher.fullName}" sang ${newEmail.trim()}`,
      })
    );

    setNewEmail('');
    setError(null);
    onClose();
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title="Đổi email đăng nhập"
      description={teacher.fullName}
      icon="envelope"
      width={480}
      primaryAction={{
        label: 'Xác nhận cập nhật',
        icon: 'circle-check',
        disabled: !newEmail.trim(),
        onClick: () => {
          const form = document.getElementById('change-email-form') as HTMLFormElement;
          if (form) form.requestSubmit();
        },
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: onClose,
      }}
    >
      <form id="change-email-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Email đăng nhập hiện tại
          </label>
          <input
            type="text"
            readOnly
            value={teacher.email}
            className="w-full px-3.5 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email đăng nhập mới <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="nhap.email.moi@school.edu.vn"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              if (error) setError(null);
            }}
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0070CE] transition-colors ${
              error ? 'border-red-400 bg-red-50/30' : 'border-slate-300'
            }`}
          />
          {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
          <p className="text-xs text-slate-400 mt-1.5">
            Email này sẽ được sử dụng để đăng nhập vào Cổng thông tin và nhận các thông báo hệ thống.
          </p>
        </div>
      </form>
    </SlideOver>
  );
};
