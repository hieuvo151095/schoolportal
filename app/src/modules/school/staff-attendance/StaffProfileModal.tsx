import React from 'react';
import Link from 'next/link';
import { Icon, SlideOver } from '../../../components/ds';
import { StaffProfile } from '../../../types/staffAttendance';
import {
  formatMissingField,
  getRoleBadgeConfig,
} from '../../../utils/staffAttendanceValidation';

interface StaffProfileModalProps {
  isOpen: boolean;
  staff: StaffProfile | null;
  schoolCode: string;
  onClose: () => void;
}

export const StaffProfileModal: React.FC<StaffProfileModalProps> = ({
  isOpen,
  staff,
  schoolCode,
  onClose,
}) => {
  if (!isOpen || !staff) return null;

  const isAdmin = staff.roles.includes('admin');
  const modalTitle = isAdmin ? 'Thông tin Quản Trị' : 'Thông tin người dùng';

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={modalTitle}
      description={`Hồ sơ cán bộ nhân viên • ${staff.nickname}`}
      icon="id-badge"
      width={520}
      primaryAction={{
        label: 'Đóng',
        onClick: onClose,
      }}
    >
      <div data-testid="staff-profile-modal" className="space-y-4">
        {/* Profile Card Summary */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 rounded-2xl border border-blue-100/60">
          {staff.avatar ? (
            <img
              src={staff.avatar}
              alt={staff.nickname}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
              {staff.nickname.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-lg">{staff.nickname}</span>
              {staff.isVerified && (
                <span
                  data-testid="badge-verified"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-full font-medium"
                >
                  <Icon name="circle-check" className="w-3.5 h-3.5 text-blue-600" />
                  Đã xác thực
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate mt-0.5">{staff.name}</p>
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {staff.roles.map((r) => {
                const config = getRoleBadgeConfig(r);
                return (
                  <span
                    key={r}
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md border ${config.bg} ${config.text} ${config.border}`}
                  >
                    {config.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-3.5 text-sm">
          {/* Mã NV */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 flex items-center gap-2">
              <Icon name="id-badge" className="w-4 h-4 text-gray-400" />
              Mã nhân viên:
            </span>
            <span
              data-testid="profile-staff-code"
              className={`font-medium ${staff.code ? 'text-gray-900 font-mono' : 'text-gray-400 italic'}`}
            >
              {formatMissingField(staff.code, 'mã NV')}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 flex items-center gap-2">
              <Icon name="envelope" className="w-4 h-4 text-gray-400" />
              Email:
            </span>
            <span
              data-testid="profile-staff-email"
              className={`font-medium ${staff.email ? 'text-gray-900' : 'text-gray-400 italic'}`}
            >
              {formatMissingField(staff.email, 'email')}
            </span>
          </div>

          {/* Điện thoại */}
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500 flex items-center gap-2">
              <Icon name="phone" className="w-4 h-4 text-gray-400" />
              Số điện thoại:
            </span>
            <span
              data-testid="profile-staff-phone"
              className={`font-medium ${staff.phone ? 'text-gray-900 font-mono' : 'text-gray-400 italic'}`}
            >
              {formatMissingField(staff.phone, 'số điện thoại')}
            </span>
          </div>

          {/* DoB (for non-admin or all) */}
          {!isAdmin && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2">
                <Icon name="calendar" className="w-4 h-4 text-gray-400" />
                Ngày sinh:
              </span>
              <span
                data-testid="profile-staff-dob"
                className={`font-medium ${staff.dob ? 'text-gray-900' : 'text-gray-400 italic'}`}
              >
                {formatMissingField(staff.dob, 'ngày sinh')}
              </span>
            </div>
          )}

          {/* Address */}
          {!isAdmin && (
            <div className="flex items-start justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 flex items-center gap-2 shrink-0">
                <Icon name="location-dot" className="w-4 h-4 text-gray-400" />
                Địa chỉ:
              </span>
              <span
                data-testid="profile-staff-address"
                className={`text-right font-medium max-w-[260px] ${
                  staff.address ? 'text-gray-900' : 'text-gray-400 italic'
                }`}
              >
                {formatMissingField(staff.address, 'địa chỉ')}
              </span>
            </div>
          )}

          {/* Assigned Classes (BR09, BR11) */}
          {!isAdmin && (
            <div className="py-2">
              <span className="text-gray-500 flex items-center gap-2 mb-2">
                <Icon name="graduation-cap" className="w-4 h-4 text-gray-400" />
                Lớp phụ trách:
              </span>
              {staff.assignedClasses && staff.assignedClasses.length > 0 ? (
                <div data-testid="profile-assigned-classes" className="flex flex-wrap gap-2">
                  {staff.assignedClasses.map((cls) => (
                    <Link
                      key={cls.classId}
                      href={`/${schoolCode}/school/staff-attendance?classId=${cls.classId}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200 transition-colors"
                    >
                      <span>{cls.className}</span>
                      {cls.isHomeroom && (
                        <span className="text-[10px] bg-blue-600 text-white px-1 rounded font-normal">
                          Chủ nhiệm
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic">Chưa có lớp phụ trách</span>
              )}
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};
