/**
 * Redux Toolkit Slice for School Announcement Board (Bảng Thông Tin)
 * Module M5 / Feature 039-school-announcement-board-bang-thong-tin
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Announcement,
  AnnouncementCategory,
  AnnouncementChannel,
  AnnouncementFilterState,
  AnnouncementStatus
} from '../../types/announcement.ts';
import { INITIAL_MOCK_ANNOUNCEMENTS } from '../../services/mockAnnouncementData.ts';
import { validateDraftMutability } from '../../utils/announcementValidation.ts';

interface AnnouncementState {
  announcements: Announcement[];
  filters: AnnouncementFilterState;
  selectedAnnouncementId: string | null;
  selectedIdsForBulk: string[];
}

const initialState: AnnouncementState = {
  announcements: INITIAL_MOCK_ANNOUNCEMENTS,
  filters: {
    searchQuery: '',
    statusFilter: 'all',
    categoryFilter: 'all',
    channelFilter: 'all'
  },
  selectedAnnouncementId: null,
  selectedIdsForBulk: []
};

export const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    createAnnouncement: (state, action: PayloadAction<Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'emailSentCount' | 'portalReadCount'>>) => {
      const now = new Date().toISOString();
      const newAnnouncement: Announcement = {
        ...action.payload,
        id: `ann-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        emailSentCount: action.payload.status === 'da_gui' && action.payload.channels.includes('email') ? action.payload.recipientCount : 0,
        portalReadCount: 0
      };
      state.announcements.unshift(newAnnouncement);
    },

    updateDraftAnnouncement: (state, action: PayloadAction<{ id: string; updates: Partial<Announcement> }>) => {
      const index = state.announcements.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        const target = state.announcements[index];
        // Enforce strict draft-only mutability
        const check = validateDraftMutability(target);
        if (!check.valid) {
          throw new Error(check.error);
        }
        state.announcements[index] = {
          ...target,
          ...action.payload.updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    publishAnnouncement: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.announcements.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        const target = state.announcements[index];
        const now = new Date().toISOString();
        state.announcements[index] = {
          ...target,
          status: 'da_gui',
          publishedAt: now,
          updatedAt: now,
          emailSentCount: target.channels.includes('email') ? target.recipientCount : 0
        };
      }
    },

    scheduleAnnouncement: (state, action: PayloadAction<{ id: string; scheduledAt: string }>) => {
      const index = state.announcements.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        const target = state.announcements[index];
        state.announcements[index] = {
          ...target,
          status: 'da_len_lich',
          scheduledAt: action.payload.scheduledAt,
          updatedAt: new Date().toISOString()
        };
      }
    },

    cancelScheduledAnnouncement: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.announcements.findIndex(a => a.id === action.payload.id);
      if (index !== -1 && state.announcements[index].status === 'da_len_lich') {
        state.announcements[index] = {
          ...state.announcements[index],
          status: 'nhap',
          scheduledAt: undefined,
          updatedAt: new Date().toISOString()
        };
      }
    },

    deleteAnnouncement: (state, action: PayloadAction<{ id: string }>) => {
      state.announcements = state.announcements.filter(a => a.id !== action.payload.id);
      state.selectedIdsForBulk = state.selectedIdsForBulk.filter(id => id !== action.payload.id);
      if (state.selectedAnnouncementId === action.payload.id) {
        state.selectedAnnouncementId = null;
      }
    },

    deleteMultipleAnnouncements: (state, action: PayloadAction<{ ids: string[] }>) => {
      const idsToDelete = new Set(action.payload.ids);
      state.announcements = state.announcements.filter(a => !idsToDelete.has(a.id));
      state.selectedIdsForBulk = state.selectedIdsForBulk.filter(id => !idsToDelete.has(id));
      if (state.selectedAnnouncementId && idsToDelete.has(state.selectedAnnouncementId)) {
        state.selectedAnnouncementId = null;
      }
    },

    togglePinAnnouncement: (state, action: PayloadAction<{ id: string }>) => {
      const target = state.announcements.find(a => a.id === action.payload.id);
      if (target) {
        target.isPinned = !target.isPinned;
        target.updatedAt = new Date().toISOString();
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },

    setStatusFilter: (state, action: PayloadAction<'all' | AnnouncementStatus>) => {
      state.filters.statusFilter = action.payload;
    },

    setCategoryFilter: (state, action: PayloadAction<'all' | AnnouncementCategory>) => {
      state.filters.categoryFilter = action.payload;
    },

    setChannelFilter: (state, action: PayloadAction<'all' | AnnouncementChannel>) => {
      state.filters.channelFilter = action.payload;
    },

    resetFilters: (state) => {
      state.filters = {
        searchQuery: '',
        statusFilter: 'all',
        categoryFilter: 'all',
        channelFilter: 'all'
      };
    },

    setSelectedAnnouncementId: (state, action: PayloadAction<string | null>) => {
      state.selectedAnnouncementId = action.payload;
    },

    toggleSelectForBulk: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIdsForBulk.includes(id)) {
        state.selectedIdsForBulk = state.selectedIdsForBulk.filter(item => item !== id);
      } else {
        state.selectedIdsForBulk.push(id);
      }
    },

    selectAllForBulk: (state, action: PayloadAction<string[]>) => {
      state.selectedIdsForBulk = action.payload;
    },

    clearBulkSelection: (state) => {
      state.selectedIdsForBulk = [];
    }
  }
});

export const {
  createAnnouncement,
  updateDraftAnnouncement,
  publishAnnouncement,
  scheduleAnnouncement,
  cancelScheduledAnnouncement,
  deleteAnnouncement,
  deleteMultipleAnnouncements,
  togglePinAnnouncement,
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setChannelFilter,
  resetFilters,
  setSelectedAnnouncementId,
  toggleSelectForBulk,
  selectAllForBulk,
  clearBulkSelection
} = announcementSlice.actions;

export default announcementSlice.reducer;
