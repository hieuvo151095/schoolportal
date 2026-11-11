import React, { useState, useEffect } from 'react';
import { SlideOver, Icon, Avatar } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeStudentModal,
  saveStudentAccount,
} from '../../../store/slices/accountSlice';
import { validateStudentAccountPayload } from '../../../utils/accountValidation';

export const StudentAccountModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isStudentModalOpen, studentModalMode, selectedStudent } = useAppSelector(
    (state) => state.account
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isStudentModalOpen && selectedStudent) {
      setUsername(selectedStudent.username || '');
      setPassword('');
      setConfirmPassword('');
      setIsActive(selectedStudent.status === 'active');
      setErrors({});
    }
  }, [isStudentModalOpen, selectedStudent]);

  if (!isStudentModalOpen || !selectedStudent) return null;

  const isCreate = studentModalMode === 'create';

  const handleSubmit = () => {
    const validation = validateStudentAccountPayload(
      {
        studentId: selectedStudent.studentId,
        username,
        password,
        confirmPassword,
      },
      isCreate
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    dispatch(
      saveStudentAccount({
        studentId: selectedStudent.studentId,
        username: username.trim(),
        active: isActive,
        password: password ? password : undefined,
      })
    );
  };

  return (
    <SlideOver
      open={isStudentModalOpen}
      onClose={() => dispatch(closeStudentModal())}
      title={isCreate ? 'Cấp tài khoản học sinh' : 'Chỉnh sửa tài khoản học sinh'}
      description={`Học sinh: ${selectedStudent.studentName} (Mã: ${selectedStudent.studentCode})`}
      icon="user-graduate"
      width={520}
      primaryAction={{
        label: isCreate ? 'Cấp tài khoản' : 'Lưu tài khoản',
        onClick: handleSubmit,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(closeStudentModal()),
      }}
    >
      <div className="space-y-4 py-2">
        {/* Student Context Card */}
        <div className="p-3.5 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-3">
            <Avatar name={selectedStudent.studentName} size="md" />
            <div>
              <p className="font-semibold text-slate-900 text-sm">{selectedStudent.studentName}</p>
              <p className="text-[var(--text-subtle)]">Mã HS: {selectedStudent.studentCode} • Lớp: {selectedStudent.className}</p>
            </div>
          </div>
          {selectedStudent.isSyncedCsdlSo && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#0070CE] border border-blue-200">
              <Icon name="cloud" size={12} />
              <span>CSDL Sở</span>
            </span>
          )}
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tên tài khoản <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
            }}
            placeholder="vd: an.nguyen2018"
            className={`w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] ${
              errors.username ? 'border-red-500' : 'border-[var(--border-default)]'
            }`}
          />
          {errors.username ? (
            <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.username}</p>
          ) : (
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <Icon name="check" size={12} />
              <span>Tên đăng nhập chỉ chứa chữ cái, số, dấu gạch dưới, gạch ngang hoặc chấm.</span>
            </p>
          )}
        </div>

        {/* Password Fields */}
        <div className="space-y-3 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {isCreate ? 'Mật khẩu' : 'Mật khẩu mới (bỏ trống nếu không đổi)'}{' '}
                {isCreate && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#0070CE] hover:underline font-medium flex items-center gap-1"
              >
                <Icon name={showPassword ? 'eye-slash' : 'eye'} size={12} />
                <span>{showPassword ? 'Ẩn' : 'Hiện'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Ít nhất 6 ký tự"
              className={`w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] ${
                errors.password ? 'border-red-500' : 'border-[var(--border-default)]'
              }`}
            />
            {errors.password && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Xác nhận mật khẩu {isCreate && <span className="text-red-500">*</span>}
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Nhập lại mật khẩu"
              className={`w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070CE] ${
                errors.confirmPassword ? 'border-red-500' : 'border-[var(--border-default)]'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Status Switch */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
          <div>
            <p className="text-xs font-semibold text-slate-800">Trạng thái hoạt động</p>
            <p className="text-[11px] text-[var(--text-subtle)]">Cho phép học sinh đăng nhập vào hệ thống</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0070CE]"></div>
          </label>
        </div>
      </div>
    </SlideOver>
  );
};

export default StudentAccountModal;
