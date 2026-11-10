import React from 'react';
import { Icon, SlideOver } from '@/components/ds';

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
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={isCategory ? 'Xác nhận xóa danh mục' : 'Xác nhận xóa bài viết'}
      description="Thao tác này sẽ gỡ bỏ nội dung khỏi Sổ tay điện tử phụ huynh"
      icon="trash"
      width={480}
      primaryAction={{
        label: isCategory ? 'Xóa danh mục' : 'Xóa bài viết',
        icon: 'trash',
        onClick: () => {
          onConfirm();
          onClose();
        },
      }}
      secondaryAction={{
        label: 'Hủy bỏ',
        onClick: onClose,
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center p-6 bg-rose-50 border border-rose-200 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl font-bold mb-3 border-2 border-rose-300">
            <Icon name="trash" size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {isCategory ? 'Xác nhận xóa danh mục?' : 'Xác nhận xóa bài viết?'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            Vui lòng xác nhận xóa <strong className="text-slate-800">&ldquo;{targetTitle}&rdquo;</strong>.
          </p>
        </div>

        {isCategory && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <Icon name="triangle-exclamation" size={18} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Lưu ý quan trọng (Xóa phân tầng):</strong>
              Tất cả danh mục con{' '}
              {cascadingInfo?.totalSubCategories ? `(${cascadingInfo.totalSubCategories})` : ''} và bài viết{' '}
              {cascadingInfo?.totalArticles ? `(${cascadingInfo.totalArticles})` : ''} bên trong danh mục này sẽ bị xóa vĩnh viễn và không thể khôi phục!
            </div>
          </div>
        )}
      </div>
    </SlideOver>
  );
};
