import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StatusTag, Icon, DropdownMenu, Avatar, IconButton } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  openRegisterModal,
  openEditModal,
  openDeleteModal,
} from '@/store/slices/faceRecognitionSlice';
import {
  filterStudentFaceRecords,
  formatRegistrationDate,
  formatPhotoDisplay,
} from '@/utils/faceRecognitionValidation';
import type { StudentFaceRecord } from '@/types/faceRecognition';

interface FaceRecognitionTableProps {
  onPreviewPhoto?: (photoUrl: string, studentName: string) => void;
}

export const FaceRecognitionTable: React.FC<FaceRecognitionTableProps> = ({
  onPreviewPhoto,
}) => {
  const router = useRouter();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const dispatch = useAppDispatch();
  const { records, filterState } = useAppSelector((state) => state.faceRecognition);

  const filteredRecords = filterStudentFaceRecords(records, filterState);

  // Pagination slice
  const pageSize = filterState.pageSize;
  const currentPage = filterState.page;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  return (
    <div className="ecomd-table-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="ecomd-table w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)] text-[var(--text-subtle)] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              <th className="py-3.5 px-4 w-28">Mã HS</th>
              <th className="py-3.5 px-4 min-w-[200px]">Họ và tên</th>
              <th className="py-3.5 px-4 w-28">Lớp</th>
              <th className="py-3.5 px-4 w-32 text-center">Ảnh nhận diện</th>
              <th className="py-3.5 px-4 w-32 text-center">Trạng thái</th>
              <th className="py-3.5 px-4 w-32 text-center">Ngày ghi nhận</th>
              <th className="py-3.5 px-4 w-20 text-center">Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-heading)]">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[var(--text-subtle)]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Icon name="inbox" size={32} color="var(--text-subtle)" />
                    <p className="text-sm font-medium">Không tìm thấy dữ liệu học sinh phù hợp</p>
                    <p className="text-xs text-[var(--text-subtle)]">
                      Thử thay đổi lớp học hoặc bộ lọc trạng thái nhận diện.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((item, idx) => {
                const globalIndex = startIndex + idx + 1;
                const photoDisplay = formatPhotoDisplay(item);
                const dateDisplay = formatRegistrationDate(item.registeredDate, item.isRegistered);

                const menuItems = !item.isRegistered
                  ? [
                      {
                        id: 'register',
                        label: 'Đăng ký ảnh nhận diện',
                        icon: 'camera' as const,
                        onClick: () => dispatch(openRegisterModal(item)),
                      },
                    ]
                  : [
                      {
                        id: 'edit',
                        label: 'Cập nhật ảnh khuôn mặt',
                        icon: 'pen' as const,
                        onClick: () => dispatch(openEditModal(item)),
                      },
                      {
                        id: 'preview',
                        label: 'Xem ảnh phóng to',
                        icon: 'eye' as const,
                        onClick: () => onPreviewPhoto?.(item.facePhotoUrl!, item.fullName),
                      },
                      {
                        id: 'delete',
                        label: 'Xóa ảnh khuôn mặt',
                        icon: 'trash' as const,
                        tone: 'danger' as const,
                        onClick: () => dispatch(openDeleteModal(item)),
                      },
                    ];

                return (
                  <tr
                    key={item.studentId}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    {/* STT */}
                    <td className="py-3.5 px-4 text-center text-[var(--text-subtle)] font-medium">
                      {globalIndex}
                    </td>

                    {/* Mã HS */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {item.studentCode}
                    </td>

                    {/* Họ và tên & Nickname */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.fullName} size="sm" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 group-hover:text-[#0070CE] transition-colors">
                            {item.fullName}
                          </span>
                          {item.nickname && (
                            <span className="text-[11px] text-[var(--text-subtle)] font-normal">
                              ({item.nickname})
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Lớp */}
                    <td className="py-3.5 px-4 font-medium">
                      <Link
                        href={`/${schoolCode}/school/classes/${item.classId}`}
                        className="text-[#0070CE] hover:underline inline-flex items-center gap-1 font-semibold"
                        title={`Xem chi tiết ${item.className}`}
                      >
                        {item.className}
                      </Link>
                    </td>

                    {/* Ảnh nhận diện */}
                    <td className="py-3.5 px-4 text-center">
                      {photoDisplay.isRegistered && item.facePhotoUrl ? (
                        <div className="inline-flex items-center justify-center">
                          <div
                            onClick={() =>
                              onPreviewPhoto?.(item.facePhotoUrl!, item.fullName)
                            }
                            className="relative group/photo cursor-pointer"
                            title="Nhấp để xem ảnh lớn"
                          >
                            <img
                              src={item.facePhotoUrl}
                              alt={`Ảnh nhận diện ${item.fullName}`}
                              className="w-9 h-9 object-cover rounded-lg border border-[var(--border-default)] shadow-xs group-hover/photo:ring-2 group-hover/photo:ring-[#0070CE] transition"
                            />
                            <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover/photo:opacity-100 flex items-center justify-center text-white text-xs transition">
                              <Icon name="eye" size={12} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs italic">Chưa có</span>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusTag tone={item.isRegistered ? 'success' : 'neutral'}>
                        {item.isRegistered ? 'Đã đăng ký' : 'Chưa đăng ký'}
                      </StatusTag>
                    </td>

                    {/* Ngày ghi nhận */}
                    <td className="py-3.5 px-4 text-center text-slate-600 font-mono text-[11px]">
                      {dateDisplay}
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
        <span>Tổng: <strong className="text-slate-800 font-bold">{filteredRecords.length}</strong> học sinh</span>
        <span className="text-[11px] text-slate-400">
          Dữ liệu nhận diện khuôn mặt đồng bộ tự động tới Camera AI cổng trường
        </span>
      </div>
    </div>
  );
};

export default FaceRecognitionTable;
