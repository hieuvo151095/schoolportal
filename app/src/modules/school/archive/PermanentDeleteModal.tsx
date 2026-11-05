import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faTrashAlt,
  faExclamationTriangle,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import type { ArchivedStudent } from '@/types/archive';

interface PermanentDeleteModalProps {
  student: ArchivedStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPurge: (studentId: string) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid #fee2e2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fef2f2;
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #991b1b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #991b1b;
  font-size: 1.125rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;

  &:hover {
    background: #fecaca;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HazardIconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 2px solid #fecaca;
  animation: pulse 2s infinite ease-in-out;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const ConfirmationPrompt = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
`;

const HighlightName = styled.span`
  color: #dc2626;
`;

const IrreversibleWarningBox = styled.div`
  width: 100%;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1.25rem;
  text-align: left;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #9f1239;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #334155;
  cursor: pointer;
  user-select: none;
  text-align: left;
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background 0.15s ease;

  &:hover {
    background: #f8fafc;
  }

  input[type='checkbox'] {
    width: 1.125rem;
    height: 1.125rem;
    accent-color: #dc2626;
    cursor: pointer;
  }
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

const ConfirmPurgeButton = styled.button<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: ${(props) => (props.$disabled ? '#94a3b8' : '#dc2626')};
  border: none;
  border-radius: 0.5rem;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.15s ease;

  ${(props) =>
    !props.$disabled &&
    `
    &:hover {
      background: #b91c1c;
      box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
    }
  `}
`;

export const PermanentDeleteModal: React.FC<PermanentDeleteModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirmPurge,
}) => {
  const [isAffirmed, setIsAffirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAffirmed(false);
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <ModalHeader>
          <ModalTitle>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            Cảnh Báo Xoá Vĩnh Viễn (Purge)
          </ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <HazardIconWrapper>
            <FontAwesomeIcon icon={faTrashAlt} />
          </HazardIconWrapper>

          {/* BR06 Mandatory Prompt */}
          <ConfirmationPrompt>
            Vui lòng xác nhận xoá học sinh <HighlightName>{student.fullName}</HighlightName>!
          </ConfirmationPrompt>

          {/* K065 Irreversible Purge Warning */}
          <IrreversibleWarningBox>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ color: '#e11d48', marginTop: '2px', fontSize: '1rem' }}
            />
            <div>
              <strong>Cảnh báo quan trọng:</strong> Hành động này sẽ xoá hoàn toàn hồ sơ lưu trữ của học sinh{' '}
              <strong>{student.fullName}</strong> (Mã: {student.studentCode}) khỏi cơ sở dữ liệu hệ thống.
              Dữ liệu sau khi xoá <strong>KHÔNG THỂ KHÔI PHỤC</strong> trong bất kỳ trường hợp nào!
            </div>
          </IrreversibleWarningBox>

          <CheckboxLabel>
            <input
              type="checkbox"
              checked={isAffirmed}
              onChange={(e) => setIsAffirmed(e.target.checked)}
              id="affirm-purge-checkbox"
            />
            <span>Tôi đã hiểu rõ và xác nhận xóa vĩnh viễn học sinh này.</span>
          </CheckboxLabel>
        </ModalBody>

        <ModalFooter>
          <CancelButton type="button" onClick={onClose}>
            Hủy
          </CancelButton>
          <ConfirmPurgeButton
            type="button"
            $disabled={!isAffirmed}
            disabled={!isAffirmed}
            onClick={() => onConfirmPurge(student.id)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>Xoá vĩnh viễn</span>
          </ConfirmPurgeButton>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
