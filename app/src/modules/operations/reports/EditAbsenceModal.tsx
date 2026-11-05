import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeAbsenceEditModal, updateAbsenceRecord } from '../../../store/slices/reportsSlice';
import { AttendanceDayStatus } from '../../../types/reports';

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
  max-width: 460px;
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

const StudentInfoBanner = styled.div`
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: #1E40AF;

  .name {
    font-weight: 700;
  }
  .date {
    margin-top: 2px;
    color: #3B82F6;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }
`;

const RadioOptions = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioOption = styled.label<{ $checked: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1.5px solid ${props => (props.$checked ? '#0070CE' : '#CBD5E1')};
  background-color: ${props => (props.$checked ? '#F0F7FF' : '#FFFFFF')};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${props => (props.$checked ? '#0070CE' : '#475569')};
  transition: all 0.15s ease;

  input {
    accent-color: #0070CE;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #CBD5E1;
  border-radius: 8px;
  font-size: 13px;
  color: #1E293B;
  outline: none;
  resize: vertical;
  min-height: 80px;

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
`;

export const EditAbsenceModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedAbsenceEdit = useAppSelector(state => state.reports.selectedAbsenceEdit);

  const [status, setStatus] = useState<AttendanceDayStatus>('absent_excused');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (selectedAbsenceEdit) {
      setStatus(
        selectedAbsenceEdit.record.status === 'absent_unexcused'
          ? 'absent_unexcused'
          : 'absent_excused'
      );
      setReason(selectedAbsenceEdit.record.notes || '');
    }
  }, [selectedAbsenceEdit]);

  if (!selectedAbsenceEdit) return null;

  const handleClose = () => {
    dispatch(closeAbsenceEditModal());
  };

  const handleSave = () => {
    dispatch(updateAbsenceRecord({
      studentId: selectedAbsenceEdit.studentId,
      date: selectedAbsenceEdit.record.date,
      status,
      notes: reason.trim() || undefined
    }));
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalCard onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-absence-title">
        <ModalHeader>
          <h3 id="edit-absence-title">Thay Đổi Trạng Thái Vắng</h3>
          <button onClick={handleClose} aria-label="Đóng">&times;</button>
        </ModalHeader>

        <ModalBody>
          <StudentInfoBanner>
            <div className="name">{selectedAbsenceEdit.studentName}</div>
            <div className="date">Ngày: {selectedAbsenceEdit.record.date} ({selectedAbsenceEdit.record.weekday})</div>
          </StudentInfoBanner>

          <FormGroup>
            <label>Phân loại vắng:</label>
            <RadioOptions>
              <RadioOption $checked={status === 'absent_excused'}>
                <input
                  type="radio"
                  name="absence-status"
                  value="absent_excused"
                  checked={status === 'absent_excused'}
                  onChange={() => setStatus('absent_excused')}
                />
                Có phép (P)
              </RadioOption>
              <RadioOption $checked={status === 'absent_unexcused'}>
                <input
                  type="radio"
                  name="absence-status"
                  value="absent_unexcused"
                  checked={status === 'absent_unexcused'}
                  onChange={() => setStatus('absent_unexcused')}
                />
                Không phép (KP)
              </RadioOption>
            </RadioOptions>
          </FormGroup>

          <FormGroup>
            <label htmlFor="absence-notes">Lý do nghỉ / Ghi chú:</label>
            <Textarea
              id="absence-notes"
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Nhập lý do xin nghỉ hoặc ghi chú của giáo viên..."
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button $variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button $variant="primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};
