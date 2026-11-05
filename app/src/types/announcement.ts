/**
 * Data contracts for School Announcement Board (Nhà Trường — Bảng Thông Tin)
 * Module M5 / Feature 039-school-announcement-board-bang-thong-tin
 */

export type AnnouncementStatus = 'nhap' | 'da_gui' | 'da_len_lich';

export type AnnouncementCategory = 
  | 'chung'       // Thông báo chung
  | 'hoc_phi'     // Học phí & Thu chi
  | 'su_kien'     // Sự kiện & Lễ hội
  | 'khan_cap'    // Khẩn cấp (thời tiết, dịch bệnh)
  | 'hoc_tap'     // Học tập & Thi cử
  | 'nghi_le';    // Nghỉ lễ & Nghỉ hè

export type AnnouncementPriority = 'normal' | 'important' | 'urgent';

export type AnnouncementChannel = 'portal' | 'email' | 'sms' | 'push';

export type AnnouncementAudienceScope = 
  | 'toan_truong' // Toàn trường
  | 'khoi_lop'    // Theo khối lớp
  | 'lop_hoc'     // Theo lớp học cụ thể
  | 'nhan_vien'   // Toàn thể cán bộ giáo viên / Nhân viên
  | 'tuy_chon';   // Tùy chọn nâng cao

export type AnnouncementSubAudience = 'all' | 'parents' | 'students' | 'teachers';

export interface AnnouncementAttachment {
  id: string;
  fileName: string;
  fileSize: number; // in bytes (max 25MB = 26,214,400)
  fileType: string;
  fileUrl: string;
}

export interface AnnouncementClassBreakdown {
  classId: string;
  className: string;
  count: number;
}

export interface AnnouncementRecipientBreakdown {
  totalRecipients: number;
  parentCount: number;
  studentCount: number;
  teacherCount: number;
  staffCount: number;
  classBreakdown: AnnouncementClassBreakdown[];
}

export interface Announcement {
  id: string;
  schoolCode: string;
  title: string;
  content: string; // Rich text / HTML
  excerpt: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  channels: AnnouncementChannel[];
  audienceScope: AnnouncementAudienceScope;
  subAudience: AnnouncementSubAudience;
  targetGradeIds: string[];
  targetClassIds: string[];
  targetStaffRoles: string[];
  attachments: AnnouncementAttachment[];
  scheduledAt?: string; // ISO 8601
  publishedAt?: string; // ISO 8601
  createdBy: string;
  authorName: string;
  authorRole: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  isPinned: boolean;
  recipientCount: number;
  emailSentCount: number;
  portalReadCount: number;
}

export interface AnnouncementSummaryKPI {
  totalAnnouncements: number;
  publishedCount: number;
  scheduledCount: number;
  draftCount: number;
}

export interface AnnouncementFilterState {
  searchQuery: string;
  statusFilter: 'all' | AnnouncementStatus;
  categoryFilter: 'all' | AnnouncementCategory;
  channelFilter: 'all' | AnnouncementChannel;
}
