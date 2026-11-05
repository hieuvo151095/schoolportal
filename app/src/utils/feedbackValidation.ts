/**
 * School Parent Feedback Pure Validation and Business Rules Engine
 * Governed by Marcus Fleet V34 & Decisions K054-K058
 */

import type {
  FeedbackItem,
  FeedbackStatus,
  FeedbackPriority,
  FeedbackType,
  FeedbackWaitingFor,
  FeedbackSummaryKPI,
  FeedbackFilterState,
} from '../types/feedback.ts';

export const FEEDBACK_CATEGORY_MAP: Record<FeedbackType, string> = {
  content: 'Góp ý về nội dung',
  presentation: 'Hình thức/trình bày',
  performance: 'Hiệu suất/chất lượng',
  skill: 'Kỹ năng',
  attitude: 'Thái độ/hành vi',
  process: 'Quy trình',
  experience: 'Trải nghiệm người dùng',
  strategic: 'Mang tính chiến lược',
};

export const FEEDBACK_PRIORITY_MAP: Record<
  FeedbackPriority,
  { label: string; badgeColor: string; textColor: string; dotColor: string }
> = {
  low: {
    label: 'Thấp',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    textColor: 'text-blue-700',
    dotColor: '#3B82F6',
  },
  medium: {
    label: 'Trung bình',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textColor: 'text-emerald-700',
    dotColor: '#10B981',
  },
  high: {
    label: 'Cao',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    textColor: 'text-amber-700',
    dotColor: '#F59E0B',
  },
  urgent: {
    label: 'Khẩn cấp',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    textColor: 'text-red-700',
    dotColor: '#EF4444',
  },
};

export const FEEDBACK_STATUS_MAP: Record<
  FeedbackStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: string }
> = {
  new: {
    label: 'Yêu cầu mới',
    color: '#0070CE',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    icon: 'plus',
  },
  processing: {
    label: 'Đang xử lý',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    icon: 'spinner',
  },
  completed: {
    label: 'Hoàn tất',
    color: '#10B981',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    icon: 'check',
  },
  reopened: {
    label: 'Mở lại',
    color: '#F59E0B',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    icon: 'rotate-left',
  },
};

/**
 * Computes global KPI summary counts scoped strictly by school year (BR02, K055).
 * Card counts remain stable and independent of table filter criteria.
 */
export function computeFeedbackKPIs(
  items: FeedbackItem[],
  schoolYear?: string
): FeedbackSummaryKPI {
  const scopedItems = schoolYear
    ? items.filter((item) => item.schoolYear === schoolYear)
    : items;

  let newCount = 0;
  let processingCount = 0;
  let completedCount = 0;
  let reopenedCount = 0;

  for (const item of scopedItems) {
    switch (item.status) {
      case 'new':
        newCount++;
        break;
      case 'processing':
        processingCount++;
        break;
      case 'completed':
        completedCount++;
        break;
      case 'reopened':
        reopenedCount++;
        break;
    }
  }

  return {
    newCount,
    processingCount,
    completedCount,
    reopenedCount,
    totalCount: scopedItems.length,
  };
}

/**
 * Multi-factor filtering engine across school year, status, category, priority,
 * assignee, waiting-on side, date interval, and search keywords (BR02, BR03, BR05).
 */
export function filterFeedbackItems(
  items: FeedbackItem[],
  filters: FeedbackFilterState
): FeedbackItem[] {
  return items.filter((item) => {
    // School Year Filter
    if (filters.schoolYear && item.schoolYear !== filters.schoolYear) {
      return false;
    }

    // Status Filter (includes card filter)
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }

    // Category Filter (8 fixed categories)
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }

    // Priority Filter
    if (filters.priority !== 'all' && item.priority !== filters.priority) {
      return false;
    }

    // Assignee Filter
    if (filters.assigneeId !== 'all') {
      if (filters.assigneeId === 'unassigned') {
        if (item.assigneeId) return false;
      } else if (item.assigneeId !== filters.assigneeId) {
        return false;
      }
    }

    // Waiting-For Turn-Taking Filter
    if (filters.waitingFor !== 'all' && item.waitingFor !== filters.waitingFor) {
      return false;
    }

    // Date Interval Filter
    if (filters.dateFrom) {
      const itemDate = new Date(item.createdAt).getTime();
      const fromDate = new Date(filters.dateFrom).getTime();
      if (itemDate < fromDate) return false;
    }
    if (filters.dateTo) {
      const itemDate = new Date(item.createdAt).getTime();
      // Include the entire end date until 23:59:59.999
      const toDate = new Date(`${filters.dateTo}T23:59:59.999Z`).getTime();
      if (itemDate > toDate) return false;
    }

    // Search Query (accent-insensitive search across code, title, student, class, parent)
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const normalizedQuery = normalizeVietnameseText(filters.searchQuery);
      const searchableFields = [
        item.code,
        item.title,
        item.studentName,
        item.studentClass,
        item.parentName,
        item.categoryLabel,
      ];

      const matches = searchableFields.some((field) =>
        normalizeVietnameseText(field || '').includes(normalizedQuery)
      );

      if (!matches) return false;
    }

    return true;
  });
}

/**
 * Validates discussion comment submission (BR06, UC-04).
 * Submit button is disabled if comment is empty or contains only whitespace.
 */
export function validateCommentSubmission(content: string): {
  isValid: boolean;
  error?: string;
} {
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      error: 'Nội dung phản hồi không được để trống.',
    };
  }

  if (content.trim().length > 5000) {
    return {
      isValid: false,
      error: 'Nội dung phản hồi không được vượt quá 5,000 ký tự.',
    };
  }

  return { isValid: true };
}

/**
 * Validates whether a feedback item can be closed (BR07).
 */
export function validateClosureEligibility(item: FeedbackItem): {
  canClose: boolean;
  reason?: string;
} {
  if (item.status === 'completed') {
    return {
      canClose: false,
      reason: 'Góp ý này đã ở trạng thái Hoàn tất.',
    };
  }
  return { canClose: true };
}

/**
 * Reactive Turn-Taking State Machine Calculator (BR05, K057).
 * - School staff replies: sets waitingFor = 'parent', maintains or advances 'processing'.
 * - Parent replies: sets waitingFor = 'school'; if 'completed', automatically reopens to 'reopened'.
 */
export function getNextTurnTakingStatus(
  currentWaitingFor: FeedbackWaitingFor,
  authorRole: 'admin' | 'teacher' | 'parent',
  currentStatus: FeedbackStatus
): { waitingFor: FeedbackWaitingFor; nextStatus: FeedbackStatus } {
  if (authorRole === 'parent') {
    // Parent replies
    const nextStatus = currentStatus === 'completed' ? 'reopened' : currentStatus === 'new' ? 'processing' : currentStatus;
    return {
      waitingFor: 'school',
      nextStatus,
    };
  } else {
    // School staff (admin/teacher) replies
    const nextStatus = currentStatus === 'new' ? 'processing' : currentStatus;
    return {
      waitingFor: 'parent',
      nextStatus,
    };
  }
}

/**
 * Formats empty or unpopulated profile attributes with standard fallback text (BR08).
 * Missing fields render `"Chưa có {fieldName}"`.
 */
export function formatFallbackField(
  value?: string | null,
  fieldName: string = 'thông tin'
): string {
  if (!value || value.trim().length === 0) {
    return `Chưa có ${fieldName}`;
  }
  return value.trim();
}

/**
 * Strips Vietnamese accents for tolerant search matching.
 */
export function normalizeVietnameseText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}
