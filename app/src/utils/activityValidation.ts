import type { ActivityPost, ModerationStatus } from '../types/activity.ts';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * BR02: Post Content Validation Rule
 * A post must contain either non-empty text or at least one attached media/photo.
 */
export function validatePostContent(content: string, mediaCount: number): ValidationResult {
  const trimmed = (content || '').trim();
  if (trimmed.length === 0 && mediaCount <= 0) {
    return {
      valid: false,
      error: 'Nội dung hoạt động không được để trống',
    };
  }
  return { valid: true };
}

/**
 * BR07: Pinned Post Sorting Rule
 * Pinned posts (isPinned: true) float to the top of the feed,
 * followed by remaining posts sorted by creation date descending.
 */
export function sortActivityPosts(posts: ActivityPost[]): ActivityPost[] {
  return [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Both are pinned or both are unpinned, sort by createdAt descending
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });
}

/**
 * BR09: Activity Filtering Logic
 * Filters posts by class context, approval status, and search keywords.
 */
export function filterActivityPosts(
  posts: ActivityPost[],
  classId: string,
  statusFilter: 'all' | ModerationStatus = 'all',
  query: string = ''
): ActivityPost[] {
  const normalizedQuery = (query || '').trim().toLowerCase();

  const filtered = posts.filter((post) => {
    // Check class filter: matches classId or broadcasted to whole school
    const matchesClass = post.classId === classId || post.audienceScope === 'whole_school';
    if (!matchesClass) return false;

    // Check moderation status filter:
    // In general feed ("all"), unapproved / waiting for approval posts are excluded.
    // They are only displayed under the "Cho duyệt" tab.
    if (statusFilter === 'all') {
      if (post.status === 'cho_duyet') {
        return false;
      }
    } else if (post.status !== statusFilter) {
      return false;
    }

    // Check search query (matches content or authorName)
    if (normalizedQuery) {
      const contentMatch = (post.content || '').toLowerCase().includes(normalizedQuery);
      const authorMatch = (post.authorName || '').toLowerCase().includes(normalizedQuery);
      if (!contentMatch && !authorMatch) {
        return false;
      }
    }

    return true;
  });

  return sortActivityPosts(filtered);
}
