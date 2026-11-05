/**
 * School Parent Feedback (Góp Ý) Domain Contracts
 * Governed by Marcus Fleet V34 & ECO Design System 1.0
 */

export type FeedbackStatus = 'new' | 'processing' | 'completed' | 'reopened';

export type FeedbackPriority = 'low' | 'medium' | 'high' | 'urgent';

export type FeedbackType =
  | 'content'
  | 'presentation'
  | 'performance'
  | 'skill'
  | 'attitude'
  | 'process'
  | 'experience'
  | 'strategic';

export type FeedbackWaitingFor = 'school' | 'parent';

export interface FeedbackAttachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface FeedbackComment {
  id: string;
  feedbackId: string;
  authorId: string;
  authorName: string;
  authorRole: 'admin' | 'teacher' | 'parent';
  authorAvatar?: string;
  content: string;
  attachments?: FeedbackAttachment[];
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  code: string; // e.g. "#GY-2026-001"
  schoolCode: string;
  schoolYear: string; // e.g. "2026 - 2027"
  title: string;
  description: string; // Original parent feedback
  category: FeedbackType;
  categoryLabel: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  waitingFor: FeedbackWaitingFor;
  studentId: string;
  studentName: string;
  studentClass: string;
  studentAvatar?: string;
  parentId: string;
  parentName: string;
  parentPhone?: string;
  parentEmail?: string;
  parentRelationship?: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  attachments: FeedbackAttachment[];
  comments: FeedbackComment[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface FeedbackSummaryKPI {
  newCount: number;
  processingCount: number;
  completedCount: number;
  reopenedCount: number;
  totalCount: number;
}

export interface FeedbackFilterState {
  schoolYear: string;
  status: FeedbackStatus | 'all';
  category: FeedbackType | 'all';
  priority: FeedbackPriority | 'all';
  assigneeId: string | 'all';
  waitingFor: FeedbackWaitingFor | 'all';
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
}

export interface UpdatePriorityPayload {
  feedbackId: string;
  priority: FeedbackPriority;
}

export interface UpdateAssigneePayload {
  feedbackId: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
}

export interface AddCommentPayload {
  feedbackId: string;
  content: string;
  authorRole: 'admin' | 'teacher' | 'parent';
  authorName: string;
  authorAvatar?: string;
  attachments?: FeedbackAttachment[];
}

export interface CloseFeedbackPayload {
  feedbackId: string;
  closedAt: string;
}

export interface StaffOption {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}
