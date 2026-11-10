import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faTriangleExclamation,
  faEye,
  faEyeSlash,
  faArrowLeft,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { PortalLayout } from '../../../../../components/layout/PortalLayout';
import { EcoButton, EcoInput } from '../../../../../components/eco';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { changeUserPassword } from '../../../../../store/slices/accountSlice';
import { validatePasswordPayload } from '../../../../../utils/accountValidation';

export default function UserChangePasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { schoolCode, id } = router.query;
  const sCode = (schoolCode as string) || 'demo';
  const userId = id as string;

  const { users } = useAppSelector((state) => state.account);
  const targetUser = users.find((u) => u.id === userId);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    const validation = validatePasswordPayload(newPassword, confirmPassword);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    dispatch(
      changeUserPassword({
        userId: targetUser.id,
        newPassword,
      })
    );

    router.push(`/${sCode}/setting/users`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Đặt lại mật khẩu - {targetUser?.fullName || 'Người dùng'} | Eco School</title>
      </Head>

      <div className="space-y-6 pb-12">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${sCode}/setting/users`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Quay lại danh sách tài khoản</span>
          </Link>
          <span className="text-xs text-gray-400">Bảo mật tài khoản</span>
        </div>

        {/* Password Reset Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FontAwesomeIcon icon={faKey} className="text-lg" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                BẢO MẬT: Đặt lại mật khẩu đăng nhập
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Cập nhật thông tin xác thực cho tài khoản người dùng
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Target User Info */}
            {targetUser && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Tài khoản mục tiêu</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{targetUser.fullName}</p>
                  <p className="text-xs font-mono text-gray-600">{targetUser.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {targetUser.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Decree 13 Advisory Banner (BR09, K080) */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-amber-600 text-base mt-0.5 shrink-0"
              />
              <div className="text-xs space-y-1">
                <p className="font-bold uppercase tracking-wider text-amber-800">
                  Cảnh báo an toàn dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP)
                </p>
                <p className="text-amber-800 leading-relaxed">
                  Đổi mật khẩu sẽ <strong>tự động thu hồi và đăng xuất tất cả các phiên làm việc đang hoạt động</strong> của người dùng này trên mọi thiết bị (web và ứng dụng di động).
                </p>
              </div>
            </div>

            {/* Password Inputs */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Mật khẩu mới <span className="text-red-500">*</span>
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
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
                  }}
                  placeholder="Ít nhất 6 ký tự"
                  error={errors.newPassword || undefined}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <EcoInput
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Nhập lại mật khẩu mới"
                  error={errors.confirmPassword || undefined}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Link href={`/${sCode}/setting/users`}>
                <EcoButton variant="secondary" type="button">
                  Hủy bỏ
                </EcoButton>
              </Link>
              <EcoButton variant="primary" type="submit">
                Lưu mật khẩu
              </EcoButton>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
