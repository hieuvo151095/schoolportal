import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../../store';
import { addAssignmentComment } from '../../../store/slices/assignmentSlice';
import { formatAssignmentDate } from '../../../utils/assignmentValidation';
import { HomeworkAssignment } from '../../../types/assignment';

const Container = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 24px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Avatar = styled.div<{ $role?: string }>`
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;

  background-color: ${(props) => {
    switch (props.$role) {
      case 'teacher':
        return '#dbeafe';
      case 'parent':
        return '#d1fae5';
      default:
        return '#fef3c7';
    }
  }};

  color: ${(props) => {
    switch (props.$role) {
      case 'teacher':
        return '#0070ce';
      case 'parent':
        return '#059669';
      default:
        return '#d97706';
    }
  }};
`;

const CommentContentBox = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const AuthorName = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;

const RoleBadge = styled.span<{ $role?: string }>`
  font-size: 11px;
  font-weight: 600;
  padding: 1px 8px;
  border-radius: 4px;

  ${(props) => {
    switch (props.$role) {
      case 'teacher':
        return 'background-color: #eff6ff; color: #0070ce; border: 1px solid #bfdbfe;';
      case 'parent':
        return 'background-color: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;';
      default:
        return 'background-color: #fffbeb; color: #d97706; border: 1px solid #fde68a;';
    }
  }}
`;

const TimestampText = styled.span`
  font-size: 12px;
  color: #94a3b8;
  margin-left: auto;
`;

const CommentText = styled.div`
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
`;

const EmptyNotice = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const Composer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
`;

const ComposerTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  min-height: 80px;
  resize: vertical;

  &:focus {
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.12);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ComposerActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SendButton = styled.button`
  padding: 8px 20px;
  border: none;
  background-color: #0070ce;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #005bb0;
  }
`;

interface AssignmentDiscussionTabProps {
  assignment: HomeworkAssignment;
}

export const AssignmentDiscussionTab: React.FC<
  AssignmentDiscussionTabProps
> = ({ assignment }) => {
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');

  const handleSendComment = () => {
    if (!content.trim()) return;

    dispatch(
      addAssignmentComment({
        assignmentId: assignment.id,
        authorName: 'Cô Nguyễn Thị Mai',
        authorRole: 'teacher',
        content: content.trim(),
      })
    );

    setContent('');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Giáo viên';
      case 'parent':
        return 'Phụ huynh';
      default:
        return 'Quản trị';
    }
  };

  return (
    <Container>
      {assignment.comments.length === 0 ? (
        <EmptyNotice>
          <div style={{ fontSize: '24px', marginBottom: '6px' }}>💬</div>
          <div>Chưa có thảo luận nào quanh bài tập này.</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
            Giáo viên và phụ huynh có thể trao đổi thắc mắc tại đây.
          </div>
        </EmptyNotice>
      ) : (
        <CommentList>
          {assignment.comments.map((comment) => (
            <CommentItem key={comment.id}>
              <Avatar $role={comment.authorRole}>
                {comment.authorName.charAt(0)}
              </Avatar>
              <CommentContentBox>
                <CommentHeader>
                  <AuthorName>{comment.authorName}</AuthorName>
                  <RoleBadge $role={comment.authorRole}>
                    {getRoleLabel(comment.authorRole)}
                  </RoleBadge>
                  <TimestampText>
                    {formatAssignmentDate(comment.createdAt)}
                  </TimestampText>
                </CommentHeader>
                <CommentText>{comment.content}</CommentText>
              </CommentContentBox>
            </CommentItem>
          ))}
        </CommentList>
      )}

      {/* Composer (BR10) */}
      <Composer>
        <ComposerTextarea
          placeholder="Thêm thảo luận, lời dặn hoặc phản hồi cho phụ huynh và học sinh..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <ComposerActions>
          <SendButton
            disabled={!content.trim()}
            onClick={handleSendComment}
          >
            Gửi thảo luận
          </SendButton>
        </ComposerActions>
      </Composer>
    </Container>
  );
};
