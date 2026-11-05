import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTriangleExclamation,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closeModal,
  deleteFacePhoto,
} from '@/store/slices/faceRecognitionSlice';
import { getDeleteConfirmPrompt } from '@/utils/faceRecognitionValidation';

export const DeleteFaceConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeModal, selectedStudent } = useAppSelector(
    (state) => state.faceRecognition
  );

  if (activeModal !== 'delete' || !selectedStudent) {
    return null;
  }

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleDelete = () => {
    dispatch(
      deleteFacePhoto({
        studentId: selectedStudent.studentId,
      })
    );
    handleClose();
  };

  // BR06, K088: Explicit prompt articulating student's full name
  const confirmPrompt = getDeleteConfirmPrompt(selectedStudent.fullName);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Xác nhận xóa nhận diện
              </h3>
              <p className="text-xs text-gray-500">
                Thao tác này sẽ gỡ bỏ ảnh sinh trắc học đã lưu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-lg hover:bg-gray-100"
            title="Đóng"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 text-xs space-y-2">
            <p className="font-semibold text-red-900 text-sm">
              {confirmPrompt}
            </p>
            <p className="text-red-700 leading-relaxed">
              Sau khi xóa, học sinh sẽ chuyển về trạng thái <strong>Chưa đăng ký nhận diện</strong>. Thiết bị điểm danh khuôn mặt sẽ không thể nhận dạng học sinh này cho đến khi được đăng ký lại.
            </p>
          </div>

          {/* Student Summary Info */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Mã học sinh:</span>
              <span className="font-mono font-semibold text-gray-800">
                {selectedStudent.studentCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lớp học:</span>
              <span className="font-medium text-gray-800">
                {selectedStudent.className}
              </span>
            </div>
            {selectedStudent.registeredDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Ngày ghi nhận trước đó:</span>
                <span className="font-medium text-gray-700">
                  {selectedStudent.registeredDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
