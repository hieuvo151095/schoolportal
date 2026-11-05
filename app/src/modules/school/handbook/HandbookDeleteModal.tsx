import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';

interface HandbookDeleteModalProps {
  isOpen: boolean;
  type: 'category' | 'article';
  targetTitle: string;
  cascadingInfo?: {
    totalSubCategories: number;
    totalArticles: number;
  };
  onClose: () => void;
  onConfirm: () => void;
}

export const HandbookDeleteModal: React.FC<HandbookDeleteModalProps> = ({
  isOpen,
  type,
  targetTitle,
  cascadingInfo,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isCategory = type === 'category';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2 text-red-700 font-bold">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
            <span>{isCategory ? 'Xác nhận xóa danh mục' : 'Xác nhận xóa bài viết'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-3">
          {isCategory ? (
            // Category Cascading Deletion Message (ST-01)
            <div className="space-y-3">
              <p className="text-sm text-slate-700">
                Vui lòng xác nhận xóa danh mục <strong className="text-slate-900">&ldquo;{targetTitle}&rdquo;</strong>.
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 leading-relaxed font-medium">
                ⚠️ <strong>Lưu ý quan trọng:</strong> Tất cả danh mục con{' '}
                {cascadingInfo?.totalSubCategories ? `(${cascadingInfo.totalSubCategories})` : ''} và bài viết{' '}
                {cascadingInfo?.totalArticles ? `(${cascadingInfo.totalArticles})` : ''} bên trong danh mục này sẽ bị xóa vĩnh viễn và không thể khôi phục!
              </div>
            </div>
          ) : (
            // Article Simple Deletion Message (ST-02)
            <p className="text-sm text-slate-700">
              Vui lòng xác nhận xóa bài viết <strong className="text-slate-900">&ldquo;{targetTitle}&rdquo;</strong>.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg transition-colors shadow-xs"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
            <span>{isCategory ? 'Xác nhận xóa danh mục' : 'Xác nhận xóa bài viết'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
