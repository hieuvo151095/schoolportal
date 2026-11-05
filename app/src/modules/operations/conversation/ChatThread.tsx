import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  sendMessage,
  recallMessage,
  setCategoryFilter,
  setDateFilter,
  toggleLockParents,
  toggleArchiveChat,
  pinMessage,
  unpinMessage,
} from '../../../store/slices/conversationSlice';
import { AbsenceMessageCard } from './AbsenceMessageCard';
import { MessageCategory, ChatMessage } from '../../../types/conversation';
import { filterMessagesByCategory } from '../../../utils/conversationValidation';

interface Props {
  onOpenGroupDetails: () => void;
  onOpenImportantAlerts: () => void;
  onBack?: () => void;
}

const ThreadContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #f8fafc;
  position: relative;
`;

const ThreadHeader = styled.div`
  padding: 14px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  position: relative;
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ConvInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ConvName = styled.h3`
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ClassPill = styled.span`
  background: #eff6ff;
  color: #0070ce;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  border: 1px solid #bfdbfe;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const GroupAvatarCluster = styled.button`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #e2e8f0;
  }
`;

const SettingsBtn = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? '#eff6ff' : '#ffffff')};
  border: 1px solid ${({ $active }) => ($active ? '#0070ce' : '#cbd5e1')};
  color: ${({ $active }) => ($active ? '#0070ce' : '#475569')};
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;

  &:hover {
    background: #f1f5f9;
    border-color: #0070ce;
  }
`;

const SettingsDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 320px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 12px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DropdownHeader = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
`;

const SettingItemInfo = styled.div`
  flex: 1;

  .title {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 2px;
  }

  .desc {
    font-size: 11px;
    color: #64748b;
    line-height: 1.35;
  }
`;

const ToggleBtn = styled.button<{ $isActive: boolean }>`
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  background: ${({ $isActive }) => ($isActive ? '#fee2e2' : '#eff6ff')};
  color: ${({ $isActive }) => ($isActive ? '#dc2626' : '#0070ce')};

  &:hover {
    filter: brightness(0.95);
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const ChipsGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
`;

const CategoryChip = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid ${({ $active }) => ($active ? '#0070ce' : '#cbd5e1')};
  background: ${({ $active }) => ($active ? '#eff6ff' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#0070ce' : '#475569')};
  cursor: pointer;
  transition: all 0.12s;

  &:hover {
    border-color: #0070ce;
  }
`;

const ClearFilterBtn = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  color: #ef4444;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
`;


const StatusBanner = styled.div<{ $bg: string; $border: string; $color: string }>`
  background: ${({ $bg }) => $bg};
  border-bottom: 1px solid ${({ $border }) => $border};
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const BannerActionBtn = styled.button`
  background: #ffffff;
  border: 1px solid currentColor;
  color: inherit;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

const PinnedBar = styled.div`
  background: #fefce8;
  border-bottom: 1px solid #fef08a;
  padding: 8px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #854d0e;
  flex-shrink: 0;
`;

const PinnedBarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #a16207;
`;

const PinnedChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const PinnedChip = styled.div`
  background: #ffffff;
  border: 1px solid #fde047;
  border-radius: 8px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 320px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

  .sender {
    font-weight: 700;
    color: #713f12;
    font-size: 11px;
    white-space: nowrap;
  }

  .snippet {
    color: #475569;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .unpin-btn {
    background: none;
    border: none;
    color: #dc2626;
    cursor: pointer;
    font-size: 12px;
    padding: 0 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    &:hover {
      background: #fee2e2;
    }
  }
`;

const MessagesList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageRow = styled.div<{ $isMe: boolean; $isSystem?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isMe, $isSystem }) =>
    $isSystem ? 'center' : $isMe ? 'flex-end' : 'flex-start'};
  width: 100%;
`;

const SystemLogBadge = styled.div`
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  font-size: 11px;
  font-style: italic;
  padding: 4px 14px;
  border-radius: 9999px;
  max-width: 80%;
  text-align: center;
`;

const SenderLabel = styled.div<{ $isMe: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BubbleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 70%;
  position: relative;

  &:hover .msg-menu {
    opacity: 1;
  }
`;

