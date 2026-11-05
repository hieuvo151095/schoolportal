/**
 * Pure Validation Engine and Tree Algorithms for School Parent Handbook (Sổ Tay PH)
 * Module: M5 - Nhà Trường / Sổ Tay PH
 * Standards: VR-HNB-01 through VR-HNB-05, BR01 through BR12
 */

import type {
  HandbookCategory,
  HandbookArticle,
  HandbookCategoryNode,
  ArticleStatus,
} from '../types/parentHandbook.ts';

/**
 * Normalizes text by removing Vietnamese diacritics and converting to lowercase for search
 */
export function normalizeSearchText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Validates category creation or update data (VR-HNB-01, VR-HNB-03)
 * Enforces 2-tier depth limit: parent category cannot be a sub-category!
 */
export function validateCategory(
  data: Partial<HandbookCategory>,
  existingCategories: HandbookCategory[] = []
): { isValid: boolean; error?: string } {
  const name = (data.name || '').trim();
  if (!name || name.length < 2) {
    return {
      isValid: false,
      error: 'Tên danh mục không được để trống và phải có ít nhất 2 ký tự.',
    };
  }

  if (data.parentCategoryId) {
    const parent = existingCategories.find((c) => c.id === data.parentCategoryId);
    if (!parent) {
      return {
        isValid: false,
        error: 'Danh mục cha không tồn tại trong hệ thống.',
      };
    }
    // BR01 / VR-HNB-01: A parent category must be a root category (parentCategoryId === null)
    if (parent.parentCategoryId) {
      return {
        isValid: false,
        error: 'Giới hạn phân cấp tối đa 2 cấp. Không thể tạo danh mục con bên trong một danh mục con.',
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates article creation or update data (VR-HNB-04)
 */
export function validateArticle(
  data: Partial<HandbookArticle>,
  existingCategories: HandbookCategory[] = []
): { isValid: boolean; error?: string } {
  const title = (data.title || '').trim();
  if (!title || title.length < 3) {
    return {
      isValid: false,
      error: 'Tiêu đề bài viết không được để trống và phải có ít nhất 3 ký tự.',
    };
  }

  const content = (data.content || '').trim();
  if (!content) {
    return {
      isValid: false,
      error: 'Nội dung bài viết không được để trống.',
    };
  }

  if (!data.categoryId) {
    return {
      isValid: false,
      error: 'Vui lòng chọn danh mục cho bài viết.',
    };
  }

  if (existingCategories.length > 0) {
    const categoryExists = existingCategories.some((c) => c.id === data.categoryId);
    if (!categoryExists) {
      return {
        isValid: false,
        error: 'Danh mục được chọn không tồn tại.',
      };
    }
  }

  return { isValid: true };
}

/**
 * Builds a 2-tier Category Tree from flat lists of categories and articles (BR01)
 */
export function buildCategoryTree(
  categories: HandbookCategory[],
  articles: HandbookArticle[],
  expandedIds: Set<string> = new Set()
): HandbookCategoryNode[] {
  // Sort root categories by displayOrder
  const rootCategories = categories
    .filter((c) => !c.parentCategoryId)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return rootCategories.map((root) => {
    // Find sub-categories under this root category
    const subCategories = categories
      .filter((c) => c.parentCategoryId === root.id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((sub) => {
        const subArticles = articles
          .filter((a) => a.categoryId === sub.id)
          .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
          ...sub,
          subCategories: [], // Sub-categories cannot have deeper sub-categories (BR01)
          articles: subArticles,
          isExpanded: expandedIds.has(sub.id),
        };
      });

    // Find direct articles under this root category
    const rootArticles = articles
      .filter((a) => a.categoryId === root.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
      ...root,
      subCategories,
      articles: rootArticles,
      isExpanded: expandedIds.has(root.id),
    };
  });
}

/**
 * Single-Active Accordion State Machine (BR02, VR-HNB-02)
 * When expanding a category, any other expanded sibling with the same parentCategoryId collapses.
 */
export function toggleAccordionState(
  currentExpandedIds: string[],
  targetCategoryId: string,
  categories: HandbookCategory[]
): string[] {
  const targetCategory = categories.find((c) => c.id === targetCategoryId);
  if (!targetCategory) return currentExpandedIds;

  const isCurrentlyExpanded = currentExpandedIds.includes(targetCategoryId);

  if (isCurrentlyExpanded) {
    // Simply collapse this category
    return currentExpandedIds.filter((id) => id !== targetCategoryId);
  }

  // Find all sibling category IDs (categories sharing the exact same parentCategoryId)
  const targetParentId = targetCategory.parentCategoryId || null;
  const siblingIds = new Set(
    categories
      .filter((c) => (c.parentCategoryId || null) === targetParentId)
      .map((c) => c.id)
  );

  // Remove any expanded siblings from the state
  const withoutSiblings = currentExpandedIds.filter((id) => !siblingIds.has(id));

  // Add the newly expanded target category
  return [...withoutSiblings, targetCategoryId];
}

/**
 * Article-Centric Search and Status Pruning Engine (BR10, K051)
 * Search query matches article titles exclusively (case & accent insensitive).
 * Status filter filters articles by 'all' | 'draft' | 'published'.
 * Prunes any category branches that contain zero matching articles.
 * Auto-expands ancestor categories for matching articles.
 */
export function filterTreeByArticleCriteria(
  tree: HandbookCategoryNode[],
  searchQuery: string,
  statusFilter: 'all' | ArticleStatus
): { filteredTree: HandbookCategoryNode[]; autoExpandedIds: string[] } {
  const normalizedQuery = normalizeSearchText(searchQuery);
  const autoExpandedSet = new Set<string>();

  const matchesArticle = (article: HandbookArticle): boolean => {
    if (statusFilter !== 'all' && article.status !== statusFilter) {
      return false;
    }
    if (!normalizedQuery) return true;
    return normalizeSearchText(article.title).includes(normalizedQuery);
  };

  const filteredTree: HandbookCategoryNode[] = [];

  for (const root of tree) {
    // 1. Direct articles of root
    const matchingRootArticles = root.articles.filter(matchesArticle);

    // 2. Filter sub-categories
    const matchingSubCategories: HandbookCategoryNode[] = [];
    for (const sub of root.subCategories) {
      const matchingSubArticles = sub.articles.filter(matchesArticle);
      if (matchingSubArticles.length > 0) {
        matchingSubCategories.push({
          ...sub,
          articles: matchingSubArticles,
          isExpanded: true, // Auto-expand matching sub-category
        });
        autoExpandedSet.add(sub.id);
      }
    }

    // If root has matching direct articles or at least one matching sub-category, keep root!
    if (matchingRootArticles.length > 0 || matchingSubCategories.length > 0) {
      filteredTree.push({
        ...root,
        articles: matchingRootArticles,
        subCategories: matchingSubCategories,
        isExpanded: true, // Auto-expand matching root category
      });
      autoExpandedSet.add(root.id);
    }
  }

  return {
    filteredTree,
    autoExpandedIds: Array.from(autoExpandedSet),
  };
}

/**
 * Resolves cascading deletion targets for a category (BR09, VR-HNB-05)
 * Returns all child sub-category IDs and nested article IDs to delete.
 */
export function getCascadingDeleteTargets(
  categories: HandbookCategory[],
  articles: HandbookArticle[],
  targetCategoryId: string
): {
  categoryIdsToDelete: string[];
  articleIdsToDelete: string[];
  targetCategoryName: string;
  totalSubCategories: number;
  totalArticles: number;
} {
  const targetCategory = categories.find((c) => c.id === targetCategoryId);
  const targetName = targetCategory ? targetCategory.name : '';

  // Find direct child sub-categories
  const childCategories = categories.filter((c) => c.parentCategoryId === targetCategoryId);
  const childCategoryIds = childCategories.map((c) => c.id);

  const allCategoryIdsToDelete = [targetCategoryId, ...childCategoryIds];
  const categoryIdSet = new Set(allCategoryIdsToDelete);

  // Find all articles residing in any of these categories
  const targetArticles = articles.filter((a) => categoryIdSet.has(a.categoryId));
  const articleIdsToDelete = targetArticles.map((a) => a.id);

  return {
    categoryIdsToDelete: allCategoryIdsToDelete,
    articleIdsToDelete,
    targetCategoryName: targetName,
    totalSubCategories: childCategories.length,
    totalArticles: articleIdsToDelete.length,
  };
}

/**
 * Reorders siblings by updating displayOrder (BR04, K053)
 */
export function reorderSiblings<T extends { id: string; displayOrder: number }>(
  items: T[],
  orderedIds: string[]
): T[] {
  const orderMap = new Map<string, number>();
  orderedIds.forEach((id, index) => {
    orderMap.set(id, index);
  });

  return items.map((item) => {
    if (orderMap.has(item.id)) {
      return {
        ...item,
        displayOrder: orderMap.get(item.id)!,
      };
    }
    return item;
  });
}
