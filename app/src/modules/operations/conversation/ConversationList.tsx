import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setActiveConversation,
  setSearchQuery,
  setClassFilter,
} from '../../../store/slices/conversationSlice';
import { filterConversations } from '../../../utils/conversationValidation';
import { Button, SearchField, SelectField, Avatar, Icon } from '@/components/ds';

interface Props {
  onOpenCreateModal: () => void;
}

export const ConversationList: React.FC<Props> = ({ onOpenCreateModal }) => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    activeConversationId,
    searchQuery,
    classFilter,
  } = useAppSelector((state) => state.conversation);

  // Student names map for group deep searching (BR10)
  const studentNamesMap: Record<string, string[]> = {
    'conv-3': ['Đỗ Nam', 'Lê Bảo An', 'Trần Minh Thảo', 'Trần Quang Khải', 'Vũ Phong'],
    'conv-5': ['Đỗ Nam', 'Trần Minh Thảo', 'Hoàng Yến'],
  };

  const filteredConversations = filterConversations(
    conversations,
    searchQuery,
    classFilter,
    studentNamesMap
  );

  return (
    <aside
      style={{
        width: '360px',
        minWidth: '320px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* Top Header & Search Bar */}
      <div
        style={{
          padding: 'var(--space-16)',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-12)',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="title-md" style={{ color: 'var(--text-heading)', margin: 0 }}>
              Trao Đổi
            </h2>
            <div className="body-xs" style={{ color: 'var(--text-subtle)' }}>
              Phụ huynh & Giáo viên
            </div>
          </div>
          <Button
            variant="primary"
            icon="plus"
            size="sm"
            onClick={onOpenCreateModal}
          >
            Tạo mới
          </Button>
        </div>

        <SearchField
          value={searchQuery}
          onChange={(q) => dispatch(setSearchQuery(q))}
          placeholder="Tìm theo học sinh, nhóm..."
        />

        <SelectField
          value={classFilter}
          onChange={(val) => dispatch(setClassFilter(val))}
          options={[
            { value: 'all', label: 'Tất cả các lớp' },
            { value: 'lop-1a1', label: 'Lớp 1A1' },
            { value: 'lop-1a2', label: 'Lớp 1A2' },
          ]}
        />
      </div>

      {/* Scrollable Conversation List */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
        {filteredConversations.length === 0 ? (
          <div style={{ padding: 'var(--space-32) var(--space-16)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Không tìm thấy cuộc trò chuyện phù hợp
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isGroup = conv.type === 'nhom';

            return (
              <div
                key={conv.id}
                onClick={() => dispatch(setActiveConversation(conv.id))}
                style={{
                  padding: 'var(--space-12) var(--space-16)',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 'var(--space-12)',
                  alignItems: 'flex-start',
                  background: isActive ? 'var(--semantic-info-soft)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--eco-blue-strong)' : '3px solid transparent',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <Avatar
                  name={conv.title}
                  size="md"
                  color={isGroup ? 'var(--eco-yellow-strong)' : undefined}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div
                      className="body-sm-bold"
                      style={{
                        color: 'var(--text-heading)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{conv.title}</span>
                      {conv.hasSchoolResponse && (
                        <span title="Trao đổi đã có phản hồi từ nhà trường" style={{ color: 'var(--eco-yellow-strong)', fontSize: '12px' }}>
                          ⭐
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        fontVariantNumeric: 'tabular-nums',
                        flexShrink: 0,
                      }}
                    >
                      {conv.lastMessageTimestamp}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span
                      className="body-xs"
                      style={{
                        color: 'var(--text-subtle)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {conv.lastMessageSnippet}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span
                        style={{
                          background: 'var(--semantic-danger)',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          flexShrink: 0,
                        }}
                      >
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ConversationList;
