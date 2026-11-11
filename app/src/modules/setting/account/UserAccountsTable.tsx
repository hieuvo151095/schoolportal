import React from 'react';
import { StatusTag, Icon, DropdownMenu, Avatar, IconButton } from '@/components/ds';
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
  formatStaffFunctionLabel,
} from '../../../utils/accountValidation';

export const UserAccountsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, userFilters } = useAppSelector((state) => state.account);

  const filteredUsers = filterUserAccounts(users, userFilters);

  return (
    <div className="ecomd-table-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="ecomd-table w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)] text-[var(--text-subtle)] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              <th className="py-3.5 px-4">Họ và tên</th>
              <th className="py-3.5 px-4">Email / Tên đăng nhập</th>
              <th className="py-3.5 px-4">Số điện thoại</th>
              <th className="py-3.5 px-4">Vai trò</th>
              <th className="py-3.5 px-4 w-32 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 w-20 text-center">Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-heading)]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[var(--text-subtle)]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Icon name="inbox" size={32} color="var(--text-subtle)" />
                    <p className="text-sm font-medium">Không tìm thấy tài khoản người dùng phù hợp</p>
                    <p className="text-xs text-[var(--text-subtle)]">Thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => {
                const isAdmin = user.roles.includes('admin');

                const menuItems = isAdmin
                  ? [
                      {
                        id: 'view',
                        label: 'Xem chi tiết',
                        icon: 'eye' as const,
                        onClick: () => dispatch(openEditUserModal(user.id)),
                      },
                    ]
                  : [
                      {
                        id: 'edit',
                        label: 'Chỉnh sửa tài khoản',
                        icon: 'pen' as const,
                        onClick: () => dispatch(openEditUserModal(user.id)),
                      },
                      {
                        id: 'toggle',
                        label: user.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt lại',
                        icon: (user.status === 'active' ? 'circle-xmark' : 'check') as any,
                        onClick: () => dispatch(toggleUserStatus(user.id)),
                      },
                      {
                        id: 'delete',
                        label: 'Xóa tài khoản',
                        icon: 'trash' as const,
                        tone: 'danger' as const,
                        onClick: () => dispatch(openDeleteUserModal(user.id)),
                      },
                    ];

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    {/* STT */}
                    <td className="py-3.5 px-4 text-center text-[var(--text-subtle)] font-medium">
                      {idx + 1}
                    </td>

                    {/* Họ và tên & Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.fullName} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 group-hover:text-[#0070CE] transition-colors">
                              {user.fullName}
                            </span>
                            {user.isSyncedCsdlSo && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0070CE] border border-blue-200">
                                <Icon name="cloud" size={10} />
                                <span>CSDL Sở</span>
                              </span>
                            )}
                          </div>
                          {user.staffFunctions && user.staffFunctions.length > 0 && (
                            <p className="text-[11px] text-[var(--text-subtle)] mt-0.5">
                              {user.staffFunctions.map((f) => formatStaffFunctionLabel(f)).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email / Username */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--text-subtle)]">
                      <div>{user.email}</div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-[var(--text-subtle)]">
                      {user.phone || '—'}
                    </td>

                    {/* Vai trò */}
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

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusTag tone={user.status === 'active' ? 'success' : 'neutral'}>
                        {user.status === 'active' ? 'Hoạt động' : 'Ngừng HĐ'}
                      </StatusTag>
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4 text-center">
                      <DropdownMenu
                        align="right"
                        trigger={
                          <IconButton
                            icon="ellipsis-vertical"
                            label="Thao tác"
                            size="sm"
                          />
                        }
                        items={menuItems}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-[var(--bg-subtle)] px-4 py-3 border-t border-[var(--border-default)] flex items-center justify-between text-xs text-[var(--text-subtle)]">
        <span>Tổng: <strong className="text-slate-800 font-bold">{filteredUsers.length}</strong> người dùng</span>
        <span className="text-[11px] text-slate-400">
          Hiển thị danh sách tài khoản theo bộ lọc hiện tại
        </span>
      </div>
    </div>
  );
};

export default UserAccountsTable;
