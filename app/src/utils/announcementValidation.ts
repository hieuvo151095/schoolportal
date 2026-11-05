/**
 * Domain validation engine and business rules for School Announcement Board
 * Module M5 / Feature 039-school-announcement-board-bang-thong-tin
 */

import type {
  Announcement,
  AnnouncementCategory,
  AnnouncementChannel,
  AnnouncementPriority,
  AnnouncementStatus,
  AnnouncementAudienceScope,
  AnnouncementSubAudience,
  AnnouncementSummaryKPI,
  AnnouncementFilterState,
  AnnouncementRecipientBreakdown
} from '../types/announcement.ts';

export const MAX_ATTACHMENT_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

/**
 * Removes Vietnamese diacritics for accent-insensitive search matching (BR05)
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

/**
 * Filters announcements matching query in title, excerpt, or authorName (BR05)
 */
export function searchAnnouncements(announcements: Announcement[], query: string): Announcement[] {
  if (!query || !query.trim()) return announcements;
  const normalizedQuery = normalizeVietnameseText(query);
  return announcements.filter(item => {
    const titleNorm = normalizeVietnameseText(item.title);
    const excerptNorm = normalizeVietnameseText(item.excerpt);
    const authorNorm = normalizeVietnameseText(item.authorName);
    return (
      titleNorm.includes(normalizedQuery) ||
      excerptNorm.includes(normalizedQuery) ||
      authorNorm.includes(normalizedQuery)
    );
  });
}

/**
 * Filters announcements by status, category, channel, and search query (BR01, BR05)
 * Pinned items float to the top, followed by date descending.
 */
export function filterAnnouncements(
  announcements: Announcement[],
  filters: AnnouncementFilterState
): Announcement[] {
  let result = [...announcements];

  // Status filter
  if (filters.statusFilter && filters.statusFilter !== 'all') {
    result = result.filter(item => item.status === filters.statusFilter);
  }

  // Category filter
  if (filters.categoryFilter && filters.categoryFilter !== 'all') {
    result = result.filter(item => item.category === filters.categoryFilter);
  }

  // Channel filter
  if (filters.channelFilter && filters.channelFilter !== 'all') {
    result = result.filter(item => item.channels.includes(filters.channelFilter as AnnouncementChannel));
  }

  // Keyword search
  if (filters.searchQuery && filters.searchQuery.trim()) {
    result = searchAnnouncements(result, filters.searchQuery);
  }

  // Sort: pinned first, then updated/published date descending
  return result.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return dateB - dateA;
  });
}

/**
 * Calculates 4 top summary metric KPI cards (BR04)
 */
export function calculateAnnouncementKPIs(announcements: Announcement[]): AnnouncementSummaryKPI {
  return {
    totalAnnouncements: announcements.length,
    publishedCount: announcements.filter(a => a.status === 'da_gui').length,
    scheduledCount: announcements.filter(a => a.status === 'da_len_lich').length,
    draftCount: announcements.filter(a => a.status === 'nhap').length
  };
}

/**
 * Validates at least one delivery channel is selected (VR-ANN-01)
 */
export function validateChannels(channels: AnnouncementChannel[]): { valid: boolean; error?: string } {
  if (!channels || channels.length === 0) {
    return {
      valid: false,
      error: 'Vui lòng chọn ít nhất một kênh gửi thông báo (Bảng tin, Email, SMS hoặc Mobile Push)'
    };
  }
  return { valid: true };
}

/**
 * Validates audience scope targeting (VR-ANN-02)
 */
export function validateAudienceTargets(
  scope: AnnouncementAudienceScope,
  targetGradeIds: string[],
  targetClassIds: string[]
): { valid: boolean; error?: string } {
  if (scope === 'khoi_lop' && (!targetGradeIds || targetGradeIds.length === 0)) {
    return {
      valid: false,
      error: 'Vui lòng chọn ít nhất một khối lớp nhận thông báo'
    };
  }
  if (scope === 'lop_hoc' && (!targetClassIds || targetClassIds.length === 0)) {
    return {
      valid: false,
      error: 'Vui lòng chọn ít nhất một lớp học nhận thông báo'
    };
  }
  return { valid: true };
}

