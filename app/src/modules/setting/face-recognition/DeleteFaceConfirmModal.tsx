import React from 'react';
import { SlideOver, Icon } from '@/components/ds';
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

  const confirmPrompt = getDeleteConfirmPrompt(selectedStudent.fullName);

  return (
    <SlideOver
      open={activeModal === 'delete'}
      onClose={handleClose}
      title="Xác nhận xóa nhận diện"
      description="Thao tác này sẽ gỡ bỏ ảnh sinh trắc học đã lưu"
      icon="trash"
      width={460}
      primaryAction={{
        label: 'Xác nhận xóa',
        icon: 'trash',
        tone: 'danger',
        onClick: handleDelete,
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: handleClose,
      }}
    >
      <div className="space-y-4 py-2">
        {/* Warning Notification Banner */}
        <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-xl flex items-start gap-3">
          <Icon name="triangle-exclamation" size={16} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-900 leading-relaxed font-medium">
            {confirmPrompt}
          </p>
        </div>

        {/* Target Student Preview */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
          <img
            src={selectedStudent.facePhotoUrl || ''}
            alt={selectedStudent.fullName}
            className="w-12 h-12 rounded-full object-cover border border-slate-300"
          />
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              {selectedStudent.fullName}
            </h4>
            <p className="text-[11px] text-slate-500">
              Lớp: {selectedStudent.className} • Mã: {selectedStudent.studentCode}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          Sau khi xóa, học sinh sẽ không thể nhận diện tự động bằng AI khi điểm danh hoặc gắn thẻ hình ảnh.
        </p>
      </div>
    </SlideOver>
  );
};

export default DeleteFaceConfirmModal;
