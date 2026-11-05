import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { AcademicYear, AcademicYearFormData } from '@/types/academicYear';
import { validateAcademicYearForm } from '@/utils/academicYearValidation';

interface AcademicYearModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: AcademicYear | null;
  onClose: () => void;
  onSubmit: (formData: AcademicYearFormData) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  animation: modalFadeIn 0.2s ease-out;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  color: #94a3b8;
  background: none;
  border: none;
  padding: 0.375rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;

  &:hover {
    color: #475569;
    background-color: #e2e8f0;
  }
`;

const ModalBody = styled.form`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;

  span.required {
    color: #ef4444;
    margin-left: 0.25rem;
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #0070ce;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DateInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #0f172a;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#ef4444' : '#cbd5e1')};
  border-radius: 0.5rem;
  background-color: white;
  transition: all 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ $hasError }) => ($hasError ? '#ef4444' : '#0070ce')};
    box-shadow: 0 0 0 3px ${({ $hasError }) => ($hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 112, 206, 0.15)')};
  }
`;

const ErrorText = styled.p`
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0;
  margin-top: 0.25rem;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
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
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: ${({ disabled }) => (disabled ? '#94a3b8' : '#0070ce')};
  border: none;
  border-radius: 0.5rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #005bb0;
    box-shadow: 0 2px 4px rgba(0, 112, 206, 0.25);
  }
`;

export const AcademicYearModal: React.FC<AcademicYearModalProps> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<AcademicYearFormData>({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [touched, setTouched] = useState<{ [K in keyof AcademicYearFormData]?: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: initialData.name || '',
          startDate: initialData.startDate || '',
          endDate: initialData.endDate || '',
        });
      } else {
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
        });
      }
      setTouched({});
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const validationResult = validateAcademicYearForm(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationResult.isValid) return;
    onSubmit(formData);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600" />
            <span>{mode === 'create' ? 'Tạo năm học mới' : 'Chỉnh sửa năm học'}</span>
          </ModalTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Đóng modal">
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </ModalHeader>

        <ModalBody onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="ay-name">
              Tên năm học <span className="required">*</span>
            </Label>
            <TextInput
              id="ay-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => setTouched({ ...touched, name: true })}
              placeholder="VD: Năm học 2026 - 2027 hoặc Kỳ 1 năm học 2026 - 2027"
              autoFocus
            />
            {touched.name && validationResult.errors.name && (
              <ErrorText>{validationResult.errors.name}</ErrorText>
            )}
          </FormGroup>

          <DateGrid>
            <FormGroup>
              <Label htmlFor="ay-start-date">
                Ngày bắt đầu <span className="required">*</span>
              </Label>
              <DateInput
                id="ay-start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                onBlur={() => setTouched({ ...touched, startDate: true })}
                $hasError={Boolean(touched.startDate && validationResult.errors.startDate)}
              />
              {touched.startDate && validationResult.errors.startDate && (
                <ErrorText>{validationResult.errors.startDate}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="ay-end-date">
                Ngày kết thúc <span className="required">*</span>
              </Label>
              <DateInput
                id="ay-end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                onBlur={() => setTouched({ ...touched, endDate: true })}
                $hasError={Boolean(touched.endDate && validationResult.errors.endDate)}
              />
              {touched.endDate && validationResult.errors.endDate && (
                <ErrorText>{validationResult.errors.endDate}</ErrorText>
              )}
            </FormGroup>
          </DateGrid>

          {/* Minimalist 3-field modal invariant: Strictly NO manual "Hiện tại" toggle (K059, K062) */}

          <ModalFooter>
            <CancelButton type="button" onClick={onClose}>
              Hủy
            </CancelButton>
            <SubmitButton
              type="submit"
              disabled={!validationResult.isValid}
            >
              {mode === 'create' ? 'Thêm' : 'Cập nhật'}
            </SubmitButton>
          </ModalFooter>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};
