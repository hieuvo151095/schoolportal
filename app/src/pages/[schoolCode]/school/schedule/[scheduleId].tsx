import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { PortalLayout } from '../../../../components/layout/PortalLayout';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSendHistoryModalOpen,
  sendScheduleNotification,
} from '../../../../store/slices/scheduleSlice';
import { TimetableGridView } from '../../../../modules/academics/schedule/TimetableGridView';
import { TimetableFileView } from '../../../../modules/academics/schedule/TimetableFileView';
import { SendHistoryModal } from '../../../../modules/academics/schedule/SendHistoryModal';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const BreadcrumbBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;

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
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MainTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MetaList = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: #475569;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span<{ $status: 'draft' | 'published' | 'updated' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;

  ${(props) => {
    switch (props.$status) {
      case 'published':
        return 'background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;';
      case 'updated':
        return 'background: #fef9c3; color: #a16207; border: 1px solid #fde047;';
      case 'draft':
      default:
        return 'background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;';
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${(props) => (props.$primary ? '#0070ce' : '#cbd5e1')};
  background: ${(props) => (props.$primary ? '#0070ce' : '#ffffff')};
  color: ${(props) => (props.$primary ? '#ffffff' : '#334155')};
  transition: all 0.15s ease;
  text-decoration: none;

  &:hover {
    background: ${(props) => (props.$primary ? '#005bb5' : '#f8fafc')};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(3px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  max-width: 460px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const ModalCancelBtn = styled.button`
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
`;

const ModalConfirmBtn = styled.button`
  border: none;
  background: #0070ce;
  color: #ffffff;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #005bb5;
  }
`;

export default function ScheduleDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schoolCode = (router.query.schoolCode as string) || 'demo';
  const scheduleId = (router.query.scheduleId as string) || 'sch-001';

  const { timetables } = useAppSelector((state) => state.schedule);
  const schedule = timetables.find((t) => t.id === scheduleId) || timetables[0];

  const [isSendConfirmOpen, setIsSendConfirmOpen] = useState(false);

  if (!schedule) {
    return (
      <PortalLayout>
        <PageContainer>
          <div>Không tìm thấy thời khóa biểu.</div>
        </PageContainer>
      </PortalLayout>
    );
  }

  const handleConfirmSendNotice = () => {
    dispatch(
      sendScheduleNotification({
        scheduleId: schedule.id,
        senderName: 'Cô Lan Hương (GVCN)',
        senderRole: 'Giáo viên chủ nhiệm',
        channel: 'all',
        recipientsCount: 32,
        note: `Thông báo cập nhật thời khóa biểu lớp ${schedule.className}`,
      })
    );
    setIsSendConfirmOpen(false);
    alert(`Đã gửi thông báo thời khóa biểu ${schedule.title} đến phụ huynh thành công!`);
  };

  return (
    <PortalLayout>
      <Head>
        <title>{schedule.title} | Finviet School Operating Portal</title>
      </Head>

      <PageContainer>
        <BreadcrumbBar>
          <Link href={`/${schoolCode}/school/schedule/`}>Thời khóa biểu</Link>
          <span>›</span>
          <span>{schedule.className}</span>
          <span>›</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{schedule.title}</span>
        </BreadcrumbBar>

        <HeaderCard>
          <TitleArea>
            <MainTitle>
              <span>{schedule.type === 'grid' ? '📊' : '📄'}</span>
              {schedule.title}
              <StatusBadge $status={schedule.status}>
                {schedule.status === 'published' && '● Đã phát hành'}
                {schedule.status === 'updated' && '★ Cập nhật'}
                {schedule.status === 'draft' && '○ Bản nháp'}
              </StatusBadge>
            </MainTitle>
            <MetaList>
              <span>Lớp: <strong>{schedule.className}</strong></span>
              <span>•</span>
              <span>Học kỳ: <strong>{schedule.semesterName}</strong> ({schedule.academicYear})</span>
              <span>•</span>
              <span>
                Áp dụng: {new Date(schedule.startDate).toLocaleDateString('vi-VN')} -{' '}
                {new Date(schedule.endDate).toLocaleDateString('vi-VN')}
              </span>
            </MetaList>
          </TitleArea>

          <ButtonGroup>
            {/* Action: Gửi phụ huynh (Opens confirmation modal) */}
            <ActionButton onClick={() => setIsSendConfirmOpen(true)}>
              <span>📢</span> Gửi phụ huynh
            </ActionButton>

            {/* Action: Lịch sử gửi */}
            <ActionButton
              onClick={() =>
                dispatch(
                  setSendHistoryModalOpen({ isOpen: true, scheduleId: schedule.id })
                )
              }
            >
              <span>🕒</span> Lịch sử gửi ({schedule.sendHistory.length})
            </ActionButton>

            {/* Action: Chỉnh sửa */}
            <Link
              href={`/${schoolCode}/school/schedule/edit/${schedule.id}/`}
              passHref
              legacyBehavior
            >
              <ActionButton as="a" $primary>
                <span>✏️</span> Chỉnh sửa
              </ActionButton>
            </Link>
          </ButtonGroup>
        </HeaderCard>

        {/* Content View: Grid Matrix or Attached File */}
        {schedule.type === 'grid' ? (
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '10px', color: '#334155' }}>
              Ma trận tiết học trong tuần (Thứ Hai - Thứ Bảy)
            </div>
            <TimetableGridView slots={schedule.slots} />
          </div>
        ) : (
          <TimetableFileView
            fileName={schedule.fileName}
            fileSize={schedule.fileSize}
            fileUrl={schedule.fileUrl}
            className={schedule.className}
            semesterName={schedule.semesterName}
          />
        )}

        {/* Send to Parents Confirmation Modal */}
        {isSendConfirmOpen && (
          <ModalOverlay onClick={() => setIsSendConfirmOpen(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <ModalTitle>📢 Xác nhận gửi thời khóa biểu</ModalTitle>
              <ModalText>
                Bạn có chắc chắn muốn gửi thời khóa biểu{' '}
                <strong>{schedule.title}</strong> của lớp{' '}
                <strong>{schedule.className}</strong> đến phụ huynh không?
              </ModalText>
              <ModalText style={{ fontSize: '13px', color: '#64748b' }}>
                Thông báo sẽ được gửi qua ứng dụng phụ huynh và tin nhắn Zalo đến tất cả phụ huynh trong lớp.
              </ModalText>
              <ModalActions>
                <ModalCancelBtn onClick={() => setIsSendConfirmOpen(false)}>
                  Hủy bỏ
                </ModalCancelBtn>
                <ModalConfirmBtn onClick={handleConfirmSendNotice}>
                  Xác nhận gửi
                </ModalConfirmBtn>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        )}

        {/* Global Modals */}
        <SendHistoryModal />
      </PageContainer>
    </PortalLayout>
  );
}
