/**
 * Data contracts for Operations Parent Messaging (Trao Đổi)
 * Sub-module 4 under Module 1: Vận Hành
 */

export type ConversationType = 'ca_nhan' | 'nhom';

export type MessageCategory = 
  | 'tin_nhan' 
  | 'bao_vang' 
  | 'dan_thuoc' 
  | 'yeu_cau_don_ve' 
  | 'gop_y' 
  | 'khac';

export type AbsenceStatus = 'cho_xu_ly' | 'da_xac_nhan' | 'da_huy';

export interface AbsenceCardData {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: AbsenceStatus;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'giao_vien' | 'phu_huynh' | 'he_thong';
  senderAvatar?: string;
  category: MessageCategory;
  content: string;
  timestamp: string;
  isSystemAudit?: boolean;
  isRecalled?: boolean;
  absenceData?: AbsenceCardData;
  attachments?: {
    name: string;
    url: string;
    sizeBytes?: number;
  }[];
}

export interface ConversationRecipient {
  id: string;
  name: string;
  role: 'phu_huynh' | 'giao_vien';
  avatar?: string;
  childrenNames?: string[]; // Deduplication: e.g. ["Đỗ Nam", "Đỗ Hải"]
  isManualAddition: boolean; // True if manually added by teacher
}

export interface ImportantAlert {
  id: string;
  conversationId: string;
  studentId: string;
  studentName: string;
  type: 'bao_om' | 'bao_vang';
  title: string;
  dateRange: string;
  note?: string;
  status: 'dang_dien_ra' | 'sap_toi';
}

export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  classId: string;
  className: string;
  studentId?: string;
  studentName?: string;
  hasSchoolResponse: boolean; // BR09: Star icon in sidebar
  lastMessageSnippet: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  studentIds: string[]; // For group chats (BR07)
  recipients: ConversationRecipient[]; // For group chats (BR08)
  importantAlertsCount: number; // BR06: Count of active alerts
  isParentLocked?: boolean; // Khóa phụ huynh gửi tin nhắn
  isArchived?: boolean; // Lưu trữ cuộc trò chuyện (khóa gửi tin với tất cả)
  pinnedMessageIds?: string[]; // Danh sách tin nhắn đã ghim (tối đa 3)
}

export interface ConversationFilterState {
  searchQuery: string;
  classId: string; // 'all' or specific class ID
  categoryFilter: MessageCategory | null; // For 1:1 chat filtering (BR02)
  dateFilter: string | null; // For date jump (BR11)
}
