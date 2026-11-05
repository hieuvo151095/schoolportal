/**
 * Delete Fee Modal Component
 * Confirmation dialog for removing a custom fee item from the master catalog
 * Governance: Marcus Fleet V34 / Constitution V1.0.0
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import {
  deleteFeeItem,
  closeDeleteModal,
} from '../../../store/slices/schoolFeeSlice';

export const DeleteFeeModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const deletingFee = useAppSelector((state) => state.schoolFee.deletingFee);

  if (!deletingFee) {
    return null;
  }

  const handleConfirm = () => {
    const feeName = deletingFee.name;
    dispatch(deleteFeeItem(deletingFee.id));
    dispatch(
      addToast({
        type: 'success',
        message: `Đã xóa khoản phí "${feeName}" thành công!`,
      })
    );
  };

  const handleClose = () => {
    dispatch(closeDeleteModal());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-2 text-rose-600">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-5 h-5" />
            <h3 className="font-bold text-slate-800 text-base">
              Xác nhận xóa khoản phí
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
            aria-label="Đóng"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-sm text-slate-600">
          <p>
            Bạn có chắc chắn muốn xóa khoản phí{' '}
            <strong className="text-slate-900 font-bold">{deletingFee.name}</strong>{' '}
            khỏi danh mục của trường?
          </p>
          <p className="mt-2 text-xs text-rose-600 font-medium">
            Lưu ý: Hành động này sẽ loại bỏ khoản phí khỏi các mẫu cấu hình thu tiền của toàn trường.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition text-sm"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition active:scale-95 text-sm"
          >
            <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
