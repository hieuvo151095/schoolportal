import React from 'react';
import { Icon } from '@/components/ds';
import {
  HandbookArticle,
  HandbookCategory,
  ArticleStatus,
} from '../../../types/parentHandbook';

interface HandbookDetailPanelProps {
  article: HandbookArticle | null;
  categories: HandbookCategory[];
  onNavigateEditArticle: (articleId: string) => void;
  onToggleStatus: (articleId: string, currentStatus: ArticleStatus) => void;
  onDeleteArticle: (article: HandbookArticle) => void;
}

export const HandbookDetailPanel: React.FC<HandbookDetailPanelProps> = ({
  article,
  categories,
  onNavigateEditArticle,
  onToggleStatus,
  onDeleteArticle,
}) => {
  if (!article) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
          <Icon name="book-open" className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Chưa chọn bài viết</h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          Chọn một bài viết từ cây danh mục bên trái để xem nội dung chi tiết hoặc chỉnh sửa.
        </p>
      </div>
    );
  }

  // Find parent breadcrumbs
  const category = categories.find((c) => c.id === article.categoryId);
  const parentCategory = category?.parentCategoryId
    ? categories.find((c) => c.id === category.parentCategoryId)
    : null;

  const isDraft = article.status === 'draft';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Top Header & Breadcrumb Bar */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/60">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 overflow-x-auto whitespace-nowrap">
          <span className="hover:text-slate-700">Sổ tay PH</span>
          <span>/</span>
          {parentCategory && (
            <>
              <span className="hover:text-slate-700">{parentCategory.name}</span>
              <span>/</span>
            </>
          )}
          {category && (
            <>
              <span className="font-medium text-slate-700">{category.name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-slate-400 truncate max-w-[200px]">{article.title}</span>
        </div>

        {/* Title and Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Status Badge */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  isDraft
                    ? 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {isDraft ? 'Bản nháp' : 'Đã phát hành'}
              </span>

              {/* Category Tag */}
              {category && (
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Icon name="folder-open" className="text-slate-400 w-3.5 h-3.5" />
                  <span>{category.name}</span>
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              {article.title}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 1-Click Status Toggling */}
            <button
              type="button"
              onClick={() => onToggleStatus(article.id, article.status)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isDraft
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <Icon name={isDraft ? "eye" : "eye-slash"} className="w-3.5 h-3.5" />
              <span>{isDraft ? 'Xuất bản' : 'Ẩn bài viết'}</span>
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => onNavigateEditArticle(article.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Icon name="pen" className="w-3.5 h-3.5 text-slate-500" />
              <span>Chỉnh sửa</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => onDeleteArticle(article)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
              title="Xóa bài viết"
            >
              <Icon name="trash" className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-1.5">
            <Icon name="user" className="w-3.5 h-3.5 text-slate-400" />
            <span>Tác giả: <strong>{article.authorName}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="clock" className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Cập nhật: {new Date(article.updatedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
          {article.publishedAt && (
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <Icon name="calendar-check" className="w-3.5 h-3.5" />
              <span>
                Phát hành: {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 overflow-y-auto max-h-[600px] space-y-6">
        {/* Render HTML content safely with rich typography styling */}
        <div
          className="prose prose-sm prose-slate max-w-none text-slate-800 leading-relaxed space-y-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:my-1.5"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* File Attachments (BR06) */}
        {article.attachments && article.attachments.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Tài liệu đính kèm ({article.attachments.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {article.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Icon
                      name="file-lines"
                      className="w-4 h-4 text-red-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {file.name}
                      </p>
                      <span className="text-[10px] text-slate-400">{file.size}</span>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    download
                    className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors shrink-0"
                    title="Tải tệp tin"
                  >
                    <Icon name="download" className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
