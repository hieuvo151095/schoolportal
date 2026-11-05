import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUserTie,
  faPhone,
  faEnvelope,
  faIdBadge,
} from '@fortawesome/free-solid-svg-icons';
import type { ArchiveStaffOperator } from '@/types/archive';

interface ArchiveStaffModalProps {
  staff: ArchiveStaffOperator | null;
  isOpen: boolean;
  onClose: () => void;
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
  max-width: 440px;
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

const StaffAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #eff6ff;
  color: #0070ce;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 2px solid #bfdbfe;
`;

const StaffName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const StaffRole = styled.div`
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
  margin-bottom: 1.25rem;
`;

const ContactList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  color: #1e293b;
`;

const ContactIcon = styled.div`
  color: #0070ce;
  width: 16px;
  display: flex;
  justify-content: center;
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  justify-content: flex-end;
`;

const CloseActionButton = styled.button`
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: #0070ce;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #005bb0;
  }
`;

export const ArchiveStaffModal: React.FC<ArchiveStaffModalProps> = ({
  staff,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !staff) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <ModalHeader>
          <ModalTitle>
            <FontAwesomeIcon icon={faUserTie} style={{ color: '#0070ce' }} />
            Người Thực Hiện Lưu Trữ
          </ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <StaffAvatar>
            <FontAwesomeIcon icon={faUserTie} />
          </StaffAvatar>

          <StaffName>{staff.name}</StaffName>
          <StaffRole>{staff.role || 'Cán bộ nhà trường'}</StaffRole>

          <ContactList>
            {staff.code && (
              <ContactItem>
                <ContactIcon>
                  <FontAwesomeIcon icon={faIdBadge} />
                </ContactIcon>
                <span>Mã nhân sự: <strong>{staff.code}</strong></span>
              </ContactItem>
            )}
            {staff.phone && (
              <ContactItem>
                <ContactIcon>
                  <FontAwesomeIcon icon={faPhone} />
                </ContactIcon>
                <span>Điện thoại: <strong>{staff.phone}</strong></span>
              </ContactItem>
            )}
            {staff.email && (
              <ContactItem>
                <ContactIcon>
                  <FontAwesomeIcon icon={faEnvelope} />
                </ContactIcon>
                <span>Email: <strong>{staff.email}</strong></span>
              </ContactItem>
            )}
          </ContactList>
        </ModalBody>

        <ModalFooter>
          <CloseActionButton type="button" onClick={onClose}>
            Đóng
          </CloseActionButton>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
