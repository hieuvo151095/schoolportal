import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ActivityPost,
  AudienceScope,
  ModerationStatus,
  LessonRef,
  ActivityMedia,
} from '../../types/activity';
import {
  INITIAL_ACTIVITY_POSTS,
  MOCK_LESSONS,
  MOCK_SENTENCE_TEMPLATES,
  MOCK_STUDENTS,
  SentenceTemplate,
  MentionableStudent,
} from '../../services/mockActivityData';

export interface ActivityState {
  posts: ActivityPost[];
  selectedClassId: string;
  statusFilter: 'all' | ModerationStatus;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  lessons: LessonRef[];
  sentenceTemplates: SentenceTemplate[];
  mentionableStudents: MentionableStudent[];
}

const initialState: ActivityState = {
  posts: INITIAL_ACTIVITY_POSTS,
  selectedClassId: 'lop-1a1',
  statusFilter: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,
  lessons: MOCK_LESSONS,
  sentenceTemplates: MOCK_SENTENCE_TEMPLATES,
  mentionableStudents: MOCK_STUDENTS,
};

export interface CreatePostPayload {
  classId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorRole: string;
  content: string;
  audienceScope: AudienceScope;
  scopeLabel?: string;
  status?: ModerationStatus;
  media?: ActivityMedia[];
  taggedStudents?: string[];
  taggedLessons?: string[];
}

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    createPost: (state, action: PayloadAction<CreatePostPayload>) => {
      const newId = `post-${Date.now()}`;
      const nowIso = new Date().toISOString();

      // BR06: Defaults to unapproved (cho_duyet) moderation queue unless explicitly specified
      const status: ModerationStatus = action.payload.status || 'cho_duyet';

      const newPost: ActivityPost = {
        id: newId,
        classId: action.payload.classId,
        authorId: action.payload.authorId,
        authorName: action.payload.authorName,
        authorAvatarUrl: action.payload.authorAvatarUrl,
        authorRole: action.payload.authorRole,
        content: action.payload.content,
        audienceScope: action.payload.audienceScope,
        scopeLabel: action.payload.scopeLabel || (action.payload.audienceScope === 'whole_school' ? 'Toàn trường' : 'Lớp 1A1'),
        status,
        isPinned: false,
        createdAt: nowIso,
        updatedAt: nowIso,
        media: action.payload.media || [],
        files: [],
        taggedStudents: action.payload.taggedStudents || [],
        taggedLessons: action.payload.taggedLessons || [],
        likesCount: 0,
        viewsCount: 1,
        commentsCount: 0,
        isLikedByCurrentUser: false,
      };

      state.posts.unshift(newPost);
    },

    togglePinPost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        if (post.isPinned) {
          post.isPinned = false;
        } else {
          // If no other post is pinned, pin it directly
          const hasOtherPinned = state.posts.some((p) => p.id !== post.id && p.isPinned);
          if (!hasOtherPinned) {
            post.isPinned = true;
          }
        }
      }
    },

    pinPostReplace: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;
      state.posts.forEach((p) => {
        if (p.id === targetId) {
          p.isPinned = true;
        } else if (p.isPinned) {
          p.isPinned = false;
        }
      });
    },

    toggleLikePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        if (post.isLikedByCurrentUser) {
          post.isLikedByCurrentUser = false;
          post.likesCount = Math.max(0, post.likesCount - 1);
        } else {
          post.isLikedByCurrentUser = true;
          post.likesCount += 1;
        }
      }
    },

    approvePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.status = 'approved';
        post.updatedAt = new Date().toISOString();
      }
    },

    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },

    editPostContent: (
      state,
      action: PayloadAction<{ id: string; content: string; audienceScope?: AudienceScope }>
    ) => {
      const post = state.posts.find((p) => p.id === action.payload.id);
      if (post) {
        post.content = action.payload.content;
        if (action.payload.audienceScope) {
          post.audienceScope = action.payload.audienceScope;
        }
        post.updatedAt = new Date().toISOString();
      }
    },

    setStatusFilter: (state, action: PayloadAction<'all' | ModerationStatus>) => {
      state.statusFilter = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setSelectedClassId: (state, action: PayloadAction<string>) => {
      state.selectedClassId = action.payload;
    },
  },
});

export const {
  createPost,
  togglePinPost,
  pinPostReplace,
  toggleLikePost,
  approvePost,
  deletePost,
  editPostContent,
  setStatusFilter,
  setSearchQuery,
  setSelectedClassId,
} = activitySlice.actions;

export default activitySlice.reducer;
