import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { sendAssignment } from '../../../../store/slices/assignmentSlice';
import { formatAssignmentDate } from '../../../../utils/assignmentValidation';
import { SubmissionRosterTable } from '../../../../modules/academics/assignment/SubmissionRosterTable';
import { AssignmentDiscussionTab } from '../../../../modules/academics/assignment/AssignmentDiscussionTab';
import { SubmitGradingModal } from '../../../../modules/academics/assignment/SubmitGradingModal';
import { ManageStudentsModal } from '../../../../modules/academics/assignment/ManageStudentsModal';
import { Icon } from '@/components/ds';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  a {
    color: #0070ce;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const HeaderCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const TopMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const TagGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SubjectPill = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  background-color: #eff6ff;
  color: #0070ce;
  font-size: 13px;
  font-weight: 600;
`;

const ClassPill = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;

  ${(props) => {
    switch (props.$status) {
      case 'da_gui':
        return 'background-color: #ecfdf5; color: #059669;';
      case 'chua_gui':
        return 'background-color: #eff6ff; color: #0070ce;';
      default:
        return 'background-color: #f1f5f9; color: #64748b;';
    }
  }}
`;

const AssignmentTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MetaLabel = styled.span`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const MetaValue = styled.span`
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
`;

const DescriptionBox = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;

  p {
    margin: 0;
  }
`;

const AttachmentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AttachmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const AttachmentItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  color: #0070ce;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background-color: #eff6ff;
    border-color: #0070ce;
  }
`;

const ActionButtonsRow = styled.div`
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
  margin-top: 4px;

  @media (min-width: 768px) {
    width: auto;
    justify-content: flex-end;
    gap: 10px;
  }
`;

const SecondaryBtn = styled.a`
  min-height: 40px;
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #334155;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  white-space: nowrap;

  &:hover {
    background-color: #f8fafc;
  }
`;

const PrimaryBtn = styled.button`
  min-height: 40px;
  padding: 8px 18px;
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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-top: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  font-size: 15px;
  font-weight: ${(props) => (props.$active ? '700' : '500')};
  color: ${(props) => (props.$active ? '#0070ce' : '#64748b')};
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  flex: none;
  white-space: nowrap;
  min-height: 40px;

  &:hover {
    color: #0070ce;
  }

  ${(props) =>
    props.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #0070ce;
    }
  `}
`;

