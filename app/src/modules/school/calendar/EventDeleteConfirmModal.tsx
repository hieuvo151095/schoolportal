import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faTrash,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { SchoolEvent } from '../../../types/calendar';

interface EventDeleteConfirmModalProps {
  isOpen: boolean;
  event: SchoolEvent | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const EventDeleteConfirmModal: React.FC<EventDeleteConfirmModalProps> = ({
  isOpen,
  event,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 p-6">
        {/* Header with warning icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Xác nhận xóa sự kiện
            </h3>
            {/* Exact LS-01 requirement wording */}
            <p className="text-xs text-gray-600 leading-relaxed">
              Vui lòng xác nhận xóa sự kiện{' '}
              <span className="font-bold text-gray-900">"{event.title}"</span>?
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

        {/* Warning if event is holiday */}
        {event.category === 'ngay_nghi' && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <span className="font-bold block mb-0.5">Lưu ý ngày nghỉ:</span>
            <span>
              Sự kiện này đang là Ngày nghỉ chính thức. Việc xóa sự kiện có thể thay đổi số ngày khấu trừ hoàn tiền ăn của học sinh trong tháng.
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Xác nhận xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
