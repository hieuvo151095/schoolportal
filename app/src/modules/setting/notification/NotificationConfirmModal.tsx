import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  closeConfirmModal,
  saveNotificationSettings,
} from '../../../store/slices/notificationSettingsSlice';

export const NotificationConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isConfirmModalOpen } = useAppSelector(
    (state) => state.notificationSettings
  );

  if (!isConfirmModalOpen) return null;

  const handleCancel = () => {
    dispatch(closeConfirmModal());
  };

  const handleConfirm = () => {
    dispatch(saveNotificationSettings());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-confirm-title"
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-xl" />
          </div>

          <h3
            id="modal-confirm-title"
            className="text-base font-bold text-slate-900 leading-snug"
          >
            Xác nhận thay đổi cấu hình thông báo
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Vui lòng xác nhận thay đổi cấu hình thông báo của trường!
          </p>

          <p className="text-xs text-slate-400 leading-normal">
            Thay đổi sẽ có hiệu lực ngay lập tức trên toàn trường và đồng bộ tới ứng dụng di động của giáo viên và phụ huynh.
          </p>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xs" />
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0070CE] hover:bg-[#005bb0] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCheck} className="text-xs" />
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