export default function AssignmentDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const assignmentId = router.query.assignmentId as string;

  const assignments = useAppSelector((state) => state.assignment.assignments);
  const assignment = assignments.find((a) => a.id === assignmentId);

  const [activeTab, setActiveTab] = useState<'roster' | 'discussion'>('roster');

  if (!assignment) {
    return (
      <PortalLayout>
        <Container>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>Không tìm thấy bài tập</h2>
            <p>Bài tập có thể đã bị xóa hoặc đường dẫn không đúng.</p>
            <Link href={`/${schoolCode}/school/assignment`} passHref legacyBehavior>
              <PrimaryBtn as="a">Quay lại danh sách bài tập</PrimaryBtn>
            </Link>
          </div>
        </Container>
      </PortalLayout>
    );
  }

  const isDuePassed = new Date(assignment.dueDate).getTime() < Date.now();

  const handleSendNotification = () => {
    if (confirm('Bạn có muốn gửi thông báo bài tập này đến phụ huynh và học sinh?')) {
      dispatch(sendAssignment(assignment.id));
      alert('Đã gửi thông báo thành công!');
    }
  };

  return (
    <PortalLayout>
      <Head>
        <title>{assignment.title} | Finviet School Operating Portal</title>
        <meta
          name="description"
          content={`Chi tiết bài tập ${assignment.title} môn ${assignment.subjectName} lớp ${assignment.className}`}
        />
      </Head>

      <Container>
        {/* Breadcrumb path */}
        <Breadcrumbs>
          <Link href={`/${schoolCode}/school/assignment`}>Bài Tập</Link>
          <span>/</span>
          <span>{assignment.className}</span>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>
            {assignment.title}
          </span>
        </Breadcrumbs>

        {/* Overview Header Card (BR07) */}
        <HeaderCard>
          <TopMetaRow>
            <TagGroup>
              <SubjectPill>{assignment.subjectName}</SubjectPill>
              <ClassPill>{assignment.className}</ClassPill>
              <StatusBadge $status={assignment.status}>
                {assignment.status === 'da_gui'
                  ? 'Đã gửi'
                  : assignment.status === 'chua_gui'
                  ? 'Chưa gửi (lên lịch)'
                  : 'Đã tạo (nháp)'}
              </StatusBadge>
            </TagGroup>

            <ActionButtonsRow>
              <Link
                href={`/${schoolCode}/school/assignment/edit/${assignment.id}`}
                passHref
                legacyBehavior
              >
                <SecondaryBtn className="inline-flex items-center gap-1.5">
                  <Icon name="pen" size={13} />
                  <span>Chỉnh sửa bài tập</span>
                </SecondaryBtn>
              </Link>

              {assignment.status !== 'da_gui' && (
                <PrimaryBtn onClick={handleSendNotification} className="inline-flex items-center gap-1.5">
                  <Icon name="paper-plane" size={13} />
                  <span>Gửi thông báo</span>
                </PrimaryBtn>
              )}
            </ActionButtonsRow>
          </TopMetaRow>

          <AssignmentTitle>{assignment.title}</AssignmentTitle>

          {/* Metadata details */}
          <MetaGrid>
            <MetaItem>
              <MetaLabel>Hạn nộp bài</MetaLabel>
              <MetaValue style={{ color: isDuePassed ? '#ef4444' : '#10b981' }}>
                {formatAssignmentDate(assignment.dueDate)} {isDuePassed ? '(Đã hết hạn)' : '(Đang mở)'}
              </MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaLabel>Người tạo</MetaLabel>
              <MetaValue>{assignment.createdBy}</MetaValue>
            </MetaItem>

            <MetaItem>
              <MetaLabel>Ngày tạo</MetaLabel>
              <MetaValue>{formatAssignmentDate(assignment.createdAt)}</MetaValue>
            </MetaItem>
          </MetaGrid>

          {/* Description */}
          {assignment.description && (
            <DescriptionBox
              dangerouslySetInnerHTML={{ __html: assignment.description }}
            />
          )}

          {/* Attachments */}
          {assignment.attachments.length > 0 && (
            <AttachmentSection>
              <MetaLabel>File đính kèm ({assignment.attachments.length})</MetaLabel>
              <AttachmentList>
                {assignment.attachments.map((att) => (
                  <AttachmentItem
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon name="paperclip" size={13} />
                    <span>{att.name}</span>
                  </AttachmentItem>
                ))}
              </AttachmentList>
            </AttachmentSection>
          )}
        </HeaderCard>

        {/* Dual Tab Bar (BR07) */}
        <TabContainer>
          <TabButton
            $active={activeTab === 'roster'}
            onClick={() => setActiveTab('roster')}
          >
            Danh Sách Học Sinh ({assignment.submissions.length})
          </TabButton>

          <TabButton
            $active={activeTab === 'discussion'}
            onClick={() => setActiveTab('discussion')}
          >
            Thảo Luận ({assignment.comments.length})
          </TabButton>
        </TabContainer>

        {/* Tab 1: Student Submission Roster (BR08) */}
        {activeTab === 'roster' && (
          <SubmissionRosterTable assignment={assignment} />
        )}

        {/* Tab 2: Assignment Discussion Stream (BR10) */}
        {activeTab === 'discussion' && (
          <AssignmentDiscussionTab assignment={assignment} />
        )}

        {/* Modals */}
        <SubmitGradingModal />
        <ManageStudentsModal />
      </Container>
    </PortalLayout>
  );
}
