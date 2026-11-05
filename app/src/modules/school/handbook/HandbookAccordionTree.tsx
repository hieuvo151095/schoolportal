import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faFolder,
  faFolderOpen,
  faBook,
  faChevronRight,
  faChevronDown,
  faEllipsisV,
  faPlus,
  faEdit,
  faTrashAlt,
  faEye,
  faEyeSlash,
  faGripVertical,
  faFolderPlus,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  HandbookCategory,
  HandbookArticle,
  HandbookCategoryNode,
  ArticleStatus,
} from '../../../types/parentHandbook';

interface HandbookAccordionTreeProps {
  tree: HandbookCategoryNode[];
  activeArticleId: string | null;
  onSelectArticle: (articleId: string) => void;
  onToggleAccordion: (categoryId: string) => void;
  onOpenCreateCategoryModal: (parentCategory?: HandbookCategory) => void;
  onEditCategory: (category: HandbookCategory) => void;
  onDeleteCategory: (category: HandbookCategory) => void;
  onToggleArticleStatus: (articleId: string, currentStatus: ArticleStatus) => void;
  onDeleteArticle: (article: HandbookArticle) => void;
  onNavigateCreateArticle: (categoryId: string) => void;
  onNavigateEditArticle: (articleId: string) => void;
  onMoveSubCategory?: (parentId: string, subId: string, direction: 'up' | 'down') => void;
  onMoveArticle?: (categoryId: string, articleId: string, direction: 'up' | 'down') => void;
}

