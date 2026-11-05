import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faPlus,
  faEdit,
  faCloudArrowDown,
  faInbox,
  faCheckCircle,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              <th className="py-3.5 px-4 w-28">Mã HS</th>
              <th className="py-3.5 px-4">Họ và tên</th>
              <th className="py-3.5 px-4 w-28">Lớp</th>
              <th className="py-3.5 px-4">Tên tài khoản</th>
              <th className="py-3.5 px-4 w-32 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 w-24 text-center">Hành động</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FontAwesomeIcon icon={faInbox} className="text-3xl text-gray-300" />
                    <p className="text-sm font-medium">Không tìm thấy tài khoản học sinh phù hợp</p>
                    <p className="text-xs text-gray-400">Thử thay đổi lớp học hoặc bộ lọc trạng thái tài khoản.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((item, idx) => (
                <tr
                  key={item.studentId}
                  className="hover:bg-blue-50/20 transition-colors group"
                >
                  {/* STT */}
                  <td className="py-3.5 px-4 text-center text-gray-400 font-medium">
                    {idx + 1}
                  </td>

                  {/* Mã học sinh */}
                  <td className="py-3.5 px-4 font-mono font-medium text-gray-800">
                    {item.studentCode}
                  </td>

                  {/* Họ và tên & CSDL Sở */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {item.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.studentName}
                          </span>
                          {item.isSyncedCsdlSo && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <FontAwesomeIcon icon={faCloudArrowDown} className="text-[9px]" />
                              CSDL Sở
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {item.gender === 'nam' ? 'Nam' : 'Nữ'} • {item.birthDate}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Lớp */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium text-[11px]">
                      {item.className}
                    </span>
                  </td>

                  {/* Tên tài khoản */}
                  <td className="py-3.5 px-4">
                    {item.hasAccount && item.username ? (
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.username}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Chưa cấp tài khoản</span>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3.5 px-4 text-center">
                    {item.hasAccount ? (
                      item.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <FontAwesomeIcon icon={faCircleXmark} className="text-[10px]" />
                          Tạm khóa
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-gray-400">
                        Chưa kích hoạt
                      </span>
                    )}
                  </td>

                  {/* Hành động (BR19: + icon to create, BR20: pencil icon to edit) */}
                  <td className="py-3.5 px-4 text-center">
                    {!item.hasAccount ? (
                      <button
                        type="button"
                        onClick={() => dispatch(openCreateStudentModal(item.studentId))}
                        title="Cấp tài khoản học sinh mới"
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        <span>Cấp TK</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dispatch(openEditStudentModal(item.studentId))}
                        title="Chỉnh sửa tài khoản học sinh"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50/80 px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Tổng: <strong className="text-gray-800 font-bold">{filteredStudents.length}</strong> học sinh</span>
        <span className="text-[11px] text-gray-400">
          Danh sách tài khoản đăng nhập học sinh đồng bộ từ hồ sơ học sinh
        </span>
      </div>
    </div>
  );
};