const Bubble = styled.div<{ $isMe: boolean; $isRecalled?: boolean; $isPinned?: boolean }>`
  background: ${({ $isMe, $isRecalled }) =>
    $isRecalled ? '#f1f5f9' : $isMe ? '#0070CE' : '#ffffff'};
  color: ${({ $isMe, $isRecalled }) =>
    $isRecalled ? '#94a3b8' : $isMe ? '#ffffff' : '#0f172a'};
  border: 1px solid
    ${({ $isPinned, $isMe }) =>
      $isPinned ? '#facc15' : $isMe ? '#0070CE' : '#e2e8f0'};
  border-radius: ${({ $isMe }) =>
    $isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px'};
  padding: 10px 14px;
  font-size: 13px;
  line-height: 1.45;
  box-shadow: ${({ $isPinned }) =>
    $isPinned
      ? '0 0 0 2px rgba(250, 204, 21, 0.3), 0 1px 2px rgba(0, 0, 0, 0.04)'
      : '0 1px 2px rgba(0, 0, 0, 0.04)'};
  font-style: ${({ $isRecalled }) => ($isRecalled ? 'italic' : 'normal')};
  word-break: break-word;
  position: relative;
`;

const PinnedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  font-weight: 700;
  color: #ca8a04;
  background: #fef9c3;
  border: 1px solid #fde047;
  padding: 1px 6px;
  border-radius: 9999px;
  margin-bottom: 4px;
`;

const TimeStamp = styled.span<{ $isMe: boolean }>`
  font-size: 10px;
  color: #94a3b8;
  margin-top: 2px;
  display: block;
  text-align: ${({ $isMe }) => ($isMe ? 'right' : 'left')};
`;

const MessageActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 11px;
  color: ${({ $danger }) => ($danger ? '#ef4444' : '#64748b')};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f1f5f9')};
    color: ${({ $danger }) => ($danger ? '#dc2626' : '#0f172a')};
  }
`;

const ComposerContainer = styled.div<{ $disabled?: boolean }>`
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  opacity: ${({ $disabled }) => ($disabled ? 0.75 : 1)};
`;

const ComposerToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToolIconBtn = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const AttachmentPreviewRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 4px;
`;

const AttachmentChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #1e293b;
  font-weight: 500;

  .size {
    color: #64748b;
    font-size: 11px;
    font-weight: 400;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0 2px;
    font-size: 12px;
    line-height: 1;

    &:hover {
      color: #ef4444;
    }
  }
`;

const EmojiPickerPopover = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: 280px;
  z-index: 100;

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f1f5f9;

    button {
      background: none;
      border: none;
      cursor: pointer;
      color: #94a3b8;
      font-size: 13px;

      &:hover {
        color: #0f172a;
      }
    }
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 6px;

    .emoji-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      line-height: 1;
      transition: background 0.1s ease, transform 0.1s ease;

      &:hover {
        background: #f1f5f9;
        transform: scale(1.2);
      }
    }
  }
`;

const BubbleAttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;

const BubbleAttachmentItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  font-size: 12px;
  color: #0070ce;
  text-decoration: none;
  font-weight: 600;
  max-width: 100%;

  .att-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background: #ffffff;
    text-decoration: underline;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: #0070ce;
    box-shadow: 0 0 0 2px rgba(0, 112, 206, 0.12);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

const SendBtn = styled.button<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? '#cbd5e1' : '#0070ce')};
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.15s;

  &:hover {
    background: ${({ disabled }) => (disabled ? '#cbd5e1' : '#005096')};
  }
`;

// Modal dialog for Pin Conflict (Max 3 pinned reached)
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fef9c3;
    color: #a16207;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
  }

  p {
    margin: 2px 0 0 0;
    font-size: 13px;
    color: #64748b;
  }
`;

const PinnedListInModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
`;

