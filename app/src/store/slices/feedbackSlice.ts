/**
 * Redux Toolkit Slice: School Parent Feedback (Góp Ý)
 * Module: M5 - Nhà Trường / Góp Ý
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  FeedbackItem,
  FeedbackFilterState,
  FeedbackStatus,
  UpdatePriorityPayload,
  UpdateAssigneePayload,
  AddCommentPayload,
  FeedbackComment,
} from '../../types/feedback.ts';
import { INITIAL_FEEDBACK_ITEMS } from '../../services/mockFeedbackData.ts';
import { getNextTurnTakingStatus } from '../../utils/feedbackValidation.ts';

interface FeedbackState {
  items: FeedbackItem[];
  filters: FeedbackFilterState;
  activeCardFilter: FeedbackStatus | 'all';
  selectedFeedbackId: string | null;
  isClosureModalOpen: boolean;
  targetFeedbackForClosure: FeedbackItem | null;
  profileModal: {
    isOpen: boolean;
    type: 'student' | 'parent';
    data: any;
  };
}

const initialFilters: FeedbackFilterState = {
  schoolYear: '2026 - 2027',
  status: 'all',
  category: 'all',
  priority: 'all',
  assigneeId: 'all',
  waitingFor: 'all',
  dateFrom: '',
  dateTo: '',
  searchQuery: '',
};

const initialState: FeedbackState = {
  items: INITIAL_FEEDBACK_ITEMS,
  filters: initialFilters,
  activeCardFilter: 'all',
  selectedFeedbackId: null,
  isClosureModalOpen: false,
  targetFeedbackForClosure: null,
  profileModal: {
    isOpen: false,
    type: 'student',
    data: null,
  },
};

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setSchoolYearFilter: (state, action: PayloadAction<string>) => {
      state.filters.schoolYear = action.payload;
    },

    setStatusCardFilter: (state, action: PayloadAction<FeedbackStatus | 'all'>) => {
      if (state.activeCardFilter === action.payload) {
        state.activeCardFilter = 'all';
        state.filters.status = 'all';
      } else {
        state.activeCardFilter = action.payload;
        state.filters.status = action.payload;
      }
    },

    clearStatusCardFilter: (state) => {
      state.activeCardFilter = 'all';
      state.filters.status = 'all';
    },

    setAdvancedFilters: (state, action: PayloadAction<Partial<FeedbackFilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      if (action.payload.status !== undefined) {
        state.activeCardFilter = action.payload.status;
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },

    updatePriority: (state, action: PayloadAction<UpdatePriorityPayload>) => {
      const { feedbackId, priority } = action.payload;
      const item = state.items.find((i) => i.id === feedbackId);
      if (item) {
        item.priority = priority;
        item.updatedAt = new Date().toISOString();
      }
    },

    updateAssignee: (state, action: PayloadAction<UpdateAssigneePayload>) => {
      const { feedbackId, assigneeId, assigneeName, assigneeAvatar } = action.payload;
      const item = state.items.find((i) => i.id === feedbackId);
      if (item) {
        item.assigneeId = assigneeId;
        item.assigneeName = assigneeName;
        item.assigneeAvatar = assigneeAvatar;
        if (item.status === 'new' && assigneeId) {
          item.status = 'processing';
        }
        item.updatedAt = new Date().toISOString();
      }
    },

    addComment: (state, action: PayloadAction<AddCommentPayload>) => {
      const { feedbackId, content, authorRole, authorName, authorAvatar, attachments } = action.payload;
      const item = state.items.find((i) => i.id === feedbackId);
      if (item) {
        const newComment: FeedbackComment = {
          id: `cm-${Date.now()}`,
          feedbackId,
          authorId: authorRole === 'parent' ? item.parentId : 'current-user',
          authorName,
          authorRole,
          authorAvatar,
          content,
          attachments,
          createdAt: new Date().toISOString(),
        };

        item.comments.push(newComment);
        item.updatedAt = newComment.createdAt;

        // Reactive Turn-Taking Machine (BR05, K057)
        const nextState = getNextTurnTakingStatus(item.waitingFor, authorRole, item.status);
        item.waitingFor = nextState.waitingFor;
        item.status = nextState.nextStatus;
      }
    },

    openClosureModal: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        state.targetFeedbackForClosure = item;
        state.isClosureModalOpen = true;
      }
    },

    closeClosureModal: (state) => {
      state.isClosureModalOpen = false;
      state.targetFeedbackForClosure = null;
    },

    confirmCloseFeedback: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.status = 'completed';
        item.closedAt = new Date().toISOString();
        item.updatedAt = item.closedAt;
      }
      state.isClosureModalOpen = false;
      state.targetFeedbackForClosure = null;
    },

    openProfileModal: (
      state,
      action: PayloadAction<{ type: 'student' | 'parent'; data: any }>
    ) => {
      state.profileModal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },

    closeProfileModal: (state) => {
      state.profileModal.isOpen = false;
      state.profileModal.data = null;
    },

    resetFilters: (state) => {
      state.filters = {
        ...initialFilters,
        schoolYear: state.filters.schoolYear,
      };
      state.activeCardFilter = 'all';
    },
  },
});

export const {
  setSchoolYearFilter,
  setStatusCardFilter,
  clearStatusCardFilter,
  setAdvancedFilters,
  setSearchQuery,
  updatePriority,
  updateAssignee,
  addComment,
  openClosureModal,
  closeClosureModal,
  confirmCloseFeedback,
  openProfileModal,
  closeProfileModal,
  resetFilters,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
