import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeVietnameseText,
  searchAnnouncements,
  filterAnnouncements,
  calculateAnnouncementKPIs,
  validateChannels,
  validateAudienceTargets,
  validateDraftMutability,
  validateScheduleTime,
  validateAttachment,
  validateAnnouncementPayload,
  resolveRecipientBreakdown,
  getCategoryLabel,
  getStatusBadge,
  getPriorityBadge,
  getAudienceScopeLabel
} from '../../src/utils/announcementValidation.ts';

import announcementReducer, {
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
  toggleSelectForBulk,
  selectAllForBulk,
  clearBulkSelection
} from '../../src/store/slices/announcementSlice.ts';

import {
  INITIAL_MOCK_ANNOUNCEMENTS,
  MOCK_SCHOOL_CLASSES_FOR_TARGETING
} from '../../src/services/mockAnnouncementData.ts';

test('School Announcement Board (Nhà Trường — Bảng Thông Tin) Business Rules & Engine', async (t) => {

  await t.test('BR01 & BR05: Multi-Criteria Filtering, Pinned Sorting, and Accent-Insensitive Search', async (t) => {
    await t.test('normalizes Vietnamese text and removes diacritics', () => {
      assert.equal(normalizeVietnameseText('Học Phí Tháng 10'), 'hoc phi thang 10');
      assert.equal(normalizeVietnameseText('Bão Số 4 Khẩn Cấp Đang Đến'), 'bao so 4 khan cap dang den');
    });

    await t.test('searches announcements without diacritic friction', () => {
      const results = searchAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, 'hoc phi');
      assert.ok(results.length >= 1);
      assert.ok(results.some(a => a.id === 'ann-001'));

      const resultsStem = searchAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, 'stem');
      assert.ok(resultsStem.some(a => a.id === 'ann-003'));
    });

    await t.test('filters announcements by status (da_gui, da_len_lich, nhap)', () => {
      const sent = filterAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, {
        searchQuery: '',
        statusFilter: 'da_gui',
        categoryFilter: 'all',
        channelFilter: 'all'
      });
      assert.ok(sent.every(a => a.status === 'da_gui'));

      const scheduled = filterAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, {
        searchQuery: '',
        statusFilter: 'da_len_lich',
        categoryFilter: 'all',
        channelFilter: 'all'
      });
      assert.ok(scheduled.every(a => a.status === 'da_len_lich'));

      const drafts = filterAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, {
        searchQuery: '',
        statusFilter: 'nhap',
        categoryFilter: 'all',
        channelFilter: 'all'
      });
      assert.ok(drafts.every(a => a.status === 'nhap'));
    });

    await t.test('filters announcements by category and channel', () => {
      const feeCategory = filterAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, {
        searchQuery: '',
        statusFilter: 'all',
        categoryFilter: 'hoc_phi',
        channelFilter: 'all'
      });
      assert.ok(feeCategory.every(a => a.category === 'hoc_phi'));

      const smsAnnouncements = filterAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, {
        searchQuery: '',
        statusFilter: 'all',
        categoryFilter: 'all',
        channelFilter: 'sms'
      });
      assert.ok(smsAnnouncements.every(a => a.channels.includes('sms')));
    });

    await t.test('always floats pinned announcements to the top', () => {
      const filtered = filterAnnouncements(INITIAL_MOCK_ANNOUNCEMENTS, {
        searchQuery: '',
        statusFilter: 'all',
        categoryFilter: 'all',
        channelFilter: 'all'
      });
      assert.equal(filtered[0].isPinned, true);
      assert.equal(filtered[1].isPinned, true);
    });
  });

  await t.test('BR04: Summary Metric KPI Calculations', () => {
    const kpis = calculateAnnouncementKPIs(INITIAL_MOCK_ANNOUNCEMENTS);
    assert.equal(kpis.totalAnnouncements, INITIAL_MOCK_ANNOUNCEMENTS.length);
    assert.equal(kpis.publishedCount, 4);
    assert.equal(kpis.scheduledCount, 1);
    assert.equal(kpis.draftCount, 1);
  });

  await t.test('VR-ANN-01 & BR01: Channel Validation', () => {
    const emptyCheck = validateChannels([]);
    assert.equal(emptyCheck.valid, false);
    assert.ok(emptyCheck.error.includes('chọn ít nhất một kênh'));

    const validCheck = validateChannels(['portal', 'email']);
    assert.equal(validCheck.valid, true);
  });

  await t.test('VR-ANN-02 & BR03: Audience Scope & Recipient Breakdown Resolution', () => {
    const gradeEmpty = validateAudienceTargets('khoi_lop', [], []);
    assert.equal(gradeEmpty.valid, false);
    assert.ok(gradeEmpty.error.includes('khối lớp'));

    const classEmpty = validateAudienceTargets('lop_hoc', [], []);
    assert.equal(classEmpty.valid, false);
    assert.ok(classEmpty.error.includes('lớp học'));

    const scopeValid = validateAudienceTargets('toan_truong', [], []);
    assert.equal(scopeValid.valid, true);

    // Test breakdown resolution
    const breakdown = resolveRecipientBreakdown(
      'lop_hoc',
      [],
      ['c10a1', 'c10a2'],
      'all',
      MOCK_SCHOOL_CLASSES_FOR_TARGETING
    );
    assert.equal(breakdown.studentCount, 70); // 35 + 35
    assert.equal(breakdown.parentCount, 126); // 70 * 1.8
    assert.equal(breakdown.teacherCount, 4); // 2 * 2
    assert.equal(breakdown.classBreakdown.length, 2);
  });

  await t.test('VR-ANN-04, BR02, K038: Strict Draft-Only Mutability Guardrail', () => {
    const publishedNotice = INITIAL_MOCK_ANNOUNCEMENTS.find(a => a.status === 'da_gui');
    const draftNotice = INITIAL_MOCK_ANNOUNCEMENTS.find(a => a.status === 'nhap');

    const publishedCheck = validateDraftMutability(publishedNotice);
    assert.equal(publishedCheck.valid, false);
    assert.ok(publishedCheck.error.includes('Không thể chỉnh sửa thông báo đã phát hành'));

    const draftCheck = validateDraftMutability(draftNotice);
    assert.equal(draftCheck.valid, true);
  });

  await t.test('VR-ANN-05: Attachment Size Guardrail', () => {
    const validFile = { name: 'document.pdf', size: 10 * 1024 * 1024 }; // 10MB
    const oversizedFile = { name: 'heavy_video.mp4', size: 30 * 1024 * 1024 }; // 30MB

    assert.equal(validateAttachment(validFile).valid, true);
    const oversizedCheck = validateAttachment(oversizedFile);
    assert.equal(oversizedCheck.valid, false);
    assert.ok(oversizedCheck.error.includes('vượt quá dung lượng'));
  });

  await t.test('VR-ANN-06 & BR07: Future Scheduled Publishing', () => {
    const pastDate = new Date(Date.now() - 3600000).toISOString();
    const futureDate = new Date(Date.now() + 86400000).toISOString();

    const pastCheck = validateScheduleTime(pastDate);
    assert.equal(pastCheck.valid, false);
    assert.ok(pastCheck.error.includes('phải lớn hơn thời điểm hiện tại'));

    const futureCheck = validateScheduleTime(futureDate);
    assert.equal(futureCheck.valid, true);
  });

  await t.test('Complete Announcement Payload Validation', () => {
    const invalidPayload = {
      title: 'abc', // < 5 chars
      content: '',
      channels: []
    };
    const check = validateAnnouncementPayload(invalidPayload);
    assert.equal(check.valid, false);
    assert.ok(check.errors.title);
    assert.ok(check.errors.content);
    assert.ok(check.errors.category);
    assert.ok(check.errors.channels);
  });

  await t.test('Visual and Formatting Helpers', () => {
    assert.equal(getCategoryLabel('hoc_phi'), 'Học phí & Thu chi');
    assert.equal(getStatusBadge('da_gui').label, 'Đã gửi');
    assert.equal(getStatusBadge('da_len_lich').label, 'Đã lên lịch');
    assert.equal(getStatusBadge('nhap').label, 'Bản nháp');
    assert.equal(getPriorityBadge('urgent').label, 'Hỏa tốc');
    assert.equal(getAudienceScopeLabel('toan_truong'), 'Toàn trường');
  });

  await t.test('Redux State Machine Mutations & Guardrails', async (t) => {
    let state = announcementReducer(undefined, { type: '@@INIT' });
    assert.equal(state.announcements.length, INITIAL_MOCK_ANNOUNCEMENTS.length);

    await t.test('createAnnouncement prepends new item to list', () => {
      state = announcementReducer(
        state,
        createAnnouncement({
          schoolCode: 'demo',
          title: 'Thông báo xét nghiệm sức khỏe đầu năm',
          excerpt: 'Lịch khám nha khoa và mắt cho học sinh',
          content: '<p>Chi tiết lịch khám...</p>',
          category: 'chung',
          priority: 'normal',
          status: 'nhap',
          channels: ['portal'],
          audienceScope: 'toan_truong',
          subAudience: 'all',
          targetGradeIds: [],
          targetClassIds: [],
          targetStaffRoles: [],
          attachments: [],
          createdBy: 'usr-nurse',
          authorName: 'Phòng Y Tế',
          authorRole: 'Y sĩ',
          isPinned: false,
          recipientCount: 300
        })
      );
      assert.equal(state.announcements[0].title, 'Thông báo xét nghiệm sức khỏe đầu năm');
      assert.equal(state.announcements[0].status, 'nhap');
    });

    await t.test('updateDraftAnnouncement mutates draft and rejects published announcement', () => {
      const newDraftId = state.announcements[0].id;
      state = announcementReducer(
        state,
        updateDraftAnnouncement({
          id: newDraftId,
          updates: { title: 'Thông báo xét nghiệm sức khỏe (Đã cập nhật)' }
        })
      );
      assert.equal(state.announcements[0].title, 'Thông báo xét nghiệm sức khỏe (Đã cập nhật)');

      // Attempting to mutate published announcement 'ann-001' must throw
      assert.throws(() => {
        announcementReducer(
          state,
          updateDraftAnnouncement({
            id: 'ann-001',
            updates: { title: 'Illegal Mutated Title' }
          })
        );
      }, /Không thể chỉnh sửa thông báo đã phát hành/);
    });

    await t.test('publishAnnouncement updates status to da_gui and records publishedAt', () => {
      const draftId = state.announcements[0].id;
      state = announcementReducer(state, publishAnnouncement({ id: draftId }));
      assert.equal(state.announcements[0].status, 'da_gui');
      assert.ok(state.announcements[0].publishedAt);
    });

    await t.test('scheduleAnnouncement and cancelScheduledAnnouncement cycle', () => {
      const futureIso = new Date(Date.now() + 86400000).toISOString();
      state = announcementReducer(
        state,
        scheduleAnnouncement({ id: 'ann-005', scheduledAt: futureIso })
      );
      const scheduledItem = state.announcements.find(a => a.id === 'ann-005');
      assert.equal(scheduledItem.status, 'da_len_lich');
      assert.equal(scheduledItem.scheduledAt, futureIso);

      state = announcementReducer(state, cancelScheduledAnnouncement({ id: 'ann-005' }));
      const revertedItem = state.announcements.find(a => a.id === 'ann-005');
      assert.equal(revertedItem.status, 'nhap');
    });

    await t.test('togglePinAnnouncement toggles isPinned boolean', () => {
      const initialPin = state.announcements.find(a => a.id === 'ann-004').isPinned;
      state = announcementReducer(state, togglePinAnnouncement({ id: 'ann-004' }));
      assert.equal(state.announcements.find(a => a.id === 'ann-004').isPinned, !initialPin);
    });

    await t.test('deleteAnnouncement removes single record', () => {
      const initialCount = state.announcements.length;
      state = announcementReducer(state, deleteAnnouncement({ id: 'ann-006' }));
      assert.equal(state.announcements.length, initialCount - 1);
      assert.ok(!state.announcements.some(a => a.id === 'ann-006'));
    });

    await t.test('bulk selection and deleteMultipleAnnouncements', () => {
      state = announcementReducer(state, toggleSelectForBulk('ann-002'));
      state = announcementReducer(state, toggleSelectForBulk('ann-003'));
      assert.equal(state.selectedIdsForBulk.length, 2);

      state = announcementReducer(
        state,
        deleteMultipleAnnouncements({ ids: ['ann-002', 'ann-003'] })
      );
      assert.ok(!state.announcements.some(a => a.id === 'ann-002'));
      assert.ok(!state.announcements.some(a => a.id === 'ann-003'));
      assert.equal(state.selectedIdsForBulk.length, 0);
    });

    await t.test('filter reducer actions', () => {
      state = announcementReducer(state, setSearchQuery('bao so 4'));
      assert.equal(state.filters.searchQuery, 'bao so 4');

      state = announcementReducer(state, setStatusFilter('da_gui'));
      assert.equal(state.filters.statusFilter, 'da_gui');

      state = announcementReducer(state, setCategoryFilter('khan_cap'));
      assert.equal(state.filters.categoryFilter, 'khan_cap');

      state = announcementReducer(state, setChannelFilter('sms'));
      assert.equal(state.filters.channelFilter, 'sms');

      state = announcementReducer(state, resetFilters());
      assert.equal(state.filters.searchQuery, '');
      assert.equal(state.filters.statusFilter, 'all');
      assert.equal(state.filters.categoryFilter, 'all');
      assert.equal(state.filters.channelFilter, 'all');
    });
  });
});
