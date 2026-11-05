import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ChatMessage,
  Conversation,
  ImportantAlert,
  MessageCategory,
  ConversationRecipient,
} from '../../types/conversation.ts';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_IMPORTANT_ALERTS,
} from '../../services/mockConversationData.ts';
import {
  validateAbsenceAction,
  generateSystemAuditMessage,
  recallChatMessage,
} from '../../utils/conversationValidation.ts';

export interface ConversationState {
  conversations: Conversation[];
  activeConversationId: string;
  messagesByConversation: Record<string, ChatMessage[]>;
  importantAlertsByConversation: Record<string, ImportantAlert[]>;
  searchQuery: string;
  classFilter: string;
  categoryFilter: MessageCategory | null;
  dateFilter: string | null;
}

const initialState: ConversationState = {
  conversations: INITIAL_CONVERSATIONS,
  activeConversationId: 'conv-1',
  messagesByConversation: INITIAL_MESSAGES,
  importantAlertsByConversation: INITIAL_IMPORTANT_ALERTS,
  searchQuery: '',
  classFilter: 'all',
  categoryFilter: null,
  dateFilter: null,
};

export const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
      state.categoryFilter = null; // Reset category filter on switch
      if (action.payload) {
        const conv = state.conversations.find((c) => c.id === action.payload);
        if (conv) {
          conv.unreadCount = 0; // Mark as read
        }
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setClassFilter: (state, action: PayloadAction<string>) => {
      state.classFilter = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<MessageCategory | null>) => {
      state.categoryFilter = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<string | null>) => {
      state.dateFilter = action.payload;
    },
    sendMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        content: string;
        category?: MessageCategory;
        attachments?: { name: string; url: string }[];
      }>
    ) => {
      const { conversationId, content, category = 'tin_nhan', attachments } = action.payload;
      if (!content.trim() && (!attachments || attachments.length === 0)) return;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: 'gv-me',
        senderName: 'Cô Nguyễn Mai Anh (Tôi)',
        senderRole: 'giao_vien',
        category,
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        attachments,
      };

      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(newMsg);

      // Update conversation snippet and star indicator
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.lastMessageSnippet = newMsg.content || 'Đã gửi tệp đính kèm';
        conv.lastMessageTimestamp = newMsg.timestamp;
        conv.hasSchoolResponse = true; // BR09
      }
    },
    reviewAbsence: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        actionType: 'approve' | 'cancel';
        reviewerName?: string;
      }>
    ) => {
      const { conversationId, messageId, actionType, reviewerName = 'Nguyễn Mai Anh' } = action.payload;
      const msgs = state.messagesByConversation[conversationId];
      if (!msgs) return;

      const targetMsg = msgs.find((m) => m.id === messageId);
      if (!targetMsg || !targetMsg.absenceData) return;

      const validation = validateAbsenceAction(targetMsg.absenceData.status, actionType);
      if (!validation.isValid) return;

      targetMsg.absenceData.status = validation.newStatus;
      targetMsg.absenceData.reviewedBy = reviewerName;
      targetMsg.absenceData.reviewedAt = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      // BR04: Generate automated system audit log
      const auditContent = generateSystemAuditMessage(
        reviewerName,
        targetMsg.absenceData.studentName,
        actionType
      );

      const auditMsg: ChatMessage = {
        id: `audit-${Date.now()}`,
        conversationId,
        senderId: 'system',
        senderName: 'Hệ thống tự động',
        senderRole: 'he_thong',
        category: 'tin_nhan',
        content: auditContent,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isSystemAudit: true,
      };

      msgs.push(auditMsg);

      // Update conversation snippet
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.lastMessageSnippet = auditContent;
        conv.lastMessageTimestamp = auditMsg.timestamp;
        conv.hasSchoolResponse = true;
      }
    },
    recallMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      const msgs = state.messagesByConversation[conversationId];
      if (!msgs) return;

      const targetIndex = msgs.findIndex((m) => m.id === messageId);
      if (targetIndex !== -1) {
        msgs[targetIndex] = recallChatMessage(msgs[targetIndex]);
      }
    },
    createConversation: (
      state,
      action: PayloadAction<{
        type: 'ca_nhan' | 'nhom';
        title: string;
        classId: string;
        className: string;
        studentId?: string;
        studentName?: string;
        studentIds?: string[];
        recipients?: ConversationRecipient[];
        initialMessage?: string;
        category?: MessageCategory;
      }>
    ) => {
      const payload = action.payload;
      const newId = `conv-${Date.now()}`;

      const newConv: Conversation = {
        id: newId,
        type: payload.type,
        title: payload.title,
        classId: payload.classId,
        className: payload.className,
        studentId: payload.studentId,
        studentName: payload.studentName,
        hasSchoolResponse: true,
        lastMessageSnippet: payload.initialMessage || 'Đã tạo cuộc trò chuyện mới',
        lastMessageTimestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        unreadCount: 0,
        studentIds: payload.studentIds || (payload.studentId ? [payload.studentId] : []),
        recipients: payload.recipients || [],
        importantAlertsCount: 0,
      };

      state.conversations.unshift(newConv);
      state.activeConversationId = newId;

      if (payload.initialMessage) {
        state.messagesByConversation[newId] = [
          {
            id: `msg-${Date.now()}`,
            conversationId: newId,
            senderId: 'gv-me',
            senderName: 'Cô Nguyễn Mai Anh',
            senderRole: 'giao_vien',
            category: payload.category || 'tin_nhan',
            content: payload.initialMessage,
            timestamp: newConv.lastMessageTimestamp,
          },
        ];
      } else {
        state.messagesByConversation[newId] = [];
      }
    },
    dismissImportantAlert: (
      state,
      action: PayloadAction<{ conversationId: string; alertId: string }>
    ) => {
      const { conversationId, alertId } = action.payload;
      const alerts = state.importantAlertsByConversation[conversationId];
      if (alerts) {
        state.importantAlertsByConversation[conversationId] = alerts.filter((a) => a.id !== alertId);
        const conv = state.conversations.find((c) => c.id === conversationId);
        if (conv && conv.importantAlertsCount > 0) {
          conv.importantAlertsCount -= 1;
        }
      }
    },
    removeStudentFromGroup: (
      state,
      action: PayloadAction<{ conversationId: string; studentId: string }>
    ) => {
      const { conversationId, studentId } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.studentIds = conv.studentIds.filter((id) => id !== studentId);
      }
    },
    addRecipientToGroup: (
      state,
      action: PayloadAction<{ conversationId: string; recipient: ConversationRecipient }>
    ) => {
      const { conversationId, recipient } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.recipients.push(recipient);
      }
    },
    toggleLockParents: (
      state,
      action: PayloadAction<{ conversationId: string }>
    ) => {
      const { conversationId } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (!conv) return;

      conv.isParentLocked = !conv.isParentLocked;

      // Add system audit message
      const auditText = conv.isParentLocked
        ? 'Giáo viên đã khóa quyền gửi tin nhắn của phụ huynh trong cuộc trò chuyện này.'
        : 'Giáo viên đã mở khóa quyền gửi tin nhắn cho phụ huynh.';

      const auditMsg: ChatMessage = {
        id: `audit-${Date.now()}`,
        conversationId,
        senderId: 'system',
        senderName: 'Hệ thống tự động',
        senderRole: 'he_thong',
        category: 'tin_nhan',
        content: auditText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isSystemAudit: true,
      };

      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(auditMsg);
      conv.lastMessageSnippet = auditText;
      conv.lastMessageTimestamp = auditMsg.timestamp;
    },
    toggleArchiveChat: (
      state,
      action: PayloadAction<{ conversationId: string }>
    ) => {
      const { conversationId } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (!conv) return;

      conv.isArchived = !conv.isArchived;

      // Add system audit message
      const auditText = conv.isArchived
        ? 'Cuộc trò chuyện đã được lưu trữ và khóa gửi tin đối với tất cả thành viên.'
        : 'Cuộc trò chuyện đã được khôi phục từ mục lưu trữ.';

      const auditMsg: ChatMessage = {
        id: `audit-${Date.now()}`,
        conversationId,
        senderId: 'system',
        senderName: 'Hệ thống tự động',
        senderRole: 'he_thong',
        category: 'tin_nhan',
        content: auditText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isSystemAudit: true,
      };

      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      state.messagesByConversation[conversationId].push(auditMsg);
      conv.lastMessageSnippet = auditText;
      conv.lastMessageTimestamp = auditMsg.timestamp;
    },
    pinMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (!conv) return;

      if (!conv.pinnedMessageIds) {
        conv.pinnedMessageIds = [];
      }

      if (conv.pinnedMessageIds.includes(messageId)) return;
      if (conv.pinnedMessageIds.length >= 3) return; // Enforce max 3 pinned

      conv.pinnedMessageIds.push(messageId);
    },
    unpinMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (!conv || !conv.pinnedMessageIds) return;

      conv.pinnedMessageIds = conv.pinnedMessageIds.filter((id) => id !== messageId);
    },
  },
});

export const {
  setActiveConversation,
  setSearchQuery,
  setClassFilter,
  setCategoryFilter,
  setDateFilter,
  sendMessage,
  reviewAbsence,
  recallMessage,
  createConversation,
  dismissImportantAlert,
  removeStudentFromGroup,
  addRecipientToGroup,
  toggleLockParents,
  toggleArchiveChat,
  pinMessage,
  unpinMessage,
} = conversationSlice.actions;

export default conversationSlice.reducer;
