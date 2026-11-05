/**
 * Redux Slice for School Parent Handbook (Sổ Tay PH)
 * Module: M5 - Nhà Trường / Sổ Tay PH
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  HandbookCategory,
  HandbookArticle,
  HandbookFilterState,
  ArticleStatus,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateArticlePayload,
  UpdateArticlePayload,
  ToggleArticleStatusPayload,
} from '../../types/parentHandbook.ts';
import {
  INITIAL_HANDBOOK_CATEGORIES,
  INITIAL_HANDBOOK_ARTICLES,
} from '../../services/mockParentHandbookData.ts';
import {
  toggleAccordionState,
  getCascadingDeleteTargets,
  reorderSiblings,
  validateCategory,
} from '../../utils/parentHandbookValidation.ts';

export interface ParentHandbookState {
  categories: HandbookCategory[];
  articles: HandbookArticle[];
  expandedCategoryIds: string[];
  activeArticleId: string | null;
  filterState: HandbookFilterState;
  loading: boolean;
  error: string | null;
}

const initialState: ParentHandbookState = {
  categories: INITIAL_HANDBOOK_CATEGORIES,
  articles: INITIAL_HANDBOOK_ARTICLES,
  expandedCategoryIds: ['cat-01', 'cat-01-01'],
  activeArticleId: 'art-01',
  filterState: {
    status: 'all',
    searchQuery: '',
  },
  loading: false,
  error: null,
};

export const parentHandbookSlice = createSlice({
  name: 'parentHandbook',
  initialState,
  reducers: {
    createCategory: (state, action: PayloadAction<CreateCategoryPayload>) => {
      const { name, note, parentCategoryId } = action.payload;

      // Validate 2-tier depth
      const validation = validateCategory(action.payload, state.categories);
      if (!validation.isValid) {
        state.error = validation.error || 'Dữ liệu không hợp lệ.';
        return;
      }

      const siblings = state.categories.filter(
        (c) => (c.parentCategoryId || null) === (parentCategoryId || null)
      );
      const nextDisplayOrder = siblings.length > 0
        ? Math.max(...siblings.map((s) => s.displayOrder)) + 1
        : 0;

      const newCategory: HandbookCategory = {
        id: `cat-${Date.now()}`,
        schoolCode: 'demo',
        name: name.trim(),
        note: note ? note.trim() : undefined,
        parentCategoryId: parentCategoryId || null,
        displayOrder: nextDisplayOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.categories.push(newCategory);
      state.error = null;

      // Auto-expand parent and newly created sub-category
      if (parentCategoryId) {
        if (!state.expandedCategoryIds.includes(parentCategoryId)) {
          state.expandedCategoryIds.push(parentCategoryId);
        }
      }
    },

    updateCategory: (state, action: PayloadAction<UpdateCategoryPayload>) => {
      const { id, name, note } = action.payload;
      const index = state.categories.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.categories[index] = {
          ...state.categories[index],
          name: name.trim(),
          note: note ? note.trim() : undefined,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    deleteCategoryCascade: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const targets = getCascadingDeleteTargets(
        state.categories,
        state.articles,
        categoryId
      );

      const categoryIdSet = new Set(targets.categoryIdsToDelete);
      const articleIdSet = new Set(targets.articleIdsToDelete);

      // Remove categories
      state.categories = state.categories.filter((c) => !categoryIdSet.has(c.id));
      // Remove nested articles
      state.articles = state.articles.filter((a) => !articleIdSet.has(a.id));
      // Clean up expanded IDs
      state.expandedCategoryIds = state.expandedCategoryIds.filter(
        (id) => !categoryIdSet.has(id)
      );

      // Reset active article if it was deleted
      if (state.activeArticleId && articleIdSet.has(state.activeArticleId)) {
        const remainingArticles = state.articles;
        state.activeArticleId = remainingArticles.length > 0 ? remainingArticles[0].id : null;
      }
    },

    createArticle: (state, action: PayloadAction<CreateArticlePayload>) => {
      const { title, content, categoryId, status, attachments } = action.payload;
      const categoryArticles = state.articles.filter((a) => a.categoryId === categoryId);
      const nextDisplayOrder = categoryArticles.length > 0
        ? Math.max(...categoryArticles.map((a) => a.displayOrder)) + 1
        : 0;

      const now = new Date().toISOString();
      const newArticle: HandbookArticle = {
        id: `art-${Date.now()}`,
        schoolCode: 'demo',
        title: title.trim(),
        content: content.trim(),
        categoryId,
        status,
        attachments: attachments || [],
        displayOrder: nextDisplayOrder,
        authorName: 'Ban Giám Hiệu',
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : undefined,
      };

      state.articles.push(newArticle);
      state.activeArticleId = newArticle.id;

      // Ensure the category containing this article is expanded
      if (!state.expandedCategoryIds.includes(categoryId)) {
        state.expandedCategoryIds.push(categoryId);
      }
      // If it's a sub-category, also ensure root is expanded
      const cat = state.categories.find((c) => c.id === categoryId);
      if (cat && cat.parentCategoryId && !state.expandedCategoryIds.includes(cat.parentCategoryId)) {
        state.expandedCategoryIds.push(cat.parentCategoryId);
      }
    },

    updateArticle: (state, action: PayloadAction<UpdateArticlePayload>) => {
      const { id, title, content, categoryId, status, attachments } = action.payload;
      const index = state.articles.findIndex((a) => a.id === id);
      if (index !== -1) {
        const current = state.articles[index];
        const isBecomingPublished = current.status === 'draft' && status === 'published';
        state.articles[index] = {
          ...current,
          title: title.trim(),
          content: content.trim(),
          categoryId,
          status,
          attachments: attachments || [],
          updatedAt: new Date().toISOString(),
          publishedAt: isBecomingPublished ? new Date().toISOString() : current.publishedAt,
        };
      }
    },

    toggleArticleStatus: (state, action: PayloadAction<ToggleArticleStatusPayload>) => {
      const { id, status } = action.payload;
      const index = state.articles.findIndex((a) => a.id === id);
      if (index !== -1) {
        const current = state.articles[index];
        const now = new Date().toISOString();
        state.articles[index] = {
          ...current,
          status,
          updatedAt: now,
          publishedAt: status === 'published' ? (current.publishedAt || now) : undefined,
        };
      }
    },

    deleteArticle: (state, action: PayloadAction<string>) => {
      const articleId = action.payload;
      state.articles = state.articles.filter((a) => a.id !== articleId);

      if (state.activeArticleId === articleId) {
        const remaining = state.articles;
        state.activeArticleId = remaining.length > 0 ? remaining[0].id : null;
      }
    },

    toggleAccordion: (state, action: PayloadAction<string>) => {
      const targetCategoryId = action.payload;
      state.expandedCategoryIds = toggleAccordionState(
        state.expandedCategoryIds,
        targetCategoryId,
        state.categories
      );
    },

    setActiveArticleId: (state, action: PayloadAction<string | null>) => {
      state.activeArticleId = action.payload;
    },

    setFilterStatus: (state, action: PayloadAction<'all' | ArticleStatus>) => {
      state.filterState.status = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filterState.searchQuery = action.payload;
    },

    resetHandbookFilters: (state) => {
      state.filterState.status = 'all';
      state.filterState.searchQuery = '';
    },

    reorderCategories: (
      state,
      action: PayloadAction<{ parentCategoryId: string | null; orderedIds: string[] }>
    ) => {
      const { parentCategoryId, orderedIds } = action.payload;
      const targetSiblings = state.categories.filter(
        (c) => (c.parentCategoryId || null) === (parentCategoryId || null)
      );
      const reordered = reorderSiblings(targetSiblings, orderedIds);

      // Merge reordered back
      const reorderedMap = new Map(reordered.map((r) => [r.id, r]));
      state.categories = state.categories.map((c) => reorderedMap.get(c.id) || c);
    },

    reorderArticles: (
      state,
      action: PayloadAction<{ categoryId: string; orderedIds: string[] }>
    ) => {
      const { categoryId, orderedIds } = action.payload;
      const targetArticles = state.articles.filter((a) => a.categoryId === categoryId);
      const reordered = reorderSiblings(targetArticles, orderedIds);

      const reorderedMap = new Map(reordered.map((r) => [r.id, r]));
      state.articles = state.articles.map((a) => reorderedMap.get(a.id) || a);
    },
  },
});

export const {
  createCategory,
  updateCategory,
  deleteCategoryCascade,
  createArticle,
  updateArticle,
  toggleArticleStatus,
  deleteArticle,
  toggleAccordion,
  setActiveArticleId,
  setFilterStatus,
  setSearchQuery,
  resetHandbookFilters,
  reorderCategories,
  reorderArticles,
} = parentHandbookSlice.actions;

export default parentHandbookSlice.reducer;
