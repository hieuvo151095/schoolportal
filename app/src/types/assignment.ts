/**
 * TypeScript Contracts for Academics Homework Assignment (Bài Tập)
 * Adheres to ECO Design System 1.0 and functional spec docs_legacy/operating-portal/hoc-tap/bai-tap.md
 */

export type AssignmentLifecycleStatus = 'da_tao' | 'chua_gui' | 'da_gui' | 'da_thu_hoi';

export type SubmissionStatus = 'chua_nop' | 'da_nop' | 'cham_diem';

export type AudienceType = 'whole_class' | 'specific_students';

export type DueDateFilter = 'dang_tien_hanh' | 'het_han' | 'tat_ca';

export interface AssignmentAttachment {
  id: string;
  name: string;
  url: string;
  sizeBytes: number;
  type?: string;
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  nickname?: string;
  avatar?: string;
  status: SubmissionStatus;
  submittedAt?: string;
  isLate?: boolean;
  submissionFile?: {
    name: string;
    url: string;
    sizeBytes?: number;
  };
  score?: number; // 0.0 - 10.0
  teacherComment?: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
}

export interface AssignmentComment {
  id: string;
  assignmentId: string;
  authorId: string;
  authorName: string;
  authorRole: 'teacher' | 'parent' | 'admin';
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface HomeworkAssignment {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string; // ISO string e.g. 2026-09-20T23:59:00Z
  scheduledSendDate?: string; // Optional future send date
  status: AssignmentLifecycleStatus;
  audienceType: AudienceType;
  targetStudentIds: string[]; // Specific student IDs if audienceType === 'specific_students'
  attachments: AssignmentAttachment[];
  submissions: AssignmentSubmission[];
  comments: AssignmentComment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFilterCriteria {
  classId: string;
  subjectId: string;
  searchQuery: string;
  audienceType?: 'all' | 'whole_class' | 'specific_students';
  dueDateFilter: DueDateFilter;
  status: 'all' | AssignmentLifecycleStatus;
}

export interface AssignmentActionPermission {
  canView: boolean;
  canEdit: boolean;
  canSend: boolean;
  canDelete: boolean;
}

export interface SubmissionTally {
  total: number;
  submittedCount: number;
  evaluatedCount: number;
  lateCount: number;
  submissionRate: number; // percentage 0 - 100
}

export interface AssignmentFormData {
  classId: string;
  subjectId: string;
  title: string;
  description?: string;
  dueDate: string;
  scheduledSendDate?: string;
  audienceType: AudienceType;
  targetStudentIds: string[];
  attachments: AssignmentAttachment[];
}

export interface SubmitGradingFormData {
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  submissionFile?: {
    name: string;
    url: string;
  };
  isGraded: boolean;
  score?: number;
  teacherComment?: string;
}
