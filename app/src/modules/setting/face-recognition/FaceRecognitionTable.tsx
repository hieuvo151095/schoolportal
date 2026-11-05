import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPen,
  faTimes,
  faInbox,
  faCamera,
  faUserGraduate,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">STT</th>
              <th className="py-3.5 px-4 w-28">Mã HS</th>
              <th className="py-3.5 px-4 min-w-[200px]">Họ và tên</th>
              <th className="py-3.5 px-4 w-28">Lớp</th>
              <th className="py-3.5 px-4 w-32 text-center">Ảnh nhận diện</th>
              <th className="py-3.5 px-4 w-32 text-center">Ngày ghi nhận</th>
              <th className="py-3.5 px-4 w-28 text-center">Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FontAwesomeIcon icon={faInbox} className="text-3xl text-gray-300" />
                    <p className="text-sm font-medium">Không tìm thấy dữ liệu học sinh phù hợp</p>
                    <p className="text-xs text-gray-400">
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

                return (
                  <tr
                    key={item.studentId}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    {/* STT */}
                    <td className="py-3.5 px-4 text-center text-gray-400 font-medium">
                      {globalIndex}
                    </td>

                    {/* Mã HS */}
                    <td className="py-3.5 px-4 font-mono font-medium text-gray-800">
                      {item.studentCode}
                    </td>

                    {/* Họ và tên & Nickname */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-500 font-semibold text-xs overflow-hidden">
                          {item.facePhotoUrl ? (
                            <img
                              src={item.facePhotoUrl}
                              alt={item.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FontAwesomeIcon icon={faUserGraduate} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.fullName}
                          </span>
                          {item.nickname && (
                            <span className="text-[11px] text-gray-500 font-normal">
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
                        className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
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
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs group-hover/photo:ring-2 group-hover/photo:ring-blue-400 transition"
                            />
                            <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover/photo:opacity-100 flex items-center justify-center text-white text-xs transition">
                              <FontAwesomeIcon icon={faEye} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-mono text-sm">-</span>
                      )}
                    </td>

                    {/* Ngày ghi nhận */}
                    <td className="py-3.5 px-4 text-center">
                      {item.isRegistered ? (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {dateDisplay}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-mono text-sm">-</span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {!item.isRegistered ? (
                          /* Unregistered: Single circular + button (BR02, K087) */
                          <button
                            type="button"
                            onClick={() => dispatch(openRegisterModal(item))}
                            className="w-8 h-8 rounded-full bg-[#0070CE] hover:bg-[#005bb5] text-white flex items-center justify-center transition shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title="Đăng ký ảnh nhận diện"
                            aria-label="Đăng ký ảnh nhận diện"
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                          </button>
                        ) : (
                          /* Registered: Two circular buttons (pencil + X) (BR02, K087) */
                          <>
                            <button
                              type="button"
                              onClick={() => dispatch(openEditModal(item))}
                              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
                              title="Chỉnh sửa ảnh nhận diện"
                              aria-label="Chỉnh sửa ảnh nhận diện"
                            >
                              <FontAwesomeIcon icon={faPen} className="text-xs" />
                            </button>
                            <button
                              type="button"
                              onClick={() => dispatch(openDeleteModal(item))}
                              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition shadow-xs focus:outline-none focus:ring-2 focus:ring-red-300"
                              title="Xóa ảnh nhận diện"
                              aria-label="Xóa ảnh nhận diện"
                            >
                              <FontAwesomeIcon icon={faTimes} className="text-xs" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
