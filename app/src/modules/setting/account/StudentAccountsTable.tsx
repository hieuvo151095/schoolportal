import React from 'react';
import { StatusTag, Icon, DropdownMenu, Avatar, IconButton } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  openCreateStudentModal,
  openEditStudentModal,
} from '../../../store/slices/accountSlice';
import { filterStudentAccounts } from '../../../utils/accountValidation';

export const StudentAccountsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { studentAccounts, studentFilters } = useAppSelector((state) => state.account);

  const filteredStudents = filterStudentAccounts(studentAccounts, studentFilters);

  return (
    <div className="ecomd-table-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="ecomd-table w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)] text-[var(--text-subtle)] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              <th className="py-3.5 px-4 w-28">Mã HS</th>
              <th className="py-3.5 px-4">Họ và tên</th>
              <th className="py-3.5 px-4 w-28">Lớp</th>
              <th className="py-3.5 px-4">Tên tài khoản</th>
              <th className="py-3.5 px-4 w-32 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 w-20 text-center">Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-heading)]">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[var(--text-subtle)]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Icon name="inbox" size={32} color="var(--text-subtle)" />
                    <p className="text-sm font-medium">Không tìm thấy tài khoản học sinh phù hợp</p>
                    <p className="text-xs text-[var(--text-subtle)]">Thử thay đổi lớp học hoặc bộ lọc trạng thái tài khoản.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((item, idx) => {
                const menuItems = !item.hasAccount
                  ? [
                      {
                        id: 'create',
                        label: 'Cấp tài khoản mới',
                        icon: 'plus' as const,
                        onClick: () => dispatch(openCreateStudentModal(item.studentId)),
                      },
                    ]
                  : [
                      {
                        id: 'edit',
                        label: 'Chỉnh sửa tài khoản',
                        icon: 'pen' as const,
                        onClick: () => dispatch(openEditStudentModal(item.studentId)),
                      },
                    ];

                return (
                  <tr
                    key={item.studentId}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    {/* STT */}
                    <td className="py-3.5 px-4 text-center text-[var(--text-subtle)] font-medium">
                      {idx + 1}
                    </td>

                    {/* Mã học sinh */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {item.studentCode}
                    </td>

                    {/* Họ và tên & CSDL Sở */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={item.studentName} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 group-hover:text-[#0070CE] transition-colors">
                              {item.studentName}
                            </span>
                            {item.isSyncedCsdlSo && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0070CE] border border-blue-200">
                                <Icon name="cloud" size={10} />
                                <span>CSDL Sở</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Lớp */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {item.className}
                    </td>

                    {/* Tên tài khoản */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {item.username ? (
                        <span className="text-slate-800 font-semibold">{item.username}</span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa cấp</span>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4 text-center">
                      {item.hasAccount ? (
                        item.status === 'active' ? (
                          <StatusTag tone="success">Đang hoạt động</StatusTag>
                        ) : (
                          <StatusTag tone="warning">Tạm khóa</StatusTag>
                        )
                      ) : (
                        <StatusTag tone="neutral">Chưa kích hoạt</StatusTag>
                      )}
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
        <span>Tổng: <strong className="text-slate-800 font-bold">{filteredStudents.length}</strong> học sinh</span>
        <span className="text-[11px] text-slate-400">
          Danh sách tài khoản học sinh phục vụ tra cứu điểm và nộp bài
        </span>
      </div>
    </div>
  );
};

export default StudentAccountsTable;
