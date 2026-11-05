import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeVietnameseText,
  filterPolls,
  validatePollPayload,
  validateSendPayload,
  canEditPoll,
  canSendPoll,
  canDeletePoll,
  computePollKPIs,
  calculateOptionPercentages,
  isPollExpired,
  formatPollDeadline,
  POLL_CHART_COLORS,
} from '../../src/utils/pollValidation.ts';

import pollReducer, {
  setFilterStatus,
  setFilterClass,
  setSearchQuery,
  resetFilter,
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
} from '../../src/store/slices/pollSlice.ts';

import {
  INITIAL_MOCK_POLLS,
  INITIAL_MOCK_VOTERS,
  POLL_AVAILABLE_CLASSES,
} from '../../src/services/mockPollData.ts';

test('School Polls, Voting & Surveys (Bình Chọn - E-025-school-polls) Suite', async (t) => {
  await t.test('BR01 & BR10: Directory Filtering, Statuses, and Diacritic-Free Search', async (t) => {
    await t.test('normalizes Vietnamese text and removes diacritics', () => {
      assert.equal(normalizeVietnameseText('Bình chọn Dã Ngoại 2026'), 'binh chon da ngoai 2026');
      assert.equal(normalizeVietnameseText('Đồng phục Thể Dục Mùa Thu'), 'dong phuc the duc mua thu');
      assert.equal(normalizeVietnameseText(''), '');
    });

    await t.test('filters polls by lifecycle status', () => {
      const allPolls = filterPolls(INITIAL_MOCK_POLLS, {
        status: 'all',
        classId: 'all',
        searchQuery: '',
      });
      assert.equal(allPolls.length, INITIAL_MOCK_POLLS.length);

      const activePolls = filterPolls(INITIAL_MOCK_POLLS, {
        status: 'da_gui',
        classId: 'all',
        searchQuery: '',
      });
      assert.ok(activePolls.length > 0);
      assert.ok(activePolls.every((p) => p.status === 'da_gui'));

      const draftPolls = filterPolls(INITIAL_MOCK_POLLS, {
        status: 'da_tao',
        classId: 'all',
        searchQuery: '',
      });
      assert.ok(draftPolls.length > 0);
      assert.ok(draftPolls.every((p) => p.status === 'da_tao'));

      const closedPolls = filterPolls(INITIAL_MOCK_POLLS, {
        status: 'da_dong',
        classId: 'all',
        searchQuery: '',
      });
      assert.ok(closedPolls.length > 0);
      assert.ok(closedPolls.every((p) => p.status === 'da_dong'));
    });

    await t.test('filters polls by class cohort and includes whole-school polls', () => {
      const class10A1Polls = filterPolls(INITIAL_MOCK_POLLS, {
        status: 'all',
        classId: 'class-10a1',
        searchQuery: '',
      });
      assert.ok(class10A1Polls.length > 0);
      class10A1Polls.forEach((p) => {
        const matchesClass =
          p.audienceScope === 'toan_truong' ||
          (p.audienceScope === 'lop_hoc' && p.targetClassIds?.includes('class-10a1'));
        assert.ok(matchesClass);
      });
    });

    await t.test('searches polls using diacritic-free queries (BR10)', () => {
      const results = filterPolls(INITIAL_MOCK_POLLS, {
        status: 'all',
        classId: 'all',
        searchQuery: 'trung thu',
      });
      assert.ok(results.length >= 1);
      assert.ok(results.some((p) => p.id === 'poll-001'));

      const noAccents = filterPolls(INITIAL_MOCK_POLLS, {
        status: 'all',
        classId: 'all',
        searchQuery: 'dong phuc the duc',
      });
      assert.ok(noAccents.length >= 1);
      assert.ok(noAccents.some((p) => p.id === 'poll-003'));
    });
  });

  await t.test('BR02 & K044: State-Driven Action Visibility & Guardrails', async (t) => {
    await t.test('allows edit, send, and delete strictly for da_tao drafts', () => {
      assert.equal(canEditPoll('da_tao'), true);
      assert.equal(canSendPoll('da_tao'), true);
      assert.equal(canDeletePoll('da_tao'), true);

      assert.equal(canEditPoll('da_gui'), false);
      assert.equal(canSendPoll('da_gui'), false);
      assert.equal(canDeletePoll('da_gui'), false);

      assert.equal(canEditPoll('da_dong'), false);
      assert.equal(canSendPoll('da_dong'), false);
      assert.equal(canDeletePoll('da_dong'), false);
    });
  });

  await t.test('BR03 & BR04: Authoring Decoupled from Dispatch & Payload Validation', async (t) => {
    await t.test('rejects empty or too short title', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const resEmpty = validatePollPayload({
        title: '',
        deadline: futureDate,
        options: ['Phương án A', 'Phương án B'],
        config: { allowMultipleChoices: false, allowParentViewResults: true },
      });
      assert.equal(resEmpty.isValid, false);
      assert.ok(resEmpty.errors.title);

      const resShort = validatePollPayload({
        title: 'AB',
        deadline: futureDate,
        options: ['Phương án A', 'Phương án B'],
        config: { allowMultipleChoices: false, allowParentViewResults: true },
      });
      assert.equal(resShort.isValid, false);
      assert.ok(resShort.errors.title);
    });

    await t.test('rejects past deadline', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const res = validatePollPayload({
        title: 'Bình chọn địa điểm du xuân',
        deadline: pastDate,
        options: ['Hạ Long', 'Sapa'],
        config: { allowMultipleChoices: false, allowParentViewResults: true },
      });
      assert.equal(res.isValid, false);
      assert.ok(res.errors.deadline);
    });

    await t.test('rejects fewer than 2 distinct options or duplicate options', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const resOneOpt = validatePollPayload({
        title: 'Bình chọn thực đơn tuần tới',
        deadline: futureDate,
        options: ['Cơm gà'],
        config: { allowMultipleChoices: false, allowParentViewResults: true },
      });
      assert.equal(resOneOpt.isValid, false);
      assert.ok(resOneOpt.errors.options);

      const resDup = validatePollPayload({
        title: 'Bình chọn thực đơn tuần tới',
        deadline: futureDate,
        options: ['Cơm gà nướng', 'cơm gà nướng'],
        config: { allowMultipleChoices: false, allowParentViewResults: true },
      });
      assert.equal(resDup.isValid, false);
      assert.ok(resDup.errors.options);
    });

    await t.test('accepts valid poll payload', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const res = validatePollPayload({
        title: 'Bình chọn trang phục hội thao',
        deadline: futureDate,
        options: ['Màu Đỏ Năng Động', 'Màu Xanh Thể Thao', 'Màu Cam Trẻ Trung'],
        config: { allowMultipleChoices: true, allowParentViewResults: false },
      });
      assert.equal(res.isValid, true);
      assert.equal(Object.keys(res.errors).length, 0);
    });
  });

  await t.test('BR05: Send Dispatch Modal Payload Validation (UC-04)', async (t) => {
    await t.test('accepts whole-school dispatch without target classes', () => {
      const res = validateSendPayload({
        pollId: 'poll-005',
        audienceScope: 'toan_truong',
      });
      assert.equal(res.isValid, true);
    });

    await t.test('rejects class cohort dispatch when no classes are selected', () => {
      const res = validateSendPayload({
        pollId: 'poll-005',
        audienceScope: 'lop_hoc',
        targetClassIds: [],
      });
      assert.equal(res.isValid, false);
      assert.ok(res.errors.targetClassIds);
    });

    await t.test('accepts class cohort dispatch with selected classes', () => {
      const res = validateSendPayload({
        pollId: 'poll-005',
        audienceScope: 'lop_hoc',
        targetClassIds: ['class-1a', 'class-6a'],
        targetClassNames: ['1A', '6A'],
      });
      assert.equal(res.isValid, true);
    });
  });

  await t.test('BR06 & NFR01: Result Aggregation and Percentage Calculations', async (t) => {
    await t.test('handles 0 votes gracefully with 0 percentage', () => {
      const options = [
        { id: 'opt-1', title: 'Phương án 1', voteCount: 0, percentage: 0 },
        { id: 'opt-2', title: 'Phương án 2', voteCount: 0, percentage: 0 },
      ];
      const result = calculateOptionPercentages(options, 0);
      assert.equal(result[0].percentage, 0);
      assert.equal(result[1].percentage, 0);
    });

    await t.test('calculates accurate rounded percentages for votes', () => {
      const options = [
        { id: 'opt-1', title: 'Phương án 1', voteCount: 75, percentage: 0 },
        { id: 'opt-2', title: 'Phương án 2', voteCount: 25, percentage: 0 },
      ];
      const result = calculateOptionPercentages(options, 100);
      assert.equal(result[0].percentage, 75.0);
      assert.equal(result[1].percentage, 25.0);
    });

    await t.test('correctly identifies expired deadline and formats date', () => {
      const past = new Date(Date.now() - 3600000).toISOString();
      const future = new Date(Date.now() + 3600000).toISOString();
      assert.equal(isPollExpired(past), true);
      assert.equal(isPollExpired(future), false);

      const formatted = formatPollDeadline('2026-10-25T18:00:00');
      assert.ok(formatted.includes('18:00'));
      assert.ok(formatted.includes('25/10/2026'));
    });
  });

  await t.test('KPI Aggregation Engine', async (t) => {
    await t.test('computes correct directory KPI metrics', () => {
      const kpis = computePollKPIs(INITIAL_MOCK_POLLS);
      assert.equal(kpis.totalPolls, INITIAL_MOCK_POLLS.length);
      assert.equal(
        kpis.activePollsCount,
        INITIAL_MOCK_POLLS.filter((p) => p.status === 'da_gui').length
      );
      assert.equal(
        kpis.draftPollsCount,
        INITIAL_MOCK_POLLS.filter((p) => p.status === 'da_tao').length
      );
      assert.equal(
        kpis.closedPollsCount,
        INITIAL_MOCK_POLLS.filter((p) => p.status === 'da_dong').length
      );
      const expectedTotalVotes = INITIAL_MOCK_POLLS.reduce((acc, p) => acc + (p.totalVotes || 0), 0);
      assert.equal(kpis.totalVotesCast, expectedTotalVotes);
    });
  });

  await t.test('Redux State Machine Mutations (pollSlice)', async (t) => {
    const freshState = () => pollReducer(undefined, { type: '@@INIT' });

    await t.test('initializes with mock data fixtures', () => {
      const state = freshState();
      assert.ok(state.polls.length >= 7);
      assert.equal(state.filterState.status, 'all');
      assert.equal(state.filterState.classId, 'all');
      assert.equal(state.filterState.searchQuery, '');
    });

    await t.test('creates poll in da_tao draft status without audience bindings (BR03)', () => {
      let state = freshState();
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      state = pollReducer(
        state,
        createPoll({
          title: 'Khảo sát món ăn trưa thứ Sáu',
          description: 'Lựa chọn món tráng miệng',
          deadline: futureDate,
          options: ['Chè hạt sen', 'Sữa chua dầm hoa quả', 'Bánh flan'],
          config: {
            allowMultipleChoices: false,
            allowParentViewResults: true,
          },
        })
      );

      const created = state.polls[0];
      assert.equal(created.title, 'Khảo sát món ăn trưa thứ Sáu');
      assert.equal(created.status, 'da_tao');
      assert.equal(created.totalVotes, 0);
      assert.equal(created.options.length, 3);
      assert.equal(created.audienceScope, undefined);
    });

    await t.test('updates poll only when in da_tao status (BR02)', () => {
      let state = freshState();
      const draftPoll = state.polls.find((p) => p.status === 'da_tao');
      assert.ok(draftPoll);

      state = pollReducer(
        state,
        updatePoll({
          id: draftPoll.id,
          title: 'Tiêu đề bản nháp cập nhật',
        })
      );
      const updated = state.polls.find((p) => p.id === draftPoll.id);
      assert.equal(updated.title, 'Tiêu đề bản nháp cập nhật');

      // Attempt update on active poll should be ignored
      const activePoll = state.polls.find((p) => p.status === 'da_gui');
      const originalTitle = activePoll.title;
      state = pollReducer(
        state,
        updatePoll({
          id: activePoll.id,
          title: 'Cố gắng sửa khi đang diễn ra',
        })
      );
      const activeCheck = state.polls.find((p) => p.id === activePoll.id);
      assert.equal(activeCheck.title, originalTitle);
    });

    await t.test('dispatches poll and transitions to da_gui with audience bindings (BR05)', () => {
      let state = freshState();
      const draftPoll = state.polls.find((p) => p.status === 'da_tao');
      assert.ok(draftPoll);

      state = pollReducer(
        state,
        sendPoll({
          pollId: draftPoll.id,
          audienceScope: 'lop_hoc',
          targetClassIds: ['class-1a', 'class-6a'],
          targetClassNames: ['1A', '6A'],
        })
      );

      const dispatched = state.polls.find((p) => p.id === draftPoll.id);
      assert.equal(dispatched.status, 'da_gui');
      assert.equal(dispatched.audienceScope, 'lop_hoc');
      assert.deepEqual(dispatched.targetClassIds, ['class-1a', 'class-6a']);
      assert.ok(dispatched.sentAt);
    });

    await t.test('deletes draft poll safely but rejects active or closed poll deletion (BR02)', () => {
      let state = freshState();
      const draftPoll = state.polls.find((p) => p.status === 'da_tao');
      assert.ok(draftPoll);

      // Delete draft poll
      state = pollReducer(state, deletePoll(draftPoll.id));
      assert.equal(state.polls.find((p) => p.id === draftPoll.id), undefined);

      // Attempt to delete active poll must be rejected
      const activePoll = state.polls.find((p) => p.status === 'da_gui');
      state = pollReducer(state, deletePoll(activePoll.id));
      assert.ok(state.polls.find((p) => p.id === activePoll.id));
    });

    await t.test('casts vote and appends to voteHistory (BR08 & K042)', () => {
      let state = freshState();
      const activePoll = state.polls.find((p) => p.status === 'da_gui');
      assert.ok(activePoll);

      const targetOpt = activePoll.options[0].id;
      const initialTotalVotes = activePoll.totalVotes;

      state = pollReducer(
        state,
        castVote({
          pollId: activePoll.id,
          studentId: 'test-stu-999',
          selectedOptionIds: [targetOpt],
          voterName: 'PH Em Tuấn Hưng',
        })
      );

      const updatedPoll = state.polls.find((p) => p.id === activePoll.id);
      assert.equal(updatedPoll.totalVotes, initialTotalVotes + 1);

      const roster = state.voters[activePoll.id];
      const voter = roster.find((v) => v.studentId === 'test-stu-999');
      assert.ok(voter);
      assert.equal(voter.hasVoted, true);
      assert.equal(voter.voteHistory.length, 1);
      assert.deepEqual(voter.voteHistory[0].selectedOptionIds, [targetOpt]);

      // Now voter revises their choice (BR08)
      const secondOpt = activePoll.options[1].id;
      state = pollReducer(
        state,
        castVote({
          pollId: activePoll.id,
          studentId: 'test-stu-999',
          selectedOptionIds: [secondOpt],
          voterName: 'PH Em Tuấn Hưng',
        })
      );

      const revisedPoll = state.polls.find((p) => p.id === activePoll.id);
      // Total votes should NOT increase on revision, previous option subtracted and new added!
      assert.equal(revisedPoll.totalVotes, initialTotalVotes + 1);

      const revisedVoter = state.voters[activePoll.id].find((v) => v.studentId === 'test-stu-999');
      assert.equal(revisedVoter.voteHistory.length, 2);
      assert.deepEqual(revisedVoter.voteHistory[1].selectedOptionIds, [secondOpt]);
    });

    await t.test('manages modal open and close states properly', () => {
      let state = freshState();
      state = pollReducer(state, openSendModal('poll-001'));
      assert.equal(state.activeModal, 'send');
      assert.equal(state.modalTargetPollId, 'poll-001');

      state = pollReducer(state, closeModal());
      assert.equal(state.activeModal, 'none');
      assert.equal(state.modalTargetPollId, null);

      state = pollReducer(state, openHistoryModal({ pollId: 'poll-001', studentId: 'stu-101' }));
      assert.equal(state.activeModal, 'history');
      assert.equal(state.modalTargetPollId, 'poll-001');
      assert.equal(state.modalTargetStudentId, 'stu-101');
    });
  });
});
