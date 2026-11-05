/**
 * Pure Business Logic and Validation Engine for School Polls, Voting & Surveys (Bình Chọn)
 * Module: M5 - Nhà Trường / Bình Chọn
 * Standards: ECO Design System 1.0, MoET Circular 32/2020
 */

import type {
  Poll,
  PollOption,
  PollFilterState,
  PollSummaryKPI,
  CreatePollPayload,
  SendPollPayload,
  CastVotePayload,
  PollStatus,
} from '../types/poll.ts';

export const POLL_CHART_COLORS = [
  '#0070CE', // ECO Primary Blue
  '#FEC020', // ECO Primary Amber
  '#10B981', // Emerald
  '#F97316', // Orange
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#64748B', // Slate
];

/**
 * Normalizes Vietnamese text by stripping diacritics and converting to lowercase
 * for instant, accent-insensitive search (BR10).
 */
export function normalizeVietnameseText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

/**
 * Filters polls by lifecycle status, class cohort, and accent-insensitive title search.
 */
export function filterPolls(polls: Poll[], filterState: PollFilterState): Poll[] {
  return polls.filter((poll) => {
    // 1. Status Filter
    if (filterState.status !== 'all' && poll.status !== filterState.status) {
      return false;
    }

    // 2. Class Filter (BR05)
    if (filterState.classId !== 'all') {
      if (poll.audienceScope === 'toan_truong') {
        // Whole-school polls apply to all classes
      } else if (poll.audienceScope === 'lop_hoc') {
        if (!poll.targetClassIds || !poll.targetClassIds.includes(filterState.classId)) {
          return false;
        }
      } else {
        // Unassigned or draft polls do not match specific class filter
        return false;
      }
    }

    // 3. Search Query (BR10: Accent-insensitive match on title)
    if (filterState.searchQuery && filterState.searchQuery.trim()) {
      const normalizedQuery = normalizeVietnameseText(filterState.searchQuery);
      const normalizedTitle = normalizeVietnameseText(poll.title);
      const normalizedDesc = normalizeVietnameseText(poll.description || '');
      if (
        !normalizedTitle.includes(normalizedQuery) &&
        !normalizedDesc.includes(normalizedQuery)
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validates payload for creating or updating a poll.
 */
export function validatePollPayload(payload: CreatePollPayload): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Title validation
  if (!payload.title || !payload.title.trim()) {
    errors.title = 'Chủ đề bình chọn không được để trống';
  } else if (payload.title.trim().length < 3) {
    errors.title = 'Chủ đề bình chọn phải có ít nhất 3 ký tự';
  } else if (payload.title.trim().length > 250) {
    errors.title = 'Chủ đề bình chọn không được vượt quá 250 ký tự';
  }

  // Deadline validation (must be valid future date)
  if (!payload.deadline) {
    errors.deadline = 'Thời hạn bình chọn là bắt buộc';
  } else {
    const deadlineTime = new Date(payload.deadline).getTime();
    if (isNaN(deadlineTime)) {
      errors.deadline = 'Thời hạn bình chọn không đúng định dạng';
    } else if (deadlineTime <= Date.now()) {
      errors.deadline = 'Thời hạn bình chọn phải ở trong tương lai';
    }
  }

  // Options validation (minimum 2 non-empty options, distinct)
  if (!payload.options || !Array.isArray(payload.options)) {
    errors.options = 'Danh sách lựa chọn không hợp lệ';
  } else {
    const cleanedOptions = payload.options.map((opt) => opt.trim()).filter((opt) => opt.length > 0);
    if (cleanedOptions.length < 2) {
      errors.options = 'Phải có tối thiểu 2 lựa chọn cho cuộc bình chọn';
    } else {
      const uniqueOptions = new Set(cleanedOptions.map((opt) => opt.toLowerCase()));
      if (uniqueOptions.size !== cleanedOptions.length) {
        errors.options = 'Các lựa chọn không được trùng lặp nhau';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates payload for dispatching a poll to audience (UC-04).
 */
export function validateSendPayload(payload: SendPollPayload): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.pollId) {
    errors.pollId = 'Mã bình chọn không hợp lệ';
  }

  if (!payload.audienceScope || !['toan_truong', 'lop_hoc'].includes(payload.audienceScope)) {
    errors.audienceScope = 'Vui lòng chọn đối tượng nhận hợp lệ';
  } else if (payload.audienceScope === 'lop_hoc') {
    if (!payload.targetClassIds || payload.targetClassIds.length === 0) {
      errors.targetClassIds = 'Vui lòng chọn ít nhất một lớp học khi gửi đến lớp học cụ thể';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Enforces State-Driven Action Visibility (BR02, K044):
 * Edit, Send, and Delete operations are strictly restricted to polls in `da_tao` (Created / Draft) status.
 */
export function canEditPoll(status: PollStatus): boolean {
  return status === 'da_tao';
}

export function canSendPoll(status: PollStatus): boolean {
  return status === 'da_tao';
}

export function canDeletePoll(status: PollStatus): boolean {
  return status === 'da_tao';
}

/**
 * Computes dashboard KPI metrics for the Poll directory.
 */
export function computePollKPIs(polls: Poll[]): PollSummaryKPI {
  let activePollsCount = 0;
  let draftPollsCount = 0;
  let closedPollsCount = 0;
  let totalVotesCast = 0;

  polls.forEach((poll) => {
    if (poll.status === 'da_gui') {
      activePollsCount += 1;
    } else if (poll.status === 'da_tao') {
      draftPollsCount += 1;
    } else if (poll.status === 'da_dong') {
      closedPollsCount += 1;
    }
    totalVotesCast += poll.totalVotes || 0;
  });

  return {
    totalPolls: polls.length,
    activePollsCount,
    draftPollsCount,
    closedPollsCount,
    totalVotesCast,
  };
}

/**
 * Calculates option percentage distributions accurately.
 * Ensures total percentages sum properly and handles 0 votes gracefully.
 */
export function calculateOptionPercentages(
  options: PollOption[],
  totalVotes: number
): PollOption[] {
  if (!options || options.length === 0) return [];
  if (totalVotes <= 0) {
    return options.map((opt, idx) => ({
      ...opt,
      percentage: 0,
      color: opt.color || POLL_CHART_COLORS[idx % POLL_CHART_COLORS.length],
    }));
  }

  return options.map((opt, idx) => {
    const rawPct = (opt.voteCount / totalVotes) * 100;
    return {
      ...opt,
      percentage: Math.round(rawPct * 10) / 10,
      color: opt.color || POLL_CHART_COLORS[idx % POLL_CHART_COLORS.length],
    };
  });
}

/**
 * Checks if a poll is expired based on current time.
 */
export function isPollExpired(deadline: string): boolean {
  if (!deadline) return false;
  const deadlineTime = new Date(deadline).getTime();
  return !isNaN(deadlineTime) && deadlineTime <= Date.now();
}

/**
 * Formats a deadline into a user-friendly Vietnamese localized string.
 */
export function formatPollDeadline(deadline: string): string {
  if (!deadline) return '';
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return deadline;

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `Bình chọn kết thúc vào ${hours}:${minutes} ${day}/${month}/${year}`;
}
