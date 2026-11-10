import React, { useState, useEffect } from 'react';
import { Icon, SlideOver } from '@/components/ds';
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const titleText = isEditing
    ? isSubCategory
      ? 'Chỉnh sửa danh mục con'
      : 'Chỉnh sửa danh mục chính'
    : isSubCategory
    ? 'Thêm danh mục con'
    : 'Thêm danh mục chính';

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={titleText}
      description="Quản lý cấu trúc phân loại danh mục Sổ tay phụ huynh"
      icon="folder"
      width={480}
      primaryAction={{
        label: isEditing ? 'Lưu thay đổi' : 'Tạo danh mục',
        icon: 'check',
        disabled: name.trim().length < 2,
        onClick: () => {
          const form = document.getElementById('handbook-category-form') as HTMLFormElement;
          if (form) form.requestSubmit();
        },
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <form id="handbook-category-form" onSubmit={handleSubmit} className="space-y-4">
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
            rows={4}
            placeholder="Nhập ghi chú tóm tắt nội dung danh mục..."
            className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 placeholder:text-slate-400"
          />
        </div>
      </form>
    </SlideOver>
  );
};
