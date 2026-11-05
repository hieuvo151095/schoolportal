import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faEye,
  faEyeSlash,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { EcoDialog, EcoInput, EcoSwitch } from '../../../components/eco';
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
    <EcoDialog
      open={isStudentModalOpen}
      onClose={() => dispatch(closeStudentModal())}
      onCancel={() => dispatch(closeStudentModal())}
      onConfirm={handleSubmit}
      confirmLabel="Lưu tài khoản"
      cancelLabel="Hủy bỏ"
      title={isCreate ? 'Cấp tài khoản học sinh' : 'Chỉnh sửa tài khoản học sinh'}
      maxWidth="500px"
    >
      <div className="space-y-4 py-2">
        {/* Student Context Card */}
        <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs text-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FontAwesomeIcon icon={faUserGraduate} className="text-base" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{selectedStudent.studentName}</p>
              <p className="text-gray-500">Mã HS: {selectedStudent.studentCode} • Lớp: {selectedStudent.className}</p>
            </div>
          </div>
          {selectedStudent.isSyncedCsdlSo && (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
              CSDL Sở
            </span>
          )}
        </div>

        {/* Username Field */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tên tài khoản <span className="text-red-500">*</span>
          </label>
          <EcoInput
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: '' }));
            }}
            placeholder="vd: an.nguyen2018"
            error={errors.username || undefined}
          />
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
            Tên đăng nhập chỉ chứa chữ cái, số, dấu gạch dưới, gạch ngang hoặc chấm.
          </p>
        </div>

        {/* Password Fields */}
        <div className="space-y-3 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-gray-700">
                {isCreate ? 'Mật khẩu' : 'Mật khẩu mới (bỏ trống nếu không đổi)'}{' '}
                {isCreate && <span className="text-red-500">*</span>}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                <span>{showPassword ? 'Ẩn' : 'Hiện'}</span>
              </button>
            </div>
            <EcoInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Ít nhất 6 ký tự"
              error={errors.password || undefined}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Xác nhận mật khẩu {isCreate && <span className="text-red-500">*</span>}
            </label>
            <EcoInput
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Nhập lại mật khẩu"
              error={errors.confirmPassword || undefined}
            />
          </div>
        </div>

        {/* Status Switch */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-800">Trạng thái hoạt động</p>
            <p className="text-[11px] text-gray-500">Cho phép học sinh đăng nhập vào hệ thống</p>
          </div>
          <EcoSwitch checked={isActive} onChange={(val) => setIsActive(val)} />
        </div>
      </div>
    </EcoDialog>
  );
};
