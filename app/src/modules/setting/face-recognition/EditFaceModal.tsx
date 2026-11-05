import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCloudArrowUp,
  faPen,
  faUserGraduate,
  faCheckCircle,
  faCircleExclamation,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
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

  // BR04, BR05, K086: Displaying existing photo is explicitly insufficient to enable saving.
  // Administrator MUST select a new replacement file.
  const hasNewFile = !!newPhotoPreview;
  const canSubmit = canSubmitEdit(hasNewFile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <FontAwesomeIcon icon={faPen} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Chỉnh sửa ảnh nhận diện
              </h3>
              <p className="text-xs text-gray-500">
                Cập nhật ảnh khuôn mặt mới thay thế cho học sinh
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Read-only Demographic Info (BR03, K085) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserGraduate} className="text-slate-400 text-xs" />
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
                <span className="text-gray-500 block text-[11px]">Giới tính:</span>
                <span className="text-gray-800 font-medium">
                  {selectedStudent.gender === 'nam' ? 'Nam' : 'Nữ'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Ngày sinh:</span>
                <span className="text-gray-800 font-medium">
                  {selectedStudent.dateOfBirth}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 block text-[11px]">Lớp học:</span>
                <span className="text-blue-700 font-semibold">
                  {selectedStudent.className}
                </span>
              </div>
            </div>
          </div>

          {/* Current Photo vs New Photo Comparison & Upload (BR05, K086) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">
                Ảnh nhận diện <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-500">
                {hasNewFile ? 'Đã chọn ảnh mới' : 'Chưa chọn ảnh mới thay thế'}
              </span>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Photo Preview Containers */}
            <div className="grid grid-cols-2 gap-3">
              {/* Current Existing Photo Container */}
              <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-semibold text-gray-500 mb-2">
                  Ảnh hiện tại
                </span>
                {selectedStudent.facePhotoUrl ? (
                  <img
                    src={selectedStudent.facePhotoUrl}
                    alt={`Ảnh hiện tại của ${selectedStudent.fullName}`}
                    className="w-24 h-24 object-cover rounded-lg border border-slate-300 shadow-2xs"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                    <FontAwesomeIcon icon={faUserGraduate} className="text-xl" />
                  </div>
                )}
                <span className="text-[10px] text-gray-400 mt-2">
                  Đã ghi nhận: {selectedStudent.registeredDate || '-'}
                </span>
              </div>

              {/* New Photo / Dropzone Container */}
              <div
                onClick={handleTriggerUpload}
                className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                  newPhotoPreview
                    ? 'border-blue-400 bg-blue-50/20'
                    : 'border-amber-300 hover:border-amber-400 bg-amber-50/30'
                }`}
              >
                <span className="text-[11px] font-bold text-blue-700 mb-2">
                  Ảnh mới thay thế
                </span>
                {newPhotoPreview ? (
                  <div className="space-y-1 flex flex-col items-center">
                    <img
                      src={newPhotoPreview}
                      alt="Ảnh mới đã chọn"
                      className="w-24 h-24 object-cover rounded-lg border-2 border-blue-500 shadow-xs"
                    />
                    <span className="text-[10px] text-blue-600 font-semibold truncate max-w-[120px]">
                      {selectedFileName}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5 py-2">
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-amber-500 text-xl" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerUpload();
                      }}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200 transition"
                    >
                      UPLOAD FILE
                    </button>
                    <p className="text-[10px] text-gray-500">
                      Chọn ảnh khuôn mặt mới
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Invariant Explanation Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-800">
              <FontAwesomeIcon icon={faCircleExclamation} className="text-amber-500 text-sm mt-0.5 shrink-0" />
              <span>
                <strong>Quy định cập nhật:</strong> Hiển thị ảnh hiện tại là chưa đủ điều kiện lưu. Quản trị viên <strong>bắt buộc phải tải lên file ảnh mới</strong> để kích hoạt nút Đăng ký.
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Hủy
            </button>
            {/* Submit Button: Strictly disabled by default until a new file is uploaded (BR04, BR05, K086) */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5 ${
                canSubmit
                  ? 'bg-[#0070CE] hover:bg-[#005bb5] text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title={
                canSubmit
                  ? 'Cập nhật ảnh nhận diện mới'
                  : 'Cần tải lên ảnh mới để kích hoạt nút Đăng ký'
              }
            >
              <FontAwesomeIcon icon={faCheckCircle} />
              <span>Đăng ký</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
