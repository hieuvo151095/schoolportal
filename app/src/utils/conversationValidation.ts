/**
 * Pure domain validation and business rules engine for Operations Parent Messaging (Trao Đổi)
 */

import type {
  AbsenceStatus,
  ChatMessage,
  Conversation,
  ConversationRecipient,
  MessageCategory,
} from '../types/conversation.ts';

/**
 * BR03: Absence Status Transition
 * Only 'cho_xu_ly' can be transitioned to 'da_xac_nhan' or 'da_huy'.
 */
export function validateAbsenceAction(
  currentStatus: AbsenceStatus,
  action: 'approve' | 'cancel'
): { isValid: boolean; newStatus: AbsenceStatus; error?: string } {
  if (currentStatus !== 'cho_xu_ly') {
    return {
      isValid: false,
      newStatus: currentStatus,
      error: 'Báo vắng này đã được xử lý trước đó và không thể thay đổi trạng thái.',
    };
  }

  return {
    isValid: true,
    newStatus: action === 'approve' ? 'da_xac_nhan' : 'da_huy',
  };
}

/**
 * BR04: Generate automated system audit log text
 */
export function generateSystemAuditMessage(
  reviewerName: string,
  studentName: string,
  action: 'approve' | 'cancel'
): string {
  const actionText = action === 'approve' ? 'xác nhận' : 'hủy';
  return `Giáo viên ${reviewerName} đã ${actionText} báo vắng cho học sinh ${studentName}`;
}

/**
 * BR08: Deduplicate multi-child parents in group conversations.
 * E.g. If Parent "Nguyễn Văn Tuấn" has children "Đỗ Nam" and "Đỗ Hải" in the same class/group,
 * they must be combined into a single entry: "PH của Đỗ Nam, Đỗ Hải".
 */
export function deduplicateParentRecipients(
  students: { id: string; name: string; parentId: string; parentName: string; parentAvatar?: string }[],
  manualRecipients: ConversationRecipient[] = []
): ConversationRecipient[] {
  const parentMap = new Map<string, ConversationRecipient>();

  for (const student of students) {
    if (parentMap.has(student.parentId)) {
      const existing = parentMap.get(student.parentId)!;
      if (existing.childrenNames && !existing.childrenNames.includes(student.name)) {
        existing.childrenNames.push(student.name);
      }
    } else {
      parentMap.set(student.parentId, {
        id: student.parentId,
        name: student.parentName,
        role: 'phu_huynh',
        avatar: student.parentAvatar,
        childrenNames: [student.name],
        isManualAddition: false,
      });
    }
  }

  const derivedParents = Array.from(parentMap.values());
  return [...derivedParents, ...manualRecipients];
}

/**
 * BR10: Deep search matching conversation title OR inner student member names.
 */
export function filterConversations(
  conversations: Conversation[],
  searchQuery: string,
  classId: string = 'all',
  studentNamesMap: Record<string, string[]> = {}
): Conversation[] {
  const cleanQuery = searchQuery.trim().toLowerCase();

  return conversations.filter((conv) => {
    // 1. Class filter
    if (classId !== 'all' && conv.classId !== classId) {
      return false;
    }

    // 2. If no search query, keep
    if (!cleanQuery) {
      return true;
    }

    // 3. Match conversation title
    if (conv.title.toLowerCase().includes(cleanQuery)) {
      return true;
    }

    // 4. Match studentName if 1:1
    if (conv.studentName && conv.studentName.toLowerCase().includes(cleanQuery)) {
      return true;
    }

    // 5. Match inner member student names if group
    const innerStudents = studentNamesMap[conv.id] || [];
    const hasInnerStudentMatch = innerStudents.some((sName) =>
      sName.toLowerCase().includes(cleanQuery)
    );
    if (hasInnerStudentMatch) {
      return true;
    }

    return false;
  });
}

/**
 * BR02: Filter message stream by category (for 1:1 chats)
 */
export function filterMessagesByCategory(
  messages: ChatMessage[],
  categoryFilter: MessageCategory | null
): ChatMessage[] {
  if (!categoryFilter) {
    return messages;
  }
  return messages.filter((msg) => msg.category === categoryFilter);
}

/**
 * BR12: Recall message
 */
export function recallChatMessage(message: ChatMessage): ChatMessage {
  return {
    ...message,
    isRecalled: true,
    content: 'Tin nhắn đã được thu hồi bởi giáo viên.',
  };
}
