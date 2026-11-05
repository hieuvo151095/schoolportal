/**
 * Redux Toolkit State Machine for School Polls, Voting & Surveys (Bình Chọn)
 * Module: M5 - Nhà Trường / Bình Chọn
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Poll,
  PollFilterState,
  StudentVoterRecord,
  CreatePollPayload,
  UpdatePollPayload,
  SendPollPayload,
  CastVotePayload,
  VoteHistoryEntry,
  PollOption,
} from '../../types/poll.ts';
import { INITIAL_MOCK_POLLS, INITIAL_MOCK_VOTERS } from '../../services/mockPollData.ts';
import {
  calculateOptionPercentages,
  isPollExpired,
  POLL_CHART_COLORS,
} from '../../utils/pollValidation.ts';

export interface PollState {
  polls: Poll[];
  voters: Record<string, StudentVoterRecord[]>;
  filterState: PollFilterState;
  selectedPollId: string | null;
  activeModal: 'none' | 'send' | 'delete' | 'history';
  modalTargetPollId: string | null;
  modalTargetStudentId: string | null;
}

const initialState: PollState = {
  polls: INITIAL_MOCK_POLLS,
  voters: INITIAL_MOCK_VOTERS,
  filterState: {
    status: 'all',
    classId: 'all',
    searchQuery: '',
  },
  selectedPollId: null,
  activeModal: 'none',
  modalTargetPollId: null,
  modalTargetStudentId: null,
};

export const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<PollFilterState['status']>) => {
      state.filterState.status = action.payload;
    },
    setFilterClass: (state, action: PayloadAction<string>) => {
      state.filterState.classId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filterState.searchQuery = action.payload;
    },
    resetFilter: (state) => {
      state.filterState = {
        status: 'all',
        classId: 'all',
        searchQuery: '',
      };
    },
    selectPoll: (state, action: PayloadAction<string | null>) => {
      state.selectedPollId = action.payload;
    },
    createPoll: (state, action: PayloadAction<CreatePollPayload>) => {
      const payload = action.payload;
      const newId = `poll-${Date.now()}`;
      const nowIso = new Date().toISOString();

      const options: PollOption[] = payload.options.map((title, idx) => ({
        id: `opt-${Date.now()}-${idx + 1}`,
        title: title.trim(),
        voteCount: 0,
        percentage: 0,
        color: POLL_CHART_COLORS[idx % POLL_CHART_COLORS.length],
      }));

      const newPoll: Poll = {
        id: newId,
        schoolCode: 'demo',
        title: payload.title.trim(),
        description: payload.description?.trim() || '',
        deadline: payload.deadline,
        imageUrl: payload.imageUrl?.trim() || undefined,
        options,
        config: {
          allowMultipleChoices: Boolean(payload.config.allowMultipleChoices),
          allowParentViewResults: Boolean(payload.config.allowParentViewResults),
        },
        status: 'da_tao', // Always starts in draft status without audience (BR03)
        totalVotes: 0,
        voterCount: 0,
        authorName: 'Quản Trị Viên',
        authorRole: 'Ban Giám Hiệu',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      state.polls.unshift(newPoll);
      state.voters[newId] = [];
    },
    updatePoll: (state, action: PayloadAction<UpdatePollPayload>) => {
      const { id, ...updates } = action.payload;
      const index = state.polls.findIndex((p) => p.id === id);
      if (index === -1) return;

      const existing = state.polls[index];
      // Invariant BR02: only draft polls can be modified
      if (existing.status !== 'da_tao') return;

      const nowIso = new Date().toISOString();

      let options = existing.options;
      if (updates.options && updates.options.length >= 2) {
        options = updates.options.map((title, idx) => {
          const oldOpt = existing.options[idx];
          return {
            id: oldOpt ? oldOpt.id : `opt-${Date.now()}-${idx + 1}`,
            title: title.trim(),
            voteCount: oldOpt ? oldOpt.voteCount : 0,
            percentage: oldOpt ? oldOpt.percentage : 0,
            color: oldOpt?.color || POLL_CHART_COLORS[idx % POLL_CHART_COLORS.length],
          };
        });
      }

      state.polls[index] = {
        ...existing,
        title: updates.title !== undefined ? updates.title.trim() : existing.title,
        description: updates.description !== undefined ? updates.description.trim() : existing.description,
        deadline: updates.deadline !== undefined ? updates.deadline : existing.deadline,
        imageUrl: updates.imageUrl !== undefined ? updates.imageUrl : existing.imageUrl,
        options,
        config: updates.config !== undefined ? updates.config : existing.config,
        updatedAt: nowIso,
      };
    },
    sendPoll: (state, action: PayloadAction<SendPollPayload>) => {
      const { pollId, audienceScope, targetClassIds, targetClassNames } = action.payload;
      const poll = state.polls.find((p) => p.id === pollId);
      if (!poll || poll.status !== 'da_tao') return;

      const nowIso = new Date().toISOString();
      const expired = isPollExpired(poll.deadline);

      poll.audienceScope = audienceScope;
      poll.targetClassIds = audienceScope === 'lop_hoc' ? targetClassIds : undefined;
      poll.targetClassNames = audienceScope === 'lop_hoc' ? targetClassNames : undefined;
      poll.sentAt = nowIso;
      poll.status = expired ? 'da_dong' : 'da_gui';
      poll.updatedAt = nowIso;

      state.activeModal = 'none';
      state.modalTargetPollId = null;
    },
    deletePoll: (state, action: PayloadAction<string>) => {
      const pollId = action.payload;
      const poll = state.polls.find((p) => p.id === pollId);
      // Invariant BR02: only draft polls can be deleted
      if (!poll || poll.status !== 'da_tao') return;

      state.polls = state.polls.filter((p) => p.id !== pollId);
      delete state.voters[pollId];
      if (state.selectedPollId === pollId) {
        state.selectedPollId = null;
      }
      state.activeModal = 'none';
      state.modalTargetPollId = null;
    },
    closePoll: (state, action: PayloadAction<string>) => {
      const pollId = action.payload;
      const poll = state.polls.find((p) => p.id === pollId);
      if (!poll || poll.status !== 'da_gui') return;

      const nowIso = new Date().toISOString();
      poll.status = 'da_dong';
      poll.closedAt = nowIso;
      poll.updatedAt = nowIso;
    },
    castVote: (state, action: PayloadAction<CastVotePayload>) => {
      const { pollId, studentId, selectedOptionIds, voterName } = action.payload;
      const poll = state.polls.find((p) => p.id === pollId);
      if (!poll || poll.status !== 'da_gui') return;

      const nowIso = new Date().toISOString();

      // Find or create voter record
      if (!state.voters[pollId]) {
        state.voters[pollId] = [];
      }
      const roster = state.voters[pollId];
      let voter = roster.find((v) => v.studentId === studentId);

      const selectedTitles = selectedOptionIds
        .map((id) => poll.options.find((opt) => opt.id === id)?.title)
        .filter((t): t is string => Boolean(t));

      const newHistoryEntry: VoteHistoryEntry = {
        id: `vh-${Date.now()}`,
        timestamp: nowIso,
        selectedOptionIds,
        selectedOptionTitles: selectedTitles,
        voterName: voterName || 'Phụ huynh học sinh',
      };

      if (voter) {
        // If voter previously voted, subtract their old votes from poll options
        if (voter.hasVoted && voter.selectedOptionIds) {
          voter.selectedOptionIds.forEach((oldOptId) => {
            const opt = poll.options.find((o) => o.id === oldOptId);
            if (opt && opt.voteCount > 0) {
              opt.voteCount -= 1;
              poll.totalVotes -= 1;
            }
          });
        } else {
          poll.voterCount += 1;
        }

        voter.hasVoted = true;
        voter.selectedOptionIds = selectedOptionIds;
        voter.selectedOptionTitles = selectedTitles;
        voter.lastVotedAt = nowIso;
        voter.voteHistory.push(newHistoryEntry);
      } else {
        // New voter record
        poll.voterCount += 1;
        roster.push({
          studentId,
          studentName: voterName || 'Học sinh',
          classId: poll.targetClassIds?.[0] || 'class-general',
          className: poll.targetClassNames?.[0] || 'Toàn trường',
          hasVoted: true,
          selectedOptionIds,
          selectedOptionTitles: selectedTitles,
          lastVotedAt: nowIso,
          voteHistory: [newHistoryEntry],
        });
      }

      // Add new votes to option counts
      selectedOptionIds.forEach((newOptId) => {
        const opt = poll.options.find((o) => o.id === newOptId);
        if (opt) {
          opt.voteCount += 1;
          poll.totalVotes += 1;
        }
      });

      // Recalculate option percentages
      poll.options = calculateOptionPercentages(poll.options, poll.totalVotes);
      poll.updatedAt = nowIso;
    },
    openSendModal: (state, action: PayloadAction<string>) => {
      state.activeModal = 'send';
      state.modalTargetPollId = action.payload;
    },
    openDeleteModal: (state, action: PayloadAction<string>) => {
      state.activeModal = 'delete';
      state.modalTargetPollId = action.payload;
    },
    openHistoryModal: (
      state,
      action: PayloadAction<{ pollId: string; studentId: string }>
    ) => {
      state.activeModal = 'history';
      state.modalTargetPollId = action.payload.pollId;
      state.modalTargetStudentId = action.payload.studentId;
    },
    closeModal: (state) => {
      state.activeModal = 'none';
      state.modalTargetPollId = null;
      state.modalTargetStudentId = null;
    },
  },
});

export const {
  setFilterStatus,
  setFilterClass,
  setSearchQuery,
  resetFilter,
  selectPoll,
  createPoll,
  updatePoll,
  sendPoll,
  deletePoll,
  closePoll,
  castVote,
  openSendModal,
  openDeleteModal,
  openHistoryModal,
  closeModal,
} = pollSlice.actions;

export default pollSlice.reducer;
