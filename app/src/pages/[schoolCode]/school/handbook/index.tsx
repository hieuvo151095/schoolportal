/**
 * School Parent Handbook (Sổ Tay Phụ Huynh) Page
 * Design System: [DS] ECO ME DASHBOARD v1.1.0 (PageHeader, FilterBar, 2-Column Split Workspace)
 */

import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/layout/PortalLayout';
import { useAppSelector, useAppDispatch } from '../../../../store';
import {
  setFilterStatus,
  setSearchQuery,
  setActiveArticleId,
  toggleAccordion,
  createCategory,
  updateCategory,
  deleteCategoryCascade,
  deleteArticle,
  toggleArticleStatus,
  createArticle,
  updateArticle,
} from '../../../../store/slices/parentHandbookSlice';
import { addToast } from '../../../../store/slices/toastSlice';
import {
  buildCategoryTree,
  filterTreeByArticleCriteria,
  getCascadingDeleteTargets,
} from '../../../../utils/parentHandbookValidation';
import {
  HandbookCategory,
  HandbookArticle,
  ArticleStatus,
} from '../../../../types/parentHandbook';
import { HandbookToolbar } from '../../../../modules/school/handbook/HandbookToolbar';
import { HandbookAccordionTree } from '../../../../modules/school/handbook/HandbookAccordionTree';
import { HandbookDetailPanel } from '../../../../modules/school/handbook/HandbookDetailPanel';
import { CategoryModal } from '../../../../modules/school/handbook/CategoryModal';
import { HandbookDeleteModal } from '../../../../modules/school/handbook/HandbookDeleteModal';
import { HandbookArticleSlideOver } from '../../../../modules/school/handbook/HandbookArticleSlideOver';
import { PageHeader } from '../../../../components/ds';

