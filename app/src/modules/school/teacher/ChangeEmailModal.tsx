import React, { useState } from 'react';
import { Icon } from '@/components/ds';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070CE]">
              <svg className="w-5 h-5 fill-none stroke-currentColor stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Đổi email đăng nhập</h3>
              <p className="text-xs text-slate-500">{teacher.fullName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <Icon name="xmark" size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!newEmail.trim()}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-xs ${
                !newEmail.trim()
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'text-white bg-[#0070CE] hover:bg-[#005ba8]'
              }`}
            >
              <Icon name="circle-check" size={14} />
              <span>Xác nhận cập nhật</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
