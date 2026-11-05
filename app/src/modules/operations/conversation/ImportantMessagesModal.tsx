import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { dismissImportantAlert } from '../../../store/slices/conversationSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;

  &:hover {
    color: #0f172a;
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  max-height: 400px;
  overflow-y: auto;
`;

const AlertItem = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const Badge = styled.span<{ $type: string }>`
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  background: ${({ $type }) => ($type === 'bao_om' ? '#FEE2E2' : '#FEF3C7')};
  color: ${({ $type }) => ($type === 'bao_om' ? '#991B1B' : '#b45309')};
`;

const AlertTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

const AlertDate = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 2px;
`;

const AlertNote = styled.div`
  font-size: 12px;
  color: #334155;
  background: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  margin-top: 6px;
`;

const DismissBtn = styled.button`
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fca5a5;
  }
`;

const EmptyNotice = styled.div`
  text-align: center;
  padding: 30px;
  color: #94a3b8;
  font-size: 13px;
`;

export const ImportantMessagesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  conversationId,
}) => {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector(
    (state) => state.conversation.importantAlertsByConversation[conversationId] || []
  );

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>
            <span>📌 Tin Nhắn Quan Trọng Đang Diễn Ra</span>
          </Title>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <ModalBody>
          {alerts.length === 0 ? (
            <EmptyNotice>Không có sự kiện quan trọng hoặc báo vắng nào cần lưu ý</EmptyNotice>
          ) : (
            alerts.map((alert) => (
              <AlertItem key={alert.id}>
                <AlertContent>
                  <AlertHeader>
                    <Badge $type={alert.type}>
                      {alert.type === 'bao_om' ? 'Báo ốm' : 'Báo vắng'}
                    </Badge>
                    <AlertTitle>{alert.title}</AlertTitle>
                  </AlertHeader>

                  <AlertDate>
                    <strong>Thời gian:</strong> {alert.dateRange}
                  </AlertDate>

                  {alert.note && <AlertNote>{alert.note}</AlertNote>}
                </AlertContent>

                <DismissBtn
                  onClick={() =>
                    dispatch(dismissImportantAlert({ conversationId, alertId: alert.id }))
                  }
                  title="Xóa sự kiện này"
                >
                  Đóng ✕
                </DismissBtn>
              </AlertItem>
            ))
          )}
        </ModalBody>
      </ModalBox>
    </Overlay>
  );
};
