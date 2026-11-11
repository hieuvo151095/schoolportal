import React, { useState, useRef } from 'react';
import { SlideOver, Icon } from '@/components/ds';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closeModal,
  updateFacePhoto,
} from '@/store/slices/faceRecognitionSlice';
import { canSubmitEdit } from '@/utils/faceRecognitionValidation';

export const EditFaceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeModal, selectedStudent } = useAppSelector(
    (state) => state.faceRecognition
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  if (activeModal !== 'edit' || !selectedStudent) {
    return null;
  }

  const handleClose = () => {
    setNewPhotoPreview(null);
    setSelectedFileName('');
    dispatch(closeModal());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const hasNewFile = !!newPhotoPreview;
  const canSubmit = canSubmitEdit(hasNewFile);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSubmit || !newPhotoPreview) return;

    dispatch(
      updateFacePhoto({
        studentId: selectedStudent.studentId,
        facePhotoUrl: newPhotoPreview,
      })
    );
    handleClose();
  };

  return (
    <SlideOver
      open={activeModal === 'edit'}
      onClose={handleClose}
      title="Cập nhật ảnh nhận diện"
      description="Thay thế ảnh khuôn mặt sinh trắc học hiện tại"
      icon="pen"
      width={560}
      primaryAction={{
        label: 'Cập nhật ảnh',
        icon: 'check',
        disabled: !canSubmit,
        onClick: () => handleSubmit(),
      }}
      secondaryAction={{
        label: 'Hủy',
        onClick: handleClose,
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5 py-2">
        {/* Read-only Demographic Information */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Icon name="graduation-cap" size={14} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Thông tin học sinh
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
              {selectedStudent.studentCode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500 block text-[11px]">Họ và tên:</span>
              <span className="font-semibold text-gray-800">
                {selectedStudent.fullName}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Tên thường gọi:</span>
              <span className="text-gray-800 font-medium">
                {selectedStudent.nickname || '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Lớp học:</span>
              <span className="text-blue-700 font-semibold">
                {selectedStudent.className}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-[11px]">Ngày cập nhật gần nhất:</span>
              <span className="text-gray-800 font-medium">
                {selectedStudent.registeredDate || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Section: Current vs New Photo */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-700">
            So sánh ảnh nhận diện <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Current Registered Photo */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                Ảnh hiện tại
              </span>
              <img
                src={selectedStudent.facePhotoUrl || ''}
                alt="Ảnh hiện tại"
                className="w-24 h-24 object-cover rounded-xl border border-slate-300 shadow-2xs"
              />
              <span className="text-[10px] text-gray-500 mt-2 font-mono">
                {selectedStudent.registeredDate || 'Đang sử dụng'}
              </span>
            </div>

            {/* New Replacement Photo / Upload Target */}
            <div
              onClick={handleTriggerUpload}
              className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                newPhotoPreview
                  ? 'border-blue-300 bg-blue-50/20'
                  : 'border-blue-200 bg-blue-50/10 hover:bg-blue-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {newPhotoPreview ? (
                <>
                  <span className="text-[11px] font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                    Ảnh mới thay thế
                  </span>
                  <img
                    src={newPhotoPreview}
                    alt="Ảnh mới"
                    className="w-24 h-24 object-cover rounded-xl border-2 border-blue-500 shadow-md"
                  />
                  <span className="text-[10px] text-blue-600 underline mt-2 font-medium">
                    Chọn ảnh khác
                  </span>
                </>
              ) : (
                <div className="space-y-1.5 py-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-base">
                    <Icon name="cloud-arrow-up" size={18} />
                  </div>
                  <span className="text-xs font-bold text-blue-700 block">
                    Tải ảnh mới
                  </span>
                  <p className="text-[10px] text-gray-500">
                    Bắt buộc chọn ảnh mới để cập nhật
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Validation Notice Alert (BR04, K086) */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-800">
            <Icon name="circle-exclamation" size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý:</strong> Nút "Cập nhật ảnh" chỉ khả dụng sau khi bạn đã tải lên một tệp ảnh mới thay thế.
            </span>
          </div>
        </div>
      </form>
    </SlideOver>
  );
};

export default EditFaceModal;
