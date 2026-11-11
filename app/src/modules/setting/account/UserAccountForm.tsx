import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faShieldHalved,
  faTriangleExclamation,
  faChevronDown,
  faChevronUp,
  faKey,
  faEnvelope,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import {
  EcoDialog,
  EcoButton,
  EcoInput,
  EcoCheckbox,
  EcoRadio,
  EcoSwitch,
} from '../../../components/eco';
import { SlideOver } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeUserFormModal,
  createUserAccount,
  openConfirmUpdateModal,
  openChangeEmailModal,
} from '../../../store/slices/accountSlice';
import {
  UserRole,
  StaffFunction,
  StaffAdditionalInfo,
} from '../../../types/account';
import {
  validateCreateUserPayload,
  validateUpdateUserPayload,
  formatStaffFunctionLabel,
} from '../../../utils/accountValidation';
import { MOCK_AVAILABLE_CLASSES } from '../../../services/mockAccountData';

export const UserAccountForm: React.FC = () => {
  const router = useRouter();
  const { schoolCode } = router.query;
  const sCode = (schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const { isUserFormOpen, userFormMode, selectedUser } = useAppSelector(
    (state) => state.account
  );

  const isCreate = userFormMode === 'create';

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roles, setRoles] = useState<UserRole[]>(['giao_vien']);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // Staff specific
  const [staffCode, setStaffCode] = useState('');
  const [staffFunctions, setStaffFunctions] = useState<StaffFunction[]>([]);

  // Management specific
  const [managedClassIds, setManagedClassIds] = useState<string[]>([]);

  // Additional info accordion
  const [showAdditional, setShowAdditional] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<StaffAdditionalInfo>({});

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isUserFormOpen) {
      if (isCreate) {
        setFullName('');
        setEmail('');
        setPhone('');
        setRoles(['giao_vien']);
        setStatus('active');
        setStaffCode('');
        setStaffFunctions([]);
        setManagedClassIds([]);
        setAdditionalInfo({});
        setShowAdditional(false);
      } else if (selectedUser) {
        setFullName(selectedUser.fullName || '');
        setEmail(selectedUser.email || '');
        setPhone(selectedUser.phone || '');
        setRoles(selectedUser.roles || []);
        setStatus(selectedUser.status);
        setStaffCode(selectedUser.staffCode || '');
        setStaffFunctions(selectedUser.staffFunctions || []);
        setManagedClassIds(selectedUser.managedClassIds || []);
        setAdditionalInfo(selectedUser.additionalInfo || {});
        setShowAdditional(
          !!(
            selectedUser.additionalInfo?.cccd ||
            selectedUser.additionalInfo?.position ||
            selectedUser.additionalInfo?.startDate ||
            selectedUser.additionalInfo?.qualification
          )
        );
      }
      setErrors({});
    }
  }, [isUserFormOpen, isCreate, selectedUser]);

  if (!isUserFormOpen) return null;

  const isCsldSo = !isCreate && !!selectedUser?.isSyncedCsdlSo;

  const toggleRole = (role: UserRole) => {
    if (role === 'admin') return; // Cannot toggle admin

    setRoles((prev) => {
      const exists = prev.includes(role);
      let updated: UserRole[];
      if (exists) {
        updated = prev.filter((r) => r !== role);
      } else {
        updated = [...prev, role];
      }
      if (errors.roles) setErrors((e) => ({ ...e, roles: '' }));
      return updated;
    });
  };

  const toggleStaffFunction = (fn: StaffFunction) => {
    setStaffFunctions((prev) => {
      const exists = prev.includes(fn);
      let updated: StaffFunction[];
      if (exists) {
        updated = prev.filter((f) => f !== fn);
      } else {
        updated = [...prev, fn];
      }
      if (errors.staffFunctions) setErrors((e) => ({ ...e, staffFunctions: '' }));
      return updated;
    });
  };

  const toggleManagedClass = (classId: string) => {
    setManagedClassIds((prev) => {
      const exists = prev.includes(classId);
      if (exists) {
        return prev.filter((id) => id !== classId);
      } else {
        return [...prev, classId];
      }
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();

    if (isCreate) {
      const payload = {
        fullName,
        email,
        phone,
        roles,
        staffFunctions: roles.includes('nhan_vien') ? staffFunctions : undefined,
        staffCode: roles.includes('nhan_vien') ? staffCode : undefined,
        managedClassIds: roles.includes('quan_ly') ? managedClassIds : undefined,
        additionalInfo:
          roles.includes('nhan_vien') || roles.includes('giao_vien')
            ? additionalInfo
            : undefined,
      };

      const validation = validateCreateUserPayload(payload);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      dispatch(createUserAccount(payload));
    } else if (selectedUser) {
      const payload = {
        id: selectedUser.id,
        fullName,
        phone,
        status,
        roles,
        staffFunctions: roles.includes('nhan_vien') ? staffFunctions : undefined,
        staffCode: roles.includes('nhan_vien') ? staffCode : undefined,
        managedClassIds: roles.includes('quan_ly') ? managedClassIds : undefined,
        additionalInfo:
          roles.includes('nhan_vien') || roles.includes('giao_vien')
            ? additionalInfo
            : undefined,
      };

      const validation = validateUpdateUserPayload(payload, selectedUser);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // BR07, K079: Intercept and trigger affirmative modal TK-05
      dispatch(openConfirmUpdateModal(payload));
    }
  };

  const hasStaffRole = roles.includes('nhan_vien');
  const hasManagerRole = roles.includes('quan_ly');
  const hasStaffOrTeacherRole = roles.includes('nhan_vien') || roles.includes('giao_vien');

  return (
    <SlideOver
      open={isUserFormOpen}
      onClose={() => dispatch(closeUserFormModal())}
      title={isCreate ? 'Thêm người dùng mới' : 'Chỉnh sửa tài khoản người dùng'}
      description="Cấu hình thông tin tài khoản, phân quyền và chức năng công tác"
      icon={isCreate ? 'user-plus' : 'user'}
      width={720}
      primaryAction={{
        label: isCreate ? 'Tạo người dùng' : 'Cập nhật',
        icon: 'check',
        onClick: () => {
          const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
          handleSubmit(fakeEvent);
        },
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: () => dispatch(closeUserFormModal()),
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        {/* CSDL Sở Warning Banner (BR05) */}
        {isCsldSo && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600 text-sm mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Tài khoản đồng bộ từ CSDL ngành (CSDL Sở GD&ĐT)</p>
              <p className="text-amber-800 mt-0.5">
                Các thông tin định danh (Họ và tên) được quản lý tập trung và không thể chỉnh sửa tại trường học.
              </p>
            </div>
          </div>
        )}

        {/* Roles Multi-Select (BR02, BR04, K077) */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Vai trò người dùng <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Một người dùng có thể đảm nhận nhiều vai trò cùng lúc (ví dụ: Giáo viên kiêm Phụ huynh).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Admin Role Checkbox (Permanently Locked on Create) */}
            <div
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-colors ${
                roles.includes('admin')
                  ? 'bg-red-50 border-red-200 text-red-900 font-semibold'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <input
                type="checkbox"
                checked={roles.includes('admin')}
                disabled={true}
                className="w-4 h-4 text-red-600 rounded border-gray-300 cursor-not-allowed"
                readOnly
              />
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-red-600 text-xs" />
                  Quản trị viên
                </span>
                <span className="text-[10px] text-gray-500 font-normal">
                  {isCreate ? 'Bị khóa khi tạo' : 'Quyền cấp cao'}
                </span>
              </div>
            </div>

            {/* Quản lý Role Checkbox */}
            <label className="flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer hover:bg-purple-50/50 transition-colors border-gray-200">
              <input
                type="checkbox"
                checked={roles.includes('quan_ly')}
                onChange={() => toggleRole('quan_ly')}
                className="w-4 h-4 text-purple-600 rounded border-gray-300"
              />
              <span className="font-medium text-gray-800">Quản lý</span>
            </label>

            {/* Giáo viên Role Checkbox */}
            <label className="flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer hover:bg-blue-50/50 transition-colors border-gray-200">
              <input
                type="checkbox"
                checked={roles.includes('giao_vien')}
                onChange={() => toggleRole('giao_vien')}
                className="w-4 h-4 text-blue-600 rounded border-gray-300"
              />
              <span className="font-medium text-gray-800">Giáo viên</span>
            </label>

            {/* Nhân viên Role Checkbox */}
            <label className="flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer hover:bg-amber-50/50 transition-colors border-gray-200">
              <input
                type="checkbox"
                checked={roles.includes('nhan_vien')}
                onChange={() => toggleRole('nhan_vien')}
                className="w-4 h-4 text-amber-600 rounded border-gray-300"
              />
              <span className="font-medium text-gray-800">Nhân viên</span>
            </label>

            {/* Phụ huynh Role Checkbox */}
            <label className="flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer hover:bg-emerald-50/50 transition-colors border-gray-200">
              <input
                type="checkbox"
                checked={roles.includes('phu_huynh')}
                onChange={() => toggleRole('phu_huynh')}
                className="w-4 h-4 text-emerald-600 rounded border-gray-300"
              />
              <span className="font-medium text-gray-800">Phụ huynh</span>
            </label>
          </div>

          {errors.roles && (
            <p className="text-xs text-red-600 mt-2 font-medium">{errors.roles}</p>
          )}
        </div>

        {/* Dynamic Staff Functions (BR10, K081, TK-02) */}
        {hasStaffRole && (
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">
                  Chức năng nhân viên <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-amber-800 mt-0.5">
                  Chọn các quyền nghiệp vụ chuyên trách cho nhân viên trường học.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['diem_danh', 'ke_toan', 'thong_bao', 'cham_soc_y_te'] as StaffFunction[]).map((fn) => (
                <label
                  key={fn}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    staffFunctions.includes(fn)
                      ? 'bg-amber-100/70 border-amber-300 text-amber-950 font-semibold'
                      : 'bg-white border-amber-200 text-gray-700 hover:bg-white/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={staffFunctions.includes(fn)}
                    onChange={() => toggleStaffFunction(fn)}
                    className="w-4 h-4 text-amber-600 rounded border-gray-300"
                  />
                  <span>{formatStaffFunctionLabel(fn)}</span>
                </label>
              ))}
            </div>

            {errors.staffFunctions && (
              <p className="text-xs text-red-600 font-medium">{errors.staffFunctions}</p>
            )}

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mã nhân viên (Staff Code)
              </label>
              <EcoInput
                type="text"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
                placeholder="vd: NV-2026-003"
              />
            </div>
          </div>
        )}

        {/* Dynamic Management Classes (BR12) */}
        {hasManagerRole && (
          <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200/80 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-900">
              Lớp phụ trách quản lý
            </label>
            <p className="text-xs text-purple-800">
              Chọn các lớp học thuộc thẩm quyền giám sát của cán bộ quản lý.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOCK_AVAILABLE_CLASSES.map((cls) => (
                <label
                  key={cls.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    managedClassIds.includes(cls.id)
                      ? 'bg-purple-100/70 border-purple-300 text-purple-950 font-semibold'
                      : 'bg-white border-purple-200 text-gray-700 hover:bg-white/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={managedClassIds.includes(cls.id)}
                    onChange={() => toggleManagedClass(cls.id)}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300"
                  />
                  <span>{cls.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information Section */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-100 pb-1.5">
            Thông tin định danh cơ bản
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <EcoInput
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                disabled={isCsldSo}
                placeholder="vd: Nguyễn Văn An"
                error={errors.fullName || undefined}
              />
              {isCsldSo && (
                <p className="text-[11px] text-gray-500 mt-1 italic">
                  * Tên người dùng được khóa bảo vệ bởi CSDL Sở.
                </p>
              )}
            </div>

            {/* Email (Read-Only with modal jump in Edit mode - BR08, K080) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email / Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              {isCreate ? (
                <EcoInput
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="vd: an.nguyen@ecoschool.edu.vn"
                  error={errors.email || undefined}
                />
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={email}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-600 border border-gray-200 rounded-lg cursor-not-allowed select-none"
                  />
                  <EcoButton
                    type="button"
                    variant="outline"
                    onClick={() => dispatch(openChangeEmailModal(selectedUser!.id))}
                  >
                    Thay đổi
                  </EcoButton>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Số điện thoại
              </label>
              <EcoInput
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="vd: 0901234567"
              />
            </div>

            {/* Status (Edit mode) */}
            {!isCreate && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Trạng thái tài khoản
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <EcoSwitch
                    checked={status === 'active'}
                    disabled={isCsldSo}
                    onChange={(val) => setStatus(val ? 'active' : 'inactive')}
                  />
                  <span className="text-xs font-medium text-gray-700">
                    {status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible Additional Info (BR13, K081) */}
        {hasStaffOrTeacherRole && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdditional(!showAdditional)}
              className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>Thông tin bổ sung (CCCD, Chức vụ, Bằng cấp, Kỹ năng)</span>
              <FontAwesomeIcon icon={showAdditional ? faChevronUp : faChevronDown} className="text-gray-400" />
            </button>

            {showAdditional && (
              <div className="p-4 space-y-3 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số CCCD / CMND
                  </label>
                  <EcoInput
                    type="text"
                    value={additionalInfo.cccd || ''}
                    onChange={(e) =>
                      setAdditionalInfo((prev) => ({ ...prev, cccd: e.target.value }))
                    }
                    placeholder="12 chữ số"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Chức vụ
                  </label>
                  <EcoInput
                    type="text"
                    value={additionalInfo.position || ''}
                    onChange={(e) =>
                      setAdditionalInfo((prev) => ({ ...prev, position: e.target.value }))
                    }
                    placeholder="vd: Giáo viên Tiếng Anh"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Ngày vào làm
                  </label>
                  <EcoInput
                    type="date"
                    value={additionalInfo.startDate || ''}
                    onChange={(e) =>
                      setAdditionalInfo((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bằng cấp / Trình độ
                  </label>
                  <EcoInput
                    type="text"
                    value={additionalInfo.qualification || ''}
                    onChange={(e) =>
                      setAdditionalInfo((prev) => ({ ...prev, qualification: e.target.value }))
                    }
                    placeholder="vd: Thạc sĩ Sư phạm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bộ phận / Tổ chuyên môn
                  </label>
                  <EcoInput
                    type="text"
                    value={additionalInfo.department || ''}
                    onChange={(e) =>
                      setAdditionalInfo((prev) => ({ ...prev, department: e.target.value }))
                    }
                    placeholder="vd: Tổ Ngoại Ngữ & Tin Học"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security Decoupled Jump Section (BR09, K080) */}
        {!isCreate && selectedUser && (
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <FontAwesomeIcon icon={faKey} className="text-sm" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">BẢO MẬT & MẬT KHẨU</p>
                <p className="text-[11px] text-gray-500">
                  Đặt lại mật khẩu đăng nhập trên trang bảo mật chuyên biệt
                </p>
              </div>
            </div>
            <Link href={`/${sCode}/setting/users/${selectedUser.id}/password`}>
              <EcoButton type="button" variant="outline" size="sm">
                Đổi mật khẩu
              </EcoButton>
            </Link>
          </div>
        )}
      </form>
    </SlideOver>
  );
};
