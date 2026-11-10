import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ds';
import { HandbookCategory } from '../../../types/parentHandbook';

interface CategoryModalProps {
  isOpen: boolean;
  parentCategory?: HandbookCategory | null; // If present, creating sub-category under this parent
  categoryToEdit?: HandbookCategory | null; // If present, editing existing category
  onClose: () => void;
  onSave: (payload: { name: string; note?: string; parentCategoryId?: string | null }) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  parentCategory,
  categoryToEdit,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setNote(categoryToEdit.note || '');
    } else {
      setName('');
      setNote('');
    }
    setError(null);
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const isEditing = !!categoryToEdit;
  const isSubCategory = isEditing
    ? !!categoryToEdit.parentCategoryId
    : !!parentCategory;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError('Tên danh mục không được để trống và phải có ít nhất 2 ký tự.');
      return;
    }

    onSave({
      name: trimmedName,
      note: note.trim() || undefined,
      parentCategoryId: isEditing
        ? categoryToEdit.parentCategoryId
        : parentCategory
        ? parentCategory.id
        : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Icon name="folder" className="w-4 h-4 text-amber-500" />
            <span>
              {isEditing
                ? isSubCategory
                  ? 'Chỉnh sửa danh mục con'
                  : 'Chỉnh sửa danh mục chính'
                : isSubCategory
                ? 'Thêm danh mục con'
                : 'Thêm danh mục chính'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <Icon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-2">
              <Icon name="circle-info" className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Locked Parent Category Breadcrumb for Sub-Categories */}
          {isSubCategory && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Danh mục chính (Cấp 1)
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium select-none">
                <Icon name="lock" className="w-3.5 h-3.5 text-slate-400" />
                <span>{parentCategory?.name || 'Danh mục cha'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Danh mục con trực thuộc danh mục chính trên theo cấu trúc 2 cấp.
              </p>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isSubCategory ? 'Tên danh mục con' : 'Tên danh mục'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isSubCategory ? 'Ví dụ: Đưa đón học sinh...' : 'Ví dụ: Quy định chung...'}
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-slate-400"
              autoFocus
            />
          </div>

          {/* Category Note / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú / Mô tả ngắn
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Nhập ghi chú tóm tắt nội dung danh mục..."
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-slate-400"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={name.trim().length < 2}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                name.trim().length >= 2
                  ? 'text-slate-900 bg-[#FEC020] hover:bg-amber-400 active:bg-amber-500 cursor-pointer'
                  : 'text-slate-400 bg-slate-200 cursor-not-allowed'
              }`}
            >
              {isEditing ? 'Lưu thay đổi' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
