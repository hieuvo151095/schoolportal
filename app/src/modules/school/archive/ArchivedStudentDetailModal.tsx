import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faLock,
  faUser,
  faCalendarAlt,
  faGraduationCap,
  faPhone,
  faMapMarkerAlt,
  faUndo,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import type { ArchivedStudent } from '@/types/archive';
import { formatArchiveDate, formatGender } from '@/utils/archiveValidation';

interface ArchivedStudentDetailModalProps {
  student: ArchivedStudent | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (student: ArchivedStudent) => void;
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
  max-width: 680px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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

const WarningBanner = styled.div`
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const WarningIcon = styled.div`
  color: #d97706;
  font-size: 1.125rem;
  margin-top: 0.125rem;
`;

const WarningText = styled.div`
  flex: 1;
  font-size: 0.8125rem;
  color: #92400e;
  line-height: 1.4;

  strong {
    display: block;
    font-size: 0.875rem;
    margin-bottom: 0.125rem;
    color: #b45309;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileOverview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
`;

const AvatarContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.75rem;
  font-weight: 600;
  border: 2px solid #cbd5e1;
`;

const ProfileMeta = styled.div`
  flex: 1;
`;

const StudentName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const StudentCodeBadge = styled.span`
  display: inline-block;
  font-family: monospace;
  font-size: 0.8125rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #cbd5e1;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const InfoLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArchiveBox = styled.div`
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

const ArchiveItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.875rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const ArchiveItemLabel = styled.span`
  color: #6b21a8;
  font-weight: 600;
  min-width: 140px;
`;

const ArchiveItemValue = styled.span`
  color: #1e293b;
  flex: 1;
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

const SecondaryButton = styled.button`
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

const RestoreButton = styled.button`
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

export const ArchivedStudentDetailModal: React.FC<ArchivedStudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onRestore,
}) => {
  if (!isOpen || !student) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <ModalHeader>
          <ModalTitle>
            <FontAwesomeIcon icon={faLock} style={{ color: '#d97706' }} />
            Hồ Sơ Học Sinh Lưu Trữ
          </ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Đóng">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </ModalHeader>

        {/* BR03 Authoritative Warning Banner */}
        <WarningBanner>
          <WarningIcon>
            <FontAwesomeIcon icon={faLock} />
          </WarningIcon>
          <WarningText>
            <strong>🔒 Học sinh đã được lưu trữ</strong>
            Hồ sơ học sinh này hiện đang ở trạng thái lưu trữ (cold storage). Các hoạt động học tập,
            điểm danh và học phí đã được khóa. Để tiếp tục ghi nhận thông tin, vui lòng phục hồi học sinh.
          </WarningText>
        </WarningBanner>

        <ModalBody>
          <ProfileOverview>
            <AvatarContainer>
              {student.fullName ? student.fullName.charAt(0) : <FontAwesomeIcon icon={faUser} />}
            </AvatarContainer>
            <ProfileMeta>
              <StudentName>{student.fullName}</StudentName>
              <StudentCodeBadge>{student.studentCode}</StudentCodeBadge>
              {student.nickname && (
                <span style={{ marginLeft: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                  (Tên gọi: {student.nickname})
                </span>
              )}
            </ProfileMeta>
          </ProfileOverview>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>Ngày sinh</InfoLabel>
              <InfoValue>{formatArchiveDate(student.dateOfBirth)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Giới tính</InfoLabel>
              <InfoValue>{formatGender(student.gender)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Lớp trước khi lưu trữ</InfoLabel>
              <InfoValue>{student.formerClassName || '—'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Phụ huynh / Liên hệ</InfoLabel>
              <InfoValue>
                {student.parentName || '—'}
                {student.parentPhone && ` (${student.parentPhone})`}
              </InfoValue>
            </InfoItem>
            <InfoItem style={{ gridColumn: 'span 2' }}>
              <InfoLabel>Địa chỉ cư trú</InfoLabel>
              <InfoValue>{student.address || '—'}</InfoValue>
            </InfoItem>
          </InfoGrid>

          <SectionTitle>
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#7c3aed' }} />
            Thông Tin Lưu Trữ
          </SectionTitle>

          <ArchiveBox>
            <ArchiveItemRow>
              <ArchiveItemLabel>Ngày lưu trữ:</ArchiveItemLabel>
              <ArchiveItemValue>{formatArchiveDate(student.archiveDate)}</ArchiveItemValue>
            </ArchiveItemRow>
            <ArchiveItemRow>
              <ArchiveItemLabel>Lưu trữ bởi:</ArchiveItemLabel>
              <ArchiveItemValue>
                {student.archivedBy ? (
                  <span>
                    <strong>{student.archivedBy.name}</strong>
                    {student.archivedBy.role && ` (${student.archivedBy.role})`}
                  </span>
                ) : (
                  <span style={{ color: '#94a3b8' }}>—</span>
                )}
              </ArchiveItemValue>
            </ArchiveItemRow>
            <ArchiveItemRow>
              <ArchiveItemLabel>Lý do lưu trữ:</ArchiveItemLabel>
              <ArchiveItemValue>{student.archiveReason || 'Chưa ghi nhận'}</ArchiveItemValue>
            </ArchiveItemRow>
            <ArchiveItemRow>
              <ArchiveItemLabel>Ghi chú lưu trữ:</ArchiveItemLabel>
              <ArchiveItemValue style={{ fontStyle: student.archiveNote ? 'normal' : 'italic' }}>
                {student.archiveNote || 'Không có ghi chú bổ sung'}
              </ArchiveItemValue>
            </ArchiveItemRow>
          </ArchiveBox>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton type="button" onClick={onClose}>
            Đóng
          </SecondaryButton>
          <RestoreButton
            type="button"
            onClick={() => {
              onClose();
              onRestore(student);
            }}
          >
            <FontAwesomeIcon icon={faUndo} />
            <span>Phục hồi học sinh</span>
          </RestoreButton>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