/**
 * Strict Draft-Only Mutability Guardrail (VR-ANN-04, BR02, K038)
 * Published announcements (status: 'da_gui') cannot be modified once sent.
 */
export function validateDraftMutability(announcement: Announcement): { valid: boolean; error?: string } {
  if (announcement.status === 'da_gui') {
    return {
      valid: false,
      error: 'Không thể chỉnh sửa thông báo đã phát hành. Vui lòng phát hành thông báo đính chính hoặc xóa thông báo cũ.'
    };
  }
  return { valid: true };
}

/**
 * Validates future scheduled date and time (VR-ANN-06, BR07)
 */
export function validateScheduleTime(scheduledAt?: string): { valid: boolean; error?: string } {
  if (!scheduledAt) {
    return {
      valid: false,
      error: 'Vui lòng chọn thời gian phát hành trong tương lai'
    };
  }
  const scheduleTime = new Date(scheduledAt).getTime();
  const now = Date.now();
  if (scheduleTime <= now) {
    return {
      valid: false,
      error: 'Thời gian lên lịch gửi phải lớn hơn thời điểm hiện tại'
    };
  }
  return { valid: true };
}

/**
 * Validates file attachment size and format (VR-ANN-05)
 */
export function validateAttachment(file: { name: string; size: number }): { valid: boolean; error?: string } {
  if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    return {
      valid: false,
      error: `Tệp "${file.name}" vượt quá dung lượng tối đa cho phép (25 MB)`
    };
  }
  return { valid: true };
}

/**
 * Validates the complete announcement creation or update payload
 */
