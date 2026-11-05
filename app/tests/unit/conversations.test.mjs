import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAbsenceAction,
  generateSystemAuditMessage,
  deduplicateParentRecipients,
  filterConversations,
  filterMessagesByCategory,
  recallChatMessage,
} from '../../src/utils/conversationValidation.ts';

describe('Parent Messaging Validation Rules (Vận Hành - Trao đổi)', () => {
  describe('BR03: Absence Status Transition Rule', () => {
    it('approves absence from cho_xu_ly to da_xac_nhan', () => {
      const result = validateAbsenceAction('cho_xu_ly', 'approve');
      assert.equal(result.isValid, true);
      assert.equal(result.newStatus, 'da_xac_nhan');
    });

    it('cancels absence from cho_xu_ly to da_huy', () => {
      const result = validateAbsenceAction('cho_xu_ly', 'cancel');
      assert.equal(result.isValid, true);
      assert.equal(result.newStatus, 'da_huy');
    });

    it('rejects action on already confirmed absence', () => {
      const result = validateAbsenceAction('da_xac_nhan', 'cancel');
      assert.equal(result.isValid, false);
      assert.match(result.error, /đã được xử lý trước đó/);
    });

    it('rejects action on already cancelled absence', () => {
      const result = validateAbsenceAction('da_huy', 'approve');
      assert.equal(result.isValid, false);
      assert.match(result.error, /đã được xử lý trước đó/);
    });
  });

  describe('BR04: Automated System Audit Log Generation', () => {
    it('generates approval audit text with teacher and student names', () => {
      const log = generateSystemAuditMessage('Nguyễn Mai Anh', 'Đỗ Nam', 'approve');
      assert.equal(log, 'Giáo viên Nguyễn Mai Anh đã xác nhận báo vắng cho học sinh Đỗ Nam');
    });

    it('generates cancellation audit text with teacher and student names', () => {
      const log = generateSystemAuditMessage('Nguyễn Mai Anh', 'Đỗ Nam', 'cancel');
      assert.equal(log, 'Giáo viên Nguyễn Mai Anh đã hủy báo vắng cho học sinh Đỗ Nam');
    });
  });

  describe('BR08: Parent Recipient Deduplication in Groups', () => {
    it('merges multiple children of the same parent into a single recipient item', () => {
      const students = [
        { id: 'hs-1', name: 'Đỗ Nam', parentId: 'ph-1', parentName: 'Đỗ Tuấn' },
        { id: 'hs-2', name: 'Đỗ Hải', parentId: 'ph-1', parentName: 'Đỗ Tuấn' },
        { id: 'hs-3', name: 'Lê Minh', parentId: 'ph-2', parentName: 'Lê Hoàng' },
      ];

      const recipients = deduplicateParentRecipients(students);
      assert.equal(recipients.length, 2);

      const doTuan = recipients.find((r) => r.id === 'ph-1');
      assert.ok(doTuan);
      assert.deepEqual(doTuan.childrenNames, ['Đỗ Nam', 'Đỗ Hải']);

      const leHoang = recipients.find((r) => r.id === 'ph-2');
      assert.ok(leHoang);
      assert.deepEqual(leHoang.childrenNames, ['Lê Minh']);
    });

    it('preserves manually added teachers and parents with isManualAddition flag', () => {
      const students = [
        { id: 'hs-1', name: 'Đỗ Nam', parentId: 'ph-1', parentName: 'Đỗ Tuấn' },
      ];
      const manual = [
        { id: 'gv-2', name: 'Thầy David', role: 'giao_vien', isManualAddition: true },
      ];

      const recipients = deduplicateParentRecipients(students, manual);
      assert.equal(recipients.length, 2);
      assert.equal(recipients[1].isManualAddition, true);
    });
  });

  describe('BR10: Multi-Factor Conversation Deep Search', () => {
    const mockConversations = [
      {
        id: 'conv-1',
        type: 'ca_nhan',
        title: 'Trao đổi với PH Đỗ Nam',
        studentName: 'Đỗ Nam',
        classId: 'lop-1a1',
      },
      {
        id: 'conv-2',
        type: 'nhom',
        title: 'Ban Đại Diện Cha Mẹ',
        classId: 'lop-1a1',
      },
      {
        id: 'conv-3',
        type: 'ca_nhan',
        title: 'Trao đổi với PH Lê Minh',
        studentName: 'Lê Minh',
        classId: 'lop-1a2',
      },
    ];

    const studentMap = {
      'conv-2': ['Đỗ Nam', 'Trần Thảo', 'Vũ Phong'],
    };

    it('finds group conversation when searching for an inner student name', () => {
      const results = filterConversations(mockConversations, 'Nam', 'all', studentMap);
      assert.equal(results.length, 2);
      assert.ok(results.some((c) => c.id === 'conv-1'));
      assert.ok(results.some((c) => c.id === 'conv-2')); // Matched inner student 'Đỗ Nam'
    });

    it('filters by classId correctly', () => {
      const results = filterConversations(mockConversations, '', 'lop-1a2', studentMap);
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 'conv-3');
    });
  });

  describe('BR02 & BR12: Category Filter & Message Recall', () => {
    const messages = [
      { id: 'm-1', category: 'tin_nhan', content: 'Chào cô ạ' },
      { id: 'm-2', category: 'bao_vang', content: 'Xin phép cho con nghỉ' },
      { id: 'm-3', category: 'dan_thuoc', content: 'Uống thuốc ho sau ăn' },
    ];

    it('filters message stream by category', () => {
      const leaveMsgs = filterMessagesByCategory(messages, 'bao_vang');
      assert.equal(leaveMsgs.length, 1);
      assert.equal(leaveMsgs[0].id, 'm-2');
    });

    it('recalls message setting isRecalled flag and placeholder content', () => {
      const recalled = recallChatMessage(messages[0]);
      assert.equal(recalled.isRecalled, true);
      assert.match(recalled.content, /đã được thu hồi/);
    });
  });

  describe('Redux Conversation Reducer State Transitions', () => {
    // Import reducer dynamically to test Redux store transitions
    it('executes absence review and appends automated system audit log in Redux', async () => {
      const { default: conversationReducer, reviewAbsence, sendMessage } = await import('../../src/store/slices/conversationSlice.ts');
      
      const initialState = {
        conversations: [{ id: 'conv-1', title: 'PH Đỗ Nam', hasSchoolResponse: false, unreadCount: 0, studentIds: [], recipients: [], importantAlertsCount: 1 }],
        activeConversationId: 'conv-1',
        messagesByConversation: {
          'conv-1': [
            {
              id: 'm-abs',
              conversationId: 'conv-1',
              senderId: 'ph-1',
              senderName: 'Mẹ Đỗ Nam',
              senderRole: 'phu_huynh',
              category: 'bao_vang',
              content: 'Xin nghỉ học',
              timestamp: '09:00',
              absenceData: {
                id: 'abs-1',
                studentId: 'hs-1',
                studentName: 'Đỗ Nam',
                startDate: '15/09/2026',
                endDate: '15/09/2026',
                reason: 'Về quê',
                status: 'cho_xu_ly',
              },
            },
          ],
        },
        importantAlertsByConversation: {},
        searchQuery: '',
        classFilter: 'all',
        categoryFilter: null,
        dateFilter: null,
      };

      // Review absence
      const nextState = conversationReducer(initialState, reviewAbsence({
        conversationId: 'conv-1',
        messageId: 'm-abs',
        actionType: 'approve',
        reviewerName: 'Cô Nguyễn Mai Anh',
      }));

      const msgs = nextState.messagesByConversation['conv-1'];
      assert.equal(msgs.length, 2); // Original msg + auto audit log
      assert.equal(msgs[0].absenceData.status, 'da_xac_nhan');
      assert.equal(msgs[1].isSystemAudit, true);
      assert.match(msgs[1].content, /Giáo viên Cô Nguyễn Mai Anh đã xác nhận báo vắng cho học sinh Đỗ Nam/);
      assert.equal(nextState.conversations[0].hasSchoolResponse, true); // BR09 star indicator set
    });

    it('toggles lock parents and archives chat with reversibility and audit logs', async () => {
      const { default: conversationReducer, toggleLockParents, toggleArchiveChat } = await import('../../src/store/slices/conversationSlice.ts');

      let state = {
        conversations: [{ id: 'conv-1', title: 'PH Đỗ Nam', isParentLocked: false, isArchived: false }],
        messagesByConversation: { 'conv-1': [] },
      };

      // Lock parents
      state = conversationReducer(state, toggleLockParents({ conversationId: 'conv-1' }));
      assert.equal(state.conversations[0].isParentLocked, true);
      assert.match(state.messagesByConversation['conv-1'][0].content, /đã khóa quyền gửi tin nhắn của phụ huynh/);

      // Reverse lock parents (Unlock)
      state = conversationReducer(state, toggleLockParents({ conversationId: 'conv-1' }));
      assert.equal(state.conversations[0].isParentLocked, false);
      assert.match(state.messagesByConversation['conv-1'][1].content, /đã mở khóa quyền gửi tin nhắn cho phụ huynh/);

      // Archive chat
      state = conversationReducer(state, toggleArchiveChat({ conversationId: 'conv-1' }));
      assert.equal(state.conversations[0].isArchived, true);
      assert.match(state.messagesByConversation['conv-1'][2].content, /đã được lưu trữ và khóa gửi tin đối với tất cả thành viên/);

      // Reverse archive (Unarchive)
      state = conversationReducer(state, toggleArchiveChat({ conversationId: 'conv-1' }));
      assert.equal(state.conversations[0].isArchived, false);
      assert.match(state.messagesByConversation['conv-1'][3].content, /đã được khôi phục từ mục lưu trữ/);
    });

    it('enforces maximum 3 pinned messages per chat and allows unpinning', async () => {
      const { default: conversationReducer, pinMessage, unpinMessage } = await import('../../src/store/slices/conversationSlice.ts');

      let state = {
        conversations: [{ id: 'conv-1', title: 'PH Đỗ Nam', pinnedMessageIds: [] }],
        messagesByConversation: { 'conv-1': [] },
      };

      // Pin 1st, 2nd, 3rd messages
      state = conversationReducer(state, pinMessage({ conversationId: 'conv-1', messageId: 'msg-1' }));
      state = conversationReducer(state, pinMessage({ conversationId: 'conv-1', messageId: 'msg-2' }));
      state = conversationReducer(state, pinMessage({ conversationId: 'conv-1', messageId: 'msg-3' }));
      assert.equal(state.conversations[0].pinnedMessageIds.length, 3);
      assert.deepEqual(state.conversations[0].pinnedMessageIds, ['msg-1', 'msg-2', 'msg-3']);

      // Attempt to pin 4th message - should be rejected / blocked
      state = conversationReducer(state, pinMessage({ conversationId: 'conv-1', messageId: 'msg-4' }));
      assert.equal(state.conversations[0].pinnedMessageIds.length, 3);
      assert.ok(!state.conversations[0].pinnedMessageIds.includes('msg-4'));

      // Unpin msg-2
      state = conversationReducer(state, unpinMessage({ conversationId: 'conv-1', messageId: 'msg-2' }));
      assert.equal(state.conversations[0].pinnedMessageIds.length, 2);
      assert.deepEqual(state.conversations[0].pinnedMessageIds, ['msg-1', 'msg-3']);

      // Now pin msg-4 succeeds
      state = conversationReducer(state, pinMessage({ conversationId: 'conv-1', messageId: 'msg-4' }));
      assert.equal(state.conversations[0].pinnedMessageIds.length, 3);
      assert.deepEqual(state.conversations[0].pinnedMessageIds, ['msg-1', 'msg-3', 'msg-4']);
    });
  });
});