const PinnedItemRow = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f8fafc;

  .content-col {
    flex: 1;
    min-width: 0;

    .sender {
      font-size: 11px;
      font-weight: 700;
      color: #334155;
    }

    .text {
      font-size: 12px;
      color: #475569;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  button {
    background: #fee2e2;
    color: #dc2626;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background: #fecaca;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
`;

export const ChatThread: React.FC<Props> = ({
  onOpenGroupDetails,
  onOpenImportantAlerts,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    activeConversationId,
    messagesByConversation,
    categoryFilter,
    dateFilter,
  } = useAppSelector((state) => state.conversation);

  const [messageInput, setMessageInput] = useState('');
  const [selectedAttachments, setSelectedAttachments] = useState<
    { name: string; url: string; size?: string }[]
  >([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pinConflictModalOpen, setPinConflictModalOpen] = useState(false);
  const [pendingPinMessageId, setPendingPinMessageId] = useState<string | null>(null);

  const messagesListRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const rawMessages = messagesByConversation[activeConversationId] || [];
  const filteredMessages = filterMessagesByCategory(rawMessages, categoryFilter);

  // Scroll messages container smoothly without moving parent window / page
  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  }, [rawMessages.length, activeConversationId]);

  // Close settings dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsDropdownRef.current &&
        !settingsDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  // Close emoji picker on click outside
  useEffect(() => {
    const handleClickOutsideEmoji = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutsideEmoji);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideEmoji);
    };
  }, [showEmojiPicker]);

  const POPULAR_EMOJIS = [
    '😊', '😂', '🥰', '👍', '❤️', '👏', '🎉', '🌟',
    '🙏', '📚', '✍️', '🍎', '🏫', '🌸', '✅', '💯',
    '😀', '💪', '☀️', '⭐', '🎈', '👋', '💬', '✨',
  ];

  const handleInsertEmoji = (emoji: string) => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart || 0;
      const end = textAreaRef.current.selectionEnd || 0;
      const text = messageInput;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      setMessageInput(newText);
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
          textAreaRef.current.setSelectionRange(start + emoji.length, start + emoji.length);
        }
      }, 0);
    } else {
      setMessageInput((prev) => prev + emoji);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => {
        const sizeKb = Math.round(file.size / 1024);
        const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
        return {
          name: file.name,
          url: URL.createObjectURL(file),
          size: sizeStr,
        };
      });
      setSelectedAttachments((prev) => [...prev, ...newFiles]);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setSelectedAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if ((!messageInput.trim() && selectedAttachments.length === 0) || !activeConv || activeConv.isArchived) return;
    dispatch(
      sendMessage({
        conversationId: activeConv.id,
        content: messageInput.trim(),
        category: 'tin_nhan',
        attachments:
          selectedAttachments.length > 0
            ? selectedAttachments.map((a) => ({ name: a.name, url: a.url }))
            : undefined,
      })
    );
    setMessageInput('');
    setSelectedAttachments([]);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRequestPin = (messageId: string) => {
    if (!activeConv) return;
    const currentPinned = activeConv.pinnedMessageIds || [];

    // Max 3 pinned messages rule
    if (currentPinned.length >= 3) {
      setPendingPinMessageId(messageId);
      setPinConflictModalOpen(true);
    } else {
      dispatch(pinMessage({ conversationId: activeConv.id, messageId }));
    }
  };

  const handleUnpinAndPinNew = (unpinId: string) => {
    if (!activeConv || !pendingPinMessageId) return;
    dispatch(unpinMessage({ conversationId: activeConv.id, messageId: unpinId }));
    dispatch(pinMessage({ conversationId: activeConv.id, messageId: pendingPinMessageId }));
    setPendingPinMessageId(null);
    setPinConflictModalOpen(false);
  };

  if (!activeConv) {
    return (
      <ThreadContainer>
        <div style={{ margin: 'auto', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>💬</div>
          <div>Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu</div>
        </div>
      </ThreadContainer>
    );
  }

  const isGroup = activeConv.type === 'nhom';
  const pinnedIds = activeConv.pinnedMessageIds || [];
  const pinnedMessages = rawMessages.filter((m) => pinnedIds.includes(m.id));

  return (
    <ThreadContainer>
      <ThreadHeader>
        <HeaderTopRow>
          <ConvInfo>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="md:hidden inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mr-2 py-1 px-2 rounded bg-blue-50 border border-blue-200 cursor-pointer"
                aria-label="Quay lại danh sách hội thoại"
              >
                <span>← Danh sách</span>
              </button>
            )}
            <ConvName>
              {activeConv.title}
              {activeConv.isArchived && <span title="Đã lưu trữ" style={{ fontSize: '15px' }}>📦</span>}
              {activeConv.isParentLocked && <span title="Khóa phụ huynh" style={{ fontSize: '15px' }}>🔒</span>}
            </ConvName>
            <ClassPill>{activeConv.className}</ClassPill>
          </ConvInfo>

          <HeaderActions ref={settingsDropdownRef}>
            {isGroup && (
              <GroupAvatarCluster onClick={onOpenGroupDetails}>
                👥 {activeConv.recipients.length} Thành viên • Chi tiết
              </GroupAvatarCluster>
            )}


            {/* Setting Icon for Chat Controls */}
            <SettingsBtn
              $active={isSettingsOpen}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title="Cài đặt cuộc trò chuyện"
            >
              ⚙️ Cài đặt
            </SettingsBtn>

            {isSettingsOpen && (
              <SettingsDropdown>
                <DropdownHeader>
                  <span>Cài đặt cuộc trò chuyện</span>
                  <span
                    style={{ cursor: 'pointer', color: '#94a3b8' }}
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    ✕
                  </span>
                </DropdownHeader>

                {/* Lock parents from sending messages */}
                <SettingItem>
                  <SettingItemInfo>
                    <div className="title">Khóa phụ huynh gửi tin</div>
                    <div className="desc">
                      Chỉ giáo viên được gửi tin nhắn. Phụ huynh chỉ có quyền xem tin nhắn.
                    </div>
                  </SettingItemInfo>
                  <ToggleBtn
                    $isActive={!!activeConv.isParentLocked}
                    onClick={() =>
                      dispatch(toggleLockParents({ conversationId: activeConv.id }))
                    }
                  >
                    {activeConv.isParentLocked ? 'Mở khóa' : 'Khóa'}
                  </ToggleBtn>
                </SettingItem>

                {/* Archive the chat to lock messages from everyone */}
                <SettingItem>
                  <SettingItemInfo>
                    <div className="title">Lưu trữ cuộc trò chuyện</div>
                    <div className="desc">
                      Khóa gửi tin nhắn đối với tất cả thành viên (cả giáo viên và phụ huynh).
                    </div>
                  </SettingItemInfo>
                  <ToggleBtn
                    $isActive={!!activeConv.isArchived}
                    onClick={() =>
                      dispatch(toggleArchiveChat({ conversationId: activeConv.id }))
                    }
                  >
                    {activeConv.isArchived ? 'Bỏ lưu trữ' : 'Lưu trữ'}
                  </ToggleBtn>
                </SettingItem>
              </SettingsDropdown>
            )}
          </HeaderActions>
        </HeaderTopRow>

        {!isGroup && (
          <FilterRow>
            <ChipsGroup>
              <CategoryChip
                $active={categoryFilter === null}
                onClick={() => dispatch(setCategoryFilter(null))}
              >
                Tất cả
              </CategoryChip>
              <CategoryChip
                $active={categoryFilter === 'tin_nhan'}
                onClick={() => dispatch(setCategoryFilter('tin_nhan'))}
              >
                Tin nhắn
              </CategoryChip>
              <CategoryChip
                $active={categoryFilter === 'bao_vang'}
                onClick={() => dispatch(setCategoryFilter('bao_vang'))}
              >
                Báo vắng
              </CategoryChip>
              <CategoryChip
                $active={categoryFilter === 'dan_thuoc'}
                onClick={() => dispatch(setCategoryFilter('dan_thuoc'))}
              >
                Dặn thuốc
              </CategoryChip>
              <CategoryChip
                $active={categoryFilter === 'yeu_cau_don_ve'}
                onClick={() => dispatch(setCategoryFilter('yeu_cau_don_ve'))}
              >
                Yêu cầu đón về
              </CategoryChip>
            </ChipsGroup>

            {categoryFilter && (
              <ClearFilterBtn onClick={() => dispatch(setCategoryFilter(null))}>
                Xóa bộ lọc
              </ClearFilterBtn>
            )}
          </FilterRow>
        )}
      </ThreadHeader>

      {/* Active State Banners */}
      {activeConv.isArchived && (
        <StatusBanner $bg="#f1f5f9" $border="#cbd5e1" $color="#334155">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📦</span>
            <span>
              Cuộc trò chuyện này đã được <strong>lưu trữ</strong> và khóa gửi tin đối với tất cả thành viên.
            </span>
          </div>
          <BannerActionBtn
            onClick={() =>
              dispatch(toggleArchiveChat({ conversationId: activeConv.id }))
            }
          >
            Bỏ lưu trữ
          </BannerActionBtn>
        </StatusBanner>
      )}

      {activeConv.isParentLocked && !activeConv.isArchived && (
        <StatusBanner $bg="#fef3c7" $border="#fde68a" $color="#92400e">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔒</span>
            <span>
              Đang <strong>khóa quyền gửi tin</strong> của phụ huynh trong cuộc trò chuyện này.
            </span>
          </div>
          <BannerActionBtn
            onClick={() =>
              dispatch(toggleLockParents({ conversationId: activeConv.id }))
            }
          >
            Mở khóa
          </BannerActionBtn>
        </StatusBanner>
      )}

      {activeConv.importantAlertsCount > 0 && (
        <StatusBanner $bg="#fffbeb" $border="#fde68a" $color="#92400e">
          <span>
            📌 Cuộc trò chuyện này có <strong>{activeConv.importantAlertsCount}</strong> thông báo quan trọng (báo ốm, báo vắng)
          </span>
          <BannerActionBtn onClick={onOpenImportantAlerts}>Xem chi tiết</BannerActionBtn>
        </StatusBanner>
      )}

      {/* Pinned Messages Bar (Max 3) */}
      {pinnedMessages.length > 0 && (
        <PinnedBar>
          <PinnedBarHeader>
            <span>📌 Tin nhắn đã ghim ({pinnedMessages.length}/3)</span>
            <span style={{ fontSize: '10px', textTransform: 'none', fontWeight: 600 }}>
              Tối đa 3 tin ghim
            </span>
          </PinnedBarHeader>
          <PinnedChipsContainer>
            {pinnedMessages.map((pMsg) => (
              <PinnedChip key={pMsg.id}>
                <span className="sender">{pMsg.senderName}:</span>
                <span className="snippet" title={pMsg.content}>
                  {pMsg.content}
                </span>
                <button
                  className="unpin-btn"
                  onClick={() =>
                    dispatch(
                      unpinMessage({
                        conversationId: activeConv.id,
                        messageId: pMsg.id,
                      })
                    )
                  }
                  title="Bỏ ghim tin nhắn này"
                >
                  ✕
                </button>
              </PinnedChip>
            ))}
          </PinnedChipsContainer>
        </PinnedBar>
      )}

      <MessagesList ref={messagesListRef}>
        {filteredMessages.length === 0 ? (
          <div style={{ margin: 'auto', color: '#94a3b8', fontSize: '13px' }}>
            Chưa có tin nhắn nào trong bộ lọc này
          </div>
        ) : (
          filteredMessages.map((msg) => {
            if (msg.isSystemAudit) {
              return (
                <MessageRow key={msg.id} $isMe={false} $isSystem>
                  <SystemLogBadge>* {msg.content}</SystemLogBadge>
                </MessageRow>
              );
            }

            const isMe = msg.senderRole === 'giao_vien';
            const isPinned = pinnedIds.includes(msg.id);

            return (
              <MessageRow key={msg.id} $isMe={isMe}>
                <SenderLabel $isMe={isMe}>
                  <span>{msg.senderName}</span>
                  <span style={{ fontWeight: 400, fontSize: '10px' }}>• {msg.timestamp}</span>
                </SenderLabel>

                <BubbleWrapper>
                  <Bubble $isMe={isMe} $isRecalled={msg.isRecalled} $isPinned={isPinned}>
                    {isPinned && <PinnedBadge>📌 Đã ghim</PinnedBadge>}
                    <div>{msg.content}</div>
                    {msg.absenceData && (
                      <AbsenceMessageCard
                        conversationId={activeConv.id}
                        messageId={msg.id}
                        data={msg.absenceData}
                      />
                    )}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <BubbleAttachmentsList>
                        {msg.attachments.map((att, attIdx) => (
                          <BubbleAttachmentItem
                            key={attIdx}
                            href={att.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              if (!att.url || att.url === '#') {
                                e.preventDefault();
                                alert(`Tệp đính kèm: ${att.name}`);
                              }
                            }}
                          >
                            <span>📎</span>
                            <span className="att-title">{att.name}</span>
                          </BubbleAttachmentItem>
                        ))}
                      </BubbleAttachmentsList>
                    )}
                  </Bubble>

                  {!msg.isRecalled && (
                    <MessageActionsGroup className="msg-menu">
                      {isPinned ? (
                        <ActionBtn
                          onClick={() =>
                            dispatch(
                              unpinMessage({
                                conversationId: activeConv.id,
                                messageId: msg.id,
                              })
                            )
                          }
                          title="Bỏ ghim tin nhắn này"
                        >
                          Bỏ ghim
                        </ActionBtn>
                      ) : (
                        <ActionBtn
                          onClick={() => handleRequestPin(msg.id)}
                          title="Ghim tin nhắn này (tối đa 3 tin)"
                        >
                          Ghim tin
                        </ActionBtn>
                      )}

                      {isMe && (
                        <ActionBtn
                          $danger
                          onClick={() =>
                            dispatch(
                              recallMessage({
                                conversationId: activeConv.id,
                                messageId: msg.id,
                              })
                            )
                          }
                          title="Thu hồi tin nhắn này"
                        >
                          Thu hồi
                        </ActionBtn>
                      )}
                    </MessageActionsGroup>
                  )}
                </BubbleWrapper>

                <TimeStamp $isMe={isMe}>
                  {isMe ? 'Đã gửi tới phụ huynh' : 'Đã nhận'}
                </TimeStamp>
              </MessageRow>
            );
          })
        )}
      </MessagesList>

      {/* Composer Container */}
      <ComposerContainer $disabled={!!activeConv.isArchived}>
        <ComposerToolbar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            style={{ display: 'none' }}
          />
          <ToolIconBtn
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Đính kèm tệp"
          >
            📎
          </ToolIconBtn>

          <div style={{ position: 'relative' }}>
            <ToolIconBtn
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="Biểu tượng cảm xúc"
            >
              😊
            </ToolIconBtn>

            {showEmojiPicker && (
              <EmojiPickerPopover ref={emojiPickerRef} onClick={(e) => e.stopPropagation()}>
                <div className="picker-header">
                  <span>Biểu tượng cảm xúc</span>
                  <button type="button" onClick={() => setShowEmojiPicker(false)}>
                    ✕
                  </button>
                </div>
                <div className="emoji-grid">
                  {POPULAR_EMOJIS.map((em, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="emoji-btn"
                      onClick={() => handleInsertEmoji(em)}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </EmojiPickerPopover>
            )}
          </div>

          {activeConv.isParentLocked && !activeConv.isArchived && (
            <span style={{ fontSize: '11px', color: '#b45309', marginLeft: 'auto', fontWeight: 600 }}>
              🔒 Phụ huynh đang bị khóa gửi tin
            </span>
          )}
        </ComposerToolbar>

        {selectedAttachments.length > 0 && (
          <AttachmentPreviewRow>
            {selectedAttachments.map((att, idx) => (
              <AttachmentChip key={idx}>
                <span>📎 {att.name}</span>
                {att.size && <span className="size">({att.size})</span>}
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(idx)}
                  title="Xóa tệp này"
                >
                  ✕
                </button>
              </AttachmentChip>
            ))}
          </AttachmentPreviewRow>
        )}

        <InputRow>
          <TextArea
            ref={textAreaRef}
            placeholder={
              activeConv.isArchived
                ? 'Cuộc trò chuyện đã được lưu trữ (khóa gửi tin với tất cả). Bấm Bỏ lưu trữ để mở lại.'
                : 'Nhập nội dung tin nhắn trao đổi... (Nhấn Enter để gửi)'
            }
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!!activeConv.isArchived}
          />
          <SendBtn
            disabled={(!messageInput.trim() && selectedAttachments.length === 0) || !!activeConv.isArchived}
            onClick={handleSend}
          >
            Gửi
          </SendBtn>
        </InputRow>
      </ComposerContainer>

      {/* Pin Conflict Modal (Max 3 Pinned Enforcement) */}
      {pinConflictModalOpen && (
        <ModalOverlay onClick={() => setPinConflictModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div className="icon">📌</div>
              <div>
                <h4>Đã đạt giới hạn ghim (3 tin nhắn)</h4>
                <p>
                  Mỗi cuộc trò chuyện chỉ có thể ghim tối đa 3 tin nhắn. Vui lòng chọn 1 tin nhắn bên dưới để bỏ ghim trước khi ghim tin mới:
                </p>
              </div>
            </ModalHeader>

            <PinnedListInModal>
              {pinnedMessages.map((pMsg) => (
                <PinnedItemRow key={pMsg.id}>
                  <div className="content-col">
                    <div className="sender">{pMsg.senderName}</div>
                    <div className="text">{pMsg.content}</div>
                  </div>
                  <button onClick={() => handleUnpinAndPinNew(pMsg.id)}>
                    Bỏ ghim tin này
                  </button>
                </PinnedItemRow>
              ))}
            </PinnedListInModal>

            <ModalActions>
              <button
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setPinConflictModalOpen(false);
                  setPendingPinMessageId(null);
                }}
              >
                Đóng
              </button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </ThreadContainer>
  );
};