export default function SchoolParentHandbookPage() {
  const router = useRouter();
  const { schoolCode } = router.query;
  const currentSchoolCode = (schoolCode as string) || 'demo';

  const dispatch = useAppDispatch();
  const {
    categories,
    articles,
    expandedCategoryIds,
    activeArticleId,
    filterState,
  } = useAppSelector((state) => state.parentHandbook);

  // Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [parentCategoryForSub, setParentCategoryForSub] = useState<HandbookCategory | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<HandbookCategory | null>(null);

  // Article SlideOver States (Right-Sheet Standard)
  const [isArticleSlideOverOpen, setIsArticleSlideOverOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<HandbookArticle | null>(null);
  const [activeCreateCategoryId, setActiveCreateCategoryId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (router.query.create === 'true') {
      setEditingArticle(null);
      if (router.query.categoryId && typeof router.query.categoryId === 'string') {
        setActiveCreateCategoryId(router.query.categoryId);
      }
      setIsArticleSlideOverOpen(true);
    } else if (router.query.edit && typeof router.query.edit === 'string') {
      const target = articles.find((a) => a.id === router.query.edit);
      if (target) {
        setEditingArticle(target);
        setIsArticleSlideOverOpen(true);
      }
    }
  }, [router.query.create, router.query.edit, router.query.categoryId, articles]);

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'category' | 'article';
    targetId: string;
    targetTitle: string;
    cascadingInfo?: {
      totalSubCategories: number;
      totalArticles: number;
    };
  }>({
    isOpen: false,
    type: 'category',
    targetId: '',
    targetTitle: '',
  });

  // Build raw category tree with expanded states
  const rawTree = useMemo(() => {
    return buildCategoryTree(categories, articles, new Set(expandedCategoryIds));
  }, [categories, articles, expandedCategoryIds]);

  // Apply search query and status filter pruning (BR10, K051)
  const { filteredTree } = useMemo(() => {
    return filterTreeByArticleCriteria(
      rawTree,
      filterState.searchQuery,
      filterState.status
    );
  }, [rawTree, filterState.searchQuery, filterState.status]);

  // Active Article Object
  const activeArticle = useMemo(() => {
    return articles.find((a) => a.id === activeArticleId) || null;
  }, [articles, activeArticleId]);

  // Handlers
  const handleOpenCreateRootCategory = () => {
    setCategoryToEdit(null);
    setParentCategoryForSub(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenCreateSubCategory = (parent: HandbookCategory) => {
    setCategoryToEdit(null);
    setParentCategoryForSub(parent);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: HandbookCategory) => {
    setCategoryToEdit(cat);
    setParentCategoryForSub(null);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (payload: {
    name: string;
    note?: string;
    parentCategoryId?: string | null;
  }) => {
    if (categoryToEdit) {
      dispatch(
        updateCategory({
          id: categoryToEdit.id,
          name: payload.name,
          note: payload.note,
        })
      );
    } else {
      dispatch(
        createCategory({
          name: payload.name,
          note: payload.note,
          parentCategoryId: payload.parentCategoryId,
        })
      );
    }
  };

  // Delete Category (Triggering Cascading Modal ST-01)
  const handleDeleteCategoryPrompt = (category: HandbookCategory) => {
    const targets = getCascadingDeleteTargets(categories, articles, category.id);
    setDeleteModalState({
      isOpen: true,
      type: 'category',
      targetId: category.id,
      targetTitle: category.name,
      cascadingInfo: {
        totalSubCategories: targets.totalSubCategories,
        totalArticles: targets.totalArticles,
      },
    });
  };

  // Delete Article (Triggering Simple Modal ST-02)
  const handleDeleteArticlePrompt = (article: HandbookArticle) => {
    setDeleteModalState({
      isOpen: true,
      type: 'article',
      targetId: article.id,
      targetTitle: article.title,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModalState.type === 'category') {
      dispatch(deleteCategoryCascade(deleteModalState.targetId));
    } else {
      dispatch(deleteArticle(deleteModalState.targetId));
    }
  };

  const handleToggleArticleStatus = (articleId: string, currentStatus: ArticleStatus) => {
    const nextStatus: ArticleStatus = currentStatus === 'draft' ? 'published' : 'draft';
    dispatch(toggleArticleStatus({ id: articleId, status: nextStatus }));
  };

  const handleNavigateCreateArticle = (categoryId: string) => {
    setEditingArticle(null);
    setActiveCreateCategoryId(categoryId);
    setIsArticleSlideOverOpen(true);
  };

  const handleNavigateEditArticle = (articleId: string) => {
    const target = articles.find((a) => a.id === articleId);
    if (target) {
      setEditingArticle(target);
      setIsArticleSlideOverOpen(true);
    }
  };

  const handleSaveArticle = (payload: {
    categoryId: string;
    title: string;
    content: string;
    attachments: any[];
    status: 'draft' | 'published';
  }) => {
    if (editingArticle) {
      dispatch(
        updateArticle({
          id: editingArticle.id,
          title: payload.title,
          content: payload.content,
          categoryId: payload.categoryId,
          attachments: payload.attachments,
          status: payload.status,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: `Đã cập nhật bài viết "${payload.title}" thành công.`,
        })
      );
    } else {
      dispatch(
        createArticle({
          categoryId: payload.categoryId,
          title: payload.title,
          content: payload.content,
          status: payload.status,
          attachments: payload.attachments,
        })
      );
      dispatch(
        addToast({
          type: 'success',
          message: `Đã tạo bài viết "${payload.title}" thành công.`,
        })
      );
    }
  };

  return (
    <PortalLayout>
      <Head>
        <title>Sổ Tay Phụ Huynh | School Operating Portal</title>
      </Head>

      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Sổ Tay Phụ Huynh"
          description={`${categories.length} danh mục • ${articles.length} bài viết hướng dẫn, quy chế & cẩm nang học đường`}
        />

        {/* Main Toolbar */}
        <HandbookToolbar
          statusFilter={filterState.status}
          searchQuery={filterState.searchQuery}
          totalCategories={categories.length}
          totalArticles={articles.length}
          onStatusChange={(status) => dispatch(setFilterStatus(status))}
          onSearchChange={(query) => dispatch(setSearchQuery(query))}
          onOpenCreateCategoryModal={handleOpenCreateRootCategory}
          onOpenCreateArticle={() => {
            setEditingArticle(null);
            setActiveCreateCategoryId(undefined);
            setIsArticleSlideOverOpen(true);
          }}
        />

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 2-Tier Accordion Tree (5 cols on lg) */}
          <div className="lg:col-span-5">
            <HandbookAccordionTree
              tree={filteredTree}
              activeArticleId={activeArticleId}
              onSelectArticle={(id) => dispatch(setActiveArticleId(id))}
              onToggleAccordion={(id) => dispatch(toggleAccordion(id))}
              onOpenCreateCategoryModal={(parent) =>
                parent
                  ? handleOpenCreateSubCategory(parent)
                  : handleOpenCreateRootCategory()
              }
              onEditCategory={handleOpenEditCategory}
              onDeleteCategory={handleDeleteCategoryPrompt}
              onToggleArticleStatus={handleToggleArticleStatus}
              onDeleteArticle={handleDeleteArticlePrompt}
              onNavigateCreateArticle={handleNavigateCreateArticle}
              onNavigateEditArticle={handleNavigateEditArticle}
            />
          </div>

          {/* Right Column: Article Detail Reader (7 cols on lg) */}
          <div className="lg:col-span-7">
            <HandbookDetailPanel
              article={activeArticle}
              categories={categories}
              onNavigateEditArticle={handleNavigateEditArticle}
              onToggleStatus={handleToggleArticleStatus}
              onDeleteArticle={handleDeleteArticlePrompt}
            />
          </div>
        </div>
      </div>

      {/* Category Creation / Edit Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        parentCategory={parentCategoryForSub}
        categoryToEdit={categoryToEdit}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      {/* Cascading Category or Article Deletion Modal (ST-01 & ST-02) */}
      <HandbookDeleteModal
        isOpen={deleteModalState.isOpen}
        type={deleteModalState.type}
        targetTitle={deleteModalState.targetTitle}
        cascadingInfo={deleteModalState.cascadingInfo}
        onClose={() =>
          setDeleteModalState((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={handleConfirmDelete}
      />

      {/* Article Creation / Edit SlideOver (Right-Sheet Standard) */}
      <HandbookArticleSlideOver
        isOpen={isArticleSlideOverOpen}
        onClose={() => {
          setIsArticleSlideOverOpen(false);
          setEditingArticle(null);
          setActiveCreateCategoryId(undefined);
          if (router.query.create || router.query.edit) {
            router.replace(`/${currentSchoolCode}/school/handbook`, undefined, { shallow: true });
          }
        }}
        categories={categories}
        initialArticle={editingArticle}
        defaultCategoryId={activeCreateCategoryId}
        onSave={handleSaveArticle}
      />
    </PortalLayout>
  );
}
