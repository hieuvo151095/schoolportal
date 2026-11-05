import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCloudArrowUp,
  faCamera,
  faUserGraduate,
  faCheckCircle,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  closeModal,
  registerFacePhoto,
} from '@/store/slices/faceRecognitionSlice';
import { canSubmitRegistration } from '@/utils/faceRecognitionValidation';

export const RegisterFaceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeModal, selectedStudent } = useAppSelector(
    (state) => state.faceRecognition
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  if (activeModal !== 'register' || !selectedStudent) {
    return null;
  }

  const handleClose = () => {
    setPhotoPreview(null);
    setSelectedFileName('');
    dispatch(closeModal());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const canSubmit = canSubmitRegistration(Boolean(photoPreview));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !photoPreview) return;

    dispatch(
      registerFacePhoto({
        studentId: selectedStudent.studentId,
        facePhotoUrl: photoPreview,
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
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <FontAwesomeIcon icon={faCamera} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Đăng ký ảnh nhận diện
              </h3>
              <p className="text-xs text-gray-500">
                Ghi nhận dữ liệu khuôn mặt sinh trắc học cho học sinh
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
          {/* Read-only Student Demographic Information (BR03, K085) */}
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

          {/* Photo Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-700">
              Ảnh khuôn mặt nhận diện <span className="text-red-500">*</span>
            </label>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload & Preview Dropzone */}
            <div
              onClick={handleTriggerUpload}
              className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition text-center ${
                photoPreview
                  ? 'border-blue-300 bg-blue-50/20'
                  : 'border-gray-200 hover:border-blue-400 bg-gray-50/50 hover:bg-gray-50'
              }`}
            >
              {photoPreview ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="relative group">
                    <img
                      src={photoPreview}
                      alt="Ảnh xem trước"
                      className="w-28 h-28 object-cover rounded-xl border-2 border-blue-500 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">
                      Thay đổi ảnh
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold text-blue-600 block">
                      {selectedFileName || 'Ảnh đã chọn'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerUpload();
                      }}
                      className="mt-1 text-[11px] text-blue-600 underline font-medium"
                    >
                      Chọn ảnh khác
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-lg">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTriggerUpload();
                      }}
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                    >
                      UPLOAD FILE
                    </button>
                    <p className="text-xs text-gray-500 mt-1">hoặc kéo thả ảnh vào đây</p>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* Guidance Alert */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2.5 flex items-start gap-2 text-xs text-amber-800">
              <FontAwesomeIcon icon={faCircleExclamation} className="text-amber-500 text-sm mt-0.5 shrink-0" />
              <span>
                <strong>Yêu cầu chất lượng:</strong> Ảnh cần rõ mặt, chụp thẳng chính diện, đủ ánh sáng, không bị nghiêng, không đội mũ hoặc che mặt.
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
            {/* Submit Button: Strictly disabled if no photo chosen (BR04, K086) */}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1.5 ${
                canSubmit
                  ? 'bg-[#0070CE] hover:bg-[#005bb5] text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              title={canSubmit ? 'Đăng ký ảnh nhận diện' : 'Vui lòng chọn ảnh trước khi đăng ký'}
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