export function validateAnnouncementPayload(payload: Partial<Announcement>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!payload.title || !payload.title.trim()) {
    errors.title = 'Tiêu đề thông báo không được để trống';
  } else if (payload.title.trim().length < 5) {
    errors.title = 'Tiêu đề thông báo phải có ít nhất 5 ký tự';
  }

  if (!payload.content || !payload.content.trim()) {
    errors.content = 'Nội dung thông báo không được để trống';
  }

  if (!payload.category) {
    errors.category = 'Vui lòng chọn danh mục thông báo';
  }

  const channelCheck = validateChannels(payload.channels || []);
  if (!channelCheck.valid && channelCheck.error) {
    errors.channels = channelCheck.error;
  }

  const audienceCheck = validateAudienceTargets(
    payload.audienceScope || 'toan_truong',
    payload.targetGradeIds || [],
    payload.targetClassIds || []
  );
  if (!audienceCheck.valid && audienceCheck.error) {
    errors.audience = audienceCheck.error;
  }

  if (payload.status === 'da_len_lich') {
    const scheduleCheck = validateScheduleTime(payload.scheduledAt);
    if (!scheduleCheck.valid && scheduleCheck.error) {
      errors.scheduledAt = scheduleCheck.error;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Calculates audience recipient breakdown before dispatch (BR03, VR-ANN-02)
 */
export function resolveRecipientBreakdown(
  scope: AnnouncementAudienceScope,
  targetGradeIds: string[],
  targetClassIds: string[],
  subAudience: AnnouncementSubAudience,
  classesList: { id: string; name: string; gradeLevelId: string; studentCount: number }[]
): AnnouncementRecipientBreakdown {
  let relevantClasses = [...classesList];

  if (scope === 'khoi_lop') {
    relevantClasses = relevantClasses.filter(c => targetGradeIds.includes(c.gradeLevelId));
  } else if (scope === 'lop_hoc') {
    relevantClasses = relevantClasses.filter(c => targetClassIds.includes(c.id));
  } else if (scope === 'nhan_vien') {
    // Only staff / teachers
    return {
      totalRecipients: 42,
      parentCount: 0,
      studentCount: 0,
      teacherCount: 35,
      staffCount: 7,
      classBreakdown: []
    };
  }

  const classBreakdown = relevantClasses.map(c => ({
    classId: c.id,
    className: c.name,
    count: c.studentCount
  }));

  const totalStudents = relevantClasses.reduce((sum, c) => sum + c.studentCount, 0);
  const totalParents = Math.round(totalStudents * 1.8); // Average 1.8 parents/guardians per student
  const totalTeachers = relevantClasses.length * 2; // ~2 teachers per class cohort

  let totalRecipients = 0;
  if (subAudience === 'all') {
    totalRecipients = totalStudents + totalParents + totalTeachers;
  } else if (subAudience === 'parents') {
    totalRecipients = totalParents;
  } else if (subAudience === 'students') {
    totalRecipients = totalStudents;
  } else if (subAudience === 'teachers') {
    totalRecipients = totalTeachers;
  }

  return {
    totalRecipients,
    parentCount: subAudience === 'students' ? 0 : totalParents,
    studentCount: subAudience === 'parents' ? 0 : totalStudents,
    teacherCount: totalTeachers,
    staffCount: 5,
    classBreakdown
  };
}

/**
 * Vietnamese Category Labels
 */
export function getCategoryLabel(category: AnnouncementCategory): string {
  switch (category) {
    case 'chung':
      return 'Thông báo chung';
    case 'hoc_phi':
      return 'Học phí & Thu chi';
    case 'su_kien':
      return 'Sự kiện & Lễ hội';
    case 'khan_cap':
      return 'Khẩn cấp';
    case 'hoc_tap':
      return 'Học tập & Thi cử';
    case 'nghi_le':
      return 'Nghỉ lễ & Nghỉ hè';
    default:
      return 'Chung';
  }
}

/**
 * Category Badge Styling Tokens
 */
export function getCategoryColorClass(category: AnnouncementCategory): { bg: string; text: string; border: string } {
  switch (category) {
    case 'chung':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'hoc_phi':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'su_kien':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'khan_cap':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'hoc_tap':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'nghi_le':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
}

/**
 * Status Badge Styling Tokens
 */
export function getStatusBadge(status: AnnouncementStatus): { label: string; bg: string; text: string; dot: string } {
  switch (status) {
    case 'da_gui':
      return {
        label: 'Đã gửi',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500'
      };
    case 'da_len_lich':
      return {
        label: 'Đã lên lịch',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        dot: 'bg-purple-500'
      };
    case 'nhap':
      return {
        label: 'Bản nháp',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        dot: 'bg-slate-400'
      };
    default:
      return {
        label: 'Chưa xác định',
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        dot: 'bg-slate-400'
      };
  }
}

/**
 * Priority Styling Tokens
 */
export function getPriorityBadge(priority: AnnouncementPriority): { label: string; color: string } {
  switch (priority) {
    case 'urgent':
      return { label: 'Hỏa tốc', color: 'text-rose-600 font-bold' };
    case 'important':
      return { label: 'Quan trọng', color: 'text-amber-600 font-semibold' };
    case 'normal':
    default:
      return { label: 'Bình thường', color: 'text-slate-500 font-normal' };
  }
}

/**
 * Audience Scope Display Label
 */
export function getAudienceScopeLabel(scope: AnnouncementAudienceScope): string {
  switch (scope) {
    case 'toan_truong':
      return 'Toàn trường';
    case 'khoi_lop':
      return 'Theo khối lớp';
    case 'lop_hoc':
      return 'Theo lớp học';
    case 'nhan_vien':
      return 'Cán bộ & Giáo viên';
    case 'tuy_chon':
      return 'Tùy chọn';
    default:
      return 'Toàn trường';
  }
}
