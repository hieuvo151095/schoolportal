import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  isDestructive = true,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-base">
              <FontAwesomeIcon icon={isDestructive ? faTrash : faExclamationTriangle} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-400">Vui lòng xác nhận trước khi tiếp tục</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message Body */}
        <div className="p-6">
          <div className="text-xs text-slate-600 leading-relaxed space-y-2">
            {message}
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-[11px] text-amber-900">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>Lưu ý: Thao tác này không thể hoàn tác sau khi đã thực hiện.</span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
