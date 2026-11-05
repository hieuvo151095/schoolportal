import React from 'react';
import { Poll } from '@/types/poll';

interface DeletePollModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pollId: string) => void;
}

export const DeletePollModal: React.FC<DeletePollModalProps> = ({
  poll,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !poll) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with 3 colored circles */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">
              Xác nhận xóa
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Content (BC-02) */}
        <div className="p-6">
          <h3 className="text-base font-bold text-slate-800 mb-2">
            Vui lòng xác nhận xóa bình chọn{' '}
            <span className="text-rose-600">&ldquo;{poll.title}&rdquo;</span>
          </h3>
          <p className="text-xs text-slate-500">
            Hành động này sẽ xóa hoàn toàn bản nháp bình chọn khỏi hệ thống và không thể phục hồi lại.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onConfirm(poll.id)}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeletePollModal;
