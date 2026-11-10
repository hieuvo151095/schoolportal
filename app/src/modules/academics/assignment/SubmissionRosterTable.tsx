import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../../store';
import {
  openManageStudentsModal,
  openSubmitGradingModal,
  removeStudentFromAssignment,
} from '../../../store/slices/assignmentSlice';
import { formatAssignmentDate } from '../../../utils/assignmentValidation';
import {
  AssignmentSubmission,
  HomeworkAssignment,
} from '../../../types/assignment';
import { Icon } from '@/components/ds';

const Container = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const Toolbar = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchInput = styled.input`
  padding: 8px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  min-width: 0;
  width: 100%;
  outline: none;

  @media (min-width: 640px) {
    width: 280px;
    min-width: 240px;
  }

  &:focus {
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.12);
  }
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 640px) {
    width: auto;
    gap: 10px;
  }
`;

const SecondaryButton = styled.button`
  padding: 8px 14px;
  min-height: 40px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #334155;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
  }
`;

const PrimaryButton = styled.button`
  padding: 8px 14px;
  min-height: 40px;
  border: none;
  background-color: #0070ce;
  color: #ffffff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background-color: #005bb0;
  }
`;

const TableScrollWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
`;

const TableHead = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
  font-size: 13px;
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }

  &:hover {
    background-color: #f8fafc;
  }
`;

const TableCell = styled.td`
  padding: 14px 16px;
  vertical-align: middle;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #0f172a;
`;

const StudentSubtext = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
`;

const StatusPill = styled.span<{ $status: 'submitted' | 'unsubmitted' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${(props) =>
    props.$status === 'submitted' ? '#ecfdf5' : '#f1f5f9'};
  color: ${(props) => (props.$status === 'submitted' ? '#059669' : '#64748b')};
`;

const LateWarningPill = styled.span`
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background-color: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
`;

const GradeBadge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ScoreText = styled.span`
  font-weight: 700;
  color: #0070ce;
  font-size: 15px;
`;

const CommentSnippet = styled.span`
  font-size: 12px;
  color: #475569;
  font-style: italic;
  max-width: 220px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;

const SubmitButton = styled.button<{ $isEvaluated?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(props) => (props.$isEvaluated ? '#0070ce' : '#cbd5e1')};
  background-color: ${(props) =>
    props.$isEvaluated ? '#eff6ff' : '#ffffff'};
  color: ${(props) => (props.$isEvaluated ? '#0070ce' : '#334155')};
  transition: all 0.2s;

  &:hover {
    background-color: #dbeafe;
    color: #0070ce;
  }
`;

const MoreMenuWrapper = styled.div`
  position: relative;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
`;

const MoreDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: 4px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  z-index: 20;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  font-size: 13px;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #fef2f2;
  }
