export type AudienceScope = 'current_class' | 'whole_school' | 'custom_classes';
export type ModerationStatus = 'cho_duyet' | 'approved';

export interface ActivityMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
}

export interface ActivityFile {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface LessonRef {
  id: string;
  subject: string;
  title: string;
  unit: string;
  date: string;
  objectives: string[];
}

export interface ActivityPost {
  id: string;
  classId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorRole: string;
  content: string;
  audienceScope: AudienceScope;
  scopeLabel?: string;
  status: ModerationStatus;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  media: ActivityMedia[];
  files: ActivityFile[];
  taggedStudents: string[];
  taggedLessons: string[];
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  isLikedByCurrentUser?: boolean;
}

export interface ActivityFilterState {
  classId: string;
  statusFilter: 'all' | ModerationStatus;
  searchQuery: string;
}
