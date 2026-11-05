import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeDuplicateModal, duplicateExtendedReport } from '../../../store/slices/reportsSlice';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(2px);
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid #E2E8F0;
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F8FAFC;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1E293B;
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: #64748B;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 4px;
    &:hover {
      color: #0F172A;
    }
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RuleBanner = styled.div`
  background-color: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #1E40AF;
  line-height: 1.4;

  strong {
    font-weight: 700;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }
`;

const DisabledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  background-color: #F8FAFC;
  color: #64748B;
  cursor: not-allowed;
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 13px;
  color: #1E293B;
  outline: none;
  background-color: white;

  &:focus {
    border-color: #0070CE;
    box-shadow: 0 0 0 3px rgba(0, 112, 206, 0.15);
  }
`;

const ModalFooter = styled.div`
  padding: 14px 20px;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: #F8FAFC;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  border: 1px solid ${props => (props.$variant === 'primary' ? '#0070CE' : '#CBD5E1')};
  background-color: ${props => (props.$variant === 'primary' ? '#0070CE' : '#FFFFFF')};
  color: ${props => (props.$variant === 'primary' ? '#FFFFFF' : '#334155')};

  &:hover {
    background-color: ${props => (props.$variant === 'primary' ? '#005bb5' : '#F1F5F9')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DuplicateReportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedDuplicateReport = useAppSelector(state => state.reports.selectedDuplicateReport);
  const students = useAppSelector(state => state.reports.studentRoster);

  const [targetStudentId, setTargetStudentId] = useState('');

  if (!selectedDuplicateReport) return null;

  const handleClose = () => {
    dispatch(closeDuplicateModal());
  };

  const handleDuplicate = () => {
    const targetStudent = students.find(s => s.studentId === targetStudentId);
    if (!targetStudent) return;

    dispatch(duplicateExtendedReport({
      sourceReportId: selectedDuplicateReport.id,
      newStudent: {
        id: targetStudent.studentId,
        name: targetStudent.studentName,
        code: targetStudent.studentCode,
        age: '4 tuổi',
        parentName: `PH ${targetStudent.studentName}`,
        avatarUrl: targetStudent.avatarUrl
      },
      newClassId: selectedDuplicateReport.classId,
      newClassName: selectedDuplicateReport.className,
      newStartDate: selectedDuplicateReport.startDate,
      newEndDate: selectedDuplicateReport.endDate
    }));

    alert(`Đã nhân bản thành công phiếu đánh giá sang học sinh ${targetStudent.studentName}! Bản sao mới được lưu ở trạng thái Bản nháp (draft).`);
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalCard onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="dup-title">
        <ModalHeader>
          <h3 id="dup-title">Nhân Bản Mẫu Báo Cáo Mở Rộng</h3>
          <button onClick={handleClose} aria-label="Đóng">&times;</button>
        </ModalHeader>

        <ModalBody>
          <RuleBanner>
            <strong>Quy tắc nhân bản (BR08):</strong> Mẫu báo cáo được giữ cố định theo cấu trúc tiêu chí ban đầu. Bạn chỉ cần chọn học sinh tiếp nhận.
          </RuleBanner>

          <FormGroup>
            <label>Mẫu báo cáo (Cố định):</label>
            <DisabledInput
              disabled
              value={`${selectedDuplicateReport.templateName}`}
            />
          </FormGroup>

          <FormGroup>
            <label>Báo cáo gốc:</label>
            <DisabledInput
              disabled
              value={`${selectedDuplicateReport.studentName} (${selectedDuplicateReport.stageName || `${selectedDuplicateReport.startDate} ~ ${selectedDuplicateReport.endDate}`})`}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="dup-target-student">Học sinh tiếp nhận mới (*):</label>
            <Select
              id="dup-target-student"
              value={targetStudentId}
              onChange={e => setTargetStudentId(e.target.value)}
            >
              <option value="">-- Chọn học sinh tiếp nhận --</option>
              {students
                .filter(s => s.studentId !== selectedDuplicateReport.studentId)
                .map(s => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.studentName} ({s.studentCode})
                  </option>
                ))}
            </Select>
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button $variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            $variant="primary"
            disabled={!targetStudentId}
            onClick={handleDuplicate}
          >
            Tạo Bản Sao Nháp
          </Button>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