export const HandbookAccordionTree: React.FC<HandbookAccordionTreeProps> = ({
  tree,
  activeArticleId,
  onSelectArticle,
  onToggleAccordion,
  onOpenCreateCategoryModal,
  onEditCategory,
  onDeleteCategory,
  onToggleArticleStatus,
  onDeleteArticle,
  onNavigateCreateArticle,
  onNavigateEditArticle,
  onMoveSubCategory,
  onMoveArticle,
}) => {
  // Context dropdown state: records ID of open menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Empty state ST-03
  if (tree.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mb-4">
          <FontAwesomeIcon icon={faBook} className="text-2xl" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Chưa có nội dung hiển thị</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
          Hiện chưa có danh mục hoặc bài viết nào. Hãy bắt đầu bằng cách tạo danh mục mới
        </p>
        <button
          type="button"
          onClick={() => onOpenCreateCategoryModal()}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-[#FEC020] hover:bg-amber-400 active:bg-amber-500 rounded-lg transition-colors shadow-xs"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          <span>Tạo danh mục mới</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden" ref={menuRef}>
      {tree.map((rootCategory) => {
        const isRootExpanded = !!rootCategory.isExpanded;
        const totalItemsInRoot = rootCategory.subCategories.length + rootCategory.articles.length;

        return (
          <div key={rootCategory.id} className="transition-colors">
            {/* Root Category Header (Level 1) */}
            <div
              onClick={() => onToggleAccordion(rootCategory.id)}
              className={`flex items-center justify-between p-3.5 cursor-pointer select-none transition-colors ${
                isRootExpanded ? 'bg-amber-50/40' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Expand / Collapse Chevron */}
                <button
                  type="button"
                  aria-label="Thu gọn hoặc mở rộng danh mục"
                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <FontAwesomeIcon
                    icon={isRootExpanded ? faChevronDown : faChevronRight}
                    className="text-xs transition-transform"
                  />
                </button>

                {/* Category Icon */}
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
                </div>

                {/* Name & Note */}
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {rootCategory.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full shrink-0">
                      {totalItemsInRoot}
                    </span>
                  </div>
                  {/* Collapsed Subtitle Note (BR03) */}
                  {!isRootExpanded && rootCategory.note && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {rootCategory.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Menu (•••) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => toggleMenu(`menu-cat-${rootCategory.id}`, e)}
                  aria-label="Thao tác danh mục"
                  className="w-7 h-7 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="text-xs" />
                </button>

                {openMenuId === `menu-cat-${rootCategory.id}` && (
                  <div className="absolute right-0 top-8 z-30 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs text-slate-700 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onOpenCreateCategoryModal(rootCategory);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition-colors font-medium"
                      >
                        <FontAwesomeIcon icon={faFolderPlus} className="text-amber-500 text-xs" />
                        <span>Thêm danh mục con</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onNavigateCreateArticle(rootCategory.id);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition-colors font-medium"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-emerald-500 text-xs" />
                        <span>Thêm bài viết</span>
                      </button>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onEditCategory(rootCategory);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-slate-400 text-xs" />
                        <span>Chỉnh sửa danh mục</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onDeleteCategory(rootCategory);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 text-xs" />
                        <span>Xóa danh mục</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Root Category Content */}
            {isRootExpanded && (
              <div className="pl-6 pr-3 pb-3 space-y-2 bg-slate-50/30">
                {/* Expanded Callout Box Note (BR03) */}
                {rootCategory.note && (
                  <div className="border border-dashed border-amber-300 bg-amber-50/70 p-2.5 rounded-lg text-xs text-slate-700 flex items-start gap-2 my-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-amber-500 text-xs mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{rootCategory.note}</span>
                  </div>
                )}

                {/* Sub-Categories (Level 2) */}
                {rootCategory.subCategories.map((subCategory, subIdx) => {
                  const isSubExpanded = !!subCategory.isExpanded;
                  const totalSubArticles = subCategory.articles.length;

                  return (
                    <div
                      key={subCategory.id}
                      className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-2xs"
                    >
                      {/* Sub-Category Header */}
                      <div
                        onClick={() => onToggleAccordion(subCategory.id)}
                        className={`flex items-center justify-between p-2.5 cursor-pointer select-none transition-colors ${
                          isSubExpanded ? 'bg-amber-50/30' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {/* Sibling Drag Handle (BR04, K053) */}
                          <div
                            className="w-4 flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-grab shrink-0"
                            title="Kéo thả sắp xếp thứ tự"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FontAwesomeIcon icon={faGripVertical} className="text-xs" />
                          </div>

                          {/* Expand/Collapse Chevron */}
                          <button
                            type="button"
                            aria-label="Thu gọn hoặc mở rộng danh mục con"
                            className="w-4 h-4 flex items-center justify-center text-slate-400"
                          >
                            <FontAwesomeIcon
                              icon={isSubExpanded ? faChevronDown : faChevronRight}
                              className="text-[10px]"
                            />
                          </button>

                          {/* Folder Icon */}
                          <FontAwesomeIcon
                            icon={isSubExpanded ? faFolderOpen : faFolder}
                            className="text-amber-500 text-xs shrink-0"
                          />

                          {/* Sub-Category Name & Count */}
                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-800 truncate">
                                {subCategory.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0">
                                ({totalSubArticles})
                              </span>
                            </div>
                            {/* Collapsed Subtitle Note (BR03) */}
                            {!isSubExpanded && subCategory.note && (
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {subCategory.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Menu (•••) */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => toggleMenu(`menu-sub-${subCategory.id}`, e)}
                            aria-label="Thao tác danh mục con"
                            className="w-6 h-6 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faEllipsisV} className="text-xs" />
                          </button>

                          {openMenuId === `menu-sub-${subCategory.id}` && (
                            <div className="absolute right-0 top-7 z-30 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs text-slate-700 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                              <div className="py-1">
                                {/* Only + Thêm bài viết allowed here (BR01, VR-HNB-01) */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    onNavigateCreateArticle(subCategory.id);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition-colors font-medium"
                                >
                                  <FontAwesomeIcon icon={faPlus} className="text-emerald-500 text-xs" />
                                  <span>Thêm bài viết</span>
                                </button>
                              </div>
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    onEditCategory(subCategory);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                >
                                  <FontAwesomeIcon icon={faEdit} className="text-slate-400 text-xs" />
                                  <span>Chỉnh sửa</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    onDeleteCategory(subCategory);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 text-xs" />
                                  <span>Xóa danh mục</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sub-Category Content & Articles */}
                      {isSubExpanded && (
                        <div className="p-2.5 pt-0 space-y-1.5 bg-slate-50/50">
                          {/* Sub-category note callout when expanded (BR03) */}
                          {subCategory.note && (
                            <div className="border border-dashed border-slate-200 bg-white/80 p-2 rounded-lg text-xs text-slate-600 flex items-start gap-1.5 my-1.5">
                              <FontAwesomeIcon icon={faInfoCircle} className="text-slate-400 text-[11px] mt-0.5 shrink-0" />
                              <span className="leading-relaxed text-[11px]">{subCategory.note}</span>
                            </div>
                          )}

                          {subCategory.articles.length === 0 ? (
                            <div className="py-3 text-center text-xs text-slate-400 italic">
                              Chưa có bài viết nào trong danh mục này.
                            </div>
                          ) : (
                            subCategory.articles.map((article) => {
                              const isSelected = activeArticleId === article.id;
                              const isDraft = article.status === 'draft';

                              return (
                                <div
                                  key={article.id}
                                  onClick={() => onSelectArticle(article.id)}
                                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                                    isSelected
                                      ? 'bg-amber-50/90 border-amber-300 shadow-2xs'
                                      : 'bg-white border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {/* Article Drag Handle (BR04) */}
                                    <div
                                      className="w-4 flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-grab shrink-0"
                                      title="Kéo thả sắp xếp thứ tự"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <FontAwesomeIcon icon={faGripVertical} className="text-xs" />
                                    </div>

                                    {/* Article Icon */}
                                    <FontAwesomeIcon
                                      icon={faBook}
                                      className={`text-xs shrink-0 ${
                                        isSelected ? 'text-amber-600' : 'text-slate-400'
                                      }`}
                                    />

                                    {/* Article Title & Status (BR05, BR12, K052) */}
                                    <div className="min-w-0 flex-1 pr-2 flex items-center gap-2">
                                      <span
                                        className={`text-xs truncate ${
                                          isDraft
                                            ? 'text-slate-600'
                                            : 'text-[#C85A17] font-semibold'
                                        }`}
                                      >
                                        {article.title}
                                      </span>

                                      {/* Draft Badge (BR05) */}
                                      {isDraft && (
                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded shrink-0">
                                          Bản nháp
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Article Actions (•••) */}
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={(e) => toggleMenu(`menu-art-${article.id}`, e)}
                                      aria-label="Thao tác bài viết"
                                      className="w-6 h-6 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                                    >
                                      <FontAwesomeIcon icon={faEllipsisV} className="text-xs" />
                                    </button>

                                    {openMenuId === `menu-art-${article.id}` && (
                                      <div className="absolute right-0 top-7 z-30 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs text-slate-700 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="py-1">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenMenuId(null);
                                              onNavigateEditArticle(article.id);
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                          >
                                            <FontAwesomeIcon icon={faEdit} className="text-slate-400 text-xs" />
                                            <span>Chỉnh sửa bài viết</span>
                                          </button>
                                          {/* 1-Click Status Toggling (BR05, BR12) */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenMenuId(null);
                                              onToggleArticleStatus(article.id, article.status);
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition-colors font-medium"
                                          >
                                            <FontAwesomeIcon
                                              icon={isDraft ? faEye : faEyeSlash}
                                              className={isDraft ? 'text-emerald-500 text-xs' : 'text-slate-400 text-xs'}
                                            />
                                            <span>{isDraft ? 'Xuất bản bài viết' : 'Ẩn bài viết'}</span>
                                          </button>
                                        </div>
                                        <div className="py-1">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenMenuId(null);
                                              onDeleteArticle(article);
                                            }}
                                            className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                                          >
                                            <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 text-xs" />
                                            <span>Xóa bài viết</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Direct Articles under Root Category */}
                {rootCategory.articles.length > 0 && (
                  <div className="pt-1 space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                      Bài viết trực tiếp
                    </p>
                    {rootCategory.articles.map((article) => {
                      const isSelected = activeArticleId === article.id;
                      const isDraft = article.status === 'draft';

                      return (
                        <div
                          key={article.id}
                          onClick={() => onSelectArticle(article.id)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-amber-50/90 border-amber-300 shadow-2xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className="w-4 flex items-center justify-center text-slate-300 hover:text-slate-500 cursor-grab shrink-0"
                              title="Kéo thả sắp xếp thứ tự"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FontAwesomeIcon icon={faGripVertical} className="text-xs" />
                            </div>

                            <FontAwesomeIcon
                              icon={faBook}
                              className={`text-xs shrink-0 ${
                                isSelected ? 'text-amber-600' : 'text-slate-400'
                              }`}
                            />

                            <div className="min-w-0 flex-1 pr-2 flex items-center gap-2">
                              <span
                                className={`text-xs truncate ${
                                  isDraft ? 'text-slate-600' : 'text-[#C85A17] font-semibold'
                                }`}
                              >
                                {article.title}
                              </span>

                              {isDraft && (
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded shrink-0">
                                  Bản nháp
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => toggleMenu(`menu-art-root-${article.id}`, e)}
                              aria-label="Thao tác bài viết trực tiếp"
                              className="w-6 h-6 rounded-md hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} className="text-xs" />
                            </button>

                            {openMenuId === `menu-art-root-${article.id}` && (
                              <div className="absolute right-0 top-7 z-30 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs text-slate-700 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                                <div className="py-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(null);
                                      onNavigateEditArticle(article.id);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                  >
                                    <FontAwesomeIcon icon={faEdit} className="text-slate-400 text-xs" />
                                    <span>Chỉnh sửa bài viết</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(null);
                                      onToggleArticleStatus(article.id, article.status);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2 transition-colors font-medium"
                                  >
                                    <FontAwesomeIcon
                                      icon={isDraft ? faEye : faEyeSlash}
                                      className={isDraft ? 'text-emerald-500 text-xs' : 'text-slate-400 text-xs'}
                                    />
                                    <span>{isDraft ? 'Xuất bản bài viết' : 'Ẩn bài viết'}</span>
                                  </button>
                                </div>
                                <div className="py-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(null);
                                      onDeleteArticle(article);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 text-xs" />
                                    <span>Xóa bài viết</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
