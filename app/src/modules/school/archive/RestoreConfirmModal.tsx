import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUndo,
  faCheckCircle,
  faExclamationTriangle,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import type { ArchivedStudent } from '@/types/archive';
import { evaluateRestorationClass } from '@/utils/archiveValidation';

interface RestoreConfirmModalProps {
  student: ArchivedStudent | null;
  activeClasses: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestore: (studentId: string) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: modalIn 0.2s ease-out;

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;

  &:hover {
    color: #475569;
    background: #e2e8f0;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const RestoreIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #ecfdf5;
  color: #059669;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 2px solid #a7f3d0;
`;

const ConfirmationPrompt = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
`;

const HighlightName = styled.span`
  color: #0070ce;
`;

const ClassNoticeBox = styled.div<{ $isWarning?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  margin-top: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  ${(props) =>
    props.$isWarning
      ? `
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
  `
      : `
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  `}
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const ConfirmRestoreButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: #059669;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #047857;
    box-shadow: 0 2px 4px rgba(5, 150, 105, 0.25);
  }
`;

export const RestoreConfirmModal: React.FC<RestoreConfirmModalProps> = ({
  student,
  activeClasses,
  isOpen,
  onClose,
  onConfirmRestore,
}) => {
  if (!isOpen || !student) return null;

  const restoration = evaluateRestorationClass(student, activeClasses);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <ModalHeader>
          <ModalTitle>
            <FontAwesomeIcon icon={faUndo} style={{ color: '#059669' }} />
            Xác Nhận Phục Hồi Học Sinh
          </ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <RestoreIconWrapper>
            <FontAwesomeIcon icon={faUndo} />
          </RestoreIconWrapper>

          {/* BR05 Mandatory Prompt */}
          <ConfirmationPrompt>
            Vui lòng xác nhận phục hồi học sinh <HighlightName>{student.fullName}</HighlightName>!
          </ConfirmationPrompt>

          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>
            Học sinh sẽ được đưa trở lại danh sách quản lý học tập chính thức của nhà trường.
          </p>

          {/* K066 Class Continuity Evaluation */}
          {restoration.isClassActive ? (
            <ClassNoticeBox>
              <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#16a34a', marginTop: '2px' }} />
              <div>
                <strong>Lớp tiếp nhận:</strong> Học sinh sẽ được đưa trở lại lớp{' '}
                <strong>{restoration.restoredClassName}</strong> (lớp đang hoạt động trong năm học này).
              </div>
            </ClassNoticeBox>
          ) : (
            <ClassNoticeBox $isWarning>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#d97706', marginTop: '2px' }} />
              <div>
                <strong>Lưu ý xếp lớp:</strong> {restoration.warningMessage}
              </div>
            </ClassNoticeBox>
          )}
        </ModalBody>

        <ModalFooter>
          <CancelButton type="button" onClick={onClose}>
            Hủy
          </CancelButton>
          <ConfirmRestoreButton
            type="button"
            onClick={() => onConfirmRestore(student.id)}
          >
            <FontAwesomeIcon icon={faUndo} />
            <span>Xác nhận phục hồi</span>
          </ConfirmRestoreButton>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
