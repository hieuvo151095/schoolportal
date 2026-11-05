import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Thay đổi chưa được lưu
            </h3>
            {/* LS-02 requirement wording */}
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn hủy và rời khỏi trang không? Các dữ liệu vừa nhập sẽ bị mất.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Tiếp tục chỉnh sửa
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
          >
            Rời khỏi trang
          </button>
        </div>
      </div>
    </div>
  );
};
