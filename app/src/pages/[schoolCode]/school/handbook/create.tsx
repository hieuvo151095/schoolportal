import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Icon, Dropdown } from '@/components/ds';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { useAppSelector, useAppDispatch } from '../../../../store';
import { createArticle } from '../../../../store/slices/parentHandbookSlice';
import { validateArticle } from '../../../../utils/parentHandbookValidation';
import { HandbookFileAttachment } from '../../../../types/parentHandbook';

export default function CreateHandbookArticlePage() {
  const router = useRouter();
  const { schoolCode, categoryId } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.parentHandbook);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<HandbookFileAttachment[]>([]);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId && typeof categoryId === 'string') {
      setSelectedCategoryId(categoryId);
    } else if (categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categoryId, categories]);

  const targetCategory = categories.find((c) => c.id === selectedCategoryId);
  const parentCategory = targetCategory?.parentCategoryId
    ? categories.find((c) => c.id === targetCategory.parentCategoryId)
    : null;

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

  const handleSave = (status: 'draft' | 'published') => {
    const payload = {
      title,
      content,
      categoryId: selectedCategoryId,
      status,
      attachments,
    };

    const validation = validateArticle(payload, categories);
    if (!validation.isValid) {
      setError(validation.error || 'Vui lòng kiểm tra lại thông tin.');
      return;
    }

    dispatch(createArticle(payload));
    router.push(`/${currentSchoolCode}/school/handbook`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>Soạn Thảo Bài Viết Mới | Sổ Tay PH</title>
      </Head>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F8FAFC]">
        {/* Header Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${currentSchoolCode}/school/handbook`)}
              className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-2xs"
            >
              <Icon name="arrow-left" className="w-3.5 h-3.5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Soạn thảo bài viết Sổ tay PH</h1>
              <p className="text-xs text-slate-500">Tạo tài liệu hướng dẫn hoặc quy chế trường học mới</p>
            </div>
          </div>

          {/* Dual Save Buttons (BR08) */}
          {(() => {
            const isFormValid = !!selectedCategoryId && title.trim().length > 0 && content.trim().length > 0;
            return (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={() => handleSave('draft')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-2xs ${
                    isFormValid
                      ? 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer'
                      : 'text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Icon name="bookmark" className="w-3.5 h-3.5" />
                  <span>Lưu nháp</span>
                </button>
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={() => handleSave('published')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                    isFormValid
                      ? 'text-slate-900 bg-[#FEC020] hover:bg-amber-400 active:bg-amber-500 cursor-pointer'
                      : 'text-slate-400 bg-slate-200 cursor-not-allowed'
                  }`}
                >
                  <Icon name="paper-plane" className="w-3.5 h-3.5" />
                  <span>Lưu &amp; Xuất bản</span>
                </button>
              </div>
            );
          })()}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <Icon name="circle-info" className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Composer Workspace */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Locked Destination Category Breadcrumbs (BR07) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Danh mục đích lưu bài viết <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 select-none">
                <Icon name="lock" className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {parentCategory
                    ? `${parentCategory.name} > ${targetCategory?.name}`
                    : targetCategory?.name || 'Chưa chọn danh mục'}
                </span>
              </div>

              <div className="w-full sm:w-64">
                <Dropdown
                  value={selectedCategoryId}
                  onChange={(val) => {
                    setSelectedCategoryId(String(val));
                    setError(null);
                  }}
                  options={categories.map((c) => {
                    const parent = c.parentCategoryId
                      ? categories.find((p) => p.id === c.parentCategoryId)
                      : null;
                    return {
                      value: c.id,
                      label: parent ? `${c.name} (${parent.name})` : c.name,
                    };
                  })}
                  placeholder="Chọn danh mục"
                  size="sm"
                  fullWidth
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Bài viết sẽ được gắn chặt vào danh mục trên và tự động hiển thị trong cấu trúc cây.
            </p>
          </div>

          {/* Article Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Nhập tiêu đề quy chế, hướng dẫn hoặc nội quy..."
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 font-semibold bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400 placeholder:text-slate-400"
            />
          </div>

          {/* Rich Content Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nội dung bài viết (HTML / Văn bản) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError(null);
              }}
              rows={12}
              placeholder="Nhập nội dung bài viết, điều khoản quy định (hỗ trợ thẻ HTML như <h3>, <p>, <ul>, <li>, <strong>)..."
              className="w-full px-3.5 py-3 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400 leading-relaxed placeholder:text-slate-400"
            />
          </div>

          {/* File Attachments Uploader */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Tài liệu đính kèm (PDF, Word)
            </label>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                placeholder="Tên tài liệu đính kèm (Ví dụ: So_Do_Dua_Don.pdf)..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Icon name="upload" className="w-3.5 h-3.5" />
                <span>Thêm tệp</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="file-lines" className="w-3.5 h-3.5 text-red-500" />
                      <span className="font-medium text-slate-800">{file.name}</span>
                      <span className="text-[10px] text-slate-400">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
