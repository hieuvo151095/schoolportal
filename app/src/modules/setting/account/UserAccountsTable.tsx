import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faTrash,
  faUser,
  faShieldHalved,
  faGraduationCap,
  faCloudArrowDown,
  faInbox,
} from '@fortawesome/free-solid-svg-icons';
import { EcoSwitch, EcoIconButton } from '../../../components/eco';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  openEditUserModal,
  openDeleteUserModal,
  toggleUserStatus,
} from '../../../store/slices/accountSlice';
import {
  filterUserAccounts,
  formatRoleLabel,
  getRoleBadgeStyle,
} from '../../../utils/accountValidation';
import { UserRole } from '../../../types/account';

export const UserAccountsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, userFilters } = useAppSelector((state) => state.account);

  const filteredUsers = filterUserAccounts(users, userFilters);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              <th className="py-3.5 px-4">Họ và tên</th>
              <th className="py-3.5 px-4">Email / Tên đăng nhập</th>
              <th className="py-3.5 px-4">Số điện thoại</th>
              <th className="py-3.5 px-4">Vai trò</th>
              <th className="py-3.5 px-4 w-28 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 w-24 text-center">Hành động</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FontAwesomeIcon icon={faInbox} className="text-3xl text-gray-300" />
                    <p className="text-sm font-medium">Không tìm thấy tài khoản người dùng phù hợp</p>
                    <p className="text-xs text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => {
                const isAdmin = user.roles.includes('admin');

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    {/* STT */}
                    <td className="py-3.5 px-4 text-center text-gray-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* Họ và tên & Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {user.fullName}
                            </span>
                            {/* CSDL Sở Badge (BR05) */}
                            {user.isSyncedCsdlSo && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                <FontAwesomeIcon icon={faCloudArrowDown} className="text-[9px]" />
                                CSDL Sở
                              </span>
                            )}
                          </div>

                          {/* Linked Students for Parent Role (BR16) */}
                          {user.roles.includes('phu_huynh') && user.linkedStudents && user.linkedStudents.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 mt-1">
                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-[9px]" />
                                PH em:
                              </span>
                              {user.linkedStudents.map((std) => (
                                <span
                                  key={std.studentId}
                                  className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-100"
                                >
                                  {std.studentName} ({std.className})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-600">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-gray-600">
                      {user.phone || '—'}
                    </td>

                    {/* Vai trò (Multi-Role Badge Pills - BR02) */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => {
                          const style = getRoleBadgeStyle(role);
                          return (
                            <span
                              key={role}
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}
                            >
                              {formatRoleLabel(role)}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Trạng thái (Toggle Switch - BR06, K078, K079) */}
                    <td className="py-3.5 px-4 text-center">
                      <EcoSwitch
                        checked={user.status === 'active'}
                        onChange={() => dispatch(toggleUserStatus(user.id))}
                      />
                    </td>

                    {/* Hành động (BR03, K077: Admin has only View eye) */}
                    <td className="py-3.5 px-4 text-center">
                      {isAdmin ? (
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => dispatch(openEditUserModal(user.id))}
                            title="Xem chi tiết (Quản trị viên được bảo vệ)"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-sm" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => dispatch(openEditUserModal(user.id))}
                            title="Chỉnh sửa tài khoản"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faEdit} className="text-sm" />
                          </button>
                          <button
                            type="button"
                            onClick={() => dispatch(openDeleteUserModal(user.id))}
                            title="Xóa tài khoản"
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FontAwesomeIcon icon={faTrash} className="text-sm" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50/80 px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Tổng: <strong className="text-gray-800 font-bold">{filteredUsers.length}</strong> người dùng</span>
        <span className="text-[11px] text-gray-400">
          Hiển thị danh sách tài khoản theo bộ lọc hiện tại
        </span>
      </div>
    </div>
  );
};
