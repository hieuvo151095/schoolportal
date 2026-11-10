import React from 'react';
import { Icon } from '../../../components/ds';
import { WeeklyMenu } from '../../../types/menu';

interface DeleteMenuModalProps {
  isOpen: boolean;
  menu: WeeklyMenu | null;
  onClose: () => void;
  onConfirmDelete: (menuId: string) => void;
}

export const DeleteMenuModal: React.FC<DeleteMenuModalProps> = ({
  isOpen,
  menu,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !menu) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-red-50 to-rose-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600">
              <Icon name="trash" className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Xóa thực đơn</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white/60 transition-colors"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name="triangle-exclamation" className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              Vui lòng xác nhận xóa thực đơn <span className="font-semibold text-gray-900">"{menu.title}"</span>!
            </div>
          </div>
          <p className="text-xs text-gray-500 pl-11">
            Hành động này sẽ xóa hoàn toàn bản nháp thực đơn khỏi hệ thống và không thể hoàn tác.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete(menu.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};