`;

interface SubmissionRosterTableProps {
  assignment: HomeworkAssignment;
}

export const SubmissionRosterTable: React.FC<SubmissionRosterTableProps> = ({
  assignment,
}) => {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuStudentId, setOpenMenuStudentId] = useState<string | null>(
    null
  );

  const filteredSubmissions = assignment.submissions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      s.studentName.toLowerCase().includes(query) ||
      s.studentCode.toLowerCase().includes(query) ||
      (s.nickname && s.nickname.toLowerCase().includes(query))
    );
  });

  const handleOpenGrading = (studentId: string) => {
    dispatch(
      openSubmitGradingModal({
        assignmentId: assignment.id,
        studentId,
      })
    );
  };

  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa học sinh ${studentName} khỏi danh sách bài tập này?`
      )
    ) {
      dispatch(
        removeStudentFromAssignment({
          assignmentId: assignment.id,
          studentId,
        })
      );
      setOpenMenuStudentId(null);
    }
  };

  return (
    <Container>
      <Toolbar>
        <SearchInput
          type="text"
          placeholder="Tìm kiếm học sinh theo tên, mã..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ActionsGroup>
          <SecondaryButton
            onClick={() => {
              alert('Tính năng xuất danh sách bảng điểm (Excel/PDF) đã sẵn sàng tải về!');
            }}
          >
            <Icon name="arrow-down-to-bracket" size={13} />
            <span>Xuất danh sách</span>
          </SecondaryButton>

          <PrimaryButton
            onClick={() => dispatch(openManageStudentsModal(assignment.id))}
          >
            <Icon name="plus" size={13} />
            <span>Thêm học sinh</span>
          </PrimaryButton>
        </ActionsGroup>
      </Toolbar>

      <TableScrollWrapper>
        <StyledTable>
        <TableHead>
          <tr>
            <TableHeaderCell style={{ width: '6%' }}>STT</TableHeaderCell>
            <TableHeaderCell style={{ width: '28%' }}>Học sinh</TableHeaderCell>
            <TableHeaderCell style={{ width: '20%' }}>
              Trạng thái nộp
            </TableHeaderCell>
            <TableHeaderCell style={{ width: '16%' }}>
              File bài nộp
            </TableHeaderCell>
            <TableHeaderCell style={{ width: '18%' }}>Đánh giá</TableHeaderCell>
            <TableHeaderCell style={{ width: '12%', textAlign: 'right' }}>
              Thao tác
            </TableHeaderCell>
          </tr>
        </TableHead>

        <tbody>
          {filteredSubmissions.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{
                  padding: '36px',
                  textAlign: 'center',
                  color: '#64748b',
                }}
              >
                Không tìm thấy học sinh nào trong danh sách.
              </td>
            </tr>
          ) : (
            filteredSubmissions.map((sub, idx) => {
              const isSubmitted =
                sub.status === 'da_nop' || sub.status === 'cham_diem';
              const isGraded =
                sub.status === 'cham_diem' || sub.score !== undefined;

              return (
                <TableRow key={sub.studentId}>
                  <TableCell>{idx + 1}</TableCell>

                  <TableCell>
                    <StudentName>{sub.studentName}</StudentName>
                    <StudentSubtext>
                      Mã: {sub.studentCode}
                      {sub.nickname && ` • Tên gọi: ${sub.nickname}`}
                    </StudentSubtext>
                  </TableCell>

                  <TableCell>
                    {isSubmitted ? (
                      <div>
                        <StatusPill $status="submitted">
                          <Icon name="check" size={11} />
                          <span>Đã nộp bài</span>
                        </StatusPill>
                        {sub.isLate && (
                          <LateWarningPill>Nộp muộn</LateWarningPill>
                        )}
                        {sub.submittedAt && (
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#64748b',
                              marginTop: '2px',
                            }}
                          >
                            {formatAssignmentDate(sub.submittedAt)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <StatusPill $status="unsubmitted">
                        Chưa nộp bài
                      </StatusPill>
                    )}
                  </TableCell>

                  <TableCell>
                    {sub.submissionFile ? (
                      <a
                        href={sub.submissionFile.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: '#0070ce',
                          fontSize: '13px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none',
                        }}
                      >
                        <Icon name="file-lines" size={13} />
                        <span>{sub.submissionFile.name}</span>
                      </a>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Chưa có file</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {isGraded ? (
                      <GradeBadge>
                        <ScoreText>{sub.score?.toFixed(1)} / 10</ScoreText>
                        {sub.teacherComment && (
                          <CommentSnippet title={sub.teacherComment}>
                            {sub.teacherComment}
                          </CommentSnippet>
                        )}
                      </GradeBadge>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        Chưa đánh giá
                      </span>
                    )}
                  </TableCell>

                  <TableCell style={{ textAlign: 'right' }}>
                    <ActionRow>
                      <SubmitButton
                        $isEvaluated={isGraded}
                        onClick={() => handleOpenGrading(sub.studentId)}
                      >
                        {isSubmitted ? 'Chấm bài' : 'Nộp bài'}
                      </SubmitButton>

                      <MoreMenuWrapper>
                        <MoreButton
                          onClick={() =>
                            setOpenMenuStudentId(
                              openMenuStudentId === sub.studentId
                                ? null
                                : sub.studentId
                            )
                          }
                        >
                          •••
                        </MoreButton>

                        {openMenuStudentId === sub.studentId && (
                          <MoreDropdown>
                            <DropdownItem
                              onClick={() =>
                                handleRemoveStudent(
                                  sub.studentId,
                                  sub.studentName
                                )
                              }
                            >
                              <Icon name="trash" size={12} className="text-red-500 mr-1" />
                              <span>Xóa học sinh</span>
                            </DropdownItem>
                          </MoreDropdown>
                        )}
                      </MoreMenuWrapper>
                    </ActionRow>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </tbody>
        </StyledTable>
      </TableScrollWrapper>
    </Container>
  );
};
