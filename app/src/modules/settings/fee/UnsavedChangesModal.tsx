import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faTimes,
  faArrowRight,
  faSave
} from '@fortawesome/free-solid-svg-icons';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  dirtyBlocks: string[];
  onConfirmLeave: () => void;
  onStay: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  dirtyBlocks,
  onConfirmLeave,
  onStay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Có thay đổi chưa được lưu!
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Bạn có các thay đổi chưa lưu trong các mục cấu hình dưới đây. Nếu rời khỏi trang, những thay đổi này sẽ bị hủy bỏ.
            </p>
          </div>
        </div>

        {/* Dirty Blocks List */}
        <div className="px-6 py-3 bg-slate-50 border-y border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Mục cấu hình có thay đổi:
          </p>
          <ul className="space-y-1.5">
            {dirtyBlocks.map((blockName) => (
              <li
                key={blockName}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>{blockName}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 flex items-center justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onStay}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors"
          >
            Ở lại lưu thay đổi
          </button>
          <button
            type="button"
            onClick={onConfirmLeave}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
          >
            Rời khỏi không lưu
          </button>
        </div>
      </div>
    </div>
  );
};
