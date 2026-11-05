/**
 * Domain Data Contracts for School Parent Handbook (Sổ Tay PH)
 * Module: M5 - Nhà Trường / Sổ Tay PH
 * Standards: MoET Circular 32/2018/TT-BGDĐT, Decree 13/2023/NĐ-CP, ECO Design System 1.0
 */

export type ArticleStatus = 'draft' | 'published';

export interface HandbookFileAttachment {
  id: string;
  name: string;
  url: string;
  size: string; // e.g. "2.4 MB"
  mimeType?: string;
}

export interface HandbookCategory {
  id: string;
  schoolCode: string;
  name: string; // Mandatory title of category (Tên danh mục)
  note?: string; // Optional description (Ghi chú)
  parentCategoryId?: string | null; // null for root category, string id for sub-category (BR01)
  displayOrder: number; // Order index within sibling list
  createdAt: string;
  updatedAt: string;
}

export interface HandbookArticle {
  id: string;
  schoolCode: string;
  title: string; // Mandatory title (Tiêu đề bài viết)
  content: string; // Rich text HTML content (Nội dung)
  categoryId: string; // Target category ID (root or sub-category) (BR07)
  status: ArticleStatus; // "draft" (Bản nháp) or "published" (Đã phát hành) (BR05)
  attachments?: HandbookFileAttachment[]; // Optional uploaded files (BR06)
  displayOrder: number; // Order index within parent category
  authorName: string; // Admin / editor who authored
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface HandbookCategoryNode extends HandbookCategory {
  subCategories: HandbookCategoryNode[];
  articles: HandbookArticle[];
  isExpanded?: boolean;
}

export interface HandbookFilterState {
  status: 'all' | ArticleStatus; // Filter by article status: "Tất cả", "draft", "published" (BR10)
  searchQuery: string; // Matches article titles only (case & accent insensitive) (BR10)
}

export interface CreateCategoryPayload {
  name: string;
  note?: string;
  parentCategoryId?: string | null; // null for root, string for sub-category
}

export interface UpdateCategoryPayload {
  id: string;
  name: string;
  note?: string;
}

export interface DeleteCategoryPayload {
  id: string;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
  categoryId: string;
  status: ArticleStatus;
  attachments?: HandbookFileAttachment[];
}

export interface UpdateArticlePayload {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  status: ArticleStatus;
  attachments?: HandbookFileAttachment[];
}

export interface ToggleArticleStatusPayload {
  id: string;
  status: ArticleStatus; // "published" -> "draft" (Ẩn bài viết) or "draft" -> "published" (Xuất bản) (BR05, BR12)
}

export interface DeleteArticlePayload {
  id: string;
}

export interface ReorderItemsPayload {
  parentId: string; // Parent category ID (or "root" for top level)
  itemType: 'category' | 'article'; // Only sub-categories and articles can be reordered (BR04)
  orderedIds: string[]; // Ordered list of item IDs
}
