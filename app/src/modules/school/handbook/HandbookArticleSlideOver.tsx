import React, { useState, useEffect } from 'react';
import { SlideOver, Icon, Dropdown, Button } from '@/components/ds';
import {
  HandbookCategory,
  HandbookArticle,
  HandbookFileAttachment,
  CreateArticlePayload,
  UpdateArticlePayload,
} from '../../../types/parentHandbook';
import { validateArticle } from '../../../utils/parentHandbookValidation';

interface HandbookArticleSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  categories: HandbookCategory[];
  initialArticle?: HandbookArticle | null;
  defaultCategoryId?: string;
  onSave: (payload: { categoryId: string; title: string; content: string; attachments: HandbookFileAttachment[]; status: 'draft' | 'published' }) => void;
}

export const HandbookArticleSlideOver: React.FC<HandbookArticleSlideOverProps> = ({
  isOpen,
  onClose,
  categories,
  initialArticle,
  defaultCategoryId,
  onSave,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<HandbookFileAttachment[]>([]);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialArticle) {
      setSelectedCategoryId(initialArticle.categoryId);
      setTitle(initialArticle.title);
      setContent(initialArticle.content);
      setAttachments(initialArticle.attachments || []);
      setError(null);
    } else {
      setSelectedCategoryId(defaultCategoryId || (categories[0]?.id || ''));
      setTitle('');
      setContent('');
      setAttachments([]);
      setError(null);
    }
  }, [initialArticle, defaultCategoryId, categories, isOpen]);

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return;
    const newAtt: HandbookFileAttachment = {
      id: `att-${Date.now()}`,
      name: newAttachmentName.trim().endsWith('.pdf')
        ? newAttachmentName.trim()
        : `${newAttachmentName.trim()}.pdf`,
      url: '#',
      size: '1.2 MB',
      mimeType: 'application/pdf',
    };
    setAttachments((prev) => [...prev, newAtt]);
    setNewAttachmentName('');
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveArticle = (status: 'draft' | 'published') => {
    const payload = {
      title,
      content,
      categoryId: selectedCategoryId,
      attachments,
    };
    const validation = validateArticle(payload, categories);
    if (!validation.isValid) {
      setError(validation.error || 'Dữ liệu bài viết không hợp lệ');
      return;
    }
    setError(null);
    onSave({
      ...payload,
      status,
    });
    onClose();
  };

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.parentCategoryId
      ? `— ${c.name}`
      : c.name,
  }));

  const isFormValid = title.trim().length > 0 && selectedCategoryId.length > 0;

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={initialArticle ? 'Chỉnh sửa bài viết sổ tay' : 'Soạn bài viết sổ tay mới'}
      description="Bài viết hướng dẫn, quy định và thông tin cẩm nang dành cho phụ huynh"
      icon="book-bookmark"
      width={680}
      primaryAction={{
        label: initialArticle ? 'Cập nhật' : 'Phát hành ngay',
        icon: 'check',
        disabled: !isFormValid,
        onClick: () => handleSaveArticle('published'),
      }}
      secondaryAction={{
        label: 'Lưu bản nháp',
        onClick: () => handleSaveArticle('draft'),
      }}
    >
      <div className="space-y-5 py-2">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <Icon name="triangle-exclamation" className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Category selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Danh mục áp dụng <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={selectedCategoryId}
            onChange={(val) => {
              setSelectedCategoryId(val);
              setError(null);
            }}
            options={categoryOptions}
            placeholder="-- Chọn danh mục --"
            fullWidth
          />
        </div>

        {/* Title input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Tiêu đề bài viết <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            placeholder="Ví dụ: Quy định thời gian đưa đón học sinh và liên hệ khẩn cấp..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Content textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Nội dung bài viết
          </label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung quy định, hướng dẫn cụ thể dành cho phụ huynh..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
          />
        </div>

        {/* Attachment files */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Tài liệu đính kèm (PDF, biểu mẫu)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newAttachmentName}
              onChange={(e) => setNewAttachmentName(e.target.value)}
              placeholder="Tên tài liệu đính kèm (VD: Bieu_mau_don_xin_phep.pdf)"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="secondary"
              icon="plus"
              onClick={handleAddAttachment}
              disabled={!newAttachmentName.trim()}
            >
              Thêm tệp
            </Button>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-1.5">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Icon name="file-lines" className="w-3.5 h-3.5 text-blue-600" />
                    <span>{att.name}</span>
                    <span className="text-slate-400">({att.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Xóa tệp"
                  >
                    <Icon name="trash" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SlideOver>
  );
};

export default HandbookArticleSlideOver;
