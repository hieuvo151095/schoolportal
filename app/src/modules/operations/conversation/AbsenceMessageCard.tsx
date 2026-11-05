import React from 'react';
import styled from 'styled-components';
import { AbsenceCardData } from '../../../types/conversation';
import { useAppDispatch } from '../../../store';
import { reviewAbsence } from '../../../store/slices/conversationSlice';

interface Props {
  conversationId: string;
  messageId: string;
  data: AbsenceCardData;
}

const CardContainer = styled.div<{ $status: string }>`
  background: ${({ $status }) =>
    $status === 'cho_xu_ly'
      ? '#EFF6FF'
      : $status === 'da_xac_nhan'
      ? '#ECFDF5'
      : '#FFF1F2'};
  border: 1px solid
    ${({ $status }) =>
      $status === 'cho_xu_ly'
        ? '#BFDBFE'
        : $status === 'da_xac_nhan'
        ? '#A7F3D0'
        : '#FECDD3'};
  border-radius: 12px;
  padding: 14px 16px;
  margin-top: 8px;
  max-width: 440px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  background: ${({ $status }) =>
    $status === 'cho_xu_ly'
      ? '#FEF3C7'
      : $status === 'da_xac_nhan'
      ? '#D1FAE5'
      : '#FEE2E2'};
  color: ${({ $status }) =>
    $status === 'cho_xu_ly'
      ? '#b45309'
      : $status === 'da_xac_nhan'
      ? '#065F46'
      : '#991B1B'};
`;

const DetailRow = styled.div`
  font-size: 12px;
  color: #334155;
  margin-bottom: 4px;

  strong {
    color: #0f172a;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed #cbd5e1;
`;

const ApproveBtn = styled.button`
  flex: 1;
  background: #0070CE;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #005096;
  }
`;

const CancelBtn = styled.button`
  flex: 1;
  background: #ffffff;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #fff1f2;
  }
`;

const ReviewedInfo = styled.div`
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
  font-style: italic;
`;

export const AbsenceMessageCard: React.FC<Props> = ({ conversationId, messageId, data }) => {
  const dispatch = useAppDispatch();

  const handleApprove = () => {
    dispatch(
      reviewAbsence({
        conversationId,
        messageId,
        actionType: 'approve',
        reviewerName: 'Cô Nguyễn Mai Anh',
      })
    );
  };

  const handleCancel = () => {
    dispatch(
      reviewAbsence({
        conversationId,
        messageId,
        actionType: 'cancel',
        reviewerName: 'Cô Nguyễn Mai Anh',
      })
    );
  };

  const getStatusLabel = () => {
    if (data.status === 'cho_xu_ly') return 'Chờ xử lý';
    if (data.status === 'da_xac_nhan') return '✓ Đã xác nhận';
    return '✕ Đã hủy báo vắng';
  };

  return (
    <CardContainer $status={data.status}>
      <CardHeader>
        <Title>
          <span>📋 Đơn báo vắng học sinh</span>
        </Title>
        <StatusBadge $status={data.status}>{getStatusLabel()}</StatusBadge>
      </CardHeader>

      <DetailRow>
        <strong>Học sinh:</strong> {data.studentName}
      </DetailRow>
      <DetailRow>
        <strong>Thời gian vắng:</strong>{' '}
        {data.startDate === data.endDate
          ? data.startDate
          : `${data.startDate} — ${data.endDate}`}
      </DetailRow>
      <DetailRow>
        <strong>Lý do:</strong> {data.reason}
      </DetailRow>

      {data.status === 'cho_xu_ly' ? (
        <ActionGroup>
          <ApproveBtn onClick={handleApprove}>Xác nhận cho nghỉ</ApproveBtn>
          <CancelBtn onClick={handleCancel}>Hủy báo vắng</CancelBtn>
        </ActionGroup>
      ) : (
        <ReviewedInfo>
          {data.reviewedBy && (
            <span>
              Người xử lý: {data.reviewedBy} • lúc {data.reviewedAt}
            </span>
          )}
        </ReviewedInfo>
      )}
    </CardContainer>
  );
};
