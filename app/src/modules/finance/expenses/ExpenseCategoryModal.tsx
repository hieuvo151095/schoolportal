import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderTree,
  faTimes,
  faPlus,
  faEdit,
  faTrash,
  faShieldAlt,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { ExpenseCategory } from '../../../types/expense';
import { canDeleteCategory } from '../../../utils/expenseValidation';

interface ExpenseCategoryModalProps {
  isOpen: boolean;
  categories: ExpenseCategory[];
  onClose: () => void;
  onCreateCategory: (name: string, description: string) => void;
  onUpdateCategory: (id: string, name: string, description: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const ExpenseCategoryModal: React.FC<ExpenseCategoryModalProps> = ({
  isOpen,
  categories,
  onClose,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setNameInput('');
    setDescriptionInput('');
    setError(null);
  };

  const handleStartEdit = (cat: ExpenseCategory) => {
    setEditingId(cat.id);
    setIsAdding(false);
    setNameInput(cat.name);
    setDescriptionInput(cat.description);
    setError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError('Vui lòng nhập tên danh mục chi phí');
      return;
    }

    if (isAdding) {
      onCreateCategory(nameInput.trim(), descriptionInput.trim());
      setIsAdding(false);
    } else if (editingId) {
      onUpdateCategory(editingId, nameInput.trim(), descriptionInput.trim());
      setEditingId(null);
    }

    setNameInput('');
    setDescriptionInput('');
    setError(null);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNameInput('');
    setDescriptionInput('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faFolderTree} className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quản lý danh mục chi phí</h2>
              <p className="text-xs text-slate-500">
                Phân loại các khoản chi của trường học và theo dõi số phiếu áp dụng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Add / Edit Form if active */}
        {(isAdding || editingId) && (
          <form onSubmit={handleSave} className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 space-y-3">
            <div className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
              {isAdding ? 'Thêm danh mục mới' : 'Chỉnh sửa danh mục'}
            </div>

            <div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Tên danh mục chi phí (VD: Thiết bị văn phòng...)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                autoFocus
              />
            </div>

            <div>
              <input
                type="text"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                placeholder="Mô tả danh mục chi phí..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-xs text-rose-500">{error}</p>}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm"
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>{isAdding ? 'Thêm' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Categories Table / List */}
        <div className="space-y-2 mb-5 max-h-[380px] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isDefault = !canDeleteCategory(cat);

            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 truncate">
                      {cat.name}
                    </span>
                    {isDefault && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-[9px]" />
                        <span>Mặc định (Hệ thống)</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {cat.description || 'Không có mô tả'}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Chi phí áp dụng badge */}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {cat.appliedCount} phiếu chi
                  </span>

                  {/* Edit icon */}
                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="w-7 h-7 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors"
                    title="Chỉnh sửa danh mục"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                  </button>

                  {/* BR08: Delete icon - Hidden / Locked for system default category */}
                  {!isDefault ? (
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) {
                          onDeleteCategory(cat.id);
                        }
                      }}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                      title="Xóa danh mục"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  ) : (
                    <div className="w-7 h-7 flex items-center justify-center" title="Danh mục hệ thống không thể xóa">
                      <FontAwesomeIcon icon={faShieldAlt} className="text-xs text-slate-300" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {!isAdding && !editingId ? (
            <button
              onClick={handleStartAdd}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>+ Thêm danh mục</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
